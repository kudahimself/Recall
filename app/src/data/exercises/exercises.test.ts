/**
 * Exercises (src/data/exercises/) against the repo's exercises/ folder: every
 * entry points at a real folder whose README title, starter and tests match,
 * every folder has an entry, each Python Fundamentals and Python Advanced topic
 * has one, and exercises/check_exercises.py passes (each exercise's tests fail
 * on its starter and pass on its reference solution), so an exercise cannot rot.
 */
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { EXERCISES } from './index';
import { BACKEND_SECTIONS, getCourseForTopic, getSectionUnits } from '../../utils/courseConfig';

const REPO = path.join(__dirname, '..', '..', '..', '..');
const EXERCISES_DIR = path.join(REPO, 'exercises');

jest.setTimeout(300000);

describe('exercise list', () => {
  it('has unique ids, one exercise per topic', () => {
    const ids = EXERCISES.map(e => e.id);
    expect(new Set(ids).size).toBe(ids.length);
    const keys = EXERCISES.flatMap(e => e.topicKeys);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it.each(EXERCISES.map(e => [e.id, e] as const))('%s matches its folder', (_id, e) => {
    const course = getCourseForTopic(e.topicKeys[0]);
    expect(e.folder).toBe(`exercises/${course}/${e.id}`);
    expect(e.topicKeys).toContain(e.id);
    const dir = path.join(REPO, e.folder);
    const readme = fs.readFileSync(path.join(dir, 'README.md'), 'utf8');
    expect(readme.split('\n')[0]).toBe(`# ${e.title}`);
    for (const f of e.starter) {
      expect(fs.existsSync(path.join(dir, f))).toBe(true);
      expect(fs.existsSync(path.join(EXERCISES_DIR, 'solutions', course, e.id, f))).toBe(true);
    }
    expect(e.tests).toMatch(/^test_\w+\.py$/);
    expect(fs.existsSync(path.join(dir, e.tests))).toBe(true);
    expect(e.minutes).toBeGreaterThanOrEqual(10);
    expect(e.minutes).toBeLessThanOrEqual(30);
  });

  it('covers every folder under exercises/<course>/', () => {
    const listed = new Set(EXERCISES.map(e => e.folder));
    const folders = fs.readdirSync(EXERCISES_DIR, { withFileTypes: true })
      .filter(d => d.isDirectory() && d.name !== 'solutions' && !d.name.startsWith('.'))
      .flatMap(course => fs.readdirSync(path.join(EXERCISES_DIR, course.name), { withFileTypes: true })
        .filter(d => d.isDirectory() && !d.name.startsWith('.') && d.name !== '__pycache__')
        .map(d => `exercises/${course.name}/${d.name}`));
    expect(folders.sort()).toEqual(Array.from(listed).sort());
  });

  it.each(['Python Fundamentals', 'Python Advanced'])('has an exercise for every %s topic, in path order', section => {
    expect(BACKEND_SECTIONS[section]).toBeDefined();
    const units = getSectionUnits(section).map(([, keys]) => keys);
    const inSection = EXERCISES.filter(e => units.some(keys => keys.includes(e.topicKeys[0])));
    expect(inSection.map(e => e.topicKeys)).toEqual(units);
  });
});

test('every exercise fails on its starter and passes on its reference solution (check_exercises.py)', () => {
  const r = spawnSync('python3', [path.join(EXERCISES_DIR, 'check_exercises.py')], {
    cwd: REPO, encoding: 'utf8', timeout: 300000,
  });
  if (r.status !== 0) throw new Error(`check_exercises.py failed:\n${r.stdout}\n${r.stderr}`);
  expect(r.stdout).toMatch(new RegExp(`exercises checked: ${EXERCISES.length} pass, 0 fail`));
});
