/**
 * Fill in the blanks, Parsons and coding on the shared QuestionShell,
 * answered with the keyboard only:
 * - cloze: focus starts in the first blank, Enter goes to the next blank and
 *   checks on the last, Shift+Enter or Ctrl/Cmd+Enter check from any blank;
 * - Parsons: up and down walk a list, Space adds a line or takes it back,
 *   Alt+up and Alt+down move it, left and right switch lists, Enter checks,
 *   and each move is said in plain words;
 * - coding: Shift+Enter or Ctrl/Cmd+Enter check from the editor, Esc leaves it,
 *   H shows the next hint, S gives up, Enter tries again and then goes Next.
 *
 * Run: npm test -- --testPathPattern=CodeQuestionKeyboard --watchAll=false
 */
/* eslint-disable testing-library/no-node-access -- these tests are about focus and the active line, so they read document.activeElement and aria-activedescendant */
import React from 'react';
import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { questions } from '../data/questions';
import {
  ClozeCodeQuestion as ClozeQ,
  CodeLanguage,
  CodingQuestion as CQ,
  Difficulty,
  ParsonsQuestion as ParsonsQ,
  QuestionType,
  Topic,
} from '../types';
import { ClozeCodeQuestion } from './ClozeCodeQuestion';
import { CodingQuestion } from './CodingQuestion';
import { ParsonsQuestion } from './ParsonsQuestion';
import { QuestionNavContext } from './ui/QuestionShell';

const byId = <T,>(id: string) => questions.find(q => q.id === id) as unknown as T;

function renderWithNav(ui: React.ReactElement) {
  const onNext = jest.fn();
  render(<QuestionNavContext.Provider value={{ label: 'Next question', onNext }}>{ui}</QuestionNavContext.Provider>);
  return { onNext };
}

/** A key pressed wherever focus is now, as a keyboard user would. */
const press = (key: string, init: Partial<KeyboardEventInit> = {}) => {
  const target = (document.activeElement as HTMLElement) ?? document.body;
  fireEvent.keyDown(target, { key, ...init });
};

const verdict = () => document.querySelector('[data-verdict]') as HTMLElement;
const focusedIsVerdict = () => expect(document.activeElement).toHaveAttribute('data-verdict');

// ---- Fill in the blanks ----

