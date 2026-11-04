/**
 * Topic.TSQL_LAG_LEAD — SQL for Data Engineering (T-SQL).
 * Pillar 3 (Analytical & Window SQL): LAG/LEAD, FIRST_VALUE/LAST_VALUE,
 * period-over-period deltas.
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
  SqlTable,
} from '../types';
import { sampleTable } from './tsqlSampleTables';

// Three months of sales, for the LAG and LEAD predicts.
const MONTHLY_SALE: SqlTable = {
  name: 'dbo.MonthlySale',
  columns: ['MonthNo', 'Amount'],
  rows: [[1, 10], [2, 25], [3, 20]],
};

export const tsql_lag_lead_questions: Question[] = [
  {
    id: 'tsql-laglead-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_LAG_LEAD,
    course: Course.SQL,
    question: 'What do `LAG` and `LEAD` do?',
    options: [
      { id: 'a', text: 'LAG reads a value from an earlier row in the window\'s order and LEAD from a later row; past the edge they return NULL or the default you pass.', isCorrect: true },
      { id: 'b', text: 'LAG adds up the values of all earlier rows and LEAD of all later rows, like a running total in each direction.', isCorrect: false },
      { id: 'c', text: 'LAG reads the previous row in the order the table stores it, so it needs no ORDER BY; LEAD reads the next stored row.', isCorrect: false },
      { id: 'd', text: 'LAG reads a value from an earlier row and LEAD from a later row; past the edge they wrap around to the other end.', isCorrect: false },
    ],
    explanation: '`LAG(col, n)` looks `n` rows back and `LEAD(col, n)` looks `n` rows forward within the ordered (and optionally partitioned) window, and both require an `ORDER BY` inside `OVER`. At the boundary there is no such row, so they return NULL unless you pass a default as the third argument; they never wrap around. They are the backbone of period-over-period comparisons.',
    hints: ['LAG = previous row, LEAD = next row', 'edge rows → NULL or your default'],
    tags: ['tsql', 'lag-lead', 'lag', 'lead'],
  },
  {
    id: 'tsql-laglead-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_LAG_LEAD,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'What does this query return? Write one value per line, in the order the query returns them.',
    tables: [MONTHLY_SALE],
    code: `SELECT Amount - LAG(Amount, 1, 0) OVER (ORDER BY MonthNo) AS Delta
FROM dbo.MonthlySale
ORDER BY MonthNo;`,
    expectedOutput: `10
15
-5`,
    explanation: 'LAG with a default of 0 means the first month subtracts 0, giving 10. Then 25 - 10 = 15, and 20 - 25 = -5. Without the `, 0` default, the first row would be NULL, because anything minus NULL is NULL.',
    hints: ['First row uses the default 0; then current - previous'],
    tags: ['tsql', 'lag-lead', 'lag', 'predict'],
  },
  {
    id: 'tsql-laglead-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_LAG_LEAD,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the window keywords so PrevAmount is each customer\'s previous order amount by date.',
    tables: [sampleTable('dbo.FactOrders', ['CustomerKey', 'OrderDate', 'Amount'])],
    template: `-- dbo.FactOrders(OrderId, CustomerKey, ProductKey, OrderDate, Amount)
SELECT CustomerKey, OrderDate, Amount,
       LAG(Amount, 1, 0) ___ (PARTITION BY CustomerKey ___ ___ OrderDate) AS PrevAmount
FROM dbo.FactOrders;`,
    blanks: ['OVER', 'ORDER', 'BY'],
    solution: `SELECT CustomerKey, OrderDate, Amount,
       LAG(Amount, 1, 0) OVER (PARTITION BY CustomerKey ORDER BY OrderDate) AS PrevAmount
FROM dbo.FactOrders;`,
    explanation: 'The window must be ordered for LAG to have a meaningful "previous" row; `PARTITION BY CustomerKey` keeps each customer\'s sequence separate so one customer\'s first order does not borrow from another\'s. Here customer 1\'s second order gets PrevAmount 129, and each customer\'s first order gets the default 0.',
    hints: ['OVER opens the window; the previous row needs an ORDER BY'],
    tags: ['tsql', 'lag-lead', 'lag', 'partition-by', 'cloze'],
  },
  {
    id: 'tsql-laglead-lead-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_LAG_LEAD,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'What does this query return? Write one value per line, in the order the query returns them.',
    tables: [MONTHLY_SALE],
    code: `SELECT LEAD(Amount, 1, 0) OVER (ORDER BY MonthNo) AS NextAmount
FROM dbo.MonthlySale
ORDER BY MonthNo;`,
    expectedOutput: `25
20
0`,
    explanation: 'LEAD(Amount, 1, 0) looks one row AHEAD in month order: month 1 sees month 2\'s amount (25), month 2 sees month 3\'s (20), and month 3 has no following row so it falls back to the default 0. LEAD is the mirror of LAG - forward instead of backward.',
    hints: ['LEAD reads the NEXT row, not the previous one', 'the last row has no following row - falls back to the default'],
    tags: ['tsql', 'lag-lead', 'lead', 'predict'],
  },
  {
    id: 'tsql-laglead-firstvalue-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_LAG_LEAD,
    course: Course.SQL,
    question: 'What does `FIRST_VALUE(Amount) OVER (PARTITION BY CustomerKey ORDER BY OrderDate)` return for each row?',
    options: [
      { id: 'a', text: "The Amount of that customer's earliest order, repeated on every one of that customer's rows.", isCorrect: true },
      { id: 'b', text: "The Amount of that customer's previous order, and NULL on the customer's first order.", isCorrect: false },
      { id: 'c', text: "The row's own Amount, because the default frame ends at the current row.", isCorrect: false },
      { id: 'd', text: 'The Amount of the earliest order of any customer, repeated on every row of the result.', isCorrect: false },
    ],
    explanation: '`FIRST_VALUE` returns the value from the first row of the ordered window frame - here, each customer\'s earliest order by date - and repeats it on every row of that partition. The default frame ends at the current row but starts at the top, so the first row is always in it. Unlike LAG, which looks one row back, FIRST_VALUE anchors to a fixed point, and `PARTITION BY` keeps that anchor per customer.',
    hints: ['Returns the first row of the ordered partition, repeated', 'A fixed anchor value, not a shifting lookback'],
    tags: ['tsql', 'lag-lead', 'first-value'],
  },
  {
    id: 'tsql-laglead-mcq-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TSQL_LAG_LEAD,
    course: Course.SQL,
    question: 'Why does `LAST_VALUE(Amount) OVER (ORDER BY OrderDate)` often return the current row\'s value instead of the last value, and how do you fix it?',
    options: [
      { id: 'a', text: 'The default frame ends at the current row, so it is the last row LAST_VALUE sees; widen it with ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING.', isCorrect: true },
      { id: 'b', text: 'The default frame ends at the current row, so it is the last row LAST_VALUE sees; fix it with ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW.', isCorrect: false },
      { id: 'c', text: 'Without PARTITION BY there is no partition whose last row it can read, so it falls back to the current row; add a PARTITION BY.', isCorrect: false },
      { id: 'd', text: 'ORDER BY inside OVER sorts descending by default, so the current row is treated as the last one; add ASC to the ORDER BY.', isCorrect: false },
    ],
    explanation: 'With `ORDER BY` the implicit frame is `RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`, so "last value in the frame" is just the current row. `ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` still ends at the current row, so it changes nothing. Widen the frame to `ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING` to get the genuine final value. FIRST_VALUE does not suffer this because the frame already starts at the top.',
    hints: ['Default frame ends at CURRENT ROW', 'widen to UNBOUNDED FOLLOWING for the true last value'],
    tags: ['tsql', 'lag-lead', 'last-value', 'frame'],
  },
  {
    id: 'tsql-laglead-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TSQL_LAG_LEAD,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'From `dbo.FactOrders` (CustomerKey, OrderDate, Amount), return CustomerKey, OrderDate, Amount and the previous order\'s Amount for that customer (ordered by OrderDate), aliased `PrevAmount`, using 0 when there is no previous order.',
    tables: [sampleTable('dbo.FactOrders', ['CustomerKey', 'OrderDate', 'Amount'])],
    starterCode: `-- Return CustomerKey, OrderDate, Amount, and PrevAmount (previous order Amount per customer, defaulting to 0)
`,
    testCases: [
      {
        input: 'LAG(Amount, 1, 0) OVER (PARTITION BY CustomerKey ORDER BY OrderDate)',
        expectedOutput: 'Each order alongside the customer\'s previous order amount (0 for the first)',
        description: 'Period-over-period with LAG',
      },
    ],
    solution: `SELECT CustomerKey, OrderDate, Amount,
       LAG(Amount, 1, 0) OVER (PARTITION BY CustomerKey ORDER BY OrderDate) AS PrevAmount
FROM dbo.FactOrders;
-- OR
SELECT CustomerKey, OrderDate, Amount,
       ISNULL(LAG(Amount) OVER (PARTITION BY CustomerKey ORDER BY OrderDate), 0) AS PrevAmount
FROM dbo.FactOrders;
-- OR
SELECT CustomerKey, OrderDate, Amount,
       COALESCE(LAG(Amount) OVER (PARTITION BY CustomerKey ORDER BY OrderDate), 0) AS PrevAmount
FROM dbo.FactOrders;`,
    tieredHints: {
      apiSignature: 'LAG(scalar_expression, offset, default) OVER (PARTITION BY col ORDER BY col ASC|DESC) -> scalar_value',
      skeleton: `SELECT CustomerKey, OrderDate, Amount,
       ____(Amount, ____, ____) OVER (____ ____ CustomerKey ____ ____ OrderDate) AS ____
FROM dbo.FactOrders;`,
    },
    explanation: 'LAG(Amount, 1, 0) fetches the prior row\'s Amount within each customer\'s date-ordered sequence, defaulting to 0 for each customer\'s first order. Wrapping a plain `LAG(Amount)` in `ISNULL(..., 0)` or `COALESCE(..., 0)` gives the same result here. Subtracting `Amount - PrevAmount` would then give the period-over-period change.',
    hints: ['Offset 1 back, default 0', 'PARTITION BY CustomerKey ORDER BY OrderDate'],
    requires: [/LAG/i],
    tags: ['tsql', 'lag-lead', 'lag', 'partition-by'],
  },
];
