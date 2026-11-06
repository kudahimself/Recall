import pytest
from django.core.management import call_command
from django.urls import reverse
from drf_spectacular.drainage import reset_generator_stats
from rest_framework.test import APIClient

from catalogue_docs import docs_settings
from catalogue_docs.models import Book

pytestmark = [pytest.mark.django_db, pytest.mark.urls("catalogue_docs.urls")]


@pytest.fixture(autouse=True)
def apply_docs_settings(settings):
    """Apply catalogue_docs/docs_settings.py, as if it were part of settings.py."""
    settings.INSTALLED_APPS = docs_settings.INSTALLED_APPS
    settings.REST_FRAMEWORK = docs_settings.REST_FRAMEWORK
    reset_generator_stats()  # count only the warnings this test's schema build gives


def get_schema():
    """The OpenAPI schema, as /api/schema/ serves it in JSON."""
    response = APIClient().get("/api/schema/", {"format": "json"})
    assert response.status_code == 200, response.content[:500]
    return response.json()


def body_schema(operation, code="200"):
    return operation["responses"][code]["content"]["application/json"]["schema"]


def test_the_schema_route_serves_openapi_for_every_path():
    schema = get_schema()
    assert reverse("schema") == "/api/schema/"
    assert schema["openapi"].startswith("3.")
    assert sorted(schema["paths"]) == ["/api/schema/", "/books/", "/books/{id}/", "/books/{id}/lend/", "/stats/"]
    assert sorted(schema["paths"]["/books/"]) == ["get", "post"]
    assert sorted(schema["paths"]["/books/{id}/"]) == ["delete", "get", "patch", "put"]


def test_the_docs_page_points_at_the_schema():
    response = APIClient().get("/api/docs/")
    assert response.status_code == 200
    page = response.content.decode()
    assert "swagger-ui" in page and "/api/schema/" in page


def test_each_serializer_becomes_a_component():
    schema = get_schema()
    components = schema["components"]["schemas"]
    assert list(components["Book"]["properties"]) == ["id", "title", "copies"]
    listing = schema["paths"]["/books/"]["get"]
    assert body_schema(listing) == {"type": "array", "items": {"$ref": "#/components/schemas/Book"}}
    assert schema["paths"]["/books/"]["get"]["tags"] == ["books"]


def test_the_lend_action_is_documented_as_it_answers():
    schema = get_schema()
    lend = schema["paths"]["/books/{id}/lend/"]["post"]
    assert lend["summary"] == "Lend one copy"
    assert lend["tags"] == ["loans"]
    assert "requestBody" not in lend
    assert body_schema(lend) == {"$ref": "#/components/schemas/LoanReceipt"}
    assert list(schema["components"]["schemas"]["LoanReceipt"]["properties"]) == ["book", "copies_left"]


def test_the_stats_view_is_documented_with_an_example():
    schema = get_schema()
    stats = schema["paths"]["/stats/"]["get"]
    assert stats["summary"] == "Stock totals"
    assert body_schema(stats) == {"$ref": "#/components/schemas/StockStats"}
    examples = stats["responses"]["200"]["content"]["application/json"]["examples"]
    assert [(e["summary"], e["value"]) for e in examples.values()] == [("A small branch", {"titles": 2, "copies": 5})]


def test_the_api_still_answers_as_the_docs_say():
    dune = Book.objects.create(title="Dune", copies=2)
    Book.objects.create(title="Emma", copies=3)
    api = APIClient()
    assert api.get("/api/schema/").status_code == 200
    assert api.post(f"/books/{dune.pk}/lend/").json() == {"book": "Dune", "copies_left": 1}
    assert api.get("/stats/").json() == {"titles": 2, "copies": 4}


def test_the_schema_builds_with_no_warnings_and_validates(tmp_path):
    out = tmp_path / "schema.yml"
    call_command("spectacular", "--file", str(out), "--validate", "--fail-on-warn")
    assert "/books/{id}/lend/" in out.read_text()
