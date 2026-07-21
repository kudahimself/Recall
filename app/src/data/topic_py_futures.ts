import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const py_futures_questions: Question[] = [
{
      id: 'py-concurrency-cloze-3',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_FUTURES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the executor class for I/O-bound concurrency.',
      template: `from concurrent.futures import ___

with ___(max_workers=4) as ex:
    results = list(ex.map(fetch, urls))`,
      blanks: ['ThreadPoolExecutor', 'ThreadPoolExecutor'],
      solution:
        'from concurrent.futures import ThreadPoolExecutor\n\nwith ThreadPoolExecutor(max_workers=4) as ex:\n    results = list(ex.map(fetch, urls))',
      explanation:
        'ThreadPoolExecutor for I/O-bound (GIL releases on I/O). ProcessPoolExecutor for CPU-bound (separate processes bypass the GIL). max_workers caps concurrency.',
      hints: ['CamelCase: "Thread" + "Pool" + "Executor".'],
      tags: ['concurrency', 'ThreadPoolExecutor'],
      concepts: ['py-thread-vs-process'],
    },
{
      id: 'py-concurrency-cloze-4',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_FUTURES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the helper that yields futures in completion order.',
      template: `from concurrent.futures import ThreadPoolExecutor, ___

with ThreadPoolExecutor() as ex:
    futures = [ex.submit(work, i) for i in range(5)]
    for fut in ___(futures):
        print(fut.result())`,
      blanks: ['as_completed', 'as_completed'],
      solution:
        'from concurrent.futures import ThreadPoolExecutor, as_completed\n\nwith ThreadPoolExecutor() as ex:\n    futures = [ex.submit(work, i) for i in range(5)]\n    for fut in as_completed(futures):\n        print(fut.result())',
      explanation:
        'as_completed yields each future as soon as it finishes — fast tasks get processed first. Iterating the original list yields submission order, blocking on slow tasks.',
      hints: ['Snake-case: "as" + "_completed".'],
      tags: ['concurrency', 'as_completed'],
      concepts: ['py-thread-vs-process'],
    },
{
      id: 'py-concurrency-cloze-8',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_FUTURES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the executor class for CPU-bound parallelism (bypasses the GIL).',
      template: `from concurrent.futures import ___

with ___() as ex:
    print(list(ex.map(cpu_heavy, [10**6, 10**6])))`,
      blanks: ['ProcessPoolExecutor', 'ProcessPoolExecutor'],
      solution:
        'from concurrent.futures import ProcessPoolExecutor\n\nwith ProcessPoolExecutor() as ex:\n    print(list(ex.map(cpu_heavy, [10**6, 10**6])))',
      explanation:
        'ProcessPoolExecutor uses separate processes — each has its own GIL, so CPU work runs in parallel. ThreadPoolExecutor is GIL-bound and serializes CPU code.',
      hints: ['CamelCase: "Process" + "Pool" + "Executor".'],
      tags: ['concurrency', 'ProcessPoolExecutor', 'GIL'],
      concepts: ['py-gil-implication'],
    },
{
      id: 'py-concurrency-parsons-3',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_FUTURES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Use a ThreadPoolExecutor to fetch URLs in parallel and collect results.',
      correctOrder: [
        'from concurrent.futures import ThreadPoolExecutor',
        '',
        'urls = ["a", "b", "c"]',
        '',
        'with ThreadPoolExecutor(max_workers=4) as ex:',
        '    results = list(ex.map(fetch, urls))',
        '',
        'print(results)',
      ],
      distractorLines: [
        '    results = ex.map(fetch, urls)',
        'with ThreadPoolExecutor() as ex:',
        '    results = [ex.submit(fetch, u) for u in urls]',
      ],
      solution:
        'from concurrent.futures import ThreadPoolExecutor\n\nurls = ["a", "b", "c"]\n\nwith ThreadPoolExecutor(max_workers=4) as ex:\n    results = list(ex.map(fetch, urls))\n\nprint(results)',
      explanation:
        'Wrapping the executor in `with` guarantees shutdown. ex.map returns a lazy iterator — without list(), the work runs as it is iterated, possibly after the executor closes. submit returns Future objects, not results.',
      hints: ['Wrap map in list() to materialize results inside the with-block.'],
      tags: ['concurrency', 'ThreadPoolExecutor', 'futures'],
      concepts: ['py-thread-vs-process'],
    },
{
      id: 'py-concurrency-parsons-6',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_FUTURES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Use a ProcessPoolExecutor for CPU-bound work to bypass the GIL.',
      correctOrder: [
        'from concurrent.futures import ProcessPoolExecutor',
        '',
        'def cpu_heavy(n):',
        '    return sum(i*i for i in range(n))',
        '',
        'if __name__ == "__main__":',
        '    with ProcessPoolExecutor() as ex:',
        '        results = list(ex.map(cpu_heavy, [10**6, 10**6]))',
        '        print(results)',
      ],
      distractorLines: [
        'from concurrent.futures import ThreadPoolExecutor',
        '    with ThreadPoolExecutor() as ex:',
        'with ProcessPoolExecutor() as ex:',
      ],
      solution:
        'from concurrent.futures import ProcessPoolExecutor\n\ndef cpu_heavy(n):\n    return sum(i*i for i in range(n))\n\nif __name__ == "__main__":\n    with ProcessPoolExecutor() as ex:\n        results = list(ex.map(cpu_heavy, [10**6, 10**6]))\n        print(results)',
      explanation:
        'CPU-bound Python is GIL-bound — threads share one interpreter and serialize. Processes have separate interpreters and run truly in parallel. The `if __name__ == "__main__":` guard is required on Windows/macOS-spawn.',
      hints: ['CPU-bound → ProcessPoolExecutor; the __name__ guard is required.'],
      tags: ['concurrency', 'multiprocessing', 'GIL'],
      concepts: ['py-thread-vs-process', 'py-gil-implication'],
    },
{
      id: 'py-concurrency-parsons-7',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_FUTURES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Submit work and use as_completed to handle results as they finish.',
      correctOrder: [
        'from concurrent.futures import ThreadPoolExecutor, as_completed',
        '',
        'with ThreadPoolExecutor() as ex:',
        '    futures = [ex.submit(work, i) for i in range(5)]',
        '    for fut in as_completed(futures):',
        '        print(fut.result())',
      ],
      distractorLines: [
        '    for fut in futures:',
        '        print(fut)',
        '    futures = ex.map(work, range(5))',
      ],
      solution:
        'from concurrent.futures import ThreadPoolExecutor, as_completed\n\nwith ThreadPoolExecutor() as ex:\n    futures = [ex.submit(work, i) for i in range(5)]\n    for fut in as_completed(futures):\n        print(fut.result())',
      explanation:
        'as_completed yields futures in completion order, so you process fast tasks immediately. Iterating the original list yields submission order — slow tasks stall the loop. fut.result() unwraps the value (or re-raises the exception).',
      hints: ['as_completed yields in finish order, not submission order.'],
      tags: ['concurrency', 'as_completed', 'futures'],
      concepts: ['py-thread-vs-process'],
    },
{
      id: 'py-concurrency-parsons-10',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_FUTURES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Run a multiprocessing.Pool with map for parallel CPU work.',
      correctOrder: [
        'from multiprocessing import Pool',
        '',
        'def square(x):',
        '    return x * x',
        '',
        'if __name__ == "__main__":',
        '    with Pool(4) as p:',
        '        print(p.map(square, range(5)))',
      ],
      distractorLines: [
        '    p = Pool(4)',
        '    p.map(square, range(5))',
        'with Pool() as p:',
      ],
      solution:
        'from multiprocessing import Pool\n\ndef square(x):\n    return x * x\n\nif __name__ == "__main__":\n    with Pool(4) as p:\n        print(p.map(square, range(5)))',
      explanation:
        'multiprocessing.Pool.map distributes work across processes. The `if __name__ == "__main__":` guard prevents the spawn re-importing the module from re-launching the pool indefinitely (Windows/spawn). Without `with`, you must call .close() and .join() manually.',
      hints: ['__main__ guard + with Pool(n).'],
      tags: ['concurrency', 'multiprocessing', 'Pool'],
      concepts: ['py-thread-vs-process'],
    },
{
      id: 'py-concurrency-predict-1',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_FUTURES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `from concurrent.futures import ThreadPoolExecutor

def square(n):
    return n * n

with ThreadPoolExecutor() as ex:
    print(list(ex.map(square, [1, 2, 3, 4])))`,
      expectedOutput: `[1, 4, 9, 16]`,
      explanation:
        'executor.map preserves input order in the output, regardless of which task finishes first. Use as_completed if you instead want results in completion order.',
      hints: ['ex.map preserves input order.'],
      tags: ['concurrency', 'ThreadPoolExecutor', 'map'],
      concepts: ['py-thread-vs-process'],
    },
{
      id: 'py-concurrency-predict-2',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_FUTURES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `from concurrent.futures import ThreadPoolExecutor

def boom():
    raise ValueError("nope")

with ThreadPoolExecutor() as ex:
    fut = ex.submit(boom)

try:
    fut.result()
except ValueError as e:
    print(e)`,
      expectedOutput: `nope`,
      explanation:
        'Exceptions raised inside an executor task are NOT raised at submit time — they are stored on the Future. Calling .result() re-raises in the caller. Forgetting to call .result() means the exception is silently swallowed.',
      hints: ['Future.result() re-raises stored exceptions.'],
      tags: ['concurrency', 'futures', 'exception'],
      concepts: ['py-exception-hierarchy'],
    },
{
      id: 'py-concurrency-predict-7',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_FUTURES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `from concurrent.futures import ThreadPoolExecutor

with ThreadPoolExecutor() as ex:
    f1 = ex.submit(lambda: 1)
    f2 = ex.submit(lambda: 2)

print(f1.result() + f2.result())`,
      expectedOutput: `3`,
      explanation:
        'Exiting the `with` block waits for all submitted tasks to finish (executor.shutdown(wait=True) is the default). After the block, .result() returns immediately without blocking.',
      hints: ['Exiting the with-block joins on all pending tasks.'],
      tags: ['concurrency', 'ThreadPoolExecutor', 'shutdown'],
      concepts: ['py-thread-vs-process'],
    },
{
      id: 'py-concurrency-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_FUTURES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Run three 0.5-second `time.sleep` calls IN PARALLEL using the `concurrent.futures` thread-pool executor capped at 3 workers. Use a `with` block so the pool is cleanly shut down. Run `time.sleep` over the inputs `[0.5, 0.5, 0.5]` using the executor\'s order-preserving map method, materialising the results. Measure wall-clock time with `time.perf_counter` before and after the block, and print `"parallel: "` + elapsed formatted to one decimal + `"s"`. Because the sleeps run concurrently, expect roughly `parallel: 0.5s`.',
      starterCode: `import time
from concurrent.futures import ThreadPoolExecutor
`,
      testCases: [
        {
          input: 'ThreadPoolExecutor.map',
          expectedOutput: 'parallel: 0.5s',
          description: 'Three 0.5s sleeps in 3 threads ≈ 0.5s wall-clock',
        },
      ],
      solution: `import time
from concurrent.futures import ThreadPoolExecutor

t0 = time.perf_counter()
with ThreadPoolExecutor(max_workers=3) as executor:
    list(executor.map(time.sleep, [0.5, 0.5, 0.5]))
elapsed = time.perf_counter() - t0
print(f"parallel: {elapsed:.1f}s")`,
      explanation: '`ThreadPoolExecutor.map(fn, iterable)` runs `fn` on each item across the pool and yields results in order. Because `time.sleep` is I/O-bound (the thread is idle in the kernel), the GIL doesn\'t block parallelism. For CPU-bound workloads swap to `ProcessPoolExecutor` — same API, each worker is a subprocess. The `with` block waits for all futures to finish and shuts the pool down.',
      hints: [
        'executor.map(fn, iterable) runs fn on each item across the pool',
        'with-block shuts down the pool cleanly',
        'For CPU-bound work use ProcessPoolExecutor with the same API',
      ],
      tieredHints: {
        apiSignature: 'ThreadPoolExecutor(max_workers=None, thread_name_prefix="", initializer=None, initargs=())',
        skeleton: `import time
from concurrent.futures import ThreadPoolExecutor

t0 = ____.____()
with ____(max_workers=3) as ____:
    list(____.____(time.sleep, [0.5, 0.5, 0.5]))
elapsed = ____.____() - t0
print(f"parallel: {____:.1f}s")`,
      },
      tags: ['concurrency', 'ThreadPoolExecutor', 'concurrent-futures', 'parallel'],
      concepts: ['py-thread-vs-process'],
    },
{
      id: 'py-concurrency-3',
      type: QuestionType.CODING,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_FUTURES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Submit individual tasks to a `concurrent.futures` thread-pool executor and collect results AS THEY FINISH (not in submission order). Define a plain function `work` that takes an integer `n`, briefly sleeps, then returns `n * n`. Inside a `with` block on the executor, submit five tasks for the inputs 1..5 — use the method that schedules a single call and returns a future handle per call. Iterate completed futures using the `concurrent.futures` helper that yields futures in completion order; collect each future\'s result into a list. Sort the list and print it (expect `[1, 4, 9, 16, 25]`).',
      starterCode: `import time
from concurrent.futures import ThreadPoolExecutor, as_completed
`,
      testCases: [
        {
          input: 'submit + as_completed',
          expectedOutput: '[1, 4, 9, 16, 25]',
          description: 'Results collected out-of-order then sorted',
        },
      ],
      solution: `import time
from concurrent.futures import ThreadPoolExecutor, as_completed

def work(n):
    time.sleep(0.01)
    return n * n

with ThreadPoolExecutor() as ex:
    futures = [ex.submit(work, n) for n in [1, 2, 3, 4, 5]]
    results = [f.result() for f in as_completed(futures)]

print(sorted(results))`,
      explanation: '`submit(fn, *args)` returns a `Future`; call `.result()` to block until it finishes. `as_completed(futures)` is an iterator yielding futures in completion order — useful when you want to process results as they arrive (e.g. streaming progress). If any task raises, `.result()` re-raises it in the consumer. Use `map` when you want order-preserving results; use `submit + as_completed` when you want first-to-finish streaming.',
      hints: [
        'submit returns a Future; .result() blocks until done',
        'as_completed yields completed futures as they finish',
        'Exceptions from tasks surface on .result()',
      ],
      tieredHints: {
        apiSignature: 'concurrent.futures.as_completed(fs, timeout=None)',
        skeleton: `import time
from concurrent.futures import ThreadPoolExecutor, as_completed

def work(n):
    time.sleep(0.01)
    return n * n

with ____() as ex:
    futures = [ex.____(____, n) for n in [1, 2, 3, 4, 5]]
    results = [f.____() for f in ____(____)]

____(sorted(results))`,
      },
      tags: ['concurrency', 'ThreadPoolExecutor', 'as_completed', 'futures'],
      concepts: ['py-thread-vs-process'],
    },
{
      id: 'py-concurrency-6',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_FUTURES,
      course: Course.BACKEND,
      question: 'What does `asyncio.to_thread(sync_fn, *args)` do, and when should you reach for it?',
      options: [
        { id: 'a', text: 'It is a deprecated alias for `asyncio.gather`', isCorrect: false },
        { id: 'b', text: 'It offloads a blocking synchronous function to a thread from asyncio\'s default executor, returning an awaitable. Use it when you MUST call a sync-only library (e.g. legacy DB driver) from async code without blocking the event loop.', isCorrect: true },
        { id: 'c', text: 'It converts any sync function into an async one permanently', isCorrect: false },
        { id: 'd', text: 'It is only available inside a `with` block', isCorrect: false },
      ],
      explanation: '`asyncio.to_thread(fn, *args, **kwargs)` (3.9+) is the idiomatic escape hatch: it runs a blocking function in a thread and gives you an awaitable so your async code doesn\'t freeze. Alternatives: `loop.run_in_executor(executor, fn, *args)` for more control over the pool. Rule of thumb: async-first when you can, to_thread when you must call blocking code, processes when it\'s CPU-bound.',
      hints: [
        'await asyncio.to_thread(sync_fn, *args)',
        'Used to call blocking libs from async code',
        'Runs in asyncio\'s default ThreadPoolExecutor',
      ],
      tags: ['asyncio', 'to_thread', 'blocking', 'executor'],
      concepts: ['py-async-coroutines', 'py-event-loop'],
    },
{
      id: 'py-fut-beg-executor',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_FUTURES,
      course: Course.BACKEND,
      question: 'What does a `ThreadPoolExecutor` from `concurrent.futures` give you?',
      options: [
        { id: 'a', text: 'A reusable pool of worker threads you submit callables to, instead of managing threads.', isCorrect: true },
        { id: 'b', text: 'A single background thread that runs every task you give it strictly in order.', isCorrect: false },
        { id: 'c', text: 'A way to convert blocking functions into asynchronous coroutines automatically.', isCorrect: false },
        { id: 'd', text: 'A lock that protects shared variables whenever several threads run at once.', isCorrect: false },
      ],
      explanation: 'An executor manages a pool of workers for you. You hand it callables (via `submit` or `map`) and it schedules them across its threads, so you never create or join `Thread` objects by hand. `concurrent.futures` offers the same API for a process pool.',
      tags: ['concurrency', 'futures', 'ThreadPoolExecutor', 'beginner'],
      concepts: ['py-thread-vs-process'],
    },
{
      id: 'py-fut-beg-future',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_FUTURES,
      course: Course.BACKEND,
      question: 'In `concurrent.futures`, what does the `Future` returned by `submit()` represent?',
      options: [
        { id: 'a', text: 'A handle to a result that may not exist yet; call `.result()` to get it.', isCorrect: true },
        { id: 'b', text: 'The finished return value itself, already computed before `submit()` returns.', isCorrect: false },
        { id: 'c', text: 'A list of every task currently waiting in the executor\'s internal queue.', isCorrect: false },
        { id: 'd', text: 'A timer that cancels the task automatically if it runs longer than one second.', isCorrect: false },
      ],
      explanation: '`submit(fn, *args)` schedules the work and immediately returns a `Future` — a placeholder for a result that is still being computed. Calling `.result()` blocks until the task finishes (and re-raises any exception it threw). This is what lets you submit many tasks before collecting any results.',
      tags: ['concurrency', 'futures', 'Future', 'beginner'],
      concepts: ['py-thread-vs-process'],
    },
{
      id: 'py-fut-beg-which',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_FUTURES,
      course: Course.BACKEND,
      question: 'Which executor fits which kind of workload?',
      options: [
        { id: 'a', text: 'ThreadPoolExecutor for I/O-bound work; ProcessPoolExecutor for CPU-bound work.', isCorrect: true },
        { id: 'b', text: 'ProcessPoolExecutor for I/O-bound work; ThreadPoolExecutor for CPU-bound work.', isCorrect: false },
        { id: 'c', text: 'Either one works equally well because the GIL has no effect on performance.', isCorrect: false },
        { id: 'd', text: 'ThreadPoolExecutor for both, because processes cannot return any results at all.', isCorrect: false },
      ],
      explanation: 'Threads share one interpreter and the GIL, so they help with I/O-bound work (the GIL releases while waiting on I/O) but not CPU-bound work. Processes each have their own interpreter and GIL, so `ProcessPoolExecutor` gives true CPU parallelism — at the cost of pickling arguments/results between processes.',
      tags: ['concurrency', 'futures', 'gil', 'beginner'],
      concepts: ['py-thread-vs-process', 'py-gil-implication'],
    },
{
      id: 'py-fut-int-submit-map',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_FUTURES,
      course: Course.BACKEND,
      question: 'How do `executor.map(fn, items)` and `executor.submit(fn, x)` differ?',
      options: [
        { id: 'a', text: 'map returns results in input order; submit returns one Future per call you collect yourself.', isCorrect: true },
        { id: 'b', text: 'map runs tasks one at a time; submit is the only method that can run them in parallel.', isCorrect: false },
        { id: 'c', text: 'map works for CPU-bound work only; submit works for I/O-bound work only.', isCorrect: false },
        { id: 'd', text: 'They are aliases — map simply calls submit once for the whole list of items.', isCorrect: false },
      ],
      explanation: '`map` applies `fn` across an iterable and yields results in the original input order — convenient when order matters. `submit` schedules one call and hands back a `Future`; pairing it with `as_completed` lets you process results in completion order. Both run work concurrently across the pool.',
      tags: ['concurrency', 'futures', 'map', 'submit'],
      concepts: ['py-thread-vs-process'],
    },
];
