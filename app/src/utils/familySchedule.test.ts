/**
 * The card-family schedule (`recall-fsrs`): FSRS per family, migrated by
 * replaying attemptHistory, and the ramp-based topic unlock.
 *
 * Run: npm test -- --testPathPattern=familySchedule --watchAll=false
 */
import { Difficulty, Question, QuestionAttempt, QuestionType, UserProgress } from '../types';
import { questions } from '../data/questions';
import {
  balanceInterval,
  dueFamilies,
  emptyStore,
  familyRetrievability,
  historyBasis,
  isFamilyDue,
  loadOrRebuild,
  parseStore,
  recordAttempt,
  replayHistory,
  FsrsStore,
} from './familySchedule';
import {
  familyOf,
  isRampDoneAtBar,
  isRampDifficultyOpen,
  topicRamp,
  RAMP_CARDS_PER_STEP,
  FSRS_STORE_KEY,
  TODAY_REVIEW_SHARE_KEY,
  TODAY_SIZE_KEY,
  SpacedRepetitionSystem as SRS,
} from './spacedRepetition';
import { EXPORT_KEYS } from './progressStorage';

const DAY = 86_400_000;
const T0 = Date.UTC(2026, 8, 1, 18);
const byId = new Map(questions.map(q => [q.id, q]));
const topicQs = (t: string) => questions.filter(q => q.topic === t);

function progressFrom(history: QuestionAttempt[]): UserProgress {
  const lastAttempt = new Map<string, number>();
  for (const a of history) lastAttempt.set(a.questionId, a.timestamp);
  return {
    questionsAttempted: new Set(history.map(a => a.questionId)),
    correctAnswers: new Set(history.filter(a => a.isCorrect).map(a => a.questionId)),
    attemptHistory: history,
    topicScores: new Map(),
    difficultyScores: new Map(),
    lastAttempt,
    repetitionQueue: new Map(),
    masteredTopics: new Set(),
  };
}

/** A varied history over the first Python topics: right, wrong, slow, fast, hinted, retried. */
function sampleHistory(): QuestionAttempt[] {
  const cards = [...topicQs('py_basics').slice(0, 30), ...topicQs('py_functions').slice(0, 20)];
  const history: QuestionAttempt[] = [];
  let t = T0;
  for (let day = 0; day < 20; day++) {
    for (let i = 0; i < 12; i++) {
      const q = cards[(day * 7 + i * 3) % cards.length];
      const ok = (day + i) % 5 !== 0;
      t += 45_000 + ((day * 13 + i * 29) % 7) * 10_000;
      history.push({
        questionId: q.id, timestamp: t, isCorrect: ok, attempts: 1, timeSpent: 20_000 + (i % 4) * 15_000,
        credit: ok ? 1 : 0, hintTierUsed: (i % 6 === 0 ? 1 : 0),
        ...(i === 11 ? { retry: true } : {}),
      });
    }
    t = T0 + (day + 1) * DAY;
  }
  return history;
}

describe('migration: replaying attemptHistory', () => {
  it('gives exactly the schedule live answers built, and is deterministic', () => {
    const history = sampleHistory();
    let live: FsrsStore = emptyStore();
    history.forEach((a, i) => { live = recordAttempt(live, byId.get(a.questionId)!, a, history.slice(0, i + 1)); });
    const replayed = replayHistory(history, byId);
    expect(replayed).toEqual(live);
    expect(replayHistory(history, byId)).toEqual(replayed);
    expect(replayed.basis).toBe(historyBasis(history));
  });

  it('gives one state per family, not per card', () => {
    const history = sampleHistory();
    const store = replayHistory(history, byId);
    const families = new Set(history.map(a => familyOf(byId.get(a.questionId)!)));
    expect(Object.keys(store.families).sort()).toEqual(Array.from(families).sort());
    expect(Object.keys(store.cards).length).toBe(new Set(history.map(a => a.questionId)).size);
  });

  it('skips cards not in the bank, and a retry is not a second review of its family', () => {
    const q = topicQs('py_basics')[0];
    const miss: QuestionAttempt = { questionId: q.id, timestamp: T0, isCorrect: false, attempts: 1, timeSpent: 30_000, credit: 0, hintTierUsed: 0 };
    const pass: QuestionAttempt = { questionId: q.id, timestamp: T0 + 120_000, isCorrect: true, attempts: 2, timeSpent: 150_000, credit: 1, hintTierUsed: 0, retry: true };
    const ghost: QuestionAttempt = { ...miss, questionId: 'no-such-card', timestamp: T0 + 1000 };
    const store = replayHistory([miss, ghost, pass], byId);
    const s = store.families[familyOf(q)];
    expect(s.reps).toBe(1);
    expect(s.lapses).toBe(0);
    expect(s.lastCorrect).toBe(false);
    // The first-submit miss brings the family back the next day.
    expect(isFamilyDue(s, T0 + DAY)).toBe(true);
    expect(store.cards['no-such-card']).toBeUndefined();
  });

  it('uses the stored schedule when it matches the history, and rebuilds it when missing, unreadable, old or stale', () => {
    const history = sampleHistory();
    const p = progressFrom(history);
    const stored = replayHistory(history, byId);
    const tweaked = { ...stored, families: { ...stored.families, marker: stored.families[Object.keys(stored.families)[0]] } };
    expect(loadOrRebuild(JSON.stringify(tweaked), p, byId)).toEqual({ store: tweaked, rebuilt: false });
    for (const raw of [null, '{not json', JSON.stringify({ ...stored, version: 0 }), JSON.stringify({ ...stored, basis: '3:1' })]) {
      const r = loadOrRebuild(raw, p, byId);
      expect(r.rebuilt).toBe(true);
      expect(r.store).toEqual(stored);
    }
    expect(parseStore(JSON.stringify({ version: 1, basis: '0:0', families: {} }))).toBeNull();
  });

  it('is exported and imported with the rest of the progress, as are the session settings', () => {
    expect(FSRS_STORE_KEY).toBe('recall-fsrs');
    expect(EXPORT_KEYS).toEqual(expect.arrayContaining([
      'recall-fsrs', 'recall-progress', 'recall-card-difficulty', 'recall-concept-progress', TODAY_SIZE_KEY, TODAY_REVIEW_SHARE_KEY,
    ]));
  });
});

