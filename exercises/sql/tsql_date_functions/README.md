# Due dates

Topic: Date & Time Functions (SQL for Data Engineering, Querying Foundations).
Time: about 20 minutes.

## Task

A loan is due back 21 days after it goes out, and a loan with no `ReturnDate` is still out.
Write one T-SQL query under each `-- query:` line of `loan_dates.sql`:

- `days_out`: the loans that came back, as `LoanId, DaysOut`, the days between going out and coming back.
- `due_dates`: every loan as `LoanId, DueDate, MonthEnd`, its due date and the last day of the month it went out in.
- `late_returns`: the loans that came back after their due date, as `LoanId, DaysLate`.
- `loan_parts`: every loan as `LoanId, LoanYear, LoanMonth, LoanQuarter`, each one a number.
- `out_on_march_15`: the loans out on 15 March 2026 (lent on or before it, not back by it), as `LoanId, DaysOut` on that day.

Row order does not matter for any of them.

## The table

The tests create `dbo.Loan` and fill it with these rows:

| LoanId | LoanDate | ReturnDate |
| --- | --- | --- |
| 1 | 2026-01-30 | 2026-02-02 |
| 2 | 2026-02-10 | 2026-03-05 |
| 3 | 2026-03-31 | 2026-04-01 |
| 4 | 2026-02-20 | NULL |
| 5 | 2025-12-28 | 2026-01-25 |
| 6 | 2026-03-03 | NULL |

## Examples

```
due_dates       (2, 2026-03-03, 2026-02-28), (3, 2026-04-21, 2026-03-31) ...
late_returns    (2, 2), (5, 7)
out_on_march_15 (4, 23), (6, 12)
```

On SQL Server you would usually ask about today with `CAST(GETDATE() AS DATE)`.
The tests fix the day instead, so write `CAST('2026-03-15' AS DATE)`, and the answer does not change with the calendar.
Watch for the lesson's pitfall: `DATEDIFF` counts the boundaries it crosses, so loan 3 crosses a month boundary after one day.
Count in days when you mean a length of time.

## Run the tests

```bash
cd exercises/sql/tsql_date_functions
pytest
```

The tests read your T-SQL and run it on DuckDB (see `exercises/sql/README.md`).
Every test fails until you write the queries.
When they all pass, tick the exercise done in Recall under Progress, Topics.
