/**
 * Wiring gate for Data Engineering "Storage & Files", the second section of the
 * decisions-and-designs rewrite: where it sits on the path, that each topic has
 * a lesson and a full ramp of the new card types, and that the old topics it
 * absorbed are gone from the bank without breaking stored progress.
 *
 * Run: npm test -- --testPathPattern=dataEngStorageFiles --watchAll=false
 */
import { Course, Difficulty, QuestionType, Topic, UserProgress } from '../types';
import { DATA_ENG_PATH_ORDER, DATA_ENG_SECTIONS, getCourseForTopic, getTopicKeysForSection } from './courseConfig';
import { SpacedRepetitionSystem, isReviewOnly, topicRamp } from './spacedRepetition';
import { emptyOrphans, parseStoredProgress, serializeProgress } from './progressStorage';
import { questions as allQuestions } from '../data/questions';
import { dataEngineeringStorageFilesQuestions as storageFiles } from '../data/dataEngineeringStorageFilesQuestions';
import { STORAGE_FILES_OUTCOME_CHECKS } from '../data/dataEngineeringStorageFilesChecks';
import { LESSONS } from '../data/lessons';

const SECTION = 'Storage & Files';
const TOPICS: Topic[] = [
  Topic.DE_ROW_VS_COLUMN_LAYOUT,
  Topic.DE_FILE_FORMATS,
  Topic.DE_DATA_SKIPPING,
  Topic.DE_SMALL_FILES,
];
const RETIRED_TOPICS = ['de_rows_vs_columns', 'de_what_is_a_file_format', 'de_parquet_basics', 'de_object_storage'];
const RETIRED_IDS = [
  ...Array.from({ length: 11 }, (_, i) => `de-rowcol-${i + 1}`),
  ...Array.from({ length: 11 }, (_, i) => `de-fileformat-${i + 1}`),
  ...Array.from({ length: 11 }, (_, i) => `de-parquet-${i + 1}`),
  ...Array.from({ length: 11 }, (_, i) => `de-objstore-${i + 1}`),
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
  it('is Step 2, after Foundations and before Architecture & Open Table Formats', () => {
    expect(DATA_ENG_PATH_ORDER.indexOf(SECTION)).toBe(1);
    expect(DATA_ENG_PATH_ORDER[0]).toBe('Foundations');
    expect(DATA_ENG_PATH_ORDER[2]).toBe('Architecture & Open Table Formats');
    expect(DATA_ENG_SECTIONS[SECTION].weight).toBe('Step 2');
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
    expect(wired.map(q => q.id)).toEqual(storageFiles.map(q => q.id));
    expect(storageFiles.filter(q => q.course !== Course.DATA_ENGINEERING).map(q => q.id)).toEqual([]);
  });

  it('unlocks for a learner who has mastered Foundations, and holds back the step after it', () => {
    const progress = emptyProgress();
    progress.masteredTopics = new Set(getTopicKeysForSection(DATA_ENG_PATH_ORDER[0]));
    const dePool = allQuestions.filter(q => getCourseForTopic(q.topic) === Course.DATA_ENGINEERING);
    const unlocked = SpacedRepetitionSystem.getUnlockedSections(dePool, progress);
    expect(unlocked!.sections).toContain(SECTION);
    expect(unlocked!.sections).not.toContain('Architecture & Open Table Formats');
    expect(SpacedRepetitionSystem.getUnlockedTopics(dePool, progress)).toContain(TOPICS[0]);
  });

  it('keeps the Foundations topics it did not absorb', () => {
    expect(getTopicKeysForSection('Foundations')).toEqual([
      Topic.DE_WHAT_IS, Topic.DE_BATCH_VS_STREAMING, Topic.DE_OLTP_VS_OLAP, Topic.DE_DATA_LAKE_WAREHOUSE,
    ]);
  });
});

describe('each topic', () => {
  const byTopic = (t: Topic) => storageFiles.filter(q => q.topic === t);

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
    const predicts = storageFiles.filter(q => q.type === QuestionType.PREDICT_OUTCOME).map(q => q.id);
    predicts.forEach(id => expect(Object.keys(STORAGE_FILES_OUTCOME_CHECKS)).toContain(id));
  });
});

describe('the old topics it absorbed', () => {
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
      questionsAttempted: ['de-rowcol-3', 'de-parquet-9', 'de-whatis-1'],
      correctAnswers: ['de-rowcol-3', 'de-whatis-1'],
      attemptHistory: [
        { questionId: 'de-rowcol-3', timestamp: 1_790_000_000_000, isCorrect: true, attempts: 1, timeSpent: 8000 },
        { questionId: 'de-parquet-9', timestamp: 1_790_000_100_000, isCorrect: false, attempts: 1, timeSpent: 8000 },
        { questionId: 'de-whatis-1', timestamp: 1_790_000_200_000, isCorrect: true, attempts: 1, timeSpent: 8000 },
      ],
      topicScores: { de_rows_vs_columns: { correct: 1, total: 1 }, de_parquet_basics: { correct: 0, total: 1 } },
      difficultyScores: {},
      lastAttempt: { 'de-rowcol-3': 1_790_000_000_000 },
      repetitionQueue: {},
      masteredTopics: ['de_what_is', 'de_rows_vs_columns'],
    };
    const { progress, orphans } = parseStoredProgress(JSON.stringify(stored), known, () => new Set());
    expect(Array.from(progress.questionsAttempted)).toEqual(['de-whatis-1']);
    expect(orphans.questionsAttempted).toEqual(['de-rowcol-3', 'de-parquet-9']);

    const written = JSON.parse(serializeProgress(progress, orphans));
    expect(written.attemptHistory.map((a: { questionId: string }) => a.questionId)).toEqual(['de-rowcol-3', 'de-parquet-9', 'de-whatis-1']);
    expect(written.questionsAttempted.sort()).toEqual(stored.questionsAttempted.sort());
    expect(written.masteredTopics).toEqual(stored.masteredTopics);

    // A stale mastered key changes nothing about where the learner is.
    const dePool = allQuestions.filter(q => getCourseForTopic(q.topic) === Course.DATA_ENGINEERING);
    expect(Array.from(SpacedRepetitionSystem.getUnlockedSections(dePool, progress)!.sections)).toEqual([DATA_ENG_PATH_ORDER[0]]);
    expect(serializeProgress(progress, emptyOrphans())).not.toContain('de-parquet-9');
  });
});
