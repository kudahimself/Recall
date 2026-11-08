"""Schema changes, checked: tell safe schema changes from breaking ones, and enforce a declared schema.

A schema is a dict of column -> {"type": ..., "nullable": True or False}, in column order, e.g.
    {"order_id": {"type": "int", "nullable": False}, "note": {"type": "string", "nullable": True}}
A batch is a list of rows, each a dict of column -> value; a column a row leaves out is NULL.
Fill in each function so the tests in test_schema_compat.py pass.
Run them from this folder with: pytest
"""
from datetime import date

# Type changes every existing value still fits in.
SAFE_WIDENINGS = {("int", "bigint"), ("float", "double")}

# The Python values each column type accepts (True and False are not numbers here).
ACCEPTS = {
    "int": (int,),
    "bigint": (int,),
    "float": (int, float),
    "double": (int, float),
    "string": (str,),
    "date": (date,),
}


def schema_changes(old, new):
    """Every difference between two schemas, as (column, change) pairs sorted by column then change.

    change is one of: "added nullable", "added required", "dropped", "widened" (a SAFE_WIDENINGS
    type change), "retyped" (any other type change), "made required", "made nullable".
    A column whose type and nullability both change gives two pairs.
    A rename shows up as one column dropped and another added.
    """
    # TODO
    raise NotImplementedError


def breaking_changes(old, new):
    """The changes from old to new that break a reader or a writer of the table, in the same form and order.

    Safe: adding a nullable column (old rows read NULL), widening a type, making a column nullable.
    Everything else breaks someone.
    """
    # TODO
    raise NotImplementedError


def batch_problems(declared, rows):
    """Everything in a batch that does not match the declared schema, as a list of strings.

    First "unexpected column <col>" for each column the batch has but the schema does not, sorted.
    Then, row by row (numbered from 1) and column by column in schema order:
      "row <i>: <col> is null" for a required column that is missing or None,
      "row <i>: <col> is not <type>" for a value of a type the column does not accept.
    """
    # TODO
    raise NotImplementedError


def admit_batch(table, declared, rows):
    """Append a batch to table (a list of row dicts) only if all of it matches; otherwise hold all of it.

    Return ("held", problems) and leave table unchanged when batch_problems finds anything.
    Otherwise append each row with exactly the declared columns, in schema order, None for a
    nullable column the row leaves out, and return ("loaded", number of rows).
    """
    # TODO
    raise NotImplementedError
