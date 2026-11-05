/**
 * Topic.TSQL_INDEXES - SQL for Data Engineering (T-SQL).
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
import { sampleTable } from './tsqlSampleTables';

export const tsql_indexes_questions: Question[] = [
  {
    id: 'tsql-idx-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_INDEXES,
    course: Course.SQL,
    question: 'What is the fundamental difference between a clustered and a nonclustered index?',
    options: [
      { id: 'a', text: 'The clustered index is the table itself, with the rows stored in key order, so a table has one; a nonclustered index is a separate structure that points back to the rows.', isCorrect: true },
      { id: 'b', text: 'A nonclustered index is the table itself with its rows in key order; a clustered index is a separate copy that points back to the rows.', isCorrect: false },
      { id: 'c', text: 'A table can have many clustered indexes but only one nonclustered index, because each clustered index stores its own copy of the rows.', isCorrect: false },
      { id: 'd', text: 'A clustered index must be built on the primary key; a nonclustered index must be built on a foreign key.', isCorrect: false },
    ],
    explanation: 'The clustered index defines the physical row order, so its leaf level holds the full rows and there can be only one per table. A nonclustered index is a separate sorted copy of its key columns plus a pointer (the clustered key or RID) used to fetch the rest of the row. A clustered index is often built on the primary key, but it does not have to be, and a nonclustered index can be on any columns.',
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
      { id: 'a', text: 'A query that filters on `CustomerKey`, alone or together with `OrderDate`; a filter on `OrderDate` alone cannot seek.', isCorrect: true },
      { id: 'b', text: 'A query that filters on `OrderDate`, alone or together with `CustomerKey`; a filter on `CustomerKey` alone cannot seek.', isCorrect: false },
      { id: 'c', text: 'A query that filters on either column alone, because the index keeps a separate sort for each column.', isCorrect: false },
      { id: 'd', text: 'Only a query that filters on both columns, because a seek needs the whole key.', isCorrect: false },
    ],
    explanation: 'A composite index is sorted by its leading column first, then the next. A seek needs the leading column (`CustomerKey`), and it can narrow further by `OrderDate` inside one customer. Filtering only on `OrderDate` cannot seek, because the dates are scattered under every customer (there is no top-level order on OrderDate). This "leftmost prefix" rule is why composite-index column order is a deliberate design choice.',
    hints: ['Sorted by leading column first', 'Leftmost-prefix rule: the leading column is needed for a seek'],
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
      { id: 'a', text: 'It stores those columns at the index leaf without sorting by them, so a query that needs only the key and included columns is covered and skips the lookup back to the table.', isCorrect: true },
      { id: 'b', text: 'It adds those columns to the index key after the first column, so the index is also sorted by them and a seek can use them.', isCorrect: false },
      { id: 'c', text: 'It copies those columns into a second, separate index, so a query reads two indexes instead of the table.', isCorrect: false },
      { id: 'd', text: 'It stores those columns at the leaf and makes the index unique on them, so duplicates in those columns are rejected.', isCorrect: false },
    ],
    explanation: 'INCLUDE adds non-key columns to the leaf level only (not the sorted key). When an index contains every column a query touches, it is a "covering index": the query is served entirely from the index and avoids the expensive key lookup back into the table for each row. Because included columns are not in the key, they do not sort the index and a seek cannot use them.',
    hints: ['Stored at the leaf, not in the key', 'Makes the index "cover" the query, so no key lookup is needed'],
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
      { id: 'a', text: 'Every index is updated on each INSERT, UPDATE and DELETE and takes storage, so extra indexes slow writes and bloat the database while helping few reads.', isCorrect: true },
      { id: 'b', text: 'Every index slows reads as well, because the engine has to check each one before it reads the table.', isCorrect: false },
      { id: 'c', text: 'Indexes cost nothing to keep, but the optimizer stops using any index once a table has more than a few.', isCorrect: false },
      { id: 'd', text: 'Only the first index on a table is kept up to date on writes, so the others return stale rows.', isCorrect: false },
    ],
    explanation: 'Indexes are a read/write trade-off. Every write must update every affected index, so over-indexing slows loads and DML and bloats storage, with little read benefit for most of the indexes. In a write-heavy ELT staging area especially, you index deliberately for the queries that matter, not defensively.',
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
    question: 'Fill in the two keywords to create a nonclustered index keyed on CustomerKey that also stores Amount at its leaf, so a lookup on CustomerKey that returns Amount is covered.',
    tables: [sampleTable('dbo.FactSales', ['CustomerKey', 'ProductKey', 'Amount', 'OrderDate'])],
    template: `-- dbo.FactSales(CustomerKey, ProductKey, Amount, OrderDate)
CREATE ___ INDEX IX_FactSales_Customer
ON dbo.FactSales (CustomerKey)
___ (Amount);`,
    blanks: ['NONCLUSTERED', 'INCLUDE'],
    solution: `CREATE NONCLUSTERED INDEX IX_FactSales_Customer
ON dbo.FactSales (CustomerKey)
INCLUDE (Amount);`,
    explanation: '`CREATE NONCLUSTERED INDEX ... ON table (keycols) INCLUDE (othercols)` builds a secondary index keyed on `CustomerKey` with `Amount` stored at the leaf. A query that filters by CustomerKey and returns Amount, such as customer 1 and its 129.0, is then covered and served from the index alone.',
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
    tables: [sampleTable('dbo.FactOrders', ['CustomerKey', 'OrderDate', 'Amount'])],
    starterCode: `-- dbo.FactOrders(OrderId, CustomerKey, ProductKey, OrderDate, Amount)
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
INCLUDE (Amount);
-- OR
CREATE INDEX IX_FactOrders_Cust_Date
ON dbo.FactOrders (CustomerKey, OrderDate)
INCLUDE (Amount);`,
    tieredHints: {
      apiSignature: 'CREATE NONCLUSTERED INDEX index_name ON tbl (key_col1, key_col2, ...) INCLUDE (included_col1, ...);',
      skeleton: `CREATE ____ INDEX IX_FactOrders_Cust_Date
ON dbo.FactOrders (____, ____)
____ (Amount);`,
    },
    explanation: 'The composite key `(CustomerKey, OrderDate)` supports a seek that filters on CustomerKey (and narrows by OrderDate), and `INCLUDE (Amount)` puts the returned measure at the leaf so the query is fully covered - no lookup back to the base table. Key order matters: CustomerKey leads because it is the primary filter. A plain `CREATE INDEX` is nonclustered by default, so leaving out `NONCLUSTERED` builds the same index.',
    hints: ['Key on (CustomerKey, OrderDate), leading column is the main filter', 'INCLUDE (Amount) to cover the SELECT'],
    requires: [/CREATE\s+(NONCLUSTERED\s+)?INDEX/i, /INCLUDE/i, /\(\s*\[?CustomerKey\]?(\s+(ASC|DESC))?\s*,\s*\[?OrderDate\]?(\s+(ASC|DESC))?\s*\)/i],
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
      { id: 'a', text: 'An index on only the rows that match its predicate, smaller and cheaper to keep up to date, worth it when queries use that same predicate on a table that is mostly inactive.', isCorrect: true },
      { id: 'b', text: 'An index on every row that also removes the non-matching rows from the results of queries that use it, worth it when most queries want only the active rows.', isCorrect: false },
      { id: 'c', text: 'An index on only the rows that match its predicate, which every query on the table must repeat in a WHERE clause or it fails.', isCorrect: false },
      { id: 'd', text: 'An index on every row that is rebuilt from the matching rows each time a query uses the predicate, worth it for small tables.', isCorrect: false },
    ],
    explanation: 'A filtered index (`CREATE INDEX ... ON table (cols) WHERE <predicate>`) indexes only the rows matching the predicate. When that predicate targets a small, frequently-queried subset - active orders in a table that is mostly closed/historical, say - the index is far smaller and cheaper to maintain than indexing every row, and the optimizer uses it automatically for queries whose WHERE clause covers that predicate. Other queries still work, they just cannot use that index.',
    hints: ['Indexes only the rows matching a WHERE predicate', 'Cheap + selective when most rows do not match the predicate'],
    tags: ['tsql', 'indexes', 'filtered-index'],
  },
  {
    id: 'tsql-idx-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_INDEXES,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'A nonclustered index on (CustomerKey, OrderDate) keeps its entries sorted by CustomerKey first and, within one customer, by OrderDate. The table rows below sit in arrival order. Which entries does a full scan of that index read, in order? Write one entry per line, as CustomerKey and OrderDate separated by a comma.',
    tables: [
      {
        name: 'dbo.FactOrders',
        columns: ['OrderId', 'CustomerKey', 'OrderDate'],
        rows: [
          [1, 9, '2026-03-02'],
          [2, 4, '2026-03-09'],
          [3, 9, '2026-01-15'],
          [4, 4, '2026-02-20'],
          [5, 7, '2026-03-01'],
        ],
      },
    ],
    code: `SELECT CustomerKey, OrderDate
FROM dbo.FactOrders
ORDER BY CustomerKey, OrderDate;`,
    expectedOutput: `4, 2026-02-20
4, 2026-03-09
7, 2026-03-01
9, 2026-01-15
9, 2026-03-02`,
    explanation: 'The entries are sorted by CustomerKey, and only inside one customer by OrderDate: customer 4 has both its dates in order, then 7, then 9. That is why a seek on CustomerKey alone, or on CustomerKey plus a date range, reads one contiguous slice of the index, while a filter on OrderDate alone finds its dates scattered under every customer and cannot seek.',
    hints: ['Sort by CustomerKey first', 'Break ties inside one customer by OrderDate'],
    tags: ['tsql', 'indexes', 'composite', 'key-order', 'predict'],
  },
];
