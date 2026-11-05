# Busy desk

Topic: Threading & Synchronization (Backend, Python Advanced).
Time: about 25 minutes.

## Task

The loans desk does several things at once.
Fill in `desk.py` with the `threading` module and `queue.Queue`:

- `LoanCounter` keeps a `count` and a `threading.Lock()` called `lock`, and `add(n=1)` changes the count only inside `with self.lock:`.
- `run_all(fn, items)` runs `fn(item)` for every item, each in its own thread, and returns the results in item order: start every thread, then `join()` them all.
- `process_queue(jobs, handle, workers=3)` puts the jobs on a `Queue` followed by one `None` per worker, starts `workers` threads that `get()` jobs and call `handle(job)` until they get a `None`, and returns the results once every worker has finished.
- `wait_then_run(opened, action)` starts a daemon thread that waits on the `threading.Event` `opened`, then calls `action()`, and returns the thread at once.

## Examples

```python
counter = LoanCounter()
counter.add(); counter.add(2)
counter.count                                      # 3

run_all(lambda n: n * 2, [1, 2, 3])                # [2, 4, 6]
process_queue(["dune", "emma"], str.upper)         # ["DUNE", "EMMA"], in any order

opened = threading.Event()
t = wait_then_run(opened, lambda: print("open"))   # nothing printed yet
opened.set()                                       # prints "open"
```

Watch for the lesson's pitfall: `count += 1` is a read, an add and a write, so without the lock several threads can lose updates, and without `join()` your function returns before the threads are done.

## Run the tests

```bash
cd exercises/backend/py_threading
pytest
```

Every test fails until you fill in the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
