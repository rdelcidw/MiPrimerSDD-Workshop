# Data Model: Lista de tareas Curso-PSWE-07

## Entidad: Tarea

| Campo | Tipo | Obligatorio | Reglas |
|-------|------|-------------|--------|
| `id` | string | Sí | Único, generado al crear, nunca cambia |
| `title` | string | Sí | Se recortan espacios al inicio y al final; no puede quedar vacío (FR-003) |
| `description` | string | No | Puede ser `""`; no se valida (FR-001) |
| `done` | boolean | Sí | `false` al crear (FR-002) |

No hay más atributos (FR-024): sin fechas, prioridad, categoría ni dueño.

## Colección

- Arreglo de tareas en **orden de creación** (la más nueva al final). La lista lo invierte
  para mostrar primero las más recientes (FR-006).
- Editar o cambiar el estado no cambia la posición. Eliminar quita el elemento.

## Estado de la aplicación (en memoria, no persistido)

| Campo | Valores | Notas |
|-------|---------|-------|
| `tasks` | arreglo de Tarea | Reflejo exacto de lo guardado |
| `filter` | `all` \| `pending` \| `done` | Inicia siempre en `all` (FR-010) |
| `view` | `list` \| `detail` \| `form` | Pantalla visible |
| `selectedId` | string \| null | Tarea abierta en detalle o en edición |
| `formMode` | `add` \| `edit` | Solo cuando `view = form` |
| `notice` | string \| null | Aviso visible (datos ilegibles o fallo al guardar) |

## Transiciones

```text
list --(Add task)--> form[add] --(Save válido, guardado ok)--> list
                               --(Cancel)------------------> list
list --(tocar fila)--> detail --(Back)--> list (mismo filtro)
detail --(Edit)--> form[edit] --(Save válido, guardado ok)--> detail
                              --(Cancel)------------------> detail (sin cambios)
detail --(Mark as done / not done, guardado ok)--> detail (done invertido)
detail --(Delete)--> confirmación --(confirmar, guardado ok)--> list (mismo filtro)
                                  --(cancelar)---------------> detail
```

Si un guardado falla, la transición no ocurre: se conserva el estado anterior y se muestra
el aviso (spec: Edge Cases).

## Formato persistido

- Clave `localStorage`: `curso-pswe-07.tasks.v1`.
- Valor: JSON de un arreglo de tareas, p. ej.
  `[{"id":"lx3k9a-f2","title":"Comprar pan","description":"","done":false}]`.
- Clave ausente = `empty`. JSON inválido, no arreglo o tarea mal formada = `corrupt`.
