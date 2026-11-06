"""Check .github/workflows/ci.yml by reading it as YAML: nothing calls GitHub.

The tests parse the workflow with PyYAML and check its triggers, jobs and steps.
For the deploy job's `if:`, they work the expression out themselves for a push to
main and for a pull request, so any correct way of writing the condition passes.
"""
import re
from pathlib import Path

import pytest
import yaml

WORKFLOW = Path(__file__).resolve().parent / ".github" / "workflows" / "ci.yml"


@pytest.fixture
def workflow():
    text = WORKFLOW.read_text()
    data = yaml.safe_load(text)
    assert isinstance(data, dict), "ci.yml should be a YAML mapping with name, on and jobs"
    # YAML 1.1, which PyYAML follows, reads a bare `on` key as the boolean True.
    if True in data:
        data["on"] = data.pop(True)
    data["_text"] = text
    return data


def job(workflow, name):
    jobs = workflow.get("jobs") or {}
    assert name in jobs, f"the workflow needs a job named {name!r}"
    return jobs[name]


def kind(step):
    """What a step does, in the words the tests use, or None for any other step."""
    uses = step.get("uses", "")
    run = step.get("run", "")
    if uses.startswith("actions/checkout@"):
        return "checkout"
    if uses.startswith("actions/setup-python@"):
        return "setup-python"
    if "pip install -r requirements.txt" in run:
        return "install"
    if "manage.py test" in run:
        return "test"
    return None


def setup_python(workflow):
    steps = [s for s in job(workflow, "test").get("steps", []) if kind(s) == "setup-python"]
    assert steps, "the test job needs an actions/setup-python step"
    return steps[0].get("with") or {}


def squash(value):
    """An expression with its spacing removed, so `${{secrets.X}}` and `${{ secrets.X }}` match."""
    return re.sub(r"\s+", "", str(value))


TOKEN = re.compile(r"""\s*('(?:[^']|'')*'|==|!=|&&|\|\||!|\(|\)|,|[A-Za-z_][\w.\-]*|\d+)""")


def evaluate(expression, github):
    """Work out a GitHub Actions `if:` expression for one run's `github` context.

    Handles what an `if:` usually holds: contexts such as github.ref, 'strings',
    ==, !=, &&, ||, !, brackets and startsWith/endsWith/contains. Like GitHub,
    it compares strings ignoring case.
    """
    source = str(expression).strip()
    if source.startswith("${{") and source.endswith("}}"):
        source = source[3:-2]
    python, pos = [], 0
    while pos < len(source.rstrip()):
        match = TOKEN.match(source, pos)
        assert match, f"cannot read the if: expression {expression!r} near {source[pos:]!r}"
        tok, pos = match.group(1), match.end()
        if tok.startswith("'"):
            python.append(repr(tok[1:-1].replace("''", "'").lower()))
        elif tok in ("&&", "||", "!"):
            python.append({"&&": " and ", "||": " or ", "!": " not "}[tok])
        elif tok in ("==", "!=", "(", ")", ","):
            python.append(tok)
        elif tok in ("true", "false", "null"):
            python.append({"true": "True", "false": "False", "null": "None"}[tok])
        elif tok in ("startsWith", "endsWith", "contains", "success", "always"):
            python.append(f"_{tok}")
        elif tok[0].isdigit():
            python.append(tok)
        else:
            path = tok.split(".")
            assert path[0] == "github", f"the deploy if: only needs the github context, not {tok!r}"
            value = github.get(".".join(path[1:]), "")
            python.append(repr(value.lower()))
    names = {
        "_startsWith": lambda s, p: str(s).startswith(str(p)),
        "_endsWith": lambda s, p: str(s).endswith(str(p)),
        "_contains": lambda s, p: str(p) in str(s),
        "_success": lambda: True,
        "_always": lambda: True,
    }
    return bool(eval("".join(python), {"__builtins__": {}}, names))


PUSH_TO_MAIN = {"event_name": "push", "ref": "refs/heads/main", "ref_name": "main"}
PULL_REQUEST = {
    "event_name": "pull_request", "ref": "refs/pull/7/merge", "ref_name": "7/merge",
    "base_ref": "main", "head_ref": "fix-fines",
}


def test_runs_for_pull_requests_and_pushes_to_main(workflow):
    on = workflow.get("on")
    assert isinstance(on, dict), "on: should be a mapping with push and pull_request under it"
    assert "pull_request" in on, "every pull request should run the tests"
    assert isinstance(on.get("push"), dict), "push: should list its branches"
    assert on["push"].get("branches") == ["main"], "only pushes to main should start a run"


def test_the_test_job_runs_its_steps_in_order(workflow):
    kinds = [kind(s) for s in job(workflow, "test").get("steps", [])]
    assert [k for k in kinds if k] == ["checkout", "setup-python", "install", "test"], (
        "check the code out first, then set Python up, then install, then run the tests"
    )


def test_pip_downloads_are_cached(workflow):
    assert setup_python(workflow).get("cache") == "pip"


def test_each_python_version_gets_its_own_job(workflow):
    matrix = (job(workflow, "test").get("strategy") or {}).get("matrix") or {}
    versions = matrix.get("python-version")
    assert versions, "the test job needs a strategy.matrix with a python-version list"
    assert all(isinstance(v, str) for v in versions), (
        "quote the versions: YAML reads 3.10 as the number 3.1"
    )
    assert versions == ["3.12", "3.13"]
    assert squash(setup_python(workflow).get("python-version")) == "${{matrix.python-version}}"


def test_deploy_waits_for_the_tests(workflow):
    needs = job(workflow, "deploy").get("needs")
    assert needs in ("test", ["test"]), "without needs: test, deploy starts at once and ships a failing build"


def test_deploy_runs_only_for_a_push_to_main(workflow):
    condition = job(workflow, "deploy").get("if")
    assert condition, "deploy needs an if: that lets only a push to main through"
    assert evaluate(condition, PUSH_TO_MAIN) is True, "a push to main should deploy"
    assert evaluate(condition, PULL_REQUEST) is False, "a pull request should not deploy"


def test_deploy_uses_the_production_environment(workflow):
    environment = job(workflow, "deploy").get("environment")
    if isinstance(environment, dict):
        environment = environment.get("name")
    assert environment == "production"


def test_the_token_comes_from_a_secret(workflow):
    steps = [s for s in job(workflow, "deploy").get("steps", []) if "./deploy.sh" in s.get("run", "")]
    assert steps, "the deploy job should still run ./deploy.sh"
    env = steps[0].get("env") or {}
    assert squash(env.get("DEPLOY_TOKEN")) == "${{secrets.DEPLOY_TOKEN}}"
    assert "dpl_live_" not in workflow["_text"], "the real token must not stay anywhere in the file"
