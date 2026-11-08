import { CodeLanguage, Course, Difficulty, Question, QuestionType, SqlTable, Topic } from '../types';

/**
 * Data Engineering, section "Streaming": the fifth section of the course
 * rewrite (decisions and designs). Four topics, each taught by a lesson
 * (src/data/lessons/dataEngineeringLessons.ts) and then practised with cards
 * that make the learner produce the answer:
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
 *     dataEngineeringStreamingChecks.ts holds the check,
 *     scripts/check-outcomes.js runs it (part of npm test);
 *   - tool-agnostic: tables, SQL and a few lines of pseudo-config are the
 *     notation, never one vendor's API. "Partition", "offset" and "consumer
 *     group" are the general terms of a partitioned log (Kafka, Kinesis,
 *     Pulsar, Event Hubs all have them under some name).
 *
 * It replaces the old MCQ-only Streaming section (de-stream-, de-time-,
 * de-window-, de-kafka-, de-guar-, de-ssql-) and the Batch vs Streaming topic
 * of Foundations (de-batch-); those ids are not reused.
 */

const DE = Course.DATA_ENGINEERING;

const table = (name: string, columns: string[], rows: (string | number | null)[][]): SqlTable => ({ name, columns, rows });

/** Prose lines for a Parsons card: its solution is the lines in order. */
const steps = (lines: string[]) => lines.join('\n');

// ════════════════════════════════════════════════════════════════════════
// Logs, Topics, Partitions & Offsets
// ════════════════════════════════════════════════════════════════════════

