import { CodeLanguage, Course, Difficulty, Question, QuestionType, SqlTable, Topic } from '../types';

/**
 * Data Engineering, section "Warehouses, Lakes & Table Formats": the third
 * section of the course rewrite (decisions and designs). Four topics, each
 * taught by a lesson (src/data/lessons/dataEngineeringLessons.ts) and then
 * practised with cards that make the learner produce the answer:
 *
 *   introduce: one term-check MCQ, predict the outcome over small tables;
 *   combine:   choose and justify, order the steps (Parsons with prose lines);
 *   apply:     spot the flaw, predict or choose under three or more constraints;
 *   review:    explain in your own words (review-only, never a new card).
 *
 * Authoring rules for this file (the same as Moving Data and Storage & Files):
 *   - MCQ distractors are real misconceptions with their (wrong) reasoning,
 *     options length-matched, no absolute-word giveaways;
 *   - every predict-the-outcome answer is checked by running it:
 *     dataEngineeringWarehousesLakesChecks.ts holds the check,
 *     scripts/check-outcomes.js runs it (part of npm test);
 *   - a table format is modelled as what its log says (versions, files added
 *     and removed, row counts), so the state of a table is a query;
 *   - tool-agnostic: tables, SQL and a few lines of pseudo-config are the
 *     notation, never one vendor's API.
 */

const DE = Course.DATA_ENGINEERING;

const table = (name: string, columns: string[], rows: (string | number | null)[][]): SqlTable => ({ name, columns, rows });

/** Prose lines for a Parsons card: its solution is the lines in order. */
const steps = (lines: string[]) => lines.join('\n');

// ════════════════════════════════════════════════════════════════════════
// Workloads & Systems: OLTP, OLAP, Warehouse, Lake, Lakehouse
// ════════════════════════════════════════════════════════════════════════

