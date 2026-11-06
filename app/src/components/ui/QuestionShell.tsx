import React, { createContext, useContext, useEffect, useId, useRef, useState } from 'react';
import { ArrowRight, Lightbulb } from 'lucide-react';
import { Question } from '../../types';
import { isTypingTarget, useShortcut } from '../../keyboard/shortcuts';
import { Button } from './Button';
import { FeedbackBanner, Verdict } from './FeedbackBanner';
import { InlineText } from './InlineText';
import { KeyCombo } from './Kbd';
import styles from './QuestionShell.module.css';

/** Where Next goes and what it is called ("Next exercise", "Finish the lesson"), from the quiz view. */
export interface QuestionNav {
  label: string;
  onNext: () => void;
  /** Said after a miss when the card will be asked again this session. */
  missNote?: string;
}

export const QuestionNavContext = createContext<QuestionNav | null>(null);

export interface ShellFeedback {
  verdict: Verdict;
  /** The verdict word: "Correct", "Not quite". */
  title: string;
  detail?: React.ReactNode;
  /** The explanation and anything shown with it. */
  body?: React.ReactNode;
}

export interface ShellAction {
  label: string;
  onAction: () => void;
  disabled?: boolean;
}

interface QuestionShellProps {
  question: Question;
  /** The type, as a badge: "Multiple choice". */
  format: string;
  /** A line under the prompt saying what to do, e.g. how output is typed. */
  task?: React.ReactNode;
  graded: boolean;
  /** The step's main action while answering ("Check answer"); Next replaces it once graded. */
  action?: ShellAction;
  /** The question's hint, toggled with H while answering. */
  hint?: string | null;
  feedback?: ShellFeedback | null;
  /** Shown after a miss once asked for (S). */
  solution?: React.ReactNode;
  /** Changes when a multi-step question moves on (decide, then justify): focus returns to the answer. */
  stage?: string;
  /** How many options the 1-9 keys pick from, for the key hints. */
  pickCount?: number;
  /** The answer is typed in a text box (Shift+Enter checks). */
  typed?: boolean;
  /** A content-heavy type (tables, two option lists, code lines): on a short screen it trades a little air for room. */
  dense?: boolean;
  className?: string;
  children: React.ReactNode;
}

