# Loan stats

Topic: Collections & Itertools (Backend, Python Advanced).
Time: about 25 minutes.

## Task

Answer questions about the library's loans in `loan_stats.py`, each with the container or iterator tool made for the job:

- `Shelf` is a namedtuple with the fields `aisle` and `number`.
- `top_titles(titles, n)` lists the n most borrowed titles with `Counter`.
- `titles_by_member(loans)` groups `(member, title)` pairs into a `defaultdict(list)`.
- `recent(titles, n=3)` keeps only the last n titles in a `deque`.
- `settings(overrides)` is a `ChainMap` that tries the overrides before `DEFAULTS`.
- `first_titles(shelves, n)` takes the first n titles across several shelves with `chain` and `islice`, without building one big list.
- `loans_per_month(loans)` counts `(month, title)` loans per month with `groupby`.

## Examples

```python
Shelf("B", 4).number                                 # 4
top_titles(["Dune", "Emma", "Dune"], 1)              # [("Dune", 2)]
titles_by_member([("ana", "Dune"), ("ana", "Ubik")])["ana"]   # ["Dune", "Ubik"]
list(recent(["Dune", "Emma", "Ubik", "Beloved"]))    # ["Emma", "Ubik", "Beloved"]
settings({"loan_days": 7})["fee_per_day"]            # 20, from DEFAULTS
first_titles([["Dune", "Emma"], ["Ubik"]], 2)        # ["Dune", "Emma"]
loans_per_month([("2025-02", "Dune"), ("2025-01", "Emma"), ("2025-02", "Ubik")])
# [("2025-01", 1), ("2025-02", 2)]
```

Watch for the lesson's pitfall: `groupby` only groups neighbours, so the two February loans above would land in separate groups.
Sort by the month first, then group.

## Run the tests

```bash
cd exercises/backend/py_collections
pytest
```

Every test fails until you fill in `Shelf` and the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
