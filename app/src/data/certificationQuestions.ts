import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  CodeLanguage,
} from '../types';

/**
 * Certification-focused questions covering exam gaps:
 * - Structured Streaming & Auto Loader
 * - Delta Live Tables
 * - Databricks Workflows / Jobs
 * - Medallion Architecture
 * - Change Data Capture
 * - Data Governance (GRANT/REVOKE)
 * - Repos / Git / Cluster config
 */

export const certificationQuestions: Question[] = [

  // =====================================================================
  // STRUCTURED STREAMING (20 questions)
  // =====================================================================

  {
    id: 'streaming-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.STRUCTURED_STREAMING,
    question: 'What is Structured Streaming in Apache Spark?',
    options: [
      { id: 'a', text: 'A stream processing engine built on the Spark SQL engine that treats streaming data as an unbounded table', isCorrect: true },
      { id: 'b', text: 'A tool for compressing large datasets', isCorrect: false },
      { id: 'c', text: 'A method for batch processing only', isCorrect: false },
      { id: 'd', text: 'A database management system', isCorrect: false },
    ],
    explanation: 'Structured Streaming treats a live data stream as an unbounded table that is continuously appended. You express streaming computations the same way as batch computations on static data.',
    tags: ['streaming', 'fundamentals'],
    concepts: ['stream-readstream-writestream', 'dbx-architecture'],
  },

  {
    id: 'streaming-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.STRUCTURED_STREAMING,
    question: 'Which three output modes are available in Structured Streaming?',
    options: [
      { id: 'a', text: 'Insert, Replace, Delete', isCorrect: false },
      { id: 'b', text: 'Append, Complete, Update', isCorrect: true },
      { id: 'c', text: 'Read, Write, Execute', isCorrect: false },
      { id: 'd', text: 'Start, Stop, Restart', isCorrect: false },
    ],
    explanation: 'Append mode outputs only new rows. Complete mode outputs the entire updated result table. Update mode outputs only changed rows since the last trigger.',
    tags: ['streaming', 'output-modes'],
    concepts: ['stream-readstream-writestream', 'stream-output-modes'],
  },

  {
    id: 'streaming-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.STRUCTURED_STREAMING,
    language: CodeLanguage.PYTHON,
    question: 'Read a stream from a Delta table called "events" using Spark readStream.',
    starterCode: `# Read a Delta table as a stream\nstream_df = spark.`,
    testCases: [
      {
        input: 'Delta table "events"',
        expectedOutput: 'spark.readStream.format("delta").table("events")',
        description: 'Should read Delta table as stream',
      },
    ],
    solution: `stream_df = spark.readStream.format("delta").table("events")`,
    explanation: 'Use spark.readStream to create a streaming DataFrame. For Delta tables, use .format("delta").table("tableName") or .load("/path/to/delta").',
    hints: ['Use spark.readStream', 'Set format to "delta"', 'Use .table() for named tables'],
    tags: ['streaming', 'delta', 'readStream'],
    concepts: ['stream-readstream-writestream', 'delta-acid'],
  },

  {
    id: 'streaming-4',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.STRUCTURED_STREAMING,
    language: CodeLanguage.PYTHON,
    question: 'Write a streaming DataFrame "stream_df" to a Delta table called "output_events" using append mode with a checkpoint location of "/checkpoints/events".',
    starterCode: `# Write stream to Delta table\nquery = stream_df.writeStream`,
    testCases: [
      {
        input: 'streaming DataFrame',
        expectedOutput: 'writeStream.format("delta").outputMode("append").option("checkpointLocation", "/checkpoints/events").toTable("output_events")',
        description: 'Should write stream to Delta with checkpoint',
      },
    ],
    solution: `query = stream_df.writeStream\n  .format("delta")\n  .outputMode("append")\n  .option("checkpointLocation", "/checkpoints/events")\n  .toTable("output_events")`,
    explanation: 'writeStream writes a streaming DataFrame. Use .toTable("name") to write to a named table (not .table() which is for reading). checkpointLocation is required for fault tolerance — it stores progress so the stream can recover from failures.',
    hints: ['Use .writeStream with .toTable("name") to write to a table', 'Set outputMode to "append"', 'Always set checkpointLocation'],
    tags: ['streaming', 'writeStream', 'checkpoint'],
    concepts: ['stream-readstream-writestream', 'stream-checkpoint'],
  },

  {
    id: 'streaming-5',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.STRUCTURED_STREAMING,
    question: 'What is the purpose of a checkpoint in Structured Streaming?',
    options: [
      { id: 'a', text: 'To compress data before writing', isCorrect: false },
      { id: 'b', text: 'To schedule streaming jobs', isCorrect: false },
      { id: 'c', text: 'To store progress and state information for fault-tolerant stream recovery', isCorrect: true },
      { id: 'd', text: 'To limit the amount of data processed', isCorrect: false },
    ],
    explanation: 'Checkpoints track which data has been processed and store intermediate state. If a stream fails, it can restart from the checkpoint instead of reprocessing everything.',
    tags: ['streaming', 'checkpoint', 'fault-tolerance'],
    concepts: ['stream-readstream-writestream', 'stream-checkpoint'],
  },

  {
    id: 'streaming-6',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.STRUCTURED_STREAMING,
    question: 'In Spark Structured Streaming, which trigger type processes the next micro-batch immediately after the previous one completes, with no wait time between batches?',
    options: [
      { id: 'a', text: 'Once trigger — processes all available data once, then stops', isCorrect: false },
      { id: 'b', text: 'Continuous trigger — true low-latency row-by-row processing (experimental)', isCorrect: false },
      { id: 'c', text: 'Fixed interval trigger (e.g. processingTime="30 seconds") — waits for the interval between batches', isCorrect: false },
      { id: 'd', text: 'Default trigger (processingTime="0 seconds") — no delay between batches, starts the next one immediately', isCorrect: true },
    ],
    explanation: 'When no trigger is specified, Spark defaults to processingTime="0 seconds" — it starts the next micro-batch immediately after the previous one finishes with zero wait time. This is NOT the same as a fixed interval like "500 milliseconds" (which is sometimes shown in tutorials as an example, but is not the default). The "Once" trigger processes all data and stops. "Continuous" is experimental row-by-row processing. A fixed interval like "30 seconds" adds a deliberate pause between batches.',
    tags: ['streaming', 'trigger'],
    concepts: ['stream-readstream-writestream', 'stream-triggers'],
  },

  {
    id: 'streaming-7',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.STRUCTURED_STREAMING,
    language: CodeLanguage.PYTHON,
    question: 'Given a streaming DataFrame "stream_df", configure the writeStream to trigger every 30 seconds using processingTime, writing to Delta table "output" with checkpoint at "/checkpoints/data".',
    starterCode: ``,
    testCases: [
      {
        input: 'streaming query',
        expectedOutput: '.trigger(processingTime="30 seconds")',
        description: 'Should set 30 second trigger',
      },
    ],
    solution: `query = stream_df.writeStream\n  .format("delta")\n  .outputMode("append")\n  .option("checkpointLocation", "/checkpoints/data")\n  .trigger(processingTime="30 seconds")\n  .toTable("output")`,
    explanation: 'processingTime trigger runs micro-batches at the specified interval. If processing takes longer than the interval, the next batch starts immediately after the previous one finishes.',
    hints: ['Use trigger(processingTime="...")', 'Specify time as a string like "30 seconds"'],
    tags: ['streaming', 'trigger', 'processingTime'],
    concepts: ['stream-readstream-writestream', 'stream-triggers'],
  },

  {
    id: 'streaming-8',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.STRUCTURED_STREAMING,
    language: CodeLanguage.PYTHON,
    question: 'Given a streaming DataFrame "stream_df", configure the writeStream to process all available data and then stop using Trigger.AvailableNow, writing to Delta table "output" with checkpoint at "/checkpoints/data".',
    starterCode: `# Process all available data once\nquery = stream_df.writeStream\n  .format("delta")\n  .outputMode("append")\n  .option("checkpointLocation", "/checkpoints/data")\n  .trigger(`,
    testCases: [
      {
        input: 'streaming query',
        expectedOutput: '.trigger(availableNow=True)',
        description: 'Should use availableNow trigger',
      },
    ],
    solution: `query = stream_df.writeStream\n  .format("delta")\n  .outputMode("append")\n  .option("checkpointLocation", "/checkpoints/data")\n  .trigger(availableNow=True)\n  .toTable("output")`,
    explanation: 'Trigger.AvailableNow processes all available data in multiple batches then stops. Unlike Trigger.Once (deprecated), it can process data in multiple micro-batches for better scalability.',
    hints: ['Use trigger(availableNow=True)', 'This replaces the deprecated Trigger.Once'],
    tags: ['streaming', 'trigger', 'availableNow'],
    concepts: ['stream-readstream-writestream', 'stream-triggers'],
  },

  {
    id: 'streaming-9',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.STRUCTURED_STREAMING,
    question: 'What is a watermark in Structured Streaming?',
    options: [
      { id: 'a', text: 'A threshold that defines how late data can arrive before it is dropped from stateful aggregations', isCorrect: true },
      { id: 'b', text: 'A unique identifier for each micro-batch', isCorrect: false },
      { id: 'c', text: 'A security mechanism for encrypting streams', isCorrect: false },
      { id: 'd', text: 'A method to limit output file size', isCorrect: false },
    ],
    explanation: 'Watermarks let the engine automatically track the current event time and clean up old state. Data arriving later than the watermark threshold is considered "too late" and dropped from stateful operations.',
    tags: ['streaming', 'watermark', 'late-data'],
    concepts: ['stream-readstream-writestream', 'stream-watermarks'],
  },

  {
    id: 'streaming-10',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.STRUCTURED_STREAMING,
    language: CodeLanguage.PYTHON,
    question: 'Given a streaming DataFrame "stream_df" (columns: event_id, event_time, value), add a watermark of 10 minutes on the "event_time" column to handle late-arriving data.',
    starterCode: `# Add watermark for late data\nresult = stream_df`,
    testCases: [
      {
        input: 'streaming DataFrame with event_time column',
        expectedOutput: '.withWatermark("event_time", "10 minutes")',
        description: 'Should add 10-minute watermark',
      },
    ],
    solution: `result = stream_df.withWatermark("event_time", "10 minutes")`,
    explanation: 'withWatermark(eventTimeColumn, delayThreshold) tells Spark to wait up to the threshold for late data. After that, late records are dropped from stateful operations like aggregations and joins.',
    hints: ['Use .withWatermark()', 'First param is column name, second is delay threshold'],
    tags: ['streaming', 'watermark'],
    concepts: ['stream-readstream-writestream', 'stream-watermarks'],
  },

  {
    id: 'streaming-11',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.STRUCTURED_STREAMING,
    question: 'When should you use "complete" output mode?',
    options: [
      { id: 'a', text: 'When you only want new rows appended', isCorrect: false },
      { id: 'b', text: 'When you need the entire aggregated result table output after every trigger', isCorrect: true },
      { id: 'c', text: 'When you want to delete old data', isCorrect: false },
      { id: 'd', text: 'When processing non-aggregation queries', isCorrect: false },
    ],
    explanation: 'Complete mode rewrites the entire result table on each trigger. It is required for aggregation queries where previous results may change (e.g., running counts). Append mode cannot be used with aggregations without watermarks.',
    tags: ['streaming', 'output-modes', 'complete'],
    concepts: ['stream-readstream-writestream', 'stream-output-modes'],
  },

  {
    id: 'streaming-12',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.STRUCTURED_STREAMING,
    language: CodeLanguage.PYTHON,
    question: 'Read a stream of JSON files from the path "/mnt/data/events/" with a defined schema "event_schema".\n\nIMPORTANT: Streaming reads require an explicit schema — unlike batch reads, Spark cannot infer the schema for streams because new files arrive continuously.\n\nTwo valid approaches:\n- Chained: spark.readStream.format("json").schema(event_schema).load(path)\n- Shorthand: spark.readStream.json(path, schema=event_schema)',
    starterCode: `# Read JSON files as stream\nstream_df = spark.readStream`,
    testCases: [
      {
        input: 'JSON files at /mnt/data/events/',
        expectedOutput: 'spark.readStream.format("json").schema(event_schema).load("/mnt/data/events/")',
        description: 'Should read JSON stream with schema',
      },
    ],
    solution: `stream_df = spark.readStream\n  .format("json")\n  .schema(event_schema)\n  .load("/mnt/data/events/")\n# OR\nstream_df = spark.readStream.json("/mnt/data/events/", schema=event_schema)`,
    explanation: 'Streaming reads MUST have an explicit schema — Spark cannot infer it from a stream because files arrive continuously. Both the chained (.format().schema().load()) and shorthand (.json(path, schema=)) approaches are valid.',
    hints: ['Schema is required for file-based streams — inferSchema is not supported', 'Use .format("json").schema(event_schema).load(path) or .json(path, schema=event_schema)', 'Both chained and shorthand styles are valid'],
    tags: ['streaming', 'json', 'schema'],
    concepts: ['stream-readstream-writestream', 'ps-io-json', 'ps-dataframe-create'],
  },

  {
    id: 'streaming-13',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.STRUCTURED_STREAMING,
    question: 'What happens if a Structured Streaming job fails and restarts?',
    options: [
      { id: 'a', text: 'It reprocesses all data from the beginning', isCorrect: false },
      { id: 'b', text: 'It skips the failed batch and continues', isCorrect: false },
      { id: 'c', text: 'It resumes from the last checkpoint, ensuring exactly-once processing with a Delta sink', isCorrect: true },
      { id: 'd', text: 'It requires manual intervention to restart', isCorrect: false },
    ],
    explanation: 'With checkpointing enabled and a Delta sink, Structured Streaming provides exactly-once guarantees. The checkpoint stores the offset and state, so on restart, processing resumes from where it left off.',
    tags: ['streaming', 'fault-tolerance', 'exactly-once'],
    concepts: ['stream-readstream-writestream', 'stream-checkpoint'],
  },

  // =====================================================================
  // AUTO LOADER (10 questions)
  // =====================================================================

  {
    id: 'autoloader-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.AUTO_LOADER,
    question: 'What is Auto Loader in Databricks?',
    options: [
      { id: 'a', text: 'A tool that automatically creates clusters', isCorrect: false },
      { id: 'b', text: 'A package manager for Spark libraries', isCorrect: false },
      { id: 'c', text: 'A batch processing scheduler', isCorrect: false },
      { id: 'd', text: 'An optimized file ingestion tool that incrementally processes new files as they arrive in cloud storage', isCorrect: true },
    ],
    explanation: 'Auto Loader (cloudFiles) incrementally and efficiently processes new data files as they arrive in cloud storage. It uses file notification or directory listing to discover new files.',
    tags: ['autoloader', 'ingestion', 'cloudFiles'],
    concepts: ['stream-autoloader'],
  },

  {
    id: 'autoloader-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.AUTO_LOADER,
    language: CodeLanguage.PYTHON,
    question: 'Use Auto Loader to read new JSON files from "/mnt/data/raw/" with schema inference enabled. Store the inferred schema at "/checkpoints/schema".\n\nAuto Loader uses a special format called "cloudFiles" (not "json" directly). You configure it with:\n- cloudFiles.format: the actual file format ("json", "csv", "parquet")\n- cloudFiles.schemaLocation: a path where Auto Loader saves the inferred schema so it can handle schema evolution across runs\n\nAuto Loader is a streaming source — use spark.readStream, not spark.read.',
    starterCode: `# Read with Auto Loader\n# format: "cloudFiles", not "json"\nstream_df = spark.readStream\n  .format(`,
    testCases: [
      {
        input: 'JSON files in /mnt/data/raw/',
        expectedOutput: '.format("cloudFiles").option("cloudFiles.format", "json").option("cloudFiles.schemaLocation", ...)',
        description: 'Should use cloudFiles format with JSON',
      },
    ],
    solution: `stream_df = spark.readStream\n  .format("cloudFiles")\n  .option("cloudFiles.format", "json")\n  .option("cloudFiles.schemaLocation", "/checkpoints/schema")\n  .load("/mnt/data/raw/")`,
    explanation: 'Auto Loader uses "cloudFiles" as the format — this is what makes it Auto Loader rather than a regular stream reader. cloudFiles.format tells it the underlying file type. cloudFiles.schemaLocation is required for schema inference — it stores the inferred schema so Auto Loader can detect and handle schema evolution (new columns, type changes) across runs.',
    hints: ['The format is "cloudFiles", NOT "json" — that\'s what makes it Auto Loader', 'cloudFiles.format = "json" specifies the actual file type', 'cloudFiles.schemaLocation is required — it stores the inferred schema for evolution tracking'],
    tags: ['autoloader', 'cloudFiles', 'json'],
    concepts: ['stream-autoloader', 'ps-io-json'],
  },

  {
    id: 'autoloader-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.AUTO_LOADER,
    question: 'What are the two modes Auto Loader can use to detect new files?',
    options: [
      { id: 'a', text: 'Directory listing mode and File notification mode', isCorrect: true },
      { id: 'b', text: 'Batch mode and Stream mode', isCorrect: false },
      { id: 'c', text: 'Push mode and Pull mode', isCorrect: false },
      { id: 'd', text: 'Sync mode and Async mode', isCorrect: false },
    ],
    explanation: 'Directory listing mode scans the input directory to find new files (default). File notification mode sets up cloud-native event notifications (e.g., AWS SNS/SQS) for better scalability with millions of files.',
    tags: ['autoloader', 'file-detection'],
    concepts: ['stream-autoloader'],
  },

  {
    id: 'autoloader-4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.AUTO_LOADER,
    question: 'How does Auto Loader handle schema evolution when new columns appear in source files?',
    options: [
      { id: 'a', text: 'It fails immediately when the schema changes', isCorrect: false },
      { id: 'b', text: 'It can automatically detect and merge new columns into the schema using schemaEvolutionMode', isCorrect: true },
      { id: 'c', text: 'It ignores new columns silently', isCorrect: false },
      { id: 'd', text: 'It requires manual schema updates every time', isCorrect: false },
    ],
    explanation: 'Auto Loader can be configured to handle schema evolution. With cloudFiles.schemaEvolutionMode set to "addNewColumns", it automatically adds new columns. The schema is tracked in schemaLocation.',
    tags: ['autoloader', 'schema-evolution'],
    concepts: ['stream-autoloader', 'stream-schema-evolution'],
  },

  {
    id: 'autoloader-5',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.AUTO_LOADER,
    language: CodeLanguage.PYTHON,
    question: 'Build a complete Auto Loader pipeline: read CSV files from "/mnt/landing/" (with headers), infer schema (store at "/checkpoints/bronze/schema"), and write as a stream to the Delta table "bronze_data" with checkpoint at "/checkpoints/bronze".\n\nA full Auto Loader pipeline has two parts:\n1. READ: spark.readStream.format("cloudFiles") with cloudFiles.format, header, cloudFiles.schemaLocation, and .load(path)\n2. WRITE: .writeStream.format("delta") with checkpointLocation, outputMode("append"), and .toTable(name)',
    starterCode: `# Auto Loader: read CSV → write Delta\nspark.readStream\n  .format("cloudFiles")\n  .option("cloudFiles.format", "csv")\n  .option("header", "true")\n  .option("cloudFiles.schemaLocation", "/checkpoints/bronze/schema")\n  .load(`,
    testCases: [
      {
        input: 'CSV files',
        expectedOutput: 'cloudFiles format, csv, writeStream to delta',
        description: 'Should create full Auto Loader pipeline',
      },
    ],
    solution: `spark.readStream\n  .format("cloudFiles")\n  .option("cloudFiles.format", "csv")\n  .option("header", "true")\n  .option("cloudFiles.schemaLocation", "/checkpoints/bronze/schema")\n  .load("/mnt/landing/")\n  .writeStream\n  .format("delta")\n  .option("checkpointLocation", "/checkpoints/bronze")\n  .outputMode("append")\n  .toTable("bronze_data")`,
    explanation: 'A full Auto Loader pipeline: readStream with cloudFiles reads new files incrementally, schemaLocation stores the inferred schema, then writeStream writes to a Delta table. Two separate checkpoints: schemaLocation for the inferred schema, checkpointLocation for stream progress. Use .toTable() (not .table()) to write a stream to a named table.',
    hints: ['readStream uses .load(path), writeStream uses .toTable(name)', 'schemaLocation is for schema inference, checkpointLocation is for stream progress — they are different', 'outputMode("append") adds new rows without rewriting existing data'],
    tags: ['autoloader', 'pipeline', 'csv', 'delta'],
    concepts: ['stream-autoloader', 'dlt-pipeline-basics', 'ps-io-csv', 'delta-acid'],
  },

  {
    id: 'autoloader-6',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.AUTO_LOADER,
    question: 'What advantage does Auto Loader have over using spark.readStream.format("json") directly for file ingestion?',
    options: [
      { id: 'a', text: 'Auto Loader is faster for single file reads', isCorrect: false },
      { id: 'b', text: 'Auto Loader can read non-file data sources', isCorrect: false },
      { id: 'c', text: 'Auto Loader tracks which files have been processed, handles schema evolution, and scales to millions of files', isCorrect: true },
      { id: 'd', text: 'Auto Loader uses less memory', isCorrect: false },
    ],
    explanation: 'Auto Loader provides file tracking (no reprocessing), schema inference and evolution, and efficient file discovery via cloud notifications. Regular file streaming re-lists the directory each trigger.',
    tags: ['autoloader', 'advantages'],
    concepts: ['stream-autoloader'],
  },

  {
    id: 'autoloader-7',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.AUTO_LOADER,
    language: CodeLanguage.PYTHON,
    question: 'Read JSON files from "/mnt/data/" with Auto Loader, including files that existed before the stream started. Also add the source file path and modification time as columns for data lineage tracking.\n\nAuto Loader provides a virtual column called _metadata that contains file information:\n- _metadata.file_path: full path to the source file\n- _metadata.file_name: just the file name\n- _metadata.file_size: file size in bytes\n- _metadata.file_modification_time: when the file was last modified\n\nBy default, Auto Loader only processes NEW files. Set cloudFiles.includeExistingFiles to "true" to also process files that were already in the directory when the stream started.',
    starterCode: `# Auto Loader with metadata columns\nstream_df = spark.readStream\n  .format("cloudFiles")\n  .option("cloudFiles.format", "json")\n  .option("cloudFiles.includeExistingFiles", "true")\n  .option("cloudFiles.schemaLocation", "/checkpoints/schema")\n  .load("/mnt/data/")\n  .select("*", `,
    testCases: [
      {
        input: 'Auto Loader stream',
        expectedOutput: 'select _metadata.file_path or option includeExistingFiles',
        description: 'Should include metadata columns',
      },
    ],
    solution: `stream_df = spark.readStream\n  .format("cloudFiles")\n  .option("cloudFiles.format", "json")\n  .option("cloudFiles.includeExistingFiles", "true")\n  .option("cloudFiles.schemaLocation", "/checkpoints/schema")\n  .load("/mnt/data/")\n  .select("*", "_metadata.file_path", "_metadata.file_modification_time")`,
    explanation: '_metadata is a virtual column automatically available in file-based streams. You access its fields with dot notation in select(). includeExistingFiles=true is important for initial loads — without it, only files arriving AFTER the stream starts are processed.',
    hints: ['Use _metadata.file_path and _metadata.file_modification_time in select()', 'includeExistingFiles=true processes pre-existing files too', '_metadata is automatic — you don\'t need to define it'],
    tags: ['autoloader', 'metadata', 'lineage'],
    concepts: ['stream-autoloader', 'ps-dataframe-create', 'ucat-lineage'],
  },

  // =====================================================================
  // MEDALLION ARCHITECTURE (12 questions)
  // =====================================================================

  {
    id: 'medallion-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.MEDALLION_ARCHITECTURE,
    question: 'What are the three layers of the Medallion (multi-hop) architecture?',
    options: [
      { id: 'a', text: 'Input, Processing, Output', isCorrect: false },
      { id: 'b', text: 'Staging, Production, Archive', isCorrect: false },
      { id: 'c', text: 'Hot, Warm, Cold', isCorrect: false },
      { id: 'd', text: 'Bronze (raw), Silver (cleaned/augmented), Gold (business-level aggregates)', isCorrect: true },
    ],
    explanation: 'The Medallion architecture organizes data into Bronze (raw ingestion), Silver (cleaned, filtered, augmented), and Gold (business-level aggregates and metrics). Each layer increases data quality.',
    tags: ['medallion', 'architecture', 'bronze', 'silver', 'gold'],
    concepts: ['medallion-architecture', 'dbx-architecture'],
  },

  {
    id: 'medallion-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.MEDALLION_ARCHITECTURE,
    question: 'What type of data does the Bronze layer typically contain?',
    options: [
      { id: 'a', text: 'Raw, unprocessed data as-is from the source, often with metadata columns added', isCorrect: true },
      { id: 'b', text: 'Fully aggregated business metrics', isCorrect: false },
      { id: 'c', text: 'Only data that has passed quality checks', isCorrect: false },
      { id: 'd', text: 'Denormalized star schemas', isCorrect: false },
    ],
    explanation: 'Bronze is the raw landing zone. Data is ingested as-is with minimal transformation. Metadata like ingestion timestamp and source file path are often added for lineage.',
    tags: ['medallion', 'bronze'],
    concepts: ['medallion-architecture'],
  },

  {
    id: 'medallion-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.MEDALLION_ARCHITECTURE,
    question: 'What transformations typically happen in the Silver layer?',
    options: [
      { id: 'a', text: 'Only schema validation', isCorrect: false },
      { id: 'b', text: 'Data cleaning, deduplication, type casting, joining with reference data, and applying business rules', isCorrect: true },
      { id: 'c', text: 'Creating executive dashboards', isCorrect: false },
      { id: 'd', text: 'Archiving old data', isCorrect: false },
    ],
    explanation: 'The Silver layer provides a "single source of truth" by cleaning, deduplicating, and enriching raw data. Common operations include filtering invalid records, standardizing formats, and joining with dimension tables.',
    tags: ['medallion', 'silver', 'transformation'],
    concepts: ['medallion-architecture', 'ps-actions-vs-transforms'],
  },

  {
    id: 'medallion-4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.MEDALLION_ARCHITECTURE,
    question: 'What is the Gold layer used for?',
    options: [
      { id: 'a', text: 'Storing raw backup data', isCorrect: false },
      { id: 'b', text: 'Running ETL transformations', isCorrect: false },
      { id: 'c', text: 'Business-level aggregations, KPIs, and data optimized for reporting and analytics', isCorrect: true },
      { id: 'd', text: 'Data ingestion from external sources', isCorrect: false },
    ],
    explanation: 'Gold tables are business-ready. They contain aggregated metrics, KPIs, and denormalized views optimized for BI tools and reporting. They serve specific business use cases.',
    tags: ['medallion', 'gold', 'analytics'],
    concepts: ['medallion-architecture'],
  },

  {
    id: 'medallion-5',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.MEDALLION_ARCHITECTURE,
    language: CodeLanguage.SQL,
    question: 'Create a Silver table "silver_orders" from the "bronze_orders" table (columns: order_id, customer_id, amount, order_status, ingestion_time) by filtering out null order_ids and deduplicating — keep only the latest record per order_id (by ingestion_time).\n\nDeduplication pattern: use ROW_NUMBER() OVER (PARTITION BY order_id ORDER BY ingestion_time DESC) to number duplicates, then keep only row number 1.',
    starterCode: `-- Create Silver table: filter nulls + deduplicate\n-- bronze_orders: order_id, customer_id, amount, order_status, ingestion_time\n`,
    testCases: [
      {
        input: 'bronze_orders table',
        expectedOutput: 'CREATE OR REPLACE TABLE silver_orders with WHERE and QUALIFY/ROW_NUMBER',
        description: 'Should clean and deduplicate data',
      },
    ],
    solution: `CREATE OR REPLACE TABLE silver_orders AS\nSELECT * FROM (\n  SELECT *, ROW_NUMBER() OVER (PARTITION BY order_id ORDER BY ingestion_time DESC) as rn\n  FROM bronze_orders\n  WHERE order_id IS NOT NULL\n)\nWHERE rn = 1`,
    explanation: 'Silver layer transformations typically filter nulls (data quality), deduplicate using ROW_NUMBER() to keep the latest record, and may cast types or join with reference data.',
    hints: ['Filter out NULL order_ids with WHERE', 'Use ROW_NUMBER() OVER (PARTITION BY order_id) for deduplication', 'Keep only rn = 1 for latest record'],
    tags: ['medallion', 'silver', 'deduplication'],
    concepts: ['medallion-architecture', 'ps-distinct-drop-dup'],
  },

  {
    id: 'medallion-6',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.MEDALLION_ARCHITECTURE,
    language: CodeLanguage.SQL,
    question: 'Create a Gold table "gold_daily_revenue" from "silver_orders" (columns: order_id, customer_id, amount, order_date, order_status) that aggregates total revenue (sum of amount) and order count by order_date.',
    starterCode: `-- Create Gold aggregation table\n-- silver_orders: order_id, customer_id, amount, order_date, order_status\n`,
    testCases: [
      {
        input: 'silver_orders with order_date and amount columns',
        expectedOutput: 'GROUP BY order_date with SUM and COUNT',
        description: 'Should aggregate revenue by date',
      },
    ],
    solution: `CREATE OR REPLACE TABLE gold_daily_revenue AS\nSELECT\n  order_date,\n  SUM(amount) as total_revenue,\n  COUNT(*) as order_count\nFROM silver_orders\nGROUP BY order_date`,
    explanation: 'Gold tables contain business-level aggregations. This creates a daily revenue summary that can be consumed by BI dashboards and reporting tools.',
    hints: ['Use GROUP BY order_date', 'SUM for revenue, COUNT for orders'],
    tags: ['medallion', 'gold', 'aggregation'],
    concepts: ['medallion-architecture', 'ps-groupby-agg'],
  },

  {
    id: 'medallion-7',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.MEDALLION_ARCHITECTURE,
    question: 'Why is the Medallion architecture beneficial for data governance?',
    options: [
      { id: 'a', text: 'It automatically encrypts data', isCorrect: false },
      { id: 'b', text: 'It eliminates the need for access controls', isCorrect: false },
      { id: 'c', text: 'It stores data in a single location for easy management', isCorrect: false },
      { id: 'd', text: 'Each layer provides clear data quality guarantees, and access can be controlled per layer (e.g., restrict Bronze access to engineers only)', isCorrect: true },
    ],
    explanation: 'The layered approach enables access control by quality level (analysts see Gold, engineers access Bronze). Each layer has clear quality expectations. Delta Lake provides audit history at each layer.',
    tags: ['medallion', 'governance'],
    concepts: ['medallion-architecture', 'ucat-grants'],
  },

  {
    id: 'medallion-8',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.MEDALLION_ARCHITECTURE,
    question: 'In a Medallion architecture, which layer would you typically use Auto Loader to populate?',
    options: [
      { id: 'a', text: 'Bronze - to ingest raw files from cloud storage', isCorrect: true },
      { id: 'b', text: 'Silver - to clean and transform data', isCorrect: false },
      { id: 'c', text: 'Gold - to create business aggregations', isCorrect: false },
      { id: 'd', text: 'All layers equally', isCorrect: false },
    ],
    explanation: 'Auto Loader is typically used at the Bronze layer to ingest raw files from cloud storage (S3, ADLS, GCS). Silver and Gold layers read from the previous layer\'s Delta tables.',
    tags: ['medallion', 'autoloader', 'bronze'],
    concepts: ['medallion-architecture', 'stream-autoloader'],
  },

  {
    id: 'medallion-9',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.MEDALLION_ARCHITECTURE,
    language: CodeLanguage.PYTHON,
    question: 'Build a Bronze ingestion pipeline that reads JSON from "/mnt/landing/events" using Auto Loader, adds an ingestion timestamp, and writes to the "bronze_events" Delta table. Use "/checkpoints/bronze_events/schema" for schema location and "/checkpoints/bronze_events" for stream checkpoint.\n\nA Bronze pipeline has 3 parts chained together:\n1. READ: spark.readStream.format("cloudFiles") with cloudFiles.format, cloudFiles.schemaLocation, and .load(path)\n2. TRANSFORM: .withColumn("ingestion_time", current_timestamp()) to track when each row was ingested\n3. WRITE: .writeStream.format("delta").option("checkpointLocation", ...).outputMode("append").toTable(name)',
    starterCode: `from pyspark.sql.functions import current_timestamp\n\n# 1. Read with Auto Loader\nspark.readStream\n  .format("cloudFiles")\n  .option("cloudFiles.format", "json")\n  .option("cloudFiles.schemaLocation", "/checkpoints/bronze_events/schema")\n  .load("/mnt/landing/events")\n  # 2. Add ingestion metadata\n  .withColumn(`,
    testCases: [
      {
        input: 'JSON files',
        expectedOutput: 'cloudFiles with withColumn current_timestamp',
        description: 'Should create Bronze pipeline with metadata',
      },
    ],
    solution: `from pyspark.sql.functions import current_timestamp\n\nspark.readStream\n  .format("cloudFiles")\n  .option("cloudFiles.format", "json")\n  .option("cloudFiles.schemaLocation", "/checkpoints/bronze_events/schema")\n  .load("/mnt/landing/events")\n  .withColumn("ingestion_time", current_timestamp())\n  .writeStream\n  .format("delta")\n  .option("checkpointLocation", "/checkpoints/bronze_events")\n  .outputMode("append")\n  .toTable("bronze_events")`,
    explanation: 'This is the standard Bronze pattern: Auto Loader (cloudFiles) incrementally reads new files, current_timestamp() adds when each row was ingested (useful for debugging/auditing), and writeStream persists to Delta. Two checkpoints serve different purposes: schemaLocation tracks the inferred schema, checkpointLocation tracks stream progress.',
    hints: ['withColumn("ingestion_time", current_timestamp()) adds the timestamp', 'writeStream uses .toTable("bronze_events") not .table()', 'schemaLocation is for schema inference, checkpointLocation is for stream progress'],
    tags: ['medallion', 'bronze', 'autoloader', 'pipeline'],
    concepts: ['medallion-architecture', 'stream-autoloader', 'dlt-pipeline-basics'],
  },

  {
    id: 'medallion-10',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.MEDALLION_ARCHITECTURE,
    language: CodeLanguage.PYTHON,
    question: 'Build a streaming Silver pipeline that reads from "bronze_events" (columns: event_id, event_type, amount (string), user_id, ingestion_time), filters out null event_types, casts amount to double, and writes to "silver_events" with checkpoint at "/checkpoints/silver_events".\n\nA Silver pipeline reads from a Bronze Delta table AS A STREAM:\n1. READ: spark.readStream.table("bronze_events") — reads the Delta table as a stream (new rows in Bronze automatically flow through)\n2. TRANSFORM: .filter() for quality, .withColumn() for type corrections\n3. WRITE: .writeStream.format("delta").option("checkpointLocation", ...).outputMode("append").toTable(name)',
    starterCode: `from pyspark.sql.functions import col\n\n# Silver: read Bronze as stream → clean → write\nspark.readStream\n  .table("bronze_events")\n  # Filter out bad records\n  .filter(`,
    testCases: [
      {
        input: 'bronze_events Delta table',
        expectedOutput: 'readStream from delta, filter, cast, writeStream',
        description: 'Should create Silver streaming pipeline',
      },
    ],
    solution: `from pyspark.sql.functions import col\n\nspark.readStream\n  .table("bronze_events")\n  .filter(col("event_type").isNotNull())\n  .withColumn("amount", col("amount").cast("double"))\n  .writeStream\n  .format("delta")\n  .option("checkpointLocation", "/checkpoints/silver_events")\n  .outputMode("append")\n  .toTable("silver_events")`,
    explanation: 'Silver pipelines stream from Bronze Delta tables. readStream.table() treats the Delta table as a stream source — as new rows land in Bronze, they automatically flow to Silver. The filter removes bad data (null event_type), cast corrects types (string amount → double). This creates a continuous data quality pipeline.',
    hints: ['readStream.table("bronze_events") — not readStream.format("delta").load(path)', 'col("event_type").isNotNull() filters nulls', 'col("amount").cast("double") fixes the type from string'],
    tags: ['medallion', 'silver', 'streaming', 'pipeline'],
    concepts: ['medallion-architecture', 'stream-readstream-writestream', 'dlt-pipeline-basics'],
  },

  // =====================================================================
  // CHANGE DATA CAPTURE (10 questions)
  // =====================================================================

  {
    id: 'cdc-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.CHANGE_DATA_CAPTURE,
    question: 'What is Change Data Capture (CDC)?',
    options: [
      { id: 'a', text: 'A method for compressing data files', isCorrect: false },
      { id: 'b', text: 'A pattern that identifies and captures changes (inserts, updates, deletes) made to data so they can be replicated downstream', isCorrect: true },
      { id: 'c', text: 'A technique for creating database indexes', isCorrect: false },
      { id: 'd', text: 'A security protocol for data encryption', isCorrect: false },
    ],
    explanation: 'CDC tracks row-level changes in source systems and propagates them to target systems. This enables efficient incremental updates without full table reloads.',
    tags: ['cdc', 'fundamentals'],
    concepts: ['delta-cdf', 'dbx-architecture'],
  },

  {
    id: 'cdc-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.CHANGE_DATA_CAPTURE,
    question: 'What is Delta Lake\'s Change Data Feed (CDF)?',
    options: [
      { id: 'a', text: 'A tool for monitoring cluster health', isCorrect: false },
      { id: 'b', text: 'A method for partitioning tables', isCorrect: false },
      { id: 'c', text: 'A feature that records row-level changes (insert, update, delete) to a Delta table, making them available as a stream', isCorrect: true },
      { id: 'd', text: 'A backup mechanism for Delta tables', isCorrect: false },
    ],
    explanation: 'Change Data Feed records changes made to a Delta table, including the type of change (insert, update_preimage, update_postimage, delete). It enables efficient downstream processing of only changed data.',
    tags: ['cdc', 'delta', 'change-data-feed'],
    concepts: ['delta-cdf', 'delta-acid'],
  },

  {
    id: 'cdc-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.CHANGE_DATA_CAPTURE,
    language: CodeLanguage.SQL,
    question: 'Enable Change Data Feed on an existing Delta table called "customers".\n\nChange Data Feed is enabled via a table property. Use ALTER TABLE to set it:\n  ALTER TABLE table_name SET TBLPROPERTIES (delta.enableChangeDataFeed = true)\n\nOnce enabled, all future changes (INSERT, UPDATE, DELETE) are recorded and can be queried with table_changes().',
    starterCode: `-- Enable CDF on existing customers table\nALTER TABLE customers SET TBLPROPERTIES (\n`,
    testCases: [
      {
        input: 'customers Delta table',
        expectedOutput: 'ALTER TABLE customers SET TBLPROPERTIES (delta.enableChangeDataFeed = true)',
        description: 'Should enable CDF',
      },
    ],
    solution: `ALTER TABLE customers SET TBLPROPERTIES (delta.enableChangeDataFeed = true)`,
    explanation: 'Setting delta.enableChangeDataFeed = true on a Delta table enables Change Data Feed. After enabling, all changes to the table are recorded and can be read using table_changes().',
    hints: ['Use ALTER TABLE with SET TBLPROPERTIES', 'Property is delta.enableChangeDataFeed'],
    tags: ['cdc', 'enable', 'tblproperties'],
    concepts: ['delta-cdf', 'delta-table-properties'],
  },

  {
    id: 'cdc-4',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.CHANGE_DATA_CAPTURE,
    language: CodeLanguage.SQL,
    question: 'Read all row-level changes from the "customers" table starting from Delta version 5 using the table_changes() function.\n\ntable_changes(table_name, starting_version) returns a table with all your original columns PLUS:\n- _change_type: "insert", "update_preimage", "update_postimage", or "delete"\n- _commit_version: the Delta version number of the change\n- _commit_timestamp: when the change was committed',
    starterCode: `-- Read change data from version 5 onwards\nSELECT * FROM table_changes(`,
    testCases: [
      {
        input: 'customers table with CDF enabled',
        expectedOutput: 'SELECT * FROM table_changes("customers", 5)',
        description: 'Should read changes from version 5',
      },
    ],
    solution: `SELECT * FROM table_changes("customers", 5)`,
    explanation: 'table_changes() returns the row-level changes since the specified version. Each row includes _change_type (insert, update_preimage, update_postimage, delete), _commit_version, and _commit_timestamp.',
    hints: ['Use table_changes(table_name, starting_version)', 'Returns _change_type column'],
    tags: ['cdc', 'table_changes', 'read'],
    concepts: ['delta-cdf', 'ps-io-csv'],
  },

  {
    id: 'cdc-5',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.CHANGE_DATA_CAPTURE,
    language: CodeLanguage.PYTHON,
    question: 'Read the Change Data Feed from the "orders" Delta table as a stream, starting from version 10.\n\nTo stream CDF changes in PySpark, use spark.readStream with two key options:\n- readChangeFeed = "true" — enables reading change records instead of regular rows\n- startingVersion = 10 — which Delta version to start streaming from\n\nThe stream returns rows with _change_type, _commit_version, _commit_timestamp alongside the table\'s regular columns.',
    starterCode: `# Read CDF as stream\nchanges_df = spark.readStream\n  .format("delta")\n  .option("readChangeFeed", "true")\n  .option("startingVersion", `,
    testCases: [
      {
        input: 'orders table with CDF',
        expectedOutput: 'readStream with readChangeFeed and startingVersion',
        description: 'Should stream CDF',
      },
    ],
    solution: `changes_df = spark.readStream\n  .format("delta")\n  .option("readChangeFeed", "true")\n  .option("startingVersion", 10)\n  .table("orders")`,
    explanation: 'Setting readChangeFeed=true on a readStream enables streaming of change records. startingVersion specifies from which Delta version to start reading changes.',
    hints: ['Use readStream.format("delta")', 'Set option readChangeFeed to true', 'Use startingVersion for the starting point'],
    tags: ['cdc', 'streaming', 'readChangeFeed'],
    concepts: ['delta-cdf', 'stream-readstream-writestream'],
  },

  {
    id: 'cdc-6',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.CHANGE_DATA_CAPTURE,
    question: 'Which _change_type values does Change Data Feed produce?',
    options: [
      { id: 'a', text: 'create, modify, remove', isCorrect: false },
      { id: 'b', text: 'add, change, drop', isCorrect: false },
      { id: 'c', text: 'INSERT, UPDATE, DELETE', isCorrect: false },
      { id: 'd', text: 'insert, update_preimage, update_postimage, delete', isCorrect: true },
    ],
    explanation: 'CDF uses: "insert" for new rows, "update_preimage" for the old values before update, "update_postimage" for new values after update, and "delete" for removed rows.',
    tags: ['cdc', 'change-types'],
    concepts: ['delta-cdf'],
  },

  {
    id: 'cdc-7',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.CHANGE_DATA_CAPTURE,
    language: CodeLanguage.SQL,
    question: 'Apply CDC (Change Data Feed) changes from "customers_changes" into the target "customers" table using MERGE.\n\nTarget table "customers" has columns: customer_id, customer_name, email.\nSource table "customers_changes" has the same columns PLUS _change_type which contains one of:\n- "insert" — new row to add\n- "update_preimage" — old values before an update (filter these out)\n- "update_postimage" — new values after an update (use these for updates)\n- "delete" — row to remove\n\nThe MERGE should:\n1. First, filter the source to exclude update_preimage rows (they are for auditing, not applying)\n2. Join on customer_id\n3. WHEN MATCHED and _change_type = "delete" → DELETE the row\n4. WHEN MATCHED and _change_type = "update_postimage" → UPDATE SET *\n5. WHEN NOT MATCHED and _change_type = "insert" → INSERT *',
    starterCode: `-- Write a MERGE INTO customers t USING (subquery from customers_changes\n-- filtered to exclude 'update_preimage') s ON t.customer_id = s.customer_id\n-- WHEN MATCHED AND _change_type='delete' → DELETE\n-- WHEN MATCHED AND _change_type='update_postimage' → UPDATE SET *\n-- WHEN NOT MATCHED AND _change_type='insert' → INSERT *\n`,
    testCases: [
      {
        input: 'customers_changes with _change_type',
        expectedOutput: 'MERGE INTO with WHEN MATCHED DELETE, UPDATE, INSERT',
        description: 'Should apply all CDC change types',
      },
    ],
    solution: `MERGE INTO customers t\nUSING (\n  SELECT * FROM customers_changes\n  WHERE _change_type != 'update_preimage'\n) s\nON t.customer_id = s.customer_id\nWHEN MATCHED AND s._change_type = 'delete' THEN DELETE\nWHEN MATCHED AND s._change_type = 'update_postimage' THEN UPDATE SET *\nWHEN NOT MATCHED AND s._change_type = 'insert' THEN INSERT *`,
    explanation: 'This pattern applies all CDC change types in one MERGE statement. The key insight is filtering out update_preimage first — preimages record the old values (useful for auditing) but you only need postimages to apply the update. Each WHEN clause checks _change_type to decide the action. UPDATE SET * and INSERT * copy all columns from the source.',
    hints: ['The source subquery filters out update_preimage — you only need postimage for updates', 'Use AND s._change_type = "delete" in WHEN MATCHED to conditionally delete vs update', 'WHEN NOT MATCHED handles inserts — rows in source but not in target'],
    tags: ['cdc', 'merge', 'upsert'],
    concepts: ['delta-cdf', 'delta-merge'],
  },

  {
    id: 'cdc-8',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.CHANGE_DATA_CAPTURE,
    language: CodeLanguage.SQL,
    question: 'Create a new Delta table "customers" (columns: customer_id INT, customer_name STRING, email STRING) with Change Data Feed enabled from the start.\n\nTo enable CDF at creation time, add TBLPROPERTIES to the CREATE TABLE statement:\n  CREATE TABLE name (columns) USING DELTA TBLPROPERTIES (delta.enableChangeDataFeed = true)\n\nThis is equivalent to creating the table first and then running ALTER TABLE ... SET TBLPROPERTIES, but done in one step.',
    starterCode: `-- CREATE TABLE customers (customer_id INT, customer_name STRING, email STRING)\n-- USING DELTA with TBLPROPERTIES enabling Change Data Feed\n`,
    testCases: [
      {
        input: 'New table',
        expectedOutput: 'CREATE TABLE with TBLPROPERTIES delta.enableChangeDataFeed',
        description: 'Should create table with CDF',
      },
    ],
    solution: `CREATE TABLE customers (\n  customer_id INT,\n  customer_name STRING,\n  email STRING\n)\nUSING DELTA\nTBLPROPERTIES (delta.enableChangeDataFeed = true)`,
    explanation: 'TBLPROPERTIES at creation enables CDF immediately — all INSERT, UPDATE, DELETE operations on this table will be tracked from the first write. You can query the changes with table_changes("customers", 0) or stream them with readChangeFeed option.',
    hints: ['Add TBLPROPERTIES after USING DELTA', 'delta.enableChangeDataFeed = true is the property name', 'Column name uses customer_name not name (reserved word)'],
    tags: ['cdc', 'create-table', 'tblproperties'],
    concepts: ['delta-cdf', 'ps-dataframe-create', 'delta-table-properties'],
  },

  // =====================================================================
  // DELTA LIVE TABLES (18 questions)
  // =====================================================================

  {
    id: 'dlt-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DELTA_LIVE_TABLES,
    question: 'What is Delta Live Tables (DLT)?',
    options: [
      { id: 'a', text: 'A declarative framework for building reliable, maintainable, and testable data processing pipelines', isCorrect: true },
      { id: 'b', text: 'A type of Delta table with live updates', isCorrect: false },
      { id: 'c', text: 'A real-time dashboard tool', isCorrect: false },
      { id: 'd', text: 'A version of Apache Kafka for Databricks', isCorrect: false },
    ],
    explanation: 'DLT lets you define your pipeline as a series of table declarations. Databricks handles the orchestration, dependency management, error handling, and monitoring automatically.',
    tags: ['dlt', 'fundamentals'],
    concepts: ['dlt-pipeline-basics', 'dbx-architecture'],
  },

  {
    id: 'dlt-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DELTA_LIVE_TABLES,
    question: 'What is the difference between a DLT "table" and a DLT "view" in Delta Live Tables?',
    options: [
      { id: 'a', text: 'Tables are read-only, views are writable', isCorrect: false },
      { id: 'b', text: 'Tables are materialized (stored in Delta), views are computed on-the-fly and not persisted', isCorrect: true },
      { id: 'c', text: 'There is no difference', isCorrect: false },
      { id: 'd', text: 'Views are faster than tables', isCorrect: false },
    ],
    explanation: 'DLT tables (LIVE TABLE) are materialized as Delta tables. DLT views (LIVE VIEW) are computed on demand and not stored, useful for intermediate transformations you don\'t need to persist.',
    tags: ['dlt', 'table', 'view'],
    concepts: ['dlt-pipeline-basics', 'sql-temp-views'],
  },

  {
    id: 'dlt-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DELTA_LIVE_TABLES,
    language: CodeLanguage.SQL,
    question: 'Create a DLT streaming live table called "bronze_events" that reads JSON files from "/mnt/data/raw/events/".\n\nDLT SQL syntax for file ingestion:\n  CREATE OR REFRESH STREAMING LIVE TABLE table_name\n  AS SELECT * FROM cloud_files("path", "format")\n\ncloud_files() is the DLT equivalent of Auto Loader — it handles incremental file ingestion. Use STREAMING for append-only tables (Bronze/Silver).',
    starterCode: `-- Declare the DLT bronze_events table that incrementally reads JSON files\n-- from /mnt/data/raw/events/ using cloud_files()\n`,
    testCases: [
      {
        input: 'JSON files',
        expectedOutput: 'CREATE OR REFRESH STREAMING LIVE TABLE',
        description: 'Should create streaming live table',
      },
    ],
    solution: `CREATE OR REFRESH STREAMING LIVE TABLE bronze_events\nAS SELECT * FROM cloud_files("/mnt/data/raw/events/", "json")`,
    explanation: 'In DLT SQL, CREATE OR REFRESH STREAMING LIVE TABLE creates a streaming table. cloud_files() is the DLT equivalent of Auto Loader for ingesting files.',
    hints: ['Use CREATE OR REFRESH STREAMING LIVE TABLE', 'Use cloud_files() for file ingestion in DLT'],
    tags: ['dlt', 'bronze', 'streaming', 'cloud_files'],
    concepts: ['dlt-pipeline-basics', 'medallion-architecture', 'stream-readstream-writestream', 'stream-autoloader'],
  },

  {
    id: 'dlt-4',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DELTA_LIVE_TABLES,
    language: CodeLanguage.PYTHON,
    question: 'Create a DLT live table called "bronze_events" using the Python decorator syntax that reads JSON from "/mnt/data/raw/".\n\nDLT Python syntax:\n  @dlt.table — decorator that registers a function as a DLT table\n  The function name becomes the table name\n  Return a DataFrame (streaming or batch) — DLT handles the rest\n  For streaming ingestion, use spark.readStream.format("cloudFiles") inside the function.',
    starterCode: ``,
    testCases: [
      {
        input: 'JSON files',
        expectedOutput: '@dlt.table decorator with spark.readStream.format("cloudFiles")',
        description: 'Should create DLT table with decorator',
      },
    ],
    solution: `import dlt\nfrom pyspark.sql.functions import *\n\n@dlt.table\ndef bronze_events():\n  return (\n    spark.readStream\n      .format("cloudFiles")\n      .option("cloudFiles.format", "json")\n      .load("/mnt/data/raw/")\n  )`,
    explanation: 'In Python DLT, the @dlt.table decorator defines a live table. The function name becomes the table name. Return a DataFrame or streaming DataFrame.',
    hints: ['Use @dlt.table decorator', 'Function name = table name', 'Return the DataFrame'],
    tags: ['dlt', 'python', 'decorator', 'bronze'],
    concepts: ['dlt-pipeline-basics', 'medallion-architecture'],
  },

  {
    id: 'dlt-5',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DELTA_LIVE_TABLES,
    language: CodeLanguage.SQL,
    question: 'Create a DLT streaming live table "silver_orders" that reads from the upstream live table "bronze_orders", filtering out null order_ids.\n\nIn DLT SQL, you reference other DLT tables with the LIVE. prefix: LIVE.bronze_orders. For streaming reads, wrap it in STREAM(): STREAM(LIVE.bronze_orders). DLT automatically manages the dependency ordering between tables.',
    starterCode: `-- DLT Silver table\n-- Reference upstream: STREAM(LIVE.table_name)\n`,
    testCases: [
      {
        input: 'bronze_orders live table',
        expectedOutput: 'CREATE OR REFRESH STREAMING LIVE TABLE with LIVE.bronze_orders',
        description: 'Should create Silver DLT table',
      },
    ],
    solution: `CREATE OR REFRESH STREAMING LIVE TABLE silver_orders\nAS SELECT *\nFROM STREAM(LIVE.bronze_orders)\nWHERE order_id IS NOT NULL`,
    explanation: 'In DLT, reference other live tables using LIVE.table_name. For streaming tables, wrap in STREAM() to read as a stream. DLT handles dependency ordering automatically.',
    hints: ['Reference upstream tables with LIVE.table_name', 'Wrap in STREAM() for streaming reads', 'DLT manages pipeline ordering'],
    tags: ['dlt', 'silver', 'streaming', 'dependencies'],
    concepts: ['dlt-pipeline-basics', 'medallion-architecture', 'stream-readstream-writestream', 'dbx-workflows'],
  },

  {
    id: 'dlt-6',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DELTA_LIVE_TABLES,
    language: CodeLanguage.SQL,
    question: 'Create a DLT streaming table "clean_orders" from "bronze_orders" with a data quality expectation: the "amount" column must be positive. Rows that violate should be dropped.\n\nDLT expectations syntax — defined inside the CREATE statement:\n  CREATE OR REFRESH STREAMING LIVE TABLE name (\n    CONSTRAINT constraint_name EXPECT (condition) ON VIOLATION DROP ROW\n  )\n  AS SELECT ...\n\nThree violation actions: no action (track in metrics), DROP ROW (silently remove), FAIL UPDATE (stop pipeline).',
    starterCode: `-- DLT table with quality constraint\n-- CONSTRAINT name EXPECT (condition) ON VIOLATION DROP ROW\n`,
    testCases: [
      {
        input: 'orders data',
        expectedOutput: 'CONSTRAINT with EXPECT or ON VIOLATION DROP ROW',
        description: 'Should add quality constraint',
      },
    ],
    solution: `CREATE OR REFRESH STREAMING LIVE TABLE clean_orders (\n  CONSTRAINT valid_amount EXPECT (amount > 0) ON VIOLATION DROP ROW\n)\nAS SELECT *\nFROM STREAM(LIVE.bronze_orders)`,
    explanation: 'DLT expectations define data quality constraints. ON VIOLATION DROP ROW silently drops failing rows. ON VIOLATION FAIL UPDATE stops the pipeline. Without ON VIOLATION, rows are kept but tracked in metrics.',
    hints: ['Use CONSTRAINT name EXPECT (condition)', 'ON VIOLATION DROP ROW removes bad rows', 'Define constraints in the table definition'],
    tags: ['dlt', 'expectations', 'data-quality'],
    concepts: ['dlt-pipeline-basics', 'dlt-expectations'],
  },

  {
    id: 'dlt-7',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DELTA_LIVE_TABLES,
    question: 'What are the three actions you can take when a DLT expectation is violated?',
    options: [
      { id: 'a', text: 'Ignore, Retry, Abort', isCorrect: false },
      { id: 'b', text: 'Skip, Replace, Delete', isCorrect: false },
      { id: 'c', text: 'Track (warn/log), Drop Row, Fail Update', isCorrect: true },
      { id: 'd', text: 'Log, Email, Page', isCorrect: false },
    ],
    explanation: 'Without ON VIOLATION: rows are kept but violations are tracked in metrics (warn). ON VIOLATION DROP ROW: failing rows are silently removed. ON VIOLATION FAIL UPDATE: the pipeline stops with an error.',
    tags: ['dlt', 'expectations', 'violation-actions'],
    concepts: ['dlt-pipeline-basics', 'dlt-expectations'],
  },

  {
    id: 'dlt-8',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DELTA_LIVE_TABLES,
    language: CodeLanguage.PYTHON,
    question: 'Create a DLT table "silver_users" that reads from "bronze_users" with an expectation that "email" is not null — rows that violate should be dropped.\n\nDLT Python expectations are decorators stacked above @dlt.table:\n  @dlt.table\n  @dlt.expect_or_drop("constraint_name", "SQL condition")\n  def table_name():\n    return dlt.read_stream("upstream_table")\n\nThree variants: @dlt.expect (warn), @dlt.expect_or_drop (remove row), @dlt.expect_or_fail (stop pipeline).',
    starterCode: `import dlt\n\n# Stack expectation decorators above @dlt.table\n`,
    testCases: [
      {
        input: 'bronze_users live table',
        expectedOutput: '@dlt.table with @dlt.expect_or_drop',
        description: 'Should create DLT table with expectations',
      },
    ],
    solution: `import dlt\n\n@dlt.table\n@dlt.expect_or_drop("valid_email", "email IS NOT NULL")\ndef silver_users():\n  return dlt.read_stream("bronze_users").select("*")`,
    explanation: '@dlt.expect_or_drop drops rows that violate the constraint. Other decorators: @dlt.expect (warn only), @dlt.expect_or_fail (stop pipeline). Use dlt.read_stream() to read from upstream streaming tables.',
    hints: ['Use @dlt.expect_or_drop decorator', 'First arg is constraint name, second is SQL expression', 'Use dlt.read_stream() for streaming reads'],
    tags: ['dlt', 'python', 'expectations', 'expect_or_drop'],
    concepts: ['dlt-pipeline-basics', 'dlt-expectations'],
  },

  {
    id: 'dlt-9',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DELTA_LIVE_TABLES,
    question: 'What is the difference between a DLT "streaming table" and a "materialized view" in DLT?',
    options: [
      { id: 'a', text: 'Streaming tables are faster', isCorrect: false },
      { id: 'b', text: 'Materialized views can only be used with SQL', isCorrect: false },
      { id: 'c', text: 'There is no difference', isCorrect: false },
      { id: 'd', text: 'Streaming tables process data incrementally (append-only). Materialized views recompute results from the complete input on each update.', isCorrect: true },
    ],
    explanation: 'Streaming live tables (STREAMING LIVE TABLE) process only new data incrementally. Live tables without STREAMING are materialized views that recompute from scratch each time, useful for aggregations that need the full dataset.',
    tags: ['dlt', 'streaming-table', 'materialized-view'],
    concepts: ['dlt-pipeline-basics'],
  },

  {
    id: 'dlt-10',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DELTA_LIVE_TABLES,
    language: CodeLanguage.SQL,
    question: 'Create a DLT Gold materialized view "gold_daily_sales" that reads from "silver_sales" (columns: sale_id, sale_date, product_id, total_amount, customer_id) and aggregates daily_revenue (SUM of total_amount) and num_sales (COUNT) grouped by sale_date.\n\nGold tables use CREATE OR REFRESH LIVE TABLE (without STREAMING) because aggregations need the FULL dataset — they recompute from scratch on each pipeline update. This is different from Bronze/Silver which use STREAMING LIVE TABLE for incremental processing.\n\nReference upstream DLT tables with LIVE.table_name prefix.',
    starterCode: `-- Declare the Gold materialized view gold_daily_sales from LIVE.silver_sales\n-- Columns in silver_sales: sale_id, sale_date, product_id, total_amount, customer_id\n-- Output: sale_date, SUM(total_amount) AS daily_revenue, COUNT(*) AS num_sales\n-- (Gold uses LIVE TABLE without STREAMING — aggregates recompute full dataset)\n`,
    testCases: [
      {
        input: 'silver_sales live table',
        expectedOutput: 'CREATE OR REFRESH LIVE TABLE (not STREAMING)',
        description: 'Should create materialized view',
      },
    ],
    solution: `CREATE OR REFRESH LIVE TABLE gold_daily_sales\nAS SELECT\n  sale_date,\n  SUM(total_amount) as daily_revenue,\n  COUNT(*) as num_sales\nFROM LIVE.silver_sales\nGROUP BY sale_date`,
    explanation: 'Gold uses LIVE TABLE (not STREAMING) because GROUP BY aggregations require the full dataset to produce correct results — you can\'t incrementally aggregate without knowing all the data. The LIVE. prefix tells DLT this table depends on silver_sales, so DLT automatically runs silver first.',
    hints: ['No STREAMING keyword — Gold recomputes from the full dataset', 'FROM LIVE.silver_sales — the LIVE. prefix is required for DLT table references', 'GROUP BY sale_date with SUM and COUNT for the aggregations'],
    tags: ['dlt', 'gold', 'materialized-view', 'aggregation'],
    concepts: ['dlt-pipeline-basics', 'medallion-architecture', 'ps-groupby-agg'],
  },

  {
    id: 'dlt-11',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DELTA_LIVE_TABLES,
    question: 'What pipeline mode should you use for a DLT pipeline in production that runs continuously?',
    options: [
      { id: 'a', text: 'Continuous mode - the pipeline runs continuously, processing new data as it arrives', isCorrect: true },
      { id: 'b', text: 'Triggered mode - it runs once and stops', isCorrect: false },
      { id: 'c', text: 'Batch mode - it runs on a schedule', isCorrect: false },
      { id: 'd', text: 'Manual mode - requires human intervention', isCorrect: false },
    ],
    explanation: 'DLT supports two pipeline modes: "Triggered" (runs once and stops, good for scheduled batch) and "Continuous" (runs continuously, good for low-latency streaming). Choose based on latency requirements.',
    tags: ['dlt', 'pipeline-mode', 'continuous', 'triggered'],
    concepts: ['dlt-pipeline-basics', 'dlt-pipeline-modes'],
  },

  {
    id: 'dlt-12',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DELTA_LIVE_TABLES,
    question: 'How does DLT handle pipeline dependencies between tables?',
    options: [
      { id: 'a', text: 'You must manually specify the order', isCorrect: false },
      { id: 'b', text: 'DLT automatically determines the correct execution order based on LIVE.table_name references', isCorrect: true },
      { id: 'c', text: 'Tables are processed alphabetically', isCorrect: false },
      { id: 'd', text: 'All tables process simultaneously', isCorrect: false },
    ],
    explanation: 'DLT builds a DAG (Directed Acyclic Graph) from the LIVE.table_name references. It automatically determines which tables depend on others and executes them in the correct order.',
    tags: ['dlt', 'dependencies', 'dag'],
    concepts: ['dlt-pipeline-basics', 'dbx-workflows'],
  },

  // =====================================================================
  // DATABRICKS WORKFLOWS / JOBS (15 questions)
  // =====================================================================

  {
    id: 'workflow-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DATABRICKS_WORKFLOWS,
    question: 'What is a Databricks Workflow (Job)?',
    options: [
      { id: 'a', text: 'A type of cluster configuration', isCorrect: false },
      { id: 'b', text: 'A method for creating tables', isCorrect: false },
      { id: 'c', text: 'A way to schedule and orchestrate notebooks, scripts, and pipelines as a series of tasks with dependencies', isCorrect: true },
      { id: 'd', text: 'A version control system', isCorrect: false },
    ],
    explanation: 'Databricks Workflows lets you define multi-task jobs where each task can be a notebook, Python script, JAR, SQL, or DLT pipeline. Tasks can have dependencies forming a DAG.',
    tags: ['workflows', 'jobs', 'orchestration'],
    concepts: ['dbx-workflows'],
  },

  {
    id: 'workflow-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_WORKFLOWS,
    question: 'What types of tasks can be included in a Databricks Workflow?',
    options: [
      { id: 'a', text: 'Only notebooks', isCorrect: false },
      { id: 'b', text: 'Only Python and SQL', isCorrect: false },
      { id: 'c', text: 'Only DLT pipelines', isCorrect: false },
      { id: 'd', text: 'Notebooks, Python scripts, JARs, SQL queries, DLT pipelines, and dbt tasks', isCorrect: true },
    ],
    explanation: 'Workflows support multiple task types: Notebook, Python script, Python wheel, JAR, Spark submit, SQL, DLT pipeline, dbt, and more. This flexibility lets you build complex multi-step pipelines.',
    tags: ['workflows', 'task-types'],
    concepts: ['dbx-workflows'],
  },

  {
    id: 'workflow-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_WORKFLOWS,
    question: 'How do you define dependencies between tasks in a Databricks Workflow?',
    options: [
      { id: 'a', text: 'By specifying "depends_on" for each task, creating a DAG of task execution order', isCorrect: true },
      { id: 'b', text: 'Tasks always run in alphabetical order', isCorrect: false },
      { id: 'c', text: 'Dependencies cannot be defined; all tasks run in parallel', isCorrect: false },
      { id: 'd', text: 'By numbering tasks sequentially', isCorrect: false },
    ],
    explanation: 'Each task can specify one or more tasks it depends on. Databricks uses this to build a DAG and execute tasks in the correct order, running independent tasks in parallel when possible.',
    tags: ['workflows', 'dependencies', 'dag'],
    concepts: ['dbx-workflows'],
  },

  {
    id: 'workflow-4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_WORKFLOWS,
    question: 'What happens when a task in a Databricks Workflow fails?',
    options: [
      { id: 'a', text: 'The entire workflow immediately stops', isCorrect: false },
      { id: 'b', text: 'Downstream dependent tasks are skipped, but independent parallel tasks continue. Retry policies can be configured.', isCorrect: true },
      { id: 'c', text: 'The failed task is automatically retried indefinitely', isCorrect: false },
      { id: 'd', text: 'All other tasks are cancelled', isCorrect: false },
    ],
    explanation: 'When a task fails, its downstream dependents are skipped (they cannot run without the dependency). Independent tasks on other branches continue. You can configure retry policies with max retries and intervals.',
    tags: ['workflows', 'failure-handling', 'retry'],
    concepts: ['dbx-workflows'],
  },

  {
    id: 'workflow-5',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_WORKFLOWS,
    question: 'What scheduling options are available for Databricks Workflows?',
    options: [
      { id: 'a', text: 'Only manual triggers', isCorrect: false },
      { id: 'b', text: 'Only cron schedules', isCorrect: false },
      { id: 'c', text: 'Cron-based schedules, manual triggers, continuous runs, and file arrival triggers', isCorrect: true },
      { id: 'd', text: 'Only hourly intervals', isCorrect: false },
    ],
    explanation: 'Workflows can be triggered on a cron schedule (e.g., daily at 2 AM), manually on demand, continuously (restart after completion), or on file arrival in cloud storage.',
    tags: ['workflows', 'scheduling', 'triggers'],
    concepts: ['dbx-workflows', 'stream-triggers'],
  },

  {
    id: 'workflow-6',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_WORKFLOWS,
    question: 'What is the difference between a job cluster and an all-purpose cluster for Workflows?',
    options: [
      { id: 'a', text: 'Job clusters are faster', isCorrect: false },
      { id: 'b', text: 'All-purpose clusters are only for notebooks', isCorrect: false },
      { id: 'c', text: 'There is no cost difference', isCorrect: false },
      { id: 'd', text: 'Job clusters are created for a specific job run and terminated after; all-purpose clusters persist and are more expensive for jobs', isCorrect: true },
    ],
    explanation: 'Job clusters are ephemeral: created when the job starts, terminated when it ends. They cost less than all-purpose clusters. All-purpose (interactive) clusters persist and are meant for development.',
    tags: ['workflows', 'clusters', 'job-cluster'],
    concepts: ['dbx-workflows', 'dbx-cluster-config'],
  },

  {
    id: 'workflow-7',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_WORKFLOWS,
    language: CodeLanguage.PYTHON,
    question: 'Inside a notebook that runs as a Workflow task, retrieve job parameters "env" and "date" with defaults of "dev" and "2024-01-01".\n\nWhen a Workflow passes parameters to a notebook task, they arrive as widget values. The pattern is:\n1. dbutils.widgets.text("param_name", "default_value") — declares the parameter with a default\n2. dbutils.widgets.get("param_name") — retrieves the current value (either the default or what the Workflow passed)\n\nYou must call text() first to declare the widget, then get() to read it.',
    starterCode: `# Step 1: Declare widgets with defaults\n# Step 2: Read the values\n`,
    testCases: [
      {
        input: 'Job parameters',
        expectedOutput: 'dbutils.widgets.text and dbutils.widgets.get',
        description: 'Should get job parameters with defaults',
      },
    ],
    solution: `dbutils.widgets.text("env", "dev")\ndbutils.widgets.text("date", "2024-01-01")\n\nenv = dbutils.widgets.get("env")\ndate = dbutils.widgets.get("date")`,
    explanation: 'Workflows pass parameters to notebooks via widgets. text() declares the parameter — the default is used when running interactively (not from a Workflow). get() reads the actual value. When a Workflow triggers the notebook, it overrides the defaults with the job parameters.',
    hints: ['Declare first with dbutils.widgets.text("env", "dev")', 'Then read with dbutils.widgets.get("env")', 'The default is only used when running the notebook manually — Workflows override it'],
    tags: ['workflows', 'parameters', 'widgets'],
    concepts: ['dbx-workflows', 'dbx-widgets'],
  },

  {
    id: 'workflow-8',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_WORKFLOWS,
    language: CodeLanguage.PYTHON,
    question: 'A notebook task has computed a record_count from df.count(). Return this count so downstream Workflow tasks can use it.\n\ndbutils.notebook.exit(value) terminates the notebook and returns a STRING value to the Workflow. The value MUST be a string — convert numbers with str(). Downstream tasks access it via {{tasks.task_name.result}} in their parameters.',
    starterCode: `# Process data and return result to Workflow\nrecord_count = df.count()\n# Return the count as a string\n`,
    testCases: [
      {
        input: 'notebook processing result',
        expectedOutput: 'dbutils.notebook.exit()',
        description: 'Should exit with result',
      },
    ],
    solution: `record_count = df.count()\ndbutils.notebook.exit(str(record_count))`,
    explanation: 'notebook.exit() returns a string to the Workflow orchestrator. The value must be a string — passing an int causes an error. Downstream tasks reference it with {{tasks.task_name.result}} in their parameters, enabling task-to-task communication.',
    hints: ['Use dbutils.notebook.exit()', 'Value must be a string', 'Downstream tasks access via task references'],
    tags: ['workflows', 'notebook-exit', 'task-values'],
    concepts: ['dbx-workflows', 'dbx-utilities'],
  },

  {
    id: 'workflow-9',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DATABRICKS_WORKFLOWS,
    question: 'How can you pass values between tasks in a Databricks Workflow?',
    options: [
      { id: 'a', text: 'Using task values: dbutils.jobs.taskValues.set() in upstream task and {{tasks.task_name.values.key}} in downstream parameters', isCorrect: true },
      { id: 'b', text: 'Using global variables', isCorrect: false },
      { id: 'c', text: 'Writing to a shared file', isCorrect: false },
      { id: 'd', text: 'Values cannot be passed between tasks', isCorrect: false },
    ],
    explanation: 'dbutils.jobs.taskValues.set(key, value) stores a value in the upstream task. Downstream tasks reference it using {{tasks.upstream_task_name.values.key}} in their parameters.',
    tags: ['workflows', 'task-values', 'inter-task'],
    concepts: ['dbx-workflows'],
  },

  {
    id: 'workflow-10',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DATABRICKS_WORKFLOWS,
    language: CodeLanguage.PYTHON,
    question: 'Set a task value "row_count" to 1000 so downstream tasks can read it.',
    starterCode: `# Set task value for downstream tasks\n`,
    testCases: [
      {
        input: 'task output',
        expectedOutput: 'dbutils.jobs.taskValues.set("row_count", 1000)',
        description: 'Should set task value',
      },
    ],
    solution: `dbutils.jobs.taskValues.set(key="row_count", value=1000)`,
    explanation: 'dbutils.jobs.taskValues.set() stores key-value pairs that downstream tasks can read. Values can be strings, numbers, or booleans. Downstream tasks reference them with {{tasks.task_name.values.row_count}}.',
    hints: ['Use dbutils.jobs.taskValues.set(key, value)', 'Key is a string, value can be string/number/bool'],
    tags: ['workflows', 'taskValues', 'set'],
    concepts: ['dbx-workflows'],
  },

  {
    id: 'workflow-11',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_WORKFLOWS,
    question: 'What is the purpose of repair runs in Databricks Workflows?',
    options: [
      { id: 'a', text: 'To fix corrupted data files', isCorrect: false },
      { id: 'b', text: 'To re-run only the failed and skipped tasks from a previous run without re-running successful tasks', isCorrect: true },
      { id: 'c', text: 'To optimize cluster performance', isCorrect: false },
      { id: 'd', text: 'To update workflow configurations', isCorrect: false },
    ],
    explanation: 'Repair runs let you retry just the failed and skipped tasks from a previous job run. Successfully completed tasks are skipped, saving time and compute resources.',
    tags: ['workflows', 'repair-run', 'failure-recovery'],
    concepts: ['dbx-workflows'],
  },

  // =====================================================================
  // DATA GOVERNANCE (15 questions)
  // =====================================================================

  {
    id: 'governance-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DATA_GOVERNANCE,
    question: 'What is Unity Catalog in Databricks?',
    options: [
      { id: 'a', text: 'A type of Delta table', isCorrect: false },
      { id: 'b', text: 'A notebook editor', isCorrect: false },
      { id: 'c', text: 'A unified governance solution for all data assets (tables, views, files, ML models) across workspaces', isCorrect: true },
      { id: 'd', text: 'A cluster management tool', isCorrect: false },
    ],
    explanation: 'Unity Catalog provides centralized access control, auditing, lineage, and data discovery across all Databricks workspaces in an account.',
    tags: ['unity-catalog', 'governance'],
    concepts: ['ucat-namespaces', 'ucat-grants'],
  },

  {
    id: 'governance-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATA_GOVERNANCE,
    question: 'What is the three-level namespace in Unity Catalog?',
    options: [
      { id: 'a', text: 'database.table.column', isCorrect: false },
      { id: 'b', text: 'workspace.folder.notebook', isCorrect: false },
      { id: 'c', text: 'cluster.database.table', isCorrect: false },
      { id: 'd', text: 'catalog.schema.table (e.g., prod.sales.orders)', isCorrect: true },
    ],
    explanation: 'Unity Catalog uses a three-level namespace: catalog (top level, like an environment), schema (like a database), and table/view. Example: SELECT * FROM prod_catalog.sales_schema.orders.',
    tags: ['unity-catalog', 'namespace'],
    concepts: ['ucat-namespaces'],
  },

  {
    id: 'governance-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATA_GOVERNANCE,
    language: CodeLanguage.SQL,
    question: 'Grant SELECT permission on the "sales.orders" table to the group "analysts".',
    starterCode: `-- Grant table access\n`,
    testCases: [
      {
        input: 'sales.orders table',
        expectedOutput: 'GRANT SELECT ON TABLE sales.orders TO analysts',
        description: 'Should grant SELECT to analysts',
      },
    ],
    solution: `GRANT SELECT ON TABLE sales.orders TO analysts`,
    explanation: 'GRANT SELECT allows the specified principal (user/group) to read data from the table. In Unity Catalog, you can grant permissions at catalog, schema, or table level.',
    hints: ['Use GRANT permission ON object TO principal', 'SELECT allows reading data'],
    tags: ['governance', 'grant', 'permissions'],
    concepts: ['ucat-grants'],
  },

  {
    id: 'governance-4',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATA_GOVERNANCE,
    language: CodeLanguage.SQL,
    question: 'Grant all privileges on the "analytics" schema to the group "data_engineers".',
    starterCode: `-- Grant schema access\n`,
    testCases: [
      {
        input: 'analytics schema',
        expectedOutput: 'GRANT ALL PRIVILEGES ON SCHEMA analytics TO data_engineers',
        description: 'Should grant all on schema',
      },
    ],
    solution: `GRANT ALL PRIVILEGES ON SCHEMA analytics TO data_engineers`,
    explanation: 'GRANT ALL PRIVILEGES gives full access (CREATE, SELECT, MODIFY, etc.) on the schema and its objects. Be careful - this is a broad permission. Prefer granting specific privileges in production.',
    hints: ['Use GRANT ALL PRIVILEGES ON SCHEMA', 'Grants apply to schema and contained objects'],
    tags: ['governance', 'grant', 'schema', 'all-privileges'],
    concepts: ['ucat-grants', 'ps-dataframe-create'],
  },

  {
    id: 'governance-5',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATA_GOVERNANCE,
    language: CodeLanguage.SQL,
    question: 'Revoke INSERT permission on the "production.customers" table from the group "interns".',
    starterCode: `-- Revoke permissions\n`,
    testCases: [
      {
        input: 'production.customers table',
        expectedOutput: 'REVOKE INSERT ON TABLE production.customers FROM interns',
        description: 'Should revoke INSERT from interns',
      },
    ],
    solution: `REVOKE INSERT ON TABLE production.customers FROM interns`,
    explanation: 'REVOKE removes previously granted permissions. Use the same syntax as GRANT but with REVOKE...FROM instead of GRANT...TO.',
    hints: ['Use REVOKE permission ON object FROM principal', 'Opposite of GRANT...TO'],
    tags: ['governance', 'revoke', 'permissions'],
    concepts: ['ucat-grants'],
  },

  {
    id: 'governance-6',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATA_GOVERNANCE,
    language: CodeLanguage.SQL,
    question: 'Show all grants on the "sales" schema.',
    starterCode: `-- View permissions\n`,
    testCases: [
      {
        input: 'sales schema',
        expectedOutput: 'SHOW GRANTS ON SCHEMA sales',
        description: 'Should show grants on schema',
      },
    ],
    solution: `SHOW GRANTS ON SCHEMA sales`,
    explanation: 'SHOW GRANTS displays all permissions granted on an object. You can also use SHOW GRANTS ON TABLE, SHOW GRANTS ON CATALOG, or SHOW GRANTS TO principal to see a user\'s permissions.',
    hints: ['Use SHOW GRANTS ON SCHEMA', 'Works for tables, schemas, and catalogs'],
    tags: ['governance', 'show-grants', 'audit'],
    concepts: ['ucat-grants', 'ucat-lineage'],
  },

  {
    id: 'governance-7',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATA_GOVERNANCE,
    language: CodeLanguage.SQL,
    question: 'Create a new catalog called "development" in Unity Catalog.',
    starterCode: `-- Create catalog\n`,
    testCases: [
      {
        input: 'new catalog',
        expectedOutput: 'CREATE CATALOG development',
        description: 'Should create catalog',
      },
    ],
    solution: `CREATE CATALOG development`,
    explanation: 'CREATE CATALOG creates a new top-level container in Unity Catalog. Catalogs typically represent environments (dev, staging, prod) or business units.',
    hints: ['Use CREATE CATALOG'],
    tags: ['governance', 'catalog', 'create'],
    concepts: ['ucat-grants', 'ucat-namespaces', 'ps-dataframe-create'],
  },

  {
    id: 'governance-8',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATA_GOVERNANCE,
    language: CodeLanguage.SQL,
    question: 'Create a schema called "raw_data" inside the "production" catalog.',
    starterCode: `-- Create schema in catalog\n`,
    testCases: [
      {
        input: 'production catalog',
        expectedOutput: 'CREATE SCHEMA production.raw_data',
        description: 'Should create schema in catalog',
      },
    ],
    solution: `CREATE SCHEMA production.raw_data`,
    explanation: 'CREATE SCHEMA creates a namespace within a catalog. Tables created inside will have the full path: production.raw_data.table_name.',
    hints: ['Use CREATE SCHEMA catalog.schema_name', 'Fully qualify with catalog name'],
    tags: ['governance', 'schema', 'create'],
    concepts: ['ucat-grants', 'ps-dataframe-create'],
  },

  {
    id: 'governance-9',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATA_GOVERNANCE,
    question: 'What is the difference between a managed table and an external table in Unity Catalog?',
    options: [
      { id: 'a', text: 'Managed tables have data lifecycle managed by Unity Catalog (dropped when table is dropped). External tables point to data at a user-specified location.', isCorrect: true },
      { id: 'b', text: 'Managed tables are faster', isCorrect: false },
      { id: 'c', text: 'External tables cannot be queried with SQL', isCorrect: false },
      { id: 'd', text: 'There is no difference in Unity Catalog', isCorrect: false },
    ],
    explanation: 'Managed tables store data in the catalog\'s managed storage. Dropping a managed table deletes the data. External tables reference data at a user-specified LOCATION; dropping them only removes the metadata.',
    tags: ['governance', 'managed-table', 'external-table'],
    concepts: ['ucat-grants', 'ucat-managed-vs-external'],
  },

  {
    id: 'governance-10',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DATA_GOVERNANCE,
    question: 'What is data lineage in Unity Catalog?',
    options: [
      { id: 'a', text: 'A method for data encryption', isCorrect: false },
      { id: 'b', text: 'Automatic tracking of how data flows between tables, showing upstream sources and downstream consumers', isCorrect: true },
      { id: 'c', text: 'A backup strategy', isCorrect: false },
      { id: 'd', text: 'A data compression technique', isCorrect: false },
    ],
    explanation: 'Unity Catalog automatically captures lineage - which tables read from which sources, which notebooks/jobs produce or consume data. This is crucial for impact analysis and compliance.',
    tags: ['governance', 'lineage', 'audit'],
    concepts: ['ucat-grants', 'ucat-lineage'],
  },

  {
    id: 'governance-11',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATA_GOVERNANCE,
    language: CodeLanguage.SQL,
    question: 'Grant the ability to create tables in the "analytics" schema to the "data_engineers" group using USE SCHEMA and CREATE TABLE permissions.',
    starterCode: `-- Grant create table permission\n`,
    testCases: [
      {
        input: 'analytics schema',
        expectedOutput: 'GRANT USE SCHEMA, CREATE TABLE ON SCHEMA analytics TO data_engineers',
        description: 'Should grant USE and CREATE TABLE',
      },
    ],
    solution: `GRANT USE SCHEMA, CREATE TABLE ON SCHEMA analytics TO data_engineers`,
    explanation: 'USE SCHEMA allows navigating to the schema. CREATE TABLE allows creating tables within it. Both are needed - without USE SCHEMA, the group cannot access the schema even with CREATE TABLE permission.',
    hints: ['Grant multiple permissions with comma separation', 'USE SCHEMA is needed to access the schema'],
    tags: ['governance', 'grant', 'create-table', 'use-schema'],
    concepts: ['ucat-grants', 'ps-dataframe-create', 'ucat-namespaces'],
  },

  {
    id: 'governance-12',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATA_GOVERNANCE,
    question: 'In Unity Catalog, what does the USE CATALOG permission allow?',
    options: [
      { id: 'a', text: 'It grants full read access to all tables', isCorrect: false },
      { id: 'b', text: 'It allows creating new catalogs', isCorrect: false },
      { id: 'c', text: 'It allows browsing the catalog and listing its schemas, but does not grant access to data within the schemas', isCorrect: true },
      { id: 'd', text: 'It allows deleting the catalog', isCorrect: false },
    ],
    explanation: 'USE CATALOG grants access to browse a catalog\'s schemas. It\'s a prerequisite for accessing objects within the catalog but doesn\'t grant data access. You still need USE SCHEMA and SELECT/MODIFY on specific tables.',
    tags: ['governance', 'use-catalog', 'permissions'],
    concepts: ['ucat-grants', 'ucat-namespaces'],
  },

  // =====================================================================
  // DATABRICKS PLATFORM - REPOS / GIT / CLUSTERS (10 questions)
  // =====================================================================

  {
    id: 'platform-repos-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DATABRICKS_PLATFORM,
    question: 'What is Databricks Repos?',
    options: [
      { id: 'a', text: 'A data storage repository', isCorrect: false },
      { id: 'b', text: 'A package manager for Python', isCorrect: false },
      { id: 'c', text: 'A backup system for notebooks', isCorrect: false },
      { id: 'd', text: 'A Git integration that allows you to clone, push, pull, and manage branches directly in the Databricks workspace', isCorrect: true },
    ],
    explanation: 'Databricks Repos integrates with Git providers (GitHub, GitLab, Azure DevOps, Bitbucket). You can clone repos, create branches, commit changes, and push/pull directly from the workspace.',
    tags: ['repos', 'git', 'version-control'],
    concepts: ['dbx-repos'],
  },

  {
    id: 'platform-repos-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_PLATFORM,
    question: 'Which Git operations can you perform directly in Databricks Repos?',
    options: [
      { id: 'a', text: 'Clone, commit, push, pull, create/switch branches, view diffs, and resolve merge conflicts', isCorrect: true },
      { id: 'b', text: 'Only clone and pull', isCorrect: false },
      { id: 'c', text: 'Only commit and push', isCorrect: false },
      { id: 'd', text: 'Git operations are not supported', isCorrect: false },
    ],
    explanation: 'Repos supports full Git workflows: cloning repos, creating branches, committing changes, pushing to remote, pulling updates, viewing diffs, and resolving conflicts - all from the Databricks UI.',
    tags: ['repos', 'git-operations'],
    concepts: ['dbx-repos'],
  },

  {
    id: 'platform-repos-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_PLATFORM,
    question: 'What file types are supported in Databricks Repos?',
    options: [
      { id: 'a', text: 'Only Databricks notebooks', isCorrect: false },
      { id: 'b', text: 'Notebooks (.py, .sql, .scala, .r), plain Python/SQL files, YAML, JSON, and other code files', isCorrect: true },
      { id: 'c', text: 'Only Python files', isCorrect: false },
      { id: 'd', text: 'Only notebook and data files', isCorrect: false },
    ],
    explanation: 'Repos support any file type that Git supports. You can have notebooks, Python modules, SQL files, config files (YAML/JSON), tests, and more - enabling proper software engineering practices.',
    tags: ['repos', 'file-types'],
    concepts: ['dbx-repos'],
  },

  {
    id: 'platform-cluster-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_PLATFORM,
    question: 'What is the difference between an all-purpose cluster and a job cluster?',
    options: [
      { id: 'a', text: 'Job clusters are more powerful', isCorrect: false },
      { id: 'b', text: 'All-purpose clusters cannot run notebooks', isCorrect: false },
      { id: 'c', text: 'All-purpose clusters are interactive and persist until terminated. Job clusters are created for a job run and auto-terminate after.', isCorrect: true },
      { id: 'd', text: 'There is no cost difference', isCorrect: false },
    ],
    explanation: 'All-purpose clusters are for interactive development (notebooks, exploration). Job clusters are ephemeral - created when a job starts, terminated when it ends. Job clusters cost less due to lower pricing tier.',
    tags: ['clusters', 'all-purpose', 'job-cluster'],
    concepts: ['dbx-cluster-config'],
  },

  {
    id: 'platform-cluster-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_PLATFORM,
    question: 'What is cluster auto-scaling in Databricks?',
    options: [
      { id: 'a', text: 'Automatically upgrading the Spark version', isCorrect: false },
      { id: 'b', text: 'Automatically restarting failed clusters', isCorrect: false },
      { id: 'c', text: 'Automatically selecting the cheapest instance type', isCorrect: false },
      { id: 'd', text: 'Automatically adding or removing worker nodes based on workload demand, between a minimum and maximum number of workers', isCorrect: true },
    ],
    explanation: 'Auto-scaling adjusts the number of worker nodes between min and max values based on workload. Under heavy load, workers are added. When idle, workers are removed to save costs.',
    tags: ['clusters', 'auto-scaling'],
    concepts: ['dbx-cluster-config'],
  },

  {
    id: 'platform-cluster-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_PLATFORM,
    question: 'What is auto-termination for Databricks clusters?',
    options: [
      { id: 'a', text: 'Automatically shutting down a cluster after a configurable period of inactivity to save costs', isCorrect: true },
      { id: 'b', text: 'Automatically terminating failed jobs', isCorrect: false },
      { id: 'c', text: 'Removing old data from the cluster', isCorrect: false },
      { id: 'd', text: 'Automatically downgrading the cluster size', isCorrect: false },
    ],
    explanation: 'Auto-termination stops the cluster after a set period of inactivity (default 120 minutes). This prevents clusters from running indefinitely and incurring unnecessary costs.',
    tags: ['clusters', 'auto-termination', 'cost'],
    concepts: ['dbx-cluster-config'],
  },

  {
    id: 'platform-cluster-4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DATABRICKS_PLATFORM,
    question: 'What is a Databricks cluster policy?',
    options: [
      { id: 'a', text: 'A data access policy', isCorrect: false },
      { id: 'b', text: 'A set of rules that limits cluster configuration options for users, controlling costs and enforcing standards', isCorrect: true },
      { id: 'c', text: 'A network security rule', isCorrect: false },
      { id: 'd', text: 'A backup schedule', isCorrect: false },
    ],
    explanation: 'Cluster policies let admins restrict what cluster configurations users can create. For example, limiting instance types, enforcing auto-termination, or restricting to specific Spark versions.',
    tags: ['clusters', 'policies', 'governance'],
    concepts: ['dbx-cluster-config', 'ucat-grants'],
  },

  {
    id: 'platform-sql-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_PLATFORM,
    language: CodeLanguage.SQL,
    question: 'Use DESCRIBE EXTENDED to view detailed metadata about the "sales.orders" table.',
    starterCode: `-- View table metadata\n`,
    testCases: [
      {
        input: 'sales.orders table',
        expectedOutput: 'DESCRIBE EXTENDED sales.orders',
        description: 'Should describe table with extended info',
      },
    ],
    solution: `DESCRIBE EXTENDED sales.orders`,
    explanation: 'DESCRIBE EXTENDED shows column names, types, comments, plus detailed table metadata including location, provider, properties, and statistics. DESCRIBE TABLE gives only column info.',
    hints: ['Use DESCRIBE EXTENDED', 'Shows location, properties, and statistics'],
    tags: ['sql', 'describe', 'metadata'],
    concepts: ['ps-dataframe-create'],
  },

  {
    id: 'platform-sql-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DATABRICKS_PLATFORM,
    language: CodeLanguage.SQL,
    question: 'List all tables in the "analytics" schema.',
    starterCode: `-- List tables\n`,
    testCases: [
      {
        input: 'analytics schema',
        expectedOutput: 'SHOW TABLES IN analytics',
        description: 'Should list tables in schema',
      },
    ],
    solution: `SHOW TABLES IN analytics`,
    explanation: 'SHOW TABLES lists all tables and views in a schema. You can also use SHOW TABLES IN catalog.schema for fully qualified paths.',
    hints: ['Use SHOW TABLES IN schema_name'],
    tags: ['sql', 'show-tables', 'metadata'],
    concepts: ['sql-temp-views', 'ps-dataframe-create'],
  },

  {
    id: 'platform-sql-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_PLATFORM,
    language: CodeLanguage.SQL,
    question: 'Using the "users" table (columns: user_id, username, account_status, email), create a temporary view called "active_users" that contains only users where account_status is "active".\n\nA temporary view is a named query that exists only for the current Spark session — it disappears when the cluster restarts. Use CREATE OR REPLACE TEMP VIEW to define it, followed by AS and the SELECT query.',
    starterCode: `-- Define a session-scoped view named active_users limiting to active accounts\n`,
    testCases: [
      {
        input: 'users table',
        expectedOutput: 'CREATE OR REPLACE TEMP VIEW active_users',
        description: 'Should create temporary view',
      },
    ],
    solution: `CREATE OR REPLACE TEMP VIEW active_users AS\nSELECT * FROM users WHERE account_status = "active"`,
    explanation: 'CREATE OR REPLACE TEMP VIEW creates a session-scoped view that disappears when the cluster restarts. "OR REPLACE" overwrites the view if it already exists, avoiding errors on re-run. The AS keyword introduces the SELECT query that defines the view\'s contents.',
    hints: ['Use CREATE OR REPLACE TEMP VIEW view_name AS ...', 'Follow it with a SELECT query that filters by account_status', 'Temporary views are session-scoped — they don\'t persist'],
    tags: ['sql', 'temp-view', 'views'],
    concepts: ['sql-temp-views'],
  },

  // =====================================================================
  // PERFORMANCE TUNING (20 questions)
  // =====================================================================

  {
    id: 'perf-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.SPARK_OPTIMIZATION,
    question: 'What is a broadcast join in Spark?',
    options: [
      { id: 'a', text: 'A join that broadcasts the result to all users', isCorrect: false },
      { id: 'b', text: 'A join that only works with streaming data', isCorrect: false },
      { id: 'c', text: 'A join strategy where the smaller DataFrame is sent to all worker nodes to avoid shuffling the larger DataFrame', isCorrect: true },
      { id: 'd', text: 'A join that runs on a single node', isCorrect: false },
    ],
    explanation: 'Broadcast joins copy the smaller table to every worker node. The larger table stays in place, avoiding an expensive shuffle. Spark auto-broadcasts tables under 10MB by default (spark.sql.autoBroadcastJoinThreshold).',
    tags: ['broadcast', 'join', 'performance', 'optimization'],
    concepts: ['ps-broadcast-join', 'sql-joins-inner-outer', 'ps-cache-persist', 'ps-execution-plans'],
  },

  {
    id: 'perf-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.SPARK_OPTIMIZATION,
    language: CodeLanguage.PYTHON,
    question: 'Using DataFrame "large_df" (millions of rows) and "small_df" (100 rows, columns: id, name), perform a broadcast join on "id" to avoid shuffling the large DataFrame.',
    starterCode: `# Import the broadcast hint from pyspark.sql.functions\n# Join large_df to the broadcasted small_df on "id" and assign to result\n`,
    testCases: [
      {
        input: 'large_df and small_df',
        expectedOutput: 'broadcast(small_df)',
        description: 'Should use broadcast join',
      },
    ],
    solution: `from pyspark.sql.functions import broadcast\n\nresult = large_df.join(broadcast(small_df), "id")`,
    explanation: 'Wrapping the smaller DataFrame in broadcast() forces Spark to broadcast it to all nodes, avoiding a shuffle on the larger DataFrame. Use this when one side is small enough to fit in memory.',
    hints: ['Use broadcast() on the smaller DataFrame', 'Import from pyspark.sql.functions'],
    tags: ['broadcast', 'join', 'performance'],
    concepts: ['ps-broadcast-join', 'sql-joins-inner-outer', 'ps-cache-persist'],
  },

  {
    id: 'perf-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.SPARK_OPTIMIZATION,
    question: 'What is the difference between repartition() and coalesce()?',
    options: [
      { id: 'a', text: 'They are identical operations', isCorrect: false },
      { id: 'b', text: 'coalesce() increases partitions, repartition() decreases them', isCorrect: false },
      { id: 'c', text: 'repartition() is for DataFrames, coalesce() is for RDDs only', isCorrect: false },
      { id: 'd', text: 'repartition() does a full shuffle to create any number of partitions; coalesce() reduces partitions without a full shuffle', isCorrect: true },
    ],
    explanation: 'repartition(n) does a full shuffle and can increase or decrease partitions. coalesce(n) avoids a full shuffle by combining existing partitions — it can only decrease the number of partitions. Use coalesce() when reducing partitions for better performance.',
    tags: ['repartition', 'coalesce', 'partitioning', 'performance'],
    concepts: ['ps-partitioning', 'ps-null-handling', 'ps-cache-persist'],
  },

  {
    id: 'perf-4',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.SPARK_OPTIMIZATION,
    language: CodeLanguage.PYTHON,
    question: 'DataFrame "df" currently has 200 partitions but you want to write it to 10 output files. Reduce the partitions to 10 without a full shuffle.',
    starterCode: `# Reduce partitions efficiently\nresult = df.`,
    testCases: [
      {
        input: 'df with 200 partitions',
        expectedOutput: 'df.coalesce(10)',
        description: 'Should coalesce to 10 partitions',
      },
    ],
    solution: `result = df.coalesce(10)`,
    explanation: 'coalesce(n) reduces partitions without a full shuffle by merging existing partitions. Much faster than repartition() when you only need to decrease partition count.',
    hints: ['Use coalesce() to reduce partitions', 'coalesce avoids a full shuffle unlike repartition'],
    tags: ['coalesce', 'partitioning', 'performance'],
    concepts: ['ps-null-handling', 'ps-partitioning', 'ps-cache-persist'],
  },

  {
    id: 'perf-5',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.SPARK_OPTIMIZATION,
    language: CodeLanguage.PYTHON,
    question: 'Repartition DataFrame "df" into 8 partitions based on the "country" column for optimized downstream joins on country.',
    starterCode: `# Repartition by column\nresult = df.`,
    testCases: [
      {
        input: 'df with country column',
        expectedOutput: 'df.repartition(8, "country")',
        description: 'Should repartition by country',
      },
    ],
    solution: `result = df.repartition(8, "country")`,
    explanation: 'repartition(n, col) redistributes data so rows with the same column value end up in the same partition. This optimizes subsequent joins or aggregations on that column by avoiding shuffles.',
    hints: ['Use repartition(numPartitions, column)', 'Column-based repartitioning co-locates data'],
    tags: ['repartition', 'partitioning', 'performance'],
    concepts: ['ps-partitioning', 'ps-cache-persist'],
  },

  {
    id: 'perf-6',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.SPARK_OPTIMIZATION,
    question: 'What is Adaptive Query Execution (AQE) in Spark?',
    options: [
      { id: 'a', text: 'A feature that optimises query plans at runtime based on actual data statistics, including coalescing shuffle partitions and handling data skew', isCorrect: true },
      { id: 'b', text: 'A tool for writing adaptive SQL queries', isCorrect: false },
      { id: 'c', text: 'A method for adaptive cluster scaling', isCorrect: false },
      { id: 'd', text: 'A caching strategy', isCorrect: false },
    ],
    explanation: 'AQE (enabled by default in Spark 3.x/Databricks) re-optimises the query plan during execution using real runtime statistics. It can coalesce small shuffle partitions, convert sort-merge joins to broadcast joins, and optimise skewed joins.',
    tags: ['aqe', 'adaptive', 'optimization', 'performance'],
    concepts: ['ps-aqe', 'ps-execution-plans', 'ps-cache-persist'],
  },

  {
    id: 'perf-7',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.SPARK_OPTIMIZATION,
    question: 'What is data skew and why is it a problem in Spark?',
    options: [
      { id: 'a', text: 'When data is missing values', isCorrect: false },
      { id: 'b', text: 'When data is unevenly distributed across partitions, causing some tasks to take much longer than others and creating bottlenecks', isCorrect: true },
      { id: 'c', text: 'When data types don\'t match between columns', isCorrect: false },
      { id: 'd', text: 'When data is stored in too many files', isCorrect: false },
    ],
    explanation: 'Data skew occurs when some partition keys have far more data than others (e.g., 99% of orders from one country). The tasks processing large partitions become bottlenecks while other executors sit idle. Solutions include salting keys, broadcast joins, or AQE skew join optimization.',
    tags: ['skew', 'partitioning', 'performance'],
    concepts: ['ps-aqe', 'ps-partitioning', 'ps-cache-persist'],
  },

  {
    id: 'perf-8',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.SPARK_OPTIMIZATION,
    question: 'What is the difference between cache() and persist() in Spark?',
    options: [
      { id: 'a', text: 'cache() is faster than persist()', isCorrect: false },
      { id: 'b', text: 'persist() is deprecated in favour of cache()', isCorrect: false },
      { id: 'c', text: 'cache() stores in memory only (MEMORY_ONLY). persist() lets you choose a storage level (MEMORY_ONLY, MEMORY_AND_DISK, DISK_ONLY, etc.)', isCorrect: true },
      { id: 'd', text: 'They are completely identical', isCorrect: false },
    ],
    explanation: 'cache() is shorthand for persist(StorageLevel.MEMORY_AND_DISK). persist() accepts a StorageLevel parameter for more control: MEMORY_ONLY (fast but may spill), MEMORY_AND_DISK (spills to disk), DISK_ONLY, etc.',
    tags: ['cache', 'persist', 'storage-level', 'performance'],
    concepts: ['ps-cache-persist'],
  },

  {
    id: 'perf-9',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.SPARK_OPTIMIZATION,
    language: CodeLanguage.PYTHON,
    question: 'Cache DataFrame "df" in memory, trigger materialization with count(), then use it for two different aggregations.',
    starterCode: `# Cache and reuse\n`,
    testCases: [
      {
        input: 'df to cache',
        expectedOutput: 'df.cache() and df.count()',
        description: 'Should cache and materialize',
      },
    ],
    solution: `df_cached = df.cache()\ndf_cached.count()\n\navg_result = df_cached.groupBy("dept").avg("salary")\nmax_result = df_cached.groupBy("dept").max("salary")`,
    explanation: 'cache() is lazy — it only marks the DataFrame for caching. You need an action like count() to actually materialize and cache the data. After that, subsequent operations read from the cache instead of recomputing.',
    hints: ['cache() is lazy — trigger with an action like count()', 'Reuse the cached reference for multiple operations'],
    tags: ['cache', 'lazy', 'materialization', 'performance'],
    concepts: ['ps-cache-persist', 'ps-actions-vs-transforms'],
  },

  {
    id: 'perf-10',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.SPARK_OPTIMIZATION,
    language: CodeLanguage.PYTHON,
    question: 'Unpersist the cached DataFrame "df_cached" to free up memory.',
    starterCode: `# Free cached memory\n`,
    testCases: [
      {
        input: 'cached DataFrame',
        expectedOutput: 'df_cached.unpersist()',
        description: 'Should unpersist',
      },
    ],
    solution: `df_cached.unpersist()`,
    explanation: 'unpersist() removes the DataFrame from the cache and frees memory. Always unpersist when you no longer need the cached data to avoid memory pressure.',
    hints: ['Use .unpersist() on the cached DataFrame'],
    tags: ['unpersist', 'cache', 'memory', 'performance'],
    concepts: ['ps-cache-persist'],
  },

  {
    id: 'perf-11',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.SPARK_OPTIMIZATION,
    question: 'What is partition pruning in Spark?',
    options: [
      { id: 'a', text: 'Deleting unused partitions from a table', isCorrect: false },
      { id: 'b', text: 'Merging small partitions into larger ones', isCorrect: false },
      { id: 'c', text: 'Splitting large partitions into smaller ones', isCorrect: false },
      { id: 'd', text: 'An optimisation where Spark only reads the partitions that are relevant to the query filter, skipping the rest', isCorrect: true },
    ],
    explanation: 'When a table is partitioned by a column (e.g., date) and you filter by that column (WHERE date = "2024-01-01"), Spark skips reading irrelevant partitions entirely. This dramatically reduces I/O and speeds up queries.',
    tags: ['partition-pruning', 'partitioning', 'optimization'],
    concepts: ['ps-partition-pruning', 'ps-partitioning', 'ps-execution-plans'],
  },

  {
    id: 'perf-12',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.SPARK_OPTIMIZATION,
    language: CodeLanguage.PYTHON,
    question: 'Write DataFrame "df" (columns: sale_id, product, amount, sale_date, year, month) to a Delta table at path "/data/sales", partitioned by "year" and "month" columns. Use overwrite mode.\n\nThe write chain for a partitioned Delta table:\n  df.write.format("delta").partitionBy("col1", "col2").mode("overwrite").save(path)\n\npartitionBy() creates a directory structure like /data/sales/year=2024/month=01/ — when you later query with WHERE year = 2024, Spark only reads that partition (partition pruning). Only use low-cardinality columns (year, month, country) — high-cardinality columns (user_id) create millions of tiny files.',
    starterCode: `# Write partitioned Delta table\n# df: sale_id, product, amount, sale_date, year, month\ndf.write\n  .format("delta")\n  .partitionBy(`,
    testCases: [
      {
        input: 'df with year and month columns',
        expectedOutput: '.partitionBy("year", "month").format("delta")',
        description: 'Should write partitioned by year and month',
      },
    ],
    solution: `df.write\n  .format("delta")\n  .partitionBy("year", "month")\n  .mode("overwrite")\n  .save("/data/sales")`,
    explanation: 'partitionBy("year", "month") creates a nested directory structure: /data/sales/year=2024/month=01/. Queries filtering on these columns skip irrelevant directories entirely (partition pruning). mode("overwrite") replaces existing data. Rule of thumb: only partition by columns with fewer than ~1000 distinct values.',
    hints: ['partitionBy("year", "month") — pass column names as strings', 'mode("overwrite") replaces existing data, "append" adds to it', '.save(path) for path-based tables, .saveAsTable(name) for metastore tables'],
    tags: ['partitionBy', 'write', 'delta', 'performance'],
    concepts: ['ps-partitioning', 'ps-write-modes', 'delta-acid', 'ps-cache-persist'],
  },

  {
    id: 'perf-13',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.SPARK_OPTIMIZATION,
    question: 'Why should you avoid using Python UDFs (User Defined Functions) in PySpark when possible?',
    options: [
      { id: 'a', text: 'Python UDFs serialise data between JVM and Python, causing significant overhead. Built-in Spark functions run natively on the JVM and are much faster.', isCorrect: true },
      { id: 'b', text: 'Python UDFs are not supported in PySpark', isCorrect: false },
      { id: 'c', text: 'Python UDFs cannot handle null values', isCorrect: false },
      { id: 'd', text: 'Python UDFs only work on small datasets', isCorrect: false },
    ],
    explanation: 'Python UDFs require serialising each row from the JVM to Python and back, which is very slow. Always prefer built-in Spark SQL functions. If you must use a UDF, consider Pandas UDFs (vectorised UDFs) which process data in Arrow batches for much better performance.',
    tags: ['udf', 'python', 'performance', 'optimization'],
    concepts: ['ps-udf-pandas-udf', 'ps-cache-persist', 'ps-execution-plans'],
  },

  {
    id: 'perf-14',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.SPARK_OPTIMIZATION,
    question: 'What is the default number of shuffle partitions in Spark, and when should you change it?',
    options: [
      { id: 'a', text: '100. Never change it.', isCorrect: false },
      { id: 'b', text: '200. Reduce it for small datasets (e.g., 10-20) to avoid overhead of too many small tasks, or increase for very large datasets.', isCorrect: true },
      { id: 'c', text: '1000. Always reduce it.', isCorrect: false },
      { id: 'd', text: 'It equals the number of cores.', isCorrect: false },
    ],
    explanation: 'spark.sql.shuffle.partitions defaults to 200. For small datasets, 200 partitions means 200 tiny tasks with more scheduling overhead than actual work. For very large datasets, you may need more. AQE can auto-coalesce small partitions if enabled.',
    tags: ['shuffle-partitions', 'configuration', 'performance'],
    concepts: ['ps-shuffle', 'ps-cache-persist'],
  },

  {
    id: 'perf-15',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.SPARK_OPTIMIZATION,
    language: CodeLanguage.PYTHON,
    question: 'Set the number of shuffle partitions to 8 for a small dataset using spark.conf.',
    starterCode: `# Set shuffle partitions\n`,
    testCases: [
      {
        input: 'spark session',
        expectedOutput: 'spark.conf.set("spark.sql.shuffle.partitions", 8)',
        description: 'Should set shuffle partitions to 8',
      },
    ],
    solution: `spark.conf.set("spark.sql.shuffle.partitions", 8)`,
    explanation: 'Reducing shuffle partitions for small datasets avoids the overhead of 200 tiny tasks. Set this before running operations that trigger shuffles (joins, groupBy, etc.).',
    hints: ['Use spark.conf.set()', 'Property is spark.sql.shuffle.partitions'],
    tags: ['shuffle-partitions', 'conf', 'performance'],
    concepts: ['ps-shuffle', 'ps-cache-persist'],
  },

  {
    id: 'perf-16',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.SPARK_OPTIMIZATION,
    question: 'Which of the following operations triggers a shuffle in Spark?',
    options: [
      { id: 'a', text: 'select(), filter(), withColumn(), drop()', isCorrect: false },
      { id: 'b', text: 'cache(), persist(), show()', isCorrect: false },
      { id: 'c', text: 'join(), groupBy(), repartition(), distinct()', isCorrect: true },
      { id: 'd', text: 'read(), write(), save()', isCorrect: false },
    ],
    explanation: 'Shuffles move data across the network between executors. Wide transformations like join, groupBy, repartition, and distinct require data redistribution. Narrow transformations (select, filter, withColumn) operate within existing partitions without shuffling.',
    tags: ['shuffle', 'wide-narrow', 'transformations', 'performance'],
    concepts: ['ps-shuffle', 'ps-narrow-vs-wide', 'ps-actions-vs-transforms', 'ps-cache-persist'],
  },

  {
    id: 'perf-17',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.SPARK_OPTIMIZATION,
    question: 'What is the Spark UI used for?',
    options: [
      { id: 'a', text: 'Writing Spark code', isCorrect: false },
      { id: 'b', text: 'Creating dashboards for business users', isCorrect: false },
      { id: 'c', text: 'Managing cluster permissions', isCorrect: false },
      { id: 'd', text: 'Monitoring and debugging Spark jobs — viewing stages, tasks, shuffle read/write, execution plans, and identifying bottlenecks', isCorrect: true },
    ],
    explanation: 'The Spark UI (available on port 4040 during execution) shows job/stage/task breakdown, DAG visualisation, shuffle metrics, storage info, and SQL query plans. It\'s essential for diagnosing slow queries, data skew, and spilling.',
    tags: ['spark-ui', 'monitoring', 'debugging', 'performance'],
    concepts: ['ps-execution-plans', 'ps-cache-persist'],
  },

  {
    id: 'perf-18',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.SPARK_OPTIMIZATION,
    language: CodeLanguage.PYTHON,
    question: 'Use explain() to view the physical execution plan for a query that joins "orders_df" with "customers_df" on customer_id.',
    starterCode: `# View execution plan\n`,
    testCases: [
      {
        input: 'two DataFrames',
        expectedOutput: '.explain()',
        description: 'Should show execution plan',
      },
    ],
    solution: `orders_df.join(customers_df, "customer_id").explain()`,
    explanation: 'explain() prints the physical execution plan showing how Spark will execute the query. Use explain(True) for extended info (logical + physical plans). Look for BroadcastHashJoin vs SortMergeJoin to understand join strategies.',
    hints: ['Chain .explain() after your transformation', 'explain(True) shows more detail'],
    tags: ['explain', 'execution-plan', 'debugging', 'performance'],
    concepts: ['ps-execution-plans', 'ps-cache-persist'],
  },

  {
    id: 'perf-19',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.SPARK_OPTIMIZATION,
    question: 'What is predicate pushdown in Spark?',
    options: [
      { id: 'a', text: 'An optimisation where filter conditions are pushed down to the data source level so only matching data is read from storage', isCorrect: true },
      { id: 'b', text: 'A method for pushing data to downstream systems', isCorrect: false },
      { id: 'c', text: 'A technique for ordering predicates in WHERE clauses', isCorrect: false },
      { id: 'd', text: 'A way to push computations to the driver node', isCorrect: false },
    ],
    explanation: 'Predicate pushdown pushes WHERE filters down to the storage layer (Parquet, Delta). Instead of reading all data and filtering in Spark, the file reader skips row groups/files that don\'t match. This dramatically reduces I/O.',
    tags: ['predicate-pushdown', 'optimization', 'io', 'performance'],
    concepts: ['ps-execution-plans', 'ps-io-csv', 'ps-cache-persist'],
  },

  {
    id: 'perf-20',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.SPARK_OPTIMIZATION,
    question: 'When writing data, what is the advantage of using Delta Lake format over plain Parquet?',
    options: [
      { id: 'a', text: 'Delta files are smaller than Parquet', isCorrect: false },
      { id: 'b', text: 'Delta adds ACID transactions, time travel, schema enforcement, OPTIMIZE/ZORDER for compaction, and better performance with data skipping', isCorrect: true },
      { id: 'c', text: 'Delta is faster to write but slower to read', isCorrect: false },
      { id: 'd', text: 'There is no performance difference', isCorrect: false },
    ],
    explanation: 'Delta Lake builds on Parquet but adds a transaction log, enabling ACID transactions, time travel, schema evolution, and data skipping via file-level statistics. OPTIMIZE compacts small files and ZORDER co-locates data for faster queries.',
    tags: ['delta', 'parquet', 'comparison', 'performance'],
    concepts: ['delta-acid', 'ps-io-parquet', 'ps-cache-persist'],
  },
];
