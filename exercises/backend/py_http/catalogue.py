"""HTTP clients: practise sending requests and reading responses the safe way.

CatalogueClient talks to the library's catalogue API through a session, such as
requests.Session(); the tests hand it a FakeSession from fakes.py instead.
Fill in each method so the tests in test_catalogue.py pass.
Run them from this folder with: pytest
"""


class CatalogueClient:
    """A client for the catalogue API.

    Every request passes timeout=self.timeout, so a stalled server cannot hang the program.
    """

    def __init__(self, session, base_url, timeout=5):
        self.session = session
        self.base_url = base_url
        self.timeout = timeout

    def get_book(self, isbn):
        """GET {base_url}/books/{isbn} and return the JSON body.

        Return None for a 404. Any other 4xx or 5xx raises the session's HTTPError,
        so call raise_for_status() before reading the body.
        """
        # TODO
        raise NotImplementedError

    def search(self, query, limit=10):
        """GET {base_url}/books with the query string q=<query>&limit=<limit>.

        Pass the values with params=, not by building the URL yourself.
        Return the body's "results" list; a 4xx or 5xx raises.
        """
        # TODO
        raise NotImplementedError

    def add_book(self, book):
        """POST the dict `book` as a JSON body to {base_url}/books and return the new book's "id".

        A 4xx or 5xx raises.
        """
        # TODO
        raise NotImplementedError

    def availability(self, isbn, attempts=3):
        """GET {base_url}/books/{isbn}/availability and return the body's "available" number.

        A 503 (service unavailable) is often brief: send the request again, up to
        `attempts` requests in all. When the last one still fails, raise.
        """
        # TODO
        raise NotImplementedError
