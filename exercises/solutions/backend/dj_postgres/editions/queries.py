"""PostgreSQL Features: query the details JSON with the ORM.

Reference solution.
"""
from django.db.models.fields.json import KeyTextTransform

from editions.models import Edition


def in_language(lang):
    """Editions whose details["lang"] is lang."""
    return Edition.objects.filter(details__lang=lang)


def shelved_on_or_above(floor):
    """Editions whose details["shelf"]["floor"] is floor or higher."""
    return Edition.objects.filter(details__shelf__floor__gte=floor)


def with_awards_listed():
    """Editions whose details have an "awards" key, even an empty list."""
    return Edition.objects.filter(details__has_key="awards")


def by_language():
    """Every edition with its language as text in .lang, ordered by language then title."""
    return Edition.objects.annotate(lang=KeyTextTransform("lang", "details")).order_by("lang", "title")


def newest_of_kind(kind):
    """The editions of one kind, newest first: the query the composite index serves."""
    return Edition.objects.filter(kind=kind).order_by("-created")
