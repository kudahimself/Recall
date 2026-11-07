/**
 * Progress → Topics: every section's topics in path order, the list Home's
 * "All sections" opens, beside the selected topic. The topic shows its
 * lesson, ramp and review, the way in (Start lesson or the rule card, and a
 * drill), its exercise for the learner's own editor, and a link to its
 * review schedule. Up and Down move through the list from anywhere on the
 * tab; D drills the topic and R opens its rule card.
 */
import React, { useMemo } from 'react';
import { BookOpen, CalendarClock, Dumbbell, Lock, PlayCircle } from 'lucide-react';
import { PathSection, PathUnit, currentUnitIndex } from '../../utils/coursePath';
import { exerciseForTopics } from '../../utils/exercises';
import { Schedule, dueDayLabel, relativeDay } from '../../utils/progressStats';
import { UNLOCK_ACCURACY_PCT } from '../../utils/spacedRepetition';
import { State } from '../../utils/familySchedule';
import { useShortcut } from '../../keyboard/shortcuts';
import { ExerciseCard } from '../ExerciseCard';
import { SectionStatusIcon, UnitStatus, UnitSteps, unitState } from '../PathList';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card, CardHeader, Eyebrow } from '../ui/Card';
import { EmptyState } from '../ui/EmptyState';
import { KeyHints } from '../ui/Kbd';
import { ListBox, ListGroup, stepKey } from '../ui/ListBox';
import { StatGroup, StatTile } from '../ui/StatTile';
import { ProgressViewProps, unitKey } from './progressTypes';
import { FamilyRow } from './ScheduleTab';
import styles from './Progress.module.css';

interface TopicsTabProps extends ProgressViewProps {
  now: number;
  listRef: React.Ref<HTMLDivElement>;
  schedule: Schedule;
  /** Show this unit's card families on the Review schedule tab. */
  onOpenSchedule: (unitKey: string) => void;
}

interface Row {
  unit: PathUnit;
  section: PathSection;
  /** Position in its section, 1-based. */
  index: number;
}

export function TopicsTab({
  path, progress, exercisesDone, topic, now, listRef, schedule, onTopicChange, onDrill, onRuleCard, onStartLesson, onToggleExercise, onOpenSchedule,
}: TopicsTabProps) {
  const groups = useMemo<ListGroup<Row>[]>(() => path.sections
    .map((section, i) => ({
      key: String(i),
      header: <SectionHeader section={section} index={i} />,
      items: section.units.filter(u => u.total > 0).map((unit, j) => ({ unit, section, index: j + 1 })),
    }))
    .filter(g => g.items.length > 0), [path]);
  const rows = groups.flatMap(g => g.items);
  const keys = rows.map(r => unitKey(r.unit.topicKeys));

  // The learner's place when nothing is chosen yet: the unit Home marks "you are here".
  const focusSection = path.focus ?? path.sections[0];
  const fallback = focusSection ? focusSection.units[currentUnitIndex(focusSection, path.nextLesson)] : undefined;
  const selected = rows.find(r => unitKey(r.unit.topicKeys) === topic)
    ?? rows.find(r => r.unit === fallback)
    ?? rows[0];
  const selectedKey = selected ? unitKey(selected.unit.topicKeys) : null;

  const lesson = selected?.unit.steps.lesson ?? null;
  const canDrill = !!selected && selected.unit.unlocked;

  useShortcut('moveInList', e => {
    const next = stepKey(keys, selectedKey, e.key === 'ArrowUp' ? -1 : 1);
    if (next) onTopicChange(next);
    const list = typeof listRef === 'object' ? listRef?.current : null;
    list?.focus({ preventScroll: true });
  });
  useShortcut('drill', () => { onDrill(selected!.unit.topicKeys); }, canDrill);
  useShortcut('ruleCard', () => { onRuleCard(lesson!.id); }, !!lesson);

  if (!selected) {
    return <EmptyState title="This course has no topics yet." />;
  }

  return (
    <>
      <div className={`${styles.split} ${styles.splitEven}`}>
        <Card as="section" padded={false} className={`${styles.card} ${styles.grow}`} aria-labelledby="progress-topics">
          <CardHeader
            title="Topics"
            titleId="progress-topics"
            aside={<span>{rows.filter(r => r.unit.unlocked).length} of {rows.length} open</span>}
          />
          <ListBox
            ref={listRef}
            label="Topics, by section"
            groups={groups}
            itemKey={r => unitKey(r.unit.topicKeys)}
            selectedKey={selectedKey}
            onSelect={onTopicChange}
            isMuted={r => !r.unit.unlocked}
            className={styles.list}
            renderItem={r => <TopicRow row={r} isNext={!!r.unit.steps.lesson && r.unit.steps.lesson === path.nextLesson} exercisesDone={exercisesDone} />}
          />
        </Card>

        <TopicDetail
          row={selected}
          isNext={!!lesson && lesson === path.nextLesson && selected.unit.unlocked}
          sectionSize={selected.section.units.length}
          progress={progress}
          exercisesDone={exercisesDone}
          families={schedule.rows.filter(r => r.unit === selected.unit)}
          now={now}
          onDrill={onDrill}
          onRuleCard={onRuleCard}
          onStartLesson={onStartLesson}
          onToggleExercise={onToggleExercise}
          onOpenSchedule={onOpenSchedule}
        />
      </div>
      <KeyHints
        className={styles.keys}
        hints={[
          ['ArrowLeft/ArrowRight', 'tabs'],
          ['ArrowUp/ArrowDown', 'topic'],
          ...(canDrill ? [['drill', 'drill'] as [string, string]] : []),
          ...(lesson ? [['ruleCard', 'rule card'] as [string, string]] : []),
          ['help', 'all keys'],
        ]}
      />
    </>
  );
}

