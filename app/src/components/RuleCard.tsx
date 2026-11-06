/**
 * Lesson screens: the rule card (idea, form, pitfall beside a worked example),
 * the compact rule card that stays beside every exercise and review of the
 * topic (RuleCardPanel), and the lesson's exercise strip (LessonSteps).
 * Content comes from TopicLesson (src/data/lessons/); nothing here stores data.
 */
import React from 'react';
import { ArrowRight, BookOpen, CheckCircle2, X } from 'lucide-react';
import { CodeLanguage, LessonTable, Question, TopicLesson } from '../types';
import { LessonContext, QUESTION_TYPE_LABEL, proseText } from '../utils/lessons';
import { nonRunnableKind } from '../utils/workedKinds';
import './RuleCard.css';

/** Text with `code` spans. */
export function Inline({ text }: { text: string }) {
  const parts = text.split('`');
  return (
    <>
      {parts.map((p, i) => (i % 2 === 1
        ? <code key={i} className="rc-inline-code">{p}</code>
        : <React.Fragment key={i}>{p}</React.Fragment>))}
    </>
  );
}

/** Split a code line into its code and its trailing comment, ignoring markers inside quotes. */
function splitComment(line: string, language: CodeLanguage): [string, string] {
  const marker = language === CodeLanguage.PYTHON ? '#' : '--';
  let quote: string | null = null;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (quote) {
      if (c === quote) quote = null;
      continue;
    }
    if (c === "'" || c === '"') { quote = c; continue; }
    if (line.startsWith(marker, i)) return [line.slice(0, i), line.slice(i)];
  }
  return [line, ''];
}

export function CodeBlock({ code, language, numbered = false }: { code: string; language: CodeLanguage; numbered?: boolean }) {
  return (
    <pre className={`rc-codeblock${numbered ? ' rc-codeblock-numbered' : ''}`}>
      <code>
        {code.split(/\r?\n/).map((line, i) => {
          const [body, comment] = splitComment(line, language);
          return (
            <span className="rc-line" key={i}>
              {numbered && <span className="rc-ln" aria-hidden="true">{i + 1}</span>}
              <span className="rc-line-text">
                {body}
                {comment && <span className="rc-comment">{comment}</span>}
                {!body && !comment ? ' ' : null}
              </span>
            </span>
          );
        })}
      </code>
    </pre>
  );
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
          <button className="rc-close" onClick={onClose} aria-label="Close the rule card" title="Close (Esc)">
            <X size={16} />
          </button>
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
          {' '}Press <kbd>R</kbd> at any time to reopen this card.
        </span>
        {mode === 'lesson' && onStart && (
          <button className="start-button rc-start" onClick={onStart} autoFocus>
            Try the exercises <kbd>Enter</kbd>
            <ArrowRight className="start-button-icon" size={18} />
          </button>
        )}
        {mode === 'reopen' && onClose && (
          <button className="hero-link-btn rc-back" onClick={onClose}>
            Back <kbd>Esc</kbd>
          </button>
        )}
      </div>
    </div>
  );
}

/** The rule card reopened over whatever is on screen (R). */
export function RuleCardOverlay(props: Omit<RuleCardViewProps, 'mode'> & { onClose: () => void }) {
  return (
    <div className="rc-overlay" role="dialog" aria-modal="true" onClick={e => { if (e.target === e.currentTarget) props.onClose(); }}>
      <RuleCardView {...props} mode="reopen" />
    </div>
  );
}

interface RuleCardPanelProps {
  lesson: TopicLesson;
  /** e.g. "2 more beginner, 5 intermediate, 4 advanced". */
  rampNote: string | null;
  onOpen: () => void;
  onHide: () => void;
}

/** The compact rule card beside an exercise or a review of the topic. */
export function RuleCardPanel({ lesson, rampNote, onOpen, onHide }: RuleCardPanelProps) {
  return (
    <aside className="rule-panel" aria-label={`Rule card: ${lesson.title}`}>
      <div className="rp-head">
        <span className="rp-title"><BookOpen size={13} /> Rule card · {lesson.title}</span>
        <button className="rp-hide" onClick={onHide} title="Hide the rule card" aria-label="Hide the rule card"><X size={14} /></button>
      </div>
      <div className="rc-label">The idea</div>
      {lesson.idea.slice(0, 2).map((p, i) => <p key={i} className="rp-text"><Inline text={proseText(p)} /></p>)}
      <div className="rc-label">The form</div>
      <CodeBlock code={lesson.form.code} language={lesson.form.language} />
      <div className="rc-label">Watch out</div>
      <p className="rp-text"><Inline text={proseText(lesson.pitfall)} /></p>
      {rampNote && (
        <>
          <div className="rc-label">This topic</div>
          <p className="rp-text rp-muted">{rampNote}</p>
        </>
      )}
      <button className="hero-link-btn rp-open" onClick={onOpen}>
        Open the full rule card <kbd>R</kbd>
      </button>
    </aside>
  );
}

interface LessonStepsProps {
  lesson: TopicLesson;
  byId: ReadonlyMap<string, Question>;
  /** Latest answer per question id: true right, false wrong; absent when unanswered. */
  latest: ReadonlyMap<string, boolean>;
  currentId: string | null;
}

/** "Lesson · Joins, exercise 2 of 5" and one box per exercise. */
export function LessonSteps({ lesson, byId, latest, currentId }: LessonStepsProps) {
  const idx = currentId ? lesson.exercises.indexOf(currentId) : -1;
  const current = idx >= 0 ? byId.get(lesson.exercises[idx]) : undefined;
  return (
    <div className="lesson-steps" aria-label="Lesson exercises">
      <div className="ls-head">
        <span className="ls-title">Lesson · {lesson.title}</span>
        {current && (
          <span className="ls-sub">exercise {idx + 1} of {lesson.exercises.length} · {QUESTION_TYPE_LABEL[current.type]}</span>
        )}
      </div>
      <ol className="ls-strip">
        {lesson.exercises.map((id, i) => {
          const q = byId.get(id);
          const state = id === currentId ? 'current' : latest.has(id) ? (latest.get(id) ? 'right' : 'wrong') : 'todo';
          return (
            <li key={id} className={`ls-step ls-step-${state}`}>
              {i + 1} · {q ? QUESTION_TYPE_LABEL[q.type] : id}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
