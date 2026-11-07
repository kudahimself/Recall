import React from 'react';
import { CircleAlert, TriangleAlert } from 'lucide-react';
import styles from './Notice.module.css';

export type NoticeTone = 'danger' | 'warning';

interface NoticeProps {
  tone: NoticeTone;
  /** alert for something that went wrong now; status for a standing note. */
  role?: 'alert' | 'status';
  /** Buttons that act on the notice (Download, Dismiss). */
  actions?: React.ReactNode;
  children: React.ReactNode;
}

const ICON: Record<NoticeTone, React.ReactNode> = {
  danger: <CircleAlert />,
  warning: <TriangleAlert />,
};

/**
 * A full-width strip under the top bar that says what happened to the
 * learner's data (unreadable store, failed write, another tab, an import),
 * with an icon and words, never colour alone, and the buttons that act on it.
 */
export function Notice({ tone, role = 'alert', actions, children }: NoticeProps) {
  return (
    <div className={[styles.notice, styles[tone]].join(' ')} role={role}>
      <span className={styles.icon} aria-hidden="true">{ICON[tone]}</span>
      <div className={styles.text}>{children}</div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  );
}
