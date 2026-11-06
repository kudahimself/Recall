"""Views & Request/Response: reference solution."""
from django.http import HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404, redirect, render

from desk.models import Book


def book_detail(request, pk):
    book = get_object_or_404(Book, pk=pk)
    return JsonResponse({"id": book.pk, "title": book.title, "on_loan": book.on_loan})


def search(request):
    q = request.GET.get("q", "").strip()
    books = Book.objects.filter(title__icontains=q).order_by("title")
    return JsonResponse({"q": q, "titles": [b.title for b in books]})


def return_book(request, pk):
    book = get_object_or_404(Book, pk=pk)
    if request.method == "POST":
        book.on_loan = False
        book.save()
        return redirect("book-detail", pk=book.pk)
    return render(request, "desk/return.html", {"book": book})


def add_note(request, pk):
    book = get_object_or_404(Book, pk=pk)
    note = request.POST.get("note", "").strip()
    if not note:
        return HttpResponse("note is required", status=400)
    book.note = note
    book.save()
    return HttpResponse(f"saved {note}", status=201)
