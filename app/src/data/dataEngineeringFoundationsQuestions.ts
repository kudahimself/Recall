import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
} from '../types';

// Data Engineering Concepts — Section 1: Foundations
// REBUILT as a true beginner ramp (replaces the old "starts at intermediate"
// design). Many small topics; each one starts by teaching the vocabulary
// plainly (BEGINNER), then a few "when would you use A vs B" choices
// (INTERMEDIATE), then 1-2 deeper tradeoffs (ADVANCED). The selector serves
// BEGINNER first within a topic and gates harder tiers behind beginner mastery,
// so the on-ramp is automatic. No jargon is assumed before it is introduced.
//
// Authoring rules honored here:
//   - Beginner questions DEFINE the term; acronyms spelled out on first use.
//   - Short options at beginner level; no dense multi-clause scenarios.
//   - The correct option is never the longest; the correct letter varies.
//   - Fresh id prefixes (de-whatis-, ...) so no returning user has
//     stale progress that skips the ramp.

export const dataEngineeringFoundationsQuestions: Question[] = [
  // ===================================================================
  // de_what_is — What Is Data Engineering?
  // ===================================================================
  {
    id: 'de-whatis-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_WHAT_IS,
    course: Course.DATA_ENGINEERING,
    question: 'What is the main job of a data engineer?',
    options: [
      { id: 'a', text: 'Building and maintaining the systems that move data', isCorrect: true },
      { id: 'b', text: 'Designing the visual layout of dashboards, charts, and reports', isCorrect: false },
      { id: 'c', text: 'Training and tuning machine-learning models on labelled data', isCorrect: false },
      { id: 'd', text: 'Writing the marketing copy that explains company data', isCorrect: false },
    ],
    explanation: 'A data engineer builds and runs the "plumbing" that moves data from where it is created to where it can be used — collecting it, cleaning it, and making it reliable. Designing visuals, training models, and writing copy are other roles (analyst, data scientist, marketer).',
    tags: ['role', 'vocabulary'],
  },
  {
    id: 'de-whatis-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_WHAT_IS,
    course: Course.DATA_ENGINEERING,
    question: 'What is a "data pipeline"?',
    options: [
      { id: 'a', text: 'A single database table that stores all of a company\'s data', isCorrect: false },
      { id: 'b', text: 'A series of automated steps that move and transform data', isCorrect: true },
      { id: 'c', text: 'A chart that visualises how revenue changes over time', isCorrect: false },
      { id: 'd', text: 'A backup copy of a database kept in case of failure', isCorrect: false },
    ],
    explanation: 'A pipeline is a sequence of automated steps that takes data from one place, optionally transforms it (cleans, joins, reshapes), and delivers it somewhere useful. The name comes from data "flowing" through the steps like water through a pipe.',
    tags: ['pipeline', 'vocabulary'],
  },
  {
    id: 'de-whatis-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_WHAT_IS,
    course: Course.DATA_ENGINEERING,
    question: 'In a pipeline, what is the "source"?',
    options: [
      { id: 'a', text: 'The final place where the processed data is written to', isCorrect: false },
      { id: 'b', text: 'The tool used to schedule when the pipeline runs', isCorrect: false },
      { id: 'c', text: 'The place data is read FROM, such as an app database', isCorrect: true },
      { id: 'd', text: 'The person who originally requested that the pipeline be built', isCorrect: false },
    ],
    explanation: 'The source is where a pipeline reads data from — an application database, a file, an event stream, an external API. The place it writes to is called the destination or "sink".',
    tags: ['source', 'vocabulary'],
  },
  {
    id: 'de-whatis-4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_WHAT_IS,
    course: Course.DATA_ENGINEERING,
    question: 'In a pipeline, what is the "sink" (also called the destination)?',
    options: [
      { id: 'a', text: 'The schedule that decides how often data is refreshed', isCorrect: false },
      { id: 'b', text: 'The original system that produces the raw data', isCorrect: false },
      { id: 'c', text: 'A temporary error log written when a pipeline fails', isCorrect: false },
      { id: 'd', text: 'The place processed data is written to', isCorrect: true },
    ],
    explanation: 'The sink (destination) is where a pipeline writes its output — for example a data warehouse or a set of files. Data flows from the source, through the steps, into the sink.',
    tags: ['sink', 'vocabulary'],
  },
  {
    id: 'de-whatis-5',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_WHAT_IS,
    course: Course.DATA_ENGINEERING,
    question: 'What does "raw data" usually mean?',
    options: [
      { id: 'a', text: 'Data exactly as it arrived, before any cleaning', isCorrect: true },
      { id: 'b', text: 'Data that has already been cleaned, joined, and aggregated', isCorrect: false },
      { id: 'c', text: 'Data that has been deleted and can no longer be read', isCorrect: false },
      { id: 'd', text: 'Data that is encrypted and cannot be opened without a key', isCorrect: false },
    ],
    explanation: 'Raw data is data in its original form, straight from the source, before any cleaning or reshaping. Pipelines usually take raw data and turn it into clean, usable data.',
    tags: ['raw-data', 'vocabulary'],
  },
  {
    id: 'de-whatis-6',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_WHAT_IS,
    course: Course.DATA_ENGINEERING,
    question: 'Why do companies need data engineers at all?',
    options: [
      { id: 'a', text: 'Because every dashboard must be redrawn by hand each day', isCorrect: false },
      { id: 'b', text: 'Because raw data is messy and scattered across systems', isCorrect: true },
      { id: 'c', text: 'Because databases legally must be rebuilt once per year', isCorrect: false },
      { id: 'd', text: 'Because analysts are not allowed to write any SQL queries', isCorrect: false },
    ],
    explanation: 'Real data lives in many systems, in different shapes, and is often messy. Data engineers build the pipelines that gather it, clean it, and make it trustworthy so analysts and applications can rely on it.',
    tags: ['motivation', 'vocabulary'],
  },
  {
    id: 'de-whatis-7',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_WHAT_IS,
    course: Course.DATA_ENGINEERING,
    question: 'The analytics team says the numbers in their dashboard are wrong and inconsistent. Which is most likely a data engineering responsibility?',
    options: [
      { id: 'a', text: 'Choosing which colour palette to use across all the dashboard charts', isCorrect: false },
      { id: 'b', text: 'Deciding what the company\'s quarterly revenue targets should be', isCorrect: false },
      { id: 'c', text: 'Making sure the pipeline feeding the dashboard is correct', isCorrect: true },
      { id: 'd', text: 'Writing the email that announces the new dashboard', isCorrect: false },
    ],
    explanation: 'If the underlying numbers are wrong, the problem is usually in the pipeline that produces them — a bad join, a missing source, a broken transformation. That is data engineering territory. Colours, targets, and announcements are not.',
    tags: ['responsibilities'],
  },
  {
    id: 'de-whatis-8',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_WHAT_IS,
    course: Course.DATA_ENGINEERING,
    question: 'A team wants yesterday\'s sales summarised and ready every morning. What kind of work does this need?',
    options: [
      { id: 'a', text: 'A real-time streaming system reacting within milliseconds', isCorrect: false },
      { id: 'b', text: 'A machine-learning model that predicts future sales', isCorrect: false },
      { id: 'c', text: 'A manual export that someone downloads by hand daily', isCorrect: false },
      { id: 'd', text: 'A scheduled batch pipeline that runs once each night', isCorrect: true },
    ],
    explanation: 'A "ready every morning" summary of "yesterday" is a classic scheduled batch job: it runs once per night over a fixed chunk of data. Real-time streaming would be overkill, and a manual export is error-prone and not automated.',
    tags: ['batch', 'scheduling'],
  },
  {
    id: 'de-whatis-9',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_WHAT_IS,
    course: Course.DATA_ENGINEERING,
    question: 'Why is it risky for analysts to each query the app\'s live production database directly?',
    options: [
      { id: 'a', text: 'Heavy analytical queries can slow down the live app', isCorrect: true },
      { id: 'b', text: 'Analysts are never technically capable of writing SQL', isCorrect: false },
      { id: 'c', text: 'Production databases delete all of their data every single night', isCorrect: false },
      { id: 'd', text: 'The app database physically cannot be read more than once', isCorrect: false },
    ],
    explanation: 'The production database is busy serving real users. Big analytical scans can compete for resources and slow the app down (or even take it offline). That is a key reason analytics data is usually copied into a separate system.',
    tags: ['oltp', 'separation'],
  },
];
