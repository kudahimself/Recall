/**
 * Safe persistence for the study record.
 *
 * Everything here exists so a single bad event cannot destroy history:
 * - an unreadable `recall-progress` is never overwritten until its raw text is
 *   copied to its own timestamped backup key; then the app saves again from empty.
 *   Backups are never deleted and travel with every export. If the copy cannot be
 *   made, the app runs from empty in memory only;
 * - attempts for question ids the running build does not know are set aside on
 *   read and written back unchanged, so a renamed or temporarily missing question
 *   keeps its history and gets it back when the id returns;
 * - every write goes through `safeSetItem`, which reports failure instead of throwing;
 * - export/import round-trips the whole record as one validated file.
 */
import { QuestionAttempt, UserProgress } from '../types';

export const PROGRESS_KEY = 'recall-progress';
// One backup per unreadable text: PROGRESS_BACKUP_PREFIX + ISO timestamp.
export const PROGRESS_BACKUP_PREFIX = 'recall-progress-unreadable-backup-';
export const isBackupKey = (k: string): boolean => k.startsWith(PROGRESS_BACKUP_PREFIX);

/** Every backup key in storage, oldest first. */
export function listBackupKeys(storage: Storage): string[] {
  const out: string[] = [];
  for (let i = 0; i < storage.length; i++) {
    const k = storage.key(i);
    if (k !== null && isBackupKey(k)) out.push(k);
  }
  return out.sort();
}

export const EXPORT_FORMAT = 'recall-progress-export';
export const EXPORT_VERSION = 1;

// Keys a Recall export carries. JSON-valued keys are validated as JSON objects
// on import; the plain-string keys are stored as-is.
export const EXPORT_JSON_KEYS = [
  'recall-progress',
  'recall-profile',
  'recall-filters',
  'recall-misconceptions',
  'recall-concept-progress',
  'recall-card-difficulty',
] as const;
export const EXPORT_STRING_KEYS = [
  'recall-active-course',
  'recall-concept-migration-version',
] as const;
export const EXPORT_KEYS: readonly string[] = [...EXPORT_JSON_KEYS, ...EXPORT_STRING_KEYS];

/** Stored entries whose question id is not in the running build. Never shown, never dropped. */
export interface OrphanedProgress {
  questionsAttempted: string[];
  correctAnswers: string[];
  attemptHistory: QuestionAttempt[];
}

export const emptyOrphans = (): OrphanedProgress => ({
  questionsAttempted: [],
  correctAnswers: [],
  attemptHistory: [],
});

export const emptyProgress = (): UserProgress => ({
  questionsAttempted: new Set(),
  correctAnswers: new Set(),
  attemptHistory: [],
  topicScores: new Map(),
  difficultyScores: new Map(),
  lastAttempt: new Map(),
  repetitionQueue: new Map(),
  masteredTopics: new Set(),
});

export type ProgressLoad =
  | { status: 'empty' | 'ok'; progress: UserProgress; orphans: OrphanedProgress }
  | {
      status: 'unreadable';
      progress: UserProgress;
      orphans: OrphanedProgress;
      error: string;
      // The unreadable text itself, or null if storage could not be read at all.
      raw: string | null;
      // Key holding a copy of the unreadable text, or null if the copy could not be made.
      backupKey: string | null;
    };

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

/**
 * Check that a parsed value has the shape of a stored progress record.
 * Missing fields are fine (older stores lack some); wrong types are not.
 * Returns an error message, or null when the record is usable.
 */
export function validateStoredProgress(parsed: unknown): string | null {
  if (!isPlainObject(parsed)) return 'progress is not an object';
  for (const field of ['questionsAttempted', 'correctAnswers', 'masteredTopics']) {
    const v = parsed[field];
    if (v !== undefined && !(Array.isArray(v) && v.every(x => typeof x === 'string'))) {
      return `${field} is not a list of ids`;
    }
  }
  const history = parsed.attemptHistory;
  if (history !== undefined) {
    if (!Array.isArray(history)) return 'attemptHistory is not a list';
    const bad = history.findIndex(
      a => !isPlainObject(a) || typeof a.questionId !== 'string' || typeof a.timestamp !== 'number',
    );
    if (bad >= 0) return `attemptHistory entry ${bad} is malformed`;
  }
  for (const field of ['topicScores', 'difficultyScores', 'lastAttempt', 'repetitionQueue']) {
    const v = parsed[field];
    if (v !== undefined && !isPlainObject(v)) return `${field} is not an object`;
  }
  return null;
}

/**
 * Turn stored progress text into in-memory progress. Throws on unreadable input.
 * Ids unknown to the build are split into `orphans` rather than discarded.
 */
