/**
 * Topic.PY_REGEX — all question types for this topic.
 * Auto-consolidated by scripts/consolidate-by-topic.js from:
 *   pyRegexCloze.ts (10), pyRegexParsons.ts (10), pyRegexPredictOutput.ts (10), pythonAdvancedQuestions.ts (2), pythonBatchAExpansionQuestions.ts (11), pythonGapFillQuestions.ts (2)
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const py_regex_questions: Question[] = [
  {
      id: 'py-regex-cloze-1',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the re function that scans the whole string for the first match.',
      template: `import re

m = re.___(r"\\d+", "year 2024")
print(m.group())`,
      blanks: ['search'],
      solution: 'import re\n\nm = re.search(r"\\d+", "year 2024")\nprint(m.group())',
      explanation:
        're.search scans the whole string for a match anywhere. re.match would fail here because the string doesn\'t start with digits.',
      hints: ['Six-letter verb: scans for a match anywhere.'],
      tags: ['regex', 'search'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-cloze-2',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the re function that returns ALL non-overlapping matches as a list.',
      template: `import re

words = re.___(r"\\w+", "hello world")
print(words)`,
      blanks: ['findall'],
      solution: 'import re\n\nwords = re.findall(r"\\w+", "hello world")\nprint(words)',
      explanation:
        'findall returns a list of all matches (strings if 0/1 group, tuples if 2+ groups). Different from finditer which yields Match objects.',
      hints: ['"find" + "all".'],
      tags: ['regex', 'findall'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-cloze-3',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the re function that replaces all matches with a string.',
      template: `import re

masked = re.___(r"\\d", "#", "code 12 and 345")
print(masked)`,
      blanks: ['sub'],
      solution: 'import re\n\nmasked = re.sub(r"\\d", "#", "code 12 and 345")\nprint(masked)',
      explanation:
        're.sub(pattern, repl, string) replaces all non-overlapping matches. Don\'t look for re.replace — that doesn\'t exist (str.replace exists but doesn\'t do regex).',
      hints: ['Three letters; short for "substitute".'],
      tags: ['regex', 'sub'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-cloze-4',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the Python-specific named-group syntax for capturing the year.',
      template: `import re

m = re.match(r"(___year>\\d{4})-\\d{2}-\\d{2}", "2024-03-15")
print(m.group("year"))`,
      blanks: ['?P<'],
      solution:
        'import re\n\nm = re.match(r"(?P<year>\\d{4})-\\d{2}-\\d{2}", "2024-03-15")\nprint(m.group("year"))',
      explanation:
        'Python\'s named-group syntax is (?P<name>pattern). The P prefix is Python-specific (other regex engines use (?<name>) without P). Plain (<name>...) is not valid in Python.',
      hints: ['Three characters before the name: a question mark, a P, a less-than.'],
      tags: ['regex', 'named-groups'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-cloze-5',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the character class shortcut that matches digits 0-9.',
      template: `import re

print(re.findall(r"___+", "year 2024 month 03"))`,
      blanks: ['\\d'],
      solution: 'import re\n\nprint(re.findall(r"\\d+", "year 2024 month 03"))',
      explanation:
        '\\d matches any digit (0-9). \\w matches word characters (letters/digits/underscore); \\s matches whitespace. The capital versions \\D, \\W, \\S match the negation.',
      hints: ['Backslash + lowercase letter for "digit".'],
      tags: ['regex', 'character-classes'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-cloze-6',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the re function that pre-compiles a pattern for repeated use.',
      template: `import re

email_re = re.___(r"^[\\w.]+@[\\w.]+\\.\\w+$")
print(bool(email_re.match("a@b.com")))`,
      blanks: ['compile'],
      solution:
        'import re\n\nemail_re = re.compile(r"^[\\w.]+@[\\w.]+\\.\\w+$")\nprint(bool(email_re.match("a@b.com")))',
      explanation:
        're.compile parses the pattern once and returns a Pattern object. Reusing the compiled pattern avoids re-parsing on every call — the standard pattern when matching the same regex many times.',
      hints: ['Single word; same verb used in compiled languages.'],
      tags: ['regex', 'compile'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-cloze-7',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the lazy quantifier modifier so .* matches as little as possible.',
      template: `import re

text = "[a][b]"
print(re.findall(r"\\[(.*___)\\]", text))`,
      blanks: ['?'],
      solution: 'import re\n\ntext = "[a][b]"\nprint(re.findall(r"\\[(.*?)\\]", text))',
      explanation:
        'Adding ? after a quantifier makes it lazy (non-greedy). Without ?, .* is greedy and would match from the first [ to the last ]. .*? matches the shortest valid string.',
      hints: ['Single character; the question-mark suffix on a quantifier.'],
      tags: ['regex', 'lazy', 'quantifier'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-cloze-8',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the re flag that makes ^ match the start of each line, not just the string.',
      template: `import re

errors = re.findall(r"^ERROR.*", log, re.___)`,
      blanks: ['MULTILINE'],
      solution: 'import re\n\nerrors = re.findall(r"^ERROR.*", log, re.MULTILINE)',
      explanation:
        're.MULTILINE changes the meaning of ^ and $ to per-line anchors (instead of whole-string). Often combined with re.IGNORECASE for log parsing. Aliases: re.M.',
      hints: ['All-caps name; the flag implies "multi-line mode".'],
      tags: ['regex', 'MULTILINE', 'flags'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-cloze-9',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the re flag that makes the match case-insensitive.',
      template: `import re

m = re.search(r"hello", "HELLO WORLD", re.___)
print(m.group())`,
      blanks: ['IGNORECASE'],
      solution: 'import re\n\nm = re.search(r"hello", "HELLO WORLD", re.IGNORECASE)\nprint(m.group())',
      explanation:
        're.IGNORECASE (alias re.I) makes letter matching case-insensitive. Without it, "hello" wouldn\'t match "HELLO". Use this rather than uppercasing both sides — it\'s clearer and faster.',
      hints: ['All-caps name; "ignore" + "case".'],
      tags: ['regex', 'IGNORECASE', 'flags'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-cloze-10',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the prefix that makes the string a "raw string" so backslashes don\'t need to be doubled.',
      template: `import re

m = re.match(___"\\d{4}", "2024")
print(m.group())`,
      blanks: ['r'],
      solution: 'import re\n\nm = re.match(r"\\d{4}", "2024")\nprint(m.group())',
      explanation:
        'r"" is a raw string — backslashes are NOT processed as escape sequences. Without r, you\'d need "\\\\d{4}" to get a literal backslash. Always use raw strings for regex patterns.',
      hints: ['Single letter prefix; same prefix as for raw bytes (without b).'],
      tags: ['regex', 'raw-string'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-parsons-1',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Find the first 4-digit year in text and print it. Use re.search with a raw string.',
      correctOrder: [
        'import re',
        '',
        'text = "born in 1985, graduated 2007"',
        'm = re.search(r"\\d{4}", text)',
        'print(m.group())',
      ],
      distractorLines: [
        'm = re.match(r"\\d{4}", text)',
        'm = re.search("\\d{4}", text)',
      ],
      solution:
        'import re\n\ntext = "born in 1985, graduated 2007"\nm = re.search(r"\\d{4}", text)\nprint(m.group())',
      explanation:
        're.search scans the entire string; re.match anchors at the START — and since "born in" starts the text, match would return None here. Use raw strings for patterns so you don\'t need to double-escape backslashes.',
      hints: ['search scans the whole string; match only checks the start. Use raw strings.'],
      tags: ['regex', 'search', 'match'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-parsons-2',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Capture year, month, day from "2024-03-15" using groups.',
      correctOrder: [
        'import re',
        '',
        'date = "2024-03-15"',
        'm = re.match(r"(\\d{4})-(\\d{2})-(\\d{2})", date)',
        'print(m.group(1), m.group(2), m.group(3))',
      ],
      distractorLines: [
        'print(m.group(0), m.group(1), m.group(2))',
        'm = re.match("(\\d{4})-(\\d{2})-(\\d{2})", date)',
      ],
      solution:
        'import re\n\ndate = "2024-03-15"\nm = re.match(r"(\\d{4})-(\\d{2})-(\\d{2})", date)\nprint(m.group(1), m.group(2), m.group(3))',
      explanation:
        'Group 0 is the WHOLE match; capture groups start at index 1. So group(1) = year, group(2) = month, group(3) = day. Without raw string, "\\d" might be interpreted as escape sequences.',
      hints: ['Group 0 = whole match; captures start at 1.'],
      tags: ['regex', 'groups', 'capture'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-parsons-3',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Use named groups for the same date pattern, then access by name.',
      correctOrder: [
        'import re',
        '',
        'date = "2024-03-15"',
        'm = re.match(r"(?P<year>\\d{4})-(?P<month>\\d{2})-(?P<day>\\d{2})", date)',
        'print(m.group("year"))',
      ],
      distractorLines: [
        'r"(<year>\\d{4})-(<month>\\d{2})-(<day>\\d{2})"',
        'print(m["year"])',
      ],
      solution:
        'import re\n\ndate = "2024-03-15"\nm = re.match(r"(?P<year>\\d{4})-(?P<month>\\d{2})-(?P<day>\\d{2})", date)\nprint(m.group("year"))',
      explanation:
        'Python\'s named group syntax is (?P<name>pattern) — the P prefix is Python-specific. Access via m.group("year") or m["year"] (3.6+). Plain (<name>...) is not valid in Python\'s re.',
      hints: ['Python named-group syntax: (?P<name>pattern). The P is required.'],
      tags: ['regex', 'named-groups'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-parsons-4',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Find ALL the words in text using re.findall and a word-character pattern.',
      correctOrder: [
        'import re',
        '',
        'text = "hello world, regex 101"',
        'words = re.findall(r"\\w+", text)',
        'print(words)',
      ],
      distractorLines: [
        'words = re.search(r"\\w+", text)',
        'words = re.findall(r"\\w", text)',
      ],
      solution:
        'import re\n\ntext = "hello world, regex 101"\nwords = re.findall(r"\\w+", text)\nprint(words)',
      explanation:
        'findall returns a list of all non-overlapping matches. \\w+ matches one or more word characters (letters/digits/underscore). \\w (no +) would match each character separately. search returns just the FIRST match.',
      hints: ['findall = all matches as a list; quantifier + matters.'],
      tags: ['regex', 'findall', 'quantifier'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-parsons-5',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Replace all digits in text with "#" using re.sub.',
      correctOrder: [
        'import re',
        '',
        'text = "code 12 and 345"',
        'masked = re.sub(r"\\d", "#", text)',
        'print(masked)',
      ],
      distractorLines: [
        'text = re.sub(r"\\d", "#", text)',
        'masked = re.replace(r"\\d", "#", text)',
      ],
      solution:
        'import re\n\ntext = "code 12 and 345"\nmasked = re.sub(r"\\d", "#", text)\nprint(masked)',
      explanation:
        're.sub(pattern, repl, string) returns a NEW string with replacements. There\'s no re.replace — that\'s str.replace, which doesn\'t do regex. Reassigning to text would also work but is not what was asked.',
      hints: ['re.sub for regex replace; re.replace doesn\'t exist.'],
      tags: ['regex', 'sub', 'replace'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-parsons-6',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Compile the email pattern once, then reuse it to test multiple addresses.',
      correctOrder: [
        'import re',
        '',
        'email_re = re.compile(r"^[\\w.]+@[\\w.]+\\.\\w+$")',
        'print(bool(email_re.match("a@b.com")))',
        'print(bool(email_re.match("not an email")))',
      ],
      distractorLines: [
        'email_re = re.compile(r"^[\\w.]+@[\\w.]+\\.\\w+$").match',
        'print(re.compile("a@b.com").match(email_re))',
      ],
      solution:
        'import re\n\nemail_re = re.compile(r"^[\\w.]+@[\\w.]+\\.\\w+$")\nprint(bool(email_re.match("a@b.com")))\nprint(bool(email_re.match("not an email")))',
      explanation:
        'Compile the pattern once into a Pattern object, then call .match/.search/.findall on it for each test. This avoids re-parsing the regex on every call. The compiled object exposes the same methods as the re module.',
      hints: ['Compile once, reuse the pattern object.'],
      tags: ['regex', 'compile', 'reuse'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-parsons-7',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Use re.finditer to walk over each match and print the start and end positions of each.',
      correctOrder: [
        'import re',
        '',
        'text = "abc 12 def 345 ghi"',
        'for m in re.finditer(r"\\d+", text):',
        '    print(m.start(), m.end())',
      ],
      distractorLines: [
        'for m in re.findall(r"\\d+", text):',
        '    print(m.start(), m.end())',
      ],
      solution:
        'import re\n\ntext = "abc 12 def 345 ghi"\nfor m in re.finditer(r"\\d+", text):\n    print(m.start(), m.end())',
      explanation:
        'finditer yields Match objects (with .start, .end, .group), unlike findall which returns plain strings. Use finditer when you need positional info or need to iterate without building a list.',
      hints: ['finditer yields Match objects; findall yields strings.'],
      tags: ['regex', 'finditer', 'positions'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-parsons-8',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Anchor a pattern to match only when "ERROR" is at the START of a line (multi-line text).',
      correctOrder: [
        'import re',
        '',
        'log = "INFO ok\\nERROR bad\\nINFO done"',
        'errors = re.findall(r"^ERROR.*", log, re.MULTILINE)',
        'print(errors)',
      ],
      distractorLines: [
        'errors = re.findall(r"^ERROR.*", log)',
        'errors = re.findall(r"ERROR.*", log, re.MULTILINE)',
      ],
      solution:
        'import re\n\nlog = "INFO ok\\nERROR bad\\nINFO done"\nerrors = re.findall(r"^ERROR.*", log, re.MULTILINE)\nprint(errors)',
      explanation:
        'By default ^ matches only the very start of the string. With re.MULTILINE, ^ matches the start of each LINE — so "ERROR bad" is found. Without MULTILINE, ^ERROR fails because the string starts with "INFO".',
      hints: ['^ is whole-string anchor by default; re.MULTILINE makes it line-anchor.'],
      tags: ['regex', 'anchors', 'MULTILINE'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-parsons-9',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Use a lazy quantifier .*? to extract the SHORTEST match between two markers.',
      correctOrder: [
        'import re',
        '',
        'text = "[a][b][c]"',
        'matches = re.findall(r"\\[(.*?)\\]", text)',
        'print(matches)',
      ],
      distractorLines: [
        'matches = re.findall(r"\\[(.*)\\]", text)',
        'matches = re.findall(r"\\[.*?\\]", text)',
      ],
      solution:
        'import re\n\ntext = "[a][b][c]"\nmatches = re.findall(r"\\[(.*?)\\]", text)\nprint(matches)',
      explanation:
        'Greedy .* matches as much as possible — so \\[(.*)\\] captures "a][b][c" (everything between the first [ and the last ]). Lazy .*? matches as little as possible — yielding "a", "b", "c" separately.',
      hints: ['Greedy = maximum match; lazy (?) = minimum match.'],
      tags: ['regex', 'greedy', 'lazy'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-parsons-10',
      type: QuestionType.PARSONS,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Use a substitution function in re.sub to uppercase each matched word.',
      correctOrder: [
        'import re',
        '',
        'text = "hello world"',
        'result = re.sub(r"\\w+", lambda m: m.group().upper(), text)',
        'print(result)',
      ],
      distractorLines: [
        'result = re.sub(r"\\w+", text.upper(), text)',
        'result = re.sub(r"\\w+", "UPPER", text)',
      ],
      solution:
        'import re\n\ntext = "hello world"\nresult = re.sub(r"\\w+", lambda m: m.group().upper(), text)\nprint(result)',
      explanation:
        're.sub accepts a CALLABLE as the replacement — it\'s called once per match, receiving the Match object. Return the replacement string. This lets you do dynamic per-match transforms that a static replacement string can\'t express.',
      hints: ['Pass a function that takes a match and returns the replacement string.'],
      tags: ['regex', 'sub-callable', 'dynamic'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-predict-1',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `import re

text = "hello 2024 world"
m = re.match(r"\\d+", text)
print(m)`,
      expectedOutput: `None`,
      explanation:
        're.match anchors at the START of the string. Since text starts with "hello", not a digit, match returns None — even though digits exist later. Use re.search to scan the whole string.',
      hints: ['match is anchored to position 0; search scans anywhere.'],
      tags: ['regex', 'match', 'anchor'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-predict-2',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `import re

text = "year 2024"
m = re.search(r"(\\d{4})", text)
print(m.group(0))
print(m.group(1))`,
      expectedOutput: `2024
2024`,
      explanation:
        'group(0) is the WHOLE match — "2024". group(1) is the first capture group — also "2024" because the parens enclose the whole pattern. They differ when the pattern has surrounding context outside the parens.',
      hints: ['group(0) = whole match; group(1) = first capture group.'],
      tags: ['regex', 'groups'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-predict-3',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `import re

print(re.findall(r"\\d+", "abc 12 def 345 ghi 6"))`,
      expectedOutput: `['12', '345', '6']`,
      explanation:
        'findall returns a list of all non-overlapping matches as strings (when the pattern has 0 or 1 group). Three runs of digits = three strings.',
      hints: ['findall returns the matched strings as a list.'],
      tags: ['regex', 'findall'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-predict-4',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `import re

print(re.findall(r"(\\w+)=(\\w+)", "a=1, b=2"))`,
      expectedOutput: `[('a', '1'), ('b', '2')]`,
      explanation:
        'When the pattern has TWO OR MORE capture groups, findall returns a list of TUPLES — one tuple per match, with each capture group as an element. With one or zero groups, you get strings instead.',
      hints: ['Multi-group findall returns tuples, not strings.'],
      tags: ['regex', 'findall', 'multi-group'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-predict-5',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `import re

text = "<b>bold</b> and <i>italic</i>"
print(re.findall(r"<(.*)>", text))`,
      expectedOutput: `['b>bold</b> and <i>italic</i']`,
      explanation:
        'Greedy .* matches as much as possible — so the pattern matches from the first < all the way to the LAST >. The capture is everything in between: "b>bold</b> and <i>italic</i". Lazy .*? would give the expected per-tag matches.',
      hints: ['Greedy quantifiers extend to the last possible match.'],
      tags: ['regex', 'greedy'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-predict-6',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `import re

text = "<b>bold</b> and <i>italic</i>"
print(re.findall(r"<(.*?)>", text))`,
      expectedOutput: `['b', '/b', 'i', '/i']`,
      explanation:
        'Lazy .*? matches as LITTLE as possible — so each <...> matches just the tag content. Including closing tags: <b>, </b>, <i>, </i> → captures b, /b, i, /i.',
      hints: ['Lazy quantifier matches minimally; each <...> is captured separately.'],
      tags: ['regex', 'lazy'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-predict-7',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `import re

print(re.sub(r"\\s+", "_", "hello   world  foo"))`,
      expectedOutput: `hello_world_foo`,
      explanation:
        're.sub replaces every match of \\s+ (one or more whitespace chars) with a single underscore. Multi-space runs collapse to one underscore — same for any whitespace including tabs.',
      hints: ['\\s+ matches a RUN of whitespace; replaces with one separator.'],
      tags: ['regex', 'sub'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-predict-8',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `import re

m = re.search(r"(?P<word>\\w+) (?P<num>\\d+)", "score 42")
print(m.group("word"))
print(m.group("num"))`,
      expectedOutput: `score
42`,
      explanation:
        'Named groups (?P<name>...) can be accessed by name with m.group("name"). The named group still has a positional index too; both forms are equivalent.',
      hints: ['m.group("name") accesses named groups.'],
      tags: ['regex', 'named-groups'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-predict-9',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `import re

text = "INFO ok\\nERROR bad\\nINFO done"
print(re.findall(r"^ERROR.*", text, re.MULTILINE))`,
      expectedOutput: `['ERROR bad']`,
      explanation:
        'With re.MULTILINE, ^ matches the start of each line (after a newline). So "ERROR bad" matches because it\'s at the start of the second line. Without MULTILINE, ^ERROR would fail (the string starts with INFO).',
      hints: ['MULTILINE makes ^ a per-line anchor.'],
      tags: ['regex', 'MULTILINE', 'anchor'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-predict-10',
      type: QuestionType.PREDICT_OUTPUT,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'What does this code print?',
      code: `import re

print(re.split(r"\\s*,\\s*", "a , b,c , d"))`,
      expectedOutput: `['a', 'b', 'c', 'd']`,
      explanation:
        're.split splits on the pattern. The pattern matches a comma surrounded by optional whitespace, so the input splits cleanly into tokens regardless of inconsistent spacing around commas.',
      hints: ['split uses the pattern as the delimiter, not a literal comma.'],
      tags: ['regex', 'split'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-adv-regex-1',
      type: QuestionType.CODING,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write two regex helpers against free-form text.\n\n(1) `extract_emails` takes a text string and returns every email address appearing in it, in the order they appear. A pragmatic definition is fine: a run of letters/digits/`.`/`_`/`%`/`+`/`-` for the local part, an `@`, a run of letters/digits/dots/dashes for the domain, a dot, and a top-level domain of at least two letters. Example input `"Contact us at info@example.com or admin@test.org"` → `["info@example.com", "admin@test.org"]`.\n\n(2) `parse_log_entry` takes a single structured log line of the form `[YYYY-MM-DD HH:MM:SS] LEVEL: message (host=hostname)` and returns a dict with exactly the keys `"timestamp"`, `"level"`, `"message"`, `"host"`. If the line does not match that shape, return `None`. Example input `"[2024-01-15 10:30:45] ERROR: Connection timeout (host=db.example.com)"` → `{"timestamp": "2024-01-15 10:30:45", "level": "ERROR", "message": "Connection timeout", "host": "db.example.com"}`. The `message` field must NOT include the trailing `(host=...)` segment.',
      starterCode: `import re
  `,
      testCases: [
        {
          input: '"Contact info@test.com and admin@site.org please"',
          expectedOutput: '["info@test.com", "admin@site.org"]',
          description: 'Should extract emails and parse structured log lines',
        },
      ],
      solution: `import re

def extract_emails(text: str) -> list[str]:
    """Extract all email addresses from text."""
    pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}'
    return re.findall(pattern, text)

def parse_log_entry(line: str) -> dict[str, str] | None:
    """Parse a log line into structured data."""
    pattern = (
        r'\\[(?P<timestamp>\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2})\\]\\s+'
        r'(?P<level>\\w+):\\s+'
        r'(?P<message>.+?)\\s+'
        r'\\(host=(?P<host>[^)]+)\\)'
    )
    match = re.search(pattern, line)
    if match:
        return match.groupdict()
    return None
`,
      explanation: 're.findall returns all non-overlapping matches as strings (or tuples if there are capturing groups). The email pattern matches: local-part @ domain . tld. Named groups (?P<name>pattern) make regex self-documenting and let you access matches by name via match.groupdict(). The log parser combines several regex features: literal brackets (escaped as \\[), named groups, character classes ([^)]+), and non-greedy matching (.+?). Breaking complex patterns across lines with string concatenation improves readability.',
      hints: [
        're.findall returns a list of all matches',
        '(?P<name>pattern) creates a named group',
        'match.groupdict() returns {name: matched_text}',
      ],
      tags: ['regex', 'findall', 'named-groups', 'parsing'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-match-vs-search',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      question: 'What is the difference between `re.match`, `re.search`, `re.fullmatch`, and `re.findall`?',
      options: [
        { id: 'a', text: 'They are all aliases for the same function', isCorrect: false },
        { id: 'b', text: '`re.match` tries to match only at the START of the string. `re.search` scans the whole string for the first match. `re.fullmatch` requires the pattern to match the ENTIRE string. `re.findall` returns a list of every non-overlapping match.', isCorrect: true },
        { id: 'c', text: 'match is case-sensitive; search is not', isCorrect: false },
        { id: 'd', text: 'findall is deprecated — always use match', isCorrect: false },
      ],
      explanation: 'The commonest bug: using `re.match` when you meant `re.search`. `match` is anchored at position 0 and returns None for `"hello"` matching against `"ello"`. Use `search` when the pattern can appear anywhere, `fullmatch` for validation ("does this whole string parse as a valid X?"), `findall` to collect every occurrence.',
      hints: [
        'match = anchored at start',
        'search = anywhere (first hit)',
        'fullmatch = start AND end; findall = all hits as a list',
      ],
      tags: ['regex', 're', 'match', 'search', 'fullmatch', 'findall'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-fullmatch-email',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Use the `re` function that requires the WHOLE string to match (not just a prefix or any substring) to validate whether a string looks like an email. The pattern should be `r"[^@\\s]+@[^@\\s]+\\.[^@\\s]+"` — one or more non-at, non-whitespace chars, then `@`, then the same class again, then a dot, then the same class again. Print the bool result of matching `"user@example.com"` (expect `True`) and the bool result of matching `"not-an-email"` (expect `False`).',
      starterCode: `import re
  `,
      testCases: [
        {
          input: 'fullmatch of email pattern',
          expectedOutput: 'True\nFalse',
          description: 'fullmatch requires the whole string to match',
        },
      ],
      solution: `import re

pattern = r"[^@\\s]+@[^@\\s]+\\.[^@\\s]+"
print(bool(re.fullmatch(pattern, "user@example.com")))
print(bool(re.fullmatch(pattern, "not-an-email")))`,
      explanation: '`fullmatch` is the right tool for validation — if ANY extra characters slip in, it fails. The character class `[^@\\s]+` means "one or more non-at, non-whitespace characters"; this is not a full RFC-compliant email validator but works for 99% of real inputs. For robust email validation, use the `email-validator` library — do NOT try to implement RFC 5322 yourself.',
      hints: [
        'fullmatch returns None on mismatch, a Match object on hit',
        '[^@\\s]+ = one or more non-at, non-whitespace chars',
        'For production: email-validator package, not a hand-rolled regex',
      ],
      tags: ['regex', 'fullmatch', 'email', 'validation'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-named-groups',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Given `s = "2025-03-15"`, parse it with a regex that uses NAMED capture groups — three groups named `year` (4 digits), `month` (2 digits), and `day` (2 digits), separated by dashes. Use `re.search` to find the match, then extract all named groups as a dict using the match object\'s dict-returning method and print it (expect `{\'year\': \'2025\', \'month\': \'03\', \'day\': \'15\'}`).',
      starterCode: `import re
  `,
      testCases: [
        {
          input: 'named groups groupdict',
          expectedOutput: "{'year': '2025', 'month': '03', 'day': '15'}",
          description: 'Named groups read via groupdict()',
        },
      ],
      solution: `import re

s = "2025-03-15"
m = re.search(r"(?P<year>\\d{4})-(?P<month>\\d{2})-(?P<day>\\d{2})", s)
print(m.groupdict())`,
      explanation: 'Named groups `(?P<name>pattern)` make regex self-documenting and let you access results by name (`m.group("year")`) or as a dict (`m.groupdict()`). Dramatically better than positional `m.group(1)` — renaming or adding a group does not break call sites. Pair with `typing.TypedDict` for fully typed parsed output.',
      hints: [
        'Named group syntax: (?P<name>...)',
        'match.groupdict() returns all named groups as a dict',
        'Much more maintainable than positional m.group(1), m.group(2)',
      ],
      tags: ['regex', 'named-groups', 'groupdict', 'parsing'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-sub-redact',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Given `text = "card 4111-1111-1111-1111 used"`, use the `re` substitution function to replace any credit-card-shaped sequence (four groups of four digits joined by dashes — pattern `r"\\d{4}-\\d{4}-\\d{4}-\\d{4}"`) with the string `"[REDACTED]"`. Print the redacted result (expect `card [REDACTED] used`).',
      starterCode: `import re
  `,
      testCases: [
        {
          input: 're.sub redaction',
          expectedOutput: 'card [REDACTED] used',
          description: 're.sub replaces every match with the replacement string',
        },
      ],
      solution: `import re

text = "card 4111-1111-1111-1111 used"
print(re.sub(r"\\d{4}-\\d{4}-\\d{4}-\\d{4}", "[REDACTED]", text))`,
      explanation: '`re.sub(pattern, replacement, string)` returns a new string with every non-overlapping match replaced. Pass a callable as the replacement for transformations that depend on the match: `re.sub(r"\\d+", lambda m: str(int(m.group()) * 2), text)`. Essential for log scrubbing, text templating, and simple content rewriting.',
      hints: [
        're.sub(pattern, replacement, string)',
        'Replacement can be a string or a callable',
        'Returns a new string — originals are immutable',
      ],
      tags: ['regex', 're.sub', 'redaction', 'substitution'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-split',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Given `s = "a,b;c|d, e"`, split the string on ANY of three delimiters — comma, semicolon, or pipe — followed by optional whitespace. Use the `re` function that splits on a regex pattern (not a fixed string). The pattern `r"[,;|]\\s*"` is a character-class matching any of the three delimiters plus zero-or-more whitespace. Print the resulting list (expect `[\'a\', \'b\', \'c\', \'d\', \'e\']`).',
      starterCode: `import re
  `,
      testCases: [
        {
          input: 're.split on character class',
          expectedOutput: "['a', 'b', 'c', 'd', 'e']",
          description: 're.split uses a pattern as the delimiter',
        },
      ],
      solution: `import re

s = "a,b;c|d, e"
print(re.split(r"[,;|]\\s*", s))`,
      explanation: '`re.split` is `str.split` on steroids — the "delimiter" can be any regex. Essential for messy inputs where the delimiter varies. Pass `maxsplit=N` to limit splits (like str.split). Inverse: `re.findall` extracts the stuff between delimiters directly.',
      hints: [
        'Pattern class [,;|] matches any one of those chars',
        '\\s* trims optional trailing whitespace',
        'Pass maxsplit=N to cap the number of splits',
      ],
      tags: ['regex', 're.split', 'tokenize'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-compile-flags',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Compile the pattern `r"^hello"` into a reusable pattern object with two flags combined — case-insensitive matching AND treating `^`/`$` as line boundaries rather than string boundaries. Given `text = "Hello world\\nhello again\\nbye"`, use the compiled pattern\'s `findall` method on the text and print the result (expect `[\'Hello\', \'hello\']` — both lines that START with any-case "hello"; "bye" doesn\'t match).',
      starterCode: `import re
  `,
      testCases: [
        {
          input: 'compiled regex with flags',
          expectedOutput: "['Hello', 'hello']",
          description: 'IGNORECASE + MULTILINE flags composed with |',
        },
      ],
      solution: `import re

pattern = re.compile(r"^hello", re.IGNORECASE | re.MULTILINE)
text = "Hello world\\nhello again\\nbye"
print(pattern.findall(text))`,
      explanation: 'Compile patterns you use repeatedly — once per program startup, not per call. Useful flags: `IGNORECASE` (case-insensitive), `MULTILINE` (^/$ match line boundaries, not just string start/end), `DOTALL` (. matches newline too), `VERBOSE` (whitespace and comments ignored — great for complex patterns). Combine with `|`. Also accessible as `re.I`, `re.M`, etc.',
      hints: [
        're.compile(pattern, flags) → reusable Pattern object',
        'Combine flags with |: re.IGNORECASE | re.MULTILINE',
        'Short aliases: re.I, re.M, re.S, re.X',
      ],
      tags: ['regex', 're.compile', 'flags', 'IGNORECASE', 'MULTILINE'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-greedy-vs-lazy',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      question: 'What is the difference between `.*` and `.*?` in a regex?',
      options: [
        { id: 'a', text: 'They are identical', isCorrect: false },
        { id: 'b', text: '`.*` is greedy — it matches as MUCH as possible. `.*?` is lazy (non-greedy) — it matches as LITTLE as possible. Given `"<a><b>"` and the pattern `<.*>`, greedy matches the whole `<a><b>`; `<.*?>` matches just `<a>`.', isCorrect: true },
        { id: 'c', text: 'The `?` makes the pattern case-insensitive', isCorrect: false },
        { id: 'd', text: '`.*?` is deprecated syntax', isCorrect: false },
      ],
      explanation: 'Greedy quantifiers (`*`, `+`, `?`, `{n,m}`) try to match the maximum possible and backtrack if needed. Adding `?` after any quantifier makes it lazy — match the minimum. Classic use: extracting individual HTML tags with `<.*?>` rather than gobbling across multiple tags. Even better for structured content: use a more specific pattern like `<[^>]+>` which doesn\'t need backtracking.',
      hints: [
        'Greedy (*) = match as much as possible',
        'Lazy (*?) = match as little as possible',
        'For HTML-like: [^>]+ is often faster than .*?',
      ],
      tags: ['regex', 'greedy', 'lazy', 'quantifier'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-finditer',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Given `text = "cat 3 dog 7 bird 9"`, iterate all runs of digits using the `re` function that yields MATCH OBJECTS (not just strings — so you get positions too). Pattern: `r"\\d+"`. For each match, print a line `"<matched digits>@<start position>"` — the matched digits and the character index where they start in the string. Expected output on three lines: `3@4`, `7@10`, `9@17`.',
      starterCode: `import re
  `,
      testCases: [
        {
          input: 're.finditer with positions',
          expectedOutput: '3@4\n7@10\n9@17',
          description: 'finditer yields Match objects with start/end',
        },
      ],
      solution: `import re

text = "cat 3 dog 7 bird 9"
for m in re.finditer(r"\\d+", text):
    print(f"{m.group()}@{m.start()}")`,
      explanation: '`findall` returns just the strings; `finditer` returns the Match objects, giving you `.group()`, `.start()`, `.end()`, `.span()`, and named-group access. Use it when you need positions (for replacement, highlighting, further parsing) or when the pattern has multiple groups. Lazy — iterates one match at a time, memory-friendly for huge texts.',
      hints: [
        'finditer yields Match objects, not strings',
        'Match objects expose .group(), .start(), .end(), .span()',
        'Use findall when you only need the matched strings',
      ],
      tags: ['regex', 'finditer', 'positions', 'Match'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-backreference',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Given `text = "this is is a test test case"`, collapse any consecutive duplicate word into a single occurrence using a regex with a BACKREFERENCE — the token `\\1` in the pattern matches whatever the first group already captured. The pattern `r"\\b(\\w+)\\s+\\1\\b"` means "a word, whitespace, then the SAME word again at a word boundary". Replace any such match with just the first group (replacement string `r"\\1"`) and run the substitution case-insensitively. Print the cleaned text (expect `this is a test case`).',
      starterCode: `import re
  `,
      testCases: [
        {
          input: 'backreference to collapse duplicates',
          expectedOutput: 'this is a test case',
          description: '\\1 references the first captured group',
        },
      ],
      solution: `import re

text = "this is is a test test case"
cleaned = re.sub(r"\\b(\\w+)\\s+\\1\\b", r"\\1", text, flags=re.IGNORECASE)
print(cleaned)`,
      explanation: 'Backreferences let a regex match what it already matched: `\\1` means "the same text group 1 captured". In replacements, `r"\\1"` inserts the captured text. Essential for things like quote matching, balanced tag detection (to a limit), or dedup. `\\b` is a word boundary — prevents matching partial words like "is" inside "this is".',
      hints: [
        '(\\w+)\\s+\\1 = a word, whitespace, then the SAME word again',
        'In replacement strings, r"\\1" inserts group 1',
        '\\b anchors at word boundaries',
      ],
      tags: ['regex', 'backreference', 'substitution', 'word-boundary'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-lookaround',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      question: 'What do `(?=...)`, `(?!...)`, `(?<=...)`, and `(?<!...)` do in a regex?',
      options: [
        { id: 'a', text: 'They are comments — ignored at runtime', isCorrect: false },
        { id: 'b', text: 'Zero-width assertions (lookaround): `(?=X)` positive lookahead (next chars are X, but don\'t consume), `(?!X)` negative lookahead (next chars are NOT X), `(?<=X)` positive lookbehind (previous chars ARE X), `(?<!X)` negative lookbehind (previous chars are NOT X). They match a position without consuming characters.', isCorrect: true },
        { id: 'c', text: 'Alternate syntax for named groups', isCorrect: false },
        { id: 'd', text: 'Flags for case-insensitivity', isCorrect: false },
      ],
      explanation: 'Lookaround matches a POSITION based on context without including that context in the match. Example: `\\d+(?= USD)` matches digits ONLY when followed by " USD", but the "USD" is not part of the match. Critical for password policies (e.g. "contains a digit AND contains a letter" = two positive lookaheads anchored at start). Python\'s `re` requires fixed-width lookbehind; for variable-width use the `regex` package.',
      hints: [
        '(?=...) / (?!...) look ahead at what comes next',
        '(?<=...) / (?<!...) look back at what came before',
        'Match position, do not consume characters',
      ],
      tags: ['regex', 'lookahead', 'lookbehind', 'zero-width'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-parse-keyvalue',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Given a log line `text = "level=info user=alice action=login status=200"`, parse it into a dict mapping each key to its value. Use a regex with TWO capture groups — a word of alphanumerics (`(\\w+)`), then a literal `=`, then a run of non-whitespace (`(\\S+)`). Pass this pattern to the `re` function that returns every match. With two groups present, the result is a list of `(key, value)` tuples — convert that list into a `dict` and print it (expect `{\'level\': \'info\', \'user\': \'alice\', \'action\': \'login\', \'status\': \'200\'}`).',
      starterCode: `import re
  `,
      testCases: [
        {
          input: 'regex to parse key=value log line',
          expectedOutput: "{'level': 'info', 'user': 'alice', 'action': 'login', 'status': '200'}",
          description: 'findall with multiple groups returns tuples',
        },
      ],
      solution: `import re

text = "level=info user=alice action=login status=200"
pairs = re.findall(r"(\\w+)=(\\S+)", text)
result = dict(pairs)
print(result)`,
      explanation: 'Pattern: `(\\w+)` captures the key, `=` is literal, `(\\S+)` captures the non-whitespace value. When `findall` has more than one group, it returns a list of TUPLES rather than a list of strings — perfect for `dict()`. Every structured logger (logfmt, JSON, Apache, nginx) benefits from one-line regex parsers you can reuse across tools.',
      hints: [
        'findall with multiple groups returns list[tuple[str, ...]]',
        'dict(pairs) converts list of 2-tuples to dict',
        'logfmt lines are particularly easy to parse this way',
      ],
      tags: ['regex', 'findall', 'parsing', 'key-value'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-gap-regex-2',
      type: QuestionType.CODING,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Use `re.findall` to extract all numbers from the string "I have 3 cats and 12 dogs, totaling 15 pets". Use the pattern `r\'\\d+\'` to match one or more digits. Print the resulting list of number strings.',
      starterCode: `# Import re and assign text to the sentence from the prompt
# Use re.findall with the r"\\d+" pattern to capture digit runs; print the result
`,
      testCases: [
        {
          input: 're.findall(r"\\d+", "I have 3 cats and 12 dogs, totaling 15 pets")',
          expectedOutput: "['3', '12', '15']",
          description: 'Should find all numbers in the string',
        },
      ],
      solution: `import re

text = "I have 3 cats and 12 dogs, totaling 15 pets"

numbers = re.findall(r'\\d+', text)
print(numbers)  # ['3', '12', '15']`,
      explanation: '`re.findall(pattern, string)` scans the string from left to right and returns a list of all non-overlapping matches. The pattern `r\'\\d+\'` means: `\\d` matches any digit (0-9), and `+` means "one or more." So `\\d+` matches sequences of digits like "3", "12", and "15". Note that results are strings — use `int()` to convert if you need numbers. The `r` prefix makes it a raw string so `\\d` isn\'t treated as an escape sequence.',
      hints: [
        '`re.findall` returns a list of all matches',
        '`\\d+` matches one or more consecutive digits',
        'Results are strings, not integers',
      ],
      tags: ['regex', 're', 'findall', 'basics'],
      concepts: ['py-regex-syntax'],
    },

  // ----- Pattern-syntax primitives (faded "fill the metacharacter" drills) -----
  // Each isolates ONE regex building block, separate from the re-module API above.
  {
      id: 'py-regex-prim-caret',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the anchor that matches the START of the string/line, so this only matches when the text begins with "cat".',
      template: `import re

# True only when the text STARTS with "cat"
print(bool(re.search(r"___cat", "cat on a mat")))
print(bool(re.search(r"___cat", "scatter")))`,
      blanks: ['^', '^'],
      solution:
        'import re\n\nprint(bool(re.search(r"^cat", "cat on a mat")))\nprint(bool(re.search(r"^cat", "scatter")))',
      explanation:
        '^ anchors the match to the start. "cat on a mat" starts with "cat" → True; "scatter" contains "cat" but not at the start → False. (Inside a character class, [^...], the same symbol means "not" — a separate use.) Prints True then False.',
      hints: ['A single symbol that pins the match to the beginning.'],
      tags: ['regex', 'anchors', 'caret', 'primitive'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-prim-dollar',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the anchor that matches the END of the string/line, so this only matches a filename ending in ".py".',
      template: `import re

# True only when the text ENDS with ".py"
print(bool(re.search(r"\\.py___", "main.py")))
print(bool(re.search(r"\\.py___", "main.pyc")))`,
      blanks: ['$', '$'],
      solution:
        'import re\n\nprint(bool(re.search(r"\\.py$", "main.py")))\nprint(bool(re.search(r"\\.py$", "main.pyc")))',
      explanation:
        '$ anchors to the end. "main.py" ends in ".py" → True; "main.pyc" has a trailing "c" so ".py" is not at the end → False. Prints True then False.',
      hints: ['The mirror image of the start anchor — pins the match to the end.'],
      tags: ['regex', 'anchors', 'dollar', 'primitive'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-prim-word-boundary',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in BOTH blanks with the word-boundary marker so "cat" matches only as a WHOLE word — not inside "category" or "scatter".',
      template: `import re

# match "cat" only as a standalone word
print(re.findall(r"___cat___", "cat category scatter"))`,
      blanks: ['\\b', '\\b'],
      solution:
        'import re\n\nprint(re.findall(r"\\bcat\\b", "cat category scatter"))',
      explanation:
        "\\b matches a zero-width word boundary (the edge between a word char and a non-word char). \\bcat\\b matches the standalone \"cat\" but not the \"cat\" inside \"category\" or \"scatter\" → ['cat'].",
      hints: ['Backslash + a letter standing for "boundary"; same token on both sides.'],
      tags: ['regex', 'word-boundary', 'primitive'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-prim-dot',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the metacharacter that matches ANY single character, so "c?t" matches cat, cot, and c@t alike.',
      template: `import re

# the wildcard: any ONE character between c and t
print(re.findall(r"c___t", "cat cot c@t cnt"))`,
      blanks: ['.'],
      solution:
        'import re\n\nprint(re.findall(r"c.t", "cat cot c@t cnt"))',
      explanation:
        ". matches any single character except a newline, so c.t matches cat, cot, c@t, and cnt → ['cat', 'cot', 'c@t', 'cnt']. To match a literal dot you escape it as \\.",
      hints: ['A single punctuation mark — the regex wildcard for one character.'],
      tags: ['regex', 'dot', 'wildcard', 'primitive'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-prim-star',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the quantifier meaning ZERO or more of the preceding character, so "ab?c" also matches "ac" (no b at all).',
      template: `import re

# zero-or-more "b" between a and c (so "ac" matches too)
print(re.findall(r"ab___c", "ac abc abbc"))`,
      blanks: ['*'],
      solution:
        'import re\n\nprint(re.findall(r"ab*c", "ac abc abbc"))',
      explanation:
        "* means 'zero or more of the preceding'. ab*c matches 'ac' (zero b), 'abc' (one b), and 'abbc' (two b) → ['ac', 'abc', 'abbc']. Compare + which requires at least one.",
      hints: ['The quantifier that allows none at all — zero or more.'],
      tags: ['regex', 'quantifier', 'star', 'primitive'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-prim-plus',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the quantifier meaning ONE or more of the preceding character, so "ab?c" requires at least one b and does NOT match "ac".',
      template: `import re

# one-or-more "b" between a and c (so "ac" does NOT match)
print(re.findall(r"ab___c", "ac abc abbc"))`,
      blanks: ['+'],
      solution:
        'import re\n\nprint(re.findall(r"ab+c", "ac abc abbc"))',
      explanation:
        "+ means 'one or more of the preceding'. ab+c needs at least one b, so it matches 'abc' and 'abbc' but NOT 'ac' → ['abc', 'abbc']. The key contrast with * (which allows zero).",
      hints: ['The quantifier that requires at least one — one or more.'],
      tags: ['regex', 'quantifier', 'plus', 'primitive'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-prim-optional',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the quantifier that makes the preceding character OPTIONAL (zero or one), so the pattern matches both the US "color" and the UK "colour".',
      template: `import re

# the "u" is optional: match both spellings
print(re.findall(r"colou___r", "color colour"))`,
      blanks: ['?'],
      solution:
        'import re\n\nprint(re.findall(r"colou?r", "color colour"))',
      explanation:
        "? after a character means 'zero or one of it' — i.e. optional. colou?r matches 'color' (no u) and 'colour' (one u) → ['color', 'colour']. (After a *+? quantifier the same ? instead means 'lazy'.)",
      hints: ['A single punctuation mark meaning "optional" — zero or one.'],
      tags: ['regex', 'quantifier', 'optional', 'primitive'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-prim-brace-exact',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the quantifier that matches EXACTLY four digits in a row (so a year matches but a 1- or 2-digit number does not).',
      template: `import re

# match a run of exactly four digits
print(re.findall(r"\\d___", "year 2024 day 03 code 7"))`,
      blanks: ['{4}'],
      solution:
        'import re\n\nprint(re.findall(r"\\d{4}", "year 2024 day 03 code 7"))',
      explanation:
        "{n} means 'exactly n of the preceding'. \\d{4} matches only a 4-digit run, so '2024' qualifies but '03' and '7' do not → ['2024'].",
      hints: ['Braces around a single count.'],
      tags: ['regex', 'quantifier', 'braces', 'primitive'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-prim-brace-range',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the quantifier that matches a run of 2 TO 3 digits (a minimum and a maximum), so a lone digit is skipped.',
      template: `import re

# match a digit-run between 2 and 3 long
print(re.findall(r"\\d___", "1 22 333"))`,
      blanks: ['{2,3}'],
      solution:
        'import re\n\nprint(re.findall(r"\\d{2,3}", "1 22 333"))',
      explanation:
        "{n,m} means 'between n and m of the preceding'. \\d{2,3} skips the lone '1' but matches '22' and '333' → ['22', '333']. {n,} means 'n or more' with no upper bound.",
      hints: ['Braces with a comma between the low and high counts.'],
      tags: ['regex', 'quantifier', 'braces', 'primitive'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-prim-charclass',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in a character class matching any single lowercase letter in the RANGE a through f (use the dash range form, not a list of letters).',
      template: `import re

# any one lowercase letter from a to f
print(re.findall(r"___", "a1 c3 z9 e!"))`,
      blanks: ['[a-f]'],
      solution: 'import re\n\nprint(re.findall(r"[a-f]", "a1 c3 z9 e!"))',
      explanation:
        "Square brackets define a character class; a dash gives a range. [a-f] matches one letter a–f, so 'a', 'c', 'e' match but 'z' (out of range) and the digits/punctuation do not → ['a', 'c', 'e'].",
      hints: ['Brackets around a low-dash-high range.'],
      tags: ['regex', 'character-class', 'range', 'primitive'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-prim-neg-charclass',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in a NEGATED character class matching any single character that is NOT a digit 0-9 (the leading symbol inside the brackets negates the set).',
      template: `import re

# any one character that is NOT a digit
print(re.findall(r"___", "a1b2"))`,
      blanks: ['[^0-9]'],
      blankAlternates: [['[^\\d]']],
      solution: 'import re\n\nprint(re.findall(r"[^0-9]", "a1b2"))',
      explanation:
        "A ^ as the FIRST character inside [...] negates the class. [^0-9] matches any single non-digit, so it keeps 'a' and 'b' and skips the digits → ['a', 'b']. (^ outside brackets is the start anchor — same symbol, different job.)",
      hints: ['Brackets, a leading negation symbol, then the digit range.'],
      tags: ['regex', 'character-class', 'negation', 'primitive'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-prim-alternation',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the alternation operator meaning "EITHER / OR", so the pattern matches either "cat" or "dog".',
      template: `import re

# match either "cat" or "dog"
print(re.findall(r"cat___dog", "a cat and a dog"))`,
      blanks: ['|'],
      solution:
        'import re\n\nprint(re.findall(r"cat|dog", "a cat and a dog"))',
      explanation:
        "| is alternation: 'left OR right'. cat|dog matches whichever appears → ['cat', 'dog']. Wrap alternatives in a group, e.g. (cat|dog)s, to scope the OR to part of a larger pattern.",
      hints: ['A single vertical bar — the boolean "or" of regex.'],
      tags: ['regex', 'alternation', 'primitive'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-prim-escape-dot',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the two characters that match a LITERAL dot (not the any-character wildcard), so only "3.5" matches and "379" does not.',
      template: `import re

# match digit, a LITERAL dot, digit
print(re.findall(r"\\d___\\d", "3.5 and 379"))`,
      blanks: ['\\.'],
      solution: 'import re\n\nprint(re.findall(r"\\d\\.\\d", "3.5 and 379"))',
      explanation:
        "A backslash escapes a metacharacter, turning it into its literal self. \\. matches an actual dot, so \\d\\.\\d matches '3.5' but not '379' (no dot). Without the backslash, . would match any char and '379' would match too → ['3.5'].",
      hints: ['Backslash in front of the wildcard makes it literal.'],
      tags: ['regex', 'escaping', 'literal', 'primitive'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-prim-w',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the shorthand class matching a single WORD character (a letter, digit, or underscore).',
      template: `import re

# runs of word characters (letters, digits, underscore)
print(re.findall(r"___+", "hi_there! 99"))`,
      blanks: ['\\w'],
      solution: 'import re\n\nprint(re.findall(r"\\w+", "hi_there! 99"))',
      explanation:
        "\\w matches one word character: a letter, a digit, or an underscore (it does NOT include punctuation like '!'). \\w+ grabs whole runs → ['hi_there', '99']. \\W is the negation (non-word).",
      hints: ['Backslash + a letter standing for "word".'],
      tags: ['regex', 'character-classes', 'shorthand', 'primitive'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-prim-s',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the shorthand class matching a single WHITESPACE character (space, tab, or newline), used here to split on runs of spaces.',
      template: `import re

# split on runs of whitespace
print(re.split(r"___+", "the  quick   fox"))`,
      blanks: ['\\s'],
      solution: 'import re\n\nprint(re.split(r"\\s+", "the  quick   fox"))',
      explanation:
        "\\s matches a single whitespace character (space, tab, newline, etc.). \\s+ collapses any run of whitespace, so splitting yields ['the', 'quick', 'fox'] regardless of how many spaces separate the words. \\S is the negation (non-whitespace).",
      hints: ['Backslash + a letter standing for "space".'],
      tags: ['regex', 'character-classes', 'shorthand', 'primitive'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-prim-noncapture',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question:
        'Fill in the two characters (placed right after the opening parenthesis) that make a group NON-capturing — grouping "ab" for the + quantifier without turning it into a capture group, so findall returns the whole match.',
      template: `import re

# group "ab" for the + WITHOUT capturing it
print(re.findall(r"(___ab)+", "abab xyz ab"))`,
      blanks: ['?:'],
      solution:
        'import re\n\nprint(re.findall(r"(?:ab)+", "abab xyz ab"))',
      explanation:
        "(?:...) groups without capturing. With (?:ab)+ findall returns the whole matched runs → ['abab', 'ab']. A plain capturing (ab)+ would instead make findall return the group's contents ('ab', 'ab'), losing the full match. Use ?: whenever you need grouping (for a quantifier or alternation) but not a capture.",
      hints: ['Question mark then colon, just inside the opening parenthesis.'],
      tags: ['regex', 'groups', 'non-capturing', 'primitive'],
      concepts: ['py-regex-syntax'],
    },

  // ===== Layer 1: character classes & shorthands (fill the class token) =====
  {
      id: 'py-regex-prim-D',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Match every NON-digit character.',
      template: `import re

print(re.findall(r"___", "a1b2"))   # -> ['a', 'b']`,
      blanks: ['\\D'],
      blankAlternates: [['[^0-9]', '[^\\d]']],
      solution: 'import re\n\nprint(re.findall(r"\\D", "a1b2"))',
      explanation: "\\D is the negation of \\d — any character that is NOT a digit → ['a', 'b']. (Capital shorthand = negation: \\D, \\W, \\S.)",
      hints: ['Capital of the digit shorthand negates it.'],
      tags: ['regex', 'character-classes', 'shorthand', 'primitive'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-prim-W',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Match every NON-word character (not a letter, digit, or underscore).',
      template: `import re

print(re.findall(r"___", "a_b!c?"))   # -> ['!', '?']`,
      blanks: ['\\W'],
      solution: 'import re\n\nprint(re.findall(r"\\W", "a_b!c?"))',
      explanation: "\\W is the negation of \\w. Letters, digits, and underscore are word chars, so only '!' and '?' match → ['!', '?'].",
      hints: ['Capital of the word-character shorthand.'],
      tags: ['regex', 'character-classes', 'shorthand', 'primitive'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-prim-S',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Match each run of non-whitespace characters.',
      template: `import re

print(re.findall(r"___+", "a b  c"))   # -> ['a', 'b', 'c']`,
      blanks: ['\\S'],
      solution: 'import re\n\nprint(re.findall(r"\\S+", "a b  c"))',
      explanation: "\\S is the negation of \\s — any non-whitespace char. \\S+ grabs each contiguous token → ['a', 'b', 'c'].",
      hints: ['Capital of the whitespace shorthand.'],
      tags: ['regex', 'character-classes', 'shorthand', 'primitive'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-prim-set',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Match any single vowel using a character set.',
      template: `import re

print(re.findall(r"___", "hello"))   # -> ['e', 'o']`,
      blanks: ['[aeiou]'],
      solution: 'import re\n\nprint(re.findall(r"[aeiou]", "hello"))',
      explanation: "Square brackets list the allowed characters: [aeiou] matches one vowel. In 'hello' that is 'e' and 'o' → ['e', 'o'].",
      hints: ['List the characters you want inside square brackets.'],
      tags: ['regex', 'character-class', 'set', 'primitive'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-prim-combined',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Match any single letter (upper or lowercase) with one character class.',
      template: `import re

print(re.findall(r"___", "aB3!"))   # -> ['a', 'B']`,
      blanks: ['[A-Za-z]'],
      blankAlternates: [['[a-zA-Z]']],
      solution: 'import re\n\nprint(re.findall(r"[A-Za-z]", "aB3!"))',
      explanation: "A class can hold multiple ranges back to back: [A-Za-z] matches one letter of either case, so the digit and '!' are skipped → ['a', 'B'].",
      hints: ['Two ranges, uppercase and lowercase, in one bracket pair.'],
      tags: ['regex', 'character-class', 'range', 'primitive'],
      concepts: ['py-regex-syntax'],
    },

  // ===== Layer 2: quantifiers (fill the quantifier token) =====
  {
      id: 'py-regex-prim-brace-min',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Match a run of two OR MORE digits (no upper limit).',
      template: `import re

print(re.findall(r"\\d___", "1 22 333"))   # -> ['22', '333']`,
      blanks: ['{2,}'],
      solution: 'import re\n\nprint(re.findall(r"\\d{2,}", "1 22 333"))',
      explanation: "{n,} means 'n or more' with no upper bound. \\d{2,} skips the lone '1' and matches '22' and '333' → ['22', '333'].",
      hints: ['Braces with a low count and a trailing comma, no upper number.'],
      tags: ['regex', 'quantifier', 'braces', 'primitive'],
      concepts: ['py-regex-syntax'],
    },

  // ===== Layer 3: anchors & boundaries =====
  {
      id: 'py-regex-prim-nonboundary',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: "Match 'cat' only when it sits INSIDE a larger word (not at a boundary).",
      template: `import re

print(re.findall(r"___cat", "cat scatter category"))   # -> ['cat']`,
      blanks: ['\\B'],
      solution: 'import re\n\nprint(re.findall(r"\\Bcat", "cat scatter category"))',
      explanation: "\\B is the negation of \\b — it asserts there is NO word boundary. \\Bcat matches the 'cat' inside 'scatter' but not the standalone 'cat' or the start of 'category' → ['cat'].",
      hints: ['The capital of the word-boundary marker.'],
      tags: ['regex', 'word-boundary', 'primitive'],
      concepts: ['py-regex-syntax'],
    },

  // ===== Layer 4: compose a whole small pattern (write the pattern) =====
  {
      id: 'py-regex-prim-compose-digits',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write a pattern matching each run of one or more digits.',
      template: `import re

print(re.findall(r"___", "a12 b3 c456"))   # -> ['12', '3', '456']`,
      blanks: ['\\d+'],
      blankAlternates: [['[0-9]+']],
      solution: 'import re\n\nprint(re.findall(r"\\d+", "a12 b3 c456"))',
      explanation: "\\d matches a digit; + means 'one or more'. Together \\d+ grabs whole numbers → ['12', '3', '456']. ([0-9]+ is equivalent.)",
      hints: ['Digit shorthand followed by the one-or-more quantifier.'],
      tags: ['regex', 'compose', 'digits', 'primitive'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-prim-compose-year',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write a pattern matching a 4-digit year.',
      template: `import re

print(re.findall(r"___", "born 2024 here"))   # -> ['2024']`,
      blanks: ['\\d{4}'],
      blankAlternates: [['[0-9]{4}']],
      solution: 'import re\n\nprint(re.findall(r"\\d{4}", "born 2024 here"))',
      explanation: "\\d{4} matches exactly four digits in a row → ['2024']. {n} pins the count.",
      hints: ['Digit shorthand plus an exact-count quantifier.'],
      tags: ['regex', 'compose', 'braces', 'primitive'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-prim-compose-startword',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write a pattern matching lines that START with ERROR.',
      template: `import re

log = "OK\\nERROR x\\nERROR y"
print(re.findall(r"___", log, re.M))   # -> ['ERROR', 'ERROR']`,
      blanks: ['^ERROR'],
      solution: 'import re\n\nlog = "OK\\nERROR x\\nERROR y"\nprint(re.findall(r"^ERROR", log, re.M))',
      explanation: "^ anchors to the start of a line (with re.M / MULTILINE), so ^ERROR matches the two lines that begin with ERROR → ['ERROR', 'ERROR'].",
      hints: ['Start anchor immediately followed by the literal word.'],
      tags: ['regex', 'compose', 'anchors', 'primitive'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-prim-compose-capword',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write a pattern matching a capitalized word (one uppercase letter then lowercase letters).',
      template: `import re

print(re.findall(r"___", "Cat dog Bird"))   # -> ['Cat', 'Bird']`,
      blanks: ['[A-Z][a-z]+'],
      solution: 'import re\n\nprint(re.findall(r"[A-Z][a-z]+", "Cat dog Bird"))',
      explanation: "Two classes in sequence: [A-Z] matches one capital, then [a-z]+ matches the lowercase tail. 'dog' (all lowercase) is skipped → ['Cat', 'Bird'].",
      hints: ['An uppercase class, then a one-or-more lowercase class.'],
      tags: ['regex', 'compose', 'character-class', 'primitive'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-prim-compose-wholeword',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: "Write a pattern matching 'cat' only as a whole word.",
      template: `import re

print(re.findall(r"___", "cat category scatter"))   # -> ['cat']`,
      blanks: ['\\bcat\\b'],
      solution: 'import re\n\nprint(re.findall(r"\\bcat\\b", "cat category scatter"))',
      explanation: "Wrapping the word in \\b...\\b requires a word boundary on both sides, so only the standalone 'cat' matches → ['cat'].",
      hints: ['Word boundary, the word, word boundary.'],
      tags: ['regex', 'compose', 'word-boundary', 'primitive'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-prim-compose-decimal',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write a pattern matching a decimal number like 3.14 (digits, a literal dot, digits).',
      template: `import re

print(re.findall(r"___", "pi 3.14 and 42"))   # -> ['3.14']`,
      blanks: ['\\d+\\.\\d+'],
      blankAlternates: [['[0-9]+\\.[0-9]+']],
      solution: 'import re\n\nprint(re.findall(r"\\d+\\.\\d+", "pi 3.14 and 42"))',
      explanation: "\\d+ then an escaped \\. (a literal dot) then \\d+. '42' has no dot so it is skipped → ['3.14']. Forgetting the backslash on the dot would also match things like '42 5'.",
      hints: ['Digits, an escaped dot, digits.'],
      tags: ['regex', 'compose', 'escaping', 'primitive'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-prim-compose-tag',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Write a pattern matching each HTML tag, shortest match.',
      template: `import re

print(re.findall(r"___", "<b>hi</b>"))   # -> ['<b>', '</b>']`,
      blanks: ['<.*?>'],
      blankAlternates: [['<[^>]*>', '<[^>]+>']],
      solution: 'import re\n\nprint(re.findall(r"<.*?>", "<b>hi</b>"))',
      explanation: "<.*?> uses a lazy .*? so each tag matches the shortest run between < and > → ['<b>', '</b>']. Greedy <.*> would instead match the whole '<b>hi</b>'. <[^>]+> is an even tighter alternative.",
      hints: ['Angle brackets around a lazy any-char run.'],
      tags: ['regex', 'compose', 'lazy', 'primitive'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-prim-compose-optional',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: "Write a pattern matching both 'color' and 'colour'.",
      template: `import re

print(re.findall(r"___", "color colour"))   # -> ['color', 'colour']`,
      blanks: ['colou?r'],
      solution: 'import re\n\nprint(re.findall(r"colou?r", "color colour"))',
      explanation: "The ? makes the preceding 'u' optional, so colou?r matches the spelling with or without the u → ['color', 'colour'].",
      hints: ['Make the differing letter optional with ?.'],
      tags: ['regex', 'compose', 'optional', 'primitive'],
      concepts: ['py-regex-syntax'],
    },

  // ===== Layer 5: groups, alternation & escaping =====
  {
      id: 'py-regex-prim-capture',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Wrap the four-digit year in a CAPTURING group so group(1) returns just the year.',
      template: `import re

m = re.search(r"___\\d{4}___-\\d{2}", "2024-03")
print(m.group(1))   # -> '2024'`,
      blanks: ['(', ')'],
      solution: 'import re\n\nm = re.search(r"(\\d{4})-\\d{2}", "2024-03")\nprint(m.group(1))',
      explanation: "Plain parentheses ( ) create a capturing group. group(1) returns whatever the first group matched — here the year '2024'. group(0) would be the whole match '2024-03'.",
      hints: ['A pair of plain round brackets around the part you want to capture.'],
      tags: ['regex', 'groups', 'capture', 'primitive'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-prim-escape-paren',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Match a LITERAL opening parenthesis.',
      template: `import re

print(re.findall(r"___", "f(x) = (1)"))   # -> ['(', '(']`,
      blanks: ['\\('],
      solution: 'import re\n\nprint(re.findall(r"\\(", "f(x) = (1)"))',
      explanation: "( normally starts a group, so to match a literal parenthesis you escape it: \\( → ['(', '(']. The same applies to other metacharacters like \\[ \\{ \\+.",
      hints: ['Backslash in front of the bracket makes it literal.'],
      tags: ['regex', 'escaping', 'literal', 'primitive'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-prim-backref',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: 'Use a BACKREFERENCE to match a doubled word (a word, a space, then the same word).',
      template: `import re

print(re.findall(r"(\\w+) ___", "the the cat"))   # -> ['the']`,
      blanks: ['\\1'],
      solution: 'import re\n\nprint(re.findall(r"(\\w+) \\1", "the the cat"))',
      explanation: "\\1 is a backreference — it matches the same text that group 1 already captured. So (\\w+) \\1 matches a word repeated → captures 'the' → ['the'].",
      hints: ['Backslash followed by the group number.'],
      tags: ['regex', 'backreference', 'groups', 'primitive'],
      concepts: ['py-regex-syntax'],
    },

  // ===== Layer 6: lookaround (advanced) =====
  {
      id: 'py-regex-prim-lookahead',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: "Match a number only when it is FOLLOWED by ' USD' (without consuming 'USD').",
      template: `import re

print(re.findall(r"\\d+(___ USD)", "5 USD, 9 EUR"))   # -> ['5']`,
      blanks: ['?='],
      solution: 'import re\n\nprint(re.findall(r"\\d+(?= USD)", "5 USD, 9 EUR"))',
      explanation: "(?=...) is a positive lookahead: it asserts what follows without consuming it. \\d+(?= USD) matches '5' (it is followed by ' USD') but not '9' → ['5']. The ' USD' itself is not part of the match.",
      hints: ['Question mark then equals, just inside the parenthesis.'],
      tags: ['regex', 'lookahead', 'zero-width', 'primitive'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-prim-neg-lookahead',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: "Match a number only when it is NOT followed by ' USD'.",
      template: `import re

print(re.findall(r"\\d+(___ USD)", "5 USD, 9 EUR"))   # -> ['9']`,
      blanks: ['?!'],
      solution: 'import re\n\nprint(re.findall(r"\\d+(?! USD)", "5 USD, 9 EUR"))',
      explanation: "(?!...) is a negative lookahead. \\d+(?! USD) rejects '5' (it IS followed by ' USD') and matches '9' (followed by ' EUR') → ['9'].",
      hints: ['Question mark then exclamation, just inside the parenthesis.'],
      tags: ['regex', 'lookahead', 'negation', 'primitive'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-prim-lookbehind',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: "Match digits that come right AFTER a '$' (without consuming the '$').",
      template: `import re

print(re.findall(r"(___\\$)\\d+", "$5 and 9"))   # -> ['5']`,
      blanks: ['?<='],
      solution: 'import re\n\nprint(re.findall(r"(?<=\\$)\\d+", "$5 and 9"))',
      explanation: "(?<=...) is a positive lookbehind: it asserts what PRECEDES the match. (?<=\\$)\\d+ matches '5' (preceded by '$') but not '9' → ['5']. Python's lookbehind must be fixed-width.",
      hints: ['Question mark, less-than, equals — the lookbehind opener.'],
      tags: ['regex', 'lookbehind', 'zero-width', 'primitive'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-prim-neg-lookbehind',
      type: QuestionType.CLOZE_CODE,
      difficulty: Difficulty.ADVANCED,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      language: CodeLanguage.PYTHON,
      question: "Match digits that are NOT preceded by a '$'.",
      template: `import re

print(re.findall(r"(___\\$)\\d+", "$5 9"))   # -> ['9']`,
      blanks: ['?<!'],
      solution: 'import re\n\nprint(re.findall(r"(?<!\\$)\\d+", "$5 9"))',
      explanation: "(?<!...) is a negative lookbehind. (?<!\\$)\\d+ rejects '5' (preceded by '$') and matches '9' → ['9'].",
      hints: ['Question mark, less-than, exclamation — the negative lookbehind opener.'],
      tags: ['regex', 'lookbehind', 'negation', 'primitive'],
      concepts: ['py-regex-syntax'],
    },

  // ===== Quick API-usage recall (which function / what it returns) =====
  {
      id: 'py-regex-api-match',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      question: 'Which `re` function checks for a match ONLY at the start of the string?',
      options: [
        { id: 'a', text: 're.match', isCorrect: true },
        { id: 'b', text: 're.search', isCorrect: false },
        { id: 'c', text: 're.findall', isCorrect: false },
        { id: 'd', text: 're.fullmatch', isCorrect: false },
      ],
      explanation: 're.match is anchored at position 0 — it only succeeds if the pattern matches at the very start. Use re.search to find a match anywhere.',
      hints: ['Anchored at the start of the string.'],
      tags: ['regex', 'api', 'match'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-api-search',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      question: 'Which `re` function scans the whole string and returns the FIRST match anywhere?',
      options: [
        { id: 'a', text: 're.search', isCorrect: true },
        { id: 'b', text: 're.match', isCorrect: false },
        { id: 'c', text: 're.split', isCorrect: false },
        { id: 'd', text: 're.sub', isCorrect: false },
      ],
      explanation: 're.search scans left to right and returns the first match (a Match object) or None. Unlike re.match it is not anchored to the start.',
      hints: ['Finds the first hit anywhere in the string.'],
      tags: ['regex', 'api', 'search'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-api-findall',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      question: 'Which `re` function returns ALL non-overlapping matches as a list?',
      options: [
        { id: 'a', text: 're.findall', isCorrect: true },
        { id: 'b', text: 're.finditer', isCorrect: false },
        { id: 'c', text: 're.search', isCorrect: false },
        { id: 'd', text: 're.match', isCorrect: false },
      ],
      explanation: 're.findall returns a list of every non-overlapping match. (re.finditer returns the same matches but as Match objects, one at a time.)',
      hints: ['Returns a plain list of every match.'],
      tags: ['regex', 'api', 'findall'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-api-fullmatch',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      question: 'Which `re` function requires the ENTIRE string to match the pattern?',
      options: [
        { id: 'a', text: 're.fullmatch', isCorrect: true },
        { id: 'b', text: 're.match', isCorrect: false },
        { id: 'c', text: 're.search', isCorrect: false },
        { id: 'd', text: 're.findall', isCorrect: false },
      ],
      explanation: 're.fullmatch succeeds only if the whole string matches start to end — ideal for validation. re.match only anchors the start, so trailing junk still passes.',
      hints: ['Start AND end must match — good for validation.'],
      tags: ['regex', 'api', 'fullmatch'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-api-finditer',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      question: 'Which `re` function yields Match objects (with positions) one at a time?',
      options: [
        { id: 'a', text: 're.finditer', isCorrect: true },
        { id: 'b', text: 're.findall', isCorrect: false },
        { id: 'c', text: 're.search', isCorrect: false },
        { id: 'd', text: 're.split', isCorrect: false },
      ],
      explanation: 're.finditer yields Match objects, so you get .group(), .start(), .end() for each. Use it when you need positions; re.findall gives only the matched strings.',
      hints: ['Iterates Match objects, so you get positions.'],
      tags: ['regex', 'api', 'finditer'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-api-sub',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      question: 'Which `re` function replaces every match with a replacement string?',
      options: [
        { id: 'a', text: 're.sub', isCorrect: true },
        { id: 'b', text: 're.replace', isCorrect: false },
        { id: 'c', text: 're.swap', isCorrect: false },
        { id: 'd', text: 're.gsub', isCorrect: false },
      ],
      explanation: 're.sub(pattern, repl, string) returns a new string with all matches replaced. re.replace / re.swap / re.gsub do not exist (str.replace is plain-text, not regex).',
      hints: ['Short for "substitute".'],
      tags: ['regex', 'api', 'sub'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-api-split',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      question: 'Which `re` function splits a string using a PATTERN as the delimiter?',
      options: [
        { id: 'a', text: 're.split', isCorrect: true },
        { id: 'b', text: 're.partition', isCorrect: false },
        { id: 'c', text: 're.findall', isCorrect: false },
        { id: 'd', text: 're.tokenize', isCorrect: false },
      ],
      explanation: 're.split breaks the string wherever the pattern matches — like str.split but the delimiter can be any regex.',
      hints: ['Like str.split, but the delimiter is a regex.'],
      tags: ['regex', 'api', 'split'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-api-compile',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      question: 'Which `re` function pre-parses a pattern into a reusable object?',
      options: [
        { id: 'a', text: 're.compile', isCorrect: true },
        { id: 'b', text: 're.cache', isCorrect: false },
        { id: 'c', text: 're.prepare', isCorrect: false },
        { id: 'd', text: 're.build', isCorrect: false },
      ],
      explanation: 're.compile(pattern) returns a Pattern object you can reuse with .match/.search/.findall, avoiding re-parsing on every call.',
      hints: ['Parse the pattern once, reuse the object.'],
      tags: ['regex', 'api', 'compile'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-api-findall-tuples',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      question: '`re.findall` with TWO capture groups returns a list of what?',
      options: [
        { id: 'a', text: 'Tuples, one per match', isCorrect: true },
        { id: 'b', text: 'Strings, one per match', isCorrect: false },
        { id: 'c', text: 'Match objects', isCorrect: false },
        { id: 'd', text: 'A single joined string', isCorrect: false },
      ],
      explanation: 'With 2+ groups, findall returns a list of tuples — one element per group. With 0 or 1 group it returns plain strings instead.',
      hints: ['Multiple groups → one tuple per match.'],
      tags: ['regex', 'api', 'findall', 'groups'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-api-no-match',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      question: 'What does `re.search` return when there is NO match?',
      options: [
        { id: 'a', text: 'None', isCorrect: true },
        { id: 'b', text: 'An empty string', isCorrect: false },
        { id: 'c', text: 'An empty list', isCorrect: false },
        { id: 'd', text: 'The value False', isCorrect: false },
      ],
      explanation: 'search and match return None on failure — which is why you write `if m:` or `m = re.search(...); if m is None`. findall instead returns an empty list.',
      hints: ['Falsy, but not False or "" — the singleton.'],
      tags: ['regex', 'api', 'search', 'none'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-api-groupdict',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      question: 'Which Match method returns all NAMED groups as a dict?',
      options: [
        { id: 'a', text: 'm.groupdict()', isCorrect: true },
        { id: 'b', text: 'm.groups()', isCorrect: false },
        { id: 'c', text: 'm.group(0)', isCorrect: false },
        { id: 'd', text: 'm.items()', isCorrect: false },
      ],
      explanation: 'm.groupdict() maps each (?P<name>...) group name to its match. m.groups() returns a tuple of all groups positionally; m.group(0) is the whole match.',
      hints: ['Returns {name: text} for named groups.'],
      tags: ['regex', 'api', 'groupdict'],
      concepts: ['py-regex-syntax'],
    },
  {
      id: 'py-regex-api-group-zero',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.PY_REGEX,
      course: Course.BACKEND,
      question: 'In a Match object, what is `group(0)`?',
      options: [
        { id: 'a', text: 'The entire match', isCorrect: true },
        { id: 'b', text: 'The first capture group', isCorrect: false },
        { id: 'c', text: 'The last capture group', isCorrect: false },
        { id: 'd', text: 'Always the value None', isCorrect: false },
      ],
      explanation: 'group(0) (the default for .group()) is the whole matched text. Capture groups start at group(1).',
      hints: ['Index 0 is the whole match; captures start at 1.'],
      tags: ['regex', 'api', 'groups'],
      concepts: ['py-regex-syntax'],
    },
];
