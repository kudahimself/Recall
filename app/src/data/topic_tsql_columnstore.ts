/**
 * Topic.TSQL_COLUMNSTORE - SQL for Data Engineering (T-SQL).
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
import { sampleTable } from './tsqlSampleTables';

export const tsql_columnstore_questions: Question[] = [
  {
    id: 'tsql-col-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_COLUMNSTORE,
    course: Course.SQL,
    question: 'How does a columnstore index store data differently from a traditional rowstore, and why does it suit a warehouse?',
    options: [
      { id: 'a', text: 'It stores each column together and compresses it, so a report reads only the columns it needs, which suits scanning and aggregating a huge fact table.', isCorrect: true },
      { id: 'b', text: 'It stores each row together and compresses the whole row, so a report reads fewer pages, which suits looking up one row at a time.', isCorrect: false },
      { id: 'c', text: 'It stores each column together but uncompressed, so a report reads only the columns it needs, at the cost of a larger table.', isCorrect: false },
      { id: 'd', text: 'It stores each column together in memory only, so a report never reads disk, which is why the table must fit in memory.', isCorrect: false },
    ],
    explanation: 'Columnstore physically groups values by column. Analytical queries typically scan a few columns over millions of rows and aggregate - so reading only those columns (and benefiting from strong per-column compression) is dramatically less I/O than a rowstore that must read whole rows. That is exactly the warehouse access pattern. Columnstore data lives on disk like any other table, and the compression is a main part of the saving.',
    hints: ['Stored by column, not by row', 'Reads only the needed columns and compresses heavily, which suits scan and aggregate'],
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
      { id: 'a', text: 'The engine skips whole rowgroups whose recorded minimum and maximum cannot match the filter, which works best when the rows were loaded in the filter column\'s order.', isCorrect: true },
      { id: 'b', text: 'The engine skips whole rowgroups whose recorded minimum and maximum cannot match the filter, which works best when the rows were loaded in random order.', isCorrect: false },
      { id: 'c', text: 'The engine skips individual rows inside each rowgroup that cannot match the filter, which works best when the rows were loaded in the filter column\'s order.', isCorrect: false },
      { id: 'd', text: 'The engine deletes rowgroups whose recorded minimum and maximum cannot match the filter, so later queries read fewer rows.', isCorrect: false },
    ],
    explanation: 'A columnstore keeps min/max values per segment for each ~1M-row rowgroup. If a filter\'s range falls outside a rowgroup\'s min/max, the whole rowgroup is skipped. This works best when rows are loaded ordered by the common filter column (e.g. date), so each rowgroup covers a tight value range - analogous to partition elimination but at the segment level. Nothing is deleted and no single rows are skipped this way: it is the whole rowgroup that is left unread.',
    hints: ['Skip whole rowgroups of about a million rows using their min and max', 'Best when the rows were loaded in filter-column order'],
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
      { id: 'a', text: 'When the workload is mostly single-row lookups and small updates, because a rowstore B-tree serves those far better.', isCorrect: true },
      { id: 'b', text: 'When the table is a large fact scanned and aggregated by reports, because columnstore compresses too much to be read quickly.', isCorrect: false },
      { id: 'c', text: 'When the table is loaded in large batches, because columnstore only accepts single-row inserts.', isCorrect: false },
      { id: 'd', text: 'When the table has many columns, because columnstore has to read all of them for every query.', isCorrect: false },
    ],
    explanation: 'Columnstore is built for large scans and aggregations, not pinpoint access. A workload of single-row seeks and frequent small updates (classic OLTP) performs poorly on columnstore; a rowstore clustered B-tree is the right tool. Many warehouses use columnstore for big facts and rowstore for small, frequently-seeked dimensions. Wide tables are no problem: a columnstore reads only the columns a query names.',
    hints: ['Bad for single-row lookups and point updates (OLTP)', 'Use a rowstore B-tree there'],
    tags: ['tsql', 'columnstore', 'oltp', 'tradeoffs'],
  },
  {
    id: 'tsql-col-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_COLUMNSTORE,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the two keywords, the index kind and the storage kind, to turn the fact table into a clustered columnstore.',
    tables: [sampleTable('dbo.FactSales', ['CustomerKey', 'ProductKey', 'Amount', 'OrderDate'])],
    template: `-- dbo.FactSales(CustomerKey, ProductKey, Amount, OrderDate)
CREATE ___ ___ INDEX CCI_FactSales
ON dbo.FactSales;`,
    blanks: ['CLUSTERED', 'COLUMNSTORE'],
    solution: `CREATE CLUSTERED COLUMNSTORE INDEX CCI_FactSales
ON dbo.FactSales;`,
    explanation: 'A `CLUSTERED COLUMNSTORE INDEX` converts the whole table to column-oriented storage, the standard physical design for a large warehouse fact. Unlike a rowstore clustered index, you do not list key columns: it reorganises every column (CustomerKey, ProductKey, Amount and OrderDate) into compressed segments.',
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
    tables: [sampleTable('dbo.FactOrders', ['OrderId', 'CustomerKey', 'ProductKey', 'OrderDate', 'Amount'])],
    starterCode: `-- dbo.FactOrders(OrderId, CustomerKey, ProductKey, OrderDate, Amount)
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
    explanation: 'A clustered columnstore makes column-oriented storage the table\'s primary structure, giving the heavy compression and column-scan efficiency that analytical aggregations over a big fact need. No key columns are specified - the index reorganises all columns into compressed rowgroups/segments.',
    hints: ['CREATE CLUSTERED COLUMNSTORE INDEX name ON table', 'No column list'],
    requires: [/CREATE\s+CLUSTERED\s+COLUMNSTORE\s+INDEX/i],
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
      { id: 'a', text: 'Batch-mode execution: each operator handles about 900 rows per call instead of one, cutting the CPU spent per row in scans, aggregates and joins.', isCorrect: true },
      { id: 'b', text: 'Batch-mode execution: each operator handles about 900 columns per call instead of one, so a wide table is read in one step.', isCorrect: false },
      { id: 'c', text: 'Parallel execution: the query always runs on one thread per rowgroup, which is the only way a columnstore speeds up a scan.', isCorrect: false },
      { id: 'd', text: 'Row-mode execution: each operator handles one row per call, as in a rowstore, but the rows are cached in memory first.', isCorrect: false },
    ],
    explanation: 'Row-mode execution (the rowstore default) processes one row per operator call. Columnstore indexes enable batch-mode execution, where operators handle a batch of ~900 rows at once, dramatically cutting per-row CPU overhead. The batch is made of rows, not columns, and the engine does not turn the columnstore into a rowstore to do it. Combined with column-oriented compression and rowgroup elimination, that is why columnstore is so much faster for large analytical scans.',
    hints: ['Rows are processed in batches of about 900, not one at a time', 'Cuts per-row CPU overhead for scans, aggregates and joins'],
    tags: ['tsql', 'columnstore', 'batch-mode'],
  },
  {
    id: 'tsql-col-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_COLUMNSTORE,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'A columnstore keeps the minimum and maximum OrderDate of each rowgroup. A query asking for orders from 20 February to 10 March must read every rowgroup whose min-max range overlaps that window, and may skip the rest. Which rowgroups does it read? Write one GroupNo per line in the ORDER BY order.',
    tables: [
      {
        name: 'dbo.RowGroupStats',
        columns: ['GroupNo', 'MinDate', 'MaxDate'],
        rows: [
          [1, '2026-01-01', '2026-01-31'],
          [2, '2026-02-01', '2026-02-28'],
          [3, '2026-02-15', '2026-03-15'],
          [4, '2026-03-16', '2026-04-30'],
        ],
      },
    ],
    code: `SELECT GroupNo
FROM dbo.RowGroupStats
WHERE MaxDate >= '2026-02-20' AND MinDate <= '2026-03-10'
ORDER BY GroupNo;`,
    expectedOutput: `2
3`,
    explanation: 'A rowgroup can hold a match only when its range overlaps the window: its max is at or after 20 February and its min is at or before 10 March. Groups 2 and 3 overlap, group 1 ends in January and group 4 starts after 10 March, so those two are eliminated without being read. Groups 2 and 3 overlap each other too, which is what happens when rows were not loaded in date order and why loading sorted by the filter column keeps elimination sharp.',
    hints: ['A rowgroup overlaps when MaxDate >= window start and MinDate <= window end', 'Rowgroups outside the window are skipped'],
    tags: ['tsql', 'columnstore', 'rowgroup-elimination', 'predict'],
  },
];
