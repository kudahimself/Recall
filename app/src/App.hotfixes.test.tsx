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
import { Course, Topic } from './types';
import { LESSONS } from './data/lessons';
import { LESSONS_KEY } from './utils/spacedRepetition';
import { getCourseForTopic } from './utils/courseConfig';
import { localDayKey, ReviewSession, serializeSessions } from './utils/reviewSession';
import { TODAY_SESSION_KEY } from './utils/spacedRepetition';

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
    expect(screen.getByRole('button', { name: 'Reset filters' })).toBeInTheDocument();
    expect(screen.queryByText('Done for today')).toBeNull();
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

  test('a lesson reached under a topic filter serves and completes against its full exercise list', async () => {
    localStorage.setItem('recall-active-course', 'backend');
    localStorage.setItem('recall-dev-unlock-all', '1');
    localStorage.setItem('recall-filters', JSON.stringify({ topics: [Topic.PY_DATACLASSES] }));
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /Start today's session/ }));
    fireEvent.click(await screen.findByRole('button', { name: /Try the exercises/ }, { timeout: 3000 }));

    const typeHintsExercise = questions.find(q => q.id === 'py-types-union-1')!;
    expect(await screen.findByText(typeHintsExercise.question)).toBeInTheDocument();
    expect(screen.getByText(/exercise 1 of 5/)).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('radio')[0]);
    fireEvent.click(screen.getByRole('button', { name: /Submit Answer/ }));
    expect(await screen.findByRole('button', { name: NEXT })).toHaveTextContent(/Next exercise/);
    expect(localStorage.getItem(LESSONS_KEY)).toBeNull();
  });

  test('a lesson started from the path serves its exercises whatever the topic filter', async () => {
    localStorage.setItem('recall-active-course', 'backend');
    localStorage.setItem('recall-dev-unlock-all', '1');
    localStorage.setItem('recall-filters', JSON.stringify({ topics: [Topic.TSQL_JOINS] }));
    const otherBackendLessons = LESSONS.filter(l => l.id !== 'py_type_hints/1'
      && getCourseForTopic(l.topicKeys[0]) === getCourseForTopic(Topic.PY_DATACLASSES));
    localStorage.setItem(LESSONS_KEY, JSON.stringify(Object.fromEntries(otherBackendLessons.map(l => [l.id, 1]))));
    render(<App />);
    fireEvent.click(await screen.findByRole('button', { name: 'Start lesson' }, { timeout: 3000 }));
    fireEvent.click(await screen.findByRole('button', { name: /Try the exercises/ }, { timeout: 3000 }));

    const firstExercise = questions.find(q => q.id === 'py-types-union-1')!;
    expect(await screen.findByText(firstExercise.question)).toBeInTheDocument();
  });

  test('a filtered session that is not over, with nothing left in the filters, says so and offers Reset filters', async () => {
    localStorage.setItem('recall-active-course', 'sql');
    localStorage.setItem(PROGRESS_KEY, progressWith(['tsql-select-mcq-1']));
    localStorage.setItem('recall-filters', JSON.stringify({ topics: [Topic.TSQL_JOINS] }));
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /Start today's session/ }));

    expect(await screen.findByText(/Nothing left today for these filters/, {}, { timeout: 3000 })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reset filters' })).toBeInTheDocument();
    expect(screen.queryByText('Done for today')).toBeNull();
    expect(screen.queryByText(/No questions match your current filters/)).toBeNull();
  });

  test('a filtered session that is over ends on the summary, with Keep going', async () => {
    localStorage.setItem('recall-active-course', 'sql');
    localStorage.setItem(PROGRESS_KEY, progressWith(['tsql-select-mcq-1']));
    localStorage.setItem('recall-filters', JSON.stringify({ topics: [Topic.TSQL_SELECT] }));
    const finished: ReviewSession = {
      day: localDayKey(), size: 20, queue: [], total: 0, overflow: 0, freshLeft: 0, answered: 20, reasks: 0,
      served: ['tsql-select-mcq-1'], keepGoing: false,
      tally: { review: 0, new: 20, drill: 0, practice: 0, again: 0, correct: 20 },
    };
    localStorage.setItem(TODAY_SESSION_KEY, serializeSessions({ [Course.SQL]: finished }));
    render(<App />);
    fireEvent.click(nav('Learn'));

    expect(await screen.findByText('Done for today', {}, { timeout: 3000 })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Keep going/ })).toBeInTheDocument();
    expect(screen.queryByText(/Nothing left today for these filters/)).toBeNull();
    expect(screen.queryByText(/No questions match your current filters/)).toBeNull();
  });

  test('a filtered session with nothing servable even unfiltered ends on the summary', async () => {
    localStorage.setItem('recall-active-course', 'sql');
    localStorage.setItem(PROGRESS_KEY, progressWith(['tsql-select-mcq-1']));
    localStorage.setItem('recall-filters', JSON.stringify({ topics: [Topic.TSQL_SELECT] }));
    const sqlIds = questions.filter(q => getCourseForTopic(q.topic) === Course.SQL).map(q => q.id);
    const exhausted: ReviewSession = {
      day: localDayKey(), size: 20, queue: [], total: 0, overflow: 0, freshLeft: 5, answered: 15, reasks: 0,
      served: sqlIds, keepGoing: false,
      tally: { review: 0, new: 15, drill: 0, practice: 0, again: 0, correct: 15 },
    };
    localStorage.setItem(TODAY_SESSION_KEY, serializeSessions({ [Course.SQL]: exhausted }));
    render(<App />);
    fireEvent.click(nav('Learn'));

    expect(await screen.findByText('Done for today', {}, { timeout: 3000 })).toBeInTheDocument();
    expect(screen.queryByText(/Nothing left today for these filters/)).toBeNull();
  });

  test('switching course selects every topic again and keeps the type and difficulty filters', () => {
    localStorage.setItem('recall-active-course', 'sql');
    localStorage.setItem('recall-filters', JSON.stringify({
      topics: [Topic.TSQL_SELECT], difficulties: ['beginner'], questionTypes: ['parsons'],
    }));
    render(<App />);
    const tiles = screen.getByRole('heading', { name: 'Switch course' }).closest('section')!;
    fireEvent.click(within(tiles).getByRole('button', { name: /Backend Engineering/ }));

    const saved = JSON.parse(localStorage.getItem('recall-filters')!);
    expect(saved.topics).toEqual(expect.arrayContaining([Topic.PY_DATACLASSES, Topic.TSQL_SELECT]));
    expect(saved.difficulties).toEqual(['beginner']);
    expect(saved.questionTypes).toEqual(['parsons']);
  });
});
