import { CodeLanguage, Course, Difficulty, Question, QuestionType, SqlTable, Topic } from '../types';

/**
 * Data Engineering, section "Distributed Data": the sixth section of the
 * course rewrite (decisions and designs). Three topics, each taught by a
 * lesson (src/data/lessons/dataEngineeringLessons.ts) and then practised with
 * cards that make the learner produce the answer:
 *
 *   introduce: one term-check MCQ, predict the outcome over small tables;
 *   combine:   choose and justify, order the steps (Parsons with prose lines);
 *   apply:     spot the flaw, predict or choose under three or more constraints;
 *   review:    explain in your own words (review-only, never a new card).
 *
 * Authoring rules for this file (the same as the sections before it):
 *   - MCQ distractors are real misconceptions with their (wrong) reasoning,
 *     options length-matched, no absolute-word giveaways;
 *   - every predict-the-outcome answer is checked by running it:
 *     dataEngineeringDistributedChecks.ts holds the check,
 *     scripts/check-outcomes.js runs it (part of npm test);
 *   - tool-agnostic: tables, SQL and a few lines of pseudo-config are the
 *     notation, never one vendor's API. "Partition", "leader", "follower",
 *     "quorum", "memtable" and "bloom filter" are the general terms; every
 *     distributed engine and database has them under some name.
 *
 * It replaces the old MCQ-only Distributed Systems & Storage section
 * (de-dist-, de-part-, de-repl-, de-lsm-, de-comp-); those ids are not reused.
 */

const DE = Course.DATA_ENGINEERING;

const table = (name: string, columns: string[], rows: (string | number | null)[][]): SqlTable => ({ name, columns, rows });

/** Prose lines for a Parsons card: its solution is the lines in order. */
const steps = (lines: string[]) => lines.join('\n');

// ════════════════════════════════════════════════════════════════════════
// Partitioning, Skew & Hot Keys
// ════════════════════════════════════════════════════════════════════════

