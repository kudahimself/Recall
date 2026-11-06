import pytest

from desk.models import Book

pytestmark = [pytest.mark.django_db, pytest.mark.urls("desk.urls")]


@pytest.fixture
def dune():
    return Book.objects.create(title="Dune", on_loan=True)


@pytest.fixture(autouse=True)
def others():
    Book.objects.create(title="Emma")
    Book.objects.create(title="Dune Messiah")


def test_book_detail_returns_json(client, dune):
    response = client.get(f"/books/{dune.pk}/")
    assert response.status_code == 200
    assert response["Content-Type"] == "application/json"
    assert response.json() == {"id": dune.pk, "title": "Dune", "on_loan": True}


def test_a_missing_book_is_a_404_not_a_500(client):
    assert client.get("/books/999/").status_code == 404
    assert client.get("/books/999/return/").status_code == 404


def test_search_reads_the_query_string(client, dune):
    response = client.get("/books/", {"q": "  dUNE "})
    assert response.json() == {"q": "dUNE", "titles": ["Dune", "Dune Messiah"]}


def test_search_without_q_lists_everything(client, dune):
    assert client.get("/books/").json() == {"q": "", "titles": ["Dune", "Dune Messiah", "Emma"]}


def test_return_get_renders_the_confirm_page(client, dune):
    response = client.get(f"/books/{dune.pk}/return/")
    assert response.status_code == 200
    assert [t.name for t in response.templates] == ["desk/return.html"]
    assert response.context["book"] == dune
    assert b"Return Dune?" in response.content
    dune.refresh_from_db()
    assert dune.on_loan is True


def test_return_post_saves_and_redirects(client, dune):
    response = client.post(f"/books/{dune.pk}/return/")
    assert response.status_code == 302
    assert response["Location"] == f"/books/{dune.pk}/"
    dune.refresh_from_db()
    assert dune.on_loan is False


def test_add_note_reads_the_posted_field(client, dune):
    response = client.post(f"/books/{dune.pk}/note/", {"note": "signed copy"})
    assert response.status_code == 201
    assert response.content == b"saved signed copy"
    dune.refresh_from_db()
    assert dune.note == "signed copy"


def test_add_note_rejects_a_missing_or_blank_note(client, dune):
    for data in ({}, {"note": "   "}):
        response = client.post(f"/books/{dune.pk}/note/", data)
        assert response.status_code == 400
        assert response.content == b"note is required"
    dune.refresh_from_db()
    assert dune.note == ""
