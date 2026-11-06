import pytest
from django.contrib import admin
from django.contrib.admin.exceptions import NotRegistered
from django.test import RequestFactory

import backoffice.admin
from backoffice.models import Book, Review

pytestmark = pytest.mark.django_db


def book_admin():
    try:
        return backoffice.admin.staff_site.get_model_admin(Book)
    except NotRegistered:
        pytest.fail("Book is not registered: use @admin.register(Book, site=staff_site) on BookAdmin")


@pytest.fixture
def staff_get(admin_user):
    """A GET request to the books changelist from a superuser, with these query parameters."""
    def make(**params):
        request = RequestFactory().get("/admin/backoffice/book/", params)
        request.user = admin_user
        return request
    return make


@pytest.fixture
def books():
    dune = Book.objects.create(title="Dune", author="Frank Herbert", stock=3)
    emma = Book.objects.create(title="Emma", author="Jane Austen", stock=0)
    Book.objects.create(title="Persuasion", author="Jane Austen", stock=1)
    for stars in (5, 4):
        Review.objects.create(book=dune, stars=stars)
    Review.objects.create(book=emma, stars=3)
    return {"dune": dune, "emma": emma}


def test_book_admin_is_registered_and_passes_the_admin_checks():
    model_admin = book_admin()
    assert isinstance(model_admin, backoffice.admin.BookAdmin)
    assert model_admin.check() == []


def test_the_changelist_columns_and_order(books, staff_get):
    model_admin = book_admin()
    changelist = model_admin.get_changelist_instance(staff_get())
    assert list(changelist.list_display) == ["action_checkbox", "title", "author", "stock", "in_stock", "review_count"]
    assert [b.title for b in changelist.result_list] == ["Dune", "Emma", "Persuasion"]


def test_search_and_filter(books, staff_get):
    model_admin = book_admin()
    found = model_admin.get_changelist_instance(staff_get(q="austen")).result_list
    assert [b.title for b in found] == ["Emma", "Persuasion"]
    found = model_admin.get_changelist_instance(staff_get(q="dune")).result_list
    assert [b.title for b in found] == ["Dune"]
    filtered = model_admin.get_changelist_instance(staff_get(author="Frank Herbert")).result_list
    assert [b.title for b in filtered] == ["Dune"]


def test_in_stock_is_a_boolean_column(books):
    model_admin = book_admin()
    assert model_admin.in_stock(books["dune"]) is True
    assert model_admin.in_stock(books["emma"]) is False
    assert model_admin.in_stock.boolean is True
    assert model_admin.in_stock.short_description == "In stock"


def test_review_count_is_annotated_once_not_queried_per_row(books, staff_get, django_assert_num_queries):
    model_admin = book_admin()
    rows = model_admin.get_queryset(staff_get())
    with django_assert_num_queries(1):
        counts = {b.title: model_admin.review_count(b) for b in rows}
    assert counts == {"Dune": 2, "Emma": 1, "Persuasion": 0}
    assert model_admin.review_count.short_description == "Reviews"
    assert model_admin.review_count.admin_order_field == "review_count"


def test_the_edit_page_groups_fields_and_shows_created_as_text(staff_get):
    model_admin = book_admin()
    request = staff_get()
    assert model_admin.get_fieldsets(request) == (
        (None, {"fields": ("title", "author")}),
        ("Stock", {"fields": ("stock", "created")}),
    )
    assert "created" in model_admin.get_readonly_fields(request)
    assert sorted(model_admin.get_form(request).base_fields) == ["author", "stock", "title"]


def test_reviews_are_edited_inline(books, staff_get):
    request = staff_get()
    inlines = book_admin().get_inline_instances(request)
    assert [type(i).__name__ for i in inlines] == ["ReviewInline"]
    inline = inlines[0]
    assert isinstance(inline, admin.TabularInline) and inline.model is Review
    formset = inline.get_formset(request, books["dune"])(instance=books["dune"])
    assert len(formset.forms) == 3
    assert sorted(formset.forms[0].fields) == ["DELETE", "book", "id", "stars", "text"]


def test_sell_out_updates_every_ticked_book_at_once(books, staff_get, django_assert_num_queries):
    model_admin = book_admin()
    request = staff_get()
    func, name, description = model_admin.get_actions(request)["sell_out"]
    assert description == "Mark selected as sold out"
    with django_assert_num_queries(1):
        func(model_admin, request, Book.objects.filter(stock__gt=0))
    assert list(Book.objects.order_by("title").values_list("stock", flat=True)) == [0, 0, 0]
