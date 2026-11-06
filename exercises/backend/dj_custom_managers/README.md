# Front counter

Topic: Custom Managers & Service Layer (Backend, DRF Production Patterns).
Time: about 25 minutes.

## Task

Give the lending desk named queries on its models, one service function that holds the lending rules, and a view that only does the HTTP work.
The fields of `Member`, `Book` and `Loan` and the route (`front_counter/urls.py`) are written for you.

In `front_counter/models.py`:

- `MemberManager`, a `models.Manager` whose `get_queryset()` leaves out the members marked `is_deleted`, a soft delete.
  Its `counts()` returns `{"active": ..., "deleted": ...}`, a dict rather than rows, so it stays on the manager.
- On `Member`, declare `objects = MemberManager()` first, so it is the default manager, and `everyone`, a plain `models.Manager()`, to still reach every member.
- `BookQuerySet`, a `models.QuerySet` with `available()` (at least one copy) and `by_author(author)` (that exact author), each returning `self.filter(...)`.
  Attach it to `Book` with `objects = BookQuerySet.as_manager()`.

In `front_counter/services.py`, `lend(member_id, book_id)` holds every rule of a loan and knows nothing of HTTP; the errors are written for you.
Inside one `transaction.atomic()` block it:

- finds the member through `Member.objects`, raising `NotAMember` for a deleted or unknown one;
- finds the book among `Book.objects.select_for_update().available()`, raising `NoCopyLeft` when it has no copy or does not exist;
- raises `LoanLimitReached` when the member already has `MAX_OPEN_LOANS` (2) loans not yet returned;
- takes the copy (copies one lower, saved), then records the `Loan`, and returns it.

In `front_counter/views.py`, `LendView` is an `APIView` whose `post()` reads `member` and `book` from the body, calls `services.lend(...)`, and turns the result into a response: 201 `{"loan": <id>, "copies_left": <copies>}`, or 409 `{"error": <the error's code>}` for any `LendingError`.

## Examples

```python
Member.objects.count(), Member.everyone.count()   # (2, 3): one member is deleted
Member.objects.counts()                           # {"active": 2, "deleted": 1}
Book.objects.available().by_author("Herbert")     # Dune, Children of Dune: one query
Book.objects.by_author("Herbert").available()     # the same, in the other order
lend(ann.pk, dune.pk)                             # a Loan; Dune has 1 copy left
lend(gone.pk, dune.pk)                            # NotAMember, nothing written
```

```text
POST /lend/  {"member": 1, "book": 3}   201  {"loan": 1, "copies_left": 0}
POST /lend/  {"member": 1, "book": 3}   409  {"error": "no_copy_left"}
```

Watch for the lesson's pitfall: query methods written on a `Manager` subclass work only straight off `objects`, so `Book.objects.available().by_author(...)` would raise `AttributeError`, because `available()` returns a plain QuerySet.
Write them on a `QuerySet` subclass and attach it with `as_manager()`, and they chain in any order, even after `filter()`.
And keep the rules out of the view: the tests call `lend()` with no request at all, as a management command or a background task would.

## Run the tests

```bash
cd exercises/backend/dj_custom_managers
pytest
```

`conftest.py` sets Django up for you, on a database that lives in memory for the test run; leave it as it is.
One test makes recording the loan fail halfway, after the copy is taken, and checks the copy is back, which only a transaction gives you.
Every test fails until you write the manager, the QuerySet, the service and the view.
When they all pass, tick the exercise done in Recall under Progress, Topics.