const workloadsSystems: Question[] = [
  {
    id: 'de-workload-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_WORKLOADS_SYSTEMS,
    course: DE,
    question: 'A team says it has turned its data lake into a lakehouse. What has it added to the files in object storage?',
    options: [
      { id: 'a', text: 'A log of commits that lists each table\'s files, giving transactions, a schema and versions', isCorrect: true },
      { id: 'b', text: 'A warehouse that loads a copy of the lake\'s files each night and serves the reports from it', isCorrect: false },
      { id: 'c', text: 'Parquet files in place of the CSV and JSON ones, so that its tables are stored in columns', isCorrect: false },
      { id: 'd', text: 'A catalog that maps each table name to its folder, so that other engines can find the files', isCorrect: false },
    ],
    explanation:
      'A lakehouse keeps the lake\'s open files and adds a table format: a log of commits beside them that says which files make up each table. The log is what gives atomic writes, an enforced schema and older versions.\n' +
      'A nightly warehouse copy is two systems, not one. A folder of Parquet is still a folder: it has columns but no transactions. A catalog finds a table\'s folder but cannot say which files in it are committed.',
  },
  {
    id: 'de-workload-2',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_WORKLOADS_SYSTEMS,
    course: DE,
    question:
      'The clicks folder in the lake holds the files below. The nightly job has finished; the hourly job is still running and has written 2 of its files so far. A plain lake reader takes every .parquet file in the folder.\n' +
      'How many rows does the query return?',
    tables: [
      table('clicks_files', ['file', 'written_by', 'job_state', 'row_count'], [
        ['part-0001.parquet', 'nightly', 'finished', 400],
        ['part-0002.parquet', 'nightly', 'finished', 350],
        ['part-0003.parquet', 'nightly', 'finished', 250],
        ['part-0004.parquet', 'hourly', 'running', 120],
        ['part-0005.parquet', 'hourly', 'running', 80],
      ]),
    ],
    code: 'SELECT COUNT(*) FROM clicks;',
    language: CodeLanguage.SQL,
    answer: '1200',
    acceptableAnswers: ['1,200'],
    unit: 'rows',
    tempting: [
      { answer: '1000', why: '1,000 is the finished job alone. Nothing in a folder of files says which job is done, so the reader takes the running job\'s two files as well.' },
      { answer: '200', why: '200 is the running job\'s rows. The finished job\'s three files are in the same folder and are read too.' },
    ],
    explanation:
      'The reader lists the folder and reads all five files: 400 + 350 + 250 + 120 + 80 = 1,200 rows, of which 200 belong to a job that has not finished and may still fail and run again.\n' +
      'A table format would answer 1,000 until the hourly job commits: its log, not the folder, says which files are in the table.',
  },
  {
    id: 'de-workload-3',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_WORKLOADS_SYSTEMS,
    course: DE,
    question:
      'This warehouse keeps its data on the disks of its compute nodes, so the cluster has to be large enough to hold the data and stays up while it holds it. Its setup is below.\n' +
      'How many node-hours a day does the cluster run?',
    code:
      'data:              40 TB\n' +
      'storage per node:  4 TB        # the data lives on the nodes\' own disks\n' +
      'query load:        2 nodes for 4 hours a day would be enough',
    answer: '240',
    unit: 'node-hours',
    tempting: [
      { answer: '8', why: '8 is the query load, 2 nodes x 4 hours. That is what a design with storage apart from compute pays; here 10 nodes hold the data all day.' },
      { answer: '40', why: '40 is 10 nodes for the 4 busy hours. The nodes hold the data, so they cannot be switched off for the other 20 hours.' },
    ],
    explanation:
      '40 TB at 4 TB a node needs 10 nodes, and they run 24 hours a day because the data lives on them: 240 node-hours.\n' +
      'With the data in object storage and compute apart, the cluster is sized by the queries instead (2 nodes x 4 hours = 8 node-hours), and the data costs only storage.',
  },
  {
    id: 'de-workload-4',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_WORKLOADS_SYSTEMS,
    course: DE,
    question:
      'Three tools need the same 10 TB orders table: the warehouse\'s SQL, a Spark job of the ML team, and Python notebooks.\n' +
      'In design A the warehouse keeps the table in its own internal format, and each of the other tools gets its own exported Parquet copy. In design B the table is one set of open files in a lakehouse, read by all three.\n' +
      'How many TB does design A store?',
    tables: [
      table('tools', ['tool', 'reads'], [
        ['warehouse SQL', 'internal format'],
        ['Spark (ML team)', 'Parquet files'],
        ['Python notebooks', 'Parquet files'],
      ]),
    ],
    answer: '30',
    unit: 'TB',
    tempting: [
      { answer: '20', why: '20 counts the two exports but leaves out the warehouse\'s own copy, which the exports are made from.' },
      { answer: '10', why: '10 is design B: one set of open files that every tool reads in place.' },
    ],
    explanation:
      'The warehouse holds 10 TB in a format only it reads, and each of the two other tools gets a 10 TB export: 30 TB, two of them copies that have to be refreshed and lag behind.\n' +
      'In design B the files are open and a table format describes them, so all three engines read the same 10 TB.',
  },
  {
    id: 'de-workload-5',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_WORKLOADS_SYSTEMS,
    course: DE,
    question:
      'A startup has one 20 GB Postgres database behind its app. Two analysts run a handful of reports each morning, and every report finishes in under a minute.\n' +
      'Where should the reports run for now, and why?',
    decisions: [
      { id: 'replica', text: 'On a read replica of the app database, kept current by replication', isCorrect: true },
      { id: 'warehouse', text: 'In a new cloud warehouse, loaded from the app database each night', isCorrect: false },
      { id: 'lakehouse', text: 'In a lakehouse on object storage, fed by change data capture from it', isCorrect: false },
      { id: 'lake-export', text: 'On Parquet files in a lake, exported from the database each hour', isCorrect: false },
    ],
    reasons: [
      { id: 'small', text: 'At 20 GB the reports finish fast where the data already is, and a replica keeps them off the app\'s writes', isCorrect: true },
      { id: 'faster', text: 'A warehouse answers these reports faster, so the sooner it is set up, the less the move costs later', isCorrect: false },
      { id: 'no-group-by', text: 'A row database runs GROUP BY over a whole table too slowly, so reports need a columnar system at once', isCorrect: false },
      { id: 'corrupt', text: 'Reads on the app\'s database can corrupt rows being written, so the reports need a copy kept in a separate system', isCorrect: false },
    ],
    explanation:
      'A second system means a pipeline to build, run and watch. At 20 GB and a few reports a day it buys nothing, and a replica already keeps the reports from competing with checkout.\n' +
      'Row databases run aggregates fine at this size, and reads do not corrupt writes. The time to move is when reports slow down or start to hurt the app.',
  },
  {
    id: 'de-workload-6',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_WORKLOADS_SYSTEMS,
    course: DE,
    question:
      'An analytics team has 50 GB of Parquet files and runs joins and aggregations over all of it a few times a day. Someone proposes a 20-node cluster.\n' +
      'What should the queries run on, and why?',
    decisions: [
      { id: 'one-machine', text: 'One large machine with a columnar engine that reads the Parquet files', isCorrect: true },
      { id: 'cluster', text: 'The 20-node cluster, so that each node handles about 2.5 GB of the data', isCorrect: false },
      { id: 'app-db', text: 'The app\'s Postgres database, after the Parquet files are loaded into it', isCorrect: false },
      { id: 'cluster-cache', text: 'The 20-node cluster, with the full 50 GB cached in memory across its nodes', isCorrect: false },
    ],
    reasons: [
      { id: 'fits', text: 'At 50 GB the data fits on one machine, and a join on a cluster has to move rows between nodes over the network', isCorrect: true },
      { id: 'linear', text: 'Each node added divides the time by the same factor, so 20 nodes run these queries twenty times as fast as one', isCorrect: false },
      { id: 'process-limit', text: 'One process reads files larger than 10 GB too slowly, so the work has to be split across machines', isCorrect: false },
      { id: 'row-faster', text: 'A row database scans loaded Parquet data faster than a columnar engine, since it indexes the rows', isCorrect: false },
    ],
    explanation:
      'A cluster pays for coordination and for shuffling rows between nodes in every join, which only earns its keep when the data or the work outgrows one machine. 50 GB does not.\n' +
      'Speed-up is never linear, nothing stops one process reading a large file, and a row database is the slow side for scans.',
  },
  {
    id: 'de-workload-7',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_WORKLOADS_SYSTEMS,
    course: DE,
    language: CodeLanguage.SQL,
    question: 'Reports running on the app database are slowing checkout. Put the steps of moving them to an analytics store in order. Two steps do not belong.',
    correctOrder: [
      'List the tables and columns that the reports read',
      'Extract those tables on a schedule from a replica, not from the primary',
      'Land each extract as raw files in the lake',
      'Build typed, cleaned tables from the raw files in the analytics store',
      'Point the reports at the cleaned tables and compare their totals with the old ones',
    ],
    distractorLines: [
      'Add an index on the app database for every column the reports filter on',
      'Run the reports on the primary at night, when checkout is quiet',
    ],
    solution: steps([
      'List the tables and columns that the reports read',
      'Extract those tables on a schedule from a replica, not from the primary',
      'Land each extract as raw files in the lake',
      'Build typed, cleaned tables from the raw files in the analytics store',
      'Point the reports at the cleaned tables and compare their totals with the old ones',
    ]),
    explanation:
      'The move starts from what the reports read, takes it from a replica so the extract itself does not load the app, keeps the raw extract, and builds the tables the reports will trust; the old totals prove the switch.\n' +
      'More indexes on the primary slow every write, and moving the reports to the night keeps them on the same database that the app needs.',
  },
  {
    id: 'de-workload-8',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_WORKLOADS_SYSTEMS,
    course: DE,
    question:
      'An order is written to the app database at 14:30 on 2026-11-03. It reaches the dashboard through the hops below. Each hop starts on its schedule and takes only what the hop before it had committed when it started.\n' +
      'At what time on 2026-11-04 does the order first show on the dashboard? (hh:mm)',
    code:
      'extract to lake:   daily at 02:00, takes 30 min\n' +
      'warehouse load:    every hour at :15, takes 20 min\n' +
      'dashboard refresh: every 4 hours from 00:00, takes 5 min',
    answer: '04:05',
    acceptableAnswers: ['4:05'],
    tempting: [
      { answer: '02:35', why: 'The 02:15 load started before the extract committed at 02:30, so it did not have the order. The 03:15 load is the first to take it.' },
      { answer: '03:35', why: 'The order is in the warehouse at 03:35, but the dashboard only reads the warehouse at its next refresh, which starts at 04:00.' },
    ],
    explanation:
      'The 02:00 extract takes the order and commits at 02:30. The 02:15 warehouse load started too early; the 03:15 load takes it and commits at 03:35. The 04:00 refresh then reads it and finishes at 04:05.\n' +
      'Every copy between systems adds its own wait, so a separate analytics store is always some hours behind the app.',
  },
  {
    id: 'de-workload-9',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_WORKLOADS_SYSTEMS,
    course: DE,
    question:
      'A company lands 2 TB of raw clickstream JSON a day. The ML team trains models in Spark and Python on raw and cleaned data; finance needs SQL reports on cleaned tables, and one user\'s rows must be deletable on request.\n' +
      'Which design fits, and why?',
    decisions: [
      { id: 'lakehouse', text: 'Raw files in object storage, and the cleaned tables in an open table format beside them', isCorrect: true },
      { id: 'warehouse', text: 'Raw and cleaned data loaded into the warehouse, with copies exported for the ML team', isCorrect: false },
      { id: 'plain-lake', text: 'Raw and cleaned data kept as plain Parquet folders, with the reports run on the folders', isCorrect: false },
      { id: 'app-db', text: 'Cleaned data loaded into the app database, which can already delete a user\'s rows', isCorrect: false },
    ],
    reasons: [
      { id: 'one-copy', text: 'One copy of open files serves every engine, and the table format\'s commits make deletes and reports safe', isCorrect: true },
      { id: 'folders', text: 'Parquet folders already take deletes and atomic overwrites, so what a table format adds is a list of names', isCorrect: false },
      { id: 'cheap', text: 'A warehouse stores raw JSON as cheaply as object storage, and its exports keep the ML team in step', isCorrect: false },
      { id: 'app-scans', text: 'The app database is built for scans of whole tables, and these reports fit what it does best', isCorrect: false },
    ],
    explanation:
      'Several engines and both raw and cleaned data point to open files in object storage; SQL reports and per-user deletes need transactions. A table format on the same files gives both, with one copy.\n' +
      'Plain folders have no atomic commits, a warehouse makes the ML team work from exported copies, and the app database is built for small reads and writes.',
  },
  {
    id: 'de-workload-10',
    type: QuestionType.SPOT_FLAW,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_WORKLOADS_SYSTEMS,
    course: DE,
    question:
      'Checkout latency jumps every five minutes, on the minute, since the revenue dashboard went live.\n' +
      'Click the line that causes it.',
    lines: [
      'dashboard: revenue_by_region',
      'refresh: every 5 minutes        # finance needs it this fresh',
      'connection: postgres://app-primary.internal:5432/shop',
      'query: |',
      '  SELECT c.region, SUM(o.amount) FROM orders o',
      '  JOIN customers c ON c.customer_id = o.customer_id GROUP BY c.region',
    ],
    flawLines: [3],
    note: 'orders holds 300 million rows. app-primary is the database the checkout service writes to.',
    explanation:
      'Line 3 points the dashboard at the app\'s primary database, so every refresh scans 300 million rows on the same machine that checkout writes to, and the two compete for disk, memory and CPU.\n' +
      'The 5-minute refresh is a requirement, not the fault: point the dashboard at an analytics store (or at least a replica) that is fed from the app.',
  },
  {
    id: 'de-workload-11',
    type: QuestionType.SPOT_FLAW,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_WORKLOADS_SYSTEMS,
    course: DE,
    question:
      'During the nightly run, the clicks dashboard sometimes shows no rows, or about half the usual count, for a few minutes.\n' +
      'Click the line that causes it.',
    language: CodeLanguage.PYTHON,
    lines: [
      'raw = spark.read.json("s3://lake/raw/clicks/dt=2026-11-03/")',
      'clean = raw.dropDuplicates(["click_id"])',
      'clean.write.mode("overwrite").parquet("s3://lake/clean/clicks/dt=2026-11-03/")',
      '# the dashboard reads every Parquet file under s3://lake/clean/clicks/',
    ],
    flawLines: [3],
    note: 'clean/clicks is a plain folder of Parquet files, with no table format.',
    explanation:
      'Line 3 overwrites a plain folder: the old files are deleted and the new ones written one by one, so a reader in between lists an empty or half-filled folder.\n' +
      'Make clean/clicks a table in a table format: the overwrite is then one commit, and readers keep the old version until the new one is complete.',
  },
  {
    id: 'de-workload-12',
    type: QuestionType.EXPLAIN,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_WORKLOADS_SYSTEMS,
    course: DE,
    question: 'In two or three sentences: what does a lakehouse keep from a data lake, and what does it add to it?',
    keyPoints: [
      'It keeps the lake\'s open files in cheap object storage, which many engines can read',
      'It adds a table format: a log of commits that says which files make up each table',
      'The log gives atomic commits, an enforced schema and older versions, so warehouse-style SQL, updates and deletes work on the files',
    ],
    modelAnswer:
      'A lakehouse keeps the lake\'s open files in cheap object storage, where any engine can read them. ' +
      'It adds a table format, a log of commits that says which files make up each table, and that log gives atomic writes, an enforced schema and older versions, so warehouse-style SQL, updates and deletes work on the same files.',
    explanation: 'The difference between a lake and a lakehouse is the log beside the files, not the files themselves.',
  },
  {
    id: 'de-workload-13',
    type: QuestionType.EXPLAIN,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_WORKLOADS_SYSTEMS,
    course: DE,
    question: 'In two or three sentences: a warehouse checks data against a schema when it is loaded, and a lake applies one when it is read. What does each buy, and what does each risk?',
    keyPoints: [
      'Schema on write turns away data that does not fit at load time, so every reader can trust the table',
      'Its cost is rigidity: a new or changed field has to be added to the schema before it can be loaded',
      'Schema on read lands anything cheaply and keeps the raw data as it came, but each reader interprets it and errors surface only at query time',
    ],
    modelAnswer:
      'Checking on write turns away data that does not fit while it is loaded, so every reader can trust the table, at the price that any new or changed field has to be added to the schema first. ' +
      'Applying the schema on read lands anything quickly and keeps the raw data as it came, but every reader interprets it in its own way, and bad data shows up only when someone queries it.',
    explanation: 'Most platforms use both: raw data lands schema-on-read, and the tables people report from are checked on write.',
  },
];

