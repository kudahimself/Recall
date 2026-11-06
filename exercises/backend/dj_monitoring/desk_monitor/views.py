"""The loan desk's views, logging what they do as structured records."""
import logging  # noqa: F401

from django.db import DatabaseError, connection  # noqa: F401
from django.http import JsonResponse  # noqa: F401
from django.views.decorators.http import require_GET, require_POST

from desk_monitor.services import CatalogueDown, LendingError, lend_book  # noqa: F401

# TODO: the module's logger, named after the module.
log = None


@require_POST
def checkout(request, book_id):
    """Lend the book to request.POST["member"], logging each step with its context in extra=.

    - First log INFO "checkout started" with book_id and member.
    - Lent: log INFO "book lent" with book_id and loan_id, answer 201 {"loan_id": ...}.
    - LendingError: log WARNING "checkout refused" with book_id and reason (the error's text),
      answer 409 {"error": <the error's text>}.
    - CatalogueDown: log "catalogue unreachable" at ERROR with the traceback and book_id,
      answer 503 {"error": "try again later"}.
    - Anything else is unexpected: let it rise, so the error capture sees it.
    """
    # TODO
    raise NotImplementedError


@require_GET
def health(request):
    """Answer whether the site can serve: run "SELECT 1" on the database.

    Up: 200 {"status": "ok", "checks": {"database": "ok"}}.
    A DatabaseError: log "health check failed" at ERROR with the traceback and
    check="database", answer 503 {"status": "error", "checks": {"database": "error"}}.
    """
    # TODO
    raise NotImplementedError
