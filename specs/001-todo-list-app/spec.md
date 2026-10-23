# Feature Specification: Lista de tareas Curso-PSWE-07

**Feature Branch**: `workshop/rdelcidw`

**Created**: 2026-10-22

**Status**: Draft

**Input**: User description: "Usá idea.md como descripción del usuario: app web de lista de tareas con pantallas To-Do List y To-Do Detail, agregar, editar, eliminar con confirmación y marcar como completada, filtro All/Pending/Done, persistencia y el diseño visual descrito. Incluí la sección VISUAL DESIGN completa como requisitos y respetá exactamente el OUT OF SCOPE de idea.md."

## Clarifications

### Session 2026-10-22

- Q: ¿Un título con solo espacios cuenta como vacío? → A: Sí. Se recortan los espacios al
  inicio y al final; si queda vacío, se rechaza.
- Q: ¿En qué orden se listan las tareas? → A: Más recientes primero.
- Q: Al cerrar y reabrir la app, ¿se recuerda el último filtro? → A: No, siempre vuelve a "All".
- Q: ¿Qué hace Cancel en edición? → A: Descarta siempre los cambios y vuelve al detalle
  sin modificar la tarea.
- Q: ¿Se conserva el filtro al volver del detalle? → A: Sí. Si el filtro es Pending y la
  tarea se marca como done, al volver ya no aparece.
- Q: ¿Cómo se muestran los títulos largos? → A: En la lista se truncan con elipsis; en el
  detalle se ven completos.
- Q: ¿A dónde va el usuario después de eliminar? → A: A la lista, con el filtro vigente.
- Q: ¿Qué se muestra en el detalle si no hay descripción? → A: "No description" atenuado.
- Supuestos A1 a A5 (sección Assumptions) confirmados por el usuario.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ver y agregar tareas (Priority: P1)

El usuario abre la aplicación, ve su lista de tareas y agrega una nueva con un título y,
si quiere, una descripción. Al cerrar y volver a abrir la aplicación, sus tareas siguen ahí.

**Why this priority**: sin poder crear y ver tareas que persisten, la aplicación no aporta
valor. Es el MVP.

**Independent Test**: abrir la app sin datos, agregar dos tareas, cerrar y reabrir la app,
y verificar que ambas aparecen en la lista.

**Acceptance Scenarios**:

1. **Given** no hay tareas, **When** el usuario abre la app, **Then** ve el encabezado
   "Curso-PSWE-07", el botón "Add task" y un mensaje breve y amigable de lista vacía.
2. **Given** la lista, **When** el usuario pulsa "Add task", completa el título
   "Comprar pan" y guarda, **Then** la tarea aparece en la lista con estado Pending.
3. **Given** el formulario de agregar, **When** el usuario guarda con el título vacío,
   **Then** la tarea no se crea y se muestra un mensaje de validación junto al campo título.
4. **Given** el formulario de agregar, **When** el usuario guarda con un título de solo
   espacios, **Then** la tarea no se crea y se muestra el mismo mensaje de validación.
5. **Given** el formulario de agregar, **When** el usuario pulsa Cancel, **Then** vuelve a
   la lista sin crear ninguna tarea.
6. **Given** existen tareas guardadas, **When** el usuario cierra y reabre la app,
   **Then** ve las mismas tareas con el mismo título, descripción y estado.
7. **Given** existen tareas, **When** el usuario agrega una nueva, **Then** la nueva
   aparece primera en la lista (más recientes primero).

---

### User Story 2 - Ver el detalle y cambiar el estado (Priority: P2)

El usuario toca una tarea de la lista, ve su detalle y la marca como hecha (o la vuelve a
marcar como no hecha).

**Why this priority**: marcar tareas completadas es la acción más frecuente después de crearlas.

**Independent Test**: con una tarea existente, abrir su detalle, marcarla como hecha,
volver a la lista y verificar que aparece tachada y atenuada.

**Acceptance Scenarios**:

1. **Given** una tarea en la lista, **When** el usuario toca su fila, **Then** se abre la
   pantalla de detalle con un control para volver, el título destacado, la descripción
   debajo y una etiqueta de estado visible (Done / Pending).
2. **Given** una tarea sin descripción, **When** se abre su detalle, **Then** se muestra
   "No description" en color atenuado.
3. **Given** una tarea Pending en el detalle, **When** el usuario pulsa "Mark as done",
   **Then** la etiqueta cambia a Done y el botón pasa a decir "Mark as not done".
4. **Given** una tarea Done en el detalle, **When** el usuario pulsa "Mark as not done",
   **Then** la etiqueta cambia a Pending y el botón pasa a decir "Mark as done".
5. **Given** una tarea marcada como Done, **When** el usuario vuelve a la lista,
   **Then** la fila muestra el título tachado y en color atenuado, con su indicador de estado.

---

### User Story 3 - Editar una tarea (Priority: P3)

Desde el detalle, el usuario corrige el título o la descripción de una tarea.

**Why this priority**: corregir errores es necesario, pero menos frecuente que crear y completar.

