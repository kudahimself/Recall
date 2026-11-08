# Fines maths

Topic: Math & Aggregate Functions (Databricks, ELT with Spark SQL & Python).
Time: about 20 minutes.

## Task

Math functions work on each row and aggregate functions squash many rows into one, skipping nulls as they go.
In `fines_math.py` you total and tidy the late fines in a table with `member_id`, `branch` and `amount`, where some amounts are missing:

- `fines_summary(fines)` returns `branch`, `total`, `avg_fine` (the average rounded to 2 decimals) and `n` (the row count) per branch.
- `add_whole_pounds(fines)` adds `pounds`, each amount rounded up to a whole pound.
- `add_capped(fines, cap)` adds `charged`, the amount but never above `cap`.
- `row_stats(fines)` returns a dict with `rows`, `filled` and `mean` computed in one pass: all rows, rows with an amount, and the average of the amounts that exist.
- `largest_fine(fines)` returns the biggest amount as a plain `float`.

## Examples

```python
# amounts for leeds: 2.0, 3.5, 1.0   york: 4.25, null
fines_summary(fines)    # leeds total 6.5, avg_fine 2.17, n 3;  york avg_fine 4.25, n 2
add_whole_pounds(fines) # 3.5 -> 4
row_stats(fines)        # {"rows": 5, "filled": 4, "mean": 2.6875}
```

Watch for the lesson's pitfall: `from pyspark.sql.functions import sum, round` hides Python's own `sum` and `round`, so import the module as `F` and call `F.sum`.

## What differs on Databricks

The functions are the same on a cluster, where the aggregates run in parallel across partitions and the result is the same.
Databricks SQL also lets you write the same logic as `SELECT branch, SUM(amount) ... GROUP BY branch` in a SQL cell.

## Run the tests

Set up Java and the packages once (see `exercises/databricks/README.md`), then:

```bash
cd exercises/databricks/math_functions
pytest
```

The first run starts Spark and takes a little while.
Every test fails until you fill in the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
