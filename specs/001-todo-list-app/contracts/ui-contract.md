# Contrato de UI: pantallas, textos y accesibilidad

Textos de interfaz en inglés (Assumptions de la spec). Aplica a todas las pantallas:
`<title>` y encabezado "Curso-PSWE-07" (FR-005, FR-018); fondo claro; un solo color de
acento; una familia sans-serif; títulos más grandes y en negrita que descripciones
(FR-019, FR-020); controles nativos (`<button>`, `<input>`, `<textarea>`, `<dialog>`) con
foco visible y etiqueta accesible; objetivos ≥ 44×44 px; contraste AA; sin scroll
horizontal de 320 a 1440 px (FR-021 a FR-023). Avisos en un elemento con `role="status"`
(o `role="alert"` para fallos de guardado). Un aviso se limpia en el siguiente guardado
exitoso o al cambiar de pantalla.

## To-Do List

| Elemento | Comportamiento |
|----------|----------------|
| Encabezado | Texto "Curso-PSWE-07" |
| Filtro | Tres botones: All, Pending, Done; el activo resaltado con el acento y `aria-pressed="true"`; inicia en All |
| Fila | Botón/enlace que ocupa la fila: indicador de estado (texto o símbolo con etiqueta accesible Done/Pending) + título en una línea con elipsis; hecha = tachado + atenuado |
| Add task | Botón visible; abre el formulario |
| Estado vacío | "No tasks yet" con invitación a agregar (sin tareas) o "No tasks match this filter" (filtro sin coincidencias) |
| Aviso | Datos ilegibles: "Saved tasks could not be read." |

## Formulario (agregar y editar)

| Elemento | Comportamiento |
|----------|----------------|
| Campos | Title (obligatorio) y Description (opcional); en edición, precargados |
| Save | Valida el título; si queda vacío muestra "Title is required" junto al campo y no guarda; si guarda, aplica el protocolo de guardado |
| Cancel | Descarta sin preguntar; vuelve a la lista (agregar) o al detalle sin cambios (editar) |

## To-Do Detail

| Elemento | Comportamiento |
|----------|----------------|
| Back | Control para volver a la lista conservando el filtro |
| Título | Completo, destacado, con ajuste a varias líneas |
| Descripción | Debajo del título; si vacía, "No description" atenuado |
| Etiqueta de estado | "Done" o "Pending" visible |
| Edit | Abre el formulario precargado |
| Mark as done / Mark as not done | La etiqueta depende del estado actual; alterna y actualiza la etiqueta de estado |
| Delete | Color de advertencia distinto; abre `<dialog>` de confirmación con Delete (confirmar) y Cancel; confirmar elimina y va a la lista con el filtro vigente; Cancel deja en el detalle |
| Aviso de guardado fallido | "Could not save your changes." en cualquier pantalla donde falle el guardado; el cambio no se aplica |
