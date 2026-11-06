# Stacks views

Topic: Class-Based & Generic Views (Backend, Django).
Time: about 20 minutes.

## Task

Write four class-based views in `stacks/views.py`.
The `Book` model, the URLconf (`stacks/urls.py`, which calls `as_view()` on each) and the templates are written for you.

- `ShelfList` is a `ListView` of `Book`, two per page, with its default template, `stacks/book_list.html`, which calls the rows `books`.
  Override `get_queryset()` to keep the books not on loan, in title order, and `get_context_data()` to add `on_loan_count`, how many books are out.
- `BookDetail` is a `DetailView` of `Book` shown with `stacks/book_page.html`.
- `RenewView` is a plain `View` that answers only POST: it adds one to the book's `renewals` and answers JSON `{"title": ..., "renewals": ...}`, or a 404 for a missing book.
  Any other method gets 405 without you writing anything for it.
- `LoanedList` lists the books out on loan, in title order, with `stacks/loaned.html`, and sends anyone who is not signed in to the login page, `/login/?next=/loaned/`.

## Examples

```text
GET  /shelf/              200  Emma, Kindred      (page 1 of 2, "2 out on loan")
GET  /shelf/?page=2       200  Ubik
GET  /books/2/            200  stacks/book_page.html
POST /books/2/renew/      200  {"title": "Dune", "renewals": 1}
GET  /books/2/renew/      405
GET  /loaned/             302  /login/?next=/loaned/   (signed in: Beloved, Dune)
```

Watch for the lesson's pitfall: a `get_context_data()` that builds a new dict instead of starting from `super().get_context_data(**kwargs)` throws away the rows and pagination the generic view built.
And a mixin such as `LoginRequiredMixin` goes to the left of the base view, or its check never runs.

## Run the tests

```bash
cd exercises/backend/dj_cbv
pytest
```

`conftest.py` sets Django up for you, on a database that lives in memory for the test run; leave it as it is.
Every test fails until you write the views.
When they all pass, tick the exercise done in Recall under Progress, Topics.
