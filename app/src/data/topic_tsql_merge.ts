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

export const tsql_merge_questions: Question[] = [
  {
    id: 'tsql-merge-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_MERGE,
    course: Course.SQL,
    question: 'What does a single `MERGE` statement do that makes it the standard upsert tool?',
    options: [
      { id: 'a', text: 'It compares a source to a target on a key and, in one statement, UPDATEs matched rows, INSERTs new ones, and can DELETE rows missing from the source.', isCorrect: true },
      { id: 'b', text: 'It permanently merges two tables into a third and drops the originals.', isCorrect: false },
      { id: 'c', text: 'It only inserts rows; updates and deletes still require separate statements.', isCorrect: false },
      { id: 'd', text: 'It copies a table\'s schema without any of its data.', isCorrect: false },
    ],
    explanation: 'MERGE joins source to target on a key and applies the right action per row in one pass: `WHEN MATCHED` (update), `WHEN NOT MATCHED BY TARGET` (insert), `WHEN NOT MATCHED BY SOURCE` (delete/expire). That all-in-one upsert is why it is the backbone of dimension/fact loads.',
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
      { id: 'a', text: 'BY TARGET = a source row with no match in the target (typically INSERT a new row); BY SOURCE = a target row with no match in the source (typically DELETE or expire it).', isCorrect: true },
      { id: 'b', text: 'They are synonyms; both refer to rows present in neither table.', isCorrect: false },
      { id: 'c', text: 'BY TARGET deletes target rows; BY SOURCE inserts source rows.', isCorrect: false },
      { id: 'd', text: 'BY SOURCE only works on temp tables, while BY TARGET only works on permanent tables.', isCorrect: false },
    ],
    explanation: '`WHEN NOT MATCHED BY TARGET` = the source has a row the target lacks → insert it. `WHEN NOT MATCHED BY SOURCE` = the target has a row the source lacks → it has disappeared upstream, so delete or expire it. Plain `WHEN NOT MATCHED` defaults to BY TARGET.',
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
    question: 'Fill in the MERGE skeleton: target, source, join key, then the matched/not-matched actions.',
    template: `___ dbo.DimCustomer AS tgt
___ stg.Customer AS src
    ___ tgt.CustomerId = src.CustomerId
WHEN MATCHED THEN
    UPDATE SET tgt.FullName = src.FullName
WHEN NOT MATCHED BY TARGET THEN
    INSERT (CustomerId, FullName) VALUES (src.CustomerId, src.FullName);`,
    blanks: ['MERGE', 'USING', 'ON'],
    solution: `MERGE dbo.DimCustomer AS tgt
USING stg.Customer AS src
    ON tgt.CustomerId = src.CustomerId
WHEN MATCHED THEN
    UPDATE SET tgt.FullName = src.FullName
WHEN NOT MATCHED BY TARGET THEN
    INSERT (CustomerId, FullName) VALUES (src.CustomerId, src.FullName);`,
    explanation: 'The frame is always `MERGE <target> USING <source> ON <key>` followed by `WHEN …` action clauses. Here matched customers get their name overwritten and brand-new ones are inserted — a Type 1 upsert.',
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
    question: 'Fill in the extra predicate so matched rows are only UPDATEd when a tracked column actually changed (avoids pointless writes).',
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
    explanation: 'A `WHEN MATCHED AND <condition>` adds a filter to the matched branch, so the UPDATE fires only when `City` actually differs. This avoids rewriting unchanged rows — cheaper, and it stops a change-tracking trigger or SCD2 step from logging no-op "changes".',
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
    explanation: '`WHEN NOT MATCHED BY SOURCE` fires for target rows that have no match in the source - they have disappeared upstream. `DELETE` removes them, completing a full three-way sync: matched rows update, source-only rows insert, target-only rows delete.',
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
    template: `MERGE dbo.DimProduct AS tgt
USING stg.Product AS src
    ON tgt.ProductCode = src.ProductCode
WHEN MATCHED THEN
    UPDATE SET tgt.ProductName = src.ProductName
WHEN NOT MATCHED BY TARGET THEN
    INSERT (ProductCode, ProductName) VALUES (src.ProductCode, src.ProductName)
___ ___, inserted.ProductCode, deleted.ProductCode INTO @Changes;`,
    blanks: ['OUTPUT', '$action'],
    solution: `MERGE dbo.DimProduct AS tgt
USING stg.Product AS src
    ON tgt.ProductCode = src.ProductCode
WHEN MATCHED THEN
    UPDATE SET tgt.ProductName = src.ProductName
WHEN NOT MATCHED BY TARGET THEN
    INSERT (ProductCode, ProductName) VALUES (src.ProductCode, src.ProductName)
OUTPUT $action, inserted.ProductCode, deleted.ProductCode INTO @Changes;`,
    explanation: 'Added after all the WHEN clauses (still before the terminating semicolon), `OUTPUT` on a MERGE exposes `$action` - the literal text \'INSERT\', \'UPDATE\', or \'DELETE\' - alongside the usual `inserted`/`deleted` pseudo-tables, so you can audit exactly what the statement did to each row.',
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
    starterCode: `-- MERGE dbo.DimProduct AS tgt USING stg.Product AS src ON ...
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
    DELETE;`,
    explanation: 'All three branches make this a full sync: matched products are refreshed, source-only products are inserted (`BY TARGET`), and target-only products — gone from the source — are deleted (`BY SOURCE`). One statement keeps the dimension a faithful mirror of staging. (A `MERGE` statement must end with a semicolon.)',
    hints: ['Three WHEN clauses: MATCHED, NOT MATCHED BY TARGET, NOT MATCHED BY SOURCE', 'BY SOURCE → DELETE'],
    tags: ['tsql', 'merge', 'upsert', 'sync'],
  },
];
