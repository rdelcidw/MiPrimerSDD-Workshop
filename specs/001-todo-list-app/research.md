# Research: Lista de tareas Curso-PSWE-07

El contexto técnico no dejó `NEEDS CLARIFICATION`; este documento registra las decisiones
de diseño y sus alternativas.

## R1. Framework de UI

- **Decision**: HTML + CSS + JavaScript puro, sin framework ni build.
- **Rationale**: dos pantallas y un formulario no justifican un framework (Principio II).
- **Alternatives considered**: React/Vue/Svelte (requieren dependencia y build, sin beneficio a esta escala).

## R2. Servidor local y módulos ES

- **Decision**: servir con `npx serve` (servidor estático) y cargar el código con módulos ES
  (`<script type="module">`). `serve` no se agrega a `package.json`.
- **Rationale**: los módulos ES no cargan desde `file://` en Chrome (CORS), por eso se
  necesita un servidor estático; `npx serve` no requiere instalar nada de forma permanente
  y no es una dependencia del proyecto. Los módulos ES permiten que Node importe la misma
  lógica en las pruebas sin adaptadores.
- **Alternatives considered**: scripts clásicos con export condicional para abrir con doble
  clic (código de compatibilidad extra); `python -m http.server` (requiere otro runtime).

## R3. Persistencia

- **Decision**: `localStorage`, clave `curso-pswe-07.tasks.v1`, valor JSON con el arreglo de
  tareas. El objeto de almacenamiento se inyecta en `storage.js` para simularlo en pruebas.
- **Rationale**: cumple la constitución y el volumen esperado. El sufijo `v1` permite migrar el formato.
- **Alternatives considered**: IndexedDB (complejidad innecesaria).

## R4. Fallos de almacenamiento (de la spec)

- **Decision**: la lógica es inmutable. La UI calcula la lista siguiente, intenta guardarla y
  solo si el guardado tiene éxito la adopta como estado; si falla, conserva la anterior,
  no cambia de pantalla y muestra el aviso. Así "el cambio se revierte" sin lógica de deshacer.
- **Rationale**: simple, probable de forma aislada; la pantalla siempre coincide con lo guardado.
- **Alternatives considered**: mantener el cambio en memoria con aviso (la pantalla divergiría de lo guardado); reintentos (no pedidos).

## R5. Datos corruptos (de la spec)

- **Decision**: `loadTasks()` devuelve `{ tasks, status }` con `status` ∈ `ok | empty | corrupt`.
  Es corrupto si el JSON no parsea o no es un arreglo de tareas válidas. Con `corrupt` la UI
  muestra la lista vacía y un aviso; el siguiente guardado exitoso reemplaza el contenido.
- **Rationale**: evita pantalla en blanco y no agrega recuperación no pedida (sin respaldo, decisión del usuario).
- **Alternatives considered**: conservar respaldo de lo ilegible (descartado en Clarifications).

## R6. Orden e identificadores

- **Decision**: el arreglo guarda las tareas en orden de creación (nueva al final); la lista
  lo invierte para mostrar primero las más recientes. El `id` combina `Date.now()` en base 36
  y un sufijo aleatorio.
- **Rationale**: no hace falta guardar fecha de creación; el orden del arreglo la representa
  y se evita un atributo no descrito en idea.md. `crypto.randomUUID` solo existe en contextos
  seguros; con `npx serve` en `localhost` funcionaría, pero un id propio evita depender de ello.
- **Alternatives considered**: campo `createdAt` (atributo extra).

## R7. Navegación entre pantallas

- **Decision**: estado en memoria (`view`, `selectedId`, `filter`, `formMode`, `notice`) y
  re-render; sin enrutado por URL.
- **Rationale**: la spec no pide enlaces profundos; el filtro vigente se conserva al vivir en
  el estado y, al recargar, se abre la lista con "All".
- **Alternatives considered**: enrutado por hash (más código; no requerido).

## R8. Confirmación de eliminar

- **Decision**: elemento `<dialog>` modal propio con botones de confirmar y cancelar.
- **Rationale**: permite el color de advertencia y objetivos de 44 px, y el navegador gestiona el foco.
- **Alternatives considered**: `window.confirm` (no estilizable).

## R9. Pruebas

- **Decision**: `node --test` sobre `tests/*.test.js`, comando `npm test`. Cubre validación,
  operaciones, filtrado, orden y `storage.js` con un almacenamiento simulado (ok, vacío,
  corrupto, fallo de escritura). La UI se verifica manualmente con quickstart.md.
- **Rationale**: Principio IV; sin dependencias.
- **Alternatives considered**: Jest/Vitest (dependencia injustificada).
