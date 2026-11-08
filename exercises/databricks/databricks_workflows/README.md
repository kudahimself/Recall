# Job graphs and repair runs

Topic: Workflows & Job Orchestration (Databricks, Production Pipelines).
Time: about 25 minutes.

## Task

A nightly job extracts the day's loans, then builds a report and an archive side by side, then sends a notice once the report is done.
Jobs run only on Databricks, so you write the job's settings as the plain dicts the Jobs API takes, and work out how a run goes, in `job_specs.py`:

- `notebook_task(task_key, notebook_path, depends_on=(), max_retries=0)` returns one task, with its upstream tasks.
- `scheduled_job(name, tasks, cron, timezone="UTC", parameters=None)` returns the job: a cron schedule, job parameters with defaults, and the tasks.
- `job_problems(job)` names duplicate task keys, dependencies on tasks that do not exist, and a loop of dependencies.
- `run_states(job, failures)` returns how each task ends, `"SUCCESS"`, `"FAILED"` or `"UPSTREAM_FAILED"`, given how many attempts of each task fail.
- `repair_run(states)` returns the tasks a repair run reruns.

## Examples

```python
job = scheduled_job("nightly_loans", [extract, report, archive, notify], "0 0 2 * * ?")
run_states(job, {"report": 1})
# {"extract": "SUCCESS", "report": "FAILED", "archive": "SUCCESS", "notify": "UPSTREAM_FAILED"}
repair_run(run_states(job, {"report": 1}))   # ["notify", "report"]
```

Watch for the lesson's points: a failed task skips only the tasks after it, as Upstream failed, while other branches run on.
A retry gives a flaky task more attempts, and a repair run reruns only the failed and skipped tasks, not the ones that succeeded.

## What differs on Databricks

On Databricks you would send these settings to the Jobs API or the SDK, or write them in an asset bundle's `databricks.yml`, and the job service would run the tasks, retry them and record each run's states, which you can repair from the Jobs UI.
The real settings also name each task's compute (serverless or a job cluster) and use states such as `SUCCESS`, `FAILED` and `UPSTREAM_FAILED` among others; `run_states` only plays a run out on paper, since no task or notebook runs here.
Passing values between tasks with `dbutils.jobs.taskValues` and reading job parameters with `dbutils.widgets.get` need a real job, so they are not part of this exercise.

## Run the tests

Set up the packages once (see `exercises/databricks/README.md`), then:

```bash
cd exercises/databricks/databricks_workflows
pytest
```

These tests do not start Spark, so they run in a moment.
Every test fails until you fill in the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
