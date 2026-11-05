# Lending rules

Topic: Advanced OOP & ABCs (Backend, Python Advanced).
Time: about 25 minutes.

## Task

Everything the library lends follows one contract, and each kind of item fills in its own rules.
Finish `lending.py`:

- Make `Lendable` an abstract base class whose `loan_days()` is an abstract method, so neither `Lendable` nor a subclass that skips `loan_days` can be created.
- `due_label()` on `Lendable` returns `"Dune: due in 21 days"`, using whatever `loan_days()` the item has.
- Make `fine_per_day` a property whose setter raises `ValueError` for a negative fine, including in `__init__`.
- `Book(title, pages, fine_per_day=20)` is lent for 21 days when it has more than 500 pages and 14 otherwise.
  Fix its `__init__` so the parent's setup runs too.
- `Dvd(title, fine_per_day=20)` is lent for 7 days.
- `ReferenceBook` is a `Book` lent for 2 days whose `due_label()` extends the parent's with `" (library use only)"`.

## Examples

```python
Lendable("Dune")                    # TypeError: can't instantiate abstract class
book = Book("Dune", 600)
book.title, book.pages              # ("Dune", 600)
book.due_label()                    # "Dune: due in 21 days"
Dvd("Alien").due_label()            # "Alien: due in 7 days"
ReferenceBook("Atlas", 300).due_label()
# "Atlas: due in 2 days (library use only)"
book.fine_per_day = -5              # ValueError
```

Watch for the lesson's pitfall: a subclass that defines its own `__init__` replaces the parent's, so the parent's attributes never exist unless it calls `super().__init__(...)`.

## Run the tests

```bash
cd exercises/backend/py_oop_advanced
pytest
```

Every test fails until you finish the classes.
When they all pass, tick the exercise done in Recall under Progress, Topics.
