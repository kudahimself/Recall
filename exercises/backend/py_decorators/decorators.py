"""Decorators: practise writing decorators, functools.wraps and stacking order.

Fill in each part so the tests in test_decorators.py pass.
Run them from this folder with: pytest
"""
import functools

# Every call `logged` sees, as (function name, args tuple, kwargs dict).
CALLS = []


def logged(fn):
    """Decorator: record each call in CALLS BEFORE calling `fn`, then return fn's result.

    It works for a function with any arguments, and the decorated function keeps its
    own __name__ and docstring.
    """
    # TODO
    raise NotImplementedError


def require_positive(fn):
    """Decorator: refuse a call with any positional argument of 0 or less.

    A refused call raises ValueError("arguments must be positive") without calling `fn`.
    Otherwise it returns fn's result. The decorated function keeps its __name__ and docstring.
    """
    # TODO
    raise NotImplementedError


# TODO: decorate hold_fee with BOTH decorators, stacked in the order that keeps
# refused calls out of CALLS.
def hold_fee(books, per_book=20):
    """Return the fee for placing holds on `books` books."""
    return books * per_book
