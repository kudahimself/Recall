# Book API

Topic: Django REST Framework (Backend, Django).
Time: about 25 minutes.

## Task

Serve the library's books as a JSON API with Django REST Framework.
The `Book` model and the URLconf (`book_api/urls.py`) are written for you.

In `book_api/serializers.py`, make `BookSerializer` a `ModelSerializer` of `Book` with the fields `id`, `title`, `pages` and `on_loan`, in that order.

In `book_api/views.py`:

- `book_list` is a function view for `GET` and `POST` only, so any other method gets 405.
  GET answers every book in title order; POST validates the incoming book and answers its errors with 400, or saves it and answers it with 201.
- `BookDetail` is an `APIView` for one book.
  `get()` answers the book, or 404; `put()` replaces its fields from the request and answers 400 with the errors or 200 with the saved book; `delete()` deletes it and answers 204.
  Anyone may read a book, but only a signed-in user may change or delete one: set `permission_classes` to the class that allows exactly that.

## Examples

```text
GET    /books/                                  200  [{"id": 1, "title": "Dune", "pages": 412, "on_loan": true}, ...]
POST   /books/  {"title": "Ubik", "pages": 202}  201  {"id": 3, "title": "Ubik", "pages": 202, "on_loan": false}
POST   /books/  {"pages": 202}                   400  {"title": ["This field is required."]}
PUT    /books/                                  405
GET    /books/1/                                200  {"id": 1, "title": "Dune", ...}
PUT    /books/1/  (not signed in)               403
DELETE /books/1/  (signed in)                   204
```

Watch for the lesson's pitfall: `BookSerializer(request.data)` passes the input as an object to serialize, and `is_valid()` then refuses to run.
Incoming data always goes in as `data=request.data`; to update a book, pass the book first: `BookSerializer(book, data=request.data)`.

## Run the tests

```bash
cd exercises/backend/dj_rest
pytest
```

`conftest.py` sets Django up for you, on a database that lives in memory for the test run; leave it as it is.
The tests call the API through DRF's `APIClient`, so no server runs.
Every test fails until you write the serializer and the views.
When they all pass, tick the exercise done in Recall under Progress, Topics.
