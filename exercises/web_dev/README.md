# Web Dev exercises

Each one is HTML, CSS, JavaScript, a React component or TypeScript, written in your own editor and tested on your own laptop with [Vitest](https://vitest.dev/) on Node.
There is no server to start and no browser in the tests: jsdom, a browser engine without a screen, loads your page or renders your component.

## Setup (once)

1. Install Node 24.15 or newer, or 22.22 or newer (`node --version` prints it): jsdom needs one of those.
2. From the repository root:

   ```bash
   cd exercises/web_dev
   npm ci
   ```

   This installs the versions pinned in `package-lock.json` (Vitest, jsdom, React, React Testing Library, React Router and TypeScript) into `exercises/web_dev/node_modules`, and needs the internet that one time.
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
jsdom builds the elements, applies the cascade and answers `getComputedStyle`, so the tests check what an element is and what style it ends up with.
A few also read your file, but only for a technique that the page alone cannot show (a `var()`, a `min-width` query, no `!important`), and their failure message names it.
It draws nothing, so nothing is measured in pixels on the screen, and it ignores `@media` on its own: `page.js` applies the queries that match the width a test asks for, so a test can load your page at 375px and again at 1280px.

The Tailwind exercises check the classes in your markup, since turning them into CSS is Tailwind's build step; their READMEs say how to build and look at the page if you want to.

## How the tests read a component

The React exercises are `.jsx` files, and their tests, `*.test.jsx`, use [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) in jsdom.
`render` mounts your component, `screen.getByRole` or `getByText` finds what is on the page, and `fireEvent` clicks and types, so a test checks what the reader would see rather than the state inside.
Matchers such as `toBeInTheDocument()` and `toHaveValue()` come from jest-dom.
React runs in development mode, so the warnings it prints, such as a missing `key`, show up in the test output.

## How the tests check your types

The TypeScript exercises are `.ts` files, with tests in `*.test.ts`.
Vitest runs TypeScript by stripping its types, so running your functions cannot show whether the types are right.
So these tests also hand the TypeScript compiler your file, and a few lines that use it, through `typecheck.js`, with the strict settings in `tsconfig.json`, which VS Code uses too: what VS Code underlines in red, the tests report.
In those lines a line after `// @ts-expect-error` must fail to compile, so a type that is too loose, such as `any`, fails its test, and the comment says what should be rejected.
You can also check every exercise's files at once from `exercises/web_dev` with `npx tsc -p .`.

Leave `page.js`, `typecheck.js`, `tsconfig.json`, `package.json` and `vitest.config.js` as they are.

To start an exercise again, restore its folder: `git checkout -- exercises/web_dev/js_arrays`.
