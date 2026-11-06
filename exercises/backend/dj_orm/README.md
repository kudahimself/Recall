# Holdings queries

Topic: ORM (QuerySets, filtering, relations) (Backend, Django).
Time: about 25 minutes.

## Task

The library's `Author` and `Book` models are written in `holdings/models.py`.
Answer eight questions about the holdings in `holdings/queries.py`, each with one query through `Book.objects` or `Author.objects`:

- `short_titles(max_pages)`: titles of the books under `max_pages` pages, the longest first.
- `count_by(author_name)`: how many books the author wrote, following the foreign key with `author__full_name` and counted by the database.
- `old_or_short(year, pages)`: books published before `year` or with fewer than `pages` pages, by title, then year.
- `search(text)`: the first book in title order whose title contains `text` in any case, or `None`.
- `oldest_titled(title)`: the earliest book with exactly that title, or `None`; several books can share a title.
- `on_shelf(n)`: at most `n` books not on loan, the newest first, returned as an unevaluated QuerySet.
- `has_loans_by(author_name)`: whether any book by that author is on loan, without loading the rows.
- `add_book(author_name, title, pages, year)`: insert a book and return it, reusing the author with that name or creating one.

## Examples

With the tests' shelf: Dune (412 pages, 1965, on loan), Emma (474, 1815), Persuasion (249, 1817, on loan), Ubik (202, 1969) and a second Emma (180, 1999):

```python
short_titles(450)            # ["Dune", "Persuasion", "Ubik", "Emma"]
count_by("Jane Austen")      # 2
search("UN")                 # <Book: Dune>
search("zz")                 # None
oldest_titled("Emma").year   # 1815
[b.title for b in on_shelf(2)]   # ["Emma", "Ubik"]: the 1999 Emma, then Ubik
```

Watch for the lesson's pitfall: `get()` is for exactly one row, and raises `DoesNotExist` or `MultipleObjectsReturned` otherwise.
Use `filter(...).first()` when you want one row or `None`.

## Run the tests

```bash
cd exercises/backend/dj_orm
pytest
```

`conftest.py` sets Django up for you, on a database that lives in memory for the test run; leave it as it is.
Some tests count the queries your code runs, so a QuerySet that runs too early, or a count done in Python, fails them.
Every test fails until you write the queries.
When they all pass, tick the exercise done in Recall under Progress, Topics.
