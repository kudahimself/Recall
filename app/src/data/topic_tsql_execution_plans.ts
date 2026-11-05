/**
 * Topic.TSQL_EXECUTION_PLANS - SQL for Data Engineering (T-SQL).
 * Pillar 7 (Performance): estimated vs actual plan, SET STATISTICS IO/TIME,
 * scan vs seek, key lookups, row estimates.
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

export const tsql_execution_plans_questions: Question[] = [
  {
    id: 'tsql-plan-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_EXECUTION_PLANS,
    course: Course.SQL,
    question: 'In an execution plan, what is the practical difference between an Index Seek and an Index/Table Scan?',
    options: [
      { id: 'a', text: 'A seek goes straight to the matching rows, so its cost follows the rows returned; a scan reads the whole index or table, so its cost follows the table size.', isCorrect: true },
      { id: 'b', text: 'A scan goes straight to the matching rows, so its cost follows the rows returned; a seek reads the whole index or table, so its cost follows the table size.', isCorrect: false },
      { id: 'c', text: 'A seek reads the whole index but returns only the matching rows; a scan reads the whole table and returns every row.', isCorrect: false },
      { id: 'd', text: 'A seek is used for an equality filter and a scan for a range filter, and both cost the same however large the table is.', isCorrect: false },
    ],
    explanation: 'A seek uses the index B-tree to jump straight to the rows that qualify, so its cost tracks the number of rows returned. A scan reads every row in the index/table and filters afterward, so its cost tracks the total size. A scan is not always bad (it can beat many seeks when returning most of the table), but an unexpected scan on a selective filter usually signals a missing or unusable index. A range filter can seek too, so equality versus range does not decide it.',
    hints: ['Seek = go straight to the matching rows', 'Scan = read everything, cost follows the table size'],
    tags: ['tsql', 'execution-plans', 'seek', 'scan'],
  },
  {
    id: 'tsql-plan-mcq-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TSQL_EXECUTION_PLANS,
    course: Course.SQL,
    question: 'A plan shows a nonclustered Index Seek followed by a Key Lookup running thousands of times. What does that indicate and how do you fix it?',
    options: [
      { id: 'a', text: 'The index lacks some selected columns, so each row it finds fetches them from the base table; add those columns with INCLUDE so the index covers the query.', isCorrect: true },
      { id: 'b', text: 'The index lacks the filter column, so each row is checked again in the base table; add the filter column to the key.', isCorrect: false },
      { id: 'c', text: 'The index lacks some selected columns, so the engine reads the base table once for all of them; add the columns to a new clustered index.', isCorrect: false },
      { id: 'd', text: 'The statistics are stale, so the engine repeats the seek for every row; update the statistics to remove the lookups.', isCorrect: false },
    ],
    explanation: 'A Key Lookup is the optimizer going back to the clustered index for columns the nonclustered index didn\'t have. A handful is fine; thousands are expensive (random I/O per row), because the lookup runs once per row the seek finds. The filter column is already in the index, which is why the seek works. Adding the missing columns with `INCLUDE` makes the index cover the query and the lookups disappear.',
    hints: ['A lookup means the index is missing some selected columns', 'Fix: INCLUDE them so the index covers the query'],
    tags: ['tsql', 'execution-plans', 'key-lookup', 'covering-index'],
  },
  {
    id: 'tsql-plan-mcq-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_EXECUTION_PLANS,
    course: Course.SQL,
    question: 'What does `SET STATISTICS IO ON` report, and why is it useful for tuning?',
    options: [
      { id: 'a', text: 'The pages each table had to read for the query, a steady measure of the work done that does not vary from run to run.', isCorrect: true },
      { id: 'b', text: 'The CPU time and elapsed time of the query, a steady measure of the work done that does not vary from run to run.', isCorrect: false },
      { id: 'c', text: 'The number of rows each table returned to the query, a steady measure of the work done that does not vary from run to run.', isCorrect: false },
      { id: 'd', text: 'The pages each table had to read, but only on the first run, because later runs are served from cache and report zero.', isCorrect: false },
    ],
    explanation: 'STATISTICS IO reports logical reads, the count of 8 KB pages the query accessed per table. Unlike elapsed time (noisy, machine-dependent), logical reads are a stable proxy for work done: a tuning win shows up as a drop in logical reads. Logical reads count a page whether or not it was already cached. (`SET STATISTICS TIME ON` adds CPU/elapsed time.)',
    hints: ['Logical reads are the pages touched per table', 'A stable measure of work, unlike noisy elapsed time'],
    tags: ['tsql', 'execution-plans', 'statistics-io', 'logical-reads'],
  },
  {
    id: 'tsql-plan-mcq-4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TSQL_EXECUTION_PLANS,
    course: Course.SQL,
    question: 'A plan\'s estimated rows is 12 but actual rows is 4,000,000, and the query is slow. What is the most likely cause?',
    options: [
      { id: 'a', text: 'Stale or missing statistics made the optimizer expect 12 rows and choose steps sized for that, such as nested loops; update the statistics.', isCorrect: true },
      { id: 'b', text: 'The index is missing, so the engine could not count the rows and guessed 12; create an index on every column in the filter.', isCorrect: false },
      { id: 'c', text: 'The estimate counts the rows the query returns and the actual counts the rows it read, so a gap is normal; no change is needed.', isCorrect: false },
      { id: 'd', text: 'The plan was compiled once and cached for good, so it can never change; clear the cache after every data load.', isCorrect: false },
    ],
    explanation: 'The optimizer chooses operators (loops vs hash, memory grants) from estimated cardinality. A huge estimated-vs-actual gap means the statistics are stale or missing, or the predicate hides the column from them, leading to a plan tuned for 12 rows but fed millions. Both numbers describe the same operator: the estimate is what the optimizer expected to pass through it and the actual is what did, so a gap that large is a problem. Updating statistics (or fixing the predicate) usually realigns the estimate.',
    hints: ['A big gap between estimate and actual means a bad cardinality estimate', 'Usually stale or missing statistics'],
    tags: ['tsql', 'execution-plans', 'statistics', 'cardinality'],
  },
  {
    id: 'tsql-plan-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TSQL_EXECUTION_PLANS,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the two SET STATISTICS options for the query that follows: first the one that reports page reads, then the one that reports timing.',
    tables: [sampleTable('dbo.FactSales', ['CustomerKey', 'Amount'])],
    template: `-- dbo.FactSales(CustomerKey, ProductKey, Amount, OrderDate)
SET STATISTICS ___ ON;
SET STATISTICS ___ ON;
SELECT CustomerKey, SUM(Amount) AS Total
FROM dbo.FactSales
GROUP BY CustomerKey;`,
    blanks: ['IO', 'TIME'],
    solution: `SET STATISTICS IO ON;
SET STATISTICS TIME ON;
SELECT CustomerKey, SUM(Amount) AS Total
FROM dbo.FactSales
GROUP BY CustomerKey;`,
    explanation: '`SET STATISTICS IO ON` reports logical/physical page reads per table; `SET STATISTICS TIME ON` reports parse/compile and execution CPU and elapsed time. Together they quantify a query\'s cost, here a read of the 3 FactSales rows, so you can measure the effect of a tuning change rather than guessing.',
    hints: ['Page reads → STATISTICS IO', 'CPU/elapsed time → STATISTICS TIME'],
    tags: ['tsql', 'execution-plans', 'statistics-io', 'cloze'],
  },
  {
    id: 'tsql-plan-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_EXECUTION_PLANS,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'A plan seeks a nonclustered index on CustomerKey, which does not hold Amount, so the plan adds a Key Lookup into the base table for every row the seek finds. Which rows does the seek find, so that one Key Lookup runs for each? Write one row per line in the ORDER BY order, as OrderId and Amount separated by a comma.',
    tables: [
      {
        name: 'dbo.FactOrders',
        columns: ['OrderId', 'CustomerKey', 'Amount'],
        rows: [
          [1, 7, 40],
          [2, 3, 15],
          [3, 7, 25],
          [4, 9, 60],
          [5, 7, 10],
        ],
      },
    ],
    code: `SELECT OrderId, Amount
FROM dbo.FactOrders
WHERE CustomerKey = 7
ORDER BY OrderId;`,
    expectedOutput: `1, 40
3, 25
5, 10`,
    explanation: 'Three orders belong to customer 7, so the seek finds three index entries and the plan runs three Key Lookups, one per row, to fetch Amount from the base table. At this size that is nothing; for a customer with thousands of orders the lookups dominate the cost, which is when a covering index (INCLUDE (Amount)) removes them.',
    hints: ['Keep the rows where CustomerKey is 7', 'One Key Lookup runs for each row the seek returns'],
    tags: ['tsql', 'execution-plans', 'key-lookup', 'predict'],
  },
];
