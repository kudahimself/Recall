"""Forms Mastery: practise a ModelForm with an explicit field list, a field hook,
clean() with add_error(), and a file field.

Write SuggestionForm so the tests in test_suggestion_forms.py pass.
Run them from the exercise folder with: pytest
"""
from django import forms
from django.core.exceptions import ValidationError
from django.core.validators import FileExtensionValidator

from suggestions.models import Suggestion


class SuggestionForm(forms.ModelForm):
    """A reader suggesting a book for the library to buy.

    TODO:
    - Built from Suggestion, with only the fields a reader may set: title, isbn, reason
      and tags, listed by name. Never suggested_by or approved, which the server sets.
    - sample, an extra optional file field that is not on the model: a sample chapter,
      accepted only as a .pdf.
    - isbn, declared on the form as text of up to 17 characters, so a typed ISBN with its
      hyphens and spaces gets past the field's own length check to clean_isbn().
    - clean_isbn(): drop hyphens and spaces, then refuse anything but 13 digits with
      "An ISBN has 13 digits."; return the cleaned ISBN.
    - clean(): a suggestion tagged "rare" needs a reason, or the reason field gets
      "Say why the library needs a rare book."
    """
