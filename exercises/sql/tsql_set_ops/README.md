# Shelf and wishlist

Topic: Set Operations (SQL for Data Engineering, Querying Foundations).
Time: about 15 minutes.

## Task

The library keeps three lists of titles: the copies on its shelves, its members' wishes and the books people donated.
Write one T-SQL query under each `-- query:` line of `shelf_lists.sql`, each one two or more queries joined by a set operator:

- `copies_and_wishes`: the title of every shelf copy and of every wish, duplicates kept, as `Title`.
- `all_titles`: every title on any of the three lists once, A to Z, as `Title`.
- `held_and_wanted`: the titles on a shelf that are also on the wishlist, as `Title`.
- `nobody_wants`: the titles on a shelf that nobody wishes for, as `Title`.
- `where_from`: every shelf copy and every donation, duplicates kept, as `Title, Source`, where `Source` is `'shelf'` or `'donation'`.

Only `all_titles` asks for an order.

## The tables

The tests create these tables and fill them with these rows:

```
dbo.Shelf     (Title, Branch)       Dune North, Emma North, Ubik South, Dune South, Circe South
dbo.Wishlist  (Title, MemberName)   Ubik Ana, Hyperion Ben, Circe Ana, Hyperion Cleo
dbo.Donation  (Donor, Title)        Dev Piranesi, Eve Dune
```

## Examples

```
all_titles     Circe, Dune, Emma, Hyperion, Piranesi, Ubik
nobody_wants   Dune, Emma
where_from     (Dune, shelf) twice, (Emma, shelf), (Ubik, shelf), (Circe, shelf), (Piranesi, donation), (Dune, donation)
```

Watch for the lesson's pitfall: set operators match columns by position, not by name.
`dbo.Donation` has its `Donor` first, so `SELECT * FROM dbo.Donation` would put donors under `Title` without any error; name the column you mean.
One `ORDER BY` at the very end sorts the whole result.

## Run the tests

```bash
cd exercises/sql/tsql_set_ops
pytest
```

The tests read your T-SQL and run it on DuckDB (see `exercises/sql/README.md`).
Every test fails until you write the queries.
When they all pass, tick the exercise done in Recall under Progress, Topics.
