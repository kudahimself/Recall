import {
  PROGRESS_KEY,
  PROGRESS_BACKUP_PREFIX,
  listBackupKeys,
  EXPORT_KEYS,
  loadProgressFrom,
  parseStoredProgress,
  serializeProgress,
  safeSetItem,
  buildExport,
  validateExport,
  applyImport,
} from './progressStorage';

const KNOWN = new Set(['q-known']);
const noSeed = () => new Set<string>();

const stored = {
  questionsAttempted: ['q-known', 'q-renamed'],
  correctAnswers: ['q-known', 'q-renamed'],
  attemptHistory: [
    { questionId: 'q-renamed', timestamp: 1, isCorrect: true, attempts: 1, timeSpent: 5 },
    { questionId: 'q-known', timestamp: 2, isCorrect: true, attempts: 1, timeSpent: 5 },
    { questionId: 'q-renamed', timestamp: 3, isCorrect: false, attempts: 1, timeSpent: 5 },
  ],
  topicScores: { t: { correct: 2, total: 3 } },
  difficultyScores: {},
  lastAttempt: { 'q-known': 2, 'q-renamed': 3 },
  repetitionQueue: {},
  masteredTopics: [],
};

function quotaError(): Error {
  const e = new Error('The quota has been exceeded.');
  e.name = 'QuotaExceededError';
  return e;
}

beforeEach(() => localStorage.clear());

describe('unreadable progress (bug 3)', () => {
  test('a truncated store is never overwritten and is copied to a backup key', () => {
    const raw = JSON.stringify(stored).slice(0, -5);
    localStorage.setItem(PROGRESS_KEY, raw);

    const load = loadProgressFrom(localStorage, KNOWN, noSeed);

    expect(load.status).toBe('unreadable');
    expect(load.progress.attemptHistory).toEqual([]);
    expect(localStorage.getItem(PROGRESS_KEY)).toBe(raw);
    const backups = listBackupKeys(localStorage);
    expect(backups).toHaveLength(1);
    expect(load.status === 'unreadable' && load.backupKey).toBe(backups[0]);
    expect(localStorage.getItem(backups[0])).toBe(raw);
  });

  test('a wrongly shaped store counts as unreadable', () => {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify({ attemptHistory: 'oops' }));
    expect(loadProgressFrom(localStorage, KNOWN, noSeed).status).toBe('unreadable');
    localStorage.setItem(PROGRESS_KEY, '[]');
    expect(loadProgressFrom(localStorage, KNOWN, noSeed).status).toBe('unreadable');
  });

  test('a different unreadable text gets its own backup; the same text reuses its backup', () => {
    const older = `${PROGRESS_BACKUP_PREFIX}2026-01-01T00:00:00.000Z`;
    localStorage.setItem(older, 'older unreadable copy');
    localStorage.setItem(PROGRESS_KEY, '{bad');
    const now = new Date('2026-09-21T10:00:00.000Z');
    const load = loadProgressFrom(localStorage, KNOWN, noSeed, now);
    const newer = `${PROGRESS_BACKUP_PREFIX}2026-09-21T10:00:00.000Z`;
    expect(load.status === 'unreadable' && load.backupKey).toBe(newer);
    expect(localStorage.getItem(older)).toBe('older unreadable copy');
    expect(localStorage.getItem(newer)).toBe('{bad');
    expect(localStorage.getItem(PROGRESS_KEY)).toBe('{bad');

    const again = loadProgressFrom(localStorage, KNOWN, noSeed, new Date('2026-09-22T00:00:00.000Z'));
    expect(again.status === 'unreadable' && again.backupKey).toBe(newer);
    expect(listBackupKeys(localStorage)).toEqual([older, newer]);
  });

  test('a failed backup write leaves no backup key and the original untouched', () => {
    localStorage.setItem(PROGRESS_KEY, '{bad');
    const spy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw quotaError(); });
    try {
      const load = loadProgressFrom(localStorage, KNOWN, noSeed);
      expect(load.status === 'unreadable' && load.backupKey).toBeNull();
    } finally {
      spy.mockRestore();
    }
    expect(localStorage.getItem(PROGRESS_KEY)).toBe('{bad');
  });
});

