import React from 'react';
import styles from './StatTile.module.css';

export type StatTone = 'neutral' | 'accent' | 'success' | 'warning';

interface StatTileProps {
  /** The number, or a short word such as "New". */
  value: React.ReactNode;
  /** A total shown after the value, as in "0 / 20". */
  of?: React.ReactNode;
  label: React.ReactNode;
  tone?: StatTone;
  title?: string;
  /** Extra content under the label, such as a ProgressBar. */
  children?: React.ReactNode;
  className?: string;
}

/** One number with its label: reviews left, recent accuracy, lessons done. */
export function StatTile({ value, of, label, tone = 'neutral', title, children, className }: StatTileProps) {
  return (
    <div className={[styles.tile, styles[tone], className].filter(Boolean).join(' ')} title={title}>
      <span className={styles.value}>
        {value}
        {of !== undefined && <span className={styles.of}> / {of}</span>}
      </span>
      <span className={styles.label}>{label}</span>
      {children}
    </div>
  );
}

/** A row of StatTiles in equal columns. */
export function StatGroup({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={[styles.group, className].filter(Boolean).join(' ')}>{children}</div>;
}
