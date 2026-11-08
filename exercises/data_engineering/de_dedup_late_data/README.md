# Sales that arrive late

Topic: Deduplication & Late-Arriving Data (Data Engineering, Moving Data).
Time: about 25 minutes.

## Task

Each night a batch of sales lands in `stg_sales`.
Retries put some sales in twice, corrections arrive as a higher `version`, and some sales arrive days after they happened.
Fill in the three functions in `late_sales.py`, so that `fact_sales` holds one row per sale and `daily_revenue` is right for every day:

- `newest_staged(con)` keeps one row per staged sale, its newest version.
- `touched_days(con)` finds the days the batch changes: the event dates of its new versions, and the dates they replace.
- `load_batch(con)` writes the new versions and rebuilds those days of `daily_revenue`, in one transaction.

The tests run on DuckDB, an in-process database: each test opens a fresh one in memory and passes you the connection, so there is no server to start.
DuckDB has `ROW_NUMBER() OVER (...)`, `UNION` and `CREATE TEMP TABLE` as you would expect.

## Examples

With the lesson's staged rows and sales 1, 2 and 5 already loaded:

```python
newest_staged(con)   # sale 2 keeps version 2 (25); sale 3 once; the late sale 4 under 2026-11-01
touched_days(con)    # [date(2026, 11, 1), date(2026, 11, 2)]
load_batch(con)      # the same list; 2026-11-01 now has 3 sales and 87
load_batch(con)      # []: a rerun changes nothing
```

Watch for the lesson's pitfall: grouping by the day a row arrived (`ingested_on`) instead of the day it happened.
Late rows would then move revenue from one day to the next, and both days would be wrong.
Pick the newest copy by `version`, not by arrival, and remember that a late row reopens a day that was already loaded.

## Run the tests

```bash
cd exercises/data_engineering/de_dedup_late_data
pytest
```

Every test fails until you fill in the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
