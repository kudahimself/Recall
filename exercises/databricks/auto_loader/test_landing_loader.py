import itertools
import json

import pytest

from landing_loader import auto_loader_options, evolve_schema, load_new_files, source_problems

_ids = itertools.count()
GOOD = {"cloudFiles.format": "json", "cloudFiles.schemaLocation": "/Volumes/main/library/chk/returns"}


def test_options_for_json_name_the_format_and_schema_location():
    assert auto_loader_options("json", "/chk") == {
        "cloudFiles.format": "json",
        "cloudFiles.schemaLocation": "/chk",
    }


def test_options_for_csv_add_hints_and_the_header():
    assert auto_loader_options("csv", "/chk", "copies INT") == {
        "cloudFiles.format": "csv",
        "cloudFiles.schemaLocation": "/chk",
        "cloudFiles.schemaHints": "copies INT",
        "header": "true",
    }


def test_a_correct_source_has_no_problems():
    assert source_problems("cloudFiles", GOOD, "/Volumes/main/library/landing/returns") == []


def test_a_plain_json_stream_is_not_auto_loader():
    assert source_problems("json", GOOD, "/Volumes/main/library/landing/returns") == ["format"]


def test_every_problem_is_named_sorted():
    problems = source_problems("json", {"cloudFiles.format": "json"}, "dbfs:/mnt/landing/returns")
    assert problems == ["cloudFiles.schemaLocation", "format", "path"]
    assert source_problems("cloudFiles", GOOD, "/mnt/landing") == ["path"]


def test_no_new_column_changes_nothing():
    assert evolve_schema(["isbn", "copies"], ["copies", "isbn"]) == (["isbn", "copies"], False)


def test_add_new_columns_stops_once_with_the_columns_added_in_order():
    assert evolve_schema(["isbn"], ["isbn", "shelf", "branch"]) == (["isbn", "shelf", "branch"], True)


@pytest.mark.parametrize(
    "mode, stops",
    [("rescue", False), ("failOnNewColumns", True), ("none", False)],
)
def test_other_modes_keep_the_schema(mode, stops):
    assert evolve_schema(["isbn"], ["isbn", "shelf"], mode) == (["isbn"], stops)


def write_file(folder, name, records):
    folder.mkdir(exist_ok=True)
    (folder / name).write_text("".join(json.dumps(r) + "\n" for r in records))


def test_each_file_is_loaded_once_with_its_name(spark, tmp_path):
    landing = tmp_path / "landing"
    target = f"loader_returns_{next(_ids)}"
    schema = "isbn STRING, copies INT"
    write_file(landing, "day1.json", [{"isbn": "A1", "copies": 1}, {"isbn": "B2", "copies": "two"}])
    load_new_files(spark, str(landing), schema, target, str(tmp_path / "chk"))
    rows = {r["isbn"]: (r["copies"], r["file_name"]) for r in spark.table(target).collect()}
    assert rows == {"A1": (1, "day1.json"), "B2": (None, "day1.json")}

    write_file(landing, "day2.json", [{"isbn": "C3", "copies": 4}])
    load_new_files(spark, str(landing), schema, target, str(tmp_path / "chk"))
    rows = sorted((r["isbn"], r["file_name"]) for r in spark.table(target).collect())
    assert rows == [("A1", "day1.json"), ("B2", "day1.json"), ("C3", "day2.json")]
