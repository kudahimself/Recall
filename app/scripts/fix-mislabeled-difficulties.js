const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'src', 'data');

// Mapping of question ID -> new difficulty
const DIFFICULTY_CHANGES = {
  // Caching
  'dj-caching-cloze-1': 'BEGINNER',
  
  // Celery
  'dj-celery-cloze-1': 'BEGINNER',
  'dj-celery-predict-1': 'BEGINNER',
  'dj-celery-parsons-1': 'BEGINNER',

  // Forms
  'dj-forms-predict-3': 'BEGINNER',

  // Management
  'dj-management-parsons-1': 'BEGINNER',

  // Models
  'dj-models-cloze-2': 'BEGINNER',
  'dj-models-parsons-2': 'BEGINNER',
  'dj-models-cloze-3': 'BEGINNER',

  // ORM
  'dj-orm-predict-1': 'BEGINNER',

  // Postgres
  'dj-postgres-cloze-1': 'BEGINNER',
  'dj-postgres-predict-1': 'BEGINNER',

  // Signals / Middleware
  'dj-signals-cloze-1': 'BEGINNER',
  'dj-middleware-parsons-1': 'BEGINNER',

  // Transactions
  'dj-transactions-parsons-1': 'BEGINNER',

  // Auth: promote py-dj-auth-permission-required from BEGINNER to INTERMEDIATE
  // since decorators/permissions are conceptually intermediate.
  'py-dj-auth-permission-required': 'INTERMEDIATE',
};

const files = fs.readdirSync(DATA_DIR).filter(f => /^topic_dj_.*\.ts$/.test(f));

for (const file of files) {
  const filePath = path.join(DATA_DIR, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  for (const [id, newDiff] of Object.entries(DIFFICULTY_CHANGES)) {
    // Look for id: 'id' followed by difficulty: Difficulty.SOMETHING
    const idRegex = new RegExp(`(id:\\s*['"]${id}['"][\\s\\S]*?difficulty:\\s*Difficulty\\.)(\\w+)`, 'g');
    if (idRegex.test(content)) {
      content = content.replace(idRegex, `$1${newDiff}`);
      console.log(`Updated ${id} difficulty to Difficulty.${newDiff} in ${file}`);
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
  }
}
console.log('Difficulty fix completed.');
