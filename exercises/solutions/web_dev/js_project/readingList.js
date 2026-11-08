/** Reading list: reference solution. */

export const STORAGE_KEY = 'reading-list';

export function addBook(list, title) {
  const trimmed = title.trim();
  if (!trimmed) return list;
  const id = list.reduce((highest, book) => Math.max(highest, book.id), 0) + 1;
  return [...list, { id, title: trimmed, read: false }];
}

export function toggleRead(list, id) {
  return list.map((book) => (book.id === id ? { ...book, read: !book.read } : book));
}

export function removeBook(list, id) {
  return list.filter((book) => book.id !== id);
}

export function unreadCount(list) {
  return list.filter((book) => !book.read).length;
}

export function saveList(list, storage) {
  storage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function loadList(storage) {
  const saved = storage.getItem(STORAGE_KEY);
  if (saved === null) return [];
  try {
    const list = JSON.parse(saved);
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function renderList(list, ul) {
  const doc = ul.ownerDocument;
  const items = list.map((book) => {
    const li = doc.createElement('li');
    li.textContent = book.title;
    li.dataset.id = String(book.id);
    if (book.read) li.classList.add('read');
    return li;
  });
  ul.textContent = '';
  ul.append(...items);
}
