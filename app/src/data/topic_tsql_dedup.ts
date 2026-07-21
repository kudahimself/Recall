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
      { id: 'b', text: 'Use `SELECT DISTINCT *`, which always keeps the most recent row per key.', isCorrect: false },
      { id: 'c', text: 'Use `GROUP BY key` and select the other columns directly without aggregating them.', isCorrect: false },
      { id: 'd', text: 'Use `TOP (1)` once for the whole table to remove all duplicates at once.', isCorrect: false },
    ],
    explanation: 'The portable T-SQL dedup is `ROW_NUMBER()` partitioned by the dedup key, ordered so the row you want gets rn = 1, wrapped in a CTE and filtered `WHERE rn = 1`. `DISTINCT` dedups whole rows (not per-key), and you cannot select unaggregated columns alongside a `GROUP BY`.',
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
    question: 'What does this query output (one value per line)?',
    code: `WITH ranked AS (
    SELECT v.id, v.amt,
           ROW_NUMBER() OVER (PARTITION BY v.id ORDER BY v.amt DESC) AS rn
    FROM (VALUES (1, 10), (1, 40), (2, 20)) AS v(id, amt)
)
SELECT amt FROM ranked WHERE rn = 1
ORDER BY amt;`,
    expectedOutput: `20
40`,
    explanation: 'Within id = 1 the highest amt (40) gets rn = 1; id = 2 has only one row (20, rn = 1). Filtering `rn = 1` keeps 40 and 20; ordered ascending that prints 20 then 40. The 10 is dropped as the duplicate for id = 1.',
    hints: ['rn = 1 is the top amt per id', 'id 1 keeps 40, id 2 keeps 20'],
    tags: ['tsql', 'dedup', 'row-number', 'predict'],
  },
  {
    id: 'tsql-dedup-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_DEDUP,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the window and filter so only the most recent row per CustomerId survives.',
    template: `WITH ranked AS (
    SELECT *,
           ROW_NUMBER() OVER (___ CustomerId ORDER BY LoadedAt DESC) AS rn
    FROM stg.Customer
)
SELECT CustomerId, FullName
FROM ranked
WHERE rn ___ 1;`,
    blanks: ['PARTITION BY', '='],
    solution: `WITH ranked AS (
    SELECT *,
           ROW_NUMBER() OVER (PARTITION BY CustomerId ORDER BY LoadedAt DESC) AS rn
    FROM stg.Customer
)
SELECT CustomerId, FullName
FROM ranked
WHERE rn = 1;`,
    explanation: '`PARTITION BY CustomerId` restarts the numbering for each customer and `ORDER BY LoadedAt DESC` puts the newest load first, so `rn = 1` is the latest row per customer. Filtering `WHERE rn = 1` in the outer query is the dedup.',
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
    question: 'Fill in the statement that removes rows directly through a CTE reference (rather than selecting from it).',
    template: `WITH d AS (
    SELECT ROW_NUMBER() OVER (PARTITION BY CustomerId ORDER BY LoadedAt DESC) AS rn
    FROM stg.Customer
)
___ FROM d
WHERE rn > 1;`,
    blanks: ['DELETE'],
    solution: `WITH d AS (
    SELECT ROW_NUMBER() OVER (PARTITION BY CustomerId ORDER BY LoadedAt DESC) AS rn
    FROM stg.Customer
)
DELETE FROM d
WHERE rn > 1;`,
    explanation: 'A CTE can be the target of a DELETE, not just a SELECT source. `DELETE FROM d` removes rows from the underlying `stg.Customer` wherever the CTE\'s computed `rn` says `rn > 1` (the duplicates), leaving exactly one row per key - a physical cleanup rather than just filtering a read.',
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
    question: 'Physically remove duplicate rows from `stg.Orders`, keeping for each `OrderId` only the row with the most recent `UpdatedAt`. Use a CTE with ROW_NUMBER() and DELETE the rows where rn > 1.',
    starterCode: `-- WITH d AS ( SELECT ROW_NUMBER() OVER (...) AS rn FROM stg.Orders )  DELETE FROM d WHERE rn > 1;
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
    explanation: 'You can DELETE directly through a CTE in T-SQL: number the rows per `OrderId` (newest first), then delete every row with `rn > 1`, leaving exactly the latest per key. This is the in-place cleanup of a staging table before it feeds the target load.',
    hints: ['ROW_NUMBER() PARTITION BY OrderId ORDER BY UpdatedAt DESC', 'DELETE FROM the CTE WHERE rn > 1'],
    tags: ['tsql', 'dedup', 'row-number', 'delete'],
  },
];
