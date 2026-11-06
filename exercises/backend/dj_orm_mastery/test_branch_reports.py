import pytest
from django.db import connection
from django.test.utils import CaptureQueriesContext
from django.db.models import QuerySet

from branchstats import reports
from branchstats.models import Author, Book, Branch, Tag

pytestmark = pytest.mark.django_db


@pytest.fixture
def library():
    central, east = Branch.objects.create(name="Central"), Branch.objects.create(name="East")
    herbert, austen = Author.objects.create(name="Frank Herbert"), Author.objects.create(name="Jane Austen")
    Author.objects.create(name="Ann Leckie")
    scifi, classic, desert = (Tag.objects.create(name=n) for n in ("sci-fi", "classic", "desert"))
    dune = Book.objects.create(title="Dune", author=herbert, branch=central, loans=9, summary="Spice." * 500)
    dune.tags.set([scifi, desert, classic])
    emma = Book.objects.create(title="Emma", author=austen, branch=central, loans=4)
    emma.tags.set([classic])
    Book.objects.create(title="Persuasion", author=austen, branch=central, loans=9)
    Book.objects.create(title="Children of Dune", author=herbert, branch=east, loans=2)
    Book.objects.create(title="Mansfield Park", author=austen, branch=east, loans=5)


def test_shelf_labels_in_one_query(library, django_assert_num_queries):
    with django_assert_num_queries(1):
        labels = reports.shelf_labels()
    assert labels == [
        "Children of Dune - Frank Herbert @ East",
        "Dune - Frank Herbert @ Central",
        "Emma - Jane Austen @ Central",
        "Mansfield Park - Jane Austen @ East",
        "Persuasion - Jane Austen @ Central",
    ]


def test_tag_index_in_two_queries(library, django_assert_num_queries):
    with django_assert_num_queries(2):
        index = reports.tag_index()
    assert index == {
        "Dune": ["classic", "desert", "sci-fi"],
        "Emma": ["classic"],
        "Persuasion": [],
        "Children of Dune": [],
        "Mansfield Park": [],
    }


def test_author_titles_follows_the_reverse_relation_in_two_queries(library, django_assert_num_queries):
    authors = Author.objects.order_by("name")
    with django_assert_num_queries(2):
        titles = reports.author_titles(authors)
    assert titles == {
        "Ann Leckie": [],
        "Frank Herbert": ["Children of Dune", "Dune"],
        "Jane Austen": ["Emma", "Mansfield Park", "Persuasion"],
    }
    with django_assert_num_queries(2):
        assert reports.author_titles(Author.objects.filter(name="Ann Leckie")) == {"Ann Leckie": []}


def test_catalogue_page_leaves_the_summary_out(library, django_assert_num_queries):
    page = reports.catalogue_page()
    assert isinstance(page, QuerySet)
    with django_assert_num_queries(1) as ctx:
        titles = [b.title for b in page]
    assert titles == ["Children of Dune", "Dune", "Emma", "Mansfield Park", "Persuasion"]
    sql = ctx.captured_queries[0]["sql"]
    assert '"summary"' not in sql and '"loans"' not in sql
    assert '"title"' in sql


def test_branch_ranking_shares_ranks_on_ties(library, django_assert_num_queries):
    with django_assert_num_queries(1):
        ranking = reports.branch_ranking()
    assert ranking == [
        ("Central", "Dune", 1),
        ("Central", "Persuasion", 1),
        ("Central", "Emma", 3),
        ("East", "Mansfield Park", 1),
        ("East", "Children of Dune", 2),
    ]


@pytest.fixture
def row_locks(monkeypatch):
    """Make SQLite act like PostgreSQL for select_for_update().

    SQLite has no row locks, so Django normally drops FOR UPDATE there without a word.
    Here Django believes it can lock: it refuses a lock outside a transaction, as it
    would on PostgreSQL, and marks a locking query with a /* FOR UPDATE */ comment.
    """
    monkeypatch.setattr(connection.features, "has_select_for_update", True)
    monkeypatch.setattr(connection.ops, "for_update_sql", lambda *args, **kwargs: "/* FOR UPDATE */")


@pytest.mark.django_db(transaction=True)
def test_lend_copy_locks_the_row_inside_a_transaction(row_locks):
    central = Branch.objects.create(name="Central")
    herbert = Author.objects.create(name="Frank Herbert")
    dune = Book.objects.create(title="Dune", author=herbert, branch=central, copies_free=1)
    with CaptureQueriesContext(connection) as ctx:
        assert reports.lend_copy(dune.pk) is True
    locking = [q["sql"] for q in ctx.captured_queries if "FOR UPDATE" in q["sql"]]
    assert len(locking) == 1 and '"branchstats_book"' in locking[0]
    assert reports.lend_copy(dune.pk) is False
    dune.refresh_from_db()
    assert dune.copies_free == 0