// ════════════════════════════════════════════════════════════════════════
// Table Formats: Log, Snapshots & Concurrent Writers
// ════════════════════════════════════════════════════════════════════════

const tableFormatLog: Question[] = [
  {
    id: 'de-snapshot-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_TABLE_FORMAT_LOG,
    course: DE,
    question: 'A table format says its commits are atomic. What does that promise a reader of the table?',
    options: [
      { id: 'a', text: 'A reader is made to wait while a commit is running, then reads the version it creates', isCorrect: false },
      { id: 'b', text: 'Each file in a commit is checked against the schema, so a bad row is turned away', isCorrect: false },
      { id: 'c', text: 'A reader sees all of the files a commit added, or none of them, but never just a part', isCorrect: true },
      { id: 'd', text: 'A commit is copied to two regions before it returns, so it survives losing either', isCorrect: false },
    ],
    explanation:
      'Atomic means all or nothing: a commit\'s files join the table together when its log entry is written, so a reader sees the version before it or the version after it.\n' +
      'Readers do not wait (they keep reading the version they started on), checking the schema is a separate feature, and copies to two regions are about durability.',
  },
  {
    id: 'de-snapshot-2',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_TABLE_FORMAT_LOG,
    course: DE,
    question:
      'A table format keeps the log below beside the table\'s Parquet files. Version 2 is an update that rewrote f1 as f4. All five files are still in the folder.\n' +
      'How many rows does a query of the latest version count?',
    tables: [
      table('table_log', ['version', 'action', 'file', 'row_count'], [
        [0, 'add', 'f1', 100],
        [0, 'add', 'f2', 100],
        [1, 'add', 'f3', 60],
        [2, 'remove', 'f1', null],
        [2, 'add', 'f4', 98],
        [3, 'add', 'f5', 40],
      ]),
    ],
    code: 'SELECT COUNT(*) FROM orders;',
    language: CodeLanguage.SQL,
    answer: '298',
    unit: 'rows',
    tempting: [
      { answer: '398', why: '398 counts f1 as well. f1 is still in the folder, but version 2 removed it from the table, so no version from 2 on reads it.' },
      { answer: '258', why: '258 is version 2. The latest version is 3, which added f5.' },
    ],
    explanation:
      'The latest version is every file added and not since removed: f2 (100), f3 (60), f4 (98) and f5 (40), 298 rows.\n' +
      'f1 stays in the folder so that versions 0 and 1 can still be read, which is why the folder is never the table.',
  },
  {
    id: 'de-snapshot-3',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_TABLE_FORMAT_LOG,
    course: DE,
    question:
      'A dashboard query starts at 10:00:00 and reads the latest version, 41. At 10:00:05, while it is still running, a delete commits version 42, which removes f2 and adds f2b with 70 of f2\'s rows. version_files lists the files of each version.\n' +
      'How many rows does the dashboard query count?',
    tables: [
      table('version_files', ['version', 'file', 'row_count'], [
        [41, 'f1', 200],
        [41, 'f2', 100],
        [41, 'f3', 150],
        [42, 'f1', 200],
        [42, 'f2b', 70],
        [42, 'f3', 150],
      ]),
    ],
    answer: '450',
    unit: 'rows',
    tempting: [
      { answer: '420', why: '420 is version 42. The query fixed its version when it started, so a commit made while it runs does not change what it reads.' },
      { answer: '520', why: '520 reads f2 and f2b together. A reader never mixes two versions: it reads exactly the files of the one it picked.' },
    ],
    explanation:
      'The query picked version 41 at 10:00:00 and reads exactly its files: 200 + 100 + 150 = 450 rows. The delete is real, and the next query that starts will see version 42 (420 rows).\n' +
      'This is snapshot isolation: readers never block writers and never see half of a commit.',
  },
  {
    id: 'de-snapshot-4',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_TABLE_FORMAT_LOG,
    course: DE,
    question:
      'The orders table\'s recent commits are below, with the rows each version holds. A query asks for the table as it was at noon.\n' +
      'How many rows does it count?',
    tables: [
      table('commits', ['version', 'committed_at', 'operation', 'rows_after'], [
        [10, '2026-11-03 06:00', 'append', 1000],
        [11, '2026-11-03 09:30', 'append', 1400],
        [12, '2026-11-03 12:05', 'delete', 1350],
        [13, '2026-11-03 15:00', 'append', 1800],
      ]),
    ],
    code: "SELECT COUNT(*) FROM orders TIMESTAMP AS OF '2026-11-03 12:00';",
    language: CodeLanguage.SQL,
    answer: '1400',
    acceptableAnswers: ['1,400'],
    unit: 'rows',
    tempting: [
      { answer: '1350', why: 'Version 12 was committed at 12:05, after the time asked for. At noon the latest committed version was 11.' },
      { answer: '1800', why: '1,800 is the latest version. Time travel reads the version that was current at the time given.' },
    ],
    explanation:
      'A timestamp picks the last version committed at or before it: version 11 (09:30), which holds 1,400 rows.\n' +
      'Time travel works only while that version\'s files are still on storage; cleanup decides how far back that is.',
  },
  {
    id: 'de-snapshot-5',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_TABLE_FORMAT_LOG,
    course: DE,
    question:
      'An hourly job appends new orders to a table. Since a nightly job started deleting closed accounts\' rows, the append sometimes fails with "concurrent commit: version 812 already exists".\n' +
      'What should the hourly job do, and why?',
    decisions: [
      { id: 'retry', text: 'Retry the commit: re-read the log and commit as the next free version', isCorrect: true },
      { id: 'lock', text: 'Take a lock on the table folder so that one job writes at a time', isCorrect: false },
      { id: 'second-table', text: 'Append to a second table instead and union the two in the queries', isCorrect: false },
      { id: 'no-check', text: 'Turn off the version check so that both commits are accepted as they are', isCorrect: false },
    ],
    reasons: [
      { id: 'no-overlap', text: 'An append reads none of the files the delete changed, so after a re-read nothing conflicts and the retry succeeds', isCorrect: true },
      { id: 'files-lost', text: 'The failed commit took its data files with it, so the job has to read the extract again and write each of them anew', isCorrect: false },
      { id: 'order-unknown', text: 'Two writers need a lock to be safe, because the log does not record which commit came first', isCorrect: false },
      { id: 'both-kept', text: 'Both commits name version 812, so accepting both keeps the rows of both jobs in the table', isCorrect: false },
    ],
    explanation:
      'Table formats use optimistic concurrency: writers work in parallel, one wins each version, and the loser checks whether the winner touched what it read. An append read nothing the delete changed, so it simply commits as version 813; its data files are already written.\n' +
      'A lock is what the log makes unnecessary, a second table moves the problem into every query, and two entries for one version would make one of them vanish.',
  },
  {
    id: 'de-snapshot-6',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_TABLE_FORMAT_LOG,
    course: DE,
    language: CodeLanguage.SQL,
    question: 'Put the steps of a writer committing to a table format in order. Two steps do not belong.',
    correctOrder: [
      'Read the latest version number and its list of files',
      'Write the new data files under new, unique names',
      'Try to create log entry v+1 listing the files added and removed',
      'If v+1 already exists, read the winning commits and check whether they changed a file this write read',
      'With no overlap, retry as the next free version; otherwise fail',
    ],
    distractorLines: [
      'Overwrite the data files that hold the changed rows with their new contents',
      'Delete the files this write replaces as soon as the new files are written',
    ],
    solution: steps([
      'Read the latest version number and its list of files',
      'Write the new data files under new, unique names',
      'Try to create log entry v+1 listing the files added and removed',
      'If v+1 already exists, read the winning commits and check whether they changed a file this write read',
      'With no overlap, retry as the next free version; otherwise fail',
    ]),
    explanation:
      'Data files come first and are invisible until the log entry names them; the entry is created only if that version is still free, and a writer that lost the race checks for a real conflict before it tries again.\n' +
      'Files are never overwritten, and replaced files stay until cleanup, because older versions and running readers still use them.',
  },
  {
    id: 'de-snapshot-7',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_TABLE_FORMAT_LOG,
    course: DE,
    question:
      'The table is at version 7, with the files in live_files. The three jobs in jobs start from version 7 at the same time and try to commit in commit_order.\n' +
      'A commit that loses the race re-reads the winning commits: it fails if a winner removed a file it read, and otherwise retries as the next version.\n' +
      'How many rows does the table hold when all three jobs are done?',
    tables: [
      table('live_files', ['file', 'partition', 'row_count'], [
        ['f1', 'dt=11-01', 150],
        ['f2', 'dt=11-01', 150],
        ['f3', 'dt=11-02', 250],
      ]),
      table('jobs', ['job', 'commit_order', 'what_it_does', 'reads', 'removes', 'adds'], [
        ['A', 1, 'compacts dt=11-01', 'f1, f2', 'f1, f2', 'f9 (the same 300 rows)'],
        ['B', 2, 'appends to dt=11-03', 'none', 'none', 'f10 (120 rows)'],
        ['C', 3, 'deletes 30 rows in dt=11-01', 'f2', 'f2', 'f2x (f2 minus 30 rows)'],
      ]),
    ],
    answer: '670',
    unit: 'rows',
    tempting: [
      { answer: '640', why: '640 lets job C\'s delete through. Job A removed f2, which C read, so C\'s commit fails and the delete has to run again on f9.' },
      { answer: '550', why: '550 leaves out job B. B read no file that anyone removed, so it retries as version 9 and commits.' },
    ],
    explanation:
      'A commits version 8 (f9 300 + f3 250 = 550 rows). B loses version 8, finds no overlap and commits version 9 (+120 = 670). C read f2, which A removed, so its retry fails: 670 rows, and the 30 rows are still there until C runs again.\n' +
      'The conflict check is what stops C from writing a delete against a file that is no longer in the table.',
  },
  {
    id: 'de-snapshot-8',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_TABLE_FORMAT_LOG,
    course: DE,
    question:
      'Finance must be able to re-run last month\'s close report a month from now and get exactly the same numbers. The orders table is updated every day, late corrections included, and the table keeps old versions for 60 days.\n' +
      'What should the report do, and why?',
    decisions: [
      { id: 'pin-version', text: 'Record the table version it read, and re-run against that version', isCorrect: true },
      { id: 'filter-dates', text: 'Re-run on the latest version, filtered to last month\'s order dates', isCorrect: false },
      { id: 'csv-copy', text: 'Export a full copy of the table to CSV each month before it runs', isCorrect: false },
      { id: 'freeze', text: 'Stop the daily updates to the table for a month after each close', isCorrect: false },
    ],
    reasons: [
      { id: 'fixed-files', text: 'A version names a fixed list of files, so reading it again gives the same rows while those files are kept', isCorrect: true },
      { id: 'past-fixed', text: 'Rows for past order dates stay as they were, so the latest version filtered by date matches the old report', isCorrect: false },
      { id: 'compaction-rewrites', text: 'A copy outside the table is the exact one, since compaction rewrites old versions of a table in place', isCorrect: false },
      { id: 'latest-only', text: 'A table format keeps just its latest version, so stopping writes is how the numbers are held still', isCorrect: false },
    ],
    explanation:
      'A version is an exact, unchangeable list of files. Recording the version the report read lets it be read again, and 60 days of retention covers the month.\n' +
      'Late corrections do change past order dates, compaction adds a new version and leaves old ones as they were, and a monthly CSV copy or a write freeze costs far more than one number.',
  },
  {
    id: 'de-snapshot-9',
    type: QuestionType.SPOT_FLAW,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_TABLE_FORMAT_LOG,
    course: DE,
    question:
      'An analyst\'s notebook reports more orders than the SQL engine does for the same table, and the gap grows after every update and compaction.\n' +
      'Click the line that causes it.',
    language: CodeLanguage.PYTHON,
    lines: [
      'import glob, pyarrow.parquet as pq',
      'files = glob.glob("/lake/orders/**/*.parquet", recursive=True)',
      'orders = pq.ParquetDataset(files).read()',
      'print(orders.num_rows)',
    ],
    flawLines: [2],
    note: 'orders is a table in a table format: its log says which of the folder\'s files belong to the latest version.',
    explanation:
      'Line 2 takes every Parquet file in the folder: files that updates and compactions have removed from the table (kept for older versions) and files of writes that never committed, so their rows are counted again.\n' +
      'Read the table through its log, with an engine or library that understands the table format, never by listing the folder.',
  },
  {
    id: 'de-snapshot-10',
    type: QuestionType.SPOT_FLAW,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_TABLE_FORMAT_LOG,
    course: DE,
    question:
      'Two jobs writing to this home-made table both reported success at the same moment, yet one job\'s rows are missing from the table.\n' +
      'Click the line that causes it.',
    language: CodeLanguage.PYTHON,
    lines: [
      'v = latest_version(log_dir)    # e.g. 811',
      'added = write_data_files(rows)',
      'entry = f"{log_dir}/{v + 1:020d}.json"',
      'if not exists(entry):',
      '    put(entry, commit_entry(added))    # plain PUT',
      'print("committed version", v + 1)',
    ],
    flawLines: [4, 5],
    note: 'A plain PUT replaces an object if its key already exists. The store also has a conditional PUT that fails when the key is already there.',
    explanation:
      'Lines 4 and 5 check and then write in two steps. Both jobs can pass the check before either writes, and the second plain PUT replaces the first job\'s entry, whose files are then in no version.\n' +
      'Create the entry with the conditional PUT (create only if absent) in one step: exactly one job wins the version, and the other retries.',
  },
  {
    id: 'de-snapshot-11',
    type: QuestionType.EXPLAIN,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_TABLE_FORMAT_LOG,
    course: DE,
    question: 'In two or three sentences: how does a table format decide which files make up a table, and why does a reader never see a half-finished write?',
    keyPoints: [
      'A log of commits lists the files each version added and removed; the table is the files added and not yet removed',
      'A writer writes its data files first, and they join the table only when its commit is written to the log',
      'A reader picks one version when it starts and reads exactly its files, so a later or unfinished commit cannot change what it sees',
    ],
    modelAnswer:
      'The table format keeps a log of commits, each listing the files it added and removed, and the table at a version is the files added and not yet removed by then. ' +
      'A writer writes its files first and they join the table only when its commit lands in the log, while a reader reads exactly the files of the version it started on, so an unfinished write is invisible to it.',
    explanation: 'The folder can hold old, new and abandoned files at once; only the log says which of them are the table.',
  },
  {
    id: 'de-snapshot-12',
    type: QuestionType.EXPLAIN,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_TABLE_FORMAT_LOG,
    course: DE,
    question: 'In two or three sentences: two writers commit to the same table at once. What happens to the one that loses, when does its retry fail, and why must the log store offer a create-if-absent write?',
    keyPoints: [
      'Both try to create the same next version; the store lets only one create it, and the other gets a conflict',
      'The loser re-reads the winning commits and retries as the next version if they changed nothing it read',
      'If the winner removed or changed a file the loser read, the retry fails and the job has to run again on the new version',
      'Without an atomic create-if-absent, both writes can land and one commit silently replaces the other',
    ],
    modelAnswer:
      'Both writers try to create the same next version and the store lets only one succeed, so the loser re-reads the winning commits and retries as the next version when they changed nothing it read. ' +
      'If the winner removed a file the loser read, the retry fails and the job has to run again; and without a create-if-absent write both entries could land, one silently replacing the other.',
    explanation: 'Optimistic concurrency needs no locks, but it needs one atomic step: creating the next log entry only if it does not exist yet.',
  },
];

