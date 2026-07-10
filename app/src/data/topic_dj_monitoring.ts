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
      id: 'be-infra-monitoring-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_MONITORING,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Set up Django logging configuration. Define a LOGGING dict with formatters (verbose and simple), handlers (console and file), and loggers (django and myapp). Then show how to use logger.info() and logger.error() with extra context in a view.',
      starterCode: `# settings.py LOGGING config and usage example
  `,
      testCases: [
        {
          input: 'Django LOGGING configuration',
          expectedOutput: 'LOGGING dict with formatters, handlers, loggers + usage in views',
          description: 'Should define complete logging config and demonstrate usage',
        },
      ],
      solution: `# settings.py
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {
            "format": "{levelname} {asctime} {module} {process:d} {thread:d} {message}",
            "style": "{",
        },
        "simple": {
            "format": "{levelname} {message}",
            "style": "{",
        },
        "json": {
            "format": "{asctime} {levelname} {name} {message}",
            "style": "{",
        },
    },
    "handlers": {
        "console": {
            "level": "DEBUG",
            "class": "logging.StreamHandler",
            "formatter": "simple",
        },
        "file": {
            "level": "WARNING",
            "class": "logging.FileHandler",
            "filename": BASE_DIR / "logs" / "django.log",
            "formatter": "verbose",
        },
    },
    "loggers": {
        "django": {
            "handlers": ["console", "file"],
            "level": "INFO",
            "propagate": True,
        },
        "myapp": {
            "handlers": ["console", "file"],
            "level": "DEBUG",
            "propagate": False,
        },
    },
}


# views.py — Using the logger
import logging
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
            return Response({"error": "Order failed"}, status=400)`,
      explanation: 'Django\'s LOGGING dict configures Python\'s built-in logging module. Formatters define how messages look. Handlers define where messages go — StreamHandler for console, FileHandler for disk, and you can add SMTPHandler for email alerts or SentryHandler for error tracking. Loggers are named hierarchies — "myapp.views" inherits settings from "myapp" (unless propagate=False). The "extra" dict in logger calls adds context that appears in the formatted output. exc_info=True captures the full stack trace, which is critical for debugging production errors.',
      hints: [
        'logging.getLogger("myapp") gets the logger configured in LOGGING',
        'exc_info=True includes the stack trace in the log entry',
        'propagate=False prevents messages from bubbling to the root logger',
        'Create the logs/ directory or use RotatingFileHandler to manage size',
      ],
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
      explanation: 'Without Sentry, unhandled exceptions in production are silent — users see a 500 error page and you never know it happened. Sentry captures every unhandled exception with: the full stack trace, the HTTP request that caused it, which user was affected, browser/OS info, and breadcrumbs (recent events leading to the error). It groups duplicate errors so "NullPointerException in checkout" appears once with a count, not as thousands of individual alerts. Setting it up takes 5 minutes: pip install sentry-sdk, add sentry_sdk.init() to settings.py. There is no reason to wait.',
      tags: ['sentry', 'error-tracking', 'monitoring', 'production'],
      concepts: ['dj-monitoring'],
    },
];
