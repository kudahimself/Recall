# Branch reports

Topic: ORM Mastery (deep revisit) (Backend, Django Advanced & Deployment).
Time: about 25 minutes.

## Task

The `Branch`, `Author`, `Tag` and `Book` models are written in `branchstats/models.py`.
Write six reports in `branchstats/reports.py`, where the number of queries each runs counts as much as its result:

- `shelf_labels()`: a `"<title> - <author> @ <branch>"` label for every book, in title order, in one query however many books there are.
- `tag_index()`: `{title: [tag names, alphabetical]}` for every book, in two queries: the books, then every book's tags.
- `author_titles(authors)`: `{author name: [titles in title order]}` for a QuerySet of authors, following the reverse relation `author.books`, in two queries.
  Hand `prefetch_related` a `Prefetch("books", queryset=...)` that is already ordered.
- `catalogue_page()`: a QuerySet of every book in title order that loads only the id and the title, so the long `summary` column never leaves the database.
- `branch_ranking()`: `(branch, title, rank)` for every book, ranked within its branch by loans, most first, with a `Window` annotation.
  Books with equal loans share a rank and the next rank skips, so use `Rank()`, not `RowNumber()`.
- `lend_copy(book_id)`: lend one copy, returning `True`, or `False` when no copy is free.
  Lock the book's row with `select_for_update()` inside `transaction.atomic()`, so two librarians lending the last copy at once cannot both succeed.

## Examples

With the tests' library: Central holds Dune (9 loans), Persuasion (9) and Emma (4), East holds Mansfield Park (5) and Children of Dune (2):

```python
shelf_labels()[0]     # "Children of Dune - Frank Herbert @ East"
tag_index()["Dune"]   # ["classic", "desert", "sci-fi"]
author_titles(Author.objects.order_by("name"))
# {"Ann Leckie": [], "Frank Herbert": ["Children of Dune", "Dune"], "Jane Austen": [...]}
branch_ranking()[:3]  # [("Central", "Dune", 1), ("Central", "Persuasion", 1), ("Central", "Emma", 3)]
lend_copy(dune.pk)    # True, then False once the last copy is out
```

Watch for the lesson's pitfall: reading `book.author.name` in a loop over a plain QuerySet runs one more query per book, 1 + N in all.
Load the relation up front with `select_related` for a foreign key or `prefetch_related` for the many side.
And once a relation is prefetched, read it with `.all()`: `book.tags.order_by("name")` asks the database again for every book.

## Run the tests

```bash
cd exercises/backend/dj_orm_mastery
pytest
```

`conftest.py` sets Django up for you, on a database that lives in memory for the test run; leave it as it is.
Most tests count the queries your code runs, so an N+1 loop or an extra query fails them even when the result is right.
SQLite has no row locks, so the lock test makes Django treat it like PostgreSQL: a `select_for_update()` outside a transaction raises `TransactionManagementError`, as it would there.
Every test fails until you write the reports.
When they all pass, tick the exercise done in Recall under Progress, Topics.
