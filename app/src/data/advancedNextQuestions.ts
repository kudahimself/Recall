import { Question, QuestionType, Difficulty, Topic, CodeLanguage, Course } from '../types';

export const advancedNextQuestions: Question[] = [

  // =====================================================================
  // NEXT_URL_STATE (12 questions here; proj-url-1 to -3 are in projectQuestions.ts)
  // =====================================================================

  // BEGINNER faded (Parsons + Cloze): lower-load scaffold before cold coding

  {
    id: 'next-url-state-parsons-1',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_URL_STATE,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question:
      'Assemble a Client Component that reads the "q" search param and displays it. Keep the directive on the first line.',
    correctOrder: [
      '"use client";',
      'import { useSearchParams } from "next/navigation";',
      'export default function SearchDisplay() {',
      '  const searchParams = useSearchParams();',
      '  const q = searchParams.get("q");',
      '  return <p>Query: {q}</p>;',
      '}',
    ],
    distractorLines: [
      'import { searchParams } from "next/navigation";',
      '  const q = searchParams.q;',
    ],
    solution: `"use client";
import { useSearchParams } from "next/navigation";
export default function SearchDisplay() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q");
  return <p>Query: {q}</p>;
}`,
    explanation: 'useSearchParams() is a hook, so it runs only in a Client Component and the file starts with "use client". It is imported from next/navigation; there is no searchParams export to import (the searchParams prop belongs to a server page). It returns a read-only URLSearchParams, not a plain object, so a param is read with .get("q"), which gives the string or null; searchParams.q is undefined.',
    hints: [
      'useSearchParams is a hook, so the file needs "use client"',
      'The returned object is a URLSearchParams, not a plain object',
      'Read a param with .get("key")',
    ],
    tags: ['next.js', 'url-state', 'useSearchParams', 'parsons'],
    concepts: ['next-url-state'],
  },

  {
    id: 'next-url-state-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_URL_STATE,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question:
      'Complete the code: the hook that reads URL query params on the client, and the method that reads a single param by key.',
    template: `"use client";
import { ___ } from "next/navigation";

export default function SearchDisplay() {
  const searchParams = useSearchParams();
  const q = searchParams.___("q");
  return <p>{q}</p>;
}`,
    blanks: ['useSearchParams', 'get'],
    solution: `"use client";
import { useSearchParams } from "next/navigation";

export default function SearchDisplay() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q");
  return <p>{q}</p>;
}`,
    explanation:
      'useSearchParams() gives read-only access to the current URL\'s query string as a URLSearchParams object. Individual params are read with .get("key"), which returns the string value or null if the key is absent.',
    hints: [
      'The hook for reading query params client-side',
      'The URLSearchParams method for reading one key',
    ],
    tags: ['next.js', 'useSearchParams', 'cloze'],
    concepts: ['next-url-state'],
  },

  {
    id: 'next-url-state-cloze-2',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_URL_STATE,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question:
      'Complete the code: the hook that gives programmatic navigation, and the method that navigates without adding a new history entry.',
    template: `"use client";
import { ___ } from "next/navigation";

export default function GoHome() {
  const router = useRouter();
  return <button onClick={() => router.___("/")}>Home</button>;
}`,
    blanks: ['useRouter', 'replace'],
    solution: `"use client";
import { useRouter } from "next/navigation";

export default function GoHome() {
  const router = useRouter();
  return <button onClick={() => router.replace("/")}>Home</button>;
}`,
    explanation: 'useRouter() from next/navigation returns the router in a Client Component. router.replace(url) navigates by swapping the current history entry, so Back skips it; router.push(url) adds a new entry. replace is the usual choice for URL state that changes as the user types, so Back does not step through every keystroke.',
    hints: [
      'The hook for programmatic navigation in Client Components',
      'The method that swaps the current history entry instead of adding one',
    ],
    tags: ['next.js', 'useRouter', 'cloze'],
    concepts: ['next-url-state'],
  },

  // -- Coding 1: Search input synced with URL params --

  {
    id: 'next-url-state-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_URL_STATE,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Write a `SearchBar` Client Component for a search box that keeps its text in the URL\'s "q" param.\n\nRequirements:\n- The input starts with the current "q" value, or empty when there is none\n- Keep the typed text in local state, so the input updates on every keystroke\n- 300 ms after the user stops typing, update the URL: the current path, with "q" set to the text (deleted when the text is empty) and every other param kept\n- Swap the current history entry rather than adding one, so Back does not step through each keystroke\n- Export it as the default export',
    starterCode: `"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function SearchBar() {
  // your code here
}
`,
    testCases: [
      {
        input: 'SearchBar with URL sync',
        expectedOutput: 'useSearchParams to read q, useRouter().replace with debounced updates',
        description: 'Should read q param and push URL updates on input change',
      },
    ],
    solution: `"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function SearchBar() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [query, setQuery] = useState(searchParams.get("q") || "");

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (query) {
        params.set("q", query);
      } else {
        params.delete("q");
      }
      router.replace(\`\${pathname}?\${params.toString()}\`);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, router, pathname, searchParams]);

  return (
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search..."
    />
  );
}

# OR

"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useRef, useState } from "react";

export default function SearchBar() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const timer = useRef(null);

  function handleChange(e) {
    const value = e.target.value;
    setQuery(value);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set("q", value);
      else params.delete("q");
      router.replace(\`\${pathname}?\${params.toString()}\`);
    }, 300);
  }

  return <input type="text" value={query} onChange={handleChange} />;
}`,
    explanation: 'The input and the URL update at different speeds on purpose. Local state (useState, started from searchParams.get("q")) makes each keystroke show at once. The URL change is a navigation that renders the server page again, so it waits: each keystroke schedules it 300 ms later and clears the timer before, either in the effect\'s cleanup or with a ref in the change handler, so only a pause lets it run. The new query is a copy of the current one, new URLSearchParams(searchParams.toString()), with only q set or deleted, so any filter or sort in the URL is kept. router.replace swaps the history entry instead of adding one, so Back leaves the page rather than undoing one letter at a time.',
    hints: [
      'useSearchParams() returns a read-only URLSearchParams object',
      'Use setTimeout + clearTimeout for debounce',
      'router.replace prevents adding a history entry per keystroke',
    ],
    tieredHints: {
      apiSignature: 'useSearchParams().get(key): string | null; router.replace(url); setTimeout(fn, ms) / clearTimeout(id)',
      skeleton: `export default function SearchBar() {
  // read the params, the router and the path
  const [query, setQuery] = useState(____);

  useEffect(() => {
    const timer = ____(() => {
      const params = new URLSearchParams(____);
      // set "q", or delete it when query is empty
      router.____(____);
    }, ____);
    return () => ____;
  }, [query, router, pathname, searchParams]);

  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
}`,
    },
    requires: [
      /useSearchParams\(\)/,
      /setTimeout\(/,
      /clearTimeout\(/,
      /,\s*300\s*\)/,
      /new URLSearchParams\(\s*searchParams/,
      /\.delete\(\s*["']q["']/,
      /router\.replace\(/,
    ],
    tags: ['next.js', 'url-state', 'useSearchParams', 'useRouter', 'debounce'],
    concepts: ['next-url-state'],
  },

  // -- Coding 2: Filterable product list with Server + Client Components --

  {
    id: 'next-url-state-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.NEXT_URL_STATE,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Build a filterable product list in two files.\n\n`app/products/page.tsx`, a Server Component:\n- Await the `searchParams` prop (a promise in Next.js 15) and read "category" (default "all") and "sort" (default "newest")\n- Load the products with `await getProducts({ category, sort })` from "@/lib/products"; each has `id` and `name`\n- Render `<FilterBar category={category} sort={sort} />` above a `<ul>` of the product names\n\n`app/products/FilterBar.tsx`, a Client Component:\n- Two `<select>`s showing the props as their values: category (all, electronics, clothing) and sort (newest, price-asc, price-desc)\n- On a change, navigate to the current path with only that param set and every other param kept',
    starterCode: `// app/products/page.tsx (Server Component)
import FilterBar from "./FilterBar";
import { getProducts } from "@/lib/products";

export default async function ProductsPage({ searchParams }) {
}

// app/products/FilterBar.tsx (Client Component)
export default function FilterBar({ category, sort }) {
}`,
    testCases: [
      {
        input: 'Server reads searchParams, Client updates URL',
        expectedOutput: 'page.tsx reads searchParams.category/sort, FilterBar uses useRouter to push',
        description: 'Should split server param reading from client interaction',
      },
    ],
    solution: `// app/products/page.tsx (Server Component)
import FilterBar from "./FilterBar";
import { getProducts } from "@/lib/products";

export default async function ProductsPage({ searchParams }) {
  const { category = "all", sort = "newest" } = await searchParams;
  const products = await getProducts({ category, sort });

  return (
    <div>
      <FilterBar category={category} sort={sort} />
      <ul>
        {products.map((p) => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
    </div>
  );
}

// app/products/FilterBar.tsx (Client Component)
"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function FilterBar({ category, sort }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(key, value) {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.push(\`\${pathname}?\${params.toString()}\`);
  }

  return (
    <div>
      <select
        value={category}
        onChange={(e) => updateParam("category", e.target.value)}
      >
        <option value="all">All</option>
        <option value="electronics">Electronics</option>
        <option value="clothing">Clothing</option>
      </select>
      <select
        value={sort}
        onChange={(e) => updateParam("sort", e.target.value)}
      >
        <option value="newest">Newest</option>
        <option value="price-asc">Price: low to high</option>
        <option value="price-desc">Price: high to low</option>
      </select>
    </div>
  );
}

# OR

// app/products/page.tsx (Server Component)
import FilterBar from "./FilterBar";
import { getProducts } from "@/lib/products";

export default async function ProductsPage({ searchParams }) {
  const params = await searchParams;
  const category = params.category ?? "all";
  const sort = params.sort ?? "newest";
  const products = await getProducts({ category, sort });

  return (
    <>
      <FilterBar category={category} sort={sort} />
      <ul>
        {products.map((p) => <li key={p.id}>{p.name}</li>)}
      </ul>
    </>
  );
}

// app/products/FilterBar.tsx (Client Component)
"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function FilterBar({ category, sort }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function onChange(e) {
    const params = new URLSearchParams(searchParams);
    params.set(e.target.name, e.target.value);
    router.replace(\`\${pathname}?\${params}\`);
  }

  return (
    <div>
      <select name="category" value={category} onChange={onChange}>
        <option value="all">All</option>
        <option value="electronics">Electronics</option>
        <option value="clothing">Clothing</option>
      </select>
      <select name="sort" value={sort} onChange={onChange}>
        <option value="newest">Newest</option>
        <option value="price-asc">Price: low to high</option>
        <option value="price-desc">Price: high to low</option>
      </select>
    </div>
  );
}`,
    explanation: 'The server reads, the client writes. In Next.js 15 the page\'s searchParams prop is a promise, so the page awaits it (reading searchParams.category without await, the Next.js 14 form, gives undefined) and fetches the filtered products on the server, so the first HTML is already filtered. FilterBar is a Client Component because it handles change events and uses the router: it copies the current params, sets only the one that changed, and navigates. That navigation renders the server page again with the new searchParams, which passes new props down, so the selects stay in step with the URL. push adds a history entry for each filter change, which suits a deliberate choice; replace is also correct if Back should leave the page.',
    hints: [
      'The page\'s searchParams prop is a promise in Next.js 15',
      'The client component copies the current params before changing one',
      'useRouter, usePathname and useSearchParams come from next/navigation',
    ],
    tieredHints: {
      apiSignature: 'async function ProductsPage({ searchParams }: { searchParams: Promise<Record<string, string>> })',
      skeleton: `// page.tsx
export default async function ProductsPage({ searchParams }) {
  const { category = "all", sort = "newest" } = ____;
  const products = ____;
  return (/* FilterBar, then the list */);
}

// FilterBar.tsx
"use client";
export default function FilterBar({ category, sort }) {
  function updateParam(key, value) {
    const params = new URLSearchParams(____);
    params.set(key, value);
    router.____(\`\${pathname}?\${params}\`);
  }
  return (/* two selects that call updateParam */);
}`,
    },
    requires: [
      /await\s+searchParams/,
      /getProducts\(\s*\{/,
      /<FilterBar/,
      /["']use client["']/,
      /new URLSearchParams\(\s*searchParams/,
      /\.set\(/,
      /router\.(push|replace)\(/,
      /onChange=/,
    ],
    tags: ['next.js', 'url-state', 'server-components', 'searchParams', 'filters'],
    concepts: ['next-url-state', 'next-server-vs-client'],
  },

  // -- MC 3: Why URL state instead of useState --

  {
    id: 'next-url-state-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_URL_STATE,
    course: Course.WEB_DEV,
    question: 'Why should you use URL state (searchParams) instead of useState for search and filter functionality in a Next.js app?',
    options: [
      { id: 'a', text: 'useState cannot hold a value in a Server Component, and since App Router pages are Server Components, a filter has nowhere else to live', isCorrect: false },
      { id: 'b', text: 'Changing searchParams updates the page on the client without re-rendering anything, so it is faster than a useState update', isCorrect: false },
      { id: 'c', text: 'The filter then survives a refresh, can be shared as a link, works with Back and Forward, and the server page can read it for the first render', isCorrect: true },
      { id: 'd', text: 'Next.js saves searchParams to the browser\'s storage, so the filter persists between visits even when the user opens the bare URL', isCorrect: false },
    ],
    explanation: 'State kept in the URL does four things useState cannot. It survives a refresh, since the query string is still in the address bar. It can be bookmarked or shared, and the link opens the same filtered view. Back and Forward step through it like any navigation. And the server page reads it from its searchParams prop, so the first HTML is already filtered. useState lives only in that component\'s memory and resets on reload. A change to the URL does re-render the page, and nothing is stored in the browser: opening the bare URL shows no filter.',
    hints: ['Think about what happens when a user refreshes the page', 'Consider how Server Components access state'],
    tags: ['next.js', 'url-state', 'useState', 'ssr', 'ux'],
    concepts: ['next-url-state', 'react-state-immutability', 'next-hydration'],
  },

  // -- MC 4: useSearchParams vs searchParams prop vs usePathname --

  {
    id: 'next-url-state-4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_URL_STATE,
    course: Course.WEB_DEV,
    question: 'What is the difference between useSearchParams (client hook), the searchParams prop (server page), and usePathname in Next.js App Router?',
    options: [
      { id: 'a', text: 'useSearchParams and searchParams are two names for one hook, usable in any component; usePathname returns the full URL, query string included', isCorrect: false },
      { id: 'b', text: 'useSearchParams reads the query in a Client Component; searchParams is a page\'s prop on the server, a promise in Next.js 15; usePathname gives the path without the query', isCorrect: true },
      { id: 'c', text: 'useSearchParams reads the query only in middleware; searchParams works only in Route Handlers; usePathname works only in layout.tsx, and each throws elsewhere', isCorrect: false },
      { id: 'd', text: 'searchParams is the old Pages Router prop; useSearchParams is its App Router replacement for every component; usePathname reads only dynamic segments', isCorrect: false },
    ],
    explanation: 'Each reads a different part of the URL in a different place. useSearchParams() is a Client Component hook from next/navigation that returns a read-only URLSearchParams, so .get("q") gives a string or null, and it updates when the query changes. searchParams is the prop Next.js passes to page.tsx on the server; in Next.js 15 it is a promise, so the page awaits it, and the first HTML is rendered from it with no client JavaScript. usePathname() is a client hook that returns the path, such as "/products", without the query string, which is what you join a new query to or compare for an active nav link. Layouts do not get searchParams, which is one reason a client hook exists.',
    hints: [
      'Think about where each one runs: the server page or the browser',
      'Consider which part of the URL each one returns',
    ],
    tags: ['next.js', 'useSearchParams', 'searchParams', 'usePathname', 'app-router'],
    concepts: ['next-url-state', 'next-app-router'],
  },

  // -- Cloze: building params immutably --

  {
    id: 'next-url-state-cloze-3',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_URL_STATE,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question:
      'Complete the code: copy the current search params into a mutable object, then remove one key from it.',
    template: `const params = new ___(searchParams.toString());
params.___("page");
router.push(\`\${pathname}?\${params.toString()}\`);`,
    blanks: ['URLSearchParams', 'delete'],
    solution: `const params = new URLSearchParams(searchParams.toString());
params.delete("page");
router.push(\`\${pathname}?\${params.toString()}\`);`,
    explanation:
      'searchParams from useSearchParams() is read-only, so you cannot mutate it directly. new URLSearchParams(searchParams.toString()) creates an independent, writable copy that preserves every existing param. .delete("key") removes one param from that copy without touching the others - the same object also exposes .set("key", value) for adding or overwriting one.',
    hints: [
      'The constructor that creates a mutable copy from the read-only searchParams',
      'The method that removes one key from the copy',
    ],
    tags: ['next.js', 'URLSearchParams', 'immutability', 'cloze'],
    concepts: ['next-url-state', 'react-state-immutability'],
  },

  // -- MC: debounced URL updates while typing --

  {
    id: 'next-url-state-5',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.NEXT_URL_STATE,
    course: Course.WEB_DEV,
    question: 'A search input calls router.replace() with the updated "q" param on every keystroke\'s onChange. Typing "laptop" fires 6 navigations in well under a second, and the page (which re-fetches data from searchParams on the server) noticeably stutters while typing. What is the standard fix, and why does it work?',
    options: [
      { id: 'a', text: 'Debounce the router.replace() call (about 300 ms, reset on each key), so the URL and the server render change once typing pauses, while local state updates the input at once', isCorrect: true },
      { id: 'b', text: 'Switch to router.push(): unlike replace it is asynchronous, and Next.js batches the pushes made within one event loop tick into a single navigation', isCorrect: false },
      { id: 'c', text: 'Read searchParams in a useEffect on the client instead of on the server page: the server then stops rendering again on each URL change', isCorrect: false },
      { id: 'd', text: 'Give the input a key tied to the query value, so React skips re-rendering the rest of the page until the user stops typing', isCorrect: false },
    ],
    explanation: 'Two things are tied together here that should not be: what the input shows while typing, and when the expensive step runs. Each router.replace() is a navigation that renders the server page again with the new searchParams. Keeping the input\'s value in local state makes every keystroke show at once, and putting the router.replace() call in a setTimeout that each new keystroke clears means it runs only after a pause, so "laptop" is one navigation instead of 6. push and replace differ only in whether a history entry is added; neither batches or delays calls. Moving the read into a useEffect would lose the server\'s first render, and a key on the input remounts it, losing focus.',
    hints: [
      'Separate the input\'s instant visual feedback (local state) from the expensive side effect (URL update)',
      'router.push vs router.replace differ in history behavior, not in timing',
    ],
    tags: ['next.js', 'debounce', 'useSearchParams', 'performance'],
    concepts: ['next-url-state', 'js-dom-events'],
  },

  // -- Cloze: debounced URL updates while typing --

  {
    id: 'next-url-state-cloze-4',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.NEXT_URL_STATE,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Complete the debounce: schedule the URL update after 300 ms, and cancel it if the user types again before it fires.',
    template: `useEffect(() => {
  const timer = ___(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("q", query);
    router.replace(\`\${pathname}?\${params}\`);
  }, 300);

  return () => ___(timer);
}, [query, pathname, router, searchParams]);`,
    blanks: ['setTimeout', 'clearTimeout'],
    solution: `useEffect(() => {
  const timer = setTimeout(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("q", query);
    router.replace(\`\${pathname}?\${params}\`);
  }, 300);

  return () => clearTimeout(timer);
}, [query, pathname, router, searchParams]);`,
    explanation: 'setTimeout schedules the URL update 300 ms later instead of on every keystroke. The effect\'s cleanup, clearTimeout(timer), runs before the effect runs again, which is on the next keystroke, so the pending update is cancelled. Only when the user pauses for 300 ms does a timer survive and router.replace run. The update copies the current params and sets only q, so any filter or sort already in the URL is kept.',
    hints: [
      'The function that schedules a callback after a delay',
      'The cleanup function that cancels a pending timer',
    ],
    tags: ['next.js', 'debounce', 'setTimeout', 'useEffect', 'cloze'],
    concepts: ['next-url-state', 'js-dom-events'],
  },

  // -- Coding: pagination param pattern --

  {
    id: 'next-url-state-6',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_URL_STATE,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Write a `Pager` Client Component for a paginated list. Its props are `currentPage` and `totalPages`, both numbers.\n\nRequirements:\n- Render a "Previous" link to page `currentPage - 1`, only when `currentPage` is above 1\n- Render a "Next" link to page `currentPage + 1`, only when `currentPage` is below `totalPages`\n- Each link is a next/link `Link` to the current path whose query keeps every existing search param and sets only "page"\n- Export it as the default export',
    starterCode: `"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function Pager({ currentPage, totalPages }) {
  // your code here
}`,
    testCases: [
      {
        input: 'Pager with preserved params',
        expectedOutput: 'buildHref(page) using new URLSearchParams(searchParams) with page set; Previous Link shown only if currentPage > 1; Next Link shown only if currentPage < totalPages',
        description: 'Should build page links that preserve existing params and hide edge-of-range links',
      },
    ],
    solution: `"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function Pager({ currentPage, totalPages }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function buildHref(page) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    return \`\${pathname}?\${params.toString()}\`;
  }

  return (
    <div>
      {currentPage > 1 && (
        <Link href={buildHref(currentPage - 1)}>Previous</Link>
      )}
      {currentPage < totalPages && (
        <Link href={buildHref(currentPage + 1)}>Next</Link>
      )}
    </div>
  );
}

# OR

"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function Pager({ currentPage, totalPages }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = Object.fromEntries(searchParams.entries());

  return (
    <nav>
      {currentPage > 1 && (
        <Link href={{ pathname, query: { ...query, page: currentPage - 1 } }}>Previous</Link>
      )}
      {currentPage < totalPages && (
        <Link href={{ pathname, query: { ...query, page: currentPage + 1 } }}>Next</Link>
      )}
    </nav>
  );
}`,
    explanation: 'Pagination reuses the copy-then-change pattern: new URLSearchParams(searchParams.toString()) copies every param in the URL, set("page", ...) overwrites only that one, and the href joins it to usePathname(), so a search or sort already in the URL survives a page change. Link also takes an object href, { pathname, query }, which builds the same query string. Using Link rather than a button that calls router.push makes each page a real <a href>: it can be opened in a new tab, it is crawlable, and Next.js prefetches it. The conditions hide Previous on page 1 and Next on the last page.',
    hints: [
      'Copy the current params with new URLSearchParams(searchParams.toString())',
      'Overwrite only the "page" key, leave everything else untouched',
      'Render each Link only when its page exists',
    ],
    tieredHints: {
      apiSignature: 'usePathname(): string; useSearchParams(): ReadonlyURLSearchParams; params.set(key, value)',
      skeleton: `export default function Pager({ currentPage, totalPages }) {
  // read the path and the current params

  function buildHref(page) {
    // copy the params, set "page", join to the path
    return ____;
  }

  return (
    <div>
      {____ && <Link href={buildHref(____)}>Previous</Link>}
      {____ && <Link href={buildHref(____)}>Next</Link>}
    </div>
  );
}`,
    },
    requires: [
      /<Link/,
      /new URLSearchParams\(\s*searchParams|fromEntries\(\s*searchParams/,
      /["']?page["']?\s*[,:]/,
      /currentPage\s*-\s*1/,
      /currentPage\s*\+\s*1/,
      /currentPage\s*(>\s*1|>=\s*2|!==?\s*1)|1\s*<\s*currentPage/,
      /currentPage\s*(<\s*totalPages|!==?\s*totalPages)|totalPages\s*>\s*currentPage/,
    ],
    tags: ['next.js', 'pagination', 'Link', 'URLSearchParams', 'app-router'],
    concepts: ['next-url-state'],
  },
  {
    id: 'next-url-state-string-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_URL_STATE,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'A visitor opens /reading?page=3. What text does the page show? Type it exactly, on one line.',
    code: `// app/reading/page.tsx
type Props = { searchParams: Promise<{ page?: string }> };

export default async function ReadingPage({ searchParams }: Props) {
  const { page = "1" } = await searchParams;
  return <p>Page {page}, next {page + 1}</p>;
}`,
    expectedOutput: 'Page 3, next 31',
    explanation: 'A URL holds only text, so every search param arrives as a string: page is "3", not 3. In JavaScript, "3" + 1 joins the two into "31" instead of adding them. Convert a param before doing arithmetic with it, as in Number(page) + 1, which gives 4. The same holds for useSearchParams().get("page") in a Client Component, which returns a string or null.',
    hints: ['What type is every value read from a URL?', 'What does + do when one side is a string?'],
    tags: ['next.js', 'searchParams', 'url-state', 'strings', 'predict'],
    concepts: ['next-url-state'],
  },

  // =====================================================================
  // NEXT_ERROR_HANDLING (12 questions)
  // =====================================================================

  // BEGINNER faded (Parsons + Cloze): lower-load scaffold before cold coding

  {
    id: 'next-error-handling-parsons-1',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_ERROR_HANDLING,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question:
      'Assemble an error.tsx boundary for an App Router route segment. It receives error and reset props, shows the error message, and offers a retry button. Keep the directive on the first line.',
    correctOrder: [
      '"use client";',
      'export default function Error({ error, reset }) {',
      '  return (',
      '    <div>',
      '      <p>{error.message}</p>',
      '      <button onClick={() => reset()}>Try Again</button>',
      '    </div>',
      '  );',
      '}',
    ],
    distractorLines: [
      '"use server";',
      '      <button onClick={reset()}>Try Again</button>',
    ],
    solution: `"use client";
export default function Error({ error, reset }) {
  return (
    <div>
      <p>{error.message}</p>
      <button onClick={() => reset()}>Try Again</button>
    </div>
  );
}`,
    explanation: 'error.tsx must start with "use client": Next.js renders it as a React error boundary, and boundaries are a client feature ("use server" marks Server Actions, not components). The button needs a function, onClick={() => reset()}, so reset runs on click; onClick={reset()} would call reset while the error UI renders and hand onClick its return value. error.message is the thrown error\'s text, but in production a Server Component\'s error arrives with a generic message and a digest instead, so a real app shows a friendly sentence and logs error.digest.',
    hints: [
      'error.tsx is a Client Component, so the directive matters',
      'Pass a function to onClick; do not call reset while rendering',
      'The error prop has a message property',
    ],
    tags: ['next.js', 'error-handling', 'error.tsx', 'parsons'],
    concepts: ['next-error-boundary', 'js-error-handling'],
  },

  {
    id: 'next-error-handling-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_ERROR_HANDLING,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question:
      'Complete the error boundary: the directive that makes this a Client Component, and the second prop Next.js passes for retrying the segment.',
    template: `"use ___";

export default function Error({ error, ___ }) {
  return <p>{error.message}</p>;
}`,
    blanks: ['client', 'reset'],
    solution: `"use client";

export default function Error({ error, reset }) {
  return <p>{error.message}</p>;
}`,
    explanation:
      'error.tsx requires the "use client" directive because error boundaries are a client-side React feature. Next.js passes two props: error (the thrown error) and reset (a function that renders the segment again to try to recover). Being a Client Component does not limit what it catches: errors thrown while Server Components render reach it too.',
    hints: [
      'The directive marking a Client Component',
      'The prop that re-renders the failed segment',
    ],
    tags: ['next.js', 'error.tsx', 'cloze'],
    concepts: ['next-error-boundary'],
  },

  {
    id: 'next-error-handling-cloze-2',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_ERROR_HANDLING,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question:
      'Complete the error UI: read the human-readable text off the error, and wire the button so it retries the segment when clicked (not during render).',
    template: `export default function Error({ error, reset }) {
  return (
    <div>
      <p>{error.___}</p>
      <button onClick={() => ___()}>Try Again</button>
    </div>
  );
}`,
    blanks: ['message', 'reset'],
    solution: `export default function Error({ error, reset }) {
  return (
    <div>
      <p>{error.message}</p>
      <button onClick={() => reset()}>Try Again</button>
    </div>
  );
}`,
    explanation: 'error.message holds the thrown error\'s text (in production, a Server Component\'s error arrives with a generic message and a digest instead). The button gives onClick an arrow function, so reset runs only on click; onClick={reset()} would call it while the error UI renders. reset() renders the segment again, which recovers if the failure was temporary.',
    hints: [
      'The Error property holding the readable text',
      'The prop the button calls to retry',
    ],
    tags: ['next.js', 'error.tsx', 'cloze'],
    concepts: ['next-error-boundary'],
  },

  // -- Coding 1: error.tsx boundary --

  {
    id: 'next-error-handling-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_ERROR_HANDLING,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Write the `error.tsx` file for an App Router route segment.\n\nRequirements:\n- Make it a Client Component\n- It receives the `error` and `reset` props\n- Log the error to the console in an effect when it changes\n- Show a heading "Something went wrong", the error\'s message, and a "Try Again" button that calls `reset()` when clicked\n- Export the component as the default export',
    starterCode: `// app/dashboard/error.tsx
export default function ErrorBoundary({ error, reset }) {
}`,
    testCases: [
      {
        input: 'error.tsx with error and reset',
        expectedOutput: '"use client" directive, error.message displayed, reset() called on button click',
        description: 'Should be a Client Component that shows error and has reset button',
      },
    ],
    solution: `// app/dashboard/error.tsx
"use client";

import { useEffect } from "react";

export default function ErrorBoundary({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong</h2>
      <p>{error.message}</p>
      <button onClick={() => reset()}>Try Again</button>
    </div>
  );
}

# OR

// app/dashboard/error.tsx
"use client";

import { useEffect } from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Route error:", error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Try Again</button>
    </div>
  );
}`,
    explanation: 'error.tsx must be a Client Component ("use client") because Next.js renders it as a React error boundary around the segment\'s page, and boundaries are a client feature. It receives error, the thrown Error (with a digest in production), and reset, which renders the segment again. onClick={() => reset()} and onClick={reset} both call it on click; onClick={reset()} would call it during render. The useEffect logs the error after the error UI appears, the place to report it to a monitoring service. The layout above this file stays on screen, so users can still navigate away. In production, a Server Component\'s error.message is a generic sentence and the real message is only in the server log.',
    hints: [
      '"use client" is required: error boundaries are client-side',
      'error has a message property and, in production, a digest',
      'reset() renders the segment again without a full page reload',
    ],
    tieredHints: {
      apiSignature: 'function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void })',
      skeleton: `"use client";

export default function ErrorBoundary({ error, reset }) {
  useEffect(() => {
    // log the error
  }, [____]);

  return (
    <div>
      <h2>Something went wrong</h2>
      <p>{error.____}</p>
      <button onClick={____}>Try Again</button>
    </div>
  );
}`,
    },
    requires: [
      /["']use client["']/,
      /useEffect\(/,
      /console\.error\(/,
      'error.message',
      /onClick=\{\s*(reset|\(\)\s*=>\s*(reset\(\)|\{\s*reset\(\);?\s*\}))\s*\}/,
    ],
    tags: ['next.js', 'error-handling', 'error.tsx', 'error-boundary'],
    concepts: ['js-error-handling', 'next-error-boundary'],
  },

  // -- Coding 2: Server Action with structured errors --

  {
    id: 'next-error-handling-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.NEXT_ERROR_HANDLING,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Write a Server Action `createUser` that takes the submitted `FormData`, returns the failures a user can fix as data, and lets every other failure reach the route\'s error.tsx.\n\nRequirements:\n- Mark the file as Server Actions\n- Define a result type named `ActionResult` with a `success` boolean and an optional `errors` that maps each field name to an array of messages, and make `createUser` resolve to it\n- Validate "name" (at least 2 characters) and "email" (a valid email) from the form data with Zod\'s `safeParse`; on failure return `success` false with the field `errors`\n- Then await `saveUser` (from "@/lib/db") with the parsed data. It throws an `EmailTakenError` (also exported from "@/lib/db") when the email is already registered: catch that one and return `success` false with the errors `{ email: ["Email already registered"] }`\n- Throw any other error from `saveUser` on unchanged, so error.tsx shows it\n- When the save works, return `success` true',
    starterCode: `"use server";

import { z } from "zod";
import { saveUser, EmailTakenError } from "@/lib/db";
`,
    testCases: [
      {
        input: 'Server Action with Zod validation',
        expectedOutput: 'safeParse, return { success: false, errors } on failure, { success: true } on success',
        description: 'Should return structured field-level errors instead of throwing',
      },
    ],
    solution: `"use server";

import { z } from "zod";
import { saveUser, EmailTakenError } from "@/lib/db";

type ActionResult = {
  success: boolean;
  errors?: Record<string, string[]>;
};

const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email address"),
});

export async function createUser(formData: FormData): Promise<ActionResult> {
  const result = userSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
  });
  if (!result.success) {
    return { success: false, errors: z.flattenError(result.error).fieldErrors };
  }

  try {
    await saveUser(result.data);
  } catch (error) {
    if (error instanceof EmailTakenError) {
      return { success: false, errors: { email: ["Email already registered"] } };
    }
    throw error;
  }

  return { success: true };
}

# OR

"use server";

import { z } from "zod";
import { saveUser, EmailTakenError } from "@/lib/db";

type ActionResult = {
  success: boolean;
  errors?: Record<string, string[]>;
};

const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

export async function createUser(formData: FormData): Promise<ActionResult> {
  const parsed = userSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    await saveUser(parsed.data);
    return { success: true };
  } catch (err) {
    if (!(err instanceof EmailTakenError)) throw err;
    return { success: false, errors: { email: ["Email already registered"] } };
  }
}`,
    explanation: 'A Server Action meets two kinds of failure, and they go to different places. Expected failures are ones the user can fix: a short name, a bad email, an email someone already registered. Return them as data, so the form (with useActionState, for example) shows each message next to its field and keeps what the user typed. safeParse never throws, so validation is a plain branch on result.success; z.email() and z.flattenError(error) are the Zod 4 forms, and z.string().email() and error.flatten() the Zod 3 ones, deprecated in Zod 4 but still working. The duplicate email only shows up when saveUser throws, so the catch picks out that one error with instanceof and turns it into a field error. Unexpected failures, such as the database being down, are not the user\'s to fix: rethrowing them sends them to the nearest error.tsx, which shows the error UI and, in production, a digest that points to the server log. A catch that returned data for every error would hide an outage behind a form message, and one that caught nothing would replace the whole form for a mistake the user could have fixed.',
    hints: [
      'safeParse returns { success, data, error } instead of throwing',
      'Wrap only the saveUser call in try/catch, and check the error with instanceof',
      'Anything that is not an EmailTakenError is thrown again unchanged',
    ],
    tieredHints: {
      apiSignature: 'async function createUser(formData: FormData): Promise<ActionResult>; error instanceof EmailTakenError',
      skeleton: `"use server";

export async function createUser(formData: FormData): Promise<ActionResult> {
  const result = userSchema.____({ name: formData.get("name"), email: formData.get("email") });
  if (!result.success) {
    return { success: false, errors: ____ };
  }

  try {
    await saveUser(____);
  } catch (error) {
    // the duplicate email: return it as a field error
    // anything else: ____
  }
  return { success: true };
}`,
    },
    requires: [
      /["']use server["']/,
      'ActionResult',
      /\.min\(\s*2/,
      /z\.email\(|\.email\(/,
      /\.safeParse\(/,
      /flattenError\(|\.flatten\(\)|fieldErrors|\.issues/,
      /try\s*\{[\s\S]*await\s+saveUser\(\s*(?!formData\b)\w+(\.data)?\s*\)/,
      /instanceof\s+EmailTakenError/,
      /["']Email already registered["']/,
      /catch\s*\(\s*(\w+)\s*(:\s*\w+\s*)?\)[\s\S]*throw\s+\1\b/,
      /success:\s*false/,
      /success:\s*true/,
    ],
    tags: ['next.js', 'server-actions', 'zod', 'validation', 'error-handling'],
    concepts: ['next-server-actions', 'forms-zod-schema', 'js-error-handling'],
  },

  // -- MC 3: How error.tsx works --

  {
    id: 'next-error-handling-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_ERROR_HANDLING,
    course: Course.WEB_DEV,
    question: 'How does error.tsx work in the Next.js App Router?',
    options: [
      { id: 'a', text: 'It catches every error in the app below its folder, including errors in that folder\'s layout.tsx, in middleware and in API route handlers', isCorrect: false },
      { id: 'b', text: 'It replaces the whole rendered page: the layout, navigation bar and footer all disappear whenever any component below it throws', isCorrect: false },
      { id: 'c', text: 'It catches only errors thrown in Client Components; an error thrown in a Server Component always produces a generic 500 page', isCorrect: false },
      { id: 'd', text: 'It catches errors in its folder\'s page and below, but not in that folder\'s layout, which stays on screen so users can navigate away', isCorrect: true },
    ],
    explanation: 'Next.js places error.tsx as a React error boundary inside its folder\'s layout.tsx, around the page and every segment below it. When rendering there throws, a Server Component or a Client Component alike, only that inner part is swapped for the error UI, and the layout (its heading, its navigation) stays on screen and usable. An error in that layout itself is outside the boundary, so it goes to the error.tsx one folder up, and an error in the root layout goes to global-error.tsx, which renders its own <html> and <body>. Middleware and route handlers do not render inside any boundary.',
    hints: ['Think about where error.tsx sits in the component tree relative to layout.tsx', 'What happens when the layout itself throws?'],
    tags: ['next.js', 'error.tsx', 'error-boundary', 'layout', 'app-router'],
    concepts: ['next-error-boundary', 'next-app-router'],
  },

  // -- MC 4: error.tsx vs global-error.tsx --

  {
    id: 'next-error-handling-4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_ERROR_HANDLING,
    course: Course.WEB_DEV,
    question: 'What is the difference between error.tsx and global-error.tsx in Next.js App Router?',
    options: [
      { id: 'a', text: 'error.tsx catches errors below its folder\'s layout, which stays; global-error.tsx catches root layout errors and renders its own <html> and <body>', isCorrect: true },
      { id: 'b', text: 'error.tsx runs only in development to show a stack trace; global-error.tsx runs only in production, where it shows the same UI to every user', isCorrect: false },
      { id: 'c', text: 'error.tsx catches errors thrown in Client Components; global-error.tsx catches errors thrown in Server Components, so an app needs both', isCorrect: false },
      { id: 'd', text: 'global-error.tsx is the Pages Router name for error.tsx, kept for older apps; in the App Router the two behave the same way', isCorrect: false },
    ],
    explanation: 'They sit at different levels of the boundary tree. error.tsx in a folder catches errors in that folder\'s page and the segments below it, and its layout stays on screen. Nothing above the root layout can catch an error in the root layout itself, so Next.js uses app/global-error.tsx for that case. Because it replaces the root layout while it is shown, it must render its own <html> and <body>. Both are Client Components, and both catch errors from Server and Client Components alike. global-error.tsx is rarely shown, but without it a root layout error gets Next.js\'s default error page.',
    hints: ['Think about what wraps what in the component tree', 'If the root layout fails, what renders the html/body?'],
    tags: ['next.js', 'error.tsx', 'global-error.tsx', 'root-layout', 'error-boundary'],
    concepts: ['next-error-boundary'],
  },

  // -- MC 5: Handling errors in Server Actions --

  {
    id: 'next-error-handling-5',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_ERROR_HANDLING,
    course: Course.WEB_DEV,
    question: 'How should you handle errors in Next.js Server Actions?',
    options: [
      { id: 'a', text: 'Throw on any validation failure, so the nearest error.tsx catches it and shows one consistent error page across the app', isCorrect: false },
      { id: 'b', text: 'Catch the failure inside the action and redirect to an /error page, with the failure message encoded in the URL', isCorrect: false },
      { id: 'c', text: 'Do not throw for expected failures: return a result such as { success, errors }, which the form reads to show field errors', isCorrect: true },
      { id: 'd', text: 'Catch the failure inside the action and call notFound(), so the nearest not-found.tsx shows instead of an error page', isCorrect: false },
    ],
    explanation: 'A Server Action should return expected failures as data. When an action throws, the error reaches the nearest error.tsx, which replaces the page section, form and typed values included: far too much for a mistyped email. Returning { success: false, errors: { email: ["Invalid email"] } } lets the form (with useActionState, for example) show each message next to its field while keeping what the user typed. Keep throwing for the unexpected, such as the database being down, where error.tsx is the right place. A redirect with the message in the URL loses the form state too, and notFound() is for a missing resource, not invalid input.',
    hints: [
      'Think about what happens to the form when error.tsx renders',
      'Consider the difference between validation errors and system errors',
    ],
    tags: ['next.js', 'server-actions', 'error-handling', 'form-validation'],
    concepts: ['next-server-actions', 'js-error-handling'],
  },

  // -- Coding 3: Route Handler try/catch -> 500 JSON response --

  {
    id: 'next-error-handling-6',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_ERROR_HANDLING,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Write a GET Route Handler at app/api/orders/[id]/route.ts that fetches an order by id from the database (assume `getOrderById(id)` is provided and can throw). Wrap the call in try/catch: on success return the order as JSON with status 200; on any thrown error, log it with console.error and return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 }).',
    starterCode: `import { NextRequest, NextResponse } from "next/server";
import { getOrderById } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // your code here
}`,
    testCases: [
      {
        input: 'try/catch around getOrderById',
        expectedOutput: 'try { NextResponse.json(order) } catch (error) { console.error(error); NextResponse.json({ error: "Failed to fetch order" }, { status: 500 }) }',
        description: 'Should catch thrown errors and return a 500 JSON response instead of letting the handler crash',
      },
    ],
    solution: `import { NextRequest, NextResponse } from "next/server";
import { getOrderById } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const order = await getOrderById(id);
    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

# OR

import { NextRequest, NextResponse } from "next/server";
import { getOrderById } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await getOrderById(id);
    return NextResponse.json(order);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}`,
    explanation: 'A Route Handler is outside every error.tsx boundary; boundaries wrap rendered pages, not API responses. If getOrderById throws and nothing catches it, Next.js logs the error and answers a 500 with an empty body, which a caller expecting JSON cannot parse. The try/catch logs the real error on the server and returns a small, stable JSON shape with status 500 that the client can check. getOrderById must be awaited inside the try: without await the promise is returned, and its rejection escapes the catch. NextResponse.json(order) already uses status 200, so passing it is optional.',
    hints: [
      'Route Handlers are not covered by error.tsx: an uncaught throw gives a 500 with an empty body',
      'Log the real error on the server, but return a small, stable error shape to the client',
      'NextResponse.json takes the body first, then an options object with status',
    ],
    tieredHints: {
      apiSignature: 'async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }); NextResponse.json(body, { status })',
      skeleton: `export async function GET(request, { params }) {
  const { id } = ____;
  try {
    // load the order, answer it as JSON
  } catch (error) {
    // log it with ____, then answer { error: "Failed to fetch order" } with { status: ____ }
  }
}`,
    },
    requires: [
      /await\s+params/,
      /try\s*\{[\s\S]*await\s+getOrderById\(/,
      /catch\s*(\(\s*\w+\s*(:\s*\w+\s*)?\))?\s*\{[\s\S]*console\.error\(/,
      /NextResponse\.json\(\s*order/,
      /["']Failed to fetch order["']/,
      /status:\s*500/,
    ],
    tags: ['next.js', 'route-handlers', 'try-catch', 'error-handling', 'NextResponse'],
    concepts: ['next-error-boundary', 'next-api-routes', 'js-error-handling'],
  },

  // -- MC 6: errors in event handlers/async code bypass error.tsx --

  {
    id: 'next-error-handling-7',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_ERROR_HANDLING,
    course: Course.WEB_DEV,
    question: 'A button\'s onClick handler calls an API and the fetch throws inside an async function with no try/catch. Your teammate expects the nearest error.tsx boundary to catch it and show the fallback UI. Instead, the page stays exactly as it was and the error only shows up in the browser console. Why?',
    options: [
      { id: 'a', text: 'error.tsx is shown only in production builds; in development React silently swallows the error, so the code is fine as it is', isCorrect: false },
      { id: 'b', text: 'error.tsx sees a rejected promise only when the handler is written inline as onClick={async () => ...}, which lets Next.js trace it', isCorrect: false },
      { id: 'c', text: 'error.tsx catches only errors from Server Components, and this fetch runs in a Client Component\'s handler, so no boundary would ever see it', isCorrect: false },
      { id: 'd', text: 'Error boundaries catch only errors thrown while rendering; an event handler runs after render, so the error never reaches one and needs a try/catch', isCorrect: true },
    ],
    explanation: 'React error boundaries, which error.tsx is, catch errors thrown while React renders the tree below them. A click handler, a setTimeout callback or a promise rejection runs later, outside rendering, so React never sees the error and it ends up as an uncaught error or rejection in the console while the page stays as it was. Fetches started from handlers need their own try/catch (or .catch), usually with state that shows a message. One React 19 exception: an async function passed to startTransition from useTransition does reach the nearest boundary when it throws, because React runs it as part of a transition. A plain onClick, as here, does not.',
    hints: [
      'Think about WHEN React error boundaries actually run - during which phase of the component lifecycle',
      'An event handler runs after the component has already finished rendering and committing',
    ],
    tags: ['next.js', 'error-boundary', 'event-handlers', 'async', 'misconception'],
    concepts: ['next-error-boundary', 'js-error-handling', 'js-promises-async'],
  },

  // -- MC 7: logging/monitoring hook-in (digest, reportError) --

  {
    id: 'next-error-handling-8',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.NEXT_ERROR_HANDLING,
    course: Course.WEB_DEV,
    question: 'Your error.tsx boundary currently only shows the error message to the user. In production, error.message is often a generic, sanitized string, and you have no way to look up what actually happened server-side for a specific crash a user reports. What should you add, and why?',
    options: [
      { id: 'a', text: 'Show error.stack in error.tsx so users can screenshot it for support; in production Next.js sends the full server stack to the browser for this', isCorrect: false },
      { id: 'b', text: 'Nothing: error.message already holds the full server error in production, since Next.js treats thrown errors the same in every build', isCorrect: false },
      { id: 'c', text: 'Log error.digest, the id the server printed beside the real error, from a useEffect in error.tsx to a service such as Sentry, and look it up in the server logs', isCorrect: true },
      { id: 'd', text: 'Log from the root layout.tsx instead, since error.tsx is rendered by Next.js and cannot run effects or make network calls itself', isCorrect: false },
    ],
    explanation: 'In production Next.js replaces a Server Component error\'s message with a generic one before it reaches the browser, so secrets in error text do not leak, and attaches a digest: the same id the server printed beside the full error in its log. error.tsx is an ordinary Client Component, so a useEffect can send { digest: error.digest, message: error.message } to a monitoring service, and showing the digest as a reference number lets support find the log line a user reports. Showing stack traces would leak implementation details, and the browser does not get the server\'s stack anyway.',
    hints: [
      'Next.js intentionally sanitizes server error messages before they reach the client in production',
      'error.tsx receives a second identifying property alongside message specifically for this purpose',
    ],
    tags: ['next.js', 'error.tsx', 'digest', 'monitoring', 'logging', 'production'],
    concepts: ['next-error-boundary'],
  },
  {
    id: 'next-error-handling-layout-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_ERROR_HANDLING,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'A visitor opens /shop/poetry, and getBooks throws. What text does the page show? Type each piece of visible text in page order, one per line (a button\'s label counts).',
    code: `// app/shop/layout.tsx
export default function ShopLayout({ children }) {
  return <main><h1>Bookshop</h1>{children}</main>;
}

// app/shop/[shelf]/page.tsx
export default async function ShelfPage({ params }) {
  const { shelf } = await params;
  const books = await getBooks(shelf); // throws
  return <p>{books.join(", ")}</p>;
}

// app/shop/error.tsx
"use client";
export default function ShopError({ reset }) {
  return (
    <>
      <p>Could not load the shelves</p>
      <button onClick={() => reset()}>Try again</button>
    </>
  );
}`,
    expectedOutput: `Bookshop
Could not load the shelves
Try again`,
    explanation: 'error.tsx wraps what sits below the layout of its folder: Next.js renders it as an error boundary inside ShopLayout, around the pages of /shop. When the page throws, only that inner part is swapped for the error UI, so the layout\'s Bookshop heading stays on screen above it and the layout stays usable. The Try again button calls reset(), which renders the segment again. An error in ShopLayout itself would not be caught here; it goes to an error.tsx one folder up (or global-error.tsx for the root layout).',
    hints: ['Where does error.tsx sit in the tree: above or below the layout of its folder?', 'Which part of the page does the error UI replace?'],
    tags: ['next.js', 'error.tsx', 'error-boundary', 'layout', 'predict'],
    concepts: ['next-error-boundary', 'next-app-router'],
  },

  // =====================================================================
  // NEXT_AUTH_DEEP (15 questions)
  // =====================================================================

  // BEGINNER faded (Parsons + Cloze): lower-load scaffold before cold coding

  {
    id: 'next-auth-deep-parsons-1',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_AUTH_DEEP,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question:
      'Assemble a protected dashboard page (Server Component) that reads the session and redirects unauthenticated visitors to /login. Arrange the lines in this order: imports, async function declaration, read the session, guard, render.',
    correctOrder: [
      'import { auth } from "@/auth";',
      'import { redirect } from "next/navigation";',
      'export default async function DashboardPage() {',
      '  const session = await auth();',
      '  if (!session) {',
      '    redirect("/login");',
      '  }',
      '  return <p>Welcome, {session.user?.name}!</p>;',
      '}',
    ],
    distractorLines: [
      '  const session = auth();',
      '  const session = useSession();',
    ],
    solution: `import { auth } from "@/auth";
import { redirect } from "next/navigation";
export default async function DashboardPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }
  return <p>Welcome, {session.user?.name}!</p>;
}`,
    explanation: 'auth() is async, so it must be awaited: const session = auth() leaves session as a pending Promise, which is always truthy, so the guard never fires. useSession() is the client hook and cannot run in a Server Component. Checking the session on the server means a signed-out visitor never receives the protected HTML, and redirect() throws Next.js\'s redirect signal, so nothing after it runs and TypeScript knows session is set below the guard.',
    hints: [
      'auth() returns a Promise, so await it',
      'useSession() is client-side; this page is a Server Component',
      'redirect() ends the render when there is no session',
    ],
    tags: ['next-auth', 'auth', 'protected-routes', 'parsons'],
    concepts: ['web-security-auth-tokens', 'next-server-vs-client'],
  },

  {
    id: 'next-auth-deep-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_AUTH_DEEP,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question:
      'Complete the protected Server Component: resolve the async session, then send unauthenticated visitors away.',
    template: `export default async function DashboardPage() {
  const session = ___ auth();
  if (!session) {
    ___("/login");
  }
  return <p>Welcome!</p>;
}`,
    blanks: ['await', 'redirect'],
    solution: `export default async function DashboardPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }
  return <p>Welcome!</p>;
}`,
    explanation: 'auth() is asynchronous, so await gives the session object, or null when nobody is signed in. redirect() from next/navigation throws Next.js\'s redirect signal, so the render stops there and the visitor gets a redirect to /login; nothing after it runs.',
    hints: [
      'The keyword that resolves a Promise',
      'The next/navigation function that sends the user elsewhere',
    ],
    tags: ['next-auth', 'auth', 'redirect', 'cloze'],
    concepts: ['web-security-auth-tokens'],
  },

  {
    id: 'next-auth-deep-cloze-2',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_AUTH_DEEP,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Complete the protected page: the Auth.js function that reads the session on the server, and the session property that holds the signed-in person\'s details.',
    template: `const session = await ___();
if (!session) redirect("/login");
return <p>Email: {session.___?.email}</p>;`,
    blanks: [
      'auth',
      'user',
    ],
    solution: `const session = await auth();
if (!session) redirect("/login");
return <p>Email: {session.user?.email}</p>;`,
    explanation: 'auth() is the function the Auth.js config in auth.ts exports; in a Server Component it reads the session cookie and returns the session, or null when the visitor is not signed in, so the null check redirects them to the login page. A session\'s user property holds the profile: name, email and image by default, plus any field a session callback adds.',
    hints: [
      'The function auth.ts exports for reading the session on the server',
      'The session property holding the profile',
    ],
    tags: ['next-auth', 'session', 'cloze'],
    concepts: ['web-security-auth-tokens'],
  },

  // -- Coding 1: NextAuth v5 setup with providers --

  {
    id: 'next-auth-deep-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.NEXT_AUTH_DEEP,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Write `auth.ts` for Auth.js (NextAuth v5) with a Google provider and a Credentials provider.\n\nRequirements:\n- Google reads its client id and secret from `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in the environment\n- Credentials takes an email and a password; its `authorize` returns `null` when either is missing, when `getUserByEmail(email)` (from "@/lib/db") finds no user, or when the password does not match `user.hashedPassword` (check it with `bcryptjs`); otherwise it returns `{ id, name, email }` of the user\n- Export `handlers`, `auth`, `signIn` and `signOut` from the `NextAuth(...)` call',
    starterCode: `// auth.ts
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "@/lib/db";
`,
    testCases: [
      {
        input: 'NextAuth v5 config with Google + Credentials',
        expectedOutput: 'NextAuth({ providers: [Google({...}), Credentials({...})] }), export { auth, signIn, signOut }',
        description: 'Should configure both providers and export auth handlers',
      },
    ],
    solution: `// auth.ts
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "@/lib/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;
        if (typeof email !== "string" || typeof password !== "string") return null;

        const user = await getUserByEmail(email);
        if (!user) return null;

        const passwordMatch = await bcrypt.compare(password, user.hashedPassword);
        if (!passwordMatch) return null;

        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],
});

# OR

// auth.ts
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { getUserByEmail } from "@/lib/db";

const credentialsSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const user = await getUserByEmail(parsed.data.email);
        if (!user) return null;

        const passwordMatch = await bcrypt.compare(parsed.data.password, user.hashedPassword);
        if (!passwordMatch) return null;

        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],
});`,
    explanation: 'In Auth.js v5 one auth.ts file configures everything, and NextAuth() returns { handlers, auth, signIn, signOut }: handlers are re-exported as GET and POST from app/api/auth/[...nextauth]/route.ts, and the rest are used across the app. That replaces NextAuth v4\'s authOptions object passed around to getServerSession. Google needs only the client id and secret (v5 also reads AUTH_GOOGLE_ID and AUTH_GOOGLE_SECRET by itself if you name them that way). A Credentials provider\'s authorize receives the submitted fields, typed as unknown values, so check them (with typeof or a Zod schema) before the database query; return null for any failure, which Auth.js reports as a failed sign-in without saying which part was wrong. bcrypt.compare is awaited because hashing is deliberately slow; never compare plain-text passwords. Only JWT sessions work with Credentials.',
    hints: [
      'NextAuth v5 returns { handlers, auth, signIn, signOut }',
      'authorize() must return a user object or null',
      'Check the submitted values before querying the database',
      'bcrypt.compare(plain, hash) returns a promise',
    ],
    tieredHints: {
      apiSignature: 'const { handlers, auth, signIn, signOut } = NextAuth({ providers: [Google({ clientId, clientSecret }), Credentials({ credentials, authorize })] })',
      skeleton: `export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.____,
      clientSecret: process.env.____,
    }),
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        // check both values are strings, else return null
        const user = await ____;
        // no user: return null
        const match = await bcrypt.____(____, user.hashedPassword);
        // no match: return null
        return ____;
      },
    }),
  ],
});`,
    },
    requires: [
      /export\s+const\s*\{[^}]*handlers[^}]*\}\s*=\s*NextAuth\(/,
      /export\s+const\s*\{[^}]*\bauth\b[^}]*\bsignIn\b[^}]*\bsignOut\b[^}]*\}/,
      /Google\(\s*\{[\s\S]*process\.env\.GOOGLE_CLIENT_ID[\s\S]*process\.env\.GOOGLE_CLIENT_SECRET/,
      /Credentials\(\s*\{/,
      /authorize/,
      /await\s+getUserByEmail\(/,
      /await\s+bcrypt\.compare\(/,
      /hashedPassword/,
      /return\s+null/,
    ],
    tags: ['next-auth', 'authentication', 'google-oauth', 'credentials', 'auth.js'],
    concepts: ['web-security-auth-tokens'],
  },

  // -- Coding 2: Protected page with auth() --

  {
    id: 'next-auth-deep-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_AUTH_DEEP,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Write a protected dashboard page, `app/dashboard/page.tsx`, as a Server Component.\n\nRequirements:\n- Read the session with `auth()` from your Auth.js config ("@/auth")\n- If there is no session, redirect to "/login"\n- Otherwise show a "Dashboard" heading, "Welcome, " followed by the user\'s name, and "Email: " followed by the user\'s email',
    starterCode: `// app/dashboard/page.tsx\nimport { auth } from "@/auth";\nimport { redirect } from "next/navigation";\n\nexport default async function DashboardPage() {\n  // Check session, redirect if unauthenticated, show user info\n}\n`,
    testCases: [
      {
        input: 'Protected page with auth()',
        expectedOutput: 'auth() call, redirect if !session, render user info from session.user',
        description: 'Should check session server-side and redirect or render',
      },
    ],
    solution: `// app/dashboard/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {session.user?.name}</p>
      <p>Email: {session.user?.email}</p>
    </div>
  );
}

# OR

// app/dashboard/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const { name, email } = session.user;

  return (
    <main>
      <h1>Dashboard</h1>
      <p>Welcome, {name}</p>
      <p>Email: {email}</p>
    </main>
  );
}`,
    explanation: 'auth() is an async function that reads the session on the server, so a Server Component awaits it with no hook or provider. The check runs before any HTML is sent, so a signed-out visitor never receives the dashboard\'s content, not even for a flash. redirect() from next/navigation throws Next.js\'s redirect signal, which ends the render and answers with a redirect to /login; nothing after it runs. session.user holds the profile (name, email, image), and the ?. guards the case where a provider sent no profile.',
    hints: [
      'auth() is async, so await it in a Server Component',
      'redirect() stops the render and sends a redirect response',
      'session.user contains name, email and image from the provider',
    ],
    tieredHints: {
      apiSignature: 'async function DashboardPage()',
      skeleton: `export default async function DashboardPage() {
  const session = await ____();

  if (!session) {
    ____("/login");
  }

  return <div>Welcome, {session.____?.name}!</div>;
}`,
    },
    requires: [
      /await\s+auth\(\)/,
      /if\s*\(\s*!\s*session/,
      /redirect\(\s*["']\/login["']\s*\)/,
      /name/,
      /email/,
    ],
    tags: ['next-auth', 'protected-routes', 'server-components', 'auth', 'redirect'],
    concepts: ['web-security-auth-tokens', 'next-server-vs-client'],
  },

  // -- MC 3: auth() vs useSession() vs middleware --

  {
    id: 'next-auth-deep-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_AUTH_DEEP,
    course: Course.WEB_DEV,
    question: 'What is the difference between auth() in Server Components, useSession() in Client Components, and middleware-based auth in NextAuth?',
    options: [
      { id: 'a', text: 'auth(), useSession() and middleware run the same check in the same place, the server, before rendering; pick whichever fits the file you are in', isCorrect: false },
      { id: 'b', text: 'auth() checks a database session, useSession() checks the JWT cookie, and middleware checks only that a cookie exists; each validates a different thing', isCorrect: false },
      { id: 'c', text: 'auth() reads the session on the server while rendering, for page protection; useSession() reads it in the browser, for UI; middleware runs before rendering, for route protection', isCorrect: true },
      { id: 'd', text: 'auth() works only in Route Handlers, useSession() works only in page.tsx files, and middleware runs only for requests to static assets', isCorrect: false },
    ],
    explanation: 'They run at different points of a request. Middleware runs first, before any rendering, so it can redirect whole route groups cheaply (it reads only the session cookie). auth() runs on the server while a Server Component, Route Handler or Server Action runs, so it protects a page and gives you the session data to render with. useSession() runs in the browser after hydration, inside a SessionProvider, for showing or hiding UI such as a sign-out button. All three read the same session. Middleware alone is not enough: check again with auth() where the data is read, since a request can reach a page or action by another route.',
    hints: ['Think about when each one runs in the request lifecycle', 'Consider the tradeoff between speed and data access'],
    tags: ['next-auth', 'auth', 'useSession', 'middleware', 'server-components'],
    concepts: ['web-security-auth-tokens', 'next-middleware', 'next-server-vs-client'],
  },

  // -- MC 4: Role-based access --

  {
    id: 'next-auth-deep-4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_AUTH_DEEP,
    course: Course.WEB_DEV,
    question: 'How do you implement role-based access control (RBAC) in NextAuth?',
    options: [
      { id: 'a', text: 'Create an /api/roles endpoint and call it from every protected page on load, since the session cannot carry custom fields', isCorrect: false },
      { id: 'b', text: 'Store the role in localStorage after login and check it in a useEffect on each protected page before showing its content', isCorrect: false },
      { id: 'c', text: 'Auth.js has role support built in: set a role option in the provider config and it restricts the matching routes for you', isCorrect: false },
      { id: 'd', text: 'Copy the role onto the token in callbacks.jwt() and onto the session in callbacks.session(), then check session.user.role', isCorrect: true },
    ],
    explanation: 'Auth.js has no built-in roles, but its callbacks carry one. callbacks.jwt() receives the user at sign-in, the moment to copy the role from your database onto the token in the session cookie. callbacks.session() copies it from the token onto session.user, the object auth() and useSession() return. Then check session.user.role where it matters: in Server Components and Server Actions before reading or changing data, in middleware for whole routes, and in Client Components only to show or hide UI. localStorage can be edited by the user, so it can never decide access. In TypeScript, add role to the Session and JWT interfaces with declare module.',
    hints: ['NextAuth callbacks let you customize the token and session', 'jwt callback runs when the token is created/updated', 'session callback controls what is exposed to the client'],
    tags: ['next-auth', 'rbac', 'roles', 'callbacks', 'authorization'],
    concepts: [
      'web-security-auth-tokens',
    ],
  },

  // -- MC 5: JWT vs Database session strategy --

  {
    id: 'next-auth-deep-5',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_AUTH_DEEP,
    course: Course.WEB_DEV,
    question: 'What is the difference between JWT and Database session strategies in NextAuth?',
    options: [
      { id: 'a', text: 'JWT keeps the session in an encrypted cookie: no database lookup, but no revoking it early. Database keeps a row per session, which can be deleted', isCorrect: true },
      { id: 'b', text: 'JWT is for development only, since a token in a cookie is insecure; the database strategy is the one to use in any production app', isCorrect: false },
      { id: 'c', text: 'JWT puts the session in the URL as a query parameter, and the database strategy puts it in a cookie; JWT is faster but leaks in logs', isCorrect: false },
      { id: 'd', text: 'Both keep the whole session in a cookie and read it the same way; the database strategy only adds a backup copy of each session', isCorrect: false },
    ],
    explanation: 'The strategy decides where the session lives. With JWT, the default when no adapter is set, the session is an encrypted token in a cookie: checking it needs no database query, but a token stays valid until it expires, so you cannot sign one user out of every device early. With the database strategy, the default once an adapter such as Prisma\'s is set, the cookie holds only a session id and each check looks the row up: one query per request, but deleting the row ends the session at once, and you can list active sessions. The Credentials provider works only with JWT sessions.',
    hints: ['Think about where the session data physically lives', 'Consider what "revoke a session" means in each strategy'],
    tags: ['next-auth', 'jwt', 'session-strategy', 'database', 'prisma'],
    concepts: [
      'web-security-auth-tokens',
    ],
  },

  // -- Cloze: SessionProvider + useSession client setup --

  {
    id: 'next-auth-deep-cloze-3',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_AUTH_DEEP,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Complete the client-side session setup in two files: the provider that every useSession() call depends on, and the hook that reads the session in a Client Component.',
    template: `// app/providers.tsx
"use client";
import { ___ } from "next-auth/react";

export function Providers({ children }) {
  return <___>{children}</___>;
}

// app/UserBadge.tsx
"use client";
import { ___ } from "next-auth/react";

export function UserBadge() {
  const { data: session } = ___();
  return <span>{session?.user?.name}</span>;
}`,
    blanks: [
      'SessionProvider',
      'SessionProvider',
      'SessionProvider',
      'useSession',
      'useSession',
    ],
    solution: `// app/providers.tsx
"use client";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}

// app/UserBadge.tsx
"use client";
import { useSession } from "next-auth/react";

export function UserBadge() {
  const { data: session } = useSession();
  return <span>{session?.user?.name}</span>;
}`,
    explanation: 'useSession() reads the session from React context, so it works only inside a tree wrapped in SessionProvider, usually placed once around {children} in the root layout. Both come from next-auth/react and are client-only, so each file starts with "use client". data is undefined while the session loads and null when nobody is signed in, hence the ?. chain. auth(), the server-side function used in Server Components, needs no provider because it reads the session cookie on each request.',
    hints: [
      'The provider component that makes the session available through context',
      'The client hook that reads the session from that context',
    ],
    tags: ['next-auth', 'SessionProvider', 'useSession', 'cloze'],
    concepts: ['web-security-auth-tokens', 'next-server-vs-client'],
  },

  // -- Cloze: signIn()/signOut() from a client button --

  {
    id: 'next-auth-deep-cloze-4',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_AUTH_DEEP,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question:
      'Complete the two buttons: one starts the Google OAuth flow, the other ends the session and sends the user home.',
    template: `"use client";
import { signIn, signOut } from "next-auth/react";

export function AuthButtons() {
  return (
    <>
      <button onClick={() => ___("google")}>Sign in with Google</button>
      <button onClick={() => ___({ redirectTo: "/" })}>Sign out</button>
    </>
  );
}`,
    blanks: ['signIn', 'signOut'],
    solution: `"use client";
import { signIn, signOut } from "next-auth/react";

export function AuthButtons() {
  return (
    <>
      <button onClick={() => signIn("google")}>Sign in with Google</button>
      <button onClick={() => signOut({ redirectTo: "/" })}>Sign out</button>
    </>
  );
}`,
    explanation: 'signIn("google") starts the OAuth flow for the named provider: the browser goes to Google and comes back signed in. signOut() ends the session; { redirectTo: "/" } says where to send the user afterwards instead of reloading the page they clicked from. In Auth.js v5 the option is redirectTo; callbackUrl, its NextAuth v4 name, still works but is deprecated. These two come from next-auth/react for Client Components; a Server Action uses the signIn and signOut exported from auth.ts instead.',
    hints: [
      'The function that starts a named provider\'s OAuth flow',
      'The function that ends the session, given an options object',
    ],
    tags: ['next-auth', 'signIn', 'signOut', 'cloze'],
    concepts: ['web-security-auth-tokens'],
  },

  // -- Cloze: jwt/session callbacks --

  {
    id: 'next-auth-deep-cloze-5',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_AUTH_DEEP,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question:
      'Complete the callbacks: copy the role onto the token when it is first created, then copy it from the token onto the session that gets exposed to the client.',
    template: `callbacks: {
  async jwt({ token, user }) {
    if (user) token.role = user.role;
    return token;
  },
  async ___({ session, token }) {
    session.user.role = token.role;
    return session;
  },
},`,
    blanks: ['session'],
    solution: `callbacks: {
  async jwt({ token, user }) {
    if (user) token.role = user.role;
    return token;
  },
  async session({ session, token }) {
    session.user.role = token.role;
    return session;
  },
},`,
    explanation:
      'These two callbacks form a relay: jwt() runs whenever the token is created or updated, and only receives the user object on initial sign-in - that is the one chance to stamp custom data like role onto the token. session() runs whenever a session is checked (by auth() or useSession()) and controls exactly what gets exposed to the client - it must explicitly copy token.role onto session.user.role, or the role never reaches session.user.role even though it lives on the token.',
    hints: [
      'The callback that shapes what auth() and useSession() actually return',
    ],
    tags: ['next-auth', 'callbacks', 'jwt', 'session', 'cloze'],
    concepts: ['web-security-auth-tokens'],
  },

  // -- Coding: jwt/session callbacks implementation --

  {
    id: 'next-auth-deep-6',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_AUTH_DEEP,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Add role-based session data to an Auth.js (NextAuth v5) config by adding a `callbacks` block to the existing `NextAuth({...})` call:\n\n- `jwt` callback: on sign-in, when the `user` argument is present, copy `user.role` onto the token; return the token\n- `session` callback: copy `token.role` onto `session.user.role`, so `auth()` and `useSession()` return it; return the session\n\nAssume the providers and everything else in the config already exist, and that `role` is already declared on the `User`, `Session` and `JWT` types.',
    starterCode: `export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    /* existing providers */
  ],
  // add a callbacks block here
});`,
    testCases: [
      {
        input: 'callbacks block',
        expectedOutput: 'jwt({ token, user }) { if (user) token.role = user.role; return token; }, session({ session, token }) { session.user.role = token.role; return session; }',
        description: 'Should stamp role onto the token on sign-in, then copy it onto the exposed session',
      },
    ],
    solution: `export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    /* existing providers */
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      return session;
    },
  },
});

# OR

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    /* existing providers */
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    session({ session, token }) {
      session.user.role = token.role;
      return session;
    },
  },
});`,
    explanation: 'Without these callbacks, session.user has only the default fields (name, email, image): a field of your own, like role, never reaches it by itself. jwt() runs at sign-in and again on every session check, but only the sign-in call receives user, so that is where token.role is seeded; later calls get just the token, which still carries it in the session cookie. session() runs on every auth() or useSession() call and decides what they return, so copying token.role onto session.user.role is what makes it readable for an RBAC check. Both callbacks must return what they were given, or the token or session is lost.',
    hints: [
      'user is only defined in jwt() on the initial sign-in call - stash what you need onto the token then',
      'session() controls what auth()/useSession() actually return - token data is invisible to the client until copied here',
    ],
    tieredHints: {
      apiSignature: 'callbacks: { jwt({ token, user }), session({ session, token }) }',
      skeleton: `callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.____ = user.role;
    }
    return ____;
  },
  async session({ session, token }) {
    session.user.____ = token.role;
    return ____;
  },
}`,
    },
    requires: [
      /callbacks:\s*\{/,
      /jwt\s*(:\s*(async\s*)?)?\(\s*\{[^}]*\btoken\b[^}]*\buser\b/,
      /if\s*\(\s*user/,
      /token\.role\s*=\s*user\.role/,
      /session\.user\.role\s*=\s*token\.role/,
      /return\s+token/,
      /return\s+session/,
    ],
    tags: ['next-auth', 'callbacks', 'jwt', 'session', 'rbac'],
    concepts: ['web-security-auth-tokens'],
  },

  // -- Cloze: bcrypt.compare for credential verification --

  {
    id: 'next-auth-deep-cloze-6',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_AUTH_DEEP,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question:
      'Complete the credential check: hash the submitted password internally and compare it against the stored hash, without ever decrypting the stored hash back into plain text.',
    template: `const passwordMatch = await bcrypt.___(
  credentials.password,
  user.hashedPassword
);
if (!passwordMatch) return null;`,
    blanks: ['compare'],
    solution: `const passwordMatch = await bcrypt.compare(
  credentials.password,
  user.hashedPassword
);
if (!passwordMatch) return null;`,
    explanation:
      'bcrypt.compare(plaintext, hash) re-hashes the submitted plaintext internally (using the same salt embedded in the stored hash) and compares the two hashes - it never reverses user.hashedPassword back into plain text, because bcrypt hashing is one-way by design. This is why authorize() calls compare() rather than something like `credentials.password === user.password`: the database should never store a plain-text password to compare against in the first place.',
    hints: [
      'The bcrypt method that checks a plaintext password against a stored hash',
    ],
    tags: ['next-auth', 'bcrypt', 'password-hashing', 'cloze'],
    concepts: ['web-security-auth-tokens'],
  },

  // -- MC: why bcrypt.compare instead of a direct equality check --

  {
    id: 'next-auth-deep-7',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_AUTH_DEEP,
    course: Course.WEB_DEV,
    question: 'In the Credentials provider\'s authorize() function, why does the standard pattern use `await bcrypt.compare(credentials.password, user.hashedPassword)` instead of `credentials.password === user.password`?',
    options: [
      { id: 'a', text: 'bcrypt.compare is faster than ===: it looks the password up by its hash in constant time, while === scans both strings one character at a time', isCorrect: false },
      { id: 'b', text: 'Only a one-way hash with its salt is stored, so there is no plain password to compare with; compare hashes the input with that salt, and it is async', isCorrect: true },
      { id: 'c', text: 'Both are equally secure; bcrypt.compare is only the convention in Auth.js examples, and a plain === check on the stored password works just as well', isCorrect: false },
      { id: 'd', text: '=== cannot run inside authorize(): Auth.js wraps the credentials in a read-only Proxy that throws when one of its fields is compared directly', isCorrect: false },
    ],
    explanation: 'If passwords were stored in plain text, one database leak would expose every user\'s real password, and since people reuse passwords, accounts on other sites too. So the database stores only a bcrypt hash: one-way, with a random salt built into it. To check a login, bcrypt.compare(input, hash) reads the salt from the stored hash, hashes the input the same way and compares the results. That is deliberately slow work, which is why it returns a promise you await. There is no user.password to compare with ===, and bcrypt is not faster: its slowness is what makes guessing expensive.',
    hints: [
      'Think about what a database breach exposes if passwords are stored in plain text versus hashed',
      'A hash is one-way - compare() works by re-hashing the input, not by reversing the stored value',
    ],
    tags: ['next-auth', 'bcrypt', 'password-hashing', 'credentials', 'security'],
    concepts: ['web-security-auth-tokens'],
  },
  {
    id: 'next-auth-deep-session-cb-predict-1',
    type: QuestionType.PREDICT_OUTPUT,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_AUTH_DEEP,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Ada signs in with this Credentials provider and opens /account. What text does the page show? Type it exactly, on one line.',
    code: `// auth.js
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      authorize: async () => ({ id: "1", name: "Ada", role: "admin" }),
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
  },
});

// app/account/page.jsx
export default async function AccountPage() {
  const session = await auth();
  return <p>{session.user.name}: {session.user.role ?? "no role"}</p>;
}`,
    expectedOutput: 'Ada: no role',
    explanation: 'The jwt callback copies the role onto the token at sign-in, but the token is not what auth() returns. auth() returns the session, and with no session callback the session holds only the defaults: the user\'s name, email and image. So session.user.role is undefined and the page shows "Ada: no role". Add a session callback that copies it across, session.user.role = token.role, and the page shows "Ada: admin".',
    hints: ['Which object does auth() return: the token or the session?', 'Which fields does the session hold when there is no session callback?'],
    tags: ['next-auth', 'callbacks', 'jwt', 'session', 'rbac', 'predict'],
    concepts: ['web-security-auth-tokens'],
  },
];
