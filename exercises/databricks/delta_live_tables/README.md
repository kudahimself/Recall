# Pipeline expectations

Topic: Delta Live Tables (DLT, expectations) (Databricks, Production Pipelines).
Time: about 25 minutes.

## Task

A declarative pipeline (Delta Live Tables, now Lakeflow Declarative Pipelines) decides three things for you: what kind of dataset each query makes, what its expectations do to bad rows, and the order to build the datasets in.
Those pipelines only run on Databricks, so you make the same decisions yourself in `pipeline_rules.py`, on loan events in a local Spark DataFrame:

- `constraint_sql(name, condition, on_violation=None)` writes one expectation as SQL, with the `ON VIOLATION` clause for `"drop"` or `"fail"`.
- `pick_dataset(append_only_source, aggregates_or_joins)` returns `"STREAMING TABLE"` or `"MATERIALIZED VIEW"`.
- `check_rows(df, expectations)` applies `warn`, `drop` and `fail` expectations to a DataFrame and counts each one's failing rows.
- `update_order(datasets)` reads which datasets each query refers to and returns an order to build them in.

## Examples

```python
constraint_sql("has_k", "k IS NOT NULL", "drop")
# "CONSTRAINT has_k EXPECT (k IS NOT NULL) ON VIOLATION DROP ROW"
kept, failures = check_rows(events, [("has_loan_id", "loan_id IS NOT NULL", "drop"),
                                     ("fee_not_negative", "fee >= 0", "warn")])
failures                                  # {"has_loan_id": 1, "fee_not_negative": 1}
kept.count()                              # 3: the negative fee is counted but kept
update_order({"gold": "... FROM silver", "silver": "... FROM STREAM(bronze)", "bronze": "..."})
# ["bronze", "silver", "gold"]
```

Watch for the lesson's pitfall: an expectation with no `ON VIOLATION` clause never removes a row.
Its failing rows are written and only counted, so `check_rows` keeps them for `"warn"` and drops them only for `"drop"`.

## What differs on Databricks

In a pipeline you would write `CREATE OR REFRESH STREAMING TABLE ... (CONSTRAINT ...)` in SQL, or `@dp.expect_or_drop` and friends in Python, and the pipeline would apply the expectations, show the counts in its data quality metrics and stop the update for a `FAIL UPDATE` one.
It also builds the dependency graph from the references itself, and its order is any order that respects the graph, often running independent datasets at the same time; the alphabetical tie-break is only here so the tests can check one answer.
Open-source Spark 4.0 has no declarative pipelines (`from pyspark import pipelines` does not exist in it), so nothing here imports `dlt` or a stand-in for it.

## Run the tests

Set up Java and the packages once (see `exercises/databricks/README.md`), then:

```bash
cd exercises/databricks/delta_live_tables
pytest
```

The first run starts Spark and takes a little while.
Every test fails until you fill in the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
