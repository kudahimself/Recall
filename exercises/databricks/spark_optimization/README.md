# Shops, joins and partitions

Topic: Spark Optimization (caching, broadcast, partitioning) (Databricks, Optimization & Advanced).
Time: about 25 minutes.

## Task

Most of a slow job's time goes to the shuffle, so the four tools of the lesson each avoid one: a broadcast join, a cache, the right number of partitions and partition pruning.
You write them in `shop_joins.py`, on sales of four bookshops in a local Spark session, and the tests read each query's physical plan to check what Spark will really do:

- `plan_text(df)` is already written: it returns what `df.explain()` prints, as a string.
- `join_shops(sales, shops)` joins the sales to the small shops table with a broadcast join, even when Spark would not choose one itself.
- `join_strategy(df)` reads the plan and returns `"broadcast"` or `"sort-merge"`.
- `cache_for_reuse(df)` caches a DataFrame that later actions reuse and fills the cache; `release(df)` frees it.
- `resize(df, n)` changes the number of partitions, merging them without a shuffle when it can.
- `spread_by(df, n, column)` shuffles into `n` partitions so each value of the column sits in one partition.
- `write_by_day(df, table, column)` saves a Delta table with one directory per value, and `read_day(spark, table, column, value)` reads one value's rows so Spark skips the other directories.

## Examples

```python
joined = join_shops(sales, shops)
join_strategy(joined)                         # "broadcast"
join_strategy(sales.join(shops, "shop_id"))   # "broadcast" too: shops is under 10 MB
sold = cache_for_reuse(joined)                # cached and already filled
resize(sales, 2).rdd.getNumPartitions()       # 2, with no Exchange in the plan
write_by_day(visits, "visits", "visit_day")
read_day(spark, "visits", "visit_day", "2026-03-01")   # PartitionFilters in the plan
```

Watch for the lesson's pitfall: `cache()` stores nothing when it runs.
It only marks the DataFrame, so `cache_for_reuse` also runs an action that reads every partition (`count()` does), and the test checks that every partition is in the cache before any other action runs.

## What differs on Databricks

The plans, the 10 MB `spark.sql.autoBroadcastJoinThreshold` and Adaptive Query Execution are the same on Databricks, which runs Apache Spark.
There, Photon may run parts of the plan in its own engine (you see `Photon` operators in `explain()`), and liquid clustering on a table replaces most `partitionBy` choices.
Serverless compute supports `cache()` only in recent environment versions; where it does not, write a reused result to a table instead.
Here Spark runs in local mode with 2 cores, so a shuffle only moves rows between threads, but the plan shows the same `Exchange`.

## Run the tests

Set up Java and the packages once (see `exercises/databricks/README.md`), then:

```bash
cd exercises/databricks/spark_optimization
pytest
```

The first run starts Spark and takes a little while.
Every test fails until you fill in the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
