/**
 * Wiring gate for Data Engineering "Warehouses, Lakes & Table Formats", the
 * third section of the decisions-and-designs rewrite: where it sits on the
 * path, that each topic has a lesson and a full ramp of the new card types, and
 * that the old topics and questions it absorbed are gone from the bank without
 * breaking stored progress.
 *
 * Run: npm test -- --testPathPattern=dataEngWarehousesLakes --watchAll=false
 */
import { Course, Difficulty, QuestionType, Topic, UserProgress } from '../types';
import { DATA_ENG_PATH_ORDER, DATA_ENG_SECTIONS, getCourseForTopic, getTopicKeysForSection } from './courseConfig';
import { SpacedRepetitionSystem, isReviewOnly, topicRamp } from './spacedRepetition';
import { emptyOrphans, parseStoredProgress, serializeProgress } from './progressStorage';
import { questions as allQuestions } from '../data/questions';
import { dataEngineeringWarehousesLakesQuestions as section } from '../data/dataEngineeringWarehousesLakesQuestions';
import { WAREHOUSES_LAKES_OUTCOME_CHECKS } from '../data/dataEngineeringWarehousesLakesChecks';
import { LESSONS } from '../data/lessons';

const SECTION = 'Warehouses, Lakes & Table Formats';
const TOPICS: Topic[] = [
  Topic.DE_WORKLOADS_SYSTEMS,
  Topic.DE_TABLE_FORMAT_LOG,
  Topic.DE_UPDATING_FILES,
  Topic.DE_SCHEMA_EVOLUTION,
];
const RETIRED_TOPICS = ['de_oltp_vs_olap', 'de_data_lake_warehouse', 'de_lakehouse', 'de_table_formats_intro', 'de_iceberg_delta_hudi'];
const RETIRED_IDS = [
  ...Array.from({ length: 11 }, (_, i) => `de-oltpolap-${i + 1}`),
  ...Array.from({ length: 11 }, (_, i) => `de-lakewh-${i + 1}`),
  ...Array.from({ length: 10 }, (_, i) => `de-lake-${i + 1}`),
  ...Array.from({ length: 10 }, (_, i) => `de-tfmt-${i + 1}`),
  ...Array.from({ length: 10 }, (_, i) => `de-idh-${i + 1}`),
  // Schema drift, from Data Quality Basics, which stays for the rest of its questions.
  'de-dq-8',
];

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

describe('section wiring', () => {
  it('is Step 3, after Storage & Files and before Moving Data', () => {
    expect(DATA_ENG_PATH_ORDER.indexOf(SECTION)).toBe(2);
    expect(DATA_ENG_PATH_ORDER[1]).toBe('Storage & Files');
    expect(DATA_ENG_PATH_ORDER[3]).toBe('Moving Data');
    expect(DATA_ENG_SECTIONS[SECTION].weight).toBe('Step 3');
  });

  it('numbers every section by its place on the path', () => {
    DATA_ENG_PATH_ORDER.forEach((name, i) => expect(DATA_ENG_SECTIONS[name].weight).toBe(`Step ${i + 1}`));
  });

  it('declares the four topics as one unit each, in teaching order', () => {
    expect(getTopicKeysForSection(SECTION)).toEqual(TOPICS);
    TOPICS.forEach(t => expect(getCourseForTopic(t)).toBe(Course.DATA_ENGINEERING));
  });

  it('reaches the exported question bank, every card tagged with the course', () => {
    const wired = allQuestions.filter(q => TOPICS.includes(q.topic as Topic));
    expect(wired.map(q => q.id)).toEqual(section.map(q => q.id));
    expect(section.filter(q => q.course !== Course.DATA_ENGINEERING).map(q => q.id)).toEqual([]);
  });

  it('unlocks for a learner who has mastered the two steps before it, and holds back the step after it', () => {
    const progress = emptyProgress();
    progress.masteredTopics = new Set(DATA_ENG_PATH_ORDER.slice(0, 2).flatMap(getTopicKeysForSection));
    const dePool = allQuestions.filter(q => getCourseForTopic(q.topic) === Course.DATA_ENGINEERING);
    const unlocked = SpacedRepetitionSystem.getUnlockedSections(dePool, progress);
    expect(unlocked!.sections).toContain(SECTION);
    expect(unlocked!.sections).not.toContain('Moving Data');
    expect(SpacedRepetitionSystem.getUnlockedTopics(dePool, progress)).toContain(TOPICS[0]);
  });

  it('keeps the Foundations topic no rewritten section absorbed', () => {
    expect(getTopicKeysForSection('Foundations')).toEqual([Topic.DE_WHAT_IS]);
    expect(allQuestions.filter(q => q.topic === Topic.DE_DATA_QUALITY_BASICS).length).toBeGreaterThan(0);
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
    predicts.forEach(id => expect(Object.keys(WAREHOUSES_LAKES_OUTCOME_CHECKS)).toContain(id));
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
      questionsAttempted: ['de-lakewh-3', 'de-tfmt-9', 'de-dq-8', 'de-whatis-1'],
      correctAnswers: ['de-lakewh-3', 'de-whatis-1'],
      attemptHistory: [
        { questionId: 'de-lakewh-3', timestamp: 1_790_000_000_000, isCorrect: true, attempts: 1, timeSpent: 8000 },
        { questionId: 'de-tfmt-9', timestamp: 1_790_000_100_000, isCorrect: false, attempts: 1, timeSpent: 8000 },
        { questionId: 'de-dq-8', timestamp: 1_790_000_150_000, isCorrect: true, attempts: 1, timeSpent: 8000 },
        { questionId: 'de-whatis-1', timestamp: 1_790_000_200_000, isCorrect: true, attempts: 1, timeSpent: 8000 },
      ],
      topicScores: { de_data_lake_warehouse: { correct: 1, total: 1 }, de_table_formats_intro: { correct: 0, total: 1 } },
      difficultyScores: {},
      lastAttempt: { 'de-lakewh-3': 1_790_000_000_000 },
      repetitionQueue: {},
      masteredTopics: ['de_what_is', 'de_data_lake_warehouse'],
    };
    const { progress, orphans } = parseStoredProgress(JSON.stringify(stored), known, () => new Set());
    expect(Array.from(progress.questionsAttempted)).toEqual(['de-whatis-1']);
    expect(orphans.questionsAttempted).toEqual(['de-lakewh-3', 'de-tfmt-9', 'de-dq-8']);

    const written = JSON.parse(serializeProgress(progress, orphans));
    expect(written.attemptHistory.map((a: { questionId: string }) => a.questionId)).toEqual(['de-lakewh-3', 'de-tfmt-9', 'de-dq-8', 'de-whatis-1']);
    expect(written.questionsAttempted.sort()).toEqual(stored.questionsAttempted.sort());
    expect(written.masteredTopics).toEqual(stored.masteredTopics);

    // A stale mastered key changes nothing about where the learner is: the
    // mastered de_what_is (all of Foundations) opens the step after it, no more.
    const dePool = allQuestions.filter(q => getCourseForTopic(q.topic) === Course.DATA_ENGINEERING);
    expect(Array.from(SpacedRepetitionSystem.getUnlockedSections(dePool, progress)!.sections)).toEqual(DATA_ENG_PATH_ORDER.slice(0, 2));
    expect(serializeProgress(progress, emptyOrphans())).not.toContain('de-tfmt-9');
  });
});
