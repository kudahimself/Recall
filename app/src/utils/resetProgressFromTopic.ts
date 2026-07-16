/**
 * Dev-only helper: drop all stored progress for topics at-or-after a given
 * point in the active course's path order. Used to roll back future-topic
 * state so the next-question selection falls back to the legacy type-sort
 * (MCQ → PREDICT → PARSONS → CLOZE → CODING) for those topics.
 *
 * Usage (from browser devtools):
 *   window.__resetFromTopic('py_functools')
 *   // then reload the page
 */
import { questions } from '../data/questions';
import { getTopicOrder, getCourseForTopic } from './courseConfig';

const PROGRESS_KEY = 'recall-progress';
const CONCEPT_PROGRESS_KEY = 'recall-concept-progress';
const CONCEPT_MIGRATION_KEY = 'recall-concept-migration-version';

function resetProgressFromTopic(topicKey: string): void {
  const sampleQ = questions.find(q => q.topic === topicKey);
  if (!sampleQ) {
    console.error(`[resetFromTopic] Unknown topic key: ${topicKey}`);
    return;
  }
  const course = getCourseForTopic(topicKey);
  const order = getTopicOrder(course);
  const idx = order.indexOf(topicKey);
  if (idx < 0) {
    console.error(`[resetFromTopic] Topic ${topicKey} not in path order for course ${course}.`);
    return;
  }
  const topicsToReset = new Set(order.slice(idx));
  const idsToReset = new Set(
    questions.filter(q => topicsToReset.has(q.topic)).map(q => q.id),
  );

  const raw = localStorage.getItem(PROGRESS_KEY);
  if (!raw) {
    console.warn('[resetFromTopic] No progress in localStorage — nothing to do.');
    return;
  }

  const p: {
    questionsAttempted?: string[];
    correctAnswers?: string[];
    attemptHistory?: Array<{ questionId: string }>;
    topicScores?: Record<string, unknown>;
    difficultyScores?: Record<string, unknown>;
    lastAttempt?: Record<string, unknown>;
    repetitionQueue?: Record<string, unknown>;
    masteredTopics?: string[];
  } = JSON.parse(raw);

  const before = {
    attempted: p.questionsAttempted?.length ?? 0,
    correct: p.correctAnswers?.length ?? 0,
    history: p.attemptHistory?.length ?? 0,
  };

  p.questionsAttempted = (p.questionsAttempted ?? []).filter(id => !idsToReset.has(id));
  p.correctAnswers = (p.correctAnswers ?? []).filter(id => !idsToReset.has(id));
  p.attemptHistory = (p.attemptHistory ?? []).filter(a => !idsToReset.has(a.questionId));

  if (p.topicScores) {
    topicsToReset.forEach(t => { delete p.topicScores![t]; });
  }
  if (p.masteredTopics) {
    p.masteredTopics = p.masteredTopics.filter(t => !topicsToReset.has(t));
  }
  if (p.lastAttempt) {
    for (const id of Object.keys(p.lastAttempt)) if (idsToReset.has(id)) delete p.lastAttempt[id];
  }
  if (p.repetitionQueue) {
    for (const id of Object.keys(p.repetitionQueue)) if (idsToReset.has(id)) delete p.repetitionQueue[id];
  }

  localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
  localStorage.removeItem(CONCEPT_PROGRESS_KEY);
  localStorage.removeItem(CONCEPT_MIGRATION_KEY);

  console.log(`[resetFromTopic] Reset ${topicsToReset.size} topics, ${idsToReset.size} question ids.`);
  console.log(`  Topics: ${Array.from(topicsToReset).join(', ')}`);
  console.log(`  attemptHistory:    ${before.history} → ${p.attemptHistory.length}`);
  console.log(`  questionsAttempted: ${before.attempted} → ${p.questionsAttempted.length}`);
  console.log(`  correctAnswers:     ${before.correct} → ${p.correctAnswers.length}`);
  console.log('Concept progress cleared; will rebuild from cleaned history on next load.');
  console.log('Reload the page now (Ctrl+R) to apply.');
}

declare global {
  interface Window {
    __resetFromTopic?: (topicKey: string) => void;
  }
}

if (typeof window !== 'undefined') {
  window.__resetFromTopic = resetProgressFromTopic;
}
