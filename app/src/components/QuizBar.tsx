import React from 'react';
import { ArrowLeft, BookOpen, ChevronRight, ListFilter, PanelRightClose, PanelRightOpen } from 'lucide-react';
import { Badge, BadgeCount } from './ui/Badge';
import { Button } from './ui/Button';
import styles from './QuizBar.module.css';

/** What the card on screen is, and how far today's session has come. */
export interface SessionStatus {
  /** Absent between cards: the summary, or nothing left under the filters. */
  kind?: 'lesson' | 'review' | 'new' | 'practice';
  answered: number;
  size: number;
  /** Past today's size: counts on with no end. */
  keepGoing: boolean;
  reviewsLeft: number;
  /** A missed card was just queued to come back once. */
  again: boolean;
}

const KIND: Record<NonNullable<SessionStatus['kind']>, { word: string; about: string }> = {
  lesson: { word: 'Lesson', about: 'A lesson exercise: an existing question of the topic, right after its rule card.' },
  review: { word: 'Review', about: 'A review from today\'s list.' },
  new: { word: 'New', about: 'First time seeing this question: the next step of the topic\'s ramp.' },
  practice: { word: 'Practice', about: 'Extra practice: not in today\'s review list, so the review count does not change.' },
};

/** The one status badge: the card's kind, then today's count. Its title says the rest. */
export function SessionBadge({ status }: { status: SessionStatus }) {
  const { kind, answered, size, keepGoing, reviewsLeft, again } = status;
  const count = keepGoing ? `${answered}` : `${answered}/${size}`;
  const spoken = keepGoing ? `${answered} answered today, past today's ${size}` : `${answered} of ${size} answered today`;
  const reviews = reviewsLeft === 0
    ? 'Today\'s reviews are done.'
    : `${reviewsLeft} review${reviewsLeft === 1 ? '' : 's'} left today.`;
  const title = [
    kind ? KIND[kind].about : '',
    `Today: ${spoken}.`,
    reviews,
    again ? 'The card you missed comes back once, a few cards later, and adds one to today.' : '',
  ].filter(Boolean).join(' ');
  return (
    <Badge tone={!kind || kind === 'practice' || keepGoing ? 'neutral' : 'accent'} title={title} className={styles.badge}>
      {kind && (
        <>
          <span>{KIND[kind].word}</span>
          <span className={styles.dot} aria-hidden="true">·</span>
        </>
      )}
      <span aria-hidden="true"><BadgeCount>{count}</BadgeCount> today</span>
      <span className="sr-only">: {spoken}</span>
    </Badge>
  );
}

export interface QuizBarProps {
  onBack: () => void;
  /** The section's display name, from courseConfig. */
  section?: string;
  /** The topic's display name, from courseConfig; absent between cards ("Today's session"). */
  topic?: string;
  status: SessionStatus;
  onRuleCard?: () => void;
  /** The column beside the question: shown or not, and the toggle. */
  panel?: { shown: boolean; onToggle: () => void };
  /** How many filter groups leave something out (0 when nothing is filtered), and F. */
  filters: { active: number; onOpen: () => void };
}

/** The one compact header row of the quiz: where you are on the left, how the session stands and the tools on the right. */
export function QuizBar({ onBack, section, topic, status, onRuleCard, panel, filters }: QuizBarProps) {
  return (
    <div className={styles.bar}>
      <Button variant="ghost" size="sm" icon={<ArrowLeft />} onClick={onBack} className={styles.back}>Back</Button>
      <nav className={styles.crumb} aria-label="Where you are">
        {section && (
          <>
            <span className={styles.section} title={section}>{section}</span>
            <ChevronRight className={styles.chevron} aria-hidden="true" />
          </>
        )}
        <span className={styles.topic} title={topic} aria-current="page">{topic ?? 'Today\'s session'}</span>
      </nav>
      <SessionBadge status={status} />
      <div className={styles.tools}>
        {onRuleCard && (
          <Button variant="ghost" size="sm" icon={<BookOpen />} shortcut="R" onClick={onRuleCard} title="Open this topic's rule card">
            Rule card
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          icon={<ListFilter />}
          shortcut="F"
          onClick={filters.onOpen}
          title={filters.active ? `Filters: ${filters.active} of 3 groups leave something out` : 'Filters: everything is in'}
        >
          Filters
          {filters.active > 0 && (
            <Badge tone="accent" className={styles.filterCount}>
              {filters.active}<span className="sr-only"> on</span>
            </Badge>
          )}
        </Button>
        {panel && (
          <Button
            variant="ghost"
            size="sm"
            className={styles.panelToggle}
            data-panel-toggle
            icon={panel.shown ? <PanelRightClose /> : <PanelRightOpen />}
            onClick={panel.onToggle}
            aria-pressed={panel.shown}
            aria-label={panel.shown ? 'Hide the panel beside the question' : 'Show the panel beside the question'}
            title={panel.shown ? 'Hide the panel beside the question' : 'Show the panel beside the question'}
          />
        )}
      </div>
    </div>
  );
}
