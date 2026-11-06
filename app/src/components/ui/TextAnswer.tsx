import React from 'react';
import { Check, X } from 'lucide-react';
import styles from './TextAnswer.module.css';

interface TextAnswerProps {
  id: string;
  label: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  /** A textarea (Enter adds a line; Shift+Enter or Ctrl/Cmd+Enter check, handled by the shell). */
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
  /** Code-like answers (printed output) are typed in the mono font. */
  mono?: boolean;
  /** Shown after a one-line input, e.g. "rows". */
  unit?: string;
  /** One-line inputs check on Enter. */
  onEnter?: () => void;
  disabled?: boolean;
  /** Fill the height of the row it sits in (beside a code block). */
  grow?: boolean;
  /** After grading: the typed answer stays in place, marked right or wrong (an icon and a word, not colour alone). */
  status?: 'right' | 'wrong';
}

/** The one typed-answer field: predicted output, a predicted value, an explanation. */
export function TextAnswer({ id, label, value, onChange, multiline, rows = 3, placeholder, mono, unit, onEnter, disabled, grow, status }: TextAnswerProps) {
  const cls = [styles.field, mono ? styles.mono : ''].filter(Boolean).join(' ');
  return (
    <div className={[styles.wrap, grow ? styles.grow : '', status ? styles[status] : ''].filter(Boolean).join(' ')}>
      <label className={styles.label} htmlFor={id}>
        {label}
        {status && (
          <span className={styles.status}>
            {status === 'right' ? <Check aria-hidden="true" /> : <X aria-hidden="true" />}
            {status === 'right' ? 'right' : 'not right'}
          </span>
        )}
      </label>
      {multiline ? (
        <textarea
          id={id}
          className={cls}
          value={value}
          onChange={e => onChange(e.target.value)}
          rows={rows}
          placeholder={placeholder}
          spellCheck={false}
          autoComplete="off"
          disabled={disabled || !!status}
        />
      ) : (
        <div className={styles.row}>
          <input
            id={id}
            type="text"
            className={cls}
            value={value}
            onChange={e => onChange(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey && onEnter) {
                e.preventDefault();
                onEnter();
              }
            }}
            placeholder={placeholder}
            spellCheck={false}
            autoComplete="off"
            disabled={disabled || !!status}
          />
          {unit && <span className={styles.unit}>{unit}</span>}
        </div>
      )}
    </div>
  );
}

/** A typed answer after grading, beside the expected one. */
export function AnswerCompare({ items, columns = items.length }: {
  items: Array<{ label: string; value: React.ReactNode; tone: 'right' | 'wrong' | 'neutral'; mono?: boolean }>;
  columns?: number;
}) {
  return (
    <div className={styles.compare} style={{ '--columns': columns } as React.CSSProperties}>
      {items.map(item => (
        <div key={item.label} className={[styles.box, item.tone === 'right' ? styles.boxRight : item.tone === 'wrong' ? styles.boxWrong : ''].filter(Boolean).join(' ')}>
          <div className={styles.boxLabel}>{item.label}</div>
          <div className={[styles.boxValue, item.mono ? styles.mono : ''].filter(Boolean).join(' ')}>{item.value}</div>
        </div>
      ))}
    </div>
  );
}
