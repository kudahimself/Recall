import { Question, QuestionType, Difficulty, Topic, CodeLanguage, Course } from '../types';

export const prismaQuestions: Question[] = [

  // =====================================================================
  // NEXT_PRISMA (10 questions)
  // =====================================================================

  // BEGINNER faded (Parsons + Cloze) — lower-load scaffold before cold coding
  {
    id: 'prisma-parsons-1',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_PRISMA,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question:
      'Assemble a Prisma `User` model in schema.prisma. The user has an auto-incrementing integer primary key, a unique email, an optional name, and a one-to-many relation to posts. Arrange the field lines in this order: id, email, name, posts.',
    correctOrder: [
      'model User {',
      '  id Int @id @default(autoincrement())',
      '  email String @unique',
      '  name String?',
      '  posts Post[]',
      '}',
    ],
    distractorLines: [
      '  id Int @default(autoincrement())',
      '  email String',
      '  name String',
    ],
    solution: `model User {
  id Int @id @default(autoincrement())
  email String @unique
  name String?
  posts Post[]
}`,
    explanation:
      'A primary key needs @id, not just @default(autoincrement()) — the latter only sets the default value. @unique enforces no duplicate emails at the database level. String? (with the trailing ?) makes name nullable; without the ? Prisma treats it as required. posts Post[] is the virtual "many" side of the relation — it stores no column itself; the foreign key lives on Post.',
    hints: [
      '@id marks the primary key; @default(autoincrement()) only supplies the value',
      'The ? suffix makes a field optional (nullable)',
      'The array side (Post[]) is a virtual relation field with no column',
    ],
    tags: ['prisma', 'schema', 'models', 'parsons'],
    concepts: ['prisma-schema-relations'],
  },

  {
    id: 'prisma-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_PRISMA,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question:
      'Complete this Prisma query that finds every post whose title holds the substring "prisma" and returns each post together with its author.',
    template: `const posts = await prisma.post.findMany({
  where: { title: { ___: "prisma" } },
  ___: { author: true },
});`,
    blanks: ['contains', 'include'],
    solution: `const posts = await prisma.post.findMany({
  where: { title: { contains: "prisma" } },
  include: { author: true },
});`,
    explanation:
      'The `contains` filter does a substring match (SQL LIKE). `include` pulls in a relation alongside the base record — here it JOINs the author so each post object carries its full User. Use `select` instead when you want only specific fields rather than everything plus relations.',
    hints: [
      'The string filter that matches a substring',
      'The option that loads a relation alongside the record',
    ],
    tags: ['prisma', 'queries', 'findMany', 'cloze'],
    concepts: ['prisma-schema-relations', 'prisma-include-select'],
  },

  {
    id: 'prisma-cloze-2',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_PRISMA,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question:
      'Fill in the two Prisma schema directives: one supplies the auto-increment default for the primary key, the other declares the relation that links the foreign key to the parent record.',
    template: `model Post {
  id Int @id @___(autoincrement())
  title String
  authorId Int
  author User @___(fields: [authorId], references: [id])
}`,
    blanks: ['default', 'relation'],
    solution: `model Post {
  id Int @id @default(autoincrement())
  title String
  authorId Int
  author User @relation(fields: [authorId], references: [id])
}`,
    explanation:
      '@default(autoincrement()) tells the database to generate the next integer for new rows. @relation declares how the foreign key column (authorId) maps to the referenced primary key (User.id) — this is the "one" side that actually stores the foreign key, complementing the virtual Post[] field on User.',
    hints: [
      'The directive that supplies a generated value',
      'The directive that wires a foreign key to its parent',
    ],
    tags: ['prisma', 'schema', 'relations', 'cloze'],
    concepts: ['prisma-schema-relations'],
  },

  // 1. Coding: Define a Prisma schema with User and Post models
  {
    id: 'prisma-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_PRISMA,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Define a Prisma schema with a User model and a Post model.\n\nRequirements:\n- User model: id (Int, auto-increment, primary key), email (String, unique), name (String, optional), posts (relation to Post[])\n- Post model: id (Int, auto-increment, primary key), title (String), content (String), authorId (Int, foreign key to User), author (relation to User)\n\nUse the `datasource db` block with provider "postgresql" and `generator client` block for prisma-client-js.\n\nWrite the full schema.prisma file contents.',
    starterCode: `// schema.prisma

generator client {
  // configure the generator
}

datasource db {
  // configure the datasource
}

model User {
  // define User fields and relations
}

model Post {
  // define Post fields and relations
}`,
    testCases: [
      {
        input: 'generator block',
        expectedOutput: 'generator client { provider = "prisma-client-js" }',
        description: 'Should configure prisma-client-js generator',
      },
      {
        input: 'User model fields',
        expectedOutput: 'id Int @id @default(autoincrement()) email String @unique name String? posts Post[]',
        description: 'Should define User with id, unique email, optional name, and posts relation',
      },
      {
        input: 'Post model fields',
        expectedOutput: 'id Int @id @default(autoincrement()) title String content String authorId Int author User @relation(fields: [authorId], references: [id])',
        description: 'Should define Post with id, title, content, foreign key authorId, and author relation',
      },
    ],
    solution: `// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  posts Post[]
}

model Post {
  id       Int    @id @default(autoincrement())
  title    String
  content  String
  authorId Int
  author   User   @relation(fields: [authorId], references: [id])
}`,
    explanation: 'A Prisma schema has three core blocks: generator (tells Prisma what client to build), datasource (which database to connect to), and models (your data shape). Relations in Prisma are defined on BOTH sides: the "many" side (User.posts) is a virtual field with no column, while the "one" side (Post.author) stores the actual foreign key (authorId). The @relation directive explicitly maps the foreign key field to the referenced primary key. The ? after String makes the field optional (nullable in the database). This two-sided approach is why Prisma can auto-generate type-safe includes and nested queries.',
    hints: [
      'Use @id and @default(autoincrement()) for primary keys',
      'Use @unique on the email field',
      'String? makes a field optional (nullable)',
      '@relation(fields: [authorId], references: [id]) links the foreign key to the parent',
    ],
    tieredHints: {
      apiSignature: '@relation(fields: FieldReference[], references: FieldReference[], onDelete?: ReferentialAction)',
      skeleton: `model User {
  id    Int     @____ @default(____())
  email String  @____
  name  String____
  posts ____[]
}

model Post {
  id       Int    @____ @default(____())
  title    String
  content  String
  authorId Int
  author   ____   @____(fields: [____], references: [____])
}`,
    },
    tags: ['prisma', 'schema', 'models', 'relations'],
    concepts: ['prisma-schema-relations'],
  },

  // 2. Coding: Prisma Client queries — findMany and create with nested relation
  {
    id: 'prisma-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_PRISMA,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Write two Prisma Client queries:\n\n1. `getPublishedPosts`: Use `findMany` to get all posts where the title contains "prisma" (case-insensitive), ordered by `id` descending, and include the author\'s name and email.\n\n2. `createUserWithPost`: Use `create` to make a new user with email "alice@prisma.io", name "Alice", and simultaneously create a connected post with title "My First Post" and content "Hello world!".\n\nAssume `prisma` is already imported as a PrismaClient instance.',
    starterCode: `import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Query 1: Find posts containing "prisma" in title (case-insensitive)
// Order by id descending, include author
async function getPublishedPosts() {
  const posts = await prisma.post.findMany({
    // Add where, orderBy, and include
  });
  return posts;
}

// Query 2: Create a user with a connected post in one operation
async function createUserWithPost() {
  const user = await prisma.user.create({
    // Add data with nested post creation
  });
  return user;
}`,
    testCases: [
      {
        input: 'findMany query',
        expectedOutput: 'prisma.post.findMany({ where: { title: { contains: "prisma", mode: "insensitive" } }, orderBy: { id: "desc" }, include: { author: true } })',
        description: 'Should use findMany with where/contains/mode, orderBy desc, and include author',
      },
      {
        input: 'create with nested relation',
        expectedOutput: 'prisma.user.create({ data: { email: "alice@prisma.io", name: "Alice", posts: { create: { title: "My First Post", content: "Hello world!" } } } })',
        description: 'Should create user with nested post using posts: { create: {...} }',
      },
    ],
    solution: `import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Query 1: Find posts containing "prisma" in title (case-insensitive)
// Order by id descending, include author
async function getPublishedPosts() {
  const posts = await prisma.post.findMany({
    where: {
      title: {
        contains: "prisma",
        mode: "insensitive",
      },
    },
    orderBy: {
      id: "desc",
    },
    include: {
      author: true,
    },
  });
  return posts;
}

// Query 2: Create a user with a connected post in one operation
async function createUserWithPost() {
  const user = await prisma.user.create({
    data: {
      email: "alice@prisma.io",
      name: "Alice",
      posts: {
        create: {
          title: "My First Post",
          content: "Hello world!",
        },
      },
    },
  });
  return user;
}`,
    explanation: 'Prisma Client queries are fully type-safe — your IDE will autocomplete every field, filter, and relation. The `contains` filter with `mode: "insensitive"` translates to a case-insensitive LIKE query in SQL. The `include: { author: true }` tells Prisma to JOIN the User table and return the full author object alongside each post. For nested creation, `posts: { create: {...} }` generates an INSERT for both the user AND the post in a single transaction — Prisma automatically sets the foreign key (authorId) on the post. This is why Prisma is so powerful: one query object replaces what would be multiple raw SQL statements with manual ID management.',
    hints: [
      'Use `contains` and `mode: "insensitive"` for case-insensitive search',
      'orderBy takes an object like { field: "desc" }',
      'Nested creates use the relation name (posts) with { create: {...} }',
    ],
    tieredHints: {
      apiSignature: 'prisma.post.findMany(options) / prisma.user.create(options)',
      skeleton: `async function getPublishedPosts() {
  return prisma.post.findMany({
    where: { title: { ____: "prisma", mode: "insensitive" } },
    orderBy: { id: "____" },
    ____: { author: true },
  });
}

async function createUserWithPost() {
  return prisma.user.create({
    data: {
      email: "alice@prisma.io",
      name: "Alice",
      posts: { ____: { title: "My First Post", content: "Hello world!" } },
    },
  });
}`,
    },
    tags: ['prisma', 'queries', 'findMany', 'create', 'nested-relations'],
    concepts: ['prisma-schema-relations'],
  },

  // 3. MC: migrate dev vs db push
  {
    id: 'prisma-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_PRISMA,
    course: Course.WEB_DEV,
    question: 'You are working on a Next.js project with Prisma. What is the key difference between `npx prisma migrate dev` and `npx prisma db push`?',
    options: [
      { id: 'a', text: '`db push` applies the schema to the database AND creates a migration SQL file in prisma/migrations for version control, while `migrate dev` only syncs the schema without saving history', isCorrect: false },
      { id: 'b', text: 'They are identical commands — `db push` is just an alias for `migrate dev`', isCorrect: false },
      { id: 'c', text: '`migrate dev` creates a timestamped SQL migration file in prisma/migrations/ for version control and team collaboration, while `db push` directly syncs the schema to the database without creating migration files', isCorrect: true },
      { id: 'd', text: '`migrate dev` is for development databases only and `db push` is for production deployments', isCorrect: false },
    ],
    explanation: '`prisma migrate dev` generates a SQL migration file (like 20240101_add_user_table/migration.sql) that you commit to git. This gives your team a reviewable, replayable history of every schema change — essential for production deployments and team collaboration. `prisma db push` directly applies your schema.prisma changes to the database without creating any migration files. It is great for rapid prototyping and early development when you are iterating on your schema frequently. In production, you would use `prisma migrate deploy` (not `migrate dev`) to apply committed migrations without generating new ones.',
    hints: [
      'Think about what a team needs to keep database schemas in sync',
      'Consider what happens when you need to deploy schema changes to production',
    ],
    tags: ['prisma', 'migrations', 'db-push', 'workflow'],
    concepts: ['prisma-schema-relations'],
  },

  // 4. MC: What is Prisma Client and how is it generated
  {
    id: 'prisma-4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_PRISMA,
    course: Course.WEB_DEV,
    question: 'What is the Prisma Client and how do you generate it?',
    options: [
      { id: 'a', text: 'A REST API client that Prisma hosts in the cloud; you install it with `npm install @prisma/cloud-client`', isCorrect: false },
      { id: 'b', text: 'A generic database driver like pg or mysql2; you import it from "prisma/driver" after running `npx prisma init`', isCorrect: false },
      { id: 'c', text: 'A manually written ORM layer you define in a prisma.config.ts file alongside your schema', isCorrect: false },
      { id: 'd', text: 'An auto-generated, type-safe database client tailored to YOUR schema; you generate it by running `npx prisma generate` after modifying schema.prisma', isCorrect: true },
    ],
    explanation: 'Prisma Client is not a generic library — it is custom-generated code based on YOUR specific schema.prisma file. When you run `npx prisma generate`, Prisma reads your models, fields, and relations, then outputs a fully typed TypeScript/JavaScript client into node_modules/@prisma/client. This is why you get autocomplete for `prisma.user.findMany()` (because User is in your schema) and type errors if you query a field that does not exist. Any time you change your schema, you need to re-run `npx prisma generate` to update the client. This "codegen" approach is what makes Prisma fundamentally different from runtime ORMs like Sequelize or TypeORM.',
    hints: [
      'Think about how Prisma knows the exact shape of your models for autocomplete',
      'The client lives in node_modules/@prisma/client',
    ],
    tags: ['prisma', 'prisma-client', 'codegen', 'type-safety'],
    concepts: ['prisma-schema-relations'],
  },

  // 4b. Cloze fade: $transaction array form
  {
    id: 'prisma-transaction-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_PRISMA,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Fill in the Prisma Client method that runs an array of operations atomically — all succeed or all roll back.',
    template: `const [user, post] = await prisma.___([
  prisma.user.update({ where: { id: 1 }, data: { name: "Alice" } }),
  prisma.post.create({ data: { title: "New Post", authorId: 1 } }),
]);`,
    blanks: ['$transaction'],
    solution: 'const [user, post] = await prisma.$transaction([\n  prisma.user.update({ where: { id: 1 }, data: { name: "Alice" } }),\n  prisma.post.create({ data: { title: "New Post", authorId: 1 } }),\n]);',
    explanation: '$transaction takes an array of Prisma operations and runs them in a single database transaction — if any operation fails, all are rolled back, guaranteeing atomicity for related writes.',
    hints: ['A single Prisma Client method, prefixed with $.'],
    tags: ['prisma', 'transaction', 'atomicity', 'cloze'],
    concepts: ['prisma-schema-relations'],
  },

  // 5. Coding: Transaction with update and nested create
  {
    id: 'prisma-5',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_PRISMA,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Write a function that uses `prisma.$transaction` to perform two operations atomically:\n\n1. Update the user with id 1 — change their name to "Alice Updated"\n2. Create a new post for that user with title "Transaction Post" and content "Created in a transaction"\n\nBoth operations must succeed or both must fail. Use the sequential transaction API (array of promises).\n\nAssume `prisma` is already instantiated.',
    starterCode: `import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function updateUserAndCreatePost() {
  // Use prisma.$transaction to run both operations atomically
  const [updatedUser, newPost] = await prisma.$transaction([
    // Operation 1: Update user name
    // Operation 2: Create a new post
  ]);

  return { updatedUser, newPost };
}`,
    testCases: [
      {
        input: '$transaction with array',
        expectedOutput: 'prisma.$transaction([ prisma.user.update({ where: { id: 1 }, data: { name: "Alice Updated" } }), prisma.post.create({ data: { title: "Transaction Post", content: "Created in a transaction", authorId: 1 } }) ])',
        description: 'Should use $transaction with an array containing update and create operations',
      },
    ],
    solution: `import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function updateUserAndCreatePost() {
  // Use prisma.$transaction to run both operations atomically
  const [updatedUser, newPost] = await prisma.$transaction([
    prisma.user.update({
      where: { id: 1 },
      data: { name: "Alice Updated" },
    }),
    prisma.post.create({
      data: {
        title: "Transaction Post",
        content: "Created in a transaction",
        authorId: 1,
      },
    }),
  ]);

  return { updatedUser, newPost };
}`,
    explanation: 'Prisma\'s `$transaction` accepts an array of Prisma operations and executes them in a single database transaction. If ANY operation fails, ALL changes are rolled back — this guarantees atomicity. This is critical when related data must stay consistent (e.g., transferring money between accounts, or creating a user and their settings together). Prisma also supports an interactive transaction API (`prisma.$transaction(async (tx) => { ... })`) where you get a transaction client `tx` and can write conditional logic, but the array form is simpler when you just need multiple independent operations to succeed or fail together.',
    hints: [
      '$transaction takes an array of Prisma promises',
      'Use prisma.user.update with where and data',
      'Use prisma.post.create with authorId to connect to the user',
    ],
    tieredHints: {
      apiSignature: 'prisma.$transaction([ prisma.user.update(...), prisma.post.create(...) ])',
      skeleton: `async function updateUserAndCreatePost() {
  const [updatedUser, newPost] = await prisma.____([
    prisma.user.____({
      where: { id: 1 },
      data: { name: "Alice Updated" },
    }),
    prisma.post.____({
      data: { title: "Transaction Post", content: "Created in a transaction", authorId: 1 },
    }),
  ]);
  return { updatedUser, newPost };
}`,
    },
    tags: ['prisma', 'transaction', 'atomicity', 'update', 'create'],
    concepts: ['prisma-schema-relations'],
  },

  // 6. MC: N+1 problem in Prisma
  {
    id: 'prisma-6',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_PRISMA,
    course: Course.WEB_DEV,
    question: 'You have a page that lists 50 users and each user\'s posts. Your colleague wrote this code:\n\n```typescript\nconst users = await prisma.user.findMany();\nfor (const user of users) {\n  user.posts = await prisma.post.findMany({ where: { authorId: user.id } });\n}\n```\n\nWhat problem does this code have, and how should it be fixed?',
    options: [
      { id: 'a', text: 'It is fine — Prisma automatically batches sequential queries like this into a single round trip behind the scenes, so no code change is needed', isCorrect: false },
      { id: 'b', text: 'This is the N+1 problem: 1 query for users plus 50 for posts. Fix it with `include: { posts: true }` in findMany, which generates a single JOIN query', isCorrect: true },
      { id: 'c', text: 'The code is fine for small datasets like this one; N+1 only becomes a real problem once a table has millions of rows', isCorrect: false },
      { id: 'd', text: 'The fix is to drop Prisma for this query and hand-write a raw SQL JOIN, since the query builder cannot express relation loading', isCorrect: false },
    ],
    explanation: 'The N+1 problem is one of the most common performance pitfalls in any ORM. The original code makes 1 query for users, then N additional queries (one per user) for their posts. With 50 users, that is 51 database round-trips instead of 1-2. The fix is simple: `prisma.user.findMany({ include: { posts: true } })`. Prisma translates this into efficient SQL (typically a JOIN or a second IN query) that fetches everything in minimal round-trips. You can also use `select` instead of `include` if you only need specific fields, which reduces data transfer. This is why Prisma\'s relation loading is declarative — you describe what data you want, and Prisma optimizes the queries.',
    hints: [
      'Count how many database queries the loop generates',
      'Think about what Prisma\'s include option does under the hood',
    ],
    tags: ['prisma', 'n-plus-one', 'performance', 'include', 'relations'],
    concepts: ['prisma-schema-relations', 'prisma-include-select'],
  },

  // 7. Coding: Prisma singleton for Next.js
  {
    id: 'prisma-7',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_PRISMA,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Create a Prisma Client singleton for use in a Next.js application.\n\nFile: lib/prisma.ts\n\nIn development, Next.js hot-reloads modules on every save. Each reload creates a new PrismaClient instance, which opens a new database connection pool. This quickly exhausts your database connections.\n\nThe fix: store the PrismaClient instance on `globalThis` so it survives hot reloads.\n\n- Declare a global type that adds `prisma` to globalThis\n- Create a function or constant that returns an existing global instance or creates a new one\n- In development, store the instance on globalThis\n- Export the singleton instance as the default export',
    starterCode: `// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

// Declare a global variable type for prisma

// Create or reuse the PrismaClient instance

// Store on globalThis in development to survive hot reloads

// Export the singleton
`,
    testCases: [
      {
        input: 'global type declaration',
        expectedOutput: 'globalThis with prisma property of type PrismaClient',
        description: 'Should declare prisma on globalThis to survive hot reloads',
      },
      {
        input: 'singleton logic',
        expectedOutput: 'globalThis.prisma ?? new PrismaClient() with conditional assignment in development',
        description: 'Should reuse existing global instance or create a new one',
      },
    ],
    solution: `// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;`,
    explanation: 'This pattern solves a real production problem: Next.js dev server hot-reloads modules on every file save, which re-executes module-level code. Without the singleton, each reload creates a new PrismaClient (and its connection pool), eventually hitting "too many connections" errors. By casting globalThis and storing the instance there, the same PrismaClient survives across hot reloads. We only do this in development because production builds run module initialization once. The `??` (nullish coalescing) operator returns the left side if it is not null/undefined, otherwise creates a new client. This pattern is recommended in the official Prisma docs for Next.js integration.',
    hints: [
      'globalThis persists across module re-evaluations in dev',
      'Use nullish coalescing (??) to reuse or create',
      'Only assign to globalThis in non-production environments',
    ],
    tieredHints: {
      apiSignature: 'new PrismaClient(options?: PrismaClientOptions)',
      skeleton: `import { PrismaClient } from "@prisma/client";

const globalForPrisma = ____ as unknown as {
  ____: PrismaClient | undefined;
};

const prisma = globalForPrisma.____ ____ ____();

if (process.env.____ !== "____") {
  globalForPrisma.____ = prisma;
}

export default prisma;`,
    },
    tags: ['prisma', 'nextjs', 'singleton', 'connection-pooling', 'hot-reload'],
    concepts: ['prisma-schema-relations', 'pattern-creational'],
  },

  // 8. MC: include vs select
  {
    id: 'prisma-8',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_PRISMA,
    course: Course.WEB_DEV,
    question: 'What is the difference between `include` and `select` in a Prisma query?\n\n```typescript\n// Option A\nprisma.user.findMany({ include: { posts: true } })\n\n// Option B\nprisma.user.findMany({ select: { name: true, posts: true } })\n```',
    options: [
      { id: 'a', text: 'They are interchangeable — both fetch relations and you can use either one', isCorrect: false },
      { id: 'b', text: '`include` adds relations to ALL scalar fields (returns the full user object + posts), while `select` returns ONLY the fields you specify (just name and posts, no id or email) — `select` is more efficient when you need fewer fields', isCorrect: true },
      { id: 'c', text: '`include` is for one-to-many relations and `select` is for one-to-one relations', isCorrect: false },
      { id: 'd', text: '`select` only works with scalar fields and cannot load relations — you must use `include` for any relation', isCorrect: false },
    ],
    explanation: '`include` means "give me everything on this model AND also load these relations." The result includes all scalar fields (id, email, name) plus the included relations (posts). `select` means "give me ONLY these specific fields." If you use `select: { name: true, posts: true }`, the result will ONLY have name and posts — no id, no email. This is important for two reasons: (1) performance — selecting fewer fields means less data transferred from the database, and (2) security — you can avoid accidentally exposing sensitive fields like password hashes. You cannot use `include` and `select` at the same level in the same query — they are mutually exclusive.',
    hints: [
      'Think about what fields appear in the result object for each approach',
      'Consider which approach sends less data from the database',
    ],
    tags: ['prisma', 'include', 'select', 'performance', 'queries'],
    concepts: ['prisma-schema-relations', 'prisma-include-select'],
  },

  // 9. Coding: Cascading delete
  {
    id: 'prisma-9',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_PRISMA,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Modify the Prisma schema and write a delete query so that deleting a User automatically deletes all their Posts.\n\nPart 1: Show the updated Post model with `onDelete: Cascade` on the author relation.\nPart 2: Write a `deleteUser` function that deletes a user by their id. Because of the cascade, all their posts will be automatically deleted by the database.\n\nAssume the User model is already defined with id, email, name, and posts relation.',
    starterCode: `// Part 1: Updated Post model in schema.prisma
// The current Post model has id, title, content, authorId, and an author
// relation to User. Add the cascade behavior to that relation.

// Part 2: Delete function
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function deleteUser(userId: number) {
  // Delete the user — cascade will handle posts
}`,
    testCases: [
      {
        input: 'schema with onDelete Cascade',
        expectedOutput: 'author User @relation(fields: [authorId], references: [id], onDelete: Cascade)',
        description: 'Should add onDelete: Cascade to the author relation in Post model',
      },
      {
        input: 'delete query',
        expectedOutput: 'prisma.user.delete({ where: { id: userId } })',
        description: 'Should delete user by id — cascade handles related posts',
      },
    ],
    solution: `// Part 1: Updated Post model in schema.prisma
// model Post {
//   id       Int    @id @default(autoincrement())
//   title    String
//   content  String
//   authorId Int
//   author   User   @relation(fields: [authorId], references: [id], onDelete: Cascade)
// }

// Part 2: Delete function
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function deleteUser(userId: number) {
  const deletedUser = await prisma.user.delete({
    where: { id: userId },
  });
  return deletedUser;
}`,
    explanation: 'Without `onDelete: Cascade`, trying to delete a user who has posts would throw a foreign key constraint error — the database refuses to delete a row that other rows depend on. `onDelete: Cascade` tells the database: "when the referenced User is deleted, automatically delete all Posts that reference them." This happens at the DATABASE level (not in Prisma Client code), making it atomic and reliable. Alternatives include `onDelete: SetNull` (set authorId to null, requiring the field to be optional) and `onDelete: Restrict` (the default — prevent deletion if related records exist). Choose Cascade for "parent owns children" relationships where children have no meaning without the parent.',
    hints: [
      'onDelete: Cascade goes inside the @relation directive',
      'With cascade in place, a simple prisma.user.delete is all you need',
      'The database handles deleting related records automatically',
    ],
    tieredHints: {
      apiSignature: '@relation(fields, references, onDelete?: ReferentialAction) / prisma.<model>.delete(args: { where }) -> Promise<T>',
      skeleton: `// Post model in schema.prisma
author User @relation(fields: [authorId], references: [id], ____: ____)

// deleteUser function
async function deleteUser(userId: number) {
  return prisma.user.____({
    ____: { id: userId },
  });
}`,
    },
    tags: ['prisma', 'cascade', 'delete', 'referential-actions', 'schema'],
    concepts: ['prisma-schema-relations', 'web-css-specificity'],
  },

  // 10. MC: Connection pooling in serverless
  {
    id: 'prisma-10',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.NEXT_PRISMA,
    course: Course.WEB_DEV,
    question: 'Your Next.js app deployed on Vercel (serverless) starts throwing "too many connections" errors from your PostgreSQL database during traffic spikes. Why does this happen, and what is the recommended solution?',
    options: [
      { id: 'a', text: 'Serverless functions reuse a single persistent connection, so the issue must be a memory leak in your code; fix it by restarting the database', isCorrect: false },
      { id: 'b', text: 'PostgreSQL has a hard limit of 10 connections; upgrade to a database that supports more connections like MongoDB', isCorrect: false },
      { id: 'c', text: 'Each serverless function invocation can spin up its own PrismaClient with its own connection pool. During traffic spikes, hundreds of instances open connections simultaneously, exhausting the database limit. Use an external connection pooler like PgBouncer or Prisma Accelerate to multiplex many client connections over fewer database connections', isCorrect: true },
      { id: 'd', text: 'This only happens in development due to hot reloading; the globalThis singleton pattern fixes it in production too', isCorrect: false },
    ],
    explanation: 'Traditional servers maintain a single connection pool shared across all requests. Serverless is fundamentally different: each function invocation may run in an isolated container with its own PrismaClient and connection pool. During a traffic spike, if 200 serverless functions spin up simultaneously, each opening 5 connections (the default pool size), that is 1,000 database connections — far exceeding typical PostgreSQL limits (usually 100-300). The solution is an external connection pooler that sits between your serverless functions and the database. PgBouncer or Prisma Accelerate accepts thousands of incoming connections but maintains a small, fixed pool of actual database connections, queuing excess requests. The globalThis pattern (option D) only helps with Next.js dev hot reloading — it does nothing for serverless cold starts in production.',
    hints: [
      'Think about what happens when 200 serverless functions start at once',
      'Each serverless instance has its own memory space and connection pool',
    ],
    tags: ['prisma', 'serverless', 'connection-pooling', 'vercel', 'pgbouncer'],
    concepts: ['prisma-schema-relations'],
  },

  // 11. Cloze: create + createMany
  {
    id: 'prisma-cloze-create',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_PRISMA,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Complete the two insert calls: one creates a single tag, the other bulk-inserts an array of tags in one round trip, skipping any that would violate a unique constraint.',
    template: `const tag = await prisma.tag.___({ data: { label: "featured" } });

const result = await prisma.tag.___({
  data: [{ label: "sale" }, { label: "new" }],
  skipDuplicates: true,
});`,
    blanks: ['create', 'createMany'],
    solution: `const tag = await prisma.tag.create({ data: { label: "featured" } });

const result = await prisma.tag.createMany({
  data: [{ label: "sale" }, { label: "new" }],
  skipDuplicates: true,
});`,
    explanation: '`create` inserts one row and returns the full created record. `createMany` inserts an array of rows in a single query but returns only a `{ count }` object, not the created records themselves - use it for bulk seeding where you do not need the rows back. `skipDuplicates` silently skips rows that would violate a unique constraint instead of throwing.',
    hints: [
      'The single-row insert method',
      'The bulk-insert method that takes an array under `data`',
    ],
    tags: ['prisma', 'create', 'createMany', 'cloze'],
    concepts: ['prisma-schema-relations'],
  },

  // 12. Coding: createMany bulk insert
  {
    id: 'prisma-11',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_PRISMA,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Write a function `seedTags` that bulk-inserts three Tag rows in one query: labels "sale", "new", and "featured". Skip any that already exist instead of throwing. Return the number of rows actually created.\n\nAssume `prisma` is already instantiated and the Tag model has a unique `label` field.',
    starterCode: `import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function seedTags() {
  // Bulk-insert the three tags, skipping duplicates
}`,
    testCases: [
      {
        input: 'createMany call',
        expectedOutput: 'prisma.tag.createMany({ data: [{ label: "sale" }, { label: "new" }, { label: "featured" }], skipDuplicates: true })',
        description: 'Should bulk-insert three tags with skipDuplicates',
      },
    ],
    solution: `import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function seedTags() {
  const result = await prisma.tag.createMany({
    data: [{ label: "sale" }, { label: "new" }, { label: "featured" }],
    skipDuplicates: true,
  });
  return result.count;
}`,
    explanation: '`createMany` sends one INSERT statement for the whole array instead of one round trip per row - far cheaper than looping `create` calls. It returns `{ count }`, the number of rows actually inserted, not the rows themselves. `skipDuplicates` makes reseeding idempotent: rerunning this function will not throw once "sale" already exists.',
    hints: [
      'createMany takes `data` as an array of row objects',
      'skipDuplicates: true avoids unique-constraint errors on rerun',
      'The return value has a `count` field',
    ],
    tieredHints: {
      apiSignature: 'prisma.tag.createMany({ data: [...], skipDuplicates: true })',
      skeleton: `async function seedTags() {
  const result = await prisma.tag.____({
    data: [{ label: "sale" }, { label: "new" }, { label: "featured" }],
    ____: true,
  });
  return result.____;
}`,
    },
    tags: ['prisma', 'createMany', 'bulk-insert', 'seeding'],
    concepts: ['prisma-schema-relations'],
  },

  // 13. Cloze: delete + deleteMany with where
  {
    id: 'prisma-cloze-deletemany',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_PRISMA,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Complete the two delete calls: one removes a single post by id, the other removes every post belonging to a given author.',
    template: `const post = await prisma.post.___({ where: { id: 1 } });

const deleted = await prisma.post.___({ where: { authorId: 7 } });`,
    blanks: ['delete', 'deleteMany'],
    solution: `const post = await prisma.post.delete({ where: { id: 1 } });

const deleted = await prisma.post.deleteMany({ where: { authorId: 7 } });`,
    explanation: '`delete` requires a `where` that uniquely identifies exactly one row (like a primary key) and returns that row. `deleteMany` accepts any filter and removes every matching row, returning only `{ count }` - it will not error if zero rows match.',
    hints: [
      'The single-row method takes a unique where clause',
      'The bulk method matches on any filter, not just a unique key',
    ],
    tags: ['prisma', 'delete', 'deleteMany', 'cloze'],
    concepts: ['prisma-schema-relations'],
  },

  // 14. Cloze: enum in schema
  {
    id: 'prisma-cloze-enum',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_PRISMA,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Complete the schema: declare a Role enum with USER and ADMIN, then give the User model a role field of that type, defaulting to USER.',
    template: `___ Role {
  USER
  ADMIN
}

model User {
  id   Int  @id @default(autoincrement())
  role Role @___(USER)
}`,
    blanks: ['enum', 'default'],
    solution: `enum Role {
  USER
  ADMIN
}

model User {
  id   Int  @id @default(autoincrement())
  role Role @default(USER)
}`,
    explanation: '`enum` declares a fixed set of allowed string values at the database level (Postgres creates a native enum type). A model field typed with that enum can only ever hold one of its listed values, and `@default(USER)` supplies the value for rows that do not specify one - both catch invalid values at write time instead of leaking bad data into the app layer.',
    hints: [
      'The schema keyword that declares a fixed set of values',
      'The directive that supplies a fallback value',
    ],
    tags: ['prisma', 'enum', 'schema', 'cloze'],
    concepts: ['prisma-schema-relations'],
  },

  // 15. Cloze: where operators gt/gte, in
  {
    id: 'prisma-cloze-whereops',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_PRISMA,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Complete the two filters: one matches users at least 18 years old, the other matches posts whose id is one of a given set.',
    template: `const adults = await prisma.user.findMany({
  where: { age: { ___: 18 } },
});

const selected = await prisma.post.findMany({
  where: { id: { ___: [3, 7, 12] } },
});`,
    blanks: ['gte', 'in'],
    solution: `const adults = await prisma.user.findMany({
  where: { age: { gte: 18 } },
});

const selected = await prisma.post.findMany({
  where: { id: { in: [3, 7, 12] } },
});`,
    explanation: '`gte` (greater-than-or-equal) and `gt` are the comparison operators for numbers and dates. `in` matches any value present in the given array, translating to a SQL `IN (...)` clause - much cheaper than OR-ing several equality checks by hand.',
    hints: [
      'The operator meaning "18 or older"',
      'The operator that matches against a list of values',
    ],
    tags: ['prisma', 'where', 'filters', 'cloze'],
    concepts: ['prisma-schema-relations'],
  },

  // 16. Coding: where operators OR / not terse drill
  {
    id: 'prisma-13',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_PRISMA,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Write a function `getFlaggedPosts` that returns every post where EITHER the title contains "urgent" OR the title contains "important", but NOT the ones written by author id 1.\n\nUse the `OR` and `NOT` where operators.',
    starterCode: `import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function getFlaggedPosts() {
  // Match title contains "urgent" OR "important", excluding authorId 1
}`,
    testCases: [
      {
        input: 'where with OR and NOT',
        expectedOutput: 'prisma.post.findMany({ where: { OR: [{ title: { contains: "urgent" } }, { title: { contains: "important" } }], NOT: { authorId: 1 } } })',
        description: 'Should combine OR for the two title matches with NOT to exclude authorId 1',
      },
    ],
    solution: `import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function getFlaggedPosts() {
  return prisma.post.findMany({
    where: {
      OR: [
        { title: { contains: "urgent" } },
        { title: { contains: "important" } },
      ],
      NOT: { authorId: 1 },
    },
  });
}`,
    explanation: '`OR` takes an array of where conditions - a row matches if ANY of them is true. `NOT` inverts a condition - here it excludes rows matching `{ authorId: 1 }`. Top-level where fields are implicitly ANDed together, so this reads as "(urgent OR important) AND NOT authorId 1".',
    hints: [
      'OR takes an array of where clauses',
      'NOT wraps a single condition to exclude it',
      'Fields at the top level of `where` are ANDed together',
    ],
    tieredHints: {
      apiSignature: 'prisma.post.findMany({ where: { OR: [...], NOT: { authorId: 1 } } })',
      skeleton: `async function getFlaggedPosts() {
  return prisma.post.findMany({
    where: {
      ____: [
        { title: { contains: "urgent" } },
        { title: { contains: "important" } },
      ],
      ____: { authorId: 1 },
    },
  });
}`,
    },
    tags: ['prisma', 'where', 'OR', 'NOT', 'filters'],
    concepts: ['prisma-schema-relations'],
  },

  // 17. Cloze: update vs upsert
  {
    id: 'prisma-cloze-upsert',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_PRISMA,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Complete the upsert: it must supply the data to use when updating an existing row, and the data to use when no row matches and one must be created.',
    template: `const view = await prisma.pageView.upsert({
  where: { path: "/pricing" },
  ___: { count: { increment: 1 } },
  ___: { path: "/pricing", count: 1 },
});`,
    blanks: ['update', 'create'],
    solution: `const view = await prisma.pageView.upsert({
  where: { path: "/pricing" },
  update: { count: { increment: 1 } },
  create: { path: "/pricing", count: 1 },
});`,
    explanation: '`upsert` first tries to find a row matching `where`. If found, it applies `update`; if not, it applies `create`. This avoids the race-prone read-then-branch pattern of "findUnique, then if null create else update" - the database handles the check atomically.',
    hints: [
      'The branch that runs when a matching row already exists',
      'The branch that runs when no row matches',
    ],
    tags: ['prisma', 'upsert', 'update', 'cloze'],
    concepts: ['prisma-schema-relations'],
  },

  // 18. MC: update vs upsert
  {
    id: 'prisma-12',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_PRISMA,
    course: Course.WEB_DEV,
    question: 'Your colleague writes this to record a page view counter:\n\n```typescript\nconst existing = await prisma.pageView.findUnique({ where: { path } });\nif (existing) {\n  await prisma.pageView.update({ where: { path }, data: { count: { increment: 1 } } });\n} else {\n  await prisma.pageView.create({ data: { path, count: 1 } });\n}\n```\n\nWhy is `prisma.pageView.upsert({ where: { path }, update: {...}, create: {...} })` a better fit here?',
    options: [
      { id: 'a', text: 'The findUnique-then-branch version has a race window: two concurrent requests for the same new path can both see "no existing row" and both attempt create, causing a unique-constraint error. upsert lets the database handle the check-and-write atomically in one operation', isCorrect: true },
      { id: 'b', text: 'upsert is purely a stylistic shorthand for the same two database round trips as the findUnique-then-branch code - it still reads then conditionally writes, so it does not change the concurrency behavior at all', isCorrect: false },
      { id: 'c', text: 'upsert is only needed because Prisma throws a runtime error whenever update is called without a prior findUnique earlier in the same function, unlike raw SQL UPDATE statements', isCorrect: false },
      { id: 'd', text: 'The two approaches behave identically under concurrent access; upsert is only faster because it skips validating the where clause before running the query', isCorrect: false },
    ],
    explanation: 'The findUnique-then-branch pattern has a classic time-of-check-to-time-of-use race: between the read and the write, another concurrent request can insert the same row, so both requests see "not found" and both call create, and the second one throws a unique-constraint violation. upsert pushes the check-and-write into a single atomic database operation, eliminating that window entirely. It is not just fewer lines of code - it is a correctness fix under concurrency.',
    hints: [
      'Think about two requests for a brand-new path arriving at the same instant',
      'What happens between the read and the write in the findUnique version?',
    ],
    tags: ['prisma', 'upsert', 'race-condition', 'concurrency'],
    concepts: ['prisma-schema-relations'],
  },

  // 19. Cloze: pagination skip/take
  {
    id: 'prisma-cloze-pagination',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_PRISMA,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Complete the offset-pagination query for page 3 of posts, 10 per page (skip the first 20, take the next 10).',
    template: `const posts = await prisma.post.findMany({
  ___: 20,
  ___: 10,
  orderBy: { id: "asc" },
});`,
    blanks: ['skip', 'take'],
    solution: `const posts = await prisma.post.findMany({
  skip: 20,
  take: 10,
  orderBy: { id: "asc" },
});`,
    explanation: '`skip` discards that many rows from the start of the ordered result, `take` limits how many rows come back after that - together they implement classic offset pagination (page 3 of size 10 skips the first 20 rows). `orderBy` is required for pagination to be stable; without a deterministic order, skip/take can return inconsistent pages.',
    hints: [
      'The option that discards leading rows',
      'The option that caps how many rows come back',
    ],
    tags: ['prisma', 'pagination', 'skip', 'take', 'cloze'],
    concepts: ['prisma-schema-relations'],
  },

  // 20. Coding: cursor-based pagination
  {
    id: 'prisma-14',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_PRISMA,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Write a function `getNextPage` that takes a `lastPostId` and returns the next 10 posts after it, ordered by id ascending, using cursor-based pagination instead of skip/take.\n\nUse `cursor`, `skip: 1` (to exclude the cursor row itself), and `take: 10`.',
    starterCode: `import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function getNextPage(lastPostId: number) {
  // Fetch the next 10 posts after lastPostId using a cursor
}`,
    testCases: [
      {
        input: 'cursor-based query',
        expectedOutput: 'prisma.post.findMany({ cursor: { id: lastPostId }, skip: 1, take: 10, orderBy: { id: "asc" } })',
        description: 'Should use cursor with skip: 1 and take: 10, ordered by id ascending',
      },
    ],
    solution: `import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function getNextPage(lastPostId: number) {
  return prisma.post.findMany({
    cursor: { id: lastPostId },
    skip: 1,
    take: 10,
    orderBy: { id: "asc" },
  });
}`,
    explanation: '`cursor` seeks directly to the row matching the given unique field instead of counting through skipped rows, so performance stays constant no matter how deep the page is - offset pagination with a large `skip` gets slower as the offset grows because the database still has to scan past those rows. `skip: 1` excludes the cursor row itself since it was already shown on the previous page.',
    hints: [
      'cursor takes a unique where-style object, usually { id: ... }',
      'skip: 1 excludes the cursor row itself from the results',
      'A deterministic orderBy is still required',
    ],
    tieredHints: {
      apiSignature: 'prisma.post.findMany({ cursor: { id: lastPostId }, skip: 1, take: 10, orderBy: { id: "asc" } })',
      skeleton: `async function getNextPage(lastPostId: number) {
  return prisma.post.findMany({
    ____: { id: lastPostId },
    ____: 1,
    ____: 10,
    orderBy: { id: "asc" },
  });
}`,
    },
    tags: ['prisma', 'pagination', 'cursor', 'performance'],
    concepts: ['prisma-schema-relations'],
  },

  // 21. MC: skip/take offset vs cursor pagination tradeoffs
  {
    id: 'prisma-15',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_PRISMA,
    course: Course.WEB_DEV,
    question: 'Your app paginates a table with millions of rows. Users on page 2 report snappy loads, but users who jump to page 5,000 report multi-second delays. Why, and what should you switch to?',
    options: [
      { id: 'a', text: 'skip/take always costs the same regardless of the offset, since Prisma compiles it to a single indexed lookup either way; the slowdown at page 5,000 must be an unrelated network or connection-pool issue', isCorrect: false },
      { id: 'b', text: 'The fix is to raise `take` to a much larger page size so fewer page requests are needed overall - this reduces round trips and would resolve the slowdown users see on deep pages', isCorrect: false },
      { id: 'c', text: 'skip/take stops working correctly once a table passes roughly a thousand rows, so Prisma\'s own docs recommend dropping to hand-written raw SQL for any table past that size', isCorrect: false },
      { id: 'd', text: 'A large `skip` still requires the database to scan and discard that many rows before it can return the next page, so cost grows with the offset. Switching to cursor-based pagination (cursor + skip: 1) seeks directly to a row by index, keeping cost roughly constant regardless of how deep the page is', isCorrect: true },
    ],
    explanation: 'Offset pagination (`skip`/`take`) requires the database to walk through and discard `skip` rows before it can start returning results - the deeper the page, the more rows get scanned and thrown away, so cost scales with the offset even though the page size stays constant. Cursor-based pagination avoids this because it seeks directly to a known row (usually via an indexed unique column) and reads forward from there, so page 5,000 costs about the same as page 2.',
    hints: [
      'Think about what the database has to do before it can return row 50,001',
      'Cursor pagination seeks to a row instead of counting up to it',
    ],
    tags: ['prisma', 'pagination', 'cursor', 'performance', 'scale'],
    concepts: ['prisma-schema-relations'],
  },

  // 22. Cloze: count / aggregate
  {
    id: 'prisma-cloze-aggregate',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_PRISMA,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Complete the two aggregate queries: one just counts published posts, the other computes the sum and average of order totals.',
    template: `const published = await prisma.post.___({ where: { published: true } });

const stats = await prisma.order.aggregate({
  ___: { total: true },
  ___: { total: true },
});`,
    blanks: ['count', '_sum', '_avg'],
    solution: `const published = await prisma.post.count({ where: { published: true } });

const stats = await prisma.order.aggregate({
  _sum: { total: true },
  _avg: { total: true },
});`,
    explanation: '`count` returns just a row count for the given filter - cheaper than fetching rows to measure `.length`. `aggregate` computes multiple statistics in one query; `_sum` and `_avg` each take the field(s) to aggregate. Both run entirely in the database instead of pulling raw rows into the app to compute manually.',
    hints: [
      'The method that returns only a row count',
      'The two aggregate fields for total and average',
    ],
    tags: ['prisma', 'count', 'aggregate', 'cloze'],
    concepts: ['prisma-schema-relations'],
  },

  // 23. Parsons: many-to-many implicit join table
  {
    id: 'prisma-parsons-2',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_PRISMA,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Assemble a many-to-many relation between Post and Tag using Prisma\'s implicit join table (no explicit join model). Arrange in this order: Post model, Tag model.',
    correctOrder: [
      'model Post {',
      '  id   Int   @id @default(autoincrement())',
      '  title String',
      '  tags Tag[]',
      '}',
      'model Tag {',
      '  id    Int    @id @default(autoincrement())',
      '  label String @unique',
      '  posts Post[]',
      '}',
    ],
    distractorLines: [
      'model PostTag {',
      '  postId Int',
      '  tagId  Int',
      '}',
    ],
    solution: `model Post {
  id   Int   @id @default(autoincrement())
  title String
  tags Tag[]
}
model Tag {
  id    Int    @id @default(autoincrement())
  label String @unique
  posts Post[]
}`,
    explanation: 'When both sides of a relation are arrays (Post.tags is Tag[] and Tag.posts is Post[]), Prisma infers a many-to-many relation and silently manages a hidden join table for you - no explicit PostTag model is needed. You only need an explicit join model when the relationship itself carries extra data (like an assignedAt timestamp).',
    hints: [
      'Both sides declare the other model as an array field',
      'No join model is needed unless the relation needs its own extra fields',
      'The join-table lines are a distractor - Prisma manages that table implicitly',
    ],
    tags: ['prisma', 'many-to-many', 'relations', 'parsons'],
    concepts: ['prisma-schema-relations'],
  },

  // 24. MC: many-to-many relation concept
  {
    id: 'prisma-16',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_PRISMA,
    course: Course.WEB_DEV,
    question: 'Given this schema:\n\n```prisma\nmodel Post {\n  id   Int   @id @default(autoincrement())\n  tags Tag[]\n}\n\nmodel Tag {\n  id    Int    @id @default(autoincrement())\n  posts Post[]\n}\n```\n\nWhere does Prisma store the association between a Post and a Tag?',
    options: [
      { id: 'a', text: 'Prisma generates and manages a hidden implicit join table (something like _PostToTag) behind the scenes - you never define or query it directly, only the tags and posts relation fields', isCorrect: true },
      { id: 'b', text: 'It adds a nullable tagId column directly on Post, limiting each post to one tag at a time and making a true many-to-many relationship impossible to express', isCorrect: false },
      { id: 'c', text: 'Both models must be manually given a shared array column that stores serialized JSON of related ids, which Prisma then parses on every query', isCorrect: false },
      { id: 'd', text: 'Prisma refuses to create this schema at all - many-to-many relations always require an explicit join model to be defined by hand first', isCorrect: false },
    ],
    explanation: 'Because both Post.tags and Tag.posts are declared as arrays of the other model, Prisma recognizes an implicit many-to-many relation and auto-creates a two-column join table in the database (by default named _PostToTag) to store the pairs. You interact with it only through the relation fields (post.tags, tag.posts, connect/disconnect) - the join table itself is invisible in the Prisma Client API. An explicit join model becomes necessary only when the relationship needs its own extra columns.',
    hints: [
      'Neither model has a foreign key column for the other in the schema',
      'Compare to the one-to-many case, which does store an explicit foreign key',
    ],
    tags: ['prisma', 'many-to-many', 'relations', 'join-table'],
    concepts: ['prisma-schema-relations'],
  },

  // 25. MC: @@unique / @@index awareness
  {
    id: 'prisma-17',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.NEXT_PRISMA,
    course: Course.WEB_DEV,
    question: 'A booking system must ensure no two rows have the same combination of `roomId` and `date` (one booking per room per day), and lookups by `roomId` alone need to stay fast as the table grows. Which schema addition covers both requirements?\n\n```prisma\nmodel Booking {\n  id     Int      @id @default(autoincrement())\n  roomId Int\n  date   DateTime\n}\n```',
    options: [
      { id: 'a', text: 'Add `@unique` to both roomId and date individually - two single-column unique constraints together enforce the same rule as one composite constraint', isCorrect: false },
      { id: 'b', text: 'Add `@@unique([roomId, date])` for the composite uniqueness rule, and `@@index([roomId])` so lookups filtering by roomId alone can use an index', isCorrect: true },
      { id: 'c', text: 'Composite constraints spanning two fields are not supported by Prisma - this must be enforced with application-level validation before every insert', isCorrect: false },
      { id: 'd', text: '@@index([roomId]) alone is sufficient - indexes automatically enforce uniqueness on the indexed column', isCorrect: false },
    ],
    explanation: '`@@unique([roomId, date])` is a block-level (model-level) attribute that enforces uniqueness across the COMBINATION of fields, not each independently - two single-field `@unique` attributes would wrongly forbid any room from ever being booked twice at all, or any date from being reused by any room. `@@index([roomId])` separately speeds up queries that filter by roomId without affecting uniqueness at all - indexes and uniqueness constraints are independent concerns; an index does not imply uniqueness unless it is a unique index.',
    hints: [
      'Composite uniqueness needs a block-level attribute spanning multiple fields',
      'An index for query speed and a uniqueness constraint solve different problems',
    ],
    tags: ['prisma', '@@unique', '@@index', 'composite-constraints', 'schema'],
    concepts: ['prisma-schema-relations'],
  },

  // =====================================================================
  // NEXT_TANSTACK (6 questions)
  // =====================================================================

  // BEGINNER faded (Parsons + Cloze) — lower-load scaffold before cold coding
  {
    id: 'tanstack-parsons-1',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_TANSTACK,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question:
      'Assemble the body of a component that fetches users with TanStack Query. Arrange the lines in this order: call useQuery, then guard the loading state, then guard the error state.',
    correctOrder: [
      'const { data, isPending, isError, error } = useQuery({',
      '  queryKey: ["users"],',
      '  queryFn: () => fetch("/api/users").then((res) => res.json()),',
      '});',
      'if (isPending) return <p>Loading...</p>;',
      'if (isError) return <p>Error: {error.message}</p>;',
    ],
    distractorLines: [
      'const [data, setData] = useState([]);',
      'useEffect(() => { fetch("/api/users").then(setData); }, []);',
    ],
    solution: `const { data, isPending, isError, error } = useQuery({
  queryKey: ["users"],
  queryFn: () => fetch("/api/users").then((res) => res.json()),
});
if (isPending) return <p>Loading...</p>;
if (isError) return <p>Error: {error.message}</p>;`,
    explanation:
      'useQuery replaces the manual useState + useEffect fetch pattern: it returns the cached data plus isPending/isError flags and manages refetching for you. Always handle isPending and isError before touching data, since data is undefined until the query resolves.',
    hints: [
      'useQuery takes a single config object with queryKey and queryFn',
      'Check isPending and isError before rendering data',
      'The useState/useEffect lines are the older pattern useQuery removes',
    ],
    tags: ['tanstack-query', 'useQuery', 'parsons'],
    concepts: ['next-tanstack-query', 'next-data-fetching'],
  },

  {
    id: 'tanstack-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_TANSTACK,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question:
      'Complete the useQuery config: one field is the cache identifier, the other is the function that returns the data promise.',
    template: `const { data, isPending } = useQuery({
  ___: ["users"],
  ___: () => fetch("/api/users").then((res) => res.json()),
});`,
    blanks: ['queryKey', 'queryFn'],
    solution: `const { data, isPending } = useQuery({
  queryKey: ["users"],
  queryFn: () => fetch("/api/users").then((res) => res.json()),
});`,
    explanation:
      'The queryKey is the cache identity — TanStack uses it to dedupe identical requests and to target invalidation. The queryFn is the actual fetching logic; it just has to return a promise that resolves to your data.',
    hints: [
      'The array that identifies this query in the cache',
      'The function that performs the fetch',
    ],
    tags: ['tanstack-query', 'useQuery', 'cloze'],
    concepts: ['next-tanstack-query', 'next-data-fetching'],
  },

  {
    id: 'tanstack-cloze-2',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_TANSTACK,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question:
      'Complete the mutation: on success it must mark the cached "users" query stale so it refetches, and the last line must actually trigger the mutation with the new user.',
    template: `const mutation = useMutation({
  mutationFn: createUser,
  onSuccess: () => {
    queryClient.___({ queryKey: ["users"] });
  },
});

mutation.___(newUser);`,
    blanks: ['invalidateQueries', 'mutate'],
    solution: `const mutation = useMutation({
  mutationFn: createUser,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["users"] });
  },
});

mutation.mutate(newUser);`,
    explanation:
      'invalidateQueries marks the matching cache entry stale and triggers a background refetch, so the list reflects the new user without manual state surgery. The mutation does not run until you call mutate() with the payload.',
    hints: [
      'The queryClient method that marks data stale and refetches',
      'The method that fires the mutation',
    ],
    tags: ['tanstack-query', 'useMutation', 'cloze'],
    concepts: ['next-tanstack-query'],
  },

  // 1. Coding: Basic useQuery hook
  {
    id: 'tanstack-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_TANSTACK,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Create a React component that uses TanStack Query\'s `useQuery` hook to fetch a list of users from "/api/users".\n\nRequirements:\n- Use `useQuery` with a queryKey of `["users"]` and a queryFn that fetches from "/api/users" and parses JSON\n- Handle three states: loading (show "Loading..."), error (show "Error: {error.message}"), and success (render a `<ul>` with each user\'s name in an `<li>`)\n- Assume each user has `id` and `name` properties\n- The component should be named `UserList`',
    starterCode: `import { useQuery } from "@tanstack/react-query";

interface User {
  id: number;
  name: string;
}

export default function UserList() {
  // Use useQuery to fetch users

  // Handle loading state

  // Handle error state

  // Render the list of users
}`,
    testCases: [
      {
        input: 'useQuery configuration',
        expectedOutput: 'useQuery({ queryKey: ["users"], queryFn: fetch("/api/users").then(res => res.json()) })',
        description: 'Should use useQuery with queryKey ["users"] and a fetch-based queryFn',
      },
      {
        input: 'loading and error states',
        expectedOutput: 'if (isPending) return "Loading..." if (isError) return "Error: {error.message}"',
        description: 'Should handle loading and error states before rendering data',
      },
      {
        input: 'success rendering',
        expectedOutput: '<ul>{data.map(user => <li key={user.id}>{user.name}</li>)}</ul>',
        description: 'Should render users in a list with key and name',
      },
    ],
    solution: `import { useQuery } from "@tanstack/react-query";

interface User {
  id: number;
  name: string;
}

export default function UserList() {
  const { data, isPending, isError, error } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    },
  });

  if (isPending) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}`,
    explanation: 'TanStack Query (formerly React Query) replaces the common useState + useEffect + loading/error state pattern with a single hook. The `queryKey` (["users"]) is the cache identifier — TanStack uses it to deduplicate requests, cache results, and know what to invalidate later. The `queryFn` is your actual data fetching logic — TanStack does not care HOW you fetch, just that you return a promise. The hook returns `isPending` (no data yet), `isError`, and `data` — you handle each state declaratively. Behind the scenes, TanStack automatically retries failed requests, deduplicates simultaneous identical requests, and serves cached data while revalidating in the background.',
    hints: [
      'queryKey must be an array — it is the cache identifier',
      'queryFn should return a Promise that resolves to your data',
      'Always check isPending and isError before accessing data',
    ],
    tieredHints: {
      apiSignature: 'const { data, isPending, isError, error } = useQuery<User[]>({ queryKey: ["users"], queryFn: fn })',
      skeleton: `export default function UserList() {
  const { data, isPending, isError, error } = useQuery<User[]>({
    ____: ["users"],
    ____: async () => {
      const res = await fetch("/api/users");
      return res.json();
    },
  });

  if (isPending) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return <ul>{data.map((user) => <li key={user.id}>{user.name}</li>)}</ul>;
}`,
    },
    tags: ['tanstack-query', 'useQuery', 'data-fetching', 'loading-states'],
    concepts: ['next-tanstack-query', 'next-data-fetching'],
  },

  // 2. Coding: useMutation with invalidation
  {
    id: 'tanstack-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_TANSTACK,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Create a `CreateUserForm` component that uses TanStack Query\'s `useMutation` to create a new user, then automatically refetches the user list.\n\nRequirements:\n- Use `useMutation` with a mutationFn that POSTs to "/api/users" with a JSON body containing `{ name }`\n- On success, use `queryClient.invalidateQueries({ queryKey: ["users"] })` to refetch the user list\n- Render a form with a text input for the name and a submit button\n- Use `useQueryClient` to get the query client instance\n- Disable the submit button while the mutation is pending',
    starterCode: `import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function CreateUserForm() {
  // your code here
}
`,
    testCases: [
      {
        input: 'useMutation setup',
        expectedOutput: 'useMutation({ mutationFn: POST /api/users with JSON body, onSuccess: queryClient.invalidateQueries({ queryKey: ["users"] }) })',
        description: 'Should configure mutation with fetch POST and invalidation on success',
      },
      {
        input: 'form rendering',
        expectedOutput: '<form onSubmit><input value={name} onChange /><button disabled={isPending}>Create</button></form>',
        description: 'Should render form with controlled input and disabled button during mutation',
      },
    ],
    solution: `import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function CreateUserForm() {
  const [name, setName] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newName: string) => {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      });
      if (!res.ok) throw new Error("Failed to create user");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setName("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(name);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="User name"
      />
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Creating..." : "Create User"}
      </button>
    </form>
  );
}`,
    explanation: 'The mutation + invalidation pattern is the core of TanStack Query\'s data synchronization. `useMutation` handles the write operation (POST, PUT, DELETE), and `invalidateQueries` tells TanStack to mark the cached data as stale and immediately refetch it. This is why the user list automatically updates after creating a new user — you do not need to manually update state or splice arrays. The `queryKey: ["users"]` in invalidateQueries matches the same key used in the useQuery hook, creating a clean connection between reading and writing data. The `onSuccess` callback only fires if the mutation succeeds, ensuring you do not clear the form or refetch on errors.',
    hints: [
      'useMutation takes a mutationFn and optional callbacks like onSuccess',
      'Call mutation.mutate(data) to trigger the mutation',
      'invalidateQueries marks cached data as stale and triggers a refetch',
    ],
    tieredHints: {
      apiSignature: 'const mutation = useMutation({ mutationFn: fn, onSuccess: fn })',
      skeleton: `export default function CreateUserForm() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    ____: async (newName: string) => {
      const res = await fetch("/api/users", { method: "POST", body: JSON.stringify({ name: newName }) });
      return res.json();
    },
    ____: () => {
      queryClient.____({ queryKey: ["users"] });
    },
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(name); }}>
      <button disabled={mutation.isPending}>Create User</button>
    </form>
  );
}`,
    },
    tags: ['tanstack-query', 'useMutation', 'invalidation', 'forms'],
    concepts: ['next-tanstack-query', 'web-html-forms-a11y'],
  },

  // 3. MC: Query keys
  {
    id: 'tanstack-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_TANSTACK,
    course: Course.WEB_DEV,
    question: 'In TanStack Query, what are query keys and why do they matter?\n\n```typescript\nuseQuery({ queryKey: ["users", { status: "active" }], queryFn: fetchActiveUsers })\nuseQuery({ queryKey: ["users", { status: "inactive" }], queryFn: fetchInactiveUsers })\n```',
    options: [
      { id: 'a', text: 'Query keys are optional display labels used for debugging in React DevTools; they have no functional impact on caching or refetching at all', isCorrect: false },
      { id: 'b', text: 'Query keys are cache identifiers — TanStack uses them to cache data, dedupe simultaneous identical requests, and decide what to refetch on invalidateQueries', isCorrect: true },
      { id: 'c', text: 'Query keys must be simple strings, never arrays, and their only purpose is to generate the URL endpoint that queryFn eventually fetches', isCorrect: false },
      { id: 'd', text: 'Query keys must exactly match the queryFn function reference — TanStack compares function identity, not the key array, to find cached data', isCorrect: false },
    ],
    explanation: 'Query keys are the foundation of TanStack Query\'s caching system. They serve three critical purposes: (1) Cache identity — `["users", { status: "active" }]` and `["users", { status: "inactive" }]` are separate cache entries with independent data, loading states, and refresh intervals. (2) Deduplication — if two components use the same queryKey simultaneously, TanStack makes ONE network request and shares the result. (3) Invalidation targeting — `invalidateQueries({ queryKey: ["users"] })` invalidates BOTH queries above because ["users"] is a prefix match. This hierarchical invalidation is powerful: invalidating ["users"] refetches all user-related queries without knowing their exact keys.',
    hints: [
      'Think about what happens when two components need the same data',
      'Consider how invalidateQueries knows which cached data to refresh',
    ],
    tags: ['tanstack-query', 'query-keys', 'caching', 'deduplication'],
    concepts: ['next-tanstack-query', 'next-data-fetching'],
  },

  // 4. MC: staleTime vs gcTime
  {
    id: 'tanstack-4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_TANSTACK,
    course: Course.WEB_DEV,
    question: 'In TanStack Query v5, what is the difference between `staleTime` and `gcTime` (formerly `cacheTime`)?\n\n```typescript\nuseQuery({\n  queryKey: ["users"],\n  queryFn: fetchUsers,\n  staleTime: 5 * 60 * 1000,  // 5 minutes\n  gcTime: 30 * 60 * 1000,    // 30 minutes\n})\n```',
    options: [
      { id: 'a', text: '`staleTime` controls how long before data is deleted from memory, `gcTime` controls how long before a refetch is triggered', isCorrect: false },
      { id: 'b', text: 'They are the same thing — `gcTime` is just the renamed version of `staleTime` in v5', isCorrect: false },
      { id: 'c', text: '`staleTime` is how long data is considered "fresh" (no background refetch), `gcTime` is how long UNUSED cached data stays in memory before garbage collection. With the config above, data shows instantly from cache for 30 min, but refetches in the background after 5 min', isCorrect: true },
      { id: 'd', text: '`staleTime` applies to queries and `gcTime` applies to mutations — they control different operations entirely', isCorrect: false },
    ],
    explanation: 'These two timers work together to create TanStack Query\'s caching behavior. `staleTime` (default: 0) determines how long fetched data is considered "fresh." While fresh, navigating to a component using this query shows cached data with NO background refetch. After staleTime expires, TanStack still shows cached data instantly (great UX!) but triggers a background refetch to update it. `gcTime` (default: 5 minutes) determines how long UNUSED data stays in the cache after all components using it unmount. After gcTime expires, the data is garbage collected from memory entirely. In the example: data is fresh for 5 minutes (no refetches), then stale but cached for up to 30 minutes (show cache + refetch), then gone from memory entirely.',
    hints: [
      'Think about two separate clocks: one for "is this data current?" and one for "should I keep this data in memory?"',
      'staleTime = 0 means data is immediately stale (default behavior)',
    ],
    tags: ['tanstack-query', 'staleTime', 'gcTime', 'caching', 'performance'],
    concepts: ['next-tanstack-query', 'next-data-fetching'],
  },

  // 5. MC: Server Component fetch vs TanStack Query
  {
    id: 'tanstack-5',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_TANSTACK,
    course: Course.WEB_DEV,
    question: 'In a Next.js App Router application, when should you use a Server Component with direct `fetch()` vs a Client Component with TanStack Query?',
    options: [
      { id: 'a', text: 'Always use TanStack Query — Server Component fetch is deprecated in Next.js 14+', isCorrect: false },
      { id: 'b', text: 'Always use Server Component fetch — TanStack Query adds unnecessary bundle size and complexity', isCorrect: false },
      { id: 'c', text: 'Use Server Component fetch for initial page data that benefits from SSR/streaming and does not need client interactivity. Use TanStack Query for data that needs polling, optimistic updates, infinite scroll, or user-triggered refetching', isCorrect: true },
      { id: 'd', text: 'Use Server Component fetch for public data and TanStack Query for authenticated data — they differ only in security model', isCorrect: false },
    ],
    explanation: 'Server Component fetch and TanStack Query solve different problems. Server Component fetch runs on the server before HTML is sent to the browser — the data is already in the page when the user sees it. This is perfect for SEO-critical content, initial page loads, and data that does not change based on user interaction. TanStack Query runs on the CLIENT and excels at interactive scenarios: polling for real-time updates, optimistic UI (showing changes before the server confirms), infinite scrolling with cursor-based pagination, and user-triggered actions like search-as-you-type. Many apps use BOTH: Server Components fetch initial data (hydrated into the page), and TanStack Query takes over for subsequent client-side interactions. You can even prefetch TanStack queries on the server using `HydrationBoundary`.',
    hints: [
      'Think about WHERE the code runs — server vs browser',
      'Consider what features require client-side JavaScript to work',
    ],
    tags: ['tanstack-query', 'server-components', 'nextjs', 'data-fetching', 'architecture'],
    concepts: ['next-tanstack-query', 'next-server-vs-client', 'next-data-fetching', 'pattern-architectural'],
  },

  // 6. Coding: Optimistic update with useMutation
  {
    id: 'tanstack-6',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.NEXT_TANSTACK,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Implement an optimistic update using TanStack Query\'s `useMutation`.\n\nScenario: You have a list of todos cached under `queryKey: ["todos"]`. When the user toggles a todo\'s `completed` status, you want to:\n1. Immediately update the UI (optimistic)\n2. Send the PATCH request to the server\n3. Roll back the UI if the request fails\n\nImplement the mutation with `onMutate` (cancel outgoing refetches, snapshot previous data, optimistically update cache), `onError` (rollback using snapshot), and `onSettled` (always refetch to ensure consistency).\n\nAssume `Todo` has `id: number`, `title: string`, `completed: boolean`.',
    starterCode: `import { useMutation, useQueryClient } from "@tanstack/react-query";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export function useToggleTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (todoId: number) => {
      // PATCH request to toggle todo
    },
    onMutate: async (todoId: number) => {
      // 1. Cancel outgoing refetches
      // 2. Snapshot previous todos
      // 3. Optimistically update the cache
      // 4. Return snapshot for rollback
    },
    onError: (err, todoId, context) => {
      // Rollback to snapshot on error
    },
    onSettled: () => {
      // Always refetch to ensure server/client consistency
    },
  });
}`,
    testCases: [
      {
        input: 'onMutate logic',
        expectedOutput: 'cancelQueries, getQueryData for snapshot, setQueryData to toggle completed, return { previousTodos }',
        description: 'Should cancel queries, snapshot data, optimistically update, and return context',
      },
      {
        input: 'onError rollback',
        expectedOutput: 'setQueryData(["todos"], context.previousTodos)',
        description: 'Should restore previous data from context on error',
      },
      {
        input: 'onSettled refetch',
        expectedOutput: 'invalidateQueries({ queryKey: ["todos"] })',
        description: 'Should invalidate queries to ensure consistency regardless of success/failure',
      },
    ],
    solution: `import { useMutation, useQueryClient } from "@tanstack/react-query";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export function useToggleTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (todoId: number) => {
      const res = await fetch(\`/api/todos/\${todoId}\`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toggleCompleted: true }),
      });
      if (!res.ok) throw new Error("Failed to update todo");
      return res.json();
    },
    onMutate: async (todoId: number) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ["todos"] });

      // Snapshot the previous value for rollback
      const previousTodos = queryClient.getQueryData<Todo[]>(["todos"]);

      // Optimistically update the cache
      queryClient.setQueryData<Todo[]>(["todos"], (old) =>
        old?.map((todo) =>
          todo.id === todoId
            ? { ...todo, completed: !todo.completed }
            : todo
        )
      );

      // Return context with the snapshot
      return { previousTodos };
    },
    onError: (err, todoId, context) => {
      // Rollback to the previous value on error
      if (context?.previousTodos) {
        queryClient.setQueryData(["todos"], context.previousTodos);
      }
    },
    onSettled: () => {
      // Always refetch after mutation to ensure server/client consistency
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
}`,
    explanation: 'Optimistic updates make your UI feel instant by updating the cache BEFORE the server responds. The pattern has three phases: (1) `onMutate` — runs BEFORE the mutation request. You cancel outgoing refetches (so they do not overwrite your optimistic update), snapshot the current cache (for rollback), and set the new optimistic data. (2) `onError` — if the server request fails, you restore the snapshot, making it look like nothing happened. (3) `onSettled` — runs after success OR failure. You invalidate queries to trigger a fresh fetch, ensuring your cache matches the server truth. This pattern is critical for responsive UIs: the user sees the toggle instantly, and only sees a revert if the server rejects the change. Without optimistic updates, the UI would freeze for the duration of the network request.',
    hints: [
      'cancelQueries prevents in-flight refetches from overwriting your optimistic update',
      'getQueryData reads the current cache without triggering a fetch',
      'setQueryData directly modifies the cache — use it for the optimistic update and rollback',
      'onSettled runs on both success AND error — perfect for final refetch',
    ],
    tieredHints: {
      apiSignature: 'useMutation({ mutationFn, onMutate, onError, onSettled })',
      skeleton: `export function useToggleTodo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (todoId: number) => { /* ... */ },
    onMutate: async (todoId: number) => {
      await queryClient.____({ queryKey: ["todos"] });
      const previousTodos = queryClient.____<Todo[]>(["todos"]);
      queryClient.____<Todo[]>(["todos"], (old) => /* update */);
      return { previousTodos };
    },
    onError: (err, todoId, context) => {
      if (context?.previousTodos) queryClient.setQueryData(["todos"], context.previousTodos);
    },
    onSettled: () => {
      queryClient.____({ queryKey: ["todos"] });
    },
  });
}`,
    },
    tags: ['tanstack-query', 'optimistic-updates', 'useMutation', 'cache-manipulation', 'advanced'],
    concepts: ['next-tanstack-query'],
  },

  // 7. Cloze: useInfiniteQuery basics
  {
    id: 'tanstack-cloze-3',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_TANSTACK,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question:
      'Complete the infinite-scroll query: the hook that fetches pages instead of one result, the config field that has no earlier page so the first fetch starts undefined, and the function called to load more.',
    template: `const { data, fetchNextPage, hasNextPage } = ___({
  queryKey: ["posts"],
  queryFn: ({ pageParam }) => fetchPosts(pageParam),
  ___: undefined,
  getNextPageParam: (lastPage) => lastPage.nextCursor,
});

// When the sentinel div comes into view:
if (hasNextPage) ___();`,
    blanks: ['useInfiniteQuery', 'initialPageParam', 'fetchNextPage'],
    solution: `const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
  queryKey: ["posts"],
  queryFn: ({ pageParam }) => fetchPosts(pageParam),
  initialPageParam: undefined,
  getNextPageParam: (lastPage) => lastPage.nextCursor,
});

// When the sentinel div comes into view:
if (hasNextPage) fetchNextPage();`,
    explanation:
      'useInfiniteQuery is useQuery for paginated data: queryFn receives pageParam (the cursor for the page to fetch), getNextPageParam reads the next cursor off the last page\'s response, and initialPageParam is the value used for the very first fetch (undefined when there is no cursor yet). Calling fetchNextPage() appends the next page to data.pages instead of replacing the cache.',
    hints: [
      'The hook name mirrors useQuery but for paged data',
      'The first page has no prior cursor',
      'The function that triggers loading the next page',
    ],
    tags: ['tanstack-query', 'useInfiniteQuery', 'pagination', 'cloze'],
    concepts: ['next-tanstack-query'],
  },

  // 8. Cloze: QueryClientProvider setup
  {
    id: 'tanstack-cloze-4',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_TANSTACK,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question:
      'Complete the client wrapper every TanStack Query hook in the app depends on: create one client instance per app load, then provide it to the tree.',
    template: `"use client";
import { QueryClient, ___ } from "@tanstack/react-query";
import { useState } from "react";

export function Providers({ children }) {
  const [queryClient] = useState(() => new QueryClient());
  return <___ client={queryClient}>{children}</___>;
}`,
    blanks: ['QueryClientProvider', 'QueryClientProvider', 'QueryClientProvider'],
    solution: `"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function Providers({ children }) {
  const [queryClient] = useState(() => new QueryClient());
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}`,
    explanation:
      'Every useQuery/useMutation call reads from a shared QueryClient via context, so the tree needs a QueryClientProvider somewhere above it - without one, TanStack throws immediately. useState(() => new QueryClient()) (not a plain module-level constant) ensures each user/request gets its own client instance rather than sharing state across requests, which matters once this wrapper runs on a server that handles multiple users.',
    hints: [
      'The provider component that makes the client available via context',
    ],
    tags: ['tanstack-query', 'QueryClientProvider', 'setup', 'cloze'],
    concepts: ['next-tanstack-query'],
  },

  // 9. Coding: QueryClientProvider client wrapper
  {
    id: 'tanstack-7',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_TANSTACK,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Create the Providers client component every TanStack Query hook in this App Router app needs, at app/providers.tsx.\n\nRequirements:\n- "use client" directive\n- Create exactly one QueryClient instance per component instance (not a module-level constant), using useState with a lazy initializer\n- Wrap children in QueryClientProvider, passing the client\n- Export Providers as the default export',
    starterCode: `// app/providers.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function Providers({ children }) {
  // your code here
}`,
    testCases: [
      {
        input: 'Providers wrapper',
        expectedOutput: 'useState(() => new QueryClient()) then <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>',
        description: 'Should create one QueryClient per instance via lazy useState and wrap children in the provider',
      },
    ],
    solution: `// app/providers.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function Providers({ children }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}`,
    explanation: 'This wrapper is the prerequisite every other TanStack question in this topic silently assumes exists - useQuery and useMutation both read the client from context, and there is no context without a QueryClientProvider somewhere above them in the tree (typically wrapping {children} in the root layout). The lazy useState(() => new QueryClient()) avoids creating a new client on every render, and - critically for App Router, where this component can run per-request on the server - avoids sharing one client across multiple users the way a module-level `const queryClient = new QueryClient()` would.',
    hints: [
      '"use client" is required - QueryClientProvider relies on React context',
      'useState(() => new QueryClient()) creates the client lazily, once',
      'A module-level QueryClient constant would leak across requests/users',
    ],
    tieredHints: {
      apiSignature: 'function Providers({ children }: { children: React.ReactNode })',
      skeleton: `"use client";

export default function Providers({ children }) {
  const [queryClient] = useState(() => new ____());

  return (
    <____ client={queryClient}>
      {children}
    </____>
  );
}`,
    },
    tags: ['tanstack-query', 'QueryClientProvider', 'setup', 'app-router'],
    concepts: ['next-tanstack-query'],
  },

  // 10. Cloze: enabled option for dependent queries
  {
    id: 'tanstack-cloze-5',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_TANSTACK,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question:
      'Complete the dependent query: the posts query must not run until a userId is actually available.',
    template: `const { data: posts } = useQuery({
  queryKey: ["posts", userId],
  queryFn: () => fetchPostsByUser(userId),
  ___: !!userId,
});`,
    blanks: ['enabled'],
    solution: `const { data: posts } = useQuery({
  queryKey: ["posts", userId],
  queryFn: () => fetchPostsByUser(userId),
  enabled: !!userId,
});`,
    explanation:
      'enabled: false (or any falsy expression) tells TanStack Query to skip running queryFn entirely - the query stays idle instead of firing with an undefined userId and erroring or fetching garbage. Once userId becomes truthy, the query automatically starts running because TanStack re-evaluates enabled on every render.',
    hints: [
      'The option that gates whether the query is allowed to run at all',
    ],
    tags: ['tanstack-query', 'enabled', 'dependent-queries', 'cloze'],
    concepts: ['next-tanstack-query'],
  },

  // 11. MC: enabled option for dependent queries
  {
    id: 'tanstack-8',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_TANSTACK,
    course: Course.WEB_DEV,
    question: 'A component fetches a user\'s posts with `useQuery({ queryKey: ["posts", userId], queryFn: () => fetchPostsByUser(userId) })`, but userId comes from another query that has not resolved yet on first render (userId is undefined). What happens, and how do you fix it?',
    options: [
      { id: 'a', text: 'TanStack Query automatically detects that userId is undefined and delays running the query until it becomes defined - no configuration is needed', isCorrect: false },
      { id: 'b', text: 'The query runs immediately with userId as undefined, calling fetchPostsByUser(undefined) and likely erroring or fetching the wrong data. Add `enabled: !!userId` so the query stays idle until userId has a real value, then TanStack automatically fires it once enabled becomes true', isCorrect: true },
      { id: 'c', text: 'This is not possible in TanStack Query - dependent queries where one query\'s input depends on another query\'s output require manually chaining two separate useEffect calls instead', isCorrect: false },
      { id: 'd', text: 'The queryKey ["posts", userId] containing undefined causes TanStack to throw a build-time error and refuse to render the component at all', isCorrect: false },
    ],
    explanation: 'By default, useQuery runs queryFn as soon as the component mounts, regardless of whether the values it depends on are ready - there is no automatic dependency detection. That means fetchPostsByUser(undefined) runs immediately here, which is either a bug or a wasted request. The `enabled` option controls whether the query is allowed to run at all; passing `enabled: !!userId` keeps the query idle until userId is truthy, at which point TanStack re-evaluates enabled on the next render and fires the query automatically - no manual refetch call needed.',
    hints: [
      'useQuery has no built-in awareness that a value "isn\'t ready yet" - you have to tell it',
      'The enabled option accepts any boolean expression, re-evaluated every render',
    ],
    tags: ['tanstack-query', 'enabled', 'dependent-queries', 'useQuery'],
    concepts: ['next-tanstack-query'],
  },

  // 12. MC: retry / error propagation to error boundaries
  {
    id: 'tanstack-9',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.NEXT_TANSTACK,
    course: Course.WEB_DEV,
    question: 'By default, a failing useQuery retries 3 times with exponential backoff, then just sets isError: true and leaves rendering to the component\'s own error UI. Your team wants critical queries to instead propagate to the nearest error.tsx-style boundary, matching how a thrown render error would be handled. How do you get that behavior?',
    options: [
      { id: 'a', text: 'Pass `throwOnError: true` (or a function that returns true for specific errors) to useQuery - this makes TanStack Query re-throw the error during render after retries are exhausted, so the nearest error boundary catches it exactly like a normal render-time throw', isCorrect: true },
      { id: 'b', text: 'Wrap every component using useQuery in a try/catch block inside its render function to manually forward query errors to the boundary', isCorrect: false },
      { id: 'c', text: 'Set `retry: false` - disabling retries automatically routes any failed query straight to the nearest error boundary instead of returning isError', isCorrect: false },
      { id: 'd', text: 'This is not possible - error boundaries can only catch errors thrown synchronously during render, and useQuery failures happen inside an async fetch, so they can never reach a boundary', isCorrect: false },
    ],
    explanation: 'By default TanStack Query treats query failures as data to hand back to your component (isError, error), not as thrown exceptions - this is deliberate, since most fetch failures should be handled gracefully rather than crashing the tree. `throwOnError` flips that for cases where you genuinely want fetch failures treated as fatal: when true (or when a predicate function you provide returns true for a given error), TanStack re-throws the error during the next render after retries are exhausted, which is exactly the kind of synchronous render-time throw a React error boundary (and therefore error.tsx) is built to catch. retry: false only stops retrying - it does not change how the failure is reported.',
    hints: [
      'Error boundaries only catch throws that happen during render - TanStack needs an option that converts an async failure into one',
      'retry and throwOnError control two different things: how many attempts happen, and how the final failure is reported',
    ],
    tags: ['tanstack-query', 'throwOnError', 'error-boundary', 'retry'],
    concepts: ['next-tanstack-query', 'next-error-boundary'],
  },

  // 13. MC: prefetchQuery + HydrationBoundary awareness
  {
    id: 'tanstack-10',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.NEXT_TANSTACK,
    course: Course.WEB_DEV,
    question: 'You want a page\'s data to already be in the TanStack Query cache the moment the Client Component mounts, instead of showing a loading spinner while useQuery fetches for the first time client-side. What is the pattern for prefetching on the server and handing that cache to the client in an App Router page?',
    options: [
      { id: 'a', text: 'In the Server Component page.tsx, call queryClient.prefetchQuery() with the same queryKey/queryFn the client will use, then wrap the Client Component in <HydrationBoundary state={dehydrate(queryClient)}>. useQuery on the client sees the matching queryKey already populated and skips the initial fetch/loading state entirely', isCorrect: true },
      { id: 'b', text: 'Fetch the data in the Server Component and pass it down as a normal prop - useQuery automatically detects a matching prop with the same name as its queryKey and skips fetching', isCorrect: false },
      { id: 'c', text: 'prefetchQuery only works with useMutation, not useQuery, since prefetching is conceptually a write operation that primes the cache', isCorrect: false },
      { id: 'd', text: 'Call useQuery directly inside the Server Component to warm the cache, then the same hook call in the Client Component automatically reuses that warmed result since hooks share state across the server/client boundary', isCorrect: false },
    ],
    explanation: 'useQuery is a Client Component hook and cannot run on the server, so warming its cache server-side needs a separate mechanism. queryClient.prefetchQuery({ queryKey, queryFn }) runs the fetch on the server and stores the result under that queryKey in a (server-created) QueryClient. dehydrate(queryClient) serializes that cache into plain data, and <HydrationBoundary state={...}> ships it to the client and rehydrates it into the client-side QueryClient before any component reads from it. When a Client Component then calls useQuery with the SAME queryKey, TanStack finds the prefetched data already there and renders it immediately instead of showing a loading state - it still may revalidate in the background depending on staleTime.',
    hints: [
      'useQuery cannot run in a Server Component at all - prefetching needs its own client-independent API',
      'The queryKey used during prefetch must exactly match the queryKey the Client Component\'s useQuery uses',
    ],
    tags: ['tanstack-query', 'prefetchQuery', 'HydrationBoundary', 'ssr', 'server-components'],
    concepts: ['next-tanstack-query', 'next-server-vs-client'],
  },
];
