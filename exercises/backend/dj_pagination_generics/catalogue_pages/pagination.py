"""Pagination & Generic Views: practise the two pagination styles.

Write the two pagination classes so the tests in test_catalogue_pages.py pass.
Run them from the exercise folder with: pytest
"""
from rest_framework.pagination import CursorPagination, PageNumberPagination
from rest_framework.response import Response


class ShelfPages(PageNumberPagination):
    """Pages picked with ?page=N.

    TODO:
    - 2 rows per page, and a client may ask for another size with ?size=N, never more than 3;
    - reshape the JSON to {"count", "page", "pages", "next", "previous", "results"}:
      "page" is this page's number and "pages" how many pages there are, both read from
      self.page, the Django Page this request was cut to.
    """


class NewestLoansFirst(CursorPagination):
    """Pages that follow a cursor, newest loan first.

    TODO: 2 rows per page, in a fixed ordering of lent_on, newest first.
    """
