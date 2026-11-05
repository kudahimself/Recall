"""JSON & Serialization: practise json.dumps, json.loads, default= and the round trip.

Fill in each function so the tests in test_catalogue.py pass.
Run them from this folder with: pytest
"""
import datetime
import json


def to_json(book):
    """Return `book` as readable JSON text: indented by 2, keys sorted."""
    # TODO
    raise NotImplementedError


def from_json(text):
    """Parse JSON text into Python data (dicts, lists, str, int, True/False/None)."""
    # TODO
    raise NotImplementedError


def encode_extra(value):
    """A `default=` function for json.dumps.

    A datetime.date becomes its ISO text ("2025-03-01"), a set becomes a sorted list,
    and anything else raises TypeError, as json.dumps itself would.
    """
    # TODO
    raise NotImplementedError


def export(record):
    """Return `record` as compact JSON text with sorted keys, converting dates and sets with encode_extra."""
    # TODO
    raise NotImplementedError


def save_catalogue(path, books):
    """Write the list `books` to the file at `path` as JSON, with json.dump."""
    # TODO
    raise NotImplementedError


def load_catalogue(path):
    """Read the list of books back from the JSON file at `path`, with json.load."""
    # TODO
    raise NotImplementedError


def restore_shelves(data):
    """Undo a JSON round trip of a shelf map such as {3: ("Dune", "Emma")}.

    JSON turned the int keys into text and the tuples into lists:
    return a new dict with int keys and tuple values.
    """
    # TODO
    raise NotImplementedError
