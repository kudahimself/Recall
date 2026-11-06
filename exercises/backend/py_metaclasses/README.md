# Item registry

Topic: Metaclasses & Introspection (Backend, Python Advanced).
Time: about 25 minutes.

## Task

The library wants a list of every kind of item it lends, kept up to date without anyone registering classes by hand.
Finish `registry.py`:

- `Registered` is a metaclass: its `__init__` puts every class it builds into `REGISTRY`, keyed by the class's name.
- Build `Item` with `Registered`, so `Item` and every subclass of it land in `REGISTRY`.
- `make_kind(kind, loan_days)` makes a subclass of `Item` at run time with `type(...)`, named `kind`, with a class attribute `loan_days`.
- `own_attributes(cls)` lists, sorted, the attributes `cls` itself defines, skipping dunder names such as `__module__`.
- `parent_names(cls)` lists the names of the classes `cls` inherits from directly.
- `setting(obj, attr, default=None)` reads an attribute, giving `default` when it is missing.

## Examples

```python
REGISTRY["Item"]                  # <class 'registry.Item'>
Dvd = make_kind("Dvd", 7)
Dvd.loan_days, Dvd().loan_days    # (7, 7)
REGISTRY["Dvd"] is Dvd            # True
own_attributes(Dvd)               # ["loan_days"]
parent_names(Dvd)                 # ["Item"]
type(Item)                        # <class 'registry.Registered'>
setting(Item(), "renewals", 0)    # 0
```

Watch for the lesson's pitfall: a metaclass is not a parent class.
`type(Item)` is the class that built `Item`, while `Item.__bases__` lists the classes it inherits from, which is just `object`.

## Run the tests

```bash
cd exercises/backend/py_metaclasses
pytest
```

Every test fails until you fill in the module.
When they all pass, tick the exercise done in Recall under Progress, Topics.
