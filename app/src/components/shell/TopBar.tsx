import React from 'react';
import { Flame, Keyboard } from 'lucide-react';
import { Course } from '../../types';
import { CourseTotals } from '../../utils/coursePath';
import { Button } from '../ui/Button';
import { Logo } from '../ui/Logo';
import { CourseSwitcher } from './CourseSwitcher';
import styles from './TopBar.module.css';

interface TopBarProps {
  course: Course;
  totals: Record<Course, CourseTotals>;
  onCourseChange: (course: Course) => void;
  streak: number;
  onShowShortcuts: () => void;
}

/** The bar over every screen: the logo, the course switcher, the streak and the shortcut list. */
export function TopBar({ course, totals, onCourseChange, streak, onShowShortcuts }: TopBarProps) {
  return (
    <header className={styles.bar}>
      <Logo collapse />
      <span className={styles.divider} aria-hidden="true" />
      <CourseSwitcher active={course} totals={totals} onChange={onCourseChange} />
      <span className={styles.spacer} />
      <span className={styles.stat} title="Days in a row with at least one answer">
        <Flame aria-hidden="true" />
        <b>{streak}</b>
        <span className={styles.statLabel}>day streak</span>
      </span>
      <Button
        variant="ghost"
        size="sm"
        onClick={onShowShortcuts}
        aria-label="Keyboard shortcuts"
        shortcut="?"
        icon={<Keyboard />}
        className={styles.keys}
      />
    </header>
  );
}
