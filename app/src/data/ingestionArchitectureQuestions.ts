import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

// INGESTION_ARCHITECTURE — Databricks course, "Lakehouse Architecture &
// Engineering Practice" section. Third and final of three new
// design-judgment topics (siblings: orchestration_design, gold_layer_design,
// both already built).
//
// This is NOT re-teaching auto_loader (cloudFiles syntax), structured_streaming
// (readStream/writeStream mechanics), or change_data_capture (APPLY CHANGES
// INTO / CDF API syntax) — all already exist and are assumed as
// prerequisites. This topic is the Databricks-specific INGESTION DESIGN
// JUDGMENT layer on top: when to choose batch vs streaming, which raw file
// format to land, how to lay out and retain a landing zone, how to choose a
// partitioning strategy, and how to choose between CDC/batch-diff/full-reload
// — plus the production failure modes that show up when these are
// misjudged.
//
// Sources: Databricks Auto Loader docs, Netflix/DoorDash/Uber engineering
// blogs on incremental ingestion and CDC at scale (see
// databricks_de_research_results.md).
//
// Coverage (39 questions):
//   Beginner (5 MCQ): define each of the 5 core primitives.
//   Intermediate (12): 6 PREDICT_OUTPUT tracing Hive Time-Machine partition
//     math / Naked Overwrites write-amplification / CDC-vs-full-reload row
//     counts as small deterministic Python functions (a real faded layer,
//     same pattern as gold_layer_design) + 6 scenario MCQs (batch-vs-streaming
//     x2, file-format x1, partitioning x1, CDC x1, landing-zone x1).
//   Advanced (19): 3 anti-patterns x 3 domain-transfer scenarios each
//     (Hive Time-Machine, Naked Overwrites, Directory Listing Ingestion Trap)
//     + 3 decision-judgment primitives x 3 domain-transfer scenarios each
//     (batch vs streaming, partitioning strategy, CDC strategy) + 1
//     discrimination question distinguishing two "too many small files"
//     failure modes with different root causes.
//   Coding/Parsons (3): fix a Hive Time-Machine by re-partitioning to a
//     coarser grain, implement a scoped replaceWhere fix for a Naked
//     Overwrite, Parsons assembly of switching Auto Loader from directory
//     listing mode to file notification mode.

