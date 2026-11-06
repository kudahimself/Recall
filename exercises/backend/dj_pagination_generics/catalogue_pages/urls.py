"""The API's routes: written for you, nothing to change here."""
from django.urls import path

from catalogue_pages import views

urlpatterns = [
    path("books/", views.BookList.as_view()),
    path("books/<int:pk>/", views.BookDetail.as_view()),
    path("loans/mine/", views.MyLoans.as_view()),
]
