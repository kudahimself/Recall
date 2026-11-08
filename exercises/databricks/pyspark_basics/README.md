# Bookshop frames

Topic: DataFrame Basics (Databricks, ELT with Spark SQL & Python).
Time: about 15 minutes.

## Task

A DataFrame is a table with named, typed columns that never changes: `select`, `filter` and `withColumn` each hand back a new one.
In `bookshop_frames.py` you shape a small bookshop price list with five helpers:

- `books_df(spark, rows)` builds a DataFrame with the columns `title`, `price` and `pages` from tuples whose price is still text.
- `parse_prices(books)` replaces the `price` column with a `double` version of itself, keeping the column order.
- `cheap_books(books, limit)` keeps only `title` and `price`, for books priced below `limit`.
- `add_length_band(books)` adds a `band` column that says `"long"` from 300 pages up and `"short"` below.
- `add_price_with_vat(books)` adds `price_inc_vat`, the price plus 20 percent.

## Examples

```python
books = books_df(spark, [("Dune", "12.50", 412), ("Ubik", "6.25", 202)])
priced = parse_prices(books)          # price is now a double
cheap_books(priced, 9).collect()      # [Row(title='Ubik', price=6.25)]
add_length_band(priced)               # Dune is "long", Ubik is "short"
```

Watch for the lesson's pitfall: a `withColumn(...)` on a line of its own does nothing, because the new column is in the DataFrame it returns, so return that result.

## What differs on Databricks

In a notebook `spark` is already there and the price list would usually come from `spark.table("main.shop.books")` or a CSV read, not from tuples in the code.
Here the data is built in memory so the tests run on your laptop, but `select`, `filter`, `withColumn` and `cast` behave exactly the same on a cluster.

## Run the tests

Set up Java and the packages once (see `exercises/databricks/README.md`), then:

```bash
cd exercises/databricks/pyspark_basics
pytest
```

The first run starts Spark and takes a little while.
Every test fails until you fill in the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
