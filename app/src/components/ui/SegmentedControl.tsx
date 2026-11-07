import React, { useId } from 'react';
import styles from './SegmentedControl.module.css';

interface SegmentedControlProps<T extends string | number> {
  /** The group's name, read out and shown as its label. */
  label: string;
  /** A line under the label saying what the choice does. */
  description?: React.ReactNode;
  options: ReadonlyArray<{ value: T; label: string }>;
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

/**
 * One choice from a few, as a row of segments. Real radio buttons underneath,
 * so Tab reaches the group once and the arrow keys move the choice.
 */
export function SegmentedControl<T extends string | number>({
  label, description, options, value, onChange, className,
}: SegmentedControlProps<T>) {
  const name = useId();
  const descId = `${name}-desc`;
  return (
    <fieldset className={[styles.field, className].filter(Boolean).join(' ')} aria-describedby={description ? descId : undefined}>
      <legend className={styles.legend}>{label}</legend>
      {description && <p className={styles.description} id={descId}>{description}</p>}
      <div className={styles.segments}>
        {options.map(o => (
          <label key={String(o.value)} className={styles.segment}>
            <input
              type="radio"
              className={styles.input}
              name={name}
              value={String(o.value)}
              checked={o.value === value}
              onChange={() => onChange(o.value)}
            />
            <span className={styles.face}>{o.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
