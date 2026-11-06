"""A placeholder book page, so {% url "book" pk %} has a route to point at."""
from django.http import HttpResponse


def book(request, pk):
    return HttpResponse(f"book {pk}")
