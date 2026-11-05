# Loan records

Topic: Type Hints & Dataclasses (Backend, Python Advanced).
Time: about 20 minutes.

## Task

Turn loans into typed records in `loans.py`:

- Make `Loan` a dataclass with the hinted fields `title`, `member`, `days` (14 by default) and `renewals`, a fresh empty list for every loan.
- Make `ShelfMark` a frozen dataclass with `aisle` and `shelf`, so a mark cannot change and can sit in a set.
- Add type hints to the four functions, as each docstring says, using the built-in names (`list[Loan]`, `dict[str, str]`, `Loan | None`).
- `total_days(loans)` adds up the days, and `find(loans, title)` returns the first matching loan or `None`.
- `loan_from_form(form)` turns text from a web form into a `Loan`, converting and checking `days` itself.
- `to_rows(loans)` turns each loan into a plain dict with `asdict`.

## Examples

```python
loan = Loan("Dune", "ana")
loan                              # Loan(title='Dune', member='ana', days=14, renewals=[])
ShelfMark("B", 3).shelf = 4       # FrozenInstanceError
find([loan], "Ubik")              # None
loan_from_form({"title": "Emma", "member": "ben", "days": "21"})   # Loan(..., days=21, ...)
loan_from_form({"title": "Emma", "member": "ben", "days": "many"}) # ValueError
to_rows([loan])                   # [{'title': 'Dune', 'member': 'ana', 'days': 14, 'renewals': []}]
```

Watch for the lesson's pitfall: a hint is a label, not a rule, so `Loan("Dune", "ana", days="many")` builds without complaint.
That is why `loan_from_form` converts and checks the text itself.

## Run the tests

```bash
cd exercises/backend/py_type_hints
pytest
```

Every test fails until you fill in the records and functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
