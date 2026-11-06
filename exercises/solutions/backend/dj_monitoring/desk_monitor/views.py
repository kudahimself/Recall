"""The loan desk's views, logging what they do as structured records."""
import logging

from django.db import DatabaseError, connection
from django.http import JsonResponse
from django.views.decorators.http import require_GET, require_POST

from desk_monitor.services import CatalogueDown, LendingError, lend_book

log = logging.getLogger(__name__)


@require_POST
def checkout(request, book_id):
    member = request.POST.get("member", "")
    log.info("checkout started", extra={"book_id": book_id, "member": member})
    try:
        loan_id = lend_book(book_id, member)
    except LendingError as exc:
        log.warning("checkout refused", extra={"book_id": book_id, "reason": str(exc)})
        return JsonResponse({"error": str(exc)}, status=409)
    except CatalogueDown:
        log.exception("catalogue unreachable", extra={"book_id": book_id})
        return JsonResponse({"error": "try again later"}, status=503)
    log.info("book lent", extra={"book_id": book_id, "loan_id": loan_id})
    return JsonResponse({"loan_id": loan_id}, status=201)


@require_GET
def health(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
    except DatabaseError:
        log.exception("health check failed", extra={"check": "database"})
        return JsonResponse({"status": "error", "checks": {"database": "error"}}, status=503)
    return JsonResponse({"status": "ok", "checks": {"database": "ok"}})