export function parseStoredProgress(
  raw: string,
  knownIds: ReadonlySet<string>,
  seedMastered: (history: QuestionAttempt[]) => Set<string>,
): { progress: UserProgress; orphans: OrphanedProgress } {
  const parsed = JSON.parse(raw);
  const problem = validateStoredProgress(parsed);
  if (problem) throw new Error(problem);

  const attempted: string[] = parsed.questionsAttempted ?? [];
  const correct: string[] = parsed.correctAnswers ?? [];
  const history: QuestionAttempt[] = parsed.attemptHistory ?? [];
  const known = (id: string) => knownIds.has(id);

  const knownHistory = history.filter(a => known(a.questionId));

  // Stored sticky mastery: use the persisted set when present; otherwise
  // seed it once from history (existing users predate the set). Fresh
  // installs have empty history → an empty set.
  const masteredTopics = parsed.masteredTopics !== undefined
    ? new Set<string>(parsed.masteredTopics)
    : seedMastered(knownHistory);

  return {
    progress: {
      ...parsed,
      questionsAttempted: new Set(attempted.filter(known)),
      correctAnswers: new Set(correct.filter(known)),
      attemptHistory: knownHistory,
      topicScores: new Map(Object.entries(parsed.topicScores ?? {})),
      difficultyScores: new Map(Object.entries(parsed.difficultyScores ?? {})),
      lastAttempt: new Map(Object.entries(parsed.lastAttempt ?? {})),
      repetitionQueue: new Map(Object.entries(parsed.repetitionQueue ?? {})),
      masteredTopics,
    },
    orphans: {
      questionsAttempted: attempted.filter(id => !known(id)),
      correctAnswers: correct.filter(id => !known(id)),
      attemptHistory: history.filter(a => !known(a.questionId)),
    },
  };
}

/** Serialize in-memory progress, folding set-aside orphans back in. */
export function serializeProgress(progress: UserProgress, orphans: OrphanedProgress): string {
  const unionIds = (live: Set<string>, kept: string[]) => {
    const out = Array.from(live);
    for (const id of kept) if (!live.has(id)) out.push(id);
    return out;
  };
  // Both lists are chronological; a stable sort interleaves orphans back into place.
  const attemptHistory = orphans.attemptHistory.length === 0
    ? progress.attemptHistory
    : [...progress.attemptHistory, ...orphans.attemptHistory].sort((a, b) => a.timestamp - b.timestamp);
  return JSON.stringify({
    ...progress,
    questionsAttempted: unionIds(progress.questionsAttempted, orphans.questionsAttempted),
    correctAnswers: unionIds(progress.correctAnswers, orphans.correctAnswers),
    attemptHistory,
    topicScores: Object.fromEntries(progress.topicScores),
    difficultyScores: Object.fromEntries(progress.difficultyScores),
    lastAttempt: Object.fromEntries(progress.lastAttempt),
    repetitionQueue: Object.fromEntries(progress.repetitionQueue),
    masteredTopics: Array.from(progress.masteredTopics),
  });
}

const describeError = (e: unknown): string => (e instanceof Error ? e.message : String(e));

/**
 * Read progress. A failed read NEVER writes to the progress key: the raw text
 * stays where it is, a copy goes to a new timestamped backup key (or an existing
 * backup already holding the same text is reused), and the caller gets empty
 * progress to run with in memory. Once the copy exists the caller may save over
 * the progress key again; without it, it must not.
 */
export function loadProgressFrom(
  storage: Storage,
  knownIds: ReadonlySet<string>,
  seedMastered: (history: QuestionAttempt[]) => Set<string>,
  now: Date = new Date(),
): ProgressLoad {
  let raw: string | null;
  try {
    raw = storage.getItem(PROGRESS_KEY);
  } catch (e) {
    return {
      status: 'unreadable', progress: emptyProgress(), orphans: emptyOrphans(),
      error: `browser storage could not be read (${describeError(e)})`, raw: null, backupKey: null,
    };
  }
  if (raw === null) return { status: 'empty', progress: emptyProgress(), orphans: emptyOrphans() };

  try {
    return { status: 'ok', ...parseStoredProgress(raw, knownIds, seedMastered) };
  } catch (e) {
    let backupKey: string | null = null;
    try {
      const same = listBackupKeys(storage).find(k => storage.getItem(k) === raw);
      if (same !== undefined) {
        backupKey = same;
      } else {
        const base = PROGRESS_BACKUP_PREFIX + now.toISOString();
        let key = base;
        for (let n = 2; storage.getItem(key) !== null; n++) key = `${base}-${n}`;
        storage.setItem(key, raw);
        backupKey = key;
      }
    } catch { /* no room for a copy; the original is still untouched */ }
    return {
      status: 'unreadable', progress: emptyProgress(), orphans: emptyOrphans(),
      error: describeError(e), raw, backupKey,
    };
  }
}

/** True when saving must stay off: the stored text is unreadable and has no backup copy. */
export function studyWritesBlocked(load: ProgressLoad): boolean {
  return load.status === 'unreadable' && load.backupKey === null;
}

export type WriteResult = { ok: true } | { ok: false; error: string; quotaExceeded: boolean };

export function isQuotaError(e: unknown): boolean {
  if (!(e instanceof Error) && !(typeof DOMException !== 'undefined' && e instanceof DOMException)) return false;
  const err = e as { name?: string; code?: number };
  return err.name === 'QuotaExceededError'
    || err.name === 'NS_ERROR_DOM_QUOTA_REACHED'
    || err.code === 22
    || err.code === 1014;
}

