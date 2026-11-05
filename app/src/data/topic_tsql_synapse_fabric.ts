/**
 * Topic.TSQL_SYNAPSE_FABRIC - SQL for Data Engineering (T-SQL).
 * Pillar 8 (Cloud Warehouse): Synapse Dedicated SQL Pool / Fabric Warehouse -
 * DISTRIBUTION = HASH / ROUND_ROBIN / REPLICATE, CTAS, columnstore, statistics.
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

export const tsql_synapse_fabric_questions: Question[] = [
  {
    id: 'tsql-syn-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_SYNAPSE_FABRIC,
    course: Course.SQL,
    question: 'In a Synapse Dedicated SQL Pool, what do the three table distribution options (HASH, ROUND_ROBIN, REPLICATE) control?',
    options: [
      { id: 'a', text: 'Where each row is stored across the 60 distributions: by hashing a column, dealt out evenly, or copied in full to every node.', isCorrect: true },
      { id: 'b', text: 'How a table is split into date partitions, and which of those partitions are kept in memory.', isCorrect: false },
      { id: 'c', text: 'Which compute node the query coordinator runs on, and how many replicas it keeps for failover.', isCorrect: false },
      { id: 'd', text: 'How each column is compressed on disk, chosen separately for every column.', isCorrect: false },
    ],
    explanation: 'Distribution decides where each row physically lives across the pool\'s 60 distributions. HASH places rows by hashing a chosen column (co-locates matching keys to avoid shuffles), ROUND_ROBIN spreads rows evenly with no key logic (fast loads, good for staging), and REPLICATE copies the full table to every node (best for small dimensions).',
    hints: ['Controls row placement across the 60 distributions', 'HASH / ROUND_ROBIN / REPLICATE'],
    tags: ['tsql', 'synapse', 'distribution'],
  },
  {
    id: 'tsql-syn-mcq-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TSQL_SYNAPSE_FABRIC,
    course: Course.SQL,
    question: 'Which distribution choice fits each table: a huge fact, a tiny lookup dimension, and a transient staging table?',
    options: [
      { id: 'a', text: 'HASH on a common join key for the fact, REPLICATE for the dimension, and ROUND_ROBIN for staging.', isCorrect: true },
      { id: 'b', text: 'REPLICATE for the fact, HASH for the dimension, and ROUND_ROBIN for staging.', isCorrect: false },
      { id: 'c', text: 'ROUND_ROBIN for the fact, REPLICATE for the dimension, and HASH for staging.', isCorrect: false },
      { id: 'd', text: 'HASH for the fact, ROUND_ROBIN for the dimension, and REPLICATE for staging.', isCorrect: false },
    ],
    explanation: 'Match distribution to the table\'s role: HASH a large fact on the column it most often joins or aggregates by so matching rows co-locate (minimal shuffle); REPLICATE small dimensions so every node has a local copy for joins; ROUND_ROBIN staging because loads are fast and you have not picked a key yet. Replicating a huge fact copies it to every node, and round-robin on the fact forces a shuffle for every join. A bad fact hash key causes skew or constant data movement.',
    hints: ['Big fact → HASH on join key', 'Small dim → REPLICATE; staging → ROUND_ROBIN'],
    tags: ['tsql', 'synapse', 'distribution', 'tradeoffs'],
  },
  {
    id: 'tsql-syn-mcq-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_SYNAPSE_FABRIC,
    course: Course.SQL,
    question: 'Why is CTAS (`CREATE TABLE AS SELECT`) the preferred way to transform/load big tables in Synapse?',
    options: [
      { id: 'a', text: 'It creates the table and loads it in one parallel statement, with the distribution and the index set in that same statement.', isCorrect: true },
      { id: 'b', text: 'It copies the shape of the query and leaves the new table empty until a later INSERT fills it.', isCorrect: false },
      { id: 'c', text: 'It keeps the source table\'s distribution and indexes, so there is nothing left to choose.', isCorrect: false },
      { id: 'd', text: 'It updates the rows of an existing table in place, so no new table is created.', isCorrect: false },
    ],
    explanation: 'CTAS builds a brand-new table from a query and bulk-loads it in parallel across distributions with minimal logging, letting you set DISTRIBUTION and the (clustered columnstore) index in the same statement. Without a `WITH` clause the new table gets the defaults, not the source table\'s layout. It is the Synapse workhorse for create-and-load transforms and for redistributing a table on a better hash key.',
    hints: ['Create + parallel bulk-load + set distribution/index in one statement', 'Beats INSERT…SELECT for big transforms'],
    tags: ['tsql', 'synapse', 'ctas'],
  },
  {
    id: 'tsql-syn-mcq-4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TSQL_SYNAPSE_FABRIC,
    course: Course.SQL,
    question: 'Why do statistics matter even more in Synapse than on a single SQL Server instance?',
    options: [
      { id: 'a', text: 'The optimizer picks how to move data between nodes from row-count estimates, so stale statistics can trigger a costly redistribution.', isCorrect: true },
      { id: 'b', text: 'Statistics decide which distribution each row is stored in, so stale ones leave rows on the wrong node.', isCorrect: false },
      { id: 'c', text: 'Statistics are copied to every node at query time, so keeping more of them makes every query slower.', isCorrect: false },
      { id: 'd', text: 'Statistics control how columnstore rowgroups are compressed, so stale ones only waste storage and never change a plan.', isCorrect: false },
    ],
    explanation: 'In an MPP optimizer, the plan must decide how to move data between nodes (broadcast, shuffle or co-located). Those decisions hinge on row-count estimates, so accurate statistics matter even more than on a single instance, and out-of-date statistics can push the optimizer into a costly redistribution. The distribution of a row comes from the table\'s DISTRIBUTION option, not from statistics. Keeping statistics current is a standard Synapse maintenance task.',
    hints: ['Distributed optimizer needs good estimates for movement plans', 'Stale statistics lead to bad redistribution'],
    tags: ['tsql', 'synapse', 'statistics'],
  },
  {
    id: 'tsql-syn-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_SYNAPSE_FABRIC,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Complete the table options of this new fact table. Rows with the same CustomerKey must land in the same distribution, and the table\'s main storage is the compressed column-store format.',
    template: `CREATE TABLE dbo.FactSalesNew (
    CustomerKey INT NOT NULL,
    Amount      DECIMAL(12, 2) NOT NULL
)
WITH (
    DISTRIBUTION = ___ (CustomerKey),
    CLUSTERED ___ INDEX
);`,
    blanks: ['HASH', 'COLUMNSTORE'],
    solution: `CREATE TABLE dbo.FactSalesNew (
    CustomerKey INT NOT NULL,
    Amount      DECIMAL(12, 2) NOT NULL
)
WITH (
    DISTRIBUTION = HASH (CustomerKey),
    CLUSTERED COLUMNSTORE INDEX
);`,
    explanation: 'A Synapse table sets its physical layout in the `WITH (...)` clause: `DISTRIBUTION = HASH(CustomerKey)` co-locates rows by the join key to avoid shuffles, and `CLUSTERED COLUMNSTORE INDEX` gives the compressed column storage a big fact needs. These two options are the core of Synapse fact-table design.',
    hints: ['DISTRIBUTION = HASH(col)', 'Big fact storage → CLUSTERED COLUMNSTORE INDEX'],
    tags: ['tsql', 'synapse', 'distribution', 'columnstore', 'cloze'],
  },
  {
    id: 'tsql-syn-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TSQL_SYNAPSE_FABRIC,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'In Synapse, use CTAS to build `dbo.FactSalesByCustomer` from a query that selects `CustomerKey` and `SUM(Amount) AS TotalAmount` from `dbo.FactSales` grouped by `CustomerKey`. The new table must be HASH-distributed on `CustomerKey` and stored as a clustered columnstore index. Write the CREATE TABLE AS SELECT.',
    tables: [sampleTable('dbo.FactSales', ['CustomerKey', 'Amount'])],
    starterCode: `-- dbo.FactSales (CustomerKey, Amount)
-- Build dbo.FactSalesByCustomer with CTAS: HASH on CustomerKey, clustered columnstore index
`,
    testCases: [
      {
        input: 'CTAS WITH (DISTRIBUTION = HASH(CustomerKey), CLUSTERED COLUMNSTORE INDEX) AS SELECT ... GROUP BY CustomerKey',
        expectedOutput: 'Hash-distributed columnstore aggregate table built via CTAS',
        description: 'Synapse CTAS with distribution + columnstore',
      },
    ],
    solution: `CREATE TABLE dbo.FactSalesByCustomer
WITH (
    DISTRIBUTION = HASH (CustomerKey),
    CLUSTERED COLUMNSTORE INDEX
)
AS
SELECT CustomerKey, SUM(Amount) AS TotalAmount
FROM dbo.FactSales
GROUP BY CustomerKey;`,
    explanation: 'CTAS creates and bulk-populates the new table in one parallel operation, with the physical design declared up front in `WITH (...)`: `DISTRIBUTION = HASH(CustomerKey)` keeps each customer\'s data co-located, and `CLUSTERED COLUMNSTORE INDEX` compresses it for scan/aggregate. This is the canonical Synapse pattern for materialising an aggregate.',
    hints: ['CREATE TABLE name WITH (DISTRIBUTION = HASH(CustomerKey), CLUSTERED COLUMNSTORE INDEX) AS SELECT …', 'GROUP BY CustomerKey, SUM(Amount)'],
    tieredHints: {
      apiSignature: 'SELECT col, agg_func(expr) AS alias FROM table GROUP BY col',
      skeleton: `CREATE TABLE dbo.FactSalesByCustomer
WITH (
    DISTRIBUTION = ____ (CustomerKey),
    ____
)
AS
SELECT CustomerKey, ____(Amount) AS TotalAmount
FROM dbo.FactSales
GROUP BY ____;`,
    },
    requires: [/DISTRIBUTION\s*=\s*HASH\s*\(\s*\[?CustomerKey\]?\s*\)/i, /CLUSTERED\s+COLUMNSTORE\s+INDEX/i, /\bAS\s+SELECT\b/i],
    tags: ['tsql', 'synapse', 'ctas', 'distribution', 'columnstore'],
  },
  {
    id: 'tsql-syn-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_SYNAPSE_FABRIC,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'A HASH-distributed table sends every row with the same key to the same distribution. Suppose the hash is simply CustomerKey % 3, giving three distributions numbered 0 to 2 (a real pool has 60). How many rows of dbo.FactSales land in each distribution? Write one row per line in the ORDER BY order, as DistNo and RowsInDist separated by a comma.',
    tables: [
      {
        name: 'dbo.FactSales',
        columns: ['SaleId', 'CustomerKey'],
        rows: [
          [1, 3],
          [2, 6],
          [3, 3],
          [4, 9],
          [5, 4],
          [6, 6],
          [7, 5],
          [8, 3],
        ],
      },
    ],
    code: `SELECT CustomerKey % 3 AS DistNo, COUNT(*) AS RowsInDist
FROM dbo.FactSales
GROUP BY CustomerKey % 3
ORDER BY DistNo;`,
    expectedOutput: `0, 6
1, 1
2, 1`,
    explanation: 'Customers 3, 6 and 9 all hash to distribution 0, and they own sales 1, 2, 3, 4, 6 and 8, so that distribution holds six of the eight rows. Customer 4 hashes to 1 and customer 5 to 2, one row each. This is data skew: one distribution does most of the work while the others sit idle, which is why a HASH key should have many distinct, evenly used values.',
    hints: ['Compute CustomerKey % 3 for each row, then count per result', 'Keys 3, 6 and 9 all give 0'],
    tags: ['tsql', 'synapse', 'distribution', 'skew', 'predict'],
  },
];
