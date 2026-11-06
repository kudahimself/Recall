"""URLs & Routing: reference solution, the borrowing app's routes."""
from django.urls import path, re_path

from borrowing import views

app_name = "lending"
urlpatterns = [
    path("", views.index, name="index"),
    path("<int:pk>/", views.book, name="book"),
    path("<slug:genre>/", views.shelf, name="shelf"),
    path("members/<uuid:card>/", views.member, name="member"),
    re_path(r"^archive/(?P<year>[0-9]{4})/$", views.archive, name="archive"),
]
