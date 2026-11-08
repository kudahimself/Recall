/**
 * Data Engineering progress saved before the rewritten Streaming section
 * replaced the old Streaming topics and Foundations' Batch vs Streaming: the
 * real <App/> must still open the course, show its path, and export the
 * stored history, retired question ids included.
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import * as progressStorage from './utils/progressStorage';
import { PROGRESS_KEY, validateExport } from './utils/progressStorage';

const KEPT_ID = 'de-whatis-1';
const RETIRED = ['de-stream-1', 'de-window-6', 'de-kafka-8', 'de-guar-7', 'de-ssql-9', 'de-batch-7'];

const seeded = {
  questionsAttempted: [KEPT_ID, ...RETIRED],
  correctAnswers: [KEPT_ID, ...RETIRED],
  attemptHistory: [KEPT_ID, ...RETIRED].map((questionId, i) => ({
    questionId, timestamp: 1_790_000_000_000 + i * 1000, isCorrect: true, attempts: 1, timeSpent: 9000,
  })),
  topicScores: { de_what_is: { correct: 1, total: 1 }, de_windows: { correct: 1, total: 1 }, de_batch_vs_streaming: { correct: 1, total: 1 } },
  difficultyScores: {},
  lastAttempt: {},
  repetitionQueue: {},
  masteredTopics: ['de_kafka_basics', 'de_batch_vs_streaming'],
};

beforeEach(() => {
  localStorage.clear();
  jest.restoreAllMocks();
});

test('progress holding retired Data Engineering ids opens, shows Streaming, and exports unchanged', async () => {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(seeded));
  localStorage.setItem('recall-active-course', 'data_engineering');
  const downloads: string[] = [];
  jest.spyOn(progressStorage, 'downloadTextFile').mockImplementation((_n, t) => { downloads.push(t); });

  render(<App />);
  expect(screen.queryByText(/could not be read/)).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Progress' }));
  expect((await screen.findAllByText(/Streaming/, {}, { timeout: 3000 })).length).toBeGreaterThan(0);

  fireEvent.click(screen.getByRole('button', { name: 'Settings' }));
  fireEvent.click(screen.getByRole('button', { name: 'Export' }));
  const check = validateExport(downloads[0]);
  expect(check.ok).toBe(true);
  const exported = JSON.parse(JSON.parse(downloads[0]).keys[PROGRESS_KEY]);
  expect(exported.attemptHistory.map((a: { questionId: string }) => a.questionId)).toEqual([KEPT_ID, ...RETIRED]);
});
