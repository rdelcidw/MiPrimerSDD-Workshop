# 01 — Hallazgos de la auditoría de `requirements/spec-inicial.md`

Comparación base: `idea.md` (lo que pidió el usuario) vs `requirements/spec-inicial.md` (lo que generó la IA).
Las citas de la spec están en inglés porque la spec original lo está. Los números de línea son de cada archivo.

## Resumen de verificación de candidatos

| # | Candidato | Resultado | Severidad |
|---|---|---|---|
| H1 | Confirmación de borrado perdida | **Confirmado** | Alta |
| H2 | Sección VISUAL DESIGN omitida | **Confirmado** (con detalle de qué sí y qué no quedó cubierto) | Alta |
| H3 | "Guardado" no definido | **Confirmado** (agravado: Assumptions es circular) | Alta |
| H4 | Filtro vs cambio de estado | **Confirmado** (agrego caso "agregar tarea con filtro Done activo") | Media |
| H5 | Criterios de éxito no verificables | **Confirmado** (SC-001/002/004; SC-003 es circular) | Alta |
| H6 | Supuestos introducidos por la IA | **Ajustado**: "single user" SÍ se deduce de `idea.md` (no accounts / no sync); los supuestos realmente nuevos son otros | Media |
| H7 | Orden de la lista | **Confirmado** | Media |
| H8 | Cambio de estado desde la lista | **Ajustado**: `idea.md` indica que tocar la fila abre el detalle, así que el indicador es casi seguro informativo; el hueco real es que la spec no define qué muestra cada fila | Baja–Media |
| H9 | Qué pasa después de eliminar | **Confirmado** | Media |
| H10 | **Nuevo**: US3-3 contradice `idea.md` ("No description") | Nuevo | Media |
| H11 | **Nuevo**: opciones del filtro y terminología no definidas en los requisitos | Nuevo | Baja–Media |
| H12 | **Nuevo**: flujo de "Add task" y Save/Cancel sin definir | Nuevo | Media |

Marcas de decisión pendiente: `[DECISIÓN DEL USUARIO]` (se resuelven en la Fase 4).

---

## H1 — La confirmación antes de eliminar desapareció

1. **Fragmento de la especificación**
   - FR-010: *"The To-Do Detail screen MUST allow the user to delete the selected task."*
   - US3, escenario 2: *"**Given** a task is open, **When** the user deletes it, **Then** the task is removed and no longer appears in the list."*
   - Contra `idea.md` (línea 16): *"Delete uses a distinct warning color and asks for confirmation first."*
2. **Problema identificado**: un requisito explícito del usuario (confirmación previa) no aparece en ningún FR, escenario ni caso borde. La spec describe borrado inmediato, que contradice a `idea.md`.
3. **Posible consecuencia**
   - Usuario: borrado accidental sin red de seguridad; un toque mal dado pierde datos persistidos.
   - Desarrollo: implementan borrado directo porque la spec es lo que leen.
   - Validación: las pruebas de aceptación pasarían con un comportamiento que el usuario no pidió.
4. **Propuesta de mejora**: agregar un FR (p. ej. FR-013) y un escenario: al pulsar Delete se muestra una confirmación; solo al confirmar se elimina; al cancelar la tarea permanece sin cambios. Reescribir US3-2 en consecuencia.
5. **Justificación**: es un requisito explícito del usuario que se perdió en la traducción; recuperarlo no agrega alcance, restituye el original.

## H2 — Toda la sección VISUAL DESIGN de `idea.md` quedó fuera de los requisitos

1. **Fragmento de la especificación**: el campo **Input** de la spec resume la idea como *"…Keep the experience simple and do not add unrequested features."* y la sección *Requirements* (FR-001 a FR-012) no contiene ningún requisito visual. Solo el estado vacío (FR-012) y la validación de título (edge case 1) coinciden parcialmente con `idea.md` líneas 11–17.
2. **Problema identificado**: ítems explícitos de `idea.md` sin cobertura en la spec:
   - Nombre "Curso-PSWE-07" en el header de la lista **y** como título de aplicación/ventana (línea 12).
   - Estilo: fondo claro, un solo color de acento (acciones primarias y filtro activo), una familia sans-serif, títulos más grandes/negrita que descripciones (línea 13).
   - Contraste suficiente, targets táctiles/click ≥ 44×44 px, layout responsive móvil y escritorio (línea 14).
   - Lista: filtro activo resaltado; cada fila con indicador de estado + título; completadas con tachado y color atenuado; tocar fila abre detalle; botón "Add task" claramente visible que abre formulario con título y descripción (línea 15).
   - Detalle: control de volver; título prominente con descripción debajo; **etiqueta visible de estado (Done / Pending)**; tres acciones Edit / Mark as done–not done (la etiqueta cambia con el estado) / Delete en color de advertencia (línea 16).
   - Edición: reutiliza el formulario de alta con **Save y Cancel** (línea 17).
