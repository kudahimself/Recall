"""DRF Mastery: one error shape for the whole API.

Write the exception and the handler so the tests in test_loan_api.py pass.
The tests switch the handler on with the setting
REST_FRAMEWORK = {"EXCEPTION_HANDLER": "loan_api.errors.api_exception_handler"}.
"""
from rest_framework.exceptions import APIException
from rest_framework.views import exception_handler


class NoCopyFree(APIException):
    """TODO: a 409 Conflict whose detail is "No copy is free."."""


def api_exception_handler(exc, context):
    """Let DRF's own exception_handler build the response, then wrap its data as
    {"error": {"status": <status code>, "detail": <DRF's data>}}.

    When DRF's handler returns None (an exception it does not handle), return None too.
    """
    # TODO
    raise NotImplementedError
