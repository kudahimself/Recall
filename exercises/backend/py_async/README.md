# Catalogue lookups

Topic: Async/Await (Backend, Python Advanced).
Time: about 20 minutes.

## Task

The catalogue answers each lookup after a short wait, like a network call.
`DELAY` stands in for that wait, so the tests run offline.
Fill in `lookups.py`:

- `fetch_title(isbn)` is a coroutine: it waits `DELAY` seconds without blocking the loop, then returns the title from `CATALOGUE`, or `"Unknown"`.
- `fetch_one_by_one(isbns)` awaits each lookup in turn and returns the titles in order.
- `fetch_all(isbns)` runs every lookup at once with `asyncio.gather` and returns the titles in the order of `isbns`.
- `pause(seconds)` waits without freezing the other coroutines.
- `lend_while_waiting(isbn)` starts the lookup as a background task with `asyncio.create_task`, counts how often it gets to do other work (a `pause(DELAY / 10)`) until the task is done, then returns `(title, count)`.
- `main(isbns)` is a plain function for ordinary code: it starts the event loop and returns the list of titles from `fetch_all`.

## Examples

```python
asyncio.run(fetch_title("111"))             # "Dune", after about 0.1 s
asyncio.run(fetch_one_by_one(["111", "222"]))  # ["Dune", "Emma"], about 0.2 s
asyncio.run(fetch_all(["111", "222", "333"]))  # ["Dune", "Emma", "Ubik"], about 0.1 s
asyncio.run(lend_while_waiting("333"))      # ("Ubik", 9), give or take a count
main(["222", "999"])                        # ["Emma", "Unknown"]
```

Watch for the lesson's pitfall: calling a coroutine without `await` only creates a coroutine object and does no work, and `time.sleep` inside a coroutine freezes the whole loop.
The tests time `fetch_all` and `pause`, so a blocking sleep shows up as a failure.

## Run the tests

```bash
cd exercises/backend/py_async
pytest
```

Every test fails until you fill in the coroutines.
When they all pass, tick the exercise done in Recall under Progress, Topics.
