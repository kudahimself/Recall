# Import the Celery app whenever Django starts, as a project's __init__.py does,
# so @shared_task binds every task to it. Nothing to change here.
from due_notices.celery_app import app

__all__ = ("app",)
