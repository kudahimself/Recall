/**
 * Progress with the keyboard: ARIA tabs (Left and Right, Home and End, from
 * the tab list or anywhere on the screen), Up and Down through the Topics
 * list and the review schedule from anywhere on the tab, D to drill and R for
 * the rule card, and the links between the tabs.
 *
 * Run: npm test -- --testPathPattern=progress/ProgressView --watchAll=false
 */
/* eslint-disable testing-library/no-node-access -- focus tests read document.activeElement */
import React, { useState } from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { questions } from '../../data/questions';
import { Course, QuestionAttempt, UserProgress } from '../../types';
import { getCourseForTopic, getPathOrder, getSectionUnits } from '../../utils/courseConfig';
import { buildCoursePath, weakTopics } from '../../utils/coursePath';
import { replayHistory } from '../../utils/familySchedule';
import { lessonsForTopic } from '../../utils/lessons';
import { ProgressTab, ProgressView } from './ProgressView';

const DAY = 24 * 60 * 60 * 1000;
const NOW = Date.now();
const sql = questions.filter(q => getCourseForTopic(q.topic) === Course.SQL);
const byId = new Map(questions.map(q => [q.id, q]));
const units = getPathOrder(Course.SQL).flatMap(s => getSectionUnits(s))
  .filter(([, keys]) => sql.some(q => keys.includes(q.topic)));
const [firstName, firstKeys] = units[0];
const [secondName, secondKeys] = units[1];

/**
 * The first unit answered a week ago, mostly wrong lately, so it is weak and
 * its card family is due; a few of the second unit's answered right two days
 * ago, so its family comes due later.
 */
function fixture() {
  const firstQs = sql.filter(q => firstKeys.includes(q.topic)).slice(0, 10);
  const secondQs = sql.filter(q => secondKeys.includes(q.topic)).slice(0, 3);
  const answer = (q: { id: string }, timestamp: number, isCorrect: boolean): QuestionAttempt =>
    ({ questionId: q.id, timestamp, isCorrect, attempts: 1, timeSpent: 9000 });
  const history: QuestionAttempt[] = [
    ...firstQs.map((q, i) => answer(q, NOW - 7 * DAY + i * 60_000, i < 4)),
    ...secondQs.map((q, i) => answer(q, NOW - 2 * DAY + i * 60_000, true)),
  ];
  const progress: UserProgress = {
    questionsAttempted: new Set(history.map(a => a.questionId)),
    correctAnswers: new Set(history.filter(a => a.isCorrect).map(a => a.questionId)),
    attemptHistory: history,
    topicScores: new Map(),
    difficultyScores: new Map(),
    lastAttempt: new Map(history.map(a => [a.questionId, a.timestamp])),
    repetitionQueue: new Map(),
    masteredTopics: new Set(),
  };
  const store = replayHistory(history, byId);
  const path = buildCoursePath(Course.SQL, sql, progress, store, {}, NOW);
  return { progress, path };
}

function Harness(props: { onDrill?: (keys: string[]) => void; onRuleCard?: (id: string) => void; start?: ProgressTab; course?: Course }) {
  const [{ progress, path }] = useState(fixture);
  const [tab, setTab] = useState<ProgressTab>(props.start ?? 'overview');
  const [topic, setTopic] = useState<string | null>(null);
  return (
    <>
      <input aria-label="a text box" />
      <ProgressView
        course={props.course ?? Course.SQL}
        questions={sql}
        progress={progress}
        path={path}
        misconceptions={{ events: [] }}
        activity={[]}
        exercisesDone={{}}
        longestStreak={3}
        tab={tab}
        onTabChange={setTab}
        topic={topic}
        onTopicChange={setTopic}
        onDrill={props.onDrill ?? (() => {})}
        onRuleCard={props.onRuleCard ?? (() => {})}
        onStartLesson={() => {}}
        onToggleExercise={() => {}}
      />
    </>
  );
}

const tab = (name: RegExp) => screen.getByRole('tab', { name });
const selectedTopic = () => screen.getByRole('listbox', { name: 'Topics, by section' })
  .querySelector('[aria-selected="true"]')!;

