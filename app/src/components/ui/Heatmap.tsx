import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import styles from './Heatmap.module.css';

export interface HeatmapDay {
  date: string;
  count: number;
  intensity: number; // 0-1 scale
}

interface HeatmapProps {
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

/** A label needs this many columns before the next one, or it is dropped. */
const MONTH_LABEL_COLS = 3;
/** Columns a label needs from its own to the grid's right edge. */
const MONTH_LABEL_END = 2;

/**
 * Month names over the grid: one at each week whose Sunday starts a new
 * month, so it sits over the first full week of that month. A month that
 * starts too close to the next label (the oldest, cut-off one), or to the
 * right edge (this month, in its first days), gets none.
 */
export function monthLabels(grid: HeatmapDay[][]): { column: number; label: string }[] {
  const out: { column: number; label: string }[] = [];
  let last = -1;
  grid.forEach((week, column) => {
    const month = Number(week[0].date.slice(5, 7));
    if (month === last) return;
    last = month;
    out.push({ column, label: new Date(`${week[0].date}T00:00:00Z`).toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' }) });
  });
  return out.filter((m, i) => (i === out.length - 1
    ? grid.length - m.column >= MONTH_LABEL_END
    : out[i + 1].column - m.column >= MONTH_LABEL_COLS));
}

/**
 * How many week columns fit the element's width, at most `max`: the grid's
 * cell and gap are read from its computed style. Without ResizeObserver (as
 * in tests) every requested week is drawn.
 */
function useFitWeeks(viewportRef: React.RefObject<HTMLDivElement | null>, gridRef: React.RefObject<HTMLDivElement | null>, max: number): number {
  const [fit, setFit] = useState(max);
  useLayoutEffect(() => {
    const el = viewportRef.current;
    const grid = gridRef.current;
    if (!el || !grid || typeof ResizeObserver === 'undefined') return undefined;
    const measure = () => {
      const g = getComputedStyle(grid);
      const v = getComputedStyle(el);
      const cell = parseFloat(g.gridAutoColumns);
      const gap = parseFloat(g.columnGap) || 0;
      const room = el.clientWidth - parseFloat(v.paddingLeft) - parseFloat(v.paddingRight);
      if (!(cell > 0) || !(room > 0)) return;
      setFit(Math.max(1, Math.min(max, Math.floor((room + gap) / (cell + gap)))));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [viewportRef, gridRef, max]);
  return Math.min(fit, max);
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

/** Weekday names down the left, on every other row as on a wall calendar. */
const WEEKDAYS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

/**
 * Answers per day as a grid of weeks (columns, Sunday on top) ending today,
 * which is outlined, with the months along the top and the weekdays down the
 * left. It draws as many of the `weeks` as fit its width, newest kept, so
 * today always shows. `summary` sits at the right of the legend.
 */
export function Heatmap({ data, weeks: requested = 52, className = '', summary }: HeatmapProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const weeks = useFitWeeks(viewportRef, gridRef, requested);
  const grid = useMemo(() => buildHeatmapGrid(data, weeks), [data, weeks]);
  const days = grid.flat();
  const today = days[days.length - 1]?.date;

  return (
    <div className={[styles.calendar, className].filter(Boolean).join(' ')}>
      <div className={styles.body}>
        <div className={styles.weekdays} aria-hidden="true">
          {WEEKDAYS.map((d, i) => <span key={i}>{d}</span>)}
        </div>
        <div className={styles.viewport} ref={viewportRef}>
          <div className={styles.sheet}>
            <div className={styles.months} aria-hidden="true">
              {monthLabels(grid).map(m => (
                <span key={m.column} style={{ gridColumn: m.column + 1 }}>{m.label}</span>
              ))}
            </div>
            <div className={styles.grid} ref={gridRef} role="img" aria-label={`Questions answered per day, last ${weeks} weeks`}>
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
}
