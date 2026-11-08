/**
 * The solution view: after a missed coding answer, S (or Show solution) opens
 * the solution large, syntax-coloured, beside the learner's code, with the
 * lines that differ marked on both sides; Esc closes it.
 *
 * Run: npm test -- --testPathPattern=SolutionView --watchAll=false
 */
/* eslint-disable testing-library/no-node-access -- the marks and colours are attributes and classes on the code's lines */
import React from 'react';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { CodeLanguage, CodingQuestion as CQ, Difficulty, QuestionType, Topic } from '../types';
import { CodingQuestion } from './CodingQuestion';
import { QuestionNavContext, QuestionShell } from './ui/QuestionShell';

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      onchange: null,
      dispatchEvent: () => false,
    }),
  });
});

jest.mock('@monaco-editor/react', () => ({
  __esModule: true,
  default: ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
    <textarea data-testid="code-editor" value={value} onChange={e => onChange(e.target.value)} />
  ),
}));

const QUESTION: CQ = {
  id: 'solution_view_1',
  type: QuestionType.CODING,
  difficulty: Difficulty.INTERMEDIATE,
  topic: Topic.PY_BASICS,
  question: 'Sum the numbers, keep only even totals, and print the result.',
  explanation: 'sum() adds the iterable.',
  language: CodeLanguage.PYTHON,
  starterCode: '',
  testCases: [{ input: '', expectedOutput: '', description: 'sums and prints' }],
  solution: 'numbers = [1, 2, 3]\ntotal = sum(numbers)\nif total % 2 == 0:\n    print(total)',
};

const press = (key: string) => fireEvent.keyDown(document.activeElement ?? window, { key });

async function missWith(code: string) {
  render(
    <QuestionNavContext.Provider value={{ label: 'Next question', onNext: jest.fn() }}>
      <CodingQuestion question={QUESTION} onAnswer={jest.fn()} showHints />
    </QuestionNavContext.Provider>,
  );
  fireEvent.change(screen.getByTestId('code-editor'), { target: { value: code } });
  fireEvent.click(screen.getByRole('button', { name: /^Check/ }));
  await act(() => Promise.resolve());
}

/** The code of the lines marked `mark`, without the line numbers, signs and screen-reader words. */
const markedLines = (block: HTMLElement, mark: 'add' | 'remove') =>
  Array.from(block.querySelectorAll(`[data-mark="${mark}"] .text`)).map(text => {
    const copy = text.cloneNode(true) as HTMLElement;
    copy.querySelectorAll('.sr-only').forEach(n => n.remove());
    return copy.textContent?.trim();
  });

describe('the solution view', () => {
  it('opens with S after a miss, shows the coloured solution beside your code with the differences marked, and Esc closes it', async () => {
    await missWith('numbers = [1, 2, 3]\nprint(len(numbers))');
    expect(screen.getByText('Not quite')).toBeInTheDocument();
    expect(screen.queryByRole('dialog')).toBeNull();

    press('s');
    const dialog = screen.getByRole('dialog', { name: 'Solution' });

    // The solution, syntax-coloured at full size (not the compact side-panel size).
    const solution = within(dialog).getByRole('figure', { name: 'Solution code' });
    expect(solution).not.toHaveClass('compact');
    expect(within(solution).getByText('if')).toHaveClass('kw');
    expect(within(solution).getByText('sum')).toHaveClass('fn');

    // What differs: solution lines not in yours (+), your lines not in the solution (-).
    expect(markedLines(solution, 'add')).toEqual(['total = sum(numbers)', 'if total % 2 == 0:', 'print(total)']);
    const mine = within(dialog).getByRole('figure', { name: 'Your code' });
    expect(markedLines(mine, 'remove')).toEqual(['print(len(numbers))']);
    expect(dialog).toHaveTextContent('3 lines of the solution not in yours');
    expect(dialog).toHaveTextContent('1 line of yours not in the solution');

    press('Escape');
    expect(screen.queryByRole('dialog')).toBeNull();
    // Shown once, it stays beside the editor and can be opened large again.
    expect(screen.getByRole('region', { name: 'Solution' })).toHaveTextContent('total = sum(numbers)');
    fireEvent.click(screen.getByRole('button', { name: /Show solution/ }));
    expect(screen.getByRole('dialog', { name: 'Solution' })).toBeInTheDocument();
  });

  it('lists S and Esc in the key hints of the screen and of the view', async () => {
    await missWith('print(0)');
    const footer = screen.getByRole('article').querySelector('footer') as HTMLElement;
    expect(footer).toHaveTextContent('solution');
    press('s');
    const dialog = screen.getByRole('dialog', { name: 'Solution' });
    expect(dialog).toHaveTextContent(/Esc\s*close/);
  });

  it('is the shell\'s: any question type that gives a solution gets it, opening on the accepted form closest to the answer', () => {
    const shown = { ...QUESTION, id: 'solution_view_2' };
    render(
      <QuestionShell
        question={shown}
        format="Any type"
        graded
        feedback={{ verdict: 'wrong', title: 'Not quite' }}
        solution={{
          code: 'total = sum(numbers)\n# OR\ntotal = 0\nfor n in numbers:\n    total += n',
          language: CodeLanguage.PYTHON,
          answer: 'total = 0\nfor n in numbers:\n    total = n',
        }}
      >
        <p>answer area</p>
      </QuestionShell>,
    );
    fireEvent.click(screen.getByRole('button', { name: /Show solution/ }));
    const dialog = screen.getByRole('dialog', { name: 'Solution' });
    expect(within(dialog).getByRole('radio', { name: 'Form 2 (closest to yours)' })).toBeChecked();
    const solution = within(dialog).getByRole('figure', { name: 'Solution code' });
    expect(markedLines(solution, 'add')).toEqual(['total += n']);
    fireEvent.click(within(dialog).getByRole('radio', { name: 'Form 1' }));
    expect(within(dialog).getByRole('figure', { name: 'Solution code' })).toHaveTextContent('total = sum(numbers)');
    // S closes it too.
    press('s');
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
