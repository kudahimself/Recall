# Copies in and out

Topic: Basic DML (INSERT, UPDATE, DELETE) (SQL for Data Engineering, Querying Foundations).
Time: about 15 minutes.

## Task

The library's copies change every day: new ones arrive, they go out on loan, worn ones are marked down and some are thrown away.
Write the T-SQL for each `-- step:` line of `copy_changes.sql`:

- `add_copies`: add copy 6, `Circe`, 0 loans, price 11.00, leaving `Condition` out so it gets its default, and copy 7, `Piranesi`, 2 loans, `'worn'`, price 10.00.
- `lend`: Dune and Beloved each went out once more, so add 1 to their `Loans`.
- `reprice_worn`: worn copies sell for 20% less, so multiply their `Price` by 0.8.
- `retire`: remove the worn copies that have never been lent.

Each test starts again from the rows below, runs one step and checks the whole table, so a change to a row it should leave alone fails it too.

## The table

The tests create `dbo.BookCopy`, where `Condition` defaults to `'good'`, and fill it with these rows:

| CopyId | Title | Loans | Condition | Price |
| --- | --- | --- | --- | --- |
| 1 | Dune | 3 | good | 9.50 |
| 2 | Emma | 0 | worn | 7.00 |
| 3 | Ubik | 5 | good | 8.00 |
| 4 | Hyperion | 0 | good | 12.00 |
| 5 | Beloved | 1 | worn | 6.50 |

## Examples

```
after lend           (1, Dune, 4, good, 9.50) ... (5, Beloved, 2, worn, 6.50)
after reprice_worn   (2, Emma, 0, worn, 5.60) ... (5, Beloved, 1, worn, 5.20)
after retire         every copy but Emma
```

`add_copies` takes two `INSERT`s: one leaves `Condition` out of its column list and one gives it.
Watch for the lesson's pitfall: an `UPDATE` or `DELETE` without a `WHERE` changes every row.
Run the same `WHERE` in a `SELECT` first to see which rows it picks.

## Run the tests

```bash
cd exercises/sql/tsql_dml
pytest
```

The tests read your T-SQL and run it on DuckDB (see `exercises/sql/README.md`).
Every test fails until you write the steps.
When they all pass, tick the exercise done in Recall under Progress, Topics.