**Independent Test**: editar el título de una tarea, guardar, reabrir la app y verificar
que el cambio se conservó.

**Acceptance Scenarios**:

1. **Given** el detalle de una tarea, **When** el usuario pulsa Edit, **Then** se muestra
   el mismo formulario de agregar, precargado con el título y la descripción actuales, con
   botones Save y Cancel.
2. **Given** el formulario de edición, **When** el usuario cambia el título y pulsa Save,
   **Then** el detalle muestra el nuevo título y el cambio persiste.
3. **Given** el formulario de edición, **When** el usuario borra el título y pulsa Save,
   **Then** no se guarda y se muestra un mensaje de validación.
4. **Given** el formulario de edición con cambios, **When** el usuario pulsa Cancel,
   **Then** los cambios se descartan siempre (sin preguntar) y vuelve al detalle con la
   tarea sin modificar.

---

### User Story 4 - Eliminar una tarea con confirmación (Priority: P4)

Desde el detalle, el usuario elimina una tarea que ya no necesita, confirmando antes.

**Why this priority**: útil para mantener la lista limpia, pero no bloquea el uso principal.

**Independent Test**: eliminar una tarea confirmando y verificar que desaparece de la
lista también después de reabrir la app; repetir cancelando y verificar que se conserva.

**Acceptance Scenarios**:

1. **Given** el detalle de una tarea, **When** el usuario pulsa Delete, **Then** se pide
   confirmación antes de eliminar.
2. **Given** la confirmación de eliminar, **When** el usuario confirma, **Then** la tarea
   se elimina de forma permanente y el usuario vuelve a la lista, con el filtro que estaba
   vigente, donde ya no aparece.
3. **Given** la confirmación de eliminar, **When** el usuario cancela, **Then** la tarea
   no se elimina y el usuario sigue en el detalle.

---

### User Story 5 - Filtrar por estado (Priority: P5)

El usuario filtra la lista para ver todas las tareas, solo las pendientes o solo las hechas.

**Why this priority**: mejora la navegación cuando hay muchas tareas; la app funciona sin él.

**Independent Test**: con tareas Pending y Done, seleccionar cada filtro y verificar que
la lista muestra exactamente las tareas que corresponden y que el filtro activo se resalta.

**Acceptance Scenarios**:

1. **Given** tareas Pending y Done, **When** el usuario elige "Pending", **Then** solo se
   ven las tareas no hechas y "Pending" aparece resaltado con el color de acento.
2. **Given** tareas Pending y Done, **When** el usuario elige "Done", **Then** solo se ven
   las tareas hechas.
3. **Given** cualquier filtro, **When** el usuario elige "All", **Then** se ven todas las tareas.
4. **Given** el filtro "Done" y ninguna tarea hecha, **When** se muestra la lista,
   **Then** aparece un mensaje breve y amigable indicando que no hay tareas para ese filtro.
5. **Given** el filtro "Pending" activo, **When** el usuario marca una tarea como hecha y
   vuelve a la lista, **Then** el filtro "Pending" sigue activo y esa tarea ya no aparece.
6. **Given** el filtro "Done" activo, **When** el usuario cierra y reabre la app,
   **Then** la lista se abre con el filtro "All".

---

### Edge Cases

- Título compuesto solo por espacios: se trata como vacío y se rechaza (FR-003).
- Títulos largos: en la lista se truncan en una línea con elipsis; en el detalle se
  muestran completos, ajustándose a varias líneas sin desplazamiento horizontal.
- Descripciones largas: en el detalle se muestran completas, ajustándose a varias líneas.
- Lista vacía vs. filtro sin coincidencias: ambos casos muestran un mensaje amigable;
  el texto distingue si no hay tareas o si ninguna coincide con el filtro.
- Almacenamiento local no disponible o lleno: la app debe informar al usuario con un
  mensaje claro de que los cambios no se pudieron guardar, sin perder la sesión actual.
- Datos guardados corruptos o ilegibles: la app abre igual, mostrando la lista vacía, en
  lugar de quedar en blanco o fallar.

## Requirements *(mandatory)*

### Functional Requirements

**Tareas y datos**

- **FR-001**: Cada tarea MUST tener un título (obligatorio), una descripción (opcional) y
  un estado de completado (done / not done).
- **FR-002**: Las tareas nuevas MUST crearse con estado not done (Pending).
- **FR-003**: El sistema MUST recortar los espacios al inicio y al final del título y
  rechazar guardar una tarea (nueva o editada) cuyo título quede vacío, mostrando un
  mensaje de validación.
- **FR-004**: Las tareas y sus cambios (crear, editar, cambiar estado, eliminar) MUST
  conservarse después de cerrar y volver a abrir la aplicación.

**Pantalla To-Do List**

- **FR-005**: La pantalla MUST mostrar un encabezado con el nombre "Curso-PSWE-07".
- **FR-006**: La pantalla MUST listar las tareas del usuario según el filtro activo,
  ordenadas de la más reciente a la más antigua por fecha de creación.
