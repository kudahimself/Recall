# Loan queries with CTEs

Topic: Subqueries & CTEs (Databricks, ELT with Spark SQL & Python).
Time: about 20 minutes.

## Task

Write five queries in `loan_queries.py` over small `books` and `loans` temp views, each returning SQL text that the tests run with `spark.sql`:

- `longer_than_average_sql()` uses a scalar subquery to find books longer than the average of all books.
- `longer_than_genre_average_sql()` uses a correlated subquery, so each book is compared to the average of its own genre.
- `borrowed_titles_sql()` and `never_borrowed_sql()` use `EXISTS` and `NOT EXISTS` against `loans`.
- `popular_titles_sql()` names the loan counts per title with a `WITH` clause, then keeps the titles with 2 or more loans.

## Examples

```python
spark.sql(borrowed_titles_sql()).collect()
# [Row(title='Dune'), Row(title='Emma'), Row(title='Solaris')]
```

Watch for the lesson's pitfall: a correlated subquery runs against the outer row, so without the `i.genre = o.genre` style link it silently becomes the plain overall average, and a CTE is only a name, not a stored or faster result.

## What differs on Databricks

The queries are the same on Databricks, where you would run them against Unity Catalog tables and the optimizer plans subqueries and CTEs the same way (a CTE is not materialized by default).
Here `books` and `loans` are throwaway temp views that the tests create.

## Run the tests

Set up Java and the packages once (see `exercises/databricks/README.md`), then:

```bash
cd exercises/databricks/sql_subqueries
pytest
```

The first run starts Spark and takes a little while.
Every test fails until you fill in the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
