import React, { useEffect, useRef } from 'react';
import { Card, CardHeader } from './Card';
import styles from './MessageCard.module.css';

export type MessageTone = 'success' | 'neutral' | 'warning';

interface MessageCardProps {
  title: React.ReactNode;
  /** A lucide icon before the title, in the tone's colour. */
  icon?: React.ReactNode;
  tone?: MessageTone;
  /** One or two sentences under the title. */
  lede?: React.ReactNode;
  /** The buttons that move on, the main one first. */
  actions?: React.ReactNode;
  /** Anything between the lede and the actions, such as stat tiles. */
  children?: React.ReactNode;
  /** Move focus to the title when the card appears (a screen of its own). */
  focusTitle?: boolean;
  role?: React.AriaRole;
  id: string;
}

/**
 * A screen-sized message in the quiz stage: the end of the session, a filter
 * with nothing left, a question that failed to render. One card, one title
 * with an icon, a lede and the way on.
 */
export function MessageCard({ title, icon, tone = 'neutral', lede, actions, children, focusTitle, role, id }: MessageCardProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (focusTitle) titleRef.current?.focus({ preventScroll: true });
  }, [focusTitle]);
  return (
    <Card as="section" className={styles.message} role={role} aria-labelledby={id}>
      <CardHeader
        title={<span className={[styles.title, styles[tone]].join(' ')}>{icon && <span className={styles.icon} aria-hidden="true">{icon}</span>}{title}</span>}
        titleId={id}
        titleRef={focusTitle ? titleRef : undefined}
      />
      {lede && <p className={styles.lede}>{lede}</p>}
      {children}
      {actions && <div className={styles.actions}>{actions}</div>}
    </Card>
  );
}
