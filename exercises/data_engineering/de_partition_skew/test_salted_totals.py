from salted_totals import combine, hot_keys, partial_sums, partition_sizes, salted_partition

# The lesson's orders: customer 8, a marketplace, has 8 of the 12.
ORDERS = [
    {"order_id": i, "customer_id": c, "amount": a}
    for i, c, a in [
        (1, 8, 10), (2, 8, 20), (3, 3, 15), (4, 8, 5), (5, 5, 30), (6, 8, 25),
        (7, 8, 10), (8, 6, 40), (9, 8, 15), (10, 1, 20), (11, 8, 30), (12, 8, 5),
    ]
]


def plain_totals(orders):
    totals = {}
    for o in orders:
        totals[o["customer_id"]] = totals.get(o["customer_id"], 0) + o["amount"]
    return totals


def test_partition_sizes_show_the_skew():
    assert partition_sizes(ORDERS, 4) == [8, 2, 1, 1]
    assert sum(partition_sizes(ORDERS, 3)) == 12


def test_more_machines_do_not_shrink_the_hot_partition():
    assert max(partition_sizes(ORDERS, 4)) == 8
    assert max(partition_sizes(ORDERS, 8)) == 8
    assert max(partition_sizes(ORDERS, 16)) == 8


def test_hot_keys_are_the_customers_over_the_share():
    assert hot_keys(ORDERS, 0.5) == [8]
    assert hot_keys(ORDERS, 0.05) == [1, 3, 5, 6, 8]
    assert hot_keys(ORDERS, 0.7) == []


def test_salting_spreads_only_the_hot_customer():
    assert [salted_partition(o, {8}, 4) for o in ORDERS[:4]] == [1, 2, 3, 0]
    sizes = [0] * 4
    for o in ORDERS:
        sizes[salted_partition(o, {8}, 4)] += 1
    assert sizes == [2, 4, 3, 3]
    # Without a hot key nothing moves.
    assert [salted_partition(o, set(), 4) for o in ORDERS] == [o["customer_id"] % 4 for o in ORDERS]


def test_partial_sums_split_the_hot_customer_over_partitions():
    parts = partial_sums(ORDERS, 4, {8})
    assert parts == [
        {8: 10},
        {8: 25, 5: 30, 1: 20},
        {8: 45, 6: 40},
        {8: 40, 3: 15},
    ]


def test_combine_gives_the_same_totals_as_the_unsalted_job():
    totals = combine(partial_sums(ORDERS, 4, {8}))
    assert totals == plain_totals(ORDERS)
    assert totals[8] == 120


def test_salting_works_for_any_machine_count_and_hot_set():
    for n in (2, 3, 5, 8):
        hot = set(hot_keys(ORDERS, 0.3))
        assert combine(partial_sums(ORDERS, n, hot)) == plain_totals(ORDERS)
        assert len(partial_sums(ORDERS, n, hot)) == n
