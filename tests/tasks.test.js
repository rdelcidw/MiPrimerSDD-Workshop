import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateTitle, createTask, orderForDisplay } from '../src/tasks.js';

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
