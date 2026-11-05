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
];
