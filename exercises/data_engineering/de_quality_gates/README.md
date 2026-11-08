# Hold the bad batch

Topic: Data Quality: Tests, Contracts & Circuit Breakers (Data Engineering, Running Pipelines).
Time: about 20 minutes.

## Task

Tonight's orders land in `staging_orders`, where no dashboard reads them.
Before they are published to `fact_orders`, a gate tests them: a batch that breaks a rule the readers rely on is held, so the dashboards keep yesterday's correct data while the owner is alerted.
Fill in the three functions in `order_gate.py`:

- `blocking_failures(con)` runs the four blocking tests, each a query that counts the rows breaking one rule.
- `row_count_warning(con, normal_rows, tolerance)` warns when the batch is much bigger or smaller than usual.
- `run_gate(con, normal_rows, tolerance)` is write, audit, publish: hold the batch on a blocking failure, otherwise publish it in one transaction, and report the warnings either way.

The tests run on DuckDB, an in-process database: each test opens a fresh one in memory and passes you the connection, so there is no server to start.

## Examples

With the lesson's batch:

```python
blocking_failures(con)
# {"order_id unique": 0, "customer_id not null": 1, "status accepted": 1, "customer exists": 1}
run_gate(con, normal_rows=6)
# {"decision": "hold", "failures": {"customer_id not null": 1, "status accepted": 1,
#  "customer exists": 1}, "warnings": []}
# once orders 203, 204 and 205 are fixed:
run_gate(con, normal_rows=100)
# {"decision": "publish", "failures": {}, "warnings": ["row count 6, expected about 100"]}
```

Watch for the lesson's pitfall: testing the published table after the load.
By the time the test fails, dashboards and downstream jobs have read the bad batch, so the tests run on staging and the publish happens only after them.
Mind the `NULL`s: `status NOT IN (...)` is not true for a `NULL` status, and a missing customer_id is the not-null test's row, not the exists test's.

## Run the tests

```bash
cd exercises/data_engineering/de_quality_gates
pytest
```

Every test fails until you fill in the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
