import React, { useEffect, useRef } from 'react';
import { Check, Minus } from 'lucide-react';
import styles from './Checkbox.module.css';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  checked: boolean;
  /** Some but not all of a group: shown as a dash, read out as "mixed". */
  indeterminate?: boolean;
  onChange: (checked: boolean) => void;
  /** The visible label; it is also the accessible name. */
  label: React.ReactNode;
  /** Quiet text after the label, such as a count. */
  aside?: React.ReactNode;
}

/**
 * A real checkbox (Tab reaches it, Space toggles it) with a drawn box, so it
 * reads the same in every course and in both themes.
 */
export function Checkbox({ checked, indeterminate = false, onChange, label, aside, className, ...rest }: CheckboxProps) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);
  const state = indeterminate ? 'mixed' : checked ? 'on' : 'off';
  return (
    <label className={[styles.row, className].filter(Boolean).join(' ')} data-state={state}>
      <input
        ref={ref}
        type="checkbox"
        className={styles.input}
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        {...rest}
      />
      <span className={styles.box} aria-hidden="true">
        {indeterminate ? <Minus /> : checked ? <Check /> : null}
      </span>
      <span className={styles.label}>{label}</span>
      {aside !== undefined && <span className={styles.aside}>{aside}</span>}
    </label>
  );
}
