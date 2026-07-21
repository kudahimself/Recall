import { Question, QuestionType, Difficulty, Topic, CodeLanguage, Course } from '../types';

export const nextjsQuestions: Question[] = [

  // =====================================================================
  // NEXT_ROUTING (12 questions)
  // =====================================================================

  // BEGINNER faded (Parsons + Cloze) — lower-load scaffold before cold coding
  {
    id: 'next-route-parsons-1',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_ROUTING,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Assemble a dynamic route page at app/blog/[slug]/page.tsx. In Next.js 15 the params prop is a Promise, so the component must be async. Order the lines: the function signature first, then read the slug, then return the heading, then the closing brace.',
    correctOrder: [
      'export default async function Page({ params }: { params: Promise<{ slug: string }> }) {',
      '  const { slug } = await params;',
      '  return <h1>{slug}</h1>;',
      '}',
    ],
    distractorLines: [
      'export default function Page({ params }: { params: { slug: string } }) {',
      '  const { slug } = params;',
    ],
    solution: 'export default async function Page({ params }: { params: Promise<{ slug: string }> }) {\n  const { slug } = await params;\n  return <h1>{slug}</h1>;\n}',
    explanation: 'Dynamic segments use the [slug] folder syntax, and the folder name becomes the key in params. In Next.js 15 params is a Promise (to support streaming), so the page must be an async function and await params before destructuring. The distractor lines drop async/await — valid in Next 13–14, but a type error in 15.',
    hints: ['params is a Promise in Next.js 15', 'await it before destructuring', 'the component must be async to use await'],
    tags: ['dynamic-routes', 'params', 'async-component'],
    concepts: ['next-app-router', 'next-data-fetching'],
  },
  {
    id: 'next-route-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_ROUTING,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Fill in the import path for the App Router navigation component, and the prop that sets its destination, so clicks do client-side navigation instead of a full page reload.',
    template: 'import Link from "___";\n\nexport default function Nav() {\n  return (\n    <nav>\n      <Link ___="/">Home</Link>\n    </nav>\n  );\n}',
    blanks: ['next/link', 'href'],
    solution: 'import Link from "next/link";\n\nexport default function Nav() {\n  return (\n    <nav>\n      <Link href="/">Home</Link>\n    </nav>\n  );\n}',
    explanation: 'next/link renders an anchor but intercepts clicks for client-side navigation (no full reload) and prefetches the route when the link scrolls into view. Like a plain <a>, the destination goes in an href prop.',
    hints: ['the component comes from the framework package', 'the destination prop has the same name a plain anchor uses'],
    tags: ['next/link', 'navigation', 'app-router'],
    concepts: ['next-app-router'],
  },
  {
    id: 'next-route-cloze-2',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_ROUTING,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Fill in the named export that the Next.js Metadata API reads to set the document <title> and <meta> tags from a layout or page file.',
    template: 'export const ___ = {\n  title: "My App",\n  description: "A Next.js application",\n};\n\nexport default function RootLayout({ children }: { children: React.ReactNode }) {\n  return (\n    <html lang="en">\n      <body>{children}</body>\n    </html>\n  );\n}',
    blanks: ['metadata'],
    solution: 'export const metadata = {\n  title: "My App",\n  description: "A Next.js application",\n};\n\nexport default function RootLayout({ children }: { children: React.ReactNode }) {\n  return (\n    <html lang="en">\n      <body>{children}</body>\n    </html>\n  );\n}',
    explanation: 'Next.js reads a module-level export of this name (a static object) from layout.tsx or page.tsx and renders the matching <title>/<meta> tags into the document head on the server. For data-dependent tags, use the async generateMetadata function instead.',
    hints: ['it is a static object exported at the module level', 'the Metadata API gives the export one specific name'],
    tags: ['metadata', 'seo', 'app-router'],
    concepts: ['next-app-router'],
  },
  {
    id: 'next-route-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_ROUTING,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Create a root layout component for a Next.js App Router application.\n\nFile: app/layout.tsx\n\nThe layout must:\n- Accept a `children` prop (React.ReactNode)\n- Render an <html> tag with lang="en"\n- Render a <body> with a <nav> containing a link to "/" with text "Home", followed by {children}\n- Export metadata with title "My App" and description "A Next.js application"\n\nUse next/link for navigation.',
    starterCode: `import Link from "next/link";\n\nexport const metadata = {\n  // Add metadata here\n};\n\nexport default function RootLayout({\n  children,\n}: {\n  children: React.ReactNode;\n}) {\n  // Return the layout JSX\n}`,
    testCases: [
      {
        input: 'layout component',
        expectedOutput: 'export const metadata = { title: "My App", description: "A Next.js application" }',
        description: 'Should export metadata with title and description',
      },
      {
        input: 'html structure',
        expectedOutput: '<html lang="en"><body><nav><Link href="/">Home</Link></nav>{children}</body></html>',
        description: 'Should render html > body > nav with Link, then children',
      },
    ],
    solution: `import Link from "next/link";\n\nexport const metadata = {\n  title: "My App",\n  description: "A Next.js application",\n};\n\nexport default function RootLayout({\n  children,\n}: {\n  children: React.ReactNode;\n}) {\n  return (\n    <html lang="en">\n      <body>\n        <nav>\n          <Link href="/">Home</Link>\n        </nav>\n        {children}\n      </body>\n    </html>\n  );\n}`,
    explanation: 'layout.tsx is the only REQUIRED file in the app directory. The root layout must render <html> and <body> tags — Next.js does not add them automatically. Layouts persist across navigations and do NOT re-render when the user navigates between sibling routes. This is why layouts are ideal for navbars, sidebars, and providers that should not unmount.',
    hints: ['The root layout must render <html> and <body>', 'Use next/link for client-side navigation', 'metadata export is a static object at the module level'],
    tieredHints: {
      apiSignature: 'function RootLayout({ children }: { children: React.ReactNode })',
      skeleton: `export const metadata = {
  title: "My App",
  description: "____",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav>
          <Link href="____">Home</Link>
        </nav>
        {____}
      </body>
    </html>
  );
}`,
    },
    tags: ['layout', 'app-router', 'metadata', 'next/link'],
    concepts: ['next-app-router'],
  },

  {
    id: 'next-route-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_ROUTING,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Create a dynamic route page that displays a blog post based on the URL slug.\n\nFile: app/blog/[slug]/page.tsx\n\nThe component receives params as a prop. In Next.js 15, params is a Promise that must be awaited.\n\nGiven the type: { params: Promise<{ slug: string }> }\n- Await params to get the slug\n- Return an <article> with an <h1> containing the slug (replace hyphens with spaces, capitalize first letter)\n- Below the h1, render a <p> with text "Loading content for: {slug}"',
    starterCode: `// app/blog/[slug]/page.tsx\n\nexport default async function BlogPost({\n  params,\n}: {\n  params: Promise<{ slug: string }>;\n}) {\n  // Await params and render the article\n}`,
    testCases: [
      {
        input: 'slug = "my-first-post"',
        expectedOutput: '<article><h1>My first post</h1><p>Loading content for: my-first-post</p></article>',
        description: 'Should display formatted slug as title and raw slug in paragraph',
      },
    ],
    solution: `// app/blog/[slug]/page.tsx\n\nexport default async function BlogPost({\n  params,\n}: {\n  params: Promise<{ slug: string }>;\n}) {\n  const { slug } = await params;\n  const title = slug.replace(/-/g, " ").replace(/^./, (c) => c.toUpperCase());\n\n  return (\n    <article>\n      <h1>{title}</h1>\n      <p>Loading content for: {slug}</p>\n    </article>\n  );\n}`,
    explanation: 'Dynamic routes use [paramName] folder syntax. In Next.js 15, params is a Promise to support streaming — the framework can start rendering the layout before the dynamic segment is resolved. This is different from Next.js 13-14 where params was a plain object. The folder name [slug] determines the key name in the params object.',
    hints: ['params is a Promise in Next.js 15 — you must await it', 'The folder name [slug] becomes the key in params', 'The component must be async to use await'],
    tieredHints: {
      apiSignature: 'async function BlogPost({ params }: { params: Promise<{ slug: string }> })',
      skeleton: `export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await ____;
  const title = slug.replace(/-/g, " ");

  return (
    <article>
      <h1>{____}</h1>
      <p>Loading content for: {____}</p>
    </article>
  );
}`,
    },
    tags: ['dynamic-routes', 'params', 'async-component'],
    concepts: ['next-app-router', 'next-data-fetching'],
  },

  {
    id: 'next-route-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_ROUTING,
    course: Course.WEB_DEV,
    question: 'You have a Next.js app with both a marketing site and a dashboard. You want /about and /pricing to share a marketing layout (centered, max-width), while /dashboard and /dashboard/settings share a sidebar layout. However, you do NOT want "marketing" or "dashboard-group" to appear in the URL.\n\nWhich file structure accomplishes this?',
    options: [
      { id: 'a', text: 'app/(marketing)/layout.tsx, app/(marketing)/about/page.tsx, app/(dashboard)/layout.tsx, app/(dashboard)/dashboard/page.tsx', isCorrect: true },
      { id: 'b', text: 'app/marketing/layout.tsx, app/marketing/about/page.tsx, app/dashboard/layout.tsx, app/dashboard/settings/page.tsx', isCorrect: false },
      { id: 'c', text: 'app/[group]/layout.tsx with conditional rendering based on group param', isCorrect: false },
      { id: 'd', text: 'app/layout.tsx with usePathname() to conditionally render different layouts', isCorrect: false },
    ],
    explanation: 'Route groups use (folderName) syntax — the parentheses tell Next.js to exclude the folder from the URL path. This lets you organize routes and apply different layouts without affecting URLs. Option B would add /marketing/ to URLs. Option C uses dynamic routes which serve a different purpose. Option D works but violates separation of concerns and forces the root layout to know about every section.',
    hints: ['Parentheses in folder names have special meaning in the App Router', 'Route groups affect layout grouping but not URL structure'],
    tags: ['route-groups', 'layouts', 'organization'],
    concepts: ['next-app-router'],
  },

  {
    id: 'next-route-4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_ROUTING,
    course: Course.WEB_DEV,
    question: 'You have a multi-step form wizard at /onboarding. Each step (/onboarding/step-1, /onboarding/step-2, etc.) shares a progress bar and stepper UI. However, you need the progress bar animation to restart from scratch each time the user navigates between steps — the state must completely reset.\n\nWhich approach is correct?',
    options: [
      { id: 'a', text: 'Use app/onboarding/layout.tsx — layouts reset state on each navigation', isCorrect: false },
      { id: 'b', text: 'Use app/onboarding/template.tsx — templates create a new instance on each navigation', isCorrect: true },
      { id: 'c', text: 'Use app/onboarding/layout.tsx with a key={pathname} prop to force re-mount', isCorrect: false },
      { id: 'd', text: 'Use app/onboarding/loading.tsx — it re-renders on each navigation', isCorrect: false },
    ],
    explanation: 'layout.tsx preserves state across navigations — if you have a counter in a layout, it keeps counting as the user moves between child pages. template.tsx is identical in API (accepts children), but Next.js creates a brand new instance on every navigation, resetting all React state and effects. This makes template.tsx ideal for enter/exit animations, per-page analytics logging, or forms that must reset between steps. You cannot pass a key prop to layout.tsx since Next.js controls its rendering.',
    hints: ['Think about which file convention forces a complete re-mount', 'layout.tsx is designed to persist, not reset'],
    tags: ['template', 'layout', 'state-reset', 'navigation'],
    concepts: ['next-app-router'],
  },

  {
    id: 'next-route-notfound-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_ROUTING,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Fill in the import path and the function call that renders the nearest not-found.tsx (or the default 404 page) when a fetched post does not exist.',
    template: 'import { ___ } from "next/navigation";\n\nexport default async function BlogPost({\n  params,\n}: {\n  params: Promise<{ slug: string }>;\n}) {\n  const { slug } = await params;\n  const post = await getPost(slug);\n\n  if (!post) {\n    ___;\n  }\n\n  return <article>{post.title}</article>;\n}',
    blanks: ['notFound', 'notFound()'],
    solution: 'import { notFound } from "next/navigation";\n\nexport default async function BlogPost({\n  params,\n}: {\n  params: Promise<{ slug: string }>;\n}) {\n  const { slug } = await params;\n  const post = await getPost(slug);\n\n  if (!post) {\n    notFound();\n  }\n\n  return <article>{post.title}</article>;\n}',
    explanation: 'notFound() throws a special error internally that Next.js catches and renders the nearest not-found.tsx (or the framework default 404) instead of the component\'s normal output. Code after the call never runs, so treat it like a throw rather than a return value.',
    hints: ['imported from next/navigation', 'call it, do not return it — nothing after it executes'],
    tags: ['notFound', 'dynamic-routes', '404'],
    concepts: ['next-app-router'],
  },
  {
    id: 'next-route-notfound-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_ROUTING,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Create a dynamic product page that shows a 404 when the product does not exist.\n\nFile: app/products/[id]/page.tsx\n\nAssume a `getProduct(id: string)` async function is already defined and imported for you from "@/lib/products".\n\n- The component must be async; params is `Promise<{ id: string }>`\n- Await params, then await `getProduct(id)`\n- If the result is falsy, call `notFound()` from "next/navigation"\n- Otherwise return `<h1>{product.name}</h1>`',
    starterCode: `import { notFound } from "next/navigation";\nimport { getProduct } from "@/lib/products";\n\nexport default async function ProductPage({\n  params,\n}: {\n  params: Promise<{ id: string }>;\n}) {\n  // Await params, fetch the product, notFound() if missing\n}`,
    testCases: [
      {
        input: 'product missing',
        expectedOutput: 'if (!product) { notFound(); }',
        description: 'Should call notFound() when the product is missing',
      },
      {
        input: 'product found',
        expectedOutput: '<h1>{product.name}</h1>',
        description: 'Should render the product name in an h1',
      },
    ],
    solution: `import { notFound } from "next/navigation";\nimport { getProduct } from "@/lib/products";\n\nexport default async function ProductPage({\n  params,\n}: {\n  params: Promise<{ id: string }>;\n}) {\n  const { id } = await params;\n  const product = await getProduct(id);\n\n  if (!product) {\n    notFound();\n  }\n\n  return <h1>{product.name}</h1>;\n}`,
    explanation: 'notFound() works in Server Components, Route Handlers, and Server Actions. It is the App Router equivalent of returning a 404 status — calling it stops execution and Next.js renders the nearest not-found.tsx boundary (or its own default 404 page if none exists).',
    hints: ['notFound() comes from next/navigation', 'call it when the fetched data is missing, before rendering', 'it throws internally — nothing after it executes'],
    tieredHints: {
      apiSignature: 'async function ProductPage({ params }: { params: Promise<{ id: string }> })',
      skeleton: `export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    ____();
  }

  return <h1>{product.____}</h1>;
}`,
    },
    tags: ['notFound', 'dynamic-routes', '404'],
    concepts: ['next-app-router'],
  },
  {
    id: 'next-route-redirect-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_ROUTING,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Fill in the import and the call that sends an unauthenticated visitor to /login before the dashboard renders.',
    template: 'import { ___ } from "next/navigation";\n\nexport default async function DashboardPage() {\n  const session = await getSession();\n\n  if (!session) {\n    ___;\n  }\n\n  return <h1>Welcome</h1>;\n}',
    blanks: ['redirect', 'redirect("/login")'],
    solution: 'import { redirect } from "next/navigation";\n\nexport default async function DashboardPage() {\n  const session = await getSession();\n\n  if (!session) {\n    redirect("/login");\n  }\n\n  return <h1>Welcome</h1>;\n}',
    explanation: 'redirect() from next/navigation works in Server Components, Route Handlers, and Server Actions — like notFound(), it throws internally, so code after it never runs, and Next.js turns that into an HTTP redirect. This is a different mechanism from useRouter().push() in Client Components, which is an imperative client-side navigation call.',
    hints: ['import from next/navigation, not next/router', 'it takes the destination path as its only argument'],
    tags: ['redirect', 'server-component', 'navigation'],
    concepts: ['next-app-router'],
  },
  {
    id: 'next-route-useroute-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_ROUTING,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Create a Client Component with a button that programmatically navigates to "/dashboard" when clicked, using the App Router\'s navigation hook (not next/link).\n\nFile: app/components/GoToDashboardButton.tsx\n\n- Mark the file "use client"\n- Import useRouter from "next/navigation"\n- Call useRouter() inside the component to get a router instance\n- Render a <button> whose onClick calls router.push("/dashboard")\n- Button text: "Go to Dashboard"',
    starterCode: `"use client";\n\nimport { useRouter } from "next/navigation";\n\nexport default function GoToDashboardButton() {\n  // Get the router instance and wire up the button\n}`,
    testCases: [
      {
        input: 'hook',
        expectedOutput: 'const router = useRouter();',
        description: 'Should call useRouter() to get the router instance',
      },
      {
        input: 'click handler',
        expectedOutput: 'onClick={() => router.push("/dashboard")}',
        description: 'Should navigate to /dashboard via router.push on click',
      },
    ],
    solution: `"use client";\n\nimport { useRouter } from "next/navigation";\n\nexport default function GoToDashboardButton() {\n  const router = useRouter();\n\n  return (\n    <button onClick={() => router.push("/dashboard")}>\n      Go to Dashboard\n    </button>\n  );\n}`,
    explanation: 'useRouter() from next/navigation (App Router) gives Client Components imperative navigation methods like push and replace, for cases a declarative <Link> cannot cover — e.g. navigating after a non-link event like a form submission or timer. It requires "use client" since it is a hook, and it is a different, smaller API than the Pages Router\'s next/router (no query or asPath).',
    hints: ['this hook only works in a Client Component', 'the import path is next/navigation, not next/router', 'push takes the destination path as a string'],
    tieredHints: {
      apiSignature: 'function GoToDashboardButton()',
      skeleton: `"use client";

export default function GoToDashboardButton() {
  const router = ____();

  return (
    <button onClick={() => router.____("/dashboard")}>
      Go to Dashboard
    </button>
  );
}`,
    },
    tags: ['useRouter', 'client-component', 'navigation'],
    concepts: ['next-app-router'],
  },
  {
    id: 'next-route-pathname-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_ROUTING,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Fill in the hook import and call that gives this Client Component the current URL path, so it can compare it against its own href and style itself as active.',
    template: '"use client";\n\nimport Link from "next/link";\nimport { ___ } from "next/navigation";\n\nexport default function NavLink({\n  href,\n  children,\n}: {\n  href: string;\n  children: React.ReactNode;\n}) {\n  const pathname = ___();\n  const isActive = pathname === href;\n\n  return (\n    <Link href={href} className={isActive ? "active" : ""}>\n      {children}\n    </Link>\n  );\n}',
    blanks: ['usePathname', 'usePathname'],
    solution: '"use client";\n\nimport Link from "next/link";\nimport { usePathname } from "next/navigation";\n\nexport default function NavLink({\n  href,\n  children,\n}: {\n  href: string;\n  children: React.ReactNode;\n}) {\n  const pathname = usePathname();\n  const isActive = pathname === href;\n\n  return (\n    <Link href={href} className={isActive ? "active" : ""}>\n      {children}\n    </Link>\n  );\n}',
    explanation: 'usePathname returns the current URL\'s path (no search params or hash), letting a Client Component compare it against a link\'s href to apply active-state styling. It is a Client Component hook — pairing it with next/link, which works in both server and client contexts, is a common intermediate combination.',
    hints: ['the hook comes from next/navigation, same package as useRouter', 'it returns a plain string, not an object'],
    tags: ['usePathname', 'active-link', 'navigation'],
    concepts: ['next-app-router'],
  },
  {
    id: 'next-route-catchall-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_ROUTING,
    course: Course.WEB_DEV,
    question: 'You are building a docs site where app/docs/[...slug]/page.tsx should match /docs/a, /docs/a/b, /docs/a/b/c, and so on. Editorial also wants /docs itself (no trailing segment) to render the same page, as a docs index. Which single change makes /docs itself match too?',
    options: [
      { id: 'a', text: 'Rename the folder to app/docs/[[...slug]]/page.tsx and handle slug being undefined for the index case', isCorrect: true },
      { id: 'b', text: 'Rename the folder to app/docs/[slug]/page.tsx, since [slug] already matches any single path under /docs', isCorrect: false },
      { id: 'c', text: 'Keep app/docs/[...slug]/page.tsx and check if params.slug is an empty array when the request path is exactly /docs', isCorrect: false },
      { id: 'd', text: 'Add a second dynamic segment folder app/docs/[...slug]/[optional]/page.tsx so the second segment can be skipped', isCorrect: false },
    ],
    explanation: '[...slug] (single brackets) is a catch-all — it requires at least one path segment, so /docs alone still 404s. [[...slug]] (double brackets) is the optional catch-all: it matches everything the catch-all does, plus the parent route with zero segments, in which case slug is undefined rather than an empty array. [slug] only matches exactly one segment, so it would reject /docs/a/b. Nesting another segment folder does not make the outer catch-all itself optional.',
    hints: ['the catch-all and optional catch-all differ by one pair of brackets', 'with the optional form, slug can come through as undefined'],
    tags: ['catch-all', 'dynamic-routes', 'optional-catch-all'],
    concepts: ['next-app-router'],
  },
  {
    id: 'next-route-catchall-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_ROUTING,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Fill in the type of a catch-all segment\'s params value, and the array method used to join it back into a display path.',
    template: 'export default async function DocsPage({\n  params,\n}: {\n  params: Promise<{ slug: ___ }>;\n}) {\n  const { slug } = await params;\n  const path = slug.___("/");\n\n  return <h1>{path}</h1>;\n}',
    blanks: ['string[]', 'join'],
    solution: 'export default async function DocsPage({\n  params,\n}: {\n  params: Promise<{ slug: string[] }>;\n}) {\n  const { slug } = await params;\n  const path = slug.join("/");\n\n  return <h1>{path}</h1>;\n}',
    explanation: 'A catch-all segment app/docs/[...slug]/page.tsx captures every remaining path segment as an array of strings, not a single string — a request for /docs/a/b/c gives slug = ["a", "b", "c"]. join("/") is a common way to reassemble that array into a display path.',
    hints: ['the folder name has three dots, which is a hint about the shape it captures', 'arrays of strings can be reassembled with a built-in join method'],
    tags: ['catch-all', 'dynamic-routes', 'params'],
    concepts: ['next-app-router'],
  },
  {
    id: 'next-route-parallel-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.NEXT_ROUTING,
    course: Course.WEB_DEV,
    question: 'A dashboard route needs to render an @analytics slot and a @team slot simultaneously alongside its default children. Separately, a photo feed needs to open a photo in a modal at /photos/3 while the feed stays visible underneath, but a direct link or page refresh to /photos/3 must still show the full standalone photo page. Which pairing of App Router features fits these two requirements?',
    options: [
      { id: 'a', text: 'Parallel routes (@slot folders) for the dashboard; intercepting routes ((.)folder convention) for the modal-over-feed', isCorrect: true },
      { id: 'b', text: 'Route groups — (dashboard) and (photos) folders — for both cases, since grouping controls what renders together', isCorrect: false },
      { id: 'c', text: 'Parallel routes for both cases — @analytics/@team slots for the dashboard and an @modal slot for the photo feed', isCorrect: false },
      { id: 'd', text: 'A catch-all segment [...slot] for both cases, branching internally on which path segment matched', isCorrect: false },
    ],
    explanation: 'Parallel routes (@slot-named folders, rendered via matching props on the layout) let a layout render multiple independent pages in the same view at once — a fit for the dashboard. Intercepting routes ((.)folder, (..)folder, (...)folder conventions) let a route "intercept" client-side navigation to show different UI (like a modal), while a hard refresh or direct link still resolves the real underlying route — a fit for the photo modal. Route groups only organize files and affect layout nesting, not simultaneous rendering or interception; a bare parallel slot alone does not give a direct link to /photos/3 its own full page.',
    hints: ['one feature renders multiple things at once; the other swaps what renders based on how you navigated there', 'a direct link needs to bypass the interception and hit the real route'],
    tags: ['parallel-routes', 'intercepting-routes', 'modals'],
    concepts: ['next-app-router'],
  },

  // =====================================================================
  // NEXT_SERVER_COMPONENTS (10 questions)
  // =====================================================================

  // BEGINNER faded (Parsons + Cloze) — lower-load scaffold before cold coding
  {
    id: 'next-sc-parsons-1',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_SERVER_COMPONENTS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Assemble a Server Component that fetches users and renders them. A Server Component fetches data directly — no useState, no useEffect. Order: the signature first, then await the data, then return the list, then the closing brace.',
    correctOrder: [
      'export default async function UsersPage() {',
      '  const users = await getUsers();',
      '  return <ul>{users.map((u) => <li key={u.id}>{u.name}</li>)}</ul>;',
      '}',
    ],
    distractorLines: [
      '  const [users, setUsers] = useState([]);',
      '  useEffect(() => { getUsers().then(setUsers); }, []);',
    ],
    solution: 'export default async function UsersPage() {\n  const users = await getUsers();\n  return <ul>{users.map((u) => <li key={u.id}>{u.name}</li>)}</ul>;\n}',
    explanation: 'Server Components are async and await data directly on the server — no client-side state or effects, and the database query never reaches the browser. The distractor lines are the Client Component pattern (useState + useEffect), which you only reach for when you need interactivity.',
    hints: ['Server Components can be async and await directly', 'no useState/useEffect needed for fetching', 'the distractors are the client-side pattern'],
    tags: ['server-component', 'async', 'data-fetching'],
    concepts: ['next-server-vs-client', 'next-data-fetching'],
  },
  {
    id: 'next-sc-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_SERVER_COMPONENTS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Fill in the two keywords that let a Server Component fetch data directly: the modifier on the function, and the operator that waits for the Promise.',
    template: 'export default ___ function UsersPage() {\n  const users = ___ getUsers();\n  return <ul>{users.map((u) => <li key={u.id}>{u.name}</li>)}</ul>;\n}',
    blanks: ['async', 'await'],
    solution: 'export default async function UsersPage() {\n  const users = await getUsers();\n  return <ul>{users.map((u) => <li key={u.id}>{u.name}</li>)}</ul>;\n}',
    explanation: 'Marking the component async lets you await Promises inside it. Because Server Components run only on the server, awaiting a data call there embeds the result directly into the HTML — no loading state, no client fetch.',
    hints: ['the function modifier that enables awaiting', 'the operator that pauses for a Promise'],
    tags: ['server-component', 'async', 'await'],
    concepts: ['next-server-vs-client', 'js-promises-async'],
  },
  {
    id: 'next-sc-cloze-2',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_SERVER_COMPONENTS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Fill in the directive that marks a file as a Client Component, and the React hook it must use to hold interactive state.',
    template: '"use ___";\n\nimport { ___ } from "react";\n\nexport default function Toggle() {\n  const [on, setOn] = useState(false);\n  return <button onClick={() => setOn(!on)}>{String(on)}</button>;\n}',
    blanks: ['client', 'useState'],
    solution: '"use client";\n\nimport { useState } from "react";\n\nexport default function Toggle() {\n  const [on, setOn] = useState(false);\n  return <button onClick={() => setOn(!on)}>{String(on)}</button>;\n}',
    explanation: 'The "use client" directive at the top of a file opts it (and everything it imports) into the client bundle, where browser-only APIs and React state hooks work. A Server Component cannot call useState; the moment you need it, you cross the boundary into a Client Component.',
    hints: ['the directive string ends with the word for browser-side', 'the hook that returns [value, setter]'],
    tags: ['use-client', 'useState', 'client-component'],
    concepts: ['next-server-vs-client'],
  },
  {
    id: 'next-sc-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_SERVER_COMPONENTS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Create a Server Component that fetches a list of users from a database and renders them.\n\nFile: app/users/page.tsx\n\nAssume a function `getUsers()` is imported from "@/lib/db" that returns Promise<{ id: number; name: string; email: string }[]>.\n\n- Make the component async\n- Await getUsers() to get the user list\n- Render a <ul> where each user is an <li key={user.id}> showing "{user.name} — {user.email}"\n\nDo NOT add "use client" — this is a Server Component.',
    starterCode: `// app/users/page.tsx\nimport { getUsers } from "@/lib/db";\n\nexport default async function UsersPage() {\n  // Fetch users and render them\n}`,
    testCases: [
      {
        input: 'server component',
        expectedOutput: 'const users = await getUsers()',
        description: 'Should await getUsers() directly in the component',
      },
      {
        input: 'render list',
        expectedOutput: '<ul>{users.map(user => <li key={user.id}>{user.name} — {user.email}</li>)}</ul>',
        description: 'Should render users in a list with key and formatted text',
      },
    ],
    solution: `// app/users/page.tsx\nimport { getUsers } from "@/lib/db";\n\nexport default async function UsersPage() {\n  const users = await getUsers();\n\n  return (\n    <ul>\n      {users.map((user) => (\n        <li key={user.id}>\n          {user.name} — {user.email}\n        </li>\n      ))}\n    </ul>\n  );\n}`,
    explanation: 'Server Components can be async functions and directly await data fetching — no useEffect, no loading state management, no client-side fetch. The HTML is generated on the server with the data already embedded, so the user sees content immediately. This also means your database credentials and queries never reach the browser. Server Components are the default in the App Router; you only add "use client" when you need interactivity.',
    hints: ['Server Components can be async — just use await directly', 'No useState or useEffect needed for data fetching', 'The component runs entirely on the server'],
    tieredHints: {
      apiSignature: 'async function UsersPage()',
      skeleton: `export default async function UsersPage() {
  const users = await ____();

  return (
    <ul>
      {users.map((user) => (
        <li key={user.____}>
          {user.name} — {user.email}
        </li>
      ))}
    </ul>
  );
}`,
    },
    tags: ['server-component', 'async', 'data-fetching', 'database'],
    concepts: ['next-server-vs-client', 'js-promises-async', 'next-data-fetching'],
  },

  {
    id: 'next-sc-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_SERVER_COMPONENTS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: `You need an interactive "Add to Cart" button that uses useState, but it lives inside a product page that fetches data from the database.\n\nCreate TWO components:\n\n1. File: app/components/AddToCartButton.tsx (Client Component)\n   - Must have "use client" directive\n   - Takes props: { productId: string; price: number }\n   - Uses useState to track \`added\` (boolean, initially false)\n   - Renders a <button> that on click sets added to true\n   - Button text: added ? "Added ✓" : \`Add to Cart — $\${price}\`\n\n2. File: app/product/[id]/page.tsx (Server Component)\n   - Imports AddToCartButton\n   - Fetches product using getProduct(id) from "@/lib/db" (returns { id: string; name: string; price: number })\n   - Renders <h1>{product.name}</h1> and <AddToCartButton productId={product.id} price={product.price} />`,
    starterCode: `// app/components/AddToCartButton.tsx\n\n// TODO: Create the client component\n\n\n// app/product/[id]/page.tsx\nimport { getProduct } from "@/lib/db";\nimport AddToCartButton from "@/components/AddToCartButton";\n\nexport default async function ProductPage({\n  params,\n}: {\n  params: Promise<{ id: string }>;\n}) {\n  // TODO: Fetch product and render with AddToCartButton\n}`,
    testCases: [
      {
        input: 'client component',
        expectedOutput: '"use client"',
        description: 'AddToCartButton must have "use client" directive',
      },
      {
        input: 'composition pattern',
        expectedOutput: '<AddToCartButton productId={product.id} price={product.price} />',
        description: 'Server Component passes serializable props to Client Component',
      },
    ],
    solution: `// app/components/AddToCartButton.tsx\n"use client";\n\nimport { useState } from "react";\n\nexport default function AddToCartButton({\n  productId,\n  price,\n}: {\n  productId: string;\n  price: number;\n}) {\n  const [added, setAdded] = useState(false);\n\n  return (\n    <button onClick={() => setAdded(true)}>\n      {added ? "Added ✓" : \`Add to Cart — $\${price}\`}\n    </button>\n  );\n}\n\n// app/product/[id]/page.tsx\nimport { getProduct } from "@/lib/db";\nimport AddToCartButton from "@/components/AddToCartButton";\n\nexport default async function ProductPage({\n  params,\n}: {\n  params: Promise<{ id: string }>;\n}) {\n  const { id } = await params;\n  const product = await getProduct(id);\n\n  return (\n    <div>\n      <h1>{product.name}</h1>\n      <AddToCartButton productId={product.id} price={product.price} />\n    </div>\n  );\n}`,
    explanation: 'The key pattern is: Server Components can import and render Client Components, but NOT vice versa. The Server Component fetches data and passes serializable props (strings, numbers, booleans, plain objects) down to Client Components. This means the database query runs on the server, while the interactive button runs in the browser. The "use client" directive marks the boundary — everything imported by a "use client" file also becomes client-side.',
    hints: ['Server Components can render Client Components by importing them', 'Props passed across the boundary must be serializable (no functions, no classes)', '"use client" must be at the top of the file, before any imports'],
    tieredHints: {
      apiSignature: 'function AddToCartButton({ productId, price }: { productId: string; price: number })',
      skeleton: `// AddToCartButton.tsx
"use client";

export default function AddToCartButton({ productId, price }) {
  const [added, setAdded] = useState(false);
  return <button onClick={() => setAdded(true)}>{added ? "Added ✓" : \`Add to Cart — \\\$\${price}\`}</button>;
}

// page.tsx
export default async function ProductPage({ params }) {
  const { id } = await params;
  const product = await ____(id);
  return <AddToCartButton productId={product.id} price={product.price} />;
}`,
    },
    tags: ['server-client-composition', 'use-client', 'props-boundary'],
    concepts: ['next-server-vs-client'],
  },

  {
    id: 'next-sc-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_SERVER_COMPONENTS,
    course: Course.WEB_DEV,
    question: `A developer writes a Server Component that reads from the filesystem:\n\n\`\`\`tsx\n// app/docs/[slug]/page.tsx\nimport fs from "fs";\nimport path from "path";\n\nexport default async function DocPage({ params }) {\n  const { slug } = await params;\n  const content = fs.readFileSync(\n    path.join(process.cwd(), "docs", \`\${slug}.md\`),\n    "utf-8"\n  );\n  return <article>{content}</article>;\n}\n\`\`\`\n\nThen they try to add a "Copy to Clipboard" button by adding \`"use client"\` and \`useState\` to the SAME file. What happens?`,
    options: [
      { id: 'a', text: 'It works fine — once a file has "use client", Next.js automatically polyfills fs and other Node.js APIs so they run safely in the browser bundle', isCorrect: false },
      { id: 'b', text: 'Runtime error — fs successfully reads the file during SSR but throws a "module not found" error the moment hydration starts in the browser', isCorrect: false },
      { id: 'c', text: 'Build error — "use client" makes this a Client Component, which cannot use fs, path, or other Node.js modules since the code ships to the browser', isCorrect: true },
      { id: 'd', text: 'It works but only during the initial server render — once hydration happens, the client-side re-render silently falls back to empty content', isCorrect: false },
    ],
    explanation: 'Adding "use client" converts the entire file into a Client Component. Client Components are bundled and sent to the browser, where Node.js APIs like fs and path do not exist. The correct solution is to keep the file-reading logic in a Server Component and extract the "Copy to Clipboard" button into a separate Client Component file. This is the fundamental Server/Client boundary: Server Components can use Node.js APIs, secrets, and direct DB access; Client Components can use browser APIs, useState, onClick, etc. You cannot mix them in one file.',
    hints: ['"use client" affects the entire file', 'Think about where the code actually runs'],
    tags: ['server-client-boundary', 'node-apis', 'build-error'],
    concepts: ['next-server-vs-client'],
  },

  {
    id: 'next-sc-4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.NEXT_SERVER_COMPONENTS,
    course: Course.WEB_DEV,
    question: 'You have a Client Component <Tabs> that renders its children prop. You want one of the tab panels to contain a Server Component that fetches data from the database:\n\n```tsx\n// Is this valid?\n<Tabs>\n  <TabPanel label="Users">\n    <UserList />  {/* Server Component that does await db.query() */}\n  </TabPanel>\n</Tabs>\n```\n\nWhat is the correct assessment?',
    options: [
      { id: 'a', text: 'Invalid — a Client Component cannot render Server Components in any way', isCorrect: false },
      { id: 'b', text: 'Valid only if Tabs uses React.lazy() to dynamically import UserList', isCorrect: false },
      { id: 'c', text: 'Invalid — you must convert UserList to a Client Component and use useEffect for data fetching', isCorrect: false },
      { id: 'd', text: 'Valid — Server Components passed as children/props to Client Components work because the server renders them first, then passes the serialized output as a "slot" to the Client Component', isCorrect: true },
    ],
    explanation: 'This is one of the most counterintuitive patterns in the App Router. A Client Component cannot IMPORT a Server Component (because the import would pull it into the client bundle). But a Client Component CAN RECEIVE a Server Component as children or any other JSX prop. Why? Because the parent Server Component renders <UserList /> on the server first, producing serialized React output. It then passes that pre-rendered output to <Tabs> as the children prop — by the time Tabs receives it, it is just serialized React elements, not a live component. This "children as slots" pattern is the primary way to compose Server and Client Components.',
    hints: ['Think about the difference between importing a component and receiving pre-rendered JSX', 'Consider which component is responsible for the initial render'],
    tags: ['composition-pattern', 'children-prop', 'slots', 'serialization'],
    concepts: ['next-server-vs-client'],
  },

  // =====================================================================
  // NEXT_DATA_FETCHING (4 questions)
  // =====================================================================

  // BEGINNER faded (Parsons + Cloze) — lower-load scaffold before cold coding
  {
    id: 'next-fetch-parsons-1',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_DATA_FETCHING,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Assemble a Server Component that fetches posts with hourly revalidation (ISR). Order: the signature first, then the fetch call, then parse the JSON, then return the list, then the closing brace.',
    correctOrder: [
      'export default async function PostsPage() {',
      '  const res = await fetch("https://api.example.com/posts", { next: { revalidate: 3600 } });',
      '  const data = await res.json();',
      '  return <ul>{data.posts.map((p) => <li key={p.id}>{p.title}</li>)}</ul>;',
      '}',
    ],
    distractorLines: [
      '  const res = fetch("https://api.example.com/posts");',
      '  const data = res.json();',
    ],
    solution: 'export default async function PostsPage() {\n  const res = await fetch("https://api.example.com/posts", { next: { revalidate: 3600 } });\n  const data = await res.json();\n  return <ul>{data.posts.map((p) => <li key={p.id}>{p.title}</li>)}</ul>;\n}',
    explanation: 'Next.js extends fetch with a next option; next.revalidate (in seconds) turns on Incremental Static Regeneration — the page is cached and regenerated at most once per interval. Both fetch and .json() return Promises, so both must be awaited; the distractor lines drop the awaits.',
    hints: ['fetch and .json() both return Promises — await both', 'revalidate is in seconds', 'the next option is Next.js-specific'],
    tags: ['fetch', 'revalidation', 'isr'],
    concepts: ['next-data-fetching', 'js-promises-async'],
  },
  {
    id: 'next-fetch-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_DATA_FETCHING,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Fill in the Next.js-specific fetch option key that carries caching directives, and the Response method that parses the body as JSON.',
    template: 'const res = await fetch("https://api.example.com/posts", {\n  ___: { revalidate: 3600 },\n});\nconst data = await res.___();',
    blanks: ['next', 'json'],
    solution: 'const res = await fetch("https://api.example.com/posts", {\n  next: { revalidate: 3600 },\n});\nconst data = await res.json();',
    explanation: 'The next option is how Next.js layers caching/revalidation onto the standard fetch API. res.json() reads and parses the response body — it returns a Promise, so it is awaited.',
    hints: ['the option key matches the framework name', 'the Response method that returns parsed JSON'],
    tags: ['fetch', 'revalidation', 'json'],
    concepts: ['next-data-fetching'],
  },
  {
    id: 'next-fetch-cloze-2',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_DATA_FETCHING,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Fill in the fetch caching options: the seconds-based key for "regenerate at most this often", and the cache value for "never cache, always fetch fresh".',
    template: '// regenerate at most once per hour\nconst a = await fetch(url, { next: { ___: 3600 } });\n// opt out of caching entirely\nconst b = await fetch(url, { cache: "___" });',
    blanks: ['revalidate', 'no-store'],
    solution: '// regenerate at most once per hour\nconst a = await fetch(url, { next: { revalidate: 3600 } });\n// opt out of caching entirely\nconst b = await fetch(url, { cache: "no-store" });',
    explanation: 'next.revalidate sets a time-based ISR window. cache: "no-store" opts the request out of caching completely, forcing a fresh fetch on every request (and making the route dynamic). Omitting both caches the response indefinitely.',
    hints: ['the time-based key under next', 'the cache value that means "do not keep it"'],
    tags: ['fetch', 'revalidation', 'no-store', 'caching'],
    concepts: ['next-data-fetching'],
  },
  {
    id: 'next-fetch-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_DATA_FETCHING,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Create a Server Component page that fetches a list of posts from an external API with time-based revalidation.\n\nFile: app/posts/page.tsx\n\n- Fetch from "https://api.example.com/posts" using the fetch() API\n- Use next.revalidate option set to 3600 (revalidate every hour)\n- The API returns: { posts: { id: number; title: string }[] }\n- Render an <h1>Blog Posts</h1> followed by a <ul> with each post as <li key={post.id}>{post.title}</li>',
    starterCode: `// app/posts/page.tsx\n\nexport default async function PostsPage() {\n  // Fetch posts with revalidation and render\n}`,
    testCases: [
      {
        input: 'fetch with revalidation',
        expectedOutput: 'fetch("https://api.example.com/posts", { next: { revalidate: 3600 } })',
        description: 'Should fetch with next.revalidate option set to 3600',
      },
      {
        input: 'render posts',
        expectedOutput: '<ul>{posts.map(post => <li key={post.id}>{post.title}</li>)}</ul>',
        description: 'Should render posts as list items',
      },
    ],
    solution: `// app/posts/page.tsx\n\nexport default async function PostsPage() {\n  const res = await fetch("https://api.example.com/posts", {\n    next: { revalidate: 3600 },\n  });\n  const data = await res.json();\n\n  return (\n    <div>\n      <h1>Blog Posts</h1>\n      <ul>\n        {data.posts.map((post: { id: number; title: string }) => (\n          <li key={post.id}>{post.title}</li>\n        ))}\n      </ul>\n    </div>\n  );\n}`,
    explanation: 'Next.js extends the native fetch() API with a `next` option. Setting `next: { revalidate: 3600 }` implements Incremental Static Regeneration (ISR): the page is statically generated at build time, then regenerated in the background at most once every 3600 seconds when a request comes in. This gives you the performance of static pages with near-real-time data. Setting revalidate to 0 is equivalent to dynamic rendering, and omitting it entirely means the page is cached indefinitely (fully static).',
    hints: ['Next.js extends fetch() with a next option object', 'revalidate is in seconds, not milliseconds', 'Server Components can use fetch() directly — no useEffect needed'],
    tieredHints: {
      apiSignature: 'async function PostsPage()',
      skeleton: `export default async function PostsPage() {
  const res = await fetch("https://api.example.com/posts", {
    next: { revalidate: ____ },
  });
  const data = await res.____();

  return (
    <div>
      <h1>Blog Posts</h1>
      <ul>{data.posts.map((post) => <li key={post.id}>{post.title}</li>)}</ul>
    </div>
  );
}`,
    },
    tags: ['fetch', 'revalidation', 'isr', 'static-generation'],
    concepts: ['js-promises-async', 'next-data-fetching'],
  },

  {
    id: 'next-fetch-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_DATA_FETCHING,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Create a loading UI for the /dashboard route using Next.js streaming.\n\nFile: app/dashboard/loading.tsx\n\nThis file is shown instantly while the dashboard page.tsx (which does a slow database query) is loading.\n\n- Render a <div> with className="animate-pulse"\n- Inside, render 3 skeleton cards: each is a <div> with className="skeleton-card" and a fixed height placeholder\n- Add the text "Loading dashboard..." in a <p> tag',
    starterCode: `// app/dashboard/loading.tsx\n\nexport default function DashboardLoading() {\n  // Return loading skeleton UI\n}`,
    testCases: [
      {
        input: 'loading skeleton',
        expectedOutput: 'className="animate-pulse"',
        description: 'Should have pulse animation wrapper',
      },
      {
        input: 'skeleton cards',
        expectedOutput: 'skeleton-card',
        description: 'Should contain skeleton card placeholders',
      },
    ],
    solution: `// app/dashboard/loading.tsx\n\nexport default function DashboardLoading() {\n  return (\n    <div className="animate-pulse">\n      <p>Loading dashboard...</p>\n      <div className="skeleton-card" style={{ height: 120 }} />\n      <div className="skeleton-card" style={{ height: 120 }} />\n      <div className="skeleton-card" style={{ height: 120 }} />\n    </div>\n  );\n}`,
    explanation: 'loading.tsx leverages React Suspense under the hood. When a user navigates to /dashboard, Next.js immediately streams the loading.tsx content while the async page.tsx is still fetching data. This is NOT a client-side spinner — the loading UI is sent as part of the initial HTML response via streaming, then swapped with the real content once ready. This dramatically improves perceived performance because the user sees layout + skeleton instead of a blank page. Under the hood, Next.js wraps page.tsx in a <Suspense fallback={<Loading />}> boundary automatically.',
    hints: ['loading.tsx is automatically used as a Suspense boundary', 'This is a regular React component — no special API needed', 'It runs on the server and streams immediately'],
    tieredHints: {
      apiSignature: 'function DashboardLoading()',
      skeleton: `export default function DashboardLoading() {
  return (
    <div className="____">
      <p>Loading dashboard...</p>
      <div className="____" style={{ height: 120 }} />
    </div>
  );
}`,
    },
    tags: ['loading', 'streaming', 'suspense', 'skeleton-ui'],
    concepts: ['next-streaming-suspense'],
  },

  {
    id: 'next-fetch-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_DATA_FETCHING,
    course: Course.WEB_DEV,
    question: 'A developer needs to revalidate cached data after a user submits a form that creates a new blog post. The form is handled by a Server Action. Which revalidation approach is most appropriate?\n\n```tsx\n"use server";\nasync function createPost(formData: FormData) {\n  await db.posts.create({ title: formData.get("title") });\n  // How to revalidate?\n}\n```',
    options: [
      { id: 'a', text: 'Use revalidatePath("/blog") to invalidate all cached data for the /blog route', isCorrect: true },
      { id: 'b', text: 'Call fetch() again with { cache: "no-store" } — this bypasses the cache', isCorrect: false },
      { id: 'c', text: 'Set a short revalidate interval and wait for it to expire', isCorrect: false },
      { id: 'd', text: 'Use router.refresh() in the Server Action to refetch data', isCorrect: false },
    ],
    explanation: 'revalidatePath("/blog") is the on-demand revalidation API designed for exactly this use case — after a mutation, you tell Next.js "the data for this path is stale, regenerate it." This purges the cached page and any fetch() caches associated with that route. revalidateTag() is similar but targets specific fetch calls by tag. Option A does not clear the page cache. Option C means users see stale data until the timer expires. Option D (router.refresh) only works in Client Components and does not clear the server-side cache.',
    hints: ['Think about on-demand revalidation after mutations', 'Server Actions have access to server-side revalidation APIs'],
    tags: ['revalidation', 'server-action', 'revalidatePath', 'mutation'],
    concepts: ['next-data-fetching', 'js-object-mutation'],
  },

  {
    id: 'next-fetch-4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.NEXT_DATA_FETCHING,
    course: Course.WEB_DEV,
    question: 'You have a product page that shows price (changes every minute) and reviews (changes rarely). You want the price section to always be fresh while the reviews section is cached for 24 hours.\n\nWhich approach correctly implements partial caching within a single page?',
    options: [
      { id: 'a', text: 'Set export const revalidate = 60 at the page level — this applies to the entire page uniformly', isCorrect: false },
      { id: 'b', text: 'Wrap the price section in a <Suspense> boundary with its own async Server Component that uses { cache: "no-store" }, and keep reviews in the main page with revalidate: 86400', isCorrect: true },
      { id: 'c', text: 'Use two separate fetch() calls with different revalidate values: fetch(priceUrl, { next: { revalidate: 60 } }) and fetch(reviewsUrl, { next: { revalidate: 86400 } })', isCorrect: false },
      { id: 'd', text: 'Use a Client Component for the price with useEffect polling and a Server Component for reviews', isCorrect: false },
    ],
    explanation: 'The page-level rendering mode is determined by the most dynamic data source — if any fetch uses cache: "no-store", the entire page becomes dynamic. Option B sounds reasonable but Next.js renders the whole page in one pass, so the 60-second revalidation would dominate. The Suspense boundary approach (C) works because each Suspense boundary can independently stream and cache. The price component streams in dynamically each request, while the reviews component is cached and served from the edge. Option D works but adds unnecessary client-side JavaScript and causes layout shifts.',
    hints: ['Consider how Suspense boundaries affect caching granularity', 'A page has a single rendering mode unless you split it with boundaries', 'Think about streaming + caching interaction'],
    tags: ['partial-caching', 'suspense', 'streaming', 'granular-revalidation'],
    concepts: ['next-streaming-suspense'],
  },

  {
    id: 'next-ssg-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_DATA_FETCHING,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Fill in the function name Next.js calls at build time to know which dynamic segment values to pre-render, and the key of the returned object matching the [slug] folder.',
    template: 'export async function ___() {\n  const posts = await getAllPosts();\n  return posts.map((post) => ({ ___: post.slug }));\n}',
    blanks: ['generateStaticParams', 'slug'],
    solution: 'export async function generateStaticParams() {\n  const posts = await getAllPosts();\n  return posts.map((post) => ({ slug: post.slug }));\n}',
    explanation: 'generateStaticParams runs at build time for a dynamic route ([slug]) and returns an array of param objects. Next.js statically generates one page per object in that array, so each key must match the dynamic segment name in the folder path.',
    hints: ['the function name mirrors what it generates', 'the object key must match the [slug] folder name'],
    tags: ['generateStaticParams', 'ssg', 'static-generation'],
    concepts: ['next-app-router', 'next-data-fetching'],
  },
  {
    id: 'next-ssg-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_DATA_FETCHING,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Add static generation to a dynamic blog route.\n\nFile: app/blog/[slug]/page.tsx\n\n- Add a generateStaticParams function that calls getAllPosts() (returns { slug: string }[]) and returns an array of { slug } objects, one per post\n- Leave the existing Page component (shown in the starter) unchanged',
    starterCode: `// app/blog/[slug]/page.tsx\nimport { getAllPosts } from '@/lib/posts';\n\n// Add generateStaticParams here\n\nexport default async function Page({ params }: { params: Promise<{ slug: string }> }) {\n  const { slug } = await params;\n  return <h1>{slug}</h1>;\n}`,
    testCases: [
      {
        input: 'generateStaticParams',
        expectedOutput: 'export async function generateStaticParams()',
        description: 'Should export a generateStaticParams function',
      },
      {
        input: 'param shape',
        expectedOutput: 'posts.map((post) => ({ slug: post.slug }))',
        description: 'Should map posts to { slug } objects',
      },
    ],
    solution: `// app/blog/[slug]/page.tsx\nimport { getAllPosts } from '@/lib/posts';\n\nexport async function generateStaticParams() {\n  const posts = await getAllPosts();\n  return posts.map((post) => ({ slug: post.slug }));\n}\n\nexport default async function Page({ params }: { params: Promise<{ slug: string }> }) {\n  const { slug } = await params;\n  return <h1>{slug}</h1>;\n}`,
    explanation: 'generateStaticParams tells Next.js which [slug] values exist so it can pre-render each one at build time (SSG) instead of rendering on every request. Any slug not in the returned list either 404s or falls back to on-demand generation, depending on dynamicParams config.',
    hints: ['generateStaticParams runs at build time, separate from the page component', 'return one { slug } object per post', 'the key name must match the folder: [slug]'],
    tieredHints: {
      apiSignature: 'async function generateStaticParams()',
      skeleton: `export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ ____: post.slug }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await ____;
  return <h1>{slug}</h1>;
}`,
    },
    tags: ['generateStaticParams', 'ssg', 'static-generation'],
    concepts: ['next-app-router', 'next-data-fetching'],
  },

  {
    id: 'next-dynamic-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_DATA_FETCHING,
    course: Course.WEB_DEV,
    question: 'A Server Component calls cookies() from next/headers to read a session cookie, then renders a personalized greeting.\n\n```tsx\nimport { cookies } from "next/headers";\n\nexport default async function Page() {\n  const session = (await cookies()).get("session");\n  return <p>Welcome back</p>;\n}\n```\n\nWhat does calling cookies() do to this route\'s rendering mode?',
    options: [
      { id: 'a', text: 'Nothing by itself — cookies() is just a read helper, and rendering mode only changes if the cookie value is interpolated into the output', isCorrect: false },
      { id: 'b', text: 'It forces the route to render dynamically on every request, since per-request cookie data cannot be known when the build runs', isCorrect: true },
      { id: 'c', text: 'It switches the route to the Edge runtime automatically, because cookies() requires edge-compatible APIs', isCorrect: false },
      { id: 'd', text: 'It has no effect on rendering mode but disables ISR caching for any fetch() calls elsewhere on the same page', isCorrect: false },
    ],
    explanation: 'Reading cookies() (or headers(), or an uncached searchParams-dependent value) opts a route into dynamic rendering the moment it is called, regardless of whether the value ends up in the rendered output. Next.js cannot know a request-specific cookie at build time, so it must render per-request. Rendering mode is separate from runtime (Node vs Edge) - option C conflates the two - and it does not selectively disable caching for unrelated fetch calls (option D).',
    hints: ['dynamic rendering is triggered by calling the API, not by what you do with its result', 'runtime (Node/Edge) and rendering mode (static/dynamic) are independent settings'],
    tags: ['dynamic-rendering', 'cookies', 'rendering-mode'],
    concepts: ['next-data-fetching'],
  },
  {
    id: 'next-dynamic-mcq-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_DATA_FETCHING,
    course: Course.WEB_DEV,
    question: 'A product-listing page reads props.searchParams to filter results by category.\n\n```tsx\nexport default async function Page({ searchParams }: { searchParams: Promise<{ category?: string }> }) {\n  const { category } = await searchParams;\n  const products = await getProducts(category);\n  return <ProductGrid items={products} />;\n}\n```\n\nWhat rendering mode does reading searchParams force, and why?',
    options: [
      { id: 'a', text: 'Static — searchParams are resolved from the route\'s known segments at build time, same as generateStaticParams', isCorrect: false },
      { id: 'b', text: 'Static, but only when the page also defines a generateStaticParams function covering every possible category', isCorrect: false },
      { id: 'c', text: 'Dynamic — the page must render per-request, because searchParams values are only known once an actual request with a query string arrives', isCorrect: true },
      { id: 'd', text: 'Dynamic in development only — the production build precomputes and caches every possible searchParams combination ahead of time', isCorrect: false },
    ],
    explanation: 'searchParams (the ?query=string part of a URL) is inherently per-request - there is no build-time list of every possible query string, unlike the fixed set of dynamic segments generateStaticParams enumerates. Reading it forces dynamic rendering. Next.js never precomputes all possible searchParams combinations (option D) - that is unbounded and not how the cache works.',
    hints: ['searchParams and dynamic-segment params are different mechanisms', 'there is no finite list of possible query strings to pre-render'],
    tags: ['dynamic-rendering', 'search-params', 'rendering-mode'],
    concepts: ['next-data-fetching'],
  },

  {
    id: 'next-parallel-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_DATA_FETCHING,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Fill in the method that fires both fetch calls concurrently instead of one waiting for the other, and the Response method used to parse each result.',
    template: 'async function ProductPage() {\n  const [productRes, reviewsRes] = await ___([\n    fetch("https://api.example.com/product"),\n    fetch("https://api.example.com/reviews"),\n  ]);\n  const product = await productRes.json();\n  const reviews = await reviewsRes.___();\n}',
    blanks: ['Promise.all', 'json'],
    solution: 'async function ProductPage() {\n  const [productRes, reviewsRes] = await Promise.all([\n    fetch("https://api.example.com/product"),\n    fetch("https://api.example.com/reviews"),\n  ]);\n  const product = await productRes.json();\n  const reviews = await reviewsRes.json();\n}',
    explanation: 'Starting both fetch() calls inside Promise.all fires them concurrently, so the total wait time is the slower of the two requests, not their sum. Awaiting each fetch sequentially (const a = await fetch(...); const b = await fetch(...);) creates an unnecessary waterfall.',
    hints: ['the method that runs an array of promises concurrently and waits for all of them', 'each fetch Response is parsed the same way'],
    tags: ['parallel-fetch', 'promise-all', 'waterfall'],
    concepts: ['next-data-fetching', 'js-promises-async'],
  },
  {
    id: 'next-parallel-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_DATA_FETCHING,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Fetch a product and its reviews in parallel, not sequentially.\n\nFile: app/product/[id]/page.tsx\n\n- Fetch "https://api.example.com/products/{id}" for the product, which returns { id: number; name: string; price: number }\n- Fetch "https://api.example.com/reviews?productId={id}" for reviews, which returns { id: number; text: string }[]\n- Use Promise.all so both requests fire concurrently instead of one awaiting the other before the second starts\n- Render <h1>{product.name}</h1>, a <p> with the price, and the reviews as <ul><li key={review.id}>{review.text}</li></ul>',
    starterCode: `// app/product/[id]/page.tsx\n\nexport default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {\n  const { id } = await params;\n  // Fetch product and reviews in parallel, then render\n}`,
    testCases: [
      {
        input: 'parallel fetch',
        expectedOutput: 'Promise.all([\n    fetch(`https://api.example.com/products/${id}`),\n    fetch(`https://api.example.com/reviews?productId=${id}`),\n  ])',
        description: 'Should fetch product and reviews concurrently via Promise.all',
      },
      {
        input: 'render reviews',
        expectedOutput: '<ul>{reviews.map((review) => <li key={review.id}>{review.text}</li>)}</ul>',
        description: 'Should render reviews as list items',
      },
    ],
    solution: `// app/product/[id]/page.tsx\n\nexport default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {\n  const { id } = await params;\n\n  const [productRes, reviewsRes] = await Promise.all([\n    fetch(\`https://api.example.com/products/\${id}\`),\n    fetch(\`https://api.example.com/reviews?productId=\${id}\`),\n  ]);\n  const product = await productRes.json();\n  const reviews = await reviewsRes.json();\n\n  return (\n    <div>\n      <h1>{product.name}</h1>\n      <p>{product.price}</p>\n      <ul>\n        {reviews.map((review: { id: number; text: string }) => (\n          <li key={review.id}>{review.text}</li>\n        ))}\n      </ul>\n    </div>\n  );\n}`,
    explanation: 'Starting both fetch calls before awaiting either one (via Promise.all) lets them run concurrently, so the page waits only as long as the slower request. Awaiting the product fetch fully before starting the reviews fetch would create a waterfall, doubling the wait for no reason since the two requests do not depend on each other.',
    hints: ['start both fetch() calls before awaiting either', 'Promise.all takes an array of promises and resolves once all of them do', 'the two requests are independent - neither needs the other\'s result'],
    tieredHints: {
      apiSignature: 'async function ProductPage({ params }: { params: Promise<{ id: string }> })',
      skeleton: `export default async function ProductPage({ params }) {
  const { id } = await params;
  const [productRes, reviewsRes] = await ____([
    fetch(\`https://api.example.com/products/\${id}\`),
    fetch(\`https://api.example.com/reviews?productId=\${id}\`),
  ]);
  const product = await productRes.json();
  const reviews = await reviewsRes.json();
}`,
    },
    tags: ['parallel-fetch', 'promise-all', 'waterfall'],
    concepts: ['next-data-fetching', 'js-promises-async'],
  },

  {
    id: 'next-suspense-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_DATA_FETCHING,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Stream a slow section of a page independently of the rest.\n\nFile: app/dashboard/page.tsx\n\nSlowStats (imported from "./SlowStats") is an async Server Component that takes several seconds to fetch its data.\n\n- Render <h1>Dashboard</h1> so it appears immediately\n- Wrap <SlowStats /> in a <Suspense> boundary from "react" with fallback={<p>Loading stats...</p>}, so the rest of the page does not wait on it',
    starterCode: `// app/dashboard/page.tsx\nimport SlowStats from './SlowStats';\n\nexport default function DashboardPage() {\n  // Render the heading immediately, stream SlowStats separately\n}`,
    testCases: [
      {
        input: 'suspense import',
        expectedOutput: "import { Suspense } from 'react';",
        description: 'Should import Suspense from react',
      },
      {
        input: 'suspense boundary',
        expectedOutput: '<Suspense fallback={<p>Loading stats...</p>}>\n        <SlowStats />\n      </Suspense>',
        description: 'Should wrap SlowStats in a Suspense boundary with a fallback',
      },
    ],
    solution: `// app/dashboard/page.tsx\nimport { Suspense } from 'react';\nimport SlowStats from './SlowStats';\n\nexport default function DashboardPage() {\n  return (\n    <div>\n      <h1>Dashboard</h1>\n      <Suspense fallback={<p>Loading stats...</p>}>\n        <SlowStats />\n      </Suspense>\n    </div>\n  );\n}`,
    explanation: 'Wrapping a slow async Server Component in <Suspense> lets Next.js stream the rest of the page immediately and send the fallback UI first, then swap in SlowStats once its data arrives - without blocking on it. This is the same mechanism loading.tsx uses automatically for a whole route, applied here to just one section of a page.',
    hints: ['Suspense comes from the react package, not next/server', 'everything outside the Suspense boundary renders without waiting for SlowStats', 'fallback is shown until the wrapped component resolves'],
    tieredHints: {
      apiSignature: 'function DashboardPage()',
      skeleton: `export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <____ fallback={<p>Loading stats...</p>}>
        <SlowStats />
      </____>
    </div>
  );
}`,
    },
    tags: ['suspense', 'streaming', 'granular-loading'],
    concepts: ['next-streaming-suspense'],
  },

  {
    id: 'next-tags-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.NEXT_DATA_FETCHING,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Fill in the fetch option key used to tag a cached request, and the function (imported from next/cache) that invalidates a specific tag on demand.',
    template: 'const res = await fetch(url, { next: { ___: ["posts"] } });\n\n// later, in a Server Action, invalidate just that tag\nimport { ___ } from "next/cache";\n___("posts");',
    blanks: ['tags', 'revalidateTag', 'revalidateTag'],
    solution: 'const res = await fetch(url, { next: { tags: ["posts"] } });\n\n// later, in a Server Action, invalidate just that tag\nimport { revalidateTag } from "next/cache";\nrevalidateTag("posts");',
    explanation: 'next.tags attaches one or more labels to a cached fetch. revalidateTag("posts") then invalidates every cached fetch sharing that tag, wherever it was called from - a more surgical alternative to revalidatePath when the same data is fetched in multiple routes.',
    hints: ['the fetch option key is plural, matching the array of labels', 'the invalidation function name mirrors what it does to a tag'],
    tags: ['revalidateTag', 'fetch-tags', 'on-demand-revalidation'],
    concepts: ['next-data-fetching'],
  },

  {
    id: 'next-sc-serializable-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_SERVER_COMPONENTS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'A Server Component is passing props to a Client Component. Fill in the prop that will fail to cross the boundary, and the JSX attribute name it is assigned to.',
    template: '// app/page.tsx (Server Component)\n<ProductCard\n  product={product}\n  ___={() => console.log("favorited")}   // fails: not ___\n/>',
    blanks: ['onFavorite', 'serializable'],
    solution: '// app/page.tsx (Server Component)\n<ProductCard\n  product={product}\n  onFavorite={() => console.log("favorited")}   // fails: not serializable\n/>',
    explanation: 'Props crossing from a Server Component to a Client Component are serialized and sent over the network as part of the render payload. Plain data (strings, numbers, booleans, plain objects/arrays) survives that trip; functions, classes, and other non-serializable values do not, so passing an inline function as a prop throws.',
    hints: ['the prop name matches the callback in the object literal', 'the missing word describes what data must be to cross the boundary'],
    tags: ['serializable-props', 'server-client-boundary'],
    concepts: ['next-server-vs-client'],
  },
  {
    id: 'next-sc-serializable-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_SERVER_COMPONENTS,
    course: Course.WEB_DEV,
    question: `A Server Component renders a Client Component and passes a prop:\n\n\`\`\`tsx\n// app/page.tsx (Server Component)\nimport ProductCard from "@/components/ProductCard";\n\nexport default async function Page() {\n  const product = await getProduct();\n  return (\n    <ProductCard product={product} onFavorite={() => console.log("favorited")} />\n  );\n}\n\`\`\`\n\n\`ProductCard\` is a Client Component. What happens when this renders?`,
    options: [
      { id: 'a', text: 'It works fine — Next.js serializes the arrow function into a string and re-parses it into a real function once it reaches the browser', isCorrect: false },
      { id: 'b', text: 'It works, but onFavorite silently runs on the server instead of the client, so the console.log never appears in the browser devtools', isCorrect: false },
      { id: 'c', text: 'It works only in development — the production build strips the prop and ProductCard receives onFavorite as undefined', isCorrect: false },
      { id: 'd', text: 'Error — props sent from a Server Component to a Client Component must be serializable, and a plain function is not, so onFavorite fails to cross the boundary', isCorrect: true },
    ],
    explanation: 'Server-to-Client props travel over the RSC payload, which can only encode serializable values: strings, numbers, booleans, plain objects and arrays, and a few special cases like Server Actions (which ARE allowed because Next.js wires them up as callable references). A bare arrow function is not one of those special cases, so React throws rather than silently dropping or relocating it.',
    hints: ['think about what actually gets sent over the network for an RSC payload', 'Server Actions are the one function-like exception - this is not one'],
    tags: ['serializable-props', 'server-client-boundary', 'rsc-payload'],
    concepts: ['next-server-vs-client'],
  },
  {
    id: 'next-sc-serveronly-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_SERVER_COMPONENTS,
    course: Course.WEB_DEV,
    question: `A file exports a function that reads an API secret key from an environment variable:\n\n\`\`\`ts\n// lib/payments.ts\nexport function chargeCard(cardToken: string) {\n  const key = process.env.STRIPE_SECRET_KEY;\n  // ... calls the payments API using key\n}\n\`\`\`\n\nA teammate accidentally imports \`chargeCard\` from a Client Component file. Nothing in the code currently stops this. What does adding \`import "server-only";\` to the top of lib/payments.ts do?`,
    options: [
      { id: 'a', text: 'It encrypts STRIPE_SECRET_KEY so that even if the module reaches the browser bundle, the key itself cannot be read', isCorrect: false },
      { id: 'b', text: 'It causes a build-time error the moment any Client Component (directly or transitively) imports that module, catching the mistake before it ships', isCorrect: true },
      { id: 'c', text: 'It automatically moves the chargeCard call to a generated API route so client code can still call it safely over the network', isCorrect: false },
      { id: 'd', text: 'It has no effect on its own — it only works when combined with the "use server" directive on the same file', isCorrect: false },
      ],
    explanation: 'The server-only package exports an empty module that throws when bundled for the client. Importing it at the top of a server-side utility file (like one that touches secrets or a database) means any accidental import from client code fails the build with a clear error, instead of silently leaking the secret into the browser bundle. It is a guard rail, not encryption or a code transform - "use server" is a separate, unrelated directive for Server Actions.',
    hints: ['it is a marker package, not a runtime transform', 'think about when the error surfaces - build time vs runtime'],
    tags: ['server-only', 'secrets', 'build-error'],
    concepts: ['next-server-vs-client'],
  },
  {
    id: 'next-sc-modulegraph-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.NEXT_SERVER_COMPONENTS,
    course: Course.WEB_DEV,
    question: `\`\`\`tsx\n// components/Icon.tsx\nexport function Icon({ name }: { name: string }) {\n  return <span className={\`icon-\${name}\`} />;\n}\n\n// components/Toggle.tsx\n"use client";\nimport { useState } from "react";\nimport { Icon } from "./Icon";\n\nexport default function Toggle() {\n  const [on, setOn] = useState(false);\n  return (\n    <button onClick={() => setOn(!on)}>\n      <Icon name={on ? "check" : "x"} />\n    </button>\n  );\n}\n\`\`\`\n\nIcon.tsx itself has no "use client" directive. Does it still end up in the client JavaScript bundle?`,
    options: [
      { id: 'a', text: 'No - only files that literally contain "use client" are ever sent to the browser, so Icon stays server-only and Toggle fails to render it', isCorrect: false },
      { id: 'b', text: 'Yes - "use client" marks a boundary in the module graph, not a single file, so every module Toggle.tsx imports (Icon included) is pulled into the client bundle too', isCorrect: true },
      { id: 'c', text: 'It depends on whether Icon.tsx is called during the initial render or a later re-render - initial renders stay server-only, re-renders pull it client-side', isCorrect: false },
      { id: 'd', text: 'No - Next.js automatically hoists Icon.tsx into a shared Server Component chunk that both Toggle and any Server Component can import safely', isCorrect: false },
    ],
    explanation: '"use client" does not mark one component as client-side - it marks the import boundary. Everything the "use client" file imports (and everything those imports import, transitively) also becomes part of the client bundle, whether or not those files have their own directive. This is why Icon.tsx, despite having no directive at all, still ships to the browser once Toggle.tsx imports it: the module graph rooted at a "use client" file is client-side in its entirety.',
    hints: ['"use client" is a boundary marker, not a per-file flag that some components obey and others ignore', 'trace what Toggle.tsx imports, then what those imports import'],
    tags: ['use-client', 'module-graph', 'client-bundle'],
    concepts: ['next-server-vs-client'],
  },
  {
    id: 'next-sc-context-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.NEXT_SERVER_COMPONENTS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Fill in the directive this file needs (Context.Provider uses createContext under the hood, which relies on client-side React internals), and the prop name that forwards the wrapped tree through.',
    template: '___;\n\nimport { createContext } from "react";\nexport const ThemeContext = createContext("light");\n\nexport default function ThemeProvider({ ___ }: { children: React.ReactNode }) {\n  return <ThemeContext.Provider value="dark">{children}</ThemeContext.Provider>;\n}',
    blanks: ['"use client"', 'children'],
    solution: '"use client";\n\nimport { createContext } from "react";\nexport const ThemeContext = createContext("light");\n\nexport default function ThemeProvider({ children }: { children: React.ReactNode }) {\n  return <ThemeContext.Provider value="dark">{children}</ThemeContext.Provider>;\n}',
    explanation: 'createContext and .Provider rely on client-side React state internals, so any file defining or rendering a Context.Provider needs "use client". The provider still accepts children as a prop and renders them - this is what lets a Server Component render the tree without itself becoming a Client Component: it just passes its own (server-rendered) children into the client-side wrapper.',
    hints: ['Context.Provider is a client-only API', 'the prop name is the same one every component uses to render nested content'],
    tags: ['context', 'use-client', 'children-prop', 'provider'],
    concepts: ['next-server-vs-client', 'react-context'],
  },
  {
    id: 'next-sc-context-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.NEXT_SERVER_COMPONENTS,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Your app needs a ThemeContext available to both Server and Client Components in the tree, but createContext only works in Client Components.\n\nCreate TWO files:\n\n1. File: app/providers/ThemeProvider.tsx (Client Component)\n   - Must have "use client" directive\n   - Exports a named ThemeContext created with createContext<string>("light")\n   - Exports a default ThemeProvider function component taking { children }: { children: React.ReactNode }\n   - Renders <ThemeContext.Provider value="dark">{children}</ThemeContext.Provider>\n\n2. File: app/layout.tsx (Server Component, root layout)\n   - Imports ThemeProvider from "./providers/ThemeProvider"\n   - Takes { children }: { children: React.ReactNode }\n   - Wraps children in <ThemeProvider>...</ThemeProvider> inside <body>',
    starterCode: `// app/providers/ThemeProvider.tsx\n\n// TODO: client component exporting ThemeContext + ThemeProvider\n\n\n// app/layout.tsx\nexport default function RootLayout({\n  children,\n}: {\n  children: React.ReactNode;\n}) {\n  // TODO: wrap children in ThemeProvider\n}`,
    testCases: [
      {
        input: 'client wrapper',
        expectedOutput: '"use client"',
        description: 'ThemeProvider.tsx must have "use client" directive',
      },
      {
        input: 'root layout composition',
        expectedOutput: '<ThemeProvider>{children}</ThemeProvider>',
        description: 'Root layout (a Server Component) wraps children in the client-only ThemeProvider',
      },
    ],
    solution: `// app/providers/ThemeProvider.tsx\n"use client";\n\nimport { createContext } from "react";\n\nexport const ThemeContext = createContext<string>("light");\n\nexport default function ThemeProvider({\n  children,\n}: {\n  children: React.ReactNode;\n}) {\n  return <ThemeContext.Provider value="dark">{children}</ThemeContext.Provider>;\n}\n\n// app/layout.tsx\nimport ThemeProvider from "./providers/ThemeProvider";\n\nexport default function RootLayout({\n  children,\n}: {\n  children: React.ReactNode;\n}) {\n  return (\n    <html lang="en">\n      <body>\n        <ThemeProvider>{children}</ThemeProvider>\n      </body>\n    </html>\n  );\n}`,
    explanation: 'Context providers depend on client-side React internals, so they must live in their own "use client" file. But the root layout - a Server Component - can still import and render that provider, then pass its own (server-rendered) children into it as the children prop. This is the standard pattern: isolate the client-only piece to the smallest possible file, and let everything else, including deeply nested Server Components further down the tree, stay server-rendered while still being wrapped by the context.',
    hints: ['the provider file needs its own "use client" - the layout does not', 'a Server Component can render a Client Component and hand it children, same composition pattern as Client Components receiving Server Component children'],
    tieredHints: {
      apiSignature: 'function ThemeProvider({ children }: { children: React.ReactNode })',
      skeleton: `// ThemeProvider.tsx
"use client";
export const ThemeContext = ____<string>("light");

export default function ThemeProvider({ children }) {
  return <ThemeContext.Provider value="dark">{children}</ThemeContext.Provider>;
}

// layout.tsx
export default function RootLayout({ children }) {
  return <ThemeProvider>{____}</ThemeProvider>;
}`,
    },
    tags: ['context-provider', 'client-wrapper', 'root-layout', 'composition'],
    concepts: ['next-server-vs-client', 'react-context'],
  },

  // =====================================================================
  // NEXT_API_ROUTES (10 questions)
  // =====================================================================

  // BEGINNER faded (Parsons + Cloze) — lower-load scaffold before cold coding
  {
    id: 'next-api-parsons-1',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_API_ROUTES,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Assemble an App Router route handler at app/api/users/route.ts with a GET and a POST. Order: the import first, then the full GET block, then the full POST block. Each HTTP method is its own named export.',
    correctOrder: [
      'import { NextResponse, NextRequest } from "next/server";',
      'export async function GET() {',
      '  return NextResponse.json([{ id: 1, name: "Alice" }]);',
      '}',
      'export async function POST(request: NextRequest) {',
      '  const body = await request.json();',
      '  return NextResponse.json(body, { status: 201 });',
      '}',
    ],
    distractorLines: [
      'export default function handler(req, res) {',
      '  res.status(200).json(users);',
    ],
    solution: 'import { NextResponse, NextRequest } from "next/server";\nexport async function GET() {\n  return NextResponse.json([{ id: 1, name: "Alice" }]);\n}\nexport async function POST(request: NextRequest) {\n  const body = await request.json();\n  return NextResponse.json(body, { status: 201 });\n}',
    explanation: 'Route Handlers live in route.ts and export one async function per HTTP method (GET, POST, …). NextResponse.json() sets the JSON content type; its second argument sets status and headers. The distractor lines are the old pages/api default-export handler with an Express-style (req, res) signature.',
    hints: ['each HTTP method is a named export', 'use NextResponse.json() to respond', 'request.json() returns a Promise — await it'],
    tags: ['route-handler', 'api', 'NextResponse'],
    concepts: ['next-route-handlers'],
  },
  {
    id: 'next-api-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_API_ROUTES,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Fill in the named export for handling an HTTP GET in a route handler, and the NextResponse helper that returns a JSON body.',
    template: 'import { NextResponse } from "next/server";\n\nexport async function ___() {\n  return NextResponse.___([{ id: 1, name: "Alice" }]);\n}',
    blanks: ['GET', 'json'],
    solution: 'import { NextResponse } from "next/server";\n\nexport async function GET() {\n  return NextResponse.json([{ id: 1, name: "Alice" }]);\n}',
    explanation: 'In a route.ts file the export name IS the HTTP method it handles, so an exported GET function answers GET requests. NextResponse.json() serializes the value and sets Content-Type: application/json automatically.',
    hints: ['the export name equals the HTTP verb', 'the NextResponse helper for JSON bodies'],
    tags: ['route-handler', 'GET', 'NextResponse'],
    concepts: ['next-route-handlers'],
  },
  {
    id: 'next-api-cloze-2',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_API_ROUTES,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Fill in the request method that parses the incoming JSON body, and the response option key that sets the HTTP status code to 201.',
    template: 'export async function POST(request: NextRequest) {\n  const body = await request.___();\n  return NextResponse.json(body, { ___: 201 });\n}',
    blanks: ['json', 'status'],
    solution: 'export async function POST(request: NextRequest) {\n  const body = await request.json();\n  return NextResponse.json(body, { status: 201 });\n}',
    explanation: 'request.json() reads and parses the request body (a Promise, so it is awaited). The second argument to NextResponse.json() is an init object whose status field sets the HTTP status code — 201 Created is conventional for a successful POST that creates a resource.',
    hints: ['the request method that parses a JSON body', 'the init key that sets the HTTP status code'],
    tags: ['route-handler', 'POST', 'status-code'],
    concepts: ['next-route-handlers'],
  },
  {
    id: 'next-api-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_API_ROUTES,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Create a Route Handler that returns a JSON list of users and handles POST requests to create a new user.\n\nFile: app/api/users/route.ts\n\n- GET handler: Return JSON array [{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }] with status 200\n- POST handler: Read the JSON body (expects { name: string }), return { id: 3, name: <received name> } with status 201\n\nUse NextRequest and NextResponse from "next/server".',
    starterCode: `// app/api/users/route.ts\nimport { NextRequest, NextResponse } from "next/server";\n\nexport async function GET() {\n  // Return list of users\n}\n\nexport async function POST(request: NextRequest) {\n  // Create a new user from request body\n}`,
    testCases: [
      {
        input: 'GET /api/users',
        expectedOutput: 'NextResponse.json([{ id: 1, name: "Alice" }, { id: 2, name: "Bob" }])',
        description: 'GET should return users array as JSON',
      },
      {
        input: 'POST /api/users with { name: "Charlie" }',
        expectedOutput: 'NextResponse.json({ id: 3, name: "Charlie" }, { status: 201 })',
        description: 'POST should return created user with status 201',
      },
    ],
    solution: `// app/api/users/route.ts\nimport { NextRequest, NextResponse } from "next/server";\n\nexport async function GET() {\n  const users = [\n    { id: 1, name: "Alice" },\n    { id: 2, name: "Bob" },\n  ];\n  return NextResponse.json(users);\n}\n\nexport async function POST(request: NextRequest) {\n  const body = await request.json();\n  const newUser = { id: 3, name: body.name };\n  return NextResponse.json(newUser, { status: 201 });\n}`,
    explanation: 'Route Handlers in the App Router replace the old pages/api pattern. Each HTTP method is a named export (GET, POST, PUT, DELETE, PATCH). The file must be named route.ts (not page.ts) and you cannot have both route.ts and page.ts in the same folder. NextResponse.json() is a convenience method that sets Content-Type: application/json automatically. The second argument to NextResponse.json() lets you set status codes and headers.',
    hints: ['Export named functions matching HTTP methods: GET, POST, etc.', 'Use NextResponse.json() for JSON responses', 'request.json() returns a Promise — remember to await it'],
    tieredHints: {
      apiSignature: 'async function GET() / async function POST(request: NextRequest)',
      skeleton: `export async function GET() {
  return NextResponse.____(users);
}

export async function POST(request: NextRequest) {
  const body = await request.____();
  return NextResponse.json({ id: 3, name: body.name }, { status: ____ });
}`,
    },
    tags: ['route-handler', 'api', 'GET', 'POST', 'NextResponse'],
    concepts: ['next-route-handlers'],
  },

  // Second faded rung — Server Actions is a new primitive, introduced before next-api-2 combines it with the db + revalidate flow

  {
    id: 'next-api-server-action-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_API_ROUTES,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Complete the inline Server Action: the directive that marks the function body as server-only, and the form prop that wires it up as the submit handler.',
    template: `async function addItem(formData: FormData) {\n  "use ___";\n  const title = formData.get("title") as string;\n  await db.items.create({ title });\n}\n\n<form ___={addItem}>\n  <input name="title" />\n</form>`,
    blanks: ['server', 'action'],
    solution: `async function addItem(formData: FormData) {\n  "use server";\n  const title = formData.get("title") as string;\n  await db.items.create({ title });\n}\n\n<form action={addItem}>\n  <input name="title" />\n</form>`,
    explanation: 'Placing "use server" inside a function body (rather than at the top of a file) marks just that function as a Server Action, callable from the client without a manual fetch. Passing it directly as a form\'s action prop wires the form to submit to it — Next.js handles the request/response cycle, including working without JavaScript enabled.',
    hints: [
      '"use server" goes inside the function, not just at the top of the file',
      'A Server Action is passed directly as the form\'s action prop',
    ],
    tags: ['server-action', 'use-server', 'form-action', 'cloze'],
    concepts: ['next-server-actions'],
  },

  {
    id: 'next-api-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_API_ROUTES,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Create a Server Action for a "Add Todo" form that inserts into the database and revalidates the page.\n\nFile: app/todos/page.tsx\n\nRequirements:\n- Define an inline Server Action `addTodo` using "use server" inside the function body\n- The action receives FormData, extracts "title" field, calls `await db.todos.create({ title })`\n- After creating, call revalidatePath("/todos")\n- Render a <form> with action={addTodo}, containing an <input name="title" /> and a <button type="submit">Add</button>\n- Above the form, render existing todos from `await db.todos.findMany()` as a <ul>',
    starterCode: `// app/todos/page.tsx\nimport { revalidatePath } from "next/cache";\nimport { db } from "@/lib/db";\n\nexport default async function TodosPage() {\n  // Define server action, fetch todos, render form and list\n}`,
    testCases: [
      {
        input: 'server action',
        expectedOutput: '"use server"',
        description: 'Action must have "use server" directive',
      },
      {
        input: 'form with action',
        expectedOutput: '<form action={addTodo}>',
        description: 'Form should use server action as its action prop',
      },
    ],
    solution: `// app/todos/page.tsx\nimport { revalidatePath } from "next/cache";\nimport { db } from "@/lib/db";\n\nexport default async function TodosPage() {\n  const todos = await db.todos.findMany();\n\n  async function addTodo(formData: FormData) {\n    "use server";\n    const title = formData.get("title") as string;\n    await db.todos.create({ title });\n    revalidatePath("/todos");\n  }\n\n  return (\n    <div>\n      <ul>\n        {todos.map((todo: { id: number; title: string }) => (\n          <li key={todo.id}>{todo.title}</li>\n        ))}\n      </ul>\n      <form action={addTodo}>\n        <input name="title" required />\n        <button type="submit">Add</button>\n      </form>\n    </div>\n  );\n}`,
    explanation: 'Server Actions are async functions that run on the server, triggered by form submissions or programmatic calls. The "use server" directive inside a function body marks it as a Server Action. When the form submits, the browser sends a POST request to the server, the action runs, and Next.js re-renders the page with fresh data. This is progressive enhancement — the form works even without JavaScript! The key benefit over traditional API routes: Server Actions are colocated with the UI, type-safe, and automatically handle the request/response cycle.',
    hints: ['"use server" goes inside the function body to mark it as a Server Action', 'Server Actions receive FormData as their first argument', 'revalidatePath clears the cache so the page shows updated data'],
    tieredHints: {
      apiSignature: 'async function addTodo(formData: FormData)',
      skeleton: `export default async function TodosPage() {
  async function addTodo(formData: FormData) {
    "use ____";
    const title = formData.get("title") as string;
    await db.todos.create({ title });
    ____("/todos");
  }

  return (
    <form action={____}>
      <input name="title" required />
      <button type="submit">Add</button>
    </form>
  );
}`,
    },
    tags: ['server-action', 'form', 'mutation', 'revalidation'],
    concepts: ['web-html-forms-a11y', 'js-object-mutation', 'next-data-fetching'],
  },

  {
    id: 'next-api-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_API_ROUTES,
    course: Course.WEB_DEV,
    question: 'You want to show form validation errors and a pending state for a Server Action. Which combination of React hooks is designed for this?\n\n```tsx\n"use client";\nexport default function ContactForm() {\n  // What hooks should you use?\n}\n```',
    options: [
      { id: 'a', text: 'useState to hold the errors object plus a useEffect that watches a ref for when the Server Action promise settles', isCorrect: false },
      { id: 'b', text: 'useSWR to optimistically update the UI plus a try/catch block wrapped directly around the Server Action call', isCorrect: false },
      { id: 'c', text: 'useActionState to get the action\'s result (errors/success) and useFormStatus to show a pending spinner on the submit button', isCorrect: true },
      { id: 'd', text: 'useTransition to wrap the action call for a pending flag, plus useState to separately hold whatever errors it throws', isCorrect: false },
    ],
    explanation: 'useActionState (formerly useFormState) wraps a Server Action and returns [state, formAction, isPending]. The state contains whatever your Server Action returns — validation errors, success messages, etc. useFormStatus (used in a child component of the form) provides { pending } to show loading indicators on the submit button. Together they handle the full lifecycle: submission -> pending state -> result display. Option D (useTransition) works for programmatic calls but does not capture the return value of the action the way useActionState does.',
    hints: ['Think about hooks specifically designed for form + Server Action integration', 'One hook captures the action result, another shows pending state'],
    tags: ['useActionState', 'useFormStatus', 'form-validation', 'pending-state'],
    concepts: ['next-server-actions', 'forms-zod-schema'],
  },

  {
    id: 'next-api-4',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.NEXT_API_ROUTES,
    course: Course.WEB_DEV,
    question: 'You need to build a webhook endpoint at /api/webhooks/stripe that:\n- Only accepts POST requests\n- Reads the raw request body to verify the Stripe signature\n- Returns 200 on success, 400 on invalid signature\n- Must NOT be cached\n\nWhich implementation is correct?',
    options: [
      { id: 'a', text: 'Use a Server Action with "use server" since it handles POST requests automatically', isCorrect: false },
      { id: 'b', text: 'Use middleware.ts to intercept /api/webhooks/stripe and handle the verification there', isCorrect: false },
      { id: 'c', text: 'Use a Route Handler with export async function POST(req: NextRequest) { const body = await req.json(); /* verify & respond */ }', isCorrect: false },
      { id: 'd', text: 'Use a Route Handler with export async function POST(req: NextRequest) { const body = await req.text(); /* verify & respond */ } and export const dynamic = "force-dynamic"', isCorrect: true },
    ],
    explanation: 'Route Handlers are correct for webhook endpoints because they give you full control over the request and response. req.text() reads the raw body (needed for signature verification — req.json() would parse it and change the byte representation, breaking HMAC verification). export const dynamic = "force-dynamic" ensures the route is never cached. Server Actions (B) are designed for form mutations from your own UI, not external webhooks. Middleware (C) runs before the route and cannot return final responses in the same way — it is designed for redirects, rewrites, and header modification.',
    hints: ['Stripe signature verification requires the raw body, not parsed JSON', 'Consider what force-dynamic does', 'Think about the difference between Route Handlers and Server Actions'],
    tags: ['webhook', 'route-handler', 'raw-body', 'force-dynamic'],
    concepts: ['next-route-handlers'],
  },

  {
    id: 'next-api-dynamic-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_API_ROUTES,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'This route handler lives at app/api/users/[id]/route.ts. Fill in the type of the second argument that carries the dynamic segment, and the property that holds it (Next.js 15: params is a Promise, so it must be awaited).',
    template: 'export async function GET(\n  request: NextRequest,\n  { params }: { params: Promise<{ id: string }> }\n) {\n  const { id } = await ___;\n  return NextResponse.json({ userId: id });\n}',
    blanks: ['params'],
    solution: 'export async function GET(\n  request: NextRequest,\n  { params }: { params: Promise<{ id: string }> }\n) {\n  const { id } = await params;\n  return NextResponse.json({ userId: id });\n}',
    explanation: 'A route handler for a dynamic segment (folder named [id]) receives a second argument shaped { params }. In Next.js 15, params is a Promise, so it must be awaited before destructuring the segment value - the same async-params rule that applies to page components.',
    hints: ['the segment value lives on the object you awaited', 'this mirrors the async params rule for dynamic page routes'],
    tags: ['route-handler', 'dynamic-params', 'app-api'],
    concepts: ['next-route-handlers'],
  },
  {
    id: 'next-api-dynamic-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_API_ROUTES,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Create a Route Handler for a single user by id.\n\nFile: app/api/users/[id]/route.ts\n\n- GET handler takes (request: NextRequest, { params }: { params: Promise<{ id: string }> })\n- Await params to get id\n- Return NextResponse.json({ id, name: "Alice" }) if id === "1"\n- Otherwise return NextResponse.json({ error: "Not found" }, { status: 404 })',
    starterCode: `// app/api/users/[id]/route.ts\nimport { NextRequest, NextResponse } from "next/server";\n\nexport async function GET(\n  request: NextRequest,\n  { params }: { params: Promise<{ id: string }> }\n) {\n  // Await params, look up the user, respond\n}`,
    testCases: [
      {
        input: 'GET /api/users/1',
        expectedOutput: 'NextResponse.json({ id: "1", name: "Alice" })',
        description: 'Should return the matching user when id is "1"',
      },
      {
        input: 'GET /api/users/99',
        expectedOutput: 'NextResponse.json({ error: "Not found" }, { status: 404 })',
        description: 'Should return a 404 when the id does not match',
      },
    ],
    solution: `// app/api/users/[id]/route.ts\nimport { NextRequest, NextResponse } from "next/server";\n\nexport async function GET(\n  request: NextRequest,\n  { params }: { params: Promise<{ id: string }> }\n) {\n  const { id } = await params;\n\n  if (id === "1") {\n    return NextResponse.json({ id, name: "Alice" });\n  }\n\n  return NextResponse.json({ error: "Not found" }, { status: 404 });\n}`,
    explanation: 'A folder named [id] creates a dynamic segment; the route handler receives its value through the second argument\'s params, which in Next.js 15 is a Promise you must await. This is the same pattern used everywhere dynamic segments appear - page components, generateMetadata, and route handlers all take an awaited params object.',
    hints: ['params must be awaited before you can read id off it', 'a missing/unmatched id is a 404, not a thrown error'],
    tieredHints: {
      apiSignature: 'async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> })',
      skeleton: `export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await ____;
  if (id === "1") {
    return NextResponse.json({ id, name: "Alice" });
  }
  return NextResponse.json({ error: "Not found" }, { status: ____ });
}`,
    },
    tags: ['route-handler', 'dynamic-params', 'app-api', '404'],
    concepts: ['next-route-handlers'],
  },

  {
    id: 'next-api-searchparams-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_API_ROUTES,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Fill in the NextRequest property that exposes the parsed query string, and the method used to read a single param by name.',
    template: 'export async function GET(request: NextRequest) {\n  const query = request.___.___("q");\n  return NextResponse.json({ query });\n}',
    blanks: ['nextUrl.searchParams', 'get'],
    solution: 'export async function GET(request: NextRequest) {\n  const query = request.nextUrl.searchParams.get("q");\n  return NextResponse.json({ query });\n}',
    explanation: 'request.nextUrl is Next.js\'s parsed URL object (an extension of the standard URL); its searchParams is a URLSearchParams instance, so .get("q") reads the ?q= value from a request like /api/search?q=shoes. This is the route-handler equivalent of reading a query string, distinct from the searchParams prop that page components receive.',
    hints: ['nextUrl is Next.js\'s enhanced URL object on the request', 'searchParams is a standard URLSearchParams instance'],
    tags: ['route-handler', 'searchParams', 'query-string', 'nextUrl'],
    concepts: ['next-route-handlers'],
  },

  {
    id: 'next-api-error-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_API_ROUTES,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Create a Route Handler that validates a POST body before creating a resource.\n\nFile: app/api/products/route.ts\n\n- POST handler reads the JSON body\n- If body.name is missing or empty, return NextResponse.json({ error: "name is required" }, { status: 400 })\n- Otherwise return NextResponse.json({ id: 1, name: body.name }, { status: 201 })',
    starterCode: `// app/api/products/route.ts\nimport { NextRequest, NextResponse } from "next/server";\n\nexport async function POST(request: NextRequest) {\n  // Validate body.name, return 400 or 201\n}`,
    testCases: [
      {
        input: 'POST with { name: "Chair" }',
        expectedOutput: 'NextResponse.json({ id: 1, name: "Chair" }, { status: 201 })',
        description: 'Valid body should create the resource with status 201',
      },
      {
        input: 'POST with { name: "" }',
        expectedOutput: 'NextResponse.json({ error: "name is required" }, { status: 400 })',
        description: 'Missing/empty name should return a 400 with an error message',
      },
    ],
    solution: `// app/api/products/route.ts\nimport { NextRequest, NextResponse } from "next/server";\n\nexport async function POST(request: NextRequest) {\n  const body = await request.json();\n\n  if (!body.name) {\n    return NextResponse.json({ error: "name is required" }, { status: 400 });\n  }\n\n  return NextResponse.json({ id: 1, name: body.name }, { status: 201 });\n}`,
    explanation: 'Route Handlers are responsible for their own validation and status codes - nothing does this automatically. NextResponse.json(body, { status }) is the same helper for both success and error paths; only the status and payload shape differ. Returning a structured { error } body alongside 400 lets the client distinguish "bad request" from a network failure.',
    hints: ['both branches use the same NextResponse.json helper, just different status codes', 'check for a missing/empty name before doing anything else'],
    tieredHints: {
      apiSignature: 'async function POST(request: NextRequest)',
      skeleton: `export async function POST(request: NextRequest) {
  const body = await request.json();
  if (!body.name) {
    return NextResponse.json({ error: "name is required" }, { status: ____ });
  }
  return NextResponse.json({ id: 1, name: body.name }, { status: ____ });
}`,
    },
    tags: ['route-handler', 'validation', 'error-response', 'status-code'],
    concepts: ['next-route-handlers'],
  },

  {
    id: 'next-api-formstatus-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_API_ROUTES,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Fill in the hook (from react-dom) that reports a parent form\'s submission state, and the field it returns that is true while the Server Action is running.',
    template: '"use client";\nimport { ___ } from "react-dom";\n\nfunction SubmitButton() {\n  const { ___ } = useFormStatus();\n  return <button disabled={pending}>{pending ? "Saving..." : "Save"}</button>;\n}',
    blanks: ['useFormStatus', 'pending'],
    solution: '"use client";\nimport { useFormStatus } from "react-dom";\n\nfunction SubmitButton() {\n  const { pending } = useFormStatus();\n  return <button disabled={pending}>{pending ? "Saving..." : "Save"}</button>;\n}',
    explanation: 'useFormStatus reads the status of the nearest parent <form>, so it must be called from a component rendered INSIDE that form (commonly the submit button itself), not the component that renders the form. Its pending field is true from submission until the Server Action resolves, which is exactly what a disabled/loading submit button needs.',
    hints: ['useFormStatus comes from react-dom, not react', 'it only works inside a component nested under the <form>, not the form\'s own component'],
    tags: ['useFormStatus', 'pending-state', 'server-action', 'form'],
    concepts: ['next-server-actions'],
  },

  {
    id: 'next-api-redirect-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_API_ROUTES,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Fill in the import source for redirect, and the call that sends the user to /todos after the Server Action creates a record.',
    template: 'import { ___ } from "next/navigation";\n\nasync function addTodo(formData: FormData) {\n  "use server";\n  await db.todos.create({ title: formData.get("title") as string });\n  ___;\n}',
    blanks: ['redirect', 'redirect("/todos")'],
    solution: 'import { redirect } from "next/navigation";\n\nasync function addTodo(formData: FormData) {\n  "use server";\n  await db.todos.create({ title: formData.get("title") as string });\n  redirect("/todos");\n}',
    explanation: 'redirect() from next/navigation works inside Server Actions and Server Components; calling it throws a special error internally that Next.js catches to perform the navigation, so any code after it in the same function never runs. It is the standard way to leave a page after a successful mutation, as an alternative to (or alongside) revalidatePath when the action should also change the URL.',
    hints: ['redirect comes from next/navigation, not next/server', 'code after a redirect() call in the same function will not execute'],
    tags: ['redirect', 'server-action', 'navigation', 'post-mutation'],
    concepts: ['next-server-actions'],
  },

  // =====================================================================
  // NEXT_MIDDLEWARE (6 questions)
  // =====================================================================

  // BEGINNER faded (Parsons + Cloze) — lower-load scaffold before cold coding
  {
    id: 'next-mw-parsons-1',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_MIDDLEWARE,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Assemble middleware.ts that redirects to /login when an "auth-token" cookie is missing. Order: import first, then the function signature, then read the cookie, then the redirect guard, then allow the request through, then the closing brace, then the matcher config.',
    correctOrder: [
      'import { NextResponse, NextRequest } from "next/server";',
      'export function middleware(request: NextRequest) {',
      '  const token = request.cookies.get("auth-token");',
      '  if (!token) return NextResponse.redirect(new URL("/login", request.url));',
      '  return NextResponse.next();',
      '}',
      'export const config = { matcher: ["/dashboard/:path*"] };',
    ],
    distractorLines: [
      '  if (!token) return NextResponse.redirect("/login");',
      '  if (!token) res.redirect("/login");',
    ],
    solution: 'import { NextResponse, NextRequest } from "next/server";\nexport function middleware(request: NextRequest) {\n  const token = request.cookies.get("auth-token");\n  if (!token) return NextResponse.redirect(new URL("/login", request.url));\n  return NextResponse.next();\n}\nexport const config = { matcher: ["/dashboard/:path*"] };',
    explanation: 'Middleware runs at the edge before a route renders. Read cookies via request.cookies.get(), return NextResponse.redirect() (with an ABSOLUTE URL built from request.url) to bounce unauthenticated users, or NextResponse.next() to continue. The config.matcher limits which paths it runs on. The distractors use a relative redirect string and an Express-style res.redirect.',
    hints: ['NextResponse.redirect needs an absolute URL — new URL(path, request.url)', 'NextResponse.next() lets the request continue', 'config.matcher scopes the middleware'],
    tags: ['middleware', 'auth', 'cookies', 'matcher'],
    concepts: ['next-middleware'],
  },
  {
    id: 'next-mw-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_MIDDLEWARE,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Fill in the cookies method that reads a single cookie by name, and the NextResponse method that sends the user to another URL.',
    template: 'export function middleware(request: NextRequest) {\n  const token = request.cookies.___("auth-token");\n  if (!token) {\n    return NextResponse.___(new URL("/login", request.url));\n  }\n  return NextResponse.next();\n}',
    blanks: ['get', 'redirect'],
    solution: 'export function middleware(request: NextRequest) {\n  const token = request.cookies.get("auth-token");\n  if (!token) {\n    return NextResponse.redirect(new URL("/login", request.url));\n  }\n  return NextResponse.next();\n}',
    explanation: 'request.cookies.get(name) returns the cookie (or undefined if absent). NextResponse.redirect() issues an HTTP redirect; it requires an absolute URL, which is why the path is wrapped in new URL(path, request.url).',
    hints: ['the cookies accessor that fetches one by name', 'the NextResponse method that bounces to another URL'],
    tags: ['middleware', 'cookies', 'redirect'],
    concepts: ['next-middleware'],
  },
  {
    id: 'next-mw-cloze-2',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_MIDDLEWARE,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Fill in the config key that restricts which paths middleware runs on, and the NextResponse method that lets a request continue unchanged.',
    template: 'export const config = {\n  ___: ["/dashboard/:path*"],\n};\n\n// inside middleware, when the request is allowed:\nreturn NextResponse.___();',
    blanks: ['matcher', 'next'],
    solution: 'export const config = {\n  matcher: ["/dashboard/:path*"],\n};\n\n// inside middleware, when the request is allowed:\nreturn NextResponse.next();',
    explanation: 'config.matcher scopes middleware to specific paths so it does not run on every request (including static assets). NextResponse.next() passes the request through to the normal route without modification.',
    hints: ['the config key that scopes the paths', 'the NextResponse method meaning "carry on"'],
    tags: ['middleware', 'matcher', 'next'],
    concepts: ['next-middleware'],
  },
  {
    id: 'next-mw-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_MIDDLEWARE,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Create a middleware that protects all /dashboard routes by checking for an "auth-token" cookie. If the cookie is missing, redirect to /login.\n\nFile: middleware.ts (project root, NOT inside app/)\n\nRequirements:\n- Import NextResponse and NextRequest from "next/server"\n- Export a function `middleware` that checks for the "auth-token" cookie\n- If missing, redirect to /login using NextResponse.redirect()\n- If present, call NextResponse.next() to continue\n- Export a `config` with matcher: ["/dashboard/:path*"]',
    starterCode: `// middleware.ts\nimport { NextResponse, NextRequest } from "next/server";\n\nexport function middleware(request: NextRequest) {\n  // Check auth-token cookie and redirect if missing\n}\n\nexport const config = {\n  // Configure matcher\n};`,
    testCases: [
      {
        input: 'cookie check',
        expectedOutput: 'request.cookies.get("auth-token")',
        description: 'Should check for auth-token cookie',
      },
      {
        input: 'redirect',
        expectedOutput: 'NextResponse.redirect(new URL("/login", request.url))',
        description: 'Should redirect to /login when cookie missing',
      },
      {
        input: 'matcher config',
        expectedOutput: 'matcher: ["/dashboard/:path*"]',
        description: 'Should only run on /dashboard routes',
      },
    ],
    solution: `// middleware.ts\nimport { NextResponse, NextRequest } from "next/server";\n\nexport function middleware(request: NextRequest) {\n  const token = request.cookies.get("auth-token");\n\n  if (!token) {\n    return NextResponse.redirect(new URL("/login", request.url));\n  }\n\n  return NextResponse.next();\n}\n\nexport const config = {\n  matcher: ["/dashboard/:path*"],\n};`,
    explanation: 'Middleware runs BEFORE the request reaches your route — it sits at the edge, executing before any page or API route renders. The matcher config is critical for performance: without it, middleware runs on EVERY request including static assets (_next/static, images, etc.). The :path* syntax is a pattern that matches any sub-path, so /dashboard, /dashboard/settings, and /dashboard/users/123 are all covered. new URL("/login", request.url) creates an absolute URL based on the current host, which is required by NextResponse.redirect().',
    hints: ['middleware.ts must be at the project root (next to package.json), not inside app/', 'request.cookies.get() returns undefined if the cookie does not exist', 'NextResponse.redirect() requires an absolute URL'],
    tieredHints: {
      apiSignature: 'function middleware(request: NextRequest)',
      skeleton: `export function middleware(request: NextRequest) {
  const token = request.cookies.____("auth-token");
  if (!token) {
    return NextResponse.____(new URL("/login", request.url));
  }
  return NextResponse.____();
}

export const config = {
  ____: ["/dashboard/:path*"],
};`,
    },
    tags: ['middleware', 'auth', 'cookies', 'redirect', 'matcher'],
    concepts: ['next-middleware', 'web-security-auth-tokens', 'web-security-csrf'],
  },

  {
    id: 'next-mw-setcookie-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_MIDDLEWARE,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Fill in the response property that sets a cookie, and the response property that sets a custom header.',
    template: 'export function middleware(request: NextRequest) {\n  const response = NextResponse.next();\n  response.___.set("theme", "dark");\n  response.___.set("x-custom-header", "hello");\n  return response;\n}',
    blanks: ['cookies', 'headers'],
    solution: 'export function middleware(request: NextRequest) {\n  const response = NextResponse.next();\n  response.cookies.set("theme", "dark");\n  response.headers.set("x-custom-header", "hello");\n  return response;\n}',
    explanation: 'A NextResponse (whether from next(), redirect(), or rewrite()) exposes response.cookies.set() and response.headers.set() to mutate what gets sent back to the browser, in addition to letting the request continue.',
    hints: ['the property for setting a cookie on the outgoing response', 'the property for setting an HTTP header on the outgoing response'],
    tags: ['middleware', 'cookies', 'headers', 'NextResponse'],
    concepts: ['next-middleware'],
  },
  {
    id: 'next-mw-setcookie-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_MIDDLEWARE,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Create a middleware that gives every visitor a default theme preference if they have not set one, and marks the response so downstream code can tell a default was applied.\n\nFile: middleware.ts\n\nRequirements:\n- Start from a NextResponse that lets the request continue\n- If the incoming request has no "theme" cookie, set a "theme" cookie on the response with value "light", and set an "x-theme-source" header on the response with value "default"\n- Return the response either way',
    starterCode: `// middleware.ts\nimport { NextResponse, NextRequest } from "next/server";\n\nexport function middleware(request: NextRequest) {\n  const response = NextResponse.next();\n  // Set a default theme cookie + header when the visitor has none\n  return response;\n}`,
    testCases: [
      {
        input: 'default cookie',
        expectedOutput: 'response.cookies.set("theme", "light")',
        description: 'Should default the theme cookie to "light" when absent',
      },
      {
        input: 'default header',
        expectedOutput: 'response.headers.set("x-theme-source", "default")',
        description: 'Should tag the response with x-theme-source when defaulting',
      },
    ],
    solution: `// middleware.ts\nimport { NextResponse, NextRequest } from "next/server";\n\nexport function middleware(request: NextRequest) {\n  const response = NextResponse.next();\n\n  if (!request.cookies.get("theme")) {\n    response.cookies.set("theme", "light");\n    response.headers.set("x-theme-source", "default");\n  }\n\n  return response;\n}`,
    explanation: 'Middleware can mutate the outgoing response as well as redirect/rewrite requests. Reading request.cookies.get() checks what the visitor already sent; writing to response.cookies.set() and response.headers.set() attaches new state to the response Next.js actually sends back, before the route even renders.',
    hints: ['read from request.cookies, write to response.cookies', 'both mutations only happen in the missing-cookie branch'],
    tieredHints: {
      apiSignature: 'function middleware(request: NextRequest)',
      skeleton: `export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  if (!request.cookies.get("theme")) {
    response.cookies.____("theme", "light");
    response.headers.____("x-theme-source", "default");
  }
  return response;
}`,
    },
    tags: ['middleware', 'cookies', 'headers', 'NextResponse'],
    concepts: ['next-middleware'],
  },

  {
    id: 'next-mw-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_MIDDLEWARE,
    course: Course.WEB_DEV,
    question: 'You want to implement A/B testing where 50% of users see /pricing and 50% see a redesigned /pricing-v2, but the URL should remain /pricing for both groups. The variant assignment should persist across visits using a cookie.\n\nWhich middleware approach is correct?',
    options: [
      { id: 'a', text: 'Check an "ab-variant" cookie — if missing, randomly assign one and set it — then NextResponse.rewrite() to /pricing-v2 while the URL stays /pricing', isCorrect: true },
      { id: 'b', text: 'Use NextResponse.redirect() to send half of users to /pricing-v2 based on a random check, since redirects are the standard way to route traffic', isCorrect: false },
      { id: 'c', text: 'Use NextResponse.next() with a custom header set in middleware, then read that header inside the page component to conditionally render', isCorrect: false },
      { id: 'd', text: 'Set the variant cookie in middleware, but leave all the actual variant rendering logic inside the /pricing page component itself', isCorrect: false },
    ],
    explanation: 'NextResponse.rewrite() is the key API here — it changes which route handles the request WITHOUT changing the URL the user sees. Redirects (A) would change the URL to /pricing-v2, ruining the test. The middleware flow: check cookie -> if missing, assign variant with Math.random() and set cookie -> rewrite to the correct page. This runs at the edge with zero latency impact. Option C would work but is fragile and does not cleanly separate the two page versions. Option D puts routing logic in the page, which defeats the purpose of middleware.',
    hints: ['Think about the difference between redirect (URL changes) and rewrite (URL stays)', 'Cookies persist the variant assignment across visits'],
    tags: ['rewrite', 'redirect', 'ab-testing', 'cookies'],
    concepts: ['web-security-csrf'],
  },

  {
    id: 'next-mw-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.NEXT_MIDDLEWARE,
    course: Course.WEB_DEV,
    question: 'Which of the following is a limitation of Next.js Middleware that affects architectural decisions?\n\nConsider what middleware CAN and CANNOT do:',
    options: [
      { id: 'a', text: 'Middleware cannot read request headers or cookies', isCorrect: false },
      { id: 'b', text: 'Middleware uses the Edge Runtime, which does not support Node.js APIs like fs, native modules, or most npm packages that depend on Node.js internals — you cannot query a database directly in middleware', isCorrect: true },
      { id: 'c', text: 'Middleware runs on the Node.js runtime and has access to all Node.js APIs', isCorrect: false },
      { id: 'd', text: 'Middleware can only run on Vercel, not on self-hosted deployments', isCorrect: false },
    ],
    explanation: 'Middleware runs on the Edge Runtime, a lightweight JavaScript environment based on Web APIs (similar to Cloudflare Workers). This means: no fs, no native Node.js modules, no heavy npm packages, no direct database connections. This is by design — middleware must be fast and run at the edge closest to the user. For auth checks in middleware, you typically verify a JWT token (pure JavaScript) rather than querying a database. If you need database access for auth, do it in a Server Component or Route Handler instead. Self-hosted Next.js does support middleware — it is not Vercel-only.',
    hints: ['Middleware is designed to be fast and lightweight', 'Think about what runtime environment middleware uses'],
    tags: ['edge-runtime', 'limitations', 'architecture', 'node-apis'],
    concepts: ['pattern-architectural'],
  },

  {
    id: 'next-mw-precache-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.NEXT_MIDDLEWARE,
    course: Course.WEB_DEV,
    question: 'A route is statically generated with `export const revalidate = 60` (ISR), so most requests should be served from cache. The app also has middleware matching that route. Does the middleware run on every request to that route, or only when the cache misses?',
    options: [
      { id: 'a', text: 'Middleware executes on every matching request before Next.js resolves routing or decides whether to serve a cached response — even a fully static, ISR-cached page still runs middleware first, which is why middleware can rewrite or gate access to static routes too', isCorrect: true },
      { id: 'b', text: 'Middleware only runs for requests that end up dynamically rendered; once a route is statically cached there is no rendering work left to intercept, so middleware is skipped for cache hits', isCorrect: false },
      { id: 'c', text: 'Middleware runs after the route\'s cache is checked — if a cached response already exists, Next.js serves it directly from the CDN and middleware never executes for that request', isCorrect: false },
      { id: 'd', text: 'Middleware and route rendering happen in parallel, and whichever finishes first determines the response, so there is no defined ordering between caching and middleware', isCorrect: false },
    ],
    explanation: 'Middleware sits at the very front of the request pipeline, ahead of the routing and caching layer, so it runs on every request whose path matches the config, regardless of whether that route is static, ISR-cached, or dynamic. This is exactly what makes middleware useful for auth gates and A/B rewrites on otherwise-static marketing pages: the cached HTML is only served (or not) after middleware has had a chance to redirect or rewrite the request.',
    hints: ['middleware sits in front of the routing/caching layer, not behind it', 'this is why middleware can gate access to a fully static page'],
    tags: ['edge-runtime', 'caching', 'mental-model', 'isr'],
    concepts: ['pattern-architectural'],
  },

  // =====================================================================
  // NEXT_OPTIMIZATION (9 questions)
  // =====================================================================

  // BEGINNER faded (Parsons + Cloze) — lower-load scaffold before cold coding
  {
    id: 'next-opt-parsons-1',
    type: QuestionType.PARSONS,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_OPTIMIZATION,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Assemble a hero image component using the optimized next/image component. Order: the import first, then the function signature, then the return with the Image, then the closing brace.',
    correctOrder: [
      'import Image from "next/image";',
      'export default function Hero() {',
      '  return <Image src="/hero.jpg" alt="Mountain at sunset" width={1200} height={600} priority />;',
      '}',
    ],
    distractorLines: [
      'import Image from "next/legacy/image";',
      '  return <img src="/hero.jpg" alt="Mountain at sunset" />;',
    ],
    solution: 'import Image from "next/image";\nexport default function Hero() {\n  return <Image src="/hero.jpg" alt="Mountain at sunset" width={1200} height={600} priority />;\n}',
    explanation: 'next/image auto-optimizes (WebP/AVIF, resizing, lazy-loading) and reserves space via width/height to prevent layout shift. priority disables lazy-loading for the above-the-fold LCP image. The distractors use the wrong import path and a raw <img> that loses all optimization.',
    hints: ['import Image from the framework image module', 'width/height reserve space to prevent layout shift', 'priority is for the above-the-fold image'],
    tags: ['next/image', 'optimization', 'priority'],
    concepts: ['web-css-responsive'],
  },
  {
    id: 'next-opt-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_OPTIMIZATION,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Fill in the import path for the optimized image component, and the required prop that supplies alt text for accessibility.',
    template: 'import Image from "___";\n\nexport default function Hero() {\n  return <Image src="/hero.jpg" ___="Mountain at sunset" width={1200} height={600} priority />;\n}',
    blanks: ['next/image', 'alt'],
    solution: 'import Image from "next/image";\n\nexport default function Hero() {\n  return <Image src="/hero.jpg" alt="Mountain at sunset" width={1200} height={600} priority />;\n}',
    explanation: 'next/image is the optimized image component. Like a plain <img>, it requires an alt prop describing the image — next/image actually enforces it, failing the build if it is missing.',
    hints: ['the framework image module path', 'the accessibility prop a plain <img> also uses'],
    tags: ['next/image', 'alt', 'accessibility'],
    concepts: ['web-css-responsive'],
  },
  {
    id: 'next-opt-cloze-2',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_OPTIMIZATION,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Fill in the exported async function name that produces data-dependent page metadata, and the metadata field that maps to the <meta name="description"> tag.',
    template: 'export async function ___({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {\n  const { slug } = await params;\n  const post = await getPost(slug);\n  return { title: post.title, ___: post.excerpt };\n}',
    blanks: ['generateMetadata', 'description'],
    solution: 'export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {\n  const { slug } = await params;\n  const post = await getPost(slug);\n  return { title: post.title, description: post.excerpt };\n}',
    explanation: 'generateMetadata is the async counterpart to the static metadata export — use it when the tags depend on fetched data. It runs on the server before render; the returned object\'s description field becomes the page <meta name="description">. Next.js dedupes any fetch shared with the page component.',
    hints: ['the async function that returns Promise<Metadata>', 'the field that becomes the page description meta tag'],
    tags: ['generateMetadata', 'seo', 'metadata'],
    concepts: ['next-data-fetching', 'web-html-semantics'],
  },
  {
    id: 'next-opt-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_OPTIMIZATION,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Create a responsive hero image component using next/image.\n\nFile: app/components/HeroImage.tsx\n\nRequirements:\n- Import Image from "next/image"\n- Render an Image with src="/hero.jpg", alt="Mountain landscape at sunset"\n- width={1200}, height={600}\n- priority={true} (this is above the fold)\n- className="hero-image"\n- sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 1200px"\n\nExport as default function HeroImage.',
    starterCode: `// app/components/HeroImage.tsx\nimport Image from "next/image";\n\nexport default function HeroImage() {\n  // Render the optimized hero image\n}`,
    testCases: [
      {
        input: 'image component',
        expectedOutput: '<Image src="/hero.jpg" alt="Mountain landscape at sunset" width={1200} height={600} priority />',
        description: 'Should render Image with correct src, alt, dimensions, and priority',
      },
      {
        input: 'responsive sizes',
        expectedOutput: 'sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 1200px"',
        description: 'Should have responsive sizes attribute',
      },
    ],
    solution: `// app/components/HeroImage.tsx\nimport Image from "next/image";\n\nexport default function HeroImage() {\n  return (\n    <Image\n      src="/hero.jpg"\n      alt="Mountain landscape at sunset"\n      width={1200}\n      height={600}\n      priority\n      className="hero-image"\n      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 1200px"\n    />\n  );\n}`,
    explanation: 'next/image automatically optimizes images: converts to WebP/AVIF, resizes for the device, lazy-loads by default, and prevents layout shift by reserving space. The `priority` prop disables lazy loading and adds a preload hint — use it ONLY for the Largest Contentful Paint (LCP) image (usually the hero image). The `sizes` prop tells the browser which image width to download at each viewport width, preventing mobile devices from downloading the full 1200px image. Without sizes, the browser assumes the image is 100vw at all sizes, which wastes bandwidth on smaller screens.',
    hints: ['priority should only be used for above-the-fold images', 'sizes controls which srcset image the browser downloads', 'width/height prevent layout shift, not set the display size'],
    tieredHints: {
      apiSignature: 'function HeroImage()',
      skeleton: `export default function HeroImage() {
  return (
    <Image
      src="/hero.jpg"
      alt="Mountain landscape at sunset"
      width={1200}
      height={600}
      ____
      className="hero-image"
      sizes="____"
    />
  );
}`,
    },
    tags: ['next/image', 'optimization', 'responsive', 'priority', 'sizes'],
    concepts: ['web-css-responsive'],
  },

  {
    id: 'next-opt-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_OPTIMIZATION,
    course: Course.WEB_DEV,
    question: 'A developer notices their navigation feels slow because every link triggers a full page load. They are using standard <a> tags:\n\n```tsx\n<nav>\n  <a href="/about">About</a>\n  <a href="/blog">Blog</a>\n  <a href="/contact">Contact</a>\n</nav>\n```\n\nWhat does switching to next/link fix, and what bonus behavior do you get?',
    options: [
      { id: 'a', text: 'next/link swaps the <a> tag for a <button> under the hood and uses the History API alone — no prefetching happens unless you add a loading.tsx file', isCorrect: false },
      { id: 'b', text: 'next/link only prevents full page reloads — prefetching must be configured separately with a <Prefetch> component', isCorrect: false },
      { id: 'c', text: 'next/link does client-side navigation with no full reload, prefetches linked routes when they enter the viewport, and preserves Client Component state across navigations', isCorrect: true },
      { id: 'd', text: 'next/link just adds rel="preload" to the underlying <a> tag and leaves prefetching entirely to the browser\'s native behavior', isCorrect: false },
    ],
    explanation: 'next/link does three critical things: (1) Client-side navigation using the React router — only the changed segments re-render, not the full page, so layouts and shared state persist. (2) Automatic prefetching — when a <Link> enters the viewport, Next.js prefetches the route in the background so navigation is near-instant. For static routes, the full page is prefetched; for dynamic routes, only the shared layout up to the first loading.tsx boundary. (3) Soft navigation — only the route segments that change are updated, preserving scroll position, focus state, and Client Component state (like form inputs in a layout).',
    hints: ['Think about what client-side navigation preserves vs a full page reload', 'Consider what "prefetch" means in the context of the App Router'],
    tags: ['next/link', 'prefetching', 'client-side-navigation', 'performance'],
    concepts: ['next-app-router'],
  },

  {
    id: 'next-opt-3',
    type: QuestionType.CODING,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_OPTIMIZATION,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Create dynamic metadata for a blog post page using the generateMetadata function.\n\nFile: app/blog/[slug]/page.tsx\n\nRequirements:\n- Export an async function `generateMetadata` that receives { params: Promise<{ slug: string }> }\n- Await params, then fetch the post from `getPost(slug)` (imported from "@/lib/db") which returns { title: string; excerpt: string; image: string }\n- Return a Metadata object with: title, description (from excerpt), and openGraph containing title, description, and images array with one entry [{ url: post.image }]\n\nAlso export the default page component (can be a simple placeholder).',
    starterCode: `// app/blog/[slug]/page.tsx\nimport { Metadata } from "next";\nimport { getPost } from "@/lib/db";\n\nexport async function generateMetadata({\n  params,\n}: {\n  params: Promise<{ slug: string }>;\n}): Promise<Metadata> {\n  // Fetch post and return metadata\n}\n\nexport default async function BlogPost() {\n  // Placeholder page body\n  return <article>Blog post</article>;\n}`,
    testCases: [
      {
        input: 'metadata with title',
        expectedOutput: 'title: post.title',
        description: 'Should set title from post data',
      },
      {
        input: 'openGraph metadata',
        expectedOutput: 'openGraph: { title: post.title, description: post.excerpt, images: [{ url: post.image }] }',
        description: 'Should include OpenGraph data for social sharing',
      },
    ],
    solution: `// app/blog/[slug]/page.tsx\nimport { Metadata } from "next";\nimport { getPost } from "@/lib/db";\n\nexport async function generateMetadata({\n  params,\n}: {\n  params: Promise<{ slug: string }>;\n}): Promise<Metadata> {\n  const { slug } = await params;\n  const post = await getPost(slug);\n\n  return {\n    title: post.title,\n    description: post.excerpt,\n    openGraph: {\n      title: post.title,\n      description: post.excerpt,\n      images: [{ url: post.image }],\n    },\n  };\n}\n\nexport default async function BlogPost({\n  params,\n}: {\n  params: Promise<{ slug: string }>;\n}) {\n  const { slug } = await params;\n  return <article><h1>{slug}</h1></article>;\n}`,
    explanation: 'generateMetadata is Next.js Metadata API for dynamic pages. It runs on the server before the page renders, ensuring correct <title> and <meta> tags are in the initial HTML response — critical for SEO and social sharing. Next.js automatically deduplicates the fetch: if both generateMetadata and the page component call getPost(slug), the request is made only once. OpenGraph metadata controls how your page appears when shared on Twitter, Facebook, Slack, etc. The Metadata type from "next" provides full TypeScript autocompletion for all supported meta tags.',
    hints: ['generateMetadata runs on the server alongside the page', 'Next.js deduplicates fetch calls between generateMetadata and the page', 'openGraph.images expects an array of objects with url property'],
    tieredHints: {
      apiSignature: 'async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata>',
      skeleton: `export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.image }],
    },
  };
}`,
    },
    tags: ['metadata', 'seo', 'opengraph', 'generateMetadata', 'dynamic'],
    concepts: ['web-html-semantics', 'next-data-fetching'],
  },

  {
    id: 'next-opt-font-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_OPTIMIZATION,
    course: Course.WEB_DEV,
    question: 'A page links a Google Font with a plain `<link href="https://fonts.googleapis.com/...">` tag. Users on slow connections briefly see fallback text that then jumps to a different size once the font loads (layout shift). Switching to next/font/google fixes this. How?',
    options: [
      { id: 'a', text: 'next/font downloads the font file at build time and self-hosts it with the app — no runtime request to Google\'s servers — and it computes a size-adjusted fallback so the reserved space matches the final font, eliminating the shift', isCorrect: true },
      { id: 'b', text: 'next/font is a thin wrapper that still inserts the same Google Fonts <link> tag, just with a preconnect hint added automatically, so the runtime request still happens but starts slightly earlier', isCorrect: false },
      { id: 'c', text: 'next/font disables all fallback fonts entirely, forcing the browser to block text rendering until the custom font has fully downloaded, which avoids the visible swap', isCorrect: false },
      { id: 'd', text: 'next/font only supports fonts already placed in /public as .woff2 files; for Google Fonts it just renames the same <link> tag import so the request timing is unchanged', isCorrect: false },
    ],
    explanation: 'next/font/google downloads the font files at build time and serves them from your own domain, so there is no external network request or render-blocking request to Google\'s CDN at runtime. It also generates a fallback font with matching metrics (size-adjust), so the fallback text reserves the same space the real font will need, preventing the layout shift entirely.',
    hints: ['Think about where the font file physically lives after the build', 'The fix is about matching metrics, not blocking render'],
    tags: ['next/font', 'self-hosting', 'layout-shift', 'optimization'],
    concepts: ['web-css-responsive'],
  },
  {
    id: 'next-opt-font-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_OPTIMIZATION,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Fill in the import path for the self-hosted Google Fonts loader, and the generated object\'s property applied as the className.',
    template: 'import { Inter } from "___";\n\nconst inter = Inter({ subsets: ["latin"] });\n\nexport default function RootLayout({ children }: { children: React.ReactNode }) {\n  return (\n    <html lang="en">\n      <body className={inter.___}>{children}</body>\n    </html>\n  );\n}',
    blanks: ['next/font/google', 'className'],
    solution: 'import { Inter } from "next/font/google";\n\nconst inter = Inter({ subsets: ["latin"] });\n\nexport default function RootLayout({ children }: { children: React.ReactNode }) {\n  return (\n    <html lang="en">\n      <body className={inter.className}>{children}</body>\n    </html>\n  );\n}',
    explanation: 'next/font/google self-hosts the font at build time. Calling Inter({...}) returns an object whose className property applies the generated font-family and its fallback metrics — applying it at the root layout makes the font available to the whole app.',
    hints: ['the module path under next/font for Google-hosted fonts', 'the property on the returned font object you spread into className'],
    tags: ['next/font', 'RootLayout', 'className'],
    concepts: ['web-css-responsive'],
  },
  {
    id: 'next-opt-fill-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_OPTIMIZATION,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Fill in the CSS position value the parent container needs, and the Image prop that makes it fill that container instead of using width/height.',
    template: 'import Image from "next/image";\n\nexport default function Banner() {\n  return (\n    <div style={{ position: "___", width: "100%", height: "400px" }}>\n      <Image\n        src="/banner.jpg"\n        alt="Seasonal banner"\n        ___\n        sizes="100vw"\n        style={{ objectFit: "cover" }}\n      />\n    </div>\n  );\n}',
    blanks: ['relative', 'fill'],
    solution: 'import Image from "next/image";\n\nexport default function Banner() {\n  return (\n    <div style={{ position: "relative", width: "100%", height: "400px" }}>\n      <Image\n        src="/banner.jpg"\n        alt="Seasonal banner"\n        fill\n        sizes="100vw"\n        style={{ objectFit: "cover" }}\n      />\n    </div>\n  );\n}',
    explanation: 'The `fill` prop makes the Image stretch to cover its nearest positioned ancestor instead of taking explicit width/height, so that ancestor must be `position: relative` (or absolute/fixed) with a defined size. `sizes` is still required with fill so the browser knows which generated image width to request at each viewport size; without it, Next.js assumes the image is 100vw and may serve a larger file than necessary.',
    hints: ['fill needs a positioned parent to have something to fill', 'the prop replaces width/height, it does not add to them'],
    tags: ['next/image', 'fill', 'sizes', 'responsive'],
    concepts: ['web-css-responsive'],
  },
  {
    id: 'next-opt-dynamic-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_OPTIMIZATION,
    course: Course.WEB_DEV,
    question: 'A `<Chart>` component imports a charting library that reads `window` at module load time. Statically importing it crashes the server render with "window is not defined". What fixes this?',
    options: [
      { id: 'a', text: 'const Chart = dynamic(() => import("./Chart"), { ssr: false }) — this skips server-side rendering for Chart entirely, so its module only ever loads in the browser where window exists', isCorrect: true },
      { id: 'b', text: 'const Chart = dynamic(() => import("./Chart")) with no options — next/dynamic disables SSR by default for every component it wraps, so ssr: false is redundant', isCorrect: false },
      { id: 'c', text: 'Wrap the chart library\'s internal window access in a try/catch inside Chart.tsx — dynamic() only changes how a chunk is code-split for bundling, it has no effect on which environment renders it', isCorrect: false },
      { id: 'd', text: 'Add "use client" to Chart.tsx and keep the static import — Client Components never run on the server at all, so next/dynamic is unnecessary here and only useful for reducing bundle size', isCorrect: false },
    ],
    explanation: 'next/dynamic\'s `{ ssr: false }` option tells Next.js to skip rendering that component on the server entirely and only mount it client-side, after hydration — exactly what a browser-only library (one that touches window/document at import time) needs. Client Components still run once on the server during SSR by default; "use client" alone does not opt a component out of that first server pass.',
    hints: ['ssr: false is the option that matters here, not just wrapping in dynamic()', '"use client" changes the bundle boundary, not whether SSR happens'],
    tags: ['next/dynamic', 'ssr', 'code-splitting', 'client-only'],
    concepts: ['next-app-router'],
  },
  {
    id: 'next-opt-dynamic-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_OPTIMIZATION,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Fill in the default import from next/dynamic, and the option that opts the wrapped component out of server-side rendering.',
    template: 'import ___ from "next/dynamic";\n\nconst Chart = dynamic(() => import("./Chart"), { ___ });\n\nexport default function Dashboard() {\n  return <Chart data={salesData} />;\n}',
    blanks: ['dynamic', 'ssr: false'],
    solution: 'import dynamic from "next/dynamic";\n\nconst Chart = dynamic(() => import("./Chart"), { ssr: false });\n\nexport default function Dashboard() {\n  return <Chart data={salesData} />;\n}',
    explanation: 'next/dynamic wraps a lazy `import()` and returns a component that code-splits automatically. Passing `ssr: false` skips the server render pass for that component, which is required for modules that touch browser-only globals (window, document) at import time.',
    hints: ['the default export of next/dynamic', 'the option name that disables the server render pass'],
    tags: ['next/dynamic', 'ssr', 'code-splitting'],
    concepts: ['next-app-router'],
  },
  {
    id: 'next-opt-priority-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_OPTIMIZATION,
    course: Course.WEB_DEV,
    question: 'A product page renders one large hero image above the fold and a grid of five thumbnail images further down the page. Which image(s) should get the `priority` prop, and why?',
    options: [
      { id: 'a', text: 'Only the hero image — priority preloads the image and skips lazy-loading for the browser\'s Largest Contentful Paint candidate; adding it to every image forces the browser to preload all of them, competing for bandwidth and slowing down the actual LCP element', isCorrect: true },
      { id: 'b', text: 'All six images — priority is an accessibility hint for screen readers marking an image as important content, so it should be applied wherever an image conveys meaningful information', isCorrect: false },
      { id: 'c', text: 'Only the five thumbnails — they are numerous and benefit most from eager loading, while the hero image is already cached by the browser automatically since it is first in the DOM', isCorrect: false },
      { id: 'd', text: 'None of them — Next.js automatically detects the LCP image using its own runtime heuristics, and the priority prop is a legacy option kept only for backwards compatibility with next/legacy/image', isCorrect: false },
    ],
    explanation: 'priority tells next/image to preload the image and skip lazy-loading, which should be reserved for the single image most likely to be the Largest Contentful Paint element (usually the largest above-the-fold image). Marking multiple images priority makes them all compete for early bandwidth, which can delay the real LCP image and hurt the metric it was meant to improve. Below-the-fold thumbnails should stay lazy-loaded (the default) since they are not needed for the initial paint.',
    hints: ['priority is about network priority, not accessibility', 'think about what happens when several images all get preloaded at once'],
    tags: ['next/image', 'priority', 'lcp', 'performance'],
    concepts: ['web-css-responsive'],
  },

  // =====================================================================
  // NEXT_DEPLOYMENT (5 questions)
  // =====================================================================

  {
    id: 'next-deploy-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_DEPLOYMENT,
    course: Course.WEB_DEV,
    question: 'You have a Next.js app with these environment variables:\n\n```\n# .env.local\nDATABASE_URL=postgres://...\nSTRIPE_SECRET_KEY=sk_live_...\nNEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...\nNEXT_PUBLIC_APP_URL=https://myapp.com\n```\n\nWhich variables are accessible in Client Components running in the browser?',
    options: [
      { id: 'a', text: 'All four — anything declared in .env.local is bundled into the client automatically, regardless of the variable name', isCorrect: false },
      { id: 'b', text: 'None of them — environment variables from .env.local are only readable inside API routes, never in any kind of component', isCorrect: false },
      { id: 'c', text: 'All except DATABASE_URL — Next.js automatically detects and strips out anything that looks like a database connection string', isCorrect: false },
      { id: 'd', text: 'Only NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY and NEXT_PUBLIC_APP_URL — the NEXT_PUBLIC_ prefix makes them available in the browser bundle', isCorrect: true },
    ],
    explanation: 'The NEXT_PUBLIC_ prefix is a security boundary. Variables WITHOUT the prefix (DATABASE_URL, STRIPE_SECRET_KEY) are only available on the server — in Server Components, Route Handlers, and middleware. They are NEVER included in the JavaScript bundle sent to the browser. Variables WITH the NEXT_PUBLIC_ prefix are inlined into the client bundle at build time using string replacement, making them visible to anyone who inspects your site. This is why you NEVER prefix secret keys with NEXT_PUBLIC_. The .env.local file is for local development and is gitignored by default.',
    hints: ['Look for the special prefix that controls browser access', 'Think about what "public" means in the context of web security'],
    tags: ['env-variables', 'NEXT_PUBLIC', 'security', 'client-server'],
    concepts: ['web-security-input-validation'],
  },

  {
    id: 'next-deploy-public-cloze-1',
    type: QuestionType.CLOZE_CODE,
    difficulty: Difficulty.BEGINNER,
    topic: Topic.NEXT_DEPLOYMENT,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: 'Fill in the env var read inside the Client Component (must carry the browser-safe prefix), and the env var read inside the server-only file (the secret, unprefixed).',
    template: '// app/components/Price.tsx ("use client")\nexport default function Price() {\n  return <p>{process.env.___}</p>;\n}\n\n// app/lib/db.ts (server-only module, never bundled for the browser)\nconst connectionString = process.env.___;',
    blanks: ['NEXT_PUBLIC_APP_URL', 'DATABASE_URL'],
    solution: '// app/components/Price.tsx ("use client")\nexport default function Price() {\n  return <p>{process.env.NEXT_PUBLIC_APP_URL}</p>;\n}\n\n// app/lib/db.ts (server-only module, never bundled for the browser)\nconst connectionString = process.env.DATABASE_URL;',
    explanation: 'Next.js statically replaces process.env.NEXT_PUBLIC_* references at build time so they work inside code that ships to the browser; any other env var reference inside client code gets inlined as undefined. Server-only files (Server Components, Route Handlers, lib modules never imported by client code) can read any variable, prefixed or not, because that code never leaves the server.',
    hints: ['the client-readable one needs the browser-safe prefix', 'the server file can read the unprefixed secret directly'],
    tags: ['env-variables', 'NEXT_PUBLIC', 'client-server'],
    concepts: ['web-security-input-validation'],
  },

  {
    id: 'next-deploy-2',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_DEPLOYMENT,
    course: Course.WEB_DEV,
    question: 'Your team wants to deploy a Next.js app that uses Server Components, Server Actions, and middleware. They are evaluating whether to use a static export (next export) or a server deployment.\n\nWhich statement is correct?',
    options: [
      { id: 'a', text: 'Static export produces only HTML/CSS/JS files but does NOT support Server Actions, middleware, or dynamic server-side rendering — you need a Node.js server (or Vercel) for those features', isCorrect: true },
      { id: 'b', text: 'Static export (output: "export" in next.config.js) supports all features — Server Components render at build time and Server Actions compile to API endpoints', isCorrect: false },
      { id: 'c', text: 'There is no static export option in the App Router — you must always deploy with a server', isCorrect: false },
      { id: 'd', text: 'Static export and server deployment produce identical output — the only difference is hosting cost', isCorrect: false },
    ],
    explanation: 'output: "export" generates a fully static site (HTML + JS + CSS) that can be hosted on any CDN (S3, Netlify, GitHub Pages). Server Components DO work in static export — they render at build time. However, you lose: Server Actions (need a server to process), middleware (needs Edge Runtime), dynamic rendering (no server to render on request), and ISR (no server to revalidate). If your app is content-heavy with no mutations, static export is great. If you need interactivity, forms, or dynamic data, you need a server. The standalone output mode (output: "standalone") creates a minimal Node.js server for self-hosting.',
    hints: ['Think about what requires a running server vs. what can be pre-built', 'Server Actions need a server to execute — the name gives it away'],
    tags: ['static-export', 'deployment', 'server-vs-static', 'standalone'],
    concepts: ['next-deployment'],
  },

  {
    id: 'next-deploy-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.NEXT_DEPLOYMENT,
    course: Course.WEB_DEV,
    question: 'You are self-hosting a Next.js app on your own servers (not Vercel). You need to minimize the Docker image size and ensure the app runs correctly with all features.\n\nWhich next.config.js setting and Dockerfile strategy is correct?',
    options: [
      { id: 'a', text: 'Copy the entire project directory and node_modules into Docker, then run "npm start"', isCorrect: false },
      { id: 'b', text: 'Set output: "standalone" — this creates a self-contained folder with only the necessary node_modules files. Your Dockerfile copies the .next/standalone directory plus the .next/static and public folders, then runs "node server.js"', isCorrect: true },
      { id: 'c', text: 'Set output: "export" and serve the static files with nginx — this supports all Next.js features', isCorrect: false },
      { id: 'd', text: 'Use output: "standalone" and run "next start" — the standalone output includes the next CLI', isCorrect: false },
    ],
    explanation: 'output: "standalone" uses @vercel/nft (Node File Trace) to analyze your imports and copy only the node_modules files actually used by your app into .next/standalone. This can reduce the Docker image from 1GB+ to under 100MB. The standalone output includes a minimal server.js — you run it with "node server.js", NOT "next start" (the next CLI is not included). You must manually copy .next/static (client-side assets) and public/ (static files) because they are meant to be served by a CDN in production. Option B copies all of node_modules which is wasteful. Option C loses server features. Option D uses the wrong start command.',
    hints: ['Think about what standalone mode includes and excludes', 'The standalone output includes its own server — no next CLI needed', 'Static assets are intentionally separated for CDN deployment'],
    tags: ['standalone', 'docker', 'self-hosting', 'deployment', 'optimization'],
    concepts: ['next-deployment'],
  },

  {
    id: 'next-deploy-buildtime-mcq-1',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_DEPLOYMENT,
    course: Course.WEB_DEV,
    question: 'An app has: a statically generated blog page (generateStaticParams, no revalidate), a dashboard page that calls cookies(), and a NEXT_PUBLIC_APP_URL reference in client code. What runs at build time vs request time?',
    options: [
      { id: 'a', text: 'The blog page\'s HTML is generated once at build time; NEXT_PUBLIC_APP_URL is inlined into the client bundle at build time; the dashboard page renders fresh on every request because calling cookies() opts that route out of static rendering', isCorrect: true },
      { id: 'b', text: 'All three happen at request time — Next.js always defers rendering until a request arrives, and "static" only changes which CDN layer caches the response afterward', isCorrect: false },
      { id: 'c', text: 'All three happen at build time — Next.js pre-renders every route including ones calling cookies() by mocking the incoming request, so no per-request server work occurs', isCorrect: false },
      { id: 'd', text: 'NEXT_PUBLIC_APP_URL is re-evaluated on every request since environment variables are runtime-only values in Node.js, while both pages are rendered once at build time regardless of cookies() usage', isCorrect: false },
    ],
    explanation: 'Routes without dynamic APIs (no cookies(), headers(), searchParams, or uncached fetch) are static: Next.js renders their HTML once at build time and serves the same output to every visitor. Calling cookies() (or any of the other dynamic APIs) inside a route forces Next.js to render that route on every incoming request instead, since the response can differ per user. NEXT_PUBLIC_ variables are string-replaced into the client bundle during the build step, not read at runtime in the browser.',
    hints: ['static rendering happens once, ahead of any request', 'cookies() is one of the APIs that forces per-request rendering'],
    tags: ['static-vs-dynamic', 'build-time', 'request-time', 'cookies'],
    concepts: ['next-data-fetching'],
  },
];
