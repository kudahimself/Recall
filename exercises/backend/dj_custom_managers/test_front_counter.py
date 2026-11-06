import pytest
from rest_framework.test import APIClient

from front_counter import services
from front_counter.models import Book, Loan, Member
from front_counter.services import LoanLimitReached, NoCopyLeft, NotAMember

pytestmark = [pytest.mark.django_db, pytest.mark.urls("front_counter.urls")]


class Boom(Exception):
    """Stands in for a failure halfway through a loan."""


@pytest.fixture
def counter():
    ann = Member.objects.create(full_name="Ann")
    ben = Member.objects.create(full_name="Ben")
    gone = Member.objects.create(full_name="Gone", is_deleted=True)
    books = {
        title: Book.objects.create(title=title, author=author, copies=copies)
        for title, author, copies in [
            ("Dune", "Herbert", 2), ("Dune Messiah", "Herbert", 0),
            ("Children of Dune", "Herbert", 1), ("Emma", "Austen", 3),
        ]
    }
    return {"ann": ann, "ben": ben, "gone": gone, **books}


def titles(books):
    return sorted(b.title for b in books)


def test_the_default_manager_hides_deleted_members(counter):
    assert Member._meta.default_manager.name == "objects"
    assert sorted(m.full_name for m in Member.objects.all()) == ["Ann", "Ben"]
    assert not Member.objects.filter(pk=counter["gone"].pk).exists()
    assert Member.everyone.count() == 3
    assert Member.everyone.get(pk=counter["gone"].pk).full_name == "Gone"


def test_counts_stays_on_the_manager(counter):
    Member.objects.create(full_name="Cat")
    assert Member.objects.counts() == {"active": 3, "deleted": 1}


def test_book_queries_chain_in_any_order_as_one_query(counter, django_assert_num_queries):
    with django_assert_num_queries(1):
        assert titles(Book.objects.available().by_author("Herbert")) == ["Children of Dune", "Dune"]
    with django_assert_num_queries(1):
        assert titles(Book.objects.by_author("Herbert").available()) == ["Children of Dune", "Dune"]
    assert titles(Book.objects.filter(title__startswith="D").available()) == ["Dune"]
    assert Book.objects.by_author("Austen").count() == 1
    assert Book.objects.available().count() == 3


def test_lend_takes_a_copy_and_records_the_loan(counter):
    loan = services.lend(counter["ann"].pk, counter["Dune"].pk)
    assert isinstance(loan, Loan) and loan.pk is not None
    assert (loan.member, loan.book, loan.returned) == (counter["ann"], counter["Dune"], False)
    assert Book.objects.get(title="Dune").copies == 1


def test_lend_refuses_with_domain_errors_and_writes_nothing(counter):
    with pytest.raises(NotAMember):
        services.lend(counter["gone"].pk, counter["Dune"].pk)
    with pytest.raises(NotAMember):
        services.lend(999, counter["Dune"].pk)
    with pytest.raises(NoCopyLeft):
        services.lend(counter["ann"].pk, counter["Dune Messiah"].pk)
    with pytest.raises(NoCopyLeft):
        services.lend(counter["ann"].pk, 999)
    assert Loan.objects.count() == 0
    assert Book.objects.get(title="Dune").copies == 2


def test_lend_stops_at_two_open_loans(counter):
    services.lend(counter["ben"].pk, counter["Dune"].pk)
    services.lend(counter["ben"].pk, counter["Emma"].pk)
    with pytest.raises(LoanLimitReached):
        services.lend(counter["ben"].pk, counter["Children of Dune"].pk)
    assert Book.objects.get(title="Children of Dune").copies == 1
    Loan.objects.filter(book__title="Emma").update(returned=True)
    services.lend(counter["ben"].pk, counter["Children of Dune"].pk)
    assert Loan.objects.filter(member=counter["ben"], returned=False).count() == 2


def test_lend_is_all_or_nothing(counter, monkeypatch):
    def fail(*args, **kwargs):
        raise Boom

    monkeypatch.setattr(Loan, "save", fail)
    with pytest.raises(Boom):
        services.lend(counter["ann"].pk, counter["Emma"].pk)
    assert Book.objects.get(title="Emma").copies == 3


def test_the_view_turns_the_result_into_a_response(counter):
    api = APIClient()
    response = api.post("/lend/", {"member": counter["ann"].pk, "book": counter["Children of Dune"].pk}, format="json")
    assert response.status_code == 201
    assert response.json() == {"loan": Loan.objects.get().pk, "copies_left": 0}
    response = api.post("/lend/", {"member": counter["ann"].pk, "book": counter["Children of Dune"].pk}, format="json")
    assert (response.status_code, response.json()) == (409, {"error": "no_copy_left"})
    response = api.post("/lend/", {"member": counter["gone"].pk, "book": counter["Emma"].pk}, format="json")
    assert (response.status_code, response.json()) == (409, {"error": "not_a_member"})
