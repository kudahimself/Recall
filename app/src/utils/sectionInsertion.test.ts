/**
 * A section inserted early in a course must not re-lock the sections a learner
 * had already reached. The Data Engineering rewrite inserts sections ahead of
 * old ones (Storage & Files at Step 2, Moving Data at Step 4), so a learner who
 * was past them would otherwise find later sections locked again and their
 * due reviews there no longer served.
 *
 * "Reached" is derived from stored progress: a question of the section
 * answered, or one of its topics mastered. It travels with Export/Import.
 *
 * Run: npm test -- --testPathPattern=sectionInsertion --watchAll=false
 */
import { questions as allQuestions } from '../data/questions';
import { Course, QuestionAttempt, UserProgress } from '../types';
import { DATA_ENG_PATH_ORDER, getCourseForTopic, getSectionUnits, getTopicKeysForSection } from './courseConfig';
import { buildCoursePath } from './coursePath';
import { replayHistory } from './familySchedule';
import {
  EXPORT_KEYS,
  applyImport,
  buildExport,
  emptyOrphans,
  loadProgressFrom,
  serializeProgress,
  validateExport,
} from './progressStorage';
import { buildReviewList } from './reviewSession';
import { SpacedRepetitionSystem as SRS } from './spacedRepetition';

const DAY = 86_400_000;
const NOW = Date.UTC(2026, 10, 8, 9);
const dePool = allQuestions.filter(q => getCourseForTopic(q.topic) === Course.DATA_ENGINEERING);
const byId = new Map(allQuestions.map(q => [q.id, q]));
const knownIds = new Set(allQuestions.map(q => q.id));
const noSeed = () => new Set<string>();

const STORAGE = 'Storage & Files';
const ARCHITECTURE = 'Architecture & Open Table Formats';
const MOVING = 'Moving Data';
const MODELING = 'Modeling Concepts';
const STREAMING = 'Streaming';

function emptyProgress(): UserProgress {
  return {
    questionsAttempted: new Set(),
    correctAnswers: new Set(),
    attemptHistory: [],
    topicScores: new Map(),
    difficultyScores: new Map(),
    lastAttempt: new Map(),
    repetitionQueue: new Map(),
    masteredTopics: new Set(),
  };
}

const firstOf = (topic: string) => dePool.find(q => q.topic === topic)!;

function answer(p: UserProgress, id: string, at: number) {
  const a: QuestionAttempt = { questionId: id, isCorrect: true, timestamp: at, attempts: 1, timeSpent: 5000 };
  p.questionsAttempted.add(id);
  p.correctAnswers.add(id);
  p.attemptHistory.push(a);
  p.lastAttempt.set(id, at);
}

/**
 * A learner who got past Moving Data before Storage & Files was inserted at
 * Step 2: Foundations, Architecture and Moving Data mastered, two Modeling
 * Concepts units started (the first and the third), and nothing of Storage &
 * Files. Every answer is three weeks old, so its family is due.
 */
function pastMovingData(): UserProgress {
  const p = emptyProgress();
  p.masteredTopics = new Set(['Foundations', ARCHITECTURE, MOVING].flatMap(getTopicKeysForSection));
  const modelingUnits = getSectionUnits(MODELING);
  const started = [...getTopicKeysForSection(MOVING), modelingUnits[0][1][0], modelingUnits[2][1][0]];
  started.forEach((t, i) => answer(p, firstOf(t).id, NOW - 21 * DAY + i));
  return p;
}

const unlockedSections = (p: UserProgress) => Array.from(SRS.getUnlockedSections(dePool, p)!.sections);

