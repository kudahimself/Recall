import React from 'react';
import { CheckCircle2, Home, InfinityIcon } from 'lucide-react';
import { useShortcut } from '../keyboard/shortcuts';
import { ReviewSession } from '../utils/reviewSession';
import { Button } from './ui/Button';
import { MessageCard } from './ui/MessageCard';
import { StatGroup, StatTile } from './ui/StatTile';

interface SummaryProps {
  session: ReviewSession;
  onKeepGoing: () => void;
  onHome: () => void;
}

/** The end of the bounded session: what was done, and the way to keep going (Enter). */
export function SessionSummary({ session, onKeepGoing, onHome }: SummaryProps) {
  const t = session.tally;
  const pctRight = session.answered > 0 ? Math.round((100 * t.correct) / session.answered) : 0;

  useShortcut('startSession', e => {
    if (e.target instanceof HTMLElement && e.target.closest('button, a[href], input, select, textarea')) return false;
    onKeepGoing();
    return true;
  });

  return (
    <MessageCard
      id="session-summary"
      role="status"
      tone="success"
      icon={<CheckCircle2 />}
      title="Done for today"
      lede={<>{session.answered} answered, {pctRight}% right. Today's reviews are cleared.</>}
      focusTitle
      actions={<>
        <Button variant="primary" size="lg" icon={<InfinityIcon />} shortcut="Enter" onClick={onKeepGoing}>Keep going</Button>
        <Button variant="ghost" icon={<Home />} onClick={onHome}>Back to Home</Button>
      </>}
    >
      <StatGroup>
        <StatTile value={t.review} label="reviews" />
        <StatTile value={t.new} label="new" />
        <StatTile value={t.drill} label="practice" />
        {t.again > 0 && <StatTile value={t.again} label="asked again" />}
      </StatGroup>
    </MessageCard>
  );
}
