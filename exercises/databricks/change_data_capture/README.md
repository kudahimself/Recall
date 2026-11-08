# Title changes from the feed

Topic: Change Data Capture (CDF, table_changes) (Databricks, Incremental Data Processing).
Time: about 25 minutes.

## Task

A `titles` Delta table of `(isbn, shelf)` is copied to other systems, and they should get only the rows that changed, not the whole table again.
You write five helpers in `title_changes.py` on Delta's Change Data Feed:

- `create_tracked(spark, table)` creates the table with the feed switched on from the start.
- `start_tracking(spark, table)` switches the feed on for a table that already exists.
- `changes_since(spark, table, start, end=None)` lists the changes as `(version, isbn, shelf, change type)`, each update once with its new shelf.
- `change_counts(spark, table, start)` counts the inserts, updates and deletes.
- `apply_changes(spark, table, target, start)` merges the latest change of each isbn into an older copy of the table.

## Examples

```python
# version 1 inserts A1, B2, C3 on "main"; 2 moves B2 to "annex"; 3 deletes C3
changes_since(spark, "titles", 2)
# [(2, "B2", "annex", "update_postimage"), (3, "C3", "main", "delete")]
change_counts(spark, "titles", 1)   # {"insert": 3, "update": 1, "delete": 1}
```

Watch for the lesson's pitfall: every updated row appears twice in the feed, as `update_preimage` with the old values and `update_postimage` with the new.
Drop the preimage rows before you count or apply changes, or each update counts twice and the old shelf can be written back.

## What differs on Databricks

The Change Data Feed, `table_changes` and `MERGE` are open-source Delta Lake, so this SQL runs on Databricks unchanged, where the table would have a Unity Catalog name such as `main.library.titles`.
On Databricks a stream usually reads the feed with `readChangeFeed` and a `startingVersion`, and a Lakeflow pipeline can apply the changes with `AUTO CDC` instead of your own `MERGE`.

## Run the tests

Set up Java and the packages once (see `exercises/databricks/README.md`), then:

```bash
cd exercises/databricks/change_data_capture
pytest
```

The first run starts Spark and takes a little while.
Every test fails until you fill in the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
