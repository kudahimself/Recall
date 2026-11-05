"""Decorators: reference solution."""
import functools

CALLS = []


def logged(fn):
    @functools.wraps(fn)
    def wrapper(*args, **kwargs):
        CALLS.append((fn.__name__, args, kwargs))
        return fn(*args, **kwargs)
    return wrapper


def require_positive(fn):
    @functools.wraps(fn)
    def wrapper(*args, **kwargs):
        for value in args:
            if value <= 0:
                raise ValueError("arguments must be positive")
        return fn(*args, **kwargs)
    return wrapper


@require_positive
@logged
def hold_fee(books, per_book=20):
    """Return the fee for placing holds on `books` books."""
    return books * per_book
