import { Question, QuestionType, Difficulty, Topic, CodeLanguage, Course } from '../types';

// Import all source question arrays
import { nextjsQuestions } from './nextjsQuestions';
import { prismaQuestions } from './prismaQuestions';
import { formsTestingQuestions } from './formsTestingQuestions';
import { a11yShadcnQuestions } from './a11yShadcnQuestions';
import { advancedNextQuestions } from './advancedNextQuestions';
import { designPatternQuestions } from './designPatternQuestions';
import { securityQuestions } from './securityQuestions';
import { projectQuestions } from './projectQuestions';

// Collect all questions from all source files into one pool
const allQuestions: Question[] = [
  ...nextjsQuestions,
  ...prismaQuestions,
  ...formsTestingQuestions,
  ...a11yShadcnQuestions,
  ...advancedNextQuestions,
  ...designPatternQuestions,
  ...securityQuestions,
  ...projectQuestions,
];

// Helper: Build a lookup from id -> Question
const questionMap = new Map<string, Question>();
for (const q of allQuestions) {
  questionMap.set(q.id, q);
}

function q(id: string): Question {
  const found = questionMap.get(id);
  if (!found) throw new Error(`Question not found: ${id}`);
  return found;
}

// Topic order follows course config progression:
// Next.js basics -> Prisma -> Forms+Zod -> Testing -> TanStack+URL State+Error+Auth -> Accessibility -> shadcn -> Design Patterns -> Security -> Projects
//
// Within each topic section:
// 1. BEGINNER MC (recall/definition) first
// 2. BEGINNER coding
// 3. INTERMEDIATE MC
// 4. INTERMEDIATE coding
// 5. ADVANCED MC
// 6. ADVANCED coding

