"""Models Mastery: reference solution."""
import datetime

from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator, RegexValidator
from django.db import models
from django.db.models import F, Q


class Stamped(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Item(Stamped):
    title = models.CharField(max_length=200)
    shelf_mark = models.CharField(
        max_length=7,
        validators=[RegexValidator(r"^[A-Z]{3}-\d{3}$", "Use three capitals, a hyphen and three digits.")],
    )
    copies = models.PositiveIntegerField(validators=[MinValueValidator(1)])

    def __str__(self):
        return self.title


class Periodical(Item):
    issue = models.PositiveIntegerField()


LOAN_LIMIT = datetime.timedelta(days=28)


class Loan(Stamped):
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name="loans")
    reader = models.CharField(max_length=50)
    lent = models.DateField()
    due = models.DateField()
    returned = models.BooleanField(default=False)

    class Meta:
        constraints = [
            models.CheckConstraint(
                condition=Q(due__gte=F("lent")),
                name="ledger_due_after_lent",
                violation_error_message="Due date is before the loan date.",
            ),
            models.UniqueConstraint(
                fields=["item", "reader"],
                condition=Q(returned=False),
                name="ledger_one_open_loan",
                violation_error_message="This reader already has this item on loan.",
            ),
        ]

    def clean(self):
        if self.lent and self.due and self.due - self.lent > LOAN_LIMIT:
            raise ValidationError("A loan runs at most 28 days.")


class OverdueLoan(Loan):
    class Meta:
        proxy = True
        ordering = ["due"]

    def days_late(self, today):
        return max(0, (today - self.due).days)
