import pytest

import gap_filling

ROWS = [
    (1, "07700 1", None, 2),
    (2, None, "b@x.org", None),
    (3, None, None, 1),
    (4, "555", "d@x.org", 5),
]


@pytest.fixture()
def members(spark):
    return spark.createDataFrame(ROWS, "member_id int, phone string, email string, visits int")


def column(df, field):
    return {r["member_id"]: r[field] for r in df.collect()}


def test_without_phone_finds_the_null_phones(members):
    assert gap_filling.without_phone(members) == [2, 3]


def test_phone_differs_keeps_members_with_no_phone(members):
    assert gap_filling.phone_differs(members, "555") == [1, 2, 3]


def test_add_contact_prefers_email_then_phone_then_none(members):
    assert column(gap_filling.add_contact(members), "contact") == {
        1: "07700 1", 2: "b@x.org", 3: "none", 4: "d@x.org"}


def test_fill_defaults_fills_visits_and_phone(members):
    out = gap_filling.fill_defaults(members)
    assert column(out, "visits") == {1: 2, 2: 0, 3: 1, 4: 5}
    assert column(out, "phone") == {1: "07700 1", 2: "unknown", 3: "unknown", 4: "555"}


def test_fill_defaults_leaves_email_null(members):
    out = gap_filling.fill_defaults(members)
    assert column(out, "email") == {1: None, 2: "b@x.org", 3: None, 4: "d@x.org"}


def test_add_next_visits_treats_missing_as_zero(members):
    assert column(gap_filling.add_next_visits(members), "visits_next") == {1: 3, 2: 1, 3: 2, 4: 6}


def test_drop_unreachable_keeps_members_with_a_phone_or_an_email(members):
    out = gap_filling.drop_unreachable(members)
    assert sorted(out) == [1, 2, 4]
