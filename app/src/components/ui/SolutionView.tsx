import React, { useMemo, useState } from 'react';
import { CodeLanguage } from '../../types';
import { useShortcut } from '../../keyboard/shortcuts';
import { diffLines, solutionForms } from '../../utils/lineDiff';
import { CodeBlock, languageLabel } from './CodeBlock';
import { Dialog } from './Dialog';
import { KeyHints } from './Kbd';
import { SegmentedControl } from './SegmentedControl';
import styles from './SolutionView.module.css';

/** A question's reference solution, and the learner's own answer to set it against. */
export interface SolutionContent {
  code: string;
  language?: CodeLanguage;
  /** What the learner wrote; the lines that differ are marked on both sides. */
  answer?: string;
}

const lines = (n: number) => `${n} ${n === 1 ? 'line' : 'lines'}`;

/**
 * The solution, large: a wide dialog with the reference beside the learner's
 * code, both at full code size with syntax colours, and the lines that differ
 * marked (+ in the solution: not in yours; - in yours: not in the solution).
 * A solution with accepted forms (`# OR`) opens on the one closest to the
 * learner's code. Esc or S closes it.
 */
export function SolutionView({ code, language, answer, onClose }: SolutionContent & { onClose: () => void }) {
  const { forms, closest } = useMemo(() => solutionForms(code, answer, language), [code, answer, language]);
  const [form, setForm] = useState(closest);
  const shown = forms[Math.min(form, forms.length - 1)];
  const mine = answer && answer.trim() ? answer : null;
  const diff = useMemo(() => (mine ? diffLines(shown, mine, language) : null), [shown, mine, language]);

  return (
    <Dialog title="Solution" size="wide" onClose={onClose} bodyClassName={styles.body}>
      <SolutionKey onClose={onClose} />
      <div className={styles.top}>
        {forms.length > 1 && (
          <SegmentedControl
            className={styles.forms}
            label="Accepted forms"
            options={forms.map((_, i) => ({ value: i, label: i === closest && mine ? `Form ${i + 1} (closest to yours)` : `Form ${i + 1}` }))}
            value={form}
            onChange={setForm}
          />
        )}
        {diff && (
          <p className={styles.summary}>
            {diff.added === 0 && diff.removed === 0
              ? 'Your lines are the solution\'s lines; compare the details within them.'
              : (
                <>
                  {diff.added > 0 && (
                    <span className={styles.legend}>
                      <span className={[styles.swatch, styles.add].join(' ')} aria-hidden="true">+</span>
                      {lines(diff.added)} of the solution not in yours
                    </span>
                  )}
                  {diff.removed > 0 && (
                    <span className={styles.legend}>
                      <span className={[styles.swatch, styles.remove].join(' ')} aria-hidden="true">-</span>
                      {lines(diff.removed)} of yours not in the solution
                    </span>
                  )}
                </>
              )}
          </p>
        )}
        <KeyHints className={styles.keys} hints={[['close', 'close'], ['solution', 'close']]} />
      </div>
      {/* Focus starts on the code, so the arrow keys and Page Down scroll a long solution. */}
      <div className={[styles.code, mine ? styles.columns : ''].filter(Boolean).join(' ')} tabIndex={-1} data-autofocus>
        <section className={styles.side} aria-label="The solution">
          {mine && <h3 className={styles.head}>Solution</h3>}
          <CodeBlock
            code={shown}
            language={language}
            label={languageLabel(language)}
            numbered
            highlight
            wrap
            marks={diff?.solution}
            aria-label="Solution code"
          />
        </section>
        {mine && diff && (
          <section className={styles.side} aria-label="Your code">
            <h3 className={styles.head}>Your code</h3>
            <CodeBlock code={mine} language={language} numbered highlight wrap marks={diff.answer} aria-label="Your code" />
          </section>
        )}
      </div>
    </Dialog>
  );
}

/** S closes the view again; bound inside the dialog's key layer. */
function SolutionKey({ onClose }: { onClose: () => void }) {
  useShortcut('solution', () => { onClose(); return true; });
  return null;
}
