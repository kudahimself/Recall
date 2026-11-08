# Totals at the right grain

Topic: Grain & Double Counting (Data Engineering, Modeling for Analytics).
Time: about 20 minutes.

## Task

The shop's report shows, per customer, how many orders they placed, the shipping they paid and the goods they bought, and per month the conversion rate and the number of buyers.
`orders` is one row per order and `order_lines` one row per order line, so the two meet at different grains.
Fill in the five functions in `order_grain.py`:

- `key_is_unique(con, table, columns)` checks that a table's stated grain holds: no two rows share its key.
- `join_row_counts(con)` counts the rows before and after joining orders to their lines.
- `customer_totals(con)` adds up orders, shipping and goods per customer without counting any fee twice.
- `monthly_conversion(con)` gives each month's conversion rate from its parts.
- `monthly_buyers(con)` counts each month's distinct customers.

The tests run on DuckDB, an in-process database: each test opens a fresh one in memory and passes you the connection, so there is no server to start.
`strftime(day, '%Y-%m')` gives a date's month as text.

## Examples

```python
key_is_unique(con, "order_lines", ["order_id", "line_no"])   # True
join_row_counts(con)        # (5, 7): the join repeats each order once per line
customer_totals(con)        # [("c1", 3, 14, 102), ("c2", 2, 11, 15)]
monthly_conversion(con)     # [("2026-10", 1000, 55, 0.055), ("2026-11", 250, 30, 0.12)]
monthly_buyers(con)         # [("2026-10", 2), ("2026-11", 2)]
```

Watch for the lesson's pitfall: joining orders to their lines and then summing an order-level column such as `shipping`.
Each order is counted once per line, the total looks plausible, and nothing raises an error, so bring the lines to one row per order before the join; `SUM(DISTINCT shipping)` is no fix, since two orders can charge the same fee.
Ratios and distinct counts do not add up either: the tables hold daily `conversion` and `buyers` columns, and averaging or summing them gives the wrong month.

## Run the tests

```bash
cd exercises/data_engineering/de_grain_double_counting
pytest
```

Every test fails until you fill in the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
