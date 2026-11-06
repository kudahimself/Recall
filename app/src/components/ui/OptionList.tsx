import React, { useRef } from 'react';
import { Check, Minus, X } from 'lucide-react';
import { pickedNumber, useShortcut } from '../../keyboard/shortcuts';
import { Kbd } from './Kbd';
import styles from './OptionList.module.css';

export interface OptionItem {
  id: string;
  /** What the option shows. */
  content: React.ReactNode;
  /** Plain text, used to decide whether the options are short enough for a grid. */
  text: string;
  isCorrect?: boolean;
}

/** How an option reads after grading. */
export type OptionMark = 'chosen-right' | 'chosen-wrong' | 'correct' | 'other';

export function markFor(option: OptionItem, chosen: string | null): OptionMark {
  if (option.id === chosen) return option.isCorrect ? 'chosen-right' : 'chosen-wrong';
  return option.isCorrect ? 'correct' : 'other';
}

interface OptionListProps {
  /** The radio group name; unique per question and list. */
  name: string;
  /** The accessible name of the group. */
  label: string;
  options: OptionItem[];
  /** The chosen option (one choice). */
  value?: string | null;
  onChange?: (id: string) => void;
  /** Several choices as checkboxes (Explain's key points): the ticked ids and a toggle. */
  multiple?: boolean;
  values?: string[];
  onToggle?: (id: string) => void;
  /** Locked after grading: shows the marks and takes no input. */
  graded?: boolean;
  /** Takes no input but shows no marks yet (a step already answered). */
  locked?: boolean;
  /** 1-9 pick in this list (only one list on screen listens at a time). */
  keys?: boolean;
  /** 'lines' is a block of numbered code lines (Spot the flaw); the line number is its key. */
  variant?: 'options' | 'lines';
  /** 'auto' puts short options side by side. */
  layout?: 'auto' | 'list';
  chosenLabel?: string;
  correctLabel?: string;
  /** Shown above the lines, e.g. the language. */
  caption?: React.ReactNode;
}

const SHORT = 26;

/**
 * The answer options of a question: multiple choice, choose and justify,
 * spot the flaw, and Explain's key points (checkboxes). Native radios (arrow keys move the choice, a screen reader
 * reads a radio group), a number key per option, and after grading a tag
 * with an icon on the learner's answer and the right one, so the result
 * never rests on colour alone.
 */
export function OptionList({
  name, label, options, value = null, onChange, multiple = false, values = [], onToggle, graded = false, locked = false, keys = true,
  variant = 'options', layout = 'auto', chosenLabel = 'Your answer', correctLabel = 'Correct answer', caption,
}: OptionListProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const lines = variant === 'lines';

  const frozen = graded || locked;
  const choose = (id: string) => {
    if (frozen) return;
    if (multiple) onToggle?.(id);
    else onChange?.(id);
  };

  useShortcut('pick', e => {
    const n = pickedNumber(e);
    const option = options[n - 1];
    if (!option) return false;
    choose(option.id);
    listRef.current?.querySelectorAll<HTMLInputElement>('input')[n - 1]?.focus({ preventScroll: true });
    return true;
  }, keys && !frozen);

  const columns = !lines && layout === 'auto' && options.every(o => o.text.length <= SHORT && !o.text.includes('\n'))
    ? (options.length === 3 ? 3 : 2)
    : 1;
  const long = !lines && columns === 1;

  return (
    <div
      ref={listRef}
      role={multiple ? 'group' : 'radiogroup'}
      aria-label={label}
      className={[styles.list, lines ? styles.lines : long ? styles.long : '', multiple ? styles.multi : '', frozen ? styles.graded : ''].filter(Boolean).join(' ')}
      style={columns > 1 ? ({ '--columns': columns } as React.CSSProperties) : undefined}
      data-columns={columns}
    >
      {caption && <div className={styles.caption}>{caption}</div>}
      {options.map((o, i) => {
        const mark = graded && !multiple ? markFor(o, value) : null;
        const checked = multiple ? values.includes(o.id) : value === o.id;
        const cls = [
          styles.option,
          checked ? styles.checked : '',
          mark ? styles[mark] : '',
        ].filter(Boolean).join(' ');
        const tag = mark === 'chosen-right' ? { icon: <Check />, text: chosenLabel }
          : mark === 'chosen-wrong' ? { icon: <X />, text: chosenLabel }
          : mark === 'correct' ? { icon: <Check />, text: correctLabel }
          : null;
        const markTag = tag && (
          <span className={styles.tag}>
            <span className={styles.tagIcon} aria-hidden="true">{tag.icon}</span>
            {tag.text}
          </span>
        );
        return (
          <label key={o.id} className={cls} data-mark={mark ?? undefined} data-checked={checked || undefined}>
            <input
              type={multiple ? 'checkbox' : 'radio'}
              className={styles.input}
              name={name}
              value={o.id}
              checked={checked}
              disabled={frozen}
              onChange={() => choose(o.id)}
            />
            {lines
              ? <span className={styles.lineNo} aria-hidden="true">{tag ? <span className={styles.tagIcon}>{tag.icon}</span> : i + 1}</span>
              : multiple && frozen
                ? <span className={styles.tick} aria-hidden="true">{checked ? <Check /> : <Minus />}</span>
                : <span className={styles.key} aria-hidden="true">{i < 9 ? <Kbd k={String(i + 1)} /> : null}</span>}
            {/* A long option carries its mark at the end of its text; a short one at the row's end. */}
            <span className={styles.text}>
              {o.content}
              {tag && long && markTag}
            </span>
            {tag && !long && markTag}
          </label>
        );
      })}
    </div>
  );
}
