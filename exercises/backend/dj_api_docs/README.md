# Catalogue docs

Topic: API Documentation (drf-spectacular) (Backend, DRF Production Patterns).
Time: about 20 minutes.

## Task

Document a small books API with drf-spectacular, so its OpenAPI schema says what the API really does.
The `Book` model, the serializers, the views' behaviour and the book and `/stats/` routes are written for you.

In `catalogue_docs/docs_settings.py`, the settings as they would sit in `settings.py`:

- `INSTALLED_APPS` keeps the shared apps and adds `"drf_spectacular"`.
- `REST_FRAMEWORK` makes `"drf_spectacular.openapi.AutoSchema"` the `DEFAULT_SCHEMA_CLASS`.

In `catalogue_docs/urls.py`, add two routes:

- `api/schema/`, a `SpectacularAPIView`, named `"schema"`, that serves the raw schema.
- `api/docs/`, a `SpectacularSwaggerView`, given `url_name="schema"`, that serves the Swagger UI page.

In `catalogue_docs/views.py`, add `@extend_schema(...)` where drf-spectacular's guess falls short, without changing what the views do:

- On `BookViewSet.lend`, above `@action`: the summary `"Lend one copy"`, the tag `"loans"`, no request body (`request=None`), and a 200 response shaped by `LoanReceiptSerializer`.
- On `StockStats.get`: the summary `"Stock totals"`, a 200 response shaped by `StockStatsSerializer`, and one `OpenApiExample` named `"A small branch"` with the value `{"titles": 2, "copies": 5}`.

## Examples

```text
GET /api/schema/?format=json   200  {"openapi": "3.0.3", "paths": {"/books/": ..., "/books/{id}/lend/": ..., "/stats/": ...}, "components": {"schemas": {"Book": ...}}}
GET /api/docs/                 200  the Swagger UI page, loading /api/schema/
```

```python
schema["paths"]["/books/{id}/lend/"]["post"]["responses"]["200"]["content"]["application/json"]["schema"]
# {"$ref": "#/components/schemas/LoanReceipt"}, not Book
list(schema["components"]["schemas"]["Book"]["properties"])   # ["id", "title", "copies"]
```

In a project, `python manage.py spectacular --validate --fail-on-warn --file schema.yml` builds the same schema and fails on any warning; the last test runs it through `call_command`.

Watch for the lesson's pitfall: a plain `APIView` or an `@action` that answers some other shape gives drf-spectacular nothing true to read.
The first is documented with no body and an error in the build output, and the second with the view's own serializer, here `Book`, so the docs look complete while describing the wrong JSON.
Read the warnings the schema build prints, and add `@extend_schema(request=..., responses=...)` to those methods.

## Run the tests

```bash
cd exercises/backend/dj_api_docs
pytest
```

`conftest.py` sets Django up for you, on a database that lives in memory for the test run; leave it as it is.
The tests apply `docs_settings.py` over the shared settings and build the schema in-process through your routes and the `spectacular` management command, so no server or network is needed.
The Swagger UI page loads its scripts from a CDN in a browser; the tests only read its HTML.
Every test fails until you write the settings, the routes and the decorators.
When they all pass, tick the exercise done in Recall under Progress, Topics.
