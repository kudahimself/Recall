"""External locations, row filters, column masks and keys left in notebooks: fill in the TODOs."""

# The privileges an external location takes (a table privilege such as SELECT is not one).
LOCATION_PRIVILEGES = {"READ FILES", "WRITE FILES", "CREATE EXTERNAL TABLE", "CREATE EXTERNAL VOLUME"}


def external_location_sql(name, url, credential):
    """Return the CREATE EXTERNAL LOCATION statement pairing `url` with the storage credential.

    external_location_sql("loans_raw", "s3://lib-raw/loans", "lib_cred") ==
    "CREATE EXTERNAL LOCATION loans_raw URL 's3://lib-raw/loans' WITH (STORAGE CREDENTIAL lib_cred)"

    Raise ValueError unless `url` is a path in cloud storage: it starts with s3://, abfss://
    or gs:// and names something after the scheme (a DBFS mount or a local path is not one).
    """
    # TODO
    raise NotImplementedError


def location_grant_sql(location, privileges, principal):
    """Return the GRANT statement giving `privileges` (a list) on the external location to `principal`.

    location_grant_sql("loans_raw", ["READ FILES"], "loaders") ==
    "GRANT READ FILES ON EXTERNAL LOCATION loans_raw TO `loaders`"

    Raise ValueError for an empty list or a privilege not in LOCATION_PRIVILEGES.
    """
    # TODO
    raise NotImplementedError


def row_filter_function_sql(function, column, see_all_group, value):
    """Return the CREATE FUNCTION statement of a row filter on the STRING column `column`.

    Write it as: CREATE OR REPLACE FUNCTION <function>(<column> STRING) RETURNS BOOLEAN RETURN <expr>
    where <expr> is true for every row when the user is in `see_all_group`, and otherwise only
    when the column equals `value`. Test the group with is_account_group_member('<group>').
    """
    # TODO
    raise NotImplementedError


def mask_function_sql(function, column, see_all_group):
    """Return the CREATE FUNCTION statement of a mask on the email column `column`.

    Write it as: CREATE OR REPLACE FUNCTION <function>(<column> STRING) RETURNS STRING RETURN <expr>
    where <expr> is the email itself for a user in `see_all_group`, and otherwise "***@" and the
    email's domain: ann@mail.com becomes ***@mail.com. Test the group with
    is_account_group_member('<group>').
    """
    # TODO
    raise NotImplementedError


def set_row_filter_sql(table, function, column):
    """Return the statement binding the row filter `function` to `table`, called on `column`."""
    # TODO
    raise NotImplementedError


def set_mask_sql(table, column, function):
    """Return the statement binding the mask `function` to the column `column` of `table`."""
    # TODO
    raise NotImplementedError


def find_keys(source):
    """Return the numbers (from 1) of the lines of notebook `source` that hold a cloud storage key.

    A line holds one when it sets an Azure account key (fs.azure.account.key), an S3 key
    (fs.s3a.access.key or fs.s3a.secret.key), holds an AWS access key id (AKIA and 16 more
    capital letters or digits) or a SAS token (?sig= or &sig= in a URL).
    """
    # TODO: check each line against the four patterns, e.g. with the re module
    raise NotImplementedError
