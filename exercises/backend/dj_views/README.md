# Loan desk views

Topic: Views & Request/Response (FBV) (Backend, Django).
Time: about 20 minutes.

## Task

The loan desk needs four function views, in `desk/views.py`.
The `Book` model, the URLconf (`desk/urls.py`) and the template are written for you.

- `book_detail(request, pk)` answers JSON `{"id": ..., "title": ..., "on_loan": ...}`, or a 404 page when there is no such book.
- `search(request)` reads `q` from the query string, stripped of spaces and `""` when it is missing, and answers JSON `{"q": q, "titles": [...]}` with the titles that contain it in any case, in title order.
- `return_book(request, pk)` shows `desk/return.html` with the book as `book` on a GET.
  On a POST it marks the book returned (`on_loan = False`), saves it and redirects to the `book-detail` route.
- `add_note(request, pk)` reads the posted `note` field, saves it on the book and answers `"saved <note>"` with status 201.
  A missing or blank note answers `"note is required"` with status 400 and saves nothing.

## Examples

```text
GET  /books/1/              200  {"id": 1, "title": "Dune", "on_loan": true}
GET  /books/999/            404
GET  /books/?q=dune         200  {"q": "dune", "titles": ["Dune", "Dune Messiah"]}
GET  /books/1/return/       200  the page "Return Dune?"
POST /books/1/return/       302  Location: /books/1/
POST /books/1/note/  note=signed copy   201  saved signed copy
```

Watch for the lesson's pitfall: `Book.objects.get(pk=pk)` on a missing row raises `DoesNotExist`, and the visitor gets a 500 server error.
Use `get_object_or_404(Book, pk=pk)`, which turns the miss into a 404 page.

## Run the tests

```bash
cd exercises/backend/dj_views
pytest
```

`conftest.py` sets Django up for you, on a database that lives in memory for the test run; leave it as it is.
The tests send requests through Django's test client, so no server runs.
Every test fails until you write the views.
When they all pass, tick the exercise done in Recall under Progress, Topics.
