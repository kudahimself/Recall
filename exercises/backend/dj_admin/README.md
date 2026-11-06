# Stock admin

Topic: Admin Customization (Backend, Django Advanced & Deployment).
Time: about 25 minutes.

## Task

Give the library staff a useful admin for books and their reviews.
The `Book` and `Review` models are written for you; write `ReviewInline` and `BookAdmin` in `backoffice/admin.py`.

`BookAdmin`, registered for `Book` with `@admin.register(Book, site=staff_site)`:

- The changelist (the list page) shows the columns `title`, `author`, `stock`, `in_stock` and `review_count`, sorted by title, with a sidebar filter by author and a search box over title and author.
- `in_stock(obj)`, a computed column drawn as a tick or a cross (`@admin.display(boolean=True, ...)`) headed `"In stock"`: stock above 0.
- `review_count(obj)`, headed `"Reviews"` and sortable by that count: how many reviews the book has, read from a `Count("reviews")` annotation that `get_queryset()` adds, never a query per row.
- The edit page groups `title` and `author` first, with no heading, then `stock` and `created` under `"Stock"`, with `created` shown as read-only text.
- The reviews are edited on the book's page through `ReviewInline`, a `TabularInline` showing `stars` and `text` with one blank row for a new review.
- One action, `sell_out`, labelled `"Mark selected as sold out"`, that sets every ticked book's stock to 0 in one `UPDATE`.

`staff_site` is an `AdminSite` already made at the top of `admin.py`.
The exercise settings leave Django's admin app out, and the default `admin.site` with it, so the tests use this site instead.
In a project with `django.contrib.admin` installed, you would write `@admin.register(Book)` and reach the pages at `/admin/`.

## Examples

```python
model_admin = staff_site.get_model_admin(Book)
model_admin.check()                                     # [], the same checks runserver makes
changelist = model_admin.get_changelist_instance(request)   # request: ?q=austen
[b.title for b in changelist.result_list]               # ["Emma", "Persuasion"]
model_admin.in_stock(dune), model_admin.review_count(dune)  # (True, 2)
```

Watch for the lesson's pitfall: a `list_display` method such as `obj.reviews.count()` runs one query for every row of every changelist page.
Override `get_queryset()` to annotate the count once, and have the method return the annotation.
And a 1-tuple needs its comma: `list_filter = ("author")` is a string, which `check()` reports.

## Run the tests

```bash
cd exercises/backend/dj_admin
pytest
```

`conftest.py` sets Django up for you, on a database that lives in memory for the test run; leave it as it is.
The tests drive your `ModelAdmin` the way the admin's pages do, with requests from a superuser, and count the queries `review_count` runs.
Every test fails until you write the admin.
When they all pass, tick the exercise done in Recall under Progress, Topics.
