/**
 * Topic.TSQL_INDEXES — SQL for Data Engineering (T-SQL).
 * Pillar 7 (Performance): clustered vs nonclustered, composite (key order),
 * INCLUDE (covering), filtered indexes; write cost.
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const tsql_indexes_questions: Question[] = [
  {
    id: 'tsql-idx-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_INDEXES,
    course: Course.SQL,
    question: 'What is the fundamental difference between a clustered and a nonclustered index?',
    options: [
      { id: 'a', text: 'The clustered index IS the table — its leaf level stores the actual rows in key order (one per table); a nonclustered index is a separate structure that points back to those rows.', isCorrect: true },
      { id: 'b', text: 'A clustered index is stored in memory while a nonclustered index is always on disk.', isCorrect: false },
      { id: 'c', text: 'A table can have many clustered indexes but only one nonclustered index.', isCorrect: false },
      { id: 'd', text: 'A clustered index can only be built on a primary key, a nonclustered index only on foreign keys.', isCorrect: false },
    ],
    explanation: 'The clustered index defines the physical row order, so its leaf level holds the full rows — there can be only one per table. A nonclustered index is a separate sorted copy of its key columns plus a pointer (the clustered key or RID) used to fetch the rest of the row.',
    hints: ['Clustered = the table itself, rows in key order, one per table', 'Nonclustered = separate structure pointing back to rows'],
    tags: ['tsql', 'indexes', 'clustered', 'nonclustered'],
  },
  {
    id: 'tsql-idx-mcq-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_INDEXES,
    course: Course.SQL,
    question: 'For a composite index on `(CustomerKey, OrderDate)`, which query can seek efficiently on the index?',
    options: [
      { id: 'a', text: 'A query filtering on `CustomerKey` (the leading column) — alone or with OrderDate; the index is useless for a seek that filters only on `OrderDate`.', isCorrect: true },
      { id: 'b', text: 'Any query filtering on either column equally, since column order in a composite index does not matter.', isCorrect: false },
      { id: 'c', text: 'Only a query filtering on `OrderDate`, because the last column is the one indexes seek on.', isCorrect: false },
      { id: 'd', text: 'No query can seek; composite indexes only ever support full scans.', isCorrect: false },
    ],
    explanation: 'A composite index is sorted by its leading column first, then the next. A seek needs the leading column (`CustomerKey`); filtering only on `OrderDate` can\'t use it for a seek (there is no top-level order on OrderDate). This "leftmost prefix" rule is why composite-index column order is a deliberate design choice.',
    hints: ['Sorted by leading column first', 'Leftmost-prefix rule — leading column needed for a seek'],
    tags: ['tsql', 'indexes', 'composite', 'key-order'],
  },
  {
    id: 'tsql-idx-mcq-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_INDEXES,
    course: Course.SQL,
    question: 'What does adding `INCLUDE (Amount, Status)` to a nonclustered index achieve?',
    options: [
      { id: 'a', text: 'It stores those columns in the index leaf so a query needing only the key + included columns is "covered" — answered from the index with no key lookup back to the table.', isCorrect: true },
      { id: 'b', text: 'It adds those columns to the index key, changing the sort order of the index.', isCorrect: false },
      { id: 'c', text: 'It forces the query optimizer to ignore those columns for faster scans.', isCorrect: false },
      { id: 'd', text: 'It creates a foreign key on the included columns automatically.', isCorrect: false },
    ],
    explanation: 'INCLUDE adds non-key columns to the leaf level only (not the sorted key). When an index contains every column a query touches, it is a "covering index" — the query is served entirely from the index and avoids the expensive key lookup back into the table for each row.',
    hints: ['Stored at the leaf, not in the key', 'Makes the index "cover" the query → no key lookup'],
    tags: ['tsql', 'indexes', 'include', 'covering-index'],
  },
  {
    id: 'tsql-idx-mcq-4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_INDEXES,
    course: Course.SQL,
    question: 'Why not just add an index to every column "to be safe"?',
    options: [
      { id: 'a', text: 'Each index must be maintained on every INSERT/UPDATE/DELETE and consumes storage, so excess indexes slow writes and waste space without helping reads.', isCorrect: true },
      { id: 'b', text: 'Indexes are free to maintain; the only reason is that SQL Server caps the number at four per table.', isCorrect: false },
      { id: 'c', text: 'Extra indexes corrupt the clustered index and must be rebuilt nightly.', isCorrect: false },
      { id: 'd', text: 'Indexes only help if there is exactly one per table; a second index disables the first.', isCorrect: false },
    ],
    explanation: 'Indexes are a read/write trade-off. Every write must update every affected index, so over-indexing slows loads and DML and bloats storage. In a write-heavy ELT staging area especially, you index deliberately for the queries that matter, not defensively.',
    hints: ['Every write maintains every index', 'Read speed paid for with write cost + storage'],
    tags: ['tsql', 'indexes', 'write-cost'],
  },
  {
    id: 'tsql-idx-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_INDEXES,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the keywords to create a nonclustered index that covers a lookup on CustomerKey returning Amount.',
    template: `-- dbo.FactSales(CustomerKey, ProductKey, Amount, OrderDate)
CREATE ___ INDEX IX_FactSales_Customer
ON dbo.FactSales (CustomerKey)
___ (Amount);`,
    blanks: ['NONCLUSTERED', 'INCLUDE'],
    solution: `CREATE NONCLUSTERED INDEX IX_FactSales_Customer
ON dbo.FactSales (CustomerKey)
INCLUDE (Amount);`,
    explanation: '`CREATE NONCLUSTERED INDEX … ON table (keycols) INCLUDE (othercols)` builds a secondary index keyed on `CustomerKey` with `Amount` stored at the leaf. A query that filters by CustomerKey and returns Amount is then covered — served from the index alone.',
    hints: ['Secondary index type is NONCLUSTERED', 'Carry extra columns with INCLUDE'],
    tags: ['tsql', 'indexes', 'nonclustered', 'include', 'cloze'],
  },
  {
    id: 'tsql-idx-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_INDEXES,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Queries filter `dbo.FactOrders` by `CustomerKey` and `OrderDate` and return `Amount`. Create a covering nonclustered index named `IX_FactOrders_Cust_Date` keyed on `(CustomerKey, OrderDate)` that includes `Amount`.',
    starterCode: `-- CREATE NONCLUSTERED INDEX ... ON dbo.FactOrders (...) INCLUDE (...);
`,
    testCases: [
      {
        input: 'CREATE NONCLUSTERED INDEX on (CustomerKey, OrderDate) INCLUDE (Amount)',
        expectedOutput: 'Covering index for the customer+date lookup',
        description: 'Composite covering index',
      },
    ],
    solution: `CREATE NONCLUSTERED INDEX IX_FactOrders_Cust_Date
ON dbo.FactOrders (CustomerKey, OrderDate)
INCLUDE (Amount);`,
    tieredHints: {
      apiSignature: 'CREATE NONCLUSTERED INDEX index_name ON tbl (key_col1, key_col2, ...) INCLUDE (included_col1, ...);',
      skeleton: `CREATE ____ INDEX IX_FactOrders_Cust_Date
ON dbo.FactOrders (____, ____)
____ (Amount);`,
    },
    explanation: 'The composite key `(CustomerKey, OrderDate)` supports a seek that filters on CustomerKey (and narrows by OrderDate), and `INCLUDE (Amount)` puts the returned measure at the leaf so the query is fully covered — no lookup back to the base table. Key order matters: CustomerKey leads because it is the primary filter.',
    hints: ['Key on (CustomerKey, OrderDate) — leading column is the main filter', 'INCLUDE (Amount) to cover the SELECT'],
    requires: [/CREATE\s+(NONCLUSTERED\s+)?INDEX/i, /INCLUDE/i],
    tags: ['tsql', 'indexes', 'composite', 'include', 'covering-index'],
  },
  {
    id: 'tsql-idx-mcq-5',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TSQL_INDEXES,
    course: Course.SQL,
    question: 'What is a filtered index, and when is `CREATE INDEX ... WHERE IsActive = 1` worth using?',
    options: [
      { id: 'a', text: 'An index built on only the subset of rows matching a predicate - smaller and cheaper to maintain than a full-table index, and highly effective when queries filter on that same predicate against a mostly-inactive/historical table.', isCorrect: true },
      { id: 'b', text: 'An index that automatically strips NULL values out of the RESULT SET of every query, filtered or not.', isCorrect: false },
      { id: 'c', text: 'An index that only works if every query against the table includes a WHERE clause, or it is silently ignored.', isCorrect: false },
      { id: 'd', text: 'A temporary index that is dropped automatically after the next filtered SELECT runs.', isCorrect: false },
    ],
    explanation: 'A filtered index (`CREATE INDEX ... ON table (cols) WHERE <predicate>`) indexes only the rows matching the predicate. When that predicate targets a small, frequently-queried subset - active orders in a table that is mostly closed/historical, say - the index is far smaller and cheaper to maintain than indexing every row, and the optimizer uses it automatically for compatible queries.',
    hints: ['Indexes only the rows matching a WHERE predicate', 'Cheap + selective when most rows do not match the predicate'],
    tags: ['tsql', 'indexes', 'filtered-index'],
  },
];
