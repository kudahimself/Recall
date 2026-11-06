"""Celery Tasks & Scheduling: the Celery app, as a project's celery.py would hold it.

Fill in the TODOs so the tests in test_due_notices.py pass.
"""
from celery import Celery

app = Celery("library")

# TODO: read every CELERY_* Django setting into the app's configuration
#       (CELERY_TASK_ALWAYS_EAGER becomes task_always_eager, and so on).

# TODO: find the tasks in every installed app's tasks.py.

# TODO: a beat schedule with one entry, "remind-due-loans", that sends
#       due_notices.tasks.remind_all_due every hour (3600 seconds).
