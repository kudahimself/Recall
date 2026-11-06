import React from 'react';
import { ArrowLeft, BookOpen, ChevronRight, Filter, PanelRightClose, PanelRightOpen } from 'lucide-react';
import { Badge, BadgeCount, BadgeTone } from './ui/Badge';
import { Button } from './ui/Button';
import styles from './QuizBar.module.css';

export interface QuizBarProps {
  onBack: () => void;
  /** The section and the topic's display name, from courseConfig. */
  section?: string;
  topic: string;
  /** e.g. "2/89 seen · new topic". */
  meta?: string;
  /** What this card is: "Lesson exercise 2 of 5", "Review", "New question". */
  kind: { label: string; title: string; tone: BadgeTone };
  /** Today's session: answered of size, or "Keep going". */
  today: { label: string; count: string; title: string };
  reviews: { left: number; again: boolean; title: string };
  onRuleCard?: () => void;
  /** The rule card beside the question: shown or not, and the toggle. */
  panel?: { shown: boolean; onToggle: () => void };
  filtersOpen: boolean;
  onToggleFilters: () => void;
}

/** The one compact header row of the quiz: where you are on the left, how the session stands on the right. */
export function QuizBar({ onBack, section, topic, meta, kind, today, reviews, onRuleCard, panel, filtersOpen, onToggleFilters }: QuizBarProps) {
  return (
    <div className={styles.bar}>
      <Button variant="ghost" size="sm" icon={<ArrowLeft />} onClick={onBack}>Back</Button>
      <nav className={styles.crumb} aria-label="Where you are">
        {section && (
          <>
            <span className={styles.section}>{section}</span>
            <ChevronRight className={styles.chevron} aria-hidden="true" />
          </>
        )}
        <span className={styles.topic}>{topic}</span>
        {meta && <span className={styles.meta}>{meta}</span>}
      </nav>
      <span className={styles.spacer} />
      <div className={styles.status}>
        <Badge tone={kind.tone} title={kind.title}>{kind.label}</Badge>
        <Badge title={today.title}>{today.label} <BadgeCount>{today.count}</BadgeCount></Badge>
        <Badge tone={reviews.left === 0 ? 'success' : 'neutral'} title={reviews.title}>
          {reviews.left === 0 ? 'Reviews done' : <>Reviews left <BadgeCount>{reviews.left}</BadgeCount></>}
          {reviews.again && <span className={styles.again}>+1 again</span>}
        </Badge>
      </div>
      {onRuleCard && (
        <Button size="sm" icon={<BookOpen />} shortcut="R" onClick={onRuleCard} title="Open this topic's rule card">
          Rule card
        </Button>
      )}
      {panel && (
        <Button
          variant="ghost"
          size="sm"
          className={styles.panelToggle}
          icon={panel.shown ? <PanelRightClose /> : <PanelRightOpen />}
          onClick={panel.onToggle}
          aria-pressed={panel.shown}
          aria-label={panel.shown ? 'Hide the rule card beside the question' : 'Show the rule card beside the question'}
          title={panel.shown ? 'Hide the rule card beside the question' : 'Show the rule card beside the question'}
        />
      )}
      <Button
        variant="ghost"
        size="sm"
        icon={<Filter />}
        onClick={onToggleFilters}
        aria-label={filtersOpen ? 'Hide filters' : 'Show filters'}
        aria-pressed={filtersOpen}
        title={filtersOpen ? 'Hide filters' : 'Show filters'}
      />
    </div>
  );
}