export const ingestionArchitectureQuestions: Question[] = [
  // ────────────────────────────────────────────────────────────────────
  // BEGINNER (5) — define each core primitive
  // ────────────────────────────────────────────────────────────────────
  {
    id: 'ing-mcq-b1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.INGESTION_ARCHITECTURE,
    course: Course.DATABRICKS,
    question:
      "What's the main signal for choosing continuous streaming ingestion over scheduled incremental batch ingestion?",
    options: [
      { id: 'a', text: "SLA and source push behavior — continuous streaming fits sub-minute SLAs and push-based sources like Kafka/Event Hubs/Kinesis, while scheduled batch (Trigger.AvailableNow) fits 15-minute-or-longer SLAs and file-drop sources, provisioning a cluster only long enough to clear the backlog before shutting down.", isCorrect: true },
      { id: 'b', text: 'File format alone — any source landing data as Parquet must be ingested with continuous streaming, while any source landing data as JSON or CSV must be ingested with scheduled batch, regardless of how quickly downstream consumers need the data.', isCorrect: false },
      { id: 'c', text: "Table size alone — tables under 1 TB are always ingested with continuous streaming for simplicity, and tables over 1 TB are always ingested with scheduled batch because a streaming cluster can't keep up with that volume.", isCorrect: false },
      { id: 'd', text: "Whether Unity Catalog is enabled — continuous streaming is only available for tables registered in Unity Catalog's 3-level namespace, so a legacy hive_metastore table must always use scheduled batch ingestion instead.", isCorrect: false },
    ],
    explanation:
      "The decision is driven by SLA tightness and how the source delivers data, not by file format, table size, or catalog registration. A push-based source with a sub-minute SLA needs a continuously running cluster; a periodic file drop with a looser SLA can run Trigger.AvailableNow and shut the cluster down between runs, saving 80-90% of compute cost.",
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
      "A source system delivers data as raw JSON. What's the recommended practice for landing and ingesting it, and why?",
    options: [
      { id: 'a', text: 'Land raw JSON as-is (no pre-conversion) and parse it directly into Delta at bronze using Auto Loader; JSON/CSV lack native type enforcement, so landing teams intentionally do not convert before ingestion, and Auto Loader handles the parse-and-type step during the bronze write.', isCorrect: true },
      { id: 'b', text: 'Convert JSON to Parquet using a separate preprocessing job before it touches the landing zone, because Auto Loader is restricted to reading Avro and Parquet formats, unable to parse raw JSON or CSV files at the bronze layer.', isCorrect: false },
      { id: 'c', text: 'Land raw JSON and retain it as JSON permanently across all medallion layers, including gold, since converting JSON to Delta tables strips the schema-on-read flexibility that upstream source applications depend upon.', isCorrect: false },
      { id: 'd', text: 'Reject the source payload and demand the upstream team switch to Avro or Parquet, because Databricks pipelines are not engineered to ingest JSON or CSV sources regardless of payload volume or update frequency.', isCorrect: false },
    ],
    explanation:
      "Avro/Parquet preserve explicit types and support schema evolution natively, but that doesn't mean JSON/CSV sources need pre-conversion - landing teams land the raw format untouched and let Auto Loader do the parse-and-type-cast step when writing to bronze, keeping the raw landing zone a faithful copy of what the source actually sent.",
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
      "What are the two key properties a well-designed landing zone should enforce, beyond just having a sensible directory structure?",
    options: [
      { id: 'a', text: 'Strict WORM immutability (write-once, block s3:DeleteObject) and a storage lifecycle policy (standard storage for a short window, colder/cheaper tiers after, auto-purge once bronze with Delta time travel covers the retention need) — these keep the landing zone auditable without it growing forever.', isCorrect: true },
      { id: 'b', text: 'Unrestricted overwrite and delete access for reading pipelines, ensuring the landing zone continuously reflects only the single most recent file version delivered by upstream producer systems.', isCorrect: false },
      { id: 'c', text: 'Immediate Parquet compression on file arrival followed by automatic raw file deletion, avoiding storage duplication across the raw landing bucket and downstream transformed Delta tables.', isCorrect: false },
      { id: 'd', text: 'Flat directory layouts with no source-system or entity segmentation, allowing a single unified Auto Loader stream to ingest all incoming files across all domains simultaneously.', isCorrect: false },
    ],
    explanation:
      "A landing zone's job is to be an immutable, auditable record of exactly what the source sent, structured per source/entity/version (e.g. landing/<source_system>/<entity>/v<version>/year=/month=/day=/), with WORM enforcement blocking deletes and a lifecycle policy that ages data out once Delta bronze's own time travel can cover the retention need.",
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
      "What's the difference between traditional Delta `PARTITIONED BY` and Databricks Liquid Clustering (`CLUSTER BY`) as a partitioning strategy?",
    options: [
      { id: 'a', text: '`PARTITIONED BY` fits only low-cardinality, coarse columns (like a `year-month` date column) on tables over roughly 1 TB, aiming for 1-10 GB per partition directory; Liquid Clustering works on both high- and low-cardinality keys (like `user_id` or `event_date`) and can re-cluster dynamically without a full data rewrite, making it the modern default.', isCorrect: true },
      { id: 'b', text: '`PARTITIONED BY` and `CLUSTER BY` represent identical physical directory structures, as Liquid Clustering is a pure syntactic alias introduced to improve DDL code readability without altering file organization on cloud storage.', isCorrect: false },
      { id: 'c', text: '`PARTITIONED BY` requires tables to exceed 1 TB prior to declaration, whereas `CLUSTER BY` applies exclusively to sub-terabyte datasets, establishing table size rather than query patterns as the sole governing rule.', isCorrect: false },
      { id: 'd', text: '`CLUSTER BY` operates exclusively on numeric data types, whereas `PARTITIONED BY` functions only on string columns, forcing layout selection to depend on column data types rather than cardinality or filtering patterns.', isCorrect: false },
    ],
    explanation:
      "Traditional PARTITIONED BY creates physical subdirectories, so it only makes sense for coarse, low-cardinality columns on large tables - a high-cardinality partition key produces the exact small-file explosion this topic covers as the Hive Time-Machine anti-pattern. Liquid Clustering avoids that constraint entirely by clustering data without hard directory partitions.",
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
      "What are the three strategies for keeping a Delta table in sync with a changing source system, and what's the basic tradeoff between them?",
    options: [
      { id: 'a', text: 'CDC (log-based, e.g. Debezium/Delta CDF) has the lowest source-system impact and write amplification since it only processes actual changes; periodic batch-diff (snapshot MERGE) costs more transient compute to calculate the diff but works when source logs are inaccessible; full reload (OVERWRITE) has the highest write amplification and is acceptable only for small lookup tables.', isCorrect: true },
      { id: 'b', text: 'CDC, batch-diff, and full reload produce identical write amplification and source database load, differing only in the specific DML statement executed during the final target table write operation.', isCorrect: false },
      { id: 'c', text: 'Full reload imposes the lowest source-system overhead by bypassing transaction log reads entirely, making CDC and batch-diff inferior choices whenever source systems tolerate periodic snapshot overwrites.', isCorrect: false },
      { id: 'd', text: 'Batch-diff applies exclusively to streaming ingestion sources, whereas CDC and full reload apply strictly to batch jobs, binding synchronization strategies to execution trigger modes rather than table size.', isCorrect: false },
    ],
    explanation:
      "CDC reads a change log directly, so it's cheapest and lowest-impact when available. Batch-diff computes a snapshot comparison instead, useful when logs aren't accessible but costlier to compute. Full reload is simplest but rewrites everything, so it's reserved for small tables where the write amplification doesn't matter.",
    tags: ['cdc-strategy'],
    concepts: ['ing-cdc-strategy'],
  },

  // ────────────────────────────────────────────────────────────────────
  // INTERMEDIATE (12) — 6 PREDICT_OUTPUT (deterministic trace of Hive
  // Time-Machine partition math / Naked Overwrites write amplification /
  // CDC-vs-full-reload row counts) + 6 scenario MCQs
  // ────────────────────────────────────────────────────────────────────
  {
    id: 'ing-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.INGESTION_ARCHITECTURE,
    course: Course.DATABRICKS,
    language: CodeLanguage.PYTHON,
    question:
      'This function models how many partition directories a table gets when partitioned by year/month/day/hour. Trace it and print the result.',
    code: `def partition_count(days, partitions_per_day):
    return days * partitions_per_day

# 90 days of data, partitioned down to the hour = 24 partitions per day
print(partition_count(90, 24))`,
    expectedOutput: '2160',
    explanation:
      'This models the setup for the Hive Time-Machine: partitioning by hour multiplies the partition count by 24x compared to partitioning by day alone, regardless of how much data the table actually holds.',
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
      'Same table, now partitioned by day only instead of by hour. Trace it and print the result.',
    code: `def partition_count(days, partitions_per_day):
    return days * partitions_per_day

# same 90 days, partitioned by day only
print(partition_count(90, 1))`,
    expectedOutput: '90',
    explanation:
      "The fix for the Hive Time-Machine: partitioning by day alone keeps the partition count proportional to how much data actually exists (one partition per day), instead of multiplying it by an arbitrary hourly grain the table's size doesn't justify.",
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
      'This function models the bytes written by a daily full `OVERWRITE` of a table, regardless of how much data actually changed. Trace it and print the result.',
    code: `def bytes_written_full_overwrite(table_size_gb):
    return table_size_gb

print(bytes_written_full_overwrite(500))`,
    expectedOutput: '500',
    explanation:
      'This is the Naked Overwrites mechanic: a full OVERWRITE rewrites the entire 500 GB table on every run, no matter how few rows actually changed since the last run.',
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
      'Same table, now fixed by scoping the write to only the partitions that actually changed. Trace it and print the result.',
    code: `def bytes_written_scoped_overwrite(table_size_gb, changed_pct):
    return round(table_size_gb * changed_pct, 1)

print(bytes_written_scoped_overwrite(500, 0.01))`,
    expectedOutput: '5.0',
    explanation:
      "The fix for Naked Overwrites: scoping the write to just the changed 1% of partitions (via replaceWhere or MERGE) writes 100x less data than a naked full overwrite of the whole 500 GB table.",
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
      'This function models how many rows a full-reload strategy processes on every run. Trace it and print the result.',
    code: `def rows_processed(total_rows, strategy):
    if strategy == "full_reload":
        return total_rows
    return None

print(rows_processed(10_000_000, "full_reload"))`,
    expectedOutput: '10000000',
    explanation:
      'Full reload reprocesses every row in the source table on every run, regardless of how many rows actually changed since the last run - this is why it only fits small tables.',
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
      'Same source, now using CDC instead of full reload. Trace it and print the result.',
    code: `def rows_processed(changed_rows, strategy):
    if strategy == "cdc":
        return changed_rows
    return None

print(rows_processed(15_000, "cdc"))`,
    expectedOutput: '15000',
    explanation:
      "CDC only processes the rows the source system's change log reports as modified - a small fraction of the 10,000,000-row table from the previous question - which is why it has the lowest source-system impact and write amplification of the three strategies.",
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
      'A fraud-detection model needs to score each transaction within 30 seconds of it happening, and transactions arrive continuously from a Kafka topic. What ingestion mode fits, and why?',
    options: [
      { id: 'a', text: "Continuous streaming (Trigger.ProcessingTime) — a 30-second SLA against a push-based Kafka source requires a continuously running cluster consuming the topic in near real time; a scheduled batch job, even a frequent one, adds startup latency and can't guarantee that tight a window.", isCorrect: true },
      { id: 'b', text: 'Scheduled batch with Trigger.AvailableNow running every 5 minutes — a 5-minute cadence is close enough to "continuous" for most fraud use cases, and batch is always preferred over streaming when the source is a message queue like Kafka.', isCorrect: false },
      { id: 'c', text: 'Neither — Kafka topics cannot be consumed directly by Databricks at all, so the transactions would need to first land as files in cloud storage before any ingestion strategy could apply.', isCorrect: false },
      { id: 'd', text: "Scheduled batch with Trigger.AvailableNow running once per day, since Auto Loader's cost-saving cluster shutdown behavior only applies to daily jobs and the SLA can be relaxed to next-day scoring for cost reasons.", isCorrect: false },
    ],
    explanation:
      "This is the canonical continuous-streaming signal from the decision framework: sub-minute SLA plus a push-based source (Kafka). A scheduled batch job, however frequent, can't consistently hit a 30-second window the way a continuously running stream can.",
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
      'A vendor drops a CSV export into an S3 bucket once a night, and the downstream report only needs to reflect that data by the next morning. What ingestion mode fits, and why?',
    options: [
      { id: 'a', text: "Scheduled incremental batch with Trigger.AvailableNow, run once nightly — a next-morning SLA against a file-drop source is exactly the case for provisioning a cluster, processing the backlogged file with exactly-once checkpoints, and shutting the cluster down, saving 80-90% of the compute cost a 24/7 stream would need.", isCorrect: true },
      { id: 'b', text: 'Continuous streaming, kept running 24/7 against the bucket — even though the SLA is loose, continuous streaming is always the safer default because it guarantees the data is available the instant it lands, at no meaningful extra cost.', isCorrect: false },
      { id: 'c', text: 'Neither batch nor streaming applies to file-drop sources — S3 bucket drops require a custom polling script outside of Databricks entirely, since Auto Loader only supports push-based sources like Kafka.', isCorrect: false },
      { id: 'd', text: "Continuous streaming, but only for the first ingestion run — after the initial load, all subsequent nightly drops should switch to a manual, non-Auto-Loader script since streaming checkpoints can't be reused across a batch/streaming transition.", isCorrect: false },
    ],
    explanation:
      "A 15-minute-or-looser SLA against a file-based landing source is the textbook case for Trigger.AvailableNow: it clears the backlog with exactly-once semantics and then shuts the cluster down, which is far cheaper than running a stream continuously for data that only needs to be fresh by morning.",
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
      "A source system starts sending a new field in its JSON payloads that the bronze schema doesn't know about yet. What should happen to that field if the bronze table has a rescued data column configured, versus if it doesn't?",
    options: [
      { id: 'a', text: "The new field is silently dropped without a rescued data column, and captured (typically as JSON) in a `_rescued_data` column with one — this is the exact failure mode a rescued data column is designed to prevent: unannounced upstream schema drift silently losing data instead of surfacing it for recovery.", isCorrect: true },
      { id: 'b', text: 'With a rescued data column, the new field is silently discarded exactly the same as without one — the rescued data column only ever captures type-cast failures, not genuinely new fields the schema has never seen before.', isCorrect: false },
      { id: 'c', text: 'Without a rescued data column, Auto Loader always fails the entire ingestion job the moment it sees an unrecognized field, so unannounced schema drift is loud and immediately visible rather than silent.', isCorrect: false },
      { id: 'd', text: 'A rescued data column only applies to CSV sources, not JSON — for a JSON payload the new field is always silently dropped regardless of whether a rescued data column is configured on the bronze table.', isCorrect: false },
    ],
    explanation:
      "This is the Blind Schema Blindspot failure mode from the research: ingesting raw JSON without a rescued data column means an unannounced new field from the source just vanishes with no error and no trace. Configuring `_rescued_data` turns that silent loss into a visible, recoverable column instead.",
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
      "A 50 GB orders table is queried both by a coarse `order_date` filter and, separately, by a high-cardinality `customer_id` lookup. Traditional `PARTITIONED BY` can only pick one column well. What does Liquid Clustering offer here that traditional partitioning can't?",
    options: [
      { id: 'a', text: "Liquid Clustering can cluster on both `order_date` and `customer_id` together, including the high-cardinality `customer_id`, without creating the directory explosion a `PARTITIONED BY customer_id` declaration would — and it can re-cluster later without a full table rewrite if the query pattern shifts.", isCorrect: true },
      { id: 'b', text: "Liquid Clustering can only be applied to `order_date`, not `customer_id`, since it shares the same low-cardinality-only restriction as traditional `PARTITIONED BY` — the only real difference between the two is the keyword used to declare it.", isCorrect: false },
      { id: 'c', text: 'Traditional `PARTITIONED BY` already handles this case fine at 50 GB, since the 1-10 GB per partition directory guideline only starts to matter once a table crosses the 1 TB threshold Liquid Clustering was built for.', isCorrect: false },
      { id: 'd', text: 'Liquid Clustering removes the need for any query filter at all — once a table is declared `CLUSTER BY`, every query against it runs at the same speed regardless of which columns are filtered on.', isCorrect: false },
    ],
    explanation:
      "Liquid Clustering's core advantage over PARTITIONED BY is that it works on high-cardinality keys like customer_id without the directory-explosion cost of a hard partition, and it can dynamically re-cluster later without rewriting the whole table if query patterns change.",
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
      "A legacy on-prem database has no accessible transaction log and no CDC tooling, but the pipeline still needs to detect which rows changed since the last run. What strategy fits, and what's the cost of using it?",
    options: [
      { id: 'a', text: "Periodic batch-diff (snapshot MERGE) — without an accessible change log, the pipeline has to pull a full snapshot and diff it against the previous snapshot to find changed rows; this costs more transient compute to calculate the diff than log-based CDC would, but it works when logs simply aren't available.", isCorrect: true },
      { id: 'b', text: "CDC via Delta CDF — Delta Change Data Feed can be pointed directly at any source database's internal storage, transaction log or not, so the lack of accessible logs on the legacy system doesn't actually block using CDC here.", isCorrect: false },
      { id: 'c', text: 'Full reload is the only option — since CDC requires an accessible transaction log, and batch-diff also requires an accessible transaction log to compute a diff, a legacy system with neither must fall back to a full OVERWRITE regardless of table size.', isCorrect: false },
      { id: 'd', text: "CDC via Debezium — Debezium is specifically designed to work without any access to a source database's transaction log, reconstructing changes purely from periodic full-table snapshots instead.", isCorrect: false },
    ],
    explanation:
      "Batch-diff is exactly the fallback for when CDC's prerequisite (an accessible change log) isn't available: it snapshots the source and diffs against the prior snapshot, at the cost of more transient compute than a log-based CDC read would need.",
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
      'A compliance team asks why the landing zone still has raw files from 6 months ago, when the equivalent bronze Delta table has 90 days of time travel history covering the same retention need. What landing zone practice addresses this?',
    options: [
      { id: 'a', text: "A storage lifecycle policy: standard storage for a short window, a colder/cheaper tier for a while longer, then auto-purge once the retention need is already covered by Delta bronze's own time travel — so the landing zone doesn't grow forever holding data the Delta layer already retains.", isCorrect: true },
      { id: 'b', text: "Landing zones should never have a lifecycle policy at all — since WORM immutability blocks deletes, the only compliant way to reduce storage is to migrate to a completely different cloud provider with lower per-GB pricing.", isCorrect: false },
      { id: 'c', text: "The compliance team is mistaken — a landing zone should always retain every file forever with no lifecycle policy, since WORM immutability and infinite retention are the same requirement and can't be separated.", isCorrect: false },
      { id: 'd', text: 'The fix is to disable WORM immutability so old landing-zone files can be manually deleted by an engineer on request, trading the audit guarantee for storage savings whenever compliance flags an old file.', isCorrect: false },
    ],
    explanation:
      "This is exactly the landing zone lifecycle pattern from the research: tiered storage that ages data out over a defined window, auto-purging once Delta bronze's own time travel already covers the retention requirement - keeping the landing zone from growing without bound while still staying auditable during its active window.",
    tags: ['landing-zone'],
    concepts: ['ing-landing-zone'],
  },

  // ────────────────────────────────────────────────────────────────────
  // ADVANCED (19) — 3 anti-patterns x 3 domain-transfer scenarios (9) +
  // 3 decision primitives x 3 domain-transfer scenarios (9) + 1
  // discrimination question
  // ────────────────────────────────────────────────────────────────────

  // Hive Time-Machine (x3)
  {
    id: 'ing-mcq-a1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.INGESTION_ARCHITECTURE,
    course: Course.DATABRICKS,
    question:
      'A 40 GB clickstream_events table is partitioned by `year/month/day/hour`. Over 18 months this produces over 13,000 partition directories, most holding files under 200 KB, and queries now regularly time out with metastore RPC errors. What\'s this anti-pattern called, and what\'s the fix?',
    options: [
      { id: 'a', text: 'The Hive Time-Machine — partitioning a table this small by hour creates far more partition directories than the data volume justifies, producing tiny files and overwhelming the metastore with RPC calls. The fix is a coarser partitioning grain (day, not hour) or switching to Liquid Clustering instead.', isCorrect: true },
      { id: 'b', text: 'This is expected behavior for any partitioned table regardless of size — metastore RPC errors at this file count are a fixed Databricks platform limit that has to be worked around by upgrading to a larger metastore instance, not by changing the partitioning scheme.', isCorrect: false },
      { id: 'c', text: 'A Liquid Clustering misconfiguration — the table should never have been declared with `CLUSTER BY` on an hourly timestamp, and switching to `PARTITIONED BY year, month, day, hour` is the correct fix for the RPC timeouts.', isCorrect: false },
      { id: 'd', text: 'A checkpoint corruption issue in Auto Loader — the fix is to delete and rebuild the streaming checkpoint, which will automatically consolidate the small partition files into larger ones on the next run.', isCorrect: false },
    ],
    explanation:
      'This is the named production failure mode: partitioning a small table (under 100 GB) by year/month/day/hour produces tens of thousands of tiny files and metastore RPC crashes. The fix is a coarser partition grain or Liquid Clustering, not a metastore hardware upgrade.',
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
      "An IoT platform's sensor_readings table is only 15 GB but was partitioned by `year/month/day/hour/device_region` at launch. It now has over 40,000 partitions, most under 100 KB, and simple date-range queries take minutes to plan. What's happening, and what's the fix?",
    options: [
      { id: 'a', text: "This is the Hive Time-Machine — stacking a fine-grained time partition with an additional `device_region` column multiplies the partition count far beyond what a 15 GB table needs, producing tiny files and slow query planning. The fix is to drop to a single coarse partition column (e.g. day) or move to Liquid Clustering on `event_date` and `device_region` together.", isCorrect: true },
      { id: 'b', text: 'This is a compute sizing problem, not a partitioning problem — the query planning is slow because the cluster is too small, and adding more worker nodes will fix the minutes-long planning time without any change to the partition columns.', isCorrect: false },
      { id: 'c', text: 'This is expected: any table partitioned by more than one column will always have slower query planning than a single-column partition, regardless of the partition columns\' cardinality or the total table size.', isCorrect: false },
      { id: 'd', text: "This is a Delta transaction log corruption issue — the fix is to run VACUUM with a 0-hour retention window to immediately purge the metadata backlog causing the slow planning.", isCorrect: false },
    ],
    explanation:
      'Stacking a fine time grain with an additional partition column compounds the Hive Time-Machine effect - the partition count multiplies by the cardinality of every partition column combined, not just the time grain alone.',
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
      'A support_tickets table (8 GB) is partitioned by `year/month/day/hour` "to make time-range queries fast." Ticket volume is only a few hundred rows per hour, so most hourly partition files are a few KB. What\'s the correct diagnosis and fix?',
    options: [
      { id: 'a', text: "The Hive Time-Machine — an 8 GB table with only a few hundred rows per hour doesn't generate enough data per partition to justify an hourly grain; the fix is to partition by day (or use Liquid Clustering on the ticket timestamp) so each partition holds a meaningful amount of data instead of a few KB.", isCorrect: true },
      { id: 'b', text: 'There is no problem here — "make time-range queries fast" is a valid justification for any partition grain, no matter how small the resulting files end up being, since query speed always outweighs file-count concerns.', isCorrect: false },
      { id: 'c', text: 'The issue is that support_tickets should not be a Delta table at all — tables under 10 GB should always be stored as a single Parquet file with no partitioning or clustering of any kind.', isCorrect: false },
      { id: 'd', text: "The issue is unrelated to partition grain — it's that the table lacks a Bloom filter index, and adding one would resolve the small-file problem without changing the partitioning scheme.", isCorrect: false },
    ],
    explanation:
      "Wanting fast time-range queries doesn't justify an arbitrarily fine partition grain - the grain still has to match the data volume. A few hundred rows per hour is nowhere near enough to fill a partition directory, so the 'faster queries' goal is better served by day-level partitioning or Liquid Clustering.",
    tags: ['hive-time-machine'],
    concepts: ['ing-hive-time-machine'],
  },

  // Naked Overwrites (x3)
  {
    id: 'ing-mcq-a4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.INGESTION_ARCHITECTURE,
    course: Course.DATABRICKS,
    question:
      "A nightly job runs `.mode(\"overwrite\").saveAsTable(\"subscription_billing\")` against a 600 GB table, even though only the current day's invoices (roughly 0.5% of rows) actually changed. What's this anti-pattern called, and what breaks besides the wasted compute?",
    options: [
      { id: 'a', text: 'Naked Overwrites — rewriting the full 600 GB table daily when only 0.5% changed causes high write amplification, invalidates any cached query plans/results against the table, and breaks Delta time travel retention by generating a full new version every single day instead of a small, scoped one.', isCorrect: true },
      { id: 'b', text: 'Nothing breaks beyond the extra compute cost — `.mode("overwrite")` is transactionally identical to a scoped `replaceWhere` write from Delta\'s perspective, so caches and time travel retention are unaffected either way.', isCorrect: false },
      { id: 'c', text: 'This is the Fan-Out Bug — the overwrite is duplicating each invoice row once per line item during the write, inflating the table\'s row count on every run regardless of how much data actually changed.', isCorrect: false },
      { id: 'd', text: "This is a checkpoint staleness issue specific to Structured Streaming — since the job uses `.mode(\"overwrite\")`, it must be a streaming write whose checkpoint file has fallen out of sync with the source, not a batch write pattern problem at all.", isCorrect: false },
    ],
    explanation:
      "This is the named anti-pattern: a full daily OVERWRITE on a 500 GB+ table causes high write amplification, invalidates caches, and breaks time travel retention by generating a full new table version every run - even when the actual change volume is tiny.",
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
      "An `inventory_snapshot` table (2 TB) is fully overwritten every hour by a job that recomputes stock levels for every warehouse, even though only a handful of warehouses had any stock movement that hour. What's the fix, framed in terms of Delta write options?",
    options: [
      { id: 'a', text: "Scope the write with `replaceWhere` (or a targeted `MERGE INTO`) filtered to just the warehouses with actual movement that hour, instead of a bare `.mode(\"overwrite\")` against the whole 2 TB table — this cuts write amplification down to roughly the fraction of warehouses that actually changed.", isCorrect: true },
      { id: 'b', text: 'Switch the write from `.mode("overwrite")` to `.mode("append")` — appending instead of overwriting eliminates write amplification entirely, since Delta only ever writes new files on append regardless of how large the table is.', isCorrect: false },
      { id: 'c', text: 'Reduce the job\'s schedule from hourly to daily — running the same full `.mode("overwrite")` less often reduces the total number of naked overwrites per day without addressing the write amplification of each individual run.', isCorrect: false },
      { id: 'd', text: "Add a `VACUUM` call immediately after each overwrite — vacuuming removes old data files after the write completes, but does nothing to reduce the amount of data written during the overwrite itself.", isCorrect: false },
    ],
    explanation:
      "replaceWhere (or a scoped MERGE) is the concrete fix for Naked Overwrites: it lets the write target only the partitions/rows that actually changed, instead of rewriting the entire table on every run regardless of how localized the change was.",
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
      "A team defends a nightly full overwrite of a 900 GB `employee_directory` table by saying \"it's simple and we've never had a correctness bug.\" What's the actual cost they're not accounting for, beyond raw compute time?",
    options: [
      { id: 'a', text: "Correctness isn't the axis Naked Overwrites breaks — the cost is write amplification (rewriting 900 GB nightly for what's likely a small daily change set), cache invalidation for downstream readers, and time travel retention filling up faster since every run creates a full new table version instead of a scoped one.", isCorrect: true },
      { id: 'b', text: "There isn't a hidden cost — if the job has never produced a correctness bug, a full overwrite is strictly equivalent to a scoped write in every respect that matters, including cost and time travel behavior.", isCorrect: false },
      { id: 'c', text: "The only real cost is storage duplication from `VACUUM` not running often enough — switching to a nightly `VACUUM RETAIN 0 HOURS` call would fully eliminate the downside of the full overwrite pattern.", isCorrect: false },
      { id: 'd', text: 'The hidden cost is that full overwrites silently skip schema enforcement, so a nightly `.mode("overwrite")` is actually more likely to introduce a correctness bug over time than a scoped `replaceWhere`/MERGE write would be.', isCorrect: false },
    ],
    explanation:
      "A full overwrite can be perfectly correct and still be an expensive, wasteful pattern - the cost shows up as write amplification, cache invalidation for downstream consumers, and time travel history filling up with full-table versions instead of small scoped ones, none of which 'no correctness bugs so far' addresses.",
    tags: ['naked-overwrites'],
    concepts: ['ing-naked-overwrites'],
  },

  // Directory Listing Ingestion Trap (x3)
  {
    id: 'ing-mcq-a7',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.INGESTION_ARCHITECTURE,
    course: Course.DATABRICKS,
    question:
      'An Auto Loader stream ingesting from an image-upload bucket with over 2 million files, running in default directory listing mode, now spends hours just listing the bucket before it processes a single new file. What\'s this anti-pattern called, and what\'s the fix?',
    options: [
      { id: 'a', text: "The Directory Listing Ingestion Trap — running Auto Loader in directory listing mode against a bucket with over 1 million files makes every trigger re-list the entire bucket via cloud storage APIs, which gets slower as the file count grows. The fix is to enable file notification mode (`cloudFiles.useNotifications=true`) so Auto Loader is told about new files instead of scanning for them.", isCorrect: true },
      { id: 'b', text: "This is a network bandwidth issue — the fix is to provision a larger cluster with more network throughput, since directory listing mode's speed is purely a function of available bandwidth, not file count.", isCorrect: false },
      { id: 'c', text: 'This is a Hive Time-Machine issue — the bucket should be partitioned by year/month/day/hour so Auto Loader only has to list a small subset of the bucket on each trigger instead of the whole thing.', isCorrect: false },
      { id: 'd', text: 'This is expected and unavoidable — Auto Loader has a hard architectural requirement to fully re-list every file in a source bucket on every single trigger, regardless of configuration, so the only fix is to split the bucket into multiple smaller buckets.', isCorrect: false },
    ],
    explanation:
      "This is the named anti-pattern from the research: directory listing mode does a full API-level bucket scan on every trigger, which becomes prohibitively slow past roughly a million files. File notification mode avoids the scan entirely by having cloud storage push new-file events instead.",
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
      'A clickstream JSON landing bucket accumulates roughly 500,000 new small event files a day and has never had an old-file cleanup process. After 8 months, Auto Loader (directory listing mode) triggers are taking 40+ minutes just to discover what changed. What structural fix addresses this, beyond just switching trigger mode?',
    options: [
      { id: 'a', text: 'Switch Auto Loader to file notification mode (`cloudFiles.useNotifications=true`) so new files are discovered via cloud storage events instead of a full bucket listing, and pair it with a landing zone lifecycle policy so the bucket doesn\'t keep accumulating files Auto Loader has already processed and no longer needs to see.', isCorrect: true },
      { id: 'b', text: "Increase the trigger interval to run less often, e.g. once a day instead of every few minutes — running directory listing mode less frequently reduces its per-trigger listing cost proportionally, resolving the slowdown without any configuration change.", isCorrect: false },
      { id: 'c', text: 'Nothing structural is needed — once the bucket exceeds roughly 1 million files, Auto Loader automatically switches from directory listing mode to file notification mode internally, so the slowdown will resolve itself over the next few months.', isCorrect: false },
      { id: 'd', text: 'Merge all 500,000 daily files into a single large JSON file at the source, before they land in the bucket — Auto Loader\'s listing cost is driven entirely by total bytes in the bucket, not file count, so consolidating files has no effect on listing speed.', isCorrect: false },
    ],
    explanation:
      "File notification mode fixes the per-trigger listing cost, but it doesn't address why the bucket keeps growing - pairing it with a landing zone lifecycle policy (already-ingested files aging out) keeps the bucket from silently becoming a multi-million-file liability again.",
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
      "A team migrating an IoT telemetry pipeline to Databricks defaults every new Auto Loader stream to directory listing mode \"because it's simpler to set up and doesn't need extra cloud permissions.\" One telemetry bucket has 4 million files. What's the risk, and when is directory listing mode actually the right call?",
    options: [
      { id: 'a', text: 'The risk is the Directory Listing Ingestion Trap on the 4-million-file bucket specifically — the fix isn\'t to abandon directory listing mode everywhere, just on buckets past roughly 1 million files, where it should switch to file notification mode; smaller buckets can keep the simpler directory listing setup without hitting the same slowdown.', isCorrect: true },
      { id: 'b', text: "There's no real risk — directory listing mode's per-trigger cost is fixed regardless of bucket file count, so defaulting to it everywhere for setup simplicity is a reasonable, low-risk engineering tradeoff at any scale.", isCorrect: false },
      { id: 'c', text: "File notification mode requires no additional cloud permissions beyond directory listing mode, so there's never a legitimate reason to default to directory listing mode on any bucket, regardless of file count.", isCorrect: false },
      { id: 'd', text: 'The risk only applies to JSON sources — since telemetry data typically lands as JSON, this bucket would hit the trap even at a much smaller file count than a Parquet-based bucket would, making file count irrelevant to the actual threshold.', isCorrect: false },
    ],
    explanation:
      "Directory listing mode's simplicity is a legitimate reason to default to it on smaller buckets - the trap only bites once a bucket's file count gets large enough (roughly past a million files) that a full listing scan becomes slow on every trigger, which is exactly the threshold to switch to file notification mode instead.",
    tags: ['directory-listing-trap'],
    concepts: ['ing-directory-listing-trap'],
  },

  // Batch vs streaming decision (x3, complex)
  {
    id: 'ing-mcq-a10',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.INGESTION_ARCHITECTURE,
    course: Course.DATABRICKS,
    question:
      "A payments platform needs to detect duplicate/fraudulent charges within 2 minutes of authorization, sourcing from a Kafka topic that also feeds a nightly marketing-analytics job reading from the same topic's compacted log via a scheduled batch pull. Should both consumers use the same ingestion mode?",
    options: [
      { id: 'a', text: 'No — the fraud pipeline needs continuous streaming to hit its 2-minute SLA against the push-based Kafka source, while the marketing job can run scheduled batch (Trigger.AvailableNow) since its SLA is next-day; the same Kafka topic can be read by both a continuous stream and a periodic batch job independently.', isCorrect: true },
      { id: 'b', text: "Yes — since both consumers read from the same underlying Kafka topic, they must use the same ingestion mode, or Kafka's consumer group protocol will silently drop messages for whichever consumer is running the other mode.", isCorrect: false },
      { id: 'c', text: "No, but for the opposite reason — the marketing job should use continuous streaming since it's reading from Kafka, and the fraud job should use scheduled batch since fraud detection doesn't actually require freshness, only accuracy.", isCorrect: false },
      { id: 'd', text: "Yes — Kafka topics can only be consumed by one job at a time regardless of ingestion mode, so the marketing job and fraud job would need to be merged into a single pipeline with one shared SLA.", isCorrect: false },
    ],
    explanation:
      "Ingestion mode is a per-consumer SLA decision, not a property of the source. The same Kafka topic can feed a continuous stream for the tight-SLA fraud use case and a separate scheduled batch pull for the loose-SLA marketing use case - Kafka supports multiple independent consumers reading the same topic at different cadences.",
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
      'A logistics company runs a continuous streaming job ingesting GPS pings for live delivery-tracking, at a steady cost of a small always-on cluster. An engineer proposes switching it to Trigger.AvailableNow running every 2 minutes to save cost. What\'s the actual tradeoff of that switch?',
    options: [
      { id: 'a', text: "It trades end-to-end freshness for cost: a 2-minute Trigger.AvailableNow job pays cluster startup/shutdown overhead on every run and delivers pings in up-to-2-minute-old batches instead of near-continuous updates — acceptable if live-tracking's actual UX tolerance is a couple minutes of staleness, not acceptable if it needs to look truly real-time.", isCorrect: true },
      { id: 'b', text: 'There is no tradeoff — Trigger.AvailableNow running every 2 minutes is functionally identical to continuous streaming in both latency and cost, so the switch is a strict improvement with no downside.', isCorrect: false },
      { id: 'c', text: "It only affects cost, never latency — Trigger.AvailableNow, regardless of how often it's scheduled, always delivers data with the exact same end-to-end latency as continuous streaming, since both use the same underlying Structured Streaming engine.", isCorrect: false },
      { id: 'd', text: "It's not a valid comparison — Trigger.AvailableNow can only be used with file-based landing sources, never with a live GPS ping stream, so this switch isn't technically possible regardless of the cost/latency tradeoff.", isCorrect: false },
    ],
    explanation:
      "The switch is a real tradeoff, not a free win: frequent Trigger.AvailableNow runs still pay per-run cluster startup overhead and introduce up-to-the-interval staleness, so whether it's worth the cost savings depends entirely on how tight the live-tracking UX's actual freshness requirement is.",
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
      'A retailer\'s inventory-sync pipeline reads from an SFTP drop that arrives at unpredictable times (sometimes 6am, sometimes 11am) but is only needed for that afternoon\'s replenishment run. A junior engineer sets it up as continuous streaming "to be safe." What\'s wrong with that choice, and what fits better?',
    options: [
      { id: 'a', text: "Continuous streaming here runs a cluster 24/7 to watch for a file that only shows up once a day at an unpredictable time, which is expensive for a loose afternoon SLA; scheduled batch with Trigger.AvailableNow, checked periodically (e.g. hourly), fits better — it clears the backlog once the file lands and shuts down, without needing to guess the exact arrival time.", isCorrect: true },
      { id: 'b', text: "Nothing is wrong — continuous streaming is always the safest default for any source with unpredictable arrival timing, regardless of how loose the downstream SLA actually is.", isCorrect: false },
      { id: 'c', text: 'The fix is to move the SFTP drop to Kafka first, then use continuous streaming against the Kafka topic — continuous streaming isn\'t compatible with SFTP as a source at all, regardless of arrival timing.', isCorrect: false },
      { id: 'd', text: 'The unpredictable arrival time makes this source fundamentally incompatible with any scheduled trigger — a human has to manually kick off the job once the SFTP file is confirmed to have landed, regardless of SLA looseness.', isCorrect: false },
    ],
    explanation:
      "Unpredictable arrival timing doesn't force continuous streaming - a periodic Trigger.AvailableNow check (hourly, say) picks up the file whenever it lands without paying for a cluster to sit idle most of the day, which fits the loose afternoon SLA far better than 24/7 streaming.",
    tags: ['batch-vs-streaming'],
    concepts: ['ing-batch-vs-streaming'],
  },

  // Partitioning strategy (x3, complex)
  {
    id: 'ing-mcq-a13',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.INGESTION_ARCHITECTURE,
    course: Course.DATABRICKS,
    question:
      'A 3 TB events table is currently `PARTITIONED BY event_date`, and most queries filter by both `event_date` and a high-cardinality `session_id`. Query planners regularly scan far more files than necessary because `session_id` isn\'t part of the physical layout. What migration addresses this without reintroducing a Hive Time-Machine risk?',
    options: [
      { id: 'a', text: "Migrate from `PARTITIONED BY event_date` to Liquid Clustering on `(event_date, session_id)` — Liquid Clustering handles the high-cardinality `session_id` key without the directory-explosion cost that adding it as a second `PARTITIONED BY` level would cause (which would reproduce the Hive Time-Machine at 3 TB scale), while still keeping `event_date` locality for date-range queries.", isCorrect: true },
      { id: 'b', text: 'Add `session_id` as a second level of `PARTITIONED BY` (`PARTITIONED BY event_date, session_id`) — stacking a second, high-cardinality partition column onto an existing date partition is the standard fix for this exact query pattern.', isCorrect: false },
      { id: 'c', text: 'Drop `event_date` entirely and switch to `PARTITIONED BY session_id` alone, since session_id is the more selective filter and should take priority as the sole physical partition column.', isCorrect: false },
      { id: 'd', text: "Leave the physical partitioning as `event_date` only, and add a Bloom filter index on `session_id` instead — Bloom filters, not partition columns, are the correct mechanism for improving high-cardinality-column selectivity within an existing date partition.", isCorrect: false },
    ],
    explanation:
      "Adding a high-cardinality column as a second PARTITIONED BY level is exactly how a Hive Time-Machine gets reproduced at scale - the directory count multiplies by session_id's cardinality. Liquid Clustering is designed for precisely this case: clustering on a combination of coarse and high-cardinality keys without a physical directory explosion.",
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
      "A 400 GB `ad_spend` table is currently unpartitioned and queried almost exclusively by a coarse `campaign_month` filter, with query planning time growing noticeably as the table grows. Is Liquid Clustering or traditional `PARTITIONED BY` the better fit here, and why?",
    options: [
      { id: 'a', text: "Traditional `PARTITIONED BY campaign_month` fits well here: the filter column is low-cardinality, coarse, and matches the table's dominant query pattern, and at 400 GB the table is large enough that partition-pruning on a well-chosen coarse column gives a real planning-time benefit without a small-file risk.", isCorrect: true },
      { id: 'b', text: 'Liquid Clustering is strictly required here — traditional `PARTITIONED BY` is deprecated and Databricks no longer recommends it for any table, regardless of query pattern or cardinality.', isCorrect: false },
      { id: 'c', text: "Neither fits — a table queried almost exclusively by one filter column should not be partitioned or clustered at all, since any physical layout tuned for one query pattern will always slow down every other kind of query against the table.", isCorrect: false },
      { id: 'd', text: 'Liquid Clustering is required specifically because the table exceeds 100 GB — the 1 TB threshold from the traditional `PARTITIONED BY` guideline is a hard cutoff below which Liquid Clustering must always be used instead.', isCorrect: false },
    ],
    explanation:
      "This is the case where traditional PARTITIONED BY is still the right tool: a coarse, low-cardinality column that matches the dominant query pattern, on a table large enough to benefit from partition pruning. Liquid Clustering is the better default for high-cardinality keys or evolving query patterns, not a universal replacement.",
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
      "A product_events table was originally clustered by `event_date` via Liquid Clustering. Six months later, the dominant query pattern shifts to filtering by `product_id` instead. What does adapting to that shift require under Liquid Clustering versus traditional `PARTITIONED BY`?",
    options: [
      { id: 'a', text: "Liquid Clustering can re-cluster dynamically to the new key (`product_id`) without a full data rewrite, as new writes and background optimization gradually reorganize the data; traditional `PARTITIONED BY` would require physically rewriting the table into new partition directories to change the partition column, since the column is baked into the file paths themselves.", isCorrect: true },
      { id: 'b', text: "Under both Liquid Clustering and traditional `PARTITIONED BY`, changing the clustering/partition key always requires a full rewrite of the table's data files — there's no difference in migration cost between the two approaches.", isCorrect: false },
      { id: 'c', text: "Neither approach can adapt to a query pattern shift after the table is created — the table would need to be dropped and recreated from source data with the new key regardless of whether it used Liquid Clustering or `PARTITIONED BY`.", isCorrect: false },
      { id: 'd', text: 'Traditional `PARTITIONED BY` handles this shift more gracefully than Liquid Clustering, since partition columns can be added or removed via a lightweight `ALTER TABLE` metadata-only operation, while Liquid Clustering keys are immutable once set at table creation.', isCorrect: false },
    ],
    explanation:
      "This is exactly Liquid Clustering's advantage over traditional partitioning: because the clustering key isn't baked into physical directory paths, it can adapt to a new dominant query pattern without a full table rewrite - traditional PARTITIONED BY has the partition column physically encoded in file paths, so changing it means rewriting the data.",
    tags: ['partitioning-strategy'],
    concepts: ['ing-partitioning-strategy'],
  },

  // CDC strategy (x3, complex)
  {
    id: 'ing-mcq-a16',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.INGESTION_ARCHITECTURE,
    course: Course.DATABRICKS,
    question:
      'A company runs Postgres with logical replication already enabled for another use case, and also has a 6 GB `country_codes` lookup table that changes maybe twice a year. Should both tables use the same sync strategy?',
    options: [
      { id: 'a', text: "No — even though CDC is available (logical replication is already enabled), the transactional tables should use CDC (e.g. Debezium reading the replication slot) since it has the lowest source impact and best freshness, while the tiny, rarely-changing `country_codes` table is simplest to handle with a full reload, since the write amplification of overwriting 6 GB twice a year is negligible.", isCorrect: true },
      { id: 'b', text: "Yes — since CDC infrastructure already exists for the transactional tables, every table in the same Postgres instance, including `country_codes`, must also use CDC, because running two different sync strategies against one database is not supported.", isCorrect: false },
      { id: 'c', text: "No, but for the opposite reason — `country_codes` should use CDC since it's small and cheap to keep continuously in sync, while the larger transactional tables should use full reload since CDC's infrastructure overhead isn't worth it for high-volume tables.", isCorrect: false },
      { id: 'd', text: 'Yes — full reload should be used for every table regardless of size or change frequency once logical replication is enabled, since CDC and full reload cannot coexist as strategies within a single source database.', isCorrect: false },
    ],
    explanation:
      "Sync strategy is chosen per-table based on size, change frequency, and log accessibility - not dictated globally by what's enabled on the source database. A 6 GB table that changes twice a year gets negligible benefit from CDC's complexity; a high-volume transactional table benefits a lot from it, and the two coexist fine against the same source.",
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
      'A 2 TB `orders` table currently uses nightly full reload because "it\'s always worked." The source database exposes a fully accessible transaction log and Delta CDF is already used successfully elsewhere in the org. What\'s the case for migrating this table off full reload, and to what?',
    options: [
      { id: 'a', text: 'Migrate to CDC (via the accessible transaction log, using the existing Delta CDF pattern) — at 2 TB, nightly full reload has meaningfully high write amplification for what is very likely a small daily change set, and CDC is both available (log-accessible source) and already proven inside the org, making it the strategy that best fits the table\'s actual change profile.', isCorrect: true },
      { id: 'b', text: 'There isn\'t a strong case to migrate — "it\'s always worked" is sufficient justification to keep full reload indefinitely on any table, regardless of size or whether a lower-cost CDC path is available.', isCorrect: false },
      { id: 'c', text: "Migrate to batch-diff (snapshot MERGE) instead of CDC, since batch-diff is always the safer intermediate step before adopting full CDC, even when the source's transaction log is already accessible and CDC infrastructure already exists elsewhere in the org.", isCorrect: false },
      { id: 'd', text: "There's no meaningful difference between full reload and CDC once a table exceeds 1 TB — both approaches converge to the same write amplification and source-system load at that scale, so the migration wouldn't change anything measurable.", isCorrect: false },
    ],
    explanation:
      "Full reload's justification is 'it's cheap on a small table' - at 2 TB with an accessible log and proven CDC tooling already in the org, the cost of continuing full reload (write amplification on a 2 TB rewrite nightly) outweighs whatever simplicity 'it's always worked' is buying.",
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
      "A SaaS vendor's API only exposes a full-table export endpoint (no changed-since parameter, no webhook, no log access) for a 4 GB `subscription_plans` table. An engineer wants to build CDC tooling against it anyway \"for consistency with the rest of the pipeline.\" What's the right call?",
    options: [
      { id: 'a', text: "Full reload is the right call here — CDC and batch-diff both require some way to detect what changed (a log, a changed-since parameter, or comparable snapshots), and a full-table-export-only API with no such mechanism and a small (4 GB) table doesn't justify building change-detection infrastructure the source can't actually support well.", isCorrect: true },
      { id: 'b', text: "Batch-diff is the right call — even though the API offers no changed-since parameter, batch-diff is defined as requiring a full export at each interval anyway, so it's functionally identical to what this API already provides and should be used instead of full reload for consistency.", isCorrect: false },
      { id: 'c', text: "CDC is achievable here by polling the full-table-export endpoint every few seconds and diffing responses in memory to reconstruct a change log, which counts as genuine log-based CDC once implemented.", isCorrect: false },
      { id: 'd', text: "Consistency with the rest of the pipeline should win regardless of API capability — every source in the pipeline should be forced onto the same sync strategy even if that means building fragile workarounds against a source that doesn't support it.", isCorrect: false },
    ],
    explanation:
      "'Consistency for its own sake' isn't a reason to build CDC tooling a source can't genuinely support - without log access or a changed-since parameter, there's no real change-detection mechanism to build CDC on top of, and at 4 GB the write amplification of a full reload is a non-issue anyway.",
    tags: ['cdc-strategy'],
    concepts: ['ing-cdc-strategy'],
  },

  // Discrimination
  {
    id: 'ing-mcq-disc1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.INGESTION_ARCHITECTURE,
    course: Course.DATABRICKS,
    question:
      "Both the Hive Time-Machine and the Directory Listing Ingestion Trap present as \"too many small files causing slowness,\" but they're different failure modes. What's the concrete difference between the two, in terms of WHERE and WHEN the cost is paid?",
    options: [
      { id: 'a', text: "The Hive Time-Machine is a write-time/layout problem: an over-fine partition grain physically creates too many tiny files in the table itself, which then makes every future query slow. The Directory Listing Ingestion Trap is a read-time/discovery problem: Auto Loader re-scans an entire landing bucket via cloud storage list APIs on every trigger, which gets slow purely because of file count in the source bucket, independent of how the destination Delta table is laid out.", isCorrect: true },
      { id: 'b', text: 'There\'s no real difference — both names describe the exact same root cause (too many files in one location), just discovered in two different contexts (a Delta table\'s partitions versus a cloud storage bucket) and given two different names for historical reasons.', isCorrect: false },
      { id: 'c', text: 'The Hive Time-Machine only happens with Liquid Clustering, and the Directory Listing Ingestion Trap only happens with traditional `PARTITIONED BY` — the distinguishing factor is which partitioning mechanism the destination table uses, not anything about the source bucket.', isCorrect: false },
      { id: 'd', text: 'The Hive Time-Machine is a landing-zone issue and the Directory Listing Ingestion Trap is a bronze-table issue — the distinguishing factor is which medallion layer the small-file problem originates in, not the write-time-versus-read-time distinction.', isCorrect: false },
    ],
    explanation:
      "The practical test: is the slowness caused by how the Delta table's own partition/file layout was chosen (Hive Time-Machine, a write-time decision), or by Auto Loader re-scanning a source bucket's file listing on every trigger regardless of the destination table's layout (Directory Listing Ingestion Trap, a read-time discovery cost)? Fixing one doesn't fix the other.",
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
    language: CodeLanguage.PYTHON,
    question:
      "A 20 GB `page_views` table is currently created with `PARTITIONED BY (year, month, day, hour)`, producing tens of thousands of tiny partition files (the Hive Time-Machine). Write the DDL/write logic that instead partitions the table by day only, which matches the table's actual data volume.",
    starterCode: `# page_views_df has columns: view_id, url, year, month, day, hour, ...

page_views_df.write \\
    .format("delta") \\
    .partitionBy("year", "month", "day", "hour") \\
    .saveAsTable("page_views")`,
    solution: `page_views_df.write \\
    .format("delta") \\
    .partitionBy("year", "month", "day") \\
    .saveAsTable("page_views")
# OR
page_views_df.write \\
    .format("delta") \\
    .partitionBy("day") \\
    .saveAsTable("page_views")`,
    testCases: [
      {
        input: '',
        expectedOutput:
          'page_views_df.write \\\n    .format("delta") \\\n    .partitionBy("year", "month", "day") \\\n    .saveAsTable("page_views")',
        description:
          'Writes page_views as Delta partitioned down to day granularity only (drops the "hour" level), so the starter\'s four-level partitionBy including "hour" fails.',
      },
    ],
    explanation: 'Dropping the hourly partition level brings the partition count back in line with what a 20 GB table needs, fixing the Hive Time-Machine.',
    tieredHints: {
      apiSignature: 'dfWriter.partitionBy(*cols)',
      skeleton: `page_views_df.write \\\n    .format("____") \\\n    .____("year", "month", "day") \\\n    .____("page_views")`,
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
    question:
      "A nightly job currently does a naked full `.mode(\"overwrite\")` of a 400 GB `warehouse_inventory` table (partitioned by `warehouse_id`), even though `updated_df` only contains rows for `warehouse_id = 'WH-42'`. Rewrite the write so it only overwrites the `WH-42` partition, leaving every other warehouse's data untouched.",
    starterCode: `# updated_df: recomputed rows for warehouse_id = 'WH-42' only

updated_df.write \\
    .format("delta") \\
    .mode("overwrite") \\
    .saveAsTable("warehouse_inventory")`,
    solution: `updated_df.write \\
    .format("delta") \\
    .mode("overwrite") \\
    .option("replaceWhere", "warehouse_id = 'WH-42'") \\
    .saveAsTable("warehouse_inventory")`,
    testCases: [
      {
        input: '',
        expectedOutput:
          'updated_df.write \\\n    .format("delta") \\\n    .mode("overwrite") \\\n    .option("replaceWhere", "warehouse_id = \'WH-42\'") \\\n    .saveAsTable("warehouse_inventory")',
        description:
          'Overwrites warehouse_inventory scoped to just warehouse_id = \'WH-42\' via mode overwrite plus a replaceWhere option, so the starter\'s naked full overwrite (no replaceWhere) fails.',
      },
    ],
    explanation: 'replaceWhere scopes the overwrite to just the matching partition, avoiding the Naked Overwrites write amplification of rewriting all 400 GB.',
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
      'This snippet switches an Auto Loader stream on a >1M-file bucket from slow directory listing mode to file notification mode. Order the lines so the stream is configured with `cloudFiles.useNotifications` set before the stream is started.',
    correctOrder: [
      'reader = spark.readStream.format("cloudFiles")',
      'reader = reader.option("cloudFiles.format", "json")',
      'reader = reader.option("cloudFiles.useNotifications", "true")',
      'stream = reader.load("s3://landing/uploads/")',
    ],
    distractorLines: [
      'stream = spark.readStream.format("cloudFiles").load("s3://landing/uploads/")',
      'reader = reader.option("cloudFiles.useNotifications", "false")',
    ],
    solution: `reader = spark.readStream.format("cloudFiles")\nreader = reader.option("cloudFiles.format", "json")\nreader = reader.option("cloudFiles.useNotifications", "true")\nstream = reader.load("s3://landing/uploads/")`,
    explanation: 'Setting cloudFiles.useNotifications=true before the stream loads switches Auto Loader from a full bucket listing scan to cloud storage event notifications, avoiding the Directory Listing Ingestion Trap.',
    tags: ['directory-listing-trap'],
    concepts: ['ing-directory-listing-trap'],
  },
];
