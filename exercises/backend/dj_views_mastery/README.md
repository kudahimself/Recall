# Shelf views

Topic: Views Mastery (deep revisit) (Backend, Django Advanced & Deployment).
Time: about 25 minutes.

## Task

Write four views in `shelving/views.py`.
The `Shelf` and `Book` models and the URLconf (`shelving/urls.py`) are written for you.

- `ShelfView`, a `View` for one shelf at `/shelves/<code>/`, answering GET and POST only through `http_method_names`.
  - Override `dispatch()` so that, for every verb, it finds the shelf by its code (a 404 when there is none) and keeps it on `self`, then adds an `X-Shelf` header with the code to whatever response comes back, the 405 included.
  - `get()` answers the shelf's titles in title order as a JSON list.
  - `post()` lets only staff add a book: anyone else gets a 403, by raising `PermissionDenied`.
    It adds a book with the posted `title`, then redirects to the shelf's own page.
- `NewArrivalsView` answers the three newest titles, newest first, as a JSON list.
  Every visitor sees the same list, so cache the whole view for 60 seconds by putting `cache_page(60)` on its `dispatch` with `method_decorator`.
- `MyHoldsView` answers `{"reader": ..., "titles": [...]}` with the books held for the signed-in reader, in title order.
  Put `login_required` on it the same way, so a visitor goes to the login page.
- `export_shelf(request, code)` streams the shelf's books as CSV with `StreamingHttpResponse`: a `title,added` header row, then one row per book in title order with the date it was added (`2026-03-09`), downloaded as `<code>.csv`.
  Look the shelf up first (a 404 when there is none), but read the books inside the generator, so no book query runs until the rows are read.

## Examples

```text
GET    /shelves/sf/                 200  ["Dune", "Kindred", "Solaris", "Ubik"]   X-Shelf: sf
DELETE /shelves/sf/                 405  Allow: GET, POST                         X-Shelf: sf
GET    /shelves/nope/               404
POST   /shelves/sf/  title=Emma     403  (not staff)
POST   /shelves/sf/  title=Emma     302  Location: /shelves/sf/                   (staff)
GET    /new/                        200  ["Solaris", "Kindred", "Dune"]           Cache-Control: max-age=60
GET    /my-holds/                   302  Location: /login/?next=/my-holds/
GET    /shelves/sf/export/          200  title,added / Dune,2026-03-02 / ...
```

For the CSV, `csv.writer` needs something to write to: give it an object whose `write(value)` returns `value`, and yield what each `writer.writerow(...)` returns.

Watch for the lesson's pitfall: `cache_page` keys the cached page on the URL, not on the user.
On a personal page such as `/my-holds/`, the first reader's page would be served to everyone until it expires, so cache only pages every visitor shares.

## Run the tests

```bash
cd exercises/backend/dj_views_mastery
pytest
```

`conftest.py` sets Django up for you, on a database that lives in memory for the test run; leave it as it is.
The cache is Django's in-memory default, emptied before each test.
Every test fails until you write the views.
When they all pass, tick the exercise done in Recall under Progress, Topics.
