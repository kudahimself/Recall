# Shelves with set operations

Topic: Set Operations (UNION, INTERSECT, EXCEPT) (Databricks, ELT with Spark SQL & Python).
Time: about 15 minutes.

## Task

Compare two shelves with set operations in `branch_sets.py`, where each function returns SQL text that the tests run on temp views `north_books(title)` and `south_books(book_title)`:

- `all_copies_sql()` and `distinct_titles_sql()` stack both shelves with and without removing duplicates.
- `on_both_shelves_sql()` returns the titles found on both shelves.
- `only_north_sql()` and `only_south_sql()` return the titles missing from the other shelf.
- `extra_north_copies_sql()` returns the North copies beyond what South holds, counting duplicates.

## Examples

```python
spark.sql(only_north_sql()).collect()
# [Row(title='Ulysses')]
```

Watch for the lesson's pitfall: the columns are matched by position, not by name (the two views name theirs differently), and `EXCEPT` gives a different answer when you swap the two queries.

## What differs on Databricks

The SQL is the same on Databricks, which also supports `MINUS` as another name for `EXCEPT` and runs these over Unity Catalog tables.
Here the shelves are throwaway temp views that the tests create.

## Run the tests

Set up Java and the packages once (see `exercises/databricks/README.md`), then:

```bash
cd exercises/databricks/sql_set_operations
pytest
```

The first run starts Spark and takes a little while.
Every test fails until you fill in the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
