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
import { Course, Difficulty, MultipleChoiceQuestion, QuestionType, Topic } from './types';
import { LESSONS } from './data/lessons';
import { LESSONS_KEY } from './utils/spacedRepetition';
import { getCourseForTopic, getPathOrder, getSectionUnits } from './utils/courseConfig';
import { localDayKey, ReviewSession, serializeSessions } from './utils/reviewSession';
import { TODAY_SESSION_KEY, TODAY_SIZE_KEY } from './utils/spacedRepetition';

const NEXT = /next (question|exercise)|finish the lesson/i;

function progressWith(answered: string[], ago = 60_000) {
  const t = Date.now() - ago;
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

const plain = (text: string) => text.replace(/`/g, '');

/** Answers the multiple-choice card on screen correctly and moves on. */
async function answerShownMcq() {
  await screen.findByRole('button', { name: /Submit Answer/ }, { timeout: 3000 });
  const radios = screen.getAllByRole('radio');
  const labels = radios.map(r => (r as HTMLInputElement).labels?.[0]?.textContent ?? '');
  const shown = questions.find(q => q.type === QuestionType.MULTIPLE_CHOICE
    && q.options.every(o => labels.some(l => l.includes(plain(o.text))))) as MultipleChoiceQuestion;
  const right = shown.options.find(o => o.isCorrect)!;
  fireEvent.click(radios[labels.findIndex(l => l.includes(plain(right.text)))]);
  fireEvent.click(screen.getByRole('button', { name: /Submit Answer/ }));
  fireEvent.click(await screen.findByRole('button', { name: NEXT }));
  return shown;
}

/** Answers the drill card on screen (a multiple-choice or predict-output card) and moves on. */
async function answerDrillCard() {
  await screen.findByRole('button', { name: /Submit (Answer|Prediction)/ }, { timeout: 3000 });
  if (screen.queryAllByRole('radio').length > 0) return answerShownMcq();
  fireEvent.change(screen.getByRole('textbox'), { target: { value: 'x' } });
  fireEvent.click(screen.getByRole('button', { name: /Submit Prediction/ }));
  fireEvent.click(await screen.findByRole('button', { name: NEXT }));
  return null;
}

const sessionStored = () => JSON.parse(localStorage.getItem(TODAY_SESSION_KEY)!)[Course.SQL];

const topicBadge = (topic: Topic) => topic.replace(/_/g, ' ').toUpperCase();

/** Drill on Progress > Topics for the row holding `topic` (every row unlocked). */
async function drillTopic(course: Course, topic: Topic) {
  const units = getPathOrder(course).flatMap(section => getSectionUnits(section))
    .filter(([, keys]) => questions.some(q => keys.includes(q.topic)));
  fireEvent.click(nav('Progress'));
  fireEvent.click(await screen.findByRole('button', { name: /Topics/ }, { timeout: 3000 }));
  const drills = await screen.findAllByRole('button', { name: 'Drill' });
  fireEvent.click(drills[units.findIndex(([, keys]) => keys.includes(topic))]);
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

  test('a filtered session answered through to its size ends on the summary, and Keep going serves more', async () => {
    localStorage.setItem('recall-active-course', 'sql');
    localStorage.setItem('recall-dev-unlock-all', '1');
    localStorage.setItem(TODAY_SIZE_KEY, '10');
    localStorage.setItem(LESSONS_KEY, JSON.stringify(Object.fromEntries(LESSONS.map(l => [l.id, 1]))));
    localStorage.setItem('recall-filters', JSON.stringify({
      difficulties: [Difficulty.BEGINNER], questionTypes: [QuestionType.MULTIPLE_CHOICE],
    }));
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /Start today's session/ }));

    let answered = 0;
    while (!screen.queryByText(/Done for today|Nothing left today/) && answered < 40) {
      await answerShownMcq();
      answered += 1;
    }

    expect(screen.getByText('Done for today')).toBeInTheDocument();
    expect(answered).toBe(10);
    fireEvent.click(screen.getByRole('button', { name: /Keep going/ }));
    expect(await screen.findByRole('button', { name: /Submit Answer/ }, { timeout: 3000 })).toBeInTheDocument();
  }, 30_000);

  test('with reviews due in a topic outside the filter, fresh slots used up inside it end on Nothing left today', async () => {
    const sql = questions.filter(q => getCourseForTopic(q.topic) === Course.SQL);
    const select = sql.filter(q => q.topic === Topic.TSQL_SELECT);
    const others = Array.from(new Set(sql.map(q => q.topic))).filter(t => t !== Topic.TSQL_SELECT);
    localStorage.setItem('recall-active-course', 'sql');
    localStorage.setItem('recall-dev-unlock-all', '1');
    localStorage.setItem(TODAY_SIZE_KEY, '10');
    localStorage.setItem(LESSONS_KEY, JSON.stringify(Object.fromEntries(LESSONS.map(l => [l.id, 1]))));
    localStorage.setItem(PROGRESS_KEY, progressWith(select.map(q => q.id), 40 * 24 * 3600_000));
    localStorage.setItem('recall-filters', JSON.stringify({
      topics: others, difficulties: [Difficulty.BEGINNER], questionTypes: [QuestionType.MULTIPLE_CHOICE],
    }));
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /Start today's session/ }));

    const served: string[] = [];
    while (!screen.queryByText(/Done for today|Nothing left today/) && served.length < 40) {
      served.push((await answerShownMcq()).topic);
    }

    expect(screen.getByText(/Nothing left today for these filters/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reset filters' })).toBeInTheDocument();
    expect(served.length).toBeGreaterThan(0);
    expect(served.length).toBeLessThanOrEqual(10);
    expect(served).not.toContain(Topic.TSQL_SELECT);
    const session = JSON.parse(localStorage.getItem(TODAY_SESSION_KEY)!)[Course.SQL];
    expect(session.freshLeft).toBe(0);
    expect(session.queue.length).toBeGreaterThan(0);
  }, 30_000);

  test('Drill after Done for today starts practice on that topic straight away, and Start still ends at the size', async () => {
    localStorage.setItem('recall-active-course', 'sql');
    localStorage.setItem('recall-dev-unlock-all', '1');
    localStorage.setItem(TODAY_SIZE_KEY, '10');
    localStorage.setItem(LESSONS_KEY, JSON.stringify(Object.fromEntries(LESSONS.map(l => [l.id, 1]))));
    localStorage.setItem('recall-filters', JSON.stringify({
      difficulties: [Difficulty.BEGINNER], questionTypes: [QuestionType.MULTIPLE_CHOICE],
    }));
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /Start today's session/ }));
    const served: Topic[] = [];
    while (!screen.queryByText(/Done for today|Nothing left today/) && served.length < 40) {
      served.push((await answerShownMcq()).topic);
    }
    expect(screen.getByText('Done for today')).toBeInTheDocument();
    const before = sessionStored();

    await drillTopic(Course.SQL, Topic.TSQL_NORMALIZATION);
    expect(await screen.findByText(topicBadge(Topic.TSQL_NORMALIZATION), {}, { timeout: 3000 })).toBeInTheDocument();
    expect(screen.queryByText(/Done for today|Nothing left today|No questions match/)).toBeNull();
    let drilled = 0;
    while (drilled < 3 && !screen.queryByText(/Done for today|Nothing left today|No questions match/)) {
      await answerDrillCard();
      drilled += 1;
    }
    expect(drilled).toBeGreaterThanOrEqual(2);
    expect(sessionStored()).toMatchObject({ keepGoing: false, freshLeft: before.freshLeft, queue: before.queue });

    fireEvent.click(nav('Home'));
    await screen.findByRole('heading', { name: 'Switch course' }, { timeout: 3000 });
    fireEvent.click(nav('Learn'));
    expect(await screen.findByText('Done for today', {}, { timeout: 3000 })).toBeInTheDocument();
    expect(sessionStored().keepGoing).toBe(false);
  }, 30_000);

  test('Drill mid-session, with reviews still queued elsewhere, starts practice straight away and leaves the session bounded', async () => {
    const sql = questions.filter(q => getCourseForTopic(q.topic) === Course.SQL);
    const select = sql.filter(q => q.topic === Topic.TSQL_SELECT);
    const others = Array.from(new Set(sql.map(q => q.topic))).filter(t => t !== Topic.TSQL_SELECT);
    localStorage.setItem('recall-active-course', 'sql');
    localStorage.setItem('recall-dev-unlock-all', '1');
    localStorage.setItem(TODAY_SIZE_KEY, '10');
    localStorage.setItem(LESSONS_KEY, JSON.stringify(Object.fromEntries(LESSONS.map(l => [l.id, 1]))));
    localStorage.setItem(PROGRESS_KEY, progressWith(select.map(q => q.id), 40 * 24 * 3600_000));
    localStorage.setItem('recall-filters', JSON.stringify({
      topics: others, difficulties: [Difficulty.BEGINNER], questionTypes: [QuestionType.MULTIPLE_CHOICE],
    }));
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /Start today's session/ }));
    const served: Topic[] = [];
    while (!screen.queryByText(/Done for today|Nothing left today/) && served.length < 40) {
      served.push((await answerShownMcq()).topic);
    }
    expect(screen.getByText(/Nothing left today for these filters/)).toBeInTheDocument();
    const before = sessionStored();

    await drillTopic(Course.SQL, Topic.TSQL_NORMALIZATION);
    expect(await screen.findByText(topicBadge(Topic.TSQL_NORMALIZATION), {}, { timeout: 3000 })).toBeInTheDocument();
    expect(screen.queryByText(/Done for today|Nothing left today|No questions match/)).toBeNull();
    let drilled = 0;
    while (drilled < 3 && !screen.queryByText(/Done for today|Nothing left today|No questions match/)) {
      await answerDrillCard();
      drilled += 1;
    }
    expect(drilled).toBeGreaterThanOrEqual(2);
    expect(sessionStored()).toMatchObject({ keepGoing: false, freshLeft: 0, queue: before.queue });

    fireEvent.click(nav('Home'));
    fireEvent.click(await screen.findByRole('button', { name: /today's session/ }, { timeout: 3000 }));
    expect(await screen.findByText(/Nothing left today for these filters/, {}, { timeout: 3000 })).toBeInTheDocument();
    expect(sessionStored()).toMatchObject({ keepGoing: false, freshLeft: 0 });
  }, 30_000);

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
    fireEvent.click(screen.getAllByRole('button', { name: /Backend Engineering/ })[0]);

    const saved = JSON.parse(localStorage.getItem('recall-filters')!);
    expect(saved.topics).toEqual(expect.arrayContaining([Topic.PY_DATACLASSES, Topic.TSQL_SELECT]));
    expect(saved.difficulties).toEqual(['beginner']);
    expect(saved.questionTypes).toEqual(['parsons']);
  });
});