const skew: Question[] = [
  {
    id: 'de-skew-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_PARTITION_SKEW,
    course: DE,
    question:
      'A nightly group-by runs as 8 parallel tasks, one per partition. Seven finish in 6 minutes and the eighth runs for 50, and its input is about 9 times the size of each of the others. What is going on?',
    options: [
      { id: 'a', text: 'A slow machine: the eighth task landed on older hardware, so it works through its rows more slowly', isCorrect: false },
      { id: 'b', text: 'Data skew: a few keys hold so many of the rows that the partition they go to gets most of the work', isCorrect: true },
      { id: 'c', text: 'Too many distinct keys: with so many values, one partition is left holding the keys that do not divide', isCorrect: false },
      { id: 'd', text: 'Too few tasks: with 8 tasks for the whole table, the last one waits for the other seven to hand over rows', isCorrect: false },
    ],
    explanation:
      'Rows go to a partition by their key, so every row of one key lands in the same partition. When a few keys hold a big share of the rows, their partition is far bigger than the rest, and the step waits for it: that is skew, and the hot key behind it is often a NULL, a default such as \'unknown\', or one huge customer.\n' +
      'The 9-times input rules out a slow machine; many distinct keys spread rows evenly, the opposite of skew; and the tasks run side by side rather than handing rows to each other.',
  },
  {
    id: 'de-skew-2',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_PARTITION_SKEW,
    course: DE,
    question:
      'A job spreads these sales over 3 partitions by store_id: a row\'s partition is store_id % 3.\n' +
      'How many rows land in the busiest partition?',
    tables: [
      table('sales', ['sale_id', 'store_id'], [
        [1, 4],
        [2, 4],
        [3, 2],
        [4, 4],
        [5, 9],
        [6, 4],
        [7, 3],
        [8, 4],
        [9, 5],
        [10, 4],
        [11, 6],
        [12, 7],
      ]),
    ],
    answer: '7',
    unit: 'rows',
    tempting: [
      { answer: '4', why: '4 is an even split of 12 rows over 3 partitions. A hash spreads keys, not rows: every sale of store 4 goes to one partition.' },
      { answer: '6', why: '6 is store 4 alone. Store 7 also lands in partition 1, since 7 % 3 is 1.' },
    ],
    explanation:
      'Stores 4 and 7 map to partition 1 (4 % 3 = 7 % 3 = 1): store 4\'s six sales plus store 7\'s one make 7 rows. Partition 0 gets stores 9, 3 and 6 (3 rows) and partition 2 stores 2 and 5 (2 rows).\n' +
      'Hashing balances the number of keys per partition; the rows follow their key, so one busy store makes one busy partition.',
  },
  {
    id: 'de-skew-3',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_PARTITION_SKEW,
    course: DE,
    question:
      'A stage runs one task per partition, all four at the same time, and each task works through 1,000 rows a second.\n' +
      'How many seconds does the stage take?',
    tables: [
      table('partitions', ['partition_id', 'row_count'], [
        [0, 40000],
        [1, 38000],
        [2, 240000],
        [3, 42000],
      ]),
    ],
    answer: '240',
    unit: 'seconds',
    tempting: [
      { answer: '90', why: '90 is the total of 360,000 rows shared evenly over 4 tasks. The rows are not shared: each task has its own partition, and the stage waits for the biggest.' },
      { answer: '360', why: '360 would be one task doing all the partitions in turn. The four run side by side.' },
    ],
    explanation:
      'The tasks run in parallel, so the stage ends when the last one ends: partition 2\'s 240,000 rows take 240 seconds, while the other three are done in about 40 and then sit idle.\n' +
      'The time of a parallel step is the time of its largest partition, not the total rows over the number of machines. That is why skew, not data size, is what makes a distributed job slow.',
  },
  {
    id: 'de-skew-4',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_PARTITION_SKEW,
    course: DE,
    question:
      'A job partitions rows by customer_id % 4, and its largest partition holds 1,010 rows. To speed it up, the team doubles the partitions and the machines: a row\'s partition is now customer_id % 8.\n' +
      'How many rows does the largest partition hold now?',
    tables: [
      table('key_counts', ['customer_id', 'row_count'], [
        [16, 900],
        [3, 100],
        [5, 120],
        [10, 80],
        [12, 110],
        [21, 90],
        [7, 100],
      ]),
    ],
    answer: '900',
    unit: 'rows',
    tempting: [
      { answer: '505', why: '505 assumes doubling the partitions halves each one. Customer 16\'s 900 rows share one key, and one key goes to one partition however many there are.' },
      { answer: '1010', why: '1,010 was customers 16 and 12 together under % 4. Under % 8, 12 moves to partition 4 and 16 stays alone in partition 0.' },
    ],
    explanation:
      'Under % 8, customer 16 goes to partition 0 by itself with 900 rows; the next biggest is partition 5 (customers 5 and 21, 210 rows). The doubled job is barely faster: 900 rows against 1,010.\n' +
      'More partitions split the keys more finely, but never one key. A hot key needs its rows spread on purpose, by salting it.',
  },
  {
    id: 'de-skew-5',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_PARTITION_SKEW,
    course: DE,
    question:
      'A join of orders to customers is slow because customer 8 has most of the orders. The team salts that one key: on the orders side, customer 8\'s rows get salt = order_id % 4 and every other row gets salt 0, and the join matches on customer_id and salt.\n' +
      'To keep every match, how many rows must the customers side hold going into the join?',
    code:
      'orders:    salt = order_id % 4 for customer 8\n' +
      '           salt = 0 for the other customers\n' +
      'customers: a copy per salt its orders can have\n' +
      'join on:   customer_id and salt',
    tables: [
      table('customers', ['customer_id', 'region'], [
        [3, 'north'],
        [5, 'south'],
        [6, 'south'],
        [8, 'east'],
        [11, 'west'],
        [14, 'north'],
      ]),
    ],
    answer: '9',
    unit: 'rows',
    tempting: [
      { answer: '6', why: '6 keeps one row per customer, with salt 0. Customer 8\'s orders with salt 1, 2 and 3 would then find no customer and drop out of the join.' },
      { answer: '24', why: '24 copies every customer 4 times. Only customer 8 was salted; the others\' orders all carry salt 0, so one copy each is enough.' },
    ],
    explanation:
      'Customer 8\'s orders now carry salts 0 to 3, so the customers side needs customer 8 four times, once per salt, and the other five customers once each with salt 0: 4 + 5 = 9 rows.\n' +
      'Salting a join key spreads the hot key over 4 partitions, and the price is copying the other side\'s matching row to each of them. Salt only the hot keys, so the copies stay few.',
  },
  {
    id: 'de-skew-6',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_PARTITION_SKEW,
    course: DE,
    question:
      'A clickstream of 2 billion rows a day is written into 64 partitions, and the main job groups each user\'s clicks into sessions. About 40% of clicks come from one country, and event_type has 5 values.\n' +
      'Which partition key should the table use, and why?',
    decisions: [
      { id: 'user', text: 'Hash on user_id, so each user\'s clicks sit together in one partition', isCorrect: true },
      { id: 'country', text: 'Hash on country, since the reports are filtered and split by country', isCorrect: false },
      { id: 'type', text: 'Hash on event_type, so a job reads just the type of event it needs', isCorrect: false },
      { id: 'time', text: 'Range on event_time, so each hour of a day gets a partition of its own', isCorrect: false },
    ],
    reasons: [
      { id: 'cardinality', text: 'It has millions of values with none dominant, and it is the key the sessions job needs kept together', isCorrect: true },
      { id: 'few-values', text: 'A key with fewer values makes fewer and larger partitions, and large partitions are read the fastest', isCorrect: false },
      { id: 'hash-evens', text: 'Once a key is hashed the rows spread evenly whatever it is, so pick the key the reports filter on', isCorrect: false },
      { id: 'newest', text: 'Keeping the newest rows together lets the writers fill one partition at a time, at full speed', isCorrect: false },
    ],
    explanation:
      'A good partition key has many values, no value with a big share of the rows, and matches what the main job needs together. user_id has millions of values, and sessions are built per user, so each user\'s clicks are already in one place.\n' +
      'country puts 40% of the rows in one partition, event_type keeps at most 5 of the 64 busy, and a range on time sends all of the current hour\'s writes to one partition. Hashing spreads keys, not rows, so a key with a hot value stays hot.',
  },
  {
    id: 'de-skew-7',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_PARTITION_SKEW,
    course: DE,
    question:
      'A daily job joins a 2 TB orders table to a 5 MB currency_rates table on currency. There are 30 currencies, and 60% of orders are in one of them.\n' +
      'How should the join run, and why?',
    decisions: [
      { id: 'broadcast', text: 'Broadcast currency_rates: send a full copy of it to every task reading orders', isCorrect: true },
      { id: 'shuffle', text: 'Shuffle both tables by currency, so that each currency meets in one partition', isCorrect: false },
      { id: 'salt', text: 'Salt the busiest currency into 30 sub-keys and shuffle both tables by those', isCorrect: false },
      { id: 'sort', text: 'Sort both tables by currency first, then merge them in a single ordered pass', isCorrect: false },
    ],
    reasons: [
      { id: 'cheap-copy', text: 'A 5 MB copy per task costs far less than moving 2 TB over the network, and no orders change place', isCorrect: true },
      { id: 'few-even', text: 'With just 30 currencies the shuffle stays small, and the keys spread evenly over the 30 partitions', isCorrect: false },
      { id: 'exact', text: 'A shuffle join can drop rows whose keys land on two machines, while a broadcast join keeps each row', isCorrect: false },
      { id: 'salt-fix', text: 'Salting makes the busy currency as small as the others, and the copies of its rate cost nothing', isCorrect: false },
    ],
    explanation:
      'When one side of a join fits easily in each task\'s memory, copy it to every task: each task joins its own slice of orders locally, so the 2 TB never crosses the network and the hot currency never piles up in one partition.\n' +
      'A shuffle by currency would move every order and send 60% of them to one task. Salting would work, but it fixes a skew the broadcast avoids for free. Shuffle joins do not lose rows; they are just slow here.',
  },
  {
    id: 'de-skew-8',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_PARTITION_SKEW,
    course: DE,
    language: CodeLanguage.SQL,
    question:
      'A total per merchant runs for hours because one merchant holds a third of the rows. The totals must stay exact.\n' +
      'Put the steps of fixing it by salting in order. Two steps do not belong.',
    correctOrder: [
      'Count rows per merchant to find the keys that hold the most rows',
      'Give the hot merchant\'s rows a salt from 0 to 7, taken from order_id % 8',
      'Sum by merchant and salt, so the hot merchant is summed in 8 tasks at once',
      'Sum those partial totals by merchant alone, adding up the hot merchant\'s 8 parts',
      'Compare the totals per merchant with the old job\'s on one day before switching',
    ],
    distractorLines: [
      'Add 8 times the machines, so the hot merchant\'s partition is split between them',
      'Take the average of the hot merchant\'s 8 partial totals as its final total',
    ],
    solution: steps([
      'Count rows per merchant to find the keys that hold the most rows',
      'Give the hot merchant\'s rows a salt from 0 to 7, taken from order_id % 8',
      'Sum by merchant and salt, so the hot merchant is summed in 8 tasks at once',
      'Sum those partial totals by merchant alone, adding up the hot merchant\'s 8 parts',
      'Compare the totals per merchant with the old job\'s on one day before switching',
    ]),
    explanation:
      'Salting splits one key into several, so its rows are spread over several tasks, and a second step puts the parts back together. A sum, a count or a max can be computed in parts this way; an average is combined from the parts\' sums and counts, never by averaging averages.\n' +
      'More machines do not help: a key\'s rows all go to one partition, which runs on one machine.',
  },
  {
    id: 'de-skew-9',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_PARTITION_SKEW,
    course: DE,
    question:
      'A join of orders to customers on customer_id shuffles both sides into 4 partitions by customer_id % 4, and the engine sends every NULL key to partition 0. Guest checkouts have no customer_id.\n' +
      'How many orders rows does partition 0 receive?',
    tables: [
      table('orders', ['order_id', 'customer_id'], [
        [1, null],
        [2, 4],
        [3, null],
        [4, 1],
        [5, null],
        [6, 2],
        [7, 8],
        [8, null],
        [9, 3],
        [10, 5],
        [11, null],
        [12, 6],
      ]),
    ],
    answer: '7',
    unit: 'rows',
    tempting: [
      { answer: '2', why: '2 counts customers 4 and 8 only. The five guest orders have a NULL key, and every NULL goes to partition 0.' },
      { answer: '3', why: '3 is an even split of 12 orders over 4 partitions. The NULLs all share one partition.' },
    ],
    explanation:
      'Partition 0 gets customers 4 and 8 (4 % 4 = 8 % 4 = 0) and all five NULLs: 7 of the 12 rows. And a NULL never equals anything, so the five guest orders cannot join to any customer: partition 0 does most of the work for rows that produce nothing.\n' +
      'In real data NULLs and defaults such as \'unknown\' or 0 are the most common hot keys. Filter them out before the shuffle when they cannot match, or give them a spread-out key when they must be kept.',
  },
  {
    id: 'de-skew-10',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_PARTITION_SKEW,
    course: DE,
    question:
      'A daily total per merchant runs on 32 tasks. One marketplace merchant holds 35% of the rows, so one task runs for 3 hours while the rest finish in 10 minutes. Finance needs every total exact, and the job must finish by 06:00.\n' +
      'What should you change, and why?',
    decisions: [
      { id: 'salt', text: 'Salt the marketplace\'s rows into 16 parts, then add up its 16 partial totals', isCorrect: true },
      { id: 'more-tasks', text: 'Raise the task count from 32 to 128, so each partition gets a smaller share', isCorrect: false },
      { id: 'range', text: 'Partition merchants by range of id, so the marketplace gets a range of its own', isCorrect: false },
      { id: 'sample', text: 'Sum a 10% sample of the marketplace\'s rows and multiply its total by ten', isCorrect: false },
    ],
    reasons: [
      { id: 'parts', text: 'One key\'s rows go to one task however many there are, and a sum can be taken in parts and added up', isCorrect: true },
      { id: 'smaller', text: 'More tasks make each partition smaller, the hot one too, until it finishes in time with the rest', isCorrect: false },
      { id: 'own-range', text: 'A range of its own gives the big merchant a partition that nobody else uses, so it stops being the slow one', isCorrect: false },
      { id: 'close', text: 'A sample of millions of rows is within a fraction of a percent, which is as good as exact for a total', isCorrect: false },
    ],
    explanation:
      'The hot task is one key, and a key goes to one partition: 128 tasks or a range of its own still leave 35% of the rows on one machine. Salting splits that key into 16 sub-keys, the 16 parts run in parallel, and a second, tiny step adds them up, so the total stays exact.\n' +
      'A sample is fast but breaks the constraint that every total is exact.',
  },
  {
    id: 'de-skew-11',
    type: QuestionType.SPOT_FLAW,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_PARTITION_SKEW,
    course: DE,
    question:
      '399 of 400 tasks finish in 2 minutes and one runs for 3 hours. The sessions it writes for that key are also nonsense: one "visit" lasting all day.\n' +
      'Click the line that causes it.',
    lines: [
      'source: page_views',
      'filter: viewed_at on run_date',
      'key: user_id = COALESCE(login_id, \'anonymous\')',
      'shuffle: 400 partitions by hash(key)',
      'aggregate: sessions per key, a new session after a 30-minute gap',
      'write: sessions, partitioned by run_date',
    ],
    flawLines: [3],
    note: 'About 30% of page views are from visitors who are not logged in. Each browser has its own device_id cookie.',
    explanation:
      'Every logged-out view gets the same key, \'anonymous\', so 30% of the rows hash to one partition, and every logged-out visitor\'s views are glued into one long session.\n' +
      'Key logged-out views on something that tells visitors apart, COALESCE(login_id, device_id): the rows spread over the 400 partitions and each visitor gets sessions of their own.',
  },
  {
    id: 'de-skew-12',
    type: QuestionType.SPOT_FLAW,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_PARTITION_SKEW,
    course: DE,
    question:
      'Inserts into events slow down at busy times: one node runs at full load while the other 15 are nearly idle.\n' +
      'Click the line that causes it.',
    lines: [
      'table: events',
      'event_id: the next value of a counter, 1, 2, 3, ...',
      'partition by: range(event_id), 16 ranges of 10 million ids',
      'nodes: 16, one range each',
      'writers: 32 processes, 50,000 inserts a second in all',
    ],
    flawLines: [3],
    note: 'Reads look events up by event_id; nobody reads a range of ids.',
    explanation:
      'Ids only grow, so every new event falls in the newest range, and the node that holds it takes all 50,000 inserts a second while the old ranges only answer reads.\n' +
      'A range key that follows time (a counter, a timestamp) always has a hot newest range. Since nobody reads ranges of ids, hash the id: new events then spread over all 16 nodes.',
  },
  {
    id: 'de-skew-13',
    type: QuestionType.EXPLAIN,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_PARTITION_SKEW,
    course: DE,
    question: 'In two or three sentences: why does adding machines not speed up a job held back by one hot key, and what does?',
    keyPoints: [
      'Rows go to a partition by key, so every row of the hot key goes to one partition on one machine',
      'A parallel step lasts as long as its largest partition, so the extra machines sit idle',
      'Salting splits the hot key into sub-keys spread over many tasks, then a second step combines the parts',
      'For a join, broadcasting a small side, or dropping NULL keys that cannot match, avoids the hot partition',
    ],
    modelAnswer:
      'A key decides the partition, so all of a hot key\'s rows land in one partition that one machine has to work through, and the step waits for it however many other machines finish early. ' +
      'The fix is to spread that key on purpose: salt it into sub-keys, work on the parts in parallel and combine them, or for a join, broadcast the small table or filter out keys such as NULL that never match.',
    explanation: 'The time of a parallel step is the time of its largest partition, so balance matters more than total size.',
  },
  {
    id: 'de-skew-14',
    type: QuestionType.EXPLAIN,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_PARTITION_SKEW,
    course: DE,
    question: 'In two or three sentences: how do you choose the partition key for a big table, and why is it worth getting right the first time?',
    keyPoints: [
      'Many distinct values, with no single value (a NULL, a default, one huge customer) holding a big share',
      'The key the main jobs group or join by, so their rows are already together',
      'A range key that grows with time puts all new writes in the newest range; hash it unless ranges are read',
      'Changing the key later means moving every row to a new partition across the cluster',
    ],
    modelAnswer:
      'Pick a key with many values and no dominant one, checking for NULLs and defaults, that matches what the main jobs group or join by; avoid a range on a growing key such as a timestamp unless ranges are what is read, since the newest range takes every write. ' +
      'It is worth getting right up front because the key decides where every row lives, so changing it means rewriting and moving the whole table.',
    explanation: 'The same rule holds for a stored table, a shuffle inside a job and a streaming topic: the key decides where the work goes.',
  },
];

