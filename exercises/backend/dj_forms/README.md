# Hold request forms

Topic: Forms & Validation (Backend, Django).
Time: about 20 minutes.

## Task

Write two forms in `holds/forms.py`.

`HoldForm`, a plain `Form` for a member asking the library to hold a book:

- `email`, an email address, stored in lower case by a `clean_email()` hook;
- `copies`, a whole number from 1 to 3;
- `branch`, text of up to 30 characters;
- `note`, optional text of up to 200 characters, and `deliver`, an optional checkbox;
- a `clean()` hook that fails with the form-wide error `"A delivery needs a note with the address."` when `deliver` is ticked and `note` is empty.

`BookForm`, a `ModelForm` on the `Book` model in `holds/models.py`:

- only the `title` and `pages` fields, built from the model;
- a `clean_title()` hook that refuses `untitled`, in any case, with `"Give the book a real title."`, and stores the title in title case.

## Examples

```python
form = HoldForm({"email": "Ann@Example.COM", "copies": "2", "branch": "Central"})
form.is_valid()        # True
form.cleaned_data      # {"email": "ann@example.com", "copies": 2, "branch": "Central",
                       #  "note": "", "deliver": False}

form = HoldForm({"email": "ann@example.com", "copies": "4", "branch": "Central", "deliver": "on"})
form.is_valid()        # False
sorted(form.errors)    # ["__all__", "copies"]

BookForm({"title": "  dune messiah ", "pages": "256"}).save().title   # "Dune Messiah"
```

Watch for the lesson's pitfall: a `clean_<field>()` hook that forgets `return` sets that field's cleaned value to `None`.
End every field hook by returning the value, changed or not, and read fields in `clean()` with `.get()`, since a field that failed its own checks is missing there.

## Run the tests

```bash
cd exercises/backend/dj_forms
pytest
```

`conftest.py` sets Django up for you, on a database that lives in memory for the test run; leave it as it is.
Every test fails until you write the forms.
When they all pass, tick the exercise done in Recall under Progress, Topics.
