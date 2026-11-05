/**
 * Topic.TSQL_MPP_MODEL - SQL for Data Engineering (T-SQL).
 * Pillar 8 (Cloud Warehouse): MPP / columnar mental model, data distribution,
 * separation of storage & compute, cost models.
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const tsql_mpp_model_questions: Question[] = [
  {
    id: 'tsql-mpp-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_MPP_MODEL,
    course: Course.SQL,
    question: 'What does "MPP" (Massively Parallel Processing) mean for how a cloud warehouse runs a query?',
    options: [
      { id: 'a', text: 'Rows are split over many nodes, each node processes its own slice at the same time, and the partial results are merged.', isCorrect: true },
      { id: 'b', text: 'One very fast node runs the whole query, and the other nodes only keep copies of the data.', isCorrect: false },
      { id: 'c', text: 'Every node runs the whole query on a full copy of the data, and the fastest answer is kept.', isCorrect: false },
      { id: 'd', text: 'The query is cut into steps that run one after another, each step on a different node.', isCorrect: false },
    ],
    explanation: 'MPP shards data across nodes, each with its own CPU, memory and storage slice, and runs the same operation on every shard at the same time, then merges the partial results. This scale-out model is why warehouses like Synapse, Snowflake and BigQuery handle huge facts. It also means data movement between nodes can dominate the cost. Running the whole query on one node, or on every node over a full copy, would add no speed; the gain comes from each node touching only its own slice.',
    hints: ['Data split across nodes, each works its slice in parallel', 'Scale out, not scale up'],
    tags: ['tsql', 'mpp', 'cloud-warehouse'],
  },
  {
    id: 'tsql-mpp-mcq-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TSQL_MPP_MODEL,
    course: Course.SQL,
    question: 'In an MPP warehouse, why is "data movement" (shuffle) the thing to minimise?',
    options: [
      { id: 'a', text: 'Rows that a join or grouping needs sit on different nodes, so they are sent across the network first, which often costs more than the computing.', isCorrect: true },
      { id: 'b', text: 'Each move locks the whole table, so every other query must wait until the join has finished.', isCorrect: false },
      { id: 'c', text: 'Moved rows are deleted from their old node and have to be loaded again by a nightly job.', isCorrect: false },
      { id: 'd', text: 'The result has to be copied back to the client once per node, which dominates every query.', isCorrect: false },
    ],
    explanation: 'Each node can only work on its local data. If a join key is not co-located, the engine shuffles rows across nodes over the network to bring matching rows together, which is expensive at scale. A shuffle copies rows for the query and does not lock the table or delete anything. Distribution design (hashing big tables on common join keys, replicating small ones) is all about avoiding shuffles.',
    hints: ['Shuffle = redistributing rows across nodes for a join/agg', 'Network movement often dominates query cost'],
    tags: ['tsql', 'mpp', 'data-movement', 'shuffle'],
  },
  {
    id: 'tsql-mpp-mcq-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_MPP_MODEL,
    course: Course.SQL,
    question: 'What does "separation of storage and compute" enable in a modern cloud warehouse?',
    options: [
      { id: 'a', text: 'Storage and compute are sized and billed on their own, so compute can be paused or resized without moving the data.', isCorrect: true },
      { id: 'b', text: 'Compute is tied to the node that stores the data, so adding storage always means adding compute.', isCorrect: false },
      { id: 'c', text: 'The data is stored twice, once for reads and once for writes, so reads never slow down writes.', isCorrect: false },
      { id: 'd', text: 'Storage is billed only while a query is running against it, and costs nothing when idle.', isCorrect: false },
    ],
    explanation: 'Decoupling storage from compute (Snowflake virtual warehouses, Synapse serverless, BigQuery slots) lets you scale compute up for a heavy load and down or off when idle without moving data, pay for each separately, and run several independent compute clusters over one copy of the data. Stored data is billed whether or not a query runs. It is the defining architecture shift from on-prem MPP, where adding disk meant adding nodes.',
    hints: ['Scale/bill/pause compute independently of data', 'Many compute clusters over one stored copy'],
    tags: ['tsql', 'mpp', 'storage-compute-separation'],
  },
  {
    id: 'tsql-mpp-mcq-4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_MPP_MODEL,
    course: Course.SQL,
    question: 'Cloud warehouses bill in different ways. Which pairing is correct?',
    options: [
      { id: 'a', text: 'BigQuery on demand bills bytes scanned, Snowflake bills running warehouse time, and Synapse Dedicated bills provisioned size (DWU) over time.', isCorrect: true },
      { id: 'b', text: 'BigQuery on demand bills running warehouse time, Snowflake bills bytes scanned, and Synapse Dedicated bills provisioned size (DWU) over time.', isCorrect: false },
      { id: 'c', text: 'BigQuery on demand bills bytes scanned, Snowflake bills a flat monthly fee, and Synapse Dedicated bills each query that runs.', isCorrect: false },
      { id: 'd', text: 'All three bill by the number of rows returned to the client, whatever the engine and the size of the data.', isCorrect: false },
    ],
    explanation: 'Cost models drive design. BigQuery on demand bills bytes scanned, so partitioning, clustering and avoiding `SELECT *` cut the bill directly. Snowflake bills running compute time per virtual warehouse, so you suspend idle warehouses. Synapse Dedicated bills provisioned DWUs over time, so you pause or scale the pool. None of them bills by rows returned. Knowing the model tells you what to optimise.',
    hints: ['BigQuery → bytes scanned', 'Snowflake → compute time; Synapse Dedicated → provisioned DWU'],
    tags: ['tsql', 'mpp', 'cost-model'],
  },
  {
    id: 'tsql-mpp-mcq-5',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TSQL_MPP_MODEL,
    course: Course.SQL,
    question: 'Why do MPP/columnar warehouses generally discourage frequent small singleton INSERTs (one row at a time)?',
    options: [
      { id: 'a', text: 'They are built for bulk loads into well-compressed segments, and single rows make tiny segments with a fixed cost per statement.', isCorrect: true },
      { id: 'b', text: 'The engine rejects any INSERT that adds one row, so the load fails and has to be redone in bulk.', isCorrect: false },
      { id: 'c', text: 'Every single-row insert changes the distribution key and forces a full rebuild of the table.', isCorrect: false },
      { id: 'd', text: 'A single-row insert locks every node, so only one row can be loaded at a time in the whole pool.', isCorrect: false },
    ],
    explanation: 'Columnar MPP storage shines when data lands in big batches that fill well-compressed segments or rowgroups. A stream of singleton inserts produces many tiny, inefficient segments and pays a fixed per-statement overhead each time. The statements are allowed and nothing is rebuilt; they are just slow and wasteful. So the pattern is micro-batch or bulk load (COPY, CTAS, PolyBase), not row-at-a-time DML.',
    hints: ['Built for bulk/batch loads into columnar segments', 'Singletons → tiny segments + high overhead'],
    tags: ['tsql', 'mpp', 'bulk-load'],
  },
  {
    id: 'tsql-mpp-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_MPP_MODEL,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'In an MPP warehouse each row lives on one node, and a join can only pair rows that sit on the same node, so every row whose partner is on another node has to be moved first. dbo.FactOrders is spread over nodes by OrderId and dbo.DimCustomer by CustomerKey. How many order rows have their customer on a different node? Write the single number.',
    tables: [
      {
        name: 'dbo.FactOrders',
        columns: ['OrderId', 'CustomerKey', 'NodeNo'],
        rows: [
          [1, 10, 1],
          [2, 20, 2],
          [3, 10, 3],
          [4, 30, 1],
          [5, 20, 2],
          [6, 30, 3],
        ],
      },
      {
        name: 'dbo.DimCustomer',
        columns: ['CustomerKey', 'NodeNo'],
        rows: [
          [10, 1],
          [20, 3],
          [30, 1],
        ],
      },
    ],
    code: `SELECT COUNT(*) AS RowsToMove
FROM dbo.FactOrders AS f
JOIN dbo.DimCustomer AS c ON c.CustomerKey = f.CustomerKey
WHERE f.NodeNo <> c.NodeNo;`,
    expectedOutput: `4`,
    explanation: 'Each order is compared with the node of its customer. Orders 1 and 4 already sit with their customer on node 1, so they join locally. Order 3 (customer 10, node 1) is on node 3, orders 2 and 5 (customer 20, node 3) are on node 2, and order 6 (customer 30, node 1) is on node 3, so four rows have to cross the network. That movement is the shuffle an MPP engine tries to avoid, and distributing both tables on the join key would leave it with nothing to move.',
    hints: ['Compare the node of each order with the node of its customer', 'Only rows on a different node count'],
    tags: ['tsql', 'mpp', 'data-movement', 'predict'],
  },
];
