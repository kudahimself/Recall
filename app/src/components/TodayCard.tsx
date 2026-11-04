/**
 * Today's session on Home (TodayCard), its end (SessionSummary), and the
 * session settings (size and review share), which live in localStorage under
 * TODAY_SIZE_KEY / TODAY_REVIEW_SHARE_KEY and travel with Export.
 */
import React from 'react';
import { ArrowRight, CheckCircle2, InfinityIcon, Settings2 } from 'lucide-react';
import {
  TODAY_REVIEW_SHARE_CHOICES,
  TODAY_REVIEW_SHARE_KEY,
  TODAY_SESSION_SIZE_CHOICES,
  TODAY_SIZE_KEY,
  todayReviewCap,
} from '../utils/spacedRepetition';
import { DEFAULT_SESSION_SETTINGS, ReviewSession, SessionSettings, isSessionDone } from '../utils/reviewSession';
import './TodayCard.css';

/** Stored settings, falling back to the defaults for anything missing or not offered. */
export function loadSessionSettings(): SessionSettings {
  const read = (key: string): number | null => {
    try {
      const v = localStorage.getItem(key);
      return v === null ? null : Number(v);
    } catch {
      return null;
    }
  };
  const size = read(TODAY_SIZE_KEY);
  const share = read(TODAY_REVIEW_SHARE_KEY);
  return {
    size: size !== null && (TODAY_SESSION_SIZE_CHOICES as readonly number[]).includes(size) ? size : DEFAULT_SESSION_SETTINGS.size,
    reviewShare: share !== null && (TODAY_REVIEW_SHARE_CHOICES as readonly number[]).includes(share) ? share : DEFAULT_SESSION_SETTINGS.reviewShare,
  };
}

interface SettingsProps {
  settings: SessionSettings;
  onChange: (next: SessionSettings) => void;
}

export function SessionSettingsPanel({ settings, onChange }: SettingsProps) {
  return (
    <div className="today-settings" aria-label="Session settings">
      <Settings2 size={13} />
      <label>
        Session
        <select
          value={settings.size}
          onChange={e => onChange({ ...settings, size: Number(e.target.value) })}
        >
          {TODAY_SESSION_SIZE_CHOICES.map(n => <option key={n} value={n}>{n} questions</option>)}
        </select>
      </label>
      <label>
        Reviews up to
        <select
          value={settings.reviewShare}
          onChange={e => onChange({ ...settings, reviewShare: Number(e.target.value) })}
        >
          {TODAY_REVIEW_SHARE_CHOICES.map(s => <option key={s} value={s}>{Math.round(s * 100)}%</option>)}
        </select>
      </label>
    </div>
  );
}

interface TodayCardProps {
  session: ReviewSession;
  settings: SessionSettings;
  courseLabel: string;
  nextTopic: string | null;
  onSettingsChange: (next: SessionSettings) => void;
  onStart: () => void;
  onKeepGoing: () => void;
}

export function TodayCard({ session, settings, courseLabel, nextTopic, onSettingsChange, onStart, onKeepGoing }: TodayCardProps) {
  const done = isSessionDone(session);
  const reviews = session.queue.length;
  const started = session.answered > 0;
  const date = new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' });
  const cap = todayReviewCap(settings.size, settings.reviewShare);
  return (
    <section className={`today-card${done ? ' today-card-done' : ''}`} aria-label="Today's session">
      <div className="today-eyebrow">{date} · {courseLabel}</div>
      <h2 className="today-title">
        {done ? <><CheckCircle2 size={22} /> Done for today</> : "Today's session"}
      </h2>
      <p className="today-lede">
        {done
          ? `${session.answered} answered, ${session.tally.correct} right. Reviews are cleared; what comes due next waits for tomorrow.`
          : <>{session.size} questions: due reviews first (up to {cap}), then new questions{nextTopic ? <> from <strong>{nextTopic}</strong></> : null} and practice on what you have met.</>}
      </p>
      <div className="today-stats">
        <div className="today-stat">
          <span className="today-stat-value today-reviews-left">{reviews}</span>
          <span className="today-stat-label">reviews left, counts down by one per answer</span>
        </div>
        <div className="today-stat">
          <span className="today-stat-value">{session.freshLeft}</span>
          <span className="today-stat-label">new questions and practice left</span>
        </div>
        <div className="today-stat">
          <span className="today-stat-value">{session.answered}<span className="today-stat-of">/{session.size}</span></span>
          <span className="today-stat-label">answered today</span>
        </div>
      </div>
      {session.overflow > 0 && !done && (
        <p className="today-overflow">
          {session.overflow} more due review{session.overflow === 1 ? '' : 's'} wait for the next days, most overdue first. Keep going serves them today.
        </p>
      )}
      <div className="today-actions">
        {!done && (
          <button className="start-button today-start" onClick={onStart}>
            {started ? "Continue today's session" : "Start today's session"}
            <ArrowRight className="start-button-icon" size={18} />
          </button>
        )}
        <button className={done ? 'start-button today-start' : 'hero-link-btn'} onClick={onKeepGoing}>
          <InfinityIcon size={14} />
          Keep going without a limit
        </button>
      </div>
      <SessionSettingsPanel settings={settings} onChange={onSettingsChange} />
    </section>
  );
}

interface SummaryProps {
  session: ReviewSession;
  onKeepGoing: () => void;
  onHome: () => void;
}

/** The end of the bounded session: what was done, and the way to keep going. */
export function SessionSummary({ session, onKeepGoing, onHome }: SummaryProps) {
  const t = session.tally;
  const pctRight = session.answered > 0 ? Math.round((100 * t.correct) / session.answered) : 0;
  return (
    <div className="session-summary" role="status">
      <h3><CheckCircle2 size={22} /> Done for today</h3>
      <p>
        {session.answered} answered, {pctRight}% right. Today's reviews are cleared.
      </p>
      <ul className="session-summary-list">
        <li><strong>{t.review}</strong> reviews</li>
        <li><strong>{t.new}</strong> new</li>
        <li><strong>{t.drill}</strong> practice</li>
        {t.again > 0 && <li><strong>{t.again}</strong> asked again</li>}
      </ul>
      <div className="today-actions">
        <button className="start-button today-start" onClick={onKeepGoing}>
          <InfinityIcon size={14} />
          Keep going
        </button>
        <button className="hero-link-btn" onClick={onHome}>Back to Home</button>
      </div>
    </div>
  );
}
