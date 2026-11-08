import re

import pytest

import library_grants as lg

STAFF = "library_staff"
# What the owner of catalog lib granted in the lesson's worked example.
GRANTS = [
    ("USE CATALOG", "CATALOG", "lib", STAFF),
    ("USE SCHEMA", "SCHEMA", "lib.loans", STAFF),
    ("SELECT", "SCHEMA", "lib.loans", STAFF),
    ("MODIFY", "TABLE", "lib.loans.fines", STAFF),
]
ME = {"ann@library.org", STAFF}


def as_grants(statement):
    """Read one GRANT statement back into grant tuples (the checker the tests use)."""
    m = re.fullmatch(r"GRANT (.+) ON (CATALOG|SCHEMA|TABLE) (\S+) TO `([^`]+)`", statement)
    assert m, f"not a GRANT statement of the expected shape: {statement!r}"
    privileges, kind, name, principal = m.groups()
    return [(p.strip(), kind, name, principal) for p in privileges.split(",")]


def test_grant_sql_writes_the_statement():
    assert (
        lg.grant_sql(["SELECT", "MODIFY"], "TABLE", "lib.loans.fines", STAFF)
        == "GRANT SELECT, MODIFY ON TABLE lib.loans.fines TO `library_staff`"
    )
    assert lg.grant_sql(["USE CATALOG"], "CATALOG", "lib", STAFF) == "GRANT USE CATALOG ON CATALOG lib TO `library_staff`"


def test_revoke_sql_says_from():
    assert lg.revoke_sql(["MODIFY"], "TABLE", "lib.loans.fines", STAFF) == "REVOKE MODIFY ON TABLE lib.loans.fines FROM `library_staff`"


@pytest.mark.parametrize(
    "privileges, kind, name",
    [([], "TABLE", "lib.loans.fines"), (["SELECT"], "VOLUME", "lib.loans.v"), (["SELECT"], "TABLE", "lib.fines"),
     (["SELECT"], "SCHEMA", "lib..loans"), (["USE CATALOG"], "CATALOG", "lib.loans")],
)
def test_statements_reject_a_bad_object_or_no_privilege(privileges, kind, name):
    with pytest.raises(ValueError):
        lg.grant_sql(privileges, kind, name, STAFF)
    with pytest.raises(ValueError):
        lg.revoke_sql(privileges, kind, name, STAFF)


def test_read_access_sql_grants_both_usages_and_select():
    statements = lg.read_access_sql("lib.people.members", "front_desk")
    assert statements == [
        "GRANT USE CATALOG ON CATALOG lib TO `front_desk`",
        "GRANT USE SCHEMA ON SCHEMA lib.people TO `front_desk`",
        "GRANT SELECT ON TABLE lib.people.members TO `front_desk`",
    ]
    granted = [g for s in statements for g in as_grants(s)]
    assert lg.can(granted, {"front_desk"}, "read", "lib.people.members")


@pytest.mark.parametrize(
    "action, target, allowed",
    [
        ("read", "lib.loans.loans", True),
        ("read", "lib.loans.fines", True),
        ("write", "lib.loans.fines", True),
        ("write", "lib.loans.loans", False),
        ("create_table", "lib.loans", False),
        ("read", "lib.people.members", False),
    ],
)
def test_can_follows_the_worked_example(action, target, allowed):
    assert lg.can(GRANTS, ME, action, target) is allowed


def test_can_needs_a_principal_that_holds_the_grants():
    assert lg.can(GRANTS, {"ann@library.org"}, "read", "lib.loans.loans") is False


def test_select_on_a_table_is_not_enough_without_the_usages():
    only_select = [("SELECT", "TABLE", "lib.loans.loans", STAFF)]
    assert lg.can(only_select, ME, "read", "lib.loans.loans") is False
    assert lg.missing_for_read(only_select, ME, "lib.loans.loans") == ["USE CATALOG", "USE SCHEMA"]


def test_privileges_granted_on_a_catalog_reach_everything_in_it():
    on_catalog = [("USE CATALOG", "CATALOG", "lib", STAFF), ("USE SCHEMA", "CATALOG", "lib", STAFF),
                  ("CREATE TABLE", "CATALOG", "lib", STAFF)]
    assert lg.can(on_catalog, ME, "create_table", "lib.people") is True
    assert lg.missing_for_read(on_catalog, ME, "lib.people.members") == ["SELECT"]


def test_can_rejects_an_unknown_action_or_a_bad_target():
    with pytest.raises(ValueError):
        lg.can(GRANTS, ME, "delete", "lib.loans.loans")
    with pytest.raises(ValueError):
        lg.can(GRANTS, ME, "read", "lib.loans")


def test_revoke_removes_only_the_grant_at_that_level():
    grants = GRANTS + [("SELECT", "TABLE", "lib.loans.fines", STAFF)]
    left = lg.revoke(grants, "SELECT", "TABLE", "lib.loans.fines", STAFF)
    assert ("SELECT", "TABLE", "lib.loans.fines", STAFF) not in left
    assert len(left) == len(GRANTS) and len(grants) == len(GRANTS) + 1
    # There is no DENY: SELECT on the schema still reads the table.
    assert lg.can(left, ME, "read", "lib.loans.fines") is True


def test_revoke_of_modify_stops_the_write():
    left = lg.revoke(GRANTS, "MODIFY", "TABLE", "lib.loans.fines", STAFF)
    assert lg.can(left, ME, "write", "lib.loans.fines") is False
    with pytest.raises(ValueError):
        lg.revoke(GRANTS, "MODIFY", "TABLE", "fines", STAFF)


def test_missing_for_read_is_empty_when_the_read_works():
    assert lg.missing_for_read(GRANTS, ME, "lib.loans.loans") == []
    assert lg.missing_for_read([], ME, "lib.loans.loans") == ["USE CATALOG", "USE SCHEMA", "SELECT"]
