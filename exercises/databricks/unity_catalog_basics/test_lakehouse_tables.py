import os

import pytest

import lakehouse_tables as lt


@pytest.mark.parametrize(
    "full_name, expected",
    [
        ("main.library.members", ("main", "library", "members")),
        ("cat.sch.t", ("cat", "sch", "t")),
    ],
)
def test_split_name_returns_catalog_schema_and_table(full_name, expected):
    assert lt.split_name(full_name) == expected


@pytest.mark.parametrize("full_name", ["members", "library.members", "a.b.c.d", "main..members"])
def test_split_name_rejects_anything_but_three_parts(full_name):
    with pytest.raises(ValueError):
        lt.split_name(full_name)


@pytest.fixture(scope="module")
def tables(spark, tmp_path_factory):
    location = str(tmp_path_factory.mktemp("uc_external_members"))
    lt.create_managed(spark, "uc_members_managed")
    lt.create_external(spark, "uc_members_external", location)
    return {"managed": "uc_members_managed", "external": "uc_members_external", "location": location}


def test_created_tables_have_the_two_columns(spark, tables):
    for table in (tables["managed"], tables["external"]):
        assert spark.table(table).columns == ["member_id", "city"]


def test_table_kind_tells_managed_from_external(spark, tables):
    assert lt.table_kind(spark, tables["managed"]) == "MANAGED"
    assert lt.table_kind(spark, tables["external"]) == "EXTERNAL"


def test_table_location_is_a_local_folder_that_exists(spark, tables):
    managed = lt.table_location(spark, tables["managed"])
    assert os.path.isdir(managed)
    assert not managed.startswith("file:")


def test_external_table_lives_where_location_said(spark, tables):
    assert os.path.realpath(lt.table_location(spark, tables["external"])) == os.path.realpath(tables["location"])


def test_dropping_a_managed_table_deletes_its_files(spark):
    lt.create_managed(spark, "uc_drop_managed")
    assert lt.drop_removes_files(spark, "uc_drop_managed") is True


def test_dropping_an_external_table_leaves_its_files(spark, tmp_path):
    location = str(tmp_path / "members_files")
    lt.create_external(spark, "uc_drop_external", location)
    assert lt.drop_removes_files(spark, "uc_drop_external") is False
    assert os.path.isdir(location)
    assert not spark.catalog.tableExists("uc_drop_external")
