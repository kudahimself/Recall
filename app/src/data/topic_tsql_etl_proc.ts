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
    template: `-- dbo.DimCustomer(CustomerKey, CustomerId, FullName, Email, City, Country, SignupDate)
-- stg.Customer(CustomerId, FullName, Email, City, UpdatedAt)
CREATE ___ dbo.LoadDimCustomer
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
    id: 'tsql-etlproc-runlog-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TSQL_ETL_PROC,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: "Fill in the function that captures how many rows the MERGE just affected, and the status value logged on success.",
    template: `-- dbo.DimProduct(ProductKey, ProductCode, ProductName, Category, Price)
-- stg.Product(ProductCode, ProductName, Category, Price)
MERGE dbo.DimProduct AS tgt
USING stg.Product AS src
    ON tgt.ProductCode = src.ProductCode
WHEN MATCHED THEN UPDATE SET tgt.ProductName = src.ProductName
WHEN NOT MATCHED BY TARGET THEN
    INSERT (ProductCode, ProductName) VALUES (src.ProductCode, src.ProductName);

DECLARE @rows INT = ___;
INSERT INTO dbo.EtlRunLog (ProcName, RunAt, RowsAffected, Status)
VALUES ('LoadDimProduct', GETDATE(), @rows, ___);`,
    blanks: ['@@ROWCOUNT', "'SUCCESS'"],
    solution: `MERGE dbo.DimProduct AS tgt
USING stg.Product AS src
    ON tgt.ProductCode = src.ProductCode
WHEN MATCHED THEN UPDATE SET tgt.ProductName = src.ProductName
WHEN NOT MATCHED BY TARGET THEN
    INSERT (ProductCode, ProductName) VALUES (src.ProductCode, src.ProductName);

DECLARE @rows INT = @@ROWCOUNT;
INSERT INTO dbo.EtlRunLog (ProcName, RunAt, RowsAffected, Status)
VALUES ('LoadDimProduct', GETDATE(), @rows, 'SUCCESS');`,
    explanation: '`@@ROWCOUNT` returns the number of rows affected by the immediately preceding statement (here, the MERGE\'s total inserts+updates) - capture it into a variable right away, since the next statement resets it. Logging ProcName/RunAt/RowsAffected/Status to a run-log table gives every load a record you can audit or alert on when a run processes an unexpectedly low (or zero) row count.',
    hints: ['Rows touched by the last statement: @@ROWCOUNT', 'Capture it immediately - the next statement overwrites it'],
    tags: ['tsql', 'etl-proc', 'run-logging', 'rowcount', 'cloze'],
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
    tieredHints: {
      apiSignature: 'BEGIN TRY BEGIN TRAN; <stmt>; COMMIT; END TRY BEGIN CATCH ROLLBACK; THROW; END CATCH',
      skeleton: `CREATE PROCEDURE dbo.LoadDimProduct
AS
BEGIN
    SET XACT_ABORT ON;
    ____ TRY
        ____ TRAN;
            ____ dbo.DimProduct AS tgt
            ____ stg.Product AS src
                ____ tgt.ProductCode = src.ProductCode
            ____ MATCHED THEN
                ____ SET tgt.ProductName = src.ProductName
            ____ NOT MATCHED BY TARGET THEN
                ____ (ProductCode, ProductName)
                ____ (src.ProductCode, src.ProductName);
        ____;
    END TRY
    ____ CATCH
        ____;
        ____;
    END CATCH
END;`,
    },
    explanation: 'This is the topic\'s keystone: a single procedure that loads staging into the target via an idempotent `MERGE` (safe to retry), made atomic by `BEGIN TRAN … COMMIT`, with `SET XACT_ABORT ON` and a `ROLLBACK`/`THROW` CATCH so any failure undoes the partial load and surfaces the error to the scheduler. Every production warehouse load follows this shape.',
    hints: ['SET XACT_ABORT ON, then TRY: BEGIN TRAN → MERGE → COMMIT', 'CATCH: ROLLBACK then THROW'],
    requires: [/CREATE\s+PROCEDURE/i],
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
    tieredHints: {
      apiSignature: 'DECLARE @v type; SELECT @v = col FROM tbl WHERE cond; INSERT INTO tbl SELECT ... WHERE col > @v; UPDATE tbl SET col = (SELECT MAX(col) FROM tbl) WHERE cond;',
      skeleton: `DECLARE @lastLoaded ____;
SELECT @lastLoaded = ____
FROM ____
WHERE TableName = ____;

____ INTO dbo.FactSales (____)
SELECT ____
FROM ____ AS s
WHERE s.UpdatedAt ____ @lastLoaded;

