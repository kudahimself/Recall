import { splitComment } from './codeSyntax';
import { CodeLanguage } from '../types';
import { splitAlternatives } from './codeValidator';

/** How a line of one side compares with the other side: a diff's added or removed line. */
export type LineMark = 'add' | 'remove';

export interface SolutionDiff {
  /** Per solution line: 'add' where the learner's code has no such line. */
  solution: Array<LineMark | null>;
  /** Per line of the learner's code: 'remove' where the solution has no such line. */
  answer: Array<LineMark | null>;
  /** How many solution lines are marked. */
  added: number;
  /** How many of the learner's lines are marked. */
  removed: number;
}

const splitLines = (code: string) => code.split(/\r?\n/);

/**
 * A line as compared: no comment, no indentation, runs of spaces as one, and
 * no spaces beside brackets and punctuation, so `f( a,b )` matches `f(a, b)`.
 * Blank and comment-only lines come back empty and are never marked.
 */
export function comparableLine(line: string, language?: CodeLanguage): string {
  const [body] = splitComment(line, language);
  return body
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\s*([()[\]{},:;=<>+\-*/])\s*/g, '$1');
}

/**
 * A line-level diff of the reference solution against the learner's code
 * (a longest common subsequence of their comparable lines): the solution
 * lines the learner did not write are 'add', the learner's lines the
 * solution does not have are 'remove'. Blank and comment-only lines are
 * left out on both sides.
 */
export function diffLines(solution: string, answer: string, language?: CodeLanguage): SolutionDiff {
  const sol = splitLines(solution).map(l => comparableLine(l, language));
  const ans = splitLines(answer).map(l => comparableLine(l, language));
  const a = sol.map((t, i) => [t, i] as const).filter(([t]) => t);
  const b = ans.map((t, i) => [t, i] as const).filter(([t]) => t);

  // lcs[i][j]: the longest common run of a[i..] and b[j..].
  const lcs = Array.from({ length: a.length + 1 }, () => new Array<number>(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      lcs[i][j] = a[i][0] === b[j][0] ? lcs[i + 1][j + 1] + 1 : Math.max(lcs[i + 1][j], lcs[i][j + 1]);
    }
  }

  const solutionMarks: Array<LineMark | null> = sol.map(() => null);
  const answerMarks: Array<LineMark | null> = ans.map(() => null);
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    if (a[i][0] === b[j][0]) { i++; j++; }
    else if (lcs[i + 1][j] >= lcs[i][j + 1]) { solutionMarks[a[i][1]] = 'add'; i++; }
    else { answerMarks[b[j][1]] = 'remove'; j++; }
  }
  for (; i < a.length; i++) solutionMarks[a[i][1]] = 'add';
  for (; j < b.length; j++) answerMarks[b[j][1]] = 'remove';

  return {
    solution: solutionMarks,
    answer: answerMarks,
    added: solutionMarks.filter(Boolean).length,
    removed: answerMarks.filter(Boolean).length,
  };
}

/**
 * A solution's accepted forms (split on `# OR` / `-- OR`, as the grader
 * does) and which one is closest to the learner's code: the one with the
 * fewest differing lines.
 */
export function solutionForms(solution: string, answer: string | undefined, language?: CodeLanguage): { forms: string[]; closest: number } {
  const forms = language ? splitAlternatives(solution, language) : [solution];
  if (!answer || forms.length < 2) return { forms, closest: 0 };
  let closest = 0;
  let best = Infinity;
  forms.forEach((form, i) => {
    const d = diffLines(form, answer, language);
    const cost = d.added + d.removed;
    if (cost < best) { best = cost; closest = i; }
  });
  return { forms, closest };
}