- **FR-007**: Cada fila MUST mostrar un indicador de estado y el título; las tareas hechas
  MUST mostrarse tachadas y con color atenuado. Los títulos que no caben en una línea
  MUST truncarse con elipsis.
- **FR-008**: Tocar o hacer clic en una fila MUST abrir la pantalla de detalle de esa tarea.
- **FR-009**: La pantalla MUST ofrecer un botón "Add task" claramente visible que abre un
  formulario con campos de título y descripción, y botones Save y Cancel.
- **FR-010**: La pantalla MUST ofrecer un filtro de tres opciones (All, Pending, Done) con
  la opción activa resaltada. Al abrir la app, el filtro activo MUST ser siempre "All"
  (el filtro no se persiste). Al volver del detalle (con Back o tras eliminar), el filtro
  vigente MUST conservarse y la lista MUST reflejar los cambios hechos en el detalle.
- **FR-011**: La pantalla MUST mostrar un mensaje breve y amigable cuando no hay tareas o
  cuando ninguna coincide con el filtro activo.

**Pantalla To-Do Detail**

- **FR-012**: La pantalla MUST ofrecer un control para volver a la lista.
- **FR-013**: La pantalla MUST mostrar el título completo (sin truncar) de forma destacada
  y la descripción debajo; si no hay descripción, MUST mostrar "No description" en color
  atenuado.
- **FR-014**: La pantalla MUST mostrar una etiqueta de estado visible (Done / Pending).
- **FR-015**: La pantalla MUST ofrecer tres acciones: Edit, Mark as done / Mark as not done
  (la etiqueta cambia según el estado actual) y Delete.
- **FR-016**: Edit MUST reutilizar el formulario de agregar, precargado con los valores
  actuales, con botones Save y Cancel. Cancel MUST descartar siempre los cambios, sin
  pedir confirmación, y volver al detalle con la tarea sin modificar.
- **FR-017**: Delete MUST usar un color de advertencia distinto y pedir confirmación antes
  de eliminar; al confirmar, la tarea se elimina y el usuario vuelve a la lista con el
  filtro vigente. Al cancelar la confirmación, el usuario sigue en el detalle.

**Diseño visual y accesibilidad**

- **FR-018**: El nombre "Curso-PSWE-07" MUST aparecer también como título de la
  aplicación/ventana.
- **FR-019**: El diseño MUST ser limpio y minimalista: fondo claro, espacio en blanco
  generoso, un solo color de acento para acciones primarias y el filtro activo, y una sola
  familia tipográfica sans-serif.
- **FR-020**: Los títulos MUST verse más grandes y en negrita que las descripciones.
- **FR-021**: El texto MUST tener contraste suficiente (mínimo WCAG 2.1 AA).
- **FR-022**: Todo objetivo táctil o de clic MUST medir al menos 44×44 px.
- **FR-023**: El diseño MUST ser responsivo y usable en móvil y escritorio.

**Fuera de alcance**

- **FR-024**: La aplicación MUST NOT incluir nada que no esté descrito arriba; en
  particular: cuentas, categorías, fechas límite, prioridades, búsqueda ni sincronización.

### Key Entities

- **Tarea**: lo que el usuario necesita hacer. Atributos: título (obligatorio), descripción
  (opcional) y estado de completado (done / not done). Cada tarea se identifica de forma
  única para poder abrirla, editarla y eliminarla.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Un usuario nuevo puede agregar su primera tarea en menos de 30 segundos
  desde que abre la app, sin instrucciones.
- **SC-002**: El 100 % de las tareas creadas, editadas, completadas o eliminadas se
  refleja igual después de cerrar y reabrir la app.
- **SC-003**: Marcar una tarea como hecha requiere como máximo 2 interacciones desde la
  lista (abrir la tarea y pulsar "Mark as done").
- **SC-004**: El 100 % de los objetivos táctiles miden al menos 44×44 px y el 100 % del
  texto cumple contraste AA, verificado con una herramienta de auditoría de accesibilidad.
- **SC-005**: Todas las pantallas se usan sin desplazamiento horizontal en anchos desde
  320 px (móvil) hasta 1440 px (escritorio).
- **SC-006**: Ninguna tarea se elimina sin una confirmación explícita del usuario.

## Assumptions

Supuestos confirmados por el usuario el 2026-10-22:

- La app la usa una sola persona en un solo dispositivo/navegador; los datos no se comparten
  entre dispositivos (la sincronización está fuera de alcance).
- Los textos de la interfaz se muestran en inglés, usando las etiquetas literales de idea.md
  (All, Pending, Done, Add task, Edit, Delete, Save, Cancel, Mark as done, No description).
- El indicador de estado de cada fila es solo informativo; cambiar el estado se hace desde
  el detalle, como describe idea.md.
- Después de guardar una tarea nueva, el usuario vuelve a la lista.
- La eliminación es permanente; no existe papelera ni "deshacer".
- No hay límite fijo en la cantidad de tareas; se espera un uso personal (decenas de tareas).
