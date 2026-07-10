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
    question: 'Using DataFrame "df" (which has an "email" column), create a new "email_lower" column that contains the lowercase version of the email.',
    starterCode: `# Import the lowercase string helper from pyspark.sql.functions\n# Assign result = df with a new "email_lower" column holding the lowercased email\n`,
    testCases: [
      {
        input: 'df with email column',
        expectedOutput: 'lower(df.email) or lower("email")',
        description: 'Should convert email to lowercase',
      },
    ],
    solution: `from pyspark.sql.functions import lower\n\nresult = df.withColumn("email_lower", lower(df.email))\n# OR\nresult = df.withColumn("email_lower", lower("email"))`,
    explanation: 'The lower() function converts all characters in a string column to lowercase. upper() does the opposite.',
    hints: ['Use lower() function from pyspark.sql.functions', 'Pass the column as argument'],
    tags: ['string', 'lower', 'functions'],
    concepts: ['ps-string-fns'],
  },

  {
    id: 'string-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.STRING_FUNCTIONS,
    language: CodeLanguage.PYTHON,
    question: 'Using DataFrame "df" (which has a "name" column), convert the "name" column to uppercase and store it in a new column "name_upper".',
    starterCode: `# Import the uppercase string helper from pyspark.sql.functions\n# Assign result = df with a new "name_upper" column holding the uppercased name\n`,
    testCases: [
      {
        input: 'df with name column',
        expectedOutput: 'upper(df.name) or upper("name")',
        description: 'Should convert name to uppercase',
      },
    ],
    solution: `from pyspark.sql.functions import upper\n\nresult = df.withColumn("name_upper", upper(df.name))\n# OR\nresult = df.withColumn("name_upper", upper("name"))`,
    explanation: 'The upper() function converts all characters in a string column to uppercase. You can reference columns using df.column_name or "column_name".',
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
    question: 'Using DataFrame "df" (which has "first_name" and "last_name" columns), create a new "full_name" column by concatenating first_name and last_name with a space between them.',
    starterCode: `# Import the concat helper and lit from pyspark.sql.functions\n# Assign result = df with "full_name" column joining first_name, a space literal, and last_name\n`,
    testCases: [
      {
        input: 'df with first_name and last_name columns',
        expectedOutput: 'concat(df.first_name, lit(" "), df.last_name)',
        description: 'Should concatenate with space',
      },
    ],
    solution: `from pyspark.sql.functions import concat, lit, col\n\nresult = df.withColumn("full_name", concat(df.first_name, lit(" "), df.last_name))\n# OR\nresult = df.withColumn("full_name", concat(col("first_name"), lit(" "), col("last_name")))`,
    explanation: 'concat() joins multiple columns/values together. lit() creates a literal constant value (like a space). You can use df.column_name or col("column_name") to reference columns.',
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
    question: 'Using DataFrame "df" (columns: city, state, country), concatenate them separated by commas using concat_ws and store in "location".',
    starterCode: `# Import the separator-aware concatenation helper from pyspark.sql.functions\n# Assign result = df with "location" column joining city, state, country with ", "\n`,
    testCases: [
      {
        input: 'df with city, state, country columns',
        expectedOutput: 'concat_ws(", ", df.city, df.state, df.country)',
        description: 'Should concatenate with comma separator',
      },
    ],
    solution: `from pyspark.sql.functions import concat_ws\n\nresult = df.withColumn("location", concat_ws(", ", df.city, df.state, df.country))\n# OR\nresult = df.withColumn("location", concat_ws(",", "city", "state", "country"))`,
    explanation: 'concat_ws() concatenates strings with a specified separator (first argument). More convenient than using concat() with multiple lit() calls.',
    hints: ['Use concat_ws()', 'First argument is the separator'],
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
    question: 'Using DataFrame "df" (which has a "product_code" column like "ABC12345"), extract the first 3 characters and store in "category".',
    starterCode: ``,
    testCases: [
      {
        input: 'df with product_code column',
        expectedOutput: 'substring(df.product_code, 1, 3)',
        description: 'Should extract first 3 characters',
      },
    ],
    solution: `from pyspark.sql.functions import substring\n\nresult = df.withColumn("category", substring(df.product_code, 1, 3))\n# OR\nresult = df.withColumn("category", substring("product_code", 1, 3))`,
    explanation: 'substring(column, start_position, length) extracts a portion of a string. Positions are 1-indexed in Spark SQL.',
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
    question: 'Using DataFrame "df" (which has a "description" column with leading/trailing spaces), remove whitespace and store in a new column "description_clean".',
    starterCode: `# Import the whitespace-trim helper from pyspark.sql.functions\n# Assign result = df with "description_clean" column holding trimmed description\n`,
    testCases: [
      {
        input: 'df with description column containing whitespace',
        expectedOutput: 'trim(df.description)',
        description: 'Should remove leading and trailing whitespace',
      },
    ],
    solution: `from pyspark.sql.functions import trim\n\nresult = df.withColumn("description_clean", trim(df.description))\n# OR\nresult = df.withColumn("description_clean", trim("description"))`,
    explanation: 'trim() removes leading and trailing whitespace. ltrim() removes only leading, rtrim() removes only trailing.',
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
    question: 'Using DataFrame "df" (which has a "tags" column containing comma-separated values like "python,spark,sql"), split it into an array column called "tags_array".',
    starterCode: `# Import the string-splitting helper from pyspark.sql.functions\n# Assign result = df with a new "tags_array" column splitting tags on ","\n`,
    testCases: [
      {
        input: 'df with tags column containing comma-separated values',
        expectedOutput: 'split(df.tags, ",")',
        description: 'Should split on comma into array',
      },
    ],
    solution: `from pyspark.sql.functions import split\n\nresult = df.withColumn("tags_array", split(df.tags, ","))\n# OR\nresult = df.withColumn("tags_array", split("tags", ","))`,
    explanation: 'split(column, delimiter) divides a string into an array based on the delimiter. The result is an ArrayType column.',
    hints: ['Use split() function', 'First argument is column, second is delimiter'],
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
    question: 'Using DataFrame "df" (which has a "text" column like "Order 12345 confirmed"), replace all digits with "X" and store in "text_masked".',
    starterCode: `# Import the regex-replacement helper from pyspark.sql.functions\n# Assign result = df with "masked_text" column replacing every digit with "X"\n`,
    testCases: [
      {
        input: 'df with text column containing digits',
        expectedOutput: 'regexp_replace(df.text, "[0-9]", "X")',
        description: 'Should replace all digits with X',
      },
    ],
    solution: `from pyspark.sql.functions import regexp_replace\n\nresult = df.withColumn("masked_text", regexp_replace(df.text, "[0-9]", "X"))\n# OR replace all digits\nresult = df.withColumn("masked_text", regexp_replace(df.text, "\\\\d", "X"))`,
    explanation: 'regexp_replace(column, pattern, replacement) replaces all occurrences matching the regex pattern with the replacement string.',
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
    question: 'Using DataFrame "df" (which has a "username" column containing values like "john@doe!"), remove all special characters (non-alphanumeric) and store in "username_clean".',
    starterCode: `# Import the regex-replacement helper from pyspark.sql.functions\n# Assign result = df with "username_clean" column removing non-alphanumeric characters\n`,
    testCases: [
      {
        input: 'df with username column',
        expectedOutput: 'regexp_replace(df.username, "[^a-zA-Z0-9]", "")',
        description: 'Should remove non-alphanumeric characters',
      },
    ],
    solution: `from pyspark.sql.functions import regexp_replace\n\nresult = df.withColumn("username_clean", regexp_replace(df.username, "[^a-zA-Z0-9]", ""))`,
    explanation: 'The pattern [^a-zA-Z0-9] matches any character that is NOT alphanumeric. The ^ inside brackets means negation.',
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
    question: 'Using DataFrame "df" (which has an "email" column like "user@example.com"), extract the domain name (e.g. "example.com") using regexp_extract and store in "domain".',
    starterCode: `# Import the regex-extraction helper from pyspark.sql.functions\n# Assign result = df with a new "domain" column pulling the group after "@"\n`,
    testCases: [
      {
        input: 'df with email column',
        expectedOutput: 'regexp_extract(df.email, "@(.+)", 1)',
        description: 'Should extract domain after @',
      },
    ],
    solution: `from pyspark.sql.functions import regexp_extract\n\nresult = df.withColumn("domain", regexp_extract(df.email, "@(.+)", 1))`,
    explanation: 'regexp_extract(column, pattern, group_index) extracts the specified regex group. Group 0 is the entire match, group 1 is the first captured group in parentheses.',
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
    question: 'Using DataFrame "df" (which has a "comment" column), calculate the length of each string and store in "comment_length".',
    starterCode: `# Import the character-count helper from pyspark.sql.functions\n# Assign result = df with "comment_length" column holding the length of comment\n`,
    testCases: [
      {
        input: 'df with comment column',
        expectedOutput: 'length(df.comment)',
        description: 'Should calculate string length',
      },
    ],
    solution: `from pyspark.sql.functions import length\n\nresult = df.withColumn("comment_length", length(df.comment))\n# OR\nresult = df.withColumn("comment_length", length("comment"))`,
    explanation: 'length() returns the number of characters in a string.',
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
    question: 'Using DataFrame "df", add a new column called "today" containing the current date.',
    starterCode: `# Import the appropriate pyspark.sql.functions helper\n# Assign result = df with a new column "today" holding the current date\n`,
    testCases: [
      {
        input: 'df',
        expectedOutput: 'current_date()',
        description: 'Should add current date',
      },
    ],
    solution: `from pyspark.sql.functions import current_date\n\nresult = df.withColumn("today", current_date())`,
    explanation: 'current_date() returns the current date. current_timestamp() returns the current date and time.',
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
    question: 'Using DataFrame "df", add a new column called "now" containing the current timestamp.',
    starterCode: `# Import the appropriate pyspark.sql.functions helper\n# Assign result = df with a new column "now" holding the current timestamp\n`,
    testCases: [
      {
        input: 'df',
        expectedOutput: 'current_timestamp()',
        description: 'Should add current timestamp',
      },
    ],
    solution: `from pyspark.sql.functions import current_timestamp\n\nresult = df.withColumn("now", current_timestamp())`,
    explanation: 'current_timestamp() returns the current timestamp including date and time.',
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
    question: 'Using DataFrame "df" (which has a "date_string" column with values like "2023-12-25"), convert it to a date type and store in "date_parsed".',
    starterCode: `# Import the string-to-date helper from pyspark.sql.functions\n# Assign result = df with a new "date" column parsed from date_string using "yyyy-MM-dd"\n`,
    testCases: [
      {
        input: 'df with date_string column',
        expectedOutput: 'to_date(df.date_string, "yyyy-MM-dd")',
        description: 'Should convert string to date',
      },
    ],
    solution: `from pyspark.sql.functions import to_date\n\nresult = df.withColumn("date", to_date(df.date_string, "yyyy-MM-dd"))\n# OR\nresult = df.withColumn("date", to_date("date_string", "yyyy-MM-dd"))`,
    explanation: 'to_date(column, format) converts a string to a date. If format matches yyyy-MM-dd, the format parameter is optional.',
    hints: ['Use to_date() function', 'Format: "yyyy-MM-dd"'],
    tags: ['datetime', 'to_date', 'conversion', 'functions'],
    concepts: ['ps-datetime-fns', 'ps-cast-types'],
  },

  {
    id: 'datetime-4',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATETIME_FUNCTIONS,
    language: CodeLanguage.PYTHON,
    question: 'Using DataFrame "df" (which has a "ts_string" column with values like "2023-12-25 14:30:00"), convert it to a timestamp type and store in "event_time".',
    starterCode: `# Import the string-to-timestamp helper from pyspark.sql.functions\n# Assign result = df with "timestamp" column parsed from ts_string using "yyyy-MM-dd HH:mm:ss"\n`,
    testCases: [
      {
        input: 'df with timestamp_string column',
        expectedOutput: 'to_timestamp(df.timestamp_string, "yyyy-MM-dd HH:mm:ss")',
        description: 'Should convert string to timestamp',
      },
    ],
    solution: `from pyspark.sql.functions import to_timestamp\n\nresult = df.withColumn("timestamp", to_timestamp(df.timestamp_string, "yyyy-MM-dd HH:mm:ss"))\n# OR\nresult = df.withColumn("timestamp", to_timestamp("timestamp_string", "yyyy-MM-dd HH:mm:ss"))`,
    explanation: 'to_timestamp(column, format) converts a string to a timestamp type.',
    hints: ['Use to_timestamp()', 'Format includes date and time: "yyyy-MM-dd HH:mm:ss"'],
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
    question: 'Using DataFrame "df" (which has an "order_date" date column), add 30 days to create a "due_date" column.',
    starterCode: `# Import the date-offset helper from pyspark.sql.functions\n# Assign result = df with "due_date" column set 30 days after order_date\n`,
    testCases: [
      {
        input: 'df with order_date column',
        expectedOutput: 'date_add(df.order_date, 30)',
        description: 'Should add 30 days',
      },
    ],
    solution: `from pyspark.sql.functions import date_add\n\nresult = df.withColumn("due_date", date_add(df.order_date, 30))\n# OR\nresult = df.withColumn("due_date", date_add("order_date", 30))`,
    explanation: 'date_add(date_column, num_days) adds the specified number of days to a date.',
    hints: ['Use date_add()', 'Second parameter is number of days'],
    tags: ['datetime', 'date_add', 'functions'],
    concepts: ['ps-datetime-fns'],
  },

  {
    id: 'datetime-6',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATETIME_FUNCTIONS,
    language: CodeLanguage.PYTHON,
    question: 'Using DataFrame "df" (columns: id, event_name, end_date — where end_date is a date type), subtract 7 days from "end_date" to create a "reminder_date" column.',
    starterCode: `# Import the date-subtraction helper from pyspark.sql.functions\n# Assign result = df with "reminder_date" column 7 days before end_date\n`,
    testCases: [
      {
        input: 'df with end_date column',
        expectedOutput: 'date_sub(df.end_date, 7)',
        description: 'Should subtract 7 days',
      },
    ],
    solution: `from pyspark.sql.functions import date_sub\n\nresult = df.withColumn("reminder_date", date_sub(df.end_date, 7))\n# OR\nresult = df.withColumn("reminder_date", date_sub("end_date", 7))`,
    explanation: 'date_sub(date_column, num_days) subtracts the specified number of days from a date.',
    hints: ['Use date_sub()', 'Second parameter is number of days to subtract'],
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
    question: 'Using DataFrame "df" (columns: id, start_date, end_date — both date types), calculate the number of days between end_date and start_date and store in "duration_days".',
    starterCode: `# Import the date-difference helper from pyspark.sql.functions\n# Assign result = df with "duration_days" column holding end_date minus start_date\n`,
    testCases: [
      {
        input: 'df with end_date and start_date columns',
        expectedOutput: 'datediff(df.end_date, df.start_date)',
        description: 'Should calculate difference in days',
      },
    ],
    solution: `from pyspark.sql.functions import datediff\n\nresult = df.withColumn("duration_days", datediff(df.end_date, df.start_date))`,
    explanation: 'datediff(end_date, start_date) returns the number of days between two dates. Returns end_date - start_date.',
    hints: ['Use datediff()', 'First parameter is end date, second is start date'],
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
    question: 'Using DataFrame "df" (which has a "birth_date" date column), extract the year and store in "birth_year".',
    starterCode: `# Import the year-extraction helper from pyspark.sql.functions\n# Assign result = df with "birth_year" column derived from birth_date\n`,
    testCases: [
      {
        input: 'df with birth_date column',
        expectedOutput: 'year(df.birth_date)',
        description: 'Should extract year',
      },
    ],
    solution: `from pyspark.sql.functions import year\n\nresult = df.withColumn("birth_year", year(df.birth_date))\n# OR\nresult = df.withColumn("birth_year", year("birth_date"))`,
    explanation: 'year() extracts the year from a date/timestamp. Similarly, month() and day() extract month and day.',
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
    question: 'Using DataFrame "df" (which has a "transaction_date" date column), extract the month number and store in "txn_month".',
    starterCode: `# Import the month-extraction helper from pyspark.sql.functions\n# Assign result = df with "txn_month" column derived from transaction_date\n`,
    testCases: [
      {
        input: 'df with transaction_date column',
        expectedOutput: 'month(df.transaction_date)',
        description: 'Should extract month',
      },
    ],
    solution: `from pyspark.sql.functions import month\n\nresult = df.withColumn("transaction_month", month(df.transaction_date))\n# OR\nresult = df.withColumn("transaction_month", month("transaction_date"))`,
    explanation: 'month() extracts the month (1-12) from a date/timestamp.',
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
    question: 'Using DataFrame "df" (which has an "event_date" date column), extract the day of the month and store in "event_day".',
    starterCode: `# Import the helper that extracts the day-of-month from a date column\n# Assign result = df with a new "event_day" column derived from event_date\n`,
    testCases: [
      {
        input: 'df with event_date column',
        expectedOutput: 'dayofmonth(df.event_date)',
        description: 'Should extract day of month',
      },
    ],
    solution: `from pyspark.sql.functions import dayofmonth\n\nresult = df.withColumn("event_day", dayofmonth(df.event_date))\n# OR\nresult = df.withColumn("event_day", dayofmonth("event_date"))`,
    explanation: 'dayofmonth() extracts the day of month (1-31) from a date/timestamp.',
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
    question: 'Using DataFrame "df" (which has an "order_date" date column), format it as a string in "MM/dd/yyyy" format and store in "order_date_str".',
    starterCode: `# Import the date-to-string helper from pyspark.sql.functions\n# Assign result = df with "order_date_str" column formatted as "MM/dd/yyyy"\n`,
    testCases: [
      {
        input: 'df with order_date column',
        expectedOutput: 'date_format(df.order_date, "MM/dd/yyyy")',
        description: 'Should format date as MM/dd/yyyy',
      },
    ],
    solution: `from pyspark.sql.functions import date_format\n\nresult = df.withColumn("formatted_date", date_format(df.order_date, "MM/dd/yyyy"))\n# OR\nresult = df.withColumn("formatted_date", date_format("order_date", "MM/dd/yyyy"))`,
    explanation: 'date_format(date_column, format) converts a date/timestamp to a string with the specified format.',
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
    question: 'Using DataFrame "df" (columns: id, name, tags — where tags is an array like ["python", "spark", "sql"]), explode the "tags" column so each tag becomes its own row.',
    starterCode: `# Import the pyspark helper that turns an array column into one row per element\n# Select id and the exploded tags aliased as "tag"\n`,
    testCases: [
      {
        input: 'df with id and tags (array) columns',
        expectedOutput: 'explode(df.tags)',
        description: 'Should explode array into rows',
      },
    ],
    solution: `from pyspark.sql.functions import explode\n\nresult = df.select("id", explode(df.tags).alias("tag"))`,
    explanation: 'explode() transforms an array column into multiple rows, one for each array element. Each original row becomes N rows where N is the array length.',
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
    question: 'Using DataFrame "df" (columns: order_id, products — where products is an array that may be null), explode the "products" column and keep rows with null arrays using explode_outer.',
    starterCode: `# Import the null-preserving explode helper from pyspark.sql.functions\n# Select order_id and the exploded products aliased as "product"\n`,
    testCases: [
      {
        input: 'df with order_id and products (array with possible nulls)',
        expectedOutput: 'explode_outer(df.products)',
        description: 'Should explode and preserve null arrays',
      },
    ],
    solution: `from pyspark.sql.functions import explode_outer\n\nresult = df.select("order_id", explode_outer(df.products).alias("product"))`,
    explanation: 'explode_outer() is like explode() but preserves rows with null or empty arrays by creating a row with null. Regular explode() removes those rows.',
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
    question: 'Using DataFrame "df" (columns: id, name, skills — where skills is an array like ["Python", "SQL", "Java"]), filter rows where the "skills" array contains "Python".',
    starterCode: `# Import the array-containment helper from pyspark.sql.functions\n# Assign result = df filtered to rows where the skills array contains "Python"\n`,
    testCases: [
      {
        input: 'df with skills array column',
        expectedOutput: 'array_contains(df.skills, "Python")',
        description: 'Should filter arrays containing Python',
      },
    ],
    solution: `from pyspark.sql.functions import array_contains\n\nresult = df.filter(array_contains(df.skills, "Python"))`,
    explanation: 'array_contains(array_column, value) returns true if the array contains the specified value.',
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
    question: 'You have a DataFrame with columns col1, col2, col3 (all integers). Which function creates a new column containing all three values as an array?',
    options: [
      { id: 'a', text: 'array(col1, col2, col3) — combines column values into a single array column', isCorrect: true },
      { id: 'b', text: 'collect_list(col1, col2, col3) — aggregates values into a list', isCorrect: false },
      { id: 'c', text: 'concat(col1, col2, col3) — concatenates values together', isCorrect: false },
      { id: 'd', text: 'struct(col1, col2, col3) — creates a nested struct, not an array', isCorrect: false },
    ],
    explanation: 'array() creates an array column from individual column values. concat() merges arrays or strings but doesn\'t create a new array from scalars. struct() creates a named struct (like a nested object), not an array. collect_list() is an aggregation function used with groupBy.',
    tags: ['collection', 'array', 'create', 'functions'],
    concepts: ['ps-collection-fns', 'ps-dataframe-create'],
  },

  // ARRAY_SORT
  {
    id: 'collection-5',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.COLLECTION_FUNCTIONS,
    question: 'You have a DataFrame with a "scores" array column like [85, 92, 71]. Which function sorts the array elements in ascending order?',
    options: [
      { id: 'a', text: 'sort_array(scores) — this function doesn\'t exist in PySpark', isCorrect: false },
      { id: 'b', text: 'array_sort(scores) — sorts elements within each array ascending', isCorrect: true },
      { id: 'c', text: 'orderBy("scores") — this sorts rows, not array elements', isCorrect: false },
      { id: 'd', text: 'array_order(scores) — this function doesn\'t exist', isCorrect: false },
    ],
    explanation: 'array_sort() sorts the elements within each array value in ascending order. Don\'t confuse it with orderBy()/sort() which sort DataFrame rows. Note: sort_array() also exists in PySpark and allows a boolean parameter for ascending/descending.',
    tags: ['collection', 'array_sort', 'array', 'functions'],
    concepts: ['ps-collection-fns'],
  },

  // SIZE
  {
    id: 'collection-6',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.COLLECTION_FUNCTIONS,
    question: 'Which PySpark function returns the number of elements in an array or map column?',
    options: [
      { id: 'a', text: 'length() — works on strings, not arrays', isCorrect: false },
      { id: 'b', text: 'count() — this is an aggregation function for rows, not array elements', isCorrect: false },
      { id: 'c', text: 'size() — returns element count for arrays and maps', isCorrect: true },
      { id: 'd', text: 'len() — this is Python built-in, not a PySpark function', isCorrect: false },
    ],
    explanation: 'size() returns the number of elements in an array or the number of key-value pairs in a map. For strings, use length(). count() is a row-level aggregation. Python\'s len() doesn\'t work on DataFrame columns.',
    tags: ['collection', 'size', 'array', 'functions'],
    concepts: ['ps-collection-fns'],
  },

  // CONCAT (arrays)
  {
    id: 'collection-7',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.COLLECTION_FUNCTIONS,
    question: 'You have two array columns "arr1" and "arr2". Which approach merges them into a single array?',
    options: [
      { id: 'a', text: 'array_union(arr1, arr2) — merges but removes duplicates (not a simple concat)', isCorrect: false },
      { id: 'b', text: 'flatten(array(arr1, arr2)) — creates nested array then flattens (works but unnecessarily complex)', isCorrect: false },
      { id: 'c', text: 'arr1 + arr2 — Python addition doesn\'t work on PySpark array columns', isCorrect: false },
      { id: 'd', text: 'concat(arr1, arr2) — concatenates two arrays into one', isCorrect: true },
    ],
    explanation: 'concat() works on both strings and arrays — for arrays it combines all elements into a single array, preserving duplicates and order. array_union() also merges but removes duplicates. flatten(array(...)) works but is roundabout.',
    tags: ['collection', 'concat', 'array', 'functions'],
    concepts: ['ps-collection-fns', 'ps-string-fns'],
  },

  // FLATTEN
  {
    id: 'collection-8',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.COLLECTION_FUNCTIONS,
    question: 'You have a column "nested" containing arrays of arrays like [[1,2],[3,4]]. Which function converts this into a single flat array [1,2,3,4]?',
    options: [
      { id: 'a', text: 'flatten(nested) — flattens one level of nesting into a single array', isCorrect: true },
      { id: 'b', text: 'explode(nested) — this creates separate rows, not a flat array', isCorrect: false },
      { id: 'c', text: 'concat(nested) — this concatenates strings or arrays, but doesn\'t unnest', isCorrect: false },
      { id: 'd', text: 'array_flatten(nested) — this function doesn\'t exist in PySpark', isCorrect: false },
    ],
    explanation: 'flatten() removes one level of array nesting: [[1,2],[3,4]] becomes [1,2,3,4]. Don\'t confuse with explode() which creates separate rows — flatten keeps it as a single array column. Only flattens one level deep.',
    tags: ['collection', 'flatten', 'array', 'nested', 'functions'],
    concepts: ['ps-collection-fns'],
  },

  // STRUCT
  {
    id: 'collection-9',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.COLLECTION_FUNCTIONS,
    question: 'What is the difference between array() and struct() in PySpark?',
    options: [
      { id: 'a', text: 'They are interchangeable — both create nested columns', isCorrect: false },
      { id: 'b', text: 'array() creates a list of same-type values (like [1,2,3]). struct() creates a named record with mixed types (like {street: "Main", city: "NYC", zip: 10001}).', isCorrect: true },
      { id: 'c', text: 'struct() is for SQL only, array() is for PySpark only', isCorrect: false },
      { id: 'd', text: 'array() supports nested types, struct() does not', isCorrect: false },
    ],
    explanation: 'array() creates a column of type ArrayType — a list of values that must all be the same type. struct() creates a column of type StructType — a named record (like a dict/object) where each field can have a different type. Use array for homogeneous lists, struct for heterogeneous records.',
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
    question: 'Using DataFrame "df" (which has a "price" column with values like 19.9876), round to 2 decimal places and store in "price_rounded".',
    starterCode: `# Import the rounding helper from pyspark.sql.functions\n# Assign result = df with "price_rounded" column holding price rounded to 2 decimals\n`,
    testCases: [
      {
        input: 'df with price column',
        expectedOutput: 'round(df.price, 2)',
        description: 'Should round to 2 decimal places',
      },
    ],
    solution: `from pyspark.sql.functions import round\n\nresult = df.withColumn("price_rounded", round(df.price, 2))\n# OR\nresult = df.withColumn("price_rounded", round("price", 2))`,
    explanation: 'round(column, decimal_places) rounds a numeric column to the specified number of decimal places.',
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
    question: 'Using DataFrame "df" (which has a "score" column with decimal values like 3.2, 4.7), get the ceiling (round up) and store in "score_ceil".',
    starterCode: `# Import the round-up helper from pyspark.sql.functions\n# Assign result = df with a new "score_ceil" column holding the ceiling of score\n`,
    testCases: [
      {
        input: 'df with score column',
        expectedOutput: 'ceil(df.score)',
        description: 'Should round up to nearest integer',
      },
    ],
    solution: `from pyspark.sql.functions import ceil\n\nresult = df.withColumn("score_ceil", ceil(df.score))\n# OR\nresult = df.withColumn("score_ceil", ceil("score"))`,
    explanation: 'ceil() rounds up to the nearest integer. floor() rounds down.',
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
    question: 'Using DataFrame "df" (which has a "balance" column with values like -150.00, 200.50), get the absolute value and store in "abs_balance".',
    starterCode: `# Import the absolute-value helper from pyspark.sql.functions\n# Assign result = df with "abs_balance" column holding the absolute value of balance\n`,
    testCases: [
      {
        input: 'df with balance column',
        expectedOutput: 'abs(df.balance)',
        description: 'Should get absolute value',
      },
    ],
    solution: `from pyspark.sql.functions import abs\n\nresult = df.withColumn("abs_balance", abs(df.balance))\n# OR\nresult = df.withColumn("abs_balance", abs("balance"))`,
    explanation: 'abs() returns the absolute value of a number (removes negative sign).',
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
    question: 'Using DataFrame "df" (which has an "area" column with values like 144, 256), calculate the square root and store in "side_length".',
    starterCode: `# Import the square-root helper from pyspark.sql.functions\n# Assign result = df with a new "side_length" column holding sqrt(area)\n`,
    testCases: [
      {
        input: 'df with area column',
        expectedOutput: 'sqrt(df.area)',
        description: 'Should calculate square root',
      },
    ],
    solution: `from pyspark.sql.functions import sqrt\n\nresult = df.withColumn("side_length", sqrt(df.area))\n# OR\nresult = df.withColumn("side_length", sqrt("area"))`,
    explanation: 'sqrt() calculates the square root of a number.',
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
    question: 'Using DataFrame "df" (which has an "exponent" column with values like 3, 5, 8), calculate 2 raised to the power of each exponent and store in "result".',
    starterCode: `# Import the power helper and a literal-builder from pyspark.sql.functions\n# Assign result = df with a new "result" column equal to 2 raised to exponent\n`,
    testCases: [
      {
        input: 'df with exponent column',
        expectedOutput: 'pow(lit(2), df.exponent)',
        description: 'Should calculate 2 to the power of exponent',
      },
    ],
    solution: `from pyspark.sql.functions import pow, lit\n\nresult = df.withColumn("result", pow(lit(2), df.exponent))`,
    explanation: 'pow(base, exponent) raises base to the power of exponent. Use lit() to create literal values.',
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
    question: 'Using DataFrame "df" (columns: product, price1, price2), find the maximum value between "price1" and "price2" for each row and store in "max_price".',
    starterCode: `# Import the "pick the largest across columns" helper from pyspark.sql.functions\n# Assign result = df with "max_price" column holding the row-wise max of price1 and price2\n`,
    testCases: [
      {
        input: 'df with price1 and price2 columns',
        expectedOutput: 'greatest(df.price1, df.price2)',
        description: 'Should get maximum value per row',
      },
    ],
    solution: `from pyspark.sql.functions import greatest\n\nresult = df.withColumn("max_price", greatest(df.price1, df.price2))`,
    explanation: 'greatest() returns the maximum value among multiple columns for each row. least() returns the minimum.',
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
    question: 'Using DataFrame "df" (columns: id, name, department, salary), add a "row_num" column using row_number() partitioned by department, ordered by salary descending.',
    starterCode: ``,
    testCases: [
      {
        input: 'df with department and salary',
        expectedOutput: 'row_number().over(windowSpec)',
        description: 'Should add row number within each department',
      },
    ],
    solution: `from pyspark.sql.window import Window\nfrom pyspark.sql.functions import row_number, col\n\nwindowSpec = Window.partitionBy("department").orderBy(col("salary").desc())\nresult = df.withColumn("row_num", row_number().over(windowSpec))`,
    explanation: 'row_number() assigns a sequential number to rows within each partition. Unlike rank(), it always has unique numbers even for tied values.',
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
    question: 'Using DataFrame "df" (columns: id, name, department, salary), add a "dense_rank" column that ranks employees by salary (highest first) within each department, with no gaps in ranking.',
    starterCode: ``,
    testCases: [
      {
        input: 'df with department and salary',
        expectedOutput: 'dense_rank().over(windowSpec)',
        description: 'Should add dense rank within department',
      },
    ],
    solution: `from pyspark.sql.window import Window\nfrom pyspark.sql.functions import dense_rank, desc\n\nwindowSpec = Window.partitionBy("department").orderBy(desc("salary"))\nresult = df.withColumn("dense_rank", dense_rank().over(windowSpec))`,
    explanation: 'dense_rank() is like rank() but without gaps. If two rows tie for rank 1, the next rank is 2 (not 3).',
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
    question: 'Using DataFrame "df" (columns: employee_id, salary, date), get the previous row\'s salary using lag() ordered by date, and store in "previous_salary".',
    starterCode: ``,
    testCases: [
      {
        input: 'df with date and salary',
        expectedOutput: 'lag(df.salary, 1).over(windowSpec)',
        description: 'Should get previous row salary',
      },
    ],
    solution: `from pyspark.sql.window import Window\nfrom pyspark.sql.functions import lag\n\nwindowSpec = Window.orderBy("date")\nresult = df.withColumn("previous_salary", lag(df.salary, 1).over(windowSpec))`,
    explanation: 'lag(column, offset) retrieves the value from a previous row. offset=1 means previous row, offset=2 means 2 rows back.',
    hints: ['Use lag(column, offset).over()', 'offset=1 for previous row'],
    tags: ['window', 'lag', 'functions'],
    concepts: ['sql-window-ranking', 'sql-window-offset'],
  },

  {
    id: 'window-4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.WINDOW_FUNCTIONS,
    question: 'lag() retrieves a value from a previous row. Which function does the opposite — retrieving a value from the NEXT row?',
    options: [
      { id: 'a', text: 'next(column) — this function doesn\'t exist in PySpark', isCorrect: false },
      { id: 'b', text: 'lag(column, -1) — negative offset doesn\'t work in PySpark lag()', isCorrect: false },
      { id: 'c', text: 'lead(column, offset) — looks forward by offset rows. The last row returns NULL.', isCorrect: true },
      { id: 'd', text: 'first(column) — this returns the first value in the partition, not the next row', isCorrect: false },
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
    question: 'To calculate a running total (cumulative sum) in PySpark, which window frame specification should you use?',
    options: [
      { id: 'a', text: 'rowsBetween(Window.currentRow, Window.unboundedFollowing) — this sums from current row to the last row (reverse cumulative)', isCorrect: false },
      { id: 'b', text: 'rangeBetween(-1, 0) — this only includes the previous and current row', isCorrect: false },
      { id: 'c', text: 'No frame is needed — sum().over() already produces a running total by default', isCorrect: false },
      { id: 'd', text: 'rowsBetween(Window.unboundedPreceding, Window.currentRow) — sums from the first row to the current row', isCorrect: true },
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
      { id: 'a', text: 'ntile(4) — distributes rows into n approximately equal numbered groups', isCorrect: true },
      { id: 'b', text: 'percent_rank() — this returns a 0.0-1.0 value, not group numbers', isCorrect: false },
      { id: 'c', text: 'rank() — this assigns ranking positions (1,2,3...), not equal groups', isCorrect: false },
      { id: 'd', text: 'dense_rank() — same as rank but without gaps, still not equal groups', isCorrect: false },
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
    question: 'Read a Delta table from the path "/data/sales_delta".',
    starterCode: `# Read Delta table\ndf = spark.read.`,
    testCases: [
      {
        input: 'Delta table at /data/sales_delta',
        expectedOutput: 'spark.read.format("delta").load("/data/sales_delta")',
        description: 'Should read Delta table',
      },
    ],
    solution: `df = spark.read.format("delta").load("/data/sales_delta")`,
    explanation: 'To read Delta tables, use format("delta") and load() with the path. Delta Lake provides ACID transactions and versioning.',
    hints: ['Use format("delta")', 'Use load() with the path'],
    tags: ['delta', 'read', 'delta-lake'],
    concepts: ['delta-acid', 'ps-io-csv'],
  },

  {
    id: 'delta-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DELTA_LAKE_BASICS,
    language: CodeLanguage.PYTHON,
    question: 'Write a DataFrame to a Delta table at "/data/customers_delta", overwriting existing data.',
    starterCode: `# Write DataFrame as Delta\ndf.write.`,
    testCases: [
      {
        input: 'df to write as Delta',
        expectedOutput: 'df.write.format("delta").mode("overwrite").save("/data/customers_delta")',
        description: 'Should write Delta table with overwrite mode',
      },
    ],
    solution: `df.write.format("delta").mode("overwrite").save("/data/customers_delta")`,
    explanation: 'Write Delta tables using format("delta"), specify save mode ("overwrite", "append", etc.), and save() with path.',
    hints: ['Use format("delta")', 'Use mode("overwrite")', 'Use save() with path'],
    tags: ['delta', 'write', 'delta-lake'],
    concepts: ['delta-acid', 'ps-write-modes'],
  },

  {
    id: 'delta-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DELTA_OPERATIONS,
    language: CodeLanguage.SQL,
    question: 'Write a SQL query to UPDATE the "price" column to 100 in the employees table where department is "Sales".',
    starterCode: `-- Write UPDATE query\n`,
    testCases: [
      {
        input: 'employees Delta table',
        expectedOutput: 'UPDATE employees SET price = 100 WHERE department = "Sales"',
        description: 'Should update price for Sales department',
      },
    ],
    solution: `UPDATE employees SET price = 100 WHERE department = 'Sales'`,
    explanation: 'Delta Lake supports UPDATE operations with WHERE conditions. This modifies matching rows in place with ACID guarantees.',
    hints: ['Use UPDATE table SET column = value', 'Add WHERE clause for condition'],
    tags: ['delta', 'update', 'delta-lake', 'sql'],
    concepts: ['delta-acid', 'delta-merge'],
  },

  {
    id: 'delta-4',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DELTA_OPERATIONS,
    language: CodeLanguage.SQL,
    question: 'Write a SQL query to DELETE all rows from the products table where stock is 0.',
    starterCode: `-- Write DELETE query\n`,
    testCases: [
      {
        input: 'products Delta table',
        expectedOutput: 'DELETE FROM products WHERE stock = 0',
        description: 'Should delete rows with stock = 0',
      },
    ],
    solution: `DELETE FROM products WHERE stock = 0`,
    explanation: 'Delta Lake supports DELETE operations with WHERE conditions to remove specific rows.',
    hints: ['Use DELETE FROM table WHERE condition'],
    tags: ['delta', 'delete', 'delta-lake', 'sql'],
    concepts: ['delta-acid', 'delta-merge'],
  },

  {
    id: 'delta-5',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DELTA_OPERATIONS,
    language: CodeLanguage.SQL,
    question: 'Write a MERGE query to upsert data from the "updates" table into the "customers" table (both have columns: id, name, email, city). Update all columns when id matches, insert new rows when no match.',
    starterCode: `-- Write MERGE query\n-- Target: customers, Source: updates\nMERGE INTO customers\nUSING updates\nON customers.id = updates.id\n`,
    testCases: [
      {
        input: 'customers table and updates table',
        expectedOutput: 'WHEN MATCHED THEN UPDATE SET * WHEN NOT MATCHED THEN INSERT *',
        description: 'Should merge with update and insert',
      },
    ],
    solution: `MERGE INTO customers\nUSING updates\nON customers.id = updates.id\nWHEN MATCHED THEN UPDATE SET *\nWHEN NOT MATCHED THEN INSERT *`,
    explanation: 'MERGE (UPSERT) combines UPDATE and INSERT. MATCHED updates existing rows, NOT MATCHED inserts new rows. SET * updates all columns.',
    hints: ['Use WHEN MATCHED THEN UPDATE', 'Use WHEN NOT MATCHED THEN INSERT', 'SET * updates all columns'],
    tags: ['delta', 'merge', 'upsert', 'delta-lake', 'sql'],
    concepts: ['delta-acid', 'delta-merge'],
  },

  {
    id: 'delta-6',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DELTA_TIME_TRAVEL,
    language: CodeLanguage.PYTHON,
    question: 'Using PySpark, read version 5 of a Delta table located at "/data/sales_delta" using time travel.',
    starterCode: `# Read specific version\ndf = spark.read.format("delta").`,
    testCases: [
      {
        input: 'Delta table path',
        expectedOutput: 'option("versionAsOf", 5).load(path)',
        description: 'Should read version 5',
      },
    ],
    solution: `df = spark.read.format("delta").option("versionAsOf", 5).load("/data/sales_delta")`,
    explanation: 'Delta Lake time travel allows reading previous versions using versionAsOf or timestampAsOf options.',
    hints: ['Use option("versionAsOf", version_number)'],
    tags: ['delta', 'time-travel', 'delta-lake', 'versioning'],
    concepts: ['delta-acid', 'delta-time-travel'],
  },

  {
    id: 'delta-7',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DELTA_TIME_TRAVEL,
    language: CodeLanguage.SQL,
    question: 'Write a SQL query to select from the customers table as it was at version 10.',
    starterCode: `-- Query historical version\n`,
    testCases: [
      {
        input: 'customers Delta table',
        expectedOutput: 'SELECT * FROM customers VERSION AS OF 10',
        description: 'Should query version 10',
      },
    ],
    solution: `SELECT * FROM customers VERSION AS OF 10`,
    explanation: 'VERSION AS OF allows querying historical table versions in SQL. You can also use TIMESTAMP AS OF.',
    hints: ['Use VERSION AS OF version_number'],
    tags: ['delta', 'time-travel', 'delta-lake', 'sql'],
    concepts: ['delta-acid', 'delta-time-travel'],
  },

  {
    id: 'delta-8',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DELTA_OPTIMIZATION,
    language: CodeLanguage.SQL,
    question: 'The "transactions" Delta table (columns: id, amount, date, customer_id) has many small files from frequent inserts. Write the SQL command to compact the small files and improve read performance.',
    starterCode: `-- Optimize table\n`,
    testCases: [
      {
        input: 'transactions Delta table',
        expectedOutput: 'OPTIMIZE transactions',
        description: 'Should optimize table',
      },
    ],
    solution: `OPTIMIZE transactions`,
    explanation: 'OPTIMIZE compacts small files into larger ones, improving read performance. Run periodically on frequently updated tables.',
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
    question: 'The "events" Delta table (columns: event_id, user_id, timestamp, event_type) is frequently queried by user_id and timestamp. Optimize the table and co-locate related data using ZORDER on those two columns.',
    starterCode: `-- Optimize with ZORDER\n`,
    testCases: [
      {
        input: 'events Delta table',
        expectedOutput: 'OPTIMIZE events ZORDER BY (user_id, timestamp)',
        description: 'Should optimize with ZORDER',
      },
    ],
    solution: `OPTIMIZE events ZORDER BY (user_id, timestamp)`,
    explanation: 'ZORDER BY co-locates related data in the same files, dramatically improving query performance for filtered columns.',
    hints: ['Use OPTIMIZE with ZORDER BY (columns)'],
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
    question: 'Using the "employees" table (columns: emp_id, emp_name, department_id, salary) and the "departments" table (columns: id, dept_name), write an INNER JOIN query to get employees with their department details.\n\nAn INNER JOIN returns only rows where there is a match in both tables — employees without a valid department_id are excluded.',
    starterCode: `-- INNER JOIN employees with departments\n-- employees: emp_id, emp_name, department_id, salary\n-- departments: id, dept_name\n`,
    testCases: [
      {
        input: 'employees and departments tables',
        expectedOutput: 'SELECT * FROM employees INNER JOIN departments ON employees.department_id = departments.id',
        description: 'Should perform inner join',
      },
    ],
    solution: `SELECT * FROM employees e\nINNER JOIN departments d\nON e.department_id = d.id`,
    explanation: 'INNER JOIN returns only rows that have matching values in both tables. Employees whose department_id doesn\'t match any departments.id are excluded from the result.',
    hints: ['Use SELECT * FROM employees INNER JOIN departments', 'The ON clause matches employees.department_id to departments.id', 'Table aliases (e, d) are optional but improve readability'],
    tags: ['sql', 'join', 'inner-join'],
    concepts: ['sql-joins-inner-outer'],
  },

  {
    id: 'sql-join-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.SQL_JOINS,
    language: CodeLanguage.SQL,
    question: 'Using the "orders" table (columns: order_id, customer_id, amount) and the "customers" table (columns: id, customer_name, email), write a LEFT JOIN query that keeps all orders and adds customer details where available.\n\nA LEFT JOIN returns every row from the left table (orders). For rows with a matching customer, the customer columns are filled in. For orders with no matching customer, the customer columns are NULL.',
    starterCode: `-- LEFT JOIN orders with customers\n-- orders: order_id, customer_id, amount\n-- customers: id, customer_name, email\n`,
    testCases: [
      {
        input: 'orders and customers tables',
        expectedOutput: 'SELECT * FROM orders LEFT JOIN customers ON orders.customer_id = customers.id',
        description: 'Should perform left join',
      },
    ],
    solution: `SELECT * FROM orders o\nLEFT JOIN customers c\nON o.customer_id = c.id`,
    explanation: 'LEFT JOIN keeps all rows from the left table (orders) and matches rows from the right table (customers) on the join condition. Unmatched rows get NULL for all right-table columns. The join condition orders.customer_id = customers.id links the foreign key to the primary key.',
    hints: ['Use SELECT * FROM orders LEFT JOIN customers', 'The ON clause matches orders.customer_id to customers.id', 'Table aliases (o, c) are optional but improve readability'],
    tags: ['sql', 'join', 'left-join'],
    concepts: ['sql-joins-inner-outer'],
  },

  {
    id: 'sql-join-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.SQL_JOINS,
    language: CodeLanguage.SQL,
    question: 'Using the "products" table (columns: product_id, product_name, category_id, price) and the "categories" table (columns: id, category_name), write a RIGHT JOIN query that keeps all categories, even those with no products.\n\nA RIGHT JOIN is the mirror of LEFT JOIN — it returns every row from the right table (categories). Products with a matching category are included; categories with no products get NULL for the product columns.',
    starterCode: `-- RIGHT JOIN products with categories\n-- products: product_id, product_name, category_id, price\n-- categories: id, category_name\n`,
    testCases: [
      {
        input: 'products and categories tables',
        expectedOutput: 'SELECT * FROM products RIGHT JOIN categories ON products.category_id = categories.id',
        description: 'Should perform right join',
      },
    ],
    solution: `SELECT * FROM products p\nRIGHT JOIN categories c\nON p.category_id = c.id`,
    explanation: 'RIGHT JOIN keeps all rows from the right table (categories) and matches rows from the left table (products). Categories with no matching products still appear, with NULL for all product columns.',
    hints: ['Use SELECT * FROM products RIGHT JOIN categories', 'The ON clause matches products.category_id to categories.id', 'RIGHT JOIN keeps all rows from the right table'],
    tags: ['sql', 'join', 'right-join'],
    concepts: ['sql-joins-inner-outer'],
  },

  {
    id: 'sql-join-4',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.SQL_JOINS,
    language: CodeLanguage.SQL,
    question: 'Using the "users" table (columns: id, username, email) and the "profiles" table (columns: user_id, bio, avatar_url), write a FULL OUTER JOIN on users.id = profiles.user_id.\n\nA FULL OUTER JOIN returns all rows from both tables. Users without a profile and profiles without a matching user both appear, with NULLs filling in the missing side.',
    starterCode: `-- FULL OUTER JOIN users with profiles\n-- users: id, username, email\n-- profiles: user_id, bio, avatar_url\n`,
    testCases: [
      {
        input: 'users and profiles tables',
        expectedOutput: 'SELECT * FROM users FULL OUTER JOIN profiles ON users.id = profiles.user_id',
        description: 'Should perform full outer join',
      },
    ],
    solution: `SELECT * FROM users u\nFULL OUTER JOIN profiles p\nON u.id = p.user_id`,
    explanation: 'FULL OUTER JOIN combines LEFT and RIGHT JOIN — it returns all rows from both tables. Unmatched rows from either side get NULL for the other table\'s columns. Useful for finding orphaned records in either direction.',
    hints: ['Use SELECT * FROM users FULL OUTER JOIN profiles', 'The ON clause matches users.id to profiles.user_id', 'Both unmatched users and unmatched profiles appear in the result'],
    tags: ['sql', 'join', 'full-outer-join'],
    concepts: ['sql-joins-inner-outer'],
  },

  {
    id: 'sql-join-5',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.SQL_JOINS,
    language: CodeLanguage.SQL,
    question: 'Using the "employees" table (columns: id, emp_name, manager_id), write a self-join query to return each employee\'s name alongside their manager\'s name.\n\nA self-join joins a table to itself. You need two aliases for the same table — one representing the employee (e) and one representing the manager (m). Use a LEFT JOIN so employees without a manager (e.g. the CEO) are still included with NULL for the manager name.',
    starterCode: `-- Self join: employees with their managers\n-- employees: id, emp_name, manager_id\n`,
    testCases: [
      {
        input: 'employees table with manager_id',
        expectedOutput: 'SELECT e.emp_name, m.emp_name as manager FROM employees e LEFT JOIN employees m ON e.manager_id = m.id',
        description: 'Should perform self join',
      },
    ],
    solution: `SELECT e.emp_name as employee, m.emp_name as manager\nFROM employees e\nLEFT JOIN employees m\nON e.manager_id = m.id`,
    explanation: 'A self-join joins a table to itself using different aliases. Here "e" represents the employee and "m" represents the manager. LEFT JOIN ensures employees without a manager (manager_id is NULL) still appear in the results.',
    hints: ['Use FROM employees e LEFT JOIN employees m', 'The ON clause matches e.manager_id to m.id', 'Use aliases to distinguish the employee vs manager instance'],
    tags: ['sql', 'join', 'self-join'],
    concepts: ['sql-joins-inner-outer', 'sql-joins-cross-self'],
  },

  {
    id: 'sql-join-6',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.SQL_JOINS,
    language: CodeLanguage.PYTHON,
    question: 'Perform a LEFT JOIN in PySpark between orders_df (columns: order_id, customer_id, amount) and customers_df (columns: id, name, email) where orders_df.customer_id matches customers_df.id.\n\nA left join keeps all rows from the left DataFrame (orders_df) and adds matching columns from the right DataFrame (customers_df). Non-matching rows get NULL for the right side columns.\n\nIn PySpark, join() takes three arguments: the other DataFrame, the join condition using == (not =), and the join type as a string.',
    starterCode: `# Left join DataFrames\n# orders_df: order_id, customer_id, amount\n# customers_df: id, name, email\nresult = orders_df.join(customers_df, `,
    testCases: [
      {
        input: 'orders_df and customers_df',
        expectedOutput: 'orders_df.join(customers_df, orders_df.customer_id == customers_df.id, "left")',
        description: 'Should perform left join',
      },
    ],
    solution: `result = orders_df.join(customers_df, orders_df.customer_id == customers_df.id, "left")`,
    explanation: 'PySpark join() takes the other DataFrame, a join condition, and the join type. The condition uses == (Python equality) not = (assignment). "left" keeps all rows from orders_df even if there is no matching customer.',
    hints: ['The join condition compares columns with == (not =)', 'Use orders_df.customer_id == customers_df.id as the condition', 'Pass "left" as the third argument for a left join'],
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
    question: 'Using the "sales" table (columns: region, product, amount), write a query with GROUP BY ROLLUP to get the total amount per region plus a grand total across all regions.',
    starterCode: `-- Write GROUP BY ROLLUP query\n-- Table: sales (region, product, amount)\n`,
    testCases: [
      {
        input: 'sales table',
        expectedOutput: 'SELECT region, SUM(amount) FROM sales GROUP BY ROLLUP(region)',
        description: 'Should create subtotals with ROLLUP',
      },
    ],
    solution: `SELECT region, SUM(amount) as total_amount\nFROM sales\nGROUP BY ROLLUP(region)`,
    explanation: 'ROLLUP creates subtotals at each level of grouping plus a grand total. It creates hierarchical aggregations.',
    hints: ['Use GROUP BY ROLLUP(columns)', 'Creates subtotals for each grouping level'],
    tags: ['sql', 'groupby', 'rollup', 'aggregation'],
    concepts: ['ps-groupby-agg', 'sql-grouping-rollup'],
  },

  {
    id: 'grouping-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.SQL_AGGREGATIONS,
    language: CodeLanguage.SQL,
    question: 'Using the "sales" table (columns: region, product, amount), write a query with GROUP BY CUBE to get the total amount for all possible combinations of region and product, including subtotals and grand total.',
    starterCode: `-- Write GROUP BY CUBE query\n`,
    testCases: [
      {
        input: 'sales table with region and product',
        expectedOutput: 'SELECT region, product, SUM(amount) FROM sales GROUP BY CUBE(region, product)',
        description: 'Should create all combinations with CUBE',
      },
    ],
    solution: `SELECT region, product, SUM(amount) as total_amount\nFROM sales\nGROUP BY CUBE(region, product)`,
    explanation: 'CUBE creates subtotals for all possible combinations of grouping columns, including grand total.',
    hints: ['Use GROUP BY CUBE(columns)', 'Creates all possible combinations'],
    tags: ['sql', 'groupby', 'cube', 'aggregation'],
    concepts: ['ps-groupby-agg', 'sql-grouping-rollup'],
  },

  {
    id: 'grouping-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.SQL_AGGREGATIONS,
    language: CodeLanguage.SQL,
    question: 'Using the "sales" table (columns: region, product, amount), write a query with GROUPING SETS to get total amount grouped by (region, product) and by (region) only.',
    starterCode: `-- Write GROUPING SETS query\n`,
    testCases: [
      {
        input: 'sales table',
        expectedOutput: 'SELECT region, product, SUM(amount) FROM sales GROUP BY GROUPING SETS ((region, product), (region))',
        description: 'Should group by specific sets',
      },
    ],
    solution: `SELECT region, product, SUM(amount) as total_amount\nFROM sales\nGROUP BY GROUPING SETS ((region, product), (region))`,
    explanation: 'GROUPING SETS allows specifying exact grouping combinations you want, more flexible than ROLLUP or CUBE.',
    hints: ['Use GROUPING SETS((set1), (set2))', 'Specify exact combinations needed'],
    tags: ['sql', 'groupby', 'grouping-sets', 'aggregation'],
    concepts: ['ps-groupby-agg', 'sql-grouping-rollup'],
  },

  {
    id: 'grouping-4',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.SQL_AGGREGATIONS,
    language: CodeLanguage.SQL,
    question: 'Using the "products" table (columns: id, name, region, category, price), group by region and category and count the number of products in each combination.',
    starterCode: `-- Group by multiple columns\n`,
    testCases: [
      {
        input: 'products table with region and category',
        expectedOutput: 'SELECT region, category, COUNT(*) FROM products GROUP BY region, category',
        description: 'Should group by multiple columns',
      },
    ],
    solution: `SELECT region, category, COUNT(*) as count\nFROM products\nGROUP BY region, category`,
    explanation: 'You can group by multiple columns by listing them comma-separated in GROUP BY.',
    hints: ['List multiple columns in GROUP BY'],
    tags: ['sql', 'groupby', 'multiple-columns'],
    concepts: ['ps-groupby-agg'],
  },

  {
    id: 'grouping-5',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.PYSPARK_TRANSFORMATIONS,
    language: CodeLanguage.PYTHON,
    question: 'Using DataFrame "df" (columns: id, name, department, salary), group by department and calculate three aggregations: employee count, average salary, and max salary.',
    starterCode: `# Import the count, avg, and max aggregates from pyspark.sql.functions\n# Group df by department and aggregate employee_count, avg_salary, max_salary\n`,
    testCases: [
      {
        input: 'df with department and salary',
        expectedOutput: 'count("*").alias("count"), avg("salary").alias("avg_salary"), max("salary").alias("max_salary")',
        description: 'Should calculate multiple aggregations',
      },
    ],
    solution: `from pyspark.sql.functions import count, avg, max\n\nresult = df.groupBy("department").agg(\n    count("*").alias("employee_count"),\n    avg("salary").alias("avg_salary"),\n    max("salary").alias("max_salary")\n)`,
    explanation: 'agg() allows multiple aggregation functions at once. Use alias() to name the result columns.',
    hints: ['Use agg() with multiple functions', 'Use alias() to name columns'],
    tags: ['pyspark', 'groupby', 'agg', 'multiple-aggregations'],
    concepts: ['ps-session-init', 'ps-groupby-agg', 'ps-aggregate-fns'],
  },

  {
    id: 'grouping-6',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.PYSPARK_TRANSFORMATIONS,
    language: CodeLanguage.PYTHON,
    question: 'Using DataFrame "df" (columns: user_id, product, quantity), group by user_id and use collect_list to gather all product values into an array called "products".',
    starterCode: `# Import the collect-into-list aggregate from pyspark.sql.functions\n# Group df by user_id and aggregate an array column named "products"\n`,
    testCases: [
      {
        input: 'df with user_id and product',
        expectedOutput: 'collect_list("product").alias("products")',
        description: 'Should collect values into array',
      },
    ],
    solution: `from pyspark.sql.functions import collect_list\n\nresult = df.groupBy("user_id").agg(\n    collect_list("product").alias("products")\n)`,
    explanation: 'collect_list() gathers all values into an array (with duplicates). collect_set() creates a unique set.',
    hints: ['Use collect_list(column)', 'Creates array with duplicates'],
    tags: ['pyspark', 'groupby', 'collect_list', 'aggregation'],
    concepts: ['ps-session-init', 'ps-groupby-agg', 'ps-aggregate-fns'],
  },

  {
    id: 'grouping-7',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.PYSPARK_TRANSFORMATIONS,
    language: CodeLanguage.PYTHON,
    question: 'Using DataFrame "df" (columns: category, tag, post_id), group by category and use collect_set to gather unique tag values into an array called "unique_tags".',
    starterCode: `# Import the collect-into-unique-set aggregate from pyspark.sql.functions\n# Group df by category and aggregate an array column named "unique_tags"\n`,
    testCases: [
      {
        input: 'df with category and tag',
        expectedOutput: 'collect_set("tag").alias("unique_tags")',
        description: 'Should collect unique values',
      },
    ],
    solution: `from pyspark.sql.functions import collect_set\n\nresult = df.groupBy("category").agg(\n    collect_set("tag").alias("unique_tags")\n)`,
    explanation: 'collect_set() gathers unique values into an array (removes duplicates). Use collect_list() to keep duplicates.',
    hints: ['Use collect_set(column)', 'Creates array with unique values only'],
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
    question: 'Using the "employees" table (columns: id, name, department, salary), write a SQL query using ROW_NUMBER() to assign a row number to each employee ranked by salary (highest first) within each department.',
    starterCode: `-- Write window function query\n`,
    testCases: [
      {
        input: 'employees table',
        expectedOutput: 'SELECT *, ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) as row_num FROM employees',
        description: 'Should add row numbers',
      },
    ],
    solution: `SELECT *,\n       ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) as row_num\nFROM employees`,
    explanation: 'ROW_NUMBER() assigns sequential numbers within each partition. Always unique, even for ties.',
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
    question: 'Using the "sales" table (columns: sale_date, amount, region), calculate the running total of amount ordered by sale_date.\n\nA running total (cumulative sum) means each row shows the sum of all amounts from the first row up to and including the current row. To achieve this with a window function, you need to define the window frame so it starts from the very first row (UNBOUNDED PRECEDING) and ends at the current row (CURRENT ROW).\n\nAlias the result as "running_total".',
    starterCode: `-- Calculate running total of amount ordered by sale_date\n-- Hint: Use SUM(amount) OVER (...) with a ROWS BETWEEN clause\n`,
    testCases: [
      {
        input: 'sales table with date and amount',
        expectedOutput: 'SELECT *, SUM(amount) OVER (ORDER BY sale_date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) as running_total FROM sales',
        description: 'Should calculate running total',
      },
    ],
    solution: `SELECT *,\n       SUM(amount) OVER (ORDER BY sale_date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) as running_total\nFROM sales`,
    explanation: 'A running total accumulates values row by row. ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW tells SQL to sum from the very first row up to the current row. Without this frame clause, SUM() OVER(ORDER BY ...) defaults to RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW, which groups rows with the same ORDER BY value together — ROWS is more predictable for running totals.',
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
    question: 'Using the "monthly_revenue" table (columns: month, revenue), write a query that returns each row along with the previous month\'s revenue for comparison.\n\nThe LAG() window function lets you access a value from a previous row without a self-join. LAG(column, offset) returns the value of "column" from "offset" rows before the current row (based on the window\'s ORDER BY). If there is no previous row, it returns NULL.\n\nAlias the previous month\'s revenue as "prev_month_revenue".',
    starterCode: `-- Return all columns plus the previous month's revenue\n-- Hint: LAG(column, offset) OVER (ORDER BY ...)\n`,
    testCases: [
      {
        input: 'monthly_revenue table',
        expectedOutput: 'SELECT *, LAG(revenue, 1) OVER (ORDER BY month) as prev_month_revenue FROM monthly_revenue',
        description: 'Should get previous month value',
      },
    ],
    solution: `SELECT *,\n       LAG(revenue, 1) OVER (ORDER BY month) as prev_month_revenue\nFROM monthly_revenue`,
    explanation: 'LAG(column, offset) retrieves a value from a previous row relative to the current row, based on the ORDER BY in the window. LAG(revenue, 1) gets the revenue from 1 row back. The first row has no predecessor, so it returns NULL. This is commonly used for month-over-month or period-over-period comparisons without needing a self-join.',
    hints: ['Use LAG(revenue, 1) to get the value from 1 row before the current one', 'Add OVER (ORDER BY month) so LAG knows the row ordering', 'The first row will return NULL since there is no previous month'],
    tags: ['sql', 'window', 'lag'],
    concepts: ['sql-window-ranking', 'sql-window-offset'],
  },

  {
    id: 'window-adv-4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.WINDOW_FUNCTIONS,
    question: 'You want to calculate the row-over-row change in salary: current salary minus previous salary. What happens on the first row?',
    options: [
      { id: 'a', text: 'The result is 0 — lag() defaults to 0 when there is no previous row', isCorrect: false },
      { id: 'b', text: 'The result is NULL — lag() returns NULL for the first row (no previous), and any arithmetic with NULL produces NULL', isCorrect: true },
      { id: 'c', text: 'An error is thrown — you must handle the first row with coalesce()', isCorrect: false },
      { id: 'd', text: 'The result equals the current salary — lag() returns the current value when there is no previous row', isCorrect: false },
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
    question: 'What is the difference between using max("salary") with groupBy vs max("salary").over(windowSpec)?',
    options: [
      { id: 'a', text: 'They produce the same result — both return one row per group', isCorrect: false },
      { id: 'b', text: 'Window functions are slower than groupBy aggregations', isCorrect: false },
      { id: 'c', text: 'groupBy + max collapses rows (one row per group). Window max adds the max to every row without reducing row count.', isCorrect: true },
      { id: 'd', text: 'groupBy can only use sum, not max', isCorrect: false },
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
    question: 'What is Unity Catalog in Databricks?',
    options: [
      { id: 'a', text: 'A data visualization tool', isCorrect: false },
      { id: 'b', text: 'A query optimization engine', isCorrect: false },
      { id: 'c', text: 'A machine learning framework', isCorrect: false },
      { id: 'd', text: 'A unified governance solution for data and AI', isCorrect: true },
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
    question: 'What is the three-level namespace in Unity Catalog?',
    options: [
      { id: 'a', text: 'catalog.schema.table', isCorrect: true },
      { id: 'b', text: 'workspace.database.table', isCorrect: false },
      { id: 'c', text: 'server.database.table', isCorrect: false },
      { id: 'd', text: 'cluster.schema.table', isCorrect: false },
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
    question: 'Write a SQL query to create a new catalog named "analytics".',
    starterCode: `-- Create catalog\n`,
    testCases: [
      {
        input: '',
        expectedOutput: 'CREATE CATALOG analytics',
        description: 'Should create catalog',
      },
    ],
    solution: `CREATE CATALOG analytics`,
    explanation: 'Catalogs are the top level of the Unity Catalog namespace. They organize schemas (databases) and tables.',
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
    question: 'Create a schema named "sales" in the "analytics" catalog.',
    starterCode: `-- Create schema in catalog\n`,
    testCases: [
      {
        input: 'analytics catalog exists',
        expectedOutput: 'CREATE SCHEMA analytics.sales',
        description: 'Should create schema in catalog',
      },
    ],
    solution: `CREATE SCHEMA analytics.sales`,
    explanation: 'Schemas are created within catalogs using the catalog.schema notation.',
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
    question: 'Use the three-level namespace to select from the customers table in the sales schema of the analytics catalog.',
    starterCode: `-- Select using three-level namespace\n`,
    testCases: [
      {
        input: 'analytics.sales.customers table',
        expectedOutput: 'SELECT * FROM analytics.sales.customers',
        description: 'Should use three-level namespace',
      },
    ],
    solution: `SELECT * FROM analytics.sales.customers`,
    explanation: 'Use the full three-level namespace (catalog.schema.table) to reference tables in Unity Catalog.',
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
    question: 'Grant SELECT privilege on the sales schema to a group called "analysts".',
    starterCode: `-- Grant privilege\n`,
    testCases: [
      {
        input: 'sales schema and analysts group',
        expectedOutput: 'GRANT SELECT ON SCHEMA sales TO analysts',
        description: 'Should grant SELECT privilege',
      },
    ],
    solution: `GRANT SELECT ON SCHEMA sales TO analysts`,
    explanation: 'Unity Catalog uses GRANT statements to manage permissions. Privileges can be granted on catalogs, schemas, tables, or views.',
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
    question: 'Set the current catalog to "analytics".',
    starterCode: `-- Set current catalog\n`,
    testCases: [
      {
        input: '',
        expectedOutput: 'USE CATALOG analytics',
        description: 'Should set current catalog',
      },
    ],
    solution: `USE CATALOG analytics`,
    explanation: 'USE CATALOG sets the default catalog for the session. After this, you can reference tables with schema.table instead of catalog.schema.table.',
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
    question: 'Use coalesce to return the first non-null value among "email", "phone", and "contact".',
    starterCode: `# Import the first-non-null helper from pyspark.sql.functions\n# Assign result = df with "primary_contact" falling back email → phone → contact\n`,
    testCases: [
      {
        input: 'df with email, phone, contact columns',
        expectedOutput: 'coalesce(df.email, df.phone, df.contact)',
        description: 'Should return first non-null value',
      },
    ],
    solution: `from pyspark.sql.functions import coalesce\n\nresult = df.withColumn("primary_contact", coalesce(df.email, df.phone, df.contact))`,
    explanation: 'coalesce() returns the first non-null value from a list of columns. Very useful for handling missing data.',
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
    question: 'Filter to show only rows where the "email" column is null.',
    starterCode: `# Filter for null emails\nresult = df.filter(`,
    testCases: [
      {
        input: 'df with email column',
        expectedOutput: 'df.email.isNull()',
        description: 'Should filter null values',
      },
    ],
    solution: `result = df.filter(df.email.isNull())\n# OR\nresult = df.filter(col("email").isNull())`,
    explanation: 'Use isNull() to check for null values. isNotNull() checks for non-null values.',
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
    question: 'Filter to show only rows where the "phone" column is NOT null.',
    starterCode: `# Filter for non-null phones\nresult = df.filter(`,
    testCases: [
      {
        input: 'df with phone column',
        expectedOutput: 'df.phone.isNotNull()',
        description: 'Should filter non-null values',
      },
    ],
    solution: `result = df.filter(df.phone.isNotNull())`,
    explanation: 'isNotNull() returns true for non-null values. Opposite of isNull().',
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
    question: 'Drop all rows that have null values in ANY column.',
    starterCode: `# Drop rows with any nulls\nresult = df.`,
    testCases: [
      {
        input: 'df with possible null values',
        expectedOutput: 'df.na.drop() or df.dropna()',
        description: 'Should drop rows with any null',
      },
    ],
    solution: `result = df.na.drop()\n# OR\nresult = df.dropna()`,
    explanation: 'na.drop() or dropna() removes rows with null values. By default, drops if ANY column is null.',
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
    question: 'Drop rows only if ALL columns are null.',
    starterCode: `# Drop rows where all columns are null\nresult = df.na.drop(`,
    testCases: [
      {
        input: 'df with possible null values',
        expectedOutput: 'df.na.drop(how="all")',
        description: 'Should drop only when all null',
      },
    ],
    solution: `result = df.na.drop(how="all")`,
    explanation: 'how="all" drops rows only when ALL columns are null. how="any" (default) drops if ANY column is null.',
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
      { id: 'a', text: 'A Python library for machine learning', isCorrect: false },
      { id: 'b', text: 'Databricks utilities for working with files, notebooks, widgets, and secrets', isCorrect: true },
      { id: 'c', text: 'A SQL query optimizer', isCorrect: false },
      { id: 'd', text: 'A data visualization tool', isCorrect: false },
    ],
    explanation: 'dbutils provides utilities for file system operations (fs), notebook workflows (notebook), input widgets (widgets), and secret management (secrets).',
    tags: ['dbutils', 'databricks', 'utilities'],
    concepts: ['dbx-utilities', 'dbx-architecture'],
  },

  {
    id: 'dbutils-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DATABRICKS_UTILITIES,
    language: CodeLanguage.PYTHON,
    question: 'List all files in the "/mnt/data" directory using dbutils.fs.',
    starterCode: `# List files in directory\nfiles = dbutils.fs.`,
    testCases: [
      {
        input: '/mnt/data directory',
        expectedOutput: 'dbutils.fs.ls("/mnt/data")',
        description: 'Should list files in directory',
      },
    ],
    solution: `files = dbutils.fs.ls("/mnt/data")`,
    explanation: 'dbutils.fs.ls() lists files and directories at the specified path. Returns a list of FileInfo objects.',
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
    question: 'Copy a file from "/data/source.csv" to "/data/backup/source.csv" using dbutils.fs.',
    starterCode: `# Copy file\ndbutils.fs.`,
    testCases: [
      {
        input: 'source and destination paths',
        expectedOutput: 'dbutils.fs.cp("/data/source.csv", "/data/backup/source.csv")',
        description: 'Should copy file',
      },
    ],
    solution: `dbutils.fs.cp("/data/source.csv", "/data/backup/source.csv")`,
    explanation: 'dbutils.fs.cp() copies files from source to destination. Use recurse=True for directories.',
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
    question: 'Move a file from "/temp/data.csv" to "/archive/data.csv" using dbutils.fs.',
    starterCode: `# Move file\ndbutils.fs.`,
    testCases: [
      {
        input: 'source and destination paths',
        expectedOutput: 'dbutils.fs.mv("/temp/data.csv", "/archive/data.csv")',
        description: 'Should move file',
      },
    ],
    solution: `dbutils.fs.mv("/temp/data.csv", "/archive/data.csv")`,
    explanation: 'dbutils.fs.mv() moves (renames) files from source to destination.',
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
    question: 'Delete the file at "/temp/old_data.csv" using dbutils.fs.',
    starterCode: `# Delete file\ndbutils.fs.`,
    testCases: [
      {
        input: 'file path',
        expectedOutput: 'dbutils.fs.rm("/temp/old_data.csv")',
        description: 'Should delete file',
      },
    ],
    solution: `dbutils.fs.rm("/temp/old_data.csv")`,
    explanation: 'dbutils.fs.rm() removes files. Use recurse=True to delete directories and their contents.',
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
    question: 'Create a directory at "/data/new_folder" using dbutils.fs.\n\nNote: Databricks does not have a dbutils.fs.mkdir() method. Instead, it provides dbutils.fs.mkdirs() (with an "s"), which creates the directory along with any necessary parent directories — similar to "mkdir -p" in bash.',
    starterCode: `# Create directory (including parent directories if needed)\ndbutils.fs.`,
    testCases: [
      {
        input: 'directory path',
        expectedOutput: 'dbutils.fs.mkdirs("/data/new_folder")',
        description: 'Should create directory',
      },
    ],
    solution: `dbutils.fs.mkdirs("/data/new_folder")`,
    explanation: 'dbutils.fs.mkdirs() creates a directory and any necessary parent directories (like mkdir -p).',
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
    question: 'Read the first 1,000,000 bytes of the file "/config/settings.txt" as a string using dbutils.fs.\n\ndbutils.fs.head(path, maxBytes) reads up to maxBytes from a file and returns it as a string. If you omit maxBytes, it defaults to only 65536 bytes (64 KB), which may truncate larger files.',
    starterCode: `# Read file contents (up to 1,000,000 bytes)\ncontent = dbutils.fs.`,
    testCases: [
      {
        input: 'file path',
        expectedOutput: 'dbutils.fs.head("/config/settings.txt", 1000000)',
        description: 'Should read file contents',
      },
    ],
    solution: `content = dbutils.fs.head("/config/settings.txt", 1000000)`,
    explanation: 'dbutils.fs.head(path, maxBytes) reads up to maxBytes from a file as a string. The default is 65536 bytes (64 KB), so for larger files you should specify a higher limit. Note: head() is for reading text — for binary files or very large files, use spark.read instead.',
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
    question: 'Write the text "Hello, Databricks!" to a file at "/output/message.txt" using dbutils.fs.put, overwriting the file if it already exists.\n\ndbutils.fs.put(path, content, overwrite) takes three arguments: the file path, the string content to write, and a boolean for whether to overwrite an existing file.',
    starterCode: `# Write to file (overwrite if exists)\ndbutils.fs.`,
    testCases: [
      {
        input: 'path and content',
        expectedOutput: 'dbutils.fs.put("/output/message.txt", "Hello, Databricks!", True)',
        description: 'Should write to file',
      },
    ],
    solution: `dbutils.fs.put("/output/message.txt", "Hello, Databricks!", True)`,
    explanation: 'dbutils.fs.put() writes a string to a file. The third parameter controls overwriting — True overwrites, False (default) raises an error if the file exists. Only suitable for small text content; for large data, use DataFrame write methods.',
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
    question: 'Mount Azure Blob Storage to "/mnt/data" using dbutils.fs.mount. The source URL and mount point are provided — complete the extra_configs dictionary with the storage account key.\n\nThe credential key format for Azure Blob Storage is: "fs.azure.account.key.<account>.blob.core.windows.net" where <account> matches the account name in the source URL. The value should be a variable called storage_key.',
    starterCode: `# Mount storage\ndbutils.fs.mount(\n  source = "wasbs://container@account.blob.core.windows.net",\n  mount_point = "/mnt/data",\n  extra_configs = `,
    testCases: [
      {
        input: 'storage credentials',
        expectedOutput: '{"fs.azure.account.key.account.blob.core.windows.net": key}',
        description: 'Should mount with credentials',
      },
    ],
    solution: `dbutils.fs.mount(\n  source = "wasbs://container@account.blob.core.windows.net",\n  mount_point = "/mnt/data",\n  extra_configs = {"fs.azure.account.key.account.blob.core.windows.net": storage_key}\n)`,
    explanation: 'dbutils.fs.mount() mounts cloud storage (Azure Blob, S3, ADLS) to DBFS. Requires source URL, mount point, and credentials in extra_configs.',
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
    question: 'Run another notebook called "ETL_Process" located at "/Shared/ETL/ETL_Process" using dbutils.notebook.run with a timeout of 60 seconds.\n\ndbutils.notebook.run(path, timeout_seconds) requires two arguments: the notebook path and a timeout in seconds. If the notebook doesn\'t finish within the timeout, it raises a TimeoutException.',
    starterCode: `# Run notebook with a 60-second timeout\nresult = dbutils.notebook.`,
    testCases: [
      {
        input: 'notebook path',
        expectedOutput: 'dbutils.notebook.run("/Shared/ETL/ETL_Process", 60)',
        description: 'Should run notebook with timeout',
      },
    ],
    solution: `result = dbutils.notebook.run("/Shared/ETL/ETL_Process", 60)`,
    explanation: 'dbutils.notebook.run(path, timeout_seconds) executes another notebook synchronously and returns its exit value as a string. The timeout is mandatory — there is no default. If the notebook exceeds the timeout, a TimeoutException is raised.',
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
    question: 'Run the notebook at "/Shared/ETL/Process" with a 60-second timeout and pass the parameters {"env": "prod", "date": "2024-01-01"}.\n\ndbutils.notebook.run() accepts an optional third argument — a dictionary of string key-value pairs that the target notebook can access via dbutils.widgets.get().',
    starterCode: `# Run notebook with parameters\nresult = dbutils.notebook.run(\n  "/Shared/ETL/Process",\n  60,\n  `,
    testCases: [
      {
        input: 'parameters dict',
        expectedOutput: '{"env": "prod", "date": "2024-01-01"}',
        description: 'Should pass parameters',
      },
    ],
    solution: `result = dbutils.notebook.run(\n  "/Shared/ETL/Process",\n  60,\n  {"env": "prod", "date": "2024-01-01"}\n)`,
    explanation: 'The third parameter passes arguments as a dictionary of strings. The called notebook accesses these values using dbutils.widgets.get("env"), dbutils.widgets.get("date"), etc.',
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
    question: 'Exit the current notebook and return the value "Success" using dbutils.notebook.exit.',
    starterCode: `# Exit notebook with return value\ndbutils.notebook.`,
    testCases: [
      {
        input: 'return value',
        expectedOutput: 'dbutils.notebook.exit("Success")',
        description: 'Should exit with value',
      },
    ],
    solution: `dbutils.notebook.exit("Success")`,
    explanation: 'dbutils.notebook.exit() terminates notebook execution and returns a value to the calling notebook (if called via run()).',
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
    question: 'Create a text input widget named "environment" with default value "dev".',
    starterCode: `# Create text widget\ndbutils.widgets.`,
    testCases: [
      {
        input: 'widget name and default',
        expectedOutput: 'dbutils.widgets.text("environment", "dev")',
        description: 'Should create text widget',
      },
    ],
    solution: `dbutils.widgets.text("environment", "dev")`,
    explanation: 'dbutils.widgets.text() creates a text input widget. Users can enter values which can be retrieved with dbutils.widgets.get().',
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
    question: 'Create a dropdown widget named "region" with options ["US", "EU", "APAC"] and default "US".',
    starterCode: `# Create dropdown widget\ndbutils.widgets.`,
    testCases: [
      {
        input: 'widget name, choices, default',
        expectedOutput: 'dbutils.widgets.dropdown("region", "US", ["US", "EU", "APAC"])',
        description: 'Should create dropdown widget',
      },
    ],
    solution: `dbutils.widgets.dropdown("region", "US", ["US", "EU", "APAC"])`,
    explanation: 'dbutils.widgets.dropdown() creates a dropdown widget with predefined choices.',
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
    question: 'Get the value of the widget named "environment".',
    starterCode: `# Get widget value\nenv = dbutils.widgets.`,
    testCases: [
      {
        input: 'widget name',
        expectedOutput: 'dbutils.widgets.get("environment")',
        description: 'Should get widget value',
      },
    ],
    solution: `env = dbutils.widgets.get("environment")`,
    explanation: 'dbutils.widgets.get() retrieves the current value of a widget.',
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
    question: 'Remove the widget named "environment".',
    starterCode: `# Remove widget\ndbutils.widgets.`,
    testCases: [
      {
        input: 'widget name',
        expectedOutput: 'dbutils.widgets.remove("environment")',
        description: 'Should remove widget',
      },
    ],
    solution: `dbutils.widgets.remove("environment")`,
    explanation: 'dbutils.widgets.remove() removes a specific widget. Use removeAll() to remove all widgets.',
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
    question: 'Get the value of a secret from the "prod" scope with key "api-key".',
    starterCode: `# Get secret value\napi_key = dbutils.secrets.`,
    testCases: [
      {
        input: 'scope and key',
        expectedOutput: 'dbutils.secrets.get(scope="prod", key="api-key")',
        description: 'Should get secret value',
      },
    ],
    solution: `api_key = dbutils.secrets.get(scope="prod", key="api-key")`,
    explanation: 'dbutils.secrets.get() retrieves secret values from Databricks secret scopes. Secrets are never displayed in notebooks.',
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
      { id: 'a', text: 'The actual secret value is displayed', isCorrect: false },
      { id: 'b', text: 'It throws an error', isCorrect: false },
      { id: 'c', text: 'It shows [REDACTED]', isCorrect: true },
      { id: 'd', text: 'The notebook is locked', isCorrect: false },
    ],
    explanation: 'Databricks automatically redacts secret values when displayed or logged, showing [REDACTED] instead. This prevents accidental exposure of sensitive data.',
    tags: ['dbutils', 'secrets', 'security'],
    concepts: ['dbx-utilities', 'dbx-secrets'],
  },

  {
    id: 'dbutils-19',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DATABRICKS_UTILITIES,
    language: CodeLanguage.PYTHON,
    question: 'List all secret scopes available in the workspace.',
    starterCode: `# List secret scopes\nscopes = dbutils.secrets.`,
    testCases: [
      {
        input: '',
        expectedOutput: 'dbutils.secrets.listScopes()',
        description: 'Should list all scopes',
      },
    ],
    solution: `scopes = dbutils.secrets.listScopes()`,
    explanation: 'dbutils.secrets.listScopes() returns all secret scopes you have access to.',
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
    question: 'List all secret keys in the "prod" scope.',
    starterCode: `# List secret keys in scope\nkeys = dbutils.secrets.`,
    testCases: [
      {
        input: 'scope name',
        expectedOutput: 'dbutils.secrets.list(scope="prod")',
        description: 'Should list keys in scope',
      },
    ],
    solution: `keys = dbutils.secrets.list(scope="prod")`,
    explanation: 'dbutils.secrets.list() returns all secret keys within a specific scope.',
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
    question: 'What is the difference between a SHALLOW CLONE and a DEEP CLONE in Delta Lake?',
    options: [
      { id: 'a', text: 'Shallow clone copies data only, deep clone copies metadata', isCorrect: false },
      { id: 'b', text: 'Both copy all data, but shallow is faster', isCorrect: false },
      { id: 'c', text: 'There is no difference', isCorrect: false },
      { id: 'd', text: 'Shallow clone copies metadata only, deep clone copies data', isCorrect: true },
    ],
    explanation: 'A SHALLOW CLONE creates a copy that references the original data files (metadata copy). A DEEP CLONE creates an independent copy of both metadata and data files.',
    tags: ['delta', 'clone', 'shallow', 'deep'],
    concepts: ['delta-acid', 'delta-clone'],
  },

  {
    id: 'delta-clone-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DELTA_OPERATIONS,
    language: CodeLanguage.SQL,
    question: 'Create a DEEP CLONE of the "prod_orders" table as "dev_orders".',
    starterCode: `-- Create deep clone\n`,
    testCases: [
      {
        input: 'prod_orders table',
        expectedOutput: 'CREATE TABLE dev_orders DEEP CLONE prod_orders',
        description: 'Should create deep clone',
      },
    ],
    solution: `CREATE TABLE dev_orders DEEP CLONE prod_orders`,
    explanation: 'DEEP CLONE creates a fully independent copy of the table with all data files copied. Changes to the clone do not affect the source.',
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
    question: 'Create a SHALLOW CLONE of the "prod_users" table as "test_users".',
    starterCode: `-- Create shallow clone\n`,
    testCases: [
      {
        input: 'prod_users table',
        expectedOutput: 'CREATE TABLE test_users SHALLOW CLONE prod_users',
        description: 'Should create shallow clone',
      },
    ],
    solution: `CREATE TABLE test_users SHALLOW CLONE prod_users`,
    explanation: 'SHALLOW CLONE creates a lightweight copy that references the original data files. Useful for testing without duplicating storage.',
    hints: ['Use CREATE TABLE target SHALLOW CLONE source'],
    tags: ['delta', 'clone', 'shallow'],
    concepts: ['delta-acid', 'delta-clone'],
  },

  {
    id: 'delta-clone-4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DELTA_OPERATIONS,
    question: 'When should you use a SHALLOW CLONE instead of a DEEP CLONE?',
    options: [
      { id: 'a', text: 'When you want to test queries without copying data', isCorrect: true },
      { id: 'b', text: 'When you need an independent copy for production', isCorrect: false },
      { id: 'c', text: 'When you need to modify data independently', isCorrect: false },
      { id: 'd', text: 'Never, always use deep clone', isCorrect: false },
    ],
    explanation: 'SHALLOW CLONE is ideal for testing, development, or read-only analysis where you don\'t need to modify data. It saves storage by referencing original files.',
    tags: ['delta', 'clone', 'shallow', 'use-case'],
    concepts: ['delta-acid', 'delta-clone'],
  },

  // ===== DELTA LAKE MERGE (UPSERT) (6 questions) =====

  {
    id: 'delta-merge-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DELTA_OPERATIONS,
    question: 'What does the MERGE INTO command do in Delta Lake?',
    options: [
      { id: 'a', text: 'Combines two tables into one', isCorrect: false },
      { id: 'b', text: 'Performs UPSERT operations (insert + update)', isCorrect: true },
      { id: 'c', text: 'Merges schema changes', isCorrect: false },
      { id: 'd', text: 'Joins two tables', isCorrect: false },
    ],
    explanation: 'MERGE INTO performs UPSERT operations - updating existing rows that match and inserting new rows that don\'t match, all in a single atomic operation.',
    tags: ['delta', 'merge', 'upsert'],
    concepts: ['delta-acid', 'delta-merge'],
  },

  {
    id: 'delta-merge-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DELTA_OPERATIONS,
    language: CodeLanguage.SQL,
    question: 'Write a MERGE INTO statement to upsert data from "updates" table into "customers" table, matching on customer_id. Update name and email on match, insert all columns on no match.',
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
  INSERT *`,
    explanation: 'MERGE INTO uses WHEN MATCHED for updates and WHEN NOT MATCHED for inserts. The ON clause specifies the join condition.',
    hints: ['Use WHEN MATCHED THEN UPDATE SET', 'Use WHEN NOT MATCHED THEN INSERT'],
    tags: ['delta', 'merge', 'upsert', 'update', 'insert'],
    concepts: ['delta-acid', 'delta-merge', 'ps-write-modes'],
  },

  // ===== DELTA LAKE OPTIMIZE & ZORDER (6 questions) =====

  {
    id: 'delta-optimize-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DELTA_OPTIMIZATION,
    question: 'What does the OPTIMIZE command do in Delta Lake?',
    options: [
      { id: 'a', text: 'Deletes old files', isCorrect: false },
      { id: 'b', text: 'Creates indexes', isCorrect: false },
      { id: 'c', text: 'Compacts small files into larger files', isCorrect: true },
      { id: 'd', text: 'Compresses data', isCorrect: false },
    ],
    explanation: 'OPTIMIZE compacts small files into larger files to improve read performance. This addresses the "small file problem" that occurs with frequent writes.',
    tags: ['delta', 'optimize', 'compaction'],
    concepts: ['delta-acid', 'delta-optimize'],
  },

  {
    id: 'delta-optimize-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DELTA_OPTIMIZATION,
    language: CodeLanguage.SQL,
    question: 'Run OPTIMIZE on the "events" table.',
    starterCode: `-- Optimize table\n`,
    testCases: [
      {
        input: 'events table',
        expectedOutput: 'OPTIMIZE events',
        description: 'Should optimize table',
      },
    ],
    solution: `OPTIMIZE events`,
    explanation: 'OPTIMIZE compacts small files into larger files, improving query performance by reducing the number of files to scan.',
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
    question: 'Run OPTIMIZE on "sales" table with ZORDER BY on the "customer_id" column.',
    starterCode: `-- Optimize with ZORDER\n`,
    testCases: [
      {
        input: 'sales table',
        expectedOutput: 'OPTIMIZE sales ZORDER BY (customer_id)',
        description: 'Should optimize with zorder',
      },
    ],
    solution: `OPTIMIZE sales ZORDER BY (customer_id)`,
    explanation: 'ZORDER BY co-locates related information in the same set of files. This improves performance for queries that filter on the specified columns.',
    hints: ['Use OPTIMIZE table ZORDER BY (columns)'],
    tags: ['delta', 'optimize', 'zorder'],
    concepts: ['delta-acid', 'delta-optimize', 'delta-zorder'],
  },

  {
    id: 'delta-optimize-4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DELTA_OPTIMIZATION,
    question: 'When should you use ZORDER BY?',
    options: [
      { id: 'a', text: 'On all columns in the table', isCorrect: false },
      { id: 'b', text: 'Only on the partition column', isCorrect: false },
      { id: 'c', text: 'Never, it slows down queries', isCorrect: false },
      { id: 'd', text: 'On columns frequently used in WHERE clauses', isCorrect: true },
    ],
    explanation: 'ZORDER BY is most effective on columns frequently used in WHERE clauses or joins. It co-locates data to reduce the files scanned during queries.',
    tags: ['delta', 'zorder', 'optimization'],
    concepts: ['delta-acid', 'delta-zorder', 'ps-execution-plans'],
  },

  // ===== DELTA LAKE VACUUM (4 questions) =====

  {
    id: 'delta-vacuum-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DELTA_OPERATIONS,
    question: 'What does the VACUUM command do in Delta Lake?',
    options: [
      { id: 'a', text: 'Removes old data files no longer referenced', isCorrect: true },
      { id: 'b', text: 'Compacts small files', isCorrect: false },
      { id: 'c', text: 'Deletes rows from the table', isCorrect: false },
      { id: 'd', text: 'Updates table statistics', isCorrect: false },
    ],
    explanation: 'VACUUM removes old data files that are no longer referenced by the Delta log, reclaiming storage space. By default, it keeps files from the last 7 days for time travel.',
    tags: ['delta', 'vacuum', 'cleanup'],
    concepts: ['delta-acid', 'delta-vacuum'],
  },

  {
    id: 'delta-vacuum-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DELTA_OPERATIONS,
    language: CodeLanguage.SQL,
    question: 'Run VACUUM on the "orders" table to remove files older than 7 days.',
    starterCode: `-- Vacuum table\n`,
    testCases: [
      {
        input: 'orders table',
        expectedOutput: 'VACUUM orders',
        description: 'Should vacuum table',
      },
    ],
    solution: `VACUUM orders`,
    explanation: 'VACUUM deletes old data files not needed by the current version. Default retention is 7 days.',
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
    question: 'Run VACUUM on "transactions" table with a custom retention of 168 hours (7 days).',
    starterCode: `-- Vacuum with retention\n`,
    testCases: [
      {
        input: 'transactions table',
        expectedOutput: 'VACUUM transactions RETAIN 168 HOURS',
        description: 'Should vacuum with retention',
      },
    ],
    solution: `VACUUM transactions RETAIN 168 HOURS`,
    explanation: 'RETAIN specifies how long to keep old files. Files older than this period are deleted. Use HOURS as the unit.',
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
    question: 'List all currently mounted storage locations.',
    starterCode: `# List mounts\nmounts = dbutils.fs.`,
    testCases: [
      {
        input: '',
        expectedOutput: 'dbutils.fs.mounts()',
        description: 'Should list all mounts',
      },
    ],
    solution: `mounts = dbutils.fs.mounts()`,
    explanation: 'dbutils.fs.mounts() returns a list of all mount points and their source locations.',
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
    question: 'Unmount the storage at "/mnt/data".',
    starterCode: `# Unmount storage\ndbutils.fs.`,
    testCases: [
      {
        input: 'mount point',
        expectedOutput: 'dbutils.fs.unmount("/mnt/data")',
        description: 'Should unmount storage',
      },
    ],
    solution: `dbutils.fs.unmount("/mnt/data")`,
    explanation: 'dbutils.fs.unmount() removes the mount point, making the storage no longer accessible at that path.',
    hints: ['Use dbutils.fs.unmount(mount_point)'],
    tags: ['dbutils', 'fs', 'unmount'],
    concepts: ['dbx-utilities', 'dbx-dbfs'],
  },

];

