"""Factory Boy & Advanced Testing: the set-ups the library's tests share, built with the factories.

Write the functions below so the tests in test_loan_desk.py pass.
Use the factories in loan_desk/factories.py, not Model.objects.create.
"""
from loan_desk.factories import BranchFactory, LoanFactory, MemberFactory


def members_of(branch, n):
    """Save n members of the given branch and return them as a list; no other branch is made."""
    # TODO
    raise NotImplementedError


def member_with_loans(n, **member_fields):
    """Save one member, with member_fields replacing the factory's defaults, who has n open loans.

    Return the member. All n loans belong to that one member: no other member is made.
    """
    # TODO
    raise NotImplementedError


def staffed_branch(readers):
    """Save one new branch with one librarian and `readers` ordinary members, and return the branch."""
    # TODO
    raise NotImplementedError


def preview_member(**member_fields):
    """A member with member_fields replacing the defaults, made in memory only: nothing is saved,
    not even its branch. Handy for checking a form or a serializer without the database."""
    # TODO
    raise NotImplementedError
