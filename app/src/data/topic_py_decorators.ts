/**
 * Topic.PY_DECORATORS — all question types for this topic.
 * Auto-consolidated by scripts/consolidate-by-topic.js from:
 *   backendGapQuestions.ts (4), backendQuestions.ts (2), pyBeginnerIntroQuestions.ts (3), pyDecoratorsCloze.ts (10), pyDecoratorsParsons.ts (10), pyDecoratorsPredictOutput.ts (10), pythonAdvOopQuestions.ts (3), pythonGapFillQuestions.ts (2)
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const py_decorators_questions: Question[] = [
  {
      id: 'py-dec-3',
      type: QuestionType.CODING,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_DECORATORS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write a decorator "cache" (simple memoization) that caches function results based on arguments. Use a dictionary to store results.',
      starterCode: `def cache(func):\n`,
      testCases: [{ input: 'expensive function', expectedOutput: 'decorator with dict cache keyed by args', description: 'Should cache function results' }],
      solution: `def cache(func):\n    memo = {}\n    def wrapper(*args):\n        if args not in memo:\n            memo[args] = func(*args)\n        return memo[args]\n    return wrapper`,
      explanation: 'This is manual memoization. The memo dict stores args → result. On subsequent calls with the same args, the cached result is returned instantly. Python has a built-in: @functools.lru_cache(maxsize=128) does this automatically with LRU eviction.',
      hints: ['Use dict with args tuple as key', 'Check if args in memo before calling', '@functools.lru_cache is the built-in version'],
      tags: ['decorator', 'cache', 'memoization', 'python'],
      concepts: ['py-decorator-application'],
    },
  {
      id: 'py-dec-4',
      type: QuestionType.CODING,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_DECORATORS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write a decorator "validate_types" that takes expected types as arguments and validates function arguments at runtime. Usage: @validate_types(int, int) on an add function.',
      starterCode: `def validate_types(*types):\n`,
      testCases: [{ input: 'type validation', expectedOutput: 'decorator factory with *types and isinstance checks', description: 'Should validate argument types' }],
      solution: `def validate_types(*types):\n    def decorator(func):\n        def wrapper(*args):\n            for arg, expected in zip(args, types):\n                if not isinstance(arg, expected):\n                    raise TypeError(f"Expected {expected.__name__}, got {type(arg).__name__}")\n            return func(*args)\n        return wrapper\n    return decorator\n\n@validate_types(int, int)\ndef add(a, b):\n    return a + b`,
      explanation: 'This is a decorator factory — a function that returns a decorator. Three levels: validate_types(types) → decorator(func) → wrapper(args). zip pairs each arg with its expected type. isinstance() checks the type.',
      hints: ['Three nested functions: factory → decorator → wrapper', 'zip(args, types) pairs them up', 'isinstance(value, type) for checking'],
      tags: ['decorator', 'factory', 'validation', 'python'],
      concepts: ['py-decorator-application'],
    },
  {
      id: 'py-dec-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_DECORATORS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write a decorator "timer" that prints how long a function takes to execute. Use time.time() to measure elapsed time.',
      starterCode: `import time\n\ndef timer(func):\n`,
      testCases: [
        {
          input: 'any function',
          expectedOutput: 'decorator with wrapper that measures time',
          description: 'Should create timing decorator',
        },
      ],
      solution: `import time\n\ndef timer(func):\n    def wrapper(*args, **kwargs):\n        start = time.time()\n        result = func(*args, **kwargs)\n        elapsed = time.time() - start\n        print(f"{func.__name__} took {elapsed:.4f}s")\n        return result\n    return wrapper`,
      explanation: 'A decorator wraps a function with extra behaviour. timer(func) returns wrapper, which calls the original func and adds timing. Usage: @timer above a function definition. *args/**kwargs pass through any arguments.',
      hints: ['Decorator takes func, returns wrapper', 'wrapper calls func(*args, **kwargs)', '@decorator is syntactic sugar for func = decorator(func)'],
      tags: ['decorator', 'timer', 'pattern', 'python'],
      concepts: ['py-decorator-application'],
    },
  {
      id: 'py-dec-beg-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DECORATORS,
      course: Course.BACKEND,
      question: 'What does the `@decorator_name` syntax above a function definition do?',
      options: [
        { id: 'a', text: 'It wraps the function — Python rewrites `@decorator_name\\ndef foo(): ...` into `foo = decorator_name(foo)`.', isCorrect: true },
        { id: 'b', text: 'It comments the function out so it does not run.', isCorrect: false },
        { id: 'c', text: 'It marks the function as private to its module.', isCorrect: false },
        { id: 'd', text: 'It is a type-hint annotation.', isCorrect: false },
      ],
      explanation: '`@decorator_name` is syntactic sugar. Writing `@log` before `def foo(): ...` is exactly equivalent to writing `def foo(): ...` and then `foo = log(foo)`. The decorator is a function that takes a function and returns a (usually wrapped) function.',
      tags: ['decorator', 'syntax-sugar', 'beginner', 'python'],
      concepts: ['py-decorator-application'],
    },
  {
      id: 'py-dec-beg-3',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DECORATORS,
      course: Course.BACKEND,
      question: 'Why use a decorator instead of just calling the wrapping function inline (e.g. `result = log(do_work())`)?',
      options: [
        { id: 'a', text: 'A decorator attaches the wrapping behaviour to the function definition, so every caller automatically gets it without remembering to wrap.', isCorrect: true },
        { id: 'b', text: 'Decorators are required by Python syntax — without one, your function will not run.', isCorrect: false },
        { id: 'c', text: 'Decorators always make code run faster than calling the function directly.', isCorrect: false },
        { id: 'd', text: 'Decorators prevent the wrapped function from being called at all.', isCorrect: false },
      ],
      explanation: 'Decorators centralise cross-cutting concerns (logging, timing, auth, caching) at the definition site. Once `@log` is on `do_work`, every caller is logged automatically — there is no risk of one caller forgetting to wrap. That is the whole point.',
      tags: ['decorator', 'cross-cutting', 'beginner', 'python'],
      concepts: ['py-decorator-application'],
    },
  {
      id: 'py-decorators-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_DECORATORS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the symbol that applies a decorator and the keyword that returns the wrapper from log.',
      template: `def log(fn):
    def wrapper(*args, **kwargs):
        return fn(*args, **kwargs)
    ___ wrapper

___log
def greet():
    print("hi")`,
      blanks: ['return', '@'],
      solution:
        'def log(fn):\n    def wrapper(*args, **kwargs):\n        return fn(*args, **kwargs)\n    return wrapper\n\n@log\ndef greet():\n    print("hi")',
      explanation:
        'A decorator function returns the wrapper function (not calls it). The @ symbol applies the decorator at definition time — equivalent to greet = log(greet) after the def.',
      hints: ['One keyword sends the wrapper out; one symbol applies the decorator.'],
      tags: ['decorators', 'syntax'],
      concepts: ['py-decorator-application'],
    },
  {
      id: 'py-decorators-cloze-2',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DECORATORS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the import and the decorator that preserves the wrapped function\'s metadata.',
      template: `from functools import ___

def log(fn):
    @___(fn)
    def wrapper(*args, **kwargs):
        return fn(*args, **kwargs)
    return wrapper`,
      blanks: ['wraps', 'wraps'],
      solution:
        'from functools import wraps\n\ndef log(fn):\n    @wraps(fn)\n    def wrapper(*args, **kwargs):\n        return fn(*args, **kwargs)\n    return wrapper',
      explanation:
        'functools.wraps is itself a decorator factory. Applied as @wraps(fn), it copies fn\'s __name__, __doc__, and __wrapped__ onto wrapper so introspection still shows the original metadata.',
      hints: ['Same name, used twice: imported, then applied as a parameterized decorator.'],
      tags: ['decorators', 'wraps', 'metadata'],
      concepts: ['py-decorator-application'],
    },
  {
      id: 'py-decorators-cloze-3',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_DECORATORS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the wrapper signature so the decorator accepts any positional and keyword arguments.',
      template: `def log(fn):
      def wrapper(___, ___):
          return fn(*args, **kwargs)
      return wrapper`,
      blanks: ['*args', '**kwargs'],
      solution:
        'def log(fn):\n    def wrapper(*args, **kwargs):\n        return fn(*args, **kwargs)\n    return wrapper',
      explanation:
        '*args captures all positional arguments into a tuple; **kwargs captures all keyword arguments into a dict. Together they let the wrapper forward calls of any signature without hardcoding parameter names.',
      hints: ['One asterisk for positional, two for keyword arguments.'],
      tags: ['decorators', 'args-kwargs', 'forwarding'],
      concepts: ['py-decorator-application', 'py-args-kwargs'],
    },
  {
      id: 'py-decorators-cloze-4',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_DECORATORS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the missing layer of a parameterized decorator. repeat(n) takes the parameter; the missing function takes the wrapped function.',
      template: `def repeat(n):
      def ___(fn):
          def wrapper(*args, **kwargs):
              for _ in range(n):
                  fn(*args, **kwargs)
          return wrapper
      return decorator`,
      blanks: ['decorator'],
      solution:
        'def repeat(n):\n    def decorator(fn):\n        def wrapper(*args, **kwargs):\n            for _ in range(n):\n                fn(*args, **kwargs)\n        return wrapper\n    return decorator',
      explanation:
        'A parameterized decorator has three layers: outer captures the parameter, middle is the actual decorator (takes fn), inner is the wrapper (takes the runtime args). The middle layer is what `repeat(n)` returns.',
      hints: ['The middle layer name needs to match what the outer function returns.'],
      tags: ['decorators', 'decorator-factory', 'closure'],
      concepts: ['py-decorator-application', 'py-closure-capture'],
    },
  {
      id: 'py-decorators-cloze-5',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DECORATORS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the dunder method that makes Counter instances callable when used as decorators.',
      template: `class Counter:
      def __init__(self, fn):
          self.fn = fn
          self.count = 0
      def ___(self, *args, **kwargs):
          self.count += 1
          return self.fn(*args, **kwargs)`,
      blanks: ['__call__'],
      solution:
        'class Counter:\n    def __init__(self, fn):\n        self.fn = fn\n        self.count = 0\n    def __call__(self, *args, **kwargs):\n        self.count += 1\n        return self.fn(*args, **kwargs)',
      explanation:
        '__call__ makes any instance callable with parentheses. Without it, calling a Counter instance raises "TypeError: object is not callable". This is what lets a class be used as a decorator.',
      hints: ['The dunder for "make this object behave like a function".'],
      tags: ['decorators', 'class-decorator', 'dunder'],
      concepts: ['py-decorator-application', 'py-magic-methods'],
    },
  {
      id: 'py-decorators-cloze-6',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DECORATORS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the parameterized-decorator application syntax. Apply repeat with the value 3.',
      template: `def repeat(n):
    def decorator(fn):
        def wrapper(*args, **kwargs):
            for _ in range(n):
                fn(*args, **kwargs)
        return wrapper
    return decorator

___
def go():
    print("hi")`,
      blanks: ['@repeat(3)'],
      solution:
        'def repeat(n):\n    def decorator(fn):\n        def wrapper(*args, **kwargs):\n            for _ in range(n):\n                fn(*args, **kwargs)\n        return wrapper\n    return decorator\n\n@repeat(3)\ndef go():\n    print("hi")',
      explanation:
        '@repeat(3) first calls repeat(3) which returns the decorator, which is then applied to go. Writing @repeat (no parentheses) would pass go as n — a common mistake that produces confusing errors.',
      hints: ['Parameterized decorators are CALLED with their parameters in the @ line.'],
      tags: ['decorators', 'parameterized', 'syntax'],
      concepts: ['py-decorator-application'],
    },
  {
      id: 'py-decorators-cloze-7',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_DECORATORS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the call inside wrapper so the decorator forwards both positional and keyword arguments AND returns the result.',
      template: `def log(fn):
      def wrapper(*args, **kwargs):
          print("calling")
          ___ fn(*args, **kwargs)
      return wrapper`,
      blanks: ['return'],
      solution:
        'def log(fn):\n    def wrapper(*args, **kwargs):\n        print("calling")\n        return fn(*args, **kwargs)\n    return wrapper',
      explanation:
        'Without `return`, the wrapper would call the function but discard its return value — every decorated function would return None. This is the most common decorator bug.',
      hints: ['One keyword preserves the wrapped function\'s return value.'],
      tags: ['decorators', 'return', 'common-mistake'],
      concepts: ['py-decorator-application'],
    },
  {
      id: 'py-decorators-cloze-8',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_DECORATORS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the cache lookup so memo only computes when the key is missing.',
      template: `def memo(fn):
      cache = {}
      def wrapper(*args):
          if args ___ cache:
              cache[args] = fn(*args)
          return cache[args]
      return wrapper`,
      blanks: ['not in'],
      solution:
        'def memo(fn):\n    cache = {}\n    def wrapper(*args):\n        if args not in cache:\n            cache[args] = fn(*args)\n        return cache[args]\n    return wrapper',
      explanation:
        '`not in` checks dict-key membership in O(1). On a miss we compute and cache; either way we return the cached value. Using `not cache.get(args)` would mistakenly recompute when the cached value is falsy (0, None, "").',
      hints: ['Two-word membership operator that negates `in`.'],
      tags: ['decorators', 'memoization', 'membership'],
      concepts: ['py-decorator-application'],
    },
  {
      id: 'py-decorators-cloze-9',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_DECORATORS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the two decorators stacked above go so timer wraps log wraps go.',
      template: `___
___
def go():
    print("go")`,
      blanks: ['@timer', '@log'],
      solution: '@timer\n@log\ndef go():\n    print("go")',
      explanation:
        'Decorators stack bottom-up: the one closest to def is applied FIRST. So @log wraps go, then @timer wraps the log-wrapped result. At call time, timer\'s wrapper runs first and delegates inward.',
      hints: ['Outer wrapper goes on top; the closer-to-def decorator is applied first.'],
      tags: ['decorators', 'stacking'],
      concepts: ['py-decorator-application'],
    },
  {
      id: 'py-decorators-cloze-10',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_DECORATORS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the unpacking syntax so wrapper forwards args and kwargs to fn.',
      template: `def trace(fn):
      def wrapper(*args, **kwargs):
          return fn(___args, ___kwargs)
      return wrapper`,
      blanks: ['*', '**'],
      solution:
        'def trace(fn):\n    def wrapper(*args, **kwargs):\n        return fn(*args, **kwargs)\n    return wrapper',
      explanation:
        '* unpacks the args tuple back into positional parameters; ** unpacks the kwargs dict back into keyword parameters. Without unpacking, fn would receive the tuple/dict as single arguments — usually a TypeError.',
      hints: ['The same * and ** symbols both pack (in the signature) and unpack (in the call).'],
      tags: ['decorators', 'args-kwargs', 'unpacking'],
      concepts: ['py-decorator-application', 'py-args-kwargs', 'py-unpacking'],
    },
  {
      id: 'py-decorators-parsons-1',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_DECORATORS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Build a minimal logging decorator that prints "calling" before invoking the wrapped function and returns its result. Apply it to greet().',
      correctOrder: [
        'def log(fn):',
        '    def wrapper(*args, **kwargs):',
        '        print("calling")',
        '        return fn(*args, **kwargs)',
        '    return wrapper',
        '',
        '@log',
        'def greet(name):',
        '    return f"Hello, {name}!"',
      ],
      distractorLines: [
        '    fn(*args, **kwargs)',
        '    return fn',
      ],
      solution:
        'def log(fn):\n    def wrapper(*args, **kwargs):\n        print("calling")\n        return fn(*args, **kwargs)\n    return wrapper\n\n@log\ndef greet(name):\n    return f"Hello, {name}!"',
      explanation:
        'A decorator returns the wrapper function (not the result of calling it, and not the original fn). The wrapper must `return fn(*args, **kwargs)` so the caller still gets the wrapped function\'s return value — calling without `return` would always yield None.',
      hints: ['The wrapper needs to return the wrapped call; the decorator returns the wrapper itself.'],
      tags: ['decorators', 'wrapper', 'closure'],
      concepts: ['py-decorator-application', 'py-closure-capture'],
    },
  {
      id: 'py-decorators-parsons-2',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_DECORATORS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Use functools.wraps so the decorated function preserves its original __name__ and docstring.',
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
        '    wraps(fn)',
      ],
      solution:
        'from functools import wraps\n\ndef trace(fn):\n    @wraps(fn)\n    def wrapper(*args, **kwargs):\n        return fn(*args, **kwargs)\n    return wrapper',
      explanation:
        '@wraps(fn) is itself a decorator factory — it must be CALLED with the wrapped function as an argument so it knows what metadata to copy. Without `wraps`, the decorated function\'s __name__ becomes "wrapper" and its docstring is lost.',
      hints: ['@wraps is a decorator factory — it takes fn as an argument before being applied.'],
      tags: ['decorators', 'wraps', 'metadata'],
      concepts: ['py-decorator-application'],
    },
  {
      id: 'py-decorators-parsons-3',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_DECORATORS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Build a parameterized decorator @repeat(n) that calls the wrapped function n times. Apply with @repeat(3).',
      correctOrder: [
        'def repeat(n):',
        '    def decorator(fn):',
        '        def wrapper(*args, **kwargs):',
        '            for _ in range(n):',
        '                fn(*args, **kwargs)',
        '        return wrapper',
        '    return decorator',
        '',
        '@repeat(3)',
        'def greet():',
        '    print("hi")',
      ],
      distractorLines: [
        '@repeat',
        '    return wrapper',
      ],
      solution:
        'def repeat(n):\n    def decorator(fn):\n        def wrapper(*args, **kwargs):\n            for _ in range(n):\n                fn(*args, **kwargs)\n        return wrapper\n    return decorator\n\n@repeat(3)\ndef greet():\n    print("hi")',
      explanation:
        'A parameterized decorator is a function that returns a decorator that returns a wrapper — three nested layers. @repeat(3) first calls repeat(3), which returns the actual decorator that gets applied to greet. Writing @repeat (no parentheses) would pass greet as the n argument, which is the most common bug.',
      hints: ['Three layers: outer captures the parameter, middle is the decorator, inner is the wrapper.'],
      tags: ['decorators', 'decorator-factory', 'closure'],
      concepts: ['py-decorator-application', 'py-closure-capture'],
    },
  {
      id: 'py-decorators-parsons-4',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_DECORATORS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Build a @retry(times) decorator that catches exceptions and re-runs the function up to `times` attempts, re-raising on the final failure.',
      correctOrder: [
        'def retry(times):',
        '    def decorator(fn):',
        '        def wrapper(*args, **kwargs):',
        '            for attempt in range(times):',
        '                try:',
        '                    return fn(*args, **kwargs)',
        '                except Exception:',
        '                    if attempt == times - 1:',
        '                        raise',
        '        return wrapper',
        '    return decorator',
      ],
      distractorLines: [
        '            return fn(*args, **kwargs)',
        '                    pass',
      ],
      solution:
        'def retry(times):\n    def decorator(fn):\n        def wrapper(*args, **kwargs):\n            for attempt in range(times):\n                try:\n                    return fn(*args, **kwargs)\n                except Exception:\n                    if attempt == times - 1:\n                        raise\n        return wrapper\n    return decorator',
      explanation:
        'On a successful call, `return fn(...)` exits the loop. On exception, the loop continues unless this is the last attempt — in which case `raise` re-raises the original exception. Using `pass` instead would silently swallow the final failure.',
      hints: ['Return on success, re-raise on the final attempt, otherwise loop again.'],
      tags: ['decorators', 'retry', 'exceptions'],
      concepts: ['py-decorator-application', 'py-exception-hierarchy'],
    },
  {
      id: 'py-decorators-parsons-5',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DECORATORS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Stack two decorators on greet — @log first, then @timer below it. Order matters: timer wraps log wraps greet.',
      correctOrder: [
        '@timer',
        '@log',
        'def greet():',
        '    print("hi")',
      ],
      distractorLines: [
        '@log @timer',
        'def greet():',
      ],
      solution: '@timer\n@log\ndef greet():\n    print("hi")',
      explanation:
        'Decorators apply bottom-up: greet = timer(log(greet)). The decorator closest to the function is applied first. Reading top to bottom, @timer is the OUTER wrapper — it sees @log\'s wrapped version, not the raw greet.',
      hints: ['Decorators apply bottom-up: the closest one to the def runs first.'],
      tags: ['decorators', 'stacking', 'order'],
      concepts: ['py-decorator-application'],
    },
  {
      id: 'py-decorators-parsons-6',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_DECORATORS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Build a @timing decorator that prints the elapsed time around the wrapped call using time.perf_counter.',
      correctOrder: [
        'import time',
        '',
        'def timing(fn):',
        '    def wrapper(*args, **kwargs):',
        '        start = time.perf_counter()',
        '        result = fn(*args, **kwargs)',
        '        print(time.perf_counter() - start)',
        '        return result',
        '    return wrapper',
      ],
      distractorLines: [
        '        return fn(*args, **kwargs)',
        '        print(time.perf_counter())',
      ],
      solution:
        'import time\n\ndef timing(fn):\n    def wrapper(*args, **kwargs):\n        start = time.perf_counter()\n        result = fn(*args, **kwargs)\n        print(time.perf_counter() - start)\n        return result\n    return wrapper',
      explanation:
        'Capture start, call the function and store the result, print the delta, then return the result. If you `return fn(...)` directly you can\'t print AFTER the call returned (unless you compute it before — which would mean timing the wrong thing).',
      hints: ['Save the result before printing the delta — and return the result, not the printed value.'],
      tags: ['decorators', 'timing'],
      concepts: ['py-decorator-application'],
    },
  {
      id: 'py-decorators-parsons-7',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_DECORATORS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Build a memoization decorator that caches results in a dict keyed by the args tuple. Call fib(10).',
      correctOrder: [
        'def memo(fn):',
        '    cache = {}',
        '    def wrapper(*args):',
        '        if args not in cache:',
        '            cache[args] = fn(*args)',
        '        return cache[args]',
        '    return wrapper',
      ],
      distractorLines: [
        '    cache = []',
        '        cache[args] = fn(args)',
      ],
      solution:
        'def memo(fn):\n    cache = {}\n    def wrapper(*args):\n        if args not in cache:\n            cache[args] = fn(*args)\n        return cache[args]\n    return wrapper',
      explanation:
        'The cache must be a dict (constant-time key lookup) defined in the OUTER scope so it persists across calls. `fn(*args)` unpacks the tuple back into positional arguments — `fn(args)` would pass the tuple as a single argument.',
      hints: ['Cache lives outside wrapper so it persists; unpack args with * when calling fn.'],
      tags: ['decorators', 'memoization', 'closure'],
      concepts: ['py-decorator-application', 'py-closure-capture'],
    },
  {
      id: 'py-decorators-parsons-8',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_DECORATORS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Build a @validate_positive decorator that raises ValueError if any positional arg is <= 0, otherwise calls the function.',
      correctOrder: [
        'def validate_positive(fn):',
        '    def wrapper(*args):',
        '        if any(a <= 0 for a in args):',
        '            raise ValueError("must be positive")',
        '        return fn(*args)',
        '    return wrapper',
      ],
      distractorLines: [
        '        if all(a > 0 for a in args):',
        '            return ValueError("must be positive")',
      ],
      solution:
        'def validate_positive(fn):\n    def wrapper(*args):\n        if any(a <= 0 for a in args):\n            raise ValueError("must be positive")\n        return fn(*args)\n    return wrapper',
      explanation:
        'Use `raise` (statement) to throw the exception — `return ValueError(...)` would silently return the exception object as a value. `any(... <= 0)` is the right test: even one non-positive arg fails validation.',
      hints: ['raise is a statement, not a function call. Validate with any/all carefully.'],
      tags: ['decorators', 'validation', 'exceptions'],
      concepts: ['py-decorator-application', 'py-exception-hierarchy'],
    },
  {
      id: 'py-decorators-parsons-9',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_DECORATORS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Apply a class as a decorator. The class stores call count and forwards calls to the wrapped function.',
      correctOrder: [
        'class CountCalls:',
        '    def __init__(self, fn):',
        '        self.fn = fn',
        '        self.count = 0',
        '    def __call__(self, *args, **kwargs):',
        '        self.count += 1',
        '        return self.fn(*args, **kwargs)',
        '',
        '@CountCalls',
        'def greet():',
        '    print("hi")',
      ],
      distractorLines: [
        '    def __init__(self):',
        '    def call(self, *args, **kwargs):',
      ],
      solution:
        'class CountCalls:\n    def __init__(self, fn):\n        self.fn = fn\n        self.count = 0\n    def __call__(self, *args, **kwargs):\n        self.count += 1\n        return self.fn(*args, **kwargs)\n\n@CountCalls\ndef greet():\n    print("hi")',
      explanation:
        'Class decorators receive the function in __init__ and use __call__ to make instances callable. Without __call__ (or with a method named differently), greet() would fail with TypeError: object is not callable.',
      hints: ['__init__ stores the wrapped fn; __call__ is what makes the instance behave like a function.'],
      tags: ['decorators', 'class-decorator', 'dunder'],
      concepts: ['py-decorator-application', 'py-magic-methods'],
    },
  {
      id: 'py-decorators-parsons-10',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_DECORATORS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Decorate add with @log so it preserves metadata (functools.wraps) and prints arguments before calling.',
      correctOrder: [
        'from functools import wraps',
        '',
        'def log(fn):',
        '    @wraps(fn)',
        '    def wrapper(*args, **kwargs):',
        '        print(args, kwargs)',
        '        return fn(*args, **kwargs)',
        '    return wrapper',
        '',
        '@log',
        'def add(a, b):',
        '    return a + b',
      ],
      distractorLines: [
        '    @wraps',
        '        return wrapper',
      ],
      solution:
        'from functools import wraps\n\ndef log(fn):\n    @wraps(fn)\n    def wrapper(*args, **kwargs):\n        print(args, kwargs)\n        return fn(*args, **kwargs)\n    return wrapper\n\n@log\ndef add(a, b):\n    return a + b',
      explanation:
        'The full pattern: import wraps, apply @wraps(fn) to wrapper, accept *args/**kwargs to pass through any signature, then return fn(*args, **kwargs). Returning `wrapper` from the wrapper itself is a common confusion — the OUTER function returns wrapper, not the inner one.',
      hints: ['@wraps(fn) goes ABOVE wrapper. The decorator returns wrapper; wrapper returns fn(...).'],
      tags: ['decorators', 'wraps', 'logging'],
      concepts: ['py-decorator-application', 'py-logging-config'],
    },
  {
      id: 'py-decorators-predict-1',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_DECORATORS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `def log(fn):
    print("decorating")
    def wrapper():
        print("calling")
        return fn()
    return wrapper

@log
def greet():
    print("hi")

greet()`,
      expectedOutput: `decorating
calling
hi`,
      explanation:
        'The decorator BODY runs at definition time — "decorating" prints once when @log is applied. The wrapper body runs at call time — "calling" then "hi" each time greet() is invoked.',
      hints: ['Decorator outer code runs at @-application time; wrapper runs at call time.'],
      tags: ['decorators', 'execution-order'],
      concepts: ['py-decorator-application'],
    },
  {
      id: 'py-decorators-predict-2',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_DECORATORS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `def outer(fn):
    def wrapper():
        print("outer")
        return fn()
    return wrapper

def inner(fn):
    def wrapper():
        print("inner")
        return fn()
    return wrapper

@outer
@inner
def go():
    print("go")

go()`,
      expectedOutput: `outer
inner
go`,
      explanation:
        'Stacked decorators apply bottom-up: go = outer(inner(go)). At call time the OUTERMOST wrapper runs first, so "outer" prints before "inner". The closer-to-the-def decorator is applied first but called LAST.',
      hints: ['Apply order vs. call order: stack from bottom; calls unwind from top.'],
      tags: ['decorators', 'stacking', 'execution-order'],
      concepts: ['py-decorator-application'],
    },
  {
      id: 'py-decorators-predict-3',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_DECORATORS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `def trace(fn):
    def wrapper(*args, **kwargs):
        return fn(*args, **kwargs)
    return wrapper

@trace
def add(a, b):
    """Add two numbers."""
    return a + b

print(add.__name__)`,
      expectedOutput: `wrapper`,
      explanation:
        'Without @functools.wraps, the decorated function takes on the wrapper\'s metadata. add.__name__ becomes "wrapper" and add.__doc__ becomes None. functools.wraps copies the originals back.',
      hints: ['Without wraps, the function loses its name and docstring.'],
      tags: ['decorators', 'metadata', 'wraps'],
      concepts: ['py-decorator-application'],
    },
  {
      id: 'py-decorators-predict-4',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_DECORATORS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `def log(fn):
    def wrapper(*args, **kwargs):
        print("call")
        fn(*args, **kwargs)
    return wrapper

@log
def add(a, b):
    return a + b

result = add(2, 3)
print(result)`,
      expectedOutput: `call
None`,
      explanation:
        'The wrapper calls fn but does NOT return its result — so add(2, 3) returns None. The original return value is discarded. A correct wrapper must `return fn(*args, **kwargs)`.',
      hints: ['Look carefully: does the wrapper return the wrapped call\'s value?'],
      tags: ['decorators', 'return', 'common-mistake'],
      concepts: ['py-decorator-application'],
    },
  {
      id: 'py-decorators-predict-5',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_DECORATORS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `def repeat(n):
    def decorator(fn):
        def wrapper(*args, **kwargs):
            for _ in range(n):
                fn(*args, **kwargs)
        return wrapper
    return decorator

@repeat(3)
def hi():
    print("hi")

hi()`,
      expectedOutput: `hi
hi
hi`,
      explanation:
        'A decorator factory takes the parameter (3) and returns the actual decorator. The wrapper loops n times. Each iteration calls fn() which prints "hi" — so three "hi" lines total.',
      hints: ['How many times does the wrapper invoke fn?'],
      tags: ['decorators', 'decorator-factory', 'parameterized'],
      concepts: ['py-decorator-application'],
    },
  {
      id: 'py-decorators-predict-6',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_DECORATORS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `def memo(fn):
    cache = {}
    def wrapper(n):
        if n not in cache:
            print("computing", n)
            cache[n] = fn(n)
        return cache[n]
    return wrapper

@memo
def square(n):
    return n * n

print(square(3))
print(square(3))
print(square(4))`,
      expectedOutput: `computing 3
9
9
computing 4
16`,
      explanation:
        'First call to square(3) misses the cache: prints "computing 3", computes 9, caches it, returns 9. Second call to square(3) is a hit — no print, returns cached 9. Then square(4) misses again, prints, computes, returns.',
      hints: ['First call computes; second call with the same arg uses the cache.'],
      tags: ['decorators', 'memoization', 'closure'],
      concepts: ['py-decorator-application', 'py-closure-capture'],
    },
  {
      id: 'py-decorators-predict-7',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_DECORATORS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `def counted(fn):
    def wrapper(*args, **kwargs):
        wrapper.calls += 1
        return fn(*args, **kwargs)
    wrapper.calls = 0
    return wrapper

@counted
def hello():
    pass

hello()
hello()
hello()
print(hello.calls)`,
      expectedOutput: `3`,
      explanation:
        'After @counted, the name hello refers to wrapper. The counter is attached to wrapper itself (wrapper.calls), so hello.calls finds it. Each call increments the counter — three calls give 3.',
      hints: ['hello after decoration is wrapper — the counter must live on wrapper for hello.calls to find it.'],
      tags: ['decorators', 'attribute', 'closure'],
      concepts: ['py-decorator-application', 'py-closure-capture'],
    },
  {
      id: 'py-decorators-predict-8',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_DECORATORS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `def tag(label):
    def decorator(fn):
        def wrapper():
            print(f"[{label}]")
            fn()
        return wrapper
    return decorator

@tag("A")
@tag("B")
def go():
    print("go")

go()`,
      expectedOutput: `[A]
[B]
go`,
      explanation:
        'Two parameterized decorators stack like any others: bottom-up. go = tag("A")(tag("B")(go)). At call time the outermost (A) runs first: prints [A], then invokes the B-wrapper which prints [B], then calls go which prints "go".',
      hints: ['Stacked decorators run outer-to-inner at call time.'],
      tags: ['decorators', 'stacking', 'parameterized'],
      concepts: ['py-decorator-application'],
    },
  {
      id: 'py-decorators-predict-9',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_DECORATORS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `class Counter:
    def __init__(self, fn):
        self.fn = fn
        self.count = 0
    def __call__(self, *args, **kwargs):
        self.count += 1
        return self.fn(*args, **kwargs)

@Counter
def ping():
    pass

ping()
ping()
ping()
print(ping.count)`,
      expectedOutput: `3`,
      explanation:
        'Class as decorator: ping is now a Counter instance, not a function. __call__ increments self.count on each call and forwards to self.fn. After three calls, ping.count is 3.',
      hints: ['ping is the Counter instance; .count is its attribute.'],
      tags: ['decorators', 'class-decorator', 'dunder'],
      concepts: ['py-decorator-application', 'py-magic-methods'],
    },
  {
      id: 'py-decorators-predict-10',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_DECORATORS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `def announce(fn):
    print(f"wrapping {fn.__name__}")
    def wrapper(*args, **kwargs):
        return fn(*args, **kwargs)
    return wrapper

@announce
def a():
    pass

@announce
def b():
    pass

print("done")`,
      expectedOutput: `wrapping a
wrapping b
done`,
      explanation:
        'Decorator outer code runs at definition time, in source order. So @announce applied to `a` prints "wrapping a", then `b` prints "wrapping b", then the module-level print runs. Even though we never call a() or b(), the decorators still ran during the @ application.',
      hints: ['Decorators run at definition (@-application) time, before any function calls.'],
      tags: ['decorators', 'execution-order'],
      concepts: ['py-decorator-application'],
    },
  {
      id: 'pcpp-dec-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_DECORATORS,
      course: Course.BACKEND,
      question: 'Why should you use `@functools.wraps(func)` inside a decorator?',
      options: [
        { id: 'a', text: 'It makes the decorator run faster', isCorrect: false },
        { id: 'b', text: 'It preserves the wrapped function\'s `__name__`, `__doc__`, and other metadata', isCorrect: true },
        { id: 'c', text: 'It is required for the decorator to work at all', isCorrect: false },
        { id: 'd', text: 'It prevents the decorator from being applied more than once', isCorrect: false },
      ],
      explanation: 'Without `@functools.wraps(func)`, the decorated function\'s `__name__` and `__doc__` are replaced by the wrapper\'s. This breaks debugging, logging, and documentation tools. `@functools.wraps(func)` copies the original function\'s metadata to the wrapper, so `decorated_fn.__name__` still returns the original name.',
      hints: [
        'Without it, `fn.__name__` would be `"wrapper"` instead of the original name',
        'Always use `@functools.wraps(func)` in production decorators',
      ],
      tags: ['decorators', 'functools', 'wraps', 'metadata', '__name__'],
      concepts: ['py-decorator-application', 'py-functools-cache-partial'],
    },
  {
      id: 'pcpp-dec-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_DECORATORS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write a PARAMETERISED decorator `retry` that takes an integer `times`. The decorated function must be re-invoked up to `times` times on any `Exception`; if every attempt fails, re-raise the last exception. Preserve the wrapped function\'s metadata using the `functools` helper that copies `__name__` / `__doc__` / etc. onto the wrapper.\n\nDemonstrate it: declare a module-level `attempt = 0`. Apply the decorator with `times=3` to a function `flaky_function` (no args) that increments the global `attempt`, raises `ValueError("Not ready yet")` while `attempt` is less than 3, and otherwise returns `"Success"`. Call `flaky_function()` and print its return value, then print `attempt`. Expected output on two lines: `Success` and `3`.',
      starterCode: `# Write a parameterised decorator retry(times):
#   - re-invokes the wrapped function up to 'times' times on any Exception
#   - re-raises the last exception if every attempt fails
#   - preserves metadata via functools.wraps


# Set a global 'attempt = 0'
# Define flaky_function() decorated with @retry(3) that:
#   - increments attempt
#   - raises ValueError("Not ready yet") while attempt < 3
#   - otherwise returns "Success"
# Print flaky_function() then print attempt
`,
      testCases: [
        { input: '', expectedOutput: 'Success\n3', description: 'Should succeed on the 3rd attempt' },
      ],
      solution: `import functools

def retry(times):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            last_exception = None
            for _ in range(times):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    last_exception = e
            raise last_exception
        return wrapper
    return decorator

attempt = 0

@retry(3)
def flaky_function():
    global attempt
    attempt += 1
    if attempt < 3:
        raise ValueError("Not ready yet")
    return "Success"

print(flaky_function())
print(attempt)`,
      explanation: 'A parameterised decorator has three levels: the outer function takes parameters (`times`), the `decorator` wraps the function, and `wrapper` runs the logic. The retry loop tries the function `times` times, catching any `Exception`. If all attempts fail, it re-raises the last exception. `@functools.wraps(func)` preserves metadata.',
      hints: [
        'Three levels: `retry(times)` → `decorator(func)` → `wrapper(*args, **kwargs)`',
        'Store the last exception and re-raise it after the loop',
      ],
      tags: ['decorators', 'retry', 'parameterised-decorator', 'functools', 'exception-handling'],
      concepts: ['py-decorator-application', 'py-functools-cache-partial'],
    },
  {
      id: 'pcpp-dec-3',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_DECORATORS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write a `memoize` decorator that caches the results of a function call based on its arguments. If the same arguments are passed again, return the cached result instead of re-computing.',
      starterCode: `# Write a memoize decorator that caches results by positional args.
# Use a closure dict keyed by args; preserve metadata via functools.wraps.


# Apply it to a recursive fibonacci(n) and print fibonacci(10) and fibonacci(30)
`,
      testCases: [
        { input: 'fibonacci(10)', expectedOutput: '55', description: 'fibonacci(10) = 55' },
        { input: 'fibonacci(30)', expectedOutput: '832040', description: 'fibonacci(30) = 832040' },
      ],
      solution: `import functools

def memoize(func):
    cache = {}

    @functools.wraps(func)
    def wrapper(*args):
        if args not in cache:
            cache[args] = func(*args)
        return cache[args]

    return wrapper

@memoize
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print(fibonacci(10))
print(fibonacci(30))`,
      explanation: 'The `cache` dict lives in the closure — it persists across calls. `args` is a tuple (tuples are hashable, so they work as dict keys). If the result is already cached, we skip recomputation. Memoising Fibonacci turns it from exponential O(2^n) to linear O(n). Python also provides this as `functools.lru_cache`.',
      hints: [
        'Use `args` (tuple) as the dict key — tuples are hashable',
        'Check `if args not in cache:` before computing',
      ],
      tags: ['decorators', 'memoize', 'caching', 'fibonacci', 'functools', 'closure'],
      concepts: ['py-decorator-application', 'py-functools-cache-partial', 'py-closure-capture'],
    },
  {
      id: 'py-gap-decorators-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DECORATORS,
      course: Course.BACKEND,
      question: 'What is a decorator in Python?',
      options: [
        { id: 'a', text: 'A special comment that documents what a function does', isCorrect: false },
        { id: 'b', text: 'A way to convert a function into a class method', isCorrect: false },
        { id: 'c', text: 'A function that wraps another function to add behavior without modifying it, applied with `@decorator_name` above a function definition', isCorrect: true },
        { id: 'd', text: 'A keyword used to make variables private inside a class', isCorrect: false },
      ],
      explanation: 'A decorator is a function that takes another function as input, adds some behavior, and returns a new function — all without modifying the original function\'s code. The `@decorator_name` syntax is shorthand for `func = decorator_name(func)`. Decorators are widely used in Python frameworks (e.g., `@app.route` in Flask, `@property` in classes).',
      hints: [
        'The `@` symbol before a function definition applies a decorator',
        'Decorators wrap functions to extend their behavior',
      ],
      tags: ['decorators', 'functions', 'basics'],
      concepts: ['py-decorator-application'],
    },
  {
      id: 'py-gap-decorators-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_DECORATORS,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write a decorator called `uppercase` that makes a function\'s return value uppercase. Then apply it to a function `greet()` that returns "hello". When you call `greet()`, it should return "HELLO".',
      starterCode: `# Write the uppercase decorator


# Apply it to the greet function


# Test it
`,
      testCases: [
        {
          input: 'greet()',
          expectedOutput: 'HELLO',
          description: 'Decorated greet() should return "HELLO"',
        },
      ],
      solution: `def uppercase(func):
    def wrapper():
        result = func()
        return result.upper()
    return wrapper

@uppercase
def greet():
    return "hello"

print(greet())  # HELLO`,
      explanation: 'The `uppercase` decorator defines an inner `wrapper` function that calls the original function, transforms its result with `.upper()`, and returns the modified value. The `@uppercase` syntax above `greet` is equivalent to writing `greet = uppercase(greet)`. The key pattern is: decorator takes a function, returns a wrapper that adds behavior around the original call.',
      hints: [
        'A decorator is a function that takes a function and returns a new function',
        'Define an inner `wrapper` function that calls the original and transforms the result',
        'Return the wrapper function from the decorator',
      ],
      tags: ['decorators', 'functions', 'wrapper', 'basics'],
      concepts: ['py-decorator-application'],
    },
];
