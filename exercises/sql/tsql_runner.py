"""Run the T-SQL you write in an exercise's .sql file on DuckDB, for its tests: nothing to change here.

Every SQL exercise folder holds a .sql file split into named blocks, each one starting with a line
such as `-- query: longest_scifi` or `-- step: add_capacity`, and a conftest.py that hands its tests
the `con` fixture from here: a fresh in-memory DuckDB database for each test, so there is no server to start.

A test reads one block, and this module:

1. reads it as T-SQL with sqlglot's T-SQL dialect, batch by batch (a line holding only `GO` ends a batch),
   and stops on forms SQL Server does not accept, such as `LIMIT`, `||` or `ADD COLUMN`;
2. turns it into DuckDB's SQL, with a few changes so it behaves as on SQL Server
   (see exercises/sql/README.md, "What differs from SQL Server");
3. runs it and returns the column names and rows of the last statement that returns rows.

Text comparisons are case-insensitive, as under SQL Server's default collation.
"""
import datetime
import decimal
import logging
import re
from collections import Counter
from pathlib import Path

import duckdb
import pytest
import sqlglot
from sqlglot import exp
from sqlglot.tokens import TokenType

logging.getLogger("sqlglot").setLevel(logging.ERROR)  # it reports what it cannot read; the tests say it better

SEMICOLONS = "End each statement with ; so the next one can start (SQL Server lets you leave it out, the tests do not)."
BLOCK = re.compile(r"^--\s*(query|step):\s*(\w+)\s*$", re.I | re.M)
GO = re.compile(r"^\s*GO\s*;?\s*$", re.I | re.M)

# Functions of DuckDB or PostgreSQL that SQL Server does not have, with the T-SQL to write instead.
NOT_TSQL_FUNCTIONS = {
    "STRFTIME": "FORMAT(d, 'yyyy-MM') or YEAR() and MONTH()",
    "STRPTIME": "CAST(text AS DATE)",
    "DATE_DIFF": "DATEDIFF(unit, start, end)",
    "DATE_ADD": "DATEADD(unit, n, d)",
    "DATE_SUB": "DATEADD(unit, -n, d)",
    "DATE_TRUNC": "DATEFROMPARTS() or DATETRUNC()",
    "DATE_PART": "DATEPART(unit, d)",
    "LAST_DAY": "EOMONTH(d)",
    "STRPOS": "CHARINDEX(find, s)",
    "POSITION": "CHARINDEX(find, s)",
    "INSTR": "CHARINDEX(find, s)",
    "LENGTH": "LEN(s)",
    "SUBSTR": "SUBSTRING(s, start, length)",
    "LISTAGG": "STRING_AGG(col, sep)",
    "GROUP_CONCAT": "STRING_AGG(col, sep)",
    "NOW": "GETDATE()",
    "IFNULL": "ISNULL(a, b) or COALESCE(a, b)",
    "NVL": "ISNULL(a, b) or COALESCE(a, b)",
}

STRING_FUNCTIONS = (
    exp.Concat, exp.Upper, exp.Lower, exp.Trim, exp.Substring, exp.Left, exp.Right,
    exp.DPipe, exp.Initcap, exp.Pad, exp.ConcatWs, exp.GroupConcat, exp.Replace, exp.Reverse,
)
STRING_TYPES = {"VARCHAR"}
INTEGER_TYPES = {"INTEGER", "BIGINT", "SMALLINT", "TINYINT", "HUGEINT"}


@pytest.fixture
def con():
    """A fresh in-memory database, with dbo as the default schema as on SQL Server."""
    db = connect()
    yield db
    db.close()


def connect():
    db = duckdb.connect()
    db.execute("PRAGMA default_collation = 'NOCASE'")
    db.execute("CREATE SCHEMA dbo")
    db.execute("USE memory.dbo")
    return db


def blocks(path):
    """The named blocks of a .sql file: {name: text}, in file order."""
    text = Path(path).read_text(encoding="utf-8")
    marks = list(BLOCK.finditer(text))
    found = {}
    for i, mark in enumerate(marks):
        end = marks[i + 1].start() if i + 1 < len(marks) else len(text)
        found[mark.group(2)] = text[mark.end():end]
    return found


