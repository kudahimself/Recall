"""Service Layer: practise a view that keeps to the HTTP work.

Write LendView so the tests in test_front_counter.py pass.
front_counter/urls.py already routes it at /lend/.
"""
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from front_counter import services


class LendView(APIView):
    """POST /lend/ with {"member": <id>, "book": <id>}.

    TODO: a post() that calls services.lend() with the two ids and answers
    201 {"loan": <the loan's id>, "copies_left": <the book's copies now>},
    or, when the service raises a LendingError, 409 {"error": <the error's code>}.
    """
