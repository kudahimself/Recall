"""Which view each path reaches: written for you, nothing to change here."""
from django.urls import path

from book_api import views

urlpatterns = [
    path("books/", views.book_list, name="book-list"),
    path("books/<int:pk>/", views.BookDetail.as_view(), name="book-detail"),
]
