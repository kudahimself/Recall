"""Class-Based & Generic Views: practise ListView, DetailView, View, hooks and mixins.

Configure the four views below so the tests in test_stacks_views.py pass.
stacks/urls.py already routes to each one through as_view(), and the templates are written.
Run them from the exercise folder with: pytest
"""
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views import View
from django.views.generic import DetailView, ListView

from stacks.models import Book


class ShelfList(ListView):
    """The books on the shelf (not on loan), in title order, two per page.

    TODO:
    - the model is Book, and the template (left to its default name) calls the rows "books";
    - get_queryset() keeps only the books not on loan, in title order;
    - get_context_data() adds "on_loan_count", how many books are out on loan.
    """


class BookDetail(DetailView):
    """One book, shown with the template stacks/book_page.html.

    TODO: the model and the template name.
    """


class RenewView(View):
    """POST only: add one to the book's renewals and answer JSON {"title": ..., "renewals": ...}.

    A missing book is a 404, and any other method should get 405 Method Not Allowed.
    TODO
    """


class LoanedList(ListView):
    """The books out on loan, in title order, shown with stacks/loaned.html.

    Only signed-in staff may see it: anyone else is sent to the login page.
    TODO: add the mixin that does that, in the right place.
    """
