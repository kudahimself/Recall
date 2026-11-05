# Shelf fixtures

Topic: Pytest Fixtures (Backend, Python Advanced).
Time: about 20 minutes.

## Task

The tests in `test_shelf.py` are written already, and they ask for fixtures that do not exist yet.
Write those fixtures in `conftest.py`, using the helpers in `store.py`; change neither of those two files.

- `shelf` gives every test a fresh shelf from `store.open_shelf()`, and closes it with `store.close_shelf(...)` once the test is over: use `yield`.
- `member` returns a new member, `{"id": "m1", "loans": []}`.
- `borrower` requests `member` and `shelf`, moves the shelf's first book into the member's loans and returns the member.
- `catalogue_file` builds on the built-in `tmp_path` fixture: it writes `catalogue.txt` holding the lines `Dune`, `Emma` and `Ubik`, and returns its path.
- `catalogue` returns `store.load_catalogue()`, which is slow, so it must run only once for the whole test file: give it `scope="module"`.

## Examples

```python
def test_borrower_takes_the_first_book_from_the_same_shelf(borrower, shelf):
    assert borrower["loans"] == ["Dune"]   # borrower and the test share one shelf
    assert shelf == ["Emma"]
```

A test asks for a fixture by naming it as a parameter, and a fixture can ask for other fixtures the same way.

Watch for the lesson's pitfall: a fixture with a wider scope is shared, so a test that changes it changes it for the next test too.
Keep `shelf`, which the tests change, in the default function scope, and never call a fixture like a function.

## Run the tests

```bash
cd exercises/backend/py_fixtures
pytest
```

Every test errors with "fixture not found" until you write the fixtures.
When they all pass, tick the exercise done in Recall under Progress, Topics.
