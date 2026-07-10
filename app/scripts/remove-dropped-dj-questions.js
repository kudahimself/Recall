// One-off: physically remove the Django questions that backendOrderedQuestions.ts
// documents as deliberate drops (duplicates of curated py-dj-*/celery-drf-* equivalents)
// but that leak back into the served pool via the topic-file spreads in questions.ts.
const fs = require('fs');
const path = require('path');
const dataDir = path.join(__dirname, '..', 'src', 'data');

const DROPS = {
  'topic_dj_admin.ts': ['dj-admin-1', 'dj-admin-2', 'dj-admin-3'],
  'topic_dj_auth.ts': ['be-auth-1'],
  'topic_dj_caching.ts': ['dj-cache-1'],
  'topic_dj_cicd.ts': ['be-infra-cicd-1', 'be-infra-cicd-2', 'be-infra-cicd-3', 'be-infra-cicd-4'],
  'topic_dj_factory_boy.ts': ['be-infra-factory-1', 'be-infra-factory-2', 'be-infra-factory-3', 'be-infra-factory-4'],
  'topic_dj_forms.ts': ['dj-form-1', 'dj-form-2', 'dj-form-4'],
  'topic_dj_models.ts': ['be-dj-signals-1', 'dj-model-3'],
  'topic_dj_orm.ts': ['be-sql-5', 'dj-orm-4', 'dj-orm-5'],
  'topic_dj_pagination_generics.ts': ['celery-drf-12', 'celery-drf-15'],
  'topic_dj_project.ts': ['be-test-3'],
  'topic_dj_redis.ts': ['celery-drf-10'],
  'topic_dj_rest.ts': ['dj-rest-3'],
  'topic_dj_signals_mw.ts': ['dj-sigmw-1'],
  'topic_dj_templates.ts': ['dj-tmpl-2', 'dj-tmpl-5'],
  'topic_dj_transactions.ts': ['dj-tx-2'],
  'topic_dj_urls.ts': ['dj-url-1', 'dj-url-2', 'dj-url-3'],
  'topic_dj_views.ts': ['be-dj-mid-1'],
};

function removeBlock(src, id) {
  const idIdx = src.indexOf(`id: '${id}'`);
  if (idIdx === -1) throw new Error(`id not found: ${id}`);
  // walk back to the opening "{" that starts this question object
  let start = src.lastIndexOf('{', idIdx);
  // walk forward counting braces (brace chars inside template literals/strings are
  // rare in these files but possible — count only braces outside backtick strings)
  let depth = 0, i = start, inTemplate = false, inSingle = false;
  for (; i < src.length; i++) {
    const c = src[i];
    const prev = src[i - 1];
    if (inTemplate) { if (c === '`' && prev !== '\\') inTemplate = false; continue; }
    if (inSingle) { if (c === "'" && prev !== '\\') inSingle = false; continue; }
    if (c === '`') { inTemplate = true; continue; }
    if (c === "'") { inSingle = true; continue; }
    if (c === '{') depth++;
    else if (c === '}') { depth--; if (depth === 0) break; }
  }
  if (depth !== 0) throw new Error(`unbalanced braces for ${id}`);
  let end = i + 1;
  // swallow a trailing comma + the newline/indent that preceded the block
  if (src[end] === ',') end++;
  // trim leading whitespace back to the previous newline
  let realStart = start;
  while (realStart > 0 && (src[realStart - 1] === ' ' || src[realStart - 1] === '\t')) realStart--;
  if (src[realStart - 1] === '\n') realStart--;
  return src.slice(0, realStart) + src.slice(end);
}

for (const [file, ids] of Object.entries(DROPS)) {
  const p = path.join(dataDir, file);
  let src = fs.readFileSync(p, 'utf8');
  for (const id of ids) {
    src = removeBlock(src, id);
    console.log(`removed ${id} from ${file}`);
  }
  fs.writeFileSync(p, src);
}
console.log('done');
