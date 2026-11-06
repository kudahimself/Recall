# Edition details

Topic: PostgreSQL Features (Backend, Production Infrastructure).
Time: about 20 minutes.

## Task

The bookshop keeps the details that differ from one edition to the next, such as its language, its shelf and its awards, in a `JSONField`.
On PostgreSQL that column is `jsonb`.
Fix the model, then write the queries the shop runs against those details.

In `editions/models.py`, `Edition` needs three changes:

- `kind` (`"hardback"`, `"paperback"` or `"ebook"`) is filtered on in the busiest query, so it gets a column of its own, a `CharField` of up to 20 characters, rather than a key in `details`.
- `details` must start as a new empty dict for every edition.
- `Meta.indexes` holds a composite index named `edition_kind_newest_idx` for that busiest query: the editions of one kind, newest `created` first.

In `editions/queries.py`, each function returns a `QuerySet`, so the database does the work:

- `in_language(lang)`: editions whose `details["lang"]` is `lang`.
- `shelved_on_or_above(floor)`: editions whose `details["shelf"]["floor"]` is `floor` or higher.
- `with_awards_listed()`: editions whose details have an `"awards"` key, even when the list is empty.
- `by_language()`: every edition, with its language pulled out as text into `.lang`, ordered by language and then title.
- `newest_of_kind(kind)`: the editions of one kind, newest first.

## Examples

```python
# River Songs: hardback, {"lang": "en", "shelf": {"floor": 2}, "awards": ["Costa"]}
# Night Trains: paperback, {"lang": "fr", "shelf": {"floor": 1}, "awards": []}
# Rain Tales:  paperback, {"lang": "en", "shelf": {"floor": 1}}, the newest paperback
in_language("en")              # Rain Tales, River Songs
shelved_on_or_above(2)         # River Songs
with_awards_listed()           # Night Trains, River Songs
[(e.lang, e.title) for e in by_language()]
# [("en", "Rain Tales"), ("en", "River Songs"), ("fr", "Night Trains")]
newest_of_kind("paperback")    # Rain Tales, then Night Trains
```

Watch for the lesson's pitfall: `jsonb` is for attributes that differ from row to row and are read with the row.
A value you filter, join or total on belongs in its own column, where a plain index serves it and nothing lets a row miss it or misspell it.
That is why `kind` moves out of `details`.

## Run the tests

```bash
cd exercises/backend/dj_postgres
pytest
```

`conftest.py` sets Django up for you, on an SQLite database that lives in memory for the test run; leave it as it is.
Django runs these JSON lookups and `KeyTextTransform` on SQLite as well as on PostgreSQL, so no database server is needed.
The index test reads the query plan from `QuerySet.explain()`, Django's `EXPLAIN`, and checks that it names your index.
Two things from the lesson need a real PostgreSQL server and the psycopg driver, so they are not in this exercise: the `contains` lookup on a JSON list (`details__awards__contains=["Costa"]`), and full-text search with `SearchVector`, `SearchQuery` and `SearchRank`, which you would speed up with a `GinIndex`.
When they all pass, tick the exercise done in Recall under Progress, Topics.
