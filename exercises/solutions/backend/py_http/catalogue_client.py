"""HTTP clients: reference solution."""


class CatalogueClient:
    def __init__(self, session, base_url, timeout=5):
        self.session = session
        self.base_url = base_url
        self.timeout = timeout

    def get_book(self, isbn):
        r = self.session.get(f"{self.base_url}/books/{isbn}", timeout=self.timeout)
        if r.status_code == 404:
            return None
        r.raise_for_status()
        return r.json()

    def search(self, query, limit=10):
        r = self.session.get(
            f"{self.base_url}/books",
            params={"q": query, "limit": limit},
            timeout=self.timeout,
        )
        r.raise_for_status()
        return r.json()["results"]

    def add_book(self, book):
        r = self.session.post(f"{self.base_url}/books", json=book, timeout=self.timeout)
        r.raise_for_status()
        return r.json()["id"]

    def availability(self, isbn, attempts=3):
        url = f"{self.base_url}/books/{isbn}/availability"
        for _ in range(attempts):
            r = self.session.get(url, timeout=self.timeout)
            if r.status_code != 503:
                break
        r.raise_for_status()
        return r.json()["available"]
