"""The API's route: written for you, nothing to change here."""
from django.urls import path

from front_counter import views

urlpatterns = [
    path("lend/", views.LendView.as_view()),
]
