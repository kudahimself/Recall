import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const py_threading_questions: Question[] = [
{
      id: 'py-concurrency-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_THREADING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the threading primitive that protects a critical section.',
      template: `import threading

lock = threading.___()

with lock:
    counter += 1`,
      blanks: ['Lock'],
      solution: 'import threading\n\nlock = threading.Lock()\n\nwith lock:\n    counter += 1',
      explanation:
        'Lock is the basic mutual-exclusion primitive. Use `with lock:` for exception-safe acquire/release. RLock is the re-entrant variant; use only when the same thread needs to re-acquire.',
      hints: ['Four-letter PascalCase.'],
      tags: ['concurrency', 'Lock'],
      concepts: ['py-thread-vs-process'],
    },
{
      id: 'py-concurrency-cloze-2',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_THREADING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the methods to launch a thread and wait for it to finish.',
      template: `import threading

t = threading.Thread(target=work)
t.___()
t.___()`,
      blanks: ['start', 'join'],
      solution: 'import threading\n\nt = threading.Thread(target=work)\nt.start()\nt.join()',
      explanation:
        'start() launches the thread (calls run() in a new OS thread). join() blocks until it finishes. Calling run() directly executes inline — no concurrency.',
      hints: ['"start" launches; "join" waits.'],
      tags: ['concurrency', 'Thread'],
      concepts: ['py-thread-vs-process'],
    },
{
      id: 'py-concurrency-cloze-5',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_THREADING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the thread-safe FIFO collection used for producer/consumer.',
      template: `import queue

q = queue.___()
q.put("a")
print(q.get())`,
      blanks: ['Queue'],
      solution: 'import queue\n\nq = queue.Queue()\nq.put("a")\nprint(q.get())',
      explanation:
        'queue.Queue is FIFO and thread-safe — get() blocks until data is available, put() blocks if maxsize is reached. queue.LifoQueue is LIFO; queue.PriorityQueue orders by item.',
      hints: ['Capitalized class — same name as the module.'],
      tags: ['concurrency', 'Queue'],
      concepts: ['py-thread-vs-process'],
    },
{
      id: 'py-concurrency-cloze-6',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_THREADING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the synchronization primitive used as a one-shot signal between threads.',
      template: `import threading

started = threading.___()

def worker():
    started.wait()
    print("go")

started.set()`,
      blanks: ['Event'],
      solution:
        'import threading\n\nstarted = threading.Event()\n\ndef worker():\n    started.wait()\n    print("go")\n\nstarted.set()',
      explanation:
        'Event is a thread-safe boolean flag. .wait() blocks until .set() is called from another thread. Spinning on a plain bool wastes CPU and lacks memory-barrier guarantees.',
      hints: ['Five-letter PascalCase — like a JavaScript event flag.'],
      tags: ['concurrency', 'Event'],
      concepts: ['py-thread-vs-process'],
    },
{
      id: 'py-concurrency-cloze-7',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_THREADING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the Thread kwarg that lets the program exit even if the thread is still running.',
      template: `import threading

t = threading.Thread(target=loop, ___=True)
t.start()`,
      blanks: ['daemon'],
      solution: 'import threading\n\nt = threading.Thread(target=loop, daemon=True)\nt.start()',
      explanation:
        'daemon=True flags the thread as a background helper — Python kills it on interpreter exit. Default is False, which blocks exit until the thread finishes. Never use daemon for work that must complete (data writes, etc.).',
      hints: ['Six-letter lowercase.'],
      tags: ['concurrency', 'daemon', 'Thread'],
      concepts: ['py-thread-vs-process'],
    },
{
      id: 'py-concurrency-cloze-9',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_THREADING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the primitive that limits concurrent access to N holders.',
      template: `import threading

sem = threading.___(3)

def worker():
    with sem:
        print("working")`,
      blanks: ['Semaphore'],
      solution:
        'import threading\n\nsem = threading.Semaphore(3)\n\ndef worker():\n    with sem:\n        print("working")',
      explanation:
        'Semaphore(n) allows up to n concurrent holders — a counter-based generalization of Lock (which is Semaphore(1)). Useful for connection pools and rate limiters.',
      hints: ['Nine-letter PascalCase — generalization of a lock.'],
      tags: ['concurrency', 'Semaphore'],
      concepts: ['py-thread-vs-process'],
    },
{
      id: 'py-concurrency-cloze-10',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_THREADING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the re-entrant lock variant — same thread can acquire it multiple times.',
      template: `import threading

lock = threading.___()
lock.acquire()
lock.acquire()  # same thread, fine
lock.release()
lock.release()`,
      blanks: ['RLock'],
      solution:
        'import threading\n\nlock = threading.RLock()\nlock.acquire()\nlock.acquire()  # same thread, fine\nlock.release()\nlock.release()',
      explanation:
        'RLock (re-entrant lock) lets the holding thread acquire it again — useful for recursive code or nested locked methods. Plain Lock would deadlock on the second acquire by the same thread.',
      hints: ['Five-letter PascalCase: "R" + "Lock".'],
      tags: ['concurrency', 'RLock'],
      concepts: ['py-thread-vs-process'],
    },
{
      id: 'py-concurrency-parsons-1',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_THREADING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Protect a shared counter with a Lock so increments do not race. Declare the counter (starting at 0) first, then the lock that guards it.',
      correctOrder: [
        'import threading',
        '',
        'counter = 0',
        'lock = threading.Lock()',
        '',
        'def inc():',
        '    global counter',
        '    with lock:',
        '        counter += 1',
      ],
      distractorLines: [
        '    counter += 1',
        'lock = threading.RLock()',
        '    lock.acquire()',
      ],
      solution:
        'import threading\n\ncounter = 0\nlock = threading.Lock()\n\ndef inc():\n    global counter\n    with lock:\n        counter += 1',
      explanation:
        '`counter += 1` is three operations: read, add, write. Without a lock, two threads can interleave and lose updates. `with lock:` is the canonical exception-safe form — auto-releases on raise.',
      hints: ['with lock: protects the read-modify-write.'],
      tags: ['concurrency', 'threading', 'lock'],
      concepts: ['py-thread-vs-process'],
    },
{
      id: 'py-concurrency-parsons-2',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_THREADING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Use `threading.Thread` to run a `work(n)` function concurrently in two threads (passing `1` and `2` as arguments). Launch both threads, then wait for both to complete before the program ends.',
      correctOrder: [
        'import threading',
        '',
        'def work(n):',
        '    print(n)',
        '',
        't1 = threading.Thread(target=work, args=(1,))',
        't2 = threading.Thread(target=work, args=(2,))',
        't1.start()',
        't2.start()',
        't1.join()',
        't2.join()',
      ],
      distractorLines: [
        't1.run()',
        't1.start().join()',
        't1 = threading.Thread(work, 1)',
      ],
      solution:
        'import threading\n\ndef work(n):\n    print(n)\n\nt1 = threading.Thread(target=work, args=(1,))\nt2 = threading.Thread(target=work, args=(2,))\nt1.start()\nt2.start()\nt1.join()\nt2.join()',
      explanation:
        '.start() launches the thread (calls run() in a new OS thread). .run() called directly executes inline — no concurrency. .join() blocks until the thread finishes; without it, the main thread may exit first or you cannot rely on results.',
      hints: ['start launches; join waits.'],
      tags: ['concurrency', 'threading', 'Thread'],
      concepts: ['py-thread-vs-process'],
    },
{
      id: 'py-concurrency-parsons-4',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_THREADING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Set up a producer/consumer over a shared `queue.Queue` (module-level). Define `producer()` to add the numbers 0, 1, 2 to the queue, and `consumer()` to loop forever: retrieve each item, print it, and mark it as handled. Use the queue, not a plain list.',
      correctOrder: [
        'import queue',
        'import threading',
        '',
        'q = queue.Queue()',
        '',
        'def producer():',
        '    for i in range(3):',
        '        q.put(i)',
        '',
        'def consumer():',
        '    while True:',
        '        item = q.get()',
        '        print(item)',
        '        q.task_done()',
      ],
      distractorLines: [
        'q = []',
        '        q.append(i)',
        '        item = q.pop()',
      ],
      solution:
        'import queue\nimport threading\n\nq = queue.Queue()\n\ndef producer():\n    for i in range(3):\n        q.put(i)\n\ndef consumer():\n    while True:\n        item = q.get()\n        print(item)\n        q.task_done()',
      explanation:
        'queue.Queue is thread-safe and blocking — get() blocks until an item is available, put() blocks if maxsize is reached. A plain list is NOT thread-safe in this pattern; race conditions corrupt state.',
      hints: ['queue.Queue.get/put — not list.append/pop.'],
      tags: ['concurrency', 'queue', 'producer-consumer'],
      concepts: ['py-thread-vs-process'],
    },
{
      id: 'py-concurrency-parsons-5',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_THREADING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Use a `threading.Event` to coordinate a worker thread. Define `worker()` to block until the event is signaled, then print `"go"`. In the main thread, create and launch the thread, signal the event to release the worker, and wait for the thread to complete. Use an Event, not a boolean flag.',
      correctOrder: [
        'import threading',
        '',
        'started = threading.Event()',
        '',
        'def worker():',
        '    started.wait()',
        '    print("go")',
        '',
        't = threading.Thread(target=worker)',
        't.start()',
        'started.set()',
        't.join()',
      ],
      distractorLines: [
        '    while not started:',
        'started = False',
        '    started = True',
      ],
      solution:
        'import threading\n\nstarted = threading.Event()\n\ndef worker():\n    started.wait()\n    print("go")\n\nt = threading.Thread(target=worker)\nt.start()\nstarted.set()\nt.join()',
      explanation:
        'Event is a thread-safe one-shot flag. .wait() blocks until .set() is called from another thread. Spinning on a bool wastes CPU and has no memory-barrier guarantee — Event uses a condition variable internally.',
      hints: ['Event.wait blocks until Event.set.'],
      tags: ['concurrency', 'threading', 'Event'],
      concepts: ['py-thread-vs-process'],
    },
{
      id: 'py-concurrency-parsons-8',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_THREADING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Start a `threading.Thread` running a `background` worker (an infinite loop) as a DAEMON thread, so the program can exit even while that thread is still running. Build and start the thread; do not join it.',
      correctOrder: [
        'import threading',
        '',
        'def background():',
        '    while True:',
        '        pass',
        '',
        't = threading.Thread(target=background, daemon=True)',
        't.start()',
      ],
      distractorLines: [
        't = threading.Thread(target=background)',
        't.daemon = False',
        't.join()',
      ],
      solution:
        'import threading\n\ndef background():\n    while True:\n        pass\n\nt = threading.Thread(target=background, daemon=True)\nt.start()',
      explanation:
        'Daemon threads are killed when the main program exits. Non-daemon threads block exit until they finish. Use daemon=True for housekeeping loops; never for work that must complete (data writes, etc.).',
      hints: ['daemon=True at construction.'],
      tags: ['concurrency', 'threading', 'daemon'],
      concepts: ['py-thread-vs-process'],
    },
{
      id: 'py-concurrency-parsons-9',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_THREADING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Use a `threading.Semaphore(3)` to limit concurrent access to 3 holders. Define `worker()` to acquire the semaphore as a context manager and print `"working"` inside the protected block.',
      correctOrder: [
        'import threading',
        '',
        'sem = threading.Semaphore(3)',
        '',
        'def worker():',
        '    with sem:',
        '        print("working")',
      ],
      distractorLines: [
        'sem = threading.Lock()',
        'sem = threading.BoundedSemaphore()',
        '    sem.acquire(3)',
      ],
      solution:
        'import threading\n\nsem = threading.Semaphore(3)\n\ndef worker():\n    with sem:\n        print("working")',
      explanation:
        'Semaphore(n) allows up to n concurrent holders — a counter-based lock. Lock() allows only 1. BoundedSemaphore raises if released more than acquired (good for catching bugs).',
      hints: ['Semaphore(n) — context-manager friendly.'],
      tags: ['concurrency', 'threading', 'Semaphore'],
      concepts: ['py-thread-vs-process'],
    },
{
      id: 'py-concurrency-predict-3',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_THREADING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `import queue

q = queue.Queue()
q.put("a")
q.put("b")
print(q.get())
print(q.get())
print(q.empty())`,
      expectedOutput: `a
b
True`,
      explanation:
        'queue.Queue is FIFO — first in, first out. After two gets, the queue is empty. queue.LifoQueue would print b then a; PriorityQueue orders by item.',
      hints: ['Queue is FIFO.'],
      tags: ['concurrency', 'queue', 'fifo'],
      concepts: ['py-thread-vs-process'],
    },
{
      id: 'py-concurrency-predict-4',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_THREADING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `import threading

lock = threading.Lock()
lock.acquire()
got = lock.acquire(blocking=False)
print(got)
lock.release()`,
      expectedOutput: `False`,
      explanation:
        'threading.Lock is NOT re-entrant — the same thread cannot acquire it twice. blocking=False returns False immediately when it would otherwise block. Use threading.RLock if a thread needs to re-acquire its own lock (e.g. recursive function holding a lock).',
      hints: ['Lock blocks reacquire by the same thread; RLock would allow it.'],
      tags: ['concurrency', 'Lock', 'RLock'],
      concepts: ['py-thread-vs-process'],
    },
{
      id: 'py-concurrency-predict-5',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_THREADING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `import threading

ev = threading.Event()
print(ev.is_set())
ev.set()
print(ev.is_set())
ev.clear()
print(ev.is_set())`,
      expectedOutput: `False
True
False`,
      explanation:
        'Event starts cleared (False). .set() makes it True (and unblocks any waiters). .clear() resets to False. Multiple set() calls are idempotent.',
      hints: ['Event starts False; set→True; clear→False.'],
      tags: ['concurrency', 'Event'],
      concepts: ['py-thread-vs-process'],
    },
{
      id: 'py-concurrency-predict-6',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_THREADING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `import threading

counter = 0
lock = threading.Lock()

def inc():
    global counter
    for _ in range(1000):
        with lock:
            counter += 1

threads = [threading.Thread(target=inc) for _ in range(10)]
for t in threads:
    t.start()
for t in threads:
    t.join()

print(counter)`,
      expectedOutput: `10000`,
      explanation:
        'With the lock, all 10 × 1000 increments are atomic — exactly 10000. Remove the `with lock:` and you get a non-deterministic value below 10000 due to lost updates from interleaved read-modify-write.',
      hints: ['10 threads × 1000 increments, fully serialized by the lock.'],
      tags: ['concurrency', 'Lock', 'race-condition'],
      concepts: ['py-thread-vs-process'],
    },
{
      id: 'py-concurrency-predict-8',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_THREADING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `import threading

rlock = threading.RLock()
rlock.acquire()
got = rlock.acquire(blocking=False)
print(got)
rlock.release()
rlock.release()`,
      expectedOutput: `True`,
      explanation:
        'RLock (re-entrant lock) lets the SAME thread acquire it multiple times — internal counter increments. Each acquire needs a matching release. Lock would have returned False on the second acquire.',
      hints: ['RLock allows the same thread to re-acquire.'],
      tags: ['concurrency', 'RLock'],
      concepts: ['py-thread-vs-process'],
    },
{
      id: 'py-concurrency-predict-9',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_THREADING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `import queue

q = queue.Queue()
q.put_nowait("a")
print(q.qsize())
q.get_nowait()
print(q.empty())`,
      expectedOutput: `1
True`,
      explanation:
        'put_nowait/get_nowait raise queue.Full / queue.Empty instead of blocking. qsize() is approximate (other threads may have changed it) but exact in single-thread code. After get_nowait, the queue is empty.',
      hints: ['put_nowait → put, get_nowait → get; non-blocking variants.'],
      tags: ['concurrency', 'queue', 'nowait'],
      concepts: ['py-thread-vs-process'],
    },
{
      id: 'py-concurrency-predict-10',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_THREADING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `import threading

results = []

def worker():
    results.append(threading.current_thread().name)

t = threading.Thread(target=worker, name="W1")
t.start()
t.join()
print(results)`,
      expectedOutput: `['W1']`,
      explanation:
        'threading.current_thread().name returns the name set at construction (Thread(name=...)) or an auto-generated name like "Thread-1". list.append happens to be thread-safe for CPython due to the GIL, but in general shared state still needs a lock.',
      hints: ['name kwarg sets the thread name.'],
      tags: ['concurrency', 'threading', 'name'],
      concepts: ['py-thread-vs-process'],
    },
{
      id: 'py-concurrency-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_THREADING,
      course: Course.BACKEND,
      question: 'When should you reach for `threading` vs `multiprocessing` vs `asyncio` in Python?',
      options: [
        { id: 'a', text: 'They are interchangeable — pick whichever you know', isCorrect: false },
        { id: 'b', text: '`asyncio` for high-concurrency I/O-bound work with cooperative scheduling. `threading` for I/O-bound work you cannot make async (legacy blocking libs). `multiprocessing` for CPU-bound work — the GIL means threads can\'t use multiple CPU cores for pure-Python computation.', isCorrect: true },
        { id: 'c', text: 'Always use threads — they are always fastest', isCorrect: false },
        { id: 'd', text: 'Only use multiprocessing — threading is deprecated', isCorrect: false },
      ],
      explanation: 'The GIL lets only one thread execute Python bytecode at a time, so threading gives you no CPU parallelism for pure-Python work — but it IS useful for I/O-bound blocking code (requests in a thread pool). `multiprocessing` spawns OS processes, each with its own interpreter/GIL, so it scales CPU-bound work across cores. `asyncio` is cooperative single-threaded concurrency — scales to tens of thousands of sockets but requires async-native libraries.',
      hints: [
        'CPU-bound → multiprocessing (bypasses GIL)',
        'I/O-bound + async lib available → asyncio',
        'I/O-bound + blocking lib only → threading',
      ],
      tags: ['concurrency', 'threading', 'multiprocessing', 'asyncio', 'gil'],
      concepts: ['py-thread-vs-process', 'py-async-coroutines', 'py-event-loop', 'py-gil-implication'],
    },
{
      id: 'py-concurrency-4',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_THREADING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Protect a shared counter against race conditions using the `threading` module\'s mutual-exclusion primitive. Declare two module-level names: an integer counter starting at 0, and a lock instance. Define a function `increment_many(n)` that loops `n` times; inside each iteration, acquire the lock (via `with`) and increment the global counter by 1. Start TWO threads each running `increment_many` with 1000, join both to completion, and print the final counter (expect `2000`). Without the lock, interleaved read-modify-write sequences would lose updates — the increment operator is NOT atomic.',
      starterCode: `from threading import Thread, Lock
  `,
      testCases: [
        {
          input: 'two threads × 1000 increments with lock',
          expectedOutput: '2000',
          description: 'Lock serialises the read-modify-write',
        },
      ],
      solution: `from threading import Thread, Lock

counter = 0
lock = Lock()

def increment_many(n):
    global counter
    for _ in range(n):
        with lock:
            counter += 1

t1 = Thread(target=increment_many, args=(1000,))
t2 = Thread(target=increment_many, args=(1000,))
t1.start(); t2.start()
t1.join(); t2.join()
print(counter)`,
      explanation: '`counter += 1` compiles to LOAD, ADD, STORE — three bytecodes. Two threads can both LOAD the same value, each ADD 1, then each STORE — losing one increment. `with lock:` guarantees only one thread is in the critical section. The GIL makes pure-Python ops atomic at the bytecode level, but compound ops like `+=` are NOT atomic. When in doubt, lock.',
      hints: [
        'Use `with lock:` to enter/exit the critical section',
        '+= is read-modify-write — not atomic',
        'Always .join() threads before reading shared state',
      ],
      tieredHints: {
        apiSignature: 'threading.Lock()',
        skeleton: `from threading import Thread, Lock

counter = 0
lock = ____()

def increment_many(n):
    global ____
    for _ in range(n):
        ____ ____:
            ____ ____ 1

t1 = ____(target=____, args=(1000,))
t2 = ____(target=increment_many, args=(1000,))
t1.____(); t2.____()
t1.____(); t2.____()
print(____)`,
      },
      tags: ['threading', 'Lock', 'race-condition', 'shared-state'],
      concepts: ['py-thread-vs-process'],
    },
{
      id: 'py-concurrency-5',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_THREADING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Build a THREAD-SAFE producer/consumer channel using the standard-library `queue` module\'s FIFO class. Create a queue `q`. Define a `producer` (no args) that puts the integers 1, 2, 3 onto the queue in order and then puts a sentinel `None` to signal end-of-stream. Define a `consumer` (no args) that loops: pull an item from the queue; break the loop if it is `None`, else print it and mark the queue entry as done. Run both in their own threads and join each. Expected output: `1`, `2`, `3` on three separate lines.',
      starterCode: `from threading import Thread
from queue import Queue
`,
      testCases: [
        {
          input: 'producer/consumer with sentinel',
          expectedOutput: '1\n2\n3',
          description: 'Queue is thread-safe FIFO',
        },
      ],
      solution: `from threading import Thread
from queue import Queue

q = Queue()

def producer():
    for n in (1, 2, 3):
        q.put(n)
    q.put(None)  # sentinel

def consumer():
    while True:
        item = q.get()
        if item is None:
            break
        print(item)
        q.task_done()

p = Thread(target=producer)
c = Thread(target=consumer)
p.start(); c.start()
p.join(); c.join()`,
      explanation: '`queue.Queue` is a thread-safe FIFO — `put` and `get` are internally locked. Great for one-producer-one-consumer or many-to-many pipelines. Common sentinel pattern: producer puts `None` to signal "no more"; consumer breaks on it. `q.task_done()` + `q.join()` gives you "wait for every item to be processed" semantics. Avoid sharing plain lists across threads — use `Queue` or `collections.deque` (atomic append/popleft).',
      hints: [
        'queue.Queue is internally locked — put/get are thread-safe',
        'Sentinel (None) is the canonical shutdown signal',
        'For async code use asyncio.Queue — same semantics',
      ],
      tieredHints: {
        apiSignature: 'queue.Queue(maxsize=0)',
        skeleton: `from threading import Thread
from queue import Queue

q = ____()

def producer():
    for n in (1, 2, 3):
        q.____(n)
    q.____(None)

def consumer():
    while True:
        item = ____.____()
        if item ____ None:
            ____
        ____(item)
        q.____()

p = ____(target=____)
c = ____(target=____)
p.____(); c.____()
p.____(); c.____()`,
      },
      tags: ['threading', 'Queue', 'producer-consumer', 'concurrency'],
      concepts: ['py-thread-vs-process'],
    },
{
      id: 'py-thread-beg-what',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_THREADING,
      course: Course.BACKEND,
      question: 'What is a thread in a running program?',
      options: [
        { id: 'a', text: 'A separate flow of execution that runs inside the same process, sharing its memory.', isCorrect: true },
        { id: 'b', text: 'A completely separate program with its own private memory and process id.', isCorrect: false },
        { id: 'c', text: 'A queue of tasks that the operating system runs strictly one after another.', isCorrect: false },
        { id: 'd', text: 'A copy of the source code kept on disk so the program can restart quickly.', isCorrect: false },
      ],
      explanation: 'A thread is an independent path of execution within a process. Threads in the same process share memory (variables, objects) — which is why they are lightweight but also why shared state needs protecting. Separate *processes*, by contrast, each get their own memory.',
      tags: ['concurrency', 'threading', 'thread', 'beginner'],
      concepts: ['py-thread-vs-process'],
    },
{
      id: 'py-thread-beg-gil',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_THREADING,
      course: Course.BACKEND,
      question: 'What is Python\'s Global Interpreter Lock (GIL)?',
      options: [
        { id: 'a', text: 'A lock that lets only one thread run Python bytecode at a time within a process.', isCorrect: true },
        { id: 'b', text: 'A setting that permanently disables threading on machines with one CPU core.', isCorrect: false },
        { id: 'c', text: 'A lock you must acquire by hand before starting any thread in your program.', isCorrect: false },
        { id: 'd', text: 'A tool that automatically makes every shared variable safe from race conditions.', isCorrect: false },
      ],
      explanation: 'The GIL allows only one thread to execute Python bytecode at any instant in a single process. That is why threads give no CPU-parallelism speedup for pure-Python work — but they still help for I/O-bound work, because the GIL is released while a thread waits on I/O.',
      tags: ['concurrency', 'threading', 'gil', 'beginner'],
      concepts: ['py-gil-implication'],
    },
{
      id: 'py-thread-beg-race',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_THREADING,
      course: Course.BACKEND,
      question: 'What is a "race condition" in multithreaded code?',
      options: [
        { id: 'a', text: 'A bug where the result depends on the unpredictable timing of interleaved threads.', isCorrect: true },
        { id: 'b', text: 'A feature that makes threads finish faster by racing them against each other.', isCorrect: false },
        { id: 'c', text: 'An error raised when two threads are given the exact same name at startup.', isCorrect: false },
        { id: 'd', text: 'A rule that the fastest thread always wins and its result is the one kept.', isCorrect: false },
      ],
      explanation: 'A race condition is a bug where correctness depends on the order/timing in which threads interleave. The classic example is `counter += 1` from several threads: the read-modify-write can interleave and lose updates. The fix is to serialise the critical section with a lock.',
      tags: ['concurrency', 'threading', 'race-condition', 'beginner'],
      concepts: ['py-thread-vs-process'],
    },
];
