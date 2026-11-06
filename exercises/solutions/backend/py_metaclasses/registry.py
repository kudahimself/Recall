"""Metaclasses and introspection: reference solution."""

REGISTRY = {}


class Registered(type):
    """Metaclass: records every class it builds in REGISTRY."""

    def __init__(cls, clsname, bases, ns):
        super().__init__(clsname, bases, ns)
        REGISTRY[clsname] = cls


class Item(metaclass=Registered):
    """Something the library lends."""

    loan_days = 14


def make_kind(kind, loan_days):
    return type(kind, (Item,), {"loan_days": loan_days})


def own_attributes(cls):
    return sorted(key for key in vars(cls) if not key.startswith("__"))


def parent_names(cls):
    return [base.__name__ for base in cls.__bases__]


def setting(obj, attr, default=None):
    return getattr(obj, attr, default)
