import { CodeLanguage, Course, Difficulty, Question, QuestionType, SqlTable, Topic } from '../types';

/**
 * Data Engineering, section "Storage & Files": the second section of the course
 * rewrite (decisions and designs). Four topics, each taught by a lesson
 * (src/data/lessons/dataEngineeringLessons.ts) and then practised with cards
 * that make the learner produce the answer:
 *
 *   introduce: one term-check MCQ, predict the outcome over small tables;
 *   combine:   choose and justify, order the steps (Parsons with prose lines);
 *   apply:     spot the flaw, predict or choose under three or more constraints;
 *   review:    explain in your own words (review-only, never a new card).
 *
 * Authoring rules for this file (the same as Moving Data):
 *   - MCQ distractors are real misconceptions with their (wrong) reasoning,
 *     options length-matched, no absolute-word giveaways;
 *   - every predict-the-outcome answer is checked by running it:
 *     dataEngineeringStorageFilesChecks.ts holds the check, scripts/check-outcomes.js
 *     runs it (part of npm test);
 *   - files are modelled as tables of what a reader can see (columns and their
 *     widths, row-group min/max, file sizes), so the arithmetic is a query.
 */

const DE = Course.DATA_ENGINEERING;

const table = (name: string, columns: string[], rows: (string | number | null)[][]): SqlTable => ({ name, columns, rows });

/** Prose lines for a Parsons card: its solution is the lines in order. */
const steps = (lines: string[]) => lines.join('\n');

// ════════════════════════════════════════════════════════════════════════
// Rows vs Columns
// ════════════════════════════════════════════════════════════════════════

