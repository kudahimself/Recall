# Catalogue client

Topic: HTTP Clients (requests, httpx) (Backend, Python Advanced).
Time: about 25 minutes.

## Task

`CatalogueClient` in `catalogue.py` talks to the library's catalogue API through a session object.
In real code that is a `requests.Session()`, which reuses the connection for every call.
The tests hand it a `FakeSession` from `fakes.py` instead, with the same `get` and `post` shape, so nothing touches the network.
Fill in the four methods:

- `get_book(isbn)` sends a GET to `{base_url}/books/{isbn}` and returns the JSON body, or `None` for a 404.
- `search(query, limit=10)` sends a GET to `{base_url}/books` with `params=` for `q` and `limit`, and returns the body's `"results"`.
- `add_book(book)` POSTs the dict as a JSON body with `json=` and returns the new book's `"id"`.
- `availability(isbn, attempts=3)` reads `{base_url}/books/{isbn}/availability`, sends the request again after a 503, up to `attempts` requests in all, and returns the body's `"available"`.

Every request passes `timeout=self.timeout`, and any 4xx or 5xx you do not handle raises through `raise_for_status()`.

## Examples

```python
import requests
client = CatalogueClient(requests.Session(), "https://library.example/api")
client.get_book("111")         # {"isbn": "111", "title": "Dune", ...}
client.get_book("999")         # None (a 404)
client.search("dune", limit=5) # [{"isbn": "111", ...}]
client.add_book({"title": "Emma"})   # 42
client.availability("111")     # 2, after up to 3 tries on a 503
```

Watch for the lesson's pitfall: a 500 response does not raise by itself, so call `raise_for_status()` before you read the body, and always pass a `timeout`.

## Run the tests

```bash
cd exercises/backend/py_http
pytest
```

Every test fails until you fill in the methods.
When they all pass, tick the exercise done in Recall under Progress, Topics.
