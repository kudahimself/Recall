#!/usr/bin/env node
/**
 * Concept consolidation codemod.
 *
 * A concept tagged on exactly ONE question ("singleton") cannot do the job a
 * concept exists to do: link questions that drill the same skill so the
 * scheduler can rotate between them. When the concept-aware selector wants a
 * singleton concept, the only card that can satisfy it is the same one every
 * time — which is how a learner ends up seeing one question two picks out of
 * three (see realStateReplay.sim.test.ts).
 *
 * DATABRICKS_COMPUTE_ADMIN was the worst case: 37 questions carrying 36 distinct
 * concepts, i.e. tagging that linked nothing at all. This maps the hyper-specific
 * ad-hoc ids onto the broader concept they are a facet of, mostly ids that are
 * already declared in conceptRegistry.ts.
 *
 * Rewrites only the `concepts: [...]` arrays in src/data/*.ts, de-duplicating
 * where a question ends up tagged with the same parent twice.
 *
 * Usage:
 *   node scripts/consolidate-concepts.js --dry     # report only (default)
 *   node scripts/consolidate-concepts.js --write   # apply
 */
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'src', 'data');
const WRITE = process.argv.includes('--write');

// old ad-hoc id -> broader concept it is a facet of.
// Targets marked NEW are added to DATABRICKS_CONCEPTS in the same change.
const MAP = {
  // ── DATABRICKS_COMPUTE_ADMIN ────────────────────────────────────────────
  'dbx-access-modes-limitations': 'dbx-access-modes',
  'dbx-access-modes-security': 'dbx-access-modes',

  'dbx-cluster-policy-schema': 'dbx-cluster-policies',
  'dbx-cluster-policy-validation': 'dbx-cluster-policies',
  'dbx-cluster-policy-json-construction': 'dbx-cluster-policies',
  'dbx-cluster-policy-dict-builder': 'dbx-cluster-policies',

  'dbx-init-scripts-security': 'dbx-init-scripts',
  'dbx-global-init-scripts': 'dbx-init-scripts',
  'dbx-init-script-volume-creation': 'dbx-init-scripts',

  'dbx-spot-decommissioning': 'dbx-spot-on-demand',
  'dbx-driver-worker-heterogeneous-sizing': 'dbx-driver-worker-sizing',

  'dbx-utilities-fs-put': 'dbx-utilities',
  'dbx-context-tag-retrieval': 'dbx-utilities',
  'dbx-execution-context-extraction': 'dbx-utilities',

  'dbx-cluster-advanced-config': 'dbx-cluster-config',
  'dbx-cluster-tags': 'dbx-cluster-config',
  'dbx-cluster-log-delivery': 'dbx-cluster-config',
  'dbx-auto-termination-reset': 'dbx-cluster-config',
  'dbx-autoscale-shuffle-retention': 'dbx-cluster-config',
  'dbx-instance-pools': 'dbx-cluster-config',

  'dbx-single-node-compute': 'dbx-architecture',

  'dbx-runtime-ml': 'dbx-runtime-selection',            // NEW
  'dbx-runtime-lts': 'dbx-runtime-selection',           // NEW
  'dbx-photon-fallback': 'dbx-runtime-selection',       // NEW
  'dbx-container-services': 'dbx-runtime-selection',    // NEW
  'dbx-notebook-scoped-libraries': 'dbx-runtime-selection', // NEW

  'dbx-sql-warehouses-serverless': 'dbx-sql-warehouses', // NEW
  'dbx-sql-warehouses-scaling': 'dbx-sql-warehouses',    // NEW

  // ── DATABRICKS_STORAGE_REPOS ────────────────────────────────────────────
  'dbx-repo-python-path': 'dbx-git-repos-modules',
  'dbx-azure-devops-repos-auth': 'dbx-repos',
  'dbx-azure-dbfs-root': 'dbx-dbfs',
  'dbx-azure-uri-parsing': 'dbx-dbfs',
  'dbx-fuse-vs-spark-read': 'dbx-dbfs-mounts-vs-volumes',

  'dbx-azure-adls-abfss': 'dbx-adls-access',                    // NEW
  'dbx-azure-adls-service-principal-config': 'dbx-adls-access', // NEW
  'dbx-azure-managed-identity-uc': 'dbx-adls-access',           // NEW
  'dbx-pyspark-abfss-read': 'dbx-adls-access',                  // NEW
  'dbx-adls-parquet-loading': 'dbx-adls-access',                // NEW
};

let filesChanged = 0;
let arraysChanged = 0;
let tagsRewritten = 0;
let dedupedTags = 0;
const perTarget = new Map();

for (const file of fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.ts'))) {
  const full = path.join(DATA_DIR, file);
  const src = fs.readFileSync(full, 'utf8');
  let touched = false;

  const out = src.replace(/concepts:\s*\[([^\]]*)\]/g, (whole, inner) => {
    const ids = inner.split(',')
      .map(s => s.trim())
      .filter(Boolean)
      .map(s => s.replace(/^['"]|['"]$/g, ''));
    if (ids.length === 0) return whole;

    const mapped = ids.map(id => {
      if (MAP[id]) {
        tagsRewritten++;
        perTarget.set(MAP[id], (perTarget.get(MAP[id]) ?? 0) + 1);
        return MAP[id];
      }
      return id;
    });

    // De-dup: a question tagged with both a parent and one of its facets would
    // otherwise end up carrying the parent twice.
    const seen = new Set();
    const deduped = mapped.filter(id => (seen.has(id) ? (dedupedTags++, false) : seen.add(id)));

    if (deduped.length === ids.length && deduped.every((id, i) => id === ids[i])) {
      return whole; // nothing changed in this array
    }
    touched = true;
    arraysChanged++;
    return `concepts: [${deduped.map(id => `'${id}'`).join(', ')}]`;
  });

  if (touched) {
    filesChanged++;
    if (WRITE) fs.writeFileSync(full, out, 'utf8');
    console.log(`${WRITE ? 'rewrote' : 'would rewrite'}  ${file}`);
  }
}

console.log(`\n${WRITE ? 'APPLIED' : 'DRY RUN (pass --write to apply)'}`);
console.log(`  files changed    : ${filesChanged}`);
console.log(`  concept arrays   : ${arraysChanged}`);
console.log(`  tags rewritten   : ${tagsRewritten}`);
console.log(`  duplicates merged: ${dedupedTags}`);
console.log(`  distinct ids removed: ${Object.keys(MAP).length}`);
console.log('\n  tags landing per target concept:');
[...perTarget.entries()].sort((a, b) => b[1] - a[1])
  .forEach(([c, n]) => console.log(`    ${String(n).padStart(3)}  <- ${c}`));
