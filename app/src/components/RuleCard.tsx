/**
 * Lesson screens: the rule card (idea, form, pitfall beside a worked example),
 * the column beside every exercise and review of a topic (RuleCardPanel, or
 * TopicPanel for a topic without a rule card), and the lesson's exercise row
 * (LessonSteps). Content comes from TopicLesson (src/data/lessons/); nothing
 * here stores data.
 */
import React, { useEffect, useRef } from 'react';
import { ArrowRight, BookOpen, CheckCircle2, Info, X } from 'lucide-react';
import { Question, TopicLesson } from '../types';
import { LessonContext, proseText } from '../utils/lessons';
import { QUESTION_FORMAT } from '../utils/questionFormat';
import { nonRunnableKind } from '../utils/workedKinds';
import { useShortcut } from '../keyboard/shortcuts';
import { DataTables } from './DataTables';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Card, Eyebrow } from './ui/Card';
import { CodeBlock } from './ui/CodeBlock';
import { Dialog, dialogIsOpen } from './ui/Dialog';
import { InlineText } from './ui/InlineText';
import { KeyCombo } from './ui/Kbd';
import { StatGroup, StatTile } from './ui/StatTile';
import { StepList, StepState } from './ui/StepList';
import styles from './RuleCard.module.css';

const cx = (...names: Array<string | false | undefined>) => names.filter(Boolean).join(' ');

/** Text with `code` spans and paragraphs written one sentence per line. */
function Prose({ text, className }: { text: string; className?: string }) {
  return <p className={className}><InlineText text={proseText(text)} /></p>;
}

interface RuleCardViewProps {
  lesson: TopicLesson;
  byId: ReadonlyMap<string, Question>;
  context?: LessonContext;
  /** 'lesson': first time, leads into the exercises. 'reopen': read again, then close. */
  mode: 'lesson' | 'reopen';
  onStart?: () => void;
  onClose?: () => void;
}

/** Where the topic sits in its section: "topic 2 of 8" and one dot per topic. */
function SectionDots({ context }: { context: LessonContext }) {
  return (
    <span className={styles.where}>
      {context.section} · topic {context.topicIndex} of {context.topicCount}
      <span className={styles.dots} aria-hidden="true">
        {context.sectionDots.map((d, i) => (
          <span key={i} className={cx(styles.dot, d === true && styles.dotMet, d === null && styles.dotCurrent)} />
        ))}
      </span>
    </span>
  );
}

