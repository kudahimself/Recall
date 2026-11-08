# The gold job and its gates

Topic: Orchestration & Data-Quality Design (run_if, backfill, DLT expectations) (Databricks, Lakehouse Architecture & Engineering Practice).
Time: about 25 minutes.

## Task

A shop's gold sales table is built by one job: `split` decides the regions, `tax` runs only when an If/Else task says so, and `gold` fans in after both.
The job should start when silver commits, backfill a range of days a few at a time, and silver should keep bad rows out without losing them.
Jobs and pipelines run only on Databricks, so you write their settings as the plain dicts the Jobs API takes and play their runs out in `gold_runs.py`, and run the quality gate on a local DataFrame:

- `should_run(run_if, upstream)` decides whether a task runs, given its `run_if` and how its upstream tasks ended.
- `run_states(tasks, outcomes)` plays one run of a job and returns how each task ends.
- `on_table_update(table_names)` returns the trigger that starts the job when silver commits.
- `backfill_task(task_key, inner_task, first_day, last_day, concurrency=4)` returns a `for_each_task` over the days, with a bounded concurrency.
- `split_quarantine(df, rules)` splits rows into silver and a quarantine table that says which rules each row broke.

## Examples

```python
run_states(gold_job(), {"tax": "SKIPPED"})
# {"split": "SUCCESS", "tax": "SKIPPED", "gold": "SKIPPED"}   gold left on ALL_SUCCESS
run_states(gold_job("NONE_FAILED"), {"tax": "SKIPPED"})["gold"]   # "SUCCESS"
backfill_task("days", one_day, "2026-02-27", "2026-03-01")["for_each_task"]["inputs"]
# '["2026-02-27", "2026-02-28", "2026-03-01"]'
silver, quarantine = split_quarantine(events, {"has_id": "loan_id IS NOT NULL", "fee": "fee >= 0"})
# quarantine row (None, "hull", -5) has failed_rules ["has_id", "fee"]
```

Watch for the lesson's pitfall, the Ghost Sink Failure: when an If/Else skips `tax` on purpose, a fan-in left on the default `ALL_SUCCESS` is skipped too, so gold is not built although nothing failed.
`NONE_FAILED` accepts the skipped branch and still stops on a real failure.
And a rule that gives NULL, such as `fee >= 0` on a missing fee, is neither true nor false: count it as broken, or the row ends up in neither table.

## What differs on Databricks

On Databricks the dicts would go to the Jobs API or into a bundle's `databricks.yml`, and the job service would decide what runs; `run_states` only plays a run out on paper.
The service has more `run_if` values (`AT_LEAST_ONE_FAILED`, `ALL_FAILED`) and more end states, such as Excluded for a task an If/Else branch left out, and the `for_each_task` iterations read their day as `{{input}}`.
In a Lakeflow pipeline silver would be a table with `@dp.expect_all_or_drop(rules)`, which also counts each rule's failures in the event log, and quarantine a second table reading the same source with the rules negated; `split_quarantine` builds both from one DataFrame instead.

## Run the tests

Set up Java and the packages once (see `exercises/databricks/README.md`), then:

```bash
cd exercises/databricks/orchestration_design
pytest
```

The first run starts Spark and takes a little while.
Every test fails until you fill in the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