describe('Fill in the blanks, keys only', () => {
  const q = byId<ClozeQ>('py-basics-cloze-5'); // greeting = ___"Hello, ___name___!"  ->  f { }
  const blank = (n: number) => screen.getByRole('textbox', { name: `Blank ${n} of 3` });

  it('starts in the first blank; Enter goes blank to blank and checks on the last; Enter then goes Next', () => {
    const onAnswer = jest.fn();
    const { onNext } = renderWithNav(<ClozeCodeQuestion question={q} onAnswer={onAnswer} showHints />);
    expect(document.activeElement).toBe(blank(1));

    fireEvent.change(blank(1), { target: { value: 'f' } });
    press('Enter');
    expect(document.activeElement).toBe(blank(2));
    fireEvent.change(blank(2), { target: { value: '{' } });
    press('Enter');
    expect(document.activeElement).toBe(blank(3));
    fireEvent.change(blank(3), { target: { value: '}' } });
    press('Enter');

    expect(onAnswer).toHaveBeenCalledWith(true);
    expect(verdict()).toHaveTextContent('Correct');
    focusedIsVerdict();
    press('Enter');
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it('Shift+Enter checks from any blank once all are filled, and goes to an empty one otherwise', () => {
    const onAnswer = jest.fn();
    renderWithNav(<ClozeCodeQuestion question={q} onAnswer={onAnswer} showHints />);
    fireEvent.change(blank(1), { target: { value: 'f' } });
    fireEvent.change(blank(3), { target: { value: '}' } });
    press('Enter', { shiftKey: true });
    expect(onAnswer).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(blank(2));

    fireEvent.change(blank(2), { target: { value: '(' } });
    blank(1).focus();
    press('Enter', { shiftKey: true });
    expect(onAnswer).toHaveBeenCalledWith(false);
    // A wrong blank keeps what was typed, struck through, with the answer beside it.
    const code = screen.getByLabelText('Code with blanks');
    expect(within(code).getByText('(', { selector: 's' })).toBeInTheDocument();
    expect(within(code).getByText('{', { selector: 'ins' })).toBeInTheDocument();
    expect(code).toHaveTextContent('Blank 2 of 3, not right');
  });

  it('checks with Ctrl+Enter too, and Esc leaves the blank so H shows the hint', () => {
    const onAnswer = jest.fn();
    renderWithNav(<ClozeCodeQuestion question={{ ...q, hints: ['An f-string starts with a letter before the quote.'] }} onAnswer={onAnswer} showHints />);
    press('h');
    expect(screen.queryByText(/letter before the quote/)).toBeNull();
    press('Escape');
    expect(document.activeElement).toBe(screen.getByRole('article'));
    press('h');
    expect(screen.getByText(/letter before the quote/)).toBeInTheDocument();

    ['f', '{', '}'].forEach((v, i) => fireEvent.change(blank(i + 1), { target: { value: v } }));
    blank(2).focus();
    press('Enter', { ctrlKey: true });
    expect(onAnswer).toHaveBeenCalledWith(true);
  });
});

// ---- Parsons ----

describe('Parsons, keys only', () => {
  const q = byId<ParsonsQ>('py-basics-parsons-5');
  const pool = () => screen.getByRole('listbox', { name: 'Lines to choose from' });
  const solution = () => screen.getByRole('listbox', { name: 'Your solution' });
  const texts = (list: HTMLElement) => within(list).queryAllByRole('option').map(o => o.textContent ?? '');
  const activeText = (list: HTMLElement) => {
    const id = list.getAttribute('aria-activedescendant');
    return id ? document.getElementById(id)?.textContent ?? '' : '';
  };
  /** Walk the focused list with the arrows to the line that reads `text`, then press Space. */
  const addLine = (text: string) => {
    const list = pool();
    const target = texts(list).indexOf(text);
    expect(target).toBeGreaterThanOrEqual(0);
    let at = texts(list).indexOf(activeText(list));
    while (at !== target) {
      press(at < target ? 'ArrowDown' : 'ArrowUp');
      at += at < target ? 1 : -1;
    }
    expect(activeText(list)).toBe(text);
    press(' ');
  };
  const said = () => document.querySelector('[aria-live="polite"][aria-atomic="true"]')?.textContent ?? '';

  it('builds the program with arrows, Space and Alt+arrows, checks with Enter, then Next', () => {
    const onAnswer = jest.fn();
    const { onNext } = renderWithNav(<ParsonsQuestion question={q} onAnswer={onAnswer} showHints />);
    // Focus starts on the lines; the distractor that copies a real line is gone.
    expect(document.activeElement).toBe(pool());
    expect(texts(pool())).toHaveLength(5);

    addLine('print(square(5))');
    expect(said()).toBe('Added as line 1 of 1: print(square(5))');
    addLine('def square(n):');
    addLine('    return n * n');
    expect(said()).toBe('Added as line 3 of 3: indented 4 spaces, return n * n');
    expect(texts(solution())).toEqual(['1print(square(5))', '2def square(n):', '3    return n * n']);

    // Over to the solution; the last line added is the active one.
    press('ArrowRight');
    expect(document.activeElement).toBe(solution());
    expect(activeText(solution())).toContain('return n * n');
    press('ArrowUp');
    press('ArrowUp');
    expect(activeText(solution())).toContain('print(square(5))');
    press('ArrowDown', { altKey: true });
    press('ArrowDown', { altKey: true });
    expect(said()).toBe('Moved to line 3 of 3: print(square(5))');
    expect(texts(solution())).toEqual(['1def square(n):', '2    return n * n', '3print(square(5))']);

    press('Enter');
    expect(onAnswer).toHaveBeenCalledWith(true);
    expect(verdict()).toHaveTextContent('Correct');
    focusedIsVerdict();
    press('Enter');
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it('Space in the solution takes a line back, and Left returns to the lines', () => {
    renderWithNav(<ParsonsQuestion question={q} onAnswer={jest.fn()} showHints />);
    addLine('square(5)');
    press('ArrowRight');
    press(' ');
    expect(said()).toBe('Took back: square(5). 0 lines in your solution.');
    expect(texts(solution())).toEqual([]);
    expect(texts(pool())).toContain('square(5)');
    press('ArrowLeft');
    expect(document.activeElement).toBe(pool());
  });

  it('a wrong answer marks each line and shows the correct order beside it', () => {
    const onAnswer = jest.fn();
    renderWithNav(<ParsonsQuestion question={q} onAnswer={onAnswer} showHints />);
    addLine('def square(n):');
    addLine('    n * n');
    addLine('print(square(5))');
    press('Enter');
    expect(onAnswer).toHaveBeenCalledWith(false);
    expect(verdict()).toHaveTextContent('Not quite');
    expect(within(solution()).getByText('does not belong')).toBeInTheDocument();
    expect(solution()).toHaveTextContent('in the right place');
    expect(screen.getByRole('heading', { name: 'Correct order' })).toBeInTheDocument();
    expect(screen.getByLabelText('Correct order')).toHaveTextContent('return n * n');
  });

  it('Enter does nothing while the solution is empty, and the lines still take the keys', () => {
    const onAnswer = jest.fn();
    renderWithNav(<ParsonsQuestion question={q} onAnswer={onAnswer} showHints />);
    press('Enter');
    expect(onAnswer).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: /Check answer/ })).toBeDisabled();
  });
});

// ---- Coding ----

const MOCK_CTRL_CMD = 2048;
const MOCK_SHIFT = 1024;
const MOCK_ENTER = 3;
const MOCK_ESCAPE = 9;
const mockCommands = new Map<number, () => void>();

jest.mock('@monaco-editor/react', () => {
  const ReactActual = jest.requireActual('react');
  const MockEditor = ({ value, onChange, onMount }: {
    value: string;
    onChange: (v: string) => void;
    onMount: (editor: any, monaco: any) => void;
  }) => {
    const ref = ReactActual.useRef(null);
    ReactActual.useEffect(() => {
      onMount(
        { addCommand: (k: number, h: () => void) => mockCommands.set(k, h), focus: () => ref.current?.focus(), dispose: () => {} },
        {
          KeyMod: { CtrlCmd: MOCK_CTRL_CMD, Shift: MOCK_SHIFT },
          KeyCode: { Enter: MOCK_ENTER, Escape: MOCK_ESCAPE },
          editor: { defineTheme: () => {}, setTheme: () => {} },
        },
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return <textarea ref={ref} aria-label="Code editor" className="monaco-editor" value={value} onChange={e => onChange(e.target.value)} />;
  };
  return { __esModule: true, default: MockEditor };
});

// The checker abstains (uncertain) for one fixture, so the self-grade step can be driven.
jest.mock('../utils/codeValidator', () => {
  const actual = jest.requireActual('../utils/codeValidator');
  return {
    ...actual,
    gradeCodingSubmission: (question: { id: string }, code: string) => (question.id === 'kb_unsure'
      ? [{ passed: false, verdict: 'uncertain', description: 'prints the total', similarity: 0.7 }]
      : actual.gradeCodingSubmission(question, code)),
  };
});

/** A key Monaco owns while the editor has focus (its own command runs, as in the real editor). */
async function editorKey(keybinding: number) {
  const handler = mockCommands.get(keybinding);
  expect(handler).toBeDefined();
  await act(async () => { handler!(); });
}

const SOLUTION = 'total = sum(numbers)\nprint(total)';
const CODING: CQ = {
  id: 'kb_coding_1',
  type: QuestionType.CODING,
  difficulty: Difficulty.BEGINNER,
  topic: Topic.PY_BASICS,
  question: 'Sum the numbers list and print the total.',
  explanation: 'sum() adds the iterable.',
  language: CodeLanguage.PYTHON,
  starterCode: '# your code here',
  testCases: [{ input: '', expectedOutput: '15', description: 'sums the list' }],
  solution: SOLUTION,
  hints: ['Python has a built-in that adds up a list.', 'It is called sum.'],
} as CQ;
const TIERED: CQ = {
  ...CODING,
  id: 'kb_coding_2',
  tieredHints: { apiSignature: 'sum(iterable, /, start=0) -> int', skeleton: 'total = ____(____)\n____(total)' },
} as CQ;

describe('Coding, keys only', () => {
  beforeEach(() => mockCommands.clear());
  const editor = () => screen.getByRole('textbox', { name: 'Code editor' });

  it('checks with Shift+Enter in the editor; a miss gives H hints, Enter tries again, a pass goes Next with Enter', async () => {
    const onAnswer = jest.fn();
    const { onNext } = renderWithNav(<CodingQuestion question={TIERED} onAnswer={onAnswer} showHints hintCreditSchedule={[1, 0.5, 0.25]} />);
    fireEvent.change(editor(), { target: { value: 'print(15)' } });
    await editorKey(MOCK_SHIFT | MOCK_ENTER);

    expect(onAnswer).not.toHaveBeenCalled();
    expect(verdict()).toHaveTextContent('Not yet');
    expect(verdict()).toHaveTextContent('0 of 1 check passes · attempt 1');
    focusedIsVerdict();

    press('h');
    expect(screen.getByRole('heading', { name: 'Signature' })).toBeInTheDocument();
    press('h');
    expect(screen.getByRole('heading', { name: 'Skeleton' })).toBeInTheDocument();

    press('Enter');
    expect(verdict()).toBeNull();
    expect(document.activeElement).toBe(editor());

    fireEvent.change(editor(), { target: { value: SOLUTION } });
    await editorKey(MOCK_CTRL_CMD | MOCK_ENTER);
    expect(onAnswer).toHaveBeenCalledWith(true, { hintTierUsed: 2, attempts: 2 });
    expect(verdict()).toHaveTextContent('Correct');
    expect(verdict()).toHaveTextContent('this pass counts 25%');
    focusedIsVerdict();
    press('Enter');
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it('S gives up after a miss and shows the solution beside the code; Enter goes Next', async () => {
    const onAnswer = jest.fn();
    const { onNext } = renderWithNav(<CodingQuestion question={TIERED} onAnswer={onAnswer} showHints />);
    fireEvent.change(editor(), { target: { value: 'print(15)' } });
    await editorKey(MOCK_SHIFT | MOCK_ENTER);
    press('s');
    expect(onAnswer).toHaveBeenCalledWith(false, { hintTierUsed: 0, attempts: 1 });
    expect(verdict()).toHaveTextContent('Not quite');
    expect(screen.getByLabelText('Solution')).toHaveTextContent('total = sum(numbers)');
    focusedIsVerdict();
    press('Enter');
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it('Esc leaves the editor, then H shows the hints one at a time and Enter checks', async () => {
    const onAnswer = jest.fn();
    renderWithNav(<CodingQuestion question={CODING} onAnswer={onAnswer} showHints />);
    editor().focus();
    await editorKey(MOCK_ESCAPE);
    expect(document.activeElement).toBe(screen.getByRole('article'));

    press('h');
    expect(screen.getByText(/adds up a list/)).toBeInTheDocument();
    expect(screen.queryByText(/It is called sum/)).toBeNull();
    press('h');
    expect(screen.getByText(/It is called sum/)).toBeInTheDocument();

    fireEvent.change(editor(), { target: { value: SOLUTION } });
    screen.getByRole('article').focus();
    press('Enter');
    await waitFor(() => expect(onAnswer).toHaveBeenCalledWith(true, { hintTierUsed: 0, attempts: 1 }));
  });

  it('when the checker cannot tell, the reference shows beside the code and 1 or 2 then Enter records the judgement', async () => {
    const onAnswer = jest.fn();
    const { onNext } = renderWithNav(<CodingQuestion question={{ ...CODING, id: 'kb_unsure' } as CQ} onAnswer={onAnswer} showHints />);
    fireEvent.change(editor(), { target: { value: 'print(sum([1, 2, 3, 4, 5]))' } });
    await editorKey(MOCK_SHIFT | MOCK_ENTER);
    expect(verdict()).toHaveTextContent('Check it yourself');
    expect(screen.getByLabelText('Reference solution')).toHaveTextContent('total = sum(numbers)');
    focusedIsVerdict();
    expect(screen.getByRole('button', { name: /^Record/ })).toBeDisabled();

    press('1');
    press('Enter');
    expect(onAnswer).toHaveBeenCalledWith(true, { hintTierUsed: 0, attempts: 1 });
    expect(verdict()).toHaveTextContent('Correct');
    focusedIsVerdict();
    press('Enter');
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it('after a miss on a question without tiers, S shows the solution', async () => {
    const onAnswer = jest.fn();
    renderWithNav(<CodingQuestion question={CODING} onAnswer={onAnswer} showHints />);
    fireEvent.change(editor(), { target: { value: 'print(15)' } });
    await editorKey(MOCK_SHIFT | MOCK_ENTER);
    expect(onAnswer).toHaveBeenCalledWith(false, { hintTierUsed: 0, attempts: 1 });
    expect(screen.queryByLabelText('Solution')).toBeNull();
    press('s');
    expect(screen.getByLabelText('Solution')).toHaveTextContent('print(total)');
  });
});
