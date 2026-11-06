# Release pipeline

Topic: CI/CD with GitHub Actions (Backend, Testing & CI/CD).
Time: about 20 minutes.

## Task

The library's Django project has a first try at a GitHub Actions workflow, `.github/workflows/ci.yml` in this folder.
It would run, but it tests too little, too late, and it deploys whatever happens.
Fix the file so it does this:

- A run starts on every pull request and on a push to `main`, and on no other push.
- The `test` job checks the code out, then sets Python up with `actions/setup-python`, then runs `pip install -r requirements.txt`, then `python manage.py test`, in that order.
- `setup-python` caches pip's downloads between runs.
- The `test` job runs once for Python `"3.12"` and once for `"3.13"`, through a `strategy.matrix` named `python-version`, and `setup-python` takes its version from the matrix.
  Quote the versions: YAML reads an unquoted `3.10` as the number `3.1`.
- The `deploy` job waits for `test` and runs only if it passed.
- `deploy` runs only for a push to `main`, never for a pull request.
- `deploy` uses the `production` environment, so it gets that environment's secrets and reviewers.
- `./deploy.sh` still runs, but `DEPLOY_TOKEN` comes from the repository secret of the same name; the real token, written into the file, must go.

Keep the job names `test` and `deploy`.
Any correct `if:` passes: the tests work it out for a push to `main` and for a pull request, rather than comparing its text.

## Example

The fixed `deploy` job starts like this:

```yaml
deploy:
  needs: test
  if: ...           # true for a push to main, false for a pull request
  environment: production
```

Watch for the lesson's pitfall: jobs run in parallel unless `needs:` says otherwise.
A deploy job without `needs: test` starts with the tests and ships the build even when they then fail.

## Run the tests

```bash
cd exercises/backend/dj_cicd
pytest
```

The tests read `ci.yml` with PyYAML and check its triggers, jobs and steps; nothing calls GitHub and nothing runs the workflow.
GitHub only reads workflows from `.github/workflows/` at the root of a repository, so this copy never runs on GitHub either.
One thing to know when you read the tests: PyYAML follows YAML 1.1, which reads a bare `on` key as the boolean `True`, so the tests rename it back; GitHub reads it as `on`.
When they all pass, tick the exercise done in Recall under Progress, Topics.
