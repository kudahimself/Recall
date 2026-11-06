"""Daily Python patterns: practise enumerate, zip, any/all, sorting keys and string methods.

Fill in each function so the tests in test_desk_report.py pass.
Run them from this folder with: pytest
"""
from operator import itemgetter  # noqa: F401  (a ready-made sort key)


def numbered(titles):
    """Number the titles from 1: ["Dune", "Emma"] -> ["1. Dune", "2. Emma"]."""
    # TODO
    raise NotImplementedError


def shelf_map(titles, shelves):
    """Pair each title with its shelf code, stopping at the shorter list."""
    # TODO
    raise NotImplementedError


def any_overdue(loans, limit=21):
    """True when any loan has been out more than `limit` days.

    `loans` may be a one-pass iterator: stop at the first overdue loan.
    """
    # TODO
    raise NotImplementedError


def all_back(loans):
    """True when every loan is returned (an empty input counts as all back).

    `loans` may be a one-pass iterator: stop at the first loan still out.
    """
    # TODO
    raise NotImplementedError


def by_branch(loans):
    """A new list of the loans sorted by branch, then by title within a branch."""
    # TODO
    raise NotImplementedError


def longest_first(loans):
    """A new list of the loans, longest out first; a tie in days goes by title, A to Z."""
    # TODO
    raise NotImplementedError


def shelve_in_place(loans):
    """Sort the given list itself by title, A to Z, and return None, as list.sort does."""
    # TODO
    raise NotImplementedError


def tidy(raw):
    """Collapse every run of whitespace to one space and trim the ends."""
    # TODO
    raise NotImplementedError


def is_link(text):
    """True when the text, ignoring surrounding spaces and case, starts with http:// or https://."""
    # TODO
    raise NotImplementedError
