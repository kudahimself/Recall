import { CodingQuestion } from '../types';

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

  // Join and orderBy variations removed - their five copies each duplicated
  // ps-transform-2 (inner join on a shared key) and ps-transform-4 (sort
  // descending) in questions.ts.

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