const logs: Question[] = [
  {
    id: 'de-log-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_STREAM_LOGS,
    course: DE,
    question: 'The consumer group "billing" has committed offset 42 on partition 3 of the orders topic. What does that record?',
    options: [
      { id: 'a', text: 'Where billing resumes reading partition 3 after a restart; the messages before 42 are done', isCorrect: true },
      { id: 'b', text: 'How many orders billing has read so far, summed over the partitions of the orders topic', isCorrect: false },
      { id: 'c', text: 'That messages 0 to 41 of partition 3 are removed from the log, since billing has read them', isCorrect: false },
      { id: 'd', text: 'That billing has read the 42nd order sent to the topic, in the order producers wrote them', isCorrect: false },
    ],
    explanation:
      'An offset is a message\'s position in one partition, and a group\'s committed offset is where that group carries on reading that partition: the messages before it are done.\n' +
      'Each partition has its own offsets, so 42 on partition 3 says nothing about the other partitions or about time order across them. Reading removes nothing: messages stay until the topic\'s retention expires them, and other groups keep offsets of their own.',
  },
  {
    id: 'de-log-2',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_STREAM_LOGS,
    course: DE,
    question:
      'A producer sends these events to a topic with 3 partitions, keyed by customer_id. The partition of a message is customer_id % 3.\n' +
      'How many of the events land in partition 1?',
    tables: [
      table('events', ['seq', 'customer_id', 'action'], [
        [1, 4, 'cart'],
        [2, 7, 'cart'],
        [3, 9, 'order'],
        [4, 4, 'order'],
        [5, 12, 'cart'],
        [6, 10, 'order'],
        [7, 7, 'order'],
        [8, 5, 'cart'],
      ]),
    ],
    answer: '5',
    unit: 'events',
    tempting: [
      { answer: '3', why: '3 is the number of customers in partition 1 (4, 7 and 10), or an even split of 8 events. Every event of a customer goes to that customer\'s partition, so 4 and 7 bring two each.' },
      { answer: '2', why: '2 is partition 0 (customers 9 and 12). 4 % 3, 7 % 3 and 10 % 3 are all 1.' },
    ],
    explanation:
      'Customers 4, 7 and 10 map to partition 1, and their events are seqs 1, 2, 4, 6 and 7: five events.\n' +
      'A key decides the partition, so all of one customer\'s events sit together in order, and a busy key makes its partition busy.',
  },
  {
    id: 'de-log-3',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_STREAM_LOGS,
    course: DE,
    question:
      'end_offset is the offset the next message written to a partition will get; committed_offset is where the group "billing" carries on reading it.\n' +
      'How far behind the end of the topic is billing in total, in messages?',
    tables: [
      table('partitions', ['partition_id', 'end_offset', 'committed_offset'], [
        [0, 1200, 1200],
        [1, 980, 940],
        [2, 1500, 1320],
      ]),
    ],
    answer: '220',
    unit: 'messages',
    tempting: [
      { answer: '180', why: '180 is partition 2 alone. Lag is per partition, and the group\'s lag is the sum: 0 + 40 + 180.' },
      { answer: '3460', why: '3460 is the sum of the committed offsets, the messages billing has already done.' },
    ],
    explanation:
      'Lag is end_offset - committed_offset for each partition: 0, 40 and 180, so 220 messages are waiting.\n' +
      'Watch lag per partition as well as the total: one partition far behind while the others are at zero points at a hot key or a stuck consumer.',
  },
  {
    id: 'de-log-4',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_STREAM_LOGS,
    course: DE,
    question:
      'The payments topic has 6 partitions. The fraud group\'s lag keeps growing, so the team scales it from 4 instances to 8. Each partition is read by one instance of the group.\n' +
      'How many of the 8 instances are given no partition to read?',
    tables: [
      table('payments_partitions', ['partition_id', 'messages_per_second'], [
        [0, 300],
        [1, 310],
        [2, 290],
        [3, 305],
        [4, 295],
        [5, 300],
      ]),
    ],
    answer: '2',
    unit: 'instances',
    tempting: [
      { answer: '0', why: '0 assumes the 6 partitions are shared out as 6/8 of a partition each. A partition goes to one instance of the group, so 6 partitions keep at most 6 instances busy.' },
      { answer: '4', why: '4 is the number of instances added. The 4 old ones and 2 of the new ones get a partition each; 2 are left over.' },
    ],
    explanation:
      'Within one consumer group each partition is read by one instance, so the group can use at most as many instances as there are partitions: 6 get one partition each and 2 sit idle.\n' +
      'To read faster with more instances, the topic needs more partitions, which is why the partition count is chosen with the peak reading parallelism in mind.',
  },
  {
    id: 'de-log-5',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_STREAM_LOGS,
    course: DE,
    question:
      'The orders topic has 12 partitions. The shipping service runs 6 instances that must split the orders between them, and a new analytics job must also see every order.\n' +
      'How should their consumer groups be set up, and why?',
    decisions: [
      { id: 'two-groups', text: 'The 6 shipping instances share one group; analytics reads in a group of its own', isCorrect: true },
      { id: 'one-group', text: 'Put the 7 consumers in one group, so the orders are spread across the seven', isCorrect: false },
      { id: 'group-each', text: 'Each shipping instance gets a group of its own, so none of them misses an order', isCorrect: false },
      { id: 'join-spare', text: 'Analytics joins the shipping group and reads the partitions the others leave', isCorrect: false },
    ],
    reasons: [
      { id: 'split-and-copy', text: 'In a group each partition goes to one member, and each group keeps its own offsets over the whole topic', isCorrect: true },
      { id: 'group-copies', text: 'A group hands each message to each of its members, so splitting the work takes one group per instance', isCorrect: false },
      { id: 'shared-offsets', text: 'The groups on a topic share one set of offsets, so a second group would skip orders the first already read', isCorrect: false },
      { id: 'by-load', text: 'Partitions go to whichever member is least busy, so an extra member picks up the partitions that lag', isCorrect: false },
    ],
    explanation:
      'A consumer group splits a topic: each partition is read by one member, so the 6 shipping instances share the 12 partitions. A second group gets the whole topic again, with offsets of its own, so analytics sees every order without taking any from shipping.\n' +
      'In one group, analytics would take some partitions and shipping would never see those orders; a group per shipping instance would ship every order 6 times.',
  },
  {
    id: 'de-log-6',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_STREAM_LOGS,
    course: DE,
    question:
      'Deposits and withdrawals must be applied to balances in the order they happened on each account. The volume needs 12 partitions.\n' +
      'What should the producer use as the message key, and why?',
    decisions: [
      { id: 'account', text: 'account_id, so that every event of an account goes to one partition', isCorrect: true },
      { id: 'event', text: 'event_id, so that the events are spread evenly over the partitions', isCorrect: false },
      { id: 'no-key', text: 'Leave the key empty, so the producer deals the events out to partitions in turn', isCorrect: false },
      { id: 'timestamp', text: 'The event\'s timestamp, so that each partition is kept in time order', isCorrect: false },
    ],
    reasons: [
      { id: 'order-per-partition', text: 'Order holds only within a partition, and the same key is always sent to the same partition', isCorrect: true },
      { id: 'broker-sorts', text: 'The broker keeps a topic sorted by timestamp, so whatever the key, events stay in the order they happened', isCorrect: false },
      { id: 'even-short', text: 'An even spread keeps each partition short, so events are read soon after they are sent, in order', isCorrect: false },
      { id: 'consumer-sorts', text: 'Consumers sort what they read by key, so the key just decides how the load falls on the brokers', isCorrect: false },
    ],
    explanation:
      'A log keeps order inside each partition, not across them. Keying by account_id sends all of an account\'s events to one partition, where one consumer reads them in the order they were written.\n' +
      'An event id, no key or a timestamp spreads one account over many partitions, read by different consumers at different speeds, so a withdrawal can be applied before the deposit before it.',
  },
  {
    id: 'de-log-7',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_STREAM_LOGS,
    course: DE,
    language: CodeLanguage.SQL,
    question:
      'A bug in the totals consumer wrote wrong totals from 08:00 until now. The topic keeps 7 days of messages, and the sink is written by key.\n' +
      'Put the steps of reprocessing in order. Two steps do not belong.',
    correctOrder: [
      'Fix the consumer and test it on a copy of a few hours of the topic',
      'Stop every instance of the group, so none commits offsets during the reset',
      'Reset the group\'s offsets on every partition to the first message after 08:00',
      'Start the fixed consumers, which replace the wrong totals key by key',
      'Watch the lag fall to zero, then compare the totals since 08:00 with a recount',
    ],
    distractorLines: [
      'Ask the producers to send every message since 08:00 to the topic again',
      'Delete the topic and create it again, so the consumers start from the beginning',
    ],
    solution: steps([
      'Fix the consumer and test it on a copy of a few hours of the topic',
      'Stop every instance of the group, so none commits offsets during the reset',
      'Reset the group\'s offsets on every partition to the first message after 08:00',
      'Start the fixed consumers, which replace the wrong totals key by key',
      'Watch the lag fall to zero, then compare the totals since 08:00 with a recount',
    ]),
    explanation:
      'The log still holds every message since 08:00, so reprocessing is moving the group\'s offsets back and reading again. The group is stopped first so a running instance does not commit over the reset, and writing by key lets the replayed results replace the wrong ones.\n' +
      'The producers need not send anything again, and deleting the topic throws away the very messages the replay needs.',
  },
  {
    id: 'de-log-8',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_STREAM_LOGS,
    course: DE,
    question:
      'The account_events topic is keyed by account_id, and a message\'s partition is account_id % (number of partitions). It grows from 3 partitions to 4, and the producers pick up the new count at once.\n' +
      'How many of these accounts have their new events written to a different partition from their old ones?',
    tables: [
      table('accounts', ['account_id'], [
        [3],
        [4],
        [8],
        [12],
        [13],
        [17],
      ]),
    ],
    answer: '4',
    unit: 'accounts',
    tempting: [
      { answer: '0', why: '0 assumes existing keys keep their partition. The partition is computed from the count each time, so a new count moves most keys.' },
      { answer: '6', why: '6 would mean every key moves. 12 % 3 and 12 % 4 are both 0, and 13 % 3 and 13 % 4 are both 1, so those two stay.' },
    ],
    explanation:
      'Before: 3 % 3 = 0, 4 % 3 = 1, 8 % 3 = 2, 12 % 3 = 0, 13 % 3 = 1, 17 % 3 = 2. After: 3, 0, 0, 0, 1, 1. Accounts 3, 4, 8 and 17 move.\n' +
      'For a while a moved account has old events in one partition and new ones in another, read by different consumers, so its order is no longer guaranteed. Choose the partition count up front, or drain the old partitions before the new events are read.',
  },
  {
    id: 'de-log-9',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_STREAM_LOGS,
    course: DE,
    question:
      'Finance reads the revenue report at 09:00 each morning. Refunds keep arriving for up to 3 days after a sale. A manager asks for the report to be "real-time", and the nightly batch that builds it takes 20 minutes.\n' +
      'What should you build, and why?',
    decisions: [
      { id: 'batch', text: 'Keep a scheduled batch: nightly, or hourly if fresher data is needed', isCorrect: true },
      { id: 'stream', text: 'A streaming job that updates the report as each sale and refund arrives', isCorrect: false },
      { id: 'micro', text: 'The same batch every 5 minutes all day, which makes the report a stream', isCorrect: false },
      { id: 'half', text: 'Stream the sales, and leave the refunds to the nightly batch as now', isCorrect: false },
    ],
    reasons: [
      { id: 'no-one-acts', text: 'The report is acted on once a day, so an always-on job and its state add cost and give nothing back', isCorrect: true },
      { id: 'more-accurate', text: 'A streaming job is more accurate than a batch, because it applies each refund the moment that it is made', isCorrect: false },
      { id: 'corrections', text: 'A batch works on a fixed snapshot, so refunds that come in over 3 days need a stream to be applied', isCorrect: false },
      { id: 'interval', text: 'A run each 5 minutes is streaming in practice, so it gives real-time numbers at the price of a batch', isCorrect: false },
    ],
    explanation:
      'Stream when someone or something acts on the result within seconds or minutes: blocking a fraudulent payment, a live stock count. A report read once a morning gains nothing from it, and a streaming job runs all day, keeps state and needs its own handling of late data.\n' +
      'Batches take late refunds by recomputing recent days. A batch every 5 minutes is still a batch, bounded chunks on a schedule, which is a fine choice when fresher data is needed.',
  },
  {
    id: 'de-log-10',
    type: QuestionType.SPOT_FLAW,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_STREAM_LOGS,
    course: DE,
    question:
      'Some balances briefly go negative: a withdrawal is applied before the deposit made a second earlier on the same account.\n' +
      'Click the line that causes it.',
    lines: [
      'topic: account_events',
      'partitions: 12',
      'producer.key: event_id',
      'producer.acks: all',
      'retention: 7 days',
      'consumer.group: balances',
      'consumer.instances: 6',
    ],
    flawLines: [3],
    note: 'Each instance applies the events of its partitions in offset order. An account\'s deposits and withdrawals are often seconds apart.',
    explanation:
      'Keying by event_id spreads one account\'s events over all 12 partitions. Different instances read those partitions at different speeds, so a withdrawal in one partition can be applied before the deposit sitting in another.\n' +
      'Key by account_id: every event of an account then goes to one partition and is applied in the order it was written.',
  },
  {
    id: 'de-log-11',
    type: QuestionType.SPOT_FLAW,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_STREAM_LOGS,
    course: DE,
    question:
      'Lag stays near zero on 23 partitions and grows all day on one. Adding instances did not help.\n' +
      'Click the line that causes it.',
    lines: [
      'topic: page_views',
      'partitions: 24',
      'producer.key: country',
      'retention: 3 days',
      'consumer.group: sessionizer',
      'consumer.instances: 24',
    ],
    flawLines: [3],
    note: 'About 70% of page views come from one country. The sessionizer groups each user\'s views into visits.',
    explanation:
      'Every view from the big country has the same key, so 70% of the traffic goes to one partition, and one partition is read by one instance however many the group has.\n' +
      'Key by what the consumer needs together, user_id: there are millions of users, so the load spreads, and each user\'s views still arrive in order on one partition.',
  },
  {
    id: 'de-log-12',
    type: QuestionType.EXPLAIN,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_STREAM_LOGS,
    course: DE,
    question: 'In two or three sentences: what is an offset, and how can several jobs read the same topic and one of them replay last week?',
    keyPoints: [
      'An offset is a message\'s position in one partition of the log',
      'Each consumer group commits its own offsets, so each group reads the whole topic at its own pace',
      'Reading removes nothing: messages stay until the retention period expires them',
      'Replaying is resetting a group\'s offsets to an earlier position, within retention',
    ],
    modelAnswer:
      'An offset is the position of a message in its partition, and each consumer group commits the offset it has reached on each partition. ' +
      'Because reading does not remove messages and every group keeps its own offsets, any number of jobs can read the same topic, and one can go back by resetting its offsets as long as retention still holds the messages.',
    explanation: 'A log is a file that is only appended to and read by position; that is what makes replay and many readers cheap.',
  },
  {
    id: 'de-log-13',
    type: QuestionType.EXPLAIN,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_STREAM_LOGS,
    course: DE,
    question: 'In two or three sentences: how do you decide between a streaming job and a scheduled batch for a new pipeline?',
    keyPoints: [
      'Ask how soon someone or something acts on the result, not how fresh the data could be',
      'Stream when the action happens within seconds or minutes, such as blocking a payment',
      'Otherwise a batch, even every few minutes, is simpler: it starts, finishes and recomputes late data',
      'A streaming job runs all the time and keeps state, so it costs more to run and to operate',
    ],
    modelAnswer:
      'The deciding question is how soon the result is acted on: if a payment must be blocked within seconds, the pipeline has to stream. ' +
      'If the result is read hourly or daily, a scheduled batch, even a frequent micro-batch, is cheaper and easier, since it runs to completion and handles late data by recomputing, while a stream runs nonstop with state to manage.',
    explanation: 'Micro-batch is still batch: bounded chunks on a schedule. The line is whether each event is handled as it arrives.',
  },
];

// ════════════════════════════════════════════════════════════════════════
// Event Time, Windows & Watermarks
// ════════════════════════════════════════════════════════════════════════

