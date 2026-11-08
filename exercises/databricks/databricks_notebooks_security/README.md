# Parameters and secrets

Topic: Notebook Mechanics, Secrets & Security (Databricks, Lakehouse Platform).
Time: about 20 minutes.

## Task

A notebook gets its inputs from widgets and its credentials from secret scopes, and both need care.
You write six helpers in `notebook_params.py` that make the same decisions in plain Python, so they work without `dbutils`:

- `parse_params(raw)` converts widget-style strings into `{"branch", "days", "dry_run"}`, with defaults and validation.
- `split_magic(cell, default="python")` splits a cell into its language and body, reading a first line such as `%sql`.
- `redact(text, secrets)` replaces secret values in text with `[REDACTED]`.
- `load_config(env, scope, keys)` reads secrets from an environment mapping and names a missing one without printing any value.
- `masked_config(config, secret_keys)` returns a copy that is safe to print.
- `recent_loans(loans, params)` filters a Spark DataFrame with the typed parameters.

## Examples

```python
params = parse_params({"branch": "york", "days": "7"})   # {"branch": "york", "days": 7, "dry_run": False}
split_magic("%sql\nSELECT 1")                            # ("sql", "SELECT 1")
redact("token=abc123", ["abc123"])                       # "token=[REDACTED]"
```

Watch for the lesson's pitfall: a password typed into a notebook or a widget is visible to everyone who can read it or its history, so secrets come from a scope and are never printed.
Also remember that `dbutils.widgets.get` returns a string, which is why `parse_params` converts `days` itself.

## What differs on Databricks

In a notebook you call `dbutils.widgets.get`, which a job fills with its parameters, and `dbutils.secrets.get(scope, key)`, which reads from a secret scope that Databricks or Azure Key Vault holds and checks permissions for.
Databricks also redacts a secret's value in cell output for you, and `%sql`, `%md` and `%run` are handled by the notebook itself.
Here there is no `dbutils`, so a plain dict plays the widgets, an environment mapping plays the scope, and you write the redaction and parsing that the platform does for you.

## Run the tests

Set up Java and the packages once (see `exercises/databricks/README.md`), then:

```bash
cd exercises/databricks/databricks_notebooks_security
pytest
```

The first run starts Spark and takes a little while.
Every test fails until you fill in the functions.
When they all pass, tick the exercise done in Recall under Progress, Topics.
