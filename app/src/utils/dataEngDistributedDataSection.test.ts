/**
 * Wiring gate for Data Engineering "Distributed Data", the sixth section of
 * the decisions-and-designs rewrite: where it sits on the path, that each topic
 * has a lesson and a full ramp of the new card types, and that the old topics
 * and questions it absorbed (the whole old Distributed Systems & Storage
 * section) are gone from the bank without breaking stored progress.
 *
 * Run: npm test -- --testPathPattern=dataEngDistributedData --watchAll=false
 */
import { Course, Difficulty, QuestionAttempt, QuestionType, Topic, UserProgress } from '../types';
import { DATA_ENG_PATH_ORDER, DATA_ENG_SECTIONS, getCourseForTopic, getTopicKeysForSection } from './courseConfig';
import { SpacedRepetitionSystem, isReviewOnly, topicRamp } from './spacedRepetition';
import { emptyOrphans, parseStoredProgress, serializeProgress } from './progressStorage';
import { questions as allQuestions } from '../data/questions';
import { dataEngineeringDistributedQuestions as section } from '../data/dataEngineeringDistributedQuestions';
import { DISTRIBUTED_OUTCOME_CHECKS } from '../data/dataEngineeringDistributedChecks';
import { LESSONS } from '../data/lessons';

const SECTION = 'Distributed Data';
const OLD_SECTION = 'Distributed Systems & Storage';
const NEXT_SECTION = 'Operations, Quality & Modern DE';
const TOPICS: Topic[] = [
  Topic.DE_PARTITION_SKEW,
  Topic.DE_REPLICATION_CONSISTENCY,
  Topic.DE_STORAGE_ENGINES,
];
const RETIRED_TOPICS = [
  'de_why_distribute', 'de_partitioning', 'de_replication', 'de_lsm_vs_btree', 'de_compaction_bloom',
];
const RETIRED_IDS = ['dist', 'part', 'repl', 'lsm', 'comp']
  .flatMap(prefix => Array.from({ length: 9 }, (_, i) => `de-${prefix}-${i + 1}`));

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

const dePool = allQuestions.filter(q => getCourseForTopic(q.topic) === Course.DATA_ENGINEERING);

describe('section wiring', () => {
  it('is Step 7, in the old section\'s place after Streaming and before Operations', () => {
    expect(DATA_ENG_PATH_ORDER.indexOf(SECTION)).toBe(6);
    expect(DATA_ENG_PATH_ORDER[5]).toBe('Streaming');
    expect(DATA_ENG_PATH_ORDER[7]).toBe(NEXT_SECTION);
    expect(DATA_ENG_SECTIONS[SECTION].weight).toBe('Step 7');
    expect(DATA_ENG_PATH_ORDER).not.toContain(OLD_SECTION);
    expect(DATA_ENG_SECTIONS[OLD_SECTION]).toBeUndefined();
  });

  it('numbers every section by its place on the path', () => {
    DATA_ENG_PATH_ORDER.forEach((name, i) => expect(DATA_ENG_SECTIONS[name].weight).toBe(`Step ${i + 1}`));
  });

  it('declares the three topics as one unit each, in teaching order', () => {
    expect(getTopicKeysForSection(SECTION)).toEqual(TOPICS);
    TOPICS.forEach(t => expect(getCourseForTopic(t)).toBe(Course.DATA_ENGINEERING));
  });

  it('reaches the exported question bank, every card tagged with the course', () => {
    const wired = allQuestions.filter(q => TOPICS.includes(q.topic as Topic));
    expect(wired.map(q => q.id)).toEqual(section.map(q => q.id));
    expect(section.filter(q => q.course !== Course.DATA_ENGINEERING).map(q => q.id)).toEqual([]);
    expect(section.filter(q => !TOPICS.includes(q.topic as Topic)).map(q => q.id)).toEqual([]);
  });

  it('unlocks for a learner who has mastered the six steps before it, and holds back the step after it', () => {
    const progress = emptyProgress();
    progress.masteredTopics = new Set(DATA_ENG_PATH_ORDER.slice(0, 6).flatMap(getTopicKeysForSection));
    const unlocked = SpacedRepetitionSystem.getUnlockedSections(dePool, progress);
    expect(unlocked!.sections).toContain(SECTION);
    expect(unlocked!.sections).not.toContain(NEXT_SECTION);
    expect(SpacedRepetitionSystem.getUnlockedTopics(dePool, progress)).toContain(TOPICS[0]);
  });

  it('leaves the not-yet-rewritten Operations section in place', () => {
    expect(getTopicKeysForSection(NEXT_SECTION)).toContain(Topic.DE_WHAT_IS_ORCHESTRATION);
    expect(dePool.some(q => q.topic === Topic.DE_WHAT_IS_ORCHESTRATION)).toBe(true);
  });
});

