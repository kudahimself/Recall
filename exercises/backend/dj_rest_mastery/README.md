# Loan API

Topic: DRF Mastery (deep revisit) (Backend, Django Advanced & Deployment).
Time: about 30 minutes.

## Task

Serve the books through one `ModelViewSet`, with nested authors, one error shape and a rate limit.
The `Author`, `Tag` and `Book` models and the router (`loan_api/urls.py`) are written for you.

In `loan_api/serializers.py`:

- `AuthorSerializer` gives an author as `{"id", "name"}`.
- `BookSerializer` gives a book as `{"id", "title", "copies", "author", "tags"}`.
  `author` is a nested `AuthorSerializer`, read-only; a client writes the author as `author_id`, a write-only `PrimaryKeyRelatedField` whose `source` is `author`; `tags` are read and written as a list of names (`SlugRelatedField`) and may be left out.

In `loan_api/errors.py`:

- `NoCopyFree`, an `APIException` with status 409 and the detail `"No copy is free."`.
- `api_exception_handler(exc, context)` calls DRF's own `exception_handler` and, when it returns a response, wraps its data as `{"error": {"status": <code>, "detail": <DRF's data>}}`.
  When DRF's handler returns `None`, so does yours.

In `loan_api/views.py`, `BookViewSet`:

- `serializer_class`, and a `get_queryset()` of the books in title order that loads authors and tags up front, so a list of any length takes two queries.
- Anyone may read, only a signed-in user may write.
- `ScopedRateThrottle` with the scope `"books"`; the rate itself lives in the `DEFAULT_THROTTLE_RATES` setting.
- A `lend` action, POST on one book (`@action(detail=True, ...)`), that takes one copy and answers the book, or raises `NoCopyFree` when none is left.

## Examples

```text
GET    /books/                       200  [{"id": 3, "title": "Children of Dune", "copies": 1, "author": {"id": 1, "name": "Frank Herbert"}, "tags": []}, ...]
POST   /books/  {"title": "Valis", "copies": 1, "author_id": 2, "tags": ["sci-fi"]}   201
POST   /books/  (not signed in)      403  {"error": {"status": 403, "detail": {"detail": "Authentication credentials were not provided."}}}
PUT    /books/1/  {"copies": 5}      400  {"error": {"status": 400, "detail": {"title": [...], "author_id": [...]}}}
PATCH  /books/1/  {"copies": 5}      200  only copies changes
DELETE /books/1/                     204
POST   /books/1/lend/                200  copies one lower, then 409 {"error": {"status": 409, "detail": {"detail": "No copy is free."}}}
GET    /books/  (4th in a minute at 3/min)   429
```

Watch for the lesson's pitfall: an update that builds the serializer from `data=` alone, without the book, makes `save()` call `create()`, so every edit adds a row.
A `ModelViewSet` passes the instance for you in `update()` and `partial_update()`; PUT then validates a whole new book, and PATCH only the fields sent.
And a nested serializer reads its relation once per row, so without `select_related` and `prefetch_related` a list of 100 books runs 200 extra queries.

## Run the tests

```bash
cd exercises/backend/dj_rest_mastery
pytest
```

`conftest.py` sets Django up for you, on a database that lives in memory for the test run; leave it as it is.
The tests switch on your handler with `REST_FRAMEWORK = {"EXCEPTION_HANDLER": "loan_api.errors.api_exception_handler"}` and set the `"books"` rate themselves.
Throttling counts requests in Django's in-memory cache, emptied before each test.
Every test fails until you write the serializers, the handler and the viewset.
When they all pass, tick the exercise done in Recall under Progress, Topics.
