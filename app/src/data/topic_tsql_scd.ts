/**
 * Topic.TSQL_SCD — SQL for Data Engineering (T-SQL).
 * Pillar 5 (Data Modeling): Slowly Changing Dimensions — Type 1 (overwrite)
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

export const tsql_scd_questions: Question[] = [
  {
    id: 'tsql-scd-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_SCD,
    course: Course.SQL,
    question: 'How do SCD Type 1 and SCD Type 2 differ when a customer\'s attribute (say, City) changes?',
    options: [
      { id: 'a', text: 'Type 1 overwrites the old value in place (no history); Type 2 expires the current row and inserts a new versioned row, preserving the full history of changes.', isCorrect: true },
      { id: 'b', text: 'Type 1 keeps full history while Type 2 overwrites; the numbers indicate how many versions are kept.', isCorrect: false },
      { id: 'c', text: 'Both overwrite the value, but Type 2 also logs the change to a separate audit file outside the database.', isCorrect: false },
      { id: 'd', text: 'Type 1 adds a new column for each change; Type 2 adds a new table for each change.', isCorrect: false },
    ],
    explanation: 'Type 1 = overwrite: the dimension always reflects the latest value, history is lost. Type 2 = versioned rows: the current row is closed (end date set, IsCurrent = 0) and a fresh row is inserted, so facts stay linked to the attribute value that was true at the time of the event.',
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
      { id: 'a', text: 'Effective-date and end-date columns plus an IsCurrent flag, so each row records the window during which its values were valid.', isCorrect: true },
      { id: 'b', text: 'A single LastUpdated timestamp that is overwritten on every change.', isCorrect: false },
      { id: 'c', text: 'A row-count column and a checksum, with no dates at all.', isCorrect: false },
      { id: 'd', text: 'Nothing extra — Type 2 reuses the surrogate key column to store the version number.', isCorrect: false },
    ],
    explanation: 'A Type 2 row carries validity metadata: `EffectiveDate`, `EndDate` (often NULL or 9999-12-31 for the open row), and an `IsCurrent` BIT for the cheap "give me today\'s version" filter. Each business key thus has one current row and any number of expired historical rows, each with its own surrogate key.',
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
    question: 'Fill in the MERGE clauses for a Type 1 (overwrite) load of a customer dimension from staging.',
    template: `MERGE dbo.DimCustomer AS tgt
USING stg.Customer AS src
    ON tgt.CustomerId = src.CustomerId
WHEN ___ THEN
    UPDATE SET tgt.City = src.City
WHEN NOT MATCHED ___ THEN
    INSERT (CustomerId, City) VALUES (src.CustomerId, src.City);`,
    blanks: ['MATCHED', 'BY TARGET'],
    solution: `MERGE dbo.DimCustomer AS tgt
USING stg.Customer AS src
    ON tgt.CustomerId = src.CustomerId
WHEN MATCHED THEN
    UPDATE SET tgt.City = src.City
WHEN NOT MATCHED BY TARGET THEN
    INSERT (CustomerId, City) VALUES (src.CustomerId, src.City);`,
    explanation: 'A Type 1 upsert is a `MERGE`: `WHEN MATCHED` overwrites the existing row (no history), `WHEN NOT MATCHED BY TARGET` inserts brand-new business keys. The `ON` joins on the natural key. This is the simplest SCD — the dimension always shows the latest value.',
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
    question: 'Assemble the SQL that EXPIRES the current Type 2 rows whose tracked attribute changed in staging: set EndDate and clear IsCurrent for matching current rows. Order: UPDATE the target, SET the two version columns, FROM/JOIN staging, then the WHERE that limits it to current rows with a changed City.',
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
    explanation: 'The "expire" step of an SCD2 load closes the open version of any row whose attribute changed: stamp `EndDate` and set `IsCurrent = 0`, joining staging on the business key and filtering to `IsCurrent = 1 AND City <> src.City`. A separate INSERT then adds the new current version — never DELETE (that would destroy history).',
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
    question: 'Write a Type 1 upsert with MERGE: load `dbo.DimProduct` (matching on natural key `ProductCode`) from `stg.Product`. WHEN MATCHED, overwrite `ProductName` and `Category`. WHEN NOT MATCHED BY TARGET, insert `ProductCode`, `ProductName`, `Category`.',
    starterCode: `-- MERGE dbo.DimProduct AS tgt USING stg.Product AS src ON ...
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
    VALUES (src.ProductCode, src.ProductName, src.Category);`,
    explanation: 'A single `MERGE` performs the whole Type 1 load: join target to source on the natural key, overwrite the descriptive columns for existing products (`WHEN MATCHED`), and insert rows for brand-new product codes (`WHEN NOT MATCHED BY TARGET`). Type 1 keeps no history — the dimension simply reflects the latest source values.',
    hints: ['ON ProductCode; WHEN MATCHED → UPDATE SET both columns', 'WHEN NOT MATCHED BY TARGET → INSERT the three columns'],
    tags: ['tsql', 'scd', 'merge', 'type-1'],
  },
  {
    id: 'tsql-scd-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TSQL_SCD,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Write the expire step of a Type 2 load for `dbo.DimProduct` (ProductCode, Category, EffectiveDate, EndDate, IsCurrent): close the current row (set EndDate to CAST(GETDATE() AS DATE) and IsCurrent to 0) for every product whose Category in `stg.Product` (ProductCode, Category) no longer matches its current dimension row.',
    starterCode: `-- UPDATE the current DimProduct row when its Category no longer matches staging
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
WHERE tgt.IsCurrent = 1 AND tgt.Category <> src.Category;`,
    explanation: 'This mirrors the earlier expire-step pattern: join the current dimension rows to staging on the natural key, and for rows where the tracked attribute actually changed, stamp EndDate and clear IsCurrent. A separate INSERT (not shown here) would then add each product\'s new current version - the expire step never DELETEs, since that would destroy history.',
    hints: ['UPDATE ... FROM dbo.DimProduct JOIN stg.Product ON ProductCode', 'WHERE IsCurrent = 1 AND the tracked column differs'],
    tags: ['tsql', 'scd', 'type-2', 'effective-dates'],
  },
  {
    id: 'tsql-scd-insert-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TSQL_SCD,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: "Fill in the value for a freshly-inserted current row's IsCurrent flag, and the predicate that skips products which already have a current row.",
    template: `INSERT INTO dbo.DimProduct (ProductCode, Category, EffectiveDate, EndDate, IsCurrent)
SELECT src.ProductCode, src.Category, CAST(GETDATE() AS DATE), NULL, ___
FROM stg.Product AS src
WHERE ___ (
    SELECT 1 FROM dbo.DimProduct tgt
    WHERE tgt.ProductCode = src.ProductCode AND tgt.IsCurrent = 1
);`,
    blanks: ['1', 'NOT EXISTS'],
    solution: `INSERT INTO dbo.DimProduct (ProductCode, Category, EffectiveDate, EndDate, IsCurrent)
SELECT src.ProductCode, src.Category, CAST(GETDATE() AS DATE), NULL, 1
FROM stg.Product AS src
WHERE NOT EXISTS (
    SELECT 1 FROM dbo.DimProduct tgt
    WHERE tgt.ProductCode = src.ProductCode AND tgt.IsCurrent = 1
);`,
    explanation: 'This is the second half of a Type 2 load, run right after the expire step: any ProductCode with no `IsCurrent = 1` row - either brand new, or just closed out by the expire UPDATE - gets a fresh version inserted with today\'s EffectiveDate, a NULL EndDate, and IsCurrent = 1. Expire-then-insert is the complete SCD2 pattern.',
    hints: ['A newly inserted current row has IsCurrent = 1', 'NOT EXISTS a current row for that ProductCode'],
    tags: ['tsql', 'scd', 'type-2', 'effective-dates', 'cloze'],
  },
];
