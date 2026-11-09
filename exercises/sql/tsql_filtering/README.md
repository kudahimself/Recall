# Members to chase

Topic: Filtering, NULLs & CASE (SQL for Data Engineering, Querying Foundations).
Time: about 20 minutes.

## Task

The library is sorting out its members' fines, and some members never gave a city.
Write one T-SQL query under each `-- query:` line of `member_filters.sql`:

- `outside_oslo`: the members who do not live in Oslo, the ones with no city included: `MemberName`.
- `no_city`: the members with no city: `MemberName`.
- `owing_in_two_cities`: the members in Bergen or Leeds whose fines are from 5 to 20, both ends included: `MemberName, Fines`, using `IN` and `BETWEEN`.
- `a_names`: the members whose name starts with A: `MemberName`, using `LIKE`.
- `standing`: every member as `MemberName, Town, Standing`, where `Town` is the city or `'unknown'` when there is none, and `Standing` is `'blocked'` for fines of 30 or more, `'owes'` for any other fine above 0, and `'clear'` otherwise.

Row order does not matter for any of them.

## The table

The tests create `dbo.Member` and fill it with these rows:

| MemberId | MemberName | City | Fines |
| --- | --- | --- | --- |
| 1 | Ana | Oslo | 0 |
| 2 | Ben | NULL | 12 |
| 3 | Cleo | Bergen | 30 |
| 4 | Dev | NULL | 0 |
| 5 | Amir | Leeds | 8 |
| 6 | Bea | Bergen | 20 |
| 7 | Alex | York | 45 |
| 8 | Cy | Oslo | 5 |

## Examples

```
outside_oslo          Ben, Cleo, Dev, Amir, Bea, Alex
owing_in_two_cities   Amir 8, Bea 20
standing              ... ('Ben', 'unknown', 'owes'), ('Cleo', 'Bergen', 'blocked') ...
```

Watch for the lesson's pitfall: `City <> 'Oslo'` is unknown, not true, for a member whose City is NULL, so `WHERE` drops Ben and Dev.
Never write `= NULL`: test for a missing value with `IS NULL`.

## Run the tests

```bash
cd exercises/sql/tsql_filtering
pytest
```

The tests read your T-SQL and run it on DuckDB (see `exercises/sql/README.md`).
Every test fails until you write the queries.
When they all pass, tick the exercise done in Recall under Progress, Topics.
