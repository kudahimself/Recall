"""Forms & Validation: reference solution."""
from django import forms

from holds.models import Book


class HoldForm(forms.Form):
    email = forms.EmailField()
    copies = forms.IntegerField(min_value=1, max_value=3)
    branch = forms.CharField(max_length=30)
    note = forms.CharField(max_length=200, required=False)
    deliver = forms.BooleanField(required=False)

    def clean_email(self):
        return self.cleaned_data["email"].lower()

    def clean(self):
        cleaned = super().clean()
        if cleaned.get("deliver") and not cleaned.get("note"):
            raise forms.ValidationError("A delivery needs a note with the address.")
        return cleaned


class BookForm(forms.ModelForm):
    class Meta:
        model = Book
        fields = ["title", "pages"]

    def clean_title(self):
        title = self.cleaned_data["title"]
        if title.lower() == "untitled":
            raise forms.ValidationError("Give the book a real title.")
        return title.title()
