import { loadTasks, saveTasks } from './storage.js';
import {
  validateTitle,
  createTask,
  updateTask,
  toggleDone,
  deleteTask,
  filterTasks,
  orderForDisplay,
} from './tasks.js';

const APP_NAME = 'Curso-PSWE-07';

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'done', label: 'Done' },
];

const MESSAGES = {
  unreadable: 'Saved tasks could not be read.',
  saveFailed: 'Could not save your changes.',
  titleRequired: 'Title is required',
  noTasks: 'No tasks yet. Add your first one!',
  noMatches: 'No tasks match this filter.',
  noDescription: 'No description',
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
const confirmDialog = document.getElementById('confirm-dialog');

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

function selectedTask() {
  return state.tasks.find((task) => task.id === state.selectedId);
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

function statusLabel(task) {
  return h('span', { class: task.done ? 'status status--done' : 'status' }, task.done ? 'Done' : 'Pending');
}

function renderTaskRow(task) {
  const open = () => showView('detail', { selectedId: task.id });
  return h(
    'li',
    {},
    h(
      'button',
      { class: task.done ? 'task-row task-row--done' : 'task-row', type: 'button', onClick: open },
      statusLabel(task),
      h('span', { class: 'task-title' }, task.title),
    ),
  );
}

function renderFilter() {
  const buttons = FILTERS.map(({ id, label }) =>
    h(
      'button',
      {
        type: 'button',
        class: 'filter-option',
        'aria-pressed': String(state.filter === id),
        onClick: () => {
          state.filter = id;
          render();
        },
      },
      label,
    ),
  );
  return h('div', { class: 'filter', role: 'group', 'aria-label': 'Filter tasks' }, ...buttons);
}

function renderList() {
  const visible = orderForDisplay(filterTasks(state.tasks, state.filter));
  let body;
  if (visible.length) {
    body = h('ul', { class: 'task-list' }, ...visible.map(renderTaskRow));
  } else {
    const message = state.tasks.length ? MESSAGES.noMatches : MESSAGES.noTasks;
    body = h('p', { class: 'empty-state' }, message);
  }
  return h(
    'section',
    {},
    h('h1', {}, APP_NAME),
    h(
      'button',
      { id: 'add-task', class: 'primary', type: 'button', onClick: () => showView('form', { formMode: 'add' }) },
      'Add task',
    ),
    renderFilter(),
    body,
  );
}

function renderDetail() {
  const task = selectedTask();
  if (!task) {
    showView('list', { selectedId: null });
    return h('section');
  }
  const description = task.description
    ? h('p', { class: 'detail-description' }, task.description)
    : h('p', { class: 'detail-description detail-description--empty' }, MESSAGES.noDescription);

  return h(
    'section',
    {},
    h('button', { class: 'back', type: 'button', onClick: () => showView('list', { selectedId: null }) }, '← Back'),
    h('h1', { class: 'detail-title' }, task.title),
    description,
    h('p', {}, statusLabel(task)),
    h(
      'div',
      { class: 'actions' },
      h('button', { type: 'button', onClick: () => showView('form', { formMode: 'edit' }) }, 'Edit'),
      h(
        'button',
        { type: 'button', onClick: () => commit(toggleDone(state.tasks, task.id), render) },
        task.done ? 'Mark as not done' : 'Mark as done',
      ),
      h('button', { class: 'danger', type: 'button', onClick: () => askToDelete(task) }, 'Delete'),
    ),
  );
}

function askToDelete(task) {
  const confirmDelete = () => {
    confirmDialog.close();
    commit(deleteTask(state.tasks, task.id), () => showView('list', { selectedId: null }));
  };
  confirmDialog.replaceChildren(
    h('h2', { id: 'confirm-title' }, 'Delete this task?'),
    h('p', {}, `"${task.title}" will be deleted permanently.`),
    h(
      'div',
      { class: 'actions' },
      h('button', { class: 'danger', type: 'button', onClick: confirmDelete }, 'Delete'),
      h('button', { type: 'button', onClick: () => confirmDialog.close() }, 'Cancel'),
    ),
  );
  confirmDialog.showModal();
}

function renderForm() {
  const editing = state.formMode === 'edit';
  const task = editing ? selectedTask() : null;
  const titleInput = h('input', {
    id: 'task-title',
    name: 'title',
    type: 'text',
    autocomplete: 'off',
    value: task ? task.title : null,
  });
  const descriptionInput = h('textarea', { id: 'task-description', name: 'description', rows: '4' }, task ? task.description : '');
  const titleError = h('p', { id: 'title-error', class: 'field-error', hidden: true }, MESSAGES.titleRequired);

  function save() {
    const draft = { title: titleInput.value, description: descriptionInput.value };
    if (editing) {
      const updated = updateTask(state.tasks, task.id, draft);
      commit(updated.tasks, () => showView('detail'));
    } else {
      const created = createTask(state.tasks, draft);
      commit(created.tasks, () => showView('list'));
    }
  }

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
    save();
  }

  const cancel = () => showView(editing ? 'detail' : 'list');

  return h(
    'section',
    {},
    h('h1', {}, editing ? 'Edit task' : 'New task'),
    h(
      'form',
      { novalidate: true, onSubmit: handleSubmit },
      h('div', { class: 'field' }, h('label', { class: 'field-label', for: 'task-title' }, 'Title'), titleInput, titleError),
      h('div', { class: 'field' }, h('label', { class: 'field-label', for: 'task-description' }, 'Description'), descriptionInput),
      h(
        'div',
        { class: 'actions' },
        h('button', { class: 'primary', type: 'submit' }, 'Save'),
        h('button', { type: 'button', onClick: cancel }, 'Cancel'),
      ),
    ),
  );
}

const SCREENS = { list: renderList, detail: renderDetail, form: renderForm };

function render() {
  renderNotice();
  appRoot.replaceChildren(SCREENS[state.view]());
}

render();
