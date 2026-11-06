"""The one page the tests visit: written for you, nothing to change here."""
from django.http import HttpResponse


def desk(request):
    return HttpResponse(f"Desk, request {request.request_id}, reader {request.reader}")
