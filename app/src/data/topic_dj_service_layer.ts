/**
 * Topic.DJ_SERVICE_LAYER — all question types for this topic.
 * Auto-consolidated by scripts/consolidate-by-topic.js from:
 *   backendInfraQuestions.ts (3), djangoGapFillQuestions.ts (1)
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const dj_service_layer_questions: Question[] = [
  {
      id: 'be-infra-service-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_SERVICE_LAYER,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Implement a service layer for order creation. Create services/order_service.py with a create_order(user, items) function that validates stock availability, creates the Order and OrderItem records, sends a confirmation email via Celery, and returns the order. Show how the view calls the service.',
      starterCode: `# services/order_service.py
# Write the service function and the view that calls it
`,
      testCases: [
        {
          input: 'Order service with validation, creation, and async email',
          expectedOutput: 'Service function with business logic, view that delegates to service',
          description: 'Should separate business logic from HTTP handling',
        },
      ],
      solution: `# services/order_service.py
from django.db import transaction
from myapp.models import Order, OrderItem, Product
from myapp.tasks import send_order_confirmation_email


class InsufficientStockError(Exception):
    def __init__(self, product_name, requested, available):
        self.product_name = product_name
        self.requested = requested
        self.available = available
        super().__init__(f"Not enough stock for {product_name}")


def create_order(user, items):
    """
    Create an order for the given user.
    items: list of {"product_id": int, "quantity": int}
    Returns the created Order.
    Raises InsufficientStockError if stock is insufficient.
    """
    # 1. Validate stock
    for item in items:
        product = Product.objects.get(id=item["product_id"])
        if product.stock < item["quantity"]:
            raise InsufficientStockError(product.name, item["quantity"], product.stock)

    # 2. Create order and items atomically
    with transaction.atomic():
        order = Order.objects.create(user=user, status="pending")

        for item in items:
            product = Product.objects.select_for_update().get(id=item["product_id"])
            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=item["quantity"],
                price=product.price,
            )
            product.stock -= item["quantity"]
            product.save()

    # 3. Send confirmation email asynchronously
    send_order_confirmation_email.delay(order.id)

    return order


# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from myapp.services.order_service import create_order, InsufficientStockError


class CreateOrderView(APIView):
    def post(self, request):
        try:
            order = create_order(user=request.user, items=request.data["items"])
            return Response({"order_id": order.id}, status=status.HTTP_201_CREATED)
        except InsufficientStockError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)`,
      explanation: 'The service layer separates what happens (business logic) from how it is triggered (HTTP). The view only parses the request and returns a response — all validation, database operations, and side effects live in the service. This makes the business logic testable without HTTP (just call create_order directly), reusable from management commands or Celery tasks, and easier to reason about. The transaction.atomic() ensures that if any step fails, all database changes are rolled back. select_for_update() prevents race conditions where two orders claim the same stock.',
      hints: [
        'transaction.atomic() rolls back everything if an exception occurs',
        'select_for_update() locks the row to prevent race conditions',
        'The service raises domain exceptions, the view converts them to HTTP responses',
        'Celery task is called after the transaction commits',
      ],
      tags: ['service-layer', 'architecture', 'transactions', 'celery'],
      concepts: ['dj-transaction-atomic', 'ce-task-idempotency'],
    },
  {
      id: 'be-infra-service-2',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_SERVICE_LAYER,
      course: Course.BACKEND,
      question: 'Why should you separate business logic from Django views?',
      options: [
        { id: 'a', text: 'Views should only handle HTTP; services hold business rules, so logic is testable without requests and reusable from commands and Celery tasks', isCorrect: true },
        { id: 'b', text: 'Django views cannot access the database directly — the ORM only allows queries from model methods or dedicated service modules', isCorrect: false },
        { id: 'c', text: 'It is a framework requirement — Django raises an ImproperlyConfigured error when a view contains more than basic request handling', isCorrect: false },
        { id: 'd', text: 'Only large applications with hundreds of models benefit — for smaller projects the extra indirection actively slows development', isCorrect: false },
      ],
      explanation: 'When business logic lives in views, testing requires simulating HTTP requests (slower, more setup). Reusing logic means duplicating code or importing views into management commands (which is awkward). With a service layer, you test business rules by calling Python functions directly: order = create_order(user, items). Management commands, Celery tasks, and API views all call the same service. The service becomes the single source of truth for "how do we create an order?"',
      tags: ['service-layer', 'architecture', 'testing', 'separation-of-concerns'],
      concepts: ['py-test-isolation'],
    },
  {
      id: 'be-infra-service-3',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_SERVICE_LAYER,
      course: Course.BACKEND,
      question: 'What is the "fat models" vs "thin models" vs "service layer" debate in Django?',
      options: [
        { id: 'a', text: 'Fat models are always best — the official Django documentation forbids service modules because they duplicate manager functionality', isCorrect: false },
        { id: 'b', text: 'There is no real difference — all three terms describe the same code, just organized into different files for readability', isCorrect: false },
        { id: 'c', text: 'Fat models put business logic in model methods; thin models move it to services — use services when logic spans models or external systems', isCorrect: true },
        { id: 'd', text: 'Service layers replace models entirely in modern Django — the ORM is only kept for generating migrations from legacy schemas', isCorrect: false },
      ],
      explanation: 'Fat models work well for single-model logic: User.get_full_name(), Order.calculate_total(). But when creating an order requires checking inventory (Product model), charging payment (Stripe API), sending email (Celery task), and updating analytics — putting all of that in Order.create() makes the model depend on everything. A service function orchestrates these cross-cutting concerns while each model stays focused on its own data. The pragmatic approach: simple logic on models, complex orchestration in services.',
      tags: ['fat-models', 'thin-models', 'service-layer', 'architecture'],
      concepts: ['dj-service-layer'],
    },
  {
      id: 'dj-service-layer-gap-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_SERVICE_LAYER,
      course: Course.BACKEND,
      question: 'What is a service layer in a Django project?\n\nAs your project grows, views start doing too much: parsing requests, validating data, running business logic, querying the database, and formatting responses — all in one function.',
      options: [
        {
          id: 'a',
          text: 'A third-party package that inspects your views and serializers to generate interactive API documentation automatically',
          isCorrect: false,
        },
        {
          id: 'b',
          text: 'A microservice running on a separate server that your Django app calls over HTTP whenever it needs business logic executed',
          isCorrect: false,
        },
        {
          id: 'c',
          text: 'A separate module where business logic lives so views stay thin — views handle HTTP, services handle rules, and logic is reusable outside requests',
          isCorrect: true,
        },
        {
          id: 'd',
          text: 'Django middleware that preprocesses every incoming request, running shared validation before any view function is reached',
          isCorrect: false,
        },
      ],
      explanation: 'A service layer is an architectural pattern (not a Django feature) where you extract business logic into plain Python functions or classes in a services.py file. Instead of a view doing everything, the view calls a service function: the view handles HTTP concerns (parsing the request body, returning JSON) and the service handles business concerns (checking inventory, calculating prices, sending notifications). This makes the logic testable with plain unit tests (no HTTP), reusable from management commands, Celery tasks, or other views, and easier to understand.',
      hints: [
        'The service layer is a pattern, not a Django built-in — you create services.py yourself',
        'A good rule: if you need the same logic in a view AND a Celery task, put it in a service',
      ],
      tags: ['django', 'service-layer', 'architecture', 'separation-of-concerns', 'basics'],
      concepts: ['dj-service-layer'],
    },
];
