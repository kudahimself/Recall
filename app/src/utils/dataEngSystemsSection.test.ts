/**
 * Wiring gate for Data Engineering Section 7, "Machines, Memory & Disks".
 *
 * The section teaches the hardware/OS layer the rest of the course assumes, but
 * it was appended LAST rather than inserted at its pedagogically natural early
 * position. That is deliberate: getUnlockedSections walks DATA_ENG_PATH_ORDER
 * and `break`s at the first unmastered section, so inserting a new section at
 * position 2 would hard-lock steps 3-6 for a learner already past them. The
 * test that matters is therefore the one asserting existing progress is
 * untouched - the rest guard the four-file wiring against a partial edit.
 *
 * Run: npm test -- --testPathPattern=dataEngSystems --watchAll=false
 */
import { Course, Difficulty, Question, QuestionType, Topic, UserProgress } from '../types';
import {
  DATA_ENG_PATH_ORDER,
  DATA_ENG_SECTIONS,
  getCourseForTopic,
  getSelectionPolicy,
  getTopicOrder,
} from './courseConfig';
import { SpacedRepetitionSystem } from './spacedRepetition';
import { dataEngineeringSystemsQuestions } from '../data/dataEngineeringSystemsQuestions';
import { questions as allQuestions } from '../data/questions';

const SECTION = 'Machines, Memory & Disks';
const TOPICS: Topic[] = [
  Topic.DE_MEMORY_HIERARCHY,
  Topic.DE_RAM_VS_DISK,
  Topic.DE_SEQUENTIAL_VS_RANDOM_IO,
  Topic.DE_PAGE_CACHE,
  Topic.DE_VIRTUAL_MEMORY,
  Topic.DE_CPU_CACHE_LOCALITY,
  Topic.DE_SSD_VS_HDD,
  Topic.DE_SPILL_TO_DISK,
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
  it('is registered as the LAST step of the DE path', () => {
    expect(DATA_ENG_PATH_ORDER[DATA_ENG_PATH_ORDER.length - 1]).toBe(SECTION);
    expect(DATA_ENG_SECTIONS[SECTION].weight).toBe('Step 7');
  });

  it('maps all 8 topics to the Data Engineering course', () => {
    TOPICS.forEach(t => expect(getCourseForTopic(t)).toBe(Course.DATA_ENGINEERING));
  });

  it('places all 8 topics in the course topic order', () => {
    const order = getTopicOrder(Course.DATA_ENGINEERING);
    TOPICS.forEach(t => expect(order).toContain(t));
  });

  it('declares each topic as its own unit inside the section', () => {
    const declared = Object.values(DATA_ENG_SECTIONS[SECTION].topics).flat();
    expect(declared.sort()).toEqual([...TOPICS].sort());
  });

  it('reaches the exported question bank (the import/spread step)', () => {
    const wired = allQuestions.filter(q => TOPICS.includes(q.topic as Topic));
    expect(wired).toHaveLength(dataEngineeringSystemsQuestions.length);
  });
});

describe('question bank shape', () => {
  const byTopic = (t: Topic) => dataEngineeringSystemsQuestions.filter(q => q.topic === t);

  it('gives every topic a BEGINNER through ADVANCED ramp', () => {
    TOPICS.forEach(t => {
      const levels = new Set(byTopic(t).map(q => q.difficulty));
      expect(levels).toContain(Difficulty.BEGINNER);
      expect(levels).toContain(Difficulty.INTERMEDIATE);
      expect(levels).toContain(Difficulty.ADVANCED);
    });
  });

  it('carries no CODING questions - this is a knowledge section', () => {
    const coding = dataEngineeringSystemsQuestions.filter(q => q.type === QuestionType.CODING);
    expect(coding).toEqual([]);
  });

  it('carries no concept tags, since DE runs with useConceptSRS off', () => {
    expect(getSelectionPolicy(Course.DATA_ENGINEERING).useConceptSRS).toBe(false);
    const tagged = dataEngineeringSystemsQuestions.filter(q => q.concepts?.length);
    expect(tagged.map(q => q.id)).toEqual([]);
  });

  it('tags every question with the Data Engineering course', () => {
    const strays = dataEngineeringSystemsQuestions.filter(q => q.course !== Course.DATA_ENGINEERING);
    expect(strays.map(q => q.id)).toEqual([]);
  });

  it('uses ids unique across the whole app', () => {
    const counts = new Map<string, number>();
    allQuestions.forEach(q => counts.set(q.id, (counts.get(q.id) ?? 0) + 1));
    const dupes = dataEngineeringSystemsQuestions
      .filter(q => (counts.get(q.id) ?? 0) > 1)
      .map(q => q.id);
    expect(dupes).toEqual([]);
  });

  it('gives every multiple-choice question exactly one correct option', () => {
    const bad = dataEngineeringSystemsQuestions
      .filter(q => q.type === QuestionType.MULTIPLE_CHOICE)
      .filter(q => {
        const opts = (q as { options?: { isCorrect: boolean }[] }).options ?? [];
        return opts.length !== 4 || opts.filter(o => o.isCorrect).length !== 1;
      });
    expect(bad.map(q => q.id)).toEqual([]);
  });
});

