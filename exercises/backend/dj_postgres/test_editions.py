"""Check the Edition model and its JSON queries on the in-memory SQLite database.

Django runs JSONField's key lookups, has_key and KeyTextTransform on SQLite as
well as on PostgreSQL, so these tests need no database server. The index test
asks SQLite for its query plan (QuerySet.explain(), Django's EXPLAIN) and
checks that the busiest query uses the composite index.
"""
from datetime import datetime, timezone

import pytest
from django.db.models import QuerySet

from editions.models import Edition
from editions.queries import by_language, in_language, newest_of_kind, shelved_on_or_above, with_awards_listed

pytestmark = pytest.mark.django_db


def when(day):
    return datetime(2026, 11, day, 9, 0, tzinfo=timezone.utc)


def make_shelf():
    """Save three editions, as in the lesson's worked example."""
    return [
        Edition.objects.create(title="River Songs", kind="hardback", created=when(3),
                               details={"lang": "en", "shelf": {"floor": 2}, "awards": ["Costa"]}),
        Edition.objects.create(title="Night Trains", kind="paperback", created=when(1),
                               details={"lang": "fr", "shelf": {"floor": 1}, "awards": []}),
        Edition.objects.create(title="Rain Tales", kind="paperback", created=when(2),
                               details={"lang": "en", "shelf": {"floor": 1}}),
    ]


def titles(queryset):
    assert isinstance(queryset, QuerySet), "return a QuerySet, so the database does the filtering"
    return sorted(e.title for e in queryset)


def test_kind_is_a_column_of_its_own():
    edition = Edition.objects.create(title="River Songs", kind="hardback")
    assert Edition._meta.get_field("kind").max_length == 20
    assert Edition.objects.filter(kind="hardback").get() == edition


def test_every_edition_starts_with_its_own_empty_details():
    first, second = Edition(title="River Songs", kind="hardback"), Edition(title="Rain Tales", kind="paperback")
    first.details["lang"] = "en"
    assert second.details == {}, "default={} hands every edition the same dict: give the callable, dict"
    assert Edition._meta.get_field("details").default is dict


def test_a_key_compared_to_a_value():
    make_shelf()
    assert titles(in_language("en")) == ["Rain Tales", "River Songs"]
    assert titles(in_language("fr")) == ["Night Trains"]
    assert titles(in_language("de")) == []


def test_a_nested_key_compared_as_a_number():
    make_shelf()
    assert titles(shelved_on_or_above(2)) == ["River Songs"]
    assert titles(shelved_on_or_above(1)) == ["Night Trains", "Rain Tales", "River Songs"]
    assert titles(shelved_on_or_above(3)) == []


def test_has_key_counts_an_empty_list_too():
    make_shelf()
    assert titles(with_awards_listed()) == ["Night Trains", "River Songs"]


def test_a_key_pulled_out_as_text_to_sort_on():
    make_shelf()
    ordered = by_language()
    assert isinstance(ordered, QuerySet), "return a QuerySet, so the database does the sorting"
    assert [(e.lang, e.title) for e in ordered] == [
        ("en", "Rain Tales"), ("en", "River Songs"), ("fr", "Night Trains"),
    ]


def test_the_newest_edition_of_a_kind_comes_first():
    make_shelf()
    newest = newest_of_kind("paperback")
    assert isinstance(newest, QuerySet)
    assert [e.title for e in newest] == ["Rain Tales", "Night Trains"]


def test_the_composite_index_serves_the_busiest_query():
    make_shelf()
    indexes = {index.name: index for index in Edition._meta.indexes}
    assert "edition_kind_newest_idx" in indexes, "add the index to Meta.indexes, named edition_kind_newest_idx"
    assert indexes["edition_kind_newest_idx"].fields == ["kind", "-created"], (
        "the column you filter on comes first, then the one you sort on, newest first"
    )
    plan = newest_of_kind("paperback").explain()
    assert "edition_kind_newest_idx" in plan, f"the query should use the index, but its plan is:\n{plan}"
