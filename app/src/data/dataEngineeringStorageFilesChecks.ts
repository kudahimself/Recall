import { OutcomeCheck } from './dataEngineeringMovingDataChecks';

/**
 * How each predict-the-outcome answer in Storage & Files is checked by running
 * it. The format is the one of dataEngineeringMovingDataChecks.ts:
 * scripts/check-outcomes.js (run by `npm test`) creates the question's `tables`
 * in SQLite (sql.js), each named by the first word of its title, runs the
 * check, and compares the last result set with the question's `answer`.
 * Files are modelled as tables of what a reader sees (column widths, row-group
 * min and max, file sizes), so each answer is a query; the two that are about
 * a process (a writer killed mid-file, a copy killed mid-way) are simulated in
 * Python and print the rows or objects that survive.
 */
export const STORAGE_FILES_OUTCOME_CHECKS: Record<string, OutcomeCheck> = {
  // ── Rows vs Columns ──
  // A columnar file reads only the chunks of the column the query names.
  'de-layout-2': {
    sql: `SELECT bytes_per_value * 2000000 / 1000000 FROM ride_columns WHERE column_name = 'fare_cents';`,
  },
  // One chunk per column gets a value.
  'de-layout-3': { sql: `SELECT COUNT(*) FROM customer_columns;` },
  // Run-length pairs of the country column in the order written: one per run of equal values.
  'de-layout-4': {
    sql: `CREATE TABLE written AS SELECT country FROM visits ORDER BY country, visit_id;
SELECT COUNT(*) FROM (
  SELECT country, LAG(country) OVER (ORDER BY rowid) AS prev FROM written
) WHERE prev IS NULL OR prev <> country;`,
  },
  // Each query reads its own columns, all 10,000,000 rows, no shared cache.
  'de-layout-8': {
    sql: `SELECT SUM(c.bytes_per_value) * 10000000 / 1000000
FROM nightly_queries q JOIN event_columns c ON c.column_name = q.column_name;`,
  },

  // ── File Formats ──
  // The values that no longer read back as the file held them when typed as integers.
  'de-format-2': {
    sql: `SELECT COUNT(*) FROM zip_cells WHERE CAST(CAST(zip AS INTEGER) AS TEXT) <> zip;`,
  },
  // A Parquet file is read through its footer, which only close() writes.
  'de-format-3': {
    python: `rows, row_group_rows = 10, 4
full_groups = rows // row_group_rows        # written to the file as they fill
footer_written = False                      # killed before close()
readable = full_groups * row_group_rows if footer_written else 0
print(readable)`,
  },
  // JSON lines: every complete line parses on its own.
  'de-format-4': {
    python: `import json
lines = ['{"id": %d}' % i for i in range(1, 10)] + ['{"id": 10, "ci']
ok = 0
for line in lines:
    try:
        json.loads(line)
        ok += 1
    except ValueError:
        pass
print(ok)`,
  },
  // Bits to number 200 values, then 1,000,000 indexes.
  'de-format-5': {
    python: `import math
distinct, rows = 200, 1000000
bits = math.ceil(math.log2(distinct))
print(int(bits * rows / 8 / 1000000))`,
  },

  // ── Skipping Data ──
  // Rows in the row groups whose min-to-max range can contain the day.
  'de-skip-2': {
    sql: `SELECT SUM(row_count) FROM row_groups WHERE min_day <= '2026-11-03' AND max_day >= '2026-11-03';`,
  },
  // Partition pruning keeps only the folders in the BETWEEN.
  'de-skip-3': {
    sql: `SELECT SUM(mb) FROM files WHERE dt BETWEEN '2026-11-03' AND '2026-11-04';`,
  },
  // Rewrite sorted, cut into row groups of 3, count the groups whose range contains the day.
  'de-skip-4': {
    sql: `CREATE TABLE rewritten AS SELECT order_date FROM orders ORDER BY order_date, order_id;
SELECT COUNT(*) FROM (
  SELECT (rowid - 1) / 3 AS grp, MIN(order_date) AS lo, MAX(order_date) AS hi FROM rewritten GROUP BY grp
) WHERE lo <= '2026-11-03' AND hi >= '2026-11-03';`,
  },
  // Only the file statistics can help a filter on a column that is not the partition column.
  'de-skip-7': {
    sql: `SELECT COUNT(*) FROM files WHERE min_event_date <= '2026-11-02' AND max_event_date >= '2026-11-02';`,
  },

  // ── Object Storage & Small Files ──
  // Every file pays 20 ms to open plus 1 ms per MB.
  'de-small-2': { sql: `SELECT SUM(20 + mb) FROM small_files;` },
  // 8 tasks x 24 runs x 30 days.
  'de-small-3': { python: `print(8 * 24 * 30)` },
  // Copy then delete per object, in key order; killed after the third copy.
  'de-small-4': {
    python: `keys = ['tmp/run-7/part-%04d' % i for i in range(5)]
final = []
for i, key in enumerate(keys):
    if i == 3:
        break                               # killed after the third copy
    final.append(key.replace('tmp/', 'final/'))
print(len(final))`,
  },
  // 20,000 MB into files of at most 128 MB, rounded up.
  'de-small-5': { sql: `SELECT (files * avg_mb + 127) / 128 FROM partition_stats;` },
};
