import React from 'react';
import styles from './Screen.module.css';

interface ScreenProps {
  /** The screen's title, an h2 under the app's h1. Home has none: its Today card leads. */
  title?: React.ReactNode;
  /** Lets the screen move focus to its title when it opens (tabIndex -1). */
  titleRef?: React.Ref<HTMLHeadingElement>;
  /** Controls on the title's row, such as Progress's tabs. */
  head?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

/**
 * The frame of a full screen (Home, Progress, Settings): the content width,
 * the gutters and the gap between cards, and the title row. On a laptop the
 * screen takes the height under the top bar; on a phone it is one column
 * that scrolls.
 */
export function Screen({ title, titleRef, head, className, children }: ScreenProps) {
  return (
    <div className={[styles.screen, className].filter(Boolean).join(' ')}>
      {(title || head) && (
        <div className={styles.head}>
          {title && <h2 className={styles.title} ref={titleRef} tabIndex={titleRef ? -1 : undefined}>{title}</h2>}
          {head}
        </div>
      )}
      {children}
    </div>
  );
}
