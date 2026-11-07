import React, { createContext, useContext, useEffect, useId, useMemo, useRef, useState } from 'react';
import { ArrowRight, Lightbulb } from 'lucide-react';
import { Question } from '../../types';
import { isTypingTarget, useShortcut } from '../../keyboard/shortcuts';
import { Button } from './Button';
import { FeedbackBanner, Verdict } from './FeedbackBanner';
import { InlineText } from './InlineText';
import { KeyHints } from './Kbd';
import styles from './QuestionShell.module.css';
import { dialogIsOpen } from './Dialog';

/** Where Next goes and what it is called ("Next exercise", "Finish the lesson"), from the quiz view. */
export interface QuestionNav {
  label: string;
  onNext: () => void;
  /** Said after a miss when the card will be asked again this session. */
  missNote?: string;
}

export const QuestionNavContext = createContext<QuestionNav | null>(null);

/** What the shell offers the answer area inside it. */
export interface QuestionShellApi {
  /** Run the step's main action (check, then Next), as Enter does; false when there is none. */
  primary: () => boolean;
  /** Leave a text box or editor: focus goes to the question, so single keys work again. */
  leave: () => void;
}

export const QuestionShellContext = createContext<QuestionShellApi | null>(null);

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
  /** The word beside its key in the key hints; "check" unless given. */
  keyWord?: string;
}

/** An action with its own key (H or S) and a short note beside its button, e.g. what it costs. */
export interface ShellKeyAction extends ShellAction {
  note?: string;
}

/** A key hint in the footer: the keys ("Space", "Alt+ArrowUp/ArrowDown") and what they do. */
export type KeyHint = [string, string];

interface QuestionShellProps {
  question: Question;
  /** The type, as a badge: "Multiple choice". */
  format: string;
  /** A line under the prompt saying what to do, e.g. how output is typed. */
  task?: React.ReactNode;
  graded: boolean;
  /** The step's main action while answering ("Check answer"); Next replaces it once graded. */
  action?: ShellAction;
  /**
   * The question's hints, shown with H while answering. Several hints come one
   * at a time: each H shows the next, and after the last H hides them.
   */
  hint?: string | readonly string[] | null;
  /** H runs this instead of showing a hint (coding: reveal the next hint tier, which costs credit). */
  hintAction?: ShellKeyAction | null;
  /**
   * The verdict banner. Usually given once graded; a type can show one before
   * that too (a coding check that failed but can be tried again).
   */
  feedback?: ShellFeedback | null;
  /** Shown after a miss once asked for (S). */
  solution?: React.ReactNode;
  /** S runs this instead of showing `solution` (coding: give up, or show the solution beside the code). */
  solutionAction?: ShellKeyAction | null;
  /** Changes when a multi-step question moves on (decide, then justify): focus returns to the answer. */
  stage?: string;
  /** How many options the 1-9 keys pick from, for the key hints. */
  pickCount?: number;
  /** The answer is typed in a text box (Shift+Enter checks). */
  typed?: boolean;
  /** Key hints for the answer area itself (Parsons' list keys), before the check key. */
  keys?: KeyHint[];
  /** A content-heavy type (tables, two option lists, code lines): on a short screen it trades a little air for room. */
  dense?: boolean;
  /** The card takes the whole column and a growing region (an editor) takes the height left. */
  fill?: boolean;
  className?: string;
  children: React.ReactNode;
}