UPDATE dbo.EtlControl
____ LastLoadedAt = (SELECT ____(UpdatedAt) FROM ____)
WHERE TableName = ____;`,
    },
    explanation: 'The high-watermark pattern: load only rows newer than the last recorded watermark (`UpdatedAt > @lastLoaded`), then advance the watermark to the new maximum actually loaded. Reading and storing the watermark in a control table makes each run process just the delta — the standard way to load a large, append-heavy fact incrementally.',
    hints: ['Read @lastLoaded from EtlControl', 'INSERT rows WHERE UpdatedAt > @lastLoaded, then advance LastLoadedAt to MAX'],
    requires: [/INSERT\s+INTO/i, /UPDATE/i],
    tags: ['tsql', 'etl-proc', 'incremental', 'watermark'],
  },
  {
    id: 'tsql-etlproc-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TSQL_ETL_PROC,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: "Write a load procedure `dbo.LoadDimCustomerSCD2` that performs a Type 2 SCD load of `dbo.DimCustomer` (CustomerId, City, EffectiveDate, EndDate, IsCurrent) from `stg.Customer` (CustomerId, City), inside a transaction with SET XACT_ABORT ON and TRY/CATCH. First expire the current row (EndDate = CAST(GETDATE() AS DATE), IsCurrent = 0) for any CustomerId whose City no longer matches its current row. Then insert a new current row (EffectiveDate = today, EndDate = NULL, IsCurrent = 1) for every CustomerId in staging that has no current row afterward - this covers both brand-new customers and ones whose row was just expired. Commit at the end; in the CATCH, roll back and re-throw.",
    starterCode: `-- Type 2 SCD load: expire changed rows, then insert new/changed versions, all inside a transaction
`,
    testCases: [
      {
        input: 'Proc: SET XACT_ABORT ON; TRY BEGIN TRAN; expire-UPDATE; insert-new-version; COMMIT; CATCH ROLLBACK; THROW',
        expectedOutput: 'Atomic SCD Type 2 load: closes changed rows, inserts new current versions',
        description: 'SCD2 merge-style load procedure',
      },
    ],
    solution: `CREATE PROCEDURE dbo.LoadDimCustomerSCD2
AS
BEGIN
    SET XACT_ABORT ON;
    BEGIN TRY
        BEGIN TRAN;
            UPDATE tgt
                SET tgt.EndDate = CAST(GETDATE() AS DATE), tgt.IsCurrent = 0
            FROM dbo.DimCustomer AS tgt
                JOIN stg.Customer AS src ON src.CustomerId = tgt.CustomerId
            WHERE tgt.IsCurrent = 1 AND tgt.City <> src.City;

            INSERT INTO dbo.DimCustomer (CustomerId, City, EffectiveDate, EndDate, IsCurrent)
            SELECT src.CustomerId, src.City, CAST(GETDATE() AS DATE), NULL, 1
            FROM stg.Customer AS src
            WHERE NOT EXISTS (
                SELECT 1 FROM dbo.DimCustomer AS tgt
                WHERE tgt.CustomerId = src.CustomerId
                  AND tgt.IsCurrent = 1
            );
        COMMIT;
    END TRY
    BEGIN CATCH
        ROLLBACK;
        THROW;
    END CATCH
END;`,
    tieredHints: {
      apiSignature: 'UPDATE tgt SET col = expr FROM tbl AS tgt JOIN src ON cond WHERE cond; INSERT INTO tbl (cols) SELECT ... WHERE NOT EXISTS (SELECT 1 FROM tbl WHERE cond);',
      skeleton: `CREATE PROCEDURE dbo.LoadDimCustomerSCD2
AS
BEGIN
    SET XACT_ABORT ON;
    ____ TRY
        ____ TRAN;
            UPDATE tgt
                ____ tgt.EndDate = ____(GETDATE() AS DATE), tgt.IsCurrent = 0
            FROM dbo.DimCustomer AS tgt
                ____ stg.Customer AS src ____ src.CustomerId = tgt.CustomerId
            WHERE tgt.IsCurrent = 1 ____ tgt.City ____ src.City;

            ____ INTO dbo.DimCustomer (____)
            SELECT ____, ____(GETDATE() AS DATE), ____, 1
            FROM stg.Customer AS src
            WHERE ____ ____ (
                SELECT 1 FROM dbo.DimCustomer AS tgt
                WHERE tgt.CustomerId = src.CustomerId
                  AND tgt.IsCurrent = ____
            );
        ____;
    END TRY
    ____ CATCH
        ____;
        ____;
    END CATCH
END;`,
    },
    explanation: 'This ties together three already-learned patterns: the expire step (UPDATE ... FROM ... JOIN ... WHERE IsCurrent = 1 AND changed) from the SCD topic, an INSERT ... SELECT ... WHERE NOT EXISTS to add new current versions (it naturally covers both brand-new CustomerIds and just-expired ones, since both now have zero current rows), and the transactional TRY/CATCH proc wrapper from earlier in this topic. Doing the expire before the insert, in the same transaction, is what makes NOT EXISTS see the freshly-closed rows.',
    hints: ['Expire step first: UPDATE ... JOIN stg.Customer WHERE IsCurrent = 1 AND City differs', 'Insert step: WHERE NOT EXISTS a current row for that CustomerId'],
    requires: [/CREATE\s+PROCEDURE/i, /BEGIN\s+TRY/i],
    tags: ['tsql', 'etl-proc', 'scd', 'type-2', 'transactions', 'try-catch'],
  },
];
