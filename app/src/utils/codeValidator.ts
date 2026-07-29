import { CodeLanguage } from '../types';

/**
 * Code validation engine.
 *
 * Strategy:
 * 1. Split solution on "# OR" / "-- OR" into independent alternatives.
 * 2. Normalize each alternative and the user code the same way.
 * 3. Apply equivalence expansions (filter↔where, JOIN↔INNER JOIN, etc.).
 * 4. Check user code against EACH alternative – pass if ANY matches.
 * 5. Matching is token-set based: every "essential" token in the solution
 *    must appear somewhere in the user code (order-independent).
 */

// ── equivalence pairs ──────────────────────────────────────────────────
// Each pair [a, b] means a and b are interchangeable.
const PYTHON_EQUIVALENCES: [RegExp, string][] = [
  // filter ↔ where
  [/\.filter\s*\(/g, '.where('],
  [/\.where\s*\(/g, '.where('],
  // orderBy ↔ sort
  [/\.sort\s*\(/g, '.orderBy('],
  [/\.orderBy\s*\(/g, '.orderBy('],
  // col("x") → "x"  (canonical: bare string)
  [/\bcol\s*\(\s*["']([^"']+)["']\s*\)/gi, '"$1"'],
  // df["col"] → "col"  (canonical: bare string)
  [/\bdf\s*\[\s*["']([^"']+)["']\s*\]/g, '"$1"'],
  // df.column_name → "column_name" (column references only, not method calls)
  // Negative lookahead: don't match df.withColumn(, df.select(, etc.
  [/\bdf\.([a-zA-Z_]\w*)(?!\s*\()/g, '"$1"'],
  // F.func → func  (strip F. prefix)
  [/\bF\./g, ''],
  // sep ↔ delimiter (both valid for CSV reader)
  [/\bsep\s*=/g, 'delimiter='],
  [/\bdelimiter\s*=/g, 'delimiter='],
  [/"sep"/g, '"delimiter"'],
  [/"delimiter"/g, '"delimiter"'],
];

const SQL_EQUIVALENCES: [RegExp, string][] = [
  // INNER JOIN ↔ JOIN
  [/\bINNER\s+JOIN\b/gi, 'JOIN'],
  // LEFT OUTER JOIN ↔ LEFT JOIN
  [/\bLEFT\s+OUTER\s+JOIN\b/gi, 'LEFT JOIN'],
  // RIGHT OUTER JOIN ↔ RIGHT JOIN
  [/\bRIGHT\s+OUTER\s+JOIN\b/gi, 'RIGHT JOIN'],
  // FULL OUTER JOIN stays (already canonical)
];

// ── normalization ──────────────────────────────────────────────────────

function normalizeCode(code: string, language: CodeLanguage): string {
  let n = code;

  // Strip comments
  if (language === CodeLanguage.SQL) {
    n = n.replace(/--.*$/gm, '');
  } else if (language === CodeLanguage.JAVASCRIPT || language === CodeLanguage.TYPESCRIPT || language === CodeLanguage.JSX) {
    n = n.replace(/\/\/.*$/gm, '');
    n = n.replace(/\/\*[\s\S]*?\*\//g, '');
  } else {
    // Python: strip triple-quoted docstrings first so their prose doesn't
    // inflate the solution's token count vs. a user answer that omits them.
    n = n.replace(/"""[\s\S]*?"""/g, '');
    n = n.replace(/'''[\s\S]*?'''/g, '');
    n = n.replace(/#.*$/gm, '');
  }

  // Strip import/from lines (Python `from x import y`, JS `import x from 'y'`).
  // NEVER for SQL: `from` is a clause keyword there, and this pattern is
  // lowercase-only, so lowercase SQL lost its entire FROM line (table name
  // included) while the uppercase reference solution kept its own. Spark SQL is
  // case-insensitive, so both spellings must validate identically.
  if (language !== CodeLanguage.SQL) {
    n = n.replace(/^(from|import)\s+.*$/gm, '');
  }

  // Strip variable assignments but keep RHS: `result = expr` → `expr`.
  // Also collect the names bound by those assignments so we can scrub their
  // usages elsewhere — that way the user is free to rename local variables
  // (e.g. `a, b, c` vs `list_a, list_b, list_c`) without the token-set check
  // penalising them for the mismatch.
  // Skipped for SQL, which has no assignment statement: there the pattern only
  // ever fires on a wrapped predicate (`WHERE\n  department = 'Sales'`) and
  // would scrub that column name out of the entire query, while the same
  // predicate written on one line keeps it.
  if (language !== CodeLanguage.SQL) {
    const boundNames = new Set<string>();
    n = n.replace(/^\s*(\w+)\s*=\s*/gm, (_m, name: string) => {
      boundNames.add(name);
      return '';
    });
    boundNames.forEach(name => {
      // Only remove whole-word occurrences; multi-char names only (avoid
      // stripping single-letter tokens like `a` from tokens like `a.b`).
      if (name.length >= 2) {
        n = n.replace(new RegExp(`\\b${name}\\b`, 'g'), '');
      }
    });
  }

  // Normalize join named params → positional
  // join(df2, on="id", how="left") → join(df2, "id", "left")
  n = n.replace(
    /\.join\s*\(\s*([^,]+),\s*(?:on\s*=\s*)?([^,]+),\s*(?:how\s*=\s*)?([^)]+)\)/gi,
    (_m, df, col, jt) => {
      const cdf = df.trim();
      const ccol = col.replace(/on\s*=\s*/i, '').trim();
      const cjt = jt.replace(/how\s*=\s*/i, '').trim();
      return `.join(${cdf}, ${ccol}, ${cjt})`;
    },
  );

  // 2-param join
  n = n.replace(
    /\.join\s*\(\s*([^,]+),\s*(?:on\s*=\s*)?([^)]+)\)/gi,
    (_m, df, col) => {
      const cdf = df.trim();
      const ccol = col.replace(/on\s*=\s*/i, '').trim();
      return `.join(${cdf}, ${ccol})`;
    },
  );

  // Apply equivalences (skip for JS/TS — no special equivalences needed yet)
  const isJS = language === CodeLanguage.JAVASCRIPT || language === CodeLanguage.TYPESCRIPT || language === CodeLanguage.JSX;
  if (!isJS) {
    const equivs = language === CodeLanguage.SQL ? SQL_EQUIVALENCES : PYTHON_EQUIVALENCES;
    for (const [pattern, replacement] of equivs) {
      n = n.replace(pattern, replacement);
    }
  }

  // Collapse whitespace, normalize quotes, lowercase
  n = n.replace(/\s+/g, ' ').replace(/["']/g, '"').trim().toLowerCase();

  // Strip spaces around Python operators/separators so "x+y" ≡ "x + y",
  // "y:" ≡ "y :", "a,b" ≡ "a, b", "x==5" ≡ "x == 5".
  if (language === CodeLanguage.PYTHON) {
    n = n.replace(/\s*([,:+\-*/=<>])\s*/g, '$1');
  }

  return n;
}

// ── split solution into alternatives ───────────────────────────────────

function splitAlternatives(solution: string, language: CodeLanguage): string[] {
  // Split on "# OR" (Python) or "-- OR" (SQL) as a standalone line
  const sep = language === CodeLanguage.SQL ? /\n\s*--\s*OR\s*\n/i : /\n\s*#\s*OR\s*\n/i;
  const parts = solution.split(sep).map(s => s.trim()).filter(Boolean);
  return parts.length > 0 ? parts : [solution];
}

// ── tokenisation ───────────────────────────────────────────────────────

/** Extract meaningful tokens from normalised code. */
function tokenize(code: string): string[] {
  // Split on non-alphanumeric (keeping dots for df.col, underscores for snake_case)
  return code
    .split(/[\s,()[\]{};]+/)
    .map(t => t.replace(/^\.+|\.+$/g, '')) // trim leading/trailing dots
    .filter(t => t.length > 0);
}

/**
 * Extract "essential" tokens – things that carry semantic meaning.
 * Filters out very common noise words that appear in almost every answer.
 */
const NOISE_TOKENS = new Set([
  'df', 'result', 'from', 'import', 'as', 'the', 'a', 'an', 'or',
  'pyspark.sql.functions', 'pyspark.sql', 'select', '*',
]);

function essentialTokens(tokens: string[]): string[] {
  return tokens.filter(t => !NOISE_TOKENS.has(t) && t.length > 1);
}

// ── common-mistake detectors ───────────────────────────────────────────

interface MistakeCheck {
  test: RegExp;
  message: string;
}

// These rules are PySpark-specific. Bare `groupby(` is correct in stdlib
// `itertools`; `order_by(` is correct in Django/SQLAlchemy. Only apply when
// the question's reference solution itself is PySpark.
const PYSPARK_MISTAKES: MistakeCheck[] = [
  {
    test: /when\s*\([^)]+\)\s*\.then\s*\(/,
    message: 'PySpark uses when(condition, value) not .then(). Use when(condition, "value").otherwise("other")',
  },
  {
    test: /\.else\s*\(/,
    message: 'PySpark uses .otherwise() not .else()',
  },
  {
    test: /when\s*\(\s*["'][^"']+["']\s*[><=]/,
    message: 'Use column references like df.age or col("age"), not string literals in when() conditions',
  },
  {
    test: /partionBy/i,
    message: 'Typo: "partionBy" should be "partitionBy" (missing "ti")',
  },
  {
    test: /groupby\s*\(/,
    message: 'PySpark uses groupBy() (camelCase B), not groupby()',
  },
  {
    test: /order_by\s*\(/,
    message: 'PySpark uses orderBy() (camelCase), not order_by()',
  },
];

function isPysparkSolution(solution: string): boolean {
  return /pyspark|SparkSession|\bspark\.(read|sql|table)\b|\bdf\.(write|select|filter|where|withColumn|groupBy|join)\b|\bsaveAsTable\b/.test(solution);
}

/**
 * Detect submissions that solve the problem with a valid PySpark idiom that
 * isn't the one the question is teaching. Returns a tailored error message so
 * the user gets actionable feedback ("use left_anti instead") rather than a
 * misleading low similarity percentage. Token-set matching scores semantically
 * equivalent but syntactically different answers very low — this layer
 * recognises the most common alternatives and explains the gap.
 */
function detectAlternativeApproach(
  userCode: string,
  solution: string,
  language: CodeLanguage,
): string | null {
  if (language !== CodeLanguage.PYTHON) return null;
  if (!isPysparkSolution(solution)) return null;

  // Left anti join — solution explicitly requests "left_anti"
  if (/["']left_anti["']/.test(solution) && !/["']left_anti["']/.test(userCode)) {
    if (/\.subtract\s*\(/.test(userCode)) {
      return 'Your subtract() approach diffs whole rows — close in spirit, but this question asks for a left anti join. Use df.join(other_df, condition, "left_anti").';
    }
    if (/\.exceptAll\s*\(/.test(userCode) || /\.except\s*\(/.test(userCode)) {
      return 'Your exceptAll()/except() approach diffs whole rows — close in spirit, but this question asks for a left anti join. Use df.join(other_df, condition, "left_anti").';
    }
    if (/~[\s\w.[\]"']*\.isin\s*\(/.test(userCode)) {
      return 'Your ~isin() filter is logically equivalent, but this question asks for the left anti join idiom. Use df.join(other_df, condition, "left_anti").';
    }
    if (/["'](left_outer|left)["']/.test(userCode) && /isNull|is_null/i.test(userCode)) {
      return 'Left outer + isNull works but does extra work — this question asks for the single-step left anti join idiom. Use df.join(other_df, condition, "left_anti").';
    }
  }

  // Left semi join — solution explicitly requests "left_semi"
  if (/["']left_semi["']/.test(solution) && !/["']left_semi["']/.test(userCode)) {
    if (/\.isin\s*\(/.test(userCode) && !/~[\s\w.[\]"']*\.isin/.test(userCode)) {
      return 'Your isin() filter is logically equivalent, but this question asks for the left semi join idiom. Use df.join(other_df, condition, "left_semi").';
    }
    if (/["'](inner|left)["']/.test(userCode) && /\.(dropDuplicates|distinct)\s*\(/.test(userCode)) {
      return 'Inner join + distinct works but duplicates effort — this question asks for the left semi join idiom. Use df.join(other_df, condition, "left_semi").';
    }
  }

  // Catalog table vs path-based save — solution explicitly uses saveAsTable()
  if (/\bsaveAsTable\s*\(/.test(solution) && !/\bsaveAsTable\s*\(/.test(userCode)) {
    if (/\bsave\s*\(/.test(userCode)) {
      return 'Your .save() writes to a file path, but saving to a catalog table requires .saveAsTable("table_name").';
    }
    return 'Saving to a catalog Delta table requires .saveAsTable("table_name").';
  }

  return null;
}

/**
 * Detect a manual `for x in sub: yield x` loop submitted where the reference
 * solution specifically teaches `yield from sub` delegation. Token-set
 * matching alone can't catch this: `from` is a NOISE_TOKEN (needed so
 * `import x from y` doesn't get penalised), and every other token
 * (`yield`, `for`, `in`, the loop var) is shared between both forms, so a
 * manual loop scores as a near-perfect match despite not using delegation.
 */
function checkYieldFromRequired(userCode: string, solution: string): string | null {
  if (!/\byield\s+from\b/.test(solution)) return null;
  if (/\byield\s+from\b/.test(userCode)) return null;
  if (/\byield\b/.test(userCode)) {
    return 'Use generator delegation (`yield from`) instead of a manual `for ... yield` loop.';
  }
  return null;
}

const SQL_MISTAKES: MistakeCheck[] = [
  {
    test: /\bLIMIT\b.*\bWHERE\b/i,
    message: 'LIMIT must come after WHERE, not before',
  },
];

// ── public API ─────────────────────────────────────────────────────────

// Verdict captures the validator's confidence:
//   'pass'      — confident the user's code is correct
//   'fail'      — confident the code is wrong (e.g. common mistake matched, or
//                 similarity is far below the pass thresholds)
//   'uncertain' — borderline: similarity is in the gap where the user might
//                 have written a valid alternative the validator can't recognise
//                 (different equivalent algorithm, renamed variables we couldn't
//                 scrub, extra valid setup, etc.). The UI surfaces an honest
//                 abstain with the reference solution visible, and asks the
//                 user to self-grade — never falsely accept or reject when we
//                 don't actually know.
export type ValidationVerdict = 'pass' | 'fail' | 'uncertain';

// Score floor for "uncertain" — below this, we're confident the code is wrong.
// Tuned conservatively: needs meaningful token overlap to qualify (e.g. recall
// ~0.65 with precision ~0.3, OR recall ~0.5 with precision ~0.5).
export const UNCERTAIN_SIMILARITY_THRESHOLD = 0.55;

export interface ValidationResult {
  passed: boolean;            // backwards-compat: true iff verdict === 'pass'
  verdict: ValidationVerdict;
  description: string;
  error?: string;
  output?: string;
  similarity?: number;
}

export function validateAnswer(
  userCode: string,
  solution: string,
  language: CodeLanguage,
  testDescription: string,
  starterCode?: string,
  options?: { requiredKeywords?: (string | RegExp)[]; requires?: (string | RegExp)[] },
): ValidationResult {
  const reqs = options?.requires || options?.requiredKeywords;
  if (reqs && reqs.length > 0) {
    for (const kw of reqs) {
      const isMatch = typeof kw === 'string'
        ? userCode.toLowerCase().includes(kw.toLowerCase())
        : kw.test(userCode);
      if (!isMatch) {
        const keywordName = typeof kw === 'string' ? `"${kw}"` : kw.toString();
        return {
          passed: false,
          verdict: 'fail',
          description: testDescription,
          error: `Your answer is missing the required keyword or pattern: ${keywordName}`,
        };
      }
    }
  }
  // 1. Check common mistakes first — these are definitive fails (we know
  // exactly what's wrong), never uncertain. PySpark mistakes only fire when
  // the reference solution itself is PySpark, so stdlib Python (e.g.
  // itertools.groupby, Django order_by) doesn't trip the same regexes.
  const mistakes =
    language === CodeLanguage.SQL
      ? SQL_MISTAKES
      : isPysparkSolution(solution)
        ? PYSPARK_MISTAKES
        : [];
  for (const { test, message } of mistakes) {
    if (test.test(userCode)) {
      return { passed: false, verdict: 'fail', description: testDescription, error: message };
    }
  }

  if (language === CodeLanguage.PYTHON) {
    const yieldFromError = checkYieldFromRequired(userCode, solution);
    if (yieldFromError) {
      return { passed: false, verdict: 'fail', description: testDescription, error: yieldFromError };
    }
  }

  // 1b. Detect recognizable valid-alternative approaches that don't use the
  // idiom the question is teaching. Token-set matching scores these low (often
  // 20-40%) which reads as "your code is wildly wrong" — actually misleading.
  // Surface a clear "use X instead" message so the user knows their attempt
  // was on the right track.
  const alternativeMessage = detectAlternativeApproach(userCode, solution, language);
  if (alternativeMessage) {
    return { passed: false, verdict: 'fail', description: testDescription, error: alternativeMessage };
  }

  // 2. Split solution into alternatives
  const alternatives = splitAlternatives(solution, language);

  // 3. Normalize user code and (if provided) the starter.
  const userNorm = normalizeCode(userCode, language);
  const userTokens = essentialTokens(tokenize(userNorm));
  const starterNorm = starterCode !== undefined ? normalizeCode(starterCode, language) : '';
  const starterTokenSet = new Set(essentialTokens(tokenize(starterNorm)));

  // 3a. Reject submissions that are essentially the starter with no answer:
  // empty normalized code, or identical to (or a subset of) the normalized
  // starter. Without this, starters whose setup data is also in the solution
  // would trivially pass the substring check below.
  if (userNorm.length === 0 || userTokens.length === 0) {
    return {
      passed: false,
      verdict: 'fail',
      description: testDescription,
      error: 'Write your solution before submitting.',
    };
  }
  if (starterNorm.length > 0 && (userNorm === starterNorm || starterNorm.includes(userNorm))) {
    return {
      passed: false,
      verdict: 'fail',
      description: testDescription,
      error: 'Write your solution before submitting.',
    };
  }

  // 4. Try each alternative
  let bestSimilarity = 0;

  for (const alt of alternatives) {
    const altNorm = normalizeCode(alt, language);

    // Direct containment check. Only accept `altNorm.includes(userNorm)` when
    // the user wrote something meaningfully beyond the starter — otherwise a
    // starter that pre-declares setup (and is a prefix of the solution) would
    // trivially pass. `userNorm.includes(altNorm)` is always safe: a user who
    // typed the full solution plus extras has solved it.
    if (userNorm.includes(altNorm)) {
      return { passed: true, verdict: 'pass', description: testDescription, output: 'Code validation passed', similarity: 1 };
    }
    if (altNorm.includes(userNorm) && (starterNorm.length === 0 || !altNorm.includes(starterNorm) || userNorm.length > starterNorm.length)) {
      // Guard: if the starter is itself a prefix of the solution, require that
      // the user code extends beyond the starter.
      if (starterNorm.length === 0 || userNorm !== starterNorm) {
        return { passed: true, verdict: 'pass', description: testDescription, output: 'Code validation passed', similarity: 1 };
      }
    }

    // Token-set matching: what fraction of solution tokens appear in user code?
    const altTokens = essentialTokens(tokenize(altNorm));

    if (altTokens.length === 0) {
      // Degenerate case – very short solution
      if (userNorm === altNorm) {
        return { passed: true, verdict: 'pass', description: testDescription, output: 'Code validation passed', similarity: 1 };
      }
      continue;
    }

    // Subtract tokens the starter already provided. We score on the *novel*
    // tokens the user had to contribute, so typing a single stray letter on
    // top of a rich starter no longer matches the setup tokens that were
    // already there.
    const novelAltTokens = altTokens.filter(t => !starterTokenSet.has(t));
    const novelUserTokens = userTokens.filter(t => !starterTokenSet.has(t));
    const scoredAltTokens = novelAltTokens.length > 0 ? novelAltTokens : altTokens;
    const scoredUserTokens = novelAltTokens.length > 0 ? novelUserTokens : userTokens;

    // How many (novel) solution tokens does the user code contain?
    const matchedFromSolution = scoredAltTokens.filter(t => userNorm.includes(t));
    // How many (novel) user tokens does the solution contain?
    const matchedFromUser = scoredUserTokens.filter(t => altNorm.includes(t));

    // Coverage: solution tokens present in user code (recall)
    const recall = matchedFromSolution.length / scoredAltTokens.length;
    // Precision: user tokens present in solution (avoids extra junk passing)
    const precision = scoredUserTokens.length > 0
      ? matchedFromUser.length / scoredUserTokens.length
      : 0;

    // F1-like score weighting recall more (we care that the right elements are there)
    const score = recall >= 1 ? 1 : (recall * 0.7 + precision * 0.3);

    bestSimilarity = Math.max(bestSimilarity, score);

    // Pass if ≥ 75% of solution tokens are present AND the user hasn't written
    // wildly different code (precision ≥ 40%)
    if (recall >= 0.75 && precision >= 0.4) {
      return {
        passed: true,
        verdict: 'pass',
        description: testDescription,
        output: 'Code validation passed',
        similarity: score,
      };
    }
  }

  // Honest abstain: similarity is non-trivial but below the pass thresholds.
  // Could be a valid alternative the validator can't recognise (different
  // algorithm, renamed variables we couldn't scrub, extra valid code). The UI
  // surfaces the reference solution and asks the user to self-grade — better
  // than falsely rejecting a correct answer or falsely accepting a wrong one.
  if (bestSimilarity >= UNCERTAIN_SIMILARITY_THRESHOLD) {
    return {
      passed: false,
      verdict: 'uncertain',
      description: testDescription,
      error: `I can't auto-check this — please diff your code against the reference. Match: ${Math.round(bestSimilarity * 100)}%`,
      similarity: bestSimilarity,
    };
  }

  return {
    passed: false,
    verdict: 'fail',
    description: testDescription,
    error: `Code does not match the expected solution. Match: ${Math.round(bestSimilarity * 100)}%`,
    similarity: bestSimilarity,
  };
}
