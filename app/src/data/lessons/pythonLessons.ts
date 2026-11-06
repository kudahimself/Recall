/**
 * Backend (Python) lessons, one per topic, in course order.
 *
 * Sections 1-5, Python Fundamentals, Python Advanced, Django, Django Advanced &
 * Deployment and DRF Production Patterns: every topic.
 *
 * Prose keeps one sentence per source line (`lines`); check-lessons.js runs
 * each worked example on `python3 -I` and compares what it prints with `output`.
 * A Django example needs a project to run, so it sets `runs: false` and its
 * output is checked by hand.
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
  {
    id: 'py_testing_basics/1',
    topicKeys: [Topic.PY_TESTING_BASICS],
    step: 1,
    title: 'Testing Basics (pytest)',
    idea: [
      lines(
        "pytest collects files named `test_*.py` and runs every function whose name starts with `test_`.",
        "A test is plain Python that checks results with `assert`; it passes if nothing is raised and fails if an `assert` is false, and pytest shows the values on both sides.",
      ),
      lines(
        "A tidy test has three parts: arrange the inputs, act by calling the code, and assert on the result.",
        "`with pytest.raises(TypeError):` passes only if its block raises that error, and `match=\"text\"` also checks the message.",
      ),
      lines(
        "`@pytest.mark.parametrize(\"a, b, want\", [(1, 1, 2), (0, 5, 5)])` runs one test per row, each reported on its own.",
        "Run everything with `pytest`, one file with `pytest test_x.py`, and pick tests by name with `-k word`.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `# test_math.py
import pytest
from math_tools import add

def test_add():
    result = add(2, 3)            # act
    assert result == 5            # assert

def test_bad_input():
    with pytest.raises(TypeError):
        add(1, "a")               # must raise TypeError

@pytest.mark.parametrize("a, b, want", [(1, 1, 2), (0, 5, 5)])
def test_cases(a, b, want):       # runs once per row
    assert add(a, b) == want`,
    },
    pitfall: lines(
      "pytest only runs what it can find: a function not named `test_...`, or a file not named `test_*.py`, is skipped without any warning.",
      "A helper called `check_total` will never run, so name every test with the `test_` prefix and look for the dot in the report.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      code: `import pathlib, tempfile
import pytest

SRC = '''
import pytest

def add(a, b):
    return a + b

def test_add():
    assert add(2, 3) == 5

def test_wrong():
    assert add(2, 2) == 5

def test_error():
    with pytest.raises(TypeError):
        add(1, "a")

@pytest.mark.parametrize("a, b, want", [(1, 1, 2), (0, 5, 5)])
def test_cases(a, b, want):
    assert add(a, b) == want

def check_total():
    assert False
'''

class Show:
    def pytest_runtest_logreport(self, report):
        if report.when == "call":
            print(report.nodeid.split("::")[1], report.outcome)

folder = pathlib.Path(tempfile.mkdtemp())
(folder / "test_math.py").write_text(SRC)
print(int(pytest.main(["-p", "no:terminal", "-p", "no:cacheprovider", str(folder)], plugins=[Show()])))`,
      steps: [
        "Lines 4-26: `SRC` holds a small test file, the part you would normally save as `test_math.py`; the rest of the example only runs it and reports.",
        "Lines 10-11: `test_add` asserts that `add(2, 3)` equals 5, which holds, so it passes.",
        "Lines 13-14: `test_wrong` asserts a false statement, so pytest marks it failed.",
        "Lines 16-18: `pytest.raises` passes because `1 + \"a\"` raises `TypeError`.",
        "Lines 20-22: `parametrize` makes two tests from one function, named after the row values.",
        "Lines 24-25: `check_total` does not start with `test_`, so it never runs and never appears in the report.",
        "Lines 28-35: a small plugin prints each test's outcome, and `pytest.main` returns 1 because one test failed.",
      ],
      output: `test_add passed
test_wrong failed
test_error passed
test_cases[1-1-2] passed
test_cases[0-5-5] passed
1`,
    },
    exercises: [
      'py-gap-testing-1',
      'py-ptest-discovery-1',
      'py-testing-predict-3',
      'py-gap-testing-3',
    ],
  },
  {
    id: 'py_fixtures/1',
    topicKeys: [Topic.PY_FIXTURES],
    step: 1,
    title: 'Pytest Fixtures',
    idea: [
      lines(
        "A fixture is a function marked `@pytest.fixture` that prepares something a test needs: data, a file, a connection.",
        "A test asks for it by naming it as a parameter, and pytest runs the fixture and passes in what it returned.",
      ),
      lines(
        "By default every test gets a fresh copy, so tests cannot leak changes into each other.",
        "`scope=\"module\"` or `scope=\"session\"` shares one instance across many tests, which suits slow setup such as a database connection.",
      ),
      lines(
        "A fixture that uses `yield` instead of `return` also has cleanup: the code before `yield` is setup, the yielded value goes to the test, and the code after runs when the test is over, even if it failed.",
        "Fixtures can request other fixtures, and a fixture placed in `conftest.py` is available to every test beside it.",
        "Built-in fixtures include `tmp_path` for a temporary folder and `monkeypatch` for temporary changes.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `import pytest

@pytest.fixture
def cart():                          # function scope: new for each test
    items = []                       # setup
    yield items                      # value handed to the test
    items.clear()                    # cleanup, runs after the test

@pytest.fixture(scope="module")
def conn():                          # one shared instance per file
    return connect()

def test_add(cart, conn):            # request fixtures by parameter name
    cart.append("x")
    assert cart == ["x"]

def test_file(tmp_path):             # built-in: a fresh temp folder
    (tmp_path / "a.txt").write_text("hi")`,
    },
    pitfall: lines(
      "Call a fixture by name as a parameter, never as a function: writing `cart()` in a test fails, and a fixture with a wider scope is shared, so a test that changes it affects the next one.",
      "Keep mutable state in the default function scope, and give shared fixtures only read-only or reset-after-use data.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      code: `import pathlib, tempfile
import pytest

SRC = '''
import pytest

@pytest.fixture
def shelf():
    print("setup")
    yield ["Dune"]
    print("teardown")

@pytest.fixture(scope="module")
def conn():
    print("connect")
    return "db"

def test_add(shelf, conn):
    shelf.append("Emma")
    assert len(shelf) == 2

def test_fresh(shelf, conn):
    assert shelf == ["Dune"]
'''

class Show:
    def pytest_runtest_logreport(self, report):
        if report.when == "call":
            print(report.nodeid.split("::")[1], report.outcome)

folder = pathlib.Path(tempfile.mkdtemp())
(folder / "test_shelf.py").write_text(SRC)
pytest.main(["-s", "-p", "no:terminal", "-p", "no:cacheprovider", str(folder)], plugins=[Show()])`,
      steps: [
        "Lines 4-24: `SRC` is the test file; the rest of the example runs it, with `-s` so the prints show.",
        "Lines 7-11: `shelf` prints \"setup\", hands a one-book list to the test, then prints \"teardown\" afterwards.",
        "Lines 13-16: `conn` has module scope, so \"connect\" prints once for the whole file.",
        "Lines 18-20: `test_add` receives the fixtures by name and appends a second book to its own list.",
        "Lines 22-23: `test_fresh` gets a brand new `shelf`, so it sees one book, not two.",
        "The output shows \"connect\" once, and \"setup\" and \"teardown\" around each test.",
      ],
      output: `connect
setup
test_add passed
teardown
setup
test_fresh passed
teardown`,
    },
    exercises: [
      'py-fix-whatis-1',
      'py-fix-predict-1',
      'py-testing-parsons-4',
      'py-fix-cloze-1',
    ],
  },
  {
    id: 'py_mocking/1',
    topicKeys: [Topic.PY_MOCKING],
    step: 1,
    title: 'Mocking & Patching',
    idea: [
      lines(
        "A mock is a stand-in object from `unittest.mock` that you put in place of a real collaborator such as an API client or the clock.",
        "Any attribute you read or method you call on a `Mock` exists and records the call.",
      ),
      lines(
        "`m.return_value = x` sets what calling `m()` returns, and `m.side_effect = [a, b]` returns `a` then `b`, while `m.side_effect = SomeError(...)` makes the call raise.",
        "Afterwards check the calls with `m.assert_called_once_with(args)`, `m.call_count` and `m.call_args`.",
      ),
      lines(
        "`patch(\"module.name\")` swaps a real name for a mock for the length of a `with` block or a decorated test, then puts the real one back.",
        "Patch the name where it is looked up, not where it was defined.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `from unittest.mock import Mock, patch

m = Mock()
m.get.return_value = {"id": 1}        # m.get(...) returns this
m.get.side_effect = [10, ValueError]  # first call 10, then raises
m.get("a")
m.get.assert_called_once_with("a")    # fails if args or count differ
m.get.call_count, m.get.call_args     # how it was called

with patch("app.service.requests.get") as fake:   # name as used by app.service
    fake.return_value.status_code = 200
    run()                                         # code under test sees the fake`,
    },
    pitfall: lines(
      "`patch` must name the place the code under test looks the name up: if `app.py` does `from time import sleep`, patch `app.sleep`, not `time.sleep`.",
      "Patching the original module leaves `app.py` holding its own reference to the real function.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      code: `import time
from unittest.mock import Mock, patch

def total_due(client, member):
    return sum(client.fines(member))

client = Mock()
client.fines.return_value = [2, 5]
print(total_due(client, "ann"))
client.fines.assert_called_once_with("ann")
print(client.fines.call_count, client.fines.call_args.args)

client.fines.side_effect = [[1], ConnectionError("down")]
print(total_due(client, "bo"))
try:
    total_due(client, "cy")
except ConnectionError as err:
    print("raised", err)

with patch("time.sleep") as fake:
    time.sleep(10)
    print(fake.call_args.args, fake.called)`,
      steps: [
        "Lines 8-9: `return_value` makes `client.fines(...)` answer \"[2, 5]\", so `total_due` adds them to 7.",
        "Line 10: the assertion passes silently because `fines` was called once with \"ann\".",
        "Line 11: the mock recorded one call and its arguments.",
        "Lines 13-14: with a list as `side_effect`, the first call returns `[1]`.",
        "Lines 15-18: the second call raises the `ConnectionError`, which the example catches.",
        "Lines 20-22: inside the `with`, `time.sleep` is a mock, so the call returns at once and is recorded; afterwards the real `sleep` is back.",
      ],
      output: `7
1 ('ann',)
1
raised down
(10,) True`,
    },
    exercises: [
      'py-mock-1',
      'py-testing-predict-1',
      'py-mock-cloze-1',
      'py-mock-3',
    ],
  },
  {
    id: 'py_pydantic/1',
    topicKeys: [Topic.PY_PYDANTIC],
    step: 1,
    title: 'Pydantic Data Validation',
    idea: [
      lines(
        "A pydantic model is a class that inherits `BaseModel` and declares fields with type hints.",
        "Creating an object validates the data against those hints, so bad input fails at the edge of your program instead of deep inside it.",
      ),
      lines(
        "Validation also converts: for an `int` field the text `\"41\"` becomes `41`.",
        "Data that cannot be converted raises `ValidationError`, whose `.errors()` lists the field, the kind of problem and a message for each failure.",
      ),
      lines(
        "`Field(ge=0, max_length=20)` adds limits, and a default makes a field optional: `tags: list[str] = []`, `note: str | None = None`.",
        "`m.model_dump()` gives a dict, `m.model_dump_json()` gives JSON text, and `Model.model_validate(data)` builds a model from a dict.",
        "`@field_validator(\"name\")` adds a custom check for one field.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `from pydantic import BaseModel, Field, ValidationError

class User(BaseModel):
    email: str                       # required
    age: int = Field(ge=0)           # required, at least 0
    tags: list[str] = []             # optional, own copy per object
    note: str | None = None          # optional

u = User(email="a@x.org", age="41")  # "41" is converted to 41
u.model_dump()                       # {'email': ..., 'age': 41, ...}
User.model_validate({"email": "b@x.org", "age": 3})

try:
    User(age=-1)
except ValidationError as e:
    e.errors()                       # one entry per failing field`,
    },
    pitfall: lines(
      "By default pydantic converts rather than rejects, so `age=\"41\"` quietly becomes `41` and `\"true\"` becomes `True`.",
      "Use `strict=True` on the field or model when a wrong type should be an error, and remember that assigning to a field later is not validated unless you ask for it.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      code: `from pydantic import BaseModel, Field, ValidationError

class Member(BaseModel):
    email: str
    age: int = Field(ge=0)
    tags: list[str] = []

m = Member(email="a@x.org", age="41")
print(m)
print(m.age + 1, m.model_dump())
try:
    Member(email="b@x.org", age=-1)
except ValidationError as e:
    print(e.error_count(), e.errors()[0]["loc"])
try:
    Member(age=3)
except ValidationError as e:
    print(e.errors()[0]["type"])`,
      steps: [
        "Lines 3-6: three fields; \"email\" and \"age\" are required, \"tags\" has a default, and \"age\" must be at least 0.",
        "Line 8: the text \"41\" is converted to the integer 41 during validation.",
        "Line 10: because `age` is a real `int`, adding 1 gives 42, and `model_dump` returns the fields as a plain dict.",
        "Lines 11-14: `-1` breaks the `ge=0` rule, so one error is collected and its location is the field `age`.",
        "Lines 15-18: leaving out `email` is reported with the kind `missing`.",
      ],
      output: `email='a@x.org' age=41 tags=[]
42 {'email': 'a@x.org', 'age': 41, 'tags': []}
1 ('age',)
missing`,
    },
    exercises: [
      'py-pydantic-1',
      'py-pydantic-predict-11',
      'py-pydantic-parsons-11',
      'py-pydantic-cloze-6',
      'py-pydantic-5',
    ],
  },
  {
    id: 'py_http/1',
    topicKeys: [Topic.PY_HTTP],
    step: 1,
    title: 'HTTP Clients (requests, httpx)',
    idea: [
      lines(
        "`requests` is the everyday HTTP client: `requests.get(url, params={...}, timeout=5)` sends a GET, and `requests.post(url, json={...})` sends a JSON body and sets the content type.",
        "`httpx` has almost the same API and adds async support and HTTP/2.",
      ),
      lines(
        "The returned response has `.status_code`, `.ok`, `.text`, `.headers` and `.json()`.",
        "A 404 or 500 is not an error to Python: the call succeeds and only `r.raise_for_status()` turns a 4xx or 5xx into an `HTTPError`.",
      ),
      lines(
        "Always pass `timeout`, because the default is to wait forever.",
        "A `Session` (or an httpx `Client`) reuses the connection and shares headers such as `Authorization` across calls, and a retry policy can be mounted on it for transient failures.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `import requests

r = requests.get(url, params={"q": "x"}, timeout=5)   # always a timeout
r.raise_for_status()                # 4xx / 5xx -> requests.HTTPError
data = r.json()                     # parse the JSON body
r.status_code, r.ok

requests.post(url, json={"a": 1}, timeout=5)   # JSON body + content type

with requests.Session() as s:       # reuse connection, share headers
    s.headers["Authorization"] = "Bearer TOKEN"
    s.get(url, timeout=5)`,
    },
    pitfall: lines(
      "A failing status does not raise by itself: `requests.get(url)` happily returns a 500 response, and `r.json()` then parses the error page or fails.",
      "Call `r.raise_for_status()` before you use the body, and pass a `timeout` so a stalled server cannot hang the program.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      code: `import io
import requests

def reply(code):
    r = requests.Response()
    r.status_code = code
    r.raw = io.BytesIO(b'{"title": "Dune"}')
    r.url = "https://api.example.com/books"
    return r

ok, gone = reply(200), reply(404)
print(ok.status_code, ok.ok, ok.json()["title"])
print(gone.ok)
try:
    gone.raise_for_status()
except requests.HTTPError as e:
    print("raised", e.response.status_code)
req = requests.Request("POST", "https://api.example.com/books", json={"title": "Emma"}, params={"v": 2}).prepare()
print(req.url, req.headers["Content-Type"], req.body)`,
      steps: [
        "Lines 4-9: `reply` builds a response by hand so the example runs without a network; `requests.get` would return the same kind of object.",
        "Lines 11-12: a 200 response is `ok`, and `.json()` parses its body.",
        "Line 13: a 404 response is not `ok`, yet creating it raised nothing.",
        "Lines 14-17: only `raise_for_status()` turns the 404 into an `HTTPError`, which carries the response.",
        "Lines 18-19: `.prepare()` builds the request without sending it: `params` end up in the URL, and `json=` becomes a JSON body with its content type.",
      ],
      output: `200 True Dune
False
raised 404
https://api.example.com/books?v=2 application/json b'{"title": "Emma"}'`,
    },
    exercises: [
      'py-http-1',
      'py-http-parsons-3',
      'py-http-3',
      'py-http-predict-1',
    ],
  },
  {
    id: 'py_security/1',
    topicKeys: [Topic.PY_SECURITY],
    step: 1,
    title: 'Security Primitives (hashing, tokens, HMAC)',
    idea: [
      lines(
        "A hash such as `hashlib.sha256(data).hexdigest()` turns bytes into a fixed-size fingerprint: the same input always gives the same digest, and you cannot work back to the input.",
        "Use SHA-256 or newer; MD5 and SHA-1 are broken for security.",
      ),
      lines(
        "A plain fast hash is wrong for passwords, because attackers can try billions per second.",
        "Hash passwords with a random salt and a deliberately slow function such as `hashlib.pbkdf2_hmac`, or a library such as bcrypt or argon2.",
      ),
      lines(
        "`hmac.new(key, message, hashlib.sha256)` signs a message with a secret key, so only someone with the key can make a matching tag.",
        "Compare tags with `hmac.compare_digest(a, b)`, which takes the same time whatever the input.",
        "Generate tokens, salts and keys with `secrets` (`token_urlsafe`, `token_hex`, `token_bytes`), never with `random`.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `import hashlib, hmac, secrets

hashlib.sha256(b"data").hexdigest()            # fingerprint of bytes
salt = secrets.token_bytes(16)                 # random salt
hashlib.pbkdf2_hmac("sha256", b"pw", salt, 600_000)   # slow, salted

tag = hmac.new(key, msg, hashlib.sha256).hexdigest()  # signed with a key
hmac.compare_digest(tag, other)                # safe comparison

secrets.token_urlsafe(32)                      # unguessable token
secrets.choice(["a", "b", "c"])                # secure random pick`,
    },
    pitfall: lines(
      "`random` is a predictable generator meant for simulations, so a token or password reset code made with `random.randint` can be guessed.",
      "Use the `secrets` module for anything an attacker must not be able to predict.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      code: `import hashlib, hmac, secrets

digest = hashlib.sha256(b"hello").hexdigest()
print(digest[:12], len(digest))
key = b"server-key"
tag = hmac.new(key, b"user=7", hashlib.sha256).hexdigest()
print(hmac.compare_digest(tag, hmac.new(key, b"user=7", hashlib.sha256).hexdigest()))
print(hmac.compare_digest(tag, hmac.new(key, b"user=8", hashlib.sha256).hexdigest()))
salt = b"fixed-salt"
key1 = hashlib.pbkdf2_hmac("sha256", b"pw", salt, 1000)
print(len(key1), key1 == hashlib.pbkdf2_hmac("sha256", b"pw", salt, 1000))
print(len(secrets.token_hex(16)), secrets.token_urlsafe(8) != secrets.token_urlsafe(8))`,
      steps: [
        "Lines 3-4: a SHA-256 digest is 64 hex characters, and the first twelve are the same on every run.",
        "Lines 5-7: signing the same message with the same key gives the same tag, and `compare_digest` confirms it.",
        "Line 8: changing the message to `user=8` gives a different tag, so the check fails.",
        "Lines 9-11: key stretching with the same password and salt is repeatable, and returns 32 bytes; in real code the salt comes from `secrets.token_bytes(16)` and the count is far higher.",
        "Line 12: `token_hex(16)` is 32 hex characters, and two `token_urlsafe` calls differ.",
      ],
      output: `2cf24dba5fb0 64
True
False
32 True
32 True`,
    },
    exercises: [
      'py-security-1',
      'py-security-predict-2',
      'py-security-cloze-10',
      'py-security-4',
    ],
  },
  {
    id: 'py_threading/1',
    topicKeys: [Topic.PY_THREADING],
    step: 1,
    title: 'Threading & Synchronization',
    idea: [
      lines(
        "A thread runs a function alongside the rest of the program.",
        "`t = Thread(target=fn, args=(x,))` creates one, `t.start()` begins it, and `t.join()` waits for it to finish.",
        "Because of the GIL only one thread runs Python code at a time, so threads speed up programs that wait on files or the network, not ones that crunch numbers.",
      ),
      lines(
        "Threads share memory, so two threads updating the same value can interleave: `count += 1` is a read, an add and a write, and updates can be lost.",
        "A `Lock` fixes that: `with lock:` lets one thread at a time into the block.",
      ),
      lines(
        "`queue.Queue` passes work between threads safely with `put` and `get`.",
        "`Event` lets one thread signal others with `set()` and `wait()`.",
        "A daemon thread, `Thread(daemon=True)`, does not keep the program alive at exit.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `import threading
from queue import Queue

lock = threading.Lock()
count = 0

def work(n):
    global count
    for _ in range(n):
        with lock:                  # one thread at a time in here
            count += 1

t = threading.Thread(target=work, args=(1000,))
t.start()                           # runs alongside
t.join()                            # wait until it ends

jobs = Queue()
jobs.put("task")                    # thread-safe hand-off
jobs.get()`,
    },
    pitfall: lines(
      "Shared state needs a lock: without `with lock:` around `count += 1`, several threads can read the same old value and the total comes out too low.",
      "Also call `join()`: without it the main thread can print or exit before the workers are done.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      code: `import threading

count = 0
lock = threading.Lock()
done = []

def work(name, n):
    global count
    for _ in range(n):
        with lock:
            count += 1
    done.append(name)

threads = [threading.Thread(target=work, args=(f"t{i}", 1000)) for i in range(4)]
for t in threads:
    t.start()
for t in threads:
    t.join()
print(count, sorted(done))`,
      steps: [
        "Lines 7-12: each worker adds 1 to the shared \"count\" a thousand times, taking the lock around every update, then records its name.",
        "Line 14: four threads are created but nothing runs yet.",
        "Lines 15-16: `start()` lets all four run at once.",
        "Lines 17-18: `join()` makes the main thread wait for every worker.",
        "Line 19: the lock made each update safe, so the total is exactly 4000; `sorted` gives the names a fixed order because the threads can finish in any order.",
      ],
      output: `4000 ['t0', 't1', 't2', 't3']`,
    },
    exercises: [
      'py-thread-beg-what',
      'py-concurrency-parsons-1',
      'py-concurrency-cloze-1',
      'py-concurrency-predict-3',
    ],
  },
  {
    id: 'py_futures/1',
    topicKeys: [Topic.PY_FUTURES],
    step: 1,
    title: 'Parallelism (futures, multiprocessing)',
    idea: [
      lines(
        "`concurrent.futures` gives a pool of workers so you do not manage threads yourself.",
        "`ThreadPoolExecutor` suits work that waits, such as network calls, and `ProcessPoolExecutor` runs separate processes for CPU-heavy work, avoiding the GIL.",
      ),
      lines(
        "`pool.map(fn, items)` runs `fn` on every item and returns the results in input order.",
        "`pool.submit(fn, x)` starts one job and returns a `Future`; `fut.result()` waits for the answer.",
        "`as_completed(futures)` hands back futures in the order they finish.",
      ),
      lines(
        "Using the pool in a `with` block waits for all jobs and shuts it down.",
        "If a job raises, nothing happens until you ask for the result: `fut.result()` (or reading from `map`) re-raises the error in your code.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `from concurrent.futures import ThreadPoolExecutor, as_completed

with ThreadPoolExecutor(max_workers=4) as pool:    # waits at the end
    out = list(pool.map(fn, items))                # results in input order
    fut = pool.submit(fn, x)                       # one job -> Future
    fut.result()                                   # blocks; re-raises errors
    for done in as_completed([fut]):               # in order of finishing
        done.result()

# CPU-bound: ProcessPoolExecutor, with the entry-point guard
if __name__ == "__main__":
    with ProcessPoolExecutor() as pool:
        list(pool.map(fn, items))`,
    },
    pitfall: lines(
      "An exception inside a job stays hidden until you call `.result()`, so a pool that never reads its futures fails silently.",
      "Collect the futures, call `.result()` in a `try`, and handle the error where you can act on it.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      code: `from concurrent.futures import ThreadPoolExecutor, as_completed

def cube(n):
    if n == 3:
        raise ValueError("bad 3")
    return n ** 3

with ThreadPoolExecutor(max_workers=3) as pool:
    print(list(pool.map(cube, [1, 2, 4])))
    jobs = [pool.submit(cube, n) for n in [2, 3, 5]]
    for n, fut in zip([2, 3, 5], jobs):
        try:
            print(n, fut.result())
        except ValueError as err:
            print(n, "failed:", err)
    print(sorted(f.result() for f in as_completed([pool.submit(cube, n) for n in (1, 6)])))`,
      steps: [
        "Line 9: `map` returns the cubes in input order, whichever worker finished first.",
        "Line 10: `submit` starts three jobs at once and returns a future for each.",
        "Lines 11-15: nothing failed visibly while the jobs ran; the `ValueError` from the job for 3 surfaces only when `result()` is called.",
        "Line 16: `as_completed` yields futures as they finish, so `sorted` fixes the order before printing.",
        "The `with` block ends only after every job is done.",
      ],
      output: `[1, 8, 64]
2 8
3 failed: bad 3
5 125
[1, 216]`,
    },
    exercises: [
      'py-fut-beg-executor',
      'py-concurrency-parsons-3',
      'py-concurrency-cloze-3',
      'py-concurrency-predict-1',
    ],
  },
  {
    id: 'py_async/1',
    topicKeys: [Topic.PY_ASYNC],
    step: 1,
    title: 'Async/Await',
    idea: [
      lines(
        "`async def` defines a coroutine function.",
        "Calling it does not run the body; it returns a coroutine object, and the body runs only when something awaits it.",
        "`asyncio.run(main())` starts the event loop and runs the top-level coroutine to the end.",
      ),
      lines(
        "`await x` pauses the current coroutine until `x` is done and lets the loop run other coroutines meanwhile.",
        "That makes async good at many waits at once, such as network calls: one thread, many tasks.",
        "`asyncio.sleep(n)` waits without blocking the loop.",
      ),
      lines(
        "`await asyncio.gather(a(), b())` runs coroutines concurrently and returns their results in the order you listed them.",
        "`asyncio.create_task(coro)` starts one in the background and returns a task you can await later.",
        "`async for` and `async with` are the awaiting versions of `for` and `with`.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `import asyncio

async def fetch(x):                  # a coroutine function
    await asyncio.sleep(0.1)         # pause, loop runs others
    return x * 2

async def main():
    one = await fetch(1)                              # run it, wait for it
    both = await asyncio.gather(fetch(2), fetch(3))   # concurrent; ordered list
    task = asyncio.create_task(fetch(4))              # start in the background
    return one, both, await task

asyncio.run(main())                  # start the event loop`,
    },
    pitfall: lines(
      "Calling a coroutine without `await` does nothing: `fetch(1)` only creates a coroutine object, Python warns that it was never awaited, and the work never happens.",
      "Likewise a blocking call such as `time.sleep(1)` inside a coroutine freezes the whole loop, so use `await asyncio.sleep(1)`.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      code: `import asyncio

order = []

async def fetch(name, delay):
    await asyncio.sleep(delay)
    order.append(name)
    return name.upper()

async def main():
    first = fetch("a", 0)
    print(type(first).__name__)
    print(await first)
    results = await asyncio.gather(fetch("slow", 0.05), fetch("fast", 0.01))
    print(results)
    print(order)

asyncio.run(main())`,
      steps: [
        "Line 11: calling `fetch` runs nothing and returns a coroutine object.",
        "Line 12: its type is `coroutine`.",
        "Line 13: `await` runs it to the end, so \"a\" is recorded and `A` is printed.",
        "Line 14: `gather` starts both coroutines at once; \"fast\" finishes first, then \"slow\".",
        "Line 15: results come back in the order they were listed, not the order they finished.",
        "Line 16: `order` shows the real finishing order: \"a\", then \"fast\", then \"slow\".",
      ],
      output: `coroutine
A
['SLOW', 'FAST']
['a', 'fast', 'slow']`,
    },
    exercises: [
      'py-gap-async-1',
      'py-async-predict-1',
      'py-async-mcq-event-loop',
      'py-async-predict-2',
    ],
  },
  {
    id: 'py_shell_os/1',
    topicKeys: [Topic.PY_SHELL_OS],
    step: 1,
    title: 'Shell & OS Interop (subprocess, shutil, tempfile)',
    idea: [
      lines(
        "`subprocess.run([\"cmd\", \"arg\"])` runs another program and waits for it.",
        "Pass the command as a list, add `capture_output=True, text=True` to get `result.stdout` as a string, and `check=True` to raise `CalledProcessError` on a non-zero exit code.",
        "`result.returncode` holds the exit code, where 0 means success.",
      ),
      lines(
        "`shutil` works on files and folders: `copy`, `move`, `rmtree` and `which(\"git\")` to find a program.",
        "`tempfile.TemporaryDirectory()` gives a scratch folder that is deleted when its `with` block ends.",
        "`os.environ` holds environment variables and `os.getcwd()` the current folder.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `import subprocess, shutil, tempfile, pathlib

res = subprocess.run(["ls", "-l"], capture_output=True, text=True, check=True)
res.stdout, res.returncode        # output text, exit code (0 = ok)

with tempfile.TemporaryDirectory() as tmp:   # deleted after the block
    src = pathlib.Path(tmp) / "a.txt"
    src.write_text("hi")
    shutil.copy(src, pathlib.Path(tmp) / "b.txt")

shutil.which("git")               # path to a program, or None`,
    },
    pitfall: lines(
      "Never build a command string from user input and run it with `shell=True`: input such as `x; rm -rf ~` becomes part of the command.",
      "Pass a list of arguments with the default `shell=False`, and each item reaches the program as one value that the shell never interprets.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      code: `import subprocess, shutil, tempfile, pathlib, sys

res = subprocess.run([sys.executable, "-c", "print('hi')"], capture_output=True, text=True, check=True)
print(repr(res.stdout), res.returncode)
try:
    subprocess.run([sys.executable, "-c", "raise SystemExit(3)"], check=True)
except subprocess.CalledProcessError as e:
    print("failed with", e.returncode)
with tempfile.TemporaryDirectory() as tmp:
    src = pathlib.Path(tmp) / "a.txt"
    src.write_text("hello")
    shutil.copy(src, pathlib.Path(tmp) / "b.txt")
    print(sorted(p.name for p in pathlib.Path(tmp).iterdir()))
print(pathlib.Path(tmp).exists())`,
      steps: [
        "Line 3: the command is a list; `capture_output` and `text` collect what the child printed as a string.",
        "Line 4: the output includes the newline, and the exit code is 0.",
        "Lines 5-8: the child exits with code 3, and `check=True` turns that into `CalledProcessError`, so the code is read from the error.",
        "Lines 9-12: the temporary folder holds the file written and its copy.",
        "Line 13: `sorted` fixes the listing order.",
        "Line 14: the folder was removed when the `with` block ended.",
      ],
      output: `'hi\\n' 0
failed with 3
['a.txt', 'b.txt']
False`,
    },
    exercises: [
      'py-shell-predict-1',
      'py-shell-parsons-3',
      'py-shell-cloze-3',
      'py-shell-6',
      'py-shell-1',
    ],
  },
  {
    id: 'py_cli/1',
    topicKeys: [Topic.PY_CLI],
    step: 1,
    title: 'CLI Tools & Config (argparse, click, dotenv)',
    idea: [
      lines(
        "`argparse` turns command-line words into values.",
        "Create `parser = ArgumentParser(description=...)`, register arguments with `parser.add_argument(...)`, then call `args = parser.parse_args()`.",
        "A plain name such as `\"title\"` is a required positional argument, and `\"--days\"` is an option.",
      ),
      lines(
        "`type=int` converts the text, `default=14` fills in when it is missing, and `action=\"store_true\"` makes a flag that is `True` only if given.",
        "A bad value or a missing argument prints usage and exits with code 2, and `-h` writes the help for you.",
        "`click` gives the same result with decorators on a function.",
      ),
      lines(
        "Settings that change by machine, such as keys and URLs, belong in environment variables: `os.environ.get(\"KEY\", default)`.",
        "`dotenv.load_dotenv()` reads a `.env` file into `os.environ` first, and the `.env` file stays out of git.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `import argparse, os

parser = argparse.ArgumentParser(description="Lend books")
parser.add_argument("title")                          # required positional
parser.add_argument("--days", type=int, default=14)   # option, converted to int
parser.add_argument("-v", "--verbose", action="store_true")   # flag

args = parser.parse_args()          # reads sys.argv
args.title, args.days, args.verbose

os.environ.get("API_KEY", "")       # config from the environment
# from dotenv import load_dotenv; load_dotenv()   # fill it from .env`,
    },
    pitfall: lines(
      "Everything on the command line is text until you say otherwise, so `--days 7` without `type=int` gives the string `\"7\"` and `args.days + 1` fails.",
      "Give each numeric option a `type`, and use `os.environ.get` instead of `os.environ[...]` for settings that may be missing.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      code: `import argparse, os

parser = argparse.ArgumentParser(description="Lend books")
parser.add_argument("title")
parser.add_argument("--days", type=int, default=14)
parser.add_argument("-v", "--verbose", action="store_true")
args = parser.parse_args(["Dune", "--days", "7", "-v"])
print(args.title, args.days + 1, args.verbose)
print(parser.parse_args(["Emma"]))
try:
    parser.parse_args(["Emma", "--days", "x"])
except SystemExit as e:
    print("exit", e.code)
os.environ["LOAN_DAYS"] = "21"
print(int(os.environ.get("LOAN_DAYS", 14)), os.environ.get("MISSING", "none"))`,
      steps: [
        "Lines 3-6: one positional argument, an integer option with a default, and a flag.",
        "Line 7: `parse_args` is given a list here so the example does not need a real command line; normally it reads `sys.argv`.",
        "Line 8: `--days 7` was converted to the integer 7, so adding 1 works, and `-v` made the flag `True`.",
        "Line 9: with only a title, `days` falls back to 14 and `verbose` stays `False`.",
        "Lines 10-13: `x` cannot be converted to `int`, so argparse prints its usage message and exits with code 2, which the example catches.",
        "Lines 14-15: an environment value is always text, so it is converted with `int`, and a missing name returns the default.",
      ],
      output: `Dune 8 True
Namespace(title='Emma', days=14, verbose=False)
exit 2
21 none`,
    },
    exercises: [
      'py-cli-1',
      'py-cli-predict-1',
      'py-cli-2',
      'py-cli-6',
    ],
  },
  {
    id: 'py_packaging/1',
    topicKeys: [Topic.PY_PACKAGING],
    step: 1,
    title: 'Packaging & Environments (venv, pyproject, uv)',
    idea: [
      lines(
        "A virtual environment, `python -m venv .venv`, is a private folder of installed packages for one project.",
        "Each project gets its own versions, and nothing is installed into the system Python.",
        "Activate it, or run its `python` directly, before you `pip install`.",
      ),
      lines(
        "`pyproject.toml` is the one file that describes a project: `[project]` holds the name, version, `requires-python` and `dependencies`, and other tables such as `[tool.pytest.ini_options]` configure tools.",
        "`[project.scripts]` maps a command name to `module:function`, so installing the project creates that command.",
      ),
      lines(
        "`pip install -e .` installs your project in editable mode, so changes to the code apply at once.",
        "`uv` is a very fast installer and environment manager: `uv venv`, `uv add requests` and `uv sync`.",
        "A lockfile such as `uv.lock` records the exact versions that were installed, while `pyproject.toml` states the ranges you accept.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `# shell
python -m venv .venv         # create the environment
source .venv/bin/activate    # use it (Windows: .venv\\Scripts\\activate)
pip install -e .             # install this project, editable
uv add requests              # or: add a dependency with uv

# pyproject.toml
[project]
name = "loan-tool"
version = "0.3.0"
requires-python = ">=3.10"
dependencies = ["requests>=2.31"]     # ranges you accept

[project.scripts]
loans = "loan_tool.cli:main"          # creates the \`loans\` command`,
    },
    pitfall: lines(
      "`pyproject.toml` holds loose ranges such as `requests>=2.31`, so two installs on different days can get different versions.",
      "Commit the lockfile as well, and install from it in deployments, so everyone runs the exact versions you tested.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      code: `import tomllib, venv, tempfile, pathlib

text = """
[project]
name = "loan-tool"
version = "0.3.0"
requires-python = ">=3.10"
dependencies = ["requests>=2.31", "click~=8.1"]

[project.scripts]
loans = "loan_tool.cli:main"

[tool.pytest.ini_options]
addopts = "-q"
"""
cfg = tomllib.loads(text)
proj = cfg["project"]
print(proj["name"], proj["version"], len(proj["dependencies"]))
module, func = proj["scripts"]["loans"].split(":")
print(module, func)
print(list(cfg["tool"]))
with tempfile.TemporaryDirectory() as tmp:
    venv.create(tmp)
    print((pathlib.Path(tmp) / "pyvenv.cfg").exists())`,
      steps: [
        "Lines 3-15: a small `pyproject.toml` as text; the table headers decide where each key lives.",
        "Line 17: `[project]` becomes `cfg[\"project\"]`, whose dependencies are a list of two requirement strings.",
        "Lines 19-20: the command target splits at the colon into the module `loan_tool.cli` and its function `main`.",
        "Line 21: `[tool.pytest.ini_options]` nests under `tool`, the home for each tool's settings.",
        "Lines 22-24: `venv.create` builds a bare environment in a temporary folder; its `pyvenv.cfg` file marks it as one.",
      ],
      output: `loan-tool 0.3.0 2
loan_tool.cli main
['pytest']
True`,
    },
    exercises: [
      'py-packaging-1',
      'py-packaging-6',
      'py-packaging-5',
      'py-packaging-predict-1',
    ],
  },
  // ===== Section 3, Django =====
  // Django examples need a project to run, so each sets `runs: false`
  // and its output was checked by hand against Django's behaviour.
  {
    id: 'dj_setup/1',
    topicKeys: [Topic.DJ_SETUP],
    step: 1,
    title: 'Setup & Project Structure',
    idea: [
      lines(
        "`django-admin startproject mysite` creates a project: `manage.py` plus `settings.py`, `urls.py`, `wsgi.py` and `asgi.py`.",
        "`python manage.py startapp name` then creates an app, one feature of the site, with its own `models.py`, `views.py`, `apps.py` and `migrations/`.",
      ),
      lines(
        "An app does nothing until `INSTALLED_APPS` lists it, best by its config class, `\"name.apps.NameConfig\"`, so its `ready()` hook runs.",
        "Settings are the module named by `DJANGO_SETTINGS_MODULE`, which `manage.py` only defaults, so a `base.py` / `dev.py` / `prod.py` split can be picked per environment.",
      ),
      lines(
        "A model change reaches the database in two steps: `makemigrations` writes a migration file, and `migrate` applies the pending ones.",
        "`showmigrations` marks each file `[X]` applied or `[ ]` pending, and `shell` opens Python with the settings loaded.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `# $ django-admin startproject mysite   # manage.py + mysite/settings.py, urls.py
# $ python manage.py startapp name      # name/models.py, views.py, apps.py

INSTALLED_APPS = [
    "django.contrib.auth",              # ... the built-in apps
    "name.apps.NameConfig",             # the new app, by its config class
]

# $ python manage.py makemigrations     # models.py change -> a migration file
# $ python manage.py migrate            # apply the pending files
# $ python manage.py showmigrations     # [X] applied, [ ] pending
# $ python manage.py shell              # Python with the settings loaded`,
    },
    pitfall: lines(
      "Editing `models.py` and running only `migrate` changes nothing, because `migrate` applies migration files and only `makemigrations` writes them.",
      "After every model change run `makemigrations`, then `migrate`, and check the result with `showmigrations`.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      runs: false,
      code: `# $ django-admin startproject bookshop && cd bookshop
# $ python manage.py startapp inventory
# bookshop/settings.py: INSTALLED_APPS += ["inventory.apps.InventoryConfig"]
# after writing the Book model: makemigrations, then migrate
# after adding a Book.isbn field: makemigrations only

# $ python manage.py shell
from django.apps import apps
from django.conf import settings
from django.core.management import call_command

print(settings.ROOT_URLCONF)
print(type(apps.get_app_config("inventory")).__name__)
call_command("showmigrations", "inventory")`,
      steps: [
        "Lines 1-2: `startproject` makes the project and its `manage.py`, then `startapp` makes the `inventory` app inside it.",
        "Line 3: the app is registered by its config class, so Django loads its models and runs its `ready()` hook.",
        "Lines 4-5: the first model was written to a migration and applied, but the `isbn` change was only written.",
        "Lines 12-13: `startproject` pointed `ROOT_URLCONF` at the project's `urls.py`, and the registered config is the `InventoryConfig` class from `apps.py`.",
        "Line 14: `showmigrations` shows `0001_initial` applied and `0002_book_isbn` pending, so the `isbn` column is not in the database until `migrate` runs.",
      ],
      output: `bookshop.urls
InventoryConfig
inventory
 [X] 0001_initial
 [ ] 0002_book_isbn`,
    },
    exercises: [
      'dj-setup-1',
      'py-dj-setup-parsons-2',
      'py-dj-setup-cloze-1',
      'py-dj-setup-settings-structure',
      'dj-setup-predict-1',
    ],
  },
  {
    id: 'dj_models/1',
    topicKeys: [Topic.DJ_MODELS],
    step: 1,
    title: 'Models & Migrations',
    idea: [
      lines(
        "A model subclasses `models.Model`: the class is a table, each field is a column, each instance is a row, and Django adds an `id` primary key.",
        "The field class sets the column type, as in `CharField(max_length=n)`, `TextField`, `BooleanField(default=False)` or `DateTimeField(auto_now_add=True)`.",
      ),
      lines(
        "`ForeignKey(Other, on_delete=...)` goes on the many side of a one-to-many link, and `on_delete` is required: `CASCADE` deletes the children with the parent, `PROTECT` refuses the delete.",
        "`related_name` names the way back from the parent, and `ManyToManyField` links many to many through a join table.",
      ),
      lines(
        "`__str__` sets how a row prints, and an inner `class Meta` holds options such as `ordering`.",
        "Every model change needs `makemigrations`, then `migrate`.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `from django.db import models

class Parent(models.Model):                     # a table; id is added for you
    title = models.CharField(max_length=100)    # max_length is required
    created_at = models.DateTimeField(auto_now_add=True)   # set once, on insert

    def __str__(self):
        return self.title                       # how a row prints

class Child(models.Model):                      # the "many" side holds the FK
    parent = models.ForeignKey(Parent, on_delete=models.CASCADE,
                               related_name="children")   # parent.children.all()`,
    },
    pitfall: lines(
      "The `ForeignKey` goes on the many side: a book has one author, so `Book` holds `author = models.ForeignKey(Author, ...)`, never the other way round.",
      "`on_delete` is required, and `CASCADE` deletes every book when its author is deleted; choose `PROTECT` when that delete should be refused.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      runs: false,
      code: `# library/models.py
from django.db import models

class Author(models.Model):
    full_name = models.CharField(max_length=100)
    def __str__(self):
        return self.full_name

class Book(models.Model):
    author = models.ForeignKey(Author, on_delete=models.CASCADE, related_name="books")
    title = models.CharField(max_length=200)

# after makemigrations + migrate, on an empty database, in python manage.py shell:
from library.models import Author, Book
ann = Author.objects.create(full_name="Ann Leckie")
book = Book.objects.create(author=ann, title="Provenance")
print(ann, ann.books.count(), book)
total, per_model = ann.delete()
print(total, per_model["library.Book"], Book.objects.count())`,
      steps: [
        "Lines 4-7: `Author` is a table with the `id` key Django adds and a `full_name` column, and `__str__` decides how a row prints.",
        "Lines 9-11: the `ForeignKey` sits on the many side, so each book has one author, and `related_name` names the way back from an author to the author's books.",
        "Lines 15-17: `create` inserts each row; the author prints through `__str__`, `ann.books` finds the one book, and `Book`, which has no `__str__`, prints as `Book object (1)`.",
        "Lines 18-19: `CASCADE` deletes the book along with its author, so `delete()` reports 2 rows, 1 of them a book, and no books are left.",
      ],
      output: `Ann Leckie 1 Book object (1)
2 1 0`,
    },
    exercises: [
      'dj4e-fk-1',
      'dj-models-predict-1',
      'dj-models-parsons-2',
      'dj-models-cloze-1',
      'dj-model-1',
    ],
  },
  {
    id: 'dj_orm/1',
    topicKeys: [Topic.DJ_ORM],
    step: 1,
    title: 'ORM (QuerySets, filtering, relations)',
    idea: [
      lines(
        "Every model gets a manager, `Model.objects`, that builds queries in Python instead of SQL.",
        "`all()`, `filter(...)`, `exclude(...)` and `order_by(\"-col\")` return a QuerySet, a query you can keep chaining, and a slice such as `[:10]` becomes a LIMIT.",
      ),
      lines(
        "A lookup is `field__op=value`, as in `price__lt=10` or `title__icontains=\"war\"`, and a double underscore also follows a relation: `author__full_name=\"Ann\"`.",
        "Separate keyword arguments are joined with AND, and `Q(a=1) | Q(b=2)` gives OR.",
      ),
      lines(
        "A QuerySet is lazy: no SQL runs until you loop over it, call `list()` or `len()` on it, or print it.",
        "`get(...)` returns exactly one object, `first()` an object or `None`, `count()` and `exists()` ask without loading the rows, and `create(...)` inserts a row and returns it.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `Model.objects.all()                          # every row, as a lazy QuerySet
Model.objects.filter(col=v, other__gte=n)    # WHERE col = v AND other >= n
Model.objects.exclude(flag=True)             # WHERE NOT flag
Model.objects.filter(rel__col="x")           # follow a ForeignKey with __
Model.objects.filter(Q(a=1) | Q(b=2))        # OR
qs.order_by("-col")[:10]                     # ORDER BY col DESC LIMIT 10
Model.objects.get(pk=1)                      # exactly one row, or an exception
qs.first(), qs.count(), qs.exists()          # a row or None, a number, a bool
Model.objects.create(col=v)                  # INSERT and return the row`,
    },
    pitfall: lines(
      "`get()` is for exactly one row: it raises `DoesNotExist` when nothing matches and `MultipleObjectsReturned` when several rows do.",
      "Use `filter()` for zero or more rows, and `filter(...).first()` when you want one row or `None`.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      runs: false,
      code: `# python manage.py shell; shop.Book has title, price and author -> Author(full_name)
# rows: Dune (12, Frank Herbert), Emma (8, Jane Austen), Persuasion (9, Jane Austen)
from django.db.models import Q
from shop.models import Book

cheap = Book.objects.filter(price__lt=10).order_by("-price")
print([b.title for b in cheap])
print(Book.objects.filter(author__full_name="Jane Austen").count())
print(Book.objects.filter(Q(price__gt=10) | Q(title__startswith="E")).count())
print(Book.objects.filter(title__icontains="zz").first())
try:
    Book.objects.get(author__full_name="Jane Austen")
except Book.MultipleObjectsReturned:
    print("more than one row: use filter()")`,
      steps: [
        "Line 6: this only builds the query; nothing runs until line 7 loops over it, and then the two books under 10 come back dearest first.",
        "Line 8: `author__full_name` follows the foreign key, so this counts Jane Austen's two books in the database.",
        "Line 9: `Q(...) | Q(...)` matches Dune by price and Emma by its first letter.",
        "Line 10: nothing matches, so `first()` returns `None` instead of raising.",
        "Lines 11-14: `get()` finds two rows for that author and raises `MultipleObjectsReturned`.",
      ],
      output: `['Persuasion', 'Emma']
2
2
None
more than one row: use filter()`,
    },
    exercises: [
      'dj-orm-gap-1',
      'dj-orm-predict-1',
      'dj-orm-parsons-1',
      'dj-orm-cloze-5',
      'dj-orm-1',
    ],
  },
  {
    id: 'dj_views/1',
    topicKeys: [Topic.DJ_VIEWS],
    step: 1,
    title: 'Views & Request/Response (FBV)',
    idea: [
      lines(
        "A view is a function that takes an `HttpRequest` and returns an `HttpResponse`.",
        "The URLconf decides which view a path reaches and passes the values it captured, such as `pk`, as extra arguments.",
      ),
      lines(
        "The request carries `request.method`, the query string in `request.GET`, submitted form fields in `request.POST`, and the signed-in `request.user`.",
        "`request.GET.get(\"q\", \"\")` reads a value with a default, where `request.GET[\"q\"]` raises an error when it is missing.",
      ),
      lines(
        "`render(request, \"page.html\", context)` returns a filled template with status 200, `redirect(\"name\")` a 302, `JsonResponse(dict)` JSON, and `HttpResponse(body, status=201)` any status.",
        "`get_object_or_404(Model, pk=pk)` raises `Http404` for a missing row, which Django answers with a 404 page.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `from django.shortcuts import get_object_or_404, redirect, render

def view_name(request, pk):                     # pk comes from the URL
    obj = get_object_or_404(Model, pk=pk)       # missing row -> 404
    if request.method == "POST":
        value = request.POST.get("field", "")   # submitted form data
        ...                                     # save the change
        return redirect("route-name")           # 302, so a refresh cannot resubmit
    q = request.GET.get("q", "")                # query string, with a default
    return render(request, "page.html", {"obj": obj, "q": q})   # 200 + HTML`,
    },
    pitfall: lines(
      "`Model.objects.get(pk=pk)` on a row that does not exist raises `DoesNotExist`, and the visitor gets a 500 server error.",
      "Use `get_object_or_404(Model, pk=pk)`, which turns the miss into a 404 page.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      runs: false,
      code: `# python manage.py shell; shop.Book has one row: pk=1, title "Dune"
from django.http import Http404, HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404
from django.test import RequestFactory
from shop.models import Book

def book_view(request, pk):
    book = get_object_or_404(Book, pk=pk)
    if request.method == "POST":
        return HttpResponse(f"saved {request.POST['note']}", status=201)
    return JsonResponse({"title": book.title, "q": request.GET.get("q", "")})

rf = RequestFactory()
r = book_view(rf.get("/books/1/", {"q": "sand"}), pk=1)
print(r.status_code, r.content.decode())
r = book_view(rf.post("/books/1/", {"note": "signed"}), pk=1)
print(r.status_code, r.content.decode())
try:
    book_view(rf.get("/books/9/"), pk=9)
except Http404:
    print("404")`,
      steps: [
        "Lines 7-8: the view gets the request and the `pk` captured from the URL, and looks the book up or raises `Http404`.",
        "Lines 14-15: a GET skips the POST branch and returns JSON with status 200.",
        "Lines 16-17: a POST reads the submitted `note` from `request.POST` and returns plain text with status 201.",
        "Lines 18-21: there is no book 9, so `get_object_or_404` raises `Http404`, which Django serves as a 404 page.",
      ],
      output: `200 {"title": "Dune", "q": "sand"}
201 saved signed
404`,
    },
    exercises: [
      'dj4e-http-4',
      'dj-views-predict-1',
      'dj-views-parsons-1',
      'dj-views-cloze-1',
      'dj-view-render',
    ],
  },
  {
    id: 'dj_cbv/1',
    topicKeys: [Topic.DJ_CBV],
    step: 1,
    title: 'Class-Based & Generic Views',
    idea: [
      lines(
        "A class-based view is a class whose `as_view()` returns the view function the URLconf needs.",
        "Its `dispatch()` sends each request to the method named after the HTTP verb, `get()` or `post()`, and answers 405 when there is none.",
      ),
      lines(
        "Generic views hold the common logic: `ListView` and `DetailView` read rows, and `CreateView`, `UpdateView` and `DeleteView` handle a form.",
        "You configure them with attributes such as `model`, `template_name`, `context_object_name`, `paginate_by` and `success_url`.",
        "Left without `template_name`, a `ListView` of `shop.Book` renders `shop/book_list.html` and passes the rows as `object_list` and `book_list`.",
      ),
      lines(
        "Override a hook to change one step: `get_queryset()` for which rows, `get_context_data()` for extra template values, `form_valid()` for what a valid form does.",
        "Mixins such as `LoginRequiredMixin` go to the left of the base view, because `dispatch()` runs through the classes from left to right.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import ListView

class ThingList(LoginRequiredMixin, ListView):  # mixins first, the base view last
    model = Thing                               # template: app/thing_list.html
    context_object_name = "things"              # default: object_list / thing_list
    paginate_by = 20                            # adds page_obj and paginator

    def get_context_data(self, **kwargs):       # extra template values
        context = super().get_context_data(**kwargs)
        context["total"] = Thing.objects.count()
        return context`,
    },
    pitfall: lines(
      "An override of `get_context_data()` that builds a new dict instead of calling `super().get_context_data(**kwargs)` throws away the context the generic view built, so the template loses its rows and pagination.",
      "Start from the parent's dict, add your keys, and return it.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      runs: false,
      code: `# python manage.py shell; shop.Book rows: Dune (12), Emma (8), Persuasion (9)
from django.test import RequestFactory
from django.views.generic import ListView
from shop.models import Book

class CheapBooks(ListView):
    model = Book
    context_object_name = "books"
    paginate_by = 1
    def get_queryset(self):
        return Book.objects.filter(price__lt=10).order_by("title")
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["shop"] = "Hay Books"
        return context

response = CheapBooks.as_view()(RequestFactory().get("/cheap/", {"page": "2"}))
ctx = response.context_data
print(response.status_code, response.template_name)
print([b.title for b in ctx["books"]], ctx["page_obj"].number, ctx["shop"])`,
      steps: [
        "Lines 6-9: the model, the template's name for the rows, and one row per page.",
        "Lines 10-11: `get_queryset()` narrows the rows to Emma and Persuasion, in title order.",
        "Lines 12-15: `get_context_data()` keeps the parent's context and adds one value.",
        "Line 17: `as_view()` turns the class into a view function, and the request asks for page 2.",
        "Lines 19-20: with no `template_name` the view picks `shop/book_list.html`, and page 2 holds only Persuasion.",
      ],
      output: `200 ['shop/book_list.html']
['Persuasion'] 2 Hay Books`,
    },
    exercises: [
      'dj-cbv-beg-generic',
      'dj-cbv-listview-parsons-1',
      'dj-cbv-context-cloze-1',
      'dj4e-cbv-2',
      'dj-cbv-adv-4',
    ],
  },
  {
    id: 'dj_templates/1',
    topicKeys: [Topic.DJ_TEMPLATES],
    step: 1,
    title: 'Templates & Template Tags',
    idea: [
      lines(
        "A template is text with three kinds of markup: `{{ value }}` prints a value, `{% tag %}` runs logic, and `{# ... #}` is a comment.",
        "A dot reaches into the context, as in `{{ book.title }}`, and a missing value prints as an empty string.",
      ),
      lines(
        "A filter changes a value on the way out: `{{ title|upper }}`, `{{ text|truncatechars:20 }}`, `{{ note|default:\"-\" }}`.",
        "Printed values are HTML-escaped, so `<b>` comes out as `&lt;b&gt;` unless you mark it `|safe`.",
      ),
      lines(
        "Tags pair up with no colons: `{% if %}`, `{% else %}` and `{% endif %}`, or `{% for x in xs %}`, `{% empty %}` and `{% endfor %}`, where `forloop.counter` counts from 1.",
        "A child template starts with `{% extends \"base.html\" %}` and fills the blocks its parent defines, `{% include %}` pastes another template in place, and `{% url \"name\" %}` builds a link.",
      ),
    ],
    form: {
      language: CodeLanguage.HTML,
      code: `{% extends "base.html" %}                   {# the first tag of a child #}
{% block content %}                         {# replaces base.html's block #}
  <h1>{{ page_title|upper }}</h1>           {# a value through a filter #}
  {% for item in items %}
    <a href="{% url 'route-name' item.pk %}">{{ forloop.counter }}. {{ item.title }}</a>
  {% empty %}
    <p>Nothing yet.</p>                       {# when items is empty #}
  {% endfor %}
  {% include "_footer.html" %}              {# paste another template #}
{% endblock %}`,
    },
    pitfall: lines(
      "`{% extends %}` must be the first tag of a child template, and whatever the child writes outside a `{% block %}` is thrown away.",
      "Put all of a child's content inside the blocks that `base.html` defines.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      runs: false,
      code: `# python manage.py shell; two templates held in memory instead of files
from django.template import Context, Engine

pages = {
    "layout.html": "[{% block heading %}Shop{% endblock %}] {% block body %}{% endblock %}",
    "books.html": (
        '{% extends "layout.html" %}{% block heading %}Books{% endblock %}'
        "{% block body %}{% for b in books %}{{ forloop.counter }}.{{ b.title|title }} "
        "{% empty %}none {% endfor %}{{ note|default:'-' }}{% endblock %}lost"
    ),
}
engine = Engine(loaders=[("django.template.loaders.locmem.Loader", pages)])
t = engine.get_template("books.html")
print(t.render(Context({"books": [{"title": "dune"}, {"title": "emma"}]})))
print(t.render(Context({"books": [], "note": "<b>soon</b>"})))`,
      steps: [
        "Line 5: the parent layout has a `heading` block with a default and an empty `body` block.",
        "Lines 7-9: the child extends it, replaces both blocks, and the text `lost` after the last block is outside every block, so it never prints.",
        "Line 14: the loop numbers each book with `forloop.counter` and capitalises it with `title`, and the missing `note` falls back to `-`.",
        "Line 15: the empty list renders the `{% empty %}` branch, and the note is HTML-escaped on the way out.",
      ],
      output: `[Books] 1.Dune 2.Emma -
[Books] none &lt;b&gt;soon&lt;/b&gt;`,
    },
    exercises: [
      'dj4e-tmpl-2',
      'dj-templates-predict-1',
      'py-dj-tpl-parsons-1',
      'py-dj-tpl-cloze-2',
      'dj-tmpl-1',
    ],
  },
  {
    id: 'dj_urls/1',
    topicKeys: [Topic.DJ_URLS],
    step: 1,
    title: 'URLs & Routing',
    idea: [
      lines(
        "`urlpatterns` in `urls.py` is a list of `path(route, view, name=...)` entries, tried from top to bottom until a route matches.",
        "Routes have no leading slash and end with one by convention, as in `\"books/\"`.",
      ),
      lines(
        "Angle brackets capture part of the path and pass it to the view as a keyword argument: `<int:pk>` matches digits and gives an `int`.",
        "The other converters are `str` (the default, anything but a slash), `slug`, `uuid` and `path`, and `re_path` takes a regular expression when none of them fits.",
      ),
      lines(
        "`include(\"app.urls\")` mounts an app's own `urls.py` under a prefix, and `app_name = \"app\"` in that file namespaces its names, as in `\"app:detail\"`.",
        "`name=` lets code and templates build a URL instead of hardcoding it: `reverse(\"app:detail\", args=[7])` in Python, `{% url \"app:detail\" 7 %}` in a template.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `# project/urls.py
from django.urls import include, path
urlpatterns = [
    path("prefix/", include("app.urls")),            # mount the app under /prefix/
]

# app/urls.py
app_name = "app"                                     # names become "app:..."
urlpatterns = [
    path("", views.index, name="index"),             # /prefix/
    path("<int:pk>/", views.detail, name="detail"),  # /prefix/7/, pk=7
]
# reverse("app:detail", args=[7]) == "/prefix/7/"`,
    },
    pitfall: lines(
      "`path(\"blog/\", \"blog.urls\")` is an error: a route needs a view or an `include()`, never a bare module path.",
      "Write `path(\"blog/\", include(\"blog.urls\"))`, and import `include` from `django.urls` next to `path`.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      runs: false,
      code: `# shop/urls.py, with path and the two view functions imported
app_name = "shop"
urlpatterns = [
    path("<int:pk>/", book, name="book"),
    path("<slug:genre>/", shelf, name="shelf"),
]
# bookshop/urls.py: urlpatterns = [path("store/", include("shop.urls"))]

# python manage.py shell
from django.urls import resolve, reverse
print(reverse("shop:book", args=[7]), reverse("shop:shelf", kwargs={"genre": "sci-fi"}))
match = resolve("/store/42/")
print(match.func.__name__, match.kwargs, match.view_name)
print(resolve("/store/sci-fi/").kwargs)`,
      steps: [
        "Lines 2-6: the app sets its namespace, `shop`, and names its two routes.",
        "Line 7: the project mounts the app under `store/`, so every shop URL starts with `/store/`.",
        "Line 11: `reverse()` builds each path from its name, filling the converter from `args` or `kwargs`.",
        "Lines 12-13: `resolve()` goes the other way; `42` matches the first route, so `book` gets `pk` as the `int` 42.",
        "Line 14: `sci-fi` is not digits, so the `int` route fails and the `slug` route matches.",
      ],
      output: `/store/7/ /store/sci-fi/
book {'pk': 42} shop:book
{'genre': 'sci-fi'}`,
    },
    exercises: [
      'dj-url-4',
      'dj-urls-predict-1',
      'py-dj-urls-parsons-2',
      'py-dj-urls-cloze-1',
      'py-dj-urls-path-basic',
    ],
  },
  {
    id: 'dj_forms/1',
    topicKeys: [Topic.DJ_FORMS],
    step: 1,
    title: 'Forms & Validation',
    idea: [
      lines(
        "A form class lists fields, and each brings its own checks: `CharField(max_length=50)`, `EmailField`, `IntegerField(min_value=1)`, and `required=False` for an optional one.",
        "A `ModelForm` builds those fields from a model, named with `model` and `fields` in an inner `class Meta`.",
      ),
      lines(
        "A form made with data, `Form(request.POST)`, is bound, and `is_valid()` runs every check.",
        "Then `cleaned_data` holds the converted values and `errors` maps each failing field to its messages.",
      ),
      lines(
        "Add rules with hooks: `clean_<field>()` checks one field and returns it, and `clean()` checks fields together, reading them with `.get()`.",
        "Raise `ValidationError` in either; an error from `clean()` is stored under `__all__` and shown by `non_field_errors()`.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `from django import forms

class ThingForm(forms.ModelForm):
    class Meta:
        model = Thing
        fields = ["title", "qty"]               # only these fields

    def clean_title(self):                      # one field
        value = self.cleaned_data["title"]
        if len(value) < 3:
            raise forms.ValidationError("Too short.")
        return value                            # always return the value

    def clean(self):                            # several fields; .get() each
        return super().clean()                  # a ValidationError here -> __all__`,
    },
    pitfall: lines(
      "A `clean_<field>()` hook that forgets `return value` sets that field's cleaned value to `None`, so the form saves an empty value without any error.",
      "End every field hook by returning the value, changed or not.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      runs: false,
      code: `# python manage.py shell
from django import forms

class OrderForm(forms.Form):
    title = forms.CharField(max_length=50)
    copies = forms.IntegerField(min_value=1)
    gift_wrap = forms.BooleanField(required=False)
    note = forms.CharField(required=False)

    def clean_title(self):
        return self.cleaned_data["title"].title()

    def clean(self):
        cleaned = super().clean()
        if cleaned.get("note") and not cleaned.get("gift_wrap"):
            raise forms.ValidationError("A note needs gift wrap.")
        return cleaned

ok = OrderForm({"title": "  dune ", "copies": "2"})
print(ok.is_valid(), ok.cleaned_data)
bad = OrderForm({"title": "emma", "copies": "0", "note": "hi"})
print(bad.is_valid(), sorted(bad.errors), bad.non_field_errors()[0])`,
      steps: [
        "Lines 4-8: four fields, each with its own checks; `gift_wrap` and `note` may be left out.",
        "Lines 10-11: the field hook gets the title after `CharField` has stripped its spaces, and returns it capitalised.",
        "Lines 19-20: every check passes, so `cleaned_data` holds converted values: the number 2, `False` for the missing checkbox and an empty note.",
        "Lines 21-22: `copies` fails `min_value`, and `clean()` adds a form-wide error under `__all__`.",
      ],
      output: `True {'title': 'Dune', 'copies': 2, 'gift_wrap': False, 'note': ''}
False ['__all__', 'copies'] A note needs gift wrap.`,
    },
    exercises: [
      'dj-forms-gap-1',
      'dj-forms-predict-3',
      'dj-forms-cloze-1',
      'dj-forms-clean-cross-cloze-1',
      'py-dj-form-clean-field',
    ],
  },
  {
    id: 'dj_auth/1',
    topicKeys: [Topic.DJ_AUTH],
    step: 1,
    title: 'Authentication & Permissions',
    idea: [
      lines(
        "`django.contrib.auth` gives a `User` model with hashed passwords, groups and permissions, and its middleware puts the visitor on `request.user`.",
        "That is a `User`, or an `AnonymousUser` whose `is_authenticated` is `False`.",
      ),
      lines(
        "`authenticate(request, username=..., password=...)` checks the credentials and returns the `User`, or `None`.",
        "`login(request, user)` stores that user in the session, and `logout(request)` clears it.",
      ),
      lines(
        "`@login_required` and `LoginRequiredMixin` send anonymous visitors to `LOGIN_URL`.",
        "`user.has_perm(\"app.codename\")` checks a permission given to the user or to one of their groups.",
        "Point foreign keys at `settings.AUTH_USER_MODEL`, so a custom user model can replace the default later.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required

owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

user = authenticate(request, username=u, password=p)   # a User or None
if user is not None:
    login(request, user)                               # store it in the session

@login_required                                        # else -> LOGIN_URL?next=...
def dashboard(request): ...

user.set_password("raw")                               # hash it, then user.save()
user.has_perm("app.change_thing")                      # direct or through a group`,
    },
    pitfall: lines(
      "`authenticate()` alone signs nobody in: it only returns the matching `User`, or `None` for wrong credentials.",
      "Test the result for `None`, then call `login(request, user)` to store the user in the session.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      runs: false,
      code: `# python manage.py shell; the shop app has a Book model, so change_book exists
from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.models import AnonymousUser, Permission

User = get_user_model()
clerk = User.objects.create_user("clerk", password="s3cret-pass")
print(clerk.password.startswith("pbkdf2_sha256$"), clerk.check_password("s3cret-pass"))
print(authenticate(username="clerk", password="wrong"))
user = authenticate(username="clerk", password="s3cret-pass")
print(user == clerk, user.is_authenticated, AnonymousUser().is_authenticated)
print(user.has_perm("shop.change_book"))
user.user_permissions.add(Permission.objects.get(codename="change_book"))
user = User.objects.get(pk=user.pk)
print(user.has_perm("shop.change_book"))`,
      steps: [
        "Lines 5-7: `create_user` hashes the password, so the stored value is a PBKDF2 hash, and `check_password` compares against it.",
        "Line 8: a wrong password makes `authenticate` return `None`.",
        "Lines 9-10: the right one returns the same user, who is authenticated, while an anonymous visitor is not.",
        "Line 11: the clerk has no `change_book` permission yet.",
        "Lines 12-14: after the grant, the user is fetched again, because a user object caches its permissions after the first check.",
      ],
      output: `True True
None
True True False
False
True`,
    },
    exercises: [
      'py-dj-auth-user-model',
      'py-dj-auth-parsons-1',
      'py-dj-auth-cloze-2',
      'py-dj-auth-authenticate-login',
      'py-dj-auth-predict-1',
    ],
  },
  {
    id: 'dj_rest/1',
    topicKeys: [Topic.DJ_REST],
    step: 1,
    title: 'Django REST Framework',
    idea: [
      lines(
        "Django REST Framework (DRF) builds JSON APIs on Django.",
        "A serializer converts both ways: a model instance into a dict of plain values for the response, and incoming data into validated values for a save.",
      ),
      lines(
        "A `ModelSerializer` builds its fields from `model` and `fields` in `class Meta`, as a `ModelForm` does.",
        "`Serializer(obj).data` gives one dict and `Serializer(qs, many=True).data` a list, while `Serializer(data=request.data)` takes input: `is_valid()`, then `save()`, or read `errors`.",
      ),
      lines(
        "A view takes a DRF `Request` and returns a `Response`, rendered as JSON: `@api_view([\"GET\", \"POST\"])` on a function, or an `APIView` class with `get()` and `post()`.",
        "A method the view does not allow answers 405, and `permission_classes` such as `[IsAuthenticatedOrReadOnly]` decide who may call it.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `from rest_framework import serializers
from rest_framework.decorators import api_view

class ThingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Thing
        fields = ["id", "title"]               # what goes in and out

ThingSerializer(obj).data                      # out: one dict
ThingSerializer(qs, many=True).data            # out: a list of dicts
s = ThingSerializer(data=request.data)         # in: always data=
s.is_valid()                                   # then s.save() or s.errors

@api_view(["GET", "POST"])                     # other methods -> 405
def endpoint(request): ...                     # return Response(data, status=...)`,
    },
    pitfall: lines(
      "`Serializer(request.data)` passes the input as an instance to serialize, so `is_valid()` refuses to run because no `data=` was given.",
      "Incoming data always goes in as `data=request.data`, and you read `.data` or call `save()` only after `is_valid()`.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      runs: false,
      code: `# python manage.py shell; here shop.Book has only title (CharField) and price (IntegerField)
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer
from rest_framework.test import APIRequestFactory
from shop.models import Book

class BookSerializer(ModelSerializer):
    class Meta:
        model = Book
        fields = ["title", "price"]

@api_view(["POST"])
def add_book(request):
    s = BookSerializer(data=request.data)
    if not s.is_valid():
        return Response(s.errors, status=400)
    s.save()
    return Response(s.data, status=201)

rf = APIRequestFactory()
r = add_book(rf.post("/books/", {"title": "Emma"}, format="json"))
print(r.status_code, r.data["price"][0], add_book(rf.get("/books/")).status_code)
r = add_book(rf.post("/books/", {"title": "Emma", "price": 8}, format="json"))
print(r.status_code, r.data)`,
      steps: [
        "Lines 8-19: in `python manage.py shell`, the serializer builds two fields from `Book`, and the view validates POSTed data before saving it.",
        "Lines 22-23: with no `price` the field's error comes back with 400, and a GET, not allowed here, gets 405.",
        "Lines 24-25: valid data is saved and returned with 201.",
      ],
      output: `400 This field is required. 405
201 {'title': 'Emma', 'price': 8}`,
    },
    exercises: [
      'dj-rest-gap-1',
      'dj-drf-predict-1',
      'dj-drf-parsons-1',
      'dj-drf-permclass-cloze-1',
      'py-drf-permission-class',
    ],
  },
  {
    id: 'dj_orm_mastery/1',
    topicKeys: [Topic.DJ_ORM_MASTERY],
    step: 1,
    title: 'ORM Mastery (deep revisit)',
    idea: [
      lines(
        "Mastering the ORM means knowing how many queries a line of code runs.",
        "Reading a foreign key on every row of a plain queryset runs one more query per row: 1 + N in all, the N+1 problem.",
        "`select_related(\"fk\")` joins a foreign key or one-to-one into the first query, and `prefetch_related(\"m2m\")` loads a many-to-many or reverse relation in one extra query.",
      ),
      lines(
        "Ask the database only what you need.",
        "`exists()` stops at the first matching row and `count()` returns a number, while `len(qs)` and `if qs:` load every row.",
        "`only()` and `defer()` trim columns, but reading a left-out column later costs a query per object.",
      ),
      lines(
        "A `Window` annotation computes across a group of rows and keeps every row: `RowNumber`, `Rank`, `Lag` and running sums, numbered per `partition_by` group in `order_by` order.",
        "`select_for_update()` locks the rows it reads until the transaction ends, so it only runs inside `transaction.atomic()`.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `from django.db import transaction
from django.db.models import F, Window
from django.db.models.functions import RowNumber

qs = Thing.objects.select_related("owner")      # FK / one-to-one: JOIN, same query
qs = qs.prefetch_related("tags")                # M2M / reverse FK: one extra query
qs.exists()                                     # any row? SELECT 1 ... LIMIT 1
qs.count()                                      # how many? COUNT(*), no objects built

Thing.objects.annotate(n=Window(                # every row kept, each gets n
    expression=RowNumber(),                     # or Rank(), Lag("col"), Sum("col")
    partition_by=[F("group")],                  # numbering restarts per group
    order_by=F("col").desc(),
))

with transaction.atomic():                      # the lock lasts until commit
    t = Thing.objects.select_for_update().get(pk=pk)`,
    },
    pitfall: lines(
      "A loop that reads `row.fk.field` over a plain queryset runs 1 + N queries: fast with 3 rows in development, slow with 3,000 in production.",
      "Load relations up front with `select_related` for a foreign key or `prefetch_related` for the many side, and count queries with `connection.queries` or the debug toolbar.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      runs: false,
      code: `# python manage.py shell with DEBUG = True; shop.Book has title, author (FK to Author) and sold
from django.db import connection, reset_queries
from django.db.models import F, Window
from django.db.models.functions import Rank
from shop.models import Author, Book

ann, bo = Author.objects.create(name="Ann"), Author.objects.create(name="Bo")
for title, author, sold in [("Dune", ann, 9), ("Emma", ann, 4), ("Ulysses", bo, 7)]:
    Book.objects.create(title=title, author=author, sold=sold)

reset_queries()
names = [b.author.name for b in Book.objects.all()]
print(len(connection.queries))
reset_queries()
names = [b.author.name for b in Book.objects.select_related("author")]
print(len(connection.queries))
print(Book.objects.filter(sold__gt=8).exists(), Book.objects.filter(author=bo).count())
top = Book.objects.annotate(
    pos=Window(expression=Rank(), partition_by=[F("author")], order_by=F("sold").desc())
)
print([(b.title, b.pos) for b in top.order_by("author__name", "pos")])`,
      steps: [
        "Lines 7-9: two authors and three books, two of them by Ann.",
        "Lines 11-13: the plain queryset loads the books in one query, then each `b.author` runs its own, so 1 + 3 = 4.",
        "Lines 14-16: `select_related` joins the author into the first query, so the same loop costs 1.",
        "Line 17: `exists()` asks for one matching row and `count()` for a number, and neither builds a `Book`.",
        "Lines 18-21: `Rank()` runs over each author's books, best seller first, and keeps all three rows: Dune is Ann's first, Emma her second and Ulysses Bo's first.",
      ],
      output: `4
1
True 1
[('Dune', 1), ('Emma', 2), ('Ulysses', 1)]`,
    },
    exercises: [
      'dj-orm-mastery-window-mcq-1',
      'dj-orm-mastery-lock-mcq-1',
      'dj-orm-mastery-perf-predict-1',
      'dj-orm-mastery-window-cloze-1',
      'dj-orm-mastery-lock-1',
    ],
  },
  {
    id: 'dj_models_mastery/1',
    topicKeys: [Topic.DJ_MODELS_MASTERY],
    step: 1,
    title: 'Models Mastery (deep revisit)',
    idea: [
      lines(
        "Models inherit in three ways.",
        "An abstract base (`abstract = True` in `Meta`) has no table: its fields are copied into each child.",
        "Multi-table inheritance, a subclass of a concrete model, gives the child its own table joined to the parent's by an automatic one-to-one, so reaching child fields from a parent costs a query.",
        "A proxy (`proxy = True`) uses the parent's table and rows and changes only Python behaviour such as ordering, methods and managers, so it cannot add fields.",
      ),
      lines(
        "Validation lives in `full_clean()`: field validators first, then `clean()` for rules across fields, then unique checks and constraints.",
        "Forms and serializers call it for you, while `save()`, `create()`, `bulk_create()` and `update()` never do.",
      ),
      lines(
        "`update()`, `bulk_create()` and `bulk_update()` are plain SQL, so an overridden `save()` and the save signals do not run for them.",
        "A rule that must hold under concurrent requests belongs in the database, as a `UniqueConstraint` or `CheckConstraint` in `Meta.constraints`.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `class Base(models.Model):                  # abstract: no table, fields copied down
    created = models.DateTimeField(auto_now_add=True)
    class Meta:
        abstract = True

class Thing(Base):
    a = models.IntegerField(validators=[MinValueValidator(0)])
    b = models.IntegerField()
    class Meta:                            # enforced by the database itself
        constraints = [models.UniqueConstraint(fields=["a", "b"], name="uniq_a_b")]

    def clean(self):                       # cross-field rule, run by full_clean()
        if self.b < self.a:
            raise ValidationError("b must not be below a.")

class OrderedThing(Thing):                 # proxy: same table, new behaviour only
    class Meta:
        proxy = True
        ordering = ["-b"]

obj.full_clean()                           # validators + clean(); save() skips both`,
    },
    pitfall: lines(
      "`save()` does not validate: a field's `validators` and the model's `clean()` are skipped by `obj.save()` and `objects.create()`, and the bad value is stored.",
      "Call `obj.full_clean()` before saving when no form or serializer did, and back a rule that must never break with a database constraint.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      runs: false,
      code: `# shop/models.py
class Loan(models.Model):
    reader = models.CharField(max_length=50)
    copies = models.IntegerField(validators=[MinValueValidator(1)])
    lent = models.DateField()
    due = models.DateField()

    def clean(self):
        if self.due < self.lent:
            raise ValidationError("Due date is before the loan date.")

class LateLoan(Loan):
    class Meta:
        proxy = True
        ordering = ["due"]

# python manage.py shell
from datetime import date
from django.core.exceptions import ValidationError
from shop.models import Loan, LateLoan

bad = Loan(reader="Ann", copies=0, lent=date(2026, 3, 9), due=date(2026, 3, 1))
try:
    bad.full_clean()
except ValidationError as e:
    print(sorted(e.message_dict))
bad.save()
late = LateLoan.objects.get(pk=bad.pk)
print(Loan.objects.count(), late.copies, type(late).__name__)`,
      steps: [
        "Lines 2-10: `copies` carries a field validator, and `clean()` holds the rule across two dates.",
        "Lines 12-15: `LateLoan` is a proxy, so it has no table of its own: the same rows with a different default order.",
        "Lines 22-26: `full_clean()` runs both checks, so the errors name `copies` and, for the `clean()` rule, `__all__`.",
        "Line 27: `save()` validates nothing, so the bad loan is stored as it is.",
        "Lines 28-29: the proxy reads that same row back, as a `LateLoan`.",
      ],
      output: `['__all__', 'copies']
1 0 LateLoan`,
    },
    exercises: [
      'dj-models-mastery-inherit-mcq-1',
      'dj-models-mastery-integrity-mcq-1',
      'dj-models-mastery-validate-predict-1',
      'dj-models-mastery-proxy-cloze-1',
      'dj-models-mastery-clean-1',
    ],
  },
  {
    id: 'dj_views_mastery/1',
    topicKeys: [Topic.DJ_VIEWS_MASTERY],
    step: 1,
    title: 'Views Mastery (deep revisit)',
    idea: [
      lines(
        "`as_view()` turns a class-based view into a function.",
        "For each request it builds a fresh instance, runs `setup()`, which sets `self.request`, `self.args` and `self.kwargs`, then `dispatch()`.",
        "`dispatch()` checks the verb against `http_method_names` and calls `get()`, `post()` and so on, or answers 405.",
        "Code that must run for every verb goes in an overridden `dispatch()` around `super().dispatch(...)`.",
      ),
      lines(
        "A function-view decorator such as `login_required` or `cache_page` cannot sit on a class.",
        "`@method_decorator(deco, name=\"dispatch\")` adapts it to the method every verb passes through.",
      ),
      lines(
        "Raise `Http404` or `PermissionDenied` and Django builds the 404 or 403 for you.",
        "After a POST that changes data, redirect, so a refresh repeats a GET rather than the POST (Post/Redirect/Get).",
        "`JsonResponse(data, safe=False)` sends a list, and `StreamingHttpResponse(generator)` sends a large export chunk by chunk, never holding the whole body in memory.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `from django.utils.decorators import method_decorator
from django.views import View

@method_decorator(some_decorator, name="dispatch")   # a function decorator, every verb
class ThingView(View):
    http_method_names = ["get", "post"]              # anything else -> 405

    def dispatch(self, request, *args, **kwargs):    # runs for every verb
        # before the handler
        response = super().dispatch(request, *args, **kwargs)
        # after the handler
        return response

    def get(self, request, *args, **kwargs): ...     # GET -> get()

    def post(self, request, *args, **kwargs):
        return redirect("thing-detail", pk=obj.pk)   # redirect after a POST

StreamingHttpResponse(rows(), content_type="text/csv")   # a generator, chunk by chunk`,
    },
    pitfall: lines(
      "`@cache_page` keys the cached page on the URL, not on the user, so on a personal page the first visitor's page is served to everyone until it expires.",
      "Cache whole views only when every visitor gets the same page, and cache personal data under keys that include the user.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      runs: false,
      code: `# python manage.py shell; a class-based view called with fake requests
from django.http import JsonResponse
from django.shortcuts import redirect
from django.test import RequestFactory
from django.views import View

class ShelfView(View):
    http_method_names = ["get", "post"]

    def dispatch(self, request, *args, **kwargs):
        print("in", request.method)
        response = super().dispatch(request, *args, **kwargs)
        print("out", response.status_code)
        return response

    def get(self, request, shelf):
        return JsonResponse([shelf, "Dune", "Emma"], safe=False)

    def post(self, request, shelf):
        return redirect(f"/shelves/{shelf}/")

rf = RequestFactory()
view = ShelfView.as_view()
print(view(rf.get("/shelves/sf/"), shelf="sf").content)
print(view(rf.post("/shelves/sf/"), shelf="sf")["Location"])
print(view(rf.delete("/shelves/sf/"), shelf="sf")["Allow"])`,
      steps: [
        "Lines 10-14: the overridden `dispatch()` wraps every verb: it prints on the way in, lets `super().dispatch()` pick the handler, and prints the status on the way out.",
        "Line 23: `as_view()` turns the class into a view function that builds a new `ShelfView` for each request.",
        "Line 24: GET goes to `get()`, and `safe=False` lets `JsonResponse` send a list.",
        "Line 25: the POST handler answers with a 302 redirect, so a refresh repeats a harmless GET.",
        "Line 26: DELETE is not in `http_method_names`, so `dispatch()` answers 405 and lists the allowed verbs in `Allow` (Django also logs a warning to stderr).",
      ],
      output: `in GET
out 200
b'["sf", "Dune", "Emma"]'
in POST
out 302
/shelves/sf/
in DELETE
out 405
GET, POST`,
    },
    exercises: [
      'dj-views-mastery-dispatch-mcq-1',
      'dj-views-mastery-decorator-mcq-1',
      'dj-views-mastery-cache-mcq-1',
      'dj-views-mastery-dispatch-predict-1',
      'dj-views-mastery-streaming-1',
    ],
  },
  {
    id: 'dj_forms_mastery/1',
    topicKeys: [Topic.DJ_FORMS_MASTERY],
    step: 1,
    title: 'Forms Mastery (deep revisit)',
    idea: [
      lines(
        "`is_valid()` runs in a fixed order.",
        "Each field converts its value and runs its validators, then its `clean_<field>()` hook, which is skipped when the field already failed.",
        "After every field, `clean()` checks rules across fields.",
        "A failed field is gone from `cleaned_data`, so `clean()` reads with `.get()`, and its errors go to `__all__` unless `self.add_error(\"field\", msg)` pins them to a field.",
      ),
      lines(
        "A `ModelForm` also runs the model's own validation: its `clean()` and its unique checks, so a taken username becomes a form error, not an `IntegrityError` at save.",
        "List its fields explicitly: `fields = \"__all__\"` exposes every model field, including ones added later, to anyone who can POST.",
      ),
      lines(
        "`save(commit=False)` returns an unsaved object, so you can set server-side fields such as the owner.",
        "Then `obj.save()` gives it a primary key and `form.save_m2m()` writes its many-to-many rows.",
        "Uploaded files arrive in `request.FILES`, so bind with `Form(request.POST, request.FILES)`.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `class ThingForm(forms.ModelForm):
    class Meta:
        model = Thing
        fields = ["title", "tags"]                  # an allow-list, never "__all__"

    def clean(self):                                # after every field's own checks
        cleaned = super().clean()
        if cleaned.get("a") and not cleaned.get("b"):   # .get(): a failed field is gone
            self.add_error("b", "Needed with a.")       # on the field, not __all__
        return cleaned

form = ThingForm(request.POST, request.FILES)       # files come separately
if form.is_valid():
    obj = form.save(commit=False)                   # unsaved, no M2M rows yet
    obj.owner = request.user                        # a server-set field
    obj.save()                                      # now it has a pk
    form.save_m2m()                                 # then the M2M rows`,
    },
    pitfall: lines(
      "After `save(commit=False)`, the many-to-many field is held back: `obj.save()` stores the row and silently drops the tags.",
      "Call `form.save_m2m()` after `obj.save()`, or use a plain `form.save()` when no server-side field needs setting.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      runs: false,
      code: `# python manage.py shell
from django import forms
from django.core.validators import MinValueValidator
from django.forms import formset_factory

class ReturnForm(forms.Form):
    copies = forms.IntegerField(validators=[MinValueValidator(1)])
    damaged = forms.BooleanField(required=False)
    note = forms.CharField(required=False)

    def clean_copies(self):
        print("clean_copies runs")
        return self.cleaned_data["copies"]

    def clean(self):
        cleaned = super().clean()
        print("clean sees", sorted(cleaned))
        if cleaned.get("damaged") and not cleaned.get("note"):
            self.add_error("note", "Say what is damaged.")
        return cleaned

form = ReturnForm({"copies": "0", "damaged": "on"})
print(form.is_valid(), sorted(form.errors))
ReturnFormSet = formset_factory(ReturnForm, extra=1)
print(ReturnFormSet(initial=[{"copies": 2}, {"copies": 1}]).total_form_count())`,
      steps: [
        "Lines 6-9: `copies` must be at least 1, while `damaged` and `note` may be left out.",
        "Lines 11-13: a field hook runs only once its field has passed its own checks.",
        "Lines 15-19: `clean()` reads fields with `.get()`, since a failed field is no longer in `cleaned_data`, and `add_error()` pins its error to `note` instead of `__all__`.",
        "Lines 22-23: `copies` is 0 and fails its validator, so `clean_copies()` never prints, `clean()` sees only `damaged` and `note`, and two fields end up with errors.",
        "Lines 24-25: a formset renders one form per `initial` row plus `extra` blank ones, 2 + 1 = 3.",
      ],
      output: `clean sees ['damaged', 'note']
False ['copies', 'note']
3`,
    },
    exercises: [
      'dj-forms-mastery-lifecycle-mcq-1',
      'dj-forms-mastery-security-mcq-1',
      'dj-forms-mastery-lifecycle-predict-1',
      'dj-forms-mastery-modelform-validate-mcq-1',
      'dj-forms-mastery-savem2m-1',
    ],
  },
  {
    id: 'dj_auth_mastery/1',
    topicKeys: [Topic.DJ_AUTH_MASTERY],
    step: 1,
    title: 'Auth Mastery (deep revisit)',
    idea: [
      lines(
        "A password is stored as `algorithm$iterations$salt$hash`, with a fresh salt per user.",
        "The first entry of `PASSWORD_HASHERS` hashes new passwords, the others still verify old ones, and an old hash is upgraded at the user's next login.",
        "`check_password()` compares in constant time, and `set_password()` only hashes: `AUTH_PASSWORD_VALIDATORS` run in the auth forms, `createsuperuser` and `validate_password()`.",
      ),
      lines(
        "`authenticate()` tries each backend in `AUTHENTICATION_BACKENDS` in order and stops at the first that returns a user.",
        "A backend is a class with `authenticate(self, request, **credentials)`, returning a user or `None`, and `get_user(self, user_id)`, which reloads the user from the session on each request.",
        "`login()` issues a new session key, which defeats session fixation.",
      ),
      lines(
        "An inactive user cannot log in and has no permissions, while an active superuser has them all.",
        "The default backend ignores the object in `has_perm(perm, obj)`, so row-level rules need your own check.",
        "The session cookie's flags guard it in the browser: `Secure` (HTTPS only), `HttpOnly` (hidden from JavaScript) and `SameSite` (not sent on cross-site requests).",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `class ThingBackend:
    def authenticate(self, request, key=None, secret=None):
        user = ...                                  # look the user up; None if absent
        if user and user.is_active and user.check_password(secret):
            return user                             # signed in by this backend
        return None                                 # let the next backend try

    def get_user(self, user_id):                    # reload from the session
        ...

AUTHENTICATION_BACKENDS = [
    "app.backends.ThingBackend",                    # tried first
    "django.contrib.auth.backends.ModelBackend",    # username and password
]
SESSION_COOKIE_SECURE = True                        # HTTPS only
SESSION_COOKIE_HTTPONLY = True                      # hidden from JavaScript
SESSION_COOKIE_SAMESITE = "Lax"                     # not sent cross-site`,
    },
    pitfall: lines(
      "A custom backend that lets `DoesNotExist` escape, or compares the typed password with `==` against the stored hash, either crashes the login or never matches.",
      "Catch the miss and return `None` so the next backend can try, and verify with `user.check_password(raw)`.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      runs: false,
      code: `# mysite/settings.py
AUTHENTICATION_BACKENDS = [
    "shop.backends.CardBackend",
    "django.contrib.auth.backends.ModelBackend",
]

# shop/backends.py
from django.contrib.auth import get_user_model

class CardBackend:
    def authenticate(self, request, card=None, pin=None):
        readers = get_user_model().objects.filter(username=f"card-{card}", is_active=True)
        reader = readers.first()
        if reader is not None and reader.check_password(pin):
            return reader
        return None

    def get_user(self, user_id):
        return get_user_model().objects.filter(pk=user_id).first()

# python manage.py shell
from django.contrib.auth import authenticate, get_user_model

reader = get_user_model().objects.create_user("card-1042", password="7731")
print(authenticate(card="1042", pin="7731").backend)
print(authenticate(username="card-1042", password="7731").backend)
print(authenticate(card="9999", pin="7731"))
reader.is_active = False
reader.save()
print(authenticate(card="1042", pin="7731"))`,
      steps: [
        "Lines 2-5: `authenticate()` tries the card backend first, then the default one.",
        "Lines 11-16: a library card signs in with its number and PIN, `.first()` gives `None` for an unknown or inactive card instead of raising, and the PIN is checked with `check_password()`.",
        "Line 24: `create_user()` hashes the PIN but runs no password validators, so a 4-digit PIN is accepted.",
        "Lines 25-26: card details are matched by the first backend, while a username and password do not fit its arguments, so Django moves on to `ModelBackend`, and `user.backend` records which one signed the user in.",
        "Lines 27-30: an unknown card and an inactive reader both get `None`.",
      ],
      output: `shop.backends.CardBackend
django.contrib.auth.backends.ModelBackend
None
None`,
    },
    exercises: [
      'dj-auth-mastery-cookie-flags-mcq-1',
      'dj-auth-mastery-inactive-mcq-1',
      'dj-auth-mastery-hashers-mcq-1',
      'dj-auth-mastery-perm-cache-predict-1',
      'dj-auth-mastery-backend-1',
    ],
  },
  {
    id: 'dj_rest_mastery/1',
    topicKeys: [Topic.DJ_REST_MASTERY],
    step: 1,
    title: 'DRF Mastery (deep revisit)',
    idea: [
      lines(
        "Before the handler, every DRF request passes authentication, then permissions, then throttles, and each can stop it with 401, 403 or 429.",
        "Session authentication rides on a cookie the browser sends by itself, so DRF enforces CSRF for it, while a token or JWT in the `Authorization` header is never sent automatically and needs none.",
      ),
      lines(
        "Verbs and codes carry meaning: create answers 201, delete 204 and invalid data 400.",
        "GET, PUT and DELETE are idempotent, so a client may retry them, and POST is not.",
        "PUT validates a whole new version of the object, PATCH (`partial=True`) only the fields sent, and `serializer.save()` calls `update()` when the serializer holds an instance and `create()` when it does not.",
      ),
      lines(
        "A nested serializer reads its relation row by row, so a list endpoint needs `select_related` or `prefetch_related` in `get_queryset()`.",
        "For one error shape across the API, a custom `EXCEPTION_HANDLER` calls DRF's own `exception_handler` first and reshapes its response only when it is not `None`.",
        "`ScopedRateThrottle` with a view's `throttle_scope` gives one endpoint its own rate, and versioning puts `request.version` on each request.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `class ThingViewSet(viewsets.ModelViewSet):       # list, create, retrieve, update, destroy
    serializer_class = ThingSerializer
    throttle_scope = "things"                       # rate in DEFAULT_THROTTLE_RATES

    def get_queryset(self):                         # nested fields: load them up front
        return Thing.objects.select_related("owner").prefetch_related("tags")

ThingSerializer(data=data)                          # no instance: save() -> create(), 201
ThingSerializer(obj, data=data)                     # an instance: save() -> update(), PUT
ThingSerializer(obj, data=data, partial=True)       # PATCH: only the fields sent

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [...],        # session needs CSRF, tokens do not
    "EXCEPTION_HANDLER": "app.errors.handler",      # one error shape for every view
}`,
    },
    pitfall: lines(
      "An update view that builds `Serializer(data=request.data)` without the instance makes `save()` call `create()`, so every edit adds a new row.",
      "Pass the object first, `Serializer(obj, data=request.data, partial=True)` for a PATCH, and let a viewset's `update()` do it for you where you can.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      runs: false,
      code: `# python manage.py shell; here shop.Book has only title (CharField) and price (IntegerField)
from rest_framework import serializers, viewsets
from rest_framework.test import APIRequestFactory
from shop.models import Book

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ["id", "title", "price"]

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

rf = APIRequestFactory()
detail = BookViewSet.as_view({"put": "update", "patch": "partial_update", "delete": "destroy"})
book = Book.objects.create(title="Emma", price=8)
r = detail(rf.put("/books/1/", {"price": 9}, format="json"), pk=book.pk)
print(r.status_code, r.data["title"][0])
r = detail(rf.patch("/books/1/", {"price": 9}, format="json"), pk=book.pk)
print(r.status_code, r.data)
r = detail(rf.delete("/books/1/"), pk=book.pk)
print(r.status_code, Book.objects.count())`,
      steps: [
        "Lines 11-16: a `ModelViewSet` holds every action, and `as_view()` maps each verb of the detail route to one of them.",
        "Lines 18-19: PUT replaces the whole book, so leaving `title` out is a 400 with that field's error.",
        "Lines 20-21: PATCH is a partial update, so only `price` is validated and changed, and the serializer, given the book, calls `update()` rather than `create()`.",
        "Lines 22-23: DELETE answers 204 with no body, and the row is gone.",
      ],
      output: `400 This field is required.
200 {'id': 1, 'title': 'Emma', 'price': 9}
204 0`,
    },
    exercises: [
      'dj-rest-mastery-idempotency-mcq-1',
      'dj-rest-mastery-authclasses-mcq-1',
      'dj-rest-mastery-save-predict-1',
      'dj-rest-mastery-nplus1-predict-1',
      'dj-rest-mastery-exception-1',
    ],
  },
  {
    id: 'dj_admin/1',
    topicKeys: [Topic.DJ_ADMIN],
    step: 1,
    title: 'Admin Customization',
    idea: [
      lines(
        "The admin gives staff a list page, called the changelist, and an edit page for every registered model.",
        "In `admin.py`, `@admin.register(Model)` on a `ModelAdmin` subclass registers it with your options.",
        "With no options each row shows `str(obj)`, so the model's `__str__` names it everywhere in the admin.",
      ),
      lines(
        "The changelist: `list_display` picks the columns (fields, or methods marked `@admin.display`), `list_filter` adds a sidebar, `search_fields` a search box and `ordering` the sort.",
        "The edit page: `fieldsets` group fields under headings, `readonly_fields` show values as text, and `inlines` edit related rows on the parent's page, as a table with `TabularInline` or stacked forms with `StackedInline`, with `extra` blank rows.",
      ),
      lines(
        "An action is a method taking `(self, request, queryset)`, labelled with `@admin.action(description=...)` and named in `actions`.",
        "The admin is a tool for trusted staff, not a public site: keep it behind strong logins, or off the public internet.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `from django.contrib import admin

class ChildInline(admin.TabularInline):             # related rows on the parent page
    model = Child
    extra = 1                                       # blank rows for new children

@admin.register(Thing)
class ThingAdmin(admin.ModelAdmin):
    list_display = ("name", "state", "is_open")     # changelist columns
    list_filter = ("state",)                        # a 1-tuple needs its comma
    readonly_fields = ("created",)                  # shown as text
    inlines = [ChildInline]
    actions = ["close"]

    @admin.display(boolean=True)                    # a computed column
    def is_open(self, obj):
        return obj.state == "open"

    @admin.action(description="Close selected")
    def close(self, request, queryset):
        queryset.update(state="closed")             # one UPDATE for every ticked row`,
    },
    pitfall: lines(
      "A `list_display` method that queries per row, such as `obj.review_set.count()`, runs one query for every row of every changelist page.",
      "Override `get_queryset()` to annotate the value once, with `Count(\"review\")`, and have the method return the annotation.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      runs: false,
      code: `# shop/admin.py; shop.Book has title and stock, and Review has a book FK and stars
from django.contrib import admin
from .models import Book, Review

class ReviewInline(admin.TabularInline):
    model = Review
    extra = 0

@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ("title", "stock", "in_stock")
    search_fields = ("title",)
    inlines = [ReviewInline]
    actions = ["sell_out"]

    @admin.display(boolean=True, description="In stock")
    def in_stock(self, obj):
        return obj.stock > 0

    @admin.action(description="Mark selected as sold out")
    def sell_out(self, request, queryset):
        queryset.update(stock=0)

# python manage.py shell
from django.contrib import admin
from shop.models import Book

dune = Book.objects.create(title="Dune", stock=3)
Book.objects.create(title="Emma", stock=0)
book_admin = admin.site.get_model_admin(Book)
print(str(dune), book_admin.in_stock(dune))
book_admin.sell_out(None, Book.objects.filter(stock__gt=0))
print(list(Book.objects.order_by("title").values_list("title", "stock")))`,
      steps: [
        "Lines 5-7: the inline puts each book's reviews in a table on the book's edit page, with no blank rows.",
        "Lines 11-14: the changelist shows three columns, a search box over `title` and one bulk action.",
        "Lines 16-18: `in_stock` is a computed column, and `boolean=True` draws it as a tick or a cross.",
        "Lines 30-31: `get_model_admin()` (Django 5.0+) returns the registered `BookAdmin`, and since `Book` has no `__str__`, its rows would read `Book object (1)`.",
        "Lines 32-33: an action is just a method given the ticked rows, and here one `update()` sells out every book still in stock.",
      ],
      output: `Book object (1) True
[('Dune', 0), ('Emma', 0)]`,
    },
    exercises: [
      'py-dj-admin-what',
      'dj-admin-predict-1',
      'dj-admin-cloze-1',
      'py-dj-admin-list-display',
      'py-dj-admin-prod-risk',
    ],
  },
  {
    id: 'dj_caching/1',
    topicKeys: [Topic.DJ_CACHING, Topic.DJ_TRANSACTIONS],
    step: 1,
    title: 'Caching & Transactions',
    idea: [
      lines(
        "A cache keeps a computed result in fast storage, so repeat requests skip the work.",
        "From broad to narrow: the per-site middleware, `@cache_page(seconds)` on a view, keyed by URL and so only for pages every visitor shares, `{% cache %}` around a template fragment, and the low-level API.",
        "That API is `cache.set(key, value, timeout)`, `cache.get(key, default)`, `cache.get_or_set(key, function, timeout)` and `cache.delete(key)`, with timeouts in seconds.",
      ),
      lines(
        "In production use a shared backend such as Redis or Memcached, since `LocMemCache` lives inside each worker process.",
        "A cached value goes stale when its data changes, so delete the key then, often from a `post_save` receiver.",
      ),
      lines(
        "Django commits each query on its own unless you group them: `transaction.atomic()`, as a decorator or a `with` block, commits the block as one unit, or rolls all of it back when an exception leaves it.",
        "An `atomic()` nested inside another is a savepoint that can fail alone, `select_for_update()` locks the rows it reads until the commit, and `transaction.on_commit(fn)` runs work such as an email only after the commit.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `from django.core.cache import cache
from django.db import IntegrityError, transaction

value = cache.get(key)                      # None on a miss
if value is None:                           # not "if not value": 0 and [] are hits
    value = compute()
    cache.set(key, value, timeout=300)      # seconds
cache.get_or_set(key, compute, timeout=300) # the same in one call; pass the function
cache.delete(key)                           # when the data changes

with transaction.atomic():                  # all or nothing
    row = Thing.objects.select_for_update().get(pk=pk)   # locked until commit
    try:
        with transaction.atomic():          # a savepoint
            risky_write()
    except IntegrityError:                  # caught outside the inner block
        pass
    transaction.on_commit(send_email)       # runs only once the commit succeeds`,
    },
    pitfall: lines(
      "Catching a database error inside an `atomic()` block hides it from Django, and after an `IntegrityError` every later query in that block raises `TransactionManagementError`.",
      "Put the risky write in its own inner `atomic()` and catch the error outside that inner block, so only the savepoint rolls back.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      runs: false,
      code: `# python manage.py shell; the default LocMemCache, and shop.Tag has a unique name
from django.core.cache import cache
from django.db import IntegrityError, transaction
from shop.models import Tag

def count_tags():
    print("counting")
    return Tag.objects.count()

print(cache.get_or_set("tags:n", count_tags, 60))
with transaction.atomic():
    Tag.objects.create(name="poetry")
    try:
        with transaction.atomic():
            Tag.objects.create(name="poetry")
    except IntegrityError:
        print("duplicate skipped")
    Tag.objects.create(name="sci-fi")
print(cache.get_or_set("tags:n", count_tags, 60))
cache.delete("tags:n")
print(cache.get_or_set("tags:n", count_tags, 60))`,
      steps: [
        "Line 10: the key is missing, so `get_or_set` calls `count_tags` and caches its 0 for 60 seconds.",
        "Lines 11-12: the outer `atomic()` opens a transaction and adds a tag.",
        "Lines 13-17: the inner `atomic()` is a savepoint, so when the duplicate name fails there only the savepoint rolls back, and the error is caught outside it.",
        "Line 18: the outer transaction is still healthy, adds a second tag and commits both when its block ends.",
        "Lines 19-21: the cache still says 0 until the key is deleted, and then the next call counts again and finds 2.",
      ],
      output: `counting
0
duplicate skipped
0
counting
2`,
    },
    exercises: [
      'dj-transactions-gap-1',
      'dj-transactions-parsons-1',
      'dj-caching-getset-cloze-1',
      'dj-caching-predict-1',
      'dj-transactions-predict-1',
    ],
  },
  {
    id: 'dj_signals_mw/1',
    topicKeys: [Topic.DJ_SIGNALS_MW],
    step: 1,
    title: 'Signals & Middleware',
    idea: [
      lines(
        "Middleware wraps every request.",
        "A middleware class is built once with `get_response`, the next layer, and then called for each request: code before `self.get_response(request)` runs on the way in, code after it on the way out.",
        "`MIDDLEWARE` works like an onion: requests go down the list and responses come back up, so a layer that needs another's work sits below it, as authentication sits below sessions.",
      ),
      lines(
        "A signal tells receivers that something happened to a model: `pre_save`, `post_save`, `pre_delete`, `post_delete` and `m2m_changed`.",
        "`@receiver(post_save, sender=Model)` connects a function taking `(sender, instance, created, **kwargs)`, where `created` is `True` only for an insert.",
        "Keep receivers in the app's `signals.py` and import it in the app config's `ready()`.",
      ),
      lines(
        "Use middleware for what every request needs, such as headers, timing and request ids.",
        "Use signals for side effects of model events in code you do not own, and call a function directly when you own both sides.",
        "Signals do not fire for `update()`, `bulk_create()` or raw SQL.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `class ThingMiddleware:                            # listed in settings.MIDDLEWARE
    def __init__(self, get_response):             # once, at startup
        self.get_response = get_response

    def __call__(self, request):                  # every request
        # on the way in
        response = self.get_response(request)     # the next layers, then the view
        # on the way out
        return response

@receiver(post_save, sender=Thing)                # in app/signals.py
def on_saved(sender, instance, created, **kwargs):
    if created: ...                               # True only for an insert

class ThingConfig(AppConfig):                     # in app/apps.py
    name = "app"
    def ready(self):
        from . import signals                     # connects the receivers`,
    },
    pitfall: lines(
      "A receiver in a module nothing imports is never connected, so the model saves, no receiver runs and nothing reports an error.",
      "Import the `signals` module in the app config's `ready()`, which Django calls once at startup.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      runs: false,
      code: `# python manage.py shell; shop.Tag has a name, and an app would connect the receiver in ready()
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.http import HttpResponse
from django.test import RequestFactory
from shop.models import Tag

class StampMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        print("in", request.path)
        response = self.get_response(request)
        response["X-Shop"] = "stamped"
        print("out", response.status_code)
        return response

@receiver(post_save, sender=Tag)
def tag_saved(sender, instance, created, **kwargs):
    print("saved", instance.name, created)

def add_tag(request):
    tag = Tag.objects.create(name="poetry")
    tag.name = "verse"
    tag.save()
    return HttpResponse("ok", status=201)

handler = StampMiddleware(add_tag)
print(handler(RequestFactory().post("/tags/"))["X-Shop"])`,
      steps: [
        "Lines 8-10: Django builds each middleware once, handing it the next layer as `get_response`.",
        "Lines 12-17: for each request, the code before `get_response()` runs on the way in, and the code after it runs on the way out and adds a header.",
        "Lines 19-21: the receiver hears every saved `Tag`, and in an app it would live in `signals.py`, imported in `ready()`.",
        "Line 29: this is what `MIDDLEWARE` does with each class in the list, wrapping the view layer by layer.",
        "Line 30: the request passes through the middleware into the view, whose two saves send `post_save` with `created` first `True`, then `False`.",
      ],
      output: `in /tags/
saved poetry True
saved verse False
out 201
stamped`,
    },
    exercises: [
      'dj-signals-mw-gap-1',
      'dj-middleware-parsons-1',
      'dj-signals-cloze-1',
      'py-dj-mw-order',
      'dj-signals-predict-1',
    ],
  },
  {
    id: 'dj_management/1',
    topicKeys: [Topic.DJ_MANAGEMENT, Topic.DJ_DEPLOYMENT],
    step: 1,
    title: 'Management Commands & Deployment',
    idea: [
      lines(
        "A custom command is a class named `Command` that subclasses `BaseCommand`, in `<app>/management/commands/<name>.py`, and the file name is the command's name.",
        "`add_arguments(self, parser)` declares arguments the argparse way, and `handle(self, *args, **options)` does the work, reading `options[\"name\"]` and writing with `self.stdout.write()`.",
        "`call_command(\"name\", ..., option=value)` runs a command in the same process, which suits tests and scripts, while a plain script must set `DJANGO_SETTINGS_MODULE` and call `django.setup()` before it imports any model.",
      ),
      lines(
        "In production, `DEBUG = False`, `ALLOWED_HOSTS` names the real hosts, and the secret key and other config come from environment variables, so one build runs everywhere (12-factor config).",
        "HTTPS settings such as `SECURE_SSL_REDIRECT`, secure cookies and HSTS come next, and `python manage.py check --deploy` reports what is missing.",
      ),
      lines(
        "`runserver` is for development only.",
        "A WSGI server such as gunicorn runs the app (`gunicorn mysite.wsgi:application --workers 4`), or an ASGI server such as uvicorn for async views and websockets.",
        "`collectstatic` copies static files into `STATIC_ROOT` for nginx or WhiteNoise to serve, and Docker packages it all.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `# app/management/commands/thing.py  ->  python manage.py thing ARG --flag N
from django.core.management.base import BaseCommand

class Command(BaseCommand):                        # always named Command
    def add_arguments(self, parser):
        parser.add_argument("arg")                 # positional
        parser.add_argument("--flag", type=int, default=1)

    def handle(self, *args, **options):            # options is a dict
        self.stdout.write(f"{options['arg']} {options['flag']}")

# settings.py in production: config from the environment, as text
DEBUG = os.environ.get("DJANGO_DEBUG", "False") == "True"
SECRET_KEY = os.environ["SECRET_KEY"]              # never in git

# deploy: check --deploy, migrate, collectstatic, then gunicorn mysite.wsgi:application`,
    },
    pitfall: lines(
      "Shipping with `DEBUG = True` turns every error into a page of tracebacks, local variables and settings for whoever caused it.",
      "Read `DEBUG` from the environment as text and default it to off, and run `check --deploy` before each release.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      runs: false,
      code: `# shop/management/commands/restock.py; shop.Book has title and stock
from django.core.management.base import BaseCommand
from shop.models import Book

class Command(BaseCommand):
    help = "Top up every book below a stock level."

    def add_arguments(self, parser):
        parser.add_argument("level", type=int)
        parser.add_argument("--dry-run", action="store_true")

    def handle(self, *args, **options):
        low = Book.objects.filter(stock__lt=options["level"])
        self.stdout.write(f"{low.count()} below {options['level']}")
        if not options["dry_run"]:
            low.update(stock=options["level"])

# python manage.py shell
from django.core.management import call_command
from shop.models import Book

Book.objects.create(title="Dune", stock=1)
Book.objects.create(title="Emma", stock=6)
call_command("restock", 5, dry_run=True)
call_command("restock", 5)
print(list(Book.objects.order_by("title").values_list("stock", flat=True)))`,
      steps: [
        "Line 1: the file name is the command name, so from a terminal this runs as `python manage.py restock 5 --dry-run`.",
        "Lines 8-10: `level` is a required number, and the flag `--dry-run` becomes the option `dry_run`.",
        "Lines 12-16: `handle()` reads both from `options` and writes its report with `self.stdout.write()`.",
        "Line 24: `call_command` runs the same command in this process, with `dry_run=True` standing for the flag, so it only reports.",
        "Lines 25-26: the real run raises Dune to 5 and leaves Emma alone.",
      ],
      output: `1 below 5
1 below 5
[5, 6]`,
    },
    exercises: [
      'dj-management-gap-1',
      'dj-deploy-predict-1',
      'dj-management-parsons-1',
      'py-dj-deploy-gunicorn',
      'dj-mgmt-predict-1',
    ],
  },
  {
    id: 'dj_pagination_generics/1',
    topicKeys: [Topic.DJ_PAGINATION_GENERICS],
    step: 1,
    title: 'Pagination & Generic Views',
    idea: [
      lines(
        "DRF generic views are ready-made classes for the usual endpoints: give one a `queryset` and a `serializer_class`, and it handles the request, the serializer and the response.",
        "`ListAPIView` answers GET with a list and `CreateAPIView` answers POST, while `RetrieveAPIView`, `UpdateAPIView` and `DestroyAPIView` work on one row found by the URL's `pk`.",
        "Combined names such as `ListCreateAPIView` and `RetrieveUpdateDestroyAPIView` join them, each wired with `path(..., View.as_view())`, which suits an API that needs only part of CRUD or different settings for list and detail.",
      ),
      lines(
        "Every list comes from `get_queryset()`, which by default returns the `queryset` attribute, and `get_object()` picks one row from it.",
        "Override `get_queryset()` when the rows depend on the request, through `self.request.user`, `self.request.query_params` or `self.kwargs`.",
      ),
      lines(
        "Pagination sends a long list a page at a time.",
        "`PageNumberPagination` reads `?page=N`, cuts `page_size` rows, and wraps them in `count` (the total), `next`, `previous` and `results`.",
        "Set `page_size_query_param` to let a client pick its own size, capped by `max_page_size`.",
        "`CursorPagination` follows a cursor over a fixed ordering instead, which stays fast deep into a big table but cannot jump to page N.",
        "Set one for every view with `DEFAULT_PAGINATION_CLASS` and `PAGE_SIZE` in `REST_FRAMEWORK`, or per view with `pagination_class`, and override `get_paginated_response(self, data)` to reshape the JSON, reading Django's `Page` from `self.page`.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `from rest_framework import generics
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

class ThingPages(PageNumberPagination):
    page_size = 20                                    # rows per page; ?page=N picks one
    def get_paginated_response(self, data):           # only to reshape the JSON
        return Response({"count": self.page.paginator.count, "results": data})

class ThingList(generics.ListCreateAPIView):          # GET list, POST create
    serializer_class = ThingSerializer
    pagination_class = ThingPages
    def get_queryset(self):                           # runs per request
        return Thing.objects.filter(owner=self.request.user).order_by("id")

class ThingDetail(generics.RetrieveUpdateDestroyAPIView):   # GET, PUT, PATCH, DELETE
    queryset = Thing.objects.all()                    # the same for every caller
    serializer_class = ThingSerializer

urlpatterns = [
    path("things/", ThingList.as_view()),
    path("things/<int:pk>/", ThingDetail.as_view()),
]`,
    },
    pitfall: lines(
      "A filter that depends on the caller cannot live in the `queryset` attribute, because the class body runs once at import, when there is no request.",
      "Put it in `get_queryset()`, which DRF calls for each request with `self.request` and `self.kwargs` set, and give the rows an `order_by()` so the pages do not shift between calls.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      runs: false,
      code: `# python manage.py shell; shop.Book has title and stock; SERVER_NAME="localhost" keeps the host in the default ALLOWED_HOSTS
from rest_framework import generics, serializers
from rest_framework.pagination import PageNumberPagination
from rest_framework.test import APIRequestFactory
from shop.models import Book

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ["title"]

class SmallPages(PageNumberPagination):
    page_size = 2
    page_size_query_param = "size"
    max_page_size = 3

class BookList(generics.ListAPIView):
    serializer_class = BookSerializer
    pagination_class = SmallPages

    def get_queryset(self):
        books = Book.objects.order_by("title")
        if self.request.query_params.get("in_stock") == "yes":
            books = books.filter(stock__gt=0)
        return books

for title, stock in [("Dune", 0), ("Emma", 3), ("Ivanhoe", 1), ("Middlemarch", 0), ("Persuasion", 2)]:
    Book.objects.create(title=title, stock=stock)
view = BookList.as_view()
for params in [{}, {"in_stock": "yes", "size": 10}]:
    data = view(APIRequestFactory(SERVER_NAME="localhost").get("/books/", params)).data
    print(data["count"], [b["title"] for b in data["results"]], data["next"])`,
      steps: [
        "Lines 12-15: 2 rows per page by default, and a client may ask for another size with `?size=N`, capped at 3.",
        "Lines 17-19: `ListAPIView` answers GET with no `get()` of its own, and only needs a serializer, the rows and, here, a pagination class.",
        "Lines 21-25: `get_queryset()` runs for each request, so it can read the query string and drop the books out of stock, in title order.",
        "Line 32, first call: `count` is all 5 books, page 1 holds Dune and Emma, and `next` is the full link to page 2.",
        "Line 32, second call: 3 books are in stock and the asked size of 10 is cut to 3, so they all fit on one page and `next` is `None`.",
      ],
      output: `5 ['Dune', 'Emma'] http://localhost/books/?page=2
3 ['Emma', 'Ivanhoe', 'Persuasion'] None`,
    },
    exercises: [
      'dj-pagination-gap-2',
      'dj-pagination-generics-cloze-1',
      'celery-drf-14',
      'dj-pagination-predict-1',
      'dj-pagination-custom-cloze-1',
    ],
  },
  {
    id: 'dj_api_docs/1',
    topicKeys: [Topic.DJ_API_DOCS],
    step: 1,
    title: 'API Documentation (drf-spectacular)',
    idea: [
      lines(
        "OpenAPI is a JSON or YAML description of an API: its paths, the methods on each, the request and response bodies, and the auth it needs.",
        "Swagger UI renders that description as an interactive page where you can send real requests, Redoc renders it as reference docs, and client generators turn it into typed SDKs.",
      ),
      lines(
        "drf-spectacular writes the schema by reading your code: the URL patterns give the paths, each view's handlers give the methods, and each serializer becomes a named component whose properties are its fields.",
        "Docs made this way do not drift from the code, since a new field or endpoint shows up the next time the schema is built.",
      ),
      lines(
        "Set it up with `\"drf_spectacular\"` in `INSTALLED_APPS` and its `AutoSchema` as `DEFAULT_SCHEMA_CLASS` in `REST_FRAMEWORK`.",
        "Then route `SpectacularAPIView` for the raw schema and `SpectacularSwaggerView` or `SpectacularRedocView` for the pages, giving them `url_name` of the schema route.",
        "Where the guess falls short, `@extend_schema(...)` on one method sets that operation's `summary`, `description`, `request`, `responses={200: Serializer}`, `examples` and `tags`.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `# settings.py
INSTALLED_APPS = [..., "rest_framework", "drf_spectacular"]
REST_FRAMEWORK = {"DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema"}

# urls.py
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
urlpatterns = [
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),        # raw OpenAPI
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema")),   # the page
]

# views.py: only where the guess falls short
from drf_spectacular.utils import extend_schema

class ThingViewSet(viewsets.ModelViewSet):
    @extend_schema(summary="...", request=None, responses={200: OtherSerializer}, tags=["things"])
    @action(detail=True, methods=["post"])
    def verb(self, request, pk=None): ...`,
    },
    pitfall: lines(
      "A plain `APIView` or an `@action` that returns some other shape gives drf-spectacular nothing true to read.",
      "The first is documented with no body and a warning, and the second with the view's own serializer, so the docs look complete while describing the wrong JSON.",
      "Read the warnings the schema build prints, and add `@extend_schema(request=..., responses=...)` to those methods.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      runs: false,
      code: `# python manage.py shell; drf_spectacular is installed and its AutoSchema is DEFAULT_SCHEMA_CLASS
from django.urls import path
from drf_spectacular.generators import SchemaGenerator
from drf_spectacular.utils import extend_schema
from rest_framework import generics, serializers
from shop.models import Book

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ["id", "title", "stock"]

class BookDetail(generics.RetrieveUpdateAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

    @extend_schema(summary="Read one book", tags=["shop"])
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

urlpatterns = [path("books/<int:pk>/", BookDetail.as_view())]
schema = SchemaGenerator(patterns=urlpatterns).get_schema(request=None, public=True)
ops = schema["paths"]["/books/{id}/"]
print(ops["get"]["summary"], ops["get"]["tags"], ops["patch"]["tags"])
print(ops["get"]["responses"]["200"]["content"]["application/json"]["schema"])
print(list(schema["components"]["schemas"]["Book"]["properties"]))`,
      steps: [
        "Lines 8-15: an ordinary serializer and update view, with nothing written for the docs.",
        "Lines 17-19: `@extend_schema` on `get` sets a summary and a tag for that one operation, and the method only calls the parent's.",
        "Line 22: `SchemaGenerator` is what `SpectacularAPIView` runs to serve the schema; it reads the one URL, and `<int:pk>` becomes the path parameter `{id}`.",
        "Line 24: GET carries the decorator's summary and tag, while PATCH, untouched, keeps the tag guessed from the path's first part.",
        "Lines 25-26: the response body points at a `Book` component, named after the serializer without `Serializer`, whose properties are the serializer's fields.",
      ],
      output: `Read one book ['shop'] ['books']
{'$ref': '#/components/schemas/Book'}
['id', 'title', 'stock']`,
    },
    exercises: [
      'celery-drf-19',
      'dj-api-docs-predict-1',
      'dj-api-docs-cloze-1',
      'dj-api-docs-urls-cloze-1',
      'celery-drf-18',
    ],
  },
  {
    id: 'dj_custom_managers/1',
    topicKeys: [Topic.DJ_CUSTOM_MANAGERS, Topic.DJ_SERVICE_LAYER],
    step: 1,
    title: 'Custom Managers & Service Layer',
    idea: [
      lines(
        "A manager is a model's way in to its rows: `objects` is the one Django adds, and `all()`, `filter()`, `get()` and `create()` are its methods.",
        "Subclass `models.Manager` and override `get_queryset()` to change what every query starts from, as a soft delete hides rows marked deleted.",
        "The first manager a model declares is its default, so keep a plain `models.Manager()` under another name to reach every row.",
      ),
      lines(
        "For named queries such as `published()`, write the methods on a `models.QuerySet` subclass, each returning `self.filter(...)`, and attach it with `objects = ThingQuerySet.as_manager()`.",
        "Then `objects.published().recent()` chains into one SQL query, and a method that returns something other than rows, such as a stats dict, can stay on a manager.",
      ),
      lines(
        "A service layer is a plain module, often `services.py`, whose functions hold the business rules of one action: the checks, the writes inside `transaction.atomic()`, and the side effects.",
        "The view keeps the HTTP work, calling the service and turning its result or its exception into a response, while a command, a task or a test calls the same function with no request at all.",
        "Logic about one model, such as an order's total, can stay a model method.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `# models.py
class ThingQuerySet(models.QuerySet):         # each method returns a QuerySet
    def live(self):
        return self.filter(is_deleted=False)
    def owned_by(self, user):
        return self.filter(owner=user)

class Thing(models.Model):
    objects = ThingQuerySet.as_manager()      # Thing.objects.live().owned_by(u)
    all_objects = models.Manager()            # a second, plain manager

# services.py: plain arguments in, a result or a domain error out
class NotAllowed(Exception): ...

def do_action(user, thing_id):
    with transaction.atomic():
        thing = Thing.objects.live().owned_by(user).get(pk=thing_id)
        ...                                   # checks raise NotAllowed
    return thing

# views.py: HTTP only
try:
    thing = do_action(request.user, pk)
except NotAllowed as err:
    return Response({"detail": str(err)}, status=400)`,
    },
    pitfall: lines(
      "Query methods written on a `Manager` subclass work only straight off `objects`: `Thing.objects.published().recent()` raises `AttributeError`, because `published()` returns a plain QuerySet.",
      "Put the methods on a `QuerySet` subclass that return `self.filter(...)`, and attach it with `as_manager()`.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      runs: false,
      code: `# shop/models.py
from django.db import models

class BookQuerySet(models.QuerySet):
    def on_sale(self):
        return self.filter(hidden=False)

    def in_stock(self):
        return self.filter(stock__gt=0)

class Book(models.Model):
    title = models.CharField(max_length=100)
    stock = models.IntegerField(default=0)
    hidden = models.BooleanField(default=False)
    objects = BookQuerySet.as_manager()

# shop/services.py
from django.db import transaction
from .models import Book

class SoldOut(Exception):
    pass

def sell(title):
    with transaction.atomic():
        books = Book.objects.select_for_update().on_sale().in_stock()
        book = books.filter(title=title).first()
        if book is None:
            raise SoldOut(title)
        book.stock -= 1
        book.save()
    return book.stock

# python manage.py shell
from shop.models import Book
from shop.services import SoldOut, sell

Book.objects.create(title="Dune", stock=1)
Book.objects.create(title="Emma", stock=4, hidden=True)
print(Book.objects.on_sale().in_stock().count(), Book.objects.count())
for title in ["Dune", "Dune", "Emma"]:
    try:
        print(title, sell(title))
    except SoldOut as err:
        print("sold out:", err)`,
      steps: [
        "Lines 4-9: each method returns `self.filter(...)`, a QuerySet of the same class, so the methods chain in any order.",
        "Line 15: `as_manager()` makes the QuerySet class the default manager, so a chain starts at `Book.objects`.",
        "Lines 24-32: the service holds the rule for a sale: lock the row, refuse a book that is hidden or out of stock with a domain error, and save, all in one transaction.",
        "Line 40: the chain is one query with both filters, so 1 of the 2 books is for sale.",
        "Lines 41-45: the shell calls the service as a view, a task or a test would: Dune sells its last copy and is then sold out, and Emma is hidden, so it is refused too.",
      ],
      output: `1 2
Dune 0
sold out: Dune
sold out: Emma`,
    },
    exercises: [
      'dj-custom-managers-gap-1',
      'dj-custom-managers-predict-1',
      'celery-drf-24',
      'dj-service-layer-predict-1',
      'dj-custom-managers-queryset-cloze-1',
    ],
  },
  {
    id: 'dj_celery/1',
    topicKeys: [Topic.DJ_CELERY],
    step: 1,
    title: 'Celery Tasks & Scheduling',
    idea: [
      lines(
        "Celery runs slow work outside the request, such as sending email or building a report.",
        "The view calls `task.delay(args)`, which puts a message on a broker such as Redis and returns at once, and a separate worker process started with `celery -A proj worker` takes the message and runs the function.",
        "So three things must be running: Django, the broker and at least one worker.",
      ),
      lines(
        "A task is a function in an app's `tasks.py` marked `@shared_task`.",
        "The project's `celery.py` creates the app, reads every `CELERY_*` setting with `config_from_object`, and `autodiscover_tasks()` finds each `tasks.py`.",
        "`apply_async(args=[...], countdown=60)` is `delay()` with options for timing and routing.",
      ),
      lines(
        "With `bind=True` the task receives itself as `self`, and `raise self.retry(exc=exc, countdown=60)` puts it back on the queue, up to `max_retries` times.",
        "Celery beat is one extra process that sends tasks on a schedule read from `beat_schedule`.",
        "`chain`, `group` and `chord` combine signatures, written `task.s(args)`, into sequences, parallel runs and fan-in callbacks.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `# proj/celery.py (imported from proj/__init__.py)
app = Celery("proj")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()                      # every installed app's tasks.py

# someapp/tasks.py
@shared_task(bind=True, max_retries=n)
def name(self, obj_id):                       # JSON values in: ids, not objects
    try:
        ...                                   # the slow work
    except SomeError as exc:
        raise self.retry(exc=exc, countdown=secs)

# a view: enqueue and return at once
res = name.delay(obj_id)                      # AsyncResult; keep res.id to poll
name.apply_async(args=[obj_id], countdown=secs, queue="q")

# beat: a schedule of dotted task paths
app.conf.beat_schedule = {"label": {"task": "someapp.tasks.name", "schedule": secs}}

# composition: signatures, not calls
chain(a.s(x), b.s())    # group(...) runs in parallel; chord(group, callback)`,
    },
    pitfall: lines(
      "`delay()` does not return the task's result: it returns an `AsyncResult` at once, and `ready()` stays False until a worker has finished.",
      "Calling `get()` on it inside a view blocks the request until the worker is done, which undoes the point of the queue.",
      "Return the task id instead and let the client poll, or have the task save its result somewhere the next request can read.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      runs: false,
      code: `# library/tasks.py, in a project with a broker, a result backend and one worker running
from celery import shared_task
from django.core.mail import send_mail

@shared_task(bind=True, max_retries=5)
def remind_due(self, member_email, title):
    try:
        send_mail("Book due", f"{title} is due back tomorrow.", None, [member_email])
    except OSError as err:
        raise self.retry(exc=err, countdown=120)
    return f"reminded {member_email}"

# python manage.py shell
from library.tasks import remind_due

job = remind_due.delay("ana@example.com", "Dune")
print(type(job).__name__, job.ready())
print(job.get(timeout=30))
print(job.status, job.ready())`,
      steps: [
        "Lines 5-6: `@shared_task(bind=True, max_retries=5)` makes the function a task that receives itself as `self`, and its arguments are plain strings that travel through the broker as JSON.",
        "Lines 7-10: a mail server that cannot be reached raises `OSError`, and `raise self.retry(...)` puts the task back on the queue to run again in 120 seconds, at most 5 times.",
        "Lines 16-17: `delay()` only sends a message, so it returns an `AsyncResult` before the worker has even picked the task up, and `ready()` is False.",
        "Line 18: `get()` waits for the worker and returns the task's return value, read from the result backend; the shell can wait, while a view should not.",
        "Line 19: once the task has finished, its status is `SUCCESS` and `ready()` is True.",
      ],
      output: `AsyncResult False
reminded ana@example.com
SUCCESS True`,
    },
    exercises: [
      'dj-celery-gap-2',
      'dj-celery-predict-1',
      'dj-celery-parsons-1',
      'dj-celery-cloze-1',
      'celery-drf-1',
    ],
  },
  {
    id: 'dj_redis/1',
    topicKeys: [Topic.DJ_REDIS],
    step: 1,
    title: 'Redis (Caching, Queues, Sessions)',
    idea: [
      lines(
        "Redis is a data store that keeps its keys and values in memory, so a read or a write takes well under a millisecond.",
        "A key can be given a timeout, after which Redis removes it.",
        "In a Django stack one Redis server usually plays three parts: the cache, the Celery broker and the session store.",
      ),
      lines(
        "As the cache, `CACHES` names the `RedisCache` backend and a `redis://host:6379/1` URL, and code talks to it through `django.core.cache.cache`.",
        "`set(key, value, timeout=secs)` stores, `get(key, default)` reads, `add()` writes only when the key is missing, `incr()` adds 1 inside Redis itself, and `delete()` removes.",
        "As the broker, `CELERY_BROKER_URL` points at the same server, and `SESSION_ENGINE = \"django.contrib.sessions.backends.cache\"` keeps sessions there too.",
      ),
      lines(
        "Values are not only strings: lists serve as queues and feeds, sets hold unique members, sorted sets rank members by score for leaderboards, and hashes hold an object's fields.",
        "Pub/sub passes messages between services as they happen.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `# settings.py: one server, a database number per role
CACHES = {"default": {
    "BACKEND": "django.core.cache.backends.redis.RedisCache",
    "LOCATION": "redis://host:6379/1",
}}
CELERY_BROKER_URL = "redis://host:6379/0"
SESSION_ENGINE = "django.contrib.sessions.backends.cache"

# code: read through the cache
from django.core.cache import cache

value = cache.get(key)                 # None on a miss or after expiry
if value is None:
    value = compute()                  # the database stays the source of truth
    cache.set(key, value, timeout=secs)
cache.add(key, value)                  # only if missing; True or False
cache.incr(key)                        # atomic counter
cache.delete(key)                      # after the data changes`,
    },
    pitfall: lines(
      "Redis is not the source of truth: a key expires at its timeout, and a full server evicts keys, so `get()` can return `None` for anything at any time.",
      "Read through the cache, computing the value from the database on a miss and setting it again, and delete the key when the data behind it changes.",
      "Test for a miss with `is None`, since a cached 0 or empty list is a real value.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      runs: false,
      code: `# shop/stock.py, with CACHES pointing at an empty Redis
from django.core.cache import cache

def count_books(genre):
    print("db query for", genre)
    return {"scifi": 12, "poetry": 3}[genre]

def genre_count(genre):
    key = f"genre-count:{genre}"
    total = cache.get(key)
    if total is None:
        total = count_books(genre)
        cache.set(key, total, timeout=600)
    return total

# python manage.py shell
from django.core.cache import cache
from shop.stock import genre_count

print(genre_count("scifi"))
print(genre_count("scifi"))
cache.delete("genre-count:scifi")
print(genre_count("scifi"), genre_count("poetry"))
print(cache.incr("genre-count:poetry"))`,
      steps: [
        "Lines 4-6: `count_books` stands in for a database count such as `Book.objects.filter(genre=genre).count()` and prints each time it runs.",
        "Lines 8-14: the helper reads the cache first and goes to the database only on a miss, then stores the answer for 600 seconds.",
        "Lines 20-21: the first call misses and queries, and the second finds 12 in Redis, so no query line is printed.",
        "Lines 22-23: deleting the key forces the next scifi call to query again, and both arguments are counted before `print` shows `12 3`.",
        "Line 24: `incr()` adds 1 to the cached poetry count inside Redis and returns the new value, 4.",
      ],
      output: `db query for scifi
12
12
db query for scifi
db query for poetry
12 3
4`,
    },
    exercises: [
      'celery-drf-9',
      'celery-drf-11',
      'dj-redis-gap-1',
      'dj-redis-predict-1',
    ],
  },
  {
    id: 'dj_factory_boy/1',
    topicKeys: [Topic.DJ_FACTORY_BOY],
    step: 1,
    title: 'Factory Boy & Advanced Testing',
    idea: [
      lines(
        "A test needs rows in the database, and writing every required field by hand in each test is long and breaks whenever a model gains a field.",
        "factory_boy keeps one factory per model with a default for every field, so a test names only the fields it cares about.",
        "When a model gains a required field, only its factory changes.",
      ),
      lines(
        "A factory subclasses `factory.django.DjangoModelFactory` and names its model in `class Meta`.",
        "`Sequence(lambda n: ...)` gives each object a unique value from a counter, `Faker(\"name\")` a realistic random one, and `SubFactory(OtherFactory)` builds the related object for a foreign key.",
        "Inside `class Params`, a `Trait` bundles several field values under one flag, so `UserFactory(admin=True)` turns them all on.",
      ),
      lines(
        "Calling the factory, `F()` or `F.create()`, saves the object, while `F.build()` makes it in memory without saving.",
        "`F.create_batch(n, field=value)` saves n objects with the same overrides.",
        "Any keyword argument replaces that field's default for this call only.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `# tests/factories.py
import factory

class ThingFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Thing                                   # the Django model

    code = factory.Sequence(lambda n: f"code-{n}")      # unique: n = 0, 1, 2 ...
    label = factory.Faker("word")                       # realistic random value
    owner = factory.SubFactory(OwnerFactory)            # creates the FK row too

    class Params:
        flag = factory.Trait(field_a=True, field_b=1)   # ThingFactory(flag=True)

# in a test
obj = ThingFactory()                        # saved, every default filled in
obj = ThingFactory(label="x", owner=o)      # override only what the test needs
tmp = ThingFactory.build()                  # not saved: tmp.pk is None
objs = ThingFactory.create_batch(n, field_a=True)`,
    },
    pitfall: lines(
      "A `SubFactory` builds a new related object every time, so `PostFactory.create_batch(3)` also saves three different authors.",
      "A test that expects the posts to share an author, or that counts users, then fails, or passes for the wrong reason.",
      "Create the shared object once and pass it in, as in `PostFactory.create_batch(3, author=author)`.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      runs: false,
      code: `# library/factories.py; Member(card_no, full_name), Loan(member, book_title, returned=False)
import factory
from library.models import Loan, Member

class MemberFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Member

    card_no = factory.Sequence(lambda n: 1000 + n)
    full_name = factory.Faker("name")

class LoanFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Loan

    member = factory.SubFactory(MemberFactory)
    book_title = factory.Faker("sentence", nb_words=3)

    class Params:
        closed = factory.Trait(returned=True)

# python manage.py shell on an empty database; a test runs the same calls
from django.db.models import Count
from library.factories import LoanFactory, MemberFactory
from library.models import Loan, Member

LoanFactory(closed=True)
ana = MemberFactory(full_name="Ana Silva")
LoanFactory.create_batch(2, member=ana)
spare = LoanFactory.build()
print(Member.objects.count(), Loan.objects.count(), spare.pk)
print(list(Member.objects.annotate(n=Count("loan")).order_by("card_no").values_list("card_no", "n")))
print(Loan.objects.filter(returned=False).count(), spare.member.card_no)`,
      steps: [
        "Lines 5-10: `MemberFactory` numbers cards from 1000 with a `Sequence` and fills a fake name with `Faker`, so every member is valid and unique without the caller giving either.",
        "Lines 16-20: each loan creates its own member through the `SubFactory`, and the `closed` trait sets `returned=True` when a call passes `closed=True`.",
        "Lines 27-29: the closed loan creates member 1000, Ana takes card 1001 (her name is overridden, her card is not), and `create_batch(2, member=ana)` saves two open loans that share her instead of making new members.",
        "Line 30: `build()` makes a loan and its member in memory only, so `spare.pk` is None and nothing is saved, though its member still used up card 1002.",
        "Lines 31-33: the database holds 2 members and 3 loans, card 1000 has one loan and Ana's card has two, and the 2 open loans are Ana's.",
      ],
      output: `2 3 None
[(1000, 1), (1001, 2)]
2 1002`,
    },
    exercises: [
      'py-dj-factory-what',
      'dj-factoryboy-predict-1',
      'dj-factoryboy-trait-cloze-1',
      'dj-factoryboy-batch-cloze-1',
      'py-dj-factory-userfactory',
    ],
  },
  {
    id: 'dj_cicd/1',
    topicKeys: [Topic.DJ_CICD],
    step: 1,
    title: 'CI/CD with GitHub Actions',
    idea: [
      lines(
        "Continuous integration (CI) runs the tests on every push and pull request, so a change that breaks something is caught before it is merged.",
        "Continuous delivery keeps every green build ready to release with one approval, and continuous deployment ships each green build of `main` with no approval at all.",
      ),
      lines(
        "GitHub Actions reads workflows from `.github/workflows/*.yml`.",
        "`on:` names the events that start a run, `jobs:` holds jobs that each run on a fresh machine named by `runs-on:`, and a job's `steps:` run in order.",
        "A step is either a ready-made action, such as `uses: actions/checkout@v4`, or a shell command after `run:`.",
        "A step that exits with a non-zero code, such as a failing test run, fails its job, and the steps after it are skipped.",
      ),
      lines(
        "`needs: test` makes a job wait for `test` and run only if it passed, and `if:` adds a condition such as the branch or the event.",
        "`strategy.matrix` runs a job once per value, and `cache: pip` on `setup-python` reuses downloaded packages between runs.",
        // eslint-disable-next-line no-template-curly-in-string
        "A secret saved in the repository settings reaches a step through `env:` as `${{ secrets.NAME }}`, and its value is masked as `***` in the log.",
        "`environment: production` ties a job to that environment's own secrets and required reviewers.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `# .github/workflows/ci.yml
name: CI
on: [push, pull_request]                  # events that start a run
jobs:
  test:
    runs-on: ubuntu-latest                # a fresh machine for each job
    strategy:
      matrix:
        python-version: ["3.x", "3.y"]    # one job per value
    steps:                                # in order; a non-zero exit stops the job
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: \${{ matrix.python-version }}
          cache: pip
      - run: command                      # install, lint, test
  deploy:
    needs: test                           # only after test has passed
    if: condition                         # e.g. a push to main
    environment: production               # its secrets and reviewers
    runs-on: ubuntu-latest
    steps:
      - run: command
        env:
          TOKEN: \${{ secrets.TOKEN }}     # masked as *** in the log`,
    },
    pitfall: lines(
      "Jobs run in parallel unless `needs:` says otherwise.",
      "A deploy job without `needs: test` starts at the same time as the tests and ships the build even when they then fail.",
      "Give every deploy job `needs:` on the jobs that check the code, and an `if:` for the branch it deploys from.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      runs: false,
      code: `# .github/workflows/checks.yml; this run is a push to main, echo steps stand in for commands
on:
  push:
    branches: [main]
  pull_request:
jobs:
  checks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.13"
          cache: pip
      - run: echo "18 tests passed"
  release:
    needs: checks
    if: github.event_name == 'push'
    environment: live
    runs-on: ubuntu-latest
    steps:
      - run: echo "releasing with $SHIP_KEY"
        env:
          SHIP_KEY: \${{ secrets.SHIP_KEY }}`,
      steps: [
        "Lines 2-5: a run starts on a push to `main` and on every pull request.",
        lines(
          "Lines 7-15: `checks` checks out the code, installs Python 3.13 with pip downloads cached, and runs the suite, which the echo stands in for.",
          "In the real file that step is `python manage.py test`, and a failing suite exits non-zero and fails the job.",
        ),
        "Lines 16-19: `release` waits for `checks` to pass, runs only for a push, and uses the `live` environment, where `SHIP_KEY` is saved as a secret.",
        lines(
          "Lines 22-24: the secret reaches the command as an environment variable, and GitHub masks its value as `***` in the log.",
          "The real command would be a release script such as `./release.sh`.",
        ),
        "On a pull request, `release` is skipped by its `if:`, so only the first line would print.",
      ],
      output: `18 tests passed
releasing with ***`,
    },
    exercises: [
      'py-dj-cicd-what',
      'dj-cicd-predict-1',
      'py-dj-cicd-gha-tests',
      'py-dj-cicd-secrets',
      'py-dj-cicd-deploy-step',
    ],
  },
  {
    id: 'dj_nginx/1',
    topicKeys: [Topic.DJ_NGINX],
    step: 1,
    title: 'Nginx & Reverse Proxy',
    idea: [
      lines(
        "In production a request goes from the client to Nginx, then to Gunicorn, then to Django, and the response comes back the same way.",
        "Nginx does the work that needs no Python: it terminates HTTPS, redirects plain HTTP to HTTPS, and serves static and media files straight from disk.",
        "Everything else it passes to Gunicorn, whose few worker processes each run Django for one request at a time.",
        "Nginx also buffers slow clients, so a worker is free again as soon as Django has answered.",
      ),
      lines(
        "A `server` block answers for its `server_name` on the port it `listen`s on.",
        "Inside it, each `location` block handles the paths that start with its prefix, and the longest matching prefix wins.",
        "`return 301 https://$host$request_uri;` in the port 80 block sends every plain HTTP request to the same address over HTTPS.",
      ),
      lines(
        "`alias` swaps the matched prefix for a directory, while `root` adds the whole path, prefix included, to its directory.",
        "`proxy_pass http://name;` sends the request to an `upstream` block that names Gunicorn's socket or port.",
        "`proxy_set_header` passes on what Django would otherwise lose behind the proxy: the original `Host`, the client's address in `X-Forwarded-For`, and the scheme in `X-Forwarded-Proto`.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `upstream app_server {
    server unix:/run/gunicorn.sock;               # where Gunicorn listens
}

server {
    listen 80;
    server_name example.com;
    return 301 https://$host$request_uri;         # plain HTTP -> HTTPS
}

server {
    listen 443 ssl;
    server_name example.com;
    ssl_certificate     /path/fullchain.pem;
    ssl_certificate_key /path/privkey.pem;

    location /static/ {
        alias /path/to/collected/;                # /static/x -> /path/to/collected/x
    }
    location /media/ {
        root /path/to;                            # /media/x -> /path/to/media/x
    }
    location / {                                  # everything else goes to Django
        proxy_pass http://app_server;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}`,
    },
    pitfall: lines(
      "Writing `root` where `alias` is meant sends Nginx to the wrong directory, and every static file returns 404 although `collectstatic` put it in place.",
      "Under `location /static/`, `root /srv/app/collected;` looks for `/static/site.css` at `/srv/app/collected/static/site.css`.",
      "Use `alias` when the directory is not named like the URL prefix, and end both the location and the alias with `/`.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      runs: false,
      code: `# requests: http /cart/, then https /assets/app.js, /covers/42.jpg and /cart/
upstream bookshop_app {
    server 127.0.0.1:8000;
}
server {
    listen 80;
    server_name books.example.org;
    return 301 https://$host$request_uri;
}
server {
    listen 443 ssl;
    server_name books.example.org;
    location /assets/ {
        alias /var/www/bookshop/static/;
    }
    location /covers/ {
        root /var/www/bookshop;
    }
    location / {
        proxy_pass http://bookshop_app;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}`,
      steps: [
        "Lines 2-4: the `upstream` gives Gunicorn's address a name, `bookshop_app`, for `proxy_pass` to use.",
        "Lines 5-9: the plain HTTP request reaches the port 80 block, which answers 301 with the same host and path on `https://`, and the browser asks again there.",
        "Lines 13-15: `alias` swaps `/assets/` for the static directory, so `/assets/app.js` is read from `/var/www/bookshop/static/app.js` and Django never sees it.",
        "Lines 16-18: `root` keeps the prefix, so `/covers/42.jpg` is read from `/var/www/bookshop/covers/42.jpg`.",
        lines(
          "Lines 19-23: `/cart/` matches only `location /`, so it goes to Gunicorn with the original host and the scheme `https`.",
          "Django trusts that scheme once `SECURE_PROXY_SSL_HEADER = (\"HTTP_X_FORWARDED_PROTO\", \"https\")` is set, and `request.is_secure()` is then true.",
        ),
      ],
      output: `http /cart/ -> 301 to https://books.example.org/cart/
/assets/app.js -> file /var/www/bookshop/static/app.js
/covers/42.jpg -> file /var/www/bookshop/covers/42.jpg
/cart/ -> Gunicorn at 127.0.0.1:8000, Host books.example.org, X-Forwarded-Proto https`,
    },
    exercises: [
      'be-infra-nginx-3',
      'dj-nginx-predict-1',
      'dj-nginx-proxypass-cloze-1',
      'be-infra-nginx-1',
    ],
  },
  {
    id: 'dj_settings/1',
    topicKeys: [Topic.DJ_SETTINGS],
    step: 1,
    title: 'Django Settings & Environment',
    idea: [
      lines(
        "Settings that differ between machines, or must stay secret, come from the environment instead of the code: `SECRET_KEY`, `DEBUG`, `ALLOWED_HOSTS`, and database and API credentials.",
        "The code is committed, the `.env` file holding the real values is listed in `.gitignore`, and the server sets the same variables in its own configuration.",
        "A secret that was ever committed stays in the git history, so it has to be changed, not just deleted.",
      ),
      lines(
        "django-environ reads them: `environ.Env(DEBUG=(bool, False))` declares a variable's type and default, `environ.Env.read_env(path)` loads a `.env` file, and `env(\"NAME\")` returns the value cast to its type.",
        "`env.list(\"NAME\")` splits a comma-separated value, and `env.db(\"DATABASE_URL\")` turns a URL such as `postgres://user:pass@host:5432/db` into a `DATABASES` entry.",
        "A variable with no default that is not set raises `ImproperlyConfigured` at start-up, which is what you want for `SECRET_KEY`.",
      ),
      lines(
        "Split settings keep what every environment shares in `base.py`, and `development.py` and `production.py` start with `from .base import *` and change only what differs.",
        "`DJANGO_SETTINGS_MODULE` chooses the file.",
        "Production turns `DEBUG` off and the security settings on, such as `SECURE_SSL_REDIRECT`, `SESSION_COOKIE_SECURE`, `CSRF_COOKIE_SECURE` and `SECURE_HSTS_SECONDS`, and `python manage.py check --deploy` lists any that are missing.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `# settings/base.py
import environ
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent
env = environ.Env(DEBUG=(bool, False))            # NAME=(cast, default)
environ.Env.read_env(BASE_DIR / ".env")           # .env is in .gitignore

SECRET_KEY = env("SECRET_KEY")                    # no default: must be set
DEBUG = env("DEBUG")
ALLOWED_HOSTS = env.list("ALLOWED_HOSTS", default=[])
DATABASES = {"default": env.db("DATABASE_URL")}

# settings/production.py
from .base import *                               # then only what differs
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31536000

# DJANGO_SETTINGS_MODULE=project.settings.production picks the file`,
    },
    pitfall: lines(
      "Every environment variable is a string, so `DEBUG = os.environ.get(\"DEBUG\", False)` gives the string `\"False\"` on a server that sets it.",
      "Any non-empty string is true, so production runs with `DEBUG` on and shows tracebacks and settings to anyone who triggers an error.",
      "Declare a cast for every variable that is not text, as in `environ.Env(DEBUG=(bool, False))`, or read it with `env.bool(\"DEBUG\")`.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      runs: false,
      code: `# bookshop/settings/base.py run on its own; SECRET_KEY and CONN_MAX_AGE are not set
# .env beside it holds:
#   DEBUG=off
#   ALLOWED_HOSTS=books.example.org,www.books.example.org
#   DATABASE_URL=postgres://shop:s3cret@db.internal:5432/bookshop
import environ
from django.core.exceptions import ImproperlyConfigured

env = environ.Env(DEBUG=(bool, True), CONN_MAX_AGE=(int, 60))
environ.Env.read_env(".env")

DEBUG = env("DEBUG")
ALLOWED_HOSTS = env.list("ALLOWED_HOSTS")
DATABASES = {"default": env.db("DATABASE_URL")}
print(DEBUG, env("CONN_MAX_AGE"), ALLOWED_HOSTS[1])
db = DATABASES["default"]
print(db["ENGINE"])
print(db["HOST"], db["PORT"], db["NAME"])

try:
    SECRET_KEY = env("SECRET_KEY")
except ImproperlyConfigured as error:
    print("not started:", error)`,
      steps: [
        "Lines 9-10: `Env` declares `DEBUG` as a bool and `CONN_MAX_AGE` as an int, each with a default, and `read_env` loads the three lines of `.env` into the environment.",
        "Line 12: the text `off` is cast to `False`; without the cast, `DEBUG` would be the string `\"off\"`, which is true.",
        "Lines 13 and 15: `env.list` splits the hosts on the comma, and `CONN_MAX_AGE`, set nowhere, takes its default 60 as an int.",
        "Lines 14 and 16-18: `env.db` parses the URL into a `DATABASES` entry: the `postgres` scheme picks the PostgreSQL backend, and the host, port and database name come from the URL's parts.",
        lines(
          "Lines 20-23: `SECRET_KEY` has no default and is not set, so reading it raises `ImproperlyConfigured`.",
          "A real settings file leaves that error uncaught, so the server refuses to start instead of running without a key.",
        ),
      ],
      output: `False 60 www.books.example.org
django.db.backends.postgresql
db.internal 5432 bookshop
not started: Set the SECRET_KEY environment variable`,
    },
    exercises: [
      'be-infra-settings-2',
      'be-infra-settings-3',
      'dj-settings-predict-1',
      'dj-settings-cloze-1',
      'be-infra-settings-1',
    ],
  },
  {
    id: 'dj_file_uploads/1',
    topicKeys: [Topic.DJ_FILE_UPLOADS],
    step: 1,
    title: 'File Uploads & Storage',
    idea: [
      lines(
        "A `FileField` or `ImageField` keeps only the file's name in its database column, such as `avatars/2026/11/ana.png`, and hands the file itself to the storage backend.",
        "`upload_to` is the folder inside the storage: a string that may hold date codes such as `%Y/%m/`, or a function of the instance and the file name.",
        "`ImageField` also checks that the upload really is an image, which needs Pillow.",
      ),
      lines(
        "The default `FileSystemStorage` writes files under `MEDIA_ROOT`, a directory on disk, and `field.url` puts `MEDIA_URL`, a URL prefix such as `/media/`, in front of the stored name.",
        "`field.path` is the full path on disk.",
        "A file whose name is already taken gets a random suffix instead of overwriting the old one.",
      ),
      lines(
        "Uploads arrive in `request.FILES`, or in DRF's `request.data` with a multipart parser, and a serializer's `validate_<field>` method can refuse files that are too large or of the wrong type.",
        "In development, `static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)` in `urls.py` serves the files.",
        "In production Nginx serves `MEDIA_ROOT`, or django-storages keeps the files on S3, where every server can reach them, with no change to models or views.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `# settings.py
MEDIA_ROOT = BASE_DIR / "media"          # where files are written on disk
MEDIA_URL = "/media/"                    # the URL prefix they are served under
# S3 instead: STORAGES = {"default": {"BACKEND": "storages.backends.s3.S3Storage"}, ...}

# models.py
class Thing(models.Model):
    attachment = models.FileField(upload_to="folder/%Y/%m/")   # ImageField for images

# in code
thing.attachment.save("name.ext", content)   # writes the file and saves the row
thing.attachment.name                        # "folder/2026/11/name.ext", the stored value
thing.attachment.url                         # MEDIA_URL + name
thing.attachment.path                        # MEDIA_ROOT / name, local storage only

# urls.py, development only
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)`,
    },
    pitfall: lines(
      "`static()` in `urls.py` adds its pattern only while `DEBUG` is on, so after deploying with `DEBUG = False` every uploaded file returns 404.",
      "Serving them through Django would be the wrong fix anyway: each download holds a Gunicorn worker until the last byte is sent.",
      "Have Nginx serve `MEDIA_URL` from `MEDIA_ROOT` with an `alias`, or move the files to S3 with django-storages.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      runs: false,
      code: `# python manage.py shell with the default storage and no media saved yet
# settings.py: MEDIA_ROOT = "/srv/bookshop/media", MEDIA_URL = "/media/"
# shop/models.py:
#   def sample_path(book, filename):
#       return f"samples/{book.isbn}/{filename}"
#   class Book(models.Model):
#       isbn = models.CharField(max_length=13)
#       sample = models.FileField(upload_to=sample_path, blank=True)
from django.core.files.base import ContentFile
from shop.models import Book

book = Book.objects.create(isbn="9780141439518")
book.sample.save("chapter 1.pdf", ContentFile(b"%PDF-1.4"))
print(book.sample.name)
print(book.sample.url, book.sample.size)

again = Book.objects.create(isbn="9780141439518")
again.sample.save("chapter 1.pdf", ContentFile(b"%PDF-1.4"))
suffixed = again.sample.name.startswith("samples/9780141439518/chapter_1_")
print(again.sample.name == book.sample.name, suffixed)`,
      steps: [
        "Lines 4-8: `upload_to` is a function here, so each book's samples get their own folder named by its ISBN.",
        lines(
          "Line 13: `save()` writes the file to `/srv/bookshop/media/samples/9780141439518/` and saves the row.",
          "Django cleans the file name first, so the space becomes `_`.",
        ),
        "Lines 14-15: `.name` is what the column stores, `.url` puts `MEDIA_URL` in front of it, and `.size` is the file's 8 bytes.",
        "Lines 17-20: a second file with the same name does not overwrite the first, because the storage adds a random suffix such as `chapter_1_a1B2c3D.pdf`.",
        "In production Nginx serves `/media/` from `/srv/bookshop/media`, or S3 holds the files, and none of these lines change.",
      ],
      output: `samples/9780141439518/chapter_1.pdf
/media/samples/9780141439518/chapter_1.pdf 8
False True`,
    },
    exercises: [
      'be-infra-uploads-3',
      'dj-uploads-predict-1',
      'dj-uploads-basics-cloze-1',
      'be-infra-uploads-1',
    ],
  },
  {
    id: 'dj_postgres/1',
    topicKeys: [Topic.DJ_POSTGRES],
    step: 1,
    title: 'PostgreSQL Features',
    idea: [
      lines(
        "PostgreSQL is the database Django recommends for production: it serves many connections writing at once, and `django.contrib.postgres` adds what SQLite lacks, such as `ArrayField`, range fields and full-text search.",
        "A `models.JSONField` is stored as `jsonb`, binary JSON that can be indexed and queried.",
      ),
      lines(
        "JSON lookups chain keys with `__` as relations do: `filter(data__author=\"ada\")` compares a key, and `data__shelf__floor__gte=2` goes deeper and compares a number.",
        "`data__tags__contains=[\"py\"]` matches when the stored value holds that subset, and `data__has_key=\"isbn\"` when the key exists.",
        "`KeyTextTransform(\"key\", \"data\")` pulls a key out as text for `annotate()` and `order_by()`, and the field takes `default=dict`, the callable, never `{}`.",
      ),
      lines(
        "`Meta.indexes = [models.Index(fields=[\"a\", \"-b\"])]` adds a composite index for queries that filter on `a` and sort by `b` newest first, and a `GinIndex` speeds up `jsonb` lookups.",
        "Full-text search builds a `SearchVector` from text columns, weighted `A` to `D`, parses the user's words with `SearchQuery`, which matches word stems, and scores rows with `SearchRank`.",
        "`EXPLAIN ANALYZE` shows whether a query used an index or read the whole table.",
      ),
    ],
    form: {
      language: CodeLanguage.PYTHON,
      code: `from django.contrib.postgres.indexes import GinIndex
from django.contrib.postgres.search import SearchQuery, SearchRank, SearchVector
from django.db import models
from django.db.models.fields.json import KeyTextTransform

class Thing(models.Model):
    kind = models.CharField(max_length=20)
    created = models.DateTimeField(auto_now_add=True)
    body = models.TextField()
    data = models.JSONField(default=dict)                  # jsonb; default=dict, not {}

    class Meta:
        indexes = [
            models.Index(fields=["kind", "-created"]),      # filter on kind, newest first
            GinIndex(fields=["data"]),                      # fast jsonb lookups
        ]

Thing.objects.filter(data__key="v")                        # a key equals a value
Thing.objects.filter(data__outer__inner__gt=5)             # a nested key, compared
Thing.objects.filter(data__items__contains=["x"])          # the stored value holds this subset
Thing.objects.annotate(k=KeyTextTransform("key", "data")).order_by("k")

vector = SearchVector("body")
query = SearchQuery("words")
Thing.objects.annotate(search=vector, rank=SearchRank(vector, query)).filter(search=query).order_by("-rank")`,
    },
    pitfall: lines(
      "`jsonb` is for attributes that differ from row to row and are read with the row, such as a product's specifications.",
      "A value you filter, join or total on, such as a customer id or an order's lines, belongs in its own column or table, where a foreign key keeps it valid and a plain index serves it.",
      "In JSON, every query has to dig it out, and nothing stops a row from holding a typo or missing the key.",
    ),
    worked: {
      language: CodeLanguage.PYTHON,
      runs: false,
      code: `# python manage.py shell on PostgreSQL, no rows yet
# library/models.py: Book(title, blurb = TextField, details = JSONField(default=dict))
from django.contrib.postgres.search import SearchQuery, SearchRank, SearchVector
from django.db.models.fields.json import KeyTextTransform
from library.models import Book

Book.objects.create(title="River Songs", blurb="Poems of rivers and rain",
                    details={"lang": "en", "shelf": {"floor": 2}, "awards": ["Costa"]})
Book.objects.create(title="Night Trains", blurb="A thriller on a sleeper train",
                    details={"lang": "fr", "shelf": {"floor": 1}, "awards": []})
Book.objects.create(title="Rain Tales", blurb="Stories from a wet town",
                    details={"lang": "en", "shelf": {"floor": 1}})

books = Book.objects.all()
print(books.filter(details__lang="en").count(), books.get(details__shelf__floor__gte=2).title)
awarded = books.filter(details__has_key="awards").count()
print(awarded, books.filter(details__awards__contains=["Costa"]).count())
by_lang = books.annotate(lang=KeyTextTransform("lang", "details")).order_by("lang", "title")
print(list(by_lang.values_list("lang", "title")))

words = (SearchVector("title", weight="A", config="english")
         + SearchVector("blurb", weight="B", config="english"))
wanted = SearchQuery("rain", config="english")
found = books.annotate(doc=words, score=SearchRank(words, wanted)).filter(doc=wanted)
print([b.title for b in found.order_by("-score")])`,
      steps: [
        "Line 15: two books have `lang` set to `en`, and only River Songs has a `shelf` whose `floor` is at least 2, so `get()` finds exactly one row.",
        "Lines 16-17: two books have an `awards` key, though Night Trains' list is empty, and only River Songs' list contains `Costa`.",
        "Lines 18-19: `KeyTextTransform` pulls `lang` out as text, so the rows sort by language and then by title.",
        "Lines 21-24: the title is weighted `A` and the blurb `B`, and the query `rain` matches the word in Rain Tales' title and in River Songs' blurb, but not `train`.",
        "Line 25: the title match carries the higher weight, so Rain Tales ranks first.",
      ],
      output: `2 River Songs
2 1
[('en', 'Rain Tales'), ('en', 'River Songs'), ('fr', 'Night Trains')]
['Rain Tales', 'River Songs']`,
    },
    exercises: [
      'be-infra-postgres-2',
      'dj-postgres-predict-1',
      'dj-postgres-cloze-1',
      'dj-postgres-keytexttransform-cloze-1',
      'dj-postgres-fts-cloze-1',
    ],
  },
];
