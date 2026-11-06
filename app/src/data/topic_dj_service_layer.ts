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
      question: 'Write the service function `create_order(user, items)`, where `items` is a list of dicts like `{"product_id": 3, "quantity": 2}`, and define the `InsufficientStockError` exception it raises. Inside one transaction, create the user\'s `Order` with status "pending". For each item, lock its `Product` row as you read it; if the product\'s stock is below the quantity, raise `InsufficientStockError` with the product\'s name, which undoes the whole order. Otherwise add an `OrderItem` holding the order, the product, the quantity and the product\'s current price, and take the quantity off the product\'s stock. Once the transaction has committed, queue the confirmation email by passing the order\'s id to `send_order_confirmation_email.delay`, and return the order.',
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
    pass


def create_order(user, items):
    with transaction.atomic():
        order = Order.objects.create(user=user, status="pending")
        for item in items:
            product = Product.objects.select_for_update().get(id=item["product_id"])
            if product.stock < item["quantity"]:
                raise InsufficientStockError(product.name)
            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=item["quantity"],
                price=product.price,
            )
            product.stock -= item["quantity"]
            product.save()
    send_order_confirmation_email.delay(order.id)
    return order
# OR
from django.db import transaction
from myapp.models import Order, OrderItem, Product
from myapp.tasks import send_order_confirmation_email


class InsufficientStockError(Exception):
    pass


def create_order(user, items):
    with transaction.atomic():
        order = Order.objects.create(user=user, status="pending")
        for item in items:
            product = Product.objects.select_for_update().get(id=item["product_id"])
            if product.stock < item["quantity"]:
                raise InsufficientStockError(product.name)
            OrderItem.objects.create(order=order, product=product, quantity=item["quantity"], price=product.price)
            product.stock -= item["quantity"]
            product.save()
    send_order_confirmation_email.delay(order.id)
    return order`,
      explanation: 'The service layer separates what happens (business logic) from how it is triggered (HTTP). All validation, database operations, and side effects live in the service. This makes the business logic testable without HTTP (just call create_order directly), and a view only has to catch InsufficientStockError and turn it into a 400 response. The transaction.atomic() ensures that if any step fails, all database changes are rolled back, including the Order row created first. The stock check reads the row after select_for_update() has locked it, so a second order for the same product waits until this transaction ends and then sees the reduced stock; checking before taking the lock would let two orders both pass the check and oversell. The email is queued after the with block, once the order is committed. The .delay() call itself, which hands a function to a Celery worker, is taught in the Celery topic.',
      hints: [
        'transaction.atomic() rolls back everything if an exception occurs',
        'Check the stock on the row select_for_update() returned, so nobody can change it between the check and the save',
        'Celery task is called after the transaction commits',
      ],
      tieredHints: {
        apiSignature: 'transaction.atomic(); select_for_update(); task.delay(*args)',
        skeleton: 'from django.db import transaction\nfrom myapp.models import Order, OrderItem, Product\nfrom myapp.tasks import send_order_confirmation_email\n\n\nclass InsufficientStockError(____):\n    pass\n\n\ndef create_order(user, items):\n    with ____:\n        order = ____\n        for item in items:\n            product = ____\n            if ____:\n                raise ____\n            ____\n            product.stock -= ____\n            product.____()\n    ____\n    return order',
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
    question: 'Complete this service function, which a view, a command or a test can all call to register a user. It must refuse a taken username with a domain error the caller can catch, and send the welcome email only once the new user is really committed.',
    template: `from django.contrib.auth.models import User
from django.db import transaction
from .emails import send_welcome_email

class UsernameTaken(Exception):
    pass

def register_user(username, email, password):
    if User.objects.filter(username=username).exists():
        ___ UsernameTaken(username)
    with transaction.atomic():
        user = User.objects.create_user(username=username, email=email, password=password)
        transaction.___(lambda: send_welcome_email(user))
    return user`,
    blanks: ['raise', 'on_commit'],
    solution: `from django.contrib.auth.models import User
from django.db import transaction
from .emails import send_welcome_email

class UsernameTaken(Exception):
    pass

def register_user(username, email, password):
    if User.objects.filter(username=username).exists():
        raise UsernameTaken(username)
    with transaction.atomic():
        user = User.objects.create_user(username=username, email=email, password=password)
        transaction.on_commit(lambda: send_welcome_email(user))
    return user`,
    explanation: 'The service holds the rules of registering, with no request in sight. A taken username is refused by raising `UsernameTaken`, a domain error: the view catches it and answers with an HTTP error, while a command or a test catches the same exception its own way. `transaction.on_commit(fn)` runs `fn` only after the surrounding transaction commits, so if anything rolls the registration back, no welcome email goes out for a user who does not exist. The view itself is left with only the HTTP work: read the form or request body, call `register_user`, and turn the result or the error into a response.',
    hints: [
      'A domain error leaves the function the way any exception does',
      'The transaction hook that runs a function only after a successful commit',
    ],
    tags: ['django', 'service-layer', 'transactions', 'cloze'],
    concepts: ['dj-service-layer'],
  },
  {
      id: 'dj-service-layer-predict-1',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.DJ_SERVICE_LAYER,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: '`shop.Book` has `title` and `stock`, and `shop.Order` has a foreign key `book` and a `qty`. This service function from `shop/services.py` is called from `python manage.py shell` on empty tables, with no request or view involved. What does it print? The answer is three lines: a word and a number, then a word and a title, then a number.',
      code: `from django.db import transaction

class OutOfStock(Exception):
    pass

def place_order(book, qty):
    with transaction.atomic():
        Order.objects.create(book=book, qty=qty)
        if book.stock < qty:
            raise OutOfStock(book.title)
        book.stock -= qty
        book.save()

book = Book.objects.create(title="Dune", stock=2)
for qty in [1, 5]:
    try:
        place_order(book, qty)
        print("placed", book.stock)
    except OutOfStock as err:
        print("refused", err)
print(Order.objects.count())`,
      expectedOutput: `placed 1
refused Dune
1`,
      explanation: 'The service holds the business rule, so a shell, a test, a view or a task can call it the same way. The first order fits the stock of 2, so it is saved and the stock drops to 1. The second asks for 5: its `Order` row is created, then `OutOfStock` is raised inside `transaction.atomic()`, which rolls the whole block back, that row included, before the exception reaches the caller. So only the first order is left and the count is 1. A view would catch `OutOfStock` and turn it into an HTTP error, keeping HTTP out of the service.',
      hints: ['An exception leaving transaction.atomic() rolls back everything the block wrote.', 'The second Order row is created before the stock check fails.'],
      tags: ['django', 'service-layer', 'transactions', 'predict'],
      concepts: ['dj-service-layer', 'dj-transaction-atomic'],
    },
];
