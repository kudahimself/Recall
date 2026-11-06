/**
 * Every question type on the shared QuestionShell, answered with the keyboard
 * only: focus starts on the answer, 1-9 pick, Enter checks and then goes Next,
 * Shift+Enter or Ctrl/Cmd+Enter check from inside a text box, H shows the hint,
 * and focus lands on the verdict after checking.
 *
 * Run: npm test -- --testPathPattern=QuestionKeyboard --watchAll=false
 */
/* eslint-disable testing-library/no-node-access -- these tests are about focus, so they read document.activeElement and the label a radio sits in */
import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { questions } from '../data/questions';
import {
  SAMPLE_CHOOSE_JUSTIFY,
  SAMPLE_EXPLAIN,
  SAMPLE_PREDICT_OUTCOME,
  SAMPLE_SPOT_FLAW,
} from '../dev/sampleQuestions';
import { MultipleChoiceQuestion as MCQ, PredictOutputQuestion as PredictQ } from '../types';
import { ChooseJustifyQuestion } from './ChooseJustifyQuestion';
import { ExplainQuestion } from './ExplainQuestion';
import { MultipleChoiceQuestion } from './MultipleChoiceQuestion';
import { PredictOutcomeQuestion } from './PredictOutcomeQuestion';
import { PredictOutputQuestion } from './PredictOutputQuestion';
import { SpotFlawQuestion } from './SpotFlawQuestion';
import { QuestionNavContext } from './ui/QuestionShell';

const byId = <T,>(id: string) => questions.find(q => q.id === id) as unknown as T;

/** Render a question as the quiz view does: with Next wired through the shell's context. */
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

const focusedIsVerdict = () => expect(document.activeElement).toHaveAttribute('data-verdict');

/** The 1-based number key of the option whose label contains `text` in a group. */
const keyFor = (group: HTMLElement, text: RegExp | string) => {
  const radios = within(group).getAllByRole('radio') as HTMLInputElement[];
  const at = radios.findIndex(r => {
    const label = r.labels?.[0]?.textContent ?? '';
    return typeof text === 'string' ? label.endsWith(text) || label.slice(1) === text : text.test(label);
  });
  expect(at).toBeGreaterThanOrEqual(0);
  return String(at + 1);
};

