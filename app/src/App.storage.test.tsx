/**
 * The storage faults from the bug hunt, reproduced against the real <App/>:
 * an unreadable store, history for ids missing from the build, a failed
 * write, a second tab, and an export that must import back unchanged.
 */
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import App from './App';
import * as progressStorage from './utils/progressStorage';
import { PROGRESS_KEY, PROGRESS_BACKUP_PREFIX, EXPORT_KEYS, listBackupKeys } from './utils/progressStorage';

const KNOWN_ID = 'py-functools-parsons-5';
const GONE_ID = 'py-functools-renamed-away';

const seeded = {
  questionsAttempted: [KNOWN_ID, GONE_ID],
  correctAnswers: [KNOWN_ID, GONE_ID],
  attemptHistory: [
    { questionId: GONE_ID, timestamp: 1_700_000_000_000, isCorrect: true, attempts: 1, timeSpent: 9000 },
    { questionId: KNOWN_ID, timestamp: 1_700_000_100_000, isCorrect: true, attempts: 1, timeSpent: 9000 },
  ],
  topicScores: { py_functools: { correct: 2, total: 2 } },
  difficultyScores: {},
  lastAttempt: { [KNOWN_ID]: 1_700_000_100_000, [GONE_ID]: 1_700_000_000_000 },
  repetitionQueue: {},
  masteredTopics: [],
};

const backups = () => listBackupKeys(localStorage).map(k => localStorage.getItem(k));

const historyIds = () =>
  JSON.parse(localStorage.getItem(PROGRESS_KEY) as string).attemptHistory.map((a: { questionId: string }) => a.questionId);

async function resetActiveCourse() {
  jest.spyOn(window, 'confirm').mockReturnValue(true);
  fireEvent.click(screen.getByRole('button', { name: 'Progress' }));
  const reset = await screen.findByRole('button', { name: /^Reset .* Progress$/ }, { timeout: 3000 });
  fireEvent.click(reset);
}

function quotaError(): Error {
  const e = new Error('The quota has been exceeded.');
  e.name = 'QuotaExceededError';
  return e;
}

beforeEach(() => {
  localStorage.clear();
  jest.restoreAllMocks();
});

test('a corrupted store survives two loads untouched, with a backup and an on-screen notice (bug 3)', () => {
  const raw = JSON.stringify(seeded).slice(0, -5);
  localStorage.setItem(PROGRESS_KEY, raw);

  const { unmount: unmountFirst } = render(<App />);
  expect(screen.getByText(/Your saved progress could not be read/)).toBeInTheDocument();
  expect(screen.getByText(/Saving has resumed from a fresh start/)).toBeInTheDocument();
  expect(localStorage.getItem(PROGRESS_KEY)).toBe(raw);
  expect(backups()).toEqual([raw]);
  unmountFirst();

  render(<App />);
  expect(localStorage.getItem(PROGRESS_KEY)).toBe(raw);
  expect(backups()).toEqual([raw]);
});

test('once the backup is made, saving resumes and the backup keeps the original (bug 3)', async () => {
  const raw = '{"attemptHistory": [';
  localStorage.setItem(PROGRESS_KEY, raw);
  render(<App />);
  expect(screen.getByRole('button', { name: /Export/ })).toBeEnabled();
  expect(localStorage.getItem('recall-card-difficulty')).not.toBeNull();

  await resetActiveCourse();
  await waitFor(() => expect(localStorage.getItem(PROGRESS_KEY)).not.toBe(raw));
  expect(JSON.parse(localStorage.getItem(PROGRESS_KEY) as string).attemptHistory).toEqual([]);
  expect(backups()).toEqual([raw]);
});

test('a second, different corruption gets its own backup and saving resumes again', async () => {
  const first = '{"attemptHistory": [';
  localStorage.setItem(PROGRESS_KEY, first);
  const { unmount } = render(<App />);
  await resetActiveCourse();
  await waitFor(() => expect(localStorage.getItem(PROGRESS_KEY)).not.toBe(first));
  unmount();

  const second = '{"questionsAttempted": ';
  localStorage.setItem(PROGRESS_KEY, second);
  render(<App />);
  expect(screen.getByText(/Saving has resumed from a fresh start/)).toBeInTheDocument();
  expect(backups()).toEqual([first, second]);
  await resetActiveCourse();
  await waitFor(() => expect(localStorage.getItem(PROGRESS_KEY)).not.toBe(second));
  expect(JSON.parse(localStorage.getItem(PROGRESS_KEY) as string).attemptHistory).toEqual([]);
  expect(backups()).toEqual([first, second]);
});

