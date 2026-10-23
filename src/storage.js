export const STORAGE_KEY = 'curso-pswe-07.tasks.v1';

function isValidTask(task) {
  return (
    task !== null &&
    typeof task === 'object' &&
    typeof task.id === 'string' &&
    task.id !== '' &&
    typeof task.title === 'string' &&
    task.title.trim() !== '' &&
    typeof task.description === 'string' &&
    typeof task.done === 'boolean'
  );
}

export function loadTasks(store) {
  const unreadable = { tasks: [], status: 'corrupt' };
  let raw;
  try {
    raw = store.getItem(STORAGE_KEY);
  } catch {
    return unreadable;
  }
  if (raw === null || raw === undefined) {
    return { tasks: [], status: 'empty' };
  }
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.every(isValidTask)) {
      return { tasks: parsed, status: 'ok' };
    }
  } catch {
    // Invalid JSON is handled as unreadable data below.
  }
  return unreadable;
}

export function saveTasks(store, tasks) {
  try {
    store.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return { ok: true };
  } catch {
    return { ok: false };
  }
}
