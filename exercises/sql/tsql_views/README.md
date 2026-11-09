# Lines and views

Topic: Views & Computed Columns (SQL for Data Engineering, DDL & Constraints).
Time: about 20 minutes.

## Task

The shop's reports keep repeating the same arithmetic and the same joins.
Move the arithmetic into computed columns and the joins into views, so each report reads one name.
Write the T-SQL for each `-- step:` line of `order_views.sql`:

- `create_lines` creates `dbo.OrderLine` with `LineId` (`INT`, identifies the line), `Title` (`NVARCHAR(60)`), `Qty` (`INT`) and `Price` (`DECIMAL(6, 2)`), all required, then two computed columns:
  - `LineTotal`, `Qty` times `Price`, worked out on every read;
  - `WithTax`, `Qty` times `Price` times 1.2, stored with the row.
- `big_lines` creates the view `dbo.BigLine` (`LineId, Title, LineTotal`) of the lines worth 20 or more, and then, in the same step, queries it as `Title, LineTotal`, biggest first.
- `loan_list` creates the view `dbo.LoanList` (`MemberName, Title, LoanDate`), one row per loan, with the member's name and the book's title in place of their ids.

## What the tests start from

Each test starts from an empty database and runs only its step:

- `create_lines` starts with nothing; its tests insert lines without the computed columns and read them back.
- `big_lines` starts with a `dbo.OrderLine` whose lines are Dune 2 at 9.00, Emma 1 at 7.50, Ubik 3 at 8.00 and Circe 4 at 6.25.
- `loan_list` starts with `dbo.Member (MemberId, MemberName)`, `dbo.Book (BookId, Title)` and `dbo.Loan (LoanId, MemberId, BookId, LoanDate)` holding three loans.

After running a view's step, the tests add rows to its tables and query the view again.

## Examples

```
big_lines   (Circe, 25.00), (Ubik, 24.00)
            and after a line of Hyperion, 2 at 10.00: (Circe, 25.00), (Ubik, 24.00), (Hyperion, 20.00)
```

`CREATE VIEW` must be the only statement in its batch, so `big_lines` needs a line holding only `GO` between the view and the query; the tests refuse the step without it, as SQL Server would.
A computed column is `name AS (expression)`, and `PERSISTED` after it stores the value.
DuckDB, which runs the tests, works every computed column out on read, so the tests read the `PERSISTED` from your T-SQL.
Watch for the lesson's pitfall: a view is not a snapshot, and rows added to its tables after `CREATE VIEW` show up the next time you query it.

## Run the tests

```bash
cd exercises/sql/tsql_views
pytest
```

The tests read your T-SQL and run it on DuckDB (see `exercises/sql/README.md`).
Every test fails until you write the steps.
When they all pass, tick the exercise done in Recall under Progress, Topics.
