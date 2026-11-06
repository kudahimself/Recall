"""DRF Mastery: reference solution."""
from rest_framework.exceptions import APIException
from rest_framework.views import exception_handler


class NoCopyFree(APIException):
    status_code = 409
    default_detail = "No copy is free."


def api_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is not None:
        response.data = {"error": {"status": response.status_code, "detail": response.data}}
    return response
