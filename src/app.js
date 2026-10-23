import { loadTasks, saveTasks } from './storage.js';
import { validateTitle, createTask, orderForDisplay } from './tasks.js';

const APP_NAME = 'Curso-PSWE-07';

const MESSAGES = {
  unreadable: 'Saved tasks could not be read.',
  saveFailed: 'Could not save your changes.',
  titleRequired: 'Title is required',
  noTasks: 'No tasks yet. Add your first one!',
};

// If localStorage is blocked, behave as an empty store whose writes fail so the
// user sees the "could not save" notice instead of a broken page.
function resolveStore() {
  try {
    return window.localStorage;
  } catch {
    return {
      getItem: () => null,
      setItem: () => {
        throw new Error('storage unavailable');
      },
    };
  }
}

const store = resolveStore();
const loaded = loadTasks(store);

const state = {
  tasks: loaded.tasks,
  filter: 'all',
  view: 'list',
  selectedId: null,
  formMode: null,
  notice: loaded.status === 'corrupt' ? { text: MESSAGES.unreadable, kind: 'status' } : null,
};

const appRoot = document.getElementById('app');
const noticeRoot = document.getElementById('notice');

function h(tag, props = {}, ...children) {
  const element = document.createElement(tag);
  for (const [name, value] of Object.entries(props)) {
    if (value === null || value === undefined || value === false) continue;
    if (name === 'class') {
      element.className = value;
    } else if (name.startsWith('on')) {
      element.addEventListener(name.slice(2).toLowerCase(), value);
    } else {
      element.setAttribute(name, value === true ? '' : value);
    }
  }
  element.append(...children);
  return element;
}

function showView(view, changes = {}) {
  Object.assign(state, { view, notice: null }, changes);
  render();
}

// Adopts the new list only when it was saved, so the screen never shows a
// change that is not persisted.
function commit(nextTasks, onSaved) {
  if (!saveTasks(store, nextTasks).ok) {
    state.notice = { text: MESSAGES.saveFailed, kind: 'alert' };
    renderNotice();
    return;
  }
  state.tasks = nextTasks;
  state.notice = null;
  onSaved();
}

function renderNotice() {
  if (!state.notice) {
    noticeRoot.replaceChildren();
    return;
  }
  const role = state.notice.kind === 'alert' ? 'alert' : null;
  noticeRoot.replaceChildren(h('p', { class: 'notice', role }, state.notice.text));
}

function renderTaskRow(task) {
  return h(
    'li',
    { class: 'task-row' },
    h('span', { class: 'status' }, task.done ? 'Done' : 'Pending'),
    h('span', { class: 'task-title' }, task.title),
  );
}

function renderList() {
  const visible = orderForDisplay(state.tasks);
  const body = visible.length
    ? h('ul', { class: 'task-list' }, ...visible.map(renderTaskRow))
    : h('p', { class: 'empty-state' }, MESSAGES.noTasks);
  return h(
    'section',
    {},
    h('h1', {}, APP_NAME),
    h(
      'button',
      { id: 'add-task', class: 'primary', type: 'button', onClick: () => showView('form', { formMode: 'add' }) },
      'Add task',
    ),
    body,
  );
}

function renderForm() {
  const titleInput = h('input', { id: 'task-title', name: 'title', type: 'text', autocomplete: 'off' });
  const descriptionInput = h('textarea', { id: 'task-description', name: 'description', rows: '4' });
  const titleError = h('p', { id: 'title-error', class: 'field-error', hidden: true }, MESSAGES.titleRequired);

  function handleSubmit(event) {
    event.preventDefault();
    const { valid } = validateTitle(titleInput.value);
    titleError.hidden = valid;
    if (!valid) {
      titleInput.setAttribute('aria-invalid', 'true');
      titleInput.setAttribute('aria-describedby', 'title-error');
      titleInput.focus();
      return;
    }
    titleInput.removeAttribute('aria-invalid');
    titleInput.removeAttribute('aria-describedby');
    const created = createTask(state.tasks, { title: titleInput.value, description: descriptionInput.value });
    commit(created.tasks, () => showView('list'));
  }

  return h(
    'section',
    {},
    h('h1', {}, 'New task'),
    h(
      'form',
      { novalidate: true, onSubmit: handleSubmit },
      h('div', { class: 'field' }, h('label', { class: 'field-label', for: 'task-title' }, 'Title'), titleInput, titleError),
      h('div', { class: 'field' }, h('label', { class: 'field-label', for: 'task-description' }, 'Description'), descriptionInput),
      h(
        'div',
        { class: 'actions' },
        h('button', { class: 'primary', type: 'submit' }, 'Save'),
        h('button', { type: 'button', onClick: () => showView('list') }, 'Cancel'),
      ),
    ),
  );
}

function render() {
  renderNotice();
  appRoot.replaceChildren(state.view === 'form' ? renderForm() : renderList());
}

render();
