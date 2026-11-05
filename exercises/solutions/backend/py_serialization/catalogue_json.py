"""JSON & Serialization: reference solution."""
import datetime
import json


def to_json(book):
    return json.dumps(book, indent=2, sort_keys=True)


def from_json(text):
    return json.loads(text)


def encode_extra(value):
    if isinstance(value, datetime.date):
        return value.isoformat()
    if isinstance(value, set):
        return sorted(value)
    raise TypeError(f"cannot turn {value!r} into JSON")


def export(record):
    return json.dumps(record, default=encode_extra, sort_keys=True)


def save_catalogue(path, books):
    with open(path, "w") as f:
        json.dump(books, f)


def load_catalogue(path):
    with open(path) as f:
        return json.load(f)


def restore_shelves(data):
    return {int(key): tuple(titles) for key, titles in data.items()}
