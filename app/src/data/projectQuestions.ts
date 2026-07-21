import { Question, QuestionType, Difficulty, Topic, CodeLanguage, Course } from '../types';

export const projectQuestions: Question[] = [

  // =====================================================================
  // CHECKPOINT 1: After JavaScript (Topic.JS_PROJECT) — 3 questions
  // =====================================================================

  {
    id: 'proj-js-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.JS_PROJECT,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: `Build a Todo App in Vanilla JavaScript

You're given the HTML structure for a simple todo app. Write the JavaScript that:
1. Adds a new todo when the user clicks "Add" or presses Enter
2. Deletes a todo when its delete button is clicked (use event delegation on the list)
3. Persists todos to localStorage so they survive page refresh

The HTML structure is already provided. You need to implement the three functions and the initialization logic.`,
    starterCode: `// Get references to #todo-input, #add-btn, and #todo-list from the DOM.
// Implement loadTodos()/saveTodos(todos) around localStorage key 'todos' with JSON parse/stringify.
// createTodoElement(text, index) returns an <li> with the text plus a Delete <button>
//   carrying a data-index attribute.
// addTodo() reads trimmed input, appends a todo, saves, re-renders, clears the input.
// renderTodos() clears the list and appends an element per todo.
// Wire listeners: add-btn click, input Enter keypress, and event-delegated list click that
//   reads dataset.index, removes that todo, saves, and re-renders.
// Call renderTodos() once on startup.
`,
    testCases: [
      {
        input: 'Adding a todo',
        expectedOutput: 'loadTodos.*localStorage.*getItem.*todos.*JSON.parse',
        description: 'loadTodos reads from localStorage and parses JSON',
      },
      {
        input: 'Saving todos',
        expectedOutput: 'saveTodos.*localStorage.*setItem.*todos.*JSON.stringify',
        description: 'saveTodos writes to localStorage with JSON.stringify',
      },
      {
        input: 'Event delegation for delete',
        expectedOutput: 'list.*addEventListener.*click.*data-index|dataset.index',
        description: 'Uses event delegation on the list for delete buttons',
      },
    ],
    solution: `const input = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const list = document.getElementById('todo-list');

function loadTodos() {
  const stored = localStorage.getItem('todos');
  return stored ? JSON.parse(stored) : [];
}

function saveTodos(todos) {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function createTodoElement(text, index) {
  const li = document.createElement('li');
  li.textContent = text;
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.setAttribute('data-index', index);
  li.appendChild(deleteBtn);
  return li;
}

function addTodo() {
  const text = input.value.trim();
  if (!text) return;
  const todos = loadTodos();
  todos.push(text);
  saveTodos(todos);
  renderTodos();
  input.value = '';
}

function renderTodos() {
  list.innerHTML = '';
  const todos = loadTodos();
  todos.forEach((text, index) => {
    list.appendChild(createTodoElement(text, index));
  });
}

addBtn.addEventListener('click', addTodo);
input.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTodo();
});

// Event delegation: handle delete clicks on the list
list.addEventListener('click', (e) => {
  if (e.target.tagName === 'BUTTON') {
    const index = parseInt(e.target.dataset.index);
    const todos = loadTodos();
    todos.splice(index, 1);
    saveTodos(todos);
    renderTodos();
  }
});

renderTodos();`,
    explanation: `Key architectural decisions:

1. **Event delegation** — Instead of attaching a click listener to every delete button (which would need re-attaching on every render), we put one listener on the parent <ul>. When a click bubbles up, we check if it came from a button and read its data-index. This is more performant and works automatically for dynamically added elements.

2. **localStorage as source of truth** — loadTodos/saveTodos create a simple persistence layer. We always read from localStorage before modifying, which prevents stale state issues.

3. **Re-render pattern** — Rather than surgically updating the DOM, renderTodos() clears and rebuilds the list. For a small todo list this is fine and avoids complex DOM diffing logic. React does this same concept, but with a virtual DOM for performance.`,
    hints: [
      'localStorage.getItem returns null if the key doesn\'t exist — handle that case',
      'event.target tells you which element was actually clicked, even inside a delegated listener',
      'Use dataset.index (or getAttribute("data-index")) to identify which todo to delete',
    ],
    tieredHints: {
      apiSignature: 'Storage.getItem(key) / JSON.parse(text) / Element.setAttribute(name, value) / Element.addEventListener(type, listener)',
      skeleton: 'function loadTodos() {\n  const stored = ____;\n  return stored ? ____ : [];\n}\n\nfunction saveTodos(todos) {\n  ____;\n}\n\nfunction createTodoElement(text, index) {\n  const li = document.createElement("li");\n  li.textContent = text;\n  const deleteBtn = document.createElement("button");\n  deleteBtn.textContent = "Delete";\n  deleteBtn.setAttribute(____, index);\n  li.appendChild(deleteBtn);\n  return li;\n}\n\nlist.addEventListener("click", (e) => {\n  if (____) {\n    const index = ____;\n    const todos = loadTodos();\n    todos.splice(index, 1);\n    saveTodos(todos);\n    renderTodos();\n  }\n});',
    },
    tags: ['dom', 'localstorage', 'event-delegation', 'crud', 'project'],
    concepts: ['js-dom-events'],
  },

  {
    id: 'proj-js-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.JS_PROJECT,
    course: Course.WEB_DEV,
    language: CodeLanguage.JAVASCRIPT,
    question: `Build a Debounced Search Filter

You have an array of products and an HTML search input. Build a search feature that:
1. Filters the products array by name (case-insensitive) as the user types
2. Uses debounce (300ms delay) so filtering doesn't run on every single keystroke
3. Renders matching products as a list in the DOM

The products array and HTML are provided. Implement the debounce function, the filter logic, and the rendering.`,
    starterCode: `// HTML structure (already in the page):
// <input id="search" placeholder="Search products..." />
// <div id="results"></div>

const products = [
  { id: 1, name: 'Wireless Mouse', price: 29.99, category: 'Electronics' },
  { id: 2, name: 'Mechanical Keyboard', price: 79.99, category: 'Electronics' },
  { id: 3, name: 'USB-C Hub', price: 49.99, category: 'Electronics' },
  { id: 4, name: 'Standing Desk', price: 399.99, category: 'Furniture' },
  { id: 5, name: 'Monitor Arm', price: 89.99, category: 'Furniture' },
  { id: 6, name: 'Desk Lamp', price: 34.99, category: 'Furniture' },
  { id: 7, name: 'Noise Cancelling Headphones', price: 199.99, category: 'Audio' },
  { id: 8, name: 'Webcam HD', price: 59.99, category: 'Electronics' },
];

const searchInput = document.getElementById('search');
const resultsDiv = document.getElementById('results');

// Implement a debounce function
// It should return a new function that delays calling fn until
// after 'delay' ms have passed since the last invocation
function debounce(fn, delay) {
  // TODO: Use a timer variable, clearTimeout on each call,
  // setTimeout to call fn after delay
}

// Filter products by search query (case-insensitive match on name)
function filterProducts(query) {
  // TODO: Use Array.filter() and String.includes()
  // If query is empty, return all products
}

// Render an array of products into the results div
function renderProducts(productList) {
  // TODO: Build HTML string or create elements for each product
  // Show name, price, and category
  // If no results, show "No products found"
}

// Wire it all up
// TODO: Create a debounced version of the search handler (300ms)
// TODO: Add 'input' event listener on searchInput
// TODO: Initial render showing all products
`,
    testCases: [
      {
        input: 'debounce function',
        expectedOutput: 'function debounce.*clearTimeout.*setTimeout',
        description: 'Implements debounce with clearTimeout and setTimeout',
      },
      {
        input: 'filter logic',
        expectedOutput: 'filter.*toLowerCase.*includes|filter.*includes.*toLowerCase',
        description: 'Filters products case-insensitively using filter and includes',
      },
      {
        input: 'rendering',
        expectedOutput: 'innerHTML|appendChild|createElement',
        description: 'Renders filtered products to the DOM',
      },
    ],
    solution: `const products = [
  { id: 1, name: 'Wireless Mouse', price: 29.99, category: 'Electronics' },
  { id: 2, name: 'Mechanical Keyboard', price: 79.99, category: 'Electronics' },
  { id: 3, name: 'USB-C Hub', price: 49.99, category: 'Electronics' },
  { id: 4, name: 'Standing Desk', price: 399.99, category: 'Furniture' },
  { id: 5, name: 'Monitor Arm', price: 89.99, category: 'Furniture' },
  { id: 6, name: 'Desk Lamp', price: 34.99, category: 'Furniture' },
  { id: 7, name: 'Noise Cancelling Headphones', price: 199.99, category: 'Audio' },
  { id: 8, name: 'Webcam HD', price: 59.99, category: 'Electronics' },
];

const searchInput = document.getElementById('search');
const resultsDiv = document.getElementById('results');

function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

function filterProducts(query) {
  if (!query.trim()) return products;
  const lowerQuery = query.toLowerCase();
  return products.filter(p => p.name.toLowerCase().includes(lowerQuery));
}

function renderProducts(productList) {
  if (productList.length === 0) {
    resultsDiv.innerHTML = '<p>No products found</p>';
    return;
  }
  resultsDiv.innerHTML = productList
    .map(p => \`<div class="product">
      <strong>\${p.name}</strong> — $\${p.price.toFixed(2)}
      <span class="category">\${p.category}</span>
    </div>\`)
    .join('');
}

const debouncedSearch = debounce((e) => {
  const filtered = filterProducts(e.target.value);
  renderProducts(filtered);
}, 300);

searchInput.addEventListener('input', debouncedSearch);

renderProducts(products);`,
    explanation: `Key concepts demonstrated:

1. **Debounce pattern** — Without debounce, filtering runs on every keystroke. With debounce, it waits 300ms after the user stops typing. This matters for expensive operations like API calls. The trick is clearTimeout — each new keystroke cancels the previous timer.

2. **Array.filter()** — Non-mutating method that returns a new array with elements that pass the test. Combined with toLowerCase().includes() for case-insensitive substring matching.

3. **Template literals for rendering** — Using map() + join('') to build HTML strings is a common vanilla JS pattern. React replaces this with JSX, but understanding the underlying DOM manipulation helps you appreciate what React does for you.

4. **Separation of concerns** — filter, render, and debounce are independent functions. This makes each piece testable and reusable.`,
    hints: [
      'debounce needs a closure variable to hold the timer ID between calls',
      'clearTimeout cancels a pending setTimeout — call it before setting a new one',
      'toLowerCase() on both the query and product name ensures case-insensitive matching',
    ],
    tieredHints: {
      apiSignature: 'clearTimeout(timeoutId) / setTimeout(callback, delay) / String.prototype.includes(searchString)',
      skeleton: 'function debounce(fn, delay) {\n  let timer;\n  return function (...args) {\n    ____;\n    timer = ____;\n  };\n}\n\nfunction filterProducts(query) {\n  if (!query.trim()) return products;\n  const lowerQuery = query.toLowerCase();\n  return products.filter(p => ____);\n}',
    },
    tags: ['debounce', 'filter', 'dom', 'search', 'project'],
    concepts: ['js-array-methods', 'js-dom-events'],
  },

  {
    id: 'proj-js-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.JS_PROJECT,
    course: Course.WEB_DEV,
    question: `You're building a dashboard that needs to fetch user data, their recent orders, and notification count from 3 independent API endpoints. You want to show a loading spinner until ALL data is ready, and if ANY request fails, show an error. Which approach is correct and why?`,
    options: [
      {
        id: 'a',
        text: 'Use sequential await: const user = await fetchUser(); const orders = await fetchOrders(); const notifications = await fetchNotifications(); — simple and readable.',
        isCorrect: false,
      },
      {
        id: 'b',
        text: 'Use Promise.allSettled([fetchUser(), fetchOrders(), fetchNotifications()]) — it waits for all promises and gives you the result of each, even if some fail.',
        isCorrect: false,
      },
      {
        id: 'c',
        text: 'Use Promise.all([fetchUser(), fetchOrders(), fetchNotifications()]) — all three requests run concurrently, and it rejects immediately if any one fails, which matches the "show error if ANY fails" requirement.',
        isCorrect: true,
      },
      {
        id: 'd',
        text: 'Use Promise.race([fetchUser(), fetchOrders(), fetchNotifications()]) — it resolves as soon as the fastest request completes, which makes the UI feel snappier.',
        isCorrect: false,
      },
    ],
    explanation: `Promise.all is the right choice here because:

1. **Concurrent execution** — All 3 fetches start simultaneously. If each takes 500ms, total time is ~500ms instead of ~1500ms with sequential await.

2. **Fail-fast behavior** — If any promise rejects, Promise.all immediately rejects. This matches the requirement to "show error if ANY fails."

3. Why NOT sequential await? It works but is unnecessarily slow — the requests don't depend on each other, so there's no reason to wait for one before starting the next.

4. Why NOT Promise.allSettled? It never rejects — it always resolves with status objects. Useful when you want partial results (show what you can, even if some fail), but the requirement says to show an error if any fail.

5. Why NOT Promise.race? It resolves with the FIRST settled promise and ignores the rest. You'd only get one result.`,
    hints: [
      'Think about whether the 3 requests depend on each other',
      'Consider what happens when one of the requests fails',
    ],
    tags: ['promises', 'async', 'promise-all', 'api', 'project'],
    concepts: ['js-promises-async'],
  },

  // =====================================================================
  // CHECKPOINT 2: After TypeScript + React (Topic.TS_PROJECT) — 3 questions
  // =====================================================================

  {
    id: 'proj-ts-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TS_PROJECT,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: `Build a Generic DataTable<T> Component

Create a fully-typed, reusable DataTable component that works with ANY data shape using TypeScript generics. It should accept:
- data: T[] — the array of objects to display
- columns: Column<T>[] — column definitions with key, header text, and optional custom render function
- onRowClick?: (item: T) => void — optional row click handler

The component should render an HTML table with proper headers and rows. The Column type's "key" should be constrained to actual keys of T.`,
    starterCode: `import React from 'react';

// Define the Column type with generics
// - key: must be a key of T (use keyof T)
// - header: string label for the column header
// - render: optional custom render function that receives the item
interface Column<T> {
  // TODO: Define the interface
}

// Define the props for DataTable
interface DataTableProps<T> {
  // TODO: Define the props
}

// Build the DataTable component
// Use a generic function syntax: function DataTable<T>(...) or
// const DataTable = <T extends Record<string, unknown>>(...) => ...
function DataTable<T extends { id: string | number }>({
  data,
  columns,
  onRowClick,
}: DataTableProps<T>) {
  return (
    // TODO: Render a <table> with:
    // - <thead> with a <tr> containing <th> for each column header
    // - <tbody> with a <tr> for each data item
    //   - Each <tr> should have onClick={onRowClick} if provided
    //   - Each <td> should use column.render(item) if render exists,
    //     otherwise display String(item[column.key])
    //   - Use item.id as the key for each row
    <table></table>
  );
}

export default DataTable;

// Example usage (for reference):
// <DataTable<User>
//   data={users}
//   columns={[
//     { key: 'name', header: 'Name' },
//     { key: 'email', header: 'Email' },
//     { key: 'role', header: 'Role', render: (user) => <Badge>{user.role}</Badge> },
//   ]}
//   onRowClick={(user) => navigate(\`/users/\${user.id}\`)}
// />
`,
    testCases: [
      {
        input: 'Column interface',
        expectedOutput: 'interface Column.*keyof T|key:\\s*keyof T',
        description: 'Column interface uses keyof T to constrain the key field',
      },
      {
        input: 'Generic component',
        expectedOutput: 'function DataTable<T|DataTable.*=.*<T',
        description: 'Component is generic with type parameter T',
      },
      {
        input: 'Rendering logic',
        expectedOutput: 'column\\.render.*item\\[column\\.key\\]|render.*item.*key',
        description: 'Uses custom render function or falls back to displaying the value',
      },
    ],
    solution: `import React from 'react';

interface Column<T> {
  key: keyof T;
  header: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
}

function DataTable<T extends { id: string | number }>({
  data,
  columns,
  onRowClick,
}: DataTableProps<T>) {
  return (
    <table>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={String(col.key)}>{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item) => (
          <tr
            key={item.id}
            onClick={() => onRowClick?.(item)}
            style={{ cursor: onRowClick ? 'pointer' : 'default' }}
          >
            {columns.map((col) => (
              <td key={String(col.key)}>
                {col.render ? col.render(item) : String(item[col.key])}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default DataTable;`,
    explanation: `Architectural decisions:

1. **keyof T constraint** — Column's key property is typed as \`keyof T\`, so TypeScript will error if you try to use a column key that doesn't exist on the data type. This catches bugs at compile time.

2. **Generic function syntax** — \`function DataTable<T>(...)\` lets the component work with any data type. When you write \`<DataTable<User> data={users} ...>\`, T becomes User and all the types flow through.

3. **T extends { id: string | number }** — We constrain T to require an id field because React needs a stable key for each row. This is a practical constraint that makes the component usable.

4. **Optional render function** — The fallback \`String(item[col.key])\` handles simple values, while custom render functions handle complex cells (badges, links, formatted dates). This is the "renderless component" pattern — the component handles structure, the consumer handles presentation.

5. **Optional chaining for onRowClick** — \`onRowClick?.(item)\` safely handles the case where no click handler is provided.`,
    hints: [
      'keyof T gives you a union of all property names of T as string literal types',
      'You need to use String(col.key) when using keyof T as a React key prop',
      'The render function should return React.ReactNode for maximum flexibility',
    ],
    tieredHints: {
      apiSignature: 'interface Column<T> { key: keyof T; header: string; render?: (item: T) => React.ReactNode; }',
      skeleton: 'function DataTable<T extends { id: string | number }>({\n  data,\n  columns,\n  onRowClick,\n}: DataTableProps<T>) {\n  return (\n    <table>\n      <thead>\n        <tr>\n          {columns.map((col) => (\n            <th key={String(col.key)}>{col.header}</th>\n          ))}\n        </tr>\n      </thead>\n      <tbody>\n        {data.map((item) => (\n          <tr\n            key={item.id}\n            onClick={() => ____}\n            style={{ cursor: onRowClick ? "pointer" : "default" }}\n          >\n            {columns.map((col) => (\n              <td key={String(col.key)}>\n                {col.render ? ____ : ____}\n              </td>\n            ))}\n          </tr>\n        ))}\n      </tbody>\n    </table>\n  );\n}',
    },
    tags: ['generics', 'react', 'typescript', 'components', 'project'],
    concepts: ['ts-generics'],
  },

  {
    id: 'proj-ts-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TS_PROJECT,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: `Build a useLocalStorage<T> Custom Hook

Create a typed React hook that works like useState but automatically syncs with localStorage. Requirements:
1. Generic type T for the stored value
2. Reads initial value from localStorage on mount (falls back to initialValue param)
3. Writes to localStorage whenever the value changes
4. Handles JSON parse/stringify
5. Handles SSR safety (window might not exist)
6. Returns [value, setValue] tuple just like useState`,
    starterCode: `// Import useState and useEffect from react
// Export default a generic useLocalStorage<T>(key, initialValue) returning [T, Dispatch<SetStateAction<T>>]
// Use a lazy useState initializer that checks typeof window !== 'undefined',
// reads localStorage.getItem(key), JSON.parses it (try/catch around parse), falls back to initialValue
// useEffect([key, value]) writes JSON.stringify(value) back to localStorage when window exists
// Return the [value, setValue] tuple
`,
    testCases: [
      {
        input: 'Lazy initializer',
        expectedOutput: 'useState.*=>.*localStorage.*getItem.*JSON.parse',
        description: 'Uses lazy useState initializer to read from localStorage',
      },
      {
        input: 'Write effect',
        expectedOutput: 'useEffect.*localStorage.*setItem.*JSON.stringify',
        description: 'useEffect syncs value to localStorage on change',
      },
      {
        input: 'SSR safety',
        expectedOutput: 'typeof window.*undefined|window.*===.*undefined',
        description: 'Checks for window existence for SSR compatibility',
      },
    ],
    solution: `import { useState, useEffect } from 'react';

function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const stored = localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      console.warn(\`Failed to save \${key} to localStorage\`);
    }
  }, [key, value]);

  return [value, setValue];
}

export default useLocalStorage;`,
    explanation: `Key design decisions:

1. **Lazy initializer** — useState accepts a function that runs only on the first render. This is critical because reading from localStorage is synchronous I/O — you don't want it running on every re-render. The function form \`useState(() => ...)\` ensures it runs once.

2. **SSR safety** — \`typeof window === 'undefined'\` is the standard check for server-side rendering environments (Next.js SSR, etc.) where localStorage doesn't exist. We fall back to initialValue in that case.

3. **Try-catch around JSON.parse** — Corrupted localStorage data shouldn't crash the app. If parsing fails, we silently fall back to initialValue. This defensive coding prevents runtime errors from breaking the entire component tree.

4. **Generic return type** — The return type \`[T, React.Dispatch<React.SetStateAction<T>>]\` matches useState's signature exactly, so the hook is a drop-in replacement. The SetStateAction type allows both direct values and updater functions: \`setValue('new')\` or \`setValue(prev => ...)\`.

5. **Effect dependencies** — \`[key, value]\` ensures we re-sync whenever the stored value changes OR when the storage key changes (useful if the key is dynamic).`,
    hints: [
      'useState can take a function as initial value — it will only run on first render',
      'typeof window === "undefined" is the standard SSR check',
      'Wrap JSON.parse in try-catch — corrupted localStorage data shouldn\'t crash the app',
    ],
    tieredHints: {
      apiSignature: 'useState<T>(initialState: T | (() => T)): [T, Dispatch<SetStateAction<T>>]; useEffect(effect: EffectCallback, deps?: DependencyList): void',
      skeleton: 'function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {\n  const [value, setValue] = useState<T>(() => {\n    if (____) return initialValue;\n    try {\n      const stored = ____;\n      return stored ? ____ : initialValue;\n    } catch {\n      return ____;\n    }\n  });\n\n  useEffect(() => {\n    if (____) return;\n    try {\n      ____;\n    } catch {\n      ____;\n    }\n  }, [____]);\n\n  return [value, setValue];\n}',
    },
    tags: ['hooks', 'localstorage', 'generics', 'typescript', 'project'],
    concepts: ['js-dom-events', 'ts-generics'],
  },

  {
    id: 'proj-ts-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TS_PROJECT,
    course: Course.WEB_DEV,
    question: `You have a list of 10,000 items rendered in React. The user can type into a search input to filter the list, but the filtering logic takes about 50ms. Users report the input feels laggy — keystrokes are delayed. What's the correct React optimization?`,
    options: [
      {
        id: 'a',
        text: 'Wrap the filter computation in useMemo — it will memoize the filtered results and skip recomputation when the input hasn\'t changed.',
        isCorrect: false,
      },
      {
        id: 'b',
        text: 'Debounce the input with a 300ms delay using setTimeout — this reduces how often the filter runs.',
        isCorrect: false,
      },
      {
        id: 'c',
        text: 'Use useDeferredValue on the search query — the input stays responsive at high priority while the filtered list re-renders at lower priority in the background.',
        isCorrect: true,
      },
      {
        id: 'd',
        text: 'Use React.memo on the list component so it only re-renders when the filtered data actually changes.',
        isCorrect: false,
      },
    ],
    explanation: `useDeferredValue is the right answer because it solves the core problem: the input and the list are competing for the same render cycle.

**Why useDeferredValue?** It lets React render the input update at high priority (so keystrokes feel instant) and defer the expensive list re-render to a lower-priority update. If new keystrokes come in while the list is re-rendering, React can abandon the stale render and start fresh. The UI stays responsive.

**Why NOT useMemo?** useMemo memoizes the result, but the filter still runs synchronously when the input changes — it still blocks the render. useMemo helps when data hasn't changed, but here it changes on every keystroke.

**Why NOT debounce?** Debounce adds artificial latency to the input itself. The user types and nothing happens for 300ms. useDeferredValue keeps the input instant and only defers the expensive part.

**Why NOT React.memo?** The filtered data DOES change on every keystroke, so memo won't prevent re-renders. The problem isn't unnecessary renders — it's that the necessary render is too expensive to do synchronously.`,
    hints: [
      'The problem is that filtering blocks the input — the input and list compete for the same render',
      'Think about what React 18 concurrent features were designed to solve',
    ],
    tags: ['performance', 'react', 'useDeferredValue', 'optimization', 'project'],
    concepts: ['react-memoization'],
  },

  // =====================================================================
  // CHECKPOINT 3: After Next.js Basics (Topic.NEXT_DEPLOYMENT) — 3 questions
  // =====================================================================

  {
    id: 'proj-next-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_DEPLOYMENT,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: `Build a Blog Index Page with Server Components

Create a Next.js 14+ blog using the App Router. You need:
1. A Server Component page (app/blog/page.tsx) that fetches posts from an API and renders a list with next/link
2. generateMetadata for SEO
3. A loading.tsx for streaming/suspense
4. A dynamic [slug]/page.tsx that fetches and renders a single post

Show all files. The fetch URL is "https://api.example.com/posts" (returns {posts: Post[]}) and "https://api.example.com/posts/{slug}" (returns a Post).`,
    starterCode: `// types.ts
interface Post {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  author: string;
}

// ==========================================
// app/blog/page.tsx — Blog index (Server Component)
// ==========================================
import Link from 'next/link';
import { Metadata } from 'next';

// TODO: Export generateMetadata or a static metadata object for SEO
// (title: "Blog", description: "Latest articles")

// TODO: Create an async function to fetch posts from the API
// https://api.example.com/posts
// Don't forget: { next: { revalidate: 3600 } } for ISR

// TODO: Export default async function BlogPage that:
// - Awaits the fetch
// - Renders a heading and a list of posts
// - Each post links to /blog/{slug} using next/link
// - Show title, excerpt, date, and author for each post

// ==========================================
// app/blog/loading.tsx — Loading skeleton
// ==========================================
// TODO: Export a loading component that shows placeholder cards
// (This file enables streaming — Next.js wraps the page in Suspense)

// ==========================================
// app/blog/[slug]/page.tsx — Single post (Server Component)
// ==========================================
// TODO: Export async function that:
// - Receives { params } with slug
// - Fetches single post from https://api.example.com/posts/{slug}
// - If not found, call notFound()
// - Renders the post title, author, date, and content

// TODO: Export generateMetadata that fetches the post and returns
// dynamic title and description for SEO
`,
    testCases: [
      {
        input: 'Blog index page',
        expectedOutput: 'async.*function.*Blog|export default async|generateMetadata',
        description: 'Blog page is an async Server Component with metadata',
      },
      {
        input: 'Dynamic route',
        expectedOutput: 'params.*slug|notFound|api.example.com/posts/',
        description: 'Dynamic page reads slug from params and handles not found',
      },
      {
        input: 'ISR / revalidation',
        expectedOutput: 'revalidate|next.*revalidate|cache',
        description: 'Uses revalidation for incremental static regeneration',
      },
    ],
    solution: `// ==========================================
// app/blog/page.tsx
// ==========================================
import Link from 'next/link';
import { Metadata } from 'next';

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  author: string;
}

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Latest articles and tutorials',
};

async function getPosts(): Promise<Post[]> {
  const res = await fetch('https://api.example.com/posts', {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error('Failed to fetch posts');
  const data = await res.json();
  return data.posts;
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <main>
      <h1>Blog</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={\`/blog/\${post.slug}\`}>
              <h2>{post.title}</h2>
              <p>{post.excerpt}</p>
              <span>{post.author} · {new Date(post.publishedAt).toLocaleDateString()}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

// ==========================================
// app/blog/loading.tsx
// ==========================================
export default function BlogLoading() {
  return (
    <main>
      <h1>Blog</h1>
      <ul>
        {Array.from({ length: 5 }).map((_, i) => (
          <li key={i} className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-full mb-1" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
          </li>
        ))}
      </ul>
    </main>
  );
}

// ==========================================
// app/blog/[slug]/page.tsx
// ==========================================
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

async function getPost(slug: string): Promise<Post | null> {
  const res = await fetch(\`https://api.example.com/posts/\${slug}\`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return { title: 'Post Not Found' };
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.author} · {new Date(post.publishedAt).toLocaleDateString()}</p>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}`,
    explanation: `Architectural highlights:

1. **Server Components by default** — These pages are async functions that fetch data on the server. No useEffect, no loading state management, no client-side fetch waterfall. The HTML is generated with the data already embedded.

2. **Streaming with loading.tsx** — Next.js automatically wraps the page in a Suspense boundary. While the async page is fetching, users see the skeleton from loading.tsx. The page streams in when data is ready. No extra code needed.

3. **ISR with revalidate** — \`{ next: { revalidate: 3600 } }\` means the page is statically generated but revalidated every hour. First visitor gets a cached page instantly; after an hour, the next visitor triggers a background rebuild.

4. **generateMetadata** — Runs on the server before rendering. For the dynamic page, it fetches the post to generate a proper <title> and <meta description>. This is critical for SEO — crawlers see the correct metadata without executing JavaScript.

5. **notFound()** — Calling notFound() renders the nearest not-found.tsx boundary (or the default 404 page). It's the Next.js equivalent of throwing a 404.`,
    hints: [
      'Server Components can be async functions — just await your data directly',
      'loading.tsx is automatically used as a Suspense fallback by Next.js',
      'generateMetadata can also be async — it runs before the page renders',
    ],
    tieredHints: {
      apiSignature: 'fetch(url, { next: { revalidate: seconds } }); generateMetadata({ params }): Promise<Metadata>; notFound(): never',
      skeleton: '// app/blog/page.tsx\nasync function getPosts(): Promise<Post[]> {\n  const res = await ____("https://api.example.com/posts", {\n    ____,\n  });\n  if (!res.ok) throw new Error("Failed to fetch posts");\n  const data = await res.json();\n  return data.posts;\n}\n\n// app/blog/[slug]/page.tsx\nexport default async function PostPage({ params }: { params: { slug: string } }) {\n  const post = await ____(params.slug);\n  if (!post) ____;\n  return (\n    <article>\n      <h1>{post.title}</h1>\n      <div dangerouslySetInnerHTML={{ __html: post.content }} />\n    </article>\n  );\n}',
    },
    tags: ['nextjs', 'server-components', 'app-router', 'seo', 'project'],
    concepts: ['next-server-vs-client', 'next-app-router', 'web-html-semantics'],
  },

  {
    id: 'proj-next-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_DEPLOYMENT,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: `Build a Theme Toggle with Next.js

Create a dark/light theme toggle for a Next.js app. You need:
1. A Client Component (ThemeToggle.tsx) that switches between light and dark mode
2. A layout.tsx that wraps children in a ThemeProvider (using next-themes)
3. Uses Tailwind CSS dark: classes for styling
4. Persists the user's preference

Show the layout file and the toggle component.`,
    starterCode: `// ==========================================
// app/layout.tsx
// ==========================================
import { ThemeProvider } from 'next-themes';

// TODO: Export default RootLayout function
// - Accept { children }: { children: React.ReactNode }
// - Return <html> with suppressHydrationWarning on the <html> tag
// - Wrap <body>'s children in <ThemeProvider>
//   with attribute="class" and defaultTheme="system"
// - suppressHydrationWarning prevents the mismatch warning
//   because the theme is read from localStorage on the client

// ==========================================
// components/ThemeToggle.tsx (Client Component)
// ==========================================
// TODO: Add 'use client' directive

// TODO: Import useTheme from 'next-themes'
// TODO: Import useState, useEffect from 'react'

// TODO: Export ThemeToggle component that:
// - Uses useTheme() to get { theme, setTheme, resolvedTheme }
// - Has a mounted state (useEffect to set mounted = true)
//   This prevents hydration mismatch — on server, we don't know the theme
// - If not mounted, render a placeholder button (same size, no icon)
// - Renders a button that toggles between light and dark
// - Shows a sun icon for dark mode, moon icon for light mode
//   (because clicking it switches TO that mode)
`,
    testCases: [
      {
        input: 'ThemeProvider setup',
        expectedOutput: 'ThemeProvider.*attribute.*class|ThemeProvider.*defaultTheme',
        description: 'Layout wraps children in ThemeProvider with correct props',
      },
      {
        input: 'Client component',
        expectedOutput: 'use client.*useTheme|useTheme.*setTheme',
        description: 'ThemeToggle is a client component using the useTheme hook',
      },
      {
        input: 'Hydration safety',
        expectedOutput: 'mounted|suppressHydrationWarning',
        description: 'Handles hydration mismatch with mounted check or suppressHydrationWarning',
      },
    ],
    solution: `// ==========================================
// app/layout.tsx
// ==========================================
import { ThemeProvider } from 'next-themes';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

// ==========================================
// components/ThemeToggle.tsx
// ==========================================
'use client';

import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700" />
    );
  }

  return (
    <button
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-700
                 flex items-center justify-center transition-colors"
      aria-label={\`Switch to \${resolvedTheme === 'dark' ? 'light' : 'dark'} mode\`}
    >
      {resolvedTheme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}`,
    explanation: `Key decisions:

1. **suppressHydrationWarning on <html>** — next-themes adds a class to <html> via a script that runs before React hydrates. This causes a hydration mismatch warning because the server-rendered HTML doesn't have the class. suppressHydrationWarning tells React to ignore this specific element's mismatch.

2. **attribute="class"** — This tells next-themes to set the theme by adding "dark" or "light" as a class on <html>. Tailwind's dark: variant checks for this class, so \`dark:bg-gray-900\` automatically works.

3. **Mounted check** — On the server, we don't know the user's theme preference (it's in localStorage/cookies). If we render theme-dependent UI during SSR, it will mismatch with the client. The mounted pattern renders a neutral placeholder on the server and swaps in the real toggle after hydration.

4. **resolvedTheme vs theme** — When defaultTheme="system", \`theme\` might be "system". \`resolvedTheme\` tells you the actual resolved value ("light" or "dark") based on the user's OS preference.

5. **Tailwind dark mode** — With \`darkMode: 'class'\` in tailwind.config, all \`dark:\` variants activate when the "dark" class is on <html>. No CSS-in-JS or style prop toggling needed.`,
    hints: [
      'suppressHydrationWarning goes on the <html> tag because next-themes modifies it before React hydrates',
      'Use resolvedTheme instead of theme — it resolves "system" to the actual value',
      'The mounted pattern prevents hydration mismatches for theme-dependent rendering',
    ],
    tieredHints: {
      apiSignature: 'useTheme(): { theme?: string; setTheme: (theme: string) => void; resolvedTheme?: string }',
      skeleton: '// app/layout.tsx\nexport default function RootLayout({ children }: { children: React.ReactNode }) {\n  return (\n    <html lang="en" ____>\n      <body>\n        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>\n          {children}\n        </ThemeProvider>\n      </body>\n    </html>\n  );\n}\n\n// components/ThemeToggle.tsx\n"use client";\nexport default function ThemeToggle() {\n  const { ____, setTheme } = useTheme();\n  const [mounted, setMounted] = useState(false);\n\n  useEffect(() => {\n    setMounted(true);\n  }, []);\n\n  if (!mounted) {\n    return ____;\n  }\n\n  return (\n    <button onClick={() => ____}>\n      Toggle\n    </button>\n  );\n}',
    },
    tags: ['nextjs', 'dark-mode', 'theming', 'client-component', 'project'],
    concepts: ['next-server-vs-client'],
  },

  {
    id: 'proj-next-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_DEPLOYMENT,
    course: Course.WEB_DEV,
    question: `You're building a marketing website with 50 blog posts. The content is written in a CMS and changes maybe once or twice a day. Which Next.js rendering strategy gives the best combination of performance and freshness?`,
    options: [
      {
        id: 'a',
        text: 'Fully dynamic — use "force-dynamic" or no-store on every page so each visitor gets the latest content from the CMS in real time.',
        isCorrect: false,
      },
      {
        id: 'b',
        text: 'Client-side fetching — use useEffect + fetch in a Client Component so the browser loads the content after page load.',
        isCorrect: false,
      },
      {
        id: 'c',
        text: 'Static generation with revalidation — generate pages at build time with generateStaticParams, add revalidate: 3600 so pages rebuild in the background hourly. Visitors always get a fast static page.',
        isCorrect: true,
      },
      {
        id: 'd',
        text: 'Static generation without revalidation — generate all pages at build time with generateStaticParams and never revalidate. Redeploy whenever content changes.',
        isCorrect: false,
      },
    ],
    explanation: `Static generation + revalidation (ISR) is the sweet spot here:

**Why static + revalidate?**
- Pages are pre-built as static HTML at build time — fastest possible response time (served from CDN edge)
- \`revalidate: 3600\` means after 1 hour, the next visitor triggers a background rebuild. They still get the cached page instantly, and the new version is ready for the next visitor
- 50 pages is small enough that generateStaticParams can pre-build all of them

**Why NOT fully dynamic?** Every request hits the origin server and the CMS API. For content that changes once a day, this is massive overkill and slower for users. You're paying for server time for no benefit.

**Why NOT client-side fetching?** Terrible for SEO — search engines see an empty page with a loading spinner. Marketing sites NEED good SEO. Also slower perceived performance (content loads after JavaScript).

**Why NOT static without revalidation?** Requires a full redeploy whenever content changes. For a marketing team updating blog posts, they'd need to trigger builds manually. Revalidation automates this — the site stays fresh without deploys.`,
    hints: [
      'Think about how often the content changes vs. how fast you need the page to load',
      'SEO is critical for a marketing site — how does each strategy affect crawlers?',
    ],
    tags: ['nextjs', 'rendering', 'isr', 'static-generation', 'project'],
    concepts: ['next-data-fetching'],
  },

  // =====================================================================
  // CHECKPOINT 4: After Forms + DB (Topic.NEXT_FORMS_VALIDATION) — 3 questions
  // =====================================================================

  {
    id: 'proj-forms-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.NEXT_FORMS_VALIDATION,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: `Build a Complete "Create Post" Feature

Build the full stack for creating a blog post in Next.js:
1. **schema.ts** — Zod schema: title (required, min 3 chars), content (required, min 10 chars), published (boolean, defaults to false)
2. **actions.ts** — Server Action that validates with safeParse, saves with Prisma, revalidates the posts page, returns success/error
3. **form.tsx** — Client Component with React Hook Form + zodResolver, shows field errors, disables submit while pending

Show all 3 files.`,
    starterCode: `// ==========================================
// lib/schemas/post.ts — Zod validation schema
// ==========================================
import { z } from 'zod';

// TODO: Export a postSchema with:
// - title: string, min 3 with custom message
// - content: string, min 10 with custom message
// - published: boolean, default false

// TODO: Export the inferred type: type PostInput = z.infer<typeof postSchema>

// ==========================================
// app/posts/actions.ts — Server Action
// ==========================================
'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
// TODO: Import schema and type

// TODO: Export async function createPost(data: PostInput)
// - Use postSchema.safeParse(data) to validate
// - If validation fails, return { success: false, errors: parsed.error.flatten().fieldErrors }
// - If valid, create post with prisma.post.create({ data: parsed.data })
// - Call revalidatePath('/posts')
// - Return { success: true, post }
// - Wrap in try-catch for DB errors

// ==========================================
// app/posts/new/page.tsx — Client Component form
// ==========================================
'use client';

// TODO: Import useForm from 'react-hook-form'
// TODO: Import zodResolver from '@hookform/resolvers/zod'
// TODO: Import schema, type, and action

// TODO: Export CreatePostForm component that:
// - Uses useForm<PostInput> with zodResolver(postSchema)
// - Has a submit handler that calls the server action
// - Renders a form with:
//   - Title input with error message from formState.errors.title
//   - Content textarea with error message from formState.errors.content
//   - Published checkbox
//   - Submit button disabled while formState.isSubmitting
// - Shows server-side errors if the action returns errors
// - Shows success message or redirects on success
`,
    testCases: [
      {
        input: 'Zod schema',
        expectedOutput: 'z\\.object.*z\\.string.*min.*3.*z\\.string.*min.*10|postSchema',
        description: 'Zod schema validates title (min 3) and content (min 10)',
      },
      {
        input: 'Server action with safeParse',
        expectedOutput: 'safeParse|revalidatePath|prisma\\.post\\.create',
        description: 'Server Action validates with safeParse and creates with Prisma',
      },
      {
        input: 'React Hook Form setup',
        expectedOutput: 'useForm.*zodResolver|register.*errors|formState',
        description: 'Form uses React Hook Form with zodResolver',
      },
    ],
    solution: `// ==========================================
// lib/schemas/post.ts
// ==========================================
import { z } from 'zod';

export const postSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  published: z.boolean().default(false),
});

export type PostInput = z.infer<typeof postSchema>;

// ==========================================
// app/posts/actions.ts
// ==========================================
'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { postSchema, PostInput } from '@/lib/schemas/post';

export async function createPost(data: PostInput) {
  const parsed = postSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false as const,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const post = await prisma.post.create({
      data: parsed.data,
    });

    revalidatePath('/posts');
    return { success: true as const, post };
  } catch (error) {
    return {
      success: false as const,
      errors: { title: ['Failed to create post. Please try again.'] },
    };
  }
}

// ==========================================
// app/posts/new/page.tsx
// ==========================================
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { postSchema, PostInput } from '@/lib/schemas/post';
import { createPost } from '../actions';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreatePostForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PostInput>({
    resolver: zodResolver(postSchema),
    defaultValues: { published: false },
  });

  async function onSubmit(data: PostInput) {
    setServerError(null);
    const result = await createPost(data);

    if (!result.success) {
      setServerError(result.errors?.title?.[0] || 'Something went wrong');
      return;
    }

    router.push('/posts');
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="title">Title</label>
        <input id="title" {...register('title')} className="w-full border p-2 rounded" />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
      </div>

      <div>
        <label htmlFor="content">Content</label>
        <textarea id="content" {...register('content')} rows={6} className="w-full border p-2 rounded" />
        {errors.content && <p className="text-red-500 text-sm">{errors.content.message}</p>}
      </div>

      <div className="flex items-center gap-2">
        <input id="published" type="checkbox" {...register('published')} />
        <label htmlFor="published">Publish immediately</label>
      </div>

      {serverError && <p className="text-red-500">{serverError}</p>}

      <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50">
        {isSubmitting ? 'Creating...' : 'Create Post'}
      </button>
    </form>
  );
}`,
    explanation: `This demonstrates the modern Next.js full-stack pattern:

1. **Zod as single source of truth** — The schema defines validation rules once. The same schema is used by the server action (safeParse) AND the client form (zodResolver). No duplicate validation logic. The inferred type PostInput ensures type safety across the boundary.

2. **Server Action with safeParse** — \`safeParse\` returns a result object instead of throwing. This lets us return structured errors to the client. \`flatten().fieldErrors\` gives us a { fieldName: string[] } map that's easy to display in the form.

3. **revalidatePath** — After creating a post, we revalidate '/posts' so the posts list page shows the new post immediately. Without this, the cached page would show stale data.

4. **React Hook Form + zodResolver** — RHF handles form state, validation timing (on blur, on submit), and the isSubmitting state. zodResolver connects Zod validation to RHF's error system. Client-side validation runs before the form even submits, giving instant feedback.

5. **Two layers of validation** — Client-side (zodResolver) gives instant UX feedback. Server-side (safeParse) is the security boundary — never trust the client. Both use the same Zod schema.`,
    hints: [
      'z.infer<typeof schema> extracts the TypeScript type from a Zod schema',
      'safeParse returns { success: boolean, data?, error? } instead of throwing',
      'zodResolver connects your Zod schema to React Hook Form\'s validation system',
    ],
    tieredHints: {
      apiSignature: 'z.object(shape): ZodObject; schema.safeParse(data): SafeParseReturnType; zodResolver(schema): Resolver; revalidatePath(path): void',
      skeleton: '// lib/schemas/post.ts\nexport const postSchema = z.object({\n  title: z.string().min(3, "Title must be at least 3 characters"),\n  content: z.string().min(10, "Content must be at least 10 characters"),\n  published: z.boolean().default(false),\n});\n\n// app/posts/actions.ts\n"use server";\nexport async function createPost(data: PostInput) {\n  const parsed = ____;\n\n  if (!parsed.success) {\n    return {\n      success: false as const,\n      errors: ____,\n    };\n  }\n\n  const post = await prisma.post.create({ data: parsed.data });\n  ____;\n  return { success: true as const, post };\n}\n\n// app/posts/new/page.tsx\n"use client";\nexport default function CreatePostForm() {\n  const { register, handleSubmit } = useForm<PostInput>({\n    resolver: ____,\n    defaultValues: { published: false },\n  });\n  return <form onSubmit={handleSubmit(onSubmit)} />;\n}',
    },
    tags: ['zod', 'server-actions', 'prisma', 'react-hook-form', 'project'],
    concepts: ['forms-zod-schema', 'next-server-actions', 'prisma-schema-relations', 'forms-rhf-controller'],
  },

  {
    id: 'proj-forms-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.NEXT_FORMS_VALIDATION,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: `Build an Edit Form That Loads Existing Data

Create an edit post page in Next.js that:
1. **page.tsx** (Server Component) — Fetches the post by ID from Prisma, handles "not found", passes the post as defaultValues to a Client Component form
2. **EditForm.tsx** (Client Component) — Pre-populated form using React Hook Form with the existing post data, calls an update Server Action on submit

Show both files. The route is app/posts/[id]/edit/page.tsx.`,
    starterCode: `// ==========================================
// app/posts/[id]/edit/page.tsx — Server Component
// ==========================================
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import EditForm from './EditForm';

// TODO: Export default async function EditPostPage
// - Receive { params }: { params: { id: string } }
// - Fetch the post: prisma.post.findUnique({ where: { id: params.id } })
// - If post is null, call notFound()
// - Render <EditForm post={post} />
// - The Server Component does the data fetching, the Client Component
//   handles the interactive form

// ==========================================
// app/posts/[id]/edit/EditForm.tsx — Client Component
// ==========================================
'use client';

// TODO: Import useForm, zodResolver, schema, and the update action
// TODO: Define the Post type (or import it)

// TODO: Create a Props interface: { post: Post }

// TODO: Export EditForm component that:
// - Receives the post as a prop
// - Uses useForm with defaultValues from the post prop:
//   { title: post.title, content: post.content, published: post.published }
// - Has a submit handler that calls updatePost(post.id, data)
// - Renders form fields pre-populated with existing data
// - Shows "Saving..." while submitting
// - Redirects to /posts/{id} on success
`,
    testCases: [
      {
        input: 'Server Component fetching',
        expectedOutput: 'prisma\\.post\\.findUnique|notFound\\(\\)',
        description: 'Server Component fetches post by ID and handles not found',
      },
      {
        input: 'Default values from props',
        expectedOutput: 'defaultValues.*post\\.title|defaultValues.*post',
        description: 'Form is initialized with defaultValues from the server-fetched post',
      },
      {
        input: 'Update action call',
        expectedOutput: 'updatePost.*post\\.id|update.*id',
        description: 'Submit handler calls update action with the post ID',
      },
    ],
    solution: `// ==========================================
// app/posts/[id]/edit/page.tsx
// ==========================================
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import EditForm from './EditForm';

export default async function EditPostPage({
  params,
}: {
  params: { id: string };
}) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
  });

  if (!post) notFound();

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Post</h1>
      <EditForm post={post} />
    </main>
  );
}

