# Customers through time

Topic: Slowly Changing Dimensions & Point-in-Time Joins (Data Engineering, Modeling for Analytics).
Time: about 25 minutes.

## Task

Customers move, and last year's sales should stay under the city they were made in.
So `dim_customer` keeps city as Type 2, a version per city with the dates it was valid, while a corrected email is simply overwritten (Type 1).
Fill in the four functions in `customer_versions.py`:

- `apply_snapshot(con, as_of)` merges today's source copy into the dimension: it closes changed versions, adds new ones with new surrogate keys, and overwrites emails.
- `version_on(con, customer_id, day)` finds the version valid on a day.
- `stamp_sales(con)` stores, on each sale, the surrogate key of the version valid on its date.
- `revenue_by_city(con)` reports revenue by the city each sale was made in.

The tests run on DuckDB, an in-process database: each test opens a fresh one in memory and passes you the connection, so there is no server to start.
DuckDB has `UPDATE ... FROM` and `IS DISTINCT FROM`; the SQL course's Slowly Changing Dimensions topic writes the same load as a T-SQL `MERGE`.

## Examples

With the lesson's dimension (C-07 moved from Leeds to York on 2026-06-01):

```python
version_on(con, "C-07", "2026-05-31")   # 1, Leeds
version_on(con, "C-07", "2026-06-01")   # 2, York: the Leeds interval excludes its end
stamp_sales(con)                        # 4 sales stamped; sale 1 (March) gets key 1
revenue_by_city(con)                    # [("Leeds", 90), ("York", 55)]
apply_snapshot(con, "2026-10-01")       # 2: C-09 moves to York, C-11 is new
apply_snapshot(con, "2026-10-01")       # 0: a rerun adds nothing
```

Watch for the lesson's pitfall: joining facts to the current row, or looking up the current row when a late fact is loaded.
Every past sale would then report under today's city, and nothing looks wrong until someone compares with last year's report.
Intervals are half-open, `valid_from <= day < valid_to`, so every day is in exactly one version.

## Run the tests

```bash
cd exercises/data_engineering/de_scd_point_in_time
pytest
```

Every test fails until you fill in the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
