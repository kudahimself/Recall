# Products past the mark

Topic: Full vs Incremental Loads (Data Engineering, Moving Data).
Time: about 20 minutes.

## Task

The warehouse keeps a copy of the shop's product table in `dim_product`.
Copying the whole table every night gets slower as it grows, so the load reads only what changed, past a high-water mark kept in `load_state`.
Fill in the three functions in `product_marks.py`:

- `load_incremental(con, crash_before_mark=None)` upserts the products changed since the mark and moves the mark, in one transaction, and returns how many rows it read.
- `load_full(con)` replaces the whole copy, which also catches rows deleted at the source.
- `missed_deletes(con)` lists the products the copy still holds that the source has deleted.

The tests run on DuckDB, an in-process database: each test opens a fresh one in memory and passes you the connection, so there is no server to start.
Parameters are written `?` and passed as a list, and a transaction is `BEGIN TRANSACTION` then `COMMIT` or `ROLLBACK`.

## Examples

With the lesson's tables (mark at 08:00 on 2026-11-01):

```python
load_incremental(con)   # 2: products 2 (now 30) and 3 (new); the mark moves to 11:15
load_incremental(con)   # 0: nothing past 11:15, the mark stays
# product 1 is deleted at the source
missed_deletes(con)     # [1]
load_full(con)          # 2, and product 1 is gone from dim_product
```

Watch for the lesson's pitfall: setting the mark to the time the job ran, or saving it before the rows commit.
A row that commits late with an earlier timestamp, or the rows of a run that failed after the mark moved, would then be skipped for good.
Take the new mark from the data the run read, and remember that `MAX` over no rows is `NULL`.

## Run the tests

```bash
cd exercises/data_engineering/de_full_vs_incremental
pytest
```

Every test fails until you fill in the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
