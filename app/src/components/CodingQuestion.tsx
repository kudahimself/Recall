import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import { RotateCcw } from 'lucide-react';
import { CodingQuestion as CQQuestion, CodeLanguage, Topic, AnswerMeta } from '../types';
import { gradeCodingSubmission, ValidationResult, ValidationVerdict } from '../utils/codeValidator';
import { CREDIT_CORRECT_THRESHOLD } from '../utils/spacedRepetition';
import { validateByComputedStyle } from '../utils/computedStyleValidator';
import { SHORTCUTS } from '../keyboard/shortcuts';
import { DataTables } from './DataTables';
import { Button } from './ui/Button';
import { CodeBlock, languageLabel } from './ui/CodeBlock';
import { ResultItem, ResultList } from './ui/FeedbackBanner';
import { Prose } from './ui/InlineText';
import { KeyCombo } from './ui/Kbd';
import { OptionList } from './ui/OptionList';
import { AnswerColumns, QuestionRegion, QuestionShell, QuestionShellContext, ShellFeedback, ShellKeyAction } from './ui/QuestionShell';
import { LivePreview } from './visual/LivePreview';
import styles from './CodingQuestion.module.css';

// The retry loop is a small state machine. `editing` is the classic pre-submit
// state; a failed check on a tiered-hints question goes to `review-fail` (try
// again, spend a hint tier, or give up); an uncertain verdict goes to
// `awaiting-self-grade`; any terminal outcome (pass, give-up, untiered fail)
// lands on `done`.
type Phase = 'editing' | 'review-fail' | 'awaiting-self-grade' | 'done';

interface Props {
  question: CQQuestion;
  onAnswer: (isCorrect: boolean, meta?: AnswerMeta) => void;
  // Called once, on the first failed check that opens the retry step, so the
  // miss counts for scheduling while the learner can still retry.
  onFirstMiss?: (meta?: AnswerMeta) => void;
  showHints: boolean;
  // Partial-credit this pass would earn per hint tier [none, signature, skeleton],
  // supplied by the SR engine so the retry step can show the cost before a reveal.
  hintCreditSchedule?: readonly [number, number, number];
}

const MONACO_LANGUAGE: Record<string, string> = {
  [CodeLanguage.PYTHON]: 'python',
  [CodeLanguage.SQL]: 'sql',
  [CodeLanguage.JAVASCRIPT]: 'javascript',
  [CodeLanguage.TYPESCRIPT]: 'typescript',
  [CodeLanguage.JSX]: 'javascript',
  [CodeLanguage.HTML]: 'html',
  [CodeLanguage.CSS]: 'css',
};

const THEME = 'recall-night';