describe('Progress tabs', () => {
  test('are ARIA tabs: one Tab stop, the selected one focused on arrival, each panel named by its tab', () => {
    render(<Harness />);
    expect(screen.getByRole('tablist', { name: 'Progress views' })).toBeInTheDocument();
    expect(screen.getAllByRole('tab').map(t => t.textContent)).toEqual(['Overview', 'Topics', 'Review schedule']);
    expect(tab(/Overview/)).toHaveAttribute('aria-selected', 'true');
    expect(tab(/Overview/)).toHaveAttribute('tabindex', '0');
    expect(tab(/Topics/)).toHaveAttribute('tabindex', '-1');
    expect(document.activeElement).toBe(tab(/Overview/));
    expect(screen.getByRole('tabpanel', { name: 'Overview' })).toBeInTheDocument();
  });

  test('Left and Right move between tabs and wrap; Home and End go to the ends', () => {
    render(<Harness />);
    fireEvent.keyDown(tab(/Overview/), { key: 'ArrowRight' });
    expect(tab(/Topics/)).toHaveAttribute('aria-selected', 'true');
    expect(document.activeElement).toBe(tab(/Topics/));
    expect(screen.getByRole('tabpanel', { name: 'Topics' })).toBeInTheDocument();

    fireEvent.keyDown(tab(/Topics/), { key: 'End' });
    expect(tab(/Review schedule/)).toHaveAttribute('aria-selected', 'true');
    fireEvent.keyDown(tab(/Review schedule/), { key: 'ArrowRight' });
    expect(tab(/Overview/)).toHaveAttribute('aria-selected', 'true');
    fireEvent.keyDown(tab(/Overview/), { key: 'ArrowLeft' });
    expect(tab(/Review schedule/)).toHaveAttribute('aria-selected', 'true');
    fireEvent.keyDown(tab(/Review schedule/), { key: 'Home' });
    expect(tab(/Overview/)).toHaveAttribute('aria-selected', 'true');
    expect(document.activeElement).toBe(tab(/Overview/));
  });

  test('Left and Right switch tabs from anywhere on the screen, but not while typing', () => {
    render(<Harness />);
    (document.activeElement as HTMLElement).blur();
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(tab(/Topics/)).toHaveAttribute('aria-selected', 'true');
    expect(document.activeElement).toBe(tab(/Topics/));

    fireEvent.keyDown(screen.getByLabelText('a text box'), { key: 'ArrowRight' });
    expect(tab(/Topics/)).toHaveAttribute('aria-selected', 'true');

    // From inside the Topics list (which takes Up and Down itself) Left still switches.
    const list = screen.getByRole('listbox', { name: 'Topics, by section' });
    list.focus();
    fireEvent.keyDown(list, { key: 'ArrowLeft' });
    expect(tab(/Overview/)).toHaveAttribute('aria-selected', 'true');
  });
});

describe('Progress → Topics', () => {
  test('lists every section, the locked ones too, with the learner\'s place selected', () => {
    render(<Harness start="topics" />);
    const list = screen.getByRole('listbox', { name: 'Topics, by section' });
    const groups = within(list).getAllByRole('group');
    expect(groups).toHaveLength(getPathOrder(Course.SQL).filter(s => getSectionUnits(s).some(([, keys]) => sql.some(q => keys.includes(q.topic)))).length);
    expect(within(list).getAllByRole('option')).toHaveLength(units.length);
    expect(selectedTopic()).toHaveTextContent(firstName);
    expect(screen.getByRole('heading', { name: firstName })).toBeInTheDocument();
  });

  test('Down moves the selection from anywhere on the tab and puts focus in the list; the list takes Up, Home and End', () => {
    render(<Harness start="topics" />);
    (document.activeElement as HTMLElement).blur();
    fireEvent.keyDown(window, { key: 'ArrowDown' });
    const list = screen.getByRole('listbox', { name: 'Topics, by section' });
    expect(document.activeElement).toBe(list);
    expect(selectedTopic()).toHaveTextContent(secondName);
    expect(screen.getByRole('heading', { name: secondName })).toBeInTheDocument();
    expect(list).toHaveAttribute('aria-activedescendant', selectedTopic().id);

    fireEvent.keyDown(list, { key: 'ArrowUp' });
    expect(selectedTopic()).toHaveTextContent(firstName);
    fireEvent.keyDown(list, { key: 'End' });
    expect(selectedTopic()).toHaveTextContent(units[units.length - 1][0]);
    fireEvent.keyDown(list, { key: 'Home' });
    expect(selectedTopic()).toHaveTextContent(firstName);
  });

  test('D drills the selected topic and R opens its rule card', () => {
    const onDrill = jest.fn();
    const onRuleCard = jest.fn();
    render(<Harness start="topics" onDrill={onDrill} onRuleCard={onRuleCard} />);
    fireEvent.keyDown(window, { key: 'd' });
    expect(onDrill).toHaveBeenCalledWith(firstKeys);

    // The first SQL topic has a lesson, so it has a rule card.
    const lesson = firstKeys.flatMap(lessonsForTopic)[0];
    expect(lesson).toBeDefined();
    fireEvent.keyDown(window, { key: 'r' });
    expect(onRuleCard).toHaveBeenCalledWith(lesson.id);

    // A locked topic cannot be drilled.
    fireEvent.click(screen.getAllByRole('option').find(o => within(o).queryByTitle(units[units.length - 1][0]))!);
    onDrill.mockClear();
    fireEvent.keyDown(window, { key: 'd' });
    expect(onDrill).not.toHaveBeenCalled();
    expect(screen.queryByRole('button', { name: 'Drill this topic' })).toBeNull();
  });

  test('Schedule shows only the topic\'s card families on the Review schedule tab, until cleared', () => {
    render(<Harness start="topics" />);
    fireEvent.click(screen.getByRole('button', { name: `Review schedule of ${firstName}` }));
    expect(tab(/Review schedule/)).toHaveAttribute('aria-selected', 'true');
    const list = screen.getByRole('listbox', { name: /Card families/ });
    expect(document.activeElement).toBe(list);
    within(list).getAllByRole('option').forEach(o => expect(o).toHaveTextContent(firstName));

    fireEvent.click(screen.getByRole('button', { name: `Only ${firstName}: show every topic` }));
    expect(screen.getByText(/met · \d+ not met yet/)).toBeInTheDocument();
  });

  test('switching course clears the Review schedule topic filter', () => {
    const { rerender } = render(<Harness start="topics" course={Course.SQL} />);
    fireEvent.click(screen.getByRole('button', { name: `Review schedule of ${firstName}` }));
    expect(screen.getByRole('button', { name: `Only ${firstName}: show every topic` })).toBeInTheDocument();

    rerender(<Harness start="topics" course={Course.BACKEND} />);
    rerender(<Harness start="topics" course={Course.SQL} />);
    expect(screen.queryByRole('button', { name: /^Only / })).toBeNull();
    expect(screen.getByText(/met · \d+ not met yet/)).toBeInTheDocument();
    const options = within(screen.getByRole('listbox', { name: /Card families/ })).getAllByRole('option');
    expect(options.some(o => o.textContent!.includes(secondName))).toBe(true);
  });
});

