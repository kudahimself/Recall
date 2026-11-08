import itertools
from pathlib import Path
from urllib.parse import urlparse

from visit_files import compact, compact_by, file_count, vacuum_default, vacuum_now

_ids = itertools.count()
CHECK = "spark.databricks.delta.retentionDurationCheck.enabled"


def build(spark, optimize=False):
    """A visits table with three small commits (versions 1 to 3 add one file each); optionally optimized (version 4)."""
    table = f"visits_{next(_ids)}"
    spark.sql(f"CREATE TABLE {table} (member_id INT, branch STRING)")
    for member in (3, 1, 2):
        spark.sql(f"INSERT INTO {table} VALUES ({member}, 'Leeds')")
    if optimize:
        spark.sql(f"OPTIMIZE {table}")
    return table


def disk_files(spark, table):
    """Parquet files physically in the table folder, used or not."""
    location = spark.sql(f"DESCRIBE DETAIL {table}").first()["location"]
    return len(list(Path(urlparse(location).path).glob("*.parquet")))


def rows(spark, table):
    return sorted(r["member_id"] for r in spark.table(table).collect())


def test_file_count_reports_the_files_of_the_current_version(spark):
    table = build(spark)
    assert file_count(spark, table) == 3


def test_compact_merges_small_files_without_changing_rows(spark):
    table = build(spark)
    compact(spark, table)
    assert file_count(spark, table) == 1
    assert rows(spark, table) == [1, 2, 3]


def test_compact_by_column_also_merges_files(spark):
    table = build(spark)
    compact_by(spark, table, "member_id")
    assert file_count(spark, table) == 1
    assert rows(spark, table) == [1, 2, 3]
    last = spark.sql(f"DESCRIBE HISTORY {table}").first()
    assert last["operation"] == "OPTIMIZE"
    assert "member_id" in last["operationParameters"]["zOrderBy"]


def test_default_vacuum_keeps_recent_files_and_old_versions(spark):
    table = build(spark, optimize=True)
    before = disk_files(spark, table)
    vacuum_default(spark, table)
    assert disk_files(spark, table) == before
    assert spark.read.option("versionAsOf", 3).table(table).count() == 3


def test_vacuum_now_deletes_the_replaced_files(spark):
    table = build(spark, optimize=True)
    before = disk_files(spark, table)
    vacuum_now(spark, table)
    assert disk_files(spark, table) < before
    assert disk_files(spark, table) == file_count(spark, table)
    assert rows(spark, table) == [1, 2, 3]


def test_vacuum_now_ends_time_travel_to_the_old_versions(spark):
    table = build(spark, optimize=True)
    vacuum_now(spark, table)
    try:
        spark.read.option("versionAsOf", 3).table(table).collect()
    except Exception:
        pass
    else:
        raise AssertionError("version 3 needed the vacuumed files, so reading it should fail")


def test_vacuum_now_leaves_the_safety_check_on(spark):
    table = build(spark, optimize=True)
    vacuum_now(spark, table)
    assert spark.conf.get(CHECK) == "true"
