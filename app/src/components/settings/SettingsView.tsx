/**
 * Settings: the session's size and review share, the progress file (Export
 * and Import), and resetting a course. Moved here from Home and the header,
 * so those screens keep to studying.
 */
import React, { useEffect, useRef } from 'react';
import { Download, Keyboard, RotateCcw, Upload } from 'lucide-react';
import { Course } from '../../types';
import { COURSE_META } from '../../utils/courseMeta';
import { SessionSettings } from '../../utils/reviewSession';
import { TODAY_REVIEW_SHARE_CHOICES, TODAY_SESSION_SIZE_CHOICES, todayReviewCap } from '../../utils/spacedRepetition';
import { Button } from '../ui/Button';
import { Card, CardHeader } from '../ui/Card';
import { Screen } from '../ui/Screen';
import { KeyHints } from '../ui/Kbd';
import { SegmentedControl } from '../ui/SegmentedControl';
import styles from './Settings.module.css';

interface SettingsViewProps {
  course: Course;
  settings: SessionSettings;
  /** Today's session in this course has answers, so new settings wait for tomorrow. */
  sessionStarted: boolean;
  onSettingsChange: (next: SessionSettings) => void;
  canExport: boolean;
  /** Why Export is off, or what it would miss. */
  exportNote: string | null;
  onExport: () => void;
  onImport: () => void;
  onReset: () => void;
  onShowShortcuts: () => void;
}

export function SettingsView({
  course, settings, sessionStarted, onSettingsChange, canExport, exportNote, onExport, onImport, onReset, onShowShortcuts,
}: SettingsViewProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const label = COURSE_META[course].label;
  const cap = todayReviewCap(settings.size, settings.reviewShare);

  useEffect(() => { titleRef.current?.focus({ preventScroll: true }); }, []);

  return (
    <Screen title="Settings" titleRef={titleRef}>

      <div className={styles.grid}>
        <div className={styles.stack}>
          <Card as="section" className={styles.card} aria-labelledby="settings-session">
            <CardHeader as="h3" eyebrow="Study" title="Today's session" titleId="settings-session" />
            <SegmentedControl
              label="Questions per session"
              description="How many questions make one day's session. Keep going serves more whenever you like."
              options={TODAY_SESSION_SIZE_CHOICES.map(n => ({ value: n, label: String(n) }))}
              value={settings.size}
              onChange={size => onSettingsChange({ ...settings, size })}
            />
            <SegmentedControl
              label="Reviews take up to"
              description={<>Due reviews come first, up to this share of the session ({cap} of {settings.size} now); new questions and practice fill the rest.</>}
              options={TODAY_REVIEW_SHARE_CHOICES.map(s => ({ value: s, label: `${Math.round(s * 100)}%` }))}
              value={settings.reviewShare}
              onChange={reviewShare => onSettingsChange({ ...settings, reviewShare })}
            />
            <p className={styles.note}>
              Every course uses these.
              {sessionStarted
                ? ` Today's ${label} session is under way, so it keeps its plan and the change applies from tomorrow.`
                : ' A session not started yet takes a change at once.'}
            </p>
          </Card>

          <Card as="section" className={`${styles.card} ${styles.keysCard}`} aria-labelledby="settings-keys">
            <CardHeader as="h3" eyebrow="Keyboard" title="Shortcuts" titleId="settings-keys" />
            <div className={styles.row}>
              <div className={styles.rowText}>
                <KeyHints hints={[['goHome', 'home'], ['goLearn', 'learn'], ['goProgress', 'progress'], ['switchCourse', 'course']]} />
              </div>
              <Button icon={<Keyboard />} shortcut="?" onClick={onShowShortcuts}>All shortcuts</Button>
            </div>
          </Card>
        </div>

        <div className={styles.stack}>
          <Card as="section" className={styles.card} aria-labelledby="settings-data">
            <CardHeader as="h3" eyebrow="Your data" title="Progress file" titleId="settings-data" />
            <div className={styles.row}>
              <div className={styles.rowText}>
                <p className={styles.rowTitle}>Export</p>
                <p className={styles.rowBody}>Save every course's answers, lessons, schedules and settings to a file.</p>
              </div>
              <Button
                icon={<Download />}
                onClick={onExport}
                disabled={!canExport}
                title={exportNote ?? 'Save all your progress to a file'}
              >
                Export
              </Button>
            </div>
            {exportNote && <p className={styles.warn} role="note">{exportNote}</p>}
            <div className={styles.row}>
              <div className={styles.rowText}>
                <p className={styles.rowTitle}>Import</p>
                <p className={styles.rowBody}>Replace the progress in this browser with an exported file. A backup of the current progress is kept first.</p>
              </div>
              <Button icon={<Upload />} onClick={onImport} title="Replace progress in this browser with an exported file">
                Import
              </Button>
            </div>
          </Card>

          <Card as="section" className={styles.card} aria-labelledby="settings-reset">
            <CardHeader as="h3" eyebrow="Start over" title="Reset a course" titleId="settings-reset" />
            <p className={styles.rowBody}>
              Clears {label}'s answers, lessons, exercises and schedules; other courses keep theirs.
              You are asked first, and it cannot be undone.
            </p>
            <div>
              <Button variant="danger" icon={<RotateCcw />} onClick={onReset}>
                Reset {label} progress
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </Screen>
  );
}
