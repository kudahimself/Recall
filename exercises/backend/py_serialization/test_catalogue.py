import datetime
import json

import pytest

from catalogue import encode_extra, export, from_json, load_catalogue, restore_shelves, save_catalogue, to_json


def test_to_json_is_indented_with_sorted_keys():
    assert to_json({"title": "Dune", "copies": 2}) == '{\n  "copies": 2,\n  "title": "Dune"\n}'


def test_from_json_maps_json_words_to_python():
    assert from_json('{"title": "Dune", "lent": false, "fine": null, "tags": ["a"]}') == {
        "title": "Dune", "lent": False, "fine": None, "tags": ["a"],
    }


def test_encode_extra_converts_dates_and_sets():
    assert encode_extra(datetime.date(2025, 3, 1)) == "2025-03-01"
    assert encode_extra({"sci-fi", "classic"}) == ["classic", "sci-fi"]
    with pytest.raises(TypeError):
        encode_extra(object())


def test_export_handles_dates_and_sets():
    record = {"title": "Dune", "due": datetime.date(2025, 3, 1), "tags": {"sci-fi", "classic"}}
    assert export(record) == '{"due": "2025-03-01", "tags": ["classic", "sci-fi"], "title": "Dune"}'


def test_save_and_load_round_trip(tmp_path):
    path = tmp_path / "catalogue.json"
    books = [{"title": "Dune", "copies": 2}, {"title": "Emma", "copies": 1}]
    save_catalogue(path, books)
    assert json.loads(path.read_text()) == books
    assert load_catalogue(path) == books


def test_restore_shelves_after_a_round_trip():
    shelves = {3: ("Dune", "Emma"), 10: ("Ubik",)}
    returned = json.loads(json.dumps(shelves))
    assert returned == {"3": ["Dune", "Emma"], "10": ["Ubik"]}
    assert restore_shelves(returned) == shelves
