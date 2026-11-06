import datetime

import pytest
from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.test import RequestFactory

from shelving import views
from shelving.models import Book, Shelf

pytestmark = [pytest.mark.django_db, pytest.mark.urls("shelving.urls")]

User = get_user_model()


@pytest.fixture(autouse=True)
def empty_cache():
    cache.clear()
    yield
    cache.clear()


@pytest.fixture
def scifi():
    shelf = Shelf.objects.create(code="sf", name="Science fiction")
    for day, title in enumerate(["Ubik", "Dune", "Kindred", "Solaris"], start=1):
        book = Book.objects.create(shelf=shelf, title=title)
        Book.objects.filter(pk=book.pk).update(added=datetime.datetime(2026, 3, day, 9, tzinfo=datetime.timezone.utc))
    return shelf


@pytest.fixture
def librarian():
    return User.objects.create_user("lib", is_staff=True)


def test_get_lists_the_shelf_as_a_json_list(client, scifi):
    response = client.get("/shelves/sf/")
    assert response.status_code == 200
    assert response.json() == ["Dune", "Kindred", "Solaris", "Ubik"]
    assert response["X-Shelf"] == "sf"


def test_dispatch_handles_every_verb(client, scifi):
    response = client.delete("/shelves/sf/")
    assert response.status_code == 405
    assert response["Allow"] == "GET, POST"
    assert response["X-Shelf"] == "sf"
    assert client.get("/shelves/nope/").status_code == 404
    assert client.post("/shelves/nope/", {"title": "Emma"}).status_code == 404


def test_only_staff_may_add_and_a_post_redirects(client, scifi, librarian):
    assert client.post("/shelves/sf/", {"title": "Emma"}).status_code == 403
    client.force_login(User.objects.create_user("ann"))
    assert client.post("/shelves/sf/", {"title": "Emma"}).status_code == 403
    client.force_login(librarian)
    response = client.post("/shelves/sf/", {"title": "Emma"})
    assert response.status_code == 302
    assert response["Location"] == "/shelves/sf/"
    assert response["X-Shelf"] == "sf"
    assert "Emma" in client.get(response["Location"]).json()


def test_new_arrivals_are_cached_for_everyone(client, scifi, librarian):
    assert client.get("/new/").json() == ["Solaris", "Kindred", "Dune"]
    Book.objects.create(shelf=scifi, title="Emma")
    response = client.get("/new/")
    assert response.json() == ["Solaris", "Kindred", "Dune"]
    assert "max-age=60" in response["Cache-Control"]
    cache.clear()
    assert client.get("/new/").json() == ["Emma", "Solaris", "Kindred"]


def test_my_holds_is_personal_and_needs_a_login(client, scifi):
    ann, ben = User.objects.create_user("ann"), User.objects.create_user("ben")
    scifi.books.filter(title__in=["Ubik", "Dune"]).update(held_for=ann)
    scifi.books.filter(title="Kindred").update(held_for=ben)
    response = client.get("/my-holds/")
    assert response.status_code == 302
    assert response["Location"] == "/login/?next=/my-holds/"
    client.force_login(ann)
    assert client.get("/my-holds/").json() == {"reader": "ann", "titles": ["Dune", "Ubik"]}
    client.force_login(ben)
    assert client.get("/my-holds/").json() == {"reader": "ben", "titles": ["Kindred"]}


def test_export_streams_csv_without_querying_early(scifi, django_assert_num_queries):
    request = RequestFactory().get("/shelves/sf/export/")
    with django_assert_num_queries(1):
        response = views.export_shelf(request, code="sf")
    assert response.streaming
    assert response["Content-Type"] == "text/csv"
    assert response["Content-Disposition"] == 'attachment; filename="sf.csv"'
    with django_assert_num_queries(1):
        body = b"".join(response.streaming_content).decode()
    assert body.splitlines() == [
        "title,added", "Dune,2026-03-02", "Kindred,2026-03-03", "Solaris,2026-03-04", "Ubik,2026-03-01",
    ]


def test_export_answers_404_for_an_unknown_shelf(client, scifi):
    assert client.get("/shelves/nope/export/").status_code == 404
    assert client.get("/shelves/sf/export/").status_code == 200
