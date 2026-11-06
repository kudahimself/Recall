"""Models Mastery: practise an abstract base, multi-table inheritance, a proxy,
validators, clean() and database constraints.

Write the five models below so the tests in test_ledger_models.py pass.
Each starts as a bare model: change its base class where the docstring says so.
There are no migrations to make: the tests build the tables straight from your models.
Run them from the exercise folder with: pytest
"""
import datetime

from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator, RegexValidator
from django.db import models
from django.db.models import F, Q

LOAN_LIMIT = datetime.timedelta(days=28)


class Stamped(models.Model):
    """Timestamps every ledger row shares.

    TODO: an abstract base with no table of its own: created, set once when the row
    is inserted, and updated, set again on every save.
    """


class Item(models.Model):
    """Something the library lends.

    TODO: build on Stamped. A title of up to 200 characters; a shelf_mark that must match
    ^[A-Z]{3}-\\d{3}$ (such as "SCI-042"); copies, a whole number of at least 1.
    It prints as its title.
    """


class Periodical(models.Model):
    """A magazine or journal.

    TODO: an Item with a table of its own joined to Item's, adding issue, a whole number.
    """


class Loan(models.Model):
    """One reader borrowing one item.

    TODO: build on Stamped. item (deleting the item deletes its loans, followed back as
    item.loans), reader (up to 50 characters), lent and due (dates), returned (starts False).

    clean(): a loan runs at most LOAN_LIMIT from lent to due, or fails with
    "A loan runs at most 28 days."

    Two rules the database itself enforces, in Meta.constraints:
    - due is never before lent: "ledger_due_after_lent",
      failing with "Due date is before the loan date.";
    - a reader has at most one open (not returned) loan of an item: "ledger_one_open_loan",
      failing with "This reader already has this item on loan."
    """


class OverdueLoan(models.Model):
    """Loans as the overdue list sees them.

    TODO: a proxy of Loan: the same table and rows, ordered by due date, with
    days_late(today), the whole days since due, never below 0.
    """