describe('placement leaves existing progress alone', () => {
  const dePool = allQuestions.filter(q => getCourseForTopic(q.topic) === Course.DATA_ENGINEERING);

  // Every section EXCEPT the new one mastered - i.e. the learner who has already
  // worked through the course. Appending must not retract any of that.
  function masteredThrough(count: number): UserProgress {
    const progress = emptyProgress();
    const mastered = DATA_ENG_PATH_ORDER.slice(0, count)
      .flatMap(name => Object.values(DATA_ENG_SECTIONS[name].topics).flat());
    progress.masteredTopics = new Set(mastered);
    return progress;
  }

  it('keeps steps 1-6 unlocked for a learner who had finished step 6', () => {
    const unlocked = SpacedRepetitionSystem.getUnlockedSections(dePool, masteredThrough(6));
    expect(unlocked).not.toBeNull();
    DATA_ENG_PATH_ORDER.forEach(name => expect(unlocked!.sections).toContain(name));
  });

  it('unlocks the new section only once step 6 is mastered', () => {
    const before = SpacedRepetitionSystem.getUnlockedSections(dePool, masteredThrough(5));
    expect(before!.sections).toContain('Operations, Quality & Modern DE');
    expect(before!.sections).not.toContain(SECTION);
  });

  it('does not disturb the first section for a brand-new learner', () => {
    const unlocked = SpacedRepetitionSystem.getUnlockedSections(dePool, emptyProgress());
    expect(Array.from(unlocked!.sections)).toEqual([DATA_ENG_PATH_ORDER[0]]);
  });

  // The `break` in getUnlockedSections is what makes append-only mandatory. If a
  // future edit inserts a section mid-path, this fails loudly.
  it('keeps the new section out of every earlier position in the path', () => {
    expect(DATA_ENG_PATH_ORDER.indexOf(SECTION)).toBe(DATA_ENG_PATH_ORDER.length - 1);
  });
});

// PREDICT_OUTPUT questions here state a cost model in code and ask for a count
// derived from it. The point is that the count is exactly derivable, so the
// expected output is pinned rather than left to a reviewer's arithmetic.
describe('predict-output arithmetic', () => {
  const predicts = dataEngineeringSystemsQuestions.filter(
    q => q.type === QuestionType.PREDICT_OUTPUT,
  ) as (Question & { expectedOutput: string })[];

  const expected: Record<string, string> = {
    // 1 + 100 + 100_000 nanoseconds, versus three L1 hits.
    'de-memhier-9': '100101\n3',
    // 1000 records of 100 bytes: 25 pages packed, 1000 pages scattered.
    'de-seqrand-6': '25\n1000',
    // 1M int32s: 62_500 cache lines columnar, 625_000 at a 40-byte stride.
    'de-cpucache-6': '62500\n625000',
    // 480 MB fits the 512 MB budget; 9 GB needs 18 runs, over the fan-in of 8.
    'de-spill-6': '1 18\nFalse True',
  };

  it('covers each predict question with a checked expected output', () => {
    expect(predicts.map(q => q.id).sort()).toEqual(Object.keys(expected).sort());
  });

  predicts.forEach(q => {
    it(`${q.id} states the derivable output`, () => {
      expect(q.expectedOutput).toBe(expected[q.id]);
    });
  });
});
