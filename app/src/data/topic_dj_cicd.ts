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
      question: 'Assemble a GitHub Actions workflow (YAML) that, on push to main, sets up Python 3.12, installs requirements, and runs Django tests.',
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
        '  test:',
        '      - run: pytest --no-cov',
        '      - uses: setup-python',
        '    runs-on: linux',
      ],
      solution: 'name: CI\non:\n  push:\n    branches: [main]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-python@v5\n        with:\n          python-version: "3.12"\n      - run: pip install -r requirements.txt\n      - run: python manage.py test',
      explanation: 'Top-level keys are `name`, `on`, `jobs`. `on:` triggers — `push` with `branches` filter. Each job runs on its own runner; `runs-on: ubuntu-latest` is the standard. Use the `actions/...@vN` form (pinned major versions) for stability. `python manage.py test` is the canonical Django test command.',
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
        { id: 'a', text: 'They are three names for the same pipeline — the terms just reflect which CI vendor (GitHub, GitLab, Jenkins) you happen to use', isCorrect: false },
        { id: 'b', text: 'Only CI is a real practice — Delivery and Deployment are marketing terms vendors invented to sell hosted pipeline products', isCorrect: false },
        { id: 'c', text: 'CI runs your test suite against production servers, while CD runs it in development — the letters refer to the target environment', isCorrect: false },
        { id: 'd', text: 'CI: every push runs automated tests. Delivery: a tested artifact awaits a manual deploy approval. Deployment: green builds auto-ship to production', isCorrect: true },
      ],
      explanation: 'Practical progression: CI is baseline (no push to main without passing tests). Delivery means "production deploy is a button away" — still a human approve step. Deployment automates that approval too — every green main commit rolls out. Requires very high test confidence + feature flags + monitoring. Most teams do CI + Delivery; fully automated Deployment is an advanced destination, not a starting point.',
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
      question: 'Fill in the GitHub Actions workflow (`.github/workflows/test.yml`) that runs on every push / PR: check out code, set up Python 3.12, install requirements, migrate, then run the Django test suite.',
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
      - run: python manage.py migrate
      - run: python manage.py ___`,
      blanks: ['runs-on', 'setup-python', 'test'],
      solution: 'name: CI\non: [push, pull_request]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-python@v5\n        with:\n          python-version: "3.12"\n      - run: pip install -r requirements.txt\n      - run: python manage.py migrate\n      - run: python manage.py test',
      explanation: 'Minimum viable CI: ~15 lines of YAML. `on: [push, pull_request]` covers both. `actions/checkout@v4` fetches the code; `actions/setup-python@v5` installs the requested Python. Run tests via `manage.py test` or `pytest`. For real projects add: linting (`ruff check`), type checks (`mypy`), coverage reporting (`coverage run && coverage xml`), dependency caching (next question). Failing exit code fails the job.',
      hints: [
        'on: [push, pull_request] runs on both',
        'Steps are ordered; any non-zero exit fails the job',
        'Add lint / typecheck / coverage for real projects',
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
      question: 'Fill in the matrix strategy so the test job runs in parallel across Python 3.11, 3.12, and 3.13.',
      template: `jobs:
  test:
    runs-on: ubuntu-latest
    ___:
      matrix:
        python-version: ["3.11", "3.12", "3.13"]
    steps:
      - uses: actions/setup-python@v5
        with:
          python-version: \${{ ___.python-version }}
      - run: python manage.py test`,
      blanks: ['strategy', 'matrix'],
      solution: 'jobs:\n  test:\n    runs-on: ubuntu-latest\n    strategy:\n      matrix:\n        python-version: ["3.11", "3.12", "3.13"]\n    steps:\n      - uses: actions/setup-python@v5\n        with:\n          python-version: ${{ matrix.python-version }}\n      - run: python manage.py test',
      explanation: `Matrix tests your project against multiple interpreter versions (or DBs, OSes) in parallel. Matrix values are interpolated via \`\${{ matrix.<name> }}\`. \`fail-fast: false\` lets all cells run even if one fails (useful to see which versions break). Combine with \`include:\` for extra specific combos, \`exclude:\` to skip. Shipping a library? Matrix test every supported Python. Shipping a service? Only the version you run.`,
      hints: [
        'strategy.matrix expands into parallel jobs',
        // eslint-disable-next-line no-template-curly-in-string
        'Use ${{ matrix.key }} to reference the current value',
        'fail-fast: false to run all cells even on failure',
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
      question: 'Fill in the setup-python step so pip dependencies are cached between CI runs (invalidated when the requirements file changes).',
      template: `- uses: actions/setup-python@v5
  with:
    python-version: "3.12"
    ___: "pip"
    ___: "requirements.txt"`,
      blanks: ['cache', 'cache-dependency-path'],
      solution: '- uses: actions/setup-python@v5\n  with:\n    python-version: "3.12"\n    cache: "pip"\n    cache-dependency-path: "requirements.txt"',
      explanation: 'Built-in `cache: "pip"` in `actions/setup-python@v5` hashes the `cache-dependency-path` file(s) — if unchanged, restores the pip cache, skipping slow downloads. Save can reduce a 2-minute `pip install` to 10 seconds. Also supports `pipenv` / `poetry`. For low-level control use `actions/cache@v4` with an explicit `key:` and `path:` — useful for caching Playwright browsers, node_modules, compiled extensions.',
      hints: [
        'cache: "pip" — built-in, fast to enable',
        'cache-dependency-path hashes the lockfile to invalidate',
        'actions/cache@v4 for custom caches (browsers, node_modules)',
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
      question: 'Fill in the step so the repo secret `DATABASE_URL` is injected as an environment variable (auto-redacted from logs), never hardcoded in YAML.',
      template: `- name: Run migrations
  ___:
    DATABASE_URL: \${{ ___.DATABASE_URL }}
  run: python manage.py migrate`,
      blanks: ['env', 'secrets'],
      solution: '- name: Run migrations\n  env:\n    DATABASE_URL: ${{ secrets.DATABASE_URL }}\n  run: python manage.py migrate',
      explanation: 'Secrets live in repo Settings → Secrets. Never echo them (`echo $SECRET` would print literally in the log — but GitHub auto-redacts exact matches of secret values in output as a safety net). Organization-level secrets let you share across repos (deploy keys, shared API tokens). `environments` add approval + deploy-specific secrets. For very sensitive ops (prod deploys), protect the environment with required reviewers.',
      hints: [
        'Store in repo Settings → Secrets → Actions',
        // eslint-disable-next-line no-template-curly-in-string
        'Use: env: NAME: ${{ secrets.NAME }}',
        'Environments can require reviewer approval on deploy',
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
      explanation: '`needs:` creates a job dependency (deploy waits for test). `if:` filters which refs trigger (only `main`, or a tag). `environment:` declares the deployment target — GitHub tracks which commit is deployed where, and environment-specific secrets / required reviewers activate. This is the canonical pattern: test everything, deploy only from `main`, gate production behind reviewers for sensitive apps.',
      hints: [
        'needs: job_name = run after that job',
        'if: condition = filter when job runs',
        'environment: name = activate environment secrets + history',
      ],
      tags: ['django', 'cicd', 'deployment', 'github-actions'],
      concepts: ['dj-deployment-cicd'],
    },
];
