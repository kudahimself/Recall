"""Celery Tasks & Scheduling: reference solution for the Celery app."""
from celery import Celery

app = Celery("library")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()

app.conf.beat_schedule = {
    "remind-due-loans": {"task": "due_notices.tasks.remind_all_due", "schedule": 3600},
}
