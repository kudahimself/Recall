// Builds the srcDoc for the live preview iframe (and the hidden grading iframes).
// Pure string assembly - no DOM access - so it stays unit-testable in jsdom.

export interface PreviewDocInput {
  // Markup rendered inside <body>. For CSS questions this is the question's
  // previewHtml; for HTML questions it is the learner's own code.
  html: string;
  // CSS injected in a <style> tag after the reset (the learner's or the solution's).
  css?: string;
  // Include the Tailwind Play CDN so utility classes in the markup take effect.
  // Requires the host iframe to allow scripts; used for TAILWIND-topic previews
  // only (grading for those stays text-based - JIT timing isn't deterministic).
  tailwind?: boolean;
}

// Small reset + real-web defaults. White background on purpose: learners are
// styling for the web, not for the app's dark theme, and grading compares
// computed styles against this same document.
const BASE_STYLES = `
  *, *::before, *::after { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    background: #ffffff;
    color: #111111;
    font-family: system-ui, -apple-system, "Segoe UI", Arial, sans-serif;
    font-size: 16px;
    line-height: 1.5;
    padding: 12px;
  }
`;

export function buildPreviewDoc({ html, css, tailwind }: PreviewDocInput): string {
  // Full-document answers (metadata/head questions: <!DOCTYPE>, <html>, <head>,
  // <title>...) render verbatim - wrapping them in another body would mangle
  // the structure the question is about.
  const trimmed = html.trimStart().toLowerCase();
  if (trimmed.startsWith('<!doctype') || trimmed.startsWith('<html')) {
    return html;
  }
  return [
    '<!DOCTYPE html>',
    '<html>',
    '<head>',
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    `<style>${BASE_STYLES}</style>`,
    tailwind ? '<script src="https://cdn.tailwindcss.com"></script>' : '',
    // data-learner-css lets frame inspectors find this sheet and skip
    // Tailwind's CDN-generated ones.
    css ? `<style data-learner-css>${css}</style>` : '',
    '</head>',
    `<body>${html}</body>`,
    '</html>',
  ].join('\n');
}
