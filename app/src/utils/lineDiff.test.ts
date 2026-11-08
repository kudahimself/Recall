import { CodeLanguage } from '../types';
import { comparableLine, diffLines, solutionForms } from './lineDiff';

describe('diffLines', () => {
  it('marks the solution lines missing from the answer and the answer lines the solution lacks', () => {
    const solution = 'def f(xs):\n    total = sum(xs)\n    return total';
    const answer = 'def f(xs):\n    total = 0\n    return total';
    const d = diffLines(solution, answer, CodeLanguage.PYTHON);
    expect(d.solution).toEqual([null, 'add', null]);
    expect(d.answer).toEqual([null, 'remove', null]);
    expect(d.added).toBe(1);
    expect(d.removed).toBe(1);
  });

  it('ignores indentation, spacing around punctuation, blank lines and comments', () => {
    const solution = 'x = f(a, b)\n\nprint(x)';
    const answer = '  x=f( a,b )  # my note\n# a comment line\nprint( x )';
    const d = diffLines(solution, answer, CodeLanguage.PYTHON);
    expect(d.added).toBe(0);
    expect(d.removed).toBe(0);
    expect(d.answer).toEqual([null, null, null]);
  });

  it('marks lines out of order once, keeping the longest common run', () => {
    const d = diffLines('a = 1\nb = 2\nc = 3', 'b = 2\na = 1\nc = 3');
    expect(d.added + d.removed).toBe(2);
  });

  it('marks every solution line when the answer is empty', () => {
    const d = diffLines('SELECT a\nFROM t', '', CodeLanguage.SQL);
    expect(d.solution).toEqual(['add', 'add']);
    expect(d.answer).toEqual([null]);
  });

  it('compares lines without their SQL comments', () => {
    expect(comparableLine('SELECT a  -- the key', CodeLanguage.SQL)).toBe('SELECT a');
  });
});

describe('solutionForms', () => {
  it('splits accepted forms as the grader does and picks the one closest to the answer', () => {
    const solution = 'x = sorted(xs)\n# OR\nxs.sort()\nx = xs';
    const { forms, closest } = solutionForms(solution, 'xs.sort()\nx = xs', CodeLanguage.PYTHON);
    expect(forms).toEqual(['x = sorted(xs)', 'xs.sort()\nx = xs']);
    expect(closest).toBe(1);
  });

  it('is the whole solution when it has one form', () => {
    expect(solutionForms('print(1)', 'print(2)', CodeLanguage.PYTHON)).toEqual({ forms: ['print(1)'], closest: 0 });
  });
});
