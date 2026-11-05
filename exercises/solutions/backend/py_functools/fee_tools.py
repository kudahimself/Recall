"""functools: reference solution."""
from functools import lru_cache, partial, reduce, wraps

LOOKUPS = []


@lru_cache(maxsize=None)
def shelf_for(title):
    LOOKUPS.append(title)
    return f"{title[0].upper()}-{len(title)}"


def fine(days, rate=20):
    """The fine for `days` late days at `rate` per day."""
    return days * rate


dvd_fine = partial(fine, rate=50)


def combine(counts):
    def add(total, more):
        merged = dict(total)
        for title, n in more.items():
            merged[title] = merged.get(title, 0) + n
        return merged

    return reduce(add, counts, {})


def counted(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        wrapper.calls += 1
        return fn(*args, **kwargs)

    wrapper.calls = 0
    return wrapper


@lru_cache(maxsize=None)
def fees_for(days):
    """Return the total fine for a tuple of late days, one entry per loan. Already cached."""
    return sum(fine(d) for d in days)


def fees_for_list(days):
    return fees_for(tuple(days))
