import pytest
from django.db.models import QuerySet

from holdings import queries
from holdings.models import Author, Book

pytestmark = pytest.mark.django_db


@pytest.fixture(autouse=True)
def shelf():
    austen = Author.objects.create(full_name="Jane Austen")
    herbert = Author.objects.create(full_name="Frank Herbert")
    dick = Author.objects.create(full_name="Philip K. Dick")
    Book.objects.create(author=herbert, title="Dune", pages=412, year=1965, on_loan=True)
    Book.objects.create(author=austen, title="Emma", pages=474, year=1815)
    Book.objects.create(author=austen, title="Persuasion", pages=249, year=1817, on_loan=True)
    Book.objects.create(author=dick, title="Ubik", pages=202, year=1969)
    Book.objects.create(author=dick, title="Emma", pages=180, year=1999)
    Author.objects.create(full_name="Ann Leckie")


def test_short_titles_longest_first():
    assert queries.short_titles(450) == ["Dune", "Persuasion", "Ubik", "Emma"]
    assert queries.short_titles(100) == []


def test_count_by_follows_the_foreign_key_in_one_query(django_assert_num_queries):
    with django_assert_num_queries(1):
        assert queries.count_by("Jane Austen") == 2
    assert queries.count_by("Ann Leckie") == 0


def test_old_or_short_uses_or():
    result = queries.old_or_short(1900, 210)
    assert isinstance(result, QuerySet)
    assert [(b.title, b.year) for b in result] == [("Emma", 1815), ("Emma", 1999), ("Persuasion", 1817), ("Ubik", 1969)]


def test_search_ignores_case_and_returns_none_on_a_miss():
    assert queries.search("UN").title == "Dune"
    assert queries.search("s").title == "Persuasion"
    assert queries.search("zz") is None


def test_oldest_titled_copes_with_none_and_several():
    assert queries.oldest_titled("Emma").year == 1815
    assert queries.oldest_titled("Dune").year == 1965
    assert queries.oldest_titled("Middlemarch") is None


def test_on_shelf_is_lazy(django_assert_num_queries):
    with django_assert_num_queries(0):
        result = queries.on_shelf(2)
    assert isinstance(result, QuerySet)
    with django_assert_num_queries(1):
        assert [b.title for b in result] == ["Emma", "Ubik"]
    assert [b.year for b in queries.on_shelf(5)] == [1999, 1969, 1815]


def test_has_loans_by_asks_without_loading_rows(django_assert_num_queries):
    with django_assert_num_queries(1) as ctx:
        assert queries.has_loans_by("Jane Austen") is True
    assert "LIMIT 1" in ctx.captured_queries[0]["sql"]
    assert queries.has_loans_by("Philip K. Dick") is False
    assert queries.has_loans_by("Nobody") is False


def test_add_book_reuses_or_creates_the_author():
    book = queries.add_book("Ann Leckie", "Provenance", 438, 2017)
    assert book.pk is not None
    assert Book.objects.get(title="Provenance").author.full_name == "Ann Leckie"
    assert Author.objects.filter(full_name="Ann Leckie").count() == 1
    queries.add_book("Becky Chambers", "Psalm", 160, 2021)
    assert Author.objects.filter(full_name="Becky Chambers").count() == 1
