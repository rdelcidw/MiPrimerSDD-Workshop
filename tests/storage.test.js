import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadTasks, saveTasks, STORAGE_KEY } from '../src/storage.js';

function fakeStore(initial = {}) {
  const data = new Map(Object.entries(initial));
  return {
    getItem: (key) => (data.has(key) ? data.get(key) : null),
    setItem: (key, value) => data.set(key, value),
  };
}

const sampleTask = { id: 'a1', title: 'Comprar pan', description: '', done: false };

test('uses the versioned storage key', () => {
  assert.equal(STORAGE_KEY, 'curso-pswe-07.tasks.v1');
});

test('loadTasks reports empty when the key is absent', () => {
  assert.deepEqual(loadTasks(fakeStore()), { tasks: [], status: 'empty' });
});

test('saveTasks then loadTasks round-trips the tasks', () => {
  const store = fakeStore();
  assert.deepEqual(saveTasks(store, [sampleTask]), { ok: true });
  assert.deepEqual(loadTasks(store), { tasks: [sampleTask], status: 'ok' });
});

test('loadTasks reports ok for a stored empty list', () => {
  const store = fakeStore();
  saveTasks(store, []);
  assert.deepEqual(loadTasks(store), { tasks: [], status: 'ok' });
});

test('loadTasks reports corrupt for invalid JSON', () => {
  const store = fakeStore({ [STORAGE_KEY]: '{x' });
  assert.deepEqual(loadTasks(store), { tasks: [], status: 'corrupt' });
});

test('loadTasks reports corrupt when the value is not an array', () => {
  const store = fakeStore({ [STORAGE_KEY]: JSON.stringify({ id: 'a1' }) });
  assert.deepEqual(loadTasks(store), { tasks: [], status: 'corrupt' });
});

const malformedTasks = {
  'missing id': { title: 'x', description: '', done: false },
  'empty title': { id: 'a1', title: '', description: '', done: false },
  'non-boolean done': { id: 'a1', title: 'x', description: '', done: 'no' },
  'non-string description': { id: 'a1', title: 'x', description: 5, done: false },
};

for (const [label, task] of Object.entries(malformedTasks)) {
  test(`loadTasks reports corrupt for a task with ${label}`, () => {
    const store = fakeStore({ [STORAGE_KEY]: JSON.stringify([sampleTask, task]) });
    assert.deepEqual(loadTasks(store), { tasks: [], status: 'corrupt' });
  });
}

test('loadTasks does not throw when getItem throws', () => {
  const store = { getItem: () => { throw new Error('denied'); } };
  assert.deepEqual(loadTasks(store), { tasks: [], status: 'corrupt' });
});

test('saveTasks reports failure when setItem throws', () => {
  const store = { setItem: () => { throw new Error('quota exceeded'); } };
  assert.deepEqual(saveTasks(store, [sampleTask]), { ok: false });
});
