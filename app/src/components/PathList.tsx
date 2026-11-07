/**
 * A course's path: each unit with its lesson, ramp, review and exercise
 * steps, and the lesson to start next. Home shows the section the learner is
 * in, fitted to the height it is given; Progress shows every section.
 */
import React, { useRef } from 'react';
import { BookOpen, CheckCircle2, Lock, PlayCircle } from 'lucide-react';
import { TopicLesson } from '../types';
import { CoursePath, PathSection, PathUnit } from '../utils/coursePath';
import { ExercisesDone, exerciseForTopics } from '../utils/exercises';
import { UNLOCK_ACCURACY_PCT } from '../utils/spacedRepetition';
import { useFitRows } from '../utils/useFitRows';
import { Badge, BadgeCount, BadgeTone } from './ui/Badge';
import { Button } from './ui/Button';
import styles from './PathList.module.css';

interface PathActions {
  nextLesson: TopicLesson | null;
  exercisesDone: ExercisesDone;
  onStartLesson: (lessonId: string) => void;
  onRuleCard: (lessonId: string) => void;
}

interface PathListProps extends PathActions {
  units: PathUnit[];
  /** The accessible name of the list. */
  label: string;
  /** Index of the unit the learner is on; marked, and kept in view when fitting. */
  current?: number;
  /** Show only the rows that fit the list's height, around `current`. */
  fit?: boolean;
  className?: string;
}

type UnitState = 'done' | 'now' | 'open' | 'locked';

function unitState(u: PathUnit, isCurrent: boolean): UnitState {
  if (!u.unlocked) return 'locked';
  if (isCurrent) return 'now';
  if (u.coveragePct === 100 && u.recentPct >= UNLOCK_ACCURACY_PCT) return 'done';
  return 'open';
}

const STATE_ICON = { done: CheckCircle2, now: PlayCircle, open: PlayCircle, locked: Lock };
const STATE_LABEL = { done: 'Done', now: 'You are here', open: 'Open', locked: 'Locked' };

export function PathList({ units, label, current = -1, fit = false, className, ...actions }: PathListProps) {
  const listRef = useRef<HTMLOListElement>(null);
  const shown = useFitRows(listRef, units.length, fit);
  const start = Math.max(0, Math.min(current - 1, units.length - shown));
  const hidden = units.length - shown;
  return (
    <div className={[styles.wrap, fit ? styles.fit : '', className].filter(Boolean).join(' ')}>
      <ol ref={listRef} className={styles.list} aria-label={label}>
        {units.slice(start, start + shown).map((u, i) => (
          <UnitRow key={u.displayName} unit={u} isCurrent={start + i === current} {...actions} />
        ))}
      </ol>
      {hidden > 0 && (
        <p className={styles.more}>
          {hidden} more topic{hidden === 1 ? '' : 's'} in this section
        </p>
      )}
    </div>
  );
}

function UnitRow({ unit: u, isCurrent, nextLesson, exercisesDone, onStartLesson, onRuleCard }: PathActions & { unit: PathUnit; isCurrent: boolean }) {
  const state = unitState(u, isCurrent);
  const Icon = STATE_ICON[state];
  const st = u.steps;
  const isNext = !!st.lesson && st.lesson === nextLesson && u.unlocked;
  const due = st.families.filter(f => f.due).length;
  const met = st.families.some(f => f.state && f.state.reps > 0);
  const missed = st.families.some(f => f.state && f.state.reps > 0 && !f.state.lastCorrect);
  const rampDone = st.rampTotal > 0 && st.rampAnswered >= st.rampTotal;
  const exercise = exerciseForTopics(u.topicKeys);
  const exerciseDone = !!exercise && exercisesDone[exercise.id] !== undefined;

  const review: [BadgeTone, React.ReactNode] = due > 0 ? ['warning', <>Review <BadgeCount>{due}</BadgeCount> due</>]
    : missed ? ['danger', 'Review: missed']
    : met ? ['success', 'Review']
    : ['neutral', 'Review'];

  return (
    <li className={styles.row} data-state={state} aria-current={isCurrent ? 'step' : undefined}>
      <span className={styles.status} title={STATE_LABEL[state]}>
        <Icon aria-hidden="true" />
        <span className="sr-only">{STATE_LABEL[state]}: </span>
      </span>
      <span className={styles.name} title={u.displayName}>{u.displayName}</span>
      <span className={styles.steps}>
        {st.lesson && !isNext && (
          <Badge tone={st.lessonMet ? 'success' : 'neutral'} title="Lesson: the rule card and its worked example, then a few exercises">Lesson</Badge>
        )}
        <Badge tone={rampDone ? 'success' : 'neutral'} title="Ramp: introduce, combine, apply. The next topic opens when it is answered above the accuracy bar.">
          Ramp <BadgeCount>{st.rampAnswered}/{st.rampTotal}</BadgeCount>
        </Badge>
        <Badge tone={review[0]} title="Review: the topic's card families, scheduled by FSRS">{review[1]}</Badge>
        {exercise && (
          <Badge
            tone={exerciseDone ? 'success' : rampDone ? 'accent' : 'neutral'}
            title={`Exercise in your own editor: ${exercise.title}, in ${exercise.folder}. Tick it done under Progress, Topics.`}
          >
            Exercise
          </Badge>
        )}
      </span>
      <span className={styles.count} title="Questions seen">{u.seen}/{u.total}</span>
      <span className={styles.action}>
        {isNext
          ? <Button variant="primary" size="sm" onClick={() => onStartLesson(st.lesson!.id)}>Start lesson</Button>
          : st.lessonMet && st.lesson
            ? <Button variant="ghost" size="sm" icon={<BookOpen />} aria-label={`Rule card: ${u.displayName}`} title="Reopen the rule card" onClick={() => onRuleCard(st.lesson!.id)} />
            : null}
      </span>
    </li>
  );
}

const SECTION_ICON = { mastered: CheckCircle2, current: PlayCircle, locked: Lock };
const SECTION_LABEL = { mastered: 'Passed', current: 'Current section', locked: 'Locked' };

/** Every section of the course, for Progress. */
export function PathSections({ path, ...actions }: PathActions & { path: CoursePath }) {
  return (
    <ol className={styles.sections} aria-label="Every section of the course">
      {path.sections.map((s: PathSection, i) => {
        const Icon = SECTION_ICON[s.status];
        return (
          <li key={s.name} className={styles.section} data-status={s.status}>
            <div className={styles.sectionHead}>
              <span className={styles.sectionNum}>{String(i + 1).padStart(2, '0')}</span>
              <span className={styles.status} title={SECTION_LABEL[s.status]}><Icon aria-hidden="true" /></span>
              <h3 className={styles.sectionName}>{s.name}</h3>
              <span className={styles.count}>
                {s.seen}/{s.total}{s.status !== 'locked' && s.recentPct > 0 ? ` · ${s.recentPct}% recent` : ''}
              </span>
            </div>
            {s.status === 'locked'
              ? <p className={styles.lockedNote}>Locked: finish the section before it to open its {s.units.length} topics.</p>
              : (
                <PathList
                  units={s.units}
                  label={s.name}
                  current={s.units.findIndex(u => u.steps.lesson === actions.nextLesson && !!actions.nextLesson)}
                  {...actions}
                />
              )}
          </li>
        );
      })}
    </ol>
  );
}
