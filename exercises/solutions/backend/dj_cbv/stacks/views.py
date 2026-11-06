"""Class-Based & Generic Views: reference solution."""
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views import View
from django.views.generic import DetailView, ListView

from stacks.models import Book


class ShelfList(ListView):
    model = Book
    context_object_name = "books"
    paginate_by = 2

    def get_queryset(self):
        return Book.objects.filter(on_loan=False).order_by("title")

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["on_loan_count"] = Book.objects.filter(on_loan=True).count()
        return context


class BookDetail(DetailView):
    model = Book
    template_name = "stacks/book_page.html"


class RenewView(View):
    def post(self, request, pk):
        book = get_object_or_404(Book, pk=pk)
        book.renewals += 1
        book.save()
        return JsonResponse({"title": book.title, "renewals": book.renewals})


class LoanedList(LoginRequiredMixin, ListView):
    template_name = "stacks/loaned.html"

    def get_queryset(self):
        return Book.objects.filter(on_loan=True).order_by("title")
