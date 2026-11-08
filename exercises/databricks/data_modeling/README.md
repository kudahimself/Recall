# A star for the bookshop

Topic: Dimensional Modeling (star schema, fact/dim, grain, surrogate keys) (Databricks, Data Modeling & Warehousing Design).
Time: about 20 minutes.

## Task

A bookshop's till sends one row per book on a receipt, `(receipt_id, book_code, qty, price)`, and the shop wants a star schema to report on.
You build it in `book_star.py` from Spark DataFrames, a dimension and two facts, each at a grain you can say in one sentence:

- `build_dim_book(books)` gives each book a surrogate key `book_sk`, 1, 2, 3 ... in `book_code` order, and keeps `book_code` as the natural key.
- `build_fact_sale(lines, dim_book)` is the sales fact, one row per book on a receipt: `book_sk` in place of the code, `qty`, and `amount = qty * price`, with no descriptive columns.
- `sales_by_genre(fact_sale, dim_book)` joins the fact to the dimension on `book_sk` and sums copies and revenue per genre.
- `average_price_by_genre(fact_sale, dim_book)` works out the price paid per copy, a non-additive measure, from its additive parts.
- `build_fact_receipt(lines, receipts)` is a second fact, one row per receipt, that holds each receipt's shipping charge.

## Examples

```python
dim = build_dim_book(books)         # (1, "B-01", "Dune", "scifi"), (2, "B-02", "Emma", "classic"), ...
fact = build_fact_sale(lines, dim)  # (100, 1, 2, 18), (100, 2, 1, 7), (101, 3, 1, 12), (102, 1, 1, 9)
sales_by_genre(fact, dim)           # [("classic", 1, 7), ("scifi", 4, 39)]
average_price_by_genre(fact, dim)   # {"classic": 7.0, "scifi": 9.75}, not the 10.0 that AVG(price) gives
```

Watch for the lesson's pitfall: shipping is a value of the whole receipt, so it does not belong on its lines.
Joined onto receipt 100's two lines before summing, its charge of 3 counts twice; bring the lines to the receipt grain first, then join, so the shipping total is the receipts' own total.

## What differs on Databricks

On Databricks the dimension and facts would be Delta tables in Unity Catalog, and `book_sk` usually an identity column, `BIGINT GENERATED ALWAYS AS IDENTITY`, that numbers new rows as they are inserted.
The local Spark and Delta versions here reject an identity column in `CREATE TABLE`, so `row_number()` over the natural key hands out the keys instead.
Unity Catalog can also record the star with `PRIMARY KEY` and `FOREIGN KEY` constraints, which document the joins but are not enforced.

## Run the tests

Set up Java and the packages once (see `exercises/databricks/README.md`), then:

```bash
cd exercises/databricks/data_modeling
pytest
```

The first run starts Spark and takes a little while.
Every test fails until you fill in the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
