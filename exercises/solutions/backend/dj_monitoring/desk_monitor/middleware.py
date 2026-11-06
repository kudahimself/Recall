"""Error capture: log every unhandled exception with its request, as an error tracker does."""
import logging

log = logging.getLogger("desk_monitor.errors")


class ErrorCaptureMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        return self.get_response(request)

    def process_exception(self, request, exception):
        log.exception("unhandled error", extra={"path": request.path, "method": request.method})
        return None
