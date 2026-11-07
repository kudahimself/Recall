/**
 * The lesson gate against the real <App/>: a new learner of the SQL course
 * meets the first topic's rule card before its first question, the
 * exercises follow in order with the rule card beside them, R reopens it in
 * full, and a learner who already answered an exercise is never asked for
 * the lesson (credit from history).
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import { PROGRESS_KEY } from './utils/progressStorage';
import { LESSONS_KEY } from './utils/spacedRepetition';

const START = /Start today's session/;

function progressWith(answered: string[]) {
  const t = 1_700_000_000_000;
  return JSON.stringify({
    questionsAttempted: answered,
    correctAnswers: answered,
    attemptHistory: answered.map((id, i) => ({ questionId: id, timestamp: t + i, isCorrect: true, attempts: 1, timeSpent: 9000 })),
    topicScores: {},
    difficultyScores: {},
    lastAttempt: Object.fromEntries(answered.map((id, i) => [id, t + i])),
    repetitionQueue: {},
    masteredTopics: [],
  });
}

beforeEach(() => {
  localStorage.clear();
  localStorage.setItem('recall-active-course', 'sql');
});

test('a new learner gets the rule card first, then the exercises in order, and R reopens the card', async () => {
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: START }));

  const tryIt = await screen.findByRole('button', { name: /Try the exercises/ }, { timeout: 3000 });
  expect(screen.getByRole('heading', { name: 'SELECT, WHERE, ORDER BY, TOP' })).toBeInTheDocument();
  expect(screen.getByText(/Checked: this example runs and prints exactly this/)).toBeInTheDocument();
  // The rule card is the gate: no question is on screen yet.
  expect(screen.queryByText(/Check answer/)).toBeNull();

  fireEvent.click(tryIt);
  expect(await screen.findByText(/Which query returns the 5 most expensive products/)).toBeInTheDocument();
  expect(screen.getByRole('list', { name: 'Lesson · SELECT, WHERE, ORDER BY, TOP' })).toBeInTheDocument();
  expect(screen.getByText(/exercise 1 of 5/)).toBeInTheDocument();
  expect(screen.getByRole('complementary', { name: /Rule card: SELECT/ })).toBeInTheDocument();

  fireEvent.click(screen.getByText('SELECT TOP (5) ProductName, Price FROM dbo.DimProduct ORDER BY Price DESC;'));
  fireEvent.click(screen.getByRole('button', { name: /Check answer/ }));
  fireEvent.click(await screen.findByRole('button', { name: /Next exercise/ }));
  expect(await screen.findByText(/SELECT DISTINCT Country FROM dbo.DimCustomer/)).toBeInTheDocument();
  expect(screen.getByText(/exercise 2 of 5/)).toBeInTheDocument();

  // R opens the full card over the exercise; Esc closes it.
  fireEvent.keyDown(window, { key: 'r' });
  expect(screen.getByRole('dialog')).toBeInTheDocument();
  fireEvent.keyDown(window, { key: 'Escape' });
  expect(screen.queryByRole('dialog')).toBeNull();

  // The lesson's exercises go through the normal answer path.
  const stored = JSON.parse(localStorage.getItem(PROGRESS_KEY) as string);
  expect(stored.attemptHistory.map((a: { questionId: string }) => a.questionId)).toEqual(['tsql-select-mcq-1']);
});

test('a learner who already answered one of the exercises is not asked for the lesson', async () => {
  localStorage.setItem(PROGRESS_KEY, progressWith(['tsql-select-mcq-1']));
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: START }));
  expect(await screen.findByText(/Check answer/, {}, { timeout: 3000 })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /Try the exercises/ })).toBeNull();
  // The rule card is still there to reopen.
  expect(screen.getByRole('button', { name: /Rule card/ })).toBeInTheDocument();
  // Nothing about lessons is written just by opening the app.
  expect(localStorage.getItem(LESSONS_KEY)).toBeNull();
});
