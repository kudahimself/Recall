import pytest
from django.db import models
from django.db.models import ProtectedError

from catalog.models import Author, Book, Branch, Tag

pytestmark = pytest.mark.django_db


@pytest.fixture
def herbert():
    return Author.objects.create(full_name="Frank Herbert")


@pytest.fixture
def central():
    return Branch.objects.create(name="Central")


def test_field_types():
    def field(model, name):
        return model._meta.get_field(name)

    assert isinstance(field(Author, "full_name"), models.CharField)
    assert field(Author, "full_name").max_length == 100
    assert field(Branch, "name").max_length == 50
    assert field(Tag, "name").max_length == 30 and field(Tag, "name").unique
    assert field(Book, "title").max_length == 200
    assert isinstance(field(Book, "summary"), models.TextField) and field(Book, "summary").blank
    assert isinstance(field(Book, "on_loan"), models.BooleanField)
    assert isinstance(field(Book, "added_at"), models.DateTimeField) and field(Book, "added_at").auto_now_add


def test_a_new_book_has_defaults_and_a_timestamp(herbert, central):
    book = Book.objects.create(author=herbert, branch=central, title="Dune")
    assert book.on_loan is False
    assert book.summary == ""
    assert book.added_at is not None


def test_the_foreign_key_sits_on_the_book(herbert, central):
    assert isinstance(Book._meta.get_field("author"), models.ForeignKey)
    Book.objects.create(author=herbert, branch=central, title="Dune")
    Book.objects.create(author=herbert, branch=central, title="Children of Dune")
    assert herbert.books.count() == 2
    assert central.books.count() == 2


def test_deleting_an_author_deletes_their_books(herbert, central):
    Book.objects.create(author=herbert, branch=central, title="Dune")
    herbert.delete()
    assert Book.objects.count() == 0


def test_a_branch_with_books_cannot_be_deleted(herbert, central):
    Book.objects.create(author=herbert, branch=central, title="Dune")
    with pytest.raises(ProtectedError):
        central.delete()
    Branch.objects.create(name="Annex").delete()


def test_tags_link_many_books_to_many_tags(herbert, central):
    dune = Book.objects.create(author=herbert, branch=central, title="Dune")
    emma = Book.objects.create(author=herbert, branch=central, title="Emma")
    scifi = Tag.objects.create(name="sci-fi")
    classic = Tag.objects.create(name="classic")
    dune.tags.add(scifi, classic)
    emma.tags.add(classic)
    assert sorted(t.name for t in dune.tags.all()) == ["classic", "sci-fi"]
    assert classic.books.count() == 2
    assert emma.tags.count() == 1


def test_rows_print_through_str(herbert, central):
    book = Book.objects.create(author=herbert, branch=central, title="Dune")
    assert str(herbert) == "Frank Herbert"
    assert str(central) == "Central"
    assert str(book) == "Dune by Frank Herbert"


def test_books_come_back_in_title_order(herbert, central):
    for title in ["Emma", "Dune", "Ubik"]:
        Book.objects.create(author=herbert, branch=central, title=title)
    assert [b.title for b in Book.objects.all()] == ["Dune", "Emma", "Ubik"]
