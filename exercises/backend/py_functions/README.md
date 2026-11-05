# Late fees

Topic: Functions & Scope (Backend, Python Fundamentals).
Time: about 20 minutes.

## Task

Write the library's fee helpers in `fees.py`:

- `late_fee(days, per_day=20)` returns the fee in pence, with a default rate that a caller can override by name.
- `total_fees(*days_late, per_day=20)` adds up `late_fee` for any number of loans.
- `describe(title, **details)` returns the title, then any extra named details in brackets, in the order they were passed.
- `add_hold(title, holds=None)` appends to a holds list and returns it, starting a fresh list whenever none is passed.

`late_fee` must not change the module's `fees_today` variable: a name assigned inside a function is local to that call.

## Examples

```python
late_fee(3)                           # 60
late_fee(3, per_day=50)               # 150
total_fees(1, 2, 3)                   # 120
describe("Dune", shelf="B4", copies=2)  # "Dune (shelf=B4, copies=2)"
add_hold("Dune")                      # ["Dune"]
add_hold("Emma")                      # ["Emma"], not ["Dune", "Emma"]
```

Watch for the lesson's pitfall: a list default such as `holds=[]` is built once and shared by every call.

## Run the tests

```bash
cd exercises/backend/py_functions
pytest
```

Every test fails until you fill in the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
