import pytest

from book_star import average_price_by_genre, build_dim_book, build_fact_receipt, build_fact_sale, sales_by_genre


@pytest.fixture(scope="module")
def books(spark):
    # Listed out of code order on purpose: the surrogate keys still follow book_code.
    return spark.createDataFrame(
        [("B-03", "Ubik", "scifi"), ("B-01", "Dune", "scifi"), ("B-02", "Emma", "classic")],
        "book_code STRING, title STRING, genre STRING",
    )


@pytest.fixture(scope="module")
def lines(spark):
    # The lesson's receipts: 100 sold two Dune and one Emma, 101 one Ubik, 102 one Dune.
    return spark.createDataFrame(
        [(100, "B-01", 2, 9), (100, "B-02", 1, 7), (101, "B-03", 1, 12), (102, "B-01", 1, 9)],
        "receipt_id INT, book_code STRING, qty INT, price INT",
    )


@pytest.fixture(scope="module")
def receipts(spark):
    return spark.createDataFrame([(100, 3), (101, 2), (102, 2), (103, 0)], "receipt_id INT, shipping INT")


def test_the_dimension_numbers_books_in_code_order(books):
    dim = build_dim_book(books)
    assert dim.columns == ["book_sk", "book_code", "title", "genre"]
    rows = [tuple(r) for r in dim.orderBy("book_sk").collect()]
    assert rows == [(1, "B-01", "Dune", "scifi"), (2, "B-02", "Emma", "classic"), (3, "B-03", "Ubik", "scifi")]


def test_the_sales_fact_keeps_only_keys_and_measures(books, lines):
    fact = build_fact_sale(lines, build_dim_book(books))
    assert fact.columns == ["receipt_id", "book_sk", "qty", "amount"]
    rows = sorted(tuple(r) for r in fact.collect())
    assert rows == [(100, 1, 2, 18), (100, 2, 1, 7), (101, 3, 1, 12), (102, 1, 1, 9)]


def test_sales_by_genre_sums_the_additive_measures(books, lines):
    dim = build_dim_book(books)
    assert sales_by_genre(build_fact_sale(lines, dim), dim) == [("classic", 1, 7), ("scifi", 4, 39)]


def test_an_average_is_worked_out_from_its_parts(books, lines):
    dim = build_dim_book(books)
    # scifi sold 4 copies for 39, so 9.75 a copy; averaging the three lines' prices gives 10.0.
    assert average_price_by_genre(build_fact_sale(lines, dim), dim) == {"classic": 7.0, "scifi": 9.75}


def test_the_receipt_fact_counts_each_shipping_charge_once(lines, receipts):
    fact = build_fact_receipt(lines, receipts)
    assert fact.columns == ["receipt_id", "books", "items_amount", "shipping"]
    rows = sorted(tuple(r) for r in fact.collect())
    assert rows == [(100, 3, 25, 3), (101, 1, 12, 2), (102, 1, 9, 2), (103, 0, 0, 0)]
    # Copied onto receipt 100's two lines, its 3 would be summed twice, making 10, not 7.
    assert fact.agg({"shipping": "sum"}).first()[0] == 7
