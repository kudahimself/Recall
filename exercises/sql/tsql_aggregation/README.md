# Loans by genre

Topic: Aggregation & GROUP BY (SQL for Data Engineering, Querying Foundations).
Time: about 20 minutes.

## Task

The library wants its loans summed up by genre and by member.
Write one T-SQL query under each `-- query:` line of `genre_totals.sql`:

- `per_genre`: one row per genre, as `Genre, Loans, Titles, TotalDays`: how many loans, how many different titles, and the days they add up to.
- `totals`: one row for the whole table, as `Loans, Members, LongestLoan, ShortestLoan`, with `Members` counting each member once.
- `busy_members`: the members with 3 or more loans, as `MemberId, Loans`.
- `long_loan_genres`: counting only the loans of 10 days or more, the genres whose loans add up to 20 days or more, as `Genre, TotalDays`.

Row order does not matter for any of them.

## The table

The tests create `dbo.Loan` and fill it with these rows:

| LoanId | MemberId | Title | Genre | Days |
| --- | --- | --- | --- | --- |
| 1 | 1 | Dune | SciFi | 14 |
| 2 | 2 | Ubik | SciFi | 7 |
| 3 | 1 | Emma | Classic | 21 |
| 4 | 3 | Hyperion | SciFi | 10 |
| 5 | 2 | Beloved | Classic | 3 |
| 6 | 3 | Dune | SciFi | 5 |
| 7 | 1 | Rebecca | Mystery | 9 |
| 8 | 4 | Rebecca | Mystery | 12 |
| 9 | 1 | Dune | SciFi | 30 |
| 10 | 2 | Circe | Fantasy | 18 |

## Examples

```
per_genre          (SciFi, 5, 3, 66), (Classic, 2, 2, 24), (Mystery, 2, 1, 21), (Fantasy, 1, 1, 18)
totals             (10, 4, 30, 3)
long_loan_genres   (SciFi, 54), (Classic, 21)
```

Watch for the lesson's pitfall: `WHERE` runs before the groups exist, so it cannot test `SUM(Days)`.
Rows go in `WHERE` (loans of 10 days or more) and groups in `HAVING` (totals of 20 or more); with the day filter in the wrong place Mystery comes back with 21 days.

## Run the tests

```bash
cd exercises/sql/tsql_aggregation
pytest
```

The tests read your T-SQL and run it on DuckDB (see `exercises/sql/README.md`).
Every test fails until you write the queries.
When they all pass, tick the exercise done in Recall under Progress, Topics.
