# Plan the backfill

Topic: Backfills & Reprocessing (Data Engineering, Moving Data).
Time: about 25 minutes.

## Task

A bug in `orders_clean` was fixed today, and every day since it shipped has to be rebuilt, with every table built from it.
Each daily job takes a `run_date` and replaces that day, so a backfill is the same job run for past dates.
Fill in the three functions in `backfill_planner.py` to plan it:

- `backfill_days(first_bad_day, last_day, raw_kept_from)` lists the days to rerun, and the days the kept raw data cannot reach.
- `tables_to_rebuild(deps, fixed)` lists the fixed table and everything built from it, upstream first.
- `schedule(deps, fixed, days, reads_previous_day)` groups the (table, day) jobs into waves, running every job as early as its inputs allow.

Plain Python and the standard library: `datetime.date.fromisoformat` and `timedelta` do the date arithmetic.

## Examples

```python
backfill_days("2026-10-30", "2026-11-02", "2026-11-01")
# (["2026-11-01", "2026-11-02"], ["2026-10-30", "2026-10-31"])
deps = {"orders_clean": ["orders_raw"], "daily_sales": ["orders_clean"],
        "customer_ltv": ["orders_clean"], "exec_dashboard": ["daily_sales", "customer_ltv"]}
tables_to_rebuild(deps, "orders_clean")
# ["orders_clean", "customer_ltv", "daily_sales", "exec_dashboard"]
schedule({"daily_sales": ["orders_clean"], "running_balance": ["daily_sales"]},
         "daily_sales", ["2026-11-01", "2026-11-02"], reads_previous_day={"running_balance"})
# [[("daily_sales", "2026-11-01"), ("daily_sales", "2026-11-02")],
#  [("running_balance", "2026-11-01")],
#  [("running_balance", "2026-11-02")]]
```

Watch for the lesson's pitfall: fixing history with a one-off `UPDATE` instead of the daily job.
It cannot be resumed, checked per day or repeated safely, and it leaves the downstream tables as they were, which is why the plan names every downstream table.
Days that do not depend on each other run in parallel; a table whose day reads the day before has to run in date order.

## Run the tests

```bash
cd exercises/data_engineering/de_backfills
pytest
```

Every test fails until you fill in the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