3. **Posible consecuencia**
   - Usuario: obtiene una app funcional pero sin la identidad, accesibilidad ni jerarquía visual que pidió.
   - Desarrollo: sin requisito trazable, estos puntos se omiten o se interpretan libremente.
   - Validación: no hay criterio contra el cual probar (p. ej. tamaño 44 px, tachado).
4. **Propuesta de mejora**: agregar una sección de requisitos de presentación con IDs nuevos (sin renumerar los existentes), cada uno con criterio verificable (p. ej. "todo control interactivo mide ≥ 44×44 px"; "el título de ventana es exactamente `Curso-PSWE-07`"). Agregar escenarios para fila de completada (tachado + atenuado), filtro activo resaltado y etiqueta de estado.
5. **Justificación**: son requisitos explícitos y verificables; omitirlos hace que la spec no represente la idea. No se agrega nada fuera de `idea.md`.

> Nota de alcance: `idea.md` no dice si es app web, móvil o de escritorio (habla de "tap/click", "mobile and desktop", "window title"). La plataforma **no es decisión de la spec**: se resuelve en `plan.md`. En la spec solo se conservan los requisitos de comportamiento de `idea.md` (responsive, targets ≥ 44×44 px, título de ventana "Curso-PSWE-07").

## H3 — "Guardado" no está definido (Caso A)

1. **Fragmento de la especificación**
   - FR-011: *"The application MUST retain task additions, edits, completion-status changes, and deletions when closed and reopened."*
   - SC-003: *"…100% of task additions, edits, status changes, and deletions that are **reported as saved** are reflected correctly after closing and reopening the application."*
   - Assumptions: *"Changes reported as saved are retained across a **normal** close and reopen of the application."*
   - Edge case 4: *"Saving a task change fails; the application clearly reports that the change was not saved…"*
2. **Problema identificado**
   - La spec nunca dice **cuándo** una acción está guardada ni **cuándo** se "reporta" como guardada: ¿al instante en cada toggle/delete/add, o solo al pulsar Save?
   - El criterio es circular: solo obliga a conservar lo que la app *reporta* como guardado; una app que nunca reporta nada cumple SC-003 trivialmente.
   - "Normal close" excluye cierres abruptos (crash, batería, matar proceso) sin decir qué se espera.
   - `idea.md` introduce **Save y Cancel** en edición; la spec no define qué hace Cancel (¿descarta cambios?) ni qué pasa si el usuario sale del formulario sin pulsar ninguno.
3. **Posible consecuencia**: pérdida de datos percibida ("lo marqué y no estaba"), implementaciones distintas entre equipos (autoguardado vs botón), y pruebas imposibles de decidir.
4. **Propuesta de mejora**: definir de forma verificable: (a) acciones inmediatas (agregar, marcar done/not done, eliminar) se persisten al completarse la acción; (b) la edición se persiste solo con Save y Cancel descarta; (c) tras una acción exitosa los datos sobreviven a un cierre/reapertura, incluido cierre abrupto inmediatamente después; (d) si falla la persistencia, se informa y el estado mostrado no queda como si estuviera guardado.
5. **Justificación**: "guardado" es el contrato de confiabilidad del producto; sin definición no hay requisito comprobable.

`[DECISIÓN DEL USUARIO]` — ¿Cancel en edición descarta todo sin preguntar? Opciones: A) descarta siempre (recomendada, simple); B) pide confirmar si hubo cambios. **Resuelta por el usuario: A.**

(La plataforma —web, móvil, escritorio— se retiró de los pendientes de la spec: se define en `plan.md`.)

## H4 — Filtro activo vs cambio de estado (Caso C)

1. **Fragmento de la especificación**
   - US2, escenario 3: *"**Given** tasks with different completion statuses exist, **When** the user selects a completion-status filter, **Then** only tasks matching that filter are displayed."*
   - FR-006: *"The To-Do List screen MUST allow the user to view all tasks or filter tasks by completion status."*
   - US2 Independent Test: *"Change a task's completion status in its details and verify that it appears under the corresponding list filter."*
