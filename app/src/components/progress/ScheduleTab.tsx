/**
 * Progress → Review schedule: every card family met so far, grouped by the
 * day it comes due (FSRS, utils/familySchedule), beside the next two weeks
 * as columns and the selected family's record. Up and Down move through the
 * families from anywhere on the tab; D drills the family's topic and R opens
 * its rule card. From Topics, the list can be narrowed to one topic.
 */
import React, { useMemo, useState } from 'react';
import { BookOpen, CheckCircle2, Dumbbell, ListTree, X, XCircle } from 'lucide-react';
import { State } from '../../utils/familySchedule';
import { Schedule, ScheduleRow, dueDayLabel, relativeDay, scheduleForecast } from '../../utils/progressStats';
import { useShortcut } from '../../keyboard/shortcuts';
import { Badge, BadgeTone } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card, CardHeader } from '../ui/Card';
import { EmptyState } from '../ui/EmptyState';
import { KeyHints } from '../ui/Kbd';
import { ListBox, ListGroup, stepKey } from '../ui/ListBox';
import { StatGroup, StatTile } from '../ui/StatTile';
import { ProgressViewProps, unitKey } from './progressTypes';
import styles from './Progress.module.css';

interface ScheduleTabProps extends ProgressViewProps {
  now: number;
  listRef: React.Ref<HTMLDivElement>;
  schedule: Schedule;
  /** Only this unit's families (a unit key), or every family. */
  topicFilter: string | null;
  onClearFilter: () => void;
  /** Show a unit on the Topics tab. */
  onOpenTopic: (unitKey: string) => void;
}

const FORECAST_DAYS = 14;
const DAY_MS = 24 * 60 * 60 * 1000;

const STATE_LABEL: Record<number, [string, BadgeTone]> = {
  [State.Learning]: ['learning', 'accent'],
  [State.Review]: ['review', 'success'],
  [State.Relearning]: ['relearning', 'warning'],
};

function stateBadge(r: ScheduleRow): [string, BadgeTone] {
  if (!r.state.lastCorrect) return ['missed last time', 'danger'];
  return STATE_LABEL[r.state.state] ?? ['learning', 'accent'];
}

export function ScheduleTab({
  schedule, topicFilter, now, listRef, onClearFilter, onOpenTopic, onDrill, onRuleCard,
}: ScheduleTabProps) {
  const rows = useMemo(
    () => (topicFilter ? schedule.rows.filter(r => unitKey(r.unit.topicKeys) === topicFilter) : schedule.rows),
    [schedule, topicFilter],
  );
  const filterName = topicFilter ? rows[0]?.unit.displayName ?? null : null;
  const groups = useMemo<ListGroup<ScheduleRow>[]>(() => {
    const byDay = new Map<number, ScheduleRow[]>();
    for (const r of rows) byDay.set(r.inDays, [...(byDay.get(r.inDays) ?? []), r]);
    return Array.from(byDay.entries()).map(([inDays, items]) => ({
      key: String(inDays),
      header: (
        <span className={styles.groupHead}>
          <span className={styles.groupName}>{dueDayLabel(inDays, now)}</span>
          <span className={styles.mono}>{items.length}</span>
        </span>
      ),
      items,
    }));
  }, [rows, now]);
  const keys = rows.map(r => r.family);

  const [picked, setPicked] = useState<string | null>(null);
  const selected = rows.find(r => r.family === picked) ?? rows[0];
  const selectedKey = selected?.family ?? null;
  const lesson = selected?.unit.steps.lesson ?? null;

  useShortcut('moveInList', e => {
    const next = stepKey(keys, selectedKey, e.key === 'ArrowUp' ? -1 : 1);
    if (next) setPicked(next);
    const list = typeof listRef === 'object' ? listRef?.current : null;
    list?.focus({ preventScroll: true });
  }, rows.length > 0);
  useShortcut('drill', () => { onDrill(selected!.unit.topicKeys); }, !!selected && selected.unit.unlocked);
  useShortcut('ruleCard', () => { onRuleCard(lesson!.id); }, !!lesson);

  const forecast = scheduleForecast(schedule.rows, FORECAST_DAYS);
  const dueToday = forecast[0];
  const nextWeek = forecast.slice(1, 8).reduce((n, c) => n + c, 0);
  const later = schedule.rows.length - forecast.slice(0, 8).reduce((n, c) => n + c, 0);

  return (
    <>
      <div className={styles.split}>
        <Card as="section" padded={false} className={`${styles.card} ${styles.grow}`} aria-labelledby="progress-schedule">
          <CardHeader
            title="Card families"
            titleId="progress-schedule"
            aside={filterName
              ? (
                <Button size="sm" variant="ghost" icon={<X />} onClick={onClearFilter} aria-label={`Only ${filterName}: show every topic`}>
                  Only {filterName}
                </Button>
              )
              : <span>{schedule.rows.length} met · {schedule.notMet} not met yet</span>}
          />
          {rows.length === 0
            ? (
              <EmptyState compact title="Nothing scheduled yet.">
                A card family gets its first review date the first time you answer one of its cards.
              </EmptyState>
            )
            : (
              <ListBox
                ref={listRef}
                label="Card families, by the day they come due"
                groups={groups}
                itemKey={r => r.family}
                selectedKey={selectedKey}
                onSelect={setPicked}
                className={styles.list}
                renderItem={r => <FamilyRow row={r} now={now} sub={r.unit.displayName} />}
              />
            )}
        </Card>

        <div className={styles.col}>
          <Card as="section" padded={false} className={styles.card} aria-labelledby="progress-forecast">
            <CardHeader title="Next two weeks" titleId="progress-forecast" aside={<span>card families coming due</span>} />
            <StatGroup>
              <StatTile value={dueToday} label="due today" tone={dueToday > 0 ? 'warning' : 'neutral'} />
              <StatTile value={nextWeek} label="next 7 days" />
              <StatTile value={later} label="later" />
            </StatGroup>
            <Forecast counts={forecast} now={now} />
          </Card>

          {selected && (
            <Card as="section" padded={false} className={`${styles.card} ${styles.grow}`} aria-labelledby="progress-family">
              <CardHeader eyebrow={selected.unit.displayName} title={selected.label} titleId="progress-family" />
              <dl className={styles.facts}>
                <div>
                  <dt>Last review</dt>
                  <dd>
                    {selected.state.last_review !== null
                      ? <><ResultIcon right={selected.state.lastCorrect} />{relativeDay(selected.state.last_review, now)}, {selected.state.lastCorrect ? 'right' : 'missed'}</>
                      : '-'}
                  </dd>
                </div>
                <div>
                  <dt>Next review</dt>
                  <dd>{selected.inDays === 0 ? 'due today' : `${dueDayLabel(selected.inDays, now)}, ${relativeDay(now + selected.inDays * DAY_MS, now)}`}</dd>
                </div>
                <div>
                  <dt>Reviews</dt>
                  <dd>{selected.state.reps} answered, {selected.state.lapses} lapse{selected.state.lapses === 1 ? '' : 's'}</dd>
                </div>
                <div>
                  <dt>State</dt>
                  <dd>{stateBadge(selected)[0].replace(/^./, c => c.toUpperCase())}</dd>
                </div>
              </dl>
              <div className={styles.actions}>
                {selected.unit.unlocked && (
                  <Button icon={<Dumbbell />} shortcut="D" onClick={() => onDrill(selected.unit.topicKeys)} aria-label={`Drill ${selected.unit.displayName}`}>Drill</Button>
                )}
                {lesson && <Button variant="ghost" icon={<BookOpen />} shortcut="R" onClick={() => onRuleCard(lesson.id)}>Rule card</Button>}
                <Button variant="ghost" icon={<ListTree />} onClick={() => onOpenTopic(unitKey(selected.unit.topicKeys))} aria-label={`${selected.unit.displayName} on Topics`}>Topic</Button>
              </div>
              <p className={`${styles.footnote} ${styles.tallOnly}`}>
                Reviews are scheduled per card family, so one review can serve any of its cards.
                Families due today feed the session's reviews.
              </p>
            </Card>
          )}
        </div>
      </div>
      <KeyHints
        className={styles.keys}
        hints={[
          ['ArrowLeft/ArrowRight', 'tabs'],
          ...(rows.length > 0 ? [['ArrowUp/ArrowDown', 'card family'] as [string, string]] : []),
          ...(selected?.unit.unlocked ? [['drill', 'drill its topic'] as [string, string]] : []),
          ...(lesson ? [['ruleCard', 'rule card'] as [string, string]] : []),
          ['help', 'all keys'],
        ]}
      />
    </>
  );
}

