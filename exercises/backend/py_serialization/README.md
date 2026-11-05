# Catalogue export

Topic: JSON & Serialization (Backend, Python Advanced).
Time: about 20 minutes.

## Task

The library shares its catalogue with other systems as JSON.
Fill in the functions in `catalogue.py`:

- `to_json(book)` turns a dict into readable JSON text, indented by 2 with the keys sorted.
- `from_json(text)` parses JSON text back into Python data.
- `encode_extra(value)` is a `default=` function: it turns a `datetime.date` into its ISO text and a set into a sorted list, and raises `TypeError` for anything else.
- `export(record)` turns a record that may hold dates and sets into compact JSON with sorted keys, using `encode_extra`.
- `save_catalogue(path, books)` writes a list of books to a file with `json.dump`, and `load_catalogue(path)` reads it back with `json.load`.
- `restore_shelves(data)` undoes what a JSON round trip did to a shelf map: the keys come back as text and the tuples as lists.

## Examples

```python
to_json({"title": "Dune", "copies": 2})
# '{\n  "copies": 2,\n  "title": "Dune"\n}'

from_json('{"title": "Dune", "lent": false, "fine": null}')
# {"title": "Dune", "lent": False, "fine": None}

export({"due": datetime.date(2025, 3, 1), "tags": {"sci-fi", "classic"}})
# '{"due": "2025-03-01", "tags": ["classic", "sci-fi"]}'

shelves = {3: ("Dune", "Emma")}
from_json(json.dumps(shelves))                    # {"3": ["Dune", "Emma"]}
restore_shelves(from_json(json.dumps(shelves)))   # {3: ("Dune", "Emma")}
```

Watch for the lesson's pitfall: `json.dumps` raises `TypeError` for a date, a set or your own class, so convert them with a `default=` function.

## Run the tests

```bash
cd exercises/backend/py_serialization
pytest
```

The tests write their files into a temporary folder, so they never touch your own files.
Every test fails until you fill in the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
