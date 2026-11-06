"""Celery Tasks & Scheduling: the slow work, run by a worker instead of the request.

Write the tasks below so the tests in test_due_notices.py pass.
Every argument a task takes travels through the broker as JSON: pass ids, not model objects.
"""
from celery import chain, shared_task
from django.core.mail import send_mail
from django.utils import timezone

from due_notices.models import Loan


# TODO: make this a task that receives itself as `self` and retries at most 3 times.
def send_notice(self, loan_id):
    """Email the loan's reader that the book is due, then mark the loan reminded.

    Send with send_mail("Book due", f"{title} is due back on {due_on}.", None, [email]).
    A mail server that cannot be reached raises OSError: retry the task in 60 seconds.
    Return the email address the notice went to.
    """
    # TODO
    raise NotImplementedError


# TODO: make this a task (beat sends it every hour).
def remind_all_due():
    """Queue send_notice for every loan due today or earlier that has not been reminded.

    Return how many notices were queued.
    """
    # TODO
    raise NotImplementedError


# TODO: make this a task.
def count_overdue():
    """How many loans are past their due date (due before today)."""
    # TODO
    raise NotImplementedError


# TODO: make this a task.
def format_report(count):
    """The report line for a count, such as "2 overdue"."""
    # TODO
    raise NotImplementedError


def overdue_report():
    """The overdue report as a chain of signatures, count_overdue then format_report.

    Build it, do not run it: the caller decides when to send it.
    """
    # TODO
    raise NotImplementedError
