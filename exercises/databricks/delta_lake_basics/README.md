# Loans ledger on Delta

Topic: Delta Lake Fundamentals (Databricks, Lakehouse Platform).
Time: about 20 minutes.

## Task

A Delta table is a folder of Parquet files plus a `_delta_log` of numbered commits.
You keep a small loans table at a path and write the six helpers in `loan_ledger_delta.py`:

- `create_loans(spark, path, rows)` writes `(loan_id, title)` tuples as a Delta table, replacing whatever is at `path`.
- `add_loans(spark, path, rows)` adds more tuples and keeps the rows that are already there.
- `read_loans(spark, path)` reads the table back as a DataFrame.
- `append_checked(spark, path, rows_with_copies)` tries to append `(loan_id, title, copies)` tuples and returns `True` if Delta refused them because of the extra column, `False` otherwise.
- `append_evolving(spark, path, rows_with_copies)` appends the same kind of tuples but lets the `copies` column join the table's schema.
- `commit_versions(spark, path)` lists the version numbers of the table's commits, oldest first.

## Examples

```python
create_loans(spark, path, [(1, "Dune"), (2, "Emma")])   # version 0
add_loans(spark, path, [(3, "Ubik")])                    # version 1
read_loans(spark, path).count()                          # 3
commit_versions(spark, path)                             # [0, 1]
append_checked(spark, path, [(4, "Kim", 2)])             # True: the schema does not match, nothing is committed
```

Watch for the lesson's pitfall: `overwrite` replaces every row of the table, so use `append` to add rows.

## What differs on Databricks

On Databricks you would normally save by table name, such as `main.library.loans`, and Unity Catalog manages the files for you.
A path-based table like this one must lie in a Unity Catalog external location.
Here the path is a temporary folder on your disk and the `_delta_log` is right there for you to look at.

## Run the tests

Set up Java and the packages once (see `exercises/databricks/README.md`), then:

```bash
cd exercises/databricks/delta_lake_basics
pytest
```

The first run starts Spark and takes a little while.
Every test fails until you fill in the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
