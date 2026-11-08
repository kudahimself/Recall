# Loans through the layers

Topic: Medallion Architecture (bronze/silver/gold) (Databricks, Incremental Data Processing).
Time: about 20 minutes.

## Task

Loan records arrive in daily files as text: some loans come twice, a later batch correcting an earlier one, one record has no loan id and one fee is `"n/a"`.
You write four helpers in `loan_layers.py` that pass them through three layers of Delta tables:

- `add_to_bronze(spark, records, source_file, bronze)` appends the raw records with their source file, keeping everything.
- `build_silver(spark, bronze, silver)` keeps one row per loan from its latest batch, with the fee cast to an INT, and leaves out records with no loan id.
- `build_quarantine(spark, bronze, quarantine)` keeps the records Silver left out, with all their Bronze columns.
- `build_gold(spark, silver, gold)` counts the loans and adds up the fees per branch.

## Examples

```python
add_to_bronze(spark, [("L1", "leeds", "2", "1"), ...], "day1.csv", "bronze_loans")
add_to_bronze(spark, [("L1", "leeds", "3", "10")], "day2.csv", "bronze_loans")
build_silver(spark, "bronze_loans", "silver_loans")   # L1 once, with fee 3
build_gold(spark, "silver_loans", "gold_fees")         # leeds: 1 loan, fees 3
```

Watch for the lesson's pitfall: a Gold table built straight from Bronze counts every replayed record, so Leeds would show two loans and fees of 5.
Gold reads Silver only, and Bronze keeps even the rows Silver rejects, so Silver can be rebuilt when a rule changes.

## What differs on Databricks

On Databricks each layer is usually its own Unity Catalog schema, such as `main.bronze.loans`, `main.silver.loans` and `main.gold.branch_fees`, so access can follow quality; local Spark has one schema, so the layer is part of the table name.
Auto Loader or a stream would usually feed Bronze, where here a plain append does.
Databricks SQL can write the latest-row filter as `QUALIFY ROW_NUMBER() OVER (...) = 1`, but open-source Spark 4.0 has no `QUALIFY`, so put the `ROW_NUMBER` in a subquery and filter on it outside.

## Run the tests

Set up Java and the packages once (see `exercises/databricks/README.md`), then:

```bash
cd exercises/databricks/medallion_architecture
pytest
```

The first run starts Spark and takes a little while.
Every test fails until you fill in the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
