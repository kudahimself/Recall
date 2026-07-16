import { Question, QuestionType, Difficulty, Topic, CodeLanguage, Course } from '../types';

export const advancedNextQuestions: Question[] = [

  // =====================================================================
  // NEXT_URL_STATE (7 questions)
  // =====================================================================

  // BEGINNER faded (Parsons + Cloze) — lower-load scaffold before cold coding

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
    explanation:
      'useSearchParams() is a hook, so it only runs in a Client Component — the "use client" directive is required. It returns a read-only URLSearchParams object, not a plain object, so reading a param means calling .get("q") rather than dot-accessing searchParams.q.',
    hints: [
      'useSearchParams is a hook — it needs "use client"',
      'The returned object is URLSearchParams, not a plain object',
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
    explanation:
      'useRouter() returns the router instance for Client Components. router.replace(url) navigates without pushing a new browser history entry (unlike router.push, which does) — the usual choice when updating URL state like search params on every keystroke.',
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
    question: 'Build a SearchBar client component that syncs with URL search params. Use useSearchParams to read the "q" param as the initial input value, and useRouter to push updated URLs when the user types (debounced by 300ms). The component should work with Next.js App Router.',
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
}`,
    explanation: 'URL state keeps search queries in the address bar so users can bookmark, share, or refresh without losing their search. useSearchParams reads query params on the client side, while useRouter().replace updates the URL without adding a history entry. The 300ms debounce prevents excessive URL updates on every keystroke, which would cause unnecessary re-renders and network requests if the page fetches data based on params.',
    hints: [
      'useSearchParams() returns a read-only URLSearchParams object',
      'Use setTimeout + clearTimeout for debounce',
      'router.replace prevents adding a history entry per keystroke',
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
    question: 'Build a filterable product list page. In the Server Component page.tsx, read "category" and "sort" from the searchParams prop and pass them to a Client Component FilterBar. The FilterBar should render select dropdowns for category and sort, and update the URL when the user changes them. Show both components.',
    starterCode: `// page.tsx (Server Component)\nexport default async function ProductsPage({ searchParams }) {\n  // Read category and sort from searchParams\n}\n\n// FilterBar.tsx (Client Component)\n"use client";\nexport default function FilterBar({ category, sort }) {\n  // Render selects and update URL on change\n}\n`,
    testCases: [
      {
        input: 'Server reads searchParams, Client updates URL',
        expectedOutput: 'page.tsx reads searchParams.category/sort, FilterBar uses useRouter to push',
        description: 'Should split server param reading from client interaction',
      },
    ],
    solution: `// page.tsx (Server Component)
import FilterBar from "./FilterBar";

export default async function ProductsPage({ searchParams }) {
  const category = searchParams.category || "all";
  const sort = searchParams.sort || "newest";

  // Could fetch filtered products on the server here
  const products = await getProducts({ category, sort });

  return (
    <div>
      <h1>Products</h1>
      <FilterBar category={category} sort={sort} />
      <ul>
        {products.map((p) => (
          <li key={p.id}>{p.name}</li>
        ))}
      </ul>
    </div>
  );
}

// FilterBar.tsx (Client Component)
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
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
      </select>
    </div>
  );
}`,
    explanation: 'This pattern separates concerns: the Server Component reads searchParams for SSR (so the initial HTML is correct and SEO-friendly), while the Client Component handles user interaction. When the user changes a filter, the URL updates, which triggers a server re-render with the new params. This means filtering can happen on the server without shipping filter logic to the client, and every filter state is a shareable URL.',
    hints: [
      'Server Components receive searchParams as a prop in page.tsx',
      'Client Components use useRouter to update the URL',
      'new URLSearchParams preserves existing params when adding new ones',
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
      { id: 'a', text: 'useState is deprecated in Next.js App Router and cannot be used in any component', isCorrect: false },
      { id: 'b', text: 'URL state is faster because it bypasses React rendering entirely', isCorrect: false },
      { id: 'c', text: 'Shareable URLs let users bookmark/share filtered views, browser back/forward works, Server Components can read params for SSR, and state survives page refresh', isCorrect: true },
      { id: 'd', text: 'URL state automatically caches results in localStorage so the app works offline', isCorrect: false },
    ],
    explanation: 'URL state provides four key benefits over useState for search/filter: (1) Shareable URLs — users can copy the URL and share their exact filtered view. (2) Browser navigation — back/forward buttons work naturally with URL changes. (3) Server-side rendering — Server Components can read searchParams to render the correct initial HTML without hydration mismatch. (4) Persistence — refreshing the page preserves the current filters. useState loses all of these because its state lives only in component memory.',
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
      { id: 'a', text: 'useSearchParams, searchParams, and usePathname are three interchangeable names for the same hook — Next.js just offers style aliases', isCorrect: false },
      { id: 'b', text: 'useSearchParams is a client hook for reading query params. searchParams is a server-side prop passed to page.tsx. usePathname returns just the path, without the query string.', isCorrect: true },
      { id: 'c', text: 'useSearchParams only works inside middleware, searchParams only works inside Route Handlers, and usePathname only works inside layout.tsx — used elsewhere, they throw', isCorrect: false },
      { id: 'd', text: 'searchParams is the deprecated Pages Router API, useSearchParams is its App Router replacement, and usePathname exists only for reading dynamic route segments', isCorrect: false },
    ],
    explanation: 'Each serves a distinct purpose in the App Router: useSearchParams() is a client-side hook that gives you a read-only URLSearchParams object — use it in Client Components to reactively read query params. The searchParams prop is passed to page.tsx Server Components, letting you read query params on the server during SSR without any client JavaScript. usePathname() returns just the path portion of the URL (e.g., "/products") without any query string — useful for building URLs or highlighting active nav links. Understanding which to use where is key to the Server/Client Component split.',
    hints: ['Think about where each one runs — server vs client', 'Consider what part of the URL each one accesses'],
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
      { id: 'a', text: 'Debounce the router.replace() call itself - wrap it in a setTimeout (commonly ~300ms) that resets on every keystroke, so the URL (and the server re-fetch it triggers) only updates once typing pauses, while the input\'s own value still updates instantly via local component state', isCorrect: true },
      { id: 'b', text: 'Switch from router.replace() to router.push() - push is asynchronous and automatically batches multiple calls within the same event loop tick into a single navigation', isCorrect: false },
      { id: 'c', text: 'Move the searchParams read from the Server Component into a useEffect in the Client Component instead - this prevents the server from re-rendering on every URL change', isCorrect: false },
      { id: 'd', text: 'Add a key prop to the input tied to the current query value, forcing React to skip re-rendering the surrounding page until the user stops typing', isCorrect: false },
    ],
    explanation: 'Debouncing separates two concerns that are easy to conflate: what the user sees while typing (the input\'s own value, kept in local state so every keystroke feels instant) from when the expensive side effect fires (updating the URL, which triggers a server re-render if the page reads searchParams). Wrapping the router.replace() call in a debounce means it only actually runs after the user pauses for the debounce window, collapsing 6 navigations for "laptop" into 1. router.push vs replace only affects whether a history entry is added, not timing or batching - neither one debounces on its own.',
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
    question:
      'Complete the debounce: schedule the URL update after a delay, and clean it up if the user types again before it fires.',
    template: `useEffect(() => {
  const timer = ___(() => {
    router.replace(\`\${pathname}?q=\${query}\`);
  }, 300);

  return () => ___(timer);
}, [query]);`,
    blanks: ['setTimeout', 'clearTimeout'],
    solution: `useEffect(() => {
  const timer = setTimeout(() => {
    router.replace(\`\${pathname}?q=\${query}\`);
  }, 300);

  return () => clearTimeout(timer);
}, [query]);`,
    explanation:
      'setTimeout schedules the URL update 300ms in the future instead of running it on every keystroke. The effect\'s cleanup function - clearTimeout(timer) - runs before the NEXT effect fires (i.e., on the next keystroke), cancelling the pending update. Only once the user pauses long enough for a timer to survive uncancelled does router.replace actually run.',
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
    question: 'Build a Pager client component for a paginated list. Props: currentPage (number), totalPages (number). It reads the existing search params, and renders a "Previous" Link and a "Next" Link, each pointing to the current URL with the "page" param set to currentPage - 1 or currentPage + 1. Disable ("Previous" hidden) when currentPage is 1, and hide "Next" when currentPage equals totalPages. Use next/link\'s Link component and preserve every other existing search param.',
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
}`,
    explanation: 'The pagination param pattern reuses the same params-building primitive as the search bar: copy the current searchParams into a mutable URLSearchParams, overwrite just the "page" key, and build an href from the result - every other filter or sort param already in the URL survives untouched. Using Link (rather than a button + router.push) means these page links are real anchor tags: crawlable, right-clickable, and prefetched by Next.js, which a JS-driven navigation would not give you for free.',
    hints: [
      'Reuse new URLSearchParams(searchParams.toString()) to preserve existing params',
      'Only overwrite the "page" key, leave everything else untouched',
      'Conditionally render each Link based on currentPage vs 1 and totalPages',
    ],
    tags: ['next.js', 'pagination', 'Link', 'URLSearchParams', 'app-router'],
    concepts: ['next-url-state'],
  },

  // =====================================================================
  // NEXT_ERROR_HANDLING (5 questions)
  // =====================================================================

  // BEGINNER faded (Parsons + Cloze) — lower-load scaffold before cold coding

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
    explanation:
      'error.tsx must carry "use client" — it relies on a React error boundary, which only works client-side. The retry handler must be onClick={() => reset()} (a function passed to onClick); onClick={reset()} would call reset immediately during render and re-trigger an infinite loop. error.message is the thrown error\'s message.',
    hints: [
      'error.tsx is a Client Component — the directive matters',
      'Pass a function to onClick, do not invoke reset during render',
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
      'error.tsx requires the "use client" directive because error boundaries are a client-side React feature. Next.js passes two props: error (the thrown error) and reset (a function that re-renders the segment to attempt recovery).',
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
    explanation:
      'error.message holds the thrown error\'s text. The button passes an arrow function to onClick so reset only runs on click — calling reset() inline would execute it during every render and loop endlessly.',
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
    question: 'Create an error.tsx boundary for a Next.js App Router route. It must be a Client Component that receives error and reset props. Display a user-friendly error message showing error.message, and include a "Try Again" button that calls reset() to re-render the route segment.',
    starterCode: `"use client";\n\n// error.tsx — must be a Client Component\nexport default function ErrorBoundary({ error, reset }) {\n  // Show error UI with Try Again button\n}\n`,
    testCases: [
      {
        input: 'error.tsx with error and reset',
        expectedOutput: '"use client" directive, error.message displayed, reset() called on button click',
        description: 'Should be a Client Component that shows error and has reset button',
      },
    ],
    solution: `"use client";

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
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Something went wrong!</h2>
      <p style={{ color: "#888" }}>{error.message}</p>
      <button
        onClick={() => reset()}
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          cursor: "pointer",
        }}
      >
        Try Again
      </button>
    </div>
  );
}`,
    explanation: 'error.tsx must be a Client Component ("use client") because it uses React error boundary functionality under the hood. Next.js automatically wraps the page in an error boundary using this file. The error prop contains the thrown Error object, and reset() attempts to re-render the route segment. This is important because the layout above the error boundary stays interactive — users can still navigate away. Logging the error in useEffect helps with debugging without breaking the UI.',
    hints: [
      '"use client" is required — error boundaries are client-side',
      'error has a message property and optional digest',
      'reset() re-renders the segment without a full page reload',
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
    question: 'Write a Server Action called createUser that returns structured errors. Define an ActionResult type with { success: boolean; errors?: Record<string, string[]> }. Use Zod to validate name (min 2 chars) and email (valid email), and return field-level errors from safeParse instead of throwing.',
    starterCode: `"use server";

import { z } from "zod";

// Assume saveUser(data) is provided from "@/lib/db".

// your code here
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

type ActionResult = {
  success: boolean;
  errors?: Record<string, string[]>;
};

const userSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

export async function createUser(formData: FormData): Promise<ActionResult> {
  const rawData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
  };

  const result = userSchema.safeParse(rawData);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  // Save to database
  await saveUser(result.data);

  return { success: true };
}`,
    explanation: 'Server Actions should return structured results instead of throwing errors. Throwing causes the nearest error.tsx boundary to render, which replaces the entire page — far too aggressive for a form validation error. By using Zod\'s safeParse (not parse), you get a result object instead of an exception. The flatten().fieldErrors method converts Zod\'s error format into a clean Record<string, string[]> that maps field names to error messages, making it easy for the client to display errors next to each form field.',
    hints: [
      'safeParse returns { success, data, error } instead of throwing',
      'error.flatten().fieldErrors gives { fieldName: ["message"] }',
      'Return the result — never throw for validation errors',
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
      { id: 'a', text: 'It catches all errors in the entire application, including layout errors, middleware errors, and API route errors', isCorrect: false },
      { id: 'b', text: 'It replaces the entire rendered page — layout, navigation bar, and footer all disappear — whenever any descendant component throws', isCorrect: false },
      { id: 'c', text: 'It only catches errors thrown inside Client Components — an error thrown inside a Server Component always produces a generic 500 page', isCorrect: false },
      { id: 'd', text: 'It catches errors in the page and its children, but NOT in the layout — the layout stays interactive so users can navigate away after a page-level crash', isCorrect: true },
    ],
    explanation: 'error.tsx creates a React error boundary that wraps the page.tsx content within a route segment. The key insight is that the layout.tsx sits above this boundary in the component tree, so layout errors are NOT caught. This is intentional — keeping the layout interactive means users can navigate to a different page even when one route fails. If you need to catch errors in the root layout itself (which wraps the entire app), you must use global-error.tsx, which replaces the full page including <html> and <body> tags — covered in the next question.',
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
      { id: 'a', text: 'error.tsx catches errors within a route segment while the layout stays intact. global-error.tsx catches root layout errors and must define its own <html> and <body> tags since it replaces the whole page.', isCorrect: true },
      { id: 'b', text: 'error.tsx only runs in development mode to show a detailed stack trace, global-error.tsx only runs in production — otherwise they render identical UI', isCorrect: false },
      { id: 'c', text: 'error.tsx only catches errors thrown in Client Components, global-error.tsx only catches errors thrown in Server Components — you need both for full coverage', isCorrect: false },
      { id: 'd', text: 'They are functionally identical — global-error.tsx is simply the legacy Pages Router name for error.tsx, kept for backward compatibility', isCorrect: false },
    ],
    explanation: 'error.tsx and global-error.tsx serve different levels of the error boundary hierarchy. error.tsx catches errors within a route segment (page.tsx and its children), leaving the layout interactive so users can navigate away. global-error.tsx is specifically for catching errors in the root layout — the one that contains <html> and <body>. Because global-error.tsx replaces the root layout when it activates, it must define its own <html> and <body> tags. In practice, global-error.tsx is rarely triggered but is important for resilience.',
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
      { id: 'a', text: 'Always throw on any validation failure so the nearest error.tsx boundary catches it and shows a consistent error page across the app', isCorrect: false },
      { id: 'b', text: 'Use try/catch inside the Server Action, then redirect to a dedicated /error page with the failure message encoded in the URL', isCorrect: false },
      { id: 'c', text: 'Don\'t throw — return a result object like { success, errors }. The client reads it and shows field-level errors instead of triggering error.tsx.', isCorrect: true },
      { id: 'd', text: 'Wrap the Server Action body in try/catch and call notFound() on failure — this shows the nearest not-found.tsx boundary instead of a generic error page', isCorrect: false },
    ],
    explanation: 'Server Actions should return structured result objects rather than throwing errors. When a Server Action throws, the error propagates to the nearest error.tsx boundary, which replaces the page content — losing form state and providing a poor user experience for something as simple as a validation error. By returning { success: false, errors: { email: ["Invalid email"] } }, the client component can display inline errors next to each field while preserving the form state. Reserve throwing for truly unexpected errors (database down, etc.) where error.tsx is appropriate. notFound() is for missing resources, not validation failures — it is the wrong tool here too.',
    hints: ['Think about UX — what happens to the form when error.tsx renders?', 'Consider the difference between validation errors and system errors'],
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
}`,
    explanation: 'A Route Handler runs on the server, entirely outside any error.tsx boundary - that mechanism only wraps rendered pages, not API responses. If getOrderById throws and nothing catches it, Next.js returns a bare, unstyled 500 with no JSON body, which is useless to whatever client (fetch, another service) called this endpoint. Wrapping the risky call in try/catch lets you log the real error server-side for debugging while returning a clean, predictable JSON error shape the caller can actually parse and handle.',
    hints: [
      'Route Handlers are not covered by error.tsx - an uncaught throw here produces a generic, non-JSON 500',
      'Log the real error server-side, but return a stable, minimal error shape to the client',
      'NextResponse.json takes the body first, then an options object with status',
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
      { id: 'a', text: 'error.tsx only activates in production builds - in development, every thrown error (including this one) is swallowed silently by React\'s development-mode error suppression, so nothing is actually wrong with the code', isCorrect: false },
      { id: 'b', text: 'The onClick handler needs to be marked async directly in the JSX itself, like onClick={async () => ...}, for error.tsx to detect the rejection - without that exact syntax, Next.js has no way to trace the error back to the component', isCorrect: false },
      { id: 'c', text: 'error.tsx only catches errors thrown from Server Components - since this fetch happens inside a Client Component\'s event handler, it was never going to be caught by any error boundary regardless of whether the function was async', isCorrect: false },
      { id: 'd', text: 'error.tsx boundaries only catch errors thrown synchronously during React\'s render phase - errors thrown inside event handlers, timers, or async callbacks happen after rendering has already committed, so React\'s error boundary mechanism never sees them. They need to be caught manually with try/catch (or handled as rejected promises)', isCorrect: true },
    ],
    explanation: 'React error boundaries (which error.tsx wraps) only catch errors thrown during rendering - in the render phase, lifecycle methods, or constructors of the tree below them. An error thrown inside an event handler, a setTimeout callback, or an unhandled promise rejection happens completely outside that render cycle, so the boundary has no mechanism to intercept it; it just becomes an uncaught error or rejection logged to the console. This is a canonical misconception because it feels like error.tsx should be a universal safety net - in practice you still need try/catch (or .catch on the promise) around fetches triggered from event handlers, and error.tsx only guards what happens while the tree is actually rendering.',
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
      { id: 'a', text: 'Display the full server-side stack trace directly in the error.tsx UI so users can screenshot it and attach it to a support ticket - Next.js exposes complete, unsanitized stack traces to the client in production specifically to make this possible', isCorrect: false },
      { id: 'b', text: 'Nothing extra is needed here - error.message already contains the exact same full error details in both development and production builds, since Next.js does not treat the two environments differently for thrown errors', isCorrect: false },
      { id: 'c', text: 'Log error.digest (a hash Next.js attaches to server-side errors that lets you cross-reference the sanitized client error with the full details in your server logs) inside a useEffect in error.tsx, and send it to a monitoring service like Sentry via reportError/captureException - this connects what the user sees to what actually happened server-side', isCorrect: true },
      { id: 'd', text: 'Move all logging into the root layout.tsx instead, since error.tsx itself cannot run any side effects such as network calls from within its component body or lifecycle', isCorrect: false },
    ],
    explanation: 'In production, Next.js deliberately strips sensitive details from server-side errors before they reach the client, replacing the message with a generic one - but it attaches a `digest` property, a hash you can grep for in your server-side logs to find the original, full error. Hooking a useEffect in error.tsx to send { message: error.message, digest: error.digest } (plus stack, if available) to a monitoring service closes the loop between "a user saw a crash" and "here is exactly what broke on the server." Showing raw stack traces to end users would leak implementation details and is the opposite of what production error handling should do.',
    hints: [
      'Next.js intentionally sanitizes server error messages before they reach the client in production',
      'error.tsx receives a second identifying property alongside message specifically for this purpose',
    ],
    tags: ['next.js', 'error.tsx', 'digest', 'monitoring', 'logging', 'production'],
    concepts: ['next-error-boundary'],
  },

  // =====================================================================
  // NEXT_AUTH_DEEP (5 questions)
  // =====================================================================

  // BEGINNER faded (Parsons + Cloze) — lower-load scaffold before cold coding

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
    explanation:
      'auth() is async, so it must be awaited — const session = auth() leaves session as a pending Promise, which is always truthy and defeats the guard. useSession() is the client hook and cannot run in a Server Component. Checking the session on the server (before any HTML ships) means unauthenticated users never see protected content, and redirect() stops execution immediately.',
    hints: [
      'auth() returns a Promise — await it',
      'useSession() is client-side; this page is a Server Component',
      'redirect() halts rendering when there is no session',
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
    explanation:
      'auth() is asynchronous, so await gives you the resolved session object (or null). redirect() from next/navigation throws a special control-flow signal that immediately sends the visitor to the target route — no further rendering happens.',
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
    question:
      'Complete the code: the route unauthenticated users are sent to, and the session property holding the signed-in person\'s details.',
    template: `const session = await auth();
