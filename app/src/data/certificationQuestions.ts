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
      { id: 'a', text: 'A separate streaming API with its own DStream operations, which differ from DataFrame transformations', isCorrect: false },
      { id: 'b', text: 'A scheduler that re-runs a batch query over the whole source table at a fixed interval', isCorrect: false },
      { id: 'c', text: 'A stream engine on Spark SQL that treats a stream as a table that keeps growing', isCorrect: true },
      { id: 'd', text: 'A record-at-a-time engine that handles each event the moment it arrives, with no batches', isCorrect: false },
    ],
    explanation: 'Structured Streaming treats a stream as an unbounded table that keeps getting new rows: `spark.readStream` makes a streaming DataFrame and you use the same transformations as in batch. Each trigger runs a micro-batch over only the rows that arrived since the last one, so it is neither a full re-run of a batch query nor record-at-a-time processing. DStreams are the older Spark Streaming API that Structured Streaming replaced.',
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
      { id: 'a', text: 'Append, Overwrite, ErrorIfExists', isCorrect: false },
      { id: 'b', text: 'Append, Overwrite, Merge', isCorrect: false },
      { id: 'c', text: 'Insert, Update, Delete', isCorrect: false },
      { id: 'd', text: 'Append, Complete, Update', isCorrect: true },
    ],
    explanation: 'A streaming write takes one of three output modes: append writes only new result rows, complete rewrites the whole result table on each trigger, and update writes only the result rows that changed. Overwrite and ErrorIfExists are save modes of a batch `df.write`, Merge is a Delta SQL statement, and insert, update and delete are kinds of row change, not output modes.',
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
    question: 'Write the streaming DataFrame "stream_df" to the Delta table "output_events" in append mode, with its checkpoint in the volume folder "/Volumes/main/default/checkpoints/output_events". Assign the running query to "query".',
    starterCode: `query = stream_df`,
    requires: [/checkpointLocation/, /toTable/, /^(?![\s\S]*outputMode\(\s*["'](?:complete|update)["'])/],
    testCases: [
      {
        input: 'streaming DataFrame',
        expectedOutput: 'writeStream.outputMode("append").option("checkpointLocation", ...).toTable("output_events")',
        description: 'Should write stream to Delta with checkpoint',
      },
    ],
    solution: `query = stream_df.writeStream.format("delta").outputMode("append").option("checkpointLocation", "/Volumes/main/default/checkpoints/output_events").toTable("output_events")
# OR
query = stream_df.writeStream.outputMode("append").option("checkpointLocation", "/Volumes/main/default/checkpoints/output_events").toTable("output_events")
# OR
query = stream_df.writeStream.option("checkpointLocation", "/Volumes/main/default/checkpoints/output_events").toTable("output_events")
# OR
query = stream_df.writeStream.toTable("output_events", outputMode="append", checkpointLocation="/Volumes/main/default/checkpoints/output_events")`,
    explanation: 'writeStream writes a streaming DataFrame, and .toTable("name") starts the query and writes to a table, which is Delta by default. Append is the default output mode, so outputMode("append") can be left out. The checkpointLocation is required: it records how far the source has been read, so a restarted query resumes where it stopped instead of reading everything again.',
    hints: ['Use .writeStream with .toTable("name") to write to a table', 'Set outputMode to "append"', 'Always set checkpointLocation'],
    tieredHints: {
      apiSignature: 'DataStreamWriter.outputMode(outputMode).option(key, value).toTable(tableName)',
      skeleton: 'query = stream_df.____.____("append").option("checkpointLocation", "/Volumes/main/default/checkpoints/output_events").____("output_events")',
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
      { id: 'a', text: 'To record how far the source has been read and the state of aggregations, so a restarted query resumes where it stopped', isCorrect: true },
      { id: 'b', text: 'To keep a copy of every row written to the target, so the target table can be rebuilt if it is dropped', isCorrect: false },
      { id: 'c', text: 'To hold the schedule that tells the query when to start its next micro-batch', isCorrect: false },
      { id: 'd', text: 'To cap the number of rows each micro-batch may read from the source', isCorrect: false },
    ],
    explanation: `The checkpoint is the query's memory: the offsets it has read up to and the state of stateful operations such as running counts. On a restart the query reads the checkpoint and carries on from there, so nothing is skipped or read twice. The trigger sets the schedule, options such as maxFilesPerTrigger cap a batch, and the checkpoint holds no copy of the output.`,
    tags: ['streaming', 'checkpoint', 'fault-tolerance'],
    concepts: ['stream-readstream-writestream', 'stream-checkpoint'],
  },

  {
    id: 'streaming-6',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.STRUCTURED_STREAMING,
    question: 'A streaming query should keep running and start each micro-batch as soon as the previous one finishes, with no wait in between. Which trigger setting does that?',
    options: [
      { id: 'a', text: 'Call no .trigger() at all and keep the default', isCorrect: true },
      { id: 'b', text: '.trigger(availableNow=True)', isCorrect: false },
      { id: 'c', text: '.trigger(processingTime="1 minute")', isCorrect: false },
      { id: 'd', text: '.trigger(once=True)', isCorrect: false },
    ],
    explanation: 'With no trigger set, Spark runs micro-batches back to back: the next one starts as soon as the previous one finishes (the same as processingTime="0 seconds"), and the query keeps running. availableNow=True also runs batches back to back, but stops once everything waiting has been processed. processingTime="1 minute" waits for the next minute mark, and the deprecated once=True runs a single batch and stops.',
    tags: ['streaming', 'trigger'],
    concepts: ['stream-readstream-writestream', 'stream-triggers'],
  },

  {
    id: 'streaming-7',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.STRUCTURED_STREAMING,
    language: CodeLanguage.PYTHON,
    question: 'Write the streaming DataFrame "stream_df" to the Delta table "output" in append mode, starting a micro-batch every 30 seconds, with its checkpoint in "/Volumes/main/default/checkpoints/output". Assign the running query to "query".',
    starterCode: `query = stream_df`,
    requires: [/processingTime\s*=\s*["']30 seconds["']/, /checkpointLocation/],
    testCases: [
      {
        input: 'streaming query',
        expectedOutput: '.trigger(processingTime="30 seconds")',
        description: 'Should set 30 second trigger',
      },
    ],
    solution: `query = stream_df.writeStream.format("delta").outputMode("append").option("checkpointLocation", "/Volumes/main/default/checkpoints/output").trigger(processingTime="30 seconds").toTable("output")
# OR
query = stream_df.writeStream.outputMode("append").option("checkpointLocation", "/Volumes/main/default/checkpoints/output").trigger(processingTime="30 seconds").toTable("output")
# OR
query = stream_df.writeStream.option("checkpointLocation", "/Volumes/main/default/checkpoints/output").trigger(processingTime="30 seconds").toTable("output")`,
    explanation: 'trigger(processingTime="30 seconds") starts a micro-batch every 30 seconds. If a batch takes longer than the interval, the next one starts as soon as it finishes. Append is the default output mode, so outputMode("append") can be left out, and toTable writes Delta by default.',
    hints: ['Configure trigger using processingTime="30 seconds"', 'Set checkpointLocation and outputMode before writing to table'],
    tieredHints: {
      apiSignature: 'DataStreamWriter.trigger(processingTime=None).toTable(tableName)',
      skeleton: 'query = stream_df.____.____("append").____("checkpointLocation", "/Volumes/main/default/checkpoints/output").____(____="30 seconds").____("output")',
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
    question: 'Write the streaming DataFrame "stream_df" to the Delta table "output" in append mode, with its checkpoint in "/Volumes/main/default/checkpoints/output", so that the query processes all the data waiting now, in as many micro-batches as it needs, and then stops. Assign the query to "query".',
    starterCode: `query = stream_df`,
    requires: [/availableNow\s*=\s*True/, /checkpointLocation/],
    testCases: [
      {
        input: 'streaming query',
        expectedOutput: '.trigger(availableNow=True)',
        description: 'Should use availableNow trigger',
      },
    ],
    solution: `query = stream_df.writeStream.format("delta").outputMode("append").option("checkpointLocation", "/Volumes/main/default/checkpoints/output").trigger(availableNow=True).toTable("output")
# OR
query = stream_df.writeStream.outputMode("append").option("checkpointLocation", "/Volumes/main/default/checkpoints/output").trigger(availableNow=True).toTable("output")
# OR
query = stream_df.writeStream.option("checkpointLocation", "/Volumes/main/default/checkpoints/output").trigger(availableNow=True).toTable("output")`,
    explanation: 'trigger(availableNow=True) processes everything waiting in the source, split into as many micro-batches as needed, and then stops the query, which suits a scheduled job. It replaces the deprecated trigger(once=True), which forced all of it into a single batch.',
    hints: ['Set availableNow=True in trigger', 'Write to Delta table with checkpointing enabled'],
    tieredHints: {
      apiSignature: 'DataStreamWriter.trigger(availableNow=False).toTable(tableName)',
      skeleton: 'query = stream_df.____.____("append").____("checkpointLocation", "/Volumes/main/default/checkpoints/output").____(____=____).____("output")',
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
      { id: 'a', text: 'A marker in the checkpoint of how far the source has been read, so a restart resumes there', isCorrect: false },
      { id: 'b', text: 'A limit on how many rows each micro-batch may read from the source', isCorrect: false },
      { id: 'c', text: 'A threshold on how late event-time data may arrive, after which Spark can drop the old state', isCorrect: true },
      { id: 'd', text: 'A delay that holds every row back for the threshold, so late rows can be sorted in first', isCorrect: false },
    ],
    explanation: `withWatermark("ts", "10 minutes") tells Spark that data more than 10 minutes behind the latest event time seen is too late. Spark can then finish old windows and drop their state instead of keeping it forever; rows later than that may be dropped. The read position is the checkpoint's offsets, not the watermark, batch size is set by options such as maxFilesPerTrigger, and rows are not held back.`,
    tags: ['streaming', 'watermark', 'late-data'],
    concepts: ['stream-readstream-writestream', 'stream-watermarks'],
  },

  {
    id: 'streaming-10',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.STRUCTURED_STREAMING,
    language: CodeLanguage.PYTHON,
    requires: [/withWatermark\(\s*["']event_time["']\s*,\s*["']10 minutes["']\s*\)/],
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
    explanation: 'withWatermark(eventTimeColumn, delayThreshold) tells Spark how late data may arrive: rows within 10 minutes of the latest event_time seen are still counted, and state for anything older can be dropped. Rows that arrive later than the threshold may be ignored by stateful operations such as windowed aggregations and deduplication.',
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
      { id: 'a', text: 'When each trigger should write only the new rows, which never change once written', isCorrect: false },
      { id: 'b', text: 'When each trigger should write only the aggregate rows that changed in that batch', isCorrect: false },
      { id: 'c', text: 'When the query only filters and selects columns, with no aggregation', isCorrect: false },
      { id: 'd', text: 'When each trigger should rewrite the whole aggregated result table', isCorrect: true },
    ],
    explanation: 'Complete mode rewrites the whole result table on every trigger, which suits a running aggregation whose earlier counts change. Writing only the changed aggregate rows is update mode (a Delta table sink accepts append and complete, not update). Append writes each new row once, and a query with no aggregation cannot use complete mode. An aggregation in append mode needs a watermark.',
    tags: ['streaming', 'output-modes', 'complete'],
    concepts: ['stream-readstream-writestream', 'stream-output-modes'],
  },

  {
    id: 'streaming-12',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.STRUCTURED_STREAMING,
    language: CodeLanguage.PYTHON,
    question: 'Read a stream of JSON files from the volume folder "/Volumes/main/default/landing/events/" into the DataFrame "stream_df", using the schema already defined in the variable "event_schema".',
    starterCode: `stream_df = spark.readStream`,
    requires: [/event_schema/, /readStream/, /json/],
    testCases: [
      {
        input: 'JSON files in /Volumes/main/default/landing/events/',
        expectedOutput: 'spark.readStream.format("json").schema(event_schema).load("/Volumes/main/default/landing/events/")',
        description: 'Should read JSON stream with schema',
      },
    ],
    solution: `stream_df = spark.readStream.format("json").schema(event_schema).load("/Volumes/main/default/landing/events/")
# OR
stream_df = spark.readStream.schema(event_schema).json("/Volumes/main/default/landing/events/")
# OR
stream_df = spark.readStream.json("/Volumes/main/default/landing/events/", schema=event_schema)
# OR
stream_df = spark.readStream.schema(event_schema).format("json").load("/Volumes/main/default/landing/events/")`,
    explanation: 'A plain file stream needs its schema up front: by default Spark does not infer it for a stream, since files keep arriving, and readStream without a schema fails with "Schema must be specified". The chained .format("json").schema(...).load(path) and the shorthand .json(path, schema=...) are the same reader. Auto Loader, the next topic, is the stream source that infers and evolves the schema for you.',
    hints: ['A file stream does not infer its schema by default, so pass event_schema', 'Use .format("json").schema(event_schema).load(path) or .json(path, schema=event_schema)'],
    tieredHints: {
      apiSignature: 'DataStreamReader.format(source).schema(schema).load(path=None) -> DataFrame',
      skeleton: 'stream_df = spark.____.____("json").____(____).____("/Volumes/main/default/landing/events/")',
    },
    tags: ['streaming', 'json', 'schema'],
    concepts: ['stream-readstream-writestream', 'ps-io-json', 'ps-dataframe-create'],
  },

  {
    id: 'streaming-13',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.STRUCTURED_STREAMING,
    question: 'A streaming query writes to a Delta table with a checkpoint location. It fails in the middle of a micro-batch and is restarted with the same checkpoint. What happens?',
    options: [
      { id: 'a', text: 'It reads the whole source again from the start, since the failed run did not finish', isCorrect: false },
      { id: 'b', text: 'It resumes from the offsets in the checkpoint and redoes the unfinished batch, writing each row once', isCorrect: true },
      { id: 'c', text: 'It skips the micro-batch that failed and carries on with the rows after it', isCorrect: false },
      { id: 'd', text: 'It redoes the unfinished batch, so the rows that batch wrote before the failure appear twice', isCorrect: false },
    ],
    explanation: 'The checkpoint records which offsets each batch covers and which batches committed. On restart the query redoes the batch that did not commit, over the same offsets, and the Delta sink records the batches it has committed, so rows are not written twice: exactly-once. Nothing is skipped, and only a new or deleted checkpoint makes the query read the whole source again.',
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
      { id: 'a', text: 'A cluster feature that adds worker nodes automatically when more files arrive', isCorrect: false },
      { id: 'b', text: 'A stream source that loads each new file arriving in cloud storage or a volume exactly once', isCorrect: true },
      { id: 'c', text: 'A batch command that reloads every file in a folder each time it runs', isCorrect: false },
      { id: 'd', text: 'A job scheduler that runs a notebook whenever a file lands in a folder', isCorrect: false },
    ],
    explanation: 'Auto Loader is the `cloudFiles` stream source: it watches a folder in a Unity Catalog volume or cloud storage, and its checkpoint records every file it has loaded, so each run picks up only new files. It also infers and evolves the schema. It does not scale clusters or schedule jobs, and it never reloads files it has already loaded.',
    tags: ['autoloader', 'ingestion', 'cloudFiles'],
    concepts: ['stream-autoloader'],
  },

  {
    id: 'autoloader-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.AUTO_LOADER,
    language: CodeLanguage.PYTHON,
    question: 'Use Auto Loader to stream the JSON files arriving in the volume folder "/Volumes/main/default/landing/raw/" into the DataFrame "stream_df", keeping the inferred schema in "/Volumes/main/default/checkpoints/raw/schema".',
    starterCode: `stream_df = spark.readStream`,
    requires: [/format\(\s*["']cloudFiles["']\s*\)/, /cloudFiles\.format["']\s*,\s*["']json/, /cloudFiles\.schemaLocation/],
    testCases: [
      {
        input: 'JSON files in /Volumes/main/default/landing/raw/',
        expectedOutput: '.format("cloudFiles").option("cloudFiles.format", "json").option("cloudFiles.schemaLocation", ...)',
        description: 'Should use cloudFiles format with JSON',
      },
    ],
    solution: `stream_df = spark.readStream.format("cloudFiles").option("cloudFiles.format", "json").option("cloudFiles.schemaLocation", "/Volumes/main/default/checkpoints/raw/schema").load("/Volumes/main/default/landing/raw/")
# OR
stream_df = spark.readStream.format("cloudFiles").option("cloudFiles.schemaLocation", "/Volumes/main/default/checkpoints/raw/schema").option("cloudFiles.format", "json").load("/Volumes/main/default/landing/raw/")
# OR
stream_df = spark.readStream.option("cloudFiles.format", "json").option("cloudFiles.schemaLocation", "/Volumes/main/default/checkpoints/raw/schema").format("cloudFiles").load("/Volumes/main/default/landing/raw/")`,
    explanation: 'format("cloudFiles") is what makes the reader Auto Loader rather than a plain file stream, and the cloudFiles.format option names the file type. cloudFiles.schemaLocation is where Auto Loader keeps the schema it inferred, so later runs reuse it and record any new columns there.',
    hints: ['Set format to "cloudFiles"', 'Specify "cloudFiles.format" as "json"', 'Set "cloudFiles.schemaLocation" option'],
    tieredHints: {
      apiSignature: 'DataStreamReader.format("cloudFiles").option(key, value).load(path=None) -> DataFrame',
      skeleton: 'stream_df = spark.____.____("cloudFiles").____("cloudFiles.format", ____).____("cloudFiles.schemaLocation", ____).____("/Volumes/main/default/landing/raw/")',
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
    explanation: `In directory listing mode, the default, Auto Loader lists the input folder to find new files. In file notification mode (cloudFiles.useNotifications, or file events on a Unity Catalog external location) the cloud's storage events announce each new file, such as AWS SNS/SQS, so no listing is needed, which scales to millions of files.`,
    tags: ['autoloader', 'file-detection'],
    concepts: ['stream-autoloader'],
  },

  {
    id: 'autoloader-4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.AUTO_LOADER,
    question: 'Auto Loader runs with the default schema evolution mode, addNewColumns. A new file has a column that the stored schema does not have. What happens?',
    options: [
      { id: 'a', text: 'The stream stops once, the column is added to the stored schema, and the restarted stream carries on with it', isCorrect: true },
      { id: 'b', text: 'The column is added on the fly and the running stream carries on without stopping', isCorrect: false },
      { id: 'c', text: 'The new column is ignored and the stored schema stays as it was', isCorrect: false },
      { id: 'd', text: `The new column's values go into _rescued_data and the schema never changes`, isCorrect: false },
    ],
    explanation: 'With the default schemaEvolutionMode, addNewColumns, Auto Loader stops the stream with an UnknownFieldException and adds the new column to the schema kept in cloudFiles.schemaLocation; the next start goes on with it, which a job set to retry does for you. Ignoring new columns is the "none" mode, and keeping the schema fixed while sending them to _rescued_data is the "rescue" mode.',
    tags: ['autoloader', 'schema-evolution'],
    concepts: ['stream-autoloader', 'stream-schema-evolution'],
  },

  {
    id: 'autoloader-5',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.AUTO_LOADER,
    language: CodeLanguage.PYTHON,
    question: 'Write an Auto Loader stream that reads the CSV files (with a header line) arriving in "/Volumes/main/default/landing/csv/", keeps the inferred schema in "/Volumes/main/default/checkpoints/bronze_data/schema", and appends the rows to the Delta table "bronze_data" with its checkpoint in "/Volumes/main/default/checkpoints/bronze_data".',
    starterCode: `spark.readStream`,
    requires: [/format\(\s*["']cloudFiles["']\s*\)/, /cloudFiles\.format["']\s*,\s*["']csv/, /header/, /checkpointLocation/, /^(?![\s\S]*outputMode\(\s*["'](?:complete|update)["'])/],
    testCases: [
      {
        input: 'CSV files',
        expectedOutput: 'cloudFiles format, csv, writeStream to delta',
        description: 'Should create full Auto Loader pipeline',
      },
    ],
    solution: `spark.readStream.format("cloudFiles").option("cloudFiles.format", "csv").option("header", "true").option("cloudFiles.schemaLocation", "/Volumes/main/default/checkpoints/bronze_data/schema").load("/Volumes/main/default/landing/csv/").writeStream.format("delta").option("checkpointLocation", "/Volumes/main/default/checkpoints/bronze_data").outputMode("append").toTable("bronze_data")
# OR
spark.readStream.format("cloudFiles").option("cloudFiles.format", "csv").option("header", "true").option("cloudFiles.schemaLocation", "/Volumes/main/default/checkpoints/bronze_data/schema").load("/Volumes/main/default/landing/csv/").writeStream.option("checkpointLocation", "/Volumes/main/default/checkpoints/bronze_data").outputMode("append").toTable("bronze_data")
# OR
spark.readStream.format("cloudFiles").option("cloudFiles.format", "csv").option("header", "true").option("cloudFiles.schemaLocation", "/Volumes/main/default/checkpoints/bronze_data/schema").load("/Volumes/main/default/landing/csv/").writeStream.option("checkpointLocation", "/Volumes/main/default/checkpoints/bronze_data").toTable("bronze_data")
# OR
spark.readStream.format("cloudFiles").option("cloudFiles.format", "csv").option("header", True).option("cloudFiles.schemaLocation", "/Volumes/main/default/checkpoints/bronze_data/schema").load("/Volumes/main/default/landing/csv/").writeStream.option("checkpointLocation", "/Volumes/main/default/checkpoints/bronze_data").toTable("bronze_data")`,
    explanation: `A full Auto Loader ingest: readStream with format("cloudFiles") reads only new files, cloudFiles.schemaLocation keeps the inferred schema, "header" is the CSV reader's own option, and writeStream.toTable appends to a Delta table (append is the default output mode). The checkpointLocation records which files are done; the schema and the checkpoint may share one folder or use two.`,
    hints: ['Chain readStream with the cloudFiles options and load("/Volumes/main/default/landing/csv/")', 'Chain writeStream with checkpointLocation and toTable("bronze_data")'],
    tieredHints: {
      apiSignature: 'DataStreamReader.format("cloudFiles").option(key, value).load(path=None).writeStream -> DataStreamWriter',
      skeleton: 'spark.____.____("cloudFiles").____("cloudFiles.format", "csv").____("header", "true").____("cloudFiles.schemaLocation", "/Volumes/main/default/checkpoints/bronze_data/schema").____("/Volumes/main/default/landing/csv/").____.____("checkpointLocation", "/Volumes/main/default/checkpoints/bronze_data").____("append").____("bronze_data")',
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
      { id: 'a', text: 'It infers and evolves the schema, rescues values that do not fit, and can find files by notification at scale', isCorrect: true },
      { id: 'b', text: 'It remembers which files it loaded, while a plain file stream reads every file again on each run', isCorrect: false },
      { id: 'c', text: 'It can also read non-file sources such as Apache Kafka and Event Hubs', isCorrect: false },
      { id: 'd', text: 'It reads each file faster because it skips building a Spark query plan', isCorrect: false },
    ],
    explanation: 'A plain file stream such as readStream.format("json") needs its schema given up front and has no schema inference, evolution or rescued data; it finds files only by listing the folder. Both kinds record the files they have processed in the checkpoint, so neither reads a file twice, but Auto Loader keeps that record in a store that scales to millions of files and can use file notifications. It reads files only, not Kafka.',
    tags: ['autoloader', 'advantages'],
    concepts: ['stream-autoloader'],
  },

  {
    id: 'autoloader-7',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.AUTO_LOADER,
    language: CodeLanguage.PYTHON,
    question: 'Write an Auto Loader stream into "stream_df" that reads the JSON files in "/Volumes/main/default/landing/json/", including the files already in the folder when the stream first starts, with its schema kept in "/Volumes/main/default/checkpoints/json/schema". Select every data column plus "_metadata.file_path" and "_metadata.file_modification_time".',
    starterCode: `stream_df = spark.readStream`,
    requires: [/format\(\s*["']cloudFiles["']\s*\)/, '_metadata.file_path', '_metadata.file_modification_time', /^(?![\s\S]*includeExistingFiles["']\s*,\s*["']?false)/i],
    testCases: [
      {
        input: 'Auto Loader stream',
        expectedOutput: 'select("*", "_metadata.file_path", "_metadata.file_modification_time")',
        description: 'Should include metadata columns',
      },
    ],
    solution: `stream_df = spark.readStream.format("cloudFiles").option("cloudFiles.format", "json").option("cloudFiles.includeExistingFiles", "true").option("cloudFiles.schemaLocation", "/Volumes/main/default/checkpoints/json/schema").load("/Volumes/main/default/landing/json/").select("*", "_metadata.file_path", "_metadata.file_modification_time")
# OR
stream_df = spark.readStream.format("cloudFiles").option("cloudFiles.format", "json").option("cloudFiles.includeExistingFiles", True).option("cloudFiles.schemaLocation", "/Volumes/main/default/checkpoints/json/schema").load("/Volumes/main/default/landing/json/").select("*", "_metadata.file_path", "_metadata.file_modification_time")
# OR
stream_df = spark.readStream.format("cloudFiles").option("cloudFiles.format", "json").option("cloudFiles.schemaLocation", "/Volumes/main/default/checkpoints/json/schema").load("/Volumes/main/default/landing/json/").select("*", "_metadata.file_path", "_metadata.file_modification_time")`,
    explanation: `_metadata is a hidden column of every file source: select its fields by name, such as "_metadata.file_path", next to "*" to keep the data columns and record where each row came from. cloudFiles.includeExistingFiles is true by default and only counts on the stream's first start, so setting it to "true" is optional; set it to "false" to load only files that arrive later.`,
    hints: ['Existing files are included by default; the option cloudFiles.includeExistingFiles says so explicitly', 'Use select("*", "_metadata.file_path", "_metadata.file_modification_time")'],
    tieredHints: {
      apiSignature: 'DataFrame.select(*cols) -> DataFrame',
      skeleton: 'stream_df = spark.____.____("cloudFiles").____("cloudFiles.format", "json").____("cloudFiles.schemaLocation", "/Volumes/main/default/checkpoints/json/schema").____("/Volumes/main/default/landing/json/").____("*", ____, ____)',
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
    requires: [/CREATE\s+OR\s+REPLACE\s+TABLE/i, /IS\s+NOT\s+NULL/i, /PARTITION\s+BY\s+order_id/i, /ORDER\s+BY\s+ingestion_time\s+DESC/i],
    testCases: [
      {
        input: 'bronze_orders table',
        expectedOutput: 'CREATE OR REPLACE TABLE silver_orders with WHERE and QUALIFY/ROW_NUMBER',
        description: 'Should clean and deduplicate data',
      },
    ],
    solution: `CREATE OR REPLACE TABLE silver_orders AS
SELECT * FROM bronze_orders
WHERE order_id IS NOT NULL
QUALIFY ROW_NUMBER() OVER (PARTITION BY order_id ORDER BY ingestion_time DESC) = 1
-- OR
CREATE OR REPLACE TABLE silver_orders AS
SELECT * EXCEPT (rn) FROM (
  SELECT *, ROW_NUMBER() OVER (PARTITION BY order_id ORDER BY ingestion_time DESC) AS rn
  FROM bronze_orders
  WHERE order_id IS NOT NULL
)
WHERE rn = 1
-- OR
CREATE OR REPLACE TABLE silver_orders AS
SELECT order_id, customer_id, amount, order_status, ingestion_time FROM (
  SELECT *, ROW_NUMBER() OVER (PARTITION BY order_id ORDER BY ingestion_time DESC) AS rn
  FROM bronze_orders
  WHERE order_id IS NOT NULL
)
WHERE rn = 1`,
    explanation: `Silver cleans Bronze: WHERE drops the rows with no key, and ROW_NUMBER() numbered newest first within each order_id keeps only the latest record. QUALIFY filters on the window function directly; with a subquery instead, select the table's own columns (or SELECT * EXCEPT (rn)) so the helper rn column does not end up in the Silver table.`,
    hints: ['Filter out NULL order_ids with WHERE', 'Number the rows with ROW_NUMBER() OVER (PARTITION BY order_id ORDER BY ingestion_time DESC)', 'Keep row 1 with QUALIFY, or with WHERE rn = 1 around a subquery'],
    tieredHints: {
      apiSignature: 'ROW_NUMBER() OVER (PARTITION BY col1 ORDER BY col2 DESC)',
      skeleton: `____ ____ ____ TABLE ____ AS
SELECT * FROM ____
WHERE ____ IS ____ ____
____ ____() OVER (____ BY ____ ____ BY ____ ____) = 1`,
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
    requires: [/CREATE\s+OR\s+REPLACE\s+TABLE/i, /FROM\s+silver_orders/i, /GROUP\s+BY\s+order_date/i, /SUM\(\s*amount\s*\)/i],
    testCases: [
      {
        input: 'silver_orders with order_date and amount columns',
        expectedOutput: 'GROUP BY order_date with SUM and COUNT',
        description: 'Should aggregate revenue by date',
      },
    ],
    solution: `CREATE OR REPLACE TABLE gold_daily_revenue AS
SELECT order_date, SUM(amount) AS total_revenue, COUNT(*) AS order_count
FROM silver_orders
GROUP BY order_date
-- OR
CREATE OR REPLACE TABLE gold_daily_revenue AS
SELECT order_date, SUM(amount) AS total_revenue, COUNT(order_id) AS order_count
FROM silver_orders
GROUP BY order_date`,
    explanation: `A Gold table holds a business-level summary built from Silver: one row per order_date with its revenue and order count, ready for a BI dashboard. CREATE OR REPLACE rebuilds it from the current Silver data each run; CREATE TABLE IF NOT EXISTS would keep the first day's numbers forever. COUNT(order_id) matches COUNT(*) here because Silver has no null order_id.`,
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
      { id: 'a', text: 'Each layer has its own quality level, so access can be granted per layer, such as analysts on Gold only', isCorrect: true },
      { id: 'b', text: 'Each layer encrypts its data with its own key, so a reader of Gold cannot decrypt Bronze', isCorrect: false },
      { id: 'c', text: 'Once data reaches Gold it is clean, so Bronze and Silver can be deleted to remove sensitive data', isCorrect: false },
      { id: 'd', text: 'Every user reads Bronze, so all reports share one source and permissions are not needed', isCorrect: false },
    ],
    explanation: 'The layers are usually separate Unity Catalog schemas, such as main.bronze, main.silver and main.gold, so access can follow quality: analysts read Gold, while engineers work in Bronze and Silver. Bronze is kept, since Silver and Gold are rebuilt from it when a rule changes, and Delta keeps the history of each table. Encryption is a storage setting, not a Medallion layer.',
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
      { id: 'a', text: 'Gold, to build the business metrics straight from the files', isCorrect: false },
      { id: 'b', text: 'Silver, to validate the files as they are loaded', isCorrect: false },
      { id: 'c', text: 'Bronze, to load the raw files from cloud storage', isCorrect: true },
      { id: 'd', text: 'All three, since Auto Loader reads Delta tables between layers', isCorrect: false },
    ],
    explanation: 'Auto Loader loads files, so it usually feeds Bronze with the raw records from cloud storage or a volume. Silver and Gold read the Delta tables of the layer before them, with spark.readStream.table() or a batch query, not with Auto Loader.',
    tags: ['medallion', 'autoloader', 'bronze'],
    concepts: ['medallion-architecture', 'stream-autoloader'],
  },

  {
    id: 'medallion-9',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.MEDALLION_ARCHITECTURE,
    language: CodeLanguage.PYTHON,
    question: 'Write a Bronze ingest with Auto Loader: read the JSON files arriving in "/Volumes/main/default/landing/events", keep the inferred schema in "/Volumes/main/default/checkpoints/bronze_events/schema", add an "ingestion_time" column holding current_timestamp(), and append the rows to the Delta table "bronze_events" with its checkpoint in "/Volumes/main/default/checkpoints/bronze_events".',
    starterCode: `from pyspark.sql.functions import current_timestamp\n`,
    requires: [/format\(\s*["']cloudFiles["']\s*\)/, /ingestion_time["']\s*,\s*current_timestamp\(\)/, /checkpointLocation/],
    testCases: [
      {
        input: 'JSON files',
        expectedOutput: 'cloudFiles with withColumn current_timestamp',
        description: 'Should create Bronze pipeline with metadata',
      },
    ],
    solution: `from pyspark.sql.functions import current_timestamp

spark.readStream.format("cloudFiles").option("cloudFiles.format", "json").option("cloudFiles.schemaLocation", "/Volumes/main/default/checkpoints/bronze_events/schema").load("/Volumes/main/default/landing/events").withColumn("ingestion_time", current_timestamp()).writeStream.format("delta").option("checkpointLocation", "/Volumes/main/default/checkpoints/bronze_events").outputMode("append").toTable("bronze_events")
# OR
from pyspark.sql.functions import current_timestamp

stream_df = spark.readStream.format("cloudFiles").option("cloudFiles.format", "json").option("cloudFiles.schemaLocation", "/Volumes/main/default/checkpoints/bronze_events/schema").load("/Volumes/main/default/landing/events").withColumn("ingestion_time", current_timestamp())
stream_df.writeStream.format("delta").option("checkpointLocation", "/Volumes/main/default/checkpoints/bronze_events").outputMode("append").toTable("bronze_events")
# OR
from pyspark.sql.functions import current_timestamp

spark.readStream.format("cloudFiles").option("cloudFiles.format", "json").option("cloudFiles.schemaLocation", "/Volumes/main/default/checkpoints/bronze_events/schema").load("/Volumes/main/default/landing/events").withColumn("ingestion_time", current_timestamp()).writeStream.option("checkpointLocation", "/Volumes/main/default/checkpoints/bronze_events").toTable("bronze_events")`,
    explanation: 'This is the usual Bronze pattern: Auto Loader (format("cloudFiles")) reads only new files, withColumn("ingestion_time", current_timestamp()) records when each row was loaded, and writeStream.toTable appends to a Delta table (append is the default output mode). The schema location keeps the inferred schema; the checkpoint records which files are done.',
    hints: ['withColumn("ingestion_time", current_timestamp()) adds the timestamp', 'writeStream uses .toTable("bronze_events")', 'schemaLocation is for schema inference, checkpointLocation is for stream progress'],
    tieredHints: {
      apiSignature: 'DataFrame.withColumn(colName, col) -> DataFrame',
      skeleton: `from pyspark.sql.functions import current_timestamp

spark.____.____("cloudFiles").____("cloudFiles.format", "json").____("cloudFiles.schemaLocation", "/Volumes/main/default/checkpoints/bronze_events/schema").____("/Volumes/main/default/landing/events").____("ingestion_time", ____()).____.____("checkpointLocation", "/Volumes/main/default/checkpoints/bronze_events").____("bronze_events")`,
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
    question: 'Write a streaming Silver step: read the Delta table "bronze_events" (columns: event_id, event_type, amount, user_id, ingestion_time) as a stream, drop the rows where event_type is null, cast amount to double, and append the result to the Delta table "silver_events" with its checkpoint in "/Volumes/main/default/checkpoints/silver_events".',
    starterCode: `from pyspark.sql.functions import col\n`,
    requires: [/readStream/, /isNotNull\(\)|IS\s+NOT\s+NULL/i, /cast\(/, /checkpointLocation/],
    testCases: [
      {
        input: 'bronze_events Delta table',
        expectedOutput: 'readStream from delta, filter, cast, writeStream',
        description: 'Should create Silver streaming pipeline',
      },
    ],
    solution: `from pyspark.sql.functions import col

spark.readStream.table("bronze_events").filter(col("event_type").isNotNull()).withColumn("amount", col("amount").cast("double")).writeStream.format("delta").option("checkpointLocation", "/Volumes/main/default/checkpoints/silver_events").outputMode("append").toTable("silver_events")
# OR
from pyspark.sql.functions import col

silver_df = spark.readStream.table("bronze_events").filter(col("event_type").isNotNull()).withColumn("amount", col("amount").cast("double"))
silver_df.writeStream.format("delta").option("checkpointLocation", "/Volumes/main/default/checkpoints/silver_events").outputMode("append").toTable("silver_events")
# OR
from pyspark.sql.functions import col

spark.readStream.table("bronze_events").filter(col("event_type").isNotNull()).withColumn("amount", col("amount").cast("double")).writeStream.option("checkpointLocation", "/Volumes/main/default/checkpoints/silver_events").toTable("silver_events")
# OR
from pyspark.sql.functions import col

spark.readStream.table("bronze_events").where("event_type IS NOT NULL").withColumn("amount", col("amount").cast("double")).writeStream.option("checkpointLocation", "/Volumes/main/default/checkpoints/silver_events").toTable("silver_events")`,
    explanation: 'A streaming Silver step reads the Bronze Delta table with spark.readStream.table(), so each run handles only the rows added since the last one. The filter drops rows with no event_type, and cast("double") fixes the type before the rows reach Silver; append is the default output mode.',
    hints: ['Use readStream.table("bronze_events")', 'filter(col("event_type").isNotNull())', 'withColumn("amount", col("amount").cast("double"))'],
    tieredHints: {
      apiSignature: 'Column.cast(dataType) -> Column',
      skeleton: `from pyspark.sql.functions import col

spark.____.____("bronze_events").____(col("event_type").____()).____("amount", col("amount").____("double")).____.____("checkpointLocation", "/Volumes/main/default/checkpoints/silver_events").____("silver_events")`,
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
      { id: 'a', text: 'A full reload that copies the whole source table to the target on every run', isCorrect: false },
      { id: 'b', text: 'A time travel query that returns a table as it was at an earlier version', isCorrect: false },
      { id: 'c', text: 'A pattern that passes on only the rows inserted, updated or deleted in a source', isCorrect: true },
      { id: 'd', text: 'A log of the SQL statements run against a table, as DESCRIBE HISTORY shows', isCorrect: false },
    ],
    explanation: 'Change Data Capture passes on only the rows that changed in a source (inserts, updates and deletes), so a target stays in step without a full reload. Time travel returns a whole earlier version of a table, and DESCRIBE HISTORY lists one row per commit with its operation, not the changed rows.',
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
      { id: 'a', text: 'A Delta feature that records the row-level inserts, updates and deletes of each commit, for batch or stream reads', isCorrect: true },
      { id: 'b', text: 'The table history that DESCRIBE HISTORY shows, one row per commit with its operation and user', isCorrect: false },
      { id: 'c', text: 'A full copy of the table kept at every version, so time travel can read any of them', isCorrect: false },
      { id: 'd', text: 'A stream that re-reads the whole table each time a commit changes it', isCorrect: false },
    ],
    explanation: 'With delta.enableChangeDataFeed = true, Delta records the changed rows of each commit, with _change_type (insert, update_preimage, update_postimage, delete), _commit_version and _commit_timestamp. table_changes() reads them in batch and readChangeFeed reads them as a stream. DESCRIBE HISTORY shows commits, not rows, and time travel reads the data files of an old version, not copies.',
    tags: ['cdc', 'delta', 'change-data-feed'],
    concepts: ['delta-cdf', 'delta-acid'],
  },

  {
    id: 'cdc-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.CHANGE_DATA_CAPTURE,
    language: CodeLanguage.SQL,
    requires: [/ALTER\s+TABLE\s+customers/i, /enableChangeDataFeed["']?\s*=\s*["']?true/i],
    question: 'Enable Change Data Feed on an existing Delta table named "customers".',
    starterCode: `-- Enable CDF on customers table\n`,
    testCases: [
      {
        input: 'customers Delta table',
        expectedOutput: 'ALTER TABLE customers SET TBLPROPERTIES (delta.enableChangeDataFeed = true)',
        description: 'Should enable CDF',
      },
    ],
    solution: `ALTER TABLE customers SET TBLPROPERTIES (delta.enableChangeDataFeed = true)\n-- OR\nALTER TABLE customers SET TBLPROPERTIES ('delta.enableChangeDataFeed' = 'true')
-- OR
ALTER TABLE customers SET TBLPROPERTIES (delta.enableChangeDataFeed = 'true')`,
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
    requires: [/table_changes\(\s*["']customers["']\s*,\s*5\s*\)/i],
    testCases: [
      {
        input: 'customers table with CDF enabled',
        expectedOutput: "SELECT * FROM table_changes('customers', 5)",
        description: 'Should read changes from version 5',
      },
    ],
    solution: `SELECT * FROM table_changes('customers', 5)
-- OR
SELECT * FROM table_changes("customers", 5)`,
    explanation: `table_changes('customers', 5) returns the changed rows from version 5 to the latest (a third argument sets an end version). Each row has the table's columns plus _change_type (insert, update_preimage, update_postimage, delete), _commit_version and _commit_timestamp.`,
    hints: [`Use table_changes('customers', 5)`, 'The second argument is the first version to read'],
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
    requires: [/readStream/, /readChangeFeed["']\s*,\s*(?:["']true["']|True)/, /startingVersion["']\s*,\s*["']?10/],
    testCases: [
      {
        input: 'orders table with CDF',
        expectedOutput: 'readStream with readChangeFeed and startingVersion',
        description: 'Should stream CDF',
      },
    ],
    solution: `changes_df = spark.readStream.format("delta").option("readChangeFeed", "true").option("startingVersion", 10).table("orders")
# OR
changes_df = spark.readStream.option("readChangeFeed", "true").option("startingVersion", 10).table("orders")
# OR
changes_df = spark.readStream.format("delta").option("readChangeFeed", True).option("startingVersion", "10").table("orders")
# OR
changes_df = spark.readStream.option("readChangeFeed", True).option("startingVersion", "10").table("orders")`,
    explanation: `option("readChangeFeed", "true") makes a Delta stream read the change rows, with _change_type, _commit_version and _commit_timestamp, instead of the table's rows, and startingVersion sets the first version to read. Delta is the default format, so format("delta") can be left out.`,
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
      { id: 'a', text: 'insert, update, delete', isCorrect: false },
      { id: 'b', text: 'insert, update_preimage, update_postimage, delete', isCorrect: true },
      { id: 'c', text: 'WRITE, UPDATE, DELETE, MERGE', isCorrect: false },
      { id: 'd', text: 'insert, update_before, update_after, delete', isCorrect: false },
    ],
    explanation: 'The Change Data Feed writes "insert" for a new row, "delete" for a removed row, and two rows for each updated row: "update_preimage" with the old values and "update_postimage" with the new ones. WRITE, UPDATE, DELETE and MERGE are operation names in DESCRIBE HISTORY, not change types.',
    tags: ['cdc', 'change-types'],
    concepts: ['delta-cdf'],
  },

  {
    id: 'cdc-7',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.CHANGE_DATA_CAPTURE,
    language: CodeLanguage.SQL,
    requires: [/MERGE\s+INTO/i, /update_preimage/i, /["']delete["']\s*THEN\s+DELETE/i, /["']update_postimage["']\s*THEN\s+UPDATE/i, /["']insert["']\s*THEN\s+INSERT/i],
    question: `The table "customers_changes" holds Change Data Feed rows for "customers": the customer columns plus _change_type. Write a MERGE that applies them to "customers", matching on customer_id: leave out the update_preimage rows, delete the matched rows whose _change_type is 'delete', update the matched rows whose _change_type is 'update_postimage', and insert the unmatched rows whose _change_type is 'insert'.`,
    starterCode: `-- MERGE CDC changes into target table customers\n`,
    testCases: [
      {
        input: 'customers_changes with _change_type',
        expectedOutput: 'MERGE INTO with WHEN MATCHED DELETE, UPDATE, INSERT',
        description: 'Should apply all CDC change types',
      },
    ],
    solution: `MERGE INTO customers t\nUSING (\n  SELECT * FROM customers_changes\n  WHERE _change_type != 'update_preimage'\n) s\nON t.customer_id = s.customer_id\nWHEN MATCHED AND s._change_type = 'delete' THEN DELETE\nWHEN MATCHED AND s._change_type = 'update_postimage' THEN UPDATE SET *\nWHEN NOT MATCHED AND s._change_type = 'insert' THEN INSERT *\n-- OR\nMERGE INTO customers AS t\nUSING (SELECT * FROM customers_changes WHERE _change_type <> 'update_preimage') AS s\nON t.customer_id = s.customer_id\nWHEN MATCHED AND s._change_type = 'delete' THEN DELETE\nWHEN MATCHED AND s._change_type = 'update_postimage' THEN UPDATE SET *\nWHEN NOT MATCHED AND s._change_type = 'insert' THEN INSERT *`,
    explanation: `Dropping update_preimage in the source keeps the old values out; then each WHEN clause tests _change_type to choose DELETE, UPDATE SET * or INSERT *. The * forms copy the target's columns by name, so the extra _change_type and _commit columns are ignored. This assumes one change per customer_id; a feed covering several commits should first keep each key's latest change by _commit_version.`,
    hints: ['Filter out update_preimage in a source subquery', `WHEN MATCHED AND s._change_type = 'delete' THEN DELETE`, `WHEN MATCHED AND s._change_type = 'update_postimage' THEN UPDATE SET *`],
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
    requires: [/enableChangeDataFeed["']?\s*=\s*["']?true/i],
    testCases: [
      {
        input: 'New table',
        expectedOutput: 'CREATE TABLE with TBLPROPERTIES delta.enableChangeDataFeed',
        description: 'Should create table with CDF',
      },
    ],
    solution: `CREATE TABLE customers (
  customer_id INT,
  customer_name STRING,
  email STRING
)
USING DELTA
TBLPROPERTIES (delta.enableChangeDataFeed = true)
-- OR
CREATE TABLE customers (customer_id INT, customer_name STRING, email STRING) USING DELTA TBLPROPERTIES (delta.enableChangeDataFeed = true)
-- OR
CREATE TABLE customers (customer_id INT, customer_name STRING, email STRING)
TBLPROPERTIES (delta.enableChangeDataFeed = true)
-- OR
CREATE TABLE customers (customer_id INT, customer_name STRING, email STRING)
TBLPROPERTIES ('delta.enableChangeDataFeed' = 'true')`,
    explanation: `Setting delta.enableChangeDataFeed = true in TBLPROPERTIES at CREATE TABLE records changes from the table's first commit, so every INSERT, UPDATE and DELETE is in the feed. USING DELTA is optional, since Delta is the default table format.`,
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
    question: 'What is Delta Live Tables (DLT), now called Lakeflow Declarative Pipelines?',
    options: [
      { id: 'a', text: 'A job scheduler that runs your notebooks in the order you list them, on a cron schedule', isCorrect: false },
      { id: 'b', text: 'A declarative framework: you write one query per table, and it orders, builds and updates them', isCorrect: true },
      { id: 'c', text: 'A Delta Lake table feature that copies each change of a source table into a live replica', isCorrect: false },
      { id: 'd', text: 'A streaming-only engine that reads from Kafka and cannot build batch tables or aggregates', isCorrect: false },
    ],
    explanation: 'Delta Live Tables, renamed Lakeflow Declarative Pipelines, is declarative: you declare each dataset as a query (a streaming table, a materialized view or a temporary view), and the pipeline reads the references between them to build its graph, creates and updates the tables, retries failures and records data quality. Scheduling notebooks in an order you set is the job of a Workflow (Lakeflow Job), which can run a pipeline as one of its tasks. A pipeline handles batch sources and aggregates through materialized views as well as streams.',
    tags: ['dlt', 'fundamentals'],
    concepts: ['dlt-pipeline-basics', 'dbx-architecture'],
  },

  {
    id: 'dlt-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DELTA_LIVE_TABLES,
    question: 'In a Delta Live Tables pipeline, how does a table (a streaming table or a materialized view) differ from a temporary view?',
    options: [
      { id: 'a', text: 'A table can carry expectations, while a temporary view cannot, so quality checks must sit on a table', isCorrect: false },
      { id: 'b', text: 'A table can be read by later datasets, while a temporary view cannot be referenced by another dataset', isCorrect: false },
      { id: 'c', text: 'A table is written to storage and published, while a temporary view is computed but not stored or published', isCorrect: true },
      { id: 'd', text: 'A table is recomputed in full on every update, while a temporary view keeps its earlier rows and adds new ones', isCorrect: false },
    ],
    explanation: 'Streaming tables and materialized views are written as Delta tables and published to the target schema, so people and jobs outside the pipeline can query them. A temporary view (`CREATE TEMPORARY VIEW` or `@dp.temporary_view`; `LIVE VIEW` and `@dlt.view` in older code) is computed for the datasets that read it and is never stored or published, which suits an intermediate step. Temporary views can still carry expectations, and other datasets in the pipeline read them like any table.',
    tags: ['dlt', 'table', 'view'],
    concepts: ['dlt-pipeline-basics', 'sql-temp-views'],
  },

  {
    id: 'dlt-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DELTA_LIVE_TABLES,
    language: CodeLanguage.SQL,
    question: 'In a Delta Live Tables pipeline (Lakeflow Declarative Pipelines), declare a streaming table "bronze_events" that uses Auto Loader to ingest the JSON files landing in the volume folder "/Volumes/main/default/landing/events/".',
    starterCode: `-- Declare the bronze_events streaming table
`,
    requires: [/STREAMING\s+(LIVE\s+)?TABLE\s+bronze_events/i, /cloud_files\s*\(|STREAM\s*\(?\s*read_files\s*\(/i, /\/Volumes\/main\/default\/landing\/events/i, /json/i],
    testCases: [
      {
        input: 'JSON files',
        expectedOutput: 'CREATE OR REFRESH STREAMING TABLE bronze_events AS SELECT * FROM STREAM read_files(...)',
        description: 'Should create a streaming table that ingests the JSON files',
      },
    ],
    solution: `CREATE OR REFRESH STREAMING TABLE bronze_events
AS SELECT * FROM STREAM read_files('/Volumes/main/default/landing/events/', format => 'json')
-- OR
CREATE OR REFRESH STREAMING TABLE bronze_events
AS SELECT * FROM STREAM(read_files('/Volumes/main/default/landing/events/', format => 'json'))
-- OR
CREATE OR REFRESH STREAMING LIVE TABLE bronze_events
AS SELECT * FROM cloud_files("/Volumes/main/default/landing/events/", "json")
-- OR
CREATE OR REFRESH STREAMING LIVE TABLE bronze_events
AS SELECT * FROM cloud_files('/Volumes/main/default/landing/events/', 'json')
-- OR
CREATE OR REFRESH STREAMING TABLE bronze_events
AS SELECT * FROM cloud_files('/Volumes/main/default/landing/events/', 'json')
-- OR
CREATE STREAMING TABLE bronze_events
AS SELECT * FROM STREAM read_files('/Volumes/main/default/landing/events/', format => 'json')
-- OR
CREATE STREAMING TABLE bronze_events
AS SELECT * FROM cloud_files("/Volumes/main/default/landing/events/", "json")`,
    explanation: `A streaming table reads only the files that arrived since the last update. \`STREAM read_files(path, format => 'json')\` is Auto Loader in SQL; the older \`cloud_files(path, 'json')\` does the same and still runs. Without STREAM, read_files is a batch read, which a streaming table's query does not accept. \`CREATE OR REFRESH\` creates the table on the first update and updates it on later ones, and \`STREAMING LIVE TABLE\` is the older spelling of \`STREAMING TABLE\`. The files sit in a Unity Catalog volume rather than a /mnt mount.`,
    hints: ['Start with CREATE OR REFRESH STREAMING TABLE (older code: STREAMING LIVE TABLE)', `Read the folder with Auto Loader: STREAM read_files(path, format => 'json'), or the older cloud_files(path, 'json')`],
    tieredHints: {
      apiSignature: "STREAM read_files(path, format => 'json')  |  older: cloud_files(path, 'json')",
      skeleton: `CREATE OR REFRESH ____ ____ bronze_events
AS SELECT * FROM ____ ____('/Volumes/main/default/landing/events/', format => ____)`,
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
    question: 'In a Delta Live Tables pipeline written in Python, define a streaming table "bronze_events" that uses Auto Loader to ingest the JSON files landing in the volume folder "/Volumes/main/default/landing/events/". You may use `import dlt` or `from pyspark import pipelines as dp`.',
    starterCode: `# Import the pipelines module, then define bronze_events
`,
    requires: [/@(dlt|dp)\.table/, /bronze_events/, /readStream/, /["']cloudFiles["']/, /["']cloudFiles\.format["']\s*,\s*["']json["']/, /\/Volumes\/main\/default\/landing\/events/i],
    testCases: [
      {
        input: 'JSON files',
        expectedOutput: '@dlt.table over spark.readStream.format("cloudFiles")',
        description: 'Should define a streaming table that reads the files with Auto Loader',
      },
    ],
    solution: `import dlt

@dlt.table
def bronze_events():
    return (
        spark.readStream
        .format("cloudFiles")
        .option("cloudFiles.format", "json")
        .load("/Volumes/main/default/landing/events/")
    )
# OR
import dlt

@dlt.table
def bronze_events():
    return spark.readStream.format("cloudFiles").option("cloudFiles.format", "json").load("/Volumes/main/default/landing/events/")
# OR
from pyspark import pipelines as dp

@dp.table
def bronze_events():
    return (
        spark.readStream
        .format("cloudFiles")
        .option("cloudFiles.format", "json")
        .load("/Volumes/main/default/landing/events/")
    )
# OR
from pyspark import pipelines as dp

@dp.table
def bronze_events():
    return spark.readStream.format("cloudFiles").option("cloudFiles.format", "json").load("/Volumes/main/default/landing/events/")`,
    explanation: '`@dlt.table` (or `@dp.table` after `from pyspark import pipelines as dp`) turns the function into a pipeline dataset named after the function, here bronze_events. The function returns a streaming DataFrame, `spark.readStream.format("cloudFiles")`, so the dataset is a streaming table that reads only new files on each update; a batch read would make it a materialized view instead. The `cloudFiles.format` option tells Auto Loader the files are JSON.',
    hints: ['Decorate a function with @dlt.table (or @dp.table); the function name becomes the table name', 'Return an Auto Loader stream: spark.readStream.format("cloudFiles") with the cloudFiles.format option', 'Load the volume folder with .load(path)'],
    tieredHints: {
      apiSignature: '@dlt.table / @dp.table over spark.readStream.format("cloudFiles").option("cloudFiles.format", fmt).load(path)',
      skeleton: `import dlt

@dlt.____
def ____():
    return (
        spark.____
        .format(____)
        .option("cloudFiles.format", ____)
        .load("/Volumes/main/default/landing/events/")
    )`,
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
    question: `In a Delta Live Tables pipeline, declare a streaming table "silver_orders" that reads the pipeline's "bronze_orders" table incrementally and keeps only the rows whose "order_id" is not null.`,
    starterCode: `-- Declare the silver_orders streaming table
`,
    requires: [/STREAMING\s+(LIVE\s+)?TABLE\s+silver_orders/i, /STREAM\s*\(?\s*(LIVE\.)?bronze_orders/i, /order_id\s+IS\s+NOT\s+NULL/i],
    testCases: [
      {
        input: 'bronze_orders table in the pipeline',
        expectedOutput: 'CREATE OR REFRESH STREAMING TABLE silver_orders AS SELECT * FROM STREAM(bronze_orders) WHERE order_id IS NOT NULL',
        description: 'Should create the Silver streaming table',
      },
    ],
    solution: `CREATE OR REFRESH STREAMING TABLE silver_orders
AS SELECT *
FROM STREAM(bronze_orders)
WHERE order_id IS NOT NULL
-- OR
CREATE OR REFRESH STREAMING TABLE silver_orders AS SELECT * FROM STREAM bronze_orders WHERE order_id IS NOT NULL
-- OR
CREATE OR REFRESH STREAMING LIVE TABLE silver_orders
AS SELECT *
FROM STREAM(LIVE.bronze_orders)
WHERE order_id IS NOT NULL
-- OR
CREATE STREAMING LIVE TABLE silver_orders AS SELECT * FROM STREAM(LIVE.bronze_orders) WHERE order_id IS NOT NULL`,
    explanation: `STREAM(bronze_orders) reads the upstream table as a stream, so each update reads only the rows Bronze gained since the last one; without STREAM it is a batch read, which a streaming table's query does not accept. Naming bronze_orders makes silver_orders depend on it, so the pipeline updates Bronze first. Older code writes the reference as LIVE.bronze_orders and the table as STREAMING LIVE TABLE: the LIVE prefix is deprecated and ignored under the default publishing mode, so both forms run.`,
    hints: ['CREATE OR REFRESH STREAMING TABLE (older code: STREAMING LIVE TABLE)', 'Read the upstream table as a stream: STREAM(bronze_orders), or STREAM(LIVE.bronze_orders) in older code', 'Filter with WHERE order_id IS NOT NULL'],
    tieredHints: {
      apiSignature: 'STREAM(table_name)',
      skeleton: `CREATE OR REFRESH ____ ____ silver_orders
AS SELECT *
FROM ____(bronze_orders)
WHERE order_id ____ ____ ____`,
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
    question: `In a Delta Live Tables pipeline, declare a streaming table "clean_orders" that reads the pipeline's "bronze_orders" table incrementally, with an expectation named "valid_amount" requiring "amount" to be greater than 0. Rows that fail it must be dropped, not written.`,
    starterCode: `-- Declare clean_orders with its expectation
`,
    requires: [/STREAMING\s+(LIVE\s+)?TABLE\s+clean_orders/i, /CONSTRAINT\s+valid_amount\s+EXPECT\s*\(\s*amount\s*>\s*0\s*\)\s*ON\s+VIOLATION\s+DROP\s+ROW/i, /STREAM\s*\(?\s*(LIVE\.)?bronze_orders/i],
    testCases: [
      {
        input: 'orders data',
        expectedOutput: 'CONSTRAINT with EXPECT or ON VIOLATION DROP ROW',
        description: 'Should add quality constraint',
      },
    ],
    solution: `CREATE OR REFRESH STREAMING TABLE clean_orders (
  CONSTRAINT valid_amount EXPECT (amount > 0) ON VIOLATION DROP ROW
)
AS SELECT *
FROM STREAM(bronze_orders)
-- OR
CREATE OR REFRESH STREAMING TABLE clean_orders (CONSTRAINT valid_amount EXPECT (amount > 0) ON VIOLATION DROP ROW) AS SELECT * FROM STREAM bronze_orders
-- OR
CREATE OR REFRESH STREAMING LIVE TABLE clean_orders (
  CONSTRAINT valid_amount EXPECT (amount > 0) ON VIOLATION DROP ROW
)
AS SELECT *
FROM STREAM(LIVE.bronze_orders)
-- OR
CREATE STREAMING LIVE TABLE clean_orders (CONSTRAINT valid_amount EXPECT (amount > 0) ON VIOLATION DROP ROW) AS SELECT * FROM STREAM(LIVE.bronze_orders)`,
    explanation: 'An expectation is declared inside the table definition as `CONSTRAINT name EXPECT (condition)`. `ON VIOLATION DROP ROW` keeps the failing rows out of the table and counts them in the data quality metrics, `ON VIOLATION FAIL UPDATE` stops the update, and with no ON VIOLATION clause the rows are written and only counted. Note `amount > 0`: an amount of 0 fails it. STREAM(bronze_orders) makes the table read Bronze incrementally (STREAM(LIVE.bronze_orders) in older code).',
    hints: ['Put CONSTRAINT name EXPECT (condition) in brackets after the table name', 'ON VIOLATION DROP ROW keeps failing rows out', 'Read Bronze with STREAM(bronze_orders)'],
    tieredHints: {
      apiSignature: 'CONSTRAINT name EXPECT (condition) [ON VIOLATION { DROP ROW | FAIL UPDATE }]',
      skeleton: `CREATE OR REFRESH ____ ____ clean_orders (
  ____ valid_amount ____ (amount > 0) ON VIOLATION ____ ____
)
AS SELECT *
FROM ____(bronze_orders)`,
    },
    tags: ['dlt', 'expectations', 'data-quality'],
    concepts: ['dlt-pipeline-basics', 'dlt-expectations'],
  },

  {
    id: 'dlt-7',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DELTA_LIVE_TABLES,
    question: 'Which list gives the three things a Delta Live Tables expectation can do with a row that fails it?',
    options: [
      { id: 'a', text: 'Keep the row and count the failure (warn), drop the row, or fail the whole update', isCorrect: true },
      { id: 'b', text: 'Keep the row and count the failure, drop the row, or move it to a quarantine table it creates', isCorrect: false },
      { id: 'c', text: 'Drop the row, fail the whole update, or set the failing column to NULL and keep the row', isCorrect: false },
      { id: 'd', text: 'Keep the row and count the failure, drop the row, or pause the pipeline until someone approves it', isCorrect: false },
    ],
    explanation: 'With no ON VIOLATION clause (`@dp.expect`, `@dlt.expect`) a failing row is written and only counted in the data quality metrics; `ON VIOLATION DROP ROW` (`expect_or_drop`) keeps it out of the target, and `ON VIOLATION FAIL UPDATE` (`expect_or_fail`) stops the update. There is no built-in quarantine action: to keep bad rows you declare a second dataset with the opposite condition yourself. An expectation never rewrites a value, and nothing holds rows back for approval.',
    tags: ['dlt', 'expectations', 'violation-actions'],
    concepts: ['dlt-pipeline-basics', 'dlt-expectations'],
  },

  {
    id: 'dlt-8',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DELTA_LIVE_TABLES,
    language: CodeLanguage.PYTHON,
    question: `In a Delta Live Tables pipeline written in Python, define a streaming table "silver_users" that reads the pipeline's "bronze_users" table as a stream, with an expectation named "valid_email" that drops every row whose "email" is null. You may use \`import dlt\` or \`from pyspark import pipelines as dp\`.`,
    starterCode: `# Import the pipelines module, then define silver_users with its expectation
`,
    requires: [/@(dlt|dp)\.table/, /def\s+silver_users\s*\(/, /@(dlt|dp)\.expect_or_drop\(\s*["']valid_email["']\s*,\s*["']email\s+IS\s+NOT\s+NULL["']\s*\)/i, /read_stream\(\s*["']bronze_users["']|readStream\.table\(\s*["']bronze_users["']/],
    testCases: [
      {
        input: 'bronze_users table in the pipeline',
        expectedOutput: '@dlt.table with @dlt.expect_or_drop("valid_email", "email IS NOT NULL")',
        description: 'Should define a streaming table with a drop expectation',
      },
    ],
    solution: `import dlt

@dlt.table
@dlt.expect_or_drop("valid_email", "email IS NOT NULL")
def silver_users():
    return dlt.read_stream("bronze_users")
# OR
import dlt

@dlt.table
@dlt.expect_or_drop("valid_email", "email IS NOT NULL")
def silver_users():
    return spark.readStream.table("bronze_users")
# OR
from pyspark import pipelines as dp

@dp.table
@dp.expect_or_drop("valid_email", "email IS NOT NULL")
def silver_users():
    return spark.readStream.table("bronze_users")`,
    explanation: '`@dlt.expect_or_drop(name, condition)` (`@dp.expect_or_drop` in the newer module) keeps the rows that fail the SQL condition out of the table and counts them in the data quality metrics; `expect` would only warn and `expect_or_fail` would stop the update. The condition is a SQL expression string, so it reads "email IS NOT NULL". `dlt.read_stream("bronze_users")`, or `spark.readStream.table("bronze_users")` in current code, reads the upstream table as a stream, which makes silver_users a streaming table that the pipeline updates after bronze_users.',
    hints: ['Stack @dlt.table and an expectation decorator on the function', 'expect_or_drop takes the expectation name, then a SQL condition string', 'Read Bronze as a stream with dlt.read_stream("bronze_users") or spark.readStream.table("bronze_users")'],
    tieredHints: {
      apiSignature: '@dlt.expect_or_drop(name, sql_condition)',
      skeleton: `import dlt

@dlt.____
@dlt.____(____, ____)
def ____():
    return dlt.____(____)`,
    },
    tags: ['dlt', 'python', 'expectations', 'expect_or_drop'],
    concepts: ['dlt-pipeline-basics', 'dlt-expectations'],
  },

  {
    id: 'dlt-9',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DELTA_LIVE_TABLES,
    question: 'In a Delta Live Tables pipeline, what is the main difference between a streaming table and a materialized view?',
    options: [
      { id: 'a', text: 'A streaming table must run in a continuous pipeline, while a materialized view only runs in a triggered one', isCorrect: false },
      { id: 'b', text: 'A streaming table keeps every version of each row, while a materialized view keeps only the latest version of each key', isCorrect: false },
      { id: 'c', text: 'A streaming table suits joins and aggregates over a whole table, while a materialized view only suits append-only sources', isCorrect: false },
      { id: 'd', text: 'A streaming table reads only rows added to its source since the last update, while a materialized view keeps its whole result correct', isCorrect: true },
    ],
    explanation: 'A streaming table reads its source with STREAM, so each update processes only the rows added since the last one, which suits append-only sources such as files landing in a folder. A materialized view holds the full result of its query, and the pipeline keeps it correct on every update, recomputing it or, where it can, refreshing it incrementally; that suits joins and aggregations whose result changes as new rows arrive. Either kind can run in a triggered or a continuous pipeline. `STREAMING LIVE TABLE` and `LIVE TABLE` are the older names.',
    tags: ['dlt', 'streaming-table', 'materialized-view'],
    concepts: ['dlt-pipeline-basics'],
  },

  {
    id: 'dlt-10',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DELTA_LIVE_TABLES,
    language: CodeLanguage.SQL,
    question: `In a Delta Live Tables pipeline, declare a Gold materialized view "gold_daily_sales" over the pipeline's "silver_sales" table (columns: sale_id, sale_date, product_id, total_amount, customer_id). For each sale_date it holds "daily_revenue", the sum of total_amount, and "num_sales", the number of sales.`,
    starterCode: `-- Declare Gold materialized view gold_daily_sales\n`,
    requires: [/(MATERIALIZED\s+VIEW|LIVE\s+TABLE)\s+gold_daily_sales/i, /^(?![\s\S]*\bSTREAM(ING)?\b)/i, /SUM\s*\(\s*total_amount\s*\)\s+(AS\s+)?daily_revenue/i, /COUNT\s*\(\s*(\*|sale_id)\s*\)\s+(AS\s+)?num_sales/i, /GROUP\s+BY\s+sale_date/i],
    testCases: [
      {
        input: 'silver_sales live table',
        expectedOutput: 'CREATE OR REFRESH LIVE TABLE (not STREAMING)',
        description: 'Should create materialized view',
      },
    ],
    solution: `CREATE OR REFRESH MATERIALIZED VIEW gold_daily_sales
AS SELECT
  sale_date,
  SUM(total_amount) AS daily_revenue,
  COUNT(*) AS num_sales
FROM silver_sales
GROUP BY sale_date
-- OR
CREATE OR REFRESH MATERIALIZED VIEW gold_daily_sales AS SELECT sale_date, SUM(total_amount) AS daily_revenue, COUNT(sale_id) AS num_sales FROM silver_sales GROUP BY sale_date
-- OR
CREATE OR REFRESH LIVE TABLE gold_daily_sales
AS SELECT
  sale_date,
  SUM(total_amount) AS daily_revenue,
  COUNT(*) AS num_sales
FROM LIVE.silver_sales
GROUP BY sale_date
-- OR
CREATE LIVE TABLE gold_daily_sales AS SELECT sale_date, SUM(total_amount) AS daily_revenue, COUNT(*) AS num_sales FROM LIVE.silver_sales GROUP BY sale_date
-- OR
CREATE MATERIALIZED VIEW gold_daily_sales AS SELECT sale_date, SUM(total_amount) AS daily_revenue, COUNT(sale_id) AS num_sales FROM silver_sales GROUP BY sale_date`,
    explanation: `A materialized view holds the full result of its query, and the pipeline keeps it correct on each update, so a day's totals cover every sale for that day, including sales that arrived in earlier updates. That suits a GROUP BY aggregate, whose rows change as new sales arrive, while a streaming table only appends results for its new input rows. Naming silver_sales makes the view depend on it, so the pipeline updates Silver first. \`LIVE TABLE\` and \`LIVE.silver_sales\` are the older spellings of \`MATERIALIZED VIEW\` and \`silver_sales\`.`,
    hints: ['Declare it with CREATE OR REFRESH MATERIALIZED VIEW (older code: LIVE TABLE), not as a streaming table', 'Read the upstream table by name: FROM silver_sales (older code: LIVE.silver_sales)', 'GROUP BY sale_date with SUM(total_amount) and COUNT(*)'],
    tieredHints: {
      apiSignature: 'CREATE OR REFRESH MATERIALIZED VIEW name AS SELECT ... FROM source GROUP BY col',
      skeleton: `CREATE OR REFRESH ____ ____ gold_daily_sales
AS SELECT
  sale_date,
  ____(total_amount) AS ____,
  ____(*) AS ____
FROM ____
____ ____ sale_date`,
    },
    tags: ['dlt', 'gold', 'materialized-view', 'aggregation'],
    concepts: ['dlt-pipeline-basics', 'medallion-architecture', 'ps-groupby-agg'],
  },

  {
    id: 'dlt-11',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DELTA_LIVE_TABLES,
    question: 'A Delta Live Tables pipeline must process new events within seconds of their arrival, all day long. Which pipeline setting gives that?',
    options: [
      { id: 'a', text: 'Triggered mode, which processes all the data waiting when an update starts and then stops', isCorrect: false },
      { id: 'b', text: 'Development mode, which keeps the compute running between updates so the next one starts at once', isCorrect: false },
      { id: 'c', text: 'Continuous mode, which keeps the pipeline running and processes new data as it arrives', isCorrect: true },
      { id: 'd', text: 'Production mode, which runs each update on fresh compute and retries the update when it fails', isCorrect: false },
    ],
    explanation: 'A triggered pipeline processes all the data waiting when an update starts and then stops, so its latency is at least the gap between updates. A continuous pipeline keeps running and processes new data as it arrives, at the cost of compute that never stops. Development and production modes are a separate setting: development mode keeps the compute up between updates and does not retry, production mode restarts compute and retries failures, and neither makes a pipeline continuous.',
    tags: ['dlt', 'pipeline-mode', 'continuous', 'triggered'],
    concepts: ['dlt-pipeline-basics', 'dlt-pipeline-modes'],
  },

  {
    id: 'dlt-12',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DELTA_LIVE_TABLES,
    question: 'How does a Delta Live Tables pipeline decide the order in which to update its tables?',
    options: [
      { id: 'a', text: 'It reads which datasets each query refers to and builds a graph, so each table updates after those it reads', isCorrect: true },
      { id: 'b', text: 'It runs the statements in the order they appear in the source file, so upstream tables must come first', isCorrect: false },
      { id: 'c', text: 'It reads a depends_on list that each table declares, the same way the tasks of a job declare theirs', isCorrect: false },
      { id: 'd', text: 'It updates every table at the same time and retries any table whose upstream table is not ready yet', isCorrect: false },
    ],
    explanation: 'A pipeline is declarative: each dataset is one query, and the tables and views that query reads (LIVE.name in older code) are its dependencies. The pipeline builds its graph (DAG) from those references, so the order of statements and files in the source does not matter and there is no depends_on to write; depends_on belongs to the tasks of a job. Datasets that do not depend on each other can update in parallel.',
    tags: ['dlt', 'dependencies', 'dag'],
    concepts: ['dlt-pipeline-basics', 'dbx-workflows'],
  },

  {
    id: 'dlt-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DELTA_LIVE_TABLES,
    language: CodeLanguage.SQL,
    question: 'This is the whole source of a Lakeflow Declarative Pipeline (formerly Delta Live Tables), and the pipeline runs its first update. How many rows does clean_orders hold after the update? The answer is one whole number.',
    code: `CREATE OR REFRESH MATERIALIZED VIEW raw_orders AS
SELECT * FROM VALUES
  (1, 10, 'ana@shop.com'), (2, -5, 'ben@shop.com'),
  (3, 20, NULL), (4, 0, 'dee@shop.com')
  AS t(id, amount, email);

CREATE OR REFRESH MATERIALIZED VIEW clean_orders (
  CONSTRAINT valid_amount EXPECT (amount > 0) ON VIOLATION DROP ROW,
  CONSTRAINT has_email EXPECT (email IS NOT NULL)
) AS SELECT * FROM raw_orders;`,
    expectedOutput: `2`,
    explanation: 'valid_amount drops the rows that fail it: order 2 (-5) and order 4 (0, which is not greater than 0). has_email has no ON VIOLATION clause, so it only warns: order 3 fails it but is still written, and the failure is counted in the pipeline\'s data quality metrics. That leaves orders 1 and 3, so 2 rows. An expectation without ON VIOLATION never removes a row; add ON VIOLATION DROP ROW (expect_or_drop in Python) to keep failing rows out, or ON VIOLATION FAIL UPDATE (expect_or_fail) to stop the update.',
    hints: ['Which of the two constraints has an ON VIOLATION clause?', 'Is 0 greater than 0?'],
    tags: ['dlt', 'expectations', 'lakeflow', 'predict'],
    concepts: ['dlt-pipeline-basics', 'dlt-expectations'],
  },

  // =====================================================================
  // DATABRICKS WORKFLOWS / JOBS (15 questions)
  // =====================================================================

  {
    id: 'workflow-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DATABRICKS_WORKFLOWS,
    question: 'What is a Databricks Workflow, now called a Lakeflow Job?',
    options: [
      { id: 'a', text: 'A declarative pipeline in which you write one query per table and it works out the run order', isCorrect: false },
      { id: 'b', text: 'An all-purpose cluster kept running so that scheduled notebooks start without waiting for compute', isCorrect: false },
      { id: 'c', text: 'An orchestrator that runs tasks such as notebooks, scripts and pipelines as a DAG, on a schedule or trigger', isCorrect: true },
      { id: 'd', text: 'A notebook setting that runs every cell from top to bottom each time the notebook is opened', isCorrect: false },
    ],
    explanation: 'A Workflow, renamed Lakeflow Job, runs work with no one at a notebook: each task is a notebook, a Python script or wheel, a JAR, a SQL query, a dbt project or a pipeline update, and tasks list the tasks they depend on, which makes the job a DAG. It starts on a schedule, by hand or through the API, when files arrive, or continuously, and runs on serverless compute or a job cluster rather than an all-purpose cluster. A declarative pipeline (formerly Delta Live Tables) is a different product, which a job can run as one of its tasks.',
    tags: ['workflows', 'jobs', 'orchestration'],
    concepts: ['dbx-workflows'],
  },

  {
    id: 'workflow-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_WORKFLOWS,
    question: 'Which list holds only task types that a Databricks Workflow (Lakeflow Job) can run?',
    options: [
      { id: 'a', text: 'Notebooks, Python scripts, JARs, SQL queries, pipeline updates and dbt projects', isCorrect: true },
      { id: 'b', text: 'Notebooks, Python scripts, SQL queries and shell scripts run on the driver', isCorrect: false },
      { id: 'c', text: 'Notebooks, SQL queries, pipeline updates and Airflow DAGs uploaded to the workspace', isCorrect: false },
      { id: 'd', text: 'Notebooks and Python scripts, with SQL queries and dbt left to a SQL warehouse scheduler', isCorrect: false },
    ],
    explanation: 'A job task can be a notebook, a Python script, a Python wheel, a JAR, a SQL query, dashboard or alert, a dbt project, a pipeline update (Lakeflow Declarative Pipelines, formerly Delta Live Tables) or another job, and one job can mix them. There is no shell script task type (a notebook can run shell commands with %sh), Airflow starts Databricks jobs from outside rather than running inside one, and SQL and dbt tasks sit in the same job as notebooks.',
    tags: ['workflows', 'task-types'],
    concepts: ['dbx-workflows'],
  },

  {
    id: 'workflow-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_WORKFLOWS,
    question: 'How do you make a task of a Databricks Workflow (Lakeflow Job) wait for other tasks?',
    options: [
      { id: 'a', text: 'Tasks run one after another in the order they are listed, so a task waits for every task above it', isCorrect: false },
      { id: 'b', text: 'Each task lists the tasks it depends on, making the job a DAG in which unrelated tasks run in parallel', isCorrect: true },
      { id: 'c', text: 'A task waits for any task whose task values it reads, and that read is what creates the dependency', isCorrect: false },
      { id: 'd', text: 'Each task gets its own schedule, set to start after the task before it usually finishes', isCorrect: false },
    ],
    explanation: 'Each task names its upstream tasks in depends_on, and it starts only once they have finished (by default, once they all succeed). The job is therefore a DAG, and tasks with no dependency between them run in parallel; the order the tasks are listed in does not matter. Reading a task value does not create a dependency (the reading task must already depend on the task that set it), and separate schedules guess at timing instead of waiting for success.',
    tags: ['workflows', 'dependencies', 'dag'],
    concepts: ['dbx-workflows'],
  },

  {
    id: 'workflow-4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_WORKFLOWS,
    question: 'In a run of a Databricks Workflow (Lakeflow Job), one task fails and has no retries left. Every task keeps the default Run if setting, All succeeded. What happens to the other tasks?',
    options: [
      { id: 'a', text: 'The whole run stops at once, and every task still running on another branch is cancelled', isCorrect: false },
      { id: 'b', text: 'The tasks after it run anyway, reading null for anything the failed task should have produced', isCorrect: false },
      { id: 'c', text: 'The tasks that depend on it are skipped as Upstream failed, while other branches run to the end', isCorrect: true },
      { id: 'd', text: 'The tasks after it wait, and start on their own once someone reruns the failed task by hand', isCorrect: false },
    ],
    explanation: 'With Run if set to All succeeded, a task runs only when all its upstream tasks succeed, so the tasks after a failed one are marked Upstream failed and skipped, while tasks on independent branches carry on. A task retries on its own only if you give it retries, and once the cause is fixed a repair run reruns just the failed and skipped tasks. Another Run if setting, such as All done, lets a task run after a failure, which is how a cleanup or alert task is built.',
    tags: ['workflows', 'failure-handling', 'retry'],
    concepts: ['dbx-workflows'],
  },

  {
    id: 'workflow-5',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_WORKFLOWS,
    question: 'Which list holds only real ways to start a run of a Databricks Workflow (Lakeflow Job)?',
    options: [
      { id: 'a', text: 'A cron schedule, a manual run or API call, new files arriving in a storage location, and continuous mode', isCorrect: true },
      { id: 'b', text: `A cron schedule, a manual run or API call, and a push to the main branch of the job's Git repository`, isCorrect: false },
      { id: 'c', text: 'A cron schedule, a manual run or API call, and a message landing on a Kafka topic the job subscribes to', isCorrect: false },
      { id: 'd', text: 'A cron schedule or a manual run only; reacting to new files needs an Auto Loader stream left running', isCorrect: false },
    ],
    explanation: 'A job can run on a cron schedule, when someone starts it by hand or through the Jobs API, when new files arrive in a storage location (a file arrival trigger), when tables it watches are updated (a table update trigger), or continuously, starting a new run as soon as the last one ends. It has no Git push or Kafka trigger: a CI tool starts a job through the API, and a streaming query reads Kafka. A file arrival trigger starts a run without any stream left running.',
    tags: ['workflows', 'scheduling', 'triggers'],
    concepts: ['dbx-workflows', 'stream-triggers'],
  },

  {
    id: 'workflow-6',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_WORKFLOWS,
    question: 'How does a job cluster differ from an all-purpose cluster for running a Databricks Workflow (Lakeflow Job)?',
    options: [
      { id: 'a', text: 'A job cluster starts for one run and ends with it, at a lower rate; an all-purpose cluster stays up and costs more', isCorrect: true },
      { id: 'b', text: 'A job cluster supports interactive notebooks, while an all-purpose cluster can only run scheduled batch tasks', isCorrect: false },
      { id: 'c', text: 'A job cluster is shared by every job in the workspace, while an all-purpose cluster belongs to one user', isCorrect: false },
      { id: 'd', text: 'A job cluster stays up between runs so the next run starts fast, while an all-purpose cluster ends after each task', isCorrect: false },
    ],
    explanation: 'A job cluster is created when the run starts and terminated when it ends, and job compute is billed at a lower rate than all-purpose compute, which stays up for interactive development until someone stops it or it auto-terminates. A job cluster can be shared by the tasks of one job, not by other jobs. Serverless compute for jobs is the other choice, with no cluster to configure.',
    tags: ['workflows', 'clusters', 'job-cluster'],
    concepts: ['dbx-workflows', 'dbx-cluster-config'],
  },

  {
    id: 'workflow-7',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_WORKFLOWS,
    language: CodeLanguage.PYTHON,
    question: 'This notebook runs as a task of a Databricks Workflow (Lakeflow Job). Declare text widgets for the parameters "env" (default "dev") and "batch_date" (default "2024-01-01"), then read their values into variables named "env" and "batch_date".',
    starterCode: `# Declare widgets and retrieve parameter values\n`,
    requires: [/widgets\.text\(\s*(name\s*=\s*)?["']env["']\s*,\s*(defaultValue\s*=\s*)?["']dev["']/, /widgets\.text\(\s*(name\s*=\s*)?["']batch_date["']\s*,\s*(defaultValue\s*=\s*)?["']2024-01-01["']/, /\benv\s*=\s*dbutils\.widgets\.get\(\s*["']env["']\s*\)/, /\bbatch_date\s*=\s*dbutils\.widgets\.get\(\s*["']batch_date["']\s*\)/],
    testCases: [
      {
        input: 'Job parameters env and batch_date',
        expectedOutput: 'dbutils.widgets.text(...) for each, then dbutils.widgets.get(...) into env and batch_date',
        description: 'Should declare both widgets with defaults and read them',
      },
    ],
    solution: `dbutils.widgets.text("env", "dev")
dbutils.widgets.text("batch_date", "2024-01-01")

env = dbutils.widgets.get("env")
batch_date = dbutils.widgets.get("batch_date")
# OR
dbutils.widgets.text('env', 'dev')
dbutils.widgets.text('batch_date', '2024-01-01')

env = dbutils.widgets.get('env')
batch_date = dbutils.widgets.get('batch_date')`,
    explanation: 'Job parameters reach a notebook task as widgets. `dbutils.widgets.text(name, default)` declares a widget, and its default is used only when someone runs the notebook by hand; in a job run, the job parameter of the same name sets it. `dbutils.widgets.get(name)` returns the value as a string, so batch_date is the string "2024-01-01" unless the job passes another date.',
    hints: ['Declare each widget first, e.g. dbutils.widgets.text("env", "dev")', 'Then read it with dbutils.widgets.get("env")', 'The default is used only when the notebook runs by hand; a job parameter overrides it'],
    tieredHints: {
      apiSignature: 'dbutils.widgets.text(name, defaultValue) -> None; dbutils.widgets.get(name) -> str',
      skeleton: `____.____.____("env", ____)
____.____.____("batch_date", ____)

env = ____.____.____("env")
batch_date = ____.____.____("batch_date")`,
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
    question: 'A parent notebook runs this notebook as a child and uses the value the child hands back when it ends. Count the rows of the DataFrame "df" into "record_count", then end this notebook so that the parent receives the count as a string.',
    starterCode: `# Count the rows, then end the notebook with the count as a string
`,
    requires: [/record_count\s*=\s*df\.count\(\s*\)/, /dbutils\.notebook\.exit\(\s*(str\(\s*record_count\s*\)|f["']\{record_count\}["'])\s*\)/],
    testCases: [
      {
        input: 'DataFrame df',
        expectedOutput: 'record_count = df.count(); dbutils.notebook.exit(str(record_count))',
        description: 'Should exit the notebook with the count as a string',
      },
    ],
    solution: `record_count = df.count()\ndbutils.notebook.exit(str(record_count))\n# OR\nrecord_count = df.count()\ndbutils.notebook.exit(f"{record_count}")`,
    explanation: `\`dbutils.notebook.exit(value)\` ends the notebook and hands value back to whatever ran it: \`dbutils.notebook.run\` returns it to the parent notebook, and a job run shows it as the task's output. The value is a string, so convert the count with str() first. This is not how one job task hands a value to the next: no \`{{tasks...}}\` reference reads an exit value, so between tasks use \`dbutils.jobs.taskValues.set\` and \`get\`.`,
    hints: ['Count the rows with df.count()', 'dbutils.notebook.exit(value) ends the notebook and returns value to the caller', 'The value is a string: wrap the count in str()'],
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
    question: 'Which is the built-in way for one task of a Databricks Workflow (Lakeflow Job) to hand a small value, such as a row count, to a later task?',
    options: [
      { id: 'a', text: 'Export it as an environment variable, which every later task of the same run can read', isCorrect: false },
      { id: 'b', text: 'Return it with dbutils.notebook.exit(), which later tasks read as {{tasks.<task>.result}}', isCorrect: false },
      { id: 'c', text: 'Set it with dbutils.jobs.taskValues.set() and read it later with taskValues.get() or a reference', isCorrect: true },
      { id: 'd', text: 'Store it in a Python global variable, since all tasks of one run share the same Python process', isCorrect: false },
    ],
    explanation: `\`dbutils.jobs.taskValues.set(key, value)\` stores a small JSON-serializable value (up to 48 KiB) with the task's run, and a later task that depends on it reads it with \`dbutils.jobs.taskValues.get(taskKey=..., key=...)\` or receives it as a parameter through \`{{tasks.<task>.values.<key>}}\`. Each task is its own run, often on its own compute, so environment and Python variables are gone when the next task starts. A notebook's exit value goes back to a caller of \`dbutils.notebook.run\`, and no \`{{tasks...}}\` reference reads it. A large result belongs in a table that the next task reads.`,
    tags: ['workflows', 'task-values', 'inter-task'],
    concepts: ['dbx-workflows'],
  },

  {
    id: 'workflow-10',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DATABRICKS_WORKFLOWS,
    language: CodeLanguage.PYTHON,
    question: 'In the notebook of a job task, store the integer 1000 as a task value with the key "row_count" so that later tasks in the job can read it.',
    starterCode: `# Set task value row_count to 1000\n`,
    requires: [/dbutils\.jobs\.taskValues\.set\(/, /set\(\s*(key\s*=\s*)?["']row_count["']\s*,\s*(value\s*=\s*)?1000\s*\)|set\(\s*value\s*=\s*1000\s*,\s*key\s*=\s*["']row_count["']\s*\)/],
    testCases: [
      {
        input: 'task output',
        expectedOutput: 'dbutils.jobs.taskValues.set(key="row_count", value=1000)',
        description: 'Should set the row_count task value',
      },
    ],
    solution: `dbutils.jobs.taskValues.set(key="row_count", value=1000)\n# OR\ndbutils.jobs.taskValues.set("row_count", 1000)`,
    explanation: `\`dbutils.jobs.taskValues.set(key, value)\` stores a value with this task's run; the value must be JSON-serializable (a number, string, boolean, list or dict) and no larger than 48 KiB. A later task that depends on this one reads it with \`dbutils.jobs.taskValues.get(taskKey="<this task>", key="row_count")\` or a \`{{tasks.<this task>.values.row_count}}\` parameter. Run outside a job, set does nothing.`,
    hints: ['Task values live under dbutils.jobs.taskValues', 'set takes the key, then the value'],
    tieredHints: {
      apiSignature: 'dbutils.jobs.taskValues.set(key, value)',
      skeleton: 'dbutils.jobs.____.____(key=____, value=____)',
    },
    tags: ['workflows', 'taskValues', 'set'],
    concepts: ['dbx-workflows'],
  },

  {
    id: 'workflow-11',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_WORKFLOWS,
    question: 'What does a repair run do for a run of a Databricks Workflow (Lakeflow Job) that failed?',
    options: [
      { id: 'a', text: 'It reruns the whole job from its first task, with the same parameters as the failed run', isCorrect: false },
      { id: 'b', text: 'It reruns only the failed tasks and those skipped because of them, keeping the tasks that succeeded', isCorrect: true },
      { id: 'c', text: 'It retries a failing task a set number of times while the run is still going, before marking it failed', isCorrect: false },
      { id: 'd', text: 'It rolls back the tables the failed run wrote, restoring the versions from before the run began', isCorrect: false },
    ],
    explanation: 'A repair run reruns, within the original run, only the tasks that failed and the tasks skipped as Upstream failed, so the tasks that succeeded do not run again; you can change parameters for it. Retries are a separate task setting that reruns a failing task automatically while the run is going. Neither rolls back tables: a task that wrote data before failing has written it, so tasks should be safe to rerun.',
    tags: ['workflows', 'repair-run', 'failure-recovery'],
    concepts: ['dbx-workflows'],
  },

  {
    id: 'workflow-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_WORKFLOWS,
    language: CodeLanguage.PYTHON,
    question: 'In a Lakeflow Job (formerly a Workflow), this notebook is the task "report", which runs after the task "extract". You open the notebook and run it by hand, outside the job, without changing any widget. What does the cell print? The answer is one line: two values separated by a space.',
    code: `dbutils.widgets.text("region", "eu")
region = dbutils.widgets.get("region")
rows = dbutils.jobs.taskValues.get(
    taskKey="extract", key="rows", default=0, debugValue=7)
print(region, rows)`,
    expectedOutput: `eu 7`,
    explanation: 'Outside a job no job parameter sets the widget, so `dbutils.widgets.get` returns its default, "eu". There is no job run either, so there is no extract task to read from: `taskValues.get` returns its `debugValue`, 7, not `default`, which applies only in a job run where the extract task set no "rows" value. Without a debugValue the call would raise a TypeError here. Run in the job, the same cell would print the job\'s region parameter, if it has one, and the number the extract task set.',
    hints: ['Who sets the widget when no job runs the notebook?', 'default and debugValue answer different situations: which one is this?'],
    tags: ['workflows', 'task-values', 'widgets', 'predict'],
    concepts: ['dbx-workflows', 'dbx-widgets', 'dbx-utilities'],
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
    requires: [/GRANT/i],
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
    requires: [/GRANT/i],
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
    requires: [/REVOKE/i],
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
    requires: [/SHOW\s+GRANTS/i],
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
    requires: [/CREATE\s+CATALOG/i],
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
    requires: [/CREATE\s+SCHEMA/i],
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
    requires: [/GRANT/i],
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
    question: 'What is a Databricks Git folder (formerly called Repos)?',
    options: [
      { id: 'a', text: 'A local DBFS file system cache designed to store temporary Parquet file outputs across cluster restarts.', isCorrect: false },
      { id: 'b', text: 'A workspace Git integration allowing developers to clone repositories, manage branches, and commit code directly in Databricks.', isCorrect: true },
      { id: 'c', text: 'A cloud object storage mounting tool that replaces external AWS IAM roles with local secret scope parameters.', isCorrect: false },
      { id: 'd', text: 'A cluster provisioning engine that automatically spins up driver nodes for scheduled job runs.', isCorrect: false },
    ],
    explanation: 'A Git folder, called Repos until it was renamed, clones a repository from a Git provider (GitHub, GitLab, Azure DevOps, Bitbucket and others) into the workspace. From the workspace UI you can then switch or create branches, commit, push and pull. It holds code, not data: tables and files stay in cloud storage under Unity Catalog.',
    tags: ['repos', 'git', 'version-control'],
    concepts: ['dbx-repos'],
  },

  {
    id: 'platform-repos-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_PLATFORM,
    question: 'Which Git operations can developers perform directly in the Databricks Git folder (formerly Repos) user interface?',
    options: [
      { id: 'a', text: 'Clone, commit, push, pull, create and switch branches, view diffs, and resolve merge conflicts.', isCorrect: true },
      { id: 'b', text: 'Clone and pull remote repositories, but committing and pushing code changes require external terminal CLI tools.', isCorrect: false },
      { id: 'c', text: 'Stage and commit code changes locally, but pushing to remote repositories and switching branches are unsupported.', isCorrect: false },
      { id: 'd', text: 'Create local workspace snapshot backups, but standard Git version control operations are completely unavailable.', isCorrect: false },
    ],
    explanation: 'Git folders (formerly Repos) support the everyday Git workflow from the Databricks UI: cloning, creating and switching branches, committing, pushing, pulling, viewing diffs, and resolving merge conflicts. No terminal is needed for any of these.',
    tags: ['repos', 'git-operations'],
    concepts: ['dbx-repos'],
  },

  {
    id: 'platform-repos-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_PLATFORM,
    question: 'What file types can a Databricks Git folder (formerly Repos) hold?',
    options: [
      { id: 'a', text: 'Only standard Databricks notebooks (.py, .sql, .scala, .r) are allowed in Git folders.', isCorrect: false },
      { id: 'b', text: 'Only binary Delta Lake transaction log files and compressed Parquet data outputs.', isCorrect: false },
      { id: 'c', text: 'Notebooks, plain Python/SQL source files, YAML/JSON configuration files, and arbitrary text files.', isCorrect: true },
      { id: 'd', text: 'Only compiled Scala JAR files and packaged Python wheel (.whl) distribution archives.', isCorrect: false },
    ],
    explanation: 'A Git folder holds whatever the repository holds: notebooks, Python modules, SQL files, YAML or JSON config, tests and other text files, within the workspace\'s file size limits. Because the folder root is on sys.path, a notebook can import the repository\'s .py modules like any Python package.',
    tags: ['repos', 'file-types'],
    concepts: ['dbx-repos'],
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
    explanation: 'Auto-termination stops an all-purpose cluster once it has been idle, with no commands running, for the number of minutes set when it was created. Nobody pays for a forgotten cluster overnight, and a stopped cluster keeps its configuration, so it can be started again. Job compute does not need it, since it shuts down when its run ends.',
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
    // One alternation, not two entries: `requires` is an AND list, so
    // [/EXTENDED/, /DETAIL/] demanded both spellings at once and failed everything.
    requires: [/DESC(RIBE)?\s+(TABLE\s+)?(EXTENDED|DETAIL)/i],
    question: 'Write a SQL statement that shows the storage location and table properties of the table "sales.orders", not only its columns.',
    starterCode: `-- Inspect detailed table metadata\n`,
    testCases: [
      {
        input: 'sales.orders table',
        expectedOutput: 'DESCRIBE EXTENDED sales.orders',
        description: 'Should describe table with extended info',
      },
    ],
    solution: `DESCRIBE EXTENDED sales.orders
-- OR
DESCRIBE DETAIL sales.orders
-- OR
DESCRIBE TABLE EXTENDED sales.orders
-- OR
DESC EXTENDED sales.orders`,
    explanation: 'DESCRIBE EXTENDED (also written DESCRIBE TABLE EXTENDED or DESC EXTENDED) lists the columns and then facts about the table: its type (MANAGED or EXTERNAL), location, owner, provider and properties. DESCRIBE DETAIL gives one row for a Delta table with its format, location, file count, size and properties. A plain DESCRIBE shows only the columns.',
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
    question: 'Write a SQL statement that creates a temporary view named "active_users", lasting only for this session, over the rows of the "users" table whose account_status is \'active\'.',
    starterCode: `-- Create active_users temp view\n`,
    requires: [/TEMP(ORARY)?\s+VIEW/i],
    testCases: [
      {
        input: 'users table',
        expectedOutput: 'CREATE OR REPLACE TEMP VIEW active_users',
        description: 'Should create temporary view',
      },
    ],
    solution: `CREATE OR REPLACE TEMP VIEW active_users AS\nSELECT * FROM users WHERE account_status = 'active'
-- OR
CREATE TEMP VIEW active_users AS\nSELECT * FROM users WHERE account_status = 'active'
-- OR
CREATE OR REPLACE TEMPORARY VIEW active_users AS\nSELECT * FROM users WHERE account_status = 'active'`,
    explanation: 'CREATE TEMP VIEW (or TEMPORARY VIEW) saves the query, not its rows, under a name that only this Spark session can see; it is gone when the session ends, for example when the notebook is detached. OR REPLACE lets the cell be re-run without an error. A view created without TEMP would be saved in the catalog for everyone with access.',
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
