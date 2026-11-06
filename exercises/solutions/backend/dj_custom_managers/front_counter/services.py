"""Service Layer: reference solution."""
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
    with transaction.atomic():
        member = Member.objects.filter(pk=member_id).first()
        if member is None:
            raise NotAMember(member_id)
        book = Book.objects.select_for_update().available().filter(pk=book_id).first()
        if book is None:
            raise NoCopyLeft(book_id)
        if member.loans.filter(returned=False).count() >= MAX_OPEN_LOANS:
            raise LoanLimitReached(member_id)
        book.copies -= 1
        book.save(update_fields=["copies"])
        return Loan.objects.create(member=member, book=book)
