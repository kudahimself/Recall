"""Celery Tasks & Scheduling: reference solution for the views."""
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.http import require_POST

from due_notices.models import Loan
from due_notices.tasks import send_notice


@require_POST
def remind(request, loan_id):
    loan = get_object_or_404(Loan, pk=loan_id)
    result = send_notice.delay(loan.pk)
    return JsonResponse({"task_id": result.id}, status=202)


@require_POST
def remind_later(request, loan_id):
    loan = get_object_or_404(Loan, pk=loan_id)
    result = send_notice.apply_async(args=[loan.pk], countdown=3600)
    return JsonResponse({"task_id": result.id}, status=202)
