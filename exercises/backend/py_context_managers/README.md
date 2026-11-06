# Lending desk

Topic: Context Managers (Backend, Python Advanced).
Time: about 25 minutes.

## Task

Make the library's resources clean up after themselves in `desk_session.py`:

- `Desk(log)` is a class-based context manager: `__enter__` logs `"open"` and returns the desk, and `__exit__` logs `"close"` whatever happened.
- `Desk.__exit__` swallows a `KeyError` from the block (an unknown member card) and logs `"unknown card"`, while any other exception carries on.
- `borrowed(shelf, title)` is a `@contextmanager` generator that takes a title off the shelf for the block and puts it back at the end, even when the block fails.
- `first_lines(paths)` opens every file with one `ExitStack` and returns each first line, closing them all however it ends.

## Examples

```python
log = []
with Desk(log) as desk:
    raise KeyError("card 999")
log                                   # ["open", "close", "unknown card"]

shelf = ["Dune", "Emma"]
with borrowed(shelf, "Dune") as book:
    shelf                             # ["Emma"]
shelf                                 # ["Emma", "Dune"]

first_lines(["a.txt", "b.txt"])       # ["Dune", "Emma"]
```

Watch for the lesson's pitfall: in a `@contextmanager` generator, an error in the block is raised at the `yield`, so code after the `yield` is skipped.
Put the cleanup in a `try`/`finally` around the `yield`.

## Run the tests

```bash
cd exercises/backend/py_context_managers
pytest
```

The tests write their files into a temporary folder, so they never touch your own files.
Every test fails until you fill in the context managers.
When they all pass, tick the exercise done in Recall under Progress, Topics.
