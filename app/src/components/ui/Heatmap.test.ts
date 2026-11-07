import { activityByDay, buildHeatmapGrid, monthLabels } from './Heatmap';

// Friday 6 November 2026, mid-afternoon UTC.
const TODAY = new Date(Date.UTC(2026, 10, 6, 15, 0, 0));
const weekday = (date: string) => new Date(`${date}T00:00:00Z`).getUTCDay();

describe('buildHeatmapGrid', () => {
  const grid = buildHeatmapGrid([{ date: '2026-11-06', count: 3, intensity: 1 }], 26, TODAY);
  const cells = grid.flat();

  it('ends on today and shows today\'s answers', () => {
    expect(cells[cells.length - 1]).toEqual({ date: '2026-11-06', count: 3, intensity: 1 });
  });

  it('draws the requested number of weeks and no future days', () => {
    expect(grid).toHaveLength(26);
    expect(cells.every(c => c.date <= '2026-11-06')).toBe(true);
    // Sunday to Friday of the current week.
    expect(grid[grid.length - 1]).toHaveLength(6);
  });

  it('aligns every row to one weekday, Sunday first', () => {
    for (const week of grid) {
      week.forEach((day, row) => expect(weekday(day.date)).toBe(row));
    }
    expect(grid[0][0].date).toBe('2026-05-10');
  });

  it('draws a full last column on a Saturday', () => {
    const saturday = buildHeatmapGrid([], 4, new Date(Date.UTC(2026, 10, 7, 23, 0, 0)));
    expect(saturday[3]).toHaveLength(7);
    expect(saturday[3][6].date).toBe('2026-11-07');
  });
});

describe('monthLabels', () => {
  it('names each month over the first week whose Sunday falls in it, and drops labels with no room', () => {
    // 26 weeks from Sunday 10 May 2026: four May columns, then June to October.
    // November's first Sunday is the last column, too close to the edge for its name.
    const labels = monthLabels(buildHeatmapGrid([], 26, TODAY));
    expect(labels.map(l => l.label)).toEqual(['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct']);
    expect(labels[1]).toEqual({ column: 4, label: 'Jun' });
    // A month with fewer than three columns before the next label loses its name.
    const short = monthLabels(buildHeatmapGrid([], 6, TODAY));
    expect(short.map(l => l.label)).toEqual(['Oct']);
    // A week later November has two columns, room enough.
    const later = monthLabels(buildHeatmapGrid([], 6, new Date(Date.UTC(2026, 10, 13))));
    expect(later.map(l => l.label)).toEqual(['Oct', 'Nov']);
  });
});

describe('activityByDay', () => {
  it('counts the course\'s answers per day, today included', () => {
    const at = (iso: string) => new Date(iso).getTime();
    const days = activityByDay(
      [
        { questionId: 'a', timestamp: at('2026-11-06T09:00:00Z') },
        { questionId: 'a', timestamp: at('2026-11-06T10:00:00Z') },
        { questionId: 'b', timestamp: at('2026-11-05T10:00:00Z') },
        { questionId: 'other-course', timestamp: at('2026-11-06T11:00:00Z') },
      ],
      [{ id: 'a' }, { id: 'b' }],
    );
    expect(days).toEqual([
      { date: '2026-11-06', count: 2, intensity: 1 },
      { date: '2026-11-05', count: 1, intensity: 1 },
    ]);
  });
});