const windows: Question[] = [
  {
    id: 'de-wmark-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_EVENT_TIME_WINDOWS,
    course: DE,
    question:
      'A step counter records 2,000 steps at 08:00 while the phone is offline, and uploads them at 12:00. A chart shows steps per hour. Which hour should hold the 2,000 steps?',
    options: [
      { id: 'a', text: '12:00: that is their event time, the moment the pipeline first saw them as an event', isCorrect: false },
      { id: 'b', text: '12:00: an hour that has already been shown on the chart should not change afterwards', isCorrect: false },
      { id: 'c', text: '08:00: their event time, when the steps were taken; 12:00 is only when they arrived', isCorrect: true },
      { id: 'd', text: 'Either hour: both are event times, and the chart may group by whichever is to hand', isCorrect: false },
    ],
    explanation:
      'Event time is when the thing happened, stamped where it happened; processing (arrival) time is when the pipeline saw it. A chart of activity is about when people walked, so it groups by event time and puts the steps at 08:00.\n' +
      'Grouping by arrival puts four hours of walking into noon. A shown hour can change when late data arrives; deciding how long to wait for that is what watermarks are for.',
  },
  {
    id: 'de-wmark-2',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_EVENT_TIME_WINDOWS,
    course: DE,
    question:
      'A job counts events in 5-minute tumbling windows by event time: [10:00, 10:05), [10:05, 10:10), [10:10, 10:15) and so on. A window includes its start and excludes its end.\n' +
      'What does it count for the window [10:05, 10:10)?',
    tables: [
      table('events', ['event_id', 'event_time'], [
        ['e1', '10:01'],
        ['e2', '10:04'],
        ['e3', '10:05'],
        ['e4', '10:07'],
        ['e5', '10:10'],
        ['e6', '10:12'],
      ]),
    ],
    answer: '2',
    unit: 'events',
    tempting: [
      { answer: '3', why: '3 counts e5 at 10:10, which is the end of the window and so the start of the next one.' },
      { answer: '1', why: '1 leaves out e3 at 10:05. A window includes its start, so 10:05 is in [10:05, 10:10).' },
    ],
    explanation:
      'e3 (10:05) and e4 (10:07) fall in [10:05, 10:10). Tumbling windows tile time with no gaps and no overlaps, so each event is in exactly one window: e5 belongs to [10:10, 10:15).',
  },
  {
    id: 'de-wmark-3',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_EVENT_TIME_WINDOWS,
    course: DE,
    question:
      'event_time is when each event happened on the device; arrival_time is when the pipeline received it. A chart counts events per hour by event time.\n' +
      'What does it show for the 09:00 hour?',
    tables: [
      table('events', ['event_id', 'event_time', 'arrival_time'], [
        [1, '08:50', '08:51'],
        [2, '08:58', '09:02'],
        [3, '09:10', '09:11'],
        [4, '09:55', '10:04'],
        [5, '08:40', '09:20'],
        [6, '09:30', '09:31'],
      ]),
    ],
    answer: '3',
    unit: 'events',
    tempting: [
      { answer: '4', why: '4 counts by arrival_time: events 2, 3, 5 and 6 arrived between 09:00 and 10:00. By event time, 2 and 5 happened in the 08:00 hour and 4 happened at 09:55.' },
      { answer: '2', why: '2 leaves out event 4. It arrived after 10:00, but it happened at 09:55, so it belongs to the 09:00 hour.' },
    ],
    explanation:
      'Events 3 (09:10), 4 (09:55) and 6 (09:30) happened in the 09:00 hour. Grouped by arrival the hour shows 4, with two events that happened before 09:00 and without event 4.\n' +
      'The difference is lateness: event 5 was 40 minutes late. Grouping by event time puts each event where it happened, at the price of waiting for late ones.',
  },
  {
    id: 'de-wmark-4',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_EVENT_TIME_WINDOWS,
    course: DE,
    question:
      'A job counts events in hopping windows 10 minutes long that start every 5 minutes: [09:55, 10:05), [10:00, 10:10), [10:05, 10:15), [10:10, 10:20). A dashboard adds up the four windows\' counts and calls it "events this period".\n' +
      'What total does it show?',
    tables: [
      table('events', ['event_id', 'event_time'], [
        ['e1', '10:02'],
        ['e2', '10:06'],
        ['e3', '10:08'],
        ['e4', '10:13'],
      ]),
    ],
    answer: '8',
    unit: 'events',
    tempting: [
      { answer: '4', why: '4 is the number of events. Hopping windows overlap, so each event is counted in every window that covers it, here two.' },
      { answer: '6', why: '6 is the two middle windows, [10:00, 10:10) with 3 and [10:05, 10:15) with 3. The first and last windows hold e1 and e4 too.' },
    ],
    explanation:
      'The windows count 1 (e1), 3 (e1, e2, e3), 3 (e2, e3, e4) and 1 (e4): 8. A window 10 minutes long that starts every 5 minutes covers each moment twice, so the counts add up to twice the events.\n' +
      'Hopping (sliding) windows suit a smooth moving figure, such as orders in the last 10 minutes updated every 5; to count each event once, use tumbling windows.',
  },
  {
    id: 'de-wmark-5',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_EVENT_TIME_WINDOWS,
    course: DE,
    question:
      'A job counts events in 5-minute tumbling windows by event time. Its watermark is the largest event time seen so far minus 2 minutes. A window is emitted and closed when the watermark reaches its end, and an event for a closed window is dropped. Events arrive in the order shown.\n' +
      'What count is emitted for [10:00, 10:05)?',
    tables: [
      table('arrivals', ['arrival_seq', 'event_id', 'event_time'], [
        [1, 'e1', '10:01'],
        [2, 'e2', '10:03'],
        [3, 'e3', '10:06'],
        [4, 'e4', '10:04'],
        [5, 'e5', '10:08'],
        [6, 'e6', '10:02'],
        [7, 'e7', '10:09'],
      ]),
    ],
    answer: '3',
    unit: 'events',
    tempting: [
      { answer: '4', why: '4 counts e6. By the time it arrives, e5 (10:08) has moved the watermark to 10:06, past 10:05, so the window has closed and e6 is dropped.' },
      { answer: '2', why: '2 drops e4 because it arrived after e3 (10:06). The watermark was then 10:04, short of 10:05, so the window was still open.' },
    ],
    explanation:
      'After e3 the watermark is 10:04, so e4 is still in time. e5 moves it to 10:06, which closes [10:00, 10:05) with e1, e2 and e4: 3. e6 then arrives for a closed window and is dropped (or sent to a late-data output).\n' +
      'The 2 minutes of allowed lateness decide this: a longer wait would have counted e6 and emitted the window later.',
  },
  {
    id: 'de-wmark-6',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_EVENT_TIME_WINDOWS,
    course: DE,
    question:
      'Billing charges each merchant per 5-minute period of orders, and every order must be billed once.\n' +
      'Which windows should the job count orders in, and why?',
    decisions: [
      { id: 'tumbling', text: 'Tumbling windows of 5 minutes, by each order\'s time', isCorrect: true },
      { id: 'hopping', text: 'Hopping windows of 5 minutes, starting every 30 seconds', isCorrect: false },
      { id: 'session', text: 'Session windows that close after 5 quiet minutes', isCorrect: false },
      { id: 'reset', text: 'A running count, reset every 5 minutes by the clock', isCorrect: false },
    ],
    reasons: [
      { id: 'tile', text: 'Tumbling windows tile time without overlaps, so each order falls in one period', isCorrect: true },
      { id: 'hop-once', text: 'Hopping windows count each order once and refresh more often, so each bill goes out sooner', isCorrect: false },
      { id: 'session-fixed', text: 'A session window is a fixed 5 minutes long, starting from each merchant\'s first order', isCorrect: false },
      { id: 'clock-same', text: 'A reset by the clock matches event time, since orders arrive almost as they are placed', isCorrect: false },
    ],
    explanation:
      'Fixed, non-overlapping periods are tumbling windows: an order\'s time puts it in one window and no other, so each order is billed once.\n' +
      'Hopping windows overlap, so an order would be billed in up to 10 windows; a session window has no fixed length; and a clock-driven reset puts a late order in whichever period it arrives in.',
  },
  {
    id: 'de-wmark-7',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_EVENT_TIME_WINDOWS,
    course: DE,
    question:
      'Product wants "visits": a user\'s clicks grouped together until the user has been inactive for 30 minutes. Visits last anything from 2 minutes to 3 hours.\n' +
      'Which windows fit, and why?',
    decisions: [
      { id: 'session', text: 'Session windows per user, with a gap of 30 minutes', isCorrect: true },
      { id: 'tumbling', text: 'Tumbling windows of 30 minutes, kept for each user', isCorrect: false },
      { id: 'hopping', text: 'Hopping windows of 3 hours that start every 30 minutes', isCorrect: false },
      { id: 'day', text: 'One window per user per day, which ends at midnight', isCorrect: false },
    ],
    reasons: [
      { id: 'grows', text: 'A session window grows while clicks come within the gap, so its length follows the user', isCorrect: true },
      { id: 'gap-length', text: 'A window as long as the gap closes each visit once it has gone on for 30 minutes of clicks', isCorrect: false },
      { id: 'longest', text: 'Windows as long as the longest visit are sure to hold each visit whole inside one of them', isCorrect: false },
      { id: 'midnight', text: 'Visits rarely run across midnight, so a day window keeps the great majority of them whole', isCorrect: false },
    ],
    explanation:
      'A visit is defined by inactivity, not by the clock: a session window starts at a click and stays open while the next click comes within 30 minutes, so a 2-minute visit and a 3-hour one each come out as one window.\n' +
      'Fixed windows cut visits at arbitrary boundaries: 30-minute windows split a long visit, overlapping 3-hour windows hold the same visit several times, and day windows merge separate visits in one day.',
  },
  {
    id: 'de-wmark-8',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_EVENT_TIME_WINDOWS,
    course: DE,
    language: CodeLanguage.SQL,
    question: 'Put the steps of designing a per-minute revenue job by event time in order. Two steps do not belong.',
    correctOrder: [
      'Pick the field that holds each payment\'s event time, and parse it from every event',
      'Measure how late payments arrive: the gap between event time and arrival',
      'Set the allowed lateness from that gap and the delay the readers can accept',
      'Count payments in 1-minute tumbling windows by event time, closed by the watermark',
      'Send payments for windows already closed to a late table, and correct totals from it',
    ],
    distractorLines: [
      'Count payments by the minute they arrive in, so every window closes on time',
      'Keep each window open until all of its payments are in, so no total is wrong',
    ],
    solution: steps([
      'Pick the field that holds each payment\'s event time, and parse it from every event',
      'Measure how late payments arrive: the gap between event time and arrival',
      'Set the allowed lateness from that gap and the delay the readers can accept',
      'Count payments in 1-minute tumbling windows by event time, closed by the watermark',
      'Send payments for windows already closed to a late table, and correct totals from it',
    ]),
    explanation:
      'Lateness can only be measured once the event time is known, and the allowed lateness is chosen from that measurement and from how long readers can wait. The watermark then closes each window, and what arrives after it goes to a late table instead of vanishing.\n' +
      'Counting by arrival puts payments in the wrong minute, and in a stream "all of its payments" is never known: some window has to close without them.',
  },
  {
    id: 'de-wmark-9',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_EVENT_TIME_WINDOWS,
    course: DE,
    question:
      'Visits are session windows per user with a 30-minute gap: a click within 30 minutes of the previous one joins its visit. After the six clicks below, a late click from u1 stamped 10:30 arrives, before the watermark has passed it.\n' +
      'How many visits does u1 have now?',
    tables: [
      table('clicks', ['user_id', 'click_time'], [
        ['u1', '10:00'],
        ['u1', '10:10'],
        ['u1', '10:50'],
        ['u1', '11:15'],
        ['u1', '11:20'],
        ['u1', '12:00'],
      ]),
    ],
    answer: '2',
    unit: 'visits',
    tempting: [
      { answer: '3', why: '3 is the count before the late click. At 10:30 it is 20 minutes after 10:10 and 20 minutes before 10:50, so it joins the first two visits into one.' },
      { answer: '4', why: '4 treats the late click as a visit of its own. It falls within 30 minutes of the clicks on both sides of it.' },
    ],
    explanation:
      'Before the late click the gaps are 10, 40, 25, 5 and 40 minutes, so there are 3 visits: 10:00-10:10, 10:50-11:20 and 12:00. The click at 10:30 bridges the 40-minute gap, so the first two visits merge: 10:00-11:20 and 12:00.\n' +
      'Session windows are the one kind a late event can merge, so the job must keep a session\'s state until the watermark is past its gap.',
  },
  {
    id: 'de-wmark-10',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_EVENT_TIME_WINDOWS,
    course: DE,
    question:
      'App events reach the pipeline late: 99% within 2 minutes, nearly all the rest within an hour (phones that were offline). A fraud alert computed per 1-minute window must fire within 3 minutes. A daily billing report built from the same events must be complete.\n' +
      'How should late events be handled, and why?',
    decisions: [
      { id: 'two-paths', text: 'Allow 2 minutes for the alerts; send later events to a late table billing uses', isCorrect: true },
      { id: 'hour-both', text: 'Allow 1 hour for both, so the alerts and billing both see the offline phones\' events', isCorrect: false },
      { id: 'arrival', text: 'Allow zero lateness, and window by arrival time so that nothing counts as late', isCorrect: false },
      { id: 'drop', text: 'Allow 2 minutes for both, and let billing go without events that are later', isCorrect: false },
    ],
    reasons: [
      { id: 'trade', text: 'A watermark trades waiting for completeness, and the two outputs need opposite ends of that trade', isCorrect: true },
      { id: 'memory-only', text: 'A longer wait costs just memory, so the longest wait the job can afford suits each of its outputs', isCorrect: false },
      { id: 'arrival-window', text: 'Arrival time places each event in the window it was sent in, so none of the events is late', isCorrect: false },
      { id: 'small-loss', text: 'Under 1% of the events come late, so totals without them are within what billing can accept', isCorrect: false },
    ],
    explanation:
      'Waiting longer catches more late events but delays every result. The alert must wait little, and billing must wait for everything, so one watermark cannot serve both: the alert closes its windows after 2 minutes, and the events behind them go to a late table that billing (a batch over event time) includes.\n' +
      'An hour\'s wait makes the alert an hour late, arrival time puts offline events in the wrong window, and billing cannot drop 1% of its charges.',
  },
  {
    id: 'de-wmark-11',
    type: QuestionType.SPOT_FLAW,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_EVENT_TIME_WINDOWS,
    course: DE,
    question:
      'A region lost its network from 09:00 to 12:00. Its users show no activity in those hours and a spike at 12:00, although the phones kept recording.\n' +
      'Click the line that causes it.',
    lines: [
      'source: app_events',
      'window: tumbling 1 hour',
      'timestamp: arrival_time',
      'allowed_lateness: 10 minutes',
      'late_events: late_app_events',
      'sink: hourly_active_users',
    ],
    flawLines: [3],
    note: 'The app stamps each event with event_time on the phone and uploads queued events when it reconnects.',
    explanation:
      'Windowing by arrival_time puts every queued event in the hour it was uploaded, 12:00, so 09:00 to 12:00 look empty and noon looks busy. The allowed lateness never comes into play, because by arrival time nothing is late.\n' +
      'Window by event_time; then the uploads at noon are late events for 09:00 to 12:00, and the lateness setting and the late table decide how they are counted.',
  },
  {
    id: 'de-wmark-12',
    type: QuestionType.SPOT_FLAW,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_EVENT_TIME_WINDOWS,
    course: DE,
    question:
      'Each minute\'s total is about 5% below the nightly recount, and late_payments fills with payments only seconds behind.\n' +
      'Click the line that causes it.',
    lines: [
      'source: payments (8 partitions)',
      'timestamp: event_time',
      'window: tumbling 1 minute',
      'allowed_lateness: 0 seconds',
      'late_events: late_payments',
      'sink: payments_per_minute',
    ],
    flawLines: [4],
    note: 'The 8 partitions are read at slightly different speeds, up to 15 seconds apart. The nightly recount reads every payment by event_time.',
    explanation:
      'With no allowed lateness the watermark is the newest event time seen. The fastest partition moves it on, and a payment a few seconds older from a slower partition arrives for a window that has just closed, so it goes to late_payments instead of the total.\n' +
      'Set the allowed lateness from the measured disorder, here at least 15 seconds, so a window closes only when the slow partitions have caught up.',
  },
  {
    id: 'de-wmark-13',
    type: QuestionType.EXPLAIN,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_EVENT_TIME_WINDOWS,
    course: DE,
    question: 'In two or three sentences: why do windows group events by event time rather than by the time they arrive?',
    keyPoints: [
      'Event time is when the event happened; arrival time is when the pipeline saw it',
      'Events arrive late and out of order (offline devices, slow partitions, retries)',
      'Grouping by arrival puts late events in the wrong window, and a re-run gives other numbers',
    ],
    modelAnswer:
      'Event time is when something happened and arrival time is when the pipeline received it, and the two drift apart whenever events are delayed or reordered. ' +
      'A window by event time counts each event in the period it belongs to, while a window by arrival moves late events into the wrong period and changes if the data is replayed.',
    explanation: 'Arrival-time windows are simpler to close, which is their one advantage: nothing is ever late.',
  },
  {
    id: 'de-wmark-14',
    type: QuestionType.EXPLAIN,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_EVENT_TIME_WINDOWS,
    course: DE,
    question: 'In two or three sentences: what is a watermark, and what do you trade when you set the allowed lateness?',
    keyPoints: [
      'A watermark is the job\'s estimate that no older events are still to come, such as the newest event time minus the allowed lateness',
      'A window is emitted and closed when the watermark passes its end',
      'A longer allowed lateness catches more late events but delays results and holds more state',
      'Events behind the watermark are dropped or sent to a late-data output to correct results',
    ],
    modelAnswer:
      'A watermark is a moving point in event time that says "events older than this are no longer expected", and a window is closed and emitted when the watermark passes its end. ' +
      'Allowing more lateness makes results more complete but later and keeps more windows in memory, so you set it from how late events really arrive and route anything later to a late-data output.',
    explanation: 'The watermark is a guess, which is why the late-data output matters: it is where the guess is corrected.',
  },
];

