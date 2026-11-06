"""Which view each path reaches: written for you, nothing to change here."""
from django.urls import path

from shelving import views

urlpatterns = [
    path("shelves/<slug:code>/", views.ShelfView.as_view(), name="shelf"),
    path("shelves/<slug:code>/export/", views.export_shelf, name="shelf-export"),
    path("new/", views.NewArrivalsView.as_view(), name="new-arrivals"),
    path("my-holds/", views.MyHoldsView.as_view(), name="my-holds"),
]
