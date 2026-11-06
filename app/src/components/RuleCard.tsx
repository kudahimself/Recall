/**
 * Lesson screens: the rule card (idea, form, pitfall beside a worked example),
 * the compact rule card that stays beside every exercise and review of the
 * topic (RuleCardPanel), and the lesson's exercise strip (LessonSteps).
 * Content comes from TopicLesson (src/data/lessons/); nothing here stores data.
 */
import React from 'react';
import { ArrowRight, BookOpen, Check, CheckCircle2, X } from 'lucide-react';
import { LessonTable, Question, TopicLesson } from '../types';
import { LessonContext, QUESTION_TYPE_LABEL, proseText } from '../utils/lessons';
import { nonRunnableKind } from '../utils/workedKinds';
import { useShortcut } from '../keyboard/shortcuts';
import { Button } from './ui/Button';
import { Card, Eyebrow } from './ui/Card';
import { CodeBlock } from './ui/CodeBlock';
import { Dialog } from './ui/Dialog';
import { InlineText } from './ui/InlineText';
import { KeyCombo } from './ui/Kbd';
import './RuleCard.css';
import styles from './RulePanel.module.css';

/** Text with `code` spans: the shared renderer. */
function Inline({ text }: { text: string }) {
  return <InlineText text={text} />;
}

