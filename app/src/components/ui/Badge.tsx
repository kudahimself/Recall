import React from 'react';
import styles from './Badge.module.css';

export type BadgeTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  icon?: React.ReactNode;
}

/** A small label: difficulty, format, a session count. */
export function Badge({ tone = 'neutral', icon, className, children, ...rest }: BadgeProps) {
  return (
    <span className={[styles.badge, styles[tone], className].filter(Boolean).join(' ')} {...rest}>
      {icon && <span className={styles.icon} aria-hidden="true">{icon}</span>}
      {children}
    </span>
  );
}

/** A number inside a badge, set in tabular figures. */
export function BadgeCount({ children }: { children: React.ReactNode }) {
  return <b className={styles.count}>{children}</b>;
}
