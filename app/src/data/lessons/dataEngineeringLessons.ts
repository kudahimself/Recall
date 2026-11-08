/**
 * Data Engineering lessons, one per topic, in course order.
 *
 * Section Storage & Files (the second rewritten section) comes first on the
 * path, then Warehouses, Lakes & Table Formats (the third), then Moving Data
 * (the first section of the decisions-and-designs rewrite), and then Modeling
 * for Analytics (the fourth): every topic of each. Each rule card teaches the decision rule as its form
 * and works one scenario on small tables; the SQL is T-SQL that
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
];
