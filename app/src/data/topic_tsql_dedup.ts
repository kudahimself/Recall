/**
 * Topic.TSQL_DEDUP — SQL for Data Engineering (T-SQL).
 * Pillar 6 (ELT & Transformation): dedup via CTE + ROW_NUMBER() +
 * WHERE rn = 1, DELETE from a CTE.
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

// Customer 'C-001' was extracted twice; the later extract has the corrected name.
const STG_CUSTOMER_VERSIONS = {
  name: 'stg.Customer',
  columns: ['CustomerId', 'FullName', 'UpdatedAt'],
  rows: [
    ['C-001', 'Ingrid Berg', '2026-10-01'],
    ['C-001', 'Ingrid Berg-Holm', '2026-11-01'],
    ['C-003', 'Sofia Lind', '2026-09-15'],
  ],
};

export const tsql_dedup_questions: Question[] = [
  {
    id: 'tsql-dedup-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_DEDUP,
    course: Course.SQL,
    question: 'T-SQL has no `QUALIFY`. What is the standard way to keep only the latest row per key (dedup)?',
    options: [
      { id: 'a', text: 'Number rows with `ROW_NUMBER() OVER (PARTITION BY key ORDER BY <recency> DESC)` in a CTE, then filter `WHERE rn = 1`.', isCorrect: true },
      { id: 'b', text: 'Use `SELECT DISTINCT *`, which keeps one row per key because it compares only the key.', isCorrect: false },
      { id: 'c', text: 'Use `GROUP BY key` and select the other columns directly, which returns their latest values.', isCorrect: false },
      { id: 'd', text: 'Use `TOP (1)` once over the whole table, which keeps the newest row for every key.', isCorrect: false },
    ],
    explanation: 'The portable T-SQL dedup is `ROW_NUMBER()` partitioned by the dedup key, ordered so the row you want gets rn = 1, wrapped in a CTE and filtered `WHERE rn = 1`. `DISTINCT` compares whole rows, so two versions of a key that differ in any column both survive. You cannot select unaggregated columns alongside a `GROUP BY`. `TOP (1)` returns a single row for the whole table, not one per key.',
    hints: ['ROW_NUMBER() PARTITION BY key ORDER BY recency', 'CTE then WHERE rn = 1'],
    tags: ['tsql', 'dedup', 'row-number'],
  },
  {
    id: 'tsql-dedup-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_DEDUP,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Staging holds several versions of the same order, and the query keeps the latest one. What does it return? Write one row per line in the ORDER BY order, as OrderId and Amount separated by a comma.',
    tables: [
      {
        name: 'stg.Orders',
        columns: ['OrderId', 'Amount', 'UpdatedAt'],
        rows: [[1, 40, '2026-03-01'], [1, 10, '2026-03-02'], [2, 20, '2026-03-01']],
      },
    ],
    code: `WITH ranked AS (
    SELECT OrderId, Amount,
           ROW_NUMBER() OVER (PARTITION BY OrderId ORDER BY UpdatedAt DESC) AS rn
    FROM stg.Orders
)
SELECT OrderId, Amount
FROM ranked
WHERE rn = 1
ORDER BY OrderId;`,
    expectedOutput: `1, 10
2, 20`,
    explanation: 'The window is ordered by UpdatedAt, not by Amount. For order 1 the newest version is the one from 2026-03-02, so it gets rn = 1 and its Amount is 10; the earlier Amount of 40 is rn = 2 and is dropped. Order 2 has a single row, which is rn = 1. Filtering `rn = 1` keeps one row per order, the latest.',
    hints: ['rn = 1 is the newest UpdatedAt per OrderId', 'Which version of order 1 is newest?'],
    tags: ['tsql', 'dedup', 'row-number', 'predict'],
  },
  {
    id: 'tsql-dedup-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_DEDUP,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the window keyword and the comparison so only the most recent row per CustomerId survives.',
    tables: [STG_CUSTOMER_VERSIONS],
    template: `WITH ranked AS (
    SELECT *,
           ROW_NUMBER() OVER (___ CustomerId ORDER BY UpdatedAt DESC) AS rn
    FROM stg.Customer
)
SELECT CustomerId, FullName
FROM ranked
WHERE rn ___ 1;`,
    blanks: ['PARTITION BY', '='],
    blankAlternates: [[], ['<=']],
    solution: `WITH ranked AS (
    SELECT *,
           ROW_NUMBER() OVER (PARTITION BY CustomerId ORDER BY UpdatedAt DESC) AS rn
    FROM stg.Customer
)
SELECT CustomerId, FullName
FROM ranked
WHERE rn = 1;`,
    explanation: '`PARTITION BY CustomerId` restarts the numbering for each customer and `ORDER BY UpdatedAt DESC` puts the newest extract first, so `rn = 1` is the latest row per customer: here C-001 keeps Ingrid Berg-Holm, not the older Ingrid Berg. Filtering `WHERE rn = 1` in the outer query is the dedup.',
    hints: ['Restart numbering per key → PARTITION BY', 'Keep the top row → WHERE rn = 1'],
    tags: ['tsql', 'dedup', 'row-number', 'cloze'],
  },
  {
    id: 'tsql-dedup-delete-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TSQL_DEDUP,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the statement that removes rows directly through a CTE reference (rather than selecting from it), so the older versions of each customer are deleted from staging.',
    tables: [STG_CUSTOMER_VERSIONS],
    template: `WITH d AS (
    SELECT ROW_NUMBER() OVER (PARTITION BY CustomerId ORDER BY UpdatedAt DESC) AS rn
    FROM stg.Customer
)
___ FROM d
WHERE rn > 1;`,
    blanks: ['DELETE'],
    solution: `WITH d AS (
    SELECT ROW_NUMBER() OVER (PARTITION BY CustomerId ORDER BY UpdatedAt DESC) AS rn
    FROM stg.Customer
)
DELETE FROM d
WHERE rn > 1;`,
    explanation: 'A CTE can be the target of a DELETE, not just a SELECT source. `DELETE FROM d` removes rows from the underlying `stg.Customer` wherever the CTE\'s computed `rn` says `rn > 1` (the duplicates): here the older Ingrid Berg row goes, leaving exactly one row per customer. It is a physical cleanup rather than just filtering a read.',
    hints: ['The CTE stands in for the table it was built from', 'DELETE can target a CTE directly'],
    tags: ['tsql', 'dedup', 'delete', 'cte', 'cloze'],
  },
  {
    id: 'tsql-dedup-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TSQL_DEDUP,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Physically remove duplicate rows from `stg.Orders`, keeping for each `OrderId` only the row with the most recent `UpdatedAt`. Use a CTE named `d` with ROW_NUMBER() and DELETE the rows where rn > 1.',
    tables: [
      {
        name: 'stg.Orders',
        columns: ['OrderId', 'Amount', 'UpdatedAt'],
        rows: [[1, 40, '2026-03-01'], [1, 10, '2026-03-02'], [2, 20, '2026-03-01'], [3, 55, '2026-03-02'], [3, 60, '2026-03-04']],
      },
    ],
    starterCode: `-- stg.Orders (OrderId, Amount, UpdatedAt)
`,
    testCases: [
      {
        input: 'CTE with ROW_NUMBER PARTITION BY OrderId ORDER BY UpdatedAt DESC; DELETE rn > 1',
        expectedOutput: 'Only the newest row per OrderId remains',
        description: 'DELETE duplicates from a CTE',
      },
    ],
    solution: `WITH d AS (
    SELECT ROW_NUMBER() OVER (PARTITION BY OrderId ORDER BY UpdatedAt DESC) AS rn
    FROM stg.Orders
)
DELETE FROM d
WHERE rn > 1;
-- OR
WITH d AS (
    SELECT ROW_NUMBER() OVER (PARTITION BY OrderId ORDER BY UpdatedAt DESC) AS rn
    FROM stg.Orders
)
DELETE d
WHERE rn > 1;`,
    tieredHints: {
      apiSignature: 'ROW_NUMBER() OVER (PARTITION BY partition_col ORDER BY sort_col [ASC|DESC])',
      skeleton: `WITH d AS (
    SELECT ROW_NUMBER() OVER (PARTITION BY ____ ORDER BY ____ ____) AS rn
    FROM stg.Orders
)
____ FROM d
WHERE rn > ____;`,
    },
    explanation: 'You can DELETE directly through a CTE in T-SQL: number the rows per `OrderId` (newest first), then delete every row with `rn > 1`, leaving exactly the latest per key. Here the Amount 40 row of order 1 and the Amount 55 row of order 3 go. This is the in-place cleanup of a staging table before it feeds the target load.',
    hints: ['ROW_NUMBER() PARTITION BY OrderId ORDER BY UpdatedAt DESC', 'DELETE FROM the CTE WHERE rn > 1'],
    requires: [/WITH/i, /ROW_NUMBER/i, /PARTITION\s+BY\s+OrderId/i, /DELETE/i],
    tags: ['tsql', 'dedup', 'row-number', 'delete'],
  },
];
