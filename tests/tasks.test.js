import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  validateTitle,
  createTask,
  orderForDisplay,
  toggleDone,
  updateTask,
  deleteTask,
  filterTasks,
} from '../src/tasks.js';

function buildTasks(...titles) {
  return titles.reduce((list, title) => createTask(list, { title }).tasks, []);
}

test('validateTitle rejects an empty title', () => {
  assert.deepEqual(validateTitle(''), { valid: false, title: '' });
});

test('validateTitle rejects a title made only of spaces', () => {
  assert.deepEqual(validateTitle('   \t '), { valid: false, title: '' });
});

test('validateTitle trims spaces around a valid title', () => {
  assert.deepEqual(validateTitle('  Comprar pan  '), { valid: true, title: 'Comprar pan' });
});

test('createTask appends a pending task with a trimmed title', () => {
  const result = createTask([], { title: '  Comprar pan ', description: 'Integral' });
  assert.equal(result.ok, true);
  assert.equal(result.tasks.length, 1);
  const [task] = result.tasks;
  assert.equal(task.title, 'Comprar pan');
  assert.equal(task.description, 'Integral');
  assert.equal(task.done, false);
  assert.equal(typeof task.id, 'string');
  assert.notEqual(task.id, '');
});

test('createTask defaults the description to an empty string', () => {
  const { tasks } = createTask([], { title: 'Sin descripción' });
  assert.equal(tasks[0].description, '');
});

test('createTask adds the new task last and does not mutate the original', () => {
  const original = createTask([], { title: 'Primera' }).tasks;
  const snapshot = structuredClone(original);
  const { tasks } = createTask(original, { title: 'Segunda' });
  assert.deepEqual(original, snapshot);
  assert.deepEqual(tasks.map((task) => task.title), ['Primera', 'Segunda']);
});

test('createTask generates unique ids', () => {
  let tasks = [];
  for (let index = 0; index < 50; index += 1) {
    tasks = createTask(tasks, { title: `Tarea ${index}` }).tasks;
  }
  assert.equal(new Set(tasks.map((task) => task.id)).size, 50);
});

test('createTask rejects an empty or whitespace-only title', () => {
  assert.deepEqual(createTask([], { title: '' }), { ok: false, error: 'empty-title' });
  assert.deepEqual(createTask([], { title: '   ' }), { ok: false, error: 'empty-title' });
});

test('orderForDisplay lists the most recent tasks first without mutating', () => {
  const tasks = ['Primera', 'Segunda', 'Tercera'].reduce(
    (list, title) => createTask(list, { title }).tasks,
    [],
  );
  const snapshot = structuredClone(tasks);
  assert.deepEqual(
    orderForDisplay(tasks).map((task) => task.title),
    ['Tercera', 'Segunda', 'Primera'],
  );
  assert.deepEqual(tasks, snapshot);
});

test('toggleDone flips done in both directions and keeps the other fields', () => {
  const tasks = buildTasks('Primera', 'Segunda');
  const [first, second] = tasks;
  const doneOnce = toggleDone(tasks, first.id);
  assert.deepEqual(doneOnce[0], { ...first, done: true });
  assert.deepEqual(doneOnce[1], second);
  assert.equal(toggleDone(doneOnce, first.id)[0].done, false);
});

test('toggleDone does not mutate the original and ignores unknown ids', () => {
  const tasks = buildTasks('Primera');
  const snapshot = structuredClone(tasks);
  toggleDone(tasks, tasks[0].id);
  assert.deepEqual(tasks, snapshot);
  assert.deepEqual(toggleDone(tasks, 'missing'), snapshot);
});

test('updateTask changes title and description, trims the title and keeps id, done and position', () => {
  const tasks = buildTasks('Primera', 'Segunda');
  const target = tasks[0];
  const result = updateTask(tasks, target.id, { title: '  Nuevo título ', description: 'Detalle' });
  assert.equal(result.ok, true);
  assert.deepEqual(result.tasks[0], { ...target, title: 'Nuevo título', description: 'Detalle' });
  assert.deepEqual(result.tasks[1], tasks[1]);
});

test('updateTask keeps done when the edited task was already done', () => {
  const base = buildTasks('Primera');
  const tasks = toggleDone(base, base[0].id);
  const { tasks: updated } = updateTask(tasks, base[0].id, { title: 'Editada', description: '' });
  assert.equal(updated[0].done, true);
});

test('updateTask does not mutate the original', () => {
  const tasks = buildTasks('Primera');
  const snapshot = structuredClone(tasks);
  updateTask(tasks, tasks[0].id, { title: 'Otra', description: '' });
  assert.deepEqual(tasks, snapshot);
});

test('updateTask rejects an empty title and unknown ids', () => {
  const tasks = buildTasks('Primera');
  assert.deepEqual(updateTask(tasks, tasks[0].id, { title: '  ', description: '' }), {
    ok: false,
    error: 'empty-title',
  });
  assert.deepEqual(updateTask(tasks, 'missing', { title: 'Algo', description: '' }), {
    ok: false,
    error: 'not-found',
  });
});

test('deleteTask removes only the chosen task and keeps the order of the rest', () => {
  const tasks = buildTasks('Primera', 'Segunda', 'Tercera');
  const remaining = deleteTask(tasks, tasks[1].id);
  assert.deepEqual(remaining.map((task) => task.title), ['Primera', 'Tercera']);
});

test('deleteTask does not mutate the original and ignores unknown ids', () => {
  const tasks = buildTasks('Primera');
  const snapshot = structuredClone(tasks);
  deleteTask(tasks, tasks[0].id);
  assert.deepEqual(tasks, snapshot);
  assert.deepEqual(deleteTask(tasks, 'missing'), snapshot);
});

test('filterTasks returns all, pending or done tasks', () => {
  const base = buildTasks('Primera', 'Segunda', 'Tercera');
  const tasks = toggleDone(base, base[1].id);
  assert.equal(filterTasks(tasks, 'all').length, 3);
  assert.deepEqual(filterTasks(tasks, 'pending').map((task) => task.title), ['Primera', 'Tercera']);
  assert.deepEqual(filterTasks(tasks, 'done').map((task) => task.title), ['Segunda']);
});

test('filterTasks returns an empty list when nothing matches', () => {
  const tasks = buildTasks('Primera');
  assert.deepEqual(filterTasks(tasks, 'done'), []);
  assert.deepEqual(filterTasks([], 'pending'), []);
});
