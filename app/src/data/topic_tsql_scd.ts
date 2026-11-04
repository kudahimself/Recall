/**
 * Topic.TSQL_SCD - SQL for Data Engineering (T-SQL).
 * Pillar 5 (Data Modeling): Slowly Changing Dimensions - Type 1 (overwrite)
 * and Type 2 (versioned rows: effective dates, IsCurrent) via MERGE.
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

// The product dimension before a load: Kite is about to change category, Tea Kettle is new in staging.
const DIM_PRODUCT_TYPE1 = {
  name: 'dbo.DimProduct',
  columns: ['ProductCode', 'ProductName', 'Category'],
  rows: [['BK-1001-PB', 'The Great Novel', 'Books'], ['TY-2002-ST', 'Kite', 'Toys']],
};
const STG_PRODUCT_TYPE1 = {
  name: 'stg.Product',
  columns: ['ProductCode', 'ProductName', 'Category'],
  rows: [['BK-1001-PB', 'The Great Novel', 'Books'], ['TY-2002-ST', 'Kite', 'Games'], ['HM-4001-XL', 'Tea Kettle', 'Home']],
};

export const tsql_scd_questions: Question[] = [
  {
    id: 'tsql-scd-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_SCD,
    course: Course.SQL,
    question: 'How do SCD Type 1 and SCD Type 2 differ when a customer\'s attribute (say, City) changes?',
    options: [
      { id: 'a', text: 'Type 1 overwrites the old value in place, so no history is kept; Type 2 closes the current row and inserts a new version, so the history stays.', isCorrect: true },
      { id: 'b', text: 'Type 1 inserts a new row for each change, so history is kept; Type 2 overwrites the value in place and keeps none.', isCorrect: false },
      { id: 'c', text: 'Both overwrite the value in place; Type 2 only adds a LastUpdated timestamp to show when the change happened.', isCorrect: false },
      { id: 'd', text: 'Type 1 adds a PreviousCity column beside City and keeps one prior value; Type 2 keeps no history at all.', isCorrect: false },
    ],
    explanation: 'Type 1 = overwrite: the dimension always reflects the latest value, history is lost. Type 2 = versioned rows: the current row is closed (end date set, IsCurrent = 0) and a fresh row is inserted, so facts stay linked to the attribute value that was true at the time of the event. (Keeping one previous value in an extra column is a third pattern, Type 3.)',
    hints: ['Type 1 = overwrite, no history', 'Type 2 = new versioned row, full history'],
    tags: ['tsql', 'scd', 'slowly-changing-dimension'],
  },
  {
    id: 'tsql-scd-mcq-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_SCD,
    course: Course.SQL,
    question: 'Which columns does a Type 2 dimension typically add to track versions?',
    options: [
      { id: 'a', text: 'EffectiveDate and EndDate columns plus an IsCurrent flag, so each row records the window in which its values were true.', isCorrect: true },
      { id: 'b', text: 'A single LastUpdated timestamp that is overwritten on every change, so only the latest change time is known.', isCorrect: false },
      { id: 'c', text: 'A RowCount and a checksum column with no dates, so a changed row is spotted but its version window is lost.', isCorrect: false },
      { id: 'd', text: 'Nothing extra: every version reuses the same surrogate key, and the newest row wins by load order.', isCorrect: false },
    ],
    explanation: 'A Type 2 row carries validity metadata: `EffectiveDate`, `EndDate` (often NULL or 9999-12-31 for the open row), and an `IsCurrent` BIT for the cheap "give me today\'s version" filter. Each business key thus has one current row and any number of expired historical rows, each with its own surrogate key (a reused key would leave facts unable to tell the versions apart).',
    hints: ['Effective date, end date, IsCurrent flag', 'They record each version\'s validity window'],
    tags: ['tsql', 'scd', 'effective-dates', 'is-current'],
  },
  {
    id: 'tsql-scd-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_SCD,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Complete the MERGE that loads the customer dimension from staging as a Type 1 (overwrite) load: existing customers get their City overwritten, and customers not yet in the dimension are inserted.',
    tables: [
      sampleTable('dbo.DimCustomer', ['CustomerId', 'FullName', 'City']),
      sampleTable('stg.Customer', ['CustomerId', 'FullName', 'City']),
    ],
    template: `MERGE dbo.DimCustomer AS tgt
USING stg.Customer AS src
    ON tgt.CustomerId = src.CustomerId
WHEN ___ THEN
    UPDATE SET tgt.City = src.City
WHEN ___ THEN
    INSERT (CustomerId, FullName, City) VALUES (src.CustomerId, src.FullName, src.City);`,
    blanks: ['MATCHED', 'NOT MATCHED BY TARGET'],
    solution: `MERGE dbo.DimCustomer AS tgt
USING stg.Customer AS src
    ON tgt.CustomerId = src.CustomerId
WHEN MATCHED THEN
    UPDATE SET tgt.City = src.City
WHEN NOT MATCHED BY TARGET THEN
    INSERT (CustomerId, FullName, City) VALUES (src.CustomerId, src.FullName, src.City);`,
    blankAlternates: [[], ['NOT MATCHED']],
    explanation: 'A Type 1 upsert is a `MERGE`: `WHEN MATCHED` overwrites the existing row (no history), `WHEN NOT MATCHED BY TARGET` (plain `NOT MATCHED` means the same) inserts brand-new business keys. The `ON` joins on the natural key. On the shown rows, C-003 moves from Malmo to Lund in place and C-009 is inserted. This is the simplest SCD: the dimension always shows the latest value.',
    hints: ['Existing row → WHEN MATCHED', 'New business key → WHEN NOT MATCHED BY TARGET'],
    tags: ['tsql', 'scd', 'merge', 'type-1', 'cloze'],
  },
  {
    id: 'tsql-scd-parsons-1',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TSQL_SCD,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Assemble the statement that EXPIRES the Type 2 dimension rows whose City changed in staging: it stamps EndDate with today and clears IsCurrent, and only touches rows that are still current.',
    tables: [
      {
        name: 'dbo.DimCustomer',
        columns: ['CustomerKey', 'CustomerId', 'City', 'EndDate', 'IsCurrent'],
        rows: [[1, 'C-001', 'Oslo', null, 1], [2, 'C-003', 'Malmo', null, 1], [3, 'C-004', 'Lagos', null, 1]],
      },
      { name: 'stg.Customer', columns: ['CustomerId', 'City'], rows: [['C-001', 'Oslo'], ['C-003', 'Lund']] },
    ],
    correctOrder: [
      'UPDATE tgt',
      "    SET tgt.EndDate = CAST(GETDATE() AS DATE), tgt.IsCurrent = 0",
      'FROM dbo.DimCustomer AS tgt',
      '    JOIN stg.Customer AS src ON src.CustomerId = tgt.CustomerId',
      'WHERE tgt.IsCurrent = 1 AND tgt.City <> src.City;',
    ],
    distractorLines: [
      '    SET tgt.IsCurrent = 1, tgt.EndDate = NULL',
      'WHERE tgt.IsCurrent = 0;',
      'DELETE FROM dbo.DimCustomer AS tgt',
    ],
    solution: `UPDATE tgt
    SET tgt.EndDate = CAST(GETDATE() AS DATE), tgt.IsCurrent = 0
FROM dbo.DimCustomer AS tgt
    JOIN stg.Customer AS src ON src.CustomerId = tgt.CustomerId
WHERE tgt.IsCurrent = 1 AND tgt.City <> src.City;`,
    explanation: 'The "expire" step of an SCD2 load closes the open version of any row whose attribute changed: stamp `EndDate` and set `IsCurrent = 0`, joining staging on the business key and filtering to `IsCurrent = 1 AND City <> src.City`. On the shown rows only C-003 (Malmo, now Lund) is closed. A separate INSERT then adds the new current version; never DELETE, which would destroy history.',
    hints: ['Expire = set EndDate + IsCurrent = 0', 'Only current rows with a changed value; never DELETE'],
    tags: ['tsql', 'scd', 'type-2', 'effective-dates', 'parsons'],
  },
  {
    id: 'tsql-scd-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TSQL_SCD,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Write a Type 1 upsert with MERGE: load `dbo.DimProduct` (alias `tgt`) from `stg.Product` (alias `src`), matching on the natural key `ProductCode`. WHEN MATCHED, overwrite `ProductName` and `Category`. WHEN NOT MATCHED BY TARGET, insert `ProductCode`, `ProductName` and `Category`.',
    tables: [DIM_PRODUCT_TYPE1, STG_PRODUCT_TYPE1],
    starterCode: `-- Write the MERGE statement below.
`,
    testCases: [
      {
        input: 'MERGE ... WHEN MATCHED UPDATE ... WHEN NOT MATCHED BY TARGET INSERT ...',
        expectedOutput: 'Type 1 upsert overwriting matched rows and inserting new ones',
        description: 'SCD Type 1 MERGE',
      },
    ],
    solution: `MERGE dbo.DimProduct AS tgt
USING stg.Product AS src
    ON tgt.ProductCode = src.ProductCode
WHEN MATCHED THEN
    UPDATE SET tgt.ProductName = src.ProductName,
               tgt.Category = src.Category
WHEN NOT MATCHED BY TARGET THEN
    INSERT (ProductCode, ProductName, Category)
    VALUES (src.ProductCode, src.ProductName, src.Category);
-- OR
MERGE dbo.DimProduct AS tgt
USING stg.Product AS src
    ON tgt.ProductCode = src.ProductCode
WHEN MATCHED THEN
    UPDATE SET tgt.ProductName = src.ProductName,
               tgt.Category = src.Category
WHEN NOT MATCHED THEN
    INSERT (ProductCode, ProductName, Category)
    VALUES (src.ProductCode, src.ProductName, src.Category);`,
    tieredHints: {
      apiSignature: 'WHEN NOT MATCHED BY TARGET THEN INSERT (col1, col2, ...) VALUES (val1, val2, ...)',
      skeleton: `MERGE dbo.DimProduct AS tgt
USING stg.Product AS src
    ON tgt.ProductCode = src.ProductCode
WHEN ____ THEN
    UPDATE SET tgt.ProductName = src.ProductName,
               tgt.Category = ____
WHEN NOT MATCHED BY TARGET THEN
    INSERT (ProductCode, ProductName, Category)
    VALUES (____, ____, ____);`,
    },
    explanation: 'A single `MERGE` performs the whole Type 1 load: join target to source on the natural key, overwrite the descriptive columns for existing products (`WHEN MATCHED`), and insert rows for brand-new product codes (`WHEN NOT MATCHED BY TARGET`). On the shown rows Kite moves to Games in place and Tea Kettle is inserted. Type 1 keeps no history: the dimension simply reflects the latest source values.',
    hints: ['ON ProductCode; WHEN MATCHED → UPDATE SET both columns', 'WHEN NOT MATCHED BY TARGET → INSERT the three columns'],
    requires: [/MERGE/i],
    tags: ['tsql', 'scd', 'merge', 'type-1'],
  },
  {
    id: 'tsql-scd-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TSQL_SCD,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Write the expire step of a Type 2 load for `dbo.DimProduct` (alias `tgt`) using `stg.Product` (alias `src`): for every product whose Category in staging no longer matches its current dimension row, set EndDate to CAST(GETDATE() AS DATE) and IsCurrent to 0. Leave rows that are already closed alone.',
    tables: [
      {
        name: 'dbo.DimProduct',
        columns: ['ProductCode', 'Category', 'EffectiveDate', 'EndDate', 'IsCurrent'],
        rows: [['BK-1001-PB', 'Books', '2025-01-01', null, 1], ['TY-2002-ST', 'Toys', '2025-01-01', null, 1], ['GD-3001-XL', 'Home', '2025-01-01', null, 1]],
      },
      {
        name: 'stg.Product',
        columns: ['ProductCode', 'Category'],
        rows: [['BK-1001-PB', 'Books'], ['TY-2002-ST', 'Games'], ['HM-4001-XL', 'Home']],
      },
    ],
    starterCode: `-- Write the UPDATE statement below.
`,
    testCases: [
      {
        input: "UPDATE ... SET EndDate = CAST(GETDATE() AS DATE), IsCurrent = 0 FROM DimProduct JOIN stg.Product WHERE IsCurrent = 1 AND Category <> src.Category",
        expectedOutput: 'Closes the current version of every changed product',
        description: 'SCD Type 2 expire step',
      },
    ],
    solution: `UPDATE tgt
    SET tgt.EndDate = CAST(GETDATE() AS DATE), tgt.IsCurrent = 0
FROM dbo.DimProduct AS tgt
    JOIN stg.Product AS src ON src.ProductCode = tgt.ProductCode
WHERE tgt.IsCurrent = 1 AND tgt.Category <> src.Category;
-- OR
UPDATE tgt
    SET tgt.EndDate = CAST(GETDATE() AS DATE), tgt.IsCurrent = 0
FROM dbo.DimProduct AS tgt
WHERE tgt.IsCurrent = 1
  AND EXISTS (
      SELECT 1 FROM stg.Product AS src
      WHERE src.ProductCode = tgt.ProductCode AND src.Category <> tgt.Category
  );
-- OR
UPDATE tgt
    SET EndDate = CAST(GETDATE() AS DATE), IsCurrent = 0
FROM dbo.DimProduct AS tgt
    JOIN stg.Product AS src ON src.ProductCode = tgt.ProductCode
WHERE tgt.IsCurrent = 1 AND tgt.Category <> src.Category;`,
    tieredHints: {
      apiSignature: 'UPDATE alias SET alias.col = expr FROM table AS alias JOIN table2 AS alias2 ON condition',
      skeleton: `UPDATE tgt
    SET tgt.____ = CAST(GETDATE() AS ____), tgt.IsCurrent = ____
FROM dbo.DimProduct AS tgt
    ____ stg.Product AS src ON src.ProductCode = tgt.____
WHERE tgt.____ = 1 AND tgt.Category ____ src.Category;`,
    },
    explanation: 'This mirrors the earlier expire-step pattern: join the current dimension rows to staging on the natural key, and for rows where the tracked attribute actually changed, stamp EndDate and clear IsCurrent. On the shown rows only TY-2002-ST (Kite, Toys now Games in staging) is closed; HM-4001-XL has no dimension row yet and GD-3001-XL is not in staging. A separate INSERT (not shown here) would then add each product\'s new current version - the expire step never DELETEs, since that would destroy history.',
    hints: ['UPDATE ... FROM dbo.DimProduct JOIN stg.Product ON ProductCode', 'WHERE IsCurrent = 1 AND the tracked column differs'],
    requires: [/UPDATE/i],
    tags: ['tsql', 'scd', 'type-2', 'effective-dates'],
  },
  {
    id: 'tsql-scd-insert-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TSQL_SCD,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: "The expire step has just run, so the dimension is shown after it. Complete the INSERT that adds a new current version for every staged product that has no current row: fill in the IsCurrent value for a new current row, and the predicate that skips products which already have one.",
    tables: [
      {
        name: 'dbo.DimProduct',
        columns: ['ProductCode', 'ProductName', 'Category', 'EffectiveDate', 'EndDate', 'IsCurrent'],
        rows: [
          ['BK-1001-PB', 'The Great Novel', 'Books', '2025-01-01', null, 1],
          ['TY-2002-ST', 'Kite', 'Toys', '2025-01-01', '2026-11-04', 0],
          ['GD-3001-XL', 'Desk Lamp', 'Home', '2025-01-01', null, 1],
        ],
      },
      {
        name: 'stg.Product',
        columns: ['ProductCode', 'ProductName', 'Category'],
        rows: [['BK-1001-PB', 'The Great Novel', 'Books'], ['TY-2002-ST', 'Kite', 'Games'], ['HM-4001-XL', 'Tea Kettle', 'Home']],
      },
    ],
    template: `INSERT INTO dbo.DimProduct (ProductCode, ProductName, Category, EffectiveDate, EndDate, IsCurrent)
SELECT src.ProductCode, src.ProductName, src.Category, CAST(GETDATE() AS DATE), NULL, ___
FROM stg.Product AS src
WHERE ___ (
    SELECT 1 FROM dbo.DimProduct tgt
    WHERE tgt.ProductCode = src.ProductCode AND tgt.IsCurrent = 1
);`,
    blanks: ['1', 'NOT EXISTS'],
    solution: `INSERT INTO dbo.DimProduct (ProductCode, ProductName, Category, EffectiveDate, EndDate, IsCurrent)
SELECT src.ProductCode, src.ProductName, src.Category, CAST(GETDATE() AS DATE), NULL, 1
FROM stg.Product AS src
WHERE NOT EXISTS (
    SELECT 1 FROM dbo.DimProduct tgt
    WHERE tgt.ProductCode = src.ProductCode AND tgt.IsCurrent = 1
);`,
    explanation: 'This is the second half of a Type 2 load, run right after the expire step: any ProductCode with no `IsCurrent = 1` row - either brand new, or just closed out by the expire UPDATE - gets a fresh version inserted with today\'s EffectiveDate, a NULL EndDate, and IsCurrent = 1. On the shown rows that is TY-2002-ST (its Toys row was just closed, so Kite is added again as Games) and the new HM-4001-XL; BK-1001-PB already has a current row and is skipped. Expire-then-insert is the complete SCD2 pattern.',
    hints: ['A newly inserted current row has IsCurrent = 1', 'NOT EXISTS a current row for that ProductCode'],
    tags: ['tsql', 'scd', 'type-2', 'effective-dates', 'cloze'],
  },
  {
    id: 'tsql-scd-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_SCD,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Customer C-7 moved from Leeds to York, and the Type 2 load added a new version. What does this query return? Write one row per line in the ORDER BY order, as City and Total separated by a comma.',
    tables: [
      {
        name: 'dbo.DimCustomer',
        columns: ['CustomerKey', 'CustomerId', 'City', 'IsCurrent'],
        rows: [[1, 'C-7', 'Leeds', 0], [2, 'C-7', 'York', 1]],
      },
      { name: 'dbo.FactSale', columns: ['CustomerKey', 'Amount'], rows: [[1, 40], [1, 10], [2, 25]] },
    ],
    code: `SELECT d.City, SUM(f.Amount) AS Total
FROM dbo.FactSale AS f
JOIN dbo.DimCustomer AS d ON d.CustomerKey = f.CustomerKey
GROUP BY d.City
ORDER BY d.City;`,
    expectedOutput: `Leeds, 50
York, 25`,
    explanation: 'Each sale keeps the surrogate key of the version that was current when it happened. The two sales made in Leeds point at key 1 and still report Leeds; only the sale after the move points at key 2. That is what Type 2 is for: history stays where it happened. Under Type 1 the City would have been overwritten and all 75 would show as York.',
    hints: ['Facts join on CustomerKey, not on CustomerId', 'Key 1 is the Leeds version, key 2 the York one'],
    tags: ['tsql', 'scd', 'type-2', 'history', 'predict'],
  },
];
