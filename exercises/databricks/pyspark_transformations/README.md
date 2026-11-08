# Loan pipeline

Topic: Transformations & Actions (Databricks, ELT with Spark SQL & Python).
Time: about 20 minutes.

## Task

Transformations such as `groupBy`, `orderBy` and `dropDuplicates` only add steps to a plan, and an action such as `take`, `first` or `collect` runs it.
In `loan_pipeline.py` you answer questions about a small table of library loans (`loan_id`, `branch`, `title`, `days`):

- `branch_stats(loans)` returns a DataFrame with `branch`, `loans` (row count) and `total_days`, sorted by `total_days`, biggest first.
- `unique_pairs(loans)` returns the distinct `(branch, title)` pairs as a two-column DataFrame.
- `repartitioned(loans, n)` returns the same rows in exactly `n` partitions, whether that is more or fewer than before.
- `top_titles(loans, n)` returns the `n` most borrowed titles as a Python list, ties broken A to Z, fetching only `n` rows.
- `longest_loan(loans)` returns the largest `days` value as a plain `int`.

## Examples

```python
loans = spark.createDataFrame([(1, "leeds", "Dune", 14), (2, "york", "Emma", 21)],
                              ["loan_id", "branch", "title", "days"])
branch_stats(loans).collect()   # york first (21 days), then leeds (14)
top_titles(loans, 1)            # ["Dune"]
longest_loan(loans)             # 21
```

Watch for the lesson's pitfall: `dropDuplicates` on some columns keeps one row per key but does not say which one, so only rely on the columns you kept.

## What differs on Databricks

In a notebook you would often end with `display(df)` instead of `collect()`, and the cluster's adaptive query execution may pick the partition count after a shuffle for you.
Here a plain local session runs the same `groupBy`, `orderBy` and `repartition`, and the tests check the partition count you ask for directly.

## Run the tests

Set up Java and the packages once (see `exercises/databricks/README.md`), then:

```bash
cd exercises/databricks/pyspark_transformations
pytest
```

The first run starts Spark and takes a little while.
Every test fails until you fill in the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
