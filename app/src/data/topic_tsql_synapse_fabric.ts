/**
 * Topic.TSQL_SYNAPSE_FABRIC — SQL for Data Engineering (T-SQL).
 * Pillar 8 (Cloud Warehouse): Synapse Dedicated SQL Pool / Fabric Warehouse —
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

export const tsql_synapse_fabric_questions: Question[] = [
  {
    id: 'tsql-syn-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_SYNAPSE_FABRIC,
    course: Course.SQL,
    question: 'In a Synapse Dedicated SQL Pool, what do the three table distribution options (HASH, ROUND_ROBIN, REPLICATE) control?',
    options: [
      { id: 'a', text: 'How a table\'s rows are spread across the 60 distributions/nodes — by hashing a column, evenly round-robin, or by copying the whole table to every node.', isCorrect: true },
      { id: 'b', text: 'How often the table is backed up to cloud storage.', isCorrect: false },
      { id: 'c', text: 'Which users are allowed to query the table.', isCorrect: false },
      { id: 'd', text: 'The compression algorithm used for each column.', isCorrect: false },
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
      { id: 'a', text: 'HASH (on a common join key) for the huge fact, REPLICATE for the tiny dimension, ROUND_ROBIN for the staging table.', isCorrect: true },
      { id: 'b', text: 'REPLICATE for the huge fact, HASH for the tiny dimension, REPLICATE for staging.', isCorrect: false },
      { id: 'c', text: 'ROUND_ROBIN for everything, since even spreading is always optimal.', isCorrect: false },
      { id: 'd', text: 'HASH for all three tables, because hashing is always the fastest.', isCorrect: false },
    ],
    explanation: 'Match distribution to the table\'s role: HASH a large fact on the column it most often joins/aggregates by so matching rows co-locate (minimal shuffle); REPLICATE small dimensions so every node has a local copy for joins; ROUND_ROBIN staging because loads are fast and you haven\'t picked a key yet. A bad fact hash key causes skew or constant data movement.',
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
      { id: 'a', text: 'It creates and bulk-populates a new distributed, columnstore table in one parallel, minimally-logged operation — far more efficient than INSERT…SELECT for large transforms.', isCorrect: true },
      { id: 'b', text: 'It is the only statement allowed in Synapse; INSERT and UPDATE are unsupported.', isCorrect: false },
      { id: 'c', text: 'It runs entirely on a single node, which makes it deterministic.', isCorrect: false },
      { id: 'd', text: 'It avoids creating any indexes or distribution, leaving the table unstructured.', isCorrect: false },
    ],
    explanation: 'CTAS builds a brand-new table from a query and bulk-loads it in parallel across distributions, fully logged at minimal cost, letting you set DISTRIBUTION and (clustered columnstore) index in the same statement. It is the Synapse workhorse for create-and-load transforms and for redistributing a table on a better hash key.',
    hints: ['Create + parallel bulk-load + set distribution/index in one statement', 'Beats INSERT…SELECT for big transforms'],
    tags: ['tsql', 'synapse', 'ctas'],
  },
  {
    id: 'tsql-syn-mcq-4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TSQL_SYNAPSE_FABRIC,
    course: Course.SQL,
    question: 'Why does Synapse rely on manually-created/updated statistics more than a typical SQL Server instance?',
    options: [
      { id: 'a', text: 'Good cardinality estimates are critical for the distributed cost-based optimizer to pick the right data-movement plan; stale/missing stats lead to bad redistribution choices and slow queries.', isCorrect: true },
      { id: 'b', text: 'Statistics are decorative in Synapse and have no effect on query plans.', isCorrect: false },
      { id: 'c', text: 'Synapse cannot run any query until statistics are dropped first.', isCorrect: false },
      { id: 'd', text: 'Statistics control user permissions in Synapse rather than query plans.', isCorrect: false },
    ],
    explanation: 'In an MPP optimizer, the plan must decide how to move data between nodes (broadcast vs shuffle vs co-located). Those decisions hinge on row-count estimates, so accurate statistics matter even more than on a single instance — out-of-date stats can push the optimizer into a costly redistribution. Keeping stats current is a standard Synapse maintenance task.',
    hints: ['Distributed optimizer needs good estimates for movement plans', 'Stale stats → bad redistribution'],
    tags: ['tsql', 'synapse', 'statistics'],
  },
  {
    id: 'tsql-syn-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_SYNAPSE_FABRIC,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Fill in the Synapse table options: hash-distribute the fact on CustomerKey and store it as a clustered columnstore.',
    template: `CREATE TABLE dbo.FactSales (
    CustomerKey INT NOT NULL,
    Amount      DECIMAL(12, 2) NOT NULL
)
WITH (
    DISTRIBUTION = ___ (CustomerKey),
    CLUSTERED ___ INDEX
);`,
    blanks: ['HASH', 'COLUMNSTORE'],
    solution: `CREATE TABLE dbo.FactSales (
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
    question: 'In Synapse, use CTAS to build `dbo.FactSalesByCustomer` from a query that selects `CustomerKey` and `SUM(Amount) AS TotalAmount` from `dbo.FactSales` grouped by `CustomerKey`. The new table must be HASH-distributed on `CustomerKey` and stored as a clustered columnstore. Write the CREATE TABLE AS SELECT.',
    starterCode: `-- CREATE TABLE dbo.FactSalesByCustomer WITH ( DISTRIBUTION = ..., CLUSTERED COLUMNSTORE INDEX ) AS SELECT ...;
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
    tags: ['tsql', 'synapse', 'ctas', 'distribution', 'columnstore'],
  },
];
