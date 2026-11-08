"""Starter: gold tables for a bookshop, built from its silver tables. Fill in each TODO.

Silver tables, by name:
- receipts (receipt_id INT, sale_day DATE, total INT, is_test BOOLEAN): one row per receipt;
- receipt_lines (receipt_id INT, isbn STRING, price INT): one row per book sold;
- books (isbn STRING, title STRING, genre STRING): one row per book.
Gold's business rule, for every function here: receipts with is_test = true are left out.
Days are strings such as "2026-03-02".
"""


def daily_sales(spark, receipts, lines):
    """Return a DataFrame with one row per sale_day: sale_day, revenue, books, in sale_day order.

    revenue sums the receipts' totals and books counts their lines; a receipt with no lines
    still adds its total, with 0 books.
    """
    # TODO: bring the lines to the receipt grain first, then join and aggregate
    raise NotImplementedError


def sales_obt(spark, receipts, lines, books):
    """Return One Big Table at the line grain: receipt_id, sale_day, isbn, title, genre, price.

    One row per receipt line, with the receipt's day and the book's title and genre joined on.
    """
    # TODO
    raise NotImplementedError


def weekly_sales(spark, gold):
    """Return a rollup of the daily table `gold`: week_start, revenue, books, in week order.

    A week starts on Monday (date_trunc("week", ...) gives that day as a timestamp: cast it to DATE).
    Build it from gold and keep gold as it is.
    """
    # TODO
    raise NotImplementedError


def replay_from(spark, receipts, lines, gold, day):
    """Rebuild the daily table `gold` from `day` on, leaving the rows before `day` untouched."""
    # TODO: one INSERT INTO ... REPLACE WHERE, from daily_sales
    raise NotImplementedError


def publish(spark, view, table, receipts):
    """Point `view` at `table`, but only once `table`'s revenue adds up to the receipts' totals.

    Return True when the view was switched, and False, leaving the view as it was, when not.
    """
    # TODO: check the new table, then CREATE OR REPLACE VIEW
    raise NotImplementedError
