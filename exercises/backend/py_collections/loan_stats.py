"""Collections and itertools: practise Counter, defaultdict, deque, namedtuple, ChainMap, chain, islice and groupby.

Fill in each part so the tests in test_loan_stats.py pass.
Run them from this folder with: pytest
"""
from collections import ChainMap, Counter, defaultdict, deque, namedtuple
from itertools import chain, groupby, islice

# The library's settings, used when nothing overrides them.
DEFAULTS = {"loan_days": 14, "fee_per_day": 20, "max_loans": 5}

# TODO: make Shelf a namedtuple with the fields aisle and number,
# so Shelf("B", 4).aisle == "B" and Shelf("B", 4).number == 4.
Shelf = None


def top_titles(titles, n):
    """Return the n most borrowed titles as (title, count) pairs, biggest count first, using Counter."""
    # TODO
    raise NotImplementedError


def titles_by_member(loans):
    """Group (member, title) loans into a defaultdict(list) of member -> titles, in loan order.

    Return the defaultdict itself, so a member with no loans reads as [].
    """
    # TODO
    raise NotImplementedError


def recent(titles, n=3):
    """Return a deque of the last n titles that keeps only n items as more are appended."""
    # TODO
    raise NotImplementedError


def settings(overrides):
    """Return a ChainMap that looks a key up in `overrides` first, then in DEFAULTS.

    Writing to it changes `overrides`, never DEFAULTS.
    """
    # TODO
    raise NotImplementedError


def first_titles(shelves, n):
    """Return the first n titles across all the shelves, in order, using chain and islice.

    `shelves` is a list of iterables; do not build one big list of every title first.
    """
    # TODO
    raise NotImplementedError


def loans_per_month(loans):
    """Return [(month, how many loans)] for (month, title) loans in any order, months ascending, using groupby.

    loans_per_month([("2025-02", "Dune"), ("2025-01", "Emma"), ("2025-02", "Ubik")])
    gives [("2025-01", 1), ("2025-02", 2)].
    """
    # TODO
    raise NotImplementedError
