# Checked and logged

Topic: Decorators (Backend, Python Fundamentals).
Time: about 25 minutes.

## Task

Write two decorators in `decorators.py`, then use them together:

- `logged(fn)` records each call in the module's `CALLS` list as `(name, args, kwargs)`, before calling the function, and returns the function's result.
- `require_positive(fn)` raises `ValueError("arguments must be positive")` when any positional argument is 0 or less, without calling the function.
- Both work on a function with any arguments, and keep its `__name__` and docstring.
- Stack both decorators on `hold_fee`, in the order that keeps a refused call out of `CALLS`.

## Examples

```python
@logged
def double(x):
    return x * 2

double(4)          # 8
CALLS              # [("double", (4,), {})]

hold_fee(3, per_book=25)   # 75, and recorded in CALLS
hold_fee(0)                # ValueError, and NOT recorded in CALLS
hold_fee.__name__          # "hold_fee"
```

Watch for the lesson's pitfall: a wrapper that does not return the function's result makes every decorated function return `None`.

## Run the tests

```bash
cd exercises/backend/py_decorators
pytest
```

Every test fails until you fill in the decorators.
When they all pass, tick the exercise done in Recall under Progress, Topics.
