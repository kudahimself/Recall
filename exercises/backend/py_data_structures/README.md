# Loan lists

Topic: Data Structures (list, dict, set, tuple) (Backend, Python Fundamentals).
Time: about 20 minutes.

## Task

The library keeps its loans as a plain list of titles, in the order they were borrowed.
Fill in the six functions in `loans.py`, picking the structure that fits each job:

- `unique_titles(loans)` gives each title once, in alphabetical order, without changing the list passed in.
- `count_loans(loans)` counts how often each title was borrowed, keeping the order titles first appear.
- `total_fines(fines, titles)` adds up the fines for some titles, where a title with no fine owes 0.
- `on_both_lists(list_a, list_b)` finds the titles two lists share.
- `describe_spot(spot)` unpacks an `(aisle, shelf)` tuple into text.
- `last_three(loans)` gives the three most recent loans, newest first, as a new list.

## Examples

```python
unique_titles(["Ubik", "Dune", "Ubik"])            # ["Dune", "Ubik"]
count_loans(["Emma", "Dune", "Emma"])              # {"Emma": 2, "Dune": 1}
total_fines({"Dune": 20, "Ubik": 5}, ["Dune", "Emma"])  # 20
on_both_lists(["Dune", "Emma"], ["Emma", "Ubik"])  # ["Emma"]
describe_spot(("B", 4))                            # "aisle B, shelf 4"
last_three(["Dune", "Emma", "Ubik", "Beloved"])    # ["Beloved", "Ubik", "Emma"]
```

Watch for the lesson's pitfall: methods that change a list in place, such as `.sort()` and `.reverse()`, return `None`.

## Run the tests

```bash
cd exercises/backend/py_data_structures
pytest
```

Every test fails until you fill in the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
