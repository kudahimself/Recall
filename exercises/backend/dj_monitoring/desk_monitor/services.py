"""The loan desk's lending service, written for you.

lend_book raises LendingError for a request the desk refuses, an expected outcome,
and CatalogueDown when the catalogue cannot be reached.
"""
ON_LOAN = {2}


class LendingError(Exception):
    """The desk refuses the loan, such as a book already out."""


class CatalogueDown(ConnectionError):
    """The catalogue service cannot be reached."""


def lend_book(book_id, member):
    """Lend the book to the member and return the new loan's id."""
    if book_id in ON_LOAN:
        raise LendingError("already on loan")
    return 100 + book_id
