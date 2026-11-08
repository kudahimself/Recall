import pytest

import workspace_names

LOANS = [(1, "Dune"), (2, "Emma"), (3, "Dune")]


@pytest.fixture(scope="module")
def saved_format(spark):
    # one Delta write shared by the Spark tests below
    return workspace_names.create_loans(spark, "platform_lib", LOANS)


@pytest.mark.parametrize(
    "ref, expected",
    [
        ("loans", "main.library.loans"),
        ("archive.loans", "main.archive.loans"),
        ("other.archive.loans", "other.archive.loans"),
    ],
)
def test_qualify_fills_in_the_missing_parts(ref, expected):
    assert workspace_names.qualify(ref, "main", "library") == expected


def test_qualify_rejects_four_part_names():
    with pytest.raises(ValueError):
        workspace_names.qualify("a.b.c.d", "main", "library")


def test_use_schema_keeps_the_catalog():
    assert workspace_names.apply_use(("main", "default"), "USE SCHEMA library") == ("main", "library")


def test_use_catalog_resets_the_schema_to_default():
    assert workspace_names.apply_use(("main", "library"), "USE CATALOG other") == ("other", "default")


def test_schema_chosen_before_the_catalog_is_lost():
    state = ("main", "default")
    for statement in ["USE SCHEMA library", "USE CATALOG other"]:
        state = workspace_names.apply_use(state, statement)
    assert state == ("other", "default")


def test_apply_use_rejects_other_statements():
    with pytest.raises(ValueError):
        workspace_names.apply_use(("main", "default"), "SELECT 1")


def test_grant_sql_quotes_the_principal():
    sql = workspace_names.grant_sql("SELECT", "SCHEMA", "cat.sch", "readers")
    assert " ".join(sql.split()) == "GRANT SELECT ON SCHEMA cat.sch TO `readers`"


def test_create_loans_saves_a_delta_table(spark, saved_format):
    assert saved_format == "delta"
    assert spark.table("platform_lib.loans").count() == 3


def test_list_tables_returns_permanent_tables_only(spark, saved_format):
    spark.sql("CREATE OR REPLACE TEMP VIEW platform_lib_scratch AS SELECT 1 AS x")
    assert workspace_names.list_tables(spark, "platform_lib") == ["loans"]


def test_save_query_stores_a_session_view_and_counts_its_rows(spark, saved_format):
    count = workspace_names.save_query(spark, "dune_loans", "SELECT * FROM platform_lib.loans WHERE title = 'Dune'")
    assert count == 2
    assert spark.table("dune_loans").count() == 2