2. **Problema identificado**: el cambio de estado ocurre en el **detalle**, no en la lista. La spec no define:
   - Si, al volver a la lista, la tarea recién marcada sigue visible bajo el filtro "Pending" o ya no.
   - Si el filtro activo se **conserva** al ir al detalle y volver, y al **cerrar y reabrir** la app (o vuelve a "All").
   - Caso análogo: con filtro "Done" activo, el usuario agrega una tarea (nace incompleta, FR-005): ¿se ve?, ¿cambia el filtro?
3. **Posible consecuencia**: confusión del usuario (tarea "desaparece" sin explicación o no desaparece y se ve inconsistente), y diferentes comportamientos por implementación.
4. **Propuesta de mejora**: fijar la regla: el filtro activo se conserva al navegar lista↔detalle; al volver a la lista, la lista se recalcula con el filtro vigente (la tarea que ya no coincide deja de mostrarse); definir si el filtro se recuerda tras reabrir; definir qué ve el usuario al agregar una tarea que no coincide con el filtro.
5. **Justificación**: la lista debe ser coherente con el filtro mostrado; hoy el escenario de prueba de US2 no puede resolverse sin interpretación.

`[DECISIÓN DEL USUARIO]` — ¿Qué pasa con el filtro al volver del detalle y al reabrir? Opciones: A) se conserva al volver y se reinicia a "All" al reabrir (recomendada: simple, evita estado extra persistido); B) se conserva siempre, también al reabrir; C) siempre vuelve a "All".

## H5 — Criterios de éxito que suenan medibles pero no lo son (Caso D)

1. **Fragmento de la especificación**
   - SC-001: *"In usability testing, at least 90% of first-time users can add a task and open its details without assistance within two minutes."*
   - SC-002: *"…at least 90% of users can change a task's completion status and locate it using the matching status filter without assistance within one minute."*
   - SC-004: *"…at least 90% of users can edit and delete a task without assistance within two minutes."*
2. **Problema identificado**: faltan datos para evaluarlos: tamaño de la muestra (con 5 personas, 90 % es inalcanzable o ruidoso: 4/5 = 80 %, 5/5 = 100 %), perfil de usuario ("first-time" solo en SC-001), qué cuenta como "asistencia", cuándo inicia y para el cronómetro, dispositivo/plataforma, instrucciones dadas, y qué ocurre con quien no lo logra. Además los umbrales (90 %, 1–2 min) son **contenido que la IA introdujo sin base en `idea.md`** (que no menciona ninguna métrica de éxito ni de usabilidad). SC-003 depende de "reported as saved" (ver H3).
3. **Posible consecuencia**: nadie puede declarar "cumplido" o "no cumplido" de forma defendible; dos equipos medirían cosas distintas. Se gastan recursos en pruebas con usuarios sin protocolo.
4. **Propuesta de mejora**: complementar o reemplazar por criterios de aceptación verificables y automatizables (p. ej. "agregar una tarea requiere como máximo N interacciones desde la lista"; "tras marcar una tarea como done, aparece bajo el filtro Done y no bajo Pending"), y, si se conserva el criterio de usabilidad, explicitar el protocolo: n mínimo, perfil, definición de asistencia, inicio/fin de cronómetro, dispositivo.
5. **Justificación**: un criterio de éxito debe poder dar un veredicto reproducible; los umbrales numéricos sin protocolo dan falsa precisión.

`[DECISIÓN DEL USUARIO]` — ¿Se mantiene la prueba de usabilidad? Opciones: A) reemplazar por criterios verificables/automatizables (recomendada para el alcance del taller); B) mantener y agregar protocolo (n, perfil, asistencia, cronómetro); C) ambas. Si se mantiene algún umbral, el usuario debe confirmar los valores (90 %, 1–2 min).

## H6 — Supuestos introducidos por la IA (verificado y ajustado)

1. **Fragmento de la especificación** (sección Assumptions)
   - *"The application serves one user's task list; accounts, sharing, and collaboration are outside the described scope."*
   - *"A title is required and cannot consist only of whitespace; no additional title or description length rules are introduced by this specification."*
   - *"Changes reported as saved are retained across a normal close and reopen of the application."*
   - *"…reminders, due dates, labels, search, and other unrequested capabilities are out of scope."*
2. **Problema identificado**
   - "Single user": **sí está respaldado** por `idea.md` línea 20 (*"no accounts… or sync"*). No es un supuesto injustificado; se descarta como hallazgo grave.
   - Supuestos sí nuevos: (a) regla de solo-espacios en el título (razonable, pero `idea.md` solo dice "title (required)"); (b) *"no additional… length rules"* deja sin definir un título de cientos de caracteres en la fila de la lista y en el detalle (¿trunca, hace wrap, desborda?); (c) si el título se guarda con trim o tal cual; (d) *"normal close"* (ver H3); (e) la lista de fuera de alcance menciona "reminders" y "labels", que no están en `idea.md` (que dice categories, due dates, priorities, search, sync, accounts) y omite "priorities", "categories" y "sync", que sí están. **Este cambio en la lista de fuera de alcance es contenido que la IA introdujo sin base en `idea.md`**, igual que la regla de solo-espacios y la ausencia de reglas de longitud.