export const advancedWebdevOrderedQuestions: Question[] = [

  // =====================================================================
  // 1. NEXT_ROUTING (4 questions)
  // =====================================================================

  // BEGINNER faded (Parsons + Cloze)
  q('next-route-parsons-1'),
  q('next-route-cloze-1'),
  q('next-route-cloze-2'),
  // BEGINNER coding
  q('next-route-1'),
  q('next-route-2'),
  // INTERMEDIATE MC
  q('next-route-3'),
  q('next-route-4'),

  // =====================================================================
  // 2. NEXT_SERVER_COMPONENTS (4 questions)
  // =====================================================================

  // BEGINNER faded (Parsons + Cloze)
  q('next-sc-parsons-1'),
  q('next-sc-cloze-1'),
  q('next-sc-cloze-2'),
  // BEGINNER coding
  q('next-sc-1'),
  // INTERMEDIATE MC
  q('next-sc-3'),
  // INTERMEDIATE coding
  q('next-sc-2'),
  // ADVANCED MC
  q('next-sc-4'),

  // =====================================================================
  // 3. NEXT_DATA_FETCHING (4 questions)
  // =====================================================================

  // BEGINNER faded (Parsons + Cloze)
  q('next-fetch-parsons-1'),
  q('next-fetch-cloze-1'),
  q('next-fetch-cloze-2'),
  // BEGINNER coding
  q('next-fetch-1'),
  // INTERMEDIATE MC
  q('next-fetch-3'),
  // INTERMEDIATE coding
  q('next-fetch-2'),
  // ADVANCED MC
  q('next-fetch-4'),

  // =====================================================================
  // 4. NEXT_API_ROUTES (4 questions)
  // =====================================================================

  // BEGINNER faded (Parsons + Cloze)
  q('next-api-parsons-1'),
  q('next-api-cloze-1'),
  q('next-api-cloze-2'),
  // BEGINNER coding
  q('next-api-1'),
  // INTERMEDIATE MC
  q('next-api-3'),
  // INTERMEDIATE coding
  q('next-api-2'),
  // ADVANCED MC
  q('next-api-4'),

  // =====================================================================
  // 5. NEXT_MIDDLEWARE (3 questions)
  // =====================================================================

  // BEGINNER faded (Parsons + Cloze)
  q('next-mw-parsons-1'),
  q('next-mw-cloze-1'),
  q('next-mw-cloze-2'),
  // INTERMEDIATE MC
  q('next-mw-2'),
  // INTERMEDIATE coding
  q('next-mw-1'),
  // ADVANCED MC
  q('next-mw-3'),

  // =====================================================================
  // 6. NEXT_OPTIMIZATION (3 questions)
  // =====================================================================

  // BEGINNER faded (Parsons + Cloze)
  q('next-opt-parsons-1'),
  q('next-opt-cloze-1'),
  q('next-opt-cloze-2'),
  // BEGINNER coding
  q('next-opt-1'),
  // INTERMEDIATE MC
  q('next-opt-2'),
  // INTERMEDIATE coding
  q('next-opt-3'),

  // =====================================================================
  // 7. NEXT_AUTH (5 questions — from securityQuestions)
  // =====================================================================

  // INTERMEDIATE MC
  q('sec-auth-1'),
  q('sec-auth-2'),
  q('sec-auth-3'),
  // ADVANCED MC
  q('sec-auth-4'),
  // ADVANCED coding
  q('sec-auth-5'),

  // =====================================================================
  // 8. DB_DESIGN (10 questions — relocated from former position 23)
  // Schema fundamentals (normalization, relationships, indexes, N+1) land
  // before Prisma so the user has the mental model for writing schemas.
  // =====================================================================

  // BEGINNER MC
  q('dp-db-5'),
  // BEGINNER coding
  q('dp-db-4'),
  // INTERMEDIATE MC
  q('dp-db-1'),
  q('dp-db-3'),
  q('dp-db-7'),
  q('dp-db-8'),
  q('dp-db-9'),
  q('dp-db-10'),
  // ADVANCED MC
  q('dp-db-2'),
  q('dp-db-6'),

  // =====================================================================
  // 9. NEXT_PRISMA (10 questions)
  // =====================================================================

  // BEGINNER faded (Parsons + Cloze)
  q('prisma-parsons-1'),
  q('prisma-cloze-1'),
  q('prisma-cloze-2'),
  // BEGINNER MC
  q('prisma-4'),
  q('prisma-8'),
  // BEGINNER coding
  q('prisma-1'),
  q('prisma-2'),
  // INTERMEDIATE MC
  q('prisma-3'),
  q('prisma-6'),
  // INTERMEDIATE coding
  q('prisma-5'),
  q('prisma-7'),
  q('prisma-9'),
  // ADVANCED MC
  q('prisma-10'),

  // =====================================================================
  // 10. NEXT_TANSTACK (6 questions)
  // =====================================================================

  // BEGINNER faded (Parsons + Cloze)
  q('tanstack-parsons-1'),
  q('tanstack-cloze-1'),
  q('tanstack-cloze-2'),
  // BEGINNER MC
  q('tanstack-3'),
  // BEGINNER coding
  q('tanstack-1'),
  // INTERMEDIATE MC
  q('tanstack-4'),
  q('tanstack-5'),
  // INTERMEDIATE coding
  q('tanstack-2'),
  // ADVANCED coding
  q('tanstack-6'),

  // =====================================================================
  // 11. NEXT_FORMS_VALIDATION (8 questions)
  // =====================================================================

  // BEGINNER faded (Parsons + Cloze) — next-forms-1/2/4/8 are BEGINNER difficulty
  q('next-forms-parsons-1'),
  q('next-forms-cloze-1'),
  q('next-forms-cloze-2'),
  // INTERMEDIATE MC
  q('next-forms-4'),
  q('next-forms-5'),
  q('next-forms-7'),
  q('next-forms-8'),
  // INTERMEDIATE coding
  q('next-forms-1'),
  q('next-forms-2'),
  q('next-forms-3'),
  // ADVANCED coding
  q('next-forms-6'),

  // =====================================================================
  // 12. NEXT_TESTING (15 questions)
  // =====================================================================

  // BEGINNER faded (Parsons + Cloze) — next-testing-1/5/8/9 are BEGINNER difficulty
  q('next-testing-parsons-1'),
  q('next-testing-cloze-1'),
  q('next-testing-cloze-2'),
  // INTERMEDIATE MC
  q('next-testing-3'),
  q('next-testing-4'),
  q('next-testing-8'),
  q('next-testing-10'),
  q('next-testing-14'),
  // INTERMEDIATE coding
  q('next-testing-1'),
  q('next-testing-5'),
  q('next-testing-9'),
  // ADVANCED MC
  q('next-testing-6'),
  q('next-testing-12'),
  q('next-testing-13'),
  // ADVANCED coding
  q('next-testing-2'),
  q('next-testing-7'),
  q('next-testing-11'),
  q('next-testing-15'),

  // =====================================================================
  // 13. NEXT_URL_STATE (4 questions)
  // =====================================================================

  // ADVANCED MC
  q('next-url-state-3'),
  q('next-url-state-4'),
  // ADVANCED coding
  q('next-url-state-1'),
  q('next-url-state-2'),

  // =====================================================================
  // 14. NEXT_ERROR_HANDLING (5 questions)
  // =====================================================================

  // BEGINNER faded (Parsons + Cloze) — next-error-handling-1/3/5 are BEGINNER difficulty
  q('next-error-handling-parsons-1'),
  q('next-error-handling-cloze-1'),
  q('next-error-handling-cloze-2'),
  // ADVANCED MC
  q('next-error-handling-3'),
  q('next-error-handling-4'),
  q('next-error-handling-5'),
  // ADVANCED coding
  q('next-error-handling-1'),
  q('next-error-handling-2'),

  // =====================================================================
  // 15. NEXT_AUTH_DEEP (5 questions)
  // =====================================================================

  // BEGINNER faded (Parsons + Cloze) — next-auth-deep-2 is BEGINNER difficulty
  q('next-auth-deep-parsons-1'),
  q('next-auth-deep-cloze-1'),
  q('next-auth-deep-cloze-2'),
  // ADVANCED MC
  q('next-auth-deep-3'),
  q('next-auth-deep-4'),
  q('next-auth-deep-5'),
  // ADVANCED coding
  q('next-auth-deep-1'),
  q('next-auth-deep-2'),

  // =====================================================================
  // 16. ACCESSIBILITY (16 questions)
  // =====================================================================

  // BEGINNER MC
  q('a11y-wcag-levels-1'),
  q('a11y-focus-spa-1'),
  q('a11y-reduced-motion-1'),
  q('a11y-audit-tools-1'),
  // BEGINNER coding
  q('a11y-skip-nav-1'),
  // INTERMEDIATE faded (Parsons + Cloze) — scaffolds the modal & dropdown primitives
  q('a11y-escape-parsons-1'),
  q('a11y-dialog-cloze-1'),
  q('a11y-focustrap-cloze-1'),
  q('a11y-listbox-parsons-1'),
  q('a11y-expanded-cloze-1'),
  q('a11y-arrownav-parsons-1'),
  // INTERMEDIATE MC
  q('a11y-aria-labels-1'),
  q('a11y-roving-tabindex-1'),
  q('a11y-native-first-1'),
  // ADVANCED coding
  q('a11y-modal-1'),
  q('a11y-dropdown-1'),

  // =====================================================================
  // 17. NEXT_SHADCN (5 questions)
  // =====================================================================

  // BEGINNER faded (Parsons + Cloze)
  q('shadcn-parsons-1'),
  q('shadcn-cloze-1'),
  q('shadcn-cloze-2'),
  // BEGINNER MC
  q('shadcn-what-is-1'),
  q('shadcn-customize-1'),
  // INTERMEDIATE MC
  q('shadcn-radix-1'),
  // INTERMEDIATE coding
  q('shadcn-cn-utility-1'),
  q('shadcn-dark-mode-1'),

  // =====================================================================
  // 18. PATTERNS_CREATIONAL (8 questions)
  // =====================================================================

  // BEGINNER MC
  q('dp-create-5'),
  // INTERMEDIATE MC
  q('dp-create-1'),
  q('dp-create-3'),
  q('dp-create-4'),
  q('dp-create-6'),
  q('dp-create-7'),
  // INTERMEDIATE coding
  q('dp-create-2'),
  // ADVANCED MC
  q('dp-create-8'),

  // =====================================================================
  // 19. PATTERNS_STRUCTURAL (8 questions)
  // =====================================================================

  // BEGINNER MC
  q('dp-struct-3'),
  // INTERMEDIATE MC
  q('dp-struct-1'),
  q('dp-struct-4'),
  q('dp-struct-5'),
  q('dp-struct-6'),
  // INTERMEDIATE coding
  q('dp-struct-2'),
  // ADVANCED MC
  q('dp-struct-7'),
  q('dp-struct-8'),

  // =====================================================================
  // 20. PATTERNS_BEHAVIORAL (8 questions)
  // =====================================================================

  // BEGINNER MC
  q('dp-behav-2'),
  // INTERMEDIATE MC
  q('dp-behav-3'),
  q('dp-behav-5'),
  q('dp-behav-6'),
  q('dp-behav-7'),
  q('dp-behav-8'),
  // INTERMEDIATE coding
  q('dp-behav-1'),
  // ADVANCED MC
  q('dp-behav-4'),

  // =====================================================================
  // 21. PATTERNS_ARCHITECTURAL (15 questions — from designPatternQuestions + securityQuestions)
  // =====================================================================

  // BEGINNER MC
  q('dp-arch-6'),
  q('sec-comm-1'),
  // INTERMEDIATE MC
  q('dp-arch-1'),
  q('dp-arch-9'),
  q('sec-arch-3'),
  // INTERMEDIATE coding
  q('dp-arch-5'),
  q('sec-comm-2'),
  q('sec-arch-2'),
  // ADVANCED MC
  q('dp-arch-2'),
  q('dp-arch-3'),
  q('dp-arch-4'),
  q('dp-arch-7'),
  q('dp-arch-8'),
  q('sec-comm-3'),
  q('sec-arch-1'),

  // =====================================================================
  // 22. API_DESIGN (18 questions — from designPatternQuestions + securityQuestions)
  // =====================================================================

  // BEGINNER MC
  q('dp-api-1'),
  q('dp-api-2'),
  q('sec-data-3'),
  // INTERMEDIATE MC
  q('dp-api-5'),
  q('dp-api-6'),
  q('dp-api-7'),
  q('dp-api-8'),
  q('sec-attack-1'),
  q('sec-attack-3'),
  q('sec-data-1'),
  q('sec-data-2'),
  q('sec-data-4'),
  // INTERMEDIATE coding
  q('dp-api-4'),
  q('sec-attack-2'),
  q('sec-attack-5'),
  // ADVANCED MC
  q('dp-api-3'),
  q('dp-api-9'),
  q('sec-attack-4'),

  // =====================================================================
  // 23. NEXT_DEPLOYMENT (3 questions — relocated from former position 8)
  // Deployment sits immediately before the projects block so "how to deploy"
  // pairs with "now deploy what you built."
  // =====================================================================

  // BEGINNER MC
  q('next-deploy-1'),
  // INTERMEDIATE MC
  q('next-deploy-2'),
  // ADVANCED MC
  q('next-deploy-3'),

  // =====================================================================
  // 24. PROJECT QUESTIONS (all, at the end)
  // =====================================================================

  // JS_PROJECT
  q('proj-js-1'),
  q('proj-js-2'),
  q('proj-js-3'),
  // TS_PROJECT
  q('proj-ts-1'),
  q('proj-ts-2'),
  q('proj-ts-3'),
  // NEXT_DEPLOYMENT projects
  q('proj-next-1'),
  q('proj-next-2'),
  q('proj-next-3'),
  // NEXT_FORMS_VALIDATION projects
  q('proj-forms-1'),
  q('proj-forms-2'),
  q('proj-forms-3'),
  // NEXT_URL_STATE projects
  q('proj-url-1'),
  q('proj-url-2'),
  q('proj-url-3'),
  // PATTERNS_ARCHITECTURAL capstone projects
  q('proj-capstone-1'),
  q('proj-capstone-2'),
  q('proj-capstone-3'),
];
