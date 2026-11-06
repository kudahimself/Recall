# Desk report

Topic: Daily Python Patterns (Backend, Python Mastery & Advanced).
Time: about 20 minutes.

## Task

The loan desk prints a report every evening, and its first draft is all `range(len(...))` loops and index bookkeeping.
Rewrite it in `desk_report.py` with the builtins the lesson shows.
A loan is a dict such as `{"title": "Dune", "branch": "south", "days": 30, "returned": False}`.

- `numbered(titles)` numbers the titles from 1 with `enumerate`: `["1. Dune", "2. Emma"]`.
- `shelf_map(titles, shelves)` pairs each title with its shelf code with `zip`, stopping at the shorter list.
- `any_overdue(loans, limit=21)` is `True` when any loan has been out more than `limit` days, and `all_back(loans)` is `True` when every loan is returned.
  Both must stop at the first loan that settles the answer, since `loans` may be a one-pass iterator, so use `any` and `all` on a generator, not on a list you build first.
- `by_branch(loans)` returns a new list sorted by branch, then by title within a branch, with `itemgetter`.
- `longest_first(loans)` returns a new list, the loan out longest first, and a tie in days goes by title from A to Z.
- `shelve_in_place(loans)` sorts the list it is given by title and returns `None`, as `list.sort` does.
- `tidy(raw)` collapses every run of spaces, tabs and newlines to one space and trims the ends.
- `is_link(text)` is `True` when the text, ignoring surrounding spaces and upper or lower case, starts with `http://` or `https://`.

## Examples

```python
numbered(["Dune", "Emma"])                        # ["1. Dune", "2. Emma"]
shelf_map(["Emma", "Dune", "Ubik"], ["A1", "B2"]) # {"Emma": "A1", "Dune": "B2"}
any_overdue([]), all_back([])                     # (False, True)
[l["title"] for l in by_branch(loans)]            # ["Emma", "Ubik", "Dune", "Kim"]
[l["title"] for l in longest_first(loans)]        # ["Dune", "Ubik", "Emma", "Kim"]
tidy("  late   fee \n")                           # "late fee"
is_link("  HTTPS://books.example.org ")           # True
```

Watch for the lesson's pitfall: `loans.sort()` returns `None`, so `return loans.sort(...)` hands back `None` and the caller's list is changed under them.
Use `sorted(...)` when you want the result as a value, and `.sort()` only as a statement on a list you own, as in `shelve_in_place`.

## Run the tests

```bash
cd exercises/backend/py_daily_patterns
pytest
```

Every test fails until you fill in the module.
When they all pass, tick the exercise done in Recall under Progress, Topics.