def block(path, name):
    """The T-SQL of one block, or an AssertionError naming the block while it is still empty."""
    path = Path(path)
    found = blocks(path)
    if name not in found:
        raise AssertionError(f"{path.name} has no `-- query: {name}` or `-- step: {name}` line: put it back above your SQL")
    sql = found[name]
    if not strip_comments(sql).strip():
        raise AssertionError(f"Write the `{name}` block of {path.name}: it is still empty")
    return sql


def strip_comments(sql):
    sql = re.sub(r"/\*.*?\*/", " ", sql, flags=re.S)
    return re.sub(r"--[^\n]*", " ", sql)


def batches(sql):
    """The batches of a script: its text split at each line that holds only GO."""
    return [b for b in GO.split(sql) if strip_comments(b).strip()]


COMPOUND = re.compile(r"([\w.\[\]]+)\s*([-+*/%])=(?!=)")


def parse(sql):
    """The T-SQL statements of a block as sqlglot trees, for tests that check how it is written."""
    statements = []
    for batch in batches(sql):
        check_tsql(batch)
        batch = COMPOUND.sub(r"\1 = \1 \2 ", batch)  # SET Loans += 1 is SET Loans = Loans + 1, which sqlglot reads
        try:
            parsed = [s for s in sqlglot.parse(batch, read="tsql") if s is not None]
        except sqlglot.errors.ParseError as e:
            raise AssertionError(f"This is not T-SQL that SQL Server can read:\n{batch.strip()}\n{first_line(e)}\n{SEMICOLONS}") from None
        for s in parsed:
            for command in s.find_all(exp.Command):
                if isinstance(s, exp.Alter) and command is not s and command.name.upper() == "DROP":
                    raise AssertionError("In T-SQL, ALTER TABLE drops a column with DROP COLUMN col")
                raise AssertionError(f"This is not T-SQL that SQL Server can read:\n{s.sql('tsql')}\n{SEMICOLONS}")
        alone = [s for s in parsed if isinstance(s, exp.Create) and str(s.args.get("kind", "")).upper() in ("VIEW", "PROCEDURE", "FUNCTION", "TRIGGER")]
        if alone and len(parsed) > 1:
            kind = str(alone[0].args["kind"]).upper()
            raise AssertionError(f"CREATE {kind} must be the only statement in its batch: put a line holding only GO before and after it")
        statements.extend(parsed)
    return statements


def check_tsql(sql):
    """Stop on the forms DuckDB or PostgreSQL accept and SQL Server does not, saying what T-SQL uses."""
    try:
        tokens = sqlglot.tokenize(sql, read="tsql")
    except sqlglot.errors.TokenError as e:
        raise AssertionError(f"This is not T-SQL that SQL Server can read: {first_line(e)}") from None
    for i, tok in enumerate(tokens):
        after = tokens[i + 1] if i + 1 < len(tokens) else None
        word = tok.text.upper()
        if tok.token_type == TokenType.LIMIT:
            raise AssertionError("T-SQL has no LIMIT: use TOP (n) after SELECT, or OFFSET n ROWS FETCH NEXT m ROWS ONLY after ORDER BY")
        if tok.token_type == TokenType.DPIPE:
            raise AssertionError("T-SQL joins text with CONCAT(a, b) or a + b, not ||")
        if tok.token_type == TokenType.ILIKE:
            raise AssertionError("T-SQL has no ILIKE: LIKE already ignores case under SQL Server's default collation")
        if tok.token_type == TokenType.DCOLON:
            raise AssertionError("T-SQL has no :: cast: write CAST(value AS type)")
        if tok.token_type in (TokenType.TRUE, TokenType.FALSE):
            raise AssertionError("T-SQL has no TRUE or FALSE: a BIT holds 1 or 0")
        if word == "ADD" and after is not None and after.text.upper() == "COLUMN":
            raise AssertionError("In T-SQL, ADD takes no COLUMN keyword: ALTER TABLE t ADD col type")
        if word == "MODIFY":
            raise AssertionError("MODIFY is not T-SQL: change a column's type with ALTER TABLE t ALTER COLUMN col newtype")
        if word == "OR" and after is not None and after.text.upper() == "REPLACE":
            raise AssertionError("T-SQL has CREATE OR ALTER, not CREATE OR REPLACE")
        if word == "AUTOINCREMENT" or word == "AUTO_INCREMENT" or word == "SERIAL":
            raise AssertionError(f"{tok.text} is not T-SQL: a T-SQL key that numbers itself is INT IDENTITY(1, 1)")
        if after is not None and after.token_type == TokenType.L_PAREN and word in NOT_TSQL_FUNCTIONS:
            raise AssertionError(f"{tok.text}() is not a T-SQL function: use {NOT_TSQL_FUNCTIONS[word]}")


