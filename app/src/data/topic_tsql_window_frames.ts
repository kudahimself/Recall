/**
 * Topic.TSQL_WINDOW_FRAMES — SQL for Data Engineering (T-SQL).
 * Pillar 3 (Analytical & Window SQL): aggregate windows, ROWS/RANGE BETWEEN,
 * running totals, moving averages.
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const tsql_window_frames_questions: Question[] = [
  {
    id: 'tsql-frames-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_WINDOW_FRAMES,
    course: Course.SQL,
    question: 'With `SUM(Amount) OVER (ORDER BY OrderDate)` and no explicit frame, what do you get?',
    options: [
      { id: 'a', text: 'A running total — the default frame is RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW; add an explicit ROWS BETWEEN to control the window precisely.', isCorrect: true },
      { id: 'b', text: 'The grand total repeated on every row, because ORDER BY has no effect inside OVER.', isCorrect: false },
      { id: 'c', text: 'An error — a window aggregate always requires an explicit ROWS BETWEEN clause.', isCorrect: false },
      { id: 'd', text: 'Only the current row\'s Amount, since without PARTITION BY each row is its own window.', isCorrect: false },
    ],
    explanation: 'Adding `ORDER BY` to a window aggregate switches it from "whole partition" to a frame ending at the current row. The implicit default is `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`, which yields a running total. For moving windows you must spell out a `ROWS BETWEEN …` frame (and `ROWS` avoids the tie-peer surprises of `RANGE`).',
    hints: ['ORDER BY in OVER → running aggregate by default', 'default frame = UNBOUNDED PRECEDING to CURRENT ROW'],
    tags: ['tsql', 'window-frames', 'running-total', 'frame'],
  },
  {
    id: 'tsql-frames-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_WINDOW_FRAMES,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'What does this query output (one value per line)?',
    code: `SELECT SUM(v.amt) OVER (ORDER BY v.d) AS running
FROM (VALUES (1, 10), (2, 20), (3, 30)) AS v(d, amt)
ORDER BY v.d;`,
    expectedOutput: `10
30
60`,
    explanation: 'The default frame (UNBOUNDED PRECEDING to CURRENT ROW) makes this a running total: 10, then 10+20=30, then 30+30=60.',
    hints: ['Cumulative sum up to each row'],
    tags: ['tsql', 'window-frames', 'running-total', 'predict'],
  },
  {
    id: 'tsql-frames-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_WINDOW_FRAMES,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the clause that turns SUM into a running total ordered by date.',
    template: `SELECT OrderDate, Amount,
       SUM(Amount) ___ (ORDER BY OrderDate) AS RunningTotal
FROM dbo.FactOrders;`,
    blanks: ['OVER'],
    solution: `SELECT OrderDate, Amount,
       SUM(Amount) OVER (ORDER BY OrderDate) AS RunningTotal
FROM dbo.FactOrders;`,
    explanation: '`SUM(Amount) OVER (ORDER BY OrderDate)` accumulates the total up to each row in date order — a running total — while keeping every detail row.',
    hints: ['The window keyword that follows the aggregate'],
    tags: ['tsql', 'window-frames', 'running-total', 'cloze'],
  },
  {
    id: 'tsql-frames-movingavg-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TSQL_WINDOW_FRAMES,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the frame clause for a 3-row moving average (current row plus the two before it).',
    template: `SELECT OrderDate, Amount,
       AVG(Amount) OVER (
           ORDER BY OrderDate
           ___ BETWEEN 2 ___ AND CURRENT ___
       ) AS MovingAvg3
FROM dbo.FactOrders;`,
    blanks: ['ROWS', 'PRECEDING', 'ROW'],
    solution: `SELECT OrderDate, Amount,
       AVG(Amount) OVER (
           ORDER BY OrderDate
           ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
       ) AS MovingAvg3
FROM dbo.FactOrders;`,
    explanation: '`ROWS BETWEEN 2 PRECEDING AND CURRENT ROW` defines a sliding 3-row window (this row + the two before). Use `ROWS` (physical row count) rather than `RANGE` so duplicate dates do not pull extra peers into the average.',
    hints: ['Physical-row frame keyword', 'two rows back → 2 PRECEDING; window ends at CURRENT ROW'],
    tags: ['tsql', 'window-frames', 'moving-average', 'rows-between', 'cloze'],
  },
  {
    id: 'tsql-frames-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_WINDOW_FRAMES,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'From `dbo.FactOrders` (CustomerKey, OrderDate, Amount), return CustomerKey, OrderDate, Amount and a per-customer running total of Amount ordered by OrderDate, aliased `RunningTotal`.',
    starterCode: `-- dbo.FactOrders (CustomerKey, OrderDate, Amount); return CustomerKey, OrderDate, Amount, and RunningTotal per customer
`,
    testCases: [
      {
        input: 'SUM(Amount) OVER (PARTITION BY CustomerKey ORDER BY OrderDate)',
        expectedOutput: 'Per-customer cumulative spend over time',
        description: 'Partitioned running total',
      },
    ],
    solution: `SELECT CustomerKey, OrderDate, Amount,
       SUM(Amount) OVER (PARTITION BY CustomerKey ORDER BY OrderDate) AS RunningTotal
FROM dbo.FactOrders;`,
    explanation: '`PARTITION BY CustomerKey` restarts the accumulation for each customer; `ORDER BY OrderDate` with the default frame makes it a running total of that customer\'s spend over time.',
    hints: ['PARTITION BY CustomerKey to reset per customer', 'ORDER BY OrderDate for the cumulative effect'],
    tieredHints: {
      apiSignature: 'SUM(expression) OVER ([PARTITION BY column] [ORDER BY column])',
      skeleton: `SELECT ____, ____, ____,
       ____(____) OVER (PARTITION BY ____ ORDER BY ____) AS ____
FROM dbo.FactOrders;`,
    },
    tags: ['tsql', 'window-frames', 'running-total', 'partition-by'],
  },
  {
    id: 'tsql-frames-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TSQL_WINDOW_FRAMES,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: "From `dbo.FactOrders` (CustomerKey, OrderDate, Amount), return CustomerKey, OrderDate, Amount and a 3-order moving average of Amount (the current order plus the two immediately before it, by OrderDate) for each customer, aliased `MovingAvg3`.",
    starterCode: `-- 3-order moving average per customer
`,
    testCases: [
      {
        input: 'AVG(Amount) OVER (PARTITION BY CustomerKey ORDER BY OrderDate ROWS BETWEEN 2 PRECEDING AND CURRENT ROW)',
        expectedOutput: 'Per-customer 3-order sliding average',
        description: 'Partitioned moving average with an explicit ROWS frame',
      },
    ],
    solution: `SELECT CustomerKey, OrderDate, Amount,
       AVG(Amount) OVER (
           PARTITION BY CustomerKey
           ORDER BY OrderDate
           ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
       ) AS MovingAvg3
FROM dbo.FactOrders;`,
    explanation: 'This combines three primitives: PARTITION BY to keep each customer\'s sequence separate, ORDER BY to define "before," and an explicit ROWS BETWEEN 2 PRECEDING AND CURRENT ROW frame to slide a fixed 3-row window instead of accumulating everything since the start.',
    hints: ['Partition per customer, order by date', 'A fixed-size sliding window needs an explicit ROWS BETWEEN frame, not the default'],
    tieredHints: {
      apiSignature: 'AVG(expression) OVER (PARTITION BY column ORDER BY column ROWS BETWEEN n PRECEDING AND CURRENT ROW)',
      skeleton: `SELECT ____, ____, ____,
       ____(____) OVER (
           PARTITION BY ____
           ORDER BY ____
           ____ BETWEEN ____ PRECEDING AND CURRENT ____
       ) AS ____
FROM dbo.FactOrders;`,
    },
    tags: ['tsql', 'window-frames', 'moving-average', 'rows-between', 'partition-by'],
  },
];
