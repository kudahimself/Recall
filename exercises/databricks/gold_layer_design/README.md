# Receipts without the fan-out

Topic: Gold Layer & Multi-Hop Pipeline Design (OBT vs star, grain, marts, reprocessing) (Databricks, Lakehouse Architecture & Engineering Practice).
Time: about 25 minutes.

## Task

A bookshop's silver layer holds clean receipts, receipt lines and books, and the shop wants gold tables for its dashboards.
Each gold table has a declared grain, keeps the business rule its consumers need (test receipts never count), and can be repaired without readers seeing a half-built table.
You write them in `gold_receipts.py`:

- `daily_sales(spark, receipts, lines)` is one row per day: revenue and books, with each receipt's total counted once.
- `sales_obt(spark, receipts, lines, books)` is One Big Table at the line grain, the receipt's day and the book's title and genre joined on once, for a dashboard that filters on any of them.
- `weekly_sales(spark, gold)` is a rollup built beside the daily table, never in place of it.
- `replay_from(spark, receipts, lines, gold, day)` rewrites only the days from `day` on, after a bug damaged them.
- `publish(spark, view, table, receipts)` is blue/green: it checks a new table's revenue against the receipts and only then points the view that readers query at it.

## Examples

```python
daily_sales(spark, "receipts", "receipt_lines").collect()
# [(2026-03-01, 42, 4), (2026-03-02, 15, 1)]   receipt 5 has no lines but still adds its 6
weekly_sales(spark, "gold_daily").collect()
# [(2026-02-23, 42, 4), (2026-03-02, 20, 2)]   March 1, 2026 is a Sunday
publish(spark, "daily_sales", "daily_sales_v2", "receipts")   # True: 57 matches the receipts
```

Watch for the lesson's pitfall, the Fan-Out Bug: joining receipts to their lines before aggregating repeats each receipt once per line, so receipt 1's total of 30 counts three times and March 1 shows 102.
Count the lines per receipt first, then join that, one row per receipt, with a left join so a receipt with no lines is kept.

## What differs on Databricks

Everything here is open-source Spark and Delta, so it runs on Databricks as it is, with Unity Catalog names such as `main.shop_gold.daily_sales`.
There the gold tables might live in a catalog per domain, such as `finance_gold`, granted per catalog, and a Lakeflow Job would run the replay or the blue/green build after the silver update.
The check in `publish` is the simplest one; a real one would also compare row counts and keys, and keep v1 until v2 has been read for a while.

## Run the tests

Set up Java and the packages once (see `exercises/databricks/README.md`), then:

```bash
cd exercises/databricks/gold_layer_design
pytest
```

The first run starts Spark and takes a little while.
Every test fails until you fill in the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
