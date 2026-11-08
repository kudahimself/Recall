"""Schema changes, checked: reference solution."""
from datetime import date

SAFE_WIDENINGS = {("int", "bigint"), ("float", "double")}

ACCEPTS = {
    "int": (int,),
    "bigint": (int,),
    "float": (int, float),
    "double": (int, float),
    "string": (str,),
    "date": (date,),
}

BREAKING = {"added required", "dropped", "retyped", "made required"}


def schema_changes(old, new):
    """Every difference between two schemas, as (column, change) pairs sorted by column then change."""
    changes = []
    for col in old.keys() - new.keys():
        changes.append((col, "dropped"))
    for col in new.keys() - old.keys():
        changes.append((col, "added nullable" if new[col]["nullable"] else "added required"))
    for col in old.keys() & new.keys():
        before, after = old[col], new[col]
        if before["type"] != after["type"]:
            widened = (before["type"], after["type"]) in SAFE_WIDENINGS
            changes.append((col, "widened" if widened else "retyped"))
        if before["nullable"] and not after["nullable"]:
            changes.append((col, "made required"))
        if not before["nullable"] and after["nullable"]:
            changes.append((col, "made nullable"))
    return sorted(changes)


def breaking_changes(old, new):
    """The changes from old to new that break a reader or a writer of the table."""
    return [c for c in schema_changes(old, new) if c[1] in BREAKING]


def batch_problems(declared, rows):
    """Everything in a batch that does not match the declared schema."""
    problems = sorted({f"unexpected column {col}" for row in rows for col in row if col not in declared})
    for i, row in enumerate(rows, start=1):
        for col, spec in declared.items():
            value = row.get(col)
            if value is None:
                if not spec["nullable"]:
                    problems.append(f"row {i}: {col} is null")
            elif isinstance(value, bool) or not isinstance(value, ACCEPTS[spec["type"]]):
                problems.append(f"row {i}: {col} is not {spec['type']}")
    return problems


def admit_batch(table, declared, rows):
    """Append a batch to table only if all of it matches; otherwise hold all of it."""
    problems = batch_problems(declared, rows)
    if problems:
        return "held", problems
    table.extend({col: row.get(col) for col in declared} for row in rows)
    return "loaded", len(rows)
