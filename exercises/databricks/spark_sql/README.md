# Shelf views in Spark SQL

Topic: Spark SQL Constructs (temp views, PIVOT, CASE, CAST) (Databricks, ELT with Spark SQL & Python).
Time: about 20 minutes.

## Task

Use the Spark SQL constructs in `shelf_views.py` to move between DataFrames and SQL:

- `register_sales(sales)` names a DataFrame as the temp view `raw_sales`.
- `clean_sales_sql()` returns a query that turns the text column `copies` into an `INT`, with unreadable text like `n/a` becoming NULL instead of an error.
- `stock_band_sql()` returns a `CASE` query that labels each book `high`, `mid` or `low`.
- `copies_by_branch_sql()` returns a `PIVOT` query with one column per branch.
- `define_low_stock_view(spark)` creates a temp view `low_stock` with a `CREATE OR REPLACE TEMP VIEW` statement.

## Examples

```python
register_sales(df)
spark.sql(clean_sales_sql()).collect()
# [Row(book='Dune', branch='North', copies=5), ...]
```

Watch for the lesson's pitfall: with ANSI mode on (the default in Spark 4 and on current Databricks runtimes) a plain `CAST` of bad text raises an error, and `PIVOT` groups by every other column of its input, so select only the columns you need first.

## What differs on Databricks

A notebook has the same `spark.sql`, temp views and `PIVOT`, and a temp view is just as session-only there (it is not a table in Unity Catalog).
Here the data comes from tiny DataFrames that the tests build.

## Run the tests

Set up Java and the packages once (see `exercises/databricks/README.md`), then:

```bash
cd exercises/databricks/spark_sql
pytest
```

The first run starts Spark and takes a little while.
Every test fails until you fill in the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
