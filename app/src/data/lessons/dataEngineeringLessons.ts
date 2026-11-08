/**
 * Data Engineering lessons, one per topic, in course order.
 *
 * Section Storage & Files (the second rewritten section) comes first on the
 * path, then Warehouses, Lakes & Table Formats (the third), then Moving Data
 * (the first section of the decisions-and-designs rewrite), then Modeling
 * for Analytics (the fourth), then Streaming (the fifth), then Distributed
 * Data (the sixth), and then Running Pipelines (the seventh): every topic of
 * each. Each rule card teaches the decision
 * rule as its form and works one scenario on small tables; the SQL is T-SQL that
 * check-lessons.js runs on sql.js. MERGE is not run there, so the worked
 * examples replace by key with DELETE and INSERT, and the idea names MERGE.
 *
 * Prose keeps one sentence per source line (`lines`).
 */
import { CodeLanguage, Topic, TopicLesson } from '../../types';

/** One paragraph from its sentences, one per source line. */
const lines = (...sentences: string[]) => sentences.join('\n');

export const dataEngineeringLessons: TopicLesson[] = [
  {
    id: 'de_row_vs_column_layout/1',
    topicKeys: [Topic.DE_ROW_VS_COLUMN_LAYOUT],
    step: 1,
    title: 'Rows vs Columns',
    idea: [
      lines(
        'A table is saved either row by row or column by column.',
        'A row file keeps one row\'s fields together; a columnar file keeps each column\'s values together, in a chunk of its own.',
      ),
      lines(
        'A query reads whole blocks, so the layout decides which bytes it has to touch.',
        'Reading a few columns of many rows is cheap in a columnar file, which skips the other columns, and the repeated values of one column compress well.',
        'Reading or writing one whole row is cheap in a row file, because its fields are side by side.',
      ),
      lines(
        'So ask what the queries touch, not which layout is faster.',
        'Work it out as bytes: a row file reads every column of each row it scans, a columnar file only the columns the query names.',
        'A columnar file also pays on writes, since a new row adds a value to every column chunk.',
      ),
    ],
    form: {
      language: CodeLanguage.SQL,
      code: `-- what do the queries touch?
a few columns of most rows (scans)  -> columnar
whole rows, one at a time (lookups) -> row
both on the same data               -> row + columnar copy
-- bytes a scan reads
row file       = all columns x rows
columnar file  = named columns x rows`,
    },
    pitfall: lines(
      '"Columnar is faster" means nothing without the query.',
      'A lookup of one row, or a SELECT * on a columnar file, touches every column and gets the slow side of it, and a stream of single-row inserts leaves a chunk per column per row.',
    ),
    worked: {
      language: CodeLanguage.SQL,
      tables: [
        {
          name: 'trip_columns',
          columns: ['column_name', 'bytes_per_value', 'in_report'],
          rows: [
            ['trip_id', 8, 0],
            ['city', 12, 1],
            ['fare_cents', 8, 1],
            ['pickup_ts', 8, 0],
            ['rider_note', 100, 0],
          ],
        },
      ],
      code: `-- Fares by city over 1,000 trips: bytes read per layout.
SELECT 'row file' AS layout,
       SUM(bytes_per_value) * 1000 AS bytes_read
FROM trip_columns
UNION ALL
SELECT 'columnar file', SUM(bytes_per_value) * 1000
FROM trip_columns WHERE in_report = 1
ORDER BY bytes_read;

-- One whole trip: places read per layout.
SELECT 'row file' AS layout, 1 AS places_read
UNION ALL
SELECT 'columnar file', COUNT(*) FROM trip_columns
ORDER BY places_read;`,
      steps: [
        'Lines 2-4: a row file reads every column of every trip, 136 bytes x 1,000 trips = 136,000 bytes.',
        'Lines 6-7: a columnar file reads only the two columns the report uses, city and fare_cents: 20 bytes x 1,000 = 20,000 bytes.',
        'Line 11: fetching one trip from a row file is a single place, because its fields are side by side.',
        'Line 13: in a columnar file the same trip is spread over one chunk per column, so 5 places are read.',
        'The report reads about 7 times fewer bytes in the columnar file, while the lookup reads 5 places instead of 1: neither layout wins both.',
      ],
      output: `layout | bytes_read
columnar file | 20000
row file | 136000

layout | places_read
row file | 1
columnar file | 5`,
    },
    exercises: ['de-layout-1', 'de-layout-2', 'de-layout-3', 'de-layout-4', 'de-layout-5'],
  },
  {
    id: 'de_file_formats/1',
    topicKeys: [Topic.DE_FILE_FORMATS],
    step: 1,
    title: 'File Formats: CSV, JSON, Avro, Parquet',
    idea: [
      lines(
        'A file format decides how a table\'s values become bytes: text or binary, row by row or column by column, and whether the schema is stored in the file.',
        'CSV is text, row by row, with no types: any tool opens it, and every tool guesses what each column is.',
        'JSON lines is text too, one record per line with its field names, so it holds nested and changing records and is easy to append to.',
      ),
      lines(
        'Avro is binary and row-based with its schema in the file, so it appends one record at a time, which is why streams use it.',
        'Parquet is binary and columnar, with the schema, statistics and row group positions in a footer written when the file is closed: it is built to be scanned, and to be written in batches.',
      ),
      lines(
        'Binary formats also encode their columns: a column with few distinct values becomes a small dictionary plus an index per row, and sorted repeated values become (value, count) runs.',
      ),
    ],
    form: {
      language: CodeLanguage.SQL,
      code: `small files people open  -> CSV
nested, changing records  -> JSON lines
a stream of records       -> Avro (schema inside)
scans of a few columns    -> Parquet (footer)`,
    },
    pitfall: lines(
      'A CSV carries no types, so a reader that infers them turns 02134 into 2134, and a different day can infer differently.',
      'A Parquet file written one record at a time has no footer until it is closed, so a crash leaves bytes nobody can read.',
    ),
    worked: {
      language: CodeLanguage.SQL,
      tables: [
        {
          name: 'csv_cells',
          columns: ['row_no', 'sku'],
          rows: [
            [1, '00415'],
            [2, '88100'],
            [3, '00007'],
            [4, '31220'],
          ],
        },
      ],
      code: `-- A reader sees digits in every cell and types sku as an integer.
SELECT row_no, sku AS in_file,
  CAST(sku AS INT) AS typed_as_integer,
  CASE WHEN CAST(CAST(sku AS INT) AS VARCHAR(10)) = sku
       THEN 'same' ELSE 'changed' END AS written_back
FROM csv_cells
ORDER BY row_no;`,
      steps: [
        'Line 1: the file holds text only; nothing in a CSV says that sku is a code and not a number.',
        'Line 3: the reader decides that every cell is digits and types the column as an integer, so 00415 becomes 415 and 00007 becomes 7.',
        'Lines 4-5: written back as text, those two rows no longer match the file, while 88100 and 31220 survive.',
        'The fix is outside the query: give the reader the schema (sku as text), or store the data in Avro or Parquet, where the schema is inside the file.',
      ],
      output: `row_no | in_file | typed_as_integer | written_back
1 | 00415 | 415 | changed
2 | 88100 | 88100 | same
3 | 00007 | 7 | changed
4 | 31220 | 31220 | same`,
    },
    exercises: ['de-format-1', 'de-format-2', 'de-format-3', 'de-format-5', 'de-format-6'],
  },
  {
    id: 'de_data_skipping/1',
    topicKeys: [Topic.DE_DATA_SKIPPING],
    step: 1,
    title: 'Skipping Data: Stats, Row Groups & Pruning',
    idea: [
      lines(
        'A fast query reads less, and a well laid out table lets the engine rule data out before it reads it, at three levels.',
        'Partition pruning: files sit in folders named by a column (`dt=2026-11-03`), and a filter on that column drops whole folders from their names alone.',
        'Statistics: each row group records the min and max of every column, and the engine skips a group whose range cannot contain the filter value.',
        'Column pruning: only the chunks of the columns the query names are read.',
      ),
      lines(
        'Statistics help only when the rows are clustered by the filtered column: in arrival order every group spans the whole range and nothing is skipped.',
        'So the layout is a decision: a column with few values that most queries filter becomes the partition, and the next filter column becomes the sort order inside the files.',
      ),
    ],
    form: {
      language: CodeLanguage.SQL,
      code: `few values (day, region)  -> partition by it
many values (user_id)     -> sort by it inside files
skip a row group when filter < min or > max
filter the column as written: no CAST around it`,
    },
    pitfall: lines(
      'Partitioning by a column with millions of values writes a tiny file per value.',
      'Rows in arrival order, or a filter wrapped in a function, leave every min-to-max range wide or unusable, and the query reads everything.',
    ),
    worked: {
      language: CodeLanguage.SQL,
      tables: [
        {
          name: 'rg_arrival',
          columns: ['row_group', 'min_day', 'max_day'],
          rows: [
            [1, '2026-11-01', '2026-11-06'],
            [2, '2026-11-01', '2026-11-05'],
            [3, '2026-11-02', '2026-11-06'],
            [4, '2026-11-01', '2026-11-06'],
            [5, '2026-11-02', '2026-11-06'],
            [6, '2026-11-01', '2026-11-04'],
          ],
        },
        {
          name: 'rg_sorted',
          columns: ['row_group', 'min_day', 'max_day'],
          rows: [
            [1, '2026-11-01', '2026-11-01'],
            [2, '2026-11-01', '2026-11-02'],
            [3, '2026-11-02', '2026-11-03'],
            [4, '2026-11-03', '2026-11-04'],
            [5, '2026-11-04', '2026-11-05'],
            [6, '2026-11-05', '2026-11-06'],
          ],
        },
      ],
      code: `-- Filter: sale_day = '2026-11-02'. Row groups read, per layout.
SELECT 'arrival order' AS layout,
  SUM(CASE WHEN min_day <= '2026-11-02'
            AND max_day >= '2026-11-02' THEN 1 ELSE 0 END) AS groups_read,
  SUM(CASE WHEN min_day <= '2026-11-02'
            AND max_day >= '2026-11-02' THEN 0 ELSE 1 END) AS groups_skipped
FROM rg_arrival
UNION ALL
SELECT 'sorted by day',
  SUM(CASE WHEN min_day <= '2026-11-02'
            AND max_day >= '2026-11-02' THEN 1 ELSE 0 END),
  SUM(CASE WHEN min_day <= '2026-11-02'
            AND max_day >= '2026-11-02' THEN 0 ELSE 1 END)
FROM rg_sorted
ORDER BY groups_read DESC;`,
      steps: [
        'Lines 2-7: in arrival order each row group holds early and late days, so every min-to-max range contains 2026-11-02 and all 6 groups are read.',
        'Lines 9-14: the same rows sorted by day give narrow ranges, and only groups 2 and 3 can contain 2026-11-02.',
        'Lines 12-13: the other 4 groups are skipped from their statistics alone, without being read.',
        'Same data, same query, same engine: the sort order decided how much could be skipped.',
      ],
      output: `layout | groups_read | groups_skipped
arrival order | 6 | 0
sorted by day | 2 | 4`,
    },
    exercises: ['de-skip-1', 'de-skip-2', 'de-skip-3', 'de-skip-4', 'de-skip-5'],
  },
  {
    id: 'de_small_files/1',
    topicKeys: [Topic.DE_SMALL_FILES],
    step: 1,
    title: 'Object Storage & Small Files',
    idea: [
      lines(
        'An object store keeps objects under keys in a bucket, reached over the network.',
        'It has no real folders (a "folder" is a prefix its keys share), and an object is replaced whole, never edited.',
      ),
      lines(
        'Every file read pays a fixed cost, a request and its metadata, whatever its size.',
        'So the cost of a scan is the number of files x the per-file overhead, plus the bytes over the throughput.',
        'Many small files (a stream that writes every minute, a job with many tasks, a partition per user) make the overhead the whole cost; aim for files of roughly 128 MB to 1 GB.',
      ),
      lines(
        'With no rename or in-place edit, a change is made by writing new files and switching the table to them in one commit.',
        'Compaction does the same: it rewrites many small files into a few large ones.',
      ),
    ],
    form: {
      language: CodeLanguage.SQL,
      code: `scan cost = files x overhead + bytes / throughput
files of 128 MB - 1 GB   -> overhead is a small share
many small files appear  -> compact them on a schedule
change some rows         -> new files, one commit
never edit in place, delete first, or "rename" a folder`,
    },
    pitfall: lines(
      'Compacting by deleting the small files first, or writing into a folder that readers are scanning, shows them an empty or half-written table.',
      'Write the merged files first, switch to them in one commit, and delete the old files last.',
    ),
    worked: {
      language: CodeLanguage.SQL,
      tables: [
        {
          name: 'lake_files',
          columns: ['file', 'mb'],
          rows: [
            ['part-0000', 1],
            ['part-0001', 2],
            ['part-0002', 1],
            ['part-0003', 1],
            ['part-0004', 3],
            ['part-0005', 1],
            ['part-0006', 2],
            ['part-0007', 1],
          ],
        },
      ],
      code: `-- Cost model: 20 ms to open a file plus 1 ms per MB.
SELECT 'small files' AS layout, COUNT(*) AS files, SUM(mb) AS total_mb,
       SUM(20 + mb) AS read_ms
FROM lake_files
UNION ALL
SELECT 'compacted', 1, SUM(mb), 20 + SUM(mb)
FROM lake_files
ORDER BY read_ms DESC;`,
      steps: [
        'Lines 2-4: each of the 8 files pays 20 ms to open plus its MB, so the 12 MB take 8 x 20 + 12 = 172 ms.',
        'Lines 6-7: compaction rewrites the same 12 MB as one file, which pays the 20 ms once: 32 ms.',
        'The bytes are identical; the 140 ms difference is the opening of 7 files that no longer exist.',
        'The rewrite is written beside the old files and switched in by one commit, so a reader never sees a table with files missing.',
      ],
      output: `layout | files | total_mb | read_ms
small files | 8 | 12 | 172
compacted | 1 | 12 | 32`,
    },
    exercises: ['de-small-1', 'de-small-2', 'de-small-3', 'de-small-4', 'de-small-6'],
  },
  {
    id: 'de_workloads_systems/1',
    topicKeys: [Topic.DE_WORKLOADS_SYSTEMS],
    step: 1,
    title: 'Workloads & Systems: Warehouse, Lake, Lakehouse',
    idea: [
      lines(
        'Two workloads touch data in opposite ways.',
        'OLTP is the app: many small reads and writes of a few rows each, answered in milliseconds, on the current state.',
        'OLAP is analysis: a few large queries over many rows and a few columns, often over years of history.',
      ),
      lines(
        'A warehouse is a managed database for analytics: it checks data against a schema as it is loaded (schema on write) and keeps tables in its own format.',
        'A lake is files in object storage: cheap, any format, open to every engine, with a schema applied only when the data is read (schema on read).',
        'A folder of files is not a table, though: nothing in it says which files are finished, so a reader can see a job half done.',
      ),
      lines(
        'A lakehouse is a lake plus a table format, a log of commits beside the files that gives each table atomic writes, a schema and versions.',
        'So warehouse-style SQL, updates and deletes run on one copy of open files, and storage and compute are paid for apart.',
      ),
      lines(
        'Every system after the first is a copy: it needs a pipeline and lags behind the app, so add one only when a workload needs it.',
      ),
    ],
    form: {
      language: CodeLanguage.SQL,
      code: `few rows, reply in ms (the app)             -> OLTP database
typed tables, SQL reports                   -> warehouse (schema on write)
raw files of any shape, kept cheaply        -> lake (schema on read)
tables on open files, many engines, updates -> lakehouse (lake + table format)
analytics on the app's database: only while it is small`,
    },
    pitfall: lines(
      'A plain lake folder read as if it were a table: the reader lists the files while a job is still writing and counts rows that are not finished.',
      'Analytics on the app\'s primary database: one large scan competes with every checkout for disk, memory and CPU.',
    ),
    worked: {
      language: CodeLanguage.SQL,
      tables: [
        {
          name: 'workloads',
          columns: ['workload', 'rows_per_query', 'reply_needed', 'data_kind', 'engines'],
          rows: [
            ['checkout writes an order', 1, 'ms', 'typed rows', 1],
            ['monthly revenue report', 40000000, 'minutes', 'typed tables', 1],
            ['raw clickstream kept a year', 900000000, 'hours', 'raw files', 1],
            ['churn model and BI on one table', 60000000, 'minutes', 'typed tables', 3],
          ],
        },
      ],
      code: `-- The decision rule, applied to each workload in turn.
SELECT workload,
  CASE
    WHEN reply_needed = 'ms' THEN 'OLTP database'
    WHEN data_kind = 'raw files' THEN 'lake'
    WHEN engines > 1 THEN 'lakehouse'
    ELSE 'warehouse'
  END AS system
FROM workloads
ORDER BY rows_per_query;`,
      steps: [
        'Line 4: checkout touches one row and must answer in milliseconds, so it stays on the OLTP database, however large the table grows.',
        'Line 5: the raw clickstream is kept as it came and read rarely, so it lands in the lake and gets its schema when it is read.',
        'Line 6: the churn table is typed and read by three engines (SQL, Spark and notebooks), so it lives on open files with a table format, as a lakehouse table.',
        'Line 7: the revenue report reads typed tables with SQL alone, so a warehouse fits, and a lakehouse table would serve it as well.',
        'The order of the WHEN lines matters: the app\'s latency is checked first, because no analytics store answers a checkout in milliseconds.',
      ],
      output: `workload | system
checkout writes an order | OLTP database
monthly revenue report | warehouse
churn model and BI on one table | lakehouse
raw clickstream kept a year | lake`,
    },
    exercises: ['de-workload-1', 'de-workload-2', 'de-workload-3', 'de-workload-4', 'de-workload-5'],
  },
  {
    id: 'de_table_format_log/1',
    topicKeys: [Topic.DE_TABLE_FORMAT_LOG],
    step: 1,
    title: 'Table Formats: Log, Snapshots & Concurrent Writers',
    idea: [
      lines(
        'A table format (Delta Lake, Apache Iceberg, Apache Hudi) turns a folder of Parquet files into a table by keeping a log beside them.',
        'Each commit is a numbered version that lists the files it added and the files it removed.',
        'The table at version v is every file added up to v and not removed by then; any other file in the folder is not in the table.',
      ),
      lines(
        'A writer writes its data files first, under new names, and then commits by creating the next entry of the log.',
        'A reader picks a version when it starts and reads exactly that version\'s files, so it never sees half a commit.',
        'An older version can be read again later (time travel), for as long as its files are kept.',
      ),
      lines(
        'Two writers can race for the same version: the store lets only one of them create the entry, and the loser re-reads the winning commits.',
        'If they changed nothing it read, it retries as the next version; if they removed a file it read, it fails and has to run again.',
      ),
    ],
    form: {
      language: CodeLanguage.SQL,
      code: `table at v    = files added in commits <= v, minus files removed by then
reader        -> pick one version, read only its files
writer        -> write new files, then create log entry v+1 if it is free
lost the race -> re-read: no overlap, retry as v+2; overlap, fail
a file no version lists -> not in the table`,
    },
    pitfall: lines(
      'Reading or cleaning a table by listing its folder goes around the log.',
      'The folder holds removed files kept for old versions and files of writes that never committed, so a folder reader counts rows twice, and a file deleted by hand breaks the versions that still need it.',
    ),
    worked: {
      language: CodeLanguage.SQL,
      tables: [
        {
          name: 'table_log',
          columns: ['version', 'action', 'file', 'row_count'],
          rows: [
            [0, 'add', 'f1', 100],
            [0, 'add', 'f2', 100],
            [1, 'add', 'f3', 80],
            [2, 'remove', 'f1', null],
            [2, 'add', 'f4', 95],
            [3, 'remove', 'f2', null],
            [3, 'remove', 'f3', null],
            [3, 'add', 'f5', 180],
          ],
        },
      ],
      code: `-- The table as of version 3: files added and not yet removed.
SELECT a.file, a.row_count
FROM table_log a
WHERE a.action = 'add' AND a.version <= 3
  AND NOT EXISTS (SELECT 1 FROM table_log r
                  WHERE r.action = 'remove' AND r.file = a.file AND r.version <= 3)
ORDER BY a.file;

-- Time travel: the same question as of version 1.
SELECT a.file, a.row_count
FROM table_log a
WHERE a.action = 'add' AND a.version <= 1
  AND NOT EXISTS (SELECT 1 FROM table_log r
                  WHERE r.action = 'remove' AND r.file = a.file AND r.version <= 1)
ORDER BY a.file;`,
      steps: [
        'Version 2 is an update: it removed f1 and added f4, the same rows with 5 of them deleted.',
        'Version 3 is a compaction: it removed f2 and f3 and added f5, which holds their 180 rows in one file.',
        'Lines 2-7: as of version 3 the table is f4 and f5, 275 rows, although all five files are still in the folder.',
        'Lines 10-15: as of version 1 the table is f1, f2 and f3, 280 rows, and it can still be read because nothing has deleted those files yet.',
      ],
      output: `file | row_count
f4 | 95
f5 | 180

file | row_count
f1 | 100
f2 | 100
f3 | 80`,
    },
    exercises: ['de-snapshot-1', 'de-snapshot-2', 'de-snapshot-3', 'de-snapshot-4', 'de-snapshot-5'],
  },
  {
    id: 'de_updating_files/1',
    topicKeys: [Topic.DE_UPDATING_FILES],
    step: 1,
    title: 'Updating Files: Copy-on-Write, Merge-on-Read & Cleanup',
    idea: [
      lines(
        'Data files are never edited: changing a row means writing new files and committing a version that swaps them in.',
        'There are two ways to do it, and they differ in who pays for the change.',
      ),
      lines(
        'Copy-on-write (CoW) rewrites every file that holds a changed row, whole, so the writer pays and readers see plain files.',
        'Merge-on-read (MoR) writes only the change, a small delete file that marks the old rows plus the rows\' new versions, and every reader merges them with the base files.',
        'Compaction later rewrites the base files with the changes applied, which brings the read cost back down.',
      ),
      lines(
        'A file that a commit removes stays on storage, because older versions and readers that started earlier still use it.',
        'Cleanup (vacuum, expire snapshots) deletes the files that no version inside the retention needs.',
        'The retention trades time travel and safety for running jobs against the cost of storage.',
      ),
    ],
    form: {
      language: CodeLanguage.SQL,
      code: `rare updates, many reads   -> copy-on-write
frequent small updates     -> merge-on-read + scheduled compaction
copy-on-write write = every file holding a changed row, whole
merge-on-read read  = base files + every change file since compaction
cleanup: delete files removed before the retention, never newer ones`,
    },
    pitfall: lines(
      'A delete or a compaction only adds a version: the old files, and the deleted rows in them, stay on storage until cleanup.',
      'Setting the retention near zero deletes files that a running job or yesterday\'s version still reads.',
    ),
    worked: {
      language: CodeLanguage.SQL,
      tables: [
        {
          name: 'data_files',
          columns: ['file', 'row_count', 'rows_changed'],
          rows: [
            ['f1', 1000, 2],
            ['f2', 1000, 0],
            ['f3', 1000, 5],
            ['f4', 1000, 0],
          ],
        },
      ],
      code: `-- An update changes 7 rows, spread over f1 and f3.
SELECT 'CoW' AS strategy,
       SUM(CASE WHEN rows_changed > 0 THEN row_count ELSE 0 END) AS rows_written,
       COUNT(*) AS files_read_per_scan
FROM data_files
UNION ALL
SELECT 'MoR',
       2 * SUM(rows_changed),
       COUNT(*) + SUM(CASE WHEN rows_changed > 0 THEN 1 ELSE 0 END) + 1
FROM data_files
ORDER BY strategy;`,
      steps: [
        'Lines 2-5: CoW rewrites f1 and f3 whole, 2,000 rows written to change 7, and a scan still reads 4 plain files.',
        'Lines 7-8: MoR writes 7 delete entries and the 7 new row versions, 14 rows in all.',
        'Line 9: its scan reads the 4 base files, a delete file for each of the 2 touched files, and the 1 file of new versions, 7 files to merge.',
        'A compaction would fold the changes into new copies of f1 and f3 and bring the scan back to 4 files, while the old files wait for cleanup.',
      ],
      output: `strategy | rows_written | files_read_per_scan
CoW | 2000 | 4
MoR | 14 | 7`,
    },
    exercises: ['de-rewrite-1', 'de-rewrite-2', 'de-rewrite-3', 'de-rewrite-4', 'de-rewrite-5'],
  },
  {
    id: 'de_schema_evolution/1',
    topicKeys: [Topic.DE_SCHEMA_EVOLUTION],
    step: 1,
    title: 'Schema Enforcement & Evolution',
    idea: [
      lines(
        'A table keeps its schema in its metadata, and enforcing it means that a write which does not match is refused as a whole, before it is committed.',
        'A folder of plain files has no such check: each file can differ, and the reader finds out at query time.',
      ),
      lines(
        'Evolving a schema is changing it on purpose.',
        'Some changes touch only the metadata and are safe for every reader: adding a nullable column (old files read NULL) and widening a type (INT to BIGINT).',
        'Renaming, dropping, narrowing or retyping a column breaks the readers that use it, so it is done by adding a new column, moving the readers, and dropping the old column last.',
      ),
      lines(
        'Schema drift is a source changing its structure without telling anyone.',
        'A pipeline that infers each batch\'s schema and merges whatever arrives lets drift in silently, so check each batch against a declared schema and hold back the ones that do not match.',
      ),
    ],
    form: {
      language: CodeLanguage.SQL,
      code: `add a nullable column         -> safe: old rows read NULL
widen a type (INT -> BIGINT)  -> safe: every value still fits
rename, drop, narrow, retype  -> add a new column, move readers, drop last
a batch that does not match   -> refuse or quarantine it, and alert
never: infer and merge whatever the source sends`,
    },
    pitfall: lines(
      'Automatic schema merge turns a renamed field into a new column and fills the old one with NULL.',
      'Every load succeeds and row counts look normal, while the reports that sum the old column quietly fall.',
    ),
    worked: {
      language: CodeLanguage.SQL,
      tables: [
        {
          name: 'orders',
          columns: ['order_id', 'load_day', 'amount', 'amount_cents'],
          rows: [
            [1, '2026-11-01', 40, null],
            [2, '2026-11-01', 25, null],
            [3, '2026-11-02', 35, null],
            [4, '2026-11-02', 50, null],
            [5, '2026-11-03', null, 3000],
            [6, '2026-11-03', null, 4500],
          ],
        },
      ],
      code: `-- Loaded with each batch's schema inferred and new columns merged in.
SELECT load_day,
       COUNT(*) AS order_rows,
       COALESCE(SUM(amount), 0) AS revenue,
       SUM(CASE WHEN amount IS NULL THEN 1 ELSE 0 END) AS rows_without_amount
FROM orders
GROUP BY load_day
ORDER BY load_day;`,
      steps: [
        'On 2026-11-03 the source renamed amount to amount_cents, and the load added amount_cents to the table as a new column.',
        'Line 3: the row count is normal every day, so a check on row counts alone passes.',
        'Lines 4-5: revenue for the day is 0, because amount is NULL in both of the new rows.',
        'A declared schema with amount required would have refused the 2026-11-03 batch and raised an alert, before any report read it.',
      ],
      output: `load_day | order_rows | revenue | rows_without_amount
2026-11-01 | 2 | 65 | 0
2026-11-02 | 2 | 85 | 0
2026-11-03 | 2 | 0 | 2`,
    },
    exercises: ['de-schema-1', 'de-schema-2', 'de-schema-3', 'de-schema-4', 'de-schema-5'],
  },
  {
    id: 'de_etl_elt_staging/1',
    topicKeys: [Topic.DE_ETL_ELT_STAGING],
    step: 1,
    title: 'ETL, ELT & Staging',
    idea: [
      lines(
        'Every pipeline extracts rows from a source, transforms them into the shape reports need, and loads them into a target.',
        'ETL and ELT differ in where the transform runs.',
        'ETL transforms in a separate engine and loads only the result; ELT loads the rows as extracted and transforms them inside the warehouse.',
      ),
      lines(
        'ELT keeps the raw rows, so when a rule changes or a bug is found, the transform is re-run on stored data instead of extracting again from a source that may have forgotten it.',
        'ETL still wins for data that may not be stored in the target at all, such as identifiers under a privacy rule: mask those before they land.',
      ),
      lines(
        'Staging is the landing table for one batch: the rows as extracted, checked before anything reads them.',
        'The transform reads staging, never the live source, so a run sees exactly the rows its checks passed and can be repeated.',
      ),
    ],
    form: {
      language: CodeLanguage.SQL,
      code: `-- where does the transform run?
data may not be stored in the target -> transform it first (ETL)
rules change, or the source forgets  -> land raw, keep it (ELT)
-- staging
holds one batch: clear it (or tag rows by batch) before each extract
the transform reads staging, not the live source`,
    },
    pitfall: lines(
      'A staging table that is appended to and never cleared hands every old batch to the next load.',
      'Clear it before each extract, or tag its rows with the batch and load only that batch.',
    ),
    worked: {
      language: CodeLanguage.SQL,
      tables: [
        {
          name: 'stg_orders',
          columns: ['order_id', 'status', 'amount_cents', 'country'],
          rows: [
            [1, 'PAID', 4000, 'NO'],
            [2, 'paid', 2500, 'SE'],
            [3, 'refunded', 1500, 'NO'],
            [4, 'PAID', 9900, 'XX'],
          ],
        },
      ],
      code: `CREATE TABLE orders_clean (order_id INT, status VARCHAR(20), amount INT);
INSERT INTO orders_clean
SELECT order_id, LOWER(status), amount_cents / 100
FROM stg_orders;
SELECT COUNT(*) AS paid_orders, SUM(amount) AS revenue
FROM orders_clean WHERE status = 'paid';

-- the rule changes: country XX is test traffic; re-run from staging
DELETE FROM orders_clean;
INSERT INTO orders_clean
SELECT order_id, LOWER(status), amount_cents / 100
FROM stg_orders
WHERE country <> 'XX';
SELECT COUNT(*) AS paid_orders, SUM(amount) AS revenue
FROM orders_clean WHERE status = 'paid';`,
      steps: [
        'Lines 2-4: the first transform lowercases the status and turns cents into whole units, reading only `stg_orders`.',
        'Lines 5-6: three orders are paid, 164 in all, but order 4 is a test order from country XX.',
        'Lines 9-13: the rule changes, so the transform empties `orders_clean` and runs again on the same staged rows, now leaving out country XX.',
        'Lines 14-15: two paid orders, 65 in all.',
        'The source was never queried again: staging still held the batch, which is what ELT buys.',
      ],
      output: `paid_orders | revenue
3 | 164

paid_orders | revenue
2 | 65`,
    },
    exercises: ['de-stage-1', 'de-stage-2', 'de-stage-3', 'de-stage-4', 'de-stage-6'],
  },
  {
    id: 'de_full_vs_incremental/1',
    topicKeys: [Topic.DE_FULL_VS_INCREMENTAL],
    step: 1,
    title: 'Full vs Incremental Loads',
    idea: [
      lines(
        'A full load copies the whole source table and replaces the target with it.',
        'It is simple and it sees every change, deletes included, but its cost grows with the table.',
      ),
      lines(
        'An incremental load reads only the rows that changed since the last run, found with a change column such as `updated_at` or an increasing id.',
        'It keeps a high-water mark: the highest change value it has loaded.',
        'Each run reads rows past the mark, writes them, and moves the mark in the same transaction.',
      ),
      lines(
        'Changed rows replace their old versions by key (an upsert or MERGE); they are not appended.',
        'A row deleted at the source has no change value left to find, so an incremental read never sees deletes.',
      ),
    ],
    form: {
      language: CodeLanguage.SQL,
      code: `small table, or no reliable change column -> full reload
large table, trusted updated_at or id     -> incremental (a mark)
rows deleted at the source                -> full reload, or CDC
incremental: upsert the changed rows by key
mark = max value loaded, saved in the load's transaction`,
    },
    pitfall: lines(
      'Setting the mark to the time the job ran, or saving it before the load commits.',
      'A row that commits late with an earlier timestamp, or the rows of a run that failed after the mark moved, are then skipped for good.',
    ),
    worked: {
      language: CodeLanguage.SQL,
      tables: [
        {
          name: 'src_products',
          columns: ['product_id', 'price', 'updated_at'],
          rows: [
            [1, 12, '2026-10-20 10:00'],
            [2, 30, '2026-11-01 09:30'],
            [3, 8, '2026-11-01 11:15'],
          ],
        },
        {
          name: 'dim_product',
          columns: ['product_id', 'price'],
          rows: [
            [1, 12],
            [2, 25],
          ],
        },
        {
          name: 'load_state',
          columns: ['tbl', 'last_loaded'],
          rows: [['products', '2026-11-01 08:00']],
        },
      ],
      code: `DECLARE @from VARCHAR(16) =
  (SELECT last_loaded FROM load_state WHERE tbl = 'products');
DECLARE @to VARCHAR(16) =
  (SELECT MAX(updated_at) FROM src_products WHERE updated_at > @from);
BEGIN TRAN;
DELETE FROM dim_product WHERE product_id IN
  (SELECT product_id FROM src_products WHERE updated_at > @from);
INSERT INTO dim_product
SELECT product_id, price FROM src_products WHERE updated_at > @from;
UPDATE load_state SET last_loaded = @to WHERE tbl = 'products';
COMMIT;
SELECT product_id, price FROM dim_product ORDER BY product_id;
SELECT last_loaded FROM load_state;`,
      steps: [
        'Lines 1-2: the mark says everything changed up to 08:00 on 11-01 is already loaded.',
        'Lines 3-4: the new mark is the highest `updated_at` among the rows this run reads, 11:15, taken from the data and not from the clock.',
        'Lines 6-9: products 2 and 3 changed after the mark, so their old versions are deleted by key and the new ones inserted; product 1 is not read at all.',
        'Line 10: the mark moves inside the same transaction, so a failed run leaves both the rows and the mark as they were.',
        'Lines 12-13: product 2 now costs 30, product 3 is new, and the next run starts after 11:15.',
      ],
      output: `product_id | price
1 | 12
2 | 30
3 | 8

last_loaded
2026-11-01 11:15`,
    },
    exercises: ['de-incr-1', 'de-incr-2', 'de-incr-3', 'de-incr-4', 'de-incr-6'],
  },
  {
    id: 'de_idempotent_loads/1',
    topicKeys: [Topic.DE_IDEMPOTENT_LOADS],
    step: 1,
    title: 'Re-runs & Idempotent Loads',
    idea: [
      lines(
        'Every batch load will run more than once for the same data: a retry after a timeout, a re-run after a fix, a backfill of last month.',
        'A load is idempotent when running it twice on the same input leaves the target exactly as running it once.',
      ),
      lines(
        'So write a load as "make the target\'s slice for this input equal to this output", never "add these rows".',
        'Replace a day\'s partition, or MERGE on a stable business key.',
      ),
      lines(
        'The slice comes from the run\'s input, the `run_date` the orchestrator passes, not from the clock.',
        'And the replace is one atomic commit, so nobody sees the slice half done and a crash leaves it as it was.',
      ),
    ],
    form: {
      language: CodeLanguage.SQL,
      code: `input is one partition (a day)    -> replace that partition, atomically
rows carry a stable business key  -> MERGE on the key (update or insert)
input arrives once, never retried -> append is fine (rare: be sure)
either way: same input -> same rows (a deterministic transform)`,
    },
    pitfall: lines(
      'A blind append (`INSERT INTO target SELECT ...`) is right on the first run and doubles the slice on every retry.',
      'A slice taken from `CURRENT_DATE` sends a backfill into the wrong day.',
    ),
    worked: {
      language: CodeLanguage.SQL,
      tables: [
        {
          name: 'staging_orders',
          columns: ['order_id', 'order_date', 'amount'],
          rows: [
            [101, '2026-11-01', 40],
            [102, '2026-11-01', 25],
            [103, '2026-11-01', 35],
          ],
        },
        {
          name: 'fact_orders',
          columns: ['order_id', 'order_date', 'amount'],
          rows: [
            [98, '2026-10-31', 50],
            [99, '2026-10-31', 20],
          ],
        },
      ],
      code: `-- Load A: a blind append, run and then retried
INSERT INTO fact_orders SELECT order_id, order_date, amount FROM staging_orders;
INSERT INTO fact_orders SELECT order_id, order_date, amount FROM staging_orders;
SELECT order_date, COUNT(*) AS order_rows, SUM(amount) AS revenue
FROM fact_orders GROUP BY order_date ORDER BY order_date;
DELETE FROM fact_orders WHERE order_date = '2026-11-01';  -- back to the start

-- Load B: replace the run's day in one transaction, run and then retried
DECLARE @run_date DATE = '2026-11-01';
BEGIN TRAN;
DELETE FROM fact_orders WHERE order_date = @run_date;
INSERT INTO fact_orders SELECT order_id, order_date, amount
FROM staging_orders WHERE order_date = @run_date;
COMMIT;
BEGIN TRAN;
DELETE FROM fact_orders WHERE order_date = @run_date;
INSERT INTO fact_orders SELECT order_id, order_date, amount
FROM staging_orders WHERE order_date = @run_date;
COMMIT;
SELECT order_date, COUNT(*) AS order_rows, SUM(amount) AS revenue
FROM fact_orders GROUP BY order_date ORDER BY order_date;`,
      steps: [
        'Lines 2-3: the job times out after writing and is retried, so the same three orders are appended twice.',
        'Lines 4-5: 2026-11-01 now has 6 rows and revenue 200, double the real 100, while 2026-10-31 is untouched.',
        'Line 9: Load B takes its day from the run\'s input, `@run_date`, not from the clock.',
        'Lines 10-19: each run deletes that day and inserts it again inside one transaction, so the retry ends exactly where the first run did.',
        'Lines 20-21: 2026-11-01 holds 3 rows and 100, however many times the load runs.',
      ],
      output: `order_date | order_rows | revenue
2026-10-31 | 2 | 70
2026-11-01 | 6 | 200

order_date | order_rows | revenue
2026-10-31 | 2 | 70
2026-11-01 | 3 | 100`,
    },
    exercises: ['de-idem-1', 'de-idem-2', 'de-idem-3', 'de-idem-6', 'de-idem-7'],
  },
  {
    id: 'de_change_data_capture/1',
    topicKeys: [Topic.DE_CHANGE_DATA_CAPTURE],
    step: 1,
    title: 'Change Data Capture',
    idea: [
      lines(
        'Change data capture (CDC) turns every insert, update and delete in a source table into an event the warehouse can apply.',
        'Log-based CDC reads the database\'s own write-ahead log, which already records each committed change in order, so it adds no queries to the tables.',
      ),
      lines(
        'Query-based CDC polls for rows with an `updated_at` past its mark.',
        'It is simpler, but a deleted row is gone and cannot be found, and several changes between two polls collapse into one.',
      ),
      lines(
        'Events are applied, not appended: for each key, the event with the highest log position (`lsn`) is the row\'s current state, and a delete removes the row.',
        'A new feed starts from a snapshot, with the log read from the position noted before the snapshot began.',
      ),
    ],
    form: {
      language: CodeLanguage.SQL,
      code: `need deletes, or every change (audit) -> log-based CDC
latest state is enough, no deletes    -> poll updated_at
apply: per key the highest lsn wins; I/U -> upsert, D -> delete
start: note the log position, snapshot, load it,
       then apply events from the noted position`,
    },
    pitfall: lines(
      'Ordering events by when they arrived instead of by their log position.',
      'A connector restart re-sends old events after newer ones, and the older value wins.',
    ),
    worked: {
      language: CodeLanguage.SQL,
      tables: [
        {
          name: 'dim_member',
          columns: ['member_id', 'city'],
          rows: [
            [1, 'Oslo'],
            [2, 'Bergen'],
            [3, 'Tromso'],
          ],
        },
        {
          name: 'change_batch',
          columns: ['lsn', 'op', 'member_id', 'city'],
          rows: [
            [201, 'U', 2, 'Stavanger'],
            [202, 'I', 4, 'Bodo'],
            [203, 'U', 2, 'Molde'],
            [204, 'D', 3, null],
            [205, 'I', 5, 'Alta'],
          ],
        },
      ],
      code: `BEGIN TRAN;
DELETE FROM dim_member
WHERE member_id IN (SELECT member_id FROM change_batch);
INSERT INTO dim_member (member_id, city)
SELECT member_id, city
FROM (SELECT member_id, op, city,
        ROW_NUMBER() OVER (PARTITION BY member_id ORDER BY lsn DESC) AS rn
      FROM change_batch) AS latest
WHERE rn = 1 AND op <> 'D';
COMMIT;
SELECT member_id, city FROM dim_member ORDER BY member_id;`,
      steps: [
        'Lines 2-3: every member the batch mentions is removed, so each key is rebuilt from its events alone.',
        'Lines 6-8: `ROW_NUMBER()` ranks each member\'s events by `lsn`, newest first: member 2 has two updates, and lsn 203 (Molde) wins over 201.',
        'Line 9: the newest event of each key is written back unless it is a delete, so member 3 stays removed.',
        'Line 11: member 1 was not in the batch and is untouched; 2 moved to Molde, 4 and 5 are new, 3 is gone.',
      ],
      output: `member_id | city
1 | Oslo
2 | Molde
4 | Bodo
5 | Alta`,
    },
    exercises: ['de-capture-1', 'de-capture-2', 'de-capture-3', 'de-capture-4', 'de-capture-6'],
  },
  {
    id: 'de_dedup_late_data/1',
    topicKeys: [Topic.DE_DEDUP_LATE_DATA],
    step: 1,
    title: 'Deduplication & Late-Arriving Data',
    idea: [
      lines(
        'Retries and redeliveries put the same record into staging more than once, often with a different ingestion time, so the copies are not identical rows.',
        'Deduplicate on the business key: keep one row per key, the newest by change time or source version, not by arrival order.',
      ),
      lines(
        'A record is late when it arrives after the load for its day has run.',
        'Load it under the day it happened (its event date), not the day it arrived.',
      ),
      lines(
        'A late row reopens its day, so the fact rows and every total built on them are rebuilt for each day the batch touched.',
        'Pipelines often rebuild a fixed window of recent days, as long as data can be late; anything later needs a backfill.',
      ),
    ],
    form: {
      language: CodeLanguage.SQL,
      code: `duplicates   -> one row per key (ROW_NUMBER() ... = 1), the newest
                by updated_at or version, not by ingested_at
late rows    -> load into their event date
rebuild      -> every date the batch touched, facts and totals
how far back -> as long as data can be late; older: a backfill`,
    },
    pitfall: lines(
      'Grouping by the day a row arrived (`ingested_at`, the batch date) instead of the day it happened.',
      'Late rows then move revenue from one day to the next, and both days are wrong.',
    ),
    worked: {
      language: CodeLanguage.SQL,
      tables: [
        {
          name: 'stg_sales',
          columns: ['sale_id', 'sale_date', 'amount', 'version', 'ingested_on'],
          rows: [
            [1, '2026-11-01', 12, 1, '2026-11-02'],
            [2, '2026-11-01', 30, 1, '2026-11-02'],
            [2, '2026-11-01', 25, 2, '2026-11-02'],
            [3, '2026-11-02', 8, 1, '2026-11-03'],
            [3, '2026-11-02', 8, 1, '2026-11-03'],
            [4, '2026-11-01', 50, 1, '2026-11-03'],
          ],
        },
      ],
      code: `-- by arrival: every staged row, on the day it came in
SELECT ingested_on, SUM(amount) AS revenue
FROM stg_sales GROUP BY ingested_on ORDER BY ingested_on;

-- by event: the newest version of each sale, on the day it happened
SELECT sale_date, COUNT(*) AS sales, SUM(amount) AS revenue
FROM (SELECT sale_id, sale_date, amount,
        ROW_NUMBER() OVER (PARTITION BY sale_id ORDER BY version DESC) AS rn
      FROM stg_sales) AS latest
WHERE rn = 1
GROUP BY sale_date ORDER BY sale_date;`,
      steps: [
        'Lines 2-3: grouped by arrival, the old version of sale 2, the redelivered copy of sale 3 and the late sale 4 all count, on the wrong days.',
        'Lines 7-8: `ROW_NUMBER()` numbers each sale\'s versions newest first, so sale 2 keeps its corrected amount 25 and sale 3 keeps one of its two copies.',
        'Line 10: only the first row per sale survives: four sales, one row each.',
        'Line 11: grouped by `sale_date`, the late sale 4 counts on 2026-11-01, the day it happened, which reopens a day already loaded.',
      ],
      output: `ingested_on | revenue
2026-11-02 | 67
2026-11-03 | 66

sale_date | sales | revenue
2026-11-01 | 3 | 87
2026-11-02 | 1 | 8`,
    },
    exercises: ['de-dedup-1', 'de-dedup-2', 'de-dedup-3', 'de-dedup-4', 'de-dedup-6'],
  },
  {
    id: 'de_backfills/1',
    topicKeys: [Topic.DE_BACKFILLS],
    step: 1,
    title: 'Backfills & Reprocessing',
    idea: [
      lines(
        'A backfill runs a pipeline\'s normal daily job for past dates: to fill days that were missed, or to rebuild days after the logic was fixed.',
        'Each run is given its `run_date` and replaces that day, exactly as on the night itself.',
      ),
      lines(
        'That works for a job that reads the inputs of its `run_date` (not the clock) and replaces only its own slice.',
        'Then backfill days can run in any order, in parallel, and again, and each day can be checked on its own.',
        'A job whose day reads the day before, such as a running balance, has to run in date order.',
      ),
      lines(
        'The rebuild reads kept raw data, so raw retention decides how far back a fix can reach.',
        'Every table built from the fixed one is rebuilt for the same dates, in dependency order.',
      ),
    ],
    form: {
      language: CodeLanguage.SQL,
      code: `for run_date in first_bad_day .. yesterday:  -- past dates
    daily_job(run_date)                      -- replaces that day
then rebuild downstream tables for the same dates, upstream first
days independent of each other -> any order, in parallel
a day reads the day before     -> in date order`,
    },
    pitfall: lines(
      'Fixing history with a one-off UPDATE instead of the daily job.',
      'It is new logic run once over everything: it cannot be resumed, checked per day or repeated safely, and it leaves the downstream tables as they were.',
    ),
    worked: {
      language: CodeLanguage.SQL,
      tables: [
        {
          name: 'raw_loans',
          columns: ['loan_id', 'loan_date'],
          rows: [
            [1, '2026-11-01'],
            [2, '2026-11-01'],
            [3, '2026-11-01'],
            [4, '2026-11-02'],
            [5, '2026-11-02'],
            [6, '2026-11-03'],
            [7, '2026-11-03'],
          ],
        },
        {
          name: 'daily_loans',
          columns: ['loan_date', 'loans'],
          rows: [
            ['2026-11-01', 2],
            ['2026-11-02', 9],
          ],
        },
      ],
      code: `CREATE PROCEDURE load_day @run_date DATE AS
BEGIN
  BEGIN TRAN;
  DELETE FROM daily_loans WHERE loan_date = @run_date;
  INSERT INTO daily_loans (loan_date, loans)
  SELECT loan_date, COUNT(*) FROM raw_loans
  WHERE loan_date = @run_date GROUP BY loan_date;
  COMMIT;
END
GO
DECLARE @d DATE = '2026-11-01';
WHILE @d <= '2026-11-03'
BEGIN
  EXEC load_day @run_date = @d;
  SET @d = DATEADD(day, 1, @d);
END;
SELECT loan_date, loans FROM daily_loans ORDER BY loan_date;`,
      steps: [
        'Lines 1-9: the daily job replaces one day of `daily_loans` from the kept `raw_loans`, inside one transaction.',
        'Lines 11-16: the backfill is a loop over past dates that calls the same job once per `run_date`.',
        'The wrong counts for 11-01 (2) and 11-02 (9) are replaced, and the missing 11-03 is filled.',
        'Line 17: each day now matches the raw rows: 3, 2 and 2 loans.',
        'Running the loop again changes nothing, which is what makes a backfill safe to stop and restart.',
      ],
      output: `loan_date | loans
2026-11-01 | 3
2026-11-02 | 2
2026-11-03 | 2`,
    },
    exercises: ['de-backfill-1', 'de-backfill-2', 'de-backfill-3', 'de-backfill-4', 'de-backfill-5'],
  },
  {
    id: 'de_grain_double_counting/1',
    topicKeys: [Topic.DE_GRAIN_DOUBLE_COUNTING],
    step: 1,
    title: 'Grain & Double Counting',
    idea: [
      lines(
        'The grain of a table is what one row stands for: one order, one order line, one customer per day.',
        'Write it down as one sentence before choosing columns, because it decides the key (the columns that are unique together) and which measures belong.',
      ),
      lines(
        'A measure can be added up only over rows at its own grain.',
        'A line\'s amount sums over a line table; an order\'s shipping fee does not, because on a line table it is repeated on every line of the order.',
      ),
      lines(
        'Joins are where grains meet.',
        'A join from a coarser table to a finer one repeats each coarse row once per match (fan-out), so a coarse measure summed after it is counted once per match.',
        'So bring each table to the grain of the question before joining, and compare row counts before and after each join.',
      ),
      lines(
        'Ratios and distinct counts are non-additive: summing or averaging them over rows gives a wrong number.',
        'Store their parts (orders and visits, the customer ids) and compute them at the level the report asks for.',
      ),
    ],
    form: {
      language: CodeLanguage.SQL,
      code: `state the grain: "one row per <thing>"; its key is unique
join to a finer table     -> each coarser row repeats once per match
sum a measure only at its own grain: aggregate first, then join
ratios, distinct counts   -> recompute from their parts, never sum them
check: row count before and after every join`,
    },
    pitfall: lines(
      'Joining orders to their lines and then summing an order-level column, such as the shipping fee or the order total.',
      'Each order is counted once per line, the total looks plausible, and nothing raises an error.',
    ),
    worked: {
      language: CodeLanguage.SQL,
      tables: [
        {
          name: 'orders',
          columns: ['order_id', 'customer_id', 'shipping'],
          rows: [
            [1, 'c1', 5],
            [2, 'c2', 8],
            [3, 'c1', 4],
          ],
        },
        {
          name: 'order_lines',
          columns: ['order_id', 'line_no', 'amount'],
          rows: [
            [1, 1, 20],
            [1, 2, 30],
            [2, 1, 15],
            [3, 1, 10],
            [3, 2, 5],
            [3, 3, 25],
          ],
        },
      ],
      code: `-- Query A: join the orders to their lines, then sum the order's fee
SELECT COUNT(*) AS joined_rows, SUM(o.shipping) AS shipping
FROM orders o
JOIN order_lines l ON l.order_id = o.order_id;

-- Query B: bring the lines to one row per order first, then join
WITH line_totals AS (
  SELECT order_id, SUM(amount) AS goods
  FROM order_lines
  GROUP BY order_id
)
SELECT COUNT(*) AS joined_rows, SUM(o.shipping) AS shipping, SUM(t.goods) AS goods
FROM orders o
JOIN line_totals t ON t.order_id = o.order_id;`,
      steps: [
        'The grain of `orders` is one row per order, and of `order_lines` one row per order line.',
        'Lines 2-4: the join returns one row per line, 6 rows, and each carries its order\'s fee, so shipping comes out as 30.',
        'The fees really charged are 5 + 8 + 4 = 17, one per order.',
        'Lines 7-11: the lines are summed to one row per order before the join.',
        'Lines 12-14: both sides are now one row per order, so the join returns 3 rows and both shipping (17) and goods (105) are right.',
      ],
      output: `joined_rows | shipping
6 | 30

joined_rows | shipping | goods
3 | 17 | 105`,
    },
    exercises: ['de-fanout-1', 'de-fanout-2', 'de-fanout-3', 'de-fanout-4', 'de-fanout-5'],
  },
  {
    id: 'de_facts_dims_star/1',
    topicKeys: [Topic.DE_FACTS_DIMS_STAR],
    step: 1,
    title: 'Facts, Dimensions & the Star Schema',
    idea: [
      lines(
        'A fact table records the events of one business process at one grain: each row holds measures to add up and a key for each thing the event involves.',
        'A dimension table describes those things, one row per product, customer, store or date, with the attributes people filter and group by.',
      ),
      lines(
        'A star schema puts one fact in the middle with a join from it to each dimension.',
        'Every question then has the same shape: filter and group by dimension attributes, sum the fact\'s measures.',
        'Dimensions are kept flat, with category and department on the product row, because they are small and read far more than written; splitting them into sub-tables (a snowflake) adds joins to every query.',
      ),
      lines(
        'Two facts that use the same dimensions (conformed dimensions) can be compared: sum each fact on its own by the shared attributes, then join the totals.',
        'The SQL course\'s Data Modeling in SQL section builds these tables in T-SQL.',
      ),
    ],
    form: {
      language: CodeLanguage.SQL,
      code: `a number you add up across events -> measure, on the fact
something you filter or group by   -> attribute, on a dimension
fact row  = one event at the grain: dimension keys + measures
dimension = one flat row per thing (no sub-tables)
every fact key finds a dimension row ("unknown" for gaps)`,
    },
    pitfall: lines(
      'A fact key with no dimension row yet, such as a product added today, is dropped by the inner join, so totals by attribute come out lower than the fact\'s total.',
      'Load dimensions before facts, and point a missing key at an "unknown" member row.',
    ),
    worked: {
      language: CodeLanguage.SQL,
      tables: [
        {
          name: 'fact_sales',
          columns: ['sale_id', 'product_key', 'amount'],
          rows: [
            [1, 1, 20],
            [2, 2, 15],
            [3, 1, 25],
            [4, 3, 40],
            [5, 2, 10],
            [6, 8, 15],
          ],
        },
        {
          name: 'dim_product',
          columns: ['product_key', 'product_name', 'category'],
          rows: [
            [-1, 'Unknown', 'Unknown'],
            [1, 'Kettle', 'Kitchen'],
            [2, 'Mug', 'Kitchen'],
            [3, 'Lamp', 'Lighting'],
          ],
        },
      ],
      code: `-- revenue by category: the fact joined to the product dimension
SELECT p.category, SUM(f.amount) AS revenue
FROM fact_sales f
JOIN dim_product p ON p.product_key = f.product_key
GROUP BY p.category
ORDER BY p.category;
SELECT SUM(amount) AS fact_total FROM fact_sales;

-- the load gives a key with no dimension row the unknown member, -1
CREATE TABLE fact_sales_loaded (sale_id INT, product_key INT, amount INT);
INSERT INTO fact_sales_loaded
SELECT f.sale_id, COALESCE(p.product_key, -1), f.amount
FROM fact_sales f
LEFT JOIN dim_product p ON p.product_key = f.product_key;
SELECT p.category, SUM(f.amount) AS revenue
FROM fact_sales_loaded f
JOIN dim_product p ON p.product_key = f.product_key
GROUP BY p.category
ORDER BY p.category;`,
      steps: [
        'Lines 2-6: the fact has the amounts and a product key, the dimension has the category, so the query joins on the key, groups by category and sums.',
        'Kitchen is the Kettle and the Mug, 70, and Lighting is the Lamp, 40.',
        'Line 7: the fact holds 125, because sale 6 is for product 8, which is not in `dim_product` yet and fell out of the inner join.',
        'Lines 10-14: the load looks each key up with a LEFT JOIN and gives a key it cannot find the unknown member, -1, instead of losing the sale.',
        'Lines 15-19: the categories now add up to the fact\'s 125, with 15 under Unknown until product 8 arrives.',
      ],
      output: `category | revenue
Kitchen | 70
Lighting | 40

fact_total
125

category | revenue
Kitchen | 70
Lighting | 40
Unknown | 15`,
    },
    exercises: ['de-dimstar-1', 'de-dimstar-2', 'de-dimstar-3', 'de-dimstar-4', 'de-dimstar-5'],
  },
  {
    id: 'de_natural_surrogate_keys/1',
    topicKeys: [Topic.DE_NATURAL_SURROGATE_KEYS],
    step: 1,
    title: 'Keys: Natural & Surrogate',
    idea: [
      lines(
        'A natural key is the identifier the source uses: an order number, a SKU, a customer id.',
        'A surrogate key is a number the warehouse gives each dimension row when it is first loaded, with no meaning outside the warehouse.',
      ),
      lines(
        'Natural keys are not under the warehouse\'s control.',
        'They change (an email), get reused (a SKU), clash across sources (two systems both have customer 7), and once history is kept one customer has several rows.',
      ),
      lines(
        'So each dimension row gets a surrogate key, and the natural key stays on the row as an ordinary column, qualified by its source.',
        'A fact load looks up each row\'s natural key in the dimension and stores the surrogate key it finds.',
        'The key is assigned once and never recomputed, so a fact loaded last year still points at the same row.',
      ),
    ],
    form: {
      language: CodeLanguage.SQL,
      code: `the source's identifier (SKU, id) -> natural key, kept as a column
the dimension row's identity       -> surrogate key, assigned once
what the fact stores               -> surrogate key, looked up at load
two sources, each with its own ids -> natural key = (source, id)
never join on a key that is not unique in the dimension`,
    },
    pitfall: lines(
      'Looking a customer up by the source\'s id alone once two sources share a dimension.',
      'An id that exists in both systems matches two rows, and each of its facts is loaded twice, once against a customer who never placed it.',
    ),
    worked: {
      language: CodeLanguage.SQL,
      tables: [
        {
          name: 'dim_customer',
          columns: ['customer_key', 'source', 'source_id', 'customer_name'],
          rows: [
            [1, 'shop', 1001, 'Ana'],
            [2, 'shop', 1002, 'Ben'],
            [3, 'app', 1001, 'Chen'],
          ],
        },
        {
          name: 'stg_orders',
          columns: ['order_id', 'source', 'source_customer_id', 'amount'],
          rows: [
            [501, 'shop', 1001, 40],
            [502, 'app', 1001, 25],
            [503, 'shop', 1002, 30],
          ],
        },
      ],
      code: `-- lookup on the source's id alone
SELECT COUNT(*) AS joined_rows, SUM(o.amount) AS revenue
FROM stg_orders o
JOIN dim_customer c ON c.source_id = o.source_customer_id;

-- lookup on the full natural key, (source, source_id)
SELECT o.order_id, c.customer_key, c.customer_name, o.amount
FROM stg_orders o
JOIN dim_customer c
  ON c.source = o.source AND c.source_id = o.source_customer_id
ORDER BY o.order_id;`,
      steps: [
        'The shop and the app each number their customers, so 1001 is Ana in one and Chen in the other.',
        'Lines 2-4: orders 501 and 502 each match both customers 1001, so 3 orders become 5 rows and 95 of revenue becomes 160.',
        'Lines 7-11: the lookup uses (source, source_id), which is unique in the dimension, so each order finds one row.',
        'Each order now carries the `customer_key` that `fact_orders` stores, and the source\'s id stays on the dimension for the next lookup.',
      ],
      output: `joined_rows | revenue
5 | 160

order_id | customer_key | customer_name | amount
501 | 1 | Ana | 40
502 | 3 | Chen | 25
503 | 2 | Ben | 30`,
    },
    exercises: ['de-skey-1', 'de-skey-2', 'de-skey-3', 'de-skey-4', 'de-skey-5'],
  },
  {
    id: 'de_scd_point_in_time/1',
    topicKeys: [Topic.DE_SCD_POINT_IN_TIME],
    step: 1,
    title: 'Slowly Changing Dimensions & Point-in-Time Joins',
    idea: [
      lines(
        'Dimension attributes change: a customer moves, a product changes category.',
        'Type 1 overwrites the value, so every past fact now reports under the new one.',
        'Type 2 keeps history: it closes the current row with an end date and adds a new row, with a new surrogate key, from the date of the change.',
      ),
      lines(
        'Choose per attribute by asking how a report about the past should read.',
        'If last year\'s sales should stay under the region they were made in, the region is Type 2; a corrected misspelling, or a value only shown as it is today, is Type 1.',
      ),
      lines(
        'A fact finds its version with a point-in-time join: the version whose interval holds the event\'s date.',
        'Intervals are half-open, valid_from <= date < valid_to, and the current row ends on a far-future date such as 9999-12-31, so every date is in exactly one version.',
        'A load does the same lookup to store the version\'s surrogate key; the SQL course\'s Slowly Changing Dimensions topic writes that load in T-SQL.',
      ),
    ],
    form: {
      language: CodeLanguage.SQL,
      code: `past events keep the value true then -> Type 2: close, add version
a correction, or latest value only   -> Type 1: overwrite in place
a version holds: valid_from <= date < valid_to (current: 9999-12-31)
fact to version: natural key AND event date inside the interval
                 (or the version's surrogate key, stored at load)`,
    },
    pitfall: lines(
      'Joining facts to the current row, or looking up the current row when a late fact is loaded.',
      'Every past event then reports under today\'s value, and nothing looks wrong until someone compares with last year\'s report.',
    ),
    worked: {
      language: CodeLanguage.SQL,
      tables: [
        {
          name: 'dim_customer',
          columns: ['customer_key', 'customer_id', 'city', 'valid_from', 'valid_to'],
          rows: [
            [1, 'C-7', 'Leeds', '2025-01-01', '2026-06-01'],
            [2, 'C-7', 'York', '2026-06-01', '9999-12-31'],
            [3, 'C-9', 'Leeds', '2025-03-01', '9999-12-31'],
          ],
        },
        {
          name: 'fact_sales',
          columns: ['sale_id', 'customer_id', 'sale_date', 'amount'],
          rows: [
            [1, 'C-7', '2026-03-10', 40],
            [2, 'C-7', '2026-06-01', 25],
            [3, 'C-7', '2026-09-15', 30],
            [4, 'C-9', '2026-07-02', 50],
          ],
        },
      ],
      code: `-- Query A: every sale joined to the customer's current row
SELECT d.city, SUM(f.amount) AS revenue
FROM fact_sales f
JOIN dim_customer d
  ON d.customer_id = f.customer_id AND d.valid_to = '9999-12-31'
GROUP BY d.city
ORDER BY d.city;

-- Query B: each sale joined to the version valid on its date
SELECT d.city, SUM(f.amount) AS revenue
FROM fact_sales f
JOIN dim_customer d
  ON d.customer_id = f.customer_id
 AND f.sale_date >= d.valid_from
 AND f.sale_date < d.valid_to
GROUP BY d.city
ORDER BY d.city;`,
      steps: [
        'C-7 moved from Leeds to York on 2026-06-01, so its Leeds row ends that day and its York row starts it.',
        'Lines 2-7: joined to the current row, all three of C-7\'s sales go to York, 95, and Leeds keeps only C-9\'s 50.',
        'Lines 10-17: each sale finds the version whose interval holds its date.',
        'Sale 1 (March) is in Leeds, so Leeds has 40 + 50 = 90.',
        'Sale 2, on the move date itself, is in York only, because the Leeds interval excludes its end; York has 25 + 30 = 55.',
      ],
      output: `city | revenue
Leeds | 50
York | 95

city | revenue
Leeds | 90
York | 55`,
    },
    exercises: ['de-history-1', 'de-history-2', 'de-history-3', 'de-history-4', 'de-history-5'],
  },
  {
    id: 'de_metrics_ownership/1',
    topicKeys: [Topic.DE_METRICS_OWNERSHIP],
    step: 1,
    title: 'Metrics & Ownership: Semantic Layer & Data Mesh',
    idea: [
      lines(
        'A metric such as revenue is a definition: which rows, which measure, which date, which exclusions.',
        'When each dashboard writes its own SQL, the same name ends up with several definitions, and the numbers disagree with no error anywhere.',
      ),
      lines(
        'So define each metric once, as code under version control, with an owner and tests: a model in the transformation tool (dbt or SQLMesh, for example) or a semantic layer.',
        'Dashboards and notebooks ask for "revenue by month" instead of copying its SQL, so a fix reaches them all at once.',
        'A change to a definition is reviewed by its owner and compared with the old numbers before it ships.',
      ),
      lines(
        'Ownership has to scale with the company.',
        'One central data team works while it keeps up; with many domains it becomes a queue, and it does not know each domain\'s data.',
        'Data mesh gives each domain team ownership of its data as products, on a self-serve platform, under shared standards such as common keys and conformed dimensions.',
      ),
    ],
    form: {
      language: CodeLanguage.SQL,
      code: `a number several reports show -> define it once, in code, owned
a dashboard needs it          -> query the definition, never copy it
a change to a definition      -> reviewed, tested, compared, announced
many domains, central queue   -> domains own products, shared standards
few domains, team keeps up    -> central ownership, named owners`,
    },
    pitfall: lines(
      'Pasting a metric\'s SQL into a dashboard "to match finance".',
      'From that day it is a second definition: the next change to the shared one does not reach it, and the two numbers drift apart again.',
    ),
    worked: {
      language: CodeLanguage.SQL,
      tables: [
        {
          name: 'orders',
          columns: ['order_id', 'order_date', 'status', 'amount'],
          rows: [
            [1, '2026-10-04', 'paid', 120],
            [2, '2026-10-12', 'refunded', 40],
            [3, '2026-10-25', 'paid', 60],
            [4, '2026-11-02', 'paid', 90],
            [5, '2026-11-03', 'cancelled', 30],
          ],
        },
      ],
      code: `-- two dashboards, each with its own SQL for "October revenue"
SELECT 'finance' AS dashboard, SUM(amount) AS october_revenue
FROM orders WHERE status = 'paid' AND order_date BETWEEN '2026-10-01' AND '2026-10-31'
UNION ALL
SELECT 'sales', SUM(amount)
FROM orders WHERE order_date BETWEEN '2026-10-01' AND '2026-10-31'
ORDER BY dashboard;
GO
-- one shared definition, owned by finance
CREATE VIEW revenue AS
SELECT order_date, amount FROM orders WHERE status = 'paid';
GO
SELECT LEFT(order_date, 7) AS order_month, SUM(amount) AS revenue
FROM revenue
GROUP BY LEFT(order_date, 7)
ORDER BY order_month;`,
      steps: [
        'Lines 2-7: both dashboards call their number October revenue, but sales counts every order and finance only the paid ones.',
        'The 40 between them is the refunded order, and neither query raises an error.',
        'Lines 10-11: the definition is written once, as a view that finance owns.',
        'Lines 13-16: every dashboard reads the view, so October is 180 everywhere, and November follows the same rule.',
      ],
      output: `dashboard | october_revenue
finance | 180
sales | 220

order_month | revenue
2026-10 | 180
2026-11 | 90`,
    },
    exercises: ['de-metric-1', 'de-metric-2', 'de-metric-3', 'de-metric-4', 'de-metric-5'],
  },
  {
    id: 'de_stream_logs/1',
    topicKeys: [Topic.DE_STREAM_LOGS],
    step: 1,
    title: 'Logs, Topics, Partitions & Offsets',
    idea: [
      lines(
        'A stream is an unbounded sequence of events, and most pipelines keep it in a log: a file that is only appended to and read by position.',
        'A topic is one such log, split into partitions so that many machines can write and read it at once.',
        'Each message gets the next offset of its partition, and order holds only within a partition.',
      ),
      lines(
        'The producer picks the partition from the message key, so every message with one key lands in one partition, in the order it was sent.',
        'Key by what must stay in order or be handled together, such as an account_id; a key shared by a large share of the traffic makes one partition hot.',
      ),
      lines(
        'A consumer group reads a topic by giving each partition to one of its members, so a group can use at most as many members as there are partitions.',
        'Each group commits its own offsets and reading removes nothing, so other groups read the same messages, and a group replays by moving its offsets back while retention still holds them.',
        'Stream when something acts on the result within seconds or minutes; when the result is read hourly or daily, a scheduled batch, even a frequent micro-batch, is simpler.',
      ),
    ],
    form: {
      language: CodeLanguage.SQL,
      code: `must stay in order (one account) -> key by it: same key, same partition
more readers in one group        -> more partitions (members <= partitions)
another job needs every message  -> its own consumer group, its own offsets
reprocess a past period          -> reset the group's offsets (in retention)
acted on in seconds -> stream; read hourly or daily -> batch`,
    },
    pitfall: lines(
      'Expecting order across a topic.',
      'The messages of one key are in order because they share a partition; key by a unique event id, or let the producer spread messages, and one account\'s events are read by different consumers at different speeds.',
    ),
    worked: {
      language: CodeLanguage.SQL,
      tables: [
        {
          name: 'produced',
          columns: ['seq', 'account_id', 'amount'],
          rows: [
            [1, 7, 50],
            [2, 4, 20],
            [3, 7, -30],
            [4, 9, 10],
            [5, 5, 40],
            [6, 4, 15],
            [7, 7, 25],
            [8, 6, 30],
          ],
        },
        {
          name: 'committed',
          columns: ['partition_id', 'next_offset'],
          rows: [
            [0, 2],
            [1, 3],
            [2, 0],
          ],
        },
      ],
      code: `-- each message goes to partition account_id % 3, at the next offset there
SELECT account_id % 3 AS partition_id,
       ROW_NUMBER() OVER (PARTITION BY account_id % 3 ORDER BY seq) - 1 AS offset_no,
       seq, account_id, amount
FROM produced
ORDER BY partition_id, offset_no;

-- the group's lag: messages at or after its committed offset
WITH placed AS (
  SELECT account_id % 3 AS partition_id,
         ROW_NUMBER() OVER (PARTITION BY account_id % 3 ORDER BY seq) - 1 AS offset_no
  FROM produced
)
SELECT c.partition_id, COUNT(p.offset_no) AS lag
FROM committed c
LEFT JOIN placed p ON p.partition_id = c.partition_id AND p.offset_no >= c.next_offset
GROUP BY c.partition_id
ORDER BY c.partition_id;`,
      steps: [
        'The producer keys each message by account_id, so its partition is account_id % 3 and every message of one account lands in one partition.',
        'Lines 2-6: inside a partition each message takes the next offset, so account 7\'s three messages are offsets 0, 2 and 4 of partition 1, in the order they were sent.',
        'Across partitions there is no order: the consumer of partition 0 may handle seq 4 before another consumer has handled seq 1.',
        'Lines 9-18: the group has committed offsets 2, 3 and 0, so partition 1 still has offsets 3 and 4 to read and partition 2 its one message.',
        'Lag is per partition, here 0, 2 and 1, and a replay is a committed offset moved back, since the messages are still in the log.',
      ],
      output: `partition_id | offset_no | seq | account_id | amount
0 | 0 | 4 | 9 | 10
0 | 1 | 8 | 6 | 30
1 | 0 | 1 | 7 | 50
1 | 1 | 2 | 4 | 20
1 | 2 | 3 | 7 | -30
1 | 3 | 6 | 4 | 15
1 | 4 | 7 | 7 | 25
2 | 0 | 5 | 5 | 40

partition_id | lag
0 | 0
1 | 2
2 | 1`,
    },
    exercises: ['de-log-1', 'de-log-2', 'de-log-3', 'de-log-4', 'de-log-5'],
  },
  {
    id: 'de_event_time_windows/1',
    topicKeys: [Topic.DE_EVENT_TIME_WINDOWS],
    step: 1,
    title: 'Event Time, Windows & Watermarks',
    idea: [
      lines(
        'Every event has two times: its event time, when it happened, and its processing time, when the pipeline saw it.',
        'They drift apart whenever events are delayed or reordered: a phone offline for an hour, a slow partition, a retry.',
        'Windows group events by event time, so each event is counted in the period it belongs to, whenever it arrives.',
      ),
      lines(
        'Tumbling windows tile time with fixed periods that do not overlap, so each event is in one window.',
        'Hopping (sliding) windows are longer than their step, so each event is in several and their counts add up to more than the events.',
        'Session windows have no fixed length: a session stays open while the next event comes within the gap.',
      ),
      lines(
        'A stream never says that a period is complete, so the job estimates it with a watermark: the newest event time seen, minus an allowed lateness.',
        'When the watermark passes a window\'s end, the window is emitted and its state dropped, and a later event for it goes to a late-data output.',
        'More lateness gives more complete results, later, with more windows held in memory.',
      ),
    ],
    form: {
      language: CodeLanguage.SQL,
      code: `count each event once, fixed periods -> tumbling windows
a moving figure (last 10 min, every 5) -> hopping (sliding) windows
activity split by inactivity           -> session windows with a gap
watermark = newest event time - allowed lateness
a window closes when the watermark reaches its end; later events -> late output`,
    },
    pitfall: lines(
      'Windowing by arrival time.',
      'Nothing is ever late that way, so it looks simpler, but an outage or an offline phone moves its events into the hour they were uploaded, and a replay of the same data gives other numbers.',
    ),
    worked: {
      language: CodeLanguage.SQL,
      tables: [
        {
          name: 'arrivals',
          columns: ['event_id', 'event_minute', 'arrival_minute'],
          rows: [
            ['e1', 1, 2],
            ['e2', 3, 4],
            ['e3', 6, 6],
            ['e4', 4, 7],
            ['e5', 8, 9],
            ['e6', 2, 10],
            ['e7', 9, 11],
            ['e8', 12, 13],
          ],
        },
      ],
      code: `-- 5-minute windows by arrival: when the pipeline saw each event
SELECT arrival_minute / 5 * 5 AS window_start, COUNT(*) AS events
FROM arrivals
GROUP BY arrival_minute / 5 * 5
ORDER BY window_start;

-- 5-minute windows by event time, closed by a watermark 2 minutes behind
WITH judged AS (
  SELECT a.event_minute / 5 * 5 AS window_start,
         (SELECT MAX(b.event_minute) FROM arrivals b
          WHERE b.arrival_minute < a.arrival_minute) - 2 AS watermark
  FROM arrivals a
)
SELECT window_start,
       SUM(CASE WHEN watermark >= window_start + 5 THEN 0 ELSE 1 END) AS counted,
       SUM(CASE WHEN watermark >= window_start + 5 THEN 1 ELSE 0 END) AS late
FROM judged
GROUP BY window_start
ORDER BY window_start;`,
      steps: [
        'Minute 0 is 10:00, so e6 happened at 10:02 and reached the pipeline at 10:10.',
        'Lines 2-5: grouped by arrival, the first window shows 2 events, although 4 happened in it.',
        'Lines 8-19: grouped by event time, each event goes to the window it happened in, and the watermark when it arrives is the newest event time before it, minus 2.',
        'e5 (minute 8) moves the watermark to 6, which closes the window [0, 5); e4 arrived before that and is counted.',
        'e6 arrives after the window closed, so the window reports 3 and the late output gets 1.',
      ],
      output: `window_start | events
0 | 2
5 | 3
10 | 3

window_start | counted | late
0 | 3 | 1
5 | 3 | 0
10 | 1 | 0`,
    },
    exercises: ['de-wmark-1', 'de-wmark-2', 'de-wmark-3', 'de-wmark-4', 'de-wmark-5'],
  },
  {
    id: 'de_delivery_guarantees/1',
    topicKeys: [Topic.DE_DELIVERY_GUARANTEES],
    step: 1,
    title: 'Delivery Guarantees & Exactly-Once',
    idea: [
      lines(
        'A consumer does two things for each batch: it writes the results and it commits the batch\'s offsets.',
        'Commit first, and a crash between the two loses the batch: at-most-once.',
        'Write first, and a crash replays the batch, so it can be written twice: at-least-once.',
      ),
      lines(
        'Most pipelines choose at-least-once and make the write idempotent, so a repeat changes nothing.',
        'The sink upserts on the event\'s own id, or records the ids it has applied in the same transaction as the change.',
        'Repeats come from replays after a crash and from producers that resend after a timeout, and only the event\'s id is the same in both.',
      ),
      lines(
        'Stream engines give exactly-once results by saving their state together with the input offsets in a checkpoint, and committing their output in step with it.',
        'After a crash they go back to the last checkpoint, where state, read position and output agree.',
        'That covers the engine\'s state and its transactional sinks, not an email or a payment API: a call that leaves the system needs an idempotency key or a record of what was sent.',
      ),
    ],
    form: {
      language: CodeLanguage.SQL,
      code: `commit offsets, then write -> at-most-once: a crash loses the batch
write, then commit offsets -> at-least-once: a crash repeats the batch
at-least-once + a write keyed by the event's id -> exactly-once effect
state + offsets + output in one checkpoint     -> exactly-once in the engine
a side effect outside (email, API) -> idempotency key, or record what was sent`,
    },
    pitfall: lines(
      'Deduplicating on the offset.',
      'It catches a consumer re-reading after a crash, but a producer\'s resend is a new message at a new offset, so the same payment passes twice.',
    ),
    worked: {
      language: CodeLanguage.SQL,
      tables: [
        {
          name: 'topic_log',
          columns: ['offset_no', 'payment_id', 'amount'],
          rows: [
            [0, 'p1', 20],
            [1, 'p2', 35],
            [2, 'p3', 15],
            [3, 'p4', 40],
            [4, 'p3', 15],
            [5, 'p5', 25],
          ],
        },
        {
          name: 'deliveries',
          columns: ['delivery_no', 'offset_no'],
          rows: [
            [1, 0],
            [2, 1],
            [3, 2],
            [4, 3],
            [5, 2],
            [6, 3],
            [7, 4],
            [8, 5],
          ],
        },
      ],
      code: `-- three sinks fed the same deliveries
SELECT 'append' AS sink, COUNT(*) AS sink_rows, SUM(l.amount) AS total
FROM deliveries d JOIN topic_log l ON l.offset_no = d.offset_no
UNION ALL
SELECT 'upsert on offset_no', COUNT(*), SUM(amount)
FROM (SELECT DISTINCT l.offset_no, l.amount
      FROM deliveries d JOIN topic_log l ON l.offset_no = d.offset_no) AS by_offset
UNION ALL
SELECT 'upsert on payment_id', COUNT(*), SUM(amount)
FROM (SELECT DISTINCT l.payment_id, l.amount
      FROM deliveries d JOIN topic_log l ON l.offset_no = d.offset_no) AS by_payment
ORDER BY sink;`,
      steps: [
        'The producer timed out on p3 and sent it again, so p3 is at offsets 2 and 4; the true total of p1 to p5 is 135.',
        'The consumer wrote offsets 2 and 3, crashed before committing, and on restart delivered them again: deliveries 5 and 6.',
        'Lines 2-3: an append sink keeps all 8 deliveries, 205.',
        'Lines 5-7: an upsert on the offset absorbs the replay but not the resend, which has its own offset: 6 rows, 150.',
        'Lines 9-11: an upsert on payment_id absorbs both, because only the payment\'s id is the same in a replay and a resend: 5 rows, 135.',
      ],
      output: `sink | sink_rows | total
append | 8 | 205
upsert on offset_no | 6 | 150
upsert on payment_id | 5 | 135`,
    },
    exercises: ['de-eos-1', 'de-eos-2', 'de-eos-3', 'de-eos-4', 'de-eos-5'],
  },
  {
    id: 'de_stream_state_joins/1',
    topicKeys: [Topic.DE_STREAM_STATE_JOINS],
    step: 1,
    title: 'State & Stream Joins',
    idea: [
      lines(
        'State is what a streaming job remembers between events: a count per key, the open windows, the ids it has seen, the rows waiting for a join.',
        'It grows with the number of keys and with how long rows are kept, so every piece of state needs a bound: a window the watermark closes, a join bound, or a TTL that drops a key gone quiet.',
      ),
      lines(
        'A join of two streams cannot see both sides whole, as a batch join does.',
        'Each row waits in state until its partner arrives, so the join needs a time bound, such as a payment within 30 minutes of its order.',
        'The bound and the watermark tell the job when a row can no longer match, and only then can it be dropped.',
      ),
      lines(
        'Joining a stream to a table, such as clicks to the product catalog, keeps the table in state from its change stream and looks each event up as it passes.',
        'That lookup gives the value at processing time; when the value at the event\'s time matters, as with a customer\'s region for revenue, join to the version valid then.',
      ),
    ],
    form: {
      language: CodeLanguage.SQL,
      code: `aggregate per key              -> state per key: bound it by a window or TTL
stream joined to stream        -> interval join: both sides buffered, time bound
stream joined to a table       -> table kept in state from its changes, lookup
value as of the event's time    -> join to the version valid at event time
drop a buffered row when the watermark passes its time + the bound`,
    },
    pitfall: lines(
      'A stream-stream join with no time bound.',
      'It works in testing and for weeks in production, then the job runs out of memory, because every row stays in state waiting for a match that might still come.',
    ),
    worked: {
      language: CodeLanguage.SQL,
      tables: [
        {
          name: 'orders',
          columns: ['order_id', 'order_minute'],
          rows: [
            ['o1', 0],
            ['o2', 10],
            ['o3', 25],
            ['o4', 40],
          ],
        },
        {
          name: 'payments',
          columns: ['payment_id', 'order_id', 'pay_minute'],
          rows: [
            ['p1', 'o1', 5],
            ['p2', 'o2', 50],
            ['p3', 'o3', 30],
            ['p4', 'o4', 45],
            ['p5', 'o9', 20],
          ],
        },
      ],
      code: `-- the join as a batch runs it: any payment of the order
SELECT COUNT(*) AS joined_rows
FROM orders o JOIN payments p ON p.order_id = o.order_id;

-- the stream join, bounded: paid from the order's minute to 30 minutes after
SELECT o.order_id, p.payment_id, p.pay_minute - o.order_minute AS minutes_to_pay
FROM orders o
JOIN payments p ON p.order_id = o.order_id
 AND p.pay_minute BETWEEN o.order_minute AND o.order_minute + 30
ORDER BY o.order_id;

-- orders still held in state when the watermark is at minute 50
SELECT order_id FROM orders
WHERE order_minute + 30 > 50
ORDER BY order_id;`,
      steps: [
        'Minute 0 is 10:00, and each side arrives over time, so the job keeps every order and payment in state until its match can no longer come.',
        'Lines 2-3: with no bound, as in a batch, 4 payments find their order, p2 among them, 40 minutes after o2.',
        'Lines 6-10: the stream join allows 30 minutes, so p2 gets no row, and p5, whose order never came, waits in state until the watermark passes it.',
        'Lines 13-15: at a watermark of 50, o1 and o2 can no longer be paid within 30 minutes, so they leave state; o3 and o4 stay.',
        'Without the bound, every order would stay in state forever, waiting for a payment that might still come.',
      ],
      output: `joined_rows
4

order_id | payment_id | minutes_to_pay
o1 | p1 | 5
o3 | p3 | 5
o4 | p4 | 5

order_id
o3
o4`,
    },
    exercises: ['de-sjoin-1', 'de-sjoin-2', 'de-sjoin-3', 'de-sjoin-4', 'de-sjoin-5'],
  },
  {
    id: 'de_partition_skew/1',
    topicKeys: [Topic.DE_PARTITION_SKEW],
    step: 1,
    title: 'Partitioning, Skew & Hot Keys',
    idea: [
      lines(
        'Data too big for one machine is split into partitions by a key, and each machine works on its partitions at the same time as the others.',
        'Hash partitioning sends a row to hash(key) % N, which spreads the keys evenly; range partitioning gives each partition a range of key values, which keeps neighbouring keys together for range reads.',
        'Either way, every row of one key lands in the same partition.',
      ),
      lines(
        'A parallel step ends when its slowest partition ends, so the balance of rows per partition sets the time, not the total.',
        'Skew is a few keys holding a big share of the rows: a NULL, a default such as \'unknown\', one huge customer.',
        'Their partition is far bigger than the others, and more machines do not help, since one key still goes to one partition.',
      ),
      lines(
        'Choose the key from the data and the jobs: many values, none of them dominant, and the key the main jobs group or join by, so their rows are already together.',
        'A range on a key that grows with time sends every new row to the newest range, so that partition takes all the writes.',
        'When one key is hot anyway, salt it: add a sub-key such as order_id % 8, work on the parts in parallel, then combine the partial results; for a join to a small table, broadcast the small table and move no rows at all.',
      ),
    ],
    form: {
      language: CodeLanguage.SQL,
      code: `spread rows evenly           -> hash a key with many values, none dominant
read ranges of the key       -> range partition (the newest range takes the writes)
one key holds a big share    -> salt it, then combine the partial results
join to a small table        -> broadcast the small table: no shuffle
time of a step = time of its largest partition, not rows / machines`,
    },
    pitfall: lines(
      'Adding machines to a skewed job.',
      'Every row of the hot key still goes to one partition on one machine, so the step takes as long as before and the new machines finish early and wait.',
    ),
    worked: {
      language: CodeLanguage.SQL,
      tables: [
        {
          name: 'orders',
          columns: ['order_id', 'customer_id', 'amount'],
          rows: [
            [1, 8, 10],
            [2, 8, 20],
            [3, 3, 15],
            [4, 8, 5],
            [5, 5, 30],
            [6, 8, 25],
            [7, 8, 10],
            [8, 6, 40],
            [9, 8, 15],
            [10, 1, 20],
            [11, 8, 30],
            [12, 8, 5],
          ],
        },
      ],
      code: `-- rows per partition, hashing customer_id over 4
SELECT customer_id % 4 AS part, COUNT(*) AS row_count
FROM orders
GROUP BY customer_id % 4
ORDER BY part;

-- customer 8 salted over the 4 by order_id % 4
WITH salted AS (
  SELECT CASE WHEN customer_id = 8 THEN order_id % 4
              ELSE customer_id % 4 END AS part
  FROM orders
)
SELECT part, COUNT(*) AS row_count
FROM salted
GROUP BY part
ORDER BY part;

-- step 2: add up each customer's partial sums
WITH partial AS (
  SELECT customer_id, order_id % 4 AS salt,
         SUM(amount) AS part_sum
  FROM orders
  GROUP BY customer_id, order_id % 4
)
SELECT customer_id, SUM(part_sum) AS total
FROM partial
GROUP BY customer_id
ORDER BY customer_id;`,
      steps: [
        'Customer 8, a marketplace, has 8 of the 12 orders, and the job totals amount per customer on 4 machines.',
        'Lines 2-5: hashing customer_id puts all 8 of customer 8\'s orders in partition 0, which has 8 rows while the others have 1 or 2, so the job waits on one machine.',
        'Lines 8-16: salting customer 8 by order_id % 4 spreads its orders over all four partitions, and the largest now holds 4 rows.',
        'Lines 19-28: the salted job sums each customer by salt, and a second, small step adds up the parts, so customer 8\'s total is 120 either way.',
        'Only the hot key needs a salt; the other customers keep one partition each.',
      ],
      output: `part | row_count
0 | 8
1 | 2
2 | 1
3 | 1

part | row_count
0 | 2
1 | 4
2 | 3
3 | 3

customer_id | total
1 | 20
3 | 15
5 | 30
6 | 40
8 | 120`,
    },
    exercises: ['de-skew-1', 'de-skew-2', 'de-skew-3', 'de-skew-4', 'de-skew-5'],
  },
  {
    id: 'de_replication_consistency/1',
    topicKeys: [Topic.DE_REPLICATION_CONSISTENCY],
    step: 1,
    title: 'Replication & Consistency',
    idea: [
      lines(
        'Replication keeps copies of the same data on several machines, so the data survives a machine failing and reads can be spread over the copies.',
        'Most systems have one leader that takes the writes and sends each change, in order, through a replication log to its followers.',
        'Each follower applies the log up to its own position, so at any moment the replicas can be at different points in it.',
      ),
      lines(
        'The choice is when the leader tells the client a write is done.',
        'Synchronous replication waits until a follower has the write: a failover loses nothing, but every write waits, and a follower that is down stops the writes that wait for it.',
        'Asynchronous replication answers at once: writes are fast, but followers lag, so a read from one can be stale, and if the leader dies, the writes it had not yet sent are lost.',
      ),
      lines(
        'A lagging follower breaks read-your-writes: a user saves and then reads their old value.',
        'Read a user\'s own data from the leader for a short time after they write, or wait until the replica has reached their write\'s position.',
        'Without a leader, a quorum does the same job: with N replicas, a write waits for W of them and a read asks R, and when W + R > N every read meets the latest write.',
      ),
      lines(
        'When the network splits, a replica cut off from the majority must refuse requests (consistent) or answer with what it has (available, maybe stale): that is the choice the CAP theorem names.',
        'Choose per kind of data: a balance or a unique name should refuse, a like count or a product page can answer.',
      ),
    ],
    form: {
      language: CodeLanguage.SQL,
      code: `no acknowledged write may be lost -> synchronous to at least one follower
writes must stay fast             -> asynchronous: reads lag, failover loses the tail
a user must see their own write   -> read it from the leader, or wait for its position
N replicas, no leader             -> W + R > N: every read meets the latest write
network split                     -> refuse (consistent) or answer stale (available)`,
    },
    pitfall: lines(
      'Treating a read replica as the database.',
      'A job that writes to the leader and then checks its own write on a replica can find nothing and act again: charge a card twice, send a second email.',
    ),
    worked: {
      language: CodeLanguage.SQL,
      tables: [
        {
          name: 'writes',
          columns: ['lsn', 'account_id', 'balance'],
          rows: [
            [101, 7, 50],
            [102, 9, 20],
            [103, 7, 80],
            [104, 7, 65],
            [105, 9, 0],
          ],
        },
        {
          name: 'replicas',
          columns: ['replica_name', 'applied_lsn'],
          rows: [
            ['leader', 105],
            ['f1', 105],
            ['f2', 103],
            ['f3', 101],
          ],
        },
      ],
      code: `-- account 7's balance, as each replica answers now
SELECT r.replica_name, w.balance AS balance_7
FROM replicas r
JOIN writes w ON w.account_id = 7
 AND w.lsn = (SELECT MAX(x.lsn) FROM writes x
   WHERE x.account_id = 7
     AND x.lsn <= r.applied_lsn)
ORDER BY r.replica_name;

-- each follower's lag behind the leader, in writes
SELECT f.replica_name,
       l.applied_lsn - f.applied_lsn AS writes_behind
FROM replicas f
JOIN replicas l ON l.replica_name = 'leader'
WHERE f.replica_name <> 'leader'
ORDER BY f.replica_name;

-- writes lost if the leader died now and f2 took over
SELECT lsn, account_id, balance
FROM writes
WHERE lsn > (SELECT applied_lsn FROM replicas
             WHERE replica_name = 'f2')
ORDER BY lsn;`,
      steps: [
        'writes is the leader\'s log, one position (lsn) per write, and the leader replicates it asynchronously to f1, f2 and f3.',
        'Lines 2-8: each replica answers with the newest write for account 7 that it has applied, so the leader and f1 say 65, f2 says 80 and f3 says 50.',
        'Lines 11-16: f1 is caught up, f2 is 2 writes behind and f3 is 4; that lag is how stale a read from each can be.',
        'Lines 19-23: with async replication the leader has acknowledged writes 104 and 105, so promoting f2 would lose them.',
        'Promote the follower with the highest position (f1 here), and wait for at least one follower on each write if none may be lost.',
      ],
      output: `replica_name | balance_7
f1 | 65
f2 | 80
f3 | 50
leader | 65

replica_name | writes_behind
f1 | 0
f2 | 2
f3 | 4

lsn | account_id | balance
104 | 7 | 65
105 | 9 | 0`,
    },
    exercises: ['de-replica-1', 'de-replica-2', 'de-replica-3', 'de-replica-4', 'de-replica-5'],
  },
  {
    id: 'de_storage_engines/1',
    topicKeys: [Topic.DE_STORAGE_ENGINES],
    step: 1,
    title: 'Storage Engines: B-Trees, LSM Trees & Bloom Filters',
    idea: [
      lines(
        'A storage engine decides how a database keeps its keys on disk, and the two common designs make opposite trades.',
        'A B-tree keeps keys sorted in fixed-size pages and changes a page in place: a lookup reads one path from the root to a leaf, three or four pages, and a write rewrites the page that holds its key, a random write.',
      ),
      lines(
        'An LSM tree (log-structured merge tree) turns writes into appends.',
        'A write goes to a log on disk, for safety, and into a sorted table in memory (the memtable); when that fills, it is written out once as a sorted file that is never changed again.',
        'An update or a delete is just a newer entry, a delete being a tombstone, and a read checks the memtable and then the files newest first, taking the first entry it finds for the key.',
      ),
      lines(
        'Files pile up, so reads check more of them and old versions take space.',
        'Compaction merges files, keeps the newest entry per key, drops tombstones once no older file can hold the key, and writes fewer, bigger files: it rewrites the same data again and again in exchange for fast reads.',
        'A bloom filter per file answers "definitely not here" or "maybe", so a lookup skips most files; a "maybe" can be wrong (a false positive), a "no" cannot, and more bits per key make the wrong "maybe"s rarer.',
      ),
      lines(
        'So choose by the workload: an LSM tree for heavy, steady writes and reads of recent keys, a B-tree for read-heavy data with updates in place and range scans.',
      ),
    ],
    form: {
      language: CodeLanguage.SQL,
      code: `heavy writes, reads of recent keys     -> LSM tree: appends now, merges later
read-heavy, updates in place, ranges   -> B-tree: one path of pages per lookup
LSM read: memtable, then files newest first; the first entry found wins
compaction: newest entry per key, tombstones dropped, fewer files
bloom filter: "no" is certain, "maybe" can be wrong; skips files on lookups, not scans`,
    },
    pitfall: lines(
      'Expecting a delete to give space back in an LSM tree.',
      'A delete adds a tombstone; the old value and the tombstone stay on disk until compaction rewrites every file that holds the key, so a large delete first makes the table bigger and its reads slower.',
    ),
    worked: {
      language: CodeLanguage.SQL,
      tables: [
        {
          name: 'entries',
          columns: ['source', 'written_seq', 'fruit', 'stock'],
          rows: [
            ['sst1', 1, 'apple', 3],
            ['sst1', 1, 'banana', 7],
            ['sst1', 1, 'cherry', 2],
            ['sst2', 2, 'apple', 5],
            ['sst2', 2, 'date', 4],
            ['sst3', 3, 'banana', null],
            ['sst3', 3, 'cherry', 9],
            ['memtable', 4, 'apple', 6],
          ],
        },
      ],
      code: `-- what a read of each key returns: its newest entry
SELECT e.fruit, e.stock, e.source
FROM entries e
WHERE e.written_seq = (
  SELECT MAX(x.written_seq) FROM entries x
  WHERE x.fruit = e.fruit)
ORDER BY e.fruit;

-- compaction of sst1, sst2 and sst3 into one file
SELECT e.fruit, e.stock
FROM entries e
WHERE e.source <> 'memtable'
  AND e.stock IS NOT NULL
  AND e.written_seq = (
    SELECT MAX(x.written_seq) FROM entries x
    WHERE x.fruit = e.fruit AND x.source <> 'memtable')
ORDER BY e.fruit;`,
      steps: [
        'Three files were flushed from memory in turn (sst1 the oldest), and the memtable holds the newest write; a NULL stock is a tombstone, a delete.',
        'Lines 2-7: a read takes each key\'s newest entry, so apple comes from the memtable, banana reads as deleted, and cherry and date come from the files.',
        'Lines 10-17: compaction keeps the newest entry per key among the three files and drops banana, whose newest entry is a tombstone in the oldest files.',
        'The three files held 7 entries; the compacted file holds 3, so a read has one file to check where it had three, and the old versions\' space comes back.',
        'The memtable\'s apple = 6 stays newer than the compacted file\'s apple = 5 until it is flushed and compacted in turn.',
      ],
      output: `fruit | stock | source
apple | 6 | memtable
banana | NULL | sst3
cherry | 9 | sst3
date | 4 | sst2

fruit | stock
apple | 5
cherry | 9
date | 4`,
    },
    exercises: ['de-engine-1', 'de-engine-2', 'de-engine-3', 'de-engine-4', 'de-engine-5'],
  },
  {
    id: 'de_orchestration_dags/1',
    topicKeys: [Topic.DE_ORCHESTRATION_DAGS],
    step: 1,
    title: 'Orchestration: DAGs, Dependencies, Sensors & Retries',
    idea: [
      lines(
        'An orchestrator runs a pipeline as a DAG (directed acyclic graph): tasks, and edges that say which task needs which.',
        'A task runs when every task upstream of it has succeeded, so tasks with no path between them run side by side, and a run lasts as long as its longest path, the critical path.',
        'When a task fails after its retries, the tasks downstream of it are not run, and the other branches carry on.',
      ),
      lines(
        'Each run is for one slice of data, its run_date, which the orchestrator passes to every task.',
        'A schedule only decides when a run begins; the order inside the run comes from the edges.',
        'Input that arrives from outside at an unknown time is waited for with a sensor: a task that checks for the file or partition and succeeds once it is there, with a timeout so that a missing input becomes a failure and an alert.',
      ),
      lines(
        'Retries are for transient failures, such as a timeout or a service that is briefly down, tried a few times with growing waits.',
        'A failure that repeats the same way (a bug, a renamed column, a malformed record) is not helped by retrying: fail fast, or set the bad record aside in a rejects table and load the rest.',
        'A retry runs the task again on the same input, so every task must be idempotent for its run_date, as Moving Data\'s Re-runs & Idempotent Loads teaches.',
      ),
    ],
    form: {
      language: CodeLanguage.SQL,
      code: `a task needs another's output  -> an edge: it runs once every upstream task succeeded
an upstream task failed         -> downstream not run; the other branches carry on
input lands at an unknown time  -> wait on it: a sensor with a timeout, not a clock time
transient error (timeout, 503)  -> retry a few times, with growing waits
the same error every time       -> fail fast, or set the bad record aside
every task, for its run_date    -> idempotent, so a retry or a re-run is safe`,
    },
    pitfall: lines(
      'Ordering tasks by the clock: "the load runs at 02:00 because the extract is done by then".',
      'On the night the extract is late, the load reads half a day, succeeds, and every task shows green.',
    ),
    worked: {
      language: CodeLanguage.SQL,
      tables: [
        {
          name: 'tasks',
          columns: ['task_name', 'minutes'],
          rows: [
            ['extract_orders', 20],
            ['extract_customers', 10],
            ['clean_orders', 25],
            ['dim_customers', 15],
            ['fact_orders', 20],
            ['revenue_report', 5],
            ['customer_report', 10],
          ],
        },
        {
          name: 'edges',
          columns: ['upstream', 'downstream'],
          rows: [
            ['extract_orders', 'clean_orders'],
            ['clean_orders', 'fact_orders'],
            ['extract_customers', 'dim_customers'],
            ['dim_customers', 'fact_orders'],
            ['dim_customers', 'customer_report'],
            ['fact_orders', 'revenue_report'],
          ],
        },
      ],
      code: `-- when each task finishes, if every task succeeds
WITH paths (task_name, finish) AS (
  SELECT t.task_name, t.minutes
  FROM tasks t
  WHERE NOT EXISTS (SELECT 1 FROM edges e
                    WHERE e.downstream = t.task_name)
  UNION ALL
  SELECT e.downstream, p.finish + t.minutes
  FROM paths p
  JOIN edges e ON e.upstream = p.task_name
  JOIN tasks t ON t.task_name = e.downstream
)
SELECT task_name, MAX(finish) AS finishes_at_minute
FROM paths
GROUP BY task_name
ORDER BY finishes_at_minute, task_name;

-- what is not run when dim_customers fails after its retries
WITH down (task_name) AS (
  SELECT downstream FROM edges
  WHERE upstream = 'dim_customers'
  UNION ALL
  SELECT e.downstream
  FROM edges e
  JOIN down d ON e.upstream = d.task_name
)
SELECT DISTINCT task_name AS not_run
FROM down
ORDER BY not_run;`,
      steps: [
        'tasks holds each task\'s run time in minutes and edges the dependencies: fact_orders needs both clean_orders and dim_customers.',
        'Lines 2-16: a task finishes at its own minutes plus the latest finish among its upstream tasks, starting from the tasks with nothing upstream.',
        'fact_orders waits for clean_orders at minute 45, not dim_customers at 25, so the run ends at minute 70, though its tasks add up to 105.',
        'Lines 19-29: if dim_customers fails after its retries, everything reachable from it is not run, while extract_orders and clean_orders still finish.',
        'Once the cause is fixed, clearing dim_customers runs it and those three tasks again for the same run_date, and nothing upstream runs twice.',
      ],
      output: `task_name | finishes_at_minute
extract_customers | 10
extract_orders | 20
dim_customers | 25
customer_report | 35
clean_orders | 45
fact_orders | 65
revenue_report | 70

not_run
customer_report
fact_orders
revenue_report`,
    },
    exercises: ['de-dag-1', 'de-dag-2', 'de-dag-3', 'de-dag-4', 'de-dag-5'],
  },
  {
    id: 'de_quality_gates/1',
    topicKeys: [Topic.DE_QUALITY_GATES],
    step: 1,
    title: 'Data Quality: Tests, Contracts & Circuit Breakers',
    idea: [
      lines(
        'A pipeline can run without an error and still deliver wrong data: a NULL key, a status nobody expects, an order for a customer who does not exist.',
        'So write down what the readers rely on as tests, each a query for the rows that break one rule: not NULL, unique, one of the accepted values, a key that exists in its dimension, a row count near normal.',
      ),
      lines(
        'Run the tests on the new batch before anyone can read it: write it to a staging table, audit it there, and publish it only if it passes (write, audit, publish).',
        'A failing blocking test holds the batch, so readers keep yesterday\'s correct data while the owner is alerted: a circuit breaker, where stale and right beats fresh and wrong.',
        'Rules that readers do not depend on warn instead, so a small issue does not make everything stale.',
      ),
      lines(
        'The producer of a feed can promise its shape in a data contract: the columns and types, the keys, what each value means, and how fresh it is.',
        'The contract is checked on each batch at the boundary, so a renamed column fails loudly instead of loading as NULLs, and a breaking change ships as a new version beside the old one.',
      ),
    ],
    form: {
      language: CodeLanguage.SQL,
      code: `a rule the readers rely on  -> a test: a query for the rows that break it
where it runs               -> on the batch in staging, before it is published
a blocking test fails       -> hold the batch: readers keep yesterday's data, owner alerted
a warning test fails        -> publish, and alert the owner
a producer's feed           -> a contract: schema, keys, meaning, checked on each batch
a breaking change           -> a new version beside the old; readers move in their time`,
    },
    pitfall: lines(
      'Testing the published table after the load.',
      'By the time the test fails, dashboards and downstream jobs have read the bad batch, and a NULL rate measured over years of rows hides a bad day.',
    ),
    worked: {
      language: CodeLanguage.SQL,
      tables: [
        {
          name: 'staging_orders',
          columns: ['order_id', 'customer_id', 'status', 'amount'],
          rows: [
            [201, 11, 'paid', 40],
            [202, 12, 'paid', 25],
            [203, null, 'paid', 30],
            [204, 13, 'shipped', 15],
            [205, 19, 'paid', 60],
            [206, 12, 'refunded', 20],
          ],
        },
        {
          name: 'dim_customers',
          columns: ['customer_id', 'segment'],
          rows: [
            [11, 'retail'],
            [12, 'business'],
            [13, 'retail'],
            [14, 'retail'],
          ],
        },
      ],
      code: `-- each blocking test counts the batch rows that break one rule
SELECT 'customer_id not null' AS test_name, COUNT(*) AS failing_rows
FROM staging_orders WHERE customer_id IS NULL
UNION ALL
SELECT 'status accepted', COUNT(*)
FROM staging_orders
WHERE status NOT IN ('paid', 'refunded', 'cancelled')
UNION ALL
SELECT 'customer exists', COUNT(*)
FROM staging_orders s
WHERE s.customer_id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM dim_customers d
                  WHERE d.customer_id = s.customer_id)
ORDER BY test_name;

-- the gate: publish only when no blocking test found a row
SELECT CASE WHEN COUNT(*) = 0 THEN 'publish'
            ELSE 'hold' END AS decision
FROM staging_orders s
WHERE s.customer_id IS NULL
   OR s.status NOT IN ('paid', 'refunded', 'cancelled')
   OR NOT EXISTS (SELECT 1 FROM dim_customers d
                  WHERE d.customer_id = s.customer_id);`,
      steps: [
        'staging_orders is tonight\'s batch, written where no dashboard reads it; dim_customers is the dimension its orders must point at.',
        'Lines 2-14: each test counts the rows that break one rule: order 203 has no customer, 204 has a status nobody expects, and 205 points at customer 19, whom dim_customers does not have.',
        'Lines 17-23: the gate checks every blocking rule at once and finds rows, so the batch is held.',
        'fact_orders keeps yesterday\'s data and the owner gets the three failing rows; once the cause is fixed, the batch is tested again and published.',
      ],
      output: `test_name | failing_rows
customer exists | 1
customer_id not null | 1
status accepted | 1

decision
hold`,
    },
    exercises: ['de-quality-1', 'de-quality-2', 'de-quality-3', 'de-quality-4', 'de-quality-5'],
  },
  {
    id: 'de_pipeline_observability/1',
    topicKeys: [Topic.DE_PIPELINE_OBSERVABILITY],
    step: 1,
    title: 'Observability & Lineage',
    idea: [
      lines(
        'A job reports whether it ran, not whether its data is right: a short file, a stale file loaded again or a renamed column all load without an error.',
        'So watch the tables themselves: freshness (how old the newest data is, by the data\'s own time), volume (rows against a normal day), schema (columns and types) and values (null rates, ranges).',
        'Compare each with what is normal for that table, such as the same weekday over recent weeks, and alert the table\'s owner when an expectation its readers rely on breaks, rather than a shared channel on every wobble.',
      ),
      lines(
        'Lineage is the graph of what each table, and each column, is built from.',
        'Take it from the jobs as they run (the SQL they execute, or run events in an open standard such as OpenLineage), so it cannot drift from the code the way a hand-drawn diagram does.',
      ),
      lines(
        'Lineage answers two questions.',
        'When a number is wrong, walk upstream from it to the first table that is wrong while everything it is built from is right: that is the cause, and the tables after it are symptoms.',
        'Before a change, or after an incident, walk downstream as far as it goes to list every table, report and owner affected; column-level lineage narrows the list to what carries the value.',
      ),
    ],
    form: {
      language: CodeLanguage.SQL,
      code: `job succeeded, is the data right? -> watch tables: freshness, volume, schema, values
what is normal                    -> per table: the same weekday over recent weeks
who is alerted                    -> the owner, when readers' expectations break
a number looks wrong              -> walk upstream: the first bad table with good inputs
a change or an incident           -> walk downstream: every table and owner reached
lineage                           -> from the jobs' runs, by column where possible`,
    },
    pitfall: lines(
      'Watching only the jobs.',
      'The worst incidents are jobs that succeed on bad input: every task is green while a table holds a sixteenth of its usual rows.',
    ),
    worked: {
      language: CodeLanguage.SQL,
      tables: [
        {
          name: 'lineage',
          columns: ['source_table', 'target_table'],
          rows: [
            ['orders_raw', 'orders_clean'],
            ['orders_clean', 'fact_orders'],
            ['customers_raw', 'dim_customers'],
            ['dim_customers', 'fact_orders'],
            ['fact_orders', 'revenue_daily'],
            ['revenue_daily', 'exec_dashboard'],
            ['dim_customers', 'churn_report'],
          ],
        },
        {
          name: 'table_health',
          columns: ['table_name', 'rows_yesterday', 'rows_usual'],
          rows: [
            ['orders_raw', 48000, 48000],
            ['orders_clean', 47800, 47800],
            ['customers_raw', 9100, 9000],
            ['dim_customers', 4500, 9000],
            ['fact_orders', 23900, 47800],
            ['revenue_daily', 1, 1],
            ['exec_dashboard', 1, 1],
            ['churn_report', 4500, 9000],
          ],
        },
      ],
      code: `-- walk upstream from the dashboard, with each table's health
WITH up (table_name, depth) AS (
  SELECT source_table, 1 FROM lineage
  WHERE target_table = 'exec_dashboard'
  UNION ALL
  SELECT l.source_table, u.depth + 1
  FROM lineage l
  JOIN up u ON l.target_table = u.table_name
)
SELECT u.table_name, u.depth, h.rows_yesterday, h.rows_usual
FROM up u
JOIN table_health h ON h.table_name = u.table_name
ORDER BY u.depth, u.table_name;

-- walk downstream from the root cause: what it reached
WITH down (table_name) AS (
  SELECT target_table FROM lineage
  WHERE source_table = 'dim_customers'
  UNION ALL
  SELECT l.target_table
  FROM lineage l
  JOIN down d ON l.source_table = d.table_name
)
SELECT DISTINCT table_name AS affected
FROM down
ORDER BY affected;`,
      steps: [
        'The exec dashboard shows half of yesterday\'s revenue; lineage says what each table is built from, and table_health compares yesterday\'s rows with a normal day.',
        'Lines 2-13: the upstream walk lists every table the dashboard depends on, nearest first.',
        'revenue_daily has its usual single row (its value is what is wrong), and fact_orders is at half; of its inputs, orders_clean is normal and dim_customers is at half, while customers_raw, the input of dim_customers, is normal.',
        'So dim_customers is the root cause, the first table that is wrong while its inputs are right; fact_orders lost the orders of the missing customers in its join.',
        'Lines 16-26: the downstream walk from dim_customers lists what to rebuild and whose owners to tell, churn_report included, though nobody had reported it.',
      ],
      output: `table_name | depth | rows_yesterday | rows_usual
revenue_daily | 1 | 1 | 1
fact_orders | 2 | 23900 | 47800
dim_customers | 3 | 4500 | 9000
orders_clean | 3 | 47800 | 47800
customers_raw | 4 | 9100 | 9000
orders_raw | 4 | 48000 | 48000

affected
churn_report
exec_dashboard
fact_orders
revenue_daily`,
    },
    exercises: ['de-lineage-1', 'de-lineage-2', 'de-lineage-3', 'de-lineage-4', 'de-lineage-5'],
  },
  {
    id: 'de_access_governance/1',
    topicKeys: [Topic.DE_ACCESS_GOVERNANCE],
    step: 1,
    title: 'Governance & Access',
    idea: [
      lines(
        'Governance decides who may see and change which data, and keeps the record to show it.',
        'Grant access to roles that match jobs, and make people members of roles (role-based access control): a joiner, a mover or a leaver is one change, and a review reads a few roles instead of thousands of personal grants.',
        'Each role gets the least its job needs (least privilege), and broad roles such as all_staff get very little, because they reach everyone.',
      ),
      lines(
        'Inside a table, the rules can follow the data.',
        'Tag personal columns (PII, personally identifiable information) once in the catalog, and a masking policy hides or hashes them for every role without the need; a keyed hash still joins, since equal values give equal hashes.',
        'A row filter shows each user only their rows, from an attribute such as their region (attribute-based access).',
        'Both are enforced by the platform on every query, so no dashboard, notebook or export gets around them.',
      ),
      lines(
        'The catalog records what each table is, who owns it and what is sensitive, and the audit log records who read what.',
        'Erasing a person (the right to be forgotten) means every copy: rows in many tables, and the older snapshots a table format keeps for time travel.',
        'Keeping personal fields in one table, keyed by a pseudonymous key that the other tables carry, makes an erasure one delete plus snapshot expiry.',
      ),
    ],
    form: {
      language: CodeLanguage.SQL,
      code: `who can read it        -> roles that match jobs; people are members of roles
how much               -> least privilege: the tables, columns, rows the job needs
personal columns       -> tagged once; masked or hashed for roles without the need
rows by region or team -> a row filter from the user's attributes, in the platform
erase a person         -> every copy and snapshot; best, PII in one keyed table`,
    },
    pitfall: lines(
      'Protecting data in the tool instead of on the data.',
      'A dashboard that shows *** while the role can query the raw column, or a "safe" copy made for one team, leaves the data open to any query and adds one more place to secure, audit and erase.',
    ),
    worked: {
      language: CodeLanguage.SQL,
      tables: [
        {
          name: 'customers',
          columns: ['customer_id', 'region', 'email', 'lifetime_value'],
          rows: [
            [1, 'EU', 'ana@example.com', 420],
            [2, 'US', 'bo@example.com', 90],
            [3, 'EU', 'cy@example.com', 150],
            [4, 'APAC', 'di@example.com', 300],
            [5, 'EU', 'ed@example.com', 75],
          ],
        },
        {
          name: 'user_access',
          columns: ['user_name', 'region', 'sees_personal'],
          rows: [
            ['lena', 'EU', 0],
            ['sam', 'EU', 1],
            ['omar', 'US', 0],
          ],
        },
      ],
      code: `-- one policy for every reader: a row filter and a column mask
CREATE VIEW customers_policy AS
SELECT u.user_name, c.customer_id, c.region,
       CASE WHEN u.sees_personal = 1 THEN c.email
            ELSE '***' END AS email,
       c.lifetime_value
FROM customers c
JOIN user_access u ON u.region = c.region;
GO
-- what lena, an EU analyst, gets from any query
SELECT customer_id, email, lifetime_value
FROM customers_policy
WHERE user_name = 'lena'
ORDER BY customer_id;

-- what sam, in EU support, gets
SELECT customer_id, email
FROM customers_policy
WHERE user_name = 'sam'
ORDER BY customer_id;`,
      steps: [
        'customers holds personal emails; user_access gives each user\'s region and whether their job needs personal data.',
        'Lines 2-8: the policy joins each row to the users of its region (the row filter) and shows email only to users who may see it (the mask).',
        'A real platform takes the user from the session; user_name stands in for it here.',
        'Lines 11-14: lena sees the three EU customers, with lifetime value for the analysis and the email masked.',
        'Lines 17-20: sam, in support, sees the same three rows with their emails, since support\'s job is to contact them.',
        'Neither sees the US or APAC rows, and because the rule sits on the data, a notebook or an export gets the same answer as the dashboard.',
      ],
      output: `customer_id | email | lifetime_value
1 | *** | 420
3 | *** | 150
5 | *** | 75

customer_id | email
1 | ana@example.com
3 | cy@example.com
5 | ed@example.com`,
    },
    exercises: ['de-access-1', 'de-access-2', 'de-access-3', 'de-access-4', 'de-access-5'],
  },
  {
    id: 'de_data_for_ai/1',
    topicKeys: [Topic.DE_DATA_FOR_AI],
    step: 1,
    title: 'Data for AI',
    idea: [
      lines(
        'Many AI features read company data through a pipeline.',
        'For an assistant that answers from documents (retrieval-augmented generation), the pipeline splits each document into chunks, turns each chunk into an embedding (a vector of numbers, placed so that texts with similar meaning are close) and stores it in a vector index with its source, version and access group.',
        'A question is embedded with the same model, the nearest chunks the user may see are retrieved, and the language model answers from them.',
      ),
      lines(
        'The data engineering decisions are the familiar ones.',
        'Chunks split at headings, with a little overlap, keep each chunk about one thing.',
        'The index goes stale when its sources change, so each run finds changed documents by content hash, replaces their chunks, and deletes the chunks of removed documents.',
        'Vectors from different embedding models cannot be compared, so one index holds one model\'s vectors, and a new model means a new index filled beside the old one before questions switch to it.',
      ),
      lines(
        'Training data for a model has its own trap: leakage.',
        'Each training row\'s features must be computed as of its prediction date, from data known then (a point-in-time join), or the model learns from the future and does worse in use than in training.',
        'Scores that are read on a schedule are produced in batch into a table; real-time scoring is for inputs that exist only at that moment, such as a basket at checkout.',
      ),
    ],
    form: {
      language: CodeLanguage.SQL,
      code: `documents for an assistant -> chunk, embed, store with source, hash, access group
a document changes or goes -> embed it again by content hash; delete its old chunks
who may see a chunk        -> filter by the user's access inside the search
a new embedding model      -> a new index beside the old, then switch the questions
training features          -> as of each row's prediction date, never later`,
    },
    pitfall: lines(
      'Embedding the documents once and never again.',
      'The index keeps answering from old versions of a policy, and a deleted document keeps being cited, with no error anywhere.',
    ),
    worked: {
      language: CodeLanguage.SQL,
      tables: [
        {
          name: 'documents',
          columns: ['doc_id', 'content_hash'],
          rows: [
            [1, 'a91'],
            [2, 'c07'],
            [3, 'f3e'],
            [5, 'd44'],
          ],
        },
        {
          name: 'index_chunks',
          columns: ['chunk_id', 'doc_id', 'content_hash'],
          rows: [
            [101, 1, 'a91'],
            [102, 1, 'a91'],
            [103, 2, 'c06'],
            [104, 2, 'c06'],
            [105, 3, 'f3e'],
            [106, 4, 'b10'],
          ],
        },
      ],
      code: `-- documents to chunk and embed tonight: new, or changed since indexed
SELECT d.doc_id,
       CASE WHEN NOT EXISTS (SELECT 1 FROM index_chunks i
                             WHERE i.doc_id = d.doc_id)
            THEN 'new' ELSE 'changed' END AS reason
FROM documents d
WHERE NOT EXISTS (SELECT 1 FROM index_chunks i
                  WHERE i.doc_id = d.doc_id
                    AND i.content_hash = d.content_hash)
ORDER BY d.doc_id;

-- chunks to delete: old versions, and documents removed at the source
SELECT i.chunk_id, i.doc_id
FROM index_chunks i
WHERE NOT EXISTS (SELECT 1 FROM documents d
                  WHERE d.doc_id = i.doc_id
                    AND d.content_hash = i.content_hash)
ORDER BY i.chunk_id;`,
      steps: [
        'documents holds each document\'s current content hash, and index_chunks the chunks in the vector index, with the hash of the text each was embedded from.',
        'Lines 2-10: a document is chunked and embedded again when no chunk carries its current hash: document 2 changed (c06 to c07) and document 5 is new.',
        'Lines 13-18: a chunk is deleted when its document no longer has that hash: document 2\'s two old chunks, and document 4\'s chunk, since it was removed at the source.',
        'Documents 1 and 3 are unchanged, so their three chunks stay and cost nothing tonight.',
        'Replacing a document\'s chunks in one step, with its access group on every chunk, keeps one version of each document in the index and lets the search filter by who is asking.',
      ],
      output: `doc_id | reason
2 | changed
5 | new

chunk_id | doc_id
103 | 2
104 | 2
106 | 4`,
    },
    exercises: ['de-rag-1', 'de-rag-2', 'de-rag-3', 'de-rag-4', 'de-rag-5'],
  },
];
