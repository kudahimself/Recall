import pytest

import member_text

ROWS = [
    (1, "  Ada ", None, "Lovelace", "ADA@Library.org", "LIB-0042"),
    (2, "Kim", "J", "Park", "kim@uni.ac.uk", "LIB-7"),
]
COLUMNS = "member_id int, first string, middle string, last string, email string, card string"


@pytest.fixture()
def members(spark):
    return spark.createDataFrame(ROWS, COLUMNS)


def column(df, field):
    return {r["member_id"]: r[field] for r in df.collect()}


def test_add_first_tidy_trims_and_lowercases(members):
    assert column(member_text.add_first_tidy(members), "first_tidy") == {1: "ada", 2: "kim"}


def test_add_full_name_joins_with_single_spaces(members):
    assert column(member_text.add_full_name(members), "full_name") == {1: "Ada Lovelace", 2: "Kim J Park"}


def test_add_full_name_survives_a_null_middle_name(members):
    names = column(member_text.add_full_name(members), "full_name")
    assert names[1] is not None
    assert "  " not in names[1]


def test_add_email_domain_is_lowercase_text_after_the_at_sign(members):
    assert column(member_text.add_email_domain(members), "domain") == {1: "library.org", 2: "uni.ac.uk"}


def test_add_card_number_is_an_integer_column(members):
    out = member_text.add_card_number(members)
    assert dict(out.dtypes)["card_no"] == "int"
    assert column(out, "card_no") == {1: 42, 2: 7}


def test_mask_card_replaces_each_digit(members):
    assert column(member_text.mask_card(members), "card_masked") == {1: "LIB-####", 2: "LIB-#"}


def test_helpers_keep_the_original_columns(members):
    out = member_text.add_email_domain(members)
    assert out.columns[:6] == ["member_id", "first", "middle", "last", "email", "card"]
