import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

// INGESTION_ARCHITECTURE - Databricks course, "Lakehouse Architecture &
// Engineering Practice" section.
//
// This topic is the ingestion design judgment layer on top of auto_loader,
// structured_streaming and change_data_capture: when to ingest in batch or as
// a stream, what to land and how to keep it, how to lay out a table (Liquid
// Clustering vs PARTITIONED BY), how to keep a table in step with a source,
// and the failure modes that follow when these are misjudged (partitioning a
// small table too finely, overwriting a whole table for a few rows, letting
// Auto Loader list a bucket of millions of files).
//
// Coverage (39 questions):
//   Beginner (5 MCQ): the five core ideas.
//   Intermediate (12): 6 predicts that run partition counts, overwrites and a
//     MERGE of a change log on small Delta tables, and 6 scenario MCQs.
//   Advanced (19 MCQ): each failure mode and each decision in three settings,
//     and one question that tells two look-alike failures apart.
//   Coding/Parsons (3): rebuild a table with Liquid Clustering, a scoped
//     replaceWhere write, and an Auto Loader file-notification setup.

export const ingestionArchitectureQuestions: Question[] = [
  // ────────────────────────────────────────────────────────────────────
  // BEGINNER (5)
  // ────────────────────────────────────────────────────────────────────
  {
    id: 'ing-mcq-b1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.INGESTION_ARCHITECTURE,
    course: Course.DATABRICKS,
    question:
      'What is the main signal for choosing continuous streaming ingestion over scheduled incremental batch ingestion?',
    options: [
      { id: 'a', text: 'The file format: a source that lands Parquet must be streamed and one that lands JSON or CSV must be batched, whatever freshness consumers need.', isCorrect: false },
      { id: 'b', text: "How fresh consumers need the data and how the source delivers: a push source with a seconds target needs a stream, looser ones a scheduled run.", isCorrect: true },
      { id: 'c', text: 'The table size: tables under 1 TB are always streamed for simplicity and larger ones batched, because a stream cannot keep up with that volume.', isCorrect: false },
      { id: 'd', text: 'Whether the table is in Unity Catalog: only Unity Catalog tables can be streamed, so a table in the legacy Hive metastore must be batch.', isCorrect: false },
    ],
    explanation:
      'The mode follows the freshness consumers need and how the source delivers. A push source such as Kafka with a target of seconds needs a stream that runs all the time. Anything looser is incremental batch: the same stream code with trigger(availableNow=True) on a schedule loads what is new exactly once and stops, so no cluster sits idle between runs.',
    tags: ['batch-vs-streaming'],
    concepts: ['ing-batch-vs-streaming'],
  },
  {
    id: 'ing-mcq-b2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.INGESTION_ARCHITECTURE,
    course: Course.DATABRICKS,
    question:
      'A source system delivers raw JSON files. What is the recommended way to land and ingest them, and why?',
    options: [
      { id: 'a', text: 'Land the files exactly as sent and let Auto Loader parse them into bronze, so the landing zone stays a faithful copy of what the source sent.', isCorrect: true },
      { id: 'b', text: 'Keep the data as JSON in every layer, gold included, because turning it into Delta tables removes the flexibility the source applications rely on.', isCorrect: false },
      { id: 'c', text: 'Ask the source team to send Avro or Parquet instead, because Databricks pipelines are not designed to ingest JSON or CSV sources.', isCorrect: false },
      { id: 'd', text: 'Convert the JSON to Parquet in a preprocessing job before landing it, because Auto Loader cannot read JSON or CSV files into bronze.', isCorrect: false },
    ],
    explanation:
      'Auto Loader reads JSON and CSV directly, so nothing needs converting first. Landing the files as sent keeps an exact record of what arrived, and the parse and type step happens once, when Auto Loader writes bronze, where values that do not fit the schema go to _rescued_data.',
    tags: ['file-format-landing'],
    concepts: ['ing-file-format-landing'],
  },
  {
    id: 'ing-mcq-b3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.INGESTION_ARCHITECTURE,
    course: Course.DATABRICKS,
    question:
      'Beyond a sensible folder layout per source, entity and version, what should a landing zone guarantee about its files?',
    options: [
      { id: 'a', text: 'Reading pipelines may overwrite or delete files, so that the zone always shows only the latest version that each producer sent.', isCorrect: false },
      { id: 'b', text: 'Files are compressed to Parquet on arrival and the raw copy is deleted at once, so the data is not stored twice.', isCorrect: false },
      { id: 'c', text: "Files stay unchanged and are removed only after bronze covers the retention need, so the zone is an audit trail that does not grow forever.", isCorrect: true },
      { id: 'd', text: 'Files sit in one flat folder with no source or entity levels, so a single Auto Loader stream can read every file from every domain together.', isCorrect: false },
    ],
    explanation:
      'A landing zone is an immutable record of what each source sent, laid out per source, entity and version. Files are kept until bronze holds the history the retention rules need, and a storage lifecycle policy then ages them out, so the zone stays auditable without growing without limit.',
    tags: ['landing-zone'],
    concepts: ['ing-landing-zone'],
  },
  {
    id: 'ing-mcq-b4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.INGESTION_ARCHITECTURE,
    course: Course.DATABRICKS,
    question:
      'How does PARTITIONED BY differ from Liquid Clustering (CLUSTER BY) as a layout for a Delta table?',
    options: [
      { id: 'a', text: "PARTITIONED BY makes a directory per value and suits low-cardinality columns on very large tables; CLUSTER BY makes none and takes high-cardinality keys.", isCorrect: true },
      { id: 'b', text: 'The two build the same directories on storage; CLUSTER BY is just a newer spelling of PARTITIONED BY that makes the DDL easier to read.', isCorrect: false },
      { id: 'c', text: "CLUSTER BY is only for tables under 1 TB, and PARTITIONED BY is required once a table passes it, so size alone decides, whatever the queries filter on.", isCorrect: false },
      { id: 'd', text: "CLUSTER BY works only on numeric columns and PARTITIONED BY only on string columns, so the data types decide which one to use, whatever the queries filter on.", isCorrect: false },
    ],
    explanation:
      'PARTITIONED BY writes a directory for every value, so Databricks advises it only for tables over about 1 TB, on a low-cardinality column with at least 1 GB per partition. Liquid Clustering makes no directories, accepts high-cardinality keys such as customer_id, and lets you change the keys with ALTER TABLE without rewriting the table. It is the default for a new table.',
    tags: ['partitioning-strategy'],
    concepts: ['ing-partitioning-strategy'],
  },
  {
    id: 'ing-mcq-b5',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.INGESTION_ARCHITECTURE,
    course: Course.DATABRICKS,
    question:
      "There are three ways to keep a Delta table in step with a changing source: read its change log, compare snapshots, or reload in full. What is the basic tradeoff between them?",
    options: [
      { id: 'a', text: 'All three cost the same and load the source equally; they differ only in the final DML statement that writes to the target table.', isCorrect: false },
      { id: 'b', text: "A full reload is lightest on the source because it never reads a transaction log, so it beats the others whenever snapshot overwrites are allowed by the source team.", isCorrect: false },
      { id: 'c', text: 'Comparing snapshots is only for streaming sources, while the change log and a full reload are only for batch jobs, so the trigger decides.', isCorrect: false },
      { id: 'd', text: "The change log is cheapest and lightest on the source; snapshots cost more compute but need no log; a full reload rewrites everything and suits small tables.", isCorrect: true },
    ],
    explanation:
      'Change data capture reads only the changes, so it writes the least and puts the least load on the source. Without a log you can diff two snapshots, which costs extra compute. A full reload is the simplest but rewrites the whole table every time, so keep it for small tables.',
    tags: ['cdc-strategy'],
    concepts: ['ing-cdc-strategy'],
  },

  // ────────────────────────────────────────────────────────────────────
  // INTERMEDIATE (12) - 6 predicts + 6 scenario MCQs
  // ────────────────────────────────────────────────────────────────────
  {
    id: 'ing-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.INGESTION_ARCHITECTURE,
    course: Course.DATABRICKS,
    language: CodeLanguage.PYTHON,
    question:
      'In a Databricks notebook, the table events holds exactly the rows shown. The cell writes a copy partitioned by day and hour and counts its partitions. What does it print? The answer is a single whole number.',
    tables: [
      { name: 'events', columns: ['event_id', 'day', 'hour'], rows: [
        [1, '2026-03-01', 9],
        [2, '2026-03-01', 9],
        [3, '2026-03-01', 14],
        [4, '2026-03-02', 9],
        [5, '2026-03-02', 22],
        [6, '2026-03-03', 14],
      ] },
    ],
    code: `spark.table("events").write.partitionBy("day", "hour").saveAsTable("events_by_hour")
print(spark.sql("SHOW PARTITIONS events_by_hour").count())`,
    expectedOutput: '5',
    explanation:
      'A table gets one partition, and so one directory, for every distinct combination of its partition columns. The (day, hour) pairs are (03-01, 9), (03-01, 14), (03-02, 9), (03-02, 22) and (03-03, 14), so there are 5 partitions for 6 rows. Partitioning a small table down to the hour gives partitions that hold almost nothing.',
    hints: [
      'Count the distinct (day, hour) pairs.',
      'Rows 1 and 2 share a day and an hour.',
    ],
    tags: ['hive-time-machine', 'predict-output'],
    concepts: ['ing-hive-time-machine'],
  },
  {
    id: 'ing-predict-2',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.INGESTION_ARCHITECTURE,
    course: Course.DATABRICKS,
    language: CodeLanguage.PYTHON,
    question:
      'Same events table, now written partitioned by day only. What does the cell print? The answer is a single whole number.',
    tables: [
      { name: 'events', columns: ['event_id', 'day', 'hour'], rows: [
        [1, '2026-03-01', 9],
        [2, '2026-03-01', 9],
        [3, '2026-03-01', 14],
        [4, '2026-03-02', 9],
        [5, '2026-03-02', 22],
        [6, '2026-03-03', 14],
      ] },
    ],
    code: `spark.table("events").write.partitionBy("day").saveAsTable("events_by_day")
print(spark.sql("SHOW PARTITIONS events_by_day").count())`,
    expectedOutput: '3',
    explanation:
      'Only the day counts now: 2026-03-01, 2026-03-02 and 2026-03-03 give 3 partitions. A coarser partition column keeps the number of directories in line with how much data there is. For a small table, leaving it unpartitioned and clustering it is better still.',
    hints: [
      'How many distinct days are there?',
    ],
    tags: ['hive-time-machine', 'predict-output'],
    concepts: ['ing-hive-time-machine'],
  },
  {
    id: 'ing-predict-3',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.INGESTION_ARCHITECTURE,
    course: Course.DATABRICKS,
    language: CodeLanguage.PYTHON,
    question:
      'The nightly job should update warehouse WH-2 only. warehouse_inventory and updated_rows hold exactly the rows shown. What does the cell print? The answer is a single whole number.',
    tables: [
      { name: 'warehouse_inventory', columns: ['warehouse_id', 'item', 'qty'], rows: [
        ['WH-1', 'bolt', 10],
        ['WH-2', 'nut', 20],
        ['WH-3', 'screw', 30],
      ] },
      { name: 'updated_rows', columns: ['warehouse_id', 'item', 'qty'], rows: [
        ['WH-2', 'nut', 25],
      ] },
    ],
    code: `(spark.table("updated_rows").write
    .format("delta")
    .mode("overwrite")
    .saveAsTable("warehouse_inventory"))
print(spark.table("warehouse_inventory").count())`,
    expectedOutput: '1',
    explanation:
      'mode("overwrite") replaces the whole table with the DataFrame, however few rows the DataFrame holds. WH-1 and WH-3 are gone and only the one row for WH-2 is left. A full overwrite of a large table for a few changed rows rewrites everything and, as here, deletes whatever the DataFrame does not contain.',
    hints: [
      'What does overwrite replace: the matching rows, or the table?',
    ],
    tags: ['naked-overwrites', 'predict-output'],
    concepts: ['ing-naked-overwrites'],
  },
  {
    id: 'ing-predict-4',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.INGESTION_ARCHITECTURE,
    course: Course.DATABRICKS,
    language: CodeLanguage.PYTHON,
    question:
      'Same tables, but the write is now scoped with replaceWhere. What does the cell print? The answer is one line: two whole numbers separated by a space (rows, then the total of qty).',
    tables: [
      { name: 'warehouse_inventory', columns: ['warehouse_id', 'item', 'qty'], rows: [
        ['WH-1', 'bolt', 10],
        ['WH-2', 'nut', 20],
        ['WH-3', 'screw', 30],
      ] },
      { name: 'updated_rows', columns: ['warehouse_id', 'item', 'qty'], rows: [
        ['WH-2', 'nut', 25],
      ] },
    ],
    code: `(spark.table("updated_rows").write
    .format("delta")
    .mode("overwrite")
    .option("replaceWhere", "warehouse_id = 'WH-2'")
    .saveAsTable("warehouse_inventory"))
r = spark.sql("""SELECT COUNT(*) AS n, SUM(qty) AS total
    FROM warehouse_inventory""").first()
print(r.n, r.total)`,
    expectedOutput: '3 65',
    explanation:
      'replaceWhere limits the overwrite to rows matching the predicate. Only the WH-2 row is replaced, by the new row with qty 25, and WH-1 and WH-3 are untouched: 3 rows with qty 10 + 25 + 30 = 65. The write touches the changed slice instead of the whole table.',
    hints: [
      'Which rows match warehouse_id = \'WH-2\'?',
      'The rows that do not match are left as they are.',
    ],
    tags: ['naked-overwrites', 'predict-output'],
    concepts: ['ing-naked-overwrites'],
  },
  {
    id: 'ing-predict-5',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.INGESTION_ARCHITECTURE,
    course: Course.DATABRICKS,
    language: CodeLanguage.PYTHON,
    question:
      "The source's change log stock_changes holds exactly the rows shown, with op U for update, D for delete and I for insert, and seq giving the order of changes to the same item. The cell applies the latest change per item to stock. What does it print? The answer is one line per item in item order, written as the item and its qty separated by a space.",
    tables: [
      { name: 'stock', columns: ['item', 'qty'], rows: [
        ['a', 5],
        ['b', 7],
        ['c', 2],
      ] },
      { name: 'stock_changes', columns: ['item', 'op', 'qty', 'seq'], rows: [
        ['b', 'U', 9, 1],
        ['b', 'U', 12, 2],
        ['c', 'D', null, 1],
        ['d', 'I', 4, 1],
      ] },
    ],
    code: `spark.sql("""MERGE INTO stock t USING (
    SELECT * FROM (
      SELECT *, ROW_NUMBER() OVER (
        PARTITION BY item ORDER BY seq DESC) AS rn
      FROM stock_changes) WHERE rn = 1) c
  ON t.item = c.item
  WHEN MATCHED AND c.op = 'D' THEN DELETE
  WHEN MATCHED THEN UPDATE SET qty = c.qty
  WHEN NOT MATCHED AND c.op <> 'D' THEN
    INSERT (item, qty) VALUES (c.item, c.qty)""")
for r in spark.table("stock").orderBy("item").collect():
    print(r.item, r.qty)`,
    expectedOutput: 'a 5\nb 12\nd 4',
    explanation:
      'The subquery keeps the latest change per item, so item b is applied once, with qty 12 from seq 2. Then item a has no change and stays at 5; b is updated to 12; c is deleted; d is new and is inserted with 4. Applying only the latest change per key is what lets MERGE take a change log without matching the same target row twice.',
    hints: [
      'Which change per item survives the subquery?',
      'Items missing from the change log are left alone.',
    ],
    tags: ['cdc-strategy', 'predict-output'],
    concepts: ['ing-cdc-strategy'],
  },
  {
    id: 'ing-predict-6',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.INGESTION_ARCHITECTURE,
    course: Course.DATABRICKS,
    language: CodeLanguage.PYTHON,
    question:
      'The cell applies two changes from the log to a five-row stock table with MERGE. stock and stock_changes hold exactly the rows shown. What does it print? The answer is one line: two whole numbers separated by a space (rows the MERGE affected, then rows left in stock).',
    tables: [
      { name: 'stock', columns: ['item', 'qty'], rows: [
        ['a', 5],
        ['b', 7],
        ['c', 2],
        ['d', 8],
        ['e', 1],
      ] },
      { name: 'stock_changes', columns: ['item', 'op', 'qty'], rows: [
        ['b', 'U', 9],
        ['e', 'D', null],
      ] },
    ],
    code: `r = spark.sql("""MERGE INTO stock t USING stock_changes c
  ON t.item = c.item
  WHEN MATCHED AND c.op = 'D' THEN DELETE
  WHEN MATCHED THEN UPDATE SET qty = c.qty
  WHEN NOT MATCHED AND c.op <> 'D' THEN
    INSERT (item, qty) VALUES (c.item, c.qty)""").first()
print(r.num_affected_rows, spark.table("stock").count())`,
    expectedOutput: '2 4',
    explanation:
      'Item b is updated and item e is deleted: 2 affected rows. Five rows minus the deleted one leaves 4. Only the 2 changed rows are touched, while a full reload would rewrite every row of the table on every run. That is why reading the change log is the cheapest way to stay in step.',
    hints: [
      'Which rows in stock match a row in stock_changes?',
      'A delete removes a row; an update does not change the count.',
    ],
    tags: ['cdc-strategy', 'predict-output'],
    concepts: ['ing-cdc-strategy'],
  },
  {
    id: 'ing-mcq-i1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.INGESTION_ARCHITECTURE,
    course: Course.DATABRICKS,
    question:
      'A fraud model must score each transaction within 30 seconds of it happening, and transactions arrive continuously on a Kafka topic. Which ingestion mode fits, and why?',
    options: [
      { id: 'a', text: 'A scheduled run of trigger(availableNow=True) every 5 minutes, because that is close enough to continuous and batch is preferred for any message queue.', isCorrect: false },
      { id: 'b', text: 'A scheduled run of trigger(availableNow=True) once a day, because its cluster shutdown saves cost and next-day scoring is acceptable to the business.', isCorrect: false },
      { id: 'c', text: 'Land the Kafka messages as files first, because Databricks cannot read a Kafka topic directly, and then ingest those files on a schedule.', isCorrect: false },
      { id: 'd', text: "A continuously running stream, because a 30-second target on a push source needs a cluster that is always consuming, which a schedule cannot promise.", isCorrect: true },
    ],
    explanation:
      'A target of seconds on a push source such as Kafka is the case for a continuous stream. A scheduled run, however frequent, pays start-up time and waits for its next slot, so it cannot hold a 30-second window reliably. Databricks reads Kafka directly with Structured Streaming.',
    tags: ['batch-vs-streaming'],
    concepts: ['ing-batch-vs-streaming'],
  },
  {
    id: 'ing-mcq-i2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.INGESTION_ARCHITECTURE,
    course: Course.DATABRICKS,
    question:
      'A vendor drops one CSV export into a cloud storage folder every night, and the downstream report only has to reflect it by the next morning. Which ingestion mode fits, and why?',
    options: [
      { id: 'a', text: 'A stream that runs 24 hours a day, because a stream is the safer default and the data is then available the instant it lands.', isCorrect: false },
      { id: 'b', text: 'A stream for the first load only, then a manual script, because a checkpoint cannot be reused after a switch between streaming and batch.', isCorrect: false },
      { id: 'c', text: 'A nightly run of trigger(availableNow=True), because it loads the new file once and then stops, so no cluster idles the rest of the day.', isCorrect: true },
      { id: 'd', text: 'A custom polling script outside Databricks, because Auto Loader reads only push sources such as Kafka and cannot watch a storage folder.', isCorrect: false },
    ],
    explanation:
      'A next-morning target on a file drop is the case for incremental batch. The Auto Loader stream runs with trigger(availableNow=True) on a schedule, uses its checkpoint to load only the new files exactly once, and shuts down, which costs far less than keeping a stream running for data that is needed once a day.',
    tags: ['batch-vs-streaming'],
    concepts: ['ing-batch-vs-streaming'],
  },
  {
    id: 'ing-mcq-i3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.INGESTION_ARCHITECTURE,
    course: Course.DATABRICKS,
    question:
      'An Auto Loader stream reads JSON into bronze with a fixed schema, and cloudFiles.schemaEvolutionMode is set to none, so a new field does not stop the stream. The source starts sending a field the schema does not know. What happens to it with a rescued data column, and without one?',
    options: [
      { id: 'a', text: 'With the column the field is kept in _rescued_data, typically as JSON; without it the field is ignored and lost, with no error.', isCorrect: true },
      { id: 'b', text: 'It is dropped in both cases, because _rescued_data only holds values that failed a type cast and never a field the schema lacks.', isCorrect: false },
      { id: 'c', text: 'Without a rescued data column the stream always fails when it meets an unknown field, so schema drift is loud rather than silent.', isCorrect: false },
      { id: 'd', text: 'A rescued data column applies only to CSV sources; for JSON the new field is always dropped, whether or not the column exists.', isCorrect: false },
    ],
    explanation:
      'With the schema fixed and evolution off, a field the schema does not know is skipped. Without a rescued data column it disappears with no error and no trace. With one, Auto Loader keeps it, along with values that do not fit their column, in _rescued_data, so you can see it and recover it.',
    tags: ['file-format-landing'],
    concepts: ['ing-file-format-landing'],
  },
  {
    id: 'ing-mcq-i4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.INGESTION_ARCHITECTURE,
    course: Course.DATABRICKS,
    question:
      'A 50 GB orders table is filtered by a coarse order_date and also looked up by a high-cardinality customer_id. What does Liquid Clustering offer here that PARTITIONED BY cannot?',
    options: [
      { id: 'a', text: 'It can cluster on order_date and customer_id together without a directory per customer, and its keys can be changed later without a rewrite.', isCorrect: true },
      { id: 'b', text: 'It takes only low-cardinality keys such as order_date, as PARTITIONED BY does, so the two differ only in the keyword.', isCorrect: false },
      { id: 'c', text: 'Nothing, because PARTITIONED BY customer_id and order_date works well on any table, as the 1 TB guideline concerns size and not the number of values.', isCorrect: false },
      { id: 'd', text: 'It makes every query run at the same speed whichever columns it filters on, so no filter on the clustering keys is needed.', isCorrect: false },
    ],
    explanation:
      'Partitioning by customer_id would make a directory per customer, which is far too many for a 50 GB table. Liquid Clustering groups rows by several keys, including high-cardinality ones, without creating directories, and ALTER TABLE ... CLUSTER BY changes the keys later without a rewrite. It helps queries that filter on the keys; it does not make every query equally fast.',
    tags: ['partitioning-strategy'],
    concepts: ['ing-partitioning-strategy'],
  },
  {
    id: 'ing-mcq-i5',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.INGESTION_ARCHITECTURE,
    course: Course.DATABRICKS,
    question:
      'A legacy on-premises database has no accessible transaction log and no CDC tooling, but the pipeline must still find which rows changed since the last run. What strategy fits, and what does it cost?',
    options: [
      { id: 'a', text: 'Delta Change Data Feed, which can be pointed at any source database, so a missing log on the legacy system is no obstacle.', isCorrect: false },
      { id: 'b', text: 'A full reload is the only option, because comparing snapshots also needs a transaction log, however large the table is.', isCorrect: false },
      { id: 'c', text: 'Debezium, which is built to work without log access and rebuilds the changes from periodic full-table snapshots.', isCorrect: false },
      { id: 'd', text: 'Compare snapshots and MERGE the difference: it needs no log, but costs more compute than reading a change log would.', isCorrect: true },
    ],
    explanation:
      'Snapshot diffing is the fallback when no change log is available: pull the current state, compare it with the previous snapshot and MERGE the differences. It costs more compute than log-based CDC, but it does not depend on the source exposing a log. Delta Change Data Feed records changes to Delta tables, not to a foreign database, and Debezium reads database logs.',
    tags: ['cdc-strategy'],
    concepts: ['ing-cdc-strategy'],
  },
  {
    id: 'ing-mcq-i6',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.INGESTION_ARCHITECTURE,
    course: Course.DATABRICKS,
    question:
      'A compliance team asks why the landing zone still holds raw files from 6 months ago, when the bronze table already keeps the same records for the whole 90-day retention period. What landing-zone practice answers this?',
    options: [
      { id: 'a', text: "None is needed, because immutable files and infinite retention are the same requirement, so a landing zone keeps every file once written.", isCorrect: false },
      { id: 'b', text: 'A storage lifecycle policy: files stay a short time on standard storage, move to cheaper tiers, then are purged once bronze covers the retention need.', isCorrect: true },
      { id: 'c', text: "Turn off immutability so an engineer can delete old files by hand on request, trading the audit guarantee for savings, at the cost of a weaker audit trail.", isCorrect: false },
      { id: 'd', text: 'A landing zone must never have a lifecycle policy, so the only way to cut the cost is to move to a cloud provider with cheaper storage.', isCorrect: false },
    ],
    explanation:
      'Files are kept unchanged while they are the audit record. Once bronze holds the history the retention rules need, a lifecycle policy moves old files to cheaper tiers and then deletes them automatically. Immutability stops edits and early deletion; it does not require keeping files forever.',
    tags: ['landing-zone'],
    concepts: ['ing-landing-zone'],
  },

  // ────────────────────────────────────────────────────────────────────
  // ADVANCED (19)
  // ────────────────────────────────────────────────────────────────────

  // Partitioning a small table too finely (x3)
  {
    id: 'ing-mcq-a1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.INGESTION_ARCHITECTURE,
    course: Course.DATABRICKS,
    question:
      'A 40 GB clickstream_events table is partitioned by year, month, day and hour. After 18 months it has over 13,000 partition directories, most holding files under 200 KB, and queries often time out while planning. What is wrong, and what is the fix?',
    options: [
      { id: 'a', text: "This is a fixed platform limit on file counts, so a larger metastore is needed; changing the partitioning would not help.", isCorrect: false },
      { id: 'b', text: 'Auto Loader\'s checkpoint is corrupted; deleting and rebuilding it consolidates the small partition files on the next run.', isCorrect: false },
      { id: 'c', text: "The table is cut much finer than 40 GB needs, leaving tiny files; use a coarser grain such as day, or Liquid Clustering.", isCorrect: true },
      { id: 'd', text: 'The table should not use CLUSTER BY on an hourly timestamp; the fix is to switch to PARTITIONED BY year, month, day and hour.', isCorrect: false },
    ],
    explanation:
      'Every distinct combination of partition values becomes a directory, and 40 GB spread over thousands of directories leaves each with a few small files. Planning has to list and open them all. Partition at a coarser grain or, better for a table this size, leave it unpartitioned and cluster it on the columns queries filter by.',
    tags: ['hive-time-machine'],
    concepts: ['ing-hive-time-machine'],
  },
  {
    id: 'ing-mcq-a2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.INGESTION_ARCHITECTURE,
    course: Course.DATABRICKS,
    question:
      "An IoT sensor_readings table is only 15 GB but was partitioned by year, month, day, hour and device_region at launch. It has over 40,000 partitions, most under 100 KB, and simple date-range queries take minutes to plan. What is happening, and what is the fix?",
    options: [
      { id: 'a', text: 'Planning is slow because the cluster is too small; adding workers fixes the planning time without changing the partition columns.', isCorrect: false },
      { id: 'b', text: "The Delta log is corrupted; running VACUUM with a zero-hour retention clears the metadata backlog that slows planning, so more workers are the fix.", isCorrect: false },
      { id: 'c', text: "Any table with more than one partition column plans slowly, whatever the cardinality of the columns or the size of the table.", isCorrect: false },
      { id: 'd', text: "The partition count multiplies across every column, far beyond what 15 GB needs; use one coarse column, or cluster on date and region.", isCorrect: true },
    ],
    explanation:
      'The partition count is the product of the distinct values of each partition column, so adding device_region to a fine time grain multiplies the directories. At 15 GB each ends up tiny. Drop to one coarse column or cluster on the columns the queries use. VACUUM with zero retention would not help and is unsafe.',
    tags: ['hive-time-machine'],
    concepts: ['ing-hive-time-machine'],
  },
  {
    id: 'ing-mcq-a3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.INGESTION_ARCHITECTURE,
    course: Course.DATABRICKS,
    question:
      'An 8 GB support_tickets table is partitioned by year, month, day and hour "to make time-range queries fast". It gets only a few hundred rows an hour, so most hourly files are a few KB. What is the right diagnosis and fix?',
    options: [
      { id: 'a', text: "There is no problem: making time-range queries fast justifies any grain, since query speed always outweighs file count and the cost of planning.", isCorrect: false },
      { id: 'b', text: "Tables under 10 GB should be stored as a single Parquet file with no partitioning or clustering of any kind, whatever the queries.", isCorrect: false },
      { id: 'c', text: 'A few hundred rows an hour cannot fill an hourly partition; partition by day, or better cluster on the timestamp, so files hold useful amounts of data.', isCorrect: true },
      { id: 'd', text: "The table lacks a Bloom filter index, and adding one removes the small-file problem without changing the partitioning, leaving the hourly layout as it is.", isCorrect: false },
    ],
    explanation:
      'Wanting fast time-range queries does not justify any grain: the partitions still have to hold enough data. A few hundred rows an hour fills nothing. Clustering on the timestamp (or at most a daily partition) keeps files a sensible size and still lets queries skip data by time.',
    tags: ['hive-time-machine'],
    concepts: ['ing-hive-time-machine'],
  },

  // Overwriting a whole table for a few changed rows (x3)
  {
    id: 'ing-mcq-a4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.INGESTION_ARCHITECTURE,
    course: Course.DATABRICKS,
    question:
      "A nightly job runs .mode(\"overwrite\").saveAsTable(\"subscription_billing\") on a 600 GB table, though only the current day's invoices, about 0.5% of rows, changed. What does that cost beyond the compute, and what is the fix?",
    options: [
      { id: 'a', text: 'Nothing beyond compute: an overwrite rewrites only the files that changed, so it behaves like a scoped write and the table history is unaffected.', isCorrect: false },
      { id: 'b', text: 'It writes 600 GB to change 0.5%, and each night\'s old copy stays on storage until VACUUM; MERGE the changed invoices, or replaceWhere the day.', isCorrect: true },
      { id: 'c', text: 'It switches the job into a streaming write whose checkpoint falls out of step with the source; the fix is to delete the checkpoint.', isCorrect: false },
      { id: 'd', text: 'It adds the day\'s rows next to the existing ones, so invoices duplicate; the fix is a distinct step after each run.', isCorrect: false },
    ],
    explanation:
      'An overwrite replaces the whole table, so every night 600 GB of new files are written to change about 3 GB, and the previous 600 GB of files stay on storage, readable through time travel, until VACUUM removes them. Applying only the changes with MERGE, or overwriting just the changed day with replaceWhere, writes a small fraction of that.',
    tags: ['naked-overwrites'],
    concepts: ['ing-naked-overwrites'],
  },
  {
    id: 'ing-mcq-a5',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.INGESTION_ARCHITECTURE,
    course: Course.DATABRICKS,
    question:
      'A 2 TB inventory_snapshot table is overwritten in full every hour, recomputing every warehouse, although only a few warehouses had stock movement that hour. What is the fix, in terms of Delta write options?',
    options: [
      { id: 'a', text: 'Switch to .mode("append"), which rewrites nothing and keeps the same table, since each hour only adds the warehouses that moved.', isCorrect: false },
      { id: 'b', text: 'Run the same full overwrite once a day instead of hourly, which cuts the number of full rewrites without changing what each one writes.', isCorrect: false },
      { id: 'c', text: 'Scope the write with replaceWhere, or a MERGE, to the warehouses that moved, instead of a bare overwrite of the whole 2 TB.', isCorrect: true },
      { id: 'd', text: 'Run VACUUM straight after each overwrite, so the old files are removed and the next write has less to rewrite.', isCorrect: false },
    ],
    explanation:
      'replaceWhere (or a MERGE keyed on the warehouse) limits the write to the rows that changed, so the work follows the size of the change rather than the table. An append would stack a second row for each warehouse that moved. Running less often or vacuuming does not reduce what each overwrite writes.',
    tags: ['naked-overwrites'],
    concepts: ['ing-naked-overwrites'],
  },
  {
    id: 'ing-mcq-a6',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.INGESTION_ARCHITECTURE,
    course: Course.DATABRICKS,
    question:
      "A team defends a nightly full overwrite of a 900 GB employee_directory table because \"it is simple and we have never had a correctness bug\". What cost are they missing, beyond raw compute time?",
    options: [
      { id: 'a', text: 'None: if the job has never produced a bad result, a full overwrite is as good as a scoped write in cost and in table history.', isCorrect: false },
      { id: 'b', text: "A full overwrite skips schema enforcement, so it is more likely than a scoped write to let bad data in over time, since Delta does not check overwrites.", isCorrect: false },
      { id: 'c', text: 'The only cost is old files piling up; a nightly VACUUM with zero retention would remove the downside of the pattern completely.', isCorrect: false },
      { id: 'd', text: 'Correctness is not the issue: it rewrites 900 GB for a small daily change, and every night\'s full copy of old files stays until VACUUM.', isCorrect: true },
    ],
    explanation:
      'A full overwrite can be perfectly correct and still wasteful. It rewrites everything for a small change set, and each run leaves a full copy of the previous files behind, readable by time travel, until VACUUM removes them. Delta still enforces the schema on an overwrite, and vacuuming with zero retention would break time travel and concurrent readers.',
    tags: ['naked-overwrites'],
    concepts: ['ing-naked-overwrites'],
  },

  // Auto Loader listing a bucket of millions of files (x3)
  {
    id: 'ing-mcq-a7',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.INGESTION_ARCHITECTURE,
    course: Course.DATABRICKS,
    question:
      'An Auto Loader stream reads an image-upload bucket of over 2 million files in its default directory listing mode. It now spends hours listing the bucket before it processes a single new file. What is wrong, and what is the fix?',
    options: [
      { id: 'a', text: 'Network bandwidth is the limit, so a larger cluster with more throughput fixes it, because listing speed does not depend on the number of files.', isCorrect: false },
      { id: 'b', text: 'The bucket is not partitioned by hour; partitioning it by year, month, day and hour lets Auto Loader list a small part of it.', isCorrect: false },
      { id: 'c', text: "Listing is slow once a bucket holds millions of files; turn on file notification (cloudFiles.useNotifications) so new files are announced.", isCorrect: true },
      { id: 'd', text: 'Auto Loader must re-list every file in a bucket on every trigger, whatever its settings, so the only fix is to split the bucket in several.', isCorrect: false },
    ],
    explanation:
      'In directory listing mode Auto Loader finds new files by listing the input path through the cloud storage API, and that listing grows with the number of files. File notification mode (cloudFiles.useNotifications) has the storage account report new files as they arrive, so no listing of the bucket is needed. Databricks also offers managed file events on Unity Catalog external locations for the same purpose.',
    tags: ['directory-listing-trap'],
    concepts: ['ing-directory-listing-trap'],
  },
  {
    id: 'ing-mcq-a8',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.INGESTION_ARCHITECTURE,
    course: Course.DATABRICKS,
    question:
      'A clickstream JSON bucket gets about 500,000 small files a day and has never been cleaned. After 8 months Auto Loader (directory listing) takes over 40 minutes just to find the new files. What fixes this, beyond only changing the file discovery mode?',
    options: [
      { id: 'a', text: "Use file notification so new files are announced, and add a lifecycle policy so the bucket stops filling with files already processed.", isCorrect: true },
      { id: 'b', text: 'Run the stream less often, such as once a day, which cuts the listing cost in proportion without any configuration change.', isCorrect: false },
      { id: 'c', text: "Do nothing: once a bucket passes about a million files, Auto Loader switches itself to file notification mode, so the slowdown will fade.", isCorrect: false },
      { id: 'd', text: 'Merge the daily files into one large JSON file at the source, though listing cost depends on bytes, so the change would not help.', isCorrect: false },
    ],
    explanation:
      'File notification mode removes the cost of listing. It does not stop the bucket growing without limit, so pair it with a lifecycle policy that ages out files already ingested. Running less often makes each listing bigger, not cheaper, and Auto Loader never changes its discovery mode by itself.',
    tags: ['directory-listing-trap'],
    concepts: ['ing-directory-listing-trap'],
  },
  {
    id: 'ing-mcq-a9',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.INGESTION_ARCHITECTURE,
    course: Course.DATABRICKS,
    question:
      "A team migrating an IoT pipeline starts every new Auto Loader stream in directory listing mode, \"because it is simpler and needs no extra cloud permissions\". One telemetry bucket has 4 million files. What is the risk, and when is directory listing the right choice?",
    options: [
      { id: 'a', text: "There is no risk, since listing costs the same whatever the number of files, so using it everywhere for simplicity is fine at any scale.", isCorrect: false },
      { id: 'b', text: "File notification needs no extra permissions, so there is never a reason to use directory listing on any bucket, whatever its size.", isCorrect: false },
      { id: 'c', text: "The 4-million-file bucket will list slowly, so move that stream to file notification; small buckets can keep the simpler listing.", isCorrect: true },
      { id: 'd', text: 'The risk applies only to JSON sources, so telemetry would hit it at a much lower file count than a Parquet bucket.', isCorrect: false },
    ],
    explanation:
      'Directory listing is simple and fine for a modest number of files. It slows down as the bucket grows into the millions, so switch those streams to file notification, accepting the extra cloud permissions it needs to create its event subscription. The file format makes no difference to listing.',
    tags: ['directory-listing-trap'],
    concepts: ['ing-directory-listing-trap'],
  },

  // Batch or streaming in harder settings (x3)
  {
    id: 'ing-mcq-a10',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.INGESTION_ARCHITECTURE,
    course: Course.DATABRICKS,
    question:
      "A payments platform must detect duplicate charges within 2 minutes, reading a Kafka topic. A nightly marketing job reads the same topic's log with a scheduled batch pull. Should both consumers use the same ingestion mode?",
    options: [
      { id: 'a', text: "Yes, because Kafka's consumer group protocol silently drops messages for whichever consumer runs in the other mode, so both must match.", isCorrect: false },
      { id: 'b', text: "No: fraud needs a continuous stream for its 2-minute target, and marketing can run in batch, since a topic has independent consumers.", isCorrect: true },
      { id: 'c', text: 'No, but the other way round: marketing streams because it reads Kafka, and fraud runs in batch since it needs accuracy and not freshness.', isCorrect: false },
      { id: 'd', text: 'Yes, because a Kafka topic can be read by only one job at a time, so the two would have to merge into one pipeline.', isCorrect: false },
    ],
    explanation:
      'The mode is a per-consumer choice based on that consumer\'s freshness target, not a property of the source. Kafka lets many consumers read the same topic independently at their own pace, so one can stream continuously while another pulls in batch.',
    tags: ['batch-vs-streaming'],
    concepts: ['ing-batch-vs-streaming'],
  },
  {
    id: 'ing-mcq-a11',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.INGESTION_ARCHITECTURE,
    course: Course.DATABRICKS,
    question:
      "A logistics company runs a continuous stream that ingests GPS pings for live delivery tracking on a small always-on cluster. An engineer proposes trigger(availableNow=True) every 2 minutes to save cost. What is the real tradeoff?",
    options: [
      { id: 'a', text: "There is none: availableNow every 2 minutes matches a continuous stream in latency and cost, so the switch is a pure gain with no downside.", isCorrect: false },
      { id: 'b', text: "It trades freshness for cost: each run pays cluster start-up and data is up to 2 minutes old, which suits tracking only if acceptable.", isCorrect: true },
      { id: 'c', text: "It changes only cost and never latency, because both modes use the same engine and so deliver data with the same delay end to end.", isCorrect: false },
      { id: 'd', text: "It is not possible, because availableNow reads only file-based sources and cannot be used with a live stream of GPS pings from devices.", isCorrect: false },
    ],
    explanation:
      'Frequent availableNow runs still pay for cluster start-up each time and deliver data in batches up to the interval old. Whether the saving is worth it depends on how fresh the tracking page really must be. availableNow works with Kafka and other streaming sources, not only files.',
    tags: ['batch-vs-streaming'],
    concepts: ['ing-batch-vs-streaming'],
  },
  {
    id: 'ing-mcq-a12',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.INGESTION_ARCHITECTURE,
    course: Course.DATABRICKS,
    question:
      "A vendor drops an inventory file into a cloud storage folder once a day, at an unpredictable time between 6am and 11am. It is only needed for that afternoon's replenishment run. An engineer sets up a continuous stream \"to be safe\". What is wrong with that, and what fits better?",
    options: [
      { id: 'a', text: "Nothing is wrong: a stream is the safest default for any source whose arrival time is unpredictable, however loose the deadline is.", isCorrect: false },
      { id: 'b', text: "A stream keeps a cluster running all day for one daily file; run trigger(availableNow=True) hourly to load it once it lands.", isCorrect: true },
      { id: 'c', text: 'A fixed run at 6am is better, because unpredictable arrival rules out any trigger that is not fixed, and a late file waits a day.', isCorrect: false },
      { id: 'd', text: 'Only a person can start the job after seeing the file, because no scheduled trigger works when the arrival time is unpredictable.', isCorrect: false },
    ],
    explanation:
      'Unpredictable arrival does not force a continuous stream. A scheduled availableNow run, say hourly, finds the file when it lands, loads it once and stops, which suits the loose afternoon deadline. A single 6am run would miss a later file, and a manual start is unnecessary.',
    tags: ['batch-vs-streaming'],
    concepts: ['ing-batch-vs-streaming'],
  },

  // Table layout in harder settings (x3)
  {
    id: 'ing-mcq-a13',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.INGESTION_ARCHITECTURE,
    course: Course.DATABRICKS,
    question:
      "A 3 TB events table is partitioned by event_date, and most queries filter on both event_date and a high-cardinality session_id. Planners scan far more files than needed because session_id is not in the layout. What change fixes that without recreating too many tiny directories?",
    options: [
      { id: 'a', text: 'Rebuild it with Liquid Clustering on (event_date, session_id), which handles the high-cardinality key without a directory per session.', isCorrect: true },
      { id: 'b', text: 'Add session_id as a second PARTITIONED BY column, which is the standard fix for a query that filters on two columns.', isCorrect: false },
      { id: 'c', text: 'Drop event_date and partition by session_id alone, because the more selective column should be the only partition column.', isCorrect: false },
      { id: 'd', text: 'Keep the event_date partitions and add a Bloom filter index on session_id, because that is the way to improve selectivity within a partition.', isCorrect: false },
    ],
    explanation:
      'A second PARTITIONED BY level on session_id would create a directory per session, an enormous number even at 3 TB. Liquid Clustering on (event_date, session_id) keeps data with similar keys together without directories, so the engine can skip files on either filter. A partitioned table has to be rebuilt to adopt clustering.',
    tags: ['partitioning-strategy'],
    concepts: ['ing-partitioning-strategy'],
  },
  {
    id: 'ing-mcq-a14',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.INGESTION_ARCHITECTURE,
    course: Course.DATABRICKS,
    question:
      "A new 400 GB ad_spend table is queried almost only by a coarse campaign_month filter, and planning time is growing with the table. Which layout fits, following current Databricks advice?",
    options: [
      { id: 'a', text: 'PARTITIONED BY campaign_month, because a coarse, low-cardinality column that matches the usual filter is exactly the case for partitioning.', isCorrect: false },
      { id: 'b', text: "Leave it unpartitioned and CLUSTER BY (campaign_month): under 1 TB, partition directories add little and clustering still lets queries skip files.", isCorrect: true },
      { id: 'c', text: "No layout at all, because a layout tuned to one filter column always slows every other kind of query on the table in the same table.", isCorrect: false },
      { id: 'd', text: "PARTITIONED BY campaign_month and campaign_id together, since two partition columns prune more files than one, whatever their cardinality or the table size.", isCorrect: false },
    ],
    explanation:
      'Databricks advises partitioning only for tables over about 1 TB, on a low-cardinality column with at least 1 GB per partition. A 400 GB table is under that, so cluster it on the filter column instead; Liquid Clustering gives the data skipping without directories and can change keys later. Clustering one column does not make other queries slower than no layout.',
    tags: ['partitioning-strategy'],
    concepts: ['ing-partitioning-strategy'],
  },
  {
    id: 'ing-mcq-a15',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.INGESTION_ARCHITECTURE,
    course: Course.DATABRICKS,
    question:
      "A product_events table was clustered by event_date with Liquid Clustering. Six months later most queries filter by product_id instead. What does adapting to this need under Liquid Clustering, compared with PARTITIONED BY?",
    options: [
      { id: 'a', text: "Under both, changing the key means rewriting all the data files, so the two cost the same to adapt to a new query pattern, however it was loaded.", isCorrect: false },
      { id: 'b', text: "PARTITIONED BY changes with a metadata-only ALTER TABLE, while Liquid Clustering keys cannot be changed once the table exists at all, so it is the more flexible of the two.", isCorrect: false },
      { id: 'c', text: "Neither can adapt: the table must be dropped and rebuilt from source with the new key, whichever layout it uses and then reloaded in full.", isCorrect: false },
      { id: 'd', text: "ALTER TABLE ... CLUSTER BY (product_id) changes keys in place; a partition column is part of every file path, so changing it rewrites the table.", isCorrect: true },
    ],
    explanation:
      'Liquid Clustering keys are table metadata, so ALTER TABLE ... CLUSTER BY changes them in place: existing files are not rewritten, and new writes and the next OPTIMIZE cluster by the new keys. A partition column is written into each file\'s directory path, so changing it means rewriting the data.',
    tags: ['partitioning-strategy'],
    concepts: ['ing-partitioning-strategy'],
  },

  // Keeping in step with a source in harder settings (x3)
  {
    id: 'ing-mcq-a16',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.INGESTION_ARCHITECTURE,
    course: Course.DATABRICKS,
    question:
      'A company runs Postgres with logical replication already enabled for another use, and has a 6 GB country_codes lookup table that changes about twice a year. Should every table in that database use the same sync strategy?',
    options: [
      { id: 'a', text: 'Yes, because once CDC exists for some tables, every table in the same database must use it, as two strategies cannot share one source.', isCorrect: false },
      { id: 'b', text: "No, but the other way round: country_codes uses CDC because it is small, and the large tables are fully reloaded, since that is the simpler option.", isCorrect: false },
      { id: 'c', text: 'Yes, because logical replication means every table should be fully reloaded, as CDC and full reload cannot coexist in one database.', isCorrect: false },
      { id: 'd', text: "No: busy tables use CDC from the replication log, while country_codes is simplest as a full reload, as 6 GB twice a year costs little.", isCorrect: true },
    ],
    explanation:
      'The strategy is chosen per table, by size, how often it changes and whether a log is available, not once for the whole source. CDC pays off on large, busy tables. For a small table that almost never changes, CDC adds complexity for no benefit, and a full reload is fine. The two coexist against one database.',
    tags: ['cdc-strategy'],
    concepts: ['ing-cdc-strategy'],
  },
  {
    id: 'ing-mcq-a17',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.INGESTION_ARCHITECTURE,
    course: Course.DATABRICKS,
    question:
      'A 2 TB orders table is reloaded in full every night because "it has always worked". The source exposes its transaction log, and the organisation already runs CDC successfully elsewhere. What is the case for moving this table, and to what?',
    options: [
      { id: 'a', text: 'There is none: "it has always worked" is enough reason to keep a full reload on any table, whatever a cheaper path would save.', isCorrect: false },
      { id: 'b', text: 'Move to snapshot diffing first, since it is always the safer step before CDC, even when the log is accessible and the tooling exists.', isCorrect: false },
      { id: 'c', text: 'Move to CDC: the log is available and proven here, and a nightly 2 TB rewrite is heavy for what is likely a small daily change set.', isCorrect: true },
      { id: 'd', text: 'There is no difference above 1 TB, as both strategies reach the same write volume and source load at that size.', isCorrect: false },
    ],
    explanation:
      'A full reload suits small tables. At 2 TB it rewrites everything every night for a change set that is probably a small fraction of that. With a log available and CDC already proven in the organisation, reading only the changes is cheaper for both the source and the target.',
    tags: ['cdc-strategy'],
    concepts: ['ing-cdc-strategy'],
  },
  {
    id: 'ing-mcq-a18',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.INGESTION_ARCHITECTURE,
    course: Course.DATABRICKS,
    question:
      "A SaaS vendor's API only offers a full export of its 4 GB subscription_plans table: no changed-since parameter, no webhook, no log. An engineer wants to build log-based CDC against it \"for consistency\". What is the right call?",
    options: [
      { id: 'a', text: "Reload it in full: there is no log to build CDC on, and at 4 GB the rewrite is cheap, so change detection is not worth building.", isCorrect: true },
      { id: 'b', text: "Poll the export every few seconds and diff the answers in memory; once built, that counts as genuine log-based CDC on a schedule.", isCorrect: false },
      { id: 'c', text: "Skip the table, because a source with no changed-since parameter cannot be ingested into Databricks without help from the vendor.", isCorrect: false },
      { id: 'd', text: 'Build CDC anyway, since every source should use the same strategy even if that needs fragile workarounds against the source.', isCorrect: false },
    ],
    explanation:
      'Log-based CDC needs the source to expose its changes, and this API does not. For a small table the simplest correct choice is a full reload, whose write cost is negligible at 4 GB. Diffing polled exports is a snapshot comparison, not a change log, and forcing consistency across sources is not a reason to build fragile tooling.',
    tags: ['cdc-strategy'],
    concepts: ['ing-cdc-strategy'],
  },

  // Telling two failures apart
  {
    id: 'ing-mcq-disc1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.INGESTION_ARCHITECTURE,
    course: Course.DATABRICKS,
    question:
      'A table partitioned far too finely and an Auto Loader stream over a bucket of millions of files both look like "too many small files, so everything is slow". What is the concrete difference in where the cost is paid?',
    options: [
      { id: 'a', text: "None: both are one problem, too many files in a location, seen in a table's partitions and in a bucket and named twice in the bucket, and the fix is the same for both.", isCorrect: false },
      { id: 'b', text: 'One happens only with Liquid Clustering and the other only with PARTITIONED BY, so the destination table\'s layout tells them apart.', isCorrect: false },
      { id: 'c', text: "The over-partitioned table slows every query on it because of its layout; the listing slows each ingestion run that must find new files in the bucket.", isCorrect: true },
      { id: 'd', text: "One lives in the landing zone and the other in bronze, so the medallion layer where the small files appear tells them apart, not the cost of listing or of layout.", isCorrect: false },
    ],
    explanation:
      'The first is a layout problem in the Delta table: an over-fine partition scheme leaves tiny files that every later query must plan around. The second is a discovery problem in the source bucket: Auto Loader lists millions of files to find the new ones, whatever the destination table looks like. Fixing one does not fix the other.',
    tags: ['hive-time-machine', 'directory-listing-trap'],
    concepts: ['ing-hive-time-machine', 'ing-directory-listing-trap'],
  },

  // ────────────────────────────────────────────────────────────────────
  // CODING (2) + PARSONS (1)
  // ────────────────────────────────────────────────────────────────────
  {
    id: 'ing-coding-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.INGESTION_ARCHITECTURE,
    course: Course.DATABRICKS,
    language: CodeLanguage.SQL,
    requires: [
      'CLUSTER BY',
      'event_time',
      'page_views_raw',
      /CLUSTER\s+BY\s*\(\s*event_time\s*\)/i,
      /^(?![\s\S]*PARTITIONED\s+BY)/i,
    ],
    question: `A 20 GB table page_views used to be written with PARTITIONED BY (year, month, day, hour), which left tens of thousands of tiny files. The raw rows are in the table page_views_raw (view_id, url, event_time).

Write one SQL statement that creates page_views from the rows of page_views_raw, replacing the old table. It must not be partitioned, and queries filter mainly on event_time, so lay it out for that with Liquid Clustering.`,
    starterCode: `-- Create page_views from page_views_raw, clustered on event_time
`,
    solution: `CREATE OR REPLACE TABLE page_views
CLUSTER BY (event_time)
AS SELECT * FROM page_views_raw;
-- OR
CREATE OR REPLACE TABLE page_views CLUSTER BY (event_time) AS SELECT view_id, url, event_time FROM page_views_raw;
-- OR
CREATE OR REPLACE TABLE page_views USING DELTA CLUSTER BY (event_time) AS SELECT * FROM page_views_raw;`,
    testCases: [
      {
        input: '',
        expectedOutput:
          'CREATE OR REPLACE TABLE page_views\nCLUSTER BY (event_time)\nAS SELECT * FROM page_views_raw;',
        description:
          'Creates page_views as a copy of page_views_raw with Liquid Clustering on event_time and no PARTITIONED BY clause.',
      },
    ],
    explanation:
      'A 20 GB table is far below the size where partition directories pay off, so the fix is to drop the partitions and cluster on the column queries filter by. CLUSTER BY (event_time) makes no directories, so there are no tiny files from the layout, and the keys can be changed later with ALTER TABLE. CREATE OR REPLACE replaces the old table in one step.',
    hints: [
      'CLUSTER BY goes after the table name and before AS SELECT.',
      'Do not repeat a PARTITIONED BY clause.',
    ],
    tieredHints: {
      apiSignature: 'CREATE OR REPLACE TABLE name CLUSTER BY (col) AS SELECT ...',
      skeleton: `CREATE OR REPLACE TABLE page_views\n____ ____ (event_time)\nAS SELECT * FROM ____;`,
    },
    tags: ['hive-time-machine'],
    concepts: ['ing-hive-time-machine'],
  },
  {
    id: 'ing-coding-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.INGESTION_ARCHITECTURE,
    course: Course.DATABRICKS,
    language: CodeLanguage.PYTHON,
    requires: ['replaceWhere', 'overwrite', 'warehouse_id', 'WH-42'],
    question: `A nightly job overwrites the whole 400 GB Delta table warehouse_inventory, but updated_df holds recomputed rows for warehouse_id = 'WH-42' only.

Write the PySpark write so that only the rows for warehouse 'WH-42' are replaced by updated_df, and every other warehouse's rows stay as they are.`,
    starterCode: `# updated_df: recomputed rows for warehouse_id = 'WH-42' only
`,
    solution: `updated_df.write \\
    .format("delta") \\
    .mode("overwrite") \\
    .option("replaceWhere", "warehouse_id = 'WH-42'") \\
    .saveAsTable("warehouse_inventory")
# OR
updated_df.write.mode("overwrite").option("replaceWhere", "warehouse_id = 'WH-42'").saveAsTable("warehouse_inventory")`,
    testCases: [
      {
        input: '',
        expectedOutput:
          'updated_df.write.format("delta").mode("overwrite").option("replaceWhere", "warehouse_id = \'WH-42\'").saveAsTable("warehouse_inventory")',
        description:
          'Overwrites in Delta with replaceWhere set to the warehouse_id predicate, so only the WH-42 rows are replaced. A plain overwrite with no replaceWhere fails.',
      },
    ],
    explanation:
      'A plain mode("overwrite") replaces the entire table with updated_df, so every other warehouse would be deleted and 400 GB rewritten. replaceWhere limits the overwrite to rows matching its predicate, so only the WH-42 rows are replaced, in one atomic commit.',
    hints: [
      'A DataFrameWriter option set with .option(key, value) can narrow an overwrite.',
      'The predicate is a SQL condition written as a string.',
    ],
    tieredHints: {
      apiSignature: 'dfWriter.option(key, value)',
      skeleton: `updated_df.____ \\\n    .____("delta") \\\n    .____("overwrite") \\\n    .____("replaceWhere", "warehouse_id = 'WH-42'") \\\n    .____("warehouse_inventory")`,
    },
    tags: ['naked-overwrites'],
    concepts: ['ing-naked-overwrites'],
  },
  {
    id: 'ing-parsons-1',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.INGESTION_ARCHITECTURE,
    course: Course.DATABRICKS,
    language: CodeLanguage.PYTHON,
    question:
      'Order the lines that define an Auto Loader stream over a bucket of millions of JSON files so that it finds new files through file notification instead of listing the bucket. Two lines do not belong.',
    correctOrder: [
      'reader = spark.readStream.format("cloudFiles").option("cloudFiles.format", "json")',
      'reader = reader.option("cloudFiles.useNotifications", "true")',
      'stream = reader.load("s3://landing/uploads/")',
    ],
    distractorLines: [
      'reader = reader.option("cloudFiles.useNotifications", "false")',
      'stream = spark.readStream.load("s3://landing/uploads/")',
    ],
    solution: `reader = spark.readStream.format("cloudFiles").option("cloudFiles.format", "json")\nreader = reader.option("cloudFiles.useNotifications", "true")\nstream = reader.load("s3://landing/uploads/")`,
    explanation:
      'The reader is created first, with the cloudFiles format and the file type; file notification is switched on with cloudFiles.useNotifications set to true; and load starts the stream from the finished reader. Setting it to "false" keeps the directory listing, and a plain readStream without the cloudFiles format is not an Auto Loader stream at all.',
    tags: ['directory-listing-trap'],
    concepts: ['ing-directory-listing-trap'],
  },
];