const rowVsColumnLayout: Question[] = [
  {
    id: 'de-layout-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_ROW_VS_COLUMN_LAYOUT,
    course: DE,
    question: 'A table is saved in a columnar file. What does that say about how it is laid out?',
    options: [
      { id: 'a', text: 'Each column is saved as its own file, so a query opens one file for every column it names', isCorrect: false },
      { id: 'b', text: 'The rows are sorted by their first column, so a filter on that column finds its rows fast', isCorrect: false },
      { id: 'c', text: 'One column\'s values sit next to each other, so a query reads just the columns it names', isCorrect: true },
      { id: 'd', text: 'The table is kept in memory and written out once a day, so a scan never waits on the disk', isCorrect: false },
    ],
    explanation:
      'In a columnar file the values of one column are stored together, in chunks inside the file, so a query reads only the chunks of the columns it names.\n' +
      'A file per column is a different design, the sort order of the rows is a separate choice, and a columnar file still lives on disk.',
  },
  {
    id: 'de-layout-2',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_ROW_VS_COLUMN_LAYOUT,
    course: DE,
    question:
      'The rides table holds 2,000,000 rows. ride_columns lists its columns and the bytes one value of each takes. The report below reads one column of it.\n' +
      'How many MB does a columnar file read to answer it? (1 MB = 1,000,000 bytes; ignore compression.)',
    tables: [
      table('ride_columns', ['column_name', 'bytes_per_value'], [
        ['ride_id', 8],
        ['city', 12],
        ['fare_cents', 8],
        ['driver_note', 92],
      ]),
    ],
    code: 'SELECT SUM(fare_cents) FROM rides;',
    language: CodeLanguage.SQL,
    answer: '16',
    unit: 'MB',
    tempting: [
      { answer: '240', why: 'That is a row file, which reads every column of every row: 120 bytes x 2,000,000 rows.' },
      { answer: '120', why: '120 is the bytes in one whole row, not the MB the one column takes across all the rows.' },
    ],
    explanation:
      'A columnar file reads only the fare_cents chunks: 8 bytes x 2,000,000 rows = 16 MB.\n' +
      'A row file has to read each row in full, 120 bytes x 2,000,000 = 240 MB, to reach the same column.',
  },
  {
    id: 'de-layout-3',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_ROW_VS_COLUMN_LAYOUT,
    course: DE,
    question:
      'One new customer row is inserted. A row file adds it in one place, at the end of the file.\n' +
      'The customers table has the columns below. How many separate column chunks does a columnar file have to add a value to?',
    tables: [
      table('customer_columns', ['column_name', 'column_type'], [
        ['customer_id', 'BIGINT'],
        ['full_name', 'VARCHAR'],
        ['email', 'VARCHAR'],
        ['country', 'VARCHAR'],
        ['signup_ts', 'TIMESTAMP'],
        ['plan', 'VARCHAR'],
      ]),
    ],
    answer: '6',
    acceptableAnswers: ['six'],
    unit: 'chunks',
    tempting: [
      { answer: '1', why: 'One place is the row file, which keeps the whole row together. A columnar file keeps each column apart.' },
      { answer: '5', why: 'customer_id is a column too: it has its own chunk, so all six columns get a value.' },
    ],
    explanation:
      'Every column has its own chunk, so a single row means a write to each of the 6.\n' +
      'That is why columnar files are fed in large batches and are poor at taking one row at a time.',
  },
  {
    id: 'de-layout-4',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_ROW_VS_COLUMN_LAYOUT,
    course: DE,
    question:
      'The visits below are written to a columnar file sorted by country (then visit_id). Run-length encoding stores a column as (value, count) pairs, one pair for each run of equal values in the order written.\n' +
      'How many pairs does it store for the country column?',
    tables: [
      table('visits', ['visit_id', 'country'], [
        [1, 'DE'],
        [2, 'FR'],
        [3, 'DE'],
        [4, 'NO'],
        [5, 'FR'],
        [6, 'DE'],
        [7, 'NO'],
        [8, 'NO'],
        [9, 'FR'],
        [10, 'DE'],
      ]),
    ],
    answer: '3',
    acceptableAnswers: ['three'],
    unit: 'pairs',
    tempting: [
      { answer: '9', why: 'Nine is the count in arrival order, where the countries keep alternating. Sorting is what joins equal values into runs.' },
      { answer: '10', why: 'Ten is one entry per row, which is no encoding at all.' },
    ],
    explanation:
      'Sorted, the column reads DE x4, FR x3, NO x3: three pairs for ten rows.\n' +
      'In arrival order the same column has nine runs, so the order the rows are written in decides how well a column compresses.',
  },
  {
    id: 'de-layout-5',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_ROW_VS_COLUMN_LAYOUT,
    course: DE,
    question:
      'A payments app looks up one account by account_id and shows all 30 of its fields, about 5,000 times a second, and every payment updates one account row.\n' +
      'Which layout should the accounts table use, and why?',
    decisions: [
      { id: 'row', text: 'A row layout, with an index on account_id', isCorrect: true },
      { id: 'columnar', text: 'A columnar layout, sorted by account_id', isCorrect: false },
      { id: 'columnar-copy', text: 'A columnar copy for the lookups, rebuilt every night', isCorrect: false },
      { id: 'both-files', text: 'Two files per account, one in each layout, kept in step', isCorrect: false },
    ],
    reasons: [
      { id: 'one-place', text: 'A lookup needs every field of one row, and a row file keeps those fields together in one place', isCorrect: true },
      { id: 'compress', text: 'Columnar files compress best, so one account is read from fewer bytes and the lookup is faster', isCorrect: false },
      { id: 'stats', text: 'Row files keep statistics for each column, so a lookup skips every account it does not need', isCorrect: false },
      { id: 'append-only', text: 'Columnar files are append-only, so a table whose rows change has to be a row table', isCorrect: false },
    ],
    explanation:
      'A point lookup touches one row and all of its columns. A row layout finds them side by side; a columnar layout has to fetch a value from each of 30 column chunks.\n' +
      'Compression helps scans, a nightly copy goes stale between payments, and the per-column statistics belong to columnar formats, not row stores.',
  },
  {
    id: 'de-layout-6',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_ROW_VS_COLUMN_LAYOUT,
    course: DE,
    question:
      'An online shop writes its orders one at a time from the app. Every morning analysts also scan three of the 40 order columns across two years, about 600 million rows.\n' +
      'How should the data be stored, and why?',
    decisions: [
      { id: 'two-stores', text: 'Keep orders in a row store for the app and load a columnar copy for analysts nightly', isCorrect: true },
      { id: 'convert', text: 'Convert the app\'s orders table to a columnar layout and point both jobs at that one copy', isCorrect: false },
      { id: 'indexes', text: 'Keep one row table and add an index on each of the three columns the analysts scan', isCorrect: false },
      { id: 'csv', text: 'Export the orders to CSV files each night and let analysts scan the files directly', isCorrect: false },
    ],
    reasons: [
      { id: 'opposite-shapes', text: 'The jobs touch the data in opposite shapes: whole rows one at a time, then a few columns across every row', isCorrect: true },
      { id: 'one-copy', text: 'A columnar table serves both shapes equally well once it has been synced, so one copy is enough', isCorrect: false },
      { id: 'index-scan', text: 'An index makes a scan of one column as cheap as a columnar read, so a second copy costs more than it saves', isCorrect: false },
      { id: 'csv-small', text: 'CSV files are smaller than either layout, so a nightly export reads the fewest bytes', isCorrect: false },
    ],
    explanation:
      'A row store takes single-row writes and whole-row reads; a columnar copy reads three columns across 600 million rows without touching the other 37. Each layout serves one shape, so the common design keeps both and loads the copy on a schedule.\n' +
      'A columnar table takes single-row writes badly, an index on each column still leaves a scan chasing rows, and CSV is a row-by-row text format that is larger, not smaller.',
  },
  {
    id: 'de-layout-7',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_ROW_VS_COLUMN_LAYOUT,
    course: DE,
    language: CodeLanguage.SQL,
    question: 'Put the steps of choosing a layout for a new table in order. Two steps do not belong.',
    correctOrder: [
      'List the columns the main queries read',
      'Note whether each query touches a few rows or most of them',
      'Work out the bytes read: every column for a row file, only the listed ones for a columnar file',
      'Check how the table is written: single rows as they arrive, or large batches',
      'Choose the layout, or a row store plus a columnar copy when both shapes matter',
    ],
    distractorLines: [
      'Pick columnar because the table is large',
      'Pick the layout the team\'s other tables already use',
    ],
    solution: steps([
      'List the columns the main queries read',
      'Note whether each query touches a few rows or most of them',
      'Work out the bytes read: every column for a row file, only the listed ones for a columnar file',
      'Check how the table is written: single rows as they arrive, or large batches',
      'Choose the layout, or a row store plus a columnar copy when both shapes matter',
    ]),
    explanation:
      'The layout follows from what the queries touch and how the data arrives, so both are written down before the choice.\n' +
      'Size alone decides nothing (a large table of point lookups still wants rows), and copying a neighbour\'s layout answers a different table\'s workload.',
  },
  {
    id: 'de-layout-8',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_ROW_VS_COLUMN_LAYOUT,
    course: DE,
    question:
      'The events table holds 10,000,000 rows. Three nightly queries each read the columns listed for them in nightly_queries. Each query reads its own columns from the columnar file; no cache is shared between them, and compression is ignored.\n' +
      'How many MB do the three queries read in total? (1 MB = 1,000,000 bytes)',
    tables: [
      table('event_columns', ['column_name', 'bytes_per_value'], [
        ['event_id', 8],
        ['user_id', 8],
        ['event_type', 4],
        ['ts', 8],
        ['country', 2],
        ['payload', 170],
      ]),
      table('nightly_queries', ['query_id', 'column_name'], [
        [1, 'ts'],
        [1, 'event_type'],
        [2, 'user_id'],
        [2, 'country'],
        [3, 'event_type'],
      ]),
    ],
    answer: '260',
    unit: 'MB',
    tempting: [
      { answer: '6000', why: 'That is the row file: each of the three queries reads all 200 bytes of every row (3 x 200 x 10,000,000).' },
      { answer: '220', why: 'That counts each column once. With no cache shared between the queries, event_type is read by query 1 and again by query 3.' },
    ],
    explanation:
      'The queries read 12, 10 and 4 bytes of each row (ts + event_type, user_id + country, event_type): 26 bytes x 10,000,000 rows = 260 MB.\n' +
      'Row files would read all 200 bytes of every row for each query, 6,000 MB, and the 170-byte payload no query touches is most of it.',
  },
  {
    id: 'de-layout-9',
    type: QuestionType.SPOT_FLAW,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_ROW_VS_COLUMN_LAYOUT,
    course: DE,
    question:
      'Ingest into this table keeps falling behind, and the dashboard query gets slower every day although it reads only three columns.\n' +
      'Click the line that causes it.',
    language: CodeLanguage.SQL,
    lines: [
      '-- events: a columnar table of 40 columns; the dashboard reads 3 of them',
      'CREATE TABLE events (event_id BIGINT, ts TIMESTAMP, event_type VARCHAR /* 37 more columns */)',
      '  USING COLUMNAR;',
      '-- ingest: the app reports each event the moment it happens',
      'INSERT INTO events VALUES (:event_id, :ts, :event_type /* ... */);',
      '-- dashboard',
      'SELECT event_type, COUNT(*) FROM events WHERE ts >= :since GROUP BY event_type;',
    ],
    flawLines: [5],
    note: 'The app sends about 300 events a second, one INSERT call each.',
    explanation:
      'Line 5 writes one row per call. A columnar table has to add a value to each of its 40 column chunks, so a row-at-a-time writer leaves a huge number of tiny chunks, and every scan pays to open them.\n' +
      'Buffer the events and insert them in batches (or land them as row-based files and load them in batches).',
  },
  {
    id: 'de-layout-10',
    type: QuestionType.SPOT_FLAW,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_ROW_VS_COLUMN_LAYOUT,
    course: DE,
    question:
      'This nightly report takes 40 minutes and reads many times more data than it needs.\n' +
      'Click the line that causes it.',
    language: CodeLanguage.PYTHON,
    lines: [
      'import pandas as pd',
      'query = "SELECT * FROM fact_trips WHERE trip_date = :day"',
      'trips = pd.read_sql(query, conn, params={"day": day})',
      'revenue = trips.groupby("city")["fare_cents"].sum()',
      'revenue.to_csv("report.csv")',
    ],
    flawLines: [2],
    note: 'fact_trips is a columnar table with 48 columns. The report uses two of them.',
    explanation:
      'SELECT * asks for all 48 columns, so the columnar file has to read and ship every column chunk of the day when the report uses two.\n' +
      'Name the columns: SELECT city, fare_cents FROM fact_trips WHERE trip_date = :day.',
  },
  {
    id: 'de-layout-11',
    type: QuestionType.EXPLAIN,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_ROW_VS_COLUMN_LAYOUT,
    course: DE,
    question: 'In two or three sentences: why does a columnar file read less than a row file for an analytics query, and what does it cost on writes?',
    keyPoints: [
      'A columnar file keeps each column\'s values together, so a query reads only the columns it names',
      'A row file keeps whole rows together, so it reads every column of every row it scans',
      'One new row adds a value to every column\'s chunk, so columnar files want large batches, not single-row inserts',
    ],
    modelAnswer:
      'A columnar file stores each column\'s values together, so a query that names two columns reads only those two, while a row file reads every column of every row it scans. ' +
      'The price is on writes: one new row has to add a value to every column\'s chunk, so columnar files are fed in large batches rather than one row at a time.',
    explanation: 'The layout decides which bytes a query has to touch: the same data is cheap to scan in one layout and cheap to look up in the other.',
  },
  {
    id: 'de-layout-12',
    type: QuestionType.EXPLAIN,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_ROW_VS_COLUMN_LAYOUT,
    course: DE,
    question: 'In two or three sentences: why do many companies keep both a row store and a columnar copy of the same data, and what does the copy cost them?',
    keyPoints: [
      'The app\'s reads and writes touch whole rows, which a row store serves; analytics touch few columns across most rows, which a columnar copy serves',
      'One layout serves one shape well, so a single store gives up speed on one of the two jobs',
      'The copy has to be loaded and kept in step (a batch load or change feed), so it lags the source and doubles the storage',
    ],
    modelAnswer:
      'The application reads and writes whole rows, which a row store serves, while analytics read a few columns across most rows, which a columnar copy serves; a single layout would slow one of the two jobs. ' +
      'The cost is the copy itself: a load or change feed has to keep it in step, so it lags the source by the load interval and takes extra storage.',
    explanation: 'Separating the stores is the usual reason for a pipeline to exist at all: it moves data from the layout that suits writing to the layout that suits reading.',
  },
];