// ════════════════════════════════════════════════════════════════════════
// Delivery Guarantees & Exactly-Once
// ════════════════════════════════════════════════════════════════════════

const delivery: Question[] = [
  {
    id: 'de-eos-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_DELIVERY_GUARANTEES,
    course: DE,
    question:
      'A consumer appends each batch to the sink and then commits the batch\'s offsets. It crashes between the two. What does the sink hold for that batch once the consumer has restarted and caught up?',
    options: [
      { id: 'a', text: 'One copy: the broker knows which messages it handed out, so it does not send the batch again', isCorrect: false },
      { id: 'b', text: 'Two copies: it restarts at the last committed offset, so the batch is read and appended again', isCorrect: true },
      { id: 'c', text: 'Zero copies: the rows of a batch whose offsets were not committed are taken out of the sink', isCorrect: false },
      { id: 'd', text: 'One copy: a message is gone from the log once it has been read, so a second read finds nothing', isCorrect: false },
    ],
    explanation:
      'Progress is the committed offset and nothing else. The batch was written but its offsets were not committed, so the restarted consumer reads it again and appends it a second time: at-least-once delivery, no loss but possible duplicates.\n' +
      'The broker does not track what was handed out, the sink knows nothing about offsets, and reading leaves messages in the log.',
  },
  {
    id: 'de-eos-2',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_DELIVERY_GUARANTEES,
    course: DE,
    question:
      'A consumer reads 2 messages at a time. For each batch it appends the rows to payments_sink, then commits. Offsets 0-1 are appended and committed. It appends offsets 2-3, then crashes before committing. It restarts and reads to the end.\n' +
      'What is SUM(amount) in payments_sink?',
    tables: [
      table('topic_log', ['offset_no', 'payment_id', 'amount'], [
        [0, 'p1', 20],
        [1, 'p2', 35],
        [2, 'p3', 15],
        [3, 'p4', 40],
        [4, 'p5', 25],
        [5, 'p6', 10],
      ]),
    ],
    answer: '200',
    tempting: [
      { answer: '145', why: '145 is the true total. The restart carries on from offset 2, the last commit, so 2-3 are appended again.' },
      { answer: '90', why: '90 leaves out offsets 2-3. They were written before the crash; what was missing was the commit, so they are written twice, not lost.' },
    ],
    explanation:
      'The sink gets offsets 0-3, then, after the restart from offset 2, offsets 2-5: 145 + 15 + 40 = 200.\n' +
      'Process, then commit is at-least-once: a crash between the two replays the batch. Nothing is lost, and an append sink counts the replay twice.',
  },
  {
    id: 'de-eos-3',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_DELIVERY_GUARANTEES,
    course: DE,
    question:
      'This consumer reads 2 messages at a time and commits each batch\'s offsets as soon as it has read it, then appends the rows to payments_sink. Offsets 0-1 are done. It reads 2-3, commits them, and crashes before appending. It restarts and reads to the end.\n' +
      'What is SUM(amount) in payments_sink?',
    tables: [
      table('topic_log', ['offset_no', 'payment_id', 'amount'], [
        [0, 'p1', 20],
        [1, 'p2', 35],
        [2, 'p3', 15],
        [3, 'p4', 40],
        [4, 'p5', 25],
        [5, 'p6', 10],
      ]),
    ],
    answer: '90',
    tempting: [
      { answer: '145', why: '145 is the true total. The commit already said 2-3 were done, so the restart carries on at offset 4 and p3 and p4 are never written.' },
      { answer: '200', why: '200 is what process-then-commit gives. Here the commit comes first, so a crash loses the batch instead of repeating it.' },
    ],
    explanation:
      'The restart carries on from the committed offset 4, so the sink gets offsets 0-1 and 4-5: 20 + 35 + 25 + 10 = 90, and p3 and p4 are lost.\n' +
      'Commit, then process is at-most-once: never a duplicate, but a crash loses the batch. It suits data where a gap is cheaper than a duplicate, such as sampled metrics.',
  },
  {
    id: 'de-eos-4',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_DELIVERY_GUARANTEES,
    course: DE,
    question:
      'The producer timed out on p3 and sent it again, so p3 is in the log twice. The consumer then wrote offsets 2-4, crashed before committing, and on restart read 2-5. payments_sink upserts on payment_id: a row with a payment_id it holds replaces that row.\n' +
      'How many rows does payments_sink hold?',
    tables: [
      table('topic_log', ['offset_no', 'payment_id', 'amount'], [
        [0, 'p1', 20],
        [1, 'p2', 35],
        [2, 'p3', 15],
        [3, 'p3', 15],
        [4, 'p4', 40],
        [5, 'p5', 25],
      ]),
    ],
    answer: '5',
    unit: 'rows',
    tempting: [
      { answer: '6', why: '6 is one row per offset. The sink keys on payment_id, so both copies of p3 land on one row.' },
      { answer: '9', why: '9 is every write: offsets 0-4, then 2-5 again. An upsert replaces a row it already holds, so repeats add nothing.' },
    ],
    explanation:
      'Nine writes reach the sink, but they carry only five payment ids, and each write replaces the row with its id: p1 to p5, 5 rows.\n' +
      'Two kinds of duplicate are caught here: the replay after the crash (same offsets) and the producer\'s resend (a new offset, same payment). Both carry the same payment_id, which is why the key is the business id.',
  },
  {
    id: 'de-eos-5',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_DELIVERY_GUARANTEES,
    course: DE,
    question:
      'Payment events are delivered at least once, and the consumer adds each one to a balances table. After a restart some balances are too high.\n' +
      'How should the consumer change, and why?',
    decisions: [
      { id: 'idempotent', text: 'Record each payment_id it applies, in one transaction with the balance change', isCorrect: true },
      { id: 'commit-first', text: 'Commit the offsets before applying each batch, so a batch is applied once', isCorrect: false },
      { id: 'dedupe-offset', text: 'Skip a message whose offset it has applied before, kept in a table of offsets', isCorrect: false },
      { id: 'exactly-once', text: 'Ask the broker for exactly-once delivery, so each payment arrives just once', isCorrect: false },
    ],
    reasons: [
      { id: 'repeat-no-effect', text: 'A repeated payment then finds its id already applied and changes nothing, however it was repeated', isCorrect: true },
      { id: 'commit-once', text: 'Committing first means each batch is read a single time, which also keeps each payment from being lost', isCorrect: false },
      { id: 'offset-unique', text: 'An offset names one payment for good, so a payment seen twice turns up at the same offset both times', isCorrect: false },
      { id: 'broker-dedupe', text: 'The broker can take out duplicates for the consumer, so its writes can skip checks of their own', isCorrect: false },
    ],
    explanation:
      'At-least-once delivery repeats messages, so the write has to make a repeat harmless: store the payment_id with the balance change, in one transaction, and skip an id already stored. Then the end state is the one exactly-once processing would give.\n' +
      'Committing first loses payments on a crash. Offsets catch replays but not a producer\'s resend, which gets a new offset. A broker\'s exactly-once settings cover its own topics, not a write to your table.',
  },
  {
    id: 'de-eos-6',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_DELIVERY_GUARANTEES,
    course: DE,
    question:
      'A consumer reads order events at least once and charges each order\'s card through the payment provider\'s API. After a crash and replay, two customers were charged twice.\n' +
      'What should change, and why?',
    decisions: [
      { id: 'idem-key', text: 'Pass the order_id to the provider as each charge\'s idempotency key', isCorrect: true },
      { id: 'engine-eos', text: 'Turn on the stream engine\'s exactly-once mode for the charging job', isCorrect: false },
      { id: 'no-retry', text: 'Turn off retries, so that a failed charge is not attempted a second time', isCorrect: false },
      { id: 'commit-first', text: 'Commit each order\'s offset before calling the provider to charge it', isCorrect: false },
    ],
    reasons: [
      { id: 'outside', text: 'The charge happens outside your system, so only the provider can tell that a call is a repeat', isCorrect: true },
      { id: 'engine-covers', text: 'Exactly-once mode covers each call the job makes, so a replayed order is not charged a second time', isCorrect: false },
      { id: 'retry-cause', text: 'Retries are what cause repeats, so without them each order is charged once at the very most', isCorrect: false },
      { id: 'commit-safe', text: 'Once the offset is committed the order is not read a second time, so the charge is safe from replays', isCorrect: false },
    ],
    explanation:
      'A side effect outside the pipeline cannot be rolled back or checked by it. An idempotency key lets the provider recognise the second call for the same order and return the first result instead of charging again.\n' +
      'An engine\'s exactly-once covers its own state and transactional sinks, not an API call. Without retries a timeout loses the charge, and committing first loses it on a crash.',
  },
  {
    id: 'de-eos-7',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_DELIVERY_GUARANTEES,
    course: DE,
    language: CodeLanguage.SQL,
    question:
      'A streaming job keeps totals in state and writes them to a transactional sink. Put the steps of one exactly-once checkpoint in order. Two steps do not belong.',
    correctOrder: [
      'Note the input offset of every partition at the checkpoint',
      'Save the job\'s state as it stands at those offsets',
      'Pre-commit the output written since the last checkpoint, still hidden',
      'Mark the checkpoint complete once offsets, state and output are saved',
      'Commit the pre-committed output, so readers can see it',
    ],
    distractorLines: [
      'Commit each output row to the sink as soon as it is written',
      'Save the state now, and note the offsets at the next checkpoint',
    ],
    solution: steps([
      'Note the input offset of every partition at the checkpoint',
      'Save the job\'s state as it stands at those offsets',
      'Pre-commit the output written since the last checkpoint, still hidden',
      'Mark the checkpoint complete once offsets, state and output are saved',
      'Commit the pre-committed output, so readers can see it',
    ]),
    explanation:
      'Exactly-once comes from tying three things to one point: where the job read up to, what its state was there, and what it had written. A restart goes back to the last complete checkpoint, and output from after it was never made visible, so nothing is applied twice or lost.\n' +
      'Output committed row by row is visible before the checkpoint and is written again after a restart; state and offsets saved at different moments disagree about which events are in the state.',
  },
  {
    id: 'de-eos-8',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_DELIVERY_GUARANTEES,
    course: DE,
    question:
      'A job drops a payment if it has seen its payment_id before, and passes the rest to the sink. To bound its state it keeps each id for 60 minutes after first seeing it. A replay and a producer resend reach it as shown.\n' +
      'How many rows reach the sink?',
    tables: [
      table('arrivals', ['offset_no', 'payment_id', 'arrived_at'], [
        [0, 'p1', '10:00'],
        [1, 'p2', '10:05'],
        [2, 'p1', '10:20'],
        [3, 'p3', '10:30'],
        [4, 'p2', '11:40'],
        [5, 'p4', '11:45'],
      ]),
    ],
    answer: '5',
    unit: 'rows',
    tempting: [
      { answer: '4', why: '4 is the number of distinct payments. p2\'s id was dropped from state at 11:05, so its resend at 11:40 looks new and passes.' },
      { answer: '6', why: '6 lets the replay of p1 through. It arrives 20 minutes after p1, while p1\'s id is still in state, so it is dropped.' },
    ],
    explanation:
      'p1, p2 and p3 pass; p1 at 10:20 is dropped (seen 20 minutes before); p2 at 11:40 passes again because its id expired at 11:05; p4 passes: 5 rows.\n' +
      'A dedup window must be longer than the longest delay between a message and its repeat. When repeats can come later than any affordable window, make the sink an upsert on payment_id, which needs no window at all.',
  },
  {
    id: 'de-eos-9',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_DELIVERY_GUARANTEES,
    course: DE,
    question:
      'A job keeps running totals per merchant in state and writes them to a table. After a crash it restarts from its last checkpoint. The totals must neither skip nor double any payment, and readers must never see a total that is later undone.\n' +
      'How should the job save its progress, and why?',
    decisions: [
      { id: 'together', text: 'Save state and input offsets in one checkpoint, and commit output with it', isCorrect: true },
      { id: 'separate', text: 'Save state every minute, and commit offsets to the broker after each batch', isCorrect: false },
      { id: 'rebuild', text: 'Commit offsets with each batch, and rebuild state by reading the whole topic', isCorrect: false },
      { id: 'latest', text: 'Save state at each checkpoint, and restart from the newest offset in the log', isCorrect: false },
    ],
    reasons: [
      { id: 'one-moment', text: 'On a restart, state, read position and visible output then all come from one moment, so nothing is lost or repeated', isCorrect: true },
      { id: 'frequent', text: 'Frequent offset commits shorten the replay after a crash, and a shorter replay is what keeps payments from doubling', isCorrect: false },
      { id: 'full-replay', text: 'A full read of the topic rebuilds the state exactly, so the offsets need not agree with a checkpoint of state', isCorrect: false },
      { id: 'skip-replay', text: 'Starting at the newest offset avoids a replay, so a payment is not added to a total a second time', isCorrect: false },
    ],
    explanation:
      'If the state says "payments up to offset 500 are in the totals", the job must restart reading at 500 and the readers must have seen only the output up to that point. Saving state and offsets together, and committing output in step with the checkpoint, keeps the three in agreement.\n' +
      'State and offsets saved at different times double or skip whatever lies between them, a full read depends on retention holding everything, and starting at the newest offset skips the payments since the checkpoint.',
  },
  {
    id: 'de-eos-10',
    type: QuestionType.SPOT_FLAW,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_DELIVERY_GUARANTEES,
    course: DE,
    question:
      'After a pod was killed during a deploy, about 500 orders never reached fact_orders, though they are in the topic.\n' +
      'Click the line that causes it.',
    language: CodeLanguage.PYTHON,
    lines: [
      'while True:',
      '    batch = consumer.poll(max_records=500)',
      '    consumer.commit(batch.offsets)',
      '    rows = [to_row(m) for m in batch]',
      '    warehouse.insert("fact_orders", rows)',
    ],
    flawLines: [3],
    note: 'consumer.commit records the group\'s position on the broker; a restarted pod carries on from the last committed position.',
    explanation:
      'The offsets are committed before the rows are written, so the pod killed between line 3 and line 5 left a committed batch that was never inserted. The restarted pod carries on after it, and the batch is lost: at-most-once.\n' +
      'Commit after the insert (at-least-once), and make the insert an upsert on order_id so the replay a crash then causes changes nothing.',
  },
  {
    id: 'de-eos-11',
    type: QuestionType.SPOT_FLAW,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_DELIVERY_GUARANTEES,
    course: DE,
    question:
      'Payments the producer sent again after a timeout are applied twice, although the job has not restarted in weeks.\n' +
      'Click the line that causes it.',
    lines: [
      'source: payments (at-least-once)',
      'producer.retries: 5',
      'dedupe.key: (partition, offset)',
      'dedupe.state_ttl: 24 hours',
      'sink: payments_applied',
    ],
    flawLines: [3],
    note: 'A producer that gets no reply in time sends the same payment again; the broker stores it as a new message.',
    explanation:
      'A resend is a new message at a new offset, so a dedupe key of (partition, offset) sees it as new. Offsets only catch a consumer re-reading the same message after a restart, which has not happened here.\n' +
      'Dedupe on the payment\'s own id, which a resend keeps, or have the producer attach a unique event id at creation.',
  },
  {
    id: 'de-eos-12',
    type: QuestionType.EXPLAIN,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_DELIVERY_GUARANTEES,
    course: DE,
    question: 'In two or three sentences: what decides whether a consumer is at-most-once or at-least-once, and what does each risk on a crash?',
    keyPoints: [
      'It is the order of writing the results and committing the offsets',
      'Commit then write is at-most-once: a crash between them loses the batch',
      'Write then commit is at-least-once: a crash between them replays the batch, so it can be written twice',
    ],
    modelAnswer:
      'The guarantee comes from the order of two steps, committing the offsets and writing the results. ' +
      'Committing first is at-most-once, because a crash before the write skips the batch for good; writing first is at-least-once, because a crash before the commit makes the consumer read and write the batch again.',
    explanation: 'Most pipelines choose at-least-once and make the write idempotent, since a duplicate can be made harmless and a loss cannot be undone.',
  },
  {
    id: 'de-eos-13',
    type: QuestionType.EXPLAIN,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_DELIVERY_GUARANTEES,
    course: DE,
    question: 'In two or three sentences: how does a stream engine give exactly-once results after a crash, and why does that not cover sending an email or calling a payment API?',
    keyPoints: [
      'It checkpoints its state together with the input offsets it has read up to',
      'Output is committed in step with the checkpoint, so a restart rolls back to one consistent point',
      'An email or API call happens outside the engine and cannot be rolled back',
      'Such side effects need an idempotency key or a record of what was sent',
    ],
    modelAnswer:
      'The engine saves its state together with the input offsets, and commits its output in step with that checkpoint, so after a crash it goes back to a point where state, input and output agree. ' +
      'An email or a payment call leaves the system the moment it is made and is not undone by the rollback, so a replay repeats it unless the call carries an idempotency key or the job records what it has sent.',
    explanation: 'Exactly-once describes the effect on the engine\'s own state and sinks; delivery to the outside world is still at least once.',
  },
];