function SectionHeader({ section, index }: { section: PathSection; index: number }) {
  return (
    <span className={styles.groupHead} data-status={section.status}>
      <SectionStatusIcon status={section.status} />
      <span className={styles.sectionNum}>{String(index + 1).padStart(2, '0')}</span>
      <span className={`${styles.groupName} ${styles.truncate}`}>{section.name}</span>
      <span className={styles.mono}>
        {section.seen}/{section.total}{section.status !== 'locked' && section.seen > 0 ? ` · ${section.recentPct}%` : ''}
      </span>
    </span>
  );
}

function TopicRow({ row, isNext, exercisesDone }: { row: Row; isNext: boolean; exercisesDone: ProgressViewProps['exercisesDone'] }) {
  const u = row.unit;
  return (
    <span className={styles.topicRow}>
      <UnitStatus state={unitState(u, isNext && u.unlocked)} />
      <span className={`${styles.topicName} ${styles.truncate}`} title={u.displayName}>{u.displayName}</span>
      {u.unlocked
        ? <UnitSteps unit={u} exercisesDone={exercisesDone} compact className={styles.topicSteps} />
        : <span className={styles.lockedSteps}>ramp {u.steps.rampAnswered}/{u.steps.rampTotal}</span>}
      <span className={`${styles.mono} ${styles.topicCount}`} title="Questions seen">{u.seen}/{u.total}</span>
    </span>
  );
}

interface DetailProps {
  row: Row;
  isNext: boolean;
  sectionSize: number;
  progress: ProgressViewProps['progress'];
  exercisesDone: ProgressViewProps['exercisesDone'];
  /** The topic's card families met so far, soonest due first. */
  families: Schedule['rows'];
  now: number;
  onDrill: (keys: string[]) => void;
  onRuleCard: (lessonId: string) => void;
  onStartLesson: (lessonId: string) => void;
  onToggleExercise: (id: string) => void;
  onOpenSchedule: (unitKey: string) => void;
}

