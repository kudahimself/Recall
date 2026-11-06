/**
 * Topic.DJ_MONITORING — all question types for this topic.
 * Auto-consolidated by scripts/consolidate-by-topic.js from:
 *   backendInfraQuestions.ts (3)
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const dj_monitoring_questions: Question[] = [
  {
      id: 'be-infra-monitoring-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_MONITORING,
      course: Course.BACKEND,
      question: 'What is structured logging and why should you use it over print() statements?',
      options: [
        { id: 'a', text: 'It outputs JSON with consistent fields (timestamp, level, request_id), so log aggregators can search, filter, and alert on them', isCorrect: true },
        { id: 'b', text: 'print() is actually better in production because its output appears immediately instead of being buffered', isCorrect: false },
        { id: 'c', text: 'Structured logging only matters at the scale of millions of users — below that, plain text logs are equivalent', isCorrect: false },
        { id: 'd', text: 'They are functionally identical — the logging module just prepends a timestamp to each print-style message', isCorrect: false },
      ],
      explanation: 'When debugging production issues, you need to answer questions like "show me all errors for user 42 in the last hour." With print(), output is plain text mixed with other output — unsearchable. Structured logging produces {"timestamp": "2024-01-15T10:30:00Z", "level": "ERROR", "user_id": 42, "request_id": "abc123", "message": "Payment failed"} — every field is queryable. Log levels (DEBUG, INFO, WARNING, ERROR, CRITICAL) let you filter noise. Log handlers can route to files, email, Sentry, or monitoring dashboards simultaneously.',
      tags: ['logging', 'structured-logging', 'monitoring', 'production'],
      concepts: ['py-logging-config'],
    },
  {
      id: 'dj-monitoring-extra-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_MONITORING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Fill in the kwarg that attaches structured context fields to a log record.',
      template: `logger.info(
    "Order creation started",
    ___={"user_id": user.id, "items_count": 3},
)`,
      blanks: ['extra'],
      solution: 'logger.info(\n    "Order creation started",\n    extra={"user_id": user.id, "items_count": 3},\n)',
      explanation: '`extra={...}` attaches arbitrary key/value context to a log record without baking it into the message string. A formatter or structured-logging handler (e.g. JSON output) can then include those fields as separate, queryable attributes rather than embedded text.',
      hints: ['Keyword arg name on logger.info/error/etc.'],
      tags: ['logging', 'extra', 'cloze'],
      concepts: ['py-logging-config'],
    },
  {
      id: 'be-infra-monitoring-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_MONITORING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write a DRF `APIView` named `OrderView` that logs through the `"myapp"` logger from the starter. Assume `create_order(user, items)` already exists: it returns an order with an `id`, or raises an exception. In `post`, first log the INFO message "Order creation started" with `extra` fields `user_id` (the requesting user\'s id) and `items_count` (how many items the request data holds under "items"). Then pass the user and those items to `create_order`. If it succeeds, log the INFO message "Order created successfully" with `extra` fields `user_id` and `order_id`, and return a 201 response whose body holds the new `order_id`. If it raises any exception, log "Order creation failed" at ERROR level with the traceback attached and `extra` fields `user_id` and `error` (the exception as a string), and return a 400 response whose body maps `error` to "Order failed".',
      starterCode: `import logging
from rest_framework.views import APIView
from rest_framework.response import Response

logger = logging.getLogger("myapp")

# Implement OrderView with logging extra details
`,
      testCases: [
        {
          input: 'OrderView logging',
          expectedOutput: 'API view post method with info/error logging and extra parameters',
          description: 'Should demonstrate using a logger inside a view with extra context and exc_info',
        },
      ],
      solution: `import logging
from rest_framework.views import APIView
from rest_framework.response import Response

logger = logging.getLogger("myapp")

class OrderView(APIView):
    def post(self, request):
        logger.info(
            "Order creation started",
            extra={"user_id": request.user.id, "items_count": len(request.data.get("items", []))},
        )

        try:
            order = create_order(request.user, request.data["items"])
            logger.info(
                "Order created successfully",
                extra={"user_id": request.user.id, "order_id": order.id},
            )
            return Response({"order_id": order.id}, status=201)

        except Exception as e:
            logger.error(
                "Order creation failed",
                extra={"user_id": request.user.id, "error": str(e)},
                exc_info=True,  # includes full stack trace
            )
            return Response({"error": "Order failed"}, status=400)
# OR
import logging
from rest_framework.views import APIView
from rest_framework.response import Response

logger = logging.getLogger("myapp")

class OrderView(APIView):
    def post(self, request):
        items = request.data["items"]
        logger.info("Order creation started", extra={"user_id": request.user.id, "items_count": len(items)})
        try:
            order = create_order(request.user, items)
        except Exception as e:
            logger.exception("Order creation failed", extra={"user_id": request.user.id, "error": str(e)})
            return Response({"error": "Order failed"}, status=400)
        logger.info("Order created successfully", extra={"user_id": request.user.id, "order_id": order.id})
        return Response({"order_id": order.id}, status=201)`,
      requires: [
        /["']items_count["']/,
        /["']order_id["']/,
        /exc_info\s*=\s*True|logger\.exception\(/,
        /status\s*=\s*(?:201\b|status\.HTTP_201_CREATED)/,
        /status\s*=\s*(?:400\b|status\.HTTP_400_BAD_REQUEST)/,
      ],
      explanation: 'Each key in `extra` becomes a field on the log record, so a JSON formatter can write `user_id`, `items_count` or `order_id` as separate keys and the log store can find every failure for one user, instead of a search through message text. `exc_info=True` attaches the traceback to the ERROR record; `logger.exception(...)` inside the `except` does exactly the same at ERROR level, so either form is right, while a bare `logger.error(f"...{e}")` keeps one line and loses where it failed. The messages stay fixed strings, so every failure groups under the same message. One caution for real code: catching every `Exception` and answering 400 turns a server bug into a client error; catch the specific error `create_order` raises for bad input and let anything else become a 500 that Sentry reports.',
      hints: [
        'logging.getLogger("myapp") gets the logger configured in settings',
        'exc_info=True includes the stack trace in the log entry; logger.exception(...) inside an except does the same at ERROR',
      ],
      tieredHints: {
        apiSignature: 'logger.error(msg, *args, exc_info=None, extra=None, stack_info=False)',
        skeleton: 'import logging\nfrom rest_framework.views import APIView\nfrom rest_framework.response import Response\n\nlogger = logging.getLogger("myapp")\n\nclass OrderView(APIView):\n    def post(self, request):\n        logger.____("Order creation started", ____={...})\n\n        try:\n            order = ____\n            logger.____("Order created successfully", ____={...})\n            return ____\n\n        except Exception as e:\n            logger.____("Order creation failed", ____={...}, ____)\n            return ____',
      },
      tags: ['logging', 'django', 'monitoring', 'error-handling'],
      concepts: ['py-logging-config', 'dj-monitoring', 'py-exception-hierarchy'],
    },
  {
      id: 'be-infra-monitoring-3',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_MONITORING,
      course: Course.BACKEND,
      question: 'What does Sentry do and when should you set it up?',
      options: [
        { id: 'a', text: 'A database monitoring service that tracks slow queries and suggests missing indexes for production traffic', isCorrect: false },
        { id: 'b', text: 'An error tracker that only becomes worthwhile after an application reaches a thousand or more active users', isCorrect: false },
        { id: 'c', text: 'A drop-in replacement for Django\'s logging module that routes every log record to a hosted dashboard', isCorrect: false },
        { id: 'd', text: 'It captures unhandled exceptions with stack traces and request context, groups duplicates, and alerts on new issues — set it up before launch', isCorrect: true },
      ],
      explanation: 'Without error tracking, an unhandled exception in production shows the user a 500 page and leaves a traceback in a server log that nobody is reading. Sentry captures every unhandled exception with its full stack trace, the HTTP request that caused it, which user was affected and breadcrumbs (the recent log lines and events before it). It groups repeats, so a `KeyError` in checkout shows up as one issue with a count instead of thousands of alerts, and it alerts you when a new issue appears. It does not replace `logging`: your log calls still go to their handlers, and Sentry only turns ERROR records into events and keeps lower ones as breadcrumbs. Setup is `pip install sentry-sdk` and `sentry_sdk.init(dsn=...)` in settings, so do it before launch rather than after the first outage.',
      tags: ['sentry', 'error-tracking', 'monitoring', 'production'],
      concepts: ['dj-monitoring'],
    },
  {
    id: 'dj-monitoring-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DJ_MONITORING,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: 'This script sets up a logger by hand, the way a Django `LOGGING` setting does, with one handler writing to standard output. What does it print? Write one line per log record that reaches the output, in order, laid out as the formatter\'s format string lays it out.',
    code: `import logging
import sys

handler = logging.StreamHandler(sys.stdout)
handler.setFormatter(logging.Formatter("%(levelname)s order=%(order_id)s %(message)s"))
log = logging.getLogger("shop")
log.addHandler(handler)
log.setLevel(logging.INFO)

log.debug("cart loaded", extra={"order_id": 7})
log.info("payment sent", extra={"order_id": 7})
log.warning("retry %d of 3", 2, extra={"order_id": 7})
log.error("card declined", extra={"order_id": 8})`,
    expectedOutput: `INFO order=7 payment sent
WARNING order=7 retry 2 of 3
ERROR order=8 card declined`,
    explanation: 'A logger set to `INFO` drops every record below that level, so the `debug` call prints nothing. The levels run DEBUG, INFO, WARNING, ERROR, CRITICAL, and everything from INFO up gets through. Each key in `extra` becomes an attribute of the record, which is why the format string can name `%(order_id)s`. The `%d` in the warning is filled from the argument `2` only when the record is actually emitted, which is why loggers take arguments rather than a pre-built f-string. In production the same level threshold is what keeps DEBUG noise out while INFO and above still reach the log store.',
    hints: ['setLevel(logging.INFO) drops records whose level is below INFO.', 'Keys passed in extra become fields the format string can use.'],
    tags: ['logging', 'log-levels', 'structured-logging', 'monitoring', 'predict'],
    concepts: ['py-logging-config', 'dj-monitoring'],
  },
];