// ==========================================
// app/posts/[id]/edit/EditForm.tsx
// ==========================================
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { postSchema, PostInput } from '@/lib/schemas/post';
import { updatePost } from '../../actions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface Post {
  id: string;
  title: string;
  content: string;
  published: boolean;
}

interface EditFormProps {
  post: Post;
}

export default function EditForm({ post }: EditFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<PostInput>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: post.title,
      content: post.content,
      published: post.published,
    },
  });

  async function onSubmit(data: PostInput) {
    setServerError(null);
    const result = await updatePost(post.id, data);

    if (!result.success) {
      setServerError('Failed to update post. Please try again.');
      return;
    }

    router.push(\`/posts/\${post.id}\`);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="title">Title</label>
        <input id="title" {...register('title')} className="w-full border p-2 rounded" />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
      </div>

      <div>
        <label htmlFor="content">Content</label>
        <textarea id="content" {...register('content')} rows={8} className="w-full border p-2 rounded" />
        {errors.content && <p className="text-red-500 text-sm">{errors.content.message}</p>}
      </div>

      <div className="flex items-center gap-2">
        <input id="published" type="checkbox" {...register('published')} />
        <label htmlFor="published">Published</label>
      </div>

      {serverError && <p className="text-red-500">{serverError}</p>}

      <button
        type="submit"
        disabled={isSubmitting || !isDirty}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {isSubmitting ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
}`,
    explanation: `This pattern separates data fetching from interaction:

1. **Server Component for data fetching** — The page.tsx is a Server Component that fetches the post with Prisma directly (no API route needed). It runs on the server, so database access is secure and fast. The data is passed as props to the Client Component.

2. **notFound() for missing data** — Calling notFound() renders the nearest not-found.tsx boundary. This is cleaner than conditional rendering and returns a proper 404 status code for SEO.

3. **Client Component for interactivity** — EditForm is a Client Component because forms need event handlers, state, and browser APIs. It receives the pre-fetched data as props.

4. **defaultValues from server data** — React Hook Form's defaultValues pre-populates the form fields. The isDirty flag tracks whether the user has modified anything, so we can disable the submit button until they actually change something.

5. **Server/Client boundary** — This is the key Next.js pattern: Server Components fetch data, Client Components handle interaction. Data flows down as props across the boundary. This gives you the best of both worlds — secure data access and rich interactivity.`,
    hints: [
      'The Server Component fetches data; the Client Component handles the form interaction',
      'defaultValues in useForm pre-populates fields — the user sees existing data immediately',
      'isDirty tracks whether the user has changed anything from the default values',
    ],
    tieredHints: {
      apiSignature: 'prisma.model.findUnique({ where }): Promise<Model | null>; useForm({ resolver, defaultValues }): UseFormReturn',
      skeleton: '// app/posts/[id]/edit/page.tsx\nexport default async function EditPostPage({ params }: { params: { id: string } }) {\n  const post = await ____(____);\n  if (!post) ____;\n  return <EditForm post={post} />;\n}\n\n// app/posts/[id]/edit/EditForm.tsx\n"use client";\nexport default function EditForm({ post }: EditFormProps) {\n  const { register, handleSubmit, formState: { isDirty } } = useForm<PostInput>({\n    resolver: ____,\n    defaultValues: ____,\n  });\n\n  async function onSubmit(data: PostInput) {\n    const result = await updatePost(post.id, data);\n    if (!result.success) return;\n    router.push("/posts/" + post.id);\n  }\n\n  return (\n    <form onSubmit={handleSubmit(onSubmit)}>\n      <button type="submit" disabled={____}>Save Changes</button>\n    </form>\n  );\n}',
    },
    tags: ['nextjs', 'forms', 'prisma', 'server-client-boundary', 'project'],
    concepts: ['web-html-forms-a11y', 'prisma-schema-relations'],
  },

  {
    id: 'proj-forms-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_FORMS_VALIDATION,
    course: Course.WEB_DEV,
    question: `A user submits a "Create Post" form. The post is created successfully in the database, but when the user navigates to the posts list page, they still see the old data without the new post. After a manual browser refresh, the new post appears. What's the issue and fix?`,
    options: [
      {
        id: 'a',
        text: 'The form is missing e.preventDefault() — the browser is doing a full page navigation before the Server Action completes.',
        isCorrect: false,
      },
      {
        id: 'b',
        text: 'Need to call revalidatePath(\'/posts\') in the Server Action after the database mutation — without it, Next.js serves the cached version of the posts page with stale data.',
        isCorrect: true,
      },
      {
        id: 'c',
        text: 'The posts page needs to use "force-dynamic" to disable caching entirely, so it always fetches fresh data from the database.',
        isCorrect: false,
      },
      {
        id: 'd',
        text: 'Need to add a timestamp query parameter to the posts page URL (/posts?t=Date.now()) to bust the browser cache.',
        isCorrect: false,
      },
    ],
    explanation: `The issue is that Next.js caches Server Component renders. After a mutation, you need to tell Next.js to invalidate the cache.

**revalidatePath('/posts')** tells the Next.js cache that the /posts page is stale. The next time someone visits /posts, it will re-render the Server Component with fresh data from the database.

**Why NOT force-dynamic?** It works but is a sledgehammer — it disables caching for the ENTIRE page on EVERY request. You'd lose the performance benefits of caching for all visitors, not just after mutations. revalidatePath is surgical — it invalidates only when needed.

**Why NOT query parameter cache busting?** This is a browser HTTP cache technique. The issue isn't browser caching — it's Next.js's server-side data cache. The cached HTML on the server is stale.

**Why NOT e.preventDefault()?** React Hook Form's handleSubmit already prevents default form submission. The form is submitting correctly — the issue is what happens AFTER the mutation succeeds.

You can also use \`revalidateTag('posts')\` for more granular control if your fetch calls use \`{ next: { tags: ['posts'] } }\`.`,
    hints: [
      'The post IS created in the database — the issue is what the user sees after creation',
      'Next.js caches Server Component output — after a mutation, something needs to tell it the cache is stale',
    ],
    tags: ['nextjs', 'revalidation', 'caching', 'server-actions', 'project'],
    concepts: ['next-server-actions', 'next-data-fetching'],
  },

  // =====================================================================
  // CHECKPOINT 5: After Advanced Patterns (Topic.NEXT_URL_STATE) — 3 questions
  // =====================================================================

  {
    id: 'proj-url-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.NEXT_URL_STATE,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: `Build a Searchable, Filterable Product Page

Create a product listing page that stores all filter state in the URL:
1. **Server Component page** — reads searchParams for "q" (search query), "category", "sort", and "page"
2. **Client Component FilterBar** — updates the URL using useRouter + useSearchParams when the user changes filters
3. The page should work with direct URL access (shareable links) and browser back/forward

Show both the Server Component page and the Client Component FilterBar.`,
    starterCode: `// ==========================================
// app/products/page.tsx — Server Component
// ==========================================

// TODO: Define the searchParams type
// In Next.js App Router, page components receive searchParams as a prop

// TODO: Export default async function ProductsPage
// - Receive { searchParams } prop
// - Extract q, category, sort (default: 'newest'), page (default: '1')
// - Fetch products from API or DB using these filters
// - Render <FilterBar /> (Client Component) with current filter values
// - Render the product grid
// - Render pagination controls

// ==========================================
// components/FilterBar.tsx — Client Component
// ==========================================
'use client';

// TODO: Import useRouter, useSearchParams, useCallback from appropriate packages

// TODO: Export FilterBar component that:
// - Uses useSearchParams() to read current URL params
// - Uses useRouter() to push new URLs
// - Has a helper function updateParams(key, value) that:
//   1. Creates a new URLSearchParams from current params
//   2. Sets or deletes the param
//   3. Resets page to 1 when filters change
//   4. Calls router.push with the new query string
// - Renders:
//   - Search input (updates 'q' param, consider debouncing)
//   - Category dropdown (updates 'category' param)
//   - Sort dropdown (updates 'sort' param)
// - All inputs reflect the current URL state (controlled components)
`,
    testCases: [
      {
        input: 'Server reads searchParams',
        expectedOutput: 'searchParams.*\\bq\\b|searchParams.*category|searchParams.*sort',
        description: 'Server Component reads filter values from searchParams',
      },
      {
        input: 'URL update logic',
        expectedOutput: 'URLSearchParams|router\\.push|router\\.replace|useSearchParams',
        description: 'FilterBar updates URL with new search params using router',
      },
      {
        input: 'Reset page on filter change',
        expectedOutput: 'delete.*page|set.*page.*1|page.*1',
        description: 'Resets pagination to page 1 when filters change',
      },
    ],
    solution: `// ==========================================
// app/products/page.tsx
// ==========================================
import FilterBar from '@/components/FilterBar';

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
}

interface PageProps {
  searchParams: {
    q?: string;
    category?: string;
    sort?: string;
    page?: string;
  };
}

async function getProducts(params: PageProps['searchParams']): Promise<{
  products: Product[];
  totalPages: number;
}> {
  const query = new URLSearchParams();
  if (params.q) query.set('q', params.q);
  if (params.category) query.set('category', params.category);
  query.set('sort', params.sort || 'newest');
  query.set('page', params.page || '1');

  const res = await fetch(\`https://api.example.com/products?\${query}\`, {
    next: { revalidate: 60 },
  });
  return res.json();
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const { products, totalPages } = await getProducts(searchParams);
  const currentPage = parseInt(searchParams.page || '1');

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Products</h1>

      <FilterBar />

      <div className="grid grid-cols-3 gap-4 mt-6">
        {products.map((product) => (
          <div key={product.id} className="border rounded p-4">
            <h3 className="font-semibold">{product.name}</h3>
            <p className="text-gray-600">{product.category}</p>
            <p className="text-lg font-bold">\${product.price}</p>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <p className="text-gray-500 text-center py-12">No products found</p>
      )}

      <div className="flex gap-2 mt-6 justify-center">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <a
            key={page}
            href={\`?page=\${page}\`}
            className={\`px-3 py-1 rounded \${page === currentPage ? 'bg-blue-600 text-white' : 'bg-gray-200'}\`}
          >
            {page}
          </a>
        ))}
      </div>
    </main>
  );
}

// ==========================================
// components/FilterBar.tsx
// ==========================================
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState, useEffect } from 'react';

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Home', 'Books'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name', label: 'Name A-Z' },
];

export default function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get('q') || '');

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== 'All') {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      // Reset to page 1 when filters change
      if (key !== 'page') {
        params.delete('page');
      }
      router.push(\`?\${params.toString()}\`);
    },
    [searchParams, router]
  );

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      const currentQ = searchParams.get('q') || '';
      if (searchInput !== currentQ) {
        updateParams('q', searchInput);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, searchParams, updateParams]);

  return (
    <div className="flex gap-4 items-center flex-wrap">
      <input
        type="text"
        placeholder="Search products..."
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        className="border rounded px-3 py-2 w-64"
      />

      <select
        value={searchParams.get('category') || 'All'}
        onChange={(e) => updateParams('category', e.target.value)}
        className="border rounded px-3 py-2"
      >
        {CATEGORIES.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      <select
        value={searchParams.get('sort') || 'newest'}
        onChange={(e) => updateParams('sort', e.target.value)}
        className="border rounded px-3 py-2"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}`,
    explanation: `This pattern makes filter state shareable and bookmarkable:

1. **URL as single source of truth** — All filter state lives in the URL search params. This means: links are shareable ("here are products filtered by Electronics"), browser back/forward works naturally, and bookmarks preserve the exact view.

2. **Server Component reads, Client Component writes** — The page (Server Component) reads searchParams and fetches matching data on the server. The FilterBar (Client Component) writes new params to the URL. This is a clean separation.

3. **router.push vs router.replace** — push adds to browser history (back button works), replace doesn't. For search-as-you-type, you might prefer replace to avoid flooding the history.

4. **Page reset on filter change** — When a user changes category, they should go back to page 1, not stay on page 5 of the old results. Deleting the page param accomplishes this.

5. **Debounced search** — The search input debounces URL updates to avoid triggering a server re-render on every keystroke. Category and sort update immediately since they're select elements (single change event).`,
    hints: [
      'new URLSearchParams(searchParams.toString()) creates a mutable copy of current params',
      'router.push with just a query string (?key=value) keeps the current path',
      'Delete the "page" param when other filters change to reset pagination',
    ],
    tieredHints: {
      apiSignature: 'useSearchParams(): ReadonlyURLSearchParams; useRouter(): AppRouterInstance; URLSearchParams.prototype.set(name, value): void',
      skeleton: '// components/FilterBar.tsx\n"use client";\nimport { useRouter, useSearchParams } from "next/navigation";\n\nexport default function FilterBar() {\n  const router = useRouter();\n  const searchParams = useSearchParams();\n\n  const updateParams = useCallback(\n    (key: string, value: string) => {\n      const params = ____;\n      if (value && value !== "All") {\n        params.set(key, value);\n      } else {\n        params.delete(key);\n      }\n      if (key !== "page") {\n        ____;\n      }\n      ____;\n    },\n    [searchParams, router]\n  );\n  return <div />;\n}',
    },
    tags: ['nextjs', 'url-state', 'searchParams', 'filters', 'project'],
    concepts: ['next-url-state'],
  },

  {
    id: 'proj-url-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.NEXT_URL_STATE,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: `Build an Infinite Scroll Feed

Create an infinite scroll component using TanStack Query (React Query) and Intersection Observer:
1. useInfiniteQuery to fetch paginated data with cursor-based pagination
2. getNextPageParam to determine the next cursor from the API response
3. An Intersection Observer on a "sentinel" div at the bottom of the list that triggers fetchNextPage when visible

The API returns: { items: Post[], nextCursor: string | null }`,
    starterCode: `'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useRef, useEffect } from 'react';

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
}

interface FeedResponse {
  items: Post[];
  nextCursor: string | null;
}

// TODO: Create an async function fetchFeed(cursor?: string)
// - Builds URL: '/api/feed' + '?cursor=' + cursor if cursor exists
// - Fetches and returns the JSON as FeedResponse

// TODO: Export InfiniteFeed component that:
// 1. Uses useInfiniteQuery with:
//    - queryKey: ['feed']
//    - queryFn: receives { pageParam } — call fetchFeed(pageParam)
//    - getNextPageParam: return lastPage.nextCursor (or undefined to stop)
//    - initialPageParam: undefined (first page has no cursor)
//
// 2. Creates a ref for the sentinel div (useRef<HTMLDivElement>)
//
// 3. Sets up an IntersectionObserver in useEffect that:
//    - Observes the sentinel div
//    - When it's intersecting AND hasNextPage AND !isFetchingNextPage:
//      calls fetchNextPage()
//    - Cleans up the observer on unmount
//
// 4. Renders:
//    - All posts from data.pages.flatMap(page => page.items)
//    - A sentinel <div ref={sentinelRef}> at the bottom
//    - Loading state for initial load
//    - "Loading more..." text when fetching next page
//    - "No more posts" when !hasNextPage

export default function InfiniteFeed() {
  // Your code here
}
`,
    testCases: [
      {
        input: 'useInfiniteQuery setup',
        expectedOutput: 'useInfiniteQuery.*getNextPageParam|nextCursor|pageParam',
        description: 'Uses useInfiniteQuery with cursor-based pagination',
      },
      {
        input: 'IntersectionObserver',
        expectedOutput: 'IntersectionObserver.*isIntersecting|observe.*sentinel|intersect',
        description: 'Sets up IntersectionObserver to detect when scroll sentinel is visible',
      },
      {
        input: 'Flattening pages',
        expectedOutput: 'pages.*flatMap|pages.*map.*items',
        description: 'Flattens all pages into a single list for rendering',
      },
    ],
    solution: `'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useRef, useEffect } from 'react';

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
}

interface FeedResponse {
  items: Post[];
  nextCursor: string | null;
}

async function fetchFeed(cursor?: string): Promise<FeedResponse> {
  const url = cursor ? \`/api/feed?cursor=\${cursor}\` : '/api/feed';
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch feed');
  return res.json();
}

export default function InfiniteFeed() {
  const sentinelRef = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ['feed'],
    queryFn: ({ pageParam }) => fetchFeed(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    initialPageParam: undefined as string | undefined,
  });

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return <div className="text-center py-12">Loading feed...</div>;
  }

  if (isError) {
    return <div className="text-red-500 text-center py-12">Error: {error.message}</div>;
  }

  const allPosts = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <div className="max-w-2xl mx-auto">
      {allPosts.map((post) => (
        <article key={post.id} className="border-b py-6">
          <h2 className="text-xl font-bold">{post.title}</h2>
          <p className="text-gray-600 text-sm mt-1">
            {post.author} · {new Date(post.createdAt).toLocaleDateString()}
          </p>
          <p className="mt-2">{post.content}</p>
        </article>
      ))}

      {/* Sentinel div — triggers next page fetch when visible */}
      <div ref={sentinelRef} className="h-10" />

      {isFetchingNextPage && (
        <p className="text-center py-4 text-gray-500">Loading more...</p>
      )}

      {!hasNextPage && allPosts.length > 0 && (
        <p className="text-center py-4 text-gray-400">No more posts</p>
      )}
    </div>
  );
}`,
    explanation: `This combines two powerful APIs:

1. **useInfiniteQuery** — Manages paginated data as an array of "pages." Each page is one API response. getNextPageParam extracts the cursor from the last response; if it returns undefined, hasNextPage becomes false and pagination stops. TanStack Query handles caching, deduplication, and refetching automatically.

2. **Cursor-based pagination** — Better than offset-based (page numbers) because it doesn't break when new items are added. If item 51 is inserted while the user is on "page 5," offset-based pagination shows duplicates. Cursor-based says "give me items after this specific item" — always consistent.

3. **IntersectionObserver** — The browser API that detects when an element enters the viewport. We observe a "sentinel" div at the bottom of the list. When it becomes visible (user scrolled to the bottom), we fetch the next page. This is more performant than listening to scroll events.

4. **Guard conditions** — \`hasNextPage && !isFetchingNextPage\` prevents double-fetching. Without this, rapid scrolling could trigger multiple simultaneous fetches for the same page.

5. **flatMap for rendering** — \`data.pages.flatMap(page => page.items)\` collapses the nested array of pages into a flat list of posts for rendering. This is the standard pattern with useInfiniteQuery.`,
    hints: [
      'getNextPageParam should return undefined (not null) to signal no more pages',
      'The IntersectionObserver callback should check hasNextPage AND !isFetchingNextPage before fetching',
      'data.pages is an array of page responses — flatMap flattens them into a single array',
    ],
    tieredHints: {
      apiSignature: 'useInfiniteQuery({ queryKey, queryFn, getNextPageParam, initialPageParam }): UseInfiniteQueryResult; IntersectionObserver(callback, options): IntersectionObserver',
      skeleton: '"use client";\nimport { useInfiniteQuery } from "@tanstack/react-query";\nimport { useRef, useEffect } from "react";\n\nexport default function InfiniteFeed() {\n  const sentinelRef = useRef<HTMLDivElement>(null);\n  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({\n    queryKey: ["feed"],\n    queryFn: ({ pageParam }) => fetchFeed(pageParam),\n    getNextPageParam: (lastPage) => ____,\n    initialPageParam: ____,\n  });\n\n  useEffect(() => {\n    const sentinel = sentinelRef.current;\n    if (!sentinel) return;\n    const observer = new IntersectionObserver((entries) => {\n      if (____) {\n        ____;\n      }\n    });\n    observer.observe(sentinel);\n    return () => observer.disconnect();\n  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);\n\n  const allPosts = data?.pages.flatMap(____) ?? [];\n  return <div ref={sentinelRef} />;\n}',
    },
    tags: ['tanstack-query', 'infinite-scroll', 'intersection-observer', 'pagination', 'project'],
    concepts: ['next-tanstack-query', 'api-pagination'],
  },

  {
    id: 'proj-url-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.NEXT_URL_STATE,
    course: Course.WEB_DEV,
    question: `You have a dashboard page with 5 widget components, each fetching data from a different API endpoint. The page takes 3 seconds to load because the fetches happen sequentially — each widget waits for the previous one to finish. How do you fix this so widgets load independently?`,
    options: [
      {
        id: 'a',
        text: 'Use Promise.all to fetch all 5 endpoints in parallel, then pass the results as props to each widget. This runs concurrently but the page still waits for ALL to complete.',
        isCorrect: false,
      },
      {
        id: 'b',
        text: 'Convert all widgets to Client Components with useEffect + fetch. Each widget manages its own loading state independently.',
        isCorrect: false,
      },
      {
        id: 'c',
        text: 'Wrap each widget in its own <Suspense> boundary — each widget is an async Server Component that fetches independently. The page shell loads instantly, and each widget streams in as its data resolves.',
        isCorrect: true,
      },
      {
        id: 'd',
        text: 'Use React.lazy() to code-split each widget so they load their JavaScript bundles in parallel.',
        isCorrect: false,
      },
    ],
    explanation: `Suspense boundaries with streaming is the correct Next.js approach:

**How it works:** Each widget is an async Server Component wrapped in its own <Suspense fallback={<Skeleton />}>. When the page is requested:
1. The page shell (layout, headings, Suspense fallbacks) renders immediately
2. Each widget fetches its data independently on the server
3. As each widget's data resolves, its HTML streams to the browser and replaces the skeleton
4. Fast widgets appear first; slow widgets appear when ready

**Why NOT Promise.all?** It runs fetches concurrently but the page STILL waits for the slowest one. If 4 widgets take 200ms and 1 takes 3 seconds, the user sees nothing for 3 seconds. With Suspense, they see 4 widgets after 200ms.

**Why NOT Client Components with useEffect?** This moves all fetching to the browser. Users download JavaScript, execute it, THEN start 5 fetch requests. Slower overall and worse for SEO. Server Components fetch on the server (closer to the data) with zero client-side JavaScript.

**Why NOT React.lazy?** Code-splitting reduces bundle size but doesn't affect data fetching. The widgets aren't slow because of JavaScript size — they're slow because of data fetching.`,
    hints: [
      'The problem is sequential data fetching, not sequential rendering',
      'Think about what Next.js streaming with Suspense gives you over Promise.all',
    ],
    tags: ['nextjs', 'suspense', 'streaming', 'performance', 'project'],
    concepts: ['next-streaming-suspense'],
  },

  // =====================================================================
  // CHECKPOINT 6: Capstone (Topic.PATTERNS_ARCHITECTURAL) — 3 questions
  // =====================================================================

  {
    id: 'proj-capstone-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.PATTERNS_ARCHITECTURAL,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: `Design a Data Model for a Multi-User Task Management App

Create a Prisma schema for a task management app (like a simplified Linear/Jira). Design models for:
- **User** — name, email, avatar, membership in workspaces
- **Workspace** — name, slug, created by user, has many projects
- **Project** — name, description, belongs to workspace, has many tasks
- **Task** — title, description, status (enum), priority (enum), assignee, reporter, project, comments, due date
- **Comment** — content, author, task, timestamps

Include proper relations, indexes for common queries, enums for status/priority, and explain your architectural decisions.`,
    starterCode: `// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// TODO: Define enum TaskStatus (BACKLOG, TODO, IN_PROGRESS, IN_REVIEW, DONE, CANCELLED)

// TODO: Define enum TaskPriority (URGENT, HIGH, MEDIUM, LOW, NONE)

// TODO: Define enum WorkspaceRole (OWNER, ADMIN, MEMBER, VIEWER)

// TODO: Define User model
// - id, email (unique), name, avatarUrl (optional)
// - Relation to workspaces (many-to-many via WorkspaceMember)
// - Relation to assigned tasks, reported tasks, comments
// - createdAt, updatedAt

// TODO: Define Workspace model
// - id, name, slug (unique), description (optional)
// - Relation to members (via WorkspaceMember), projects
// - createdAt, updatedAt

// TODO: Define WorkspaceMember (join table for User-Workspace)
// - userId, workspaceId, role (WorkspaceRole)
// - Compound unique on [userId, workspaceId]
// - joinedAt timestamp

// TODO: Define Project model
// - id, name, description, key (e.g., "PROJ" for task numbering)
// - Belongs to workspace
// - Has many tasks
// - createdAt, updatedAt

// TODO: Define Task model
// - id, title, description (optional), taskNumber (auto-increment per project)
// - status (TaskStatus, default BACKLOG), priority (TaskPriority, default NONE)
// - assigneeId (optional), reporterId
// - projectId, dueDate (optional)
// - Has many comments
// - Indexes on: [projectId, status], [assigneeId], [reporterId]
// - createdAt, updatedAt

// TODO: Define Comment model
// - id, content, authorId, taskId
// - createdAt, updatedAt
`,
    testCases: [
      {
        input: 'Enums defined',
        expectedOutput: 'enum TaskStatus|BACKLOG|IN_PROGRESS|enum TaskPriority|URGENT',
        description: 'Defines TaskStatus and TaskPriority enums',
      },
      {
        input: 'Relations',
        expectedOutput: 'relation.*fields.*references|@relation',
        description: 'Models have proper Prisma relations defined',
      },
      {
        input: 'Indexes',
        expectedOutput: '@@index|@@unique|@unique',
        description: 'Includes indexes for common query patterns',
      },
    ],
    solution: `// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum TaskStatus {
  BACKLOG
  TODO
  IN_PROGRESS
  IN_REVIEW
  DONE
  CANCELLED
}

enum TaskPriority {
  URGENT
  HIGH
  MEDIUM
  LOW
  NONE
}

enum WorkspaceRole {
  OWNER
  ADMIN
  MEMBER
  VIEWER
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  avatarUrl String?

  memberships    WorkspaceMember[]
  assignedTasks  Task[]    @relation("TaskAssignee")
  reportedTasks  Task[]    @relation("TaskReporter")
  comments       Comment[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}

model Workspace {
  id          String  @id @default(cuid())
  name        String
  slug        String  @unique
  description String?

  members  WorkspaceMember[]
  projects Project[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("workspaces")
}

model WorkspaceMember {
  id          String        @id @default(cuid())
  userId      String
  workspaceId String
  role        WorkspaceRole @default(MEMBER)

  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  workspace Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)

  joinedAt DateTime @default(now())

  @@unique([userId, workspaceId])
  @@index([workspaceId])
  @@map("workspace_members")
}

model Project {
  id          String @id @default(cuid())
  name        String
  description String?
  key         String // e.g., "PROJ" for task numbering like PROJ-123

  workspaceId String
  workspace   Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)

  tasks Task[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([workspaceId, key])
  @@index([workspaceId])
  @@map("projects")
}

model Task {
  id          String       @id @default(cuid())
  title       String
  description String?
  taskNumber  Int          // Sequential within project (PROJ-1, PROJ-2, ...)
  status      TaskStatus   @default(BACKLOG)
  priority    TaskPriority @default(NONE)
  dueDate     DateTime?

  projectId  String
  project    Project @relation(fields: [projectId], references: [id], onDelete: Cascade)

  assigneeId String?
  assignee   User?   @relation("TaskAssignee", fields: [assigneeId], references: [id], onDelete: SetNull)

  reporterId String
  reporter   User    @relation("TaskReporter", fields: [reporterId], references: [id], onDelete: Restrict)

  comments Comment[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([projectId, taskNumber])
  @@index([projectId, status])
  @@index([assigneeId])
  @@index([reporterId])
  @@index([status])
  @@index([dueDate])
  @@map("tasks")
}

model Comment {
  id      String @id @default(cuid())
  content String

  authorId String
  author   User   @relation(fields: [authorId], references: [id], onDelete: Cascade)

  taskId String
  task   Task   @relation(fields: [taskId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([taskId])
  @@map("comments")
}`,
    explanation: `Architectural decisions explained:

1. **Many-to-many via explicit join table (WorkspaceMember)** — Instead of Prisma's implicit many-to-many, we use an explicit WorkspaceMember model because we need to store the role. This is common in real apps — join tables almost always end up needing extra fields.

2. **Two User relations on Task (Assignee/Reporter)** — Tasks have both who reported it and who's working on it. Named relations (@relation("TaskAssignee")) disambiguate multiple relations to the same model.

3. **onDelete strategies** — Cascade for workspace->projects (delete workspace deletes everything). SetNull for task assignee (unassigning when user is removed). Restrict for task reporter (can't delete a user who reported tasks — handle this in app logic first).

4. **Composite indexes** — @@index([projectId, status]) optimizes the most common query: "show me all TODO tasks in project X." Without this index, the database would scan every task in the project. @@unique([projectId, taskNumber]) ensures task numbers are unique within a project.

5. **CUID for IDs** — CUIDs are collision-resistant, sortable by creation time, and don't leak information (unlike sequential integers that reveal how many records exist).

6. **@@map for table names** — Maps PascalCase model names to snake_case table names, following PostgreSQL conventions.`,
    hints: [
      'Use an explicit join table (WorkspaceMember) instead of implicit many-to-many when you need extra fields like role',
      'Named relations like @relation("TaskAssignee") disambiguate when a model has multiple relations to the same target',
      'Composite indexes should match your most common WHERE clause combinations',
    ],
    tieredHints: {
      apiSignature: 'model ModelName { field Type @relation(fields: [f], references: [r], onDelete: Strategy); @@unique([f1, f2]); @@index([f1, f2]); }',
      skeleton: 'model WorkspaceMember {\n  id          String        @id @default(cuid())\n  userId      String\n  workspaceId String\n  role        WorkspaceRole @default(MEMBER)\n\n  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  workspace Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)\n\n  ____\n}\n\nmodel Task {\n  id         String @id @default(cuid())\n  projectId  String\n  project    Project @relation(fields: [projectId], references: [id], onDelete: Cascade)\n\n  assigneeId String?\n  assignee   User?   @relation("TaskAssignee", fields: [assigneeId], references: [id], onDelete: SetNull)\n\n  reporterId String\n  reporter   User    @relation(____, fields: [reporterId], references: [id], onDelete: Restrict)\n\n  ____\n  ____\n}',
    },
    tags: ['prisma', 'database-design', 'schema', 'relations', 'project'],
    concepts: ['prisma-schema-relations', 'db-normalization'],
  },

  {
    id: 'proj-capstone-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.PATTERNS_ARCHITECTURAL,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: `Build a Protected Dashboard Layout

Create a Next.js layout that:
1. **layout.tsx** — Checks authentication with auth(), redirects to /login if not authenticated, renders a sidebar with user info and navigation, renders children in the main area
2. **loading.tsx** — Shows a skeleton layout while the dashboard loads
3. **error.tsx** — Client Component error boundary that shows a friendly error with a retry button

The auth() function is from your auth library (e.g., NextAuth) and returns a session with user info or null.`,
    starterCode: `// ==========================================
// app/dashboard/layout.tsx — Protected layout
// ==========================================
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import Link from 'next/link';

// TODO: Define navigation items array
// [{ href: '/dashboard', label: 'Overview', icon: '📊' }, ...]

// TODO: Export default async function DashboardLayout
// - Accept { children }: { children: React.ReactNode }
// - Call auth() to get the session
// - If no session, redirect('/login')
// - Render a two-column layout:
//   - Sidebar with:
//     - App name/logo
//     - User info (name, email, avatar)
//     - Navigation links using the nav items array
//     - Sign out button at the bottom
//   - Main content area that renders {children}

// ==========================================
// app/dashboard/loading.tsx — Loading skeleton
// ==========================================
// TODO: Export a skeleton that matches the layout structure
// - Sidebar placeholder with animated pulse
// - Main content area with card placeholders

// ==========================================
// app/dashboard/error.tsx — Error boundary
// ==========================================
'use client';

// TODO: Export default function DashboardError
// - Receive { error, reset }: { error: Error; reset: () => void }
// - Log the error for debugging
// - Render a user-friendly error message
// - Include a "Try again" button that calls reset()
// - Include a "Go home" link as fallback
`,
    testCases: [
      {
        input: 'Auth check and redirect',
        expectedOutput: 'auth\\(\\).*redirect.*login|session.*redirect',
        description: 'Checks authentication and redirects to login if not authenticated',
      },
      {
        input: 'Error boundary with reset',
        expectedOutput: 'use client.*error.*reset|reset\\(\\).*try again',
        description: 'Error boundary is a Client Component with reset functionality',
      },
      {
        input: 'Layout structure',
        expectedOutput: 'children|sidebar|nav|user.*name|user.*email',
        description: 'Layout renders sidebar with user info and children in main area',
      },
    ],
    solution: `// ==========================================
// app/dashboard/layout.tsx
// ==========================================
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import Link from 'next/link';

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: '📊' },
  { href: '/dashboard/projects', label: 'Projects', icon: '📁' },
  { href: '/dashboard/tasks', label: 'Tasks', icon: '✅' },
  { href: '/dashboard/team', label: 'Team', icon: '👥' },
  { href: '/dashboard/settings', label: 'Settings', icon: '⚙️' },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  const { user } = session;

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold">TaskFlow</h1>
        </div>

        {/* User info */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            {user.image && (
              <img
                src={user.image}
                alt={user.name || ''}
                className="w-8 h-8 rounded-full"
              />
            )}
            <div>
              <p className="font-medium text-sm">{user.name}</p>
              <p className="text-gray-400 text-xs">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg
                         text-gray-300 hover:bg-gray-800 hover:text-white
                         transition-colors"
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Sign out */}
        <div className="p-4 border-t border-gray-700">
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="w-full text-left text-gray-400 hover:text-white
                         transition-colors text-sm"
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
        {children}
      </main>
    </div>
  );
}

// ==========================================
// app/dashboard/loading.tsx
// ==========================================
export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="h-8 bg-gray-200 rounded w-1/4" />

      {/* Stats cards skeleton */}
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
            <div className="h-8 bg-gray-200 rounded w-3/4" />
          </div>
        ))}
      </div>

      {/* Content skeleton */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded w-full mb-3" />
        ))}
      </div>
    </div>
  );
}

