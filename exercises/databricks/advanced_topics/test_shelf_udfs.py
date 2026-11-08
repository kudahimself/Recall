import contextlib
import io

import pytest

import shelf_udfs as su

LOANS = [("Dune", 20), ("Emma", 9), (None, 16), ("ulysses", 14)]


@pytest.fixture
def loans(spark):
    return spark.createDataFrame(LOANS, "title STRING, days INT")


def plan(df):
    out = io.StringIO()
    with contextlib.redirect_stdout(out):
        df.explain()
    return out.getvalue()


def test_shelf_is_a_python_udf_that_keeps_nulls(loans):
    out = loans.select(su.shelf("title").alias("code"))
    assert [r.code for r in out.collect()] == ["DU", "EM", None, "UL"]
    assert "BatchEvalPython" in plan(out), "shelf should run as a Python UDF"


def test_shelf_builtin_gives_the_same_codes_without_leaving_the_jvm(loans):
    out = loans.select(su.shelf_builtin("title").alias("code"))
    assert [r.code for r in out.collect()] == ["DU", "EM", None, "UL"]
    assert "EvalPython" not in plan(out), "use functions from pyspark.sql.functions, not a UDF"


def test_late_fee_is_a_pandas_udf(loans):
    out = loans.select(su.late_fee("days").alias("fee"))
    assert [r.fee for r in out.collect()] == [3.0, 0.0, 1.0, 0.0]
    assert "ArrowEvalPython" in plan(out), "late_fee should run as a pandas UDF, on Arrow batches"


def test_register_shelf_makes_it_callable_from_sql(spark, loans):
    su.register_shelf(spark)
    loans.createOrReplaceTempView("udf_loans")
    rows = spark.sql("SELECT shelf_sql(title) AS code FROM udf_loans").collect()
    assert [r.code for r in rows] == ["DU", "EM", None, "UL"]


@pytest.fixture
def days_late(spark):
    su.create_days_late(spark)
    yield
    spark.sql("DROP TEMPORARY FUNCTION IF EXISTS days_late")


def test_create_days_late_is_a_temporary_sql_function(spark, days_late):
    row = spark.sql("SELECT days_late(20) AS a, days_late(9) AS b, days_late(14) AS c").first()
    assert (row.a, row.b, row.c) == (6, 0, 0)
    assert spark.catalog.getFunction("days_late").isTemporary


@pytest.fixture
def small_batches(spark):
    """Arrow batches of 2 rows, so a value computed inside a pandas UDF covers only 2 rows."""
    key = "spark.sql.execution.arrow.maxRecordsPerBatch"
    old = spark.conf.get(key)
    spark.conf.set(key, "2")
    yield
    spark.conf.set(key, old)


def test_fee_share_divides_by_the_largest_fee_of_every_row(spark, small_batches):
    fees = spark.createDataFrame(
        [(1, 2.0), (2, 1.0), (3, 8.0), (4, 4.0), (5, 0.5), (6, 1.0)], "loan_id INT, fee DOUBLE"
    ).repartition(3)
    shares = {r.loan_id: r.share for r in su.fee_share(fees).collect()}
    assert shares == {1: 0.25, 2: 0.125, 3: 1.0, 4: 0.5, 5: 0.0625, 6: 0.125}