describe('each topic', () => {
  const byTopic = (t: Topic) => section.filter(q => q.topic === t);

  it.each(TOPICS)('%s has a lesson whose exercises are its own cards', t => {
    const lesson = LESSONS.find(l => l.topicKeys.includes(t));
    expect(lesson).toBeDefined();
    lesson!.exercises.forEach(id => expect(byTopic(t).map(q => q.id)).toContain(id));
  });

  it.each(TOPICS)('%s ramps beginner to advanced through every decision-and-design type', t => {
    const cards = byTopic(t);
    expect(new Set(cards.map(q => q.difficulty))).toEqual(new Set([Difficulty.BEGINNER, Difficulty.INTERMEDIATE, Difficulty.ADVANCED]));
    const types = new Set(cards.map(q => q.type));
    [QuestionType.MULTIPLE_CHOICE, QuestionType.PREDICT_OUTCOME, QuestionType.CHOOSE_JUSTIFY,
      QuestionType.PARSONS, QuestionType.SPOT_FLAW, QuestionType.EXPLAIN].forEach(type => expect(types).toContain(type));
  });

  it.each(TOPICS)('%s has one term-check MCQ, and it is a beginner card', t => {
    const mcqs = byTopic(t).filter(q => q.type === QuestionType.MULTIPLE_CHOICE);
    expect(mcqs.map(q => q.difficulty)).toEqual([Difficulty.BEGINNER]);
  });

  it.each(TOPICS)('%s keeps its explain cards out of the ramp', t => {
    const ramp = topicRamp(byTopic(t));
    expect(ramp.length).toBeGreaterThanOrEqual(6);
    expect(ramp.filter(isReviewOnly)).toEqual([]);
  });

  it('checks every predict-the-outcome answer by running it (scripts/check-outcomes.js)', () => {
    const predicts = section.filter(q => q.type === QuestionType.PREDICT_OUTCOME).map(q => q.id);
    predicts.forEach(id => expect(Object.keys(DISTRIBUTED_OUTCOME_CHECKS)).toContain(id));
  });
});

