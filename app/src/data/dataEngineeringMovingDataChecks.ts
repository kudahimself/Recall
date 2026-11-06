import { Question } from '../types';

/**
 * How each predict-the-outcome answer in Moving Data is checked by running it.
 * scripts/check-outcomes.js (run by `npm test`) creates the question's `tables`
 * in SQLite (sql.js), each named by the first word of its title, runs the
 * check, and compares the last result set with the question's `answer` (or
 * with `expect`). A check is SQL, or Python whose printed output is compared.
 * MERGE and DATEADD are notation in the cards; their checks model them in SQLite.
 */
export interface OutcomeCheck {
  /** SQLite script, or a function of the question that builds it. */
  sql?: string | ((q: Question) => string);
  /** Python 3 script; what it prints is the result. */
  python?: string;
  /** The expected result when it is not the question's answer: rows joined by newlines, cells by `|`. */
  expect?: string;
}

/** The question's `code`. */
const code = (q: Question) => (q as { code?: string }).code ?? '';

/** The question's `code` without its final semicolon, to use as a subquery. */
const query = (q: Question) => code(q).trim().replace(/;$/, '');

/** `text` with a `:name` parameter replaced by a SQL literal. */
const bind = (text: string, name: string, literal: string) => text.split(name).join(literal);

export const MOVING_DATA_OUTCOME_CHECKS: Record<string, OutcomeCheck> = {
  // ── ETL, ELT & Staging ──
  'de-stage-2': {
    sql: q => `CREATE TABLE before_n AS SELECT COUNT(*) AS n FROM fact_orders;
${code(q)}
SELECT (SELECT COUNT(*) FROM fact_orders) - (SELECT n FROM before_n);`,
  },
  'de-stage-3': {
    python: `from datetime import date, timedelta
called = date(2026, 11, 4)
served = {called - timedelta(days=d) for d in (1, 2)}   # the 2 days before the call
wrong = [date(2026, 11, d) for d in (1, 2, 3)]
print(sum(1 for d in wrong if d in served))`,
  },
  'de-stage-7': {
    sql: `-- load_orders at 02:30 on 11-03 inserts whatever staging holds
INSERT INTO fact_orders SELECT * FROM stg_orders;
SELECT COUNT(*) FROM fact_orders WHERE order_date = '2026-11-01';`,
  },

  // ── Full vs Incremental Loads ──
  'de-incr-2': { sql: q => `CREATE TABLE read_rows AS ${query(q)};\nSELECT COUNT(*) FROM read_rows;` },
  'de-incr-3': { sql: q => `${code(q)}\nSELECT SUM(amount) FROM fact_orders WHERE status = 'paid';` },
  'de-incr-7': {
    sql: `CREATE TABLE target (row_id INTEGER);
-- run 1 at 10:00 reads committed rows stamped after 09:00, then saves its start time, 10:00
INSERT INTO target SELECT row_id FROM src_rows
WHERE updated_at > '2026-11-02 09:00' AND committed_at <= '2026-11-02 10:00';
-- run 2 at 11:00 reads committed rows stamped after the saved 10:00
INSERT INTO target SELECT row_id FROM src_rows
WHERE updated_at > '2026-11-02 10:00' AND committed_at <= '2026-11-02 11:00';
SELECT COUNT(DISTINCT row_id) FROM target;`,
  },

  // ── Re-runs & Idempotent Loads ──
  'de-idem-2': { sql: q => `${code(q)}\n${code(q)}\nSELECT COUNT(*) FROM daily_sales WHERE sale_date = '2026-11-01';` },
  'de-idem-3': { sql: q => `${code(q)}\n${code(q)}\nSELECT COUNT(*) FROM daily_sales;` },
  'de-idem-4': {
    // The MERGE as SQLite's upsert, run and then retried.
    sql: `CREATE UNIQUE INDEX balances_key ON balances (account_id);
INSERT INTO balances (account_id, amount) SELECT account_id, amount FROM batch WHERE true
ON CONFLICT (account_id) DO UPDATE SET amount = excluded.amount;
INSERT INTO balances (account_id, amount) SELECT account_id, amount FROM batch WHERE true
ON CONFLICT (account_id) DO UPDATE SET amount = excluded.amount;
SELECT SUM(amount) FROM balances;`,
  },
  'de-idem-5': { sql: `SELECT date('2026-11-20', '-1 day');` },
  'de-idem-8': {
    // The killed run committed its DELETE alone; this is the table until the retry.
    sql: `DELETE FROM fact_orders WHERE order_date = '2026-11-01';
SELECT COUNT(*) FROM fact_orders WHERE order_date = '2026-11-01';`,
  },
  // Spot the flaw: the rows per day its result table shows.
  'de-idem-11': {
    sql: q => {
      const job = bind((q as { lines: string[] }).lines.join('\n'), ':run_date', "'2026-11-01'");
      return `CREATE TABLE load_log (last_loaded TEXT);
CREATE TABLE counts (run INTEGER, order_date TEXT, n INTEGER);
${job}
INSERT INTO counts SELECT 1, order_date, COUNT(*) FROM fact_orders GROUP BY order_date;
${job}
INSERT INTO counts SELECT 2, order_date, COUNT(*) FROM fact_orders GROUP BY order_date;
SELECT order_date, SUM(CASE WHEN run = 1 THEN n END), SUM(CASE WHEN run = 2 THEN n END)
FROM counts GROUP BY order_date ORDER BY order_date;`;
    },
    expect: '2026-10-31|3|4\n2026-11-01|2|2',
  },

  // ── Change Data Capture ──
  'de-capture-2': {
    // Keys in the batch are distinct, so I, U and D can be applied as three set statements.
    sql: `DELETE FROM customers WHERE customer_id IN (SELECT customer_id FROM cdc_batch WHERE op = 'D');
UPDATE customers SET email = (SELECT b.email FROM cdc_batch b WHERE b.customer_id = customers.customer_id AND b.op = 'U')
WHERE customer_id IN (SELECT customer_id FROM cdc_batch WHERE op = 'U');
INSERT INTO customers SELECT customer_id, email FROM cdc_batch WHERE op = 'I';
SELECT COUNT(*) FROM customers;`,
  },
  'de-capture-3': {
    sql: `CREATE UNIQUE INDEX dw_key ON dw_customers (customer_id);
INSERT INTO dw_customers SELECT customer_id, email FROM src_customers
WHERE updated_at > '2026-11-01 23:00'
ON CONFLICT (customer_id) DO UPDATE SET email = excluded.email;
SELECT COUNT(*) FROM dw_customers;`,
  },
  'de-capture-4': {
    // Each UPDATE in file order overwrites the one before, so the row last in the file wins.
    sql: `CREATE TABLE customers (customer_id INTEGER, email TEXT);
INSERT INTO customers VALUES (7, 'kim@first.io');
UPDATE customers SET email = (
  SELECT f.email FROM cdc_file f WHERE f.customer_id = customers.customer_id ORDER BY f.rowid DESC LIMIT 1);
SELECT email FROM customers WHERE customer_id = 7;`,
  },
  'de-capture-5': {
    sql: q => `CREATE TABLE order_status_history (order_id INTEGER, status TEXT, updated_at TEXT);
${code(q)}
SELECT COUNT(*) FROM order_status_history WHERE order_id = 88;`,
  },
  'de-capture-9': {
    // Load the snapshot, then apply the log from the position the connector starts at (09:10).
    sql: `CREATE TABLE target AS SELECT customer_id, email FROM snapshot_rows;
UPDATE target SET email = (
  SELECT l.email FROM change_log l
  WHERE l.customer_id = target.customer_id AND l.committed_at >= '2026-11-02 09:10'
  ORDER BY l.lsn DESC LIMIT 1)
WHERE customer_id IN (SELECT customer_id FROM change_log WHERE committed_at >= '2026-11-02 09:10');
SELECT email FROM target WHERE customer_id = 5;`,
  },

  // ── Deduplication & Late-Arriving Data ──
  'de-dedup-2': { sql: q => code(q) },
  'de-dedup-3': { sql: q => `SELECT status FROM (${query(q)}) AS kept WHERE order_id = 7;` },
  'de-dedup-4': { sql: q => `SELECT revenue FROM (${query(q)}) AS report WHERE sale_date = '2026-11-01';` },
  'de-dedup-5': {
    sql: q => `${bind(code(q), ':run_date', "'2026-11-02'")}
SELECT total FROM daily_summary WHERE sale_date = '2026-11-01';`,
  },

  // ── Backfills & Reprocessing ──
  'de-backfill-2': {
    sql: q => `${bind(code(q), ':run_date', "'2026-11-02'")}
${bind(code(q), ':run_date', "'2026-11-03'")}
SELECT COUNT(*) FROM fact_orders;`,
  },
  'de-backfill-3': {
    python: `from datetime import date, timedelta
def days(a, b):
    return {a + timedelta(days=i) for i in range((b - a).days + 1)}
affected = days(date(2026, 10, 1), date(2026, 11, 19))
kept = days(date(2026, 11, 20) - timedelta(days=30), date(2026, 11, 19))
print(len(affected - kept))`,
  },
  'de-backfill-4': {
    sql: `-- the backfill replaces each day of fact_sales with its sales only
CREATE TABLE fact_sales AS SELECT sale_date, SUM(amount) AS amount FROM raw_sales WHERE kind = 'sale' GROUP BY sale_date;
SELECT (SELECT total FROM monthly_summary WHERE month = '2026-11')
     - (SELECT SUM(amount) FROM fact_sales WHERE sale_date LIKE '2026-11-%');`,
  },
  'de-backfill-7': {
    // Both runs start together, so each reads the balances as they were before either wrote.
    sql: `CREATE TABLE at_start AS SELECT * FROM closing_balance;
UPDATE closing_balance SET balance =
  (SELECT s.balance FROM at_start s WHERE s.day = date(closing_balance.day, '-1 day'))
  + (SELECT n.net FROM corrected_net n WHERE n.day = closing_balance.day)
WHERE day IN (SELECT day FROM corrected_net);
SELECT balance FROM closing_balance WHERE day = '2026-11-03';`,
  },
};
