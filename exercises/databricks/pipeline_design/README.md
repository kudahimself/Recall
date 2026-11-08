# Daily loans, run twice

Topic: Pipeline Design (idempotency, late arrivals, backfill, contracts) (Databricks, Data Modeling & Warehousing Design).
Time: about 25 minutes.

## Task

A nightly job copies new loans into a raw Delta table and builds a summary of loans per day and branch.
Jobs get retried after failures, rerun by hand and asked to backfill, and some loans arrive days late, so every write must leave the same table however many times it runs.
You write the pieces in `daily_counts.py`:

- `append_new(spark, target, staging)` adds a batch to the raw table, skipping loan ids it already holds.
- `rebuild_day(spark, raw, summary, day)` replaces one day of the summary, and only that day, in one atomic write.
- `backfill(spark, raw, summary, first_day, last_day)` rebuilds every day of a range with that same write.
- `rebuild_trailing(spark, raw, summary, run_day, days=3)` rebuilds the run's day and the days before it, so late rows are counted.
- `add_count_check(spark, summary)` adds a `CHECK` constraint, so a summary row with no loans fails its write.
- `contract_problems(df, contract)` compares a batch's columns and types with the producer's promised schema, before anything is written.

## Examples

```python
rebuild_day(spark, "loans_raw", "daily_loans", "2026-03-01")   # leeds 2, york 1
rebuild_day(spark, "loans_raw", "daily_loans", "2026-03-01")   # a retry: still leeds 2, york 1
backfill(spark, "loans_raw", "daily_loans", "2026-02-28", "2026-03-02")
# ["2026-02-28", "2026-03-01", "2026-03-02"]
contract_problems(batch, {"loan_id": "int", "loan_day": "date", "branch": "string"})
# ["type: loan_id is string, not int", "missing: loan_day", "extra: fee"]
```

Watch for the lesson's pitfall: a blind `INSERT INTO t SELECT ... FROM staging` appends the whole batch again on every retry.
Write through a `MERGE` on the unique key, or `INSERT INTO t REPLACE WHERE loan_day = ...`, which deletes and rewrites the run's own day in one commit.
A day with no raw loans left is rebuilt as empty too, so a backfill also clears rows that should no longer be there.

## What differs on Databricks

`MERGE`, `REPLACE WHERE` and `CHECK` constraints are open-source Delta Lake, so this SQL runs on Databricks unchanged, with Unity Catalog names such as `main.lib.daily_loans`.
On Databricks a backfill would usually be a Lakeflow Job's `for_each_task` over the days, each iteration running `rebuild_day`, and a contract check would also run as pipeline expectations on the rows.
Late events in a stream are bounded with `withWatermark("ts", "2 hours")` instead; this exercise sticks to the batch side.

## Run the tests

Set up Java and the packages once (see `exercises/databricks/README.md`), then:

```bash
cd exercises/databricks/pipeline_design
pytest
```

The first run starts Spark and takes a little while.
Every test fails until you fill in the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
