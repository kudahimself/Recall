import pytest
from django.contrib.auth import get_user_model
from django.core.cache import cache
from rest_framework.test import APIClient
from rest_framework.throttling import ScopedRateThrottle

from loan_api.models import Author, Book, Tag

pytestmark = [pytest.mark.django_db, pytest.mark.urls("loan_api.urls")]


@pytest.fixture(autouse=True)
def api_settings(settings, monkeypatch):
    """Switch on the API's exception handler and give the "books" scope a generous rate."""
    settings.REST_FRAMEWORK = {"EXCEPTION_HANDLER": "loan_api.errors.api_exception_handler"}
    # A throttle class reads its rates once, when DRF is imported, so set them on the class.
    monkeypatch.setattr(ScopedRateThrottle, "THROTTLE_RATES", {"books": "100/min"})
    cache.clear()
    yield
    cache.clear()


@pytest.fixture
def api():
    return APIClient()


@pytest.fixture
def clerk_api():
    client = APIClient()
    client.force_authenticate(get_user_model().objects.create_user("clerk"))
    return client


@pytest.fixture
def shelf():
    herbert, dick = Author.objects.create(name="Frank Herbert"), Author.objects.create(name="Philip K. Dick")
    scifi, classic = Tag.objects.create(name="sci-fi"), Tag.objects.create(name="classic")
    dune = Book.objects.create(title="Dune", copies=2, author=herbert)
    dune.tags.set([scifi, classic])
    Book.objects.create(title="Ubik", copies=0, author=dick).tags.set([scifi])
    Book.objects.create(title="Children of Dune", author=herbert)
    return {"herbert": herbert, "dick": dick, "dune": dune}


def test_list_nests_the_author_in_two_queries(api, shelf, django_assert_num_queries):
    with django_assert_num_queries(2):
        response = api.get("/books/")
    assert response.status_code == 200
    assert [b["title"] for b in response.json()] == ["Children of Dune", "Dune", "Ubik"]
    dune = response.json()[1]
    assert dune == {
        "id": shelf["dune"].pk, "title": "Dune", "copies": 2,
        "author": {"id": shelf["herbert"].pk, "name": "Frank Herbert"}, "tags": ["classic", "sci-fi"],
    }


def test_create_writes_the_author_by_id_and_tags_by_name(clerk_api, shelf):
    response = clerk_api.post(
        "/books/", {"title": "Valis", "copies": 1, "author_id": shelf["dick"].pk, "tags": ["sci-fi"]}, format="json",
    )
    assert response.status_code == 201, response.content
    body = response.json()
    assert body["author"] == {"id": shelf["dick"].pk, "name": "Philip K. Dick"}
    assert body["tags"] == ["sci-fi"] and "author_id" not in body
    assert Book.objects.get(title="Valis").author == shelf["dick"]


def test_put_replaces_and_patch_changes_only_what_was_sent(clerk_api, shelf):
    url = f"/books/{shelf['dune'].pk}/"
    response = clerk_api.put(url, {"copies": 5}, format="json")
    assert response.status_code == 400
    assert sorted(response.json()["error"]["detail"]) == ["author_id", "title"]
    response = clerk_api.patch(url, {"copies": 5}, format="json")
    assert response.status_code == 200
    assert response.json()["title"] == "Dune" and response.json()["copies"] == 5
    assert Book.objects.count() == 3
    response = clerk_api.put(url, {"title": "Dune", "copies": 4, "author_id": shelf["herbert"].pk}, format="json")
    assert response.status_code == 200
    assert response.json()["tags"] == ["classic", "sci-fi"]


def test_delete_answers_204(clerk_api, shelf):
    response = clerk_api.delete(f"/books/{shelf['dune'].pk}/")
    assert response.status_code == 204
    assert not Book.objects.filter(title="Dune").exists()


def test_errors_share_one_shape(api, clerk_api, shelf):
    response = api.post("/books/", {"title": "Valis"}, format="json")
    assert response.status_code == 403
    assert response.json() == {"error": {"status": 403, "detail": {"detail": "Authentication credentials were not provided."}}}
    response = api.get("/books/999/")
    assert response.status_code == 404
    assert response.json() == {"error": {"status": 404, "detail": {"detail": "No Book matches the given query."}}}
    response = clerk_api.post("/books/", {"title": ""}, format="json")
    assert response.json()["error"]["status"] == 400
    assert sorted(response.json()["error"]["detail"]) == ["author_id", "title"]


def test_lend_takes_a_copy_or_answers_409(clerk_api, api, shelf):
    url = f"/books/{shelf['dune'].pk}/lend/"
    assert api.post(url).status_code == 403
    assert clerk_api.post(url).json()["copies"] == 1
    assert clerk_api.post(url).json()["copies"] == 0
    response = clerk_api.post(url)
    assert response.status_code == 409
    assert response.json() == {"error": {"status": 409, "detail": {"detail": "No copy is free."}}}
    assert clerk_api.get(url).status_code == 405


def test_the_books_scope_is_throttled(api, shelf, monkeypatch):
    monkeypatch.setattr(ScopedRateThrottle, "THROTTLE_RATES", {"books": "3/min"})
    assert [api.get("/books/").status_code for _ in range(3)] == [200, 200, 200]
    response = api.get(f"/books/{shelf['dune'].pk}/")
    assert response.status_code == 429
    assert response.json()["error"]["status"] == 429
    assert "Retry-After" in response
