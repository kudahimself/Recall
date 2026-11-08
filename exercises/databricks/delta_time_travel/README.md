# Shelf history in Delta

Topic: Delta Time Travel (Databricks, Lakehouse Platform).
Time: about 15 minutes.

## Task

A `shelves` Delta table of `(shelf, books)` has been changed three times: created, filled, and then wrongly emptied.
You write five helpers in `shelf_history.py` that read its history and undo the mistake:

- `latest_version(spark, table)` returns the highest version number from the table's history.
- `operations(spark, table)` lists the commits' operation names, oldest first.
- `total_books_at_version(spark, table, version)` sums the `books` column as it was at an old version.
- `total_books_at_time(spark, table, moment)` does the same for the version that was current at a timestamp string.
- `undo_to_version(spark, table, version)` restores the table to an old version.

## Examples

```python
latest_version(spark, "shelves")                  # 2
operations(spark, "shelves")                      # ["CREATE TABLE", "WRITE", "UPDATE"]
total_books_at_version(spark, "shelves", 1)       # 65, before the UPDATE emptied the shelves
undo_to_version(spark, "shelves", 1)
latest_version(spark, "shelves")                  # 3, a restore is a new version
```

Watch for the lesson's pitfall: `RESTORE` does not delete the later versions or turn the version number back, it commits a new version holding the old state.

## What differs on Databricks

On Databricks the table would be a Unity Catalog table such as `main.library.shelves`, and `DESCRIBE HISTORY` also shows the user and cluster behind each commit.
Time travel there is limited by the same file retention that applies here: once `VACUUM` has deleted the removed files of an old version, that version can no longer be read.
The exact operation name for an `INSERT` can differ between engines, so the tests only check the first and last names.

## Run the tests

Set up Java and the packages once (see `exercises/databricks/README.md`), then:

```bash
cd exercises/databricks/delta_time_travel
pytest
```

The first run starts Spark and takes a little while.
Every test fails until you fill in the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
