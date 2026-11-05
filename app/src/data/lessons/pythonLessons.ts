/**
 * Backend (Python) lessons, one per topic, in course order.
 *
 * Section 1, Python Fundamentals: every topic.
 *
 * Prose keeps one sentence per source line (`lines`); check-lessons.js runs
 * each worked example on `python3 -I` and compares what it prints with `output`.
 */
import { CodeLanguage, Topic, TopicLesson } from '../../types';

/** One paragraph from its sentences, one per source line. */
const lines = (...sentences: string[]) => sentences.join('\n');

export const pythonLessons: TopicLesson[] = [
  {
    id: 'py_basics/1',
    topicKeys: [Topic.PY_BASICS],
    step: 1,
    title: 'Variables, Types & Strings',
    idea: [
      lines(
        "A variable is a name bound to a value with `=`, with no declaration and no type to write.",
        "Python takes the type from the value: `int` for `42`, `float` for `3.5`, `str` for `\"hi\"` and `bool` for `True`, and `type(x)` tells you which.",
        "`int(\"42\")`, `float(\"3.5\")` and `str(42)` convert between them.",
      ),
      lines(
        "`/` always gives a float, so `7 / 2` is `3.5`.",
        "`//` divides and rounds down (`7 // 2` is `3`), `%` gives the remainder (`7 % 2` is `1`) and `**` raises to a power.",
      ),
      lines(
        "A string is a sequence of characters: `s[0]` is the first, `s[-1]` the last, and `s[1:4]` the characters at 1, 2 and 3.",
        "Methods such as `.upper()`, `.strip()` and `.replace(a, b)` return a new string.",
        "An f-string, `f\"{x} items\"`, puts values into text, while `+` joins two strings but fails on a string and a number.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `x = 3                    # int
y = 4.5                  # float
s = "text"               # str
ok = True                # bool
type(x)                  # <class 'int'>
int("42"), str(42)       # convert between types

7 / 2, 7 // 2, 7 % 2     # 3.5  3  1
s[0], s[-1], s[1:3]      # index and slice
s.upper()                # a NEW string; s is unchanged
f"{s} costs {y}"         # f-string`,
    },
    pitfall: lines(
      "Strings never change, so `s.upper()` on a line of its own does nothing useful: it returns a new string that nobody keeps.",
      "Keep the result by assigning it, `s = s.upper()`, or use it straight away in a `print` or an f-string.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      code: `title = "the hobbit"
pages = 310
clean = title.title()
title.upper()
print(title)
print(clean, type(pages).__name__)
print(clean[0], clean[-6:])
print(pages // 100, pages % 100, pages / 100)
print(f"{clean} has {pages} pages")`,
      steps: [
        "Line 3: `.title()` returns a new string with each word capitalised, and `clean` keeps it.",
        lines(
          "Line 4: `.upper()` also returns a new string, but nothing keeps it.",
          "So line 5 prints the lowercase original.",
        ),
        "Line 6: `type(pages).__name__` is `int`, since `310` has no decimal point.",
        "Line 7: index 0 is the first character, and `[-6:]` slices the last six.",
        "Lines 8-9: `//` gives the whole hundreds, `%` the remainder and `/` the exact float, then the f-string puts both values into one line.",
      ],
      output: `the hobbit
The Hobbit int
T Hobbit
3 10 3.1
The Hobbit has 310 pages`,
    },
    exercises: [
      'pe1-m2-3',
      'pe1-m2-8',
      'py-basics-predict-7',
      'py-basics-cloze-5',
      'pe1-m2-16',
    ],
  },
  {
    id: 'py_data_structures/1',
    topicKeys: [Topic.PY_DATA_STRUCTURES],
    step: 1,
    title: 'Data Structures (list, dict, set, tuple)',
    idea: [
      lines(
        "A list, `[a, b, c]`, is an ordered sequence you can change.",
        "Read it with `xs[0]`, `xs[-1]` or a slice `xs[1:3]`, and grow it with `.append(x)` for one item or `.extend(other)` for many.",
        "A tuple, `(a, b)`, is ordered but fixed, and unpacks into names: `low, high = pair`.",
      ),
      lines(
        "A dict, `{key: value}`, maps keys to values and keeps them in insertion order.",
        "`d[key]` raises `KeyError` when the key is missing, while `d.get(key, default)` returns the default instead.",
        "`for k, v in d.items():` walks keys and values together.",
      ),
      lines(
        "A set, `{a, b}`, keeps each value once and has no order, so it suits membership tests and removing duplicates.",
        "`a & b` holds the values in both sets and `a | b` the values in either.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `xs = [3, 1, 2]            # list: ordered, changeable
xs[0], xs[-1], xs[1:3]    # first, last, a slice
xs.append(4)              # changes xs, returns None
sorted(xs)                # a NEW sorted list

pair = (1, 9)             # tuple: fixed
low, high = pair          # unpacking

d = {"k": 1}              # dict: key -> value
d.get("x", 0)             # default when the key is missing
for k, v in d.items(): ...

s = {1, 2, 2}             # set: {1, 2}`,
    },
    pitfall: lines(
      "Methods that change a list in place, such as `.sort()`, `.append()` and `.reverse()`, return `None`.",
      "`xs = xs.sort()` therefore loses the list.",
      "Call `xs.sort()` on its own line, or use `sorted(xs)`, which returns a new list and leaves the original alone.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      code: `loans = ["Dune", "Emma", "Ubik", "Emma"]
spot = ("B", 4)
fines = {"Dune": 20, "Ubik": 0}
aisle, shelf = spot
print(loans[0], loans[-1], loans[1:3])
print(sorted(set(loans)))
result = loans.sort()
print(result, loans)
print(fines.get("Emma", 0), aisle, shelf)
for title, fine in fines.items():
    print(title, fine)`,
      steps: [
        "Line 4: the tuple unpacks left to right, so `aisle` is `\"B\"` and `shelf` is `4`.",
        "Line 5: index 0 is the first loan, -1 the last, and the slice `[1:3]` takes items 1 and 2.",
        "Line 6: `set(loans)` drops the second Emma, and `sorted` turns the set back into an ordered list.",
        lines(
          "Lines 7-8: `.sort()` sorts `loans` in place and returns `None`.",
          "The list itself is now sorted.",
        ),
        "Lines 9-11: Emma has no fine, so `.get` returns the default 0, and `.items()` gives each key with its value in insertion order.",
      ],
      output: `Dune Emma ['Emma', 'Ubik']
['Dune', 'Emma', 'Ubik']
None ['Dune', 'Emma', 'Emma', 'Ubik']
0 B 4
Dune 20
Ubik 0`,
    },
    exercises: [
      'pe1-m4-7',
      'py-data-structures-predict-4',
      'py-data-structures-predict-6',
      'py-data-structures-cloze-1',
      'pe1-m3-18',
    ],
  },
  {
    id: 'py_functions/1',
    topicKeys: [Topic.PY_FUNCTIONS],
    step: 1,
    title: 'Functions & Scope',
    idea: [
      lines(
        "`def name(params):` defines a function, and a call binds each argument to a parameter.",
        "`return value` sends a value back and ends the call.",
        "A function that never reaches a `return` gives back `None`.",
      ),
      lines(
        "A parameter with a default, `def f(x, rate=10):`, may be left out of the call, and any argument can be passed by name, `f(5, rate=20)`.",
        "`*args` collects extra positional arguments into a tuple, and `**kwargs` collects extra named ones into a dict.",
      ),
      lines(
        "A name assigned inside a function is local to that call.",
        "Python looks a name up in the Local, Enclosing, Global and Built-in scopes, in that order (LEGB).",
        "So assigning `x` inside a function makes a new local `x` and leaves any outer `x` alone.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `def name(a, b=10, *args, **kwargs):  # required, default, extras
    total = a + b                    # local to this call
    return total                     # no return gives None

name(1)                # b is 10
name(1, b=5)           # by keyword
name(1, 2, 3, k=4)     # args == (3,), kwargs == {"k": 4}

def f(items=None):     # a list default: use None
    if items is None:
        items = []     # a fresh list on every call`,
    },
    pitfall: lines(
      "A default value is built once, when `def` runs, not on every call.",
      "A list or dict default is therefore shared by every call that leaves it out, and keeps what earlier calls added.",
      "Default to `None` and create the list inside the function.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      code: `fee = 5

def late_fee(days, per_day=20):
    fee = days * per_day
    return fee

def note(title, **details):
    print(title, details)

print(late_fee(3), late_fee(3, per_day=50))
print(fee)
result = note("Dune", shelf="B4")
print(result)`,
      steps: [
        "Line 10: the first call leaves out `per_day`, so it is 20 and the fee is 60; the second passes 50 by name and gets 150.",
        "Line 11: the `fee` assigned on line 4 was local to each call, so the global `fee` is still 5.",
        "Line 12: `shelf=\"B4\"` is not a named parameter of `note`, so it lands in the `details` dict.",
        "Line 13: `note` prints but never returns, so `result` is `None`.",
      ],
      output: `60 150
5
Dune {'shelf': 'B4'}
None`,
    },
    exercises: [
      'pe1-m4-2',
      'pe1-m4-3',
      'py-functions-predict-8',
      'py-functions-predict-1',
      'py-fn-1',
    ],
  },
  {
    id: 'py_oop/1',
    topicKeys: [Topic.PY_OOP],
    step: 1,
    title: 'OOP Basics (classes, inheritance, methods)',
    idea: [
      lines(
        "A class is a blueprint, and each object made from it is an instance with its own data.",
        "Calling the class runs `__init__(self, ...)`, where `self` is the new instance, so `self.title = title` stores a value on that one object.",
        "A method is a function in the class body, and `obj.method()` passes `obj` in as `self`.",
      ),
      lines(
        "`class Child(Parent):` inherits every method of `Parent`.",
        "A method of the same name in `Child` overrides the parent's, and `super().method()` still reaches the parent's version.",
        "Most often that is `super().__init__(...)`, so the parent sets up its own attributes.",
      ),
      lines(
        "A variable assigned in the class body, outside any method, is a class variable: one value shared by every instance.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `class Parent:
    shared = 0                   # class variable: one for all
    def __init__(self, x):
        self.x = x               # instance variable: one per object
    def describe(self):
        return f"x={self.x}"

class Child(Parent):             # inherits from Parent
    def __init__(self, x, y):
        super().__init__(x)      # let Parent set up x
        self.y = y
    def describe(self):          # overrides Parent.describe
        return super().describe() + f" y={self.y}"`,
    },
    pitfall: lines(
      "A list in the class body, `items = []`, is one list shared by every instance.",
      "So `self.items.append(x)` on one object shows up on all of them.",
      "Create per-object lists in `__init__` with `self.items = []`.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      code: `class Item:
    def __init__(self, title):
        self.title = title
        self.holds = []
    def label(self):
        return self.title

class Dvd(Item):
    def __init__(self, title, minutes):
        super().__init__(title)
        self.minutes = minutes
    def label(self):
        return super().label() + f" ({self.minutes} min)"

a, b = Item("Dune"), Dvd("Alien", 117)
a.holds.append("Ana")
print(a.label(), "|", b.label())
print(a.holds, b.holds, isinstance(b, Item))`,
      steps: [
        "Lines 2-4: `__init__` gives each new item its own `title` and its own empty `holds` list.",
        "Line 10: `Dvd.__init__` lets `Item.__init__` set `title` and `holds`, then adds `minutes` itself.",
        "Line 13: `Dvd.label` overrides `Item.label` but calls it through `super()` and adds the running time.",
        lines(
          "Lines 16-18: the hold goes on `a` only, because each `holds` list was made in `__init__`.",
          "A `Dvd` is also an `Item`, so `isinstance` is `True`.",
        ),
      ],
      output: `Dune | Alien (117 min)
['Ana'] [] True`,
    },
    exercises: [
      'py-oop-beg-2',
      'py-oop-cloze-1',
      'py-oop-predict-1',
      'py-oop-predict-3',
      'py-oop-2',
    ],
  },
  {
    id: 'py_modules/1',
    topicKeys: [Topic.PY_MODULES],
    step: 1,
    title: 'Modules & Packages',
    idea: [
      lines(
        "A module is a `.py` file, and a package is a folder of modules, usually with an `__init__.py`.",
        "`import math` binds the module to the name `math`, so you write `math.sqrt(16)`.",
        "`from math import sqrt` binds only the function, so you write `sqrt(16)`, and `as` gives either one another name.",
      ),
      lines(
        "The first import of a module runs its top-level code once and caches the module in `sys.modules`.",
        "Every later import of it, anywhere in the program, reuses the cached module and runs nothing.",
      ),
      lines(
        "Each module has a `__name__`: its own name when it is imported, and `\"__main__\"` when its file is run directly.",
        "`if __name__ == \"__main__\":` therefore guards the code that should run only as a script.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `import math                  # use as math.sqrt(x)
from math import sqrt        # use as sqrt(x)
import statistics as st      # alias: use as st.mean(xs)
from pkg.sub import helper   # a name from a package's module

def main():
    ...

if __name__ == "__main__":   # only when the file is run directly
    main()`,
    },
    pitfall: lines(
      "Code at a module's top level runs whenever the module is imported, not only when you run the file.",
      "Put script work such as printing or starting a job under `if __name__ == \"__main__\":`, so importing the module only defines its functions.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      code: `import sys
import statistics as stats
from math import ceil

def shelves_needed(books, per_shelf):
    return ceil(books / per_shelf)

if __name__ == "__main__":
    print(__name__)
    print(shelves_needed(130, 40))
    print(stats.mean([3, 9, 6]))
    print("math" in dir(), "ceil" in dir())
    print("statistics" in sys.modules)`,
      steps: [
        "Lines 8-9: this file is run directly, so `__name__` is `\"__main__\"` and the guarded block runs.",
        "Line 10: `ceil` was imported by itself, so it is called without `math.`; 130 / 40 is 3.25, rounded up to 4.",
        "Line 11: the alias `stats` is the `statistics` module under a shorter name.",
        lines(
          "Lines 12-13: `from math import ceil` binds `ceil` but not `math`.",
          "The module is cached in `sys.modules` under its real name, whatever alias the import used.",
        ),
      ],
      output: `__main__
4
6
False True
True`,
    },
    exercises: [
      'pe1-modules-1',
      'py-modules-predict-2',
      'py-modules-parsons-1',
      'py-modules-cloze-2',
      'pe1-modules-2',
    ],
  },
  {
    id: 'py_file_io/1',
    topicKeys: [Topic.PY_FILE_IO],
    step: 1,
    title: 'File I/O',
    idea: [
      lines(
        "`open(path, mode)` returns a file object, and `with open(...) as f:` closes it when the block ends, even after an error.",
        "The mode says what you may do: `\"r\"` reads (the default), `\"w\"` writes into an emptied file, and `\"a\"` appends to the end.",
      ),
      lines(
        "`f.read()` returns the whole file as one string, and `f.readline()` the next line with its `\\n`.",
        "`for line in f:` walks the lines one at a time without loading the whole file.",
        "Once the end is reached, every read returns the empty string `''`.",
      ),
      lines(
        "`f.write(text)` writes exactly the text you give it, so add `\\n` yourself where a line should end.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `with open(path) as f:          # "r": read (the default)
    text = f.read()            # the whole file as one string

with open(path) as f:
    for line in f:             # one line at a time, newline included
        print(line.strip())

with open(path, "w") as f:     # "w": empties the file first
    f.write("text\\n")          # write adds no newline for you

with open(path, "a") as f:     # "a": adds to the end
    f.write("more\\n")`,
    },
    pitfall: lines(
      "Opening an existing file with `\"w\"` empties it at once, before you write anything.",
      "Use `\"a\"` to add to a file, and keep `\"w\"` for when you mean to replace what is there.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      code: `import os, tempfile

folder = tempfile.TemporaryDirectory()
path = os.path.join(folder.name, "loans.txt")
with open(path, "w") as f:
    f.write("Dune\\nEmma\\n")
with open(path, "a") as f:
    f.write("Ubik\\n")
with open(path) as f:
    print(repr(f.readline()))
    for line in f:
        print(line.strip())
with open(path, "w") as f:
    f.write("Beloved\\n")
with open(path) as f:
    print(f.read().splitlines())
folder.cleanup()`,
      steps: [
        "Lines 3-4: a fresh temporary folder, so the example never touches your own files.",
        "Lines 5-8: `\"w\"` creates the file with two lines, then `\"a\"` adds a third after them.",
        "Line 10: `readline()` returns the first line with its `\\n`, which `repr` makes visible.",
        "Lines 11-12: the loop carries on from where `readline` stopped, and `.strip()` removes each newline.",
        "Lines 13-16: opening with `\"w\"` again wipes all three lines, so only Beloved is left.",
      ],
      output: `'Dune\\n'
Emma
Ubik
['Beloved']`,
    },
    exercises: [
      'pe1-fileio-1',
      'pe1-fileio-2',
      'py-file-io-predict-1',
      'py-file-io-predict-2',
      'pe1-fileio-3',
    ],
  },
  {
    id: 'py_error_handling/1',
    topicKeys: [Topic.PY_ERROR_HANDLING],
    step: 1,
    title: 'Error Handling (try/except)',
    idea: [
      lines(
        "An error at run time raises an exception, which stops the code at that line and travels up through the callers until something catches it.",
        "Uncaught, it ends the program with a traceback.",
      ),
      lines(
        "`try:` marks the code that might fail, and `except ValueError:` catches that type and its subclasses.",
        "`except (ValueError, KeyError) as e:` catches either type and binds the exception to `e`.",
        "`else:` runs only when the `try` block raised nothing, and `finally:` runs every time, error or not, which suits cleanup.",
      ),
      lines(
        "`raise ValueError(\"msg\")` raises an exception yourself, and a bare `raise` inside `except` re-raises the one being handled.",
        "Your own error types are classes: `class LoanError(Exception): pass`.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `try:
    risky()                          # code that may fail
except (ValueError, KeyError) as e:  # only these types
    print(e)
else:
    print("no error")                # only when try raised nothing
finally:
    print("always")                  # cleanup, every time

raise ValueError("bad input")        # raise one yourself`,
    },
    pitfall: lines(
      "A bare `except:` or `except Exception:` catches every error, including typos and bugs you never meant to hide, and the program carries on with wrong data.",
      "Catch the narrowest type you expect, such as `ValueError` around `int(text)`, and let the rest propagate.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      code: `class LoanError(Exception):
    pass

def renew(loans, title):
    if loans.get(title, 0) >= 2:
        raise LoanError(f"{title} renewed too often")
    loans[title] = loans.get(title, 0) + 1

loans = {"Dune": 2}
for title in ["Emma", "Dune"]:
    try:
        renew(loans, title)
    except LoanError as e:
        print("refused:", e)
    else:
        print("renewed", title)
    finally:
        print("checked", title)`,
      steps: [
        "Lines 1-2: `LoanError` is a new exception type, a subclass of `Exception`.",
        "Line 6: Dune already has two renewals, so `renew` raises and the line after it never runs.",
        "Lines 13-14: the exception travels out of `renew` to this `except`, and `e` holds its message.",
        lines(
          "Lines 15-18: Emma raised nothing, so `else` runs for her and not for Dune.",
          "`finally` runs for both.",
        ),
      ],
      output: `renewed Emma
checked Emma
refused: Dune renewed too often
checked Dune`,
    },
    exercises: [
      'py-err-beg-2',
      'py-error-handling-cloze-2',
      'py-err-5',
      'py-error-handling-predict-1',
      'py-err-4',
    ],
  },
  {
    id: 'py_decorators/1',
    topicKeys: [Topic.PY_DECORATORS],
    step: 1,
    title: 'Decorators',
    idea: [
      lines(
        "A decorator is a function that takes a function and returns a replacement for it, usually a `wrapper` that does something before or after calling the original.",
        "`@deco` above `def f` means exactly `f = deco(f)`, and it runs once, when `def` runs, not on every call.",
      ),
      lines(
        "The wrapper takes `*args, **kwargs` and calls `fn(*args, **kwargs)`, so it works for a function of any signature.",
        "`@functools.wraps(fn)` on the wrapper copies the original's `__name__` and docstring, which would otherwise be the wrapper's.",
      ),
      lines(
        "Stacked decorators apply from the bottom up: `@a` over `@b` over `def f` means `f = a(b(f))`, so `a`'s wrapper runs first on each call.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `import functools

def deco(fn):
    @functools.wraps(fn)            # keep fn's name and docstring
    def wrapper(*args, **kwargs):   # accept any arguments
        # before the call
        result = fn(*args, **kwargs)
        # after the call
        return result               # hand the result back
    return wrapper                  # the replacement for fn

@deco                               # same as f = deco(f)
def f(x): ...`,
    },
    pitfall: lines(
      "A wrapper that calls `fn(*args, **kwargs)` but does not return its result makes every decorated function return `None`.",
      "End the wrapper with `return fn(*args, **kwargs)`, or keep the result in a variable and return that.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      code: `import functools

def logged(fn):
    @functools.wraps(fn)
    def wrapper(*args, **kwargs):
        print("calling", fn.__name__, args, kwargs)
        result = fn(*args, **kwargs)
        print("returned", result)
        return result
    return wrapper

@logged
def hold_fee(books, per_book=20):
    return books * per_book

total = hold_fee(3, per_book=25)
print(total, hold_fee.__name__)`,
      steps: [
        "Lines 12-13: `@logged` replaces `hold_fee` with the wrapper that `logged` returns.",
        "Line 16: calling `hold_fee` now calls the wrapper, with `args` holding `(3,)` and `kwargs` holding `{'per_book': 25}`.",
        "Line 7: the wrapper unpacks both into the original function, which returns 75.",
        "Line 9: the wrapper returns that result, so `total` is 75 and not `None`.",
        "Line 17: thanks to `functools.wraps`, the replacement still reports the name `hold_fee`.",
      ],
      output: `calling hold_fee (3,) {'per_book': 25}
returned 75
75 hold_fee`,
    },
    exercises: [
      'py-dec-beg-1',
      'pcpp-dec-1',
      'py-decorators-predict-1',
      'py-decorators-predict-4',
      'pcpp-dec-3',
    ],
  },
  {
    id: 'py_type_hints/1',
    topicKeys: [Topic.PY_TYPE_HINTS, Topic.PY_DATACLASSES],
    step: 1,
    title: 'Type Hints & Dataclasses',
    idea: [
      lines(
        "A type hint labels what a name should hold: `n: int` for a parameter, `-> str` for a return value and `count: int = 0` for a variable.",
        "Python keeps the labels but never checks them; a tool such as mypy, or a library that reads them, does.",
      ),
      lines(
        "Modern hints use the built-in names: `list[int]`, `dict[str, int]` and `tuple[int, str]`.",
        "`str | None` means a string or nothing (3.10+, the older spelling is `Optional[str]`), `Callable[[int], bool]` describes a function and `-> None` marks one that returns nothing.",
      ),
      lines(
        "`@dataclass` turns a class of annotated fields into a record: it writes `__init__`, `__repr__` and `__eq__` for you.",
        "A field can have a default, `qty: int = 0`, but a list or dict default needs `field(default_factory=list)` so each object gets its own.",
        "`frozen=True` makes the record read-only and `asdict(obj)` turns it into a dict.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `def area(w: float, h: float) -> float:   # parameter and return hints
    return w * h

names: list[str] = []                    # variable hint
nickname: str | None = None              # a string or nothing

from dataclasses import dataclass, field, asdict

@dataclass
class Item:
    sku: str                                       # required field
    qty: int = 0                                   # field with a default
    tags: list[str] = field(default_factory=list)  # a fresh list per object

asdict(Item("a1"))    # {'sku': 'a1', 'qty': 0, 'tags': []}`,
    },
    pitfall: lines(
      "A hint is a label, not a rule: nothing stops a call with the wrong type, and a dataclass does not convert or check its fields either.",
      "`Item(\"a1\", qty=\"many\")` builds fine and keeps the string, so run a type checker or validate the input yourself.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      code: `from dataclasses import dataclass, field, asdict

@dataclass
class Book:
    isbn: str
    copies: int = 1
    tags: list[str] = field(default_factory=list)

def total(books: list[Book]) -> int:
    return sum(b.copies for b in books)

a = Book("111", 3)
b = Book("222", copies="two")
c = Book("111", 3)
print(a)
print(a == c, a is c)
print(b.copies)
print(total([a, c]))
print(asdict(a))`,
      steps: [
        "Lines 3-7: `@dataclass` reads the three annotated fields and writes `__init__`, `__repr__` and `__eq__`; `tags` gets its own empty list for every `Book`.",
        "Lines 9-10: the hints say `total` takes a list of `Book` and returns an `int`, and the body just sums `copies`.",
        "Line 15: the generated `__repr__` shows the class name and every field.",
        "Line 16: the generated `__eq__` compares field by field, so `a == c` is `True`, while `is` asks for the same object and gives `False`.",
        "Line 17: `copies=\"two\"` breaks the `int` hint, yet Python stores it without complaint.",
        "Lines 18-19: `total` adds `3 + 3`, and `asdict` returns the fields as a plain dict.",
      ],
      output: `Book(isbn='111', copies=3, tags=[])
True False
two
6
{'isbn': '111', 'copies': 3, 'tags': []}`,
    },
    exercises: [
      'py-types-union-1',
      'py-types-predict-1',
      'py-type-hints-cloze-10',
      'py-dataclasses-cloze-2',
      'py-gap-typehints-2',
    ],
  },
  {
    id: 'py_comprehensions/1',
    topicKeys: [Topic.PY_COMPREHENSIONS],
    step: 1,
    title: 'Comprehensions',
    idea: [
      lines(
        "A comprehension builds a collection in one expression: `[expr for x in items]` is a list, `{expr for x in items}` a set and `{k: v for x in items}` a dict.",
        "It reads as \"expr, for each x in items\", and it replaces a loop that starts from an empty list and calls `.append`.",
      ),
      lines(
        "An `if` after the loop keeps only some items: `[x for x in items if x > 0]`.",
        "To choose between two values instead, put `a if cond else b` in front of the `for`: `[\"hi\" if x else \"lo\" for x in items]`.",
        "Extra `for` clauses nest, with the outer loop first.",
      ),
      lines(
        "With round brackets, `(expr for x in items)` is a generator expression: it produces values one at a time and builds no list.",
        "The loop variable stays inside the comprehension and does not leak into the code around it.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `[f(x) for x in xs]                # list: one value per item
[x for x in xs if keep(x)]        # filter: the if goes LAST
[a if cond(x) else b for x in xs] # choose: if/else goes FIRST
{x: f(x) for x in xs}             # dict
{f(x) for x in xs}                # set: duplicates dropped
[(i, j) for i in xs for j in ys]  # nested: outer loop first
(f(x) for x in xs)                # generator: lazy, no list`,
    },
    pitfall: lines(
      "The `if` at the end only filters, so `[x for x in xs if x > 0 else 0]` is a syntax error.",
      "When every item should produce a value, move the whole conditional in front of the `for`: `[x if x > 0 else 0 for x in xs]`.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      code: `titles = ["dune", "emma", "ubik", "hamlet", "dune"]
lengths = [len(t) for t in titles]
long_ones = [t.title() for t in titles if len(t) > 4]
tags = ["long" if len(t) > 4 else "short" for t in titles]
initial = {t: t[0].upper() for t in titles}
firsts = {t[0] for t in titles}
even_slots = [(i, t) for i, t in enumerate(titles) if i % 2 == 0]
print(lengths, long_ones)
print(tags)
print(initial)
print(sorted(firsts), even_slots)`,
      steps: [
        "Line 2: one value per title, so the list has five lengths.",
        "Line 3: the trailing `if` filters, so only \"hamlet\" is long enough to be kept and capitalised.",
        "Line 4: `if`/`else` in front of the `for` picks a label for every title, so the list still has five items.",
        "Line 5: a dict comprehension; the repeated key \"dune\" is written twice and ends up once.",
        "Line 6: a set comprehension keeps one copy of each first letter.",
        "Line 7: `enumerate` supplies the index, and the filter keeps positions 0, 2 and 4.",
        "Lines 8-11: sets have no order, so `sorted` gives a stable print.",
      ],
      output: `[4, 4, 4, 6, 4] ['Hamlet']
['short', 'short', 'short', 'long', 'short']
{'dune': 'D', 'emma': 'E', 'ubik': 'U', 'hamlet': 'H'}
['d', 'e', 'h', 'u'] [(0, 'dune'), (2, 'ubik'), (4, 'dune')]`,
    },
    exercises: [
      'py-comp-what-is',
      'py-comprehensions-predict-1',
      'py-comprehensions-parsons-1',
      'py-comprehensions-cloze-5',
      'py-comp-squared-evens',
    ],
  },
  {
    id: 'py_generators/1',
    topicKeys: [Topic.PY_GENERATORS],
    step: 1,
    title: 'Generators (yield, coroutines)',
    idea: [
      lines(
        "A function with `yield` in its body is a generator function.",
        "Calling it runs none of the body; it returns a generator object that produces values on demand.",
        "`next(gen)` runs the body up to the next `yield`, hands out that value and pauses, keeping its local variables.",
      ),
      lines(
        "A `for` loop, `list(gen)` or `sum(gen)` keep calling `next` for you.",
        "When the body ends, the generator raises `StopIteration`, which a `for` loop treats as the signal to stop.",
        "Because values are made one at a time, a generator can describe a huge or endless sequence without holding it in memory.",
      ),
      lines(
        "`yield from other` hands out every value of another iterable.",
        "`gen.send(x)` resumes the generator and makes the paused `yield` evaluate to `x`, which is how a generator works as a coroutine.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `def gen(n):
    for i in range(n):
        yield i * 2            # pause here, hand out the value

g = gen(3)                     # nothing has run yet
next(g)                        # 0: runs to the first yield
list(g)                        # [2, 4]: the rest
list(g)                        # []: already used up

evens = (i * 2 for i in range(3))   # generator expression
yield from items                    # inside a generator: hand out each item`,
    },
    pitfall: lines(
      "A generator can be read only once: after it is exhausted, a second loop or `list()` over it gives nothing and raises no error.",
      "Call the generator function again for a fresh one, or build a list when you need the values twice.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      code: `def read_pages(total):
    page = 1
    while page <= total:
        print("load", page)
        yield page
        page += 1

pages = read_pages(2)
print("created")
print(next(pages))
print(next(pages))
print(list(pages))
nums = (n * 2 for n in range(3))
print(sum(nums), sum(nums))`,
      steps: [
        "Line 8: calling `read_pages(2)` only creates the generator, so nothing has printed yet.",
        "Line 9: \"created\" is therefore the first line of output.",
        "Line 10: the first `next` runs the body to the first `yield`, printing \"load 1\" and handing out `1`.",
        "Line 11: the second `next` resumes after the `yield`, bumps `page`, and runs on to \"load 2\" and `2`.",
        "Line 12: the third request finds the loop finished, so `list` gets nothing and prints `[]`.",
        "Lines 13-14: the first `sum` uses up the generator expression (0 + 2 + 4), so the second `sum` starts from an empty one.",
      ],
      output: `created
load 1
1
load 2
2
[]
6 0`,
    },
    exercises: [
      'pe1-gen-1',
      'py-gen-predict-lazy',
      'py-gen-parsons-1',
      'pe1-gen-2',
    ],
  },
  {
    id: 'py_collections/1',
    topicKeys: [Topic.PY_COLLECTIONS, Topic.PY_ITERTOOLS],
    step: 1,
    title: 'Collections & Itertools',
    idea: [
      lines(
        "`collections` adds containers for common jobs.",
        "`Counter(items)` counts how often each item occurs and `.most_common(n)` lists the top n, `defaultdict(list)` creates a missing key's value on first use, and `deque(maxlen=n)` keeps only the last n items.",
        "`namedtuple(\"Point\", \"x y\")` makes a tuple whose fields also have names, and `ChainMap(top, base)` looks a key up in `top` first, then in `base`.",
      ),
      lines(
        "`itertools` builds and combines iterators without making lists.",
        "`chain(a, b)` joins iterables, `islice(it, start, stop)` takes a slice of any iterator, `product(a, b)` gives every pair and `combinations(xs, 2)` every unordered pair.",
        "`groupby(items, key)` groups runs of equal keys.",
      ),
      lines(
        "Most itertools functions return an iterator, so wrap them in `list()` to see the values.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `from collections import Counter, defaultdict, deque, namedtuple, ChainMap
from itertools import chain, islice, groupby, product

Counter(xs).most_common(2)        # [(item, count), ...] biggest first
groups = defaultdict(list)        # missing key starts as []
groups[k].append(v)
last3 = deque(xs, maxlen=3)       # drops the oldest on overflow
Pt = namedtuple("Pt", "x y")
ChainMap(overrides, defaults)     # lookups try overrides first

list(chain(a, b))                 # a then b
list(islice(it, 2, 5))            # items 2, 3, 4 of any iterator
list(product(a, b))               # every (a_item, b_item) pair
for key, run in groupby(sorted(xs)):   # runs of equal keys
    list(run)`,
    },
    pitfall: lines(
      "`groupby` only groups neighbours: equal items that are not next to each other end up in separate groups.",
      "Sort by the same key first, `groupby(sorted(xs))`, when you want one group per value.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      code: `from collections import Counter, defaultdict, deque
from itertools import chain, groupby, islice

loans = ["Dune", "Emma", "Dune", "Ubik", "Emma", "Dune"]
print(Counter(loans).most_common(2))
by_letter = defaultdict(list)
for t in loans:
    by_letter[t[0]].append(t)
print(dict(by_letter))
print(list(deque(loans, maxlen=3)))
print([k for k, g in groupby(loans)])
print([(k, len(list(g))) for k, g in groupby(sorted(loans))])
print(list(islice(chain(loans, "xy"), 5, 8)))`,
      steps: [
        "Line 5: `Counter` counts each title, and `most_common(2)` keeps the two biggest as (title, count) pairs.",
        "Lines 6-9: the first `by_letter[\"D\"]` creates an empty list by itself, so `.append` works on a brand new key.",
        "Line 10: with `maxlen=3` the deque keeps only the three newest loans.",
        "Line 11: no two neighbours are equal, so `groupby` on the raw list makes six single-item groups, and the keys repeat.",
        "Line 12: sorting first puts equal titles side by side, giving one group per title.",
        "Line 13: `chain` joins the list and the letters \"x\", \"y\"; `islice` takes positions 5, 6 and 7 of that stream.",
      ],
      output: `[('Dune', 3), ('Emma', 2)]
{'D': ['Dune', 'Dune', 'Dune'], 'E': ['Emma', 'Emma'], 'U': ['Ubik']}
['Ubik', 'Emma', 'Dune']
['Dune', 'Emma', 'Dune', 'Ubik', 'Emma', 'Dune']
[('Dune', 3), ('Emma', 2), ('Ubik', 1)]
['Dune', 'x', 'y']`,
    },
    exercises: [
      'py-coll-types-overview',
      'py-iter-what',
      'py-collections-predict-10',
      'py-itertools-predict-1',
      'py-collections-parsons-4',
    ],
  },
  {
    id: 'py_functools/1',
    topicKeys: [Topic.PY_FUNCTOOLS],
    step: 1,
    title: 'functools Deep Dive',
    idea: [
      lines(
        "`@lru_cache` (or `@cache`) remembers a function's results by its arguments, so a repeat call returns the stored value without running the body.",
        "`fn.cache_info()` shows the hits and misses.",
      ),
      lines(
        "`partial(fn, a)` makes a new function with some arguments already filled in: `partial(int, base=2)` reads binary.",
        "`reduce(fn, items, start)` folds a sequence into one value by applying `fn(acc, item)` left to right.",
      ),
      lines(
        "When you write a decorator, `@wraps(fn)` on the inner function copies the original's `__name__` and docstring onto it.",
        "`@cached_property`, `@singledispatch` and `@total_ordering` cover one-time attributes, type-based dispatch and comparison methods.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `from functools import lru_cache, partial, reduce, wraps

@lru_cache(maxsize=None)       # same arguments -> stored result
def f(x): ...
f.cache_info()                 # hits, misses, size

to_bin = partial(int, base=2)  # fn with arguments pre-filled
reduce(lambda acc, x: acc + x, xs, 0)   # fold left to right, start at 0

def deco(fn):
    @wraps(fn)                 # keep fn's name and docstring
    def inner(*a, **k): return fn(*a, **k)
    return inner`,
    },
    pitfall: lines(
      "A cached function skips its body on a repeat call, so any side effect inside it, such as a print or a write, happens only the first time.",
      "The arguments must be hashable too: passing a list raises `TypeError`, so pass a tuple instead.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      code: `from functools import lru_cache, partial, reduce

calls = []

@lru_cache(maxsize=None)
def fine(days):
    calls.append(days)
    return days * 5

print(fine(3), fine(3), fine(4))
print(calls, fine.cache_info().hits)
pay = partial(int, base=2)
print(pay("101"))
print(reduce(lambda acc, n: acc + n, [4, 5, 6], 100))`,
      steps: [
        "Lines 5-8: `lru_cache` wraps `fine`; the body records each real run in `calls`.",
        "Line 10: `fine(3)` runs the body, the second `fine(3)` is answered from the cache, and `fine(4)` runs it again.",
        "Line 11: the body ran only for 3 and 4, and the cache served one hit.",
        "Lines 12-13: `partial(int, base=2)` is `int` with the base fixed, so `\"101\"` reads as binary five.",
        "Line 14: `reduce` starts at 100 and adds 4, 5 and 6 in turn.",
      ],
      output: `15 15 20
[3, 4] 1
5
115`,
    },
    exercises: [
      'py-functools-1',
      'py-functools-predict-1',
      'py-functools-cloze-5',
      'py-functools-3',
    ],
  },
  {
    id: 'py_context_managers/1',
    topicKeys: [Topic.PY_CONTEXT_MANAGERS],
    step: 1,
    title: 'Context Managers',
    idea: [
      lines(
        "`with thing as name:` runs setup, then the block, then cleanup, and the cleanup runs even if the block raises.",
        "Files, locks and database connections use it so they are always released.",
      ),
      lines(
        "A class becomes a context manager with two methods: `__enter__` runs first and its return value is what `as` binds, and `__exit__(kind, err, tb)` runs last.",
        "If `__exit__` returns `True` the exception is swallowed, otherwise it carries on.",
      ),
      lines(
        "Often it is shorter to write a generator and decorate it with `@contextmanager`: the code before `yield` is the setup, the yielded value is bound by `as`, and the code after is the cleanup.",
        "`ExitStack` collects any number of context managers that you only know about at run time.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `from contextlib import contextmanager, ExitStack

class Res:
    def __enter__(self):
        return self                  # bound by "as"
    def __exit__(self, kind, err, tb):
        ...                          # always runs; return True to swallow err

@contextmanager
def res():
    setup()
    try:
        yield value                  # the block runs here
    finally:
        cleanup()                    # runs even if the block raised

with res() as v:
    ...
with ExitStack() as stack:
    files = [stack.enter_context(open(p)) for p in paths]`,
    },
    pitfall: lines(
      "In a `@contextmanager` generator, an error in the block is raised at the `yield`, so code after it is skipped unless it sits in a `finally`.",
      "Put the cleanup in `try`/`finally` around the `yield`, or it will not run when the block fails.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      code: `from contextlib import contextmanager

log = []

@contextmanager
def opened(label):
    log.append("open " + label)
    try:
        yield label.upper()
    finally:
        log.append("close " + label)

with opened("desk") as shown:
    log.append("use " + shown)
try:
    with opened("lamp"):
        raise KeyError("boom")
except KeyError:
    log.append("caught")
print(log)`,
      steps: [
        "Lines 5-11: everything before `yield` is setup and everything in `finally` is cleanup; the yielded \"DESK\" is what `as` receives.",
        "Lines 13-14: the block runs between \"open desk\" and \"close desk\", with `shown` holding the yielded value.",
        "Lines 15-17: the `KeyError` is raised inside the block, and the generator sees it at the `yield`.",
        "Lines 8-11: because the cleanup is in `finally`, \"close lamp\" is still recorded before the error moves on.",
        "Lines 18-19: the `with` does not swallow the error, so the `except` runs and adds \"caught\" last.",
      ],
      output: `['open desk', 'use DESK', 'close desk', 'open lamp', 'close lamp', 'caught']`,
    },
    exercises: [
      'py-ctx-what',
      'py-ctx-exitstack-parsons',
      'py-context-managers-cloze-3',
      'py-ctx-vs-try-finally',
      'py-context-managers-predict-1',
    ],
  },
  {
    id: 'py_magic_methods/1',
    topicKeys: [Topic.PY_MAGIC_METHODS],
    step: 1,
    title: 'Magic Methods',
    idea: [
      lines(
        "A magic (dunder) method is a method with double underscores on both sides that Python calls for you when an object meets a built-in feature.",
        "You never call `__len__` yourself; you write `len(obj)` and Python calls it.",
      ),
      lines(
        "`__repr__` gives the developer view and `__str__` the friendly one: `print(obj)` uses `__str__` and falls back to `__repr__`, while lists and the debugger show `__repr__`.",
        "`__eq__` defines `==`, `__lt__` defines `<`, and `__add__` defines `+`.",
      ),
      lines(
        "`__len__` powers `len(obj)` and truthiness, `__iter__` makes the object work in `for` and `in`, and `__getitem__` powers `obj[i]`.",
        "`__call__` lets an instance be called like a function, and `__hash__` lets it be a dict key or set member.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `class Box:
    def __init__(self, items): self.items = list(items)
    def __repr__(self): return f"Box({self.items!r})"   # repr(b), debugging
    def __str__(self): return f"{len(self)} items"      # print(b), str(b)
    def __len__(self): return len(self.items)           # len(b), bool(b)
    def __iter__(self): return iter(self.items)         # for x in b, x in b
    def __getitem__(self, i): return self.items[i]      # b[i]
    def __add__(self, other): return Box(self.items + other.items)  # b + c
    def __eq__(self, other): return self.items == other.items       # b == c
    def __call__(self, x): return x in self.items       # b(x)`,
    },
    pitfall: lines(
      "Only `__str__` is used by `print`, but a list prints its members with `__repr__`, so a class with just `__str__` shows an unhelpful `<Box object at 0x...>` inside a list.",
      "Write `__repr__` first; `__str__` can be added later, and without it Python reuses `__repr__`.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      code: `class Shelf:
    def __init__(self, *books):
        self.books = list(books)
    def __repr__(self):
        return f"Shelf({self.books!r})"
    def __str__(self):
        return f"{len(self)} books"
    def __len__(self):
        return len(self.books)
    def __iter__(self):
        return iter(self.books)
    def __add__(self, other):
        return Shelf(*self.books, *other.books)

shelf = Shelf("Dune", "Emma")
more = shelf + Shelf("Ubik")
print(shelf)
print([shelf])
print(len(more), "Emma" in more, bool(Shelf()))
print(list(more))`,
      steps: [
        "Line 17: `print(shelf)` calls `__str__`, which builds its text from `len(self)`, so `__len__` runs too.",
        "Line 18: a list shows its members with `__repr__`, so the output is the developer view.",
        "Line 16: `+` calls `__add__`, which returns a new `Shelf` holding all three books.",
        "Line 19: `\"Emma\" in more` has no `__contains__`, so Python walks `__iter__`; `bool(Shelf())` uses `__len__`, and a length of 0 is falsy.",
        "Line 20: `list(more)` also walks `__iter__`.",
      ],
      output: `2 books
[Shelf(['Dune', 'Emma'])]
3 True False
['Dune', 'Emma', 'Ubik']`,
    },
    exercises: [
      'py-gap-magic-1',
      'py-adv-magic-3',
      'py-magic-methods-predict-1',
      'py-magic-methods-parsons-8',
    ],
  },
  {
    id: 'py_oop_advanced/1',
    topicKeys: [Topic.PY_OOP_ADVANCED],
    step: 1,
    title: 'Advanced OOP & ABCs',
    idea: [
      lines(
        "A subclass can override a method, and `super().method()` calls the parent's version so you extend it instead of rewriting it.",
        "That includes `super().__init__(...)`, which runs the parent's setup.",
      ),
      lines(
        "An abstract base class, `class Base(ABC)`, marks methods with `@abstractmethod`.",
        "You cannot create an instance of `Base`, or of a subclass that has not overridden every abstract method, so the class states a contract its children must meet.",
      ),
      lines(
        "With several parents, Python searches classes in the method resolution order (MRO), which `Cls.__mro__` lists.",
        "`@property` exposes a method as an attribute, and `@x.setter` lets assignment run code.",
        "`__slots__` fixes the attribute names to save memory, and `__name` is mangled to `_Class__name`.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `from abc import ABC, abstractmethod

class Base(ABC):
    def __init__(self, n): self.n = n
    @abstractmethod
    def run(self): ...               # children must override

class Child(Base):
    def __init__(self, n, m):
        super().__init__(n)          # run the parent's setup
        self.m = m
    def run(self):
        return super().other() + 1   # call the parent's version

    @property
    def double(self): return self.n * 2   # child.double, no brackets

Child.__mro__                        # search order for attributes`,
    },
    pitfall: lines(
      "A subclass that defines its own `__init__` replaces the parent's, so the parent's attributes never exist unless it calls `super().__init__(...)`.",
      "The error appears later, as an `AttributeError` on some method that expects them.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      code: `from abc import ABC, abstractmethod

class Item(ABC):
    def __init__(self, title):
        self.title = title
    @abstractmethod
    def fee(self, days): ...

class Book(Item):
    def fee(self, days):
        return days * 2

class Dvd(Book):
    def fee(self, days):
        return super().fee(days) + 5

try:
    Item("x")
except TypeError:
    print("abstract")
print(Book("Dune").fee(3), Dvd("Ubik").fee(3))
print([c.__name__ for c in Dvd.__mro__])`,
      steps: [
        "Lines 6-7: \"fee\" is abstract, so `Item` is a contract, not something to create.",
        "Lines 17-20: building `Item` raises `TypeError`, so \"abstract\" is printed.",
        "Lines 9-11: `Book` overrides `fee`, and it inherits `__init__` from `Item`, which sets `title`.",
        "Lines 13-15: `Dvd.fee` calls `super().fee(days)`, which is `Book`'s version (6), and adds 5.",
        "Line 21: `3 * 2` is 6 for the book and `6 + 5` is 11 for the DVD.",
        "Line 22: the MRO lists the classes searched, child first, then each parent, ending with `object`.",
      ],
      output: `abstract
6 11
['Dvd', 'Book', 'Item', 'ABC', 'object']`,
    },
    exercises: [
      'py-oopadv-beg-1',
      'pcpp-inherit-1',
      'py-oop-cloze-5',
      'py-oop-predict-2',
    ],
  },
  {
    id: 'py_metaclasses/1',
    topicKeys: [Topic.PY_METACLASSES],
    step: 1,
    title: 'Metaclasses & Introspection',
    idea: [
      lines(
        "In Python a class is an object too, and it was made by another class.",
        "`type(obj)` gives an object's class, and `type(Cls)` gives the class of a class, which is `type` unless you say otherwise.",
        "That class-of-a-class is the metaclass.",
      ),
      lines(
        "`type(\"Name\", (Base,), {\"x\": 1})` builds a class at run time from a name, a tuple of parents and a dict of attributes.",
        "`class C(metaclass=Meta)` builds `C` with your own metaclass, and a method such as `Meta.__init__(cls, name, bases, ns)` then runs once for every class created that way.",
        "For simple hooks, `__init_subclass__` on the parent does the same job with less machinery.",
      ),
      lines(
        "Introspection reads an object's structure: `Cls.__name__`, `Cls.__bases__`, `Cls.__mro__`, `obj.__dict__`, `hasattr`, `getattr(obj, \"x\", default)` and the `inspect` module.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `class Meta(type):
    def __init__(cls, name, bases, ns):   # runs for each class made with Meta
        super().__init__(name, bases, ns)

class C(metaclass=Meta): ...

type(C)                          # Meta: the class of a class
C.__bases__                      # (object,): the parents
D = type("D", (C,), {"x": 1})    # a class made at run time
hasattr(D, "x")                  # True
getattr(D, "y", "none")          # 'none': default instead of an error
D.__dict__.keys()                # the attributes D defines`,
    },
    pitfall: lines(
      "A metaclass is not a parent class: `type(Dog)` is the class that built `Dog`, while `Dog.__bases__` lists the classes it inherits from.",
      "`isinstance(Dog(), Animal)` follows inheritance, and `isinstance(Dog, Meta)` follows the metaclass.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      code: `class Registry(type):
    names = []
    def __init__(cls, name, bases, ns):
        super().__init__(name, bases, ns)
        Registry.names.append(name)

class Plugin(metaclass=Registry):
    pass

class Csv(Plugin):
    pass

Tiny = type("Tiny", (Csv,), {"size": 3})
print(Registry.names)
print(type(Csv).__name__, type(Csv()).__name__, Csv.__bases__[0].__name__)
print(Tiny.size, isinstance(Tiny(), Plugin), isinstance(Csv, Registry))
print(hasattr(Tiny, "size"), getattr(Tiny, "missing", "none"))`,
      steps: [
        "Lines 1-5: `Registry` is a metaclass, a subclass of `type`; its `__init__` runs each time a class is built with it.",
        "Lines 7-11: `Plugin` and `Csv` are created, so their names are recorded; `Csv` gets the metaclass by inheriting from `Plugin`.",
        "Line 13: `type(...)` with three arguments builds `Tiny` at run time, and the recorded names grow to include it.",
        "Line 15: `type(Csv)` is `Registry`, `type(Csv())` is `Csv`, and `Csv.__bases__[0]` is its parent `Plugin`.",
        "Line 16: `Tiny` inherits from `Plugin`, so the instance check is `True`, and `Csv` is itself an instance of `Registry`.",
        "Line 17: `hasattr` finds the `size` that was passed in the dict, and `getattr` returns its default for a missing name.",
      ],
      output: `['Plugin', 'Csv', 'Tiny']
Registry Csv Plugin
3 True True
True none`,
    },
    exercises: [
      'py-meta-beg-1',
      'py-meta-beg-3',
      'py-meta-int-2',
      'pcpp-meta-6',
    ],
  },
  {
    id: 'py_regex/1',
    topicKeys: [Topic.PY_REGEX],
    step: 1,
    title: 'Regex',
    idea: [
      lines(
        "The `re` module finds text by pattern.",
        "Write patterns as raw strings, `r\"\\d+\"`, so backslashes reach the regex engine unchanged.",
        "`\\d` is a digit, `\\w` a word character, `\\s` whitespace, `.` any character, and `+`, `*` and `?` repeat the item before them.",
      ),
      lines(
        "`re.search(p, s)` finds the first match anywhere, `re.match` only at the start, `re.fullmatch` only if the whole string matches, and `re.findall` returns every match as a list.",
        "A match object gives `.group()`, and parentheses capture parts: `(\\d+)` is group 1, and `(?P<id>\\d+)` names it.",
      ),
      lines(
        "`re.sub(p, repl, s)` replaces matches.",
        "Repeats are greedy and take as much as they can, so `<.+>` swallows too much; add `?`, as in `<.+?>`, to take as little as possible.",
        "No match gives `None`, which is why you test before calling `.group()`.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `import re

re.search(r"\\d+", s)          # first match anywhere, or None
re.match(r"\\d+", s)           # must match at the START
re.fullmatch(r"\\d+", s)       # the WHOLE string must match
re.findall(r"id=(\\d+)", s)    # list of the captured groups
m = re.search(r"(?P<n>\\d+)", s)
m.group("n") if m else None   # None-check before using the match
re.sub(r"\\s+", " ", s)        # replace every match
re.findall(r"<.+?>", s)       # lazy: shortest match`,
    },
    pitfall: lines(
      "`re.match` looks only at the start of the string, so `re.match(r\"\\d+\", \"id 42\")` is `None` even though a number is there.",
      "Use `re.search` to look anywhere, and `re.fullmatch` to validate a whole value.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      code: `import re

log = "err 404 at /home; err 500 at /api; ok 200 at /"
print(re.match(r"\\d+", log))
print(re.search(r"\\d+", log).group())
print(re.findall(r"err (\\d+)", log))
m = re.search(r"(?P<code>\\d+) at (?P<path>/\\w*)", log)
print(m["code"], m.group("path"))
print(re.sub(r"\\d+", "N", log))
print(bool(re.fullmatch(r"\\d+", "404x")), re.findall(r"<.+?>", "<a><b>"))`,
      steps: [
        "Line 4: the string starts with \"err\", so `match` finds no digits at the start and returns `None`.",
        "Line 5: `search` scans on and finds \"404\"; `.group()` returns the matched text.",
        "Line 6: `findall` with one group returns just the captured digits of each \"err\" entry, so \"ok 200\" is left out.",
        "Lines 7-8: the named groups pick the first code and the path after it.",
        "Line 9: `sub` replaces every run of digits with \"N\".",
        "Line 10: `fullmatch` fails because of the trailing \"x\", and the lazy `.+?` stops at the first `>`, giving two tags.",
      ],
      output: `None
404
['404', '500']
404 /home
err N at /home; err N at /api; ok N at /
False ['<a>', '<b>']`,
    },
    exercises: [
      'py-regex-match-vs-search',
      'py-regex-predict-1',
      'py-regex-parsons-1',
      'py-regex-fullmatch-email',
    ],
  },
  {
    id: 'py_logging/1',
    topicKeys: [Topic.PY_LOGGING],
    step: 1,
    title: 'Logging (Python stdlib)',
    idea: [
      lines(
        "`logging` replaces `print` for messages that a program keeps: each one has a level, a name and a format, and you choose where it goes.",
        "The levels, from least to most serious, are DEBUG, INFO, WARNING, ERROR and CRITICAL.",
      ),
      lines(
        "`logging.basicConfig(level=..., format=...)` sets up the root logger once.",
        "Each module then asks for its own logger with `log = logging.getLogger(__name__)` and calls `log.info(...)`, `log.warning(...)` and so on.",
        "A logger shows a message only if its level is at or above the logger's threshold, and the default threshold is WARNING.",
      ),
      lines(
        "Pass values as arguments, `log.info(\"lent %s\", title)`, not as a ready-made string: Python builds the text only if the message is shown.",
        "Logger names form a tree split on dots, so `\"shop.loans\"` is a child of `\"shop\"` and inherits its level and handlers.",
        "`log.exception(...)` inside an `except` block adds the traceback.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `import logging

logging.basicConfig(
    level=logging.INFO,                        # show INFO and above
    format="%(levelname)s %(name)s %(message)s",
)
log = logging.getLogger(__name__)              # one logger per module

log.debug("hidden at INFO level")
log.info("lent %s to %s", title, who)          # lazy %-style arguments
log.warning("late: %d days", days)
try:
    risky()
except Exception:
    log.exception("failed")                    # ERROR plus the traceback`,
    },
    pitfall: lines(
      "Out of the box only WARNING and above are shown, so `log.info(...)` prints nothing until you set the level.",
      "Call `basicConfig(level=logging.INFO)` once at start-up, not in every module.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      code: `import logging
import sys

logging.basicConfig(
    level=logging.INFO,
    stream=sys.stdout,
    format="%(levelname)s %(name)s %(message)s",
)
log = logging.getLogger("shop.loans")
log.debug("hidden %s", 1)
log.info("lent %s to %s", "Dune", "Ann")
log.warning("late: %d days", 4)
logging.getLogger("shop").setLevel(logging.ERROR)
log.warning("muted")
log.error("kept")`,
      steps: [
        "Lines 4-8: `basicConfig` sets the root level to INFO and the layout of each line; `stream=sys.stdout` sends it to the output.",
        "Line 10: DEBUG is below INFO, so the message is dropped.",
        "Line 11: INFO passes, and the `%s` slots are filled with \"Dune\" and \"Ann\".",
        "Line 12: the warning shows with its level name and the logger's name.",
        "Lines 13-14: raising the parent logger \"shop\" to ERROR also applies to its child \"shop.loans\", so the next warning is muted.",
        "Line 15: an ERROR is at the threshold, so it is shown.",
      ],
      output: `INFO shop.loans lent Dune to Ann
WARNING shop.loans late: 4 days
ERROR shop.loans kept`,
    },
    exercises: [
      'py-logging-1',
      'py-logging-predict-1',
      'py-logging-parsons-1',
      'py-logging-cloze-3',
    ],
  },
  {
    id: 'py_datetime_paths/1',
    topicKeys: [Topic.PY_DATETIME_PATHS],
    step: 1,
    title: 'Dates, Times & Paths',
    idea: [
      lines(
        "`datetime(2025, 1, 31, 9, 30)` holds a date and time, and `timedelta(days=30)` holds a length of time.",
        "Adding or subtracting a `timedelta` moves a `datetime`, and subtracting two datetimes gives a `timedelta`.",
        "`dt.strftime(\"%Y-%m-%d\")` turns one into text, `datetime.strptime(text, fmt)` parses text back, and `fromisoformat` and `.isoformat()` use the ISO layout.",
      ),
      lines(
        "A datetime is naive when it has no time zone and aware when it carries one, such as `tzinfo=timezone.utc`.",
        "Store and compare times in UTC, and convert to a local zone only when you show them.",
      ),
      lines(
        "`pathlib.Path` treats a file path as an object: `Path(\"data\") / \"a.csv\"` joins parts, and `.name`, `.stem`, `.suffix` and `.parent` take it apart.",
        "`.exists()`, `.read_text()`, `.write_text()` and `.glob(\"*.csv\")` work on the file system.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `from datetime import datetime, timedelta, timezone
from pathlib import Path

dt = datetime(2025, 1, 31, 9, 30)               # naive
utc = datetime.now(timezone.utc)                # aware
dt + timedelta(days=30)                         # a later datetime
dt.strftime("%d %b %Y")                         # datetime -> text
datetime.strptime("2025-03-01", "%Y-%m-%d")     # text -> datetime
utc.isoformat()                                 # '2025-...+00:00'

p = Path("data") / "loans" / "2025.csv"         # join with /
p.name, p.stem, p.suffix, p.parent              # take it apart
p.with_suffix(".json")                          # same path, new extension`,
    },
    pitfall: lines(
      "A naive and an aware datetime cannot be compared or subtracted: Python raises `TypeError` rather than guess.",
      "Make both aware (attach `tzinfo=timezone.utc` or use `datetime.now(timezone.utc)`) before you mix them.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      code: `from datetime import datetime, timedelta, timezone
from pathlib import Path

due = datetime(2025, 1, 31, 9, 30)
print(due + timedelta(days=30))
print(due.strftime("%d %b %Y"), datetime.strptime("2025-03-01", "%Y-%m-%d").weekday())
utc = datetime(2025, 1, 31, 9, 30, tzinfo=timezone.utc)
try:
    print(due < utc)
except TypeError:
    print("naive vs aware")
print((utc - timedelta(hours=10)).isoformat())
p = Path("data") / "loans" / "2025.csv"
print(p, p.suffix, p.stem, p.parent.name, p.with_suffix(".json"))`,
      steps: [
        "Line 5: January has 31 days and February 2025 has 28, so 30 days after 31 January is 2 March, at the same time of day.",
        "Line 6: `strftime` writes day, short month and year; 1 March 2025 was a Saturday, and `weekday()` counts Monday as 0, so it gives 5.",
        "Lines 8-11: `due` has no time zone and `utc` has one, so the comparison raises `TypeError` and the `except` prints its message.",
        "Line 12: subtracting ten hours from the aware time crosses midnight, and `isoformat` shows the `+00:00` offset.",
        "Lines 13-14: `/` joins the three parts, `.stem` drops the extension, `.parent.name` is the last folder, and `with_suffix` swaps the extension.",
      ],
      output: `2025-03-02 09:30:00
31 Jan 2025 5
naive vs aware
2025-01-30T23:30:00+00:00
data/loans/2025.csv .csv 2025 loans data/loans/2025.json`,
    },
    exercises: [
      'py-datetime-1',
      'py-datetime-paths-predict-2',
      'py-datetime-paths-cloze-1',
      'py-datetime-4',
      'py-paths-2',
    ],
  },
  {
    id: 'py_serialization/1',
    topicKeys: [Topic.PY_SERIALIZATION],
    step: 1,
    title: 'JSON & Serialization',
    idea: [
      lines(
        "Serialization turns Python data into text or bytes you can store or send, and deserialization turns it back.",
        "For JSON, `json.dumps(obj)` returns a string and `json.loads(text)` parses one, while `json.dump(obj, f)` and `json.load(f)` do the same with an open file.",
      ),
      lines(
        "JSON knows only objects, arrays, strings, numbers, `true`, `false` and `null`.",
        "They map to `dict`, `list`, `str`, `int`/`float`, `True`, `False` and `None`.",
        "`indent=2` and `sort_keys=True` make the text readable.",
      ),
      lines(
        "Anything else, such as a `date`, a `set` or your own class, raises `TypeError` unless you pass `default=fn` to convert it.",
        "The round trip is not exact either: a tuple comes back as a list, and a dict key such as `3` comes back as `\"3\"`.",
        "`pickle` can store almost any Python object, but never unpickle data from a source you do not trust.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `import json

text = json.dumps(obj)                  # Python -> JSON string
text = json.dumps(obj, indent=2, sort_keys=True)   # readable
data = json.loads(text)                 # JSON string -> Python

with open(path, "w") as f:
    json.dump(obj, f)                   # straight to a file
with open(path) as f:
    data = json.load(f)                 # straight from a file

json.dumps(obj, default=str)            # convert unknown types with str`,
    },
    pitfall: lines(
      "`json.dumps` refuses types JSON has no word for, so a `datetime`, a `set` or a custom object raises `TypeError`.",
      "Convert them first, or pass `default=` with a function that returns something JSON can hold, such as a string or a list.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      code: `import json
from datetime import date

book = {"id": 7, "tags": ("sf", "classic"), "out": None, "ok": True, 3: "three"}
text = json.dumps(book)
print(text)
back = json.loads(text)
print(back["tags"], back["3"], back == book)
print(json.dumps({"due": date(2025, 5, 1)}, default=str))
try:
    json.dumps({"s": {1, 2}})
except TypeError:
    print("set is not JSON")
print(json.dumps({"b": 1, "a": [1, 2]}, indent=2, sort_keys=True))`,
      steps: [
        "Line 5: the tuple becomes an array, `None` becomes `null`, `True` becomes `true` and the key `3` becomes the string \"3\".",
        "Lines 7-8: parsing gives a list and a string key, so the result is no longer equal to the original dict.",
        "Line 9: `date` is not a JSON type, so `default=str` turns it into text.",
        "Lines 10-13: a `set` has no JSON form, so the `TypeError` is caught and reported.",
        "Line 14: `sort_keys` orders the keys, and `indent=2` puts each array item on its own line.",
      ],
      output: `{"id": 7, "tags": ["sf", "classic"], "out": null, "ok": true, "3": "three"}
['sf', 'classic'] three False
{"due": "2025-05-01"}
set is not JSON
{
  "a": [
    1,
    2
  ],
  "b": 1
}`,
    },
    exercises: [
      'py-json-1',
      'py-serialization-predict-1',
      'py-serialization-parsons-1',
      'py-json-2',
    ],
  },
];
