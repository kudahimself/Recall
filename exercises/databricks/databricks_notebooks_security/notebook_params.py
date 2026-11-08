"""Parameters, magics and secrets handled in plain Python: fill in the TODOs."""


def parse_params(raw):
    """Turn widget values (all strings, as `dbutils.widgets.get` returns them) into typed parameters.

    Return {"branch": str, "days": int, "dry_run": bool}:
    - branch is required and must be "leeds" or "york";
    - days defaults to 14 when missing, and must be a whole number;
    - dry_run defaults to False, and is True for "true" in any letter case.
    Raise ValueError for an unknown branch or a days value that is not a whole number.
    """
    # TODO: read each key from `raw` and convert it
    raise NotImplementedError


def split_magic(cell, default="python"):
    """Split a cell into (language, body).

    A first line such as `%sql` or `%md` names the language without the percent sign
    and the body is the remaining lines. A cell with no magic is (default, the whole cell).
    """
    # TODO: look at the first line
    raise NotImplementedError


def redact(text, secrets):
    """Replace every secret value found in `text` with [REDACTED], skipping empty secrets.

    Replace longer secrets first, so a secret that contains another is hidden completely.
    """
    # TODO: replace each value
    raise NotImplementedError


def load_config(env, scope, keys):
    """Read secrets for `keys` from the `env` mapping, named `<SCOPE>_<KEY>` in upper case.

    Return {key: value}. Raise KeyError whose message names the scope and key, never a value,
    when one is missing.
    """
    # TODO: build each variable name and look it up
    raise NotImplementedError


def masked_config(config, secret_keys):
    """Return a copy of `config` that is safe to print, with the values of `secret_keys` replaced by [REDACTED]."""
    # TODO: copy and mask
    raise NotImplementedError


def recent_loans(loans, params):
    """Return the loans DataFrame (branch, title, days_out) filtered to one parameter set.

    Keep rows from params["branch"] that have been out for at most params["days"] days.
    """
    # TODO: filter in Spark with the typed parameters
    raise NotImplementedError
