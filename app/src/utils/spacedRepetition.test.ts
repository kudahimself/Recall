/**
 * Diagnostic test: simulates a realistic backend-course user state and
 * observes what `selectNextQuestion` actually picks, and why.
 *
 * Scenario matches the user's report:
 *   - py_basics (Variables, Types & Strings): 53/53 seen, 3 struggled
 *   - py_data_structures: ~30% seen
 *   - all later Python Fundamentals topics: unseen
 *
 * Run:  npm test -- --testPathPattern=spacedRepetition
 *
 * Output is printed via console.log — these aren't assertion-heavy tests,
 * they're a lens into the algorithm.
 */
import { questions as allQuestions } from '../data/questions';
import { Course, QuestionAttempt, UserProgress } from '../types';
import { getCourseForTopic } from './courseConfig';
import { SpacedRepetitionSystem } from './spacedRepetition';

const backendQuestions = allQuestions.filter(
  q => getCourseForTopic(q.topic) === Course.BACKEND,
);

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

function attempt(questionId: string, isCorrect: boolean, msAgo: number): QuestionAttempt {
  return {
    questionId,
    isCorrect,
    timestamp: Date.now() - msAgo,
    attempts: 1,
    timeSpent: 10_000,
  };
}

/**
 * Build the scenario:
 * - every py_basics question seen at least once; 3 of them have 3 failures + 1 eventual correct
 * - py_data_structures: first ~30% seen, answered correctly on first try
 * - all later topics: untouched
 */
function buildScenario() {
  const progress = emptyProgress();
  const byTopic = new Map<string, string[]>();
  for (const q of backendQuestions) {
    const arr = byTopic.get(q.topic) ?? [];
    arr.push(q.id);
    byTopic.set(q.topic, arr);
  }

  const basicsIds = byTopic.get('py_basics') ?? [];
  const dsIds = byTopic.get('py_data_structures') ?? [];

  // Every py_basics question: one correct attempt, mostly 2 days ago
  basicsIds.forEach((id, idx) => {
    progress.questionsAttempted.add(id);
    progress.correctAnswers.add(id);
    progress.attemptHistory.push(attempt(id, true, (2 * 86_400_000) + idx * 1000));
  });

  // 3 "struggled" py_basics questions: add 3 wrong + 1 correct, all within last day
  const struggledIds = basicsIds.slice(0, 3);
  struggledIds.forEach(id => {
    progress.attemptHistory.push(attempt(id, false, 6 * 3_600_000));   // 6h ago
    progress.attemptHistory.push(attempt(id, false, 4 * 3_600_000));
    progress.attemptHistory.push(attempt(id, false, 2 * 3_600_000));
    progress.attemptHistory.push(attempt(id, true,  1 * 3_600_000));
  });

  // First 30% of py_data_structures: seen + correct on first try
  const seenDs = dsIds.slice(0, Math.floor(dsIds.length * 0.3));
  seenDs.forEach((id, idx) => {
    progress.questionsAttempted.add(id);
    progress.correctAnswers.add(id);
    progress.attemptHistory.push(attempt(id, true, 2 * 3_600_000 + idx * 500));
  });

  progress.attemptHistory.sort((a, b) => a.timestamp - b.timestamp);
  return { progress, basicsIds, dsIds, struggledIds };
}

function topicOf(id: string): string {
  return backendQuestions.find(q => q.id === id)?.topic ?? '?';
}

describe('question selection — diagnostic', () => {
  test('topic distribution over 1000 picks', () => {
    const { progress, struggledIds } = buildScenario();
    const unlocked = SpacedRepetitionSystem.getUnlockedTopics(backendQuestions, progress);
    console.log('\n=== Unlocked topics ===');
    console.log(Array.from(unlocked ?? []).sort().join(', '));

    const counts = new Map<string, number>();
    const perQuestion = new Map<string, number>();
    for (let i = 0; i < 1000; i++) {
      const q = SpacedRepetitionSystem.selectNextQuestion(backendQuestions, progress);
      if (!q) continue;
      counts.set(q.topic, (counts.get(q.topic) ?? 0) + 1);
      perQuestion.set(q.id, (perQuestion.get(q.id) ?? 0) + 1);
    }

    console.log('\n=== Topic distribution (of 1000 picks) ===');
    Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .forEach(([topic, n]) => console.log(`  ${topic.padEnd(30)} ${n}`));

    console.log('\n=== Top 10 most-picked individual questions ===');
    Array.from(perQuestion.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .forEach(([id, n]) => {
        const struggled = struggledIds.includes(id) ? '  ← STRUGGLED' : '';
        console.log(`  ${topicOf(id).padEnd(24)} ${id.padEnd(24)} ${n}${struggled}`);
      });
  });

  test('priority scores of current review pool', () => {
    const { progress, struggledIds } = buildScenario();
    const unlocked = SpacedRepetitionSystem.getUnlockedTopics(backendQuestions, progress)!;
    const pool = backendQuestions
      .filter(q => unlocked.has(q.topic))
      .filter(q => progress.questionsAttempted.has(q.id));

    const scored = pool
      .map(q => ({
        id: q.id,
        topic: q.topic,
        priority: SpacedRepetitionSystem.calculatePriority(q.id, progress, q),
        struggled: struggledIds.includes(q.id),
      }))
      .sort((a, b) => b.priority - a.priority);

    console.log('\n=== Top 15 review priorities ===');
    scored.slice(0, 15).forEach(s =>
      console.log(
        `  ${s.topic.padEnd(24)} ${s.id.padEnd(24)} priority=${s.priority.toFixed(1)}${s.struggled ? '  ← STRUGGLED' : ''}`,
      ),
    );

    const topicMedians = new Map<string, number[]>();
    for (const s of scored) {
      const arr = topicMedians.get(s.topic) ?? [];
      arr.push(s.priority);
      topicMedians.set(s.topic, arr);
    }
    console.log('\n=== Mean priority by topic (review pool only) ===');
    Array.from(topicMedians.entries())
      .map(([t, arr]) => [t, arr.reduce((s: number, v: number) => s + v, 0) / arr.length, arr.length] as const)
      .sort((a, b) => b[1] - a[1])
      .forEach(([t, mean, n]) =>
        console.log(`  ${t.padEnd(24)} mean=${mean.toFixed(1)}  n=${n}`),
      );
  });

  test('new vs review split', () => {
    const { progress } = buildScenario();
    let newCount = 0;
    let reviewCount = 0;
    for (let i = 0; i < 1000; i++) {
      const q = SpacedRepetitionSystem.selectNextQuestion(backendQuestions, progress);
      if (!q) continue;
      if (progress.questionsAttempted.has(q.id)) reviewCount++;
      else newCount++;
    }
    console.log(`\n=== New vs Review (of 1000) ===`);
    console.log(`  new    : ${newCount}`);
    console.log(`  review : ${reviewCount}`);
  });
});
