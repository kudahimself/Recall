/**
 * Progress: three tabs over one course.
 * - Overview: the course's numbers, every section at a glance, activity and
 *   what is worth another look.
 * - Topics: every section's topics (the list Home's "All sections" opens)
 *   beside the selected topic: its lesson, ramp, review and exercise.
 * - Review schedule: every card family met so far by the day it comes due.
 * Left and Right switch tabs from anywhere on the screen; Up and Down move
 * through a tab's list, D drills and R opens the rule card. Each tab shows
 * the keys that do something on it, under its panel.
 */
import React, { useEffect, useMemo, useRef } from 'react';
import { CalendarClock, LayoutDashboard, ListTree } from 'lucide-react';
import { reviewSchedule } from '../../utils/progressStats';
import { useShortcut } from '../../keyboard/shortcuts';
import { TabItem, TabPanel, Tabs, stepTab, tabId } from '../ui/Tabs';
import { OverviewTab } from './OverviewTab';
import { ScheduleTab } from './ScheduleTab';
import { TopicsTab } from './TopicsTab';
import { ProgressTab, ProgressViewProps, unitKey } from './progressTypes';
import styles from './Progress.module.css';

export type { ProgressTab, ProgressViewProps } from './progressTypes';

const TABS: ReadonlyArray<TabItem<ProgressTab>> = [
  { id: 'overview', label: 'Overview', icon: <LayoutDashboard /> },
  { id: 'topics', label: 'Topics', icon: <ListTree /> },
  { id: 'schedule', label: 'Review schedule', icon: <CalendarClock /> },
];

const ID = 'progress';

export function ProgressView(props: ProgressViewProps) {
  const { tab, onTabChange, path, course } = props;
  const selectedTabRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  // Set when another tab sends the learner to a list, so it takes focus once shown.
  const focusList = useRef(false);
  const now = Date.now();
  const schedule = useMemo(() => reviewSchedule(path, Date.now()), [path]);
  const [scheduleFilter, setScheduleFilter] = React.useState<string | null>(null);
  const [filterCourse, setFilterCourse] = React.useState(course);
  if (filterCourse !== course) {
    setFilterCourse(course);
    setScheduleFilter(null);
  }
  const scheduleTopic = scheduleFilter && schedule.rows.some(r => unitKey(r.unit.topicKeys) === scheduleFilter)
    ? scheduleFilter
    : null;

  // Arriving on Progress puts focus on the selected tab: Left and Right move from there, Tab goes into the panel.
  useEffect(() => { selectedTabRef.current?.focus({ preventScroll: true }); }, []);

  useEffect(() => {
    if (!focusList.current) return;
    focusList.current = false;
    listRef.current?.focus({ preventScroll: true });
  }, [tab]);

  useShortcut('switchTab', e => {
    const next = stepTab(TABS, tab, e.key === 'ArrowLeft' ? -1 : 1);
    onTabChange(next);
    document.getElementById(tabId(ID, next))?.focus({ preventScroll: true });
  });

  const openTopic = (key: string) => {
    props.onTopicChange(key);
    focusList.current = true;
    onTabChange('topics');
  };

  const openSchedule = (key: string) => {
    setScheduleFilter(key);
    focusList.current = true;
    onTabChange('schedule');
  };

  return (
    <div className={styles.progress}>
      <div className={styles.head}>
        <h2 className={styles.title}>Progress</h2>
        <Tabs
          label="Progress views"
          idBase={ID}
          tabs={TABS}
          value={tab}
          onChange={onTabChange}
          selectedRef={selectedTabRef}
          className={styles.tabs}
        />
      </div>

      <TabPanel idBase={ID} id={tab} className={styles.panel}>
        {tab === 'overview' && (
          <OverviewTab {...props} now={now} onOpenTopic={openTopic} />
        )}
        {tab === 'topics' && (
          <TopicsTab {...props} now={now} listRef={listRef} schedule={schedule} onOpenSchedule={openSchedule} />
        )}
        {tab === 'schedule' && (
          <ScheduleTab
            {...props}
            now={now}
            listRef={listRef}
            schedule={schedule}
            topicFilter={scheduleTopic}
            onClearFilter={() => setScheduleFilter(null)}
            onOpenTopic={openTopic}
          />
        )}
      </TabPanel>
    </div>
  );
}
