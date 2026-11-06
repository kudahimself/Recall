from django.urls import path

from noticeboard import views

urlpatterns = [
    path("books/<int:pk>/", views.book, name="book"),
]
