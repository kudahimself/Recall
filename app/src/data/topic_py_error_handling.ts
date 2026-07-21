/**
 * Topic.PY_ERROR_HANDLING — all question types for this topic.
 * Auto-consolidated by scripts/consolidate-by-topic.js from:
 *   backendGapQuestions.ts (4), backendQuestions.ts (2), pyBeginnerIntroQuestions.ts (5), pyErrorHandlingCloze.ts (10), pyErrorHandlingParsons.ts (10), pyErrorHandlingPredictOutput.ts (10), pythonAdvOopQuestions.ts (4)
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const py_error_handling_questions: Question[] = [
  {
      id: 'py-err-3',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_ERROR_HANDLING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Create a custom exception `InsufficientFundsError` that inherits from `Exception`. Its `__init__` takes `amount` and `balance`, stores both as instance attributes (so an `except` block can read `err.amount` and `err.balance`), and ensures `str(err)` is exactly `"Cannot withdraw {amount}: only {balance} available"` with the two values interpolated.',
      starterCode: `# Define InsufficientFundsError inheriting from Exception
# __init__(self, amount, balance): expose both as attributes, and make str(err) match the spec
`,
      testCases: [{ input: 'custom exception', expectedOutput: 'class InsufficientFundsError(Exception)', description: 'Should create custom exception' }],
      solution: `class InsufficientFundsError(Exception):\n    def __init__(self, amount, balance):\n        self.amount = amount\n        self.balance = balance\n        super().__init__(f"Cannot withdraw {amount}: only {balance} available")`,
      explanation: 'Custom exceptions inherit from Exception. Call super().__init__(message) to set the error message. Store extra context as attributes (amount, balance) for programmatic access in the except block.',
      hints: ['Inherit from Exception', 'super().__init__(message) for error text', 'Store context as attributes'],
      tieredHints: {
        apiSignature: 'super().__init__(*args) -> None',
        skeleton: `class InsufficientFundsError(____):
    def __init__(self, amount, balance):
        self.____ = amount
        self.____ = balance
        ____.__init__(f"Cannot withdraw {amount}: only {balance} available")`,
      },
      tags: ['exception', 'custom', 'class', 'python'],
      concepts: ['py-exception-hierarchy'],
    },
  {
      id: 'py-err-4',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_ERROR_HANDLING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write a function "parse_int(s)" that converts s to an int using try/except/else/finally. On ValueError: print f"Error: {e}" (where e is the exception) and return None. On success: print f"Success: {result}" and return the int. In finally: print "Done".',
      starterCode: `def parse_int(s):\n`,
      testCases: [{ input: '"123" or "abc"', expectedOutput: 'try/except/else/finally blocks', description: 'Should use all exception blocks' }],
      solution: `def parse_int(s):\n    try:\n        result = int(s)\n    except ValueError as e:\n        print(f"Error: {e}")\n        return None\n    else:\n        print(f"Success: {result}")\n        return result\n    finally:\n        print("Done")`,
      explanation: 'try: code that might fail. except: handles the error. else: runs ONLY if no exception (good for success logic). finally: ALWAYS runs (cleanup). The full flow: try → (except OR else) → finally.',
      hints: ['else only runs if no exception', 'finally always runs', 'except catches specific errors'],
      tieredHints: {
        apiSignature: 'int(x) -> int',
        skeleton: `def parse_int(s):
    try:
        result = ____(s)
    except ____ as e:
        print(f"Error: {e}")
        return ____
    ____:
        print(f"Success: {result}")
        return result
    ____:
        print("Done")`,
      },
      tags: ['try', 'except', 'else', 'finally', 'python'],
      concepts: ['py-try-finally-ordering'],
    },
  {
      id: 'py-err-5',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_ERROR_HANDLING,
      course: Course.BACKEND,
      question: 'Why should you avoid bare "except:" without specifying an exception type?',
      options: [
        { id: 'a', text: 'It catches EVERYTHING including KeyboardInterrupt and SystemExit, making it impossible to stop the program. Always catch specific exceptions.', isCorrect: true },
        { id: 'b', text: 'It is slower', isCorrect: false },
        { id: 'c', text: 'It is deprecated', isCorrect: false },
        { id: 'd', text: 'It causes memory leaks', isCorrect: false },
      ],
      explanation: 'bare except: catches KeyboardInterrupt (Ctrl+C), SystemExit, GeneratorExit — things you should not catch. Use except Exception: to catch all "normal" errors. Better: catch specific exceptions like except ValueError, TypeError:',
      tags: ['exception', 'best-practice', 'bare-except', 'python'],
      concepts: ['py-exception-hierarchy'],
    },
  {
      id: 'py-err-6',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_ERROR_HANDLING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write a function "retry" that takes a function and max_attempts (default 3). It calls the function, and if it raises an exception, retries up to max_attempts times before re-raising.',
      starterCode: `import time


def retry(func, max_attempts=3):
    # Retry func up to max_attempts times before re-raising
    pass
`,
      testCases: [{ input: 'failing function', expectedOutput: 'loop with try/except and re-raise', description: 'Should retry on failure' }],
      solution: `import time\n\ndef retry(func, max_attempts=3):\n    for attempt in range(1, max_attempts + 1):\n        try:\n            return func()\n        except Exception as e:\n            if attempt == max_attempts:\n                raise\n            print(f"Attempt {attempt} failed: {e}. Retrying...")\n            time.sleep(1)`,
      explanation: '"raise" without arguments re-raises the current exception. This retry pattern is used for network calls, database connections, etc. In production, use exponential backoff (time.sleep(2 ** attempt)) and the tenacity library.',
      hints: ['Loop over attempts', '"raise" re-raises the current exception', 'Only retry if not the last attempt'],
      tieredHints: {
        apiSignature: 'range(start, stop, step=1) -> range',
        skeleton: `import time

def retry(func, max_attempts=3):
    for attempt in ____(1, max_attempts + 1):
        try:
            return ____()
        except Exception as e:
            if attempt == ____:
                ____
            print(f"Attempt {attempt} failed: {e}. Retrying...")
            time.sleep(1)`,
      },
      tags: ['retry', 'exception', 'pattern', 'python'],
      concepts: ['py-exception-hierarchy'],
    },
  {
      id: 'py-err-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_ERROR_HANDLING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write a function "safe_divide" that takes two numbers and returns their division. Handle ZeroDivisionError by returning None, and TypeError (non-numeric input) by returning None.',
      starterCode: `# Define safe_divide(a, b) — return a / b inside a try, catch (ZeroDivisionError, TypeError) and return None
  `,
      testCases: [
        {
          input: '10, 0',
          expectedOutput: 'try/except with ZeroDivisionError and TypeError',
          description: 'Should handle division errors',
        },
      ],
      solution: `def safe_divide(a, b):\n    try:\n        return a / b\n    except (ZeroDivisionError, TypeError):\n        return None`,
      explanation: 'try/except catches specific exceptions. You can catch multiple exceptions with a tuple: except (Error1, Error2). Always catch specific exceptions — bare except: catches everything including KeyboardInterrupt, which is bad practice.',
      hints: ['Use try/except', 'Catch specific exceptions, not bare except', 'Tuple for multiple exception types'],
      tieredHints: {
        apiSignature: 'except (ExceptionType1, ExceptionType2):',
        skeleton: `def safe_divide(a, b):
    ____:
        return a / b
    except (____, ____):
        return ____`,
      },
      tags: ['try', 'except', 'error-handling', 'python'],
      concepts: ['py-exception-hierarchy'],
    },
  {
      id: 'py-err-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_ERROR_HANDLING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write a context manager-style file read: open "data.txt", read its contents into variable "content", and ensure the file is closed even if an error occurs.',
      starterCode: `# Safe file reading\n`,
      testCases: [
        {
          input: 'data.txt',
          expectedOutput: 'with open("data.txt") as f: content = f.read()',
          description: 'Should use context manager',
        },
      ],
      solution: `with open("data.txt") as f:\n    content = f.read()`,
      explanation: 'The "with" statement is a context manager that automatically closes the file when the block exits, even if an exception occurs. Always use "with" for files, database connections, and locks. It calls __enter__ and __exit__ under the hood.',
      hints: ['Use "with open(...) as f:" pattern', 'File is auto-closed when block exits'],
      tieredHints: {
        apiSignature: 'file.read(size=-1) -> str',
        skeleton: `____ open("data.txt") ____ f:
    content = f.____()`,
      },
      tags: ['context-manager', 'with', 'file', 'python'],
      concepts: ['py-context-manager-protocol'],
    },
  {
      id: 'py-err-beg-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_ERROR_HANDLING,
      course: Course.BACKEND,
      question: 'What is a `try` block used for in Python?',
      options: [
        { id: 'a', text: 'It marks code that might raise an exception so a matching `except` block can handle it.', isCorrect: true },
        { id: 'b', text: 'It defines a new function that returns a value.', isCorrect: false },
        { id: 'c', text: 'It imports a module from another file.', isCorrect: false },
        { id: 'd', text: 'It loops over a sequence until a condition is met.', isCorrect: false },
      ],
      explanation: '`try` wraps risky code; if an exception is raised inside the `try`, Python jumps to the matching `except` block instead of crashing. Without `except`, the exception propagates up and the program stops with a traceback.',
      tags: ['try', 'except', 'beginner', 'python'],
      concepts: ['py-exception-hierarchy'],
    },
  {
      id: 'py-err-beg-2',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_ERROR_HANDLING,
      course: Course.BACKEND,
      question: 'Which keyword catches an exception in Python?',
      options: [
        { id: 'a', text: '`except`', isCorrect: true },
        { id: 'b', text: '`catch`', isCorrect: false },
        { id: 'c', text: '`rescue`', isCorrect: false },
        { id: 'd', text: '`handle`', isCorrect: false },
      ],
      explanation: 'Python uses `except`, not `catch`. The pattern is `try: ... except SomeError: ...`. Other languages use different names — Java/C# use `catch`, Ruby uses `rescue` — but Python is `except`.',
      tags: ['except', 'syntax', 'beginner', 'python'],
      concepts: ['py-exception-hierarchy', 'py-control-flow'],
    },
  {
      id: 'py-err-beg-3',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_ERROR_HANDLING,
      course: Course.BACKEND,
      question: 'In the snippet below, what does `e` refer to inside the `except` block?\n\n```python\ntry:\n    x = int("hello")\nexcept ValueError as e:\n    print(e)\n```',
      options: [
        { id: 'a', text: 'The exception object — it holds the error message and details about what went wrong.', isCorrect: true },
        { id: 'b', text: 'The string "hello" that caused the error.', isCorrect: false },
        { id: 'c', text: 'The integer 0, used as a fallback value.', isCorrect: false },
        { id: 'd', text: 'Always `None` — `as e` is just decorative syntax.', isCorrect: false },
      ],
      explanation: '`as e` binds the caught exception object to the name `e`. You can read `str(e)` for the message, `e.args` for the constructor arguments, etc. It does NOT contain the value that triggered the error.',
      tags: ['except', 'as', 'exception-object', 'beginner', 'python'],
      concepts: ['py-exception-hierarchy'],
    },
  {
      id: 'py-err-beg-4',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_ERROR_HANDLING,
      course: Course.BACKEND,
      question: 'What happens if an exception is raised and there is no matching `except` block to catch it?',
      options: [
        { id: 'a', text: 'The exception propagates up the call stack and, if never caught, the program stops with a traceback.', isCorrect: true },
        { id: 'b', text: 'Python silently ignores the exception and continues running.', isCorrect: false },
        { id: 'c', text: 'The function returns `None` automatically.', isCorrect: false },
        { id: 'd', text: 'Python retries the failing line until it succeeds.', isCorrect: false },
      ],
      explanation: 'Uncaught exceptions bubble up: each calling function gets a chance to handle them. If nothing does, the interpreter prints a traceback and exits with a non-zero status. Silent ignoring would mask bugs — Python deliberately fails loudly.',
      tags: ['exception', 'traceback', 'propagation', 'beginner', 'python'],
      concepts: ['py-exception-hierarchy'],
    },
  {
      id: 'py-err-beg-5',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_ERROR_HANDLING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write code that tries to convert the string `s = "hello"` to an integer with `int(s)`. If it raises a `ValueError`, print `not a number`. Use a `try`/`except ValueError` block.',
      starterCode: `s = "hello"
# Try int(s); on ValueError, print not a number
`,
      testCases: [
        {
          input: 's = "hello"',
          expectedOutput: 'not a number',
          description: 'try/except ValueError catches the conversion failure',
        },
      ],
      solution: `s = "hello"\ntry:\n    int(s)\nexcept ValueError:\n    print("not a number")`,
      explanation: '`int("hello")` raises `ValueError` because "hello" is not a numeric string. The `except ValueError:` clause catches that specific exception and runs the body. Catching the specific class (not a bare `except:`) is best practice — it lets unrelated errors keep propagating.',
      hints: ['Wrap `int(s)` in a `try` block', 'Use `except ValueError:` to catch the conversion error', 'Print the message inside the except'],
      tieredHints: {
        apiSignature: 'print(*objects, sep=" ", end="\\n") -> None',
        skeleton: `s = "hello"
____:
    int(s)
____ ValueError:
    print(____)`,
      },
      tags: ['try', 'except', 'value-error', 'beginner', 'python'],
      concepts: ['py-exception-hierarchy'],
    },
  {
      id: 'py-error-handling-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_ERROR_HANDLING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the keywords for try and the matching exception clause.',
      template: `___:
    int("xyz")
___ ValueError:
    print("bad")`,
      blanks: ['try', 'except'],
      solution: 'try:\n    int("xyz")\nexcept ValueError:\n    print("bad")',
      explanation:
        'try wraps the protected code; except catches a specific exception type. Always catch the narrowest type you can handle.',
      hints: ['Two keywords: enter the protected block, catch the type.'],
      tags: ['error-handling', 'try-except'],
      concepts: ['py-exception-hierarchy', 'py-try-finally-ordering'],
    },
  {
      id: 'py-error-handling-cloze-2',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_ERROR_HANDLING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the keyword that runs only when no exception was raised in try.',
      template: `try:
    n = int("42")
except ValueError:
    print("bad")
___:
    print("ok")`,
      blanks: ['else'],
      solution:
        'try:\n    n = int("42")\nexcept ValueError:\n    print("bad")\nelse:\n    print("ok")',
      explanation:
        'else runs only if try completed without raising. Cleaner than putting success-only code inside try (which can mask new errors as the same exception).',
      hints: ['Same keyword as in if/else, but with try.'],
      tags: ['error-handling', 'else'],
      concepts: ['py-exception-hierarchy'],
    },
  {
      id: 'py-error-handling-cloze-3',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_ERROR_HANDLING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the keyword that always runs (even on uncaught exceptions or return).',
      template: `try:
    risky()
except Exception:
    print("caught")
___:
    print("cleanup")`,
      blanks: ['finally'],
      solution:
        'try:\n    risky()\nexcept Exception:\n    print("caught")\nfinally:\n    print("cleanup")',
      explanation:
        'finally always runs — on success, on caught exception, on uncaught exception, on return. The canonical place for resource cleanup.',
      hints: ['Seven letters; same word as the adverb meaning "at the end".'],
      tags: ['error-handling', 'finally'],
      concepts: ['py-exception-hierarchy', 'py-try-finally-ordering'],
    },
  {
      id: 'py-error-handling-cloze-4',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_ERROR_HANDLING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the keyword that throws an exception.',
      template: `if not config:
      ___ ValueError("missing config")`,
      blanks: ['raise'],
      solution: 'if not config:\n    raise ValueError("missing config")',
      explanation:
        'raise is the statement to throw an exception. Pass an instance with a useful message. Bare `raise` (inside except) re-raises the current exception.',
      hints: ['Five letters; same as the verb meaning "lift up".'],
      tags: ['error-handling', 'raise'],
      concepts: ['py-exception-hierarchy'],
    },
  {
      id: 'py-error-handling-cloze-5',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_ERROR_HANDLING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the keyword that binds the exception instance to a name.',
      template: `try:
    risky()
except Exception ___ e:
    print(e)`,
      blanks: ['as'],
      solution: 'try:\n    risky()\nexcept Exception as e:\n    print(e)',
      explanation:
        'as binds the exception instance to a local name (only valid inside the except block — auto-deleted at the end). The Python 2 form `except Exception, e` is a SyntaxError in Python 3.',
      hints: ['Two letters; same word used in imports.'],
      tags: ['error-handling', 'as'],
      concepts: ['py-exception-hierarchy'],
    },
  {
      id: 'py-error-handling-cloze-6',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_ERROR_HANDLING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the keyword that explicitly chains a new exception to the original cause.',
      template: `try:
    int("xyz")
except ValueError as e:
    raise RuntimeError("parse failed") ___ e`,
      blanks: ['from'],
      solution:
        'try:\n    int("xyz")\nexcept ValueError as e:\n    raise RuntimeError("parse failed") from e',
      explanation:
        '`raise X from e` sets X.__cause__ to e — Python prints both tracebacks, separated by "The above exception was the direct cause of the following...". Use when wrapping a low-level error in a higher-level one.',
      hints: ['Four letters; same word as in copy-from.'],
      tags: ['error-handling', 'raise-from', 'chaining'],
      concepts: ['py-exception-hierarchy', 'py-raise-vs-reraise'],
    },
  {
      id: 'py-error-handling-cloze-7',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_ERROR_HANDLING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the base class so MyError inherits the exception protocol.',
      template: `class MyError(___):
      pass`,
      blanks: ['Exception'],
      solution: 'class MyError(Exception):\n    pass',
      explanation:
        'Custom exceptions should subclass Exception (or a more specific built-in like ValueError). Subclassing BaseException is too broad — it would also catch KeyboardInterrupt and SystemExit.',
      hints: ['Capitalized; the canonical base for user exceptions.'],
      tags: ['error-handling', 'custom-exception'],
      concepts: ['py-exception-hierarchy'],
    },
  {
      id: 'py-error-handling-cloze-8',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_ERROR_HANDLING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the punctuation that lets one except clause catch multiple exception types.',
      template: `try:
    risky()
except ___ValueError, TypeError___ as e:
    print(e)`,
      blanks: ['(', ')'],
      solution:
        'try:\n    risky()\nexcept (ValueError, TypeError) as e:\n    print(e)',
      explanation:
        'Tuple in parens catches if the raised exception matches ANY listed type. Without parens you\'d hit a SyntaxError (or in Python 2, the "as" form).',
      hints: ['Tuple punctuation — parens.'],
      tags: ['error-handling', 'except-tuple'],
      concepts: ['py-exception-hierarchy'],
    },
  {
      id: 'py-error-handling-cloze-9',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_ERROR_HANDLING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the contextlib helper that swallows specific exception types.',
      template: `from contextlib import ___

with ___(KeyError):
    d = {}
    d["missing"]`,
      blanks: ['suppress', 'suppress'],
      solution:
        'from contextlib import suppress\n\nwith suppress(KeyError):\n    d = {}\n    d["missing"]',
      explanation:
        'contextlib.suppress is the clean, intent-revealing replacement for `try: ...; except SpecificError: pass`. Pass one or more exception types.',
      hints: ['Eight letters; same word as the verb meaning "silence".'],
      tags: ['error-handling', 'suppress'],
      concepts: ['py-exception-hierarchy'],
    },
  {
      id: 'py-error-handling-cloze-10',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_ERROR_HANDLING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the bare statement that re-raises the current exception unchanged.',
      template: `try:
    risky()
except Exception:
    log_error()
    ___`,
      blanks: ['raise'],
      solution: 'try:\n    risky()\nexcept Exception:\n    log_error()\n    raise',
      explanation:
        'Bare `raise` (no argument) re-raises the CURRENT exception unchanged, preserving the original traceback. `raise SomeError` would create a new exception and lose the original context.',
      hints: ['Same keyword as for throwing — but with no argument.'],
      tags: ['error-handling', 'raise', 're-raise'],
      concepts: ['py-exception-hierarchy'],
    },
  {
      id: 'py-error-handling-parsons-1',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_ERROR_HANDLING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Catch ValueError specifically and print "bad value", letting other exceptions propagate.',
      correctOrder: [
        'try:',
        '    int("xyz")',
        'except ValueError:',
        '    print("bad value")',
      ],
      distractorLines: [
        'except:',
        '    print("any error")',
        'except Exception:',
      ],
      solution: 'try:\n    int("xyz")\nexcept ValueError:\n    print("bad value")',
      explanation:
        'Bare `except:` catches EVERYTHING — including KeyboardInterrupt and SystemExit, which you usually don\'t want. except Exception is safer; except ValueError is the most precise. Always catch the narrowest exception you can handle.',
      hints: ['Catch specific exceptions; bare except is too broad.'],
      tags: ['error-handling', 'except', 'ValueError'],
      concepts: ['py-exception-hierarchy'],
    },
  {
      id: 'py-error-handling-parsons-2',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_ERROR_HANDLING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Use try/except/else: only print "ok" if no exception was raised.',
      correctOrder: [
        'try:',
        '    n = int("42")',
        'except ValueError:',
        '    print("bad")',
        'else:',
        '    print("ok")',
      ],
      distractorLines: [
        '    print("ok")',
        'finally:',
        '    print("ok")',
      ],
      solution:
        'try:\n    n = int("42")\nexcept ValueError:\n    print("bad")\nelse:\n    print("ok")',
      explanation:
        'else runs ONLY if try completed without exception — and runs BEFORE finally. Putting "ok" inside try would also run after a partial success, but else makes the "no errors" path explicit. finally runs always (cleanup).',
      hints: ['else = "no exception raised". Cleaner than putting success code in try.'],
      tags: ['error-handling', 'try-else'],
      concepts: ['py-exception-hierarchy'],
    },
  {
      id: 'py-error-handling-parsons-3',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_ERROR_HANDLING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Add finally to guarantee cleanup runs whether the try succeeds or fails.',
      correctOrder: [
        'try:',
        '    risky()',
        'except Exception:',
        '    print("caught")',
        'finally:',
        '    print("cleanup")',
      ],
      distractorLines: [
        '    print("cleanup")',
        'else:',
        '    print("cleanup")',
      ],
      solution:
        'try:\n    risky()\nexcept Exception:\n    print("caught")\nfinally:\n    print("cleanup")',
      explanation:
        'finally ALWAYS runs — on success, on exception (caught or not), on return inside try. else only runs on success. This is the canonical place for resource cleanup.',
      hints: ['finally always runs; else only on success.'],
      tags: ['error-handling', 'finally'],
      concepts: ['py-exception-hierarchy', 'py-try-finally-ordering'],
    },
  {
      id: 'py-error-handling-parsons-4',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_ERROR_HANDLING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Re-raise an exception with added context using "raise X from e" to preserve the cause.',
      correctOrder: [
        'try:',
        '    int("xyz")',
        'except ValueError as e:',
        '    raise RuntimeError("parse failed") from e',
      ],
      distractorLines: [
        '    raise RuntimeError("parse failed")',
        '    raise',
        '    raise from e',
      ],
      solution:
        'try:\n    int("xyz")\nexcept ValueError as e:\n    raise RuntimeError("parse failed") from e',
      explanation:
        '`raise X from e` chains the original cause — Python prints both tracebacks ("The above exception was the direct cause of the following..."). Plain `raise X` keeps the original as __context__ but doesn\'t flag intent. Use from when you\'re wrapping an underlying error in a higher-level one.',
      hints: ['raise NewError from original_error chains explicitly.'],
      tags: ['error-handling', 'raise-from', 'chaining'],
      concepts: ['py-exception-hierarchy', 'py-raise-vs-reraise'],
    },
  {
      id: 'py-error-handling-parsons-5',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_ERROR_HANDLING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Define a custom exception class that subclasses Exception, then raise an instance of it.',
      correctOrder: [
        'class ConfigError(Exception):',
        '    pass',
        '',
        'raise ConfigError("missing host")',
      ],
      distractorLines: [
        'raise ConfigError',
        'class ConfigError:',
        '    pass',
      ],
      solution:
        'class ConfigError(Exception):\n    pass\n\nraise ConfigError("missing host")',
      explanation:
        'Custom exceptions should subclass Exception (or a more specific built-in like ValueError). Always raise an INSTANCE — `raise ConfigError(msg)` — not the class. Plain `raise ConfigError` is shorthand that creates a no-arg instance, but losing the message is usually unhelpful.',
      hints: ['Subclass Exception; raise an instance with a message.'],
      tags: ['error-handling', 'custom-exception'],
      concepts: ['py-exception-hierarchy'],
    },
  {
      id: 'py-error-handling-parsons-6',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_ERROR_HANDLING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Use except with a tuple to handle multiple exception types in one branch.',
      correctOrder: [
        'try:',
        '    risky()',
        'except (ValueError, TypeError) as e:',
        '    print(f"input error: {e}")',
      ],
      distractorLines: [
        'except ValueError, TypeError as e:',
        'except [ValueError, TypeError] as e:',
      ],
      solution:
        'try:\n    risky()\nexcept (ValueError, TypeError) as e:\n    print(f"input error: {e}")',
      explanation:
        'A TUPLE of exception types catches any of them. The Python 2 syntax `except A, B` is invalid in Python 3 (it would mean "catch A as B"). List form is also wrong — must be a tuple.',
      hints: ['Tuple in parens; not commas without parens or square brackets.'],
      tags: ['error-handling', 'except-tuple'],
      concepts: ['py-exception-hierarchy'],
    },
  {
      id: 'py-error-handling-parsons-7',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_ERROR_HANDLING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Call `risky()` inside a try. On `ValueError`, log by printing `"logging"`, then re-raise the CURRENT exception unchanged (preserving the original traceback) — do NOT construct a new one.',
      correctOrder: [
        'try:',
        '    risky()',
        'except ValueError:',
        '    print("logging")',
        '    raise',
      ],
      distractorLines: [
        '    raise ValueError',
        '    raise Exception',
      ],
      solution:
        'try:\n    risky()\nexcept ValueError:\n    print("logging")\n    raise',
      explanation:
        'Bare `raise` inside an except block re-raises the CURRENT exception unchanged — preserving the original traceback. `raise ValueError` would create a new instance and lose context.',
      hints: ['Bare raise; preserves original traceback.'],
      tags: ['error-handling', 'raise', 'preserve-context'],
      concepts: ['py-exception-hierarchy'],
    },
  {
      id: 'py-error-handling-parsons-8',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_ERROR_HANDLING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Use `except Exception as e` to capture the exception object for logging.',
      correctOrder: [
        'try:',
        '    risky()',
        'except Exception as e:',
        '    print(type(e).__name__, str(e))',
      ],
      distractorLines: [
        'except Exception, e:',
        'except as e:',
      ],
      solution:
        'try:\n    risky()\nexcept Exception as e:\n    print(type(e).__name__, str(e))',
      explanation:
        'except <Type> as <name> binds the exception instance. The Python 2 form `except Exception, e` is invalid in Python 3. The instance is automatically deleted at the end of the except block (to avoid reference-cycle leaks).',
      hints: ['as binds the exception instance; the comma form is Python 2.'],
      tags: ['error-handling', 'as'],
      concepts: ['py-exception-hierarchy'],
    },
  {
      id: 'py-error-handling-parsons-9',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_ERROR_HANDLING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Use try/except/else/finally all in one block, in the correct order.',
      correctOrder: [
        'try:',
        '    n = int(s)',
        'except ValueError:',
        '    print("bad")',
        'else:',
        '    print("ok")',
        'finally:',
        '    print("done")',
      ],
      distractorLines: [
        'finally:',
        'else:',
      ],
      solution:
        'try:\n    n = int(s)\nexcept ValueError:\n    print("bad")\nelse:\n    print("ok")\nfinally:\n    print("done")',
      explanation:
        'Required order: try, then except (one or more), then optional else (only if no except matched), then optional finally (always runs). Reordering would be a SyntaxError.',
      hints: ['Order is fixed: try → except → else → finally.'],
      tags: ['error-handling', 'try-except-else-finally'],
      concepts: ['py-exception-hierarchy'],
    },
  {
      id: 'py-error-handling-parsons-10',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_ERROR_HANDLING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Suppress only KeyError using contextlib.suppress (cleaner than try/except/pass).',
      correctOrder: [
        'from contextlib import suppress',
        '',
        'with suppress(KeyError):',
        '    d = {}',
        '    d["missing"]',
      ],
      distractorLines: [
        'with suppress(Exception):',
        'try:',
        '    d["missing"]',
        'except:',
      ],
      solution:
        'from contextlib import suppress\n\nwith suppress(KeyError):\n    d = {}\n    d["missing"]',
      explanation:
        'suppress(SpecificError) is the clean replacement for `try: ...; except SpecificError: pass`. Less code, more obvious intent. Don\'t use suppress(Exception) — too broad.',
      hints: ['contextlib.suppress(SpecificType) is the clean replacement for try/except/pass.'],
      tags: ['error-handling', 'suppress', 'contextlib'],
      concepts: ['py-exception-hierarchy'],
    },
  {
      id: 'py-error-handling-predict-1',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_ERROR_HANDLING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `try:
    print("a")
    int("xyz")
    print("b")
except ValueError:
    print("c")
finally:
    print("d")`,
      expectedOutput: `a
c
d`,
      explanation:
        '"a" prints, then int("xyz") raises ValueError. "b" never prints — control jumps to except. except prints "c". finally always runs, printing "d".',
      hints: ['Exception jumps out of try immediately; finally always runs.'],
      tags: ['error-handling', 'try-finally'],
      concepts: ['py-exception-hierarchy'],
    },
  {
      id: 'py-error-handling-predict-2',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_ERROR_HANDLING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `try:
    n = int("42")
except ValueError:
    print("bad")
else:
    print("ok")
finally:
    print("done")`,
      expectedOutput: `ok
done`,
      explanation:
        'try succeeds (no exception). except is skipped. else runs because there was no exception — prints "ok". finally runs always — prints "done".',
      hints: ['No exception → except skipped, else runs, finally runs.'],
      tags: ['error-handling', 'try-else-finally'],
      concepts: ['py-exception-hierarchy'],
    },
  {
      id: 'py-error-handling-predict-3',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_ERROR_HANDLING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `def f():
    try:
        return 1
    finally:
        print("finally")
        return 2

print(f())`,
      expectedOutput: `finally
2`,
      explanation:
        'finally runs even when try has a return. The print happens. Then return 2 OVERRIDES the return 1 from try — finally\'s return wins. (This is generally a code smell, but is the actual semantics.)',
      hints: ['finally runs after a try-return; finally\'s return overrides try\'s.'],
      tags: ['error-handling', 'finally', 'return'],
      concepts: ['py-exception-hierarchy', 'py-try-finally-ordering'],
    },
  {
      id: 'py-error-handling-predict-4',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_ERROR_HANDLING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `try:
    int("xyz")
except Exception:
    print("Exception")
except ValueError:
    print("ValueError")`,
      expectedOutput: `Exception`,
      explanation:
        'except clauses are evaluated TOP-DOWN. The first match wins. Exception is a superclass of ValueError, so it catches the error first — and the more-specific ValueError clause is unreachable. Always order from MOST SPECIFIC to most general.',
      hints: ['First matching except wins; specific clauses must come before general ones.'],
      tags: ['error-handling', 'except-order', 'common-mistake'],
      concepts: ['py-exception-hierarchy'],
    },
  {
      id: 'py-error-handling-predict-5',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_ERROR_HANDLING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `try:
    raise ValueError("first")
except ValueError as e:
    print(e)
    raise RuntimeError("second")`,
      expectedOutput: `first`,
      explanation:
        'The first ValueError is raised, caught, and "first" prints. Then `raise RuntimeError("second")` raises a NEW exception that propagates out of the try/except — but since it\'s uncaught, the program terminates with a traceback. Only "first" appears in stdout.',
      hints: ['What appears in stdout when an uncaught exception ends the program?'],
      tags: ['error-handling', 'raise', 'uncaught'],
      concepts: ['py-exception-hierarchy'],
    },
  {
      id: 'py-error-handling-predict-6',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_ERROR_HANDLING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `try:
    try:
        raise ValueError("inner")
    finally:
        print("inner finally")
except ValueError as e:
    print(f"caught {e}")
print("done")`,
      expectedOutput: `inner finally
caught inner
done`,
      explanation:
        'The inner try has no except — but DOES have finally. The ValueError raises, finally runs (prints "inner finally"), then the exception propagates to the outer except. The outer except prints "caught inner". Then "done" prints.',
      hints: ['finally runs before exception propagates outward.'],
      tags: ['error-handling', 'nested', 'finally'],
      concepts: ['py-exception-hierarchy', 'py-try-finally-ordering'],
    },
  {
      id: 'py-error-handling-predict-7',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_ERROR_HANDLING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `class MyError(Exception):
    pass

try:
    raise MyError("custom")
except Exception as e:
    print(type(e).__name__)`,
      expectedOutput: `MyError`,
      explanation:
        'Custom exceptions inherit Exception\'s catch behavior. except Exception catches MyError because it\'s a subclass. type(e).__name__ gives the actual class — MyError.',
      hints: ['Custom exceptions are subclasses; type(e) returns the actual class.'],
      tags: ['error-handling', 'custom-exception', 'inheritance'],
      concepts: ['py-exception-hierarchy', 'py-super-call'],
    },
  {
      id: 'py-error-handling-predict-8',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_ERROR_HANDLING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `from contextlib import suppress

with suppress(KeyError):
    d = {}
    d["missing"]
    print("after error")
print("after with")`,
      expectedOutput: `after with`,
      explanation:
        'd["missing"] raises KeyError. suppress catches it and the with-block EXITS. "after error" never runs. Then "after with" prints normally outside.',
      hints: ['suppress exits the with-block on the listed exception.'],
      tags: ['error-handling', 'suppress'],
      concepts: ['py-exception-hierarchy'],
    },
  {
      id: 'py-error-handling-predict-9',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_ERROR_HANDLING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `try:
    raise IndexError("oops")
except (ValueError, IndexError) as e:
    print(f"caught {type(e).__name__}")`,
      expectedOutput: `caught IndexError`,
      explanation:
        'A tuple of exception types catches if the raised exception matches ANY of them. IndexError matches, so it\'s caught and bound to e.',
      hints: ['Tuple of exception types = OR.'],
      tags: ['error-handling', 'except-tuple'],
      concepts: ['py-exception-hierarchy'],
    },
  {
      id: 'py-error-handling-predict-10',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_ERROR_HANDLING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `try:
    try:
        int("xyz")
    except ValueError as e:
        raise RuntimeError("wrapped") from e
except RuntimeError as e:
    print(type(e.__cause__).__name__)`,
      expectedOutput: `ValueError`,
      explanation:
        '`raise X from e` sets the new exception\'s __cause__ to e. The outer except catches RuntimeError and inspects e.__cause__ — which is the original ValueError. This is how exception chaining preserves the original error.',
      hints: ['raise X from e sets __cause__ on the new exception.'],
      tags: ['error-handling', 'raise-from', '__cause__'],
      concepts: ['py-exception-hierarchy', 'py-raise-vs-reraise'],
    },
  {
      id: 'pcpp-exc-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_ERROR_HANDLING,
      course: Course.BACKEND,
      question: 'What is exception chaining in Python and how do you use it?',
      options: [
        { id: 'a', text: 'Catching multiple exception types in one `except` clause', isCorrect: false },
        { id: 'b', text: 'Using `raise NewException(...) from original_exception` to link exceptions together', isCorrect: true },
        { id: 'c', text: 'Defining a hierarchy of exception classes', isCorrect: false },
        { id: 'd', text: 'Catching an exception and immediately re-raising it', isCorrect: false },
      ],
      explanation: 'Exception chaining with `raise X from Y` explicitly links two exceptions. The new exception stores the original as `__cause__`. Python also does implicit chaining when an exception is raised inside an `except` block (stored in `__context__`). Use `raise X from None` to suppress the chain and hide the original exception.',
      hints: [
        '`raise NewError("msg") from original_error`',
        'The original is stored in `__cause__` attribute',
      ],
      tags: ['exceptions', 'chaining', 'raise', '__cause__', '__context__'],
      concepts: ['py-exception-hierarchy'],
    },
  {
      id: 'pcpp-exc-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_ERROR_HANDLING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Define a custom exception hierarchy: a base `AppError` inheriting from `Exception`, and two subclasses `DatabaseError` and `NetworkError` both inheriting from `AppError`. Write a function `connect_to_server` taking a `host` string. Inside it, raise `ConnectionRefusedError` whose message is `"Cannot connect to "` + host, catch that exception, and CHAIN it — re-raise it as a `NetworkError` whose message is `"Connection failed: "` + host, preserving the original as the cause (use the `raise ... from ...` syntax). Then call `connect_to_server("db.example.com")` inside a `try/except NetworkError as e` that prints two lines: the caught error (prefixed by `"NetworkError: "`) and the chained cause (prefixed by `"Caused by: "`, accessed via the exception\'s `__cause__` attribute).',
      starterCode: `# Define AppError(Exception); DatabaseError(AppError); NetworkError(AppError)


# Define connect_to_server(host):
#   raise ConnectionRefusedError(f"Cannot connect to {host}")
#   catch it and re-raise as NetworkError(f"Connection failed: {host}") from e


# Call it inside try/except NetworkError as e; print "NetworkError: {e}"
# and "Caused by: {e.__cause__}"
`,
      testCases: [
        { input: '', expectedOutput: 'NetworkError: Connection failed: db.example.com\nCaused by: Cannot connect to db.example.com', description: 'Should show chained exceptions' },
      ],
      solution: `class AppError(Exception):
    pass

class DatabaseError(AppError):
    pass

class NetworkError(AppError):
    pass

def connect_to_server(host):
    try:
        raise ConnectionRefusedError(f"Cannot connect to {host}")
    except ConnectionRefusedError as e:
        raise NetworkError(f"Connection failed: {host}") from e

try:
    connect_to_server("db.example.com")
except NetworkError as e:
    print(f"NetworkError: {e}")
    print(f"Caused by: {e.__cause__}")`,
      explanation: '`raise NetworkError(...) from e` chains the exceptions. The `NetworkError` instance gets `__cause__ = e`. This preserves the full context — you can see both the high-level error (NetworkError) and the root cause (ConnectionRefusedError). Custom exception hierarchies let callers catch at different granularities: `except AppError` catches both database and network errors.',
      hints: [
        'Use `raise NetworkError(...) from e` inside the except block',
        'Access the cause with `e.__cause__`',
      ],
      tieredHints: {
        apiSignature: 'raise ExceptionType(*args) from cause',
        skeleton: `class AppError(Exception):
    pass

class DatabaseError(____):
    pass

class NetworkError(____):
    pass

def connect_to_server(host):
    try:
        raise ____(f"____ {host}")
    except ____ as e:
        raise ____(f"____ {host}") ____ e

try:
    connect_to_server("db.example.com")
except ____ as e:
    print(f"NetworkError: {e}")
    print(f"Caused by: {e.____}")`,
      },
      tags: ['exceptions', 'chaining', 'custom-exceptions', 'hierarchy', '__cause__'],
      concepts: ['py-exception-hierarchy'],
    },
  {
      id: 'pcpp-exc-3',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_ERROR_HANDLING,
      course: Course.BACKEND,
      question: 'What named attributes does an exception object have for accessing error details?',
      options: [
        { id: 'a', text: 'Only `message` and `code`', isCorrect: false },
        { id: 'b', text: '`args` (tuple of arguments), `__cause__`, `__context__`, and `__traceback__`', isCorrect: true },
        { id: 'c', text: 'Only `__str__` and `__repr__`', isCorrect: false },
        { id: 'd', text: '`text`, `line`, and `file`', isCorrect: false },
      ],
      explanation: 'Exception objects have: `args` (tuple of all arguments passed to the constructor), `__cause__` (explicit chain from `raise X from Y`), `__context__` (implicit chain from exception raised in except block), `__traceback__` (the traceback object). For `ValueError("bad input")`, `e.args` would be `("bad input",)`.',
      hints: [
        '`e.args` gives you the arguments passed to the exception constructor',
        '`e.__traceback__` is a traceback object — pass it to `traceback` module',
      ],
      tags: ['exceptions', 'args', '__cause__', '__traceback__', 'attributes'],
      concepts: ['py-exception-hierarchy'],
    },
  {
      id: 'pcpp-exc-4',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_ERROR_HANDLING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Define a custom exception class `DivisionByZeroError` inheriting from `ValueError`. Write a function `safe_divide(a, b)` that returns `a / b`, but catches Python\'s built-in `ZeroDivisionError` and instead raises the custom class whose message is `"Cannot divide "` + a + `" by zero"`. Demonstrate it three ways: (1) print the result of dividing 10 by 2 (expect `5.0`); (2) call it with 5 and 0 inside a `try/except` catching the CUSTOM class as `e` and print `"Custom: "` + str(e); (3) call it with 5 and 0 AGAIN inside a `try/except` catching the PARENT class (`ValueError`) as `e` and print `"ValueError: "` + str(e) — showing both levels of the hierarchy catch it.',
      starterCode: `# Define DivisionByZeroError(ValueError)


# Define safe_divide(a, b):
#   try return a / b
#   except ZeroDivisionError: raise DivisionByZeroError(f"Cannot divide {a} by zero")


# Print safe_divide(10, 2)
# Call safe_divide(5, 0) inside try/except DivisionByZeroError → print "Custom: {e}"
# Call it again inside try/except ValueError → print "ValueError: {e}"
`,
      testCases: [
        { input: '', expectedOutput: '5.0\nCustom: Cannot divide 5 by zero\nValueError: Cannot divide 5 by zero', description: 'Should catch at both levels of hierarchy' },
      ],
      solution: `class DivisionByZeroError(ValueError):
    pass

def safe_divide(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        raise DivisionByZeroError(f"Cannot divide {a} by zero")

print(safe_divide(10, 2))

try:
    safe_divide(5, 0)
except DivisionByZeroError as e:
    print(f"Custom: {e}")

try:
    safe_divide(5, 0)
except ValueError as e:
    print(f"ValueError: {e}")`,
      explanation: 'Because `DivisionByZeroError` inherits from `ValueError`, it can be caught by either `except DivisionByZeroError` or `except ValueError`. Callers that care about the specific error catch `DivisionByZeroError`; generic callers can catch `ValueError`. This is the power of exception hierarchies.',
      hints: [
        'Raise `DivisionByZeroError(f"Cannot divide {a} by zero")`',
        'Subclasses can be caught by parent `except` clauses',
      ],
      tieredHints: {
        apiSignature: 'class Subclass(ParentClass): ...',
        skeleton: `class DivisionByZeroError(____):
    pass

def safe_divide(a, b):
    try:
        return a / b
    except ____:
        raise ____(f"Cannot divide {a} by zero")

print(safe_divide(10, 2))

try:
    safe_divide(5, 0)
except DivisionByZeroError as e:
    print(f"Custom: {e}")

try:
    safe_divide(5, 0)
except ____ as e:
    print(f"ValueError: {e}")`,
      },
      tags: ['exceptions', 'custom-exceptions', 'ValueError', 'hierarchy', 'safe-divide'],
      concepts: ['py-exception-hierarchy'],
    },
];