// ════════════════════════════════════════════════════════════════════════
// File Formats: CSV, JSON, Avro, Parquet
// ════════════════════════════════════════════════════════════════════════

const fileFormats: Question[] = [
  {
    id: 'de-format-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_FILE_FORMATS,
    course: DE,
    question: 'A file format stores its schema inside the file. What does that give a reader?',
    options: [
      { id: 'a', text: 'Each value is checked against the business rules, so a negative price is refused on write', isCorrect: false },
      { id: 'b', text: 'The columns are stored together, so a query reads just the columns it names', isCorrect: false },
      { id: 'c', text: 'An index on the first column, so a lookup by that column skips most of the file', isCorrect: false },
      { id: 'd', text: 'The column names and types come from the file, so every tool reads the same table', isCorrect: true },
    ],
    explanation:
      'An embedded schema (Avro, Parquet, ORC) travels with the data, so a reader needs no guess about the columns and their types. CSV has none, and JSON names its fields but leaves their types loose.\n' +
      'It says nothing about layout (Avro has a schema and is stored row by row) or about business rules; those are separate choices.',
  },
  {
    id: 'de-format-2',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_FILE_FORMATS,
    course: DE,
    question:
      'A CSV file holds the zip column below as text. A reader sees digits in every cell, types the column as an integer, and writes the values back out as text.\n' +
      'How many of the 5 zip codes now differ from what the file held?',
    tables: [
      table('zip_cells', ['row_no', 'zip'], [
        [1, '02134'],
        [2, '10001'],
        [3, '60614'],
        [4, '07030'],
        [5, '94103'],
      ]),
    ],
    answer: '2',
    acceptableAnswers: ['two'],
    unit: 'zip codes',
    tempting: [
      { answer: '0', why: 'Zero would hold if the file said the column is text. A CSV holds no types, so a reader that decides on integer drops the leading zeros.' },
      { answer: '5', why: 'Only the zip codes that start with a zero change: 10001, 60614 and 94103 read back as they were.' },
    ],
    explanation:
      'As integers, 02134 becomes 2134 and 07030 becomes 7030, so two of the five come back different. A CSV cell is only text, and the reader invents the type.\n' +
      'Give the reader the schema (a column list with types), or store the data in a format that carries one.',
  },
  {
    id: 'de-format-3',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_FILE_FORMATS,
    course: DE,
    question:
      'Ten events arrive and are written to a Parquet file by the writer below. The process is killed after the 10th event, before close() runs.\n' +
      'How many rows can a Parquet reader recover from events.parquet?',
    code:
      "writer = ParquetWriter('events.parquet', row_group_rows=4)\n" +
      'for event in events:        # 10 events arrive\n' +
      '    writer.write(event)     # every 4 rows a full row group is written to the file\n' +
      'writer.close()              # writes the footer: schema, row group offsets, statistics',
    language: CodeLanguage.PYTHON,
    answer: '0',
    acceptableAnswers: ['zero', 'none'],
    unit: 'rows',
    tempting: [
      { answer: '8', why: 'The two full row groups are in the file, but a reader finds them through the footer, and the footer is only written by close().' },
      { answer: '10', why: 'The last 2 rows were still in the writer\'s buffer, and without a footer no row can be found anyway.' },
    ],
    explanation:
      'Parquet keeps the schema and the position of every row group in the footer, which is written when the file is closed. A file killed before that has the data bytes but no way to read them.\n' +
      'That is why Parquet is written in batches and finished in one go, not appended to as events arrive.',
  },
  {
    id: 'de-format-4',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_FILE_FORMATS,
    course: DE,
    question:
      'An app appends one JSON record per line to events.jsonl and flushes after each. It is killed while writing event 10, so the last line is cut short.\n' +
      'A reader parses the file line by line and skips any line that is not valid JSON. How many events does it recover?',
    tables: [
      table('events_jsonl', ['line_no', 'line'], [
        [1, '{"id": 1}'],
        [2, '{"id": 2}'],
        [3, '{"id": 3}'],
        [4, '{"id": 4}'],
        [5, '{"id": 5}'],
        [6, '{"id": 6}'],
        [7, '{"id": 7}'],
        [8, '{"id": 8}'],
        [9, '{"id": 9}'],
        [10, '{"id": 10, "ci'],
      ]),
    ],
    answer: '9',
    acceptableAnswers: ['nine'],
    unit: 'events',
    tempting: [
      { answer: '10', why: 'The tenth line stops in the middle of a record, so it is not valid JSON and is skipped.' },
      { answer: '0', why: 'Zero is the Parquet answer. A JSON lines file has no footer: each complete line stands on its own.' },
    ],
    explanation:
      'Lines 1 to 9 are complete records, so the reader keeps them and skips the cut-off tenth.\n' +
      'A row-based text format loses at most the record being written, which is why logs and event streams use it; a footer-based format loses the whole file.',
  },
  {
    id: 'de-format-5',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_FILE_FORMATS,
    course: DE,
    question:
      'Dictionary encoding writes each distinct value of a column once, then one index per row, bit-packed to the fewest bits that can number the dictionary.\n' +
      'The table below describes the columns of a 1,000,000-row file. How many MB do the row indexes of the country column take? (1 MB = 1,000,000 bytes)',
    tables: [
      table('column_stats', ['column_name', 'row_count', 'distinct_values'], [
        ['country', 1000000, 200],
        ['status', 1000000, 5],
        ['user_id', 1000000, 900000],
      ]),
    ],
    answer: '1',
    unit: 'MB',
    tempting: [
      { answer: '8', why: '8 is the bits each row\'s index needs. Over 1,000,000 rows that is 8,000,000 bits, which is 1,000,000 bytes.' },
      { answer: '12', why: '12 MB is what 12-byte country names would take with no dictionary, one full value per row.' },
    ],
    explanation:
      '200 distinct values need 8 bits to number them (2^8 = 256 is the first power of two above 200), so each row\'s index is 1 byte: 1,000,000 rows take 1 MB, plus a dictionary of 200 values.\n' +
      'Encoding works because the column repeats; user_id, with 900,000 distinct values, would gain almost nothing.',
  },
  {
    id: 'de-format-6',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_FILE_FORMATS,
    course: DE,
    question:
      'A partner API returns nested JSON orders. Fields come and go between releases, and analysts will query a handful of fields later. Every response has to be kept exactly as received.\n' +
      'How should the orders land in the lake, and why?',
    decisions: [
      { id: 'jsonl-then-parquet', text: 'Land each response as JSON lines, then convert to Parquet in a scheduled batch job', isCorrect: true },
      { id: 'csv', text: 'Flatten each response to CSV as it arrives and keep only the flattened CSV files', isCorrect: false },
      { id: 'parquet-each', text: 'Write each response to a Parquet file of its own the moment it arrives in the lake', isCorrect: false },
      { id: 'json-only', text: 'Keep the responses as raw JSON files and let the analysts query those files directly', isCorrect: false },
    ],
    reasons: [
      { id: 'raw-then-typed', text: 'JSON lines keeps the response as received and tolerates new fields; Parquet batches give analysts typed columns', isCorrect: true },
      { id: 'csv-nested', text: 'CSV keeps the nested structure as extra columns, so flattening loses none of the data and analysts get a schema', isCorrect: false },
      { id: 'parquet-mid-file', text: 'Parquet accepts fields added mid-file, so writing it straight away saves a conversion step and keeps one copy', isCorrect: false },
      { id: 'json-columnar', text: 'JSON lines is a columnar format, so analysts who read a few fields skip the rest of each record', isCorrect: false },
    ],
    explanation:
      'The raw JSON lines are the record of what the API said, and they accept a new field without a schema change. A scheduled job turns them into Parquet, where analysts get types, columns and small files.\n' +
      'Flattening to CSV loses structure and types for good, a Parquet file per response is a flood of tiny files, and raw JSON is row-based text that every query has to parse in full.',
  },
  {
    id: 'de-format-7',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_FILE_FORMATS,
    course: DE,
    question:
      'Order events flow through a Kafka topic at 2,000 a second and must land in the lake for hourly reports.\n' +
      'Which format goes where, and why?',
    decisions: [
      { id: 'avro-then-parquet', text: 'Avro on the topic with its schema registered, and hourly Parquet files in the lake', isCorrect: true },
      { id: 'parquet-topic', text: 'Parquet on the topic itself, so the lake files can be copied across without any conversion', isCorrect: false },
      { id: 'csv-topic', text: 'CSV on the topic and in the lake, since every consumer and every tool can already read it', isCorrect: false },
      { id: 'json-both', text: 'JSON on the topic and in the lake, so nothing is converted on the way between them', isCorrect: false },
    ],
    reasons: [
      { id: 'append-vs-batch', text: 'A topic delivers one record at a time, which a row format with a schema appends easily; Parquet needs a batch', isCorrect: true },
      { id: 'avro-columnar', text: 'Avro is columnar, so the hourly reports could read just the columns they need straight from the topic', isCorrect: false },
      { id: 'parquet-open', text: 'A Parquet file can be extended while it is open, so records go in as they arrive and the file is ready on the hour', isCorrect: false },
      { id: 'csv-no-drift', text: 'CSV needs no schema, so a consumer cannot fall out of step with the producer when a column is added', isCorrect: false },
    ],
    explanation:
      'A stream hands over single records. Avro appends each one cheaply and carries a schema the producer and consumers agree on; the hourly batch job then writes big, columnar Parquet files for the reports.\n' +
      'Parquet cannot take single records into a file that is being read, CSV has no schema to agree on (so producer changes break consumers silently), and JSON all the way keeps the lake in the larger, slower row text.',
  },
  {
    id: 'de-format-8',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_FILE_FORMATS,
    course: DE,
    language: CodeLanguage.SQL,
    question: 'Put the steps of landing a Kafka topic in the lake as Parquet in order. Two steps do not belong.',
    correctOrder: [
      'Read a batch of Avro records from the topic',
      'Buffer the records until the file reaches its target size or the hour ends',
      'Write the buffered rows as a Parquet file under a temporary name and close it',
      'Move the closed file into the table folder where readers look',
      'Commit the consumer offsets for the records in that file',
    ],
    distractorLines: [
      'Write each record to the Parquet file the moment it arrives',
      'Commit the consumer offsets as soon as the batch has been read',
    ],
    solution: steps([
      'Read a batch of Avro records from the topic',
      'Buffer the records until the file reaches its target size or the hour ends',
      'Write the buffered rows as a Parquet file under a temporary name and close it',
      'Move the closed file into the table folder where readers look',
      'Commit the consumer offsets for the records in that file',
    ]),
    explanation:
      'Records are buffered so that the Parquet file is large, written under a name readers ignore, closed so its footer exists, and only then published; the offsets move last, so a crash replays the batch instead of losing it.\n' +
      'Writing each record as it arrives leaves footer-less or tiny files, and committing offsets first turns a crash into lost records.',
  },
  {
    id: 'de-format-9',
    type: QuestionType.SPOT_FLAW,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_FILE_FORMATS,
    course: DE,
    question:
      'Some days the zip column of the clean customers table comes out as text, on other days as an integer without its leading zeros, and joins on zip break.\n' +
      'Click the line that causes it.',
    language: CodeLanguage.PYTHON,
    lines: [
      'customers = (spark.read',
      '    .option("header", True)',
      '    .option("inferSchema", True)',
      '    .csv("s3://lake/raw/customers/dt=2026-11-03/"))',
      'customers.write.mode("overwrite").parquet("s3://lake/clean/customers/")',
    ],
    flawLines: [3],
    note: 'The raw CSV files hold text only. A zip is a string such as 02134, and some days the file holds no zip that starts with 0.',
    explanation:
      'Line 3 makes the reader guess each column\'s type from the day\'s values: a day with no leading-zero zips looks like an integer, a day with one looks like text. The type then depends on the data.\n' +
      'Pass an explicit schema to the reader (zip as a string), so every day is typed the same, and let the Parquet it writes carry that schema.',
  },
  {
    id: 'de-format-10',
    type: QuestionType.SPOT_FLAW,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_FILE_FORMATS,
    course: DE,
    question:
      'Dashboards reading the orders table sometimes fail with "not a Parquet file: footer missing".\n' +
      'Click the line that causes it.',
    language: CodeLanguage.PYTHON,
    lines: [
      'sink = ParquetWriter("s3://lake/orders/dt=2026-11-03/part-0007.parquet")',
      'for batch in consumer.poll_batches():',
      '    sink.write(batch)',
      'sink.close()   # writes the footer',
    ],
    flawLines: [1],
    note: 'Readers list the dt=2026-11-03 folder and read every .parquet file they find.',
    explanation:
      'Line 1 creates the file in the folder readers scan, so it is visible from the first byte. Until close() on line 4 it has no footer, and a crash means it never gets one.\n' +
      'Write to a temporary name or staging prefix that readers ignore, close it, then move it into the table folder (or commit it through the table format).',
  },
  {
    id: 'de-format-11',
    type: QuestionType.EXPLAIN,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_FILE_FORMATS,
    course: DE,
    question: 'In two or three sentences: why is CSV a poor format to keep typed analytical data in, and when is it still the right choice?',
    keyPoints: [
      'A CSV cell is only text: the file holds no column types, so each reader guesses them and can disagree',
      'It stores row by row as uncompressed text, so a query that needs two columns still scans everything',
      'It is still right for small files that people open or exchange between tools, where simplicity matters more than speed',
    ],
    modelAnswer:
      'A CSV stores only text, so each reader has to guess the column types and can guess differently, and it is row-by-row uncompressed text, so even a two-column query scans the whole file. ' +
      'It is still the right choice for small files that people open in a spreadsheet or hand to another tool, where being readable everywhere matters most.',
    explanation: 'A format is a trade between being easy to read for people and being cheap for machines to scan; CSV sits at the people end.',
  },
  {
    id: 'de-format-12',
    type: QuestionType.EXPLAIN,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_FILE_FORMATS,
    course: DE,
    question: 'In two or three sentences: why do streams usually carry Avro or JSON while the lake holds Parquet, with a batch job in between?',
    keyPoints: [
      'A stream delivers one record at a time, and a row format can append each record to a file as it arrives',
      'Parquet writes its footer when the file is closed and wants large column chunks, so it needs a batch of rows',
      'The batch job buffers records into big files, so the lake gets columnar files with statistics and not millions of tiny ones',
    ],
    modelAnswer:
      'A stream hands over one record at a time, and a row format such as Avro or JSON lines appends each record as it arrives. ' +
      'Parquet writes its footer only when a file is closed and compresses best in large column chunks, so a batch job buffers the records into big files, which gives the lake columnar files with statistics instead of many tiny ones.',
    explanation: 'The two formats suit the two ends of the pipeline, and the batch job in the middle is where one is turned into the other.',
  },
];

