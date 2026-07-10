/**
 * Topic.TSQL_OTHER_WAREHOUSES — SQL for Data Engineering (T-SQL).
 * Pillar 8 (Cloud Warehouse): Snowflake & BigQuery contrast/breadth (MCQ-led).
 * How they differ from T-SQL / Synapse — micro-partitions, clustering, QUALIFY,
 * time travel, VARIANT/FLATTEN, ARRAY/STRUCT, bytes-scanned cost.
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
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
      { id: 'a', text: 'Filters directly on a window-function result (e.g. `QUALIFY ROW_NUMBER() OVER (…) = 1`), avoiding the CTE/subquery T-SQL needs for the same dedup.', isCorrect: true },
      { id: 'b', text: 'Validates that a user qualifies (has permission) to run the query.', isCorrect: false },
      { id: 'c', text: 'Forces the query to use only qualified (schema-prefixed) table names.', isCorrect: false },
      { id: 'd', text: 'Marks a column as a qualified primary key.', isCorrect: false },
    ],
    explanation: '`QUALIFY` is to window functions what `HAVING` is to aggregates: it filters on the result of a window function in the same query. Snowflake/BigQuery support `… QUALIFY ROW_NUMBER() OVER (PARTITION BY k ORDER BY t DESC) = 1` for top-per-group; T-SQL has no QUALIFY, so you wrap the ROW_NUMBER in a CTE and filter `WHERE rn = 1`.',
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
      { id: 'a', text: 'Snowflake automatically divides table data into small immutable micro-partitions with per-column min/max metadata used for pruning — you don\'t define distribution keys, though an optional clustering key can improve pruning on huge tables.', isCorrect: true },
      { id: 'b', text: 'Micro-partitions require you to manually assign each row to a node, like ROUND_ROBIN.', isCorrect: false },
      { id: 'c', text: 'They are tiny separate databases you must create and join by hand.', isCorrect: false },
      { id: 'd', text: 'They disable all metadata so every query performs a full scan.', isCorrect: false },
    ],
    explanation: 'Snowflake auto-manages storage as ~immutable micro-partitions, each carrying min/max (and other) metadata so the engine can prune partitions a filter can\'t match — no manual distribution like Synapse HASH/ROUND_ROBIN. For very large tables you can set an optional clustering key to keep related values co-located and improve pruning, but there is no distribution-key concept to design.',
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
      { id: 'a', text: 'Querying a table as it existed at an earlier point in time (or restoring it), which makes it easy to recover from a bad load or audit changes.', isCorrect: true },
      { id: 'b', text: 'Scheduling a query to run automatically in the future.', isCorrect: false },
      { id: 'c', text: 'Speeding up queries by precomputing future results.', isCorrect: false },
      { id: 'd', text: 'Moving data between time zones automatically.', isCorrect: false },
    ],
    explanation: 'Time travel lets you read (or restore) a table\'s state from a prior moment within a retention window — e.g. `SELECT … AT (TIMESTAMP => …)` in Snowflake or `FOR SYSTEM_TIME AS OF` in BigQuery. For ELT it is a safety net: a botched MERGE or accidental DELETE can be inspected against the pre-load state and rolled back without restoring a full backup.',
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
      { id: 'a', text: 'Snowflake has a `VARIANT` type with `FLATTEN` to shred JSON, and BigQuery has native `ARRAY`/`STRUCT` with `UNNEST` — nested data is a first-class column type, not just a string parsed by OPENJSON.', isCorrect: true },
      { id: 'b', text: 'Both store JSON only as plain text and require export to a separate tool to parse it.', isCorrect: false },
      { id: 'c', text: 'Neither supports nested data; everything must be fully normalized before loading.', isCorrect: false },
      { id: 'd', text: 'Both require nested data to be converted to images before storage.', isCorrect: false },
    ],
    explanation: 'These warehouses treat nesting as first-class: Snowflake\'s `VARIANT` holds arbitrary JSON and `LATERAL FLATTEN` expands arrays into rows; BigQuery has true `ARRAY` and `STRUCT` types with `UNNEST` to expand them. That is richer than T-SQL, where JSON lives in an NVARCHAR column shredded with `OPENJSON`/`JSON_VALUE`.',
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
      { id: 'a', text: 'Selecting only needed columns (columnar = pay per column scanned), and partitioning + clustering so queries prune to a fraction of the data.', isCorrect: true },
      { id: 'b', text: 'Adding more rows to every table so each scan is more efficient.', isCorrect: false },
      { id: 'c', text: 'Always using SELECT * so the optimizer can cache everything.', isCorrect: false },
      { id: 'd', text: 'Returning more rows to the client to amortise the scan.', isCorrect: false },
    ],
    explanation: 'Because BigQuery charges for bytes read, the column-store means `SELECT col1, col2` is cheaper than `SELECT *` (you pay only for scanned columns), and partitioning (e.g. by date) plus clustering lets a filtered query prune to a small slice — directly reducing bytes scanned and therefore the bill. The cost model dictates the optimisation.',
    hints: ['Bytes scanned → name columns, avoid SELECT *', 'Partition + cluster to prune scanned data'],
    tags: ['tsql', 'other-warehouses', 'bigquery', 'cost-model'],
  },
];
