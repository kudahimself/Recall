/**
 * Topic.DJ_CICD — all question types for this topic.
 * Auto-consolidated by scripts/consolidate-by-topic.js from:
 *   backendAdvancedPedagogyQuestions.ts (1), backendInfraQuestions.ts (4), djangoBatchDExpansionQuestions.ts (6)
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const dj_cicd_questions: Question[] = [
  {
      id: 'dj-cicd-parsons-1',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_CICD,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Assemble a GitHub Actions workflow (YAML) that, on a push to `main`, checks out the code, sets up Python 3.12, installs `requirements.txt` and runs the tests with Django\'s own test runner. Put the top-level keys in the usual order (`name`, `on`, `jobs`) and give the job its `runs-on` before its `steps`.',
      correctOrder: [
        'name: CI',
        'on:',
        '  push:',
        '    branches: [main]',
        'jobs:',
        '  test:',
        '    runs-on: ubuntu-latest',
        '    steps:',
        '      - uses: actions/checkout@v4',
        '      - uses: actions/setup-python@v5',
        '        with:',
        '          python-version: "3.12"',
        '      - run: pip install -r requirements.txt',
        '      - run: python manage.py test',
      ],
      distractorLines: [
        '    on: push',
        '      - run: pip install requirements.txt',
        '      - run: pytest --no-cov',
        '      - uses: setup-python',
        '    runs-on: linux',
      ],
      solution: 'name: CI\non:\n  push:\n    branches: [main]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-python@v5\n        with:\n          python-version: "3.12"\n      - run: pip install -r requirements.txt\n      - run: python manage.py test',
      explanation: 'The top-level keys are `name`, `on` and `jobs`; `on:` lists the triggers, here `push` filtered to the `main` branch. Each job runs on a fresh machine named by `runs-on:` (`ubuntu-latest`, not a bare `linux`), and its steps run in order: check out, set up Python, install, test. An action is named `owner/repo@version`, so `actions/setup-python@v5`, not `setup-python`. `pip install requirements.txt` would look for a package of that name; `-r` reads the file. `python manage.py test` is Django\'s own runner; `pytest --no-cov` needs pytest and the pytest-cov plugin.',
      hints: ['Top-level: name, on, jobs', 'actions/checkout@v4 first; setup-python@v5 next', 'runs-on: ubuntu-latest'],
      tags: ['django', 'cicd', 'github-actions', 'parsons'],
      concepts: ['dj-deployment-cicd'],
    },
  {
      id: 'py-dj-cicd-what',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_CICD,
      course: Course.BACKEND,
      question: 'What\'s the difference between Continuous Integration (CI), Continuous Delivery (CD), and Continuous Deployment?',
      options: [
        { id: 'a', text: 'CI: every push runs automated tests. Delivery: every green build ships to production on its own. Deployment: a person approves each release', isCorrect: false },
        { id: 'b', text: 'CI: a nightly job merges all branches and tests them. Delivery and Deployment: two vendor names for shipping each green build automatically', isCorrect: false },
        { id: 'c', text: 'CI: each developer runs the tests locally before pushing. Delivery and Deployment: the server runs the same tests again before a manual release', isCorrect: false },
        { id: 'd', text: 'CI: every push runs automated tests. Delivery: a tested build waits for a manual approval to deploy. Deployment: green builds ship to production', isCorrect: true },
      ],
      explanation: 'CI is the baseline: every push and pull request runs the tests on a server, so nothing reaches `main` untested; running them only on your own machine is not CI. Continuous delivery keeps every green build ready to release, with a person pressing the button. Continuous deployment removes that button: every green build of `main` goes to production, which needs strong tests, feature flags and monitoring. The two CD terms are different practices, and the approval step is what tells them apart: an automatic release with no approval is deployment, not delivery.',
      hints: [
        'CI = tests on every push',
        'Delivery = build artifact ready for manual deploy',
        'Deployment = auto-deploy to prod on every green build',
      ],
      tags: ['django', 'cicd', 'concepts'],
      concepts: ['dj-deployment-cicd'],
    },
  {
      id: 'py-dj-cicd-gha-tests',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_CICD,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Fill in the GitHub Actions workflow (`.github/workflows/test.yml`) that runs on every push and pull request: it picks the machine the job runs on, checks out the code, sets up Python 3.12, installs the requirements, then runs the Django test suite.',
      template: `name: CI
on: [push, pull_request]
jobs:
  test:
    ___: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/___@v5
        with:
          python-version: "3.12"
      - run: pip install -r requirements.txt
      - run: python manage.py ___`,
      blanks: ['runs-on', 'setup-python', 'test'],
      solution: 'name: CI\non: [push, pull_request]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-python@v5\n        with:\n          python-version: "3.12"\n      - run: pip install -r requirements.txt\n      - run: python manage.py test',
      explanation: 'A minimal CI workflow is about a dozen lines. `runs-on:` names the machine, `on: [push, pull_request]` covers both events, `actions/checkout@v4` fetches the code and `actions/setup-python@v5` installs the requested Python. `python manage.py test` needs no `migrate` step first: the test runner creates a separate test database and applies the migrations to it. A failing test makes the command exit non-zero, which fails the job. Real projects add linting (`ruff check`), type checks (`mypy`), coverage and `cache: pip` on `setup-python`.',
      hints: [
        'The first blank is the job key that names the machine the job runs on.',
        'The official action that installs Python is named for what it does: it sets Python up.',
        'Django\'s test runner is a `manage.py` command.',
      ],
      tags: ['django', 'cicd', 'github-actions'],
      concepts: ['dj-deployment-cicd'],
    },
  {
      id: 'py-dj-cicd-gha-matrix',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_CICD,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Fill in the blanks so the test job runs three times in parallel, once each on Python 3.11, 3.12 and 3.13, and each run installs the Python version it was given.',
      template: `jobs:
  test:
    runs-on: ubuntu-latest
    ___:
      matrix:
        python-version: ["3.11", "3.12", "3.13"]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: \${{ ___.python-version }}
      - run: pip install -r requirements.txt
      - run: python manage.py test`,
      blanks: ['strategy', 'matrix'],
      // eslint-disable-next-line no-template-curly-in-string
      solution: 'jobs:\n  test:\n    runs-on: ubuntu-latest\n    strategy:\n      matrix:\n        python-version: ["3.11", "3.12", "3.13"]\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-python@v5\n        with:\n          python-version: ${{ matrix.python-version }}\n      - run: pip install -r requirements.txt\n      - run: python manage.py test',
      explanation: `Matrix tests your project against multiple interpreter versions (or DBs, OSes) in parallel. Matrix values are interpolated via \`\${{ matrix.<name> }}\`. \`fail-fast: false\` lets all cells run even if one fails (useful to see which versions break). Combine with \`include:\` for extra specific combos, \`exclude:\` to skip. Shipping a library? Matrix test every supported Python. Shipping a service? Only the version you run.`,
      hints: [
        'The first blank is the job key that holds settings for how the job is run; `matrix:` sits inside it.',
        // eslint-disable-next-line no-template-curly-in-string
        'Inside `${{ }}`, a value of the current run is read through the name of the block that lists the values.',
      ],
      tags: ['django', 'cicd', 'github-actions', 'matrix'],
      concepts: ['dj-deployment-cicd'],
    },
  {
      id: 'py-dj-cicd-gha-cache',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_CICD,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Fill in the setup-python step so the packages pip downloads are cached between CI runs. The first blank is the input that turns caching on, the second the package manager it caches for. The last line, already filled in, keys the cache on `requirements/dev.txt`, where this project keeps its requirements.',
      template: `- uses: actions/setup-python@v5
  with:
    python-version: "3.12"
    ___: "___"
    cache-dependency-path: "requirements/dev.txt"`,
      blanks: ['cache', 'pip'],
      solution: '- uses: actions/setup-python@v5\n  with:\n    python-version: "3.12"\n    cache: "pip"\n    cache-dependency-path: "requirements/dev.txt"',
      explanation: '`cache: "pip"` makes `actions/setup-python@v5` save pip\'s download cache at the end of a run and restore it at the start of the next, so `pip install` skips the downloads. The cache key is a hash of the dependency file: when it changes, a fresh cache is built. By default the action hashes every `requirements.txt` in the repository; `cache-dependency-path` points it at another file, here `requirements/dev.txt`. The input also accepts `pipenv` and `poetry`. For other caches (browsers, node_modules) use `actions/cache@v4` with an explicit `key:` and `path:`.',
      hints: [
        'The input that turns caching on is named after what it does.',
        'The second blank is the name of the tool that runs `install -r requirements/dev.txt`.',
      ],
      tags: ['django', 'cicd', 'github-actions', 'cache'],
      concepts: ['dj-deployment-cicd', 'dj-caching'],
    },
  {
      id: 'py-dj-cicd-secrets',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_CICD,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Fill in the step so the repository secret `DATABASE_URL` reaches the command as an environment variable, instead of being written into the YAML.',
      template: `- name: Run migrations
  ___:
    DATABASE_URL: \${{ ___.DATABASE_URL }}
  run: python manage.py migrate`,
      blanks: ['env', 'secrets'],
      // eslint-disable-next-line no-template-curly-in-string
      solution: '- name: Run migrations\n  env:\n    DATABASE_URL: ${{ secrets.DATABASE_URL }}\n  run: python manage.py migrate',
      // eslint-disable-next-line no-template-curly-in-string
      explanation: '`env:` sets environment variables for the step, and `${{ secrets.DATABASE_URL }}` reads the secret saved in the repository settings (Settings → Secrets and variables → Actions). GitHub masks the exact secret value as `***` in the log, but a changed form of it, such as its base64 encoding, is not masked, so never print secrets. Organization secrets share one value across repositories, and an `environment:` adds its own secrets and can require a reviewer before a production job runs.',
      hints: [
        'The first blank is the step key that sets environment variables.',
        // eslint-disable-next-line no-template-curly-in-string
        'Inside `${{ }}`, saved repository secrets are read through a context named after them.',
      ],
      tags: ['django', 'cicd', 'secrets', 'github-actions'],
      concepts: ['py-security-primitives'],
    },
  {
      id: 'py-dj-cicd-deploy-step',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_CICD,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Fill in the deploy job so it runs only after the test job passes, only on pushes to `main`, and against the protected `production` environment.',
      template: `jobs:
  test:
    runs-on: ubuntu-latest
    # ... test steps
  deploy:
    ___: test
    if: github.ref == 'refs/heads/main'
    ___: production
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: ./deploy.sh`,
      blanks: ['needs', 'environment'],
      solution: "jobs:\n  test:\n    runs-on: ubuntu-latest\n    # ... test steps\n  deploy:\n    needs: test\n    if: github.ref == 'refs/heads/main'\n    environment: production\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: ./deploy.sh",
      explanation: '`needs: test` makes `deploy` wait for `test` and run only if it passed; without it the two jobs start together and a failing test cannot stop the deploy. `if:` runs the job only when its condition holds, here a ref of `main`. `environment: production` ties the job to that environment: its secrets become available, any required reviewers must approve first, and GitHub records which commit is deployed there. Test on every push, deploy only from `main`, and gate production behind reviewers.',
      hints: [
        'needs: job_name = run after that job',
        'if: condition = filter when job runs',
        'environment: name = activate environment secrets + history',
      ],
      tags: ['django', 'cicd', 'deployment', 'github-actions'],
      concepts: ['dj-deployment-cicd'],
    },
  {
      id: 'dj-cicd-predict-1',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_CICD,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'This GitHub Actions workflow is started by a push to `main`. The second step of the `test` job stands in for a test run that fails: it prints a line and exits with code 1. What do the `run` steps print, across both jobs? The answer is only the lines the steps print, one per line in the order they run, without the log lines GitHub adds itself.',
      code: `on: push
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - run: echo "lint ok"
      - run: echo "2 tests failed"; exit 1
      - run: echo "tests ok"
  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - run: echo "deployed"`,
      expectedOutput: `lint ok
2 tests failed`,
      explanation: 'Steps in a job run in order, and a step that exits with a non-zero code fails the job: the steps after it are skipped, so "tests ok" never prints. `needs: test` makes `deploy` wait for `test` and run only if it succeeded, so `deploy` is skipped even though its `if:` condition is true for a push to `main`. This is how a pipeline keeps a failing build away from production: the test runner\'s exit code decides.',
      hints: ['A step that exits with a non-zero code fails its job, and the later steps are skipped.', 'needs: runs a job only after the jobs it names have succeeded.'],
      tags: ['django', 'cicd', 'github-actions', 'needs', 'predict'],
      concepts: ['dj-deployment-cicd'],
    },
];