// ════════════════════════════════════════════════════════════════════════
// Skipping Data: Stats, Row Groups & Pruning
// ════════════════════════════════════════════════════════════════════════

const dataSkipping: Question[] = [
  {
    id: 'de-skip-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_DATA_SKIPPING,
    course: DE,
    question: 'A Parquet file records the min and max of each column for every row group. When can an engine skip a row group using them?',
    options: [
      { id: 'a', text: 'When the group holds fewer rows than the rest of the file, because small groups can be read last', isCorrect: false },
      { id: 'b', text: 'When the filter value lies outside the group\'s min-to-max range, so no row in it can match', isCorrect: true },
      { id: 'c', text: 'When the filter column is the table\'s primary key, because a key appears in only one group', isCorrect: false },
      { id: 'd', text: 'When an earlier query already read the group, because its answer is cached beside the statistics', isCorrect: false },
    ],
    explanation:
      'If the filter value is below the group\'s min or above its max, nothing in the group can match, and the engine skips it without reading it.\n' +
      'Group size, key columns and caching have no part in it: the decision uses only the range stored for the group.',
  },
  {
    id: 'de-skip-2',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_DATA_SKIPPING,
    course: DE,
    question:
      'The row groups below belong to two Parquet files of a sales table. The query filters on one day.\n' +
      'How many rows does the engine have to read? It skips every row group whose min-to-max range cannot contain the day.',
    tables: [
      table('row_groups', ['file', 'row_group', 'min_day', 'max_day', 'row_count'], [
        ['f1', 1, '2026-11-01', '2026-11-01', 1000],
        ['f1', 2, '2026-11-01', '2026-11-02', 1000],
        ['f1', 3, '2026-11-02', '2026-11-03', 800],
        ['f2', 1, '2026-11-03', '2026-11-03', 1200],
        ['f2', 2, '2026-11-04', '2026-11-05', 1000],
        ['f2', 3, '2026-11-05', '2026-11-06', 500],
      ]),
    ],
    code: "SELECT SUM(amount) FROM sales WHERE sale_day = '2026-11-03';",
    language: CodeLanguage.SQL,
    answer: '2000',
    unit: 'rows',
    tempting: [
      { answer: '1200', why: 'f2 row group 1 is the only group made of 2026-11-03 alone, but f1 row group 3 runs from 11-02 to 11-03 and may hold matching rows too.' },
      { answer: '5500', why: 'That is every row in both files. Three of the six row groups have ranges that rule the day out.' },
    ],
    explanation:
      'Two row groups can contain 2026-11-03: f1 group 3 (11-02 to 11-03, 800 rows) and f2 group 1 (11-03 to 11-03, 1,200 rows). The other four ranges end before the day or start after it.\n' +
      'The engine reads 2,000 of the 5,500 rows. A group on the edge of the range is read, because its range does not rule the day out.',
  },
  {
    id: 'de-skip-3',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_DATA_SKIPPING,
    course: DE,
    question:
      'The events table is partitioned by dt: one folder per day, as listed in files. The query below filters on dt.\n' +
      'How many MB does it read? (Ignore column and row group skipping: it reads each file it has to open in full.)',
    tables: [
      table('files', ['path', 'dt', 'mb'], [
        ['events/dt=2026-11-01/part-0.parquet', '2026-11-01', 120],
        ['events/dt=2026-11-01/part-1.parquet', '2026-11-01', 130],
        ['events/dt=2026-11-02/part-0.parquet', '2026-11-02', 125],
        ['events/dt=2026-11-02/part-1.parquet', '2026-11-02', 110],
        ['events/dt=2026-11-03/part-0.parquet', '2026-11-03', 128],
        ['events/dt=2026-11-03/part-1.parquet', '2026-11-03', 140],
        ['events/dt=2026-11-04/part-0.parquet', '2026-11-04', 122],
        ['events/dt=2026-11-04/part-1.parquet', '2026-11-04', 118],
        ['events/dt=2026-11-05/part-0.parquet', '2026-11-05', 135],
        ['events/dt=2026-11-05/part-1.parquet', '2026-11-05', 105],
      ]),
    ],
    code: "SELECT COUNT(*) FROM events\nWHERE dt BETWEEN '2026-11-03' AND '2026-11-04';",
    language: CodeLanguage.SQL,
    answer: '508',
    unit: 'MB',
    tempting: [
      { answer: '1233', why: 'That is the whole table. The folder names alone rule out the 11-01, 11-02 and 11-05 partitions, before any file is opened.' },
      { answer: '268', why: 'That is the 2026-11-03 folder only. BETWEEN includes both ends, so 2026-11-04 is read too.' },
    ],
    explanation:
      'Partition pruning works on the folder names: only dt=2026-11-03 and dt=2026-11-04 match, so 128 + 140 + 122 + 118 = 508 MB are read and 725 MB are never opened.\n' +
      'The decision needs no statistics and no file reads, which is why a partition filter is the cheapest skip there is.',
  },
  {
    id: 'de-skip-4',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_DATA_SKIPPING,
    course: DE,
    question:
      'The orders below arrive in this order and are written to a Parquet file in row groups of 3 rows. A rewrite job then writes the same rows sorted by order_date (then order_id).\n' +
      'How many row groups does the query read from the rewritten file?',
    tables: [
      table('orders', ['order_id', 'order_date'], [
        [1, '2026-11-03'],
        [2, '2026-11-01'],
        [3, '2026-11-02'],
        [4, '2026-11-02'],
        [5, '2026-11-03'],
        [6, '2026-11-01'],
        [7, '2026-11-01'],
        [8, '2026-11-02'],
        [9, '2026-11-03'],
        [10, '2026-11-03'],
        [11, '2026-11-02'],
        [12, '2026-11-01'],
      ]),
    ],
    code: "SELECT COUNT(*) FROM orders WHERE order_date = '2026-11-03';",
    language: CodeLanguage.SQL,
    answer: '2',
    acceptableAnswers: ['two'],
    unit: 'row groups',
    tempting: [
      { answer: '4', why: 'Four is every row group, which is what the query read before the rewrite: each group held an early, a middle and a late date.' },
      { answer: '1', why: 'Sorting does not line the groups up with the days: groups of 3 against days of 4 rows leave one group straddling 11-02 and 11-03.' },
    ],
    resultTables: [
      table('row group ranges', ['row_group', 'before: min to max', 'after: min to max'], [
        [1, '11-01 to 11-03', '11-01 to 11-01'],
        [2, '11-01 to 11-03', '11-01 to 11-02'],
        [3, '11-01 to 11-03', '11-02 to 11-03'],
        [4, '11-01 to 11-03', '11-03 to 11-03'],
      ]),
    ],
    explanation:
      'In arrival order every row group spans 11-01 to 11-03, so the statistics rule nothing out and all four are read.\n' +
      'Sorted, the ranges are narrow: only group 3 (11-02 to 11-03) and group 4 (11-03 only) can hold 11-03, so two groups are read. Statistics skip data only when the rows are clustered by the filtered column.',
  },
  {
    id: 'de-skip-5',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_DATA_SKIPPING,
    course: DE,
    question:
      'An events table gets about 2 billion rows a day. Almost every query filters on one day, and many also filter on one customer_id out of 50 million.\n' +
      'How should the table be laid out, and why?',
    decisions: [
      { id: 'day-sort-customer', text: 'Partition by day, and sort the rows by customer_id inside each day\'s files', isCorrect: true },
      { id: 'day-and-customer', text: 'Partition by day and by customer_id, so each customer has a folder', isCorrect: false },
      { id: 'customer-only', text: 'Partition by customer_id alone, keeping rows in arrival order inside each folder', isCorrect: false },
      { id: 'stats-only', text: 'Keep one folder, rows in arrival order, and rely on the file statistics', isCorrect: false },
    ],
    reasons: [
      { id: 'few-values-narrow-ranges', text: 'A day has few values, which suits folders; sorting gives each row group a narrow customer_id range to skip on', isCorrect: true },
      { id: 'more-levels', text: 'Each extra partition level cuts the bytes read, and the one-off cost of writing 50 million folders is worth paying', isCorrect: false },
      { id: 'stats-partition-only', text: 'Min and max statistics are kept only for partition columns, so a sort order adds no information to them', isCorrect: false },
      { id: 'hash-skip', text: 'Row groups are skipped by hashing the value, so any order of the rows gives the same skipping in the end', isCorrect: false },
    ],
    explanation:
      'Partition on a column with few values that nearly every query filters (the day). For a high-cardinality filter (customer_id) sort inside the files: each row group then covers a narrow range, and min and max let the engine skip the rest.\n' +
      'A folder per customer means 50 million tiny files, statistics exist for every column of every row group, and skipping is by range, not by hash, so unsorted rows leave every range wide.',
  },
  {
    id: 'de-skip-6',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_DATA_SKIPPING,
    course: DE,
    language: CodeLanguage.SQL,
    question: 'Put the steps of rewriting a table so its common filters skip data in order. Two steps do not belong.',
    correctOrder: [
      'List the filters that the dashboards and reports use most',
      'Pick a filter column with few distinct values, such as the day, as the partition column',
      'Pick the next most used filter column as the sort column inside each file',
      'Rewrite the files: one folder per partition value, rows sorted, files near 128 MB',
      'Run a typical query again and compare the row groups or bytes it reads with before',
    ],
    distractorLines: [
      'Partition by the column with the most distinct values so that each folder is small',
      'Leave the rows in arrival order so each file keeps its natural spread of values',
    ],
    solution: steps([
      'List the filters that the dashboards and reports use most',
      'Pick a filter column with few distinct values, such as the day, as the partition column',
      'Pick the next most used filter column as the sort column inside each file',
      'Rewrite the files: one folder per partition value, rows sorted, files near 128 MB',
      'Run a typical query again and compare the row groups or bytes it reads with before',
    ]),
    explanation:
      'The layout is chosen from the filters people actually use: a low-cardinality one becomes the folders, the next one becomes the sort order, and the result is measured against the same query.\n' +
      'The most distinct values make a folder per value (millions of tiny files), and arrival order leaves every row group\'s range wide.',
  },
  {
    id: 'de-skip-7',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_DATA_SKIPPING,
    course: DE,
    question:
      'The events table is partitioned by load_date, the day each file was written. Late events make the event_date ranges of later files reach back. The min and max in files are all the engine knows about event_date.\n' +
      'The query filters on event_date only. How many files must it read?',
    tables: [
      table('files', ['path', 'load_date', 'min_event_date', 'max_event_date'], [
        ['load_date=2026-11-02/a', '2026-11-02', '2026-11-02', '2026-11-02'],
        ['load_date=2026-11-02/b', '2026-11-02', '2026-11-01', '2026-11-02'],
        ['load_date=2026-11-03/a', '2026-11-03', '2026-11-02', '2026-11-03'],
        ['load_date=2026-11-03/b', '2026-11-03', '2026-11-03', '2026-11-03'],
        ['load_date=2026-11-04/a', '2026-11-04', '2026-11-02', '2026-11-04'],
        ['load_date=2026-11-04/b', '2026-11-04', '2026-11-04', '2026-11-04'],
      ]),
    ],
    code: "SELECT COUNT(*) FROM events WHERE event_date = '2026-11-02';",
    language: CodeLanguage.SQL,
    answer: '4',
    acceptableAnswers: ['four'],
    unit: 'files',
    tempting: [
      { answer: '2', why: 'Two is the files in the load_date=2026-11-02 folder. Folders can be pruned only by a filter on load_date, and late events for 11-02 landed in later folders too.' },
      { answer: '6', why: 'Six is every file. The statistics rule out the two whose event_date range is 11-03 to 11-04 or 11-04 alone.' },
    ],
    explanation:
      'The filter is on event_date, not on the partition column, so no folder can be dropped by its name. The engine falls back on the file statistics and reads the four files whose range contains 2026-11-02: both files of 11-02, load_date 11-03 file a and load_date 11-04 file a.\n' +
      'Late data blurs a partition column that is not the one people filter on, and the skipping that is left depends on how clustered the files are.',
  },
  {
    id: 'de-skip-8',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_DATA_SKIPPING,
    course: DE,
    question:
      'events is partitioned by dt, the day a file was loaded. An analyst needs the last 24 hours of activity and filters WHERE event_ts >= :since. Each run scans about 1 TB although a day of data is 40 GB.\n' +
      'What should change, and why?',
    decisions: [
      { id: 'add-dt-bound', text: 'Add a bound on dt beside the event_ts filter, such as dt >= :since_date', isCorrect: true },
      { id: 'index', text: 'Create an index on event_ts and let the engine use that index for the filter', isCorrect: false },
      { id: 'repartition-minute', text: 'Repartition the table by the minute of event_ts so each minute has its own folder', isCorrect: false },
      { id: 'cache', text: 'Cache the table in memory before the query runs so repeated scans stay fast', isCorrect: false },
    ],
    reasons: [
      { id: 'folders-by-name', text: 'Only a filter on the partition column drops folders by name; an event_ts filter has no folders to drop', isCorrect: true },
      { id: 'engine-converts', text: 'The engine turns an event_ts bound into dt bounds by itself, so the extra filter would only repeat it', isCorrect: false },
      { id: 'fewer-rows', text: 'A tighter filter returns fewer rows, and the engine reads data in proportion to the rows it returns', isCorrect: false },
      { id: 'stats-enough', text: 'Statistics on event_ts already rule out every file that matters, so the scan must be slow for another reason', isCorrect: false },
    ],
    explanation:
      'dt and event_ts are different columns, and nothing tells the engine how they relate (late files carry old events). A bound on dt prunes folders from their names; the event_ts filter then trims what is left.\n' +
      'An index does not exist in a lake of files, a partition per minute would create a flood of tiny files, and caching 1 TB only makes the slow scan hold memory.',
  },
  {
    id: 'de-skip-9',
    type: QuestionType.SPOT_FLAW,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_DATA_SKIPPING,
    course: DE,
    question:
      'Each daily load of this table writes about 2 million files of a few KB. Loads take hours, and listing the table takes minutes.\n' +
      'Click the line that causes it.',
    language: CodeLanguage.SQL,
    lines: [
      'CREATE TABLE events (',
      '  event_id BIGINT, user_id BIGINT, event_date DATE, event_type VARCHAR, payload VARCHAR',
      ')',
      'PARTITIONED BY (user_id)',
      'SORTED BY (event_date)',
      'FORMAT parquet;',
    ],
    flawLines: [4],
    note: 'There are 2 million distinct user_id values, and most queries filter by day.',
    explanation:
      'Line 4 makes a folder for every user_id, so every load writes a small file into each of up to 2 million folders. Folders suit columns with few values.\n' +
      'Partition by event_date (a few hundred folders a year) and sort by user_id inside the files: queries by user still skip row groups by min and max.',
  },
  {
    id: 'de-skip-10',
    type: QuestionType.SPOT_FLAW,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_DATA_SKIPPING,
    course: DE,
    question:
      'This report reads all 400 row groups of the table although it asks for one day.\n' +
      'Click the line that causes it.',
    language: CodeLanguage.SQL,
    lines: [
      '-- fact_orders is sorted by order_date: each row group holds about one day',
      'SELECT user_id, SUM(amount) AS revenue',
      'FROM fact_orders',
      "WHERE CAST(order_date AS VARCHAR) LIKE '2026-11-03%'",
      'GROUP BY user_id;',
    ],
    flawLines: [4],
    note: 'The engine compares a row group\'s min and max with the filter only when the column appears as written.',
    explanation:
      'Line 4 wraps order_date in a CAST and a LIKE, so the engine cannot compare the filter with each group\'s min and max and has to read every group.\n' +
      "Filter on the column itself: WHERE order_date = DATE '2026-11-03' (or a range), and the sorted ranges skip nearly all of the 400 groups.",
  },
  {
    id: 'de-skip-11',
    type: QuestionType.EXPLAIN,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_DATA_SKIPPING,
    course: DE,
    question: 'In two or three sentences: how can an engine answer a filtered query without reading all of the files? Name the levels at which it skips data.',
    keyPoints: [
      'Partition pruning: the folder names (dt=2026-11-03) rule out whole partitions before any file is opened',
      'Statistics: each row group\'s min and max rule out the groups whose range cannot contain the filter value',
      'Column pruning: only the chunks of the columns the query names are read',
    ],
    modelAnswer:
      'First the folder names rule out whole partitions, then the min and max of each row group rule out the groups whose range cannot contain the filter value. ' +
      'Of the groups that remain, only the chunks of the columns the query names are read.',
    explanation: 'Each level removes data before the next one looks at it, so a well laid out table reads a small fraction of its bytes.',
  },
  {
    id: 'de-skip-12',
    type: QuestionType.EXPLAIN,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_DATA_SKIPPING,
    course: DE,
    question: 'In two or three sentences: why do min and max statistics skip almost nothing when rows are in arrival order, and what is the fix for a column with millions of distinct values?',
    keyPoints: [
      'Arrival order mixes early and late values, so every row group\'s min-to-max range is wide and none can be ruled out',
      'Sorting or clustering by the filter column makes each row group\'s range narrow, so most can be skipped',
      'A column with millions of values should be sorted within files, not partitioned, because a folder per value means millions of tiny files',
    ],
    modelAnswer:
      'In arrival order each row group holds early and late values, so its min-to-max range is wide and the filter value falls inside nearly every one. ' +
      'Sorting by the filter column narrows each range so most groups can be skipped; for a column with millions of distinct values do that, not partition, since a folder per value would mean millions of tiny files.',
    explanation: 'Statistics only describe a range: they help exactly as far as the rows are clustered by the column being filtered.',
  },
];