// ==========================================
// app/dashboard/error.tsx
// ==========================================
'use client';

import { useEffect } from 'react';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Dashboard error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Something went wrong
      </h2>
      <p className="text-gray-600 mb-6 max-w-md">
        We encountered an unexpected error loading the dashboard.
        Please try again or contact support if the problem persists.
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => reset()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg
                     hover:bg-blue-700 transition-colors"
        >
          Try again
        </button>
        <a
          href="/"
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg
                     hover:bg-gray-300 transition-colors"
        >
          Go home
        </a>
      </div>
    </div>
  );
}`,
    explanation: `This layout establishes three critical patterns:

1. **Server-side auth guard** — auth() runs on the server in the layout. If the user isn't authenticated, redirect() sends them to /login before any dashboard content renders. This is more secure than client-side checks because the protected content never reaches the browser. The layout wraps ALL dashboard routes, so every child page is automatically protected.

2. **Layout persistence** — In Next.js, layouts don't re-render when navigating between child routes. The sidebar stays mounted and interactive while only the main content area (children) swaps out. This gives SPA-like navigation performance with server-side security.

3. **Error boundary with reset** — error.tsx must be a Client Component (it uses React's error boundary under the hood). The reset() function re-renders the segment that threw, giving users a retry mechanism without a full page reload. The error.digest provides a server-side error ID for debugging without exposing details to users.

4. **Loading skeleton matching layout** — loading.tsx shows a skeleton that matches the actual content structure. This prevents layout shift when the real content loads in. The skeleton is inside the layout, so the sidebar is already visible — only the content area shows the loading state.`,
    hints: [
      'auth() is async and runs on the server — await it before checking the session',
      'redirect() must be called outside of try-catch blocks in Server Components',
      'error.tsx must be a Client Component — add "use client" at the top',
    ],
    tieredHints: {
      apiSignature: 'auth(): Promise<Session | null>; redirect(url: string): never; ErrorBoundary({ error, reset }: { error: Error; reset: () => void })',
      skeleton: '// app/dashboard/layout.tsx\nexport default async function DashboardLayout({ children }: { children: React.ReactNode }) {\n  const session = await ____();\n\n  if (!____) {\n    ____("/login");\n  }\n\n  return (\n    <div className="flex h-screen">\n      <aside>{session.user.name}</aside>\n      <main>{children}</main>\n    </div>\n  );\n}\n\n// app/dashboard/error.tsx\n"use client";\nexport default function DashboardError({ error, reset }: { error: Error; reset: () => void }) {\n  return (\n    <div>\n      <button onClick={() => ____}>Try again</button>\n    </div>\n  );\n}',
    },
    tags: ['nextjs', 'authentication', 'layout', 'error-boundary', 'project'],
    concepts: ['web-security-auth-tokens', 'next-error-boundary'],
  },

  {
    id: 'proj-capstone-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.PATTERNS_ARCHITECTURAL,
    course: Course.WEB_DEV,
    question: `You're starting a new SaaS product — a project management tool. Your team has 3 developers, and you need to launch an MVP in 2 months. A senior engineer suggests starting with microservices: separate services for auth, projects, tasks, notifications, and billing. What's your response?`,
    options: [
      {
        id: 'a',
        text: 'Agree — microservices are industry best practice. Separate services mean each developer can work independently and deploy without affecting others.',
        isCorrect: false,
      },
      {
        id: 'b',
        text: 'Start with a modular monolith. 3 developers can\'t maintain 5+ services, their deployment pipelines, inter-service communication, distributed tracing, and data consistency. Build one well-structured app, deploy one thing, and extract services later ONLY when you hit a specific scaling bottleneck.',
        isCorrect: true,
      },
      {
        id: 'c',
        text: 'Compromise — start with 2 services: one for the core app and one for auth/billing. This gives separation of concerns without too many services.',
        isCorrect: false,
      },
      {
        id: 'd',
        text: 'Use a serverless architecture with individual Lambda functions for each API endpoint. This scales automatically and you only pay for what you use.',
        isCorrect: false,
      },
    ],
    explanation: `Always start with a monolith. This is one of the most important architectural lessons:

**Why a monolith for a 3-person team?**
- **Operational overhead** — Each microservice needs: its own repo (or monorepo config), CI/CD pipeline, deployment, monitoring, logging, health checks, and scaling config. With 5 services, you're maintaining 5x the infrastructure before writing any business logic.
- **Distributed systems are HARD** — Inter-service communication (REST? gRPC? message queues?), handling partial failures, distributed transactions, data consistency across services, service discovery... these are complex problems that don't exist in a monolith.
- **Developer velocity** — In a monolith, a feature that touches auth + tasks + notifications is one PR. In microservices, it's 3 coordinated PRs across 3 repos with careful API versioning.
- **You don't know your boundaries yet** — The whole point of microservices is to scale SPECIFIC parts independently. You don't know which parts will need independent scaling until you have real users and real traffic patterns.

**The right approach:** Build a modular monolith — well-organized code with clear module boundaries (auth/, projects/, tasks/, billing/). When (IF) you hit a scaling bottleneck, you can extract that specific module into a service. Most startups never reach that point.

**The #1 architecture mistake** is premature microservices. Companies like Segment, Istio, and countless others have publicly shared their painful migrations BACK to monoliths after starting with microservices too early.`,
    hints: [
      'Think about the ratio of infrastructure work to feature work for a 3-person team',
      'Consider what you DON\'T know yet about your traffic patterns at launch',
    ],
    tags: ['architecture', 'monolith', 'microservices', 'startup', 'project'],
    concepts: ['pattern-architectural'],
  },
];
