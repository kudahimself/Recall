import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const py_metaclasses_questions: Question[] = [
{
      id: 'pcpp-meta-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_METACLASSES,
      course: Course.BACKEND,
      question: 'What are the three-argument and one-argument forms of `type()`, and what does each do?',
      options: [
        { id: 'a', text: '`type(obj)` checks if obj is a type; `type(name, bases, dict)` raises an error', isCorrect: false },
        { id: 'b', text: '`type(obj)` returns the type of obj; `type(name, bases, dict)` dynamically creates a new class', isCorrect: true },
        { id: 'c', text: 'Both forms do the same thing — return the type of an object', isCorrect: false },
        { id: 'd', text: '`type(obj)` is for old Python; `type(name, bases, dict)` is the modern form', isCorrect: false },
      ],
      explanation: '`type(obj)` with one argument returns the type of `obj` (same as `obj.__class__`). `type(name, bases, dict)` with three arguments dynamically creates a new class: `name` is the class name (string), `bases` is a tuple of base classes, `dict` is the class body as a dictionary. This is how metaclasses work internally.',
      hints: [
        '`type("MyClass", (BaseClass,), {"attr": value})` creates a class at runtime',
        'All classes in Python are instances of `type`',
      ],
      tags: ['metaprogramming', 'type', 'metaclass', 'dynamic-class', 'advanced'],
      concepts: ['py-metaclass'],
    },
{
      id: 'py-meta-typector-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_METACLASSES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Fill in the three-argument form of type() that dynamically builds a class: name, bases tuple, namespace dict.',
      template: `Point = ___("Point", (object,), {"x": 0})
p = Point()
print(p.x)`,
      blanks: ['type'],
      solution: `Point = type("Point", (object,), {"x": 0})\np = Point()\nprint(p.x)`,
      explanation: 'type(name, bases, namespace) is the three-argument form: name is the class name string, bases is a tuple of base classes, namespace is a dict of class-body attributes/methods. This is what "class Point: x = 0" desugars to internally.',
      hints: ['Same builtin as the one-argument type(obj) form, called with 3 args instead.'],
      tags: ['metaprogramming', 'type', 'dynamic-class'],
      concepts: ['py-metaclass'],
    },
{
      id: 'pcpp-meta-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_METACLASSES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Use `type()` with three arguments to dynamically create a class `Point` with a class variable `dimensions = 2` and a method `describe()` that returns `"2D Point"`. Then create an instance and call `describe()`.',
      starterCode: ``,
      testCases: [
        { input: '', expectedOutput: '2D Point\n2', description: 'Dynamic class should work like a regular class' },
      ],
      solution: `def describe(self):
    return f"{Point.dimensions}D Point"

Point = type(
    "Point",
    (object,),
    {"dimensions": 2, "describe": describe},
)

p = Point()
print(p.describe())
print(Point.dimensions)`,
      explanation: '`type("Point", (object,), {"dimensions": 2, "describe": describe})` is equivalent to writing a class with `class Point(object):`. The third argument dict maps attribute names to values — class variables and methods alike. This is how Python creates classes internally; `class` syntax is syntactic sugar for calling `type()`.',
      hints: [
        'Args: `"Point"` (name), `(object,)` (bases tuple), `{...}` (class body dict)',
        'Put both `dimensions` and `describe` in the dict',
      ],
      tags: ['metaprogramming', 'type', 'dynamic-class', 'advanced'],
      concepts: ['py-metaclass'],
    },
{
      id: 'pcpp-meta-3',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_METACLASSES,
      course: Course.BACKEND,
      question: 'What is a metaclass in Python?',
      options: [
        { id: 'a', text: 'A class that can only be used as a base class, never instantiated', isCorrect: false },
        { id: 'b', text: 'The class of a class — it controls how classes are created and behave', isCorrect: true },
        { id: 'c', text: 'A class with metadata annotations attached', isCorrect: false },
        { id: 'd', text: 'A class that cannot be subclassed', isCorrect: false },
      ],
      explanation: 'In Python, classes are objects too, and they have a type — their metaclass. The default metaclass is `type`. By creating a custom metaclass (class inheriting from `type`), you control how classes are created — you can add attributes, validate methods, enforce naming conventions, or register classes automatically. Specify with `class Foo(metaclass=MyMeta):`.',
      hints: [
        '"Classes are instances of their metaclass"',
        'The default metaclass is `type` — the class of all classes',
      ],
      tags: ['metaprogramming', 'metaclass', 'type', 'advanced', 'class-creation'],
      concepts: ['py-metaclass'],
    },
{
      id: 'py-meta-newoverride-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_METACLASSES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Fill in the base class a metaclass inherits from, and the method it overrides to hook class creation.',
      template: `class LoudMeta(___):
    def ___(mcs, name, bases, namespace):
        print(f"creating {name}")
        return super().___(mcs, name, bases, namespace)

class Widget(metaclass=LoudMeta):
    pass`,
      blanks: ['type', '__new__', '__new__'],
      solution: `class LoudMeta(type):\n    def __new__(mcs, name, bases, namespace):\n        print(f"creating {name}")\n        return super().__new__(mcs, name, bases, namespace)\n\nclass Widget(metaclass=LoudMeta):\n    pass`,
      explanation: 'A metaclass subclasses type. Overriding __new__ intercepts class creation itself — it receives the metaclass, the new class\'s name, its bases tuple, and its namespace dict, and must forward to super().__new__() to actually build the class.',
      hints: ['Metaclasses subclass type; __new__ is the hook called at class-creation time.'],
      tags: ['metaprogramming', 'metaclass', '__new__', 'namespace'],
      concepts: ['py-metaclass'],
    },
{
      id: 'pcpp-meta-4',
      type: QuestionType.CODING,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_METACLASSES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write a metaclass `UppercaseAttrMeta` (inheriting from `type`) that uppercases every non-dunder attribute name during class creation. Override the metaclass instantiation hook (the `__new__` variant that metaclasses use — it receives the metaclass, the class name, the bases tuple, and the namespace dict). Build a new namespace: for every key NOT starting/ending with double underscores (dunder), copy its value under the uppercased key; dunder keys pass through unchanged. Forward to `super().__new__` with the transformed namespace.\n\nThen define a class `Config` using this metaclass, with two attributes declared as `debug = True` and `version = "1.0"`. After the metaclass runs, those names become `DEBUG` and `VERSION`. Print `Config.DEBUG` then `Config.VERSION` — expected output: `True` then `1.0`.',
      starterCode: ``,
      testCases: [
        { input: '', expectedOutput: 'True\n1.0', description: 'Attributes should be uppercased by metaclass' },
      ],
      solution: `class UppercaseAttrMeta(type):
    def __new__(mcs, name, bases, namespace):
        upper_namespace = {}
        for key, value in namespace.items():
            if not key.startswith("__"):
                upper_namespace[key.upper()] = value
            else:
                upper_namespace[key] = value
        return super().__new__(mcs, name, bases, upper_namespace)

class Config(metaclass=UppercaseAttrMeta):
    debug = True
    version = "1.0"

print(Config.DEBUG)
print(Config.VERSION)`,
      explanation: 'The metaclass overrides `__new__` — called when creating the class object itself (not instances). It intercepts the class namespace dict and transforms non-dunder keys to uppercase before passing to `super().__new__()`. The resulting class has `DEBUG` and `VERSION` instead of `debug` and `version`.',
      hints: [
        'Metaclass `__new__` receives the namespace dict before the class is created',
        'Skip `__dunder__` keys — only transform user-defined names',
      ],
      tags: ['metaprogramming', 'metaclass', '__new__', 'advanced', 'namespace'],
      concepts: ['py-metaclass'],
    },
{
      id: 'pcpp-meta-5',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_METACLASSES,
      course: Course.BACKEND,
      question: 'What do the special attributes `__name__`, `__module__`, and `__bases__` tell you about a class?',
      options: [
        { id: 'a', text: '`__name__` = class docstring, `__module__` = version, `__bases__` = methods', isCorrect: false },
        { id: 'b', text: '`__name__` = class name string, `__module__` = module where defined, `__bases__` = tuple of direct base classes', isCorrect: true },
        { id: 'c', text: '`__name__` = instance count, `__module__` = import path, `__bases__` = list of inherited methods', isCorrect: false },
        { id: 'd', text: 'These attributes only exist on built-in classes', isCorrect: false },
      ],
      explanation: 'Every class has: `__name__` (the class name as a string, e.g. `"Dog"`), `__module__` (the module where the class was defined, e.g. `"__main__"` or `"animals"`), and `__bases__` (a tuple of direct parent classes). These are used by frameworks, debuggers, and serialisation tools to introspect class hierarchies.',
      hints: [
        '`MyClass.__name__` gives `"MyClass"` as a string',
        '`__bases__` is a tuple — use `[0]` to get the first parent',
      ],
      tags: ['metaprogramming', '__name__', '__module__', '__bases__', 'introspection'],
      concepts: ['py-metaclass'],
    },
{
      id: 'py-meta-introspect-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_METACLASSES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Fill in the special attributes: the class name string, and the tuple of direct base classes.',
      template: `class Dog:
    pass

print(Dog.___)    # 'Dog'
print(Dog.___)    # (<class 'object'>,)`,
      blanks: ['__name__', '__bases__'],
      solution: `class Dog:\n    pass\n\nprint(Dog.__name__)    # 'Dog'\nprint(Dog.__bases__)    # (<class 'object'>,)`,
      explanation: '__name__ gives the class name as a string. __bases__ is a tuple of the class\'s direct parents. Both are set automatically by the metaclass (type by default) when the class is created.',
      hints: ['Both are dunder attributes every class carries.'],
      tags: ['metaprogramming', '__name__', '__bases__', 'introspection'],
      concepts: ['py-metaclass'],
    },
{
      id: 'pcpp-meta-6',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_METACLASSES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Inspect a class hierarchy using special attributes. Create `Animal` and `Dog(Animal)` classes, then print: the class name, its module, its bases, and the full MRO for `Dog`.',
      starterCode: `# Define Animal and Dog(Animal) classes (bodies can just be pass)
# Print Dog.__name__, Dog.__module__, Dog.__bases__, and Dog.mro()
`,
      testCases: [
        { input: '', expectedOutput: 'Dog\n__main__\n(<class \'__main__.Animal\'>,)\n[<class \'__main__.Dog\'>, <class \'__main__.Animal\'>, <class \'object\'>]', description: 'Should print class introspection data' },
      ],
      solution: `class Animal:
    pass

class Dog(Animal):
    pass

print(Dog.__name__)
print(Dog.__module__)
print(Dog.__bases__)
print(Dog.mro())`,
      explanation: '`__name__` gives just `"Dog"`. `__module__` is `"__main__"` when running directly. `__bases__` is `(Animal,)` — a tuple of direct parents. `Dog.mro()` (or `Dog.__mro__`) shows the full Method Resolution Order: Dog → Animal → object. Every class ultimately inherits from `object`.',
      hints: [
        'Use `Dog.__name__`, `Dog.__module__`, `Dog.__bases__`, `Dog.mro()`',
        'All classes inherit from `object` at the top of the MRO',
      ],
      tags: ['metaprogramming', '__name__', '__bases__', 'MRO', 'introspection'],
      concepts: ['py-mro-resolution'],
    },
{
      id: 'py-meta-beg-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_METACLASSES,
      course: Course.BACKEND,
      question: 'In Python, what is true about a class itself (not its instances)?',
      options: [
        { id: 'a', text: 'A class is also an object — you can assign it to a variable and pass it around.', isCorrect: true },
        { id: 'b', text: 'A class is pure syntax that disappears entirely once the program starts running.', isCorrect: false },
        { id: 'c', text: 'A class can only be used right after its definition and never stored anywhere.', isCorrect: false },
        { id: 'd', text: 'A class is the same thing as one of its instances, just spelled differently.', isCorrect: false },
      ],
      explanation: 'In Python "everything is an object" — and that includes classes. A class is a first-class object: you can bind it to a name, store it in a list, pass it to a function, and inspect it at runtime. This is what makes metaprogramming possible.',
      tags: ['metaprogramming', 'classes-as-objects', 'beginner'],
      concepts: ['py-metaclass'],
    },
{
      id: 'py-meta-beg-2',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_METACLASSES,
      course: Course.BACKEND,
      question: 'What does `type(obj)` return when given a single argument?',
      options: [
        { id: 'a', text: 'The class that `obj` was created from, such as `int` for the value `5`.', isCorrect: true },
        { id: 'b', text: 'A list of every attribute and method name that `obj` currently defines.', isCorrect: false },
        { id: 'c', text: 'The amount of memory in bytes that `obj` occupies while it is alive.', isCorrect: false },
        { id: 'd', text: 'A copy of `obj` converted into a plain string for printing purposes.', isCorrect: false },
      ],
      explanation: '`type(obj)` with one argument returns the object\'s class. `type(5)` is `<class \'int\'>`, `type("hi")` is `<class \'str\'>`. It gives the same result as `obj.__class__`.',
      tags: ['metaprogramming', 'type', 'introspection', 'beginner'],
      concepts: ['py-metaclass'],
    },
{
      id: 'py-meta-beg-3',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_METACLASSES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Fill in the builtin that returns the class an object was created from.',
      template: `x = 5\nprint(___(x))   # <class 'int'>`,
      blanks: ['type'],
      solution: `x = 5\nprint(type(x))   # <class 'int'>`,
      explanation: '`type(obj)` with one argument returns the object\'s class. `type(5)` is `<class \'int\'>`. It is the same value as `obj.__class__`.',
      hints: ['Four letters; the same builtin you would use to check an object\'s class.'],
      tags: ['metaprogramming', 'type', 'introspection'],
      concepts: ['py-metaclass'],
    },
{
      id: 'py-meta-beg-4',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_METACLASSES,
      course: Course.BACKEND,
      question: 'What does the `__class__` attribute on an object give you?',
      options: [
        { id: 'a', text: 'The class the object is an instance of — the same result as `type(obj)`.', isCorrect: true },
        { id: 'b', text: 'A dictionary of the object\'s instance variables and their current values.', isCorrect: false },
        { id: 'c', text: 'The name of the module where the object\'s class was originally defined.', isCorrect: false },
        { id: 'd', text: 'A boolean that is True only when the object was built by a metaclass.', isCorrect: false },
      ],
      explanation: '`obj.__class__` is a reference to the class the object came from — identical to `type(obj)`. (For the record, the instance variable dict is `obj.__dict__`, and the defining module is `cls.__module__`.)',
      tags: ['metaprogramming', '__class__', 'introspection', 'beginner'],
      concepts: ['py-metaclass'],
    },
{
      id: 'py-meta-int-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_METACLASSES,
      course: Course.BACKEND,
      question: 'Why can you say "every class in Python is an instance of `type`"?',
      options: [
        { id: 'a', text: 'Because `type` is the default metaclass that builds classes, so each class is one of its instances.', isCorrect: true },
        { id: 'b', text: 'Because `type` secretly inherits from every class that you define anywhere in the program.', isCorrect: false },
        { id: 'c', text: 'Because classes and the `type` builtin are always stored together inside the same module.', isCorrect: false },
        { id: 'd', text: 'Because `type` converts each class into a string the very first time it gets used.', isCorrect: false },
      ],
      explanation: 'A metaclass is "the class of a class". The default metaclass is `type`, so writing `class Foo: ...` ultimately calls `type(...)` to build the class object. That makes `Foo` an instance of `type` — `isinstance(Foo, type)` is `True`, just as `Foo()` is an instance of `Foo`.',
      tags: ['metaprogramming', 'metaclass', 'type'],
      concepts: ['py-metaclass'],
    },
{
      id: 'py-meta-int-2',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_METACLASSES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `class Dog:
    pass

d = Dog()
print(type(d) is d.__class__)
print(type(d) is Dog)
print(type(Dog) is type)`,
      expectedOutput: `True
True
True`,
      explanation: '`type(d)` and `d.__class__` are the same object — the instance\'s class, `Dog`. So the first two lines are `True`. `Dog` itself was built by the default metaclass, so `type(Dog) is type` is also `True`. The chain is instance → class → metaclass.',
      hints: ['type(obj) and obj.__class__ are the same thing.', 'The class of a class is its metaclass — type by default.'],
      tags: ['metaprogramming', 'type', '__class__', 'metaclass'],
      concepts: ['py-metaclass'],
    },
];