function DataTable({ table }: { table: LessonTable }) {
  return (
    <div className="rc-table-wrap">
      <div className="rc-table-name">{table.name}</div>
      <table className="rc-table">
        <thead>
          <tr>{table.columns.map(c => <th key={c}>{c}</th>)}</tr>
        </thead>
        <tbody>
          {table.rows.map((r, i) => (
            <tr key={i}>
              {r.map((v, j) => <td key={j} className={v === null ? 'rc-null' : undefined}>{v === null ? 'NULL' : String(v)}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
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

/** The full rule card: idea, form and pitfall beside a worked example. */
export function RuleCardView({ lesson, byId, context, mode, onStart, onClose }: RuleCardViewProps) {
  const plan = lesson.exercises.map(id => byId.get(id)).filter((q): q is Question => !!q);
  return (
    <div className={`rule-card rule-card-${mode}`} aria-label={`Rule card: ${lesson.title}`}>
      <div className="rc-header">
        {context && (
          <span className="rc-where">
            {context.section} · topic {context.topicIndex} of {context.topicCount}
            <span className="rc-dots" aria-hidden="true">
              {context.sectionDots.map((d, i) => (
                <span key={i} className={`rc-dot${d === true ? ' rc-dot-met' : d === null ? ' rc-dot-current' : ''}`} />
              ))}
            </span>
          </span>
        )}
        <span className="rc-flow">
          Lesson → {plan.length} exercises → ramp{context ? ` (${context.rampSize} questions)` : ''} → review
        </span>
        {mode === 'reopen' && onClose && (
          <Button variant="ghost" size="sm" className="rc-close" onClick={onClose} aria-label="Close the rule card" title="Close (Esc)" icon={<X />} />
        )}
      </div>

      <div className="rc-columns">
        <section className="rc-panel rc-rule">
          <div className="rc-eyebrow">{mode === 'lesson' ? 'New topic' : 'Rule card'}</div>
          <h2 className="rc-title">{lesson.title}</h2>
          {lesson.idea.map((p, i) => <p key={i} className="rc-idea"><Inline text={proseText(p)} /></p>)}
          <div className="rc-label">The form</div>
          <CodeBlock code={lesson.form.code} language={lesson.form.language} />
          <div className="rc-label">Watch out</div>
          <p className="rc-pitfall"><Inline text={proseText(lesson.pitfall)} /></p>
        </section>

        <section className="rc-panel rc-worked">
          <div className="rc-label rc-label-top">Worked example</div>
          {lesson.worked.tables && lesson.worked.tables.length > 0 && (
            <div className="rc-tables">
              {lesson.worked.tables.map(t => <DataTable key={t.name} table={t} />)}
            </div>
          )}
          <CodeBlock code={lesson.worked.code} language={lesson.worked.language} numbered />
          <ol className="rc-steps">
            {lesson.worked.steps.map((s, i) => <li key={i}><Inline text={proseText(s)} /></li>)}
          </ol>
          {lesson.worked.output !== undefined && (
            <>
              <div className="rc-label">Output</div>
              <pre className="rc-output">{lesson.worked.output}</pre>
              <div className="rc-checked">
                <CheckCircle2 size={12} />{' '}
                {lesson.worked.runs === false
                  ? `This example needs ${nonRunnableKind(lesson.worked.code)?.needs ?? 'its own setup'} to run, so its output was checked by hand.`
                  : 'This example is run by check-lessons.js on every test run, and its output matches.'}
              </div>
            </>
          )}
        </section>
      </div>

      <div className="rc-footer">
        <span className="rc-plan">
          Exercises next: {plan.map((q, i) => `${i + 1} ${QUESTION_TYPE_LABEL[q.type]}`).join(' → ')}.
          {' '}Press <KeyCombo combo="R" /> at any time to reopen this card.
        </span>
        {mode === 'lesson' && onStart && (
          <Button variant="primary" size="lg" className="rc-start" onClick={onStart} autoFocus shortcut="Enter">
            Try the exercises
            <ArrowRight aria-hidden="true" size={18} />
          </Button>
        )}
        {mode === 'reopen' && onClose && (
          <Button className="rc-back" onClick={onClose} shortcut="Esc">Back</Button>
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
    <Dialog title={`Rule card: ${props.lesson.title}`} hideTitle size="wide" onClose={props.onClose} bodyClassName="rc-dialog-body">
      <CloseOnR onClose={props.onClose} />
      <RuleCardView {...props} mode="reopen" />
    </Dialog>
  );
}

interface RuleCardPanelProps {
  lesson: TopicLesson;
  /** e.g. "2 more beginner, 5 intermediate, 4 advanced". */
  rampNote: string | null;
  onOpen: () => void;
  onHide: () => void;
  className?: string;
}

/** The compact rule card beside an exercise or a review of the topic. Scrolls inside itself when long. */
export function RuleCardPanel({ lesson, rampNote, onOpen, onHide, className }: RuleCardPanelProps) {
  return (
    <Card as="aside" className={[styles.panel, className].filter(Boolean).join(' ')} aria-label={`Rule card: ${lesson.title}`} padded={false}>
      <div className={styles.head}>
        <Eyebrow className={styles.eyebrow}><BookOpen aria-hidden="true" className={styles.headIcon} />Rule card</Eyebrow>
        <Button variant="ghost" size="sm" onClick={onHide} title="Hide the rule card" aria-label="Hide the rule card">Hide</Button>
      </div>
      <div className={styles.body}>
        <h3 className={styles.title}>{lesson.title}</h3>
        {lesson.idea.slice(0, 2).map((p, i) => <p key={i} className={styles.text}><Inline text={proseText(p)} /></p>)}
        <CodeBlock code={lesson.form.code} language={lesson.form.language} compact hideComments />
        <Eyebrow>Watch out</Eyebrow>
        <p className={styles.text}><Inline text={proseText(lesson.pitfall)} /></p>
        {rampNote && (
          <>
            <Eyebrow>This topic</Eyebrow>
            <p className={`${styles.text} ${styles.muted}`}>{rampNote}</p>
          </>
        )}
      </div>
      <div className={styles.foot}>
        <Button size="sm" block onClick={onOpen} shortcut="R">Open the full rule card</Button>
      </div>
    </Card>
  );
}

interface LessonStepsProps {
  lesson: TopicLesson;
  byId: ReadonlyMap<string, Question>;
  /** Latest answer per question id: true right, false wrong; absent when unanswered. */
  latest: ReadonlyMap<string, boolean>;
  currentId: string | null;
}

/** One box per lesson exercise: done right, missed, current or still to come. */
export function LessonSteps({ lesson, byId, latest, currentId }: LessonStepsProps) {
  return (
    <ol className={styles.steps} aria-label={`Lesson · ${lesson.title}`} style={{ '--steps': lesson.exercises.length } as React.CSSProperties}>
      {lesson.exercises.map((id, i) => {
        const q = byId.get(id);
        const state = id === currentId ? 'current' : latest.has(id) ? (latest.get(id) ? 'right' : 'wrong') : 'todo';
        const type = q ? QUESTION_TYPE_LABEL[q.type] : id;
        const label = type.charAt(0).toUpperCase() + type.slice(1);
        return (
          <li key={id} className={[styles.step, styles[state]].filter(Boolean).join(' ')} aria-current={state === 'current' ? 'step' : undefined}>
            {state === 'right' && <Check className={styles.stepIcon} aria-label="right" />}
            {state === 'wrong' && <X className={styles.stepIcon} aria-label="missed" />}
            <span className={styles.stepNo}>{i + 1}</span>
            <span className={styles.stepLabel}>{label}</span>
          </li>
        );
      })}
    </ol>
  );
}
