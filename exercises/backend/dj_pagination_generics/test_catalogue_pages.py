from datetime import date

import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

from catalogue_pages.models import Book, Loan

pytestmark = [pytest.mark.django_db, pytest.mark.urls("catalogue_pages.urls")]

SHELF = [("Persuasion", 2), ("Dune", 0), ("Middlemarch", 0), ("Emma", 3), ("Ivanhoe", 1)]


@pytest.fixture
def api():
    return APIClient()


@pytest.fixture
def books():
    return {title: Book.objects.create(title=title, stock=stock) for title, stock in SHELF}


def titles(body):
    return [b["title"] for b in body["results"]]


def test_the_list_comes_a_page_at_a_time_in_title_order(api, books):
    response = api.get("/books/")
    assert response.status_code == 200
    body = response.json()
    assert list(body) == ["count", "page", "pages", "next", "previous", "results"]
    assert (body["count"], body["page"], body["pages"]) == (5, 1, 3)
    assert titles(body) == ["Dune", "Emma"]
    assert body["next"] == "http://testserver/books/?page=2" and body["previous"] is None
    last = api.get("/books/", {"page": 3}).json()
    assert (last["page"], titles(last), last["next"]) == (3, ["Persuasion"], None)
    assert last["previous"] == "http://testserver/books/?page=2"
    assert api.get("/books/", {"page": 4}).status_code == 404


def test_a_client_picks_the_page_size_up_to_3(api, books):
    small = api.get("/books/", {"size": 1}).json()
    assert (small["pages"], titles(small)) == (5, ["Dune"])
    big = api.get("/books/", {"size": 10}).json()
    assert (big["pages"], titles(big)) == (2, ["Dune", "Emma", "Ivanhoe"])


def test_in_stock_yes_keeps_the_books_on_the_shelf(api, books):
    body = api.get("/books/", {"in_stock": "yes", "size": 3}).json()
    assert body["count"] == 3
    assert titles(body) == ["Emma", "Ivanhoe", "Persuasion"]
    assert api.get("/books/", {"in_stock": "no"}).json()["count"] == 5


def test_post_adds_a_book(api, books):
    response = api.post("/books/", {"title": "Valis", "stock": 2}, format="json")
    assert response.status_code == 201
    assert response.json() == {"id": Book.objects.get(title="Valis").pk, "title": "Valis", "stock": 2}
    assert api.post("/books/", {"stock": 2}, format="json").status_code == 400
    assert api.get("/books/").json()["count"] == 6


def test_the_detail_view_reads_changes_and_deletes_one_book(api, books):
    url = f"/books/{books['Emma'].pk}/"
    assert api.get(url).json() == {"id": books["Emma"].pk, "title": "Emma", "stock": 3}
    assert api.patch(url, {"stock": 7}, format="json").json()["stock"] == 7
    assert api.put(url, {"stock": 1}, format="json").status_code == 400
    assert api.put(url, {"title": "Emma", "stock": 1}, format="json").status_code == 200
    assert api.delete(url).status_code == 204
    assert api.get(url).status_code == 404
    assert api.get("/books/").json()["count"] == 4


def test_my_loans_are_mine_only_newest_first_by_cursor(api, books):
    users = get_user_model().objects
    ann, ben = users.create_user("ann"), users.create_user("ben")
    for day, title in [(3, "Dune"), (9, "Emma"), (5, "Ivanhoe")]:
        Loan.objects.create(book=books[title], reader=ann, lent_on=date(2026, 3, day))
    Loan.objects.create(book=books["Persuasion"], reader=ben, lent_on=date(2026, 3, 7))

    assert api.get("/loans/mine/").status_code == 403
    api.force_authenticate(ann)
    first = api.get("/loans/mine/").json()
    assert "count" not in first and first["previous"] is None
    assert [loan["book"] for loan in first["results"]] == ["Emma", "Ivanhoe"]
    assert first["results"][0]["lent_on"] == "2026-03-09"
    assert "cursor=" in first["next"]
    second = api.get(first["next"]).json()
    assert [loan["book"] for loan in second["results"]] == ["Dune"]
    assert second["next"] is None

    api.force_authenticate(ben)
    assert [loan["book"] for loan in api.get("/loans/mine/").json()["results"]] == ["Persuasion"]
