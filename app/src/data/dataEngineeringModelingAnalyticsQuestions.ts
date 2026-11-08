import { CodeLanguage, Course, Difficulty, Question, QuestionType, SqlTable, Topic } from '../types';

/**
 * Data Engineering, section "Modeling for Analytics": the fourth section of
 * the course rewrite (decisions and designs). Five topics, each taught by a
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
 *     dataEngineeringModelingAnalyticsChecks.ts holds the check,
 *     scripts/check-outcomes.js runs it (part of npm test);
 *   - the cards stay at the level of the decision and the data; the SQL
 *     course's Data Modeling in SQL section teaches the T-SQL (MERGE, keys,
 *     SCD loads) that carries these decisions out;
 *   - tool-agnostic: tables, SQL and a few lines of pseudo-config are the
 *     notation, never one vendor's API.
 */

const DE = Course.DATA_ENGINEERING;

const table = (name: string, columns: string[], rows: (string | number | null)[][]): SqlTable => ({ name, columns, rows });

/** Prose lines for a Parsons card: its solution is the lines in order. */
const steps = (lines: string[]) => lines.join('\n');

// ════════════════════════════════════════════════════════════════════════
// Grain & Double Counting
// ════════════════════════════════════════════════════════════════════════

const grain: Question[] = [
  {
    id: 'de-fanout-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_GRAIN_DOUBLE_COUNTING,
    course: DE,
    question: 'A table\'s grain is written down as "one row per order line". What does that tell someone who queries it?',
    options: [
      { id: 'a', text: 'Each row stands for one line of one order: (order_id, line_no) is unique, and line measures add up', isCorrect: true },
      { id: 'b', text: 'Each row is one order line, so order-level columns such as shipping can be added up over its rows too', isCorrect: false },
      { id: 'c', text: 'The table is stored at the finest detail the source has, so each of its columns can be summed safely', isCorrect: false },
      { id: 'd', text: 'The table is partitioned by order line, so a query that asks for one line reads just one of its files', isCorrect: false },
    ],
    explanation:
      'The grain is what one row stands for. It says which columns are unique together and which measures belong to a row: a line\'s quantity and amount add up, because each line is one row.\n' +
      'An order\'s shipping fee is not a fact about a line; on a line table it is repeated on every line of the order, so summing it counts it once per line. Fine detail does not make every column summable, and grain is about meaning, not how the files are laid out.',
  },
  {
    id: 'de-fanout-2',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_GRAIN_DOUBLE_COUNTING,
    course: DE,
    question:
      'Each order pays one shipping fee, stored on the order. A report adds up shipping with the query below.\n' +
      'What does the query return?',
    tables: [
      table('orders', ['order_id', 'customer_id', 'shipping'], [
        [10, 'c1', 6],
        [11, 'c2', 4],
        [12, 'c1', 9],
      ]),
      table('order_lines', ['order_id', 'line_no', 'amount'], [
        [10, 1, 25],
        [10, 2, 15],
        [10, 3, 30],
        [11, 1, 50],
        [12, 1, 20],
        [12, 2, 10],
      ]),
    ],
    code:
      'SELECT SUM(o.shipping)\n' +
      'FROM orders o\n' +
      'JOIN order_lines l ON l.order_id = o.order_id;',
    language: CodeLanguage.SQL,
    answer: '40',
    tempting: [
      { answer: '19', why: '19 is the shipping charged, 6 + 4 + 9. The join gives each order one row per line, so order 10\'s fee is added three times and order 12\'s twice.' },
      { answer: '150', why: '150 is the sum of the line amounts. The query sums shipping, which comes from orders.' },
    ],
    explanation:
      'The join returns one row per line, and each carries its order\'s fee: order 10 has 3 lines (6 x 3 = 18), order 11 has 1 (4), order 12 has 2 (9 x 2 = 18), so 40.\n' +
      'The real shipping is 19. The total looks plausible and nothing errors, which is why fan-out goes unnoticed.',
  },
  {
    id: 'de-fanout-3',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_GRAIN_DOUBLE_COUNTING,
    course: DE,
    question:
      'fact_sales is loaded by two feeds. The orders feed writes one row per order with its total; the lines feed writes one row per order line. Both have loaded orders 501 and 502.\n' +
      'What does SELECT SUM(amount) FROM fact_sales return?',
    tables: [
      table('fact_sales', ['row_id', 'feed', 'order_id', 'line_no', 'amount'], [
        [1, 'orders', 501, null, 70],
        [2, 'orders', 502, null, 40],
        [3, 'lines', 501, 1, 30],
        [4, 'lines', 501, 2, 40],
        [5, 'lines', 502, 1, 40],
      ]),
    ],
    answer: '220',
    tempting: [
      { answer: '110', why: '110 is what was sold. The table holds each sale twice, once as an order row and again as its line rows, and SUM adds every row.' },
      { answer: '70', why: '70 is order 501 alone. The query has no filter, so every row of both orders is added.' },
    ],
    explanation:
      'SUM adds every row: 70 + 40 from the order rows and 30 + 40 + 40 from the line rows, 220, twice the 110 really sold.\n' +
      'A fact table has one grain. Two grains in one table means every total needs a filter on the feed, and the first query that forgets it double counts.',
  },
  {
    id: 'de-fanout-4',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_GRAIN_DOUBLE_COUNTING,
    course: DE,
    question:
      'daily_funnel holds one row per day. The weekly tile on the dashboard shows AVG(conversion_pct) over these days.\n' +
      'What is the true conversion rate of the three days together, in percent?',
    tables: [
      table('daily_funnel', ['visit_day', 'visits', 'orders', 'conversion_pct'], [
        ['2026-11-02', 1000, 50, 5.0],
        ['2026-11-03', 200, 30, 15.0],
        ['2026-11-04', 800, 40, 5.0],
      ]),
    ],
    answer: '6',
    acceptableAnswers: ['6.0'],
    unit: '%',
    tempting: [
      { answer: '8.3', why: '8.3 is what the tile shows: the average of the three percentages, which gives the 200-visit day as much weight as the 1,000-visit day.' },
      { answer: '25', why: '25 adds the percentages. A rate is a ratio, so adding rates of different days has no meaning.' },
    ],
    explanation:
      'A rate does not add or average across rows. Add up its parts and divide at the end: 120 orders / 2,000 visits = 6%.\n' +
      'Store the parts (visits, orders) as the measures and compute the ratio in the query, at whatever level the report asks for.',
  },
  {
    id: 'de-fanout-5',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_GRAIN_DOUBLE_COUNTING,
    course: DE,
    question:
      'A report needs goods revenue and shipping per customer. Goods amounts are on order_lines (one row per line); the shipping fee is on orders (one row per order).\n' +
      'How should the query combine them, and why?',
    decisions: [
      { id: 'aggregate-first', text: 'Sum the lines per order first, then join that one row per order to orders', isCorrect: true },
      { id: 'sum-distinct', text: 'Join orders to the lines, then add up SUM(DISTINCT o.shipping) per customer', isCorrect: false },
      { id: 'max-fee', text: 'Join orders to the lines, then take MAX(o.shipping) per customer, not SUM', isCorrect: false },
      { id: 'copy-down', text: 'Copy each order\'s shipping fee onto its lines at load, then sum the lines alone', isCorrect: false },
    ],
    reasons: [
      { id: 'one-to-one', text: 'Both sides are then one row per order, so the join matches one row to one and repeats no shipping fee', isCorrect: true },
      { id: 'distinct', text: 'DISTINCT keeps each repeated fee once, so the fees of a customer\'s orders are each counted one time', isCorrect: false },
      { id: 'finest', text: 'The finest table holds the most detail, so each measure of the report should be summed from the lines', isCorrect: false },
      { id: 'pk-dedupe', text: 'A join on the primary key drops rows that it repeats, so the fee comes through once for each order', isCorrect: false },
    ],
    explanation:
      'Bring each table to the grain of the join before joining: the lines summed per order are one row per order, like orders, so nothing fans out.\n' +
      'SUM(DISTINCT) merges two different orders with the same fee into one, MAX keeps one order\'s fee per customer, and copying the fee onto lines puts an order fact on a line table, where it is summed once per line. Joins never drop repeated rows.',
  },
  {
    id: 'de-fanout-6',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_GRAIN_DOUBLE_COUNTING,
    course: DE,
    question:
      'A new sales fact table must answer two questions: units sold per product per day, and the average number of items in a basket. The source sends order lines.\n' +
      'What grain should the table have, and why?',
    decisions: [
      { id: 'line', text: 'One row per order line, the finest grain the source sends', isCorrect: true },
      { id: 'product-day', text: 'One row per product per day, with the units already summed', isCorrect: false },
      { id: 'order', text: 'One row per order, with its products kept in a list column', isCorrect: false },
      { id: 'mixed', text: 'Rows per product per day, plus a row per order for baskets', isCorrect: false },
    ],
    reasons: [
      { id: 'answers-both', text: 'Both questions can be summed up from lines, while a daily product total has lost which items shared a basket', isCorrect: true },
      { id: 'coarse-fast', text: 'The coarsest table that answers the first question is the right one, since fewer rows make the reports run faster', isCorrect: false },
      { id: 'list-column', text: 'A list of products on each order row keeps the basket together, and units per product are easy to read from it', isCorrect: false },
      { id: 'two-grains', text: 'Each question gets rows at its own grain in the one table, so neither of them has to aggregate anything', isCorrect: false },
    ],
    explanation:
      'Choose the finest grain the questions need, usually the finest the source has: from order lines you can sum units per product and day, and count items per order for the basket size.\n' +
      'A daily product total cannot be split back into baskets, a list column has to be unpacked for every product question, and two grains in one table double count.',
  },
  {
    id: 'de-fanout-7',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_GRAIN_DOUBLE_COUNTING,
    course: DE,
    language: CodeLanguage.SQL,
    question: 'Revenue on a new report is higher than the finance system\'s. Put the steps of finding the cause in order. Two steps do not belong.',
    correctOrder: [
      'State the grain of each table that the report\'s query joins',
      'Find each join that goes from a coarser table to a finer one',
      'Count the rows before and after that join to see which rows repeat',
      'Sum each measure in a subquery at its own grain, then join the results',
      'Compare the new total with the finance system\'s total',
    ],
    distractorLines: [
      'Add DISTINCT to the SELECT so that repeated rows are removed',
      'Replace SUM with AVG for the measures whose totals look too high',
    ],
    solution: steps([
      'State the grain of each table that the report\'s query joins',
      'Find each join that goes from a coarser table to a finer one',
      'Count the rows before and after that join to see which rows repeat',
      'Sum each measure in a subquery at its own grain, then join the results',
      'Compare the new total with the finance system\'s total',
    ]),
    explanation:
      'Double counting comes from a join that matches one row to many, so the grains show where to look and a row count before and after proves it. The fix sums each measure at its own grain before the join.\n' +
      'DISTINCT on the result merges real rows that happen to be equal, and AVG changes the question being answered.',
  },
  {
    id: 'de-fanout-8',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_GRAIN_DOUBLE_COUNTING,
    course: DE,
    question:
      'A customer report puts revenue and support tickets side by side, by region. Orders and tickets both link to customers, but not to each other.\n' +
      'What revenue does the query show for North?',
    tables: [
      table('customers', ['customer_id', 'region'], [
        ['c1', 'North'],
        ['c2', 'South'],
      ]),
      table('orders', ['order_id', 'customer_id', 'amount'], [
        [1, 'c1', 30],
        [2, 'c1', 20],
        [3, 'c2', 50],
      ]),
      table('tickets', ['ticket_id', 'customer_id'], [
        [1, 'c1'],
        [2, 'c1'],
        [3, 'c1'],
        [4, 'c2'],
      ]),
    ],
    code:
      'SELECT c.region, SUM(o.amount) AS revenue, COUNT(t.ticket_id) AS tickets\n' +
      'FROM customers c\n' +
      'JOIN orders o ON o.customer_id = c.customer_id\n' +
      'JOIN tickets t ON t.customer_id = c.customer_id\n' +
      'GROUP BY c.region;',
    language: CodeLanguage.SQL,
    answer: '150',
    tempting: [
      { answer: '50', why: '50 is what c1 spent. The second join pairs each of c1\'s 2 orders with each of its 3 tickets, so each order appears 3 times.' },
      { answer: '100', why: '100 doubles the orders but misses that there are 3 tickets: every order row is repeated once per ticket, 3 times.' },
    ],
    explanation:
      'Two one-to-many joins from the same customer multiply: c1 has 2 orders x 3 tickets = 6 rows, so revenue is (30 + 20) x 3 = 150 and tickets shows 6, not 3. Both measures are wrong.\n' +
      'Aggregate orders and tickets per customer (or region) separately, then join the two results.',
  },
  {
    id: 'de-fanout-9',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_GRAIN_DOUBLE_COUNTING,
    course: DE,
    question:
      'A dashboard shows distinct active customers per region per month, and also for the whole year. To speed it up, someone proposes a summary table with one row per region per month holding active_customers. Most customers are active in several months.\n' +
      'How should the yearly figure be computed, and why?',
    decisions: [
      { id: 'from-detail', text: 'Count distinct customers over the year from the customer-level activity rows', isCorrect: true },
      { id: 'sum-months', text: 'Add up the twelve monthly active_customers values in the summary table', isCorrect: false },
      { id: 'avg-months', text: 'Average the twelve monthly values, so a customer in many months counts once', isCorrect: false },
      { id: 'max-month', text: 'Take the largest monthly value, since each customer active that year is in it', isCorrect: false },
    ],
    reasons: [
      { id: 'non-additive', text: 'A distinct count does not add up: a customer active in five months is in five monthly counts', isCorrect: true },
      { id: 'additive', text: 'Counts are additive measures, so a yearly count is the sum of the monthly counts that make it up', isCorrect: false },
      { id: 'average', text: 'An average spreads each customer over the months, which cancels the repeats in the monthly figures', isCorrect: false },
      { id: 'peak', text: 'The busiest month already holds the year\'s customers, since the other months have a subset of them', isCorrect: false },
    ],
    explanation:
      'Distinct counts are non-additive: the same customer is counted in each month they were active, so the sum overstates the year and the average or the peak understate it. Only the customer-level rows can say how many different customers there were.\n' +
      'The summary table can serve the monthly figures; the yearly one is a distinct count over the detail (or a mergeable sketch of it).',
  },
  {
    id: 'de-fanout-10',
    type: QuestionType.SPOT_FLAW,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_GRAIN_DOUBLE_COUNTING,
    course: DE,
    question:
      'Revenue by region on this report is about 2.4 times finance\'s total, while lines_sold matches the warehouse\'s count of order lines.\n' +
      'Click the line that causes it.',
    language: CodeLanguage.SQL,
    lines: [
      'SELECT c.region,',
      '       SUM(o.amount) AS revenue,',
      '       COUNT(*) AS lines_sold',
      'FROM orders o',
      'JOIN customers c ON c.customer_id = o.customer_id',
      'JOIN order_lines l ON l.order_id = o.order_id',
      'GROUP BY c.region;',
    ],
    flawLines: [2, 6],
    note: 'orders holds one row per order with its total amount; order_lines one row per line, about 2.4 per order. Finance\'s revenue comes from orders alone.',
    explanation:
      'The join on line 6 turns each order into one row per line, and line 2 then sums the order\'s total once per line, so revenue is multiplied by the lines per order. lines_sold is right because it counts at the line grain.\n' +
      'Sum revenue from orders and count lines in a subquery per order (or per region), then join the two results.',
  },
  {
    id: 'de-fanout-11',
    type: QuestionType.SPOT_FLAW,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_GRAIN_DOUBLE_COUNTING,
    course: DE,
    question:
      'Shipping by month from this table is about 2.5 times the carrier\'s invoices.\n' +
      'Click the line that causes it.',
    lines: [
      'table: fact_order_lines',
      'grain: one row per order line',
      'key: (order_id, line_no)',
      'dimensions: date_key, customer_key, product_key',
      'measures:',
      '  quantity          # of this line',
      '  line_amount       # of this line',
      '  order_shipping    # the shipping fee of the line\'s order',
    ],
    flawLines: [8],
    note: 'Orders have about 2.5 lines on average. The shipping report sums order_shipping by month.',
    explanation:
      'Line 8 puts a fact about the order on a table whose grain is the line, so each order\'s fee is stored once per line and every sum of it counts it once per line.\n' +
      'Every measure must be true at the table\'s grain: keep shipping on an order-level fact, or split the fee across the lines so that the parts add up to it.',
  },
  {
    id: 'de-fanout-12',
    type: QuestionType.EXPLAIN,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_GRAIN_DOUBLE_COUNTING,
    course: DE,
    question: 'In two or three sentences: what is a table\'s grain, and why is it declared before choosing the table\'s columns?',
    keyPoints: [
      'The grain is what one row stands for, such as one order line or one customer per day',
      'It decides which columns are unique together and which measures can be added up across rows',
      'A column true at another grain gets repeated or mixed in, and sums over it double count',
    ],
    modelAnswer:
      'The grain is what one row of the table stands for, for example one row per order line. ' +
      'Declaring it first decides the key that is unique and which measures belong, because a column that is true at a different grain, like an order\'s shipping on a line table, is repeated on many rows and double counts when summed.',
    explanation: 'Every other modeling choice, keys, dimensions and measures, follows from the grain.',
  },
  {
    id: 'de-fanout-13',
    type: QuestionType.EXPLAIN,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_GRAIN_DOUBLE_COUNTING,
    course: DE,
    question: 'In two or three sentences: why does joining a table to a finer one inflate a sum, and how do you get the right total?',
    keyPoints: [
      'Each row of the coarser table is repeated once for every matching row of the finer table',
      'So a measure of the coarser table is summed once per match instead of once',
      'Aggregate the finer table to the coarser grain before joining, or sum each measure from its own table',
      'Compare row counts (or the grain key\'s distinct count) before and after the join to catch it',
    ],
    modelAnswer:
      'A join repeats each row of the coarser table once for every matching row of the finer one, so a measure that lives on the coarser table is added once per match. ' +
      'Sum the finer table up to the coarser grain before joining, or total each measure from its own table, and check that the row count does not grow across the join.',
    explanation: 'No error is raised: the inflated number is a plausible one, so the row-count check is the safeguard.',
  },
];