3. **Posible consecuencia**: títulos largos rompen el layout (afecta el requisito de responsive y 44 px); inconsistencia entre títulos con espacios; confusión sobre qué está fuera de alcance.
4. **Propuesta de mejora**: alinear la lista de fuera de alcance exactamente con `idea.md`; definir comportamiento visual de títulos largos (sin imponer un límite de caracteres que el usuario no pidió) y el trim.
5. **Justificación**: los supuestos de la IA deben ser trazables al usuario o marcarse como pendientes.

`[DECISIÓN DEL USUARIO]` — Títulos largos: A) sin límite, se ajustan con salto de línea/truncado visual en la lista (recomendada: no inventa regla de negocio); B) límite de caracteres (el usuario debe indicar cuál). Trim del título: A) se guarda sin espacios al inicio/fin (recomendada); B) se guarda tal cual.

## H7 — Orden de la lista no definido

1. **Fragmento de la especificación**: FR-002: *"The To-Do List screen MUST display the user's tasks and allow the user to add a task and open an existing task."* (no menciona orden en ningún punto de la spec).
2. **Problema identificado**: no se define el orden (¿creación ascendente/descendente? ¿pendientes primero?). `idea.md` tampoco lo dice, y prohíbe fechas y prioridades como funcionalidad.
3. **Posible consecuencia**: pruebas no deterministas ("la tarea aparece en la lista" no dice dónde), experiencia distinta por implementación; al agregar una tarea el usuario puede no verla sin hacer scroll.
4. **Propuesta de mejora**: especificar un orden único y estable, que no requiera datos extra (basado solo en creación).
5. **Justificación**: sin orden, los escenarios US1 no son verificables de forma determinista.

`[DECISIÓN DEL USUARIO]` — Orden: A) más nuevas primero (recomendada: la tarea recién agregada se ve de inmediato); B) más antiguas primero (orden de creación natural); C) pendientes primero y luego completadas.

## H8 — Qué muestra cada fila y si el estado se cambia desde la lista (ajustado)

1. **Fragmento de la especificación**
   - FR-002 (arriba) no describe el contenido de la fila.
   - FR-009: *"The To-Do Detail screen MUST allow the user to change a task between complete and incomplete."*
   - `idea.md` línea 15: *"each row shows a status indicator and the title… tapping a row opens the detail screen"*.
2. **Problema identificado**: la spec no menciona el indicador de estado en la fila (solo lo insinúa US1-1: *"appears in the list with an incomplete status"*) ni dice si es solo informativo. Según `idea.md`, tocar la fila abre el detalle, por lo que el indicador sería informativo; pero queda sin escribir, y es una expectativa común que un check en la lista sea tocable. Tampoco define si la fila muestra la descripción.
3. **Posible consecuencia**: implementadores añaden un checkbox tocable en la lista (funcionalidad no pedida y que cambia la interacción con el filtro, ver H4) o, al revés, el indicador falta.
4. **Propuesta de mejora**: FR explícito: cada fila muestra indicador de estado y título (sin descripción); el indicador es solo informativo; el estado se cambia únicamente en el detalle.
5. **Justificación**: coincide con `idea.md` y evita funcionalidad implícita no solicitada.

`[DECISIÓN DEL USUARIO]` — Confirmar: A) indicador solo informativo, estado solo en detalle (recomendada: es lo que dice `idea.md`); B) permitir también tocar el indicador (agregaría alcance).

## H9 — Qué ocurre después de eliminar (Caso B)

1. **Fragmento de la especificación**: US3, escenario 2: *"…the user deletes it, **Then** the task is removed and no longer appears in the list."* y FR-010 (arriba).
2. **Problema identificado**: no se define a qué pantalla vuelve el usuario (el detalle ya no tiene tarea), qué filtro se muestra, si hay mensaje de confirmación del resultado ni si existe deshacer. `idea.md` no pide deshacer.
3. **Posible consecuencia**: pantallas vacías o errores al quedar en un detalle de una tarea inexistente; el usuario no sabe si el borrado funcionó.
4. **Propuesta de mejora**: tras confirmar, volver a la To-Do List con el filtro vigente (H4), sin la tarea; sin deshacer (no solicitado); definir si se muestra un aviso breve.
5. **Justificación**: el flujo posterior es parte del comportamiento observable y debe poder probarse. Deshacer sería funcionalidad no pedida.

