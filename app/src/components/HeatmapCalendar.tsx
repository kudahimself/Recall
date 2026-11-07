import React, { useMemo } from 'react';
import styles from './HeatmapCalendar.module.css';

export interface HeatmapDay {
  date: string;
  count: number;
  intensity: number; // 0-1 scale
}

interface HeatmapCalendarProps {
  data: HeatmapDay[];
  weeks?: number;
  className?: string;
  /** A short line at the right of the legend, e.g. "12 answered this week". */
  summary?: React.ReactNode;
}

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Answers per day (UTC date keys, as the rest of the app stores days) for
 * the attempts whose question is in `questions`.
 */
export function activityByDay(
  attemptHistory: { questionId: string; timestamp: number }[],
  questions: { id: string }[],
): HeatmapDay[] {
  const dailyCounts = new Map<string, number>();
  const ids = new Set(questions.map(q => q.id));
  for (const attempt of attemptHistory) {
    if (!ids.has(attempt.questionId)) continue;
    const date = new Date(attempt.timestamp).toISOString().split('T')[0];
    dailyCounts.set(date, (dailyCounts.get(date) || 0) + 1);
  }
  const maxCount = Math.max(...Array.from(dailyCounts.values()), 1);
  return Array.from(dailyCounts.entries()).map(([date, count]) => ({
    date,
    count,
    intensity: Math.min(count / Math.max(maxCount * 0.5, 1), 1), // Normalize to 0-1
  }));
}

/**
 * The calendar's columns: `weeks` weeks ending with the week that holds
 * `today`, each running Sunday to Saturday, so every row is one weekday.
 * The last column stops at today; no future days are drawn.
 */
export function buildHeatmapGrid(data: HeatmapDay[], weeks: number, today: Date = new Date()): HeatmapDay[][] {
  const todayMs = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  const startMs = todayMs - (today.getUTCDay() + (weeks - 1) * 7) * DAY_MS;
  const dataMap = new Map(data.map(d => [d.date, d]));

  const grid: HeatmapDay[][] = [];
  for (let week = 0; week < weeks; week++) {
    const weekData: HeatmapDay[] = [];
    for (let day = 0; day < 7; day++) {
      const ms = startMs + (week * 7 + day) * DAY_MS;
      if (ms > todayMs) break;
      const dateStr = new Date(ms).toISOString().split('T')[0];
      const dayData = dataMap.get(dateStr);
      weekData.push({
        date: dateStr,
        count: dayData?.count || 0,
        intensity: dayData?.intensity || 0,
      });
    }
    grid.push(weekData);
  }
  return grid;
}

const LEVELS = [styles.l0, styles.l1, styles.l2, styles.l3, styles.l4];

function level(intensity: number): number {
  if (intensity === 0) return 0;
  if (intensity < 0.25) return 1;
  if (intensity < 0.5) return 2;
  if (intensity < 0.75) return 3;
  return 4;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/**
 * Answers per day as a grid of weeks (columns, Sunday on top) ending today,
 * which is outlined. On a narrow card the oldest weeks are cut off on the
 * left, so today always shows. `summary` sits at the right of the legend.
 */
export const HeatmapCalendar: React.FC<HeatmapCalendarProps> = ({
  data,
  weeks = 52,
  className = '',
  summary,
}) => {
  const days = useMemo(() => buildHeatmapGrid(data, weeks).flat(), [data, weeks]);
  const today = days[days.length - 1]?.date;

  return (
    <div className={[styles.calendar, className].filter(Boolean).join(' ')}>
      <div className={styles.viewport}>
        <div className={styles.grid} role="img" aria-label={`Questions answered per day, last ${weeks} weeks`}>
          {days.map(day => (
            <span
              key={day.date}
              className={[styles.day, LEVELS[level(day.intensity)], day.date === today ? styles.today : ''].filter(Boolean).join(' ')}
              title={`${formatDate(day.date)}: ${day.count} question${day.count === 1 ? '' : 's'}`}
              data-count={day.count}
            />
          ))}
        </div>
      </div>

      <div className={styles.legend}>
        <span>Less</span>
        {LEVELS.map((cls, i) => <span key={i} className={`${styles.swatch} ${cls}`} aria-hidden="true" />)}
        <span>More</span>
        {summary && <span className={styles.summary}>{summary}</span>}
      </div>
    </div>
  );
};
