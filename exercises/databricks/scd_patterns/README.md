# Members who move

Topic: Slowly Changing Dimensions (SCD Type 1 / 2 / 3, MERGE patterns) (Databricks, Data Modeling & Warehousing Design).
Time: about 25 minutes.

## Task

A library's members move between branches, and each loan should keep counting under the branch the member had when they borrowed.
That is SCD Type 2: a change closes the member's current row and adds a new version, so a member has many rows but one current.
You keep the dimension as a Delta table with `MERGE` and `INSERT`, in `member_versions.py`:

- `create_dim_member(spark, table)` creates the Type 2 table: `member_sk`, `member_id`, `branch`, `valid_from`, `valid_to`, `is_current`.
- `apply_type2(spark, table, staging, load_day)` applies today's snapshot in the lesson's two steps, and leaves the table as it is when run again.
- `member_sk_on(spark, table, member_id, day)` finds the version valid on a day, the surrogate key a fact loaded that day stores.
- `loans_by_branch(spark, loans, table)` counts loans by branch, joining the loans to the dimension on that surrogate key.
- `fix_emails(spark, table, staging)` is Type 1 on a separate `(member_id, email)` table: one `MERGE` that overwrites, keeping no history.

## Examples

```python
apply_type2(spark, "dim_member", snapshot("m1 leeds", "m2 york"), "2026-01-01")
apply_type2(spark, "dim_member", snapshot("m1 hull", "m2 york", "m3 leeds"), "2026-03-01")
# member_sk, member_id, branch, valid_from, valid_to, is_current
# 1  m1  leeds  2026-01-01  2026-03-01  False
# 2  m2  york   2026-01-01  None        True
# 3  m1  hull   2026-03-01  None        True
# 4  m3  leeds  2026-03-01  None        True
member_sk_on(spark, "dim_member", "m1", "2026-02-15")   # 1
member_sk_on(spark, "dim_member", "m1", "2026-03-01")   # 3: valid_to is not part of the old version
```

A plain `MERGE` cannot both close a matched row and insert its replacement, which is why Type 2 takes two statements.
The first closes only the current rows whose branch changed, and the second inserts a current row for every staged member left without one, changed and new members alike.

Watch for the lesson's pitfall: joining loans to a Type 2 dimension on `member_id` matches every version of that member, so m1's two rows count each of m1's loans twice.
Join on the `member_sk` the loan stored, or on `member_id` with `is_current` when you want only today's branch.

Type 3, which keeps one earlier value in an extra column such as `prev_branch`, is the same `MERGE` as Type 1 with one more `SET`, so it is not part of this exercise.

## What differs on Databricks

On Databricks `member_sk` would usually be an identity column, `BIGINT GENERATED ALWAYS AS IDENTITY`, so the `INSERT` would leave it out and Delta would number the new rows.
The local Spark and Delta versions here reject identity columns, so `apply_type2` numbers new rows itself, after the largest key already in the table.
In a Lakeflow pipeline, `AUTO CDC ... STORED AS SCD TYPE 2` does both steps for you, adding its own `__START_AT` and `__END_AT` columns in place of `valid_from` and `valid_to`.

## Run the tests

Set up Java and the packages once (see `exercises/databricks/README.md`), then:

```bash
cd exercises/databricks/scd_patterns
pytest
```

The first run starts Spark and takes a little while.
Every test fails until you fill in the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