describe('Multiple choice, keys only (the 17 // 5 question)', () => {
  const q = byId<MCQ>('pe1-m2-8');

  it('focuses the first option, picks with a number, checks with Enter, then Enter goes Next', () => {
    const onAnswer = jest.fn();
    const { onNext } = renderWithNav(<MultipleChoiceQuestion question={q} onAnswer={onAnswer} showHints />);
    const group = screen.getByRole('radiogroup', { name: 'Answer options' });
    expect(document.activeElement).toBe(within(group).getAllByRole('radio')[0]);

    press('h');
    expect(screen.getByText(/rounds down/)).toBeInTheDocument();

    press(keyFor(group, '3'));
    const chosen = within(group).getAllByRole('radio').find(r => (r as HTMLInputElement).checked)!;
    expect(chosen.closest('label')).toHaveTextContent(/3$/);
    expect(document.activeElement).toBe(chosen);

    press('Enter');
    expect(onAnswer).toHaveBeenCalledWith(true);
    expect(screen.getByRole('status')).toHaveTextContent('Correct');
    focusedIsVerdict();

    press('Enter');
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it('marks a wrong pick and the right answer with words, not colour alone', () => {
    const onAnswer = jest.fn();
    renderWithNav(<MultipleChoiceQuestion question={q} onAnswer={onAnswer} showHints />);
    const group = screen.getByRole('radiogroup', { name: 'Answer options' });
    press(keyFor(group, '3.4'));
    press('Enter');
    expect(onAnswer).toHaveBeenCalledWith(false);
    expect(screen.getByRole('status')).toHaveTextContent('Not quite');
    expect(screen.getByText('Your answer').closest('label')).toHaveTextContent('3.4');
    expect(screen.getByText('Correct answer').closest('label')).toHaveTextContent(/^\d?3\s*Correct answer$/);
    // The explanation renders its markup: `//` as code, **down** as bold.
    expect(screen.getByText('down', { selector: 'strong' })).toBeInTheDocument();
    expect(screen.getByRole('status')).not.toHaveTextContent('**');
  });

  it('ignores Enter until an option is chosen', () => {
    const onAnswer = jest.fn();
    renderWithNav(<MultipleChoiceQuestion question={q} onAnswer={onAnswer} showHints />);
    // Enter on the focused (unchosen) first option chooses it; a second Enter checks.
    press('Enter');
    expect(onAnswer).not.toHaveBeenCalled();
    expect(screen.getAllByRole('radio')[0]).toBeChecked();
    press('Enter');
    expect(onAnswer).toHaveBeenCalledTimes(1);
  });
});

describe('Predict output, keys only', () => {
  const q = byId<PredictQ>('py-basics-predict-7');

  it('types into the focused box, where Enter is a new line and Shift+Enter checks', () => {
    const onAnswer = jest.fn();
    const { onNext } = renderWithNav(<PredictOutputQuestion question={q} onAnswer={onAnswer} showHints />);
    const box = screen.getByLabelText('Your predicted output');
    expect(document.activeElement).toBe(box);

    fireEvent.change(box, { target: { value: 'HELLO\nhello' } });
    press('Enter');
    press('h');
    expect(onAnswer).not.toHaveBeenCalled();
    expect(screen.queryByText(/Strings are immutable — does upper/)).toBeNull();

    press('Enter', { shiftKey: true });
    expect(onAnswer).toHaveBeenCalledWith(true);
    focusedIsVerdict();
    expect(screen.getByText('Your output')).toBeInTheDocument();

    press('Enter');
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it('checks with Ctrl+Enter too, and shows the expected output after a miss', () => {
    const onAnswer = jest.fn();
    renderWithNav(<PredictOutputQuestion question={q} onAnswer={onAnswer} showHints />);
    fireEvent.change(screen.getByLabelText('Your predicted output'), { target: { value: 'HELLO\nHELLO' } });
    press('Enter', { ctrlKey: true });
    expect(onAnswer).toHaveBeenCalledWith(false);
    expect(screen.getByText('Expected output')).toBeInTheDocument();
  });

  it('Esc leaves the box so single keys work again', () => {
    renderWithNav(<PredictOutputQuestion question={q} onAnswer={jest.fn()} showHints />);
    press('Escape');
    expect(document.activeElement).toBe(screen.getByRole('article'));
    press('h');
    expect(screen.getByText(/does upper\(\) change s in place/)).toBeInTheDocument();
  });
});

describe('Predict the outcome, keys only', () => {
  it('checks the typed value with Enter, then goes Next with Enter', () => {
    const onAnswer = jest.fn();
    const { onNext } = renderWithNav(<PredictOutcomeQuestion question={SAMPLE_PREDICT_OUTCOME} onAnswer={onAnswer} showHints />);
    const input = screen.getByLabelText('Your answer');
    expect(document.activeElement).toBe(input);
    fireEvent.change(input, { target: { value: '8' } });
    press('Enter');
    expect(onAnswer).toHaveBeenCalledWith(true);
    focusedIsVerdict();
    press('Enter');
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it('checks with Shift+Enter from the box as well', () => {
    const onAnswer = jest.fn();
    renderWithNav(<PredictOutcomeQuestion question={SAMPLE_PREDICT_OUTCOME} onAnswer={onAnswer} showHints />);
    fireEvent.change(screen.getByLabelText('Your answer'), { target: { value: '4' } });
    press('Enter', { shiftKey: true });
    expect(onAnswer).toHaveBeenCalledWith(false);
    expect(screen.getByRole('status')).toHaveTextContent('the answer is 8 rows');
  });
});

describe('Choose and justify, keys only', () => {
  it('picks a decision, locks it with Enter, picks a reason, checks with Enter, then Next', () => {
    const onAnswer = jest.fn();
    const { onNext } = renderWithNav(<ChooseJustifyQuestion question={SAMPLE_CHOOSE_JUSTIFY} onAnswer={onAnswer} showHints />);
    const decisions = screen.getByRole('radiogroup', { name: 'Your decision' });
    expect(document.activeElement).toBe(within(decisions).getAllByRole('radio')[0]);

    press(keyFor(decisions, /MERGE on order_id/));
    press('Enter');
    const reasons = screen.getByRole('radiogroup', { name: 'The reason it is right' });
    expect(document.activeElement).toBe(within(reasons).getAllByRole('radio')[0]);
    // The decision is locked but not yet marked right or wrong.
    expect(screen.queryByText('Correct answer')).toBeNull();

    press(keyFor(reasons, /stable identity/));
    press('Enter');
    expect(onAnswer).toHaveBeenCalledWith(true, { hintTierUsed: 0, attempts: 1, credit: 1 });
    focusedIsVerdict();
    press('Enter');
    expect(onNext).toHaveBeenCalledTimes(1);
  });
});

describe('Spot the flaw, keys only', () => {
  it('picks a line by its number, checks with Enter, then Next', () => {
    const onAnswer = jest.fn();
    const { onNext } = renderWithNav(<SpotFlawQuestion question={SAMPLE_SPOT_FLAW} onAnswer={onAnswer} showHints />);
    press('5');
    expect(screen.getAllByRole('radio')[4]).toBeChecked();
    expect(screen.getByRole('button', { name: 'Check line 5' })).toBeEnabled();
    press('Enter');
    expect(onAnswer).toHaveBeenCalledWith(true);
    focusedIsVerdict();
    press('Enter');
    expect(onNext).toHaveBeenCalledTimes(1);
  });
});

describe('Explain, keys only', () => {
  it('ticks the focused key point with Enter instead of recording 0 of N', () => {
    const onAnswer = jest.fn();
    renderWithNav(<ExplainQuestion question={SAMPLE_EXPLAIN} onAnswer={onAnswer} showHints />);
    fireEvent.change(screen.getByLabelText(/Your answer/), { target: { value: 'An idempotent write makes a repeat harmless.' } });
    press('Enter', { shiftKey: true });

    const boxes = within(screen.getByRole('group', { name: 'Key points' })).getAllByRole('checkbox') as HTMLInputElement[];
    expect(document.activeElement).toBe(boxes[0]);
    press('Enter');
    expect(onAnswer).not.toHaveBeenCalled();
    expect(boxes[0].checked).toBe(true);
    press('Enter');
    expect(boxes[0].checked).toBe(false);
    expect(onAnswer).not.toHaveBeenCalled();
  });

  it('submits the text with Shift+Enter, ticks points with numbers, records with Shift+Enter, then Next', () => {
    const onAnswer = jest.fn();
    const { onNext } = renderWithNav(<ExplainQuestion question={SAMPLE_EXPLAIN} onAnswer={onAnswer} showHints />);
    const box = screen.getByLabelText(/Your answer/);
    expect(document.activeElement).toBe(box);
    fireEvent.change(box, { target: { value: 'At-least-once never drops a batch; an idempotent write makes a repeat harmless.' } });
    press('Enter', { shiftKey: true });

    const points = screen.getByRole('group', { name: 'Key points' });
    expect(within(points).getAllByRole('checkbox')).toHaveLength(4);
    press('1');
    press('2');
    press('3');
    expect(within(points).getAllByRole('checkbox').filter(c => (c as HTMLInputElement).checked)).toHaveLength(3);
    press('Enter', { shiftKey: true });
    expect(onAnswer).toHaveBeenCalledWith(true, { hintTierUsed: 0, attempts: 1, credit: 0.75 });
    focusedIsVerdict();
    press('Enter');
    expect(onNext).toHaveBeenCalledTimes(1);
  });
});
