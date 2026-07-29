import { CodingQuestion, Difficulty, Topic, QuestionType, CodeLanguage } from '../types';

interface VariationTemplate {
  conceptId: string; // Unique identifier for the concept being tested
  baseQuestion: CodingQuestion;
  variations: {
    entities?: string[][]; // Different entity names [original, variation1, variation2, ...]
    columns?: string[][]; // Different column names
    values?: any[][]; // Different values
    conditions?: string[][]; // Different conditions
  };
}

export class QuestionVariationGenerator {
  /**
   * Generate a variation of a coding question by substituting names/values
   */
  static generateVariation(
    template: VariationTemplate,
    variationIndex: number
  ): CodingQuestion {
    const { baseQuestion, variations } = template;
    let question = baseQuestion.question;
    let starterCode = baseQuestion.starterCode;
    let solution = baseQuestion.solution;
    let explanation = baseQuestion.explanation;

    // Apply entity variations (e.g., employees -> customers, students)
    if (variations.entities && variations.entities.length > 0) {
      variations.entities.forEach(([original, ...vars]) => {
        const replacement = vars[variationIndex % vars.length] || original;
        const regex = new RegExp(original, 'gi');
        question = question.replace(regex, replacement);
        starterCode = starterCode.replace(regex, replacement);
        solution = solution.replace(regex, replacement);
        explanation = explanation.replace(regex, replacement);
      });
    }

    // Apply column variations
    if (variations.columns && variations.columns.length > 0) {
      variations.columns.forEach(([original, ...vars]) => {
        const replacement = vars[variationIndex % vars.length] || original;
        // Replace quoted column names ("salary" → "price")
        const quotedRegex = new RegExp(`"${original}"`, 'g');
        question = question.replace(quotedRegex, `"${replacement}"`);
        starterCode = starterCode.replace(quotedRegex, `"${replacement}"`);
        solution = solution.replace(quotedRegex, `"${replacement}"`);
        // Replace unquoted references (e.g. in comments: "Sort by salary" → "Sort by price")
        const unquotedRegex = new RegExp(`\\b${original}\\b`, 'g');
        question = question.replace(unquotedRegex, replacement);
        starterCode = starterCode.replace(unquotedRegex, replacement);
        solution = solution.replace(unquotedRegex, replacement);
      });
    }

    // Apply value variations
    if (variations.values && variations.values.length > 0) {
      variations.values.forEach(([original, ...vars]) => {
        const replacement = vars[variationIndex % vars.length] || original;
        question = question.replace(original, replacement);
        starterCode = starterCode.replace(original, replacement);
        solution = solution.replace(original, replacement);
      });
    }

    // Apply condition variations
    if (variations.conditions && variations.conditions.length > 0) {
      variations.conditions.forEach(([original, ...vars]) => {
        const replacement = vars[variationIndex % vars.length] || original;
        question = question.replace(original, replacement);
        starterCode = starterCode.replace(original, replacement);
        solution = solution.replace(original, replacement);
      });
    }

    return {
      ...baseQuestion,
      id: `${template.conceptId}-var${variationIndex}`,
      question,
      starterCode,
      solution,
      explanation,
    };
  }

  /**
   * Generate multiple variations from a template
   */
  static generateMultipleVariations(
    template: VariationTemplate,
    count: number
  ): CodingQuestion[] {
    const variations: CodingQuestion[] = [];
    for (let i = 0; i < count; i++) {
      variations.push(this.generateVariation(template, i));
    }
    return variations;
  }
}

// ===== VARIATION TEMPLATES =====