test('the backup notice returns on a later clean load and Export carries the backups', () => {
  const backupKey = `${PROGRESS_BACKUP_PREFIX}2026-01-01T00:00:00.000Z`;
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(seeded));
  localStorage.setItem(backupKey, 'old unreadable text');
  const downloads: Array<[string, string]> = [];
  jest.spyOn(progressStorage, 'downloadTextFile').mockImplementation((n, t) => { downloads.push([n, t]); });

  const { unmount } = render(<App />);
  expect(screen.getByText(/Recall keeps a backup of progress it could not read/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: /Download backup/ }));
  expect(downloads[0][1]).toBe('old unreadable text');
  fireEvent.click(screen.getByRole('button', { name: /Export/ }));
  expect(JSON.parse(downloads[1][1]).keys[backupKey]).toBe('old unreadable text');
  fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
  expect(screen.queryByText(/Recall keeps a backup/)).not.toBeInTheDocument();
  unmount();

  render(<App />);
  expect(screen.getByText(/Recall keeps a backup of progress it could not read/)).toBeInTheDocument();
});

test('without a backup, a failed load never writes, even after the in-memory state changes (bug 3)', async () => {
  const raw = '{"attemptHistory": [';
  localStorage.setItem(PROGRESS_KEY, raw);
  const olderKey = `${PROGRESS_BACKUP_PREFIX}2026-01-01T00:00:00.000Z`;
  localStorage.setItem(olderKey, 'an older unreadable copy');
  const realSet = Storage.prototype.setItem;
  jest.spyOn(Storage.prototype, 'setItem').mockImplementation(function (this: Storage, k: string, v: string) {
    if (k.startsWith(PROGRESS_BACKUP_PREFIX)) throw quotaError();
    realSet.call(this, k, v);
  });
  render(<App />);
  expect(screen.getByText(/saving is off to protect it/)).toBeInTheDocument();
  expect(screen.getByText(/Earlier backups are still kept/)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Export/ })).toBeDisabled();

  await resetActiveCourse();
  expect(localStorage.getItem(PROGRESS_KEY)).toBe(raw);
  expect(backups()).toEqual(['an older unreadable copy']);
  expect(localStorage.getItem('recall-card-difficulty')).toBeNull();
});

test('the banner downloads the unreadable text as a file', () => {
  const raw = '{"attemptHistory": [';
  localStorage.setItem(PROGRESS_KEY, raw);
  const download = jest.spyOn(progressStorage, 'downloadTextFile').mockImplementation(() => {});
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: 'Download unreadable data' }));
  expect(download).toHaveBeenCalledTimes(1);
  expect(download.mock.calls[0][1]).toBe(raw);
});

test('history for an id missing from the build is kept in storage (bug 4)', async () => {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(seeded));
  render(<App />);
  // Opening the app no longer rewrites the record at all.
  expect(historyIds()).toEqual([GONE_ID, KNOWN_ID]);

  // Force a real progress write (Databricks reset leaves Backend alone).
  await resetActiveCourse();
  await waitFor(() => expect(localStorage.getItem(PROGRESS_KEY)).not.toBe(JSON.stringify(seeded)));
  expect(historyIds()).toEqual([GONE_ID, KNOWN_ID]);
  const stored = JSON.parse(localStorage.getItem(PROGRESS_KEY) as string);
  expect(stored.questionsAttempted).toContain(GONE_ID);
  expect(stored.correctAnswers).toContain(GONE_ID);
});

test('a failed progress write keeps the app on screen and warns (bug 5)', async () => {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(seeded));
  const realSet = Storage.prototype.setItem;
  jest.spyOn(Storage.prototype, 'setItem').mockImplementation(function (this: Storage, k: string, v: string) {
    if (k === PROGRESS_KEY) throw quotaError();
    realSet.call(this, k, v);
  });

  render(<App />);
  await resetActiveCourse();

  expect(await screen.findByText(/Your progress is not being saved/)).toBeInTheDocument();
  expect(screen.getByText(/browser storage is full/)).toBeInTheDocument();
  expect(screen.getByText(/^Recall$/)).toBeInTheDocument();
  expect(localStorage.getItem(PROGRESS_KEY)).toBe(JSON.stringify(seeded));
});

