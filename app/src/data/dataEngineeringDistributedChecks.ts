import { OutcomeCheck } from './dataEngineeringMovingDataChecks';

/**
 * How each predict-the-outcome answer in Distributed Data is checked by
 * running it. The format is the one of dataEngineeringMovingDataChecks.ts:
 * scripts/check-outcomes.js (run by `npm test`) creates the question's
 * `tables` in SQLite (sql.js), each named by the first word of its title, runs
 * the check, and compares the last result set with the question's `answer`.
 * The cards whose rule is a search or a walk (every read set of a quorum, the
 * levels of a B-tree, a lookup that stops at its first hit) are checked by a
 * short Python model.
 */

export const DISTRIBUTED_OUTCOME_CHECKS: Record<string, OutcomeCheck> = {
  // ── Partitioning, Skew & Hot Keys ──
  // The card's partition rule, store_id % 3; the busiest partition's rows.
  'de-skew-2': { sql: `SELECT MAX(n) FROM (SELECT COUNT(*) AS n FROM sales GROUP BY store_id % 3);` },
  // One task per partition, all at once, 1,000 rows a second: the largest partition sets the time.
  'de-skew-3': { sql: `SELECT MAX(row_count) / 1000 FROM partitions;` },
  // Rows per partition under customer_id % 8, the largest of them.
  'de-skew-4': { sql: `SELECT MAX(n) FROM (SELECT SUM(row_count) AS n FROM key_counts GROUP BY customer_id % 8);` },
  // Customer 8 copied once per salt 0-3, every other customer once with salt 0.
  'de-skew-5': {
    sql: `WITH s(salt) AS (VALUES (0), (1), (2), (3))
SELECT COUNT(*) FROM customers c JOIN s ON c.customer_id = 8 OR s.salt = 0;`,
  },
  // NULL keys go to partition 0, the others by customer_id % 4.
  'de-skew-9': { sql: `SELECT COUNT(*) FROM orders WHERE customer_id IS NULL OR customer_id % 4 = 0;` },

  // ── Replication & Consistency ──
  // f2 answers with the newest write for account 3 at or before its applied_lsn.
  'de-replica-2': {
    sql: `SELECT w.balance FROM writes w
WHERE w.account_id = 3
  AND w.lsn = (SELECT MAX(x.lsn) FROM writes x
               WHERE x.account_id = 3
                 AND x.lsn <= (SELECT applied_lsn FROM replicas WHERE replica_name = 'f2'));`,
  },
  // Acknowledged on the leader but beyond the best follower, which is promoted.
  'de-replica-3': {
    sql: `SELECT (SELECT applied_lsn FROM replicas WHERE replica_name = 'leader')
     - (SELECT MAX(applied_lsn) FROM replicas WHERE replica_name <> 'leader');`,
  },
  // Every read set of size R must hold a replica with version 12; the smallest such R.
  'de-replica-4': {
    python: `from itertools import combinations
versions = {'r1': 12, 'r2': 12, 'r3': 12, 'r4': 11, 'r5': 11}
def every_read_fresh(r):
    return all(max(versions[x] for x in ask) == 12 for ask in combinations(versions, r))
print(min(r for r in range(1, len(versions) + 1) if every_read_fresh(r)))`,
  },
  // The first second at which f2 has applied lsn 812.
  'de-replica-5': { sql: `SELECT MIN(at_second) FROM f2_positions WHERE applied_lsn >= 812;` },
  // A site's writes succeed when the replicas it can reach are at least W = 3.
  'de-replica-9': {
    sql: `SELECT SUM(c.writes_sent) FROM clients c
WHERE (SELECT COUNT(*) FROM replicas r WHERE r.site = c.client_site) >= 3;`,
  },

  // ── Storage Engines: B-Trees, LSM Trees & Bloom Filters ──
  // The newest entry for user 3, by written_seq.
  'de-engine-2': {
    sql: `SELECT points FROM entries
WHERE user_id = 3 AND written_seq = (SELECT MAX(written_seq) FROM entries WHERE user_id = 3);`,
  },
  // The key is in no file, so every "maybe" file is read and none stops the lookup.
  'de-engine-3': { sql: `SELECT COUNT(*) FROM filters WHERE filter_says = 'maybe';` },
  // Keys whose newest entry is a value, not a tombstone.
  'de-engine-4': {
    sql: `SELECT COUNT(*) FROM entries e
WHERE e.written_seq = (SELECT MAX(x.written_seq) FROM entries x WHERE x.item_key = e.item_key)
  AND e.item_value IS NOT NULL;`,
  },
  // Levels of the tree: leaf pages, then pages of 100 pointers, up to one root.
  'de-engine-5': {
    python: `keys, per_leaf, per_inner = 1000000, 100, 100
pages = -(-keys // per_leaf)
levels = 1
while pages > 1:
    pages = -(-pages // per_inner)
    levels += 1
print(levels)`,
  },
  // Query A: "maybe" files newest first, stopping at the first that holds k42. Query B: every file.
  'de-engine-9': {
    python: `files = [('f8', 'no', 'no'), ('f7', 'no', 'no'), ('f6', 'maybe', 'yes'), ('f5', 'no', 'no'),
         ('f4', 'no', 'no'), ('f3', 'maybe', 'no'), ('f2', 'no', 'no'), ('f1', 'maybe', 'yes')]
lookup = 0
for name, says, holds in files:
    if says == 'no':
        continue
    lookup += 1
    if holds == 'yes':
        break
scan = len(files)
print(lookup + scan)`,
  },
};
