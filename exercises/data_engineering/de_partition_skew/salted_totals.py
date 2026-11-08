"""Salt the hot customer: find the skew, spread the hot key, and combine the partial results.

An order is a dict such as {"order_id": 4, "customer_id": 8, "amount": 5}.
The job totals amount per customer on n machines, one partition each, and a partition's
number is a key modulo n (for whole numbers that is what hash partitioning does).
Fill in each function so the tests in test_salted_totals.py pass.
Run them from this folder with: pytest
"""


def partition_sizes(orders, n):
    """Rows per partition when orders are partitioned on customer_id % n: a list of n counts.

    With the lesson's 12 orders and n = 4 -> [8, 2, 1, 1].
    """
    # TODO
    raise NotImplementedError


def hot_keys(orders, share):
    """The customer ids that hold more than share (a fraction such as 0.25) of all the rows, in order."""
    # TODO
    raise NotImplementedError


def salted_partition(order, hot, n):
    """The partition of one order when the customers in hot are salted.

    A hot customer's orders are spread by order_id % n; every other order stays on customer_id % n.
    """
    # TODO
    raise NotImplementedError


def partial_sums(orders, n, hot):
    """Step 1: in each salted partition, the sum of amount per customer.

    Return a list of n dicts, one per partition, of customer_id -> that partition's sum.
    A hot customer appears in several partitions; every other customer in one.
    """
    # TODO
    raise NotImplementedError


def combine(partials):
    """Step 2: add up each customer's partial sums into one total per customer: a dict."""
    # TODO
    raise NotImplementedError