/** A design token's value as a Monaco colour (#rrggbb or #rrggbbaa), read from the page. */
function tokenColour(name: string): string | undefined {
  if (typeof window === 'undefined') return undefined;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  if (/^#[0-9a-f]{6}([0-9a-f]{2})?$/i.test(value)) return value;
  if (/^#[0-9a-f]{3}$/i.test(value)) return `#${value.slice(1).split('').map(c => c + c).join('')}`;
  const rgb = value.match(/^rgba?\(([^)]+)\)$/i);
  if (!rgb) return undefined;
  const [r, g, b, a = 1] = rgb[1].split(',').map(part => parseFloat(part));
  const hex = (n: number) => Math.round(n).toString(16).padStart(2, '0');
  return `#${hex(r)}${hex(g)}${hex(b)}${a < 1 ? hex(a * 255) : ''}`;
}

/** A design token's length in pixels (rem and px), for Monaco's font size. */
function tokenPx(name: string, fallback: number): number {
  if (typeof window === 'undefined') return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const n = parseFloat(value);
  if (!Number.isFinite(n)) return fallback;
  if (value.endsWith('rem')) return n * (parseFloat(getComputedStyle(document.documentElement).fontSize) || 16);
  return n;
}

/** The editor theme, built from the same tokens as every code block, so the editor is not a second palette. */
function defineTheme(monaco: Monaco) {
  const fg = (name: string) => tokenColour(name)?.slice(1, 7);
  const rules = ([
    ['comment', '--code-com', 'italic'],
    ['keyword', '--code-kw'],
    ['string', '--code-str'],
    ['number', '--code-num'],
    ['type', '--code-fn'],
    ['function', '--code-fn'],
    ['tag', '--code-kw'],
    ['attribute.name', '--code-fn'],
    ['delimiter', '--text-2'],
  ] as Array<[string, string, string?]>)
    .map(([token, name, fontStyle]) => ({ token, foreground: fg(name), fontStyle }))
    .filter(rule => rule.foreground);
  const colours: Record<string, string | undefined> = {
    'editor.background': tokenColour('--code-bg'),
    'editor.foreground': tokenColour('--text'),
    'editor.lineHighlightBackground': tokenColour('--surface'),
    'editor.lineHighlightBorder': tokenColour('--surface'),
    'editor.selectionBackground': tokenColour('--selection'),
    'editorCursor.foreground': tokenColour('--focus'),
    'editorLineNumber.foreground': tokenColour('--text-3'),
    'editorLineNumber.activeForeground': tokenColour('--text'),
    'editorWhitespace.foreground': tokenColour('--border'),
    'editorIndentGuide.background1': tokenColour('--border'),
    'editorIndentGuide.activeBackground1': tokenColour('--border-strong'),
    'editorWidget.background': tokenColour('--raised'),
    'editorWidget.border': tokenColour('--border-strong'),
    'editorSuggestWidget.background': tokenColour('--raised'),
    'editorSuggestWidget.border': tokenColour('--border-strong'),
    'editorSuggestWidget.selectedBackground': tokenColour('--accent'),
    focusBorder: tokenColour('--focus'),
  };
  monaco.editor.defineTheme(THEME, {
    base: 'vs-dark',
    inherit: true,
    rules: rules as Array<{ token: string; foreground: string; fontStyle?: string }>,
    colors: Object.fromEntries(Object.entries(colours).filter(([, v]) => v)) as Record<string, string>,
  });
}

/** A registry key spec ("Shift+Enter", "Mod+Enter", "Esc") as a Monaco keybinding. */
function monacoKey(monaco: Monaco, spec: string): number {
  return spec.split('+').reduce((bits, part) => {
    if (part === 'Mod') return bits | monaco.KeyMod.CtrlCmd;
    if (part === 'Shift') return bits | monaco.KeyMod.Shift;
    if (part === 'Alt') return bits | monaco.KeyMod.Alt;
    if (part === 'Esc') return bits | monaco.KeyCode.Escape;
    return bits | (monaco.KeyCode as unknown as Record<string, number>)[part];
  }, 0);
}

// Esc leaves the editor only when nothing inside it would close first.
const LEAVE_WHEN = '!suggestWidgetVisible && !findWidgetVisible && !inSnippetMode && !parameterHintsVisible && !editorHasMultipleSelections';

interface CodeEditorProps {
  questionId: string;
  language: CodeLanguage;
  value: string;
  onChange: (value: string) => void;
  readOnly: boolean;
  /** Shift+Enter or Ctrl/Cmd+Enter in the editor; return false to let the question's main action run. */
  onCheck: () => boolean;
  onReset?: () => void;
  editorRef: React.MutableRefObject<any>;
}

/**
 * Monaco inside the question: the night theme from the tokens, the code font
 * and size of every code block, no minimap. Tab indents; Esc leaves (unless a
 * suggestion, find or snippet is open); Shift+Enter and Ctrl/Cmd+Enter check.
 * The keys come from the shortcut registry, so the help overlay lists them.
 */
function CodeEditor({ questionId, language, value, onChange, readOnly, onCheck, onReset, editorRef }: CodeEditorProps) {
  const shell = useContext(QuestionShellContext);
  // Monaco registers its commands once, at mount: they call through refs.
  const checkRef = useRef(onCheck);
  checkRef.current = onCheck;
  const shellRef = useRef(shell);
  shellRef.current = shell;
  const boxRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<ResizeObserver | null>(null);
  const focusTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  // Set once the editor has had focus: the delayed focus at mount is then not wanted.
  const touched = useRef(false);

  // Handle editor cleanup on unmount: without it, leaving mid-edit throws "Canceled".
  useEffect(() => {
    return () => {
      clearTimeout(focusTimer.current);
      resizeRef.current?.disconnect();
      resizeRef.current = null;
      if (editorRef.current) {
        try {
          editorRef.current.dispose?.();
        } catch (e) {
          // Ignore disposal errors
        }
        editorRef.current = null;
      }
    };
  }, [editorRef]);

  const options = useMemo(() => ({
    minimap: { enabled: false },
    fontFamily: getComputedStyle(document.documentElement).getPropertyValue('--font-mono').trim() || 'monospace',
    fontSize: tokenPx('--fs-code', 15),
    lineHeight: Math.round(tokenPx('--fs-code', 15) * 1.6),
    lineNumbers: 'on' as const,
    lineNumbersMinChars: 3,
    padding: { top: 8, bottom: 8 },
    renderLineHighlight: 'line' as const,
    scrollBeyondLastLine: false,
    tabSize: 4,
    bracketPairColorization: { enabled: true },
    guides: { bracketPairs: true, indentation: true },
    quickSuggestions: true,
    suggestOnTriggerCharacters: true,
    acceptSuggestionOnEnter: 'on' as const,
    tabCompletion: 'on' as const,
    wordBasedSuggestions: 'matchingDocuments' as const,
    autoClosingBrackets: 'always' as const,
    autoClosingQuotes: 'always' as const,
    formatOnPaste: true,
    formatOnType: true,
    readOnly,
    // The editor follows its box through the observer set up at mount.
    automaticLayout: false,
    overviewRulerLanes: 0,
    overviewRulerBorder: false,
    hideCursorInOverviewRuler: true,
    scrollbar: { vertical: 'auto' as const, horizontal: 'auto' as const, alwaysConsumeMouseWheel: false },
    mouseWheelZoom: false,
    ariaLabel: 'Code editor. Escape leaves it; Shift+Enter checks.',
  }), [readOnly]);

  const handleMount = (editor: any, monaco: Monaco) => {
    editorRef.current = editor;
    // Follow the box as the banner opens or the window changes. The layout
    // waits for the next frame, so it never resizes inside the observer's own
    // callback (the "ResizeObserver loop" error Monaco's automaticLayout gives
    // while the banner animates).
    if (boxRef.current && typeof ResizeObserver !== 'undefined') {
      let frame = 0;
      resizeRef.current?.disconnect();
      resizeRef.current = new ResizeObserver(() => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => editorRef.current?.layout());
      });
      resizeRef.current.observe(boxRef.current);
    }
    let repeat = false;
    editor.onKeyDown((e: any) => { repeat = !!e.browserEvent?.repeat; });
    const check = () => {
      if (repeat) return;
      if (!checkRef.current()) shellRef.current?.primary();
    };
    for (const spec of SHORTCUTS.submitTyping.keys) editor.addCommand(monacoKey(monaco, spec), check);
    for (const spec of SHORTCUTS.leaveTyping.keys) {
      editor.addCommand(monacoKey(monaco, spec), () => shellRef.current?.leave(), LEAVE_WHEN);
    }
    // The bundled Plex Mono may finish loading after Monaco measured its fallback.
    document.fonts?.ready.then(() => monaco.editor.remeasureFonts?.());
    // Focus the editor once it is ready, so typing can start at once - unless
    // focus has moved on meanwhile (into the editor and out, or to the banner).
    focusTimer.current = setTimeout(() => {
      const now = document.activeElement;
      if (touched.current) return;
      if (!now || now === document.body || now === boxRef.current?.closest('article')) editor.focus();
    }, 100);
  };

  const label = languageLabel(language);
  return (
    <div className={styles.editor}>
      <div className={styles.monaco} ref={boxRef} onFocus={() => { touched.current = true; }}>
        <Editor
          key={questionId}
          height="100%"
          language={MONACO_LANGUAGE[language] ?? 'plaintext'}
          value={value}
          onChange={v => onChange(v || '')}
          beforeMount={defineTheme}
          onMount={handleMount}
          theme={THEME}
          options={options}
          loading={<CodeBlock code={value} language={language} numbered fill label="Loading the editor" className={styles.loading} />}
        />
      </div>
      <div className={styles.bar}>
        {readOnly ? (
          <span className={styles.barHint}>Answered: the code is read only</span>
        ) : (
          <>
            <span className={styles.barHint}><KeyCombo combo="Escape" />leave</span>
            <span className={styles.barHint}><KeyCombo combo="Shift+Enter" />or<KeyCombo combo="Mod+Enter" />check</span>
            <span className={styles.barHint}><KeyCombo combo="Tab" />indent</span>
          </>
        )}
        <span className={styles.barSpacer} />
        {label && <span className={styles.barLang}>{label}</span>}
        {onReset && !readOnly && (
          <Button size="xs" variant="ghost" icon={<RotateCcw />} onClick={onReset} title="Put the starter code back">Reset</Button>
        )}
      </div>
    </div>
  );
}

