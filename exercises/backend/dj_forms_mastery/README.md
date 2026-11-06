# Book suggestions

Topic: Forms Mastery (deep revisit) (Backend, Django Advanced & Deployment).
Time: about 25 minutes.

## Task

Readers suggest books for the library to buy.
The `Tag` and `Suggestion` models and the URLconf (`suggestions/urls.py`) are written for you.

In `suggestions/forms.py`, write `SuggestionForm`, a `ModelForm` of `Suggestion`:

- `Meta.fields` lists by name only what a reader may set: `title`, `isbn`, `reason` and `tags`.
  `suggested_by` and `approved` are the server's to set, so they must not be fields, even when someone posts them.
- `sample`, an extra optional file field that is not on the model: a sample chapter, accepted only as a `.pdf` (`FileExtensionValidator`).
- `isbn` declared on the form as text of up to 17 characters, and a `clean_isbn()` that drops hyphens and spaces, refuses anything but 13 digits with `"An ISBN has 13 digits."` and returns the cleaned ISBN.
  The model keeps 13 characters, and a field's own checks run before its hook, so without the wider form field `978-0-441-01359-3` would fail on its length before `clean_isbn()` ever saw it.
- `clean()`: a suggestion tagged `rare` needs a reason, or the `reason` field gets `"Say why the library needs a rare book."` through `add_error()`.

In `suggestions/views.py`, write `suggest(request)`, for signed-in readers (`login_required`) and POST only (`require_POST`):

- Bind the form to the posted fields and the uploaded files.
- Invalid: answer `{"errors": {field: [messages]}}` with status 400.
- Valid: save with `commit=False`, set `suggested_by` to the signed-in reader, save, then save the tags, and answer `{"id", "title", "tags": [names, alphabetical], "sample": <file name or None>}` with status 201.

## Examples

```python
form = SuggestionForm({"title": "Dune", "isbn": "978-0-441-01359-3"})
form.is_valid(), form.cleaned_data["isbn"]     # (True, "9780441013593")
# once Dune is stored, the same ISBN typed with hyphens fails the model's unique check:
form.errors["isbn"]                            # ["Suggestion with this ISBN already exists."]
```

```text
POST /suggest/  title=Kindred isbn=978-0-8070-8305-8 tags=... reason=...  201  {"id": 1, "title": "Kindred", "tags": ["rare", "sci-fi"], "sample": null}
POST /suggest/  title=Dune isbn=123                                      400  {"errors": {"isbn": ["An ISBN has 13 digits."]}}
POST /suggest/  ... sample=chapter.txt                                   400  {"errors": {"sample": [...]}}
GET  /suggest/                                                           405
```

`form.errors.get_json_data()` gives each field's errors as dicts with a `"message"`.

Watch for the lesson's pitfall: after `save(commit=False)`, the many-to-many field is held back, so `obj.save()` stores the row and silently drops the tags.
Call `form.save_m2m()` after `obj.save()`.
And read fields in `clean()` with `.get()`: a field that failed its own checks is missing from `cleaned_data`.

## Run the tests

```bash
cd exercises/backend/dj_forms_mastery
pytest
```

`conftest.py` sets Django up for you, on a database that lives in memory for the test run; leave it as it is.
The upload tests send small files through Django's test client, and nothing is written to disk.
Every test fails until you write the form and the view.
When they all pass, tick the exercise done in Recall under Progress, Topics.
