"""The routes: written for you, nothing to change here."""
from django.urls import path

from due_notices import views

urlpatterns = [
    path("loans/<int:loan_id>/remind/", views.remind, name="remind"),
    path("loans/<int:loan_id>/remind-later/", views.remind_later, name="remind-later"),
]
