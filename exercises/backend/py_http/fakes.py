"""Stand-ins for requests.Session and its responses, so the tests run offline.

You do not need to change this file.
FakeSession has the same get/post shape as requests.Session: get(url, **kwargs)
and post(url, **kwargs). It hands out the responses it was given, in order, and
records every call in `calls` as (method, url, kwargs).
"""


class HTTPError(Exception):
    """Raised by FakeResponse.raise_for_status for a 4xx or 5xx, like requests.HTTPError."""

    def __init__(self, message, response=None):
        super().__init__(message)
        self.response = response


class FakeResponse:
    def __init__(self, status_code, body=None):
        self.status_code = status_code
        self._body = body

    @property
    def ok(self):
        return self.status_code < 400

    def json(self):
        if self._body is None:
            raise ValueError("response has no JSON body")
        return self._body

    def raise_for_status(self):
        if self.status_code >= 400:
            raise HTTPError(f"{self.status_code} error", response=self)


class FakeSession:
    def __init__(self, *responses):
        self.responses = list(responses)
        self.calls = []

    def _next(self):
        if not self.responses:
            raise AssertionError("FakeSession ran out of responses: too many requests")
        return self.responses.pop(0)

    def get(self, url, **kwargs):
        self.calls.append(("GET", url, kwargs))
        return self._next()

    def post(self, url, **kwargs):
        self.calls.append(("POST", url, kwargs))
        return self._next()
