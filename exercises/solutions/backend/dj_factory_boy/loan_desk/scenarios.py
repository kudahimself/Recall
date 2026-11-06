"""Factory Boy & Advanced Testing: reference solution for the shared set-ups."""
from loan_desk.factories import BranchFactory, LoanFactory, MemberFactory


def members_of(branch, n):
    return MemberFactory.create_batch(n, branch=branch)


def member_with_loans(n, **member_fields):
    member = MemberFactory(**member_fields)
    LoanFactory.create_batch(n, member=member)
    return member


def staffed_branch(readers):
    branch = BranchFactory()
    MemberFactory(branch=branch, librarian=True)
    MemberFactory.create_batch(readers, branch=branch)
    return branch


def preview_member(**member_fields):
    return MemberFactory.build(**member_fields)
