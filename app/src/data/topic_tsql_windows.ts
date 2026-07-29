/**
 * Topic.TSQL_WINDOWS — SQL for Data Engineering (T-SQL).
 * Pillar 3 (Analytical & Window SQL): OVER / PARTITION BY / ORDER BY,
 * ROW_NUMBER / RANK / DENSE_RANK / NTILE.
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const tsql_windows_questions: Question[] = [
  {
    id: 'tsql-windows-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_WINDOWS,
    course: Course.SQL,
    question: 'How do ROW_NUMBER, RANK, and DENSE_RANK differ when the ORDER BY has ties?',
    options: [
      { id: 'a', text: 'ROW_NUMBER gives every row a unique number even on ties; RANK repeats a rank for ties then skips (1,1,3); DENSE_RANK repeats without skipping (1,1,2).', isCorrect: true },
      { id: 'b', text: 'All three behave identically on ties; the names are interchangeable aliases.', isCorrect: false },
      { id: 'c', text: 'ROW_NUMBER skips numbers on ties; RANK and DENSE_RANK both give every row a unique sequential number.', isCorrect: false },
      { id: 'd', text: 'RANK never produces ties; DENSE_RANK requires a PARTITION BY; ROW_NUMBER cannot be used with ORDER BY.', isCorrect: false },
    ],
    explanation: 'On ties: ROW_NUMBER is arbitrary-but-unique (1,2,3,4). RANK gives tied rows the same rank and then leaves a gap (1,1,3). DENSE_RANK gives tied rows the same rank with no gap (1,1,2). Pick ROW_NUMBER for dedup/top-1, RANK/DENSE_RANK for leaderboards.',
    hints: ['ROW_NUMBER = always unique', 'RANK skips after ties, DENSE_RANK does not'],
    tags: ['tsql', 'windows', 'row-number', 'rank', 'dense-rank'],
  },
  {
    id: 'tsql-windows-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_WINDOWS,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'What does this query output (one value per line)?',
    code: `SELECT RANK() OVER (ORDER BY v.score DESC) AS rnk
FROM (VALUES (90), (90), (80), (70)) AS v(score)
ORDER BY rnk;`,
    expectedOutput: `1
1
3
4`,
    explanation: 'RANK gives the two 90s the same rank (1), then SKIPS to 3 for the next value (80), then 4 (70). The gap after the tie is what distinguishes RANK from DENSE_RANK (which would give 1,1,2,3).',
    hints: ['Ties share a rank; RANK then leaves a gap'],
    tags: ['tsql', 'windows', 'rank', 'predict'],
  },
  {
    id: 'tsql-windows-predict-2',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_WINDOWS,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'What does this query output (one value per line)?',
    code: `SELECT DENSE_RANK() OVER (ORDER BY v.score DESC) AS drnk
FROM (VALUES (90), (90), (80), (70)) AS v(score)
ORDER BY drnk;`,
    expectedOutput: `1
1
2
3`,
    explanation: 'DENSE_RANK gives tied rows the same rank but does NOT leave a gap afterward, so the sequence is 1,1,2,3. Compare RANK on the same data: 1,1,3,4.',
    hints: ['Same rank for ties, no gap after'],
    tags: ['tsql', 'windows', 'dense-rank', 'predict'],
  },
  {
    id: 'tsql-windows-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_WINDOWS,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the window keywords: number each customer\'s orders from their largest amount down.',
    template: `-- dbo.FactOrders(OrderId, CustomerKey, ProductKey, OrderDate, Amount)
SELECT CustomerKey, OrderId, Amount,
       ROW_NUMBER() ___ (___ ___ CustomerKey ORDER BY Amount DESC) AS rn
FROM dbo.FactOrders;`,
    blanks: ['OVER', 'PARTITION', 'BY'],
    solution: `SELECT CustomerKey, OrderId, Amount,
       ROW_NUMBER() OVER (PARTITION BY CustomerKey ORDER BY Amount DESC) AS rn
FROM dbo.FactOrders;`,
    explanation: '`OVER (PARTITION BY CustomerKey ORDER BY Amount DESC)` restarts the numbering for each customer and orders within that partition by amount — so `rn = 1` is each customer\'s biggest order.',
    hints: ['OVER opens the window', 'PARTITION BY restarts per group'],
    tags: ['tsql', 'windows', 'row-number', 'partition-by', 'cloze'],
  },
  {
    id: 'tsql-windows-mcq-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_WINDOWS,
    course: Course.SQL,
    question: 'How does a window function differ from a GROUP BY aggregate?',
    options: [
      { id: 'a', text: 'A window function computes across a set of rows but returns a value for EVERY row (no collapsing); GROUP BY returns one row per group.', isCorrect: true },
      { id: 'b', text: 'A window function always collapses rows like GROUP BY but is faster; the OVER clause is just a performance hint.', isCorrect: false },
      { id: 'c', text: 'A window function can only be used in the WHERE clause; GROUP BY can only be used in SELECT.', isCorrect: false },
      { id: 'd', text: 'There is no difference; OVER(...) is an alias for GROUP BY with the same column list.', isCorrect: false },
    ],
    explanation: 'The key distinction: a window function keeps every detail row and attaches a computed value (rank, running total, lag) alongside it, whereas GROUP BY collapses each group to a single summary row. That is why you can show both the row and its rank in one result.',
    hints: ['Window = value per row, no collapsing', 'GROUP BY = one row per group'],
    tags: ['tsql', 'windows', 'group-by'],
  },
  {
    id: 'tsql-windows-ntile-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_WINDOWS,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the argument that splits the rows into four equal buckets (quartiles).',
    template: `-- dbo.DimProduct(ProductKey, ProductCode, ProductName, Category, Price)
SELECT ProductName, Price,
       NTILE(___) OVER (ORDER BY Price DESC) AS Quartile
FROM dbo.DimProduct;`,
    blanks: ['4'],
    solution: `SELECT ProductName, Price,
       NTILE(4) OVER (ORDER BY Price DESC) AS Quartile
FROM dbo.DimProduct;`,
    explanation: '`NTILE(n)` distributes the ordered rows into `n` roughly equal groups, labelling each row 1..n. `NTILE(4)` gives quartiles — the most expensive quarter is bucket 1.',
    hints: ['Quartiles = how many buckets?'],
    tags: ['tsql', 'windows', 'ntile', 'cloze'],
  },
  {
    id: 'tsql-windows-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_WINDOWS,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'From `dbo.DimProduct` (Category, ProductName, Price), return Category, ProductName, Price and a column `Rnk` that ranks products by Price descending WITHIN each Category (tied prices share a rank, with gaps).',
    starterCode: `-- Return Category, ProductName, Price, and Rnk (Price DESC per Category)
`,
    testCases: [
      {
        input: 'RANK() OVER (PARTITION BY Category ORDER BY Price DESC)',
        expectedOutput: 'Per-category price ranking with gaps on ties',
        description: 'RANK partitioned by category',
      },
    ],
    solution: `SELECT Category, ProductName, Price,
       RANK() OVER (PARTITION BY Category ORDER BY Price DESC) AS Rnk
FROM dbo.DimProduct;`,
    explanation: '`RANK()` gives gaps on ties (the prompt asked for that); `PARTITION BY Category` restarts the ranking per category; `ORDER BY Price DESC` makes rank 1 the most expensive. Every product row is retained — that is the window-function advantage over GROUP BY.',
    hints: ['RANK() for tie-with-gap', 'PARTITION BY Category ORDER BY Price DESC'],
    tieredHints: {
      apiSignature: 'RANK() OVER (PARTITION BY partition_expr, ... ORDER BY sort_expr [ASC|DESC], ...)',
      skeleton: `SELECT ____, ____, ____,
       ____() OVER (PARTITION BY ____ ORDER BY ____ ____) AS ____
FROM dbo.DimProduct;`,
    },
    requires: [/OVER/i, /\bRANK\s*\(/i],
    tags: ['tsql', 'windows', 'rank', 'partition-by'],
  },
];
