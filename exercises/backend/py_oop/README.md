# Library items

Topic: OOP Basics (classes, inheritance, methods) (Backend, Python Fundamentals).
Time: about 20 minutes.

## Task

Model the things the library lends in `items.py`:

- `Item(title)` stores its title and gives each item its own empty list of holds.
- `Item.loan_days` is a class variable, 21 for every item.
- `item.label()` returns the title, and `item.place_hold(name)` adds a hold and returns how many there now are.
- `Dvd(title, minutes)` inherits from `Item`, lets `Item.__init__` set the title and holds through `super()`, then stores the running time.
- `Dvd.loan_days` is 7, and `dvd.label()` adds the running time to the label `Item` would give.

## Examples

```python
a = Item("Dune")
a.place_hold("Ana")        # 1
a.holds                    # ["Ana"]
Item("Emma").holds         # [] (its own list)

d = Dvd("Alien", 117)
d.label()                  # "Alien (117 min)"
d.loan_days                # 7
isinstance(d, Item)        # True
```

Watch for the lesson's pitfall: a list in the class body is one list shared by every instance.

## Run the tests

```bash
cd exercises/backend/py_oop
pytest
```

Every test fails until you fill in the classes.
When they all pass, tick the exercise done in Recall under Progress, Topics.