// ════════════════════════════════════════════════════════════════════════
// State & Stream Joins
// ════════════════════════════════════════════════════════════════════════

const stateJoins: Question[] = [
  {
    id: 'de-sjoin-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_STREAM_STATE_JOINS,
    course: DE,
    question: 'A streaming job keeps a running count of orders per customer since it started. What is the job\'s state?',
    options: [
      { id: 'a', text: 'Each order it has read, kept so that it can count each customer\'s orders again each time', isCorrect: false },
      { id: 'b', text: 'Its committed offsets, which are what a job keeps to carry on from where it had stopped', isCorrect: false },
      { id: 'c', text: 'The counts in its sink table, which it reads back for a customer when an order arrives', isCorrect: false },
      { id: 'd', text: 'The current count for each customer, kept between events so the next order can add to it', isCorrect: true },
    ],
    explanation:
      'State is what a job remembers between events so it can handle the next one: here one number per customer, which each order updates. It grows with the number of customers, not orders.\n' +
      'Keeping the raw orders would grow without end; offsets say where to read, not what was computed; and a job keeps its state itself, saved in checkpoints, instead of reading its own output back.',
  },
  {
    id: 'de-sjoin-2',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_STREAM_STATE_JOINS,
    course: DE,
    question:
      'A streaming job joins orders to payments. A payment matches its order if it is paid at the order\'s time or up to 30 minutes after it.\n' +
      'How many orders get a joined row?',
    tables: [
      table('orders', ['order_id', 'ordered_at'], [
        ['o1', '09:00'],
        ['o2', '09:05'],
        ['o3', '09:20'],
        ['o4', '09:30'],
        ['o5', '09:45'],
      ]),
      table('payments', ['payment_id', 'order_id', 'paid_at'], [
        ['p1', 'o1', '09:10'],
        ['p2', 'o2', '09:50'],
        ['p3', 'o3', '09:21'],
        ['p4', 'o5', '10:10'],
        ['p5', 'o4', '10:05'],
      ]),
    ],
    answer: '3',
    unit: 'orders',
    tempting: [
      { answer: '5', why: '5 is the join without its time condition, as in a batch. o2 was paid 45 minutes after it was placed and o4 35, both outside the 30 minutes.' },
      { answer: '2', why: '2 leaves out o5, paid at 10:10, 25 minutes after 09:45. The bound is from the order\'s own time, not the hour.' },
    ],
    explanation:
      'o1 (10 minutes), o3 (1 minute) and o5 (25 minutes) are paid within 30 minutes; o2 (45) and o4 (35) are not.\n' +
      'The time bound is what makes the join workable on streams: an order can be dropped from state 30 minutes after it was placed, since no payment can match it after that.',
  },
  {
    id: 'de-sjoin-3',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_STREAM_STATE_JOINS,
    course: DE,
    question:
      'A job keeps a running count of events per user_id since it started, with one state entry per key.\n' +
      'After these events, how many entries does its state hold?',
    tables: [
      table('events', ['event_id', 'user_id'], [
        [1, 'u1'],
        [2, 'u2'],
        [3, 'u1'],
        [4, 'u3'],
        [5, 'u2'],
        [6, 'u4'],
        [7, 'u1'],
        [8, 'u5'],
      ]),
    ],
    answer: '5',
    unit: 'entries',
    tempting: [
      { answer: '8', why: '8 is the number of events. The job keeps a count per user, so repeat events update an entry instead of adding one.' },
      { answer: '1', why: '1 is one total for the whole stream. The count is per user_id, so each user has an entry.' },
    ],
    explanation:
      'u1 to u5 each have one count: 5 entries. State grows with the number of distinct keys, so a count per user grows as long as new users appear, which is why long-running keyed state needs a window or an expiry.',
  },
  {
    id: 'de-sjoin-4',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_STREAM_STATE_JOINS,
    course: DE,
    question:
      'A job tags each order with the customer\'s tier by looking it up in a table kept from customer_changes. The lookup happens when the order reaches the job (arrived_at), and gives the tier current at that moment.\n' +
      'How many orders are tagged gold?',
    tables: [
      table('customer_changes', ['customer_id', 'tier', 'changed_at'], [
        ['c1', 'silver', '09:00'],
        ['c1', 'gold', '10:30'],
        ['c2', 'gold', '09:00'],
      ]),
      table('orders', ['order_id', 'customer_id', 'ordered_at', 'arrived_at'], [
        ['o1', 'c1', '10:10', '10:11'],
        ['o2', 'c1', '10:20', '10:40'],
        ['o3', 'c2', '10:25', '10:26'],
        ['o4', 'c1', '10:35', '10:36'],
      ]),
    ],
    answer: '3',
    unit: 'orders',
    tempting: [
      { answer: '2', why: '2 tags each order with the tier at the time it was placed. This lookup uses arrival, and o2 arrived at 10:40, after c1 became gold.' },
      { answer: '4', why: '4 tags o1 gold too. It arrived at 10:11, while c1 was still silver.' },
    ],
    explanation:
      'At arrival, o1 finds c1 silver, o2 (arriving at 10:40) finds c1 gold, o3 finds c2 gold, and o4 finds c1 gold: 3 gold.\n' +
      'A lookup at processing time gives a late order the value current when it arrives, and a replay tomorrow gives other answers. When the value at the event\'s time matters, join to the version valid then.',
  },
  {
    id: 'de-sjoin-5',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_STREAM_STATE_JOINS,
    course: DE,
    question:
      'A job emits a running count of events per user after each event. To bound its state, a user\'s entry is dropped 30 minutes after that user\'s last event (a state TTL).\n' +
      'What count does it emit for u1 after the event at 11:20?',
    tables: [
      table('events', ['user_id', 'event_time'], [
        ['u1', '10:00'],
        ['u1', '10:20'],
        ['u2', '10:30'],
        ['u1', '10:45'],
        ['u1', '11:20'],
      ]),
    ],
    answer: '1',
    tempting: [
      { answer: '4', why: '4 is every u1 event. After 10:45 u1 was quiet for 35 minutes, so its entry expired at 11:15 and the count started again.' },
      { answer: '3', why: '3 expires the entry 30 minutes after the first event, 10:00. The TTL here runs from the last event, and each event resets it.' },
    ],
    explanation:
      'u1\'s gaps are 20 and 25 minutes, so its entry survives to 10:45, with a count of 3; it expires at 11:15, and the event at 11:20 starts a new count of 1.\n' +
      'A TTL bounds state, and the price is that a key quiet for longer than the TTL starts from nothing. Choose it from what the result means, not from memory alone.',
  },
  {
    id: 'de-sjoin-6',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_STREAM_STATE_JOINS,
    course: DE,
    question:
      'A job joins orders to shipments on order_id with no time condition. Its state grows every day, and it runs out of memory after about a week. Every shipment comes within 7 days of its order.\n' +
      'What should change, and why?',
    decisions: [
      { id: 'bound', text: 'Add a time bound: a shipment joins only within 7 days of its order', isCorrect: true },
      { id: 'memory', text: 'Give the job more memory, so a week of orders fits with room to spare', isCorrect: false },
      { id: 'restart', text: 'Restart the job each night, so its state is built again from fresh rows', isCorrect: false },
      { id: 'arrival', text: 'Join the two streams on arrival time, so rows match as soon as they come', isCorrect: false },
    ],
    reasons: [
      { id: 'evict', text: 'With a bound, the watermark tells the job when a row can no longer match, so the row can be dropped', isCorrect: true },
      { id: 'matched-removed', text: 'Rows leave the state once they are joined, so just the unmatched rows pile up, and more memory holds them', isCorrect: false },
      { id: 'restart-keeps', text: 'A restart clears the state, and the rows still waiting for a match are read again from the topic', isCorrect: false },
      { id: 'arrival-forget', text: 'Matching on arrival lets the job forget each row once it has been seen by the other stream', isCorrect: false },
    ],
    explanation:
      'Without a bound, any order might still meet a shipment, so the join has to keep every order forever. With "within 7 days", the job drops an order once the watermark is 7 days past it, and state stays at about a week of rows.\n' +
      'An order can match more than one shipment, so joined rows are not removed; a restart restores state from its checkpoint, or loses the rows waiting for a match; and arrival time does not tell the job when a row can be forgotten.',
  },
  {
    id: 'de-sjoin-7',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_STREAM_STATE_JOINS,
    course: DE,
    question:
      'Clicks must be tagged with the product\'s current category. The catalog holds 10,000 products, changes a few times a day, and publishes every change to a topic.\n' +
      'How should the job join clicks to products, and why?',
    decisions: [
      { id: 'table', text: 'Keep a products table in state from its change topic; look clicks up in it', isCorrect: true },
      { id: 'window', text: 'Join clicks to product changes that come within 5 minutes of each click', isCorrect: false },
      { id: 'query-db', text: 'Query the catalog database for the product of each click that arrives', isCorrect: false },
      { id: 'snapshot', text: 'Load the catalog once when the job starts, and look clicks up in that copy', isCorrect: false },
    ],
    reasons: [
      { id: 'current-bounded', text: 'The table holds each product\'s latest row, which a click needs, and its size is set by the catalog', isCorrect: true },
      { id: 'window-match', text: 'A windowed join keeps the state small, and products send a change within a few minutes of most clicks', isCorrect: false },
      { id: 'db-fresh', text: 'The database is the newest copy, and one query per click costs about the same as a lookup in state', isCorrect: false },
      { id: 'snapshot-ok', text: 'A catalog that changes a few times a day is close enough to fixed, so a copy from the start stays right', isCorrect: false },
    ],
    explanation:
      'This is a stream-table join: the catalog is a table, kept current by applying its change topic, and each click looks up the product as it is now. State is 10,000 rows, however many clicks pass.\n' +
      'A windowed join finds no match for products that did not change in the last 5 minutes, a query per click puts the click rate on the catalog database, and a copy from the start misses new and changed products.',
  },
  {
    id: 'de-sjoin-8',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_STREAM_STATE_JOINS,
    course: DE,
    language: CodeLanguage.SQL,
    question: 'Put the steps of an interval join of orders and payments in order. Two steps do not belong.',
    correctOrder: [
      'Key both streams by order_id, so the rows that match meet in the same task',
      'Set the bound: a payment matches from its order\'s time to 30 minutes after',
      'Buffer each order and each payment in state when it arrives',
      'Emit a joined row whenever a new row finds a match in the other buffer',
      'Drop a buffered row once the watermark is 30 minutes past its time',
    ],
    distractorLines: [
      'Wait until both streams have ended, then join them like two tables',
      'Keep every buffered row, so a payment months late can still find its order',
    ],
    solution: steps([
      'Key both streams by order_id, so the rows that match meet in the same task',
      'Set the bound: a payment matches from its order\'s time to 30 minutes after',
      'Buffer each order and each payment in state when it arrives',
      'Emit a joined row whenever a new row finds a match in the other buffer',
      'Drop a buffered row once the watermark is 30 minutes past its time',
    ]),
    explanation:
      'Both sides arrive over time and in either order, so each row waits in state for its partner, and a match is emitted the moment the second one arrives. The bound and the watermark say when a row can no longer match, which is what lets state shrink.\n' +
      'Streams do not end, and keeping every row makes state grow until the job fails.',
  },
  {
    id: 'de-sjoin-9',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_STREAM_STATE_JOINS,
    course: DE,
    question:
      'An interval join matches a payment to its order if it is paid up to 30 minutes after the order. The watermark is the newest event time seen minus 5 minutes. An order is dropped from state once the watermark reaches its time + 30 minutes. A payment that finds no order in state gets no row. Rows arrive in the order shown.\n' +
      'How many payments get a joined row?',
    tables: [
      table('arrivals', ['arrival_seq', 'kind', 'order_id', 'event_time'], [
        [1, 'order', 'o1', '10:00'],
        [2, 'order', 'o2', '10:10'],
        [3, 'payment', 'o1', '10:12'],
        [4, 'order', 'o3', '10:30'],
        [5, 'payment', 'o3', '10:31'],
        [6, 'order', 'o4', '10:50'],
        [7, 'payment', 'o2', '10:35'],
        [8, 'payment', 'o4', '10:52'],
      ]),
    ],
    answer: '3',
    unit: 'payments',
    tempting: [
      { answer: '4', why: '4 matches o2\'s payment, which is within 30 minutes of o2. But o4 (10:50) moved the watermark to 10:45, past o2\'s 10:40, so o2 had left state before its payment arrived.' },
      { answer: '2', why: '2 drops o3\'s payment as well. o3 stays in state until the watermark reaches 11:00, and the newest event is 10:52.' },
    ],
    explanation:
      'o1\'s and o3\'s payments find their orders. o4 (10:50) moves the watermark to 10:45, which drops o1 (10:30) and o2 (10:40); o2\'s payment then arrives and finds nothing. o4\'s payment matches: 3.\n' +
      'The payment was in time by event time but arrived late, after the watermark had passed. The watermark\'s lateness has to cover how late rows arrive, or the bound drops partners that were still to come.',
  },
  {
    id: 'de-sjoin-10',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_STREAM_STATE_JOINS,
    course: DE,
    question:
      'Revenue by customer region is built from an orders stream enriched with each customer\'s region. Customers do move, orders reach the job up to an hour after they are placed, and finance needs past days to give the same totals when re-run.\n' +
      'How should each order find its region, and why?',
    decisions: [
      { id: 'as-of', text: 'Join each order to the region version valid at the order\'s event time', isCorrect: true },
      { id: 'current', text: 'Look up the customer\'s current region when the order reaches the job', isCorrect: false },
      { id: 'midnight', text: 'Load a copy of the regions at midnight, and use it for the whole day', isCorrect: false },
      { id: 'nightly', text: 'Use the current region, and re-run the report each night to correct it', isCorrect: false },
    ],
    reasons: [
      { id: 'versioned', text: 'A table of versions answers "the region then", so a late order and a re-run give the same answer', isCorrect: true },
      { id: 'current-true', text: 'The current region is the most accurate one, since it is where the customer lives today', isCorrect: false },
      { id: 'daily-stable', text: 'A copy made at midnight changes once a day, which keeps a day\'s totals as fixed as they need to be', isCorrect: false },
      { id: 'rerun-fixes', text: 'A nightly re-run sees each move made that day, so it puts the day\'s orders under the right regions', isCorrect: false },
    ],
    explanation:
      'A late order looked up on arrival gets the region current an hour later, and a re-run next month gets the region current then, so the totals drift. Keeping the regions as versions with valid-from and valid-to times (a Type 2 dimension) and joining on the order\'s event time gives one answer whenever it runs.\n' +
      'A midnight copy is wrong for anyone who moves during the day, and a re-run with current values moves all of a customer\'s past orders to their new region.',
  },
  {
    id: 'de-sjoin-11',
    type: QuestionType.SPOT_FLAW,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_STREAM_STATE_JOINS,
    course: DE,
    question:
      'This streaming query runs nonstop. Its state grows every day, and after two weeks the job runs out of memory.\n' +
      'Click the line that causes it.',
    language: CodeLanguage.SQL,
    lines: [
      'SELECT o.order_id, o.amount, p.paid_at',
      'FROM orders o',
      'JOIN payments p',
      '  ON p.order_id = o.order_id',
      'WHERE o.amount > 0;',
    ],
    flawLines: [4],
    note: 'orders and payments are both streams. A payment arrives at most 30 minutes after its order.',
    explanation:
      'The join condition has no time bound, so the engine cannot know that an order will never be paid and keeps every order and every payment in state forever.\n' +
      'Add the bound the data allows, such as AND p.paid_at BETWEEN o.ordered_at AND o.ordered_at + INTERVAL \'30\' MINUTE, so rows can be dropped once the watermark passes it.',
  },
  {
    id: 'de-sjoin-12',
    type: QuestionType.SPOT_FLAW,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_STREAM_STATE_JOINS,
    course: DE,
    question:
      'The job has run for a month. Clicks on products launched since then show category NULL, and a product moved to Garden last week still counts under Kitchen.\n' +
      'Click the line that causes it.',
    lines: [
      'source: clicks',
      'enrich: products, loaded once when the job starts',
      'join key: product_id',
      'group by: category, 1-minute tumbling window',
      'allowed_lateness: 1 minute',
      'sink: clicks_per_category',
    ],
    flawLines: [2],
    note: 'The catalog publishes every new or changed product to a products_changes topic.',
    explanation:
      'The products table was copied once, a month ago, so the lookup knows nothing launched or changed since then.\n' +
      'Keep the table in state from products_changes, applying each change as it arrives, so every click is looked up against the catalog as it is now.',
  },
  {
    id: 'de-sjoin-13',
    type: QuestionType.EXPLAIN,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_STREAM_STATE_JOINS,
    course: DE,
    question: 'In two or three sentences: why is joining two streams harder than the same join on two tables in a batch?',
    keyPoints: [
      'In a batch both tables are complete when the join runs',
      'In a stream rows of each side arrive over time and in any order, so each must wait in state for its match',
      'Without a time bound the job can never drop a row, so state grows without end',
      'Late rows can arrive after their partner has been dropped and miss the join',
    ],
    modelAnswer:
      'A batch join sees both tables whole, but a stream join gets each side a row at a time, so every row has to be kept in state until its partner arrives. ' +
      'A time bound and the watermark decide when a row can be dropped; without one, state grows forever, and with one, a row that arrives too late misses its match.',
    explanation: 'Every stream join is a choice of how long to wait, the same trade a window\'s watermark makes.',
  },
  {
    id: 'de-sjoin-14',
    type: QuestionType.EXPLAIN,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_STREAM_STATE_JOINS,
    course: DE,
    question: 'In two or three sentences: what keeps a streaming job\'s state from growing forever, and what does each way cost?',
    keyPoints: [
      'State grows with the number of keys and the rows a job keeps waiting',
      'Windows and join bounds let the watermark close and drop state that can no longer change',
      'A TTL drops a key that has been quiet too long, and its count then starts again',
      'Each bound means a late or quiet key is left out or restarted, so it is set from the data and the result\'s meaning',
    ],
    modelAnswer:
      'State grows with every key and every row a job keeps waiting, so it has to be bounded: windows and join bounds let the watermark drop what can no longer change, and a TTL drops keys that have gone quiet. ' +
      'Each bound costs something, since a row arriving after it misses its window or join and a key past its TTL starts from zero, so the bound is chosen from how late the data comes and what the result means.',
    explanation: 'A job whose state only grows does not fail today; it fails weeks later, which is why the bound belongs in the design.',
  },
];

export const dataEngineeringStreamingQuestions: Question[] = [...logs, ...windows, ...delivery, ...stateJoins];