// ════════════════════════════════════════════════════════════════════════
// Facts, Dimensions & the Star Schema
// ════════════════════════════════════════════════════════════════════════

const factsDimsStar: Question[] = [
  {
    id: 'de-dimstar-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_FACTS_DIMS_STAR,
    course: DE,
    question: 'A table has one row per website visit, with duration_seconds, a user_key and a page_key. What kind of table is it?',
    options: [
      { id: 'a', text: 'A dimension: it describes users and pages, and the visit duration is one of their attributes', isCorrect: false },
      { id: 'b', text: 'A fact: each row is an event, with a measure to add up and a key for each thing it involves', isCorrect: true },
      { id: 'c', text: 'A dimension: it holds a row for each visit, so it is the visit table that other facts join to', isCorrect: false },
      { id: 'd', text: 'A bridge: it links users to the pages they saw, and duration is a property of each such link', isCorrect: false },
    ],
    explanation:
      'One row per event, a numeric measure you sum or average (duration), and keys to the things the event involves (user, page): that is a fact table.\n' +
      'The user and page tables are the dimensions: one row per user or page, with the attributes you filter and group by. A visit is not an attribute of a user, and a bridge resolves a many-to-many link between dimensions; it has no measures of its own.',
  },
  {
    id: 'de-dimstar-2',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_FACTS_DIMS_STAR,
    course: DE,
    question:
      'fact_sales holds one row per sale; dim_product describes each product. The report below sums sales by category.\n' +
      'What revenue does it return for Kitchen?',
    tables: [
      table('fact_sales', ['sale_id', 'product_key', 'amount'], [
        [1, 1, 20],
        [2, 2, 15],
        [3, 1, 25],
        [4, 3, 40],
        [5, 4, 30],
        [6, 2, 10],
      ]),
      table('dim_product', ['product_key', 'product_name', 'category'], [
        [1, 'Kettle', 'Kitchen'],
        [2, 'Mug', 'Kitchen'],
        [3, 'Lamp', 'Lighting'],
        [4, 'Hose', 'Garden'],
      ]),
    ],
    code:
      'SELECT p.category, SUM(f.amount) AS revenue\n' +
      'FROM fact_sales f\n' +
      'JOIN dim_product p ON p.product_key = f.product_key\n' +
      'GROUP BY p.category;',
    language: CodeLanguage.SQL,
    answer: '70',
    tempting: [
      { answer: '45', why: '45 is the Kettle alone. The Mug (product 2) is in Kitchen too, and its two sales add 25.' },
      { answer: '140', why: '140 is every sale. GROUP BY gives one row per category, and Kitchen\'s row holds only its own products\' sales.' },
    ],
    explanation:
      'The fact has the amounts and a product key; the dimension has the category. The join brings the category to each sale and GROUP BY sums per category: Kettle 20 + 25 and Mug 15 + 10, so Kitchen is 70.\n' +
      'This is every star-schema query: filter and group by dimension attributes, sum fact measures.',
  },
  {
    id: 'de-dimstar-3',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_FACTS_DIMS_STAR,
    course: DE,
    question:
      'Product 7 went on sale today; dim_product is refreshed once a week, so it has no row for it yet. The category report runs the query below.\n' +
      'What do the revenue values it returns add up to?',
    tables: [
      table('fact_sales', ['sale_id', 'product_key', 'amount'], [
        [1, 1, 20],
        [2, 2, 15],
        [3, 3, 40],
        [4, 7, 35],
        [5, 1, 10],
      ]),
      table('dim_product', ['product_key', 'product_name', 'category'], [
        [1, 'Kettle', 'Kitchen'],
        [2, 'Mug', 'Kitchen'],
        [3, 'Lamp', 'Lighting'],
      ]),
    ],
    code:
      'SELECT p.category, SUM(f.amount) AS revenue\n' +
      'FROM fact_sales f\n' +
      'JOIN dim_product p ON p.product_key = f.product_key\n' +
      'GROUP BY p.category;',
    language: CodeLanguage.SQL,
    answer: '85',
    tempting: [
      { answer: '120', why: '120 is every sale in the fact. The inner join keeps only sales whose product_key finds a row in dim_product, so sale 4 drops out.' },
      { answer: '35', why: '35 is the sale that is lost. The other four sales find their product and are summed.' },
    ],
    explanation:
      'An inner join drops a fact row whose key has no dimension row, so the 35 of product 7 is missing and the categories add up to 85, not the 120 sold. Nothing errors.\n' +
      'Give every fact key a dimension row: load dimensions before facts, and point a key that is not there yet at an "unknown" member (or add a placeholder row) so the sale still counts.',
  },
  {
    id: 'de-dimstar-4',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_FACTS_DIMS_STAR,
    course: DE,
    question:
      'The loader copies each product\'s name onto the sale when it writes it. In October product 2 was renamed from Mug to Travel mug. The report groups on the fact\'s copy of the name.\n' +
      'How many rows does the report return?',
    tables: [
      table('fact_sales', ['sale_id', 'product_key', 'product_name', 'amount'], [
        [1, 1, 'Kettle', 20],
        [2, 2, 'Mug', 15],
        [3, 2, 'Mug', 15],
        [4, 2, 'Travel mug', 15],
        [5, 3, 'Lamp', 40],
      ]),
    ],
    code:
      'SELECT product_name, SUM(amount) AS revenue\n' +
      'FROM fact_sales\n' +
      'GROUP BY product_name;',
    language: CodeLanguage.SQL,
    answer: '4',
    unit: 'rows',
    tempting: [
      { answer: '3', why: '3 is the number of products. The fact keeps the name each sale was loaded with, so product 2 shows up under two names.' },
      { answer: '5', why: '5 is the number of sales. GROUP BY merges the sales that share a name.' },
    ],
    explanation:
      'The two names of product 2 become two groups: Kettle, Mug, Travel mug and Lamp, 4 rows for 3 products, with product 2\'s revenue split between them.\n' +
      'Descriptive attributes belong on the dimension, one row per product, and the report reaches them through the key. Then a rename changes one row, and every sale follows it.',
  },
  {
    id: 'de-dimstar-5',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_FACTS_DIMS_STAR,
    course: DE,
    question:
      'A new source column, store_region, says which region each store belongs to. Analysts want sales by region.\n' +
      'Where should store_region go, and why?',
    decisions: [
      { id: 'dim-store', text: 'On dim_store, as an attribute of each store\'s row', isCorrect: true },
      { id: 'fact', text: 'On fact_sales, copied onto each sale at load time', isCorrect: false },
      { id: 'dim-region', text: 'In a new dim_region table that dim_store points to', isCorrect: false },
      { id: 'fact-region', text: 'In a new fact table of region changes, one per event', isCorrect: false },
    ],
    reasons: [
      { id: 'describes-store', text: 'It describes the store and is the same for all of its sales, so it is reached through the store key', isCorrect: true },
      { id: 'skip-join', text: 'Copying it onto each sale saves the join, and the region a sale was made in does not need to change', isCorrect: false },
      { id: 'normalise', text: 'A value repeated on many rows should get a table of its own, so that each region is stored a single time', isCorrect: false },
      { id: 'event', text: 'A store can move to another region, which makes the region an event, and events belong in a fact', isCorrect: false },
    ],
    explanation:
      'A region is a description of the store, so it is an attribute on the store dimension, and "sales by region" is one join from the fact.\n' +
      'On the fact it would be repeated on millions of rows and frozen at load time; a separate region table is a snowflake that adds a join to save a few bytes; and a store that changes region is handled on the dimension (with history if needed), not as a fact.',
  },
  {
    id: 'de-dimstar-6',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_FACTS_DIMS_STAR,
    course: DE,
    question:
      'dim_product has 2,000 rows. Its category and department names repeat on many of them. A designer proposes moving category and department into tables of their own, linked from dim_product.\n' +
      'What should you do, and why?',
    decisions: [
      { id: 'keep-flat', text: 'Keep category and department on each product row', isCorrect: true },
      { id: 'snowflake', text: 'Move them to dim_category and dim_department tables', isCorrect: false },
      { id: 'onto-fact', text: 'Move them onto fact_sales, next to the product key', isCorrect: false },
      { id: 'drop', text: 'Drop them, and have reports look them up in the app', isCorrect: false },
    ],
    reasons: [
      { id: 'small-reads', text: 'The dimension is small, so repeats cost little, and analysts group by category with one join', isCorrect: true },
      { id: 'double-count', text: 'Repeated names in a dimension make the fact\'s sums double count, so each name needs one row', isCorrect: false },
      { id: 'smaller-faster', text: 'Smaller tables join faster, so splitting the dimension into three makes the reports quicker', isCorrect: false },
      { id: 'sync', text: 'A repeated name has to be kept in step on each row, which a warehouse load does not do safely', isCorrect: false },
    ],
    explanation:
      'A star keeps dimensions flat: 2,000 rows of repeated text is a few kilobytes, and every question about categories stays one join from the fact. Snowflaking adds two joins to every such query for almost no saving.\n' +
      'Repeats in a dimension do not change any sum (each sale joins one product row), and the load rewrites the dimension\'s rows from the source anyway.',
  },
  {
    id: 'de-dimstar-7',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_FACTS_DIMS_STAR,
    course: DE,
    language: CodeLanguage.SQL,
    question: 'Put the steps of designing a star schema for the shop\'s sales in order. Two steps do not belong.',
    correctOrder: [
      'Pick the business process the fact records: orders being placed',
      'Declare the grain in one sentence: one row per order line',
      'Choose the dimensions that describe a line: date, customer, product',
      'Choose the measures true for one line: quantity and line amount',
    ],
    distractorLines: [
      'Choose the measures first, then find a grain that can hold all of them',
      'Copy each product\'s category onto the line rows to save the report a join',
    ],
    solution: steps([
      'Pick the business process the fact records: orders being placed',
      'Declare the grain in one sentence: one row per order line',
      'Choose the dimensions that describe a line: date, customer, product',
      'Choose the measures true for one line: quantity and line amount',
    ]),
    explanation:
      'The process says which events the fact holds, the grain says what one row is, and only then can you list the dimensions and measures that are true at that grain.\n' +
      'Measures chosen first lead to mixed grains, and descriptive attributes belong on the dimensions, not copied onto the fact.',
  },
  {
    id: 'de-dimstar-8',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_FACTS_DIMS_STAR,
    course: DE,
    question:
      'Sales and returns are reported side by side by category. Sales use the shared dim_product; the returns team keeps its own product table, returns_products, with its own category names. The query sums each fact by category, then joins the two results.\n' +
      'How many of the rows it returns show a returned amount (not NULL)?',
    tables: [
      table('fact_sales', ['sale_id', 'product_key', 'amount'], [
        [1, 1, 50],
        [2, 2, 30],
        [3, 3, 40],
      ]),
      table('dim_product', ['product_key', 'category'], [
        [1, 'Kitchen'],
        [2, 'Lighting'],
        [3, 'Garden'],
      ]),
      table('fact_returns', ['return_id', 'product_id', 'amount'], [
        [1, 1, 10],
        [2, 2, 5],
        [3, 3, 8],
      ]),
      table('returns_products', ['product_id', 'category'], [
        [1, 'Kitchenware'],
        [2, 'Lighting'],
        [3, 'Outdoor'],
      ]),
    ],
    code:
      'SELECT s.category, s.sold, r.returned\n' +
      'FROM (SELECT p.category, SUM(f.amount) AS sold\n' +
      '      FROM fact_sales f JOIN dim_product p ON p.product_key = f.product_key\n' +
      '      GROUP BY p.category) s\n' +
      'LEFT JOIN (SELECT d.category, SUM(x.amount) AS returned\n' +
      '           FROM fact_returns x JOIN returns_products d ON d.product_id = x.product_id\n' +
      '           GROUP BY d.category) r\n' +
      '  ON r.category = s.category;',
    language: CodeLanguage.SQL,
    answer: '1',
    unit: 'rows',
    tempting: [
      { answer: '3', why: 'Every product had a return, but the two sides only meet on the category name, and only Lighting is spelt the same in both product tables.' },
      { answer: '0', why: 'Lighting is named the same in both tables, so its returns do match.' },
    ],
    explanation:
      'Summing each fact by category and then joining is right (it avoids a fact-to-fact fan-out), but the two sides can only meet on attributes they share. Kitchen and Kitchenware, Garden and Outdoor never match, so only Lighting shows its 5.\n' +
      'A conformed dimension, one product dimension used by both facts, is what makes facts comparable.',
  },
  {
    id: 'de-dimstar-9',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_FACTS_DIMS_STAR,
    course: DE,
    question:
      'Finance wants sales and returns by category and month. fact_sales is one row per order line; fact_returns is one row per returned item. Both use dim_product and dim_date, and a product is sold and returned many times a month.\n' +
      'How should the report be built, and why?',
    decisions: [
      { id: 'drill-across', text: 'Sum each fact by category and month on its own, then join the two results', isCorrect: true },
      { id: 'join-facts', text: 'Join fact_sales to fact_returns on product_key, then group and sum both', isCorrect: false },
      { id: 'copy-attrs', text: 'Copy category and month onto both facts, then join the facts on those two', isCorrect: false },
      { id: 'returns-col', text: 'Add a returned column to fact_sales, and update it as each return arrives', isCorrect: false },
    ],
    reasons: [
      { id: 'own-grain', text: 'Each fact is summed at its own grain, then the shared dimensions line up the two totals', isCorrect: true },
      { id: 'one-to-one', text: 'A product key is unique in each fact, so a fact-to-fact join on it matches one row to one', isCorrect: false },
      { id: 'every-measure', text: 'A fact should hold each measure of a product, so returns belong on the rows of its sales', isCorrect: false },
      { id: 'skip-dims', text: 'Attributes copied to the facts let them join without a dimension, which removes a join each', isCorrect: false },
    ],
    explanation:
      'Two facts at different grains are compared by drilling across: aggregate each to the shared dimension attributes, then join the small results. Conformed dimensions make the rows line up.\n' +
      'A product appears on many sale rows and many return rows, so joining the facts multiplies them; copying attributes does not change that; and a return is its own event with its own date, not a column of a sale.',
  },
  {
    id: 'de-dimstar-10',
    type: QuestionType.SPOT_FLAW,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_FACTS_DIMS_STAR,
    course: DE,
    question:
      'After the product team renamed the category Kitchen to Kitchen & Dining, the category report shows both names, each with part of the revenue.\n' +
      'Click the line that causes it.',
    language: CodeLanguage.SQL,
    lines: [
      'CREATE TABLE fact_sales (',
      '  date_key     INT NOT NULL,',
      '  product_key  INT NOT NULL,',
      '  store_key    INT NOT NULL,',
      '  category     VARCHAR(50),',
      '  quantity     INT,',
      '  amount       DECIMAL(10,2)',
      ');',
    ],
    flawLines: [5],
    note: 'The loader fills category from the product\'s dimension row when it writes each sale. The category report groups by fact_sales.category.',
    explanation:
      'Line 5 stores a descriptive attribute on the fact, frozen at load time. Sales loaded before the rename keep Kitchen, later ones get Kitchen & Dining, and the report splits.\n' +
      'Keep category on dim_product only and group by it through product_key: a rename then updates one dimension row and every sale follows it.',
  },
  {
    id: 'de-dimstar-11',
    type: QuestionType.SPOT_FLAW,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_FACTS_DIMS_STAR,
    course: DE,
    question:
      'Revenue by store for this month adds up to about 3% less than fact_sales\' total for the month.\n' +
      'Click the line that causes it.',
    language: CodeLanguage.SQL,
    lines: [
      'SELECT s.store_name, SUM(f.amount) AS revenue',
      'FROM fact_sales f',
      'JOIN dim_store s ON s.store_key = f.store_key',
      'WHERE f.sale_date >= \'2026-11-01\'',
      'GROUP BY s.store_name;',
    ],
    flawLines: [3],
    note: 'Three stores opened this month. A weekly job adds new stores to dim_store; their sales arrive daily, with the store_key the till assigns.',
    explanation:
      'Line 3 is an inner join, so sales from stores that are not in dim_store yet find no row and drop out of every total. Nothing errors.\n' +
      'Make sure every fact key has a dimension row: load dimensions before facts, and give an unknown store a placeholder row (or the unknown member) until its details arrive.',
  },
  {
    id: 'de-dimstar-12',
    type: QuestionType.EXPLAIN,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_FACTS_DIMS_STAR,
    course: DE,
    question: 'In two or three sentences: what goes in a fact table, what goes in a dimension table, and how does a star schema answer a question such as "sales by category"?',
    keyPoints: [
      'A fact table has one row per event at one grain: numeric measures and a key for each dimension',
      'A dimension table has one row per thing (product, customer, date) with the attributes used to filter and group',
      'A query joins the fact to the dimensions it needs, groups by their attributes and sums the fact\'s measures',
    ],
    modelAnswer:
      'A fact table records events at one grain, each row holding measures to add up and keys to its dimensions, while a dimension holds one row per product, customer or date with the descriptive attributes. ' +
      'Sales by category joins the fact to the product dimension on its key, groups by category and sums the amount.',
    explanation: 'Measures you add up live on facts; things you filter or group by live on dimensions.',
  },
  {
    id: 'de-dimstar-13',
    type: QuestionType.EXPLAIN,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_FACTS_DIMS_STAR,
    course: DE,
    question: 'In two or three sentences: an app database splits a product\'s category into its own table, but a star schema keeps it on the product dimension. Why the difference, and when is a separate table worth it?',
    keyPoints: [
      'The app is written to constantly, so it stores each fact once to keep updates in one place',
      'A warehouse dimension is small and read far more than written, so repeats cost little and save joins on every query',
      'A separate table pays off only when a dimension is very large with a big repeated group, or a hierarchy is shared by several dimensions',
    ],
    modelAnswer:
      'An app database is updated all the time, so it normalises to keep each value in one place, while a dimension is small, loaded in batches and read constantly, so repeating the category on each product row costs little and keeps every query one join from the fact. ' +
      'Splitting it out (a snowflake) is worth it only when the dimension is very large with a heavy repeated group, or several dimensions share the same hierarchy.',
    explanation: 'The workload decides: normalise for many small writes, flatten for many large reads.',
  },
];

