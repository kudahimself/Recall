import pytest

from stacks import views
from stacks.models import Book

pytestmark = [pytest.mark.django_db, pytest.mark.urls("stacks.urls")]


@pytest.fixture(autouse=True)
def books():
    for title, on_loan in [("Ubik", False), ("Dune", True), ("Emma", False), ("Kindred", False), ("Beloved", True)]:
        Book.objects.create(title=title, on_loan=on_loan, pages=len(title) * 100)


def test_shelf_list_pages_through_the_books_on_the_shelf(client):
    response = client.get("/shelf/")
    assert response.status_code == 200
    assert "stacks/book_list.html" in response.template_name
    assert [b.title for b in response.context["books"]] == ["Emma", "Kindred"]
    assert response.context["paginator"].num_pages == 2
    page2 = client.get("/shelf/", {"page": "2"}).context
    assert [b.title for b in page2["books"]] == ["Ubik"]


def test_shelf_list_keeps_the_parent_context(client):
    context = client.get("/shelf/").context
    assert context["on_loan_count"] == 2
    assert context["page_obj"].number == 1
    assert context["is_paginated"] is True
    assert b"(2 out on loan)" in client.get("/shelf/").content


def test_book_detail_uses_its_template(client):
    dune = Book.objects.get(title="Dune")
    response = client.get(f"/books/{dune.pk}/")
    assert response.status_code == 200
    assert response.template_name == ["stacks/book_page.html"]
    assert response.context["book"] == dune
    assert client.get("/books/999/").status_code == 404


def test_renew_view_answers_post_only(client):
    dune = Book.objects.get(title="Dune")
    assert client.post(f"/books/{dune.pk}/renew/").json() == {"title": "Dune", "renewals": 1}
    assert client.post(f"/books/{dune.pk}/renew/").json() == {"title": "Dune", "renewals": 2}
    assert client.get(f"/books/{dune.pk}/renew/").status_code == 405
    assert client.post("/books/999/renew/").status_code == 404
    assert issubclass(views.RenewView, views.View)


def test_loaned_list_sends_visitors_to_login(client):
    response = client.get("/loaned/")
    assert response.status_code == 302
    assert response["Location"] == "/login/?next=/loaned/"


def test_loaned_list_shows_staff_the_books_on_loan(client, django_user_model):
    client.force_login(django_user_model.objects.create_user("clerk"))
    response = client.get("/loaned/")
    assert response.status_code == 200
    assert response.template_name[0] == "stacks/loaned.html"
    assert [b.title for b in response.context["object_list"]] == ["Beloved", "Dune"]
