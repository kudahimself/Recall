"""Views Mastery: reference solution."""
import csv

from django.contrib.auth.decorators import login_required
from django.core.exceptions import PermissionDenied
from django.http import JsonResponse, StreamingHttpResponse
from django.shortcuts import get_object_or_404, redirect
from django.utils.decorators import method_decorator
from django.views import View
from django.views.decorators.cache import cache_page

from shelving.models import Book, Shelf


class ShelfView(View):
    http_method_names = ["get", "post"]

    def dispatch(self, request, *args, **kwargs):
        self.shelf = get_object_or_404(Shelf, code=kwargs["code"])
        response = super().dispatch(request, *args, **kwargs)
        response["X-Shelf"] = self.shelf.code
        return response

    def get(self, request, code):
        titles = self.shelf.books.order_by("title").values_list("title", flat=True)
        return JsonResponse(list(titles), safe=False)

    def post(self, request, code):
        if not request.user.is_staff:
            raise PermissionDenied
        Book.objects.create(shelf=self.shelf, title=request.POST["title"])
        return redirect("shelf", code=code)


@method_decorator(cache_page(60), name="dispatch")
class NewArrivalsView(View):
    def get(self, request):
        titles = Book.objects.order_by("-added").values_list("title", flat=True)[:3]
        return JsonResponse(list(titles), safe=False)


@method_decorator(login_required, name="dispatch")
class MyHoldsView(View):
    def get(self, request):
        titles = request.user.shelving_holds.order_by("title").values_list("title", flat=True)
        return JsonResponse({"reader": request.user.username, "titles": list(titles)})


class Echo:
    """A file-like object whose write() hands back what it was given."""

    def write(self, value):
        return value


def export_shelf(request, code):
    shelf = get_object_or_404(Shelf, code=code)

    def rows():
        writer = csv.writer(Echo())
        yield writer.writerow(["title", "added"])
        for book in shelf.books.order_by("title").iterator():
            yield writer.writerow([book.title, book.added.date().isoformat()])

    response = StreamingHttpResponse(rows(), content_type="text/csv")
    response["Content-Disposition"] = f'attachment; filename="{code}.csv"'
    return response