`[DECISIÓN DEL USUARIO]` — Tras borrar: A) volver a la lista con el filtro vigente, sin deshacer ni mensaje extra (recomendada: mínimo y fiel a `idea.md`); B) igual, con mensaje breve de "Task deleted"; C) agregar Undo (fuera de lo descrito en `idea.md`: requiere aprobación explícita).

## H10 (nuevo) — US3-3 contradice a `idea.md` en la descripción vacía

1. **Fragmento de la especificación**: US3, escenario 3: *"**Given** a task's description is empty, **When** the user views its details, **Then** the task remains valid and **no description content is shown**."*
   Contra `idea.md` línea 16: *"…the description below it (muted "No description" if empty)"*.
2. **Problema identificado**: la spec dice que no se muestra contenido; `idea.md` pide mostrar un texto atenuado "No description". Es una contradicción directa.
3. **Posible consecuencia**: la implementación seguirá la spec y no mostrará el texto; el usuario encontrará algo distinto a lo que pidió; la prueba de aceptación "pasaría" con el comportamiento equivocado.
4. **Propuesta de mejora**: reescribir el escenario: con descripción vacía, el detalle muestra "No description" en estilo atenuado.
5. **Justificación**: corrige una desviación respecto del requisito original; no agrega alcance.

## H11 (nuevo) — Opciones del filtro y terminología no fijadas en los requisitos

1. **Fragmento de la especificación**
   - FR-006: *"…view all tasks or filter tasks by completion status."*
   - Assumptions: *"The completion filter offers all tasks, incomplete tasks, and completed tasks."*
   - Contra `idea.md` líneas 3 y 15: filtro con tres opciones etiquetadas **All, Pending, Done**; estados "done / not done"; acciones "Mark as done / Mark as not done".
2. **Problema identificado**: las opciones del filtro quedan en una *suposición*, no en un requisito, y la spec usa "complete/incomplete" mientras el usuario usa "Done/Pending/not done". Las etiquetas visibles que el usuario eligió no quedan fijadas.
3. **Posible consecuencia**: etiquetas distintas a las pedidas y pruebas que no pueden comprobar el texto de pantalla.
4. **Propuesta de mejora**: mover las tres opciones a FR-006 con sus etiquetas exactas (All / Pending / Done) y unificar el vocabulario con `idea.md`.
5. **Justificación**: la terminología es parte del contrato con el usuario y de la validación.

## H12 (nuevo) — Flujo de "Add task" y Save/Cancel sin definir

1. **Fragmento de la especificación**: FR-002 (*"…allow the user to add a task…"*), US1-1/US1-2 (*"…adds a task with a title…"*), FR-008 (*"…allow the user to edit the selected task's title and description."*). Contra `idea.md` líneas 15 y 17: botón "Add task" que abre un formulario con título y descripción; edición con el mismo formulario y botones Save / Cancel; título vacío muestra mensaje de validación.
2. **Problema identificado**: la spec no describe el formulario (campos, botón visible, Save/Cancel), no dice a dónde se vuelve tras agregar/guardar/cancelar, y no dice si el formulario de edición es el mismo que el de alta. El mensaje de validación sí está (edge case 1), pero sin decir dónde se muestra ni si se conservan los datos ya escritos.
3. **Posible consecuencia**: flujos distintos al pedido (p. ej. editar en línea sin Cancel), pérdida de lo escrito al fallar la validación.
4. **Propuesta de mejora**: escenarios para: abrir formulario de alta; Save válido → vuelve a la lista con la tarea; Save con título vacío → mensaje y se conserva lo escrito; Cancel → vuelve sin cambios; edición reutiliza el formulario precargado.
5. **Justificación**: es el flujo central (P1) y `idea.md` ya lo describe; solo falta traducirlo a requisitos verificables.

---

## Pendientes de decisión del usuario (para la Fase 4)

| Id | Tema | Recomendación |
|---|---|---|
| H3-a | Cancel en edición | Descarta siempre |
| H4 | Filtro al volver / reabrir | Conservar al volver; "All" al reabrir |
| H5 | Criterios de éxito | Criterios verificables; protocolo si se mantiene usabilidad |
| H6-a | Títulos largos | Sin límite, ajuste visual |
| H6-b | Trim del título | Guardar con trim |
| H7 | Orden de la lista | Más nuevas primero |
| H8 | Indicador de estado | Solo informativo |
| H9 | Después de eliminar | Volver a lista con filtro vigente, sin deshacer |
