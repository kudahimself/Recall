import { OutcomeCheck } from './dataEngineeringMovingDataChecks';

/**
 * How each predict-the-outcome answer in Warehouses, Lakes & Table Formats is
 * checked by running it. The format is the one of
 * dataEngineeringMovingDataChecks.ts: scripts/check-outcomes.js (run by
 * `npm test`) creates the question's `tables` in SQLite (sql.js), each named by
 * the first word of its title, runs the check, and compares the last result
 * set with the question's `answer`.
 * A table format is modelled as what its log says (versions, files added and
 * removed, row counts), so the state of a table at a version is a query; the
 * cards about a process over time (copies between systems, writers racing for
 * a version, a commit refused whole) are simulated in Python.
 */
export const WAREHOUSES_LAKES_OUTCOME_CHECKS: Record<string, OutcomeCheck> = {
  // ── Workloads & Systems ──
  // A plain lake reader lists the folder: finished and running jobs alike.
  'de-workload-2': { sql: `SELECT SUM(row_count) FROM clicks_files;` },
  // Storage on the compute nodes: enough nodes to hold the data, up all day.
  'de-workload-3': {
    python: `data_tb, per_node_tb = 40, 4
nodes = -(-data_tb // per_node_tb)          # round up
print(nodes * 24)`,
  },
  // The warehouse's own copy plus one export per tool that reads Parquet.
  'de-workload-4': {
    sql: `SELECT 10 * (1 + SUM(CASE WHEN reads = 'Parquet files' THEN 1 ELSE 0 END)) FROM tools;`,
  },
  // Each hop takes only what the hop before it had committed when it started.
  'de-workload-8': {
    python: `from datetime import datetime, timedelta
order = datetime(2026, 11, 3, 14, 30)

def runs(first, every, takes, n=200):
    return [(first + every * i, first + every * i + takes) for i in range(n)]

def first_after(available, schedule):
    for start, end in schedule:
        if start >= available:
            return end

extract = runs(datetime(2026, 11, 3, 2, 0), timedelta(days=1), timedelta(minutes=30))
load = runs(datetime(2026, 11, 3, 0, 15), timedelta(hours=1), timedelta(minutes=20))
refresh = runs(datetime(2026, 11, 3, 0, 0), timedelta(hours=4), timedelta(minutes=5))
in_lake = first_after(order, extract)
in_warehouse = first_after(in_lake, load)
on_dashboard = first_after(in_warehouse, refresh)
assert on_dashboard.date() == datetime(2026, 11, 4).date()
print(on_dashboard.strftime('%H:%M'))`,
  },

  // ── Table Formats ──
  // The latest version: files added and not removed by then.
  'de-snapshot-2': {
    sql: `SELECT SUM(a.row_count) FROM table_log a
WHERE a.action = 'add'
  AND NOT EXISTS (SELECT 1 FROM table_log r WHERE r.action = 'remove' AND r.file = a.file);`,
  },
  // The query reads the version that was latest when it started.
  'de-snapshot-3': { sql: `SELECT SUM(row_count) FROM version_files WHERE version = 41;` },
  // TIMESTAMP AS OF picks the last version committed at or before the time.
  'de-snapshot-4': {
    sql: `SELECT rows_after FROM commits WHERE committed_at <= '2026-11-03 12:00' ORDER BY version DESC LIMIT 1;`,
  },
  // Optimistic concurrency: a loser fails if a winner removed a file it read, else retries.
  'de-snapshot-7': {
    python: `files = {'f1': 150, 'f2': 150, 'f3': 250}
jobs = [   # (reads, removes, adds), in commit order, all starting from version 7
    ({'f1', 'f2'}, {'f1', 'f2'}, {'f9': 300}),
    (set(), set(), {'f10': 120}),
    ({'f2'}, {'f2'}, {'f2x': 120}),
]
removed_since_start = set()
for reads, removes, adds in jobs:
    if reads & removed_since_start:
        continue                            # conflict: the commit fails
    for f in removes:
        del files[f]
    files.update(adds)
    removed_since_start |= removes
print(sum(files.values()))`,
  },

  // ── Updating Files ──
  // Copy-on-write rewrites every file that holds a changed row, whole.
  'de-rewrite-2': { sql: `SELECT SUM(mb) FROM data_files WHERE rows_matching > 0;` },
  // Base files plus the delete and new-version files of each run since compaction.
  'de-rewrite-3': {
    sql: `SELECT
  (SELECT files FROM table_files WHERE kind = 'base')
  + (SELECT files FROM table_files WHERE kind = 'update runs since compaction')
    * ((SELECT files FROM table_files WHERE kind = 'delete files per update run')
     + (SELECT files FROM table_files WHERE kind = 'new-version files per update run'));`,
  },
  // Removed from the table more than 7 days before the cleanup runs.
  'de-rewrite-4': {
    sql: `SELECT COUNT(*) FROM table_files
WHERE removed_at IS NOT NULL AND removed_at < datetime('2026-11-10 00:00', '-7 days');`,
  },
  // The oldest version none of whose files the cleanup deleted.
  'de-rewrite-8': {
    sql: `CREATE TABLE deleted AS
SELECT f.* FROM files f JOIN commits c ON c.version = f.removed_in
WHERE c.committed_at < datetime('2026-11-10 00:00', '-7 days');
SELECT MIN(c.version) FROM commits c
WHERE NOT EXISTS (
  SELECT 1 FROM deleted d WHERE d.added_in <= c.version AND c.version < d.removed_in
);`,
  },

  // ── Schema Enforcement & Evolution ──
  // Rows in files from before the column existed read NULL, as do new rows without a coupon.
  'de-schema-2': {
    sql: `SELECT SUM(row_count) - SUM(COALESCE(rows_with_coupon, 0)) FROM order_files;`,
  },
  // Enforcement checks the whole write, and a refused commit adds nothing.
  'de-schema-3': {
    python: `from decimal import Decimal, InvalidOperation
batch = ['12.50'] * 499 + ['n/a']
def fits(value):
    try:
        Decimal(value)
        return True
    except InvalidOperation:
        return False
committed = batch if all(fits(v) for v in batch) else []
print(len(committed))`,
  },
  // Inferred schema, new columns added, missing ones filled with NULL.
  'de-schema-4': {
    sql: `CREATE TABLE orders AS SELECT
  CASE WHEN field_sent = 'amount' THEN total_sent END AS amount,
  CASE WHEN field_sent = 'amount_cents' THEN total_sent END AS amount_cents
FROM batches;
SELECT SUM(amount) FROM orders;`,
  },
  // Matched by name, the old files' discount column is read again.
  'de-schema-8': { sql: `SELECT SUM(rows_with_discount_in_file) FROM order_files;` },
};
