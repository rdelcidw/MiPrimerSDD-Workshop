# Quickstart: validación de Curso-PSWE-07

## Requisitos

- Node.js 20+ y un navegador moderno. No hay dependencias que instalar.

## Pruebas de lógica (Principio IV)

```text
npm test
```

Esperado: todas las pruebas de `tests/tasks.test.js` y `tests/storage.test.js` pasan.
Los casos cubiertos están en [contracts/data-logic.md](contracts/data-logic.md).

## Ejecutar la aplicación

```text
npx serve .
```

Abrir la URL que imprime `serve` (normalmente http://localhost:3000).

## Recorrido manual (criterios de la spec)

1. **Vacío** (Story 1): con almacenamiento limpio se ve "Curso-PSWE-07", "Add task" y un mensaje de lista vacía. La pestaña dice "Curso-PSWE-07".
2. **Agregar**: crear "Comprar pan" → aparece Pending al inicio. Guardar con título vacío y con solo espacios → mensaje "Title is required" y no se crea. Cancel no crea nada.
3. **Persistencia** (SC-002): recargar la página → las tareas siguen con el mismo título, descripción y estado.
4. **Detalle y estado** (Story 2): abrir una tarea; sin descripción se ve "No description" atenuado; "Mark as done" cambia la etiqueta a Done y el botón a "Mark as not done"; en la lista aparece tachada y atenuada.
5. **Editar** (Story 3): Edit precarga los valores; cambiar y guardar actualiza el detalle; vaciar el título muestra validación; Cancel descarta sin preguntar.
6. **Eliminar** (Story 4): Delete pide confirmación; cancelar mantiene la tarea y el detalle; confirmar la elimina y vuelve a la lista con el filtro vigente.
7. **Filtro** (Story 5): All/Pending/Done muestran lo correcto y el activo se resalta; con Pending activo, marcar una tarea como hecha y volver → ya no aparece; recargar → vuelve a All; filtro sin coincidencias → mensaje amigable.
8. **Datos corruptos**: en la consola del navegador, `localStorage.setItem('curso-pswe-07.tasks.v1', '{x')` y recargar → lista vacía con el aviso; agregar una tarea reemplaza el contenido.
9. **Fallo al guardar**: simular un guardado que lanza (p. ej. sustituir `Storage.prototype.setItem` por una función que lance) y agregar una tarea → no aparece y se muestra "Could not save your changes."
10. **Accesibilidad y responsivo** (SC-004, SC-005): auditar con Lighthouse o axe (contraste AA, objetivos ≥ 44 px); revisar anchos de 320 a 1440 px sin scroll horizontal; recorrer todo con teclado con foco visible.
