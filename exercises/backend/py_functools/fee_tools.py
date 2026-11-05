"""functools: practise lru_cache, partial, reduce and wraps.

Fill in each part so the tests in test_fee_tools.py pass.
Run them from this folder with: pytest
"""
from functools import lru_cache, partial, reduce, wraps

# Every title shelf_for actually looked up, standing in for a slow catalogue search.
LOOKUPS = []


# TODO: cache shelf_for with lru_cache, so a repeat title skips the body.
def shelf_for(title):
    """Return the shelf code of a title: its first letter in capitals, a dash and its length.

    shelf_for("dune") returns "D-4". The body records each lookup in LOOKUPS,
    so with the cache a title is recorded only the first time it is asked for.
    """
    # TODO: keep this line, then return the code.
    LOOKUPS.append(title)
    raise NotImplementedError


def fine(days, rate=20):
    """The fine for `days` late days at `rate` per day."""
    return days * rate


# TODO: make dvd_fine with partial: fine with rate=50 already filled in, so dvd_fine(3) == 150.
dvd_fine = None


def combine(counts):
    """Fold a list of {title: loans} dicts into one dict that adds up each title's loans, using reduce.

    combine([{"Dune": 2}, {"Dune": 1, "Emma": 4}]) returns {"Dune": 3, "Emma": 4}.
    The dicts passed in are left unchanged, and an empty list gives {}.
    """
    # TODO
    raise NotImplementedError


def counted(fn):
    """Decorator: count the calls to `fn` in the wrapper's `calls` attribute, starting at 0.

    The wrapper passes any arguments through, returns fn's result and keeps
    fn's __name__ and docstring.
    """
    # TODO
    raise NotImplementedError


@lru_cache(maxsize=None)
def fees_for(days):
    """Return the total fine for a tuple of late days, one entry per loan. Already cached."""
    return sum(fine(d) for d in days)


def fees_for_list(days):
    """Return fees_for for a LIST of late days.

    fees_for is cached, so it cannot take a list; pass it something it can.
    """
    # TODO
    raise NotImplementedError
