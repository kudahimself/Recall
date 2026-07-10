/**
 * Topic.PY_MODULES — all question types for this topic.
 * Auto-consolidated by scripts/consolidate-by-topic.js from:
 *   pyModulesCloze.ts (10), pyModulesParsons.ts (10), pyModulesPredictOutput.ts (10), pythonAdvOopQuestions.ts (5), pythonEssentialsQuestions.ts (3)
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const py_modules_questions: Question[] = [
  {
      id: 'py-modules-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_MODULES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the dunder name and the special string used to guard top-level entrypoint code.',
      template: `if ___ == "___":
      main()`,
      blanks: ['__name__', '__main__'],
      solution: 'if __name__ == "__main__":\n    main()',
      explanation:
        '__name__ is the module\'s name attribute — set to "__main__" only when run directly. The double-underscore convention applies on both sides.',
      hints: ['Both have double underscores; one with "name", one with "main".'],
      tags: ['modules', '__name__', '__main__'],
      concepts: ['py-modules-imports'],
    },
  {
      id: 'py-modules-cloze-2',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_MODULES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the keyword that aliases an import.',
      template: `import numpy ___ np

print(np.array([1, 2, 3]))`,
      blanks: ['as'],
      solution: 'import numpy as np\n\nprint(np.array([1, 2, 3]))',
      explanation:
        '`import X as Y` binds the imported module under a new name. Same keyword works in `from X import Y as Z` and exception-handler `except E as e`.',
      hints: ['Two letters; same keyword used in except clauses.'],
      tags: ['modules', 'as'],
      concepts: ['py-modules-imports'],
    },
  {
      id: 'py-modules-cloze-3',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_MODULES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the keyword for selective import: bring only sqrt from math.',
      template: `___ math import sqrt

print(sqrt(16))`,
      blanks: ['from'],
      solution: 'from math import sqrt\n\nprint(sqrt(16))',
      explanation:
        '`from MODULE import NAME` brings just the listed name(s) into the local namespace. To bring everything, use `from MODULE import *` (discouraged).',
      hints: ['Four letters; same keyword as in raise X from e.'],
      tags: ['modules', 'from-import'],
      concepts: ['py-modules-imports'],
    },
  {
      id: 'py-modules-cloze-4',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_MODULES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the leading-dot syntax for a relative import from the same package.',
      template: `from ___helper import process`,
      blanks: ['.'],
      solution: 'from .helper import process',
      explanation:
        'A leading dot means "the same package as this module". Two dots mean "parent package". Without dots it\'s an absolute import (from sys.path).',
      hints: ['Single character; the same one used for attribute access.'],
      tags: ['modules', 'relative-import'],
      concepts: ['py-modules-imports'],
    },
  {
      id: 'py-modules-cloze-5',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_MODULES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the magic name that declares the public API for `from module import *`.',
      template: `___ = ["public_func"]

def public_func():
    pass

def _private():
    pass`,
      blanks: ['__all__'],
      solution:
        '__all__ = ["public_func"]\n\ndef public_func():\n    pass\n\ndef _private():\n    pass',
      explanation:
        '__all__ is a list of strings naming the symbols `import *` will export. Without it, * brings everything not prefixed with underscore. Convention more than enforcement — direct imports still work.',
      hints: ['Magic name with double underscores; the word means "everything".'],
      tags: ['modules', '__all__'],
      concepts: ['py-modules-imports'],
    },
  {
      id: 'py-modules-cloze-6',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_MODULES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the importlib function used to re-execute an already-loaded module.',
      template: `import importlib
import mymodule

importlib.___(mymodule)`,
      blanks: ['reload'],
      solution: 'import importlib\nimport mymodule\n\nimportlib.reload(mymodule)',
      explanation:
        'importlib.reload re-executes a module\'s code and updates its namespace. Takes the module OBJECT (not a string). Useful in REPLs/notebooks; rarely needed in production.',
      hints: ['Six letters; same as the verb meaning "load again".'],
      tags: ['modules', 'reload', 'importlib'],
      concepts: ['py-modules-imports'],
    },
  {
      id: 'py-modules-cloze-7',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_MODULES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the magic attribute that stores the source-file path of a module.',
      template: `import os
print(os.___)`,
      blanks: ['__file__'],
      solution: 'import os\nprint(os.__file__)',
      explanation:
        '__file__ is the source file path. Useful for resolving paths relative to a module: `os.path.dirname(__file__)`. Built-in modules without source files don\'t have it (or have None).',
      hints: ['Magic name; "file" with double underscores.'],
      tags: ['modules', '__file__'],
      concepts: ['py-modules-imports'],
    },
  {
      id: 'py-modules-cloze-8',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_MODULES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the sys attribute that lists the directories Python searches for imports.',
      template: `import sys
sys.___.append("/usr/local/mylibs")`,
      blanks: ['path'],
      solution: 'import sys\nsys.path.append("/usr/local/mylibs")',
      explanation:
        'sys.path is a list of directory paths. .append adds to the end (lowest priority); .insert(0, ...) adds to the front (highest priority). Modifying sys.path is generally a smell — prefer proper packaging.',
      hints: ['Same name as the file-system concept.'],
      tags: ['modules', 'sys.path'],
      concepts: ['py-modules-imports'],
    },
  {
      id: 'py-modules-cloze-9',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_MODULES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the file name (with extension) that marks a directory as a Python package.',
      template: `mypkg/
      ___
      helpers.py`,
      blanks: ['__init__.py'],
      solution: 'mypkg/\n    __init__.py\n    helpers.py',
      explanation:
        '__init__.py marks a regular package. Its code runs once when the package is first imported. Empty file is fine. Without it (3.3+) the directory becomes an implicit namespace package — usually you want the explicit form.',
      hints: ['Magic dunder name + .py extension.'],
      tags: ['modules', '__init__.py', 'package'],
      concepts: ['py-modules-imports'],
    },
  {
      id: 'py-modules-cloze-10',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_MODULES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the attribute that holds the cache of already-imported modules.',
      template: `import sys
print("os" in sys.___)`,
      blanks: ['modules'],
      solution: 'import sys\nprint("os" in sys.modules)',
      explanation:
        'sys.modules is a dict mapping module names to module objects. Python checks this BEFORE re-reading source files — that\'s why repeated imports don\'t re-execute. Manually deleting an entry forces a fresh import next time.',
      hints: ['Plural; same word as the topic of this section.'],
      tags: ['modules', 'sys.modules'],
      concepts: ['py-modules-imports'],
    },
  {
      id: 'py-modules-parsons-1',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_MODULES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Guard the entrypoint code so it only runs when the module is executed directly, not when imported.',
      correctOrder: [
        'def main():',
        '    print("running")',
        '',
        'if __name__ == "__main__":',
        '    main()',
      ],
      distractorLines: [
        'if __name__ == "main":',
        'if __name__ is "__main__":',
      ],
      solution:
        'def main():\n    print("running")\n\nif __name__ == "__main__":\n    main()',
      explanation:
        '__name__ is "__main__" when a module is run directly, otherwise it\'s the module\'s own name. The guard prevents top-level code from executing on import. Use == not `is` for string comparison; "main" without underscores is wrong.',
      hints: ['Compare __name__ to the literal "__main__" with double underscores.'],
      tags: ['modules', '__name__', 'main-guard'],
      concepts: ['py-modules-imports'],
    },
  {
      id: 'py-modules-parsons-2',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_MODULES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Import only the sqrt function from math, then use it to compute sqrt(16).',
      correctOrder: [
        'from math import sqrt',
        '',
        'print(sqrt(16))',
      ],
      distractorLines: [
        'import math.sqrt',
        'from math import *',
      ],
      solution: 'from math import sqrt\n\nprint(sqrt(16))',
      explanation:
        '`from module import name` brings just that name into the current namespace. `import math.sqrt` is invalid — submodules can be imported that way, but functions cannot. `from math import *` works but pollutes the namespace and is discouraged.',
      hints: ['from X import name; not import X.name for functions.'],
      tags: ['modules', 'from-import'],
      concepts: ['py-modules-imports'],
    },
  {
      id: 'py-modules-parsons-3',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_MODULES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Import the `numpy` module under its conventional short alias, then use that alias to create an array from the list `[1, 2, 3]`, assigning it to `arr`.',
      correctOrder: [
        'import numpy as np',
        '',
        'arr = np.array([1, 2, 3])',
      ],
      distractorLines: [
        'import numpy alias np',
        'from numpy as np',
      ],
      solution: 'import numpy as np\n\narr = np.array([1, 2, 3])',
      explanation:
        '`import X as Y` is the standard alias syntax. The pattern `import numpy as np` and `import pandas as pd` is so widespread it\'s essentially convention. `from X as Y` is invalid (you need `from X import Y as Z`).',
      hints: ['import X as Y is the alias form.'],
      tags: ['modules', 'alias'],
      concepts: ['py-modules-imports'],
    },
  {
      id: 'py-modules-parsons-4',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_MODULES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Use a relative import to bring helper from the same package (one level up).',
      correctOrder: [
        'from .helper import process',
        '',
        'process()',
      ],
      distractorLines: [
        'from helper import process',
        'from ..helper import process',
        'import .helper',
      ],
      solution: 'from .helper import process\n\nprocess()',
      explanation:
        'A leading dot means "the same package". Two dots = parent package. Plain `from helper import` would be an absolute import and fail if helper isn\'t on sys.path. `import .helper` (relative) is invalid syntax.',
      hints: ['One dot = same package; two dots = parent.'],
      tags: ['modules', 'relative-import'],
      concepts: ['py-modules-imports'],
    },
  {
      id: 'py-modules-parsons-5',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_MODULES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Use __all__ to declare the public API of a module so `from mymod import *` only exports those names.',
      correctOrder: [
        '__all__ = ["public_func"]',
        '',
        'def public_func():',
        '    pass',
        '',
        'def _private():',
        '    pass',
      ],
      distractorLines: [
        '__all__ = "public_func"',
        'public = ["public_func"]',
      ],
      solution:
        '__all__ = ["public_func"]\n\ndef public_func():\n    pass\n\ndef _private():\n    pass',
      explanation:
        '__all__ is a list of strings naming the symbols exported by `from module import *`. Without it, `import *` brings everything not starting with underscore. Must be a list/tuple of strings — a single string is treated as a tuple of characters.',
      hints: ['__all__ is a list of name strings.'],
      tags: ['modules', '__all__'],
      concepts: ['py-modules-imports'],
    },
  {
      id: 'py-modules-parsons-6',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_MODULES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Import a module, then reload it after editing using importlib.reload.',
      correctOrder: [
        'import importlib',
        'import mymodule',
        '',
        'importlib.reload(mymodule)',
      ],
      distractorLines: [
        'mymodule.reload()',
        'importlib.reload("mymodule")',
      ],
      solution:
        'import importlib\nimport mymodule\n\nimportlib.reload(mymodule)',
      explanation:
        'importlib.reload takes the MODULE OBJECT, not a string name. It re-executes the module\'s top-level code and updates its namespace in place. Useful in REPLs/notebooks; not common in production code.',
      hints: ['Pass the module object, not a string.'],
      tags: ['modules', 'reload', 'importlib'],
      concepts: ['py-modules-imports'],
    },
  {
      id: 'py-modules-parsons-7',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_MODULES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Inspect the file location of an imported module via its __file__ attribute.',
      correctOrder: [
        'import os',
        '',
        'print(os.__file__)',
      ],
      distractorLines: [
        'print(os.path)',
        'print(os.__path__)',
      ],
      solution: 'import os\n\nprint(os.__file__)',
      explanation:
        '__file__ is the path to the module\'s source file. __path__ exists only on packages (directories) and is a list. os.path is the path-manipulation submodule, not the file path of os itself.',
      hints: ['__file__ is the source path of any importable module.'],
      tags: ['modules', '__file__'],
      concepts: ['py-modules-imports'],
    },
  {
      id: 'py-modules-parsons-8',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_MODULES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Add a directory to sys.path so a module in it can be imported.',
      correctOrder: [
        'import sys',
        'sys.path.append("/usr/local/mylibs")',
        'import mylib',
      ],
      distractorLines: [
        'sys.path = "/usr/local/mylibs"',
        'sys.path += "/usr/local/mylibs"',
      ],
      solution:
        'import sys\nsys.path.append("/usr/local/mylibs")\nimport mylib',
      explanation:
        'sys.path is a LIST of strings. Use .append (or .insert(0, ...) for higher precedence). Direct assignment replaces the list entirely; += a string would append each character (sys.path is iterable mutation friendly). Generally avoid sys.path hacks — prefer proper packaging.',
      hints: ['sys.path is a list; use .append.'],
      tags: ['modules', 'sys.path'],
      concepts: ['py-modules-imports'],
    },
  {
      id: 'py-modules-parsons-9',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_MODULES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Import a deeply nested submodule using dotted path.',
      correctOrder: [
        'from urllib.parse import urlparse',
        '',
        'result = urlparse("https://example.com/a/b")',
        'print(result.path)',
      ],
      distractorLines: [
        'import urllib.parse.urlparse',
        'from urllib import parse.urlparse',
      ],
      solution:
        'from urllib.parse import urlparse\n\nresult = urlparse("https://example.com/a/b")\nprint(result.path)',
      explanation:
        'For nested submodules, use `from package.subpackage import name`. You can\'t put the function name in `import urllib.parse.urlparse` — submodule paths can be imported this way, but functions cannot.',
      hints: ['from package.subpackage import function.'],
      tags: ['modules', 'submodule'],
      concepts: ['py-modules-imports'],
    },
  {
      id: 'py-modules-parsons-10',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_MODULES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Defer an expensive import to inside a function so it only loads on demand.',
      correctOrder: [
        'def parse_csv(path):',
        '    import pandas as pd',
        '    return pd.read_csv(path)',
      ],
      distractorLines: [
        'import pandas as pd',
        'def parse_csv(path):',
      ],
      solution:
        'def parse_csv(path):\n    import pandas as pd\n    return pd.read_csv(path)',
      explanation:
        'Imports inside a function are evaluated lazily — only the first call pays the import cost. Useful for heavy optional deps (pandas, tensorflow) where users who don\'t call this function shouldn\'t bear startup overhead. Top-level imports run at module load.',
      hints: ['Inner import = lazy load on first call.'],
      tags: ['modules', 'lazy-import'],
      concepts: ['py-modules-imports'],
    },
  {
      id: 'py-modules-predict-1',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_MODULES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Assume this code is in a file run directly with `python script.py`. What does it print?',
      code: `def main():
    print("running main")

print(__name__)
if __name__ == "__main__":
    main()`,
      expectedOutput: `__main__
running main`,
      explanation:
        'When a Python file is run directly, __name__ is set to "__main__". So the print outputs "__main__", the guard passes, and main() runs. If imported instead, __name__ would be the module name and main() would be skipped.',
      hints: ['Direct run sets __name__ to a special string.'],
      tags: ['modules', '__name__'],
      concepts: ['py-modules-imports'],
    },
  {
      id: 'py-modules-predict-2',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_MODULES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Assume mymodule.py contains `print("loaded"); x = 42`. What does this code print?',
      code: `import mymodule
import mymodule
print(mymodule.x)`,
      expectedOutput: `loaded
42`,
      explanation:
        'Modules are cached in sys.modules after first import. The second `import mymodule` is a no-op — Python just gives back the cached object. So "loaded" prints only once. importlib.reload would force re-execution.',
      hints: ['Modules are cached; re-importing is a no-op.'],
      tags: ['modules', 'sys.modules', 'caching'],
      concepts: ['py-modules-imports'],
    },
  {
      id: 'py-modules-predict-3',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_MODULES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `import math
print(type(math).__name__)`,
      expectedOutput: `module`,
      explanation:
        'Imported modules are first-class objects of type `module`. You can pass them around, store them in dicts, etc. type(math).__name__ gives the class name.',
      hints: ['Modules are objects with their own type.'],
      tags: ['modules', 'type'],
      concepts: ['py-modules-imports'],
    },
  {
      id: 'py-modules-predict-4',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_MODULES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Assume mypkg/__init__.py contains `print("init"); from .sub import f`. What does this code print?',
      code: `import mypkg
mypkg.f()`,
      expectedOutput: `init`,
      explanation:
        'A package\'s __init__.py runs ONCE when the package is first imported. The init imports f from .sub, making mypkg.f accessible. The print "init" runs once at import time. Calling mypkg.f() doesn\'t print anything additional unless f itself prints — and we don\'t know what f does.',
      hints: ['__init__.py runs at first package import.'],
      tags: ['modules', '__init__.py', 'package'],
      concepts: ['py-modules-imports'],
    },
  {
      id: 'py-modules-predict-5',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_MODULES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `from math import pi
import math
print(pi == math.pi)`,
      expectedOutput: `True`,
      explanation:
        '`from math import pi` binds the local name `pi` to the SAME float object as math.pi. Both names reference the same value. Python doesn\'t copy on import — it just adds a name to the namespace.',
      hints: ['from-import creates a name binding, not a copy.'],
      tags: ['modules', 'from-import'],
      concepts: ['py-modules-imports'],
    },
  {
      id: 'py-modules-predict-6',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_MODULES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Assume mymod.py contains `__all__ = ["foo"]`, defines `foo` and `bar` at module level. What does this code print?',
      code: `from mymod import *
print("foo" in dir())
print("bar" in dir())`,
      expectedOutput: `True
False`,
      explanation:
        '__all__ controls what `import *` brings in. Only "foo" is listed, so only foo is exported. bar is NOT brought into the local namespace via *. Without __all__, both would be (anything not starting with _).',
      hints: ['__all__ filters * imports to listed names only.'],
      tags: ['modules', '__all__'],
      concepts: ['py-modules-imports'],
    },
  {
      id: 'py-modules-predict-7',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_MODULES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `import sys
print("os" in sys.modules)
import os
print("os" in sys.modules)`,
      expectedOutput: `False
True`,
      explanation:
        'sys.modules is the cache of imported modules. Before `import os` runs, "os" is not in the cache (assuming a fresh interpreter where os hasn\'t been auto-imported). After import, it\'s cached. Re-importing checks this cache before reading the file.',
      hints: ['sys.modules is the cache of already-imported modules.'],
      tags: ['modules', 'sys.modules'],
      concepts: ['py-modules-imports'],
    },
  {
      id: 'py-modules-predict-8',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_MODULES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Assume mymod.py contains `x = 10; def get_x(): return x`. What does this code print?',
      code: `import mymod
mymod.x = 99
print(mymod.get_x())`,
      expectedOutput: `99`,
      explanation:
        'Module-level variables are looked up at CALL time via the module\'s globals dict. Replacing mymod.x mutates the module\'s globals — get_x() reads the NEW value. Modules don\'t copy state; functions reference live globals.',
      hints: ['Module globals are read at call time, not definition time.'],
      tags: ['modules', 'globals'],
      concepts: ['py-modules-imports'],
    },
  {
      id: 'py-modules-predict-9',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_MODULES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `import math as m
import math as m2
print(m is m2)`,
      expectedOutput: `True`,
      explanation:
        'The alias just creates a different LOCAL NAME for the same module object. Both m and m2 reference the same cached math module — `is` returns True.',
      hints: ['Aliases are different names for the same cached module.'],
      tags: ['modules', 'alias'],
      concepts: ['py-modules-imports'],
    },
  {
      id: 'py-modules-predict-10',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_MODULES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `import os.path
print(hasattr(os, "path"))
print(hasattr(os, "getcwd"))`,
      expectedOutput: `True
True`,
      explanation:
        'Importing a submodule (`os.path`) makes the parent (os) accessible too — Python adds os to the local namespace AND the submodule attribute. So both `os.path` and `os.getcwd` work, even though we only explicitly imported os.path.',
      hints: ['Importing a submodule binds the parent package too.'],
      tags: ['modules', 'submodule'],
      concepts: ['py-modules-imports'],
    },
  {
      id: 'pcpp-pickle-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_MODULES,
      course: Course.BACKEND,
      question: 'What does Python\'s `pickle` module do?',
      options: [
        { id: 'a', text: 'It converts Python objects to JSON format for web transmission', isCorrect: false },
        { id: 'b', text: 'It serialises Python objects to a byte stream and deserialises them back — preserving their full structure', isCorrect: true },
        { id: 'c', text: 'It compresses files to save disk space', isCorrect: false },
        { id: 'd', text: 'It stores database connection objects across sessions', isCorrect: false },
      ],
      explanation: '`pickle` serialises (pickles) Python objects to a binary byte stream, which can be saved to a file or sent over a network, then deserialised (unpickled) back to the original object. Unlike JSON, pickle supports Python-specific types (sets, tuples, custom classes). Warning: never unpickle data from untrusted sources — it can execute arbitrary code.',
      hints: [
        '`pickle.dumps()` → bytes; `pickle.loads()` → object',
        '`pickle.dump(obj, file)` → save; `pickle.load(file)` → load',
      ],
      tags: ['pickle', 'serialisation', 'persistence', 'modules'],
      concepts: ['py-modules-imports'],
    },
  {
      id: 'pcpp-pickle-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_MODULES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Use `pickle` to serialise a Python dictionary to bytes, then deserialise it back and verify it\'s identical to the original. Use `pickle.dumps()` and `pickle.loads()` (no file needed).',
      starterCode: `# Import pickle
# Build data = {"name": "Alice", "scores": [95, 87, 92], "active": True}


# Serialise with pickle.dumps to bytes, then pickle.loads back to an object
# Print the restored object, then print whether it equals the original
`,
      testCases: [
        { input: '', expectedOutput: "{'name': 'Alice', 'scores': [95, 87, 92], 'active': True}\nTrue", description: 'Should restore identical object' },
      ],
      solution: `import pickle

data = {
    "name": "Alice",
    "scores": [95, 87, 92],
    "active": True,
}

serialised = pickle.dumps(data)
restored = pickle.loads(serialised)

print(restored)
print(restored == data)`,
      explanation: '`pickle.dumps(obj)` serialises to bytes. `pickle.loads(bytes)` deserialises back. The restored object is equal to the original but is a separate copy in memory. For files, use `pickle.dump(obj, file)` and `pickle.load(file)` with binary mode (`"wb"` / `"rb"`).',
      hints: [
        '`pickle.dumps()` (plural s) → bytes; `pickle.loads()` → object',
        'For files use `pickle.dump()` / `pickle.load()` with `"wb"` / `"rb"` mode',
      ],
      tags: ['pickle', 'serialisation', 'dumps', 'loads', 'persistence'],
      concepts: ['py-pickle-serialization'],
    },
  {
      id: 'pcpp-pickle-3',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_MODULES,
      course: Course.BACKEND,
      question: 'What is a key security concern with `pickle`, and what is a safer alternative for data exchange?',
      options: [
        { id: 'a', text: 'Pickle files are too large; use compression instead', isCorrect: false },
        { id: 'b', text: 'Unpickling untrusted data can execute arbitrary code; JSON is safer for data exchange', isCorrect: true },
        { id: 'c', text: 'Pickle cannot handle nested objects; use shelve instead', isCorrect: false },
        { id: 'd', text: 'Pickle is too slow for large objects; use CSV instead', isCorrect: false },
      ],
      explanation: 'Pickle\'s main security risk: a malicious pickle payload can execute arbitrary Python code when unpickled. Never unpickle data received from untrusted sources (network, user uploads). For cross-language or cross-platform data exchange, use JSON, which only supports safe basic types. Use pickle only for internal Python-to-Python persistence with trusted data.',
      hints: [
        'Never `pickle.load()` data from unknown sources',
        'JSON = human-readable and safe; Pickle = Python-only and potentially dangerous',
      ],
      tags: ['pickle', 'security', 'JSON', 'serialisation', 'trust'],
      concepts: ['py-security-primitives', 'py-json-serialization'],
    },
  {
      id: 'pcpp-shelve-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_MODULES,
      course: Course.BACKEND,
      question: 'How does the `shelve` module differ from `pickle`?',
      options: [
        { id: 'a', text: 'Shelve uses JSON; pickle uses binary', isCorrect: false },
        { id: 'b', text: 'Shelve provides a persistent dictionary-like interface backed by pickle; pickle just serialises to bytes/files', isCorrect: true },
        { id: 'c', text: 'Shelve is faster than pickle for large objects', isCorrect: false },
        { id: 'd', text: 'Shelve works for strings only; pickle works for all types', isCorrect: false },
      ],
      explanation: '`shelve` builds on pickle to provide a persistent, dictionary-like store. You access values by string keys (`shelf["key"] = value`) and they are automatically pickled and stored in a database file. When you reopen the shelf later, the data is still there. It\'s like a persistent Python dict.',
      hints: [
        'Think of shelve as a persistent dict backed by pickle',
        'Use `with shelve.open("filename") as shelf:` to open/close safely',
      ],
      tags: ['shelve', 'pickle', 'persistence', 'modules', 'database'],
      concepts: ['py-modules-imports'],
    },
  {
      id: 'pcpp-shelve-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_MODULES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Open a shelf named `"user_data"` via `shelve.open()` as a context manager and store `{"name": "Alice", "score": 95}` under the key `"user_1"`. Then open the shelf again (a second `with` block, simulating a later session), retrieve the profile under `"user_1"`, and print `profile["name"]` and `profile["score"]`.',
      starterCode: `# Open shelve "user_data" with a with-block and store the user_1 profile


# Reopen the shelve in a new with-block, read user_1, and print name then score
`,
      testCases: [
        { input: '', expectedOutput: 'Alice\n95', description: 'Should retrieve persisted data' },
      ],
      solution: `import shelve

with shelve.open("user_data") as shelf:
    shelf["user_1"] = {"name": "Alice", "score": 95}

with shelve.open("user_data") as shelf:
    profile = shelf["user_1"]
    print(profile["name"])
    print(profile["score"])`,
      explanation: 'The first `with` block writes to the shelf. The second `with` block reopens it and reads the data back — simulating two separate program runs. The data persists between them. `shelve` automatically handles pickling/unpickling. Keys must be strings; values can be any picklable Python object.',
      hints: [
        'Keys are strings; values are any picklable objects',
        'Use `with shelve.open(filename) as shelf:` for automatic closing',
      ],
      tags: ['shelve', 'persistence', 'context-manager', 'with', 'pickle'],
      concepts: ['py-context-manager-protocol'],
    },
  {
      id: 'pe1-modules-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_MODULES,
      course: Course.BACKEND,
      question: 'What is the difference between `import math` and `from math import sqrt`?',
      options: [
        { id: 'a', text: 'They are identical — both load the entire math module', isCorrect: false },
        { id: 'b', text: '`import math` loads the whole module (access with `math.sqrt`); `from math import sqrt` imports only `sqrt` (access as just `sqrt`)', isCorrect: true },
        { id: 'c', text: '`from math import sqrt` is slower', isCorrect: false },
        { id: 'd', text: '`import math` only works in Python 2', isCorrect: false },
      ],
      explanation: 'With `import math`, you access functions as `math.sqrt(16)`. With `from math import sqrt`, you call it directly as `sqrt(16)`. You can also do `from math import *` to import everything (but this is discouraged as it pollutes the namespace). Use `import module` when you use many things from it; `from module import name` for one or two specific items.',
      hints: [
        '`import math` → `math.sqrt()`, `from math import sqrt` → `sqrt()`',
        'The difference is in how you call the imported name',
      ],
      tags: ['modules', 'import', 'from-import', 'basics'],
      concepts: ['py-modules-imports'],
    },
  {
      id: 'pe1-modules-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_MODULES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Import the `math` module and use it to: (1) print the square root of 144, (2) print π (pi) rounded to 4 decimal places, (3) print the ceiling of 4.3.',
      starterCode: `import math

# 1. Print the square root of 144

# 2. Print pi rounded to 4 decimal places

# 3. Print the ceiling of 4.3
`,
      testCases: [
        {
          input: '',
          expectedOutput: '12.0\n3.1416\n5',
          description: 'Should print 12.0, pi to 4 places, and ceiling of 4.3',
        },
      ],
      solution: `import math

print(math.sqrt(144))
print(round(math.pi, 4))
print(math.ceil(4.3))`,
      explanation: '`math.sqrt(144)` returns `12.0` (a float). `math.pi` is the constant π ≈ 3.14159... and `round(value, decimals)` rounds to 4 places. `math.ceil(4.3)` rounds up to 5. Other useful `math` functions: `math.floor()`, `math.abs()`, `math.pow()`, `math.log()`.',
      hints: [
        'Use `math.sqrt()`, `math.pi`, and `math.ceil()`',
        'Use `round(math.pi, 4)` to round to 4 decimal places',
      ],
      tags: ['math', 'modules', 'import', 'sqrt', 'pi', 'ceil'],
      concepts: ['py-modules-imports'],
    },
  {
      id: 'pe1-modules-3',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_MODULES,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Use the `random` module to: (1) print a random integer between 1 and 10, (2) pick and print a random item from the list `["rock", "paper", "scissors"]`. Since random output varies, just make sure your code runs without errors — we\'ll check for the import and function usage.',
      starterCode: `# Import random; declare options as in the prompt
# Print a random int between 1 and 10, then print a random pick from options
`,
      testCases: [
        {
          input: '',
          expectedOutput: 'valid_random_int\nvalid_choice',
          description: 'Should use random.randint and random.choice without errors',
        },
      ],
      solution: `import random

options = ["rock", "paper", "scissors"]

print(random.randint(1, 10))
print(random.choice(options))`,
      explanation: '`random.randint(a, b)` returns a random integer between a and b **inclusive** (both ends included). `random.choice(sequence)` returns a random element from a non-empty sequence. Other useful functions: `random.random()` (float 0-1), `random.shuffle(list)` (shuffle in place), `random.sample(list, k)` (k unique random elements).',
      hints: [
        'Use `random.randint(1, 10)` for a random integer',
        'Use `random.choice(options)` for a random list item',
      ],
      tags: ['random', 'modules', 'randint', 'choice', 'basics'],
      concepts: ['py-modules-imports'],
    },
];
