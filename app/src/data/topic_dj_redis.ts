/**
 * Topic.DJ_REDIS — all question types for this topic.
 * Auto-consolidated by scripts/consolidate-by-topic.js from:
 *   celeryDrfQuestions.ts (3), djangoGapFillQuestions.ts (1)
 */
import {
  Question,
  QuestionType,
  Difficulty,
  Topic,
  Course,
  CodeLanguage,
} from '../types';

export const dj_redis_questions: Question[] = [
    // 1. MC: 3 main uses of Redis in Django
  {
      id: 'celery-drf-9',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_REDIS,
      course: Course.BACKEND,
      question: 'What are the 3 main uses of Redis in a Django stack?',
      options: [
        { id: 'a', text: 'Cache backend for the Django cache framework, message broker for Celery, and session storage -- all exploiting its in-memory speed', isCorrect: true },
        { id: 'b', text: 'Primary database replacement, durable file storage for media uploads, and the outgoing email queue used by django.core.mail', isCorrect: false },
        { id: 'c', text: 'SQL query plan caching, serving static files in production, and hashing user passwords faster than PBKDF2', isCorrect: false },
        { id: 'd', text: 'Application log aggregation, full-text search indexing, and enforcing HTTPS redirects at the network edge', isCorrect: false },
      ],
      explanation: 'Redis excels in Django for three roles: (1) Cache backend -- cache.set("key", value, timeout=300) for view caching, query result caching, and template fragment caching. (2) Celery broker -- CELERY_BROKER_URL="redis://localhost:6379/0" replaces RabbitMQ with less operational overhead. (3) Session storage -- SESSION_ENGINE="django.contrib.sessions.backends.cache" stores sessions in Redis instead of the database. All three leverage Redis being in-memory (microsecond reads) with optional persistence.',
      tags: ['redis', 'django', 'cache', 'celery-broker', 'sessions'],
      concepts: ['dj-caching', 'dj-http-cycle'],
    },
    // 2. Coding: Configure Redis as cache backend
    // 3. MC: Redis data structures
  {
      id: 'celery-drf-11',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_REDIS,
      course: Course.BACKEND,
      question: 'What Redis data structures are most useful and when should you use each?',
      options: [
        { id: 'a', text: 'Redis stores only flat key-value string pairs, so structured data like queues or rankings must be serialized to JSON first', isCorrect: false },
        { id: 'b', text: 'Redis supports relational Tables, Views, and Indexes, so you can run SQL-style joins across keys for reporting queries', isCorrect: false },
        { id: 'c', text: 'Strings for caching, lists for queues/feeds, sets for unique collections, sorted sets for leaderboards, hashes for objects, pub/sub for events', isCorrect: true },
        { id: 'd', text: 'Redis ships with only Strings and Lists -- Sets, Hashes, and Sorted Sets require installing separate plugin modules', isCorrect: false },
      ],
      explanation: 'Redis is more than a key-value store -- its data structures are why it is so versatile. Strings: SET/GET for caching (most common). Lists: LPUSH/RPOP for queues, recent activity feeds. Sets: SADD/SMEMBERS for unique tags, online users. Sorted Sets: ZADD/ZRANGE for leaderboards where each member has a score. Hashes: HSET/HGET for storing objects (like a user profile with multiple fields) without serializing to JSON. Pub/Sub: PUBLISH/SUBSCRIBE for real-time notifications between services.',
      tags: ['redis', 'data-structures', 'strings', 'lists', 'sets', 'sorted-sets'],
      concepts: ['py-list-aliasing'],
    },
  {
      id: 'dj-redis-gap-1',
      type: QuestionType.MULTIPLE_CHOICE,
      difficulty: Difficulty.BEGINNER,
      topic: Topic.DJ_REDIS,
      course: Course.BACKEND,
      question: 'What is Redis and why is it commonly used with Django?\n\nRedis is one of the most popular tools in backend development. Almost every production Django application uses it for at least one purpose.',
      options: [
        {
          id: 'a',
          text: 'A relational database that replaces PostgreSQL in production because its query planner is optimized for high-traffic web workloads',
          isCorrect: false,
        },
        {
          id: 'b',
          text: 'A frontend JavaScript library for managing application state, often paired with React components in Django templates',
          isCorrect: false,
        },
        {
          id: 'c',
          text: 'A file storage system similar to Amazon S3 that Django uses to serve static assets and user-uploaded media files at scale',
          isCorrect: false,
        },
        {
          id: 'd',
          text: 'An in-memory data store used for caching, as a Celery message broker, for sessions, and for rate limiting — fast because data lives in RAM',
          isCorrect: true,
        },
      ],
      explanation: 'Redis (Remote Dictionary Server) stores data in memory (RAM) rather than on disk, making it incredibly fast — typical operations take under 1 millisecond. In a Django stack, Redis commonly serves multiple roles: (1) Cache backend: store query results, rendered pages, computed values. (2) Celery broker: queue task messages for async processing. (3) Session storage: faster than database-backed sessions. (4) Rate limiting: track request counts per user/IP. It supports rich data structures (strings, lists, sets, sorted sets, hashes) that go far beyond simple key-value storage.',
      hints: [
        'Key insight: Redis is fast because it stores everything in RAM, not on disk',
        'One Redis server often handles caching AND Celery brokering for a Django app',
      ],
      tags: ['redis', 'caching', 'celery', 'in-memory', 'basics'],
      concepts: ['ce-task-idempotency'],
    },
];
