import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const py_oop_advanced_questions: Question[] = [
{
      id: 'py-oop-parsons-10',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_OOP_ADVANCED,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Define __slots__ on Point to prevent instance __dict__ and save memory.',
      correctOrder: [
        'class Point:',
        '    __slots__ = ("x", "y")',
        '    def __init__(self, x, y):',
        '        self.x = x',
        '        self.y = y',
      ],
      distractorLines: [
        '    __slots__ = "x", "y"',
        '    __slots__ = ["x", "y"]',
        '    slots = ("x", "y")',
      ],
      solution:
        'class Point:\n    __slots__ = ("x", "y")\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y',
      explanation:
        '__slots__ as a tuple/list/set of names tells Python to use a fixed-shape struct instead of __dict__. Saves memory and forbids adding new attributes. The bare-tuple form `"x", "y"` works too but the parenthesized form is more conventional. List form also works.',
      hints: ['Tuple of attribute names; magic name with double underscores.'],
      tags: ['oop', '__slots__', 'memory'],
      concepts: ['py-class-instance-distinction'],
    },
{
      id: 'pcpp-inherit-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_OOP_ADVANCED,
      course: Course.BACKEND,
      question: 'What is the Method Resolution Order (MRO) in Python, and why does it matter?',
      options: [
        { id: 'a', text: 'The order in which methods are defined inside a class', isCorrect: false },
        { id: 'b', text: 'The order Python searches classes to find a method or attribute in multiple inheritance', isCorrect: true },
        { id: 'c', text: 'A rule that all methods must be defined before they are called', isCorrect: false },
        { id: 'd', text: 'The alphabetical order of method names inside a class', isCorrect: false },
      ],
      explanation: 'MRO defines the order Python searches the class hierarchy when looking up attributes or methods. Python uses the C3 linearisation algorithm. You can inspect it with `MyClass.__mro__` or `MyClass.mro()`. This is crucial in multiple inheritance to avoid the "diamond problem". `super()` follows the MRO automatically.',
      hints: [
        'Check it with `ClassName.__mro__`',
        'It matters most in multiple inheritance scenarios',
      ],
      tags: ['oop', 'MRO', 'inheritance', 'multiple-inheritance', 'C3'],
      concepts: ['py-class-instance-distinction', 'py-mro-resolution', 'py-super-call'],
    },
{
      id: 'pcpp-encap-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_OOP_ADVANCED,
      course: Course.BACKEND,
      question: 'In Python, what is the convention for "private" attributes, and what does name mangling do?',
      options: [
        { id: 'a', text: 'Single underscore `_attr` = truly private (cannot be accessed outside class)', isCorrect: false },
        { id: 'b', text: 'Single underscore `_attr` = private by convention; double underscore `__attr` triggers name mangling to `_ClassName__attr`', isCorrect: true },
        { id: 'c', text: 'Double underscore `__attr` = truly private (raises `AttributeError` if accessed)', isCorrect: false },
        { id: 'd', text: 'Python has no concept of private attributes', isCorrect: false },
      ],
      explanation: 'Python uses convention rather than enforcement. `_attr` signals "private — don\'t use externally" but is still accessible. `__attr` (double underscore) triggers name mangling: Python renames it to `_ClassName__attr`. This makes accidental overriding in subclasses harder, but you can still access it with the mangled name. True privacy isn\'t enforced in Python.',
      hints: [
        '`_` = convention only; `__` = name mangling (not true privacy)',
        'Name mangling: `self.__x` becomes `_ClassName__x`',
      ],
      tags: ['oop', 'encapsulation', 'private', 'name-mangling', 'underscore'],
      concepts: ['py-class-instance-distinction'],
    },
{
      id: 'pcpp-encap-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_OOP_ADVANCED,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Build a `BankAccount` class with a name-mangled PRIVATE balance attribute (double leading underscores). The constructor takes an `initial_balance` keyword argument defaulting to 0. Expose the balance publicly as a READ-ONLY property (no setter, so callers can\'t overwrite it directly). Add a deposit method that raises `ValueError("Deposit amount must be positive")` for non-positive amounts, otherwise adds to the balance. Add a withdraw method that raises `ValueError("Insufficient funds")` when the amount exceeds the balance, otherwise subtracts. Demonstrate: create an account with 100, deposit 50, print the balance (expect `150`), withdraw 30, print the balance (expect `120`).',
      starterCode: `# Define BankAccount(initial_balance=0) with:
#   - a private __balance attribute
#   - a read-only @property called balance
#   - deposit(amount) — reject non-positive amounts with ValueError
#   - withdraw(amount) — raise ValueError if amount > balance


# Create an account with 100, deposit 50, print balance, withdraw 30, print balance
`,
      testCases: [
        { input: 'BankAccount(100).balance', expectedOutput: '100', description: 'balance property returns initial balance' },
      ],
      solution: `class BankAccount:
    def __init__(self, initial_balance=0):
        self.__balance = initial_balance

    @property
    def balance(self):
        return self.__balance

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("Deposit amount must be positive")
        self.__balance += amount

    def withdraw(self, amount):
        if amount > self.__balance:
            raise ValueError("Insufficient funds")
        self.__balance -= amount

account = BankAccount(100)
account.deposit(50)
print(account.balance)
account.withdraw(30)
print(account.balance)`,
      explanation: '`__balance` uses name mangling — it becomes `_BankAccount__balance`. The `@property` decorator creates a read-only attribute (no setter). Validation in `withdraw` raises `ValueError` to signal invalid operations. Callers can\'t accidentally set `account.balance = 1000000` since there\'s no setter.',
      hints: [
        '`@property` creates a getter — no setter means read-only',
        'Raise `ValueError` when the amount exceeds the balance',
      ],
      tags: ['oop', 'encapsulation', 'property', 'name-mangling', 'BankAccount'],
      concepts: ['py-class-instance-distinction'],
    },
{
      id: 'pcpp-compose-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_OOP_ADVANCED,
      course: Course.BACKEND,
      question: 'What is the "composition over inheritance" principle?',
      options: [
        { id: 'a', text: 'Never use inheritance — always use composition', isCorrect: false },
        { id: 'b', text: 'Prefer building complex objects from simpler objects (has-a relationships) rather than deep inheritance chains (is-a relationships)', isCorrect: true },
        { id: 'c', text: 'Always inherit from multiple classes to get maximum reuse', isCorrect: false },
        { id: 'd', text: 'Composition is faster than inheritance at runtime', isCorrect: false },
      ],
      explanation: 'Inheritance models "is-a" relationships (Dog IS-A Animal). Composition models "has-a" relationships (Car HAS-A Engine). Deep inheritance hierarchies become rigid and hard to change. Composition is more flexible — you can swap out components at runtime. The principle doesn\'t say never inherit, but prefer composition when both could work.',
      hints: [
        '"is-a" → inheritance; "has-a" → composition',
        'Deep inheritance = rigid; composition = flexible',
      ],
      tags: ['oop', 'composition', 'inheritance', 'design-principles', 'has-a'],
      concepts: ['py-class-instance-distinction', 'py-super-call'],
    },
{
      id: 'pcpp-compose-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_OOP_ADVANCED,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Model a `Car` using composition. Create an `Engine` class with `start()` and `stop()` methods. The `Car` class should HAS-A Engine (not inherit from it) and delegate `start()` and `stop()` to the engine.',
      starterCode: `# Define an Engine(horsepower) class with:
#   - a 'running' flag
#   - start() → sets running=True, returns f"Engine ({horsepower}hp) started"
#   - stop()  → sets running=False, returns "Engine stopped"
#
# Define a Car(make, engine) that HAS-A Engine and delegates start()/stop() to it


# Create an Engine(150) and a Car("Toyota", engine); print start() and stop()
`,
      testCases: [
        { input: 'Car("Toyota", Engine(150)).start()', expectedOutput: 'Engine (150hp) started', description: 'Car delegates start to Engine' },
      ],
      solution: `class Engine:
    def __init__(self, horsepower):
        self.horsepower = horsepower
        self.running = False

    def start(self):
        self.running = True
        return f"Engine ({self.horsepower}hp) started"

    def stop(self):
        self.running = False
        return "Engine stopped"

class Car:
    def __init__(self, make, engine):
        self.make = make
        self.engine = engine

    def start(self):
        return self.engine.start()

    def stop(self):
        return self.engine.stop()

engine = Engine(150)
car = Car("Toyota", engine)
print(car.start())
print(car.stop())`,
      explanation: '`Car` holds a reference to an `Engine` instance. Instead of inheriting engine behaviour, `Car` delegates to it. You could swap the engine for a different `Engine` instance with different horsepower without changing `Car` at all. This is the core benefit of composition over inheritance.',
      hints: [
        'Store engine as `self.engine = engine` in `__init__`',
        'Delegate with `return self.engine.start()`',
      ],
      tags: ['oop', 'composition', 'delegation', 'has-a', 'design-patterns'],
      concepts: ['py-class-instance-distinction'],
    },
{
      id: 'pcpp-builtin-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_OOP_ADVANCED,
      course: Course.BACKEND,
      question: 'Why might you inherit from a built-in class like `list` or `dict` in Python?',
      options: [
        { id: 'a', text: 'To make the built-in class faster', isCorrect: false },
        { id: 'b', text: 'To extend built-in behaviour with custom methods or modified default behaviour', isCorrect: true },
        { id: 'c', text: 'It is required before you can use built-in classes', isCorrect: false },
        { id: 'd', text: 'To prevent other code from using the built-in directly', isCorrect: false },
      ],
      explanation: 'Inheriting from built-ins gives you all their behaviour for free, then you add or override specific parts. For example, a `SortedList(list)` could override `append()` to maintain sorted order, or a `LowercaseDict(dict)` could override `__setitem__` to always lowercase keys. Use `super()` to call the original built-in behaviour.',
      hints: [
        'You get everything the built-in does, then customise',
        'Override specific methods; use `super()` for the rest',
      ],
      tags: ['oop', 'inheritance', 'built-in', 'customisation', 'list', 'dict'],
      concepts: ['py-class-instance-distinction', 'py-super-call', 'py-dict-key-hashability'],
    },
{
      id: 'pcpp-builtin-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_OOP_ADVANCED,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Create a `CountedList` class that inherits from `list`. It should track how many times `append()` has been called. Add a `append_count` property. Override `append()` to increment the counter.',
      starterCode: `# Define CountedList(list) that tracks how many times append() has been called
#   - Override append() to increment a counter, then call super().append()
#   - Expose the counter through an append_count property


# Append 1, 2, 3; print the list and print append_count (should be 3)
`,
      testCases: [
        { input: '', expectedOutput: '[1, 2, 3]\n3', description: 'Should show list contents and count of 3 appends' },
      ],
      solution: `class CountedList(list):
    def __init__(self):
        super().__init__()
        self._append_count = 0

    def append(self, item):
        self._append_count += 1
        super().append(item)

    @property
    def append_count(self):
        return self._append_count

cl = CountedList()
cl.append(1)
cl.append(2)
cl.append(3)
print(cl)
print(cl.append_count)`,
      explanation: '`super().__init__()` initialises the underlying list. Overriding `append()` lets us intercept every append call to increment the counter, then `super().append(item)` does the actual list operation. The class inherits ALL other list methods (`pop`, `sort`, `len`, etc.) without needing to implement them.',
      hints: [
        'Call `super().append(item)` to actually add the item to the list',
        'Increment `_append_count` before or after the super() call',
      ],
      tags: ['oop', 'inheritance', 'built-in', 'list', 'override', 'super'],
      concepts: ['py-class-instance-distinction', 'py-super-call'],
    },
{
      id: 'pcpp-abc-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_OOP_ADVANCED,
      course: Course.BACKEND,
      question: 'What is an abstract class in Python, and how do you create one?',
      options: [
        { id: 'a', text: 'A class with no methods — used purely for storing data', isCorrect: false },
        { id: 'b', text: 'A class that cannot be instantiated directly and defines abstract methods that subclasses must implement, using `ABC` from `abc`', isCorrect: true },
        { id: 'c', text: 'A class that is defined but not yet assigned to a variable', isCorrect: false },
        { id: 'd', text: 'A class where all methods are private', isCorrect: false },
      ],
      explanation: 'Abstract classes define interfaces — methods that subclasses MUST implement. Use `from abc import ABC, abstractmethod`. Inherit from `ABC` and decorate methods with `@abstractmethod`. Trying to instantiate an abstract class raises `TypeError`. They enforce contracts in class hierarchies without implementing the behaviour themselves.',
      hints: [
        '`from abc import ABC, abstractmethod`',
        'Attempting to instantiate an abstract class raises `TypeError`',
      ],
      tags: ['oop', 'abstract-class', 'ABC', 'abstractmethod', 'interface'],
      concepts: ['py-class-instance-distinction', 'py-abstract-method'],
    },
{
      id: 'pcpp-abc-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_OOP_ADVANCED,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Create an abstract `Shape` class with abstract methods `area()` and `perimeter()`. Then implement `Circle` and `Rectangle` subclasses. Use `math.pi` for the circle.',
      starterCode: `# Define an abstract Shape (using ABC) with abstractmethods area() and perimeter()
# Define Circle(radius) and Rectangle(width, height) implementing both
# Use math.pi for the circle


# Create Circle(5) and Rectangle(4, 6); print area/perimeter of each
# Round circle results to 2 decimals
`,
      testCases: [
        { input: 'round(Circle(5).area(), 2)', expectedOutput: '78.54', description: 'Circle area = π×r²' },
        { input: 'Rectangle(4, 6).area()', expectedOutput: '24', description: 'Rectangle area = w×h' },
        { input: 'Rectangle(4, 6).perimeter()', expectedOutput: '20', description: 'Rectangle perimeter = 2(w+h)' },
      ],
      solution: `from abc import ABC, abstractmethod
import math

class Shape(ABC):
    @abstractmethod
    def area(self):
        pass

    @abstractmethod
    def perimeter(self):
        pass

class Circle(Shape):
    def __init__(self, radius):
        self.radius = radius

    def area(self):
        return math.pi * self.radius ** 2

    def perimeter(self):
        return 2 * math.pi * self.radius

class Rectangle(Shape):
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height

    def perimeter(self):
        return 2 * (self.width + self.height)

c = Circle(5)
r = Rectangle(4, 6)
print(round(c.area(), 2))
print(round(c.perimeter(), 2))
print(r.area())
print(r.perimeter())`,
      explanation: 'Both `Circle` and `Rectangle` must implement ALL abstract methods or Python raises `TypeError` at instantiation. The abstract class acts as a contract — any `Shape` subclass guarantees it has `area()` and `perimeter()`. This enables polymorphic code like `for shape in shapes: print(shape.area())`.',
      hints: [
        'Circle area = `math.pi * r**2`, perimeter = `2 * math.pi * r`',
        'Rectangle area = `w * h`, perimeter = `2 * (w + h)`',
      ],
      tags: ['oop', 'ABC', 'abstractmethod', 'polymorphism', 'geometry'],
      concepts: ['py-class-instance-distinction', 'py-abstract-method'],
    },
{
      id: 'pcpp-copy-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_OOP_ADVANCED,
      course: Course.BACKEND,
      question: 'What is the difference between a shallow copy and a deep copy?',
      options: [
        { id: 'a', text: 'Shallow copy is faster; deep copy is more accurate', isCorrect: false },
        { id: 'b', text: 'Shallow copy copies the outer container but keeps references to nested objects; deep copy recursively copies everything', isCorrect: true },
        { id: 'c', text: 'Shallow copy works on lists only; deep copy works on all types', isCorrect: false },
        { id: 'd', text: 'They are identical for simple objects; different only for classes', isCorrect: false },
      ],
      explanation: 'A shallow copy (`copy.copy()` or `list[:]`) creates a new container but the nested objects are still shared references. Changing a nested object in the copy also changes it in the original. A deep copy (`copy.deepcopy()`) recursively copies everything — the copy is completely independent. Use deep copy when you need true isolation.',
      hints: [
        'Shallow = new container, same nested objects; Deep = everything new',
        '`import copy; copy.deepcopy(obj)` for a full independent clone',
      ],
      tags: ['copy', 'shallow-copy', 'deep-copy', 'references', 'copy-module'],
      concepts: ['py-list-aliasing'],
    },
{
      id: 'pcpp-copy-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_OOP_ADVANCED,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Start with a nested list `original = [[1, 2, 3], [4, 5, 6]]`. Using the `copy` module, make TWO copies: a SHALLOW one called `shallow` (new outer list, but inner lists are shared references) and a DEEP one called `deep` (everything recursively duplicated). Mutate a nested element in each: set `shallow[0][0]` to `99` and `deep[1][0]` to `88`. Then print four labelled lines in this order: `"Original after shallow modify: "` + `original`, then the same label `"Original after deep modify: "` + `original`, then `"Shallow copy: "` + `shallow`, then `"Deep copy: "` + `deep`. The output must show that the shallow mutation bled into `original` while the deep mutation did NOT.',
      starterCode: `# Import copy; start with original = [[1, 2, 3], [4, 5, 6]]
# Make a shallow copy and a deep copy


# Mutate shallow[0][0] = 99 and deep[1][0] = 88
# Print the four labelled lines in the order listed in the question
`,
      testCases: [
        { input: '', expectedOutput: 'Original after shallow modify: [[99, 2, 3], [4, 5, 6]]\nOriginal after deep modify: [[99, 2, 3], [4, 5, 6]]\nShallow copy: [[99, 2, 3], [4, 5, 6]]\nDeep copy: [[1, 2, 3], [88, 5, 6]]', description: 'Shallow modification affects original; deep does not' },
      ],
      solution: `import copy

original = [[1, 2, 3], [4, 5, 6]]

shallow = copy.copy(original)
deep = copy.deepcopy(original)

shallow[0][0] = 99
deep[1][0] = 88

print("Original after shallow modify:", original)
print("Original after deep modify:", original)
print("Shallow copy:", shallow)
print("Deep copy:", deep)`,
      explanation: 'Shallow copy creates a new outer list but the inner lists are shared. `shallow[0]` and `original[0]` point to the same list object — modifying one changes both. Deep copy creates entirely independent copies — `deep[1]` is a separate list object, so modifying it has no effect on `original`.',
      hints: [
        'The shallow copy shares inner lists — they\'re the same objects in memory',
        'Deep copy creates new objects all the way down',
      ],
      tags: ['copy', 'shallow-copy', 'deep-copy', 'nested-lists', 'references'],
      concepts: ['py-list-aliasing'],
    },
{
      id: 'pcpp-prop-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_OOP_ADVANCED,
      course: Course.BACKEND,
      question: 'How do you create a read-write property with validation in Python?',
      options: [
        { id: 'a', text: 'Use `@property` for getter and `@attr.setter` for the setter decorator', isCorrect: false },
        { id: 'b', text: 'Use `@property` for the getter, then `@attr_name.setter` for the setter', isCorrect: true },
        { id: 'c', text: 'Define both `get_attr()` and `set_attr()` methods', isCorrect: false },
        { id: 'd', text: 'Use `property(fget=..., fset=...)` called at class level', isCorrect: false },
      ],
      explanation: 'The property pattern: (1) define the getter with `@property`, (2) define the setter with `@property_name.setter`. The setter receives the new value and can validate it. Callers use simple attribute syntax (`obj.attr = val`) but your setter runs automatically. Use `@property_name.deleter` for deletion.',
      hints: [
        '`@property` → getter; `@name.setter` → setter',
        'The setter method must have the same name as the property',
      ],
      tags: ['oop', 'property', 'setter', 'getter', 'encapsulation'],
      concepts: ['py-class-instance-distinction'],
    },
{
      id: 'pcpp-prop-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_OOP_ADVANCED,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Build a `Person` class taking a `name` and `age` on construction. Expose `age` as a PROPERTY with a validating setter. Store the underlying value privately as `self._age`. The getter returns the private value. The setter must check that the incoming value is an `int` AND is between 0 and 150 inclusive; if not, raise `ValueError("Age must be between 0 and 150")`. The constructor must route assignment through the property setter (so validation runs on construction too — achieve this by assigning through the public property name rather than the private underscore name).\n\nDemonstrate: create a person named `"Alice"` aged 30 and bind it to `p`. Print `p.age` (expect `30`). Reassign `p.age` to 25 and print again (expect `25`). Try to reassign `p.age` to `-5` inside a `try/except ValueError as e` and print the caught error (expect `Age must be between 0 and 150`).',
      starterCode: `# Define Person(name, age) where age is a @property with a validating setter
# Private storage: self._age. Setter raises ValueError("Age must be between 0 and 150")
# __init__ should go through the setter: self.age = age


# Create Person("Alice", 30); print p.age
# Reassign p.age = 25; print p.age
# Try p.age = -5 in a try/except ValueError as e and print(e)
`,
      testCases: [
        { input: '', expectedOutput: '30\n25\nAge must be between 0 and 150', description: 'Property setter should validate' },
      ],
      solution: `class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    @property
    def age(self):
        return self._age

    @age.setter
    def age(self, value):
        if not isinstance(value, int) or not (0 <= value <= 150):
            raise ValueError("Age must be between 0 and 150")
        self._age = value

p = Person("Alice", 30)
print(p.age)

p.age = 25
print(p.age)

try:
    p.age = -5
except ValueError as e:
    print(e)`,
      explanation: 'Even in `__init__`, `self.age = age` calls the setter — so validation runs at construction time too. The private storage uses `_age` (single underscore) while the public interface is `age`. The setter uses `isinstance(value, int)` to check the type, then validates the range.',
      hints: [
        'Store in `self._age` (private), expose via `self.age` (property)',
        'The setter in `__init__` means validation runs immediately',
      ],
      tags: ['oop', 'property', 'setter', 'validation', 'encapsulation', 'isinstance'],
      concepts: ['py-class-instance-distinction'],
    },
{
      id: 'py-oop-3',
      type: QuestionType.CODING,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_OOP_ADVANCED,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      // eslint-disable-next-line no-template-curly-in-string
      question: 'Add __str__ and __repr__ dunder methods to a class "Product" with name (str) and price (float). __str__ should return "Product: {name} - ${price:.2f}", __repr__ should return "Product(\'{name}\', {price})".',
      starterCode: `# Define Product with __init__(self, name, price) storing both fields
# Implement __str__ and __repr__ matching the formats in the prompt
`,
      testCases: [
        {
          input: 'Product("Widget", 9.99)',
          expectedOutput: '__str__ and __repr__ methods',
          description: 'Should implement dunder methods',
        },
      ],
      solution: `class Product:\n    def __init__(self, name, price):\n        self.name = name\n        self.price = price\n\n    def __str__(self):\n        return f"Product: {self.name} - \${self.price:.2f}"\n\n    def __repr__(self):\n        return f"Product('{self.name}', {self.price})"`,
      explanation: '__str__ is for human-readable output (print(), str()). __repr__ is for unambiguous representation (debugging, REPL). Convention: __repr__ should ideally return valid Python to recreate the object.',
      hints: ['__str__ for display, __repr__ for debugging', '__repr__ should be unambiguous', ':.2f formats to 2 decimal places'],
      tags: ['dunder', 'str', 'repr', 'oop', 'python'],
      concepts: ['py-magic-methods', 'py-class-instance-distinction'],
    },
{
      id: 'py-oop-cloze-5',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_OOP_ADVANCED,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the decorator suffix that registers a setter for an existing @property.',
      template: `class Account:
      @property
      def balance(self):
          return self._balance
      @balance.___
      def balance(self, value):
          self._balance = value`,
      blanks: ['setter'],
      solution:
        'class Account:\n    @property\n    def balance(self):\n        return self._balance\n    @balance.setter\n    def balance(self, value):\n        self._balance = value',
      explanation:
        'After defining the @property, register the setter via @<property_name>.setter. Both methods share the property name; Python links them via the descriptor protocol.',
      hints: ['Six letters; same word as the noun for "one who sets".'],
      tags: ['oop', 'property', 'setter'],
      concepts: ['py-class-instance-distinction'],
    },
{
      id: 'py-oop-cloze-6',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_OOP_ADVANCED,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the import and decorator that mark a method as required-by-subclass.',
      template: `from abc import ABC, ___

class Shape(ABC):
    @___
    def area(self):
        ...`,
      blanks: ['abstractmethod', 'abstractmethod'],
      solution:
        'from abc import ABC, abstractmethod\n\nclass Shape(ABC):\n    @abstractmethod\n    def area(self):\n        ...',
      explanation:
        'ABC + @abstractmethod prevents instantiation of subclasses that don\'t override the abstract methods. Catches missing implementations at construction time.',
      hints: ['One word: "abstract" + "method".'],
      tags: ['oop', 'abc', 'abstract'],
      concepts: ['py-class-instance-distinction', 'py-abstract-method'],
    },
{
      id: 'py-oop-cloze-9',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_OOP_ADVANCED,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the magic class attribute that locks instance attributes to a fixed set.',
      template: `class Point:
      ___ = ("x", "y")
      def __init__(self, x, y):
          self.x = x
          self.y = y`,
      blanks: ['__slots__'],
      solution:
        'class Point:\n    __slots__ = ("x", "y")\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y',
      explanation:
        '__slots__ disables instance __dict__. Trades dynamic attribute addition for memory savings and locked-shape contracts. Inheritance/multiple inheritance with slots has subtle rules.',
      hints: ['Magic name; "slots" with double underscores on each side.'],
      tags: ['oop', '__slots__'],
      concepts: ['py-class-instance-distinction'],
    },
{
      id: 'py-oop-cloze-11',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_OOP_ADVANCED,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the call each subclass uses to delegate upward through the MRO so D().hello() prints D, B, C, A in order. The same identifier goes in all three blanks.',
      template: `class A:
    def hello(self):
        print("A")

class B(A):
    def hello(self):
        print("B")
        ___().hello()

class C(A):
    def hello(self):
        print("C")
        ___().hello()

class D(B, C):
    def hello(self):
        print("D")
        ___().hello()

D().hello()`,
      blanks: ['super', 'super', 'super'],
      solution:
        'class A:\n    def hello(self):\n        print("A")\n\nclass B(A):\n    def hello(self):\n        print("B")\n        super().hello()\n\nclass C(A):\n    def hello(self):\n        print("C")\n        super().hello()\n\nclass D(B, C):\n    def hello(self):\n        print("D")\n        super().hello()\n\nD().hello()',
      explanation:
        'super() resolves against the MRO of the *instance*, not the literal parent. For D(B, C) the MRO is D → B → C → A → object, so B.hello\'s super() lands on C (not A) when invoked through D. Writing A.hello(self) instead would skip C entirely. The whole chain only works because every link delegates via super().',
      hints: ['Five letters; the call that walks the MRO from the current frame.'],
      tags: ['oop', 'super', 'mro', 'diamond'],
      concepts: ['py-class-instance-distinction', 'py-super-call', 'py-mro-resolution'],
    },
{
      id: 'py-oop-parsons-4',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_OOP_ADVANCED,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Add a setter to a @property that validates the value is non-negative.',
      correctOrder: [
        'class Account:',
        '    def __init__(self, balance):',
        '        self._balance = balance',
        '    @property',
        '    def balance(self):',
        '        return self._balance',
        '    @balance.setter',
        '    def balance(self, value):',
        '        if value < 0:',
        '            raise ValueError',
        '        self._balance = value',
      ],
      distractorLines: [
        '    @property.setter',
        '    @balance.set',
      ],
      solution:
        'class Account:\n    def __init__(self, balance):\n        self._balance = balance\n    @property\n    def balance(self):\n        return self._balance\n    @balance.setter\n    def balance(self, value):\n        if value < 0:\n            raise ValueError\n        self._balance = value',
      explanation:
        'After defining @property, the setter is registered with @<property_name>.setter. Both methods have the SAME name (balance) — Python links them via the descriptor protocol. Use a private _balance to store the actual value to avoid infinite recursion.',
      hints: ['Setter decorator: @<property_name>.setter — same name as the property.'],
      tags: ['oop', 'property', 'setter'],
      concepts: ['py-class-instance-distinction'],
    },
{
      id: 'py-oop-parsons-6',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_OOP_ADVANCED,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Build an abstract base class with @abstractmethod that subclasses must implement.',
      correctOrder: [
        'from abc import ABC, abstractmethod',
        '',
        'class Shape(ABC):',
        '    @abstractmethod',
        '    def area(self):',
        '        ...',
        '',
        'class Square(Shape):',
        '    def __init__(self, side):',
        '        self.side = side',
        '    def area(self):',
        '        return self.side ** 2',
      ],
      distractorLines: [
        'class Shape:',
        '    def area(self):',
        '        raise NotImplementedError',
      ],
      solution:
        'from abc import ABC, abstractmethod\n\nclass Shape(ABC):\n    @abstractmethod\n    def area(self):\n        ...\n\nclass Square(Shape):\n    def __init__(self, side):\n        self.side = side\n    def area(self):\n        return self.side ** 2',
      explanation:
        'ABC + @abstractmethod prevents instantiation of subclasses that don\'t implement the abstract methods. The NotImplementedError pattern only catches the call — Shape() can still be instantiated. ABC enforces it at construction time.',
      hints: ['Inherit from ABC and decorate methods with @abstractmethod.'],
      tags: ['oop', 'abc', 'abstractmethod'],
      concepts: ['py-class-instance-distinction', 'py-abstract-method'],
    },
{
      id: 'py-oop-predict-2',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_OOP_ADVANCED,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `class A:
    def hi(self):
        print("A")

class B(A):
    def hi(self):
        print("B")
        super().hi()

class C(A):
    def hi(self):
        print("C")
        super().hi()

class D(B, C):
    def hi(self):
        print("D")
        super().hi()

D().hi()`,
      expectedOutput: `D
B
C
A`,
      explanation:
        'Python\'s C3 MRO for D(B, C) is D → B → C → A → object. super() at each step delegates to the NEXT class in the MRO, not directly to the literal parent. So C runs even though D doesn\'t inherit from C directly.',
      hints: ['super() follows MRO, not the inheritance tree directly.'],
      tags: ['oop', 'mro', 'diamond'],
      concepts: ['py-class-instance-distinction', 'py-mro-resolution'],
    },
{
      id: 'py-oop-predict-8',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_OOP_ADVANCED,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `class A:
    def __init__(self):
        self.greet()
    def greet(self):
        print("A greet")

class B(A):
    def greet(self):
        print("B greet")

B()`,
      expectedOutput: `B greet`,
      explanation:
        'Method dispatch is dynamic — when A.__init__ calls self.greet(), self is a B instance, so B.greet runs. This is "template method" pattern. The lookup uses the actual instance type, not the class where __init__ was defined.',
      hints: ['Method dispatch follows the instance, not the class where it\'s called from.'],
      tags: ['oop', 'dynamic-dispatch'],
      concepts: ['py-class-instance-distinction'],
    },
{
      id: 'py-oop-predict-9',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_OOP_ADVANCED,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `class P:
    __slots__ = ("x",)
    def __init__(self, x):
        self.x = x

p = P(1)
try:
    p.y = 2
except AttributeError:
    print("blocked")`,
      expectedOutput: `blocked`,
      explanation:
        '__slots__ disables __dict__ for instances. Assigning a non-slot attribute raises AttributeError. This is one of the main reasons to use __slots__ (besides memory): catch typos and locked-shape contracts.',
      hints: ['__slots__ disables __dict__; non-slot attrs are forbidden.'],
      tags: ['oop', '__slots__', 'attribute-error'],
      concepts: ['py-class-instance-distinction'],
    },
{
      id: 'py-oopadv-beg-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_OOP_ADVANCED,
      course: Course.BACKEND,
      question: 'What does it mean to "override" a method in a subclass?',
      options: [
        { id: 'a', text: 'The subclass redefines a method the parent already has, so its instances use the new version.', isCorrect: true },
        { id: 'b', text: 'The subclass copies the parent method into itself without changing anything about it.', isCorrect: false },
        { id: 'c', text: 'The subclass deletes the parent method so neither version can be called anymore.', isCorrect: false },
        { id: 'd', text: 'The subclass renames the method so the parent and child versions never collide.', isCorrect: false },
      ],
      explanation: 'Overriding means a subclass defines a method with the same name as one in its parent. For instances of the subclass, the new version wins. The parent version is still reachable via `super()` if you want to extend rather than fully replace it.',
      tags: ['oop', 'override', 'inheritance', 'beginner'],
      concepts: ['py-class-instance-distinction'],
    },
{
      id: 'py-oopadv-beg-2',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_OOP_ADVANCED,
      course: Course.BACKEND,
      question: 'A class exposes `age` with `@property` plus a matching `@age.setter`. What does that let callers do?',
      options: [
        { id: 'a', text: 'Read and assign `obj.age` with plain syntax while the setter validates the value behind the scenes.', isCorrect: true },
        { id: 'b', text: 'Read `obj.age` only; any attempt to assign a new value raises an error immediately.', isCorrect: false },
        { id: 'c', text: 'Call `obj.age()` with parentheses, because a property is really just a normal method.', isCorrect: false },
        { id: 'd', text: 'Share one `age` value across every instance of the class without any per-object copy.', isCorrect: false },
      ],
      explanation: 'A getter (`@property`) plus a setter (`@age.setter`) makes `age` a read-write attribute. Callers write `obj.age = 30` with ordinary syntax, but the setter method runs underneath — the usual place to validate the incoming value before storing it.',
      tags: ['oop', 'property', 'setter', 'beginner'],
      concepts: ['py-class-instance-distinction'],
    },
{
      id: 'py-oopadv-beg-3',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_OOP_ADVANCED,
      course: Course.BACKEND,
      question: 'A `Car` holds an `Engine` object and calls its methods. Is this composition or inheritance?',
      options: [
        { id: 'a', text: 'Composition — the car HAS-A engine, building behaviour by holding another object inside it.', isCorrect: true },
        { id: 'b', text: 'Inheritance — the car IS-A engine, gaining its behaviour by subclassing the engine class.', isCorrect: false },
        { id: 'c', text: 'Neither — holding another object is just a plain variable and not a design choice.', isCorrect: false },
        { id: 'd', text: 'Both equally — composition and inheritance always describe the very same relationship.', isCorrect: false },
      ],
      explanation: 'Holding another object and delegating to it is composition — a HAS-A relationship (a car HAS-A engine). Inheritance models IS-A (a car IS-A vehicle). "Prefer composition over inheritance" favours holding collaborators because you can swap them out without reworking a class hierarchy.',
      tags: ['oop', 'composition', 'inheritance', 'beginner'],
      concepts: ['py-class-instance-distinction'],
    },
{
      id: 'py-oopadv-beg-4',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_OOP_ADVANCED,
      course: Course.BACKEND,
      question: 'What is the purpose of marking a method with `@abstractmethod` on an `ABC` base class?',
      options: [
        { id: 'a', text: 'It forces every concrete subclass to provide its own implementation of that method.', isCorrect: true },
        { id: 'b', text: 'It runs the method automatically the moment any subclass is first imported.', isCorrect: false },
        { id: 'c', text: 'It makes the method private so subclasses are unable to see or override it.', isCorrect: false },
        { id: 'd', text: 'It caches the method result so the body only executes a single time per class.', isCorrect: false },
      ],
      explanation: 'An abstract method declares "subclasses must implement this". Trying to instantiate a subclass that has not overridden every `@abstractmethod` raises `TypeError`. ABCs use this to enforce an interface contract at construction time rather than failing later when the method is finally called.',
      tags: ['oop', 'abc', 'abstractmethod', 'beginner'],
      concepts: ['py-class-instance-distinction', 'py-abstract-method'],
    },
{
      id: 'py-oopadv-beg-5',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_OOP_ADVANCED,
      course: Course.BACKEND,
      question: 'What is the key difference between a shallow copy and a deep copy of a nested list?',
      options: [
        { id: 'a', text: 'A shallow copy shares the inner lists; a deep copy duplicates every level independently.', isCorrect: true },
        { id: 'b', text: 'A shallow copy duplicates every level; a deep copy only duplicates the outer list once.', isCorrect: false },
        { id: 'c', text: 'They are identical for lists and differ only when copying plain integer values.', isCorrect: false },
        { id: 'd', text: 'A shallow copy is always slower because it must scan each nested element twice.', isCorrect: false },
      ],
      explanation: 'A shallow copy (`copy.copy` or `list[:]`) makes a new outer container but the nested objects are still shared references — mutating an inner list shows up in both. A deep copy (`copy.deepcopy`) recursively rebuilds every level, so the result is fully independent.',
      tags: ['copy', 'shallow-copy', 'deep-copy', 'beginner'],
      concepts: ['py-list-aliasing'],
    },
{
      id: 'py-dec-5',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_OOP_ADVANCED,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Use @property to create a class "Circle" with a private _radius attribute. Add a radius property with getter and setter (setter validates radius > 0). Add a read-only area property.',
      starterCode: `import math\n\nclass Circle:\n`,
      testCases: [{ input: 'Circle class', expectedOutput: '@property getter, @radius.setter, area property', description: 'Should use property decorator' }],
      solution: `import math\n\nclass Circle:\n    def __init__(self, radius):\n        self.radius = radius\n\n    @property\n    def radius(self):\n        return self._radius\n\n    @radius.setter\n    def radius(self, value):\n        if value <= 0:\n            raise ValueError("Radius must be positive")\n        self._radius = value\n\n    @property\n    def area(self):\n        return math.pi * self._radius ** 2`,
      explanation: '@property makes a method act like an attribute (circle.radius not circle.radius()). @name.setter adds write support with validation. area is read-only (no setter). The actual data is stored in _radius (convention for private).',
      hints: ['@property for getter', '@name.setter for setter with validation', 'No setter = read-only property'],
      tags: ['property', 'setter', 'getter', 'oop', 'python'],
      concepts: ['py-class-instance-distinction'],
    },
];
