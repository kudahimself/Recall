/**
 * Topic.PY_GENERATORS — generator functions and the generator protocol:
 * yield basics, lazy execution, next()/StopIteration, memory savings,
 * generator pipelines, infinite generators + islice, state across yields,
 * generator-expression exhaustion, return-value, yield from delegation,
 * and send()-based coroutines.
 *
 * Split out of PY_DECORATORS (which held a single stray generator MCQ) and
 * PY_FUNCTIONS (which held two mis-homed generator questions) so generators
 * ramp beginner→intermediate→advanced as their own topic. Generator
 * EXPRESSIONS as a comprehension-syntax form stay in PY_COMPREHENSIONS; this
 * topic covers the generator PROTOCOL (yield, delegation, coroutines).
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const py_generators_questions: Question[] = [
  // ===================== BEGINNER =====================
  {
    id: 'pe1-gen-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PY_GENERATORS,
    course: Course.BACKEND,
    question: 'What is a generator function in Python?',
    options: [
      { id: 'a', text: 'A function that creates random values', isCorrect: false },
      { id: 'b', text: 'A function that uses `yield` to produce values one at a time, on demand', isCorrect: true },
      { id: 'c', text: 'A function that generates all its values at once and stores them in a list', isCorrect: false },
      { id: 'd', text: 'A class method that generates new objects', isCorrect: false },
    ],
    explanation: 'A generator function uses `yield` instead of `return`. Each call to `next()` on the generator runs until the next `yield` and returns that value, then pauses. Generators are memory-efficient — they produce values lazily, one at a time, instead of computing everything upfront. Great for large datasets or infinite sequences.',
    hints: [
      'Generator functions contain `yield` instead of (or in addition to) `return`',
      'They produce values one at a time — lazily',
    ],
    tags: ['generators', 'yield', 'functions', 'lazy-evaluation'],
    concepts: ['py-generator-yield'],
  },
  {
    id: 'py-gen-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PY_GENERATORS,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: 'Fill in the keyword that produces a value and pauses the function, turning it into a generator.',
    template: `def first_two():
    ___ "a"
    ___ "b"

g = first_two()
print(next(g), next(g))`,
    blanks: ['yield', 'yield'],
    solution:
      'def first_two():\n    yield "a"\n    yield "b"\n\ng = first_two()\nprint(next(g), next(g))',
    explanation:
      'The presence of `yield` anywhere in a function body makes it a generator function — calling it returns a generator object without running the body. Each `next()` runs to the next `yield`, hands back that value, and pauses there until the following `next()`.',
    hints: ['One five-letter keyword that both emits a value and suspends the function.'],
    tags: ['generators', 'yield', 'basics'],
    concepts: ['py-generator-yield'],
  },
  {
    id: 'py-gen-predict-lazy',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PY_GENERATORS,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: 'What does this code print?',
    code: `def gen():
    print("start")
    yield 1
    print("middle")
    yield 2

g = gen()
print("created")
print(next(g))
print(next(g))`,
    expectedOutput: `created
start
1
middle
2`,
    explanation:
      'Calling gen() does NOT run the body — it just builds a generator object, so "created" prints first. The body only advances on next(): the first next() runs "start" then yields 1; the second resumes after the first yield, runs "middle", then yields 2.',
    hints: ['The body does not run until the first next() — creation is lazy.'],
    tags: ['generators', 'lazy', 'execution-order'],
    concepts: ['py-generator-yield'],
  },
  {
    id: 'pe1-gen-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PY_GENERATORS,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: 'Write a generator function `countdown(n)` that yields numbers from `n` down to 1. Then use a for loop to print all values from `countdown(5)`.',
    starterCode: `def countdown(n):
    # produce numbers from n down to 1, one at a time
    pass

for num in countdown(5):
    print(num)
`,
    testCases: [
      {
        input: '',
        expectedOutput: '5\n4\n3\n2\n1',
        description: 'Should print 5 4 3 2 1 on separate lines',
      },
    ],
    solution: `def countdown(n):
    while n > 0:
        yield n
        n -= 1

for num in countdown(5):
    print(num)`,
    explanation: 'Using `yield` makes this a generator function. When the `for` loop calls `next()` on the generator, it runs until `yield n`, returns that value, and pauses. On the next call, it continues from after `yield`, decrements `n`, and loops again. When `n` reaches 0, the function ends and the loop stops.',
    hints: [
      'Use `yield n` instead of `return n`',
      'A while loop keeps the generator alive; it pauses at each `yield`',
    ],
    tags: ['generators', 'yield', 'while', 'countdown'],
    concepts: ['py-generator-yield'],
    tieredHints: {
      apiSignature: 'yield expression',
      skeleton: `def ____(n):
    ____ n > 0:
        ____ n
        n ____ 1

for ____ in ____(5):
    ____(____)`,
    },
  },
  {
    id: 'py-gen-parsons-1',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PY_GENERATORS,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question:
      'Define a generator `squares(nums)` that yields each number squared (one statement per line), then collect every value into a list and print it.',
    correctOrder: [
      'def squares(nums):',
      '    for n in nums:',
      '        yield n * n',
      '',
      'result = list(squares([1, 2, 3]))',
      'print(result)',
    ],
    distractorLines: [
      '        return n * n',
      '    result = [n * n for n in nums]',
    ],
    solution:
      'def squares(nums):\n    for n in nums:\n        yield n * n\n\nresult = list(squares([1, 2, 3]))\nprint(result)',
    explanation:
      '`yield n * n` inside the loop emits one squared value per iteration and pauses; `return` would end the generator after the first value. `list(...)` drives the generator to exhaustion, collecting [1, 4, 9].',
    hints: ['yield inside the loop (not return); list() consumes the whole generator.'],
    tags: ['generators', 'yield', 'list'],
    concepts: ['py-generator-yield'],
  },
  {
    id: 'py-gen-predict-stopiteration',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PY_GENERATORS,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: 'What does this code print?',
    code: `def two():
    yield 10
    yield 20

g = two()
print(next(g))
print(next(g))
try:
    next(g)
except StopIteration:
    print("done")`,
    expectedOutput: `10
20
done`,
    explanation:
      'Each next() returns the next yielded value: 10, then 20. After the last yield, the generator is exhausted, so the third next() raises StopIteration — which the try/except catches and prints "done". A for loop hides this exception; it stops looping automatically when StopIteration is raised.',
    hints: ['What happens on next() after the final yield?'],
    tags: ['generators', 'next', 'StopIteration', 'exhaustion'],
    concepts: ['py-generator-yield'],
  },
  {
    id: 'py-gen-memory-mcq',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PY_GENERATORS,
    course: Course.BACKEND,
    question: 'A generator yields values lazily instead of building a list. Why does that save memory?',
    options: [
      { id: 'a', text: 'Only one value exists at a time; the rest are computed on demand, never all stored at once', isCorrect: true },
      { id: 'b', text: 'It compresses the full sequence into a compact binary representation before handing it back to you', isCorrect: false },
      { id: 'c', text: 'It memoises every value it produces so a second pass over the data runs faster than the first', isCorrect: false },
      { id: 'd', text: 'It offloads the values onto a background thread, keeping the main thread free', isCorrect: false },
    ],
    explanation: 'A generator computes each value only when requested and forgets it once you move on, so at any moment just one value (plus the generator\'s local state) is in memory. A list comprehension over a million items materialises all million; the generator equivalent holds one. The trade-off: a generator is single-use and cannot be indexed or re-iterated.',
    hints: [
      'How many values does a generator hold at once?',
      'Lists materialise everything; generators produce on demand',
    ],
    tags: ['generators', 'memory', 'lazy-evaluation'],
    concepts: ['py-generator-yield'],
  },

  // ===================== INTERMEDIATE =====================
  {
    id: 'py-gen-pipeline',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PY_GENERATORS,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: 'Build a lazy generator pipeline. Define a generator `evens(nums)` that yields only the even numbers from an iterable, and a generator `squared(nums)` that yields each value squared. Neither may build a list internally. Compose them — feed a range through `evens` and then through `squared` — and print the result as a list. For `range(6)` the output should be `[0, 4, 16]`.',
    starterCode: `# evens(nums): yield only the even numbers, lazily
# squared(nums): yield each value squared
# Compose them over range(6) and print the result as a list
`,
    testCases: [
      {
        input: 'list(squared(evens(range(6))))',
        expectedOutput: '[0, 4, 16]',
        description: 'Two generators chained lazily',
      },
    ],
    solution: `def evens(nums):
    for n in nums:
        if n % 2 == 0:
            yield n

def squared(nums):
    for n in nums:
        yield n * n

print(list(squared(evens(range(6)))))`,
    explanation: 'Generators compose into pipelines: `squared(evens(range(6)))` wires one generator\'s output into the next\'s input, and nothing runs until `list(...)` pulls values through. Each value flows all the way down the pipeline before the next one starts — memory stays O(1) regardless of input size. This is the foundation of streaming data processing in Python.',
    hints: [
      'Each generator takes an iterable and yields filtered/transformed values',
      'Chaining is just nesting the calls: squared(evens(...))',
      'Nothing executes until list() consumes the outer generator',
    ],
    tags: ['generators', 'pipeline', 'lazy', 'composition'],
    concepts: ['py-generator-yield'],
    tieredHints: {
      apiSignature: 'yield expression',
      skeleton: `def evens(nums):
    ____ n in nums:
        ____ n ____ 2 == 0:
            ____ n

def squared(nums):
    ____ n in nums:
        ____ n ____ n

____(____(____(____(range(6)))))`,
    },
  },
  {
    id: 'py-gen-infinite-islice',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PY_GENERATORS,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: 'Write an INFINITE generator `naturals()` that yields 1, 2, 3, … forever (an unbounded loop). Because it never stops on its own, you must not iterate it fully — take just the first 5 values using `itertools.islice`, collect them into a list, and print it (expect `[1, 2, 3, 4, 5]`).',
    starterCode: `from itertools import islice
# naturals(): yield 1, 2, 3, ... without ever stopping
# take the first 5 values with islice, then print them as a list
`,
    testCases: [
      {
        input: 'list(islice(naturals(), 5))',
        expectedOutput: '[1, 2, 3, 4, 5]',
        description: 'Infinite generator sliced to a finite prefix',
      },
    ],
    solution: `from itertools import islice

def naturals():
    n = 1
    while True:
        yield n
        n += 1

print(list(islice(naturals(), 5)))`,
    explanation: 'An infinite generator is legal precisely because it is lazy — `while True: yield n` only produces a value when asked. `itertools.islice(iterable, 5)` lazily takes the first 5 values and stops, so the generator is never driven past what you need. Trying `list(naturals())` would loop forever. Slicing syntax (`naturals()[:5]`) does not work on generators — that is what islice is for.',
    hints: [
      'while True keeps yielding forever — safe only because it is lazy',
      'islice(gen, 5) takes a finite prefix; generators do not support [:5]',
    ],
    tags: ['generators', 'infinite', 'islice', 'itertools'],
    concepts: ['py-generator-yield'],
    tieredHints: {
      apiSignature: 'itertools.islice(iterable, stop) -> iterator',
      skeleton: `from itertools import ____

def naturals():
    n = 1
    ____ True:
        ____ n
        n ____ 1

____(____(____(____(), 5)))`,
    },
  },
  {
    id: 'py-gen-predict-state',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PY_GENERATORS,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: 'What does this code print?',
    code: `def running_total():
    total = 0
    for n in [10, 20, 30]:
        total += n
        yield total

print(list(running_total()))`,
    expectedOutput: `[10, 30, 60]`,
    explanation:
      'A generator preserves its local variables across yields. `total` survives between resumes, so it accumulates: after 10 it yields 10, after 20 it yields 30, after 30 it yields 60. This running-state behaviour is what makes generators natural for streaming aggregations.',
    hints: ['Local variables persist between yields — total is not reset.'],
    tags: ['generators', 'state', 'accumulation'],
    concepts: ['py-generator-yield'],
  },
  {
    id: 'py-gen-predict-exhaust',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PY_GENERATORS,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: 'What does this code print?',
    code: `nums = (n for n in range(4))
print(sum(nums))
print(sum(nums))`,
    expectedOutput: `6
0`,
    explanation:
      'A generator (here a generator expression) is single-use. The first sum() consumes all of 0+1+2+3 = 6 and exhausts it. The second sum() iterates an already-exhausted generator, which yields nothing, so it returns 0. To sum twice you would need a list, or a fresh generator each time.',
    hints: ['How many times can one generator be iterated?'],
    tags: ['generators', 'exhaustion', 'single-use'],
    concepts: ['py-generator-yield'],
  },
  {
    id: 'py-gen-predict-return',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PY_GENERATORS,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: 'What does this code print?',
    code: `def gen():
    yield 1
    return 99
    yield 2

g = gen()
print(next(g))
try:
    next(g)
except StopIteration as e:
    print(e.value)`,
    expectedOutput: `1
99`,
    explanation:
      'In a generator, `return value` stops iteration and attaches `value` to the StopIteration it raises (`e.value`). So the first next() yields 1; the second hits `return 99`, raising StopIteration whose .value is 99. The `yield 2` after the return is unreachable — a bare `return` (or end of function) sets .value to None.',
    hints: ['return inside a generator ends it — where does the returned value go?'],
    tags: ['generators', 'return', 'StopIteration'],
    concepts: ['py-generator-yield'],
  },

  // ===================== ADVANCED =====================
  {
    id: 'py-gen-yield-from',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.PY_GENERATORS,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: 'Write a generator `flatten(nested)` that takes a list of lists and yields every element in order. For each sublist, delegate the iteration to that sub-iterable directly using the generator-delegation statement (the two-word form of `yield`) instead of a manual inner `for` loop over each element. Print the flattened result as a list; for `[[1, 2], [3], [4, 5]]` expect `[1, 2, 3, 4, 5]`.',
    starterCode: `# flatten(nested): for each sublist, delegate iteration to it (the two-word yield form)
# then print the flattened result as a list
`,
    testCases: [
      {
        input: 'list(flatten([[1, 2], [3], [4, 5]]))',
        expectedOutput: '[1, 2, 3, 4, 5]',
        description: 'Delegation flattens one level',
      },
    ],
    solution: `def flatten(nested):
    for sub in nested:
        yield from sub

print(list(flatten([[1, 2], [3], [4, 5]])))`,
    explanation: '`yield from sub` delegates to `sub`: it yields every value `sub` produces, one by one, as if they were yielded directly here. It replaces the boilerplate `for x in sub: yield x` and also forwards `send()`/`throw()` and captures the sub-generator\'s return value — making it the building block for composing generators and coroutines.',
    hints: [
      'The two-word delegation form replaces `for x in sub: yield x`',
      'It yields everything the sub-iterable produces',
      'It also forwards send/throw and the sub-generator return value',
    ],
    tags: ['generators', 'yield-from', 'delegation'],
    concepts: ['py-generator-yield'],
    tieredHints: {
      apiSignature: 'yield from subiterable',
      skeleton: `def flatten(nested):
    ____ sub in ____:
        ____ ____ sub

____(____(____([[1, 2], [3], [4, 5]])))`,
    },
  },
  {
    id: 'py-gen-yield-from-predict',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.PY_GENERATORS,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: 'What does this code print?',
    code: `def inner():
    yield "a"
    yield "b"

def outer():
    yield "start"
    yield from inner()
    yield "end"

print(list(outer()))`,
    expectedOutput: `['start', 'a', 'b', 'end']`,
    explanation:
      '`yield from inner()` splices every value inner() yields into outer()\'s stream in place. So outer yields "start", then delegates to inner ("a", "b"), then resumes to yield "end" — giving the flat sequence in order.',
    hints: ['yield from interleaves the inner generator\'s values where it appears.'],
    tags: ['generators', 'yield-from', 'delegation'],
    concepts: ['py-generator-yield'],
  },
  {
    id: 'py-gen-send-coroutine',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.PY_GENERATORS,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: 'Generators can receive values, not just produce them. Write a coroutine `averager()` that loops forever, receiving a number sent into it each time and yielding the running average of everything received so far. After creating it, prime it (advance it to its first pause), then push in 10, 20, and 30, printing the average returned after each. Expected output: `10.0`, `15.0`, `20.0`.',
    starterCode: `# averager(): loop forever; receive each value sent in and yield the running average so far
# create it, prime it to the first pause, then push in 10, 20, 30 and print each returned average
`,
    testCases: [
      {
        input: 'send 10, 20, 30',
        expectedOutput: '10.0\n15.0\n20.0',
        description: 'Two-way communication via send()',
      },
    ],
    solution: `def averager():
    total = 0.0
    count = 0
    average = None
    while True:
        x = yield average
        total += x
        count += 1
        average = total / count

avg = averager()
next(avg)              # prime: run up to the first yield
print(avg.send(10))
print(avg.send(20))
print(avg.send(30))`,
    explanation: 'When used as an expression, `x = yield average` does two things at once: it yields `average` to the caller and then, on the next `send(value)`, resumes with `x` bound to that sent value. You must prime the coroutine first (`next()` or `.send(None)`) to advance it to the first yield before any value can be sent. send() both injects a value AND returns the next yielded value, enabling two-way communication.',
    hints: [
      'Receive with `x = yield <value>` — yield is used as an expression',
      'Prime with next() before the first send()',
      'send(v) resumes the generator with v and returns the next yield',
    ],
    tags: ['generators', 'coroutine', 'send', 'two-way'],
    concepts: ['py-generator-yield'],
    tieredHints: {
      apiSignature: 'generator.send(value)',
      skeleton: `def averager():
    total = 0.0
    count = 0
    average = None
    ____ True:
        x = ____ average
        total ____ x
        count ____ 1
        average = total ____ count

avg = ____()
____(____)
____(____.____(10))
____(____.____(20))
____(____.____(30))`,
    },
  },
  {
    id: 'py-gen-send-predict',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.PY_GENERATORS,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: 'What does this code print?',
    code: `def echo():
    while True:
        received = yield
        print("got", received)

e = echo()
next(e)
e.send("hi")
e.send("bye")`,
    expectedOutput: `got hi
got bye`,
    explanation:
      'next(e) primes the coroutine, running it up to `received = yield` where it pauses (yielding None, which is discarded). Each e.send(value) resumes execution with `received` bound to the sent value, prints "got <value>", loops back, and pauses at the yield again. Without the priming next(), the first send() would raise TypeError.',
    hints: ['Priming runs to the first yield; each send resumes with the sent value bound.'],
    tags: ['generators', 'coroutine', 'send', 'priming'],
    concepts: ['py-generator-yield'],
  },
];
