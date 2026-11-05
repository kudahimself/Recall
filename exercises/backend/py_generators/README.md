# Reading queue

Topic: Generators (yield, coroutines) (Backend, Python Advanced).
Time: about 20 minutes.

## Task

Write the generators in `reading.py`, so values are made one at a time instead of built into lists:

- `numbered(titles)` yields `"1. Dune"`, `"2. Emma"` and so on.
- `ticket_numbers(start)` never ends: it yields `start`, `start + 1`, ... for as long as it is asked.
- `chunks(items, size)` yields lists of `size` items, and the last list may be shorter.
- `all_titles(*shelves)` yields every title from every shelf, using `yield from`.
- `running_total()` is a coroutine: the first `next()` yields 0, then each `send(fee)` yields the total so far.
- `stats(titles)` returns how many titles there are and the longest one, even when `titles` is a generator.

## Examples

```python
gen = numbered(["Dune", "Emma"])   # nothing has run yet
next(gen)                          # "1. Dune"
list(chunks("abcde", 2))           # [["a", "b"], ["c", "d"], ["e"]]
list(all_titles(["Dune"], ["Emma", "Ubik"]))   # ["Dune", "Emma", "Ubik"]

total = running_total()
next(total)                        # 0
total.send(20)                     # 20
total.send(5)                      # 25

stats(t for t in ["Dune", "Beloved", "Emma"])  # (3, "Beloved")
```

Watch for the lesson's pitfall: a generator can be read only once, and a second pass over it quietly gives nothing.
`stats` needs the titles twice, so build a list from them first.

## Run the tests

```bash
cd exercises/backend/py_generators
pytest
```

Every test fails until you fill in the generators.
When they all pass, tick the exercise done in Recall under Progress, Topics.
