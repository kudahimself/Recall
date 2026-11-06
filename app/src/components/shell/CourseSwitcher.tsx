import React from 'react';
import { Course } from '../../types';
import { COURSE_META, COURSE_ORDER } from '../../utils/courseMeta';
import { CourseTotals } from '../../utils/coursePath';
import { MenuButton } from '../ui/Menu';
import { KeyHints } from '../ui/Kbd';
import styles from './CourseSwitcher.module.css';

interface CourseSwitcherProps {
  active: Course;
  totals: Record<Course, CourseTotals>;
  onChange: (course: Course) => void;
}

/** The course in the top bar, and the list to switch to another (C, then 1-5). */
export function CourseSwitcher({ active, totals, onChange }: CourseSwitcherProps) {
  const meta = COURSE_META[active];
  const items = COURSE_ORDER.map(course => {
    const m = COURSE_META[course];
    const t = totals[course];
    return {
      id: course,
      label: m.label,
      icon: <span className={`${m.theme} ${styles.hue}`}><m.Icon /></span>,
      description: t.answered > 0
        ? `${t.seen.toLocaleString()} / ${t.total.toLocaleString()} seen · ${t.recentPct}% recent`
        : `${t.total.toLocaleString()} questions · not started`,
      checked: course === active,
    };
  });
  return (
    <MenuButton
      label={`Course: ${meta.label}. Switch course`}
      menuLabel="Courses"
      items={items}
      onSelect={id => onChange(id as Course)}
      shortcut="switchCourse"
      shortcutKey="C"
      numbered
      className={styles.switcher}
      footer={<KeyHints hints={[['1-5', 'pick'], ['Enter', 'choose'], ['close', 'close']]} />}
    >
      <span className={`${meta.theme} ${styles.dot}`} aria-hidden="true" />
      <span className={styles.full}>{meta.label}</span>
      <span className={styles.short}>{meta.short}</span>
    </MenuButton>
  );
}
