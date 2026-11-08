from datetime import date

from schema_compat import admit_batch, batch_problems, breaking_changes, schema_changes


def col(type_, nullable=False):
    return {"type": type_, "nullable": nullable}


ORDERS = {
    "order_id": col("int"),
    "load_day": col("date"),
    "amount": col("int"),
    "coupon": col("string", nullable=True),
}


def test_safe_changes_are_classified():
    new = dict(ORDERS, order_id=col("bigint"), channel=col("string", nullable=True), load_day=col("date", nullable=True))
    assert schema_changes(ORDERS, new) == [
        ("channel", "added nullable"),
        ("load_day", "made nullable"),
        ("order_id", "widened"),
    ]
    assert breaking_changes(ORDERS, new) == []


def test_a_rename_is_a_drop_and_an_add():
    new = {k: v for k, v in ORDERS.items() if k != "amount"}
    new["amount_cents"] = col("int")
    assert schema_changes(ORDERS, new) == [("amount", "dropped"), ("amount_cents", "added required")]
    assert breaking_changes(ORDERS, new) == [("amount", "dropped"), ("amount_cents", "added required")]


def test_narrowing_and_retyping_break_readers():
    old = {"qty": col("bigint"), "price": col("double"), "sku": col("string")}
    new = {"qty": col("int"), "price": col("float"), "sku": col("int")}
    assert breaking_changes(old, new) == [("price", "retyped"), ("qty", "retyped"), ("sku", "retyped")]


def test_making_a_column_required_breaks_writers():
    new = dict(ORDERS, coupon=col("string"))
    assert breaking_changes(ORDERS, new) == [("coupon", "made required")]


def test_a_column_can_change_type_and_nullability_at_once():
    old = {"qty": col("int", nullable=True)}
    new = {"qty": col("bigint")}
    assert schema_changes(old, new) == [("qty", "made required"), ("qty", "widened")]
    assert breaking_changes(old, new) == [("qty", "made required")]
    assert schema_changes(old, old) == []


def test_a_matching_batch_has_no_problems():
    rows = [
        {"order_id": 1, "load_day": date(2026, 11, 1), "amount": 40},
        {"order_id": 2, "load_day": date(2026, 11, 1), "amount": 25, "coupon": "AUTUMN"},
    ]
    assert batch_problems(ORDERS, rows) == []


def test_the_lessons_renamed_field_is_caught():
    rows = [
        {"order_id": 5, "load_day": date(2026, 11, 3), "amount_cents": 3000},
        {"order_id": 6, "load_day": date(2026, 11, 3), "amount_cents": 4500},
    ]
    assert batch_problems(ORDERS, rows) == [
        "unexpected column amount_cents",
        "row 1: amount is null",
        "row 2: amount is null",
    ]


def test_wrong_types_and_nulls_are_reported_row_by_row():
    rows = [
        {"order_id": "7", "load_day": "2026-11-04", "amount": None},
        {"order_id": 8, "load_day": date(2026, 11, 4), "amount": True, "coupon": 5},
    ]
    assert batch_problems(ORDERS, rows) == [
        "row 1: order_id is not int",
        "row 1: load_day is not date",
        "row 1: amount is null",
        "row 2: amount is not int",
        "row 2: coupon is not string",
    ]


def test_float_columns_accept_whole_numbers():
    schema = {"price": col("double")}
    assert batch_problems(schema, [{"price": 3}, {"price": 2.5}]) == []
    assert batch_problems(schema, [{"price": "2.5"}]) == ["row 1: price is not double"]


def test_admit_batch_holds_the_whole_batch_when_any_row_fails():
    table = [{"order_id": 1, "load_day": date(2026, 11, 1), "amount": 40, "coupon": None}]
    rows = [
        {"order_id": 2, "load_day": date(2026, 11, 2), "amount": 35},
        {"order_id": 3, "load_day": date(2026, 11, 2), "amount_cents": 5000},
    ]
    status, problems = admit_batch(table, ORDERS, rows)
    assert status == "held"
    assert problems == ["unexpected column amount_cents", "row 2: amount is null"]
    assert len(table) == 1


def test_admit_batch_loads_rows_with_the_declared_columns():
    table = []
    rows = [{"amount": 35, "order_id": 2, "load_day": date(2026, 11, 2)}]
    assert admit_batch(table, ORDERS, rows) == ("loaded", 1)
    assert table == [{"order_id": 2, "load_day": date(2026, 11, 2), "amount": 35, "coupon": None}]
    assert list(table[0]) == ["order_id", "load_day", "amount", "coupon"]
