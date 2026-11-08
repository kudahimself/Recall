"""Salt the hot customer: reference solution."""
from collections import Counter


def partition_sizes(orders, n):
    """Rows per partition when orders are hash partitioned on customer_id over n partitions."""
    sizes = [0] * n
    for order in orders:
        sizes[order["customer_id"] % n] += 1
    return sizes


def hot_keys(orders, share):
    """The customer ids that hold more than share of all the rows, in order."""
    counts = Counter(order["customer_id"] for order in orders)
    return sorted(c for c, rows in counts.items() if rows > share * len(orders))


def salted_partition(order, hot, n):
    """The partition of one order: a hot customer's orders spread by order_id, the rest by customer_id."""
    key = order["order_id"] if order["customer_id"] in hot else order["customer_id"]
    return key % n


def partial_sums(orders, n, hot):
    """Step 1: in each salted partition, the sum of amount per customer."""
    parts = [{} for _ in range(n)]
    for order in orders:
        part = parts[salted_partition(order, hot, n)]
        part[order["customer_id"]] = part.get(order["customer_id"], 0) + order["amount"]
    return parts


def combine(partials):
    """Step 2: add up each customer's partial sums into one total per customer."""
    totals = {}
    for part in partials:
        for customer, amount in part.items():
            totals[customer] = totals.get(customer, 0) + amount
    return totals