/** The full rule card: idea, form and pitfall beside a worked example. */
export function RuleCardView({ lesson, byId, context, mode, onStart, onClose }: RuleCardViewProps) {
  const plan = lesson.exercises.map(id => byId.get(id)).filter((q): q is Question => !!q);
  // The lesson's card takes focus on its Start button, unless it appeared under a dialog (a filter change).
  const startRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!dialogIsOpen()) startRef.current?.focus({ preventScroll: true });
  }, []);
  const worked = lesson.worked;
  return (
    <div className={styles.card} aria-label={`Rule card: ${lesson.title}`} data-rule-card={mode}>
      {mode === 'reopen' && (
        <div className={styles.head}>
          {context && <SectionDots context={context} />}
          {onClose && (
            <Button variant="ghost" size="sm" className={styles.close} onClick={onClose} aria-label="Close the rule card" title="Close (Esc)" icon={<X />} />
          )}
        </div>
      )}

      <div className={styles.columns}>
        <Card as="section" className={styles.column}>
          <Eyebrow>
            {mode === 'lesson' ? 'New topic' : 'Rule card'}
            {mode === 'lesson' && context && ` · ${context.topicIndex} of ${context.topicCount} in ${context.section}`}
          </Eyebrow>
          <h2 className={styles.title}>{lesson.title}</h2>
          {lesson.idea.map((p, i) => <Prose key={i} text={p} className={styles.text} />)}
          <Eyebrow className={styles.label}>The form</Eyebrow>
          <CodeBlock code={lesson.form.code} language={lesson.form.language} />
          <Eyebrow className={styles.label}>Watch out</Eyebrow>
          <Prose text={lesson.pitfall} className={styles.text} />
        </Card>

        <Card as="section" className={styles.column}>
          <Eyebrow>Worked example</Eyebrow>
          <DataTables tables={worked.tables} />
          <CodeBlock code={worked.code} language={worked.language} numbered />
          <ol className={styles.walk}>
            {worked.steps.map((s, i) => <li key={i}><InlineText text={proseText(s)} /></li>)}
          </ol>
          {worked.output !== undefined && (
            <>
              <CodeBlock code={worked.output} label="Output" />
              <p className={styles.checked}>
                <CheckCircle2 aria-hidden="true" className={styles.checkedIcon} />
                {worked.runs === false
                  ? `This example needs ${nonRunnableKind(worked.code)?.needs ?? 'its own setup'} to run, so its output was checked by hand.`
                  : 'Checked: this example runs and prints exactly this.'}
              </p>
            </>
          )}
        </Card>
      </div>

      <div className={styles.foot}>
        <p className={styles.plan}>
          {mode === 'lesson'
            ? <>Next: the {plan.length} exercises above, then the rest of the topic in your sessions{context ? ` (${context.rampSize} questions in all)` : ''}.</>
            : <>Its exercises: {plan.map(q => QUESTION_FORMAT[q.type]).join(', ')}.</>}
          {' '}Press <KeyCombo combo="R" /> at any time to {mode === 'lesson' ? 'reopen' : 'close'} this card.
        </p>
        {mode === 'lesson' && onStart && (
          <Button ref={startRef} variant="primary" size="lg" onClick={onStart} shortcut="Enter" data-primary-action>
            Try the exercises
            <ArrowRight aria-hidden="true" size={18} />
          </Button>
        )}
        {mode === 'reopen' && onClose && (
          <Button onClick={onClose} shortcut="Esc">Back</Button>
        )}
      </div>
    </div>
  );
}

/** R again closes the reopened card (bound inside the dialog's key layer). */
function CloseOnR({ onClose }: { onClose: () => void }) {
  useShortcut('ruleCard', () => onClose());
  return null;
}

/** The rule card reopened over whatever is on screen (R): a dialog that holds focus and gives it back. */
export function RuleCardOverlay(props: Omit<RuleCardViewProps, 'mode'> & { onClose: () => void }) {
  return (
    <Dialog title={`Rule card: ${props.lesson.title}`} hideTitle size="wide" onClose={props.onClose} bodyClassName={styles.dialogBody}>
      <CloseOnR onClose={props.onClose} />
      <RuleCardView {...props} mode="reopen" />
    </Dialog>
  );
}

/** How the learner stands on the topic on screen. */
export interface TopicStats {
  seen: number;
  total: number;
  /** Recent accuracy in percent, or null until there are enough answers. */
  recent: number | null;
  /** Measured difficulty ("easy", "medium", "hard"), or null until graded. */
  level: string | null;
}

/** The topic's level, measured from the learner's answers once there are enough. */
function LevelBadge({ level }: { level: string | null }) {
  return level ? <Badge title="Measured from your answers in this topic">{level}</Badge> : null;
}

function TopicStatsView({ stats }: { stats: TopicStats }) {
  return (
    <StatGroup className={styles.stats}>
      <StatTile value={stats.seen} of={stats.total} label="questions seen" />
      <StatTile
        value={stats.recent === null ? 'New' : `${stats.recent}%`}
        label={stats.recent === null ? 'not scored yet' : 'right lately'}
        title={stats.recent === null ? 'Recent accuracy shows once the topic has a few answers.' : 'Right answers among your recent ones in this topic.'}
      />
    </StatGroup>
  );
}

interface SidePanelProps {
  label: string;
  eyebrow: string;
  icon: React.ReactNode;
  onHide: () => void;
  children: React.ReactNode;
  foot?: React.ReactNode;
  className?: string;
}