// ════════════════════════════════════════════════════════════════════════
// Updating Files: Copy-on-Write, Merge-on-Read & Cleanup
// ════════════════════════════════════════════════════════════════════════

const updatingFiles: Question[] = [
  {
    id: 'de-rewrite-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_UPDATING_FILES,
    course: DE,
    question: 'A table writes its updates as merge-on-read. What happens when one row is updated?',
    options: [
      { id: 'a', text: 'The file holding the row is rewritten with the new value, and the old file is removed', isCorrect: false },
      { id: 'b', text: 'The change goes to a small file of its own, and readers combine it with the base file', isCorrect: true },
      { id: 'c', text: 'The row is edited in place inside its Parquet file, and the file\'s footer is refreshed', isCorrect: false },
      { id: 'd', text: 'The change waits in memory until the next compaction writes it into the base file', isCorrect: false },
    ],
    explanation:
      'Merge-on-read writes the change to a small file (a delete file marking the old row, plus the row\'s new version) and every reader merges it with the base files until a compaction folds it in.\n' +
      'Rewriting the whole file is copy-on-write, Parquet files are never edited in place, and a change held in memory would be lost in a crash.',
  },
  {
    id: 'de-rewrite-2',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_UPDATING_FILES,
    course: DE,
    question:
      'The table writes its updates as copy-on-write. An UPDATE changes the rows counted in rows_matching, 5 rows in all.\n' +
      'How many MB of data files does the update write?',
    tables: [
      table('data_files', ['file', 'mb', 'rows_matching'], [
        ['f1', 128, 0],
        ['f2', 128, 2],
        ['f3', 128, 0],
        ['f4', 128, 0],
        ['f5', 128, 3],
        ['f6', 128, 0],
      ]),
    ],
    answer: '256',
    unit: 'MB',
    tempting: [
      { answer: '768', why: '768 MB is the whole table. Copy-on-write rewrites only the files that hold a changed row; the other four are kept as they are.' },
      { answer: '128', why: 'Both f2 and f5 hold changed rows, so both are rewritten in full.' },
    ],
    explanation:
      'Copy-on-write rewrites each file that holds a changed row, whole: f2 and f5, 2 x 128 = 256 MB, to change 5 rows. One commit then swaps the two old files for the two new ones.\n' +
      'The write cost is set by how many files the changed rows are spread over, not by how many rows change.',
  },
  {
    id: 'de-rewrite-3',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_UPDATING_FILES,
    course: DE,
    question:
      'A merge-on-read table has 20 base files. Since its last compaction, 6 update runs have committed, and each wrote 1 delete file and 1 file of new row versions.\n' +
      'How many files does a full scan of the table open?',
    tables: [
      table('table_files', ['kind', 'files'], [
        ['base', 20],
        ['delete files per update run', 1],
        ['new-version files per update run', 1],
        ['update runs since compaction', 6],
      ]),
    ],
    answer: '32',
    unit: 'files',
    tempting: [
      { answer: '20', why: '20 is the base files alone. Until a compaction folds them in, a reader has to open every delete file and every new-version file as well.' },
      { answer: '26', why: '26 counts one file per run. Each run wrote two: the delete file and the file with the rows\' new versions.' },
    ],
    explanation:
      'A reader opens the 20 base files, the 6 delete files that say which base rows are gone, and the 6 files that hold the new versions: 32 files.\n' +
      'Every update run adds to this until compaction rewrites the base files with the changes applied, which brings the scan back to the base files.',
  },
  {
    id: 'de-rewrite-4',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_UPDATING_FILES,
    course: DE,
    question:
      'Cleanup runs at 2026-11-10 00:00 with a 7-day retention: it deletes from storage the files that were removed from the table more than 7 days before it runs. Files still in the table are never deleted.\n' +
      'How many files does it delete?',
    tables: [
      table('table_files', ['file', 'removed_in_version', 'removed_at'], [
        ['f1', 3, '2026-11-01 08:00'],
        ['f2', 3, '2026-11-01 08:00'],
        ['f3', 5, '2026-11-02 23:00'],
        ['f4', 8, '2026-11-04 10:00'],
        ['f5', 9, '2026-11-08 12:00'],
        ['f6', null, null],
        ['f7', null, null],
      ]),
    ],
    answer: '3',
    acceptableAnswers: ['three'],
    unit: 'files',
    tempting: [
      { answer: '5', why: 'f4 and f5 were removed less than 7 days ago. Older versions that still need them are inside the retention, so they are kept.' },
      { answer: '7', why: 'f6 and f7 are in the current version. Cleanup only deletes files that no version inside the retention uses.' },
    ],
    explanation:
      'The cut-off is 2026-11-03 00:00. f1, f2 and f3 were removed before it, so no version inside the 7 days uses them and they are deleted; f4 and f5 were removed after it and stay.\n' +
      'A removed file stays on storage until cleanup, because time travel and readers that started earlier may still need it.',
  },
  {
    id: 'de-rewrite-5',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_UPDATING_FILES,
    course: DE,
    question:
      'A device_state table of 2,000 files takes about 50,000 upserts every 5 minutes, spread over most of its files. Dashboards read it once an hour.\n' +
      'How should the updates be written, and why?',
    decisions: [
      { id: 'mor', text: 'Merge-on-read, with a compaction folding the changes in every few hours', isCorrect: true },
      { id: 'cow', text: 'Copy-on-write, so that the files a dashboard opens are already up to date', isCorrect: false },
      { id: 'append', text: 'Append each change as a row and keep the newest per device in each query', isCorrect: false },
      { id: 'rebuild', text: 'Rebuild the whole table from the source system at the start of each hour', isCorrect: false },
    ],
    reasons: [
      { id: 'write-cost', text: 'Each run touches most files, so rewriting them every 5 minutes costs far more than writing the changes', isCorrect: true },
      { id: 'cow-rows', text: 'Copy-on-write rewrites just the changed rows, so its write cost is the same as that of merge-on-read, row for row', isCorrect: false },
      { id: 'mor-skip', text: 'Merge-on-read readers skip the change files, so the hourly dashboards pay little for them', isCorrect: false },
      { id: 'no-upserts', text: 'A table on files does not take upserts, so changes have to be kept as rows to settle later on', isCorrect: false },
    ],
    explanation:
      'With changes spread over most files, copy-on-write would rewrite nearly the whole table every 5 minutes. Merge-on-read writes only the changes, readers pay to merge them, and a compaction every few hours keeps that cost bounded.\n' +
      'Copy-on-write rewrites whole files, merge-on-read readers do pay for the change files, and file tables take upserts fine.',
  },
  {
    id: 'de-rewrite-6',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_UPDATING_FILES,
    course: DE,
    question:
      'A dim_product table of 40 files is updated by one job each night and read by 300 dashboards all day.\n' +
      'How should its updates be written, and why?',
    decisions: [
      { id: 'cow', text: 'Copy-on-write: rewrite the files that hold changed rows, once a night', isCorrect: true },
      { id: 'mor-weekly', text: 'Merge-on-read, with the change files compacted once a week', isCorrect: false },
      { id: 'append-latest', text: 'Append the changed rows and let each dashboard keep the newest version', isCorrect: false },
      { id: 'drop-create', text: 'Drop and re-create the table from the source system each night', isCorrect: false },
    ],
    reasons: [
      { id: 'pay-once', text: 'The rewrite is paid once a night, and each of the 300 readers gets plain files with nothing to merge', isCorrect: true },
      { id: 'mor-faster-reads', text: 'Merge-on-read speeds up reads, since a reader opens just the small change files and not the base', isCorrect: false },
      { id: 'cow-cheaper-write', text: 'Copy-on-write is the cheaper way to write an update, so it is the default whatever the reads are', isCorrect: false },
      { id: 'drop-atomic', text: 'Dropping and re-creating a table happens in one atomic step, so the dashboards do not see it missing', isCorrect: false },
    ],
    explanation:
      'Few writes and many reads: copy-on-write puts the cost on the one nightly job, and every read is of plain files. Merge-on-read would make 300 readers merge a week of changes.\n' +
      'Merge-on-read readers open the base files and the change files, copy-on-write is the costlier write, and between a drop and a create the table does not exist.',
  },
  {
    id: 'de-rewrite-7',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_UPDATING_FILES,
    course: DE,
    language: CodeLanguage.SQL,
    question: 'Put the steps of a copy-on-write UPDATE in order. Two steps do not belong.',
    correctOrder: [
      'Use the file statistics to find the files that may hold rows matching the filter',
      'Read each of those files and apply the change to its matching rows',
      'Write every row of each changed file into a new file under a new name',
      'Commit one version that removes the old files and adds the new ones',
      'Leave the old files for cleanup, once no retained version or reader needs them',
    ],
    distractorLines: [
      'Edit the matching rows inside the existing Parquet files and refresh their footers',
      'Rewrite every file of the table so that the new version is complete',
    ],
    solution: steps([
      'Use the file statistics to find the files that may hold rows matching the filter',
      'Read each of those files and apply the change to its matching rows',
      'Write every row of each changed file into a new file under a new name',
      'Commit one version that removes the old files and adds the new ones',
      'Leave the old files for cleanup, once no retained version or reader needs them',
    ]),
    explanation:
      'Copy-on-write touches only the files that hold matching rows, writes their full contents again as new files, and swaps old for new in one commit; the old files wait for cleanup.\n' +
      'Parquet files are never edited in place, and the files without a matching row carry over to the new version unchanged.',
  },
  {
    id: 'de-rewrite-8',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_UPDATING_FILES,
    course: DE,
    question:
      'files lists which versions of a table use each data file: from added_in up to, but not including, removed_in. Cleanup at 2026-11-10 00:00 deleted the files removed in a commit made more than 7 days earlier. A version can be read only if all of its files still exist.\n' +
      'What is the oldest version time travel can still read?',
    tables: [
      table('commits', ['version', 'committed_at'], [
        [1, '2026-10-30 09:00'],
        [2, '2026-11-01 08:00'],
        [3, '2026-11-02 23:00'],
        [4, '2026-11-04 10:00'],
        [5, '2026-11-08 12:00'],
      ]),
      table('files', ['file', 'added_in', 'removed_in'], [
        ['f1', 1, 2],
        ['f2', 1, 2],
        ['f3', 1, 3],
        ['f4', 2, 4],
        ['f5', 2, null],
        ['f6', 3, null],
        ['f7', 4, 5],
        ['f8', 5, null],
      ]),
    ],
    answer: '3',
    acceptableAnswers: ['version 3', 'three'],
    tempting: [
      { answer: '4', why: 'Version 4 is the first committed inside the 7 days, but version 3 was the current version at the start of the window. None of its files was removed before then, so all of them still exist.' },
      { answer: '2', why: 'Version 2 uses f3, which version 3 removed on 2026-11-02, before the cut-off, so cleanup deleted it.' },
    ],
    explanation:
      'The cut-off is 2026-11-03 00:00, so f1, f2 (removed in version 2) and f3 (removed in version 3) are deleted. Versions 1 and 2 each use one of them; version 3 uses f4, f5 and f6, which all still exist.\n' +
      'A retention of 7 days keeps every version that was current at some time in those 7 days, which is why version 3 survives.',
  },
  {
    id: 'de-rewrite-9',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_UPDATING_FILES,
    course: DE,
    question:
      'A user asks to be erased, and the law allows 30 days. The events table writes deletes as merge-on-read, compacts weekly, and keeps old versions for 90 days of time travel.\n' +
      'What makes the user\'s rows really gone within the 30 days, and why?',
    decisions: [
      { id: 'delete-compact-expire', text: 'DELETE the rows, compact their files, then expire old versions so cleanup removes the files', isCorrect: true },
      { id: 'delete', text: 'DELETE the rows; once the delete commits, readers and old versions stop returning them', isCorrect: false },
      { id: 'delete-compact', text: 'DELETE the rows and compact the files they sat in, so that the data files stop holding them', isCorrect: false },
      { id: 'overwrite', text: 'Overwrite the table without the user\'s rows, so the old files are replaced by new ones at once', isCorrect: false },
    ],
    reasons: [
      { id: 'hidden-not-gone', text: 'A delete file only hides the rows: the old data files still hold them, and old versions keep those files', isCorrect: true },
      { id: 'dropped-at-once', text: 'Once a delete commits, the old data files are dropped from storage at once, so the delete is enough', isCorrect: false },
      { id: 'compact-deletes', text: 'Compaction rewrites the files without the rows and deletes the old files from storage in the same step', isCorrect: false },
      { id: 'overwrite-history', text: 'An overwrite replaces the table\'s files on storage at once, so its earlier versions are gone along with them', isCorrect: false },
    ],
    explanation:
      'The delete writes a delete file and the compaction writes clean files, but both only add versions: every older version still points at the files with the user\'s rows, and 90-day retention keeps them. Expiring those versions lets cleanup delete the files inside the 30 days.\n' +
      'Neither a delete, a compaction nor an overwrite removes files from storage; only cleanup does, and only for versions outside the retention.',
  },
  {
    id: 'de-rewrite-10',
    type: QuestionType.SPOT_FLAW,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_UPDATING_FILES,
    course: DE,
    question:
      'Since the maintenance settings changed, the six-hour backfill that starts at 23:00 fails around 01:15 with "file not found", and a query for yesterday\'s version fails too.\n' +
      'Click the line that causes it.',
    lines: [
      'table: events',
      'maintenance:',
      '  compact_small_files: daily at 01:00',
      '  expire_versions_older_than: 0 hours',
      '  delete_unreferenced_files: right after expiry',
    ],
    flawLines: [4],
    note: 'Compaction removes the old small files from the table in a new version; they stay on storage until cleanup deletes them.',
    explanation:
      'Line 4 expires every version but the newest, so right after the 01:00 compaction, cleanup deletes the files it just replaced, including the ones the 23:00 backfill is still reading from its version and the ones yesterday\'s version needs.\n' +
      'Keep versions for longer than the longest-running job and the time travel you need (7 days is a common default).',
  },
  {
    id: 'de-rewrite-11',
    type: QuestionType.SPOT_FLAW,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_UPDATING_FILES,
    course: DE,
    question:
      'Queries on device_state get slower every day, although the table holds the same 2 million devices in the same 2,000 base files.\n' +
      'Click the line that causes it.',
    lines: [
      'table: device_state          # one row per device',
      'update_mode: merge-on-read',
      'upserts: every 5 minutes from the device feed',
      'compaction: none',
      'readers: dashboards, hourly',
    ],
    flawLines: [4],
    note: 'Each upsert run writes delete files and a file of new row versions.',
    explanation:
      'Line 4 means nothing ever folds the changes into the base files. 288 upsert runs a day each add delete files and new-version files, and every read has to merge the growing pile.\n' +
      'Merge-on-read needs a scheduled compaction; it is what keeps the read cost bounded.',
  },
  {
    id: 'de-rewrite-12',
    type: QuestionType.EXPLAIN,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_UPDATING_FILES,
    course: DE,
    question: 'In two or three sentences: data files cannot be edited. Where do copy-on-write and merge-on-read each pay the cost of an update, and when does each fit?',
    keyPoints: [
      'Copy-on-write rewrites every file that holds a changed row, so the writer pays and readers see plain files',
      'Merge-on-read writes only the changes to small files, so writes are cheap and every reader pays to merge them',
      'Copy-on-write fits rare updates and many reads; merge-on-read fits frequent small updates, with compaction to fold the changes in',
    ],
    modelAnswer:
      'Copy-on-write rewrites each file that holds a changed row, so the writer pays and readers get plain files, which suits tables updated rarely and read often. ' +
      'Merge-on-read writes only the changes into small files, so writes are cheap but every reader merges them, which suits frequent small updates, with compaction folding the changes in.',
    explanation: 'Both make a new version out of new files; they differ in who does the merging, the writer once or each reader every time.',
  },
  {
    id: 'de-rewrite-13',
    type: QuestionType.EXPLAIN,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_UPDATING_FILES,
    course: DE,
    question: 'In two or three sentences: why are deleted rows still on storage after a DELETE commits, and what finally removes them? Say what the retention setting trades.',
    keyPoints: [
      'A delete adds a new version; the old files that hold the rows are only removed from the table, not from storage',
      'Older versions keep those files for time travel and for readers that started earlier',
      'Cleanup deletes the files no version inside the retention uses, so a longer retention means more time travel and more storage, a shorter one risks breaking running readers',
    ],
    modelAnswer:
      'A DELETE only commits a new version, so the files holding the rows leave the table but stay on storage, because older versions and readers that started earlier still use them. ' +
      'Cleanup deletes them once no version inside the retention needs them, so a long retention buys time travel at the price of storage, and a short one can pull files from under running jobs.',
    explanation: 'Removing a row from the table and removing its bytes from storage are two steps, and only the second one ends time travel to it.',
  },
];

