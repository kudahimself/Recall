"""Which view each path reaches: written for you, nothing to change here."""
from django.urls import path

from stacks import views

urlpatterns = [
    path("shelf/", views.ShelfList.as_view(), name="shelf"),
    path("books/<int:pk>/", views.BookDetail.as_view(), name="book"),
    path("books/<int:pk>/renew/", views.RenewView.as_view(), name="renew"),
    path("loaned/", views.LoanedList.as_view(), name="loaned"),
]
