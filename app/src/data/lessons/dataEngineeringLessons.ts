/**
 * Data Engineering lessons, one per topic, in course order.
 *
 * Section Storage & Files (the second rewritten section) comes first on the
 * path and then Moving Data (the first section of the decisions-and-designs
 * rewrite): every topic of each. Each rule card teaches the decision rule as its form
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
];
