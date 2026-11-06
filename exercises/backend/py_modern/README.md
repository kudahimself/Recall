# Returns router

Topic: Modern Python (3.10+) (Backend, Python Mastery & Advanced).
Time: about 25 minutes.
Needs Python 3.10 or newer, for `match` and `str | None` hints.

## Task

Returned items and desk commands pile up at the library's returns desk.
Sort them out in `returns_router.py` with the Python 3.10 features the lesson shows; `Book`, `Desk`, `MAX_RENEWAL` and `DEFAULTS` are written for you.

- `shelve(item)` says where a returned item goes, with one `match` statement:
  a `Book` over 500 pages goes to `"<title>: big shelf"` and any other `Book` to `"<title>: main shelf"`;
  a dict with an `"isbn"` key is `"order <isbn>"`, whatever else it holds;
  an `int` or a `float` is a fine paid, `"fine paid: <amount>"`;
  a list with at least one title is `"<first> + <how many others> more"`;
  and anything else, the empty list included, goes to the `"returns desk"`.
- `handle(command)` runs a desk command, matching on `command.split()`:
  `"lend Dune ana"` answers `"Dune lent to ana"`, `"return Emma"` answers `"Emma returned"`,
  and `"renew Ubik 7"` answers `"Ubik renewed for 7 days"` when the days are at most `MAX_RENEWAL`, or `"renewals are 14 days at most"` when they are more.
  No words at all is `"nothing to do"`, and anything else, a wrong number of words included, is `"unknown command"`.
- `where(desk)` matches a `Desk` member against `Desk.FRONT` (`"by the door"`) and `Desk.STAFF` (`"behind the counter"`).
- `big_orders(orders, price_of)` returns `(title, cost)` for each order that costs more than 20, in one list comprehension.
  `price_of(order)` is slow, so call it once per order: keep its result with the walrus operator in the filter and use it again in the output.
- `branch_settings(overrides)` returns `DEFAULTS` with the branch's overrides on top as a new dict, with `|`, and leaves `DEFAULTS` as it was.
- Annotate `find_shelf(title, shelves)` with the new hints, a `str`, a `dict` from `str` to `str` and a return of `str` or `None`, and return the title's shelf or `None`.

## Examples

```python
shelve(Book("Dune", 612))            # "Dune: big shelf"
shelve({"isbn": "978-0", "qty": 2})  # "order 978-0"
shelve(["Ubik", "Kim", "Emma"])      # "Ubik + 2 more"
shelve([])                           # "returns desk"
handle("renew Ubik 30")              # "renewals are 14 days at most"
handle("lend Dune")                  # "unknown command"
where(Desk.STAFF)                    # "behind the counter"
branch_settings({"loan_days": 14})   # {"loan_days": 14, "max_loans": 5, "fines": True}
```

Watch for the lesson's pitfall: cases are tried in order and the first fit wins, so put the guarded big-book case above the plain `Book` one.
And a bare name such as `case FRONT:` captures every value instead of comparing with it; write the dotted `case Desk.FRONT:`.

## Run the tests

```bash
cd exercises/backend/py_modern
pytest
```

Every test fails until you fill in the module.
When they all pass, tick the exercise done in Recall under Progress, Topics.
