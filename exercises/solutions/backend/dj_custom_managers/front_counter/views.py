"""Service Layer: reference solution."""
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from front_counter import services


class LendView(APIView):
    def post(self, request):
        try:
            loan = services.lend(request.data["member"], request.data["book"])
        except services.LendingError as err:
            return Response({"error": err.code}, status=status.HTTP_409_CONFLICT)
        return Response({"loan": loan.pk, "copies_left": loan.book.copies}, status=status.HTTP_201_CREATED)
