"""Factory Boy & Advanced Testing: one factory per model, so a test names only the fields it cares about.

Write the three factories below so the tests in test_loan_desk.py pass.
Each subclasses factory.django.DjangoModelFactory and names its model in class Meta.
The models are in loan_desk/models.py.
"""
import factory

from loan_desk.models import Branch, Loan, Member


class BranchFactory(factory.django.DjangoModelFactory):
    """A branch. TODO: the model, and a name unique to each branch: "Branch 0", "Branch 1", ..."""


class MemberFactory(factory.django.DjangoModelFactory):
    """A member. TODO:

    - card_no: 1000 for the first member, 1001 for the next, and so on;
    - full_name: a realistic fake name;
    - email: "member0@library.test", "member1@library.test", ...;
    - branch: a new branch of its own, saved with the member;
    - a librarian trait: MemberFactory(librarian=True) sets is_librarian=True and loan_limit=10.
    """


class LoanFactory(factory.django.DjangoModelFactory):
    """A loan. TODO:

    - member: a new member of its own;
    - book_title: a fake three-word sentence;
    - a returned_late trait: LoanFactory(returned_late=True) sets returned=True and fine_pence=150.
    """
