# Orders, loaded twice

Topic: Re-runs & Idempotent Loads (Data Engineering, Moving Data).
Time: about 25 minutes.

## Task

A nightly job moves the day's orders from `staging_orders` into `fact_orders`.
It will run more than once for the same day: a retry after a timeout, a re-run after a fix, a backfill of last month.
Fill in the two functions in `order_day_load.py` so that running a load twice leaves `fact_orders` exactly as running it once:

- `load_day(con, run_date, crash_after_delete=None)` makes the run's day of `fact_orders` equal to that day of `staging_orders`, in one transaction, and returns the day's row count.
- `merge_updates(con)` applies a feed of new and changed orders by `order_id`, with a `MERGE`.

The tests run on DuckDB, an in-process database: each test opens a fresh one in memory and passes you the connection, so there is no server to start.
DuckDB's SQL is close to the T-SQL of the lesson; parameters are written `?` and passed as a list.
Begin and end a transaction with `con.execute("BEGIN TRANSACTION")`, `"COMMIT"` and `"ROLLBACK"`.

## Examples

```python
load_day(con, "2026-11-01")   # 3: orders 101, 102 and 103
load_day(con, "2026-11-01")   # a retry: still 3, and fact_orders is unchanged
load_day(con, "2026-10-30")   # a backfill: 2, written under 2026-10-30
merge_updates(con)            # 2: order 102 updated, order 104 inserted
```

Watch for the lesson's pitfall: a blind `INSERT INTO fact_orders SELECT ... FROM staging_orders` is right on the first run and doubles the day on every retry.
Take the day from `run_date`, never from `CURRENT_DATE`, so a backfill lands in its own day, and leave the other days alone even when staging holds a late row for one of them.
`crash_after_delete` stands in for the worker dying half way: call it after your delete, and make sure the day is still whole afterwards.

## Run the tests

```bash
cd exercises/data_engineering/de_idempotent_loads
pytest
```

Every test fails until you fill in the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