function ResultIcon({ right }: { right: boolean }) {
  return right
    ? <CheckCircle2 className={styles.right} aria-label="right" />
    : <XCircle className={styles.wrong} aria-label="missed" />;
}

/** One card family: its name over `sub` (its topic, or when it is due), its last review and its state. */
export function FamilyRow({ row, now, sub }: { row: ScheduleRow; now: number; sub: React.ReactNode }) {
  const [label, tone] = stateBadge(row);
  return (
    <span className={styles.familyRow}>
      <span className={styles.familyText}>
        <span className={`${styles.familyName} ${styles.truncate}`} title={row.label}>{row.label}</span>
        <span className={`${styles.familyTopic} ${styles.truncate}`}>{sub}</span>
      </span>
      <span className={styles.familyLast}>
        {row.state.last_review !== null && <><ResultIcon right={row.state.lastCorrect} />{relativeDay(row.state.last_review, now)}</>}
      </span>
      <Badge tone={tone}>{label}</Badge>
    </span>
  );
}

/** The next FORECAST_DAYS days as columns of families coming due; today holds anything overdue. */
function Forecast({ counts, now }: { counts: number[]; now: number }) {
  const max = Math.max(1, ...counts);
  const day = (i: number) => new Date(now + i * DAY_MS);
  return (
    <figure className={styles.forecast}>
      <div className={styles.bars} role="img" aria-label={`Card families coming due per day, next ${counts.length} days: ${counts.join(', ')}`}>
        {counts.map((c, i) => (
          <div
            key={i}
            className={styles.barCol}
            title={`${i === 0 ? 'Today' : day(i).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}: ${c} card famil${c === 1 ? 'y' : 'ies'}`}
          >
            <span className={styles.barValue}>{c > 0 ? c : ''}</span>
            <span className={styles.bar} style={{ ['--h' as string]: `${(100 * c) / max}%` }} data-empty={c === 0 || undefined} />
          </div>
        ))}
      </div>
      <figcaption className={styles.barLabels} aria-hidden="true">
        {counts.map((_, i) => (
          <span key={i} data-today={i === 0 || undefined}>
            <span>{day(i).toLocaleDateString('en-GB', { weekday: 'narrow' })}</span>
            <span>{day(i).getDate()}</span>
          </span>
        ))}
      </figcaption>
    </figure>
  );
}
