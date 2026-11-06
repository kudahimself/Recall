"""Signals & Middleware: practise middleware classes, on the way in and on the way out.

Write the three middleware classes so the tests in test_gatehouse.py pass.
gatehouse/stack.py lists them in settings.MIDDLEWARE.
Run them from the exercise folder with: pytest
"""
import uuid

from django.conf import settings
from django.http import HttpResponse


class RequestIdMiddleware:
    """Give every request an id, and every response an X-Request-ID header with it.

    On the way in: request.request_id is the incoming X-Request-ID header when there is
    one, else a new uuid4().hex. On the way out: the response's X-Request-ID header.
    """

    # TODO


class MaintenanceMiddleware:
    """While settings.LIBRARY_CLOSED is True, answer every request with status 503 and
    "The library is closed for maintenance." without calling the layers below.
    LIBRARY_CLOSED may be missing from the settings: then the library is open."""

    # TODO


class ReaderMiddleware:
    """Name the reader for the views below and for the response.

    On the way in: request.reader is the signed-in reader's username, or "anonymous".
    On the way out: the response's X-Reader header with the same name.
    """

    # TODO
