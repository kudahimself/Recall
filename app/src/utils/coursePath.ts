/**
 * What Home and Progress show about a course: its sections in path order
 * (mastered, current or locked) with each unit's lesson, ramp and review
 * steps, the section to show on Home, the topics worth another look, and
 * per-course totals for the course switcher.
 *
 * Pure functions over the stored progress; the unlock rules come from
 * SpacedRepetitionSystem, so these views can never disagree with what the
 * session is allowed to serve.
 */
import { Course, MisconceptionStore, Question, TopicLesson, UserProgress } from '../types';
import { getCourseForTopic, getPathOrder, getSectionUnits, getTopicKeysForSection } from './courseConfig';
import { FsrsStore } from './familySchedule';
import { LessonsDone, TopicSteps, isLessonMet, lessonsForTopic, topicSteps } from './lessons';
import { topMisconceptions } from './progressStats';
import {
  MIN_ATTEMPTS_FOR_STATS,
  RECENT_WINDOW,
  SpacedRepetitionSystem,
  UNLOCK_ACCURACY_PCT,
  isMastered,
  pct,
  recentAttempts,
} from './spacedRepetition';

/**
 * `open` is an earlier section that is unlocked but not passed: one inserted
 * ahead of a section the learner had already reached.
 */
export type SectionStatus = 'mastered' | 'open' | 'current' | 'locked';

export interface PathUnit {
  displayName: string;
  topicKeys: string[];
  seen: number;
  total: number;
  /** Accuracy over the unit's last RECENT_WINDOW answers; 0 before any. */
  recentPct: number;
  /** How many answers that accuracy is over (at most RECENT_WINDOW). */
  recentTotal: number;
  /** Questions whose latest answer was wrong. */
  missed: number;
  unlocked: boolean;
  coveragePct: number;
  steps: TopicSteps;
}

export interface PathSection {
  name: string;
  status: SectionStatus;
  seen: number;
  total: number;
  pct: number;
  recentPct: number;
  units: PathUnit[];
}

export interface CoursePath {
  sections: PathSection[];
  /** The last unlocked section: where new material comes from. */
  current: PathSection | undefined;
  /** The first locked section, which the current one opens. */
  nextLocked: PathSection | undefined;
  /** The next lesson to take: the first open unit whose lesson is not met. */
  nextLesson: TopicLesson | null;
  /** The section Home shows: the one holding the next lesson, else the current one. */
  focus: PathSection | undefined;
  /** The course's lessons, and how many are met. */
  lessons: { done: number; total: number };
}

interface Answer { questionId: string; isCorrect: boolean; timestamp: number }

function recentOf(answers: Answer[]): { pct: number; total: number } {
  const recent = recentAttempts(answers, RECENT_WINDOW);
  const correct = recent.filter(a => a.isCorrect).length;
  return { pct: recent.length > 0 ? Math.round(pct(correct, recent.length)) : 0, total: recent.length };
}

/** Questions whose most recent answer was wrong. */
function missedCount(answers: Answer[]): number {
  const latest = new Map<string, boolean>();
  for (const a of answers) latest.set(a.questionId, a.isCorrect);
  let n = 0;
  latest.forEach(ok => { if (!ok) n += 1; });
  return n;
}

export function buildCoursePath(
  course: Course,
  courseQuestions: Question[],
  progress: UserProgress,
  store: FsrsStore,
  lessonsDone: LessonsDone,
  now: number = Date.now(),
): CoursePath {
  const pathOrder = getPathOrder(course);
  const unlocked = SpacedRepetitionSystem.getUnlockedSections(courseQuestions, progress);
  const unlockedSet = unlocked?.sections ?? new Set<string>([pathOrder[0]]);
  const unlockedTopics = SpacedRepetitionSystem.getUnlockedTopics(courseQuestions, progress) ?? new Set<string>();
  const seenIds = progress.questionsAttempted;

  const sections: PathSection[] = [];
  for (const name of pathOrder) {
    const keys = new Set(getTopicKeysForSection(name));
    if (keys.size === 0) continue;
    const sectionQs = courseQuestions.filter(q => keys.has(q.topic));
    const sectionIds = new Set(sectionQs.map(q => q.id));
    const sectionAnswers = progress.attemptHistory.filter(a => sectionIds.has(a.questionId));

    const units: PathUnit[] = getSectionUnits(name).map(([displayName, topicKeys]) => {
      const unitQs = courseQuestions.filter(q => topicKeys.includes(q.topic));
      const unitIds = new Set(unitQs.map(q => q.id));
      const answers = progress.attemptHistory.filter(a => unitIds.has(a.questionId));
      const seen = unitQs.filter(q => seenIds.has(q.id)).length;
      const recent = recentOf(answers);
      return {
        displayName,
        topicKeys,
        seen,
        total: unitQs.length,
        recentPct: recent.pct,
        recentTotal: recent.total,
        missed: missedCount(answers),
        unlocked: topicKeys.some(t => unlockedTopics.has(t)),
        coveragePct: unitQs.length > 0 ? Math.round(pct(seen, unitQs.length)) : 0,
        steps: topicSteps(topicKeys, courseQuestions, progress, store, lessonsDone, now),
      };
    });

    const seen = sectionQs.filter(q => seenIds.has(q.id)).length;
    sections.push({
      name,
      status: unlockedSet.has(name) ? 'current' : 'locked',
      seen,
      total: sectionQs.length,
      pct: sectionQs.length > 0 ? Math.round(pct(seen, sectionQs.length)) : 0,
      recentPct: recentOf(sectionAnswers).pct,
      units,
    });
  }

  // Exactly one current section: the last unlocked one. Earlier unlocked
  // sections are mastered when passed; one inserted ahead of a section the
  // learner had already reached is open but not passed.
  let lastOpen = -1;
  sections.forEach((s, i) => { if (s.status === 'current') lastOpen = i; });
  sections.forEach((s, i) => {
    if (s.status !== 'current' || i >= lastOpen) return;
    s.status = isMastered(getTopicKeysForSection(s.name), courseQuestions, progress) ? 'mastered' : 'open';
  });

  const current = sections.find(s => s.status === 'current');
  const nextLocked = sections.find(s => s.status === 'locked');
  const open = sections.filter(s => s.status !== 'locked');
  const lessonUnit = open.flatMap(s => s.units).find(u => u.unlocked && u.steps.lesson && !u.steps.lessonMet);
  const nextLesson = lessonUnit?.steps.lesson ?? null;
  const focus = (lessonUnit && open.find(s => s.units.includes(lessonUnit))) ?? current;

  const allLessons = sections.flatMap(s => s.units.flatMap(u => u.topicKeys.flatMap(lessonsForTopic)));
  const lessons = { done: allLessons.filter(l => isLessonMet(l, lessonsDone, seenIds)).length, total: allLessons.length };

  return { sections, current, nextLocked, nextLesson, focus, lessons };
}