describe('the old topics it absorbed', () => {
  it('never reuses a retired id', () => {
    expect(section.filter(q => RETIRED_IDS.includes(q.id)).map(q => q.id)).toEqual([]);
  });

  it('are gone from the bank and from every section, but still map to the course', () => {
    const ids = new Set(allQuestions.map(q => q.id));
    expect(RETIRED_IDS.filter(id => ids.has(id))).toEqual([]);
    expect(allQuestions.filter(q => RETIRED_TOPICS.includes(q.topic)).map(q => q.id)).toEqual([]);
    const sectioned = DATA_ENG_PATH_ORDER.flatMap(getTopicKeysForSection);
    RETIRED_TOPICS.forEach(t => {
      expect(sectioned).not.toContain(t);
      expect(getCourseForTopic(t)).toBe(Course.DATA_ENGINEERING);
    });
  });

  it('leave stored progress for their ids loadable, set aside and written back unchanged', () => {
    const known = new Set(allQuestions.map(q => q.id));
    const stored = {
      questionsAttempted: ['de-part-5', 'de-repl-7', 'de-comp-8', 'de-whatis-1'],
      correctAnswers: ['de-part-5', 'de-whatis-1'],
      attemptHistory: [
        { questionId: 'de-part-5', timestamp: 1_790_000_000_000, isCorrect: true, attempts: 1, timeSpent: 8000 },
        { questionId: 'de-repl-7', timestamp: 1_790_000_100_000, isCorrect: false, attempts: 1, timeSpent: 8000 },
        { questionId: 'de-comp-8', timestamp: 1_790_000_150_000, isCorrect: true, attempts: 1, timeSpent: 8000 },
        { questionId: 'de-whatis-1', timestamp: 1_790_000_200_000, isCorrect: true, attempts: 1, timeSpent: 8000 },
      ],
      topicScores: { de_partitioning: { correct: 1, total: 1 }, de_replication: { correct: 0, total: 1 } },
      difficultyScores: {},
      lastAttempt: { 'de-part-5': 1_790_000_000_000 },
      repetitionQueue: {},
      masteredTopics: ['de_what_is', 'de_partitioning'],
    };
    const { progress, orphans } = parseStoredProgress(JSON.stringify(stored), known, () => new Set());
    expect(Array.from(progress.questionsAttempted)).toEqual(['de-whatis-1']);
    expect(orphans.questionsAttempted).toEqual(['de-part-5', 'de-repl-7', 'de-comp-8']);

    const written = JSON.parse(serializeProgress(progress, orphans));
    expect(written.attemptHistory.map((a: { questionId: string }) => a.questionId)).toEqual(['de-part-5', 'de-repl-7', 'de-comp-8', 'de-whatis-1']);
    expect(written.questionsAttempted.sort()).toEqual(stored.questionsAttempted.sort());
    expect(written.masteredTopics).toEqual(stored.masteredTopics);

    // A stale mastered key changes nothing about where the learner is: the
    // mastered de_what_is (all of Foundations) opens the step after it, no more.
    expect(Array.from(SpacedRepetitionSystem.getUnlockedSections(dePool, progress)!.sections)).toEqual(DATA_ENG_PATH_ORDER.slice(0, 2));
    expect(serializeProgress(progress, emptyOrphans())).not.toContain('de-repl-7');
  });
});

describe('a learner who was working through the old Distributed Systems & Storage', () => {
  /** Every step up to Streaming mastered, the old Distributed topics mastered too. */
  function midDistributed(): UserProgress {
    const p = emptyProgress();
    p.masteredTopics = new Set([...DATA_ENG_PATH_ORDER.slice(0, 6).flatMap(getTopicKeysForSection), ...RETIRED_TOPICS]);
    return p;
  }

  function answer(p: UserProgress, id: string) {
    const a: QuestionAttempt = { questionId: id, isCorrect: true, timestamp: 1_790_000_000_000, attempts: 1, timeSpent: 5000 };
    p.questionsAttempted.add(id);
    p.correctAnswers.add(id);
    p.attemptHistory.push(a);
  }

  it('finds Distributed Data open, starting at its first topic', () => {
    const p = midDistributed();
    expect(SpacedRepetitionSystem.getUnlockedSections(dePool, p)!.sections).toContain(SECTION);
    const topics = SpacedRepetitionSystem.getUnlockedTopics(dePool, p)!;
    expect(topics.has(TOPICS[0])).toBe(true);
    expect(topics.has(TOPICS[1])).toBe(false);
  });

  it('keeps Operations, Quality & Modern DE open if it had already reached it', () => {
    const p = midDistributed();
    answer(p, dePool.find(q => getTopicKeysForSection(NEXT_SECTION).includes(q.topic))!.id);
    const sections = SpacedRepetitionSystem.getUnlockedSections(dePool, p)!.sections;
    expect(sections).toContain(SECTION);
    expect(sections).toContain(NEXT_SECTION);
  });
});
