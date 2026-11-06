"""Type hints and dataclasses: practise hints, @dataclass, field(default_factory=...), frozen and asdict.

Fill in each part so the tests in test_typed_loans.py pass.
Run them from this folder with: pytest
"""
from dataclasses import asdict, dataclass, field


# TODO: make Loan a dataclass with these hinted fields, in this order:
#   title: a str
#   member: a str
#   days: an int, 14 by default
#   renewals: a list of str, a fresh empty list for every Loan
class Loan:
    pass


# TODO: make ShelfMark a read-only (frozen) dataclass with two hinted fields:
#   aisle: a str
#   shelf: an int
class ShelfMark:
    pass


# TODO: add the hints to the four functions below as their docstrings describe.
def total_days(loans):
    """Return the days of every loan added up.

    Hints: takes a list of Loan, returns an int.
    """
    # TODO
    raise NotImplementedError


def find(loans, title):
    """Return the first loan with this title, or None when there is none.

    Hints: takes a list of Loan and a str, returns a Loan or None.
    """
    # TODO
    raise NotImplementedError


def loan_from_form(form):
    """Build a Loan from a web form, where every value is text.

    `form` has "title" and "member", and may have "days" (14 when it is missing).
    A dataclass neither converts nor checks its fields, so do it here:
    "21" becomes the int 21, text that is not a whole number raises
    ValueError("days must be a whole number"), and a number below 1 raises
    ValueError("days must be at least 1").

    Hints: takes a dict of str to str, returns a Loan.
    """
    # TODO
    raise NotImplementedError


def to_rows(loans):
    """Return each loan as a plain dict, in order, using asdict.

    Hints: takes a list of Loan, returns a list of dict.
    """
    # TODO
    raise NotImplementedError
