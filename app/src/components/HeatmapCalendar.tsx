import React, { useMemo } from 'react';
import './HeatmapCalendar.css';

interface HeatmapDay {
  date: string;
  count: number;
  intensity: number; // 0-1 scale
}

interface HeatmapCalendarProps {
  data: HeatmapDay[];
  weeks?: number;
  className?: string;
}

export const HeatmapCalendar: React.FC<HeatmapCalendarProps> = ({
  data,
  weeks = 52,
  className = '',
}) => {
  const heatmapGrid = useMemo(() => {
    // Generate last N weeks of data
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - weeks * 7);

    const grid: HeatmapDay[][] = [];
    const dataMap = new Map(data.map(d => [d.date, d]));

    // Build 7 rows (days of week) × N columns (weeks)
    for (let week = 0; week < weeks; week++) {
      const weekData: HeatmapDay[] = [];

      for (let day = 0; day < 7; day++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + week * 7 + day);

        const dateStr = date.toISOString().split('T')[0];
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
  }, [data, weeks]);

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
      year: 'numeric'
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
