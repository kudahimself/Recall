"""API Documentation: practise routing the schema and the docs page.

The books and /stats/ are routed for you; add the two documentation routes
so the tests in test_catalogue_docs.py pass.
"""
from django.urls import path
from rest_framework.routers import SimpleRouter

from catalogue_docs import views

router = SimpleRouter()
router.register("books", views.BookViewSet, basename="book")

urlpatterns = [
    path("stats/", views.StockStats.as_view()),
    # TODO: api/schema/ serves the raw OpenAPI schema, under the URL name "schema";
    # api/docs/ serves the Swagger UI page, pointed at that "schema" route.
    *router.urls,
]