const pct = (credit: number) => `${Math.round(credit * 100)}%`;

export const CodingQuestion: React.FC<Props> = ({
  question,
  onAnswer,
  onFirstMiss,
  showHints,
  hintCreditSchedule,
}) => {
  const tiered = !!question.tieredHints;
  const schedule = hintCreditSchedule ?? ([1, 0.5, 0.25] as const);
  const [code, setCode] = useState(question.starterCode);
  const [phase, setPhase] = useState<Phase>('editing');
  // Checks so far this visit and the highest hint tier revealed (0/1/2). Both
  // persist across retries so the recorded attempt reflects the whole struggle.
  const [submitCount, setSubmitCount] = useState(0);
  const [hintTier, setHintTier] = useState<0 | 1 | 2>(0);
  const [testResults, setTestResults] = useState<ValidationResult[]>([]);
  const [showSolution, setShowSolution] = useState(false);
  // The learner's answer when the checker cannot tell: does their code do the same as the reference?
  const [selfChoice, setSelfChoice] = useState<'same' | 'different' | null>(null);
  const editorRef = useRef<any>(null);
  const checking = useRef(false);

  // Reset state when question changes
  useEffect(() => {
    // Dispose previous editor instance when question changes
    if (editorRef.current) {
      try {
        editorRef.current.dispose?.();
      } catch (e) {
        // Ignore disposal errors
      }
      editorRef.current = null;
    }

    setCode(question.starterCode);
    setPhase('editing');
    setSubmitCount(0);
    setHintTier(0);
    setTestResults([]);
    setShowSolution(false);
    setSelfChoice(null);
    checking.current = false;
  }, [question.id, question.starterCode]);

  // Record exactly one attempt for this question visit at a terminal outcome.
  // Navigating away mid-retry records nothing (same as abandoning pre-submit).
  const finalize = (passed: boolean, attempts: number) => {
    setPhase('done');
    onAnswer(passed, { hintTierUsed: hintTier, attempts: Math.max(attempts, 1) });
  };

  const handleSubmit = async () => {
    if (checking.current) return;
    checking.current = true;
    try {
      await grade();
    } finally {
      checking.current = false;
    }
  };

  const grade = async () => {
    const attemptNumber = submitCount + 1;
    setSubmitCount(attemptNumber);
    let results: ValidationResult[];
    if (question.previewChecks && question.previewChecks.length > 0) {
      // Visual grading: render solution and user code in twin hidden iframes
      // and compare computed styles. Always definitive - no uncertain verdicts.
      try {
        results = await validateByComputedStyle(question, code);
      } catch (error) {
        results = [
          {
            passed: false,
            verdict: 'fail' as ValidationVerdict,
            description: 'Render your code',
            error: error instanceof Error ? error.message : 'Preview grading failed.',
          },
        ];
      }
    } else {
      results = gradeCodingSubmission(question, code);
    }
    setTestResults(results);
    // If any verdict is uncertain (and none are definitively failed), ask the
    // learner to compare with the reference instead of recording an answer the
    // validator isn't confident about. The reference is shown, so retry is off
    // the table - the self-grade is terminal either way.
    const anyUncertain = results.some(r => r.verdict === 'uncertain');
    const anyFail = results.some(r => r.verdict === 'fail');
    if (anyUncertain && !anyFail) {
      setPhase('awaiting-self-grade');
      return;
    }
    if (results.length > 0 && results.every(r => r.verdict === 'pass')) {
      finalize(true, attemptNumber);
      return;
    }
    // A real failure. Tiered-hints questions offer the retry step; untiered
    // questions keep the classic one-shot behavior exactly.
    if (tiered) {
      if (attemptNumber === 1) onFirstMiss?.({ hintTierUsed: hintTier, attempts: 1 });
      setPhase('review-fail');
    } else {
      finalize(false, attemptNumber);
    }
  };

  const handleSelfGrade = (matches: boolean) => {
    // Resolve the uncertain verdicts to the learner's own judgement.
    setTestResults(prev =>
      prev.map(r =>
        r.verdict === 'uncertain'
          ? {
              ...r,
              passed: matches,
              verdict: matches ? 'pass' : 'fail',
              error: matches ? undefined : 'You judged it does not match the reference.',
              output: matches ? 'You judged it does the same as the reference.' : undefined,
            }
          : r,
      ),
    );
    finalize(matches, submitCount);
  };

  // Retry: back to the editor, keeping the learner's code and any spent hints.
  const handleTryAgain = () => {
    setPhase('editing');
    setTestResults([]);
    editorRef.current?.focus?.();
  };

  // Reveal the next hint tier. Hints are "spent" - the tier persists across
  // retries and caps the final credit and FSRS grade even after a clean pass.
  const revealHintTier = (tier: 1 | 2) => {
    setHintTier(prev => (tier > prev ? tier : prev));
  };

  const handleGiveUp = () => {
    setShowSolution(true);
    finalize(false, submitCount);
  };

  // Reset keeps hints spent (hintTier) and the check count: those cues were already seen this visit.
  const handleReset = () => {
    setCode(question.starterCode);
    setTestResults([]);
    setPhase('editing');
    editorRef.current?.focus?.();
  };

  // Live preview: HTML questions render their own code; CSS questions render
  // their code over the question's previewHtml. Everything else - no preview.
  const isHtml = question.language === CodeLanguage.HTML;
  const previewActive = isHtml || Boolean(question.previewHtml);
  const usesTailwind = question.topic === Topic.TAILWIND;

  const passCount = testResults.filter(r => r.verdict === 'pass').length;
  const passed = testResults.length > 0 && testResults.every(r => r.verdict === 'pass');
  const done = phase === 'done';
  const earnedCredit = schedule[hintTier];
  const fullSpacing = earnedCredit >= CREDIT_CORRECT_THRESHOLD;

  const results: ResultItem[] = testResults.map(r => ({
    state: r.verdict === 'pass' ? 'pass' : r.verdict === 'uncertain' ? 'unsure' : 'fail',
    text: r.description,
    detail: r.error ?? r.output,
  }));

  // ---- The banner ----
  const checks = `${passCount} of ${testResults.length} ${testResults.length === 1 ? 'check passes' : 'checks pass'}`;
  let feedback: ShellFeedback | null = null;
  if (phase === 'review-fail') {
    feedback = { verdict: 'partial', title: 'Not yet', detail: `${checks} · attempt ${submitCount}`, body: <ResultList items={results} /> };
  } else if (phase === 'awaiting-self-grade') {
    feedback = {
      verdict: 'partial',
      title: 'Check it yourself',
      detail: 'The checker cannot tell whether this does the same as the reference',
      body: (
        <>
          <ResultList items={results} />
          <OptionList
            name={`self-grade-${question.id}`}
            label="Does your code do the same as the reference solution?"
            caption={<p className={styles.ask}>Compare with the reference beside your code. Does yours do the same thing?</p>}
            layout="list"
            options={[
              { id: 'same', text: 'Mine does the same thing', content: 'Mine does the same thing' },
              { id: 'different', text: 'Mine does something different', content: 'Mine does something different' },
            ]}
            value={selfChoice}
            onChange={id => setSelfChoice(id as 'same' | 'different')}
          />
        </>
      ),
    };
  } else if (done) {
    const creditNote = passed && hintTier > 0 && (
      <p className={styles.credit}>
        With the {hintTier === 1 ? 'signature' : 'skeleton'} hint this pass counts {pct(earnedCredit)}
        {fullSpacing
          ? `, at or above the ${pct(CREDIT_CORRECT_THRESHOLD)} bar: the card moves on to its next interval.`
          : `, below the ${pct(CREDIT_CORRECT_THRESHOLD)} bar: the card comes back tomorrow.`}
      </p>
    );
    feedback = {
      verdict: passed ? 'right' : 'wrong',
      title: passed ? 'Correct' : 'Not quite',
      detail: testResults.length > 0 ? `${checks}${submitCount > 1 ? ` · attempt ${submitCount}` : ''}` : undefined,
      body: (
        <>
          {!passed && results.length > 0 && <ResultList items={results} />}
          {creditNote}
          <Prose text={question.explanation} />
        </>
      ),
    };
  }

  // ---- Actions ----
  const action = phase === 'editing'
    ? { label: 'Check', onAction: () => { void handleSubmit(); } }
    : phase === 'review-fail'
    ? { label: 'Try again', onAction: handleTryAgain, keyWord: 'try again' }
    : phase === 'awaiting-self-grade'
    ? { label: 'Record', onAction: () => selfChoice && handleSelfGrade(selfChoice === 'same'), disabled: selfChoice === null, keyWord: 'record' }
    : undefined;

  // Tiered hints unlock after the first failed check, one tier at a time; each costs credit.
  const nextTier = (hintTier + 1) as 1 | 2;
  const hintAction: ShellKeyAction | null = tiered && hintTier < 2 && submitCount > 0 && (phase === 'review-fail' || phase === 'editing')
    ? {
      label: nextTier === 1 ? 'Show the signature' : 'Show the skeleton',
      note: `a pass then counts ${pct(schedule[nextTier])}`,
      onAction: () => revealHintTier(nextTier),
    }
    : null;

  const solutionAction: ShellKeyAction | null = phase === 'review-fail'
    ? { label: 'Give up', note: 'and see the solution', onAction: handleGiveUp }
    : done && !passed && !showSolution
    ? { label: 'Show solution', onAction: () => setShowSolution(true) }
    : null;

  // ---- Beside the editor: hints spent, the live preview, or (once shown) the solution in their place ----
  const reference = (done && showSolution) || phase === 'awaiting-self-grade';
  const hintsShown = tiered && hintTier >= 1 && !done && !reference;
  const hasTables = !!question.tables && question.tables.length > 0;
  const side = hasTables || previewActive || hintsShown || reference;

  const onCheck = () => {
    if (phase === 'editing' || phase === 'review-fail') {
      void handleSubmit();
      return true;
    }
    return false;
  };

  return (
    <QuestionShell
      question={question}
      format="Write code"
      graded={done}
      typed={phase === 'editing'}
      fill
      stage={phase}
      action={action}
      hint={!tiered && showHints && phase === 'editing' ? question.hints : null}
      hintAction={hintAction}
      solutionAction={solutionAction}
      feedback={feedback}
    >
      <QuestionRegion grow>
        <AnswerColumns
          columns={side ? 'minmax(0, 1.3fr) minmax(0, 1fr)' : 'minmax(0, 1fr)'}
          className={styles.workspace}
        >
          <CodeEditor
            questionId={question.id}
            language={question.language}
            value={code}
            onChange={setCode}
            readOnly={done && passed}
            onCheck={onCheck}
            onReset={phase === 'editing' ? handleReset : undefined}
            editorRef={editorRef}
          />
          {side && (
            <div className={styles.side}>
              {/* The sample data sits beside the editor, where the query is written against it. */}
              {hasTables && <DataTables tables={question.tables} />}
              {hintsShown && question.tieredHints && (
                <section className={styles.panel} aria-label="Hints">
                  <h3 className={styles.panelHead}>Signature</h3>
                  <CodeBlock code={question.tieredHints.apiSignature} language={question.language} compact />
                  {hintTier >= 2 && (
                    <>
                      <h3 className={styles.panelHead}>Skeleton</h3>
                      <CodeBlock code={question.tieredHints.skeleton} language={question.language} compact className={styles.scroll} />
                    </>
                  )}
                </section>
              )}
              {reference && (
                <section className={[styles.panel, styles.fillPanel].join(' ')} aria-label={done ? 'Solution' : 'Reference solution'}>
                  <h3 className={styles.panelHead}>{done ? 'Solution' : 'Reference solution'}</h3>
                  <CodeBlock code={question.solution} language={question.language} label={languageLabel(question.language)} numbered fill />
                </section>
              )}
              {previewActive && !reference && (
                <section className={[styles.panel, styles.fillPanel].join(' ')} aria-label="Preview">
                  <h3 className={styles.panelHead}>Preview</h3>
                  <LivePreview
                    html={isHtml ? code : question.previewHtml ?? ''}
                    css={isHtml ? undefined : code}
                    tailwind={usesTailwind}
                  />
                </section>
              )}
            </div>
          )}
        </AnswerColumns>
      </QuestionRegion>
    </QuestionShell>
  );
};
