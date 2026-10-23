# Contrato: lógica de datos y almacenamiento

Módulos ES en `src/tasks.js` y `src/storage.js`. No tocan el DOM ni `window`. Ninguna
función muta sus argumentos: devuelven nuevos valores.

## `src/tasks.js`

| Función | Entrada | Salida | Reglas |
|---------|---------|--------|--------|
| `validateTitle(title)` | string | `{ valid, title }` | `title` ya recortado; `valid = false` si queda vacío (FR-003) |
| `createTask(tasks, { title, description })` | arreglo, datos | `{ ok: true, tasks }` o `{ ok: false, error: 'empty-title' }` | Agrega al final con `done = false` e `id` nuevo (FR-002) |
| `updateTask(tasks, id, { title, description })` | arreglo, id, datos | `{ ok: true, tasks }` o `{ ok: false, error }` | `error`: `'empty-title'` o `'not-found'`; conserva `id`, `done` y posición |
| `toggleDone(tasks, id)` | arreglo, id | arreglo | Invierte `done`; id inexistente → mismo contenido |
| `deleteTask(tasks, id)` | arreglo, id | arreglo | Quita la tarea; id inexistente → mismo contenido |
| `filterTasks(tasks, filter)` | arreglo, `all`\|`pending`\|`done` | arreglo | `pending` = `done false`; `done` = `done true` (FR-010) |
| `orderForDisplay(tasks)` | arreglo | arreglo | Más recientes primero (FR-006) |

## `src/storage.js`

| Función | Entrada | Salida | Reglas |
|---------|---------|--------|--------|
| `loadTasks(store)` | objeto con `getItem` | `{ tasks, status }` | `'ok'` datos válidos; `'empty'` clave ausente; `'corrupt'` JSON o forma inválidos (`tasks = []`). Nunca lanza. |
| `saveTasks(store, tasks)` | objeto con `setItem`, arreglo | `{ ok }` | `ok = false` si `setItem` lanza (lleno o no disponible). Nunca lanza. |

`store` es `window.localStorage` en el navegador y un doble de prueba en Node. Si acceder a
`localStorage` lanza al arrancar, `app.js` usa un `store` cuyo `getItem` devuelve `null` y
cuyo `setItem` lanza, lo que produce el aviso de "no se pudo guardar".

## Protocolo de uso desde la UI (revertir si falla el guardado)

1. `next = operación(tasks, ...)`; si `ok: false`, mostrar validación y detenerse.
2. `{ ok } = saveTasks(store, next)`.
3. Si `ok`: `state.tasks = next` y continuar la transición. Si no: conservar `state.tasks`,
   mostrar el aviso y no cambiar de pantalla.

## Casos que las pruebas MUST cubrir

- Título vacío, de solo espacios y con espacios alrededor (se recorta).
- Crear: `done = false`, `id` único, posición final; orden de visualización invertido.
- Editar: conserva `id`, `done` y posición; rechaza título vacío; `not-found`.
- Alternar y eliminar: efecto correcto, sin mutar el original; id inexistente.
- Filtrar: los tres filtros, con tareas mezcladas y sin coincidencias.
- Almacenamiento: ausente → `empty`; round-trip → `ok`; JSON inválido, no arreglo y tarea
  mal formada → `corrupt`; `setItem` que lanza → `{ ok: false }`.