function TopicDetail({
  row, isNext, sectionSize, progress, exercisesDone, families, now, onDrill, onRuleCard, onStartLesson, onToggleExercise, onOpenSchedule,
}: DetailProps) {
  const u = row.unit;
  const s = u.steps;
  const exercise = exerciseForTopics(u.topicKeys);
  const answered = s.lesson ? s.lesson.exercises.filter(id => progress.questionsAttempted.has(id)) : [];
  const answeredRight = answered.filter(id => progress.correctAnswers.has(id)).length;
  const due = s.families.filter(f => f.due).length;
  const met = s.families.filter(f => f.state && f.state.state !== State.New).length;
  const state = unitState(u, false);

  return (
    <Card as="section" padded={false} className={`${styles.card} ${styles.grow} ${styles.detail}`} aria-labelledby="progress-topic">
      <CardHeader
        eyebrow={`${row.section.name} · topic ${row.index} of ${sectionSize}`}
        title={u.displayName}
        titleId="progress-topic"
        aside={state === 'locked'
          ? <Badge icon={<Lock />}>Locked</Badge>
          : state === 'done'
            ? <Badge tone="success">Done</Badge>
            : isNext ? <Badge tone="accent" icon={<PlayCircle />}>Next lesson</Badge> : <Badge tone="accent">Open</Badge>}
      />

      <div className={styles.detailBody}>
        <StatGroup>
          <StatTile
            value={!s.lesson ? 'None' : s.lessonDoneAt ? 'Done' : s.lessonMet ? 'Met' : 'Not yet'}
            label={s.lesson ? 'lesson' : 'no lesson yet'}
            title={s.lesson
              ? `${s.lessonDoneAt ? `Done ${relativeDay(s.lessonDoneAt, now)}. ` : ''}${answered.length} of ${s.lesson.exercises.length} lesson exercises answered, ${answeredRight} right`
              : undefined}
            tone={s.lesson && s.lessonMet ? 'success' : 'neutral'}
          />
          <StatTile
            value={s.rampAnswered}
            of={s.rampTotal}
            label="ramp answered"
            title={`Ramp: introduce, combine, apply. ${s.rampByDifficulty.map(d => `${d.difficulty} ${d.answered}/${d.total}`).join(', ')}.`}
            tone={s.rampTotal > 0 && s.rampAnswered >= s.rampTotal ? 'success' : 'neutral'}
          />
          <StatTile
            value={due}
            label="reviews due"
            title={`${met} of ${s.families.length} card families met; ${due} due today`}
            tone={due > 0 ? 'warning' : 'neutral'}
          />
        </StatGroup>

        {!u.unlocked && (
          <p className={styles.note}>
            <Lock aria-hidden="true" />
            <span>It opens when the topic before it has its ramp answered at {UNLOCK_ACCURACY_PCT}% or better. Its rule card is open to read now.</span>
          </p>
        )}

        <div className={styles.actions}>
          {s.lesson && (isNext
            ? <Button variant="primary" icon={<PlayCircle />} onClick={() => onStartLesson(s.lesson!.id)}>Start the lesson</Button>
            : (
              <Button
                variant={s.lessonMet ? 'secondary' : 'primary'}
                icon={<BookOpen />}
                shortcut="R"
                onClick={() => onRuleCard(s.lesson!.id)}
                aria-label={`${s.lessonMet ? 'Reopen' : 'Read'} the rule card`}
              >
                Rule card
              </Button>
            ))}
          {u.unlocked && (
            <Button icon={<Dumbbell />} shortcut="D" onClick={() => onDrill(u.topicKeys)} aria-label="Drill this topic">Drill</Button>
          )}
          {met > 0 && (
            <Button
              variant="ghost"
              icon={<CalendarClock />}
              onClick={() => onOpenSchedule(unitKey(u.topicKeys))}
              aria-label={`Review schedule of ${u.displayName}`}
              title={`${met} of ${s.families.length} card families met: when each comes back`}
            >
              Schedule
            </Button>
          )}
        </div>

        {exercise && (
          <ExerciseCard
            exercise={exercise}
            doneAt={exercisesDone[exercise.id]}
            rampDone={s.rampAnswered >= s.rampTotal}
            rampAnswered={s.rampAnswered}
            rampTotal={s.rampTotal}
            dayLabel={ms => relativeDay(ms, now)}
            onToggle={onToggleExercise}
          />
        )}

        {families.length > 0 && (
          <section className={styles.topicFamilies} aria-label={`Card families of ${u.displayName}`}>
            <Eyebrow>Card families · when each comes back</Eyebrow>
            <ul className={styles.familyList}>
              {families.map(f => (
                <li key={f.family}><FamilyRow row={f} now={now} sub={dueDayLabel(f.inDays, now)} /></li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </Card>
  );
}
