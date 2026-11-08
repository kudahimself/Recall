import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
} from '../types';

// Data Engineering Concepts — Section 2: Architecture & Open Table Formats
// REBUILT as a true beginner ramp (replaces the old "starts at intermediate"
// design). Same recipe as the Foundations rebuild: many small topics, each
// starting with plain-language vocabulary (BEGINNER), then "when would you use
// A vs B" (INTERMEDIATE), then 1-2 deeper tradeoffs (ADVANCED). The selector
// serves BEGINNER first and gates harder tiers behind beginner mastery.
//
// Its lakehouse, table format and Iceberg / Delta / Hudi topics were retired
// into Warehouses, Lakes & Table Formats; the transformation tools topic is
// what remains.
//
// Authoring rules: define the term before using it; spell out acronyms on
// first use; short options at beginner level; the correct option is never the
// longest; the correct letter varies (~25% each). Fresh id prefixes.

export const dataEngineeringArchitectureQuestions: Question[] = [


  // ===================================================================
  // de_transformation_tools — Transformation Tools (dbt / SQLMesh)
  // ===================================================================
  {
    id: 'de-xform-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_TRANSFORMATION_TOOLS,
    course: Course.DATA_ENGINEERING,
    question: 'What is dbt (data build tool) used for?',
    options: [
      { id: 'a', text: 'Defining data transformations as SQL "models"', isCorrect: true },
      { id: 'b', text: 'Storing raw files cheaply in object storage', isCorrect: false },
      { id: 'c', text: 'Drawing the final charts for a dashboard', isCorrect: false },
      { id: 'd', text: 'Physically moving servers between data centres', isCorrect: false },
    ],
    explanation: 'dbt is a popular tool for the "T" in ELT: you write transformations as SQL SELECT statements ("models"), and dbt builds them into tables or views in your warehouse, in the right order.',
    tags: ['dbt', 'vocabulary'],
  },
  {
    id: 'de-xform-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_TRANSFORMATION_TOOLS,
    course: Course.DATA_ENGINEERING,
    question: 'Where does dbt run its transformations?',
    options: [
      { id: 'a', text: 'On the analyst\'s personal laptop only', isCorrect: false },
      { id: 'b', text: 'Inside the data warehouse, using its compute', isCorrect: true },
      { id: 'c', text: 'On the source system before extraction', isCorrect: false },
      { id: 'd', text: 'Inside the dashboard at the moment of viewing', isCorrect: false },
    ],
    explanation: 'dbt does not process data itself — it sends SQL to the warehouse and lets the warehouse do the work. That is why it fits the ELT model, where transforms run in the destination.',
    tags: ['dbt', 'elt'],
  },
  {
    id: 'de-xform-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_TRANSFORMATION_TOOLS,
    course: Course.DATA_ENGINEERING,
    question: 'What does "modeling as code" mean?',
    options: [
      { id: 'a', text: 'Data can only be modeled by professional programmers', isCorrect: false },
      { id: 'b', text: 'Every model must be written in the C language', isCorrect: false },
      { id: 'c', text: 'Transformations are version-controlled code, not manual clicks', isCorrect: true },
      { id: 'd', text: 'Models are drawn by hand and then photographed', isCorrect: false },
    ],
    explanation: 'Modeling as code means your transformation logic lives as text files in version control (like Git), so it can be reviewed, tested, and reproduced — instead of being a pile of manual, one-off steps no one can audit.',
    tags: ['modeling-as-code', 'vocabulary'],
  },
  {
    id: 'de-xform-4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_TRANSFORMATION_TOOLS,
    course: Course.DATA_ENGINEERING,
    question: 'What is a benefit of defining transformations as code?',
    options: [
      { id: 'a', text: 'It guarantees the data will never contain mistakes', isCorrect: false },
      { id: 'b', text: 'It removes the need to store the data anywhere', isCorrect: false },
      { id: 'c', text: 'It makes the warehouse run without any compute', isCorrect: false },
      { id: 'd', text: 'The logic can be reviewed, tested, and reproduced', isCorrect: true },
    ],
    explanation: 'Code-based transforms can be peer-reviewed, automatically tested, and re-run to get the same result. That brings software engineering discipline to data, making pipelines far more reliable than ad-hoc manual steps.',
    tags: ['modeling-as-code', 'benefits'],
  },
  {
    id: 'de-xform-5',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_TRANSFORMATION_TOOLS,
    course: Course.DATA_ENGINEERING,
    question: 'A dbt "model" is essentially…',
    options: [
      { id: 'a', text: 'a SQL SELECT that defines a table or view', isCorrect: true },
      { id: 'b', text: 'a machine-learning algorithm', isCorrect: false },
      { id: 'c', text: 'a physical server in the cloud', isCorrect: false },
      { id: 'd', text: 'a chart shown on a dashboard', isCorrect: false },
    ],
    explanation: 'In dbt, a model is just a SQL SELECT statement saved in a file. dbt turns that SELECT into a table or view in the warehouse. Despite the name, it has nothing to do with machine-learning models.',
    tags: ['dbt', 'model'],
  },
  {
    id: 'de-xform-6',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_TRANSFORMATION_TOOLS,
    course: Course.DATA_ENGINEERING,
    question: 'Why does dbt build a dependency graph (a DAG) of your models?',
    options: [
      { id: 'a', text: 'To draw a pretty picture for the company website', isCorrect: false },
      { id: 'b', text: 'To run each model in the correct order automatically', isCorrect: true },
      { id: 'c', text: 'To delete any model that is used more than once', isCorrect: false },
      { id: 'd', text: 'To encrypt the models so no one can read them', isCorrect: false },
    ],
    explanation: 'Models often depend on other models (one SELECTs from another). dbt reads those references to build a DAG (directed acyclic graph) and runs models in dependency order, so each one is built only after the models it relies on.',
    tags: ['dbt', 'dag', 'dependencies'],
  },
  {
    id: 'de-xform-7',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_TRANSFORMATION_TOOLS,
    course: Course.DATA_ENGINEERING,
    question: 'dbt lets you write "tests" on your models. What do these usually check?',
    options: [
      { id: 'a', text: 'That the warehouse server has enough disk space', isCorrect: false },
      { id: 'b', text: 'That the dashboard uses an approved colour scheme', isCorrect: false },
      { id: 'c', text: 'Data quality rules, like a column being unique or not null', isCorrect: true },
      { id: 'd', text: 'That the SQL was typed using a specific keyboard', isCorrect: false },
    ],
    explanation: 'dbt tests assert expectations about the data: a key is unique, a column is never null, values fall in an allowed set, a foreign key matches. Failing tests catch data-quality problems before bad data reaches users.',
    tags: ['dbt', 'data-quality', 'testing'],
  },
  {
    id: 'de-xform-8',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_TRANSFORMATION_TOOLS,
    course: Course.DATA_ENGINEERING,
    question: 'How is using dbt better than a folder of hand-run SQL scripts?',
    options: [
      { id: 'a', text: 'It makes the warehouse storage completely free', isCorrect: false },
      { id: 'b', text: 'It removes the need to ever write any SQL', isCorrect: false },
      { id: 'c', text: 'It physically speeds up the warehouse hardware', isCorrect: false },
      { id: 'd', text: 'It runs models in order, tests them, and tracks lineage', isCorrect: true },
    ],
    explanation: 'Loose SQL scripts must be run in the right order by hand, with no tests or documentation. dbt automates ordering via the DAG, runs data tests, generates docs and lineage, and version-controls everything — turning ad-hoc SQL into a maintainable project.',
    tags: ['dbt', 'benefits'],
  },
  {
    id: 'de-xform-9',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_TRANSFORMATION_TOOLS,
    course: Course.DATA_ENGINEERING,
    question: 'SQLMesh is an alternative to dbt. What is one capability it is known for?',
    options: [
      { id: 'a', text: 'Understanding column-level changes to avoid needless rebuilds', isCorrect: true },
      { id: 'b', text: 'It stores data without needing any warehouse', isCorrect: false },
      { id: 'c', text: 'Drawing dashboards directly from raw files', isCorrect: false },
      { id: 'd', text: 'Replacing SQL entirely with a new language', isCorrect: false },
    ],
    explanation: 'SQLMesh analyses how models change at the column level, so it can tell which downstream models genuinely need rebuilding (and which do not). Combined with features like virtual environments, this aims to make changes cheaper and safer than a naive full rebuild.',
    tags: ['sqlmesh', 'lineage'],
  },
  {
    id: 'de-xform-10',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_TRANSFORMATION_TOOLS,
    course: Course.DATA_ENGINEERING,
    question: 'What problem does a "semantic layer" solve on top of transformed tables?',
    options: [
      { id: 'a', text: 'It compresses the tables to take up less space', isCorrect: false },
      { id: 'b', text: 'It gives every metric one shared, consistent definition', isCorrect: true },
      { id: 'c', text: 'It encrypts the tables so only one tool can read them', isCorrect: false },
      { id: 'd', text: 'It deletes any table that is queried too often', isCorrect: false },
    ],
    explanation: 'A semantic layer defines business metrics (like "active user" or "revenue") once, centrally, so every dashboard and query computes them the same way. It prevents the common problem of different teams reporting different numbers for the "same" metric.',
    tags: ['semantic-layer', 'metrics'],
  },
];
