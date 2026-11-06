import pytest

from holds.forms import BookForm, HoldForm
from holds.models import Book

GOOD = {"email": "Ann@Example.COM", "copies": "2", "branch": "Central"}


def test_a_valid_hold_has_converted_cleaned_data():
    form = HoldForm(GOOD)
    assert form.is_bound
    assert form.is_valid(), form.errors
    assert form.cleaned_data == {
        "email": "ann@example.com", "copies": 2, "branch": "Central", "note": "", "deliver": False,
    }


@pytest.mark.parametrize("copies", ["0", "4", "two"])
def test_copies_must_be_one_to_three(copies):
    form = HoldForm({**GOOD, "copies": copies})
    assert not form.is_valid()
    assert list(form.errors) == ["copies"]


def test_each_field_brings_its_own_checks():
    form = HoldForm({"email": "not-an-email", "copies": "1", "branch": "x" * 31})
    assert not form.is_valid()
    assert sorted(form.errors) == ["branch", "email"]
    assert not HoldForm({}).is_valid()
    assert sorted(HoldForm({}).errors) == ["branch", "copies", "email"]


def test_delivery_needs_a_note():
    form = HoldForm({**GOOD, "deliver": "on"})
    assert not form.is_valid()
    assert list(form.errors) == ["__all__"]
    assert form.non_field_errors() == ["A delivery needs a note with the address."]
    ok = HoldForm({**GOOD, "deliver": "on", "note": "12 Mill Lane"})
    assert ok.is_valid(), ok.errors
    assert ok.cleaned_data["deliver"] is True


def test_book_form_builds_title_and_pages_from_the_model():
    assert list(BookForm().fields) == ["title", "pages"]
    assert BookForm._meta.model is Book
    form = BookForm({"title": "Dune", "pages": "-3"})
    assert not form.is_valid()
    assert list(form.errors) == ["pages"]


def test_book_form_refuses_untitled():
    form = BookForm({"title": "  UnTitled ", "pages": "100"})
    assert not form.is_valid()
    assert form.errors["title"] == ["Give the book a real title."]


@pytest.mark.django_db
def test_book_form_saves_the_cleaned_title():
    form = BookForm({"title": "  dune messiah ", "pages": "256"})
    assert form.is_valid(), form.errors
    book = form.save()
    assert Book.objects.get(pk=book.pk).title == "Dune Messiah"
    assert book.pages == 256