// ════════════════════════════════════════════════════════════════════════
// Replication & Consistency
// ════════════════════════════════════════════════════════════════════════

const replication: Question[] = [
  {
    id: 'de-replica-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_REPLICATION_CONSISTENCY,
    course: DE,
    question:
      'A leader replicates to two followers asynchronously. It acknowledges a write to the client, crashes a moment later, and a follower is promoted to leader. What can happen to that write?',
    options: [
      { id: 'a', text: 'It is kept: once a write is acknowledged it is durable, so each replica holds it when the crash is over', isCorrect: false },
      { id: 'b', text: 'It is applied twice: the client retries after the crash, and the follower already had the first copy', isCorrect: false },
      { id: 'c', text: 'It can be lost: the leader said done before a follower had it, so the new leader may never get it', isCorrect: true },
      { id: 'd', text: 'It is held back: the followers wait for the old leader to come back before they take new writes', isCorrect: false },
    ],
    explanation:
      'Asynchronous replication acknowledges a write as soon as the leader has it and sends it to the followers afterwards. If the leader dies in between, the promoted follower never received the write, and the client was already told it succeeded.\n' +
      'That is the trade: async keeps writes fast and loses the last moments on failover; synchronous replication to at least one follower closes the gap, at the cost of waiting for it on every write.',
  },
  {
    id: 'de-replica-2',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_REPLICATION_CONSISTENCY,
    course: DE,
    question:
      'writes is the leader\'s replication log: each write has a log position (lsn) and sets an account\'s balance. A follower answers reads with the writes it has applied, up to its applied_lsn.\n' +
      'A dashboard reads account 3 from follower f2. What balance does it show?',
    tables: [
      table('writes', ['lsn', 'account_id', 'balance'], [
        [201, 3, 100],
        [202, 3, 140],
        [203, 5, 60],
        [204, 3, 90],
        [205, 5, 75],
        [206, 3, 30],
      ]),
      table('replicas', ['replica_name', 'applied_lsn'], [
        ['leader', 206],
        ['f1', 206],
        ['f2', 204],
      ]),
    ],
    answer: '90',
    tempting: [
      { answer: '30', why: '30 is the latest balance, which the leader and f1 show. f2 has applied the log only up to 204, so it has not seen write 206.' },
      { answer: '100', why: '100 is the first balance. A follower applies the log in order, so by 204 it has also applied 202 and 204.' },
    ],
    explanation:
      'f2 has applied writes 201 to 204, and the last of those for account 3 is lsn 204, balance 90. The balance has since become 30 on the leader, so the dashboard shows a stale value until f2 applies 206.\n' +
      'A follower is the leader as it was a moment ago: right, but late. How late is its replication lag.',
  },
  {
    id: 'de-replica-3',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_REPLICATION_CONSISTENCY,
    course: DE,
    question:
      'The leader replicates asynchronously and has acknowledged every write up to lsn 2040, one log position per write. It crashes, and the follower with the most of the log is promoted.\n' +
      'How many acknowledged writes are lost?',
    tables: [
      table('replicas', ['replica_name', 'applied_lsn'], [
        ['leader', 2040],
        ['f1', 2031],
        ['f2', 2036],
        ['f3', 2010],
      ]),
    ],
    answer: '4',
    unit: 'writes',
    tempting: [
      { answer: '0', why: '0 assumes an acknowledged write is on every replica. With async replication the leader acknowledges first and sends later.' },
      { answer: '30', why: '30 is how far f3 is behind. The promoted follower is f2, the one with the most of the log.' },
    ],
    explanation:
      'f2 is promoted with the log up to 2036, so writes 2037 to 2040, which clients were told had succeeded, are gone: 4 writes.\n' +
      'Promote the follower with the highest applied position to lose the least, and if no acknowledged write may be lost at all, wait for at least one follower before acknowledging.',
  },
  {
    id: 'de-replica-4',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_REPLICATION_CONSISTENCY,
    course: DE,
    question:
      'A key is stored on 5 replicas with no leader. A write succeeds once 3 replicas have it (W = 3), so after writing version 12, two replicas may still hold version 11, as now. A read asks R replicas and keeps the highest version it gets.\n' +
      'What is the smallest R for which every read returns version 12, whichever replicas it asks?',
    tables: [
      table('replicas', ['replica_name', 'version'], [
        ['r1', 12],
        ['r2', 12],
        ['r3', 12],
        ['r4', 11],
        ['r5', 11],
      ]),
    ],
    answer: '3',
    unit: 'replicas',
    tempting: [
      { answer: '2', why: 'A read of 2 can ask r4 and r5, which both hold 11. With W + R = 5 = N the two sets need not meet.' },
      { answer: '5', why: '5 works but is more than needed: any 3 replicas include at least one of the 3 that took the write.' },
    ],
    explanation:
      'Two replicas can be stale, so a read must ask one more than that: 3. In general a read set and a write set must share a replica, which holds when W + R > N: 3 + 3 > 5.\n' +
      'The quorum is a dial: W = 5, R = 1 makes reads cheap and writes stall when any replica is down; W = 3, R = 3 tolerates two replicas down for both.',
  },
  {
    id: 'de-replica-5',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_REPLICATION_CONSISTENCY,
    course: DE,
    question:
      'A user changes their email; the write commits on the leader at lsn 812. The profile page then reloads every second, always reading from follower f2.\n' +
      'At which second does the page first show the new email?',
    tables: [
      table('f2_positions', ['at_second', 'applied_lsn'], [
        [0, 790],
        [1, 801],
        [2, 809],
        [3, 815],
        [4, 822],
      ]),
    ],
    answer: '3',
    tempting: [
      { answer: '0', why: '0 assumes a committed write can be read at once everywhere. It can on the leader; f2 shows it only once it has applied lsn 812.' },
      { answer: '2', why: 'At second 2 f2 has applied up to 809, three writes short of 812.' },
    ],
    explanation:
      'The new email is visible on f2 from the first second its applied_lsn reaches 812: at second 3 it is 815. For three seconds the user sees their old email and may well save it again.\n' +
      'Read-your-writes: read a user\'s own data from the leader for a short while after they write, or have the read wait until the replica has reached the position of their last write.',
  },
  {
    id: 'de-replica-6',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_REPLICATION_CONSISTENCY,
    course: DE,
    question:
      'A payments ledger runs on a leader with 3 followers in the same region. Losing a payment the client was told had succeeded is not acceptable; a few extra milliseconds per write are fine; and payments must still be taken while a follower is being patched.\n' +
      'How should writes be replicated, and why?',
    decisions: [
      { id: 'one-sync', text: 'Wait for one follower before acknowledging, and send to the other two asynchronously', isCorrect: true },
      { id: 'all-sync', text: 'Wait for the three followers before acknowledging, so that each copy is current', isCorrect: false },
      { id: 'async-backup', text: 'Replicate asynchronously to the three, and take a backup of the leader every 5 minutes', isCorrect: false },
      { id: 'async-retry', text: 'Replicate asynchronously, and have clients send a payment again when they get no reply', isCorrect: false },
    ],
    reasons: [
      { id: 'second-copy', text: 'An acknowledged write is then on two machines, and one follower down leaves two others to wait on', isCorrect: true },
      { id: 'every-copy', text: 'A write is safe once each replica has it, since a failover can promote whichever follower it picks', isCorrect: false },
      { id: 'backup-window', text: 'A backup every 5 minutes caps the loss at 5 minutes of payments, which can be entered again later', isCorrect: false },
      { id: 'retry-covers', text: 'Clients retry what was lost, so a failover costs a short delay rather than lost payments for them', isCorrect: false },
    ],
    explanation:
      'Waiting for one follower means every acknowledged payment exists on a second machine, so a leader crash loses nothing as long as that follower is promoted, and the wait is one round trip in the region. With three followers, one being patched still leaves another to wait for.\n' +
      'Waiting for all three stalls every payment when any one is down. A backup still loses up to 5 minutes, and a client that got an acknowledgement has no reason to retry.',
  },
  {
    id: 'de-replica-7',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_REPLICATION_CONSISTENCY,
    course: DE,
    question:
      'A shop\'s database has a leader and 4 read replicas that lag by up to 2 seconds. Product pages make 95% of reads. Right after checkout the customer lands on "My orders", and if the new order is missing, many order again.\n' +
      'How should reads be routed, and why?',
    decisions: [
      { id: 'split', text: 'Product pages read from replicas; "My orders" reads from the leader after a write', isCorrect: true },
      { id: 'all-leader', text: 'Reads go to the leader as well as writes, and the replicas stand by for failover', isCorrect: false },
      { id: 'all-replica', text: 'Reads go to the replicas, which the leader\'s log keeps up to date with each write', isCorrect: false },
      { id: 'one-replica', text: 'Each customer\'s reads go to one replica, picked by a hash of the customer\'s id', isCorrect: false },
    ],
    reasons: [
      { id: 'own-write', text: 'A replica can be seconds behind, which is fine for a product page but hides a customer\'s new order', isCorrect: true },
      { id: 'consistent', text: 'Replicas apply the log as it arrives, so they hold the same data as the leader once a write commits', isCorrect: false },
      { id: 'leader-safe', text: 'A read from a replica can be stale, so reads are safe when they are served by the leader itself', isCorrect: false },
      { id: 'sticky', text: 'A customer who reads from one replica each time sees each of their own writes as soon as they make it', isCorrect: false },
    ],
    explanation:
      'Most reads can be a little late: a price a second old does no harm, so product pages go to the replicas and the leader keeps its capacity for writes. A customer\'s own new order cannot be late, so for a short time after they write, their reads go to the leader (or wait until a replica has their write\'s position).\n' +
      'Sending every read to the leader wastes the replicas; one replica per customer keeps their reads in order but still behind their own writes.',
  },
  {
    id: 'de-replica-8',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_REPLICATION_CONSISTENCY,
    course: DE,
    language: CodeLanguage.SQL,
    question:
      'The leader of an asynchronously replicated database has stopped answering. Put the steps of failing over to a follower in order. Two steps do not belong.',
    correctOrder: [
      'Confirm the leader is down from more than one place, not just slow or cut off from you',
      'Fence the old leader so it can take no more writes, even if it comes back',
      'Promote the follower with the highest applied position to be the new leader',
      'Point the writers and the other followers at the new leader',
      'List the writes in the old leader\'s log past the new leader\'s position as lost, and recover them from their source',
    ],
    distractorLines: [
      'Promote whichever follower answers first, since every follower holds the same data',
      'Let the old and new leaders both take writes until the old one has caught up',
    ],
    solution: steps([
      'Confirm the leader is down from more than one place, not just slow or cut off from you',
      'Fence the old leader so it can take no more writes, even if it comes back',
      'Promote the follower with the highest applied position to be the new leader',
      'Point the writers and the other followers at the new leader',
      'List the writes in the old leader\'s log past the new leader\'s position as lost, and recover them from their source',
    ]),
    explanation:
      'A leader that is only slow, or cut off from the checker, may still be taking writes, so confirm first and fence it: two leaders taking writes at once (split brain) leave two histories that cannot both be kept. The follower with the highest position loses the fewest writes.\n' +
      'Followers do not all hold the same data: each is at its own position in the log.',
  },
  {
    id: 'de-replica-9',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_REPLICATION_CONSISTENCY,
    course: DE,
    question:
      'A key is stored on 5 replicas over two sites, and a write succeeds only when 3 replicas take it (W = 3). The link between the sites fails, and each client can reach only the replicas on its own site. During the split, a client on site A sends 4 writes and a client on site B sends 3.\n' +
      'How many of the 7 writes succeed?',
    tables: [
      table('replicas', ['replica_name', 'site'], [
        ['r1', 'A'],
        ['r2', 'A'],
        ['r3', 'A'],
        ['r4', 'B'],
        ['r5', 'B'],
      ]),
      table('clients', ['client_site', 'writes_sent'], [
        ['A', 4],
        ['B', 3],
      ]),
    ],
    answer: '4',
    unit: 'writes',
    tempting: [
      { answer: '7', why: '7 assumes each site keeps taking writes on its own replicas. Site B reaches only 2, fewer than the 3 a write needs.' },
      { answer: '0', why: '0 assumes a split stops all writes. Site A still reaches 3 replicas, a majority, so its writes succeed.' },
    ],
    explanation:
      'Site A reaches r1 to r3, enough for W = 3, so its 4 writes succeed; site B reaches 2 and its 3 writes are refused. Only one side can hold a majority, so the two sides can never accept conflicting writes.\n' +
      'This is the choice CAP describes: during a network split, the minority side gives up availability (it refuses) to keep the data consistent. A system that let both sides write would stay available and have to reconcile two versions later.',
  },
  {
    id: 'de-replica-10',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_REPLICATION_CONSISTENCY,
    course: DE,
    question:
      'An app runs in two regions, with the usernames table replicated between them, and the link between the regions sometimes fails for minutes. Usernames must be unique, sign-up is rare, and a user told their name is theirs must keep it.\n' +
      'What should a region cut off from the majority do with sign-ups, and why?',
    decisions: [
      { id: 'refuse', text: 'Refuse new sign-ups with "try again shortly" until the link is back', isCorrect: true },
      { id: 'first-wins', text: 'Accept them in both regions, and keep the earliest name of a clash later', isCorrect: false },
      { id: 'suffix', text: 'Accept them in both regions, and add a number to clashing names later', isCorrect: false },
      { id: 'local-check', text: 'Check the name against the region\'s own copy, then accept the sign-up', isCorrect: false },
    ],
    reasons: [
      { id: 'cannot-see', text: 'A cut-off region cannot see names taken on the other side, and refusing beats a broken promise', isCorrect: true },
      { id: 'clocks', text: 'Timestamps settle a clash fairly, since each region\'s clock gives each sign-up its true order', isCorrect: false },
      { id: 'rename', text: 'A short number on the end keeps names unique, and users seldom notice a name change after sign-up', isCorrect: false },
      { id: 'local-copy', text: 'The local copy holds the names taken up to the split, which is enough to check a new name against', isCorrect: false },
    ],
    explanation:
      'During a split a replica must choose: answer with what it can see (available, maybe wrong) or refuse (consistent). Uniqueness depends on names taken on the other side, which the cut-off region cannot see, so accepting risks promising one name to two people. Sign-up is rare and can wait a few minutes.\n' +
      'Keeping the earliest or adding a number both break the promise to a user who was told the name was theirs. The choice is per kind of data: a like count could keep counting on both sides and be added up later.',
  },
  {
    id: 'de-replica-11',
    type: QuestionType.SPOT_FLAW,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_REPLICATION_CONSISTENCY,
    course: DE,
    question:
      'A few customers a day are charged twice for one order.\n' +
      'Click the line that causes it.',
    lines: [
      'step 1: write the payment row for :order_id to payments on the leader',
      'step 2: wait for step 1 to commit',
      'step 3: read payments where order_id = :order_id from a read replica',
      'step 4: if step 3 finds no paid row, charge the card again',
      'step 5: mark the order as paid',
    ],
    flawLines: [3],
    note: 'The read replicas apply the leader\'s log asynchronously and lag by up to 5 seconds at busy times.',
    explanation:
      'Step 3 reads a payment that was committed on the leader a moment ago from a replica that may not have it yet, so at busy times it finds no paid row and step 4 charges the card a second time.\n' +
      'A check of your own write must read from the leader, or from a replica that has reached the write\'s position. Read replicas are for reads that can be a little late.',
  },
  {
    id: 'de-replica-12',
    type: QuestionType.SPOT_FLAW,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_REPLICATION_CONSISTENCY,
    course: DE,
    question:
      'When one follower\'s disk failed, no writes succeeded for 20 minutes, until it was replaced.\n' +
      'Click the line that causes it.',
    lines: [
      'replicas: 1 leader, 4 followers',
      'replication: synchronous to every follower',
      'write timeout: none, a write waits until it is replicated',
      'reads: leader for writers, followers for reports',
      'failover: promote the follower with the highest position',
    ],
    flawLines: [2],
    note: 'Nothing else was wrong: the leader and the other three followers were healthy.',
    explanation:
      'Synchronous to every follower means a write waits for all four, so one broken follower stops every write: the system is only as available as its least healthy replica.\n' +
      'Wait for one follower, or a majority, and replicate to the rest asynchronously: an acknowledged write is still on two machines, and one follower down does not stop the writes.',
  },
  {
    id: 'de-replica-13',
    type: QuestionType.EXPLAIN,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_REPLICATION_CONSISTENCY,
    course: DE,
    question: 'In two or three sentences: why can a read from a follower return an old value, and how do you make sure a user sees their own write?',
    keyPoints: [
      'The leader takes the writes and sends them to the followers in order through its log',
      'A follower applies the log a little later, so its values can be behind the leader\'s (replication lag)',
      'Read a user\'s own recent writes from the leader, or from a replica that has reached the write\'s log position',
      'Reads that can be a little late, such as reports and product pages, can still go to the followers',
    ],
    modelAnswer:
      'Writes go to the leader, which sends them through its log to the followers, and each follower applies that log a little behind, so a read there can miss the latest writes. ' +
      'To let users see their own writes, read their data from the leader for a short time after they write, or make the read wait until the replica has reached the position of their write, and keep the followers for reads that can lag.',
    explanation: 'A follower is right but late; the design question is which reads can afford late.',
  },
  {
    id: 'de-replica-14',
    type: QuestionType.EXPLAIN,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_REPLICATION_CONSISTENCY,
    course: DE,
    question: 'In two or three sentences: what do synchronous and asynchronous replication trade, and what must a system choose during a network split?',
    keyPoints: [
      'Synchronous waits for a follower before acknowledging: no acknowledged write is lost, but each write is slower',
      'Asynchronous acknowledges at once: fast, but followers lag and a failover can lose the last writes',
      'During a split a cut-off replica either refuses requests (consistent) or answers with what it has (available)',
      'The choice is per kind of data: uniqueness and money favour refusing, counts and catalogs favour answering',
    ],
    modelAnswer:
      'Synchronous replication waits for a follower before telling the client a write succeeded, so failover loses nothing but every write waits; asynchronous replies at once, so writes are fast but followers lag and the newest writes can be lost if the leader dies. ' +
      'When the network splits, a replica that cannot reach the others must either refuse, keeping the data consistent, or keep answering with possibly stale data, staying available, and the right choice depends on the data: a unique username or a balance should refuse, a like count can keep counting.',
    explanation: 'A quorum (W + R > N) is the same trade made with numbers: how many replicas a write and a read must reach.',
  },
];

