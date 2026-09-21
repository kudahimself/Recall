/**
 * Regression: the coding grader must not accept wrong or unfinished code.
 *
 * Runs over EVERY coding question in the bank. For each reference solution it
 * derives answers that are wrong in a small, specific way and grades them
 * exactly as the quiz does (gradeCodingSubmission). None may pass:
 *   - one operator or literal flipped (`>` -> `<`, `"append"` -> `"overwrite"`,
 *     `DESC` -> `ASC`, ...)
 *   - the last line deleted
 *   - only the first 60% of the characters typed
 * Before this test existed the grader passed 97%, 96% and 85% of these: it
 * accepted any fragment of the solution, dropped one-character tokens and
 * passed at 75% token recall, so a wrong answer was scheduled weeks out as
 * "known".
 *
 * A near miss may still land on 'uncertain' (the learner self-grades against
 * the revealed reference); what it must never be is an automatic pass.
 *
 * The reference solutions themselves must still pass, or the grader has a new
 * bug. Questions graded visually (previewChecks) use a different grader and
 * are skipped.
 */
import { gradeCodingSubmission } from './codeValidator';
import { questions } from '../data/questions';
import { CodeLanguage, CodingQuestion, QuestionType } from '../types';

const coding = questions.filter(
  (q): q is CodingQuestion => q.type === QuestionType.CODING && !q.previewChecks,
);

function passes(q: CodingQuestion, code: string): boolean {
  const results = gradeCodingSubmission(q, code);
  return results.length > 0 && results.every(r => r.verdict === 'pass');
}

function alternatives(q: CodingQuestion): string[] {
  const sep = q.language === CodeLanguage.SQL ? /\n\s*--\s*OR\s*\n/i : /\n\s*#\s*OR\s*\n/i;
  return q.solution.split(sep).map(s => s.trim()).filter(Boolean);
}

// First flip that applies to the solution. Each turns a right answer into a
// wrong one: the operator points the other way, the mode or order is reversed,
// the join keeps different rows.
const FLIPS: [RegExp, string][] = [
  [/ >= /, ' < '],
  [/ <= /, ' > '],
  [/ > /, ' < '],
  [/ < /, ' > '],
  [/ === /, ' !== '],
  [/ == /, ' != '],
  [/"append"/, '"overwrite"'],
  [/\bDESC\b/, 'ASC'],
  [/"left"/, '"inner"'],
  [/\bTrue\b/, 'False'],
  [/\btrue\b/, 'false'],
];

interface Mutant { kind: string; id: string; code: string }

// The reference with its comment-only lines removed. Deleting or truncating a
// comment does not make an answer wrong, so mutants are cut from code only.
function codeOnly(q: CodingQuestion, solution: string): string {
  const marker = q.language === CodeLanguage.SQL ? '--'
    : [CodeLanguage.JAVASCRIPT, CodeLanguage.TYPESCRIPT, CodeLanguage.JSX].includes(q.language) ? '//'
    : '#';
  return solution.split('\n').filter(l => !l.trim().startsWith(marker)).join('\n').trim();
}

function mutants(q: CodingQuestion): Mutant[] {
  const s = codeOnly(q, alternatives(q)[0] ?? '');
  const out: Mutant[] = [];
  for (const [re, rep] of FLIPS) {
    if (re.test(s)) {
      out.push({ kind: 'flip', id: q.id, code: s.replace(re, rep) });
      break;
    }
  }
  const lines = s.split('\n').filter(l => l.trim());
  // A trailing `...` placeholder body carries no code, so dropping it is not a
  // meaningful truncation.
  if (lines.length >= 3 && !/^[\s.]*$/.test(lines[lines.length - 1])) {
    out.push({ kind: 'drop-last-line', id: q.id, code: lines.slice(0, -1).join('\n') });
  }
  if (s.length >= 40) {
    out.push({ kind: 'first-60%', id: q.id, code: s.slice(0, Math.floor(s.length * 0.6)) });
  }
  return out;
}

describe('coding grader over the whole question bank', () => {
  it('has coding questions to check', () => {
    expect(coding.length).toBeGreaterThan(900);
  });

  it('passes every reference solution, alternatives included', () => {
    const rejected: string[] = [];
    for (const q of coding) {
      alternatives(q).forEach((alt, i) => {
        if (!passes(q, alt)) rejected.push(`${q.id}#${i}`);
      });
    }
    expect(rejected).toEqual([]);
  });

  it('never passes a flipped, truncated or unfinished answer', () => {
    const accepted: string[] = [];
    let checked = 0;
    for (const q of coding) {
      for (const m of mutants(q)) {
        // A mutant identical to a valid alternative is not wrong.
        if (alternatives(q).some(a => a.trim() === m.code.trim())) continue;
        checked++;
        if (passes(q, m.code)) accepted.push(`${m.kind} ${m.id}: ${m.code.replace(/\n/g, '\\n').slice(0, 120)}`);
      }
    }
    expect(checked).toBeGreaterThan(1500);
    expect(accepted).toEqual([]);
  });

  it('refuses arbitrary code on a question authored with no test cases', () => {
    // The bank's own empty-testCases questions, plus every question stripped of
    // its test cases, so the check survives those questions being filled in.
    const empty = [
      ...coding.filter(q => q.testCases.length === 0),
      ...coding.slice(0, 50).map(q => ({ ...q, testCases: [] })),
    ];
    for (const q of empty) {
      expect(passes(q, 'print("I have no idea")')).toBe(false);
      expect(passes(q, alternatives(q)[0])).toBe(true);
    }
  });
});