// ════════════════════════════════════════════════════════════════════════
// Keys: Natural & Surrogate
// ════════════════════════════════════════════════════════════════════════

const keys: Question[] = [
  {
    id: 'de-skey-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_NATURAL_SURROGATE_KEYS,
    course: DE,
    question: 'Why does a warehouse give each customer dimension row a key of its own, rather than use the source system\'s customer id?',
    options: [
      { id: 'a', text: 'Integer keys join faster than text ones, which is why the source\'s id is replaced in the facts', isCorrect: false },
      { id: 'b', text: 'Its own keys hide who each customer is, so the dimension can be shared without a privacy review', isCorrect: false },
      { id: 'c', text: 'A source id can change, be reused or clash with another\'s, and history needs a row per version', isCorrect: true },
      { id: 'd', text: 'The source\'s id is dropped once the row is loaded, so the warehouse needs some key of its own to use', isCorrect: false },
    ],
    explanation:
      'The source\'s id (the natural key) is not under the warehouse\'s control: it changes, is reused, two systems both have a customer 7, and once history is kept one customer has several rows. A surrogate key, assigned by the warehouse, stays fixed for each row.\n' +
      'Speed is a minor bonus, a surrogate key is no privacy measure (the natural key and the name are still on the row), and the natural key is kept as a column so loads can look the row up.',
  },
  {
    id: 'de-skey-2',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_NATURAL_SURROGATE_KEYS,
    course: DE,
    question:
      'dim_customer holds customers from two systems, the shop and the app. Each system numbers its own customers. The fact load looks up each staged order\'s customer with the join below.\n' +
      'How many rows does the join return?',
    tables: [
      table('dim_customer', ['customer_key', 'source', 'source_id', 'customer_name'], [
        [1, 'shop', 7, 'Ana'],
        [2, 'shop', 8, 'Ben'],
        [3, 'app', 7, 'Chen'],
        [4, 'app', 9, 'Dee'],
      ]),
      table('stg_orders', ['order_id', 'source', 'source_customer_id', 'amount'], [
        [501, 'shop', 7, 40],
        [502, 'shop', 8, 30],
        [503, 'app', 7, 25],
        [504, 'app', 9, 20],
      ]),
    ],
    code:
      'SELECT o.order_id, c.customer_key\n' +
      'FROM stg_orders o\n' +
      'JOIN dim_customer c ON c.source_id = o.source_customer_id;',
    language: CodeLanguage.SQL,
    answer: '6',
    unit: 'rows',
    tempting: [
      { answer: '4', why: '4 is one row per order. Id 7 exists in both systems, so orders 501 and 503 each match two customers.' },
      { answer: '8', why: 'Only id 7 is in both systems. Orders 502 and 504 each match one customer.' },
    ],
    explanation:
      'Id 7 is Ana in the shop and Chen in the app, so orders 501 and 503 each match both: 2 + 1 + 2 + 1 = 6 rows, and each of those orders would be loaded twice, once against the wrong customer.\n' +
      'A natural key is only unique inside its source. Look up on (source, source_id).',
  },
  {
    id: 'de-skey-3',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_NATURAL_SURROGATE_KEYS,
    course: DE,
    question:
      'Until 2025 the SKU K-100 was a kettle (Kitchen). In 2026 the shop reused it for a desk lamp, and dim_product, keyed by sku, overwrote the row. The facts store the sku.\n' +
      'What does the query return for 2025?',
    tables: [
      table('fact_sales', ['sale_id', 'sale_year', 'sku', 'amount'], [
        [1, 2025, 'K-100', 30],
        [2, 2025, 'K-100', 30],
        [3, 2025, 'L-200', 45],
        [4, 2026, 'K-100', 60],
        [5, 2026, 'L-200', 45],
      ]),
      table('dim_product', ['sku', 'product_name', 'category'], [
        ['K-100', 'Desk lamp', 'Lighting'],
        ['L-200', 'Toaster', 'Kitchen'],
      ]),
    ],
    code:
      'SELECT SUM(f.amount)\n' +
      'FROM fact_sales f\n' +
      'JOIN dim_product p ON p.sku = f.sku\n' +
      'WHERE f.sale_year = 2025 AND p.category = \'Lighting\';',
    language: CodeLanguage.SQL,
    answer: '60',
    tempting: [
      { answer: '0', why: 'No lamps were sold in 2025, but the kettle\'s sales carry K-100, and K-100 now joins to the lamp\'s row.' },
      { answer: '120', why: '120 adds the 2026 lamp sale. The query keeps 2025 only.' },
    ],
    explanation:
      'The two 2025 kettle sales carry K-100, which now joins to the desk lamp row, so 2025 shows 60 of Lighting that was really Kitchen. Overwriting the row rewrote history.\n' +
      'With a surrogate key, the lamp gets a new dimension row and key, the old sales keep pointing at the kettle\'s row, and the SKU is just an attribute.',
  },
  {
    id: 'de-skey-4',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_NATURAL_SURROGATE_KEYS,
    course: DE,
    question:
      'dim_customer is rebuilt every night, with keys numbered by name. Order 7 was loaded on Monday, when the customers were Ana, Ben and Dee, and got the key of its customer. Cal signed up on Tuesday. crm_customers is shown as it is now.\n' +
      'Whose name does Wednesday\'s report show for order 7?',
    tables: [
      table('crm_customers', ['customer_id', 'customer_name'], [
        [11, 'Ana'],
        [12, 'Ben'],
        [14, 'Dee'],
        [15, 'Cal'],
      ]),
      table('fact_orders', ['order_id', 'customer_key', 'amount'], [
        [7, 3, 80],
      ]),
    ],
    code:
      '-- every night: rebuild dim_customer\n' +
      'DELETE FROM dim_customer;\n' +
      'INSERT INTO dim_customer (customer_key, customer_id, customer_name)\n' +
      'SELECT ROW_NUMBER() OVER (ORDER BY customer_name), customer_id, customer_name\n' +
      'FROM crm_customers;\n' +
      '\n' +
      '-- Wednesday\'s report\n' +
      'SELECT c.customer_name\n' +
      'FROM fact_orders f\n' +
      'JOIN dim_customer c ON c.customer_key = f.customer_key\n' +
      'WHERE f.order_id = 7;',
    language: CodeLanguage.SQL,
    answer: 'Cal',
    tempting: [
      { answer: 'Dee', why: 'Dee placed the order and had key 3 on Monday. Cal sorts before Dee, so since Tuesday\'s rebuild key 3 is Cal\'s and Dee\'s is 4.' },
    ],
    explanation:
      'On Monday the keys by name were Ana 1, Ben 2, Dee 3, so order 7 stored 3. Tuesday\'s rebuild numbers Ana 1, Ben 2, Cal 3, Dee 4, and the old fact row now points at Cal.\n' +
      'A surrogate key is assigned once, when a row is first loaded, and never recomputed: keep the existing keys and give only new rows the next free number.',
  },
  {
    id: 'de-skey-5',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_NATURAL_SURROGATE_KEYS,
    course: DE,
    question:
      'Customers come from the CRM and from the web shop, and both number their customers from 1. Some people are in both systems, with different ids.\n' +
      'How should dim_customer identify its rows, and why?',
    decisions: [
      { id: 'surrogate-pair', text: 'A surrogate key per row, looked up by the pair (source, source_id)', isCorrect: true },
      { id: 'offset', text: 'The shop\'s id as it is, and the CRM\'s id plus 1,000,000 as the key', isCorrect: false },
      { id: 'email', text: 'The customer\'s email address, used as the key for both of the systems', isCorrect: false },
      { id: 'two-dims', text: 'Two separate dimensions, one per system, each keyed by its own id', isCorrect: false },
    ],
    reasons: [
      { id: 'unique-stable', text: 'The pair is unique however each source numbers rows, and the warehouse key holds if a source changes', isCorrect: true },
      { id: 'offset-visible', text: 'An offset keeps each source\'s id readable in the key, so loads need no lookup to find a customer\'s row', isCorrect: false },
      { id: 'email-stable', text: 'An email is the same in both systems, so it is a stable key that joins the two sources without a lookup', isCorrect: false },
      { id: 'per-source', text: 'Keeping each source in its own dimension keeps their facts correct, and reports can union the two', isCorrect: false },
    ],
    explanation:
      'Each source\'s id is unique only inside it, so the natural key is the pair (source, source_id), and the warehouse gives each row its own surrogate key that facts store. Matching the same person across systems is then a separate, explicit step.\n' +
      'An offset breaks the day a source passes it, emails change and are sometimes missing or shared, and two dimensions make every customer report a union that double counts people in both.',
  },
  {
    id: 'de-skey-6',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_NATURAL_SURROGATE_KEYS,
    course: DE,
    question:
      'The shop reuses the SKU of a discontinued product for a new one. Reports compare product sales across years.\n' +
      'How should dim_product handle the reused SKU, and why?',
    decisions: [
      { id: 'new-row', text: 'Add a new row with its own surrogate key, and keep the SKU as a column', isCorrect: true },
      { id: 'overwrite', text: 'Overwrite the row that has the SKU with the new product\'s name and category', isCorrect: false },
      { id: 'suffix', text: 'Change the old product\'s SKU in the warehouse to K-100-OLD, then load the new one', isCorrect: false },
      { id: 'reject', text: 'Refuse to load the new product until the shop gives it an unused SKU', isCorrect: false },
    ],
    reasons: [
      { id: 'history-stays', text: 'Old sales keep the old product\'s key, so their history stays put, and new sales get the new key', isCorrect: true },
      { id: 'latest-wins', text: 'A dimension holds the latest description of each SKU, and the old product has been taken off sale', isCorrect: false },
      { id: 'sku-unique', text: 'A SKU has to stay unique in the dimension, so the old one is renamed before the new one is loaded', isCorrect: false },
      { id: 'source-fix', text: 'A reused code is an error in the source, and the warehouse should not model the source\'s errors', isCorrect: false },
    ],
    explanation:
      'With a surrogate key, the SKU is just an attribute that two rows can share; each fact stores the key of the product it sold, so the kettle\'s sales stay with the kettle.\n' +
      'Overwriting moves old sales to the new product, renaming the old SKU in the warehouse breaks lookups from facts that still arrive with it, and the shop reusing codes is a fact of the source that the warehouse has to cope with.',
  },
  {
    id: 'de-skey-7',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_NATURAL_SURROGATE_KEYS,
    course: DE,
    language: CodeLanguage.SQL,
    question: 'Put the steps of loading a batch of orders into fact_orders in order. Two steps do not belong.',
    correctOrder: [
      'Add the batch\'s new customers to dim_customer, each with a new customer_key',
      'Look up each staged order\'s customer_key by (source, source_id)',
      'Give orders whose customer is not found the unknown key -1, and log them',
      'Insert the orders into fact_orders with customer_key, not the source\'s id',
      'Check that fact_orders gained as many rows as the batch has orders',
    ],
    distractorLines: [
      'Store the source\'s customer id on each fact row and join on it in reports',
      'Skip the orders whose customer is not in dim_customer yet',
    ],
    solution: steps([
      'Add the batch\'s new customers to dim_customer, each with a new customer_key',
      'Look up each staged order\'s customer_key by (source, source_id)',
      'Give orders whose customer is not found the unknown key -1, and log them',
      'Insert the orders into fact_orders with customer_key, not the source\'s id',
      'Check that fact_orders gained as many rows as the batch has orders',
    ]),
    explanation:
      'Dimensions load first, so that the lookup finds the new customers; the lookup uses the full natural key; a miss goes to the unknown member so no order is lost; and the count proves nothing was dropped or doubled.\n' +
      'Facts that store the source\'s id lose the dimension\'s history and clash across sources, and skipped orders make revenue too low.',
  },
  {
    id: 'de-skey-8',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_NATURAL_SURROGATE_KEYS,
    course: DE,
    question:
      'dim_customer keeps a row per version of a customer: C-7 moved from Leeds to York, so it has two. fact_sales stores the source\'s customer_id, not a surrogate key.\n' +
      'What total does the report query return?',
    tables: [
      table('dim_customer', ['customer_key', 'customer_id', 'city', 'is_current'], [
        [1, 'C-7', 'Leeds', 0],
        [2, 'C-7', 'York', 1],
        [3, 'C-9', 'Hull', 1],
      ]),
      table('fact_sales', ['sale_id', 'customer_id', 'amount'], [
        [1, 'C-7', 40],
        [2, 'C-7', 25],
        [3, 'C-9', 50],
      ]),
    ],
    code:
      'SELECT SUM(f.amount)\n' +
      'FROM fact_sales f\n' +
      'JOIN dim_customer d ON d.customer_id = f.customer_id;',
    language: CodeLanguage.SQL,
    answer: '180',
    tempting: [
      { answer: '115', why: '115 is what was sold. customer_id is not unique in a dimension that keeps history, so each C-7 sale matches both of its rows.' },
      { answer: '230', why: 'Only C-7 has two versions. C-9\'s sale matches one row.' },
    ],
    explanation:
      'C-7\'s two sales each join to both versions: (40 + 25) x 2 = 130, plus C-9\'s 50, so 180 instead of 115.\n' +
      'Once a dimension keeps versions, the natural key is no longer unique in it. Facts store the surrogate key of the version true at the sale, and join on that.',
  },
  {
    id: 'de-skey-9',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_NATURAL_SURROGATE_KEYS,
    course: DE,
    question:
      'Sales must be reported by the customer\'s details as they were at the time of each sale. Customers move and change segment; the dimension has 30 attributes and keeps a row per version; analysts group by any of them.\n' +
      'What should each fact row store, and why?',
    decisions: [
      { id: 'version-key', text: 'The surrogate key of the customer version current at the sale', isCorrect: true },
      { id: 'id-current', text: 'The customer_id, joined in reports to the customer\'s current row', isCorrect: false },
      { id: 'id-overwrite', text: 'The customer_id, with the dimension overwriting a row that changes', isCorrect: false },
      { id: 'email', text: 'The customer\'s email, a key that stays the same when they move', isCorrect: false },
    ],
    reasons: [
      { id: 'own-row', text: 'Each version is a row with its own key, so a sale is tied to the version that was true when it happened', isCorrect: true },
      { id: 'id-unique', text: 'customer_id stays unique in a dimension that keeps history, so it joins each sale to one version', isCorrect: false },
      { id: 'current-best', text: 'The current row holds the customer\'s latest and most accurate details, which is what reports should use', isCorrect: false },
      { id: 'smaller', text: 'A surrogate key is smaller than customer_id, so the fact table takes less space and joins cost less', isCorrect: false },
    ],
    explanation:
      'History in a dimension means several rows per customer, so the natural key no longer picks one; the surrogate key does. The load looks up the version current at the sale and stores its key, and every one of the 30 attributes is then as it was.\n' +
      'Joining to the current row, or overwriting, reports old sales under today\'s details; an email changes too; and a smaller key is a side benefit, not why it is needed.',
  },
  {
    id: 'de-skey-10',
    type: QuestionType.SPOT_FLAW,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_NATURAL_SURROGATE_KEYS,
    course: DE,
    question:
      'Since the app\'s customers were added to dim_customer, some orders appear twice in fact_orders, once against a customer who never placed them.\n' +
      'Click the line that causes it.',
    language: CodeLanguage.SQL,
    lines: [
      'INSERT INTO fact_orders (order_id, customer_key, amount)',
      'SELECT o.order_id, c.customer_key, o.amount',
      'FROM stg_orders o',
      'JOIN dim_customer c',
      '  ON c.source_id = o.source_customer_id',
      'WHERE o.order_date = :run_date;',
    ],
    flawLines: [5],
    note: 'dim_customer holds customers from the shop and the app. Each system numbers its own customers from 1, and both have a customer 7.',
    explanation:
      'Line 5 looks the customer up by the source\'s id alone, which is unique only inside one system, so an order from shop customer 7 matches app customer 7 as well and is inserted twice.\n' +
      'The natural key is the pair: join on c.source = o.source AND c.source_id = o.source_customer_id.',
  },
  {
    id: 'de-skey-11',
    type: QuestionType.SPOT_FLAW,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_NATURAL_SURROGATE_KEYS,
    course: DE,
    question:
      'Customers who changed their email address now show as two customers, and their lifetime value is split between the two.\n' +
      'Click the line that causes it.',
    lines: [
      'table: dim_customer',
      'key: email                       # unique in the CRM',
      'columns: customer_name, region, signup_date, crm_id',
      'loaded: nightly, upsert on key',
      'fact_orders.customer: email',
    ],
    flawLines: [2, 5],
    note: 'The CRM lets customers change their email. Its crm_id never changes.',
    explanation:
      'Line 2 makes a value the customer can change the row\'s identity, and line 5 has every order store it. After a change the upsert finds no row for the new email and inserts a second customer, and old and new orders point at different rows.\n' +
      'Identify the row by a surrogate key looked up by crm_id, the source\'s stable id, and keep email as an attribute.',
  },
  {
    id: 'de-skey-12',
    type: QuestionType.EXPLAIN,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_NATURAL_SURROGATE_KEYS,
    course: DE,
    question: 'In two or three sentences: what is the difference between a natural key and a surrogate key, and which one does a fact table store?',
    keyPoints: [
      'A natural key is the identifier the source uses, such as an order number, SKU or customer id',
      'A surrogate key is a meaningless number the warehouse assigns to each dimension row, once',
      'The fact stores the surrogate key, looked up by the natural key when the fact is loaded',
    ],
    modelAnswer:
      'A natural key is the identifier the source system uses, such as a SKU or customer id, while a surrogate key is a number the warehouse assigns to each dimension row and never changes. ' +
      'The fact table stores the surrogate key, which the load finds by looking up the row\'s natural key, so the natural key stays on the dimension as an ordinary column.',
    explanation: 'The natural key finds the row; the surrogate key is the row.',
  },
  {
    id: 'de-skey-13',
    type: QuestionType.EXPLAIN,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_NATURAL_SURROGATE_KEYS,
    course: DE,
    question: 'In two or three sentences: why does a dimension that keeps history need surrogate keys, and what goes wrong if facts join to it on the natural key?',
    keyPoints: [
      'Keeping history gives one real-world customer several rows, one per version',
      'The natural key is then no longer unique, so each version needs its own surrogate key',
      'A fact joined on the natural key matches every version, which double counts it and loses which version was true at the time',
    ],
    modelAnswer:
      'When a dimension keeps history, one customer has a row for each version, so the natural key repeats and each version needs its own surrogate key. ' +
      'Facts store the key of the version that was current when they happened; a fact joined on the natural key instead matches every version, so its measures are counted once per version and it is no longer tied to the details true at the time.',
    explanation: 'This is why slowly changing dimensions of Type 2 are built on surrogate keys.',
  },
];