describe('scheduling', () => {
  it('load balancing moves a long interval within its spread to the least-loaded day', () => {
    const families: FsrsStore['families'] = {};
    const base = emptyStore();
    const q = topicQs('py_basics')[0];
    const s0 = recordAttempt(base, q, { questionId: q.id, timestamp: T0, isCorrect: true, attempts: 1, timeSpent: 10_000 }, []).families[familyOf(q)];
    // Pile 5 families onto day 20 and leave day 19 empty.
    for (let i = 0; i < 5; i++) families[`f${i}`] = { ...s0, due: T0 + 20 * DAY };
    expect(balanceInterval(families, 'x', T0, 20)).not.toBe(20);
    expect(Math.abs(balanceInterval(families, 'x', T0, 20) - 20)).toBeLessThanOrEqual(3);
    // An empty calendar keeps the FSRS interval; short intervals are never moved.
    expect(balanceInterval({}, 'x', T0, 20)).toBe(20);
    expect(balanceInterval(families, 'x', T0, 2)).toBe(2);
  });

  it('due families come most overdue first', () => {
    const history = sampleHistory();
    const store = replayHistory(history, byId);
    const later = T0 + 60 * DAY;
    const due = dueFamilies(store, later);
    expect(due.length).toBe(Object.keys(store.families).length);
    const r = due.map(f => familyRetrievability(store.families[f], later));
    expect([...r].sort((a, b) => a - b)).toEqual(r);
  });
});

describe('ramp unlock (decision 4)', () => {
  it('a ramp holds every family\'s first card and at most RAMP_CARDS_PER_STEP more per step, in ramp order', () => {
    const tq = topicQs('py_basics');
    const ramp = topicRamp(tq);
    expect(new Set(ramp.map(familyOf))).toEqual(new Set(tq.map(familyOf)));
    expect(ramp.length).toBeLessThan(tq.length / 2);
    const diffs = ramp.map(q => [Difficulty.BEGINNER, Difficulty.INTERMEDIATE, Difficulty.ADVANCED].indexOf(q.difficulty));
    expect([...diffs].sort((a, b) => a - b)).toEqual(diffs);
    const firsts = new Set<string>();
    const extra = new Map<string, number>();
    for (const q of ramp) {
      const f = familyOf(q);
      if (!firsts.has(f)) { firsts.add(f); continue; }
      const step = `${q.difficulty}|${q.type}`;
      extra.set(step, (extra.get(step) ?? 0) + 1);
    }
    for (const n of Array.from(extra.values())) expect(n).toBeLessThanOrEqual(RAMP_CARDS_PER_STEP);
  });

  it('the next topic opens once the ramp is done above the bar, without every card of the topic', () => {
    const tq = topicQs('py_basics');
    const ramp = topicRamp(tq);
    const history: QuestionAttempt[] = ramp.map((q, i) => ({
      questionId: q.id, timestamp: T0 + i * 60_000, isCorrect: i % 10 !== 0, attempts: 1, timeSpent: 30_000,
      credit: i % 10 !== 0 ? 1 : 0, hintTierUsed: 0,
    }));
    const p = progressFrom(history);
    expect(isRampDoneAtBar(tq, SRS.latestCredit(p))).toBe(true);
    const mastered = SRS.updateMasteredTopics(p, 'py_basics', questions);
    expect(mastered.has('py_basics')).toBe(true);
    const unlocked = SRS.getUnlockedTopics(questions.filter(q => q.topic.startsWith('py_')), { ...p, masteredTopics: mastered });
    expect(unlocked?.has('py_data_structures')).toBe(true);
  });

  it('a ramp below the bar or with a card left does not open it', () => {
    const tq = topicQs('py_basics');
    const ramp = topicRamp(tq);
    const mk = (qs: Question[], okEvery: number): UserProgress => progressFrom(qs.map((q, i) => ({
      questionId: q.id, timestamp: T0 + i * 60_000, isCorrect: i % okEvery !== 0, attempts: 1, timeSpent: 30_000,
      credit: i % okEvery !== 0 ? 1 : 0, hintTierUsed: 0,
    })));
    expect(isRampDoneAtBar(tq, SRS.latestCredit(mk(ramp, 3)))).toBe(false); // 66% right
    expect(isRampDoneAtBar(tq, SRS.latestCredit(mk(ramp.slice(1), 100)))).toBe(false); // one ramp card left
  });

  it('the ramp\'s difficulty gate needs only the ramp\'s easier cards, not all of them', () => {
    const tq = topicQs('py_functions');
    const beginnerRamp = topicRamp(tq).filter(q => q.difficulty === Difficulty.BEGINNER);
    const latest = new Map(beginnerRamp.map(q => [q.id, true] as [string, boolean]));
    expect(beginnerRamp.length).toBeLessThan(tq.filter(q => q.difficulty === Difficulty.BEGINNER).length);
    expect(isRampDifficultyOpen(tq, latest, Difficulty.INTERMEDIATE)).toBe(true);
    expect(isRampDifficultyOpen(tq, new Map(), Difficulty.INTERMEDIATE)).toBe(false);
    expect(tq.some(q => q.type === QuestionType.CODING)).toBe(true);
  });
});
