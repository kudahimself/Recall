"""Daily Python patterns: practise enumerate, zip, any/all, sorting keys and string methods.

Fill in each function so the tests in test_desk_report.py pass.
Run them from this folder with: pytest
"""
from operator import itemgetter


def numbered(titles):
    """Number the titles from 1: ["Dune", "Emma"] -> ["1. Dune", "2. Emma"]."""
    return [f"{n}. {title}" for n, title in enumerate(titles, start=1)]


def shelf_map(titles, shelves):
    """Pair each title with its shelf code, stopping at the shorter list."""
    return dict(zip(titles, shelves))


def any_overdue(loans, limit=21):
    """True when any loan has been out more than `limit` days.

    `loans` may be a one-pass iterator: stop at the first overdue loan.
    """
    return any(loan["days"] > limit for loan in loans)


def all_back(loans):
    """True when every loan is returned (an empty input counts as all back).

    `loans` may be a one-pass iterator: stop at the first loan still out.
    """
    return all(loan["returned"] for loan in loans)


def by_branch(loans):
    """A new list of the loans sorted by branch, then by title within a branch."""
    return sorted(loans, key=itemgetter("branch", "title"))


def longest_first(loans):
    """A new list of the loans, longest out first; a tie in days goes by title, A to Z."""
    return sorted(loans, key=lambda loan: (-loan["days"], loan["title"]))


def shelve_in_place(loans):
    """Sort the given list itself by title, A to Z, and return None, as list.sort does."""
    loans.sort(key=itemgetter("title"))


def tidy(raw):
    """Collapse every run of whitespace to one space and trim the ends."""
    return " ".join(raw.split())


def is_link(text):
    """True when the text, ignoring surrounding spaces and case, starts with http:// or https://."""
    return text.strip().lower().startswith(("http://", "https://"))
