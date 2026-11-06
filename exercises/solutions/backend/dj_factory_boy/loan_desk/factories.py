"""Factory Boy & Advanced Testing: reference solution for the factories."""
import factory

from loan_desk.models import Branch, Loan, Member


class BranchFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Branch

    name = factory.Sequence(lambda n: f"Branch {n}")


class MemberFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Member

    card_no = factory.Sequence(lambda n: 1000 + n)
    full_name = factory.Faker("name")
    email = factory.Sequence(lambda n: f"member{n}@library.test")
    branch = factory.SubFactory(BranchFactory)

    class Params:
        librarian = factory.Trait(is_librarian=True, loan_limit=10)


class LoanFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Loan

    member = factory.SubFactory(MemberFactory)
    book_title = factory.Faker("sentence", nb_words=3)

    class Params:
        returned_late = factory.Trait(returned=True, fine_pence=150)