describe('Progress → Overview', () => {
  test('D drills every topic worth another look; a section row opens its topics', () => {
    const onDrill = jest.fn();
    render(<Harness onDrill={onDrill} />);
    const { path } = fixture();
    const weak = weakTopics(path);
    expect(weak.length).toBeGreaterThan(0);

    fireEvent.keyDown(window, { key: 'D' });
    expect(onDrill).toHaveBeenCalledWith(weak.flatMap(w => w.topicKeys));

    fireEvent.click(screen.getByRole('button', { name: new RegExp(`^${path.sections[0].name}, current section`) }));
    expect(tab(/Topics/)).toHaveAttribute('aria-selected', 'true');
    expect(document.activeElement).toBe(screen.getByRole('listbox', { name: 'Topics, by section' }));
    expect(selectedTopic()).toHaveTextContent(firstName);
  });

  test('each number appears once', () => {
    render(<Harness />);
    expect(screen.getAllByText('questions seen')).toHaveLength(1);
    expect(screen.getAllByText(/right in your last \d+ answers/)).toHaveLength(1);
    expect(screen.getAllByText('right the first time')).toHaveLength(1);
    expect(screen.getAllByRole('img', { name: /Questions answered per day/ })).toHaveLength(1);
  });
});

describe('Progress → Review schedule', () => {
  test('lists the met card families by due day; Down moves through them and D drills the family\'s topic', () => {
    const onDrill = jest.fn();
    render(<Harness start="schedule" onDrill={onDrill} />);
    const list = screen.getByRole('listbox', { name: /Card families/ });
    const options = within(list).getAllByRole('option');
    expect(options.length).toBeGreaterThan(1);
    expect(within(list).getAllByRole('group')[0]).toHaveTextContent(/Due today|Tomorrow|day/);

    // The first unit's family is due today, so it comes first and is selected.
    expect(options[0]).toHaveTextContent(firstName);
    expect(options[0]).toHaveAttribute('aria-selected', 'true');
    fireEvent.keyDown(window, { key: 'ArrowDown' });
    expect(document.activeElement).toBe(list);
    expect(options[1]).toHaveAttribute('aria-selected', 'true');
    fireEvent.keyDown(list, { key: 'ArrowUp' });
    expect(options[0]).toHaveAttribute('aria-selected', 'true');
    fireEvent.keyDown(window, { key: 'd' });
    expect(onDrill).toHaveBeenCalledWith(firstKeys);
  });
});
