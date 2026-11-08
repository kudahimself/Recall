"""Sales that arrive late: deduplicate a staged batch and rebuild the days it touches.

The tests open an in-memory DuckDB database with these tables and pass you its connection:
  stg_sales(sale_id INTEGER, sale_date DATE, amount INTEGER, version INTEGER, ingested_on DATE)
      the new batch, with redelivered copies, corrected versions and late rows;
      sale_date is when the sale happened, ingested_on when the row arrived
  fact_sales(sale_id INTEGER, sale_date DATE, amount INTEGER, version INTEGER)   one row per sale
  daily_revenue(sale_date DATE, sales INTEGER, revenue INTEGER)                  one row per day with sales

Run SQL with con.execute(sql, [params]) and read rows with .fetchall() or .fetchone().
Dates come back from DuckDB as datetime.date.
Fill in each function so the tests in test_late_sales.py pass.
Run them from this folder with: pytest
"""


def newest_staged(con):
    """One row per staged sale, its newest version: (sale_id, sale_date, amount, version), by sale_id.

    The newest is the highest version, whatever order the copies arrived in.
    """
    # TODO
    raise NotImplementedError


def touched_days(con):
    """The days this batch changes, in order, as datetime.date values.

    A staged sale changes fact_sales only when its newest version is newer than the version
    fact_sales holds (or fact_sales does not have the sale yet).
    Each such sale touches its sale_date and, when fact_sales already has it, the sale_date
    it had there, since a corrected version can move a sale to another day.
    """
    # TODO
    raise NotImplementedError


def load_batch(con):
    """Write the batch's new versions into fact_sales and rebuild daily_revenue for every touched day.

    Each changed sale replaces its row in fact_sales.
    Every touched day of daily_revenue is rebuilt from fact_sales, and a day left with no sales
    loses its row; other days are not changed.
    One transaction. Return touched_days' list; loading the same batch again returns [].
    """
    # TODO
    raise NotImplementedError
