"""Products past the mark: an incremental load with a high-water mark, and the full reload beside it.

The tests open an in-memory DuckDB database with these tables and pass you its connection:
  src_products(product_id INTEGER, price INTEGER, updated_at TIMESTAMP)   the source system's table
  dim_product(product_id INTEGER, price INTEGER)                          the warehouse copy
  load_state(tbl VARCHAR, last_loaded TIMESTAMP)                          one row, tbl = 'products'

Run SQL with con.execute(sql, [params]) and read rows with .fetchall() or .fetchone().
Fill in each function so the tests in test_product_marks.py pass.
Run them from this folder with: pytest
"""


def load_incremental(con, crash_before_mark=None):
    """Upsert the source rows changed since the mark into dim_product, then move the mark; return the rows read.

    The mark is load_state.last_loaded: read the rows whose updated_at is past it.
    Each changed product replaces its old row by product_id; it is never appended beside it.
    The new mark is the highest updated_at among the rows this run read, and a run that reads
    nothing leaves the mark where it was.
    Rows and mark change in one transaction.
    crash_before_mark stands in for a crash: when it is given, call it after writing the rows
    and before moving the mark, and let its exception reach the caller.
    """
    # TODO
    raise NotImplementedError


def load_full(con):
    """Replace dim_product with every source row, in one transaction; return the rows loaded.

    Also set the mark to the highest updated_at in the source, so an incremental run can follow.
    """
    # TODO
    raise NotImplementedError


def missed_deletes(con):
    """The product ids dim_product still holds that the source no longer has, in order.

    missed_deletes(con) -> [1] after product 1 is deleted at the source and only incremental runs follow.
    """
    # TODO
    raise NotImplementedError
