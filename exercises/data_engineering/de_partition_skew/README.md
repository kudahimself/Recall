# Salt the hot customer

Topic: Partitioning, Skew & Hot Keys (Data Engineering, Distributed Data).
Time: about 20 minutes.

## Task

A nightly job totals order amounts per customer on several machines, each working on one partition of the orders.
One customer, a marketplace, places two thirds of the orders, so one machine does most of the work while the others wait.
Fill in the five functions in `salted_totals.py`:

- `partition_sizes(orders, n)` counts the rows each partition gets when the orders are partitioned on `customer_id`.
- `hot_keys(orders, share)` finds the customers that hold more than a share of the rows.
- `salted_partition(order, hot, n)` places one order, spreading the hot customers' orders by `order_id`.
- `partial_sums(orders, n, hot)` is step 1 of the salted job: a sum per customer inside each partition.
- `combine(partials)` is step 2: it adds each customer's partial sums into one total.

Plain Python: each partition is a list position and each machine's work is a loop.

## Examples

With the lesson's 12 orders:

```python
partition_sizes(ORDERS, 4)            # [8, 2, 1, 1]: the job waits on partition 0
partition_sizes(ORDERS, 8)            # partition 0 still has 8
hot_keys(ORDERS, 0.5)                 # [8]
partial_sums(ORDERS, 4, {8})          # [{8: 10}, {8: 25, 5: 30, 1: 20}, {8: 45, 6: 40}, {8: 40, 3: 15}]
combine(partial_sums(ORDERS, 4, {8})) # {8: 120, 5: 30, 1: 20, 6: 40, 3: 15}
```

Watch for the lesson's pitfall: adding machines to a skewed job.
Every row of the hot key still goes to one partition on one machine, so the step takes as long as before.
A step ends when its largest partition ends, so salt only the hot key, and do not forget the second step that adds the parts back together.

## Run the tests

```bash
cd exercises/data_engineering/de_partition_skew
pytest
```

Every test fails until you fill in the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