// ════════════════════════════════════════════════════════════════════════
// Schema Enforcement & Evolution
// ════════════════════════════════════════════════════════════════════════

const schemaEvolution: Question[] = [
  {
    id: 'de-schema-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_SCHEMA_EVOLUTION,
    course: DE,
    question: 'A nullable column is added to a table that already holds many files. What happens to the files written before the change?',
    options: [
      { id: 'a', text: 'They are rewritten in the background, so the old files hold the new column within a day', isCorrect: false },
      { id: 'b', text: 'They are hidden from readers until a backfill writes a value of the column into each', isCorrect: false },
      { id: 'c', text: 'They keep their old schema, so a query that names the new column fails when it reads them', isCorrect: false },
      { id: 'd', text: 'They stay as they are, and readers return NULL for the new column in each of their rows', isCorrect: true },
    ],
    explanation:
      'Adding a nullable column changes only the table\'s schema in its metadata. Old files are not touched; a reader that finds no such column in a file returns NULL for it.\n' +
      'No rewrite happens, nothing is hidden, and the query works across old and new files, which is what makes this change safe.',
  },
  {
    id: 'de-schema-2',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_SCHEMA_EVOLUTION,
    course: DE,
    question:
      'The orders table held 3 files of 100 rows each when coupon_code was added as a nullable column. One file of 50 rows has been written since, and 20 of those rows carry a coupon.\n' +
      'How many rows does the query count?',
    tables: [
      table('order_files', ['file', 'written', 'row_count', 'rows_with_coupon'], [
        ['f1', 'before the change', 100, null],
        ['f2', 'before the change', 100, null],
        ['f3', 'before the change', 100, null],
        ['f4', 'after the change', 50, 20],
      ]),
    ],
    code: 'SELECT COUNT(*) FROM orders WHERE coupon_code IS NULL;',
    language: CodeLanguage.SQL,
    answer: '330',
    unit: 'rows',
    tempting: [
      { answer: '30', why: '30 is the new file alone. The 300 older rows have no coupon_code in their files, and readers return NULL for it.' },
      { answer: '300', why: '300 leaves out the new file\'s 30 rows without a coupon, which are NULL too.' },
    ],
    explanation:
      'The 300 rows in files written before the change read as NULL for coupon_code, and so do the 30 rows of f4 without a coupon: 330.\n' +
      'An added column has no history: "no value" and "written before the column existed" look the same, which matters when someone reads NULL as "no coupon used".',
  },
  {
    id: 'de-schema-3',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_SCHEMA_EVOLUTION,
    course: DE,
    question:
      'The payments table declares amount as DECIMAL(10,2) and enforces its schema on write. A batch of 500 rows arrives in which one row\'s amount is the text "n/a". The batch is written as one commit.\n' +
      'How many of the 500 rows are in the table after the write?',
    tables: [
      table('batch_summary', ['amount_value', 'row_count'], [
        ['a decimal number', 499],
        ['"n/a"', 1],
      ]),
    ],
    answer: '0',
    acceptableAnswers: ['zero', 'none'],
    unit: 'rows',
    tempting: [
      { answer: '499', why: 'The table does not filter rows one by one. The write is one commit, and a commit with a row that breaks the schema is refused whole.' },
      { answer: '500', why: '500 is what a folder of plain files would take in: nothing there checks the values against a schema.' },
    ],
    explanation:
      'Schema enforcement checks the write as a whole: one value that cannot be a DECIMAL fails it, and an atomic commit that fails adds nothing. The table stays as it was, and the job reports the error.\n' +
      'If bad rows should not stop the batch, split them out before the write (into a quarantine table) and commit the rest.',
  },
  {
    id: 'de-schema-4',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_SCHEMA_EVOLUTION,
    course: DE,
    question:
      'The pipeline below loads partner orders into lake.orders, inferring the schema of each batch. At 12:00 on 2026-11-03 the partner renamed amount to amount_cents. That day\'s batches are in batches; total_sent is the sum of the field the batch sent.\n' +
      'What revenue does the report give for 2026-11-03?',
    tables: [
      table('batches', ['batch_time', 'field_sent', 'row_count', 'total_sent'], [
        ['06:00', 'amount', 100, 4000],
        ['09:00', 'amount', 120, 5000],
        ['12:00', 'amount_cents', 110, 470000],
        ['15:00', 'amount_cents', 90, 380000],
      ]),
    ],
    code:
      '-- pipeline settings\n' +
      '-- new_columns: added to the table\n' +
      '-- missing_columns: filled with NULL\n' +
      "SELECT SUM(amount) FROM lake.orders WHERE order_day = '2026-11-03';",
    language: CodeLanguage.SQL,
    answer: '9000',
    acceptableAnswers: ['9,000'],
    tempting: [
      { answer: '17500', why: '17,500 is what the partner really sold, but amount is NULL in every row sent after the rename, and SUM skips NULLs.' },
      { answer: '859000', why: 'That adds the cents as if they were amounts. The report sums amount only, and the renamed field went into a new column.' },
    ],
    explanation:
      'The morning batches fill amount (4,000 + 5,000). From 12:00 the batches have no amount, so it is filled with NULL, and amount_cents is added as a new column the report does not read: the report says 9,000 for a 17,500 day, and no load failed.\n' +
      'This is schema drift let in silently: the change should have stopped the load.',
  },
  {
    id: 'de-schema-5',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_SCHEMA_EVOLUTION,
    course: DE,
    question:
      'Next week the source starts sending a currency field with every order. Three dashboards read fact_orders and do not need it yet; a fourth will.\n' +
      'What should change in fact_orders, and when?',
    decisions: [
      { id: 'add-nullable', text: 'Add currency as a nullable column before the source starts sending it', isCorrect: true },
      { id: 'auto-merge', text: 'Turn on automatic schema merge so the column appears once it arrives', isCorrect: false },
      { id: 'rebuild', text: 'Rebuild the table with the new column and rewrite each existing file', isCorrect: false },
      { id: 'drop-field', text: 'Drop the field at ingestion until the four dashboards are ready for it', isCorrect: false },
    ],
    reasons: [
      { id: 'metadata-only', text: 'A nullable column is a metadata change: old rows read as NULL, and readers that ignore it are unaffected', isCorrect: true },
      { id: 'merge-additions', text: 'Automatic merge accepts additions alone, so a renamed or retyped field stays out of the table', isCorrect: false },
      { id: 'old-files-fail', text: 'Old files lack a currency column, so a reader fails on them until each of them has been rewritten', isCorrect: false },
      { id: 'add-back', text: 'A field dropped at ingestion can be added back from the stored table later on, so the wait costs nothing', isCorrect: false },
    ],
    explanation:
      'A nullable column is the safe kind of change: no file is rewritten, old rows read NULL, and the three dashboards never notice it. Adding it before the data arrives keeps the schema declared, not inferred.\n' +
      'Automatic merge takes in a rename as a new column too, old files read fine, and a field dropped at ingestion is gone unless the raw data is kept.',
  },
  {
    id: 'de-schema-6',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_SCHEMA_EVOLUTION,
    course: DE,
    question:
      'A new partner sends order ids such as "P-10017", but fact_orders.order_id is a BIGINT that five reports join on.\n' +
      'How should the table change, and why?',
    decisions: [
      { id: 'new-column', text: 'Add a text order_ref column, fill it for old rows, move the reports, drop order_id', isCorrect: true },
      { id: 'alter-type', text: 'Change order_id from BIGINT to VARCHAR in place, with a single ALTER TABLE statement', isCorrect: false },
      { id: 'strip-prefix', text: 'Strip the "P-" from the partner\'s ids at ingestion, so that they fit the BIGINT column', isCorrect: false },
      { id: 'second-table', text: 'Write the partner\'s orders to a second table that has its own text column for the id', isCorrect: false },
    ],
    reasons: [
      { id: 'not-widening', text: 'BIGINT to text is not a widening: old files hold integers, and the reports join on the integer type', isCorrect: true },
      { id: 'type-metadata', text: 'A change of type is a metadata change, like adding a column, so the old files are read as the new type', isCorrect: false },
      { id: 'still-unique', text: 'Without the prefix the ids stay unique, because the partner numbers its orders apart from ours', isCorrect: false },
      { id: 'union-same', text: 'A second table leaves the reports as they are, since a union of two tables joins just like one', isCorrect: false },
    ],
    explanation:
      'Only widening changes (INT to BIGINT, FLOAT to DOUBLE) are safe in place. Integer to text changes what every old value is and breaks the joins, so the new column is added beside the old one and readers move over before the old one goes.\n' +
      'Stripping the prefix can collide with existing ids, and a second table pushes a union into all five reports.',
  },
  {
    id: 'de-schema-7',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_SCHEMA_EVOLUTION,
    course: DE,
    language: CodeLanguage.SQL,
    question: 'amount has to be renamed to amount_eur in a table that six dashboards read. Put the steps in order. Two steps do not belong.',
    correctOrder: [
      'Add amount_eur as a new nullable column',
      'Change the pipeline to write both amount and amount_eur',
      'Fill amount_eur for the old rows from amount',
      'Move each dashboard to amount_eur and check its totals',
      'Drop amount once no reader uses it',
    ],
    distractorLines: [
      'Rename amount in place, then fix each dashboard as it fails',
      'Drop amount first, so that nothing keeps reading the old name',
    ],
    solution: steps([
      'Add amount_eur as a new nullable column',
      'Change the pipeline to write both amount and amount_eur',
      'Fill amount_eur for the old rows from amount',
      'Move each dashboard to amount_eur and check its totals',
      'Drop amount once no reader uses it',
    ]),
    explanation:
      'This is expand and contract: the new name is added and filled while the old one keeps working, readers move one at a time, and the old name goes last, so no dashboard breaks at any step.\n' +
      'Renaming in place or dropping first breaks every reader at once.',
  },
  {
    id: 'de-schema-8',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_SCHEMA_EVOLUTION,
    course: DE,
    question:
      'discount was dropped from the orders table last month. Last week a new discount column, meaning something else, was added. The table matches its columns to the columns inside files by name, and old files still hold a column called discount. order_files lists the files of the current version.\n' +
      'How many rows does the query count?',
    tables: [
      table('order_files', ['file', 'written', 'row_count', 'rows_with_discount_in_file'], [
        ['f1', 'before the drop', 400, 120],
        ['f2', 'before the drop', 300, 90],
        ['f3', 'after the re-add', 200, 50],
        ['f4', 'after the re-add', 100, 0],
      ]),
    ],
    code: 'SELECT COUNT(*) FROM orders WHERE discount IS NOT NULL;',
    language: CodeLanguage.SQL,
    answer: '260',
    unit: 'rows',
    tempting: [
      { answer: '50', why: '50 is what a table that tracks columns by id would count: the new column gets a new id, so old files have no value for it. Matching by name finds the old column again.' },
      { answer: '210', why: '210 is the old files alone. f3 was written after the re-add, and 50 of its rows carry a discount.' },
    ],
    explanation:
      'Matching by name, the reader finds a column called discount in f1 and f2 and returns the old values (120 + 90), and f3 adds its 50: 260 rows, 210 of them in a meaning the column no longer has.\n' +
      'Formats that give each column an id (Iceberg, or Delta with column mapping) read the re-added column as NULL in the old files, which is why they can drop and rename safely.',
  },
  {
    id: 'de-schema-9',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_SCHEMA_EVOLUTION,
    course: DE,
    question:
      'A partner API changes its JSON fields without notice a few times a year; once it renamed amount to total. The pipeline infers each batch\'s schema and merges new columns into the table.\n' +
      'What should the pipeline do instead, and why?',
    decisions: [
      { id: 'enforce', text: 'Check each batch against a declared schema and hold back a batch that does not match', isCorrect: true },
      { id: 'review', text: 'Keep merging new columns, and review each week the columns that appeared in the table', isCorrect: false },
      { id: 'strings', text: 'Store each field as text, so that a change of type in the source does not fail a load', isCorrect: false },
      { id: 'sample', text: 'Infer the schema once a day from a sample of the batches, not once for each new batch', isCorrect: false },
    ],
    reasons: [
      { id: 'fail-loud', text: 'A mismatch then stops at the boundary with an alert, not as NULLs that the reports sum without an error', isCorrect: true },
      { id: 'rename-adds', text: 'A rename just adds a column, so the old one keeps its values and a weekly review has time enough to catch it', isCorrect: false },
      { id: 'text-safe', text: 'Text accepts whatever value comes, so the reports downstream get the same totals whatever the partner sends', isCorrect: false },
      { id: 'sample-sees', text: 'A daily sample sees each field the partner sends, so the inferred schema keeps up with each change', isCorrect: false },
    ],
    explanation:
      'Schema drift is a source changing its structure unannounced. Inferring and merging lets it in as a new column and a column of NULLs, so the reports go wrong with no error anywhere. A declared schema turns the change into a failed, alerting batch that waits in quarantine until the mapping is fixed.\n' +
      'After a rename the old column gets NULLs for new rows at once, text only moves the failure into every query, and a sample can miss the change.',
  },
  {
    id: 'de-schema-10',
    type: QuestionType.SPOT_FLAW,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_SCHEMA_EVOLUTION,
    course: DE,
    question:
      'Since the partner\'s release on Tuesday, orders keep loading and row counts look normal, but revenue for new orders is 0.\n' +
      'Click the line that causes it.',
    lines: [
      'source: partner_orders_api            # JSON orders',
      'schema: order_id BIGINT, amount DECIMAL(10,2), created_at TIMESTAMP',
      'on_missing_column: fill with NULL',
      'on_extra_column: keep in a _rescued column',
      'target: lake.orders',
    ],
    flawLines: [3],
    note: 'Since Tuesday the partner sends amount_cents in place of amount. The _rescued column of the new rows holds it.',
    explanation:
      'Line 3 lets a batch with no amount load anyway, as NULL, so the loads succeed and the report sums nothing. A required column that is missing should fail the batch, or send it to quarantine, with an alert.\n' +
      'Line 4 is what makes the cause easy to find: the renamed field is kept in _rescued.',
  },
  {
    id: 'de-schema-11',
    type: QuestionType.SPOT_FLAW,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_SCHEMA_EVOLUTION,
    course: DE,
    question:
      'After migration 042, loads of bulk orders started failing with "value out of range", while small orders still load.\n' +
      'Click the line that causes it.',
    language: CodeLanguage.SQL,
    lines: [
      '-- migration 042',
      'ALTER TABLE fact_orders ADD COLUMN currency VARCHAR(3);',
      'ALTER TABLE fact_orders ALTER COLUMN quantity TYPE SMALLINT;      -- was INT',
      'ALTER TABLE fact_orders ALTER COLUMN amount TYPE DECIMAL(18,2);   -- was DECIMAL(10,2)',
    ],
    flawLines: [3],
    note: 'A bulk order can have a quantity of 50,000 units. SMALLINT holds -32,768 to 32,767.',
    explanation:
      'Line 3 narrows quantity from INT to SMALLINT, so any quantity above 32,767 no longer fits. Narrowing is never safe: it fails, or worse, truncates, for values the old type allowed.\n' +
      'Line 2 adds a nullable column and line 4 widens a type; both are safe changes.',
  },
  {
    id: 'de-schema-12',
    type: QuestionType.EXPLAIN,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_SCHEMA_EVOLUTION,
    course: DE,
    question: 'In two or three sentences: which changes to a table\'s schema are safe while many readers use it, and which are not? Say why.',
    keyPoints: [
      'Adding a nullable column is safe: old files are untouched and read as NULL, and readers that ignore it do not notice',
      'Widening a type (INT to BIGINT) is safe, because every old value still fits',
      'Renaming, dropping, narrowing or changing a type breaks the readers that use the column, so it needs a new column and a move of the readers',
    ],
    modelAnswer:
      'Adding a nullable column and widening a type are safe, because old files are read as they are (NULL for the new column) and every old value still fits. ' +
      'Renaming, dropping, narrowing or changing a type breaks the readers that use that column, so it is done by adding a new column, moving the readers, and only then removing the old one.',
    explanation: 'A schema change is safe when every existing reader and every existing file still means the same thing afterwards.',
  },
  {
    id: 'de-schema-13',
    type: QuestionType.EXPLAIN,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_SCHEMA_EVOLUTION,
    course: DE,
    question: 'In two or three sentences: what is schema drift, and why should a pipeline hold back a batch that does not match the declared schema rather than merge the change in?',
    keyPoints: [
      'Schema drift is a source changing its structure (a field renamed, added, dropped or retyped) without telling its consumers',
      'Merged in automatically, a rename becomes a new column plus NULLs in the old one, so reports go wrong with no error',
      'Checking against a declared schema stops the batch at the boundary with an alert, so the change is handled on purpose',
    ],
    modelAnswer:
      'Schema drift is a source changing its structure, such as renaming or retyping a field, without telling the teams that read it. ' +
      'Merged in automatically, a rename becomes a new column and a column of NULLs that reports sum without any error, while a check against a declared schema stops the batch at the boundary and alerts, so someone handles the change on purpose.',
    explanation: 'The aim is a loud failure at the edge of the platform instead of a quiet wrong number at the end of it.',
  },
];

export const dataEngineeringWarehousesLakesQuestions: Question[] = [
  ...workloadsSystems,
  ...tableFormatLog,
  ...updatingFiles,
  ...schemaEvolution,
];
