/**
 * Topic.TSQL_MERGE — SQL for Data Engineering (T-SQL).
 * Pillar 6 (ELT & Transformation): MERGE with WHEN MATCHED /
 * WHEN NOT MATCHED BY TARGET / BY SOURCE, upsert, OUTPUT.
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

// The product dimension before a MERGE, and the staging rows it is synced to:
// Kite is only in the dimension, Desk Lamp only in staging, The Great Novel is in both.
const DIM_PRODUCT = {
  name: 'dbo.DimProduct',
  columns: ['ProductCode', 'ProductName', 'Category'],
  rows: [['BK-1001-PB', 'The Great Novel', 'Books'], ['TY-2002-ST', 'Kite', 'Toys']],
};
const STG_PRODUCT = {
  name: 'stg.Product',
  columns: ['ProductCode', 'ProductName', 'Category'],
  rows: [['BK-1001-PB', 'The Great Novel (2nd ed.)', 'Books'], ['GD-3001-XL', 'Desk Lamp', 'Home']],
};

export const tsql_merge_questions: Question[] = [
  {
    id: 'tsql-merge-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_MERGE,
    course: Course.SQL,
    question: 'What does a single `MERGE` statement do that makes it the standard upsert tool?',
    options: [
      { id: 'a', text: 'It compares a source to a target on a key and, in one statement, updates matched rows, inserts new ones, and can delete rows missing from the source.', isCorrect: true },
      { id: 'b', text: 'It pairs source and target rows by position, so both tables must be sorted the same way before the statement runs.', isCorrect: false },
      { id: 'c', text: 'It only inserts new rows, so every update and every delete still needs a separate statement.', isCorrect: false },
      { id: 'd', text: 'It applies one single action to every source row, chosen once for the whole statement.', isCorrect: false },
    ],
    explanation: 'MERGE joins source to target on a key and applies the right action per row in one pass: `WHEN MATCHED` (update), `WHEN NOT MATCHED BY TARGET` (insert), `WHEN NOT MATCHED BY SOURCE` (delete or expire). Each row takes the branch it falls into, and the rows pair by the `ON` key, not by position. That all-in-one upsert is why it is the backbone of dimension and fact loads.',
    hints: ['One statement: update + insert (+ optional delete)', 'Matched on a key'],
    tags: ['tsql', 'merge', 'upsert'],
  },
  {
    id: 'tsql-merge-mcq-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_MERGE,
    course: Course.SQL,
    question: 'In a MERGE, what is the difference between `WHEN NOT MATCHED BY TARGET` and `WHEN NOT MATCHED BY SOURCE`?',
    options: [
      { id: 'a', text: 'BY TARGET fires for a source row the target lacks (typically an INSERT); BY SOURCE fires for a target row the source lacks (typically a DELETE or expiry).', isCorrect: true },
      { id: 'b', text: 'They are synonyms: both fire for a source row that has no match in the target.', isCorrect: false },
      { id: 'c', text: 'BY TARGET fires for keys found in both tables; BY SOURCE fires for keys found in neither table.', isCorrect: false },
      { id: 'd', text: 'BY TARGET fires for a target row the source lacks (typically a DELETE); BY SOURCE fires for a source row the target lacks (typically an INSERT).', isCorrect: false },
    ],
    explanation: '`WHEN NOT MATCHED BY TARGET` = the source has a row the target lacks, so insert it. `WHEN NOT MATCHED BY SOURCE` = the target has a row the source lacks, so it has disappeared upstream: delete or expire it. The name says which table lacks the row, not which table has it. Plain `WHEN NOT MATCHED` defaults to BY TARGET, and keys found in both tables fall under `WHEN MATCHED`.',
    hints: ['BY TARGET → new in source → INSERT', 'BY SOURCE → gone from source → DELETE/expire'],
    tags: ['tsql', 'merge', 'not-matched'],
  },
  {
    id: 'tsql-merge-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_MERGE,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the three keywords of the MERGE frame: the one that starts the statement, the one that introduces the source, and the one that starts the match condition. Customers already in the dimension get their name updated, and new ones are inserted.',
    tables: [
      { name: 'dbo.DimCustomer', columns: ['CustomerId', 'FullName'], rows: [['C-001', 'Ingrid Berg'], ['C-003', 'Sofia Lind']] },
      { name: 'stg.Customer', columns: ['CustomerId', 'FullName'], rows: [['C-001', 'Ingrid Berg-Holm'], ['C-009', 'Tom Reyes']] },
    ],
    template: `___ dbo.DimCustomer AS tgt
___ stg.Customer AS src
    ___ tgt.CustomerId = src.CustomerId
WHEN MATCHED THEN
    UPDATE SET tgt.FullName = src.FullName
WHEN NOT MATCHED BY TARGET THEN
    INSERT (CustomerId, FullName) VALUES (src.CustomerId, src.FullName);`,
    blanks: ['MERGE', 'USING', 'ON'],
    blankAlternates: [['MERGE INTO'], [], []],
    solution: `MERGE dbo.DimCustomer AS tgt
USING stg.Customer AS src
    ON tgt.CustomerId = src.CustomerId
WHEN MATCHED THEN
    UPDATE SET tgt.FullName = src.FullName
WHEN NOT MATCHED BY TARGET THEN
    INSERT (CustomerId, FullName) VALUES (src.CustomerId, src.FullName);`,
    explanation: 'The frame is always `MERGE <target> USING <source> ON <key>` followed by `WHEN …` action clauses (`MERGE INTO` is also accepted). Here C-001 is matched, so its name is overwritten with Ingrid Berg-Holm, and C-009 is only in staging, so it is inserted; C-003 is not in staging, so it is left alone. That is a Type 1 upsert.',
    hints: ['MERGE target USING source ON key', 'Then WHEN MATCHED / WHEN NOT MATCHED clauses'],
    tags: ['tsql', 'merge', 'upsert', 'cloze'],
  },
  {
    id: 'tsql-merge-cloze-2',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TSQL_MERGE,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: "Fill in the keyword that adds a condition to the matched branch, so a customer's City is only updated when it differs from the staging value (this avoids pointless writes).",
    tables: [
      sampleTable('dbo.DimCustomer', ['CustomerId', 'City']),
      sampleTable('stg.Customer', ['CustomerId', 'City']),
    ],
    template: `MERGE dbo.DimCustomer AS tgt
USING stg.Customer AS src
    ON tgt.CustomerId = src.CustomerId
WHEN MATCHED ___ tgt.City <> src.City THEN
    UPDATE SET tgt.City = src.City;`,
    blanks: ['AND'],
    solution: `MERGE dbo.DimCustomer AS tgt
USING stg.Customer AS src
    ON tgt.CustomerId = src.CustomerId
WHEN MATCHED AND tgt.City <> src.City THEN
    UPDATE SET tgt.City = src.City;`,
    explanation: 'A `WHEN MATCHED AND <condition>` adds a filter to the matched branch, so the UPDATE fires only when `City` actually differs: here only C-003 (Malmo becomes Lund), while C-001 is already Oslo and is left alone. This avoids rewriting unchanged rows, which is cheaper and stops a change-tracking trigger or SCD2 step from logging no-op "changes".',
    hints: ['Add a condition to the matched branch', 'WHEN MATCHED AND <changed> THEN'],
    tags: ['tsql', 'merge', 'change-detection', 'cloze'],
  },
  {
    id: 'tsql-merge-bysource-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TSQL_MERGE,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the branch that fires for target rows no longer present in the source, and the action that removes them.',
    tables: [
      { name: 'dbo.DimProduct', columns: ['ProductCode', 'ProductName'], rows: [['BK-1001-PB', 'The Great Novel'], ['TY-2002-ST', 'Kite']] },
      { name: 'stg.Product', columns: ['ProductCode', 'ProductName'], rows: [['BK-1001-PB', 'The Great Novel (2nd ed.)']] },
    ],
    template: `MERGE dbo.DimProduct AS tgt
USING stg.Product AS src
    ON tgt.ProductCode = src.ProductCode
WHEN MATCHED THEN
    UPDATE SET tgt.ProductName = src.ProductName
WHEN NOT MATCHED ___ THEN
    ___;`,
    blanks: ['BY SOURCE', 'DELETE'],
    solution: `MERGE dbo.DimProduct AS tgt
USING stg.Product AS src
    ON tgt.ProductCode = src.ProductCode
WHEN MATCHED THEN
    UPDATE SET tgt.ProductName = src.ProductName
WHEN NOT MATCHED BY SOURCE THEN
    DELETE;`,
    explanation: '`WHEN NOT MATCHED BY SOURCE` fires for target rows that have no match in the source: here the Kite, which has disappeared upstream. `DELETE` removes it, so the dimension ends up with just the renamed Great Novel. Together with the matched update and a `NOT MATCHED BY TARGET` insert, this completes a full three-way sync.',
    hints: ['The branch for target-only rows, not source-only', 'The action that removes a row'],
    tags: ['tsql', 'merge', 'not-matched-by-source', 'delete', 'cloze'],
  },
  {
    id: 'tsql-merge-output-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TSQL_MERGE,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: "Fill in the clause and the pseudo-column that report which action MERGE took for each row.",
    tables: [
      { name: 'dbo.DimProduct', columns: ['ProductCode', 'ProductName'], rows: [['BK-1001-PB', 'The Great Novel']] },
      { name: 'stg.Product', columns: ['ProductCode', 'ProductName'], rows: [['BK-1001-PB', 'The Great Novel (2nd ed.)'], ['GD-3001-XL', 'Desk Lamp']] },
    ],
    template: `DECLARE @Changes TABLE (ChangeType NVARCHAR(10), NewCode VARCHAR(20), OldCode VARCHAR(20));
MERGE dbo.DimProduct AS tgt
USING stg.Product AS src
    ON tgt.ProductCode = src.ProductCode
WHEN MATCHED THEN
    UPDATE SET tgt.ProductName = src.ProductName
WHEN NOT MATCHED BY TARGET THEN
    INSERT (ProductCode, ProductName) VALUES (src.ProductCode, src.ProductName)
___ ___, inserted.ProductCode, deleted.ProductCode INTO @Changes;`,
    blanks: ['OUTPUT', '$action'],
    solution: `DECLARE @Changes TABLE (ChangeType NVARCHAR(10), NewCode VARCHAR(20), OldCode VARCHAR(20));
MERGE dbo.DimProduct AS tgt
USING stg.Product AS src
    ON tgt.ProductCode = src.ProductCode
WHEN MATCHED THEN
    UPDATE SET tgt.ProductName = src.ProductName
WHEN NOT MATCHED BY TARGET THEN
    INSERT (ProductCode, ProductName) VALUES (src.ProductCode, src.ProductName)
OUTPUT $action, inserted.ProductCode, deleted.ProductCode INTO @Changes;`,
    explanation: 'Added after all the WHEN clauses (still before the terminating semicolon), `OUTPUT` on a MERGE exposes `$action` - the literal text \'INSERT\', \'UPDATE\' or \'DELETE\' - alongside the usual `inserted`/`deleted` pseudo-tables, so you can audit exactly what the statement did to each row. Here @Changes would hold an UPDATE row for BK-1001-PB and an INSERT row for GD-3001-XL.',
    hints: ['OUTPUT goes after the last WHEN clause', '$action reports INSERT/UPDATE/DELETE per row'],
    tags: ['tsql', 'merge', 'output-clause', 'cloze'],
  },
  {
    id: 'tsql-merge-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TSQL_MERGE,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Write a full three-way MERGE that syncs `dbo.DimProduct` to `stg.Product`, matching on `ProductCode`. WHEN MATCHED, update `ProductName` and `Category`. WHEN NOT MATCHED BY TARGET, insert `ProductCode`, `ProductName`, `Category`. WHEN NOT MATCHED BY SOURCE, delete the target row (it no longer exists upstream).',
    tables: [DIM_PRODUCT, STG_PRODUCT],
    starterCode: `-- dbo.DimProduct (ProductCode, ProductName, Category)
-- stg.Product (ProductCode, ProductName, Category)
`,
    testCases: [
      {
        input: 'MERGE with WHEN MATCHED / NOT MATCHED BY TARGET / NOT MATCHED BY SOURCE',
        expectedOutput: 'Full sync: update, insert, delete in one statement',
        description: 'Three-way MERGE sync',
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
    VALUES (src.ProductCode, src.ProductName, src.Category)
WHEN NOT MATCHED BY SOURCE THEN
    DELETE;
-- OR
MERGE INTO dbo.DimProduct AS tgt
USING stg.Product AS src
    ON tgt.ProductCode = src.ProductCode
WHEN MATCHED THEN
    UPDATE SET tgt.ProductName = src.ProductName,
               tgt.Category = src.Category
WHEN NOT MATCHED BY TARGET THEN
    INSERT (ProductCode, ProductName, Category)
    VALUES (src.ProductCode, src.ProductName, src.Category)
WHEN NOT MATCHED BY SOURCE THEN
    DELETE;
-- OR
MERGE dbo.DimProduct AS tgt
USING stg.Product AS src
    ON tgt.ProductCode = src.ProductCode
WHEN MATCHED THEN
    UPDATE SET tgt.ProductName = src.ProductName,
               tgt.Category = src.Category
WHEN NOT MATCHED THEN
    INSERT (ProductCode, ProductName, Category)
    VALUES (src.ProductCode, src.ProductName, src.Category)
WHEN NOT MATCHED BY SOURCE THEN
    DELETE;
-- OR
MERGE INTO dbo.DimProduct AS tgt
USING stg.Product AS src
    ON tgt.ProductCode = src.ProductCode
WHEN MATCHED THEN
    UPDATE SET tgt.ProductName = src.ProductName,
               tgt.Category = src.Category
WHEN NOT MATCHED THEN
    INSERT (ProductCode, ProductName, Category)
    VALUES (src.ProductCode, src.ProductName, src.Category)
WHEN NOT MATCHED BY SOURCE THEN
    DELETE;`,
    tieredHints: {
      apiSignature: 'MERGE target_tbl AS tgt USING source_tbl AS src ON tgt.key = src.key WHEN MATCHED THEN UPDATE SET col = src.col WHEN NOT MATCHED BY TARGET THEN INSERT (cols) VALUES (src.cols) WHEN NOT MATCHED BY SOURCE THEN DELETE;',
      skeleton: `____ dbo.DimProduct AS tgt
____ stg.Product AS src
    ____ tgt.____ = src.____
____ MATCHED THEN
    ____ SET tgt.____ = src.____,
               tgt.____ = src.____
____ NOT MATCHED BY TARGET THEN
    ____ (____, ____, ____)
    VALUES (src.____, src.____, src.____)
____ NOT MATCHED BY SOURCE THEN
    ____;`,
    },
    explanation: 'All three branches make this a full sync: matched products are refreshed (The Great Novel gets its new name), source-only products are inserted (`BY TARGET`: the Desk Lamp), and target-only products, gone from the source, are deleted (`BY SOURCE`: the Kite). One statement keeps the dimension a faithful mirror of staging. (A `MERGE` statement must end with a semicolon.)',
    hints: ['Three WHEN clauses: MATCHED, NOT MATCHED BY TARGET, NOT MATCHED BY SOURCE', 'BY SOURCE → DELETE'],
    requires: [/MERGE/i, /WHEN\s+MATCHED/i, /NOT\s+MATCHED/i, /BY\s+SOURCE/i, /DELETE/i],
    tags: ['tsql', 'merge', 'upsert', 'sync'],
  },
  {
    id: 'tsql-merge-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_MERGE,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'The MERGE syncs the dimension from staging with two WHEN branches. What does the final SELECT return? Write one row per line in the ORDER BY order, as CustomerId and City separated by a comma.',
    tables: [
      { name: 'dbo.DimCustomer', columns: ['CustomerId', 'City'], rows: [[7, 'Leeds'], [8, 'York']] },
      { name: 'stg.Customer', columns: ['CustomerId', 'City'], rows: [[8, 'Hull'], [9, 'Bath']] },
    ],
    code: `MERGE dbo.DimCustomer AS tgt
USING stg.Customer AS src ON tgt.CustomerId = src.CustomerId
WHEN MATCHED THEN UPDATE SET tgt.City = src.City
WHEN NOT MATCHED BY TARGET THEN
    INSERT (CustomerId, City) VALUES (src.CustomerId, src.City);
SELECT CustomerId, City FROM dbo.DimCustomer ORDER BY CustomerId;`,
    expectedOutput: `7, Leeds
8, Hull
9, Bath`,
    explanation: 'Customer 8 is in both tables, so WHEN MATCHED updates its City to Hull. Customer 9 is only in staging, so WHEN NOT MATCHED BY TARGET inserts it. Customer 7 is only in the target, and with no WHEN NOT MATCHED BY SOURCE branch MERGE leaves it alone, so it keeps Leeds. Add that branch with DELETE only when the target must mirror the source exactly.',
    hints: ['Sort each customer into: in both, only in staging, only in the target', 'Which branch would fire for customer 7, and is it written?'],
    tags: ['tsql', 'merge', 'upsert', 'not-matched-by-source', 'predict'],
  },
];