describe('unknown question ids (bug 4)', () => {
  test('are filtered on read but kept in what is written back', () => {
    const { progress, orphans } = parseStoredProgress(JSON.stringify(stored), KNOWN, noSeed);
    expect(progress.attemptHistory.map(a => a.questionId)).toEqual(['q-known']);
    expect(progress.questionsAttempted.has('q-renamed')).toBe(false);

    progress.attemptHistory.push({ questionId: 'q-known', timestamp: 4, isCorrect: true, attempts: 1, timeSpent: 5 });
    const written = JSON.parse(serializeProgress(progress, orphans));

    expect(written.attemptHistory.map((a: { questionId: string; timestamp: number }) => `${a.questionId}@${a.timestamp}`))
      .toEqual(['q-renamed@1', 'q-known@2', 'q-renamed@3', 'q-known@4']);
    expect(written.questionsAttempted).toEqual(['q-known', 'q-renamed']);
    expect(written.correctAnswers).toEqual(['q-known', 'q-renamed']);
  });

  test('history comes back when the id returns to the build', () => {
    const first = parseStoredProgress(JSON.stringify(stored), KNOWN, noSeed);
    const rewritten = serializeProgress(first.progress, first.orphans);

    const back = parseStoredProgress(rewritten, new Set(['q-known', 'q-renamed']), noSeed);
    expect(back.progress.attemptHistory).toHaveLength(3);
    expect(back.orphans.attemptHistory).toHaveLength(0);
  });
});

describe('guarded writes (bug 5)', () => {
  test('a quota failure is reported, not thrown', () => {
    const spy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw quotaError(); });
    try {
      expect(safeSetItem(localStorage, PROGRESS_KEY, '{}')).toEqual({
        ok: false, error: 'The quota has been exceeded.', quotaExceeded: true,
      });
    } finally {
      spy.mockRestore();
    }
  });
});

describe('export and import', () => {
  const keys = {
    'recall-progress': JSON.stringify(stored),
    'recall-profile': JSON.stringify({ currentStreak: 3 }),
    'recall-active-course': 'backend',
  };

  test('an export validates and applies back to identical storage', () => {
    const text = buildExport(keys, new Date('2026-09-21T00:00:00Z'));
    const check = validateExport(text);
    if (!check.ok) throw new Error(check.error);
    expect(check.attemptCount).toBe(3);

    localStorage.setItem('recall-filters', 'to be cleared');
    expect(applyImport(localStorage, check.file)).toEqual({ ok: true });
    for (const k of EXPORT_KEYS) {
      expect(localStorage.getItem(k)).toBe((keys as Record<string, string>)[k] ?? null);
    }
  });

  test('backups travel as opaque text and are added without removing others', () => {
    const exported = `${PROGRESS_BACKUP_PREFIX}2026-01-01T00:00:00.000Z`;
    const kept = `${PROGRESS_BACKUP_PREFIX}2026-02-01T00:00:00.000Z`;
    const check = validateExport(buildExport({ ...keys, [exported]: '{"attemptHistory": [' }));
    if (!check.ok) throw new Error(check.error);
    localStorage.setItem(kept, 'kept');
    expect(applyImport(localStorage, check.file)).toEqual({ ok: true });
    expect(localStorage.getItem(exported)).toBe('{"attemptHistory": [');
    expect(localStorage.getItem(kept)).toBe('kept');
  });

  test.each([
    ['not JSON', 'nope'],
    ['another format', JSON.stringify({ format: 'other', version: 1, keys: {} })],
    ['a newer version', JSON.stringify({ format: 'recall-progress-export', version: 2, keys: {} })],
    ['no progress', JSON.stringify({ format: 'recall-progress-export', version: 1, keys: {} })],
    ['an unknown key', buildExport(keys).replace('"recall-profile"', '"evil-key"')],
    ['unreadable progress', buildExport({ ...keys, 'recall-progress': '{"attemptHistory":' })],
    ['malformed history', buildExport({ ...keys, 'recall-progress': '{"attemptHistory":[{"x":1}]}' })],
    ['a non-JSON profile', buildExport({ ...keys, 'recall-profile': 'x' })],
  ])('refuses a file with %s', (_label, text) => {
    expect(validateExport(text).ok).toBe(false);
  });

  test('a write failure mid-import restores every key', () => {
    localStorage.setItem('recall-progress', 'old progress');
    localStorage.setItem('recall-profile', 'old profile');
    const check = validateExport(buildExport(keys));
    if (!check.ok) throw new Error(check.error);

    const realSet = Storage.prototype.setItem;
    let calls = 0;
    const spy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(function (this: Storage, k: string, v: string) {
      calls += 1;
      if (calls === 2) throw quotaError();
      realSet.call(this, k, v);
    });
    try {
      const result = applyImport(localStorage, check.file);
      expect(result.ok).toBe(false);
    } finally {
      spy.mockRestore();
    }
    expect(localStorage.getItem('recall-progress')).toBe('old progress');
    expect(localStorage.getItem('recall-profile')).toBe('old profile');
  });
});
