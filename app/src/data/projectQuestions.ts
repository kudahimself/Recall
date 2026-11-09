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

The HTML structure is already provided. You need to implement the functions the starter lists and the startup logic.`,
    starterCode: `// Get references to #todo-input, #add-btn, and #todo-list from the DOM.
// Implement loadTodos()/saveTodos(todos) around localStorage key 'todos' with JSON parse/stringify.
// createTodoElement(text, index) returns an <li> with the text plus a Delete <button>
//   carrying a data-index attribute.
// addTodo() reads trimmed input, appends a todo, saves, re-renders, clears the input.
// renderTodos() clears the list and appends an element per todo.
// Wire listeners: add-btn click, input Enter keydown, and event-delegated list click that
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
input.addEventListener('keydown', (e) => {
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
    requires: ['localStorage.getItem', 'localStorage.setItem', 'JSON.parse', 'JSON.stringify', /dataset\.index|getAttribute\(\s*["']data-index["']\s*\)/, /["']Enter["']/],
    explanation: `Key architectural decisions:

1. **Event delegation** - Instead of attaching a click listener to every delete button (which would need re-attaching on every render), we put one listener on the parent <ul>. When a click bubbles up, we check if it came from a button and read its data-index. This is more performant and works automatically for dynamically added elements.

2. **localStorage as source of truth** - loadTodos/saveTodos create a simple persistence layer. We always read from localStorage before modifying, which prevents stale state issues.

3. **Re-render pattern** - Rather than surgically updating the DOM, renderTodos() clears and rebuilds the list. For a small todo list this is fine and avoids complex DOM diffing logic. React does this same concept, but with a virtual DOM for performance.`,
    hints: [
      'localStorage.getItem returns null if the key doesn\'t exist - handle that case',
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
      <strong>\${p.name}</strong> - $\${p.price.toFixed(2)}
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
    requires: ['clearTimeout', 'setTimeout', '.filter(', 'toLowerCase', 'includes', /addEventListener\(\s*["']input["']/, /\b300\b/],
    explanation: `Key concepts demonstrated:

1. **Debounce pattern** - Without debounce, filtering runs on every keystroke. With debounce, it waits 300ms after the user stops typing. This matters for expensive operations like API calls. The trick is clearTimeout - each new keystroke cancels the previous timer.

2. **Array.filter()** - Non-mutating method that returns a new array with elements that pass the test. Combined with toLowerCase().includes() for case-insensitive substring matching.

3. **Template literals for rendering** - Using map() + join('') to build HTML strings is a common vanilla JS pattern. React replaces this with JSX, but understanding the underlying DOM manipulation helps you appreciate what React does for you.

4. **Separation of concerns** - filter, render, and debounce are independent functions. This makes each piece testable and reusable.`,
    hints: [
      'debounce needs a closure variable to hold the timer ID between calls',
      'clearTimeout cancels a pending setTimeout - call it before setting a new one',
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
        text: 'Use sequential await: const user = await fetchUser(); const orders = await fetchOrders(); const notifications = await fetchNotifications(); - simple and readable.',
        isCorrect: false,
      },
      {
        id: 'b',
        text: 'Use Promise.allSettled([fetchUser(), fetchOrders(), fetchNotifications()]) - it waits for all promises and gives you the result of each, even if some fail.',
        isCorrect: false,
      },
      {
        id: 'c',
        text: 'Use Promise.all([fetchUser(), fetchOrders(), fetchNotifications()]) - all three requests run concurrently, and it rejects immediately if any one fails, which matches the "show error if ANY fails" requirement.',
        isCorrect: true,
      },
      {
        id: 'd',
        text: 'Use Promise.race([fetchUser(), fetchOrders(), fetchNotifications()]) - it resolves as soon as the fastest request completes, which makes the UI feel snappier.',
        isCorrect: false,
      },
    ],
    explanation: `Promise.all is the right choice here because:

1. **Concurrent execution** - All 3 fetches start simultaneously. If each takes 500ms, total time is ~500ms instead of ~1500ms with sequential await.

2. **Fail-fast behavior** - If any promise rejects, Promise.all immediately rejects. This matches the requirement to "show error if ANY fails."

3. Why NOT sequential await? It works but is unnecessarily slow - the requests don't depend on each other, so there's no reason to wait for one before starting the next.

4. Why NOT Promise.allSettled? It never rejects - it always resolves with status objects. Useful when you want partial results (show what you can, even if some fail), but the requirement says to show an error if any fail.

5. Why NOT Promise.race? It resolves with the FIRST settled promise and ignores the rest. You'd only get one result.`,
    hints: [
      'Think about whether the 3 requests depend on each other',
      'Consider what happens when one of the requests fails',
    ],
    tags: ['promises', 'async', 'promise-all', 'api', 'project'],
    concepts: ['js-promises-async'],
  },

  // =====================================================================
  // CHECKPOINT 2: After TypeScript + React (Topic.TS_PROJECT) - 2 questions
  // =====================================================================

  {
    id: 'proj-ts-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.TS_PROJECT,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: `Build a Generic DataTable<T> Component\n\nCreate a fully typed, reusable DataTable component that works with any row type using TypeScript generics. The starter gives the component's signature: T is constrained to { id: string | number }, so every row has an id.\n\nDefine Column<T> with:\n- key: keyof T, so a column can only name a real property of T\n- header: string, the column's header text\n- render?: (item: T) => React.ReactNode, an optional custom cell renderer\n\nDefine DataTableProps<T> with:\n- data: T[], the rows to display\n- columns: Column<T>[]\n- onRowClick?: (item: T) => void, an optional row click handler\n\nThe component renders a <table>: a <thead> row with a <th> per column showing its header, and a <tbody> with a <tr> per item, keyed by item.id. Each <td> shows column.render(item) when the column has a render function, otherwise String(item[column.key]). Clicking a row calls onRowClick with that row's item, when onRowClick was given.`,
    starterCode: `import React from 'react';\n\n// Column<T>: key, header, optional render\ninterface Column<T> {\n  // TODO\n}\n\n// DataTableProps<T>: data, columns, optional onRowClick\ninterface DataTableProps<T> {\n  // TODO\n}\n\nfunction DataTable<T extends { id: string | number }>({\n  data,\n  columns,\n  onRowClick,\n}: DataTableProps<T>) {\n  return (\n    // TODO: the <table>\n    <table></table>\n  );\n}\n\nexport default DataTable;\n\n// Example usage (for reference):\n// <DataTable<User>\n//   data={users}\n//   columns={[\n//     { key: 'name', header: 'Name' },\n//     { key: 'role', header: 'Role', render: (user) => <Badge>{user.role}</Badge> },\n//   ]}\n//   onRowClick={(user) => navigate(\`/users/\${user.id}\`)}\n// />\n`,
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
    solution: `import React from 'react';\n\ninterface Column<T> {\n  key: keyof T;\n  header: string;\n  render?: (item: T) => React.ReactNode;\n}\n\ninterface DataTableProps<T> {\n  data: T[];\n  columns: Column<T>[];\n  onRowClick?: (item: T) => void;\n}\n\nfunction DataTable<T extends { id: string | number }>({\n  data,\n  columns,\n  onRowClick,\n}: DataTableProps<T>) {\n  return (\n    <table>\n      <thead>\n        <tr>\n          {columns.map((col) => (\n            <th key={String(col.key)}>{col.header}</th>\n          ))}\n        </tr>\n      </thead>\n      <tbody>\n        {data.map((item) => (\n          <tr key={item.id} onClick={() => onRowClick?.(item)}>\n            {columns.map((col) => (\n              <td key={String(col.key)}>\n                {col.render ? col.render(item) : String(item[col.key])}\n              </td>\n            ))}\n          </tr>\n        ))}\n      </tbody>\n    </table>\n  );\n}\n\nexport default DataTable;\n# OR\nimport React from 'react';\n\ninterface Column<T> {\n  key: keyof T;\n  header: string;\n  render?: (item: T) => React.ReactNode;\n}\n\ninterface DataTableProps<T> {\n  data: T[];\n  columns: Column<T>[];\n  onRowClick?: (item: T) => void;\n}\n\nfunction DataTable<T extends { id: string | number }>({\n  data,\n  columns,\n  onRowClick,\n}: DataTableProps<T>) {\n  return (\n    <table>\n      <thead>\n        <tr>\n          {columns.map((col) => (\n            <th key={String(col.key)}>{col.header}</th>\n          ))}\n        </tr>\n      </thead>\n      <tbody>\n        {data.map((item) => (\n          <tr key={item.id} onClick={onRowClick ? () => onRowClick(item) : undefined}>\n            {columns.map((col) => (\n              <td key={String(col.key)}>\n                {col.render ? col.render(item) : String(item[col.key])}\n              </td>\n            ))}\n          </tr>\n        ))}\n      </tbody>\n    </table>\n  );\n}\n\nexport default DataTable;`,
    requires: [/\bkey\s*:\s*keyof\s+T\b/, /\bheader\s*:\s*string/, /\brender\s*\?\s*:\s*\(\s*\w+\s*:\s*T\s*\)\s*=>/, /\bdata\s*:\s*(T\[\]|Array<T>)/, /\bcolumns\s*:\s*(Column<\s*T\s*>\[\]|Array<Column<\s*T\s*>>)/, /\bonRowClick\s*\?\s*:\s*\(\s*\w+\s*:\s*T\s*\)\s*=>\s*void/, /\.render\s*\(\s*\w+\s*\)/, /String\(\s*\w+\[\s*\w+\.key\s*\]\s*\)/, /key=\{\s*\w+\.id\s*\}/, /onRowClick\s*(\?\.)?\s*\(\s*\w+\s*\)/],
    explanation: 'Design decisions:\n\n1. **keyof T for the column key**: `key: keyof T` makes TypeScript reject a column that names a property the row type does not have, so `{ key: \'nmae\' }` is a compile error.\n\n2. **A generic component**: `function DataTable<T>(...)` works with any row type. Writing `<DataTable<User> ...>` (or letting TypeScript infer T from data) makes every column key and render function check against User.\n\n3. **T extends { id: string | number }**: React needs a stable key for each row, so the constraint guarantees `item.id` exists.\n\n4. **An optional render function**: the fallback `String(item[col.key])` handles plain values, while a render prop handles cells that need markup (badges, links, formatted dates); the table owns the structure and the caller owns the cell content.\n\n5. **Passing the item, not the event**: `onClick={onRowClick}` would hand the handler a mouse event; `() => onRowClick?.(item)` calls it with the row, and `?.` skips the call when no handler was given.',
    hints: ['keyof T is the union of T\'s property names', 'keyof T can include number and symbol keys, so wrap col.key in String() for the React key', 'Call onRowClick with the item, not the click event'],
    tieredHints: {
      apiSignature: 'interface Column<T> { key: keyof T; header: string; render?: (item: T) => React.ReactNode; }',
      skeleton: '<table>\n  <thead>\n    <tr>\n      {columns.map((col) => (\n        <th key={____}>{____}</th>\n      ))}\n    </tr>\n  </thead>\n  <tbody>\n    {data.map((item) => (\n      <tr key={____} onClick={____}>\n        {columns.map((col) => (\n          <td key={String(col.key)}>{____}</td>\n        ))}\n      </tr>\n    ))}\n  </tbody>\n</table>',
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
    question: `Build a useLocalStorage<T> Custom Hook\n\nWrite a typed React hook, exported as the default export, that works like useState but keeps its value in localStorage:\n\n1. Signature: useLocalStorage<T>(key: string, initialValue: T), returning [T, React.Dispatch<React.SetStateAction<T>>], the same tuple useState returns.\n2. Read the stored value once, in a lazy useState initializer: return initialValue when typeof window is "undefined" (on the server) or nothing is stored under key; otherwise JSON.parse the stored string, and fall back to initialValue if parsing throws.\n3. In a useEffect that depends on [key, value], write JSON.stringify(value) to localStorage under key, skipping it when window does not exist.\n4. Return [value, setValue].`,
    starterCode: `import { useState, useEffect } from 'react';\n\n// useLocalStorage<T>(key, initialValue)\n`,
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
    solution: `import { useState, useEffect } from 'react';\n\nfunction useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {\n  const [value, setValue] = useState<T>(() => {\n    if (typeof window === 'undefined') {\n      return initialValue;\n    }\n    try {\n      const stored = localStorage.getItem(key);\n      return stored ? (JSON.parse(stored) as T) : initialValue;\n    } catch {\n      return initialValue;\n    }\n  });\n\n  useEffect(() => {\n    if (typeof window === 'undefined') return;\n    localStorage.setItem(key, JSON.stringify(value));\n  }, [key, value]);\n\n  return [value, setValue];\n}\n\nexport default useLocalStorage;\n# OR\nimport { useState, useEffect, type Dispatch, type SetStateAction } from 'react';\n\nexport default function useLocalStorage<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {\n  const [value, setValue] = useState<T>(() => {\n    if (typeof window === 'undefined') return initialValue;\n    try {\n      const stored = localStorage.getItem(key);\n      return stored === null ? initialValue : JSON.parse(stored);\n    } catch {\n      return initialValue;\n    }\n  });\n\n  useEffect(() => {\n    if (typeof window !== 'undefined') {\n      localStorage.setItem(key, JSON.stringify(value));\n    }\n  }, [key, value]);\n\n  return [value, setValue];\n}`,
    requires: [/useLocalStorage\s*<\s*T\s*,?\s*>/, /\bkey\s*:\s*string\b/, /\binitialValue\s*:\s*T\b/, /useState\s*(<\s*T\s*>)?\s*\(\s*\(\s*\)\s*=>/, /typeof\s+window\s*[!=]==?\s*["\x27]undefined["\x27]/, /localStorage\.getItem\s*\(\s*key\s*\)/, /JSON\.parse/, /\bcatch\b/, /localStorage\.setItem\s*\(\s*key\s*,\s*JSON\.stringify\s*\(\s*value\s*\)\s*\)/, /\[\s*key\s*,\s*value\s*\]|\[\s*value\s*,\s*key\s*\]/, /export\s+default/],
    explanation: 'Key design decisions:\n\n1. **A lazy initializer**: `useState(() => ...)` runs its function only on the first render, so the synchronous localStorage read and the JSON.parse do not run again on every re-render.\n\n2. **The server check**: `typeof window === \'undefined\'` is true while a framework such as Next.js renders the component on the server, where localStorage does not exist, so the hook falls back to initialValue there. On a server-rendered page this means the server HTML shows initialValue while the browser\'s first render may read a stored value, which React reports as a hydration mismatch; when that matters, start from initialValue and read storage in an effect, or render the component only on the client.\n\n3. **try/catch around JSON.parse**: corrupted or hand-edited storage should not crash the app, so a parse error falls back to initialValue.\n\n4. **The return type**: `[T, React.Dispatch<React.SetStateAction<T>>]` is exactly what useState returns, so the hook is a drop-in replacement, and SetStateAction lets callers pass a value or an updater, `setValue(prev => ...)`.\n\n5. **The dependencies**: `[key, value]` writes again whenever the value changes, and also when the key changes, for a hook whose key is dynamic.',
    hints: ['useState can take a function as its initial value; it runs only on the first render', 'typeof window === "undefined" is the standard check for running on the server', 'Wrap JSON.parse in try/catch, so corrupted storage cannot crash the app'],
    tieredHints: {
      apiSignature: 'useState<T>(initialState: T | (() => T)): [T, Dispatch<SetStateAction<T>>]; useEffect(effect: EffectCallback, deps?: DependencyList): void',
      skeleton: 'function useLocalStorage<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {\n  const [value, setValue] = useState<T>(() => {\n    if (____) return initialValue;\n    try {\n      const stored = ____;\n      return ____;\n    } catch {\n      return ____;\n    }\n  });\n\n  useEffect(() => {\n    ____\n  }, [____]);\n\n  return [value, setValue];\n}',
    },
    tags: ['hooks', 'localstorage', 'generics', 'typescript', 'project'],
    concepts: ['js-dom-events', 'ts-generics'],
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
    question: 'Build a blog index and post pages with Server Components (Next.js 15 App Router). Show all three files; the Post type is in the starter and is imported from "@/types".\n\n1. app/blog/page.tsx\n   - Export a static metadata object: title "Blog", description "Latest articles"\n   - An async page that fetches https://api.example.com/posts (it returns { posts: Post[] }) with next: { revalidate: 3600 }\n   - Render <h1>Blog</h1> and a <ul> with one <li key={post.slug}> per post holding a next/link <Link> to /blog/{slug} with the post title, then a <p> with the excerpt\n\n2. app/blog/loading.tsx\n   - A default component that renders <p>Loading posts...</p> while the index loads\n\n3. app/blog/[slug]/page.tsx (params is a Promise in Next.js 15)\n   - Fetch https://api.example.com/posts/{slug} with the same revalidate; it answers 404 for an unknown slug\n   - The page calls notFound() when the response is not ok, otherwise renders an <article> with <h1>{post.title}</h1>, <p>By {post.author}</p> and <p>{post.content}</p>\n   - Export generateMetadata returning the post\'s title and its excerpt as the description, or { title: "Post not found" } when there is no post',
    starterCode: `// types.ts\nexport type Post = {\n  slug: string;\n  title: string;\n  excerpt: string;\n  content: string;\n  author: string;\n};\n\n// app/blog/page.tsx\n\n\n// app/blog/loading.tsx\n\n\n// app/blog/[slug]/page.tsx\n`,
    testCases: [
      {
        input: 'Blog index page',
        expectedOutput: 'export const metadata = { title: "Blog", ... }; export default async function BlogPage() { ... fetch(..., { next: { revalidate: 3600 } }) ... }',
        description: 'Blog index is an async Server Component with metadata and hourly revalidation',
      },
      {
        input: 'Dynamic route',
        expectedOutput: 'const { slug } = await params; ... if (!post) notFound();',
        description: 'Post page awaits params and calls notFound() for a missing post',
      },
      {
        input: 'Loading UI and metadata',
        expectedOutput: '<p>Loading posts...</p>; export async function generateMetadata({ params }) { ... }',
        description: 'loading.tsx streams a fallback and generateMetadata sets the post title',
      },
    ],
    solution: `// types.ts\nexport type Post = {\n  slug: string;\n  title: string;\n  excerpt: string;\n  content: string;\n  author: string;\n};\n\n// app/blog/page.tsx\nimport Link from "next/link";\nimport type { Metadata } from "next";\nimport type { Post } from "@/types";\n\nexport const metadata: Metadata = {\n  title: "Blog",\n  description: "Latest articles",\n};\n\nexport default async function BlogPage() {\n  const res = await fetch("https://api.example.com/posts", {\n    next: { revalidate: 3600 },\n  });\n  const { posts }: { posts: Post[] } = await res.json();\n\n  return (\n    <main>\n      <h1>Blog</h1>\n      <ul>\n        {posts.map((post) => (\n          <li key={post.slug}>\n            <Link href={\`/blog/\${post.slug}\`}>{post.title}</Link>\n            <p>{post.excerpt}</p>\n          </li>\n        ))}\n      </ul>\n    </main>\n  );\n}\n\n// app/blog/loading.tsx\nexport default function BlogLoading() {\n  return <p>Loading posts...</p>;\n}\n\n// app/blog/[slug]/page.tsx\nimport { notFound } from "next/navigation";\nimport type { Metadata } from "next";\nimport type { Post } from "@/types";\n\ntype Props = { params: Promise<{ slug: string }> };\n\nasync function getPost(slug: string): Promise<Post | null> {\n  const res = await fetch(\`https://api.example.com/posts/\${slug}\`, {\n    next: { revalidate: 3600 },\n  });\n  if (!res.ok) return null;\n  return res.json();\n}\n\nexport async function generateMetadata({ params }: Props): Promise<Metadata> {\n  const { slug } = await params;\n  const post = await getPost(slug);\n  if (!post) return { title: "Post not found" };\n  return { title: post.title, description: post.excerpt };\n}\n\nexport default async function PostPage({ params }: Props) {\n  const { slug } = await params;\n  const post = await getPost(slug);\n  if (!post) notFound();\n\n  return (\n    <article>\n      <h1>{post.title}</h1>\n      <p>By {post.author}</p>\n      <p>{post.content}</p>\n    </article>\n  );\n}`,
    requires: [/export\s+const\s+metadata/, /title\s*:\s*["']Blog["']/, /fetch\(\s*["'`]https:\/\/api\.example\.com\/posts["'`]/, /revalidate\s*:\s*3600/, /<Link\s+href=\{\s*(`\/blog\/\$\{\s*post\.slug\s*\}`|["']\/blog\/["']\s*\+\s*post\.slug)\s*\}/, /Loading posts\.\.\./, /await\s+params/, /api\.example\.com\/posts\/(\$\{\s*slug\s*\}|["']\s*\+\s*slug\b)/, /(\.ok\b|status\s*===?\s*404)/, /notFound\(\)/, /export\s+async\s+function\s+generateMetadata/, /Post not found/],
    explanation: 'Architecture notes:\n\n1. **Server Components by default**: both pages are async functions that fetch on the server. No useEffect, no loading state of their own, no fetch from the browser: the HTML arrives with the posts in it.\n\n2. **Streaming with loading.tsx**: Next.js wraps the route\'s page in a Suspense boundary with loading.tsx as the fallback, so visitors see "Loading posts..." at once while the index fetch is in flight.\n\n3. **ISR with revalidate**: next: { revalidate: 3600 } keeps each response for an hour. After that, the next visitor still gets the cached page while Next.js regenerates it in the background, and the visitor after that sees the new version.\n\n4. **Next.js 15 params**: params is a Promise, so the post page and generateMetadata both await it before reading slug; reading params.slug directly is the Next.js 14 form and a type error in 15.\n\n5. **generateMetadata and notFound()**: generateMetadata runs on the server before the page, so the post\'s <title> and description are in the first HTML response. The page and generateMetadata both call getPost, but a fetch to the same URL is made once per request. notFound() stops the render and shows the nearest not-found.tsx (or the default 404 page).',
    hints: ['Server Components can be async functions: just await your data directly', 'loading.tsx is used as a Suspense fallback by Next.js automatically', 'params is a Promise in Next.js 15, in generateMetadata too'],
    tieredHints: {
      apiSignature: 'fetch(url, { next: { revalidate: seconds } }); generateMetadata({ params }): Promise<Metadata>; notFound(): never',
      skeleton: '// app/blog/page.tsx\nexport const metadata: Metadata = ____;\n\nexport default async function BlogPage() {\n  const res = await fetch("https://api.example.com/posts", ____);\n  const { posts }: { posts: Post[] } = ____;\n  return (\n    <main>\n      <h1>Blog</h1>\n      <ul>{____}</ul>\n    </main>\n  );\n}\n\n// app/blog/[slug]/page.tsx\nasync function getPost(slug: string): Promise<Post | null> {\n  const res = await fetch(____, ____);\n  if (____) return null;\n  return res.json();\n}\n\nexport default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {\n  const { slug } = ____;\n  const post = ____;\n  if (!post) ____;\n  return <article>____</article>;\n}',
    },
    tags: ['nextjs', 'server-components', 'app-router', 'seo', 'project'],
    concepts: ['next-server-vs-client', 'next-app-router', 'web-html-semantics'],
  },


  {
    id: 'proj-next-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_DEPLOYMENT,
    course: Course.WEB_DEV,
    question: `You're building a marketing website with 50 blog posts. The content is written in a CMS and changes maybe once or twice a day. Which Next.js rendering strategy gives the best combination of performance and freshness?`,
    options: [
      { id: 'a', text: 'Fully dynamic: use "force-dynamic" or no-store on every page, so each visitor gets the latest content from the CMS in real time.', isCorrect: false },
      { id: 'b', text: 'Client-side fetching: use useEffect and fetch in a Client Component, so the browser loads the content after the page loads.', isCorrect: false },
      { id: 'c', text: 'Static generation with revalidation: build the pages with generateStaticParams and set revalidate: 3600, so a page older than an hour is rebuilt in the background.', isCorrect: true },
      { id: 'd', text: 'Static generation without revalidation: build every page with generateStaticParams, never revalidate, and redeploy whenever content changes.', isCorrect: false },
    ],
    explanation: 'Static generation with revalidation (ISR) fits here.\n\n**Why static with revalidate?**\n- The pages are built as static HTML at build time, the fastest possible response, served from a CDN.\n- With revalidate: 3600, the first visitor after a page is an hour old still gets the cached page at once while Next.js rebuilds it in the background, and the next visitor gets the new version.\n- 50 pages is small enough for generateStaticParams to build them all ahead.\n- Even better for a CMS: have the CMS call a webhook that runs revalidateTag or revalidatePath when an editor publishes, so a change shows at once and the timer is only a fallback.\n\n**Why not fully dynamic?** Every request hits the server and the CMS API. For content that changes once a day that is slower for visitors and costs server time for nothing.\n\n**Why not client-side fetching?** Search engines and link previews get an empty page with a spinner, which hurts a marketing site, and the content appears only after the JavaScript runs.\n\n**Why not static without revalidation?** Every content change needs a full redeploy, so editors would have to trigger builds by hand.',
    hints: ['How often does the content change, and how fast must the page load?', 'SEO matters for a marketing site: what does each strategy show a crawler?'],
    tags: ['nextjs', 'rendering', 'isr', 'static-generation', 'project'],
    concepts: ['next-data-fetching'],
  },

  // =====================================================================
  // CHECKPOINT 4: After Forms + DB (Topic.NEXT_FORMS_VALIDATION) - 3 questions
  // =====================================================================

  {
    id: 'proj-forms-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.NEXT_FORMS_VALIDATION,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: `Build the "create post" feature of a Next.js 15 app in three files. Prisma's Post model has id, title, content and published (a Boolean), and the client is exported as prisma from "@/lib/prisma".

1. lib/schemas/post.ts
   - Export postSchema, a Zod object: title at least 3 characters, content at least 10, each with your own message, and published a boolean
   - Export its inferred type as PostInput

2. app/posts/actions.ts (a Server Action file)
   - Export createPost(data: PostInput); check data with postSchema.safeParse
   - If the check fails, return { success: false, message: "Check the fields", errors } with the field errors
   - Otherwise create the post with prisma.post.create; if that throws, return { success: false, message: "Could not save the post" }
   - After a successful create, call revalidatePath("/posts") and return { success: true }

3. app/posts/new/page.tsx (a Client Component)
   - useForm with zodResolver(postSchema) and defaultValues title "", content "" and published false
   - A title input and a content textarea, each with its error message, and a published checkbox
   - Show the action's message when it fails; on success go to /posts with router.push
   - The submit button is disabled while formState.isSubmitting`,
    starterCode: `// lib/schemas/post.ts


// app/posts/actions.ts


// app/posts/new/page.tsx
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
    solution: `// lib/schemas/post.ts
import { z } from "zod";

export const postSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  published: z.boolean(),
});

export type PostInput = z.infer<typeof postSchema>;

// app/posts/actions.ts
"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { postSchema, type PostInput } from "@/lib/schemas/post";

export async function createPost(data: PostInput) {
  const parsed = postSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false as const,
      message: "Check the fields",
      errors: z.flattenError(parsed.error).fieldErrors,
    };
  }

  try {
    await prisma.post.create({ data: parsed.data });
  } catch {
    return { success: false as const, message: "Could not save the post" };
  }

  revalidatePath("/posts");
  return { success: true as const };
}

// app/posts/new/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSchema, type PostInput } from "@/lib/schemas/post";
import { createPost } from "../actions";

export default function NewPostPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PostInput>({
    resolver: zodResolver(postSchema),
    defaultValues: { title: "", content: "", published: false },
  });

  async function onSubmit(data: PostInput) {
    setServerError(null);
    const result = await createPost(data);
    if (!result.success) {
      setServerError(result.message);
      return;
    }
    router.push("/posts");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="title">Title</label>
      <input id="title" {...register("title")} />
      {errors.title && <p>{errors.title.message}</p>}

      <label htmlFor="content">Content</label>
      <textarea id="content" rows={6} {...register("content")} />
      {errors.content && <p>{errors.content.message}</p>}

      <label>
        <input type="checkbox" {...register("published")} /> Published
      </label>

      {serverError && <p role="alert">{serverError}</p>}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Create post"}
      </button>
    </form>
  );
}`,
    requires: [
      /export\s+const\s+postSchema\b/,
      /title\s*:\s*z\.string\(\)\.min\(\s*3\b/,
      /content\s*:\s*z\.string\(\)\.min\(\s*10\b/,
      /published\s*:\s*z\.boolean\(\)\s*[,}]/,
      /export\s+type\s+PostInput\s*=\s*z\.infer<\s*typeof\s+postSchema\s*>/,
      /["']use server["']/,
      /export\s+async\s+function\s+createPost\s*\(/,
      /postSchema\.safeParse\(/,
      /\.fieldErrors\b/,
      /Check the fields/,
      /prisma\.post\.create\(/,
      /catch\b/,
      /Could not save the post/,
      /revalidatePath\(\s*["'`]\/posts["'`]\s*\)/,
      /["']use client["']/,
      /zodResolver\(\s*postSchema\s*\)/,
      /defaultValues\s*:\s*\{[^}]*published\s*:\s*false/,
      /register\(\s*["']title["']\s*\)/,
      /register\(\s*["']content["']\s*\)/,
      /register\(\s*["']published["']\s*\)/,
      /errors\.title/,
      /errors\.content/,
      /disabled=\{[^}]*isSubmitting/,
      /router\.push\(\s*["'`]\/posts["'`]\s*\)/,
    ],
    explanation: `This is the usual full-stack form in the App Router:

1. **One Zod schema for both sides.** postSchema holds the rules once; the form runs it through zodResolver and the Server Action runs it again with safeParse. PostInput, inferred from it, types the form, the action's argument and the submit handler, so they cannot drift apart. published has no \`.default(false)\`: a default makes the schema's input type (published optional) differ from its output type, and \`useForm<PostInput>({ resolver: zodResolver(postSchema) })\` then fails to type-check. The form's defaultValues supply the false instead.

2. **The server checks again.** A Server Action can be called without the form, so safeParse is the real gate; it never throws, and \`z.flattenError(parsed.error).fieldErrors\` (Zod 4; \`parsed.error.flatten().fieldErrors\` in Zod 3) gives a \`{ field: [messages] }\` map. The database call sits in try/catch so a failed write comes back as a message instead of an error page.

3. **revalidatePath("/posts").** The posts list is a Server Component that Next.js caches; calling revalidatePath after the write makes the next visit to /posts render the new list.

4. **React Hook Form.** handleSubmit stops the reload and calls onSubmit only with valid data, so the action normally receives clean values. \`formState.isSubmitting\` is true while the async onSubmit runs, which keeps the button from sending the post twice. The \`as const\` on success makes the result a union TypeScript can narrow, so \`result.message\` type-checks once \`!result.success\`.`,
    hints: [
      'z.infer<typeof schema> extracts the TypeScript type from a Zod schema',
      'safeParse returns { success: true, data } or { success: false, error } instead of throwing',
      'zodResolver connects your Zod schema to React Hook Form\'s validation',
    ],
    tieredHints: {
      apiSignature: 'z.object(shape); schema.safeParse(data); z.flattenError(error).fieldErrors; zodResolver(schema); revalidatePath(path): void',
      skeleton: '// lib/schemas/post.ts\nexport const postSchema = z.object({\n  title: ____,\n  content: ____,\n  published: ____,\n});\nexport type PostInput = ____;\n\n// app/posts/actions.ts\n"use server";\nexport async function createPost(data: PostInput) {\n  const parsed = ____;\n  if (!parsed.success) {\n    return { success: false as const, message: "Check the fields", errors: ____ };\n  }\n  try {\n    await ____;\n  } catch {\n    return { success: false as const, message: "Could not save the post" };\n  }\n  ____;\n  return { success: true as const };\n}\n\n// app/posts/new/page.tsx\n"use client";\nexport default function NewPostPage() {\n  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<PostInput>({\n    resolver: ____,\n    defaultValues: ____,\n  });\n  // onSubmit: await createPost(data), then show result.message or router.push("/posts")\n  return <form onSubmit={handleSubmit(onSubmit)}>____</form>;\n}',
    },
    tags: ['zod', 'server-actions', 'prisma', 'react-hook-form', 'project'],
    concepts: ['forms-zod-schema', 'next-server-actions', 'forms-zod-resolver', 'forms-rhf-controller'],
  },

  {
    id: 'proj-forms-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.NEXT_FORMS_VALIDATION,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: `Build the edit page for a post in a Next.js 15 app, at app/posts/[id]/edit. Post has id (a string), title, content and published. These already exist: prisma from "@/lib/prisma"; postSchema and its PostInput type (title, content, published) from "@/lib/schemas/post"; and updatePost(id: string, data: PostInput) in app/posts/actions.ts, a Server Action that returns { success: boolean }.

1. app/posts/[id]/edit/page.tsx (a Server Component)
   - Await params (a Promise in Next.js 15) and load the post with prisma.post.findUnique
   - Call notFound() when there is no post, otherwise render <EditForm post={post} />

2. app/posts/[id]/edit/EditForm.tsx (a Client Component)
   - useForm with zodResolver(postSchema) and defaultValues from the post's title, content and published
   - On submit call updatePost(post.id, data); on success go to /posts/{id} with router.push, otherwise show "Could not save the post"
   - The Save button reads "Saving..." while formState.isSubmitting, and is disabled while submitting or while nothing has changed (formState.isDirty)`,
    starterCode: `// app/posts/[id]/edit/page.tsx


// app/posts/[id]/edit/EditForm.tsx
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
    solution: `// app/posts/[id]/edit/page.tsx
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EditForm from "./EditForm";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });

  if (!post) notFound();

  return (
    <main>
      <h1>Edit post</h1>
      <EditForm post={post} />
    </main>
  );
}

// app/posts/[id]/edit/EditForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postSchema, type PostInput } from "@/lib/schemas/post";
import { updatePost } from "../../actions";

type Props = {
  post: { id: string; title: string; content: string; published: boolean };
};

export default function EditForm({ post }: Props) {
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
      setServerError("Could not save the post");
      return;
    }
    router.push(\`/posts/\${post.id}\`);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="title">Title</label>
      <input id="title" {...register("title")} />
      {errors.title && <p>{errors.title.message}</p>}

      <label htmlFor="content">Content</label>
      <textarea id="content" rows={8} {...register("content")} />
      {errors.content && <p>{errors.content.message}</p>}

      <label>
        <input type="checkbox" {...register("published")} /> Published
      </label>

      {serverError && <p role="alert">{serverError}</p>}
      <button type="submit" disabled={isSubmitting || !isDirty}>
        {isSubmitting ? "Saving..." : "Save"}
      </button>
    </form>
  );
}`,
    requires: [
      /params\s*:\s*Promise</,
      /await\s+params\b/,
      /prisma\.post\.findUnique\(/,
      /notFound\(\)/,
      /<EditForm\s+post=\{\s*post\s*\}/,
      /["']use client["']/,
      /zodResolver\(\s*postSchema\s*\)/,
      /defaultValues\s*:[\s\S]*?post\.title|defaultValues\s*:\s*post\b/,
      /updatePost\(\s*post\.id\s*,/,
      /router\.push\(/,
      /\/posts\/(\$\{\s*post\.id\s*\}|["'`]\s*\+\s*post\.id)/,
      /Could not save the post/,
      /Saving\.\.\./,
      /disabled=\{[^}]*isSubmitting[^}]*\}|disabled=\{[^}]*isDirty[^}]*\}/,
      /isDirty/,
    ],
    explanation: `This splits the work at the server/client boundary:

1. **The Server Component loads the data.** page.tsx is an async Server Component that reads the post with Prisma directly, with no API route; the query runs on the server and never reaches the browser. In Next.js 15 \`params\` is a Promise, so the page awaits it before reading id; \`params.id\` read directly is the Next.js 14 form and a type error in 15.

2. **notFound() for a missing post.** It stops the render and shows the nearest not-found.tsx (or the default 404 page) with a 404 status, instead of rendering a form for a post that does not exist.

3. **The Client Component edits it.** EditForm needs event handlers and state, so it is a Client Component, and the post comes in as a prop: the record is there on the first render. That is why \`defaultValues\` can seed the form here; it is read only once, so data fetched in the browser after mount would need the \`values\` option or \`reset(data)\` instead.

4. **isDirty and isSubmitting.** isDirty is true once any field differs from its default, so Save stays disabled until something changed; isSubmitting is true while the async onSubmit runs, which shows "Saving..." and stops a double submit. The Server Action still re-checks the data with the same schema, since the browser's checks can be skipped.`,
    hints: [
      'The Server Component fetches the data; the Client Component handles the form',
      'In Next.js 15, params is a Promise: await it first',
      'isDirty tracks whether the user has changed anything from the default values',
    ],
    tieredHints: {
      apiSignature: 'prisma.post.findUnique({ where }): Promise<Post | null>; notFound(): never; useForm({ resolver, defaultValues }) returns { formState: { isDirty, isSubmitting } }',
      skeleton: '// app/posts/[id]/edit/page.tsx\nexport default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {\n  const { id } = ____;\n  const post = await ____;\n  if (!post) ____;\n  return <EditForm post={post} />;\n}\n\n// app/posts/[id]/edit/EditForm.tsx\n"use client";\nexport default function EditForm({ post }: Props) {\n  const { register, handleSubmit, formState: { isSubmitting, isDirty } } = useForm<PostInput>({\n    resolver: ____,\n    defaultValues: ____,\n  });\n\n  async function onSubmit(data: PostInput) {\n    const result = await ____;\n    if (!result.success) return; // show "Could not save the post"\n    router.push(____);\n  }\n\n  return (\n    <form onSubmit={handleSubmit(onSubmit)}>\n      <button type="submit" disabled={____}>{____}</button>\n    </form>\n  );\n}',
    },
    tags: ['nextjs', 'forms', 'prisma', 'server-client-boundary', 'project'],
    concepts: ['next-server-vs-client', 'forms-rhf-controller', 'forms-zod-resolver'],
  },

  {
    id: 'proj-forms-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.INTERMEDIATE,
    topic: Topic.NEXT_FORMS_VALIDATION,
    course: Course.WEB_DEV,
    question: `In a Next.js 15 app, the /posts page is a Server Component that reads the posts with Prisma and uses no cookies, headers or searchParams, so \`next build\` prerenders it. A "Create Post" form calls a Server Action that saves the post, then runs router.push("/posts"). The new post is in the database, but /posts still shows the old list, even after a full browser reload. What fixes it?`,
    options: [
      {
        id: 'a',
        text: 'Call e.preventDefault() in the submit handler, so the browser does not leave the page before the action has finished',
        isCorrect: false,
      },
      {
        id: 'b',
        text: 'Call revalidatePath("/posts") in the Server Action after the create, so Next.js renders the page again with the new post',
        isCorrect: true,
      },
      {
        id: 'c',
        text: 'Call router.refresh() after router.push("/posts"), so the browser fetches the latest version of the page from the server',
        isCorrect: false,
      },
      {
        id: 'd',
        text: 'Push "/posts?t=" + Date.now() instead, so the new URL gets past the browser\'s HTTP cache and loads a fresh copy',
        isCorrect: false,
      },
    ],
    explanation: `The stale copy is on the server. A page with no dynamic input is rendered once by \`next build\`, and Next.js serves that stored HTML (and its React Server Component payload) to every request until something revalidates it. A full reload therefore still gets the old list.

**revalidatePath("/posts")** in the Server Action marks that stored page stale, so the next request renders it again and reads the new post. Called from a Server Action, it also clears the browser's copy of the route, so the router.push that follows shows the new list.

**Why not router.refresh()?** It asks the server for the current route again, but the server answers with the same prerendered page, so nothing changes.

**Why not a query string?** The page does not read searchParams, so /posts?t=123 is served the same prerendered page. The browser's HTTP cache was never the problem.

**Why not e.preventDefault()?** React Hook Form's handleSubmit already stops the browser's own submit, and the post was saved; the problem is what /posts shows afterwards.

\`export const dynamic = "force-dynamic"\` on the page would also show new posts, by rendering it on every request, but it gives up the cached page for every visitor; revalidating after a write keeps it. With tagged fetches, \`revalidateTag\` does the same for one tag.`,
    hints: [
      'The full reload still shows the old list: where must the stale copy be?',
      'A page with no dynamic input is rendered at build time and kept until something revalidates it',
    ],
    tags: ['nextjs', 'revalidation', 'caching', 'server-actions', 'project'],
    concepts: ['next-server-actions', 'next-data-fetching'],
  },

  // =====================================================================
  // CHECKPOINT 5: After Advanced Patterns (Topic.NEXT_URL_STATE): 3 questions
  // =====================================================================

  {
    id: 'proj-url-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.NEXT_URL_STATE,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: 'Build a searchable, filterable product page whose filter state lives entirely in the URL, so a link reproduces the view and Back and Forward step through the changes.\n\n`app/products/page.tsx`, a Server Component:\n- Await the `searchParams` prop (a promise in Next.js 15) and read "q" (default ""), "category" (default "all"), "sort" (default "newest") and "page" (default "1", converted to a number)\n- Load the results with `await getProducts({ q, category, sort, page })` from "@/lib/products"; it returns `{ products, totalPages }`, and each product has `id` and `name`\n- Render `<FilterBar />`, then the product names, then one next/link `Link` per page from 1 to `totalPages`, each keeping every current param and setting only "page"\n\n`components/FilterBar.tsx`, a Client Component:\n- A search input, a category `<select>` (all, electronics, clothing, books) and a sort `<select>` (newest, price-asc, price-desc), each showing the value now in the URL\n- A change copies the current params, sets the changed one (or deletes it when it is empty or "all"), deletes "page" so the new results start at page 1, and pushes the new URL\n- The search input keeps its text in local state and updates the URL 300 ms after typing stops',
    starterCode: `// app/products/page.tsx (Server Component)
import Link from "next/link";
import FilterBar from "@/components/FilterBar";
import { getProducts } from "@/lib/products";

export default async function ProductsPage({ searchParams }) {
}

// components/FilterBar.tsx (Client Component)
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function FilterBar() {
}`,
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
    solution: `// app/products/page.tsx (Server Component)
import Link from "next/link";
import FilterBar from "@/components/FilterBar";
import { getProducts } from "@/lib/products";

export default async function ProductsPage({ searchParams }) {
  const query = await searchParams;
  const q = query.q ?? "";
  const category = query.category ?? "all";
  const sort = query.sort ?? "newest";
  const page = Number(query.page ?? "1");
  const { products, totalPages } = await getProducts({ q, category, sort, page });

  function pageHref(n) {
    const params = new URLSearchParams(query);
    params.set("page", String(n));
    return \`/products?\${params.toString()}\`;
  }

  return (
    <main>
      <h1>Products</h1>
      <FilterBar />
      <ul>
        {products.map((product) => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
      {products.length === 0 && <p>No products found</p>}
      <nav>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
          <Link key={n} href={pageHref(n)} aria-current={n === page ? "page" : undefined}>
            {n}
          </Link>
        ))}
      </nav>
    </main>
  );
}

// components/FilterBar.tsx (Client Component)
"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function FilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [text, setText] = useState(searchParams.get("q") ?? "");

  function updateParam(key, value) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page"); // new results start at page 1
    router.push(\`\${pathname}?\${params.toString()}\`);
  }

  useEffect(() => {
    if (text === (searchParams.get("q") ?? "")) return;
    const timer = setTimeout(() => updateParam("q", text), 300);
    return () => clearTimeout(timer);
  }, [text]);

  return (
    <div>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Search products"
      />
      <select
        value={searchParams.get("category") ?? "all"}
        onChange={(e) => updateParam("category", e.target.value)}
      >
        <option value="all">All</option>
        <option value="electronics">Electronics</option>
        <option value="clothing">Clothing</option>
        <option value="books">Books</option>
      </select>
      <select
        value={searchParams.get("sort") ?? "newest"}
        onChange={(e) => updateParam("sort", e.target.value)}
      >
        <option value="newest">Newest</option>
        <option value="price-asc">Price: low to high</option>
        <option value="price-desc">Price: high to low</option>
      </select>
    </div>
  );
}`,
    explanation: 'The URL is the single source of truth, which is what makes a link, a refresh and Back and Forward all show the same view.\n\n1. The server reads: in Next.js 15 the page awaits its searchParams promise, converts page with Number (a param is always text, so "2" + 1 would be "21"), and fetches the matching products, so the first HTML is already filtered.\n\n2. The page links keep the filters: each href is a copy of every current param with only page changed. A bare `?page=2` link would drop the search, the category and the sort.\n\n3. The client writes: FilterBar copies the current params with new URLSearchParams(searchParams.toString()), changes one key, and navigates; Next.js renders the server page again with the new searchParams. Because the selects read their value from useSearchParams, they follow Back and Forward too.\n\n4. A filter change deletes page: page 5 of the old results means nothing for the new ones.\n\n5. The search box debounces: its text lives in local state so typing is instant, and the URL changes 300 ms after the last keystroke, so typing a word is one server render, not one per letter. Selects fire one change event each, so they navigate at once. router.replace is a reasonable choice for the search box if Back should not step through each search.',
    hints: [
      'searchParams is a promise in Next.js 15, and every value in it is a string',
      'new URLSearchParams(searchParams.toString()) is a writable copy of the current params',
      'Delete "page" whenever another filter changes',
    ],
    tieredHints: {
      apiSignature: 'searchParams: Promise<Record<string, string>>; new URLSearchParams(init); params.set(key, value) / params.delete(key); router.push(url)',
      skeleton: `// components/FilterBar.tsx
"use client";
export default function FilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(key, value) {
    const params = ____;
    if (value && value !== "all") params.set(key, value);
    else params.delete(key);
    ____; // back to page 1
    ____;
  }
  // the search input: local state, then updateParam("q", text) after 300 ms
  return <div />;
}`,
    },
    requires: [
      /await\s+searchParams/,
      /Number\(|parseInt\(|\+\s*\(?\s*(query|params|sp)\.page/,
      /getProducts\(\s*\{/,
      /<Link/,
      /(new URLSearchParams\([^)][\s\S]*){2}|query:\s*\{\s*\.\.\./,
      /["']use client["']/,
      /new URLSearchParams\(\s*searchParams/,
      /\.delete\(\s*["']page["']\s*\)/,
      /router\.(push|replace)\(/,
      /setTimeout\(/,
      /clearTimeout\(/,
    ],
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
    question: 'Build an `InfiniteFeed` Client Component that loads posts page by page as the user scrolls.\n\n`GET /api/feed` returns the first page as `{ items, nextCursor }`, where each item has `id` and `title`; `GET /api/feed?cursor=<cursor>` returns the page after that cursor, and `nextCursor` is null on the last page.\n\nRequirements:\n- Fetch with TanStack Query\'s `useInfiniteQuery` under the key `["feed"]`: the first page has no cursor, and each next cursor comes from the last page\'s `nextCursor`\n- While the first page loads show "Loading feed...", and on failure "Error: " followed by the message\n- Render every post\'s title from all the loaded pages as one list\n- Put an empty sentinel `<div>` after the list and watch it with an `IntersectionObserver`: when it comes into view, there is a next page and none is being fetched, fetch the next page; disconnect the observer on cleanup\n- Show "Loading more..." while the next page loads, and "No more posts" when there is no next page\n- Export it as the default export',
    starterCode: `"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

export default function InfiniteFeed() {
}`,
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
    solution: `"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

async function fetchFeed(cursor) {
  const url = cursor ? \`/api/feed?cursor=\${encodeURIComponent(cursor)}\` : "/api/feed";
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch feed");
  return res.json();
}

export default function InfiniteFeed() {
  const sentinelRef = useRef(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["feed"],
    queryFn: ({ pageParam }) => fetchFeed(pageParam),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isPending) return <p>Loading feed...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  const posts = data.pages.flatMap((page) => page.items);

  return (
    <div>
      {posts.map((post) => (
        <article key={post.id}>
          <h2>{post.title}</h2>
        </article>
      ))}
      <div ref={sentinelRef} />
      {isFetchingNextPage && <p>Loading more...</p>}
      {!hasNextPage && <p>No more posts</p>}
    </div>
  );
}

# OR

"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

type Post = { id: string; title: string };
type FeedPage = { items: Post[]; nextCursor: string | null };

async function fetchFeed(cursor?: string): Promise<FeedPage> {
  const url = cursor ? \`/api/feed?cursor=\${encodeURIComponent(cursor)}\` : "/api/feed";
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch feed");
  return res.json();
}

export default function InfiniteFeed() {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending, isError, error } =
    useInfiniteQuery({
      queryKey: ["feed"],
      queryFn: ({ pageParam }) => fetchFeed(pageParam),
      initialPageParam: undefined as string | undefined,
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    });

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage();
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isPending) return <p>Loading feed...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <div>
      {data.pages.flatMap((page) => page.items).map((post) => (
        <article key={post.id}>
          <h2>{post.title}</h2>
        </article>
      ))}
      <div ref={sentinelRef} />
      {isFetchingNextPage && <p>Loading more...</p>}
      {!hasNextPage && <p>No more posts</p>}
    </div>
  );
}`,
    explanation: 'This joins TanStack Query\'s paged query to a browser API.\n\n1. useInfiniteQuery keeps the list as data.pages, one entry per response. queryFn gets pageParam, the cursor to fetch: initialPageParam (undefined here, since the first page has none) for the first call, then whatever getNextPageParam returned. Returning the last page\'s nextCursor ends the list when it is null: in TanStack Query v5, undefined or null both turn hasNextPage false.\n\n2. Cursor pagination asks for "the items after this one", so a post added at the top does not shift the pages and show a duplicate, as an offset would. The cursor is passed through encodeURIComponent because it goes into a URL.\n\n3. An IntersectionObserver calls back when the sentinel div enters the viewport, which is cheaper and simpler than a scroll listener. The effect depends on hasNextPage and isFetchingNextPage, so it re-subscribes with fresh values, and disconnect() in the cleanup drops the old observer.\n\n4. The guard hasNextPage && !isFetchingNextPage stops a second request for the same page while one is in flight, and stops fetching past the end.\n\n5. data.pages.flatMap((page) => page.items) turns the pages into one list to render.',
    hints: [
      'getNextPageParam returns the cursor for the next request; undefined or null means there is no next page',
      'Check hasNextPage and !isFetchingNextPage before calling fetchNextPage',
      'data.pages is an array of responses; flatMap turns it into one list of posts',
    ],
    tieredHints: {
      apiSignature: 'useInfiniteQuery({ queryKey, queryFn: ({ pageParam }) => ..., initialPageParam, getNextPageParam: (lastPage) => cursor }); new IntersectionObserver(callback)',
      skeleton: `export default function InfiniteFeed() {
  const sentinelRef = useRef(null);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isPending, isError, error } = useInfiniteQuery({
    queryKey: ["feed"],
    queryFn: ({ pageParam }) => ____,
    initialPageParam: ____,
    getNextPageParam: (lastPage) => ____,
  });

  useEffect(() => {
    // observe sentinelRef.current; on intersect, guard, then fetch the next page
    return () => ____;
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const posts = data?.pages.____ ?? [];
  return <div>{/* posts, the sentinel div, the status text */}</div>;
}`,
    },
    requires: [
      /useInfiniteQuery\(\s*\{/,
      /queryKey:\s*\[\s*["']feed["']\s*\]/,
      /pageParam/,
      'initialPageParam',
      /getNextPageParam[\s\S]*nextCursor/,
      /new IntersectionObserver\(/,
      'isIntersecting',
      /hasNextPage\s*&&\s*!isFetchingNextPage|!isFetchingNextPage\s*&&\s*hasNextPage/,
      /fetchNextPage\(\)/,
      /\.observe\(/,
      /disconnect\(\)|unobserve\(/,
      /pages\.(flatMap|map)\(/,
    ],
    tags: ['tanstack-query', 'infinite-scroll', 'intersection-observer', 'pagination', 'project'],
    concepts: ['next-tanstack-query', 'api-pagination'],
  },

  {
    id: 'proj-url-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.NEXT_URL_STATE,
    course: Course.WEB_DEV,
    question: `You have a dashboard page with 5 widget components, each fetching data from a different API endpoint. The page component awaits the 5 fetches one after another and only then renders, so it takes 3 seconds to load: each fetch waits for the previous one to finish. How do you fix this so widgets load independently?`,
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
        text: 'Wrap each widget in its own <Suspense> boundary; each widget is an async Server Component that fetches independently. The page shell loads instantly, and each widget streams in as its data resolves.',
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

**Why NOT React.lazy?** Code-splitting reduces bundle size but doesn't affect data fetching. The widgets aren't slow because of JavaScript size; they're slow because of data fetching.`,
    hints: [
      'The problem is sequential data fetching, not sequential rendering',
      'Think about what Next.js streaming with Suspense gives you over Promise.all',
    ],
    tags: ['nextjs', 'suspense', 'streaming', 'performance', 'project'],
    concepts: ['next-streaming-suspense'],
  },

  // =====================================================================
  // CHECKPOINT 6: Capstone (Topic.PATTERNS_ARCHITECTURAL, and Topic.DB_DESIGN for proj-capstone-1) - 3 questions
  // =====================================================================

  {
    id: 'proj-capstone-1',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.DB_DESIGN,
    course: Course.WEB_DEV,
    language: CodeLanguage.TYPESCRIPT,
    question: `Write the Prisma schema for a task tracker, a simplified Linear or Jira, on PostgreSQL. The starter has the generator and datasource; add:
- three enums: TaskStatus (BACKLOG, TODO, IN_PROGRESS, IN_REVIEW, DONE, CANCELLED), TaskPriority (URGENT, HIGH, MEDIUM, LOW, NONE) and WorkspaceRole (OWNER, ADMIN, MEMBER, VIEWER)
- User: id, a unique email, fullName, an optional avatarUrl
- Workspace: id, title, a unique slug, an optional description
- WorkspaceMember: the junction model between User and Workspace, with a role (default MEMBER) and joinedAt; a user can join a workspace only once
- Project: id, title, an optional description, and a key such as "PROJ" that is unique within its workspace; it belongs to a workspace
- Task: id, title, an optional description, a taskNumber that is unique within its project, status (default BACKLOG), priority (default NONE) and an optional dueDate; it belongs to a project, has a required reporter and an optional assignee, both Users, through relations named "TaskReporter" and "TaskAssignee"
- Comment: id, content, an author (a User) and the task it is on
- createdAt and updatedAt on every model except WorkspaceMember

Deletes: removing a workspace removes its members and projects, a project its tasks, and a task its comments. Removing a user removes their memberships and comments and unassigns their tasks, but a user who reported tasks cannot be removed. Add indexes for listing a project's tasks by status and for finding the tasks assigned to a user.`,
    starterCode: `// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
`,
    testCases: [
      { input: 'enums', expectedOutput: 'TaskStatus, TaskPriority and WorkspaceRole with the listed values', description: 'The three enums are defined' },
      { input: 'WorkspaceMember', expectedOutput: 'role, joinedAt, two Cascade relations, @@unique([userId, workspaceId])', description: 'The junction model carries the role and allows one membership per pair' },
      { input: 'Task relations', expectedOutput: '@relation("TaskReporter" ... onDelete: Restrict) and @relation("TaskAssignee" ... onDelete: SetNull)', description: 'Two named relations to User with the right delete rules' },
      { input: 'Task constraints', expectedOutput: '@@unique([projectId, taskNumber]), @@index([projectId, status]), @@index([assigneeId])', description: 'Per-project numbering and the two query indexes' },
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
  fullName  String
  avatarUrl String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  memberships   WorkspaceMember[]
  assignedTasks Task[]            @relation("TaskAssignee")
  reportedTasks Task[]            @relation("TaskReporter")
  comments      Comment[]
}

model Workspace {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  members  WorkspaceMember[]
  projects Project[]
}

model WorkspaceMember {
  id          String        @id @default(cuid())
  role        WorkspaceRole @default(MEMBER)
  joinedAt    DateTime      @default(now())
  userId      String
  workspaceId String
  user        User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  workspace   Workspace     @relation(fields: [workspaceId], references: [id], onDelete: Cascade)

  @@unique([userId, workspaceId])
}

model Project {
  id          String    @id @default(cuid())
  title       String
  description String?
  key         String
  workspaceId String
  workspace   Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  tasks       Task[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@unique([workspaceId, key])
}

model Task {
  id          String       @id @default(cuid())
  title       String
  description String?
  taskNumber  Int
  status      TaskStatus   @default(BACKLOG)
  priority    TaskPriority @default(NONE)
  dueDate     DateTime?
  projectId   String
  project     Project      @relation(fields: [projectId], references: [id], onDelete: Cascade)
  reporterId  String
  reporter    User         @relation("TaskReporter", fields: [reporterId], references: [id], onDelete: Restrict)
  assigneeId  String?
  assignee    User?        @relation("TaskAssignee", fields: [assigneeId], references: [id], onDelete: SetNull)
  comments    Comment[]
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt

  @@unique([projectId, taskNumber])
  @@index([projectId, status])
  @@index([assigneeId])
}

model Comment {
  id        String   @id @default(cuid())
  content   String
  authorId  String
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  taskId    String
  task      Task     @relation(fields: [taskId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

# OR

// prisma/schema.prisma
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
  fullName  String
  avatarUrl String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  memberships   WorkspaceMember[]
  assignedTasks Task[]            @relation("TaskAssignee")
  reportedTasks Task[]            @relation("TaskReporter")
  comments      Comment[]
}

model Workspace {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  members  WorkspaceMember[]
  projects Project[]
}

model WorkspaceMember {
  role        WorkspaceRole @default(MEMBER)
  joinedAt    DateTime      @default(now())
  userId      String
  workspaceId String
  user        User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  workspace   Workspace     @relation(fields: [workspaceId], references: [id], onDelete: Cascade)

  @@id([userId, workspaceId])
}

model Project {
  id          String    @id @default(cuid())
  title       String
  description String?
  key         String
  workspaceId String
  workspace   Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  tasks       Task[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@unique([workspaceId, key])
}

model Task {
  id          String       @id @default(cuid())
  title       String
  description String?
  taskNumber  Int
  status      TaskStatus   @default(BACKLOG)
  priority    TaskPriority @default(NONE)
  dueDate     DateTime?
  projectId   String
  project     Project      @relation(fields: [projectId], references: [id], onDelete: Cascade)
  reporterId  String
  reporter    User         @relation("TaskReporter", fields: [reporterId], references: [id], onDelete: Restrict)
  assigneeId  String?
  assignee    User?        @relation("TaskAssignee", fields: [assigneeId], references: [id], onDelete: SetNull)
  comments    Comment[]
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt

  @@unique([projectId, taskNumber])
  @@index([projectId, status])
  @@index([assigneeId])
}

model Comment {
  id        String   @id @default(cuid())
  content   String
  authorId  String
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  taskId    String
  task      Task     @relation(fields: [taskId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}`,
    explanation: `The decisions in this schema, each from the db_design rule card:
1. WorkspaceMember is an explicit junction model rather than Prisma's implicit many-to-many, because the pair carries data of its own (the role and joinedAt), and @@unique([userId, workspaceId]) (or a composite @@id on the pair) allows one membership per user per workspace.
2. Task has two relations to the same model, so each needs a name: "TaskReporter" and "TaskAssignee" tell Prisma which User field pairs with which Task field.
3. The delete rules follow ownership. Cascade where the child cannot exist without its parent (members, projects, tasks, comments). SetNull for the assignee, which is why assigneeId is optional: removing a user unassigns their tasks. Restrict for the reporter, so the history of who filed a task is never lost; the app must reassign or archive those tasks first.
4. @@unique([projectId, taskNumber]) and @@unique([workspaceId, key]) make PROJ-123 style numbers unique per project and keys unique per workspace without making them global. Prisma cannot auto-increment per project, so the app assigns taskNumber, ideally inside a transaction.
5. @@index([projectId, status]) serves the board query, a project's tasks filtered by status, because the index leads with projectId; it also serves a filter on projectId alone. @@index([assigneeId]) serves "my tasks". PostgreSQL does not index foreign keys on its own, so in a real app also index the other foreign keys you filter or join on (reporterId, taskId on Comment).
6. cuid() ids can be generated without a central counter and do not reveal how many rows exist, unlike sequential integers in URLs.`,
    hints: [
      'Use an explicit junction model when the pair needs extra fields such as a role',
      'Two relations to the same model need names, such as @relation("TaskAssignee")',
      'An index serves filters on its leading columns: put projectId first',
    ],
    tieredHints: {
      apiSignature: 'field Type @relation("Name", fields: [fk], references: [id], onDelete: Cascade | SetNull | Restrict); @@unique([a, b]); @@index([a, b])',
      skeleton: `model WorkspaceMember {
  id          String        @id @default(cuid())
  role        WorkspaceRole @default(____)
  joinedAt    DateTime      @default(now())
  userId      String
  workspaceId String
  user        User          @relation(fields: [userId], references: [id], onDelete: ____)
  workspace   Workspace     @relation(fields: [workspaceId], references: [id], onDelete: ____)

  @@____([userId, workspaceId])
}

model Task {
  // ...
  reporterId String
  reporter   User  @relation(____, fields: [reporterId], references: [id], onDelete: ____)
  assigneeId String____
  assignee   User? @relation(____, fields: [assigneeId], references: [id], onDelete: ____)

  @@unique([____, ____])
  @@index([____, ____])
  @@index([____])
}`,
    },
    tags: [
      'prisma',
      'database-design',
      'schema',
      'relations',
      'indexes',
      'project',
    ],
    concepts: [
      'prisma-schema-relations',
      'db-normalization',
      'db-indexing',
    ],
    requires: [
      /enum\s+TaskStatus\s*\{/,
      /model\s+WorkspaceMember\s*\{/,
      /@@(unique|id)\(\[\s*(userId\s*,\s*workspaceId|workspaceId\s*,\s*userId)\s*\]\)/,
      /@relation\(\s*"TaskAssignee"[^)]*onDelete:\s*SetNull/,
      /@relation\(\s*"TaskReporter"[^)]*onDelete:\s*Restrict/,
      /@@unique\(\[\s*projectId\s*,\s*taskNumber\s*\]\)/,
      /@@index\(\[\s*projectId\s*,\s*status\s*\]\)/,
      /@@index\(\[\s*assigneeId\s*\]\)/,
    ],
  },

  {
    id: 'proj-capstone-2',
    type: QuestionType.CODING,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.PATTERNS_ARCHITECTURAL,
    course: Course.WEB_DEV,
    language: CodeLanguage.JSX,
    question: `Build a protected dashboard in the App Router. Write three files in one answer, each starting with its path comment:
1. app/dashboard/layout.tsx: an async Server Component that reads the session with await auth() and calls redirect("/login") when there is none. Otherwise it renders a sidebar with the user's name and email, a nav of Link elements built from a navItems array (Overview at /dashboard, Projects at /dashboard/projects, Settings at /dashboard/settings) and a "Sign out" button in a form whose action is an inline Server Action that calls signOut({ redirectTo: "/login" }); beside the sidebar, a <main> renders children.
2. app/dashboard/loading.tsx: a skeleton for the main area that uses Tailwind's animate-pulse.
3. app/dashboard/error.tsx: a Client Component that logs the error in an effect, shows the heading "Something went wrong" and a "Try again" button that calls reset().

auth and signOut come from "@/auth" (Auth.js v5).`,
    starterCode: `// app/dashboard/layout.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";

// app/dashboard/loading.tsx

// app/dashboard/error.tsx
`,
    testCases: [
      { input: 'layout.tsx with no session', expectedOutput: 'redirect("/login")', description: 'The layout checks the session on the server and redirects' },
      { input: 'layout.tsx with a session', expectedOutput: 'sidebar with name, email, three nav links and a sign-out Server Action; <main>{children}</main>', description: 'The layout renders the sidebar and the page' },
      { input: 'loading.tsx and error.tsx', expectedOutput: 'an animate-pulse skeleton; "use client" error boundary whose button calls reset()', description: 'The loading and error boundaries of the segment' },
    ],
    solution: `// app/dashboard/layout.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";

const navItems = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/projects", label: "Projects" },
  { href: "/dashboard/settings", label: "Settings" },
];

export default async function DashboardLayout({ children }) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="flex h-screen">
      <aside className="w-64 p-4">
        <p>{session.user.name}</p>
        <p>{session.user.email}</p>
        <nav>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <button type="submit">Sign out</button>
        </form>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}

// app/dashboard/loading.tsx
export default function DashboardLoading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 w-1/3 rounded bg-muted" />
      <div className="h-32 rounded bg-muted" />
    </div>
  );
}

// app/dashboard/error.tsx
"use client";

import { useEffect } from "react";

export default function DashboardError({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}

# OR

// app/dashboard/layout.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";

const navItems = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/projects", label: "Projects" },
  { href: "/dashboard/settings", label: "Settings" },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="flex h-screen">
      <aside className="w-64 p-4">
        <p>{session.user.name}</p>
        <p>{session.user.email}</p>
        <nav>
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <button type="submit">Sign out</button>
        </form>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}

// app/dashboard/loading.tsx
export default function DashboardLoading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 w-1/3 rounded bg-muted" />
      <div className="h-32 rounded bg-muted" />
    </div>
  );
}

// app/dashboard/error.tsx
"use client";

import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}`,
    explanation: `This puts together four App Router files from earlier sections.
1. The layout is a Server Component, so await auth() runs on the server and redirect("/login") happens before any dashboard markup is sent, which is safer than a check in the browser. redirect() works by throwing, so do not call it inside a try block that would catch it.
2. A layout wraps every page under /dashboard and is not re-rendered when the user moves between those pages: the sidebar stays mounted and only children changes. The flip side, which the Next.js docs warn about, is that the layout's check does not run again on each client-side navigation, so pages and the functions that load sensitive data should check the session too; the layout check is a convenient first gate, not the only one.
3. Sign-out is a Server Action: the inline async function marked "use server" runs on the server when the form is submitted and calls Auth.js's signOut, which clears the session cookie and redirects. That needs no client JavaScript and no hand-made POST to /api/auth/signout (which Auth.js protects with a CSRF token).
4. loading.tsx is shown inside the layout while the page streams in, so the sidebar is already visible and only the main area pulses. error.tsx must be a Client Component, because it is a React error boundary; reset() renders the segment again without a full page reload, and in production error.digest is the id to look up in the server logs.`,
    hints: [
      'auth() is async and runs on the server: await it before checking the session',
      'The sign-out form\'s action is an async function marked "use server"',
      'error.tsx must be a Client Component, with "use client" at the top',
    ],
    tieredHints: {
      apiSignature: 'auth(): Promise<Session | null>; redirect(path): never; signOut({ redirectTo }); error.tsx receives { error, reset }',
      skeleton: `// app/dashboard/layout.tsx
export default async function DashboardLayout({ children }) {
  const session = await ____();
  if (!session) ____("/login");

  return (
    <div className="flex">
      <aside>
        {/* name, email, nav links */}
        <form
          action={async () => {
            "____";
            await ____({ redirectTo: "/login" });
          }}
        >
          <button type="submit">Sign out</button>
        </form>
      </aside>
      <main>{____}</main>
    </div>
  );
}

// app/dashboard/error.tsx
"____";
export default function DashboardError({ error, reset }) {
  return <button onClick={() => ____}>Try again</button>;
}`,
    },
    tags: ['nextjs', 'authentication', 'layout', 'error-boundary', 'project'],
    concepts: [
      'web-security-auth-tokens',
      'next-error-boundary',
    ],
    requires: [
      /await\s+auth\(\)/,
      /redirect\(\s*["']\/login["']\s*\)/,
      /<main[^>]*>\s*\{\s*children\s*\}/,
      /["']use server["'][\s\S]*signOut\(/,
      /animate-pulse/,
      /["']use client["']/,
      /onClick=\{\s*(\(\)\s*=>\s*reset\(\)|reset)\s*\}/,
    ],
  },

  {
    id: 'proj-capstone-3',
    type: QuestionType.MULTIPLE_CHOICE,
    difficulty: Difficulty.ADVANCED,
    topic: Topic.PATTERNS_ARCHITECTURAL,
    course: Course.WEB_DEV,
    question: `Your team of 8 built a shop as a modular monolith: catalogue, orders, billing and image processing (resizing every uploaded product photo) are separate modules in one Next.js app with one database. Which of these is a sound reason to extract one module into its own service?`,
    options: [
      { id: 'a', text: 'The code base has passed 100,000 lines, and a repository that size is a sign the app should now be split up', isCorrect: false },
      { id: 'b', text: 'Image processing needs far more CPU than the rest at upload peaks, and must scale and deploy on its own schedule', isCorrect: true },
      { id: 'c', text: 'Microservices are how large companies build, so extracting modules early prepares the app for future growth', isCorrect: false },
      { id: 'd', text: 'Orders and billing call each other\'s functions constantly, so making one a service would force a cleaner boundary', isCorrect: false },
    ],
    explanation: `A module earns its own service when it has a real need the monolith cannot meet: different scaling (image resizing needs bursts of CPU that the rest of the app does not, so it can run on its own machines or a job queue), a different deploy or release cycle, a separate team that should own it end to end, or a different reliability or security boundary. Size alone is not a reason; a large, well-structured monolith is fine, and the module boundaries already keep it organised. "Big companies do it" is not a reason either, since each service adds a deploy pipeline, monitoring, network failures and data that can no longer be changed in one transaction. Modules that call each other constantly are the worst candidates: splitting them turns cheap function calls into slow, failure-prone network calls that still have to stay in step. Extract along a boundary that is already quiet.`,
    hints: [
      'What does a separate service give you that a module in one app cannot?',
      'What happens to two chatty modules when every call between them crosses the network?',
    ],
    tags: ['architecture', 'monolith', 'microservices', 'startup', 'project'],
    concepts: ['pattern-architectural'],
  },
];
