# Renewals

Topic: Error Handling (try/except) (Backend, Python Fundamentals).
Time: about 20 minutes.

## Task

Borrowers may renew a loan up to `MAX_RENEWALS` times.
Fill in `renewals.py`:

- Make `RenewalError` an exception type of your own.
- `parse_days(text)` turns text into a whole number of days, raising `ValueError` with a clear message for text that is not a number and for 0 or less.
- `renew(renewals, title)` adds one renewal and returns the new count, raising `RenewalError` for a title not on loan or one already renewed `MAX_RENEWALS` times.
- `renew_all(renewals, titles)` renews each title, collecting the ones renewed and the message of each one refused.

`renew_all` catches `RenewalError` only.
Any other error is a bug, and it must still reach the caller.

## Examples

```python
parse_days(" 7 ")            # 7
parse_days("two weeks")      # ValueError: days must be a whole number

renewals = {"Dune": 2, "Emma": 0}
renew(renewals, "Emma")      # 1
renew(renewals, "Dune")      # RenewalError: Dune renewed too often

renew_all({"Dune": 2, "Emma": 0}, ["Emma", "Dune", "Beloved"])
# (["Emma"], {"Dune": "Dune renewed too often", "Beloved": "Beloved is not on loan"})
```

Watch for the lesson's pitfall: a bare `except:` or `except Exception:` hides bugs you never meant to catch.

## Run the tests

```bash
cd exercises/backend/py_error_handling
pytest
```

Every test fails until you fill in the module.
When they all pass, tick the exercise done in Recall under Progress, Topics.
