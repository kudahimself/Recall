/**
 * Topic.PY_LOGGING — all question types for this topic.
 * Auto-consolidated by scripts/consolidate-by-topic.js from:
 *   pyLoggingCloze.ts (10), pythonMasteryTier1Questions.ts (6)
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const py_logging_questions: Question[] = [
  {
      id: 'py-logging-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_LOGGING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the canonical way to get a module-scoped logger.',
      template: `import logging

logger = logging.___(___)`,
      blanks: ['getLogger', '__name__'],
      solution: 'import logging\n\nlogger = logging.getLogger(__name__)',
      explanation:
        'logging.getLogger(__name__) gives each module its own logger named after the module path. This lets ops filter/route logs per module via logging config without code changes. Plain logging.info uses the root logger — bad practice in libraries.',
      hints: ['Camel-case getter; magic-name dunder.'],
      tags: ['logging', 'getLogger'],
      concepts: ['py-logging-config'],
    },
  {
      id: 'py-logging-cloze-2',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_LOGGING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the one-shot configuration call and the level constant for "everything from DEBUG up".',
      template: `import logging

logging.___(level=logging.___)`,
      blanks: ['basicConfig', 'DEBUG'],
      solution: 'import logging\n\nlogging.basicConfig(level=logging.DEBUG)',
      explanation:
        'basicConfig sets up a default StreamHandler on the root logger. Levels (in increasing severity): DEBUG < INFO < WARNING < ERROR < CRITICAL. Setting DEBUG enables ALL messages.',
      hints: ['CamelCase: "basic" + "Config"; UPPERCASE log-level constant.'],
      tags: ['logging', 'basicConfig'],
      concepts: ['py-logging-config'],
    },
  {
      id: 'py-logging-cloze-3',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_LOGGING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the kwarg for lazy %-style formatting (DO NOT pre-format the message).',
      template: `logger.info("user %s logged in", ___)`,
      blanks: ['username'],
      solution: 'logger.info("user %s logged in", username)',
      explanation:
        'Pass the value as a separate arg — the logger only formats the string if the message will actually be emitted (level enabled, handler attached). Pre-formatting with f-strings or % wastes CPU on filtered-out messages.',
      hints: ['The variable being interpolated, passed as the second positional arg.'],
      tags: ['logging', 'lazy-formatting'],
      concepts: ['py-logging-config'],
    },
  {
      id: 'py-logging-cloze-4',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_LOGGING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the kwarg that attaches the current exception traceback to a log record.',
      template: `try:
    risky()
except Exception:
    logger.error("oops", ___=True)`,
      blanks: ['exc_info'],
      solution:
        'try:\n    risky()\nexcept Exception:\n    logger.error("oops", exc_info=True)',
      explanation:
        'exc_info=True grabs sys.exc_info() and renders the traceback into the log record. logger.exception("oops") is shorthand for the same — only valid inside an except block.',
      hints: ['Snake-case: "exc" + "_info".'],
      tags: ['logging', 'exception', 'exc_info'],
      concepts: ['py-logging-config', 'py-exception-hierarchy'],
    },
  {
      id: 'py-logging-cloze-5',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_LOGGING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the convenience method that logs at ERROR with traceback (only valid inside except).',
      template: `try:
    risky()
except Exception:
    logger.___("call to risky failed")`,
      blanks: ['exception'],
      solution:
        'try:\n    risky()\nexcept Exception:\n    logger.exception("call to risky failed")',
      explanation:
        'logger.exception is exactly logger.error(..., exc_info=True). Use it inside except blocks; outside, exc_info is None and the traceback line is suppressed.',
      hints: ['Same name as the Python builtin base class for raises.'],
      tags: ['logging', 'exception'],
      concepts: ['py-logging-config', 'py-exception-hierarchy'],
    },
  {
      id: 'py-logging-cloze-6',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_LOGGING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the handler class that writes log records to a file.',
      template: `import logging

handler = logging.___("/var/log/app.log")
logger.addHandler(handler)`,
      blanks: ['FileHandler'],
      solution:
        'import logging\n\nhandler = logging.FileHandler("/var/log/app.log")\nlogger.addHandler(handler)',
      explanation:
        'FileHandler appends to a file. StreamHandler writes to a stream (default stderr). RotatingFileHandler / TimedRotatingFileHandler (in logging.handlers) add rotation.',
      hints: ['CamelCase: "File" + "Handler".'],
      tags: ['logging', 'FileHandler'],
      concepts: ['py-logging-config'],
    },
  {
      id: 'py-logging-cloze-7',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_LOGGING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the class that defines the log line layout, then attach it to a handler.',
      template: `import logging

fmt = logging.___("%(asctime)s %(levelname)s %(name)s: %(message)s")
handler = logging.StreamHandler()
handler.___(fmt)`,
      blanks: ['Formatter', 'setFormatter'],
      solution:
        'import logging\n\nfmt = logging.Formatter("%(asctime)s %(levelname)s %(name)s: %(message)s")\nhandler = logging.StreamHandler()\nhandler.setFormatter(fmt)',
      explanation:
        'Formatter renders LogRecord attributes via %-style placeholders. setFormatter attaches it to a handler — each handler can have a different format (e.g. plain text on stderr, JSON to a file).',
      hints: ['CamelCase class; camelCase setter.'],
      tags: ['logging', 'Formatter'],
      concepts: ['py-logging-config'],
    },
  {
      id: 'py-logging-cloze-8',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_LOGGING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the dict-based config function for the logging system.',
      template: `from logging.config import ___

___({
    "version": 1,
    "loggers": {"": {"level": "INFO"}},
})`,
      blanks: ['dictConfig', 'dictConfig'],
      solution:
        'from logging.config import dictConfig\n\ndictConfig({\n    "version": 1,\n    "loggers": {"": {"level": "INFO"}},\n})',
      explanation:
        'dictConfig is the canonical way to configure logging from JSON/YAML/TOML in production — single source of truth for handlers, formatters, and per-logger levels. fileConfig (older, ConfigParser-based) is mostly deprecated.',
      hints: ['Snake-then-camel: "dict" + "Config".'],
      tags: ['logging', 'dictConfig'],
      concepts: ['py-logging-config'],
    },
  {
      id: 'py-logging-cloze-9',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_LOGGING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the level constant that means "things still working but worth noting".',
      template: `logger.log(logging.___, "deprecated API used")`,
      blanks: ['WARNING'],
      solution: 'logger.log(logging.WARNING, "deprecated API used")',
      explanation:
        'WARNING is the default root level — if you have not configured logging, only WARNING and above appear. INFO is for normal-flow notes; ERROR is for actual failures.',
      hints: ['UPPERCASE; between INFO and ERROR.'],
      tags: ['logging', 'levels', 'WARNING'],
      concepts: ['py-logging-config'],
    },
  {
      id: 'py-logging-cloze-10',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_LOGGING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the kwarg that prevents a logger from passing records up to its parent loggers.',
      template: `logger = logging.getLogger("audit")
logger.___ = False`,
      blanks: ['propagate'],
      solution: 'logger = logging.getLogger("audit")\nlogger.propagate = False',
      explanation:
        'By default, log records propagate up the dotted-name hierarchy ("a.b" → "a" → root). Setting propagate=False stops propagation — useful for audit logs that should ONLY hit a dedicated handler, not the global one.',
      hints: ['Nine-letter lowercase.'],
      tags: ['logging', 'propagate', 'hierarchy'],
      concepts: ['py-logging-config'],
    },
  {
      id: 'py-logging-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_LOGGING,
      course: Course.BACKEND,
      question: 'Why prefer the `logging` module over `print()` for production code?',
      options: [
        { id: 'a', text: '`print()` is faster and safer in production', isCorrect: false },
        { id: 'b', text: '`logging` has configurable levels (DEBUG/INFO/WARNING/ERROR/CRITICAL), per-module loggers, structured output via handlers/formatters, and can be redirected to files/network/stderr without touching call sites', isCorrect: true },
        { id: 'c', text: '`logging` auto-encrypts all messages', isCorrect: false },
        { id: 'd', text: 'They are equivalent — use whichever you prefer', isCorrect: false },
      ],
      explanation: '`print` always goes to stdout and has no levels or metadata. `logging` separates WHAT you log (at the call site) from WHERE/HOW it goes (configured once at app boundary). Levels let ops silence DEBUG in prod; handlers let the same call go to file, console, syslog, Sentry; formatters add timestamps, module, line numbers. Using `logger = logging.getLogger(__name__)` gives you a hierarchy you can filter.',
      hints: [
        'Levels: DEBUG < INFO < WARNING < ERROR < CRITICAL',
        '`getLogger(__name__)` creates a module-scoped logger',
        'Handlers send records somewhere; formatters decide how they look',
      ],
      tags: ['logging', 'basics', 'best-practice'],
      concepts: ['py-logging-config'],
    },
  {
      id: 'py-logging-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_LOGGING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Configure the root logger at INFO level via `basicConfig`, then obtain a module-scoped logger named by the current module (using `__name__`). Emit three messages — a debug with text `"debug skipped"`, an info with text `"hello"`, and a warning with text `"heads up"`. Because the threshold is INFO, only the info and warning lines should actually appear — the debug must be filtered out.',
      starterCode: `import logging
  `,
      testCases: [
        {
          input: 'INFO level filter',
          expectedOutput: 'info "hello" and warning "heads up" emitted; debug filtered out',
          description: 'basicConfig(level=INFO) silences DEBUG',
        },
      ],
      solution: `import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

logger.debug("debug skipped")
logger.info("hello")
logger.warning("heads up")`,
      explanation: '`basicConfig` sets up the root logger once. `getLogger(__name__)` gives you a logger named for the current module — essential for hierarchical config later. Levels set at each logger filter messages below that threshold; DEBUG is below INFO so `logger.debug` is dropped.',
      hints: [
        'basicConfig(level=logging.INFO) once at program start',
        'getLogger(__name__) per module',
        'Call logger.debug / info / warning — messages are filtered by level',
      ],
      tieredHints: {
        apiSignature: 'logging.basicConfig(*, filename=None, filemode="a", format=None, datefmt=None, level=None, stream=None, handlers=None, force=None, encoding=None, errors=None)',
        skeleton: `import logging

logging.____(level=logging.INFO)
logger = logging.____(__name__)

logger.____("debug skipped")
logger.____("hello")
logger.____("heads up")`,
      },
      tags: ['logging', 'basicConfig', 'getLogger', 'levels'],
      concepts: ['py-logging-config'],
    },
  {
      id: 'py-logging-3',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_LOGGING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Obtain a logger named `"payments"` and set its threshold to DEBUG. Attach a stream handler to it, and give that handler a formatter whose format string is `"%(asctime)s [%(levelname)s] %(name)s: %(message)s"`. Emit an info message with the text `"processed 42"`. The output line should include a timestamp, the level name, the logger name `payments`, and the message.',
      starterCode: `import logging
  `,
      testCases: [
        {
          input: 'structured formatter',
          expectedOutput: '<timestamp> [INFO] payments: processed 42',
          description: 'Formatter produces structured line output',
        },
      ],
      solution: `import logging

logger = logging.getLogger("payments")
logger.setLevel(logging.DEBUG)

handler = logging.StreamHandler()
handler.setFormatter(logging.Formatter("%(asctime)s [%(levelname)s] %(name)s: %(message)s"))
logger.addHandler(handler)

logger.info("processed 42")`,
      explanation: 'Each LogRecord carries metadata (name, level, timestamp, message). Formatter turns those fields into text via %-style placeholders. Attaching handlers to the specific logger (not root) lets different loggers format differently — e.g. JSON for "audit", plain for "app".',
      hints: [
        'setLevel on the logger controls which records propagate',
        'Formatter fields: %(asctime)s, %(levelname)s, %(name)s, %(message)s',
        'Handler.setFormatter attaches the formatter to that one handler',
      ],
      tieredHints: {
        apiSignature: 'logging.Formatter(fmt=None, datefmt=None, style="%", validate=True, *, defaults=None)',
        skeleton: `import logging

logger = logging.getLogger("payments")
logger.____(logging.DEBUG)

handler = logging.____()
handler.____(logging.____("%(asctime)s [%(levelname)s] %(name)s: %(message)s"))
logger.____(handler)

logger.info("processed 42")`,
      },
      tags: ['logging', 'Formatter', 'StreamHandler', 'handlers'],
      concepts: ['py-logging-config'],
    },
  {
      id: 'py-logging-4',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_LOGGING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Configure logging at ERROR level and obtain a module-scoped logger (named via `__name__`). Inside a `try/except Exception` block, raise `ValueError("bad id")` in the try-body; in the except branch, log `"query failed"` using the logger method that automatically attaches the current exception\'s traceback to the record (equivalent to calling the error method with `exc_info=True`).',
      starterCode: `import logging
  `,
      testCases: [
        {
          input: 'exception in try block',
          expectedOutput: 'ERROR message "query failed" + full traceback of ValueError',
          description: 'logger.exception adds traceback automatically',
        },
      ],
      solution: `import logging

logging.basicConfig(level=logging.ERROR)
logger = logging.getLogger(__name__)

try:
    raise ValueError("bad id")
except Exception:
    logger.exception("query failed")`,
      explanation: '`logger.exception` is the convention for logging inside an except block — it captures the active exception and appends the traceback to the record. Using `logger.error("...", exc_info=True)` is equivalent. Never log with plain `error(str(e))` and lose the traceback — you will regret it during incidents.',
      hints: [
        'logger.exception is like logger.error but with exc_info=True',
        'Must be called inside an except block',
        'Traceback is attached to the LogRecord automatically',
      ],
      tieredHints: {
        apiSignature: 'logger.exception(msg, *args, exc_info=True, stack_info=False, stacklevel=1, extra=None)',
        skeleton: `import logging

logging.____(level=logging.ERROR)
logger = logging.____(__name__)

try:
    ____ ValueError("bad id")
except Exception:
    logger.____("query failed")`,
      },
      tags: ['logging', 'exception', 'traceback', 'exc_info'],
      concepts: ['py-logging-config', 'py-exception-hierarchy'],
    },
  {
      id: 'py-logging-5',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_LOGGING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Configure logging at INFO level and obtain a module-scoped logger. Declare `user_id = 42` and `ip = "10.0.0.1"`. Emit an INFO message that produces the text `"user 42 logged in from 10.0.0.1"` — but use LAZY formatting (pass the format string and the values as SEPARATE args, not an f-string) so interpolation only happens if the record is actually emitted. Linters (ruff/pylint) flag f-strings in log calls for this reason.',
      starterCode: `import logging
  `,
      testCases: [
        {
          input: 'lazy interpolation',
          expectedOutput: 'INFO line "user 42 logged in from 10.0.0.1"',
          description: 'Format string + args, not f-string',
        },
      ],
      solution: `import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

user_id = 42
ip = "10.0.0.1"
logger.info("user %s logged in from %s", user_id, ip)`,
      explanation: 'Passing args to the logger lets it defer interpolation until/unless the record is actually emitted. With `logger.debug(f"expensive {serialise(big_obj)}")` the serialisation runs whether or not DEBUG is enabled. With `logger.debug("expensive %s", serialise(big_obj))`, the serialisation still runs (Python evaluates args eagerly) — but if you pass a lazy wrapper or use `%s` with the object directly (so its `__str__` runs inside the logger), you only pay when needed. Ruff/pylint flag f-strings in log calls for this reason.',
      hints: [
        'Format string first, values after as positional args',
        'Use %s / %d / %r placeholders',
        'Linters (pylint/ruff) enforce this — f-strings in log calls are a warning',
      ],
      tieredHints: {
        apiSignature: 'logger.info(msg, *args, exc_info=None, stack_info=False, stacklevel=1, extra=None)',
        skeleton: `import logging

logging.____(level=logging.INFO)
logger = logging.____(__name__)

user_id = 42
ip = "10.0.0.1"
logger.____("user %s logged in from %s", ____, ____)`,
      },
      tags: ['logging', 'format-string', 'lazy-evaluation', 'lazy-formatting', 'best-practice'],
      concepts: ['py-logging-config'],
    },
  {
      id: 'py-logging-6',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_LOGGING,
      course: Course.BACKEND,
      question: 'You call `logging.getLogger("app.db")` in one module and `logging.getLogger("app")` in another. How are the two loggers related?',
      options: [
        { id: 'a', text: 'They are unrelated — names are just strings', isCorrect: false },
        { id: 'b', text: 'Dotted names create a hierarchy: "app.db" is a child of "app", which is a child of the root logger. Child loggers inherit effective level and propagate records up to ancestor handlers unless you set `propagate=False`.', isCorrect: true },
        { id: 'c', text: 'The second call overwrites the first', isCorrect: false },
        { id: 'd', text: 'The hierarchy only exists when you explicitly call `addChild`', isCorrect: false },
      ],
      explanation: 'Logger names with dots build a tree: root → "app" → "app.db". If you set the level on "app", "app.db" inherits it (unless it sets its own). A handler on "app" also sees records from "app.db" because they propagate upward. This is how you configure once and control all child modules. Set `logger.propagate = False` on a noisy subtree to stop it reaching ancestor handlers.',
      hints: [
        'Dotted names = parent/child relationship',
        'Level and propagation both cascade upward unless overridden',
        '`propagate=False` stops records from climbing the tree',
      ],
      tags: ['logging', 'hierarchy', 'propagate', 'getLogger'],
      concepts: ['py-logging-config'],
    },
  {
      id: 'py-logging-parsons-1',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_LOGGING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Assemble a minimal logging setup: configure the root logger at INFO level, then obtain a module-scoped logger (named via `__name__`), then emit an info message reading `service started`. Put the config call before the getLogger call.',
      correctOrder: [
        'import logging',
        'logging.basicConfig(level=logging.INFO)',
        'logger = logging.getLogger(__name__)',
        'logger.info("service started")',
      ],
      distractorLines: [
        'logger = logging.Logger(__name__)',
        'logger.log("service started")',
      ],
      solution:
        'import logging\nlogging.basicConfig(level=logging.INFO)\nlogger = logging.getLogger(__name__)\nlogger.info("service started")',
      explanation:
        'Always go through logging.getLogger(__name__) — never instantiate logging.Logger() directly, since getLogger returns the shared, hierarchy-registered instance. basicConfig configures the root once; getLogger gives you the module-named logger. logger.log needs a level as its first arg, so logger.info(...) is the direct call here.',
      hints: ['basicConfig first, then getLogger(__name__), then logger.info.'],
      tags: ['logging', 'getLogger', 'basicConfig'],
      concepts: ['py-logging-config'],
    },
  {
      id: 'py-logging-parsons-2',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_LOGGING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Assemble code that gets a logger named `payments`, creates a stream handler, gives that handler a formatter with format string `%(levelname)s: %(message)s`, and attaches the handler to the logger. Create the handler, set its formatter, then add it to the logger.',
      correctOrder: [
        'import logging',
        'logger = logging.getLogger("payments")',
        'handler = logging.StreamHandler()',
        'handler.setFormatter(logging.Formatter("%(levelname)s: %(message)s"))',
        'logger.addHandler(handler)',
      ],
      distractorLines: [
        'logger.setFormatter(logging.Formatter("%(levelname)s: %(message)s"))',
        'logger.addFormatter(handler)',
      ],
      solution:
        'import logging\nlogger = logging.getLogger("payments")\nhandler = logging.StreamHandler()\nhandler.setFormatter(logging.Formatter("%(levelname)s: %(message)s"))\nlogger.addHandler(handler)',
      explanation:
        'The formatter is set on the HANDLER (handler.setFormatter), not the logger — a logger can own several handlers, each formatting differently. The logger only gains the handler via logger.addHandler. There is no logger.setFormatter or logger.addFormatter.',
      hints: ['Formatter goes on the handler; the handler goes on the logger.'],
      tags: ['logging', 'StreamHandler', 'Formatter', 'addHandler'],
      concepts: ['py-logging-config'],
    },
  {
      id: 'py-logging-parsons-3',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_LOGGING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'A call to `risky()` may raise. Assemble code that gets a module-scoped logger, calls `risky()` inside a try block, and in the except branch logs the message `risky() failed` using the logger method that automatically attaches the active exception\'s traceback to the record.',
      correctOrder: [
        'import logging',
        'logger = logging.getLogger(__name__)',
        'try:',
        '    risky()',
        'except Exception:',
        '    logger.exception("risky() failed")',
      ],
      distractorLines: [
        '    logger.error("risky() failed")',
        '    logger.exception()',
      ],
      solution:
        'import logging\nlogger = logging.getLogger(__name__)\ntry:\n    risky()\nexcept Exception:\n    logger.exception("risky() failed")',
      explanation:
        'logger.exception(msg) logs at ERROR and attaches the current traceback (it is logger.error(msg, exc_info=True)). Plain logger.error(msg) drops the traceback — the single most common logging mistake during incidents. logger.exception still requires a message argument.',
      hints: ['The convenience method that captures the traceback, valid only inside except.'],
      tags: ['logging', 'exception', 'traceback'],
      concepts: ['py-logging-config', 'py-exception-hierarchy'],
    },
  {
      id: 'py-logging-predict-1',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_LOGGING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `import logging

logging.basicConfig(level=logging.WARNING)
logging.info("starting up")
logging.warning("low disk space")
logging.error("write failed")`,
      expectedOutput: `WARNING:root:low disk space
ERROR:root:write failed`,
      explanation:
        'basicConfig sets the root level to WARNING and installs a handler with the default format "%(levelname)s:%(name)s:%(message)s". INFO is below WARNING so "starting up" is filtered out. The module-level calls use the root logger, hence the name "root".',
      hints: ['INFO < WARNING is dropped; the default basicConfig format is LEVEL:name:message.'],
      tags: ['logging', 'levels', 'basicConfig'],
      concepts: ['py-logging-config'],
    },
  {
      id: 'py-logging-predict-2',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_LOGGING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `import logging

logging.basicConfig(level=logging.INFO)
logging.info("user %s has %d items", "alice", 3)`,
      expectedOutput: `INFO:root:user alice has 3 items`,
      explanation:
        'The logger does %-style interpolation lazily: "%s" takes the string "alice" and "%d" takes the int 3, producing "user alice has 3 items". The default format prefixes LEVEL:name, giving INFO:root:user alice has 3 items.',
      hints: ['%s -> "alice", %d -> 3, interpolated by the logger itself.'],
      tags: ['logging', 'lazy-formatting'],
      concepts: ['py-logging-config'],
    },
  {
      id: 'py-logging-predict-3',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_LOGGING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger("app")
logger.setLevel(logging.ERROR)
logger.warning("careful")
logger.error("boom")`,
      expectedOutput: `ERROR:app:boom`,
      explanation:
        'The "app" logger sets its own level to ERROR, so it filters records BEFORE they propagate — WARNING < ERROR, so "careful" never reaches root\'s handler. "boom" passes and propagates up to the root handler installed by basicConfig. The emitted line shows the originating logger\'s name ("app"), not "root", even though the handler lives on root.',
      hints: ['setLevel on the logger filters first; the record still shows the logger that created it.'],
      tags: ['logging', 'setLevel', 'levels', 'hierarchy'],
      concepts: ['py-logging-config'],
    },
];