def first_line(error):
    return str(error).strip().splitlines()[0] if str(error).strip() else type(error).__name__


def column_types(con):
    """Column name (lower case) -> DuckDB type name, for the names that have one type in every table."""
    seen = {}
    for name, dtype in con.execute("SELECT column_name, data_type FROM duckdb_columns()").fetchall():
        base = dtype.split("(")[0].upper()
        seen.setdefault(name.lower(), set()).add(base)
    return {name: types.pop() for name, types in seen.items() if len(types) == 1}


def kind_of(node, types):
    """'text', 'int' or None: what a T-SQL expression holds, as far as its form and the tables' columns tell."""
    if isinstance(node, exp.Paren):
        return kind_of(node.this, types)
    if isinstance(node, exp.Literal):
        return "text" if node.is_string else ("int" if node.is_int else None)
    if isinstance(node, exp.National) or isinstance(node, STRING_FUNCTIONS):
        return "text"
    if isinstance(node, exp.Cast):
        return "text" if node.to.is_type(*exp.DataType.TEXT_TYPES) else ("int" if node.to.is_type(*exp.DataType.INTEGER_TYPES) else None)
    if isinstance(node, (exp.Coalesce, exp.Case, exp.If)):
        branches = [node.this] + list(node.expressions) if isinstance(node, exp.Coalesce) else (
            [i.args.get("true") for i in node.args.get("ifs") or []] + [node.args.get("default")] if isinstance(node, exp.Case)
            else [node.args.get("true"), node.args.get("false")])
        kinds = {kind_of(b, types) for b in branches if b is not None}
        return "text" if "text" in kinds else ("int" if kinds == {"int"} else None)
    if isinstance(node, (exp.Count, exp.Length, exp.StrPosition)):
        return "int"
    if isinstance(node, exp.Column):
        dtype = types.get(node.name.lower())
        return "text" if dtype in STRING_TYPES else ("int" if dtype in INTEGER_TYPES else None)
    if isinstance(node, (exp.Add, exp.Sub, exp.Mul)):
        left, right = kind_of(node.this, types), kind_of(node.expression, types)
        if isinstance(node, exp.Add) and "text" in (left, right):
            return "text"
        return "int" if left == right == "int" else None
    return None


def to_duckdb(con, statement):
    """One T-SQL statement as DuckDB SQL that behaves as SQL Server would."""
    tree = statement.copy()
    types = column_types(con)
    if isinstance(tree, exp.Delete) and not tree.this and tree.args.get("tables"):
        tree.set("this", tree.args["tables"][0])  # T-SQL lets DELETE leave out FROM
        tree.set("tables", None)
    # Post-order, so `a + ' ' + b` turns its inner + into || before the outer one is looked at.
    for node in reversed(list(tree.walk(bfs=False))):
        replacement = None
        if isinstance(node, exp.Add) and "text" in (kind_of(node.this, types), kind_of(node.expression, types)):
            replacement = exp.DPipe(this=node.this, expression=node.expression)  # NULL in, NULL out, as + is
        elif isinstance(node, exp.Div) and kind_of(node.this, types) == kind_of(node.expression, types) == "int":
            replacement = exp.IntDiv(this=node.this, expression=node.expression)  # 7 / 2 is 3 on SQL Server
        elif isinstance(node, exp.Avg) and kind_of(node.this, types) == "int" and not isinstance(node.parent, exp.Window):
            replacement = exp.cast(exp.func("TRUNC", node.copy()), "BIGINT")  # AVG of an INT is an INT
        elif isinstance(node, exp.Window) and isinstance(node.this, exp.Avg) and kind_of(node.this.this, types) == "int":
            replacement = exp.cast(exp.func("TRUNC", node.copy()), "BIGINT")
        elif isinstance(node, exp.Ordered) and not isinstance(node.parent, exp.Order):
            replacement = node.this  # a key's column list, as in PRIMARY KEY (BranchId), takes no NULLS FIRST
        elif isinstance(node, exp.Like):
            replacement = exp.ILike(this=node.this, expression=node.expression)  # case-insensitive collation
        elif isinstance(node, exp.Length):
            arg = node.this.this if isinstance(node.this, exp.Cast) else node.this
            replacement = exp.Length(this=exp.Anonymous(this="RTRIM", expressions=[arg]))  # LEN ignores trailing spaces
        elif isinstance(node, exp.DataType) and node.is_type(exp.DataType.Type.BIT):
            replacement = exp.DataType.build("BOOLEAN")
        elif isinstance(node, exp.ComputedColumnConstraint):
            node.set("persisted", False)  # DuckDB computes generated columns on read only
            if not isinstance(node.this, exp.Paren):
                node.set("this", exp.Paren(this=node.this))  # and wants the expression in parentheses
        elif isinstance(node, exp.Reference):
            node.set("options", [])  # DuckDB has no ON DELETE CASCADE; the tests read it from your T-SQL
        if replacement is not None:
            node.replace(replacement)
    return tree.sql("duckdb")


