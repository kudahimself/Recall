/**
 * Retry state machine for tiered-hint coding questions. Verifies:
 *   - untiered coding keeps classic one-shot behavior (fail -> recorded once)
 *   - a failed tiered submit opens the retry panel with hints LOCKED
 *   - tier escalation, then a clean pass records the hint tier + attempt count
 *   - Give Up records a failure and reveals the solution
 *
 * Monaco is mocked as a plain textarea so the test can drive the code value.
 *
 * Run: npm test -- --testPathPattern=retry --watchAll=false
 */
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { CodingQuestion } from './CodingQuestion';
import {
  CodeLanguage,
  Difficulty,
  QuestionType,
  Topic,
  CodingQuestion as CQ,
} from '../types';

// jsdom has no matchMedia; the component subscribes to a max-height query.
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

// Mock the Monaco editor with a controlled textarea.
jest.mock('@monaco-editor/react', () => ({
  __esModule: true,
  default: ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
    <textarea
      data-testid="code-editor"
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  ),
}));

const SOLUTION = 'total = sum(numbers)\nprint(total)';

function makeCoding(overrides: Partial<CQ> = {}): CQ {
  return {
    id: 'py_test_1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.PY_BASICS,
    question: 'Sum the numbers list and print the total.',
    explanation: 'sum() adds the iterable.',
    language: CodeLanguage.PYTHON,
    starterCode: '# your code here',
    testCases: [{ input: '', expectedOutput: '15', description: 'sums the list' }],
    solution: SOLUTION,
    ...overrides,
  } as CQ;
}

const TIERED = makeCoding({
  tieredHints: {
    apiSignature: 'sum(iterable, /, start=0) -> int',
    skeleton: 'total = ____(____)\n____(total)',
  },
});

function setCode(value: string) {
  fireEvent.change(screen.getByTestId('code-editor'), { target: { value } });
}

async function clickRun() {
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /Run Code/ }));
  });
}

describe('untiered coding - classic one-shot', () => {
  it('records a single failure with no retry panel', async () => {
    const onAnswer = jest.fn();
    render(<CodingQuestion question={makeCoding()} onAnswer={onAnswer} showHints={true} />);

    setCode('nonsense unrelated tokens');
    await clickRun();

    expect(onAnswer).toHaveBeenCalledTimes(1);
    expect(onAnswer).toHaveBeenCalledWith(false, { hintTierUsed: 0, attempts: 1 });
    expect(screen.queryByRole('button', { name: /Try Again/ })).not.toBeInTheDocument();
  });
});

describe('tiered coding - retry panel and locked hints', () => {
  it('a failed submit opens the retry panel without recording an answer', async () => {
    const onAnswer = jest.fn();
    render(
      <CodingQuestion
        question={TIERED}
        onAnswer={onAnswer}
        showHints={true}
        hintCreditSchedule={[1, 0.5, 0.25]}
      />,
    );

    // Hints locked before any submit.
    expect(screen.queryByText(/API signature:/)).not.toBeInTheDocument();

    setCode('nonsense unrelated tokens');
    await clickRun();

    expect(onAnswer).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: /Try Again/ })).toBeInTheDocument();
    // Still locked until the learner spends a tier.
    expect(screen.queryByText(/API signature:/)).not.toBeInTheDocument();
  });
});

describe('tiered coding - escalation then a clean pass', () => {
  it('records the highest hint tier and the attempt count', async () => {
    const onAnswer = jest.fn();
    render(
      <CodingQuestion
        question={TIERED}
        onAnswer={onAnswer}
        showHints={true}
        hintCreditSchedule={[1, 0.5, 0.25]}
      />,
    );

    setCode('nonsense unrelated tokens');
    await clickRun();

    // Reveal tier 1, then tier 2.
    fireEvent.click(screen.getByRole('button', { name: /Reveal signature/ }));
    expect(screen.getByText(/API signature:/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Reveal skeleton/ }));
    expect(screen.getByText(/Skeleton:/)).toBeInTheDocument();

    // Retry with the correct solution.
    fireEvent.click(screen.getByRole('button', { name: /Try Again/ }));
    setCode(SOLUTION);
    await clickRun();

    expect(onAnswer).toHaveBeenCalledTimes(1);
    expect(onAnswer).toHaveBeenCalledWith(true, { hintTierUsed: 2, attempts: 2 });
  });
});

describe('tiered coding - give up', () => {
  it('records a failure and reveals the solution', async () => {
    const onAnswer = jest.fn();
    render(
      <CodingQuestion
        question={TIERED}
        onAnswer={onAnswer}
        showHints={true}
        hintCreditSchedule={[1, 0.5, 0.25]}
      />,
    );

    setCode('nonsense unrelated tokens');
    await clickRun();

    fireEvent.click(screen.getByRole('button', { name: /Give Up/ }));

    expect(onAnswer).toHaveBeenCalledWith(false, { hintTierUsed: 0, attempts: 1 });
    expect(screen.getByText(/Explanation:/)).toBeInTheDocument();
  });
});
