"""Check bookshop.conf by reading it as text: nothing starts Nginx and nothing is sent.

The tests parse the config into its blocks and directives, the way Nginx reads it,
and then work out where a request would go: which server block answers it,
which location matches it (the longest prefix wins), and whether that location
reads a file from disk (alias or root) or passes the request to Gunicorn
(proxy_pass). So any correct way of writing the config passes.
"""
import re
from dataclasses import dataclass, field
from pathlib import Path

import pytest

CONFIG = Path(__file__).resolve().parent / "bookshop.conf"
HOST = "books.example.org"
GUNICORN = "127.0.0.1:8000"
CERT = f"/etc/letsencrypt/live/{HOST}/fullchain.pem"
KEY = f"/etc/letsencrypt/live/{HOST}/privkey.pem"


@dataclass
class Directive:
    """One directive: `name args...;`, or `name args... { children }` for a block."""
    name: str
    args: list
    children: list = field(default=None)

    def all(self, name):
        return [d for d in self.children or [] if d.name == name]

    def first(self, name):
        found = self.all(name)
        return found[0] if found else None


TOKEN = re.compile(r'"(?:[^"\\]|\\.)*"|\'(?:[^\'\\]|\\.)*\'|[{};]|[^\s{};"\']+')


def parse(text):
    """The config as a top-level Directive whose children are its directives and blocks."""
    text = "\n".join(re.sub(r"(^|\s)#.*$", "", line) for line in text.splitlines())
    tokens = TOKEN.findall(text)
    stack = [Directive("main", [], [])]
    words = []
    for tok in tokens:
        if tok == ";":
            assert words, "a ; with no directive before it"
            stack[-1].children.append(Directive(words[0], words[1:]))
            words = []
        elif tok == "{":
            assert words, "a { with no block name before it"
            block = Directive(words[0], words[1:], [])
            stack[-1].children.append(block)
            stack.append(block)
            words = []
        elif tok == "}":
            assert not words, f"{' '.join(words)!r} needs a ; at its end"
            assert len(stack) > 1, "a } closes a block that was never opened"
            stack.pop()
        else:
            words.append(tok.strip("\"'"))
    assert not words, f"{' '.join(words)!r} needs a ; at its end"
    assert len(stack) == 1, f"the {stack[-1].name} block is missing its closing }}"
    return stack[0]


@pytest.fixture
def config():
    return parse(CONFIG.read_text())


def listens_on(server, port):
    """True when the server block has a `listen` for that port."""
    return any(d.args and d.args[0].rsplit(":", 1)[-1] == str(port) for d in server.all("listen"))


def is_ssl(server):
    return any("ssl" in d.args[1:] for d in server.all("listen"))


def server_for(config, port):
    """The server block that answers books.example.org on that port."""
    found = [s for s in config.all("server")
             if listens_on(s, port) and HOST in sum((d.args for d in s.all("server_name")), [])]
    assert found, f"no server block listens on port {port} with server_name {HOST}"
    assert len(found) == 1, f"more than one server block answers {HOST} on port {port}"
    return found[0]


def https_server(config):
    """The server block that serves the site over HTTPS."""
    server = server_for(config, 443)
    assert is_ssl(server), "the port 443 server needs `listen 443 ssl;` to speak HTTPS"
    return server


def location_for(server, path):
    """The prefix location Nginx picks for the path: the longest prefix that matches."""
    prefixes = []
    for loc in server.all("location"):
        if len(loc.args) == 1:
            prefixes.append((loc.args[0], loc))
        elif len(loc.args) == 2 and loc.args[0] == "^~":
            prefixes.append((loc.args[1], loc))
    matching = [(prefix, loc) for prefix, loc in prefixes if path.startswith(prefix)]
    assert matching, f"no location matches {path}"
    return max(matching, key=lambda m: len(m[0]))


def route(server, path):
    """Where Nginx sends the path: ("file", path on disk) or ("proxy", proxy_pass target)."""
    prefix, loc = location_for(server, path)
    if loc.first("alias"):
        return "file", loc.first("alias").args[0] + path[len(prefix):]
    if loc.first("proxy_pass"):
        return "proxy", loc.first("proxy_pass").args[0]
    root = loc.first("root") or server.first("root")
    if root:
        return "file", root.args[0].rstrip("/") + path
    return "nothing", None


def proxy_headers(server, path):
    """The headers Nginx sets on the proxied request: a location's own proxy_set_header
    lines replace the server block's, the way Nginx inherits them."""
    _, loc = location_for(server, path)
    lines = loc.all("proxy_set_header") or server.all("proxy_set_header")
    return {d.args[0].lower(): " ".join(d.args[1:]) for d in lines}


def test_gunicorn_has_a_named_upstream(config):
    upstreams = config.all("upstream")
    assert upstreams, "give Gunicorn's address a name with an upstream block"
    servers = [d.args[0] for d in upstreams[0].all("server") if d.args]
    assert servers == [GUNICORN], f"the upstream should hold `server {GUNICORN};`"


def test_plain_http_redirects_to_https(config):
    http = server_for(config, 80)
    redirect = http.first("return")
    assert redirect, "the port 80 server should answer every request with a return"
    assert redirect.args == ["301", "https://$host$request_uri"], (
        "send the same host and path on to https:// with a permanent 301"
    )
    assert not http.all("location"), "the port 80 server only redirects; serve the site from the HTTPS one"


def test_https_server_has_its_certificate(config):
    https = https_server(config)
    assert https.first("ssl_certificate") and https.first("ssl_certificate").args == [CERT]
    assert https.first("ssl_certificate_key") and https.first("ssl_certificate_key").args == [KEY]


@pytest.mark.parametrize("path, disk", [
    ("/static/css/site.css", "/srv/bookshop/collected/css/site.css"),
    ("/static/app.js", "/srv/bookshop/collected/app.js"),
])
def test_static_files_come_from_the_collected_folder(config, path, disk):
    assert route(https_server(config), path) == ("file", disk)


@pytest.mark.parametrize("path, disk", [
    ("/media/covers/42.jpg", "/srv/bookshop/media/covers/42.jpg"),
    ("/media/samples/9780141439518/chapter_1.pdf", "/srv/bookshop/media/samples/9780141439518/chapter_1.pdf"),
])
def test_uploads_come_from_the_media_folder(config, path, disk):
    assert route(https_server(config), path) == ("file", disk)


@pytest.mark.parametrize("path", ["/", "/cart/", "/books/42/", "/statistics/", "/mediakit/"])
def test_everything_else_goes_to_gunicorn_through_the_upstream(config, path):
    upstreams = [u.args[0] for u in config.all("upstream") if u.args]
    assert upstreams, "give Gunicorn's address a name with an upstream block"
    assert route(https_server(config), path) == ("proxy", f"http://{upstreams[0]}"), (
        f"{path} should be passed to the upstream by name, as http://{upstreams[0]}"
    )


def test_django_learns_the_host_client_and_scheme(config):
    headers = proxy_headers(https_server(config), "/cart/")
    assert headers.get("host") == "$host"
    assert headers.get("x-forwarded-for") == "$proxy_add_x_forwarded_for"
    assert headers.get("x-forwarded-proto") == "$scheme"
