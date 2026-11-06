"""PostgreSQL Features: query the details JSON with the ORM.

Write the functions below so the tests in test_editions.py pass.
Each one returns a QuerySet, so the database does the work, not a Python loop.
"""
from django.db.models.fields.json import KeyTextTransform

from editions.models import Edition


def in_language(lang):
    """Editions whose details["lang"] is lang."""
    # TODO
    raise NotImplementedError


def shelved_on_or_above(floor):
    """Editions whose details["shelf"]["floor"] is floor or higher."""
    # TODO
    raise NotImplementedError


def with_awards_listed():
    """Editions whose details have an "awards" key, even an empty list."""
    # TODO
    raise NotImplementedError


def by_language():
    """Every edition with its language as text in .lang, ordered by language then title."""
    # TODO
    raise NotImplementedError


def newest_of_kind(kind):
    """The editions of one kind, newest first: the query the composite index serves."""
    # TODO
    raise NotImplementedError
