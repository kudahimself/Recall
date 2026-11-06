import React, { useMemo } from 'react';
import './HeatmapCalendar.css';

export interface HeatmapDay {
  date: string;
  count: number;
  intensity: number; // 0-1 scale
}

interface HeatmapCalendarProps {
  data: HeatmapDay[];
  weeks?: number;
  className?: string;
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

export const HeatmapCalendar: React.FC<HeatmapCalendarProps> = ({
  data,
  weeks = 52,
  className = '',
}) => {
  const heatmapGrid = useMemo(() => buildHeatmapGrid(data, weeks), [data, weeks]);

  const getIntensityClass = (intensity: number): string => {
    if (intensity === 0) return 'intensity-0';
    if (intensity < 0.25) return 'intensity-1';
    if (intensity < 0.5) return 'intensity-2';
    if (intensity < 0.75) return 'intensity-3';
    return 'intensity-4';
  };

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC',
    });
  };

  return (
    <div className={`heatmap-calendar ${className}`}>
      <div className="heatmap-grid">
        {heatmapGrid.map((week, weekIdx) => (
          <div key={weekIdx} className="heatmap-week">
            {week.map((day, dayIdx) => (
              <div
                key={`${weekIdx}-${dayIdx}`}
                className={`heatmap-day ${getIntensityClass(day.intensity)}`}
                title={`${formatDate(day.date)}: ${day.count} question${day.count === 1 ? '' : 's'}`}
                data-count={day.count}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="heatmap-legend">
        <span className="legend-label">Less</span>
        <div className="intensity-0" />
        <div className="intensity-1" />
        <div className="intensity-2" />
        <div className="intensity-3" />
        <div className="intensity-4" />
        <span className="legend-label">More</span>
      </div>
    </div>
  );
};
