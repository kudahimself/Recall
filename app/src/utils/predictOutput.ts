import { CodeLanguage } from '../types';

/**
 * Answer matching for PREDICT_OUTPUT questions.
 *
 * Every language gets the same base normalization, which tolerates user
 * formatting noise but keeps leading whitespace (Python output can have
 * meaningful indentation):
 *   - normalize CRLF -> LF
 *   - trim trailing whitespace per line
 *   - drop leading and trailing blank lines
 *   - collapse runs of 2+ blank lines into a single blank line
 *   - inside list/tuple/set/dict reprs (any nesting depth), drop all spaces
 *     and tabs outside string literals so [('b',3),('a',2)],
 *     [('b', 3), ('a', 2)], and [ ('b', 3) , ('a', 2) ] all compare equal.
 *
 * A SQL query returns a result set, and there is no one obvious way to type
 * rows and columns into a text box. So for SQL the answer is read as a grid of
 * cells under the convention shown in the UI (SQL_OUTPUT_CONVENTION), and these
 * spellings of the same grid are equal:
 *   - columns separated by a comma or a tab, with any spacing
 *   - text values with or without quotes (`Oslo` = `'Oslo'`)
 *   - NULL in any letter case
 *   - an empty result written as `(no rows)`, `no rows`, `0 rows` or `empty`
 * Values themselves stay exact: `20` and `20.0` are different answers, since
 * the type of an aggregate's result is often the point of the question.
 */

export const SQL_OUTPUT_CONVENTION =
  'Type the rows the query returns, without column headers: one row per line, ' +
  'columns in SELECT order separated by a comma (e.g. 10, 30). ' +
  'Write NULL for a null value and (no rows) for an empty result. Quotes around text are optional.';

const EMPTY_RESULT = '(no rows)';
const EMPTY_SPELLINGS = new Set(['(no rows)', 'no rows', '0 rows', 'empty']);

export const SQL_PRINT_CONVENTION =
  'Type each printed line in order, one per line.';

export const SQL_MIXED_PRINT_CONVENTION =
  'Type only what PRINT outputs, each printed line in order, one per line. ' +
  'Rows returned by a SELECT are not part of the answer.';

export const DEFAULT_OUTPUT_CONVENTION =
  'Read the code below and predict what it prints. Type the exact output - match whitespace and line breaks.';

/**
 * HTML and CSS print nothing: the browser renders them. Their predicts ask
 * about the page (the text it shows, a computed size or style, the request a
 * form sends), and each question names the value and the form to type it in.
 */
export const RENDERED_OUTPUT_CONVENTION =
  'Read the code below as a browser renders it: nothing is printed. ' +
  'Answer exactly what the question asks about the page, in the form it gives.';

/**
 * A React component that logs nothing prints nothing either: its predicts ask
 * what the page shows after some clicks or keystrokes, or which error React
 * throws, and each question names the value and the form to type it in.
 */
export const REACT_RENDERED_OUTPUT_CONVENTION =
  'Read the code below as React runs it in the browser: it logs nothing. ' +
  'Answer exactly what the question asks, in the form it gives.';

/**
 * TypeScript that logs nothing (a route handler, a middleware) prints nothing
 * either: its predicts ask about what the code does, such as the status codes
 * it answers or where it redirects, and each question names the value and the
 * form to type it in.
 */
export const NO_LOG_OUTPUT_CONVENTION =
  'This code logs nothing. Answer exactly what the question asks about it, in the form it gives.';

/** True for code the browser renders (HTML, CSS) rather than runs and prints. */
export function rendersInBrowser(language: CodeLanguage): boolean {
  return language === CodeLanguage.HTML || language === CodeLanguage.CSS;
}

/** True for JSX that never calls console: the answer is about the page, not printed output. */
function reactWithoutLogs(code: string, language: CodeLanguage): boolean {
  return language === CodeLanguage.JSX && !/\bconsole\.\w+\s*\(/.test(code);
}

/** True for TypeScript that never calls console: the answer is about what the code does. */
function typescriptWithoutLogs(code: string, language: CodeLanguage): boolean {
  return language === CodeLanguage.TYPESCRIPT && !/\bconsole\.\w+\s*\(/.test(code);
}

/** True when the predict's answer is about the rendered page rather than printed output. */
export function answersAboutPage(code: string, language: CodeLanguage): boolean {
  return rendersInBrowser(language) || reactWithoutLogs(code, language);
}

/** True when the predict's answer is not printed output: a rendered page, or code that logs nothing. */
export function answersWithoutPrintedOutput(code: string, language: CodeLanguage): boolean {
  return answersAboutPage(code, language) || typescriptWithoutLogs(code, language);
}

/** The answer instruction that matches what the code actually outputs. */
export function outputInstruction(code: string, language: CodeLanguage): string {
  if (rendersInBrowser(language)) return RENDERED_OUTPUT_CONVENTION;
  if (reactWithoutLogs(code, language)) return REACT_RENDERED_OUTPUT_CONVENTION;
  if (typescriptWithoutLogs(code, language)) return NO_LOG_OUTPUT_CONVENTION;
  if (language !== CodeLanguage.SQL) return DEFAULT_OUTPUT_CONVENTION;
  if (!/\bPRINT\b/i.test(code)) return SQL_OUTPUT_CONVENTION;
  return /\bSELECT\b/i.test(code) ? SQL_MIXED_PRINT_CONVENTION : SQL_PRINT_CONVENTION;
}

function collapseBracketSpaces(s: string): string {
  let depth = 0;
  let quote: string | null = null;
  let out = '';
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    const prev = i > 0 ? s[i - 1] : '';
    if (quote) {
      out += c;
      if (c === quote && prev !== '\\') quote = null;
      continue;
    }
    if (c === '"' || c === "'") {
      quote = c;
      out += c;
      continue;
    }
    if (c === '[' || c === '(' || c === '{') { depth++; out += c; continue; }
    if (c === ']' || c === ')' || c === '}') { depth--; out += c; continue; }
    if (depth > 0 && (c === ' ' || c === '\t')) continue;
    out += c;
  }
  return out;
}

function normalizeBase(s: string): string {
  return collapseBracketSpaces(
    s
      .replace(/\r\n/g, '\n')
      .split('\n')
      .map(l => l.replace(/[ \t]+$/, ''))
      .join('\n')
      .replace(/^\n+/, '')
      .replace(/\n+$/, '')
      .replace(/\n{2,}/g, '\n\n')
  );
}

function normalizeSqlCell(cell: string): string {
  let c = cell.trim();
  const quoted = c.match(/^'(.*)'$/) || c.match(/^"(.*)"$/);
  if (quoted) c = quoted[1];
  return /^null$/i.test(c) ? 'NULL' : c;
}

function normalizeSql(s: string): string {
  const lines = s
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0);
  if (lines.length === 0) return '';
  if (lines.length === 1 && EMPTY_SPELLINGS.has(lines[0].toLowerCase())) return EMPTY_RESULT;
  return lines
    .map(line => line.split(/\s*[,\t]\s*/).map(normalizeSqlCell).join(', '))
    .join('\n');
}

export function normalizeOutput(s: string, language: CodeLanguage): string {
  return language === CodeLanguage.SQL ? normalizeSql(s) : normalizeBase(s);
}

/** True when the user's answer equals the expected output or any accepted alternative. */
export function outputMatches(
  userOutput: string,
  expected: string[],
  language: CodeLanguage,
): boolean {
  const got = normalizeOutput(userOutput, language);
  return expected.some(c => normalizeOutput(c, language) === got);
}
