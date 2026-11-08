"""Reference solution: Unity Catalog GRANT and REVOKE, and who may read, write or create."""

# How many dot-separated parts the name of each kind of securable object has.
KIND_PARTS = {"CATALOG": 1, "SCHEMA": 2, "TABLE": 3}

# The privilege each action needs on its object or one of the object's parents.
ACTIONS = {"read": "SELECT", "write": "MODIFY", "create_table": "CREATE TABLE"}


def _check(kind, name):
    if kind not in KIND_PARTS:
        raise ValueError(f"unknown kind of object: {kind}")
    parts = name.split(".")
    if len(parts) != KIND_PARTS[kind] or not all(parts):
        raise ValueError(f"a {kind} name has {KIND_PARTS[kind]} part(s): {name}")


def _statement(verb, privileges, kind, name, word, principal):
    if not privileges:
        raise ValueError("name at least one privilege")
    _check(kind, name)
    return f"{verb} {', '.join(privileges)} ON {kind} {name} {word} `{principal}`"


def grant_sql(privileges, kind, name, principal):
    """Return the GRANT statement giving `privileges` on the object to `principal`."""
    return _statement("GRANT", privileges, kind, name, "TO", principal)


def revoke_sql(privileges, kind, name, principal):
    """Return the REVOKE statement taking `privileges` on the object away from `principal`."""
    return _statement("REVOKE", privileges, kind, name, "FROM", principal)


def read_access_sql(table, principal):
    """Return the three GRANT statements that let `principal` read `table`, catalog first."""
    _check("TABLE", table)
    catalog, schema, _ = table.split(".")
    return [
        grant_sql(["USE CATALOG"], "CATALOG", catalog, principal),
        grant_sql(["USE SCHEMA"], "SCHEMA", f"{catalog}.{schema}", principal),
        grant_sql(["SELECT"], "TABLE", table, principal),
    ]


def _holds(grants, principals, privilege, objects):
    """True when one of `principals` holds `privilege` on one of `objects` ((kind, name) pairs)."""
    return any(
        (privilege, kind, name, principal) in grants for kind, name in objects for principal in principals
    )


def _needs(grants, principals, action, target):
    """The privileges `action` on `target` needs that `principals` do not hold, in order."""
    if action not in ACTIONS:
        raise ValueError(f"unknown action: {action}")
    kind = "SCHEMA" if action == "create_table" else "TABLE"
    _check(kind, target)
    parts = target.split(".")
    catalog = ("CATALOG", parts[0])
    schema = ("SCHEMA", ".".join(parts[:2]))
    chain = [catalog, schema] + ([("TABLE", target)] if kind == "TABLE" else [])
    missing = []
    if not _holds(grants, principals, "USE CATALOG", [catalog]):
        missing.append("USE CATALOG")
    if not _holds(grants, principals, "USE SCHEMA", [catalog, schema]):
        missing.append("USE SCHEMA")
    if not _holds(grants, principals, ACTIONS[action], chain):
        missing.append(ACTIONS[action])
    return missing


def can(grants, principals, action, target):
    """True when someone acting as any of `principals` may do `action` on `target`."""
    return not _needs(grants, principals, action, target)


def revoke(grants, privilege, kind, name, principal):
    """Return the grants left after REVOKE privilege ON kind name FROM principal."""
    _check(kind, name)
    return [g for g in grants if g != (privilege, kind, name, principal)]


def missing_for_read(grants, principals, table):
    """The privileges `principals` still lack to read `table`, from USE CATALOG, USE SCHEMA and SELECT."""
    return _needs(grants, principals, "read", table)
