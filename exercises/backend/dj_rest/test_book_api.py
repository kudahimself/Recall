import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

from book_api.models import Book
from book_api.serializers import BookSerializer

pytestmark = [pytest.mark.django_db, pytest.mark.urls("book_api.urls")]


@pytest.fixture
def api():
    return APIClient()


@pytest.fixture
def clerk_api():
    client = APIClient()
    client.force_authenticate(get_user_model().objects.create_user("clerk"))
    return client


@pytest.fixture
def dune():
    return Book.objects.create(title="Dune", pages=412, on_loan=True)


@pytest.fixture
def emma():
    return Book.objects.create(title="Emma", pages=474)


def test_the_serializer_turns_rows_into_plain_data(dune, emma):
    assert BookSerializer(dune).data == {"id": dune.pk, "title": "Dune", "pages": 412, "on_loan": True}
    assert [b["title"] for b in BookSerializer(Book.objects.order_by("title"), many=True).data] == ["Dune", "Emma"]


def test_the_serializer_validates_incoming_data():
    good = BookSerializer(data={"title": "Ubik", "pages": 202})
    assert good.is_valid(), good.errors
    book = good.save()
    assert Book.objects.get(pk=book.pk).title == "Ubik"
    bad = BookSerializer(data={"pages": -1})
    assert not bad.is_valid()
    assert sorted(bad.errors) == ["pages", "title"]


def test_get_lists_the_books_in_title_order(api, emma, dune):
    response = api.get("/books/")
    assert response.status_code == 200
    assert [b["title"] for b in response.json()] == ["Dune", "Emma"]


def test_post_saves_a_valid_book(api):
    response = api.post("/books/", {"title": "Ubik", "pages": 202}, format="json")
    assert response.status_code == 201
    assert response.json() == {"id": Book.objects.get().pk, "title": "Ubik", "pages": 202, "on_loan": False}


def test_post_answers_errors_with_400(api):
    response = api.post("/books/", {"pages": 202}, format="json")
    assert response.status_code == 400
    assert response.json() == {"title": ["This field is required."]}
    assert Book.objects.count() == 0


def test_the_list_allows_only_get_and_post(api):
    assert api.put("/books/", {}, format="json").status_code == 405
    assert api.delete("/books/").status_code == 405


def test_anyone_can_read_one_book(api, dune):
    response = api.get(f"/books/{dune.pk}/")
    assert response.status_code == 200
    assert response.json()["title"] == "Dune"
    assert api.get("/books/999/").status_code == 404


def test_only_signed_in_users_change_a_book(api, clerk_api, dune):
    change = {"title": "Dune", "pages": 500, "on_loan": False}
    assert api.put(f"/books/{dune.pk}/", change, format="json").status_code == 403
    assert api.delete(f"/books/{dune.pk}/").status_code == 403
    response = clerk_api.put(f"/books/{dune.pk}/", change, format="json")
    assert response.status_code == 200
    assert response.json() == {"id": dune.pk, **change}
    assert clerk_api.put(f"/books/{dune.pk}/", {"title": ""}, format="json").status_code == 400
    assert clerk_api.delete(f"/books/{dune.pk}/").status_code == 204
    assert not Book.objects.exists()