/** The unit the learner is on in a section: its next lesson, else the first not fully seen, else the last. */
export function currentUnitIndex(section: PathSection, nextLesson: TopicLesson | null): number {
  const lessonAt = nextLesson ? section.units.findIndex(u => u.steps.lesson === nextLesson) : -1;
  if (lessonAt >= 0) return lessonAt;
  const open = section.units.findIndex(u => u.unlocked && u.coveragePct < 100);
  if (open >= 0) return open;
  const lastOpen = section.units.map(u => u.unlocked).lastIndexOf(true);
  return lastOpen >= 0 ? lastOpen : 0;
}

export interface FocusArea {
  kind: 'topic';
  name: string;
  topicKeys: string[];
  recentPct: number;
  missed: number;
}

export interface FocusMisconception {
  kind: 'misconception';
  tag: string;
  name: string;
  description: string;
  count: number;
}

/** Open units answered below the unlock bar, worst first. */
export function weakTopics(path: CoursePath): FocusArea[] {
  return path.sections
    .filter(s => s.status !== 'locked')
    .flatMap(s => s.units)
    .filter(u => u.unlocked && u.recentTotal >= MIN_ATTEMPTS_FOR_STATS && u.recentPct < UNLOCK_ACCURACY_PCT)
    .sort((a, b) => a.recentPct - b.recentPct)
    .map(u => ({ kind: 'topic' as const, name: u.displayName, topicKeys: u.topicKeys, recentPct: u.recentPct, missed: u.missed }));
}

/**
 * What is worth another look in a course: open units answered below the
 * unlock bar (worst first), then the misconception hit most often on the
 * course's questions.
 */
export function focusAreas(
  path: CoursePath,
  courseQuestions: Question[],
  misconceptions: MisconceptionStore,
  max = 3,
): Array<FocusArea | FocusMisconception> {
  const weak = weakTopics(path);

  const misconception: FocusMisconception[] = topMisconceptions(courseQuestions, misconceptions, 1)
    .map(m => ({ kind: 'misconception', ...m }));

  // Keep a slot for the misconception when there is one.
  return [...weak.slice(0, max - misconception.length), ...misconception];
}

export interface CourseTotals {
  seen: number;
  total: number;
  coveragePct: number;
  /** Accuracy over the course's last RECENT_WINDOW answers; 0 before any. */
  recentPct: number;
  answered: number;
}

/** Seen, total and recent accuracy for every course, for the course switcher and the course card. */
export function courseTotals(questions: Question[], progress: UserProgress): Record<Course, CourseTotals> {
  const out = Object.fromEntries(
    (Object.values(Course) as Course[]).map(c => [c, { seen: 0, total: 0, coveragePct: 0, recentPct: 0, answered: 0 }]),
  ) as Record<Course, CourseTotals>;
  const courseOf = new Map<string, Course>();
  for (const q of questions) {
    const c = getCourseForTopic(q.topic);
    courseOf.set(q.id, c);
    out[c].total += 1;
  }
  progress.questionsAttempted.forEach(id => {
    const c = courseOf.get(id);
    if (c) out[c].seen += 1;
  });
  const byCourse = new Map<Course, Answer[]>();
  for (const a of progress.attemptHistory) {
    const c = courseOf.get(a.questionId);
    if (!c) continue;
    const list = byCourse.get(c) ?? [];
    list.push(a);
    byCourse.set(c, list);
  }
  (Object.keys(out) as Course[]).forEach(c => {
    const answers = byCourse.get(c) ?? [];
    out[c].coveragePct = Math.round(pct(out[c].seen, out[c].total));
    out[c].recentPct = recentOf(answers).pct;
    out[c].answered = answers.length;
  });
  return out;
}
