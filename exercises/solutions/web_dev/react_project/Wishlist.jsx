/**
 * Wishlist: a small React app of books a reader wants, built from the section's pieces.
 * Reference solution.
 */
import { useEffect, useReducer, useState } from 'react';

/** The key the list is saved under in storage. */
export const STORAGE_KEY = 'wishlist';

export function wishlistReducer(items, action) {
  switch (action.type) {
    case 'added': {
      const title = action.title.trim();
      if (title === '') return items;
      const id = Math.max(0, ...items.map(item => item.id)) + 1;
      return [...items, { id, title, bought: false }];
    }
    case 'toggled':
      return items.map(item => (item.id === action.id ? { ...item, bought: !item.bought } : item));
    case 'removed':
      return items.filter(item => item.id !== action.id);
    default:
      return items;
  }
}

export function loadWishlist(storage) {
  try {
    const saved = JSON.parse(storage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

export function AddForm({ onAdd }) {
  const [title, setTitle] = useState('');
  function handleSubmit(e) {
    e.preventDefault();
    if (title.trim() !== '') onAdd(title);
    setTitle('');
  }
  return (
    <form onSubmit={handleSubmit}>
      <label>
        Title
        <input value={title} onChange={e => setTitle(e.target.value)} />
      </label>
      <button>Add</button>
    </form>
  );
}

export function Wishlist({ storage }) {
  // The third argument runs once, so storage is read on the first render only.
  const [items, dispatch] = useReducer(wishlistReducer, storage, loadWishlist);
  const [onlyWanted, setOnlyWanted] = useState(false);

  useEffect(() => {
    storage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, storage]);

  const shown = onlyWanted ? items.filter(item => !item.bought) : items;
  const bought = items.filter(item => item.bought).length;

  return (
    <>
      <AddForm onAdd={title => dispatch({ type: 'added', title })} />
      <button aria-pressed={!onlyWanted} onClick={() => setOnlyWanted(false)}>All</button>
      <button aria-pressed={onlyWanted} onClick={() => setOnlyWanted(true)}>Still wanted</button>
      <ul>
        {shown.map(item => (
          <li key={item.id}>
            {item.title}
            <input
              type="checkbox"
              aria-label={`Bought ${item.title}`}
              checked={item.bought}
              onChange={() => dispatch({ type: 'toggled', id: item.id })}
            />
            <button onClick={() => dispatch({ type: 'removed', id: item.id })}>Remove {item.title}</button>
          </li>
        ))}
      </ul>
      <p>{items.length - bought} wanted, {bought} bought</p>
    </>
  );
}
