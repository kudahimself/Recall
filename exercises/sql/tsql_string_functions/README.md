# Author handles

Topic: String Functions (SQL for Data Engineering, Querying Foundations).
Time: about 20 minutes.

## Task

The author table came from a sign-up form: handles are email addresses, some authors gave no pen name, and the stock codes were typed by hand.
Write one T-SQL query under each `-- query:` line of `author_handles.sql`:

- `handle_parts`: `AuthorId, UserName, Domain`, the handle split at its `@`.
- `labels`: `AuthorId, Label`, the pen name, a space and the handle in angle brackets, as in `Bo <bo@press.org>`; an author with no pen name still gets one, ` <cyd.ng@ink.io>`.
- `clean_codes`: `AuthorId, CleanCode, CodeLength`, the code without its spaces or its dash, in capitals, and its length.
- `first_names`: `AuthorId, FirstName`, the pen name up to its first space, all of it when there is no space, and NULL when there is no pen name.

Row order does not matter for any of them.

## The table

The tests create `dbo.Author` and fill it with these rows (the codes keep their stray spaces, shown here in quotes):

| AuthorId | Handle | PenName | Code |
| --- | --- | --- | --- |
| 1 | ana.lima@ink.io | Ana Lima | `'  ab-104 '` |
| 2 | bo@press.org | Bo | `'cd-7'` |
| 3 | cyd.ng@ink.io | NULL | `' EF-0042'` |
| 4 | dee.west@quill.co.uk | Dee West | `'gh-31  '` |

## Examples

```
handle_parts   (1, 'ana.lima', 'ink.io'), (4, 'dee.west', 'quill.co.uk') ...
clean_codes    (1, 'AB104', 5), (3, 'EF0042', 6) ...
first_names    (1, 'Ana'), (2, 'Bo'), (3, None), (4, 'Dee')
```

Positions count from 1, and `CHARINDEX` gives 0 when the text is not there.
Watch for the lesson's pitfall: `PenName + ' <' + Handle + '>'` is NULL for Cyd, who has no pen name, so build the label with `CONCAT` or wrap the pen name in `COALESCE`.

## Run the tests

```bash
cd exercises/sql/tsql_string_functions
pytest
```

The tests read your T-SQL and run it on DuckDB (see `exercises/sql/README.md`).
Every test fails until you write the queries.
When they all pass, tick the exercise done in Recall under Progress, Topics.
