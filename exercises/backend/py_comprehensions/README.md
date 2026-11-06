# Catalogue views

Topic: Comprehensions (Backend, Python Advanced).
Time: about 15 minutes.

## Task

Each book in the catalogue is a dict with a `"title"`, `"author"`, `"year"` and `"pages"`.
Write the seven functions in `views.py`, each body a single comprehension or generator expression, not a loop with `.append`:

- `shouted(titles)` gives every title in capitals.
- `published_after(books, year)` keeps the titles of books published after `year`.
- `size_labels(books)` gives one label per book, `"long"` for 300 pages or more and `"short"` otherwise.
- `pages_by_title(books)` builds a dict of title to pages, and `authors(books)` a set of authors.
- `shelf_slots(aisles, shelves)` pairs every aisle with every shelf, aisle by aisle.
- `total_pages(books)` adds up the pages with a generator expression, so no list is built.

## Examples

```python
shouted(["Dune", "Emma"])              # ["DUNE", "EMMA"]
published_after(books, 1900)           # ["Dune", "Ubik"]
size_labels(books)                     # ["long", "long", "short", "short"]
pages_by_title(books)                  # {"Dune": 412, "Emma": 474, ...}
authors(books)                         # {"Herbert", "Austen", "Dick"}
shelf_slots(("A", "B"), (1, 2))        # ["A1", "A2", "B1", "B2"]
total_pages(books)                     # 1337
```

Watch for the lesson's pitfall: an `if` at the end only filters, so `[... for b in books if ... else ...]` is a syntax error.
When every book needs a label, put the whole `a if cond else b` in front of the `for`.

## Run the tests

```bash
cd exercises/backend/py_comprehensions
pytest
```

Every test fails until you fill in the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
