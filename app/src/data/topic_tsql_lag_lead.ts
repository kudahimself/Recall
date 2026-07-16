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
} from '../types';

export const tsql_lag_lead_questions: Question[] = [
  {
    id: 'tsql-laglead-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_LAG_LEAD,
    course: Course.SQL,
    question: 'What do `LAG` and `LEAD` do?',
    options: [
      { id: 'a', text: 'LAG reads a value from a previous row in the ordered window; LEAD reads from a following row — both need an ORDER BY and return NULL (or a supplied default) at the edges.', isCorrect: true },
      { id: 'b', text: 'LAG sums all previous rows; LEAD sums all following rows — they are cumulative aggregates.', isCorrect: false },
      { id: 'c', text: 'LAG sorts the window ascending and LEAD sorts it descending; neither reads other rows.', isCorrect: false },
      { id: 'd', text: 'LAG and LEAD both return the current row\'s value; the difference is only which column they read.', isCorrect: false },
    ],
    explanation: 'LAG(col, n) looks `n` rows back and LEAD(col, n) looks `n` rows forward within the ordered (and optionally partitioned) window. At the boundary there is no such row, so they return NULL unless you pass a default as the third argument. They are the backbone of period-over-period comparisons.',
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
    question: 'What does this query output (one value per line)?',
    code: `SELECT v.amt - LAG(v.amt, 1, 0) OVER (ORDER BY v.d) AS delta
FROM (VALUES (1, 10), (2, 25), (3, 20)) AS v(d, amt)
ORDER BY v.d;`,
    expectedOutput: `10
15
-5`,
    explanation: 'LAG with a default of 0 means the first row subtracts 0 → 10. Then 25 − 10 = 15, and 20 − 25 = −5. Without the `, 0` default, the first row would be NULL.',
    hints: ['First row uses the default 0; then current − previous'],
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
    template: `SELECT CustomerKey, OrderDate, Amount,
       LAG(Amount, 1, 0) ___ (PARTITION BY CustomerKey ___ ___ OrderDate) AS PrevAmount
FROM dbo.FactOrders;`,
    blanks: ['OVER', 'ORDER', 'BY'],
    solution: `SELECT CustomerKey, OrderDate, Amount,
       LAG(Amount, 1, 0) OVER (PARTITION BY CustomerKey ORDER BY OrderDate) AS PrevAmount
FROM dbo.FactOrders;`,
    explanation: 'The window must be ordered for LAG to have a meaningful "previous" row; `PARTITION BY CustomerKey` keeps each customer\'s sequence separate so one customer\'s first order does not borrow from another\'s.',
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
    question: 'What does this query output (one value per line)?',
    code: `SELECT LEAD(v.amt, 1, 0) OVER (ORDER BY v.d) AS next_amt
FROM (VALUES (1, 10), (2, 25), (3, 20)) AS v(d, amt)
ORDER BY v.d;`,
    expectedOutput: `25
20
0`,
    explanation: 'LEAD(amt, 1, 0) looks one row AHEAD in date order: row 1 sees row 2\'s amount (25), row 2 sees row 3\'s (20), and row 3 has no following row so it falls back to the default 0. LEAD is the mirror of LAG - forward instead of backward.',
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
      { id: 'a', text: "That customer's earliest order's Amount, repeated on every row of the partition - a fixed reference value rather than a changing one like LAG.", isCorrect: true },
      { id: 'b', text: "The current row's own Amount, unchanged - FIRST_VALUE is a no-op alias for the column itself.", isCorrect: false },
      { id: 'c', text: 'NULL on every row until the partition has at least two orders.', isCorrect: false },
      { id: 'd', text: "The average of the customer's first and last order Amounts.", isCorrect: false },
    ],
    explanation: '`FIRST_VALUE` returns the value from the first row of the ordered window frame - here, each customer\'s earliest order by date - and repeats it on every row of that partition. Unlike LAG, which looks one row back, FIRST_VALUE anchors to a fixed point (the start), which is handy for "compare to the original" style calculations.',
    hints: ['Returns the first row of the ordered partition, repeated', 'A fixed anchor value, not a shifting lookback'],
    tags: ['tsql', 'lag-lead', 'first-value'],
  },
  {
    id: 'tsql-laglead-mcq-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TSQL_LAG_LEAD,
    course: Course.SQL,
    question: 'Why does `LAST_VALUE(Amount) OVER (ORDER BY OrderDate)` often return the current row\'s value instead of the partition\'s last value?',
    options: [
      { id: 'a', text: 'The default frame ends at CURRENT ROW, so LAST_VALUE only sees up to the current row; you must add ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING.', isCorrect: true },
      { id: 'b', text: 'LAST_VALUE is deprecated and silently returns the current row; use LAG instead.', isCorrect: false },
      { id: 'c', text: 'LAST_VALUE ignores ORDER BY entirely, so it returns rows in physical storage order.', isCorrect: false },
      { id: 'd', text: 'It only works inside a GROUP BY query; in a window it always returns NULL.', isCorrect: false },
    ],
    explanation: 'With `ORDER BY` the implicit frame is `RANGE … CURRENT ROW`, so "last value in the frame" is just the current row. To get the genuine final value of the partition, widen the frame to `ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING`. FIRST_VALUE does not suffer this because the frame already starts at the top.',
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
    starterCode: `-- LAG(Amount, 1, 0) OVER (PARTITION BY ... ORDER BY ...) AS PrevAmount
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
FROM dbo.FactOrders;`,
    explanation: 'LAG(Amount, 1, 0) fetches the prior row\'s Amount within each customer\'s date-ordered sequence, defaulting to 0 for each customer\'s first order. Subtracting `Amount - PrevAmount` would then give the period-over-period change.',
    hints: ['Offset 1 back, default 0', 'PARTITION BY CustomerKey ORDER BY OrderDate'],
    tags: ['tsql', 'lag-lead', 'lag', 'partition-by'],
  },
];
