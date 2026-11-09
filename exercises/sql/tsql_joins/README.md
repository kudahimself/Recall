# Who has what

Topic: Joins (SQL for Data Engineering, Querying Foundations).
Time: about 20 minutes.

## Task

Loans point at a member and a book by their ids, so every question about who borrowed what is a join.
Write one T-SQL query under each `-- query:` line of `member_loans.sql`:

- `loans_with_titles`: one row per loan, as `MemberName, Title`.
- `members_in_2026`: every member with each title they borrowed in 2026, as `MemberName, Title`; a member with no 2026 loan still appears once, with NULL for the title.
- `no_loans`: the members who have never borrowed anything, as `MemberName`.
- `never_borrowed`: the books nobody has borrowed, as `Title`.

Row order does not matter for any of them.

## The tables

The tests create these tables and fill them with these rows:

```
dbo.Member  (MemberId, MemberName)   1 Ana, 2 Ben, 3 Cleo, 4 Dev
dbo.Book    (BookId, Title)          10 Dune, 11 Emma, 12 Ubik, 13 Hyperion
dbo.Loan    (LoanId, MemberId, BookId, LoanYear)
            100, 1, 10, 2025
            101, 1, 11, 2026
            102, 3, 12, 2026
            103, 3, 10, 2026
            104, 2, 11, 2025
```

## Examples

```
loans_with_titles   (Ana, Dune), (Ana, Emma), (Cleo, Ubik), (Cleo, Dune), (Ben, Emma)
members_in_2026     (Ana, Emma), (Ben, NULL), (Cleo, Ubik), (Cleo, Dune), (Dev, NULL)
```

Watch for the lesson's pitfall: with `LEFT JOIN`, a condition on the right-hand table in `WHERE` throws away the rows it filled with NULL.
Ben borrowed only in 2025, so `WHERE l.LoanYear = 2026` drops him; put the year in the `ON` clause to keep him.

## Run the tests

```bash
cd exercises/sql/tsql_joins
pytest
```

The tests read your T-SQL and run it on DuckDB (see `exercises/sql/README.md`).
Every test fails until you write the queries.
When they all pass, tick the exercise done in Recall under Progress, Topics.
