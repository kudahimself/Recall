import pytest
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile

from suggestions.forms import SuggestionForm
from suggestions.models import Suggestion, Tag

pytestmark = [pytest.mark.django_db, pytest.mark.urls("suggestions.urls")]

User = get_user_model()
DUNE_ISBN = "9780441013593"


@pytest.fixture
def tags():
    return {name: Tag.objects.create(name=name) for name in ("rare", "sci-fi", "poetry")}


@pytest.fixture
def ann():
    return User.objects.create_user("ann")


def form_for(**data):
    return SuggestionForm({"title": "Dune", "isbn": DUNE_ISBN, **data})


def test_the_form_lists_its_fields_explicitly():
    assert list(SuggestionForm().fields) == ["title", "isbn", "reason", "tags", "sample"]
    assert SuggestionForm._meta.fields == ["title", "isbn", "reason", "tags"]


def test_clean_isbn_strips_and_checks_the_digits():
    form = form_for(isbn="978-0-441 01359-3")
    assert form.is_valid(), form.errors
    assert form.cleaned_data["isbn"] == DUNE_ISBN
    form = form_for(isbn="978-0-441")
    assert not form.is_valid()
    assert form.errors["isbn"] == ["An ISBN has 13 digits."]


def test_the_model_unique_check_runs_on_the_cleaned_isbn(ann):
    Suggestion.objects.create(title="Dune", isbn=DUNE_ISBN, suggested_by=ann)
    form = form_for(isbn="978-0441013593")
    assert not form.is_valid()
    assert form.errors["isbn"] == ["Suggestion with this ISBN already exists."]


def test_clean_pins_the_rare_rule_to_the_reason_field(tags):
    form = form_for(tags=[tags["rare"].pk, tags["poetry"].pk])
    assert not form.is_valid()
    assert form.errors == {"reason": ["Say why the library needs a rare book."]}
    assert form_for(tags=[tags["rare"].pk], reason="A signed first edition.").is_valid()
    assert form_for(tags=[tags["poetry"].pk]).is_valid()


def test_clean_copes_when_a_field_already_failed(tags):
    form = form_for(isbn="nope", tags=[tags["rare"].pk])
    assert not form.is_valid()
    assert sorted(form.errors) == ["isbn", "reason"]
    form = form_for(tags=["999"])
    assert not form.is_valid()
    assert sorted(form.errors) == ["tags"]


def test_suggest_saves_the_reader_and_the_tags(client, ann, tags):
    client.force_login(ann)
    response = client.post("/suggest/", {
        "title": "Kindred", "isbn": "978-0-8070-8305-8",
        "tags": [tags["sci-fi"].pk, tags["rare"].pk], "reason": "Book club pick.",
        "approved": "on", "suggested_by": User.objects.create_user("ben").pk,
    })
    assert response.status_code == 201, response.content
    saved = Suggestion.objects.get()
    assert response.json() == {"id": saved.pk, "title": "Kindred", "tags": ["rare", "sci-fi"], "sample": None}
    assert saved.isbn == "9780807083058"
    assert saved.suggested_by == ann
    assert saved.approved is False
    assert sorted(t.name for t in saved.tags.all()) == ["rare", "sci-fi"]


def test_suggest_answers_400_with_the_errors(client, ann):
    client.force_login(ann)
    response = client.post("/suggest/", {"title": "Dune", "isbn": "123"})
    assert response.status_code == 400
    assert response.json() == {"errors": {"isbn": ["An ISBN has 13 digits."]}}
    assert Suggestion.objects.count() == 0


def test_suggest_needs_a_signed_in_post(client, ann):
    response = client.post("/suggest/", {"title": "Dune", "isbn": DUNE_ISBN})
    assert response.status_code == 302
    assert response["Location"] == "/login/?next=/suggest/"
    client.force_login(ann)
    assert client.get("/suggest/").status_code == 405


def test_suggest_reads_the_uploaded_sample(client, ann):
    client.force_login(ann)
    pdf = SimpleUploadedFile("chapter.pdf", b"%PDF-1.4 sample", content_type="application/pdf")
    response = client.post("/suggest/", {"title": "Dune", "isbn": DUNE_ISBN, "sample": pdf})
    assert response.status_code == 201, response.content
    assert response.json()["sample"] == "chapter.pdf"
    notes = SimpleUploadedFile("chapter.txt", b"plain text", content_type="text/plain")
    response = client.post("/suggest/", {"title": "Emma", "isbn": "9780141439587", "sample": notes})
    assert response.status_code == 400
    assert list(response.json()["errors"]) == ["sample"]
