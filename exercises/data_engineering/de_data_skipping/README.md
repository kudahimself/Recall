# Prove the pruning

Topic: Skipping Data: Stats, Row Groups & Pruning (Data Engineering, Storage & Files).
Time: about 25 minutes.

## Task

A shop's sales table is queried mostly by day, and often by store.
Laid out in arrival order, every query reads all of it; laid out well, the engine rules most of it out before reading.
Fill in the four functions in `pruned_sales.py`, and use DuckDB to show the difference:

- `write_layout(con, folder)` writes the table as Parquet, a folder per `sale_day`, with rows sorted by `store_id` inside each file.
- `groups_to_read(con, files, column, value)` reads the files' footer statistics and lists the row groups a filter cannot skip.
- `files_read(con, sql)` asks DuckDB how many files a query really read, from its `EXPLAIN ANALYZE` profile.
- `choose_layout(profile)` applies the lesson's rule: partition by a filtered column with few values, sort by the next filtered one.

The tests run on DuckDB, an in-process database that reads and writes Parquet itself: each test opens one in memory and writes its files to a temporary folder, so there is no server to start.
`COPY (query) TO 'folder' (FORMAT parquet, PARTITION_BY (col), ROW_GROUP_SIZE n)` writes a partitioned layout, and `parquet_metadata('glob')` returns every file's footer.

## Examples

With 60,000 sales over 6 days, in groups of 2,048 rows:

```python
groups_to_read(con, "arrival.parquet", "store_id", 7)   # all 30 groups: every range holds 7
groups_to_read(con, "by_day/*/*.parquet", "store_id", 7) # 6 groups, the first of each file
files_read(con, "SELECT SUM(amount) FROM read_parquet('by_day/*/*.parquet', hive_partitioning = true) "
                "WHERE sale_day = DATE '2026-11-03'")    # 1 of the 6 files
choose_layout({"sale_day": {"distinct": 730, "filtered": 0.9},
               "user_id": {"distinct": 2_000_000, "filtered": 0.6}})   # ("sale_day", "user_id")
```

Watch for the lesson's pitfall: partitioning by a column with millions of values writes a tiny file per value, and rows in arrival order leave every min-to-max range wide.
The statistics come back as text, so cast them before comparing: as text, "990" sorts before "999" but "1000" sorts before both.

## Run the tests

```bash
cd exercises/data_engineering/de_data_skipping
pytest
```

Every test fails until you fill in the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
