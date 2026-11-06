"""API Documentation: reference solution."""
from django.urls import path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from rest_framework.routers import SimpleRouter

from catalogue_docs import views

router = SimpleRouter()
router.register("books", views.BookViewSet, basename="book")

urlpatterns = [
    path("stats/", views.StockStats.as_view()),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema")),
    *router.urls,
]
