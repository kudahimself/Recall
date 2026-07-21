/**
 * Topic.PY_ASYNC — all question types for this topic.
 * Auto-consolidated by scripts/consolidate-by-topic.js from:
 *   pyAsyncCloze.ts (10), pyAsyncParsons.ts (10), pyAsyncPredictOutput.ts (10), pythonAdvancedQuestions.ts (8), pythonAsyncExpansionQuestions.ts (15), pythonGapFillQuestions.ts (3)
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const py_async_questions: Question[] = [
  {
      id: 'py-async-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_ASYNC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the keyword that declares a coroutine and the keyword that suspends until an awaitable completes.',
      template: `import asyncio

___ def fetch():
    ___ asyncio.sleep(1)
    return "done"`,
      blanks: ['async', 'await'],
      solution:
        'import asyncio\n\nasync def fetch():\n    await asyncio.sleep(1)\n    return "done"',
      explanation:
        '`async def` declares a coroutine — calling it returns a coroutine object instead of running the body. `await` is required inside async functions to suspend on awaitables; without await, asyncio.sleep would just create a coroutine that never runs.',
      hints: ['Two keywords: one introduces the coroutine, one yields control until the awaitable is done.'],
      tags: ['async', 'keywords'],
      concepts: ['py-async-coroutines'],
    },
  {
      id: 'py-async-cloze-2',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_ASYNC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the asyncio entrypoint that starts the event loop with main() as the top-level coroutine.',
      template: `import asyncio

async def main():
    print("hi")

asyncio.___(main())`,
      blanks: ['run'],
      solution: 'import asyncio\n\nasync def main():\n    print("hi")\n\nasyncio.run(main())',
      explanation:
        'asyncio.run starts a new event loop, schedules main() as the entrypoint, runs it to completion, and shuts down the loop. It blocks until main() returns. Use it once at the top of your program — not inside another coroutine.',
      hints: ['One word — the canonical entrypoint name.'],
      tags: ['async', 'asyncio.run'],
      concepts: ['py-async-coroutines'],
    },
  {
      id: 'py-async-cloze-3',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_ASYNC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the asyncio function that runs multiple coroutines concurrently and collects their results.',
      template: `import asyncio

async def fetch(n):
    return n

async def main():
    results = await asyncio.___(fetch(1), fetch(2), fetch(3))
    print(results)

asyncio.run(main())`,
      blanks: ['gather'],
      solution:
        'import asyncio\n\nasync def fetch(n):\n    return n\n\nasync def main():\n    results = await asyncio.gather(fetch(1), fetch(2), fetch(3))\n    print(results)\n\nasyncio.run(main())',
      explanation:
        'asyncio.gather runs awaitables concurrently and returns a single awaitable for the list of results. Results are returned in argument order. The newer 3.11+ alternative is asyncio.TaskGroup, which adds structured cancellation semantics.',
      hints: ['Six-letter verb meaning "collect concurrently".'],
      tags: ['async', 'gather', 'concurrent'],
      concepts: ['py-async-coroutines'],
    },
  {
      id: 'py-async-cloze-4',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_ASYNC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the loop construct used to iterate an async generator.',
      template: `import asyncio

async def gen():
    for i in range(3):
        yield i

async def main():
    ___ ___ n in gen():
        print(n)

asyncio.run(main())`,
      blanks: ['async', 'for'],
      solution:
        'import asyncio\n\nasync def gen():\n    for i in range(3):\n        yield i\n\nasync def main():\n    async for n in gen():\n        print(n)\n\nasyncio.run(main())',
      explanation:
        '`async for` is the iteration form that awaits each next value from an async iterator/generator. A regular `for` over an async generator raises TypeError. The async keyword goes BEFORE for, not after.',
      hints: ['Two-token construct: one keyword goes before the for.'],
      tags: ['async', 'async-for'],
      concepts: ['py-async-coroutines'],
    },
  {
      id: 'py-async-cloze-5',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_ASYNC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the construct used to enter an async context manager.',
      template: `import asyncio

async def main():
    ___ ___ asyncio.timeout(5):
        await slow_op()`,
      blanks: ['async', 'with'],
      solution:
        'import asyncio\n\nasync def main():\n    async with asyncio.timeout(5):\n        await slow_op()',
      explanation:
        '`async with` invokes __aenter__/__aexit__ — the async dunders. Plain `with` would call the sync __enter__/__exit__, which most async-native context managers don\'t implement at all.',
      hints: ['Two tokens: one keyword precedes with.'],
      tags: ['async', 'async-with'],
      concepts: ['py-async-coroutines'],
    },
  {
      id: 'py-async-cloze-6',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_ASYNC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the asyncio function that schedules a coroutine to run in the background and returns a Task.',
      template: `import asyncio

async def work():
    return 42

async def main():
    task = asyncio.___(work())
    result = await task
    print(result)

asyncio.run(main())`,
      blanks: ['create_task'],
      solution:
        'import asyncio\n\nasync def work():\n    return 42\n\nasync def main():\n    task = asyncio.create_task(work())\n    result = await task\n    print(result)\n\nasyncio.run(main())',
      explanation:
        'asyncio.create_task wraps a coroutine in a Task and schedules it on the event loop immediately. The Task starts running on the next yield point — you can await it later to get its result.',
      hints: ['Eleven-letter snake-case name: "create" then "task".'],
      tags: ['async', 'create_task'],
      concepts: ['py-async-coroutines'],
    },
  {
      id: 'py-async-cloze-7',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_ASYNC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the dunder methods that make Block an async context manager.',
      template: `class Block:
      async def ___(self):
          return self
      async def ___(self, exc_type, exc, tb):
          pass`,
      blanks: ['__aenter__', '__aexit__'],
      solution:
        'class Block:\n    async def __aenter__(self):\n        return self\n    async def __aexit__(self, exc_type, exc, tb):\n        pass',
      explanation:
        '__aenter__ and __aexit__ are the async dunders for context managers. The "a" prefix is for "async". Both must be `async def`. The sync dunders (__enter__/__exit__) are NOT used by `async with` even if defined.',
      hints: ['The "a" prefix means async. Same shape as sync versions, with that prefix.'],
      tags: ['async', 'async-context-manager', 'dunder'],
      concepts: ['py-async-coroutines', 'py-magic-methods'],
    },
  {
      id: 'py-async-cloze-8',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_ASYNC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the modern (3.11+) structured-concurrency construct that replaces gather with automatic cancellation on failure.',
      template: `import asyncio

async def work(n):
    return n

async def main():
    async with asyncio.___() as tg:
        t1 = tg.create_task(work(1))
        t2 = tg.create_task(work(2))
    print(t1.result(), t2.result())

asyncio.run(main())`,
      blanks: ['TaskGroup'],
      solution:
        'import asyncio\n\nasync def work(n):\n    return n\n\nasync def main():\n    async with asyncio.TaskGroup() as tg:\n        t1 = tg.create_task(work(1))\n        t2 = tg.create_task(work(2))\n    print(t1.result(), t2.result())\n\nasyncio.run(main())',
      explanation:
        'TaskGroup (PEP 654, Python 3.11+) provides structured concurrency: any task failure cancels siblings, and the async with block waits for all tasks to finish before exiting. It\'s the recommended replacement for gather in new code.',
      hints: ['CamelCase name: "Task" + "Group".'],
      tags: ['async', 'TaskGroup', 'structured-concurrency'],
      concepts: ['py-async-coroutines'],
    },
  {
      id: 'py-async-cloze-9',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_ASYNC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the exception type raised when a task is cancelled via task.cancel().',
      template: `import asyncio

async def long_op():
    try:
        await asyncio.sleep(60)
    except asyncio.___:
        print("cancelled")
        raise`,
      blanks: ['CancelledError'],
      solution:
        'import asyncio\n\nasync def long_op():\n    try:\n        await asyncio.sleep(60)\n    except asyncio.CancelledError:\n        print("cancelled")\n        raise',
      explanation:
        'asyncio.CancelledError is raised inside the task when its .cancel() is called — at the next await point. Best practice: catch it for cleanup, then re-raise so the cancellation propagates correctly to whoever awaits the task.',
      hints: ['CamelCase name: past tense of "cancel" + "Error".'],
      tags: ['async', 'cancellation', 'CancelledError'],
      concepts: ['py-async-coroutines'],
    },
  {
      id: 'py-async-cloze-10',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_ASYNC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the async-native primitive for producer/consumer communication.',
      template: `import asyncio

async def main():
    q = asyncio.___()
    await q.put(1)
    item = await q.get()
    print(item)

asyncio.run(main())`,
      blanks: ['Queue'],
      solution:
        'import asyncio\n\nasync def main():\n    q = asyncio.Queue()\n    await q.put(1)\n    item = await q.get()\n    print(item)\n\nasyncio.run(main())',
      explanation:
        'asyncio.Queue is the async-native FIFO queue. Both put and get are coroutines and must be awaited; they suspend if the queue is full (put) or empty (get). The threading.Queue equivalent is sync and would block the event loop.',
      hints: ['Capitalized container name; same shape as the threading version.'],
      tags: ['async', 'Queue'],
      concepts: ['py-async-coroutines'],
    },
  {
      id: 'py-async-parsons-1',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_ASYNC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Define an async function fetch() that awaits asyncio.sleep(1) and returns "done", then run it from main with asyncio.run.',
      correctOrder: [
        'import asyncio',
        '',
        'async def fetch():',
        '    await asyncio.sleep(1)',
        '    return "done"',
        '',
        'async def main():',
        '    result = await fetch()',
        '    print(result)',
        '',
        'asyncio.run(main())',
      ],
      distractorLines: [
        '    asyncio.sleep(1)',
        'def fetch():',
        'main()',
      ],
      solution:
        'import asyncio\n\nasync def fetch():\n    await asyncio.sleep(1)\n    return "done"\n\nasync def main():\n    result = await fetch()\n    print(result)\n\nasyncio.run(main())',
      explanation:
        'async def declares a coroutine; await suspends until the awaitable completes. Forgetting await on asyncio.sleep yields a never-scheduled coroutine. asyncio.run(main()) starts the event loop with main() as the entrypoint.',
      hints: ['Three required pieces: async def, await, asyncio.run.'],
      tags: ['async', 'coroutine', 'asyncio.run'],
      concepts: ['py-async-coroutines'],
    },
  {
      id: 'py-async-parsons-2',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_ASYNC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Run two fetch() coroutines concurrently with asyncio.gather and print both results.',
      correctOrder: [
        'import asyncio',
        '',
        'async def fetch(n):',
        '    await asyncio.sleep(1)',
        '    return n',
        '',
        'async def main():',
        '    results = await asyncio.gather(fetch(1), fetch(2))',
        '    print(results)',
        '',
        'asyncio.run(main())',
      ],
      distractorLines: [
        '    results = [await fetch(1), await fetch(2)]',
        '    asyncio.gather(fetch(1), fetch(2))',
      ],
      solution:
        'import asyncio\n\nasync def fetch(n):\n    await asyncio.sleep(1)\n    return n\n\nasync def main():\n    results = await asyncio.gather(fetch(1), fetch(2))\n    print(results)\n\nasyncio.run(main())',
      explanation:
        'asyncio.gather schedules coroutines concurrently and returns a future of their results. await is required on the gather call itself. Sequential awaits ([await fetch(1), await fetch(2)]) run them ONE AT A TIME — twice as slow.',
      hints: ['gather schedules concurrently; you still need to await the gather result.'],
      tags: ['async', 'gather', 'concurrent'],
      concepts: ['py-async-coroutines'],
    },
  {
      id: 'py-async-parsons-3',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_ASYNC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Build an async generator yielding 0, 1, 2 with a 0.1s pause between each, and consume it with `async for`.',
      correctOrder: [
        'import asyncio',
        '',
        'async def gen():',
        '    for i in range(3):',
        '        await asyncio.sleep(0.1)',
        '        yield i',
        '',
        'async def main():',
        '    async for n in gen():',
        '        print(n)',
        '',
        'asyncio.run(main())',
      ],
      distractorLines: [
        '    for n in gen():',
        '        return i',
      ],
      solution:
        'import asyncio\n\nasync def gen():\n    for i in range(3):\n        await asyncio.sleep(0.1)\n        yield i\n\nasync def main():\n    async for n in gen():\n        print(n)\n\nasyncio.run(main())',
      explanation:
        'An async generator is `async def` with `yield`. You consume it with `async for`, which awaits each next value. A regular `for` over an async generator raises TypeError. Replacing yield with return would just return early (and yield nothing).',
      hints: ['async def + yield = async generator. Consume with async for.'],
      tags: ['async', 'async-generator', 'async-for'],
      concepts: ['py-async-coroutines'],
    },
  {
      id: 'py-async-parsons-4',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_ASYNC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Apply a 1s timeout to a slow_op() call using asyncio.timeout (Python 3.11+). Catch TimeoutError and print "slow".',
      correctOrder: [
        'import asyncio',
        '',
        'async def main():',
        '    try:',
        '        async with asyncio.timeout(1):',
        '            await slow_op()',
        '    except TimeoutError:',
        '        print("slow")',
        '',
        'asyncio.run(main())',
      ],
      distractorLines: [
        '    with asyncio.timeout(1):',
        '    except asyncio.TimeoutError:',
      ],
      solution:
        'import asyncio\n\nasync def main():\n    try:\n        async with asyncio.timeout(1):\n            await slow_op()\n    except TimeoutError:\n        print("slow")\n\nasyncio.run(main())',
      explanation:
        'asyncio.timeout is an ASYNC context manager — must be used with `async with`, not plain `with`. On expiry it cancels the inner task and the failure surfaces as TimeoutError (the built-in, not asyncio.TimeoutError; both are aliased in 3.11+).',
      hints: ['async context managers need async with — and catch the built-in TimeoutError.'],
      tags: ['async', 'timeout', 'async-context-manager'],
      concepts: ['py-async-coroutines'],
    },
  {
      id: 'py-async-parsons-5',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_ASYNC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Schedule a coroutine as a Task that runs in the background, then await its result.',
      correctOrder: [
        'import asyncio',
        '',
        'async def work():',
        '    return 42',
        '',
        'async def main():',
        '    task = asyncio.create_task(work())',
        '    result = await task',
        '    print(result)',
        '',
        'asyncio.run(main())',
      ],
      distractorLines: [
        '    task = work()',
        '    asyncio.create_task(work)',
      ],
      solution:
        'import asyncio\n\nasync def work():\n    return 42\n\nasync def main():\n    task = asyncio.create_task(work())\n    result = await task\n    print(result)\n\nasyncio.run(main())',
      explanation:
        'create_task schedules the coroutine on the event loop immediately and returns a Task you can await later. Calling work() alone produces a coroutine object that NEVER runs unless awaited or scheduled. Passing `work` (no parens) gives a function reference, not a coroutine.',
      hints: ['create_task takes a coroutine OBJECT — call work() with parens.'],
      tags: ['async', 'tasks', 'create_task'],
      concepts: ['py-async-coroutines'],
    },
  {
      id: 'py-async-parsons-6',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_ASYNC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Use a TaskGroup (Python 3.11+) to run two coroutines concurrently with structured cancellation.',
      correctOrder: [
        'import asyncio',
        '',
        'async def work(n):',
        '    return n',
        '',
        'async def main():',
        '    async with asyncio.TaskGroup() as tg:',
        '        t1 = tg.create_task(work(1))',
        '        t2 = tg.create_task(work(2))',
        '    print(t1.result(), t2.result())',
        '',
        'asyncio.run(main())',
      ],
      distractorLines: [
        '    with asyncio.TaskGroup() as tg:',
        '        await work(1)',
      ],
      solution:
        'import asyncio\n\nasync def work(n):\n    return n\n\nasync def main():\n    async with asyncio.TaskGroup() as tg:\n        t1 = tg.create_task(work(1))\n        t2 = tg.create_task(work(2))\n    print(t1.result(), t2.result())\n\nasyncio.run(main())',
      explanation:
        'TaskGroup (3.11+) is the modern replacement for gather: structured concurrency where any failure cancels siblings, and the group blocks the `async with` until ALL tasks finish. Tasks created via tg.create_task are automatically awaited at exit.',
      hints: ['Async context manager; tasks auto-awaited at exit.'],
      tags: ['async', 'TaskGroup', 'structured-concurrency'],
      concepts: ['py-async-coroutines'],
    },
  {
      id: 'py-async-parsons-7',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_ASYNC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Race two coroutines: take whichever finishes first using asyncio.wait with FIRST_COMPLETED.',
      correctOrder: [
        'import asyncio',
        '',
        'async def slow(n):',
        '    await asyncio.sleep(n)',
        '    return n',
        '',
        'async def main():',
        '    done, pending = await asyncio.wait(',
        '        [asyncio.create_task(slow(1)), asyncio.create_task(slow(2))],',
        '        return_when=asyncio.FIRST_COMPLETED,',
        '    )',
        '    print(next(iter(done)).result())',
        '',
        'asyncio.run(main())',
      ],
      distractorLines: [
        '        return_when=asyncio.ALL_COMPLETED,',
        '    done, pending = asyncio.wait(',
      ],
      solution:
        'import asyncio\n\nasync def slow(n):\n    await asyncio.sleep(n)\n    return n\n\nasync def main():\n    done, pending = await asyncio.wait(\n        [asyncio.create_task(slow(1)), asyncio.create_task(slow(2))],\n        return_when=asyncio.FIRST_COMPLETED,\n    )\n    print(next(iter(done)).result())\n\nasyncio.run(main())',
      explanation:
        'asyncio.wait with FIRST_COMPLETED returns as soon as any task finishes. ALL_COMPLETED waits for everything (the default). The `done` set contains finished tasks; pending tasks should usually be cancelled afterward.',
      hints: ['return_when controls the gating rule. FIRST_COMPLETED for race semantics.'],
      tags: ['async', 'wait', 'race'],
      concepts: ['py-async-coroutines'],
    },
  {
      id: 'py-async-parsons-8',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_ASYNC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Build a simple async producer/consumer using asyncio.Queue. Producer puts 3 items; consumer prints them.',
      correctOrder: [
        'import asyncio',
        '',
        'async def producer(q):',
        '    for i in range(3):',
        '        await q.put(i)',
        '    await q.put(None)',
        '',
        'async def consumer(q):',
        '    while True:',
        '        item = await q.get()',
        '        if item is None:',
        '            break',
        '        print(item)',
        '',
        'async def main():',
        '    q = asyncio.Queue()',
        '    await asyncio.gather(producer(q), consumer(q))',
        '',
        'asyncio.run(main())',
      ],
      distractorLines: [
        '        q.put(i)',
        '        item = q.get()',
      ],
      solution:
        'import asyncio\n\nasync def producer(q):\n    for i in range(3):\n        await q.put(i)\n    await q.put(None)\n\nasync def consumer(q):\n    while True:\n        item = await q.get()\n        if item is None:\n            break\n        print(item)\n\nasync def main():\n    q = asyncio.Queue()\n    await asyncio.gather(producer(q), consumer(q))\n\nasyncio.run(main())',
      explanation:
        'asyncio.Queue is the async-native producer/consumer primitive. put/get are coroutines and must be awaited — sync .put/.get would either error or behave unexpectedly. The None sentinel is a common pattern for signaling end-of-stream.',
      hints: ['Queue.put and .get are coroutines — both must be awaited.'],
      tags: ['async', 'queue', 'producer-consumer'],
      concepts: ['py-async-coroutines'],
    },
  {
      id: 'py-async-parsons-9',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_ASYNC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Build an async context manager class with __aenter__ and __aexit__ that prints "in" then "out".',
      correctOrder: [
        'class Block:',
        '    async def __aenter__(self):',
        '        print("in")',
        '        return self',
        '    async def __aexit__(self, exc_type, exc, tb):',
        '        print("out")',
        '',
        'async def main():',
        '    async with Block():',
        '        pass',
      ],
      distractorLines: [
        '    def __aenter__(self):',
        '    async def __enter__(self):',
      ],
      solution:
        'class Block:\n    async def __aenter__(self):\n        print("in")\n        return self\n    async def __aexit__(self, exc_type, exc, tb):\n        print("out")\n\nasync def main():\n    async with Block():\n        pass',
      explanation:
        'An async context manager uses __aenter__ and __aexit__ — both must be `async def`. The sync versions (__enter__/__exit__) are NOT used by `async with` even if they exist. __aexit__ accepts exception info and may return True to suppress.',
      hints: ['Async dunders: __aenter__ and __aexit__. Both async def.'],
      tags: ['async', 'async-context-manager', 'dunder'],
      concepts: ['py-async-coroutines', 'py-magic-methods'],
    },
  {
      id: 'py-async-parsons-10',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_ASYNC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        '`long_op()` is a coroutine that sleeps for 60 seconds. In `main()`, launch it as a background task, then stop it before it can finish and wait for it to wind down. As it stops, the coroutine should print `cancelled`. Assemble the complete program, including starting the event loop.',
      correctOrder: [
        'import asyncio',
        '',
        'async def long_op():',
        '    try:',
        '        await asyncio.sleep(60)',
        '    except asyncio.CancelledError:',
        '        print("cancelled")',
        '        raise',
        '',
        'async def main():',
        '    task = asyncio.create_task(long_op())',
        '    await asyncio.sleep(0)',
        '    task.cancel()',
        '    try:',
        '        await task',
        '    except asyncio.CancelledError:',
        '        pass',
        '',
        'asyncio.run(main())',
      ],
      distractorLines: [
        '    except asyncio.CancelledError:',
        '        return',
        '    task.stop()',
      ],
      solution:
        'import asyncio\n\nasync def long_op():\n    try:\n        await asyncio.sleep(60)\n    except asyncio.CancelledError:\n        print("cancelled")\n        raise\n\nasync def main():\n    task = asyncio.create_task(long_op())\n    await asyncio.sleep(0)\n    task.cancel()\n    try:\n        await task\n    except asyncio.CancelledError:\n        pass\n\nasyncio.run(main())',
      explanation:
        'task.cancel() requests cancellation; CancelledError is raised inside the task at the next await. The task SHOULD re-raise CancelledError after cleanup so cancellation propagates correctly. Tasks have no .stop() method.',
      hints: ['cancel() requests; the exception is raised at the next await. Re-raise after cleanup.'],
      tags: ['async', 'cancellation', 'CancelledError'],
      concepts: ['py-async-coroutines'],
    },
  {
      id: 'py-async-predict-1',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_ASYNC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `import asyncio

async def f():
    return 42

print(type(f()).__name__)`,
      expectedOutput: `coroutine`,
      explanation:
        'Calling an async def function does NOT execute the body — it returns a coroutine object. To run it, you must await it inside another coroutine or pass it to asyncio.run.',
      hints: ['What does an async function return when called without await?'],
      tags: ['async', 'coroutine', 'lazy'],
      concepts: ['py-async-coroutines'],
    },
  {
      id: 'py-async-predict-2',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_ASYNC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `import asyncio

async def f(label):
    print(f"start {label}")
    await asyncio.sleep(0)
    print(f"end {label}")
    return label

async def main():
    results = await asyncio.gather(f("A"), f("B"))
    print(results)

asyncio.run(main())`,
      expectedOutput: `start A
start B
end A
end B
['A', 'B']`,
      explanation:
        'gather schedules both coroutines concurrently. Each prints "start" before its first await, hits the sleep, yields control, and the OTHER coroutine then runs its "start". After both have yielded, both resume in order to print "end". gather returns results in argument order regardless of completion order.',
      hints: ['Gather interleaves at await points; results return in argument order.'],
      tags: ['async', 'gather', 'interleaving'],
      concepts: ['py-async-coroutines'],
    },
  {
      id: 'py-async-predict-3',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_ASYNC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `import asyncio

async def f(label):
    print(f"start {label}")
    await asyncio.sleep(0)
    print(f"end {label}")
    return label

async def main():
    a = await f("A")
    b = await f("B")
    print(a, b)

asyncio.run(main())`,
      expectedOutput: `start A
end A
start B
end B
A B`,
      explanation:
        'Sequential awaits: each f() runs to completion before the next starts. No interleaving — A finishes entirely before B begins. This is the slowest possible pattern; if these were 1-second sleeps, total time would be 2s instead of gather\'s ~1s.',
      hints: ['Sequential await means full completion before the next call begins.'],
      tags: ['async', 'sequential', 'timing'],
      concepts: ['py-async-coroutines'],
    },
  {
      id: 'py-async-predict-4',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_ASYNC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `import asyncio

async def main():
    print("a")
    await asyncio.sleep(0)
    print("b")

asyncio.run(main())
print("c")`,
      expectedOutput: `a
b
c`,
      explanation:
        'asyncio.run blocks until main() finishes. So main() prints "a", yields to the loop briefly, prints "b", then returns. Only after run() exits does the module-level "c" print.',
      hints: ['asyncio.run is BLOCKING — it doesn\'t return until the coroutine completes.'],
      tags: ['async', 'asyncio.run', 'blocking'],
      concepts: ['py-async-coroutines'],
    },
  {
      id: 'py-async-predict-5',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_ASYNC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `import asyncio

async def main():
    task = asyncio.create_task(asyncio.sleep(0, result="done"))
    print("scheduled")
    result = await task
    print(result)

asyncio.run(main())`,
      expectedOutput: `scheduled
done`,
      explanation:
        'create_task schedules the coroutine but doesn\'t run it inline. "scheduled" prints first (the task hasn\'t had a chance to run yet). Then `await task` yields control, the task completes (sleep with result returns "done"), and we print it.',
      hints: ['create_task schedules but doesn\'t block; the task only runs at the next await point.'],
      tags: ['async', 'create_task', 'scheduling'],
      concepts: ['py-async-coroutines'],
    },
  {
      id: 'py-async-predict-6',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_ASYNC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `import asyncio

async def f():
    return 1

async def main():
    coro = f()
    result = await coro
    print(result)
    again = await coro

asyncio.run(main())`,
      expectedOutput: `1`,
      explanation:
        'A coroutine can only be awaited ONCE. The first `await coro` runs it and yields 1, which is printed. The second `await coro` raises RuntimeError: cannot reuse already awaited coroutine — so execution stops before any further print. Only "1" appears in the captured output.',
      hints: ['Coroutines are single-use; what happens on the second await?'],
      tags: ['async', 'coroutine', 'reuse-error'],
      concepts: ['py-async-coroutines'],
    },
  {
      id: 'py-async-predict-7',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_ASYNC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `import asyncio

async def gen():
    for i in range(3):
        yield i

async def main():
    async for n in gen():
        print(n)

asyncio.run(main())`,
      expectedOutput: `0
1
2`,
      explanation:
        'An async generator is async def with yield. async for awaits each next value. Without async for (using plain for), this would raise TypeError: async generators don\'t support sync iteration.',
      hints: ['async for over an async generator yields values one by one.'],
      tags: ['async', 'async-generator', 'async-for'],
      concepts: ['py-async-coroutines'],
    },
  {
      id: 'py-async-predict-8',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_ASYNC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `import asyncio

async def f(n):
    await asyncio.sleep(n)
    return n

async def main():
    results = await asyncio.gather(f(0.3), f(0.1), f(0.2))
    print(results)

asyncio.run(main())`,
      expectedOutput: `[0.3, 0.1, 0.2]`,
      explanation:
        'gather preserves ARGUMENT ORDER in its results — not completion order. Even though f(0.1) finishes first physically, the result list is in the order the coroutines were passed to gather.',
      hints: ['gather results follow argument order, not completion order.'],
      tags: ['async', 'gather', 'order'],
      concepts: ['py-async-coroutines'],
    },
  {
      id: 'py-async-predict-9',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_ASYNC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `import asyncio

async def f():
    raise ValueError("boom")

async def main():
    try:
        await f()
    except ValueError as e:
        print(f"caught: {e}")

asyncio.run(main())`,
      expectedOutput: `caught: boom`,
      explanation:
        'Exceptions raised inside a coroutine propagate through await like any normal call. A regular try/except around the await catches them. Awaitables don\'t change Python\'s exception semantics — async or not, raise propagates.',
      hints: ['Exception propagation through await behaves like normal calls.'],
      tags: ['async', 'exceptions'],
      concepts: ['py-async-coroutines', 'py-exception-hierarchy'],
    },
  {
      id: 'py-async-predict-10',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_ASYNC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `import asyncio

async def main():
    print("a")
    asyncio.sleep(0)
    print("b")

asyncio.run(main())`,
      expectedOutput: `a
b`,
      explanation:
        'asyncio.sleep(0) is CALLED but never AWAITED. The result is a coroutine object that\'s immediately discarded — it never runs. The code prints "a" and "b" with no actual sleep, and you typically also see a "RuntimeWarning: coroutine was never awaited" at runtime (not part of stdout). The classic missing-await bug.',
      hints: ['Calling a coroutine without await — what happens?'],
      tags: ['async', 'missing-await', 'common-mistake'],
      concepts: ['py-async-coroutines'],
    },
  {
      id: 'py-adv-async-bridge-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_ASYNC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Define a coroutine `fetch_value` taking an integer `n`. It briefly yields to the event loop (a short async sleep), then returns `n * 2`. Define a coroutine `main` that runs `fetch_value` CONCURRENTLY for the inputs 1, 2, and 3 using the `asyncio` helper that awaits many coroutines at once, collects the ordered list of results, and prints it. Run `main` from sync code. Expected output: `[2, 4, 6]`.',
      starterCode: `import asyncio
  `,
      testCases: [
        {
          input: 'asyncio.gather on three fetch_value coroutines',
          expectedOutput: '[2, 4, 6]',
          description: 'Should collect results from concurrent coroutines',
        },
      ],
      solution: `import asyncio

async def fetch_value(n):
    await asyncio.sleep(0.01)
    return n * 2

async def main():
    results = await asyncio.gather(fetch_value(1), fetch_value(2), fetch_value(3))
    print(results)

asyncio.run(main())`,
      tieredHints: {
        apiSignature: 'asyncio.gather(*aws, return_exceptions=False) -> list',
        skeleton: `import asyncio

async def ____(n):
    await asyncio.____(____)
    return n ____ ____

async def main():
    results = await asyncio.____(____(1), ____(2), ____(3))
    print(results)

____.____(main())`,
      },
      explanation: '`asyncio.gather(*coros)` schedules the coroutines concurrently and waits for all of them. It returns a list of results in the same order as the inputs — order-preserving even though they may finish out of order. This is the building block for concurrent work: you can replace the sleep with any I/O call and the mechanism is identical.',
      hints: [
        'gather(*coros) awaits many coroutines at once',
        'Results come back in input order regardless of completion order',
        'Entry point: asyncio.run(main()) — you cannot gather from sync code directly',
      ],
      tags: ['async', 'asyncio', 'gather', 'intermediate'],
      concepts: ['py-async-coroutines', 'py-event-loop'],
    },
  {
      id: 'py-adv-async-bridge-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_ASYNC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Define a coroutine `slow_task` that takes a `name` string and a `seconds` duration, sleeps for that many seconds (async sleep), and returns `"<name> done"`. Write two runners: `run_sequential` must await three calls — `("A", 1)`, `("B", 1)`, `("C", 1)` — ONE AFTER THE OTHER (total ~3s); `run_concurrent` must run the same three calls CONCURRENTLY (total ~1s). In `main`, time each runner with `time.perf_counter` and print two lines: `"sequential: 3.0s"` and `"concurrent: 1.0s"` (rounded to one decimal). Run from sync code.',
      starterCode: `import asyncio
import time
`,
      testCases: [
        {
          input: 'three 1-second tasks, sequential then concurrent',
          expectedOutput: 'sequential: 3.0s\nconcurrent: 1.0s',
          description: 'gather should run concurrently, sequential should not',
        },
      ],
      solution: `import asyncio
import time

async def slow_task(name, seconds):
    await asyncio.sleep(seconds)
    return f"{name} done"

async def run_sequential():
    results = []
    for n in ("A", "B", "C"):
        results.append(await slow_task(n, 1))
    return results

async def run_concurrent():
    return await asyncio.gather(slow_task("A", 1), slow_task("B", 1), slow_task("C", 1))

async def main():
    t0 = time.perf_counter()
    await run_sequential()
    seq = time.perf_counter() - t0

    t0 = time.perf_counter()
    await run_concurrent()
    con = time.perf_counter() - t0

    print(f"sequential: {seq:.1f}s")
    print(f"concurrent: {con:.1f}s")

asyncio.run(main())`,
      tieredHints: {
        apiSignature: 'asyncio.gather(*aws, return_exceptions=False) -> list',
        skeleton: `import asyncio
import time

async def slow_task(name, seconds):
    await asyncio.sleep(seconds)
    return f"{name} ____"

async def run_sequential():
    results = []
    for n in ("A", "B", "C"):
        results.append(____ slow_task(n, ____))
    return results

async def run_concurrent():
    return ____ asyncio.____(____("A", ____), ____("B", ____), ____("C", ____))

async def main():
    t0 = time.____()
    await run_sequential()
    seq = time.____() - t0

    t0 = time.____()
    await run_concurrent()
    con = time.____() - t0

    print(f"sequential: {seq:____}s")
    print(f"concurrent: {con:____}s")

____.____(main())`,
      },
      explanation: 'This makes the concurrency benefit visible: 3×1s sequentially is ~3s wall-clock, but 3 tasks sleeping 1s in parallel is ~1s wall-clock. `await x; await y` runs x fully before y starts. `await asyncio.gather(x, y)` lets both tasks make progress during I/O waits, so total time is the maximum, not the sum. Any time you have independent I/O-bound work, gather it.',
      hints: [
        'Sequential = await one, then await the next',
        'Concurrent = asyncio.gather(...) them all at once',
        'time.perf_counter() gives wall-clock seconds as a float',
      ],
      tags: ['async', 'asyncio', 'gather', 'timing', 'intermediate'],
      concepts: ['py-async-coroutines', 'py-event-loop'],
    },
  {
      id: 'py-adv-async-bridge-3',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_ASYNC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Define a coroutine `background_work` (no parameters) that sleeps 50 ms (async sleep) then returns `"background-done"`. In `main`, schedule that coroutine using the `asyncio` helper that starts it immediately without blocking and returns a task handle — bind the handle to `task`. Then sleep 10 ms (async), print `"doing other work"`, and only THEN await the task and print its result. The two prints must occur in this order. Run from sync code. Expected output: `doing other work` then `background-done` on two lines.',
      starterCode: `import asyncio
  `,
      testCases: [
        {
          input: 'create_task then other work then await',
          expectedOutput: 'doing other work\nbackground-done',
          description: 'Other work should run before the awaited task result',
        },
      ],
      solution: `import asyncio

async def background_work():
    await asyncio.sleep(0.05)
    return "background-done"

async def main():
    task = asyncio.create_task(background_work())

    await asyncio.sleep(0.01)
    print("doing other work")

    result = await task
    print(result)

asyncio.run(main())`,
      tieredHints: {
        apiSignature: 'asyncio.create_task(coro, *, name=None) -> Task',
        skeleton: `import asyncio

async def ____():
    await asyncio.sleep(____)
    return "background-done"

async def main():
    task = asyncio.____(____())

    await asyncio.sleep(____)
    print("doing other work")

    result = ____ task
    print(result)

____.____(main())`,
      },
      explanation: '`asyncio.create_task(coro)` schedules a coroutine to run on the event loop immediately and returns a `Task` handle. Unlike plain `await coro`, it does NOT block — execution continues after the `create_task` call. You can do other work while the task runs, then `await task` later to collect its result. This is the primitive for "fire and forget" patterns and for structured concurrency. `gather` is built on top of it.',
      hints: [
        'create_task starts the coroutine immediately and returns a Task',
        'Execution continues — it does not await',
        'await task retrieves the result (or raises the exception) whenever you need it',
      ],
      tags: ['async', 'asyncio', 'create_task', 'background', 'intermediate'],
      concepts: ['py-async-coroutines', 'py-event-loop'],
    },
  {
      id: 'py-adv-async-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_ASYNC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write a coroutine `fetch_all` that takes a list of URL strings and returns a list of response bodies in the same order as the input. Use `aiohttp` to fetch each URL CONCURRENTLY. The requests must share a SINGLE HTTP session so connection pooling works — do NOT open a new session per URL. Use any internal helpers you want; the only public entry point is `fetch_all`. The function is awaited from an async context; you do not need to handle `asyncio.run` here.',
      starterCode: `import asyncio
import aiohttp

# async def fetch_all(urls: list[str]) -> list[str]
`,
      testCases: [
        {
          input: '["https://example.com/1", "https://example.com/2"]',
          expectedOutput: 'Uses asyncio.gather to fetch concurrently, returns list of texts',
          description: 'Should fetch multiple URLs concurrently with gather',
        },
      ],
      solution: `import asyncio
import aiohttp

async def fetch_url(session: aiohttp.ClientSession, url: str) -> str:
    """Fetch a single URL and return its text content."""
    async with session.get(url) as response:
        return await response.text()

async def fetch_all(urls: list[str]) -> list[str]:
    """Fetch all URLs concurrently and return results in order."""
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_url(session, url) for url in urls]
        results = await asyncio.gather(*tasks)
        return list(results)
`,
      tieredHints: {
        apiSignature: 'asyncio.gather(*aws, return_exceptions=False) -> list',
        skeleton: `import asyncio
import aiohttp

async def ____(session: aiohttp.____, url: ____) -> ____:
    async with session.____(url) as response:
        return await response.____()

async def fetch_all(urls: list[____]) -> list[____]:
    async with aiohttp.____() as session:
        tasks = [____(session, url) for url in urls]
        results = await asyncio.____(*tasks)
        return ____(results)`,
      },
      explanation: 'asyncio.gather runs multiple coroutines concurrently and returns results in the same order they were passed in. This is far faster than awaiting each URL sequentially because network I/O is the bottleneck — while one request waits for a response, others can proceed. The `async with` on both the session and response ensures proper resource cleanup.',
      hints: [
        'Create an aiohttp.ClientSession with async with',
        'Use a list comprehension to build coroutine tasks',
        'asyncio.gather(*tasks) runs them all concurrently',
      ],
      tags: ['async', 'asyncio', 'aiohttp', 'gather', 'concurrency'],
      concepts: ['py-async-coroutines', 'py-event-loop'],
    },
  {
      id: 'py-adv-async-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_ASYNC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write a coroutine `fetch_with_timeout(url, timeout)` that runs the pre-defined coroutine `fetch_data(url)` (which returns a string) with a timeout using `asyncio.wait_for`. If the operation exceeds `timeout` seconds, catch the timeout exception and raise a `TimeoutError("Request timed out")`. Otherwise, return the fetched string.',
      starterCode: `import asyncio

# fetch_data(url) is a pre-defined coroutine returning a string.
`,
      testCases: [
        {
          input: 'fetch_with_timeout("http://example.com", 1.0)',
          expectedOutput: 'data from http://example.com',
          description: 'Should fetch successfully within timeout',
        },
      ],
      solution: `import asyncio

async def fetch_with_timeout(url: str, timeout: float) -> str:
    try:
        return await asyncio.wait_for(fetch_data(url), timeout=timeout)
    except asyncio.TimeoutError:
        raise TimeoutError("Request timed out")`,
      tieredHints: {
        apiSignature: 'asyncio.wait_for(aw, timeout) -> Any',
        skeleton: `import asyncio

async def fetch_with_timeout(url: ____, timeout: ____) -> ____:
    try:
        return await asyncio.____(fetch_data(url), ____=timeout)
    except asyncio.____:
        raise ____("Request timed out")`,
      },
      explanation: 'asyncio.wait_for wraps a coroutine with a timeout, raising asyncio.TimeoutError if it exceeds the limit. We catch it and raise a custom TimeoutError with the required message.',
      hints: [
        'Use `await asyncio.wait_for(fetch_data(url), timeout=timeout)`',
        'Catch `asyncio.TimeoutError` and raise `TimeoutError("Request timed out")`',
      ],
      tags: ['async', 'wait_for', 'timeout'],
      concepts: ['py-async-coroutines'],
    },
  {
      id: 'py-adv-async-3',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_ASYNC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write an async context manager class `AsyncDatabasePool` that simulates a connection pool. On `__aenter__`, it should "connect" (print a message and sleep briefly), store the connection, and return self. On `__aexit__`, it should "disconnect" (print and sleep). Include an async method `execute(query: str)` that returns a simulated result.',
      starterCode: `import asyncio

class AsyncDatabasePool:
    ...
`,
      testCases: [
        {
          input: 'async with AsyncDatabasePool("postgres://localhost/db") as pool',
          expectedOutput: 'Connects on enter, disconnects on exit, execute returns result dict',
          description: 'Should implement async context manager protocol',
        },
      ],
      solution: `import asyncio

class AsyncDatabasePool:
    def __init__(self, db_url: str, pool_size: int = 5):
        self.db_url = db_url
        self.pool_size = pool_size
        self.connected = False

    async def __aenter__(self):
        print(f"Connecting to {self.db_url} (pool_size={self.pool_size})...")
        await asyncio.sleep(0.1)  # Simulate connection time
        self.connected = True
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        print(f"Disconnecting from {self.db_url}...")
        await asyncio.sleep(0.05)  # Simulate cleanup
        self.connected = False
        return False  # Don't suppress exceptions

    async def execute(self, query: str) -> dict:
        if not self.connected:
            raise RuntimeError("Not connected to database")
        await asyncio.sleep(0.01)  # Simulate query time
        return {"query": query, "rows": [], "status": "ok"}
`,
      tieredHints: {
        apiSignature: 'asyncio.sleep(delay, result=None) -> None',
        skeleton: `import asyncio

class AsyncDatabasePool:
    def __init__(self, db_url: ____, pool_size: ____ = ____):
        self.db_url = ____
        self.pool_size = ____
        self.____ = False

    async def __aenter__(self):
        print(f"Connecting to {____} (pool_size={____})...")
        await asyncio.____(____)
        self.____ = ____
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        print(f"Disconnecting from {____}...")
        await asyncio.____(____)
        self.____ = False
        return ____

    async def execute(self, query: ____) -> ____:
        if not self.____:
            raise ____("Not connected to database")
        await asyncio.____(____)
        return {"query": ____, "rows": [], "status": "ok"}`,
      },
      explanation: 'Async context managers use __aenter__ and __aexit__ instead of __enter__ and __exit__. They are essential for async resources like database connections, HTTP sessions, and file handles that need async setup/teardown. The "async with" syntax guarantees __aexit__ runs even if an exception occurs inside the block — just like regular context managers but supporting await. Returning False from __aexit__ means exceptions propagate normally.',
      hints: [
        '__aenter__ must return self (or the managed resource)',
        '__aexit__ receives exception info, return False to not suppress errors',
        'Both methods are async — they can use await',
      ],
      tags: ['async', 'context-manager', 'async-context-manager', 'aenter', 'aexit', '__aenter__', '__aexit__', 'protocol'],
      concepts: ['py-async-coroutines', 'py-context-manager-protocol'],
    },
  {
      id: 'py-adv-async-4',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_ASYNC,
      course: Course.BACKEND,
      question: 'What is the role of the event loop in Python\'s asyncio, and what happens if you call `await asyncio.sleep(1)` inside a regular (non-async) function?',
      options: [
        { id: 'a', text: 'The event loop schedules and switches between coroutines on a single thread; calling await in a regular function raises a SyntaxError because await is only valid inside async def', isCorrect: true },
        { id: 'b', text: 'The event loop runs all async tasks on separate OS threads; calling await in a regular function creates a new thread automatically', isCorrect: false },
        { id: 'c', text: 'The event loop creates a new process for each coroutine; await blocks the entire program until sleep completes', isCorrect: false },
        { id: 'd', text: 'The event loop is only used for network I/O; await in a regular function simply pauses execution for 1 second like time.sleep()', isCorrect: false },
      ],
      explanation: 'The asyncio event loop runs on a single thread and cooperatively switches between coroutines at await points. This is fundamentally different from threading (OS-scheduled, multiple threads) and multiprocessing (multiple processes). The `await` keyword is syntactically restricted to async def functions — using it in a regular function is a SyntaxError, not a runtime error. This is why asyncio is best for I/O-bound tasks: while one coroutine waits for I/O, the event loop runs others.',
      hints: [
        'asyncio is single-threaded and cooperative',
        'await is a syntax-level keyword, not just a function',
      ],
      tags: ['async', 'event-loop', 'concurrency-model'],
      concepts: ['py-async-coroutines', 'py-event-loop'],
    },
  {
      id: 'py-adv-async-5',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_ASYNC,
      course: Course.BACKEND,
      question: 'When should you use asyncio vs threading vs multiprocessing in Python?',
      options: [
        { id: 'a', text: 'asyncio for CPU-bound work, threading for I/O-bound work, multiprocessing for GUI applications', isCorrect: false },
        { id: 'b', text: 'asyncio for I/O-bound work with many concurrent connections, threading for I/O-bound work with blocking libraries, multiprocessing for CPU-bound work that needs true parallelism', isCorrect: true },
        { id: 'c', text: 'They are interchangeable — all three achieve the same performance for any workload', isCorrect: false },
        { id: 'd', text: 'asyncio for small programs, threading for medium programs, multiprocessing for large programs', isCorrect: false },
      ],
      explanation: 'asyncio excels at I/O-bound tasks with many concurrent operations (web servers, API calls) because coroutines are lightweight and switching is fast. Threading works for I/O-bound tasks when libraries don\'t support async (e.g., some database drivers). Multiprocessing bypasses the GIL for true CPU parallelism (data processing, image rendering). The GIL (Global Interpreter Lock) prevents threads from running Python bytecode in parallel, which is why threading doesn\'t help CPU-bound work but multiprocessing does.',
      hints: [
        'The GIL limits threading for CPU work',
        'asyncio coroutines are cheaper than OS threads',
      ],
      tags: ['async', 'threading', 'multiprocessing', 'GIL', 'concurrency'],
      concepts: ['py-async-coroutines', 'py-thread-vs-process', 'py-gil-implication'],
    },
  {
      id: 'py-async-beg-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_ASYNC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Define the simplest possible coroutine `greet` (no parameters) that returns the string `"hi"` — use the keyword that turns a `def` into an async function. Then run it from sync code using the `asyncio` entry-point function that executes a coroutine and returns its result. Bind the returned value to `result` and print it (expect `hi`).',
      starterCode: `import asyncio
  `,
      testCases: [
        {
          input: 'asyncio.run(greet())',
          expectedOutput: 'hi',
          description: 'Simplest coroutine — no await, no sleep',
        },
      ],
      solution: `import asyncio

async def greet() -> str:
    return "hi"

result = asyncio.run(greet())
print(result)`,
      tieredHints: {
        apiSignature: 'asyncio.run(coro, *, debug=None) -> Any',
        skeleton: `import asyncio

____ def ____() -> ____:
    return "hi"

result = asyncio.____(____())
____(result)`,
      },
      explanation:
        'This is the minimum viable async: the keyword `async` in front of `def` makes this a COROUTINE, not a regular function. Calling `greet()` returns a coroutine object; you cannot read its return value directly — you either `await` it inside another async function, or pass it to `asyncio.run()` from sync code. No I/O yet — that comes next.',
      hints: [
        '`async def` defines a coroutine',
        'Call returns a coroutine object, not the value',
        '`asyncio.run(coro)` executes it and returns the result',
      ],
      tags: ['async', 'asyncio', 'coroutine', 'basics'],
      concepts: ['py-async-coroutines', 'py-event-loop'],
    },
  {
      id: 'py-async-beg-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_ASYNC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Define a coroutine `step` that takes a `name` string, briefly yields to the event loop (a 10 ms async sleep), then returns `"done: "` followed by the name. In a second coroutine `main`, await `step("one")` and assign it to `first`, then await `step("two")` and assign it to `second` — sequentially, one after the other — and print each on its own line. Run `main` from sync code. Expected output on two lines: `done: one` then `done: two`.',
      starterCode: `import asyncio
  `,
      testCases: [
        {
          input: 'two sequential awaits',
          expectedOutput: 'done: one\ndone: two',
          description: 'Sequential awaits run one after the other',
        },
      ],
      solution: `import asyncio

async def step(name: str) -> str:
    await asyncio.sleep(0.01)
    return f"done: {name}"

async def main():
    first = await step("one")
    second = await step("two")
    print(first)
    print(second)

asyncio.run(main())`,
      tieredHints: {
        apiSignature: 'asyncio.sleep(delay, result=None) -> None',
        skeleton: `import asyncio

async def ____(name: ____) -> ____:
    await asyncio.sleep(____)
    return f"done: {____}"

async def main():
    first = ____ ____("one")
    second = ____ ____("two")
    ____(first)
    ____(second)

____.____(main())`,
      },
      explanation:
        'Two `await` calls in a row run one AFTER the other — just like sync code. Total wall time ≈ sum of both sleeps. Use this pattern when the second call depends on the first. When the two calls are INDEPENDENT you want concurrent execution instead — which is where `asyncio.gather` (next questions) comes in.',
      hints: [
        '`await` pauses the coroutine until the awaited coroutine finishes',
        'Two sequential awaits = one-after-the-other, not concurrent',
        'Use this when the second call depends on the first',
      ],
      tags: ['async', 'await', 'sequential', 'basics'],
      concepts: ['py-async-coroutines'],
    },
  {
      id: 'py-async-int-gen-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_ASYNC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Write an ASYNC GENERATOR `numbers_up_to` that takes an integer `n`, loops `0..n-1`, yields to the event loop (a 10 ms async sleep) each iteration, and yields the current integer. In `main`, consume the async generator with the async form of `for` (plain `for` is a TypeError on async generators) and print each value. Run `main` from sync code with `n=3`. Expected output: `0`, `1`, `2` on three separate lines.',
      starterCode: `import asyncio
  `,
      testCases: [
        {
          input: 'async generator with async for',
          expectedOutput: '0\n1\n2',
          description: 'async def + yield = async generator',
        },
      ],
      solution: `import asyncio

async def numbers_up_to(n):
    for i in range(n):
        await asyncio.sleep(0.01)
        yield i

async def main():
    async for v in numbers_up_to(3):
        print(v)

asyncio.run(main())`,
      tieredHints: {
        apiSignature: 'asyncio.sleep(delay, result=None) -> None',
        skeleton: `import asyncio

async def ____(n):
    for i in range(n):
        await asyncio.____(____)
        ____ i

async def main():
    ____ for v in ____(3):
        print(v)

____.____(main())`,
      },
      explanation:
        'Any `async def` that contains `yield` is an async generator — you consume it with `async for`, not plain `for`. Use when values become available over time: streaming rows from a DB cursor, chunks from an HTTP body, messages from a queue. The generator pauses on each `await` so other tasks can run. For throwaway transforms, `async for x in src: ... yield f(x)` chains cleanly.',
      hints: [
        '`async def` + `yield` = async generator',
        'Consume with `async for`, not plain `for`',
        'The generator pauses on every await, letting other tasks progress',
      ],
      tags: ['async', 'async-generator', 'yield', 'async-for'],
      concepts: ['py-async-coroutines', 'py-generator-yield'],
    },
  {
      id: 'py-async-int-queue-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_ASYNC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Build an async producer/consumer using the `asyncio` FIFO queue class. Define a `producer(q)` coroutine that puts the integers `1`, `2`, `3` onto the queue in order, then puts `None` as an end-of-stream sentinel. Define a `consumer(q)` coroutine that loops forever pulling items off the queue: break out of the loop when it gets `None`, otherwise print the item. In `main`, create the queue and run both producer and consumer CONCURRENTLY on the same event loop using the `asyncio` helper that awaits multiple coroutines at once. Run from sync code. Expected printed output: `1`, `2`, `3` on separate lines.',
      starterCode: `import asyncio
  `,
      testCases: [
        {
          input: 'async producer/consumer via asyncio.Queue',
          expectedOutput: '1\n2\n3',
          description: 'Queue.put / Queue.get are coroutine methods',
        },
      ],
      solution: `import asyncio

async def producer(q):
    for n in (1, 2, 3):
        await q.put(n)
    await q.put(None)

async def consumer(q):
    while True:
        item = await q.get()
        if item is None:
            break
        print(item)

async def main():
    q = asyncio.Queue()
    await asyncio.gather(producer(q), consumer(q))

asyncio.run(main())`,
      tieredHints: {
        apiSignature: 'asyncio.Queue(maxsize=0) -> Queue',
        skeleton: `import asyncio

async def ____(q):
    for n in (1, 2, 3):
        await q.____(n)
    await q.put(____)

async def ____(q):
    while True:
        item = await q.____()
        if item is ____:
            break
        print(item)

async def main():
    q = asyncio.____()
    await asyncio.____(____(q), ____(q))

____.____(main())`,
      },
      explanation:
        '`asyncio.Queue` is the async equivalent of `queue.Queue`: `put` / `get` are coroutines that suspend when the queue is full or empty. Pair with `gather` to run producer and consumer concurrently on the same event loop. For bounded back-pressure, pass `asyncio.Queue(maxsize=N)` so `put` awaits when N items are queued. `task_done()` + `join()` gives you "wait for every item to be processed" semantics.',
      hints: [
        'await q.put(item); await q.get()',
        'None sentinel is the canonical "end of stream" signal',
        'asyncio.Queue(maxsize=N) gives back-pressure',
      ],
      tags: ['async', 'asyncio', 'Queue', 'producer-consumer'],
      concepts: ['py-async-coroutines', 'py-event-loop'],
    },
  {
      id: 'py-async-int-gather-errors',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_ASYNC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Define a coroutine `risky` taking an integer `n`. It briefly yields to the event loop, then returns `n * 2` if `n` is even, else raises `ValueError` whose message is the text `bad ` followed by the value of `n` (use an f-string). In `main`, run the coroutine concurrently for inputs 1, 2, and 3. By default one failure would cancel the siblings — instead, use the `gather` kwarg that causes exceptions to appear AS ITEMS in the result list rather than propagating. Iterate the result list: for each item, print `"err"` if it is an `Exception` instance, otherwise print the value. Run `main` from sync code. Expected output on three lines: `err`, `4`, `err`.',
      starterCode: `import asyncio
  `,
      testCases: [
        {
          input: 'gather with return_exceptions=True',
          expectedOutput: 'err\n4\nerr',
          description: 'Exceptions appear in the result list instead of propagating',
        },
      ],
      solution: `import asyncio

async def risky(n):
    await asyncio.sleep(0.01)
    if n % 2 == 0:
        return n * 2
    raise ValueError(f"bad {n}")

async def main():
    results = await asyncio.gather(risky(1), risky(2), risky(3), return_exceptions=True)
    for item in results:
        if isinstance(item, Exception):
            print("err")
        else:
            print(item)

asyncio.run(main())`,
      tieredHints: {
        apiSignature: 'asyncio.gather(*aws, return_exceptions=False) -> list',
        skeleton: `import asyncio

async def ____(n):
    await asyncio.sleep(____)
    if n % 2 == ____:
        return n * ____
    raise ____(f"bad {n}")

async def main():
    results = await asyncio.____(____(1), ____(2), ____(3), ____=True)
    for item in results:
        if isinstance(item, ____):
            print("err")
        else:
            print(item)

____.____(main())`,
      },
      explanation:
        'By default, `gather` re-raises the first exception and cancels the other tasks. With `return_exceptions=True`, failures show up as items in the result list — you decide per-task whether to log, retry, or skip. Essential for batch operations where partial success is acceptable (fetching N URLs, processing N files). Combine with `isinstance(item, Exception)` to separate winners from losers.',
      hints: [
        'return_exceptions=True makes gather never raise — exceptions arrive in the list',
        'Check `isinstance(item, Exception)` to separate failures',
        'Without the flag, first failure cancels remaining tasks',
      ],
      tags: ['async', 'gather', 'return_exceptions', 'error-handling'],
      concepts: ['py-async-coroutines', 'py-exception-hierarchy'],
    },
  {
      id: 'py-async-int-semaphore',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_ASYNC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Cap concurrency so that no more than 3 of 6 tasks run simultaneously (e.g. to respect an API rate limit). Use the `asyncio` synchronisation primitive that allows up to N holders at once, acquired/released via `async with`. Define a coroutine `limited(n, sem)` that acquires the primitive around a brief async sleep, then returns `n`. In `main`, create one shared primitive with capacity 3, launch six `limited(i, sem)` coroutines for `i in range(6)` concurrently with `gather`, and print the returned list. Run from sync code. Expected printed list: `[0, 1, 2, 3, 4, 5]` — order preserved, but at most 3 ever ran simultaneously.',
      starterCode: `import asyncio
  `,
      testCases: [
        {
          input: 'Semaphore(3) capping 6 tasks',
          expectedOutput: '[0, 1, 2, 3, 4, 5]',
          description: 'async with sem: acquires and releases automatically',
        },
      ],
      solution: `import asyncio

async def limited(n, sem):
    async with sem:
        await asyncio.sleep(0.01)
        return n

async def main():
    sem = asyncio.Semaphore(3)
    tasks = [limited(i, sem) for i in range(6)]
    results = await asyncio.gather(*tasks)
    print(results)

asyncio.run(main())`,
      tieredHints: {
        apiSignature: 'asyncio.Semaphore(value=1)',
        skeleton: `import asyncio

async def ____(n, sem):
    async with ____:
        await asyncio.sleep(____)
        return n

async def main():
    sem = asyncio.____(____)
    tasks = [____(i, sem) for i in range(____)]
    results = await asyncio.____(____tasks)
    print(results)

____.____(main())`,
      },
      explanation:
        '`asyncio.Semaphore(n)` permits at most N coroutines inside its context at a time — the rest queue up. `async with sem:` is the idiomatic acquire/release wrapper. Use for rate limiting API clients, bounded parallelism over a CPU-heavy op, or capping DB connections. Pattern: one shared semaphore + launch all tasks up-front; each one waits its turn. More flexible than a fixed-size worker pool.',
      hints: [
        '`asyncio.Semaphore(n)` + `async with sem:` caps concurrent entry to n',
        'Launch all tasks with gather; the semaphore serialises them naturally',
        'Use for rate limits, bounded fan-out, connection pools',
      ],
      tags: ['async', 'asyncio', 'Semaphore', 'rate-limit', 'concurrency'],
      concepts: ['py-async-coroutines', 'py-event-loop'],
    },
  {
      id: 'py-async-int-asyncwith',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_ASYNC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Build a simple async context manager class `AsyncSession` by implementing the two async dunder methods that make `async with` work — the entry hook must print `"open"` and return `self`, and the exit hook must print `"close"`. Both hooks are coroutines (so setup/teardown can themselves await). In `main`, consume the class with `async with AsyncSession() as s:` and print `"work"` inside the block. Run from sync code. Expected output on three lines: `open`, `work`, `close`.',
      starterCode: `import asyncio
  `,
      testCases: [
        {
          input: 'async with AsyncSession()',
          expectedOutput: 'open\nwork\nclose',
          description: '__aenter__ and __aexit__ bracket the block',
        },
      ],
      solution: `import asyncio

class AsyncSession:
    async def __aenter__(self):
        print("open")
        return self

    async def __aexit__(self, exc_type, exc, tb):
        print("close")

async def main():
    async with AsyncSession() as s:
        print("work")

asyncio.run(main())`,
      tieredHints: {
        apiSignature: 'asyncio.run(coro, *, debug=None) -> Any',
        skeleton: `import asyncio

class ____:
    async def ____(self):
        print("open")
        return self

    async def ____(self, exc_type, exc, tb):
        print("close")

async def main():
    async with ____() as s:
        print("work")

____.____(main())`,
      },
      explanation:
        'Async context managers use `__aenter__` / `__aexit__` instead of `__enter__` / `__exit__` so setup and teardown can themselves be async (e.g. await a DB connection, await a file open, await acquiring a distributed lock). Consumed with `async with`. Third-party libraries (`aiohttp.ClientSession`, `asyncpg.Pool`, `aiofiles.open`) all return objects that work this way.',
      hints: [
        '__aenter__ / __aexit__ are coroutines (async def)',
        'Use `async with` to consume — plain `with` is a TypeError',
        'Return self from __aenter__ for the `as` binding',
      ],
      tags: ['async', 'async-with', 'context-manager', 'aenter', 'aexit'],
      concepts: ['py-async-coroutines', 'py-context-manager-protocol'],
    },
  {
      id: 'py-async-int-waitfor',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_ASYNC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Define a slow coroutine `slow` that sleeps 1 second then returns `"done"`. In `main`, enforce a 50 ms deadline on that coroutine using the `asyncio` function that wraps an awaitable with a timeout and raises `asyncio.TimeoutError` when the deadline expires. Wrap the call in a `try/except asyncio.TimeoutError` that prints `"timed out"` when the deadline fires — it WILL fire because the coroutine needs 1 second but only has 50 ms. Run from sync code. Expected output: `timed out`.',
      starterCode: `import asyncio
  `,
      testCases: [
        {
          input: 'wait_for timeout on a 1s sleep',
          expectedOutput: 'timed out',
          description: 'wait_for raises TimeoutError after the deadline',
        },
      ],
      solution: `import asyncio

async def slow() -> str:
    await asyncio.sleep(1)
    return "done"

async def main():
    try:
        await asyncio.wait_for(slow(), timeout=0.05)
    except asyncio.TimeoutError:
        print("timed out")

asyncio.run(main())`,
      tieredHints: {
        apiSignature: 'asyncio.wait_for(aw, timeout) -> Any',
        skeleton: `import asyncio

async def ____() -> ____:
    await asyncio.sleep(____)
    return "done"

async def main():
    try:
        await asyncio.____(____(), timeout=____)
    except asyncio.____:
        print("timed out")

____.____(main())`,
      },
      explanation:
        '`asyncio.wait_for(coro, timeout=seconds)` cancels the wrapped coroutine and raises `asyncio.TimeoutError` if it does not finish in time — essential for any external call in a real service. Python 3.11+ adds an even cleaner context-manager form: `async with asyncio.timeout(0.05): await slow()`. Without a timeout, a hung upstream can freeze your event loop forever.',
      hints: [
        'asyncio.wait_for(coro, timeout=N) — raises TimeoutError on deadline',
        '3.11+: `async with asyncio.timeout(N): ...` is the modern form',
        'Always add timeouts on external calls',
      ],
      tags: ['async', 'asyncio', 'wait_for', 'timeout', 'TimeoutError'],
      concepts: ['py-async-coroutines', 'py-event-loop'],
    },
  {
      id: 'py-async-adv-taskgroup',
      type: QuestionType.CODING,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_ASYNC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Define a coroutine `work(n)` that briefly sleeps then returns `n * 10`. In `main`, schedule three concurrent tasks — `work(1)`, `work(2)`, `work(3)` — using the Python 3.11+ `asyncio` STRUCTURED-CONCURRENCY context manager. Use its task-creation method to schedule each coroutine and bind the returned handles as `t1`, `t2`, `t3`. After the `async with` block exits, all three tasks are guaranteed done; print the result of each handle on its own line. Run from sync code. Expected output on three lines: `10`, `20`, `30`.',
      starterCode: `import asyncio
  `,
      testCases: [
        {
          input: 'TaskGroup with three tasks',
          expectedOutput: '10\n20\n30',
          description: 'TaskGroup awaits all tasks on exit',
        },
      ],
      solution: `import asyncio

async def work(n: int) -> int:
    await asyncio.sleep(0.01)
    return n * 10

async def main():
    async with asyncio.TaskGroup() as tg:
        t1 = tg.create_task(work(1))
        t2 = tg.create_task(work(2))
        t3 = tg.create_task(work(3))
    print(t1.result())
    print(t2.result())
    print(t3.result())

asyncio.run(main())`,
      tieredHints: {
        apiSignature: 'tg.create_task(coro, *, name=None) -> Task',
        skeleton: `import asyncio

async def ____(n: ____) -> ____:
    await asyncio.sleep(____)
    return n * ____

async def main():
    async with asyncio.____() as tg:
        t1 = tg.____(____(1))
        t2 = tg.____(____(2))
        t3 = tg.____(____(3))
    print(t1.____())
    print(t2.result())
    print(t3.result())

____.____(main())`,
      },
      explanation:
        '`TaskGroup` (3.11+) is the modern alternative to `asyncio.gather` and offers structured concurrency: all tasks finish before the `async with` exits, and if ANY task fails, the rest are cancelled and failures raise as an `ExceptionGroup`. Cleaner for long-lived services because you can no longer leak tasks by forgetting to await. Prefer TaskGroup for new code; keep `gather(..., return_exceptions=True)` when you need per-task error handling without cancellation.',
      hints: [
        'async with asyncio.TaskGroup() as tg: tg.create_task(...)',
        'All tasks finish before the `with` block exits',
        'One failure → remaining tasks cancelled; errors raised as ExceptionGroup',
      ],
      tags: ['async', 'TaskGroup', 'structured-concurrency', '3.11'],
      concepts: ['py-async-coroutines'],
    },
  {
      id: 'py-async-adv-tothread',
      type: QuestionType.CODING,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_ASYNC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Define a PLAIN (synchronous) function `blocking_hash` that takes a string `s`, calls `time.sleep(0.05)` (a BLOCKING call, not the async one), and returns `s.upper()`. Calling this directly from an async context would freeze the whole event loop. In `main`, offload it to a worker thread using the `asyncio` 3.9+ helper that runs a blocking callable on the default thread-pool executor and returns an awaitable. Await the offload with the argument `"hello"` and print the result (expect `HELLO`). Run from sync code.',
      starterCode: `import asyncio
import time
`,
      testCases: [
        {
          input: 'to_thread offloads blocking work',
          expectedOutput: 'HELLO',
          description: 'Sync function runs in a thread; event loop stays responsive',
        },
      ],
      solution: `import asyncio
import time

def blocking_hash(s: str) -> str:
    time.sleep(0.05)
    return s.upper()

async def main():
    result = await asyncio.to_thread(blocking_hash, "hello")
    print(result)

asyncio.run(main())`,
      tieredHints: {
        apiSignature: 'asyncio.to_thread(func, /, *args, **kwargs) -> Any',
        skeleton: `import asyncio
import time

def ____(s: ____) -> ____:
    time.sleep(____)
    return s.____()

async def main():
    result = await asyncio.____(____, "hello")
    print(result)

____.____(main())`,
      },
      explanation:
        '`asyncio.to_thread(fn, *args, **kwargs)` (3.9+) offloads a blocking sync function to the default thread-pool executor and returns an awaitable. Use whenever you MUST call a sync-only library from async code — pandas, `requests`, `sqlite3`, a third-party SDK without async support. The event loop keeps running; the caller awaits the result as if it were native async. Do NOT use for CPU-bound work on large data — that still ties up a thread and can starve the pool.',
      hints: [
        'asyncio.to_thread(sync_fn, *args) returns an awaitable',
        'Good for I/O-bound sync libs (DB drivers, SDKs)',
        'Not a CPU workaround — use multiprocessing for heavy compute',
      ],
      tags: ['async', 'asyncio', 'to_thread', 'blocking', 'executor'],
      concepts: ['py-async-coroutines', 'py-event-loop'],
    },
  {
      id: 'py-async-int-waitfor-gather',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_ASYNC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Put a SINGLE timeout around a whole BATCH of concurrent tasks by composing the `asyncio` timeout helper with the concurrent-gather helper. Define `work(n, seconds)` that sleeps for the given duration then returns `n * 10`. In `main`, launch `work(1, 0.01)` and `work(2, 1)` concurrently with gather, and wrap the whole gather in a 50 ms timeout. The second task needs 1 second, so the deadline fires first — catch `asyncio.TimeoutError` and print `"batch timeout"`. Pending child tasks are cancelled when the deadline fires. Run from sync code. Expected output: `batch timeout`.',
      starterCode: `import asyncio
  `,
      testCases: [
        {
          input: 'wait_for wrapping gather of two tasks',
          expectedOutput: 'batch timeout',
          description: 'Batch exceeds 0.05s → TimeoutError',
        },
      ],
      solution: `import asyncio

async def work(n, seconds):
    await asyncio.sleep(seconds)
    return n * 10

async def main():
    try:
        await asyncio.wait_for(
            asyncio.gather(work(1, 0.01), work(2, 1)),
            timeout=0.05,
        )
    except asyncio.TimeoutError:
        print("batch timeout")

asyncio.run(main())`,
      tieredHints: {
        apiSignature: 'asyncio.wait_for(aw, timeout) -> Any',
        skeleton: `import asyncio

async def ____(n, seconds):
    await asyncio.sleep(seconds)
    return n * ____

async def main():
    try:
        await asyncio.____(
            asyncio.____(____(1, ____), ____(2, ____)),
            timeout=____,
        )
    except asyncio.TimeoutError:
        print("batch timeout")

____.____(main())`,
      },
      explanation:
        'Wrapping `gather` in `wait_for` gives the whole batch a single deadline: when it fires, pending child tasks are cancelled. This is the "don\'t let a slow batch stall the service" pattern. For PER-ITEM timeouts instead, wrap each child coroutine in its own `wait_for` before handing them to `gather` — then a single slow call fails alone without cancelling the rest.',
      hints: [
        '`wait_for` takes any awaitable — `gather(...)` returns one',
        'When the deadline fires, gather\'s pending tasks are cancelled',
        'Per-item timeouts: wait_for each child first, then gather the wrapped coroutines',
      ],
      tags: ['async', 'wait_for', 'gather', 'timeout', 'intermediate'],
      concepts: ['py-async-coroutines'],
    },
  {
      id: 'py-async-int-asyncgen-queue',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_ASYNC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Bridge an async generator into an `asyncio` queue so producer and consumer run as separate concurrent tasks. Write an async generator `numbers(n)` that yields `0..n-1` (briefly sleeping each step to yield to the event loop). Write a coroutine `feed(q)` that iterates the generator with the async form of `for` and puts each value onto `q`; after the loop, put a `None` sentinel. Write a coroutine `consume(q)` that loops forever pulling items off the queue, breaking on the sentinel, printing otherwise. In `main`, create the queue and run feed and consume concurrently. Use `n=3`. Run from sync code. Expected output: `0`, `1`, `2` on three separate lines.',
      starterCode: `import asyncio
  `,
      testCases: [
        {
          input: 'async generator feeding Queue consumer',
          expectedOutput: '0\n1\n2',
          description: 'async for drives q.put; consumer pulls via q.get',
        },
      ],
      solution: `import asyncio

async def numbers(n):
    for i in range(n):
        await asyncio.sleep(0.01)
        yield i

async def feed(q):
    async for v in numbers(3):
        await q.put(v)
    await q.put(None)

async def consume(q):
    while True:
        item = await q.get()
        if item is None:
            break
        print(item)

async def main():
    q = asyncio.Queue()
    await asyncio.gather(feed(q), consume(q))

asyncio.run(main())`,
      tieredHints: {
        apiSignature: 'asyncio.Queue(maxsize=0) -> Queue',
        skeleton: `import asyncio

async def ____(n):
    for i in range(n):
        await asyncio.sleep(____)
        ____ i

async def ____(q):
    ____ for v in numbers(3):
        await q.____(v)
    await q.put(____)

async def ____(q):
    while True:
        item = await q.____()
        if item is ____:
            break
        print(item)

async def main():
    q = asyncio.____()
    await asyncio.____(feed(q), consume(q))

____.____(main())`,
      },
      explanation:
        'Async generators produce values over time; queues hand values between tasks. Combining them lets the generator run on one task while consumers run on another, with natural back-pressure if you pass `maxsize=` to `Queue`. A `None` sentinel is the canonical end-of-stream signal — alternatives include a custom sentinel object or calling `q.task_done()` + `q.join()` for "wait until all items processed" semantics.',
      hints: [
        '`async for` drives `q.put` on one task; `q.get` runs on the consumer task',
        '`None` sentinel signals end-of-stream; consumer breaks on it',
        '`asyncio.Queue(maxsize=N)` gives the generator back-pressure',
      ],
      tags: ['async', 'async-generator', 'Queue', 'gather', 'intermediate'],
      concepts: ['py-async-coroutines'],
    },
  {
      id: 'py-async-adv-rate-limited-fetcher',
      type: QuestionType.CODING,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_ASYNC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Build a concurrent batch fetcher that mirrors a real production constraint. A helper coroutine `fetch_one` is pre-defined in the starter (it takes an integer `id` and returns `id * 10` after a tiny sleep). Write a coroutine `fetch_all` that takes a list of integer IDs and returns a list of results. The implementation must satisfy ALL three constraints at once:\n\n1. At most two fetches may be in flight at any moment — the rest wait their turn.\n2. Each individual fetch has a 50 ms budget. If it overruns, record the string `"timeout"` for that ID instead of raising.\n3. If any fetch raises an unexpected exception, record the string `"error"` for that ID — the rest of the batch must still produce results.\n\nThe returned list has one entry per input ID, in the SAME order. In `main`, invoke `fetch_all` with the six IDs `1, 2, 3, 4, 5, 6` and print the result. Run from sync code. In the happy path (the given `fetch_one` always succeeds quickly), expected output is `[10, 20, 30, 40, 50, 60]`.',
      starterCode: `import asyncio

async def fetch_one(id: int) -> int:
    await asyncio.sleep(0.01)
    return id * 10
`,
      testCases: [
        {
          input: 'fetch_all([1, 2, 3, 4, 5, 6]) with given fetch_one',
          expectedOutput: '[10, 20, 30, 40, 50, 60]',
          description: 'Happy path: concurrency capped, no timeouts, no errors',
        },
      ],
      solution: `import asyncio

async def fetch_one(id: int) -> int:
    await asyncio.sleep(0.01)
    return id * 10

async def _bounded(id: int, sem: asyncio.Semaphore):
    async with sem:
        try:
            return await asyncio.wait_for(fetch_one(id), timeout=0.05)
        except asyncio.TimeoutError:
            return "timeout"

async def fetch_all(ids):
    sem = asyncio.Semaphore(2)
    results = await asyncio.gather(
        *(_bounded(i, sem) for i in ids),
        return_exceptions=True,
    )
    return [r if not isinstance(r, Exception) else "error" for r in results]

async def main():
    print(await fetch_all([1, 2, 3, 4, 5, 6]))

asyncio.run(main())`,
      tieredHints: {
        apiSignature: 'asyncio.gather(*aws, return_exceptions=False) -> list',
        skeleton: `import asyncio

async def ____(id: ____) -> ____:
    await asyncio.sleep(____)
    return id * ____

async def ____(id: ____, sem: asyncio.____):
    async with sem:
        try:
            return await asyncio.____(____(id), timeout=____)
        except asyncio.TimeoutError:
            return "____"

async def fetch_all(ids):
    sem = asyncio.____(____)
    results = await asyncio.____(
        ____(____(i, sem) for i in ids),
        ____=True,
    )
    return [r if not isinstance(r, ____) else "error" for r in results]

async def main():
    print(await fetch_all([1, 2, 3, 4, 5, 6]))

____.____(main())`,
      },
      explanation:
        'This is the canonical "batch work against an external system" shape. `Semaphore(2)` caps in-flight work — the other four tasks wait. `wait_for(..., timeout=0.05)` enforces a per-call budget so one slow upstream cannot stall the batch. `gather(..., return_exceptions=True)` keeps the batch running when any single call raises; the caller then separates successes from failures with an `isinstance` check. Swap `fetch_one` for a real HTTP call through a shared `aiohttp.ClientSession` and this becomes a complete rate-limited, timeout-safe, partial-success fetcher.',
      hints: [
        'Three concurrency controls layered: concurrency cap, per-call timeout, partial-success collection',
        'Order matters: `async with sem:` outer, `wait_for` inside — acquire the slot only while the call runs',
        '`return_exceptions=True` turns raises into list items; distinguish with `isinstance(r, Exception)`',
      ],
      tags: ['async', 'Semaphore', 'wait_for', 'gather', 'return_exceptions', 'advanced'],
      concepts: ['py-async-coroutines'],
    },
  {
      id: 'py-async-mcq-taskgroup-vs-gather',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_ASYNC,
      course: Course.BACKEND,
      question: 'When should you prefer `asyncio.TaskGroup` (3.11+) over `asyncio.gather`?',
      options: [
        { id: 'a', text: 'Always — gather is deprecated', isCorrect: false },
        {
          id: 'b',
          text: 'Use `TaskGroup` by default: it provides STRUCTURED concurrency — you cannot accidentally leak a task past its scope, and any failure cancels siblings cleanly (errors raise as `ExceptionGroup`). Keep `gather(..., return_exceptions=True)` when you want to collect partial successes WITHOUT cancelling the others.',
          isCorrect: true,
        },
        { id: 'c', text: 'Only when you need return values — gather does not return values', isCorrect: false },
        { id: 'd', text: 'TaskGroup only works with exactly three tasks', isCorrect: false },
      ],
      explanation:
        'TaskGroup is the 3.11+ "structured concurrency" primitive: all child tasks are guaranteed to finish (or be cancelled) before the `async with` exits. One failure cancels the rest → the whole group fails as a unit → cleanup is trivial. `gather` is older and gives you two modes: re-raise first failure (and cancel others), or collect everything with `return_exceptions=True`. Rule of thumb: TaskGroup for "all must succeed", `gather(return_exceptions=True)` for "collect what succeeded".',
      hints: [
        'TaskGroup = all-or-nothing structured concurrency',
        'gather(return_exceptions=True) = collect partial results',
        'TaskGroup prevents leaked tasks — can be a safety win in services',
      ],
      tags: ['async', 'TaskGroup', 'gather', 'structured-concurrency'],
      concepts: ['py-async-coroutines'],
    },
  {
      id: 'py-async-mcq-event-loop',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_ASYNC,
      course: Course.BACKEND,
      question: 'How does the asyncio event loop actually run your coroutines concurrently on a single thread?',
      options: [
        { id: 'a', text: 'It spawns one OS thread per coroutine', isCorrect: false },
        {
          id: 'b',
          text: 'Coroutines are cooperative: each `await` on an I/O operation yields control back to the loop, which runs another ready coroutine until the I/O completes. One thread, many tasks, because the CPU is idle during I/O waits anyway.',
          isCorrect: true,
        },
        { id: 'c', text: 'The Python interpreter preempts coroutines every 5 milliseconds', isCorrect: false },
        { id: 'd', text: 'Each `await` uses `fork()` to create a child process', isCorrect: false },
      ],
      explanation:
        'This is the single most important mental model for async Python: concurrency is COOPERATIVE — your code decides when to yield (at every `await`). The loop uses `select` / `epoll` / `kqueue` to multiplex thousands of file descriptors. If a coroutine never yields (e.g. a pure-Python CPU loop), NOTHING else runs — that coroutine blocks the event loop. This is why you use `to_thread` for blocking code and `multiprocessing` for CPU-bound work.',
      hints: [
        'Cooperative = each await is a voluntary yield point',
        'Single thread runs everything — scales because I/O is usually idle CPU',
        'A coroutine that never yields freezes the whole event loop',
      ],
      tags: ['async', 'event-loop', 'cooperative', 'concepts'],
      concepts: ['py-async-coroutines', 'py-event-loop'],
    },
  {
      id: 'py-gap-async-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_ASYNC,
      course: Course.BACKEND,
      question: 'What is asynchronous programming?',
      options: [
        { id: 'a', text: 'A way to make Python code run on multiple CPU cores simultaneously', isCorrect: false },
        { id: 'b', text: 'Running multiple tasks concurrently — while one task waits (for network, disk, etc.), another can run. Python uses `async`/`await` keywords for this.', isCorrect: true },
        { id: 'c', text: 'A technique for compiling Python code into machine code for faster execution', isCorrect: false },
        { id: 'd', text: 'A debugging method that runs code line by line in reverse order', isCorrect: false },
      ],
      explanation: 'Asynchronous programming lets your program do other work while waiting for slow operations (like network requests or file reads). Instead of blocking and doing nothing while waiting, async code can switch to another task. Python\'s `async` and `await` keywords make this possible through coroutines managed by an event loop.',
      hints: [
        'Think about what happens when you wait for a website to respond — your program could be doing something else',
        'The key benefit is for I/O-bound work, not CPU-bound work',
      ],
      tags: ['async', 'concurrency', 'basics'],
      concepts: ['py-async-coroutines'],
    },
  {
      id: 'py-gap-async-2',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_ASYNC,
      course: Course.BACKEND,
      question: 'What is the difference between synchronous and asynchronous code?',
      options: [
        { id: 'a', text: 'Synchronous code is for web apps; asynchronous code is for desktop apps', isCorrect: false },
        { id: 'b', text: 'Synchronous code uses functions; asynchronous code uses classes', isCorrect: false },
        { id: 'c', text: 'Synchronous code is always faster because it runs on the main thread', isCorrect: false },
        { id: 'd', text: 'Synchronous: each line waits for the previous to finish. Asynchronous: tasks can overlap during waiting periods, making it faster for I/O-bound work.', isCorrect: true },
      ],
      explanation: 'In synchronous code, operations run one after another — each must complete before the next starts. In asynchronous code, when a task is waiting (e.g., for a network response), the program can run other tasks instead of sitting idle. Async is faster for I/O-bound work (network, files) but not for CPU-bound work (math, data processing) because it doesn\'t use multiple cores.',
      hints: [
        'Think "synchronous = sequential" and "asynchronous = concurrent"',
        'Async shines when there is a lot of waiting involved',
      ],
      tags: ['async', 'sync', 'concurrency', 'basics'],
      concepts: ['py-async-coroutines'],
    },
  {
      id: 'py-gap-async-3',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_ASYNC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write an async function called `delayed_greeting` that awaits a 1-second `asyncio.sleep` and then returns the string "done". Execute it with `asyncio.run()` and print the result.',
      starterCode: `import asyncio

# Define an async function that waits 1 second then returns "done"


# Run it with asyncio.run() and print the result
`,
      testCases: [
        {
          input: 'asyncio.run(delayed_greeting())',
          expectedOutput: 'done',
          description: 'Should return "done" after waiting',
        },
      ],
      solution: `import asyncio

async def delayed_greeting():
    await asyncio.sleep(1)
    return "done"

result = asyncio.run(delayed_greeting())
print(result)  # done`,
      tieredHints: {
        apiSignature: 'asyncio.run(coro, *, debug=None) -> Any',
        skeleton: `import asyncio

async def ____():
    await asyncio.sleep(____)
    return "done"

result = asyncio.____(____())
____(result)`,
      },
      explanation: '`async def` defines a coroutine — a function that can be paused and resumed. `await` pauses the coroutine until the awaited operation completes (here, sleeping for 1 second). `asyncio.run()` is the entry point that creates an event loop, runs the coroutine, and cleans up. You cannot call an async function directly — you must either `await` it inside another async function or use `asyncio.run()`.',
      hints: [
        'Use `async def` to define the coroutine',
        '`await asyncio.sleep(1)` pauses for 1 second without blocking',
        '`asyncio.run()` is how you start async code from synchronous code',
      ],
      tags: ['async', 'await', 'asyncio', 'coroutine'],
      concepts: ['py-async-coroutines', 'py-event-loop'],
    },
  {
      id: 'py-async-httpx-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_ASYNC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Make a single asynchronous HTTP request with `httpx`. Write an async coroutine `main` that opens an `httpx.AsyncClient` in an `async with` block, `await`s ONE GET to `"https://httpbin.org/get"`, gates on HTTP errors, and prints the JSON body\'s `"url"` value. Drive it with asyncio\'s entry-point function. Make exactly one request — no concurrency. Expect the URL printed back.',
      starterCode: `import asyncio
import httpx
  `,
      testCases: [
        {
          input: 'httpx.AsyncClient single await',
          expectedOutput: 'https://httpbin.org/get',
          description: 'await client.get inside async with; asyncio.run drives it',
        },
      ],
      solution: `import asyncio
import httpx

async def main():
    async with httpx.AsyncClient() as client:
        r = await client.get("https://httpbin.org/get")
        r.raise_for_status()
        print(r.json()["url"])

asyncio.run(main())`,
      tieredHints: {
        apiSignature: 'client.get(url, params=None, headers=None) -> Response',
        skeleton: `import asyncio
import httpx

async def main():
    async with httpx.____() as client:
        r = ____ client.____("https://httpbin.org/get")
        r.____()
        print(r.json()["____"])

____.____(main())`,
      },
      explanation: '`httpx.AsyncClient` is the async counterpart of the synchronous `httpx.Client` (seen in the HTTP topic): same `.get` / `.raise_for_status()` / `.json()` API, but you `await` each request and open it with `async with`. `requests` cannot do this — it is sync-only — which is why an async service (FastAPI, asyncio) reaches for httpx. This is a SINGLE await; fetching many URLs at once is the job of `asyncio.gather` (shown with `aiohttp` in the concurrent-fetch question). httpx and aiohttp are the two common async HTTP clients — httpx also offers a matching sync client and HTTP/2.',
      hints: [
        'httpx.AsyncClient + async with',
        'await client.get(...) for a single request',
        'asyncio.run(main()) starts the loop',
      ],
      tags: ['httpx', 'AsyncClient', 'async', 'await'],
      concepts: ['py-async-coroutines'],
    },
  {
      id: 'py-async-httpx-parsons-1',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_ASYNC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Make ONE asynchronous GET request with httpx and print the response JSON\'s "url" field.',
      correctOrder: [
        'import asyncio',
        'import httpx',
        '',
        'async def main():',
        '    async with httpx.AsyncClient() as client:',
        '        r = await client.get("https://httpbin.org/get")',
        '        print(r.json()["url"])',
        '',
        'asyncio.run(main())',
      ],
      distractorLines: [
        '    with httpx.AsyncClient() as client:',
        '        r = client.get("https://httpbin.org/get")',
        '        r = await httpx.get("https://httpbin.org/get")',
      ],
      solution:
        'import asyncio\nimport httpx\n\nasync def main():\n    async with httpx.AsyncClient() as client:\n        r = await client.get("https://httpbin.org/get")\n        print(r.json()["url"])\n\nasyncio.run(main())',
      explanation:
        'httpx.AsyncClient is the async HTTP client: open it with `async with` (not plain `with`) and `await` each request. `httpx.get(...)` (module-level) is the SYNC shortcut and cannot be awaited. requests has no async client at all — this is why async services reach for httpx.',
      hints: ['async with + await client.get(...).'],
      tags: ['httpx', 'AsyncClient', 'async', 'await'],
      concepts: ['py-async-coroutines'],
    },
  {
      id: 'py-async-httpx-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_ASYNC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the async httpx client class and the keyword that suspends on the request.',
      template: `import asyncio
import httpx

async def main():
    async with httpx.___() as client:
        r = ___ client.get("https://httpbin.org/get")
        print(r.json()["url"])

asyncio.run(main())`,
      blanks: ['AsyncClient', 'await'],
      solution:
        'import asyncio\nimport httpx\n\nasync def main():\n    async with httpx.AsyncClient() as client:\n        r = await client.get("https://httpbin.org/get")\n        print(r.json()["url"])\n\nasyncio.run(main())',
      explanation:
        'AsyncClient is the awaitable client (Client is its sync sibling). Every request through it must be awaited — without `await` you get a coroutine object, not a response.',
      hints: ['Async client class; the keyword before client.get.'],
      tags: ['httpx', 'AsyncClient', 'async', 'await'],
      concepts: ['py-async-coroutines'],
    },
  {
      id: 'py-async-parsons-11',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_ASYNC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Cap concurrency to 3 at a time using a shared asyncio.Semaphore, running six workers with gather.',
      correctOrder: [
        'import asyncio',
        '',
        'async def worker(n, sem):',
        '    async with sem:',
        '        await asyncio.sleep(0.01)',
        '        return n',
        '',
        'async def main():',
        '    sem = asyncio.Semaphore(3)',
        '    results = await asyncio.gather(*[worker(i, sem) for i in range(6)])',
        '    print(results)',
        '',
        'asyncio.run(main())',
      ],
      distractorLines: [
        '    with sem:',
        '    sem = asyncio.Semaphore()',
        '    async with asyncio.Semaphore(3):',
      ],
      solution:
        'import asyncio\n\nasync def worker(n, sem):\n    async with sem:\n        await asyncio.sleep(0.01)\n        return n\n\nasync def main():\n    sem = asyncio.Semaphore(3)\n    results = await asyncio.gather(*[worker(i, sem) for i in range(6)])\n    print(results)\n\nasyncio.run(main())',
      explanation:
        'One SHARED Semaphore(3) is created once in main and passed to every worker — that is what caps total concurrency to 3. Acquire it with `async with sem:` (the async form; plain `with` does not work on an async primitive). Semaphore() with no argument defaults to 1 (a mutex); creating a fresh semaphore per task would cap nothing.',
      hints: ['One shared asyncio.Semaphore(3), acquired via async with.'],
      tags: ['async', 'asyncio', 'Semaphore', 'rate-limit', 'concurrency'],
      concepts: ['py-async-coroutines'],
    },
  {
      id: 'py-async-cloze-11',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_ASYNC,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the asyncio primitive that caps concurrent holders, and the keyword that acquires it.',
      template: `import asyncio

async def worker(n, sem):
    ___ with sem:
        await asyncio.sleep(0.01)
        return n

async def main():
    sem = asyncio.___(3)
    results = await asyncio.gather(*[worker(i, sem) for i in range(6)])
    print(results)

asyncio.run(main())`,
      blanks: ['async', 'Semaphore'],
      solution:
        'import asyncio\n\nasync def worker(n, sem):\n    async with sem:\n        await asyncio.sleep(0.01)\n        return n\n\nasync def main():\n    sem = asyncio.Semaphore(3)\n    results = await asyncio.gather(*[worker(i, sem) for i in range(6)])\n    print(results)\n\nasyncio.run(main())',
      explanation:
        'asyncio.Semaphore(n) permits at most n coroutines inside its block at once; the rest wait. It is acquired with `async with` (not plain `with`) because release happens at an await point.',
      hints: ['async with; the primitive is a Semaphore.'],
      tags: ['async', 'asyncio', 'Semaphore', 'rate-limit', 'concurrency'],
      concepts: ['py-async-coroutines'],
    },
];
