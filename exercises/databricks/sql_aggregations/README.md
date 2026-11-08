# Fine totals in SQL

Topic: SQL Aggregations & GROUP BY (Databricks, ELT with Spark SQL & Python).
Time: about 15 minutes.

## Task

Write five report queries in `fine_totals.py`, each returning the SQL text that the tests run with `spark.sql` against a small `fines` temp view:

- `total_per_member_sql()` sums the fines per member with `GROUP BY`.
- `big_debtors_sql()` keeps only members whose total is over 300 cents.
- `branch_summary_sql()` gives per branch the number of fines, the number already waived and the largest fine.
- `repeat_unpaid_sql()` finds members with at least 2 fines that are not waived yet.
- `branch_rollup_sql()` gives the total per branch plus a grand total row where `branch` is NULL.

## Examples

```python
spark.sql(total_per_member_sql()).collect()
# [Row(member='Ana', total_cents=350), ...]
```

Watch for the lesson's pitfall: `WHERE` filters rows before grouping and cannot see an aggregate, `HAVING` filters the groups after it, and `COUNT(*)` counts rows while `COUNT(col)` skips NULLs.

## What differs on Databricks

The SQL is identical in a Databricks notebook or the SQL editor over a Unity Catalog table such as `main.library.fines`, where `GROUP BY ALL` is also available.
Here `fines` is a throwaway temp view that the tests create.

## Run the tests

Set up Java and the packages once (see `exercises/databricks/README.md`), then:

```bash
cd exercises/databricks/sql_aggregations
pytest
```

The first run starts Spark and takes a little while.
Every test fails until you fill in the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
