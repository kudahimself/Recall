/**
 * What the Progress screen shows beyond the course path (utils/coursePath):
 * the course's headline numbers, the review schedule of every card family
 * met so far, its forecast by day, and a week of activity. Pure functions
 * over stored progress, so the tabs cannot disagree with the session.
 */
import { MisconceptionStore, Question, UserProgress } from '../types';
import { MISCONCEPTIONS } from '../data/misconceptions';
import { BACKEND_CONCEPT_MAP, DATABRICKS_CONCEPT_MAP, WEBDEV_CONCEPT_MAP } from './conceptRegistry';
import { CoursePath, PathSection, PathUnit } from './coursePath';
import { FamilyState, State, startOfLocalDay } from './familySchedule';
import { RECENT_WINDOW, pct, recentAttempts } from './spacedRepetition';

const DAY_MS = 24 * 60 * 60 * 1000;

export interface CourseStats {
  /** Questions answered at least once, of the course's total. */
  seen: number;
  total: number;
  /** Share right over the course's last RECENT_WINDOW answers; null before any. */
  recentPct: number | null;
  /** Share of seen questions answered right the first time; null before any. */
  firstTryPct: number | null;
  /** Every answer in the course. */
  answers: number;
}

export function courseStats(courseQuestions: Question[], progress: UserProgress): CourseStats {
  const ids = new Set(courseQuestions.map(q => q.id));
  const history = progress.attemptHistory.filter(a => ids.has(a.questionId));
  const first = new Map<string, boolean>();
  for (const a of [...history].sort((x, y) => x.timestamp - y.timestamp)) {
    if (!first.has(a.questionId)) first.set(a.questionId, a.isCorrect);
  }
  const recent = recentAttempts(history, RECENT_WINDOW);
  const firstRight = Array.from(first.values()).filter(Boolean).length;
  return {
    seen: courseQuestions.filter(q => progress.questionsAttempted.has(q.id)).length,
    total: courseQuestions.length,
    recentPct: recent.length > 0 ? Math.round(pct(recent.filter(a => a.isCorrect).length, recent.length)) : null,
    firstTryPct: first.size > 0 ? Math.round(pct(firstRight, first.size)) : null,
    answers: history.length,
  };
}

/** Card families of a section that are due today. */
export function sectionDue(section: PathSection): number {
  return section.units.reduce((n, u) => n + u.steps.families.filter(f => f.due).length, 0);
}

const CONCEPT_LABELS: Record<string, { label: string }> = { ...BACKEND_CONCEPT_MAP, ...WEBDEV_CONCEPT_MAP, ...DATABRICKS_CONCEPT_MAP };

/** A card family's name: its concept's label, "Whole topic" for an untagged topic. */
export function familyLabel(family: string): string {
  const concept = family.slice(family.indexOf('/') + 1);
  if (concept === '*') return 'Whole topic';
  const known = CONCEPT_LABELS[concept]?.label;
  if (known) return known;
  const words = concept.replace(/[-_]/g, ' ');
  return words.charAt(0).toUpperCase() + words.slice(1);
}

/** Whole local days from today to `ms`: 0 today, 1 tomorrow, negative before today. */
export function daysFromToday(ms: number, now: number): number {
  return Math.round((startOfLocalDay(ms) - startOfLocalDay(now)) / DAY_MS);
}

export interface ScheduleRow {
  family: string;
  label: string;
  unit: PathUnit;
  section: string;
  state: FamilyState;
  /** Days until it is due: 0 for due today or overdue. */
  inDays: number;
}

export interface Schedule {
  /** Every card family met so far, soonest first. */
  rows: ScheduleRow[];
  /** Card families of open units not met yet. */
  notMet: number;
}

/** The review schedule of a course: every family met so far, by the day it comes due. */
export function reviewSchedule(path: CoursePath, now: number): Schedule {
  const rows: ScheduleRow[] = [];
  let notMet = 0;
  for (const section of path.sections) {
    for (const unit of section.units) {
      for (const f of unit.steps.families) {
        if (!f.state || f.state.state === State.New) {
          if (unit.unlocked) notMet += 1;
          continue;
        }
        rows.push({
          family: f.family,
          label: familyLabel(f.family),
          unit,
          section: section.name,
          state: f.state,
          inDays: f.due ? 0 : Math.max(0, daysFromToday(f.state.due, now)),
        });
      }
    }
  }
  rows.sort((a, b) => a.inDays - b.inDays || a.state.due - b.state.due || a.label.localeCompare(b.label));
  return { rows, notMet };
}

/** Families coming due on each of the next `days` days, today (with anything overdue) first. */
export function scheduleForecast(rows: ScheduleRow[], days: number): number[] {
  const out = new Array<number>(days).fill(0);
  for (const r of rows) if (r.inDays < days) out[r.inDays] += 1;
  return out;
}

/** "Due today", "Tomorrow", "Monday" this week, then "Mon 16 Nov". */
export function dueDayLabel(inDays: number, now: number): string {
  if (inDays <= 0) return 'Due today';
  if (inDays === 1) return 'Tomorrow';
  const day = new Date(startOfLocalDay(now) + inDays * DAY_MS + DAY_MS / 2);
  if (inDays < 7) return day.toLocaleDateString('en-GB', { weekday: 'long' });
  return day.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
}

/** "today", "yesterday", "3 days ago", "in 2 days", by local days. */
export function relativeDay(ms: number, now: number): string {
  const days = daysFromToday(ms, now);
  if (days === 0) return 'today';
  if (days === 1) return 'tomorrow';
  if (days === -1) return 'yesterday';
  return days > 0 ? `in ${days} days` : `${-days} days ago`;
}

export interface MisconceptionHit {
  tag: string;
  name: string;
  description: string;
  count: number;
}

/** The misconceptions hit most often on the course's questions, most first. */
export function topMisconceptions(courseQuestions: Question[], store: MisconceptionStore, max: number): MisconceptionHit[] {
  const ids = new Set(courseQuestions.map(q => q.id));
  const counts = new Map<string, number>();
  for (const ev of store.events) {
    if (!ids.has(ev.questionId) || !MISCONCEPTIONS[ev.tag]) continue;
    counts.set(ev.tag, (counts.get(ev.tag) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, max)
    .map(([tag, count]) => ({ tag, name: MISCONCEPTIONS[tag].name, description: MISCONCEPTIONS[tag].description, count }));
}

export interface ActivitySummary {
  today: number;
  week: number;
  /** Days with at least one answer in the last 30. */
  activeDays30: number;
}

/** Answers today and over the last 7 days, and active days over the last 30, from per-day counts (UTC keys). */
export function activitySummary(days: { date: string; count: number }[], now: number): ActivitySummary {
  const key = (offset: number) => new Date(now - offset * DAY_MS).toISOString().split('T')[0];
  const today = key(0);
  const weekStart = key(6);
  const monthStart = key(29);
  return {
    today: days.filter(d => d.date === today).reduce((n, d) => n + d.count, 0),
    week: days.filter(d => d.date >= weekStart && d.date <= today).reduce((n, d) => n + d.count, 0),
    activeDays30: days.filter(d => d.date >= monthStart && d.date <= today && d.count > 0).length,
  };
}
