export function validateTitle(title) {
  const trimmed = String(title ?? '').trim();
  return { valid: trimmed !== '', title: trimmed };
}

// Date.now() keeps ids roughly ordered; the random suffix and the uniqueness
// loop cover tasks created within the same millisecond.
function generateId(tasks) {
  const taken = new Set(tasks.map((task) => task.id));
  let id;
  do {
    id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  } while (taken.has(id));
  return id;
}

export function createTask(tasks, { title, description = '' }) {
  const validation = validateTitle(title);
  if (!validation.valid) {
    return { ok: false, error: 'empty-title' };
  }
  const task = { id: generateId(tasks), title: validation.title, description, done: false };
  return { ok: true, tasks: [...tasks, task] };
}

// Tasks are stored oldest first, so the newest-first display is a reversal.
export function orderForDisplay(tasks) {
  return [...tasks].reverse();
}

export function toggleDone(tasks, id) {
  return tasks.map((task) => (task.id === id ? { ...task, done: !task.done } : task));
}

export function updateTask(tasks, id, { title, description = '' }) {
  const validation = validateTitle(title);
  if (!validation.valid) {
    return { ok: false, error: 'empty-title' };
  }
  if (!tasks.some((task) => task.id === id)) {
    return { ok: false, error: 'not-found' };
  }
  const updated = tasks.map((task) =>
    task.id === id ? { ...task, title: validation.title, description } : task,
  );
  return { ok: true, tasks: updated };
}

export function deleteTask(tasks, id) {
  return tasks.filter((task) => task.id !== id);
}

const FILTERS = {
  all: () => true,
  pending: (task) => !task.done,
  done: (task) => task.done,
};

export function filterTasks(tasks, filter) {
  return tasks.filter(FILTERS[filter] ?? FILTERS.all);
}
