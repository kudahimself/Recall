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
import { sampleTable } from './tsqlSampleTables';

export const tsql_quality_questions: Question[] = [
  {
    id: 'tsql-quality-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_QUALITY,
    course: Course.SQL,
    question: 'A staging table should have one row per `OrderId`. What query proves whether that uniqueness holds?',
    options: [
      { id: 'a', text: '`SELECT OrderId FROM stg.Orders GROUP BY OrderId HAVING COUNT(*) > 1;`, where any row returned is a duplicate key.', isCorrect: true },
      { id: 'b', text: '`SELECT DISTINCT OrderId FROM stg.Orders;`, where a successful run shows the keys are unique.', isCorrect: false },
      { id: 'c', text: '`SELECT COUNT(*) FROM stg.Orders;`, where a count equal to the source row count shows the keys are unique.', isCorrect: false },
      { id: 'd', text: '`SELECT OrderId FROM stg.Orders GROUP BY OrderId HAVING COUNT(*) = 1;`, where any row returned is a duplicate key.', isCorrect: false },
    ],
    explanation: 'Group by the key and keep groups with `COUNT(*) > 1`: every returned row is a key that appears more than once. `DISTINCT` just hides duplicates rather than surfacing them, and a plain row count says nothing about which keys repeat (a copy of the source has the same count). `HAVING COUNT(*) = 1` returns the keys that appear exactly once, the opposite of what you want. This GROUP BY/HAVING pattern is the standard uniqueness assertion in a data-quality gate.',
    hints: ['GROUP BY key HAVING COUNT(*) > 1', 'Returned rows = duplicate keys'],
    tags: ['tsql', 'quality', 'uniqueness', 'having'],
  },
  {
    id: 'tsql-quality-mcq-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_QUALITY,
    course: Course.SQL,
    question: 'How do you find orphaned facts: fact rows whose `CustomerKey` has no matching row in `dbo.DimCustomer` (a referential-integrity check)?',
    options: [
      { id: 'a', text: 'LEFT JOIN the fact to the dimension and keep the rows where the dimension key `IS NULL` (or use NOT EXISTS).', isCorrect: true },
      { id: 'b', text: 'INNER JOIN the fact to the dimension, and the rows it returns are the orphans.', isCorrect: false },
      { id: 'c', text: 'RIGHT JOIN the fact to the dimension and keep the rows where the fact key `IS NULL`.', isCorrect: false },
      { id: 'd', text: 'LEFT JOIN the fact to the dimension and keep the rows where the dimension key `IS NOT NULL`.', isCorrect: false },
    ],
    explanation: 'A `LEFT JOIN` from fact to dimension yields NULL on the dimension side when no match exists, so `WHERE d.CustomerKey IS NULL` isolates the orphans (equivalently `NOT EXISTS`). An INNER JOIN, or `IS NOT NULL` after a LEFT JOIN, keeps only the rows that DO match. A RIGHT JOIN with the fact key `IS NULL` finds the opposite problem: dimension rows that no fact uses.',
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
    question: 'Fill in the set operator that returns the rows in the source (staging) that are NOT in the target (the dimension), a load-diff check.',
    tables: [
      sampleTable('stg.Customer', ['CustomerId', 'FullName']),
      sampleTable('dbo.DimCustomer', ['CustomerId', 'FullName']),
    ],
    template: `SELECT CustomerId, FullName FROM stg.Customer
___
SELECT CustomerId, FullName FROM dbo.DimCustomer;`,
    blanks: ['EXCEPT'],
    solution: `SELECT CustomerId, FullName FROM stg.Customer
EXCEPT
SELECT CustomerId, FullName FROM dbo.DimCustomer;`,
    explanation: '`EXCEPT` returns the distinct rows from the first query that do not appear in the second, a quick "what is in source but missing or different in target" diff. Here it returns C-009 Tom Reyes, the one staging customer the dimension lacks. Reversing the two queries finds rows in the target absent from the source. It compares whole rows and ignores duplicates.',
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
    tables: [
      {
        name: 'dbo.FactSales',
        columns: ['OrderId', 'Amount'],
        rows: [[1, 120.0], [2, -15.0], [3, null], [4, 0], [5, 89.5]],
      },
    ],
    starterCode: `-- dbo.FactSales (OrderId, Amount)
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
WHERE Amount IS NULL OR Amount < 0;
-- OR
SELECT COUNT(*) AS BadRows
FROM dbo.FactSales
WHERE Amount < 0 OR Amount IS NULL;`,
    tieredHints: {
      apiSignature: 'SELECT COUNT(*) FROM tbl WHERE col IS NULL OR col < val;',
      skeleton: `SELECT COUNT(*) AS ____
FROM dbo.FactSales
WHERE Amount ____ ____ OR Amount ____ 0;`,
    },
    explanation: 'A data-quality assertion counts the rows that break a rule; a load gate then fails (or quarantines) when `BadRows > 0`. On the shown rows the answer is 2 (order 2 is negative, order 3 is missing). Note `Amount IS NULL` must be tested explicitly: `Amount < 0` alone would silently ignore NULLs because any comparison with NULL is unknown, not true.',
    hints: ['COUNT(*) of the rule-breakers', 'WHERE Amount IS NULL OR Amount < 0'],
    requires: [/COUNT/i, /IS\s+NULL/i],
    tags: ['tsql', 'quality', 'null-handling', 'assertion'],
  },
  {
    id: 'tsql-quality-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_QUALITY,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Write a uniqueness check on `dbo.DimCustomer`: return every `CustomerId` that appears more than once, alongside the count of its occurrences aliased `NumRows`.',
    tables: [
      {
        name: 'dbo.DimCustomer',
        columns: ['CustomerId', 'FullName'],
        rows: [
          ['C-001', 'Ingrid Berg'],
          ['C-002', 'Lars Holm'],
          ['C-001', 'Ingrid Berg-Holm'],
          ['C-004', 'Amara Okafor'],
          ['C-002', 'Lars Holm'],
        ],
      },
    ],
    starterCode: `-- dbo.DimCustomer (CustomerId, FullName)
`,
    testCases: [
      {
        input: 'GROUP BY CustomerId HAVING COUNT(*) > 1',
        expectedOutput: 'Duplicate CustomerId values with their row counts',
        description: 'Uniqueness assertion via GROUP BY / HAVING',
      },
    ],
    solution: `SELECT CustomerId, COUNT(*) AS NumRows
FROM dbo.DimCustomer
GROUP BY CustomerId
HAVING COUNT(*) > 1;
-- OR
SELECT CustomerId, COUNT(*) AS NumRows
FROM dbo.DimCustomer
GROUP BY CustomerId
HAVING COUNT(*) >= 2;`,
    tieredHints: {
      apiSignature: 'SELECT col, COUNT(*) FROM tbl GROUP BY col HAVING COUNT(*) > 1;',
      skeleton: `SELECT ____, COUNT(*) AS ____
FROM dbo.DimCustomer
GROUP BY ____
HAVING COUNT(*) ____ 1;`,
    },
    explanation: 'The uniqueness assertion is the same GROUP BY/HAVING shape used everywhere else in the course: group by the key, and any group with `COUNT(*) > 1` is a violation. Here it returns C-001 and C-002, two rows each. A load gate fails when this query returns any rows.',
    hints: ['GROUP BY CustomerId', 'HAVING COUNT(*) > 1'],
    requires: [/GROUP\s+BY/i, /HAVING/i],
    tags: ['tsql', 'quality', 'uniqueness', 'having'],
  },
  {
    id: 'tsql-quality-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_QUALITY,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'This check is meant to count the sales whose Quantity is missing or negative. What single value does it return?',
    tables: [{
      name: 'dbo.FactSales',
      columns: ['OrderId', 'Quantity'],
      rows: [[1, 3], [2, -1], [3, null], [4, 0], [5, null]],
    }],
    code: `SELECT COUNT(*) AS FailedRows
FROM dbo.FactSales
WHERE Quantity < 0;`,
    expectedOutput: `1`,
    explanation: 'Only order 2 has a Quantity below 0. For orders 3 and 5, NULL < 0 is unknown rather than true, so WHERE drops them, and the check reports 1 instead of the 3 bad rows it was meant to find. A rule about missing values must test them by name: WHERE Quantity IS NULL OR Quantity < 0.',
    hints: ['Is NULL < 0 true?', 'WHERE keeps only rows whose condition is true'],
    tags: ['tsql', 'data-quality', 'null', 'validation', 'predict'],
  },
];
