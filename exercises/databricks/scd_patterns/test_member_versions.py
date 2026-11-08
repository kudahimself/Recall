import itertools
from datetime import date

import pytest

from member_versions import apply_type2, create_dim_member, fix_emails, loans_by_branch, member_sk_on

_ids = itertools.count()
JAN, MAR = "2026-01-01", "2026-03-01"


def snapshot(spark, *rows):
    return spark.createDataFrame(list(rows), "member_id STRING, branch STRING")


def build(spark):
    """The lesson's dimension: m1 leeds and m2 york from January, then March's snapshot, run twice."""
    table = f"scd_members_{next(_ids)}"
    create_dim_member(spark, table)
    apply_type2(spark, table, snapshot(spark, ("m1", "leeds"), ("m2", "york")), JAN)
    march = snapshot(spark, ("m1", "hull"), ("m2", "york"), ("m3", "leeds"))
    apply_type2(spark, table, march, MAR)
    apply_type2(spark, table, march, MAR)  # the job's retry
    return table


def versions(spark, table):
    q = f"SELECT * FROM {table} ORDER BY member_sk"
    return [tuple(r) for r in spark.sql(q).collect()]


@pytest.fixture(scope="module")
def members(spark):
    return build(spark)


def test_the_dimension_has_the_type2_columns(spark):
    table = f"scd_empty_{next(_ids)}"
    create_dim_member(spark, table)
    schema = [(f.name, f.dataType.simpleString()) for f in spark.table(table).schema]
    assert schema == [("member_sk", "bigint"), ("member_id", "string"), ("branch", "string"),
                      ("valid_from", "date"), ("valid_to", "date"), ("is_current", "boolean")]


def test_a_first_load_makes_one_current_row_per_member(spark):
    table = f"scd_first_{next(_ids)}"
    create_dim_member(spark, table)
    apply_type2(spark, table, snapshot(spark, ("m2", "york"), ("m1", "leeds")), JAN)
    assert versions(spark, table) == [
        (1, "m1", "leeds", date(2026, 1, 1), None, True),
        (2, "m2", "york", date(2026, 1, 1), None, True),
    ]


def test_a_change_closes_the_old_row_and_adds_one_version_however_often_it_runs(spark, members):
    assert versions(spark, members) == [
        (1, "m1", "leeds", date(2026, 1, 1), date(2026, 3, 1), False),
        (2, "m2", "york", date(2026, 1, 1), None, True),
        (3, "m1", "hull", date(2026, 3, 1), None, True),
        (4, "m3", "leeds", date(2026, 3, 1), None, True),
    ]


def test_each_member_has_one_current_row(spark, members):
    current = spark.sql(f"SELECT member_id, COUNT(*) AS n FROM {members} WHERE is_current GROUP BY member_id")
    assert sorted(tuple(r) for r in current.collect()) == [("m1", 1), ("m2", 1), ("m3", 1)]


@pytest.mark.parametrize(
    "member_id, day, sk",
    [("m1", "2026-02-15", 1), ("m1", "2026-03-01", 3), ("m1", "2026-06-30", 3), ("m2", "2026-06-30", 2),
     ("m3", "2026-02-15", None), ("m1", "2025-12-31", None)],
)
def test_member_sk_on_finds_the_version_of_that_day(spark, members, member_id, day, sk):
    assert member_sk_on(spark, members, member_id, day) == sk


def test_loans_count_under_the_version_they_were_loaded_with(spark, members):
    loans = spark.createDataFrame([("L1", 1), ("L2", 3), ("L3", 2), ("L4", 4)], "loan_id STRING, member_sk BIGINT")
    # On the natural key, m1's two versions would count L1 and L2 twice each.
    assert loans_by_branch(spark, loans, members) == [("hull", 1), ("leeds", 2), ("york", 1)]


def test_type1_overwrites_and_keeps_no_history(spark):
    table = f"scd_emails_{next(_ids)}"
    spark.sql(f"CREATE TABLE {table} (member_id STRING, email STRING)")
    spark.sql(f"INSERT INTO {table} VALUES ('m1', 'ann@exmaple.org'), ('m2', 'bo@example.org')")
    staged = spark.createDataFrame([("m1", "ann@example.org"), ("m3", "cy@example.org")], "member_id STRING, email STRING")
    fix_emails(spark, table, staged)
    fix_emails(spark, table, staged)
    rows = sorted(tuple(r) for r in spark.table(table).collect())
    assert rows == [("m1", "ann@example.org"), ("m2", "bo@example.org"), ("m3", "cy@example.org")]
