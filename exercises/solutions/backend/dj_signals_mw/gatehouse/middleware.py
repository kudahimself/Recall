"""Signals & Middleware: reference solution."""
import uuid

from django.conf import settings
from django.http import HttpResponse


class RequestIdMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        request.request_id = request.headers.get("X-Request-ID") or uuid.uuid4().hex
        response = self.get_response(request)
        response["X-Request-ID"] = request.request_id
        return response


class MaintenanceMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if getattr(settings, "LIBRARY_CLOSED", False):
            return HttpResponse("The library is closed for maintenance.", status=503)
        return self.get_response(request)


class ReaderMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        user = request.user
        request.reader = user.username if user.is_authenticated else "anonymous"
        response = self.get_response(request)
        response["X-Reader"] = request.reader
        return response
