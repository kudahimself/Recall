/**
 * The exercise card against the real <App/>: Progress → Topics shows the
 * selected Python topic's exercise (task, folder, how to run it), the learner
 * ticks it done, the tick is stored under recall-exercises and survives a
 * reload, and opening the app alone writes nothing.
 */
import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import App from './App';
import { EXERCISES_KEY } from './utils/spacedRepetition';

async function openTopics() {
  fireEvent.click(screen.getByRole('button', { name: 'Progress' }));
  fireEvent.click(await screen.findByRole('button', { name: /^Topics$/ }, { timeout: 3000 }));
  return screen.findByRole('region', { name: 'Exercise: Shelf labels' }, { timeout: 3000 });
}

beforeEach(() => {
  localStorage.clear();
  localStorage.setItem('recall-active-course', 'backend');
});

test('the first Python topic shows its exercise, and the done tick is stored and survives a reload', async () => {
  const { unmount } = render(<App />);
  const card = await openTopics();
  expect(within(card).getByText('exercises/backend/py_basics')).toBeInTheDocument();
  expect(within(card).getByText('labels.py')).toBeInTheDocument();
  expect(within(card).getByText('test_labels.py')).toBeInTheDocument();
  expect(within(card).getByText(/Best after the ramp/)).toBeInTheDocument();
  expect(localStorage.getItem(EXERCISES_KEY)).toBeNull();

  const tick = within(card).getByRole('checkbox');
  expect(tick).not.toBeChecked();
  fireEvent.click(tick);
  expect(tick).toBeChecked();
  expect(within(card).getByText('Done today')).toBeInTheDocument();
  const stored = JSON.parse(localStorage.getItem(EXERCISES_KEY) as string);
  expect(Object.keys(stored)).toEqual(['py_basics']);
  expect(screen.getByText(/· exercise done/)).toBeInTheDocument();

  unmount();
  render(<App />);
  const again = await openTopics();
  expect(within(again).getByRole('checkbox')).toBeChecked();

  fireEvent.click(within(again).getByRole('checkbox'));
  expect(JSON.parse(localStorage.getItem(EXERCISES_KEY) as string)).toEqual({});
});
