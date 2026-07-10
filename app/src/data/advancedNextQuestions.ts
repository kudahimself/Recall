import { Question, QuestionType, Difficulty, Topic, CodeLanguage, Course } from '../types';

export const advancedNextQuestions: Question[] = [

  // =====================================================================
  // NEXT_URL_STATE (4 questions)
  // =====================================================================

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
      { id: 'a', text: 'They are interchangeable — all three do the same thing but with different syntax', isCorrect: false },
      { id: 'b', text: 'useSearchParams is a client hook for reading/writing query params. searchParams is a server-side prop available in page.tsx. usePathname returns the current path without the query string.', isCorrect: true },
      { id: 'c', text: 'useSearchParams works only in middleware, searchParams works only in API routes, and usePathname works only in layouts', isCorrect: false },
      { id: 'd', text: 'searchParams is the older Pages Router API, useSearchParams is the newer replacement, and usePathname is for dynamic route segments', isCorrect: false },
    ],
    explanation: 'Each serves a distinct purpose in the App Router: useSearchParams() is a client-side hook that gives you a read-only URLSearchParams object — use it in Client Components to reactively read query params. The searchParams prop is passed to page.tsx Server Components, letting you read query params on the server during SSR without any client JavaScript. usePathname() returns just the path portion of the URL (e.g., "/products") without any query string — useful for building URLs or highlighting active nav links. Understanding which to use where is key to the Server/Client Component split.',
    hints: ['Think about where each one runs — server vs client', 'Consider what part of the URL each one accesses'],
    tags: ['next.js', 'useSearchParams', 'searchParams', 'usePathname', 'app-router'],
    concepts: ['next-url-state', 'next-app-router'],
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
      { id: 'a', text: 'It catches all errors in the entire application, including layout errors and API route errors', isCorrect: false },
      { id: 'b', text: 'It replaces the entire page including the layout, navigation, and footer when any error occurs', isCorrect: false },
      { id: 'c', text: 'It only catches errors from Client Components — Server Component errors always show a 500 page', isCorrect: false },
      { id: 'd', text: 'It catches errors in the page and its children, but NOT in the layout. The layout remains interactive so users can navigate away. For root layout errors, use global-error.tsx.', isCorrect: true },
    ],
    explanation: 'error.tsx creates a React error boundary that wraps the page.tsx content within a route segment. The key insight is that the layout.tsx sits above this boundary in the component tree, so layout errors are NOT caught. This is intentional — keeping the layout interactive means users can navigate to a different page even when one route fails. If you need to catch errors in the root layout itself (which wraps the entire app), you must use global-error.tsx, which replaces the full page including <html> and <body> tags.',
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
      { id: 'a', text: 'error.tsx catches errors within a route segment while the layout stays intact. global-error.tsx catches errors in the root layout itself and must include <html> and <body> tags since it replaces the entire page.', isCorrect: true },
      { id: 'b', text: 'error.tsx is for development mode only, global-error.tsx is for production. They show the same UI but with different levels of detail.', isCorrect: false },
      { id: 'c', text: 'error.tsx handles client-side errors, global-error.tsx handles server-side errors. You need both for complete coverage.', isCorrect: false },
      { id: 'd', text: 'They are the same — global-error.tsx is just the older name from Pages Router that still works for backward compatibility.', isCorrect: false },
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
      { id: 'a', text: 'Always throw errors so error.tsx can catch them and show a consistent error page across the app', isCorrect: false },
      { id: 'b', text: 'Use try/catch in the Server Action and redirect to a dedicated /error page with the error message in the URL', isCorrect: false },
      { id: 'c', text: 'Don\'t throw — return a result object like { success, errors }. The client reads the result and shows field-level errors. Throwing causes error.tsx to render, which is too aggressive for form validation.', isCorrect: true },
      { id: 'd', text: 'Server Actions cannot produce errors — Next.js automatically validates all inputs before the action runs', isCorrect: false },
    ],
    explanation: 'Server Actions should return structured result objects rather than throwing errors. When a Server Action throws, the error propagates to the nearest error.tsx boundary, which replaces the page content — losing form state and providing a poor user experience for something as simple as a validation error. By returning { success: false, errors: { email: ["Invalid email"] } }, the client component can display inline errors next to each field while preserving the form state. Reserve throwing for truly unexpected errors (database down, etc.) where error.tsx is appropriate.',
    hints: ['Think about UX — what happens to the form when error.tsx renders?', 'Consider the difference between validation errors and system errors'],
    tags: ['next.js', 'server-actions', 'error-handling', 'form-validation'],
    concepts: ['next-server-actions', 'js-error-handling'],
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
    question: 'Set up NextAuth.js v5 (Auth.js) with Google OAuth and Credentials providers. Show the auth.ts config file with: Google provider using GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET from env, Credentials provider that validates email/password, and the exported auth, signIn, signOut handlers.',
    starterCode: `// auth.ts\nimport NextAuth from "next-auth";\nimport Google from "next-auth/providers/google";\nimport Credentials from "next-auth/providers/credentials";\n\n// Configure providers and export handlers\n`,
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
import { z } from "zod";

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
      { id: 'a', text: 'They are three names for the same function — use whichever syntax you prefer based on the file location', isCorrect: false },
      { id: 'b', text: 'auth() checks the database session, useSession() checks the JWT, middleware checks cookies. They validate different things.', isCorrect: false },
      { id: 'c', text: 'auth() is server-side session check, best for page-level protection. useSession() is client-side, for showing/hiding UI. Middleware runs at the edge before any rendering, fastest for route protection.', isCorrect: true },
      { id: 'd', text: 'auth() is for API routes only, useSession() is for pages only, and middleware is for static assets only', isCorrect: false },
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
];
