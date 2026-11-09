# Questions inside questions

Topic: Subqueries & CTEs (SQL for Data Engineering, Querying Foundations).
Time: about 25 minutes.

## Task

Each of these questions needs the answer to another question first: the average book, a member's loans, the most loans anyone has.
Write one T-SQL query under each `-- query:` line of `member_subqueries.sql`:

- `long_books`: the books with more pages than the average book, as `Title, Pages`.
- `long_loaners`: the members with at least one loan longer than 20 days, as `MemberName`, using `EXISTS`.
- `never_borrowed`: the books that appear in no loan, as `Title`.
- `busiest`: with a CTE that counts each member's loans, the member or members with the most loans, as `MemberName, Loans`.

Row order does not matter for any of them.

## The tables

The tests create these tables and fill them with these rows:

```
dbo.Member  (MemberId, MemberName)   1 Ana, 2 Ben, 3 Cleo, 4 Dev, 5 Eve
dbo.Book    (BookId, Title, Pages)   10 Dune 412, 11 Emma 474, 12 Ubik 202, 13 Hyperion 482, 14 Beloved 324
dbo.Loan    (LoanId, MemberId, BookId, Days)
            100, 1, 10, 14
            101, 1, 11, 30
            102, 2, 12, 7
            103, 3, 13, 21
            104, 3, 10, 4
            105, 5, NULL, 9      the tag of this loan's book was lost
```

## Examples

```
long_books      (Dune, 412), (Emma, 474), (Hyperion, 482)
long_loaners    Ana, Cleo
busiest         (Ana, 2), (Cleo, 2)
```

Watch for the lesson's pitfall: `WHERE BookId NOT IN (SELECT BookId FROM dbo.Loan)` returns no rows at all here, because loan 105 has a NULL BookId and `x <> NULL` is never true.
`NOT EXISTS` does not have that problem.
In `busiest`, the CTE lets you use the counts twice: once for the rows and once for their maximum.

## Run the tests

```bash
cd exercises/sql/tsql_subqueries_cte
pytest
```

The tests read your T-SQL and run it on DuckDB (see `exercises/sql/README.md`).
Every test fails until you write the queries.
When they all pass, tick the exercise done in Recall under Progress, Topics.
