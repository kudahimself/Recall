# Fee tools

Topic: functools Deep Dive (Backend, Python Advanced).
Time: about 20 minutes.

## Task

Finish the library's helpers in `fee_tools.py` with the tools from `functools`:

- Cache `shelf_for(title)` with `lru_cache`, so a title asked for again skips the slow lookup in the body.
- Make `dvd_fine` with `partial`: `fine` with `rate=50` already filled in.
- `combine(counts)` folds a list of `{title: loans}` dicts into one with `reduce`, adding up each title's loans.
- `counted(fn)` is a decorator that counts calls in the wrapper's `calls` attribute and keeps the function's name and docstring with `wraps`.
- `fees_for_list(days)` hands a list of late days to the cached `fees_for`, which cannot take a list as it is.

## Examples

```python
shelf_for("dune")       # "D-4", and "dune" is recorded in LOOKUPS
shelf_for("dune")       # "D-4" from the cache, recorded no second time
shelf_for.cache_info()  # CacheInfo(hits=1, misses=1, ...)
dvd_fine(3)             # 150
combine([{"Dune": 2}, {"Dune": 1, "Emma": 4}])   # {"Dune": 3, "Emma": 4}

@counted
def renew(title): ...
renew("Dune")
renew.calls             # 1

fees_for([1, 2])        # TypeError: unhashable type: 'list'
fees_for_list([1, 2])   # 60
```

Watch for the lesson's pitfall: a cached function skips its body on a repeat call, so a side effect such as the `LOOKUPS` record happens only the first time.
Its arguments must be hashable too, so pass a tuple, never a list.

## Run the tests

```bash
cd exercises/backend/py_functools
pytest
```

Every test fails until you fill in the helpers.
When they all pass, tick the exercise done in Recall under Progress, Topics.
