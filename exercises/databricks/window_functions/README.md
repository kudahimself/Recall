# Sales trends with windows

Topic: Window Functions (row_number, rank, lag, lead) (Databricks, ELT with Spark SQL & Python).
Time: about 20 minutes.

## Task

Write five window-function queries in `sales_windows.py` over a small `sales` temp view, each returning SQL text that the tests run with `spark.sql`:

- `busiest_day_sql()` picks each branch's best day with `row_number()`, breaking ties by the earlier day.
- `copies_rank_sql()` ranks days by copies inside each branch with a function that leaves gaps after ties.
- `change_from_previous_day_sql()` uses `lag` to show how copies changed since the previous day.
- `running_total_sql()` adds a running total with an aggregate over a window.
- `before_a_drop_sql()` uses `lead` to find the days that sold more than the next day.

## Examples

```python
spark.sql(copies_rank_sql()).collect()
# [Row(branch='North', day='2024-01-02', copies=9, rnk=1), ...]
```

Watch for the lesson's pitfall: `PARTITION BY` restarts the calculation for each key, `ORDER BY` inside the window decides what "previous" means, and a window function cannot sit in `WHERE`, so filter on its result from an outer query.

## What differs on Databricks

The SQL is the same on Databricks, where the window runs across the cluster and a window with no `PARTITION BY` pulls every row into one task.
Here `sales` is a throwaway temp view that the tests create.

## Run the tests

Set up Java and the packages once (see `exercises/databricks/README.md`), then:

```bash
cd exercises/databricks/window_functions
pytest
```

The first run starts Spark and takes a little while.
Every test fails until you fill in the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
