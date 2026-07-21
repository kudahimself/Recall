import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  CodeLanguage,
} from '../types';

/**
 * PHASE 1: Critical Certification Topics
 * - String Functions (25 questions)
 * - Date/Time Functions (30 questions)
 * - Collection Functions (30 questions)
 * - Delta Lake Basics (20 questions)
 * - SQL Joins (20 questions)
 */

export const expandedQuestions: Question[] = [
  // ===== STRING FUNCTIONS (25 questions) =====

  // UPPER / LOWER
  {
    id: 'string-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.STRING_FUNCTIONS,
    language: CodeLanguage.PYTHON,
    question: 'Write a PySpark statement to add a column "email_lower" to DataFrame "df" (which has column "email"), containing the lowercase version of the email address.',
    starterCode: `# Convert email to lowercase in email_lower\nresult = `,
    testCases: [
      {
        input: 'df with email column',
        expectedOutput: 'lower(df.email) or lower("email")',
        description: 'Should convert email to lowercase',
      },
    ],
    solution: `from pyspark.sql.functions import lower

result = df.withColumn("email_lower", lower(df.email))
# OR
from pyspark.sql.functions import lower, col

result = df.withColumn("email_lower", lower(col("email")))
# OR
from pyspark.sql.functions import lower

result = df.withColumn("email_lower", lower("email"))`,
    explanation: 'lower(column) converts all characters in a string column to lowercase.',
    tieredHints: {
      apiSignature: 'lower(col: Column | str) -> Column',
      skeleton: `from pyspark.sql.functions import lower

result = ____.withColumn("email_lower", ____(df.____))`,
    },
    hints: ['Use lower() function from pyspark.sql.functions', 'Pass column as argument'],
    tags: ['string', 'lower', 'functions'],
    concepts: ['ps-string-fns'],
  },

  {
    id: 'string-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.STRING_FUNCTIONS,
    language: CodeLanguage.PYTHON,
    question: 'Write a PySpark statement to add a column "name_upper" to DataFrame "df" (which has column "name"), containing the uppercase version of the name.',
    starterCode: `# Convert name to uppercase in name_upper\nresult = `,
    testCases: [
      {
        input: 'df with name column',
        expectedOutput: 'upper(df.name) or upper("name")',
        description: 'Should convert name to uppercase',
      },
    ],
    solution: `from pyspark.sql.functions import upper

result = df.withColumn("name_upper", upper(df.name))
# OR
from pyspark.sql.functions import upper, col

result = df.withColumn("name_upper", upper(col("name")))
# OR
from pyspark.sql.functions import upper

result = df.withColumn("name_upper", upper("name"))`,
    explanation: 'upper(column) converts all string characters to uppercase.',
    tieredHints: {
      apiSignature: 'upper(col: Column | str) -> Column',
      skeleton: `from pyspark.sql.functions import upper

result = ____.withColumn("name_upper", ____(df.____))`,
    },
    hints: ['Use upper() function', 'Import from pyspark.sql.functions'],
    tags: ['string', 'upper', 'functions'],
    concepts: ['ps-string-fns'],
  },

  // CONCAT
  {
    id: 'string-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.STRING_FUNCTIONS,
    language: CodeLanguage.PYTHON,
    question: 'Write a PySpark statement to add a column "full_name" to DataFrame "df" (columns: first_name, last_name) by concatenating first_name and last_name separated by a space.',
    starterCode: `# Concatenate first_name and last_name with space\nresult = `,
    testCases: [
      {
        input: 'df with first_name and last_name columns',
        expectedOutput: 'concat(df.first_name, lit(" "), df.last_name)',
        description: 'Should concatenate with space',
      },
    ],
    solution: `from pyspark.sql.functions import concat, lit

result = df.withColumn("full_name", concat(df.first_name, lit(" "), df.last_name))
# OR
from pyspark.sql.functions import concat, lit, col

result = df.withColumn("full_name", concat(col("first_name"), lit(" "), col("last_name")))`,
    explanation: 'concat() joins multiple string columns/literals. lit(" ") provides a constant space string literal.',
    tieredHints: {
      apiSignature: 'concat(*cols: Column | str) -> Column',
      skeleton: `from pyspark.sql.functions import concat, lit

result = df.withColumn("full_name", ____(df.first_name, ____(" "), df.____))`,
    },
    hints: ['Use concat() function', 'Use lit(" ") to add a space between names'],
    tags: ['string', 'concat', 'lit', 'functions'],
    concepts: ['ps-string-fns', 'ps-with-column'],
  },

  {
    id: 'string-4',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.STRING_FUNCTIONS,
    language: CodeLanguage.PYTHON,
    question: 'Write a PySpark statement to add a column "location" to DataFrame "df" (columns: city, state, country), concatenating them separated by ", ".',
    starterCode: `# Concatenate city, state, country with ", "\nresult = `,
    testCases: [
      {
        input: 'df with city, state, country columns',
        expectedOutput: 'concat_ws(", ", df.city, df.state, df.country)',
        description: 'Should concatenate with comma separator',
      },
    ],
    solution: `from pyspark.sql.functions import concat_ws

result = df.withColumn("location", concat_ws(", ", df.city, df.state, df.country))
# OR
from pyspark.sql.functions import concat_ws, col

result = df.withColumn("location", concat_ws(", ", col("city"), col("state"), col("country")))
# OR
from pyspark.sql.functions import concat_ws

result = df.withColumn("location", concat_ws(", ", "city", "state", "country"))`,
    explanation: 'concat_ws(separator, *cols) joins multiple string columns using a specified delimiter string.',
    tieredHints: {
      apiSignature: 'concat_ws(sep: str, *cols: Column | str) -> Column',
      skeleton: `from pyspark.sql.functions import concat_ws

result = ____.withColumn("location", ____(", ", df.city, df.state, df.____))`,
    },
    hints: ['Use concat_ws()', 'First argument is the separator string ", "'],
    tags: ['string', 'concat_ws', 'functions'],
    concepts: ['ps-string-fns'],
  },

  // SUBSTRING
  {
    id: 'string-5',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.STRING_FUNCTIONS,
    language: CodeLanguage.PYTHON,
    question: 'Write a PySpark statement to add a column "category" to DataFrame "df" (which has column "product_code") by extracting the first 3 characters from product_code.',
    starterCode: `# Extract first 3 characters into category\nresult = `,
    testCases: [
      {
        input: 'df with product_code column',
        expectedOutput: 'substring(df.product_code, 1, 3)',
        description: 'Should extract first 3 characters',
      },
    ],
    solution: `from pyspark.sql.functions import substring

result = df.withColumn("category", substring(df.product_code, 1, 3))
# OR
from pyspark.sql.functions import substring, col

result = df.withColumn("category", substring(col("product_code"), 1, 3))
# OR
from pyspark.sql.functions import substring

result = df.withColumn("category", substring("product_code", 1, 3))`,
    explanation: 'substring(column, pos, len) extracts a substring starting at 1-indexed position pos for length len.',
    tieredHints: {
      apiSignature: 'substring(str: Column | str, pos: int, len: int) -> Column',
      skeleton: `from pyspark.sql.functions import substring

result = df.withColumn("category", ____(df.product_code, ____, ____))`,
    },
    hints: ['Use substring() function', 'Parameters: column, start_position (1-indexed), length'],
    tags: ['string', 'substring', 'functions'],
    concepts: ['ps-string-fns'],
  },

  // TRIM
  {
    id: 'string-6',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.STRING_FUNCTIONS,
    language: CodeLanguage.PYTHON,
    question: 'Write a PySpark statement to add a column "description_clean" to DataFrame "df" (which has column "description"), removing all leading and trailing whitespace.',
    starterCode: `# Trim whitespace into description_clean\nresult = `,
    testCases: [
      {
        input: 'df with description column containing whitespace',
        expectedOutput: 'trim(df.description)',
        description: 'Should remove leading and trailing whitespace',
      },
    ],
    solution: `from pyspark.sql.functions import trim

result = df.withColumn("description_clean", trim(df.description))
# OR
from pyspark.sql.functions import trim, col

result = df.withColumn("description_clean", trim(col("description")))
# OR
from pyspark.sql.functions import trim

result = df.withColumn("description_clean", trim("description"))`,
    explanation: 'trim(column) strips leading and trailing spaces from string values.',
    tieredHints: {
      apiSignature: 'trim(col: Column | str) -> Column',
      skeleton: `from pyspark.sql.functions import trim

result = ____.withColumn("description_clean", ____(df.____))`,
    },
    hints: ['Use trim() function'],
    tags: ['string', 'trim', 'functions'],
    concepts: ['ps-string-fns'],
  },

  // SPLIT
  {
    id: 'string-7',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.STRING_FUNCTIONS,
    language: CodeLanguage.PYTHON,
    question: 'Write a PySpark statement to add a column "tags_array" to DataFrame "df" (which has comma-separated string column "tags"), splitting string values on "," into an array.',
    starterCode: `# Split tags on comma into array\nresult = `,
    testCases: [
      {
        input: 'df with tags column containing comma-separated values',
        expectedOutput: 'split(df.tags, ",")',
        description: 'Should split on comma into array',
      },
    ],
    solution: `from pyspark.sql.functions import split

result = df.withColumn("tags_array", split(df.tags, ","))
# OR
from pyspark.sql.functions import split, col

result = df.withColumn("tags_array", split(col("tags"), ","))
# OR
from pyspark.sql.functions import split

result = df.withColumn("tags_array", split("tags", ","))`,
    explanation: 'split(column, delimiter) splits string values by delimiter into an ArrayType column.',
    tieredHints: {
      apiSignature: 'split(str: Column | str, pattern: str, limit: int = -1) -> Column',
      skeleton: `from pyspark.sql.functions import split

result = ____.withColumn("tags_array", ____(df.tags, "____"))`,
    },
    hints: ['Use split() function', 'First argument is column, second is delimiter string'],
    tags: ['string', 'split', 'array', 'functions'],
    concepts: ['ps-string-fns', 'ps-collection-fns'],
  },

  // REGEXP_REPLACE
  {
    id: 'string-8',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.STRING_FUNCTIONS,
    language: CodeLanguage.PYTHON,
    question: 'Write a PySpark statement to add a column "masked_text" to DataFrame "df" (which has column "text"), replacing all digits [0-9] with "X".',
    starterCode: `# Replace digits with X in masked_text\nresult = `,
    testCases: [
      {
        input: 'df with text column containing digits',
        expectedOutput: 'regexp_replace(df.text, "[0-9]", "X")',
        description: 'Should replace all digits with X',
      },
    ],
    solution: `from pyspark.sql.functions import regexp_replace

result = df.withColumn("masked_text", regexp_replace(df.text, "[0-9]", "X"))
# OR
from pyspark.sql.functions import regexp_replace, col

result = df.withColumn("masked_text", regexp_replace(col("text"), "\\\\d", "X"))
# OR
from pyspark.sql.functions import regexp_replace

result = df.withColumn("masked_text", regexp_replace("text", "[0-9]", "X"))`,
    explanation: 'regexp_replace(column, pattern, replacement) substitutes regex matches with replacement string.',
    tieredHints: {
      apiSignature: 'regexp_replace(str: Column | str, pattern: str, replacement: str) -> Column',
      skeleton: `from pyspark.sql.functions import regexp_replace

result = df.withColumn("masked_text", ____(df.text, "____", "____"))`,
    },
    hints: ['Use regexp_replace()', 'Pattern for digits: "[0-9]" or "\\\\d"'],
    tags: ['string', 'regexp_replace', 'regex', 'functions'],
    concepts: ['ps-string-fns', 'ps-regex-fns'],
  },

  {
    id: 'string-9',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.STRING_FUNCTIONS,
    language: CodeLanguage.PYTHON,
    question: 'Write a PySpark statement to add a column "username_clean" to DataFrame "df" (which has column "username"), stripping non-alphanumeric characters using regex.',
    starterCode: `# Strip non-alphanumeric characters\nresult = `,
    testCases: [
      {
        input: 'df with username column',
        expectedOutput: 'regexp_replace(df.username, "[^a-zA-Z0-9]", "")',
        description: 'Should remove non-alphanumeric characters',
      },
    ],
    solution: `from pyspark.sql.functions import regexp_replace

result = df.withColumn("username_clean", regexp_replace(df.username, "[^a-zA-Z0-9]", ""))
# OR
from pyspark.sql.functions import regexp_replace, col

result = df.withColumn("username_clean", regexp_replace(col("username"), "[^a-zA-Z0-9]", ""))
# OR
from pyspark.sql.functions import regexp_replace

result = df.withColumn("username_clean", regexp_replace("username", "[^a-zA-Z0-9]", ""))`,
    explanation: 'The negated character set [^a-zA-Z0-9] matches all non-alphanumeric characters, replacing them with empty string.',
    tieredHints: {
      apiSignature: 'regexp_replace(str: Column | str, pattern: str, replacement: str) -> Column',
      skeleton: `from pyspark.sql.functions import regexp_replace

result = df.withColumn("username_clean", ____(df.username, "____", "____"))`,
    },
    hints: ['Use regexp_replace()', 'Pattern [^a-zA-Z0-9] matches non-alphanumeric characters'],
    tags: ['string', 'regexp_replace', 'regex', 'functions'],
    concepts: ['ps-string-fns', 'ps-regex-fns'],
  },

  // REGEXP_EXTRACT
  {
    id: 'string-10',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.STRING_FUNCTIONS,
    language: CodeLanguage.PYTHON,
    question: 'Write a PySpark statement to add a column "domain" to DataFrame "df" (which has column "email"), extracting the domain portion after "@" using regexp_extract.',
    starterCode: `# Extract domain after @ into domain\nresult = `,
    testCases: [
      {
        input: 'df with email column',
        expectedOutput: 'regexp_extract(df.email, "@(.+)", 1)',
        description: 'Should extract domain after @',
      },
    ],
    solution: `from pyspark.sql.functions import regexp_extract

result = df.withColumn("domain", regexp_extract(df.email, "@(.+)", 1))
# OR
from pyspark.sql.functions import regexp_extract, col

result = df.withColumn("domain", regexp_extract(col("email"), "@(.+)", 1))
# OR
from pyspark.sql.functions import regexp_extract

result = df.withColumn("domain", regexp_extract("email", "@(.+)", 1))`,
    explanation: 'regexp_extract(column, pattern, idx) extracts matching regex capture group idx (1-indexed).',
    tieredHints: {
      apiSignature: 'regexp_extract(str: Column | str, pattern: str, idx: int) -> Column',
      skeleton: `from pyspark.sql.functions import regexp_extract

result = df.withColumn("domain", ____(df.email, "____", ____))`,
    },
    hints: ['Use regexp_extract()', 'Pattern: "@(.+)" captures everything after @', 'Group index 1 gets the captured group'],
    tags: ['string', 'regexp_extract', 'regex', 'functions'],
    concepts: ['ps-string-fns', 'ps-regex-fns'],
  },

  // LENGTH
  {
    id: 'string-11',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.STRING_FUNCTIONS,
    language: CodeLanguage.PYTHON,
    question: 'Write a PySpark statement to add a column "comment_length" to DataFrame "df" (which has column "comment"), calculating string character count.',
    starterCode: `# Compute character length into comment_length\nresult = `,
    testCases: [
      {
        input: 'df with comment column',
        expectedOutput: 'length(df.comment)',
        description: 'Should calculate string length',
      },
    ],
    solution: `from pyspark.sql.functions import length

result = df.withColumn("comment_length", length(df.comment))
# OR
from pyspark.sql.functions import length, col

result = df.withColumn("comment_length", length(col("comment")))
# OR
from pyspark.sql.functions import length

result = df.withColumn("comment_length", length("comment"))`,
    explanation: 'length(column) calculates character length of string values.',
    tieredHints: {
      apiSignature: 'length(col: Column | str) -> Column',
      skeleton: `from pyspark.sql.functions import length

result = ____.withColumn("comment_length", ____(df.____))`,
    },
    hints: ['Use length() function'],
    tags: ['string', 'length', 'functions'],
    concepts: ['ps-string-fns'],
  },

  // ===== DATE/TIME FUNCTIONS (30 questions) =====

  // CURRENT_DATE, CURRENT_TIMESTAMP
  {
    id: 'datetime-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DATETIME_FUNCTIONS,
    language: CodeLanguage.PYTHON,
    question: 'Write a PySpark statement to add a column "today" containing current date to DataFrame "df".',
    starterCode: `# Add today column with current date\nresult = `,
    testCases: [
      {
        input: 'df',
        expectedOutput: 'current_date()',
        description: 'Should add current date',
      },
    ],
    solution: `from pyspark.sql.functions import current_date

result = df.withColumn("today", current_date())
# OR
from pyspark.sql.functions import current_date

result = df.select("*", current_date().alias("today"))`,
    explanation: 'current_date() generates current calendar date without arguments.',
    tieredHints: {
      apiSignature: 'current_date() -> Column',
      skeleton: `from pyspark.sql.functions import current_date

result = ____.____("today", ____())`,
    },
    hints: ['Use current_date() function', 'No arguments needed'],
    tags: ['datetime', 'current_date', 'functions'],
    concepts: ['ps-datetime-fns'],
  },

  {
    id: 'datetime-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DATETIME_FUNCTIONS,
    language: CodeLanguage.PYTHON,
    question: 'Write a PySpark statement to add a column "now" containing current timestamp to DataFrame "df".',
    starterCode: `# Add now column with current timestamp\nresult = `,
    testCases: [
      {
        input: 'df',
        expectedOutput: 'current_timestamp()',
        description: 'Should add current timestamp',
      },
    ],
    solution: `from pyspark.sql.functions import current_timestamp

result = df.withColumn("now", current_timestamp())
# OR
from pyspark.sql.functions import current_timestamp

result = df.select("*", current_timestamp().alias("now"))`,
    explanation: 'current_timestamp() generates current system timestamp (date and time).',
    tieredHints: {
      apiSignature: 'current_timestamp() -> Column',
      skeleton: `from pyspark.sql.functions import current_timestamp

result = ____.____("now", ____())`,
    },
    hints: ['Use current_timestamp() function'],
    tags: ['datetime', 'current_timestamp', 'functions'],
    concepts: ['ps-datetime-fns'],
  },

  // TO_DATE, TO_TIMESTAMP
  {
    id: 'datetime-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATETIME_FUNCTIONS,
    language: CodeLanguage.PYTHON,
    question: 'Write a PySpark statement to add a column "date_parsed" to DataFrame "df" (which has string column "date_string"), parsing string values using format "yyyy-MM-dd".',
    starterCode: `# Parse date_string into date_parsed\nresult = `,
    testCases: [
      {
        input: 'df with date_string column',
        expectedOutput: 'to_date(df.date_string, "yyyy-MM-dd")',
        description: 'Should convert string to date',
      },
    ],
    solution: `from pyspark.sql.functions import to_date

result = df.withColumn("date_parsed", to_date(df.date_string, "yyyy-MM-dd"))
# OR
from pyspark.sql.functions import to_date, col

result = df.withColumn("date_parsed", to_date(col("date_string"), "yyyy-MM-dd"))
# OR
from pyspark.sql.functions import to_date

result = df.withColumn("date_parsed", to_date("date_string", "yyyy-MM-dd"))`,
    explanation: 'to_date(column, format) parses string representations into DateType objects.',
    tieredHints: {
      apiSignature: 'to_date(col: Column | str, format: str = None) -> Column',
      skeleton: `from pyspark.sql.functions import to_date

result = ____.withColumn("date_parsed", ____(df.____, "____"))`,
    },
    hints: ['Use to_date() function', 'Format pattern: "yyyy-MM-dd"'],
    tags: ['datetime', 'to_date', 'conversion', 'functions'],
    concepts: ['ps-datetime-fns', 'ps-cast-types'],
  },

  {
    id: 'datetime-4',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATETIME_FUNCTIONS,
    language: CodeLanguage.PYTHON,
    question: 'Write a PySpark statement to add a column "event_time" to DataFrame "df" (which has string column "ts_string"), parsing timestamp strings using format "yyyy-MM-dd HH:mm:ss".',
    starterCode: `# Parse ts_string into event_time\nresult = `,
    testCases: [
      {
        input: 'df with timestamp_string column',
        expectedOutput: 'to_timestamp(df.timestamp_string, "yyyy-MM-dd HH:mm:ss")',
        description: 'Should convert string to timestamp',
      },
    ],
    solution: `from pyspark.sql.functions import to_timestamp

result = df.withColumn("event_time", to_timestamp(df.ts_string, "yyyy-MM-dd HH:mm:ss"))
# OR
from pyspark.sql.functions import to_timestamp, col

result = df.withColumn("event_time", to_timestamp(col("ts_string"), "yyyy-MM-dd HH:mm:ss"))
# OR
from pyspark.sql.functions import to_timestamp

result = df.withColumn("event_time", to_timestamp("ts_string", "yyyy-MM-dd HH:mm:ss"))`,
    explanation: 'to_timestamp(column, format) parses string representations into TimestampType objects.',
    tieredHints: {
      apiSignature: 'to_timestamp(col: Column | str, format: str = None) -> Column',
      skeleton: `from pyspark.sql.functions import to_timestamp

result = ____.withColumn("event_time", ____(df.____, "____"))`,
    },
    hints: ['Use to_timestamp()', 'Format pattern: "yyyy-MM-dd HH:mm:ss"'],
    tags: ['datetime', 'to_timestamp', 'conversion', 'functions'],
    concepts: ['ps-datetime-fns', 'ps-cast-types'],
  },

  // DATE_ADD, DATE_SUB
  {
    id: 'datetime-5',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATETIME_FUNCTIONS,
    language: CodeLanguage.PYTHON,
    question: 'Write a PySpark statement to add a column "due_date" to DataFrame "df" (which has date column "order_date"), calculated as 30 days after order_date.',
    starterCode: `# Add 30 days to order_date in due_date\nresult = `,
    testCases: [
      {
        input: 'df with order_date column',
        expectedOutput: 'date_add(df.order_date, 30)',
        description: 'Should add 30 days',
      },
    ],
    solution: `from pyspark.sql.functions import date_add

result = df.withColumn("due_date", date_add(df.order_date, 30))
# OR
from pyspark.sql.functions import date_add, col

result = df.withColumn("due_date", date_add(col("order_date"), 30))
# OR
from pyspark.sql.functions import date_add

result = df.withColumn("due_date", date_add("order_date", 30))`,
    explanation: 'date_add(date_col, days) increments date values by the given number of days.',
    tieredHints: {
      apiSignature: 'date_add(start: Column | str, days: int | Column) -> Column',
      skeleton: `from pyspark.sql.functions import date_add

result = ____.withColumn("due_date", ____(df.order_date, ____))`,
    },
    hints: ['Use date_add()', 'Second parameter is integer number of days'],
    tags: ['datetime', 'date_add', 'functions'],
    concepts: ['ps-datetime-fns'],
  },

  {
    id: 'datetime-6',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATETIME_FUNCTIONS,
    language: CodeLanguage.PYTHON,
    question: 'Write a PySpark statement to add a column "reminder_date" to DataFrame "df" (which has date column "end_date"), calculated as 7 days prior to end_date.',
    starterCode: `# Subtract 7 days from end_date in reminder_date\nresult = `,
    testCases: [
      {
        input: 'df with end_date column',
        expectedOutput: 'date_sub(df.end_date, 7)',
        description: 'Should subtract 7 days',
      },
    ],
    solution: `from pyspark.sql.functions import date_sub

result = df.withColumn("reminder_date", date_sub(df.end_date, 7))
# OR
from pyspark.sql.functions import date_sub, col

result = df.withColumn("reminder_date", date_sub(col("end_date"), 7))
# OR
from pyspark.sql.functions import date_sub

result = df.withColumn("reminder_date", date_sub("end_date", 7))`,
    explanation: 'date_sub(date_col, days) decrements date values by the given number of days.',
    tieredHints: {
      apiSignature: 'date_sub(start: Column | str, days: int | Column) -> Column',
      skeleton: `from pyspark.sql.functions import date_sub

result = ____.withColumn("reminder_date", ____(df.end_date, ____))`,
    },
    hints: ['Use date_sub()', 'Second parameter is integer days to subtract'],
    tags: ['datetime', 'date_sub', 'functions'],
    concepts: ['ps-datetime-fns'],
  },

  // DATEDIFF
  {
    id: 'datetime-7',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATETIME_FUNCTIONS,
    language: CodeLanguage.PYTHON,
    question: 'Write a PySpark statement to add a column "duration_days" to DataFrame "df" (columns: start_date, end_date), calculating the difference (end_date minus start_date) in days.',
    starterCode: `# Compute days between end_date and start_date\nresult = `,
    testCases: [
      {
        input: 'df with end_date and start_date columns',
        expectedOutput: 'datediff(df.end_date, df.start_date)',
        description: 'Should calculate difference in days',
      },
    ],
    solution: `from pyspark.sql.functions import datediff

result = df.withColumn("duration_days", datediff(df.end_date, df.start_date))
# OR
from pyspark.sql.functions import datediff, col

result = df.withColumn("duration_days", datediff(col("end_date"), col("start_date")))
# OR
from pyspark.sql.functions import datediff

result = df.withColumn("duration_days", datediff("end_date", "start_date"))`,
    explanation: 'datediff(end_date, start_date) calculates end_date minus start_date in days.',
    tieredHints: {
      apiSignature: 'datediff(end: Column | str, start: Column | str) -> Column',
      skeleton: `from pyspark.sql.functions import datediff

result = ____.withColumn("duration_days", ____(df.end_date, df.____))`,
    },
    hints: ['Use datediff()', 'First argument is end_date, second is start_date'],
    tags: ['datetime', 'datediff', 'functions'],
    concepts: ['ps-datetime-fns'],
  },

  // YEAR, MONTH, DAY
  {
    id: 'datetime-8',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DATETIME_FUNCTIONS,
    language: CodeLanguage.PYTHON,
    question: 'Write a PySpark statement to add a column "birth_year" to DataFrame "df" (which has date column "birth_date"), extracting the year integer.',
    starterCode: `# Extract year from birth_date into birth_year\nresult = `,
    testCases: [
      {
        input: 'df with birth_date column',
        expectedOutput: 'year(df.birth_date)',
        description: 'Should extract year',
      },
    ],
    solution: `from pyspark.sql.functions import year

result = df.withColumn("birth_year", year(df.birth_date))
# OR
from pyspark.sql.functions import year, col

result = df.withColumn("birth_year", year(col("birth_date")))
# OR
from pyspark.sql.functions import year

result = df.withColumn("birth_year", year("birth_date"))`,
    explanation: 'year(date_col) extracts integer year component from date or timestamp values.',
    tieredHints: {
      apiSignature: 'year(col: Column | str) -> Column',
      skeleton: `from pyspark.sql.functions import year

result = ____.withColumn("birth_year", ____(df.____))`,
    },
    hints: ['Use year() function'],
    tags: ['datetime', 'year', 'extract', 'functions'],
    concepts: ['ps-datetime-fns', 'ps-regex-fns'],
  },

  {
    id: 'datetime-9',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DATETIME_FUNCTIONS,
    language: CodeLanguage.PYTHON,
    question: 'Write a PySpark statement to add a column "txn_month" to DataFrame "df" (which has date column "transaction_date"), extracting the month integer (1-12).',
    starterCode: `# Extract month from transaction_date into txn_month\nresult = `,
    testCases: [
      {
        input: 'df with transaction_date column',
        expectedOutput: 'month(df.transaction_date)',
        description: 'Should extract month',
      },
    ],
    solution: `from pyspark.sql.functions import month

result = df.withColumn("txn_month", month(df.transaction_date))
# OR
from pyspark.sql.functions import month, col

result = df.withColumn("txn_month", month(col("transaction_date")))
# OR
from pyspark.sql.functions import month

result = df.withColumn("txn_month", month("transaction_date"))`,
    explanation: 'month(date_col) extracts integer month component (1 to 12) from date or timestamp values.',
    tieredHints: {
      apiSignature: 'month(col: Column | str) -> Column',
      skeleton: `from pyspark.sql.functions import month

result = ____.withColumn("txn_month", ____(df.____))`,
    },
    hints: ['Use month() function'],
    tags: ['datetime', 'month', 'extract', 'functions'],
    concepts: ['ps-datetime-fns', 'ps-regex-fns'],
  },

  {
    id: 'datetime-10',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DATETIME_FUNCTIONS,
    language: CodeLanguage.PYTHON,
    question: 'Write a PySpark statement to add a column "event_day" to DataFrame "df" (which has date column "event_date"), extracting the day of month integer (1-31).',
    starterCode: `# Extract day of month from event_date into event_day\nresult = `,
    testCases: [
      {
        input: 'df with event_date column',
        expectedOutput: 'dayofmonth(df.event_date)',
        description: 'Should extract day of month',
      },
    ],
    solution: `from pyspark.sql.functions import dayofmonth

result = df.withColumn("event_day", dayofmonth(df.event_date))
# OR
from pyspark.sql.functions import dayofmonth, col

result = df.withColumn("event_day", dayofmonth(col("event_date")))
# OR
from pyspark.sql.functions import dayofmonth

result = df.withColumn("event_day", dayofmonth("event_date"))`,
    explanation: 'dayofmonth(date_col) extracts integer day component (1 to 31) from date or timestamp values.',
    tieredHints: {
      apiSignature: 'dayofmonth(col: Column | str) -> Column',
      skeleton: `from pyspark.sql.functions import dayofmonth

result = ____.withColumn("event_day", ____(df.____))`,
    },
    hints: ['Use dayofmonth() function'],
    tags: ['datetime', 'dayofmonth', 'extract', 'functions'],
    concepts: ['ps-datetime-fns', 'ps-regex-fns'],
  },

  // DATE_FORMAT
  {
    id: 'datetime-11',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATETIME_FUNCTIONS,
    language: CodeLanguage.PYTHON,
    question: 'Write a PySpark statement to add a column "order_date_str" to DataFrame "df" (which has date column "order_date"), formatting date values as string "MM/dd/yyyy".',
    starterCode: `# Format order_date as MM/dd/yyyy in order_date_str\nresult = `,
    testCases: [
      {
        input: 'df with order_date column',
        expectedOutput: 'date_format(df.order_date, "MM/dd/yyyy")',
        description: 'Should format date as MM/dd/yyyy',
      },
    ],
    solution: `from pyspark.sql.functions import date_format

result = df.withColumn("order_date_str", date_format(df.order_date, "MM/dd/yyyy"))
# OR
from pyspark.sql.functions import date_format, col

result = df.withColumn("order_date_str", date_format(col("order_date"), "MM/dd/yyyy"))
# OR
from pyspark.sql.functions import date_format

result = df.withColumn("order_date_str", date_format("order_date", "MM/dd/yyyy"))`,
    explanation: 'date_format(date_col, format) converts date/timestamp values into formatted string columns.',
    tieredHints: {
      apiSignature: 'date_format(date: Column | str, format: str) -> Column',
      skeleton: `from pyspark.sql.functions import date_format

result = ____.withColumn("order_date_str", ____(df.order_date, "____"))`,
    },
    hints: ['Use date_format()', 'Format pattern: "MM/dd/yyyy"'],
    tags: ['datetime', 'date_format', 'formatting', 'functions'],
    concepts: ['ps-datetime-fns', 'ps-string-fns'],
  },

  // ===== COLLECTION FUNCTIONS (30 questions) =====

  // EXPLODE
  {
    id: 'collection-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.COLLECTION_FUNCTIONS,
    language: CodeLanguage.PYTHON,
    question: 'Write a PySpark statement to select column "id" and explode array column "tags" into a new column named "tag" from DataFrame "df".',
    starterCode: `# Explode tags array into tag\nresult = `,
    testCases: [
      {
        input: 'df with id and tags (array) columns',
        expectedOutput: 'explode(df.tags)',
        description: 'Should explode array into rows',
      },
    ],
    solution: `from pyspark.sql.functions import explode

result = df.select("id", explode(df.tags).alias("tag"))
# OR
from pyspark.sql.functions import explode, col

result = df.select("id", explode(col("tags")).alias("tag"))
# OR
from pyspark.sql.functions import explode

result = df.select("id", explode("tags").alias("tag"))`,
    explanation: 'explode() converts each element of an array column into a separate row, repeating parent row values.',
    tieredHints: {
      apiSignature: 'explode(col: Column | str) -> Column',
      skeleton: `from pyspark.sql.functions import explode

result = ____.select("id", ____(df.tags).____("tag"))`,
    },
    hints: ['Use explode() function', 'Use alias() to name the exploded column'],
    tags: ['collection', 'explode', 'array', 'functions'],
    concepts: ['ps-collection-fns'],
  },

  {
    id: 'collection-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.COLLECTION_FUNCTIONS,
    language: CodeLanguage.PYTHON,
    question: 'Write a PySpark statement to select column "order_id" and explode array column "products" (which may contain nulls) into column "product" from DataFrame "df", preserving null rows.',
    starterCode: `# Explode products preserving null arrays\nresult = `,
    testCases: [
      {
        input: 'df with order_id and products (array with possible nulls)',
        expectedOutput: 'explode_outer(df.products)',
        description: 'Should explode and preserve null arrays',
      },
    ],
    solution: `from pyspark.sql.functions import explode_outer

result = df.select("order_id", explode_outer(df.products).alias("product"))
# OR
from pyspark.sql.functions import explode_outer, col

result = df.select("order_id", explode_outer(col("products")).alias("product"))
# OR
from pyspark.sql.functions import explode_outer

result = df.select("order_id", explode_outer("products").alias("product"))`,
    explanation: 'explode_outer() functions like explode(), but retains rows with null or empty arrays by outputting a null value.',
    tieredHints: {
      apiSignature: 'explode_outer(col: Column | str) -> Column',
      skeleton: `from pyspark.sql.functions import explode_outer

result = ____.select("order_id", ____(df.products).____("product"))`,
    },
    hints: ['Use explode_outer()', 'This preserves null arrays unlike regular explode()'],
    tags: ['collection', 'explode_outer', 'array', 'functions'],
    concepts: ['ps-collection-fns'],
  },

  // ARRAY_CONTAINS
  {
    id: 'collection-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.COLLECTION_FUNCTIONS,
    language: CodeLanguage.PYTHON,
    question: 'Write a PySpark statement to filter DataFrame "df" to rows where array column "skills" contains element "Python".',
    starterCode: `# Filter rows where skills array contains Python\nresult = `,
    testCases: [
      {
        input: 'df with skills array column',
        expectedOutput: 'array_contains(df.skills, "Python")',
        description: 'Should filter arrays containing Python',
      },
    ],
    solution: `from pyspark.sql.functions import array_contains

result = df.filter(array_contains(df.skills, "Python"))
# OR
from pyspark.sql.functions import array_contains, col

result = df.filter(array_contains(col("skills"), "Python"))
# OR
from pyspark.sql.functions import array_contains

result = df.filter(array_contains("skills", "Python"))`,
    explanation: 'array_contains(column, value) returns True if the specified array contains value.',
    tieredHints: {
      apiSignature: 'array_contains(col: Column | str, value: Any) -> Column',
      skeleton: `from pyspark.sql.functions import array_contains

result = ____.filter(____(df.skills, "____"))`,
    },
    hints: ['Use array_contains()', 'Returns boolean for filtering'],
    tags: ['collection', 'array_contains', 'array', 'filter', 'functions'],
    concepts: ['ps-collection-fns', 'ps-select-filter'],
  },

  // ARRAY
  {
    id: 'collection-4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.COLLECTION_FUNCTIONS,
    question: 'Given DataFrame "df" with integer columns col1, col2, col3, which PySpark function expression creates a single new column containing all three values as an array?',
    options: [
      { id: 'a', text: 'array(col1, col2, col3) — combines row values across columns into a single ArrayType column', isCorrect: true },
      { id: 'b', text: 'collect_list(col1, col2, col3) — aggregates values across multiple grouped rows into a list', isCorrect: false },
      { id: 'c', text: 'concat(col1, col2, col3) — joins string or existing array values together into a merged string', isCorrect: false },
      { id: 'd', text: 'struct(col1, col2, col3) — packages multiple columns into a named StructType record object', isCorrect: false },
    ],
    explanation: 'array() constructs an ArrayType column from scalar column arguments. collect_list() is a row aggregation function, struct() creates named fields, and concat() concatenates existing arrays or strings.',
    tags: ['collection', 'array', 'create', 'functions'],
    concepts: ['ps-collection-fns', 'ps-dataframe-create'],
  },

  // ARRAY_SORT
  {
    id: 'collection-5',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.COLLECTION_FUNCTIONS,
    question: 'Given a DataFrame containing an array column "scores" with unsorted numeric values, which PySpark function sorts array elements in ascending order within each row?',
    options: [
      { id: 'a', text: 'sort_array(scores) — this function does not support ascending element sorting in PySpark SQL', isCorrect: false },
      { id: 'b', text: 'array_sort(scores) — sorts all elements within each array column in ascending order per row', isCorrect: true },
      { id: 'c', text: 'orderBy("scores") — sorts entire DataFrame rows based on column values rather than array elements', isCorrect: false },
      { id: 'd', text: 'array_order(scores) — this function name is invalid and does not exist in PySpark API', isCorrect: false },
    ],
    explanation: 'array_sort() sorts elements within array values in ascending order. orderBy() reorders DataFrame rows.',
    tags: ['collection', 'array_sort', 'array', 'functions'],
    concepts: ['ps-collection-fns'],
  },

  // SIZE
  {
    id: 'collection-6',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.COLLECTION_FUNCTIONS,
    question: 'Which PySpark function returns the element count of an ArrayType or key-value count of a MapType column?',
    options: [
      { id: 'a', text: 'length() — computes character count of StringType columns, not array or map collections', isCorrect: false },
      { id: 'b', text: 'count() — evaluates row-level aggregation counts in groupBy operations rather than collection size', isCorrect: false },
      { id: 'c', text: 'size() — returns the total number of elements in an array or key-value entries in a map', isCorrect: true },
      { id: 'd', text: 'len() — native Python built-in function that cannot be evaluated on PySpark Column objects', isCorrect: false },
    ],
    explanation: 'size() returns element counts for arrays and maps. length() evaluates string character length.',
    tags: ['collection', 'size', 'array', 'functions'],
    concepts: ['ps-collection-fns'],
  },

  // CONCAT (arrays)
  {
    id: 'collection-7',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.COLLECTION_FUNCTIONS,
    question: 'You have two ArrayType columns "arr1" and "arr2". Which PySpark function combines them into a single merged array preserving duplicates?',
    options: [
      { id: 'a', text: 'array_union(arr1, arr2) — merges array elements while deduplicating duplicate entries', isCorrect: false },
      { id: 'b', text: 'flatten(array(arr1, arr2)) — constructs a nested array and flattens it with unnecessary overhead', isCorrect: false },
      { id: 'c', text: 'arr1 + arr2 — Python addition operator is invalid on PySpark Column objects', isCorrect: false },
      { id: 'd', text: 'concat(arr1, arr2) — concatenates elements of multiple array columns into one array', isCorrect: true },
    ],
    explanation: 'concat() merges multiple array columns into one single array, preserving element order and duplicate entries. array_union() deduplicates elements.',
    tags: ['collection', 'concat', 'array', 'functions'],
    concepts: ['ps-collection-fns', 'ps-string-fns'],
  },

  // FLATTEN
  {
    id: 'collection-8',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.COLLECTION_FUNCTIONS,
    question: 'Given column "nested" containing nested arrays (ArrayType of ArrayType), which PySpark function flattens it into a single 1D array column?',
    options: [
      { id: 'a', text: 'flatten(nested) — converts a nested array of arrays into a single flattened array column', isCorrect: true },
      { id: 'b', text: 'explode(nested) — generates separate DataFrame rows per inner array rather than a single flat array', isCorrect: false },
      { id: 'c', text: 'concat(nested) — joins array strings together but does not flatten nested array structures', isCorrect: false },
      { id: 'd', text: 'array_flatten(nested) — non-existent PySpark function name that raises an AttributeError', isCorrect: false },
    ],
    explanation: 'flatten() converts nested arrays [[1,2],[3,4]] into a single array [1,2,3,4]. explode() creates separate rows per inner element.',
    tags: ['collection', 'flatten', 'array', 'nested', 'functions'],
    concepts: ['ps-collection-fns'],
  },

  // STRUCT
  {
    id: 'collection-9',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.COLLECTION_FUNCTIONS,
    question: 'What key structural difference separates array() from struct() in PySpark column definitions?',
    options: [
      { id: 'a', text: 'Both functions are completely interchangeable aliases for creating complex nested columns.', isCorrect: false },
      { id: 'b', text: 'array() creates homogeneous lists of uniform types; struct() creates named records with mixed field types.', isCorrect: true },
      { id: 'c', text: 'struct() is reserved for Spark SQL queries, whereas array() can only be called in PySpark Python APIs.', isCorrect: false },
      { id: 'd', text: 'array() supports nested collection structures, whereas struct() restricts fields to scalar types.', isCorrect: false },
    ],
    explanation: 'ArrayType contains homogeneous elements of the same data type. StructType represents named key-value fields with distinct data types per field.',
    tags: ['collection', 'struct', 'array', 'comparison', 'functions'],
    concepts: ['ps-collection-fns'],
  },

  // ===== MATH FUNCTIONS (10 questions) =====

  {
    id: 'math-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.MATH_FUNCTIONS,
    language: CodeLanguage.PYTHON,
    question: 'Write a PySpark statement to add a column "price_rounded" to DataFrame "df" (which has column "price"), rounding numeric values to 2 decimal places.',
    starterCode: `# Round price to 2 decimal places\nresult = `,
    testCases: [
      {
        input: 'df with price column',
        expectedOutput: 'round(df.price, 2)',
        description: 'Should round to 2 decimal places',
      },
    ],
    solution: `from pyspark.sql.functions import round

result = df.withColumn("price_rounded", round(df.price, 2))
# OR
from pyspark.sql.functions import round, col

result = df.withColumn("price_rounded", round(col("price"), 2))
# OR
from pyspark.sql.functions import round

result = df.withColumn("price_rounded", round("price", 2))`,
    explanation: 'round(column, scale) rounds numeric values to the specified decimal places.',
    tieredHints: {
      apiSignature: 'round(col: Column | str, scale: int = 0) -> Column',
      skeleton: `from pyspark.sql.functions import round

result = ____.withColumn("price_rounded", ____(df.price, ____))`,
    },
    hints: ['Use round() function', 'Second parameter is number of decimal places'],
    tags: ['math', 'round', 'functions'],
    concepts: ['ps-math-fns'],
  },

  {
    id: 'math-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.MATH_FUNCTIONS,
    language: CodeLanguage.PYTHON,
    question: 'Write a PySpark statement to add a column "score_ceil" to DataFrame "df" (which has column "score"), rounding values up to the nearest integer.',
    starterCode: `# Round score up to ceiling integer\nresult = `,
    testCases: [
      {
        input: 'df with score column',
        expectedOutput: 'ceil(df.score)',
        description: 'Should round up to nearest integer',
      },
    ],
    solution: `from pyspark.sql.functions import ceil

result = df.withColumn("score_ceil", ceil(df.score))
# OR
from pyspark.sql.functions import ceil, col

result = df.withColumn("score_ceil", ceil(col("score")))
# OR
from pyspark.sql.functions import ceil

result = df.withColumn("score_ceil", ceil("score"))`,
    explanation: 'ceil(column) rounds numeric values up to the nearest integer.',
    tieredHints: {
      apiSignature: 'ceil(col: Column | str) -> Column',
      skeleton: `from pyspark.sql.functions import ceil

result = ____.____("score_ceil", ____(df.____))`,
    },
    hints: ['Use ceil() function'],
    tags: ['math', 'ceil', 'functions'],
    concepts: ['ps-math-fns'],
  },

  {
    id: 'math-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.MATH_FUNCTIONS,
    language: CodeLanguage.PYTHON,
    question: 'Write a PySpark statement to add a column "abs_balance" to DataFrame "df" (which has column "balance"), computing absolute values.',
    starterCode: `# Compute absolute value of balance\nresult = `,
    testCases: [
      {
        input: 'df with balance column',
        expectedOutput: 'abs(df.balance)',
        description: 'Should get absolute value',
      },
    ],
    solution: `from pyspark.sql.functions import abs

result = df.withColumn("abs_balance", abs(df.balance))
# OR
from pyspark.sql.functions import abs, col

result = df.withColumn("abs_balance", abs(col("balance")))
# OR
from pyspark.sql.functions import abs

result = df.withColumn("abs_balance", abs("balance"))`,
    explanation: 'abs(column) computes non-negative absolute values.',
    tieredHints: {
      apiSignature: 'abs(col: Column | str) -> Column',
      skeleton: `from pyspark.sql.functions import abs

result = ____.____("abs_balance", ____(df.____))`,
    },
    hints: ['Use abs() function'],
    tags: ['math', 'abs', 'functions'],
    concepts: ['ps-math-fns'],
  },

  {
    id: 'math-4',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.MATH_FUNCTIONS,
    language: CodeLanguage.PYTHON,
    question: 'Write a PySpark statement to add a column "side_length" to DataFrame "df" (which has column "area"), computing square root values.',
    starterCode: `# Calculate square root of area\nresult = `,
    testCases: [
      {
        input: 'df with area column',
        expectedOutput: 'sqrt(df.area)',
        description: 'Should calculate square root',
      },
    ],
    solution: `from pyspark.sql.functions import sqrt

result = df.withColumn("side_length", sqrt(df.area))
# OR
from pyspark.sql.functions import sqrt, col

result = df.withColumn("side_length", sqrt(col("area")))
# OR
from pyspark.sql.functions import sqrt

result = df.withColumn("side_length", sqrt("area"))`,
    explanation: 'sqrt(column) calculates the square root of numeric column values.',
    tieredHints: {
      apiSignature: 'sqrt(col: Column | str) -> Column',
      skeleton: `from pyspark.sql.functions import sqrt

result = ____.____("side_length", ____(df.____))`,
    },
    hints: ['Use sqrt() function'],
    tags: ['math', 'sqrt', 'functions'],
    concepts: ['ps-math-fns'],
  },

  {
    id: 'math-5',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.MATH_FUNCTIONS,
    language: CodeLanguage.PYTHON,
    question: 'Write a PySpark statement to add a column "result" to DataFrame "df" (which has column "exponent"), computing 2 raised to the power of exponent.',
    starterCode: `# Compute 2 raised to exponent\nresult = `,
    testCases: [
      {
        input: 'df with exponent column',
        expectedOutput: 'pow(lit(2), df.exponent)',
        description: 'Should calculate 2 to the power of exponent',
      },
    ],
    solution: `from pyspark.sql.functions import pow, lit

result = df.withColumn("result", pow(lit(2), df.exponent))
# OR
from pyspark.sql.functions import pow, lit, col

result = df.withColumn("result", pow(lit(2), col("exponent")))
# OR
from pyspark.sql.functions import pow, lit

result = df.withColumn("result", pow(lit(2), "exponent"))`,
    explanation: 'pow(base, exp) raises base value to exp power. Use lit(2) to supply constant base.',
    tieredHints: {
      apiSignature: 'pow(col1: Column | str | float, col2: Column | str | float) -> Column',
      skeleton: `from pyspark.sql.functions import pow, lit

result = ____.withColumn("result", ____(____(2), df.____))`,
    },
    hints: ['Use pow() function', 'Use lit(2) for the base'],
    tags: ['math', 'pow', 'functions'],
    concepts: ['ps-math-fns'],
  },

  {
    id: 'math-6',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.MATH_FUNCTIONS,
    language: CodeLanguage.PYTHON,
    question: 'Write a PySpark statement to add a column "max_price" to DataFrame "df" (columns: price1, price2), evaluating row-wise maximum values.',
    starterCode: `# Compute row-wise max of price1 and price2\nresult = `,
    testCases: [
      {
        input: 'df with price1 and price2 columns',
        expectedOutput: 'greatest(df.price1, df.price2)',
        description: 'Should get maximum value per row',
      },
    ],
    solution: `from pyspark.sql.functions import greatest

result = df.withColumn("max_price", greatest(df.price1, df.price2))
# OR
from pyspark.sql.functions import greatest, col

result = df.withColumn("max_price", greatest(col("price1"), col("price2")))
# OR
from pyspark.sql.functions import greatest

result = df.withColumn("max_price", greatest("price1", "price2"))`,
    explanation: 'greatest(*cols) evaluates the row-wise maximum across multiple column values.',
    tieredHints: {
      apiSignature: 'greatest(*cols: Column | str) -> Column',
      skeleton: `from pyspark.sql.functions import greatest

result = ____.withColumn("max_price", ____(df.price1, df.____))`,
    },
    hints: ['Use greatest() function', 'Can compare multiple columns'],
    tags: ['math', 'greatest', 'functions'],
    concepts: ['ps-math-fns'],
  },

  // ===== WINDOW FUNCTIONS (15 questions) =====

  {
    id: 'window-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.WINDOW_FUNCTIONS,
    language: CodeLanguage.PYTHON,
    question: 'Given a DataFrame "df" with columns "id", "emp_name", "department", and "salary", assign a sequential integer ranking to each employee within their department, ordered from highest to lowest salary. Save the ranking in a new column named "row_num".',
    starterCode: ``,
    testCases: [
      {
        input: 'df with department and salary',
        expectedOutput: 'row_number().over(windowSpec)',
        description: 'Should add row number within each department',
      },
    ],
    solution: `from pyspark.sql.window import Window\nfrom pyspark.sql.functions import row_number, col\n\nwindowSpec = Window.partitionBy("department").orderBy(col("salary").desc())\nresult = df.withColumn("row_num", row_number().over(windowSpec))\n# OR\nfrom pyspark.sql.window import Window\nfrom pyspark.sql.functions import row_number, desc\n\nwindowSpec = Window.partitionBy("department").orderBy(desc("salary"))\nresult = df.withColumn("row_num", row_number().over(windowSpec))`,
    explanation: 'row_number() assigns a sequential number to rows within each partition. Unlike rank(), it always has unique numbers even for tied values.',
    tieredHints: {
      apiSignature: 'row_number() -> Column',
      skeleton: `from pyspark.sql.window import Window
from pyspark.sql.functions import row_number, col

ws = ____.____("department").____(col("____").____())
result = ____.____("____", ____().over(____))`,
    },
    hints: ['Use row_number().over(windowSpec)', 'Create windowSpec with partitionBy and orderBy'],
    tags: ['window', 'row_number', 'functions'],
    concepts: ['sql-window-ranking'],
  },

  {
    id: 'window-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.WINDOW_FUNCTIONS,
    language: CodeLanguage.PYTHON,
    question: 'Given a DataFrame "df" with columns "id", "emp_name", "department", and "salary", rank employees by salary in descending order within each department such that tied salaries receive identical ranks and subsequent ranks are consecutive without gaps. Store the result in a new column named "dense_rank".',
    starterCode: ``,
    testCases: [
      {
        input: 'df with department and salary',
        expectedOutput: 'dense_rank().over(windowSpec)',
        description: 'Should add dense rank within department',
      },
    ],
    solution: `from pyspark.sql.window import Window\nfrom pyspark.sql.functions import dense_rank, desc\n\nwindowSpec = Window.partitionBy("department").orderBy(desc("salary"))\nresult = df.withColumn("dense_rank", dense_rank().over(windowSpec))\n# OR\nfrom pyspark.sql.window import Window\nfrom pyspark.sql.functions import dense_rank, col\n\nwindowSpec = Window.partitionBy("department").orderBy(col("salary").desc())\nresult = df.withColumn("dense_rank", dense_rank().over(windowSpec))`,
    explanation: 'dense_rank() is like rank() but without gaps. If two rows tie for rank 1, the next rank is 2 (not 3).',
    tieredHints: {
      apiSignature: 'dense_rank() -> Column',
      skeleton: `from pyspark.sql.window import Window
from pyspark.sql.functions import dense_rank, desc

ws = ____.____("department").____(desc("____"))
result = ____.____("____", ____().over(____))`,
    },
    hints: ['Use dense_rank().over()', 'No gaps in ranking unlike rank()'],
    tags: ['window', 'dense_rank', 'functions'],
    concepts: ['sql-window-ranking'],
  },

  {
    id: 'window-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.WINDOW_FUNCTIONS,
    language: CodeLanguage.PYTHON,
    question: 'Given a DataFrame "df" with columns "employee_id", "salary", and "sale_date", retrieve each employee\'s preceding salary value when ordered chronologically by "sale_date". Store the result in a new column named "previous_salary".',
    starterCode: ``,
    testCases: [
      {
        input: 'df with sale_date and salary',
        expectedOutput: 'lag(df.salary, 1).over(windowSpec)',
        description: 'Should get previous row salary',
      },
    ],
    solution: `from pyspark.sql.window import Window\nfrom pyspark.sql.functions import lag\n\nwindowSpec = Window.orderBy("sale_date")\nresult = df.withColumn("previous_salary", lag(df.salary, 1).over(windowSpec))\n# OR\nfrom pyspark.sql.window import Window\nfrom pyspark.sql.functions import lag, col\n\nwindowSpec = Window.orderBy(col("sale_date"))\nresult = df.withColumn("previous_salary", lag(col("salary"), 1).over(windowSpec))`,
    explanation: 'lag(column, offset) retrieves the value from a previous row. offset=1 means previous row, offset=2 means 2 rows back.',
    tieredHints: {
      apiSignature: 'lag(col: Column | str, count: int = 1, default: Any = None) -> Column',
      skeleton: `from pyspark.sql.window import Window
from pyspark.sql.functions import lag

ws = ____.____("sale_date")
result = ____.____("____", ____(df.____, ____).over(____))`,
    },
    hints: ['Use lag(column, offset).over()', 'offset=1 for previous row'],
    tags: ['window', 'lag', 'functions'],
    concepts: ['sql-window-ranking', 'sql-window-offset'],
  },

  {
    id: 'window-4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.WINDOW_FUNCTIONS,
    question: 'The lag() function retrieves values from preceding rows. Which function performs the opposite operation by looking forward to succeeding rows?',
    options: [
      { id: 'a', text: 'next(column) — built-in function that fetches the subsequent row value', isCorrect: false },
      { id: 'b', text: 'lead(column, offset) — looks forward by offset rows; returns NULL at end', isCorrect: true },
      { id: 'c', text: 'lag(column, -1) — accepts negative offset values to navigate forward in rows', isCorrect: false },
      { id: 'd', text: 'first(column) — extracts the first available value within the window partition', isCorrect: false },
    ],
    explanation: 'lead(column, offset) is the counterpart to lag(). lead looks forward, lag looks backward. Both return NULL at the boundary (lead at the last row, lag at the first row). Both require .over(windowSpec) with an ORDER BY.',
    tags: ['window', 'lead', 'lag', 'functions'],
    concepts: ['sql-window-ranking', 'sql-window-offset'],
  },

  {
    id: 'window-5',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.WINDOW_FUNCTIONS,
    question: 'To calculate an explicit running total (cumulative sum) in PySpark across ordered rows, which window frame specification should you configure?',
    options: [
      { id: 'a', text: 'rowsBetween(Window.unboundedPreceding, Window.currentRow) — sums from start to current row', isCorrect: true },
      { id: 'b', text: 'rowsBetween(Window.currentRow, Window.unboundedFollowing) — sums from current row to last row', isCorrect: false },
      { id: 'c', text: 'rangeBetween(-1, 0) — accumulates values exclusively across the immediate previous and current rows', isCorrect: false },
      { id: 'd', text: 'No frame required — sum().over() automatically calculates a running total without any order specification', isCorrect: false },
    ],
    explanation: 'rowsBetween(unboundedPreceding, currentRow) means "from the very first row in the partition up to the current row". This accumulates the sum row by row. Note: with ORDER BY present, this is actually the default frame — but being explicit is clearer and avoids confusion with RANGE vs ROWS behavior.',
    tags: ['window', 'sum', 'running-total', 'frame', 'functions'],
    concepts: ['sql-window-ranking', 'ps-aggregate-fns', 'sql-window-frame'],
  },

  {
    id: 'window-6',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.WINDOW_FUNCTIONS,
    question: 'You need to divide employees into 4 equal groups (quartiles) based on salary. Which window function should you use?',
    options: [
      { id: 'a', text: 'percent_rank() — calculates relative percentage ranks from 0.0 to 1.0 rather than integer buckets', isCorrect: false },
      { id: 'b', text: 'rank() — assigns ordinal ranking numbers with gaps for ties rather than balanced size groups', isCorrect: false },
      { id: 'c', text: 'dense_rank() — assigns consecutive ordinal ranking numbers without gaps for tied values', isCorrect: false },
      { id: 'd', text: 'ntile(4) — distributes rows into approximately equal numbered bucket groups across partitions', isCorrect: true },
    ],
    explanation: 'ntile(n) divides rows into n approximately equal buckets numbered 1 to n. Unlike rank()/dense_rank() which assign sequential positions, ntile guarantees roughly equal group sizes. percent_rank() returns a relative position (0.0 to 1.0), not a group number.',
    tags: ['window', 'ntile', 'percentile', 'functions'],
    concepts: ['sql-window-ranking', 'ps-aggregate-fns'],
  },

  // ===== DELTA LAKE BASICS (20 questions) =====

  {
    id: 'delta-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DELTA_LAKE_BASICS,
    language: CodeLanguage.PYTHON,
    question: `Write a PySpark statement to read an ACID-compliant Delta Lake table from storage path "/data/sales_delta" into DataFrame "df".

Source Table Schema:
\`\`\`text
+-------------+-----------+----------+
| col_name    | data_type | comment  |
+-------------+-----------+----------+
| order_id    | string    | primary  |
| amount      | double    | usd      |
| txn_date    | date      | partition|
+-------------+-----------+----------+
\`\`\``,
    starterCode: `# Read Delta table from path\ndf = `,
    testCases: [
      {
        input: 'Delta table at /data/sales_delta',
        expectedOutput: 'spark.read.format("delta").load("/data/sales_delta")',
        description: 'Should read Delta table',
      },
    ],
    solution: `df = spark.read.format("delta").load("/data/sales_delta")
# OR
df = spark.read.load("/data/sales_delta", format="delta")`,
    explanation: 'Delta Lake tables are read using format("delta") with load(path). Delta Lake stores data in Parquet files alongside a JSON transaction log (_delta_log/), providing ACID transactions, time travel, and schema enforcement.',
    tieredHints: {
      apiSignature: 'DataFrameReader.format(source: str).load(path: str = None) -> DataFrame',
      skeleton: `df = spark.____.format("____").____("/data/sales_delta")`,
    },
    hints: ['Use format("delta")', 'Use load() with the storage path'],
    tags: ['delta', 'read', 'delta-lake'],
    concepts: ['delta-acid', 'ps-io-csv'],
  },

  {
    id: 'delta-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DELTA_LAKE_BASICS,
    language: CodeLanguage.PYTHON,
    question: `Write a PySpark statement to write DataFrame "df" to a Delta Lake table at storage path "/data/customers_delta", overwriting any existing table contents.`,
    starterCode: `# Write DataFrame as Delta table with overwrite\n`,
    testCases: [
      {
        input: 'df to write as Delta',
        expectedOutput: 'df.write.format("delta").mode("overwrite").save("/data/customers_delta")',
        description: 'Should write Delta table with overwrite mode',
      },
    ],
    solution: `df.write.format("delta").mode("overwrite").save("/data/customers_delta")
# OR
df.write.mode("overwrite").format("delta").save("/data/customers_delta")`,
    explanation: 'Delta tables are written using format("delta"). Specifying mode("overwrite") atomically replaces the existing table data and logs a new commit version in the Delta transaction log without requiring manual file deletion.',
    tieredHints: {
      apiSignature: 'DataFrameWriter.format(source: str).mode(saveMode: str).save(path: str = None)',
      skeleton: `df.____.format("____").mode("____").save("/data/customers_delta")`,
    },
    hints: ['Use format("delta")', 'Use mode("overwrite")', 'Use save() with the target path'],
    tags: ['delta', 'write', 'delta-lake'],
    concepts: ['delta-acid', 'ps-write-modes'],
  },

  {
    id: 'delta-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DELTA_OPERATIONS,
    language: CodeLanguage.SQL,
    question: `Write a SQL statement to modify rows in Delta table "employees", setting the "price" column to 100 for all records where "department" is 'Sales'.`,
    starterCode: `-- Update price for Sales department\n`,
    testCases: [
      {
        input: 'employees Delta table',
        expectedOutput: 'UPDATE employees SET price = 100 WHERE department = "Sales"',
        description: 'Should update price for Sales department',
      },
    ],
    solution: `UPDATE employees SET price = 100 WHERE department = 'Sales'
-- OR
UPDATE employees SET price = 100 WHERE department = "Sales"`,
    explanation: 'Delta Lake natively supports UPDATE operations with WHERE predicates. Behind the scenes, Delta performs copy-on-write or merge-on-read, generating new Parquet files containing updated values and updating the transaction log atomically.',
    tieredHints: {
      apiSignature: 'UPDATE table_name SET col = val WHERE condition',
      skeleton: `____ employees ____ price = 100 ____ department = 'Sales'`,
    },
    hints: ['Use UPDATE table_name SET column = value', 'Include WHERE department = \'Sales\''],
    tags: ['delta', 'update', 'delta-lake', 'sql'],
    concepts: ['delta-acid', 'delta-merge'],
  },

  {
    id: 'delta-4',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DELTA_OPERATIONS,
    language: CodeLanguage.SQL,
    question: `Write a SQL statement to remove all records from Delta table "products" where the "stock" column value is 0.`,
    starterCode: `-- Delete out-of-stock products\n`,
    testCases: [
      {
        input: 'products Delta table',
        expectedOutput: 'DELETE FROM products WHERE stock = 0',
        description: 'Should delete rows with stock = 0',
      },
    ],
    solution: `DELETE FROM products WHERE stock = 0`,
    explanation: 'Delta Lake supports DELETE FROM with WHERE predicates. Deleted files are tombstoned in the transaction log rather than physically removed immediately, enabling historical time travel queries until VACUUM is executed.',
    tieredHints: {
      apiSignature: 'DELETE FROM table_name WHERE condition',
      skeleton: `____ ____ products ____ stock = 0`,
    },
    hints: ['Use DELETE FROM table_name WHERE condition'],
    tags: ['delta', 'delete', 'delta-lake', 'sql'],
    concepts: ['delta-acid', 'delta-merge'],
  },

  {
    id: 'delta-5',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DELTA_OPERATIONS,
    language: CodeLanguage.SQL,
    question: `Write a SQL MERGE statement to upsert records from source table "updates" into target Delta table "customers" matching on "id" (both tables have columns: id, name, email, city). Update all columns when matched, and insert all columns when unmatched.

Table Schemas & Operational Flow:
\`\`\`text
Target: customers (id, name, email, city)
Source: updates   (id, name, email, city)

Match condition: customers.id = updates.id
Action when matched:   UPDATE SET *
Action when unmatched: INSERT *
\`\`\``,
    starterCode: `-- MERGE updates into customers\nMERGE INTO customers\nUSING updates\nON customers.id = updates.id\n`,
    testCases: [
      {
        input: 'customers table and updates table',
        expectedOutput: 'WHEN MATCHED THEN UPDATE SET * WHEN NOT MATCHED THEN INSERT *',
        description: 'Should merge with update and insert',
      },
    ],
    solution: `MERGE INTO customers
USING updates
ON customers.id = updates.id
WHEN MATCHED THEN UPDATE SET *
WHEN NOT MATCHED THEN INSERT *
-- OR
MERGE INTO customers AS c
USING updates AS u
ON c.id = u.id
WHEN MATCHED THEN UPDATE SET *
WHEN NOT MATCHED THEN INSERT *`,
    explanation: 'MERGE INTO performs atomic UPSERT operations. WHEN MATCHED THEN UPDATE SET * updates all matching columns, while WHEN NOT MATCHED THEN INSERT * inserts new rows, ensuring no duplicate keys are created.',
    tieredHints: {
      apiSignature: 'MERGE INTO target USING source ON predicate WHEN MATCHED THEN UPDATE SET * WHEN NOT MATCHED THEN INSERT *',
      skeleton: `MERGE INTO ____
USING ____
ON customers.id = updates.id
WHEN ____ THEN UPDATE SET *
WHEN ____ THEN INSERT *`,
    },
    hints: ['Use WHEN MATCHED THEN UPDATE SET *', 'Use WHEN NOT MATCHED THEN INSERT *'],
    tags: ['delta', 'merge', 'upsert', 'delta-lake', 'sql'],
    concepts: ['delta-acid', 'delta-merge'],
  },

  {
    id: 'delta-6',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DELTA_TIME_TRAVEL,
    language: CodeLanguage.PYTHON,
    question: `Write a PySpark statement using time travel to read version 5 of the Delta table located at "/data/sales_delta" into DataFrame "df".`,
    starterCode: `# Read version 5 of Delta table\ndf = `,
    testCases: [
      {
        input: 'Delta table path',
        expectedOutput: 'option("versionAsOf", 5).load(path)',
        description: 'Should read version 5',
      },
    ],
    solution: `df = spark.read.format("delta").option("versionAsOf", 5).load("/data/sales_delta")
# OR
df = spark.read.option("versionAsOf", 5).format("delta").load("/data/sales_delta")`,
    explanation: 'Delta Lake time travel enables querying specific commit versions using option("versionAsOf", version_int) or timestamps using option("timestampAsOf", timestamp_str).',
    tieredHints: {
      apiSignature: 'DataFrameReader.option(key: str, value: Any).load(path: str = None) -> DataFrame',
      skeleton: `df = spark.read.____("delta").____("versionAsOf", ____).____("/data/sales_delta")`,
    },
    hints: ['Use format("delta")', 'Use option("versionAsOf", 5)'],
    tags: ['delta', 'time-travel', 'delta-lake', 'versioning'],
    concepts: ['delta-acid', 'delta-time-travel'],
  },

  {
    id: 'delta-7',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DELTA_TIME_TRAVEL,
    language: CodeLanguage.SQL,
    question: `Write a SQL query to select all records from Delta table "customers" as it existed at commit version 10.`,
    starterCode: `-- Time travel query for version 10\n`,
    testCases: [
      {
        input: 'customers Delta table',
        expectedOutput: 'SELECT * FROM customers VERSION AS OF 10',
        description: 'Should query version 10',
      },
    ],
    solution: `SELECT * FROM customers VERSION AS OF 10
-- OR
SELECT * FROM customers@v10`,
    explanation: 'In Databricks SQL, you can time travel to previous table states using "VERSION AS OF version_number" or table@v<version_number> syntax.',
    tieredHints: {
      apiSignature: 'SELECT cols FROM table VERSION AS OF version',
      skeleton: `SELECT * FROM ____ VERSION ____ ____ 10`,
    },
    hints: ['Use VERSION AS OF 10', 'Alternative syntax uses @v10'],
    tags: ['delta', 'time-travel', 'delta-lake', 'sql'],
    concepts: ['delta-acid', 'delta-time-travel'],
  },

  {
    id: 'delta-8',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DELTA_OPTIMIZATION,
    language: CodeLanguage.SQL,
    question: `Frequent small inserts into Delta table "transactions" have created thousands of small Parquet files. Write a SQL command to compact these small files into larger target files to improve read performance.`,
    starterCode: `-- Compact small files\n`,
    testCases: [
      {
        input: 'transactions Delta table',
        expectedOutput: 'OPTIMIZE transactions',
        description: 'Should optimize table',
      },
    ],
    solution: `OPTIMIZE transactions`,
    explanation: 'OPTIMIZE merges small Parquet files into larger ~1GB files (bin-packing). This solves the small file problem and significantly reduces metadata scanning overhead during query execution.',
    tieredHints: {
      apiSignature: 'OPTIMIZE table_name',
      skeleton: `-- ____ table\n____ ____`,
    },
    hints: ['Use OPTIMIZE table_name'],
    tags: ['delta', 'optimize', 'delta-lake', 'performance'],
    concepts: ['delta-acid', 'delta-optimize', 'ps-cache-persist'],
  },

  {
    id: 'delta-9',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DELTA_OPTIMIZATION,
    language: CodeLanguage.SQL,
    question: `Write a SQL command to optimize Delta table "events" and apply multi-dimensional clustering on columns "user_id" and "timestamp" to maximize file skipping efficiency during filtering queries.`,
    starterCode: `-- Optimize table with multi-dimensional clustering\n`,
    testCases: [
      {
        input: 'events Delta table',
        expectedOutput: 'OPTIMIZE events ZORDER BY (user_id, timestamp)',
        description: 'Should optimize with ZORDER',
      },
    ],
    solution: `OPTIMIZE events ZORDER BY (user_id, timestamp)
-- OR
OPTIMIZE events ZORDER BY user_id, timestamp`,
    explanation: 'ZORDER BY co-locates related data along specified columns within the same files. When combined with file statistics, it enables Spark to skip entire files based on min/max stats for user_id and timestamp filters.',
    tieredHints: {
      apiSignature: 'OPTIMIZE table_name ZORDER BY (col1, col2, ...)',
      skeleton: `____ events ____ ____ (user_id, ____)`,
    },
    hints: ['Use OPTIMIZE table_name ZORDER BY (col1, col2)'],
    tags: ['delta', 'optimize', 'zorder', 'delta-lake', 'performance'],
    concepts: ['delta-acid', 'delta-optimize', 'delta-zorder', 'ps-cache-persist'],
  },

  // ===== SQL JOINS (20 questions) =====

  {
    id: 'sql-join-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.SQL_JOINS,
    language: CodeLanguage.SQL,
    question: 'Using the "employees" table (columns: emp_id, emp_name, department_id, salary) and the "departments" table (columns: id, dept_name), write an INNER JOIN query matching employees.department_id to departments.id to return matching records.',
    starterCode: `-- INNER JOIN employees with departments\n`,
    testCases: [
      {
        input: 'employees and departments tables',
        expectedOutput: 'SELECT * FROM employees INNER JOIN departments ON employees.department_id = departments.id',
        description: 'Should perform inner join',
      },
    ],
    solution: `SELECT * FROM employees e
INNER JOIN departments d
ON e.department_id = d.id
-- OR
SELECT * FROM employees
INNER JOIN departments
ON employees.department_id = departments.id`,
    explanation: 'INNER JOIN returns matching records where the join key matches in both tables.',
    tieredHints: {
      apiSignature: 'SELECT cols FROM table1 INNER JOIN table2 ON table1.fk = table2.pk',
      skeleton: `SELECT * FROM employees e
____ JOIN departments d
____ e.department_id ____ d.id`,
    },
    hints: ['Use SELECT * FROM employees INNER JOIN departments', 'The ON clause matches employees.department_id to departments.id'],
    tags: ['sql', 'join', 'inner-join'],
    concepts: ['sql-joins-inner-outer'],
  },

  {
    id: 'sql-join-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.SQL_JOINS,
    language: CodeLanguage.SQL,
    question: 'Using the "orders" table (columns: order_id, customer_id, amount) and the "customers" table (columns: id, customer_name, email), write a LEFT JOIN query matching orders.customer_id to customers.id that retains all orders.',
    starterCode: `-- LEFT JOIN orders with customers\n`,
    testCases: [
      {
        input: 'orders and customers tables',
        expectedOutput: 'SELECT * FROM orders LEFT JOIN customers ON orders.customer_id = customers.id',
        description: 'Should perform left join',
      },
    ],
    solution: `SELECT * FROM orders o
LEFT JOIN customers c
ON o.customer_id = c.id
-- OR
SELECT * FROM orders
LEFT JOIN customers
ON orders.customer_id = customers.id`,
    explanation: 'LEFT JOIN retains all rows from the left table (orders) and joins matching right-table (customers) rows.',
    tieredHints: {
      apiSignature: 'SELECT cols FROM table1 LEFT JOIN table2 ON table1.fk = table2.pk',
      skeleton: `SELECT * FROM orders o
____ JOIN customers c
____ o.customer_id ____ c.id`,
    },
    hints: ['Use SELECT * FROM orders LEFT JOIN customers', 'The ON clause matches orders.customer_id to customers.id'],
    tags: ['sql', 'join', 'left-join'],
    concepts: ['sql-joins-inner-outer'],
  },

  {
    id: 'sql-join-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.SQL_JOINS,
    language: CodeLanguage.SQL,
    question: 'Using the "products" table (columns: product_id, product_name, category_id, price) and the "categories" table (columns: id, category_name), write a RIGHT JOIN query matching products.category_id to categories.id that retains all categories.',
    starterCode: `-- RIGHT JOIN products with categories\n`,
    testCases: [
      {
        input: 'products and categories tables',
        expectedOutput: 'SELECT * FROM products RIGHT JOIN categories ON products.category_id = categories.id',
        description: 'Should perform right join',
      },
    ],
    solution: `SELECT * FROM products p
RIGHT JOIN categories c
ON p.category_id = c.id
-- OR
SELECT * FROM products
RIGHT JOIN categories
ON products.category_id = categories.id`,
    explanation: 'RIGHT JOIN retains all records from the right table (categories) regardless of left-table (products) matches.',
    tieredHints: {
      apiSignature: 'SELECT cols FROM table1 RIGHT JOIN table2 ON table1.fk = table2.pk',
      skeleton: `SELECT * FROM products p
____ JOIN categories c
____ p.category_id ____ c.id`,
    },
    hints: ['Use SELECT * FROM products RIGHT JOIN categories', 'The ON clause matches products.category_id to categories.id'],
    tags: ['sql', 'join', 'right-join'],
    concepts: ['sql-joins-inner-outer'],
  },

  {
    id: 'sql-join-4',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.SQL_JOINS,
    language: CodeLanguage.SQL,
    question: 'Using the "users" table (columns: id, username, email) and the "profiles" table (columns: user_id, bio, avatar_url), write a FULL OUTER JOIN query matching users.id to profiles.user_id.',
    starterCode: `-- FULL OUTER JOIN users with profiles\n`,
    testCases: [
      {
        input: 'users and profiles tables',
        expectedOutput: 'SELECT * FROM users FULL OUTER JOIN profiles ON users.id = profiles.user_id',
        description: 'Should perform full outer join',
      },
    ],
    solution: `SELECT * FROM users u
FULL OUTER JOIN profiles p
ON u.id = p.user_id
-- OR
SELECT * FROM users
FULL OUTER JOIN profiles
ON users.id = profiles.user_id`,
    explanation: 'FULL OUTER JOIN combines unmatched and matched records from both tables into a unified result set.',
    tieredHints: {
      apiSignature: 'SELECT cols FROM table1 FULL OUTER JOIN table2 ON table1.pk = table2.fk',
      skeleton: `SELECT * FROM users u
____ ____ JOIN profiles p
____ u.id ____ p.user_id`,
    },
    hints: ['Use SELECT * FROM users FULL OUTER JOIN profiles', 'The ON clause matches users.id to profiles.user_id'],
    tags: ['sql', 'join', 'full-outer-join'],
    concepts: ['sql-joins-inner-outer'],
  },

  {
    id: 'sql-join-5',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.SQL_JOINS,
    language: CodeLanguage.SQL,
    question: 'Using table "employees" (columns: id, emp_name, manager_id), write a self-join query using LEFT JOIN to output employee name "employee" and manager name "manager".',
    starterCode: `-- Self join employees with managers\n`,
    testCases: [
      {
        input: 'employees table with manager_id',
        expectedOutput: 'SELECT e.emp_name, m.emp_name as manager FROM employees e LEFT JOIN employees m ON e.manager_id = m.id',
        description: 'Should perform self join',
      },
    ],
    solution: `SELECT e.emp_name as employee, m.emp_name as manager
FROM employees e
LEFT JOIN employees m
ON e.manager_id = m.id`,
    explanation: 'Self-joins alias a single table twice (e.g. employee e and manager m) to link recursive hierarchical keys.',
    tieredHints: {
      apiSignature: 'SELECT e.name, m.name FROM table e LEFT JOIN table m ON e.manager_id = m.id',
      skeleton: `SELECT e.____ as employee, m.____ as manager
FROM ____ e
____ JOIN ____ m
____ e.____ ____ m.id`,
    },
    hints: ['Use FROM employees e LEFT JOIN employees m', 'The ON clause matches e.manager_id to m.id'],
    tags: ['sql', 'join', 'self-join'],
    concepts: ['sql-joins-inner-outer', 'sql-joins-cross-self'],
  },

  {
    id: 'sql-join-6',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.SQL_JOINS,
    language: CodeLanguage.PYTHON,
    question: 'Write a PySpark statement to perform a left join between DataFrame "orders_df" (columns: order_id, customer_id, amount) and "customers_df" (columns: id, name, email) matching orders_df.customer_id with customers_df.id.',
    starterCode: `# Left join orders_df and customers_df\nresult = `,
    testCases: [
      {
        input: 'orders_df and customers_df',
        expectedOutput: 'orders_df.join(customers_df, orders_df.customer_id == customers_df.id, "left")',
        description: 'Should perform left join',
      },
    ],
    solution: `result = orders_df.join(customers_df, orders_df.customer_id == customers_df.id, "left")
# OR
result = orders_df.join(customers_df, orders_df["customer_id"] == customers_df["id"], "left")`,
    explanation: 'PySpark join() accepts the target DataFrame, join predicate expression (using == operator), and join type string.',
    tieredHints: {
      apiSignature: 'DataFrame.join(other: DataFrame, on: Column | str, how: str = "inner") -> DataFrame',
      skeleton: `result = orders_df.____(customers_df, orders_df.customer_id ____ customers_df.id, "____")`,
    },
    hints: ['The join condition compares columns with == (not =)', 'Pass "left" as the third argument'],
    tags: ['pyspark', 'join', 'left-join', 'dataframe'],
    concepts: ['ps-session-init', 'sql-joins-inner-outer', 'ps-dataframe-create'],
  },

  // ===== ADVANCED GROUPING (15 questions) =====

  {
    id: 'grouping-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.SQL_AGGREGATIONS,
    language: CodeLanguage.SQL,
    question: 'Using the "sales" table (columns: region, product, amount), write a query with GROUP BY ROLLUP on column "region" to calculate total amount per region plus a grand total.',
    starterCode: `-- Write GROUP BY ROLLUP query\n`,
    testCases: [
      {
        input: 'sales table',
        expectedOutput: 'SELECT region, SUM(amount) FROM sales GROUP BY ROLLUP(region)',
        description: 'Should create subtotals with ROLLUP',
      },
    ],
    solution: `SELECT region, SUM(amount) as total_amount
FROM sales
GROUP BY ROLLUP(region)
-- OR
SELECT region, SUM(amount)
FROM sales
GROUP BY ROLLUP(region)`,
    explanation: 'ROLLUP creates subtotals at each level of grouping plus a grand total across all rows.',
    tieredHints: {
      apiSignature: 'GROUP BY ROLLUP(col1, col2, ...)',
      skeleton: `SELECT region, ____(amount) as total_amount
FROM sales
____ BY ____(region)`,
    },
    hints: ['Use GROUP BY ROLLUP(region)', 'Computes regional subtotals and grand total'],
    tags: ['sql', 'groupby', 'rollup', 'aggregation'],
    concepts: ['ps-groupby-agg', 'sql-grouping-rollup'],
  },

  {
    id: 'grouping-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.SQL_AGGREGATIONS,
    language: CodeLanguage.SQL,
    question: 'Using the "sales" table (columns: region, product, amount), write a query with GROUP BY CUBE on "region" and "product" to calculate total amount across all grouping combinations.',
    starterCode: `-- Write GROUP BY CUBE query\n`,
    testCases: [
      {
        input: 'sales table with region and product',
        expectedOutput: 'SELECT region, product, SUM(amount) FROM sales GROUP BY CUBE(region, product)',
        description: 'Should create all combinations with CUBE',
      },
    ],
    solution: `SELECT region, product, SUM(amount) as total_amount
FROM sales
GROUP BY CUBE(region, product)
-- OR
SELECT region, product, SUM(amount)
FROM sales
GROUP BY CUBE(region, product)`,
    explanation: 'CUBE generates subtotals across all 2^N combinations of specified grouping columns.',
    tieredHints: {
      apiSignature: 'GROUP BY CUBE(col1, col2, ...)',
      skeleton: `SELECT region, product, ____(amount) as total_amount
FROM sales
____ BY ____(region, ____)`,
    },
    hints: ['Use GROUP BY CUBE(region, product)', 'Generates all dimension combinations'],
    tags: ['sql', 'groupby', 'cube', 'aggregation'],
    concepts: ['ps-groupby-agg', 'sql-grouping-rollup'],
  },

  {
    id: 'grouping-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.SQL_AGGREGATIONS,
    language: CodeLanguage.SQL,
    question: 'Using the "sales" table (columns: region, product, amount), write a query with GROUPING SETS to compute total amount grouped by (region, product) and by (region) only.',
    starterCode: `-- Write GROUPING SETS query\n`,
    testCases: [
      {
        input: 'sales table',
        expectedOutput: 'SELECT region, product, SUM(amount) FROM sales GROUP BY GROUPING SETS ((region, product), (region))',
        description: 'Should group by specific sets',
      },
    ],
    solution: `SELECT region, product, SUM(amount) as total_amount
FROM sales
GROUP BY GROUPING SETS ((region, product), (region))
-- OR
SELECT region, product, SUM(amount)
FROM sales
GROUP BY GROUPING SETS ((region, product), (region))`,
    explanation: 'GROUPING SETS allows defining custom grouping combinations within a single aggregation query.',
    tieredHints: {
      apiSignature: 'GROUP BY GROUPING SETS ((col1, col2), (col1), ...)',
      skeleton: `SELECT region, product, ____(amount) as total_amount
FROM sales
____ BY ____ ____ ((region, product), (region))`,
    },
    hints: ['Use GROUP BY GROUPING SETS ((region, product), (region))'],
    tags: ['sql', 'groupby', 'grouping-sets', 'aggregation'],
    concepts: ['ps-groupby-agg', 'sql-grouping-rollup'],
  },

  {
    id: 'grouping-4',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.SQL_AGGREGATIONS,
    language: CodeLanguage.SQL,
    question: 'Using the "products" table (columns: id, name, region, category, price), group by region and category and count the number of products in each combination as "count".',
    starterCode: `-- Group by multiple columns\n`,
    testCases: [
      {
        input: 'products table with region and category',
        expectedOutput: 'SELECT region, category, COUNT(*) FROM products GROUP BY region, category',
        description: 'Should group by multiple columns',
      },
    ],
    solution: `SELECT region, category, COUNT(*) as count
FROM products
GROUP BY region, category
-- OR
SELECT region, category, COUNT(*)
FROM products
GROUP BY region, category`,
    explanation: 'Multiple columns in GROUP BY group rows by distinct tuple values.',
    tieredHints: {
      apiSignature: 'SELECT col1, col2, COUNT(*) FROM table GROUP BY col1, col2',
      skeleton: `SELECT region, category, ____(*) as count
FROM products
____ ____ region, ____`,
    },
    hints: ['List multiple columns separated by commas in GROUP BY'],
    tags: ['sql', 'groupby', 'multiple-columns'],
    concepts: ['ps-groupby-agg'],
  },

  {
    id: 'grouping-5',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PYSPARK_TRANSFORMATIONS,
    language: CodeLanguage.PYTHON,
    question: 'Write a PySpark statement to group DataFrame "df" (columns: id, name, department, salary) by column "department" and calculate three aggregate columns: "employee_count" (row count), "avg_salary" (average salary), and "max_salary" (maximum salary).',
    starterCode: `# Group by department and compute multiple aggregations\nresult = `,
    testCases: [
      {
        input: 'df with department and salary',
        expectedOutput: 'count("*").alias("count"), avg("salary").alias("avg_salary"), max("salary").alias("max_salary")',
        description: 'Should calculate multiple aggregations',
      },
    ],
    solution: `from pyspark.sql.functions import count, avg, max

result = df.groupBy("department").agg(
    count("*").alias("employee_count"),
    avg("salary").alias("avg_salary"),
    max("salary").alias("max_salary")
)
# OR
from pyspark.sql.functions import count, avg, max, col

result = df.groupBy("department").agg(
    count(col("*")).alias("employee_count"),
    avg(col("salary")).alias("avg_salary"),
    max(col("salary")).alias("max_salary")
)`,
    explanation: 'agg() accepts multiple aggregate functions in a single call. Use .alias("new_name") to assign custom output column names.',
    tieredHints: {
      apiSignature: 'GroupedData.agg(*exprs: Column | Dict) -> DataFrame',
      skeleton: `from pyspark.sql.functions import count, avg, max

result = df.____("department").____(
    ____("*").alias("employee_count"),
    ____("salary").alias("avg_salary"),
    ____("salary").alias("max_salary")
)`,
    },
    hints: ['Use agg() with count(), avg(), and max()', 'Use .alias() to assign column names'],
    tags: ['pyspark', 'groupby', 'agg', 'multiple-aggregations'],
    concepts: ['ps-session-init', 'ps-groupby-agg', 'ps-aggregate-fns'],
  },

  {
    id: 'grouping-6',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.PYSPARK_TRANSFORMATIONS,
    language: CodeLanguage.PYTHON,
    question: 'Write a PySpark statement to group DataFrame "df" (columns: user_id, product, quantity) by column "user_id" and collect all product values into an array column named "products".',
    starterCode: `# Group by user_id and collect product values into array\nresult = `,
    testCases: [
      {
        input: 'df with user_id and product',
        expectedOutput: 'collect_list("product").alias("products")',
        description: 'Should collect values into array',
      },
    ],
    solution: `from pyspark.sql.functions import collect_list

result = df.groupBy("user_id").agg(
    collect_list("product").alias("products")
)
# OR
from pyspark.sql.functions import collect_list, col

result = df.groupBy("user_id").agg(
    collect_list(col("product")).alias("products")
)`,
    explanation: 'collect_list(column) aggregates grouped values into a Python list array, preserving duplicate occurrences. To deduplicate array values, use collect_set().',
    tieredHints: {
      apiSignature: 'collect_list(col: Column | str) -> Column',
      skeleton: `from pyspark.sql.functions import collect_list

result = df.____("user_id").____(
    ____("product").____("products")
)`,
    },
    hints: ['Use collect_list("product")', 'Chain .alias("products") to name column'],
    tags: ['pyspark', 'groupby', 'collect_list', 'aggregation'],
    concepts: ['ps-session-init', 'ps-groupby-agg', 'ps-aggregate-fns'],
  },

  {
    id: 'grouping-7',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.PYSPARK_TRANSFORMATIONS,
    language: CodeLanguage.PYTHON,
    question: 'Write a PySpark statement to group DataFrame "df" (columns: category, tag, post_id) by column "category" and collect unique tag values into an array column named "unique_tags".',
    starterCode: `# Group by category and collect unique tag values into array\nresult = `,
    testCases: [
      {
        input: 'df with category and tag',
        expectedOutput: 'collect_set("tag").alias("unique_tags")',
        description: 'Should collect unique values',
      },
    ],
    solution: `from pyspark.sql.functions import collect_set

result = df.groupBy("category").agg(
    collect_set("tag").alias("unique_tags")
)
# OR
from pyspark.sql.functions import collect_set, col

result = df.groupBy("category").agg(
    collect_set(col("tag")).alias("unique_tags")
)`,
    explanation: 'collect_set(column) aggregates unique grouped values into a set array, stripping duplicate elements.',
    tieredHints: {
      apiSignature: 'collect_set(col: Column | str) -> Column',
      skeleton: `from pyspark.sql.functions import collect_set

result = df.____("category").____(
    ____("tag").____("unique_tags")
)`,
    },
    hints: ['Use collect_set("tag")', 'Chain .alias("unique_tags") to name column'],
    tags: ['pyspark', 'groupby', 'collect_set', 'aggregation'],
    concepts: ['ps-session-init', 'ps-groupby-agg', 'ps-aggregate-fns'],
  },

  // ===== MORE WINDOW FUNCTIONS (10 questions) =====

  {
    id: 'window-adv-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.SQL_WINDOW_FUNCTIONS,
    language: CodeLanguage.SQL,
    question: 'Given an "employees" table with columns "id", "emp_name", "department", and "salary", write a SQL query to assign a sequential row number to each employee ordered by salary descending within their department. Name the output column "row_num".',
    starterCode: `-- Write window function query\n`,
    testCases: [
      {
        input: 'employees table',
        expectedOutput: 'SELECT *, ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) as row_num FROM employees',
        description: 'Should add row numbers',
      },
    ],
    solution: `SELECT *,\n       ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) as row_num\nFROM employees\n-- OR\nSELECT id, emp_name, department, salary,\n       ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) as row_num\nFROM employees`,
    explanation: 'ROW_NUMBER() assigns sequential numbers within each partition. Always unique, even for ties.',
    tieredHints: {
      apiSignature: 'ROW_NUMBER() OVER (PARTITION BY col1 ORDER BY col2 [ASC|DESC])',
      skeleton: `SELECT *,
       ____() OVER (____ BY ____ ____ BY ____ ____) as ____
FROM ____`,
    },
    hints: ['Use ROW_NUMBER() OVER ()', 'PARTITION BY department', 'ORDER BY salary DESC'],
    tags: ['sql', 'window', 'row_number'],
    concepts: ['sql-window-ranking'],
  },

  {
    id: 'window-adv-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.SQL_WINDOW_FUNCTIONS,
    language: CodeLanguage.SQL,
    question: 'Using the "sales" table (columns: sale_date, amount, region), calculate the running total of amount ordered chronologically by sale_date. Name the calculated column "running_total".',
    starterCode: `-- Calculate running total of amount ordered by sale_date\n`,
    testCases: [
      {
        input: 'sales table with date and amount',
        expectedOutput: 'SELECT *, SUM(amount) OVER (ORDER BY sale_date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) as running_total FROM sales',
        description: 'Should calculate running total',
      },
    ],
    solution: `SELECT *,\n       SUM(amount) OVER (ORDER BY sale_date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) as running_total\nFROM sales\n-- OR\nSELECT *,\n       SUM(amount) OVER (ORDER BY sale_date) as running_total\nFROM sales`,
    explanation: 'A running total accumulates values row by row. ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW tells SQL to sum from the very first row up to the current row. Without this frame clause, SUM() OVER(ORDER BY ...) defaults to RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW, which groups rows with the same ORDER BY value together — ROWS is more predictable for running totals.',
    tieredHints: {
      apiSignature: 'SUM(col) OVER (ORDER BY date_col ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)',
      skeleton: `SELECT *,
       ____(____) OVER (____ BY ____ ____ BETWEEN ____ PRECEDING AND ____ ROW) as ____
FROM ____`,
    },
    hints: ['Use SUM(amount) OVER (...) to create a window aggregation', 'ORDER BY sale_date inside the OVER() to define the row ordering', 'Use ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW to sum from the first row up to the current one'],
    tags: ['sql', 'window', 'running-total', 'sum'],
    concepts: ['sql-window-ranking', 'sql-window-frame', 'ps-aggregate-fns'],
  },

  {
    id: 'window-adv-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.SQL_WINDOW_FUNCTIONS,
    language: CodeLanguage.SQL,
    question: 'Using the "monthly_revenue" table (columns: month, revenue), write a query that returns each row along with the preceding month\'s revenue value. Alias the output column as "prev_month_revenue".',
    starterCode: `-- Return all columns plus the previous month's revenue\n`,
    testCases: [
      {
        input: 'monthly_revenue table',
        expectedOutput: 'SELECT *, LAG(revenue, 1) OVER (ORDER BY month) as prev_month_revenue FROM monthly_revenue',
        description: 'Should get previous month value',
      },
    ],
    solution: `SELECT *,\n       LAG(revenue, 1) OVER (ORDER BY month) as prev_month_revenue\nFROM monthly_revenue\n-- OR\nSELECT month, revenue,\n       LAG(revenue) OVER (ORDER BY month) as prev_month_revenue\nFROM monthly_revenue`,
    explanation: 'LAG(column, offset) retrieves a value from a previous row relative to the current row, based on the ORDER BY in the window. LAG(revenue, 1) gets the revenue from 1 row back. The first row has no predecessor, so it returns NULL. This is commonly used for month-over-month or period-over-period comparisons without needing a self-join.',
    tieredHints: {
      apiSignature: 'LAG(col, offset=1, default=None) OVER (ORDER BY col)',
      skeleton: `SELECT *,
       ____(____, ____) OVER (____ BY ____) as ____
FROM ____`,
    },
    hints: ['Use LAG(revenue, 1) to get the value from 1 row before the current one', 'Add OVER (ORDER BY month) so LAG knows the row ordering', 'The first row will return NULL since there is no previous month'],
    tags: ['sql', 'window', 'lag'],
    concepts: ['sql-window-ranking', 'sql-window-offset'],
  },

  {
    id: 'window-adv-4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.WINDOW_FUNCTIONS,
    question: 'When computing a row-over-row delta using `current_salary - lag(salary)`, what value is returned for the initial row in the partition?',
    options: [
      { id: 'a', text: 'Returns 0 because lag() defaults to 0 when no preceding row exists', isCorrect: false },
      { id: 'b', text: 'Returns NULL because lag() yields NULL, and arithmetic with NULL evaluates to NULL', isCorrect: true },
      { id: 'c', text: 'Throws an exception unless lag() is explicitly wrapped in a coalesce() block', isCorrect: false },
      { id: 'd', text: 'Returns current_salary because lag() mirrors the active row on boundary miss', isCorrect: false },
    ],
    explanation: 'lag() returns NULL when there is no previous row, and any arithmetic with NULL propagates NULL (e.g. 5000 - NULL = NULL). To handle this, use coalesce(lag(...), 0) to default to 0, making the first row\'s diff equal to the salary itself.',
    tags: ['pyspark', 'window', 'lag', 'null', 'calculation'],
    concepts: ['ps-session-init', 'sql-window-ranking', 'sql-window-offset', 'ps-null-handling'],
  },

  {
    id: 'window-adv-5',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.WINDOW_FUNCTIONS,
    question: 'What distinguishes `max("salary")` used within `groupBy()` from `max("salary").over(windowSpec)`?',
    options: [
      { id: 'a', text: 'groupBy collapses rows to one row per group, whereas window max appends the aggregate to every row', isCorrect: true },
      { id: 'b', text: 'Both approaches produce identical row outputs but window functions execute with lower performance overhead', isCorrect: false },
      { id: 'c', text: 'Window functions restrict maximum calculations to numeric columns whereas groupBy supports all data types', isCorrect: false },
      { id: 'd', text: 'groupBy allows multi-column aggregations whereas window functions only support single-column max functions', isCorrect: false },
    ],
    explanation: 'Window aggregations (max, sum, avg with .over()) add the aggregated value as a new column to every row without collapsing them. groupBy().agg() reduces the DataFrame to one row per group. Use window functions when you need both the detail rows and the aggregate.',
    tags: ['pyspark', 'window', 'max', 'groupby', 'aggregation'],
    concepts: ['ps-session-init', 'sql-window-ranking', 'ps-aggregate-fns', 'ps-groupby-agg'],
  },

  // ===== UNITY CATALOG (10 questions) =====

  {
    id: 'catalog-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_PLATFORM,
    question: 'What primary capabilities does Unity Catalog bring to the Databricks Lakehouse platform?',
    options: [
      { id: 'a', text: 'A real-time dashboard rendering engine for publishing interactive SQL web charts.', isCorrect: false },
      { id: 'b', text: 'A cluster provisioning scheduler that manages virtual machine autoscaling policies.', isCorrect: false },
      { id: 'c', text: 'A unified data and AI governance solution providing centralized access control, auditing, and lineage.', isCorrect: true },
      { id: 'd', text: 'A vectorized query compiler written in C++ that speeds up Spark DataFrame operations.', isCorrect: false },
    ],
    explanation: 'Unity Catalog provides centralized access control, auditing, lineage, and data discovery across Databricks workspaces.',
    tags: ['unity-catalog', 'governance', 'databricks'],
    concepts: ['ucat-namespaces', 'ucat-grants', 'dbx-architecture'],
  },

  {
    id: 'catalog-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_PLATFORM,
    question: 'What is the standard three-level namespace hierarchy used to reference tabular objects in Unity Catalog?',
    options: [
      { id: 'a', text: 'workspace.database.table (scoping tables to individual workspace instances)', isCorrect: false },
      { id: 'b', text: 'catalog.schema.table (scoping tables across workspaces within a metastore)', isCorrect: true },
      { id: 'c', text: 'cluster.database.table (scoping tables to specific compute clusters)', isCorrect: false },
      { id: 'd', text: 'server.schema.table (scoping tables to external cloud database instances)', isCorrect: false },
    ],
    explanation: 'Unity Catalog uses a three-level namespace: catalog.schema.table (or catalog.database.table). This provides better organization than the traditional two-level namespace.',
    tags: ['unity-catalog', 'namespace', 'databricks'],
    concepts: ['ucat-namespaces', 'dbx-architecture'],
  },

  {
    id: 'catalog-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_PLATFORM,
    language: CodeLanguage.SQL,
    question: 'Write a SQL query to create a top-level Unity Catalog container named "analytics".',
    starterCode: `-- Create top-level catalog\n`,
    testCases: [
      {
        input: '',
        expectedOutput: 'CREATE CATALOG analytics',
        description: 'Should create catalog',
      },
    ],
    solution: `CREATE CATALOG analytics
# OR
CREATE CATALOG IF NOT EXISTS analytics`,
    explanation: 'Catalogs are the top level of the Unity Catalog namespace. They organize schemas (databases) and tables.',
    tieredHints: {
      apiSignature: 'CREATE CATALOG [IF NOT EXISTS] catalog_name',
      skeleton: `-- ____ catalog\n____ ____ analytics`,
    },
    hints: ['Use CREATE CATALOG catalog_name'],
    tags: ['unity-catalog', 'create', 'catalog'],
    concepts: ['ucat-namespaces', 'ps-dataframe-create'],
  },

  {
    id: 'catalog-4',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_PLATFORM,
    language: CodeLanguage.SQL,
    question: 'Write a SQL query to create a schema named "sales" inside the existing "analytics" catalog.',
    starterCode: `-- Create schema inside analytics catalog\n`,
    testCases: [
      {
        input: 'analytics catalog exists',
        expectedOutput: 'CREATE SCHEMA analytics.sales',
        description: 'Should create schema in catalog',
      },
    ],
    solution: `CREATE SCHEMA analytics.sales
# OR
CREATE SCHEMA IF NOT EXISTS analytics.sales`,
    explanation: 'Schemas are created within catalogs using the catalog.schema notation.',
    tieredHints: {
      apiSignature: 'CREATE SCHEMA [IF NOT EXISTS] catalog.schema_name',
      skeleton: `-- ____ schema\n____ ____ analytics.____`,
    },
    hints: ['Use CREATE SCHEMA catalog.schema_name'],
    tags: ['unity-catalog', 'create', 'schema'],
    concepts: ['ucat-namespaces', 'ps-dataframe-create'],
  },

  {
    id: 'catalog-5',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_PLATFORM,
    language: CodeLanguage.SQL,
    question: 'Write a SQL query to retrieve all columns from table "customers" in schema "sales" of catalog "analytics" using the fully qualified 3-level namespace.',
    starterCode: `-- Retrieve records using 3-level namespace\n`,
    testCases: [
      {
        input: 'analytics.sales.customers table',
        expectedOutput: 'SELECT * FROM analytics.sales.customers',
        description: 'Should use three-level namespace',
      },
    ],
    solution: `SELECT * FROM analytics.sales.customers`,
    explanation: 'Use the full three-level namespace (catalog.schema.table) to reference tables in Unity Catalog.',
    tieredHints: {
      apiSignature: 'SELECT cols FROM catalog.schema.table',
      skeleton: `-- ____ 3-level namespace\nSELECT * ____ analytics.____.____`,
    },
    hints: ['Use catalog.schema.table notation'],
    tags: ['unity-catalog', 'namespace', 'select'],
    concepts: ['ucat-namespaces', 'ps-select-filter'],
  },

  {
    id: 'catalog-6',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DATABRICKS_PLATFORM,
    language: CodeLanguage.SQL,
    question: 'Write a SQL statement to grant read access on the "sales" schema to user principal group "analysts".',
    starterCode: `-- Grant read access on schema\n`,
    testCases: [
      {
        input: 'sales schema and analysts group',
        expectedOutput: 'GRANT SELECT ON SCHEMA sales TO analysts',
        description: 'Should grant SELECT privilege',
      },
    ],
    solution: `GRANT SELECT ON SCHEMA sales TO analysts
# OR
GRANT SELECT ON SCHEMA analytics.sales TO analysts`,
    explanation: 'Unity Catalog uses GRANT statements to manage permissions. Privileges can be granted on catalogs, schemas, tables, or views.',
    tieredHints: {
      apiSignature: 'GRANT privilege ON SCHEMA schema_name TO principal',
      skeleton: `____ SELECT ____ SCHEMA sales ____ analysts`,
    },
    hints: ['Use GRANT privilege ON object TO principal'],
    tags: ['unity-catalog', 'grant', 'permissions'],
    concepts: ['ucat-namespaces', 'ucat-grants'],
  },

  {
    id: 'catalog-7',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_PLATFORM,
    language: CodeLanguage.SQL,
    question: 'Write a SQL statement to set the active catalog context for subsequent session queries to "analytics".',
    starterCode: `-- Set active catalog context\n`,
    testCases: [
      {
        input: '',
        expectedOutput: 'USE CATALOG analytics',
        description: 'Should set current catalog',
      },
    ],
    solution: `USE CATALOG analytics`,
    explanation: 'USE CATALOG sets the default catalog for the session. After this, you can reference tables with schema.table instead of catalog.schema.table.',
    tieredHints: {
      apiSignature: 'USE CATALOG catalog_name',
      skeleton: `-- ____ active catalog\n____ ____ analytics`,
    },
    hints: ['Use USE CATALOG catalog_name'],
    tags: ['unity-catalog', 'use', 'catalog'],
    concepts: ['ucat-namespaces'],
  },

  // ===== NULL HANDLING & COALESCE (10 questions) =====

  {
    id: 'null-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NULL_HANDLING,
    language: CodeLanguage.PYTHON,
    question: 'Write a PySpark statement to add a column "primary_contact" to DataFrame "df" (columns: email, phone, contact) using coalesce to select the first non-null value in that order.',
    starterCode: `# Select first non-null contact into primary_contact\nresult = `,
    testCases: [
      {
        input: 'df with email, phone, contact columns',
        expectedOutput: 'coalesce(df.email, df.phone, df.contact)',
        description: 'Should return first non-null value',
      },
    ],
    solution: `from pyspark.sql.functions import coalesce

result = df.withColumn("primary_contact", coalesce(df.email, df.phone, df.contact))
# OR
from pyspark.sql.functions import coalesce, col

result = df.withColumn("primary_contact", coalesce(col("email"), col("phone"), col("contact")))
# OR
from pyspark.sql.functions import coalesce

result = df.withColumn("primary_contact", coalesce("email", "phone", "contact"))`,
    explanation: 'coalesce(*cols) returns the first non-null column value evaluated sequentially from left to right.',
    tieredHints: {
      apiSignature: 'coalesce(*cols: Column | str) -> Column',
      skeleton: `from pyspark.sql.functions import coalesce

result = df.withColumn("primary_contact", ____(df.email, df.____, df.____))`,
    },
    hints: ['Use coalesce() function', 'Pass columns in priority order'],
    tags: ['null-handling', 'coalesce', 'functions'],
    concepts: ['ps-null-handling'],
  },

  {
    id: 'null-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NULL_HANDLING,
    language: CodeLanguage.PYTHON,
    question: 'Write a PySpark statement to filter DataFrame "df" (which has column "email") to rows where email is null.',
    starterCode: `# Filter for null email rows\nresult = `,
    testCases: [
      {
        input: 'df with email column',
        expectedOutput: 'df.email.isNull()',
        description: 'Should filter null values',
      },
    ],
    solution: `result = df.filter(df.email.isNull())
# OR
from pyspark.sql.functions import col

result = df.filter(col("email").isNull())
# OR
from pyspark.sql.functions import isnull

result = df.filter(isnull("email"))`,
    explanation: 'isNull() filters DataFrame rows containing null values in the target column.',
    tieredHints: {
      apiSignature: 'Column.isNull() -> Column',
      skeleton: `result = ____.filter(df.____.____())`,
    },
    hints: ['Use .isNull() method on column'],
    tags: ['null-handling', 'filter', 'isnull'],
    concepts: ['ps-null-handling', 'ps-select-filter'],
  },

  {
    id: 'null-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NULL_HANDLING,
    language: CodeLanguage.PYTHON,
    question: 'Write a PySpark statement to filter DataFrame "df" (which has column "phone") to rows where phone is NOT null.',
    starterCode: `# Filter for non-null phone rows\nresult = `,
    testCases: [
      {
        input: 'df with phone column',
        expectedOutput: 'df.phone.isNotNull()',
        description: 'Should filter non-null values',
      },
    ],
    solution: `result = df.filter(df.phone.isNotNull())
# OR
from pyspark.sql.functions import col

result = df.filter(col("phone").isNotNull())
# OR
from pyspark.sql.functions import isnotnull

result = df.filter(isnotnull("phone"))`,
    explanation: 'isNotNull() filters DataFrame rows containing non-null values in the target column.',
    tieredHints: {
      apiSignature: 'Column.isNotNull() -> Column',
      skeleton: `result = ____.filter(df.____.____())`,
    },
    hints: ['Use .isNotNull() method'],
    tags: ['null-handling', 'filter', 'isnotnull'],
    concepts: ['ps-null-handling', 'ps-select-filter'],
  },

  {
    id: 'null-4',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NULL_HANDLING,
    language: CodeLanguage.PYTHON,
    question: 'Write a PySpark statement to drop rows from DataFrame "df" that contain null values in any column.',
    starterCode: `# Drop rows containing any null values\nresult = `,
    testCases: [
      {
        input: 'df with possible null values',
        expectedOutput: 'df.na.drop() or df.dropna()',
        description: 'Should drop rows with any null',
      },
    ],
    solution: `result = df.na.drop()
# OR
result = df.dropna()
# OR
result = df.na.drop(how="any")`,
    explanation: 'na.drop() or dropna() removes rows containing null values across columns (default how="any").',
    tieredHints: {
      apiSignature: 'DataFrameNaFunctions.drop(how: str = "any", thresh: int = None, subset: List[str] = None) -> DataFrame',
      skeleton: `result = ____.____.____()`,
    },
    hints: ['Use na.drop() or dropna()'],
    tags: ['null-handling', 'drop', 'na'],
    concepts: ['ps-null-handling', 'ps-distinct-drop-dup'],
  },

  {
    id: 'null-5',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NULL_HANDLING,
    language: CodeLanguage.PYTHON,
    question: 'Write a PySpark statement to drop rows from DataFrame "df" only when all columns in the row are null.',
    starterCode: `# Drop rows where all columns are null\nresult = `,
    testCases: [
      {
        input: 'df with possible null values',
        expectedOutput: 'df.na.drop(how="all")',
        description: 'Should drop only when all null',
      },
    ],
    solution: `result = df.na.drop(how="all")
# OR
result = df.dropna(how="all")`,
    explanation: 'na.drop(how="all") drops rows only when every column in the row evaluates to null.',
    tieredHints: {
      apiSignature: 'DataFrameNaFunctions.drop(how: str = "any", thresh: int = None, subset: List[str] = None) -> DataFrame',
      skeleton: `result = df.____.____(how="____")`,
    },
    hints: ['Use how="all" parameter'],
    tags: ['null-handling', 'drop', 'na'],
    concepts: ['ps-null-handling', 'ps-distinct-drop-dup'],
  },

  // ===== DATABRICKS UTILITIES (dbutils) - 20 questions =====

  {
    id: 'dbutils-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DATABRICKS_UTILITIES,
    question: 'What is dbutils in Databricks?',
    options: [
      { id: 'a', text: 'A specialized Python module for distributed neural network model training.', isCorrect: false },
      { id: 'b', text: 'Built-in Databricks utilities for managing filesystems, notebooks, widgets, and secrets.', isCorrect: true },
      { id: 'c', text: 'A SQL query execution optimizer that rewrites Spark catalyst physical plans.', isCorrect: false },
      { id: 'd', text: 'An interactive workspace user interface tool for creating custom dashboard charts.', isCorrect: false },
    ],
    explanation: 'dbutils provides utilities for file system operations (fs), notebook workflows (notebook), input widgets (widgets), and secret management (secrets).',
    hints: ['Think about workspace utilities for files, widgets, and secrets.'],
    tags: ['dbutils', 'databricks', 'utilities'],
    concepts: ['dbx-utilities', 'dbx-architecture'],
  },

  {
    id: 'dbutils-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DATABRICKS_UTILITIES,
    language: CodeLanguage.PYTHON,
    question: 'Write a Python statement using Databricks filesystem utilities to list all files in directory "/mnt/data".',
    starterCode: `# List directory files\nfiles = `,
    testCases: [
      {
        input: '/mnt/data directory',
        expectedOutput: 'dbutils.fs.ls("/mnt/data")',
        description: 'Should list files in directory',
      },
    ],
    solution: `files = dbutils.fs.ls("/mnt/data")
# OR
files = dbutils.fs.ls(dir="/mnt/data")`,
    explanation: 'dbutils.fs.ls() lists files and directories at the specified path. Returns a list of FileInfo objects.',
    tieredHints: {
      apiSignature: 'dbutils.fs.ls(dir: str) -> List[FileInfo]',
      skeleton: `files = ____.fs.____("____")`,
    },
    hints: ['Use dbutils.fs.ls()', 'Pass the directory path as argument'],
    tags: ['dbutils', 'fs', 'list-files'],
    concepts: ['dbx-utilities', 'dbx-dbfs'],
  },

  {
    id: 'dbutils-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_UTILITIES,
    language: CodeLanguage.PYTHON,
    question: 'Write a Python statement using Databricks filesystem utilities to copy file "/data/source.csv" to "/data/backup/source.csv".',
    starterCode: `# Copy file\n`,
    testCases: [
      {
        input: 'source and destination paths',
        expectedOutput: 'dbutils.fs.cp("/data/source.csv", "/data/backup/source.csv")',
        description: 'Should copy file',
      },
    ],
    solution: `dbutils.fs.cp("/data/source.csv", "/data/backup/source.csv")
# OR
dbutils.fs.cp(from_path="/data/source.csv", to_path="/data/backup/source.csv")`,
    explanation: 'dbutils.fs.cp() copies files from source to destination. Use recurse=True for directories.',
    tieredHints: {
      apiSignature: 'dbutils.fs.cp(from: str, to: str, recurse: bool = False) -> bool',
      skeleton: `____.fs.____("/data/source.csv", "____")`,
    },
    hints: ['Use dbutils.fs.cp(source, destination)'],
    tags: ['dbutils', 'fs', 'copy'],
    concepts: ['dbx-utilities', 'dbx-dbfs'],
  },

  {
    id: 'dbutils-4',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_UTILITIES,
    language: CodeLanguage.PYTHON,
    question: 'Write a Python statement using Databricks filesystem utilities to move file "/temp/data.csv" to "/archive/data.csv".',
    starterCode: `# Move file\n`,
    testCases: [
      {
        input: 'source and destination paths',
        expectedOutput: 'dbutils.fs.mv("/temp/data.csv", "/archive/data.csv")',
        description: 'Should move file',
      },
    ],
    solution: `dbutils.fs.mv("/temp/data.csv", "/archive/data.csv")
# OR
dbutils.fs.mv(from_path="/temp/data.csv", to_path="/archive/data.csv")`,
    explanation: 'dbutils.fs.mv() moves (renames) files from source to destination.',
    tieredHints: {
      apiSignature: 'dbutils.fs.mv(from: str, to: str, recurse: bool = False) -> bool',
      skeleton: `____.fs.____("/temp/data.csv", "____")`,
    },
    hints: ['Use dbutils.fs.mv(source, destination)'],
    tags: ['dbutils', 'fs', 'move'],
    concepts: ['dbx-utilities', 'dbx-dbfs'],
  },

  {
    id: 'dbutils-5',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DATABRICKS_UTILITIES,
    language: CodeLanguage.PYTHON,
    question: 'Write a Python statement using Databricks filesystem utilities to delete file "/temp/old_data.csv".',
    starterCode: `# Remove file\n`,
    testCases: [
      {
        input: 'file path',
        expectedOutput: 'dbutils.fs.rm("/temp/old_data.csv")',
        description: 'Should delete file',
      },
    ],
    solution: `dbutils.fs.rm("/temp/old_data.csv")
# OR
dbutils.fs.rm("/temp/old_data.csv", recurse=False)`,
    explanation: 'dbutils.fs.rm() removes files. Use recurse=True to delete directories and their contents.',
    tieredHints: {
      apiSignature: 'dbutils.fs.rm(dir: str, recurse: bool = False) -> bool',
      skeleton: `____.fs.____("____")`,
    },
    hints: ['Use dbutils.fs.rm(path)'],
    tags: ['dbutils', 'fs', 'delete'],
    concepts: ['dbx-utilities', 'dbx-dbfs', 'delta-merge'],
  },

  {
    id: 'dbutils-6',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_UTILITIES,
    language: CodeLanguage.PYTHON,
    question: 'Write a Python statement using Databricks filesystem utilities to create directory "/data/new_folder" along with any necessary parent directories.',
    starterCode: `# Create directory and parents\n`,
    testCases: [
      {
        input: 'directory path',
        expectedOutput: 'dbutils.fs.mkdirs("/data/new_folder")',
        description: 'Should create directory',
      },
    ],
    solution: `dbutils.fs.mkdirs("/data/new_folder")`,
    explanation: 'dbutils.fs.mkdirs() creates a directory and any necessary parent directories (like mkdir -p).',
    tieredHints: {
      apiSignature: 'dbutils.fs.mkdirs(dir: str) -> bool',
      skeleton: `____.fs.____("____")`,
    },
    hints: ['Use dbutils.fs.mkdirs(path)'],
    tags: ['dbutils', 'fs', 'mkdir'],
    concepts: ['dbx-utilities', 'dbx-dbfs'],
  },

  {
    id: 'dbutils-7',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_UTILITIES,
    language: CodeLanguage.PYTHON,
    question: 'Write a Python statement using Databricks filesystem utilities to read the first 1,000,000 bytes of "/config/settings.txt" as a string into variable "content".',
    starterCode: `# Read up to 1,000,000 bytes\ncontent = `,
    testCases: [
      {
        input: 'file path',
        expectedOutput: 'dbutils.fs.head("/config/settings.txt", 1000000)',
        description: 'Should read file contents',
      },
    ],
    solution: `content = dbutils.fs.head("/config/settings.txt", 1000000)
# OR
content = dbutils.fs.head("/config/settings.txt", maxBytes=1000000)`,
    explanation: 'dbutils.fs.head(path, maxBytes) reads up to maxBytes from a file as a string. The default is 65536 bytes (64 KB), so for larger files you should specify a higher limit.',
    tieredHints: {
      apiSignature: 'dbutils.fs.head(file: str, maxBytes: int = 65536) -> str',
      skeleton: `content = ____.fs.____("/config/settings.txt", ____)`,
    },
    hints: ['Use dbutils.fs.head(path, maxBytes)', 'Specify 1000000 as the second argument for the byte limit'],
    tags: ['dbutils', 'fs', 'read'],
    concepts: ['dbx-utilities', 'dbx-dbfs', 'ps-io-csv'],
  },

  {
    id: 'dbutils-8',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_UTILITIES,
    language: CodeLanguage.PYTHON,
    question: 'Write a Python statement using Databricks filesystem utilities to write string "Hello, Databricks!" to "/output/message.txt", overwriting if it exists.',
    starterCode: `# Write text to file\n`,
    testCases: [
      {
        input: 'path and content',
        expectedOutput: 'dbutils.fs.put("/output/message.txt", "Hello, Databricks!", True)',
        description: 'Should write to file',
      },
    ],
    solution: `dbutils.fs.put("/output/message.txt", "Hello, Databricks!", True)
# OR
dbutils.fs.put("/output/message.txt", "Hello, Databricks!", overwrite=True)`,
    explanation: 'dbutils.fs.put() writes a string to a file. The third parameter controls overwriting — True overwrites, False (default) raises an error if the file exists.',
    tieredHints: {
      apiSignature: 'dbutils.fs.put(file: str, contents: str, overwrite: bool = False) -> bool',
      skeleton: `____.fs.____("/output/message.txt", "Hello, Databricks!", ____)`,
    },
    hints: ['Use dbutils.fs.put(path, content, overwrite)', 'Pass True as the third argument to allow overwriting'],
    tags: ['dbutils', 'fs', 'write'],
    concepts: ['dbx-utilities', 'dbx-dbfs', 'ps-write-modes'],
  },

  {
    id: 'dbutils-9',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DATABRICKS_UTILITIES,
    language: CodeLanguage.PYTHON,
    question: 'Mount Azure Blob Storage "wasbs://container@account.blob.core.windows.net" to "/mnt/data" using Databricks filesystem utilities, configuring credentials key "fs.azure.account.key.account.blob.core.windows.net" to variable "storage_key".',
    starterCode: `# Mount Azure Blob storage\ndbutils.fs.mount(\n  source = "wasbs://container@account.blob.core.windows.net",\n  mount_point = "/mnt/data",\n  extra_configs = `,
    testCases: [
      {
        input: 'storage credentials',
        expectedOutput: '{"fs.azure.account.key.account.blob.core.windows.net": key}',
        description: 'Should mount with credentials',
      },
    ],
    solution: `dbutils.fs.mount(\n  source = "wasbs://container@account.blob.core.windows.net",\n  mount_point = "/mnt/data",\n  extra_configs = {"fs.azure.account.key.account.blob.core.windows.net": storage_key}\n)`,
    explanation: 'dbutils.fs.mount() mounts cloud storage (Azure Blob, S3, ADLS) to DBFS. Requires source URL, mount point, and credentials in extra_configs.',
    tieredHints: {
      apiSignature: 'dbutils.fs.mount(source: str, mount_point: str, extra_configs: dict = None) -> bool',
      skeleton: `____.fs.____(
  ____ = "____",
  ____ = "____",
  ____ = {"____": ____}
)`,
    },
    hints: ['Pass extra_configs as dict with credentials', 'Use appropriate key format for storage type'],
    tags: ['dbutils', 'fs', 'mount', 'azure'],
    concepts: ['dbx-utilities', 'dbx-dbfs'],
  },

  {
    id: 'dbutils-10',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DATABRICKS_UTILITIES,
    language: CodeLanguage.PYTHON,
    question: 'Run notebook "/Shared/ETL/ETL_Process" using Databricks notebook utilities with a timeout of 60 seconds and assign the return value to variable "result".',
    starterCode: `# Run notebook with timeout\nresult = `,
    testCases: [
      {
        input: 'notebook path',
        expectedOutput: 'dbutils.notebook.run("/Shared/ETL/ETL_Process", 60)',
        description: 'Should run notebook with timeout',
      },
    ],
    solution: `result = dbutils.notebook.run("/Shared/ETL/ETL_Process", 60)
# OR
result = dbutils.notebook.run("/Shared/ETL/ETL_Process", timeout_seconds=60)`,
    explanation: 'dbutils.notebook.run(path, timeout_seconds) executes another notebook synchronously and returns its exit value as a string.',
    tieredHints: {
      apiSignature: 'dbutils.notebook.run(path: str, timeout_seconds: int, arguments: dict = None) -> str',
      skeleton: `result = ____.notebook.____("/Shared/ETL/ETL_Process", ____)`,
    },
    hints: ['Use dbutils.notebook.run(path, timeout_seconds)', 'The timeout (60) is the second argument and is required'],
    tags: ['dbutils', 'notebook', 'workflow'],
    concepts: ['dbx-utilities', 'dbx-architecture', 'dbx-workflows'],
  },

  {
    id: 'dbutils-11',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_UTILITIES,
    language: CodeLanguage.PYTHON,
    question: 'Run notebook "/Shared/ETL/Process" with a 60-second timeout passing parameter dictionary {"env": "prod", "date": "2024-01-01"} and store the result in "result".',
    starterCode: `# Run notebook with parameters\nresult = `,
    testCases: [
      {
        input: 'parameters dict',
        expectedOutput: '{"env": "prod", "date": "2024-01-01"}',
        description: 'Should pass parameters',
      },
    ],
    solution: `result = dbutils.notebook.run(\n  "/Shared/ETL/Process",\n  60,\n  {"env": "prod", "date": "2024-01-01"}\n)`,
    explanation: 'The third parameter passes arguments as a dictionary of strings. The called notebook accesses these values using dbutils.widgets.get("env"), dbutils.widgets.get("date"), etc.',
    tieredHints: {
      apiSignature: 'dbutils.notebook.run(path: str, timeout_seconds: int, arguments: dict = None) -> str',
      skeleton: `result = ____.notebook.____(
  "____",
  ____,
  {____: "____", ____: "____"}
)`,
    },
    hints: ['Pass a dictionary as the third argument', 'All keys and values must be strings'],
    tags: ['dbutils', 'notebook', 'parameters'],
    concepts: ['dbx-utilities', 'dbx-architecture', 'dbx-widgets'],
  },

  {
    id: 'dbutils-12',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DATABRICKS_UTILITIES,
    language: CodeLanguage.PYTHON,
    question: 'Exit current notebook execution and return string "Success" using Databricks notebook utilities.',
    starterCode: `# Exit notebook with return value\n`,
    testCases: [
      {
        input: 'return value',
        expectedOutput: 'dbutils.notebook.exit("Success")',
        description: 'Should exit with value',
      },
    ],
    solution: `dbutils.notebook.exit("Success")`,
    explanation: 'dbutils.notebook.exit() terminates notebook execution and returns a value to the calling notebook.',
    tieredHints: {
      apiSignature: 'dbutils.notebook.exit(value: str) -> None',
      skeleton: `____.notebook.____("____")`,
    },
    hints: ['Use dbutils.notebook.exit(value)'],
    tags: ['dbutils', 'notebook', 'exit'],
    concepts: ['dbx-utilities', 'dbx-architecture'],
  },

  {
    id: 'dbutils-13',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_UTILITIES,
    language: CodeLanguage.PYTHON,
    question: 'Write a Python statement using Databricks widget utilities to create a text input widget named "environment" with default value "dev".',
    starterCode: `# Create text widget\n`,
    testCases: [
      {
        input: 'widget name and default',
        expectedOutput: 'dbutils.widgets.text("environment", "dev")',
        description: 'Should create text widget',
      },
    ],
    solution: `dbutils.widgets.text("environment", "dev")
# OR
dbutils.widgets.text(name="environment", defaultValue="dev")`,
    explanation: 'dbutils.widgets.text() creates a text input widget. Users can enter values which can be retrieved with dbutils.widgets.get().',
    tieredHints: {
      apiSignature: 'dbutils.widgets.text(name: str, defaultValue: str, label: str = None)',
      skeleton: `____.widgets.____("environment", "____")`,
    },
    hints: ['Use dbutils.widgets.text(name, defaultValue)'],
    tags: ['dbutils', 'widgets', 'input'],
    concepts: ['dbx-utilities', 'dbx-widgets'],
  },

  {
    id: 'dbutils-14',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_UTILITIES,
    language: CodeLanguage.PYTHON,
    question: 'Write a Python statement using Databricks widget utilities to create a dropdown widget named "region" with default "US" and choices ["US", "EU", "APAC"].',
    starterCode: `# Create dropdown widget\n`,
    testCases: [
      {
        input: 'widget name, choices, default',
        expectedOutput: 'dbutils.widgets.dropdown("region", "US", ["US", "EU", "APAC"])',
        description: 'Should create dropdown widget',
      },
    ],
    solution: `dbutils.widgets.dropdown("region", "US", ["US", "EU", "APAC"])`,
    explanation: 'dbutils.widgets.dropdown() creates a dropdown widget with predefined choices.',
    tieredHints: {
      apiSignature: 'dbutils.widgets.dropdown(name: str, defaultValue: str, choices: list, label: str = None)',
      skeleton: `____.widgets.____("region", "US", ["____", "EU", "APAC"])`,
    },
    hints: ['Use dbutils.widgets.dropdown(name, defaultValue, choices)'],
    tags: ['dbutils', 'widgets', 'dropdown'],
    concepts: ['dbx-utilities', 'dbx-widgets'],
  },

  {
    id: 'dbutils-15',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DATABRICKS_UTILITIES,
    language: CodeLanguage.PYTHON,
    question: 'Write a Python statement using Databricks widget utilities to fetch the value of widget "environment" into variable "env".',
    starterCode: `# Fetch widget value\nenv = `,
    testCases: [
      {
        input: 'widget name',
        expectedOutput: 'dbutils.widgets.get("environment")',
        description: 'Should get widget value',
      },
    ],
    solution: `env = dbutils.widgets.get("environment")
# OR
env = dbutils.widgets.get(name="environment")`,
    explanation: 'dbutils.widgets.get() retrieves the current value of a widget.',
    tieredHints: {
      apiSignature: 'dbutils.widgets.get(name: str) -> str',
      skeleton: `env = ____.widgets.____("____")`,
    },
    hints: ['Use dbutils.widgets.get(name)'],
    tags: ['dbutils', 'widgets', 'get'],
    concepts: ['dbx-utilities', 'dbx-widgets'],
  },

  {
    id: 'dbutils-16',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DATABRICKS_UTILITIES,
    language: CodeLanguage.PYTHON,
    question: 'Write a Python statement using Databricks widget utilities to remove widget "environment".',
    starterCode: `# Remove widget\n`,
    testCases: [
      {
        input: 'widget name',
        expectedOutput: 'dbutils.widgets.remove("environment")',
        description: 'Should remove widget',
      },
    ],
    solution: `dbutils.widgets.remove("environment")
# OR
dbutils.widgets.remove(name="environment")`,
    explanation: 'dbutils.widgets.remove() removes a specific widget.',
    tieredHints: {
      apiSignature: 'dbutils.widgets.remove(name: str)',
      skeleton: `____.widgets.____("____")`,
    },
    hints: ['Use dbutils.widgets.remove(name)'],
    tags: ['dbutils', 'widgets', 'remove'],
    concepts: ['dbx-utilities', 'dbx-widgets'],
  },

  {
    id: 'dbutils-17',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_UTILITIES,
    language: CodeLanguage.PYTHON,
    question: 'Write a Python statement using Databricks secret utilities to fetch key "api-key" from secret scope "prod" into variable "api_key".',
    starterCode: `# Retrieve secret credential\napi_key = `,
    testCases: [
      {
        input: 'scope and key',
        expectedOutput: 'dbutils.secrets.get(scope="prod", key="api-key")',
        description: 'Should get secret value',
      },
    ],
    solution: `api_key = dbutils.secrets.get(scope="prod", key="api-key")
# OR
api_key = dbutils.secrets.get("prod", "api-key")`,
    explanation: 'dbutils.secrets.get() retrieves secret values from Databricks secret scopes.',
    tieredHints: {
      apiSignature: 'dbutils.secrets.get(scope: str, key: str) -> str',
      skeleton: `api_key = ____.secrets.____(scope="prod", key="____")`,
    },
    hints: ['Use dbutils.secrets.get(scope, key)'],
    tags: ['dbutils', 'secrets', 'security'],
    concepts: ['dbx-utilities', 'dbx-secrets'],
  },

  {
    id: 'dbutils-18',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_UTILITIES,
    question: 'What happens if you try to print a secret retrieved with dbutils.secrets.get()?',
    options: [
      { id: 'a', text: 'The unencrypted secret key string is printed directly to notebook cell output.', isCorrect: false },
      { id: 'b', text: 'The interpreter raises an unhandled SecurityException and halts cell execution.', isCorrect: false },
      { id: 'c', text: 'Databricks automatically replaces the secret output with [REDACTED] in logs.', isCorrect: true },
      { id: 'd', text: 'The workspace notebook locks execution and revokes user cluster privileges.', isCorrect: false },
    ],
    explanation: 'Databricks automatically redacts secret values when displayed or logged, showing [REDACTED] instead.',
    hints: ['Think about automatic output redaction in notebook logs.'],
    tags: ['dbutils', 'secrets', 'security'],
    concepts: ['dbx-utilities', 'dbx-secrets'],
  },

  {
    id: 'dbutils-19',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_UTILITIES,
    language: CodeLanguage.PYTHON,
    question: 'Write a Python statement using Databricks secret utilities to list all accessible secret scopes into variable "scopes".',
    starterCode: `# List secret scopes\nscopes = `,
    testCases: [
      {
        input: '',
        expectedOutput: 'dbutils.secrets.listScopes()',
        description: 'Should list all scopes',
      },
    ],
    solution: `scopes = dbutils.secrets.listScopes()`,
    explanation: 'dbutils.secrets.listScopes() returns all secret scopes you have access to.',
    tieredHints: {
      apiSignature: 'dbutils.secrets.listScopes() -> List[SecretScope]',
      skeleton: `____ = dbutils.____.____()`,
    },
    hints: ['Use dbutils.secrets.listScopes()'],
    tags: ['dbutils', 'secrets', 'list'],
    concepts: ['dbx-utilities', 'dbx-secrets'],
  },

  {
    id: 'dbutils-20',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_UTILITIES,
    language: CodeLanguage.PYTHON,
    question: 'Write a Python statement using Databricks secret utilities to list all secret keys in scope "prod" into variable "keys".',
    starterCode: `# List secret keys in scope\nkeys = `,
    testCases: [
      {
        input: 'scope name',
        expectedOutput: 'dbutils.secrets.list(scope="prod")',
        description: 'Should list keys in scope',
      },
    ],
    solution: `keys = dbutils.secrets.list(scope="prod")
# OR
keys = dbutils.secrets.list("prod")`,
    explanation: 'dbutils.secrets.list() returns all secret keys within a specific scope.',
    tieredHints: {
      apiSignature: 'dbutils.secrets.list(scope: str) -> List[SecretMetadata]',
      skeleton: `keys = ____.secrets.____(scope="____")`,
    },
    hints: ['Use dbutils.secrets.list(scope)'],
    tags: ['dbutils', 'secrets', 'list'],
    concepts: ['dbx-utilities', 'dbx-secrets'],
  },

  // ===== DELTA LAKE CLONES (8 questions) =====

  {
    id: 'delta-clone-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DELTA_OPERATIONS,
    question: 'What is the primary difference between a SHALLOW CLONE and a DEEP CLONE in Delta Lake?',
    options: [
      { id: 'a', text: 'Shallow clone copies data files only, while deep clone copies table transaction log metadata.', isCorrect: false },
      { id: 'b', text: 'Shallow clone copies metadata and references data files, while deep clone copies both metadata and data.', isCorrect: true },
      { id: 'c', text: 'Shallow clone creates a physical duplicate on disk, while deep clone creates a temporary workspace view.', isCorrect: false },
      { id: 'd', text: 'Shallow clone supports time travel operations, while deep clone disables transaction log retention.', isCorrect: false },
    ],
    explanation: 'A SHALLOW CLONE creates a lightweight table copy that references the existing source data files (metadata-only copy). A DEEP CLONE creates a fully independent copy by copying both metadata and all physical data files.',
    tags: ['delta', 'clone', 'shallow', 'deep'],
    concepts: ['delta-acid', 'delta-clone'],
  },

  {
    id: 'delta-clone-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DELTA_OPERATIONS,
    language: CodeLanguage.SQL,
    question: 'Write a SQL statement to create an independent DEEP CLONE named "dev_orders" from the production Delta table "prod_orders".',
    starterCode: `-- Create independent deep clone\n`,
    testCases: [
      {
        input: 'prod_orders table',
        expectedOutput: 'CREATE TABLE dev_orders DEEP CLONE prod_orders',
        description: 'Should create deep clone',
      },
    ],
    solution: `CREATE TABLE dev_orders DEEP CLONE prod_orders
-- OR
CREATE OR REPLACE TABLE dev_orders DEEP CLONE prod_orders`,
    explanation: 'CREATE TABLE target DEEP CLONE source makes a complete physical copy of all underlying Parquet data files and transaction logs. Changes to dev_orders have no impact on prod_orders.',
    tieredHints: {
      apiSignature: 'CREATE TABLE target_table DEEP CLONE source_table',
      skeleton: `-- ____ clone\nCREATE TABLE dev_orders ____ ____ prod_orders`,
    },
    hints: ['Use CREATE TABLE target DEEP CLONE source'],
    tags: ['delta', 'clone', 'deep'],
    concepts: ['delta-acid', 'delta-clone'],
  },

  {
    id: 'delta-clone-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DELTA_OPERATIONS,
    language: CodeLanguage.SQL,
    question: 'Write a SQL statement to create a zero-copy SHALLOW CLONE named "test_users" from the Delta table "prod_users".',
    starterCode: `-- Create zero-copy shallow clone\n`,
    testCases: [
      {
        input: 'prod_users table',
        expectedOutput: 'CREATE TABLE test_users SHALLOW CLONE prod_users',
        description: 'Should create shallow clone',
      },
    ],
    solution: `CREATE TABLE test_users SHALLOW CLONE prod_users
-- OR
CREATE OR REPLACE TABLE test_users SHALLOW CLONE prod_users`,
    explanation: 'SHALLOW CLONE creates a new Delta table definition referencing source data files without copying them. It is nearly instantaneous and incurs zero additional storage costs initially.',
    tieredHints: {
      apiSignature: 'CREATE TABLE target_table SHALLOW CLONE source_table',
      skeleton: `-- ____ clone\nCREATE TABLE test_users ____ ____ prod_users`,
    },
    hints: ['Use CREATE TABLE target SHALLOW CLONE source'],
    tags: ['delta', 'clone', 'shallow'],
    concepts: ['delta-acid', 'delta-clone'],
  },

  {
    id: 'delta-clone-4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DELTA_OPERATIONS,
    question: 'Under which scenario is a SHALLOW CLONE preferable to a DEEP CLONE?',
    options: [
      { id: 'a', text: 'When duplicating a production table across cloud storage locations for disaster recovery.', isCorrect: false },
      { id: 'b', text: 'When creating a zero-copy development table to test queries without incurring storage costs.', isCorrect: true },
      { id: 'c', text: 'When modifying underlying data files independently without affecting the source table.', isCorrect: false },
      { id: 'd', text: 'When migrating Delta tables across different metastores while decoupling file references.', isCorrect: false },
    ],
    explanation: 'SHALLOW CLONE is ideal for short-lived development, ad-hoc testing, and auditing because it avoids copying terabytes of underlying data files while preserving the source table schema and state.',
    tags: ['delta', 'clone', 'shallow', 'use-case'],
    concepts: ['delta-acid', 'delta-clone'],
  },

  // ===== DELTA LAKE MERGE (UPSERT) (6 questions) =====

  {
    id: 'delta-merge-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DELTA_OPERATIONS,
    question: 'What operation does the MERGE INTO command perform in Delta Lake?',
    options: [
      { id: 'a', text: 'It combines two separate schemas by merging column definitions into a single target table.', isCorrect: false },
      { id: 'b', text: 'It performs single-transaction atomic UPSERTs, updating matching rows and inserting new rows.', isCorrect: true },
      { id: 'c', text: 'It merges small Parquet data files into 1GB files to optimize table scan performance.', isCorrect: false },
      { id: 'd', text: 'It creates a unified SQL view over multiple underlying Delta tables without rewriting files.', isCorrect: false },
    ],
    explanation: 'MERGE INTO provides atomic UPSERT (update + insert) capability. It matches source and target rows on a predicate, executing specified UPDATE, DELETE, or INSERT actions in a single commit.',
    tags: ['delta', 'merge', 'upsert'],
    concepts: ['delta-acid', 'delta-merge'],
  },

  {
    id: 'delta-merge-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DELTA_OPERATIONS,
    language: CodeLanguage.SQL,
    question: `Write a SQL MERGE statement to upsert data from table "updates" (alias u) into Delta table "customers" (alias c) matching on "customer_id". On match, update "name" and "email"; on no match, insert all columns.

Table Schemas & Operation Summary:
\`\`\`text
Target: customers c (customer_id, name, email, region)
Source: updates u   (customer_id, name, email, region)

Match predicate: c.customer_id = u.customer_id
WHEN MATCHED:    UPDATE SET c.name = u.name, c.email = u.email
WHEN NOT MATCHED: INSERT *
\`\`\``,
    starterCode: `-- MERGE INTO statement\nMERGE INTO customers c\nUSING updates u\nON c.customer_id = u.customer_id\n`,
    testCases: [
      {
        input: 'customers and updates tables',
        expectedOutput: 'WHEN MATCHED THEN UPDATE SET c.name = u.name, c.email = u.email WHEN NOT MATCHED THEN INSERT *',
        description: 'Should update on match, insert on no match',
      },
    ],
    solution: `MERGE INTO customers c
USING updates u
ON c.customer_id = u.customer_id
WHEN MATCHED THEN
  UPDATE SET c.name = u.name, c.email = u.email
WHEN NOT MATCHED THEN
  INSERT *
-- OR
MERGE INTO customers c
USING updates u
ON c.customer_id = u.customer_id
WHEN MATCHED THEN UPDATE SET c.name = u.name, c.email = u.email
WHEN NOT MATCHED THEN INSERT *`,
    explanation: 'MERGE INTO specifies target and source tables with aliases, a join predicate ON c.customer_id = u.customer_id, followed by conditional WHEN MATCHED THEN UPDATE and WHEN NOT MATCHED THEN INSERT clauses.',
    tieredHints: {
      apiSignature: 'MERGE INTO target USING source ON predicate WHEN MATCHED THEN UPDATE SET ... WHEN NOT MATCHED THEN INSERT *',
      skeleton: `MERGE INTO customers c
USING updates u
ON c.customer_id = u.customer_id
WHEN ____ THEN
  UPDATE SET c.name = u.name, c.email = u.email
WHEN ____ ____ THEN
  INSERT *`,
    },
    hints: ['Use WHEN MATCHED THEN UPDATE SET c.name = u.name, c.email = u.email', 'Use WHEN NOT MATCHED THEN INSERT *'],
    tags: ['delta', 'merge', 'upsert', 'update', 'insert'],
    concepts: ['delta-acid', 'delta-merge', 'ps-write-modes'],
  },

  // ===== DELTA LAKE OPTIMIZE & ZORDER (6 questions) =====

  {
    id: 'delta-optimize-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DELTA_OPTIMIZATION,
    question: 'What primary task does the OPTIMIZE command accomplish in Delta Lake?',
    options: [
      { id: 'a', text: 'It purges unreferenced data files older than the safety threshold to reclaim storage.', isCorrect: false },
      { id: 'b', text: 'It creates secondary B-tree indexes on frequently queried columns in Delta metadata.', isCorrect: false },
      { id: 'c', text: 'It compacts small Parquet files into larger files to optimize read scan performance.', isCorrect: true },
      { id: 'd', text: 'It applies Zstandard compression to uncompressed raw text files in object storage.', isCorrect: false },
    ],
    explanation: 'OPTIMIZE compacts fragmented small Parquet files into larger target files (~1 GB by default), solving the small file problem and drastically improving read query performance.',
    tags: ['delta', 'optimize', 'compaction'],
    concepts: ['delta-acid', 'delta-optimize'],
  },

  {
    id: 'delta-optimize-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DELTA_OPTIMIZATION,
    language: CodeLanguage.SQL,
    question: 'Write a SQL statement to run file compaction on Delta table "events".',
    starterCode: `-- Optimize events table\n`,
    testCases: [
      {
        input: 'events table',
        expectedOutput: 'OPTIMIZE events',
        description: 'Should optimize table',
      },
    ],
    solution: `OPTIMIZE events`,
    explanation: 'OPTIMIZE events triggers bin-packing compaction on table "events", consolidating small files created during streaming or frequent micro-batch writes.',
    tieredHints: {
      apiSignature: 'OPTIMIZE table_name',
      skeleton: `-- ____ events\n____ ____`,
    },
    hints: ['Use OPTIMIZE table_name'],
    tags: ['delta', 'optimize'],
    concepts: ['delta-acid', 'delta-optimize'],
  },

  {
    id: 'delta-optimize-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DELTA_OPTIMIZATION,
    language: CodeLanguage.SQL,
    question: 'Write a SQL statement to optimize Delta table "sales" and apply Z-Ordering clustering on column "customer_id".',
    starterCode: `-- Optimize sales with ZORDER\n`,
    testCases: [
      {
        input: 'sales table',
        expectedOutput: 'OPTIMIZE sales ZORDER BY (customer_id)',
        description: 'Should optimize with zorder',
      },
    ],
    solution: `OPTIMIZE sales ZORDER BY (customer_id)
-- OR
OPTIMIZE sales ZORDER BY customer_id`,
    explanation: 'OPTIMIZE sales ZORDER BY (customer_id) reorganizes data within files along space-filling Z-curves, co-locating records with similar customer_id values to maximize file skipping during queries.',
    tieredHints: {
      apiSignature: 'OPTIMIZE table_name ZORDER BY (col1, col2, ...)',
      skeleton: `____ sales ____ ____ (customer_id)`,
    },
    hints: ['Use OPTIMIZE table ZORDER BY (columns)'],
    tags: ['delta', 'optimize', 'zorder'],
    concepts: ['delta-acid', 'delta-optimize', 'delta-zorder'],
  },

  {
    id: 'delta-optimize-4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DELTA_OPTIMIZATION,
    question: 'Which columns are the best candidates for ZORDER BY clustering in Delta Lake?',
    options: [
      { id: 'a', text: 'On all columns in the table schema to ensure full index coverage.', isCorrect: false },
      { id: 'b', text: 'Exclusively on existing partition columns to speed up directory pruning.', isCorrect: false },
      { id: 'c', text: 'On high-cardinality columns frequently queried in filter predicates.', isCorrect: true },
      { id: 'd', text: 'On low-cardinality boolean columns to avoid sorting overhead.', isCorrect: false },
    ],
    explanation: 'ZORDER BY is most effective when applied to high-cardinality columns that appear frequently in query WHERE filters or join conditions. Avoid Z-Ordering existing partition columns.',
    tags: ['delta', 'zorder', 'optimization'],
    concepts: ['delta-acid', 'delta-zorder', 'ps-execution-plans'],
  },

  // ===== DELTA LAKE VACUUM (4 questions) =====

  {
    id: 'delta-vacuum-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DELTA_OPERATIONS,
    question: 'What is the primary function of the VACUUM command in Delta Lake?',
    options: [
      { id: 'a', text: 'It permanently removes unreferenced raw data files older than the retention threshold.', isCorrect: true },
      { id: 'b', text: 'It compacts small Parquet files into larger target files to reduce metadata overhead.', isCorrect: false },
      { id: 'c', text: 'It deletes soft-deleted table rows from the transaction log without rewriting files.', isCorrect: false },
      { id: 'd', text: 'It updates column histogram statistics to optimize Catalyst query execution plans.', isCorrect: false },
    ],
    explanation: 'VACUUM permanently deletes data files that are no longer referenced by the latest Delta transaction log state and are older than the retention threshold (default 7 days).',
    tags: ['delta', 'vacuum', 'cleanup'],
    concepts: ['delta-acid', 'delta-vacuum'],
  },

  {
    id: 'delta-vacuum-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DELTA_OPERATIONS,
    language: CodeLanguage.SQL,
    question: 'Write a SQL statement to run VACUUM on Delta table "orders" using the default 7-day retention period.',
    starterCode: `-- Vacuum orders table\n`,
    testCases: [
      {
        input: 'orders table',
        expectedOutput: 'VACUUM orders',
        description: 'Should vacuum table',
      },
    ],
    solution: `VACUUM orders`,
    explanation: 'VACUUM orders removes unreferenced files older than spark.databricks.delta.vacuum.parallelDelete.enabled default retention of 7 days.',
    tieredHints: {
      apiSignature: 'VACUUM table_name [RETAIN num HOURS]',
      skeleton: `-- ____ orders\n____ ____`,
    },
    hints: ['Use VACUUM table_name'],
    tags: ['delta', 'vacuum'],
    concepts: ['delta-acid', 'delta-vacuum'],
  },

  {
    id: 'delta-vacuum-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DELTA_OPERATIONS,
    language: CodeLanguage.SQL,
    question: 'Write a SQL statement to run VACUUM on Delta table "transactions" with a custom retention period of 168 hours.',
    starterCode: `-- Vacuum transactions with retention\n`,
    testCases: [
      {
        input: 'transactions table',
        expectedOutput: 'VACUUM transactions RETAIN 168 HOURS',
        description: 'Should vacuum with retention',
      },
    ],
    solution: `VACUUM transactions RETAIN 168 HOURS`,
    explanation: 'VACUUM table_name RETAIN n HOURS specifies a custom retention window in hours. Files committed earlier than 168 hours ago (7 days) will be deleted.',
    tieredHints: {
      apiSignature: 'VACUUM table_name RETAIN num HOURS',
      skeleton: `____ transactions ____ 168 ____`,
    },
    hints: ['Use VACUUM table RETAIN n HOURS'],
    tags: ['delta', 'vacuum', 'retention'],
    concepts: ['delta-acid', 'delta-vacuum'],
  },

  // ===== ADDITIONAL DBUTILS (mounts) =====
  // Duplicate widget/fs/notebook questions removed — already covered in dbutils-1 through dbutils-20 above.


  {
    id: 'dbutils-mount-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_UTILITIES,
    language: CodeLanguage.PYTHON,
    question: 'Write a Python statement using Databricks filesystem utilities to list all currently mounted storage locations into variable "mounts".',
    starterCode: `# List mounts\nmounts = `,
    testCases: [
      {
        input: '',
        expectedOutput: 'dbutils.fs.mounts()',
        description: 'Should list all mounts',
      },
    ],
    solution: `mounts = dbutils.fs.mounts()`,
    explanation: 'dbutils.fs.mounts() returns a list of all mount points and their source locations.',
    tieredHints: {
      apiSignature: 'dbutils.fs.mounts() -> List[MountInfo]',
      skeleton: `____ = dbutils.____.____()`,
    },
    hints: ['Use dbutils.fs.mounts()'],
    tags: ['dbutils', 'fs', 'mounts', 'list'],
    concepts: ['dbx-utilities', 'dbx-dbfs'],
  },

  {
    id: 'dbutils-mount-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_UTILITIES,
    language: CodeLanguage.PYTHON,
    question: 'Write a Python statement using Databricks filesystem utilities to unmount storage path "/mnt/data".',
    starterCode: `# Unmount storage path\n`,
    testCases: [
      {
        input: 'mount point',
        expectedOutput: 'dbutils.fs.unmount("/mnt/data")',
        description: 'Should unmount storage',
      },
    ],
    solution: `dbutils.fs.unmount("/mnt/data")
# OR
dbutils.fs.unmount(mount_point="/mnt/data")`,
    explanation: 'dbutils.fs.unmount() removes the mount point, making the storage no longer accessible at that path.',
    tieredHints: {
      apiSignature: 'dbutils.fs.unmount(mount_point: str) -> bool',
      skeleton: `____.fs.____("____")`,
    },
    hints: ['Use dbutils.fs.unmount(mount_point)'],
    tags: ['dbutils', 'fs', 'unmount'],
    concepts: ['dbx-utilities', 'dbx-dbfs'],
  },

];

