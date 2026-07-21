import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const py_oop_questions: Question[] = [
{
      id: 'py-oop-beg-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_OOP,
      course: Course.BACKEND,
      question: 'What is a class in Python?',
      options: [
        { id: 'a', text: 'A blueprint that defines the structure (attributes) and behavior (methods) for objects you create from it.', isCorrect: true },
        { id: 'b', text: 'A type of variable that can only hold numbers.', isCorrect: false },
        { id: 'c', text: 'A built-in function that converts data types.', isCorrect: false },
        { id: 'd', text: 'A loop construct similar to `for` and `while`.', isCorrect: false },
      ],
      explanation: 'A class is a template — `class Dog: ...` defines what every Dog has and can do. Each call like `Dog("Rex")` creates an instance from that template. The class itself is not the data; the instances are.',
      tags: ['class', 'oop', 'beginner', 'python'],
      concepts: ['py-class-instance-distinction'],
    },
{
      id: 'py-oop-beg-2',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_OOP,
      course: Course.BACKEND,
      question: 'In a method definition like `def __init__(self, name):`, what does `self` refer to?',
      options: [
        { id: 'a', text: 'The instance currently being acted on — Python passes it automatically when you call `obj.method()`.', isCorrect: true },
        { id: 'b', text: 'The class itself, not the instance.', isCorrect: false },
        { id: 'c', text: 'A reserved keyword for inheritance.', isCorrect: false },
        { id: 'd', text: 'An optional placeholder you can omit.', isCorrect: false },
      ],
      explanation: '`self` is the convention name for the first parameter of an instance method. When you call `dog.bark()`, Python rewrites it as `Dog.bark(dog)` and passes `dog` as `self`. The name `self` is not a keyword — it is just a strongly-followed convention.',
      tags: ['self', 'method', 'instance', 'beginner', 'python'],
      concepts: ['py-class-instance-distinction'],
    },
{
      id: 'py-oop-beg-3',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_OOP,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Define a class `Person` whose `__init__` takes `name` and stores it on the instance as `self.name`. Then create `p = Person("Ada")` and print `p.name`.',
      starterCode: `# Define Person with __init__(self, name) storing self.name
# Then create p = Person("Ada") and print p.name
`,
      testCases: [
        {
          input: 'Person("Ada").name',
          expectedOutput: 'Ada',
          description: 'Instance has name attribute set from constructor',
        },
      ],
      solution: `class Person:\n    def __init__(self, name):\n        self.name = name\n\np = Person("Ada")\nprint(p.name)`,
      explanation: '`__init__` runs every time you create an instance. The first parameter is always `self` (the instance being initialised), and assignments like `self.name = name` create attributes on that instance. Reading `p.name` later just looks them up.',
      hints: ['Use `class Person:` then `def __init__(self, name):`', 'Inside __init__, write `self.name = name`', 'Create the instance with `Person("Ada")` and print `p.name`'],
      tieredHints: {
        apiSignature: 'def __init__(self, name) -> None',
        skeleton: `class Person:
    def ____(self, name):
        self.____ = ____

p = Person("Ada")
print(p.____)`,
      },
      tags: ['class', 'init', 'self', 'attribute', 'beginner', 'python'],
      concepts: ['py-class-instance-distinction'],
    },
{
      id: 'py-oop-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_OOP,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the call that delegates initialization to the parent class.',
      template: `class Dog(Animal):
      def __init__(self, name, breed):
          ___().__init__(name)
          self.breed = breed`,
      blanks: ['super'],
      solution:
        'class Dog(Animal):\n    def __init__(self, name, breed):\n        super().__init__(name)\n        self.breed = breed',
      explanation:
        'super() returns a proxy that resolves attributes via the MRO. super().__init__(name) calls the next __init__ in the MRO, passing through args.',
      hints: ['Five letters; same word as "above" in Latin.'],
      tags: ['oop', 'super'],
      concepts: ['py-class-instance-distinction', 'py-super-call'],
    },
{
      id: 'py-oop-cloze-2',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_OOP,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the decorator that turns a method into one that receives the class as cls.',
      template: `class User:
      @___
      def from_dict(cls, d):
          return cls(d["name"])`,
      blanks: ['classmethod'],
      solution:
        'class User:\n    @classmethod\n    def from_dict(cls, d):\n        return cls(d["name"])',
      explanation:
        '@classmethod takes cls (not self). The first arg is the class itself — useful for alternative constructors that respect subclassing.',
      hints: ['Two-word concatenation: "class" + "method".'],
      tags: ['oop', 'classmethod'],
      concepts: ['py-class-instance-distinction'],
    },
{
      id: 'py-oop-cloze-3',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_OOP,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the decorator that turns a method into one that takes neither self nor cls.',
      template: `class Math:
      @___
      def add(a, b):
          return a + b`,
      blanks: ['staticmethod'],
      solution: 'class Math:\n    @staticmethod\n    def add(a, b):\n        return a + b',
      explanation:
        '@staticmethod takes no implicit first arg. Useful for utility functions that logically belong to the class but don\'t need instance or class state.',
      hints: ['Two-word concatenation: "static" + "method".'],
      tags: ['oop', 'staticmethod'],
      concepts: ['py-class-instance-distinction'],
    },
{
      id: 'py-oop-cloze-4',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_OOP,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the decorator that exposes price as an attribute (no parens needed at access).',
      template: `class Item:
      @___
      def price(self):
          return self.base + self.tax`,
      blanks: ['property'],
      solution:
        'class Item:\n    @property\n    def price(self):\n        return self.base + self.tax',
      explanation:
        '@property turns a method into a getter accessed as an attribute. item.price (no parens) calls the underlying method.',
      hints: ['Same word as the noun for "owned thing".'],
      tags: ['oop', 'property'],
      concepts: ['py-class-instance-distinction'],
    },
{
      id: 'py-oop-cloze-7',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_OOP,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the implicit first parameter of an instance method.',
      template: `class Dog:
      def bark(___):
          print("woof")`,
      blanks: ['self'],
      solution: 'class Dog:\n    def bark(self):\n        print("woof")',
      explanation:
        'self is the convention for the first parameter of an instance method — it receives the instance. The name is convention but very strongly entrenched; tools/IDEs assume it.',
      hints: ['Four letters; the conventional instance reference name.'],
      tags: ['oop', 'self'],
      concepts: ['py-class-instance-distinction'],
    },
{
      id: 'py-oop-cloze-8',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_OOP,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the builtin that checks if obj is an instance of cls (including subclasses).',
      template: `if ___(d, Animal):
      print("is animal")`,
      blanks: ['isinstance'],
      solution: 'if isinstance(d, Animal):\n    print("is animal")',
      explanation:
        'isinstance(obj, cls) returns True if obj is an instance of cls or any subclass. Prefer this over type(obj) == cls — type-equality misses subclasses.',
      hints: ['Single word; "is" + "instance".'],
      tags: ['oop', 'isinstance'],
      concepts: ['py-class-instance-distinction'],
    },
{
      id: 'pcpp-oop-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_OOP,
      course: Course.BACKEND,
      question: 'What is the difference between a class variable and an instance variable in Python?',
      options: [
        { id: 'a', text: 'They are identical — both store data in the same way', isCorrect: false },
        { id: 'b', text: 'Class variables are shared by all instances; instance variables are unique to each instance', isCorrect: true },
        { id: 'c', text: 'Class variables are defined inside `__init__`; instance variables are defined at the top of the class', isCorrect: false },
        { id: 'd', text: 'Instance variables cannot be changed after creation; class variables can', isCorrect: false },
      ],
      explanation: 'Class variables are defined in the class body (outside any method) and shared across all instances. Instance variables are set per-object, typically in `__init__`, using `self.`. If you change a class variable via the class (`Dog.count += 1`), all instances see the change. Changing via an instance creates a new instance variable shadowing the class one.',
      hints: [
        'Class variables live on the class; instance variables live on `self`',
        'Modifying a class variable through an instance creates a new instance variable',
      ],
      tags: ['oop', 'class-variables', 'instance-variables', 'classes'],
      concepts: ['py-class-instance-distinction'],
    },
{
      id: 'pcpp-oop-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_OOP,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Create a `Dog` class with a class variable `species = "Canis lupus"` and instance variables `name` and `age`. Add a method `bark()` that returns `"Woof! I am {name}"`. Create two dogs and show they share the class variable but have different instance variables.',
      starterCode: `# Define the Dog class with a class variable, __init__, and bark()


# Create two dogs (Rex age 3, Bella age 5) and print bark() for each,
# then print one dog's species and whether both share the same species
`,
      testCases: [
        { input: 'Dog("Rex", 3).bark()', expectedOutput: 'Woof! I am Rex', description: 'bark() should use instance name' },
        { input: 'Dog("Bella", 5).species', expectedOutput: 'Canis lupus', description: 'species should be shared class variable' },
      ],
      solution: `class Dog:
    species = "Canis lupus"

    def __init__(self, name, age):
        self.name = name
        self.age = age

    def bark(self):
        return f"Woof! I am {self.name}"

dog1 = Dog("Rex", 3)
dog2 = Dog("Bella", 5)

print(dog1.bark())
print(dog2.bark())
print(dog1.species)
print(dog1.species == dog2.species)`,
      explanation: 'Class variables (`species`) are defined in the class body. Instance variables (`self.name`, `self.age`) are set in `__init__`. All instances share the same `species` value. Methods access instance data through `self`.',
      hints: [
        'Set instance variables with `self.name = name` in `__init__`',
        'Access instance data in methods with `self.name`',
      ],
      tieredHints: {
        apiSignature: 'def __init__(self, name, age) -> None',
        skeleton: `class Dog:
    ____ = "Canis lupus"

    def __init__(self, name, age):
        self.____ = ____
        self.____ = ____

    def ____(self):
        return f"Woof! I am {self.____}"

dog1 = Dog("Rex", 3)
dog2 = Dog("Bella", 5)

print(dog1.____())
print(dog2.____())
print(dog1.____)
print(dog1.species ____ dog2.____)`,
      },
      tags: ['oop', 'class-variables', 'instance-variables', '__init__', 'self'],
      concepts: ['py-class-instance-distinction', 'py-modules-imports'],
    },
{
      id: 'py-gap-oop-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_OOP,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Create a class called `Dog` with `name` and `breed` attributes set in the `__init__` method. Add a `bark()` method that returns the string "Woof!" (exactly — one "o" and one "f" doubled). Then create an instance of `Dog` with name "Rex" and breed "Labrador", and `print()` the result of calling its `bark()` method.',
      starterCode: `# Define the Dog class with __init__ and bark methods


# Create an instance, call bark(), and print the result
`,
      testCases: [
        {
          input: 'Dog("Rex", "Labrador").bark()',
          expectedOutput: 'Woof!',
          description: 'bark() should return "Woof!"',
        },
        {
          input: 'Dog("Rex", "Labrador").name',
          expectedOutput: 'Rex',
          description: 'Should store the name attribute',
        },
      ],
      solution: `class Dog:
    def __init__(self, name, breed):
        self.name = name
        self.breed = breed

    def bark(self):
        return "Woof!"

my_dog = Dog("Rex", "Labrador")
print(my_dog.bark())   # Woof!
print(my_dog.name)     # Rex
print(my_dog.breed)    # Labrador`,
      explanation: '`__init__` is the constructor method — it runs automatically when you create a new object. `self` refers to the instance being created and lets you attach attributes to it. Methods are functions defined inside a class that take `self` as their first parameter, giving them access to the instance\'s data.',
      hints: [
        '`__init__` takes `self` plus any parameters you want to pass when creating an object',
        'Use `self.name = name` to store attributes on the instance',
        'Methods like `bark` also take `self` as the first parameter',
      ],
      tieredHints: {
        apiSignature: 'def bark(self) -> str',
        skeleton: `class Dog:
    def __init__(self, ____, ____):
        self.____ = name
        self.____ = breed

    def ____(self):
        return "____"

my_dog = Dog("Rex", "Labrador")
print(my_dog.____())
print(my_dog.____)
print(my_dog.____)`,
      },
      tags: ['oop', 'class', '__init__', 'methods', 'basics'],
      concepts: ['py-class-instance-distinction', 'py-modules-imports'],
    },
{
      id: 'py-oop-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_OOP,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Create a class "BankAccount" with __init__ taking owner (str) and balance (float, default 0). Add methods deposit(amount) and withdraw(amount) that raise ValueError if amount is negative or withdrawal exceeds balance.',
      starterCode: `class BankAccount:\n`,
      testCases: [
        {
          input: 'BankAccount operations',
          expectedOutput: 'class with __init__, deposit, withdraw',
          description: 'Should create BankAccount with validation',
        },
      ],
      solution: `class BankAccount:\n    def __init__(self, owner, balance=0):\n        self.owner = owner\n        self.balance = balance\n\n    def deposit(self, amount):\n        if amount < 0:\n            raise ValueError("Amount must be positive")\n        self.balance += amount\n\n    def withdraw(self, amount):\n        if amount < 0:\n            raise ValueError("Amount must be positive")\n        if amount > self.balance:\n            raise ValueError("Insufficient funds")\n        self.balance -= amount`,
      explanation: '__init__ is the constructor. self refers to the instance. Methods modify self.balance. Raising ValueError for invalid operations is standard Python practice for input validation.',
      hints: ['__init__(self, ...) is the constructor', 'Use self.attribute for instance variables', 'raise ValueError("message") for validation'],
      tieredHints: {
        apiSignature: 'raise ValueError(message: str)',
        skeleton: `class BankAccount:
    def __init__(self, owner, balance=0):
        self.____ = owner
        self.____ = balance

    def deposit(self, amount):
        if amount ____ 0:
            raise ____("____")
        self.balance ____ amount

    def withdraw(self, amount):
        if amount ____ 0:
            raise ____("____")
        if amount ____ self.____:
            raise ____("____")
        self.balance ____ amount`,
      },
      tags: ['class', 'oop', 'init', 'validation', 'python'],
      concepts: ['py-class-instance-distinction'],
    },
{
      id: 'py-oop-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_OOP,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Create a class "Animal" with name and sound attributes. Create a subclass "Dog" that inherits from Animal and sets sound to "Woof" by default. Add a speak() method that returns "{name} says {sound}!".',
      starterCode: `class Animal:\n`,
      testCases: [
        {
          input: 'Dog("Rex").speak()',
          expectedOutput: 'class inheritance with super().__init__',
          description: 'Should implement inheritance',
        },
      ],
      solution: `class Animal:\n    def __init__(self, name, sound):\n        self.name = name\n        self.sound = sound\n\n    def speak(self):\n        return f"{self.name} says {self.sound}!"\n\nclass Dog(Animal):\n    def __init__(self, name):\n        super().__init__(name, "Woof")`,
      explanation: 'class Dog(Animal) inherits from Animal. super().__init__() calls the parent constructor. Dog gets speak() from Animal without redefining it. This is the core of OOP — code reuse through inheritance.',
      hints: ['class Child(Parent) for inheritance', 'super().__init__() calls parent constructor', 'Child inherits all parent methods'],
      tieredHints: {
        apiSignature: 'super().__init__(*args) -> None',
        skeleton: `class Animal:
    def __init__(self, name, sound):
        self.____ = name
        self.____ = sound

    def ____(self):
        return f"{self.____} says {self.____}!"

class Dog(____):
    def __init__(self, name):
        ____().____(name, "____")`,
      },
      tags: ['inheritance', 'super', 'oop', 'python'],
      concepts: ['py-super-call', 'py-class-instance-distinction'],
    },
{
      id: 'py-oop-cloze-10',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_OOP,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the syntax that declares Dog as a subclass of Animal.',
      template: `class Dog___Animal___:
      pass`,
      blanks: ['(', ')'],
      solution: 'class Dog(Animal):\n    pass',
      explanation:
        'Inheritance is declared by listing parent classes in parens after the class name. Multiple inheritance: class D(B, C). Empty parens or no parens means inherit from object (the default).',
      hints: ['Same punctuation pair as for function args.'],
      tags: ['oop', 'inheritance', 'syntax'],
      concepts: ['py-class-instance-distinction', 'py-super-call'],
    },
{
      id: 'py-oop-parsons-1',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_OOP,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Define Dog(Animal) so __init__ initializes both name (via super) and breed (locally).',
      correctOrder: [
        'class Animal:',
        '    def __init__(self, name):',
        '        self.name = name',
        '',
        'class Dog(Animal):',
        '    def __init__(self, name, breed):',
        '        super().__init__(name)',
        '        self.breed = breed',
      ],
      distractorLines: [
        '        Animal.__init__(name)',
        '        super().__init__()',
        '        self.name = name',
      ],
      solution:
        'class Animal:\n    def __init__(self, name):\n        self.name = name\n\nclass Dog(Animal):\n    def __init__(self, name, breed):\n        super().__init__(name)\n        self.breed = breed',
      explanation:
        'super().__init__(name) calls the parent\'s __init__ with name. Animal.__init__(name) without self would pass name as self — wrong. Setting self.name = name in Dog skips the parent\'s init logic (fine here, but breaks once parents do more setup).',
      hints: ['super() handles the lookup automatically; pass through the args.'],
      tags: ['oop', 'inheritance', 'super'],
      concepts: ['py-class-instance-distinction', 'py-super-call'],
    },
{
      id: 'py-oop-parsons-2',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_OOP,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Use @classmethod to define an alternative constructor User.from_dict.',
      correctOrder: [
        'class User:',
        '    def __init__(self, name, age):',
        '        self.name = name',
        '        self.age = age',
        '    @classmethod',
        '    def from_dict(cls, d):',
        '        return cls(d["name"], d["age"])',
      ],
      distractorLines: [
        '    @staticmethod',
        '    def from_dict(d):',
        '        return User(d["name"], d["age"])',
      ],
      solution:
        'class User:\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age\n    @classmethod\n    def from_dict(cls, d):\n        return cls(d["name"], d["age"])',
      explanation:
        '@classmethod takes cls as first arg. cls is the class itself — useful for "alternative constructors" because subclasses get the right type. Hardcoding `User(...)` would always return a User, even when called on a subclass.',
      hints: ['@classmethod gets cls first; use cls(...) for subclass-correct construction.'],
      tags: ['oop', 'classmethod', 'alternative-constructor'],
      concepts: ['py-class-instance-distinction'],
    },
{
      id: 'py-oop-parsons-3',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_OOP,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Use @property to expose price as a computed attribute (with no setter).',
      correctOrder: [
        'class Item:',
        '    def __init__(self, base, tax):',
        '        self.base = base',
        '        self.tax = tax',
        '    @property',
        '    def price(self):',
        '        return self.base + self.tax',
      ],
      distractorLines: [
        '    def price(self):',
        '    @price.setter',
        '        return self.base + self.tax',
      ],
      solution:
        'class Item:\n    def __init__(self, base, tax):\n        self.base = base\n        self.tax = tax\n    @property\n    def price(self):\n        return self.base + self.tax',
      explanation:
        '@property exposes the method as an attribute — accessed without parens (item.price). Without @property, you\'d need item.price() with parens.',
      hints: ['@property → access without parens.'],
      tags: ['oop', 'property'],
      concepts: ['py-class-instance-distinction'],
    },
{
      id: 'py-oop-parsons-5',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_OOP,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Use @staticmethod for a helper that doesn\'t need self or cls.',
      correctOrder: [
        'class Math:',
        '    @staticmethod',
        '    def add(a, b):',
        '        return a + b',
        '',
        'print(Math.add(1, 2))',
      ],
      distractorLines: [
        '    @classmethod',
        '    def add(cls, a, b):',
        '    def add(self, a, b):',
      ],
      solution:
        'class Math:\n    @staticmethod\n    def add(a, b):\n        return a + b\n\nprint(Math.add(1, 2))',
      explanation:
        '@staticmethod takes neither self nor cls. Use it for helper functions that logically belong to the class\'s namespace but don\'t need instance or class state. classmethod always gets cls; instance methods always get self.',
      hints: ['No self, no cls — that\'s a static method.'],
      tags: ['oop', 'staticmethod'],
      concepts: ['py-class-instance-distinction'],
    },
{
      id: 'py-oop-parsons-8',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_OOP,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Define a class attribute count and increment it from each instance\'s __init__.',
      correctOrder: [
        'class Widget:',
        '    count = 0',
        '    def __init__(self):',
        '        Widget.count += 1',
        '',
        'Widget()',
        'Widget()',
        'print(Widget.count)',
      ],
      distractorLines: [
        '        self.count += 1',
        '        self.count = 0',
      ],
      solution:
        'class Widget:\n    count = 0\n    def __init__(self):\n        Widget.count += 1\n\nWidget()\nWidget()\nprint(Widget.count)',
      explanation:
        'self.count += 1 would CREATE an instance attribute on first read (shadowing the class attr) — and increment it on the instance, not the class. Reference Widget.count explicitly to mutate the shared class state.',
      hints: ['Class attribute → reference via the class name to share state.'],
      tags: ['oop', 'class-attribute', 'instance-attribute'],
      concepts: ['py-class-instance-distinction'],
    },
{
      id: 'py-oop-parsons-9',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_OOP,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Use isinstance to check inheritance against a base class.',
      correctOrder: [
        'class Animal:',
        '    pass',
        '',
        'class Dog(Animal):',
        '    pass',
        '',
        'd = Dog()',
        'print(isinstance(d, Animal))',
      ],
      distractorLines: [
        'print(type(d) == Animal)',
        'print(d is Animal)',
      ],
      solution:
        'class Animal:\n    pass\n\nclass Dog(Animal):\n    pass\n\nd = Dog()\nprint(isinstance(d, Animal))',
      explanation:
        'isinstance returns True if the object is an instance of the class OR ANY SUBCLASS. type(d) == Animal would be False because d is a Dog. `is Animal` checks identity — d is not the class itself.',
      hints: ['isinstance handles subclasses; type == only matches the exact class.'],
      tags: ['oop', 'isinstance', 'inheritance'],
      concepts: ['py-class-instance-distinction', 'py-super-call'],
    },
{
      id: 'py-oop-predict-1',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_OOP,
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

B().hi()`,
      expectedOutput: `B
A`,
      explanation:
        'B.hi prints "B" then calls super().hi() — which resolves to A.hi via the MRO, printing "A". Method override is dynamic; super delegates upward.',
      hints: ['super() walks up the MRO from the current class.'],
      tags: ['oop', 'super', 'override'],
      concepts: ['py-class-instance-distinction', 'py-super-call'],
    },
{
      id: 'py-oop-predict-3',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_OOP,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `class C:
    items = []
    def add(self, x):
        self.items.append(x)

a = C()
b = C()
a.add(1)
b.add(2)
print(a.items)
print(b.items)`,
      expectedOutput: `[1, 2]
[1, 2]`,
      explanation:
        'items is a CLASS attribute — one list shared across all instances. self.items.append MUTATES that shared list. So both a and b see [1, 2]. To get per-instance lists, initialize self.items = [] in __init__.',
      hints: ['Mutable class attributes are shared. self.items still finds the class\'s list.'],
      tags: ['oop', 'class-attribute', 'shared-state'],
      concepts: ['py-class-instance-distinction'],
    },
{
      id: 'py-oop-predict-4',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_OOP,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `class C:
    n = 10

a = C()
b = C()
a.n = 99
print(a.n, b.n, C.n)`,
      expectedOutput: `99 10 10`,
      explanation:
        'a.n = 99 creates an INSTANCE attribute on a, shadowing the class attribute (only for a). b still falls through to C.n. Assignment via instance creates instance attrs; reading falls through to the class if no instance attr exists.',
      hints: ['Assignment creates instance attrs; reads fall through to the class.'],
      tags: ['oop', 'class-attribute', 'shadowing'],
      concepts: ['py-class-instance-distinction'],
    },
{
      id: 'py-oop-predict-5',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_OOP,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `class Item:
    def __init__(self, base, tax):
        self.base = base
        self.tax = tax
    @property
    def price(self):
        return self.base + self.tax

i = Item(100, 8)
print(i.price)`,
      expectedOutput: `108`,
      explanation:
        '@property exposes price as an attribute — accessed without parens. So i.price (not i.price()) returns 100 + 8 = 108.',
      hints: ['@property → access without parens.'],
      tags: ['oop', 'property'],
      concepts: ['py-class-instance-distinction'],
    },
{
      id: 'py-oop-predict-6',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_OOP,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `class A:
    def __init__(self):
        print("A init")

class B(A):
    def __init__(self):
        print("B init")

B()`,
      expectedOutput: `B init`,
      explanation:
        'B.__init__ overrides A.__init__ and does NOT call super().__init__(). So only B init runs. To also run A\'s init, B would need `super().__init__()`.',
      hints: ['Override without super() = parent init never runs.'],
      tags: ['oop', 'inheritance', 'super'],
      concepts: ['py-class-instance-distinction', 'py-super-call'],
    },
{
      id: 'py-oop-predict-7',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_OOP,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `class C:
    @classmethod
    def name(cls):
        return cls.__name__

class D(C):
    pass

print(C.name())
print(D.name())`,
      expectedOutput: `C
D`,
      explanation:
        '@classmethod gets cls — the actual class the method was called on, not necessarily where it was defined. So D.name() sees cls=D and returns "D". Without @classmethod (regular method), you\'d need an instance.',
      hints: ['cls is the calling class, not where the method was defined.'],
      tags: ['oop', 'classmethod'],
      concepts: ['py-class-instance-distinction'],
    },
{
      id: 'py-oop-predict-10',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_OOP,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `class Animal:
    pass
class Cat(Animal):
    pass

c = Cat()
print(isinstance(c, Cat))
print(isinstance(c, Animal))
print(type(c) == Animal)`,
      expectedOutput: `True
True
False`,
      explanation:
        'isinstance returns True for the exact class AND any superclass. type(c) returns Cat exactly — `type(c) == Animal` is False because Cat is not literally Animal. Use isinstance for inheritance checks; reserve type-equality for "is this exactly this class".',
      hints: ['isinstance walks up; type == is exact match only.'],
      tags: ['oop', 'isinstance', 'type'],
      concepts: ['py-class-instance-distinction'],
    },
{
      id: 'pcpp-oop-3',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_OOP,
      course: Course.BACKEND,
      question: 'What does `__dict__` return when called on an instance vs. a class?',
      options: [
        { id: 'a', text: 'Both return the same dictionary', isCorrect: false },
        { id: 'b', text: 'Instance `__dict__` holds instance variables; class `__dict__` holds class attributes and methods', isCorrect: true },
        { id: 'c', text: '`__dict__` only exists on classes, not instances', isCorrect: false },
        { id: 'd', text: '`__dict__` returns a list of method names', isCorrect: false },
      ],
      explanation: 'Every object in Python has a `__dict__` attribute. For an instance, `obj.__dict__` returns the instance\'s own namespace — just its instance variables. For a class, `MyClass.__dict__` returns the class namespace — class variables, methods, and special attributes. This is how Python\'s attribute lookup works: it checks instance `__dict__` first, then class `__dict__`.',
      hints: [
        'Instance `__dict__` = instance variables only',
        'Class `__dict__` = everything defined in the class body',
      ],
      tags: ['oop', '__dict__', 'namespaces', 'attribute-lookup'],
      concepts: ['py-class-instance-distinction'],
    },
{
      id: 'pcpp-inherit-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_OOP,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Build a class hierarchy to demonstrate polymorphism. `Animal` takes a `name` in its constructor and has a method `speak()` returning the string `"..."`. Two subclasses `Dog` and `Cat` inherit from `Animal` (no new `__init__` needed — reuse the parent\'s) and each OVERRIDE `speak()` to return `"Woof!"` and `"Meow!"` respectively. Build a list containing three animals — a Dog named Rex, a Cat named Whiskers, and a Dog named Buddy. Iterate the list and for each animal print a line of the form `"<name>: <speak output>"`.',
      starterCode: `# Define Animal(name) with speak() returning "..."
# Define Dog and Cat subclasses that override speak() with "Woof!" and "Meow!"
# (Dog and Cat inherit __init__ from Animal — no need to redefine it)


# Build [Dog("Rex"), Cat("Whiskers"), Dog("Buddy")] and print "{name}: {speak()}" for each
`,
      testCases: [
        { input: 'Dog("Rex").speak()', expectedOutput: 'Woof!', description: 'Dog speaks Woof!' },
        { input: 'Cat("Whiskers").speak()', expectedOutput: 'Meow!', description: 'Cat speaks Meow!' },
      ],
      solution: `class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        return "..."

class Dog(Animal):
    def speak(self):
        return "Woof!"

class Cat(Animal):
    def speak(self):
        return "Meow!"

animals = [Dog("Rex"), Cat("Whiskers"), Dog("Buddy")]
for animal in animals:
    print(f"{animal.name}: {animal.speak()}")`,
      explanation: 'Polymorphism lets you call the same method on different types and get different behaviours. The `for` loop calls `speak()` on each object — Python dispatches to the correct subclass implementation automatically. This is the open/closed principle in action.',
      hints: [
        'Each subclass overrides `speak()` with its own return value',
        'No type checking needed — Python dispatches automatically',
      ],
      tieredHints: {
        apiSignature: 'class Sub(Base): def method(self) -> str',
        skeleton: `class Animal:
    def __init__(self, ____):
        self.____ = name

    def ____(self):
        return "____"

class Dog(____):
    def ____(self):
        return "____"

class Cat(____):
    def ____(self):
        return "____"

animals = [____("Rex"), ____("Whiskers"), ____("Buddy")]
for animal in ____:
    print(f"{animal.____}: {animal.____()}")`,
      },
      tags: ['oop', 'inheritance', 'polymorphism', 'override', 'dispatch'],
      concepts: ['py-class-instance-distinction', 'py-super-call'],
    },
{
      id: 'pcpp-inherit-3',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_OOP,
      course: Course.BACKEND,
      question: 'What does `super()` do, and when should you use it?',
      options: [
        { id: 'a', text: 'It creates a new instance of the parent class', isCorrect: false },
        { id: 'b', text: 'It calls the next class in the MRO, allowing access to parent methods without hardcoding the parent class name', isCorrect: true },
        { id: 'c', text: 'It makes all parent class methods available as instance methods', isCorrect: false },
        { id: 'd', text: 'It is only needed when using multiple inheritance', isCorrect: false },
      ],
      explanation: '`super()` returns a proxy object that delegates method calls to the next class in the MRO. Use it in `__init__` to call the parent\'s initialiser: `super().__init__(args)`. Using `super()` is better than hardcoding `ParentClass.__init__(self, args)` because it handles multiple inheritance correctly and makes refactoring easier.',
      hints: [
        '`super().__init__(...)` calls the parent\'s __init__',
        'It follows the MRO — important in multiple inheritance',
      ],
      tags: ['oop', 'super', 'inheritance', 'MRO', '__init__'],
      concepts: ['py-class-instance-distinction', 'py-super-call', 'py-mro-resolution', 'py-modules-imports'],
    },
{
      id: 'pcpp-inherit-4',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_OOP,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Create a `Vehicle` base class with `make` and `year`, then a `Car` subclass that adds `num_doors`. Use `super().__init__()` in `Car.__init__`. Add a `describe()` method to `Car`.',
      starterCode: `# Define Vehicle with make and year, and a describe() that returns "{year} {make}"
# Define Car(Vehicle) that adds num_doors and overrides describe()


# Build a Car("Toyota", 2022, 4) and print describe() and make
`,
      testCases: [
        { input: 'Car("Toyota", 2022, 4).describe()', expectedOutput: '2022 Toyota (4-door)', description: 'describe() should include all attributes' },
        { input: 'Car("Ford", 2020, 2).make', expectedOutput: 'Ford', description: 'make attribute should come from Vehicle' },
      ],
      solution: `class Vehicle:
    def __init__(self, make, year):
        self.make = make
        self.year = year

    def describe(self):
        return f"{self.year} {self.make}"

class Car(Vehicle):
    def __init__(self, make, year, num_doors):
        super().__init__(make, year)
        self.num_doors = num_doors

    def describe(self):
        return f"{self.year} {self.make} ({self.num_doors}-door)"

car = Car("Toyota", 2022, 4)
print(car.describe())
print(car.make)`,
      explanation: '`super().__init__(make, year)` calls `Vehicle.__init__` to set `self.make` and `self.year`. Then `self.num_doors = num_doors` adds the subclass-specific attribute. `Car.describe()` overrides `Vehicle.describe()` with a richer string. This is the correct pattern for extending parent classes.',
      hints: [
        'Call `super().__init__(make, year)` first, then set `self.num_doors`',
        'Override `describe()` in `Car` to include `num_doors`',
      ],
      tieredHints: {
        apiSignature: 'super().__init__(make, year) -> None',
        skeleton: `class Vehicle:
    def __init__(self, make, year):
        self.____ = make
        self.____ = year

    def ____(self):
        return f"{self.____} {self.____}"

class Car(____):
    def __init__(self, make, year, num_doors):
        ____().____(make, year)
        self.____ = num_doors

    def ____(self):
        return f"{self.____} {self.____} ({self.____}-____)"

car = Car("Toyota", 2022, 4)
print(car.____())
print(car.make)`,
      },
      tags: ['oop', 'super', 'inheritance', '__init__', 'override'],
      concepts: ['py-class-instance-distinction', 'py-super-call', 'py-modules-imports'],
    },
{
      id: 'pcpp-methods-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_OOP,
      course: Course.BACKEND,
      question: 'What is the difference between `@staticmethod` and `@classmethod`?',
      options: [
        { id: 'a', text: 'They are identical — both skip the `self` parameter', isCorrect: false },
        { id: 'b', text: '`@staticmethod` receives no implicit first argument; `@classmethod` receives the class (`cls`) as the first argument', isCorrect: true },
        { id: 'c', text: '`@classmethod` can only be called on instances; `@staticmethod` can only be called on classes', isCorrect: false },
        { id: 'd', text: '`@staticmethod` receives `self`; `@classmethod` receives `cls`', isCorrect: false },
      ],
      explanation: '`@staticmethod` is a plain function that lives in a class namespace — no `self` or `cls`. Good for utility functions related to the class. `@classmethod` receives the class itself as `cls` — useful for alternative constructors (factory methods) or accessing/modifying class variables. Both can be called on the class or an instance.',
      hints: [
        'Static = no implicit argument; Class = `cls` as first argument',
        'Use `@classmethod` for factory methods or class-level state',
      ],
      tags: ['oop', 'staticmethod', 'classmethod', 'decorators', 'methods'],
      concepts: ['py-class-instance-distinction', 'py-decorator-application'],
    },
{
      id: 'pcpp-methods-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_OOP,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Build a `Temperature` class that takes a `celsius` value on construction and stores it as `self.celsius`. Add an ALTERNATIVE CONSTRUCTOR named `from_fahrenheit` (using `@classmethod`) that takes a Fahrenheit value, converts it to Celsius using `(F - 32) * 5/9`, and returns a new instance. Also add a UTILITY function named `is_freezing` (using `@staticmethod`) that takes a celsius value and returns `True` when it is 0 or below. Also add a developer-representation hook (`__repr__`) returning the string `"Temperature({celsius:.1f}°C)"`.',
      starterCode: `# Define Temperature with:
#   - __init__(self, celsius)
#   - @classmethod from_fahrenheit(cls, fahrenheit)  — formula: (F - 32) * 5/9
#   - @staticmethod is_freezing(celsius)
#   - __repr__ returning f"Temperature({celsius:.1f}°C)"
`,
      testCases: [
        { input: 'Temperature.from_fahrenheit(32).celsius', expectedOutput: '0.0', description: '32°F = 0°C' },
        { input: 'Temperature.is_freezing(-5)', expectedOutput: 'True', description: '-5 is freezing' },
        { input: 'Temperature.is_freezing(20)', expectedOutput: 'False', description: '20 is not freezing' },
      ],
      solution: `class Temperature:
    def __init__(self, celsius):
        self.celsius = celsius

    @classmethod
    def from_fahrenheit(cls, fahrenheit):
        celsius = (fahrenheit - 32) * 5 / 9
        return cls(celsius)

    @staticmethod
    def is_freezing(celsius):
        return celsius <= 0

    def __repr__(self):
        return f"Temperature({self.celsius:.1f}°C)"`,
      explanation: '`from_fahrenheit` is an alternative constructor — it converts the input and calls `cls(celsius)` to create a new instance. Using `cls` instead of `Temperature` means subclasses work correctly. `is_freezing` is a utility — it needs no class or instance context, just the value itself.',
      hints: [
        'Use `return cls(celsius)` in the classmethod — not `Temperature(...)`',
        'Static methods just take the parameters they need, no `self` or `cls`',
      ],
      tieredHints: {
        apiSignature: '@classmethod def name(cls, *args) -> instance',
        skeleton: `class Temperature:
    def __init__(self, celsius):
        self.____ = celsius

    @____
    def from_fahrenheit(cls, fahrenheit):
        celsius = (fahrenheit - ____) * ____ / ____
        return ____(celsius)

    @____
    def is_freezing(celsius):
        return celsius ____ ____

    def __repr__(self):
        return f"____({self.celsius:____}____)"`,
      },
      tags: ['oop', 'classmethod', 'staticmethod', 'factory-method', 'Temperature'],
      concepts: ['py-class-instance-distinction'],
    },
{
      id: 'py-dec-beg-2',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_OOP,
      course: Course.BACKEND,
      question: 'In the class below, what does `@staticmethod` change about `add`?\n\n```python\nclass Calc:\n    @staticmethod\n    def add(a, b):\n        return a + b\n```',
      options: [
        { id: 'a', text: 'It tells Python the method takes no `self`, so you can call `Calc.add(1, 2)` without an instance.', isCorrect: true },
        { id: 'b', text: 'It makes the method run only once and then caches its return value forever.', isCorrect: false },
        { id: 'c', text: 'It makes the method execute noticeably faster than a normal instance method.', isCorrect: false },
        { id: 'd', text: 'It marks the method as deprecated so callers see a warning when they use it.', isCorrect: false },
      ],
      explanation: 'Without `@staticmethod`, Python would expect `add(self, a, b)` and pass the instance as `self`. `@staticmethod` strips that implicit first argument so the method behaves like a plain function that just lives inside the class namespace — handy for utilities that need no instance state.',
      tags: ['staticmethod', 'class', 'beginner', 'python'],
      concepts: ['py-class-instance-distinction'],
    },
{
      id: 'py-dec-2',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_OOP,
      course: Course.BACKEND,
      question: 'What does the `@property` decorator do in Python?',
      options: [
        { id: 'a', text: 'It makes the attribute private so external code can no longer read or write it.', isCorrect: false },
        { id: 'b', text: 'It exposes a method as a read-only attribute, accessed without parentheses, with optional setter logic.', isCorrect: true },
        { id: 'c', text: 'It creates a class-level attribute that is shared by every instance of the class.', isCorrect: false },
        { id: 'd', text: 'It caches the return value so the method body only ever runs a single time.', isCorrect: false },
      ],
      explanation: '`@property` lets you define a method that is accessed like an attribute: `obj.price` instead of `obj.get_price()`. You can add `@price.setter` for write access and validation. It is Python\'s way of implementing getters/setters without `get_`/`set_` boilerplate.',
      tags: ['property', 'getter', 'setter', 'python'],
      concepts: ['py-class-instance-distinction'],
    },
];
