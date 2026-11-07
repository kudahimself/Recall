import React from 'react';
import { Check, X } from 'lucide-react';
import styles from './StepList.module.css';

export type StepState = 'right' | 'wrong' | 'current' | 'todo';

export interface Step {
  id: string;
  label: string;
  state: StepState;
}

const SPOKEN: Record<StepState, string> = {
  right: 'right',
  wrong: 'missed',
  current: 'current',
  todo: 'to come',
};

interface StepListProps {
  steps: Step[];
  /** The list's accessible name, e.g. "Lesson · Variables, Types & Strings". */
  label: string;
  /** The word before each step's number in what is read out: "exercise 2 of 5". */
  noun?: string;
  className?: string;
}

/** A numbered row of steps, each done right, missed, current or still to come. */
export function StepList({ steps, label, noun = 'step', className }: StepListProps) {
  return (
    <ol
      className={[styles.steps, className].filter(Boolean).join(' ')}
      aria-label={label}
      style={{ '--steps': steps.length } as React.CSSProperties}
    >
      {steps.map((s, i) => (
        <li key={s.id} className={[styles.step, styles[s.state]].join(' ')} aria-current={s.state === 'current' ? 'step' : undefined} title={s.label}>
          {s.state === 'right' && <Check className={styles.icon} aria-hidden="true" />}
          {s.state === 'wrong' && <X className={styles.icon} aria-hidden="true" />}
          <span className={styles.no} aria-hidden="true">{i + 1}</span>
          <span className={styles.label}>{s.label}</span>
          <span className="sr-only">, {noun} {i + 1} of {steps.length}, {SPOKEN[s.state]}</span>
        </li>
      ))}
    </ol>
  );
}
