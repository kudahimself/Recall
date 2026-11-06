# Loan desk factories

Topic: Factory Boy & Advanced Testing (Backend, Testing & CI/CD).
Time: about 25 minutes.

## Task

The library's tests need branches, members and loans in the database, and spelling out every required field in each test is long and breaks when a model gains a field.
Give each model a factory_boy factory, then build the set-ups the tests share from those factories.
The models (`loan_desk/models.py`) are written for you: a branch's name is unique, and so are a member's card number and email.

Start with `loan_desk/factories.py`.
Each factory subclasses `factory.django.DjangoModelFactory` and names its model in `class Meta`:

- `BranchFactory`: names `"Branch 0"`, `"Branch 1"`, ... from a `Sequence`.
- `MemberFactory`: card numbers from 1000 up, a fake `full_name` from `Faker("name")`, emails `"member0@library.test"`, `"member1@library.test"`, ..., and a `branch` of its own from a `SubFactory`.
  A `librarian` trait sets `is_librarian=True` and `loan_limit=10` together.
- `LoanFactory`: a `member` of its own and a fake three-word `book_title` from `Faker("sentence", nb_words=3)`.
  A `returned_late` trait sets `returned=True` and `fine_pence=150` together.

Then the functions in `loan_desk/scenarios.py`, built with the factories rather than `Model.objects.create`:

- `members_of(branch, n)` saves `n` members of that branch and returns them as a list.
- `member_with_loans(n, **member_fields)` saves one member, with `member_fields` replacing the defaults, who has `n` open loans, and returns the member.
- `staffed_branch(readers)` saves one new branch with one librarian and `readers` ordinary members, and returns the branch.
- `preview_member(**member_fields)` makes a member in memory only: nothing is saved, not even its branch.

## Examples

```python
MemberFactory()                          # card 1000, member0@library.test, a fake name, Branch 0
MemberFactory(full_name="Ana Silva")     # only the name is yours, the rest are defaults
MemberFactory(librarian=True)            # is_librarian=True, loan_limit=10
LoanFactory(returned_late=True)          # returned=True, fine_pence=150, plus a new member
member_with_loans(3, full_name="Ana Silva")   # 1 member, 3 loans that all belong to her
preview_member().pk                      # None, and the database is still empty
```

Watch for the lesson's pitfall: a `SubFactory` builds a new related object every time, so `LoanFactory.create_batch(3)` also saves three different members.
Create the shared member once and pass it in.

## Run the tests

```bash
cd exercises/backend/dj_factory_boy
pytest
```

`conftest.py` sets Django up for you, on a database that lives in memory for the test run; leave it as it is.
Before each test, the tests seed Faker, so its fake names come out the same on every run, and set every factory's `Sequence` back to 0, so the first member of each test gets card 1000.
In your own project you would keep the factories in `tests/factories.py` or `<app>/factories.py`, import them in the tests and call `reset_sequence()` only when a test depends on the exact numbers.
When they all pass, tick the exercise done in Recall under Progress, Topics.
