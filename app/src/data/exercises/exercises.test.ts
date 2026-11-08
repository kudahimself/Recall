/**
 * Exercises (src/data/exercises/) against the repo's exercises/ folder: every
 * entry points at a real folder whose README title, starter and tests match,
 * every folder has an entry, each Python Fundamentals, Python Advanced, Django,
 * Django Advanced & Deployment, DRF Production Patterns, Celery & Background
 * Tasks, Testing & CI/CD, Production Infrastructure, Python Mastery & Advanced and
 * Real-time & Monitoring topic has one, as do the Databricks Lakehouse Platform, ELT with Spark SQL & Python, Incremental Data Processing, Production Pipelines, Optimization & Advanced, Data Governance, Data Modeling & Warehousing Design and Lakehouse Architecture & Engineering Practice topics and the Data Engineering topics the course outline marks for one, test files and modules have names unique across exercises
 * so pytest can collect them all from the repo root, and exercises/check_exercises.py passes (each
 * exercise's tests fail on its starter and pass on its reference solution), so
 * an exercise cannot rot.
 */
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { EXERCISES } from './index';
import { BACKEND_SECTIONS, DATABRICKS_SECTIONS, DATA_ENG_PATH_ORDER, getCourseForTopic, getSectionUnits } from '../../utils/courseConfig';

const REPO = path.join(__dirname, '..', '..', '..', '..');
const EXERCISES_DIR = path.join(REPO, 'exercises');
// The Python that runs the exercises' tests; the Databricks ones also need Java 17+ and pyspark, the Data Engineering ones duckdb.
const PYTHON = process.env.EXERCISES_PYTHON ?? 'python3';

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

  it('gives every test file and top-level module a name no other exercise uses', () => {
    const owners = new Map<string, string[]>();
    for (const e of EXERCISES) {
      const dir = path.join(REPO, e.folder);
      const names = fs.readdirSync(dir, { withFileTypes: true })
        .filter(d => d.name !== 'conftest.py' && (
          (d.isFile() && d.name.endsWith('.py'))
          || (d.isDirectory() && fs.existsSync(path.join(dir, d.name, '__init__.py')))))
        .map(d => d.name.replace(/\.py$/, ''));
      for (const n of names) owners.set(n, [...(owners.get(n) ?? []), e.id]);
    }
    const shared = Array.from(owners).filter(([, ids]) => ids.length > 1);
    expect(shared).toEqual([]);
  });

  it.each(['Python Fundamentals', 'Python Advanced', 'Django', 'Django Advanced & Deployment', 'DRF Production Patterns', 'Celery & Background Tasks', 'Testing & CI/CD', 'Production Infrastructure', 'Python Mastery & Advanced', 'Real-time & Monitoring'])('has an exercise for every %s topic, in path order', section => {
    expect(BACKEND_SECTIONS[section]).toBeDefined();
    const units = getSectionUnits(section).map(([, keys]) => keys);
    const inSection = EXERCISES.filter(e => units.some(keys => keys.includes(e.topicKeys[0])));
    expect(inSection.map(e => e.topicKeys)).toEqual(units);
  });

  it.each(['Lakehouse Platform', 'ELT with Spark SQL & Python', 'Incremental Data Processing', 'Production Pipelines', 'Optimization & Advanced', 'Data Governance', 'Data Modeling & Warehousing Design', 'Lakehouse Architecture & Engineering Practice'])('has an exercise for every Databricks %s topic, in path order', section => {
    expect(DATABRICKS_SECTIONS[section]).toBeDefined();
    const units = getSectionUnits(section).map(([, keys]) => keys);
    const inSection = EXERCISES.filter(e => units.some(keys => keys.includes(e.topicKeys[0])));
    expect(inSection.map(e => e.topicKeys)).toEqual(units);
  });

  // Data Engineering gives an exercise only to the topics its decisions-and-designs
  // outline marks for one (where writing the load or plan teaches more than a card).
  it('has an exercise for every marked Data Engineering topic, in path order', () => {
    const marked = [
      'de_data_skipping',
      'de_updating_files', 'de_schema_evolution',
      'de_full_vs_incremental', 'de_idempotent_loads', 'de_change_data_capture', 'de_dedup_late_data', 'de_backfills',
      'de_grain_double_counting', 'de_scd_point_in_time',
      'de_event_time_windows',
      'de_partition_skew',
      'de_quality_gates',
    ];
    const pathKeys = DATA_ENG_PATH_ORDER.flatMap(section => getSectionUnits(section).flatMap(([, keys]) => keys));
    const inCourse = EXERCISES.filter(e => e.folder.startsWith('exercises/data_engineering/'));
    expect(inCourse.map(e => e.id)).toEqual(marked);
    expect(inCourse.map(e => e.topicKeys)).toEqual(marked.map(k => [k]));
    expect(marked.map(k => pathKeys.indexOf(k))).toEqual(marked.map(k => pathKeys.indexOf(k)).sort((a, b) => a - b));
    expect(marked.every(k => pathKeys.includes(k))).toBe(true);
  });
});

test('pytest collects every exercise together from the repo root without errors', () => {
  const r = spawnSync(PYTHON, ['-m', 'pytest', '--collect-only', '-q', '-p', 'no:cacheprovider', '--ignore=exercises/solutions', 'exercises'], {
    cwd: REPO, encoding: 'utf8', timeout: 300000, env: { ...process.env, PYTHONDONTWRITEBYTECODE: '1' },
  });
  if (r.status !== 0) throw new Error(`pytest --collect-only exercises failed:\n${r.stdout}\n${r.stderr}`);
});

const checkCourses = (courses: string[]) => {
  const args = [path.join(EXERCISES_DIR, 'check_exercises.py'), ...courses];
  const r = spawnSync(PYTHON, args, { cwd: REPO, encoding: 'utf8', timeout: 900000 });
  if (r.status !== 0) throw new Error(`check_exercises.py ${courses.join(' ')} failed:\n${r.stdout}\n${r.stderr}`);
  return r.stdout;
};

test('every Backend exercise fails on its starter and passes on its reference solution (check_exercises.py)', () => {
  const out = checkCourses(['backend']);
  const count = EXERCISES.filter(e => e.folder.startsWith('exercises/backend/')).length;
  expect(out).toMatch(new RegExp(`exercises checked: ${count} pass, 0 fail`));
});

// One Spark JVM runs every Databricks exercise's tests together (see check_exercises.py), so this stays quick.
test('every Databricks exercise fails on its starter and passes on its reference solution (check_exercises.py)', () => {
  const out = checkCourses(['databricks']);
  const count = EXERCISES.filter(e => e.folder.startsWith('exercises/databricks/')).length;
  expect(out).toMatch(new RegExp(`exercises checked: ${count} pass, 0 fail`));
});

test('every Data Engineering exercise fails on its starter and passes on its reference solution (check_exercises.py)', () => {
  const out = checkCourses(['data_engineering']);
  const count = EXERCISES.filter(e => e.folder.startsWith('exercises/data_engineering/')).length;
  expect(out).toMatch(new RegExp(`exercises checked: ${count} pass, 0 fail`));
});
