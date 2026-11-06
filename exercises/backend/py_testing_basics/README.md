# Fee tests

Topic: Testing Basics (pytest) (Backend, Python Advanced).
Time: about 20 minutes.

## Task

This time the code is written and you write the tests.
`late_fees.py` holds `late_fee(days_late, per_day=20, cap=500)`; read it, but do not change it.
In `test_late_fees.py`, write pytest tests that pin down its rules:

- A book returned on time (0 days late) costs nothing.
- Each day late costs `per_day` pence: write this one as a `@pytest.mark.parametrize` test with at least three rows.
- The fee never goes above `cap`.
- A different `per_day` rate is used when one is given.
- A negative `days_late` raises `ValueError`: check it with `pytest.raises`, and its message with `match=`.

Arrange, act and assert in each test, one behaviour per test.

## How it is graded

`test_late_fees_grader.py` copies your test file into a temporary folder and runs it twice over:
on the real `late_fees.py`, where every one of your tests must pass, and on copies of `late_fees.py` with one bug planted, where at least one must fail.
The planted bugs charge a day too few, forget the cap, ignore `per_day`, and stop raising for negative days.

## Examples

```python
late_fee(0)              # 0
late_fee(3)              # 60
late_fee(30)             # 500, the cap
late_fee(3, per_day=50)  # 150
late_fee(-1)             # ValueError: days_late cannot be negative
```

Watch for the lesson's pitfall: pytest only runs functions named `test_...`, so a check called `check_cap` never runs and catches nothing.

## Run the tests

```bash
cd exercises/backend/py_testing_basics
pytest
```

Every grader test fails until you write your tests.
When they all pass, tick the exercise done in Recall under Progress, Topics.
