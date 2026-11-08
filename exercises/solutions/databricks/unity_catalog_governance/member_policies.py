"""Reference solution: external locations, row filters, column masks and keys left in notebooks."""
import re

# The privileges an external location takes (a table privilege such as SELECT is not one).
LOCATION_PRIVILEGES = {"READ FILES", "WRITE FILES", "CREATE EXTERNAL TABLE", "CREATE EXTERNAL VOLUME"}

CLOUD_SCHEMES = ("s3://", "abfss://", "gs://")

KEY_PATTERNS = [
    re.compile(r"fs\.azure\.account\.key"),
    re.compile(r"fs\.s3a\.(access|secret)\.key"),
    re.compile(r"\bAKIA[0-9A-Z]{16}\b"),
    re.compile(r"[?&]sig="),
]


def external_location_sql(name, url, credential):
    """Return the CREATE EXTERNAL LOCATION statement pairing `url` with the storage credential."""
    if not url.startswith(CLOUD_SCHEMES) or url.rstrip("/") in (s.rstrip("/") for s in CLOUD_SCHEMES):
        raise ValueError(f"an external location needs a cloud storage URL: {url}")
    return f"CREATE EXTERNAL LOCATION {name} URL '{url}' WITH (STORAGE CREDENTIAL {credential})"


def location_grant_sql(location, privileges, principal):
    """Return the GRANT statement giving `privileges` on the external location to `principal`."""
    if not privileges or any(p not in LOCATION_PRIVILEGES for p in privileges):
        raise ValueError(f"not privileges on an external location: {privileges}")
    return f"GRANT {', '.join(privileges)} ON EXTERNAL LOCATION {location} TO `{principal}`"


def row_filter_function_sql(function, column, see_all_group, value):
    """Return the CREATE FUNCTION statement of a row filter on the STRING column `column`."""
    return (
        f"CREATE OR REPLACE FUNCTION {function}({column} STRING) RETURNS BOOLEAN "
        f"RETURN is_account_group_member('{see_all_group}') OR {column} = '{value}'"
    )


def mask_function_sql(function, column, see_all_group):
    """Return the CREATE FUNCTION statement of a mask on the email column `column`."""
    return (
        f"CREATE OR REPLACE FUNCTION {function}({column} STRING) RETURNS STRING "
        f"RETURN IF(is_account_group_member('{see_all_group}'), {column}, "
        f"concat('***@', substring_index({column}, '@', -1)))"
    )


def set_row_filter_sql(table, function, column):
    """Return the statement binding the row filter `function` to `table`, called on `column`."""
    return f"ALTER TABLE {table} SET ROW FILTER {function} ON ({column})"


def set_mask_sql(table, column, function):
    """Return the statement binding the mask `function` to the column `column` of `table`."""
    return f"ALTER TABLE {table} ALTER COLUMN {column} SET MASK {function}"


def find_keys(source):
    """Return the numbers (from 1) of the lines of notebook `source` that hold a cloud storage key."""
    return [
        number
        for number, line in enumerate(source.splitlines(), start=1)
        if any(p.search(line) for p in KEY_PATTERNS)
    ]
