#!/usr/bin/env node
/**
 * Prints what a lesson is drafted from (/write-lesson): a topic's questions in
 * ramp order (rampRank, ties in bank order), marking the cards of its ramp
 * (topicRamp), each with its type, difficulty, prompt, explanation, hints and
 * tiered-hint signature. Exercise ids are picked from this list, top to bottom.
 *
 *   node scripts/lesson-material.js tsql_ddl_tables
 *   node scripts/lesson-material.js tsql_ddl_tables --brief   # one line per question
 */
const path = require('path');

const APP = path.join(__dirname, '..');
require(require.resolve('sucrase/register/ts', { paths: [APP] }));
const { questions } = require(path.join(APP, 'src/data/questions.ts'));
const { topicRamp, rampRank } = require(path.join(APP, 'src/utils/spacedRepetition.ts'));
const { getGroupsForTopic } = require(path.join(APP, 'src/utils/courseConfig.ts'));
const { lessonsForTopic } = require(path.join(APP, 'src/utils/lessons.ts'));

const args = process.argv.slice(2);
const brief = args.includes('--brief');
const topics = args.filter(a => !a.startsWith('--'));
if (topics.length === 0) {
  console.error('usage: node scripts/lesson-material.js <topic> [--brief]');
  process.exit(1);
}

const flat = s => String(s).replace(/\s+/g, ' ').trim();

for (const topic of topics) {
  const tq = questions.filter(q => q.topic === topic);
  if (tq.length === 0) {
    console.error(`no questions for topic ${topic}`);
    process.exitCode = 1;
    continue;
  }
  const ramp = new Set(topicRamp(tq).map(q => q.id));
  const groups = getGroupsForTopic(topic);
  const existing = lessonsForTopic(topic).map(l => l.id);
  console.log(`# ${topic}: ${tq.length} questions, ramp ${ramp.size}${groups ? `, section "${groups.section}"` : ''}`);
  console.log(`# lessons already written: ${existing.length > 0 ? existing.join(', ') : 'none'}\n`);
  const ordered = tq.map((q, i) => ({ q, i })).sort((a, b) => rampRank(a.q) - rampRank(b.q) || a.i - b.i).map(x => x.q);
  for (const q of ordered) {
    console.log(`${ramp.has(q.id) ? 'RAMP' : '    '}  ${q.id}  [${q.difficulty} / ${q.type}]  ${flat(q.question).slice(0, brief ? 110 : 400)}`);
    if (brief) continue;
    if (q.explanation) console.log(`      explanation: ${flat(q.explanation)}`);
    if (q.hints && q.hints.length) console.log(`      hints: ${q.hints.map(flat).join(' | ')}`);
    if (q.tieredHints && q.tieredHints.apiSignature) console.log(`      signature: ${flat(q.tieredHints.apiSignature)}`);
    if (q.solution) console.log(`      solution: ${flat(q.solution).slice(0, 240)}`);
    if (q.code) console.log(`      code: ${flat(q.code).slice(0, 240)}  =>  ${flat(q.expectedOutput || '')}`);
    console.log('');
  }
}
