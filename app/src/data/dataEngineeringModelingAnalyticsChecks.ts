import { Question } from '../types';
import { OutcomeCheck } from './dataEngineeringMovingDataChecks';

/**
 * How each predict-the-outcome answer in Modeling for Analytics is checked by
 * running it. The format is the one of dataEngineeringMovingDataChecks.ts:
 * scripts/check-outcomes.js (run by `npm test`) creates the question's
 * `tables` in SQLite (sql.js), each named by the first word of its title, runs
 * the check, and compares the last result set with the question's `answer`.
 * Most checks run the card's own query; the cards whose `code` is a metric
 * definition or a change rule state that definition again in SQL.
 */

/** The question's `code`. */
const code = (q: Question) => (q as { code?: string }).code ?? '';

/** The question's `code` without its final semicolon, to use as a subquery. */
const query = (q: Question) => code(q).trim().replace(/;$/, '');

export const MODELING_ANALYTICS_OUTCOME_CHECKS: Record<string, OutcomeCheck> = {
  // ── Grain & Double Counting ──
  // The card's join, as shown: shipping repeated once per line.
  'de-fanout-2': { sql: q => code(q) },
  // Two grains in one table: SUM adds every row.
  'de-fanout-3': { sql: `SELECT SUM(amount) FROM fact_sales;` },
  // A rate from its parts: the division is exact here, so the integer result is the rate.
  'de-fanout-4': {
    sql: `SELECT CASE WHEN 100 * SUM(orders) % SUM(visits) = 0 THEN 100 * SUM(orders) / SUM(visits) END FROM daily_funnel;`,
  },
  // Two one-to-many joins from customers: North's row of the card's report.
  'de-fanout-8': { sql: q => `SELECT revenue FROM (${query(q)}) WHERE region = 'North';` },

  // ── Facts, Dimensions & the Star Schema ──
  'de-dimstar-2': { sql: q => `SELECT revenue FROM (${query(q)}) WHERE category = 'Kitchen';` },
  // The inner join drops the sale whose product has no dimension row.
  'de-dimstar-3': { sql: q => `SELECT SUM(revenue) FROM (${query(q)});` },
  'de-dimstar-4': { sql: q => `SELECT COUNT(*) FROM (${query(q)});` },
  // Drill-across over two product tables that do not conform.
  'de-dimstar-8': { sql: q => `SELECT COUNT(*) FROM (${query(q)}) WHERE returned IS NOT NULL;` },

  // ── Keys: Natural & Surrogate ──
  'de-skey-2': { sql: q => `SELECT COUNT(*) FROM (${query(q)});` },
  'de-skey-3': { sql: q => code(q) },
  // The nightly rebuild renumbers by name; the fact keeps Monday's key.
  'de-skey-4': {
    sql: q => `CREATE TABLE dim_customer (customer_key INTEGER, customer_id INTEGER, customer_name TEXT);
${code(q)}`,
  },
  'de-skey-8': { sql: q => code(q) },

  // ── Slowly Changing Dimensions & Point-in-Time Joins ──
  'de-history-2': { sql: q => code(q) },
  'de-history-3': { sql: q => code(q) },
  // The card's rules, applied: email overwritten in place, a changed city
  // closes the current row and adds a version, a new customer gets one row.
  'de-history-4': {
    sql: `UPDATE dim_customer
SET email = (SELECT s.email FROM stg_customers s WHERE s.customer_id = dim_customer.customer_id)
WHERE customer_id IN (SELECT customer_id FROM stg_customers);
CREATE TABLE moved AS
SELECT s.customer_id, s.city, s.email FROM stg_customers s
JOIN dim_customer d ON d.customer_id = s.customer_id AND d.valid_to = '9999-12-31'
WHERE s.city <> d.city;
UPDATE dim_customer SET valid_to = '2026-11-08'
WHERE valid_to = '9999-12-31' AND customer_id IN (SELECT customer_id FROM moved);
INSERT INTO dim_customer SELECT NULL, customer_id, city, email, '2026-11-08', '9999-12-31' FROM moved;
INSERT INTO dim_customer
SELECT NULL, customer_id, city, email, '2026-11-08', '9999-12-31' FROM stg_customers
WHERE customer_id NOT IN (SELECT customer_id FROM dim_customer);
SELECT COUNT(*) FROM dim_customer;`,
  },
  // The card's load (current-row lookup), then Leeds' row of its May report.
  'de-history-8': {
    sql: q => `${code(q).split('-- the city report')[0]}
SELECT revenue FROM (${code(q).split('-- the city report')[1].trim().replace(/;$/, '')}) WHERE city = 'Leeds';`,
  },

  // ── Metrics & Ownership ──
  // The gap between the card's two dashboards.
  'de-metric-2': {
    sql: `SELECT
  (SELECT SUM(amount) FROM orders WHERE order_date BETWEEN '2026-10-01' AND '2026-10-31')
- (SELECT SUM(amount) FROM orders WHERE order_date BETWEEN '2026-10-01' AND '2026-10-31' AND status = 'paid');`,
  },
  // The definition, as of 2026-11-08: (as_of - 30 days, as_of].
  'de-metric-3': {
    sql: `SELECT COUNT(DISTINCT customer_id) FROM orders
WHERE status = 'paid' AND order_date > DATE('2026-11-08', '-30 days') AND order_date <= '2026-11-08';`,
  },
  // The card's view and the pasted copy; the copy's result is the last one.
  'de-metric-4': { sql: q => code(q) },
  // The definition in SQL for November 2026.
  'de-metric-8': {
    sql: `SELECT
  (SELECT SUM(amount) FROM orders WHERE is_test = 0 AND paid_date BETWEEN '2026-11-01' AND '2026-11-30')
- (SELECT SUM(amount) FROM refunds WHERE refund_date BETWEEN '2026-11-01' AND '2026-11-30');`,
  },
};
