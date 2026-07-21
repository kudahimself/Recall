/**
 * Topic.TSQL_AGGREGATION — SQL for Data Engineering (T-SQL).
 * Pillar 1 (Querying Foundations): GROUP BY, COUNT/SUM/AVG/MIN/MAX, HAVING,
 * COUNT(DISTINCT).
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const tsql_aggregation_questions: Question[] = [
  {
    id: 'tsql-agg-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TSQL_AGGREGATION,
    course: Course.SQL,
    question: 'When using GROUP BY, which statement is correct about non-aggregated columns and filtering?',
    options: [
      { id: 'a', text: 'Every non-aggregated column in the SELECT must appear in GROUP BY; WHERE filters rows before grouping, HAVING filters groups after.', isCorrect: true },
      { id: 'b', text: 'Non-aggregated columns may be selected freely; HAVING filters rows before grouping and WHERE filters after.', isCorrect: false },
      { id: 'c', text: 'GROUP BY automatically aggregates every column, so no column ever needs to be listed twice.', isCorrect: false },
      { id: 'd', text: 'WHERE and HAVING are interchangeable; use whichever reads better in the query.', isCorrect: false },
    ],
    explanation: 'A grouped query collapses rows per group, so any column you SELECT that is not inside an aggregate must be in GROUP BY (otherwise it is ambiguous). `WHERE` runs first, filtering individual rows; `HAVING` runs after grouping, filtering on aggregate results like `SUM(...) > 1000`.',
    hints: ['Non-aggregated SELECT cols → must be in GROUP BY', 'WHERE before grouping, HAVING after'],
    tags: ['tsql', 'aggregation', 'group-by', 'having'],
  },
  {
    id: 'tsql-agg-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TSQL_AGGREGATION,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'What single value does this query return?',
    code: `SELECT SUM(v.amt) AS Total
FROM (VALUES (10), (20), (30)) AS v(amt);`,
    expectedOutput: `60`,
    explanation: 'With no GROUP BY, the aggregate applies to the whole result as one group: `SUM(amt)` = 10 + 20 + 30 = 60.',
    hints: ['No GROUP BY → one group over all rows'],
    tags: ['tsql', 'aggregation', 'sum', 'predict'],
  },
  {
    id: 'tsql-agg-minmaxavg-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TSQL_AGGREGATION,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'What does this query output (one row, three columns)?',
    code: `SELECT MIN(v.amt) AS Lo, MAX(v.amt) AS Hi, AVG(v.amt) AS Avg
FROM (VALUES (10), (20), (30)) AS v(amt);`,
    expectedOutput: `Lo=10, Hi=30, Avg=20`,
    explanation: '`MIN` and `MAX` return the smallest and largest value in the group; `AVG` returns the arithmetic mean (10+20+30)/3 = 20. Like `SUM` and `COUNT`, all three collapse a set of rows into a single value per group.',
    hints: ['MIN/MAX = smallest/largest value', 'AVG = arithmetic mean'],
    tags: ['tsql', 'aggregation', 'min', 'max', 'avg', 'predict'],
  },
  {
    id: 'tsql-agg-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TSQL_AGGREGATION,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the aggregate function and the clause that groups rows by category.',
    template: `SELECT Category, ___(*) AS NumProducts
FROM dbo.DimProduct
___ ___ Category;`,
    blanks: ['COUNT', 'GROUP', 'BY'],
    solution: `SELECT Category, COUNT(*) AS NumProducts
FROM dbo.DimProduct
GROUP BY Category;`,
    explanation: '`COUNT(*)` counts rows per group; `GROUP BY Category` defines the groups. Because `Category` is selected un-aggregated, it must appear in `GROUP BY`.',
    hints: ['Row-counting aggregate', 'The two-word clause that forms groups'],
    tags: ['tsql', 'aggregation', 'count', 'group-by', 'cloze'],
  },
  {
    id: 'tsql-agg-having-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_AGGREGATION,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the clause that filters groups by their aggregated total.',
    template: `SELECT CustomerKey, SUM(Amount) AS Total
FROM dbo.FactOrders
GROUP BY CustomerKey
___ SUM(Amount) > 1000;`,
    blanks: ['HAVING'],
    solution: `SELECT CustomerKey, SUM(Amount) AS Total
FROM dbo.FactOrders
GROUP BY CustomerKey
HAVING SUM(Amount) > 1000;`,
    explanation: '`HAVING` filters AFTER grouping, so it can reference aggregates like `SUM(Amount)`. A `WHERE` clause cannot — it runs before the groups exist.',
    hints: ['Post-grouping filter on an aggregate'],
    tags: ['tsql', 'aggregation', 'having', 'cloze'],
  },
  {
    id: 'tsql-agg-distinct-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_AGGREGATION,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'What single value does this query return?',
    code: `SELECT COUNT(DISTINCT v.c) AS n
FROM (VALUES ('x'), ('y'), ('x'), ('z'), ('y')) AS v(c);`,
    expectedOutput: `3`,
    explanation: '`COUNT(DISTINCT c)` counts unique values only: the distinct set is {x, y, z}, so the answer is 3. A plain `COUNT(c)` would return 5.',
    hints: ['Count unique values, not rows'],
    tags: ['tsql', 'aggregation', 'count-distinct', 'predict'],
  },
  {
    id: 'tsql-agg-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_AGGREGATION,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'From `dbo.FactOrders` (CustomerKey, Amount), return each CustomerKey and their total Amount (aliased `Total`), keeping only customers whose total exceeds 1000, ordered by Total descending.',
    starterCode: `-- dbo.FactOrders(CustomerKey, Amount)
-- Return CustomerKey and total Amount (aliased Total) for customers with total > 1000, ordered by Total DESC
`,
    testCases: [
      {
        input: 'GROUP BY CustomerKey HAVING SUM(Amount) > 1000 ORDER BY Total DESC',
        expectedOutput: 'High-value customers by total spend',
        description: 'GROUP BY + SUM + HAVING + ORDER BY',
      },
    ],
    solution: `SELECT CustomerKey, SUM(Amount) AS Total
FROM dbo.FactOrders
GROUP BY CustomerKey
HAVING SUM(Amount) > 1000
ORDER BY Total DESC;`,
    tieredHints: {
      apiSignature: 'SELECT col, SUM(col2) FROM tbl GROUP BY col HAVING SUM(col2) > val ORDER BY alias ASC|DESC;',
      skeleton: `SELECT ____, ____(Amount) AS ____
FROM dbo.FactOrders
____ BY ____
____ ____(Amount) ____ 1000
____ BY ____ ____;`,
    },
    explanation: 'Group by customer, sum their amounts, filter the groups with `HAVING SUM(Amount) > 1000`, then sort by the computed total. `HAVING` (not `WHERE`) is required because the filter is on an aggregate.',
    hints: ['SUM per CustomerKey', 'HAVING for the aggregate filter, then ORDER BY Total DESC'],
    tags: ['tsql', 'aggregation', 'group-by', 'having', 'sum'],
  },
];
