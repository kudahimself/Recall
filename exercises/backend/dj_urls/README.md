# Lending routes

Topic: URLs & Routing (Backend, Django).
Time: about 20 minutes.

## Task

The borrowing app's views are written in `borrowing/views.py`; nothing reaches them yet.
Write the two URLconfs.

In `borrowing/urls.py`, namespace the names as `lending` and route, in this order:

| Path | View | Name | The view gets |
| --- | --- | --- | --- |
| `""` | `index` | `index` | nothing |
| `"<pk>/"` | `book` | `book` | `pk` as an `int` |
| `"<genre>/"` | `shelf` | `shelf` | `genre`, a slug such as `sci-fi` |
| `"members/<card>/"` | `member` | `member` | `card` as a `uuid.UUID` |
| `"archive/<year>/"` | `archive` | `archive` | `year`, exactly four digits, as a string |

No converter matches exactly four digits, so the archive route needs `re_path`.

In `librarysite/urls.py`, the project's root URLconf, mount the app's URLconf, `borrowing.urls`, under `lending/`.

## Examples

```python
reverse("lending:book", args=[7])                  # "/lending/7/"
reverse("lending:shelf", kwargs={"genre": "sci-fi"})  # "/lending/sci-fi/"
resolve("/lending/42/").kwargs                     # {"pk": 42}
resolve("/lending/sci-fi/").func                   # views.shelf
resolve("/lending/archive/1999/").kwargs           # {"year": "1999"}
resolve("/lending/archive/99/")                    # Resolver404
```

The order matters: `42` matches the `int` route first, and `sci-fi`, which is not digits, falls through to the slug route.

Watch for the lesson's pitfall: `path("lending/", "borrowing.urls")` is an error, because a route needs a view or an `include()`.
Import `include` from `django.urls` next to `path`.

## Run the tests

```bash
cd exercises/backend/dj_urls
pytest
```

`conftest.py` sets Django up for you; leave it as it is.
Every test fails until you write the routes.
When they all pass, tick the exercise done in Recall under Progress, Topics.
