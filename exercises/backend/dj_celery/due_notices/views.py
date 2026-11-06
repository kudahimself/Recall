"""Celery Tasks & Scheduling: views that queue the work and answer at once.

Write the views below so the tests in test_due_notices.py pass.
"""
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_POST

from due_notices.models import Loan
from due_notices.tasks import send_notice


@require_POST
def remind(request, loan_id):
    """Queue send_notice for the loan (404 when there is none) and answer 202 with
    {"task_id": ...} straight away, without waiting for the task."""
    # TODO
    raise NotImplementedError


@require_POST
def remind_later(request, loan_id):
    """Like remind, but the notice goes out in an hour (3600 seconds) from now."""
    # TODO
    raise NotImplementedError
