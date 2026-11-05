import pytest

from catalogue import CatalogueClient
from fakes import FakeResponse, FakeSession, HTTPError

BASE = "https://library.example/api"
DUNE = {"isbn": "111", "title": "Dune", "pages": 412}


def client_for(*responses, timeout=5):
    session = FakeSession(*responses)
    return CatalogueClient(session, BASE, timeout=timeout), session


def test_get_book_returns_the_json_body_and_passes_a_timeout():
    client, session = client_for(FakeResponse(200, DUNE))
    assert client.get_book("111") == DUNE
    method, url, kwargs = session.calls[0]
    assert (method, url) == ("GET", f"{BASE}/books/111")
    assert kwargs["timeout"] == 5


def test_get_book_gives_none_for_a_404():
    client, _ = client_for(FakeResponse(404, {"error": "not found"}))
    assert client.get_book("999") is None


def test_get_book_raises_on_a_server_error_instead_of_returning_the_error_body():
    client, _ = client_for(FakeResponse(500, {"error": "database down"}))
    with pytest.raises(HTTPError):
        client.get_book("111")


def test_search_sends_params_and_returns_the_results():
    client, session = client_for(FakeResponse(200, {"results": [DUNE]}), timeout=2)
    assert client.search("dune", limit=5) == [DUNE]
    method, url, kwargs = session.calls[0]
    assert (method, url) == ("GET", f"{BASE}/books")
    assert kwargs["params"] == {"q": "dune", "limit": 5}
    assert kwargs["timeout"] == 2


def test_search_raises_on_a_client_error():
    client, _ = client_for(FakeResponse(400, {"error": "bad query"}))
    with pytest.raises(HTTPError):
        client.search("")


def test_add_book_posts_a_json_body():
    client, session = client_for(FakeResponse(201, {"id": 42}))
    assert client.add_book({"title": "Emma"}) == 42
    method, url, kwargs = session.calls[0]
    assert (method, url) == ("POST", f"{BASE}/books")
    assert kwargs["json"] == {"title": "Emma"}
    assert kwargs["timeout"] == 5


def test_availability_retries_a_503():
    client, session = client_for(FakeResponse(503), FakeResponse(503), FakeResponse(200, {"available": 2}))
    assert client.availability("111") == 2
    assert len(session.calls) == 3
    assert all(url == f"{BASE}/books/111/availability" for _, url, _ in session.calls)
    assert all(kwargs["timeout"] == 5 for _, _, kwargs in session.calls)


def test_availability_gives_up_after_its_attempts():
    client, session = client_for(FakeResponse(503), FakeResponse(503))
    with pytest.raises(HTTPError):
        client.availability("111", attempts=2)
    assert len(session.calls) == 2


def test_availability_does_not_retry_other_errors():
    client, session = client_for(FakeResponse(404), FakeResponse(200, {"available": 1}))
    with pytest.raises(HTTPError):
        client.availability("999")
    assert len(session.calls) == 1
