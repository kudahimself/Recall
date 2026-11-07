/**
 * Progress → Overview: the course's four numbers, every section with how much
 * is seen, how well it is going and what is due, the activity calendar, and
 * the topics and mix-ups worth another look. Each number appears once.
 */
import React, { useMemo } from 'react';
import { ChevronRight, Dumbbell, Sparkles } from 'lucide-react';
import { COURSE_META } from '../../utils/courseMeta';
import { currentUnitIndex, weakTopics } from '../../utils/coursePath';
import { activitySummary, courseStats, sectionDue, topMisconceptions } from '../../utils/progressStats';
import { RECENT_WINDOW, UNLOCK_ACCURACY_PCT, WEAK_AREAS_MAX } from '../../utils/spacedRepetition';
import { useShortcut } from '../../keyboard/shortcuts';
import { SectionStatusIcon, SECTION_LABEL } from '../PathList';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card, CardHeader } from '../ui/Card';
import { EmptyState } from '../ui/EmptyState';
import { Heatmap } from '../ui/Heatmap';
import { InlineText } from '../ui/InlineText';
import { KeyHints } from '../ui/Kbd';
import { ProgressBar } from '../ui/ProgressBar';
import { StatGroup, StatTile } from '../ui/StatTile';
import { ProgressViewProps, unitKey } from './progressTypes';
import styles from './Progress.module.css';

interface OverviewTabProps extends ProgressViewProps {
  now: number;
  /** Show a unit on the Topics tab. */
  onOpenTopic: (unitKey: string) => void;
}