// ════════════════════════════════════════════════════════════════════════
// Object Storage & Small Files
// ════════════════════════════════════════════════════════════════════════

const smallFiles: Question[] = [
  {
    id: 'de-small-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_SMALL_FILES,
    course: DE,
    question: 'In an object store, a path such as lake/orders/dt=2026-11-03/ looks like a folder. What is it?',
    options: [
      { id: 'a', text: 'A directory that holds its objects, so renaming it moves all of them in one step', isCorrect: false },
      { id: 'b', text: 'A bucket inside the bucket, with its own request limits and its own access rules', isCorrect: false },
      { id: 'c', text: 'A prefix shared by the keys of the objects, so listing it pages through keys', isCorrect: true },
      { id: 'd', text: 'An index entry that sends a read straight to that day\'s objects without a listing', isCorrect: false },
    ],
    explanation:
      'An object store is a flat set of keys; lake/orders/dt=2026-11-03/part-0.parquet is one key, and the "folder" is only the text its keys share. Listing it pages through the matching keys.\n' +
      'So there is no directory to rename in one step, no nested bucket, and no index entry to jump to: tools that need a fast file list keep their own.',
  },
  {
    id: 'de-small-2',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_SMALL_FILES,
    course: DE,
    question:
      'Reading an object costs 20 ms to open it plus 1 ms for each MB in it. A scan reads the 5 files below, one after another.\n' +
      'How many ms does the scan take?',
    tables: [
      table('small_files', ['file', 'mb'], [
        ['part-0000', 1],
        ['part-0001', 1],
        ['part-0002', 2],
        ['part-0003', 1],
        ['part-0004', 1],
      ]),
    ],
    answer: '106',
    unit: 'ms',
    tempting: [
      { answer: '26', why: 'That is the cost of the same 6 MB as one file: 20 ms to open it once, plus 6 ms of transfer.' },
      { answer: '6', why: 'Six ms is the transfer alone. Each of the five files also pays its 20 ms to open.' },
    ],
    explanation:
      'Each file pays 20 ms to open plus its MB: (20 + 1) + (20 + 1) + (20 + 2) + (20 + 1) + (20 + 1) = 106 ms.\n' +
      'The same 6 MB in one file would take 26 ms. Most of the time goes to opening files, not to moving bytes.',
  },
  {
    id: 'de-small-3',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_SMALL_FILES,
    course: DE,
    question:
      'A job is configured as below. Nothing ever merges its files.\n' +
      'How many files does a scan of a 30-day month have to open?',
    code:
      'schedule:        hourly      # 24 runs a day\n' +
      'tasks_per_run:   8           # each task writes 1 file into the day\'s folder\n' +
      'compaction:      none',
    answer: '5760',
    unit: 'files',
    tempting: [
      { answer: '720', why: '720 is one file per run (24 x 30). Each of the 8 tasks writes a file of its own in every run.' },
      { answer: '30', why: '30 would be one file per day, which is what a nightly compaction would leave.' },
    ],
    explanation:
      '8 tasks x 24 runs x 30 days = 5,760 files for the month, and each is small because a run\'s data is split 8 ways.\n' +
      'Parallelism and frequent runs multiply the file count; only a compaction step brings it back down.',
  },
  {
    id: 'de-small-4',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_SMALL_FILES,
    course: DE,
    question:
      'A job wrote the 5 objects below under tmp/run-7/ and now "renames" the folder to final/run-7/. An object store has no rename, so the job copies each object to its new key and deletes the old one, in key order. It is killed right after copying the third object.\n' +
      'How many objects does a reader listing final/run-7/ see?',
    tables: [
      table('staging_objects', ['key'], [
        ['tmp/run-7/part-0000'],
        ['tmp/run-7/part-0001'],
        ['tmp/run-7/part-0002'],
        ['tmp/run-7/part-0003'],
        ['tmp/run-7/part-0004'],
      ]),
    ],
    answer: '3',
    acceptableAnswers: ['three'],
    unit: 'objects',
    tempting: [
      { answer: '0', why: 'Zero would hold if a rename were one atomic step, as on a local filesystem. Here every object moves on its own.' },
      { answer: '5', why: 'Five were written, but only the three that were copied have reached final/run-7/.' },
    ],
    explanation:
      'Each object is copied and deleted separately, so the killed job leaves final/run-7/ with 3 of the 5 objects: a partial run that a reader can see.\n' +
      'On an object store, publish a run by writing a manifest or committing a new file list in one step, not by moving objects one at a time.',
  },
  {
    id: 'de-small-5',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_SMALL_FILES,
    course: DE,
    question:
      'A day\'s partition holds the files described in partition_stats. A compaction job rewrites them into files of at most 128 MB, filling each completely before it starts the next.\n' +
      'How many files does the partition hold afterwards?',
    tables: [
      table('partition_stats', ['files', 'avg_mb'], [
        [10000, 2],
      ]),
    ],
    answer: '157',
    unit: 'files',
    tempting: [
      { answer: '156', why: '20,000 MB / 128 is 156.25: the last 32 MB still needs a file of its own, so the count rounds up.' },
      { answer: '79', why: 'That divides the number of files by 128. The 128 MB limit applies to megabytes: 10,000 files of 2 MB are 20,000 MB.' },
    ],
    explanation:
      '10,000 files x 2 MB = 20,000 MB. Divided into files of 128 MB that is 156.25, so 156 full files and one smaller: 157.\n' +
      'The file count falls from 10,000 to 157, and the scan opens a sixty-fourth of the files for the same bytes.',
  },
  {
    id: 'de-small-6',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_SMALL_FILES,
    course: DE,
    question:
      'A dashboard reads the last 7 days of an events table. The table has 90,000 files of about 300 KB, written by a streaming job every minute, and queries spend most of their time listing and opening files.\n' +
      'What should change, and why?',
    decisions: [
      { id: 'compact', text: 'Compact each day\'s files into files of about 128 MB, on a regular schedule', isCorrect: true },
      { id: 'executors', text: 'Add executors to the cluster so that more of the files open at the same time', isCorrect: false },
      { id: 'partition-hour', text: 'Partition the table by hour, so each folder holds fewer files than it does now', isCorrect: false },
      { id: 'csv', text: 'Convert the files to CSV so that each file opens faster than it does as Parquet', isCorrect: false },
    ],
    reasons: [
      { id: 'requests', text: 'The bytes are few; the time goes on a request per file, so fewer, larger files remove most of it', isCorrect: true },
      { id: 'more-workers', text: 'More executors cut the number of requests the store has to serve, so the listing finishes sooner', isCorrect: false },
      { id: 'folder-limit', text: 'A folder limits how many files one query can open, so splitting the table lifts the limit', isCorrect: false },
      { id: 'cache', text: 'Small files fit the engine\'s cache, so reading more of them is faster than reading a few big ones', isCorrect: false },
    ],
    explanation:
      '90,000 files of 300 KB are only about 27 GB. The cost is a request and a piece of metadata per file, so rewriting them as roughly 128 MB files removes most of the work.\n' +
      'More executors open the same number of files, partitioning by hour makes the files fewer per folder but smaller and more numerous in all, and CSV is larger and slower to scan.',
  },
  {
    id: 'de-small-7',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_SMALL_FILES,
    course: DE,
    question:
      'A lake table of 800 GB in 6,400 Parquet files needs about 2% of its rows corrected each night. The rows are spread over 40 days\' partitions, and an object store cannot change a few bytes of an object.\n' +
      'How should the correction be written, and why?',
    decisions: [
      { id: 'new-files-commit', text: 'Write new files for the affected partitions, then switch the table to them in one commit', isCorrect: true },
      { id: 'in-place', text: 'Open each affected object and overwrite just the changed rows inside it, in place', isCorrect: false },
      { id: 'delete-first', text: 'Delete the old files first, then write the corrected files under the same keys', isCorrect: false },
      { id: 'reupload', text: 'Upload the whole 800 GB table again each night under the same keys, replacing it', isCorrect: false },
    ],
    reasons: [
      { id: 'whole-objects', text: 'Objects are replaced whole, and one commit on the file list shows readers the old files or the new, never a mix', isCorrect: true },
      { id: 'in-place-fine', text: 'In-place edits work on an object store, but writing new files makes the change easier to audit afterwards', isCorrect: false },
      { id: 'free-space', text: 'Deleting first frees the space before the new files need it, which keeps the storage bill down for the night', isCorrect: false },
      { id: 'stats-stale', text: 'Re-uploading everything keeps the statistics in step with the data, whereas a partial rewrite leaves them stale', isCorrect: false },
    ],
    explanation:
      'A changed row means a new file holding it, and the table starts to use that file when one commit swaps the list. Until then readers see the old files, and afterwards the new ones; the old files are deleted later.\n' +
      'In-place edits do not exist on an object store, deleting first leaves a window with the data missing, and re-uploading 800 GB to change 2% costs hours and the same missing window.',
  },
  {
    id: 'de-small-8',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_SMALL_FILES,
    course: DE,
    language: CodeLanguage.SQL,
    question: 'Put the steps of compacting a day\'s small files safely in order. Two steps do not belong.',
    correctOrder: [
      'List the small files in the partition',
      'Read them and write their rows into new files of about 128 MB under new names',
      'Check that the new files hold the same number of rows as the old ones',
      'Switch the table to the new files in one commit',
      'Delete the old files once the readers using them have finished',
    ],
    distractorLines: [
      'Delete the small files first so that no row is counted twice',
      'Overwrite each small file with its share of the merged rows',
    ],
    solution: steps([
      'List the small files in the partition',
      'Read them and write their rows into new files of about 128 MB under new names',
      'Check that the new files hold the same number of rows as the old ones',
      'Switch the table to the new files in one commit',
      'Delete the old files once the readers using them have finished',
    ]),
    explanation:
      'The merged files are written beside the old ones and checked, then one commit moves readers from the old set to the new, and only later are the old files deleted.\n' +
      'Deleting first leaves a window with the data missing, and overwriting files in place is not possible on an object store.',
  },
  {
    id: 'de-small-9',
    type: QuestionType.SPOT_FLAW,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_SMALL_FILES,
    course: DE,
    question:
      'Each day\'s folder of this table holds 40,000 device sub-folders with a handful of 20 KB files in each, and queries slow down a little more every day.\n' +
      'Click the line that causes it.',
    language: CodeLanguage.PYTHON,
    lines: [
      'events = spark.readStream.format("kafka").load()',
      'events.writeStream \\',
      '    .format("parquet") \\',
      '    .partitionBy("event_date", "device_id") \\',
      '    .trigger(processingTime="10 seconds") \\',
      '    .start("s3://lake/events/")',
    ],
    flawLines: [4],
    note: 'There are 40,000 devices, and queries filter by day and rarely by one device.',
    explanation:
      'Line 4 adds device_id to the partition columns, so every trigger writes a small file into each device\'s folder. Folders suit columns with few values.\n' +
      'Partition by event_date only, trigger less often, and compact each finished day into large files.',
  },
  {
    id: 'de-small-10',
    type: QuestionType.SPOT_FLAW,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_SMALL_FILES,
    course: DE,
    question:
      'One night the compaction job was killed and the 2026-11-03 partition was left empty until its events were rebuilt from Kafka.\n' +
      'Click the line that causes it.',
    language: CodeLanguage.PYTHON,
    lines: [
      'prefix = "s3://lake/events/dt=2026-11-03/"',
      'old_files = list_objects(prefix)',
      'rows = read_parquet(old_files)',
      'delete_objects(old_files)',
      'write_parquet(rows, prefix + "compacted-0001.parquet")',
    ],
    flawLines: [4],
    note: 'The job holds the rows in memory between reading and writing.',
    explanation:
      'Line 4 deletes the old files before the new one exists. A kill between lines 4 and 5 loses the data, because the only copy was in the job\'s memory.\n' +
      'Write the compacted files first, check them, switch the table to them in one commit, and delete the old files only after that.',
  },
  {
    id: 'de-small-11',
    type: QuestionType.EXPLAIN,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_SMALL_FILES,
    course: DE,
    question: 'In two or three sentences: why does a table of many small files scan slowly even when its total size is small, and what does compaction trade for the fix?',
    keyPoints: [
      'Each file costs a request and its own metadata whatever its size, so the cost grows with the file count',
      'Listing a prefix pages through every key, which is slow for millions of objects',
      'Compaction rewrites many small files into a few large ones, at the cost of a rewrite job that must not disturb readers',
    ],
    modelAnswer:
      'Every file costs a request and its own metadata however small it is, and listing a prefix pages through all its keys, so the time grows with the number of files and not with the bytes. ' +
      'Compaction rewrites many small files into a few large ones, which fixes the scan but needs a rewrite job that must not disturb the readers.',
    explanation: 'The unit of cost on an object store is the file, not the byte, so the aim is large files that are still pruned well.',
  },
  {
    id: 'de-small-12',
    type: QuestionType.EXPLAIN,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_SMALL_FILES,
    course: DE,
    question: 'In two or three sentences: an object store can only replace whole objects. How can a table on it still take updates and deletes safely?',
    keyPoints: [
      'A changed row means writing a new file that holds it; the old file is never edited',
      'One commit switches the table\'s list of files, so a reader sees the old set or the new set, never a mix',
      'The old files stay until their readers finish and are deleted later, by a separate cleanup',
    ],
    modelAnswer:
      'A changed row is written into a new file, because an old object cannot be edited. ' +
      'The table then switches its list of files in one commit, so a reader sees the old set or the new set and never a mix, and the old files are deleted later, once their readers are done.',
    explanation: 'The commit on the file list stands in for the atomic rename and in-place edit that the store does not have.',
  },
];

export const dataEngineeringStorageFilesQuestions: Question[] = [
  ...rowVsColumnLayout,
  ...fileFormats,
  ...dataSkipping,
  ...smallFiles,
];
