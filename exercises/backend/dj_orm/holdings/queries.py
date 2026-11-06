"""ORM: practise filter, exclude, lookups, Q, order_by, slicing, first, count, exists and create.

Write each query with Book.objects / Author.objects so the tests in
test_holdings_queries.py pass; no loops over every row in Python.
Run them from the exercise folder with: pytest
"""
from django.db.models import Q

from holdings.models import Author, Book


def short_titles(max_pages):
    """Titles of the books with fewer than max_pages pages, the longest first."""
    # TODO
    raise NotImplementedError


def count_by(author_name):
    """How many books the author with this full name wrote, counted by the database."""
    # TODO: follow the foreign key with a double underscore.
    raise NotImplementedError


def old_or_short(year, pages):
    """Books published before year OR with fewer than pages pages, by title, then year."""
    # TODO
    raise NotImplementedError


def search(text):
    """The first book, in title order, whose title contains text in any case; None when none does."""
    # TODO
    raise NotImplementedError


def oldest_titled(title):
    """The earliest book (lowest year) with exactly this title, or None.

    Several books can share a title, and there may be none at all.
    """
    # TODO
    raise NotImplementedError


def on_shelf(n):
    """A QuerySet of at most n books not on loan, the newest year first.

    Return the QuerySet itself, unevaluated: no query should run until the caller uses it.
    """
    # TODO
    raise NotImplementedError


def has_loans_by(author_name):
    """True when any book by this author is on loan, asked without loading the rows."""
    # TODO
    raise NotImplementedError


def add_book(author_name, title, pages, year):
    """Insert a book and return it, reusing the author with that full name or creating one."""
    # TODO
    raise NotImplementedError
