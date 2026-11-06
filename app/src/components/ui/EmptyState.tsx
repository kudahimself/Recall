import React from 'react';
import styles from './EmptyState.module.css';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: React.ReactNode;
  children?: React.ReactNode;
  /** A button or link to move on. */
  action?: React.ReactNode;
  /** A quiet, left-aligned line inside a card instead of a centred block. */
  compact?: boolean;
  className?: string;
}

/** What a list or screen says when it has nothing to show yet. */
export function EmptyState({ icon, title, children, action, compact, className }: EmptyStateProps) {
  return (
    <div className={[styles.empty, compact ? styles.compact : '', className].filter(Boolean).join(' ')}>
      {icon && <span className={styles.icon} aria-hidden="true">{icon}</span>}
      <div className={styles.text}>
        <p className={styles.title}>{title}</p>
        {children && <p className={styles.body}>{children}</p>}
      </div>
      {action}
    </div>
  );
}