export function OverviewTab({
  course, questions, progress, path, misconceptions, activity, longestStreak, now, onDrill, onOpenTopic,
}: OverviewTabProps) {
  const stats = useMemo(() => courseStats(questions, progress), [questions, progress]);
  const weak = useMemo(() => weakTopics(path).slice(0, WEAK_AREAS_MAX), [path]);
  const mixUps = useMemo(() => topMisconceptions(questions, misconceptions, 3), [questions, misconceptions]);
  const week = activitySummary(activity, now);
  const passed = path.sections.filter(s => s.status === 'mastered').length;
  const label = COURSE_META[course].label;
  const drillAll = () => onDrill(weak.flatMap(w => w.topicKeys));

  useShortcut('drill', () => {
    if (weak.length === 0) return false;
    drillAll();
    return true;
  });

  return (
    <>
      <div className={styles.stack}>
        <StatGroup className={styles.stats}>
          <StatTile value={stats.seen.toLocaleString()} of={stats.total.toLocaleString()} label="questions seen">
            <ProgressBar
              value={(100 * stats.seen) / Math.max(1, stats.total)}
              tone="course"
              label={`Questions seen in ${label}`}
              valueText={`${stats.seen} of ${stats.total}`}
              className={styles.tileBar}
            />
          </StatTile>
          <StatTile
            value={stats.recentPct === null ? 'New' : `${stats.recentPct}%`}
            label={`right in your last ${RECENT_WINDOW} answers`}
            tone={stats.recentPct === null ? 'neutral' : stats.recentPct >= UNLOCK_ACCURACY_PCT ? 'success' : 'warning'}
          />
          <StatTile
            value={stats.firstTryPct === null ? 'New' : `${stats.firstTryPct}%`}
            label="right the first time"
            title="Of the questions you have seen, the share you answered right on your first try"
          />
          {path.lessons.total > 0
            ? <StatTile value={path.lessons.done} of={path.lessons.total} label="lessons done" />
            : <StatTile value={stats.answers.toLocaleString()} label="answers in all" />}
        </StatGroup>

        <div className={styles.split}>
          <Card as="section" className={`${styles.card} ${styles.grow}`} aria-labelledby="progress-sections">
            <CardHeader
              as="h3"
              title="Sections"
              titleId="progress-sections"
              aside={<span>{passed} of {path.sections.length} passed</span>}
            />
            <div className={styles.sectionTable}>
              <div className={styles.sectionHead} aria-hidden="true">
                <span />
                <span>Section</span>
                <span>Seen</span>
                <span className={styles.num}>Recent</span>
                <span className={styles.num}>Due</span>
                <span />
              </div>
              <ol className={styles.sectionRows} aria-label={`Sections of ${label}`}>
                {path.sections.map((s, i) => {
                  const due = sectionDue(s);
                  const unit = s.units[currentUnitIndex(s, path.nextLesson)] ?? s.units[0];
                  const seenPct = s.total > 0 ? (100 * s.seen) / s.total : 0;
                  return (
                    <li key={s.name}>
                      <button
                        type="button"
                        className={styles.sectionRow}
                        data-status={s.status}
                        disabled={!unit}
                        onClick={() => unit && onOpenTopic(unitKey(unit.topicKeys))}
                        aria-label={`${s.name}, ${SECTION_LABEL[s.status].toLowerCase()}: ${s.seen} of ${s.total} seen`
                          + `${s.status !== 'locked' && s.seen > 0 ? `, ${s.recentPct}% recent` : ''}, ${due} due. Show its topics`}
                      >
                        <SectionStatusIcon status={s.status} />
                        <span className={styles.sectionName}>
                          <span className={styles.sectionNum}>{String(i + 1).padStart(2, '0')}</span>
                          <span className={styles.truncate}>{s.name}</span>
                        </span>
                        <span className={styles.seen}>
                          <span className={styles.mono}>{s.seen}/{s.total}</span>
                          <ProgressBar value={seenPct} tone="course" label={`${s.name} seen`} className={styles.rowBar} />
                        </span>
                        <span className={`${styles.num} ${styles.mono}`}>{s.status !== 'locked' && s.seen > 0 ? `${s.recentPct}%` : '-'}</span>
                        <span className={`${styles.num} ${styles.mono}`}>{due > 0 ? <Badge tone="warning">{due}</Badge> : '-'}</span>
                        <ChevronRight className={styles.chevron} aria-hidden="true" />
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>
            <p className={styles.footnote}>
              A locked section opens when every topic of the one before has its ramp answered at {UNLOCK_ACCURACY_PCT}% or better.
            </p>
          </Card>

          <div className={styles.col}>
            <Card as="section" className={styles.card} aria-labelledby="progress-activity">
              <CardHeader
                as="h3"
                title="Activity"
                titleId="progress-activity"
                aside={longestStreak > 0
                  ? <span>Best streak <strong className={styles.strong}>{longestStreak}</strong> day{longestStreak === 1 ? '' : 's'}</span>
                  : undefined}
              />
              <Heatmap
                data={activity}
                weeks={26}
                summary={<><strong>{week.today}</strong> today · <strong>{week.week}</strong> in 7 days · <strong>{week.activeDays30}</strong> of 30 days active</>}
              />
            </Card>

            <Card as="section" className={`${styles.card} ${styles.grow}`} aria-labelledby="progress-focus">
              <CardHeader
                as="h3"
                title="Worth another look"
                titleId="progress-focus"
                aside={weak.length > 0 && (
                  <Button size="sm" icon={<Dumbbell />} shortcut="D" onClick={drillAll} aria-label={`Drill the ${weak.length} weak topic${weak.length === 1 ? '' : 's'}`}>
                    Drill {weak.length === 1 ? 'it' : 'all'}
                  </Button>
                )}
              />
              {weak.length === 0 && mixUps.length === 0
                ? (
                  <EmptyState compact icon={<Sparkles />} title="Nothing to flag yet.">
                    Topics below {UNLOCK_ACCURACY_PCT}% and the mix-ups behind wrong answers show up here.
                  </EmptyState>
                )
                : (
                  <ul className={styles.focusList} aria-label="Worth another look">
                    {weak.map(w => (
                      <li key={w.name} className={styles.focusRow}>
                        <Badge tone="danger" title={`Right in the topic's last ${RECENT_WINDOW} answers`}>{w.recentPct}%</Badge>
                        <span className={styles.focusText}>
                          <span className={styles.truncate} title={w.name}>{w.name}</span>
                          {w.missed > 0 && <span className={styles.focusMeta}>{w.missed} missed on the latest try</span>}
                        </span>
                        <Button size="sm" variant="ghost" icon={<Dumbbell />} onClick={() => onDrill(w.topicKeys)} aria-label={`Drill ${w.name}`}>
                          Drill
                        </Button>
                      </li>
                    ))}
                    {mixUps.map(m => (
                      <li key={m.tag} className={styles.focusRow} title={m.description}>
                        <Badge tone="warning" title="Wrong answers that point to this mix-up">{m.count}×</Badge>
                        <span className={styles.focusText}>
                          <span><span className={styles.focusMeta}>Mix-up: </span><InlineText text={m.name} /></span>
                          <span className={`${styles.focusMeta} ${styles.clamp}`}><InlineText text={m.description} /></span>
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
            </Card>
          </div>
        </div>
      </div>
      <KeyHints
        className={styles.keys}
        hints={[['ArrowLeft/ArrowRight', 'tabs'], ...(weak.length > 0 ? [['drill', 'drill weak topics'] as [string, string]] : []), ['help', 'all keys']]}
      />
    </>
  );
}