// ════════════════════════════════════════════════════════════════════════
// Storage Engines: B-Trees, LSM Trees & Bloom Filters
// ════════════════════════════════════════════════════════════════════════

const engines: Question[] = [
  {
    id: 'de-engine-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_STORAGE_ENGINES,
    course: DE,
    question: 'An LSM tree is looking up key 42. One file\'s bloom filter answers "maybe" for 42. What does the engine now know about that file?',
    options: [
      { id: 'a', text: 'It may or may not hold 42, so it has to be read; a "no" would have let the engine skip it', isCorrect: true },
      { id: 'b', text: 'It holds 42: the filter set a bit for each key written to the file, and the bits for 42 are set', isCorrect: false },
      { id: 'c', text: 'It holds 42 unless it was deleted, and a delete would have cleared the bits that 42 had set', isCorrect: false },
      { id: 'd', text: '42 is in the file\'s key range, between its smallest and largest key, so it is likely to be there', isCorrect: false },
    ],
    explanation:
      'A bloom filter is a small set of bits per file. A "no" is certain: the key was never written to the file, so the engine skips it without a disk read. A "maybe" can be wrong, because other keys can set the same bits: a false positive, which costs one wasted read.\n' +
      'It never gives a false negative, which is what makes skipping safe. Bits are never cleared, so a delete is a new entry (a tombstone), not a change to an old file\'s filter; and min/max key ranges are a different, coarser kind of file statistic.',
  },
  {
    id: 'de-engine-2',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_STORAGE_ENGINES,
    course: DE,
    question:
      'An LSM tree holds these entries for a points table: the in-memory table and three files flushed from it, written_seq 1 being the oldest. A read checks the memtable, then the files newest first, and returns the first entry it finds for the key.\n' +
      'What does a read of user 3 return?',
    tables: [
      table('entries', ['source', 'written_seq', 'user_id', 'points'], [
        ['file1', 1, 1, 10],
        ['file1', 1, 3, 40],
        ['file2', 2, 3, 55],
        ['file2', 2, 7, 12],
        ['file3', 3, 1, 18],
        ['memtable', 4, 7, 20],
      ]),
    ],
    answer: '55',
    unit: 'points',
    tempting: [
      { answer: '40', why: '40 is user 3\'s first entry, in the oldest file. An update in an LSM tree is a newer entry, and the newest one wins.' },
      { answer: '95', why: '95 adds user 3\'s two entries. Each entry is the whole value at that time, not a change to add.' },
    ],
    explanation:
      'The memtable and file3 have nothing for user 3; file2 has 55, so the read stops there. file1\'s 40 is an older version, still on disk until compaction drops it.\n' +
      'An LSM tree never changes a file once written: an update or a delete is a newer entry, and a read takes the newest one it finds.',
  },
  {
    id: 'de-engine-3',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_STORAGE_ENGINES,
    course: DE,
    question:
      'A sign-up form checks whether the username "kestrel" is free. It is in none of the table\'s 8 files. The engine asks each file\'s bloom filter first and reads only the files whose filter says maybe.\n' +
      'How many files does the lookup read?',
    tables: [
      table('filters', ['file_name', 'filter_says'], [
        ['f1', 'no'],
        ['f2', 'maybe'],
        ['f3', 'no'],
        ['f4', 'no'],
        ['f5', 'maybe'],
        ['f6', 'no'],
        ['f7', 'maybe'],
        ['f8', 'no'],
      ]),
    ],
    answer: '3',
    unit: 'files',
    tempting: [
      { answer: '0', why: '0 assumes a filter is right about an absent key. A "maybe" can be a false positive, and the engine has to read the file to find out.' },
      { answer: '8', why: '8 is every file, the read without filters. The five that say no are skipped.' },
    ],
    explanation:
      'The five "no" files are skipped for certain; the three "maybe" files are read, and all three turn out not to hold "kestrel": three false positives.\n' +
      'Lookups of keys that do not exist are where bloom filters matter most: without them, a miss has to read every file.',
  },
  {
    id: 'de-engine-4',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_STORAGE_ENGINES,
    course: DE,
    question:
      'Compaction merges these three files, the oldest of the table, into one: it keeps the newest entry for each key and drops a key whose newest entry is a tombstone (a delete, shown as a NULL value).\n' +
      'How many entries does the new file hold?',
    tables: [
      table('entries', ['file_name', 'written_seq', 'item_key', 'item_value'], [
        ['f1', 1, 'a', 1],
        ['f1', 1, 'b', 2],
        ['f1', 1, 'c', 3],
        ['f1', 1, 'd', 4],
        ['f2', 2, 'a', 5],
        ['f2', 2, 'c', null],
        ['f2', 2, 'e', 6],
        ['f3', 3, 'b', 7],
        ['f3', 3, 'd', null],
        ['f3', 3, 'f', 8],
      ]),
    ],
    answer: '4',
    unit: 'entries',
    tempting: [
      { answer: '6', why: '6 is the number of distinct keys. c and d end in a tombstone, and since these are the oldest files, no older copy is left for the tombstone to hide.' },
      { answer: '8', why: '8 drops the two tombstones but keeps every value. Compaction also drops the older versions of a and b.' },
    ],
    explanation:
      'The newest entries are a = 5, b = 7, c deleted, d deleted, e = 6 and f = 8, so the new file holds a, b, e and f: 4 entries in place of 10.\n' +
      'Compaction is where an LSM tree gets its space back and its reads get cheaper: fewer files, one entry per key. A tombstone can only be dropped when no older file outside the merge could still hold the key.',
  },
  {
    id: 'de-engine-5',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_STORAGE_ENGINES,
    course: DE,
    question:
      'A B-tree index holds keys in pages: each leaf page holds 100 keys, and each page above holds pointers to 100 pages below it, up to a single root page.\n' +
      'How many pages does a lookup of one key read, from the root down to its leaf?',
    tables: [
      table('index_stats', ['keys_in_index', 'keys_per_leaf_page', 'pointers_per_inner_page'], [
        [1000000, 100, 100],
      ]),
    ],
    answer: '3',
    unit: 'pages',
    tempting: [
      { answer: '20', why: '20 is a binary search over a million keys, one comparison at a time. Each page read narrows the search 100 ways, not 2.' },
      { answer: '10000', why: '10,000 is the number of leaf pages. A lookup reads one page at each level, not every leaf.' },
    ],
    explanation:
      'A million keys fill 10,000 leaf pages; 100 inner pages point to those; one root points to the 100. A lookup reads the root, one inner page and one leaf: 3 pages, and the top levels are usually in memory.\n' +
      'That short, fixed path is why B-trees give steady reads and range scans. The price is on writes: changing a key rewrites its page in place, a random write.',
  },
  {
    id: 'de-engine-6',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_STORAGE_ENGINES,
    course: DE,
    question:
      'A store for sensor readings takes 200,000 new readings a second, and a reading is never changed once written. Almost all reads ask for one sensor\'s readings from the last hour.\n' +
      'Which storage engine fits, and why?',
    decisions: [
      { id: 'lsm', text: 'An LSM tree, which writes sorted files in batches and merges them later', isCorrect: true },
      { id: 'btree', text: 'A B-tree, which keeps the keys in sorted pages that are updated in place', isCorrect: false },
      { id: 'btree-ram', text: 'A B-tree on a machine with more memory, so that its pages are cached', isCorrect: false },
      { id: 'heap', text: 'An unsorted heap file, with the readings appended in the order they came', isCorrect: false },
    ],
    reasons: [
      { id: 'sequential', text: 'Writes turn into memory inserts and sequential flushes, and recent readings sit in the newest files', isCorrect: true },
      { id: 'one-file', text: 'An LSM read checks a single file, so it is faster than walking a B-tree\'s path of three or four pages', isCorrect: false },
      { id: 'cache', text: 'With enough memory each page is cached, and a cached B-tree page takes writes as fast as anything can', isCorrect: false },
      { id: 'append', text: 'Appending in arrival order is the fastest possible write, and the sensor\'s rows are easy to find after', isCorrect: false },
    ],
    explanation:
      'An LSM tree takes each write into memory and later writes whole sorted files in one sequential pass, so a heavy, steady write rate costs little. Its reads can need several files, but reads of recent data hit the memtable and the newest files first.\n' +
      'A B-tree rewrites a page per insert, random writes that fall behind at this rate once the index outgrows memory. An unsorted heap appends fast but has to scan to find one sensor\'s rows.',
  },
  {
    id: 'de-engine-7',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_STORAGE_ENGINES,
    course: DE,
    question:
      'In an LSM table, 80% of lookups are for keys that do not exist (checking that an id is free). Each such lookup still reads about 3 files, because the bloom filters are small, at 2 bits per key. The disks are already busy with compaction, and there is spare memory.\n' +
      'What should you change, and why?',
    decisions: [
      { id: 'bigger-filter', text: 'Give the bloom filters more bits per key, 10 in place of 2', isCorrect: true },
      { id: 'compact', text: 'Compact more often, so each lookup has fewer files to check', isCorrect: false },
      { id: 'no-filter', text: 'Turn the bloom filters off, so that they stop using memory', isCorrect: false },
      { id: 'cache-hits', text: 'Cache the values of the keys that were found most recently', isCorrect: false },
    ],
    reasons: [
      { id: 'fewer-false', text: 'More bits per key make false "maybe"s rarer, and each is a wasted read for a missing key', isCorrect: true },
      { id: 'fewer-files', text: 'Fewer, larger files make each filter more accurate, which cuts the false "maybe"s for free', isCorrect: false },
      { id: 'useless', text: 'Most of the lookups are misses, which a filter does not help with, so its memory goes to waste', isCorrect: false },
      { id: 'hot-keys', text: 'Most lookups repeat a few recent keys, so a cache answers them without touching a disk', isCorrect: false },
    ],
    explanation:
      'A bloom filter\'s false-positive rate falls as it gets more bits per key: about 1% at 10 bits, against roughly 40% at 2. For a key that exists nowhere, every "maybe" is a disk read for nothing, so the spare memory buys back most of those reads.\n' +
      'More compaction would cut the files, but the disks are already busy with it. Misses are where filters help most, and a cache of found keys does nothing for keys that are not there.',
  },
  {
    id: 'de-engine-8',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_STORAGE_ENGINES,
    course: DE,
    language: CodeLanguage.SQL,
    question: 'Put the steps of an LSM tree taking a write, until it is merged into older data, in order. Two steps do not belong.',
    correctOrder: [
      'Append the write to the write-ahead log on disk, so a crash cannot lose it',
      'Insert the key and value into the sorted in-memory table',
      'When the in-memory table is full, write it out in key order as a new file',
      'Build the new file\'s bloom filter and key index from the keys it holds',
      'Later, compaction merges the file with older ones, keeping the newest entry per key',
    ],
    distractorLines: [
      'Find the page on disk that holds the key and overwrite the old value in place',
      'Remove the key\'s older entries from the older files as soon as the new one is written',
    ],
    solution: steps([
      'Append the write to the write-ahead log on disk, so a crash cannot lose it',
      'Insert the key and value into the sorted in-memory table',
      'When the in-memory table is full, write it out in key order as a new file',
      'Build the new file\'s bloom filter and key index from the keys it holds',
      'Later, compaction merges the file with older ones, keeping the newest entry per key',
    ]),
    explanation:
      'The log makes the write durable with one sequential append, the memtable keeps keys sorted in memory, and a flush writes a whole sorted, immutable file at once; its filter and index are built as it is written. Old versions stay in old files until compaction.\n' +
      'Overwriting a page in place is what a B-tree does, and an LSM tree never edits a file it has written.',
  },
  {
    id: 'de-engine-9',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_STORAGE_ENGINES,
    course: DE,
    question:
      'A table is stored in 8 files, f8 the newest. Query A looks up key k42: it asks the bloom filters, reads the "maybe" files newest first, and stops at the first file that holds k42. Query B counts every key in the table.\n' +
      'How many file reads do the two queries make in total?',
    tables: [
      table('files', ['file_name', 'filter_says_k42', 'holds_k42'], [
        ['f8', 'no', 'no'],
        ['f7', 'no', 'no'],
        ['f6', 'maybe', 'yes'],
        ['f5', 'no', 'no'],
        ['f4', 'no', 'no'],
        ['f3', 'maybe', 'no'],
        ['f2', 'no', 'no'],
        ['f1', 'maybe', 'yes'],
      ]),
    ],
    answer: '9',
    unit: 'reads',
    tempting: [
      { answer: '11', why: '11 has query A read all three "maybe" files. It reads newest first and stops at f6, the newest file that holds k42.' },
      { answer: '4', why: '4 lets query B use the filters too. A filter answers "is this key here?"; a count of every key has to read every file.' },
    ],
    explanation:
      'Query A skips f8 and f7, reads f6, finds k42 and stops: 1 read, and f1\'s copy is an older version it never needs. Query B reads all 8 files, since a scan wants every key and a filter can only rule out one key at a time: 9 reads in all.\n' +
      'Bloom filters speed up point lookups, and misses most of all; scans gain nothing from them.',
  },
  {
    id: 'de-engine-10',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_STORAGE_ENGINES,
    course: DE,
    question:
      'A privacy request means deleting 40% of the rows of a busy LSM table by Friday. The disk is 85% full, reads must stay fast throughout, and the table cannot be taken offline.\n' +
      'How should you delete them, and why?',
    decisions: [
      { id: 'batches', text: 'Delete in batches by key range, compacting each range before the next', isCorrect: true },
      { id: 'all-at-once', text: 'Delete the rows in one statement and let compaction catch up later', isCorrect: false },
      { id: 'copy', text: 'Copy the 60% that stays into a new table, then switch over and drop the old', isCorrect: false },
      { id: 'flag', text: 'Update the rows to set a deleted flag, and filter on the flag in reads', isCorrect: false },
    ],
    reasons: [
      { id: 'tombstones', text: 'A delete adds a tombstone, and space comes back as compaction rewrites the files that hold the keys', isCorrect: true },
      { id: 'frees', text: 'A delete frees the deleted rows\' space at once, so a single large delete is the quickest way through', isCorrect: false },
      { id: 'room', text: 'A fresh copy is written once and compacts nothing, so it needs no more disk than the table has now', isCorrect: false },
      { id: 'cheap', text: 'An update rewrites each row in its place, so the table stays the same size and the reads stay fast', isCorrect: false },
    ],
    explanation:
      'In an LSM tree a delete is a new entry: a sudden 40% of tombstones makes the table bigger and every read step over them, until compaction rewrites the files that hold those keys, and compaction itself needs free space for the files it writes. Batches by key range, each compacted before the next, keep both the extra entries and the extra space small.\n' +
      'A copy needs room for 60% of the table on a disk that is 85% full, and a flag is just an update: another entry per row, with the data still there.',
  },
  {
    id: 'de-engine-11',
    type: QuestionType.SPOT_FLAW,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_STORAGE_ENGINES,
    course: DE,
    question:
      'Lookups on a key-value table get a little slower every day, and its disk use keeps growing, though the number of live keys has been flat for months.\n' +
      'Click the line that causes it.',
    lines: [
      'engine: lsm',
      'memtable: flush to a new file at 64 MB',
      'bloom filter: 10 bits per key',
      'compaction: off, run by hand at month end',
      'workload: 5,000 updates a second to existing keys',
    ],
    flawLines: [4],
    note: 'The month-end compaction was skipped for the last three months.',
    explanation:
      'Every update is a new entry, and every flush adds a file. With compaction off, the old versions pile up on disk and a lookup has more files to check each day: the live data is flat, but the entries are not.\n' +
      'Compaction is part of running an LSM tree, not a cleanup to do by hand: it keeps the file count and the old versions bounded, at the cost of rewriting data in the background.',
  },
  {
    id: 'de-engine-12',
    type: QuestionType.SPOT_FLAW,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_STORAGE_ENGINES,
    course: DE,
    question:
      'The insert rate of an events table falls steadily as the table grows past the size of memory, and the disk shows a stream of small random writes.\n' +
      'Click the line that causes it.',
    lines: [
      'table: events',
      'engine: b-tree, primary key index',
      'primary key: event_uuid, a random 128-bit id',
      'inserts: 30,000 a second, never updated',
      'reads: events by time range for a dashboard',
    ],
    flawLines: [3],
    note: 'The engine cannot be changed this quarter; the table\'s columns can.',
    explanation:
      'A random key sends each insert to a random leaf page of the B-tree. Once the index is bigger than memory, most of those pages are not cached, so each insert reads a page and writes it back: random I/O that grows with the table.\n' +
      'With the engine fixed, key the table on something that grows, such as (event_time, event_uuid): inserts then land on the newest leaf pages, which stay in memory, and the dashboard\'s time-range reads become one range scan.',
  },
  {
    id: 'de-engine-13',
    type: QuestionType.EXPLAIN,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_STORAGE_ENGINES,
    course: DE,
    question: 'In two or three sentences: why are writes cheap in an LSM tree, and what does it pay for that on reads?',
    keyPoints: [
      'A write is a log append plus an insert into a sorted in-memory table, which is flushed as a whole sorted file',
      'Files are never edited: an update or delete is a newer entry, so there are no random writes',
      'A read may have to check the memtable and several files, newest first',
      'Bloom filters and compaction keep that read cost down',
    ],
    modelAnswer:
      'An LSM tree appends each write to a log and puts it in a sorted table in memory, then writes that table out as one sorted file, so writes are sequential and no file is ever changed in place. ' +
      'The cost is on reads: a key\'s newest entry could be in memory or in any of several files, so a read checks them newest first, which bloom filters (to skip files) and compaction (to keep files few) make affordable.',
    explanation: 'A B-tree makes the opposite trade: one short path of pages per read, and a random page write per change.',
  },
  {
    id: 'de-engine-14',
    type: QuestionType.EXPLAIN,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_STORAGE_ENGINES,
    course: DE,
    question: 'In two or three sentences: what does compaction do in an LSM tree, what does it cost, and what can a bloom filter tell a read?',
    keyPoints: [
      'Compaction merges files, keeping the newest entry per key and dropping old versions and tombstones',
      'That makes reads touch fewer files and gives back disk space',
      'It rewrites the same data again and again (write amplification), using disk and CPU in the background',
      'A bloom filter says a key is definitely not in a file, or maybe in it; a "maybe" can be wrong, a "no" cannot',
    ],
    modelAnswer:
      'Compaction merges an LSM tree\'s files into fewer, keeping only the newest entry of each key and dropping deleted keys, so reads check fewer files and disk space comes back, but it rewrites the same data many times, costing background I/O. ' +
      'A bloom filter per file lets a lookup skip any file whose filter says the key is definitely not there; a "maybe" can be a false positive, so the file is read, and more bits per key make those rarer.',
    explanation: 'Compaction trades write work for read speed and space; the bloom filter trades a little memory for skipped reads.',
  },
];

export const dataEngineeringDistributedQuestions: Question[] = [...skew, ...replication, ...engines];
