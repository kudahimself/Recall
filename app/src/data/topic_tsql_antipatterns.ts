/**
 * Topic.TSQL_ANTIPATTERNS - SQL for Data Engineering (T-SQL).
 * Pillar 7 (Performance): non-SARGable predicates (functions on indexed cols,
 * implicit conversion), SELECT *, row-by-row vs set-based.
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

export const tsql_antipatterns_questions: Question[] = [
  {
    id: 'tsql-anti-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_ANTIPATTERNS,
    course: Course.SQL,
    question: 'Why is `WHERE YEAR(OrderDate) = 2026` a non-SARGable predicate, and what is the fix?',
    options: [
      { id: 'a', text: 'The function is applied to the column, so the engine cannot seek on it and scans; rewrite as a range on the bare column: `OrderDate >= \'2026-01-01\' AND OrderDate < \'2027-01-01\'`.', isCorrect: true },
      { id: 'b', text: 'The comparison is between a date and a number, so the engine scans; rewrite with a string: `YEAR(OrderDate) = \'2026\'`.', isCorrect: false },
      { id: 'c', text: 'It is SARGable, because YEAR is built in; the engine seeks on the result, so no rewrite is needed.', isCorrect: false },
      { id: 'd', text: 'The function is applied to the column, so the engine scans; rewrite with a cast: `CAST(OrderDate AS VARCHAR(4)) = \'2026\'`.', isCorrect: false },
    ],
    explanation: 'SARGable = Search-ARGument-able: the optimizer can seek an index only if the indexed column appears bare on one side. `YEAR(OrderDate)` applies a function to every row, defeating the index and forcing a scan. Rewriting as a half-open date range keeps `OrderDate` bare so the index seek (and partition elimination) works. A built-in function does not help: the engine would still have to compute `YEAR` for every row before it could compare. Casting the column to text is just another function on the column, so it scans too.',
    hints: ['A function on the indexed column means no seek, so a scan', 'Rewrite as a bare-column range: >= start AND < next start'],
    tags: ['tsql', 'antipatterns', 'sargable'],
  },
  {
    id: 'tsql-anti-mcq-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_ANTIPATTERNS,
    course: Course.SQL,
    question: 'Why is row-by-row processing (a cursor / WHILE loop over rows) an anti-pattern for ELT in SQL?',
    options: [
      { id: 'a', text: 'The engine plans and runs whole sets at once, so a loop pays planning and round-trip overhead for every row and is usually far slower than one statement.', isCorrect: true },
      { id: 'b', text: 'A loop gives the same speed as one statement, but it holds locks on the whole table for the entire loop, so it blocks other users.', isCorrect: false },
      { id: 'c', text: 'A loop is faster on small tables and slower on large ones because it runs on one CPU core, so it is only slow when the data is large.', isCorrect: false },
      { id: 'd', text: 'A loop cannot change rows, because a cursor is read-only in T-SQL, so row-by-row updates are not possible.', isCorrect: false },
    ],
    explanation: 'Relational engines plan and execute over whole sets at once. Looping ("Row By Agonizing Row") pays per-row planning/round-trip overhead and blocks the optimizer from batch strategies, so it is typically far slower than the equivalent single INSERT/UPDATE/MERGE. Reach for a cursor only for genuinely iterative admin tasks, not data transformation. A loop can change rows and can run in a transaction, so the problem is speed, not correctness.',
    hints: ['SQL is set-based; RBAR has per-row overhead', 'One set-based statement beats the loop'],
    tags: ['tsql', 'antipatterns', 'rbar', 'set-based'],
  },
  {
    id: 'tsql-anti-mcq-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_ANTIPATTERNS,
    course: Course.SQL,
    question: 'Why avoid `SELECT *` in production views and ELT queries?',
    options: [
      { id: 'a', text: 'It reads columns nobody needs, which also stops a covering index from serving the query, and its result changes shape when the table gains a column.', isCorrect: true },
      { id: 'b', text: 'It returns the columns in an unpredictable order each run, so a consumer cannot rely on the position of a column.', isCorrect: false },
      { id: 'c', text: 'It skips the table\'s indexes, so every `SELECT *` is a full scan whatever the WHERE clause says.', isCorrect: false },
      { id: 'd', text: 'It reads columns nobody needs, but the optimizer drops the unused ones, so the cost is the same as naming them.', isCorrect: false },
    ],
    explanation: '`SELECT *` pulls every column whether needed or not: extra I/O, and it can\'t be served by a covering index that holds only the needed columns. The columns come back in the table\'s column order every time, and a WHERE clause can still use an index, but the optimizer cannot skip columns you asked for. Worse, if a column is added/reordered upstream, the result set silently changes, breaking positional consumers and INSERT…SELECT loads. Always name the columns you actually use.',
    hints: ['Reads unneeded columns, defeats covering indexes', 'Result shape changes when the table changes'],
    tags: ['tsql', 'antipatterns', 'select-star'],
  },
  {
    id: 'tsql-anti-mcq-4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TSQL_ANTIPATTERNS,
    course: Course.SQL,
    question: 'A query compares an indexed `NVARCHAR` column to an integer literal: `WHERE AccountCode = 12345`. What hidden problem can this cause?',
    options: [
      { id: 'a', text: 'SQL Server converts the column to int on every row, so the predicate is not SARGable and scans, and a value that is not a number can raise an error.', isCorrect: true },
      { id: 'b', text: 'SQL Server converts the number to a string once, so the column stays bare and the index can still seek.', isCorrect: false },
      { id: 'c', text: 'SQL Server compares the two as text without converting anything, so it only returns rows where the digits match exactly.', isCorrect: false },
      { id: 'd', text: 'SQL Server rejects the query with a type-mismatch error before it runs, so no rows are read.', isCorrect: false },
    ],
    explanation: 'Mismatched types trigger an implicit conversion governed by data-type precedence. Because numeric outranks string, SQL Server converts the NVARCHAR column to int per row, which (like any function on the column) defeats the index and forces a scan, and can throw if a value isn\'t numeric. Compare with a matching-typed literal: `AccountCode = N\'12345\'`. The data type is not changed and the query does run; the cost is a scan and a possible error.',
    hints: ['A type mismatch converts the column on every row, so a scan', 'Match the literal type: N\'12345\''],
    tags: ['tsql', 'antipatterns', 'implicit-conversion', 'sargable'],
  },
  {
    id: 'tsql-anti-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_ANTIPATTERNS,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'This query returns the `OrderId` and `Amount` of every 2026 order, but it is not SARGable: `SELECT OrderId, Amount FROM dbo.FactOrders WHERE YEAR(OrderDate) = 2026;`. Rewrite it so the index on `OrderDate` can seek: do not wrap `OrderDate` in a function, and use a half-open date range that starts on 2026-01-01 and ends before 2027-01-01.',
    tables: [sampleTable('dbo.FactOrders', ['OrderId', 'OrderDate', 'Amount'])],
    starterCode: `-- dbo.FactOrders(OrderId, CustomerKey, ProductKey, OrderDate, Amount)
`,
    testCases: [
      {
        input: "WHERE OrderDate >= '2026-01-01' AND OrderDate < '2027-01-01'",
        expectedOutput: 'SARGable range predicate keeping OrderDate bare',
        description: 'Rewrite YEAR() filter as a range',
      },
    ],
    solution: `SELECT OrderId, Amount
FROM dbo.FactOrders
WHERE OrderDate >= '2026-01-01' AND OrderDate < '2027-01-01';
-- OR
SELECT OrderId, Amount
FROM dbo.FactOrders
WHERE OrderDate >= '20260101' AND OrderDate < '20270101';`,
    tieredHints: {
      apiSignature: 'SELECT cols FROM tbl WHERE col >= date1 AND col < date2;',
      skeleton: `SELECT ____, ____
FROM ____
WHERE OrderDate ____ '2026-01-01' ____ OrderDate ____ '2027-01-01';`,
    },
    explanation: 'Keeping `OrderDate` bare on one side of each comparison lets the optimizer seek the index (and eliminate partitions). The half-open range `>= \'2026-01-01\' AND < \'2027-01-01\'` captures the whole year including times on Dec 31 without `YEAR()`, and avoids the `BETWEEN … AND \'2026-12-31\'` trap that would miss timestamps later that day.',
    hints: ['Keep OrderDate bare, no YEAR()', "OrderDate >= '2026-01-01' AND OrderDate < '2027-01-01'"],
    requires: [/WHERE/i, />=/],
    tags: ['tsql', 'antipatterns', 'sargable'],
  },
  {
    id: 'tsql-anti-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_ANTIPATTERNS,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'A report wants every order placed in 2026 and filters with BETWEEN on the first and last day of the year. OrderDate holds a date and a time. Which orders does it return? Write one OrderId per line in the ORDER BY order.',
    tables: [
      {
        name: 'dbo.FactOrders',
        columns: ['OrderId', 'OrderDate'],
        rows: [
          [1, '2025-12-31 23:59'],
          [2, '2026-01-01 00:00'],
          [3, '2026-07-04 12:30'],
          [4, '2026-12-31 23:59'],
          [5, '2027-01-01 00:00'],
        ],
      },
    ],
    code: `SELECT OrderId
FROM dbo.FactOrders
WHERE OrderDate BETWEEN '2026-01-01' AND '2026-12-31'
ORDER BY OrderId;`,
    expectedOutput: `2
3`,
    explanation: 'The end value \'2026-12-31\' means midnight at the start of that day, so an order at 23:59 on 31 December is later than the end and falls out: order 4 is lost, a quiet wrong result rather than an error. The column is kept bare, which is good for seeking, but the range must be half-open: OrderDate >= \'2026-01-01\' AND OrderDate < \'2027-01-01\' returns orders 2, 3 and 4.',
    hints: ['BETWEEN includes both ends, but the end value is midnight', 'Compare 23:59 on 31 December with 2026-12-31 00:00'],
    tags: ['tsql', 'antipatterns', 'sargable', 'between-trap', 'predict'],
  },
];
