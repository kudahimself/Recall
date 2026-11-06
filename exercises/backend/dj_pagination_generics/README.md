# Catalogue pages

Topic: Pagination & Generic Views (Backend, DRF Production Patterns).
Time: about 25 minutes.

## Task

Serve the catalogue and each reader's loans through DRF's generic views, a page at a time.
The `Book` and `Loan` models, the serializers and the routes (`catalogue_pages/urls.py`) are written for you.

In `catalogue_pages/pagination.py`:

- `ShelfPages`, a `PageNumberPagination`: 2 books per page, picked with `?page=N`, and a client may ask for another size with `?size=N`, capped at 3.
  Override `get_paginated_response(self, data)` so a page answers `{"count", "page", "pages", "next", "previous", "results"}`, in that order, where `page` is this page's number and `pages` how many there are.
  Read both from `self.page`, the Django `Page` the request was cut to, and keep DRF's links from `self.get_next_link()` and `self.get_previous_link()`.
- `NewestLoansFirst`, a `CursorPagination`: 2 loans per page, ordered by `lent_on`, newest first.

In `catalogue_pages/views.py`, each view starts as a bare `GenericAPIView`; swap it for the generic view that answers the right methods:

- `BookList` at `/books/`: GET lists the books with `ShelfPages`, POST adds one.
  Its `get_queryset()` gives the books in title order, and only those with `stock` above 0 when the query string has `?in_stock=yes`.
- `BookDetail` at `/books/<pk>/`: GET, PUT, PATCH and DELETE on one book, from every book.
- `MyLoans` at `/loans/mine/`: GET lists the signed-in reader's own loans with `NewestLoansFirst`.
  Only a signed-in user may ask.

## Examples

```text
GET    /books/                      200  {"count": 5, "page": 1, "pages": 3, "next": "http://testserver/books/?page=2", "previous": null, "results": [Dune, Emma]}
GET    /books/?page=3               200  {"page": 3, "results": [Persuasion], "next": null, ...}
GET    /books/?size=10              200  3 books a page, so "pages": 2
GET    /books/?in_stock=yes&size=3  200  {"count": 3, "results": [Emma, Ivanhoe, Persuasion], ...}
POST   /books/  {"title": "Valis", "stock": 2}   201
PATCH  /books/4/  {"stock": 7}      200
DELETE /books/4/                    204
GET    /loans/mine/  (as ann)       200  {"next": "http://testserver/loans/mine/?cursor=...", "previous": null, "results": [Emma, Ivanhoe]}
GET    /loans/mine/  (signed out)   403
```

Watch for the lesson's pitfall: a filter that depends on the caller cannot live in the `queryset` attribute, because the class body runs once at import, when there is no request.
Put it in `get_queryset()`, which DRF calls for each request with `self.request` set, and give the rows an `order_by()` so the pages do not shift between calls.
A cursor page has no `count` and cannot jump to page N; it follows its `next` link instead, which keeps it fast deep into a big table.

## Run the tests

```bash
cd exercises/backend/dj_pagination_generics
pytest
```

`conftest.py` sets Django up for you, on a database that lives in memory for the test run; leave it as it is.
DRF's `APIClient` sends the requests, and `force_authenticate` signs a reader in.
Every test fails until you write the pagination classes and the views.
When they all pass, tick the exercise done in Recall under Progress, Topics.