describe('a learner past Moving Data when a section is inserted before it', () => {
  test('keeps Moving Data and the later section it reached unlocked, and opens the inserted one', () => {
    expect(DATA_ENG_PATH_ORDER.indexOf(STORAGE)).toBeLessThan(DATA_ENG_PATH_ORDER.indexOf(MOVING));
    expect(unlockedSections(pastMovingData())).toEqual(['Foundations', STORAGE, ARCHITECTURE, MOVING, MODELING]);
  });

  test('the section after the last one reached still waits for its own unlock', () => {
    expect(unlockedSections(pastMovingData())).not.toContain(STREAMING);
  });

  test('inside a reached section, units up to the last one started are open; the next still waits', () => {
    const topics = SRS.getUnlockedTopics(dePool, pastMovingData())!;
    const units = getSectionUnits(MODELING).map(([, keys]) => keys[0]);
    expect(units.slice(0, 3).every(t => topics.has(t))).toBe(true);
    expect(topics.has(units[3])).toBe(false);
    getTopicKeysForSection(MOVING).forEach(t => expect(topics.has(t)).toBe(true));
  });

  test('its due reviews in Moving Data and Modeling Concepts are still served', () => {
    const p = pastMovingData();
    const store = replayHistory(p.attemptHistory, byId);
    const { entries } = buildReviewList(dePool, p, store, {}, NOW, 50);
    const sections = new Set(entries.map(e => DATA_ENG_PATH_ORDER.find(s => getTopicKeysForSection(s).includes(byId.get(e.id)!.topic))));
    expect(sections).toEqual(new Set([MOVING, MODELING]));
  });

  test('the inserted section shows as open, not passed, on Home and Progress', () => {
    const p = pastMovingData();
    const path = buildCoursePath(Course.DATA_ENGINEERING, dePool, p, replayHistory(p.attemptHistory, byId), {}, NOW);
    const status = Object.fromEntries(path.sections.map(s => [s.name, s.status]));
    expect(status).toMatchObject({
      Foundations: 'mastered',
      [STORAGE]: 'open',
      [ARCHITECTURE]: 'mastered',
      [MOVING]: 'mastered',
      [MODELING]: 'current',
      [STREAMING]: 'locked',
    });
    expect(path.current?.name).toBe(MODELING);
    expect(path.nextLocked?.name).toBe(STREAMING);
  });

  test('a section inserted anywhere ahead keeps every reached section open', () => {
    // Move the last section to Step 2, as a future insertion would place it.
    const moved = DATA_ENG_PATH_ORDER[DATA_ENG_PATH_ORDER.length - 1];
    const original = [...DATA_ENG_PATH_ORDER];
    DATA_ENG_PATH_ORDER.splice(DATA_ENG_PATH_ORDER.length - 1, 1);
    DATA_ENG_PATH_ORDER.splice(1, 0, moved);
    try {
      const unlocked = unlockedSections(pastMovingData());
      [moved, STORAGE, ARCHITECTURE, MOVING, MODELING].forEach(s => expect(unlocked).toContain(s));
      expect(unlocked).not.toContain(STREAMING);
    } finally {
      DATA_ENG_PATH_ORDER.splice(0, DATA_ENG_PATH_ORDER.length, ...original);
    }
  });
});

describe('a learner who has not reached a section', () => {
  test('a fresh learner sees only the first section open', () => {
    expect(unlockedSections(emptyProgress())).toEqual(['Foundations']);
    const path = buildCoursePath(Course.DATA_ENGINEERING, dePool, emptyProgress(), replayHistory([], byId), {}, NOW);
    expect(path.sections.map(s => s.status)).toEqual(['current', ...Array(path.sections.length - 1).fill('locked')]);
  });

  test('the normal lock order holds: each section waits for the one before it', () => {
    const p = emptyProgress();
    p.masteredTopics = new Set(getTopicKeysForSection('Foundations'));
    answer(p, firstOf(getTopicKeysForSection(STORAGE)[0]).id, NOW - DAY);
    expect(unlockedSections(p)).toEqual(['Foundations', STORAGE]);
    const topics = SRS.getUnlockedTopics(dePool, p)!;
    expect(topics.has(getSectionUnits(STORAGE)[1][1][0])).toBe(false);
  });
});

describe('Export/Import', () => {
  beforeEach(() => localStorage.clear());

  test('round-trips what the learner has reached', () => {
    const p = pastMovingData();
    const before = unlockedSections(p);
    const text = buildExport({ 'recall-progress': serializeProgress(p, emptyOrphans()) });
    const check = validateExport(text);
    if (!check.ok) throw new Error(check.error);
    expect(applyImport(localStorage, check.file)).toEqual({ ok: true });
    expect(EXPORT_KEYS).toContain('recall-progress');

    const load = loadProgressFrom(localStorage, knownIds, noSeed);
    if (load.status !== 'ok') throw new Error(load.status);
    expect(unlockedSections(load.progress)).toEqual(before);
  });

  test('an older export with no mastered set still imports, and its answers keep reached sections open', () => {
    const p = pastMovingData();
    const stored = JSON.parse(serializeProgress(p, emptyOrphans()));
    delete stored.masteredTopics;
    const check = validateExport(buildExport({ 'recall-progress': JSON.stringify(stored) }));
    if (!check.ok) throw new Error(check.error);
    expect(applyImport(localStorage, check.file)).toEqual({ ok: true });

    const load = loadProgressFrom(localStorage, knownIds, noSeed);
    if (load.status !== 'ok') throw new Error(load.status);
    expect(load.progress.masteredTopics.size).toBe(0);
    expect(unlockedSections(load.progress)).toEqual(['Foundations', STORAGE, ARCHITECTURE, MOVING, MODELING]);
  });
});
