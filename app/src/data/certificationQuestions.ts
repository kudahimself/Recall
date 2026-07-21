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
      { id: 'a', text: 'Storage management component in Spark SQL that compresses real-time stream event payloads', isCorrect: false },
      { id: 'b', text: 'Batch processing execution framework designed exclusively for static database queries', isCorrect: false },
      { id: 'c', text: 'Stream processing engine built on Spark SQL that treats streaming data as an unbounded table', isCorrect: true },
      { id: 'd', text: 'Distributed relational database system for managing low-latency ACID transactions', isCorrect: false },
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
      { id: 'a', text: 'Insert mode, Replace mode, Delete mode', isCorrect: false },
      { id: 'b', text: 'Read mode, Write mode, Execute mode', isCorrect: false },
      { id: 'c', text: 'Start mode, Stop mode, Restart mode', isCorrect: false },
      { id: 'd', text: 'Append mode, Complete mode, Update mode', isCorrect: true },
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
    question: 'Read a stream from the Delta table named "events" into a streaming DataFrame "stream_df".',
    starterCode: `stream_df = spark.readStream`,
    testCases: [
      {
        input: 'Delta table "events"',
        expectedOutput: 'spark.readStream.format("delta").table("events")',
        description: 'Should read Delta table as stream',
      },
    ],
    solution: `stream_df = spark.readStream.format("delta").table("events")\n# OR\nstream_df = spark.readStream.table("events")`,
    explanation: 'Use spark.readStream to create a streaming DataFrame. For Delta tables, use .format("delta").table("tableName") or shorthand .table("tableName").',
    hints: ['Use spark.readStream to initiate the stream reader', 'Specify the target table using .table("events")'],
    tieredHints: {
      apiSignature: 'spark.readStream.format(source).table(tableName) -> DataFrame',
      skeleton: 'stream_df = spark.____.____("delta").____("events")',
    },
    tags: ['streaming', 'delta', 'readStream'],
    concepts: ['stream-readstream-writestream', 'delta-acid'],
  },

  {
    id: 'streaming-4',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.STRUCTURED_STREAMING,
    language: CodeLanguage.PYTHON,
    question: 'Write the streaming DataFrame "stream_df" to a Delta table named "output_events" in append mode. Configure the checkpoint path to "/checkpoints/events".',
    starterCode: `query = stream_df`,
    testCases: [
      {
        input: 'streaming DataFrame',
        expectedOutput: 'writeStream.format("delta").outputMode("append").option("checkpointLocation", "/checkpoints/events").toTable("output_events")',
        description: 'Should write stream to Delta with checkpoint',
      },
    ],
    solution: `query = stream_df.writeStream.format("delta").outputMode("append").option("checkpointLocation", "/checkpoints/events").toTable("output_events")\n# OR\nquery = stream_df.writeStream.outputMode("append").option("checkpointLocation", "/checkpoints/events").toTable("output_events")`,
    explanation: 'writeStream writes a streaming DataFrame. Use .toTable("name") to write to a named table. checkpointLocation is required for fault tolerance — it stores progress so the stream can recover from failures.',
    hints: ['Use .writeStream with .toTable("name") to write to a table', 'Set outputMode to "append"', 'Always set checkpointLocation'],
    tieredHints: {
      apiSignature: 'DataStreamWriter.outputMode(outputMode).option(key, value).toTable(tableName)',
      skeleton: 'query = stream_df.____.format("delta").____("append").option("checkpointLocation", "/checkpoints/events").____("output_events")',
    },
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
      { id: 'a', text: 'To store progress and state metadata for fault-tolerant stream recovery', isCorrect: true },
      { id: 'b', text: 'To compress micro-batch data payloads before writing to target storage tables', isCorrect: false },
      { id: 'c', text: 'To schedule and trigger automated execution of streaming notebook workflows', isCorrect: false },
      { id: 'd', text: 'To restrict the maximum volume of rows processed in a single micro-batch', isCorrect: false },
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
      { id: 'a', text: 'Once trigger — processes all available data once in a single batch then stops', isCorrect: false },
      { id: 'b', text: 'Default trigger (processingTime="0 seconds") — starts the next batch with zero delay', isCorrect: true },
      { id: 'c', text: 'Continuous trigger — experimental engine providing low-latency row-by-row processing', isCorrect: false },
      { id: 'd', text: 'Fixed interval trigger (e.g. 30 seconds) — enforces explicit pauses between micro-batches', isCorrect: false },
    ],
    explanation: 'When no trigger is specified, Spark defaults to processingTime="0 seconds" — it starts the next micro-batch immediately after the previous one finishes with zero wait time.',
    tags: ['streaming', 'trigger'],
    concepts: ['stream-readstream-writestream', 'stream-triggers'],
  },

  {
    id: 'streaming-7',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.STRUCTURED_STREAMING,
    language: CodeLanguage.PYTHON,
    question: 'Configure the streaming DataFrame "stream_df" to write to the Delta table "output" in append mode, executing micro-batches every 30 seconds. Store checkpoints at "/checkpoints/data".',
    starterCode: `query = stream_df`,
    testCases: [
      {
        input: 'streaming query',
        expectedOutput: '.trigger(processingTime="30 seconds")',
        description: 'Should set 30 second trigger',
      },
    ],
    solution: `query = stream_df.writeStream.format("delta").outputMode("append").option("checkpointLocation", "/checkpoints/data").trigger(processingTime="30 seconds").toTable("output")\n# OR\nquery = stream_df.writeStream.outputMode("append").option("checkpointLocation", "/checkpoints/data").trigger(processingTime="30 seconds").toTable("output")`,
    explanation: 'processingTime trigger runs micro-batches at the specified interval. If processing takes longer than the interval, the next batch starts immediately after the previous one finishes.',
    hints: ['Configure trigger using processingTime="30 seconds"', 'Set checkpointLocation and outputMode before writing to table'],
    tieredHints: {
      apiSignature: 'DataStreamWriter.trigger(processingTime=None).toTable(tableName)',
      skeleton: 'query = stream_df.____.____("delta").____("append").____("checkpointLocation", "/checkpoints/data").____(____="30 seconds").____("output")',
    },
    tags: ['streaming', 'trigger', 'processingTime'],
    concepts: ['stream-readstream-writestream', 'stream-triggers'],
  },

  {
    id: 'streaming-8',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.STRUCTURED_STREAMING,
    language: CodeLanguage.PYTHON,
    question: 'Configure the streaming DataFrame "stream_df" to process all currently available incoming data across micro-batches and then automatically terminate execution. Persist the output in append mode to Delta table "output" with checkpoint path "/checkpoints/data".',
    starterCode: `query = stream_df`,
    testCases: [
      {
        input: 'streaming query',
        expectedOutput: '.trigger(availableNow=True)',
        description: 'Should use availableNow trigger',
      },
    ],
    solution: `query = stream_df.writeStream.format("delta").outputMode("append").option("checkpointLocation", "/checkpoints/data").trigger(availableNow=True).toTable("output")\n# OR\nquery = stream_df.writeStream.outputMode("append").option("checkpointLocation", "/checkpoints/data").trigger(availableNow=True).toTable("output")`,
    explanation: 'Trigger.AvailableNow processes all available data in multiple batches then stops. Unlike Trigger.Once (deprecated), it can process data in multiple micro-batches for better scalability.',
    hints: ['Set availableNow=True in trigger', 'Write to Delta table with checkpointing enabled'],
    tieredHints: {
      apiSignature: 'DataStreamWriter.trigger(availableNow=False).toTable(tableName)',
      skeleton: 'query = stream_df.____.____("delta").____("append").____("checkpointLocation", "/checkpoints/data").____(____=____).____("output")',
    },
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
      { id: 'a', text: 'Unique micro-batch commit identifier generated for each transactional stream batch', isCorrect: false },
      { id: 'b', text: 'Max file size constraint applied when writing streaming parquet partition outputs', isCorrect: false },
      { id: 'c', text: 'Threshold defining how late data can arrive before being dropped from stateful aggregations', isCorrect: true },
      { id: 'd', text: 'Encryption key used to secure stream payloads transferred between worker nodes', isCorrect: false },
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
    question: 'Given streaming DataFrame "stream_df" containing event records, configure a 10-minute threshold on column "event_time" to manage late-arriving records during stateful operations.',
    starterCode: `result = stream_df`,
    testCases: [
      {
        input: 'streaming DataFrame with event_time column',
        expectedOutput: '.withWatermark("event_time", "10 minutes")',
        description: 'Should add 10-minute watermark',
      },
    ],
    solution: `result = stream_df.withWatermark("event_time", "10 minutes")\n# OR\nresult = stream_df.withWatermark('event_time', '10 minutes')`,
    explanation: 'withWatermark(eventTimeColumn, delayThreshold) tells Spark to wait up to the threshold for late data. After that, late records are dropped from stateful operations like aggregations and joins.',
    hints: ['Apply watermark configuration to the streaming DataFrame', 'Specify column name and delay interval string'],
    tieredHints: {
      apiSignature: 'DataFrame.withWatermark(eventTime, delayThreshold) -> DataFrame',
      skeleton: 'result = stream_df.____(____, ____)',
    },
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
      { id: 'a', text: 'When you only want newly appended rows written out on each trigger', isCorrect: false },
      { id: 'b', text: 'When you want old historical data purged automatically from target storage', isCorrect: false },
      { id: 'c', text: 'When executing non-stateful projection and filtering operations on streams', isCorrect: false },
      { id: 'd', text: 'When you need the complete updated aggregation table written out on each trigger', isCorrect: true },
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
    question: 'Read a stream of JSON files from path "/mnt/data/events/" into DataFrame "stream_df" using the predefined schema "event_schema".',
    starterCode: `stream_df = spark.readStream`,
    testCases: [
      {
        input: 'JSON files at /mnt/data/events/',
        expectedOutput: 'spark.readStream.format("json").schema(event_schema).load("/mnt/data/events/")',
        description: 'Should read JSON stream with schema',
      },
    ],
    solution: `stream_df = spark.readStream.format("json").schema(event_schema).load("/mnt/data/events/")\n# OR\nstream_df = spark.readStream.json("/mnt/data/events/", schema=event_schema)`,
    explanation: 'Streaming reads MUST have an explicit schema — Spark cannot infer it from a stream because files arrive continuously. Both the chained (.format().schema().load()) and shorthand (.json(path, schema=)) approaches are valid.',
    hints: ['Schema is required for file-based streams — inferSchema is not supported', 'Use .format("json").schema(event_schema).load(path) or .json(path, schema=event_schema)'],
    tieredHints: {
      apiSignature: 'DataStreamReader.format(source).schema(schema).load(path=None) -> DataFrame',
      skeleton: 'stream_df = spark.____.____("json").____(____).____("/mnt/data/events/")',
    },
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
      { id: 'a', text: 'It reprocesses all historical files from the beginning of the stream', isCorrect: false },
      { id: 'b', text: 'It resumes from the last checkpoint, guaranteeing exactly-once processing', isCorrect: true },
      { id: 'c', text: 'It skips the failed micro-batch and resumes processing next records', isCorrect: false },
      { id: 'd', text: 'It requires manual schema re-definition and table purging before restart', isCorrect: false },
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
      { id: 'a', text: 'Automated cluster scaling manager that provisions worker nodes based on CPU consumption', isCorrect: false },
      { id: 'b', text: 'An optimized file ingestion engine that incrementally processes new files arriving in cloud storage', isCorrect: true },
      { id: 'c', text: 'Batch execution scheduler used to orchestrate dependent Databricks Workflow job pipelines', isCorrect: false },
      { id: 'd', text: 'Relational catalog metadata service for governing access permissions across Unity Catalog schemas', isCorrect: false },
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
    question: 'Configure Auto Loader to stream incoming JSON files from "/mnt/data/raw/" into DataFrame "stream_df". Store the inferred schema at path "/checkpoints/schema".',
    starterCode: `stream_df = spark.readStream`,
    testCases: [
      {
        input: 'JSON files in /mnt/data/raw/',
        expectedOutput: '.format("cloudFiles").option("cloudFiles.format", "json").option("cloudFiles.schemaLocation", ...)',
        description: 'Should use cloudFiles format with JSON',
      },
    ],
    solution: `stream_df = spark.readStream.format("cloudFiles").option("cloudFiles.format", "json").option("cloudFiles.schemaLocation", "/checkpoints/schema").load("/mnt/data/raw/")\n# OR\nstream_df = spark.readStream.option("cloudFiles.format", "json").option("cloudFiles.schemaLocation", "/checkpoints/schema").format("cloudFiles").load("/mnt/data/raw/")`,
    explanation: 'Auto Loader uses "cloudFiles" as the format — this is what makes it Auto Loader rather than a regular stream reader. cloudFiles.format tells it the underlying file type. cloudFiles.schemaLocation is required for schema inference.',
    hints: ['Set format to "cloudFiles"', 'Specify "cloudFiles.format" as "json"', 'Set "cloudFiles.schemaLocation" option'],
    tieredHints: {
      apiSignature: 'DataStreamReader.format("cloudFiles").option(key, value).load(path=None) -> DataFrame',
      skeleton: 'stream_df = spark.____.____("cloudFiles").____("cloudFiles.format", ____).____("cloudFiles.schemaLocation", ____).____("/mnt/data/raw/")',
    },
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
      { id: 'a', text: 'Scheduled batch sync mode and Continuous stream polling mode', isCorrect: false },
      { id: 'b', text: 'Client push event mode and Server pull polling mode', isCorrect: false },
      { id: 'c', text: 'Directory listing mode and File notification mode', isCorrect: true },
      { id: 'd', text: 'Synchronous blocking mode and Asynchronous non-blocking mode', isCorrect: false },
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
      { id: 'a', text: 'It fails the stream immediately requiring manual column definition', isCorrect: false },
      { id: 'b', text: 'It silently drops newly observed columns without updating metadata', isCorrect: false },
      { id: 'c', text: 'It requires purging checkpoint storage before processing new columns', isCorrect: false },
      { id: 'd', text: 'It can automatically detect and merge new columns via schemaEvolutionMode', isCorrect: true },
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
    question: 'Create an Auto Loader ingestion stream that reads CSV files with headers from "/mnt/landing/", stores inferred schema at "/checkpoints/bronze/schema", and streams output in append mode to Delta table "bronze_data" with checkpoint path "/checkpoints/bronze".',
    starterCode: `spark.readStream`,
    testCases: [
      {
        input: 'CSV files',
        expectedOutput: 'cloudFiles format, csv, writeStream to delta',
        description: 'Should create full Auto Loader pipeline',
      },
    ],
    solution: `spark.readStream.format("cloudFiles").option("cloudFiles.format", "csv").option("header", "true").option("cloudFiles.schemaLocation", "/checkpoints/bronze/schema").load("/mnt/landing/").writeStream.format("delta").option("checkpointLocation", "/checkpoints/bronze").outputMode("append").toTable("bronze_data")\n# OR\nspark.readStream.format("cloudFiles").option("cloudFiles.format", "csv").option("header", "true").option("cloudFiles.schemaLocation", "/checkpoints/bronze/schema").load("/mnt/landing/").writeStream.option("checkpointLocation", "/checkpoints/bronze").outputMode("append").toTable("bronze_data")`,
    explanation: 'A full Auto Loader pipeline: readStream with cloudFiles reads new files incrementally, schemaLocation stores the inferred schema, then writeStream writes to a Delta table. Two separate checkpoints: schemaLocation for the inferred schema, checkpointLocation for stream progress.',
    hints: ['Chain readStream with cloudFiles options to load("/mnt/landing/")', 'Chain writeStream to append toTable("bronze_data") with checkpointLocation'],
    tieredHints: {
      apiSignature: 'DataStreamReader.format("cloudFiles").option(key, value).load(path=None).writeStream -> DataStreamWriter',
      skeleton: 'spark.____.____("cloudFiles").____("cloudFiles.format", "csv").____("header", "true").____("cloudFiles.schemaLocation", "/checkpoints/bronze/schema").____("/mnt/landing/").____.____("delta").____("checkpointLocation", "/checkpoints/bronze").____("append").____("bronze_data")',
    },
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
      { id: 'a', text: 'Auto Loader tracks processed files, manages schema evolution, and scales efficiently to millions of files', isCorrect: true },
      { id: 'b', text: 'Auto Loader executes single-file batch reads faster by bypassing Spark execution plan generation', isCorrect: false },
      { id: 'c', text: 'Auto Loader enables reading non-file streaming sources directly such as Apache Kafka and Event Hubs', isCorrect: false },
      { id: 'd', text: 'Auto Loader reduces executor RAM footprint by disabling distributed memory caching across nodes', isCorrect: false },
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
    question: 'Configure an Auto Loader stream reading JSON from "/mnt/data/" that includes existing pre-existing files, storing schema at "/checkpoints/schema". Project all record columns plus "_metadata.file_path" and "_metadata.file_modification_time" into "stream_df".',
    starterCode: `stream_df = spark.readStream`,
    testCases: [
      {
        input: 'Auto Loader stream',
        expectedOutput: 'select _metadata.file_path or option includeExistingFiles',
        description: 'Should include metadata columns',
      },
    ],
    solution: `stream_df = spark.readStream.format("cloudFiles").option("cloudFiles.format", "json").option("cloudFiles.includeExistingFiles", "true").option("cloudFiles.schemaLocation", "/checkpoints/schema").load("/mnt/data/").select("*", "_metadata.file_path", "_metadata.file_modification_time")\n# OR\nstream_df = spark.readStream.format("cloudFiles").option("cloudFiles.format", "json").option("cloudFiles.includeExistingFiles", True).option("cloudFiles.schemaLocation", "/checkpoints/schema").load("/mnt/data/").select("*", "_metadata.file_path", "_metadata.file_modification_time")`,
    explanation: '_metadata is a virtual column automatically available in file-based streams. You access its fields with dot notation in select(). includeExistingFiles=true is important for initial loads.',
    hints: ['Set "cloudFiles.includeExistingFiles" to "true"', 'Use select("*", "_metadata.file_path", "_metadata.file_modification_time")'],
    tieredHints: {
      apiSignature: 'DataFrame.select(*cols) -> DataFrame',
      skeleton: 'stream_df = spark.____.____("cloudFiles").____("cloudFiles.format", "json").____("cloudFiles.includeExistingFiles", ____).____("cloudFiles.schemaLocation", "/checkpoints/schema").____("/mnt/data/").____("*", ____, ____)',
    },
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
      { id: 'a', text: 'Bronze (raw ingestion), Silver (cleaned data), Gold (business aggregates)', isCorrect: true },
      { id: 'b', text: 'Input layer (file ingestion), Processing layer (joins), Output layer (views)', isCorrect: false },
      { id: 'c', text: 'Staging layer (landing zone), Production layer (ETL), Archive layer (backups)', isCorrect: false },
      { id: 'd', text: 'Hot layer (in-memory caching), Warm layer (SSD), Cold layer (object storage)', isCorrect: false },
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
      { id: 'a', text: 'Highly summarized metric data pre-aggregated for C-suite executive dashboards', isCorrect: false },
      { id: 'b', text: 'Strictly validated records that have passed all quality constraint checks', isCorrect: false },
      { id: 'c', text: 'Raw, unprocessed source data appended as-is, augmented with ingestion metadata', isCorrect: true },
      { id: 'd', text: 'Fully denormalized relational star schemas optimized for analytical SQL queries', isCorrect: false },
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
      { id: 'a', text: 'Enforcing strict read-only schema locks while preventing concurrent write operations', isCorrect: false },
      { id: 'b', text: 'Generating high-level KPI aggregations for consumption by reporting visualization tools', isCorrect: false },
      { id: 'c', text: 'Archiving obsolete partition files to compressed long-term cloud cold storage tiers', isCorrect: false },
      { id: 'd', text: 'Data cleaning, deduplication, type casting, joining lookup tables, and applying business rules', isCorrect: true },
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
    question: 'What is the primary function of the Gold layer in a Medallion architecture?',
    options: [
      { id: 'a', text: 'Preserving raw unmodified source payloads for compliance auditing purposes', isCorrect: false },
      { id: 'b', text: 'Storing business-ready aggregated metrics, KPIs, and reports optimized for analytics', isCorrect: true },
      { id: 'c', text: 'Executing low-level format conversions and file deduplication across raw streams', isCorrect: false },
      { id: 'd', text: 'Coordinating distributed compute resources for Auto Loader directory scanning', isCorrect: false },
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
    question: 'Create or replace a Silver table named "silver_orders" from "bronze_orders" (columns: order_id, customer_id, amount, order_status, ingestion_time). Exclude records where order_id is null, and deduplicate to retain only the single most recent record per order_id based on ingestion_time descending.',
    starterCode: `-- Create Silver table from bronze_orders\n`,
    testCases: [
      {
        input: 'bronze_orders table',
        expectedOutput: 'CREATE OR REPLACE TABLE silver_orders with WHERE and QUALIFY/ROW_NUMBER',
        description: 'Should clean and deduplicate data',
      },
    ],
    solution: `CREATE OR REPLACE TABLE silver_orders AS\nSELECT * FROM (\n  SELECT *, ROW_NUMBER() OVER (PARTITION BY order_id ORDER BY ingestion_time DESC) as rn\n  FROM bronze_orders\n  WHERE order_id IS NOT NULL\n)\nWHERE rn = 1\n-- OR\nCREATE OR REPLACE TABLE silver_orders AS\nSELECT * FROM bronze_orders\nWHERE order_id IS NOT NULL\nQUALIFY ROW_NUMBER() OVER (PARTITION BY order_id ORDER BY ingestion_time DESC) = 1`,
    explanation: 'Silver layer transformations typically filter nulls (data quality), deduplicate using ROW_NUMBER() or QUALIFY to keep the latest record, and may cast types or join with reference data.',
    hints: ['Filter out NULL order_ids with WHERE', 'Use ROW_NUMBER() OVER (PARTITION BY order_id ORDER BY ingestion_time DESC) for deduplication', 'QUALIFY or subquery rn = 1 selects latest record'],
    tieredHints: {
      apiSignature: 'ROW_NUMBER() OVER (PARTITION BY col1 ORDER BY col2 DESC)',
      skeleton: '____ ____ TABLE ____ AS\nSELECT * FROM (\n  SELECT *, ____() OVER (____ BY ____ ____ BY ____ ____) as ____\n  FROM ____\n  WHERE ____ IS ____\n)\nWHERE ____ = 1',
    },
    tags: ['medallion', 'silver', 'deduplication'],
    concepts: ['medallion-architecture', 'ps-distinct-drop-dup'],
  },

  {
    id: 'medallion-6',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.MEDALLION_ARCHITECTURE,
    language: CodeLanguage.SQL,
    question: 'Create or replace a Gold table named "gold_daily_revenue" from "silver_orders" (columns: order_id, customer_id, amount, order_date, order_status) that calculates total revenue (sum of amount as "total_revenue") and order count (count of records as "order_count") grouped by order_date.',
    starterCode: `-- Create Gold aggregation table\n`,
    testCases: [
      {
        input: 'silver_orders with order_date and amount columns',
        expectedOutput: 'GROUP BY order_date with SUM and COUNT',
        description: 'Should aggregate revenue by date',
      },
    ],
    solution: `CREATE OR REPLACE TABLE gold_daily_revenue AS\nSELECT order_date, SUM(amount) as total_revenue, COUNT(*) as order_count\nFROM silver_orders\nGROUP BY order_date\n-- OR\nCREATE TABLE IF NOT EXISTS gold_daily_revenue AS\nSELECT order_date, SUM(amount) as total_revenue, COUNT(order_id) as order_count\nFROM silver_orders\nGROUP BY order_date`,
    explanation: 'Gold tables contain business-level aggregations. This creates a daily revenue summary that can be consumed by BI dashboards and reporting tools.',
    hints: ['Use GROUP BY order_date', 'SUM(amount) as total_revenue, COUNT(*) as order_count'],
    tieredHints: {
      apiSignature: 'CREATE OR REPLACE TABLE table_name AS SELECT col, SUM(col2), COUNT(*) FROM source GROUP BY col',
      skeleton: '____ ____ TABLE ____ AS\nSELECT order_date, ____(amount) as ____, ____(*) as ____\nFROM ____\n____ ____ order_date',
    },
    tags: ['medallion', 'gold', 'aggregation'],
    concepts: ['medallion-architecture', 'ps-groupby-agg'],
  },

  {
    id: 'medallion-7',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.MEDALLION_ARCHITECTURE,
    question: 'Why is the Medallion architecture beneficial for enterprise data governance?',
    options: [
      { id: 'a', text: 'Each layer provides distinct quality guarantees, allowing fine-grained access control policies per tier', isCorrect: true },
      { id: 'b', text: 'It encrypts all raw payload files automatically at rest without requiring KMS key configuration', isCorrect: false },
      { id: 'c', text: 'It completely eliminates the necessity for role-based data access permissions across all databases', isCorrect: false },
      { id: 'd', text: 'It centralizes all structured and unstructured datasets into a single unpartitioned storage bucket', isCorrect: false },
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
    question: 'In a Medallion architecture, which layer is primarily populated using Auto Loader file ingestion?',
    options: [
      { id: 'a', text: 'Gold tier — to aggregate operational business metrics', isCorrect: false },
      { id: 'b', text: 'Silver tier — to enforce data validation constraints', isCorrect: false },
      { id: 'c', text: 'Bronze tier — to ingest raw files from cloud storage', isCorrect: true },
      { id: 'd', text: 'All tiers — Auto Loader reads Delta tables between tiers', isCorrect: false },
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
    question: 'Configure a Bronze streaming ingestion pipeline using Auto Loader to ingest JSON files from "/mnt/landing/events", store schema at "/checkpoints/bronze_events/schema", append an "ingestion_time" timestamp column with current_timestamp(), and write stream to Delta table "bronze_events" with checkpoint "/checkpoints/bronze_events".',
    starterCode: `from pyspark.sql.functions import current_timestamp\n`,
    testCases: [
      {
        input: 'JSON files',
        expectedOutput: 'cloudFiles with withColumn current_timestamp',
        description: 'Should create Bronze pipeline with metadata',
      },
    ],
    solution: `from pyspark.sql.functions import current_timestamp\n\nspark.readStream.format("cloudFiles").option("cloudFiles.format", "json").option("cloudFiles.schemaLocation", "/checkpoints/bronze_events/schema").load("/mnt/landing/events").withColumn("ingestion_time", current_timestamp()).writeStream.format("delta").option("checkpointLocation", "/checkpoints/bronze_events").outputMode("append").toTable("bronze_events")\n# OR\nfrom pyspark.sql.functions import current_timestamp\n\nstream_df = spark.readStream.format("cloudFiles").option("cloudFiles.format", "json").option("cloudFiles.schemaLocation", "/checkpoints/bronze_events/schema").load("/mnt/landing/events").withColumn("ingestion_time", current_timestamp())\nstream_df.writeStream.format("delta").option("checkpointLocation", "/checkpoints/bronze_events").outputMode("append").toTable("bronze_events")`,
    explanation: 'This is the standard Bronze pattern: Auto Loader (cloudFiles) incrementally reads new files, current_timestamp() adds when each row was ingested, and writeStream persists to Delta.',
    hints: ['withColumn("ingestion_time", current_timestamp()) adds the timestamp', 'writeStream uses .toTable("bronze_events")', 'schemaLocation is for schema inference, checkpointLocation is for stream progress'],
    tieredHints: {
      apiSignature: 'DataFrame.withColumn(colName, col) -> DataFrame',
      skeleton: 'from pyspark.sql.functions import current_timestamp\n\nspark.____.____("cloudFiles").____("cloudFiles.format", "json").____("cloudFiles.schemaLocation", "/checkpoints/bronze_events/schema").____("/mnt/landing/events").____("ingestion_time", ____()).____.____("delta").____("checkpointLocation", "/checkpoints/bronze_events").____("append").____("bronze_events")',
    },
    tags: ['medallion', 'bronze', 'autoloader', 'pipeline'],
    concepts: ['medallion-architecture', 'stream-autoloader', 'dlt-pipeline-basics'],
  },

  {
    id: 'medallion-10',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.MEDALLION_ARCHITECTURE,
    language: CodeLanguage.PYTHON,
    question: 'Create a streaming Silver pipeline that reads Delta table "bronze_events" (columns: event_id, event_type, amount, user_id, ingestion_time) as a stream, filters out records where event_type is null, casts amount column to double, and writes stream to Delta table "silver_events" in append mode with checkpoint at "/checkpoints/silver_events".',
    starterCode: `from pyspark.sql.functions import col\n`,
    testCases: [
      {
        input: 'bronze_events Delta table',
        expectedOutput: 'readStream from delta, filter, cast, writeStream',
        description: 'Should create Silver streaming pipeline',
      },
    ],
    solution: `from pyspark.sql.functions import col\n\nspark.readStream.table("bronze_events").filter(col("event_type").isNotNull()).withColumn("amount", col("amount").cast("double")).writeStream.format("delta").option("checkpointLocation", "/checkpoints/silver_events").outputMode("append").toTable("silver_events")\n# OR\nfrom pyspark.sql.functions import col\n\nsilver_df = spark.readStream.table("bronze_events").filter(col("event_type").isNotNull()).withColumn("amount", col("amount").cast("double"))\nsilver_df.writeStream.format("delta").option("checkpointLocation", "/checkpoints/silver_events").outputMode("append").toTable("silver_events")`,
    explanation: 'Silver pipelines stream from Bronze Delta tables using readStream.table(). Filtering removes bad data, and withColumn with cast() enforces proper data types before writing to Silver.',
    hints: ['Use readStream.table("bronze_events")', 'filter(col("event_type").isNotNull())', 'withColumn("amount", col("amount").cast("double"))'],
    tieredHints: {
      apiSignature: 'Column.cast(dataType) -> Column',
      skeleton: 'from pyspark.sql.functions import col\n\nspark.____.____("bronze_events").____(col("event_type").____()).____("amount", col("amount").____("double")).____.____("delta").____("checkpointLocation", "/checkpoints/silver_events").____("append").____("silver_events")',
    },
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
      { id: 'a', text: 'A method for compressing Delta storage files during routine VACUUM maintenance tasks', isCorrect: false },
      { id: 'b', text: 'A database index strategy for accelerating join lookups on high-cardinality primary keys', isCorrect: false },
      { id: 'c', text: 'A pattern that captures row-level inserts, updates, and deletes for downstream replication', isCorrect: true },
      { id: 'd', text: 'A data encryption protocol that obscures row payloads during streaming socket transport', isCorrect: false },
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
      { id: 'a', text: 'A Delta feature recording row-level inserts, updates, and deletes for batch or streaming consumption', isCorrect: true },
      { id: 'b', text: 'A real-time cluster health monitoring service tracking executor CPU consumption and memory usage', isCorrect: false },
      { id: 'c', text: 'A table partitioning strategy optimizing directory layout for multi-dimensional range filters', isCorrect: false },
      { id: 'd', text: 'An automated cloud storage snapshot system creating point-in-time table recovery backups', isCorrect: false },
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
    question: 'Enable Change Data Feed on an existing Delta table named "customers".',
    starterCode: `-- Enable CDF on customers table\n`,
    testCases: [
      {
        input: 'customers Delta table',
        expectedOutput: 'ALTER TABLE customers SET TBLPROPERTIES (delta.enableChangeDataFeed = true)',
        description: 'Should enable CDF',
      },
    ],
    solution: `ALTER TABLE customers SET TBLPROPERTIES (delta.enableChangeDataFeed = true)\n-- OR\nALTER TABLE customers SET TBLPROPERTIES ('delta.enableChangeDataFeed' = 'true')`,
    explanation: 'Setting delta.enableChangeDataFeed = true on a Delta table enables Change Data Feed. After enabling, all changes to the table are recorded and can be read using table_changes().',
    hints: ['Use ALTER TABLE customers SET TBLPROPERTIES', 'Property name is delta.enableChangeDataFeed = true'],
    tieredHints: {
      apiSignature: 'ALTER TABLE table_name SET TBLPROPERTIES (property_name = property_value)',
      skeleton: 'ALTER TABLE customers ____ TBLPROPERTIES (____.____ = true)',
    },
    tags: ['cdc', 'enable', 'tblproperties'],
    concepts: ['delta-cdf', 'delta-table-properties'],
  },

  {
    id: 'cdc-4',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.CHANGE_DATA_CAPTURE,
    language: CodeLanguage.SQL,
    question: 'Write a query to read all row-level change records from the "customers" table starting from Delta commit version 5.',
    starterCode: `-- Read change records from version 5\n`,
    testCases: [
      {
        input: 'customers table with CDF enabled',
        expectedOutput: 'SELECT * FROM table_changes("customers", 5)',
        description: 'Should read changes from version 5',
      },
    ],
    solution: `SELECT * FROM table_changes("customers", 5)\n-- OR\nSELECT * FROM table_changes('customers', 5)`,
    explanation: 'table_changes() returns the row-level changes since the specified version. Each row includes _change_type (insert, update_preimage, update_postimage, delete), _commit_version, and _commit_timestamp.',
    hints: ['Use table_changes("customers", 5)', 'Starting version parameter specifies the version threshold'],
    tieredHints: {
      apiSignature: 'table_changes(table_name, start_version, [end_version])',
      skeleton: 'SELECT * FROM ____(____, ____)',
    },
    tags: ['cdc', 'table_changes', 'read'],
    concepts: ['delta-cdf', 'ps-io-csv'],
  },

  {
    id: 'cdc-5',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.CHANGE_DATA_CAPTURE,
    language: CodeLanguage.PYTHON,
    question: 'Read the Change Data Feed from the Delta table "orders" into DataFrame "changes_df" as a stream, beginning from commit version 10.',
    starterCode: `# Read CDF as stream from orders\nchanges_df = spark.readStream`,
    testCases: [
      {
        input: 'orders table with CDF',
        expectedOutput: 'readStream with readChangeFeed and startingVersion',
        description: 'Should stream CDF',
      },
    ],
    solution: `changes_df = spark.readStream.format("delta").option("readChangeFeed", "true").option("startingVersion", 10).table("orders")\n# OR\nchanges_df = spark.readStream.format("delta").option("readChangeFeed", True).option("startingVersion", "10").table("orders")`,
    explanation: 'Setting readChangeFeed=true on a readStream enables streaming of change records. startingVersion specifies from which Delta version to start reading changes.',
    hints: ['Set option("readChangeFeed", "true")', 'Set option("startingVersion", 10)', 'Use .table("orders")'],
    tieredHints: {
      apiSignature: 'DataStreamReader.option("readChangeFeed", value).option("startingVersion", version) -> DataStreamReader',
      skeleton: 'changes_df = spark.____.____("delta").____(____, "true").____(____, ____).____("orders")',
    },
    tags: ['cdc', 'streaming', 'readChangeFeed'],
    concepts: ['delta-cdf', 'stream-readstream-writestream'],
  },

  {
    id: 'cdc-6',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.CHANGE_DATA_CAPTURE,
    question: 'Which set of string values does Delta Change Data Feed produce in the _change_type metadata column?',
    options: [
      { id: 'a', text: 'create, modify, replace, remove — simplified change verbs', isCorrect: false },
      { id: 'b', text: 'insert, update_preimage, update_postimage, delete', isCorrect: true },
      { id: 'c', text: 'INSERT, UPDATE, DELETE, TRUNCATE — SQL DML statement names', isCorrect: false },
      { id: 'd', text: 'add, change, drop, soft_delete — legacy storage labels', isCorrect: false },
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
    question: 'Write a MERGE statement to apply CDC changes from "customers_changes" into target table "customers" on matching customer_id. Exclude "update_preimage" rows from the source. Delete rows when _change_type is "delete", update matching rows when _change_type is "update_postimage", and insert unmatched rows when _change_type is "insert".',
    starterCode: `-- MERGE CDC changes into target table customers\n`,
    testCases: [
      {
        input: 'customers_changes with _change_type',
        expectedOutput: 'MERGE INTO with WHEN MATCHED DELETE, UPDATE, INSERT',
        description: 'Should apply all CDC change types',
      },
    ],
    solution: `MERGE INTO customers t\nUSING (\n  SELECT * FROM customers_changes\n  WHERE _change_type != 'update_preimage'\n) s\nON t.customer_id = s.customer_id\nWHEN MATCHED AND s._change_type = 'delete' THEN DELETE\nWHEN MATCHED AND s._change_type = 'update_postimage' THEN UPDATE SET *\nWHEN NOT MATCHED AND s._change_type = 'insert' THEN INSERT *\n-- OR\nMERGE INTO customers AS t\nUSING (SELECT * FROM customers_changes WHERE _change_type <> 'update_preimage') AS s\nON t.customer_id = s.customer_id\nWHEN MATCHED AND s._change_type = 'delete' THEN DELETE\nWHEN MATCHED AND s._change_type = 'update_postimage' THEN UPDATE SET *\nWHEN NOT MATCHED AND s._change_type = 'insert' THEN INSERT *`,
    explanation: 'This pattern applies all CDC change types in one MERGE statement. Filter out update_preimage first, then check _change_type in WHEN MATCHED and WHEN NOT MATCHED clauses.',
    hints: ['Filter out update_preimage in source subquery', 'WHEN MATCHED AND s._change_type = "delete" THEN DELETE', 'WHEN MATCHED AND s._change_type = "update_postimage" THEN UPDATE SET *'],
    tieredHints: {
      apiSignature: 'MERGE INTO target USING source ON join_expr WHEN MATCHED ... WHEN NOT MATCHED ...',
      skeleton: '____ ____ customers t\n____ (\n  ____ * ____ ____\n  ____ ____ != \'update_preimage\'\n) s\nON t.____ = s.____\nWHEN ____ AND s.____ = \'delete\' THEN ____\nWHEN ____ AND s.____ = \'update_postimage\' THEN ____ ____ *\nWHEN ____ ____ AND s.____ = \'insert\' THEN ____ *',
    },
    tags: ['cdc', 'merge', 'upsert'],
    concepts: ['delta-cdf', 'delta-merge'],
  },

  {
    id: 'cdc-8',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.CHANGE_DATA_CAPTURE,
    language: CodeLanguage.SQL,
    question: 'Create a Delta table named "customers" (columns: customer_id INT, customer_name STRING, email STRING) with Change Data Feed enabled at creation time.',
    starterCode: `-- Create Delta table with CDF enabled\n`,
    testCases: [
      {
        input: 'New table',
        expectedOutput: 'CREATE TABLE with TBLPROPERTIES delta.enableChangeDataFeed',
        description: 'Should create table with CDF',
      },
    ],
    solution: `CREATE TABLE customers (\n  customer_id INT,\n  customer_name STRING,\n  email STRING\n)\nUSING DELTA\nTBLPROPERTIES (delta.enableChangeDataFeed = true)\n-- OR\nCREATE TABLE customers (customer_id INT, customer_name STRING, email STRING) USING DELTA TBLPROPERTIES (delta.enableChangeDataFeed = true)`,
    explanation: 'TBLPROPERTIES at creation enables CDF immediately — all INSERT, UPDATE, DELETE operations on this table will be tracked from the first write.',
    hints: ['Specify TBLPROPERTIES (delta.enableChangeDataFeed = true)', 'Include columns customer_id, customer_name, email'],
    tieredHints: {
      apiSignature: 'CREATE TABLE table_name (col_def) USING DELTA TBLPROPERTIES (key = val)',
      skeleton: '____ TABLE customers (\n  customer_id INT,\n  customer_name STRING,\n  email STRING\n)\n____ ____\n____ (____.____ = ____)',
    },
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
    question: 'What is Delta Live Tables (DLT) in the Databricks Lakehouse Platform?',
    options: [
      { id: 'a', text: 'A low-latency query engine designed specifically for serving real-time SQL dashboards', isCorrect: false },
      { id: 'b', text: 'A declarative framework for building reliable, maintainable, and testable data processing pipelines', isCorrect: true },
      { id: 'c', text: 'An automated storage compression utility that optimizes Delta Lake transaction log retention', isCorrect: false },
      { id: 'd', text: 'A distributed message queuing broker designed to replace external streaming systems like Kafka', isCorrect: false },
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
    question: 'What is the functional difference between a DLT "table" and a DLT "view" in Delta Live Tables?',
    options: [
      { id: 'a', text: 'DLT tables are limited to read-only queries, whereas DLT views support direct streaming writes and mutations', isCorrect: false },
      { id: 'b', text: 'DLT tables process incoming batches synchronously, whereas DLT views execute asynchronous streaming micro-batches', isCorrect: false },
      { id: 'c', text: 'DLT tables are materialized and stored in Delta Lake format, whereas DLT views are intermediate computations that are not persisted', isCorrect: true },
      { id: 'd', text: 'DLT tables enforce strict data quality expectations, whereas DLT views bypass all runtime constraint validations', isCorrect: false },
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
    question: 'Create a DLT streaming live table called "bronze_events" that ingests raw JSON files from cloud storage at "/mnt/data/raw/events/".',
    starterCode: `-- Create streaming live table for bronze events\n`,
    testCases: [
      {
        input: 'JSON files',
        expectedOutput: 'CREATE OR REFRESH STREAMING LIVE TABLE',
        description: 'Should create streaming live table',
      },
    ],
    solution: `CREATE OR REFRESH STREAMING LIVE TABLE bronze_events\nAS SELECT * FROM cloud_files("/mnt/data/raw/events/", "json")\n-- OR\nCREATE OR REFRESH STREAMING LIVE TABLE bronze_events\nAS SELECT * FROM cloud_files('/mnt/data/raw/events/', 'json')\n-- OR\nCREATE STREAMING LIVE TABLE bronze_events\nAS SELECT * FROM cloud_files("/mnt/data/raw/events/", "json")`,
    explanation: 'In DLT SQL, CREATE OR REFRESH STREAMING LIVE TABLE creates a streaming table. cloud_files() is the DLT equivalent of Auto Loader for ingesting files.',
    hints: ['Use CREATE OR REFRESH STREAMING LIVE TABLE', 'Use cloud_files() for file ingestion in DLT'],
    tieredHints: {
      apiSignature: 'cloud_files(path, format, [options])',
      skeleton: '____ ____ ____ LIVE TABLE bronze_events\nAS SELECT * FROM ____("/mnt/data/raw/events/", ____)',
    },
    tags: ['dlt', 'bronze', 'streaming', 'cloud_files'],
    concepts: ['dlt-pipeline-basics', 'medallion-architecture', 'stream-readstream-writestream', 'stream-autoloader'],
  },

  {
    id: 'dlt-4',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DELTA_LIVE_TABLES,
    language: CodeLanguage.PYTHON,
    question: 'Define a DLT streaming table called "bronze_events" using Python that ingests JSON files from cloud storage path "/mnt/data/raw/".',
    starterCode: `import dlt\n\n# Define DLT table\n`,
    testCases: [
      {
        input: 'JSON files',
        expectedOutput: '@dlt.table decorator with spark.readStream.format("cloudFiles")',
        description: 'Should create DLT table with decorator',
      },
    ],
    solution: `import dlt\nfrom pyspark.sql.functions import *\n\n@dlt.table\ndef bronze_events():\n  return (\n    spark.readStream\n      .format("cloudFiles")\n      .option("cloudFiles.format", "json")\n      .load("/mnt/data/raw/")\n  )\n# OR\nimport dlt\n\n@dlt.table\ndef bronze_events():\n  return spark.readStream.format("cloudFiles").option("cloudFiles.format", "json").load("/mnt/data/raw/")`,
    explanation: 'In Python DLT, the @dlt.table decorator defines a live table. The function name becomes the table name. Return a DataFrame or streaming DataFrame.',
    hints: ['Use @dlt.table decorator', 'Function name = table name', 'Return the DataFrame'],
    tieredHints: {
      apiSignature: '@dlt.table(name=None, comment=None)',
      skeleton: 'import dlt\nfrom pyspark.sql.functions import *\n\n@dlt.____\ndef ____():\n  return (\n    ____.____\n      .____("cloudFiles")\n      .____(____, ____)\n      .____("/mnt/data/raw/")\n  )',
    },
    tags: ['dlt', 'python', 'decorator', 'bronze'],
    concepts: ['dlt-pipeline-basics', 'medallion-architecture'],
  },

  {
    id: 'dlt-5',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DELTA_LIVE_TABLES,
    language: CodeLanguage.SQL,
    question: 'Create a DLT streaming live table called "silver_orders" that reads incrementally from the upstream DLT table "bronze_orders", filtering out records where "order_id" is null.',
    starterCode: `-- Create Silver DLT streaming table\n`,
    testCases: [
      {
        input: 'bronze_orders live table',
        expectedOutput: 'CREATE OR REFRESH STREAMING LIVE TABLE with LIVE.bronze_orders',
        description: 'Should create Silver DLT table',
      },
    ],
    solution: `CREATE OR REFRESH STREAMING LIVE TABLE silver_orders\nAS SELECT *\nFROM STREAM(LIVE.bronze_orders)\nWHERE order_id IS NOT NULL\n-- OR\nCREATE OR REFRESH STREAMING LIVE TABLE silver_orders\nAS SELECT * FROM STREAM(LIVE.bronze_orders) WHERE order_id IS NOT NULL\n-- OR\nCREATE STREAMING LIVE TABLE silver_orders\nAS SELECT * FROM STREAM(LIVE.bronze_orders) WHERE order_id IS NOT NULL`,
    explanation: 'In DLT, reference other live tables using LIVE.table_name. For streaming tables, wrap in STREAM() to read as a stream. DLT handles dependency ordering automatically.',
    hints: ['Reference upstream tables with LIVE.table_name', 'Wrap in STREAM() for streaming reads', 'DLT manages pipeline ordering'],
    tieredHints: {
      apiSignature: 'STREAM(LIVE.table_name)',
      skeleton: '____ ____ ____ LIVE TABLE silver_orders\nAS SELECT *\nFROM ____(____.bronze_orders)\nWHERE order_id IS ____',
    },
    tags: ['dlt', 'silver', 'streaming', 'dependencies'],
    concepts: ['dlt-pipeline-basics', 'medallion-architecture', 'stream-readstream-writestream', 'dbx-workflows'],
  },

  {
    id: 'dlt-6',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DELTA_LIVE_TABLES,
    language: CodeLanguage.SQL,
    question: 'Create a DLT streaming table called "clean_orders" from the upstream table "bronze_orders" with a named quality constraint "valid_amount" requiring "amount" to be strictly positive (> 0). Drop violating rows automatically.',
    starterCode: `-- Create clean_orders streaming table with quality constraint\n`,
    testCases: [
      {
        input: 'orders data',
        expectedOutput: 'CONSTRAINT with EXPECT or ON VIOLATION DROP ROW',
        description: 'Should add quality constraint',
      },
    ],
    solution: `CREATE OR REFRESH STREAMING LIVE TABLE clean_orders (\n  CONSTRAINT valid_amount EXPECT (amount > 0) ON VIOLATION DROP ROW\n)\nAS SELECT *\nFROM STREAM(LIVE.bronze_orders)\n-- OR\nCREATE OR REFRESH STREAMING LIVE TABLE clean_orders (CONSTRAINT valid_amount EXPECT (amount > 0) ON VIOLATION DROP ROW) AS SELECT * FROM STREAM(LIVE.bronze_orders)\n-- OR\nCREATE STREAMING LIVE TABLE clean_orders (\n  CONSTRAINT valid_amount EXPECT (amount > 0) ON VIOLATION DROP ROW\n)\nAS SELECT * FROM STREAM(LIVE.bronze_orders)`,
    explanation: 'DLT expectations define data quality constraints. ON VIOLATION DROP ROW silently drops failing rows. ON VIOLATION FAIL UPDATE stops the pipeline. Without ON VIOLATION, rows are kept but tracked in metrics.',
    hints: ['Use CONSTRAINT name EXPECT (condition)', 'ON VIOLATION DROP ROW removes bad rows', 'Define constraints in the table definition'],
    tieredHints: {
      apiSignature: 'CONSTRAINT name EXPECT (condition) ON VIOLATION [FAIL UPDATE | DROP ROW | DROP]',
      skeleton: '____ ____ ____ LIVE TABLE clean_orders (\n  ____ valid_amount ____ (amount > 0) ON VIOLATION ____ ____\n)\nAS SELECT *\nFROM ____(____.bronze_orders)',
    },
    tags: ['dlt', 'expectations', 'data-quality'],
    concepts: ['dlt-pipeline-basics', 'dlt-expectations'],
  },

  {
    id: 'dlt-7',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DELTA_LIVE_TABLES,
    question: 'Which three actions can be configured on a Delta Live Tables expectation when a data quality constraint is violated?',
    options: [
      { id: 'a', text: 'Track metrics while keeping rows (warn), drop violating rows silently, or fail the pipeline update entirely', isCorrect: true },
      { id: 'b', text: 'Quarantine bad rows to a separate database, reprocess the batch automatically, or alert system administrators', isCorrect: false },
      { id: 'c', text: 'Ignore the invalid payload fields, replace failing values with default nulls, or trigger a full cluster reboot', isCorrect: false },
      { id: 'd', text: 'Retry the micro-batch transaction, archive the corrupted file partition, or suspend downstream job triggers', isCorrect: false },
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
    question: 'Define a DLT table "silver_users" in Python that reads streaming data from the upstream table "bronze_users". Enforce a data quality expectation named "valid_email" that drops any records where the "email" column is null.',
    starterCode: `import dlt\n\n# Define silver_users DLT table with expectation\n`,
    testCases: [
      {
        input: 'bronze_users live table',
        expectedOutput: '@dlt.table with @dlt.expect_or_drop',
        description: 'Should create DLT table with expectations',
      },
    ],
    solution: `import dlt\n\n@dlt.table\n@dlt.expect_or_drop("valid_email", "email IS NOT NULL")\ndef silver_users():\n  return dlt.read_stream("bronze_users")\n# OR\nimport dlt\n\n@dlt.expect_or_drop("valid_email", "email IS NOT NULL")\n@dlt.table\ndef silver_users():\n  return dlt.read_stream("bronze_users").select("*")`,
    explanation: '@dlt.expect_or_drop drops rows that violate the constraint. Other decorators: @dlt.expect (warn only), @dlt.expect_or_fail (stop pipeline). Use dlt.read_stream() to read from upstream streaming tables.',
    hints: ['Use @dlt.expect_or_drop decorator', 'First arg is constraint name, second is SQL expression', 'Use dlt.read_stream() for streaming reads'],
    tieredHints: {
      apiSignature: '@dlt.expect_or_drop(name, expression)',
      skeleton: 'import dlt\n\n@dlt.____\n@dlt.____(____, ____)\ndef ____():\n  return dlt.____(____)',
    },
    tags: ['dlt', 'python', 'expectations', 'expect_or_drop'],
    concepts: ['dlt-pipeline-basics', 'dlt-expectations'],
  },

  {
    id: 'dlt-9',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DELTA_LIVE_TABLES,
    question: 'What is the primary operational difference between a DLT "streaming table" and a DLT "materialized view"?',
    options: [
      { id: 'a', text: 'Streaming tables process queries using single-node clusters, whereas materialized views require multi-node worker nodes', isCorrect: false },
      { id: 'b', text: 'Streaming tables are restricted to SQL syntax declarations, whereas materialized views can only be written in Python code', isCorrect: false },
      { id: 'c', text: 'Streaming tables execute only on scheduled batch intervals, whereas materialized views maintain real-time socket connections', isCorrect: false },
      { id: 'd', text: 'Streaming tables process data incrementally from append-only sources, whereas materialized views recompute results from full inputs', isCorrect: true },
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
    question: 'Create a DLT Gold table named "gold_daily_sales" reading from upstream table "silver_sales" (columns: sale_id, sale_date, product_id, total_amount, customer_id). Calculate "daily_revenue" as the total sum of total_amount and "num_sales" as total record count, grouped by sale_date.',
    starterCode: `-- Declare Gold materialized view gold_daily_sales\n`,
    testCases: [
      {
        input: 'silver_sales live table',
        expectedOutput: 'CREATE OR REFRESH LIVE TABLE (not STREAMING)',
        description: 'Should create materialized view',
      },
    ],
    solution: `CREATE OR REFRESH LIVE TABLE gold_daily_sales\nAS SELECT\n  sale_date,\n  SUM(total_amount) as daily_revenue,\n  COUNT(*) as num_sales\nFROM LIVE.silver_sales\nGROUP BY sale_date\n-- OR\nCREATE OR REFRESH LIVE TABLE gold_daily_sales AS SELECT sale_date, SUM(total_amount) AS daily_revenue, COUNT(sale_id) AS num_sales FROM LIVE.silver_sales GROUP BY sale_date\n-- OR\nCREATE LIVE TABLE gold_daily_sales AS SELECT sale_date, SUM(total_amount) as daily_revenue, COUNT(*) as num_sales FROM LIVE.silver_sales GROUP BY sale_date`,
    explanation: 'Gold uses LIVE TABLE (not STREAMING) because GROUP BY aggregations require the full dataset to produce correct results — you can\'t incrementally aggregate without knowing all the data. The LIVE. prefix tells DLT this table depends on silver_sales, so DLT automatically runs silver first.',
    hints: ['No STREAMING keyword — Gold recomputes from the full dataset', 'FROM LIVE.silver_sales — the LIVE. prefix is required for DLT table references', 'GROUP BY sale_date with SUM and COUNT for the aggregations'],
    tieredHints: {
      apiSignature: 'CREATE OR REFRESH LIVE TABLE table_name AS SELECT ... FROM LIVE.source_table GROUP BY col',
      skeleton: '____ ____ LIVE TABLE ____\nAS SELECT\n  sale_date,\n  ____(total_amount) as ____,\n  ____(*) as ____\nFROM ____.____\n____ ____ sale_date',
    },
    tags: ['dlt', 'gold', 'materialized-view', 'aggregation'],
    concepts: ['dlt-pipeline-basics', 'medallion-architecture', 'ps-groupby-agg'],
  },

  {
    id: 'dlt-11',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DELTA_LIVE_TABLES,
    question: 'Which pipeline mode should be selected for a production Delta Live Tables pipeline requiring continuous real-time data processing?',
    options: [
      { id: 'a', text: 'Triggered mode — execution runs once to process current data, then shuts down cluster resources', isCorrect: false },
      { id: 'b', text: 'Batch mode — execution runs on a scheduled cron interval to process accumulated file updates', isCorrect: false },
      { id: 'c', text: 'Continuous mode — execution runs perpetually to process incoming events with minimum latency', isCorrect: true },
      { id: 'd', text: 'Manual mode — execution requires explicit administrator confirmation before processing each batch', isCorrect: false },
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
    question: 'How does Delta Live Tables determine execution order and pipeline dependencies between defined tables?',
    options: [
      { id: 'a', text: 'DLT automatically constructs a DAG and execution plan by analyzing table references like LIVE.table_name', isCorrect: true },
      { id: 'b', text: 'DLT requires developers to manually specify numerical execution priorities for every declared table', isCorrect: false },
      { id: 'c', text: 'DLT processes declared pipeline tables sequentially based on alphabetical ordering of function names', isCorrect: false },
      { id: 'd', text: 'DLT executes all declared pipeline tables simultaneously without tracking inter-table dependencies', isCorrect: false },
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
    question: 'What is a Databricks Workflow (Job) in the Databricks Lakehouse Platform?',
    options: [
      { id: 'a', text: 'A dedicated hardware cluster configuration for running real-time stream processing engines', isCorrect: false },
      { id: 'b', text: 'A workspace access control mechanism for restricting user privileges across database schemas', isCorrect: false },
      { id: 'c', text: 'An orchestration service to schedule and run non-interactive tasks like notebooks and pipelines in a DAG', isCorrect: true },
      { id: 'd', text: 'A version control integration tool that synchronizes workspace notebooks with remote Git repositories', isCorrect: false },
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
    question: 'Which set of task types can be orchestrated within a single Databricks Workflow?',
    options: [
      { id: 'a', text: 'Notebooks, Python scripts, JARs, SQL queries, Delta Live Tables pipelines, and dbt tasks', isCorrect: true },
      { id: 'b', text: 'Only Python interactive notebooks and pre-compiled Java JAR application binaries', isCorrect: false },
      { id: 'c', text: 'Only SQL queries and declarative Delta Live Tables data processing pipelines', isCorrect: false },
      { id: 'd', text: 'Only shell scripts and containerized Docker applications deployed via Kubernetes', isCorrect: false },
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
    question: 'How are task execution dependencies defined within a Databricks Workflow?',
    options: [
      { id: 'a', text: 'Tasks run sequentially in strict alphabetical order based on their assigned task name strings', isCorrect: false },
      { id: 'b', text: 'Tasks specify upstream dependencies to form a Directed Acyclic Graph (DAG) for parallel execution', isCorrect: true },
      { id: 'c', text: 'Tasks cannot define inter-dependencies and are forced to execute concurrently on shared clusters', isCorrect: false },
      { id: 'd', text: 'Tasks run according to strict numerical priority numbers configured in cluster settings', isCorrect: false },
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
    question: 'What occurs when a single task fails during a Databricks Workflow execution?',
    options: [
      { id: 'a', text: 'The entire workflow execution halts immediately and cancels all independent parallel task branches', isCorrect: false },
      { id: 'b', text: 'The failed task is ignored and downstream dependent tasks proceed using default null parameter values', isCorrect: false },
      { id: 'c', text: 'Downstream dependent tasks are skipped, while independent parallel branches continue to completion', isCorrect: true },
      { id: 'd', text: 'The cluster automatically restarts and re-executes the failed task indefinitely until it succeeds', isCorrect: false },
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
    question: 'Which trigger mechanisms are supported for executing Databricks Workflows?',
    options: [
      { id: 'a', text: 'Cron schedules, manual triggers, continuous loops, and file arrival events in cloud storage', isCorrect: true },
      { id: 'b', text: 'Only manual user triggers initiated through the Databricks REST API or workspace web interface', isCorrect: false },
      { id: 'c', text: 'Only cron-based time schedules configured using standard UNIX crontab interval expressions', isCorrect: false },
      { id: 'd', text: 'Only automatic triggers initiated whenever a Git commit is pushed to the primary branch', isCorrect: false },
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
    question: 'What is the operational difference between a job cluster and an all-purpose cluster for Databricks Workflows?',
    options: [
      { id: 'a', text: 'Job clusters are ephemeral and created specifically for a job run, while all-purpose clusters persist and cost more', isCorrect: true },
      { id: 'b', text: 'Job clusters support interactive notebook execution, while all-purpose clusters are restricted to batch scripts', isCorrect: false },
      { id: 'c', text: 'Job clusters run exclusively on single-node instances, while all-purpose clusters require multi-node workers', isCorrect: false },
      { id: 'd', text: 'Job clusters persist continuously across job runs, while all-purpose clusters terminate after each task finishes', isCorrect: false },
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
    question: 'Inside a notebook executing as a Workflow task, declare notebook widgets for parameters "env" (defaulting to "dev") and "date" (defaulting to "2024-01-01"), then retrieve their current parameter values into variables named "env" and "date".',
    starterCode: `# Declare widgets and retrieve parameter values\n`,
    testCases: [
      {
        input: 'Job parameters',
        expectedOutput: 'dbutils.widgets.text and dbutils.widgets.get',
        description: 'Should get job parameters with defaults',
      },
    ],
    solution: `dbutils.widgets.text("env", "dev")\ndbutils.widgets.text("date", "2024-01-01")\n\nenv = dbutils.widgets.get("env")\ndate = dbutils.widgets.get("date")\n# OR\ndbutils.widgets.text('env', 'dev')\ndbutils.widgets.text('date', '2024-01-01')\n\nenv = dbutils.widgets.get('env')\ndate = dbutils.widgets.get('date')`,
    explanation: 'Workflows pass parameters to notebooks via widgets. text() declares the parameter — the default is used when running interactively (not from a Workflow). get() reads the actual value. When a Workflow triggers the notebook, it overrides the defaults with the job parameters.',
    hints: ['Declare first with dbutils.widgets.text("env", "dev")', 'Then read with dbutils.widgets.get("env")', 'The default is only used when running the notebook manually — Workflows override it'],
    tieredHints: {
      apiSignature: 'dbutils.widgets.text(name, defaultValue) -> None',
      skeleton: '____.____.____(____, ____)\n____.____.____(____, ____)\n\nenv = ____.____.____("env")\ndate = ____.____.____("date")',
    },
    tags: ['workflows', 'parameters', 'widgets'],
    concepts: ['dbx-workflows', 'dbx-widgets'],
  },

  {
    id: 'workflow-8',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_WORKFLOWS,
    language: CodeLanguage.PYTHON,
    question: 'Compute the record count from DataFrame "df" into variable "record_count", then exit the notebook task returning the count formatted as a string value for downstream Workflow task orchestration.',
    starterCode: `# Compute record count and exit notebook with string value\n`,
    testCases: [
      {
        input: 'notebook processing result',
        expectedOutput: 'dbutils.notebook.exit()',
        description: 'Should exit with result',
      },
    ],
    solution: `record_count = df.count()\ndbutils.notebook.exit(str(record_count))\n# OR\nrecord_count = df.count()\ndbutils.notebook.exit(f"{record_count}")`,
    explanation: 'notebook.exit() returns a string to the Workflow orchestrator. The value must be a string — passing an int causes an error. Downstream tasks reference it with {{tasks.task_name.result}} in their parameters, enabling task-to-task communication.',
    hints: ['Use dbutils.notebook.exit()', 'Value must be a string', 'Downstream tasks access via task references'],
    tieredHints: {
      apiSignature: 'dbutils.notebook.exit(value) -> None',
      skeleton: '____ = ____.____()\n____.____.____(____(____))',
    },
    tags: ['workflows', 'notebook-exit', 'task-values'],
    concepts: ['dbx-workflows', 'dbx-utilities'],
  },

  {
    id: 'workflow-9',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DATABRICKS_WORKFLOWS,
    question: 'How can values be passed between tasks within a Databricks Workflow?',
    options: [
      { id: 'a', text: 'By exporting global environment variables in Python scripts that persist across distinct cluster nodes', isCorrect: false },
      { id: 'b', text: 'By writing temporary JSON files to DBFS storage and reading them in subsequent task executions', isCorrect: false },
      { id: 'c', text: 'By setting task values with dbutils.jobs.taskValues.set() and referencing them in downstream parameters', isCorrect: true },
      { id: 'd', text: 'Inter-task value passing is not supported; tasks must operate as completely isolated state units', isCorrect: false },
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
    question: 'Use the Databricks utilities job task values API to set a task value with key "row_count" and integer value 1000 so downstream Workflow tasks can read it.',
    starterCode: `# Set task value row_count to 1000\n`,
    testCases: [
      {
        input: 'task output',
        expectedOutput: 'dbutils.jobs.taskValues.set("row_count", 1000)',
        description: 'Should set task value',
      },
    ],
    solution: `dbutils.jobs.taskValues.set(key="row_count", value=1000)\n# OR\ndbutils.jobs.taskValues.set("row_count", 1000)`,
    explanation: 'dbutils.jobs.taskValues.set() stores key-value pairs that downstream tasks can read. Values can be strings, numbers, or booleans. Downstream tasks reference them with {{tasks.task_name.values.row_count}}.',
    hints: ['Use dbutils.jobs.taskValues.set(key, value)', 'Key is a string, value can be string/number/bool'],
    tieredHints: {
      apiSignature: 'dbutils.jobs.taskValues.set(key, value)',
      skeleton: 'dbutils.jobs.____.____(key=____, value=1000)',
    },
    tags: ['workflows', 'taskValues', 'set'],
    concepts: ['dbx-workflows'],
  },

  {
    id: 'workflow-11',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_WORKFLOWS,
    question: 'What is the purpose of the repair run feature in Databricks Workflows?',
    options: [
      { id: 'a', text: 'To clean up corrupted Delta table data files caused by unexpected worker node hardware failures', isCorrect: false },
      { id: 'b', text: 'To re-execute only failed and skipped tasks from a previous run without re-running successful tasks', isCorrect: true },
      { id: 'c', text: 'To automatically tune Spark cluster memory settings and optimize shuffle partition counts', isCorrect: false },
      { id: 'd', text: 'To repair broken workspace Git repository connections and re-synchronize local code commits', isCorrect: false },
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
      { id: 'a', text: 'A specialized Delta Lake table format optimized for ACID transactional writes', isCorrect: false },
      { id: 'b', text: 'An interactive web-based notebook editor supporting multi-language kernels', isCorrect: false },
      { id: 'c', text: 'A unified governance solution for data assets across workspaces in an account', isCorrect: true },
      { id: 'd', text: 'A cluster infrastructure management service for automated cluster provisioning', isCorrect: false },
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
    question: 'What is the three-level namespace hierarchy used to reference objects in Unity Catalog?',
    options: [
      { id: 'a', text: 'database.table.column (legacy metastore structure)', isCorrect: false },
      { id: 'b', text: 'workspace.folder.notebook (workspace directory structure)', isCorrect: false },
      { id: 'c', text: 'cluster.database.table (compute resource reference structure)', isCorrect: false },
      { id: 'd', text: 'catalog.schema.table (e.g., prod.sales.orders object structure)', isCorrect: true },
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
    question: 'Grant SELECT privilege on table "sales.orders" to principal group "analysts".',
    starterCode: `-- Grant table access\n`,
    testCases: [
      {
        input: 'sales.orders table',
        expectedOutput: 'GRANT SELECT ON TABLE sales.orders TO analysts',
        description: 'Should grant SELECT to analysts',
      },
    ],
    solution: `GRANT SELECT ON TABLE sales.orders TO analysts\n-- OR\nGRANT SELECT ON sales.orders TO analysts`,
    explanation: 'GRANT SELECT allows the specified principal (user/group) to read data from the table. In Unity Catalog, you can grant permissions at catalog, schema, or table level.',
    hints: ['Use GRANT permission ON object TO principal', 'SELECT allows reading data'],
    tieredHints: {
      apiSignature: 'GRANT privilege ON TABLE table_name TO principal',
      skeleton: 'GRANT ____ ON TABLE sales.orders ____ ____',
    },
    tags: ['governance', 'grant', 'permissions'],
    concepts: ['ucat-grants'],
  },

  {
    id: 'governance-4',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATA_GOVERNANCE,
    language: CodeLanguage.SQL,
    question: 'Grant ALL PRIVILEGES on schema "analytics" to principal group "data_engineers".',
    starterCode: `-- Grant schema access\n`,
    testCases: [
      {
        input: 'analytics schema',
        expectedOutput: 'GRANT ALL PRIVILEGES ON SCHEMA analytics TO data_engineers',
        description: 'Should grant all on schema',
      },
    ],
    solution: `GRANT ALL PRIVILEGES ON SCHEMA analytics TO data_engineers\n-- OR\nGRANT ALL ON SCHEMA analytics TO data_engineers`,
    explanation: 'GRANT ALL PRIVILEGES gives full access (CREATE, SELECT, MODIFY, etc.) on the schema and its objects. Be careful - this is a broad permission. Prefer granting specific privileges in production.',
    hints: ['Use GRANT ALL PRIVILEGES ON SCHEMA', 'Grants apply to schema and contained objects'],
    tieredHints: {
      apiSignature: 'GRANT ALL PRIVILEGES ON SCHEMA schema_name TO principal',
      skeleton: 'GRANT ____ PRIVILEGES ON ____ analytics TO ____',
    },
    tags: ['governance', 'grant', 'schema', 'all-privileges'],
    concepts: ['ucat-grants', 'ps-dataframe-create'],
  },

  {
    id: 'governance-5',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATA_GOVERNANCE,
    language: CodeLanguage.SQL,
    question: 'Revoke INSERT privilege on table "production.customers" from principal group "interns".',
    starterCode: `-- Revoke permissions\n`,
    testCases: [
      {
        input: 'production.customers table',
        expectedOutput: 'REVOKE INSERT ON TABLE production.customers FROM interns',
        description: 'Should revoke INSERT from interns',
      },
    ],
    solution: `REVOKE INSERT ON TABLE production.customers FROM interns\n-- OR\nREVOKE INSERT ON production.customers FROM interns`,
    explanation: 'REVOKE removes previously granted permissions. Use the same syntax as GRANT but with REVOKE...FROM instead of GRANT...TO.',
    hints: ['Use REVOKE permission ON object FROM principal', 'Opposite of GRANT...TO'],
    tieredHints: {
      apiSignature: 'REVOKE privilege ON TABLE table_name FROM principal',
      skeleton: 'REVOKE ____ ON TABLE production.customers ____ ____',
    },
    tags: ['governance', 'revoke', 'permissions'],
    concepts: ['ucat-grants'],
  },

  {
    id: 'governance-6',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATA_GOVERNANCE,
    language: CodeLanguage.SQL,
    question: 'Write a SQL query to list all privilege grants applied to schema "sales".',
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
    tieredHints: {
      apiSignature: 'SHOW GRANTS ON SCHEMA schema_name',
      skeleton: '____ GRANTS ON ____ ____',
    },
    tags: ['governance', 'show-grants', 'audit'],
    concepts: ['ucat-grants', 'ucat-lineage'],
  },

  {
    id: 'governance-7',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATA_GOVERNANCE,
    language: CodeLanguage.SQL,
    question: 'Write a SQL statement to create a new top-level catalog named "development" in Unity Catalog.',
    starterCode: `-- Create catalog\n`,
    testCases: [
      {
        input: 'new catalog',
        expectedOutput: 'CREATE CATALOG development',
        description: 'Should create catalog',
      },
    ],
    solution: `CREATE CATALOG development\n-- OR\nCREATE CATALOG IF NOT EXISTS development`,
    explanation: 'CREATE CATALOG creates a new top-level container in Unity Catalog. Catalogs typically represent environments (dev, staging, prod) or business units.',
    hints: ['Use CREATE CATALOG'],
    tieredHints: {
      apiSignature: 'CREATE CATALOG catalog_name',
      skeleton: '____ ____ ____',
    },
    tags: ['governance', 'catalog', 'create'],
    concepts: ['ucat-grants', 'ucat-namespaces', 'ps-dataframe-create'],
  },

  {
    id: 'governance-8',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATA_GOVERNANCE,
    language: CodeLanguage.SQL,
    question: 'Write a SQL statement to create a new schema named "raw_data" within catalog "production".',
    starterCode: `-- Create schema in catalog\n`,
    testCases: [
      {
        input: 'production catalog',
        expectedOutput: 'CREATE SCHEMA production.raw_data',
        description: 'Should create schema in catalog',
      },
    ],
    solution: `CREATE SCHEMA production.raw_data\n-- OR\nCREATE SCHEMA IF NOT EXISTS production.raw_data`,
    explanation: 'CREATE SCHEMA creates a namespace within a catalog. Tables created inside will have the full path: production.raw_data.table_name.',
    hints: ['Use CREATE SCHEMA catalog.schema_name', 'Fully qualify with catalog name'],
    tieredHints: {
      apiSignature: 'CREATE SCHEMA catalog_name.schema_name',
      skeleton: '____ SCHEMA ____.____',
    },
    tags: ['governance', 'schema', 'create'],
    concepts: ['ucat-grants', 'ps-dataframe-create'],
  },

  {
    id: 'governance-9',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATA_GOVERNANCE,
    question: 'What is the primary difference between a managed table and an external table in Unity Catalog?',
    options: [
      { id: 'a', text: 'Managed tables have underlying data lifecycle managed by Unity Catalog; external tables reference user-managed storage locations', isCorrect: true },
      { id: 'b', text: 'Managed tables execute queries on specialized compute engines, whereas external tables run on standard open-source Apache Spark clusters', isCorrect: false },
      { id: 'c', text: 'External tables require strict schema definition upon creation, whereas managed tables automatically infer column data types on load', isCorrect: false },
      { id: 'd', text: 'Managed tables store transactional Delta log entries, whereas external tables retain data strictly in plain unindexed CSV text files', isCorrect: false },
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
    question: 'What capability does automated data lineage provide within Databricks Unity Catalog?',
    options: [
      { id: 'a', text: 'Automated row-level data encryption at rest using customer-managed cryptographic keys', isCorrect: false },
      { id: 'b', text: 'Real-time tracking of data flow across tables, notebooks, jobs, and dashboards', isCorrect: true },
      { id: 'c', text: 'Automated disaster recovery replication across secondary cloud provider regions', isCorrect: false },
      { id: 'd', text: 'Dynamic memory compression for high-throughput streaming ingestion pipelines', isCorrect: false },
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
    question: 'Grant permissions to group "data_engineers" allowing them to navigate to schema "analytics" and create tables within it.',
    starterCode: `-- Grant schema access and table creation\n`,
    testCases: [
      {
        input: 'analytics schema',
        expectedOutput: 'GRANT USE SCHEMA, CREATE TABLE ON SCHEMA analytics TO data_engineers',
        description: 'Should grant USE and CREATE TABLE',
      },
    ],
    solution: `GRANT USE SCHEMA, CREATE TABLE ON SCHEMA analytics TO data_engineers\n-- OR\nGRANT CREATE TABLE, USE SCHEMA ON SCHEMA analytics TO data_engineers`,
    explanation: 'USE SCHEMA allows navigating to the schema. CREATE TABLE allows creating tables within it. Both are needed - without USE SCHEMA, the group cannot access the schema even with CREATE TABLE permission.',
    hints: ['Grant multiple permissions with comma separation', 'USE SCHEMA is needed to access the schema'],
    tieredHints: {
      apiSignature: 'GRANT privilege1, privilege2 ON SCHEMA schema_name TO principal',
      skeleton: 'GRANT ____ SCHEMA, ____ TABLE ON SCHEMA analytics TO ____',
    },
    tags: ['governance', 'grant', 'create-table', 'use-schema'],
    concepts: ['ucat-grants', 'ps-dataframe-create', 'ucat-namespaces'],
  },

  {
    id: 'governance-12',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATA_GOVERNANCE,
    question: 'In Unity Catalog, what capability is granted to a principal holding the USE CATALOG privilege?',
    options: [
      { id: 'a', text: 'Full read and write privileges across all schemas and tables contained within the catalog', isCorrect: false },
      { id: 'b', text: 'Administrative privilege to drop or modify catalog properties and owner assignments', isCorrect: false },
      { id: 'c', text: 'Privilege to browse catalog metadata and list child schemas without granting data access', isCorrect: true },
      { id: 'd', text: 'Permission to execute external data sharing contracts using Delta Sharing protocols', isCorrect: false },
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
      { id: 'a', text: 'A local DBFS file system cache designed to store temporary Parquet file outputs across cluster restarts.', isCorrect: false },
      { id: 'b', text: 'A workspace Git integration allowing developers to clone repositories, manage branches, and commit code directly in Databricks.', isCorrect: true },
      { id: 'c', text: 'A cloud object storage mounting tool that replaces external AWS IAM roles with local secret scope parameters.', isCorrect: false },
      { id: 'd', text: 'A cluster provisioning engine that automatically spins up driver nodes for scheduled job runs.', isCorrect: false },
    ],
    explanation: 'Databricks Repos integrates with Git providers (GitHub, GitLab, Azure DevOps, Bitbucket). You can clone repos, create branches, commit changes, and push/pull directly from the workspace UI.',
    tags: ['repos', 'git', 'version-control'],
    concepts: ['dbx-repos'],
  },

  {
    id: 'platform-repos-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_PLATFORM,
    question: 'Which Git operations can developers perform directly within the Databricks Repos user interface?',
    options: [
      { id: 'a', text: 'Clone, commit, push, pull, create and switch branches, view diffs, and resolve merge conflicts.', isCorrect: true },
      { id: 'b', text: 'Clone and pull remote repositories, but committing and pushing code changes require external terminal CLI tools.', isCorrect: false },
      { id: 'c', text: 'Stage and commit code changes locally, but pushing to remote repositories and switching branches are unsupported.', isCorrect: false },
      { id: 'd', text: 'Create local workspace snapshot backups, but standard Git version control operations are completely unavailable.', isCorrect: false },
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
    question: 'What file types are supported within Databricks Repos workspace directories?',
    options: [
      { id: 'a', text: 'Only standard Databricks notebooks (.py, .sql, .scala, .r) are allowed in Repos folders.', isCorrect: false },
      { id: 'b', text: 'Only binary Delta Lake transaction log files and compressed Parquet data outputs.', isCorrect: false },
      { id: 'c', text: 'Notebooks, plain Python/SQL source files, YAML/JSON configuration files, and arbitrary text files.', isCorrect: true },
      { id: 'd', text: 'Only compiled Scala JAR files and packaged Python wheel (.whl) distribution archives.', isCorrect: false },
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
    question: 'What is the primary difference between an All-Purpose cluster and a Job cluster in Databricks?',
    options: [
      { id: 'a', text: 'Job clusters support interactive notebook execution, whereas All-Purpose clusters only execute scheduled workflow tasks.', isCorrect: false },
      { id: 'b', text: 'All-Purpose clusters remain active for interactive analysis, while ephemeral Job clusters provision for a job run and terminate upon completion.', isCorrect: true },
      { id: 'c', text: 'Job clusters run exclusively on bare-metal hardware, whereas All-Purpose clusters run on virtualized cloud worker nodes.', isCorrect: false },
      { id: 'd', text: 'All-Purpose clusters do not incur DBU charges, whereas Job clusters charge double DBU rates for automated execution.', isCorrect: false },
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
    question: 'How does cluster auto-scaling function in Databricks?',
    options: [
      { id: 'a', text: 'It automatically upgrades the cluster Databricks Runtime version whenever a new LTS release becomes available.', isCorrect: false },
      { id: 'b', text: 'It automatically restarts failed worker nodes and reinstalls missing init script dependencies.', isCorrect: false },
      { id: 'c', text: 'It dynamically adjusts worker node counts between configured minimum and maximum limits based on current workload demand.', isCorrect: true },
      { id: 'd', text: 'It automatically converts On-Demand worker instances to Spot instances when cloud prices drop.', isCorrect: false },
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
    question: 'What operational benefit does cluster auto-termination provide in Databricks?',
    options: [
      { id: 'a', text: 'It automatically terminates clusters after a specified period of inactivity to prevent unexpected cloud and DBU costs.', isCorrect: true },
      { id: 'b', text: 'It automatically cancels queries that exceed 10 minutes of execution time to protect cluster driver RAM.', isCorrect: false },
      { id: 'c', text: 'It automatically purges unreferenced Delta Lake table snapshots from underlying cloud object storage.', isCorrect: false },
      { id: 'd', text: 'It automatically downgrades worker instance types to smaller instance sizes during off-peak hours.', isCorrect: false },
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
    question: 'What is the purpose of a Databricks cluster policy?',
    options: [
      { id: 'a', text: 'A security rule that configures Unity Catalog table permissions for workspace user groups.', isCorrect: false },
      { id: 'b', text: 'A network policy that restricts workspace REST API traffic to corporate IP CIDR blocks.', isCorrect: false },
      { id: 'c', text: 'A JSON rule set enforced by administrators to restrict allowed cluster configurations and control costs.', isCorrect: true },
      { id: 'd', text: 'An automated backup schedule that creates daily snapshots of DBFS storage directories.', isCorrect: false },
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
    question: 'Write a SQL query to inspect detailed metadata, storage location, and table properties of table "sales.orders".',
    starterCode: `-- Inspect detailed table metadata\n`,
    testCases: [
      {
        input: 'sales.orders table',
        expectedOutput: 'DESCRIBE EXTENDED sales.orders',
        description: 'Should describe table with extended info',
      },
    ],
    solution: `DESCRIBE EXTENDED sales.orders
# OR
DESCRIBE DETAIL sales.orders`,
    explanation: 'DESCRIBE EXTENDED shows column names, types, comments, plus detailed table metadata including location, provider, properties, and statistics. DESCRIBE TABLE gives only column info.',
    hints: ['Use DESCRIBE EXTENDED or DESCRIBE DETAIL'],
    tieredHints: {
      apiSignature: 'DESCRIBE EXTENDED table_name',
      skeleton: '____ ____ sales.____',
    },
    tags: ['sql', 'describe', 'metadata'],
    concepts: ['ps-dataframe-create'],
  },

  {
    id: 'platform-sql-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DATABRICKS_PLATFORM,
    language: CodeLanguage.SQL,
    question: 'Write a SQL query to list all tables in the "analytics" schema.',
    starterCode: `-- List tables in schema\n`,
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
    tieredHints: {
      apiSignature: 'SHOW TABLES IN schema_name',
      skeleton: '____ ____ IN ____',
    },
    tags: ['sql', 'show-tables', 'metadata'],
    concepts: ['sql-temp-views', 'ps-dataframe-create'],
  },

  {
    id: 'platform-sql-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_PLATFORM,
    language: CodeLanguage.SQL,
    question: 'Create a session-scoped temporary view named "active_users" from the "users" table containing only records where account_status is "active".',
    starterCode: `-- Create active_users temp view\n`,
    testCases: [
      {
        input: 'users table',
        expectedOutput: 'CREATE OR REPLACE TEMP VIEW active_users',
        description: 'Should create temporary view',
      },
    ],
    solution: `CREATE OR REPLACE TEMP VIEW active_users AS\nSELECT * FROM users WHERE account_status = "active"
# OR
CREATE TEMP VIEW active_users AS\nSELECT * FROM users WHERE account_status = "active"`,
    explanation: 'CREATE OR REPLACE TEMP VIEW creates a session-scoped view that disappears when the cluster restarts. "OR REPLACE" overwrites the view if it already exists, avoiding errors on re-run.',
    hints: ['Use CREATE OR REPLACE TEMP VIEW view_name AS SELECT ...'],
    tieredHints: {
      apiSignature: 'CREATE OR REPLACE TEMP VIEW view_name AS SELECT ...',
      skeleton: 'CREATE OR REPLACE ____ VIEW active_users AS\nSELECT * FROM users ____ account_status = ____',
    },
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
    question: 'What is a broadcast hash join in Apache Spark?',
    options: [
      { id: 'a', text: 'A join strategy where worker nodes asynchronously stream partition keys over persistent TCP sockets', isCorrect: false },
      { id: 'b', text: 'A join strategy where the smaller DataFrame is copied to all worker nodes, avoiding a large data shuffle', isCorrect: true },
      { id: 'c', text: 'A join strategy restricted exclusively to real-time stateful Structured Streaming query pipelines', isCorrect: false },
      { id: 'd', text: 'A join strategy that forces all DataFrame rows to be collected and processed on the driver node', isCorrect: false },
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
    starterCode: `# Perform broadcast join on id and assign to result\n`,
    testCases: [
      {
        input: 'large_df and small_df',
        expectedOutput: 'broadcast(small_df)',
        description: 'Should use broadcast join',
      },
    ],
    solution: `from pyspark.sql.functions import broadcast\n\nresult = large_df.join(broadcast(small_df), "id")\n# OR\nfrom pyspark.sql.functions import broadcast\n\nresult = large_df.join(broadcast(small_df), on="id")`,
    explanation: 'Wrapping the smaller DataFrame in broadcast() forces Spark to broadcast it to all nodes, avoiding a shuffle on the larger DataFrame. Use this when one side is small enough to fit in memory.',
    hints: ['Use broadcast() on the smaller DataFrame', 'Import from pyspark.sql.functions'],
    tieredHints: {
      apiSignature: 'DataFrame.join(other, on=None, how=None) -> DataFrame',
      skeleton: 'from pyspark.sql.functions import broadcast\n\n____ = ____.____(____(____), ____)',
    },
    tags: ['broadcast', 'join', 'performance'],
    concepts: ['ps-broadcast-join', 'sql-joins-inner-outer', 'ps-cache-persist'],
  },

  {
    id: 'perf-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.SPARK_OPTIMIZATION,
    question: 'What is the primary operational difference between repartition() and coalesce() in PySpark?',
    options: [
      { id: 'a', text: 'repartition() performs a full shuffle to alter partition counts, whereas coalesce() avoids a full shuffle to decrease partitions', isCorrect: true },
      { id: 'b', text: 'repartition() operates exclusively on static Delta tables, whereas coalesce() operates only on streaming DataFrames', isCorrect: false },
      { id: 'c', text: 'repartition() decreases partition counts without shuffling, whereas coalesce() increases partition counts with a full shuffle', isCorrect: false },
      { id: 'd', text: 'repartition() applies only to RDD data structures, whereas coalesce() applies strictly to Spark SQL DataFrame objects', isCorrect: false },
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
    starterCode: `# Reduce partitions to 10 without a full shuffle\n`,
    testCases: [
      {
        input: 'df with 200 partitions',
        expectedOutput: 'df.coalesce(10)',
        description: 'Should coalesce to 10 partitions',
      },
    ],
    solution: `result = df.coalesce(10)\n# OR\nresult = df.coalesce(numPartitions=10)`,
    explanation: 'coalesce(n) reduces partitions without a full shuffle by merging existing partitions. Much faster than repartition() when you only need to decrease partition count.',
    hints: ['Use coalesce() to reduce partitions', 'coalesce avoids a full shuffle unlike repartition'],
    tieredHints: {
      apiSignature: 'DataFrame.coalesce(numPartitions) -> DataFrame',
      skeleton: 'result = ____.____(____)',
    },
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
    starterCode: `# Repartition into 8 partitions by country\n`,
    testCases: [
      {
        input: 'df with country column',
        expectedOutput: 'df.repartition(8, "country")',
        description: 'Should repartition by country',
      },
    ],
    solution: `result = df.repartition(8, "country")\n# OR\nresult = df.repartition(8, col("country"))\n# OR\nfrom pyspark.sql.functions import col\n\nresult = df.repartition(8, col("country"))`,
    explanation: 'repartition(n, col) redistributes data so rows with the same column value end up in the same partition. This optimizes subsequent joins or aggregations on that column by avoiding shuffles.',
    hints: ['Use repartition(numPartitions, column)', 'Column-based repartitioning co-locates data'],
    tieredHints: {
      apiSignature: 'DataFrame.repartition(numPartitions, *cols) -> DataFrame',
      skeleton: 'result = df.____(____, ____)',
    },
    tags: ['repartition', 'partitioning', 'performance'],
    concepts: ['ps-partitioning', 'ps-cache-persist'],
  },

  {
    id: 'perf-6',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.SPARK_OPTIMIZATION,
    question: 'What is Adaptive Query Execution (AQE) in Apache Spark 3.x?',
    options: [
      { id: 'a', text: 'A feature that dynamically scales cloud cluster worker nodes during high-concurrency SQL execution', isCorrect: false },
      { id: 'b', text: 'A dynamic optimization framework that modifies query execution plans at runtime based on actual stage statistics', isCorrect: true },
      { id: 'c', text: 'An automated storage compaction engine that merges small Parquet data files during routine background maintenance', isCorrect: false },
      { id: 'd', text: 'A client-side query rewriting tool that translates complex SQL queries into optimized PySpark DataFrame code', isCorrect: false },
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
    question: 'What is data skew in Spark distributed data processing, and why does it impact performance?',
    options: [
      { id: 'a', text: 'Data skew occurs when column data types mismatch, forcing Spark to perform expensive runtime type casts', isCorrect: false },
      { id: 'b', text: 'Data skew occurs when raw files contain missing null values, causing executor tasks to abort prematurely', isCorrect: false },
      { id: 'c', text: 'Data skew occurs when data is unevenly distributed across partitions, causing bottlenecked tasks on overloaded executors', isCorrect: true },
      { id: 'd', text: 'Data skew occurs when Delta transaction logs become corrupted, forcing full table re-scans on every query', isCorrect: false },
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
    question: 'What is the operational difference between cache() and persist() in PySpark?',
    options: [
      { id: 'a', text: 'cache() stores data in memory only, whereas persist() is a deprecated API replaced by Delta Lake caching', isCorrect: false },
      { id: 'b', text: 'cache() uses default MEMORY_AND_DISK storage, whereas persist() accepts custom StorageLevel configurations', isCorrect: true },
      { id: 'c', text: 'cache() forces immediate eager execution, whereas persist() delays evaluation until the SparkSession closes', isCorrect: false },
      { id: 'd', text: 'cache() applies exclusively to SQL views, whereas persist() applies only to streaming DataFrame objects', isCorrect: false },
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
    question: 'Cache DataFrame "df" in memory, trigger materialization with count(), then write two separate aggregations: "avg_result" taking the average salary by department, and "max_result" taking the maximum salary by department.',
    starterCode: `# Cache DataFrame, trigger materialization, and compute aggregations\n`,
    testCases: [
      {
        input: 'df to cache',
        expectedOutput: 'df.cache() and df.count()',
        description: 'Should cache and materialize',
      },
    ],
    solution: `df_cached = df.cache()\ndf_cached.count()\n\navg_result = df_cached.groupBy("dept").avg("salary")\nmax_result = df_cached.groupBy("dept").max("salary")\n# OR\ndf.cache()\ndf.count()\n\navg_result = df.groupBy("dept").avg("salary")\nmax_result = df.groupBy("dept").max("salary")`,
    explanation: 'cache() is lazy — it only marks the DataFrame for caching. You need an action like count() to actually materialize and cache the data. After that, subsequent operations read from the cache instead of recomputing.',
    hints: ['cache() is lazy — trigger with an action like count()', 'Reuse the cached reference for multiple operations'],
    tieredHints: {
      apiSignature: 'DataFrame.cache() -> DataFrame',
      skeleton: '____ = ____.____()\n____.____()\n\n____ = ____.____(____).____(____)\n____ = ____.____(____).____(____)',
    },
    tags: ['cache', 'lazy', 'materialization', 'performance'],
    concepts: ['ps-cache-persist', 'ps-actions-vs-transforms'],
  },

  {
    id: 'perf-10',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.SPARK_OPTIMIZATION,
    language: CodeLanguage.PYTHON,
    question: 'Unpersist the cached DataFrame "df_cached" to free up executor memory resources.',
    starterCode: `# Free cached memory\n`,
    testCases: [
      {
        input: 'cached DataFrame',
        expectedOutput: 'df_cached.unpersist()',
        description: 'Should unpersist',
      },
    ],
    solution: `df_cached.unpersist()\n# OR\ndf_cached.unpersist(blocking=True)`,
    explanation: 'unpersist() removes the DataFrame from the cache and frees memory. Always unpersist when you no longer need the cached data to avoid memory pressure.',
    hints: ['Use .unpersist() on the cached DataFrame'],
    tieredHints: {
      apiSignature: 'DataFrame.unpersist(blocking=False) -> DataFrame',
      skeleton: '____.____(____)',
    },
    tags: ['unpersist', 'cache', 'memory', 'performance'],
    concepts: ['ps-cache-persist'],
  },

  {
    id: 'perf-11',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.SPARK_OPTIMIZATION,
    question: 'What is partition pruning in Spark SQL query execution?',
    options: [
      { id: 'a', text: 'An automated background process that permanently deletes outdated partition directories from cloud storage', isCorrect: false },
      { id: 'b', text: 'A query optimization technique where Spark skips reading file directories for unneeded partition key values', isCorrect: true },
      { id: 'c', text: 'A dataframe transformation that merges small partition files into uniform 128 MB storage blocks', isCorrect: false },
      { id: 'd', text: 'A memory management strategy that evicts cold partition data from executor RAM to disk storage', isCorrect: false },
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
    question: 'Write DataFrame "df" (columns: sale_id, product, amount, sale_date, year, month) to a Delta table at path "/data/sales", partitioned by "year" and "month" columns, using overwrite save mode.',
    starterCode: `# Write partitioned Delta table\n`,
    testCases: [
      {
        input: 'df with year and month columns',
        expectedOutput: '.partitionBy("year", "month").format("delta")',
        description: 'Should write partitioned by year and month',
      },
    ],
    solution: `df.write.format("delta").partitionBy("year", "month").mode("overwrite").save("/data/sales")\n# OR\ndf.write.partitionBy("year", "month").mode("overwrite").format("delta").save("/data/sales")`,
    explanation: 'partitionBy("year", "month") creates a nested directory structure: /data/sales/year=2024/month=01/. Queries filtering on these columns skip irrelevant directories entirely (partition pruning). mode("overwrite") replaces existing data. Rule of thumb: only partition by columns with fewer than ~1000 distinct values.',
    hints: ['partitionBy("year", "month") — pass column names as strings', 'mode("overwrite") replaces existing data, "append" adds to it', '.save(path) for path-based tables, .saveAsTable(name) for metastore tables'],
    tieredHints: {
      apiSignature: 'DataFrameWriter.partitionBy(*cols).mode(saveMode).save(path=None)',
      skeleton: 'df.write.format("delta").____("year", "month").____("overwrite").____("/data/sales")',
    },
    tags: ['partitionBy', 'write', 'delta', 'performance'],
    concepts: ['ps-partitioning', 'ps-write-modes', 'delta-acid', 'ps-cache-persist'],
  },

  {
    id: 'perf-13',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.SPARK_OPTIMIZATION,
    question: 'Why should custom Python UDFs (User-Defined Functions) be avoided in PySpark when built-in functions exist?',
    options: [
      { id: 'a', text: 'Python UDFs cannot process complex struct or array columns and throw runtime serialization exceptions', isCorrect: false },
      { id: 'b', text: 'Python UDFs require row-by-row data serialization between JVM and Python processes, causing major overhead', isCorrect: true },
      { id: 'c', text: 'Python UDFs bypass Spark execution plans and execute synchronously on single-node driver instances', isCorrect: false },
      { id: 'd', text: 'Python UDFs are limited to single-threaded batch execution and cannot run on worker node clusters', isCorrect: false },
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
    question: 'What is the default value of spark.sql.shuffle.partitions in Spark, and how should it be configured for small datasets?',
    options: [
      { id: 'a', text: 'Default is 200; reducing it for small datasets avoids the scheduling overhead of hundreds of tiny tasks', isCorrect: true },
      { id: 'b', text: 'Default is 10; increasing it to 200 for small datasets ensures optimal multi-threaded parallel processing', isCorrect: false },
      { id: 'c', text: 'Default is 1000; reducing it to 500 prevents executor nodes from running out of disk storage space', isCorrect: false },
      { id: 'd', text: 'Default is 1; increasing it to match total CPU cores avoids single-threaded driver execution bottlenecks', isCorrect: false },
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
    question: 'Configure the SparkSession setting "spark.sql.shuffle.partitions" to 8 for processing a small dataset.',
    starterCode: `# Set shuffle partitions\n`,
    testCases: [
      {
        input: 'spark session',
        expectedOutput: 'spark.conf.set("spark.sql.shuffle.partitions", 8)',
        description: 'Should set shuffle partitions to 8',
      },
    ],
    solution: `spark.conf.set("spark.sql.shuffle.partitions", 8)\n# OR\nspark.conf.set("spark.sql.shuffle.partitions", "8")`,
    explanation: 'Reducing shuffle partitions for small datasets avoids the overhead of 200 tiny tasks. Set this before running operations that trigger shuffles (joins, groupBy, etc.).',
    hints: ['Use spark.conf.set()', 'Property is spark.sql.shuffle.partitions'],
    tieredHints: {
      apiSignature: 'RuntimeConfig.set(key, value)',
      skeleton: 'spark.____.____("spark.sql.shuffle.partitions", ____)',
    },
    tags: ['shuffle-partitions', 'conf', 'performance'],
    concepts: ['ps-shuffle', 'ps-cache-persist'],
  },

  {
    id: 'perf-16',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.SPARK_OPTIMIZATION,
    question: 'Which set of PySpark operations requires a wide transformation that shuffles data across worker nodes?',
    options: [
      { id: 'a', text: 'Transformation functions such as select(), filter(), withColumn(), and drop()', isCorrect: false },
      { id: 'b', text: 'State and inspection actions such as cache(), persist(), unpersist(), and show()', isCorrect: false },
      { id: 'c', text: 'Aggregation and join operations such as join(), groupBy(), repartition(), and distinct()', isCorrect: true },
      { id: 'd', text: 'Data ingestion and output operations such as read(), write(), load(), and save()', isCorrect: false },
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
    question: 'What primary diagnostic capability does the Spark UI provide to data engineers during job execution?',
    options: [
      { id: 'a', text: 'Interactive code editing environment for building and testing complex PySpark transformation pipelines', isCorrect: false },
      { id: 'b', text: 'Visual monitoring of job stages, task durations, shuffle metrics, and physical execution plans', isCorrect: true },
      { id: 'c', text: 'Web management console for provisioning cloud infrastructure nodes and configuring workspace user permissions', isCorrect: false },
      { id: 'd', text: 'Automated query optimizer that rewrites slow PySpark DataFrame code into optimized native SQL queries', isCorrect: false },
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
    question: 'Print the physical execution plan for a join between DataFrames "orders_df" and "customers_df" on column "customer_id".',
    starterCode: `# Print physical execution plan for joined DataFrames\n`,
    testCases: [
      {
        input: 'two DataFrames',
        expectedOutput: '.explain()',
        description: 'Should show execution plan',
      },
    ],
    solution: `orders_df.join(customers_df, "customer_id").explain()\n# OR\norders_df.join(customers_df, on="customer_id").explain()\n# OR\njoined_df = orders_df.join(customers_df, "customer_id")\njoined_df.explain()`,
    explanation: 'explain() prints the physical execution plan showing how Spark will execute the query. Use explain(True) for extended info (logical + physical plans). Look for BroadcastHashJoin vs SortMergeJoin to understand join strategies.',
    hints: ['Chain .explain() after your transformation', 'explain(True) shows more detail'],
    tieredHints: {
      apiSignature: 'DataFrame.explain(extended=None) -> None',
      skeleton: 'orders_df.____(____, "customer_id").____()',
    },
    tags: ['explain', 'execution-plan', 'debugging', 'performance'],
    concepts: ['ps-execution-plans', 'ps-cache-persist'],
  },

  {
    id: 'perf-19',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.SPARK_OPTIMIZATION,
    question: 'What is predicate pushdown in Spark data source reading?',
    options: [
      { id: 'a', text: 'An optimization that pushes filter conditions to the underlying file format to skip reading non-matching data', isCorrect: true },
      { id: 'b', text: 'A data pipeline pattern that defers WHERE clause evaluation until final aggregation steps complete', isCorrect: false },
      { id: 'c', text: 'A memory management strategy that moves filtered DataFrame partitions from executor RAM to disk storage', isCorrect: false },
      { id: 'd', text: 'A query execution mode that pushes all filtering operations to be processed on the single driver node', isCorrect: false },
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
    question: 'What performance and operational advantages does Delta Lake format offer over plain Parquet files?',
    options: [
      { id: 'a', text: 'Delta files use proprietary binary compression that reduces storage disk footprint by over 50 percent', isCorrect: false },
      { id: 'b', text: 'Delta adds ACID transactions, data skipping, schema enforcement, and compaction via OPTIMIZE and Z-Ordering', isCorrect: true },
      { id: 'c', text: 'Delta eliminates cloud object storage costs by storing table data directly in executor JVM heap memory', isCorrect: false },
      { id: 'd', text: 'Delta forces all DataFrame queries to execute synchronously on single-node driver instances', isCorrect: false },
    ],
    explanation: 'Delta Lake builds on Parquet but adds a transaction log, enabling ACID transactions, time travel, schema evolution, and data skipping via file-level statistics. OPTIMIZE compacts small files and ZORDER co-locates data for faster queries.',
    tags: ['delta', 'parquet', 'comparison', 'performance'],
    concepts: ['delta-acid', 'ps-io-parquet', 'ps-cache-persist'],
  },
];
