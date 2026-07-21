/**
 * Topic.TSQL_COLUMNSTORE — SQL for Data Engineering (T-SQL).
 * Pillar 7 (Performance): clustered columnstore for the warehouse
 * (batch mode, segment/rowgroup elimination).
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const tsql_columnstore_questions: Question[] = [
  {
    id: 'tsql-col-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_COLUMNSTORE,
    course: Course.SQL,
    question: 'How does a columnstore index store data differently from a traditional rowstore, and why does it suit a warehouse?',
    options: [
      { id: 'a', text: 'It stores data column-by-column (not row-by-row), so analytical queries read only the columns they need and compress heavily — ideal for scan-and-aggregate over huge fact tables.', isCorrect: true },
      { id: 'b', text: 'It stores each row as a JSON document, which makes aggregation faster.', isCorrect: false },
      { id: 'c', text: 'It keeps the entire table in memory at all times, which is why it is faster.', isCorrect: false },
      { id: 'd', text: 'It is identical to a rowstore index but uses a different name for marketing reasons.', isCorrect: false },
    ],
    explanation: 'Columnstore physically groups values by column. Analytical queries typically scan a few columns over millions of rows and aggregate — so reading only those columns (and benefiting from strong per-column compression) is dramatically less I/O than a rowstore that must read whole rows. That is exactly the warehouse access pattern.',
    hints: ['Stored by column, not by row', 'Reads only needed columns + heavy compression → great for scan/aggregate'],
    tags: ['tsql', 'columnstore', 'compression'],
  },
  {
    id: 'tsql-col-mcq-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TSQL_COLUMNSTORE,
    course: Course.SQL,
    question: 'What is "rowgroup elimination" in a columnstore, and what does it depend on?',
    options: [
      { id: 'a', text: 'The engine skips entire rowgroups (~1M-row segments) whose min/max metadata can\'t match the filter — most effective when data is loaded in the filter column\'s order.', isCorrect: true },
      { id: 'b', text: 'It deletes rowgroups that contain NULLs to keep the index clean.', isCorrect: false },
      { id: 'c', text: 'It merges all rowgroups into one before every query, eliminating fragmentation.', isCorrect: false },
      { id: 'd', text: 'It randomly samples rowgroups to estimate results faster.', isCorrect: false },
    ],
    explanation: 'A columnstore keeps min/max values per segment for each ~1M-row rowgroup. If a filter\'s range falls outside a rowgroup\'s min/max, the whole rowgroup is skipped. This works best when rows are loaded ordered by the common filter column (e.g. date), so each rowgroup covers a tight value range — analogous to partition elimination but at the segment level.',
    hints: ['Skip ~1M-row segments via min/max metadata', 'Best when loaded in filter-column order'],
    tags: ['tsql', 'columnstore', 'rowgroup-elimination', 'segment'],
  },
  {
    id: 'tsql-col-mcq-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_COLUMNSTORE,
    course: Course.SQL,
    question: 'When is a clustered columnstore index the WRONG choice?',
    options: [
      { id: 'a', text: 'For OLTP-style workloads doing frequent single-row lookups and point updates — rowstore B-tree indexes serve those far better than columnstore.', isCorrect: true },
      { id: 'b', text: 'For large analytical fact tables scanned and aggregated — columnstore should never be used there.', isCorrect: false },
      { id: 'c', text: 'It is always the right choice for every table regardless of workload.', isCorrect: false },
      { id: 'd', text: 'Only when the table has more than ten columns.', isCorrect: false },
    ],
    explanation: 'Columnstore is built for large scans and aggregations, not pinpoint access. A workload of single-row seeks and frequent small updates (classic OLTP) performs poorly on columnstore; a rowstore clustered B-tree is the right tool. Many warehouses use columnstore for big facts and rowstore for small, frequently-seeked dimensions.',
    hints: ['Bad for single-row lookups / point updates (OLTP)', 'Use rowstore B-tree there'],
    tags: ['tsql', 'columnstore', 'oltp', 'tradeoffs'],
  },
  {
    id: 'tsql-col-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_COLUMNSTORE,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the keywords to turn a fact table into a clustered columnstore.',
    template: `CREATE ___ ___ INDEX CCI_FactSales
ON dbo.FactSales;`,
    blanks: ['CLUSTERED', 'COLUMNSTORE'],
    solution: `CREATE CLUSTERED COLUMNSTORE INDEX CCI_FactSales
ON dbo.FactSales;`,
    explanation: 'A `CLUSTERED COLUMNSTORE INDEX` converts the whole table to column-oriented storage — the standard physical design for a large warehouse fact. Unlike a rowstore clustered index, you do not list key columns: it reorganises every column into compressed segments.',
    hints: ['CLUSTERED COLUMNSTORE INDEX', 'No key column list needed'],
    tags: ['tsql', 'columnstore', 'clustered-columnstore', 'cloze'],
  },
  {
    id: 'tsql-col-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_COLUMNSTORE,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Create a clustered columnstore index named `CCI_FactOrders` on the large analytical fact table `dbo.FactOrders` to optimise it for scan-and-aggregate queries.',
    starterCode: `-- CREATE CLUSTERED COLUMNSTORE INDEX ... ON ...;
`,
    testCases: [
      {
        input: 'CREATE CLUSTERED COLUMNSTORE INDEX CCI_FactOrders ON dbo.FactOrders',
        expectedOutput: 'Fact table converted to clustered columnstore',
        description: 'Clustered columnstore on a fact',
      },
    ],
    solution: `CREATE CLUSTERED COLUMNSTORE INDEX CCI_FactOrders
ON dbo.FactOrders;`,
    tieredHints: {
      apiSignature: 'CREATE CLUSTERED COLUMNSTORE INDEX index_name ON schema.table;',
      skeleton: `CREATE ____ ____ INDEX CCI_FactOrders
____ dbo.FactOrders;`,
    },
    explanation: 'A clustered columnstore makes column-oriented storage the table\'s primary structure, giving the heavy compression and column-scan efficiency that analytical aggregations over a big fact need. No key columns are specified — the index reorganises all columns into compressed rowgroups/segments.',
    hints: ['CREATE CLUSTERED COLUMNSTORE INDEX name ON table', 'No column list'],
    tags: ['tsql', 'columnstore', 'clustered-columnstore'],
  },
  {
    id: 'tsql-col-mcq-4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TSQL_COLUMNSTORE,
    course: Course.SQL,
    question: 'Besides compression, what makes columnstore queries fast at execution time?',
    options: [
      { id: 'a', text: 'Batch-mode execution: operators process rows in batches of roughly 900 at a time instead of one row at a time, cutting per-row CPU overhead for scans, aggregates, and joins.', isCorrect: true },
      { id: 'b', text: 'Every columnstore query automatically runs on a separate server dedicated to analytics.', isCorrect: false },
      { id: 'c', text: 'Columnstore indexes disable the query optimizer, which guarantees the fastest possible plan.', isCorrect: false },
      { id: 'd', text: 'Batch mode silently converts the columnstore into a rowstore before the query executes.', isCorrect: false },
    ],
    explanation: 'Row-mode execution (the rowstore default) processes one row per operator call. Columnstore indexes enable batch-mode execution, where operators handle a batch of ~900 rows at once, dramatically cutting per-row CPU overhead. Combined with column-oriented compression and rowgroup elimination, that is why columnstore is so much faster for large analytical scans.',
    hints: ['Rows processed in batches (~900), not one at a time', 'Cuts per-row CPU overhead for scans/aggregates/joins'],
    tags: ['tsql', 'columnstore', 'batch-mode'],
  },
];
