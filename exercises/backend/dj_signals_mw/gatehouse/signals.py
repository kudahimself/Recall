"""Signals & Middleware: practise receivers for model signals.

Write the receivers so the tests in test_gatehouse.py pass.
Nothing imports this module yet: connect it in GatehouseConfig.ready() (gatehouse/apps.py).
"""
from django.db.models import F
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from gatehouse.models import AuditEntry, Book, Loan


# TODO: after a Loan is saved for the first time (an insert, not an update), add one to
# its book's times_lent, in a single UPDATE that F() computes in the database.
def count_loan(sender, instance, created, **kwargs):
    raise NotImplementedError


# TODO: after a Loan is deleted, record AuditEntry "Loan of <title> to <reader> deleted".
def log_deleted_loan(sender, instance, **kwargs):
    raise NotImplementedError
