import uuid

import pytest
from django.urls import Resolver404, resolve, reverse

from borrowing import views

pytestmark = pytest.mark.urls("librarysite.urls")

CARD = uuid.UUID("12345678-1234-5678-1234-567812345678")


def test_reverse_builds_each_path_from_its_name():
    assert reverse("lending:index") == "/lending/"
    assert reverse("lending:book", args=[7]) == "/lending/7/"
    assert reverse("lending:shelf", kwargs={"genre": "sci-fi"}) == "/lending/sci-fi/"
    assert reverse("lending:member", args=[CARD]) == f"/lending/members/{CARD}/"
    assert reverse("lending:archive", kwargs={"year": "1999"}) == "/lending/archive/1999/"


def test_digits_reach_book_as_an_int():
    match = resolve("/lending/42/")
    assert match.func is views.book
    assert match.kwargs == {"pk": 42}
    assert match.view_name == "lending:book"


def test_a_slug_falls_through_to_shelf():
    match = resolve("/lending/sci-fi/")
    assert match.func is views.shelf
    assert match.kwargs == {"genre": "sci-fi"}


def test_member_cards_are_uuids():
    match = resolve(f"/lending/members/{CARD}/")
    assert match.func is views.member
    assert match.kwargs == {"card": CARD}
    with pytest.raises(Resolver404):
        resolve("/lending/members/not-a-card/")


def test_archive_takes_exactly_four_digits():
    assert resolve("/lending/archive/1999/").kwargs == {"year": "1999"}
    assert resolve("/lending/archive/1999/").func is views.archive
    for bad in ("/lending/archive/99/", "/lending/archive/19999/"):
        with pytest.raises(Resolver404):
            resolve(bad)


def test_requests_reach_the_views_through_the_project(client):
    assert client.get("/lending/").content == b"index"
    assert client.get("/lending/7/").content == b"book 7"
    assert client.get("/lending/sci-fi/").content == b"shelf 'sci-fi'"
    assert client.get("/7/").status_code == 404
