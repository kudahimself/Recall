/**
 * Topic.TSQL_EXECUTION_PLANS — SQL for Data Engineering (T-SQL).
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

export const tsql_execution_plans_questions: Question[] = [
  {
    id: 'tsql-plan-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_EXECUTION_PLANS,
    course: Course.SQL,
    question: 'In an execution plan, what is the practical difference between an Index Seek and an Index/Table Scan?',
    options: [
      { id: 'a', text: 'A seek navigates the B-tree directly to the matching rows (cost scales with rows returned); a scan reads the whole structure (cost scales with table size).', isCorrect: true },
      { id: 'b', text: 'A seek reads the entire table while a scan reads only matching rows — the names are reversed.', isCorrect: false },
      { id: 'c', text: 'A seek works only on heaps; a scan works only on clustered indexes.', isCorrect: false },
      { id: 'd', text: 'They are identical operations; the optimizer picks the label at random.', isCorrect: false },
    ],
    explanation: 'A seek uses the index B-tree to jump straight to the rows that qualify, so its cost tracks the number of rows returned. A scan reads every row in the index/table and filters afterward, so its cost tracks the total size. A scan is not always bad (it can beat many seeks when returning most of the table), but an unexpected scan on a selective filter usually signals a missing or unusable index.',
    hints: ['Seek = navigate to matching rows', 'Scan = read everything, cost scales with table size'],
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
      { id: 'a', text: 'The index found the rows but lacked some selected columns, so each match fetches the rest from the clustered index; add those columns via INCLUDE to make the index covering.', isCorrect: true },
      { id: 'b', text: 'The index is corrupt and must be dropped and recreated to remove the lookups.', isCorrect: false },
      { id: 'c', text: 'The query is running under the wrong isolation level; switch to SERIALIZABLE.', isCorrect: false },
      { id: 'd', text: 'Key lookups are always optimal, so no change is needed.', isCorrect: false },
    ],
    explanation: 'A Key Lookup is the optimizer going back to the clustered index for columns the nonclustered index didn\'t have. A handful is fine; thousands are expensive (random I/O per row). Adding the missing columns with `INCLUDE` makes the index cover the query and the lookups disappear.',
    hints: ['Lookup = index missing some selected columns', 'Fix: INCLUDE them → covering index'],
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
      { id: 'a', text: 'The logical reads (8 KB pages touched) per table — a stable, hardware-independent measure of how much data a query actually had to read.', isCorrect: true },
      { id: 'b', text: 'The wall-clock time in milliseconds only, which is the most reliable tuning metric.', isCorrect: false },
      { id: 'c', text: 'The number of rows in every table in the database, regardless of the query.', isCorrect: false },
      { id: 'd', text: 'The amount of network bandwidth the result set consumed.', isCorrect: false },
    ],
    explanation: 'STATISTICS IO reports logical reads — the count of 8 KB pages the query accessed per table. Unlike elapsed time (noisy, machine-dependent), logical reads are a stable proxy for work done: a tuning win shows up as a drop in logical reads. (`SET STATISTICS TIME ON` adds CPU/elapsed time.)',
    hints: ['Logical reads = pages touched per table', 'Stable measure of work, unlike noisy elapsed time'],
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
      { id: 'a', text: 'Stale or missing statistics led the optimizer to a bad cardinality estimate and a poor plan (e.g. nested loops instead of a hash join); update statistics.', isCorrect: true },
      { id: 'b', text: 'The estimate is always exactly right, so the actual count must be a display bug.', isCorrect: false },
      { id: 'c', text: 'A large gap between estimated and actual rows improves performance and should be encouraged.', isCorrect: false },
      { id: 'd', text: 'The query needs more SELECT columns to give the optimizer a better estimate.', isCorrect: false },
    ],
    explanation: 'The optimizer chooses operators (loops vs hash, memory grants) from estimated cardinality. A huge estimated-vs-actual gap means the statistics are stale/missing or the predicate is non-SARGable/over-parameterised — leading to a plan tuned for 12 rows but fed millions. Updating statistics (or fixing the predicate) usually realigns the estimate.',
    hints: ['Big estimate-vs-actual gap → bad cardinality estimate', 'Usually stale/missing statistics'],
    tags: ['tsql', 'execution-plans', 'statistics', 'cardinality'],
  },
  {
    id: 'tsql-plan-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.TSQL_EXECUTION_PLANS,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the SET statements that report page reads and timing for the query that follows.',
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
    explanation: '`SET STATISTICS IO ON` reports logical/physical page reads per table; `SET STATISTICS TIME ON` reports parse/compile and execution CPU + elapsed time. Together they quantify a query\'s cost so you can measure the effect of a tuning change rather than guessing.',
    hints: ['Page reads → STATISTICS IO', 'CPU/elapsed time → STATISTICS TIME'],
    tags: ['tsql', 'execution-plans', 'statistics-io', 'cloze'],
  },
];
