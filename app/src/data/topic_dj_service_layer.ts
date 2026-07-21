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
      question: 'Implement a service layer for order creation. Write the function `create_order(user, items)` (with `items` as a list of dicts like `{"product_id": int, "quantity": int}`). It should validate stock availability for each product and raise `InsufficientStockError` if stock is too low. If validation passes, create the `Order` and associated `OrderItem` objects atomically inside a transaction (use `select_for_update()` to lock product rows). Finally, trigger an async confirmation email by calling `send_order_confirmation_email.delay(order.id)` and return the created `Order`. Also define the `InsufficientStockError` custom exception.',
      starterCode: `from django.db import transaction
from myapp.models import Order, OrderItem, Product
from myapp.tasks import send_order_confirmation_email

# Define InsufficientStockError and write create_order(user, items)
`,
      testCases: [
        {
          input: 'Order service with validation, creation, and async email',
          expectedOutput: 'Service function with business logic',
          description: 'Should implement a service function separating business logic from HTTP views',
        },
      ],
      solution: `from django.db import transaction
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

    return order`,
      explanation: 'The service layer separates what happens (business logic) from how it is triggered (HTTP). All validation, database operations, and side effects live in the service. This makes the business logic testable without HTTP (just call create_order directly). The transaction.atomic() ensures that if any step fails, all database changes are rolled back. select_for_update() prevents race conditions where two orders claim the same stock.',
      hints: [
        'transaction.atomic() rolls back everything if an exception occurs',
        'select_for_update() locks the row to prevent race conditions',
        'Celery task is called after the transaction commits',
      ],
      tieredHints: {
        apiSignature: 'transaction.atomic(); select_for_update(); task.delay(*args)',
        skeleton: 'from django.db import ____\nfrom myapp.models import ____, ____, ____\nfrom myapp.tasks import ____\n\n\nclass InsufficientStockError(____):\n    def ____(self, product_name, requested, available):\n        self.____ = ____\n        self.____ = ____\n        self.____ = ____\n        super().____(f"Not enough stock for {product_name}")\n\n\ndef create_order(user, items):\n    for ____ in items:\n        product = ____.____.____(id=____["____"])\n        if product.____ < ____["____"]:\n            raise ____(product.____, ____["____"], product.____)\n\n    with ____.____():\n        order = ____.____.____(user=____, status="____")\n\n        for ____ in items:\n            product = ____.____.____().____(id=____["____"])\n            ____.____.____(\n                order=____,\n                product=____,\n                quantity=____["____"],\n                price=____.____,\n            )\n            product.____ -= ____["____"]\n            product.____()\n\n    ____.____(____.id)\n\n    return ____',
      },
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
  {
    id: 'dj-service-layer-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DJ_SERVICE_LAYER,
    course: Course.BACKEND,
    language: CodeLanguage.PYTHON,
    question: 'Complete this service layer function to register a new user and trigger a notification, keeping the business logic out of the view.',
    template: `from django.contrib.auth.models import User
from .tasks import send_welcome_email

def register_user(username, email, password):
    user = User.objects.create_user(
        username=username,
        email=email,
        password=password
    )
    send_welcome_email.___(___)
    return user`,
    blanks: ['delay', 'user.id'],
    solution: `from django.contrib.auth.models import User
from .tasks import send_welcome_email

def register_user(username, email, password):
    user = User.objects.create_user(
        username=username,
        email=email,
        password=password
    )
    send_welcome_email.delay(user.id)
    return user`,
    explanation: 'In a service function, we implement the business logic (creating the user model and dispatching background tasks via Celery `.delay()`) separate from the HTTP view layer.',
    hints: [
      'Trigger the Celery task asynchronously using .delay()',
      'Pass the user ID to the Celery task so the worker can fetch the user',
    ],
    tags: ['django', 'service-layer', 'celery', 'cloze'],
    concepts: ['dj-service-layer'],
  },
];
