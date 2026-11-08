import re

import pytest

import member_policies as mp

MEMBERS = [(1, "leeds", "ann@mail.com"), (2, "york", "bo@post.net"), (3, "leeds", "cy@post.net")]
SHAPE = re.compile(
    r"CREATE OR REPLACE FUNCTION (\S+)\((\w+) STRING\) RETURNS (BOOLEAN|STRING) RETURN (.+)", re.S | re.I
)


@pytest.fixture(scope="module")
def members(spark):
    spark.createDataFrame(MEMBERS, "member_id INT, branch STRING, email STRING").createOrReplaceTempView("ucg_members")
    return "ucg_members"


def run_policy(spark, statement, group, in_group):
    """Create the policy function locally and return it as a temporary function's name.

    Local Spark has no account groups, so the call is_account_group_member('<group>') is swapped
    for true or false (as if the user were or were not in the group) to run the rest of the body.
    """
    m = SHAPE.fullmatch(" ".join(statement.split()))
    assert m, f"not a CREATE OR REPLACE FUNCTION statement of the expected shape: {statement!r}"
    _, param, returns, body = m.groups()
    call = f"is_account_group_member('{group}')"
    assert call in body, f"the body should test the group with {call}"
    body = body.replace(call, "true" if in_group else "false")
    spark.sql(f"CREATE OR REPLACE TEMPORARY FUNCTION ucg_policy({param} STRING) RETURNS {returns} RETURN {body}")
    return m


def test_external_location_sql_pairs_the_path_with_the_credential():
    assert (
        mp.external_location_sql("loans_raw", "s3://lib-raw/loans", "lib_cred")
        == "CREATE EXTERNAL LOCATION loans_raw URL 's3://lib-raw/loans' WITH (STORAGE CREDENTIAL lib_cred)"
    )
    assert "URL 'abfss://raw@libstore.dfs.core.windows.net/loans'" in mp.external_location_sql(
        "loans_az", "abfss://raw@libstore.dfs.core.windows.net/loans", "lib_mi"
    )


@pytest.mark.parametrize("url", ["dbfs:/mnt/loans", "/tmp/loans", "https://lib-raw.s3.amazonaws.com/loans", "s3://"])
def test_external_location_sql_needs_a_cloud_storage_url(url):
    with pytest.raises(ValueError):
        mp.external_location_sql("loans_raw", url, "lib_cred")


def test_location_grant_sql_uses_location_privileges():
    assert (
        mp.location_grant_sql("loans_raw", ["READ FILES", "CREATE EXTERNAL TABLE"], "loaders")
        == "GRANT READ FILES, CREATE EXTERNAL TABLE ON EXTERNAL LOCATION loans_raw TO `loaders`"
    )
    with pytest.raises(ValueError):
        mp.location_grant_sql("loans_raw", ["SELECT"], "loaders")
    with pytest.raises(ValueError):
        mp.location_grant_sql("loans_raw", [], "loaders")


@pytest.mark.parametrize("in_managers, expected", [(True, [1, 2, 3]), (False, [1, 3])])
def test_row_filter_keeps_leeds_rows_unless_you_are_a_manager(spark, members, in_managers, expected):
    statement = mp.row_filter_function_sql("lib.people.leeds_only", "branch", "managers", "leeds")
    m = run_policy(spark, statement, "managers", in_managers)
    assert m.group(1) == "lib.people.leeds_only" and m.group(2) == "branch" and m.group(3).upper() == "BOOLEAN"
    rows = spark.sql(f"SELECT member_id FROM {members} WHERE ucg_policy(branch) ORDER BY member_id").collect()
    assert [r.member_id for r in rows] == expected


@pytest.mark.parametrize(
    "in_managers, expected",
    [(True, ["ann@mail.com", "bo@post.net", "cy@post.net"]), (False, ["***@mail.com", "***@post.net", "***@post.net"])],
)
def test_mask_hides_the_name_part_unless_you_are_a_manager(spark, members, in_managers, expected):
    statement = mp.mask_function_sql("lib.people.hide_email", "email", "managers")
    m = run_policy(spark, statement, "managers", in_managers)
    assert m.group(1) == "lib.people.hide_email" and m.group(2) == "email" and m.group(3).upper() == "STRING"
    rows = spark.sql(f"SELECT ucg_policy(email) AS email FROM {members} ORDER BY member_id").collect()
    assert [r.email for r in rows] == expected


def test_binding_statements():
    assert (
        mp.set_row_filter_sql("lib.people.members", "lib.people.leeds_only", "branch")
        == "ALTER TABLE lib.people.members SET ROW FILTER lib.people.leeds_only ON (branch)"
    )
    assert (
        mp.set_mask_sql("lib.people.members", "email", "lib.people.hide_email")
        == "ALTER TABLE lib.people.members ALTER COLUMN email SET MASK lib.people.hide_email"
    )


NOTEBOOK = """\
df = spark.read.table("lib.loans.loans")
spark.conf.set("fs.azure.account.key.libstore.dfs.core.windows.net", "c2VjcmV0")
url = "https://libstore.blob.core.windows.net/raw/loans.csv?sv=2024-01-01&sig=abc123"
aws_id = "AKIAIOSFODNN7EXAMPLE"
spark.conf.set("fs.s3a.secret.key", secret)
akia_count = df.where("note LIKE 'AKIA%'").count()
signature = "the sig= part is in the URL"
"""


def test_find_keys_points_at_the_lines_with_keys():
    assert mp.find_keys(NOTEBOOK) == [2, 3, 4, 5]
    assert mp.find_keys('spark.read.table("lib.people.members")') == []
