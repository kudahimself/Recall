/**
 * One-time seed for the persisted `masteredTopics` set.
 *
 * Mastery is now STORED, not derived: a topic/unit/section enters the set the
 * moment its unlock bar is crossed and never leaves (see
 * SpacedRepetitionSystem.updateMasteredTopics). Existing users have progress
 * but no stored set, so on first load we replay their attemptHistory ONCE to
 * seed the same topics the old history-replay predicate would have considered
 * mastered - preserving every unlock without re-locking anything.
 *
 * This replay is the ONLY place history is walked for mastery. After the seed
 * runs, `masteredTopics` is authoritative and the replay never runs again.
 */
import { Question, QuestionAttempt } from '../types';
import { getGroupsForTopic } from './courseConfig';
import { UNLOCK_ACCURACY_PCT, pct } from './spacedRepetition';

/**
 * True if a question group EVER simultaneously held full coverage (every
 * question attempted) + latest-correct pct > UNLOCK_ACCURACY_PCT, replaying
 * chronologically with an early exit at the first crossing. This is the
 * (now-retired) sticky-mastery predicate, kept here purely for the seed.
 */
function everMetBar(groupQuestions: Question[], history: QuestionAttempt[]): boolean {
  const size = groupQuestions.length;
  if (size === 0) return false;
  const qIds = new Set(groupQuestions.map(q => q.id));
  const latest = new Map<string, boolean>();
  let correct = 0;
  for (const a of history) {
    if (!qIds.has(a.questionId)) continue;
    if (latest.get(a.questionId) === true) correct--;
    if (a.isCorrect) correct++;
    latest.set(a.questionId, a.isCorrect);
    if (latest.size === size && pct(correct, size) > UNLOCK_ACCURACY_PCT) return true;
  }
  return false;
}

/**
 * Seed the mastered-topics set from attemptHistory, applying the grant rule
 * retroactively: any scope (a topic, its unit, or its section) whose aggregate
 * ever crossed the bar contributes ALL of its member topics. Mirrors
 * updateMasteredTopics so a seeded install and a freshly-earned one agree.
 */
export function seedMasteredTopics(
  questions: Question[],
  attemptHistory: QuestionAttempt[],
): Set<string> {
  const mastered = new Set<string>();
  if (attemptHistory.length === 0) return mastered;

  // Unique group scopes present in the pool (topic / unit / section), deduped
  // by their member-key signature so shared units/sections are checked once.
  const groups: string[][] = [];
  const seen = new Set<string>();
  const addGroup = (keys: string[]) => {
    const sig = [...keys].sort().join('|');
    if (seen.has(sig)) return;
    seen.add(sig);
    groups.push(keys);
  };
  const topicsSeen = new Set<string>();
  for (const q of questions) {
    if (topicsSeen.has(q.topic)) continue;
    topicsSeen.add(q.topic);
    addGroup([q.topic]);
    const g = getGroupsForTopic(q.topic);
    if (g) {
      addGroup(g.unitTopics);
      addGroup(g.sectionTopics);
    }
  }

  for (const keys of groups) {
    const qs = questions.filter(q => keys.includes(q.topic));
    if (everMetBar(qs, attemptHistory)) {
      for (const k of keys) mastered.add(k);
    }
  }
  return mastered;
}
