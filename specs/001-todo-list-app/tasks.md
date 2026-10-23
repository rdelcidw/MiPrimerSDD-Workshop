---

description: "Lista de tareas para implementar Curso-PSWE-07"
---

# Tasks: Lista de tareas Curso-PSWE-07

**Input**: Documentos de diseño en `/specs/001-todo-list-app/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/data-logic.md, contracts/ui-contract.md, quickstart.md

**Tests**: Se incluyen pruebas automatizadas de la lógica de datos porque la constitución (Principio IV) las exige y deben pasar con `npm test`. La UI se verifica manualmente con quickstart.md.

**Organization**: Las tareas se agrupan por historia de usuario para implementarlas y probarlas de forma independiente.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Se puede ejecutar en paralelo (archivos distintos, sin dependencias pendientes)
- **[Story]**: Historia de usuario a la que pertenece (US1 a US5)
- Todas las rutas son relativas a la raíz del repositorio

## Path Conventions

Proyecto único estático (plan.md): `index.html`, `styles.css`, `package.json`, `src/tasks.js`, `src/storage.js`, `src/app.js`, `tests/tasks.test.js`, `tests/storage.test.js`. Solo `src/app.js` toca el DOM. Los textos de interfaz están en inglés (contracts/ui-contract.md).

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Estructura inicial del proyecto

- [ ] T001 Crear `package.json` en la raíz con `"type": "module"`, el script `"test": "node --test"` (sin argumento: Node descubre `tests/*.test.js`; pasar el directorio falla en Node 24) y sin dependencias; crear las carpetas `src/` y `tests/`
- [ ] T002 [P] Crear `index.html` con `<title>Curso-PSWE-07</title>`, meta viewport, `<link>` a `styles.css`, un contenedor `<main id="app">`, una región de avisos (`role="status"`), un `<dialog id="confirm-dialog">` vacío para la confirmación de eliminar y `<script type="module" src="src/app.js">`
- [ ] T003 [P] Crear `styles.css` con la base visual: fondo claro, una sola familia sans-serif, un solo color de acento, color atenuado y color de advertencia con contraste WCAG 2.1 AA, `:focus-visible` visible, botones e inputs con mínimo 44×44 px, contenedor centrado con ancho máximo y sin scroll horizontal de 320 a 1440 px

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Almacenamiento, validación y esqueleto de la UI que todas las historias necesitan

**⚠️ CRITICAL**: Ninguna historia puede empezar hasta completar esta fase

- [ ] T004 [P] Escribir `tests/storage.test.js` con un almacenamiento simulado (contracts/data-logic.md): clave ausente → `status 'empty'`; round-trip de `saveTasks` + `loadTasks` → `'ok'`; JSON inválido, valor que no es arreglo y tarea mal formada (sin `id` string, `title` vacío, `done` no booleano o `description` no string) → `'corrupt'` con `tasks = []`; `setItem` que lanza → `{ ok: false }`; `getItem` que lanza → `'corrupt'` sin lanzar; usar la clave `curso-pswe-07.tasks.v1`
- [ ] T005 Implementar `src/storage.js` con `loadTasks(store)` y `saveTasks(store, tasks)` según contracts/data-logic.md (nunca lanzan; clave `curso-pswe-07.tasks.v1`) hasta que pase `tests/storage.test.js`
- [ ] T006 [P] Escribir en `tests/tasks.test.js` las pruebas de `validateTitle(title)`: título vacío, solo espacios y con espacios alrededor ("recortar los espacios al inicio y al final; rechazar si queda vacío", FR-003)
- [ ] T007 Crear `src/tasks.js` con `validateTitle(title)` devolviendo `{ valid, title }` con el título recortado, hasta que pasen las pruebas de T006
- [ ] T008 Crear el esqueleto de `src/app.js`: estado en memoria según data-model.md (`tasks`, `filter = 'all'`, `view = 'list'`, `selectedId`, `formMode`, `notice`); resolver el `store` (`localStorage`, o uno de respaldo con `getItem` → `null` y `setItem` que lanza si acceder a `localStorage` lanza); cargar con `loadTasks` al iniciar y, si `status` es `'corrupt'`, fijar el aviso "Saved tasks could not be read."; función `render()` que despacha por `view` a funciones de pantalla (por ahora vacías) y muestra `notice`; función `commit(nextTasks, onSaved)` que aplica el protocolo de guardado (guardar con `saveTasks`; si `ok` adoptar `nextTasks` y llamar `onSaved`; si no, conservar `tasks`, no cambiar de pantalla y fijar el aviso "Could not save your changes." con `role="alert"`); el aviso se limpia (`notice = null`) en el siguiente guardado exitoso o al cambiar de pantalla

**Checkpoint**: La base está lista; `npm test` pasa y las historias pueden empezar

---

## Phase 3: User Story 1 - Ver y agregar tareas (Priority: P1) 🎯 MVP

**Goal**: Ver la lista, agregar una tarea con título y descripción opcional, y que persista al reabrir (FR-001 a FR-006, FR-009, FR-011)

**Independent Test**: Abrir la app sin datos, agregar dos tareas, recargar la página y verificar que ambas aparecen, la más reciente primero (quickstart.md pasos 1 a 3, 8 y 9)

### Tests for User Story 1

- [ ] T009 [P] [US1] Añadir en `tests/tasks.test.js` pruebas de `createTask(tasks, { title, description })` y `orderForDisplay(tasks)`: crea con `done = false` (FR-002), `id` único no vacío, título recortado, agrega al final sin mutar el arreglo original, rechaza título vacío o de solo espacios con `{ ok: false, error: 'empty-title' }`, y `orderForDisplay` devuelve las más recientes primero sin mutar el original

### Implementation for User Story 1

- [ ] T010 [US1] Implementar `createTask` y `orderForDisplay` en `src/tasks.js` (el `id` combina `Date.now()` en base 36 y un sufijo aleatorio; ver research.md R6) hasta que pasen las pruebas de T009
- [ ] T011 [US1] Implementar en `src/app.js` la pantalla To-Do List: encabezado "Curso-PSWE-07" (FR-005), botón "Add task" (FR-009), filas con indicador de estado (texto "Pending"/"Done") y el título en una línea con elipsis (FR-007), usando `orderForDisplay`, y el estado vacío "No tasks yet" con invitación a agregar (FR-011); el mensaje de filtro sin coincidencias se agrega en T032
- [ ] T012 [US1] Implementar en `src/app.js` el formulario en modo agregar: campos Title y Description con etiquetas, botones Save y Cancel; Save valida con `validateTitle` y, si queda vacío, muestra "Title is required" junto al campo sin guardar; si es válido usa `createTask` + `commit` y vuelve a la lista; Cancel vuelve a la lista sin crear nada
- [ ] T013 [P] [US1] Añadir en `styles.css` los estilos de la lista y el formulario: filas de al menos 44 px con título truncado con elipsis, botón "Add task" con el color de acento, encabezado, mensaje de validación asociado al campo, aviso y estado vacío
- [ ] T014 [US1] Validar manualmente la historia con quickstart.md pasos 1, 2, 3, 8 y 9 (estado vacío, validación, persistencia, datos corruptos con aviso, fallo de guardado que revierte)

**Checkpoint**: US1 funciona sola; es el MVP

---

## Phase 4: User Story 2 - Ver el detalle y cambiar el estado (Priority: P2)

**Goal**: Abrir una tarea, ver su detalle y marcarla como hecha o no hecha (FR-007, FR-008, FR-012 a FR-015)

**Independent Test**: Con una tarea existente, abrir su detalle, marcarla como hecha, volver y verificar que aparece tachada y atenuada (quickstart.md paso 4)

### Tests for User Story 2

- [ ] T015 [P] [US2] Añadir en `tests/tasks.test.js` pruebas de `toggleDone(tasks, id)`: alterna `done` de false a true y de true a false, conserva el resto de los campos y la posición, no muta el original, y un `id` inexistente devuelve el mismo contenido

### Implementation for User Story 2

- [ ] T016 [US2] Implementar `toggleDone` en `src/tasks.js` hasta que pasen las pruebas de T015
- [ ] T017 [US2] Implementar en `src/app.js` la pantalla To-Do Detail: control Back que vuelve a la lista (FR-012), título completo y destacado, descripción debajo o "No description" atenuado si está vacía (FR-013), etiqueta de estado "Done"/"Pending" (FR-014), y botón "Mark as done"/"Mark as not done" cuya etiqueta depende del estado actual y que usa `toggleDone` + `commit` y permanece en el detalle (FR-015); hacer que tocar una fila de la lista abra el detalle (FR-008)
- [ ] T018 [US2] Mostrar en las filas de la lista de `src/app.js` las tareas hechas con una clase de estado y el indicador "Done" (FR-007)
- [ ] T019 [P] [US2] Añadir en `styles.css` los estilos del detalle (título grande y en negrita, descripción más pequeña, etiqueta de estado, botones de 44 px) y de las filas hechas (tachado + color atenuado, sin depender solo del color)
- [ ] T020 [US2] Validar manualmente la historia con quickstart.md paso 4

**Checkpoint**: US1 y US2 funcionan de forma independiente

---

## Phase 5: User Story 3 - Editar una tarea (Priority: P3)

**Goal**: Corregir el título o la descripción desde el detalle (FR-003, FR-016)

**Independent Test**: Editar el título de una tarea, guardar, recargar y verificar que el cambio se conservó (quickstart.md paso 5)

### Tests for User Story 3

- [ ] T021 [P] [US3] Añadir en `tests/tasks.test.js` pruebas de `updateTask(tasks, id, { title, description })`: actualiza título y descripción, recorta el título, conserva `id`, `done` y posición, no muta el original, rechaza título vacío con `{ ok: false, error: 'empty-title' }` y un `id` inexistente con `{ ok: false, error: 'not-found' }`

### Implementation for User Story 3

- [ ] T022 [US3] Implementar `updateTask` en `src/tasks.js` hasta que pasen las pruebas de T021
- [ ] T023 [US3] Añadir en `src/app.js` el botón Edit en el detalle y el modo editar del formulario: reutiliza el formulario de agregar precargado con el título y la descripción actuales; Save valida con `validateTitle` (mensaje "Title is required"), usa `updateTask` + `commit` y vuelve al detalle con los datos nuevos; Cancel descarta siempre los cambios, sin preguntar, y vuelve al detalle sin modificar la tarea (FR-016)
- [ ] T024 [US3] Validar manualmente la historia con quickstart.md paso 5

**Checkpoint**: US1 a US3 funcionan de forma independiente

---

## Phase 6: User Story 4 - Eliminar una tarea con confirmación (Priority: P4)

**Goal**: Eliminar una tarea solo después de una confirmación explícita (FR-015, FR-017, SC-006)

**Independent Test**: Eliminar una tarea confirmando y verificar que desaparece también tras recargar; repetir cancelando y verificar que se conserva (quickstart.md paso 6)

### Tests for User Story 4

- [ ] T025 [P] [US4] Añadir en `tests/tasks.test.js` pruebas de `deleteTask(tasks, id)`: quita solo la tarea indicada, conserva el orden del resto, no muta el original y un `id` inexistente devuelve el mismo contenido

### Implementation for User Story 4

- [ ] T026 [US4] Implementar `deleteTask` en `src/tasks.js` hasta que pasen las pruebas de T025
- [ ] T027 [US4] Añadir en `src/app.js` el botón Delete en el detalle y el diálogo de confirmación con `<dialog id="confirm-dialog">` (modal): botones Delete (confirmar) y Cancel; confirmar usa `deleteTask` + `commit` y vuelve a la lista con el filtro vigente; cancelar cierra el diálogo y deja al usuario en el detalle sin eliminar nada (FR-017)
- [ ] T028 [P] [US4] Añadir en `styles.css` el color de advertencia distinto para Delete y los estilos del diálogo (botones de 44 px, foco visible, contraste AA)
- [ ] T029 [US4] Validar manualmente la historia con quickstart.md paso 6

**Checkpoint**: US1 a US4 funcionan de forma independiente

---

## Phase 7: User Story 5 - Filtrar por estado (Priority: P5)

**Goal**: Filtrar la lista por All, Pending o Done, conservando el filtro al volver del detalle (FR-010, FR-011)

**Independent Test** (requiere US2 para marcar tareas como hechas): Con tareas Pending y Done, probar cada filtro y verificar el resaltado, la lista y el mensaje de filtro sin coincidencias (quickstart.md paso 7)

### Tests for User Story 5

- [ ] T030 [P] [US5] Añadir en `tests/tasks.test.js` pruebas de `filterTasks(tasks, filter)`: `all` devuelve todas, `pending` solo las `done = false`, `done` solo las `done = true`, con tareas mezcladas, y devuelve arreglo vacío cuando no hay coincidencias

### Implementation for User Story 5

- [ ] T031 [US5] Implementar `filterTasks` en `src/tasks.js` hasta que pasen las pruebas de T030
- [ ] T032 [US5] Añadir en la pantalla To-Do List de `src/app.js` el filtro de tres botones All, Pending y Done: el activo con `aria-pressed="true"`, `state.filter` inicia siempre en `'all'` y no se persiste, la lista usa `filterTasks` antes de `orderForDisplay`, y el filtro se conserva al volver del detalle (Back, tras marcar estado o tras eliminar); mostrar "No tasks match this filter" cuando hay tareas pero el filtro no tiene coincidencias (el caso sin ninguna tarea sigue en "No tasks yet", T011)
- [ ] T033 [P] [US5] Añadir en `styles.css` los estilos del filtro: botones de 44 px y opción activa resaltada con el color de acento y un indicador que no dependa solo del color
- [ ] T034 [US5] Validar manualmente la historia con quickstart.md paso 7

**Checkpoint**: Las cinco historias funcionan de forma independiente

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Verificaciones transversales de los Principios I, III y V

- [ ] T035 Revisar accesibilidad (FR-021, FR-022, SC-004): operar todo con teclado, foco visible, etiquetas accesibles en campos y botones, estado no comunicado solo con color, y auditar con Lighthouse o axe (contraste AA y objetivos ≥ 44×44 px); corregir en `styles.css` y `src/app.js`
- [ ] T036 [P] Revisar el diseño responsivo (FR-023, SC-005) de 320 a 1440 px sin scroll horizontal, incluyendo títulos y descripciones largas, y corregir en `styles.css`
- [ ] T037 [P] Verificar el alcance (Principio I, FR-024): comparar `index.html`, `src/` y `styles.css` con idea.md y confirmar que no hay cuentas, categorías, fechas límite, prioridades, búsqueda, sincronización ni llamadas de red
- [ ] T038 Limpiar el código (Principio V): nombres descriptivos, funciones pequeñas, sin código muerto, comentado o duplicado, formato consistente en `src/`, `tests/`, `index.html` y `styles.css`
- [ ] T039 Ejecutar la validación completa de quickstart.md: `npm test` en verde y los 10 pasos del recorrido manual con `npx serve .`; verificar además SC-001 (un usuario nuevo agrega su primera tarea en menos de 30 s sin instrucciones) y SC-003 (marcar una tarea como hecha requiere como máximo 2 interacciones desde la lista)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sin dependencias
- **Foundational (Phase 2)**: depende de Setup; bloquea todas las historias
- **User Stories (Phase 3 a 7)**: dependen de Foundational; se recomienda el orden de prioridad P1 → P5
- **Polish (Phase 8)**: depende de las historias que se vayan a entregar

### User Story Dependencies

- **US1 (P1)**: tras Foundational; sin dependencias de otras historias
- **US2 (P2)**: tras Foundational; el detalle se abre desde las filas de la lista de US1 (T011)
- **US3 (P3)**: requiere el detalle y el formulario de US2 y US1 (T017, T012)
- **US4 (P4)**: requiere el detalle de US2 (T017)
- **US5 (P5)**: requiere la lista de US1 (T011) y el cambio de estado de US2 (T016, T017), porque validar los filtros Pending y Done necesita tareas hechas; el filtro vigente se conserva al volver desde el detalle de US2

### Within Each User Story

- Pruebas primero (deben fallar antes de implementar), luego la lógica en `src/tasks.js`, luego la UI en `src/app.js`, luego los estilos y por último la validación manual
- Las tareas que editan el mismo archivo (`src/tasks.js`, `src/app.js`, `tests/tasks.test.js`, `styles.css`) no se marcan [P] entre sí

### Parallel Opportunities

- Setup: T002 y T003 en paralelo
- Foundational: T004 y T006 en paralelo (archivos de prueba distintos)
- Dentro de cada historia: la tarea de pruebas [P] puede escribirse mientras se prepara el archivo de estilos [P]
- Con varias personas, tras Foundational: US1 primero; después US2, US4 y US5 pueden avanzar en paralelo salvo por los conflictos en `src/app.js`

---

## Parallel Example: User Story 1

```bash
# En paralelo (archivos distintos):
Task: "Añadir en tests/tasks.test.js pruebas de createTask y orderForDisplay"   # T009
Task: "Añadir en styles.css los estilos de la lista y el formulario"            # T013
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar Phase 1: Setup
2. Completar Phase 2: Foundational
3. Completar Phase 3: User Story 1
4. **DETENERSE Y VALIDAR**: probar US1 de forma independiente con quickstart.md
5. Demostrar si está lista

### Incremental Delivery

1. Setup + Foundational → base lista
2. US1 → validar → MVP
3. US2 → validar → demo
4. US3 → validar → demo
5. US4 → validar → demo
6. US5 → validar → demo
7. Polish → entrega

---

## Notes

- [P] = archivos distintos, sin dependencias pendientes
- [Story] vincula cada tarea con su historia para trazabilidad
- Verificar que las pruebas fallen antes de implementar
- Hacer commit tras cada tarea o grupo lógico (Conventional Commits)
- No agregar nada fuera de idea.md (Principio I)
