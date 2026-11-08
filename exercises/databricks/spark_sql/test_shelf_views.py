import pytest

import shelf_views as q


def rows(df):
    return sorted((tuple(r) for r in df.collect()), key=repr)


@pytest.fixture(scope="module")
def views(spark):
    spark.createDataFrame(
        [("Dune", 120), ("Emma", 40), ("Solaris", 3), ("Ulysses", 20), ("Persuasion", 100)],
        "book string, copies int",
    ).createOrReplaceTempView("stock")
    spark.createDataFrame(
        [("Dune", "North", 5), ("Dune", "South", 7), ("Dune", "North", 1), ("Emma", "North", 4)],
        "book string, branch string, copies int",
    ).createOrReplaceTempView("branch_stock")
    return spark


def test_register_sales_makes_the_dataframe_queryable(spark):
    df = spark.createDataFrame([("Dune", "North", "5"), ("Emma", "South", "9")], "book string, branch string, copies string")
    q.register_sales(df)
    assert spark.sql("SELECT COUNT(*) AS n FROM raw_sales").first()["n"] == 2


def test_clean_sales_casts_text_to_int(spark):
    df = spark.createDataFrame([("Dune", "North", "5"), ("Emma", "South", "12")], "book string, branch string, copies string")
    q.register_sales(df)
    result = spark.sql(q.clean_sales_sql())
    assert dict(result.dtypes)["copies"] == "int"
    assert rows(result) == [("Dune", "North", 5), ("Emma", "South", 12)]


def test_clean_sales_turns_bad_text_into_null_instead_of_failing(spark):
    df = spark.createDataFrame([("Dune", "North", "5"), ("Emma", "South", "n/a")], "book string, branch string, copies string")
    q.register_sales(df)
    assert rows(spark.sql(q.clean_sales_sql())) == [("Dune", "North", 5), ("Emma", "South", None)]


def test_stock_band_uses_the_first_matching_branch(views):
    result = dict(rows(views.sql(q.stock_band_sql())))
    assert result == {"Dune": "high", "Emma": "mid", "Solaris": "low", "Ulysses": "mid", "Persuasion": "mid"}


def test_copies_by_branch_pivots_branches_into_columns(views):
    result = views.sql(q.copies_by_branch_sql())
    assert result.columns == ["book", "North", "South"]
    assert rows(result) == [("Dune", 6, 7), ("Emma", 4, None)]


def test_low_stock_view_holds_only_the_small_stocks(views):
    q.define_low_stock_view(views)
    assert rows(views.table("low_stock")) == [("Solaris", 3)]


def test_low_stock_view_can_be_defined_twice_without_error(views):
    q.define_low_stock_view(views)
    assert views.table("low_stock").count() == 1
