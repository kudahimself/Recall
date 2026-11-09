# Shelf picks

Topic: SELECT, WHERE, ORDER BY, TOP (SQL for Data Engineering, Querying Foundations).
Time: about 15 minutes.

## Task

The library wants a few lists from its `dbo.Book` table for the front shelf.
Write one T-SQL query under each `-- query:` line of `shelf_picks.sql`:

- `longest_scifi`: the three longest SciFi books, longest first, as `Title, Pages`, using `TOP`.
- `genres`: every genre once, A to Z, as `Genre`.
- `second_page`: the books A to Z by title, four to a page, and only the second page: `Title`, using `OFFSET ... FETCH`.
- `recent_short`: the books published in 2000 or later with fewer than 400 pages, newest first, as `Title, Published`.

## The table

The tests create `dbo.Book` and fill it with these rows before each query runs:

| BookId | Title | Genre | Pages | Published |
| --- | --- | --- | --- | --- |
| 1 | Dune | SciFi | 412 | 1965 |
| 2 | Emma | Classic | 474 | 1815 |
| 3 | Ubik | SciFi | 202 | 1969 |
| 4 | Hyperion | SciFi | 482 | 1989 |
| 5 | Beloved | Classic | 324 | 1987 |
| 6 | Neuromancer | SciFi | 271 | 1984 |
| 7 | Rebecca | Mystery | 428 | 1938 |
| 8 | Gone Girl | Mystery | 419 | 2012 |
| 9 | Klara and the Sun | SciFi | 303 | 2021 |
| 10 | The Road | Classic | 287 | 2006 |
| 11 | Circe | Fantasy | 393 | 2018 |
| 12 | Piranesi | Fantasy | 245 | 2020 |

## Examples

```
longest_scifi   Hyperion 482, Dune 412, Klara and the Sun 303
genres          Classic, Fantasy, Mystery, SciFi
```

Watch for the lesson's pitfall: `TOP` without `ORDER BY` returns some three rows, not the three longest, so the test reads your query and wants the `ORDER BY` there.
T-SQL has no `LIMIT`: the tests stop on it and say what to write instead.

## Run the tests

```bash
cd exercises/sql/tsql_select
pytest
```

The tests read your T-SQL and run it on DuckDB (see `exercises/sql/README.md`).
Every test fails until you write the queries.
When they all pass, tick the exercise done in Recall under Progress, Topics.