if (!session) redirect("/___");
return <p>Email: {session.___?.email}</p>;`,
    blanks: ['login', 'user'],
    solution: `const session = await auth();
if (!session) redirect("/login");
return <p>Email: {session.user?.email}</p>;`,
    explanation:
      'A missing session means the visitor is not signed in, so they are redirected to the /login route. When a session exists, session.user carries the authenticated profile (name, email, image) returned by the provider.',
    hints: [
      'The conventional route for signing in',
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
    question: 'Set up NextAuth.js v5 (Auth.js) with Google OAuth and Credentials providers. Show the auth.ts config file with: Google provider using GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET from env, Credentials provider that validates email/password, and the exported auth, signIn, signOut handlers. Assume getUserByEmail(email) is available from "@/lib/db", and the "bcryptjs" package is installed for comparing the submitted password against user.hashedPassword.',
    starterCode: `// auth.ts\nimport NextAuth from "next-auth";\nimport Google from "next-auth/providers/google";\nimport Credentials from "next-auth/providers/credentials";\nimport bcrypt from "bcryptjs";\n\n// Assume getUserByEmail(email) is provided from "@/lib/db".\n\n// Configure providers and export handlers\n`,
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
import { z } from "zod";
import { getUserByEmail } from "@/lib/db";

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
        const parsed = z.object({
          email: z.string().email(),
          password: z.string().min(6),
        }).safeParse(credentials);

        if (!parsed.success) return null;

        const user = await getUserByEmail(parsed.data.email);
        if (!user) return null;

        const passwordMatch = await bcrypt.compare(
          parsed.data.password,
          user.hashedPassword
        );
        if (!passwordMatch) return null;

        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],
});`,
    explanation: 'NextAuth v5 (Auth.js) uses a single auth.ts file that exports everything. The key difference from v4 is that NextAuth() returns { handlers, auth, signIn, signOut } directly. Google provider is straightforward — just pass client ID and secret from environment variables. The Credentials provider requires an authorize() function that validates credentials and returns a user object (or null for failure). Always validate inputs with Zod before database queries, and use bcrypt.compare for password checking — never compare plain text passwords.',
    hints: [
      'NextAuth v5 exports { handlers, auth, signIn, signOut }',
      'authorize() must return a user object or null',
      'Always validate credentials before querying the database',
      'bcrypt.compare needs bcryptjs imported at the top of the file',
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
    question: 'Create a protected dashboard page in Next.js App Router. Use auth() from your NextAuth config to get the session in a Server Component. If there is no session, redirect to /login. If authenticated, show a welcome message with the user\'s name and email. Show the complete page.tsx.',
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
      <p>Welcome, {session.user?.name}!</p>
      <p>Email: {session.user?.email}</p>
      <p>You are authenticated and can access this page.</p>
    </div>
  );
}`,
    explanation: 'auth() is an async function that returns the session on the server — no hooks needed. Because this runs in a Server Component, the authentication check happens before any HTML is sent to the client, preventing even a flash of protected content. redirect() from next/navigation throws a special Next.js error that triggers a redirect response. This pattern is preferred for page-level protection because it is secure (runs on server), fast (no client-side check), and SEO-friendly (unauthenticated users never see the page source).',
    hints: [
      'auth() is async — use await in a Server Component',
      'redirect() immediately stops execution and sends a redirect response',
      'session.user contains name, email, and image from the provider',
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
      { id: 'a', text: 'auth(), useSession(), and middleware-based auth are three interchangeable syntaxes for the same session check — pick whichever fits the file', isCorrect: false },
      { id: 'b', text: 'auth() checks the database session, useSession() checks the JWT directly, and middleware only checks cookies — each one validates a different thing', isCorrect: false },
      { id: 'c', text: 'auth() is a server-side session check, best for page-level protection. useSession() is client-side, for showing/hiding UI. Middleware runs at the edge before rendering, fastest for route protection.', isCorrect: true },
      { id: 'd', text: 'auth() only works inside Route Handlers, useSession() only works inside page.tsx files, and middleware only applies to static asset requests', isCorrect: false },
    ],
    explanation: 'Each approach runs at a different point in the request lifecycle: Middleware auth runs first, at the edge, before any page rendering begins — it is the fastest way to protect entire route groups and redirect unauthenticated users. auth() runs on the server during rendering, making it ideal for page-level protection in Server Components where you need the session data to render content. useSession() runs on the client after hydration, best for conditionally showing/hiding UI elements (like a login/logout button) without blocking rendering. A robust app often uses all three: middleware for broad route protection, auth() for server-side data access, and useSession() for client-side UI state.',
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
      { id: 'a', text: 'Create a separate /api/roles endpoint and call it on every page load to check the user\'s role', isCorrect: false },
      { id: 'b', text: 'Store the role in localStorage after login and check it in useEffect on protected pages', isCorrect: false },
      { id: 'c', text: 'NextAuth has built-in role support — just set the role in the provider config and it automatically restricts routes', isCorrect: false },
      { id: 'd', text: 'Add the role to the session via callbacks.session(), store it in the JWT via callbacks.jwt(). Then check session.user.role in Server Components or middleware.', isCorrect: true },
    ],
    explanation: 'NextAuth does not have built-in RBAC, but its callback system makes it straightforward. In callbacks.jwt(), you add the role to the token when the user signs in (fetching it from your database). In callbacks.session(), you copy the role from the token to the session object so it is accessible via auth() and useSession(). Then you check session.user.role wherever you need authorization — in Server Components for page-level access, in middleware for route-level protection, or in Client Components for UI visibility. You also need to extend the TypeScript types for Session and JWT to include the role field.',
    hints: ['NextAuth callbacks let you customize the token and session', 'jwt callback runs when the token is created/updated', 'session callback controls what is exposed to the client'],
    tags: ['next-auth', 'rbac', 'roles', 'callbacks', 'authorization'],
    concepts: ['web-security-auth-tokens', 'a11y-aria-roles'],
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
      { id: 'a', text: 'JWT sessions are encrypted cookies stored on the client — no database needed, but sessions cannot be revoked. Database sessions are stored server-side, can be revoked, but require a database adapter like Prisma. JWT is simpler; Database gives more control.', isCorrect: true },
      { id: 'b', text: 'JWT is for development only because it is insecure. Database strategy must be used in production for security.', isCorrect: false },
      { id: 'c', text: 'JWT stores the session in the URL as a query parameter. Database stores it in a cookie. JWT is faster but less secure.', isCorrect: false },
      { id: 'd', text: 'There is no practical difference — both store sessions in cookies. The "database" strategy just adds a backup copy to the database.', isCorrect: false },
    ],
    explanation: 'The session strategy determines where session data lives. JWT (default): The session is encoded into an encrypted cookie stored on the client. No database calls are needed to validate a session, making it fast and stateless. The tradeoff is that you cannot revoke a session — once issued, it is valid until it expires. Database: Each session gets a row in your database (via an adapter like Prisma). You can revoke sessions by deleting the row, see all active sessions, and store more data. The tradeoff is a database query on every request to validate the session. Choose JWT for simplicity and speed, Database when you need session revocation or audit trails.',
    hints: ['Think about where the session data physically lives', 'Consider what "revoke a session" means in each strategy'],
    tags: ['next-auth', 'jwt', 'session-strategy', 'database', 'prisma'],
    concepts: ['web-security-auth-tokens', 'prisma-schema-relations'],
  },

  // -- Cloze: SessionProvider + useSession client setup --

  {
    id: 'next-auth-deep-cloze-3',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_AUTH_DEEP,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question:
      'Complete the client-side session setup: the provider every useSession() call depends on, and the hook that reads the session in a Client Component.',
    template: `"use client";
import { ___ } from "next-auth/react";

export function Providers({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}

function UserBadge() {
  const { data: session } = ___();
  return <span>{session?.user?.name}</span>;
}`,
    blanks: ['SessionProvider', 'useSession'],
    solution: `"use client";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}

function UserBadge() {
  const { data: session } = useSession();
  return <span>{session?.user?.name}</span>;
}`,
    explanation:
      'useSession() reads the session from React context, so it only works inside a tree wrapped in SessionProvider - normally placed once near the root layout, alongside "use client" since both are client-only APIs. auth() (the server-side equivalent used in Server Components) needs no such wrapper because it reads cookies directly on each request instead of relying on client-side context.',
    hints: [
      'The provider component that makes the session available via context',
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
      <button onClick={() => ___({ callbackUrl: "/" })}>Sign out</button>
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
      <button onClick={() => signOut({ callbackUrl: "/" })}>Sign out</button>
    </>
  );
}`,
    explanation:
      'signIn("google") kicks off the OAuth flow for the named provider, redirecting to Google and back. signOut() clears the session; passing { callbackUrl: "/" } tells NextAuth where to send the user once sign-out completes, instead of leaving them on whatever page they clicked from. Both are client-side functions from next-auth/react, distinct from the server-side auth() used to read the session in Server Components.',
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
    question: 'Add role-based session data to a NextAuth v5 config. Extend the existing NextAuth({...}) call with a callbacks block:\n\n- jwt callback: on initial sign-in (when the `user` argument is present), copy user.role onto the token\n- session callback: copy token.role onto session.user.role so it is readable via auth() and useSession()\n\nAssume the providers array and everything else in the config already exists; show only the callbacks addition merged into the config object.',
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
});`,
    explanation: 'Without these callbacks, session.user only ever has the default shape (name, email, image) - anything you add to your own user model, like role, never automatically appears on the session. jwt() runs first and only sees the `user` argument on the initial sign-in request (subsequent calls only have the token, not the original user), so that is the one place to seed token.role. session() then runs on every session lookup and decides what actually gets exposed - copying token.role onto session.user.role here is what finally makes session.user.role usable from auth() or useSession() elsewhere in the app, including in an RBAC check.',
    hints: [
      'user is only defined in jwt() on the initial sign-in call - stash what you need onto the token then',
      'session() controls what auth()/useSession() actually return - token data is invisible to the client until copied here',
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
      { id: 'a', text: 'bcrypt.compare is simply faster than a plain string equality check at any input size, since === has to scan the entire string character by character while bcrypt.compare uses an indexed constant-time hash lookup behind the scenes', isCorrect: false },
      { id: 'b', text: 'Passwords must never be stored in plain text - user.hashedPassword is a one-way bcrypt hash (with a random salt baked in), so there is no plain-text user.password to compare against directly. bcrypt.compare re-hashes the submitted password using the same salt and compares the resulting hashes instead, which is also why the check must be awaited', isCorrect: true },
      { id: 'c', text: 'Both approaches are equally secure in practice - bcrypt.compare is only used by NextAuth\'s own examples as a stylistic convention, with no actual security benefit over a direct equality check on the stored password', isCorrect: false },
      { id: 'd', text: '=== cannot be used inside an authorize() function at all, because NextAuth silently wraps every credentials object in a read-only Proxy that throws on any direct property comparison attempt', isCorrect: false },
    ],
    explanation: 'If user.password were stored in plain text, a single database breach would expose every user\'s real password - and since people reuse passwords across sites, that breach cascades far beyond just this one app. bcrypt hashing solves this by being one-way: you store user.hashedPassword (a hash plus an embedded random salt) and can never recover the original password from it, by design. To verify a login attempt, bcrypt.compare(plaintext, hash) re-runs the same hashing algorithm on the submitted password using the salt extracted from the stored hash, then compares the two hashes - functionally equivalent to equality, but without ever needing (or being able) to store or reconstruct the real password.',
    hints: [
      'Think about what a database breach exposes if passwords are stored in plain text versus hashed',
      'A hash is one-way - compare() works by re-hashing the input, not by reversing the stored value',
    ],
    tags: ['next-auth', 'bcrypt', 'password-hashing', 'credentials', 'security'],
    concepts: ['web-security-auth-tokens'],
  },
];
