"""Unity Catalog GRANT and REVOKE, and who may read, write or create: fill in the TODOs.

A grant is a tuple (privilege, kind, name, principal), one privilege each, for example
("SELECT", "SCHEMA", "lib.loans", "library_staff"). A list of them is everything granted.
"""

# How many dot-separated parts the name of each kind of securable object has.
KIND_PARTS = {"CATALOG": 1, "SCHEMA": 2, "TABLE": 3}

# The privilege each action needs on its object or one of the object's parents.
ACTIONS = {"read": "SELECT", "write": "MODIFY", "create_table": "CREATE TABLE"}


def grant_sql(privileges, kind, name, principal):
    """Return the GRANT statement giving `privileges` (a list) on the object to `principal`.

    grant_sql(["SELECT", "MODIFY"], "TABLE", "lib.loans.fines", "library_staff")
    == "GRANT SELECT, MODIFY ON TABLE lib.loans.fines TO `library_staff`"

    Raise ValueError for an empty list, a kind not in KIND_PARTS, or a name with the wrong
    number of parts for its kind (or an empty part).
    """
    # TODO
    raise NotImplementedError


def revoke_sql(privileges, kind, name, principal):
    """Return the REVOKE statement taking `privileges` on the object away from `principal`.

    The same checks as grant_sql; REVOKE says FROM where GRANT says TO.
    """
    # TODO
    raise NotImplementedError


def read_access_sql(table, principal):
    """Return the three GRANT statements that let `principal` read `table`, catalog first."""
    # TODO: one statement each for the catalog, the schema and the table
    raise NotImplementedError


def can(grants, principals, action, target):
    """True when someone acting as any of `principals` (a set of names) may do `action` on `target`.

    `action` is "read" or "write" on a table, or "create_table" on a schema; raise ValueError
    for any other action, or a target name of the wrong shape. Every action needs USE CATALOG on
    the catalog, USE SCHEMA on the schema (granted on the schema or its catalog), and the
    action's privilege in ACTIONS on the target or any parent of it.
    """
    # TODO
    raise NotImplementedError


def revoke(grants, privilege, kind, name, principal):
    """Return a new list of the grants left after REVOKE privilege ON kind name FROM principal.

    Leave `grants` itself unchanged. Raise ValueError for a name of the wrong shape.
    """
    # TODO: a REVOKE removes the grant made at exactly that level, and nothing else
    raise NotImplementedError


def missing_for_read(grants, principals, table):
    """The privileges `principals` still lack to read `table`, as a list in this order:

    "USE CATALOG", "USE SCHEMA", "SELECT". An empty list means they can read it.
    """
    # TODO
    raise NotImplementedError
