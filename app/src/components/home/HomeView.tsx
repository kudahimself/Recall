/**
 * Home: one screen, no scroll on a laptop. Today's session and the section
 * the learner is in on the left; the course, recent activity and what is
 * worth another look on the right. Every number appears once: the session
 * counts in Today, the course totals in the course card, the streak in the
 * top bar.
 */
import React, { useEffect, useRef } from 'react';
import { CheckCircle2, ChevronRight, Dumbbell, InfinityIcon, Lock, Sparkles } from 'lucide-react';
import { Course } from '../../types';
import { COURSE_META } from '../../utils/courseMeta';
import { CourseTotals, CoursePath, FocusArea, FocusMisconception, currentUnitIndex } from '../../utils/coursePath';
import { ExercisesDone } from '../../utils/exercises';
import { ReviewSession, SessionSettings, isSessionDone } from '../../utils/reviewSession';
import { todayReviewCap, UNLOCK_ACCURACY_PCT } from '../../utils/spacedRepetition';
import { useMediaQuery } from '../../utils/useMediaQuery';
import { useFitRows } from '../../utils/useFitRows';
import { useShortcut } from '../../keyboard/shortcuts';
import { Heatmap, HeatmapDay } from '../ui/Heatmap';
import { PathList } from '../PathList';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Card, CardHeader } from '../ui/Card';
import { EmptyState } from '../ui/EmptyState';
import { KeyHints } from '../ui/Kbd';
import { ProgressBar } from '../ui/ProgressBar';
import { Screen } from '../ui/Screen';
import { StatGroup, StatTile } from '../ui/StatTile';
import styles from './Home.module.css';

/** The layout that fits one screen: two columns on a laptop or larger, tall enough to hold them. */
export const HOME_FITS_QUERY = '(min-width: 900px) and (min-height: 600px)';

interface HomeViewProps {
  course: Course;
  session: ReviewSession;
  reviewsLeft: number;
  settings: SessionSettings;
  path: CoursePath;
  totals: CourseTotals;
  activity: HeatmapDay[];
  focus: Array<FocusArea | FocusMisconception>;
  exercisesDone: ExercisesDone;
  onStart: () => void;
  onKeepGoing: () => void;
  onStartLesson: (lessonId: string) => void;
  onRuleCard: (lessonId: string) => void;
  onDrill: (topicKeys: string[]) => void;
  onAllSections: () => void;
  onSettings: () => void;
}

