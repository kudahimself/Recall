/**
 * The decision and design types end to end in the real <App/>: a dev sample
 * opened with `?sample=<id>` renders in the quiz view, grades, and records
 * nothing in progress.
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import { PROGRESS_KEY } from './utils/progressStorage';

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  window.history.replaceState(null, '', '/');
});

test('?sample=<id> opens a spot-the-flaw sample in the quiz view, grades it, and records nothing', async () => {
  window.history.replaceState(null, '', '/?sample=dev-sample-spot-flaw');
  render(<App />);

  const lines = await screen.findAllByRole('option', {}, { timeout: 3000 });
  expect(screen.getByText(/Click the line that causes it/)).toBeInTheDocument();
  fireEvent.click(lines[4]);
  fireEvent.click(screen.getByRole('button', { name: 'Check line 5' }));
  expect(screen.getByRole('status')).toHaveTextContent('Correct');
  expect(await screen.findByRole('button', { name: /Next Question/ })).toBeInTheDocument();

  const stored = localStorage.getItem(PROGRESS_KEY);
  expect(stored === null || !stored.includes('dev-sample')).toBe(true);
});

test('?sample=<id> opens an explain sample, the review-only type', async () => {
  window.history.replaceState(null, '', '/?sample=dev-sample-explain');
  render(<App />);
  expect(await screen.findByText(/Name one kind of step that breaks it/, {}, { timeout: 3000 })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Submit and see the key points' })).toBeDisabled();
});