const DIFFICULTY_LABEL: Record<string, string> = { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' };

const FIRST_CONTROL = 'input:not([disabled]):not([type="hidden"]):not([type="radio"]), textarea:not([disabled]), select:not([disabled]), [role="listbox"]:not([aria-disabled="true"])';

/**
 * Focus where answering starts in a question card: the chosen or first
 * option, else the first answer control, else the card itself. On mount, and
 * when a dialog closes over a question that changed while it was open.
 */
export function focusAnswerStart(card: HTMLElement | null) {
  const body = card?.querySelector<HTMLElement>('[data-answer-area]');
  if (!card || !body) return;
  const radio = body.querySelector<HTMLInputElement>('input[type="radio"]:checked:not([disabled])')
    ?? body.querySelector<HTMLInputElement>('input[type="radio"]:not([disabled])');
  const target = radio ?? body.querySelector<HTMLElement>(FIRST_CONTROL) ?? card;
  target.focus({ preventScroll: true });
}

/**
 * Scroll the screen (<main>) just enough to show the verdict banner and the
 * footer under it, or the verdict's top when both do not fit. Where the card
 * fits the screen (a laptop) both are already in view and nothing moves.
 */
function revealBelow(banner: HTMLElement | null, footer: HTMLElement | null) {
  const main = banner?.closest('main');
  if (!banner || !footer || !main) return;
  const view = main.getBoundingClientRect();
  const top = banner.getBoundingClientRect().top;
  const bottom = footer.getBoundingClientRect().bottom;
  if (top >= view.top && bottom <= view.bottom) return;
  main.scrollTop += bottom - top <= view.height ? bottom - view.bottom : top - view.top;
}

/**
 * The frame every question type renders its answer area in: badges and the
 * prompt, the answer, the hint, the banner in a live region, and one footer
 * with the step's action, which becomes Next once graded.
 *
 * It owns the keys of a question (Enter checks then goes Next, Shift+Enter or
 * Ctrl/Cmd+Enter check from a text box, H hint, S solution after a miss, Esc
 * leaves a text box) and focus: the first answer control on mount and on each
 * new step, the banner when it appears.
 */
export function QuestionShell({
  question, format, task, graded, action, hint, hintAction, feedback, solution, solutionAction, stage,
  pickCount, typed = false, keys, dense = false, fill = false, className, children,
}: QuestionShellProps) {
  const nav = useContext(QuestionNavContext);
  const promptId = useId();
  const cardRef = useRef<HTMLElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const [hintsShown, setHintsShown] = useState(0);
  const [solutionOpen, setSolutionOpen] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const hints = useMemo(
    () => (hint == null ? [] : (typeof hint === 'string' ? [hint] : [...hint]).filter(h => h.trim().length > 0)),
    [hint],
  );
  const missed = graded && !!feedback && feedback.verdict !== 'right';
  const canShowSolution = missed && !!solution && !solutionOpen;
  const hasHint = !graded && !hintAction && hints.length > 0;
  const hasFeedback = !!feedback;

  // Focus the first answer control when the question (or its step) appears.
  useEffect(() => {
    if (graded || hasFeedback) return;
    // A question served under an open dialog (a filter change) leaves focus in the dialog.
    if (dialogIsOpen()) return;
    focusAnswerStart(cardRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  // When the banner appears (or the answer is graded): open it smoothly and move focus to it.
  useEffect(() => {
    if (!hasFeedback) { setRevealed(false); return; }
    const frame = requestAnimationFrame(() => setRevealed(true));
    bannerRef.current?.focus({ preventScroll: true });
    return () => cancelAnimationFrame(frame);
  }, [hasFeedback, graded]);

  // Where the screen scrolls (a phone), bring the verdict and Next into view once the banner is open.
  useEffect(() => {
    if (revealed) revealBelow(bannerRef.current, footerRef.current);
  }, [revealed]);

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

  const leave = () => cardRef.current?.focus({ preventScroll: true });

  // The answer area reaches the shell through this; refs keep it stable across renders.
  const primaryRef = useRef(primary);
  primaryRef.current = primary;
  const api = useMemo<QuestionShellApi>(() => ({
    primary: () => primaryRef.current(),
    leave: () => cardRef.current?.focus({ preventScroll: true }),
  }), []);

  const nextHint = () => setHintsShown(n => (n >= hints.length ? 0 : n + 1));

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

  useShortcut('hint', () => {
    if (hintAction) {
      if (hintAction.disabled) return false;
      hintAction.onAction();
      return true;
    }
    nextHint();
    return true;
  }, hasHint || (!!hintAction && !hintAction.disabled));

  useShortcut('solution', () => {
    if (solutionAction) {
      if (solutionAction.disabled) return false;
      solutionAction.onAction();
      return true;
    }
    setSolutionOpen(true);
    return true;
  }, solutionAction ? !solutionAction.disabled : canShowSolution);

  useShortcut('leaveTyping', e => {
    if (!isTypingTarget(e.target) || !inQuestion(e.target)) return false;
    leave();
    return true;
  });

  const hintLabel = hintsShown === 0 ? 'Hint'
    : hintsShown < hints.length ? `Next hint (${hintsShown + 1} of ${hints.length})`
    : hints.length > 1 ? 'Hide hints' : 'Hide hint';

  const showsSolutionKey = solutionAction ? !solutionAction.disabled : canShowSolution;
  const keyHints: KeyHint[] = graded
    ? [['Enter', nav ? 'next' : ''], ...(showsSolutionKey ? [['S', 'solution'] as KeyHint] : [])]
    : [
      ...(keys ?? []),
      ...(pickCount ? [[pickCount > 1 ? `1-${Math.min(pickCount, 9)}` : '1', 'pick'] as KeyHint] : []),
      ...(action ? [[typed ? 'Shift+Enter' : 'Enter', action.keyWord ?? 'check'] as KeyHint] : []),
      ...(hasHint ? [['H', 'hint'] as KeyHint] : []),
    ];

  const meta = (
    <>
      <span>{DIFFICULTY_LABEL[question.difficulty] ?? question.difficulty}</span>
      <span aria-hidden="true" className={styles.dot}>·</span>
      <span>{format}</span>
    </>
  );

  const keyAction = (a: ShellKeyAction, key: string) => (
    <span className={styles.keyAction}>
      <Button variant="ghost" shortcut={key} onClick={a.onAction} disabled={a.disabled}>{a.label}</Button>
      {a.note && <span className={styles.note}>{a.note}</span>}
    </span>
  );

  return (
    <article
      ref={cardRef}
      className={[styles.card, dense ? styles.dense : '', fill ? styles.fill : '', className].filter(Boolean).join(' ')}
      aria-labelledby={promptId}
      tabIndex={-1}
      data-graded={graded || undefined}
    >
      <header className={styles.head}>
        <p className={styles.meta}>{meta}</p>
        <h2 className={styles.prompt} id={promptId}><InlineText text={question.question} /></h2>
        {task && <p className={styles.task}>{task}</p>}
      </header>

      <div className={styles.body} data-answer-area>
        <QuestionShellContext.Provider value={api}>
          {children}
        </QuestionShellContext.Provider>

        {hasHint && hintsShown > 0 && (
          <div className={styles.hint}>
            <Lightbulb className={styles.hintIcon} aria-hidden="true" />
            {hints.length === 1
              ? <span><InlineText text={hints[0]} /></span>
              : (
                <ol className={styles.hintList}>
                  {hints.slice(0, hintsShown).map((h, i) => <li key={i}><InlineText text={h} /></li>)}
                </ol>
              )}
          </div>
        )}
      </div>

      {/* The banner sits between the answer and the footer, outside the
          scrolling body, so it is always in view with Next; a long answer
          area gives up height instead. */}
      <div
        role="status"
        aria-live="polite"
        className={[styles.live, revealed ? styles.liveOpen : ''].filter(Boolean).join(' ')}
      >
        <div className={styles.liveInner}>
          {feedback && (
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

      <footer className={styles.actions} ref={footerRef}>
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
          <Button variant="ghost" shortcut="H" icon={<Lightbulb />} onClick={nextHint} aria-expanded={hintsShown > 0}>
            {hintLabel}
          </Button>
        )}
        {!graded && hintAction && keyAction(hintAction, 'H')}
        {solutionAction
          ? keyAction(solutionAction, 'S')
          : canShowSolution && (
            <Button variant="ghost" shortcut="S" onClick={() => setSolutionOpen(true)}>Show solution</Button>
          )}
        <span className={styles.spacer} />
        {/* On a short screen the difficulty and type move down here, beside the keys. */}
        <span className={styles.footMeta} aria-hidden="true">{meta}</span>
        <KeyHints className={styles.keyHints} hints={[...keyHints.filter(([, label]) => label), ['help', 'keys']]} />
      </footer>
    </article>
  );
}

/**
 * A part of the answer area that gives up height before the card would
 * scroll: it shrinks and scrolls inside itself (a long list of lines). With
 * `grow` it also takes the height left over (an editor in a `fill` card).
 */
export function QuestionRegion({ grow = false, className, children, ...rest }: {
  grow?: boolean;
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={[styles.region, grow ? styles.grow : '', className].filter(Boolean).join(' ')} {...rest}>
      {children}
    </div>
  );
}

/**
 * Side-by-side parts of an answer (code beside the answer box, the editor
 * beside the live preview), as grid columns such as
 * "minmax(0, 1.15fr) minmax(0, 1fr)". One column on a phone.
 */
export function AnswerColumns({ columns, className, children, ...rest }: {
  columns: string;
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={[styles.columns, className].filter(Boolean).join(' ')}
      style={{ '--answer-columns': columns } as React.CSSProperties}
      {...rest}
    >
      {children}
    </div>
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
