// Grades CSS coding questions by rendering twin hidden iframes (solution vs
// user code over the same previewHtml) and comparing getComputedStyle on the
// question's declared previewChecks. This sidesteps text-matching entirely -
// any CSS that computes to the same result passes (shorthand vs longhand,
// #fff vs rgb(255,255,255), etc.).

import { CodingQuestion, CodeLanguage } from '../types';
import { ValidationResult } from './codeValidator';
import { buildPreviewDoc } from './previewDoc';

// Width the grading frames render at. Fixed (not the user's preview preset) so
// grading is deterministic regardless of which device preset is selected.
const GRADING_FRAME_WIDTH = 1024;
const GRADING_FRAME_HEIGHT = 768;
const LOAD_TIMEOUT_MS = 3000;

function createHiddenFrame(srcDoc: string): { frame: HTMLIFrameElement; loaded: Promise<void> } {
  const frame = document.createElement('iframe');
  // Off-screen, NOT display:none - hidden frames still need a layout pass for
  // getComputedStyle to return real values.
  frame.style.position = 'absolute';
  frame.style.left = '-99999px';
  frame.style.top = '0';
  frame.style.width = `${GRADING_FRAME_WIDTH}px`;
  frame.style.height = `${GRADING_FRAME_HEIGHT}px`;
  frame.style.border = '0';
  frame.setAttribute('sandbox', 'allow-same-origin');
  frame.setAttribute('aria-hidden', 'true');
  frame.tabIndex = -1;

  const loaded = new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Preview frame timed out.')), LOAD_TIMEOUT_MS);
    frame.addEventListener('load', () => {
      clearTimeout(timer);
      resolve();
    });
  });

  frame.srcdoc = srcDoc;
  document.body.appendChild(frame);
  return { frame, loaded };
}

export async function validateByComputedStyle(
  question: CodingQuestion,
  userCode: string,
): Promise<ValidationResult[]> {
  const isHtmlQuestion = question.language === CodeLanguage.HTML;
  const previewHtml = question.previewHtml ?? '';
  const checks = question.previewChecks ?? [];

  // For CSS questions the code IS the stylesheet over shared markup; for HTML
  // questions the code IS the markup (no separate stylesheet).
  const solutionDoc = buildPreviewDoc(
    isHtmlQuestion
      ? { html: question.solution }
      : { html: previewHtml, css: question.solution },
  );
  const userDoc = buildPreviewDoc(
    isHtmlQuestion ? { html: userCode } : { html: previewHtml, css: userCode },
  );

  const solutionEnv = createHiddenFrame(solutionDoc);
  const userEnv = createHiddenFrame(userDoc);

  try {
    await Promise.all([solutionEnv.loaded, userEnv.loaded]);

    const solutionFrameDoc = solutionEnv.frame.contentDocument;
    const userFrameDoc = userEnv.frame.contentDocument;
    const solutionWin = solutionEnv.frame.contentWindow;
    const userWin = userEnv.frame.contentWindow;
    if (!solutionFrameDoc || !userFrameDoc || !solutionWin || !userWin) {
      throw new Error('Preview frames were not accessible.');
    }

    return checks.map(check => {
      const solutionEl = solutionFrameDoc.querySelector(check.selector);
      const userEl = userFrameDoc.querySelector(check.selector);

      if (!solutionEl) {
        // Authoring bug, not a learner failure - surface it loudly.
        return {
          passed: false,
          verdict: 'fail' as const,
          description: check.selector,
          error: `Question data error: "${check.selector}" not found in the reference render.`,
        };
      }
      if (!userEl) {
        return {
          passed: false,
          verdict: 'fail' as const,
          description: check.selector,
          error: `No element matches "${check.selector}" in your render.`,
        };
      }

      const solutionStyle = solutionWin.getComputedStyle(solutionEl);
      const userStyle = userWin.getComputedStyle(userEl);

      const mismatches: string[] = [];
      for (const prop of check.properties) {
        const expected = solutionStyle.getPropertyValue(prop).trim();
        const actual = userStyle.getPropertyValue(prop).trim();
        if (expected !== actual) {
          mismatches.push(`${prop}: expected ${expected || '(unset)'}, got ${actual || '(unset)'}`);
        }
      }

      if (mismatches.length > 0) {
        return {
          passed: false,
          verdict: 'fail' as const,
          description: `${check.selector} → ${check.properties.join(', ')}`,
          error: mismatches.join('; '),
        };
      }
      return {
        passed: true,
        verdict: 'pass' as const,
        description: `${check.selector} → ${check.properties.join(', ')}`,
      };
    });
  } finally {
    solutionEnv.frame.remove();
    userEnv.frame.remove();
  }
}
