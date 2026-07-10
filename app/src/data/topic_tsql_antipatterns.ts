/**
 * Topic.TSQL_ANTIPATTERNS — SQL for Data Engineering (T-SQL).
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

export const tsql_antipatterns_questions: Question[] = [
  {
    id: 'tsql-anti-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TSQL_ANTIPATTERNS,
    course: Course.SQL,
    question: 'Why is `WHERE YEAR(OrderDate) = 2026` a non-SARGable predicate, and what is the fix?',
    options: [
      { id: 'a', text: 'Wrapping the indexed column in a function forces a scan (the index can\'t seek on YEAR(OrderDate)); rewrite as a range: `OrderDate >= \'2026-01-01\' AND OrderDate < \'2027-01-01\'`.', isCorrect: true },
      { id: 'b', text: 'It is non-SARGable because 2026 is a future date; use a string comparison instead.', isCorrect: false },
      { id: 'c', text: 'It is perfectly SARGable and uses the index efficiently; no change is needed.', isCorrect: false },
      { id: 'd', text: 'The fix is to add DISTINCT so the optimizer can seek.', isCorrect: false },
    ],
    explanation: 'SARGable = Search-ARGument-able: the optimizer can seek an index only if the indexed column appears bare on one side. `YEAR(OrderDate)` applies a function to every row, defeating the index and forcing a scan. Rewriting as a half-open date range keeps `OrderDate` bare so the index seek (and partition elimination) works.',
    hints: ['Function on the indexed column → no seek → scan', 'Rewrite as a bare-column range >= … AND < …'],
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
      { id: 'a', text: 'SQL is optimised for set-based operations; iterating row-by-row ("RBAR") does the work one row at a time with huge overhead — a single set-based statement is typically orders of magnitude faster.', isCorrect: true },
      { id: 'b', text: 'Cursors are illegal in T-SQL and will not compile.', isCorrect: false },
      { id: 'c', text: 'Row-by-row is always faster but uses more memory, so it is banned for cost reasons.', isCorrect: false },
      { id: 'd', text: 'Set-based operations cannot handle more than 1000 rows, so loops are needed for big tables.', isCorrect: false },
    ],
    explanation: 'Relational engines plan and execute over whole sets at once. Looping ("Row By Agonizing Row") pays per-row planning/round-trip overhead and blocks the optimizer from batch strategies, so it is typically far slower than the equivalent single INSERT/UPDATE/MERGE. Reach for a cursor only for genuinely iterative admin tasks, not data transformation.',
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
      { id: 'a', text: 'It reads unneeded columns (more I/O, defeats covering indexes) and silently changes shape if the table\'s columns change, breaking downstream consumers.', isCorrect: true },
      { id: 'b', text: 'It is a syntax error in any query that has a WHERE clause.', isCorrect: false },
      { id: 'c', text: 'It always returns the columns in random order, corrupting the data.', isCorrect: false },
      { id: 'd', text: 'It is fine in every case; explicit column lists offer no advantage.', isCorrect: false },
    ],
    explanation: '`SELECT *` pulls every column whether needed or not — extra I/O, and it can\'t be served by a covering index that holds only the needed columns. Worse, if a column is added/reordered upstream, the result set silently changes, breaking positional consumers and INSERT…SELECT loads. Always name the columns you actually use.',
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
      { id: 'a', text: 'An implicit conversion: SQL Server may convert the column to int on every row, making the predicate non-SARGable and forcing a scan (and risking conversion errors).', isCorrect: true },
      { id: 'b', text: 'Nothing — SQL Server compares strings and integers natively with no cost.', isCorrect: false },
      { id: 'c', text: 'It permanently changes the column\'s data type to int.', isCorrect: false },
      { id: 'd', text: 'It always returns zero rows regardless of the data.', isCorrect: false },
    ],
    explanation: 'Mismatched types trigger an implicit conversion governed by data-type precedence. Because numeric outranks string, SQL Server converts the NVARCHAR column to int per row, which (like any function on the column) defeats the index and forces a scan — and can throw if a value isn\'t numeric. Compare with a matching-typed literal: `AccountCode = N\'12345\'`.',
    hints: ['Type mismatch → implicit conversion on the column → scan', 'Match the literal type: N\'12345\''],
    tags: ['tsql', 'antipatterns', 'implicit-conversion', 'sargable'],
  },
  {
    id: 'tsql-anti-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_ANTIPATTERNS,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Rewrite this non-SARGable query into a SARGable one that can seek the index on `OrderDate`. Original intent: all of `dbo.FactOrders` (select `OrderId`, `Amount`) for the year 2026. Do NOT wrap `OrderDate` in a function — use a half-open date range instead.',
    starterCode: `-- Non-SARGable: SELECT OrderId, Amount FROM dbo.FactOrders WHERE YEAR(OrderDate) = 2026;
-- Rewrite below with a date range:
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
WHERE OrderDate >= '2026-01-01' AND OrderDate < '2027-01-01';`,
    explanation: 'Keeping `OrderDate` bare on one side of each comparison lets the optimizer seek the index (and eliminate partitions). The half-open range `>= \'2026-01-01\' AND < \'2027-01-01\'` captures the whole year including times on Dec 31 without `YEAR()` — and avoids the `BETWEEN … AND \'2026-12-31\'` trap that would miss timestamps later that day.',
    hints: ['Keep OrderDate bare — no YEAR()', "OrderDate >= '2026-01-01' AND OrderDate < '2027-01-01'"],
    tags: ['tsql', 'antipatterns', 'sargable'],
  },
];
