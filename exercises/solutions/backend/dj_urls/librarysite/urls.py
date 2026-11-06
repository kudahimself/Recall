"""URLs & Routing: reference solution, the project's root URLconf."""
from django.urls import include, path

urlpatterns = [
    path("lending/", include("borrowing.urls")),
]
