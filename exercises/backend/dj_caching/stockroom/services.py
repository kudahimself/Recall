"""Caching & Transactions: practise the low-level cache API, atomic(), savepoints and on_commit.

Write the functions below so the tests in test_stockroom.py pass.
Run them from the exercise folder with: pytest
"""
from django.core.cache import cache
from django.db import IntegrityError, transaction
from django.db.models import Sum

from stockroom.models import Book, Branch, Loan


class NoCopies(Exception):
    """Raised when a loan is asked for a book with no copy left."""


def branch_key(branch_id):
    """The cache key for one branch's stock."""
    return f"stockroom:branch:{branch_id}"


def catalogue_size():
    """How many books the library holds, cached under "stockroom:size" for 5 minutes.

    One call to the cache: hand it the function that counts, not the count.
    """
    # TODO
    raise NotImplementedError


def branch_stock(branch_id):
    """The total copies at a branch (0 when it has none), cached under branch_key(branch_id)
    for 60 seconds. A cached 0 is a hit too: it must not query again."""
    # TODO
    raise NotImplementedError


def import_books(rows):
    """Add a batch of books from (title, copies, branch name) rows, creating a branch the
    first time its name is seen; return how many books were added.

    All or nothing: when any row fails (a title already held raises IntegrityError), the
    error propagates and no book or branch from the batch is kept.
    """
    # TODO
    raise NotImplementedError


def import_titles(titles, branch):
    """Add one copy of each title at the branch, skipping titles already held.

    Return (added, skipped), two lists of titles in the order given. One failed insert
    must not spoil the rest of the work.
    """
    # TODO
    raise NotImplementedError


def record_loan(book_id, reader, notify):
    """Lend one copy of the book to the reader, all or nothing.

    Take a copy (raise NoCopies when none is left) and record the Loan.
    Only once the transaction has committed: forget the cached stock of the book's
    branch, and call notify(reader, title). A failed loan does neither.
    """
    # TODO
    raise NotImplementedError
