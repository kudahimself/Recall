# Logged loans

Topic: Logging (Python stdlib) (Backend, Python Advanced).
Time: about 20 minutes.

## Task

Swap the library's prints for log messages.
Fill in `loans.py`:

- `log` is the module's logger, named `"library.loans"`, so it is a child of the `"library"` logger.
- `configure()` sets the `"library"` logger's level to INFO, so INFO messages from `library.loans` and every other `library.*` logger are shown.
  Set the parent's level only and let the children inherit it.
- `lend(title, member)` logs `"lent %s to %s"` at INFO with the values as arguments, not as a ready-made string, and returns `"Dune -> ana"`.
- `check_return(title, days_late)` logs `"%s returned %d days late"` at WARNING when the book is late, and `"%s returned on time"` at DEBUG otherwise.
- `renew_all(titles, renew)` calls `renew(title)` for each title.
  When one raises, it logs `"renewal failed for %s"` with `log.exception`, so the traceback is kept, and carries on.
  It returns the titles that were renewed.

## Examples

```python
lend("Dune", "ana")          # "Dune -> ana", and its INFO message is hidden
configure()
lend("Dune", "ana")          # INFO library.loans lent Dune to ana
check_return("Emma", 3)      # WARNING library.loans Emma returned 3 days late
renew_all(["Dune", "Emma"], renew)
# ERROR library.loans renewal failed for Emma, plus the traceback
# returns ["Dune"]
```

In a real program you would call `logging.basicConfig(level=..., format=...)` once at start-up to also choose where messages go.
The tests read the messages with pytest's `caplog` fixture instead.

Watch for the lesson's pitfall: out of the box only WARNING and above are shown, so `log.info(...)` shows nothing until a level is set.

## Run the tests

```bash
cd exercises/backend/py_logging
pytest
```

Every test fails until you fill in the module.
When they all pass, tick the exercise done in Recall under Progress, Topics.
