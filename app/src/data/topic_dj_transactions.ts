/**
 * Topic.DJ_TRANSACTIONS — all question types for this topic.
 * Auto-consolidated by scripts/consolidate-by-topic.js from:
 *   backendAdvancedPedagogyQuestions.ts (2), djangoAdvancedQuestions.ts (2), djangoBatchDExpansionQuestions.ts (6), djangoGapFillQuestions.ts (2)
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const dj_transactions_questions: Question[] = [
  {
      id: 'dj-transactions-parsons-1',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_TRANSACTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Wrap a credit/debit transfer in a single atomic block so either both rows update or neither does.',
      correctOrder: [
        'from django.db import transaction',
        '',
        'def transfer(from_id, to_id, amount):',
        '    with transaction.atomic():',
        '        Account.objects.filter(pk=from_id).update(balance=F("balance") - amount)',
        '        Account.objects.filter(pk=to_id).update(balance=F("balance") + amount)',
      ],
      distractorLines: [
        '    with transaction.commit():',
        '    @transaction.atomic',
        '    transaction.atomic()',
        '        Account.objects.filter(pk=from_id).balance -= amount',
      ],
      solution: 'from django.db import transaction\n\ndef transfer(from_id, to_id, amount):\n    with transaction.atomic():\n        Account.objects.filter(pk=from_id).update(balance=F("balance") - amount)\n        Account.objects.filter(pk=to_id).update(balance=F("balance") + amount)',
      explanation: '`transaction.atomic()` is a context manager (or decorator). On normal exit it COMMITs; on any unhandled exception it ROLLBACKs both updates. Use F() expressions to push the math into SQL — read-modify-write in Python would lose updates under concurrent writes.',
      hints: ['transaction.atomic() is a context manager or decorator', 'F() avoids race conditions on counters'],
      tags: ['django', 'transactions', 'atomic', 'parsons'],
      concepts: ['dj-transaction-atomic'],
    },
  {
      id: 'dj-transactions-predict-1',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_TRANSACTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What\'s in the database after this runs? (Article model exists; no rows initially.)',
      code: `from django.db import transaction

try:
    with transaction.atomic():
        Article.objects.create(title="A")
        Article.objects.create(title="B")
        raise ValueError("boom")
except ValueError:
    pass

print(Article.objects.count())`,
      expectedOutput: `0`,
      explanation: 'When the `atomic` block exits via exception, Django ROLLBACKs everything done inside — so neither Article persists. Catching the exception OUTSIDE the `with` is what allows the script to continue; catching INSIDE would not have rolled back. Atomic blocks are all-or-nothing.',
      hints: ['Exception inside atomic = rollback', 'Catch outside the `with` to let rollback happen'],
      tags: ['django', 'transactions', 'rollback', 'predict'],
      concepts: ['dj-transaction-atomic'],
    },
  {
      id: 'dj-tx-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.DJ_TRANSACTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write a `transfer_funds` function that transfers money between two accounts atomically. Use transaction.atomic() to ensure that if any step fails (insufficient funds, account not found), all database changes are rolled back. The Account model has fields: owner (CharField), balance (DecimalField). Raise a ValueError if the sender has insufficient funds.',
      starterCode: ``,
      testCases: [
        {
          input: 'transfer_funds(1, 2, Decimal("100.00"))',
          expectedOutput: 'Atomic transaction that debits sender, credits receiver, logs transfer, or rolls back on error',
          description: 'Should perform atomic fund transfer with rollback on failure',
        },
      ],
      solution: `from django.db import transaction
from .models import Account, TransferLog
from decimal import Decimal

def transfer_funds(from_id, to_id, amount):
    with transaction.atomic():
        sender = Account.objects.select_for_update().get(pk=from_id)
        receiver = Account.objects.select_for_update().get(pk=to_id)

        if sender.balance < amount:
            raise ValueError("Insufficient funds")

        sender.balance -= amount
        sender.save()

        receiver.balance += amount
        receiver.save()

        TransferLog.objects.create(
            from_account=sender,
            to_account=receiver,
            amount=amount,
        )`,
      tieredHints: {
        apiSignature: 'transaction.atomic(); queryset.select_for_update().get(pk=id)',
        skeleton: 'from django.db import transaction\nfrom .models import Account, TransferLog\nfrom decimal import Decimal\n\ndef ____(from_id, to_id, amount):\n    with ____.____():\n        sender = ____.____.____().get(pk=from_id)\n        receiver = ____.____.____().get(pk=to_id)\n\n        if sender.____ < amount:\n            raise ____("Insufficient funds")\n\n        sender.____ -= amount\n        sender.____()\n\n        receiver.____ += amount\n        receiver.____()\n\n        ____.____.____(\n            from_account=sender,\n            to_account=receiver,\n            amount=amount,\n        )',
      },
      explanation: 'transaction.atomic() creates a database savepoint. If any exception is raised inside the block, ALL changes within it are rolled back — the sender\'s debit, receiver\'s credit, and the transfer log are all undone. This is critical for financial operations where partial updates would mean money disappearing or being duplicated. The select_for_update() call acquires a row-level lock, preventing other transactions from modifying these accounts until this transaction completes. Without atomic(), if the code crashed after debiting the sender but before crediting the receiver, the money would vanish. The with-statement syntax is preferred over the @transaction.atomic decorator because it gives you finer control over exactly which operations should be atomic.',
      hints: [
        'Use "with transaction.atomic():" as a context manager',
        'select_for_update() locks rows to prevent concurrent modification',
        'Raising an exception inside atomic() triggers automatic rollback',
      ],
      tags: ['django', 'transactions', 'atomic', 'database', 'consistency'],
      concepts: ['dj-transaction-atomic'],
    },
  {
      id: 'py-dj-tx-what',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_TRANSACTIONS,
      course: Course.BACKEND,
      question: 'What does a database TRANSACTION guarantee?',
      options: [
        { id: 'a', text: 'ACID: atomicity (all-or-nothing), consistency (constraints hold), isolation (no half-done reads), durability (commits survive crashes)', isCorrect: true },
        { id: 'b', text: 'That your queries run faster — the database batches the statements and executes them as one optimised unit', isCorrect: false },
        { id: 'c', text: 'That data written inside it is encrypted at rest until the transaction commits or rolls back', isCorrect: false },
        { id: 'd', text: 'That failed statements inside it are automatically retried until the whole group eventually succeeds', isCorrect: false },
      ],
      explanation: 'Transactions are Django\'s defense against partial writes. Classic example: transfer $100 from A to B = two updates. WITHOUT a transaction, if the second crashes, you\'ve debited A but not credited B. WITH a transaction, both or neither. Isolation level controls how concurrent transactions interact (default on Postgres: READ COMMITTED — reads see only committed data). Most app code is fine with defaults.',
      hints: [
        'ACID: Atomicity, Consistency, Isolation, Durability',
        'All-or-nothing commit — half-written state never persisted',
        'Default isolation is usually fine; raise only when needed',
      ],
      tags: ['django', 'transactions', 'ACID'],
      concepts: ['dj-transaction-atomic'],
    },
  {
      id: 'py-dj-tx-atomic-decorator',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_TRANSACTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Ensure that all database writes inside a view function named `checkout` execute within a single transaction, so they either all succeed or all roll back. Define this view taking a `request`, create a new `Order` for the current user, and decrement the `count` column of the matching `Inventory` item by one using an `F` expression. Import `transaction` and `models` from `django.db` and use the view decorator approach to enforce the transaction.',
      starterCode: `# Write checkout(request) decorated with @transaction.atomic:
# create an Order for request.user, then decrement the matching
# Inventory row's count by 1 with an F() update. Both writes commit
# together or both roll back.
`,
      testCases: [
        {
          input: '@transaction.atomic decorator',
          expectedOutput: 'Whole view body is one atomic transaction',
          description: 'All DB writes inside commit together or not at all',
        },
      ],
      solution: `from django.db import transaction, models
from django.http import HttpResponse
from .models import Order, Inventory

@transaction.atomic
def checkout(request):
    order = Order.objects.create(user=request.user, total=100)
    Inventory.objects.filter(item=1).update(count=models.F("count") - 1)
    return HttpResponse(f"Order {order.pk} created")`,
      tieredHints: {
        apiSignature: '@transaction.atomic; models.F("count") - 1',
        skeleton: 'from django.db import transaction, models\nfrom django.http import HttpResponse\nfrom .models import Order, Inventory\n\n@____.____\ndef ____(request):\n    order = ____.____.____(user=request.user, total=100)\n    ____.____.____(item=1).____(count=models.____("count") - 1)\n    return ____(f"Order {____.pk} created")',
      },
      explanation: '`@transaction.atomic` on a view wraps the entire request in a transaction. Any exception that escapes the view triggers a rollback. Use when a view performs more than one write that must commit together. WARNING: long transactions hold locks and slow concurrency — don\'t put slow external calls (HTTP, long sleep) inside. Alternative: `with transaction.atomic():` context manager for partial-block scoping (next question).',
      hints: [
        '@transaction.atomic wraps the full function',
        'Exception → rollback; return → commit',
        'Keep transactions short — no external I/O inside',
      ],
      tags: ['django', 'transactions', 'atomic'],
      concepts: ['dj-transaction-atomic'],
    },
  {
      id: 'py-dj-tx-atomic-block',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_TRANSACTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Scope a transaction block to only cover the save operations within a function named `process(a, b)`. Perform non-transactional prep (`a.normalize()` and `b.normalize()`), execute a transactional block enclosing `a.save()` and `b.save()`, and finish with a non-transactional follow-up (`notify(a, b)`). Ensure that any exception raised during the saves rolls back only those modifications.',
      starterCode: `# Write process(a, b): do non-transactional prep, then open a
# transaction.atomic() block scoping ONLY two related saves
# (a.save(), b.save()), then do non-transactional follow-up.
`,
      testCases: [
        {
          input: 'atomic() as context manager',
          expectedOutput: 'Only the two saves inside are transactional',
          description: 'Scope transactions to a block, not the whole function',
        },
      ],
      solution: `from django.db import transaction

def process(a, b):
    # prep (not transactional)
    a.normalize()
    b.normalize()

    with transaction.atomic():
        a.save()
        b.save()

    # follow-up (not transactional)
    notify(a, b)`,
      tieredHints: {
        apiSignature: 'with transaction.atomic(): ...',
        skeleton: 'from django.db import transaction\n\ndef ____(a, b):\n    a.____()\n    b.____()\n\n    with ____.____():\n        a.____()\n        b.____()\n\n    ____(a, b)',
      },
      explanation: 'Scoping matters because transactions hold locks. Non-DB work (logging, metrics, notifications, HTTP calls) should live OUTSIDE the atomic block. Can nest: an inner `atomic()` becomes a SAVEPOINT — its exception rolls back only the inner, preserving the outer. For cleanup that must run after commit (not during), use `transaction.on_commit(callable)` — fires when the outermost atomic block commits, perfect for triggering Celery tasks without races.',
      hints: [
        '`with transaction.atomic():` scopes a transaction',
        'Nested atomic = savepoint; inner fail leaves outer intact',
        'transaction.on_commit(fn) for post-commit callbacks (Celery, email)',
      ],
      tags: ['django', 'transactions', 'atomic', 'context-manager'],
      concepts: ['dj-transaction-atomic', 'py-context-manager-protocol'],
    },
  {
      id: 'dj-transactions-selectforupdate-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_TRANSACTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Fill in the transaction wrapper and the queryset method that row-locks the fetched account until commit.',
      template: `from django.db import transaction

with transaction.___():
    acct = Account.objects.___().get(pk=1)
    acct.balance -= 10
    acct.save()`,
      blanks: ['atomic', 'select_for_update'],
      solution: 'from django.db import transaction\n\nwith transaction.atomic():\n    acct = Account.objects.select_for_update().get(pk=1)\n    acct.balance -= 10\n    acct.save()',
      explanation: '`select_for_update()` adds `FOR UPDATE` to the SELECT, row-locking the fetched account until the surrounding transaction commits or rolls back — it must run inside `transaction.atomic()`. A concurrent caller trying to lock the same row blocks until this transaction finishes.',
      hints: ['Same wrapper used earlier for atomic blocks', 'Queryset method that locks the row'],
      tags: ['django', 'transactions', 'select_for_update', 'atomic', 'cloze'],
      concepts: ['dj-transaction-atomic'],
    },
  {
      id: 'py-dj-tx-select-for-update',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_TRANSACTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Prevent a race condition using `select_for_update` row-level locks. Import `transaction`. Define a function `reserve` taking `account_id` and `amount`. Open an atomic block using `transaction.atomic` as a context manager; inside it, fetch the `Account` row by primary key using `select_for_update` so the row is locked until commit. If the account balance is less than the requested amount, raise `ValueError("insufficient")`. Otherwise subtract the amount from the balance and save. Concurrent requests block on the lock until this transaction commits.',
      starterCode: `# Write reserve(account_id, amount): inside transaction.atomic(),
# load the Account row locked with select_for_update; if its balance
# is below amount raise ValueError("insufficient"), else subtract
# amount and save. Concurrent callers block on the lock.
`,
      testCases: [
        {
          input: 'SELECT ... FOR UPDATE',
          expectedOutput: 'Row locked for the transaction; concurrent requests wait',
          description: 'Prevents lost-update race',
        },
      ],
      solution: `from django.db import transaction
from .models import Account

def reserve(account_id, amount):
    with transaction.atomic():
        acct = Account.objects.select_for_update().get(pk=account_id)
        if acct.balance < amount:
            raise ValueError("insufficient")
        acct.balance -= amount
        acct.save()`,
      tieredHints: {
        apiSignature: 'transaction.atomic(); Account.objects.select_for_update().get(pk=id)',
        skeleton: 'from django.db import transaction\nfrom .models import Account\n\ndef ____(account_id, amount):\n    with ____.____():\n        acct = ____.____.____().get(pk=account_id)\n        if acct.____ < amount:\n            raise ____("insufficient")\n        acct.____ -= amount\n        acct.____()',
      },
      explanation: 'Without the lock, two concurrent reservations could both read balance=100, both decide they can subtract 80, both write balance=20 — overdrawing by 60. `select_for_update()` makes the SQL `SELECT ... FOR UPDATE` — row locked until the transaction ends. MUST be inside `transaction.atomic()`. For non-blocking behaviour use `select_for_update(skip_locked=True)` (worker-queue pattern) or `nowait=True` (fail fast instead of wait). Prefer `F()` expressions where possible — they sidestep the race without explicit locks.',
      hints: [
        'Must be inside atomic()',
        'Locks the row for the whole transaction',
        'skip_locked for worker queues, nowait for fail-fast',
      ],
      tags: ['django', 'transactions', 'select_for_update', 'locking'],
      concepts: ['dj-transaction-atomic'],
    },
  {
      id: 'dj-transactions-savepoint-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_TRANSACTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Fill in the nested block that lets a duplicate Tag insert fail without aborting the surrounding transaction.',
      template: `from django.db import transaction, IntegrityError

with transaction.atomic():
    try:
        with transaction.___():
            Tag.objects.create(name="python")
    except ___:
        pass`,
      blanks: ['atomic', 'IntegrityError'],
      solution: 'from django.db import transaction, IntegrityError\n\nwith transaction.atomic():\n    try:\n        with transaction.atomic():\n            Tag.objects.create(name="python")\n    except IntegrityError:\n        pass',
      explanation: 'A nested `transaction.atomic()` creates a SAVEPOINT rather than a whole new transaction. If the inner block raises, only it rolls back — the outer transaction stays healthy and can keep committing other work. Catch the exception OUTSIDE the inner `with`, not inside it.',
      hints: ['Same context manager, nested', 'The exception a duplicate unique value raises'],
      tags: ['django', 'transactions', 'savepoint', 'nested', 'cloze'],
      concepts: ['dj-transaction-atomic'],
    },
  {
      id: 'py-dj-tx-savepoint',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_TRANSACTIONS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Use a nested `atomic` block as a savepoint so you can try something and roll back JUST that attempt. Import `transaction` and `IntegrityError`. Define a function `best_effort_add` taking a `payload`. Open an outer atomic block; inside, open an inner atomic block that creates a `Tag` whose `name` comes from the payload, and wrap it in a `try` / `except IntegrityError: pass`. If the inner write fails (duplicate name), ONLY the inner rolls back; the outer continues so surrounding writes survive.',
      starterCode: `# Write best_effort_add(payload): an outer transaction.atomic() block
# with an inner atomic() savepoint that creates a Tag(name=payload),
# wrapped in try/except IntegrityError: pass. A duplicate rolls back
# ONLY the inner savepoint; the outer keeps going.
`,
      testCases: [
        {
          input: 'nested atomic as savepoint',
          expectedOutput: 'Inner failure does not abort the outer transaction',
          description: 'Inner atomic = SAVEPOINT; outer commits the rest',
        },
      ],
      solution: `from django.db import transaction, IntegrityError
from .models import Tag

def best_effort_add(payload):
    with transaction.atomic():
        # outer work that must always commit
        try:
            with transaction.atomic():
                Tag.objects.create(name=payload)
        except IntegrityError:
            pass  # only the inner savepoint rolls back`,
      tieredHints: {
        apiSignature: 'with transaction.atomic(): try: with transaction.atomic(): ... except IntegrityError:',
        skeleton: `from django.db import transaction, IntegrityError
from .models import ____

def ____(payload):
    with ____.____():
        try:
            with ____.____():
                Tag.____.____(name=____)
        except ____:
            pass`,
      },
      explanation: 'IMPORTANT gotcha: an outer `atomic()` without inner savepoints goes into a "broken" state after ANY query error — subsequent queries raise `TransactionManagementError`. Nested `atomic()` creates a SAVEPOINT the inner can roll back to, leaving the outer healthy. Use for "try and ignore if it fails" operations (idempotent inserts, best-effort upserts, eventual-consistency backfills).',
      hints: [
        'Nested atomic = SAVEPOINT',
        'Catch exceptions OUTSIDE the inner atomic — not inside',
        'Without savepoints, outer transaction breaks on any inner error',
      ],
      tags: ['django', 'transactions', 'savepoint', 'nested'],
      concepts: ['dj-transaction-atomic'],
    },
  {
      id: 'py-dj-tx-atomic-requests',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_TRANSACTIONS,
      course: Course.BACKEND,
      question: 'What does `DATABASES[...]["ATOMIC_REQUESTS"] = True` do, and what\'s the tradeoff?',
      options: [
        { id: 'a', text: 'Nothing on its own — it only takes effect once each view also opts in with `@transaction.atomic`', isCorrect: false },
        { id: 'b', text: 'Makes requests faster by batching every query in a view into a single database round-trip', isCorrect: false },
        { id: 'c', text: 'Enables Postgres-only transaction features; on MySQL and SQLite the setting is silently ignored', isCorrect: false },
        { id: 'd', text: 'Wraps every view in a transaction: an exception rolls back the request\'s DB work, but the transaction is held for the full request', isCorrect: true },
      ],
      explanation: 'The "dev-mode safety net" setting. Simplifies reasoning (any raised exception = clean rollback) but harms throughput on larger systems — every view holds a connection for its full duration, connections become scarce. Most larger projects disable it and opt-in with `@transaction.atomic` per view. Middle ground: turn on for the admin + write-heavy endpoints only by setting `ATOMIC_REQUESTS` per DB alias.',
      hints: [
        'Wraps every view in a transaction automatically',
        'Simple correctness; reduces concurrency on slow views',
        'Most large apps disable it and opt-in per-view',
      ],
      tags: ['django', 'transactions', 'ATOMIC_REQUESTS'],
      concepts: ['dj-transaction-atomic'],
    },
  {
      id: 'dj-transactions-gap-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_TRANSACTIONS,
      course: Course.BACKEND,
      question: 'What is a database transaction?\n\nImagine transferring $100 from Account A to Account B. You need to debit A and credit B. What happens if the server crashes after the debit but before the credit?',
      options: [
        {
          id: 'a',
          text: 'A logging mechanism that records every SQL query the ORM runs so failed operations can be debugged',
          isCorrect: false,
        },
        {
          id: 'b',
          text: 'A group of operations that must all succeed or all fail together; a failure rolls the database back to its pre-transaction state',
          isCorrect: true,
        },
        {
          id: 'c',
          text: 'A queue that serialises database operations, processing them one at a time so writes never conflict',
          isCorrect: false,
        },
        {
          id: 'd',
          text: 'An automatic backup mechanism that snapshots the database state before every write operation runs',
          isCorrect: false,
        },
      ],
      explanation: 'A transaction groups multiple database operations into one atomic unit. Either all operations succeed and are permanently saved (committed), or if any operation fails, all changes are undone (rolled back). The classic example is a bank transfer: debit $100 from Account A, then credit $100 to Account B. Without a transaction, a crash between operations would lose the money. With a transaction, the database guarantees both operations complete together or neither does.',
      hints: [
        'The key property is atomicity: all-or-nothing',
        'COMMIT saves the changes permanently; ROLLBACK undoes them all',
      ],
      tags: ['django', 'transactions', 'atomicity', 'database', 'basics'],
      concepts: ['dj-transaction-atomic'],
    },
  {
      id: 'dj-transactions-gap-2',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_TRANSACTIONS,
      course: Course.BACKEND,
      question: 'How does Django handle database transactions by default, and how can you control transaction boundaries?',
      options: [
        {
          id: 'a',
          text: 'Each ORM operation auto-commits by default; ATOMIC_REQUESTS=True wraps whole requests, and transaction.atomic() groups specific operations',
          isCorrect: true,
        },
        {
          id: 'b',
          text: 'Django never opens transactions itself — you must always issue BEGIN/COMMIT statements manually via raw SQL',
          isCorrect: false,
        },
        {
          id: 'c',
          text: 'Django wraps the entire application lifecycle in one transaction that commits when the server shuts down',
          isCorrect: false,
        },
        {
          id: 'd',
          text: 'Django uses optimistic locking by default — transactions are only created when a conflict is detected',
          isCorrect: false,
        },
      ],
      explanation: 'Django\'s default behavior is autocommit: each .save() or .delete() is immediately committed. This is fine for single operations but risky when multiple operations must succeed together. You have two options: (1) Set ATOMIC_REQUESTS=True in DATABASES config to wrap every HTTP request in a transaction — if the view raises an exception, all changes roll back. (2) Use transaction.atomic() to manually control scope: as a decorator (@transaction.atomic) or context manager (with transaction.atomic():) to wrap specific code blocks.',
      hints: [
        'Default Django = autocommit (each .save() is its own transaction)',
        'transaction.atomic() can be used as a decorator or a context manager (with statement)',
      ],
      tags: ['django', 'transactions', 'atomic', 'autocommit', 'atomic-requests'],
      concepts: ['dj-transaction-atomic'],
    },
];
