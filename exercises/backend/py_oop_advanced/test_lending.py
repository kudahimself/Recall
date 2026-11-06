import pytest

from lending import Book, Dvd, Lendable, ReferenceBook


def test_lendable_cannot_be_created():
    with pytest.raises(TypeError):
        Lendable("Dune")


def test_a_subclass_must_override_loan_days():
    class Magazine(Lendable):
        pass

    with pytest.raises(TypeError):
        Magazine("Wired")


def test_book_runs_the_parent_setup():
    book = Book("Dune", 600)
    assert book.title == "Dune"
    assert book.pages == 600
    assert book.fine_per_day == 20
    assert Book("Emma", 300, fine_per_day=10).fine_per_day == 10


def test_loan_days_per_kind():
    assert Book("Dune", 600).loan_days() == 21
    assert Book("Emma", 500).loan_days() == 14
    assert Dvd("Alien").loan_days() == 7
    assert ReferenceBook("Atlas", 900).loan_days() == 2


def test_due_label_uses_each_kinds_loan_days():
    assert Book("Dune", 600).due_label() == "Dune: due in 21 days"
    assert Dvd("Alien").due_label() == "Alien: due in 7 days"


def test_reference_book_extends_the_parent_label():
    assert ReferenceBook("Atlas", 300).due_label() == "Atlas: due in 2 days (library use only)"
    assert isinstance(ReferenceBook("Atlas", 300), Book)


def test_fine_per_day_is_a_validating_property():
    assert isinstance(Lendable.__dict__.get("fine_per_day"), property)
    book = Book("Dune", 600)
    book.fine_per_day = 5
    assert book.fine_per_day == 5
    with pytest.raises(ValueError):
        book.fine_per_day = -1
    assert book.fine_per_day == 5
    with pytest.raises(ValueError):
        Dvd("Alien", fine_per_day=-5)
