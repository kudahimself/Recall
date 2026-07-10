/**
 * Topic.TSQL_QUALITY — SQL for Data Engineering (T-SQL).
 * Pillar 6 (ELT & Transformation): in-SQL data-quality assertions
 * (null / uniqueness / referential), EXCEPT-based diffs.
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const tsql_quality_questions: Question[] = [
  {
    id: 'tsql-quality-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_QUALITY,
    course: Course.SQL,
    question: 'A staging table should have one row per `OrderId`. What query proves whether that uniqueness holds?',
    options: [
      { id: 'a', text: '`SELECT OrderId FROM stg.Orders GROUP BY OrderId HAVING COUNT(*) > 1;` — any rows returned are duplicate keys.', isCorrect: true },
      { id: 'b', text: '`SELECT DISTINCT OrderId FROM stg.Orders;` — if it runs, the keys are unique.', isCorrect: false },
      { id: 'c', text: '`SELECT COUNT(*) FROM stg.Orders;` — a non-zero count proves uniqueness.', isCorrect: false },
      { id: 'd', text: '`SELECT TOP (1) OrderId FROM stg.Orders;` — one row means the key is unique.', isCorrect: false },
    ],
    explanation: 'Group by the key and keep groups with `COUNT(*) > 1`: every returned row is a key that appears more than once. `DISTINCT` and `COUNT(*)` just hide duplicates rather than surfacing them. This GROUP BY/HAVING pattern is the standard uniqueness assertion in a data-quality gate.',
    hints: ['GROUP BY key HAVING COUNT(*) > 1', 'Returned rows = duplicate keys'],
    tags: ['tsql', 'quality', 'uniqueness', 'having'],
  },
  {
    id: 'tsql-quality-mcq-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_QUALITY,
    course: Course.SQL,
    question: 'How do you find orphaned facts — fact rows whose `CustomerKey` has no matching row in `dbo.DimCustomer` (a referential-integrity check)?',
    options: [
      { id: 'a', text: 'LEFT JOIN the fact to the dimension and keep rows where the dimension key `IS NULL` (or use NOT EXISTS).', isCorrect: true },
      { id: 'b', text: 'INNER JOIN the fact to the dimension; the rows it returns are the orphans.', isCorrect: false },
      { id: 'c', text: 'Count both tables and compare the totals; if they differ, every fact is an orphan.', isCorrect: false },
      { id: 'd', text: 'Use SELECT DISTINCT CustomerKey, which lists only the orphaned keys.', isCorrect: false },
    ],
    explanation: 'A `LEFT JOIN` from fact to dimension yields NULL on the dimension side when no match exists, so `WHERE d.CustomerKey IS NULL` isolates the orphans (equivalently `NOT EXISTS`). An INNER JOIN does the opposite — it keeps only the rows that DO match.',
    hints: ['LEFT JOIN then WHERE dim key IS NULL', 'Or NOT EXISTS'],
    tags: ['tsql', 'quality', 'referential-integrity', 'left-join'],
  },
  {
    id: 'tsql-quality-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_QUALITY,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the set operator that returns rows in the source but NOT in the target (a load-diff check).',
    template: `SELECT CustomerId, FullName FROM stg.Customer
___
SELECT CustomerId, FullName FROM dbo.DimCustomer;`,
    blanks: ['EXCEPT'],
    solution: `SELECT CustomerId, FullName FROM stg.Customer
EXCEPT
SELECT CustomerId, FullName FROM dbo.DimCustomer;`,
    explanation: '`EXCEPT` returns the distinct rows from the first query that do not appear in the second — a quick "what is in source but missing/different in target" diff. Reversing the two queries finds rows in the target absent from the source. It compares whole rows and ignores duplicates.',
    hints: ['Rows in the first query not in the second', 'The set-difference operator'],
    tags: ['tsql', 'quality', 'except', 'diff', 'cloze'],
  },
  {
    id: 'tsql-quality-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_QUALITY,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Write a data-quality check that returns, from `dbo.FactSales`, the count of rows that fail validation: either `Amount` is NULL or `Amount < 0`. Return the count aliased as `BadRows`.',
    starterCode: `-- SELECT COUNT(*) AS BadRows FROM dbo.FactSales WHERE ...
`,
    testCases: [
      {
        input: 'COUNT(*) WHERE Amount IS NULL OR Amount < 0',
        expectedOutput: 'Count of invalid amount rows',
        description: 'Null + range data-quality assertion',
      },
    ],
    solution: `SELECT COUNT(*) AS BadRows
FROM dbo.FactSales
WHERE Amount IS NULL OR Amount < 0;`,
    explanation: 'A data-quality assertion counts the rows that break a rule; a load gate then fails (or quarantines) when `BadRows > 0`. Note `Amount IS NULL` must be tested explicitly — `Amount < 0` alone would silently ignore NULLs because any comparison with NULL is unknown, not true.',
    hints: ['COUNT(*) of the rule-breakers', 'WHERE Amount IS NULL OR Amount < 0'],
    tags: ['tsql', 'quality', 'null-handling', 'assertion'],
  },
];
