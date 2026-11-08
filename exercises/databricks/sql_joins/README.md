# Loans with SQL joins

Topic: SQL Joins (inner, left, right, cross, self) (Databricks, ELT with Spark SQL & Python).
Time: about 15 minutes.

## Task

Spark SQL does the pairing for you: you write the query text, Spark runs it.
Each function in `loan_joins.py` returns the SQL text of one query over four small temp views (`books`, `members`, `loans`, `branches`, described at the top of the file), and the tests run your text with `spark.sql` and compare the rows:

- `loaned_titles_sql()` gives one `(title, member_name)` row per loan, so books nobody borrowed do not appear.
- `all_books_with_loans_sql()` gives `(title, loan_id)` for every book, with `loan_id` NULL for a book that was never loaned.
- `never_loaned_sql()` gives just the `title` of the books that have no loan.
- `referrals_sql()` gives `(member_name, referrer)` using one table read twice, since `members.referred_by` points at another member.
- `member_branch_pairs_sql()` pairs every member with every branch.

## Examples

```python
spark.sql(loaned_titles_sql()).collect()
# [Row(title='Dune', member_name='Ana'), Row(title='Dune', member_name='Ben'), ...]
```

Watch for the lesson's pitfall: a book with two loans becomes two rows, so a join can grow the row count, and an inner join silently drops the books with no loan.

## What differs on Databricks

The SQL text is the same on Databricks, where you would run it in a notebook `%sql` cell or the SQL editor against Unity Catalog tables such as `main.library.loans`.
Here the tables are throwaway temp views built by the tests, which exist only in this Spark session.

## Run the tests

Set up Java and the packages once (see `exercises/databricks/README.md`), then:

```bash
cd exercises/databricks/sql_joins
pytest
```

The first run starts Spark and takes a little while.
Every test fails until you fill in the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
