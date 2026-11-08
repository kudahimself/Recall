"""Starter: keep a library's member dimension as SCD Type 1 and Type 2 Delta tables. Fill in each TODO.

Days are strings such as "2026-03-01". A staging snapshot is a DataFrame of today's rows;
to use it in SQL, register it first, e.g. staging.createOrReplaceTempView("stg_member").
"""


def create_dim_member(spark, table):
    """Create the empty SCD Type 2 Delta table `table` with these columns, in this order:

    member_sk BIGINT, member_id STRING, branch STRING, valid_from DATE, valid_to DATE,
    is_current BOOLEAN.
    """
    # TODO: one CREATE TABLE
    raise NotImplementedError


def apply_type2(spark, table, staging, load_day):
    """Bring the Type 2 dimension `table` in step with `staging` (member_id, branch) as of `load_day`.

    A member whose branch changed gets its current row closed (valid_to = load_day,
    is_current = false) and a new current row (valid_from = load_day, valid_to NULL).
    A new member gets a current row; an unchanged member is left alone.
    Each new row's member_sk follows the largest one already in the table, in member_id order
    (1, 2, 3 ... on an empty table). Running it twice with the same snapshot changes nothing.
    """
    # TODO: step 1, a MERGE that closes the changed current rows
    # TODO: step 2, an INSERT of a current row for every staged member that has none
    raise NotImplementedError


def member_sk_on(spark, table, member_id, day):
    """Return the member_sk of the version of `member_id` valid on `day`, or None.

    A version is valid from its valid_from day up to, but not including, its valid_to day.
    """
    # TODO
    raise NotImplementedError


def loans_by_branch(spark, loans, table):
    """Return [(branch, number of loans), ...] in branch order.

    `loans` is a DataFrame (loan_id, member_sk) that stored each loan's member version
    when it was loaded; count each loan under the branch of that version.
    """
    # TODO
    raise NotImplementedError


def fix_emails(spark, table, staging):
    """Apply `staging` (member_id, email) to the SCD Type 1 table `table` (member_id, email).

    Overwrite the email of a member already there and add a member who is not; keep no history.
    """
    # TODO: one MERGE on the natural key
    raise NotImplementedError
