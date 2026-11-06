from django.urls import path

from desk_monitor import views

urlpatterns = [
    path("checkout/<int:book_id>/", views.checkout),
    path("health/", views.health),
]
