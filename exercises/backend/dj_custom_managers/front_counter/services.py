"""Service Layer: practise keeping the lending rules in one plain function.

Write lend() so the tests in test_front_counter.py pass. The errors are written for you.
"""
from django.db import transaction

from front_counter.models import Book, Loan, Member

MAX_OPEN_LOANS = 2


class LendingError(Exception):
    """A loan the rules refuse. `code` names the reason for the API."""

    code = "lending_error"


class NotAMember(LendingError):
    code = "not_a_member"


class NoCopyLeft(LendingError):
    code = "no_copy_left"


class LoanLimitReached(LendingError):
    code = "loan_limit"


def lend(member_id, book_id):
    """Lend one copy of a book to a member and return the new Loan.

    TODO, all inside one transaction.atomic() block:
    - find the member through Member.objects, so a deleted or unknown member raises NotAMember;
    - find the book among the available ones, locking its row with select_for_update(),
      so a book with no copy left, or an unknown book, raises NoCopyLeft;
    - a member who already has MAX_OPEN_LOANS loans not yet returned raises LoanLimitReached;
    - take the copy (copies one lower, saved), then record the Loan.
    """
    # TODO
    raise NotImplementedError
