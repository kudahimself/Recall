# Shelf stock on Spark

Topic: Databricks Fundamentals (Databricks, Lakehouse Platform).
Time: about 15 minutes.

## Task

A Databricks notebook starts with `spark` already attached to compute.
Here the tests hand you the same thing, a local Spark session, and you write the first five helpers in `shelf_spark.py`:

- `books_df(spark, rows)` turns a list of `(book_id, title, year)` tuples into a DataFrame with those three column names.
- `modern_titles(books)` returns the titles of books published after 1900, sorted A to Z, as a Python list.
- `books_per_decade(books)` counts books per decade (1965 is in the decade 1960) with a `groupBy`, and returns a dict.
- `save_as_table(spark, books, table)` saves the books as a table, replacing it if it exists, and returns the table format that `DESCRIBE DETAIL` reports.
- `row_count(books)` returns how many rows there are, as an int.

## Examples

```python
books = books_df(spark, [(1, "Dune", 1965), (2, "Emma", 1815)])
modern_titles(books)        # ["Dune"]
books_per_decade(books)     # {1960: 1, 1810: 1}
row_count(books)            # 2
save_as_table(spark, books, "shelf_books")   # "delta"
```

Watch for the lesson's pitfall: plain Python runs on the driver alone, so keep the filtering and counting in Spark and `collect()` only small results.

## What differs on Databricks

In a notebook you do not build the session: `spark` is already there, and `saveAsTable` writes a Unity Catalog table such as `main.library.books`.
Here the table lives in a throwaway local warehouse folder that is deleted when the tests end, and Delta Lake is switched on by `spark_setup.py` so the table format is `delta` as on Databricks.

## Run the tests

Set up Java and the packages once (see `exercises/databricks/README.md`), then:

```bash
cd exercises/databricks/databricks_basics
pytest
```

The first run starts Spark and takes a little while.
Every test fails until you fill in the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
