# Library package

Topic: Modules & Packages (Backend, Python Fundamentals).
Time: about 20 minutes.

## Task

`library/` is a package with two modules.
Finish it:

- In `library/fees.py`, write `late_fee(days, per_day=20)` and `boxes_needed(books, per_box)`, importing `ceil` from the standard library's `math` module to round up.
- In `library/__init__.py`, import both functions so callers can write `from library import late_fee`.
- In `library/report.py`, write `summary(loans)`, then fix the module so importing it prints nothing while `python -m library.report` still prints the report.

## Examples

```python
from library import late_fee, boxes_needed
late_fee(3)                 # 60
boxes_needed(130, 40)       # 4

from library.report import summary
summary({"Dune": 3, "Emma": 0, "Ubik": 1})   # "3 loans, 2 late, fees 80"
```

```bash
$ python -m library.report
Library report
3 loans, 2 late, fees 80
```

Watch for the lesson's pitfall: code at a module's top level runs whenever the module is imported.

## Run the tests

```bash
cd exercises/backend/py_modules
pytest
```

Every test fails until you finish the package.
When they all pass, tick the exercise done in Recall under Progress, Topics.