export function HomeView(props: HomeViewProps) {
  const { onStart } = props;
  const fits = useMediaQuery(HOME_FITS_QUERY, false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const done = isSessionDone(props.session);

  // Arriving on Home puts focus on its title, so Tab starts from the top of the screen.
  useEffect(() => { titleRef.current?.focus({ preventScroll: true }); }, []);

  // Enter starts (or carries on) today's session, unless a control has focus.
  useShortcut('startSession', e => {
    if (e.target instanceof HTMLElement && e.target.closest('button, a[href], input, select, textarea, summary')) return false;
    if (done) props.onKeepGoing();
    else onStart();
    return true;
  });

  return (
    <Screen className={[styles.home, fits ? styles.fits : ''].filter(Boolean).join(' ')}>
      <div className={styles.col}>
        <TodayCard {...props} done={done} titleRef={titleRef} />
        <PathCard {...props} fit={fits} />
      </div>
      <div className={styles.col}>
        <CourseCard {...props} />
        <ActivityCard activity={props.activity} />
        <FocusCard focus={props.focus} onDrill={props.onDrill} fit={fits} />
      </div>
      <KeyHints
        className={styles.keys}
        hints={[['startSession', done ? 'keep going' : 'start'], ['goLearn', 'learn'], ['goProgress', 'progress'], ['switchCourse', 'course'], ['goSettings', 'settings'], ['help', 'all keys']]}
      />
    </Screen>
  );
}

function TodayCard({
  session, reviewsLeft, settings, path, done, titleRef, onStart, onKeepGoing, onSettings,
}: HomeViewProps & { done: boolean; titleRef: React.Ref<HTMLHeadingElement> }) {
  const date = new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' });
  const cap = todayReviewCap(settings.size, settings.reviewShare);
  const started = session.answered > 0;
  const lesson = path.nextLesson;
  const nextUnit = path.focus?.units[currentUnitIndex(path.focus, lesson)];
  const plan = done
    ? <>{session.answered} answered, {session.tally.correct} right. Reviews are cleared; what comes due next waits for tomorrow.</>
    : <>
      Due reviews first (up to {cap}), then {lesson
        ? <>the lesson <strong>{lesson.title}</strong> and its {lesson.exercises.length} exercises, then new questions</>
        : <>new questions{nextUnit ? <> from <strong>{nextUnit.displayName}</strong></> : null}</>} and practice on what you have met.
      {session.overflow > 0 && <> {session.overflow} more due review{session.overflow === 1 ? '' : 's'} wait for the next days.</>}
    </>;

  return (
    <Card as="section" className={styles.card} aria-labelledby="home-today">
      <CardHeader
        eyebrow={date}
        title={done ? <span className={styles.doneTitle}><CheckCircle2 aria-hidden="true" />Done for today</span> : "Today's session"}
        titleId="home-today"
        titleRef={titleRef}
        className={styles.todayHead}
        aside={
          <>
            <span>{settings.size} per session, reviews up to {Math.round(settings.reviewShare * 100)}%</span>
            <Button variant="ghost" size="sm" onClick={onSettings} aria-label="Change the session settings">Change</Button>
          </>
        }
      />
      <p className={styles.plan}>{plan}</p>
      <StatGroup>
        <StatTile
          value={reviewsLeft}
          label="reviews left"
          tone={reviewsLeft > 0 ? 'accent' : 'neutral'}
          title="Missed cards and cards past their review interval. Each answered review takes one off."
        />
        <StatTile value={session.freshLeft} label="new and practice left" />
        <StatTile value={session.answered} of={session.size} label="answered today">
          <ProgressBar
            value={(100 * session.answered) / Math.max(1, session.size)}
            label="Today's session"
            valueText={`${session.answered} of ${session.size} answered`}
            tone={done ? 'success' : 'accent'}
            className={styles.tileBar}
          />
        </StatTile>
      </StatGroup>
      <div className={styles.actions}>
        {!done && (
          <Button variant="primary" size="lg" shortcut="Enter" onClick={onStart}>
            {started ? "Continue today's session" : "Start today's session"}
          </Button>
        )}
        <Button variant={done ? 'primary' : 'secondary'} size={done ? 'lg' : 'md'} icon={<InfinityIcon />} onClick={onKeepGoing} shortcut={done ? 'Enter' : undefined}>
          {done ? 'Keep going' : 'Keep going without a limit'}
        </Button>
      </div>
    </Card>
  );
}

function PathCard({ path, exercisesDone, onStartLesson, onRuleCard, onAllSections, fit }: HomeViewProps & { fit: boolean }) {
  const section = path.focus;
  const index = section ? path.sections.indexOf(section) : -1;
  return (
    <Card as="section" className={`${styles.card} ${styles.grow}`} aria-labelledby="home-path">
      <CardHeader
        eyebrow={section ? `Your path · section ${index + 1} of ${path.sections.length}` : 'Your path'}
        title={section ? section.name : 'All caught up'}
        titleId="home-path"
        aside={
          <Button variant="ghost" size="sm" onClick={onAllSections} aria-label="All sections, on Progress">
            All sections
            <ChevronRight aria-hidden="true" className={styles.chevron} />
          </Button>
        }
      />
      {section
        ? (
          <PathList
            units={section.units}
            label={`Topics of ${section.name}`}
            current={currentUnitIndex(section, path.nextLesson)}
            fit={fit}
            nextLesson={path.nextLesson}
            exercisesDone={exercisesDone}
            onStartLesson={onStartLesson}
            onRuleCard={onRuleCard}
            className={styles.path}
          />
        )
        : <EmptyState compact title="Every section is done." icon={<Sparkles />}>Keep going serves reviews and practice.</EmptyState>}
    </Card>
  );
}

function CourseCard({ course, path, totals }: HomeViewProps) {
  const meta = COURSE_META[course];
  const passed = path.sections.filter(s => s.status === 'mastered').length;
  const units = path.sections.flatMap(s => s.units);
  return (
    <Card as="section" className={styles.card} aria-labelledby="home-course">
      <CardHeader icon={<meta.Icon />} eyebrow="Course" title={meta.label} titleId="home-course" />
      <div className={styles.courseLine}>
        <span>{passed} of {path.sections.length} sections passed</span>
        <span className={styles.mono}>{totals.seen.toLocaleString()} / {totals.total.toLocaleString()} seen</span>
      </div>
      <ProgressBar value={totals.coveragePct} tone="course" label={`Questions seen in ${meta.label}`} />
      <StatGroup>
        <StatTile
          value={totals.answered > 0 ? `${totals.recentPct}%` : 'New'}
          label="recent accuracy"
          title="Share right over your latest answers in this course"
        />
        {path.lessons.total > 0
          ? <StatTile value={path.lessons.done} of={path.lessons.total} label="lessons done" />
          : <StatTile value={units.filter(u => u.seen > 0).length} of={units.length} label="topics started" />}
      </StatGroup>
      <p className={styles.gate}>
        <Lock aria-hidden="true" />
        <span>
          {path.nextLocked
            ? <>Next: <strong>{path.nextLocked.name}</strong>, at {UNLOCK_ACCURACY_PCT}% on every topic here.</>
            : 'Every section of this course is open.'}
        </span>
      </p>
    </Card>
  );
}

const DAY_MS = 24 * 60 * 60 * 1000;

function ActivityCard({ activity }: { activity: HeatmapDay[] }) {
  const weekAgo = new Date(Date.now() - 6 * DAY_MS).toISOString().split('T')[0];
  const week = activity.filter(d => d.date >= weekAgo).reduce((n, d) => n + d.count, 0);
  return (
    <Card as="section" className={styles.card} aria-labelledby="home-activity">
      <CardHeader title="Activity" titleId="home-activity" as="h2" aside="last 24 weeks" />
      <Heatmap data={activity} weeks={24} summary={<><strong>{week}</strong> answered in 7 days</>} />
    </Card>
  );
}

function FocusCard({ focus, onDrill, fit }: { focus: Array<FocusArea | FocusMisconception>; onDrill: (keys: string[]) => void; fit: boolean }) {
  const listRef = useRef<HTMLUListElement>(null);
  const shown = useFitRows(listRef, focus.length, fit);
  return (
    <Card as="section" className={`${styles.card} ${styles.grow}`} aria-labelledby="home-focus">
      <CardHeader title="Worth another look" titleId="home-focus" />
      {focus.length === 0
        ? (
          <EmptyState compact icon={<Sparkles />} title="Nothing to flag yet.">
            Topics below {UNLOCK_ACCURACY_PCT}% show up here.
          </EmptyState>
        )
        : (
          <ul className={styles.focus} ref={listRef} aria-label="Worth another look">
            {focus.slice(0, shown).map(f => (f.kind === 'topic'
              ? (
                <li key={f.name} className={styles.focusRow}>
                  <Badge tone="danger">{f.recentPct}%</Badge>
                  <span className={styles.focusText} title={f.name}>
                    {f.name}
                    {f.missed > 0 && <span className={styles.focusMeta}> · {f.missed} missed</span>}
                  </span>
                  <Button variant="secondary" size="sm" icon={<Dumbbell />} onClick={() => onDrill(f.topicKeys)} aria-label={`Drill ${f.name}`}>
                    Drill
                  </Button>
                </li>
              )
              : (
                <li key={f.tag} className={styles.focusRow}>
                  <Badge tone="warning">{f.count}×</Badge>
                  <span className={styles.focusText} title={f.description}>
                    <span className={styles.focusMeta}>Mix-up: </span>{f.name}
                  </span>
                </li>
              )))}
          </ul>
        )}
    </Card>
  );
}