test('a tab stops saving once another tab has saved answers (bug 6)', async () => {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(seeded));
  render(<App />);

  // The other tab answers a question and writes its newer record.
  const otherTabRecord = JSON.stringify({ ...seeded, attemptHistory: [...seeded.attemptHistory,
    { questionId: KNOWN_ID, timestamp: 1_700_000_200_000, isCorrect: true, attempts: 1, timeSpent: 1000 }] });
  localStorage.setItem(PROGRESS_KEY, otherTabRecord);
  act(() => {
    window.dispatchEvent(new StorageEvent('storage', { key: PROGRESS_KEY, newValue: otherTabRecord }));
  });
  expect(screen.getByText(/Recall is open in another tab/)).toBeInTheDocument();

  // This (stale) tab changes its state; it must not overwrite the other tab.
  await resetActiveCourse();
  expect(localStorage.getItem(PROGRESS_KEY)).toBe(otherTabRecord);
});

test('a stale tab cannot export its older copy and is told to reload', () => {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(seeded));
  const download = jest.spyOn(progressStorage, 'downloadTextFile').mockImplementation(() => {});
  render(<App />);
  expect(screen.getByRole('button', { name: /Export/ })).toBeEnabled();

  act(() => {
    window.dispatchEvent(new StorageEvent('storage', { key: PROGRESS_KEY, newValue: '{}' }));
  });

  const exportButton = screen.getByRole('button', { name: /Export/ });
  expect(exportButton).toBeDisabled();
  expect(screen.getByText(/Reload this tab to export the latest progress/)).toBeInTheDocument();
  fireEvent.click(exportButton);
  expect(download).not.toHaveBeenCalled();
});

test('an export imports back to identical state', async () => {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(seeded));
  localStorage.setItem('recall-profile', JSON.stringify({
    lastActiveDate: '2026-09-20', totalSessions: 4, currentStreak: 2, longestStreak: 5,
    totalTimeSpentMs: 1234, savedFilters: null,
  }));
  localStorage.setItem('recall-card-difficulty', JSON.stringify({ [KNOWN_ID]: 6.5 }));
  localStorage.setItem('recall-active-course', 'backend');

  const downloads: string[] = [];
  jest.spyOn(progressStorage, 'downloadTextFile').mockImplementation((_name, text) => { downloads.push(text); });
  const reload = jest.spyOn(progressStorage, 'reloadPage').mockImplementation(() => {});
  jest.spyOn(window, 'confirm').mockReturnValue(true);

  const { unmount: unmountFirst } = render(<App />);
  fireEvent.click(screen.getByRole('button', { name: /Export/ }));
  expect(downloads).toHaveLength(1);
  const exported = JSON.parse(downloads[0]);
  expect(JSON.parse(exported.keys[PROGRESS_KEY]).attemptHistory).toHaveLength(2);
  const before = Object.fromEntries(EXPORT_KEYS.map(k => [k, localStorage.getItem(k)]));
  unmountFirst();

  // Lose everything, then import the file.
  localStorage.clear();
  const { unmount: unmountSecond } = render(<App />);
  const file = new File([downloads[0]], 'recall-progress.json', { type: 'application/json' });
  fireEvent.change(screen.getByTestId('import-progress-input'), { target: { files: [file] } });
  await waitFor(() => expect(reload).toHaveBeenCalled());
  unmountSecond();

  const after = Object.fromEntries(EXPORT_KEYS.map(k => [k, localStorage.getItem(k)]));
  expect(exported.keys).toEqual(before);
  expect(after).toEqual(before);

  // Reloaded app exports the same record again.
  render(<App />);
  fireEvent.click(screen.getByRole('button', { name: /Export/ }));
  expect(JSON.parse(downloads[1]).keys).toEqual(exported.keys);
});

test('a bad import file is refused and nothing is changed', async () => {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(seeded));
  const reload = jest.spyOn(progressStorage, 'reloadPage').mockImplementation(() => {});
  render(<App />);
  const bad = JSON.stringify({ format: 'recall-progress-export', version: 1, keys: { [PROGRESS_KEY]: '{"attemptHistory": 7}' } });
  fireEvent.change(screen.getByTestId('import-progress-input'), {
    target: { files: [new File([bad], 'bad.json', { type: 'application/json' })] },
  });
  expect(await screen.findByText(/Import refused/)).toBeInTheDocument();
  expect(localStorage.getItem(PROGRESS_KEY)).toBe(JSON.stringify(seeded));
  expect(reload).not.toHaveBeenCalled();
});
