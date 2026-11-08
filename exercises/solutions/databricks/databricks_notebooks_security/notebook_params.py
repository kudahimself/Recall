"""Reference solution for notebook_params.py: look only after your own tests pass."""
from pyspark.sql import functions as F

BRANCHES = ("leeds", "york")


def parse_params(raw):
    branch = raw.get("branch")
    if branch not in BRANCHES:
        raise ValueError(f"unknown branch: {branch!r}")
    days_text = raw.get("days", "14")
    if not days_text.strip().isdigit():
        raise ValueError(f"days must be a whole number: {days_text!r}")
    return {"branch": branch, "days": int(days_text), "dry_run": raw.get("dry_run", "false").lower() == "true"}


def split_magic(cell, default="python"):
    first, _, rest = cell.partition("\n")
    if first.startswith("%"):
        return first[1:].strip(), rest
    return default, cell


def redact(text, secrets):
    for value in sorted(filter(None, secrets), key=len, reverse=True):
        text = text.replace(value, "[REDACTED]")
    return text


def load_config(env, scope, keys):
    config = {}
    for key in keys:
        variable = f"{scope}_{key}".upper()
        if variable not in env:
            raise KeyError(f"secret {key!r} missing in scope {scope!r}")
        config[key] = env[variable]
    return config


def masked_config(config, secret_keys):
    return {k: "[REDACTED]" if k in secret_keys else v for k, v in config.items()}


def recent_loans(loans, params):
    return loans.filter((F.col("branch") == params["branch"]) & (F.col("days_out") <= params["days"]))
