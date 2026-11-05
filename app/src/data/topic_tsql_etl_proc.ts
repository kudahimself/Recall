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
import { sampleTable } from './tsqlSampleTables';

// A product dimension and its staging feed: The Great Novel is in both (renamed),
// the Desk Lamp is new, the Kite is only in the dimension.
const DIM_PRODUCT = {
  name: 'dbo.DimProduct',
  columns: ['ProductCode', 'ProductName'],
  rows: [['BK-1001-PB', 'The Great Novel'], ['TY-2002-ST', 'Kite']],
};
const STG_PRODUCT = {
  name: 'stg.Product',
  columns: ['ProductCode', 'ProductName'],
  rows: [['BK-1001-PB', 'The Great Novel (2nd ed.)'], ['GD-3001-XL', 'Desk Lamp']],
};

// The incremental fact load: the last run loaded orders 1 and 2 (up to 10:00);
// orders 3 and 4 are new in staging, and order 2 is the boundary row.
const ETL_CONTROL = {
  name: 'dbo.EtlControl',
  columns: ['TableName', 'LastLoadedAt'],
  rows: [['FactSales', '2026-03-01 10:00']],
};
const FACT_SALES_LOADED = {
  name: 'dbo.FactSales',
  columns: ['OrderId', 'Amount', 'UpdatedAt'],
  rows: [[1, 20, '2026-03-01 09:00'], [2, 35, '2026-03-01 10:00']],
};
const STG_SALES_DELTA = {
  name: 'stg.Sales',
  columns: ['OrderId', 'Amount', 'UpdatedAt'],
  rows: [[2, 35, '2026-03-01 10:00'], [3, 15, '2026-03-01 11:30'], [4, 40, '2026-03-01 12:00']],
};

