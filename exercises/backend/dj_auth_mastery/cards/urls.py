"""Which view each path reaches: written for you, nothing to change here."""
from django.urls import path

from cards import views

urlpatterns = [
    path("card-login/", views.card_login, name="card-login"),
    path("loans/<int:pk>/renew/", views.renew, name="renew"),
]
