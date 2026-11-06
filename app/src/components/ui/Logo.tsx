import React from 'react';
import styles from './Logo.module.css';

/**
 * The Recall logo: the elephant tile plus the "Recall" wordmark.
 * The tile is public/icon.svg, which scripts/build-icons.js generates from
 * src/brand/recall-mark.svg, so the header shows the very file the tab,
 * home-screen and desktop icons are made from.
 * `collapse` hides the wordmark on narrow screens (under 900 px) while keeping
 * it for screen readers.
 */
export function Logo({ collapse = false }: { collapse?: boolean }) {
  return (
    <span className={styles.logo}>
      <img className={styles.tile} src={`${process.env.PUBLIC_URL}/icon.svg`} alt="" />
      <span className={`${styles.name}${collapse ? ` ${styles.collapse}` : ''}`}>Recall</span>
    </span>
  );
}
