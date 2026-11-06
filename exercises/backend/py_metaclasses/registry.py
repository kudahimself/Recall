"""Metaclasses and introspection: practise a metaclass, type() and reading a class's structure.

Fill in each part so the tests in test_registry.py pass.
Run them from this folder with: pytest
"""

# Every class Registered builds, keyed by the class's name.
REGISTRY = {}


class Registered(type):
    """Metaclass: records every class it builds in REGISTRY."""

    # TODO: write __init__(cls, clsname, bases, ns): run type's own __init__ with
    # super(), then store the new class in REGISTRY under clsname.


# TODO: build Item with the Registered metaclass.
class Item:
    """Something the library lends."""

    loan_days = 14


def make_kind(kind, loan_days):
    """Make a subclass of Item at run time with type(), named `kind`.

    The new class has a class attribute loan_days set to `loan_days`.
    """
    # TODO
    raise NotImplementedError


def own_attributes(cls):
    """Return, sorted, the names of the attributes `cls` itself defines.

    Inherited attributes are not included, and dunder names such as __module__ are skipped.
    """
    # TODO
    raise NotImplementedError


def parent_names(cls):
    """Return the names of the classes `cls` inherits from directly, in order."""
    # TODO
    raise NotImplementedError


def setting(obj, attr, default=None):
    """Return obj's attribute `attr`, or `default` when it has none."""
    # TODO
    raise NotImplementedError
