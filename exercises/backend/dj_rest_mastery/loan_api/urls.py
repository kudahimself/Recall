"""The API's routes: written for you, nothing to change here.

The router gives BookViewSet /books/ (list, create) and /books/<pk>/ (retrieve,
update, partial_update, destroy), plus /books/<pk>/lend/ for its lend action.
"""
from rest_framework.routers import DefaultRouter

from loan_api import views

router = DefaultRouter()
router.register("books", views.BookViewSet, basename="book")

urlpatterns = router.urls
