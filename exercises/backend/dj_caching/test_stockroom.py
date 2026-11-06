import pytest
from django.core.cache import cache
from django.db import IntegrityError

from stockroom import services
from stockroom.models import Book, Branch, Loan
from stockroom.services import NoCopies, branch_key

pytestmark = pytest.mark.django_db


@pytest.fixture(autouse=True)
def empty_cache():
    cache.clear()
    yield
    cache.clear()


@pytest.fixture
def central():
    branch = Branch.objects.create(name="Central")
    Book.objects.create(title="Dune", copies=2, branch=branch)
    Book.objects.create(title="Emma", copies=1, branch=branch)
    return branch


def test_catalogue_size_is_cached(central, django_assert_num_queries):
    with django_assert_num_queries(1):
        assert services.catalogue_size() == 2
    Book.objects.create(title="Ubik", branch=central)
    with django_assert_num_queries(0):
        assert services.catalogue_size() == 2
    assert cache.get("stockroom:size") == 2
    cache.delete("stockroom:size")
    assert services.catalogue_size() == 3


def test_branch_stock_caches_each_branch_and_a_zero_too(central, django_assert_num_queries):
    east = Branch.objects.create(name="East")
    with django_assert_num_queries(1):
        assert services.branch_stock(central.pk) == 3
    with django_assert_num_queries(1):
        assert services.branch_stock(east.pk) == 0
    with django_assert_num_queries(0):
        assert services.branch_stock(central.pk) == 3
        assert services.branch_stock(east.pk) == 0
    assert cache.get(branch_key(east.pk)) == 0
    cache.delete(branch_key(central.pk))
    Book.objects.create(title="Ubik", copies=4, branch=central)
    assert services.branch_stock(central.pk) == 7


def test_import_books_adds_a_whole_batch(central):
    assert services.import_books([("Ubik", 2, "East"), ("Kindred", 1, "East"), ("Beloved", 1, "Central")]) == 3
    assert Branch.objects.count() == 2
    assert sorted(Book.objects.filter(branch__name="East").values_list("title", flat=True)) == ["Kindred", "Ubik"]


@pytest.mark.django_db(transaction=True)
def test_import_books_keeps_nothing_when_a_row_fails(central):
    # transaction=True: no test transaction around this one, so what commits really stays.
    with pytest.raises(IntegrityError):
        services.import_books([("Ubik", 2, "East"), ("Dune", 1, "East"), ("Kindred", 1, "North")])
    assert sorted(Book.objects.values_list("title", flat=True)) == ["Dune", "Emma"]
    assert list(Branch.objects.values_list("name", flat=True)) == ["Central"]


def test_import_titles_skips_duplicates_in_savepoints(central):
    added, skipped = services.import_titles(["Ubik", "Dune", "Kindred", "Emma"], central)
    assert (added, skipped) == (["Ubik", "Kindred"], ["Dune", "Emma"])
    assert Book.objects.count() == 4


def test_record_loan_acts_only_after_the_commit(central, django_capture_on_commit_callbacks):
    dune = Book.objects.get(title="Dune")
    assert services.branch_stock(central.pk) == 3
    told = []
    with django_capture_on_commit_callbacks() as callbacks:
        services.record_loan(dune.pk, "ann", lambda reader, title: told.append((reader, title)))
        assert told == []
        assert cache.get(branch_key(central.pk)) == 3
    assert len(callbacks) == 2
    for callback in callbacks:
        callback()
    assert told == [("ann", "Dune")]
    assert cache.get(branch_key(central.pk)) is None
    assert services.branch_stock(central.pk) == 2
    assert Loan.objects.get().reader == "ann"


def test_a_failed_loan_changes_nothing(central, django_capture_on_commit_callbacks):
    emma = Book.objects.get(title="Emma")
    told = []
    with django_capture_on_commit_callbacks(execute=True):
        services.record_loan(emma.pk, "ann", lambda reader, title: told.append(reader))
    assert told == ["ann"]
    services.branch_stock(central.pk)
    with django_capture_on_commit_callbacks(execute=True) as callbacks, pytest.raises(NoCopies):
        services.record_loan(emma.pk, "ben", lambda reader, title: told.append(reader))
    assert callbacks == []
    assert told == ["ann"]
    assert Loan.objects.count() == 1
    assert cache.get(branch_key(central.pk)) == 2