/** setItem that reports failure instead of throwing. */
export function safeSetItem(storage: Storage, key: string, value: string): WriteResult {
  try {
    storage.setItem(key, value);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: describeError(e), quotaExceeded: isQuotaError(e) };
  }
}

// ---------------------------------------------------------------------------
// Export / import
// ---------------------------------------------------------------------------

export interface ProgressExport {
  format: typeof EXPORT_FORMAT;
  version: typeof EXPORT_VERSION;
  exportedAt: string;
  // Exact stored text per key; null means the key was not set.
  keys: Record<string, string | null>;
}

export function buildExport(keys: Record<string, string | null>, now: Date = new Date()): string {
  const file: ProgressExport = {
    format: EXPORT_FORMAT,
    version: EXPORT_VERSION,
    exportedAt: now.toISOString(),
    keys: {
      ...Object.fromEntries(EXPORT_KEYS.map(k => [k, keys[k] ?? null])),
      ...Object.fromEntries(Object.entries(keys).filter(([k]) => isBackupKey(k))),
    },
  };
  return JSON.stringify(file);
}

export type ImportCheck =
  | { ok: true; file: ProgressExport; attemptCount: number }
  | { ok: false; error: string };

/**
 * Validate an export file completely before anything is written.
 * Any problem refuses the whole file.
 */
export function validateExport(text: string): ImportCheck {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, error: 'the file is not valid JSON' };
  }
  if (!isPlainObject(parsed) || parsed.format !== EXPORT_FORMAT) {
    return { ok: false, error: 'the file is not a Recall progress export' };
  }
  if (parsed.version !== EXPORT_VERSION) {
    return { ok: false, error: `unsupported export version ${String(parsed.version)}` };
  }
  const keys = parsed.keys;
  if (!isPlainObject(keys)) return { ok: false, error: 'the file has no stored keys' };

  for (const k of Object.keys(keys)) {
    if (!EXPORT_KEYS.includes(k) && !isBackupKey(k)) return { ok: false, error: `unexpected key "${k}"` };
  }
  const backupKeys = Object.keys(keys).filter(isBackupKey);
  for (const k of [...EXPORT_KEYS, ...backupKeys]) {
    const v = keys[k];
    if (v !== null && v !== undefined && typeof v !== 'string') {
      return { ok: false, error: `"${k}" is not stored text` };
    }
  }
  const progressText = keys[PROGRESS_KEY];
  if (typeof progressText !== 'string') return { ok: false, error: 'the file has no progress record' };

  let attemptCount = 0;
  for (const k of EXPORT_JSON_KEYS) {
    const v = keys[k];
    if (typeof v !== 'string') continue;
    let value: unknown;
    try {
      value = JSON.parse(v);
    } catch {
      return { ok: false, error: `"${k}" is not valid JSON` };
    }
    if (!isPlainObject(value)) return { ok: false, error: `"${k}" is not an object` };
    if (k === PROGRESS_KEY) {
      const problem = validateStoredProgress(value);
      if (problem) return { ok: false, error: `progress record: ${problem}` };
      attemptCount = Array.isArray(value.attemptHistory) ? value.attemptHistory.length : 0;
    }
  }

  const file: ProgressExport = {
    format: EXPORT_FORMAT,
    version: EXPORT_VERSION,
    exportedAt: typeof parsed.exportedAt === 'string' ? parsed.exportedAt : '',
    keys: Object.fromEntries([...EXPORT_KEYS, ...backupKeys].map(k => [k, (keys[k] as string | null | undefined) ?? null])),
  };
  return { ok: true, file, attemptCount };
}

/**
 * Write a validated export into storage, all or nothing: if any write fails,
 * every key is restored to what it held before. Backups in the file are added;
 * backups already in storage are never removed.
 */
export function applyImport(storage: Storage, file: ProgressExport): WriteResult {
  const backupKeys = Object.keys(file.keys).filter(k => isBackupKey(k) && file.keys[k] !== null);
  const previous = new Map<string, string | null>();
  for (const k of [...EXPORT_KEYS, ...backupKeys]) previous.set(k, storage.getItem(k));
  try {
    for (const k of EXPORT_KEYS) {
      const v = file.keys[k];
      if (v === null || v === undefined) storage.removeItem(k);
      else storage.setItem(k, v);
    }
    for (const k of backupKeys) storage.setItem(k, file.keys[k] as string);
    return { ok: true };
  } catch (e) {
    previous.forEach((v, k) => {
      try {
        if (v === null) storage.removeItem(k);
        else storage.setItem(k, v);
      } catch { /* best effort; the original key could not be restored */ }
    });
    return { ok: false, error: describeError(e), quotaExceeded: isQuotaError(e) };
  }
}

/** Hand the browser a text file to save. */
export function downloadTextFile(filename: string, text: string): void {
  const blob = new Blob([text], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

export function readFileText(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(reader.error ?? new Error('could not read file'));
    reader.readAsText(file);
  });
}

export function reloadPage(): void {
  window.location.reload();
}