/** The column beside the question: a card with a head (and Hide), a body that scrolls, and an optional foot. */
function SidePanel({ label, eyebrow, icon, onHide, children, foot, className }: SidePanelProps) {
  return (
    <Card as="aside" className={cx(styles.panel, className)} aria-label={label} padded={false}>
      <div className={styles.panelHead}>
        <Eyebrow className={styles.panelEyebrow}><span className={styles.panelIcon} aria-hidden="true">{icon}</span>{eyebrow}</Eyebrow>
        <Button variant="ghost" size="sm" onClick={onHide} title="Hide this panel" aria-label="Hide the panel beside the question">Hide</Button>
      </div>
      <div className={styles.panelBody}>{children}</div>
      {foot && <div className={styles.panelFoot}>{foot}</div>}
    </Card>
  );
}

interface RuleCardPanelProps {
  lesson: TopicLesson;
  /** e.g. "2 more beginner, 5 intermediate, 4 advanced". */
  rampNote: string | null;
  stats: TopicStats;
  onOpen: () => void;
  onHide: () => void;
  className?: string;
}

/** The compact rule card beside an exercise or a review of the topic. Scrolls inside itself when long. */
export function RuleCardPanel({ lesson, rampNote, stats, onOpen, onHide, className }: RuleCardPanelProps) {
  return (
    <SidePanel
      label={`Rule card: ${lesson.title}`}
      eyebrow="Rule card"
      icon={<BookOpen />}
      onHide={onHide}
      className={className}
      foot={<Button size="sm" block onClick={onOpen} shortcut="R">Open the full rule card</Button>}
    >
      <h3 className={styles.panelTitle}>{lesson.title}</h3>
      {lesson.idea.slice(0, 2).map((p, i) => <Prose key={i} text={p} className={styles.panelText} />)}
      <CodeBlock code={lesson.form.code} language={lesson.form.language} compact hideComments />
      <Eyebrow>Watch out</Eyebrow>
      <Prose text={lesson.pitfall} className={styles.panelText} />
      <div className={styles.statsHead}>
        <Eyebrow>This topic</Eyebrow>
        <LevelBadge level={stats.level} />
      </div>
      <TopicStatsView stats={stats} />
      {rampNote && <p className={cx(styles.panelText, styles.muted)}>{rampNote}</p>}
    </SidePanel>
  );
}

interface TopicPanelProps {
  topic: string;
  section?: string;
  stats: TopicStats;
  onHide: () => void;
  className?: string;
}

/** Beside a question whose topic has no rule card: the topic and how it stands, so the question keeps its place. */
export function TopicPanel({ topic, section, stats, onHide, className }: TopicPanelProps) {
  return (
    <SidePanel label={`This topic: ${topic}`} eyebrow="This topic" icon={<Info />} onHide={onHide} className={className}>
      <h3 className={styles.panelTitle}>{topic}</h3>
      <div className={styles.statsHead}>
        {section && <p className={cx(styles.panelText, styles.muted)}>{section}</p>}
        <LevelBadge level={stats.level} />
      </div>
      <TopicStatsView stats={stats} />
      <p className={cx(styles.panelText, styles.muted)}>
        This topic has no rule card: its questions build it up from beginner to advanced.
      </p>
    </SidePanel>
  );
}

interface LessonStepsProps {
  lesson: TopicLesson;
  byId: ReadonlyMap<string, Question>;
  /** Latest answer per question id: true right, false wrong; absent when unanswered. */
  latest: ReadonlyMap<string, boolean>;
  /** The exercise on screen; null on the rule card before the exercises. */
  currentId: string | null;
}

/** The lesson's exercise row: one step per exercise, done right, missed, current or still to come. */
export function LessonSteps({ lesson, byId, latest, currentId }: LessonStepsProps) {
  const steps = lesson.exercises.map(id => {
    const q = byId.get(id);
    const state: StepState = id === currentId ? 'current' : latest.has(id) ? (latest.get(id) ? 'right' : 'wrong') : 'todo';
    return { id, label: q ? QUESTION_FORMAT[q.type] : id, state };
  });
  return <StepList steps={steps} label={`Lesson · ${lesson.title}`} noun="exercise" />;
}
