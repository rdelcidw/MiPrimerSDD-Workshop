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
