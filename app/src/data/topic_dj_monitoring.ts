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
      question: 'Write a Django REST Framework API view `OrderView` that uses a configured logger named `"myapp"` to record messages. Inside the `post` method, log an `"Order creation started"` info message with `extra` parameters for `user_id` (from `request.user.id`) and `items_count` (the length of the items list in request data). Then try to call `create_order(request.user, request.data["items"])`. If it succeeds, log an `"Order created successfully"` info message with the `order_id` in `extra` and return a 201 response. If any exception is raised, log an `"Order creation failed"` error message with `user_id` and the exception string in `extra`, ensuring the full stack trace is included (`exc_info=True`), and return a 400 response.',
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
            return Response({"error": "Order failed"}, status=400)`,
      explanation: 'Django\'s LOGGING dict configures Python\'s built-in logging module. The "extra" dict in logger calls adds context that appears in the formatted output. exc_info=True captures the full stack trace, which is critical for debugging production errors.',
      hints: [
        'logging.getLogger("myapp") gets the logger configured in settings',
        'exc_info=True includes the stack trace in the log entry',
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
