/**
 * Regression tests for the frontend hotfixes, against the real <App/>:
 * the phone drawer starts closed (F1), one Next after an answer (F3), the
 * Activity tab shows activity only (F4), the Continue card names a topic of
 * the active course (F6), and filters mean what they say and survive a new
 * start in the same course (F7).
 */
import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import App from './App';
import { PROGRESS_KEY } from './utils/progressStorage';
import { questions } from './data/questions';
import { Topic } from './types';

const NEXT = /next (question|exercise)|finish the lesson/i;

function progressWith(answered: string[]) {
  const t = Date.now() - 60_000;
  return JSON.stringify({
    questionsAttempted: answered,
    correctAnswers: answered,
    attemptHistory: answered.map((id, i) => ({ questionId: id, timestamp: t + i, isCorrect: true, attempts: 1, timeSpent: 9000 })),
    topicScores: {},
    difficultyScores: {},
    lastAttempt: Object.fromEntries(answered.map((id, i) => [id, t + i])),
    repetitionQueue: {},
    masteredTopics: [],
  });
}

const nav = (name: string) =>
  within(screen.getByRole('navigation', { name: 'Main navigation' })).getByRole('button', { name });

beforeEach(() => {
  localStorage.clear();
});

describe('F1: phone layout', () => {
  const original = window.matchMedia;
  afterEach(() => {
    window.matchMedia = original;
  });

  const mockWidth = (narrow: boolean) => {
    window.matchMedia = ((query: string) => ({
      matches: narrow && query === '(max-width: 767px)',
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    })) as typeof window.matchMedia;
  };

  test('under 768 px the drawer starts closed, opens from the menu, and closes after a choice', async () => {
    mockWidth(true);
    render(<App />);
    const rail = screen.getByRole('navigation', { name: 'Main navigation' });
    expect(rail).toHaveClass('collapsed');

    fireEvent.click(screen.getByRole('button', { name: 'Toggle navigation' }));
    expect(rail).not.toHaveClass('collapsed');

    fireEvent.click(nav('Progress'));
    expect(rail).toHaveClass('collapsed');
  });

  test('on a desktop the rail starts open', () => {
    mockWidth(false);
    render(<App />);
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).not.toHaveClass('collapsed');
  });
});

describe('F3: one Next per answer', () => {
  test('a multiple-choice answer shows a single Next button', async () => {
    localStorage.setItem('recall-active-course', 'sql');
    localStorage.setItem(PROGRESS_KEY, progressWith(['tsql-select-mcq-1']));
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /Start today's session/ }));

    const submit = await screen.findByRole('button', { name: /Submit Answer/ }, { timeout: 3000 });
    fireEvent.click(screen.getAllByRole('radio')[0]);
    fireEvent.click(submit);

    expect(await screen.findAllByRole('button', { name: NEXT })).toHaveLength(1);
  });
});

describe('F4: the Activity tab', () => {
  test('shows the activity calendar, not the Overview again', async () => {
    localStorage.setItem('recall-active-course', 'sql');
    localStorage.setItem(PROGRESS_KEY, progressWith(['tsql-select-mcq-1']));
    render(<App />);
    fireEvent.click(nav('Progress'));
    fireEvent.click(await screen.findByRole('button', { name: /Activity/ }));

    expect(screen.getByRole('heading', { name: 'Learning Activity' })).toBeInTheDocument();
    expect(screen.queryByText('Your Learning Progress')).toBeNull();
    expect(screen.queryByText('Activity Over Time')).toBeNull();
    // The calendar ends on today, with today's answer on it.
    const today = new Date(`${new Date().toISOString().split('T')[0]}T00:00:00Z`)
      .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
    const cells = screen.getAllByTitle(/: \d+ questions?$/);
    expect(cells[cells.length - 1]).toHaveAttribute('title', `${today}: 1 question`);
  });
});

describe('F6: Continue learning', () => {
  test('does not name another course\'s topic', () => {
    localStorage.setItem('recall-active-course', 'backend');
    localStorage.setItem(PROGRESS_KEY, progressWith(['tsql-select-mcq-1']));
    render(<App />);
    expect(screen.queryByText('Continue Learning')).toBeNull();
  });

  test('names the last topic answered in the active course', () => {
    localStorage.setItem('recall-active-course', 'backend');
    localStorage.setItem(PROGRESS_KEY, progressWith(['py-basic-1', 'tsql-select-mcq-1']));
    render(<App />);
    expect(screen.getByText('Continue Learning')).toBeInTheDocument();
    expect(screen.getByText('py basics')).toBeInTheDocument();
  });
});

describe('F7: filters', () => {
  test('Deselect All topics serves nothing, and a new start in the course keeps the filters', async () => {
    localStorage.setItem('recall-active-course', 'sql');
    localStorage.setItem(PROGRESS_KEY, progressWith(['tsql-select-mcq-1']));
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /Start today's session/ }));
    await screen.findByRole('button', { name: /Submit Answer/ }, { timeout: 3000 });

    fireEvent.click(screen.getByRole('button', { name: 'Show filters' }));
    const topics = screen.getAllByRole('button', { name: 'Deselect All' })[0];
    fireEvent.click(topics);
    expect(await screen.findByText(/You're all caught up/)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Submit Answer/ })).toBeNull();

    fireEvent.click(nav('Home'));
    await screen.findByRole('button', { name: /today's session/ }, { timeout: 3000 });
    fireEvent.click(nav('Learn'));
    expect(await screen.findByText(/You're all caught up/, {}, { timeout: 3000 })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Submit Answer/ })).toBeNull();
  });

  test('a reload keeps the filters the learner set', async () => {
    localStorage.setItem('recall-active-course', 'sql');
    localStorage.setItem(PROGRESS_KEY, progressWith(['tsql-select-mcq-1']));
    const { unmount } = render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /Start today's session/ }));
    await screen.findByRole('button', { name: /Submit Answer/ }, { timeout: 3000 });
    fireEvent.click(screen.getByRole('button', { name: 'Show filters' }));
    fireEvent.click(screen.getByRole('button', { name: 'Advanced' }));
    expect(screen.getByRole('button', { name: 'Advanced' })).not.toHaveClass('active');
    unmount();

    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /Start today's session/ }));
    await screen.findByRole('button', { name: /Submit Answer/ }, { timeout: 3000 });
    fireEvent.click(screen.getByRole('button', { name: 'Show filters' }));
    expect(screen.getByRole('button', { name: 'Advanced' })).not.toHaveClass('active');
    expect(screen.getByRole('button', { name: 'Beginner' })).toHaveClass('active');
  });

  test('a lesson serves only the exercises of the selected topics, whatever their type', async () => {
    localStorage.setItem('recall-active-course', 'backend');
    localStorage.setItem('recall-dev-unlock-all', '1');
    localStorage.setItem('recall-filters', JSON.stringify({ topics: [Topic.PY_DATACLASSES] }));
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /Start today's session/ }));
    fireEvent.click(await screen.findByRole('button', { name: /Try the exercises/ }, { timeout: 3000 }));

    const dataclassesExercise = questions.find(q => q.id === 'py-dataclasses-cloze-2')!;
    const typeHintsExercise = questions.find(q => q.id === 'py-types-union-1')!;
    expect(await screen.findByText(dataclassesExercise.question)).toBeInTheDocument();
    expect(screen.queryByText(typeHintsExercise.question)).toBeNull();
  });
});
