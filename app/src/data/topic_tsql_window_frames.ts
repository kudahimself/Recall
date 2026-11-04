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
import { sampleTable } from './tsqlSampleTables';

export const tsql_window_frames_questions: Question[] = [
  {
    id: 'tsql-frames-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_WINDOW_FRAMES,
    course: Course.SQL,
    question: 'With `SUM(Amount) OVER (ORDER BY OrderDate)` and no explicit frame, what do you get?',
    options: [
      { id: 'a', text: 'A running total, because with ORDER BY the default frame runs from the first row up to the current row.', isCorrect: true },
      { id: 'b', text: 'The grand total on every row, because ORDER BY inside OVER only sorts the rows and leaves the frame unchanged.', isCorrect: false },
      { id: 'c', text: 'An error, because an aggregate with ORDER BY inside OVER needs an explicit ROWS or RANGE frame.', isCorrect: false },
      { id: 'd', text: 'Each row\'s own Amount, because with ORDER BY the default frame is just the current row.', isCorrect: false },
    ],
    explanation: 'Adding `ORDER BY` to a window aggregate switches it from "whole partition" to a frame ending at the current row. The implicit default is `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`, which yields a running total. Without `ORDER BY` you would get the grand total on every row. For a moving window you spell out a `ROWS BETWEEN ...` frame, and `ROWS` avoids the `RANGE` surprise where rows tied on OrderDate all show the same total.',
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
    question: 'What does this query return? Write one value per line, in the order the query returns them.',
    tables: [{ name: 'dbo.DailySale', columns: ['SaleDay', 'Amount'], rows: [[1, 10], [2, 20], [3, 30]] }],
    code: `SELECT SUM(Amount) OVER (ORDER BY SaleDay) AS Running
FROM dbo.DailySale
ORDER BY SaleDay;`,
    expectedOutput: `10
30
60`,
    explanation: 'The default frame (UNBOUNDED PRECEDING to CURRENT ROW) makes this a running total: 10, then 10 + 20 = 30, then 30 + 30 = 60.',
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
    question: 'Fill in the keyword that turns SUM into a running total ordered by date.',
    tables: [sampleTable('dbo.FactOrders', ['OrderDate', 'Amount'])],
    template: `-- dbo.FactOrders(OrderId, CustomerKey, ProductKey, OrderDate, Amount)
SELECT OrderDate, Amount,
       SUM(Amount) ___ (ORDER BY OrderDate) AS RunningTotal
FROM dbo.FactOrders;`,
    blanks: ['OVER'],
    solution: `SELECT OrderDate, Amount,
       SUM(Amount) OVER (ORDER BY OrderDate) AS RunningTotal
FROM dbo.FactOrders;`,
    explanation: '`SUM(Amount) OVER (ORDER BY OrderDate)` accumulates the total up to each row in date order, a running total, while keeping every detail row. Without `OVER`, `SUM` would collapse the table to one row.',
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
    tables: [sampleTable('dbo.FactOrders', ['OrderDate', 'Amount'])],
    template: `-- dbo.FactOrders(OrderId, CustomerKey, ProductKey, OrderDate, Amount)
SELECT OrderDate, Amount,
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
    explanation: '`ROWS BETWEEN 2 PRECEDING AND CURRENT ROW` defines a sliding 3-row window (this row and the two before). It has to be `ROWS`, which counts physical rows: T-SQL only allows `RANGE` with UNBOUNDED or CURRENT ROW, not with a number like 2. The first two rows average over fewer rows because there are not yet two before them.',
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
    tables: [sampleTable('dbo.FactOrders', ['CustomerKey', 'OrderDate', 'Amount'])],
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
FROM dbo.FactOrders;
-- OR
SELECT CustomerKey, OrderDate, Amount,
       SUM(Amount) OVER (PARTITION BY CustomerKey ORDER BY OrderDate
                         ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS RunningTotal
FROM dbo.FactOrders;`,
    explanation: '`PARTITION BY CustomerKey` restarts the accumulation for each customer; `ORDER BY OrderDate` with the default frame makes it a running total of that customer\'s spend over time, so customer 1 shows 129 and then 153.99. Spelling out `ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` gives the same totals here and keeps two orders on the same date from sharing one total.',
    hints: ['PARTITION BY CustomerKey to reset per customer', 'ORDER BY OrderDate for the cumulative effect'],
    tieredHints: {
      apiSignature: 'SUM(expression) OVER ([PARTITION BY column] [ORDER BY column])',
      skeleton: `SELECT ____, ____, ____,
       ____(____) OVER (PARTITION BY ____ ORDER BY ____) AS ____
FROM dbo.FactOrders;`,
    },
    requires: [/OVER/i, /SUM/i],
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
    tables: [sampleTable('dbo.FactOrders', ['CustomerKey', 'OrderDate', 'Amount'])],
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
    explanation: 'This combines three primitives: PARTITION BY to keep each customer\'s sequence separate, ORDER BY to define "before", and an explicit ROWS BETWEEN 2 PRECEDING AND CURRENT ROW frame to slide a fixed 3-row window instead of accumulating everything since the start.',
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
    requires: [/ROWS\s+BETWEEN/i],
    tags: ['tsql', 'window-frames', 'moving-average', 'rows-between', 'partition-by'],
  },
];
