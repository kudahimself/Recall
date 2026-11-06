/**
 * Rendering and grading of the decision and design question components, on
 * the dev samples (src/dev/sampleQuestions.ts).
 *
 * Run: npm test -- --testPathPattern=DecisionQuestions --watchAll=false
 */
import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { PredictOutcomeQuestion } from './PredictOutcomeQuestion';
import { ChooseJustifyQuestion } from './ChooseJustifyQuestion';
import { SpotFlawQuestion } from './SpotFlawQuestion';
import { ExplainQuestion } from './ExplainQuestion';
import {
  SAMPLE_CHOOSE_JUSTIFY,
  SAMPLE_EXPLAIN,
  SAMPLE_PREDICT_OUTCOME,
  SAMPLE_SPOT_FLAW,
} from '../dev/sampleQuestions';

/** Exactly these tables are on screen, in this order (each table's figure holds its name; code blocks are figures too). */
const expectTables = (names: string[]) => {
  const figures = screen.queryAllByRole('figure').filter(f => within(f).queryByRole('table'));
  expect(figures).toHaveLength(names.length);
  names.forEach((name, i) => expect(within(figures[i]).getByText(name)).toBeInTheDocument());
};

describe('PredictOutcomeQuestion', () => {
  const renderIt = (onAnswer = jest.fn()) =>
    render(<PredictOutcomeQuestion question={SAMPLE_PREDICT_OUTCOME} onAnswer={onAnswer} showHints />);

  it('shows the input tables, the job and a typed answer with its unit', () => {
    renderIt();
    expectTables(['staging_sales', 'daily_sales (before the job)']);
    expect(screen.getByText(/INSERT INTO daily_sales/)).toBeInTheDocument();
    expect(screen.getByLabelText('Your answer')).toHaveValue('');
    expect(screen.getByText('rows')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Check answer' })).toBeDisabled();
  });

  it('grades a right value, with or without the unit', () => {
    const onAnswer = jest.fn();
    renderIt(onAnswer);
    fireEvent.change(screen.getByLabelText('Your answer'), { target: { value: '8 rows' } });
    fireEvent.click(screen.getByRole('button', { name: 'Check answer' }));
    expect(onAnswer).toHaveBeenCalledWith(true);
    expect(screen.getByRole('status')).toHaveTextContent('Correct');
  });

  it('names the tempting wrong answer and shows the right one', () => {
    const onAnswer = jest.fn();
    renderIt(onAnswer);
    const input = screen.getByLabelText('Your answer');
    fireEvent.change(input, { target: { value: '10' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onAnswer).toHaveBeenCalledWith(false);
    expect(screen.getByRole('status')).toHaveTextContent('Not quite');
    expect(screen.getByRole('status')).toHaveTextContent('You answered 10 rows; the answer is 8 rows');
    expect(screen.getByText('Your 10 rows:')).toBeInTheDocument();
    expect(screen.getByText(/10 is the whole table/)).toBeInTheDocument();
    // The other tempting answer is one click away, under its summary.
    expect(screen.getByText('Why 4 rows is tempting')).toBeInTheDocument();
    expect(screen.getByLabelText(/Your answer/)).toBeDisabled();
    expect(screen.queryByRole('button', { name: /next/i })).toBeNull();
  });
});

describe('ChooseJustifyQuestion', () => {
  const renderIt = (onAnswer = jest.fn()) =>
    render(<ChooseJustifyQuestion question={SAMPLE_CHOOSE_JUSTIFY} onAnswer={onAnswer} showHints />);
  const pick = (group: string, text: RegExp) =>
    fireEvent.click(within(screen.getByRole('radiogroup', { name: group })).getByText(text));

  it('shows the decisions first and the reasons only once the decision is in', () => {
    renderIt();
    expect(within(screen.getByRole('radiogroup', { name: 'Your decision' })).getAllByRole('radio')).toHaveLength(4);
    expect(screen.queryByRole('radiogroup', { name: 'The reason it is right' })).toBeNull();
    expect(screen.getByRole('button', { name: 'Lock in decision' })).toBeDisabled();
    pick('Your decision', /MERGE on order_id/);
    fireEvent.click(screen.getByRole('button', { name: 'Lock in decision' }));
    expect(within(screen.getByRole('radiogroup', { name: 'The reason it is right' })).getAllByRole('radio')).toHaveLength(4);
    within(screen.getByRole('radiogroup', { name: 'Your decision' })).getAllByRole('radio')
      .forEach(r => expect(r).toBeDisabled());
  });

  it.each([
    [/MERGE on order_id/, /stable identity/, true, 1, 'Correct · credit 1'],
    [/MERGE on order_id/, /rewrites fewer files/, true, 0.5, 'Half credit · 0.5'],
    [/Overwrite the partition/, /stable identity/, false, 0, 'Not quite · credit 0'],
  ])('grades %s with %s', (decision, reason, isCorrect, credit, banner) => {
    const onAnswer = jest.fn();
    renderIt(onAnswer);
    pick('Your decision', decision);
    fireEvent.click(screen.getByRole('button', { name: 'Lock in decision' }));
    pick('The reason it is right', reason);
    fireEvent.click(screen.getByRole('button', { name: 'Check answer' }));
    expect(onAnswer).toHaveBeenCalledWith(isCorrect, { hintTierUsed: 0, attempts: 1, credit });
    expect(screen.getByRole('status')).toHaveTextContent(banner);
    // Each list marks the learner's pick with a word, not colour alone.
    expect(screen.getAllByText('Your answer')).toHaveLength(2);
  });

  it('does not show the options in authored order', () => {
    renderIt();
    const shown = within(screen.getByRole('radiogroup', { name: 'Your decision' })).getAllByRole('radio').map(r => (r as HTMLInputElement).value);
    expect(shown).not.toEqual(SAMPLE_CHOOSE_JUSTIFY.decisions.map(d => d.id));
    expect([...shown].sort()).toEqual(SAMPLE_CHOOSE_JUSTIFY.decisions.map(d => d.id).sort());
  });
});

describe('SpotFlawQuestion', () => {
  const renderIt = (onAnswer = jest.fn()) =>
    render(<SpotFlawQuestion question={SAMPLE_SPOT_FLAW} onAnswer={onAnswer} showHints />);
  const radio = (n: number) => screen.getAllByRole('radio')[n - 1];
  // eslint-disable-next-line testing-library/no-node-access
  const line = (n: number) => radio(n).closest('label') as HTMLElement;

  it('shows numbered clickable lines, the note and the input table', () => {
    renderIt();
    expect(screen.getAllByRole('radio')).toHaveLength(SAMPLE_SPOT_FLAW.lines.length);
    expect(line(5)).toHaveTextContent('5INSERT INTO fact_orders SELECT * FROM staging_orders;');
    expect(screen.getByText(/late order from the day before/)).toBeInTheDocument();
    expectTables(['staging_orders']);
    expect(screen.getByRole('button', { name: 'Pick a line' })).toBeDisabled();
  });

  it('grades the flaw line as right and shows the result table', () => {
    const onAnswer = jest.fn();
    renderIt(onAnswer);
    fireEvent.click(radio(5));
    expect(radio(5)).toBeChecked();
    fireEvent.click(screen.getByRole('button', { name: 'Check line 5' }));
    expect(onAnswer).toHaveBeenCalledWith(true);
    expect(screen.getByRole('status')).toHaveTextContent('Correct');
    expect(line(5)).toHaveTextContent('Your pick');
    expectTables(['staging_orders', 'fact_orders, rows per day']);
  });

  it('grades another line as wrong and points at the flaw', () => {
    const onAnswer = jest.fn();
    renderIt(onAnswer);
    fireEvent.click(radio(4));
    fireEvent.click(screen.getByRole('button', { name: 'Check line 4' }));
    expect(onAnswer).toHaveBeenCalledWith(false);
    expect(screen.getByRole('status')).toHaveTextContent('Not quite');
    expect(screen.getByRole('status')).toHaveTextContent('The flaw is line 5');
    expect(line(4)).toHaveTextContent('Your pick');
    expect(line(5)).toHaveTextContent('The flaw');
    fireEvent.click(radio(3));
    expect(radio(3)).not.toBeChecked();
  });
});

describe('ExplainQuestion', () => {
  const THREE_POINT_EXPLAIN = { ...SAMPLE_EXPLAIN, keyPoints: SAMPLE_EXPLAIN.keyPoints.slice(0, 3) };
  const renderIt = (onAnswer = jest.fn(), question = SAMPLE_EXPLAIN) =>
    render(<ExplainQuestion question={question} onAnswer={onAnswer} showHints />);
  const typeAndSubmit = () => {
    fireEvent.change(screen.getByLabelText(/Your answer/), { target: { value: 'At-least-once never loses a batch.' } });
    fireEvent.click(screen.getByRole('button', { name: 'Submit and see the key points' }));
  };

  it('hides the key points and model answer until the learner has typed', () => {
    renderIt();
    expect(screen.queryByText('Model answer')).toBeNull();
    expect(screen.queryByRole('checkbox')).toBeNull();
    expect(screen.getByRole('button', { name: 'Submit and see the key points' })).toBeDisabled();
    typeAndSubmit();
    expect(screen.getByText('Model answer')).toBeInTheDocument();
    expect(screen.getByText('At-least-once never loses a batch.')).toBeInTheDocument();
    expect(screen.getAllByRole('checkbox')).toHaveLength(4);
  });

  it.each([
    [4, [0, 1, 2], true, 3 / 4, '0.75', 'counts as correct'],
    [4, [0, 3], false, 2 / 4, '0.5', 'counts as a miss'],
    [4, [1], false, 1 / 4, '0.25', 'counts as a miss'],
    [3, [0, 2], false, 2 / 3, '0.67', 'counts as a miss'],
  ])('with %i key points records ticks %j as credit, passing only at 0.75', (total, ticks, isCorrect, credit, shown, standing) => {
    const onAnswer = jest.fn();
    renderIt(onAnswer, total === 3 ? THREE_POINT_EXPLAIN : SAMPLE_EXPLAIN);
    typeAndSubmit();
    const boxes = screen.getAllByRole('checkbox');
    expect(boxes).toHaveLength(total);
    ticks.forEach(i => fireEvent.click(boxes[i]));
    expect(screen.getByText(`${ticks.length} of ${total} · ${standing}`)).toBeInTheDocument();
    expect(onAnswer).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: `Record ${ticks.length} of ${total}` }));
    expect(onAnswer).toHaveBeenCalledWith(isCorrect, { hintTierUsed: 0, attempts: 1, credit });
    expect(screen.getByRole('status')).toHaveTextContent(`credit ${shown}`);
    expect(screen.getByRole('status')).toHaveTextContent(standing);
    expect(screen.getByRole('status')).not.toHaveTextContent(/under the bar/);
    screen.getAllByRole('checkbox').forEach(b => expect(b).toBeDisabled());
  });
});
