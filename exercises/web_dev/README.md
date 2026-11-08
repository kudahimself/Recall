# Web Dev exercises

Each one is HTML, CSS or JavaScript, written in your own editor and tested on your own laptop with [Vitest](https://vitest.dev/) on Node.
There is no server to start and no browser in the tests: jsdom, a browser engine without a screen, loads your page.

## Setup (once)

1. Install Node 24.15 or newer, or 22.22 or newer (`node --version` prints it): jsdom needs one of those.
2. From the repository root:

   ```bash
   cd exercises/web_dev
   npm ci
   ```

   This installs the versions pinned in `package-lock.json` (Vitest and jsdom) into `exercises/web_dev/node_modules`, and needs the internet that one time.
   After that every run is offline.

## Doing an exercise

```bash
cd exercises/web_dev/js_arrays
npm test
```

Run from an exercise folder, `npm test` runs only that exercise's tests; run from `exercises/web_dev`, it runs all of them.
`npm test -- --watch` reruns them each time you save.
In VS Code, the Vitest extension finds the same tests.

## How the tests read a page

The JavaScript exercises import your module and call its functions, as Jest-style tests do (`describe`, `test`, `expect`).

The HTML and CSS exercises load your page with `page.js`, which hands it to jsdom.
jsdom builds the elements, applies the cascade and answers `getComputedStyle`, so the tests check what an element is and what style it ends up with, not how your file is written.
It draws nothing, so nothing is measured in pixels on the screen, and it ignores `@media` on its own: `page.js` applies the queries that match the width a test asks for, so a test can load your page at 375px and again at 1280px.
Leave `page.js`, `package.json` and `vitest.config.js` as they are.

The Tailwind exercises check the classes in your markup, since turning them into CSS is Tailwind's build step; their READMEs say how to build and look at the page if you want to.

To start an exercise again, restore its folder: `git checkout -- exercises/web_dev/js_arrays`.
