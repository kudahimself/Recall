# Visit files in Delta

Topic: Delta Optimization (OPTIMIZE, VACUUM, ZORDER) (Databricks, Lakehouse Platform).
Time: about 20 minutes.

## Task

Many small writes leave a Delta table with many small files.
A `visits` table of `(member_id, branch)` has three tiny commits, and you write five helpers in `visit_files.py` to tidy it:

- `file_count(spark, table)` returns how many data files the current version uses, from `DESCRIBE DETAIL`.
- `compact(spark, table)` compacts the small files with `OPTIMIZE`.
- `compact_by(spark, table, column)` compacts and co-locates rows by a column with `ZORDER BY`.
- `vacuum_default(spark, table)` runs a plain `VACUUM`, which only removes files older than the default 7 days.
- `vacuum_now(spark, table)` deletes every unused file at once with a zero-hour retention, switching Delta's retention safety check off for the statement and back on afterwards.

## Examples

```python
file_count(spark, "visits")      # 3, one file per small INSERT
compact(spark, "visits")
file_count(spark, "visits")      # 1, and still the same three rows
vacuum_default(spark, "visits")  # nothing is old enough, version 3 can still be read
vacuum_now(spark, "visits")      # the three replaced files are deleted, version 3 can no longer be read
```

Watch for the lesson's pitfall: `OPTIMIZE` frees no storage, since the files it replaced stay behind until `VACUUM` deletes them.

## What differs on Databricks

On Databricks, Unity Catalog managed tables can have predictive optimization run `OPTIMIZE` and `VACUUM` for you, and new tables are best clustered with liquid clustering (`CLUSTER BY`) instead of `ZORDER BY`.
Neither exists in open-source Delta, so here you run the commands yourself.
Databricks also blocks a retention shorter than 7 days unless you override a check, just as here, and a short retention breaks time travel and concurrent readers.

## Run the tests

Set up Java and the packages once (see `exercises/databricks/README.md`), then:

```bash
cd exercises/databricks/delta_optimization
pytest
```

The first run starts Spark and takes a little while.
Every test fails until you fill in the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
