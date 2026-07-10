/**
 * Topic.TSQL_ETL_PROC — SQL for Data Engineering (T-SQL). FIRST-CLASS topic.
 * Pillar 6 (ELT & Transformation): the stored proc that loads
 * staging → target via MERGE, wrapped in BEGIN TRAN + TRY…CATCH.
 * Advanced: incremental high-watermark load, SCD2 merge proc, run-logging,
 * idempotent re-run, TRUNCATE+reload vs MERGE.
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const tsql_etl_proc_questions: Question[] = [
  {
    id: 'tsql-etlproc-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_ETL_PROC,
    course: Course.SQL,
    question: 'Why is the staging → target load wrapped in a stored procedure with `BEGIN TRAN` + `TRY…CATCH` rather than run as loose statements?',
    options: [
      { id: 'a', text: 'It makes the whole load atomic and re-raisable: all writes commit together or roll back on error, and the proc is a single named, schedulable, permission-grantable unit.', isCorrect: true },
      { id: 'b', text: 'It makes the load run without writing to the transaction log, so it is always faster.', isCorrect: false },
      { id: 'c', text: 'It is only a style preference; loose statements behave identically in every failure case.', isCorrect: false },
      { id: 'd', text: 'It lets the load skip constraint checks that loose statements would enforce.', isCorrect: false },
    ],
    explanation: 'Wrapping the load gives it atomicity (transaction), structured failure handling (TRY…CATCH rolls back and re-throws), and a single named entry point a scheduler can call with the right permissions. A half-applied load — dimension updated but fact not — is exactly what the transaction prevents.',
    hints: ['Atomic + re-raisable + one schedulable unit', 'Transaction prevents a half-applied load'],
    tags: ['tsql', 'etl-proc', 'transactions', 'try-catch'],
  },
  {
    id: 'tsql-etlproc-mcq-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TSQL_ETL_PROC,
    course: Course.SQL,
    question: 'What makes an ELT load procedure "idempotent", and why does it matter?',
    options: [
      { id: 'a', text: 'Re-running it with the same input produces the same final state (no duplicates, no double-counting) — vital because schedulers retry and pipelines re-run after failures.', isCorrect: true },
      { id: 'b', text: 'It can only ever be run once; a second run raises an error to block duplicates.', isCorrect: false },
      { id: 'c', text: 'It runs faster on every subsequent execution by caching its results permanently.', isCorrect: false },
      { id: 'd', text: 'It automatically deletes the source data after loading so it cannot be processed twice.', isCorrect: false },
    ],
    explanation: 'Idempotence = running the load again lands you in the same state, not a doubled one. Because orchestrators retry on transient failures, a blind `INSERT…SELECT` would duplicate rows on re-run. `MERGE` (upsert on a key) or TRUNCATE+reload makes the load safe to repeat.',
    hints: ['Re-run → same result, no duplicates', 'Schedulers retry, so loads must be safe to repeat'],
    tags: ['tsql', 'etl-proc', 'idempotency'],
  },
  {
    id: 'tsql-etlproc-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_ETL_PROC,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the proc header and the transaction control around the MERGE load.',
    template: `CREATE ___ dbo.LoadDimCustomer
AS
BEGIN
    SET XACT_ABORT ON;
    BEGIN TRY
        BEGIN ___;
            MERGE dbo.DimCustomer AS tgt
            USING stg.Customer AS src
                ON tgt.CustomerId = src.CustomerId
            WHEN MATCHED THEN UPDATE SET tgt.FullName = src.FullName
            WHEN NOT MATCHED BY TARGET THEN
                INSERT (CustomerId, FullName) VALUES (src.CustomerId, src.FullName);
        ___;
    END TRY
    BEGIN CATCH
        ROLLBACK;
        THROW;
    END CATCH
END;`,
    blanks: ['PROCEDURE', 'TRAN', 'COMMIT'],
    solution: `CREATE PROCEDURE dbo.LoadDimCustomer
AS
BEGIN
    SET XACT_ABORT ON;
    BEGIN TRY
        BEGIN TRAN;
            MERGE dbo.DimCustomer AS tgt
            USING stg.Customer AS src
                ON tgt.CustomerId = src.CustomerId
            WHEN MATCHED THEN UPDATE SET tgt.FullName = src.FullName
            WHEN NOT MATCHED BY TARGET THEN
                INSERT (CustomerId, FullName) VALUES (src.CustomerId, src.FullName);
        COMMIT;
    END TRY
    BEGIN CATCH
        ROLLBACK;
        THROW;
    END CATCH
END;`,
    blankAlternates: [['PROC'], ['TRANSACTION'], []],
    explanation: 'This is the canonical load proc shape: `CREATE PROCEDURE … AS BEGIN`, `SET XACT_ABORT ON`, then `BEGIN TRAN` → `MERGE` → `COMMIT` inside a TRY, with the CATCH rolling back and re-throwing. The MERGE makes it idempotent; the transaction makes it atomic.',
    hints: ['CREATE PROCEDURE / PROC', 'BEGIN TRAN … COMMIT around the MERGE'],
    tags: ['tsql', 'etl-proc', 'merge', 'transactions', 'cloze'],
  },
  {
    id: 'tsql-etlproc-parsons-1',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TSQL_ETL_PROC,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Assemble the body of an incremental high-watermark load: read the last loaded watermark into a variable, insert only newer staging rows, then advance the stored watermark. Order: declare & read the watermark, INSERT…SELECT of rows past it, then UPDATE the control row to the new max.',
    correctOrder: [
      'DECLARE @lastLoaded DATETIME2;',
      'SELECT @lastLoaded = LastLoadedAt FROM dbo.EtlControl WHERE TableName = \'FactSales\';',
      'INSERT INTO dbo.FactSales (OrderId, Amount, UpdatedAt)',
      'SELECT s.OrderId, s.Amount, s.UpdatedAt',
      'FROM stg.Sales AS s',
      'WHERE s.UpdatedAt > @lastLoaded;',
      'UPDATE dbo.EtlControl',
      'SET LastLoadedAt = (SELECT MAX(UpdatedAt) FROM dbo.FactSales)',
      'WHERE TableName = \'FactSales\';',
    ],
    distractorLines: [
      'WHERE s.UpdatedAt < @lastLoaded;',
      'TRUNCATE TABLE dbo.FactSales;',
      'SET LastLoadedAt = GETDATE()',
    ],
    solution: `DECLARE @lastLoaded DATETIME2;
SELECT @lastLoaded = LastLoadedAt FROM dbo.EtlControl WHERE TableName = 'FactSales';
INSERT INTO dbo.FactSales (OrderId, Amount, UpdatedAt)
SELECT s.OrderId, s.Amount, s.UpdatedAt
FROM stg.Sales AS s
WHERE s.UpdatedAt > @lastLoaded;
UPDATE dbo.EtlControl
SET LastLoadedAt = (SELECT MAX(UpdatedAt) FROM dbo.FactSales)
WHERE TableName = 'FactSales';`,
    explanation: 'An incremental load reads the stored high-watermark, pulls only staging rows newer than it (`UpdatedAt > @lastLoaded`), then advances the watermark to the new maximum. Advancing from the actual loaded MAX (not GETDATE()) keeps it correct if rows arrive slightly late; `< @lastLoaded` would reprocess old rows and skip new ones.',
    hints: ['Read watermark → load rows past it → advance watermark', 'Filter UpdatedAt > @lastLoaded, advance to MAX(loaded)'],
    tags: ['tsql', 'etl-proc', 'incremental', 'watermark', 'parsons'],
  },
  {
    id: 'tsql-etlproc-mcq-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TSQL_ETL_PROC,
    course: Course.SQL,
    question: 'When is TRUNCATE + full reload a better load strategy than an incremental MERGE?',
    options: [
      { id: 'a', text: 'When the table is small-to-moderate and the source has no reliable change marker — a full rebuild is simpler and guaranteed-correct, avoiding fragile incremental logic.', isCorrect: true },
      { id: 'b', text: 'Always — TRUNCATE + reload is faster than MERGE in every situation regardless of table size.', isCorrect: false },
      { id: 'c', text: 'Only when you need to preserve historical versions, since TRUNCATE keeps old rows.', isCorrect: false },
      { id: 'd', text: 'Never — a full reload can never produce a correct result.', isCorrect: false },
    ],
    explanation: 'TRUNCATE+reload trades I/O for simplicity: with no dependable change column or a manageable row count, rebuilding the whole table each run is easy to reason about and inherently idempotent. MERGE/incremental wins once the table is large enough that reprocessing everything is too costly — and it is required when you must preserve history (SCD2).',
    hints: ['Small/moderate table, no reliable change marker → full reload', 'Large table or history needed → incremental/MERGE'],
    tags: ['tsql', 'etl-proc', 'truncate-reload', 'tradeoffs'],
  },
  {
    id: 'tsql-etlproc-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TSQL_ETL_PROC,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Write a load procedure `dbo.LoadDimProduct` that, with `SET XACT_ABORT ON`, in a TRY block opens a transaction, MERGEs `dbo.DimProduct` from `stg.Product` on `ProductCode` (WHEN MATCHED update `ProductName`; WHEN NOT MATCHED BY TARGET insert `ProductCode`, `ProductName`), then commits. In the CATCH, roll back and re-throw with THROW.',
    starterCode: `-- CREATE PROCEDURE dbo.LoadDimProduct AS BEGIN ... END
`,
    testCases: [
      {
        input: 'Proc: SET XACT_ABORT ON; TRY BEGIN TRAN; MERGE; COMMIT; CATCH ROLLBACK; THROW',
        expectedOutput: 'Atomic, idempotent staging→target load procedure',
        description: 'Staging→target MERGE load proc with transaction + error handling',
      },
    ],
    solution: `CREATE PROCEDURE dbo.LoadDimProduct
AS
BEGIN
    SET XACT_ABORT ON;
    BEGIN TRY
        BEGIN TRAN;
            MERGE dbo.DimProduct AS tgt
            USING stg.Product AS src
                ON tgt.ProductCode = src.ProductCode
            WHEN MATCHED THEN
                UPDATE SET tgt.ProductName = src.ProductName
            WHEN NOT MATCHED BY TARGET THEN
                INSERT (ProductCode, ProductName)
                VALUES (src.ProductCode, src.ProductName);
        COMMIT;
    END TRY
    BEGIN CATCH
        ROLLBACK;
        THROW;
    END CATCH
END;`,
    explanation: 'This is the topic\'s keystone: a single procedure that loads staging into the target via an idempotent `MERGE` (safe to retry), made atomic by `BEGIN TRAN … COMMIT`, with `SET XACT_ABORT ON` and a `ROLLBACK`/`THROW` CATCH so any failure undoes the partial load and surfaces the error to the scheduler. Every production warehouse load follows this shape.',
    hints: ['SET XACT_ABORT ON, then TRY: BEGIN TRAN → MERGE → COMMIT', 'CATCH: ROLLBACK then THROW'],
    tags: ['tsql', 'etl-proc', 'merge', 'transactions', 'try-catch'],
  },
  {
    id: 'tsql-etlproc-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TSQL_ETL_PROC,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Write the body of an incremental load: declare `@lastLoaded DATETIME2`, read it from `dbo.EtlControl` (WHERE `TableName = \'FactSales\'` into the variable from column `LastLoadedAt`), INSERT into `dbo.FactSales (OrderId, Amount, UpdatedAt)` the rows from `stg.Sales` whose `UpdatedAt` is greater than `@lastLoaded`, then UPDATE `dbo.EtlControl.LastLoadedAt` to `MAX(UpdatedAt)` from `dbo.FactSales` for that table.',
    starterCode: `-- DECLARE @lastLoaded DATETIME2; SELECT @lastLoaded = ...; INSERT ... WHERE UpdatedAt > @lastLoaded; UPDATE dbo.EtlControl ...
`,
    testCases: [
      {
        input: 'Read watermark, insert rows past it, advance watermark to MAX loaded',
        expectedOutput: 'Incremental high-watermark load',
        description: 'High-watermark incremental load body',
      },
    ],
    solution: `DECLARE @lastLoaded DATETIME2;
SELECT @lastLoaded = LastLoadedAt
FROM dbo.EtlControl
WHERE TableName = 'FactSales';

INSERT INTO dbo.FactSales (OrderId, Amount, UpdatedAt)
SELECT s.OrderId, s.Amount, s.UpdatedAt
FROM stg.Sales AS s
WHERE s.UpdatedAt > @lastLoaded;

UPDATE dbo.EtlControl
SET LastLoadedAt = (SELECT MAX(UpdatedAt) FROM dbo.FactSales)
WHERE TableName = 'FactSales';`,
    explanation: 'The high-watermark pattern: load only rows newer than the last recorded watermark (`UpdatedAt > @lastLoaded`), then advance the watermark to the new maximum actually loaded. Reading and storing the watermark in a control table makes each run process just the delta — the standard way to load a large, append-heavy fact incrementally.',
    hints: ['Read @lastLoaded from EtlControl', 'INSERT rows WHERE UpdatedAt > @lastLoaded, then advance LastLoadedAt to MAX'],
    tags: ['tsql', 'etl-proc', 'incremental', 'watermark'],
  },
];
