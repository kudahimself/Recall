"""Reference solution for pipeline_rules.py: look only after your own tests pass."""
import re

from pyspark.sql import functions as F


class ExpectationFailed(Exception):
    """Raised when a row breaks an expectation whose action is "fail" (already written for you)."""


_CLAUSES = {None: "", "drop": " ON VIOLATION DROP ROW", "fail": " ON VIOLATION FAIL UPDATE"}


def constraint_sql(name, condition, on_violation=None):
    if on_violation not in _CLAUSES:
        raise ValueError(f"unknown on_violation: {on_violation!r}")
    return f"CONSTRAINT {name} EXPECT ({condition}){_CLAUSES[on_violation]}"


def pick_dataset(append_only_source, aggregates, joins_changing_table):
    if append_only_source and not aggregates and not joins_changing_table:
        return "STREAMING TABLE"
    return "MATERIALIZED VIEW"


def check_rows(df, expectations):
    if not expectations:
        return df, {}
    row = df.agg(*[
        F.sum(F.when(F.expr(condition), 0).otherwise(1)).alias(f"e{i}")
        for i, (_, condition, _) in enumerate(expectations)
    ]).first()
    failures = {name: int(row[f"e{i}"] or 0) for i, (name, _, _) in enumerate(expectations)}
    for name, _, action in expectations:
        if action == "fail" and failures[name]:
            raise ExpectationFailed(name)
    kept = df
    for _, condition, action in expectations:
        if action == "drop":
            kept = kept.filter(F.expr(condition))
    return kept, failures


def update_order(datasets):
    needs = {
        name: {other for other in datasets if other != name and re.search(rf"\b{re.escape(other)}\b", query)}
        for name, query in datasets.items()
    }
    order = []
    while len(order) < len(datasets):
        ready = sorted(n for n in datasets if n not in order and needs[n] <= set(order))
        if not ready:
            raise ValueError("the datasets' dependencies form a cycle")
        order.append(ready[0])
    return order
