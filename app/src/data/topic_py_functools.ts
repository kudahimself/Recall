/**
 * Topic.PY_FUNCTOOLS — all question types for this topic.
 * Auto-consolidated by scripts/consolidate-by-topic.js from:
 *   pyFunctoolsCloze.ts (10), pyFunctoolsParsons.ts (10), pyFunctoolsPredictOutput.ts (10), pythonMasteryTier1Questions.ts (6)
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const py_functools_questions: Question[] = [
  {
      id: 'py-functools-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_FUNCTOOLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the modern (3.9+) decorator for unbounded memoization.',
      template: `from functools import ___

@___
def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)`,
      blanks: ['cache', 'cache'],
      solution:
        'from functools import cache\n\n@cache\ndef fib(n):\n    if n < 2:\n        return n\n    return fib(n - 1) + fib(n - 2)',
      explanation:
        '@cache (3.9+) is shorthand for @lru_cache(maxsize=None) — unbounded memoization. Apply without parens.',
      hints: ['Five letters; same as the noun.'],
      tags: ['functools', 'cache'],
      concepts: ['py-functools-cache-partial'],
    },
  {
      id: 'py-functools-cloze-2',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_FUNCTOOLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the kwarg that limits cache size on lru_cache.',
      template: `from functools import lru_cache

@lru_cache(___=128)
def slow(n):
    return n * 2`,
      blanks: ['maxsize'],
      solution: 'from functools import lru_cache\n\n@lru_cache(maxsize=128)\ndef slow(n):\n    return n * 2',
      explanation:
        'maxsize is the bound for least-recently-used eviction. Pass None for unbounded (or use @cache, the modern shortcut).',
      hints: ['Single word: "max" + "size".'],
      tags: ['functools', 'lru_cache', 'maxsize'],
      concepts: ['py-functools-cache-partial'],
    },
  {
      id: 'py-functools-cloze-3',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_FUNCTOOLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the functools tool that pre-binds arguments to a function.',
      template: `from functools import ___

square = ___(power, exp=2)`,
      blanks: ['partial', 'partial'],
      solution: 'from functools import partial\n\nsquare = partial(power, exp=2)',
      explanation:
        'partial returns a new callable with some arguments bound. Pass the function uncalled, then the args/kwargs to fix.',
      hints: ['Seven letters; the adjective for "incomplete".'],
      tags: ['functools', 'partial'],
      concepts: ['py-functools-cache-partial'],
    },
  {
      id: 'py-functools-cloze-4',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_FUNCTOOLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the functools tool for left-fold reductions.',
      template: `from functools import ___

product = ___(lambda a, b: a * b, [1, 2, 3, 4])`,
      blanks: ['reduce', 'reduce'],
      solution:
        'from functools import reduce\n\nproduct = reduce(lambda a, b: a * b, [1, 2, 3, 4])',
      explanation:
        'reduce(fn, iterable, initial) folds left-to-right. Argument order is FN FIRST, then iterable, then optional initializer. (Was a builtin in Python 2; moved to functools in 3.)',
      hints: ['Six letters; same word as the verb meaning "shrink".'],
      tags: ['functools', 'reduce'],
      concepts: ['py-functools-cache-partial'],
    },
  {
      id: 'py-functools-cloze-5',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_FUNCTOOLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the decorator that copies metadata from the wrapped function to the wrapper.',
      template: `from functools import ___

def trace(fn):
    @___(fn)
    def wrapper(*args, **kwargs):
        return fn(*args, **kwargs)
    return wrapper`,
      blanks: ['wraps', 'wraps'],
      solution:
        'from functools import wraps\n\ndef trace(fn):\n    @wraps(fn)\n    def wrapper(*args, **kwargs):\n        return fn(*args, **kwargs)\n    return wrapper',
      explanation:
        'wraps preserves __name__, __doc__, etc. Apply as @wraps(fn) — must be called with the wrapped function.',
      hints: ['Five letters; same as the verb meaning "covers around".'],
      tags: ['functools', 'wraps'],
      concepts: ['py-functools-cache-partial'],
    },
  {
      id: 'py-functools-cloze-6',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_FUNCTOOLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the decorator that derives all comparison ops from __eq__ + one ordering dunder.',
      template: `from functools import ___

@___
class Item:
    def __eq__(self, other): ...
    def __lt__(self, other): ...`,
      blanks: ['total_ordering', 'total_ordering'],
      solution:
        'from functools import total_ordering\n\n@total_ordering\nclass Item:\n    def __eq__(self, other): ...\n    def __lt__(self, other): ...',
      explanation:
        'total_ordering generates __le__/__gt__/__ge__ from __eq__ + (__lt__|__le__|__gt__|__ge__). Apply without parens.',
      hints: ['Snake-case: "total" + "_ordering".'],
      tags: ['functools', 'total_ordering'],
      concepts: ['py-functools-cache-partial'],
    },
  {
      id: 'py-functools-cloze-7',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_FUNCTOOLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the decorator that caches a property\'s value per instance after first access.',
      template: `from functools import ___

class Rect:
    @___
    def area(self):
        return self.w * self.h`,
      blanks: ['cached_property', 'cached_property'],
      solution:
        'from functools import cached_property\n\nclass Rect:\n    @cached_property\n    def area(self):\n        return self.w * self.h',
      explanation:
        'cached_property (3.8+) stores the computed value on the instance __dict__ — subsequent accesses are direct dict lookups. Plain @property recomputes each time.',
      hints: ['Snake-case: "cached" + "_property".'],
      tags: ['functools', 'cached_property'],
      concepts: ['py-functools-cache-partial'],
    },
  {
      id: 'py-functools-cloze-8',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_FUNCTOOLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the decorator for type-based generic functions (single-arg dispatch).',
      template: `from functools import ___

@___
def show(x):
    return f"any: {x}"`,
      blanks: ['singledispatch', 'singledispatch'],
      solution:
        'from functools import singledispatch\n\n@singledispatch\ndef show(x):\n    return f"any: {x}"',
      explanation:
        'singledispatch dispatches on the type of the FIRST argument. Register variants via @show.register with type-annotated parameters.',
      hints: ['Compound word: "single" + "dispatch".'],
      tags: ['functools', 'singledispatch'],
      concepts: ['py-functools-cache-partial'],
    },
  {
      id: 'py-functools-cloze-9',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_FUNCTOOLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the method that returns hit/miss/maxsize/currsize on an lru_cached function.',
      template: `@lru_cache
def f(n): return n

f(1); f(1)
print(f.___())`,
      blanks: ['cache_info'],
      solution: '@lru_cache\ndef f(n): return n\n\nf(1); f(1)\nprint(f.cache_info())',
      explanation:
        'cache_info() returns a named tuple with hits, misses, maxsize, currsize. Companion: cache_clear() to reset.',
      hints: ['Snake-case: "cache" + "_info".'],
      tags: ['functools', 'lru_cache', 'cache_info'],
      concepts: ['py-functools-cache-partial'],
    },
  {
      id: 'py-functools-cloze-10',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_FUNCTOOLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the variant of partial designed for use INSIDE classes.',
      template: `from functools import ___

class Cell:
    def set_state(self, state):
        self.state = state
    set_alive = ___(set_state, True)`,
      blanks: ['partialmethod', 'partialmethod'],
      solution:
        'from functools import partialmethod\n\nclass Cell:\n    def set_state(self, state):\n        self.state = state\n    set_alive = partialmethod(set_state, True)',
      explanation:
        'partialmethod is the class-aware variant of partial — correctly binds self when accessed on an instance. partial alone wouldn\'t treat self specially.',
      hints: ['Compound word: "partial" + "method".'],
      tags: ['functools', 'partialmethod'],
      concepts: ['py-functools-cache-partial'],
    },
  {
      id: 'py-functools-parsons-1',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_FUNCTOOLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Memoize a recursive Fibonacci function with @functools.cache (Python 3.9+).',
      correctOrder: [
        'from functools import cache',
        '',
        '@cache',
        'def fib(n):',
        '    if n < 2:',
        '        return n',
        '    return fib(n - 1) + fib(n - 2)',
      ],
      distractorLines: [
        '@cache()',
        'cache(fib)',
      ],
      solution:
        'from functools import cache\n\n@cache\ndef fib(n):\n    if n < 2:\n        return n\n    return fib(n - 1) + fib(n - 2)',
      explanation:
        '@cache (3.9+) is the unbounded memoizer — sugar for @lru_cache(maxsize=None). Apply WITHOUT parens. @cache() with empty parens raises TypeError (cache isn\'t a factory in the same way).',
      hints: ['No parens — @cache, not @cache().'],
      tags: ['functools', 'cache'],
      concepts: ['py-functools-cache-partial'],
    },
  {
      id: 'py-functools-parsons-2',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_FUNCTOOLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Use functools.partial to pre-bind the first arg of greet.',
      correctOrder: [
        'from functools import partial',
        '',
        'def greet(greeting, name):',
        '    return f"{greeting}, {name}!"',
        '',
        'hi = partial(greet, "Hi")',
        'print(hi("Alice"))',
      ],
      distractorLines: [
        'hi = partial(greet("Hi"))',
        'hi = greet.partial("Hi")',
      ],
      solution:
        'from functools import partial\n\ndef greet(greeting, name):\n    return f"{greeting}, {name}!"\n\nhi = partial(greet, "Hi")\nprint(hi("Alice"))',
      explanation:
        'partial(fn, *args, **kwargs) returns a new callable with those args pre-bound. Pass the function UNCALLED. partial(greet("Hi")) calls greet first — TypeError because greet expects two args.',
      hints: ['Pass the function uncalled, then the args to fix.'],
      tags: ['functools', 'partial'],
      concepts: ['py-functools-cache-partial'],
    },
  {
      id: 'py-functools-parsons-3',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_FUNCTOOLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Use functools.reduce to compute the product of [1, 2, 3, 4] starting from 1.',
      correctOrder: [
        'from functools import reduce',
        '',
        'result = reduce(lambda a, b: a * b, [1, 2, 3, 4], 1)',
        'print(result)',
      ],
      distractorLines: [
        'result = reduce(lambda a, b: a * b, [1, 2, 3, 4])',
        'result = reduce([1, 2, 3, 4], lambda a, b: a * b)',
      ],
      solution:
        'from functools import reduce\n\nresult = reduce(lambda a, b: a * b, [1, 2, 3, 4], 1)\nprint(result)',
      explanation:
        'reduce(fn, iterable, initial) folds the function across the iterable. The initializer arg is optional but recommended — reduces TypeError risk on empty inputs. Argument order is (fn, iterable, initial), not (iterable, fn).',
      hints: ['reduce(fn, iterable, initial). Function FIRST.'],
      tags: ['functools', 'reduce'],
      concepts: ['py-functools-cache-partial'],
    },
  {
      id: 'py-functools-parsons-4',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_FUNCTOOLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Preserve a wrapped function\'s metadata using @functools.wraps inside a decorator.',
      correctOrder: [
        'from functools import wraps',
        '',
        'def trace(fn):',
        '    @wraps(fn)',
        '    def wrapper(*args, **kwargs):',
        '        return fn(*args, **kwargs)',
        '    return wrapper',
      ],
      distractorLines: [
        '    @wraps',
        '    @wraps()',
      ],
      solution:
        'from functools import wraps\n\ndef trace(fn):\n    @wraps(fn)\n    def wrapper(*args, **kwargs):\n        return fn(*args, **kwargs)\n    return wrapper',
      explanation:
        'wraps is a decorator FACTORY — must be CALLED with the wrapped function. @wraps without parens or @wraps() without args fails to copy metadata. Without wraps, decorated functions show wrapper as their __name__ and lose docstrings.',
      hints: ['@wraps(fn) — must be called with fn.'],
      tags: ['functools', 'wraps'],
      concepts: ['py-functools-cache-partial'],
    },
  {
      id: 'py-functools-parsons-5',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_FUNCTOOLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Use @total_ordering to derive all comparison ops from __eq__ and __lt__.',
      correctOrder: [
        'from functools import total_ordering',
        '',
        '@total_ordering',
        'class Item:',
        '    def __init__(self, p):',
        '        self.p = p',
        '    def __eq__(self, other):',
        '        return self.p == other.p',
        '    def __lt__(self, other):',
        '        return self.p < other.p',
      ],
      distractorLines: [
        '@total_ordering()',
        '    def __cmp__(self, other):',
      ],
      solution:
        'from functools import total_ordering\n\n@total_ordering\nclass Item:\n    def __init__(self, p):\n        self.p = p\n    def __eq__(self, other):\n        return self.p == other.p\n    def __lt__(self, other):\n        return self.p < other.p',
      explanation:
        '@total_ordering generates __le__, __gt__, __ge__ from __eq__ + (one of __lt__/__le__/__gt__/__ge__). Apply WITHOUT parens. Saves boilerplate when you only care about ordering by one field.',
      hints: ['No parens; supply __eq__ + ONE of the comparison dunders.'],
      tags: ['functools', 'total_ordering'],
      concepts: ['py-functools-cache-partial'],
    },
  {
      id: 'py-functools-parsons-6',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_FUNCTOOLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Use @cached_property to compute area only once per instance.',
      correctOrder: [
        'from functools import cached_property',
        '',
        'class Rect:',
        '    def __init__(self, w, h):',
        '        self.w = w',
        '        self.h = h',
        '    @cached_property',
        '    def area(self):',
        '        return self.w * self.h',
      ],
      distractorLines: [
        '    @property',
        '    @cache',
      ],
      solution:
        'from functools import cached_property\n\nclass Rect:\n    def __init__(self, w, h):\n        self.w = w\n        self.h = h\n    @cached_property\n    def area(self):\n        return self.w * self.h',
      explanation:
        'cached_property (3.8+) computes the value on first access, then STORES IT in the instance __dict__ — subsequent accesses skip the method entirely. Plain @property recomputes every time. Stacking @property + @cache doesn\'t work right with self.',
      hints: ['cached_property = compute once per instance, store on instance.'],
      tags: ['functools', 'cached_property'],
      concepts: ['py-functools-cache-partial'],
    },
  {
      id: 'py-functools-parsons-7',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_FUNCTOOLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Use @singledispatch to write a generic function with type-specific implementations.',
      correctOrder: [
        'from functools import singledispatch',
        '',
        '@singledispatch',
        'def show(x):',
        '    print(f"unknown: {x}")',
        '',
        '@show.register',
        'def _(x: int):',
        '    print(f"int: {x}")',
        '',
        '@show.register',
        'def _(x: str):',
        '    print(f"str: {x}")',
      ],
      distractorLines: [
        '@show.register(int)',
        '@show(int)',
      ],
      solution:
        'from functools import singledispatch\n\n@singledispatch\ndef show(x):\n    print(f"unknown: {x}")\n\n@show.register\ndef _(x: int):\n    print(f"int: {x}")\n\n@show.register\ndef _(x: str):\n    print(f"str: {x}")',
      explanation:
        'singledispatch is single-arg type dispatch (Lisp-style generic functions). The base function is the fallback. Register variants via @show.register and use type ANNOTATIONS to declare which type each variant handles. The function name `_` is convention for "registered, not called directly".',
      hints: ['@show.register reads the type from the parameter annotation.'],
      tags: ['functools', 'singledispatch'],
      concepts: ['py-functools-cache-partial'],
    },
  {
      id: 'py-functools-parsons-8',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_FUNCTOOLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Use lru_cache with maxsize=128 for bounded memoization.',
      correctOrder: [
        'from functools import lru_cache',
        '',
        '@lru_cache(maxsize=128)',
        'def slow_add(a, b):',
        '    return a + b',
      ],
      distractorLines: [
        '@lru_cache',
        '@lru_cache(128)',
      ],
      solution:
        'from functools import lru_cache\n\n@lru_cache(maxsize=128)\ndef slow_add(a, b):\n    return a + b',
      explanation:
        'lru_cache(maxsize=N) keeps the N most-recently-used results, evicting LRU on overflow. maxsize must be a kwarg or use the decorator-without-args form (3.8+) `@lru_cache`. Bare `@lru_cache(128)` is positional and works in 3.8+, but the kwarg form is more explicit.',
      hints: ['maxsize as a kwarg; explicit > positional.'],
      tags: ['functools', 'lru_cache'],
      concepts: ['py-functools-cache-partial'],
    },
  {
      id: 'py-functools-parsons-9',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_FUNCTOOLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Inspect cache statistics on an lru_cached function via .cache_info().',
      correctOrder: [
        'from functools import lru_cache',
        '',
        '@lru_cache(maxsize=None)',
        'def square(n):',
        '    return n * n',
        '',
        'square(2); square(2); square(3)',
        'print(square.cache_info())',
      ],
      distractorLines: [
        'print(lru_cache.info())',
        'print(square.info())',
      ],
      solution:
        'from functools import lru_cache\n\n@lru_cache(maxsize=None)\ndef square(n):\n    return n * n\n\nsquare(2); square(2); square(3)\nprint(square.cache_info())',
      explanation:
        'lru_cached functions get a .cache_info() method returning hits/misses/maxsize/currsize as a named tuple. Useful for profiling cache effectiveness. Also .cache_clear() to reset.',
      hints: ['cache_info is a method on the decorated function.'],
      tags: ['functools', 'lru_cache', 'cache_info'],
      concepts: ['py-functools-cache-partial'],
    },
  {
      id: 'py-functools-parsons-10',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_FUNCTOOLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Use functools.partialmethod inside a class to bind self-aware partial methods.',
      correctOrder: [
        'from functools import partialmethod',
        '',
        'class Cell:',
        '    def set_state(self, state):',
        '        self.state = state',
        '    set_alive = partialmethod(set_state, True)',
        '    set_dead = partialmethod(set_state, False)',
      ],
      distractorLines: [
        '    set_alive = partial(set_state, True)',
        '    set_alive = lambda self: self.set_state(True)',
      ],
      solution:
        'from functools import partialmethod\n\nclass Cell:\n    def set_state(self, state):\n        self.state = state\n    set_alive = partialmethod(set_state, True)\n    set_dead = partialmethod(set_state, False)',
      explanation:
        'partialmethod is the class-aware variant of partial — it correctly binds self when accessed on an instance. partial alone wouldn\'t treat self specially. The lambda alternative works but is less idiomatic.',
      hints: ['partialmethod for inside classes; partial is for free functions.'],
      tags: ['functools', 'partialmethod'],
      concepts: ['py-functools-cache-partial'],
    },
  {
      id: 'py-functools-predict-1',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_FUNCTOOLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `from functools import reduce
print(reduce(lambda a, b: a + b, [1, 2, 3, 4]))`,
      expectedOutput: `10`,
      explanation:
        'reduce folds the function across the iterable: ((1+2)+3)+4 = 10. Without an initializer, the first two elements seed the fold.',
      hints: ['Cumulative left fold.'],
      tags: ['functools', 'reduce'],
      concepts: ['py-functools-cache-partial'],
    },
  {
      id: 'py-functools-predict-2',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_FUNCTOOLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `from functools import partial
def f(a, b, c):
    return f"{a}-{b}-{c}"
g = partial(f, 1, c=3)
print(g(2))`,
      expectedOutput: `1-2-3`,
      explanation:
        'partial pre-binds positional and keyword args. partial(f, 1, c=3) fixes a=1 and c=3. Calling g(2) supplies b=2. Result: f(1, 2, c=3) = "1-2-3".',
      hints: ['partial mixes positional and keyword pre-binding.'],
      tags: ['functools', 'partial'],
      concepts: ['py-functools-cache-partial'],
    },
  {
      id: 'py-functools-predict-3',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_FUNCTOOLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `from functools import lru_cache

@lru_cache(maxsize=None)
def square(n):
    print(f"computing {n}")
    return n * n

square(3)
square(3)
square(4)`,
      expectedOutput: `computing 3
computing 4`,
      explanation:
        'First call to square(3) misses the cache: prints "computing 3" and caches. Second call hits: no print. square(4) misses: prints "computing 4". The print is the side effect that reveals cache misses.',
      hints: ['Same args → cache hit (no recomputation).'],
      tags: ['functools', 'lru_cache'],
      concepts: ['py-functools-cache-partial'],
    },
  {
      id: 'py-functools-predict-4',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_FUNCTOOLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `from functools import wraps

def trace(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        return fn(*args, **kwargs)
    return wrapper

@trace
def add(a, b):
    """Add two numbers."""
    return a + b

print(add.__name__)
print(add.__doc__)`,
      expectedOutput: `add
Add two numbers.`,
      explanation:
        '@wraps(fn) copies __name__, __doc__, and other metadata from fn onto the wrapper. Without it, __name__ would be "wrapper" and __doc__ would be None.',
      hints: ['wraps copies metadata from the wrapped function.'],
      tags: ['functools', 'wraps'],
      concepts: ['py-functools-cache-partial'],
    },
  {
      id: 'py-functools-predict-5',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_FUNCTOOLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `from functools import reduce
print(reduce(lambda a, b: a + b, [], 0))`,
      expectedOutput: `0`,
      explanation:
        'With an empty iterable AND an initializer, reduce returns the initializer. Without an initializer, reduce on an empty iterable raises TypeError. Always supply the initializer for safety.',
      hints: ['Empty iterable + initializer = initializer.'],
      tags: ['functools', 'reduce', 'empty'],
      concepts: ['py-functools-cache-partial'],
    },
  {
      id: 'py-functools-predict-6',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_FUNCTOOLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `from functools import cached_property

class Rect:
    def __init__(self, w, h):
        self.w = w
        self.h = h
    @cached_property
    def area(self):
        print("computing area")
        return self.w * self.h

r = Rect(3, 4)
r.area
r.area
print(r.area)`,
      expectedOutput: `computing area
12`,
      explanation:
        'cached_property computes once on first access (prints "computing area"), then stores the result on the instance. Subsequent accesses skip the method entirely. So "computing area" prints just ONCE, and the third access just prints 12.',
      hints: ['cached_property runs ONCE per instance, then the value is cached on it.'],
      tags: ['functools', 'cached_property'],
      concepts: ['py-functools-cache-partial'],
    },
  {
      id: 'py-functools-predict-7',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_FUNCTOOLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `from functools import lru_cache

@lru_cache(maxsize=None)
def f(n):
    return n * 2

f(1); f(2); f(1); f(3)
info = f.cache_info()
print(info.hits, info.misses)`,
      expectedOutput: `1 3`,
      explanation:
        'cache_info returns a named tuple (hits, misses, maxsize, currsize). f(1) and f(2) and f(3) are misses (3 total). The repeated f(1) is a hit (1). So hits=1, misses=3.',
      hints: ['First call to each unique arg = miss; repeats = hits.'],
      tags: ['functools', 'lru_cache', 'cache_info'],
      concepts: ['py-functools-cache-partial'],
    },
  {
      id: 'py-functools-predict-8',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_FUNCTOOLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `from functools import partial
int_base16 = partial(int, base=16)
print(int_base16("ff"))`,
      expectedOutput: `255`,
      explanation:
        'partial(int, base=16) creates a "parse hex string" function. Calling it with "ff" passes the string as the first arg to int — equivalent to int("ff", base=16) = 255.',
      hints: ['partial pre-binds the base kwarg of int.'],
      tags: ['functools', 'partial', 'int'],
      concepts: ['py-functools-cache-partial'],
    },
  {
      id: 'py-functools-predict-9',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_FUNCTOOLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `from functools import singledispatch

@singledispatch
def show(x):
    return f"any: {x}"

@show.register
def _(x: int):
    return f"int: {x}"

print(show(42))
print(show("x"))`,
      expectedOutput: `int: 42
any: x`,
      explanation:
        'singledispatch picks the variant matching the FIRST argument\'s type. show(42) matches the int branch. show("x") falls back to the base function (no str-specific variant).',
      hints: ['Specific type wins; base function is the fallback.'],
      tags: ['functools', 'singledispatch'],
      concepts: ['py-functools-cache-partial'],
    },
  {
      id: 'py-functools-predict-10',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_FUNCTOOLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `from functools import reduce
print(reduce(lambda a, b: a + [b * 2], [1, 2, 3], []))`,
      expectedOutput: `[2, 4, 6]`,
      explanation:
        'reduce builds up a new list by appending b*2 each step. Initial [], then [2], then [2, 4], then [2, 4, 6]. (This is just a verbose comprehension — `[b*2 for b in [1,2,3]]` is cleaner — but illustrates reduce flow.)',
      hints: ['Reduce can build a list step by step using concatenation.'],
      tags: ['functools', 'reduce'],
      concepts: ['py-functools-cache-partial'],
    },
  {
      id: 'py-functools-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_FUNCTOOLS,
      course: Course.BACKEND,
      question: 'What does `@functools.lru_cache(maxsize=128)` do when applied to a function?',
      options: [
        { id: 'a', text: 'Speeds up every function call by running it on multiple threads', isCorrect: false },
        { id: 'b', text: 'Memoises calls by positional and keyword args — subsequent calls with the same args return the cached result without re-executing the body. `maxsize` bounds the cache with LRU eviction.', isCorrect: true },
        { id: 'c', text: 'Persists results to disk across program runs', isCorrect: false },
        { id: 'd', text: 'Prevents the function from being called more than 128 times ever', isCorrect: false },
      ],
      explanation: 'LRU (least-recently-used) cache keeps up to `maxsize` distinct (args, kwargs) → result entries. Args must be hashable. Best for pure functions with repeated calls on the same inputs. `maxsize=None` is unbounded (memory risk). In 3.9+ there is a simpler `@functools.cache` which is just `lru_cache(maxsize=None)`.',
      hints: [
        'Cache is keyed by (args, kwargs) — args must be hashable',
        'Only use on pure functions (no side effects, same inputs → same outputs)',
        '`@cache` (3.9+) is `lru_cache(maxsize=None)`',
      ],
      tags: ['functools', 'lru_cache', 'memoisation'],
      concepts: ['py-functools-cache-partial'],
    },
  {
      id: 'py-functools-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_FUNCTOOLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write a recursive Fibonacci function `fib(n)` — base cases `fib(0) == 0`, `fib(1) == 1`, otherwise the sum of the two prior terms — and apply the `functools` decorator that memoises by (args, kwargs) so repeated calls with the same inputs skip recomputation. Print `fib(30)` (expect `832040`). With memoisation this is near-instant; without, it would do ~2^30 calls.',
      starterCode: `import functools
  `,
      testCases: [
        {
          input: 'fib(30) with lru_cache',
          expectedOutput: '832040',
          description: 'Memoised recursion is fast',
        },
      ],
      solution: `import functools

@functools.lru_cache
def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)

print(fib(30))`,
      explanation: 'Each `fib(k)` is computed once; all other calls hit the cache. Goes from exponential to linear time. For a cleaner spelling on 3.9+: `@functools.cache` (no maxsize). Never use lru_cache on instance methods directly — cached `self` keeps instances alive forever; use `functools.cached_property` for per-instance caching.',
      tieredHints: {
        apiSignature: 'functools.lru_cache(maxsize=128, typed=False)',
        skeleton: `import functools

@functools.____
def ____(n):
    if ____:
        return n
    return ____(____) + ____(____)

print(____(30))`,
      },
      hints: [
        '@functools.lru_cache (no args) is fine — default maxsize is 128',
        'Base case: n < 2 returns n',
        'Recursive step: fib(n-1) + fib(n-2)',
      ],
      tags: ['functools', 'lru_cache', 'fibonacci', 'recursion'],
      concepts: ['py-functools-cache-partial'],
    },
  {
      id: 'py-functools-3',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_FUNCTOOLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Define `log_base(base, x)` that returns `math.log(x, base)`. Using the `functools` helper that pre-binds arguments to a callable, build two specialised helpers — `log10` with `base` pre-bound to 10, and `log2` with `base` pre-bound to 2. Print `log10(1000)` rounded to 1 decimal (expect `3.0`) and `log2(8)` rounded to 1 decimal (expect `3.0`).',
      starterCode: `import math
import functools
`,
      testCases: [
        {
          input: 'partial application',
          expectedOutput: '3.0\n3.0',
          description: 'partial fixes the first positional argument',
        },
      ],
      solution: `import math
import functools

def log_base(base, x):
    return math.log(x, base)

log10 = functools.partial(log_base, 10)
log2 = functools.partial(log_base, 2)

print(round(log10(1000), 1))
print(round(log2(8), 1))`,
      explanation: 'partial(fn, *args, **kwargs) returns a new callable with those arguments pre-applied. Great for plugging into APIs that take callbacks (e.g. `map(partial(json.loads, parse_float=Decimal), rows)`), for currying-style helpers, and for turning a 2-arg function into a 1-arg one without writing a lambda.',
      tieredHints: {
        apiSignature: 'functools.partial(func, /, *args, **keywords)',
        skeleton: `import math
import functools

def log_base(base, x):
    return ____(____, ____)

log10 = functools.____(____, ____)
log2 = functools.____(____, ____)

print(____(log10(1000), 1))
print(____(log2(8), 1))`,
      },
      hints: [
        'functools.partial(fn, fixed_arg) → new callable that only needs the remaining args',
        'You can bind by keyword too: partial(fn, base=2)',
        'Equivalent to `lambda x: fn(fixed, x)` but picklable and with a nicer repr',
      ],
      tags: ['functools', 'partial', 'currying'],
      concepts: ['py-functools-cache-partial'],
    },
  {
      id: 'py-functools-4',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_FUNCTOOLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write a decorator `log_calls` that, before forwarding to the wrapped function, prints `"calling "` followed by the wrapped function\'s `__name__`. The inner wrapper MUST use the `functools` helper that copies the original function\'s metadata (name, docstring, etc.) onto the wrapper so introspection still sees the original identity. Apply `log_calls` to `def add(a, b)` (with docstring `"sum two numbers"`, returning `a + b`). Print `add.__name__` (expect `add`) and `add(2, 3)` (expect `5`).',
      starterCode: `import functools
  `,
      testCases: [
        {
          input: 'decorator preserving metadata',
          expectedOutput: 'add\ncalling add\n5',
          description: '@wraps keeps __name__ and __doc__',
        },
      ],
      solution: `import functools

def log_calls(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        print(f"calling {func.__name__}")
        return func(*args, **kwargs)
    return wrapper

@log_calls
def add(a, b):
    """sum two numbers"""
    return a + b

print(add.__name__)
print(add(2, 3))`,
      explanation: 'Without `@wraps`, the decorated function takes on the wrapper\'s identity — `add.__name__` would be `"wrapper"`, `help(add)` would be confusing, Sphinx docs would break. `functools.wraps(func)` copies `__name__`, `__doc__`, `__qualname__`, `__module__`, `__dict__`, `__wrapped__` onto the wrapper. Always use it in decorators that wrap a function.',
      tieredHints: {
        apiSignature: 'functools.wraps(wrapped, assigned=WRAPPER_ASSIGNMENTS, updated=WRAPPER_UPDATES)',
        skeleton: `import functools

def log_calls(func):
    @functools.____(____)
    def ____(*args, **kwargs):
        print(____)
        return ____(*args, **kwargs)
    return ____

@____
def add(a, b):
    """sum two numbers"""
    return a + b

print(____.__name__)
print(____(2, 3))`,
      },
      hints: [
        '@functools.wraps(func) on the inner wrapper',
        'Copies __name__, __doc__, __qualname__, __wrapped__',
        'Without it, introspection tools see the wrapper, not the original',
      ],
      tags: ['functools', 'wraps', 'decorators', 'introspection'],
      concepts: ['py-functools-cache-partial', 'py-decorator-application'],
    },
  {
      id: 'py-functools-5',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_FUNCTOOLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Given `nums = [1, 2, 3, 4, 5]`, compute the product of the list by folding a binary operation over it, using `functools.reduce`. First use the `operator` module\'s multiplication function as the binary op — assign to `result` and print (expect `120`). Then do the same thing again with an inline lambda doing `a * b` — assign to `result2` and print (expect `120`).',
      starterCode: `from functools import reduce
import operator
`,
      testCases: [
        {
          input: 'reduce to compute product',
          expectedOutput: '120\n120',
          description: 'reduce folds the list with a binary op',
        },
      ],
      solution: `from functools import reduce
import operator

nums = [1, 2, 3, 4, 5]
result = reduce(operator.mul, nums)
print(result)

result2 = reduce(lambda a, b: a * b, nums)
print(result2)`,
      explanation: 'reduce(fn, iterable, [initial]) folds a binary function over the iterable, accumulating a single value. Use `operator.mul` / `operator.add` instead of a lambda when you can — it is slightly faster and reads more clearly. Note: for sum use `sum()`; for product on 3.8+ use `math.prod()` which is clearer than `reduce`.',
      tieredHints: {
        apiSignature: 'functools.reduce(function, iterable, initial=...)',
        skeleton: `from functools import reduce
import operator

nums = [1, 2, 3, 4, 5]
result = ____
print(____)

result2 = ____
print(____)`,
      },
      hints: [
        'reduce is from functools, mul is from operator',
        'reduce(fn, iterable) without initial uses the first element as the seed',
        'For clarity, `math.prod(nums)` (3.8+) beats reduce for product specifically',
      ],
      tags: ['functools', 'reduce', 'operator', 'fold'],
      concepts: ['py-functools-cache-partial'],
    },
  {
      id: 'py-functools-6',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_FUNCTOOLS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Define a `Circle` class whose constructor takes a `radius`. Expose two attribute-style properties — `area` (`math.pi * radius ** 2`) and `circumference` (`2 * math.pi * radius`) — using the `functools` decorator that computes on first access and caches the result in the instance (so repeat reads skip the math). Build `c = Circle(5)` and print `round(c.area, 2)` (expect `78.54`) and `round(c.circumference, 2)` (expect `31.42`). Access them as attributes, not method calls.',
      starterCode: `import math
import functools
`,
      testCases: [
        {
          input: 'cached_property on Circle',
          expectedOutput: '78.54\n31.42',
          description: 'Access as attribute, not method; cached after first read',
        },
      ],
      solution: `import math
import functools

class Circle:
    def __init__(self, radius):
        self.radius = radius

    @functools.cached_property
    def area(self):
        return math.pi * self.radius ** 2

    @functools.cached_property
    def circumference(self):
        return 2 * math.pi * self.radius

c = Circle(5)
print(round(c.area, 2))
print(round(c.circumference, 2))`,
      explanation: '`cached_property` turns a method into a read-only attribute whose value is computed on first access and stored in the instance `__dict__`. Subsequent accesses skip the computation. Unlike `@property`, there is no setter and no per-instance cache invalidation — if `self.radius` changes, `area` will NOT update. Use it only when inputs are immutable or you explicitly `del instance.area` to invalidate.',
      tieredHints: {
        apiSignature: 'functools.cached_property(func)',
        skeleton: `import math
import functools

class Circle:
    def __init__(self, radius):
        self.radius = radius

    @functools.____
    def area(self):
        return ____

    @functools.____
    def circumference(self):
        return ____

c = Circle(5)
print(____(c.____, 2))
print(____(c.____, 2))`,
      },
      hints: [
        '@functools.cached_property turns a method into a cached attribute',
        'Access with `c.area` (no parentheses) — NOT `c.area()`',
        'Invalidate by `del c.area` if inputs change',
      ],
      tags: ['functools', 'cached_property', 'lazy', 'classes'],
      concepts: ['py-functools-cache-partial', 'py-class-instance-distinction'],
    },
];