// ════════════════════════════════════════════════════════════════════════
// Slowly Changing Dimensions & Point-in-Time Joins
// ════════════════════════════════════════════════════════════════════════

const history: Question[] = [
  {
    id: 'de-history-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_SCD_POINT_IN_TIME,
    course: DE,
    question: 'dim_customer tracks city as Type 2. What happens to it when a customer moves from Leeds to York?',
    options: [
      { id: 'a', text: 'The row\'s city is set to York, and the old value is kept in a previous_city column beside it', isCorrect: false },
      { id: 'b', text: 'The row\'s city is set to York, so each of the customer\'s past sales now reports under York', isCorrect: false },
      { id: 'c', text: 'A York row is added with the same key as the Leeds row, so that facts can find both versions', isCorrect: false },
      { id: 'd', text: 'The Leeds row gets an end date, and a York row with a new key starts on the date of the move', isCorrect: true },
    ],
    explanation:
      'Type 2 keeps history as rows: the current row gets an end date (and is no longer current), and a new row, with a new surrogate key, starts on the date of the change. Facts point at whichever version was true when they happened.\n' +
      'A previous_city column is Type 3 (one step of history); overwriting is Type 1 (no history); and two versions cannot share a key, or a fact would match both.',
  },
  {
    id: 'de-history-2',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_SCD_POINT_IN_TIME,
    course: DE,
    question:
      'C-7 lived in Leeds until moving to York on 2026-06-01. dim_customer is Type 1, so the move overwrote C-7\'s city. Sales by city for the first half of 2026 are below.\n' +
      'What revenue does the query return for Leeds?',
    tables: [
      table('dim_customer', ['customer_id', 'city'], [
        ['C-7', 'York'],
        ['C-9', 'Leeds'],
      ]),
      table('fact_sales', ['sale_id', 'customer_id', 'sale_date', 'amount'], [
        [1, 'C-7', '2026-03-10', 40],
        [2, 'C-7', '2026-05-20', 25],
        [3, 'C-9', '2026-04-02', 50],
        [4, 'C-7', '2026-09-15', 30],
      ]),
    ],
    code:
      'SELECT SUM(f.amount)\n' +
      'FROM fact_sales f\n' +
      'JOIN dim_customer d ON d.customer_id = f.customer_id\n' +
      'WHERE d.city = \'Leeds\' AND f.sale_date < \'2026-07-01\';',
    language: CodeLanguage.SQL,
    answer: '50',
    tempting: [
      { answer: '115', why: '115 is what Leeds customers really bought in the first half. The overwrite moved C-7\'s March and May sales to York.' },
      { answer: '0', why: 'C-9 still lives in Leeds, so its April sale is counted.' },
    ],
    explanation:
      'With Type 1 there is one row per customer holding today\'s city, so every past sale of C-7 reports under York. Leeds keeps only C-9\'s 50, though 40 + 25 of C-7\'s sales were made while it lived there.\n' +
      'If past sales must stay where they were made, the attribute needs Type 2.',
  },
  {
    id: 'de-history-3',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_SCD_POINT_IN_TIME,
    course: DE,
    question:
      'dim_customer keeps C-7\'s versions with half-open intervals: a version holds from valid_from up to, but not including, valid_to. Sale 2 was made on the day of the move.\n' +
      'Which city does the query give for sale 2?',
    tables: [
      table('dim_customer', ['customer_key', 'customer_id', 'city', 'valid_from', 'valid_to'], [
        [1, 'C-7', 'Leeds', '2025-01-01', '2026-06-01'],
        [2, 'C-7', 'York', '2026-06-01', '9999-12-31'],
      ]),
      table('fact_sales', ['sale_id', 'customer_id', 'sale_date', 'amount'], [
        [1, 'C-7', '2026-05-31', 40],
        [2, 'C-7', '2026-06-01', 25],
      ]),
    ],
    code:
      'SELECT d.city\n' +
      'FROM fact_sales f\n' +
      'JOIN dim_customer d\n' +
      '  ON d.customer_id = f.customer_id\n' +
      ' AND f.sale_date >= d.valid_from\n' +
      ' AND f.sale_date <  d.valid_to\n' +
      'WHERE f.sale_id = 2;',
    language: CodeLanguage.SQL,
    answer: 'York',
    tempting: [
      { answer: 'Leeds', why: 'The Leeds version ends on 2026-06-01 but does not include it (sale_date < valid_to), so only the York version holds that day.' },
    ],
    explanation:
      'On 2026-06-01 the Leeds interval is over (2026-06-01 is not < 2026-06-01) and the York interval has begun (2026-06-01 >= 2026-06-01), so exactly one version matches: York.\n' +
      'Half-open intervals put every date in exactly one version, including the day of a change.',
  },
  {
    id: 'de-history-4',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_SCD_POINT_IN_TIME,
    course: DE,
    question:
      'dim_customer tracks city as Type 2 and email as Type 1. The nightly load applies the staged batch below: a changed city closes the current row and adds a version, a changed email is overwritten in place, and a new customer gets one row.\n' +
      'How many rows does dim_customer hold after the load?',
    tables: [
      table('dim_customer', ['customer_key', 'customer_id', 'city', 'email', 'valid_from', 'valid_to'], [
        [1, 'C-1', 'Leeds', 'ana@mail.com', '2025-01-01', '9999-12-31'],
        [2, 'C-2', 'York', 'ben@mail.com', '2025-01-01', '9999-12-31'],
        [3, 'C-3', 'Hull', 'cy@mail.com', '2025-01-01', '9999-12-31'],
      ]),
      table('stg_customers', ['customer_id', 'city', 'email'], [
        ['C-1', 'Bath', 'ana@mail.com'],
        ['C-2', 'York', 'ben.k@mail.com'],
        ['C-3', 'Leeds', 'cy.h@mail.com'],
        ['C-4', 'Hull', 'dee@mail.com'],
      ]),
    ],
    code:
      'city:  type 2    # close the current row, add a new version\n' +
      'email: type 1    # overwrite in place',
    answer: '6',
    unit: 'rows',
    tempting: [
      { answer: '7', why: '7 versions the email change of C-2 too. Email is Type 1: it is overwritten on C-2\'s row, with no new one.' },
      { answer: '4', why: '4 is one row per customer, which is Type 1 for everything. City is Type 2, so a move adds a row and keeps the old one.' },
    ],
    explanation:
      'C-1 and C-3 changed city, so each gets a new version (+2); C-2 changed only its email, which is overwritten (+0); C-4 is new (+1): 3 + 2 + 1 = 6 rows, 4 of them current.\n' +
      'The type is chosen per attribute, so a batch with both kinds of change grows the dimension only for the tracked ones.',
  },
  {
    id: 'de-history-5',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_SCD_POINT_IN_TIME,
    course: DE,
    question:
      'A customer\'s surname was misspelt when they signed up, and support has corrected it in the CRM. dim_customer keeps history for city and segment.\n' +
      'How should the correction reach dim_customer, and why?',
    decisions: [
      { id: 'overwrite', text: 'Overwrite the surname on all the customer\'s rows (Type 1)', isCorrect: true },
      { id: 'version', text: 'Close the current row and add a corrected version (Type 2)', isCorrect: false },
      { id: 'prev-col', text: 'Keep the misspelling in a previous_surname column (Type 3)', isCorrect: false },
      { id: 'leave', text: 'Leave the warehouse as it is, since the CRM holds the fix', isCorrect: false },
    ],
    reasons: [
      { id: 'never-true', text: 'The misspelling was never true, so no past sale should be reported under that name', isCorrect: true },
      { id: 'version-all', text: 'Each change a dimension receives should be versioned, so its history stays whole', isCorrect: false },
      { id: 'key-change', text: 'Overwriting a row changes its surrogate key, so past sales would lose their customer', isCorrect: false },
      { id: 'audit', text: 'An audit has to be able to see the misspelt name in the reports of that time', isCorrect: false },
    ],
    explanation:
      'A correction fixes a value that was wrong all along, so overwriting it everywhere is right: every report, old or new, should show the correct name.\n' +
      'A Type 2 version would split the customer\'s sales at an invented date, overwriting a column does not touch the key, and an audit trail belongs in the source\'s change log, not in report history.',
  },
  {
    id: 'de-history-6',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_SCD_POINT_IN_TIME,
    course: DE,
    question:
      'dim_product has category and list_price. Merchandisers move products between categories a few times a year, and reports compare category sales across years. The price a customer paid is stored on each sale; list_price is only shown in the catalogue report.\n' +
      'Which change types should the two attributes get, and why?',
    decisions: [
      { id: 'cat2-price1', text: 'category Type 2, list_price Type 1', isCorrect: true },
      { id: 'both2', text: 'category Type 2, list_price Type 2', isCorrect: false },
      { id: 'both1', text: 'category Type 1, list_price Type 1', isCorrect: false },
      { id: 'cat1-price2', text: 'category Type 1, list_price Type 2', isCorrect: false },
    ],
    reasons: [
      { id: 'per-attribute', text: 'Past sales should keep the category they were sold in, and each sale already has its price paid', isCorrect: true },
      { id: 'price-often', text: 'Prices change more often than categories, so the price is the attribute that most needs its history', isCorrect: false },
      { id: 'rebuild', text: 'Type 1 keeps the dimension small, and old categories can be rebuilt later from the sales themselves', isCorrect: false },
      { id: 'version-cheap', text: 'A version costs one row, so tracking each attribute keeps the most history at almost no cost', isCorrect: false },
    ],
    explanation:
      'Decide per attribute: should past events report under the value true then? For category, yes, or last year\'s Kitchen sales move to wherever the product is today. For list_price, no: the price paid is a measure on the sale, and the catalogue wants today\'s price.\n' +
      'Versioning a price that changes weekly multiplies rows for nothing, and sales do not record their category, so it cannot be rebuilt from them.',
  },
  {
    id: 'de-history-7',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_SCD_POINT_IN_TIME,
    course: DE,
    language: CodeLanguage.SQL,
    question: 'Put the steps of a nightly Type 2 load of dim_customer in order. Two steps do not belong.',
    correctOrder: [
      'Find the staged customers whose tracked columns differ from their current row',
      'Close each one\'s current row: set valid_to to the change date',
      'Insert its new version with a new key, valid from the change date to 9999-12-31',
      'Check that every customer_id now has exactly one open row',
    ],
    distractorLines: [
      'Update the tracked columns on the current row to the new values',
      'Delete the closed row once its new version has been inserted',
    ],
    solution: steps([
      'Find the staged customers whose tracked columns differ from their current row',
      'Close each one\'s current row: set valid_to to the change date',
      'Insert its new version with a new key, valid from the change date to 9999-12-31',
      'Check that every customer_id now has exactly one open row',
    ]),
    explanation:
      'Only changed customers get a new version; the old row is closed at the change date and the new one opens on it, so the intervals meet without a gap or overlap; one open row per customer is the invariant to check.\n' +
      'Updating in place is Type 1, and deleting the closed row throws away the history the load exists to keep.',
  },
  {
    id: 'de-history-8',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_SCD_POINT_IN_TIME,
    course: DE,
    question:
      'C-7 moved from Leeds to York on 2026-06-01. Sale 4, made on 2026-05-28 at a store that uploads weekly, arrives on 2026-06-03 and is loaded with the job below. The city report then sums May sales.\n' +
      'What May revenue does the report show for Leeds?',
    tables: [
      table('dim_customer', ['customer_key', 'customer_id', 'city', 'valid_from', 'valid_to', 'is_current'], [
        [1, 'C-7', 'Leeds', '2025-01-01', '2026-06-01', 0],
        [2, 'C-7', 'York', '2026-06-01', '9999-12-31', 1],
        [3, 'C-9', 'Leeds', '2025-03-01', '9999-12-31', 1],
      ]),
      table('fact_sales', ['sale_id', 'customer_key', 'sale_date', 'amount'], [
        [1, 1, '2026-05-10', 40],
        [2, 3, '2026-05-12', 50],
        [3, 2, '2026-06-20', 30],
      ]),
      table('stg_sales', ['sale_id', 'customer_id', 'sale_date', 'amount'], [
        [4, 'C-7', '2026-05-28', 60],
      ]),
    ],
    code:
      'INSERT INTO fact_sales (sale_id, customer_key, sale_date, amount)\n' +
      'SELECT s.sale_id, d.customer_key, s.sale_date, s.amount\n' +
      'FROM stg_sales s\n' +
      'JOIN dim_customer d ON d.customer_id = s.customer_id AND d.is_current = 1;\n' +
      '\n' +
      '-- the city report\n' +
      'SELECT d.city, SUM(f.amount) AS revenue\n' +
      'FROM fact_sales f JOIN dim_customer d ON d.customer_key = f.customer_key\n' +
      'WHERE f.sale_date BETWEEN \'2026-05-01\' AND \'2026-05-31\'\n' +
      'GROUP BY d.city;',
    language: CodeLanguage.SQL,
    answer: '90',
    tempting: [
      { answer: '150', why: '150 is right for May: C-7 lived in Leeds on 2026-05-28. But the load took C-7\'s current row, York, so sale 4 went to York.' },
      { answer: '60', why: '60 is sale 4 alone. Sales 1 and 2 were already in May under Leeds.' },
    ],
    explanation:
      'The load looks up the current version, so the late May sale gets York\'s key and the report shows Leeds 40 + 50 = 90 and York 60 for May, though C-7 lived in Leeds that day.\n' +
      'Look up the version by the event\'s date, not by is_current: valid_from <= sale_date < valid_to. Then a late or backfilled fact lands on the version true when it happened.',
  },
  {
    id: 'de-history-9',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_SCD_POINT_IN_TIME,
    course: DE,
    question:
      'An old fact table stores customer_id, not a surrogate key. Revenue must be reported by the customer\'s segment at the time of each sale; dim_customer keeps segment as Type 2 with half-open intervals; and last year\'s sales are about to be backfilled.\n' +
      'How should the report find each sale\'s segment, and why?',
    decisions: [
      { id: 'pit', text: 'Join on customer_id and valid_from <= sale_date < valid_to', isCorrect: true },
      { id: 'current', text: 'Join on customer_id and keep the row where is_current = 1', isCorrect: false },
      { id: 'between', text: 'Join on customer_id and sale_date BETWEEN valid_from AND valid_to', isCorrect: false },
      { id: 'copy-at-load', text: 'Copy the segment onto each sale at load, from the current row', isCorrect: false },
    ],
    reasons: [
      { id: 'one-version', text: 'Exactly one version\'s half-open interval holds each date, so each sale matches the row true on its date', isCorrect: true },
      { id: 'settled', text: 'The current row holds the customer\'s settled segment, which is the one that reports should be using', isCorrect: false },
      { id: 'both-ends', text: 'BETWEEN includes both ends, so a sale on the day of a change is matched to the version it belongs to', isCorrect: false },
      { id: 'load-order', text: 'Copying at load ties each sale to its version, since a backfill loads the sales in the order they happened', isCorrect: false },
    ],
    explanation:
      'A point-in-time join picks the version whose interval holds the event date. With half-open intervals each date is in exactly one version, so there is one match per sale, the right one.\n' +
      'The current row reports history under today\'s segment; BETWEEN matches both versions on the change day and double counts; and a backfill runs today, so copying from the current row stamps last year\'s sales with this year\'s segment.',
  },
  {
    id: 'de-history-10',
    type: QuestionType.SPOT_FLAW,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_SCD_POINT_IN_TIME,
    course: DE,
    question:
      'dim_customer grows by the whole customer list every night, and every customer gets a new version each day, though few of them change.\n' +
      'Click the line that causes it.',
    language: CodeLanguage.SQL,
    lines: [
      '-- nightly Type 2 load of dim_customer',
      'UPDATE dim_customer',
      'SET valid_to = :run_date, is_current = 0',
      'WHERE is_current = 1',
      '  AND customer_id IN (SELECT customer_id FROM stg_customers);',
      'INSERT INTO dim_customer (customer_id, city, segment, valid_from, valid_to, is_current)',
      'SELECT customer_id, city, segment, :run_date, \'9999-12-31\', 1',
      'FROM stg_customers;',
    ],
    flawLines: [5, 8],
    note: 'stg_customers holds every customer in the CRM each night, changed or not.',
    explanation:
      'Lines 5 and 8 take every staged customer, not only those whose tracked columns changed, so each night closes every current row and inserts a copy of it. History fills with versions that differ in nothing but their dates.\n' +
      'Compare each staged row with its current row first, and close and insert only where city or segment differs.',
  },
  {
    id: 'de-history-11',
    type: QuestionType.SPOT_FLAW,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_SCD_POINT_IN_TIME,
    course: DE,
    question:
      'Revenue by city adds up to a little more than total sales, and the excess always comes from sales made on a day when a customer moved.\n' +
      'Click the line that causes it.',
    language: CodeLanguage.SQL,
    lines: [
      'SELECT d.city, SUM(f.amount) AS revenue',
      'FROM fact_sales f',
      'JOIN dim_customer d',
      '  ON d.customer_id = f.customer_id',
      ' AND f.sale_date BETWEEN d.valid_from AND d.valid_to',
      'GROUP BY d.city;',
    ],
    flawLines: [5],
    note: 'When a customer moves, the old row\'s valid_to and the new row\'s valid_from are both the move date.',
    explanation:
      'Line 5 uses BETWEEN, which includes both ends, so on a move date a sale is inside the old interval (it ends that day) and the new one (it starts that day), matches two versions, and is counted twice.\n' +
      'Treat the intervals as half-open: f.sale_date >= d.valid_from AND f.sale_date < d.valid_to.',
  },
  {
    id: 'de-history-12',
    type: QuestionType.EXPLAIN,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_SCD_POINT_IN_TIME,
    course: DE,
    question: 'In two or three sentences: when should a dimension attribute be Type 1 and when Type 2? Give an example of each.',
    keyPoints: [
      'Type 2 when past events should keep the value that was true when they happened, such as a customer\'s region or a product\'s category',
      'Type 1 when only the latest value matters or the change is a correction, such as a fixed misspelling',
      'The choice is made per attribute, by asking how reports about the past should read',
    ],
    modelAnswer:
      'Use Type 2 when reports about the past should keep the value that was true at the time, such as the region a customer lived in when they bought. ' +
      'Use Type 1, an overwrite, when only the current value matters or the change corrects a mistake, such as a misspelt name, and make the choice for each attribute separately.',
    explanation: 'The question to ask is how a report about last year should read after the change.',
  },
  {
    id: 'de-history-13',
    type: QuestionType.EXPLAIN,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_SCD_POINT_IN_TIME,
    course: DE,
    question: 'In two or three sentences: what is a point-in-time join, and why are a version\'s validity intervals made half-open?',
    keyPoints: [
      'A point-in-time join matches each event to the version of the dimension row that was valid on the event\'s date',
      'A half-open interval includes valid_from and excludes valid_to, and the current version ends on a far-future date',
      'Half-open intervals put every date, including the change date, in exactly one version, so no event matches two',
    ],
    modelAnswer:
      'A point-in-time join matches each event to the dimension version whose interval holds the event\'s date, so it reads the details as they were then. ' +
      'Intervals include their start and exclude their end, with the current version ending on a far-future date, so the change date belongs to exactly one version and no event is matched twice or not at all.',
    explanation: 'The same join is how late facts, backfills and training data for models find the values true at the time.',
  },
];

