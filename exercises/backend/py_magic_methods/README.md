# A shelf that acts built-in

Topic: Magic Methods (Backend, Python Advanced).
Time: about 20 minutes.

## Task

Give the `Shelf` class in `shelf.py` the magic methods that let it work with Python's built-in features:

- `__repr__` gives `Shelf(['Dune', 'Emma'])`, the developer view that lists and the debugger show.
- `__str__` gives the friendly `2 books` (or `1 book`) that `print` uses.
- `__len__` powers `len(shelf)`, and with it an empty shelf counts as false.
- `__iter__` lets you loop over the titles and use `in`.
- `__getitem__` gives `shelf[0]` and slices.
- `__add__` puts two shelves together into a new shelf, leaving both alone.
- `__eq__` treats two shelves with the same titles in the same order as equal.

## Examples

```python
a = Shelf(["Dune", "Emma"])
b = Shelf(["Ubik"])
repr(a)          # "Shelf(['Dune', 'Emma'])"
str(a)           # "2 books"
len(a)           # 2
"Emma" in a      # True
a[0]             # "Dune"
a + b            # Shelf(['Dune', 'Emma', 'Ubik'])
[b]              # [Shelf(['Ubik'])]
bool(Shelf([]))  # False
```

Watch for the lesson's pitfall: a list shows its members with `__repr__`, so a class with only `__str__` prints as `<shelf.Shelf object at 0x...>` inside a list.
Write `__repr__` first.

## Run the tests

```bash
cd exercises/backend/py_magic_methods
pytest
```

Every test fails until you fill in the methods.
When they all pass, tick the exercise done in Recall under Progress, Topics.