export const tsql_etl_proc_questions: Question[] = [
  {
    id: 'tsql-etlproc-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_ETL_PROC,
    course: Course.SQL,
    question: 'Why is the staging → target load wrapped in a stored procedure with `BEGIN TRAN` + `TRY…CATCH` rather than run as loose statements?',
    options: [
      { id: 'a', text: 'The whole load is atomic and its errors are re-raised: all writes commit together or roll back, and the procedure is one named unit a scheduler can call.', isCorrect: true },
      { id: 'b', text: 'The load becomes idempotent, so a retry after a failure can never create duplicate rows in the target.', isCorrect: false },
      { id: 'c', text: 'The statements inside a procedure run in parallel, so the load finishes sooner than the same statements run loose.', isCorrect: false },
      { id: 'd', text: 'The load skips the constraint checks that loose statements would enforce, so it never fails on bad data.', isCorrect: false },
    ],
    explanation: 'Wrapping the load gives it atomicity (transaction), structured failure handling (TRY…CATCH rolls back and re-throws), and a single named entry point a scheduler can call with the right permissions. A half-applied load, with the dimension updated but the fact not, is exactly what the transaction prevents. It does not make the load idempotent (that takes a MERGE or a reload), it does not parallelise the statements, and constraints are still enforced.',
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
      { id: 'a', text: 'Running it again with the same input leaves the same final state, with no duplicates, which matters because schedulers retry and pipelines re-run after failures.', isCorrect: true },
      { id: 'b', text: 'It can only ever run once, and a second run raises an error to block duplicates, which matters because schedulers retry.', isCorrect: false },
      { id: 'c', text: 'It runs inside one transaction, so a failed run is rolled back completely, which matters because pipelines fail halfway.', isCorrect: false },
      { id: 'd', text: 'It always empties the target with TRUNCATE first, the only way to repeat a load safely, which matters because loads re-run.', isCorrect: false },
    ],
    explanation: 'Idempotence = running the load again lands you in the same state, not a doubled one. Because orchestrators retry on transient failures, a blind `INSERT…SELECT` would duplicate rows on re-run. `MERGE` (upsert on a key) or TRUNCATE+reload makes the load safe to repeat. A transaction makes a single run all-or-nothing, which is atomicity, a different property; and TRUNCATE+reload is only one of the ways to get idempotence.',
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
    question: 'Fill in the keyword that creates the procedure, the keyword that opens the transaction, and the statement that makes the load permanent.',
    tables: [
      sampleTable('dbo.DimCustomer', ['CustomerId', 'FullName']),
      sampleTable('stg.Customer', ['CustomerId', 'FullName']),
    ],
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
    blankAlternates: [['PROC'], ['TRANSACTION'], ['COMMIT TRAN', 'COMMIT TRANSACTION']],
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
    question: 'Assemble the body of an incremental high-watermark load for `dbo.FactSales`: read the last loaded watermark from `dbo.EtlControl` into a variable, insert only the staging rows newer than it, then advance the stored watermark to the newest `UpdatedAt` now in the fact table.',
    tables: [ETL_CONTROL, FACT_SALES_LOADED, STG_SALES_DELTA],
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
    explanation: 'An incremental load reads the stored high-watermark (10:00), pulls only staging rows newer than it (`UpdatedAt > @lastLoaded`: orders 3 and 4; order 2, stamped exactly 10:00, was loaded last time), then advances the watermark to the new maximum (12:00). Advancing from the actual loaded MAX, not GETDATE(), keeps it correct if rows arrive slightly late; `< @lastLoaded` would reprocess old rows and skip new ones, and TRUNCATE would throw away the rows already loaded.',
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
      { id: 'a', text: 'When the table is small to moderate and the source has no reliable change marker, so a full rebuild is simpler and always correct.', isCorrect: true },
      { id: 'b', text: 'When the table is huge and only a few rows change per run, because rewriting everything is cheaper than matching keys.', isCorrect: false },
      { id: 'c', text: 'When the load must keep historical versions of rows, because TRUNCATE leaves the old rows in place.', isCorrect: false },
      { id: 'd', text: 'When other tables have foreign keys pointing at it, because TRUNCATE keeps those references valid.', isCorrect: false },
    ],
    explanation: 'TRUNCATE+reload trades I/O for simplicity: with no dependable change column or a manageable row count, rebuilding the whole table each run is easy to reason about and inherently idempotent. MERGE or an incremental load wins once the table is large enough that reprocessing everything is too costly, and it is required when you must preserve history (SCD2), since TRUNCATE removes every row. TRUNCATE is also blocked on a table that other tables reference with a foreign key.',
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
    question: 'Fill in the function that captures how many rows the MERGE just affected, and the status text that the existing run-log row uses for a successful run.',
    tables: [
      DIM_PRODUCT,
      STG_PRODUCT,
      {
        name: 'dbo.EtlRunLog',
        columns: ['ProcName', 'RunAt', 'RowsAffected', 'Status'],
        rows: [['LoadDimCustomer', '2026-11-02 02:00', 3, 'SUCCESS']],
      },
    ],
    template: `MERGE dbo.DimProduct AS tgt
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
    explanation: '`@@ROWCOUNT` returns the number of rows affected by the immediately preceding statement (here the MERGE\'s inserts plus updates: 2, the renamed Great Novel and the new Desk Lamp). Capture it into a variable right away, since the next statement resets it. The existing log row shows the status text a successful run uses, \'SUCCESS\'. Logging ProcName/RunAt/RowsAffected/Status gives every load a record you can audit or alert on when a run processes an unexpectedly low (or zero) row count.',
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
    tables: [DIM_PRODUCT, STG_PRODUCT],
    starterCode: `-- dbo.DimProduct (ProductCode, ProductName)
-- stg.Product (ProductCode, ProductName)
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
END;
-- OR
CREATE PROC dbo.LoadDimProduct
AS
BEGIN
    SET XACT_ABORT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
            MERGE dbo.DimProduct AS tgt
            USING stg.Product AS src
                ON tgt.ProductCode = src.ProductCode
            WHEN MATCHED THEN
                UPDATE SET tgt.ProductName = src.ProductName
            WHEN NOT MATCHED BY TARGET THEN
                INSERT (ProductCode, ProductName)
                VALUES (src.ProductCode, src.ProductName);
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
-- OR
CREATE PROCEDURE dbo.LoadDimProduct
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
            WHEN NOT MATCHED THEN
                INSERT (ProductCode, ProductName)
                VALUES (src.ProductCode, src.ProductName);
        COMMIT;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK;
        THROW;
    END CATCH
