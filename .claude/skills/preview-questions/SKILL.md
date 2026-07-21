---
name: preview-questions
description: Authoring rules for the live preview + computed-style grading on Web Dev HTML/CSS/Tailwind questions - previewHtml/previewChecks conventions, what is gradeable visually, and the pitfalls
---

# Preview Questions

How to author (and review) the visual layer on frontend questions: the live preview pane and computed-style grading.
Applies to Web Dev course questions in `webdevOrderedQuestions.ts` with `language: CodeLanguage.HTML | CSS` (and TAILWIND-topic HTML).
Engine files: `components/visual/LivePreview.tsx`, `utils/previewDoc.ts`, `utils/computedStyleValidator.ts`.

## When the preview appears (no flags needed)

- **HTML-language questions** (coding/cloze/parsons): automatic. The learner's assembled code IS the rendered markup. Never add `previewHtml` to these.
- **CSS-language questions**: only when the question has `previewHtml` - the markup their CSS renders against.
- **TAILWIND topic**: automatic (HTML gate) + the frame loads the Tailwind Play CDN. Requires network; grading stays text-based (JIT is not deterministic enough to grade).
- Everything else (Python/SQL/JS/TS, other courses): no preview, untouched.

## Writing `previewHtml`

One HTML string, rendered inside a white-background, real-web-reset document (`previewDoc.ts`).

1. **Include every selector the question's CSS targets.** A rule with nothing to match renders nothing - the learner thinks their code is wrong.
2. **Inline styles are for cosmetics ONLY** - backgrounds, borders, demo dimensions that make the effect visible. **NEVER inline a property the learner is asked to write** - inline style beats their class rule and the preview lies. This is the visual equivalent of a starter-code leak.
3. **Supply the stage the CSS assumes.** Flex-item questions need a container with `style="display: flex"` if the learner only writes item properties. A cloze whose rule sets only `grid-template-columns` needs `display: grid` inline on the container.
4. **Make the effect visible**: sticky/fixed need enough content to scroll; centering needs a container with height; `:hover` needs an element inviting the mouse; `display: none` deserves a "you should NOT see me" element.
5. **No external URLs** - the sandbox blocks them (this is why `css-bg-cloze-1` has no preview: its template hard-codes `url("hero.jpg")`). Use gradients or solid colors as image stand-ins only when the learner's own CSS doesn't fight them.
6. Cosmetic guidance text inside the preview is fine (`<p style="font-size: 13px; color: #64748b;">Switch device presets...</p>`) - the device toolbar (375/667/768/1024/Fill) is how media queries become visible.
7. **Full-document answers** (starting `<!DOCTYPE` or `<html`) render verbatim - no wrapper is added. The frame surfaces the document's `<title>` as a fake browser tab above the pane, so head/metadata questions DO give visible feedback.

## Writing `previewChecks` (CODING questions only)

```typescript
previewChecks: [{ selector: '.badge', properties: ['position', 'top', 'right'] }]
```

Grades by rendering solution and learner CSS in twin hidden iframes over the same `previewHtml` and comparing `getComputedStyle` per selector/property. Replaces the text validator for that question - any CSS computing to the same result passes (shorthand, hex vs rgb, `1fr 1fr 1fr` vs `repeat(3, 1fr)`).

**Gradeable** (deterministic computed values):
- Layout: `display`, `justify-content`, `align-items`, `gap`, `grid-template-columns`, `flex-grow`
- Position: `position`, `top`, `right`, `left`, offsets (compare as used px - same markup, same width, same result)
- Box/paint: `padding-top`, `max-width`, `background-color`, `background-image` (gradients), `color`, `box-shadow`, `border-top-color`, `border-top-left-radius`, `font-*`, `letter-spacing`, `text-align`, `list-style-type`
- Structural pseudo-classes via the selector itself: `tr:nth-child(2)`, `button:not(.icon-only)` - check BOTH the styled and the excluded element to catch over-broad selectors.
- Prefer longhands (`padding-top`, `border-top-color`) over shorthands - shorthand computed values are less consistent across browsers.

**NOT gradeable - leave these questions text-graded (previewHtml only):**
- `:hover`/`:focus` rules - computed style reflects the unhovered state. (The preview itself demos hover live - still add previewHtml.)
- Media queries - grading frames render at one fixed width (1024px), so only one side of a breakpoint is observable. Preview-only; the device toolbar is the payoff.
- `transform` on ANIMATING elements - `getComputedStyle` returns the mid-flight interpolated matrix (nondeterministic). Static transforms (`translateX(-50%)` on a tooltip) are fine.
- `animation-name` / `@keyframes` internals - learners may validly pick a different keyframes name. Grade `animation-iteration-count`, dimensions, colors instead.
- Anything the prompt doesn't pin down (don't check `animation-duration` if the prompt never gives a duration).

**Every property you check must be demanded by the prompt** - checks stricter than the prompt fail correct answers; looser checks pass wrong ones. If only part of the solution is gradeable (e.g. base rule yes, `:hover` no), skip previewChecks entirely rather than half-grade: passing checks mark the whole question correct.

## Review checklist for a preview question

1. previewHtml contains a match for every selector in the solution.
2. No graded property appears in an inline style.
3. CSS question: previewHtml present; HTML question: previewHtml absent.
4. previewChecks properties all deterministic (list above) and all demanded by the prompt.
5. Checks cover the prompt's full requirement, or are omitted entirely.
6. Effect is visible in a ~300px-tall frame without instructions (or includes a short cosmetic hint line).
7. Leak gate still applies: `check-leaks.js`, `check-prompt-leaks.js`, `check-ordered-strays.js`, `npx tsc --noEmit` from `app/`.

## Cloze/Parsons specifics

- The preview renders the learner's CURRENT state (blanks as typed / lines as arranged). Broken intermediate CSS is silently skipped by the browser - that's fine, it snaps into place when the fill is right.
- `previewHtml` on cloze/parsons is display-only (no checks - those question types grade their own blanks/order).
- Parsons: order-dependent visuals (e.g. `@keyframes` before use, base rule before media query) make wrong orders visibly broken - prefer markup that exposes this.
