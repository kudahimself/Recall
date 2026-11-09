# Fines, typed

Topic: Data Types (SQL for Data Engineering, DDL & Constraints).
Time: about 20 minutes.

## Task

The library is moving its fines into a new table, and each column needs the type that fits what it holds.
Write the T-SQL for each block of `fine_types.sql`:

- `create_fine` creates `dbo.Fine` with these columns:
  - `FineId`: a whole number, and the old system has already handed out more than 2.1 billion of them.
  - `Borrower`: a name in any alphabet, such as Łukasz or Ravi, up to 50 characters.
  - `Amount`: money, exact to the cent, from 0.01 up to 9,999.99 and no more.
  - `IssuedOn`: the day the fine was issued, with no time.
  - `PaidAt`: the day and time it was paid, NULL until then.
  - `Waived`: a yes or no flag.
- `fix_price`: `dbo.PriceList` keeps `Price` as `FLOAT`; change it to an exact amount with up to 6 digits before the point and 2 after it.
- `unpaid_total`: the fines that are not paid yet and not waived, added up, as `Owed`.
- `paid_after_six`: the fines paid at 18:00 or later on any day, as `Borrower, PaidAt`.

## What the tests start from

`create_fine` starts with an empty database, and its tests insert rows into your table to see what it keeps and what it refuses.
`fix_price` starts with `dbo.PriceList (Item, Price FLOAT)` holding ten items at 0.10.
The two queries start with a `dbo.Fine` of these rows:

| FineId | Borrower | Amount | IssuedOn | PaidAt | Waived |
| --- | --- | --- | --- | --- | --- |
| 3000000001 | Łukasz | 1.25 | 2026-03-02 | NULL | 0 |
| 3000000002 | Ravi | 0.75 | 2026-03-09 | 2026-03-10 18:30 | 0 |
| 3000000003 | Ana | 2.45 | 2026-03-16 | NULL | 0 |
| 3000000004 | Ben | 4.00 | 2026-03-16 | NULL | 1 |
| 3000000005 | Cleo | 1.50 | 2026-03-20 | 2026-03-21 09:15 | 0 |

## Examples

```
unpaid_total     3.70
paid_after_six   (Ravi, 2026-03-10 18:30:00)
```

Watch for the lesson's pitfall: `FLOAT` stores binary approximations, so ten prices of 0.10 add up to 0.9999999999999999, not 1.00.
Keep money in `DECIMAL(p, s)`, where p counts every digit and s the ones after the point.
A `BIT` holds 1, 0 or NULL, and T-SQL has no `TRUE` or `FALSE`.
DuckDB, which runs the tests, keeps no length for text and has no `DATETIME2`, so the tests read your column types from your T-SQL as well as running it.

## Run the tests

```bash
cd exercises/sql/tsql_types
pytest
```

The tests read your T-SQL and run it on DuckDB (see `exercises/sql/README.md`).
Every test fails until you write the blocks.
When they all pass, tick the exercise done in Recall under Progress, Topics.
