"""Forms Mastery: reference solution."""
from django import forms
from django.core.exceptions import ValidationError
from django.core.validators import FileExtensionValidator

from suggestions.models import Suggestion


class SuggestionForm(forms.ModelForm):
    isbn = forms.CharField(label="ISBN", max_length=17)
    sample = forms.FileField(required=False, validators=[FileExtensionValidator(["pdf"])])

    class Meta:
        model = Suggestion
        fields = ["title", "isbn", "reason", "tags"]

    def clean_isbn(self):
        isbn = self.cleaned_data["isbn"].replace("-", "").replace(" ", "")
        if len(isbn) != 13 or not isbn.isdigit():
            raise ValidationError("An ISBN has 13 digits.")
        return isbn

    def clean(self):
        cleaned = super().clean()
        tags = cleaned.get("tags") or []
        if any(tag.name == "rare" for tag in tags) and not cleaned.get("reason"):
            self.add_error("reason", "Say why the library needs a rare book.")
        return cleaned
