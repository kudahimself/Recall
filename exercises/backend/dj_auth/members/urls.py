"""Which view each path reaches: written for you, nothing to change here."""
from django.urls import path

from members import views

urlpatterns = [
    path("login/", views.sign_in, name="sign-in"),
    path("logout/", views.sign_out, name="sign-out"),
    path("loans/", views.my_loans, name="my-loans"),
    path("loans/<int:pk>/renew/", views.renew_loan, name="renew-loan"),
]
