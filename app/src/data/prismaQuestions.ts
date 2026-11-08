import { Question, QuestionType, Difficulty, Topic, CodeLanguage, Course } from '../types';

export const prismaQuestions: Question[] = [

  // =====================================================================
  // NEXT_PRISMA (30 questions)
  // =====================================================================

  // BEGINNER faded (Parsons + Cloze) - lower-load scaffold before cold coding
  {
    id: 'prisma-parsons-1',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_PRISMA,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question:
      'Assemble the `User` model in schema.prisma: an auto-incrementing integer primary key `id`, a unique `email`, an optional `name`, and `posts`, the list of the user\'s Post rows. List the fields in that order: id, email, name, posts.',
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
      'Each attribute adds one rule. `@id` makes `id` the primary key, and `@default(autoincrement())` only fills in its value, so the line needs both. `@unique` becomes a unique index, so the database refuses a second row with the same email. `String?` lets `name` be NULL; a plain `String` is required. `posts Post[]` is the list side of the one-to-many relation: it is no column at all, because the foreign key lives on Post.',
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
      '`contains` matches a substring: Prisma sends `LIKE \'%prisma%\'`, which is case-sensitive on PostgreSQL unless you add `mode: "insensitive"`. `include` keeps every field of the post and adds the relation, so each post carries its full author; Prisma 6 loads the authors with one more query (`WHERE id IN (...)`), not a JOIN. Use `select` instead when you want only some fields.',
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
      'Fill in the two Prisma schema attributes: one fills in an auto-incrementing value for the primary key, the other declares the relation that links the foreign key `authorId` to its User.',
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
      '`@default(autoincrement())` lets the database pick the next integer for each new row. `@relation(fields: [authorId], references: [id])` says that the `authorId` column holds a `User.id`, which becomes a foreign key in the migration. Post is the side that stores the key: one user has many posts, and the `posts Post[]` list on User is no column at all.',
    hints: [
      'The attribute that supplies a value when a row is created',
      'The attribute that wires a foreign key to the model it points at',
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
    question: 'Write the whole schema.prisma file for a User model and a Post model.\n\n- A `generator client` block whose provider is "prisma-client-js".\n- A `datasource db` block whose provider is "postgresql" and whose url comes from the `DATABASE_URL` environment variable.\n- User: `id` (Int, auto-increment, primary key), `email` (String, unique), `name` (String, optional) and `posts`, the list of the user\'s posts.\n- Post: `id` (Int, auto-increment, primary key), `title` (String), `content` (String), `authorId` (Int, the foreign key to User) and `author`, the relation to User.',
    starterCode: `// schema.prisma
// the generator block, the datasource block, then the User and Post models
`,
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
    explanation: 'A schema file has three kinds of block: `generator` says which client to build, `datasource` names the database and reads its URL with `env("DATABASE_URL")`, and each `model` becomes a table. A relation is written on both models. Post holds the foreign key: `authorId Int` is the column, and `author User @relation(fields: [authorId], references: [id])` says it points at `User.id`. The other side, `posts Post[]`, is no column; it lets you write `include: { posts: true }`. `String?` makes `name` nullable, while `title` and `content` without `?` are required. Field order inside a model and the order of the blocks do not matter.',
    hints: [
      'Use @id and @default(autoincrement()) for primary keys',
      'Use @unique on the email field',
      'String? makes a field optional (nullable)',
      '@relation(fields: [...], references: [...]) links the foreign key to the model it points at',
    ],
    requires: [
      /provider\s*=\s*"prisma-client-js"/,
      /provider\s*=\s*"postgresql"/,
      /url\s*=\s*env\(\s*"DATABASE_URL"\s*\)/,
      /(^\s*id\s+Int\b(?=[^\n]*@id\b)(?=[^\n]*@default\(\s*autoincrement\(\s*\)\s*\))[\s\S]*){2}/m,
      /^\s*email\s+String\b[^\n]*@unique/m,
      /^\s*name\s+String\?/m,
      /^\s*posts\s+Post\[\]/m,
      /^\s*content\s+String(?![?[])/m,
      /^\s*authorId\s+Int\b/m,
      /^\s*author\s+User\s+@relation\((?=[^)]*fields:\s*\[\s*authorId\s*\])(?=[^)]*references:\s*\[\s*id\s*\])/m,
    ],
    tieredHints: {
      apiSignature: '@relation(fields: FieldReference[], references: FieldReference[], onDelete?: ReferentialAction)',
      skeleton: `// generator client and datasource db blocks first, as the prompt lists them

model User {
  id    Int     @____ @default(____())
  email String  @____
  name  ____
  posts ____
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

  // 2. Coding: Prisma Client queries - findMany and create with nested relation
  {
    id: 'prisma-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_PRISMA,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'The database is PostgreSQL. Write two Prisma Client queries; the starter already creates `prisma`.\n\n1. `searchPosts`: use `findMany` to get every post whose title contains "prisma" in any letter case (so "Learning Prisma" matches), newest first by `id` (descending), with each post\'s author included.\n\n2. `createUserWithPost`: use one `create` call to make a user with email "alice@prisma.io" and name "Alice" together with a post of theirs, title "My First Post" and content "Hello world!".',
    starterCode: `import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Query 1: posts whose title contains "prisma", any case
async function searchPosts() {
  const posts = await prisma.post.findMany({
    // Add where, orderBy, and include
  });
  return posts;
}

// Query 2: a user and their first post in one call
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
        description: 'Should use findMany with contains and mode "insensitive", orderBy id desc, and include the author',
      },
      {
        input: 'create with nested relation',
        expectedOutput: 'prisma.user.create({ data: { email: "alice@prisma.io", name: "Alice", posts: { create: { title: "My First Post", content: "Hello world!" } } } })',
        description: 'Should create user with nested post using posts: { create: {...} }',
      },
    ],
    solution: `import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Query 1: posts whose title contains "prisma", any case
async function searchPosts() {
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

// Query 2: a user and their first post in one call
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
}
# OR
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function searchPosts() {
  return prisma.post.findMany({
    where: { title: { contains: "prisma", mode: "insensitive" } },
    orderBy: { id: "desc" },
    include: { author: true },
  });
}

async function createUserWithPost() {
  return prisma.user.create({
    data: {
      email: "alice@prisma.io",
      name: "Alice",
      posts: { create: { title: "My First Post", content: "Hello world!" } },
    },
  });
}
# OR
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function searchPosts() {
  const posts = await prisma.post.findMany({
    where: { title: { contains: "prisma", mode: "insensitive" } },
    orderBy: { id: "desc" },
    include: { author: true },
  });
  return posts;
}

async function createUserWithPost() {
  const user = await prisma.user.create({
    data: {
      email: "alice@prisma.io",
      name: "Alice",
      posts: { create: [{ title: "My First Post", content: "Hello world!" }] },
    },
  });
  return user;
}
# OR
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function searchPosts() {
  const posts = await prisma.post.findMany({
    where: { title: { contains: "prisma", mode: "insensitive" } },
    orderBy: { id: "desc" },
    include: { author: { select: { name: true, email: true } } },
  });
  return posts;
}

async function createUserWithPost() {
  const user = await prisma.user.create({
    data: {
      email: "alice@prisma.io",
      name: "Alice",
      posts: { create: { title: "My First Post", content: "Hello world!" } },
    },
  });
  return user;
}`,
    explanation: '`contains` alone is case-sensitive on PostgreSQL (`LIKE`), so "Learning Prisma" would be missed; `mode: "insensitive"` makes Prisma send `ILIKE` instead (the option exists for PostgreSQL and MongoDB only). `orderBy: { id: "desc" }` puts the newest id first. `include: { author: true }` keeps every post field and adds the full author (a nested `select` inside it, such as `author: { select: { name: true, email: true } }`, narrows the author); Prisma 6 loads the authors with a second query (`WHERE id IN (...)`), not a JOIN. In the create, `posts: { create: {...} }` is a nested write: Prisma inserts the user, then the post with `authorId` set to the new user\'s id, inside one transaction, so either both rows exist or neither does. `create` also takes an array to add several posts at once.',
    hints: [
      'Use `contains` and `mode: "insensitive"` for case-insensitive search',
      'orderBy takes an object like { field: "desc" }',
      'Nested creates use the relation name (posts) with { create: {...} }',
    ],
    requires: [
      /prisma\.post\.findMany\(/,
      /contains:\s*["'`]prisma["'`]/,
      /mode:\s*["'`]insensitive["'`]/,
      /orderBy:\s*\[?\s*\{\s*id:\s*["'`]desc["'`]/,
      /include:\s*\{\s*author:\s*(true\b|\{\s*select:)/,
      /prisma\.user\.create\(/,
      /email:\s*["'`]alice@prisma\.io["'`]/,
      /posts:\s*\{\s*create:/,
      /title:\s*["'`]My First Post["'`]/,
      /content:\s*["'`]Hello world!["'`]/,
    ],
    tieredHints: {
      apiSignature: 'prisma.post.findMany({ where?, orderBy?, include? }) / prisma.user.create({ data })',
      skeleton: `async function searchPosts() {
  return prisma.post.findMany({
    where: { title: { ____: "prisma", ____: "____" } },
    orderBy: { ____: "____" },
    ____: { author: true },
  });
}

async function createUserWithPost() {
  return prisma.user.create({
    data: {
      email: "alice@prisma.io",
      name: "Alice",
      ____: { ____: { title: "My First Post", content: "Hello world!" } },
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
      { id: 'a', text: '`db push` applies the schema AND writes a migration file to prisma/migrations for version control, while `migrate dev` only syncs the schema and saves no history', isCorrect: false },
      { id: 'b', text: 'They are the same command: `db push` is a shorter alias for `migrate dev`', isCorrect: false },
      { id: 'c', text: '`migrate dev` writes a timestamped SQL migration file to prisma/migrations for version control, while `db push` syncs the schema directly and writes no file', isCorrect: true },
      { id: 'd', text: '`migrate dev` is meant only for development databases, while `db push` is the command that applies schema changes in production', isCorrect: false },
    ],
    explanation: '`npx prisma migrate dev --name add_users` compares the schema with the database, writes the SQL to a new folder such as `prisma/migrations/20260101120000_add_users/migration.sql`, applies it and regenerates the client. You commit those folders, so every teammate and every environment replays the same history. `npx prisma db push` makes the database match the schema directly and writes no file, which suits a prototype you are still reshaping. Production uses neither: it runs `npx prisma migrate deploy`, which applies the committed migrations in order and never creates new ones; `db push` is not a deployment tool.',
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
      { id: 'c', text: 'A data-access class you write by hand for each model; Prisma itself only runs your migrations', isCorrect: false },
      { id: 'd', text: 'Code generated from your own schema.prisma and typed to your models; `npx prisma generate` rebuilds it after a schema change', isCorrect: true },
    ],
    explanation: 'Prisma Client is code generated from your own schema.prisma. `npx prisma generate` reads the models, fields and relations and writes a typed client; with the usual `prisma-client-js` generator it lands in `node_modules/.prisma/client`, which `import { PrismaClient } from "@prisma/client"` re-exports. That is why `prisma.user.findMany()` autocompletes (User is in your schema) and a misspelled field is a type error. After a schema change the client must be regenerated: `npx prisma migrate dev` does it for you in Prisma 6, and `npx prisma generate` does it on its own, for example in a build step. No hand-written per-model class is involved, and the client is not a hosted API or a plain driver.',
    hints: [
      'Think about how Prisma knows the exact shape of your models for autocomplete',
      'Which command reads schema.prisma and writes code?',
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
    question: 'Fill in the Prisma Client method that runs an array of operations atomically: either all of them succeed or every change is rolled back.',
    template: `const [user, post] = await prisma.___([
  prisma.user.update({ where: { id: 1 }, data: { name: "Alice" } }),
  prisma.post.create({ data: { title: "New Post", authorId: 1 } }),
]);`,
    blanks: ['$transaction'],
    solution: 'const [user, post] = await prisma.$transaction([\n  prisma.user.update({ where: { id: 1 }, data: { name: "Alice" } }),\n  prisma.post.create({ data: { title: "New Post", authorId: 1 } }),\n]);',
    explanation: '`prisma.$transaction([...])` takes an array of queries that have not been awaited yet and runs them in order inside one database transaction (BEGIN, the queries, COMMIT). If any of them fails, the transaction is rolled back, so the name change and the new post land together or not at all. It resolves to an array of the results in the same order, here `[user, post]`. Client-level methods such as `$transaction`, `$disconnect` and `$queryRaw` start with `$` so they cannot clash with a model name.',
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
    question: 'Finish `updateUserAndCreatePost` so that one `prisma.$transaction` call, given an array of queries, runs two operations atomically:\n\n1. Update the user with id 1: change their name to "Alice Updated".\n2. Create a post for that user with title "Transaction Post" and content "Created in a transaction".\n\nEither both changes are saved or neither is.',
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
}
# OR
import { PrismaClient } from "@prisma/client";
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
        author: { connect: { id: 1 } },
      },
    }),
  ]);

  return { updatedUser, newPost };
}`,
    explanation: '`$transaction` takes an array of queries that have not been awaited yet, runs them in order inside one database transaction and resolves to their results in the same order. If either query fails (say user 1 does not exist), the transaction is rolled back and neither change is kept. Awaiting the update and then the create on their own would commit the first even when the second fails. The post can name its user with the foreign key, `authorId: 1`, or through the relation, `author: { connect: { id: 1 } }`; both store the same row. When a later step depends on an earlier result, use the interactive form, `prisma.$transaction(async (tx) => { ... })`, and run every query on `tx`.',
    hints: [
      '$transaction takes an array of queries, not awaited',
      'Use prisma.user.update with where and data',
      'The post needs its user: authorId, or author with connect',
    ],
    requires: [
      /\$transaction\(\s*\[/,
      /prisma\.user\.update\(/,
      /where:\s*\{\s*id:\s*1\s*\}/,
      /name:\s*["'`]Alice Updated["'`]/,
      /prisma\.post\.create\(/,
      /title:\s*["'`]Transaction Post["'`]/,
      /content:\s*["'`]Created in a transaction["'`]/,
      /authorId:\s*1\b|author:\s*\{\s*connect:\s*\{\s*id:\s*1\s*\}/,
    ],
    tieredHints: {
      apiSignature: 'prisma.$transaction(queries: PrismaPromise[]): Promise<results[]>',
      skeleton: `async function updateUserAndCreatePost() {
  const [updatedUser, newPost] = await prisma.$transaction([
    prisma.user.____({
      ____: { id: 1 },
      ____: { name: "Alice Updated" },
    }),
    prisma.post.____({
      ____: { title: "Transaction Post", content: "Created in a transaction", ____: 1 },
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
    question: 'A page lists 50 users and each user\'s posts. Your colleague wrote this code:\n\n```typescript\nconst users = await prisma.user.findMany();\nconst withPosts = [];\nfor (const user of users) {\n  const posts = await prisma.post.findMany({ where: { authorId: user.id } });\n  withPosts.push({ ...user, posts });\n}\n```\n\nWhat problem does this code have, and how should it be fixed?',
    options: [
      { id: 'a', text: 'Nothing: Prisma batches the awaited queries in the loop into one round trip behind the scenes, so no change is needed', isCorrect: false },
      { id: 'b', text: 'It is the N+1 problem, 51 queries; `findMany({ include: { posts: true } })` loads every user\'s posts in one more query', isCorrect: true },
      { id: 'c', text: 'Nothing at this size: N+1 only starts to cost anything once a table holds millions of rows', isCorrect: false },
      { id: 'd', text: 'The query builder cannot load relations, so this list needs a hand-written raw SQL JOIN', isCorrect: false },
    ],
    explanation: 'This is the N+1 problem: one query for the users, then one more per user inside the loop, so 51 round trips for 50 users, and each waits for the one before. `prisma.user.findMany({ include: { posts: true } })` gives the same result with two queries: the users, then every post with `WHERE "authorId" IN (...)`, which Prisma matches back to each user (the Prisma 6 default; it uses a JOIN only when the `relationJoins` preview feature is turned on). Prisma does batch some calls on its own, such as several `findUnique` calls started in the same tick, but never a loop that awaits each `findMany` in turn. Even 50 users cost 51 round trips, so the fix matters at any size, and raw SQL is not needed because `include` and `select` load relations.',
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
    question: 'Create a Prisma Client singleton for a Next.js app in `lib/prisma.ts`.\n\nIn development, Next.js reloads changed modules on every save. Each reload runs `new PrismaClient()` again, and each client opens its own pool of database connections, so the connections soon run out.\n\nThe fix is to keep the client on `globalThis`, which survives the reloads:\n\n- Give `globalThis` a typed `prisma` property (a cast or a `declare global`).\n- Reuse the instance already on `globalThis`, or create a new PrismaClient when there is none.\n- Outside production, store the instance on `globalThis`.\n- Export the instance as the default export.',
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

export default prisma;
# OR
// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = globalThis.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

export default prisma;
# OR
// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
# OR
// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => new PrismaClient();

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof prismaClientSingleton> | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;`,
    explanation: 'This is a development problem: `next dev` re-runs a changed module\'s top-level code, so a plain `const prisma = new PrismaClient()` would build a new client, with its own connection pool, on every save until PostgreSQL reports "too many connections". `globalThis` (`global` in Node) is not reloaded, so the first client is stored there and every reload reuses it: `globalForPrisma.prisma ?? new PrismaClient()` takes the stored one and creates a client only when there is none. The cast (or `declare global { var prisma: ... }`) just tells TypeScript that the property exists. Production skips the store because a production server runs the module once, so there is only ever one client. Prisma\'s Next.js guide shows the same pattern.',
    hints: [
      'globalThis persists across module re-evaluations in dev',
      'Use nullish coalescing (??) to reuse or create',
      'Only assign to globalThis in non-production environments',
    ],
    requires: [
      /\bglobal(This)?\b/,
      /new PrismaClient\(/,
      /(\?\?|\|\|)\s*(new PrismaClient|\w+)\(\)/,
      /NODE_ENV\s*!==?\s*["'`]production["'`]/,
      /\.prisma\w*\s*=\s*[A-Za-z_$][\w$]*/,
      /export\s+default\s+[A-Za-z_$][\w$]*/,
    ],
    tieredHints: {
      apiSignature: 'globalThis: the one global object, kept across hot reloads; new PrismaClient(options?)',
      skeleton: `import { PrismaClient } from "@prisma/client";

const globalForPrisma = ____ as unknown as {
  prisma: ____ | undefined;
};

const prisma = ____ ____ new PrismaClient();

if (____) {
  ____ = prisma;
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
    question: 'User has `id`, `email`, `name` and `posts Post[]`. What is the difference between these two queries?\n\n```typescript\n// Query 1\nprisma.user.findMany({ include: { posts: true } })\n\n// Query 2\nprisma.user.findMany({ select: { name: true, posts: true } })\n```',
    options: [
      { id: 'a', text: 'None: both return every user field plus posts, since `select` also adds to the defaults', isCorrect: false },
      { id: 'b', text: 'Query 1 returns every user field plus posts; Query 2 returns only name and posts', isCorrect: true },
      { id: 'c', text: '`include` loads one-to-many relations and `select` loads only one-to-one relations', isCorrect: false },
      { id: 'd', text: 'Query 2 fails: `select` takes only scalar fields, and relations need `include`', isCorrect: false },
    ],
    explanation: '`include` keeps every scalar field and adds the relations it names, so each user in Query 1 has `id`, `email`, `name` and `posts`. `select` returns only the fields it lists, relations included, so each user in Query 2 has just `name` and `posts`, with no `id` or `email`. Both work for any kind of relation. Choosing `select` sends less data and keeps fields such as a password hash out of the result. `include` and `select` cannot sit side by side at the same level of one query; to narrow a relation, nest a `select` inside it, as in `include: { posts: { select: { title: true } } }`.',
    hints: [
      'Think about what fields appear in the result object for each approach',
      'Consider which approach sends less data from the database',
    ],
    tags: ['prisma', 'include', 'select', 'performance', 'queries'],
    concepts: ['prisma-schema-relations', 'prisma-include-select'],
  },

  // Predict: which keys include and a nested select return
  {
    id: 'prisma-include-select-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_PRISMA,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'The Post table holds one post, "Hello", written by the user Ann. The schema is the usual pair: `User` has `id`, `email`, `name` and `posts Post[]`, and `Post` has `id`, `title`, `authorId` and `author User`, in that order. What do the three `console.log` calls print? Type the three lines exactly as printed, keys separated by a comma and a space.',
    code: `const full = await prisma.post.findFirst({ include: { author: true } });
const slim = await prisma.post.findFirst({
  select: { title: true, author: { select: { name: true } } },
});

console.log(Object.keys(full!).join(", "));
console.log(Object.keys(slim!).join(", "));
console.log(Object.keys(slim!.author).join(", "));`,
    expectedOutput: `id, title, authorId, author
title, author
name`,
    explanation: '`include` keeps every scalar field of the post and adds the relation on top, so `full` has `id`, `title`, the foreign key `authorId`, then `author`. `select` returns only the fields it lists, so `slim` has just `title` and `author`. The nested `select` applies the same rule inside the relation: `slim.author` holds only `name`, with no `id` or `email`. Prisma 6 returns the keys in the order the select object lists them, and for `include` the scalar fields in schema order with the relation after them.',
    hints: [
      'Does `include` remove any of the post\'s own fields, the foreign key included?',
      'A nested `select` narrows the related record the same way the outer one narrows the post',
    ],
    tags: ['prisma', 'include', 'select', 'nested-select', 'predict'],
    concepts: ['prisma-include-select'],
  },

  // 9. Coding: Cascading delete
  {
    id: 'prisma-9',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_PRISMA,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Change the schema and write a delete function so that deleting a User also deletes all of their Posts.\n\nPart 1: write the whole Post model (`id`, `title`, `content`, `authorId` and the `author` relation to User) with `onDelete: Cascade` on that relation. This editor holds TypeScript, so the model may also be written as comment lines.\nPart 2: write `deleteUser(userId)`, which deletes the user with that id; the database then deletes their posts.\n\nThe User model already has `id`, `email`, `name` and `posts Post[]`.',
    starterCode: `// Part 1: Updated Post model in schema.prisma
// The current Post model has id, title, content, authorId, and an author
// relation to User. Add the cascade behavior to that relation.

// Part 2: Delete function
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function deleteUser(userId: number) {
  // Delete the user; the cascade removes their posts
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
        description: 'Should delete the user by id; the cascade removes their posts',
      },
    ],
    solution: `// Part 1: Updated Post model in schema.prisma
model Post {
  id       Int    @id @default(autoincrement())
  title    String
  content  String
  authorId Int
  author   User   @relation(fields: [authorId], references: [id], onDelete: Cascade)
}

// Part 2: Delete function
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function deleteUser(userId: number) {
  const deletedUser = await prisma.user.delete({
    where: { id: userId },
  });
  return deletedUser;
}
# OR
// Part 1: Updated Post model in schema.prisma
model Post {
  id       Int    @id @default(autoincrement())
  title    String
  content  String
  authorId Int
  author   User   @relation(fields: [authorId], references: [id], onDelete: Cascade)
}

// Part 2: Delete function
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function deleteUser(userId: number) {
  return prisma.user.delete({ where: { id: userId } });
}
# OR
// Part 1: Updated Post model in schema.prisma
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
    explanation: 'With no `onDelete`, a required relation such as `author` gets `ON DELETE RESTRICT` in the migration, so PostgreSQL refuses to delete a user who still has posts and `prisma.user.delete` throws. `onDelete: Cascade` makes the migration write `ON DELETE CASCADE` on the `authorId` foreign key, so the database itself removes the user\'s posts in the same statement, and `deleteUser` needs only `prisma.user.delete({ where: { id: userId } })`. Run `npx prisma migrate dev` after the change so the database gets the new rule. Other choices are `onDelete: SetNull`, which needs an optional `authorId Int?`, and `Restrict`, the default you started with. Cascade fits rows that mean nothing without their parent, such as a user\'s posts.',
    hints: [
      'onDelete: Cascade goes inside the @relation attribute',
      'With cascade in place, a plain prisma.user.delete is all you need',
      'The database deletes the related rows itself',
    ],
    requires: [
      /^\s*(\/\/\s*)?model\s+Post\s*\{/m,
      /@relation\((?=[^)]*fields:\s*\[\s*authorId\s*\])(?=[^)]*references:\s*\[\s*id\s*\])(?=[^)]*onDelete:\s*Cascade\b)/,
      /prisma\.user\.delete\(\s*\{\s*where:\s*\{\s*id:\s*userId\s*\}/,
    ],
    tieredHints: {
      apiSignature: '@relation(fields: [...], references: [...], onDelete?: Cascade | Restrict | SetNull | NoAction | SetDefault) / prisma.user.delete({ where }): Promise<User>',
      skeleton: `// Post model in schema.prisma
model Post {
  id       Int    @id @default(autoincrement())
  title    String
  content  String
  authorId Int
  author   User   @relation(fields: [authorId], references: [id], ____: ____)
}

async function deleteUser(userId: number) {
  return prisma.user.____({
    ____: { ____: userId },
  });
}`,
    },
    tags: ['prisma', 'cascade', 'delete', 'referential-actions', 'schema'],
    concepts: ['prisma-schema-relations'],
  },

  // 10. MC: Connection pooling in serverless
  {
    id: 'prisma-10',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.NEXT_PRISMA,
    course: Course.WEB_DEV,
    question: 'Your Next.js app runs on Vercel\'s serverless functions and uses Prisma with PostgreSQL. During traffic spikes the database starts refusing connections with "too many connections". Why, and what is the usual fix?',
    options: [
      { id: 'a', text: 'Every request leaves its connection open, so call `prisma.$disconnect()` before each function returns', isCorrect: false },
      { id: 'b', text: 'Each instance\'s pool is too small; raise `connection_limit` in DATABASE_URL so each instance gets more', isCorrect: false },
      { id: 'c', text: 'Each function instance opens its own pool, and a spike starts many instances; add a pooler such as PgBouncer', isCorrect: true },
      { id: 'd', text: 'It comes from dev hot reloading, and the globalThis singleton fixes it in production too', isCorrect: false },
    ],
    explanation: 'A long-running server keeps one PrismaClient and one connection pool for every request. On serverless, each function instance is a separate process with its own PrismaClient and its own pool, and a spike starts many instances at once: 100 instances with a pool of 5 each hold 500 connections, well past a typical PostgreSQL `max_connections` of 100. The usual fix is a pooler between the functions and the database, such as PgBouncer, Prisma Accelerate or your host\'s built-in pooler, which shares a few real database connections among many clients; with Prisma 6, a PgBouncer URL in transaction mode also takes `?pgbouncer=true`, and serverless apps often set `connection_limit=1` so each instance opens just one. Raising `connection_limit` makes the spike worse, `$disconnect()` per request only adds reconnect time while the instances still run at once, and the globalThis singleton prevents duplicate clients inside one dev process, not across many instances.',
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
    question: 'The database is PostgreSQL and Tag has a unique `label`. Complete the two insert calls: one creates a single tag, the other inserts an array of tags in one query, skipping any whose label already exists.',
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
    explanation: '`create` inserts one row and returns it. `createMany` sends one `INSERT` with every row of the array and returns only `{ count }`, the number of rows inserted, not the rows (`createManyAndReturn` gives the rows back). `skipDuplicates: true` adds `ON CONFLICT DO NOTHING`, so a label that already exists is skipped instead of failing the whole insert; it works on PostgreSQL, MySQL and CockroachDB, not on SQLite.',
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
    question: 'The database is PostgreSQL and the Tag model has a unique `label`. Write `seedTags`, which inserts three Tag rows in one query, labelled "sale", "new" and "featured", skipping any label that already exists instead of throwing. Return the number of rows it actually inserted.',
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
}
# OR
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function seedTags() {
  const { count } = await prisma.tag.createMany({
    data: [{ label: "sale" }, { label: "new" }, { label: "featured" }],
    skipDuplicates: true,
  });
  return count;
}
# OR
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function seedTags() {
  const result = await prisma.tag.createMany({
    data: ["sale", "new", "featured"].map((label) => ({ label })),
    skipDuplicates: true,
  });
  return result.count;
}`,
    explanation: '`createMany` sends one `INSERT` for the whole array instead of one round trip per row, as a loop of `create` calls would. It resolves to `{ count }`, the number of rows actually inserted, so `result.count` (or a destructured `count`) is the answer. `skipDuplicates: true` turns the insert into `INSERT ... ON CONFLICT DO NOTHING`: on a second run all three labels exist, nothing is inserted, and the function returns 0 instead of throwing a unique-constraint error. SQLite does not support `skipDuplicates`.',
    hints: [
      'createMany takes `data` as an array of row objects',
      'skipDuplicates: true avoids unique-constraint errors on rerun',
      'The return value has a `count` field',
    ],
    requires: [
      /prisma\.tag\.createMany\(/,
      /["'`]sale["'`]/,
      /["'`]new["'`]/,
      /["'`]featured["'`]/,
      /skipDuplicates:\s*true\b/,
      /\.count\b|\{\s*count\s*\}/,
    ],
    tieredHints: {
      apiSignature: 'prisma.tag.createMany({ data: TagCreateManyInput[], skipDuplicates?: boolean }): Promise<{ count: number }>',
      skeleton: `async function seedTags() {
  const result = await prisma.tag.____({
    ____: [{ label: "sale" }, { label: "new" }, { label: "featured" }],
    ____: ____,
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
    explanation: '`delete` needs a `where` on a unique field, such as the primary key `id`, so it can only ever remove one row; it returns that row and throws (Prisma error P2025) when no row matches. `deleteMany` takes any filter, such as `authorId`, removes every matching row and returns only `{ count }`, which is 0 when nothing matched.',
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
    explanation: '`enum Role { ... }` declares a fixed set of values; on PostgreSQL the migration creates a native enum type for it. A field typed `Role` can hold only `USER` or `ADMIN`: the generated client types it as `"USER" | "ADMIN"`, and the database rejects anything else. `@default(USER)` fills in `USER` for a row created without a role; the value is written bare, with no quotes, because it names an enum member.',
    hints: [
      'The schema keyword that declares a fixed set of values',
      'The attribute that supplies a value when none is given',
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
    explanation: '`gte` means greater than or equal, so `{ gte: 18 }` matches 18 and older; `gt`, `lt` and `lte` are its siblings, and all four work on numbers and dates. `in` matches any value in the array and becomes SQL `IN (3, 7, 12)`, which is shorter than an `OR` of three equality checks; `notIn` is its opposite.',
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
    question: 'Write `getFlaggedPosts`, which returns every post whose title contains "urgent" or contains "important", leaving out the posts written by the author with id 1.\n\nUse the `OR` and `NOT` operators of `where`.',
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
    explanation: '`OR` takes an array of conditions, and a row matches when any of them is true. `NOT` takes a condition (or an array of them) and keeps only the rows that do not match it, here every post whose `authorId` is not 1. Keys at the top level of `where` are joined with AND, so Prisma sends `(title LIKE \'%urgent%\' OR title LIKE \'%important%\') AND NOT authorId = 1`; wrapping both in an explicit `AND: [...]` gives the same query. On PostgreSQL `contains` is case-sensitive, so "URGENT" would need `mode: "insensitive"`.',
    hints: [
      'OR takes an array of where clauses',
      'NOT wraps a single condition to exclude it',
      'Fields at the top level of `where` are ANDed together',
    ],
    requires: [
      /prisma\.post\.findMany\(/,
      /\bOR:\s*\[/,
      /contains:\s*["'`]urgent["'`]/,
      /contains:\s*["'`]important["'`]/,
      /\bNOT:\s*\[?\s*\{\s*authorId:\s*1\s*\}/,
    ],
    tieredHints: {
      apiSignature: 'where: { OR?: PostWhereInput[], AND?: PostWhereInput[], NOT?: PostWhereInput | PostWhereInput[] }',
      skeleton: `async function getFlaggedPosts() {
  return prisma.post.findMany({
    where: {
      ____: [
        { title: { ____: "urgent" } },
        { title: { ____: "important" } },
      ],
      ____: { ____: 1 },
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
    question: 'PageView has a unique `path`. Complete the upsert: one blank names the data used when a row with that path already exists, the other the data used when there is none and a row must be created.',
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
    explanation: '`upsert` looks for the row that `where` names by a unique field: when it exists, `update` is applied (here the count goes up by one); when it does not, `create` inserts the new row. Because `where` holds just the unique `path` and `create` uses the same value, Prisma 6 sends one native statement on PostgreSQL, `INSERT ... ON CONFLICT ("path") DO UPDATE`, so two requests at once cannot both create the row. When those conditions do not hold, Prisma falls back to a read and then a write, which can still hit a unique-constraint error under concurrency.',
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
    question: 'PageView has a unique `path`. Your colleague writes this to record a page view counter:\n\n```typescript\nconst existing = await prisma.pageView.findUnique({ where: { path } });\nif (existing) {\n  await prisma.pageView.update({ where: { path }, data: { count: { increment: 1 } } });\n} else {\n  await prisma.pageView.create({ data: { path, count: 1 } });\n}\n```\n\nWhy is `prisma.pageView.upsert({ where: { path }, update: {...}, create: {...} })` a better fit here?',
    options: [
      { id: 'a', text: 'Two concurrent requests for a new path can both see no row and both call create, so one fails on the unique constraint; upsert lets the database check and write in one statement', isCorrect: true },
      { id: 'b', text: 'upsert is only a shorthand: it still runs the same read and then the conditional write as two round trips, so the behavior under concurrent requests is unchanged', isCorrect: false },
      { id: 'c', text: 'Prisma throws a runtime error when update runs without a findUnique before it in the same function, and upsert is the way to avoid that requirement', isCorrect: false },
      { id: 'd', text: 'Both versions behave the same under concurrent requests; upsert is only faster because it skips validating the where clause before running the query', isCorrect: false },
    ],
    explanation: 'The read-then-branch code has a time-of-check-to-time-of-use race: two requests for a new path can both read "no row" before either writes, both call `create`, and the second fails with a unique-constraint error (Prisma code P2002). This `upsert` has a `where` on the one unique field and a `create` with the same `path`, so Prisma 6 runs it as a single database statement, `INSERT ... ON CONFLICT ("path") DO UPDATE SET count = count + 1` on PostgreSQL, and the database settles the race itself. Prisma uses that native form only when `where` names one unique field that `create` repeats and there are no nested writes; otherwise it still reads and then writes, so the code must catch P2002 and retry. Prisma never requires a read before `update`, and the gain is correctness, not speed.',
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
    question: 'Write `getNextPage(lastPostId)`, which returns the 10 posts that come after the post with id `lastPostId`, ordered by id ascending. Use cursor-based pagination: start from that post with `cursor`, leave the cursor row itself out, and take 10.',
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
    explanation: '`cursor: { id: lastPostId }` starts the page at the row with that unique id, and Prisma turns it into `WHERE id >= (that row\'s id)` on the indexed key, so the database seeks straight to it however deep the page is; a large `skip` instead makes the database read and discard every skipped row. The cursor row itself was the last one on the previous page, so `skip: 1` leaves it out, and `take: 10` returns the next ten. `orderBy` on the cursor field keeps the pages in a fixed order.',
    hints: [
      'cursor takes a unique where-style object, usually { id: ... }',
      'skip: 1 excludes the cursor row itself from the results',
      'A deterministic orderBy is still required',
    ],
    requires: [
      /prisma\.post\.findMany\(/,
      /cursor:\s*\{\s*id:\s*lastPostId\s*\}/,
      /\bskip:\s*1\b/,
      /\btake:\s*10\b/,
      /orderBy:\s*\[?\s*\{\s*id:\s*["'`]asc["'`]/,
    ],
    tieredHints: {
      apiSignature: 'prisma.post.findMany({ cursor?: PostWhereUniqueInput, skip?: number, take?: number, orderBy? })',
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
      { id: 'a', text: 'skip/take becomes an indexed seek at any offset, so the delay must come from the network or the connection pool', isCorrect: false },
      { id: 'b', text: 'Pages are too small: raise `take` so each request returns more rows and deep pages need fewer requests', isCorrect: false },
      { id: 'c', text: 'Prisma\'s skip/take is the slow part; the same LIMIT and OFFSET written as raw SQL with $queryRaw is fast', isCorrect: false },
      { id: 'd', text: 'A large `skip` makes the database read and discard every skipped row; cursor pagination seeks straight to the last row seen', isCorrect: true },
    ],
    explanation: '`skip`/`take` becomes `OFFSET`/`LIMIT`, and the database cannot jump to row 50,001: it reads the first 50,000 rows in order and throws them away, so each page costs more the deeper it is, whoever writes the SQL. Cursor pagination (`cursor: { id: lastId }, skip: 1, take: 10`) starts from the last row the user saw, which the database finds through the index on `id`, so page 5,000 costs about the same as page 2. A bigger `take` only makes each page heavier. The trade-off is that a cursor cannot jump straight to page 5,000; it moves page by page from a known row.',
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
    question: 'Complete the two queries: the first counts the published posts, the second computes the sum of every order\'s `total` and the average `itemCount` per order.',
    template: `const published = await prisma.post.___({ where: { published: true } });

const stats = await prisma.order.aggregate({
  ___: { total: true },
  ___: { itemCount: true },
});`,
    blanks: ['count', '_sum', '_avg'],
    solution: `const published = await prisma.post.count({ where: { published: true } });

const stats = await prisma.order.aggregate({
  _sum: { total: true },
  _avg: { itemCount: true },
});`,
    explanation: '`count` returns the number of matching rows as a plain number, which is cheaper than fetching the rows to read `.length`. `aggregate` computes several statistics in one `SELECT`: `_sum: { total: true }` adds up `total` and `_avg: { itemCount: true }` averages `itemCount`, and the results come back under the same keys, as `stats._sum.total` and `stats._avg.itemCount`. `_min`, `_max` and `_count` work the same way.',
    hints: [
      'The method that returns only a row count',
      'The aggregate keys start with an underscore: one for a sum, one for an average',
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
    question: 'Assemble a many-to-many relation between Post and Tag that uses Prisma\'s implicit join table, with no join model of your own. Write the Post model first, then the Tag model; in each, list the `id` first, then its own field (`title` or `label`), then the relation list.',
    correctOrder: [
      'model Post {',
      '  id    Int    @id @default(autoincrement())',
      '  title String',
      '  tags  Tag[]',
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
    ],
    solution: `model Post {
  id    Int    @id @default(autoincrement())
  title String
  tags  Tag[]
}
model Tag {
  id    Int    @id @default(autoincrement())
  label String @unique
  posts Post[]
}`,
    explanation: 'When both sides of a relation are lists (`tags Tag[]` on Post and `posts Post[]` on Tag), Prisma reads it as a many-to-many relation and its migration creates a hidden join table, `_PostToTag`, with one column per side (`A` and `B`). You never declare that table: you link rows through the relation fields, as in `tags: { connect: [{ label: "sale" }] }`. A `PostTag` model of your own (an explicit many-to-many) is needed only when the link carries data of its own, such as an `assignedAt` time, and then it also needs its own `@relation` fields.',
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
      { id: 'a', text: 'In a join table Prisma creates and manages itself (named like _PostToTag), which you reach only through the tags and posts relation fields', isCorrect: true },
      { id: 'b', text: 'In a nullable tagId column on Post, so each post holds one tag at a time and a true many-to-many relation cannot be expressed', isCorrect: false },
      { id: 'c', text: 'In an integer array column (`Int[]` on PostgreSQL) on each model, holding the ids of the rows on the other side', isCorrect: false },
      { id: 'd', text: 'Nowhere: Prisma rejects this schema, since a many-to-many relation always needs a join model you define by hand', isCorrect: false },
    ],
    explanation: 'Because Post.tags and Tag.posts are both lists of the other model, Prisma treats the pair as an implicit many-to-many relation, and the migration creates a join table named `_PostToTag` with two columns, `A` (the post id) and `B` (the tag id), one row per link. Neither model gets a new column, neither a foreign key nor an id array. You use the table only through the relation fields (`post.tags`, `tag.posts`, `connect`, `disconnect`); the client has no model for it. A join model of your own is needed only when each link carries extra data.',
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
    question: 'A booking system allows one booking per room per day, so no two rows may share the same `roomId` and `day`. The daily schedule page also looks up every booking on one `day`, across all rooms, and it must stay fast as the table grows. Which schema addition covers both?\n\n```prisma\nmodel Booking {\n  id     Int      @id @default(autoincrement())\n  roomId Int\n  day    DateTime\n}\n```',
    options: [
      { id: 'a', text: 'Add `@unique` to `roomId` and to `day`: two single-column unique rules enforce the pair rule', isCorrect: false },
      { id: 'b', text: 'Add `@@unique([roomId, day])` for the pair rule and `@@index([day])` for the day lookups', isCorrect: true },
      { id: 'c', text: 'Add only `@@unique([roomId, day])`: its index finds the rows of one day as fast as one room\'s', isCorrect: false },
      { id: 'd', text: 'Add only `@@index([roomId, day])`: an index on both columns also refuses a repeated pair', isCorrect: false },
    ],
    explanation: '`@@unique([roomId, day])` is a model-level attribute that makes the pair unique: room 4 can be booked on many days and a day can hold many rooms, but room 4 on 1 May only once. Two single `@unique` fields would instead allow each room only one booking ever and each day only one booking. The unique rule is kept as an index sorted by `roomId` first, then `day`, so it serves lookups by room, or by room and day, but cannot seek straight to one day across all rooms; `@@index([day])` adds an index that can. A plain `@@index` speeds up lookups and refuses nothing; only `@unique` and `@@unique` reject duplicates.',
    hints: [
      'Composite uniqueness needs a model-level attribute spanning both fields',
      'A two-column index is sorted by its first column, then its second',
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
  {
    id: 'tanstack-dedupe-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_TANSTACK,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Shelves renders inside the app\'s QueryClientProvider, and a visitor opens the page for the first time. What does the browser console log? Type each logged line in order, one per line.',
    code: `"use client";
import { useQuery } from "@tanstack/react-query";

function Count({ shelf }) {
  const { data } = useQuery({
    queryKey: ["books", shelf],
    queryFn: async () => {
      console.log("fetch " + shelf);
      return 3;
    },
  });
  return <p>{shelf}: {data ?? "..."}</p>;
}

export default function Shelves() {
  return (
    <>
      <Count shelf="poetry" />
      <Count shelf="poetry" />
      <Count shelf="crime" />
    </>
  );
}`,
    expectedOutput: `fetch poetry
fetch crime`,
    explanation: 'The queryKey is the cache entry\'s identity. The two poetry counts ask for the same key, ["books", "poetry"], so they share one cache entry, and TanStack Query runs its queryFn once and hands both components the result. ["books", "crime"] is a different key, so it gets its own entry and its own fetch. That is why every value the queryFn uses (here, shelf) belongs in the key: two components asking for the same data share one request, and a different shelf never reads another shelf\'s cache.',
    hints: ['How many different query keys do the three components use?', 'What does TanStack Query do when two components ask for the same key at the same time?'],
    tags: ['tanstack-query', 'useQuery', 'queryKey', 'deduplication', 'predict'],
    concepts: ['next-tanstack-query'],
  },
];
