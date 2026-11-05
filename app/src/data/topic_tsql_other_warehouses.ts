/**
 * Topic.TSQL_OTHER_WAREHOUSES - SQL for Data Engineering (T-SQL).
 * Pillar 8 (Cloud Warehouse): Snowflake & BigQuery contrast/breadth (MCQ-led).
 * How they differ from T-SQL / Synapse - micro-partitions, clustering, QUALIFY,
 * time travel, VARIANT/FLATTEN, ARRAY/STRUCT, bytes-scanned cost.
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const tsql_other_warehouses_questions: Question[] = [
  {
    id: 'tsql-other-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_OTHER_WAREHOUSES,
    course: Course.SQL,
    question: 'Snowflake offers `QUALIFY`, which T-SQL lacks. What does it do?',
    options: [
      { id: 'a', text: 'It filters on a window-function result in the same query, like `QUALIFY ROW_NUMBER() OVER (...) = 1`, so no CTE is needed.', isCorrect: true },
      { id: 'b', text: 'It filters groups on an aggregate result after GROUP BY, as a shorter spelling of HAVING.', isCorrect: false },
      { id: 'c', text: 'It puts the schema name in front of every column so that the query has no ambiguous names.', isCorrect: false },
      { id: 'd', text: 'It checks that the user has permission to read the table before the query starts.', isCorrect: false },
    ],
    explanation: '`QUALIFY` is to window functions what `HAVING` is to aggregates: it filters on the result of a window function in the same query, while `HAVING` itself still filters groups. Snowflake/BigQuery support `… QUALIFY ROW_NUMBER() OVER (PARTITION BY k ORDER BY t DESC) = 1` for top-per-group; T-SQL has no QUALIFY, so you wrap the ROW_NUMBER in a CTE and filter `WHERE rn = 1`.',
    hints: ['Filters on a window-function result inline', 'T-SQL replaces it with CTE + WHERE rn = 1'],
    tags: ['tsql', 'other-warehouses', 'snowflake', 'qualify'],
  },
  {
    id: 'tsql-other-mcq-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TSQL_OTHER_WAREHOUSES,
    course: Course.SQL,
    question: 'Snowflake uses automatic "micro-partitions" instead of Synapse-style manual distribution/partitioning. What does that mean?',
    options: [
      { id: 'a', text: 'Snowflake splits tables into small immutable micro-partitions by itself and prunes them with min/max metadata, so there is no distribution key to choose.', isCorrect: true },
      { id: 'b', text: 'You choose a HASH column for each table, and the micro-partitions are the buckets that column fills.', isCorrect: false },
      { id: 'c', text: 'Micro-partitions are small separate databases that you create and join together yourself.', isCorrect: false },
      { id: 'd', text: 'They keep no metadata, so a filter cannot skip any of them and every query scans the whole table.', isCorrect: false },
    ],
    explanation: 'Snowflake auto-manages storage as ~immutable micro-partitions, each carrying min/max (and other) metadata so the engine can prune partitions a filter can\'t match - no manual distribution like Synapse HASH/ROUND_ROBIN. For very large tables you can set an optional clustering key to keep related values co-located and improve pruning, but there is no distribution-key concept to design.',
    hints: ['Automatic immutable partitions + min/max pruning', 'No distribution key; optional clustering key only'],
    tags: ['tsql', 'other-warehouses', 'snowflake', 'micro-partitions'],
  },
  {
    id: 'tsql-other-mcq-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_OTHER_WAREHOUSES,
    course: Course.SQL,
    question: 'What is "time travel" in Snowflake/BigQuery, and why is it useful to a data engineer?',
    options: [
      { id: 'a', text: 'Reading a table as it was at an earlier time, or restoring it, which helps recover from a bad load or audit changes.', isCorrect: true },
      { id: 'b', text: 'Scheduling a query to run at a later time, which helps run loads overnight.', isCorrect: false },
      { id: 'c', text: 'Precomputing results for future queries, which helps repeat queries return sooner.', isCorrect: false },
      { id: 'd', text: 'Converting timestamps to the session time zone, which helps compare loads from different regions.', isCorrect: false },
    ],
    explanation: 'Time travel lets you read (or restore) a table\'s state from a prior moment within a retention window - e.g. `SELECT … AT (TIMESTAMP => …)` in Snowflake or `FOR SYSTEM_TIME AS OF` in BigQuery. For ELT it is a safety net: a botched MERGE or accidental DELETE can be inspected against the pre-load state and rolled back without restoring a full backup.',
    hints: ['Query/restore a table as of an earlier time', 'Safety net for bad loads / audits'],
    tags: ['tsql', 'other-warehouses', 'time-travel'],
  },
  {
    id: 'tsql-other-mcq-4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TSQL_OTHER_WAREHOUSES,
    course: Course.SQL,
    question: 'How do Snowflake and BigQuery handle semi-structured / nested data differently from classic T-SQL columns?',
    options: [
      { id: 'a', text: 'Snowflake has VARIANT, shredded with FLATTEN, and BigQuery has ARRAY and STRUCT, expanded with UNNEST, so nested data is a real column type.', isCorrect: true },
      { id: 'b', text: 'Both store JSON in a string column and shred it with OPENJSON, exactly as T-SQL does.', isCorrect: false },
      { id: 'c', text: 'Neither accepts nested data, so everything must be fully normalized before it is loaded.', isCorrect: false },
      { id: 'd', text: 'BigQuery has VARIANT with FLATTEN and Snowflake has ARRAY and STRUCT with UNNEST, the other way round.', isCorrect: false },
    ],
    explanation: 'These warehouses treat nesting as first-class: Snowflake\'s `VARIANT` holds arbitrary JSON and `LATERAL FLATTEN` expands arrays into rows; BigQuery has true `ARRAY` and `STRUCT` types with `UNNEST` to expand them. `OPENJSON` is T-SQL only. That is richer than T-SQL, where JSON lives in an NVARCHAR column shredded with `OPENJSON` or `JSON_VALUE`.',
    hints: ['Snowflake VARIANT + FLATTEN; BigQuery ARRAY/STRUCT + UNNEST', 'Nested data is a first-class type, not a parsed string'],
    tags: ['tsql', 'other-warehouses', 'bigquery', 'semi-structured'],
  },
  {
    id: 'tsql-other-mcq-5',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_OTHER_WAREHOUSES,
    course: Course.SQL,
    question: 'BigQuery on-demand pricing bills by bytes scanned. Which design choices most directly cut that cost?',
    options: [
      { id: 'a', text: 'Name only the columns you need, and partition and cluster tables so that a filter reads a fraction of the data.', isCorrect: true },
      { id: 'b', text: 'Use SELECT * with a LIMIT, because LIMIT stops the scan once that many rows have been read.', isCorrect: false },
      { id: 'c', text: 'Leave tables unpartitioned so that the engine can cache the whole table for later queries.', isCorrect: false },
      { id: 'd', text: 'Filter with a WHERE on any column, since billing follows the rows that match.', isCorrect: false },
    ],
    explanation: 'Because BigQuery charges for bytes read, the column store means `SELECT col1, col2` is cheaper than `SELECT *` (you pay only for scanned columns), and partitioning (for example by date) plus clustering lets a filtered query prune to a small slice, which directly reduces bytes scanned and therefore the bill. A LIMIT, or a filter on a column that is not a partition or cluster column, still scans the columns it reads, so the bill does not shrink. The cost model dictates the optimisation.',
    hints: ['Bytes scanned → name columns, avoid SELECT *', 'Partition + cluster to prune scanned data'],
    tags: ['tsql', 'other-warehouses', 'bigquery', 'cost-model'],
  },
  {
    id: 'tsql-other-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.TSQL_OTHER_WAREHOUSES,
    course: Course.SQL,
    language: CodeLanguage.SQL,
    question: 'Snowflake writes "the latest order per customer" as QUALIFY ROW_NUMBER() OVER (PARTITION BY CustomerKey ORDER BY OrderDate DESC) = 1. T-SQL has no QUALIFY, so the same filter is written as a CTE and a WHERE on the row number, as below. Which orders does it return? Write one row per line in the ORDER BY order, as CustomerKey and OrderId separated by a comma.',
    tables: [
      {
        name: 'dbo.FactOrders',
        columns: ['OrderId', 'CustomerKey', 'OrderDate'],
        rows: [
          [101, 1, '2026-01-05'],
          [102, 1, '2026-03-12'],
          [103, 2, '2026-02-20'],
          [104, 1, '2026-02-01'],
          [105, 3, '2026-01-30'],
          [106, 3, '2026-04-02'],
        ],
      },
    ],
    code: `WITH Ranked AS (
  SELECT CustomerKey, OrderId,
         ROW_NUMBER() OVER (PARTITION BY CustomerKey ORDER BY OrderDate DESC) AS rn
  FROM dbo.FactOrders
)
SELECT CustomerKey, OrderId
FROM Ranked
WHERE rn = 1
ORDER BY CustomerKey;`,
    expectedOutput: `1, 102
2, 103
3, 106`,
    explanation: 'The window numbers each customer\'s orders from the newest, so rn = 1 is the latest one. Customer 1 has orders on 5 January, 12 March and 1 February, and 12 March (order 102) is the newest. Customer 2 has only order 103, and customer 3\'s newest is 2 April (order 106). QUALIFY does this filtering in the same SELECT, where T-SQL needs the CTE because a window function cannot appear in WHERE.',
    hints: ['rn = 1 is the newest order of each customer', 'A customer with a single order always keeps it'],
    tags: ['tsql', 'snowflake', 'qualify', 'row-number', 'predict'],
  },
];
