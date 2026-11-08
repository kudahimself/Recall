import { OutcomeCheck } from './dataEngineeringMovingDataChecks';

/**
 * How each predict-the-outcome answer in Streaming is checked by running it.
 * The format is the one of dataEngineeringMovingDataChecks.ts:
 * scripts/check-outcomes.js (run by `npm test`) creates the question's
 * `tables` in SQLite (sql.js), each named by the first word of its title, runs
 * the check, and compares the last result set with the question's `answer`.
 * Clock times in the cards are 'HH:MM' text; the SQL turns them into minutes
 * with MINUTES(). The cards whose rule runs event by event (a watermark, a
 * state TTL, an expiring dedup set) are checked by a short Python model that
 * walks the card's rows in arrival order.
 */

/** Minutes since midnight of an 'HH:MM' column, in SQLite. */
const MINUTES = (col: string) => `(CAST(substr(${col}, 1, 2) AS INTEGER) * 60 + CAST(substr(${col}, 4, 2) AS INTEGER))`;

/** The Python helper the event-by-event models share. */
const PY_MINUTES = `def minutes(t):
    h, m = t.split(':')
    return int(h) * 60 + int(m)
`;

export const STREAMING_OUTCOME_CHECKS: Record<string, OutcomeCheck> = {
  // ── Logs, Topics, Partitions & Offsets ──
  // The card's partition rule, customer_id % 3.
  'de-log-2': { sql: `SELECT COUNT(*) FROM events WHERE customer_id % 3 = 1;` },
  // Lag per partition, summed over the group.
  'de-log-3': { sql: `SELECT SUM(end_offset - committed_offset) FROM partitions;` },
  // One instance per partition within a group: deal the card's partitions out to 8 instances.
  'de-log-4': {
    python: `partitions = list(range(6))
instances = {f'i{n}': [] for n in range(8)}
names = list(instances)
for p in partitions:
    instances[names[p % len(names)]].append(p)
print(sum(1 for got in instances.values() if not got))`,
  },
  // A key moves when its partition under 3 partitions differs from its partition under 4.
  'de-log-8': { sql: `SELECT COUNT(*) FROM accounts WHERE account_id % 3 <> account_id % 4;` },

  // ── Event Time, Windows & Watermarks ──
  // [start, end): the start is in, the end is out.
  'de-wmark-2': { sql: `SELECT COUNT(*) FROM events WHERE event_time >= '10:05' AND event_time < '10:10';` },
  'de-wmark-3': { sql: `SELECT COUNT(*) FROM events WHERE event_time >= '09:00' AND event_time < '10:00';` },
  // The card's four hopping windows, each event counted in every window that covers it.
  'de-wmark-4': {
    sql: `WITH w(win_start, win_end) AS (
  VALUES ('09:55', '10:05'), ('10:00', '10:10'), ('10:05', '10:15'), ('10:10', '10:20')
)
SELECT COUNT(*) FROM w JOIN events e ON e.event_time >= w.win_start AND e.event_time < w.win_end;`,
  },
  // Watermark when each event arrives: the largest event time before it, minus 2.
  // The event counts if its window, [600, 605) in minutes, was still open then.
  'de-wmark-5': {
    sql: `WITH m AS (
  SELECT arrival_seq, ${MINUTES('event_time')} AS t FROM arrivals
), judged AS (
  SELECT a.t / 5 * 5 AS win_start,
         (SELECT MAX(b.t) FROM m b WHERE b.arrival_seq < a.arrival_seq) - 2 AS watermark
  FROM m a
)
SELECT COUNT(*) FROM judged
WHERE win_start = ${MINUTES("'10:00'")} AND (watermark IS NULL OR watermark < win_start + 5);`,
  },
  // Sessions with a 30-minute gap, after adding the late click at 10:30.
  'de-wmark-9': {
    sql: `WITH c AS (
  SELECT click_time FROM clicks WHERE user_id = 'u1' UNION ALL SELECT '10:30'
), m AS (
  SELECT ${MINUTES('click_time')} AS t FROM c
), g AS (
  SELECT t - LAG(t) OVER (ORDER BY t) AS gap FROM m
)
SELECT COUNT(*) FROM g WHERE gap IS NULL OR gap > 30;`,
  },

  // ── Delivery Guarantees & Exactly-Once ──
  // Written: offsets 0-3, then after the restart from offset 2, offsets 2-5.
  'de-eos-2': {
    sql: `SELECT SUM(amount) FROM (
  SELECT amount FROM topic_log WHERE offset_no <= 3
  UNION ALL
  SELECT amount FROM topic_log WHERE offset_no >= 2
);`,
  },
  // Written: offsets 0-1, then after the restart from the committed offset 4, offsets 4-5.
  'de-eos-3': { sql: `SELECT SUM(amount) FROM topic_log WHERE offset_no <= 1 OR offset_no >= 4;` },
  // Written: offsets 0-4, then 2-5 again; the upsert keeps one row per payment_id.
  'de-eos-4': {
    sql: `SELECT COUNT(DISTINCT payment_id) FROM (
  SELECT payment_id FROM topic_log WHERE offset_no <= 4
  UNION ALL
  SELECT payment_id FROM topic_log WHERE offset_no >= 2
);`,
  },
  // The card's arrivals through a dedup set whose ids expire 60 minutes after first seen.
  'de-eos-8': {
    python: `${PY_MINUTES}arrivals = [('p1', '10:00'), ('p2', '10:05'), ('p1', '10:20'), ('p3', '10:30'), ('p2', '11:40'), ('p4', '11:45')]
first_seen = {}
passed = 0
for pid, at in arrivals:
    now = minutes(at)
    first_seen = {k: v for k, v in first_seen.items() if now - v < 60}
    if pid in first_seen:
        continue
    first_seen[pid] = now
    passed += 1
print(passed)`,
  },

  // ── State & Stream Joins ──
  // The interval join: paid at the order's time or up to 30 minutes after.
  'de-sjoin-2': {
    sql: `SELECT COUNT(DISTINCT o.order_id)
FROM orders o
JOIN payments p ON p.order_id = o.order_id
 AND ${MINUTES('p.paid_at')} >= ${MINUTES('o.ordered_at')}
 AND ${MINUTES('p.paid_at')} <= ${MINUTES('o.ordered_at')} + 30;`,
  },
  // One state entry per key.
  'de-sjoin-3': { sql: `SELECT COUNT(DISTINCT user_id) FROM events;` },
  // The tier current when each order arrived: the latest change at or before arrived_at.
  'de-sjoin-4': {
    sql: `SELECT COUNT(*) FROM orders o
WHERE (SELECT c.tier FROM customer_changes c
       WHERE c.customer_id = o.customer_id AND c.changed_at <= o.arrived_at
       ORDER BY c.changed_at DESC LIMIT 1) = 'gold';`,
  },
  // A running count per user whose entry expires 30 minutes after the user's last event.
  'de-sjoin-5': {
    python: `${PY_MINUTES}events = [('u1', '10:00'), ('u1', '10:20'), ('u2', '10:30'), ('u1', '10:45'), ('u1', '11:20')]
count, last = {}, {}
emitted = None
for user, at in events:
    now = minutes(at)
    if user in count and now - last[user] >= 30:
        del count[user]
    count[user] = count.get(user, 0) + 1
    last[user] = now
    if (user, at) == ('u1', '11:20'):
        emitted = count[user]
print(emitted)`,
  },
  // The card's arrivals through an interval join whose orders leave state at time + 30,
  // with a watermark of the newest event time minus 5.
  'de-sjoin-9': {
    python: `${PY_MINUTES}arrivals = [
    ('order', 'o1', '10:00'), ('order', 'o2', '10:10'), ('payment', 'o1', '10:12'),
    ('order', 'o3', '10:30'), ('payment', 'o3', '10:31'), ('order', 'o4', '10:50'),
    ('payment', 'o2', '10:35'), ('payment', 'o4', '10:52'),
]
orders = {}
newest = None
joined = 0
for kind, order_id, at in arrivals:
    t = minutes(at)
    newest = t if newest is None else max(newest, t)
    watermark = newest - 5
    orders = {o: ot for o, ot in orders.items() if ot + 30 > watermark}
    if kind == 'order':
        if t + 30 > watermark:
            orders[order_id] = t
    elif order_id in orders and orders[order_id] <= t <= orders[order_id] + 30:
        joined += 1
print(joined)`,
  },
};