def type_name(dtype):
    """A declared type as T-SQL, without spaces: 'NVARCHAR(50)', 'DECIMAL(6,2)', 'DATETIME2'.

    NUMERIC is the same type as DECIMAL in T-SQL, so it reads as DECIMAL.
    """
    return re.sub(r"^NUMERIC\b", "DECIMAL", dtype.sql("tsql").upper().replace(" ", ""))


def declared_columns(sql, table):
    """{column name (lower case): ColumnDef} of the CREATE TABLE for `table` (any schema) in a block of T-SQL."""
    for statement in parse(sql):
        if isinstance(statement, exp.Create) and isinstance(statement.this, exp.Schema):
            if statement.this.this.name.lower() == table.lower():
                return {c.name.lower(): c for c in statement.this.expressions if isinstance(c, exp.ColumnDef)}
    raise AssertionError(f"The block has no CREATE TABLE for {table}")


class Result:
    def __init__(self, columns, rows):
        self.columns = columns
        self.rows = rows

    def __repr__(self):
        return f"Result(columns={self.columns}, rows={self.rows})"


def run(con, sql):
    """Run a block of T-SQL; return the Result of its last statement that returns rows, or None."""
    result = None
    for statement in parse(sql):
        duck = to_duckdb(con, statement)
        try:
            cursor = con.execute(duck)
        except duckdb.Error as e:
            raise AssertionError(
                f"This T-SQL failed:\n  {statement.sql('tsql')}\nrun on DuckDB as:\n  {duck}\n{type(e).__name__}: {first_line(e)}"
            ) from None
        if isinstance(statement, exp.Query) and not statement.args.get("into") and cursor.description:
            result = Result([d[0] for d in cursor.description], cursor.fetchall())
    return result


def rejects(con, sql):
    """True when SQL (the test's own) is refused by the database, as a broken rule refuses a row."""
    try:
        con.execute(sql)
    except duckdb.Error:
        return True
    return False


def value(v):
    """A value in a form that compares the same whichever engine type held it."""
    if isinstance(v, decimal.Decimal):
        return round(float(v), 6)
    if isinstance(v, float):
        return round(v, 6)
    if isinstance(v, datetime.datetime) and v.time() == datetime.time(0):
        return v.date()  # DATEADD on a DATE gives a midnight timestamp here and a DATE on SQL Server
    if isinstance(v, bool):
        return int(v)
    return v


def assert_rows(result, columns, rows, ordered=False):
    """The query returned these columns (names ignore case) and these rows, in this order when ordered."""
    assert result is not None, "The block returned no rows: it needs a SELECT"
    got_cols = [c.lower() for c in result.columns]
    assert got_cols == [c.lower() for c in columns], f"Expected the columns {columns}, got {result.columns}"
    got = [tuple(value(v) for v in row) for row in result.rows]
    want = [tuple(value(v) for v in row) for row in rows]
    if ordered:
        assert got == want, f"Expected these rows, in this order:\n  {want}\ngot:\n  {got}"
    else:
        missing = Counter(want) - Counter(got)
        extra = Counter(got) - Counter(want)
        assert not missing and not extra, (
            f"Expected these rows (in any order):\n  {sorted(want, key=repr)}\ngot:\n  {sorted(got, key=repr)}\n"
            f"missing: {sorted(missing.elements(), key=repr)}\nnot expected: {sorted(extra.elements(), key=repr)}"
        )
