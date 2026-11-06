"""Forms & Validation: practise Form, ModelForm, field checks and clean hooks.

Write the two forms below so the tests in test_hold_forms.py pass.
Run them from the exercise folder with: pytest
"""
from django import forms

from holds.models import Book


class HoldForm(forms.Form):
    """A request to hold a book for a member.

    TODO:
    - email: an email address, stored in lower case (clean_email);
    - copies: a whole number from 1 to 3;
    - branch: text of up to 30 characters;
    - note: optional text of up to 200 characters;
    - deliver: an optional checkbox;
    - clean(): asking for delivery without a note fails with the form-wide error
      "A delivery needs a note with the address."
    """


class BookForm(forms.ModelForm):
    """Add a book to the catalogue from its title and page count.

    TODO:
    - build the fields from Book, only title and pages;
    - clean_title(): refuse "untitled" in any case with "Give the book a real title.",
      and store the title in title case ("dune messiah" -> "Dune Messiah").
    """
