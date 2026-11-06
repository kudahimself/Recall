"""Error capture: log every unhandled exception with its request, as an error tracker does."""
import logging

log = logging.getLogger("desk_monitor.errors")


class ErrorCaptureMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        return self.get_response(request)

    # TODO: process_exception(self, request, exception), which Django calls when a view raises.
    # Log "unhandled error" at ERROR with the traceback and the request's path and method
    # as extra fields, then return None so Django still answers 500.