END;
-- OR
CREATE OR ALTER PROCEDURE dbo.LoadDimProduct
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
        IF @@TRANCOUNT > 0 ROLLBACK;
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
    requires: [/CREATE\s+(OR\s+ALTER\s+)?PROC(EDURE)?/i, /XACT_ABORT/i, /BEGIN\s+TRY/i, /MERGE/i, /COMMIT/i, /ROLLBACK/i, /THROW/i],
    tags: ['tsql', 'etl-proc', 'merge', 'transactions', 'try-catch'],
  },
  {
    id: 'tsql-etlproc-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TSQL_ETL_PROC,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: "Write the body of a high-watermark incremental load: read the stored watermark into a `DATETIME2` variable named `@lastLoaded`, load only the source rows newer than it, then advance the stored watermark to the newest value now present in the target. Schema - control table `dbo.EtlControl` with columns `TableName` and `LastLoadedAt`, whose row for this load has `TableName` 'FactSales'; target `dbo.FactSales` with columns `OrderId`, `Amount`, `UpdatedAt`; source `stg.Sales` with the same three columns, aliased `s`.",
    tables: [ETL_CONTROL, FACT_SALES_LOADED, STG_SALES_DELTA],
    starterCode: `-- dbo.EtlControl (TableName, LastLoadedAt)
-- dbo.FactSales (OrderId, Amount, UpdatedAt)
-- stg.Sales (OrderId, Amount, UpdatedAt)
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
WHERE TableName = 'FactSales';
-- OR
DECLARE @lastLoaded DATETIME2 = (SELECT LastLoadedAt FROM dbo.EtlControl WHERE TableName = 'FactSales');

INSERT INTO dbo.FactSales (OrderId, Amount, UpdatedAt)
SELECT s.OrderId, s.Amount, s.UpdatedAt
FROM stg.Sales AS s
WHERE s.UpdatedAt > @lastLoaded;

UPDATE dbo.EtlControl
SET LastLoadedAt = (SELECT MAX(UpdatedAt) FROM dbo.FactSales)
WHERE TableName = 'FactSales';
-- OR
DECLARE @lastLoaded DATETIME2;
SET @lastLoaded = (SELECT LastLoadedAt FROM dbo.EtlControl WHERE TableName = 'FactSales');

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
    explanation: 'The high-watermark pattern: load only rows newer than the last recorded watermark (`UpdatedAt > @lastLoaded`: orders 3 and 4, since order 2 sits exactly on the 10:00 boundary and was loaded last time), then advance the watermark to the new maximum actually loaded (12:00). Reading and storing the watermark in a control table makes each run process just the delta, the standard way to load a large, append-heavy fact incrementally.',
    hints: ['Read @lastLoaded from EtlControl', 'INSERT rows WHERE UpdatedAt > @lastLoaded, then advance LastLoadedAt to MAX'],
    requires: [/INSERT\s+INTO/i, /UPDATE/i, /@lastLoaded/i],
    tags: ['tsql', 'etl-proc', 'incremental', 'watermark'],
  },
  {
    id: 'tsql-etlproc-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TSQL_ETL_PROC,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: "Write a load procedure `dbo.LoadDimCustomerSCD2` that performs a Type 2 SCD load of `dbo.DimCustomer` (CustomerId, City, EffectiveDate, EndDate, IsCurrent) from `stg.Customer` (CustomerId, City), inside a transaction with SET XACT_ABORT ON and TRY/CATCH. First expire the current row (EndDate = CAST(GETDATE() AS DATE), IsCurrent = 0) for any CustomerId whose City no longer matches its current row. Then insert a new current row (EffectiveDate = CAST(GETDATE() AS DATE), EndDate = NULL, IsCurrent = 1) for every CustomerId in staging that has no current row afterward - this covers both brand-new customers and ones whose row was just expired. Commit at the end; in the CATCH, roll back and re-throw.",
    tables: [
      {
        name: 'dbo.DimCustomer',
        columns: ['CustomerId', 'City', 'EffectiveDate', 'EndDate', 'IsCurrent'],
        rows: [['C-001', 'Oslo', '2024-03-14', null, 1], ['C-003', 'Malmo', '2023-07-30', null, 1]],
      },
      {
        name: 'stg.Customer',
        columns: ['CustomerId', 'City'],
        rows: [['C-001', 'Oslo'], ['C-003', 'Lund'], ['C-009', 'Austin']],
      },
    ],
    starterCode: `-- dbo.DimCustomer (CustomerId, City, EffectiveDate, EndDate, IsCurrent)
-- stg.Customer (CustomerId, City)
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
END;
-- OR
CREATE PROC dbo.LoadDimCustomerSCD2
AS
BEGIN
    SET XACT_ABORT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
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
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
-- OR
CREATE PROCEDURE dbo.LoadDimCustomerSCD2
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
        IF @@TRANCOUNT > 0 ROLLBACK;
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
    explanation: 'This ties together three already-learned patterns: the expire step (UPDATE ... FROM ... JOIN ... WHERE IsCurrent = 1 AND changed) from the SCD topic, an INSERT ... SELECT ... WHERE NOT EXISTS to add new current versions (it naturally covers both brand-new CustomerIds and just-expired ones, since both now have zero current rows), and the transactional TRY/CATCH proc wrapper from earlier in this topic. On the shown data C-003 is expired and gets a new Lund row, C-009 gets its first row, and C-001 is untouched. Doing the expire before the insert, in the same transaction, is what makes NOT EXISTS see the freshly-closed rows.',
    hints: ['Expire step first: UPDATE ... JOIN stg.Customer WHERE IsCurrent = 1 AND City differs', 'Insert step: WHERE NOT EXISTS a current row for that CustomerId'],
    requires: [/CREATE\s+(OR\s+ALTER\s+)?PROC(EDURE)?/i, /XACT_ABORT/i, /BEGIN\s+TRY/i, /COMMIT/i, /ROLLBACK/i, /THROW/i],
    tags: ['tsql', 'etl-proc', 'scd', 'type-2', 'transactions', 'try-catch'],
  },
  {
    id: 'tsql-etlproc-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_ETL_PROC,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'The dimension load inserts two customers, then the next step of the same load fails. What single value does the final SELECT return?',
    tables: [
      { name: 'dbo.DimCustomer', columns: ['CustomerId', 'FullName'], rows: [[5, 'Cy Diaz']] },
      { name: 'stg.Customer', columns: ['CustomerId', 'FullName'], rows: [[7, 'Ann Lee'], [8, 'Bo Chan']] },
    ],
    code: `BEGIN TRY
    BEGIN TRAN;
    INSERT INTO dbo.DimCustomer (CustomerId, FullName)
    SELECT CustomerId, FullName FROM stg.Customer;
    THROW 50001, 'Fact load failed', 1;  -- the next step fails
    COMMIT;
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0 ROLLBACK;
END CATCH;
SELECT COUNT(*) AS DimRows FROM dbo.DimCustomer;`,
    expectedOutput: `1`,
    explanation: 'The INSERT adds customers 7 and 8 inside the open transaction, then the THROW jumps to CATCH before COMMIT runs. The ROLLBACK undoes the insert, so only the original row, customer 5, is left. That is why a load runs in one transaction: a failure leaves the target as it was, not half loaded. A real load procedure also re-throws with THROW in its CATCH, so the scheduler sees the failure; it is left out here so the final SELECT runs.',
    hints: ['Does COMMIT ever run?', 'What does ROLLBACK undo?'],
    tags: ['tsql', 'etl-proc', 'transaction', 'try-catch', 'atomicity', 'predict'],
  },
];
