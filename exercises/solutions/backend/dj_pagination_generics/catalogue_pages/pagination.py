"""Pagination & Generic Views: reference solution."""
from rest_framework.pagination import CursorPagination, PageNumberPagination
from rest_framework.response import Response


class ShelfPages(PageNumberPagination):
    page_size = 2
    page_size_query_param = "size"
    max_page_size = 3

    def get_paginated_response(self, data):
        return Response({
            "count": self.page.paginator.count,
            "page": self.page.number,
            "pages": self.page.paginator.num_pages,
            "next": self.get_next_link(),
            "previous": self.get_previous_link(),
            "results": data,
        })


class NewestLoansFirst(CursorPagination):
    page_size = 2
    ordering = "-lent_on"
