# Stockroom

Topic: Caching & Transactions (Backend, Django Advanced & Deployment).
Time: about 25 minutes.

## Task

The `Branch`, `Book` and `Loan` models are written in `stockroom/models.py`; a book's title is unique.
Write five functions in `stockroom/services.py`, two that cache and three that group writes into transactions.

Caching, with `django.core.cache.cache`:

- `catalogue_size()`: how many books there are, cached under `"stockroom:size"` for 5 minutes in a single `cache.get_or_set(...)` call.
  Hand it the function that counts, not the count, so the count only runs on a miss.
- `branch_stock(branch_id)`: the total copies at a branch, 0 when it has none, cached under `branch_key(branch_id)` for 60 seconds with `cache.get` and `cache.set`.
  A cached 0 is a hit too, so test the miss with `is None`.

Transactions, with `django.db.transaction`:

- `import_books(rows)` adds a batch of `(title, copies, branch name)` rows, creating each branch the first time its name appears, and returns how many it added.
  All or nothing: when a row fails, with an `IntegrityError` for a title already held, the error propagates and nothing from the batch stays, new branches included.
- `import_titles(titles, branch)` adds one copy of each title at the branch, skipping titles already held, and returns `(added, skipped)` in the order given.
  Give each insert its own inner `atomic()`, a savepoint, and catch the `IntegrityError` outside it, so one duplicate does not spoil the rest.
- `record_loan(book_id, reader, notify)` takes one copy of the book (raising `NoCopies` when none is left) and records a `Loan`, all in one transaction.
  Only once it commits, with `transaction.on_commit(...)`, it deletes the branch's cached stock and calls `notify(reader, title)`; a failed loan does neither.

## Examples

```python
catalogue_size()                 # 2: one query, then none for 5 minutes
branch_stock(east.pk)            # 0, and a second call runs no query
import_books([("Ubik", 2, "East"), ("Dune", 1, "East")])
# IntegrityError: Dune is held already; neither Ubik nor the East branch is kept
import_titles(["Ubik", "Dune", "Kindred"], central)   # (["Ubik", "Kindred"], ["Dune"])
record_loan(dune.pk, "ann", notify)   # notify("ann", "Dune") runs after the commit
```

Watch for the lesson's pitfall: catching a database error inside an `atomic()` block hides it from Django, and after an `IntegrityError` every later query in that block raises `TransactionManagementError`.
Put the risky write in its own inner `atomic()` and catch the error outside that inner block, so only the savepoint rolls back.

## Run the tests

```bash
cd exercises/backend/dj_caching
pytest
```

`conftest.py` sets Django up for you, on a database that lives in memory for the test run; leave it as it is.
The cache is Django's in-memory default (`LocMemCache`), emptied before each test; in production it would be a shared one such as Redis.
Each test runs inside a transaction that is rolled back afterwards, so the `on_commit` tests capture the callbacks and run them as a commit would, and the all-or-nothing test runs outside one.
Every test fails until you write the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
