import pytest
from pyspark.sql import functions as F

import bookshop_frames

ROWS = [("Dune", "12.50", 412), ("Emma", "8.00", 474), ("Ubik", "6.25", 202), ("Persuasion", "9.99", 249)]


@pytest.fixture()
def raw(spark):
    return spark.createDataFrame(ROWS, ["title", "price", "pages"])


@pytest.fixture()
def priced(raw):
    return raw.withColumn("price", F.col("price").cast("double"))


def test_books_df_has_the_three_columns_and_every_row(spark):
    df = bookshop_frames.books_df(spark, ROWS)
    assert df.columns == ["title", "price", "pages"]
    assert sorted(tuple(r) for r in df.collect()) == sorted(ROWS)


def test_parse_prices_turns_text_into_double_and_keeps_column_order(raw):
    out = bookshop_frames.parse_prices(raw)
    assert out.columns == ["title", "price", "pages"]
    assert dict(out.dtypes)["price"] == "double"
    assert {r["title"]: r["price"] for r in out.collect()}["Dune"] == 12.5


def test_parse_prices_does_not_change_the_input_dataframe(raw):
    bookshop_frames.parse_prices(raw)
    assert dict(raw.dtypes)["price"] == "string"


def test_cheap_books_keeps_only_title_and_price_of_books_below_the_limit(priced):
    out = bookshop_frames.cheap_books(priced, 9)
    assert out.columns == ["title", "price"]
    assert sorted(tuple(r) for r in out.collect()) == [("Emma", 8.0), ("Ubik", 6.25)]


def test_cheap_books_limit_is_exclusive(priced):
    out = bookshop_frames.cheap_books(priced, 8.0)
    assert [r["title"] for r in out.collect()] == ["Ubik"]


def test_add_length_band_labels_long_and_short(priced):
    out = bookshop_frames.add_length_band(priced)
    assert {r["title"]: r["band"] for r in out.collect()} == {
        "Dune": "long", "Emma": "long", "Ubik": "short", "Persuasion": "short"}


def test_add_length_band_keeps_the_original_columns(priced):
    out = bookshop_frames.add_length_band(priced)
    assert out.columns == ["title", "price", "pages", "band"]


def test_add_price_with_vat_adds_twenty_percent(priced):
    out = bookshop_frames.add_price_with_vat(priced)
    assert "price" in out.columns
    got = {r["title"]: r["price_inc_vat"] for r in out.collect()}
    assert got["Dune"] == pytest.approx(15.0)
    assert got["Ubik"] == pytest.approx(7.5)
