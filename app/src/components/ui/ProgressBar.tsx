import React from 'react';
import styles from './ProgressBar.module.css';

interface ProgressBarProps {
  /** 0-100. */
  value: number;
  /** The accessible name, e.g. "Today's session". */
  label: string;
  /** accent: the brand; course: the course's marker hue; success: done. */
  tone?: 'accent' | 'course' | 'success';
  /** Spoken value, e.g. "4 of 20 answered"; defaults to the percentage. */
  valueText?: string;
  className?: string;
}

/** A thin bar for how far along something is. */
export function ProgressBar({ value, label, tone = 'accent', valueText, className }: ProgressBarProps) {
  const v = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={v}
      aria-valuetext={valueText}
      className={[styles.track, styles[tone], className].filter(Boolean).join(' ')}
      style={{ ['--value' as string]: `${v}%` }}
    >
      <span className={styles.fill} />
    </div>
  );
}