// ════════════════════════════════════════════════════════════════════════
// Metrics & Ownership: Semantic Layer & Data Mesh
// ════════════════════════════════════════════════════════════════════════

const metrics: Question[] = [
  {
    id: 'de-metric-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_METRICS_OWNERSHIP,
    course: DE,
    question: 'A company puts a semantic layer between its warehouse tables and its dashboards. What does that layer add?',
    options: [
      { id: 'a', text: 'A cache of each dashboard\'s query results, so a chart loads faster the second time it is opened', isCorrect: false },
      { id: 'b', text: 'A copy of the warehouse tables with friendlier names, which each team edits for its own reports', isCorrect: false },
      { id: 'c', text: 'One definition of each metric, which every tool asks for instead of writing the metric\'s SQL', isCorrect: true },
      { id: 'd', text: 'A tool that draws charts straight from the tables, so analysts can explore without writing SQL', isCorrect: false },
    ],
    explanation:
      'A semantic layer holds the definitions of metrics (revenue, active customers) and the dimensions they can be cut by, once. Dashboards, notebooks and spreadsheets ask it for "revenue by month", so they all compute the same number.\n' +
      'Caching is a performance feature, team-edited copies are how numbers drift apart, and a charting tool is a consumer of the layer, not the layer.',
  },
  {
    id: 'de-metric-2',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_METRICS_OWNERSHIP,
    course: DE,
    question:
      'Two dashboards both show "October revenue", each with its own SQL.\n' +
      'How much higher is dashboard A\'s number than dashboard B\'s?',
    tables: [
      table('orders', ['order_id', 'order_date', 'status', 'amount'], [
        [1, '2026-10-03', 'paid', 120],
        [2, '2026-10-11', 'refunded', 45],
        [3, '2026-10-19', 'paid', 80],
        [4, '2026-10-27', 'cancelled', 30],
      ]),
    ],
    code:
      '-- dashboard A\n' +
      'SELECT SUM(amount) FROM orders\n' +
      'WHERE order_date BETWEEN \'2026-10-01\' AND \'2026-10-31\';\n' +
      '\n' +
      '-- dashboard B\n' +
      'SELECT SUM(amount) FROM orders\n' +
      'WHERE order_date BETWEEN \'2026-10-01\' AND \'2026-10-31\'\n' +
      '  AND status = \'paid\';',
    language: CodeLanguage.SQL,
    answer: '75',
    tempting: [
      { answer: '45', why: '45 is the refunded order alone. Dashboard A also counts the cancelled order of 30.' },
      { answer: '275', why: '275 is dashboard A\'s number. The question asks for the gap between the two.' },
    ],
    explanation:
      'A sums every October order (275); B only paid ones (200). The gap of 75 is the refunded and the cancelled orders, which A counts as revenue.\n' +
      'Both are called revenue, and neither errors. Two definitions of one name give two numbers, which is the problem one shared definition solves.',
  },
  {
    id: 'de-metric-3',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.DE_METRICS_OWNERSHIP,
    course: DE,
    question:
      'The shared definition of active customers is below. It is computed as of 2026-11-08.\n' +
      'How many active customers does it give?',
    tables: [
      table('orders', ['order_id', 'customer_id', 'order_date', 'status'], [
        [1, 'c1', '2026-11-07', 'paid'],
        [2, 'c1', '2026-11-01', 'paid'],
        [3, 'c2', '2026-10-09', 'paid'],
        [4, 'c3', '2026-10-10', 'paid'],
        [5, 'c4', '2026-11-02', 'refunded'],
        [6, 'c5', '2026-11-08', 'paid'],
        [7, 'c4', '2026-10-20', 'paid'],
      ]),
    ],
    code:
      'metric: active_customers\n' +
      'measure: COUNT(DISTINCT customer_id)\n' +
      'filter: status = \'paid\'\n' +
      'window: order_date > as_of - 30 days AND order_date <= as_of',
    answer: '4',
    tempting: [
      { answer: '5', why: '5 counts paid orders in the window; c1 has two, and the measure counts distinct customers. (c2\'s order, on 2026-10-09, is not after as_of - 30 days, so it is out.)' },
      { answer: '3', why: 'c4\'s refunded order does not count, but its paid order on 2026-10-20 does.' },
    ],
    explanation:
      'The window is 2026-10-10 to 2026-11-08. Paid orders in it come from c1 (twice), c3, c4 (its 2026-10-20 order) and c5: 4 distinct customers. c2 is one day too early.\n' +
      'A metric is its whole definition, measure, filter and window. Written down once, everyone gets 4; left to each report, the edges come out differently.',
  },
  {
    id: 'de-metric-4',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_METRICS_OWNERSHIP,
    course: DE,
    question:
      'Revenue is defined once, as the view below. On 2026-11-05 finance changed it to leave out test orders. The ops dashboard reads the view; the marketing dashboard holds a copy of the view\'s SQL, pasted in October.\n' +
      'What November revenue does the marketing dashboard show?',
    tables: [
      table('orders', ['order_id', 'order_date', 'status', 'is_test', 'amount'], [
        [1, '2026-11-01', 'paid', 0, 100],
        [2, '2026-11-02', 'paid', 1, 500],
        [3, '2026-11-03', 'paid', 0, 60],
        [4, '2026-11-04', 'refunded', 0, 40],
      ]),
    ],
    code:
      '-- the shared definition, changed on 2026-11-05\n' +
      'CREATE VIEW revenue AS\n' +
      'SELECT order_date, amount FROM orders\n' +
      'WHERE status = \'paid\' AND is_test = 0;\n' +
      '\n' +
      '-- marketing\'s dashboard: the definition as pasted in October\n' +
      'SELECT SUM(amount) FROM orders\n' +
      'WHERE status = \'paid\';',
    language: CodeLanguage.SQL,
    answer: '660',
    tempting: [
      { answer: '160', why: '160 is the ops dashboard, which reads the view. Marketing\'s pasted copy did not get the change, so it still counts the 500 test order.' },
      { answer: '700', why: 'The pasted SQL keeps status = \'paid\', so the refunded order of 40 is still left out.' },
    ],
    explanation:
      'The copy still has the October definition: paid orders, test or not, 100 + 500 + 60 = 660, while the view now gives 160. One fix to the definition reached only the dashboards that read it.\n' +
      'A shared definition only stays shared if consumers query it; a pasted copy is a second definition from the day it is pasted.',
  },
  {
    id: 'de-metric-5',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_METRICS_OWNERSHIP,
    course: DE,
    question:
      'Marketing, sales and finance each have a revenue dashboard with its own SQL, and their numbers differ by up to 8%. The CFO asks for one revenue number.\n' +
      'What should the data team do, and why?',
    decisions: [
      { id: 'define-once', text: 'Define revenue once in owned, shared code, and point the dashboards at it', isCorrect: true },
      { id: 'paste', text: 'Take finance\'s SQL and paste it into the marketing and sales dashboards', isCorrect: false },
      { id: 'footnote', text: 'Add a note to each dashboard that explains how its revenue is calculated', isCorrect: false },
      { id: 'fourth', text: 'Build a fourth dashboard for the CFO that shows the three numbers side by side', isCorrect: false },
    ],
    reasons: [
      { id: 'one-place', text: 'One definition gives one number, and a later fix to it reaches every dashboard at the same time', isCorrect: true },
      { id: 'copies-equal', text: 'Copies of the same SQL return the same result, so pasting finance\'s query settles the gap for good', isCorrect: false },
      { id: 'different-q', text: 'Each team\'s revenue answers its own question, so the same name on the three dashboards is not a problem', isCorrect: false },
      { id: 'rounding', text: 'The gaps come from each dashboard tool rounding differently, so explaining that is enough for the CFO', isCorrect: false },
    ],
    explanation:
      'The numbers differ because the definitions differ. Agree one definition, write it once in version-controlled code with an owner and tests, and have every dashboard query it.\n' +
      'Pasted copies drift as soon as one is edited; different questions deserve different names (gross bookings, net revenue), not one name with three meanings; and an 8% gap is not rounding.',
  },
  {
    id: 'de-metric-6',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_METRICS_OWNERSHIP,
    course: DE,
    question:
      'A 40-person startup has one data team of three, which keeps up with requests. A new hire suggests adopting data mesh.\n' +
      'What should the company do, and why?',
    decisions: [
      { id: 'central', text: 'Keep the central team, with a named owner for each table', isCorrect: true },
      { id: 'mesh', text: 'Adopt data mesh now, with a data product per product team', isCorrect: false },
      { id: 'analysts', text: 'Let each analyst own the tables that their reports need', isCorrect: false },
      { id: 'tool', text: 'Buy a data mesh platform, then decide who owns the data', isCorrect: false },
    ],
    reasons: [
      { id: 'cost', text: 'With few domains the team keeps up, and a mesh\'s platform and standards cost more than they save', isCorrect: true },
      { id: 'early', text: 'Data mesh is a set of tools, so adopting it early means there is less of a migration to do later on', isCorrect: false },
      { id: 'any-size', text: 'Domain teams know their own data best, so handing them ownership pays off even at a small company', isCorrect: false },
      { id: 'no-owner', text: 'Ownership slows a small team down, so tables are better left without owners until the company grows', isCorrect: false },
    ],
    explanation:
      'Data mesh answers a scaling problem: many domains and a central team that has become a bottleneck. Three people who keep up have no such bottleneck, and the self-serve platform and federated standards a mesh needs would cost more than they save.\n' +
      'Mesh is an organisational choice, not a product, and clear owners help at any size.',
  },
  {
    id: 'de-metric-7',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_METRICS_OWNERSHIP,
    course: DE,
    language: CodeLanguage.SQL,
    question: 'Finance wants revenue to leave out test orders. Put the steps of changing the shared definition in order. Two steps do not belong.',
    correctOrder: [
      'Change the metric\'s definition in its code, on a branch',
      'Run its tests and compare old and new numbers for the past year',
      'Get the change reviewed and approved by the metric\'s owner',
      'Merge it, so that every dashboard reads the new definition',
    ],
    distractorLines: [
      'Edit the SQL inside each dashboard that shows revenue',
      'Change the definition in production, then fix the reports that break',
    ],
    solution: steps([
      'Change the metric\'s definition in its code, on a branch',
      'Run its tests and compare old and new numbers for the past year',
      'Get the change reviewed and approved by the metric\'s owner',
      'Merge it, so that every dashboard reads the new definition',
    ]),
    explanation:
      'A metric defined as code changes like code: a branch, tests and a comparison that shows what moves and by how much, approval from its owner, then one merge that every consumer picks up.\n' +
      'Editing each dashboard makes as many definitions as dashboards, and changing production first lets every report show the untested number.',
  },
  {
    id: 'de-metric-8',
    type: QuestionType.PREDICT_OUTCOME,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_METRICS_OWNERSHIP,
    course: DE,
    question:
      'The shared definition of net revenue is below. Orders are dated by when they were paid, refunds by when they were made.\n' +
      'What is net revenue for November 2026?',
    tables: [
      table('orders', ['order_id', 'order_date', 'paid_date', 'is_test', 'amount'], [
        [1, '2026-10-30', '2026-11-02', 0, 200],
        [2, '2026-11-05', '2026-11-05', 0, 150],
        [3, '2026-11-20', '2026-12-01', 0, 90],
        [4, '2026-11-10', '2026-11-10', 1, 500],
        [5, '2026-10-15', '2026-10-15', 0, 70],
      ]),
      table('refunds', ['order_id', 'refund_date', 'amount'], [
        [5, '2026-11-03', 70],
        [2, '2026-11-25', 50],
      ]),
    ],
    code:
      'metric: net_revenue\n' +
      'measure: SUM(orders.amount) - SUM(refunds.amount)\n' +
      'time: orders by paid_date, refunds by refund_date\n' +
      'exclude: orders with is_test = 1',
    answer: '230',
    tempting: [
      { answer: '120', why: '120 dates the orders by order_date (orders 2 and 3). The definition dates orders by when they were paid: order 1 was paid in November, order 3 in December.' },
      { answer: '350', why: '350 is November\'s paid orders before refunds. The definition subtracts the refunds made in November.' },
      { answer: '730', why: '730 keeps the test order of 500. The definition leaves it out.' },
    ],
    explanation:
      'Orders paid in November, test excluded: order 1 (200) and order 2 (150), 350. Refunds made in November: 70 for order 5 (paid in October) and 50 for order 2, 120. Net revenue is 350 - 120 = 230.\n' +
      'Each part of the definition moves the number: which date, which rows, what is subtracted. That is why the definition is written down once and every report uses it.',
  },
  {
    id: 'de-metric-9',
    type: QuestionType.CHOOSE_JUSTIFY,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_METRICS_OWNERSHIP,
    course: DE,
    question:
      'A 2,000-person company has 30 product domains. Its central data team of eight has a three-month backlog, often misreads domain data, and the domains\' tables use different customer ids.\n' +
      'How should data ownership change, and why?',
    decisions: [
      { id: 'mesh', text: 'Domains own their data products on a shared platform, under common standards', isCorrect: true },
      { id: 'hire', text: 'Grow the central team until each domain has a data engineer inside the team', isCorrect: false },
      { id: 'free', text: 'Domain teams own their data, and each picks its own tools, formats and ids', isCorrect: false },
      { id: 'tickets', text: 'The central team keeps each dataset, and domains file tickets with priorities', isCorrect: false },
    ],
    reasons: [
      { id: 'know-and-join', text: 'Ownership moves to the teams that know the data, and the shared standards keep products joinable', isCorrect: true },
      { id: 'scale-hires', text: 'A central team scales with the domains, since each new hire takes over one domain\'s whole backlog', isCorrect: false },
      { id: 'freedom', text: 'Freedom to choose formats is what clears the central queue, and the joins can be fixed later on', isCorrect: false },
      { id: 'one-hand', text: 'Data mesh puts the data in one platform team\'s hands, which makes its standards easy to enforce', isCorrect: false },
    ],
    explanation:
      'Data mesh fits this case: the bottleneck is a central team without domain knowledge. Each domain owns its data as a product, a self-serve platform makes that cheap, and federated standards (shared keys such as a common customer id, conformed dimensions, quality checks) keep the products usable together.\n' +
      'Hiring keeps the queue and the knowledge gap, ownership without standards fragments the data, and mesh decentralises ownership rather than centralising it.',
  },
  {
    id: 'de-metric-10',
    type: QuestionType.SPOT_FLAW,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_METRICS_OWNERSHIP,
    course: DE,
    question:
      'This dashboard\'s revenue is lower than every other report\'s, though all of them read revenue from the semantic layer.\n' +
      'Click the line that causes it.',
    lines: [
      'dashboard: weekly_revenue',
      'source: semantic_layer',
      'metric: revenue',
      'dimensions: [week, region]',
      'filter: region != \'internal\'',
      'calculated_field: revenue_net = revenue - SUM(refunds.amount)',
      'chart: revenue_net by week',
    ],
    flawLines: [6],
    note: 'The semantic layer\'s revenue is already net of refunds. The internal region holds the company\'s own test accounts and is left out everywhere.',
    explanation:
      'Line 6 redefines the metric inside the dashboard: it subtracts refunds from a revenue that already has them subtracted, so this dashboard takes refunds off twice.\n' +
      'A dashboard should ask the layer for a metric, not rebuild it. If a net figure is missing, it is added to the shared definitions where its owner and tests are.',
  },
  {
    id: 'de-metric-11',
    type: QuestionType.SPOT_FLAW,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_METRICS_OWNERSHIP,
    course: DE,
    question:
      'Joins between this data product and the marketing domain\'s campaign responses match almost no customers.\n' +
      'Click the line that causes it.',
    lines: [
      'data_product: orders_daily',
      'owner: orders-team',
      'grain: one row per order',
      'keys: order_id, customer_id      # the orders app\'s own customer numbers',
      'quality: order_id unique, amount >= 0',
      'published_to: shared catalog',
    ],
    flawLines: [4],
    note: 'The platform\'s standards say every data product identifies customers by customer_key, from the customer domain. The marketing domain follows them.',
    explanation:
      'Line 4 publishes the orders app\'s own customer numbers instead of the shared customer_key, so the product cannot be joined with any other domain\'s data.\n' +
      'In a mesh, domains own their products, and federated standards such as shared keys are what keep the products usable together.',
  },
  {
    id: 'de-metric-12',
    type: QuestionType.EXPLAIN,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.DE_METRICS_OWNERSHIP,
    course: DE,
    question: 'In two or three sentences: why should a metric such as revenue be defined once rather than in each dashboard, and what does that one definition need besides its SQL?',
    keyPoints: [
      'Each dashboard\'s own SQL drifts into a different definition, so the same name gives different numbers',
      'One shared definition gives one number, and a fix to it reaches every consumer at once',
      'It needs an agreed meaning, a named owner, and tests and review for changes, as code under version control',
    ],
    modelAnswer:
      'When each dashboard writes its own SQL, the definitions drift apart (one counts refunds, another dates by payment), so revenue has as many values as dashboards. ' +
      'One definition in shared, version-controlled code gives one number and one place to fix it, and it needs an agreed meaning and an owner who reviews and tests every change.',
    explanation: 'A single source of truth is as much an agreement and an owner as it is a table.',
  },
  {
    id: 'de-metric-13',
    type: QuestionType.EXPLAIN,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DE_METRICS_OWNERSHIP,
    course: DE,
    question: 'In two or three sentences: what problem does data mesh address, what does it need in order to work, and when is it not worth it?',
    keyPoints: [
      'It addresses a central data team that has become a bottleneck and lacks the domains\' knowledge',
      'Domain teams own their data as products, on a self-serve platform, under shared (federated) standards',
      'For a small company with few domains, a central team is simpler and the mesh\'s overhead costs more than it saves',
    ],
    modelAnswer:
      'Data mesh addresses a central data team that has become a bottleneck for many domains whose data it does not know well. ' +
      'It gives each domain ownership of its data as a product, which needs a self-serve platform and shared standards such as common keys, and for a small company whose central team keeps up it is overhead with no queue to remove.',
    explanation: 'Mesh is about who owns data, not a technology to install.',
  },
];

export const dataEngineeringModelingAnalyticsQuestions: Question[] = [
  ...grain,
  ...factsDimsStar,
  ...keys,
  ...history,
  ...metrics,
];
