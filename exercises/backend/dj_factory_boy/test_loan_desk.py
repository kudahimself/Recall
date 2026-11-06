import factory.random
import pytest

from loan_desk import scenarios
from loan_desk.factories import BranchFactory, LoanFactory, MemberFactory
from loan_desk.models import Branch, Loan, Member

pytestmark = pytest.mark.django_db


@pytest.fixture(autouse=True)
def fresh_factories():
    """Start every test from the same place: Faker seeded, so its fake values repeat from run
    to run, and each factory's Sequence counter back at 0."""
    factory.random.reseed_random("recall-loan-desk")
    for factory_class in (BranchFactory, MemberFactory, LoanFactory):
        if factory_class._meta.model is not None:
            factory_class.reset_sequence()


def test_each_branch_gets_its_own_name():
    branches = BranchFactory.create_batch(3)
    assert [b.name for b in branches] == ["Branch 0", "Branch 1", "Branch 2"]
    assert Branch.objects.count() == 3


def test_a_member_comes_with_every_field_filled_in():
    ann, ben = MemberFactory(), MemberFactory()
    assert ann.pk is not None and ben.pk is not None
    assert (ann.card_no, ben.card_no) == (1000, 1001)
    assert (ann.email, ben.email) == ("member0@library.test", "member1@library.test")
    assert ann.full_name and ben.full_name and ann.full_name != ben.full_name
    assert not ann.is_librarian and ann.loan_limit == 3
    assert ann.branch.pk is not None and ann.branch != ben.branch
    assert Branch.objects.count() == 2


def test_fake_names_look_real():
    names = [m.full_name for m in MemberFactory.create_batch(5)]
    assert len(set(names)) == 5
    assert all(" " in name for name in names), "Faker's \"name\" gives a first and a last name"


def test_an_override_replaces_only_that_field():
    branch = BranchFactory(name="Riverside")
    ana = MemberFactory(full_name="Ana Silva", branch=branch)
    assert ana.full_name == "Ana Silva"
    assert ana.branch == branch and Branch.objects.count() == 1
    assert ana.card_no == 1000 and ana.email == "member0@library.test"


def test_the_librarian_trait_sets_both_fields():
    librarian = MemberFactory(librarian=True)
    assert librarian.is_librarian and librarian.loan_limit == 10
    senior = MemberFactory(librarian=True, loan_limit=20)
    assert senior.is_librarian and senior.loan_limit == 20
    assert not MemberFactory().is_librarian


def test_a_loan_brings_its_member_and_branch():
    loan = LoanFactory()
    assert loan.pk is not None and loan.member.pk is not None
    assert len(loan.book_title.split()) >= 2
    assert not loan.returned and loan.fine_pence == 0
    assert (Branch.objects.count(), Member.objects.count(), Loan.objects.count()) == (1, 1, 1)
    late = LoanFactory(returned_late=True)
    assert late.returned and late.fine_pence == 150


def test_members_of_shares_the_branch():
    branch = BranchFactory()
    members = scenarios.members_of(branch, 4)
    assert len(members) == 4 and all(m.pk is not None for m in members)
    assert {m.branch for m in members} == {branch}
    assert Branch.objects.count() == 1 and Member.objects.count() == 4


def test_member_with_loans_makes_one_member():
    ana = scenarios.member_with_loans(3, full_name="Ana Silva")
    assert isinstance(ana, Member) and ana.pk is not None and ana.full_name == "Ana Silva"
    assert Member.objects.count() == 1, "a SubFactory makes a new member per loan unless you pass one in"
    assert Loan.objects.filter(member=ana, returned=False).count() == 3
    assert Loan.objects.count() == 3


def test_staffed_branch_has_one_librarian():
    branch = scenarios.staffed_branch(readers=3)
    assert isinstance(branch, Branch) and branch.pk is not None
    assert Branch.objects.count() == 1
    staff = Member.objects.filter(branch=branch)
    assert staff.count() == 4
    assert staff.filter(is_librarian=True, loan_limit=10).count() == 1
    assert staff.filter(is_librarian=False, loan_limit=3).count() == 3


def test_preview_member_saves_nothing():
    member = scenarios.preview_member(full_name="Cy Okafor")
    assert isinstance(member, Member)
    assert member.full_name == "Cy Okafor" and member.card_no >= 1000
    assert member.pk is None and member.branch.pk is None
    assert Member.objects.count() == 0 and Branch.objects.count() == 0
