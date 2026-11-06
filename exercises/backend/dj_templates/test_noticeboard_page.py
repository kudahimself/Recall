import re

import pytest
from django.template.loader import render_to_string

pytestmark = pytest.mark.urls("noticeboard.urls")

BOOKS = [
    {"pk": 3, "title": "Dune", "blurb": "A desert planet and its spice", "on_loan": True, "note": ""},
    {"pk": 8, "title": "Emma", "blurb": "Matchmaking", "on_loan": False, "note": "<b>signed</b>"},
]


def render(books, branch="central"):
    return render_to_string("noticeboard/new_books.html", {"books": books, "branch": branch})


def text(html):
    """The page's words with the tags taken out and the spacing evened out."""
    return " ".join(re.sub(r"<[^>]+>", " ", html).split())


def items(html):
    """The text of each <li>, in order."""
    return [text(li) for li in re.findall(r"<li>(.*?)</li>", html, re.S)]


def test_the_page_extends_the_base_layout():
    html = render(BOOKS)
    assert html.lstrip().startswith("<!doctype html>")
    assert re.search(r"<title>\s*New books\s*</title>", html)
    assert "Hay Library" in html


def test_the_heading_goes_through_a_filter():
    assert re.search(r"<h1>\s*CENTRAL\s*</h1>", render(BOOKS))


def test_each_book_is_a_numbered_link():
    html = render(BOOKS)
    assert re.findall(r'<a href="([^"]+)">', html) == ["/books/3/", "/books/8/"]
    assert [text(a) for a in re.findall(r"<a [^>]*>(.*?)</a>", html, re.S)] == ["1. Dune", "2. Emma"]


def test_each_line_shows_blurb_shelf_state_and_note():
    assert items(render(BOOKS)) == [
        "1. Dune - A desert planet and… - on loan - no note",
        "2. Emma - Matchmaking - on the shelf - &lt;b&gt;signed&lt;/b&gt;",
    ]


def test_a_note_is_escaped_not_rendered_as_html():
    html = render(BOOKS)
    assert "&lt;b&gt;signed&lt;/b&gt;" in html
    assert "<b>signed</b>" not in html


def test_no_books_shows_the_empty_message():
    html = render([])
    assert items(html) == ["Nothing new this week."]
    assert "<a " not in html


def test_the_hours_are_included():
    assert "Open 9 to 5, Monday to Saturday" in text(render([]))
