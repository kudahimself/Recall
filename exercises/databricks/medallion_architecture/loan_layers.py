"""Starter: carry loan records through Bronze, Silver and Gold Delta tables. Fill in each TODO.

Bronze holds every record as it arrived, all text: (loan_id, branch, fee, batch, source_file).
A loan can arrive more than once, a later batch correcting an earlier one, and a record can
have no loan_id or a fee that is not a number.
"""


def add_to_bronze(spark, records, source_file, bronze):
    """Append `records`, tuples of strings (loan_id, branch, fee, batch), to the `bronze` table.

    Add a `source_file` column holding `source_file` on every row, so each record keeps its lineage.
    Create the table on the first call, keep every row, and never change rows already there.
    """
    # TODO: a DataFrame of the records plus the lineage column, appended as a table
    raise NotImplementedError


def build_silver(spark, bronze, silver):
    """Rebuild the `silver` table from `bronze`: one trusted row per loan.

    Columns: loan_id, branch, fee (an INT, NULL when the text is not a number).
    Leave out records with no loan_id, and keep only the latest batch of each loan
    (compare batches as numbers).
    """
    # TODO: one CREATE OR REPLACE TABLE ... AS SELECT, with try_cast and a ROW_NUMBER window
    raise NotImplementedError


def build_quarantine(spark, bronze, quarantine):
    """Rebuild the `quarantine` table with the Bronze records Silver leaves out for having no loan_id.

    Keep all of Bronze's columns, so someone can see where each one came from.
    """
    # TODO: one CREATE OR REPLACE TABLE ... AS SELECT
    raise NotImplementedError


def build_gold(spark, silver, gold):
    """Rebuild the `gold` table from `silver`: per branch, the number of `loans` and the total `fees`."""
    # TODO: one CREATE OR REPLACE TABLE ... AS SELECT with GROUP BY
    raise NotImplementedError
