import { OutcomeCheck } from './dataEngineeringMovingDataChecks';

/**
 * How each predict-the-outcome answer in Running Pipelines is checked by
 * running it. The format is the one of dataEngineeringMovingDataChecks.ts:
 * scripts/check-outcomes.js (run by `npm test`) creates the question's
 * `tables` in SQLite (sql.js), each named by the first word of its title, runs
 * the check, and compares the last result set with the question's `answer`.
 * Walks over a DAG, a lineage graph or nested roles are recursive CTEs; the
 * cards whose rule is a schedule or a loop (a backfill whose days wait on each
 * other, chunks made until one reaches the end) are checked by a short Python
 * model.
 */

export const OPS_OUTCOME_CHECKS: Record<string, OutcomeCheck> = {
  // ── Orchestration: DAGs, Dependencies, Sensors & Retries ──
  // Every task reachable downstream of the failed extract_customers is not run.
  'de-dag-2': {
    sql: `WITH down(task_name) AS (
  SELECT downstream FROM edges WHERE upstream = 'extract_customers'
  UNION ALL
  SELECT e.downstream FROM edges e JOIN down d ON e.upstream = d.task_name
)
SELECT COUNT(DISTINCT task_name) FROM down;`,
  },
  // The load starts at 02:00 whatever the extract is doing.
  'de-dag-3': { sql: `SELECT COUNT(*) FROM extract_runs WHERE extract_finished > '02:00';` },
  // A task finishes at its minutes plus the latest finish upstream: the longest path to revenue_report.
  'de-dag-4': {
    sql: `WITH paths(task_name, finish) AS (
  SELECT t.task_name, t.minutes FROM tasks t
  WHERE NOT EXISTS (SELECT 1 FROM edges e WHERE e.downstream = t.task_name)
  UNION ALL
  SELECT e.downstream, p.finish + t.minutes
  FROM paths p JOIN edges e ON e.upstream = p.task_name JOIN tasks t ON t.task_name = e.downstream
)
SELECT MAX(finish) FROM paths WHERE task_name = 'revenue_report';`,
  },
  // Each day waits for the day before; at most 3 runs at once.
  'de-dag-8': {
    python: `days = [30, 30, 30, 30, 30, 30]   # minutes per run, in date order
limit = 3
finish = []
running = []                        # finish times of the runs in flight
for i, minutes in enumerate(days):
    start = finish[i - 1] if i else 0           # the previous day must have succeeded
    running = [f for f in running if f > start]
    if len(running) >= limit:
        start = max(start, sorted(running)[len(running) - limit])
    finish.append(start + minutes)
    running.append(start + minutes)
print(max(finish))`,
  },

  // ── Data Quality: Tests, Contracts & Circuit Breakers ──
  // Rows breaking any of the three tests, each row counted once.
  'de-quality-2': {
    sql: `SELECT COUNT(*) FROM staging_orders
WHERE customer_id IS NULL OR amount < 0 OR status NOT IN ('paid', 'refunded', 'cancelled');`,
  },
  // Order rows whose customer_id has no row in dim_customers.
  'de-quality-3': {
    sql: `SELECT COUNT(*) FROM staging_orders s
WHERE NOT EXISTS (SELECT 1 FROM dim_customers d WHERE d.customer_id = s.customer_id);`,
  },
  // Only batches with no blocking failure are published; the latest of them.
  'de-quality-4': { sql: `SELECT MAX(run_date) FROM batches WHERE blocking_failed = 0;` },
  // Under half the average of the 3 days before, for the days 11-04 to 11-08.
  'de-quality-8': {
    sql: `SELECT COUNT(*) FROM (
  SELECT run_date, row_count,
         AVG(row_count) OVER (ORDER BY run_date ROWS BETWEEN 3 PRECEDING AND 1 PRECEDING) AS prev3
  FROM daily_rows
)
WHERE run_date BETWEEN '2026-11-04' AND '2026-11-08' AND row_count < prev3 / 2.0;`,
  },

  // ── Observability & Lineage ──
  // Hours since the last load at 09:00, against each table's SLA.
  'de-lineage-2': {
    sql: `SELECT COUNT(*) FROM freshness
WHERE (julianday('2026-11-08 09:00') - julianday(last_loaded_at)) * 24 > sla_hours;`,
  },
  // Distinct tables reachable downstream of orders_raw.
  'de-lineage-3': {
    sql: `WITH down(table_name) AS (
  SELECT target_table FROM lineage WHERE source_table = 'orders_raw'
  UNION ALL
  SELECT l.target_table FROM lineage l JOIN down d ON l.source_table = d.table_name
)
SELECT COUNT(DISTINCT table_name) FROM down;`,
  },
  // Upstream of the dashboard: the table under 80% of its usual rows whose sources are all normal.
  'de-lineage-4': {
    sql: `WITH up(table_name) AS (
  SELECT source_table FROM lineage WHERE target_table = 'exec_dashboard'
  UNION ALL
  SELECT l.source_table FROM lineage l JOIN up u ON l.target_table = u.table_name
),
bad AS (SELECT table_name FROM table_health WHERE rows_yesterday < 0.8 * rows_usual)
SELECT DISTINCT u.table_name FROM up u
WHERE u.table_name IN (SELECT table_name FROM bad)
  AND NOT EXISTS (SELECT 1 FROM lineage l WHERE l.target_table = u.table_name
                  AND l.source_table IN (SELECT table_name FROM bad));`,
  },
  // Distinct columns reachable downstream of orders_clean.discount.
  'de-lineage-8': {
    sql: `WITH down(col) AS (
  SELECT target_column FROM column_lineage WHERE source_column = 'orders_clean.discount'
  UNION ALL
  SELECT c.target_column FROM column_lineage c JOIN down d ON c.source_column = d.col
)
SELECT COUNT(DISTINCT col) FROM down;`,
  },

  // ── Governance & Access ──
  // Distinct tables granted to any of priya's roles.
  'de-access-2': {
    sql: `SELECT COUNT(DISTINCT g.table_name) FROM user_roles r
JOIN role_grants g ON g.role_name = r.role_name
WHERE r.user_name = 'priya';`,
  },
  // The rows of lena's regions, summed.
  'de-access-3': {
    sql: `SELECT SUM(s.amount) FROM sales s
WHERE s.region IN (SELECT region FROM user_regions WHERE user_name = 'lena');`,
  },
  // finance_analyst and every role it includes, at any depth; their distinct tables.
  'de-access-4': {
    sql: `WITH roles(role_name) AS (
  SELECT 'finance_analyst'
  UNION ALL
  SELECT i.included_role FROM role_includes i JOIN roles r ON i.role_name = r.role_name
)
SELECT COUNT(DISTINCT g.table_name) FROM role_grants g WHERE g.role_name IN (SELECT role_name FROM roles);`,
  },
  // Snapshots kept by the cleanup that still hold the row.
  'de-access-8': {
    sql: `SELECT COUNT(*) FROM snapshots WHERE committed_on >= '2026-11-01' AND has_customer_42 = 1;`,
  },

  // ── Data for AI ──
  // Documents that are new to the index or whose hash changed.
  'de-rag-2': {
    sql: `SELECT COUNT(*) FROM documents d
WHERE NOT EXISTS (SELECT 1 FROM indexed i WHERE i.doc_id = d.doc_id AND i.content_hash = d.content_hash);`,
  },
  // Chunks start every (chunk - overlap) tokens until one reaches the end.
  'de-rag-3': {
    python: `doc, size, overlap = 2300, 500, 100
start, chunks = 0, 0
while True:
    chunks += 1
    if start + size >= doc:
        break
    start += size - overlap
print(chunks)`,
  },
  // The 4 nearest chunks, then the ones the all_staff user may see.
  'de-rag-4': {
    sql: `SELECT COUNT(*) FROM (SELECT * FROM chunks ORDER BY distance LIMIT 4)
WHERE access_group = 'all_staff';`,
  },
  // Tickets of customer 7 in the 30 days before the prediction date.
  'de-rag-8': {
    sql: `SELECT COUNT(*) FROM tickets t JOIN training_rows r ON r.customer_id = t.customer_id
WHERE t.opened_on >= date(r.prediction_date, '-30 days') AND t.opened_on < r.prediction_date;`,
  },
};
