import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  CodeLanguage,
  Course,
} from '../types';

export const designPatternQuestions: Question[] = [

  // =====================================================================
  // PATTERNS_CREATIONAL (4 questions)
  // =====================================================================

  {
    id: 'dp-create-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PATTERNS_CREATIONAL,
    course: Course.WEB_DEV,
    question: `You're building a notification system that sends alerts via Email, SMS, or Push. The channel is determined at runtime based on user preferences. Which pattern best handles creating the correct notification sender without littering your code with if/else chains?`,
    options: [
      { id: 'a', text: 'Factory Pattern — define a createNotification(type) function that returns the appropriate EmailNotification, SMSNotification, or PushNotification instance, all sharing a common send() interface', isCorrect: true },
      { id: 'b', text: 'Singleton Pattern — ensure only one notification service exists globally', isCorrect: false },
      { id: 'c', text: 'Observer Pattern — have each notification type observe user preferences', isCorrect: false },
      { id: 'd', text: 'Decorator Pattern — wrap the notification with additional behavior', isCorrect: false },
    ],
    explanation: `The Factory Pattern centralizes object creation logic in one place. Instead of scattering "if type === 'email' then new EmailNotification()" throughout your codebase, you call NotificationFactory.create(type) and get back an object that implements a shared interface (e.g., { send(message) }). This means adding a new channel (Slack, WhatsApp) requires changing only the factory — not every caller. Real-world example: payment gateways (Stripe, PayPal, Square) often use factories to return the right processor.`,
    hints: [
      'Think about which pattern is specifically about creating objects without specifying the exact class',
      'The caller should not need to know which concrete class is instantiated',
    ],
    tags: ['factory', 'creational', 'notification', 'polymorphism'],
    concepts: ['pattern-creational'],
  },

  {
    id: 'dp-create-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PATTERNS_CREATIONAL,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: `Implement a DatabasePool singleton in TypeScript. The class should:
- Have a private static instance
- Have a private constructor that accepts a connection string
- Expose a static getInstance(connectionString) method
- Have a query(sql) method that returns a string like "Executing: <sql>"
- Ensure calling getInstance multiple times returns the SAME instance`,
    starterCode: `class DatabasePool {
  // TODO: private static instance
  // TODO: private constructor
  // TODO: static getInstance(connectionString: string)
  // TODO: query(sql: string): string
}`,
    testCases: [
      {
        input: 'DatabasePool.getInstance("postgres://localhost:5432/mydb")',
        expectedOutput: 'private static instance',
        description: 'Should have a private static instance field',
      },
      {
        input: 'new DatabasePool()',
        expectedOutput: 'private constructor',
        description: 'Constructor should be private',
      },
      {
        input: 'getInstance called twice',
        expectedOutput: 'getInstance',
        description: 'Should return the same instance when called multiple times',
      },
    ],
    solution: `class DatabasePool {
private static instance: DatabasePool;
private connectionString: string;

private constructor(connectionString: string) {
  this.connectionString = connectionString;
}

static getInstance(connectionString: string): DatabasePool {
  if (!DatabasePool.instance) {
    DatabasePool.instance = new DatabasePool(connectionString);
  }
  return DatabasePool.instance;
}

query(sql: string): string {
  return \`Executing: \${sql}\`;
  }
}`,
    explanation: `The Singleton Pattern ensures a class has exactly one instance. For a database connection pool, this prevents accidentally opening hundreds of connections. The private constructor stops external code from calling "new DatabasePool()" — the only way to get an instance is through getInstance(). Note: In modern apps, dependency injection frameworks (like NestJS providers with scope: Scope.DEFAULT) handle singletons more cleanly than manual implementation.`,
    hints: [
      'The constructor must be private to prevent direct instantiation',
      'Use a static field to store the single instance',
      'getInstance should check if the instance already exists before creating a new one',
    ],
    tags: ['singleton', 'creational', 'database', 'connection-pool'],
    concepts: ['pattern-creational'],
  },

  {
    id: 'dp-create-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PATTERNS_CREATIONAL,
    course: Course.WEB_DEV,
    question: `Why are Singletons often considered an anti-pattern in modern software development, despite being one of the most well-known design patterns?`,
    options: [
      { id: 'a', text: 'They are too slow due to the lazy initialization check', isCorrect: false },
      { id: 'b', text: 'They introduce hidden global state, make unit testing difficult (hard to mock/reset), create tight coupling, and violate the Single Responsibility Principle by managing their own lifecycle', isCorrect: true },
      { id: 'c', text: 'They use too much memory by keeping objects alive forever', isCorrect: false },
      { id: 'd', text: 'They only work in object-oriented languages, not in functional programming', isCorrect: false },
    ],
    explanation: `Singletons are controversial because: (1) They are hidden dependencies — code uses DatabasePool.getInstance() deep inside functions, making dependencies invisible. (2) Testing is painful — you cannot easily substitute a mock database in tests. (3) They carry global state that persists between tests, causing flaky test suites. (4) They violate the Dependency Inversion Principle — code depends on a concrete class, not an abstraction. Modern alternative: use dependency injection. Instead of a function calling DatabasePool.getInstance(), pass the pool as a parameter. This makes dependencies explicit and testing trivial.`,
    hints: [
      'Think about what happens when you try to write unit tests for code that uses a Singleton',
      'Consider how global state affects test isolation',
    ],
    tags: ['singleton', 'anti-pattern', 'testing', 'dependency-injection'],
    concepts: ['pattern-creational'],
  },

  {
    id: 'dp-create-4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PATTERNS_CREATIONAL,
    course: Course.WEB_DEV,
    question: `You're building a query builder that constructs SQL-like queries with optional filters, pagination, sorting, and field selection. The object can have dozens of optional parameters. Which pattern best handles this complex object construction?

Example desired API:
  QueryBuilder.new("users")
    .select(["name", "email"])
    .where("age", ">", 18)
    .orderBy("name", "asc")
    .limit(10)
    .offset(20)
    .build()`,
    options: [
      { id: 'a', text: 'Factory Pattern — create different query types', isCorrect: false },
      { id: 'b', text: 'Prototype Pattern — clone an existing query and modify it', isCorrect: false },
      { id: 'c', text: 'Builder Pattern — chain method calls to incrementally construct a complex object, then call build() to get the final immutable result', isCorrect: true },
      { id: 'd', text: 'Abstract Factory — create families of related query objects', isCorrect: false },
    ],
    explanation: `The Builder Pattern shines when constructing objects with many optional parameters. Instead of a constructor with 15 parameters (most undefined), you chain readable method calls. Each method returns "this" for fluent chaining, and build() produces the final object. Real-world examples: Knex.js query builder, Elasticsearch query DSL, Prisma query API, and even JavaScript's URLSearchParams. The key insight: Builders separate the construction process from the representation, letting you create different representations using the same building process.`,
    hints: [
      'Which pattern is specifically designed for step-by-step construction of complex objects?',
      'Look at the method chaining API in the example — each call adds one piece',
    ],
    tags: ['builder', 'creational', 'query-builder', 'fluent-api'],
    concepts: ['pattern-creational'],
  },

  {
    id: 'dp-create-5',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PATTERNS_CREATIONAL,
    course: Course.WEB_DEV,
    question: `Design patterns are grouped into three families: creational, structural, and behavioral. What specific concern does the *creational* family address?`,
    options: [
      { id: 'a', text: 'How existing objects are composed and wrapped into larger structures like trees and adapters', isCorrect: false },
      { id: 'b', text: 'How objects get created, hiding which concrete class is instantiated from the caller', isCorrect: true },
      { id: 'c', text: 'How objects communicate, notify, and distribute responsibilities among themselves at runtime', isCorrect: false },
      { id: 'd', text: 'How modules, layers, and services are arranged across the overall application', isCorrect: false },
    ],
    explanation: `Creational patterns are all about object construction. Their shared goal is to decouple "what you use" from "how it gets built": the caller asks for an object and receives one that satisfies an interface, without naming a concrete class or knowing the construction details. Factory (pick a class at runtime), Builder (assemble a complex object step by step), Singleton (control how many instances exist), Abstract Factory (produce matching families), and Prototype (clone an existing instance) are all creational. The other answers describe structural patterns (composition into structures), behavioral patterns (runtime communication), and architecture (system organization).`,
    hints: [
      'The word "creational" is a strong clue about the lifecycle stage involved',
      'Contrast it with structural (composition) and behavioral (communication)',
    ],
    tags: ['creational', 'pattern-families', 'fundamentals'],
    concepts: ['pattern-creational'],
  },

  {
    id: 'dp-create-6',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PATTERNS_CREATIONAL,
    course: Course.WEB_DEV,
    question: `You're building a cross-platform UI toolkit. A "Light" theme needs a matching LightButton + LightInput + LightModal, and a "Dark" theme needs DarkButton + DarkInput + DarkModal. You must guarantee a caller never accidentally mixes a LightButton with a DarkInput. Which pattern fits best?`,
    options: [
      { id: 'a', text: 'Builder — chain method calls to assemble one component step by step before producing it', isCorrect: false },
      { id: 'b', text: 'Factory Method — a single function that returns one component chosen by a type argument', isCorrect: false },
      { id: 'c', text: 'Abstract Factory — one factory that produces a whole matching family of related components', isCorrect: true },
      { id: 'd', text: 'Prototype — clone a base themed component and tweak its fields for every new variation needed', isCorrect: false },
    ],
    explanation: `Abstract Factory is the "factory of factories" — it exposes a set of creation methods (createButton, createInput, createModal) and each concrete factory (LightThemeFactory, DarkThemeFactory) returns components from ONE consistent family. The caller holds a ThemeFactory and calls createButton()/createInput(); because both come from the same factory, they always match. A plain Factory Method handles a single product, not a coordinated family — that is the key distinction. Real-world examples: look-and-feel toolkits, database driver suites (connection + command + reader for a given engine), and cloud-provider SDK clients.`,
    hints: [
      'The requirement is a *family* of objects that must stay consistent together',
      'A single-product factory cannot enforce that two products match',
    ],
    tags: ['abstract-factory', 'creational', 'families', 'ui-toolkit'],
    concepts: ['pattern-creational'],
  },

  {
    id: 'dp-create-7',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PATTERNS_CREATIONAL,
    course: Course.WEB_DEV,
    question: `In a game, a fully-configured "elite enemy" object has dozens of tuned stats, equipment, and AI settings. You need to spawn many near-identical enemies, each differing in just one or two fields. Rebuilding each from scratch is expensive and duplicates the configuration. Which pattern is designed for this?`,
    options: [
      { id: 'a', text: 'Prototype — clone the configured instance, then change only the fields that differ', isCorrect: true },
      { id: 'b', text: 'Singleton — keep one globally shared enemy instance and mutate its stats before each spawn', isCorrect: false },
      { id: 'c', text: 'Builder — reassemble every enemy field by field through a fluent step-by-step builder API', isCorrect: false },
      { id: 'd', text: 'Factory — call a function that constructs and returns a brand-new default enemy each time', isCorrect: false },
    ],
    explanation: `The Prototype Pattern creates new objects by cloning an existing "prototype" instance rather than constructing from scratch. When an object is expensive to configure but you need many variations, you clone the template and override a few fields. The critical gotcha is shallow vs deep copy: a shallow clone (Object.assign / spread) shares nested objects, so mutating a nested array on one clone affects all of them — use structuredClone() or an explicit deep copy when the prototype holds nested state. JavaScript's whole object model is prototype-based (Object.create), and structuredClone is the modern deep-clone primitive.`,
    hints: [
      'You already have a perfect template — why rebuild instead of copy?',
      'Watch for shallow vs deep copy of nested fields',
    ],
    tags: ['prototype', 'creational', 'clone', 'structuredClone'],
    concepts: ['pattern-creational'],
  },

  {
    id: 'dp-create-8',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.PATTERNS_CREATIONAL,
    course: Course.WEB_DEV,
    question: `Your service calls DatabasePool.getInstance() (a Singleton) deep inside many functions. Unit tests are painful because you can't substitute a fake pool, and global state leaks between tests. What is the standard modern fix?`,
    options: [
      { id: 'a', text: 'Make the Singleton lazily initialized and add a reset() hook so tests can clear it between runs', isCorrect: false },
      { id: 'b', text: 'Wrap the Singleton in a Facade so callers reach it through a simpler, more convenient interface layer', isCorrect: false },
      { id: 'c', text: 'Use a Factory so every call site constructs its own pool instance fresh on demand each time', isCorrect: false },
      { id: 'd', text: 'Dependency Injection — pass the pool in as a parameter so callers and tests pick the implementation', isCorrect: true },
    ],
    explanation: `Dependency Injection (DI) inverts who controls the dependency. Instead of a function reaching out to a global getInstance(), the pool is passed in (as a constructor argument, function parameter, or via a DI container). This makes dependencies explicit in the signature, lets tests inject an in-memory or mock pool trivially, and removes hidden global state that causes flaky tests. It is a direct application of the Dependency Inversion Principle (the "D" in SOLID): high-level code depends on an abstraction (the pool interface), and the concrete implementation is supplied from outside. Frameworks like NestJS, Spring, and Angular build their entire architecture around DI; even "manually" passing a parameter is DI.`,
    hints: [
      'The problem is that the dependency is reached *implicitly* from inside the code',
      'Think about how you would give a test a different pool without changing the function body',
    ],
    tags: ['dependency-injection', 'creational', 'singleton-alternative', 'solid', 'testing'],
    concepts: ['pattern-creational'],
  },

  // =====================================================================
  // PATTERNS_STRUCTURAL (4 questions)
  // =====================================================================

  {
    id: 'dp-struct-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PATTERNS_STRUCTURAL,
    course: Course.WEB_DEV,
    question: `Your app uses an internal PaymentProcessor interface with methods like charge(amount, currency) and refund(transactionId). You need to integrate a third-party payment API (e.g., Stripe) that has completely different method names: createPaymentIntent(), capturePayment(), createRefund(). You cannot modify the third-party SDK. Which pattern do you use?`,
    options: [
      { id: 'a', text: 'Proxy Pattern — create a proxy that controls access to Stripe', isCorrect: false },
      { id: 'b', text: 'Bridge Pattern — separate the payment abstraction from implementation', isCorrect: false },
      { id: 'c', text: 'Decorator Pattern — add Stripe functionality to your existing processor', isCorrect: false },
      { id: 'd', text: 'Adapter Pattern — create a StripeAdapter class that implements your PaymentProcessor interface and internally translates calls to the Stripe SDK methods', isCorrect: true },
    ],
    explanation: `The Adapter Pattern (also called Wrapper) converts one interface into another that clients expect. Your StripeAdapter implements PaymentProcessor and translates: charge(amount, currency) internally calls stripe.paymentIntents.create({amount, currency}) then stripe.paymentIntents.capture(id). This is incredibly common in real codebases — ORMs adapt database drivers, logging libraries adapt different transports, and API clients adapt HTTP libraries. The adapter lets you swap Stripe for PayPal by writing a PayPalAdapter, without changing any business logic.`,
    hints: [
      'You need to make an incompatible interface work with your existing code',
      'Think "power adapter" — it converts one plug type to another',
    ],
    tags: ['adapter', 'structural', 'payment', 'third-party-integration'],
    concepts: ['pattern-structural'],
  },

  {
    id: 'dp-struct-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PATTERNS_STRUCTURAL,
    course: Course.WEB_DEV,
    language: CodeLanguage.PYTHON,
    question: `Implement a decorator function called "log_and_time" that:
1. Prints "Calling <function_name>..." before the function runs
2. Prints "Finished <function_name> in <time>s" after it completes
3. Returns the original function's result
4. Works with any function using @log_and_time syntax

Use functools.wraps to preserve the original function's metadata.`,
    starterCode: `# Import time and functools
# Define log_and_time(func): use @functools.wraps(func) on a wrapper that
# prints "Calling <name>..." before, records time.time(), runs func, then prints
# "Finished <name> in {elapsed}s" and returns the result
# Apply it with @log_and_time to a fetch_users() that sleeps briefly and returns a list
`,
    testCases: [
      {
        input: '@log_and_time decorator',
        expectedOutput: 'functools.wraps',
        description: 'Should use functools.wraps to preserve function metadata',
      },
      {
        input: 'decorator function',
        expectedOutput: 'def wrapper',
        description: 'Should define an inner wrapper function',
      },
      {
        input: 'timing logic',
        expectedOutput: 'time.time',
        description: 'Should measure execution time',
      },
    ],
    solution: `import time
import functools

def log_and_time(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        print(f"Calling {func.__name__}...")
        start = time.time()
        result = func(*args, **kwargs)
        elapsed = time.time() - start
        print(f"Finished {func.__name__} in {elapsed:.3f}s")
        return result
    return wrapper

@log_and_time
def fetch_users():
    time.sleep(0.1)
    return ["Alice", "Bob"]`,
    explanation: `This is the Decorator Pattern in action — adding behavior (logging, timing) to a function without modifying its source code. Python's @decorator syntax is literally the Decorator Pattern from the Gang of Four book. The key principle: Open/Closed Principle — the function is open for extension (adding logging) but closed for modification (original code unchanged). Real-world uses: Flask's @app.route, Django's @login_required, pytest's @pytest.fixture, and retry decorators like @tenacity.retry.`,
    hints: [
      'The decorator takes a function and returns a new function that wraps the original',
      'Use *args and **kwargs to accept any arguments',
      '@functools.wraps(func) preserves __name__, __doc__, etc.',
    ],
    tags: ['decorator', 'structural', 'python', 'logging', 'timing'],
    concepts: ['pattern-structural'],
  },

  {
    id: 'dp-struct-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PATTERNS_STRUCTURAL,
    course: Course.WEB_DEV,
    question: `Python's @decorator syntax (e.g., @login_required, @app.route("/")) is a direct implementation of which design pattern?`,
    options: [
      { id: 'a', text: 'Decorator Pattern — it wraps a function with additional behavior (authentication, routing, caching) without modifying the original function', isCorrect: true },
      { id: 'b', text: 'Observer Pattern', isCorrect: false },
      { id: 'c', text: 'Strategy Pattern', isCorrect: false },
      { id: 'd', text: 'Chain of Responsibility Pattern', isCorrect: false },
    ],
    explanation: `Python's @decorator syntax is the textbook Decorator Pattern. When you write @login_required above a view function, you are wrapping that function with authentication logic. The original function is unchanged — it still handles the request — but now it's wrapped in a layer that checks auth first. This is identical to the GoF Decorator Pattern: "attach additional responsibilities to an object dynamically." Common Python decorators: @property, @staticmethod, @functools.lru_cache, @retry, @app.route, @pytest.mark.parametrize.`,
    hints: [
      'The @ syntax in Python wraps a function with additional behavior',
      'It does not modify the original function — it adds to it',
    ],
    tags: ['decorator', 'python', 'syntax', 'structural'],
    concepts: ['pattern-structural'],
  },

  {
    id: 'dp-struct-4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PATTERNS_STRUCTURAL,
    course: Course.WEB_DEV,
    question: `You're building an API client that needs to handle: (1) constructing URLs, (2) attaching auth tokens, (3) serializing request bodies, (4) handling retries on failure, (5) parsing responses, (6) logging. Instead of exposing all this complexity, you want a simple api.getUsers() call. Which pattern applies?`,
    options: [
      { id: 'a', text: 'Adapter Pattern — convert between interfaces', isCorrect: false },
      { id: 'b', text: 'Facade Pattern — provide a simple interface that hides the complexity of multiple subsystems (URL building, auth, retries, parsing, logging) behind easy-to-use methods', isCorrect: true },
      { id: 'c', text: 'Proxy Pattern — control access to the API', isCorrect: false },
      { id: 'd', text: 'Mediator Pattern — coordinate between the subsystems', isCorrect: false },
    ],
    explanation: `The Facade Pattern provides a simplified interface to a complex subsystem. Instead of the caller dealing with fetch + headers + auth + JSON.stringify + retry logic + error parsing, they call api.getUsers(). Internally, the facade orchestrates all subsystems. Real-world facades: Axios (wraps XMLHttpRequest/fetch with a clean API), jQuery (facades the DOM API), AWS SDK clients (facade over HTTP requests + auth signing + retries). The key difference from Adapter: Adapter converts interfaces, Facade simplifies them.`,
    hints: [
      'Which pattern is about simplifying a complex system into an easy-to-use interface?',
      'Think of it as a "front desk" that handles all the complex coordination behind the scenes',
    ],
    tags: ['facade', 'structural', 'api-client', 'simplification'],
    concepts: ['pattern-structural'],
  },

  {
    id: 'dp-struct-5',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PATTERNS_STRUCTURAL,
    course: Course.WEB_DEV,
    question: `A photo gallery shows hundreds of high-resolution images. Loading every full image upfront is slow and wasteful. You want to defer loading each image until it scrolls into view, and cache it once loaded — all without changing the gallery code, which just calls image.render(). Which pattern fits?`,
    options: [
      { id: 'a', text: 'Adapter — convert the incompatible image-loader API into the exact interface the gallery already expects from it', isCorrect: false },
      { id: 'b', text: 'Proxy — a stand-in with the same interface that controls access, adding lazy loading and caching', isCorrect: true },
      { id: 'c', text: 'Decorator — wrap each image to attach extra rendering behavior', isCorrect: false },
      { id: 'd', text: 'Facade — expose one simplified API over the whole image subsystem', isCorrect: false },
    ],
    explanation: `The Proxy Pattern puts a placeholder in front of a real object, implementing the SAME interface so callers can't tell the difference. The proxy decides when and whether to touch the real object — here a virtual proxy lazy-loads the full image on first render() and caches it. Other proxy flavors: protection proxy (access control / auth checks), remote proxy (stands in for an object on another machine — RPC), and caching/logging proxies. JavaScript has this built in as the Proxy object, which intercepts property access via traps (get, set). Key contrast: Decorator ADDS behavior, Proxy CONTROLS access — both wrap and share the interface, but the intent differs.`,
    hints: [
      'The caller must not know whether it is talking to the real object or a stand-in',
      'The intent is to *control access* (defer, cache, guard), not add new features',
    ],
    tags: ['proxy', 'structural', 'lazy-loading', 'caching'],
    concepts: ['pattern-structural'],
  },

  {
    id: 'dp-struct-6',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PATTERNS_STRUCTURAL,
    course: Course.WEB_DEV,
    question: `You're modeling a file system where a folder can contain files AND other folders (which contain more files and folders, arbitrarily deep). You want to call totalSize() on any node — a single file or a whole folder tree — and get a number, without the caller checking "is this a file or a folder?". Which pattern fits?`,
    options: [
      { id: 'a', text: 'Iterator — expose a uniform way to walk the whole tree node by node without revealing its structure', isCorrect: false },
      { id: 'b', text: 'Builder — assemble the nested tree structure step by step', isCorrect: false },
      { id: 'c', text: 'Composite — give leaves and containers one shared interface so both are treated uniformly', isCorrect: true },
      { id: 'd', text: 'Decorator — wrap each node to add child-handling behavior', isCorrect: false },
    ],
    explanation: `The Composite Pattern lets you treat individual objects (leaves) and compositions of objects (containers) through one uniform interface. Both File and Folder implement a Node interface with totalSize(); a File returns its own size, a Folder sums totalSize() over its children — which may themselves be files or folders, recursively. The caller never branches on type. This is the natural pattern for any part-whole hierarchy: file systems, DOM/UI component trees, nested menus, org charts, threaded comments, and arithmetic expression trees. The recursion lives inside the container's implementation, not in the caller.`,
    hints: [
      'The caller should treat one item and a group of items exactly the same way',
      'Think part-whole hierarchies where containers hold more containers',
    ],
    tags: ['composite', 'structural', 'tree', 'recursion'],
    concepts: ['pattern-structural'],
  },

  {
    id: 'dp-struct-7',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.PATTERNS_STRUCTURAL,
    course: Course.WEB_DEV,
    question: `You're designing a notification system with two dimensions that each grow over time: message kind (Alert, Reminder, Digest) and delivery channel (Email, SMS, Push). Subclassing every combination (AlertEmail, AlertSMS, ReminderPush, …) explodes. You want each dimension to vary independently. Which pattern is purpose-built for this?`,
    options: [
      { id: 'a', text: 'Bridge — split the two axes into separate hierarchies and compose them so each varies on its own', isCorrect: true },
      { id: 'b', text: 'Adapter — wrap each channel after the fact so it conforms to your existing message interface', isCorrect: false },
      { id: 'c', text: 'Strategy — swap the delivery algorithm at runtime within one combined message class', isCorrect: false },
      { id: 'd', text: 'Facade — hide the channel and message complexity behind a single simplified send() entry-point method that callers use', isCorrect: false },
    ],
    explanation: `The Bridge Pattern decouples an abstraction (Message, with subclasses Alert/Reminder/Digest) from its implementation (Channel, with implementations Email/SMS/Push) so the two hierarchies vary independently. A Message holds a reference to a Channel and delegates delivery to it — turning an N×M subclass explosion into N+M classes you compose at runtime (new Alert(new SMSChannel())). The critical contrast with Adapter: Bridge is a DESIGN-TIME decision to keep two axes separate from the start; Adapter is a retrofit that makes an already-existing, incompatible interface work with your code. Both involve one object delegating to another, but the intent and timing differ.`,
    hints: [
      'The smell is an N×M subclass explosion across two independent axes',
      'Bridge is planned upfront; Adapter is a fix applied after the fact',
    ],
    tags: ['bridge', 'adapter', 'structural', 'abstraction-implementation'],
    concepts: ['pattern-structural'],
  },

  {
    id: 'dp-struct-8',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.PATTERNS_STRUCTURAL,
    course: Course.WEB_DEV,
    question: `A map view renders 100,000 markers. Each marker shares a small set of icons and styles (intrinsic, shared) but has a unique latitude/longitude (extrinsic, per-instance). Making each marker a full object with its own copy of the icon/style blows up memory. Which pattern addresses this?`,
    options: [
      { id: 'a', text: 'Singleton — keep a single global marker object and reuse that exact same instance for every map position drawn', isCorrect: false },
      { id: 'b', text: 'Prototype — clone a base marker object for each position', isCorrect: false },
      { id: 'c', text: 'Composite — group the markers into a tree to reduce object count', isCorrect: false },
      { id: 'd', text: 'Flyweight — share the immutable intrinsic state and pass each per-instance extrinsic state in per call', isCorrect: true },
    ],
    explanation: `The Flyweight Pattern minimizes memory by sharing the parts of objects that are identical (intrinsic state) and externalizing the parts that differ (extrinsic state). Here, one MarkerType object holds the icon and style and is shared by every marker of that type; the unique position is stored separately and passed to render(position) at draw time. With a few marker types and a flyweight factory that returns shared instances, 100,000 markers cost a handful of MarkerType objects plus a lightweight position array. This is how text editors share glyph objects across millions of characters and how game engines share meshes/textures across instances. A Singleton (one instance globally) can't represent many distinct positions; Flyweight shares only the *common* state.`,
    hints: [
      'Separate the state that is identical across instances from the state that differs',
      'The shared part is stored once; the unique part is passed in when needed',
    ],
    tags: ['flyweight', 'structural', 'memory', 'intrinsic-extrinsic'],
    concepts: ['pattern-structural'],
  },

  {
    id: 'dp-struct-9',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PATTERNS_STRUCTURAL,
    course: Course.WEB_DEV,
    question: `Checkout requires calling three separate subsystems in the right order: charge the payment gateway, decrement inventory, and queue a shipping confirmation email. Callers currently duplicate this three-step sequence at every call site. You want one method, checkout.complete(order), that hides the subsystem calls behind a single simple interface. Which pattern is this?`,
    options: [
      { id: 'a', text: 'Facade — a single class exposes one simplified method that internally coordinates the payment, inventory, and shipping subsystems', isCorrect: true },
      { id: 'b', text: 'Adapter — convert one subsystem\'s interface into the shape another subsystem expects', isCorrect: false },
      { id: 'c', text: 'Proxy — control access to a single subsystem by standing in front of it', isCorrect: false },
      { id: 'd', text: 'Mediator — let the three subsystems talk to each other directly through a shared coordinator object', isCorrect: false },
    ],
    explanation: `Facade provides a single, simplified entry point over a set of complex subsystems, without changing any of the subsystems' own interfaces. Here checkout.complete(order) hides the payment/inventory/shipping orchestration behind one call. Adapter is about interface mismatch between two things, Proxy is about controlling access to one thing, and Mediator centralizes communication BETWEEN peer objects rather than simplifying a call for external callers.`,
    hints: [
      'One simplified method standing in front of several subsystems',
      'The subsystems themselves are not being adapted or wrapped individually - just fronted by one entry point',
    ],
    tags: ['facade', 'structural', 'subsystem', 'simplification'],
    concepts: ['pattern-structural'],
  },

  // =====================================================================
  // PATTERNS_BEHAVIORAL (4 questions)
  // =====================================================================

  {
    id: 'dp-behav-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PATTERNS_BEHAVIORAL,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: `Implement a simple EventEmitter class in TypeScript with three methods:
- on(event, callback): Register a listener for an event
- off(event, callback): Remove a specific listener
- emit(event, ...args): Call all listeners registered for that event

The class should support multiple listeners per event.`,
    starterCode: `class EventEmitter {
  // TODO: Store listeners
  // TODO: on(event, callback)
  // TODO: off(event, callback)
  // TODO: emit(event, ...args)
}`,
    testCases: [
      {
        input: 'emitter.on("click", handler)',
        expectedOutput: 'on(event',
        description: 'Should register event listeners',
      },
      {
        input: 'emitter.off("click", handler)',
        expectedOutput: 'off(event',
        description: 'Should remove specific listeners',
      },
      {
        input: 'emitter.emit("click", data)',
        expectedOutput: 'emit(event',
        description: 'Should call all registered listeners with provided arguments',
      },
    ],
    solution: `class EventEmitter {
  private listeners: Map<string, Set<Function>> = new Map();

  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  off(event: string, callback: Function): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.delete(callback);
    }
  }

  emit(event: string, ...args: any[]): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => callback(...args));
    }
  }
}`,
    explanation: `This is the Observer Pattern (also called Pub/Sub or EventEmitter). Objects subscribe to events and get notified when those events occur, without the publisher knowing anything about the subscribers. This pattern is everywhere: Node.js EventEmitter, DOM addEventListener, Redux store.subscribe(), RxJS Observables, WebSocket message handlers, and React's synthetic event system. The key benefit: loose coupling — the emitter does not need to know who is listening or what they do with the data.`,
    hints: [
      'Use a Map to store event names as keys and arrays/sets of callbacks as values',
      'emit should iterate over all callbacks for that event and call each one',
      'off needs to find and remove a specific callback reference',
    ],
    tags: ['observer', 'eventemitter', 'behavioral', 'pub-sub'],
    concepts: ['pattern-behavioral'],
  },

  {
    id: 'dp-behav-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PATTERNS_BEHAVIORAL,
    course: Course.WEB_DEV,
    question: `React's useState hook triggers a component re-render whenever the state value changes. Which design pattern does this most closely resemble?`,
    options: [
      { id: 'a', text: 'Strategy Pattern — swapping rendering algorithms', isCorrect: false },
      { id: 'b', text: 'Command Pattern — setState is a command object', isCorrect: false },
      { id: 'c', text: 'Observer Pattern — the component "observes" state changes and automatically re-renders (reacts) when the state it depends on is updated via setState', isCorrect: true },
      { id: 'd', text: 'Memento Pattern — state snapshots for undo', isCorrect: false },
    ],
    explanation: `React is fundamentally built on the Observer Pattern. When you call setState, React's internal reconciler is notified of the change, compares the new virtual DOM with the previous one, and re-renders affected components. The component "subscribes" to its state — any update triggers re-rendering. This extends to useContext (multiple components observe shared state), Redux (components subscribe to store slices), and MobX (observable properties). Even the name "React" hints at this: components react to state changes.`,
    hints: [
      'What happens when you call setState? The component automatically updates.',
      'The component does not poll for changes — it is notified automatically',
    ],
    tags: ['observer', 'react', 'useState', 'reactivity'],
    concepts: ['pattern-behavioral', 'react-state-immutability'],
  },

  {
    id: 'dp-behav-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PATTERNS_BEHAVIORAL,
    course: Course.WEB_DEV,
    question: `Your e-commerce app supports multiple payment methods: credit card, PayPal, crypto, and bank transfer. Each has completely different processing logic. You want to select the processing algorithm at runtime based on user choice, without using a giant switch statement. Which pattern fits?`,
    options: [
      { id: 'a', text: 'Factory Pattern — create different payment objects', isCorrect: false },
      { id: 'b', text: 'Template Method Pattern — define the payment skeleton in a base class', isCorrect: false },
      { id: 'c', text: 'State Pattern — payment processor changes behavior based on its state', isCorrect: false },
      { id: 'd', text: 'Strategy Pattern — define a PaymentStrategy interface with a process() method, implement CreditCardStrategy, PayPalStrategy, CryptoStrategy, and BankTransferStrategy, then pass the chosen strategy to the payment processor at runtime', isCorrect: true },
    ],
    explanation: `The Strategy Pattern defines a family of interchangeable algorithms. The PaymentProcessor does not care how payment works — it just calls strategy.process(order). Swapping from credit card to crypto means swapping the strategy object, not modifying the processor. This is composition over inheritance in action. Real-world examples: passport.js strategies (LocalStrategy, GoogleStrategy, JWTStrategy), sorting algorithms (Array.sort takes a comparator — that is a strategy!), compression algorithms, and validation rules. The key distinction from Factory: Factory is about creating objects; Strategy is about swapping behavior.`,
    hints: [
      'Which pattern specifically deals with making algorithms interchangeable?',
      'The client should be able to swap the algorithm without changing the code that uses it',
    ],
    tags: ['strategy', 'behavioral', 'payment', 'composition'],
    concepts: ['pattern-behavioral'],
  },

  {
    id: 'dp-behav-4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.PATTERNS_BEHAVIORAL,
    course: Course.WEB_DEV,
    question: `You're building a text editor with undo/redo functionality and a macro recording feature (replay a sequence of actions). Each action (type text, delete, format bold, change font) must be stored as an object that can be executed, undone, and replayed. Which pattern is designed for this?`,
    options: [
      { id: 'a', text: 'Command Pattern — encapsulate each action as an object with execute() and undo() methods, store them in a history stack for undo/redo, and in a list for macro replay', isCorrect: true },
      { id: 'b', text: 'Memento Pattern — save and restore editor state snapshots', isCorrect: false },
      { id: 'c', text: 'Observer Pattern — notify the editor when actions happen', isCorrect: false },
      { id: 'd', text: 'Strategy Pattern — swap between different editing algorithms', isCorrect: false },
    ],
    explanation: `The Command Pattern turns actions into first-class objects. Each command (TypeCommand, DeleteCommand, FormatCommand) has execute() and undo() methods. A history stack tracks executed commands — undo pops and calls undo(), redo pushes and calls execute(). Macros are just arrays of commands replayed in sequence. Real-world examples: Redux actions (plain objects representing state changes), database transactions (commit/rollback), task queues (Bull, Celery — jobs are command objects), and Git (each commit is a command that can be reverted). Key difference from Strategy: Strategy swaps algorithms; Command encapsulates requests as objects for deferred execution, queuing, and undo.`,
    hints: [
      'Which pattern turns requests/actions into standalone objects?',
      'Think about what data structure you would need for undo — a stack of action objects',
    ],
    tags: ['command', 'behavioral', 'undo-redo', 'editor', 'task-queue'],
    concepts: ['pattern-behavioral'],
  },

  {
    id: 'dp-behav-5',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PATTERNS_BEHAVIORAL,
    course: Course.WEB_DEV,
    question: `An incoming HTTP request must pass through authentication, then logging, then rate-limiting, before finally reaching the route handler. Each step can either handle the request and stop, or pass it along to the next step. This is exactly how Express and Django middleware work. Which pattern describes it?`,
    options: [
      { id: 'a', text: 'Decorator — wrap the route handler with each cross-cutting concern so it gains auth, logging, and limiting behavior', isCorrect: false },
      { id: 'b', text: 'Observer — each middleware subscribes to a request event', isCorrect: false },
      { id: 'c', text: 'Chain of Responsibility — pass the request along a chain where each link handles it or forwards on', isCorrect: true },
      { id: 'd', text: 'Strategy — swap the request-handling algorithm at runtime', isCorrect: false },
    ],
    explanation: `Chain of Responsibility decouples the sender of a request from its receivers by giving multiple handlers a chance to process it in sequence. Each handler holds a reference to the "next" one; it either handles the request (and optionally stops) or calls next() to forward it. Middleware pipelines are the canonical web example — Express's next(), Django's middleware __call__, and ASP.NET's request pipeline are all Chain of Responsibility. Other examples: event bubbling in the DOM, logging frameworks with handler levels, and approval workflows (escalate to the next approver). The key trait: handlers are linked and the request flows down the chain until one stops it.`,
    hints: [
      'Each step can either deal with the request or hand it onward',
      'Think about how Express next() or Django middleware threads a request through layers',
    ],
    tags: ['chain-of-responsibility', 'behavioral', 'middleware', 'pipeline'],
    concepts: ['pattern-behavioral'],
  },

  {
    id: 'dp-behav-6',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PATTERNS_BEHAVIORAL,
    course: Course.WEB_DEV,
    question: `An order moves through Pending → Paid → Shipped → Delivered, with Cancelled possible from some states. The allowed actions differ per state (you can't ship an unpaid order), and the logic has become a sprawling tangle of if/elif checks on a status string scattered across methods. Which pattern cleans this up?`,
    options: [
      { id: 'a', text: 'State — make each state an object that defines its own allowed actions and transitions', isCorrect: true },
      { id: 'b', text: 'Strategy — let the caller pick a processing algorithm at runtime and inject it into the order object', isCorrect: false },
      { id: 'c', text: 'Command — store each transition as an undoable action object', isCorrect: false },
      { id: 'd', text: 'Observer — notify subscribers whenever the order changes', isCorrect: false },
    ],
    explanation: `The State Pattern lets an object change its behavior when its internal state changes, as if it changed class. Each state (PendingState, PaidState, ShippedState) is an object implementing the same interface (pay(), ship(), cancel()); the order delegates to its current state object, which performs the action and returns the next state. Illegal transitions are simply not implemented (or throw) in a given state, replacing scattered if/elif chains with localized, self-contained rules. State is structurally identical to Strategy — both delegate to a swappable object — but the intent differs: in Strategy the client picks the algorithm; in State the object transitions itself between states in response to actions.`,
    hints: [
      'The behavior depends entirely on which state the object is currently in',
      'Compare with Strategy: who decides the switch — the client, or the object itself?',
    ],
    tags: ['state', 'behavioral', 'state-machine', 'transitions'],
    concepts: ['pattern-behavioral'],
  },

  {
    id: 'dp-behav-7',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PATTERNS_BEHAVIORAL,
    course: Course.WEB_DEV,
    question: `You're writing data importers for CSV, JSON, and XML files. All three follow the identical skeleton: open the file, parse it, validate the rows, then save to the database. ONLY the parse step differs per format. You want to write the skeleton once and let each format supply just its parse step. Which pattern fits?`,
    options: [
      { id: 'a', text: 'Strategy — inject the parsing algorithm as a separate composed object that callers choose and pass in at runtime', isCorrect: false },
      { id: 'b', text: 'Template Method — put the fixed skeleton in a base class and let subclasses override the varying step', isCorrect: true },
      { id: 'c', text: 'Factory — create the correct importer object per file type', isCorrect: false },
      { id: 'd', text: 'Decorator — wrap a base importer to add parsing behavior', isCorrect: false },
    ],
    explanation: `The Template Method Pattern defines the skeleton of an algorithm in a base-class method (importData(): open → parse → validate → save), deferring specific steps to subclasses via overridable hooks (parse()). The overall sequence is fixed and lives in one place; subclasses (CsvImporter, JsonImporter) override only parse(). This enforces the "don't change the order, just the steps" contract. Template Method uses inheritance to vary a step; its close cousin Strategy uses composition (inject a parser object) to do something similar — prefer Strategy when you need to swap the step at runtime or avoid deep class hierarchies, and Template Method when the skeleton is stable and the variation is a fixed set of subclasses.`,
    hints: [
      'The sequence of steps is fixed; only one step changes per variant',
      'Contrast inheritance (override a step) with composition (inject a strategy)',
    ],
    tags: ['template-method', 'behavioral', 'inheritance', 'skeleton'],
    concepts: ['pattern-behavioral'],
  },

  {
    id: 'dp-behav-8',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PATTERNS_BEHAVIORAL,
    course: Course.WEB_DEV,
    question: `You've built a custom paginated collection that internally fetches data in batches. You want callers to loop over all items with a plain "for item of collection" (JS) or "for item in collection" (Python) loop, without exposing how batching or storage works. Which pattern provides this?`,
    options: [
      { id: 'a', text: 'Observer — push each item to the caller as soon as it is available, notifying subscribers as data streams in', isCorrect: false },
      { id: 'b', text: 'Composite — represent the collection as a tree of nodes', isCorrect: false },
      { id: 'c', text: 'Command — wrap each element access in an action object', isCorrect: false },
      { id: 'd', text: 'Iterator — expose a standard way to traverse elements in order, hiding the underlying representation', isCorrect: true },
    ],
    explanation: `The Iterator Pattern provides a uniform way to access elements of a collection sequentially without exposing its internal structure. Both languages bake it into the syntax: in JavaScript an object is iterable if it implements [Symbol.iterator]() returning an object with next(), and generator functions (function*) produce iterators automatically; in Python you implement __iter__/__next__ or, more commonly, write a generator with yield. This lets a paginated collection fetch the next batch lazily inside next(), so the caller's simple for-loop transparently walks every item across batch boundaries. The pattern separates "how to traverse" from "how the data is stored."`,
    hints: [
      'You want the caller to use a normal for-loop over a custom collection',
      'Think Symbol.iterator / generators (JS) or __iter__ / yield (Python)',
    ],
    tags: ['iterator', 'behavioral', 'generators', 'traversal'],
    concepts: ['pattern-behavioral'],
  },

  // =====================================================================
  // PATTERNS_ARCHITECTURAL (5 questions)
  // =====================================================================

  {
    id: 'dp-arch-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PATTERNS_ARCHITECTURAL,
    course: Course.WEB_DEV,
    question: `Match each framework to its architectural pattern:
- Django: Model-View-Template (MVT) — the "View" handles logic, the "Template" handles presentation
- React: Component-based architecture — state + render are co-located in components
- Angular: MVVM — two-way data binding between View and ViewModel
- Express.js: Middleware pipeline — request flows through a chain of functions

Which statement about MVC vs component-based architecture is TRUE?`,
    options: [
      { id: 'a', text: 'MVC is always better because separation of concerns is always good', isCorrect: false },
      { id: 'b', text: 'MVC (and MVT/MVVM) separates concerns into distinct layers, which is great for large teams but can lead to "action at a distance" where changing a model affects distant views. Component-based architecture co-locates related logic, template, and styles, making components self-contained but potentially duplicating shared logic.', isCorrect: true },
      { id: 'c', text: 'Component-based architecture is always better because co-location is always good', isCorrect: false },
      { id: 'd', text: 'MVC and component-based architecture are the same thing with different names', isCorrect: false },
    ],
    explanation: `There is no universally "best" architecture — it depends on the project. Django's MVT works brilliantly for server-rendered apps where views are independent pages. React's component model shines for interactive UIs where a button's state, logic, and appearance belong together. Angular's MVVM with two-way binding suits form-heavy enterprise apps. The real skill is knowing when each architecture fits. Many modern apps combine patterns: a React frontend (component-based) talking to a Django backend (MVT) through a REST API.`,
    hints: [
      'Consider the trade-offs, not which is "best"',
      'Different frameworks chose different patterns for good reasons',
    ],
    tags: ['mvc', 'mvvm', 'components', 'architectural', 'django', 'react'],
    concepts: ['pattern-architectural'],
  },

  {
    id: 'dp-arch-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PATTERNS_ARCHITECTURAL,
    course: Course.WEB_DEV,
    question: `In Clean Architecture (also called Hexagonal or Ports & Adapters), the fundamental rule is: "dependencies point inward." Your domain/business logic sits at the center and has ZERO dependencies on frameworks, databases, or UI. What does this mean in practice?`,
    options: [
      { id: 'a', text: 'All code must be in a single file to minimize dependencies', isCorrect: false },
      { id: 'b', text: 'The database layer should define the business rules since data is central', isCorrect: false },
      { id: 'c', text: 'Your domain logic (e.g., "calculate order total with tax") is a pure function/class with no imports from Django, Express, Prisma, or any framework. The outer layers (controllers, repositories) depend on the domain — never the reverse. To talk to a database, the domain defines an interface (port), and an outer adapter implements it.', isCorrect: true },
      { id: 'd', text: 'The UI framework should control the application flow since users interact with it first', isCorrect: false },
    ],
    explanation: `Clean Architecture protects your most valuable code (business logic) from the most volatile code (frameworks, databases, APIs). Consider: your tax calculation logic will outlive your current web framework. If your Order class imports from django.db.models, you cannot reuse it in a CLI tool or test it without Django. Instead, Order is a plain class, and DjangoOrderRepository (an adapter) handles database persistence. Swapping from PostgreSQL to MongoDB means writing a new adapter — your business logic never changes. This is the Dependency Inversion Principle (the D in SOLID) applied at the architectural level.`,
    hints: [
      'The core question is: does your business logic import any framework code?',
      'Think about what you would need to change if you swapped your web framework entirely',
    ],
    tags: ['clean-architecture', 'hexagonal', 'ports-adapters', 'solid', 'dependency-inversion'],
    concepts: ['pattern-architectural'],
  },

  {
    id: 'dp-arch-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.PATTERNS_ARCHITECTURAL,
    course: Course.WEB_DEV,
    question: `A startup is building their first product — an e-commerce platform with basic features (product catalog, cart, checkout, user accounts). The team has 4 developers. A senior engineer proposes starting with microservices (separate services for users, products, orders, payments, notifications). What is the best advice?`,
    options: [
      { id: 'a', text: 'Microservices are always better for scalability, so start with them', isCorrect: false },
      { id: 'b', text: 'Use serverless functions — one function per endpoint', isCorrect: false },
      { id: 'c', text: 'Use a monolith but plan to rewrite everything as microservices in 6 months', isCorrect: false },
      { id: 'd', text: 'Start with a well-structured monolith (clear module boundaries), then extract microservices later ONLY when specific scaling bottlenecks arise — premature microservices add distributed system complexity (network failures, data consistency, deployment orchestration, monitoring) that a 4-person team cannot sustain', isCorrect: true },
    ],
    explanation: `"Monolith first" is widely accepted wisdom (Martin Fowler, Sam Newman). Microservices solve organizational and scaling problems — not code quality problems. With 4 developers, a monolith gives you: simple deployment, easy debugging, ACID transactions, straightforward development. Microservices would add: network latency, distributed transactions (saga pattern), service discovery, container orchestration (Kubernetes), per-service CI/CD, distributed tracing, and eventual consistency headaches. The key: build your monolith with clear module boundaries (products/, orders/, users/ packages) so extraction is easy when you need it. Many successful companies (Shopify, Basecamp, Stack Overflow) run on well-structured monoliths.`,
    hints: [
      'Consider the team size and the complexity that microservices introduce',
      'What problems do microservices solve? Does a 4-person startup have those problems?',
    ],
    tags: ['microservices', 'monolith', 'architectural', 'trade-offs', 'startup'],
    concepts: ['pattern-architectural'],
  },

  {
    id: 'dp-arch-4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.PATTERNS_ARCHITECTURAL,
    course: Course.WEB_DEV,
    question: `Your application needs to: (1) process new user signups, (2) send a welcome email, (3) create a Stripe customer, (4) add the user to a CRM, (5) send a Slack notification to the sales team. Currently, the signup endpoint does all 5 steps synchronously and takes 8 seconds. Which architectural pattern decouples these operations?`,
    options: [
      { id: 'a', text: 'Event-Driven Architecture — the signup handler emits a "user.created" event to a message queue (RabbitMQ, SQS, Kafka). Independent consumers handle email, Stripe, CRM, and Slack. The signup returns in 200ms. If the email service is down, the message stays in the queue and retries automatically.', isCorrect: true },
      { id: 'b', text: 'Microservices — split into 5 separate services', isCorrect: false },
      { id: 'c', text: 'CQRS — separate the write model from read model', isCorrect: false },
      { id: 'd', text: 'Serverless — use cloud functions for each step', isCorrect: false },
    ],
    explanation: `Event-Driven Architecture (EDA) decouples producers from consumers. The signup handler only creates the user and publishes an event — it does not know or care about email, Stripe, CRM, or Slack. Each consumer subscribes to "user.created" and handles its job independently. Benefits: (1) Signup is fast (200ms instead of 8s). (2) If Slack is down, the email still sends — failures are isolated. (3) Adding a new step (analytics tracking) means adding a new consumer — no changes to signup code. (4) Messages can be retried automatically. Tools: RabbitMQ, AWS SQS/SNS, Apache Kafka, Redis Streams, BullMQ. This pattern is the backbone of most large-scale systems.`,
    hints: [
      'The core problem is that 5 independent operations are coupled into one synchronous call',
      'What if you could just announce "a user was created" and let others react?',
    ],
    tags: ['event-driven', 'pub-sub', 'message-queue', 'decoupling', 'architectural'],
    concepts: ['pattern-behavioral', 'pattern-architectural'],
  },

  {
    id: 'dp-arch-5',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PATTERNS_ARCHITECTURAL,
    course: Course.WEB_DEV,
    language: CodeLanguage.PYTHON,
    question: `Implement a Repository Pattern for user data access. Create:
1. An abstract UserRepository base class with methods: get_by_id(id), get_all(), save(user), delete(id)
2. A concrete InMemoryUserRepository that stores users in a dictionary
3. Users are simple dicts with "id" and "name" keys

This pattern lets you swap backends (database, API, file) without changing business logic.`,
    starterCode: `from abc import ABC, abstractmethod
from typing import Optional

class UserRepository(ABC):
    # TODO: Define abstract methods
    pass

class InMemoryUserRepository(UserRepository):
    # TODO: Implement with a dictionary
    pass`,
    testCases: [
      {
        input: 'UserRepository base class',
        expectedOutput: '@abstractmethod',
        description: 'Should use abstract methods for the interface',
      },
      {
        input: 'InMemoryUserRepository',
        expectedOutput: 'def get_by_id',
        description: 'Should implement get_by_id method',
      },
      {
        input: 'storage',
        expectedOutput: 'self._users',
        description: 'Should use internal dictionary for storage',
      },
    ],
    solution: `from abc import ABC, abstractmethod
from typing import Optional

class UserRepository(ABC):
    @abstractmethod
    def get_by_id(self, user_id: str) -> Optional[dict]:
        pass

    @abstractmethod
    def get_all(self) -> list[dict]:
        pass

    @abstractmethod
    def save(self, user: dict) -> None:
        pass

    @abstractmethod
    def delete(self, user_id: str) -> None:
        pass

class InMemoryUserRepository(UserRepository):
    def __init__(self):
        self._users: dict[str, dict] = {}

    def get_by_id(self, user_id: str) -> Optional[dict]:
        return self._users.get(user_id)

    def get_all(self) -> list[dict]:
        return list(self._users.values())

    def save(self, user: dict) -> None:
        self._users[user["id"]] = user

    def delete(self, user_id: str) -> None:
        self._users.pop(user_id, None)`,
    explanation: `The Repository Pattern abstracts data access behind a clean interface. Your business logic depends on UserRepository (abstract), not on any specific storage. In tests, use InMemoryUserRepository. In production, use PostgresUserRepository or DjangoUserRepository. This is Dependency Inversion: high-level code depends on abstractions, not concretions. Django's ORM Manager is essentially a repository. In Clean Architecture, repositories sit at the boundary between domain logic and infrastructure. Swapping from SQL to MongoDB means writing one new class — no business logic changes.`,
    hints: [
      'Use ABC and @abstractmethod to define the interface',
      'The InMemoryUserRepository stores users in a plain dict keyed by ID',
      'Each method in the concrete class must match the abstract interface exactly',
    ],
    tags: ['repository', 'architectural', 'abstraction', 'clean-architecture', 'python'],
    concepts: ['pattern-architectural'],
  },

  {
    id: 'dp-arch-6',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PATTERNS_ARCHITECTURAL,
    course: Course.WEB_DEV,
    question: `The classic layered (n-tier) architecture splits an app into a presentation layer, a business-logic layer, and a data-access layer. What is the core rule that makes it "layered"?`,
    options: [
      { id: 'a', text: 'Every layer may freely call any other layer directly, in any direction, to avoid extra indirection', isCorrect: false },
      { id: 'b', text: 'Each layer depends only on the layer below it: presentation → business → data, never upward', isCorrect: true },
      { id: 'c', text: 'The data layer drives the application and calls up into the UI', isCorrect: false },
      { id: 'd', text: 'Layers are just naming labels with no rule about who calls whom', isCorrect: false },
    ],
    explanation: `Layered architecture organizes code into horizontal layers where dependencies flow in one direction — downward. The presentation layer (controllers, views) calls the business layer (services, domain logic), which calls the data layer (repositories, ORM). A lower layer never depends on a higher one; the UI can be swapped without touching business rules, and the database can change without touching the UI. This one-directional rule is what prevents the "big ball of mud" where everything calls everything. It is the simplest, most common enterprise architecture and the conceptual foundation that Clean/Hexagonal architecture refines (by inverting the data-layer dependency).`,
    hints: [
      'The defining property is the *direction* dependencies are allowed to flow',
      'Could the database layer reach up and call the UI?',
    ],
    tags: ['layered', 'n-tier', 'architectural', 'separation-of-concerns'],
    concepts: ['pattern-architectural'],
  },

  {
    id: 'dp-arch-7',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.PATTERNS_ARCHITECTURAL,
    course: Course.WEB_DEV,
    question: `In an analytics dashboard, reads vastly outnumber writes and need complex denormalized views, while writes are simple and must be strictly validated. Forcing both through one shared model has made it bloated and slow. Which architectural pattern separates these concerns?`,
    options: [
      { id: 'a', text: 'Repository — abstract all data access behind one interface so the underlying storage backend can be swapped freely', isCorrect: false },
      { id: 'b', text: 'Event Sourcing — persist every change as an append-only event log', isCorrect: false },
      { id: 'c', text: 'CQRS — split the write model (commands) from the read model (queries), optimizing each independently', isCorrect: true },
      { id: 'd', text: 'Saga — coordinate a long-running transaction across services', isCorrect: false },
    ],
    explanation: `CQRS (Command Query Responsibility Segregation) separates the model that handles writes (commands: validated, normalized, transactional) from the model that handles reads (queries: denormalized, optimized for the exact shapes the UI needs). The two can use different schemas, even different databases, and scale independently (read replicas for queries). CQRS is frequently paired with Event Sourcing (the write side emits events that project into read models) but the two are distinct — you can do CQRS without event sourcing. The cost is added complexity and eventual consistency between the write and read sides, so it is justified only when read/write needs genuinely diverge — not for ordinary CRUD.`,
    hints: [
      'The reads and writes have fundamentally different shapes and scaling needs',
      'Think about separating the query path from the command path entirely',
    ],
    tags: ['cqrs', 'architectural', 'read-write-separation', 'scaling'],
    concepts: ['pattern-architectural'],
  },

  {
    id: 'dp-arch-8',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.PATTERNS_ARCHITECTURAL,
    course: Course.WEB_DEV,
    question: `Placing an order spans three microservices — Payment, Inventory, and Shipping — each with its own database. You can't wrap them in one ACID transaction. If Inventory fails after Payment already charged the card, how do you keep the system consistent?`,
    options: [
      { id: 'a', text: 'Saga — run a sequence of local transactions, each with a compensating action to undo earlier steps on failure', isCorrect: true },
      { id: 'b', text: 'Two-phase locking across all three databases to form one global transaction', isCorrect: false },
      { id: 'c', text: 'Wrap all three service calls in a single try/catch inside the order service and manually roll back on any error', isCorrect: false },
      { id: 'd', text: 'Use CQRS to separate the read and write models for orders', isCorrect: false },
    ],
    explanation: `A Saga manages data consistency across services WITHOUT a distributed ACID transaction (which doesn't scale across independent databases). The work is broken into a series of local transactions; if a step fails, the saga runs compensating transactions to semantically undo the completed steps (refund the payment, release the reserved stock). Two coordination styles exist: choreography (each service emits events the next reacts to — decentralized, pairs naturally with event-driven architecture) and orchestration (a central coordinator tells each service what to do). The tradeoff is that you get eventual consistency and must design explicit compensations, not the all-or-nothing atomicity of a single database transaction.`,
    hints: [
      'A single ACID transaction across separate databases is not available',
      'If a later step fails, how do you semantically undo the steps that already committed?',
    ],
    tags: ['saga', 'architectural', 'distributed-transactions', 'compensation', 'microservices'],
    concepts: ['pattern-architectural'],
  },

  {
    id: 'dp-arch-9',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PATTERNS_ARCHITECTURAL,
    course: Course.WEB_DEV,
    question: `A web app and a mobile app consume the same set of microservices, but they need very different data shapes. The mobile client over-fetches and makes too many round trips against the generic API, hurting performance on slow networks. Which architectural pattern addresses this?`,
    options: [
      { id: 'a', text: 'API Gateway — one shared entry point that routes every client\'s requests onward to the appropriate services', isCorrect: false },
      { id: 'b', text: 'GraphQL — let every client query exactly the fields it needs', isCorrect: false },
      { id: 'c', text: 'Monolith — merge the services so a single API serves both clients', isCorrect: false },
      { id: 'd', text: 'Backend for Frontend — a tailored backend per client type that aggregates service calls for it', isCorrect: true },
    ],
    explanation: `Backend for Frontend (BFF) introduces a separate, thin backend for each client experience (one for web, one for mobile). Each BFF aggregates and reshapes calls to the underlying microservices into exactly the payload its client needs, eliminating over-fetching and chatty round trips. It differs from a plain API Gateway: a gateway is one shared routing/cross-cutting layer for all clients, whereas a BFF is owned by and optimized for a single client, so the web and mobile teams can evolve their backends independently. GraphQL is a legitimate alternative solution to over-fetching, but it is a query technology, not this architectural ownership pattern. BFFs are common at companies with multiple distinct client platforms.`,
    hints: [
      'The two clients need different shapes from the same services',
      'Contrast a per-client backend with a single shared gateway for everyone',
    ],
    tags: ['bff', 'backend-for-frontend', 'architectural', 'api-gateway', 'microservices'],
    concepts: ['pattern-architectural'],
  },

  // =====================================================================
  // API_DESIGN (4 questions)
  // =====================================================================

  {
    id: 'dp-api-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.API_DESIGN,
    course: Course.WEB_DEV,
    question: `You're designing a REST API for a blog platform. Match each operation to the correct HTTP method:

1. Get a list of posts
2. Create a new post
3. Replace an entire post (all fields)
4. Update just the post's title
5. Remove a post

Which mapping follows REST conventions correctly?`,
    options: [
      { id: 'a', text: '1=GET /posts, 2=PUT /posts, 3=POST /posts/:id, 4=PATCH /posts/:id, 5=DELETE /posts/:id', isCorrect: false },
      { id: 'b', text: '1=GET /posts, 2=POST /posts, 3=PUT /posts/:id, 4=PATCH /posts/:id, 5=DELETE /posts/:id — GET reads, POST creates, PUT replaces entirely, PATCH updates partially, DELETE removes', isCorrect: true },
      { id: 'c', text: '1=GET /posts, 2=POST /posts, 3=PATCH /posts/:id, 4=PUT /posts/:id, 5=POST /posts/:id/delete', isCorrect: false },
      { id: 'd', text: '1=POST /getPosts, 2=POST /createPost, 3=POST /updatePost, 4=POST /updatePost, 5=POST /deletePost', isCorrect: false },
    ],
    explanation: `REST uses HTTP methods as verbs so URLs can be clean nouns. GET is safe (no side effects) and idempotent. POST creates a new resource (not idempotent — calling twice creates two posts). PUT replaces the entire resource (idempotent — calling twice has the same result). PATCH updates partial fields (send only { title: "new" } instead of the whole object). DELETE removes the resource. Option D is the "RPC over HTTP" anti-pattern — using POST for everything and putting the verb in the URL. Real APIs: GitHub, Stripe, and Twilio all follow these conventions closely.`,
    hints: [
      'PUT means "replace this entire resource with what I am sending"',
      'PATCH means "update only the fields I am sending"',
      'POST is for creating new resources — it is the only non-idempotent method here',
    ],
    tags: ['rest', 'http-methods', 'api-design', 'crud'],
    concepts: ['api-rest-conventions'],
  },

  {
    id: 'dp-api-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.API_DESIGN,
    course: Course.WEB_DEV,
    question: `Your API needs to handle these scenarios. Match each to the correct HTTP status code:

- Successfully created a new user → ?
- Request body is missing required "email" field → ?
- Valid JWT token but user lacks admin permission → ?
- No auth token provided at all → ?
- Trying to create a user with an email that already exists → ?
- Server's database connection failed → ?`,
    options: [
      { id: 'a', text: '200 OK, 400 Bad Request, 401 Unauthorized, 401 Unauthorized, 400 Bad Request, 500 Internal Server Error', isCorrect: false },
      { id: 'b', text: '200 OK, 400 Bad Request, 403 Forbidden, 403 Forbidden, 400 Bad Request, 503 Service Unavailable', isCorrect: false },
      { id: 'c', text: '201 Created, 422 Unprocessable Entity, 403 Forbidden, 401 Unauthorized, 409 Conflict, 500 Internal Server Error', isCorrect: true },
      { id: 'd', text: '201 Created, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 422 Unprocessable Entity, 500 Internal Server Error', isCorrect: false },
    ],
    explanation: `Status codes tell clients what happened without parsing the body. Key distinctions: 200 = success, 201 = created (for POST that creates resources). 400 = malformed request (bad JSON), 422 = well-formed but semantically invalid (missing required field). 401 = "who are you?" (no/invalid authentication), 403 = "I know who you are, but you cannot do this" (insufficient permissions). 409 = conflict (duplicate email). 500 = server error (not the client's fault). Getting these right matters: frontend code often switches behavior based on status codes (401 → redirect to login, 403 → show "access denied", 409 → show "email taken").`,
    hints: [
      '401 means "not authenticated" (who are you?), 403 means "not authorized" (you cannot do this)',
      '409 Conflict is specifically for duplicate/conflicting resources',
      '422 is for validation errors where the request is well-formed but contains invalid data',
    ],
    tags: ['status-codes', 'http', 'api-design', 'rest'],
    concepts: ['api-rest-conventions'],
  },

  {
    id: 'dp-api-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.API_DESIGN,
    course: Course.WEB_DEV,
    question: `Your API returns a list of 50,000 products. You need pagination. Compare offset-based (page=3&limit=20) vs cursor-based (cursor=abc123&limit=20) pagination:

Which statement about their trade-offs is correct?`,
    options: [
      { id: 'a', text: 'Offset pagination is always faster because it uses SQL OFFSET directly', isCorrect: false },
      { id: 'b', text: 'Cursor pagination is always better — offset pagination has no advantages', isCorrect: false },
      { id: 'c', text: 'They perform identically; the choice is purely cosmetic', isCorrect: false },
      { id: 'd', text: 'Offset pagination allows jumping to any page (page=500) but becomes slow for large offsets (OFFSET 10000 still scans 10000 rows) and can show duplicates/skip items when data is inserted during browsing. Cursor pagination is fast at any position (WHERE id > cursor) and consistent during inserts, but cannot jump to arbitrary pages.', isCorrect: true },
    ],
    explanation: `Offset pagination: SELECT * FROM products LIMIT 20 OFFSET 10000 — the database must scan and discard 10,000 rows. At page 500, this is very slow. Also, if a new product is inserted while a user browses, items shift — they might see the same product twice or skip one. Cursor pagination: SELECT * FROM products WHERE id > 'last_seen_id' LIMIT 20 — uses an indexed column, so it is O(1) regardless of position. No items are skipped or duplicated. Trade-off: you cannot jump to page 500 (no "page" concept). Use offset for small datasets or admin dashboards. Use cursor for infinite scrolling, feeds, or large datasets. Stripe, GitHub, and Slack APIs all use cursor pagination.`,
    hints: [
      'Think about what happens at the database level with OFFSET 10000',
      'What happens if a new row is inserted while someone is browsing page 2?',
    ],
    tags: ['pagination', 'cursor', 'offset', 'api-design', 'performance'],
    concepts: ['api-pagination', 'api-rest-conventions'],
  },

  {
    id: 'dp-api-4',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.API_DESIGN,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: `Design a consistent error response shape for an API. Create:
1. An ApiError class with properties: statusCode, code (machine-readable string), message (human-readable), and optional details (array of field-level errors)
2. A helper function createValidationError(fields) that creates a 422 error from an array of { field, message } objects
3. A helper function createNotFoundError(resource, id) that creates a 404 error

The error should serialize to:
{
  error: {
    code: "VALIDATION_ERROR",
    message: "Validation failed",
    details: [{ field: "email", message: "Email is required" }]
  }
}`,
    starterCode: `// TODO: ApiError class
// TODO: createValidationError helper
// TODO: createNotFoundError helper`,
    testCases: [
      {
        input: 'ApiError class',
        expectedOutput: 'class ApiError',
        description: 'Should define an ApiError class',
      },
      {
        input: 'createValidationError',
        expectedOutput: 'VALIDATION_ERROR',
        description: 'Should create a validation error with code VALIDATION_ERROR',
      },
      {
        input: 'createNotFoundError("User", "123")',
        expectedOutput: 'NOT_FOUND',
        description: 'Should create a not found error with code NOT_FOUND',
      },
    ],
    solution: `class ApiError extends Error {
  statusCode: number;
  code: string;
  details?: { field: string; message: string }[];

  constructor(
    statusCode: number,
    code: string,
    message: string,
    details?: { field: string; message: string }[]
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }

  toJSON() {
    return {
      error: {
        code: this.code,
        message: this.message,
        ...(this.details && { details: this.details }),
      },
    };
  }
}

function createValidationError(
  fields: { field: string; message: string }[]
): ApiError {
  return new ApiError(422, "VALIDATION_ERROR", "Validation failed", fields);
}

function createNotFoundError(resource: string, id: string): ApiError {
  return new ApiError(
    404,
    "NOT_FOUND",
    \`\${resource} with id \${id} not found\`
  );
}`,
    explanation: `Consistent error responses are critical for API usability. Clients need machine-readable codes (for switch statements), human-readable messages (for display), and field-level details (for form validation). The "code" field (VALIDATION_ERROR, NOT_FOUND, UNAUTHORIZED) lets frontend code handle errors programmatically without parsing message strings. The "details" array maps errors to specific form fields. This pattern is used by Stripe (error.type + error.code + error.message), GitHub (message + errors[]), and Google APIs (error.code + error.message + error.errors[]). Having a single ApiError class and helper factories ensures every endpoint returns the same shape.`,
    hints: [
      'Extend the Error class so ApiError works with try/catch',
      'The toJSON method controls serialization — omit details when not present',
      'Helper functions are factories that create pre-configured ApiError instances',
    ],
    tags: ['error-handling', 'api-design', 'typescript', 'validation'],
    concepts: ['js-error-handling', 'api-rest-conventions', 'forms-zod-schema'],
  },

  {
    id: 'dp-api-5',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.API_DESIGN,
    course: Course.WEB_DEV,
    question: `Your public API has thousands of integrations. You need to ship a breaking change to the /users response shape without breaking existing clients. How do you version the API, and what's the common tradeoff?`,
    options: [
      { id: 'a', text: 'Never version the API at all — instead keep every response backward compatible forever, no matter what changes you need', isCorrect: false },
      { id: 'b', text: 'Version via URL path (/v1/), a custom header, or the Accept media type — URL is the most visible and cacheable', isCorrect: true },
      { id: 'c', text: 'Bump a global version number on every change, including non-breaking ones', isCorrect: false },
      { id: 'd', text: 'Rely on HTTP to negotiate versions automatically so clients always match', isCorrect: false },
    ],
    explanation: `APIs with external consumers need explicit versioning so a breaking change can ship as a new version while old clients keep hitting the old one. Three common strategies: URL path (/v1/users — most visible, trivially cacheable and routable, but arguably "un-RESTful"), custom header (X-API-Version: 2 — keeps URLs clean but is invisible in a browser and harder to cache), and Accept media type (Accept: application/vnd.api.v2+json — most "correct" per HTTP but verbose and rarely used). You only version on BREAKING changes; additive changes (new optional fields) shouldn't force a version bump. Stripe famously versions per-account by date. URL versioning is the pragmatic default for most teams.`,
    hints: [
      'List the places a version string can live in an HTTP request',
      'Only breaking changes should require a new version',
    ],
    tags: ['versioning', 'api-design', 'rest', 'breaking-changes'],
    concepts: ['api-rest-conventions'],
  },

  {
    id: 'dp-api-6',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.API_DESIGN,
    course: Course.WEB_DEV,
    question: `A client sends POST /payments, the network times out, and the client retries. The first request actually succeeded, so the naive retry charges the card twice. How do you make the endpoint safe to retry?`,
    options: [
      { id: 'a', text: 'Switch the endpoint from POST to GET so that any network retries become naturally safe and side-effect-free', isCorrect: false },
      { id: 'b', text: 'Add a unique DB constraint and let the duplicate insert throw an error', isCorrect: false },
      { id: 'c', text: 'Accept a client-supplied Idempotency-Key and return the stored result for any retry with the same key', isCorrect: true },
      { id: 'd', text: 'Disable client retries entirely so each request can only run once', isCorrect: false },
    ],
    explanation: `POST is not idempotent by default, so network retries can double-charge. The standard fix (used by Stripe, PayPal, and others) is an idempotency key: the client generates a unique key per logical operation and sends it as an Idempotency-Key header. The server records the key with the result of the first successful request; if a request arrives with a key it has already seen, it returns the SAME stored response instead of re-executing. This makes the operation safe to retry any number of times. A DB unique constraint helps prevent duplicate rows but returns an error rather than the original success response, and changing POST to GET is wrong for an operation with side effects.`,
    hints: [
      'The client needs a way to tell the server "this retry is the same operation as before"',
      'The server must remember the result of the first attempt',
    ],
    tags: ['idempotency', 'api-design', 'retries', 'payments'],
    concepts: ['api-rest-conventions', 'api-idempotency'],
  },

  {
    id: 'dp-api-7',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.API_DESIGN,
    course: Course.WEB_DEV,
    question: `Your API must throttle clients that exceed 100 requests per minute. When a client goes over the limit, how should the API respond so well-behaved clients can back off correctly?`,
    options: [
      { id: 'a', text: 'Return 429 Too Many Requests with a Retry-After header telling the client when to retry', isCorrect: true },
      { id: 'b', text: 'Return 503 Service Unavailable and immediately close the connection so the client is forced to back off', isCorrect: false },
      { id: 'c', text: 'Return 403 Forbidden because the client is misbehaving', isCorrect: false },
      { id: 'd', text: 'Silently drop the extra requests and send no response at all', isCorrect: false },
    ],
    explanation: `The correct status for rate limiting is 429 Too Many Requests, paired with a Retry-After header (seconds, or an HTTP date) so the client knows exactly when it may try again; many APIs also send X-RateLimit-Limit/Remaining/Reset headers. 403 means "authenticated but not allowed" (a permission issue, not a throttling one), and 503 signals the whole service is down rather than this client being limited. Silently dropping requests leaves clients hanging and retrying blindly. Common limiting algorithms behind the scenes: token bucket (allows bursts up to a cap, refills over time), leaky bucket, and fixed/sliding window counters.`,
    hints: [
      'There is a specific 4xx status dedicated to rate limiting',
      'How does the client learn when it is allowed to retry?',
    ],
    tags: ['rate-limiting', 'api-design', '429', 'retry-after', 'token-bucket'],
    concepts: ['api-rest-conventions'],
  },

  {
    id: 'dp-api-8',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.API_DESIGN,
    course: Course.WEB_DEV,
    question: `A GET /products/:id endpoint returns data that changes rarely. You want clients to skip re-downloading the body when nothing has changed, while still being sure they have the latest. Which mechanism does this?`,
    options: [
      { id: 'a', text: 'Append ?nocache=true to the URL so the client is always forced to fetch completely fresh data each time', isCorrect: false },
      { id: 'b', text: 'Store the response in localStorage and never request it again', isCorrect: false },
      { id: 'c', text: 'Use POST so intermediaries are forbidden from caching the response', isCorrect: false },
      { id: 'd', text: 'Send an ETag; the client revalidates with If-None-Match and gets 304 Not Modified when unchanged', isCorrect: true },
    ],
    explanation: `HTTP conditional requests give you "validate cheaply, download only when changed." The server sends an ETag (a hash/version token) with the response. On the next request the client sends If-None-Match: <etag>; if the resource is unchanged the server replies 304 Not Modified with an empty body, so the client reuses its cached copy — saving bandwidth while guaranteeing freshness. Last-Modified / If-Modified-Since works the same way with timestamps. This is far better than localStorage-forever (never sees updates) or cache-busting query strings (always re-downloads). Combine with Cache-Control (max-age, no-cache, private/public) to control how long clients may use a copy before revalidating.`,
    hints: [
      'You want the client to ask "has this changed?" without downloading the whole body',
      'Think ETag + a conditional request header + the 304 status',
    ],
    tags: ['caching', 'etag', 'api-design', 'conditional-requests', '304'],
    concepts: ['api-rest-conventions', 'api-caching'],
  },

  {
    id: 'dp-api-9',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.API_DESIGN,
    course: Course.WEB_DEV,
    question: `A mobile client complains it must call 5 REST endpoints to build one screen and still over-fetches fields it never uses. A teammate proposes GraphQL. What is the accurate tradeoff?`,
    options: [
      { id: 'a', text: 'GraphQL is always faster than REST thanks to its binary wire encoding over HTTP/2 and built-in automatic response compression', isCorrect: false },
      { id: 'b', text: 'Clients request exactly the fields they need in one query — but HTTP caching is harder and complex queries need guarding', isCorrect: true },
      { id: 'c', text: 'GraphQL lets the client query the database directly, removing the need for a backend', isCorrect: false },
      { id: 'd', text: 'GraphQL is just REST with a different URL scheme and no real tradeoffs', isCorrect: false },
    ],
    explanation: `GraphQL exposes a single endpoint where the client describes exactly the data graph it wants in one request — solving over-fetching (no unused fields) and under-fetching (no N round trips). The costs are real: HTTP caching is harder because everything is one POST /graphql (you lose URL-based and 304 caching, so teams add persisted queries or field-level caching), and a malicious or careless deep/nested query can be expensive, so you need query depth/complexity limits and timeouts. It does NOT bypass the backend — resolvers still run server-side and hit your data sources. For comparison, gRPC (binary, HTTP/2, schema-first) shines for fast internal service-to-service calls but is awkward for browsers; REST stays the simplest, most cacheable choice for public CRUD APIs. The right answer is "it depends on the access patterns," not "GraphQL always wins."`,
    hints: [
      'GraphQL fixes over/under-fetching, but what does it cost you on caching?',
      'Does the client really talk to the database, or to server-side resolvers?',
    ],
    tags: ['graphql', 'rest', 'grpc', 'api-design', 'tradeoffs'],
    concepts: ['api-rest-conventions'],
  },

  {
    id: 'dp-api-10',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.API_DESIGN,
    course: Course.WEB_DEV,
    question: `A React form already checks that "email" looks like an email before the Zod schema even lets the user submit. A teammate asks whether the API also needs to validate the email field on the server. Why does the API still need its own validation?`,
    options: [
      { id: 'a', text: 'The server must independently validate every field, because clients (browser devtools, curl, a mobile app, another service) can send any request directly to the API, bypassing the frontend entirely', isCorrect: true },
      { id: 'b', text: 'It does not - once the frontend form validates a field, the API can trust that field on every request that reaches it', isCorrect: false },
      { id: 'c', text: 'Server validation is only needed for numeric fields, since string formats like email are a purely visual concern', isCorrect: false },
      { id: 'd', text: 'Server validation should be skipped to save CPU time, since the database column type already rejects bad data', isCorrect: false },
    ],
    explanation: `Frontend validation is a UX convenience - it gives the user instant feedback without a round trip. It is not a security or data-integrity boundary, because nothing forces a request to come from that form: an attacker (or a bug, or a legitimate non-browser client) can call the API directly with whatever body they want, skipping the client-side checks entirely. The API is the actual trust boundary, so it must re-validate every field itself (the same Zod schema can often be reused server-side in a full-stack Next.js app, which is precisely why "define the schema once, use it on both sides" is a common pattern) rather than assume the frontend already did the job. A database column type catches gross type mismatches at best, not business rules like "must look like an email" or "must be under 500 characters."`,
    hints: [
      'Anyone can send an HTTP request straight to the API, with or without your React form',
      'Client-side validation is about user experience, not security',
    ],
    tags: ['validation', 'zod', 'security', 'api-design', 'trust-boundary'],
    concepts: ['api-rest-conventions'],
  },

  // =====================================================================
  // DB_DESIGN (4 questions)
  // =====================================================================

  {
    id: 'dp-db-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DB_DESIGN,
    course: Course.WEB_DEV,
    question: `A "users" table has columns: id, name, email, street, city, state, zip, phone1, phone2, phone3. A user can have 0-5 phone numbers. What normalization problems exist, and how would you fix them to reach 3NF?`,
    options: [
      { id: 'a', text: 'phone1/phone2/phone3 violates 1NF (repeating groups). Extract to a "phones" table (user_id, phone_number). street/city/state/zip could violate 3NF if zip determines city/state (transitive dependency) — consider an "addresses" table. This eliminates null phone columns and supports any number of phones.', isCorrect: true },
      { id: 'b', text: 'The table is already in 3NF because each column has atomic values', isCorrect: false },
      { id: 'c', text: 'Only the phone columns are problematic — just make them a JSON array', isCorrect: false },
      { id: 'd', text: 'Normalize by splitting into separate tables for each column', isCorrect: false },
    ],
    explanation: `Normalization rules: 1NF = atomic values, no repeating groups. phone1/phone2/phone3 is a repeating group — what about phone4? The fix: a separate "phones" table with (id, user_id, phone_number). 2NF = no partial dependencies (relevant for composite keys). 3NF = no transitive dependencies — if zip_code determines city and state, then city/state depend on zip, not directly on the user. However, pragmatically, many production databases are intentionally denormalized for read performance. Denormalization is OK when: (1) you understand the trade-off, (2) writes are rare but reads are frequent, (3) you accept the risk of data inconsistency. The key is knowing the rules before you break them.`,
    hints: [
      'Count the phone columns — what if a user has 6 phone numbers?',
      '1NF: no repeating groups. 3NF: no transitive dependencies',
      'Think about whether zip code determines city and state',
    ],
    tags: ['normalization', '1nf', '3nf', 'database-design', 'sql'],
    concepts: ['db-normalization'],
  },

  {
    id: 'dp-db-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DB_DESIGN,
    course: Course.WEB_DEV,
    question: `Your "orders" table has 10 million rows. Queries frequently filter by (customer_id, created_at) and also by (status, created_at). You add these indexes:

1. CREATE INDEX idx_customer_date ON orders(customer_id, created_at)
2. CREATE INDEX idx_status_date ON orders(status, created_at)

A developer suggests also adding: CREATE INDEX idx_all ON orders(customer_id, status, created_at, total_amount) as a "covering index." What is a covering index, and what are the trade-offs?`,
    options: [
      { id: 'a', text: 'A covering index is just a regular index on all columns — it has no special behavior', isCorrect: false },
      { id: 'b', text: 'A covering index includes all columns needed by a query, so the database reads ONLY the index (no table lookup). idx_all covers "SELECT total_amount FROM orders WHERE customer_id=? AND status=? ORDER BY created_at" entirely from the index. Trade-off: it speeds up that specific query dramatically but slows down writes (INSERT/UPDATE must update the larger index) and uses more disk space.', isCorrect: true },
      { id: 'c', text: 'A covering index replaces the need for a primary key', isCorrect: false },
      { id: 'd', text: 'More indexes are always better — add indexes on every column', isCorrect: false },
    ],
    explanation: `When a query can be answered entirely from an index without touching the actual table rows, that is a "covering index" (also called an "index-only scan"). In a normal index lookup: (1) find matching entries in the index, (2) follow pointers to the actual table rows, (3) read the requested columns. With a covering index, step 2-3 are eliminated — huge speedup. But indexes have costs: each INSERT must update every index, each UPDATE on indexed columns must update affected indexes, and indexes consume disk space. Rule of thumb: index columns you filter (WHERE), sort (ORDER BY), or join (ON) — but only for queries that actually matter. Use EXPLAIN ANALYZE to verify your indexes are actually used.`,
    hints: [
      'Think about what happens when the database can find ALL needed data in the index itself',
      'Consider what happens to write performance when you add more indexes',
    ],
    tags: ['indexes', 'covering-index', 'b-tree', 'database-performance', 'sql'],
    concepts: ['db-indexing'],
  },

  {
    id: 'dp-db-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DB_DESIGN,
    course: Course.WEB_DEV,
    question: `You're designing a database for a company where employees have managers (who are also employees). Students can enroll in many courses, and each course has many students. An order contains many products, and each product can be in many orders (with a specific quantity per order-product pair). Which relationship types and table designs are correct?`,
    options: [
      { id: 'a', text: 'Employees: separate managers table. Students-Courses: add course_id to students. Orders-Products: add product_ids array to orders.', isCorrect: false },
      { id: 'b', text: 'All three should use JSON columns to store the relationships', isCorrect: false },
      { id: 'c', text: 'Employees: self-referential one-to-many (manager_id FK → employees.id). Students-Courses: many-to-many via junction table "enrollments" (student_id, course_id, enrolled_at). Orders-Products: many-to-many via junction table "order_items" (order_id, product_id, quantity, price_at_purchase).', isCorrect: true },
      { id: 'd', text: 'Employees: many-to-many. Students-Courses: one-to-many. Orders-Products: one-to-one.', isCorrect: false },
    ],
    explanation: `Self-referential relationships: an employee's manager_id points to another row in the same table. This elegantly models hierarchies (org charts, categories with subcategories, threaded comments). Many-to-many relationships always need a junction (join/bridge) table because neither side can hold the foreign key alone. The junction table often carries its own data: enrollments has enrolled_at and grade; order_items has quantity and price_at_purchase (storing price at time of purchase, not current price). Common mistake: storing arrays of IDs in a column — this breaks referential integrity, makes joins impossible, and cannot be indexed efficiently.`,
    hints: [
      'Can an employee\'s manager also be an employee? That is a self-reference.',
      'Many-to-many always needs a third table — where else would you put the foreign keys?',
      'Junction tables often carry their own data (quantity, timestamp, etc.)',
    ],
    tags: ['relations', 'junction-table', 'self-referential', 'many-to-many', 'database-design'],
    concepts: ['prisma-schema-relations', 'db-normalization'],
  },

  {
    id: 'dp-db-4',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DB_DESIGN,
    course: Course.WEB_DEV,
    language: CodeLanguage.PYTHON,
    question: `Demonstrate the N+1 query problem and its fix using Django-style pseudocode.

Show:
1. The WRONG way: a loop that queries the database N+1 times to get all books with their authors
2. The RIGHT way: using select_related (for ForeignKey) to do it in 1 query with a JOIN

Write two functions: get_books_wrong() and get_books_right() that both return a list of "Title by Author" strings.`,
    starterCode: `# Models (for reference, do not redefine):
# class Author: name
# class Book: title, author (ForeignKey to Author)

def get_books_wrong():
    # N+1 problem: 1 query for books + N queries for each author
    pass

def get_books_right():
    # Fixed: 1 query with JOIN using select_related
    pass`,
    testCases: [
      {
        input: 'get_books_wrong()',
        expectedOutput: 'Book.objects.all()',
        description: 'Wrong version should query all books then access author in loop',
      },
      {
        input: 'get_books_right()',
        expectedOutput: 'select_related',
        description: 'Right version should use select_related to eager-load authors',
      },
      {
        input: 'both functions',
        expectedOutput: 'book.author.name',
        description: 'Both should access author name for each book',
      },
    ],
    solution: `def get_books_wrong():
    # 1 query: SELECT * FROM books
    books = Book.objects.all()
    results = []
    for book in books:
        # N queries: SELECT * FROM authors WHERE id = book.author_id
        # Each book.author.name triggers a separate DB query!
        results.append(f"{book.title} by {book.author.name}")
    return results

def get_books_right():
    # 1 query: SELECT * FROM books JOIN authors ON books.author_id = authors.id
    books = Book.objects.select_related("author")
    results = []
    for book in books:
        # No additional query — author data already loaded via JOIN
        results.append(f"{book.title} by {book.author.name}")
    return results`,
    explanation: `The N+1 problem is the most common performance killer in web applications using ORMs. With 1000 books, the "wrong" version executes 1001 queries (1 for books + 1000 for each author). The "right" version executes 1 query using a SQL JOIN. Django solutions: select_related("author") for ForeignKey/OneToOne (uses JOIN). prefetch_related("tags") for ManyToMany/reverse FK (uses 2 queries: one for books, one for all related tags, then joins in Python). SQLAlchemy equivalent: joinedload() and subqueryload(). Detecting N+1: use django-debug-toolbar, which shows query count per request. In production, a page making 500 queries is almost always an N+1 bug.`,
    hints: [
      'In the wrong version, accessing book.author.name inside a loop triggers a query per book',
      'select_related performs a SQL JOIN so author data is fetched alongside books',
      'For ManyToMany relationships, use prefetch_related instead',
    ],
    tags: ['n-plus-one', 'orm', 'django', 'select-related', 'performance', 'database'],
    concepts: ['db-indexing'],
  },

  {
    id: 'dp-db-5',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DB_DESIGN,
    course: Course.WEB_DEV,
    question: `Transferring money debits one account and credits another — two separate UPDATE statements. If the debit succeeds but the credit fails, money vanishes. How do you guarantee both happen or neither does?`,
    options: [
      { id: 'a', text: 'Run both updates and retry the second one if it happens to fail', isCorrect: false },
      { id: 'b', text: 'Add a covering index so both updates run fast enough to not fail', isCorrect: false },
      { id: 'c', text: 'Wrap both updates in a transaction so they commit together or roll back together', isCorrect: true },
      { id: 'd', text: 'Split them into two separate API calls so each update runs fully independently of the other one', isCorrect: false },
    ],
    explanation: `A database transaction groups multiple statements into one all-or-nothing unit. You BEGIN, run the debit and credit, and COMMIT; if anything fails you ROLLBACK and the database undoes every change in the transaction. This is the "A" in ACID — Atomicity. The full set: Atomicity (all or nothing), Consistency (constraints hold before and after), Isolation (concurrent transactions don't see each other's partial work), Durability (committed data survives a crash). Money transfers, order placement, and any multi-step write that must stay consistent belong in a transaction. Indexes and retries don't solve this — only the transaction boundary guarantees the two updates are inseparable.`,
    hints: [
      'You need the two writes to be inseparable — one unit that fully applies or fully undoes',
      'This is the "A" (Atomicity) in ACID',
    ],
    tags: ['transactions', 'acid', 'atomicity', 'database-design'],
    concepts: ['db-transactions'],
  },

  {
    id: 'dp-db-6',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DB_DESIGN,
    course: Course.WEB_DEV,
    question: `Two transactions run concurrently and one reads data the other is midway through changing, producing inconsistent results. This relates to transaction isolation levels. Which statement is correct?`,
    options: [
      { id: 'a', text: 'READ UNCOMMITTED is the safest level because it locks every single row that it reads before others can touch it', isCorrect: false },
      { id: 'b', text: 'Higher levels (toward SERIALIZABLE) prevent dirty/non-repeatable reads and phantoms, but reduce concurrency', isCorrect: true },
      { id: 'c', text: 'All isolation levels behave identically; the setting is purely cosmetic', isCorrect: false },
      { id: 'd', text: 'SERIALIZABLE is the default level in most databases and also the fastest', isCorrect: false },
    ],
    explanation: `Isolation levels trade consistency against concurrency. From weakest to strongest: READ UNCOMMITTED (can see other transactions' uncommitted "dirty" data), READ COMMITTED (the common default in Postgres — only sees committed data, but a re-read can change = non-repeatable read), REPEATABLE READ (same rows read twice are stable, but new matching rows can appear = phantom), and SERIALIZABLE (transactions behave as if run one after another — no anomalies, but the most locking/aborts and lowest throughput). The three classic anomalies are dirty reads, non-repeatable reads, and phantom reads, each prevented at progressively higher levels. You pick the lowest level that is correct for your workload, because stronger isolation costs concurrency.`,
    hints: [
      'Stronger isolation removes more anomalies but allows less concurrency',
      'Recall the three anomalies: dirty read, non-repeatable read, phantom',
    ],
    tags: ['isolation-levels', 'transactions', 'concurrency', 'database-design'],
    concepts: ['db-transactions'],
  },

  {
    id: 'dp-db-7',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DB_DESIGN,
    course: Course.WEB_DEV,
    question: `Multiple users can edit the same record in a long form, but in practice two people editing the same one at the same time is rare. You want to detect the occasional conflict without holding a database lock for the entire editing session. Which approach fits?`,
    options: [
      { id: 'a', text: 'Optimistic locking — keep a version column and reject a save if the version changed since it was read', isCorrect: true },
      { id: 'b', text: 'Pessimistic locking — issue SELECT ... FOR UPDATE to lock the row for the entire editing session duration', isCorrect: false },
      { id: 'c', text: 'Allow only one user to use the application at a time to avoid conflicts', isCorrect: false },
      { id: 'd', text: 'Store every edit blindly and let the last write silently win', isCorrect: false },
    ],
    explanation: `Optimistic locking assumes conflicts are rare, so it takes no lock during editing. Each row carries a version (or updated_at) column; the client reads it with the data, and on save the UPDATE includes "WHERE id = ? AND version = ?" and increments the version. If someone else saved first, the version no longer matches, zero rows update, and you reject with a conflict (e.g. 409) for the user to re-merge. Pessimistic locking (SELECT FOR UPDATE) instead holds a real lock for the whole session — correct when conflicts are FREQUENT and collisions are costly, but it blocks others and risks deadlocks for a long-lived form. Match the strategy to conflict frequency: rare → optimistic, frequent → pessimistic.`,
    hints: [
      'Conflicts are rare, so holding a lock the whole time is wasteful',
      'A version column lets you detect "someone changed this since I read it"',
    ],
    tags: ['optimistic-locking', 'pessimistic-locking', 'concurrency', 'database-design'],
    concepts: ['db-transactions'],
  },

  {
    id: 'dp-db-8',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DB_DESIGN,
    course: Course.WEB_DEV,
    question: `A read-heavy analytics dashboard joins six normalized tables on every page load and has become slow. Writes to those tables are infrequent. You've already indexed the join columns. What is a reasonable next step?`,
    options: [
      { id: 'a', text: 'Always stay strictly in 3NF — denormalization is never acceptable in production', isCorrect: false },
      { id: 'b', text: 'Keep adding more and more indexes until the slow six-way join finally becomes fast enough to satisfy users', isCorrect: false },
      { id: 'c', text: 'Immediately migrate the entire application to a NoSQL database', isCorrect: false },
      { id: 'd', text: 'Selectively denormalize (duplicate or precompute fields) to cut joins, accepting the sync cost on writes', isCorrect: true },
    ],
    explanation: `Normalization optimizes for write integrity (no duplicated data to keep in sync); denormalization optimizes for read speed (fewer joins). When a workload is overwhelmingly reads, infrequent writes, and bottlenecked on multi-table joins, selectively denormalizing is a legitimate, deliberate tradeoff: duplicate a few hot columns, add a precomputed summary/rollup table, or maintain a materialized view. The cost you accept is keeping the duplicated data consistent on every write (via triggers, application code, or scheduled refresh) and the risk of drift. The rule: know the normalization rules first, then break them on purpose for a measured reason — not "indexes forever" (a 6-way join has a floor) and not a wholesale NoSQL rewrite for one slow page.`,
    hints: [
      'Normalization favors writes; what does denormalization favor?',
      'The cost of duplicating data is keeping the copies in sync',
    ],
    tags: ['denormalization', 'normalization', 'read-performance', 'database-design'],
    concepts: ['db-normalization'],
  },

  {
    id: 'dp-db-9',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DB_DESIGN,
    course: Course.WEB_DEV,
    question: `You're choosing a primary datastore for a new product. Which statement about relational (SQL) vs document (NoSQL) databases is accurate?`,
    options: [
      { id: 'a', text: 'NoSQL is always far more scalable than SQL, so it should simply be the default choice for every single new project that you build', isCorrect: false },
      { id: 'b', text: 'Relational databases cannot scale horizontally and are effectively obsolete', isCorrect: false },
      { id: 'c', text: 'Relational suits structured, related data needing joins and ACID; NoSQL suits flexible schemas and denormalized scale', isCorrect: true },
      { id: 'd', text: 'SQL and NoSQL provide identical guarantees and differ only in query syntax', isCorrect: false },
    ],
    explanation: `The choice is about data shape and access patterns, not "newer is better." Relational databases (Postgres, MySQL) excel when data is structured and highly interrelated, you need joins, and you want strong ACID guarantees and constraints — most business apps. Document stores (MongoDB, DynamoDB) excel when the schema is flexible/evolving, data is naturally self-contained (denormalized aggregates read together), and you need to scale writes horizontally across many nodes; the cost is weaker cross-document consistency and manual handling of relationships. Modern relational databases also scale well (read replicas, partitioning, JSONB columns), so "SQL can't scale" is outdated. Pick by workload; many systems use both (polyglot persistence).`,
    hints: [
      'Think about whether your data is highly relational and needs joins/ACID',
      'NoSQL trades cross-record consistency and joins for flexible schemas and scale',
    ],
    tags: ['sql-vs-nosql', 'database-design', 'data-modeling', 'tradeoffs'],
    concepts: ['db-normalization'],
  },

  {
    id: 'dp-db-10',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DB_DESIGN,
    course: Course.WEB_DEV,
    question: `You're choosing a primary-key strategy. The system writes from multiple services/shards, and IDs will appear in public URLs. What's the accurate tradeoff between UUIDs and auto-increment integers?`,
    options: [
      { id: 'a', text: 'Auto-increment integers are always strictly the better choice than UUIDs in every situation because they consume less storage space', isCorrect: false },
      { id: 'b', text: 'UUIDs can be generated anywhere without colliding across shards, but are larger and less index-friendly than sequential ints', isCorrect: true },
      { id: 'c', text: 'UUIDs guarantee that rows are returned in insertion order without an ORDER BY', isCorrect: false },
      { id: 'd', text: 'Auto-increment IDs are safe to expose publicly because they reveal nothing about the data', isCorrect: false },
    ],
    explanation: `Auto-increment (sequential) integer keys are compact and index extremely well (new rows append to the end of the B-tree), but they require a central sequence (awkward across shards/offline clients) and are guessable/enumerable when exposed in URLs (you can probe /users/1, /users/2 and infer how many users exist). UUIDs can be generated independently on any service or client with negligible collision risk — great for distributed systems and merging data — and don't leak counts, but they are larger (16 bytes vs 4-8) and random UUIDv4 values scatter index inserts, hurting write locality. A common compromise is time-ordered IDs (UUIDv7, ULID) that keep global uniqueness while staying roughly sequential for index friendliness.`,
    hints: [
      'Think about generating IDs on many nodes without coordination',
      'Sequential integers in URLs let outsiders enumerate and count your records',
    ],
    tags: ['primary-keys', 'uuid', 'auto-increment', 'database-design', 'sharding'],
    concepts: ['db-indexing'],
  },

  {
    id: 'dp-db-11',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DB_DESIGN,
    course: Course.WEB_DEV,
    question: `A "posts" table needs a way to remove a post from every user-facing view (feed, search, profile) while keeping it available for moderation review and audit history. Which deletion strategy fits, and what does it cost?`,
    options: [
      { id: 'a', text: 'Soft delete: add a deleted_at (nullable timestamp) column, filter WHERE deleted_at IS NULL everywhere, and treat a non-null value as deleted', isCorrect: true },
      { id: 'b', text: 'Hard delete: run DELETE FROM posts WHERE id = ?, since the row is no longer needed once it is hidden from users', isCorrect: false },
      { id: 'c', text: 'Rename the row\'s title to "[deleted]" so it visually looks removed while every column stays queryable as before', isCorrect: false },
      { id: 'd', text: 'Move the row to a separate deleted_posts table with a different schema so the original id can be reused for a new post', isCorrect: false },
    ],
    explanation: `Soft delete (a nullable deleted_at, or a boolean is_deleted) keeps the row physically present but marks it hidden, so moderation and audit tooling can still read it while every normal query adds a deleted_at IS NULL filter (or a default-scoped view/manager does it for you). The cost: every query on that table must remember the filter (easy to forget and leak "deleted" rows back into a feed), indexes should lead with deleted_at to keep the filter cheap, and foreign keys pointing at soft-deleted rows still resolve since the row never left. Hard delete is simpler but destroys the audit trail the requirement explicitly needs. A separate table (option d) works for true archival but complicates foreign keys and id reuse, and is unnecessary machinery when a nullable column does the job.`,
    hints: [
      'The requirement needs the row to still exist somewhere for moderation/audit',
      'A nullable timestamp column can mean both "not deleted" (null) and "deleted at this time"',
    ],
    tags: ['soft-delete', 'hard-delete', 'database-design', 'audit-trail'],
    concepts: ['db-normalization'],
  },
];
