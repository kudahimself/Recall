"""Which view each path reaches: written for you, nothing to change here."""
from django.urls import path

from suggestions import views

urlpatterns = [
    path("suggest/", views.suggest, name="suggest"),
]
