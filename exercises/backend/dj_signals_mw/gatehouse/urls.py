"""Which view each path reaches: written for you, nothing to change here."""
from django.urls import path

from gatehouse import views

urlpatterns = [
    path("desk/", views.desk, name="desk"),
]
