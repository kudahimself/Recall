/** My shelf: reference solution. */

export function setupShelf(doc) {
  const form = doc.querySelector('#add-form');
  const input = doc.getElementById('title');
  const shelf = doc.getElementById('shelf');
  const count = doc.getElementById('count');

  function showCount() {
    const n = shelf.querySelectorAll('li').length;
    count.textContent = `${n} ${n === 1 ? 'book' : 'books'}`;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const title = input.value.trim();
    if (!title) return;
    const item = doc.createElement('li');
    item.dataset.title = title;
    const name = doc.createElement('span');
    name.className = 'title';
    // textContent, never innerHTML: the title is whatever the visitor typed.
    name.textContent = title;
    const remove = doc.createElement('button');
    remove.type = 'button';
    remove.className = 'remove';
    remove.textContent = 'Remove';
    item.append(name, ' ', remove);
    shelf.append(item);
    input.value = '';
    showCount();
  });

  // One listener for every book: clicks bubble up from the span or button to the list.
  shelf.addEventListener('click', (event) => {
    const target = event.target;
    const item = target.parentElement;
    if (target.classList.contains('remove')) {
      item.remove();
      showCount();
    } else if (target.classList.contains('title')) {
      item.classList.toggle('read');
    }
  });

  showCount();
}
