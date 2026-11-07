import React from 'react';
import styles from './AppShell.module.css';

interface AppShellProps {
  /** The course theme class, which tints the course markers. */
  className?: string;
  topBar: React.ReactNode;
  /** Storage notices under the top bar; only present while there is one to show. */
  notices?: React.ReactNode;
  /** The main navigation: a rail at the left, a tab bar at the foot of a phone. */
  nav: React.ReactNode;
  /** The screen's id: a new screen fades in. */
  viewKey: string;
  /** Dialogs and other layers over the screen. */
  overlays?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * The frame round every screen: the top bar, any storage notice, the
 * navigation and the screen itself, which scrolls inside <main> (the page
 * never does). Under 768px the navigation moves below the screen as a tab bar.
 */
export function AppShell({ className, topBar, notices, nav, viewKey, overlays, children }: AppShellProps) {
  return (
    <div className={[styles.app, className].filter(Boolean).join(' ')}>
      {topBar}
      {notices}
      <div className={styles.body}>
        {nav}
        <main className={styles.main}>
          <div className={styles.view} key={viewKey}>
            {children}
          </div>
        </main>
      </div>
      {overlays}
    </div>
  );
}
