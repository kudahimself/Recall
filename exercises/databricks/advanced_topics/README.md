# Your own column functions

Topic: Advanced Concepts (Databricks, Optimization & Advanced).
Time: about 25 minutes.

## Task

A user-defined function (UDF) runs your own code on a column, for logic no built-in function covers.
You write each kind the lesson shows in `shelf_udfs.py`, on library loans in a local Spark session, and one built-in version to compare:

- `shelf(title)` is a Python UDF, called once per row: the first two letters of a title in capitals, and `None` for a NULL title.
- `shelf_builtin(column)` gives the same codes with `upper` and `substring`, so the work stays in the JVM.
- `late_fee(days)` is a pandas UDF, called on a whole Arrow batch at once: half a pound for each day past 14, never below 0.
- `register_shelf(spark)` makes `shelf` callable from SQL as `shelf_sql`.
- `create_days_late(spark)` creates a temporary SQL function, `days_late(days INT) RETURNS INT`, with `CREATE FUNCTION ... RETURN`.
- `fee_share(df)` divides each fee by the largest fee of the whole DataFrame.

## Examples

```python
loans.select(shelf("title"), shelf_builtin("title"), late_fee("days"))
# ("Dune", 20) -> "DU", "DU", 3.0
# (None, 16)   -> None, None, 1.0
register_shelf(spark)
spark.sql("SELECT shelf_sql('emma')")         # "EM"
create_days_late(spark)
spark.sql("SELECT days_late(20)")             # 6
fee_share(fees)                                # fee 8.0 -> share 1.0, fee 2.0 -> 0.25
```

The tests also read each query's plan: `BatchEvalPython` is a Python UDF, `ArrowEvalPython` a pandas UDF, and `shelf_builtin` must show neither.

Watch for the lesson's pitfall: a pandas UDF is called once per Arrow batch, not once for the whole column.
The `fee_share` test sets batches of 2 rows, so a largest fee worked out inside a pandas UDF would be the largest of 2 rows; work it out with a Spark aggregate or window instead.

## What differs on Databricks

Python and pandas UDFs work the same in a Databricks notebook, where Photon runs the built-in functions faster still but cannot run a Python UDF.
In Unity Catalog, `CREATE FUNCTION cat.sch.days_late(...)` stores the SQL function in a schema, governed and shared like a table.
Local Spark has no Unity Catalog, so `days_late` is a temporary function that lasts for the session.
The packages here need pandas and pyarrow, which `exercises/requirements.txt` installs, and this folder's `conftest.py` runs the UDF workers on the same Python as the tests.

## Run the tests

Set up Java and the packages once (see `exercises/databricks/README.md`), then:

```bash
cd exercises/databricks/advanced_topics
pytest
```

The first run starts Spark and takes a little while.
Every test fails until you fill in the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
