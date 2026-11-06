"""Which view each path reaches: written for you, nothing to change here."""
from django.urls import path

from book_samples import views

urlpatterns = [
    path("samples/", views.SampleUpload.as_view(), name="sample-upload"),
]
