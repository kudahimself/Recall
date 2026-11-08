"""Customers through time: keep a Type 2 customer dimension and join facts to the version of their day.

The tests open an in-memory DuckDB database with these tables and pass you its connection:
  dim_customer(customer_key INTEGER, customer_id VARCHAR, city VARCHAR, email VARCHAR,
               valid_from DATE, valid_to DATE)
      one row per version; a version holds valid_from <= day < valid_to,
      and the current version ends on 9999-12-31
  source_customers(customer_id VARCHAR, city VARCHAR, email VARCHAR)   today's copy of the source
  fact_sales(sale_id INTEGER, customer_id VARCHAR, sale_date DATE, amount INTEGER, customer_key INTEGER)
      customer_key is NULL until the sale is stamped with its version

Dates are passed as ISO strings such as "2026-10-01".
Run SQL with con.execute(sql, [params]) and read rows with .fetchall() or .fetchone().
Fill in each function so the tests in test_customer_versions.py pass.
Run them from this folder with: pytest
"""


def apply_snapshot(con, as_of):
    """Bring dim_customer in line with source_customers as of a date; return how many versions were added.

    city is Type 2: when it differs from the current version, close that version
    (valid_to = as_of) and add a new one from as_of to 9999-12-31.
    A customer the dimension does not have yet gets a first version from as_of.
    email is Type 1: overwrite it on every version of the customer, without a new version.
    New versions take new customer_keys, one more than the highest so far, in customer_id order.
    Customers missing from the source are left as they are.
    One transaction; applying the same snapshot again adds nothing and returns 0.
    """
    # TODO
    raise NotImplementedError


def version_on(con, customer_id, day):
    """The customer_key of the version valid on day, or None when the customer had none.

    version_on(con, "C-07", "2026-05-31") -> 1 (Leeds)
    version_on(con, "C-07", "2026-06-01") -> 2 (York, from the move date itself)
    """
    # TODO
    raise NotImplementedError


def stamp_sales(con):
    """Fill fact_sales.customer_key, where it is NULL, with the version valid on the sale's date.

    Return how many sales were stamped; a sale with no version for its date stays NULL.
    """
    # TODO
    raise NotImplementedError


def revenue_by_city(con):
    """(city, revenue) by city, each stamped sale under the city of its version."""
    # TODO
    raise NotImplementedError
