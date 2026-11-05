# Batch lookups

Topic: Parallelism (futures, multiprocessing) (Backend, Python Advanced).
Time: about 25 minutes.

## Task

The library looks up many books at once.
Fill in `batch.py` with `concurrent.futures`, using each pool in a `with` block:

- `fetch_all(fetch, isbns, workers=4)` runs `fetch` on every isbn with a `ThreadPoolExecutor` and returns the results in input order with `pool.map`.
- `check_all(fetch, isbns)` submits one job per isbn, reads them back with `as_completed`, and returns `(found, failed)`: results by isbn, and the exception each failing isbn raised.
- `finish_order(fetch, isbns)` returns the isbns in the order their jobs finished.
- `count_words_parallel(texts)` runs the given `count_words` on every text with a `ProcessPoolExecutor`, for CPU work, and returns the counts in order.

## Examples

```python
fetch_all(lookup, ["444", "111"])            # ["Kim", "Dune"]
check_all(lookup, ["111", "999"])            # ({"111": "Dune"}, {"999": KeyError("999")})
finish_order(lookup, ["slow", "fast"])       # ["fast", "slow"]
count_words_parallel(["Dune by Frank Herbert", "Emma"])   # [4, 1]
```

Watch for the lesson's pitfall: an exception inside a job stays hidden until you call `.result()`, so read every future, inside a `try`, and keep the error with the isbn that raised it.

## Run the tests

```bash
cd exercises/backend/py_futures
pytest
```

Every test fails until you fill in the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
