"""Celery Tasks & Scheduling: reference solution for the tasks."""
from celery import chain, shared_task
from django.core.mail import send_mail
from django.utils import timezone

from due_notices.models import Loan


@shared_task(bind=True, max_retries=3)
def send_notice(self, loan_id):
    loan = Loan.objects.get(pk=loan_id)
    try:
        send_mail("Book due", f"{loan.title} is due back on {loan.due_on}.", None, [loan.email])
    except OSError as exc:
        raise self.retry(exc=exc, countdown=60)
    loan.reminded = True
    loan.save(update_fields=["reminded"])
    return loan.email


@shared_task
def remind_all_due():
    due = Loan.objects.filter(due_on__lte=timezone.localdate(), reminded=False)
    ids = list(due.values_list("pk", flat=True))
    for loan_id in ids:
        send_notice.delay(loan_id)
    return len(ids)


@shared_task
def count_overdue():
    return Loan.objects.filter(due_on__lt=timezone.localdate()).count()


@shared_task
def format_report(count):
    return f"{count} overdue"


def overdue_report():
    return chain(count_overdue.s(), format_report.s())