export const variationTemplates: VariationTemplate[] = [
  // DataFrame basics variations removed — base questions in questions.ts already cover
  // select, filter, groupBy+count, and when/otherwise. Variations just repeated the same
  // pattern with different column names.

  // JOIN DATAFRAMES
  {
    conceptId: 'pyspark-join-inner',
    baseQuestion: {
      id: 'ps-transform-2',
      // Spread onto every generated variation, so all five var* questions inherit it.
      // The variation engine rewrites column and entity names in `solution` only,
      // which is why this gate names no columns. No "inner" literal either: it is
      // the default `how`, so omitting it is still a correct answer.
      requires: [/\.join\s*\(/],
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.SQL_JOINS,
      language: CodeLanguage.PYTHON,
      question: 'Join DataFrames "df1" and "df2" on their shared "id" column using an inner join.\n\nPySpark join() takes three arguments: the other DataFrame, the join column (as a string when the column name is the same in both), and the join type ("inner", "left", "right", "outer"). An inner join returns only rows where the key exists in both DataFrames.',
      starterCode: `# Inner join df1 and df2 on shared 'id' column\nresult = df1.`,
      testCases: [
        {
          input: 'df1 and df2 with id columns',
          expectedOutput: 'df1.join(df2, "id", "inner") or df1.join(df2, on="id", how="inner")',
          description: 'Should perform inner join on id column',
        },
      ],
      solution: `result = df1.join(df2, "id", "inner")\n# OR\nresult = df1.join(df2, on="id", how="inner")`,
      explanation: 'When both DataFrames share the same column name, pass it as a string — PySpark automatically deduplicates the column. For different column names, use a condition: df1.col1 == df2.col2.',
      hints: ['Use df1.join(df2, "id", "inner")', 'When column names match, pass a string — it deduplicates automatically', 'Use on= and how= for named arguments'],
      tags: ['dataframe', 'join', 'transformation'],
    },
    variations: {
      // Each array has `count` post-original entries (5 here) so variation
      // index 0..4 maps to a distinct substitution — without this, count=5
      // against 4-entry arrays produces var0 and var4 with identical content.
      columns: [
        ['id', 'customer_id', 'product_id', 'user_id', 'order_id', 'account_id'],
      ],
      entities: [
        ['df1', 'employees', 'customers', 'orders', 'users', 'accounts'],
        ['df2', 'departments', 'products', 'items', 'profiles', 'plans'],
      ],
    },
  },

  // ORDER BY
  {
    conceptId: 'pyspark-orderby',
    baseQuestion: {
      id: 'ps-transform-4',
      type: QuestionType.CODING,
      difficulty: Difficulty.INTERMEDIATE,
      topic: Topic.PYSPARK_TRANSFORMATIONS,
      language: CodeLanguage.PYTHON,
      question: 'Sort a DataFrame by "salary" in descending order.',
      starterCode: `# Sort by salary descending\nresult = df.`,
      testCases: [
        {
          input: 'df with salary column',
          expectedOutput: 'df.orderBy(df.salary.desc()) or df.sort(df.salary.desc())',
          description: 'Should sort by salary in descending order',
        },
      ],
      solution: `from pyspark.sql.functions import desc\n\nresult = df.orderBy(desc("salary"))\n# OR\nresult = df.orderBy(df.salary.desc())\n# OR\nresult = df.sort(desc("salary"))`,
      explanation: 'orderBy() and sort() are aliases. Use desc() function or .desc() method on columns for descending order.',
      hints: ['Use orderBy() or sort()', 'Use desc() for descending order'],
      tags: ['dataframe', 'orderBy', 'sort'],
    },
    variations: {
      // 5 post-original entries to match count=5 — see note on the join
      // template above for why this matters.
      columns: [
        ['salary', 'price', 'revenue', 'score', 'age', 'rating'],
      ],
    },
  },

  // SQL variations removed — base questions in questions.ts already cover SELECT WHERE
  // and GROUP BY with aggregates. Variations just repeated the same pattern with different
  // table/column names and no table context.

  // String function variations removed — 11 hand-crafted questions in expandedQuestions.ts
  // already cover every string function (lower, upper, concat, concat_ws, substring, trim,
  // split, regexp_replace, regexp_extract, length). Variations just repeated the same
  // df.withColumn() pattern with different column names.

  // Datetime function variations removed — 11 hand-crafted questions in expandedQuestions.ts
  // already cover every datetime function. Variations just repeated df.withColumn() with
  // different column names.

  // Collection function variations removed — 9 hand-crafted questions in expandedQuestions.ts
  // already cover explode, explode_outer, array_contains, plus MC questions for array,
  // array_sort, size, concat, flatten, and struct. No need for variations.

  // Math function variations removed — 6 hand-crafted questions in expandedQuestions.ts
  // already cover round, ceil, abs, sqrt, pow, greatest. Variations just repeated
  // df.withColumn(func()) with different column names.

  // Window function variations removed — row_number and lag are already covered as coding
  // questions in expandedQuestions.ts. Variations just repeated func().over(windowSpec)
  // with different column names.

  // Null handling variations removed — 5 hand-crafted questions in expandedQuestions.ts
  // already cover coalesce, isNull, isNotNull, na.drop, and na.drop(how="all").

  // Dbutils variations removed — 20 hand-crafted questions in expandedQuestions.ts already
  // cover fs (ls, cp, mv, rm, mkdirs, head, put), mount, notebook (run, run with params, exit),
  // widgets (text, dropdown, get, remove), and secrets (get, list, listScopes).

];

// Generate all variations
export function generateAllVariations(variationsPerTemplate: number = 3): CodingQuestion[] {
  const allQuestions: CodingQuestion[] = [];

  variationTemplates.forEach(template => {
    const variations = QuestionVariationGenerator.generateMultipleVariations(
      template,
      variationsPerTemplate
    );
    allQuestions.push(...variations);
  });

  return allQuestions;
}
