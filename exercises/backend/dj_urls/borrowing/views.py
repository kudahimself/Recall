"""The lending app's views: written for you, nothing to change here.

Each one answers plain text naming what it was given, so the tests can see
which view a path reached and what the URL passed it.
"""
from django.http import HttpResponse


def index(request):
    return HttpResponse("index")


def book(request, pk):
    return HttpResponse(f"book {pk!r}")


def shelf(request, genre):
    return HttpResponse(f"shelf {genre!r}")


def member(request, card):
    return HttpResponse(f"member {card!r}")


def archive(request, year):
    return HttpResponse(f"archive {year!r}")