const DIFFICULTY_LABEL: Record<string, string> = { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' };

const FIRST_CONTROL = 'input:not([disabled]):not([type="hidden"]):not([type="radio"]), textarea:not([disabled]), select:not([disabled])';

/**
 * The frame every question type renders its answer area in: badges and the
 * prompt, the answer, the hint, the graded banner in a live region, and one
 * footer with the step's action, which becomes Next once graded.
 *
 * It owns the keys of a question (Enter checks then goes Next, Shift+Enter or
 * Ctrl/Cmd+Enter check from a text box, H hint, S solution after a miss, Esc
 * leaves a text box) and focus: the first answer control on mount and on each
 * new step, the banner once graded.
 */
export function QuestionShell({
  question, format, task, graded, action, hint, feedback, solution, stage,
  pickCount, typed = false, dense = false, className, children,
}: QuestionShellProps) {
  const nav = useContext(QuestionNavContext);
  const promptId = useId();
  const cardRef = useRef<HTMLElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const [hintOpen, setHintOpen] = useState(false);
  const [solutionOpen, setSolutionOpen] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const missed = graded && !!feedback && feedback.verdict !== 'right';
  const canShowSolution = missed && !!solution && !solutionOpen;
  const hasHint = !graded && !!hint;

  // Focus the first answer control when the question (or its step) appears.
  useEffect(() => {
    if (graded) return;
    const body = bodyRef.current;
    if (!body) return;
    const radio = body.querySelector<HTMLInputElement>('input[type="radio"]:checked:not([disabled])')
      ?? body.querySelector<HTMLInputElement>('input[type="radio"]:not([disabled])');
    const target = radio ?? body.querySelector<HTMLElement>(FIRST_CONTROL) ?? cardRef.current;
    target?.focus({ preventScroll: true });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  // Once graded: open the banner smoothly and move focus to it.
  useEffect(() => {
    if (!graded) { setRevealed(false); return; }
    const frame = requestAnimationFrame(() => setRevealed(true));
    bannerRef.current?.focus({ preventScroll: true });
    return () => cancelAnimationFrame(frame);
  }, [graded]);

  const inQuestion = (target: EventTarget | null) =>
    !(target instanceof Node) || target === document.body || !!cardRef.current?.contains(target);

  const primary = () => {
    if (graded) {
      if (!nav) return false;
      nav.onNext();
      return true;
    }
    if (!action || action.disabled) return false;
    action.onAction();
    return true;
  };

  useShortcut('submit', e => {
    const t = e.target;
    if (!inQuestion(t)) return false;
    // A focused button or link does its own thing on Enter.
    if (t instanceof HTMLElement && t.closest('button, a[href], summary')) return false;
    // Enter on a radio that is not chosen yet chooses it first.
    if (!graded && t instanceof HTMLInputElement && t.type === 'radio' && !t.checked) {
      t.click();
      return true;
    }
    // Enter on an answer checkbox toggles it, like Space.
    if (t instanceof HTMLInputElement && t.type === 'checkbox' && !t.disabled) {
      t.click();
      return true;
    }
    return primary();
  });

  useShortcut('submitTyping', e => (inQuestion(e.target) ? primary() : false));

  useShortcut('hint', () => { setHintOpen(o => !o); }, hasHint);

  useShortcut('solution', () => { setSolutionOpen(true); }, canShowSolution);

  useShortcut('leaveTyping', e => {
    if (!isTypingTarget(e.target) || !inQuestion(e.target)) return false;
    cardRef.current?.focus({ preventScroll: true });
    return true;
  });

  const keyHints: Array<[string, string]> = graded
    ? [['Enter', nav ? 'next' : ''], ...(canShowSolution ? [['S', 'solution'] as [string, string]] : [])]
    : [
      ...(pickCount ? [[pickCount > 1 ? `1-${Math.min(pickCount, 9)}` : '1', 'pick'] as [string, string]] : []),
      [typed ? 'Shift+Enter' : 'Enter', 'check'],
      ...(hasHint ? [['H', 'hint'] as [string, string]] : []),
    ];

  const meta = (
    <>
      <span>{DIFFICULTY_LABEL[question.difficulty] ?? question.difficulty}</span>
      <span aria-hidden="true" className={styles.dot}>·</span>
      <span>{format}</span>
    </>
  );

  return (
    <article
      ref={cardRef}
      className={[styles.card, dense ? styles.dense : '', className].filter(Boolean).join(' ')}
      aria-labelledby={promptId}
      tabIndex={-1}
      data-graded={graded || undefined}
    >
      <header className={styles.head}>
        <p className={styles.meta}>{meta}</p>
        <h2 className={styles.prompt} id={promptId}><InlineText text={question.question} /></h2>
        {task && <p className={styles.task}>{task}</p>}
      </header>

      <div className={styles.body} ref={bodyRef}>
        {children}

        {hasHint && hintOpen && (
          <div className={styles.hint}>
            <Lightbulb className={styles.hintIcon} aria-hidden="true" />
            <span><InlineText text={hint as string} /></span>
          </div>
        )}
      </div>

      {/* The verdict sits between the answer and the footer, outside the
          scrolling body, so it is always in view with Next; a long answer
          area gives up height instead. */}
      <div
        role="status"
        aria-live="polite"
        className={[styles.live, revealed ? styles.liveOpen : ''].filter(Boolean).join(' ')}
      >
        <div className={styles.liveInner}>
          {graded && feedback && (
            <FeedbackBanner
              ref={bannerRef}
              verdict={feedback.verdict}
              title={feedback.title}
              detail={feedback.detail ?? (missed ? nav?.missNote : undefined)}
            >
              {feedback.body}
              {solutionOpen && solution && <div className={styles.solution}>{solution}</div>}
            </FeedbackBanner>
          )}
        </div>
      </div>

      <footer className={styles.actions}>
        {graded
          ? nav && (
            <Button variant="primary" shortcut="Enter" onClick={nav.onNext} className={styles.primary}>
              {nav.label}
              <ArrowRight className={styles.arrow} aria-hidden="true" />
            </Button>
          )
          : action && (
            <Button variant="primary" shortcut={typed ? 'Shift+Enter' : 'Enter'} onClick={action.onAction} disabled={action.disabled} className={styles.primary}>
              {action.label}
            </Button>
          )}
        {hasHint && (
          <Button variant="ghost" shortcut="H" icon={<Lightbulb />} onClick={() => setHintOpen(o => !o)} aria-expanded={hintOpen}>
            {hintOpen ? 'Hide hint' : 'Hint'}
          </Button>
        )}
        {canShowSolution && (
          <Button variant="ghost" shortcut="S" onClick={() => setSolutionOpen(true)}>Show solution</Button>
        )}
        <span className={styles.spacer} />
        {/* On a short screen the difficulty and type move down here, beside the keys. */}
        <span className={styles.footMeta} aria-hidden="true">{meta}</span>
        <span className={styles.keyHints} aria-hidden="true">
          {keyHints.filter(([, label]) => label).map(([k, label]) => (
            <span key={k + label} className={styles.keyHint}>
              {k.includes('-') && !k.includes('+')
                ? <><KeyCombo combo={k.split('-')[0]} />-<KeyCombo combo={k.split('-')[1]} /></>
                : <KeyCombo combo={k} />}
              {label}
            </span>
          ))}
          <span className={styles.keyHint}><KeyCombo combo="?" />keys</span>
        </span>
      </footer>
    </article>
  );
}

/**
 * A stable shuffle seeded by the question id, so options never sit in the
 * authored order (the right one first) but stay put across re-renders.
 */
export function seededOrder<T>(items: readonly T[], seedText: string): T[] {
  let seed = 0;
  for (let i = 0; i < seedText.length; i++) seed = ((seed << 5) - seed + seedText.charCodeAt(i)) | 0;
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    seed = (seed * 1664525 + 1013904223) | 0;
    const j = (seed >>> 0) % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
