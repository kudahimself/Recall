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
  // PATTERNS_CREATIONAL (9 questions)
  // =====================================================================

  {
    id: 'dp-create-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PATTERNS_CREATIONAL,
    course: Course.WEB_DEV,
    question: `You're building a notification system that sends alerts by email, SMS or push, and the channel is chosen at run time from each user's preferences. Which pattern builds the right sender without an if/else chain at every call site?`,
    options: [
      { id: 'a', text: 'Factory: a createSender(channel) function returns an EmailSender, SmsSender or PushSender, all with the same send() method', isCorrect: true },
      { id: 'b', text: 'Singleton: keep one shared NotificationService instance, so every call site reaches the same sender object', isCorrect: false },
      { id: 'c', text: 'Observer: each sender subscribes to the user\'s preference changes and sends the alert itself when they change', isCorrect: false },
      { id: 'd', text: 'Decorator: wrap one base sender in an email, SMS or push layer that adds that channel\'s delivery on top', isCorrect: false },
    ],
    explanation: `A Factory puts the choice of class in one place. Instead of writing "if (channel === 'email') new EmailSender()" wherever an alert is sent, every caller asks createSender(channel) and gets back an object with the shared send(message) method, so it never names a concrete class. Adding a channel such as Slack changes the factory (often one more row in a lookup table), not every caller. The other patterns answer different questions: a Singleton controls how many instances exist, not which class to build; Observer notifies listeners when something changes; a Decorator adds behaviour around an object with the same interface, it does not choose which class to create.`,
    hints: [
      'The problem is choosing which class to build from a value known only at run time',
      'The caller should not need to know which concrete class it gets back',
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
    question: `Write a DatabasePool class in TypeScript that is a Singleton:
- a private static field that holds the one instance
- a private constructor that takes a connection string, so no other code can call new DatabasePool(...)
- a static getInstance(connectionString: string) that builds the instance on the first call and returns that same instance on every later call
- a query(sql: string): string method that returns "Executing: " followed by the SQL, for example "Executing: SELECT 1"`,
    starterCode: `class DatabasePool {
}
`,
    testCases: [
      { input: 'DatabasePool.getInstance("postgres://localhost/db") twice', expectedOutput: 'the same object both times', description: 'getInstance() builds the pool once and then returns the stored instance' },
      { input: 'new DatabasePool("x") from outside the class', expectedOutput: 'a type error', description: 'The constructor is private' },
      { input: 'pool.query("SELECT 1")', expectedOutput: 'Executing: SELECT 1', description: 'query() returns the SQL with its prefix' },
    ],
    solution: `class DatabasePool {
  private static instance: DatabasePool | undefined;
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
}

# OR

class DatabasePool {
  private static instance?: DatabasePool;

  private constructor(private connectionString: string) {}

  static getInstance(connectionString: string): DatabasePool {
    return (DatabasePool.instance ??= new DatabasePool(connectionString));
  }

  query(sql: string): string {
    return \`Executing: \${sql}\`;
  }
}`,
    tieredHints: {
      apiSignature: 'static getInstance(connectionString: string): DatabasePool',
      skeleton: `class DatabasePool {
  private static ____: DatabasePool | undefined;

  private ____(private connectionString: string) {}

  static getInstance(connectionString: string): DatabasePool {
    if (!DatabasePool.____) {
      DatabasePool.____ = new ____(connectionString);
    }
    return ____;
  }

  query(sql: string): string {
    return ____;
  }
}`,
    },
    explanation: `A Singleton keeps one instance for the whole program. The private constructor means the only way to get a DatabasePool is getInstance(), and getInstance() builds one only while the static field is still empty, so every later call returns the stored object; for a connection pool that stops code from opening a new set of connections each time. The ??= form does the same check in one line: it assigns only when the field is null or undefined. Two catches the rule card names: the connectionString passed to any later getInstance() call is silently ignored, and code that calls getInstance() deep inside its functions hides the dependency and makes the pool hard to replace in tests. That is why apps usually create the pool once at startup and pass it in (dependency injection); frameworks such as NestJS do that for you.`,
    hints: [
      'The constructor must be private so nothing outside the class can call new',
      'A static field stores the one instance',
      'getInstance() checks whether the instance already exists before creating it',
    ],
    tags: ['singleton', 'creational', 'database', 'connection-pool'],
    concepts: ['pattern-creational'],
    requires: [
      /private\s+constructor/,
      /private\s+static\s+\w+|static\s+#\w+/,
      /static\s+getInstance\s*\(/,
      /if\s*\(\s*!\s*(DatabasePool|this)\.#?\w+\s*\)|\?\?=|(===|==)\s*(undefined|null)/,
    ],
  },

  {
    id: 'dp-create-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PATTERNS_CREATIONAL,
    course: Course.WEB_DEV,
    question: `Singleton is one of the best-known design patterns, yet many teams treat it as an anti-pattern. Why?`,
    options: [
      { id: 'a', text: 'The null check in getInstance() runs on every call, which makes a Singleton measurably slow in hot code paths', isCorrect: false },
      { id: 'b', text: 'It is hidden global state: signatures do not show the dependency, tests cannot swap in a fake, and state leaks between tests', isCorrect: true },
      { id: 'c', text: 'The one instance is never garbage collected, so a Singleton leaks memory for as long as the program keeps running', isCorrect: false },
      { id: 'd', text: 'JavaScript modules cannot hold one shared object, so a Singleton class silently builds a new instance per import', isCorrect: false },
    ],
    explanation: `The trouble with a Singleton is how code reaches it. A function that calls DatabasePool.getInstance() deep inside its body has a dependency its signature does not show; a unit test cannot hand it a fake pool; and whatever state the one instance holds carries over from one test to the next, which makes suites flaky. The usual alternative is dependency injection: build the instance once at the edge of the app and pass it in as a parameter or constructor argument. The other options are myths: the instance check is one cheap comparison, one long-lived object is no more a leak than any module-level value, and an ES module is evaluated only once, which is why \`export const pool = new Pool()\` is the everyday JavaScript singleton (with the same testing drawbacks when it is imported deep inside functions).`,
    hints: [
      'Think about writing a unit test for a function that calls getInstance() inside its body',
      'Consider what happens to state the instance holds between one test and the next',
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
    question: `You're building a query builder with optional filters, sorting, paging and field selection, and a query can have dozens of optional parts. Which pattern fits this API?

QueryBuilder.from("users")
  .select(["name", "email"])
  .where("age", ">", 18)
  .orderBy("name", "asc")
  .limit(10)
  .offset(20)
  .build()`,
    options: [
      { id: 'a', text: 'Factory: a createQuery(kind) function that returns a SelectQuery, CountQuery or DeleteQuery object', isCorrect: false },
      { id: 'b', text: 'Prototype: clone a configured base query, then overwrite the fields each call needs on the copy', isCorrect: false },
      { id: 'c', text: 'Builder: each method stores one part and returns this, and build() returns the finished query', isCorrect: true },
      { id: 'd', text: 'Abstract Factory: one factory that returns a matching family of select, where and order objects', isCorrect: false },
    ],
    explanation: `A Builder assembles an object with many optional parts one call at a time. Each method stores its part and returns this, so the calls chain, and build() hands back the finished object. That replaces a constructor with fifteen mostly-undefined arguments with readable, named steps, and lets build() check the parts fit together before anything runs. Knex.js's query builder and the test-data builders used in many test suites work this way. A Factory picks which class to build, Prototype copies an existing object, and an Abstract Factory returns a family of matching objects; none of them is about assembling one object from many optional parts.`,
    hints: [
      'Which pattern is designed for building one complex object step by step?',
      'Look at the method chain: each call adds one piece, and build() comes last',
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
    question: `Design patterns are grouped into three families: creational, structural, and behavioral. What specific concern does the creational family address?`,
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
    question: `You're building a UI toolkit with themes. The Light theme needs a matching LightButton, LightInput and LightModal, and the Dark theme needs DarkButton, DarkInput and DarkModal. A screen must never end up with a LightButton next to a DarkInput. Which pattern fits best?`,
    options: [
      { id: 'a', text: 'Builder: chain method calls to assemble one component step by step before producing it', isCorrect: false },
      { id: 'b', text: 'Factory Method: a single function that returns one component chosen by a type argument', isCorrect: false },
      { id: 'c', text: 'Abstract Factory: one factory object per theme that creates the whole matching family', isCorrect: true },
      { id: 'd', text: 'Prototype: clone a base themed component and tweak its fields for every new variation', isCorrect: false },
    ],
    explanation: `An Abstract Factory is an object with several creation methods (createButton, createInput, createModal), and each concrete factory (LightThemeFactory, DarkThemeFactory) returns components from one family. The screen holds one ThemeFactory and builds everything through it, so the parts always match. A Factory Method returns one product chosen by an argument; nothing stops two separate calls from picking different themes, and that is the key difference. Real-world examples: look-and-feel toolkits and database driver suites (a connection, command and reader for one engine).`,
    hints: [
      'The requirement is a family of objects that must stay consistent together',
      'A factory that builds one product at a time cannot make two products match',
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
    question: `In a game, a fully configured "elite enemy" object has dozens of tuned stats, equipment and AI settings. You need to spawn many near-identical enemies, each differing in one or two fields, and building each from scratch is slow and repeats the configuration. Which pattern is designed for this?`,
    options: [
      { id: 'a', text: 'Prototype: clone the configured instance, then change only the fields that differ', isCorrect: true },
      { id: 'b', text: 'Singleton: keep one shared enemy instance and change its stats before each spawn', isCorrect: false },
      { id: 'c', text: 'Builder: rebuild every enemy field by field through a fluent step-by-step builder', isCorrect: false },
      { id: 'd', text: 'Factory: call a function that builds and returns a brand-new default enemy each time', isCorrect: false },
    ],
    explanation: `Prototype creates objects by copying a configured instance instead of building them from scratch: clone the template, then override the few fields that differ. The catch is shallow versus deep copying. A spread or Object.assign copies only the top level, so nested objects such as the equipment array are shared, and changing one clone's equipment changes them all; structuredClone() copies nested fields too. A Singleton gives every spawn the same object, so changing its stats changes every enemy at once. JavaScript's prototype chain shares the name, but it delegates property lookups to another object rather than copying it.`,
    hints: [
      'You already have a fully configured template; why rebuild instead of copy?',
      'Watch for shallow versus deep copies of nested fields',
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
      { id: 'a', text: 'Keep the Singleton but initialise it lazily and add a reset() hook so tests can clear it between runs', isCorrect: false },
      { id: 'b', text: 'Wrap the Singleton in a Facade so callers reach it through a simpler, more convenient interface layer', isCorrect: false },
      { id: 'c', text: 'Use a Factory so every call site constructs its own fresh pool instance on demand each time it runs', isCorrect: false },
      { id: 'd', text: 'Dependency Injection: pass the pool in as a parameter, so callers and tests choose the implementation', isCorrect: true },
    ],
    explanation: `Dependency Injection (DI) inverts who controls the dependency. Instead of a function reaching out to a global getInstance(), the pool is passed in (as a constructor argument, function parameter, or via a DI container). This makes dependencies explicit in the signature, lets tests inject an in-memory or mock pool trivially, and removes hidden global state that causes flaky tests. It is a direct application of the Dependency Inversion Principle (the "D" in SOLID): high-level code depends on an abstraction (the pool interface), and the concrete implementation is supplied from outside. Frameworks like NestJS, Spring, and Angular build their entire architecture around DI; even "manually" passing a parameter is DI.`,
    hints: [
      'The problem is that the dependency is reached implicitly from inside the code',
      'Think about how you would give a test a different pool without changing the function body',
    ],
    tags: ['dependency-injection', 'creational', 'singleton-alternative', 'solid', 'testing'],
    concepts: ['pattern-creational'],
  },

  // -- Predict: a Singleton keeps its first instance (BEGINNER Predict) --

  {
    id: 'dp-create-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PATTERNS_CREATIONAL,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question:
      'AppConfig is a Singleton. What do the three console.log calls print? Type each printed value on its own line, in order.',
    code: `class AppConfig {
  private static instance: AppConfig | undefined;
  static builds = 0;
  private constructor(public env: string) { AppConfig.builds++; }
  static getInstance(env: string): AppConfig {
    if (!AppConfig.instance) AppConfig.instance = new AppConfig(env);
    return AppConfig.instance;
  }
}

const a = AppConfig.getInstance("dev");
const b = AppConfig.getInstance("prod");
console.log(a === b);
console.log(b.env);
console.log(AppConfig.builds);`,
    expectedOutput: `true
dev
1`,
    explanation:
      'getInstance() builds an AppConfig only when the static instance field is still empty. The first call, with "dev", finds it empty, runs the private constructor once (builds becomes 1) and stores that object. The second call finds the stored object and returns it, so its "prod" argument is never used: a and b are the same object (a === b is true), b.env is still "dev", and builds stays 1. This is the Singleton promise, one instance for the whole program, and also its trap: any argument after the first call is silently ignored, and the stored instance carries state from one caller (or one test) to the next. Passing the config in where it is needed (dependency injection) avoids both.',
    hints: [
      'getInstance() only calls the constructor when instance is still undefined',
      'What happens to the "prod" argument when an instance already exists?',
    ],
    tags: ['singleton', 'creational', 'static', 'predict'],
    concepts: ['pattern-creational'],
  },

  // =====================================================================
  // PATTERNS_STRUCTURAL (10 questions)
  // =====================================================================

  {
    id: 'dp-struct-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PATTERNS_STRUCTURAL,
    course: Course.WEB_DEV,
    question: `Your app uses its own PaymentProcessor interface with charge(amount, currency) and refund(transactionId). You need to use a payment SDK (such as Stripe's) whose methods have different names and shapes: createPaymentIntent(), capturePayment(), createRefund(). You cannot change the SDK. Which pattern do you use?`,
    options: [
      { id: 'a', text: 'Proxy: a StripeProxy with the same methods as the SDK that checks access before passing each call on', isCorrect: false },
      { id: 'b', text: 'Bridge: split PaymentProcessor and the SDK into two hierarchies up front so each can grow on its own', isCorrect: false },
      { id: 'c', text: 'Decorator: wrap your existing processor so it gains the SDK\'s createPaymentIntent() and capturePayment()', isCorrect: false },
      { id: 'd', text: 'Adapter: a StripeAdapter implements PaymentProcessor and turns each of its calls into the SDK\'s methods', isCorrect: true },
    ],
    explanation: `An Adapter offers the interface your code already depends on, on top of one it cannot change. StripeAdapter implements PaymentProcessor, and its charge(amount, currency) calls the SDK's createPaymentIntent and capturePayment, so nothing else in the app knows the SDK's shape, and switching providers means writing a PayPalAdapter. A Proxy keeps the wrapped object's own interface, and a Decorator keeps it too while adding behaviour, so neither solves an interface mismatch. Bridge is a design decision made up front to keep two growing hierarchies apart, not a fix for an SDK you already have.`,
    hints: [
      'You need an existing, incompatible interface to fit the one your code expects',
      'Think of a travel plug adapter: it changes the shape, not what flows through it',
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
    language: CodeLanguage.TYPESCRIPT,
    question: `Write a decorator function logAndTime(name, fn) in TypeScript. It returns a new function with the same arguments and return value as fn which, when called:
1. prints "Calling <name>..." with console.log
2. calls fn with the same arguments
3. prints "Finished <name> in <ms>ms", where <ms> is the elapsed time measured with performance.now(), with one decimal place
4. returns fn's result

The starter gives the signature and the code that uses it; keep both.`,
    starterCode: `function logAndTime<A extends unknown[], R>(
  name: string,
  fn: (...args: A) => R,
): (...args: A) => R {
}

const add = (a: number, b: number) => a + b;
const timedAdd = logAndTime("add", add);
console.log(timedAdd(2, 3));
`,
    testCases: [
      { input: 'timedAdd(2, 3)', expectedOutput: 'Calling add...\nFinished add in <ms>ms\n5', description: 'The wrapper logs before and after, with the elapsed time' },
      { input: 'the value timedAdd returns', expectedOutput: '5', description: 'The wrapper returns fn\'s result' },
      { input: 'logAndTime("add", add)', expectedOutput: '(a: number, b: number) => number', description: 'The wrapper has the same signature as fn' },
    ],
    solution: `function logAndTime<A extends unknown[], R>(
  name: string,
  fn: (...args: A) => R,
): (...args: A) => R {
  return (...args) => {
    console.log(\`Calling \${name}...\`);
    const start = performance.now();
    const result = fn(...args);
    const elapsed = performance.now() - start;
    console.log(\`Finished \${name} in \${elapsed.toFixed(1)}ms\`);
    return result;
  };
}

const add = (a: number, b: number) => a + b;
const timedAdd = logAndTime("add", add);
console.log(timedAdd(2, 3));

# OR

function logAndTime<A extends unknown[], R>(
  name: string,
  fn: (...args: A) => R,
): (...args: A) => R {
  return function (...args: A): R {
    console.log("Calling " + name + "...");
    const start = performance.now();
    const result = fn(...args);
    console.log("Finished " + name + " in " + (performance.now() - start).toFixed(1) + "ms");
    return result;
  };
}

const add = (a: number, b: number) => a + b;
const timedAdd = logAndTime("add", add);
console.log(timedAdd(2, 3));`,
    tieredHints: {
      apiSignature: 'performance.now(): number  (milliseconds, with fractions)',
      skeleton: `  return (...args) => {
    console.log(____);
    const start = performance.now();
    const result = ____(...args);
    const elapsed = ____ - start;
    console.log(____);
    return ____;
  };`,
    },
    explanation: `This is the Decorator pattern from the structural rule card: logAndTime takes a function and returns a function with exactly the same signature, (...args: A) => R, that does extra work before and after calling the one it wraps. Because the shape is the same, a caller cannot tell timedAdd from add, and decorators stack: logAndTime("outer", logAndTime("inner", add)) runs the outer one's first log first and its last log last. The rest parameter collects whatever arguments the wrapper gets and the spread passes them on unchanged, and returning result keeps add's value (a wrapper that forgets to return turns every call into undefined). performance.now() gives milliseconds with fractions, so it can time calls shorter than a millisecond, which Date.now() cannot. Python's @log_and_time line does the same job with functools.wraps, and TypeScript 5's @ decorators apply the idea to class methods.`,
    hints: [
      'The decorator returns a new function; it does not change fn',
      'Collect the arguments with a rest parameter and pass them on with a spread',
      'Return fn\'s result, or every wrapped call will return undefined',
    ],
    tags: [
      'decorator',
      'structural',
      'higher-order-function',
      'typescript',
      'timing',
    ],
    concepts: ['pattern-structural'],
    requires: [
      /performance\.now\(\)/,
      /\bfn\(\s*\.\.\.\w+\s*\)/,
      /Finished[\s\S]*return\s+[A-Za-z_$]|return\s+[A-Za-z_$][\s\S]*finally\s*\{[\s\S]*Finished/,
    ],
  },

  {
    id: 'dp-struct-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PATTERNS_STRUCTURAL,
    course: Course.WEB_DEV,
    question: `Python's @decorator lines, such as @login_required above a Django view or @functools.cache above a function, are a direct use of which design pattern?`,
    options: [
      { id: 'a', text: 'Decorator: it returns a wrapper with the same call signature that adds behaviour before or after the original runs', isCorrect: true },
      { id: 'b', text: 'Observer: the decorator line subscribes the function to an event, and Python calls it whenever that event fires', isCorrect: false },
      { id: 'c', text: 'Strategy: the decorator picks which of several interchangeable versions of the function runs at call time', isCorrect: false },
      { id: 'd', text: 'Adapter: it converts the function into the different interface that the framework\'s request router expects', isCorrect: false },
    ],
    explanation: `A Python decorator is a function that takes a function and returns a new one with the same call signature, which does extra work around the original: @login_required checks the session before the view runs, @functools.cache returns a stored result instead of calling again. That is the Decorator pattern: the same interface, plus behaviour, without changing the wrapped code, and decorators stack. The interface is what rules out Adapter: an adapter offers a different interface from the thing it wraps, while a decorator keeps it. TypeScript 5 has the same @ syntax for decorating class methods, and in JavaScript a higher-order function such as withLogging(fn) is the same idea.`,
    hints: [
      'Compare the wrapped function\'s signature with the signature of what the decorator returns',
      'The original function is not changed; something is added around it',
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
    question: `Every request your app makes to its backend has to: (1) build the URL, (2) attach the auth token, (3) serialise the body, (4) retry on failure, (5) parse the response and (6) log it. Instead of each component doing all of that, you want them to call api.getUsers(). Which pattern is api.getUsers()?`,
    options: [
      { id: 'a', text: 'Adapter: getUsers() offers a different interface from fetch, and any wrapper that changes the interface is an Adapter', isCorrect: false },
      { id: 'b', text: 'Facade: one simple call that runs the URL building, auth, retries, parsing and logging behind the scenes', isCorrect: true },
      { id: 'c', text: 'Proxy: getUsers() stands in for the server with its interface and decides whether each call is let through', isCorrect: false },
      { id: 'd', text: 'Mediator: getUsers() lets the auth, retry and logging objects message each other through one central hub', isCorrect: false },
    ],
    explanation: `A Facade offers one simple call over several subsystems that would otherwise be called in the right order at every call site. api.getUsers() hides URL building, auth headers, serialisation, retries, parsing and logging, so a component only asks for users. Axios is a facade over XMLHttpRequest and fetch, and cloud SDK clients are facades over signed HTTP calls with retries. The difference from an Adapter is not that the interface changes: an Adapter makes one existing object fit an interface your code already depends on, while a Facade invents a new, simpler interface over many parts. A Proxy keeps the same interface as the thing it guards, and a Mediator coordinates peers talking to each other rather than giving outside callers one entry point.`,
    hints: [
      'Which pattern is about putting one simple entry point in front of a complicated system?',
      'Think of a front desk that handles all the coordination behind the scenes',
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
    question: `A photo gallery shows hundreds of high-resolution images, and loading every full image up front is slow. You want each image to load only when it is first rendered, and to be cached once loaded, without changing the gallery code, which just calls image.render(). Which pattern fits?`,
    options: [
      { id: 'a', text: 'Adapter: convert the image loader\'s incompatible API into the exact interface the gallery expects', isCorrect: false },
      { id: 'b', text: 'Proxy: a stand-in with the same interface that controls access, adding lazy loading and caching', isCorrect: true },
      { id: 'c', text: 'Decorator: wrap each image so that every render() also draws an extra frame or caption around it', isCorrect: false },
      { id: 'd', text: 'Facade: expose one simplified API over the whole image subsystem for the gallery to call instead', isCorrect: false },
    ],
    explanation: `A Proxy stands in front of a real object with the same interface, so callers cannot tell the difference, and it decides when and whether the real object is touched. Here a virtual proxy loads the full image on the first render() and keeps it for later calls. Other kinds: a protection proxy checks permissions, a remote proxy stands in for an object on another machine, and a caching proxy stores results. JavaScript's built-in Proxy object intercepts property access through traps (get, set). Proxy and Decorator both keep the interface; the difference is intent: a Decorator adds behaviour to every call, while a Proxy controls access to the real object.`,
    hints: [
      'The gallery must not know whether it is talking to the real image or a stand-in',
      'The intent is to control access (defer, cache, guard), not to add new features',
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
    question: `You're modelling a file system where a folder can contain files and other folders, nested to any depth. You want to call totalSize() on any node, a single file or a whole folder tree, and get a number, without the caller checking whether it is a file or a folder. Which pattern fits?`,
    options: [
      { id: 'a', text: 'Iterator: expose one uniform way to walk the tree node by node without revealing its structure', isCorrect: false },
      { id: 'b', text: 'Builder: assemble the nested tree of files and folders one step at a time, then build() it', isCorrect: false },
      { id: 'c', text: 'Composite: give files and folders one shared interface so both can be treated the same way', isCorrect: true },
      { id: 'd', text: 'Decorator: wrap each file in a folder object that adds child-handling behaviour on top of it', isCorrect: false },
    ],
    explanation: `Composite lets one object (a leaf) and a group of objects (a container) share one interface. File and Folder both implement totalSize(): a File returns its own size, and a Folder sums totalSize() over its children, which may be files or more folders. The recursion lives inside the container, so the caller never branches on the type. It fits any part-whole hierarchy: file systems, the DOM, React component trees, nested menus and threaded comments. An Iterator would let you visit every node, but the caller would still have to add up the sizes and tell files from folders.`,
    hints: [
      'The caller should treat one item and a group of items in exactly the same way',
      'Think of part-whole hierarchies where containers hold more containers',
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
    question: `A notification system has two dimensions that each keep growing: message kind (Alert, Reminder, Digest) and delivery channel (Email, SMS, Push). A subclass for every combination (AlertEmail, AlertSms, ReminderPush and so on) multiplies with each new kind or channel. You want each dimension to vary on its own. Which pattern is built for this?`,
    options: [
      { id: 'a', text: 'Bridge: split the two axes into separate hierarchies and combine them, so each varies on its own', isCorrect: true },
      { id: 'b', text: 'Adapter: wrap each channel after the fact so it conforms to your existing message interface', isCorrect: false },
      { id: 'c', text: 'Strategy: swap the delivery algorithm at run time inside one combined message class per kind', isCorrect: false },
      { id: 'd', text: 'Facade: hide the channels and message kinds behind one simplified send() method for callers', isCorrect: false },
    ],
    explanation: `Bridge separates an abstraction (Message, with Alert, Reminder and Digest) from its implementation (Channel, with Email, SMS and Push), so the two hierarchies grow independently. A Message holds a Channel and delegates delivery to it, which turns N x M subclasses into N + M classes combined at run time: new Alert(new SmsChannel()). The contrast with Adapter is timing and intent: Bridge is a design decision to keep two axes apart from the start, while an Adapter is a retrofit that makes an existing, incompatible interface fit. The delegation to Channel looks like Strategy, but Bridge is about structuring both hierarchies, not about swapping one algorithm.`,
    hints: [
      'The smell is an N x M subclass explosion across two independent axes',
      'Bridge is planned up front; Adapter is a fix applied after the fact',
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
    question: `A map view renders 100,000 markers. Markers share a small set of icons and styles (intrinsic, shared state), but each has its own latitude and longitude (extrinsic, per-instance state). Giving every marker its own copy of the icon and style uses far too much memory. Which pattern addresses this?`,
    options: [
      { id: 'a', text: 'Singleton: keep one global marker object and reuse that same instance for every position drawn', isCorrect: false },
      { id: 'b', text: 'Prototype: clone a fully configured base marker, icon and style included, for each position', isCorrect: false },
      { id: 'c', text: 'Composite: group the markers into a tree of clusters so there are fewer top-level objects', isCorrect: false },
      { id: 'd', text: 'Flyweight: share the intrinsic icon and style, and pass each marker\'s position in per call', isCorrect: true },
    ],
    explanation: `Flyweight saves memory by sharing the state that many objects have in common (intrinsic) and keeping the state that differs (extrinsic) outside them. One MarkerType object holds an icon and style and is shared by every marker of that type, while the positions live in a plain array and are passed to render(position) at draw time. A factory hands out the shared MarkerType instances, so 100,000 markers cost a handful of MarkerType objects plus the positions. Text editors share glyph objects this way, and game engines share meshes and textures. A Singleton cannot represent many positions, and cloning a prototype copies the icon and style into every marker, which is the memory problem itself.`,
    hints: [
      'Separate the state that is identical across markers from the state that differs',
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
    question: `Checkout calls three subsystems in a fixed order: charge the payment gateway, decrement inventory, then queue a shipping confirmation email. Every call site repeats those three steps. You want one method, checkout.complete(order), that hides the sequence behind a single call. Which pattern is this?`,
    options: [
      { id: 'a', text: 'Facade: one simple method that calls the payment, inventory and shipping subsystems in order', isCorrect: true },
      { id: 'b', text: 'Adapter: convert one subsystem\'s interface into the shape that another subsystem expects', isCorrect: false },
      { id: 'c', text: 'Proxy: stand in front of the payment gateway with its interface and control access to it', isCorrect: false },
      { id: 'd', text: 'Mediator: the subsystems stop calling each other and send every message through one hub', isCorrect: false },
    ],
    explanation: `A Facade offers one simple entry point over several subsystems without changing their own interfaces. checkout.complete(order) runs the payment, inventory and shipping calls in the right order, so call sites stop repeating the sequence and cannot get it wrong. An Adapter fixes an interface mismatch between two things, a Proxy controls access to one object through that object's own interface, and a Mediator sits between peer objects that would otherwise talk to each other, rather than simplifying a call for outside callers.`,
    hints: [
      'One simple method standing in front of several subsystems',
      'The subsystems are not being converted or guarded one by one, just put behind one entry point',
    ],
    tags: ['facade', 'structural', 'subsystem', 'simplification'],
    concepts: ['pattern-structural'],
  },

  // -- Predict: the order of stacked decorators (INTERMEDIATE Predict) --

  {
    id: 'dp-struct-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PATTERNS_STRUCTURAL,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question:
      'logged() is a decorator: it takes a function and returns a wrapped function with the same signature. price wraps addTax twice. What does price(10) print? Type each printed line exactly, one per line, in order.',
    code: `type PriceFn = (n: number) => number;

const logged = (label: string, fn: PriceFn): PriceFn => (n) => {
  console.log(label + " in " + n);
  const out = fn(n);
  console.log(label + " out " + out);
  return out;
};

const addTax: PriceFn = (n) => n + 2;
const price = logged("outer", logged("inner", addTax));
console.log(price(10));`,
    expectedOutput: `outer in 10
inner in 10
inner out 12
outer out 12
12`,
    explanation:
      'Each call to logged() returns a new function that does its own work before and after calling the function it wraps, and has the same (n: number) => number shape, so a wrapper can wrap another wrapper. price is the outer wrapper around the inner wrapper around addTax. Calling price(10) enters the outer layer first ("outer in 10"), which calls the inner layer ("inner in 10"), which calls addTax and gets 12 ("inner out 12"). Control then unwinds outward ("outer out 12"), and the last line logs the returned 12. Stacked decorators run like nested function calls: the outermost runs its "before" code first and its "after" code last. The same holds for stacked @decorator lines in Python, where the one written on top is the outermost.',
    hints: [
      'logged("inner", addTax) is itself a PriceFn, so it can be wrapped again',
      'The outer wrapper prints its first line before calling the inner one, and its second line after the inner one returns',
    ],
    tags: ['decorator', 'structural', 'higher-order-function', 'predict'],
    concepts: ['pattern-structural'],
  },

  // =====================================================================
  // PATTERNS_BEHAVIORAL (9 questions)
  // =====================================================================

  {
    id: 'dp-behav-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PATTERNS_BEHAVIORAL,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: `Write an EventEmitter class in TypeScript with three methods:
- on(event: string, listener: Listener) registers a listener for an event; an event can have many listeners
- off(event: string, listener: Listener) removes that exact listener, so it is not called again
- emit(event: string, ...args: unknown[]) calls every listener registered for the event, in the order they were added, with those arguments; emitting an event that has no listeners does nothing

The starter defines the Listener type.`,
    starterCode: `type Listener = (...args: unknown[]) => void;

class EventEmitter {
}
`,
    testCases: [
      { input: 'on("sale", a); on("sale", b); emit("sale", 5)', expectedOutput: 'a(5), then b(5)', description: 'emit calls every listener for the event, in order, with the arguments' },
      { input: 'off("sale", a); emit("sale", 6)', expectedOutput: 'only b(6)', description: 'off removes that exact listener' },
      { input: 'emit("nothing")', expectedOutput: 'no error', description: 'Emitting an event with no listeners does nothing' },
    ],
    solution: `type Listener = (...args: unknown[]) => void;

class EventEmitter {
  private listeners = new Map<string, Set<Listener>>();

  on(event: string, listener: Listener): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(listener);
  }

  off(event: string, listener: Listener): void {
    this.listeners.get(event)?.delete(listener);
  }

  emit(event: string, ...args: unknown[]): void {
    this.listeners.get(event)?.forEach((listener) => listener(...args));
  }
}

# OR

type Listener = (...args: unknown[]) => void;

class EventEmitter {
  private listeners: Record<string, Listener[]> = {};

  on(event: string, listener: Listener): void {
    (this.listeners[event] ??= []).push(listener);
  }

  off(event: string, listener: Listener): void {
    this.listeners[event] = (this.listeners[event] ?? []).filter((l) => l !== listener);
  }

  emit(event: string, ...args: unknown[]): void {
    for (const listener of this.listeners[event] ?? []) {
      listener(...args);
    }
  }
}`,
    tieredHints: {
      apiSignature: 'Map<string, Set<Listener>>: get(key), set(key, value); Set: add(x), delete(x), forEach(fn)',
      skeleton: `class EventEmitter {
  private listeners = new Map<string, Set<Listener>>();

  on(event: string, listener: Listener): void {
    if (!this.listeners.has(event)) {
      this.listeners.____(event, new Set());
    }
    this.listeners.get(event)!.____(listener);
  }

  off(event: string, listener: Listener): void {
    this.listeners.get(event)?.____(listener);
  }

  emit(event: string, ...args: unknown[]): void {
    this.listeners.get(event)?.forEach((listener) => ____);
  }
}`,
    },
    explanation: `This is the Observer pattern (also called pub/sub): the emitter keeps a list of listeners per event and calls each one when the event fires, without knowing what any of them does. A Map from event name to a Set of listeners keeps the order they were added and makes off() a single delete; an object of arrays with filter() works the same way. off() can only remove a listener by the same function reference that was passed to on(), which is the rule card's pitfall: off("sale", () => show()) with a fresh arrow removes nothing, so keep a reference to the function you registered (or have on() return an unsubscribe function, as the counter in the predict question does). The optional chaining in emit() is what lets an event with no listeners do nothing. Node's EventEmitter, the DOM's addEventListener and Redux's store.subscribe() all work this way.`,
    hints: [
      'Store a collection of listeners for each event name',
      'off needs to find and remove that exact function reference',
      'emit calls each stored listener with the arguments it received',
    ],
    tags: ['observer', 'eventemitter', 'behavioral', 'pub-sub'],
    concepts: ['pattern-behavioral'],
    requires: [
      /\bon\s*\(/,
      /\boff\s*\(/,
      /\bemit\s*\(/,
      /\.delete\(\s*(?!event\b)\w+\s*\)|\.filter\s*\(|\.splice\s*\(/,
      /\(\s*\.\.\.args\s*\)|\.apply\(\s*[\w$]+\s*,\s*args\s*\)|\.call\(\s*[\w$]+\s*,\s*\.\.\.args\s*\)/,
    ],
  },

  {
    id: 'dp-behav-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PATTERNS_BEHAVIORAL,
    course: Course.WEB_DEV,
    question: `Calling the setter from React's useState hook re-renders the component when the new value differs from the old one. Which design pattern does this most closely resemble?`,
    options: [
      { id: 'a', text: 'Strategy: React swaps in a different rendering algorithm depending on which state value changed', isCorrect: false },
      { id: 'b', text: 'Command: each setState call is kept as an undoable action object that React can replay later', isCorrect: false },
      { id: 'c', text: 'Observer: calling the setter notifies React, which re-renders the components that depend on that state', isCorrect: true },
      { id: 'd', text: 'Memento: React saves a snapshot of every past state so the component can be restored on undo', isCorrect: false },
    ],
    explanation: `This is the Observer idea: a subject notifies whoever depends on it when it changes, without them polling. Calling the setter tells React the state changed, and React schedules a re-render of the component that owns it (and its children); if the new value is the same as the old one by Object.is, React skips the re-render. The same idea runs through Context (every consumer re-renders when the value changes), useSyncExternalStore, Redux's store.subscribe() and addEventListener. React keeps update objects in a queue only until the next render, never as an undo history, so Command and Memento do not describe it.`,
    hints: [
      'What happens after you call the setter: does the component check for changes, or is it told?',
      'The component does not poll for changes; it is notified',
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
    question: `Your shop supports several payment methods (card, PayPal, crypto, bank transfer), and each has completely different processing logic. You want the processor to use whichever method the user picked, chosen at run time, without a giant switch statement. Which pattern fits?`,
    options: [
      { id: 'a', text: 'Factory: choosing a class at run time is the whole job, so a createProcessor(method) function is the pattern', isCorrect: false },
      { id: 'b', text: 'Template Method: a PaymentProcessor base class, with every method subclass overriding all of its steps', isCorrect: false },
      { id: 'c', text: 'State: the processor moves itself between card, PayPal, crypto and bank states as the payment goes on', isCorrect: false },
      { id: 'd', text: 'Strategy: one process() interface, a class per method, and the chosen one handed to the processor', isCorrect: true },
    ],
    explanation: `Strategy puts interchangeable algorithms behind one signature and lets the caller choose one at run time. The processor only calls strategy.process(order); switching from card to crypto means passing a different strategy object, not editing the processor. Array.prototype.sort taking a comparator is the everyday example, and passport.js strategies are another. A factory often builds the chosen strategy, but creating the object is not what makes the behaviour swappable; that is the Strategy. State looks the same in code, but there the object switches its own state as actions arrive, while here the user picks once. A Template Method whose subclasses override every step has no shared skeleton left.`,
    hints: [
      'Which pattern makes algorithms interchangeable behind one interface?',
      'Who chooses which algorithm runs: the caller, or the object itself?',
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
    question: `You're building a text editor with undo and redo and a macro recorder that replays a sequence of actions. Each action (type text, delete, make bold, change font) must be stored so it can be run, undone and replayed. Which pattern is designed for this?`,
    options: [
      { id: 'a', text: 'Command: each action is an object with execute() and undo(), kept on a history stack and in a macro list', isCorrect: true },
      { id: 'b', text: 'Memento: store a full snapshot of the document after every action and replay the snapshots as a macro', isCorrect: false },
      { id: 'c', text: 'Observer: the editor emits an event for each action so that listeners can react to it as it happens', isCorrect: false },
      { id: 'd', text: 'Strategy: each kind of edit is a strategy object that the editor swaps in before the next keystroke', isCorrect: false },
    ],
    explanation: `The Command pattern turns each action into an object. A TypeCommand, DeleteCommand or BoldCommand knows how to execute() itself and how to undo() it. Executed commands go on a history stack: undo pops one and calls undo(), and redo runs it again; a macro is a list of commands executed in order, which works on any document. Redux actions (plain objects describing a change) and jobs in a task queue are the same idea. Memento snapshots can restore an earlier state for undo, but replaying snapshots only copies old documents back; it cannot repeat the actions on new text. Strategy swaps an algorithm; Command packages a request so it can be queued, logged, replayed or undone.`,
    hints: [
      'Which pattern turns a request or action into a standalone object?',
      'What would an undo stack need to hold so each entry knows how to reverse itself?',
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
    question: `An incoming HTTP request passes through authentication, then logging, then rate limiting, before it reaches the route handler. Each step can either answer the request itself and stop, or pass it on to the next step, which is how Express middleware works with next(). Which pattern describes this?`,
    options: [
      { id: 'a', text: 'Decorator: wrap the route handler in each concern so it gains auth, logging and limiting behaviour', isCorrect: false },
      { id: 'b', text: 'Observer: each middleware subscribes to a request event, and all of them run whenever it fires', isCorrect: false },
      { id: 'c', text: 'Chain of Responsibility: pass the request along a chain where each link handles it or forwards it', isCorrect: true },
      { id: 'd', text: 'Strategy: swap in a different request-handling algorithm at run time for each incoming request', isCorrect: false },
    ],
    explanation: `Chain of Responsibility passes a request along a series of handlers, each of which either handles it (and may stop the chain) or forwards it. Express's next(), Django middleware and ASP.NET's request pipeline work this way, and so do DOM event bubbling and approval workflows that escalate to the next approver. The key trait is that any link can end the request, as the auth step does with a 401. Stacked decorators look similar, but a decorator always calls the object it wraps; and observers all run on every event rather than one after another with the option to stop.`,
    hints: [
      'Each step can either deal with the request or hand it onward',
      'Think about what an Express middleware does when it does not call next()',
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
    question: `An order moves Pending, then Paid, then Shipped, then Delivered, and can be Cancelled from some of those states. The allowed actions depend on the state (you cannot ship an unpaid order), and the rules have become if/else checks on a status string scattered across many methods. Which pattern cleans this up?`,
    options: [
      { id: 'a', text: 'State: make each state an object that defines its own allowed actions and next states', isCorrect: true },
      { id: 'b', text: 'Strategy: let the caller pick a processing algorithm and inject it into the order object', isCorrect: false },
      { id: 'c', text: 'Command: store each transition as an undoable action object kept in a history stack', isCorrect: false },
      { id: 'd', text: 'Observer: notify subscribers whenever the order\'s status string changes to a new value', isCorrect: false },
    ],
    explanation: `The State pattern lets an object change its behaviour when its internal state changes. Each state (PendingState, PaidState, ShippedState) implements the same interface (pay(), ship(), cancel()); the order delegates to its current state object, which performs the action and returns the next state. An action that is not allowed in a state is simply not implemented there (or throws), so the rules for each state live in one place instead of in scattered if/else chains. State is built like Strategy, both delegating to a swappable object, but in Strategy the caller picks the algorithm, while in State the object moves itself from state to state as actions arrive.`,
    hints: [
      'The behaviour depends entirely on which state the order is currently in',
      'Compare with Strategy: who switches the object, the caller or the object itself?',
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
    question: `You're writing importers for CSV, JSON and XML files. All three run the same fixed steps: open the file, parse it, validate the rows, then save them. Only the parse step differs. The team wants a base Importer class that runs the steps in order, with CsvImporter, JsonImporter and XmlImporter subclasses that each override only parse(). Which pattern is that?`,
    options: [
      { id: 'a', text: 'Strategy: each format\'s parser is a separate object that the caller picks and passes to one Importer', isCorrect: false },
      { id: 'b', text: 'Template Method: the base class fixes the order of the steps, and subclasses override only parse()', isCorrect: true },
      { id: 'c', text: 'Decorator: each subclass wraps the base importer and adds its own parsing before the shared steps', isCorrect: false },
      { id: 'd', text: 'Chain of Responsibility: the parsers are linked, and each passes the file on if it cannot read it', isCorrect: false },
    ],
    explanation: `Template Method puts the skeleton of an algorithm in a base-class method (importFile(): open, parse, validate, save) and leaves some steps to subclasses to override (parse()). The order lives in one place and cannot be changed by a subclass, which only supplies the step that differs. Its close cousin Strategy reaches a similar result by composition: one Importer is given a parser object, which is the better choice when the parser must be swapped at run time or when the subclasses would pile up. The design described here uses subclasses that override a step, so it is Template Method.`,
    hints: [
      'The sequence of steps is fixed; only one step changes per format',
      'Contrast inheritance (override a step) with composition (pass a parser object in)',
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
    question: `You've built a paginated collection that fetches its data in batches behind the scenes. You want callers to loop over every item with a plain for...of loop in JavaScript (or for...in in Python), without knowing about the batches. Which pattern provides this?`,
    options: [
      { id: 'a', text: 'Observer: push each item to the caller as soon as it arrives, notifying subscribers as data streams in', isCorrect: false },
      { id: 'b', text: 'Composite: represent the collection as a tree of batch nodes that each hold some of the items', isCorrect: false },
      { id: 'c', text: 'Command: wrap each element access in an action object that the caller runs to fetch the item', isCorrect: false },
      { id: 'd', text: 'Iterator: expose a standard way to step through the items in order, hiding how they are stored', isCorrect: true },
    ],
    explanation: `The Iterator pattern gives sequential access to a collection's items without exposing how they are stored. Both languages build it into the loop syntax: in JavaScript an object is iterable when it has a [Symbol.iterator]() method returning an object with next(), and a generator function (function*) produces such an iterator for you (for await...of and an async generator do the same when each batch is fetched over the network); in Python you implement __iter__ and __next__, or write a generator with yield. The collection can fetch the next batch inside next(), so the caller's plain loop walks every item across batch boundaries. Observer pushes items to subscribers; Iterator lets the caller pull them one at a time.`,
    hints: [
      'You want callers to use an ordinary for loop over a custom collection',
      'Think Symbol.iterator and generators (JS) or __iter__ and yield (Python)',
    ],
    tags: ['iterator', 'behavioral', 'generators', 'traversal'],
    concepts: ['pattern-behavioral'],
  },

  // -- Predict: subscribe and unsubscribe an observer (BEGINNER Predict) --

  {
    id: 'dp-behav-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PATTERNS_BEHAVIORAL,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question:
      'createCounter() is a small observable store: subscribe() registers a listener and returns a function that removes it. What does this code print? Type each printed line exactly, one per line, in order.',
    code: `function createCounter() {
  let count = 0;
  const listeners = new Set<(n: number) => void>();
  return {
    subscribe(fn: (n: number) => void) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    increment() {
      count++;
      listeners.forEach((fn) => fn(count));
    },
  };
}

const counter = createCounter();
const stopA = counter.subscribe((n) => console.log("A sees " + n));
counter.subscribe((n) => console.log("B sees " + n));
counter.increment();
stopA();
counter.increment();`,
    expectedOutput: `A sees 1
B sees 1
B sees 2`,
    explanation:
      'This is the Observer pattern: the counter (the subject) keeps a set of listeners and calls every one of them when its state changes, without knowing what they do. The first increment() sets count to 1 and notifies both listeners in the order they subscribed, so A and then B print 1. subscribe() returned a function that deletes that exact listener from the set, and stopA() calls it, so the second increment() reaches only B, which prints 2. Removing a listener needs the same function reference that was added, which is why subscribe() hands back an unsubscribe function rather than asking the caller to pass the listener again. React\'s useSyncExternalStore, Redux\'s store.subscribe() and addEventListener / removeEventListener work this way.',
    hints: [
      'increment() calls every listener still in the set, in the order they were added',
      'stopA() deletes listener A from the set before the second increment()',
    ],
    tags: ['observer', 'behavioral', 'subscribe', 'predict'],
    concepts: ['pattern-behavioral'],
  },

  // =====================================================================
  // PATTERNS_ARCHITECTURAL (10 questions)
  // =====================================================================

  {
    id: 'dp-arch-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PATTERNS_ARCHITECTURAL,
    course: Course.WEB_DEV,
    question: `Django splits a page into a Model, a View that holds the logic and a Template that renders it (MVT, its name for MVC). Angular binds a template to a component class's state, close to MVVM. React keeps a component's state, logic and markup together. Which statement about splitting code by layer versus keeping it together by component is accurate?`,
    options: [
      { id: 'a', text: 'Splitting by layer is always better, because separating models, views and controllers is what separation of concerns means', isCorrect: false },
      { id: 'b', text: 'Layers make one model easy to share across many views; components keep each piece self-contained but can repeat shared logic', isCorrect: true },
      { id: 'c', text: 'Keeping code together by component is always better, because then a project no longer needs any separate layers at all', isCorrect: false },
      { id: 'd', text: 'They are one pattern under two names: in React, useState is the Model and the JSX a component returns is the Controller', isCorrect: false },
    ],
    explanation: `There is no universally best split; each one makes a different change easy. Splitting by layer (MVC, MVT, MVVM) gives one model that many views share, which suits server-rendered pages and large teams that own a layer each; the cost is that one feature is spread across several folders. Keeping code together by component puts a button's state, logic and markup in one place, which suits interactive UIs, at the cost of repeating logic that several components need unless it is pulled out into hooks or services. Real apps mix both: a React or Next.js front end built from components, with the data access and business rules still in their own layers behind it. In React the JSX is the view, not the controller.`,
    hints: [
      'Consider the trade-off each choice makes, not which one is best',
      'Ask which change each approach makes easy: changing a shared model, or changing one feature',
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
    question: `In Clean Architecture (also called Hexagonal, or Ports & Adapters), the rule is that dependencies point inward: the business rules sit at the centre and depend on no framework, database or UI. What does this mean in practice?`,
    options: [
      { id: 'a', text: 'The core holds only plain data types, and every business rule moves into the controllers that receive requests', isCorrect: false },
      { id: 'b', text: 'The database schema defines the business rules, since every rule ends up enforced by a constraint anyway', isCorrect: false },
      { id: 'c', text: 'The rules import no framework or ORM; they define the interfaces they need, and outer adapters implement them', isCorrect: true },
      { id: 'd', text: 'The core may import the ORM directly, as long as the controllers and the UI never call the database themselves', isCorrect: false },
    ],
    explanation: `Clean Architecture protects the code that changes least, the business rules, from the code that changes most, frameworks and databases. A rule such as "an order total includes tax" is a plain function or class with no import from Next.js, Express, Prisma or any framework. When it needs data, it declares an interface (a port), such as an OrderRepo with find and save, and an outer adapter, a PrismaOrderRepo or an in-memory fake for tests, implements it and is passed in. So the rule can run in a test with no database, and replacing the ORM means writing one new adapter. A core that imports the ORM is the plain layered style, which this rule exists to improve on. This is the Dependency Inversion Principle (the D in SOLID) applied to a whole app.`,
    hints: [
      'Ask whether your business logic imports any framework or ORM code',
      'Who defines the repository interface: the core, or the database layer?',
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
    question: `A startup is building its first product, an online shop with a catalogue, cart, checkout and user accounts. The team has 4 developers. A senior engineer proposes starting with microservices: separate services for users, products, orders, payments and notifications. What is the best advice?`,
    options: [
      { id: 'a', text: 'Start with microservices, since splitting a system later is far harder than starting split, whatever the team size', isCorrect: false },
      { id: 'b', text: 'Use one serverless function per endpoint, which gives microservice isolation without any of its operational cost', isCorrect: false },
      { id: 'c', text: 'Build a quick monolith with no module boundaries, and plan a full rewrite as microservices in about six months', isCorrect: false },
      { id: 'd', text: 'Start with a modular monolith with clear module boundaries, and extract a service only when a real need appears', isCorrect: true },
    ],
    explanation: `"Monolith first" is the common advice (Martin Fowler, Sam Newman) because microservices solve scaling and team-ownership problems that a 4-person startup does not have yet, and they bring costs it cannot carry: network failures between services, data consistency without one database transaction, a deploy pipeline and monitoring per service, and distributed tracing to debug anything. A monolith gives one deploy, easy debugging and ACID transactions. The key is clear module boundaries (catalogue, orders, users as separate modules that talk through their public functions) so that one can be extracted when a real reason appears, such as a part that must scale or deploy on its own. Serverless functions still bring the distributed-system costs, and a planned rewrite throws away the module boundaries that make extraction cheap.`,
    hints: [
      'Consider the team size and the complexity that microservices introduce',
      'What problems do microservices solve? Does a 4-person startup have them?',
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
    question: `Your signup endpoint does five things in a row: (1) create the user, (2) send a welcome email, (3) create a Stripe customer, (4) add the user to a CRM and (5) post a Slack message to the sales team. It takes 8 seconds, and if Slack is down, signup fails. Which architectural pattern decouples these steps?`,
    options: [
      { id: 'a', text: 'Event-driven: save the user and publish user.created to a queue; separate consumers handle the other four', isCorrect: true },
      { id: 'b', text: 'Microservices: move each of the five steps into its own service, which the signup handler calls in turn', isCorrect: false },
      { id: 'c', text: 'CQRS: split signup into a write model and a read model, so the four follow-up writes run on the read side', isCorrect: false },
      { id: 'd', text: 'Serverless: run the signup handler as a cloud function, which scales out so the five steps finish faster', isCorrect: false },
    ],
    explanation: `In an event-driven design the signup handler does only its own job, creating the user, and then publishes a user.created event to a message queue (RabbitMQ, SQS, Kafka, BullMQ). The email, Stripe, CRM and Slack steps are separate consumers of that event. Signup answers quickly, a Slack outage no longer fails it (the message waits in the queue and is retried), and adding a step such as analytics means adding a consumer, not editing signup. Publishing must happen only once the user row is committed; the outbox pattern (write the event in the same transaction, send it afterwards) guarantees that. Splitting into services that are still called one after another keeps the 8 seconds and the coupling; a faster runtime does too.`,
    hints: [
      'The problem is five independent steps coupled into one synchronous call',
      'What if signup just announced "a user was created" and let others react?',
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
    language: CodeLanguage.TYPESCRIPT,
    question: `Write the Repository pattern for users in TypeScript.
1. An interface UserRepo with findById(id: string): User | undefined, findAll(): User[], save(user: User): void and remove(id: string): void.
2. A class InMemoryUserRepo that implements UserRepo and keeps the users in a Map keyed by id. save() adds a user, or replaces the stored user with the same id.

Business code that takes a UserRepo can then run against this class in tests and against a Prisma-backed class in production. The starter defines User.`,
    starterCode: `type User = { id: string; displayName: string };
`,
    testCases: [
      { input: 'repo.save(ada); repo.findById(ada.id)', expectedOutput: 'ada', description: 'save stores a user that findById returns' },
      { input: 'repo.save({ ...ada, displayName: "Ada L" }); repo.findAll()', expectedOutput: 'one user, named Ada L', description: 'save replaces the user with the same id' },
      { input: 'repo.remove(ada.id); repo.findById(ada.id)', expectedOutput: 'undefined', description: 'remove deletes the user' },
    ],
    solution: `type User = { id: string; displayName: string };

interface UserRepo {
  findById(id: string): User | undefined;
  findAll(): User[];
  save(user: User): void;
  remove(id: string): void;
}

class InMemoryUserRepo implements UserRepo {
  private users = new Map<string, User>();

  findById(id: string): User | undefined {
    return this.users.get(id);
  }

  findAll(): User[] {
    return [...this.users.values()];
  }

  save(user: User): void {
    this.users.set(user.id, user);
  }

  remove(id: string): void {
    this.users.delete(id);
  }
}

# OR

type User = { id: string; displayName: string };

interface UserRepo {
  findById(id: string): User | undefined;
  findAll(): User[];
  save(user: User): void;
  remove(id: string): void;
}

class InMemoryUserRepo implements UserRepo {
  private users = new Map<string, User>();

  findById(id: string) {
    return this.users.get(id);
  }

  findAll() {
    return Array.from(this.users.values());
  }

  save(user: User) {
    this.users.set(user.id, user);
  }

  remove(id: string) {
    this.users.delete(id);
  }
}`,
    tieredHints: {
      apiSignature: 'Map<K, V>: get(key), set(key, value), delete(key), values()',
      skeleton: `interface UserRepo {
  findById(id: string): ____;
  findAll(): ____;
  save(user: User): void;
  remove(id: string): void;
}

class InMemoryUserRepo ____ UserRepo {
  private users = new Map<____, ____>();

  findById(id: string) {
    return this.users.____(id);
  }

  findAll() {
    return [...this.users.____()];
  }

  save(user: User) {
    this.users.____(____, user);
  }

  remove(id: string) {
    this.users.____(id);
  }
}`,
    },
    explanation: `The Repository pattern puts data access behind an interface that the business code owns. Code that takes a UserRepo never learns where users live, so a test passes an InMemoryUserRepo and production passes a class whose methods call prisma.user.findUnique and friends, and swapping storage means writing one new class. That is the Clean Architecture rule from this topic's rule card: the core defines the port (UserRepo), and adapters at the edge implement it. implements UserRepo makes TypeScript check that the class has every method with the right types, and a Map keyed by id gives replace-on-save for free, because set() with an existing key overwrites it. findAll() copies the values into a new array so callers cannot change the repository's own storage.`,
    hints: [
      'Declare the interface first, then a class that implements it',
      'A Map keyed by user id stores the users',
      'Map.set with an existing key replaces the stored value',
    ],
    tags: [
      'repository',
      'architectural',
      'abstraction',
      'clean-architecture',
      'typescript',
    ],
    concepts: ['pattern-architectural'],
    requires: [
      /interface\s+UserRepo\b/,
      /implements\s+UserRepo\b/,
      /new\s+Map\b/,
      /\.set\(\s*user\.id\s*,/,
    ],
  },

  {
    id: 'dp-arch-6',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PATTERNS_ARCHITECTURAL,
    course: Course.WEB_DEV,
    question: `The classic layered (n-tier) architecture splits an app into a presentation layer, a business-logic layer, and a data-access layer. What is the core rule that makes it "layered"?`,
    options: [
      { id: 'a', text: 'Every layer may call any other layer directly, in any direction, to avoid extra indirection', isCorrect: false },
      { id: 'b', text: 'Each layer depends only on the layer below it: presentation, then business, then data, never upward', isCorrect: true },
      { id: 'c', text: 'The data layer drives the application: it loads the rows and then calls up into the UI to show them', isCorrect: false },
      { id: 'd', text: 'The layers are naming labels for folders, with no rule about which one is allowed to call which', isCorrect: false },
    ],
    explanation: `A layered architecture puts code into horizontal layers and lets dependencies flow one way, downward. The presentation layer (routes, controllers, pages) calls the business layer (services, use cases), which calls the data layer (repositories, the ORM). A lower layer never calls a higher one, so the UI can change without touching the business rules, and the rules do not care how a page shows their results. That one-way rule is what stops a code base from becoming a ball of mud where everything calls everything. Clean (Hexagonal) Architecture refines it by having the business layer own the interfaces the data layer implements, so even that dependency points inward.`,
    hints: [
      'The defining property is the direction dependencies are allowed to flow',
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
    question: `In an analytics dashboard, reads far outnumber writes and need complex, denormalised views, while writes are simple but must be strictly validated. Pushing both through one shared model has made it bloated and slow. Which architectural pattern separates these concerns?`,
    options: [
      { id: 'a', text: 'Repository: put all data access behind one interface so the storage backend can be swapped freely', isCorrect: false },
      { id: 'b', text: 'Event Sourcing: store every change as an append-only log of events instead of the current rows', isCorrect: false },
      { id: 'c', text: 'CQRS: split the write model (commands) from the read model (queries), and optimise each one separately', isCorrect: true },
      { id: 'd', text: 'Saga: coordinate a long-running transaction across services with a compensating step for each one', isCorrect: false },
    ],
    explanation: `CQRS (Command Query Responsibility Segregation) separates the model that handles writes (commands: validated, normalised, transactional) from the model that handles reads (queries: denormalised, shaped for exactly what each screen shows). The two can use different schemas or even different databases, and scale separately, for example with read replicas. CQRS is often paired with Event Sourcing (the write side emits events that build the read models), but the two are distinct, and CQRS works without it. The cost is extra complexity and a delay before a write shows up on the read side, so it pays off only when read and write needs really differ, not for ordinary CRUD.`,
    hints: [
      'Reads and writes here have very different shapes and scaling needs',
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
    question: `Placing an order spans three microservices, Payment, Inventory and Shipping, each with its own database, so there is no single ACID transaction around them. If Inventory fails after Payment has already charged the card, how do you keep the system consistent?`,
    options: [
      { id: 'a', text: 'Saga: run a sequence of local transactions, each with a compensating action to undo earlier steps on failure', isCorrect: true },
      { id: 'b', text: 'A distributed lock held on all three databases until the last step finishes, so nothing commits early', isCorrect: false },
      { id: 'c', text: 'Wrap the three calls in one try/catch, so the error stops the request before the card charge is saved', isCorrect: false },
      { id: 'd', text: 'CQRS: separate the read and write models for orders so a failed write never shows up on the read side', isCorrect: false },
    ],
    explanation: `A Saga keeps data consistent across services without a distributed transaction. The work is a series of local transactions, one per service, and each step has a compensating action that undoes it in business terms: if Inventory fails, the saga refunds the payment. It can be choreographed (each service reacts to the previous one's events) or orchestrated (one coordinator tells each service what to do next). The price is eventual consistency and having to design every compensation. A try/catch in the order service cannot un-commit the charge, which already happened in the Payment service's own database; it can only start the refund, which is the saga's compensating step. Locks held across services for the whole order block everything else and are what this design avoids.`,
    hints: [
      'One ACID transaction across separate databases is not available',
      'If a later step fails, how do you undo the steps that already committed?',
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
    question: `A web app and a mobile app use the same set of microservices but need very different data shapes. Against the shared, generic API, the mobile app over-fetches and makes many round trips, which is slow on mobile networks. Which architectural pattern addresses this?`,
    options: [
      { id: 'a', text: 'API Gateway: one shared entry point that routes every client\'s requests on to the right services', isCorrect: false },
      { id: 'b', text: 'GraphQL: let every client query exactly the fields it needs from one shared endpoint and schema', isCorrect: false },
      { id: 'c', text: 'Monolith: merge all of the services back into one so a single API can serve both of the clients', isCorrect: false },
      { id: 'd', text: 'Backend for Frontend: a backend per client type that combines the service calls that client needs', isCorrect: true },
    ],
    explanation: `Backend for Frontend (BFF) gives each client experience its own thin backend, one for web and one for mobile. Each BFF calls the underlying services and reshapes their answers into exactly what its client needs, so the mobile app makes one call instead of many and receives no unused fields. It differs from a plain API Gateway, which is one shared routing layer for all clients; a BFF belongs to one client team, so web and mobile can change their backends independently. GraphQL is a real alternative fix for over-fetching, but it is a query technology rather than this pattern of one backend per client. A Next.js app's route handlers and Server Components often play the BFF role for its own pages.`,
    hints: [
      'The two clients need different shapes from the same services',
      'Contrast a backend owned by one client with a single shared gateway for everyone',
    ],
    tags: ['bff', 'backend-for-frontend', 'architectural', 'api-gateway', 'microservices'],
    concepts: ['pattern-architectural'],
  },

  // -- Predict: a service that depends on a repository interface (INTERMEDIATE Predict) --

  {
    id: 'dp-arch-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PATTERNS_ARCHITECTURAL,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question:
      'WelcomeService depends only on the UserRepo interface, and each instance is given a repository when it is built. What do the three console.log calls print? Type each printed line exactly, one per line, in order.',
    code: `interface UserRepo {
  findEmail(id: number): string | undefined;
}

class WelcomeService {
  constructor(private repo: UserRepo) {}
  welcome(id: number): string {
    const email = this.repo.findEmail(id);
    return email ? "Mail sent to " + email : "No such user";
  }
}

const rows = new Map([[1, "ada@shop.io"]]);
const live = new WelcomeService({ findEmail: (id) => rows.get(id) });
const test = new WelcomeService({ findEmail: () => "fake@test" });

console.log(live.welcome(1));
console.log(live.welcome(2));
console.log(test.welcome(2));`,
    expectedOutput: `Mail sent to ada@shop.io
No such user
Mail sent to fake@test`,
    explanation:
      'WelcomeService holds the business rule (send to the stored email, or report a missing user) and never says where users are stored: it only knows the UserRepo interface, and the repository is passed into its constructor. live gets one backed by the rows map, so user 1 is found and user 2 is not (Map.get returns undefined, so the "No such user" branch runs). test gets a fake that answers "fake@test" for any id, so the same welcome(2) now sends mail. The service code did not change between the two; only what was plugged in did. That is the dependency rule of layered and Clean Architecture: the core depends on an abstraction it owns, and the database, the API or a test double is an adapter supplied from outside.',
    hints: [
      'Each WelcomeService uses only the repository it was constructed with',
      'Map.get returns undefined for a key it does not hold',
    ],
    tags: ['clean-architecture', 'repository', 'dependency-injection', 'predict'],
    concepts: ['pattern-architectural'],
  },

  // =====================================================================
  // API_DESIGN (11 questions)
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
      { id: 'b', text: '1=GET /posts, 2=POST /posts, 3=PUT /posts/:id, 4=PATCH /posts/:id, 5=DELETE /posts/:id', isCorrect: true },
      { id: 'c', text: '1=GET /posts, 2=POST /posts, 3=PATCH /posts/:id, 4=PUT /posts/:id, 5=POST /posts/:id/delete', isCorrect: false },
      { id: 'd', text: '1=POST /getPosts, 2=POST /createPost, 3=POST /updatePost, 4=POST /updatePost, 5=POST /deletePost', isCorrect: false },
    ],
    explanation: `REST names resources with nouns and lets the HTTP method say what to do. GET /posts reads the collection; POST /posts creates a post (repeating it creates a second one, so POST is not idempotent); PUT /posts/:id replaces the whole post with the body sent (repeating it leaves the same state, so it is idempotent); PATCH /posts/:id changes only the fields sent, such as { title }; DELETE /posts/:id removes it. Swapping PUT and PATCH sends a full replacement where a partial update was meant, and the mapping with POST /getPosts and POST /deletePost is the RPC-over-HTTP anti-pattern from the rule card, where the verb moves into the URL and every call is a POST. GitHub's and Stripe's APIs follow these conventions closely.`,
    hints: [
      'PUT means "replace this whole resource with what I am sending"',
      'PATCH means "change only the fields I am sending"',
      'POST is the method that creates; repeating it creates another post',
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
    explanation: `The status code tells the client what happened before it reads the body. Creating a user is 201 Created. A body that parses but is missing the required email breaks a rule, so it is 422 Unprocessable Entity (400 Bad Request is for a request that cannot be parsed at all, such as broken JSON; some APIs use 400 for both, but this course follows the 400/422 split). A valid token for a user without the admin permission is 403 Forbidden: the server knows who you are but will not let you. No token at all is 401 Unauthorized: the server does not know who you are. A duplicate email is 409 Conflict. A failed database connection is the server's own fault, 500. Getting these right lets a front end react without reading messages: 401 sends the user to log in, 403 shows "access denied", 409 shows "email taken".`,
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
    question: `Your API returns a list of 50,000 products and needs pagination. Compare offset pagination (?offset=40&limit=20) with cursor pagination (?after=<last id>&limit=20). Which statement about their trade-offs is correct?`,
    options: [
      { id: 'a', text: 'Offset is fast at any depth, because the database jumps straight to row 10,000 through the primary key index', isCorrect: false },
      { id: 'b', text: 'Cursor is better in every way: offset has no advantage once a list has more than one page of results', isCorrect: false },
      { id: 'c', text: 'They cost the same: OFFSET and WHERE id > cursor both read only the 20 rows that end up being returned', isCorrect: false },
      { id: 'd', text: 'Offset can jump to any page but slows deep in the list and can repeat rows; cursor stays fast and stable but cannot jump', isCorrect: true },
    ],
    explanation: `Offset pagination runs SELECT ... ORDER BY id LIMIT 20 OFFSET 10000: the database still walks past 10,000 rows to throw them away, so deep pages get slower, and if a row is inserted or deleted while someone is browsing, every later row shifts, so they see one twice or miss one. Its advantage is that the user can jump straight to page 500 or see a page count. Cursor pagination runs SELECT ... WHERE id > :last ORDER BY id LIMIT 20: an index seeks straight to the cursor, so every page costs about the same, and inserts in front do not shift what comes next. It needs a unique, stable sort key (add id as a tie-breaker when sorting by a date), and it cannot jump to an arbitrary page. Use offset for small lists and admin tables where users pick page numbers, and cursors for feeds, infinite scroll and large lists; Stripe, GitHub and Slack use cursors.`,
    hints: [
      'Think about what the database does with OFFSET 10000',
      'What happens to page 2 if a new row is inserted while someone is on page 1?',
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
    question: `Design one error shape for every API error.
1. A class ApiError that extends Error, with statusCode (number), code (a machine-readable string), the message (human-readable) and optional details (an array of FieldError).
2. Give it a toJSON() method so that JSON.stringify(error) produces { "error": { "code": ..., "message": ..., "details": [...] } }, leaving details out when there are none.
3. createValidationError(fields: FieldError[]) returns an ApiError with status 422, code "VALIDATION_ERROR", the message "Validation failed" and the fields as details.
4. createNotFoundError(resource: string, id: string) returns an ApiError with status 404, code "NOT_FOUND" and the message "<resource> with id <id> not found", for example "User with id 42 not found".

The starter defines FieldError.`,
    starterCode: `type FieldError = { field: string; message: string };
`,
    testCases: [
      { input: 'JSON.stringify(createValidationError([{ field: "email", message: "Email is required" }]))', expectedOutput: '{"error":{"code":"VALIDATION_ERROR","message":"Validation failed","details":[{"field":"email","message":"Email is required"}]}}', description: 'A validation error serialises with its details' },
      { input: 'createNotFoundError("User", "42")', expectedOutput: 'statusCode 404, code NOT_FOUND, message "User with id 42 not found"', description: 'A not-found error has its status, code and message' },
      { input: 'JSON.stringify(createNotFoundError("User", "42"))', expectedOutput: '{"error":{"code":"NOT_FOUND","message":"User with id 42 not found"}}', description: 'details is left out when there are none' },
    ],
    solution: `type FieldError = { field: string; message: string };

class ApiError extends Error {
  statusCode: number;
  code: string;
  details?: FieldError[];

  constructor(statusCode: number, code: string, message: string, details?: FieldError[]) {
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

function createValidationError(fields: FieldError[]): ApiError {
  return new ApiError(422, "VALIDATION_ERROR", "Validation failed", fields);
}

function createNotFoundError(resource: string, id: string): ApiError {
  return new ApiError(404, "NOT_FOUND", \`\${resource} with id \${id} not found\`);
}

# OR

type FieldError = { field: string; message: string };

class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: FieldError[],
  ) {
    super(message);
  }

  toJSON() {
    const error: { code: string; message: string; details?: FieldError[] } = {
      code: this.code,
      message: this.message,
    };
    if (this.details) error.details = this.details;
    return { error };
  }
}

function createValidationError(fields: FieldError[]): ApiError {
  return new ApiError(422, "VALIDATION_ERROR", "Validation failed", fields);
}

function createNotFoundError(resource: string, id: string): ApiError {
  return new ApiError(404, "NOT_FOUND", \`\${resource} with id \${id} not found\`);
}`,
    tieredHints: {
      apiSignature: 'new ApiError(statusCode: number, code: string, message: string, details?: FieldError[])',
      skeleton: `class ApiError extends ____ {
  statusCode: number;
  code: string;
  details?: FieldError[];

  constructor(statusCode: number, code: string, message: string, details?: FieldError[]) {
    ____(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }

  ____() {
    return {
      error: {
        code: this.code,
        message: this.message,
        ...(this.details && { details: ____ }),
      },
    };
  }
}

function createValidationError(fields: FieldError[]): ApiError {
  return new ApiError(____, ____, "Validation failed", fields);
}

function createNotFoundError(resource: string, id: string): ApiError {
  return new ApiError(____, ____, ____);
}`,
    },
    explanation: `The api_design rule card asks for errors in one shape, such as { code, message, details }, and this class gives every endpoint that shape. code is for programs (a front end can switch on "VALIDATION_ERROR" without parsing English), message is for people, and details maps each problem to a form field. Extending Error makes ApiError a real error that can be thrown, caught and logged with a stack trace, and super(message) is what sets this.message. JSON.stringify calls a toJSON() method when an object has one, which is how the class controls its wire format: the status code goes in the HTTP status line, not the body, and spreading this.details && { details } adds the key only when there are details (spreading undefined adds nothing). The two helpers are small factories that make every 422 and 404 look the same; a route handler can then catch an ApiError and return Response.json(err, { status: err.statusCode }). Stripe and GitHub return errors in shapes like this.`,
    hints: [
      'Extend Error so ApiError can be thrown and caught like any error',
      'JSON.stringify uses a toJSON() method when the object has one',
      'Add details to the JSON only when there are details',
    ],
    tags: ['error-handling', 'api-design', 'typescript', 'validation'],
    concepts: [
      'js-error-handling',
      'api-rest-conventions',
    ],
    requires: [
      /extends\s+Error\b/,
      /super\(\s*message\s*\)|this\.message\s*=/,
      /toJSON\s*\(/,
      /\b422\b[\s\S]*VALIDATION_ERROR|VALIDATION_ERROR[\s\S]*\b422\b/,
      /\b404\b[\s\S]*NOT_FOUND|NOT_FOUND[\s\S]*\b404\b/,
    ],
  },

  {
    id: 'dp-api-5',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.API_DESIGN,
    course: Course.WEB_DEV,
    question: `Your public API has thousands of integrations, and you need to ship a breaking change to the /users response shape without breaking existing clients. How do you version the API, and what is the usual trade-off?`,
    options: [
      { id: 'a', text: 'Never version at all: keep every response backward compatible forever, whatever changes you need', isCorrect: false },
      { id: 'b', text: 'Version via the URL path (/v1/), a custom header or the Accept media type; the URL is the most visible', isCorrect: true },
      { id: 'c', text: 'Bump one global version number on every change you ship, including additive, non-breaking ones', isCorrect: false },
      { id: 'd', text: 'Rely on HTTP content negotiation to pick a version automatically, so every client always matches', isCorrect: false },
    ],
    explanation: `An API with outside consumers needs explicit versions so a breaking change can ship as a new version while old clients keep calling the old one. The common places for the version: the URL path (/v1/users), which is the most visible and the easiest to route and cache; a custom header (X-API-Version: 2), which keeps URLs clean but is invisible in a browser and harder to cache; or the Accept media type (application/vnd.myapi.v2+json), the most HTTP-correct but verbose and rarely used. Content negotiation needs the client to ask for a version; nothing picks one for it. Only breaking changes need a new version; adding an optional field does not. Stripe pins each account to a dated version. URL versioning is the pragmatic default for most teams.`,
    hints: [
      'List the places in an HTTP request where a version string can live',
      'Only breaking changes should need a new version',
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
    explanation: `HTTP conditional requests let a client check cheaply and download only when something changed. The server sends an ETag (a hash or version token) with the response. On the next request the client sends If-None-Match: <etag>; if the resource is unchanged, the server answers 304 Not Modified with an empty body and the client reuses its copy, which saves bandwidth while still confirming it has the latest. Last-Modified with If-Modified-Since works the same way with timestamps. That beats keeping a copy in localStorage forever (it never sees updates) or adding ?nocache=true (it always downloads again). Combine it with Cache-Control (max-age, no-cache, private or public) to say how long a copy may be used before it must be checked again. POST responses can in fact be cached in narrow cases, but switching a read to POST throws away all of this.`,
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
      { id: 'a', text: 'GraphQL is always faster than REST, thanks to its binary wire encoding over HTTP/2 and built-in compression', isCorrect: false },
      { id: 'b', text: 'Clients ask for exactly the fields they need in one query, but HTTP caching gets harder and costly queries need limits', isCorrect: true },
      { id: 'c', text: 'GraphQL lets the client query the database directly, which removes the need for a backend between them', isCorrect: false },
      { id: 'd', text: 'GraphQL is REST with a different URL scheme, so switching to it brings no real trade-offs for the team', isCorrect: false },
    ],
    explanation: `GraphQL exposes one endpoint where the client describes exactly the data it wants in a single request, which fixes over-fetching (no unused fields) and under-fetching (no chain of round trips). The costs are real: HTTP caching is harder because everything goes through one POST /graphql, so teams add persisted queries or caching per field, and a deep or nested query can be expensive, so servers need depth and complexity limits and timeouts. It does not bypass the backend: resolvers still run on the server and call your data sources. GraphQL is JSON over ordinary HTTP, not a binary protocol; gRPC is the binary, schema-first option, strong for service-to-service calls but awkward from browsers. REST stays the simplest and most cacheable choice for public CRUD APIs, so the right answer depends on the access patterns.`,
    hints: [
      'GraphQL fixes over- and under-fetching, but what does it cost you in caching?',
      'Does the client really talk to the database, or to resolvers on the server?',
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
    question: `A React form checks that "email" looks like an email with a Zod schema before it lets the user submit. A teammate asks whether the API also needs to validate the email field on the server. Why does it?`,
    options: [
      { id: 'a', text: 'Anyone can call the API directly (curl, a script, devtools, another app), so the server is the real trust boundary', isCorrect: true },
      { id: 'b', text: 'It does not: once the form has validated a field, the API can trust that field in every request it receives', isCorrect: false },
      { id: 'c', text: 'Only numeric fields need server checks, since string formats such as email are a purely visual concern', isCorrect: false },
      { id: 'd', text: 'It does not: server checks cost CPU, and the database column type already rejects any badly formed data', isCorrect: false },
    ],
    explanation: `Validation in the browser is a convenience for the user: instant feedback without a round trip. It is not a security or data-integrity boundary, because nothing forces a request to come from that form; an attacker, a bug or a legitimate non-browser client can send the API any body it likes. The API is the trust boundary, so it validates every field itself. In a full-stack Next.js app the same Zod schema can run on both sides (in the form and again in the Server Action or route handler), which is why "define the schema once, use it in both places" is a common pattern. A database column type catches only gross type mismatches, not rules such as "must look like an email" or "at most 500 characters".`,
    hints: [
      'Anyone can send an HTTP request straight to the API, with or without your form',
      'Client-side validation is about user experience, not security',
    ],
    tags: ['validation', 'zod', 'security', 'api-design', 'trust-boundary'],
    concepts: [
      'api-rest-conventions',
      'web-security-input-validation',
    ],
  },

  // -- Predict: offset vs cursor pages when a new row arrives (INTERMEDIATE Predict) --

  {
    id: 'dp-api-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.API_DESIGN,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question:
      'A feed API returns pages of 2 post ids, newest first. byOffset(offset) skips a number of posts; byCursor(before) returns the posts older than the last id the client saw. What do the three console.log calls print? Type each page as its ids joined by commas, one page per line, in order.',
    code: `const feed = [50, 40, 30, 20, 10]; // post ids, newest first

const byOffset = (offset: number) => feed.slice(offset, offset + 2);
const byCursor = (before: number) =>
  feed.filter((id) => id < before).slice(0, 2);

console.log(byOffset(0).join(","));
feed.unshift(60); // a new post arrives before page 2 is requested
console.log(byOffset(2).join(","));
console.log(byCursor(40).join(","));`,
    expectedOutput: `50,40
40,30
30,20`,
    explanation:
      'Page 1 is the first two posts, 50 and 40. Then post 60 is added at the front of the feed, which pushes every older post one place down. Offset pagination asks for "skip 2, take 2" and has no idea the list moved, so slice(2, 4) of [60, 50, 40, 30, 20, 10] returns 40,30: the client sees 40 a second time (and a deletion would make it skip a post instead). Cursor pagination asks for "the 2 posts older than 40", the last id the client already has, which is still 30,20 however many posts arrived in front. That stability, plus the database seeking straight to the cursor through an index (WHERE id < 40 ORDER BY id DESC LIMIT 2) instead of reading and discarding OFFSET rows, is why feeds and large lists use cursors, while offset stays fine for small lists where users jump to page numbers.',
    hints: [
      'After unshift(60), which post sits at index 2?',
      'The cursor version filters by the id value 40, not by a position',
    ],
    tags: ['pagination', 'cursor', 'offset', 'rest', 'predict'],
    concepts: ['api-pagination'],
  },

  // =====================================================================
  // DB_DESIGN (12 questions)
  // =====================================================================

  {
    id: 'dp-db-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DB_DESIGN,
    course: Course.WEB_DEV,
    question: `A users table has the columns id, full_name, email, street, city, state, zip, phone1, phone2 and phone3, and a user can have up to five phone numbers. What normalisation problems does it have, and how do you fix them to reach third normal form (3NF)?`,
    options: [
      { id: 'a', text: 'phone1-3 is a repeating group, which breaks 1NF: move phones to their own table; and if zip decides city and state, they break 3NF', isCorrect: true },
      { id: 'b', text: 'It is already in 3NF, because every column holds one atomic value and the table has a primary key', isCorrect: false },
      { id: 'c', text: 'Only the phones need fixing: store them in one JSON array column, which allows any number of phones', isCorrect: false },
      { id: 'd', text: 'Move every column into its own table keyed by user id, since 3NF means one non-key column per table', isCorrect: false },
    ],
    explanation: `First normal form (1NF) means one value per column and no repeating groups. phone1, phone2 and phone3 are a repeating group: a fourth phone needs a schema change, most rows hold empty columns, and a query for "who has this number" must check three columns. The fix is a phones table with (id, user_id, number), one row per phone. Third normal form (3NF) means every column depends on the key alone. If the zip code determines the city and state, those two depend on the zip, not on the user, so they belong with the zip (a zip_codes table) or are kept on purpose as a denormalised copy. A JSON array hides the phones from foreign keys and indexes, and 3NF does not mean one column per table. Denormalising is fine when it is a deliberate trade for faster reads, made once you know the rules.`,
    hints: [
      'What happens when a user has a fourth or fifth phone number?',
      '1NF: no repeating groups. 3NF: no column that depends on another non-key column',
      'Does the zip code decide the city and state?',
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
      { id: 'a', text: 'Any index that lists every column in the table, but it works like a normal index and still reads each table row', isCorrect: false },
      { id: 'b', text: 'An index holding every column a query needs, so the database reads only the index; the cost is slower writes and space', isCorrect: true },
      { id: 'c', text: 'An index that takes over from the primary key, so the table no longer needs its own id column once it exists', isCorrect: false },
      { id: 'd', text: 'An index that makes the other two redundant, since idx_all now serves every filter that either of them served', isCorrect: false },
    ],
    explanation: `A query is covered when an index holds every column it needs, so the database answers it from the index alone (an index-only scan) without fetching each table row. idx_all (customer_id, status, created_at, total_amount) covers SELECT total_amount FROM orders WHERE customer_id = ? AND status = ? ORDER BY created_at: the two equality filters lead the index, the rows come out already sorted by created_at, and total_amount is read from the index itself. The costs: every INSERT, and every UPDATE of those columns, must also update this wider index, and it takes disk space. It does not replace idx_status_date: an index serves only filters on its leading columns, so idx_all cannot help a query that filters by status alone, while queries on customer_id and created_at can use it as well as idx_customer_date. PostgreSQL and SQL Server can also add non-key columns with INCLUDE (total_amount). Check with EXPLAIN that an index is really used.`,
    hints: [
      'What happens when the database can find every value it needs in the index itself?',
      'Which columns does idx_all start with, and which filters can it therefore serve?',
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
    question: `You're designing a database where (1) employees have managers, who are also employees; (2) students enrol in many courses, and each course has many students; and (3) an order contains many products, each product can be in many orders, and each order-product pair has its own quantity. Which design is correct?`,
    options: [
      { id: 'a', text: 'A separate managers table, a course_id column on students, and an array of product_ids on each order', isCorrect: false },
      { id: 'b', text: 'A JSON column on one side of each relation, since a document can hold a whole list of related ids', isCorrect: false },
      { id: 'c', text: 'manager_id pointing back at employees, plus enrollments and order_items junction tables (order_items with quantity)', isCorrect: true },
      { id: 'd', text: 'Employees many-to-many, students to courses one-to-many, and orders to products one-to-one, each with a foreign key', isCorrect: false },
    ],
    explanation: `An employee's manager is another employee, so employees gets a manager_id column that references employees.id: a self-reference, the same shape as categories with subcategories or threaded comments. Students and courses are many-to-many, and neither side can hold the foreign key alone, so a junction table, enrollments (student_id, course_id, enrolled_at), holds one row per pair. Orders and products are also many-to-many, and the junction table order_items (order_id, product_id, quantity, unit_price) carries data about the pair: the quantity, and the price at the time of purchase rather than today's price. A course_id on students allows only one course per student, and an array or JSON list of ids cannot have foreign keys, joins or a useful index.`,
    hints: [
      'Can an employee\'s manager also be an employee? That is a self-reference',
      'Many-to-many always needs a third table; where else would both foreign keys go?',
      'A junction table can carry data of its own, such as a quantity',
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
    language: CodeLanguage.TYPESCRIPT,
    question: `A Prisma schema has Author (id, penName, books) and Book (id, title, authorId, author), and a PrismaClient named prisma is in scope. Write two async functions that both return an array of strings like "Dune by Frank Herbert":
1. booksSlow() loads all books with one findMany call and then loads each book's author with its own query, the N+1 pattern
2. booksFast() loads all books together with their authors in a single findMany call`,
    starterCode: `async function booksSlow() {
}

async function booksFast() {
}
`,
    testCases: [
      { input: 'booksSlow() with 3 books', expectedOutput: '1 + 3 = 4 queries', description: 'booksSlow queries once for the books and once per book for its author' },
      { input: 'booksFast() with 3 books', expectedOutput: 'one findMany call', description: 'booksFast loads the authors with the books' },
      { input: 'either function', expectedOutput: '["Dune by Frank Herbert", ...]', description: 'Both return "<title> by <penName>" strings' },
    ],
    solution: `async function booksSlow() {
  const books = await prisma.book.findMany();
  const lines: string[] = [];
  for (const book of books) {
    const author = await prisma.author.findUnique({ where: { id: book.authorId } });
    lines.push(\`\${book.title} by \${author?.penName}\`);
  }
  return lines;
}

async function booksFast() {
  const books = await prisma.book.findMany({ include: { author: true } });
  return books.map((book) => \`\${book.title} by \${book.author.penName}\`);
}

# OR

async function booksSlow() {
  const books = await prisma.book.findMany();
  return Promise.all(
    books.map(async (book) => {
      const author = await prisma.author.findUnique({ where: { id: book.authorId } });
      return \`\${book.title} by \${author?.penName}\`;
    }),
  );
}

async function booksFast() {
  const books = await prisma.book.findMany({
    select: { title: true, author: { select: { penName: true } } },
  });
  return books.map((book) => \`\${book.title} by \${book.author.penName}\`);
}`,
    tieredHints: {
      apiSignature: 'prisma.book.findMany({ include: { relation: true } })',
      skeleton: `async function booksSlow() {
  const books = await prisma.book.____();
  const lines: string[] = [];
  for (const book of books) {
    const author = await prisma.author.____({ where: { id: ____ } });
    lines.push(____);
  }
  return lines;
}

async function booksFast() {
  const books = await prisma.book.findMany({ ____: { author: true } });
  return books.map((book) => ____);
}`,
    },
    explanation: `booksSlow is the N+1 query problem: one query for the list of books, then one more query per book for its author, so 3 books cost 4 queries and 1,000 books cost 1,001, each a round trip to the database. Running the per-book queries with Promise.all only sends them at the same time; it is still N+1 queries. booksFast asks Prisma for the relation up front: include: { author: true } (or a nested select of only the fields you need) makes Prisma load the authors with the books, by default as one extra query with an IN list of the author ids, so the cost stays at 2 queries however many books there are. An ORM hides the per-row query inside a loop or a lazy property, so turn on Prisma's query log (new PrismaClient({ log: ["query"] })) to see which kind of code you have. Django's select_related and prefetch_related solve the same problem.`,
    hints: [
      'booksSlow runs a query inside its loop, once per book',
      'booksFast asks for the author relation in the same findMany call',
    ],
    tags: [
      'n-plus-one',
      'orm',
      'prisma',
      'include',
      'performance',
      'database',
    ],
    concepts: [
      'prisma-include-select',
    ],
    requires: [
      /prisma\.book\.findMany\(/,
      /prisma\.author\.find(Unique|First)\(/,
      /include:\s*\{\s*author:\s*true|author:\s*\{\s*select:/,
    ],
  },

  {
    id: 'dp-db-5',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DB_DESIGN,
    course: Course.WEB_DEV,
    question: `Transferring money debits one account and credits another, as two separate UPDATE statements. If the debit succeeds but the credit fails, the money vanishes. How do you guarantee that both happen or neither does?`,
    options: [
      { id: 'a', text: 'Run both updates, and retry the second one if it fails, until it finally succeeds', isCorrect: false },
      { id: 'b', text: 'Add a covering index so both updates run fast enough that neither has time to fail', isCorrect: false },
      { id: 'c', text: 'Wrap both updates in a transaction, so they commit together or roll back together', isCorrect: true },
      { id: 'd', text: 'Send each update as its own API call, so a failure in one cannot affect the other', isCorrect: false },
    ],
    explanation: `A transaction groups several statements into one all-or-nothing unit. You BEGIN, run the debit and the credit, and COMMIT; if anything fails before the commit, you ROLLBACK and the database undoes every change in the transaction. This is the A in ACID, atomicity. The full set: Atomicity (all or nothing), Consistency (constraints hold before and after), Isolation (concurrent transactions do not see each other's half-finished work) and Durability (committed data survives a crash). Retrying the credit can fail for as long as the cause lasts (a closed account, a crash), and in the meantime the money is gone; speed and separate calls do not make two writes inseparable. In Prisma, prisma.$transaction([...]) runs a list of writes this way.`,
    hints: [
      'You need the two writes to be inseparable: one unit that fully applies or fully undoes',
      'This is the A (atomicity) in ACID',
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
    question: `Two transactions run at the same time, and one reads data that the other is halfway through changing, which gives inconsistent results. This is what transaction isolation levels control. Which statement is correct?`,
    options: [
      { id: 'a', text: 'READ UNCOMMITTED is the safest level, because it locks every row it reads before others can touch it', isCorrect: false },
      { id: 'b', text: 'Higher levels, up to SERIALIZABLE, prevent more anomalies (dirty and non-repeatable reads, phantoms) but cut concurrency', isCorrect: true },
      { id: 'c', text: 'All isolation levels behave the same way in practice; the setting only changes how locks are reported', isCorrect: false },
      { id: 'd', text: 'SERIALIZABLE is the default level in most databases, and it is also the fastest because nothing waits', isCorrect: false },
    ],
    explanation: `Isolation levels trade consistency against concurrency. In the SQL standard, from weakest to strongest: READ UNCOMMITTED can see other transactions' uncommitted (dirty) data; READ COMMITTED sees only committed data, but reading a row twice can give two values (a non-repeatable read); REPEATABLE READ keeps rows you have read stable, but new matching rows can appear (a phantom); SERIALIZABLE behaves as if the transactions ran one after another, with no anomalies but the most waiting or aborted transactions and the lowest throughput. READ COMMITTED is PostgreSQL's and SQL Server's default, and REPEATABLE READ is MySQL's; PostgreSQL's REPEATABLE READ also blocks phantoms, because it reads from a snapshot. Pick the weakest level that is correct for the work, because each step up costs concurrency.`,
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
    question: `Several users can edit the same record through a long form, but two people editing the same record at the same time is rare. You want to catch the occasional conflict without holding a database lock for the whole editing session. Which approach fits?`,
    options: [
      { id: 'a', text: 'Optimistic locking: keep a version column, and reject a save if the version changed since the form loaded', isCorrect: true },
      { id: 'b', text: 'Pessimistic locking: SELECT ... FOR UPDATE when the form opens, and hold that lock until the user saves', isCorrect: false },
      { id: 'c', text: 'Allow only one user to use the application at a time, so two edits can never overlap with each other', isCorrect: false },
      { id: 'd', text: 'Save every edit as it arrives and let the last write win, since conflicts are too rare to be worth handling', isCorrect: false },
    ],
    explanation: `Optimistic locking assumes conflicts are rare and takes no lock while the user edits. Each row carries a version (or updated_at) column that the form reads with the data. The save runs UPDATE ... SET ..., version = version + 1 WHERE id = ? AND version = ?; if someone else saved first, the version no longer matches, zero rows change, and the API answers with a conflict (409) so the user can reload and merge. Pessimistic locking (SELECT ... FOR UPDATE) holds a real lock until the transaction ends, which is right for short transactions where conflicts are frequent and costly, but holding it across a long form blocks everyone else and risks deadlocks. Last write wins silently throws away the first person's changes. Match the strategy to how often conflicts happen: rare means optimistic.`,
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
    question: `A read-heavy analytics dashboard joins six normalised tables on every page load and has become slow. Writes to those tables are infrequent, and the join columns are already indexed. What is a reasonable next step?`,
    options: [
      { id: 'a', text: 'Stay strictly in 3NF: denormalising is never acceptable in production, whatever the workload', isCorrect: false },
      { id: 'b', text: 'Keep adding indexes on every column until the six-way join becomes fast enough for the users', isCorrect: false },
      { id: 'c', text: 'Migrate the whole application to a NoSQL database, since joins are the slow part of SQL', isCorrect: false },
      { id: 'd', text: 'Denormalise selectively (copy or precompute fields) to cut joins, and keep the copies in sync on write', isCorrect: true },
    ],
    explanation: `Normalisation protects writes (each fact is stored once, so nothing drifts out of sync); denormalisation speeds up reads (fewer joins). When a workload is overwhelmingly reads, writes are rare and the bottleneck is a many-table join that is already indexed, selective denormalisation is a deliberate, legitimate trade: copy a few hot columns, add a precomputed summary table, or use a materialised view. The cost you accept is keeping the copies consistent on every write (in application code, triggers or a scheduled refresh) and the risk that they drift. More indexes do not remove the join work, each one slows writes, and rewriting the whole app on another database for one slow page is far out of proportion.`,
    hints: [
      'Normalisation favours writes; what does denormalisation favour?',
      'The cost of copying data is keeping the copies in sync',
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
      { id: 'a', text: 'NoSQL always scales further than SQL, so it should be the default choice for every new project', isCorrect: false },
      { id: 'b', text: 'Relational databases cannot scale beyond one machine, so they are effectively obsolete today', isCorrect: false },
      { id: 'c', text: 'Relational suits structured, related data needing joins and ACID; NoSQL suits flexible schemas and scale', isCorrect: true },
      { id: 'd', text: 'SQL and NoSQL give identical guarantees, and they differ only in the syntax used to query them', isCorrect: false },
    ],
    explanation: `The choice depends on the shape of the data and how it is read, not on which is newer. Relational databases (PostgreSQL, MySQL) are strongest when data is structured and related, you need joins, constraints and ACID transactions: most business apps, and what Prisma models. Document stores (MongoDB, DynamoDB) are strongest when the schema is flexible or changing, each record is read as one self-contained document, and writes must spread across many machines; the cost is weaker consistency across documents and handling relationships yourself. Relational databases also scale a long way (read replicas, partitioning, JSONB columns), so "SQL cannot scale" is out of date. Many systems use both.`,
    hints: [
      'Is your data highly related, and does it need joins and transactions?',
      'NoSQL trades joins and cross-record consistency for flexible schemas and scale',
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
    explanation: `Auto-increment (sequential) integer keys are compact and index extremely well (new rows append to the end of the B-tree), but they require a central sequence (awkward across shards/offline clients) and are guessable/enumerable when exposed in URLs (you can probe /users/1, /users/2 and infer how many users exist). UUIDs can be generated independently on any service or client with negligible collision risk (useful for distributed systems and for merging data) and don't leak counts, but they are larger (16 bytes vs 4-8) and random UUIDv4 values scatter index inserts, hurting write locality. A common compromise is time-ordered IDs (UUIDv7, ULID) that keep global uniqueness while staying roughly sequential for index friendliness.`,
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
    explanation: `Soft delete (a nullable deleted_at, or a boolean is_deleted) keeps the row but marks it hidden, so moderation and audit tools can still read it while every normal query adds WHERE deleted_at IS NULL. The cost: every query on the table must remember that filter, and one that forgets leaks "deleted" posts back into a feed, which is why teams put it in one place (a database view, a default scope, or a Prisma client extension). A partial index (CREATE INDEX ... WHERE deleted_at IS NULL) keeps the filtered queries fast, and foreign keys pointing at a soft-deleted row still resolve because the row never left. Hard delete is simpler but destroys the history the requirement asks for. Renaming the title leaves the post in every feed and search. Moving rows to a separate deleted_posts table works for real archiving, but it breaks foreign keys that point at the post, and reusing the old id for a new post would point old links and reports at the wrong post.`,
    hints: [
      'The requirement needs the row to still exist somewhere for moderation/audit',
      'A nullable timestamp column can mean both "not deleted" (null) and "deleted at this time"',
    ],
    tags: ['soft-delete', 'hard-delete', 'database-design', 'audit-trail'],
    concepts: ['db-normalization'],
  },

  // -- Predict: counting the queries of an N+1 loop (BEGINNER Predict) --

  {
    id: 'dp-db-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DB_DESIGN,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question:
      'db stands in for a database client, and every one of its methods is one query, counted in queries. What do the two console.log calls print? Type each printed line exactly, one per line, in order.',
    code: `let queries = 0;
const authorOf = new Map([[1, "Le Guin"], [2, "Herbert"]]);
const bookRows = [
  { title: "Dune", authorId: 2 },
  { title: "Earthsea", authorId: 1 },
  { title: "Dune Messiah", authorId: 2 },
];
const db = {
  books() { queries++; return bookRows; },
  author(id: number) { queries++; return authorOf.get(id); },
  authors(ids: number[]) { queries++; return ids.map((id) => authorOf.get(id)); },
};

db.books().forEach((b) => db.author(b.authorId));
console.log("loop: " + queries);

queries = 0;
const books = db.books();
db.authors([...new Set(books.map((b) => b.authorId))]);
console.log("batched: " + queries);`,
    expectedOutput: `loop: 4
batched: 2`,
    explanation: `The loop is the N+1 query problem: one query for the list of books, then one more query per book to fetch its author. With 3 books that is 1 + 3 = 4 queries, even though Herbert is fetched twice, because the loop asks per row and never checks what it already has. The batched version runs one query for the books and one for all the authors they need (WHERE id IN (2, 1)), so it costs 2 queries whether there are 3 books or 3,000. An ORM hides the per-row query inside a property access such as book.author, which is why N+1 is easy to miss; the fixes are one IN query per relation (Prisma's include does this by default, as does Django's prefetch_related) or a JOIN (Django's select_related, or Prisma's relationLoadStrategy: "join", still behind the relationJoins preview flag in Prisma 6), and a query log or counter shows which one you have.`,
    hints: [
      'db.author() runs once for every book, not once for every distinct author',
      'Count the db method calls in each half: every call adds 1 to queries',
    ],
    tags: ['n-plus-one', 'orm', 'query-count', 'predict'],
    concepts: [
      'prisma-include-select',
    ],
  },
];
