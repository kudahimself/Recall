"""Which view each path reaches: written for you, nothing to change here."""
from django.urls import path

from desk import views

urlpatterns = [
    path("books/", views.search, name="book-search"),
    path("books/<int:pk>/", views.book_detail, name="book-detail"),
    path("books/<int:pk>/return/", views.return_book, name="book-return"),
    path("books/<int:pk>/note/", views.add_note, name="book-note"),
]
