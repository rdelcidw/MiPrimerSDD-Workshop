# 02 — Casos A, B, C y D

Base: `requirements/spec-inicial.md`, `idea.md` y `deliverables/01-hallazgos.md`.
Decisiones ya tomadas por el usuario tras la Fase 1 se marcan como **[RESUELTO POR EL USUARIO]**. Lo que sigue abierto se marca como `[DECISIÓN DEL USUARIO]`.
La plataforma (web, móvil, escritorio) **no** se decide en la spec: va en `plan.md`. Por eso las reglas abajo se formulan en términos de comportamiento observable, no de tecnología.

---

## Caso A — Guardado de tareas

**Pregunta**: la spec dice que las tareas deben conservarse al cerrar y abrir la aplicación. ¿Es suficiente para definir cuándo una tarea se considera guardada?

### Respuesta
**No es suficiente.** FR-011 define *qué* debe sobrevivir (altas, ediciones, cambios de estado, borrados) pero no *cuándo* ocurre el guardado. Además:
- SC-003 y Assumptions solo garantizan lo que la app *"reports as saved"*; es circular (una app que nunca reporta nada lo cumple).
- *"normal close"* deja sin definir un cierre abrupto.
- `idea.md` introduce Save/Cancel en edición; la spec no dice qué hace Cancel.

### Alternativas

| # | Alternativa | Consecuencia |
|---|---|---|
| A1 | **Guardado inmediato en toda acción**, incluida la edición (autoguardado mientras se escribe). | Nunca se pierde nada, pero choca con el botón **Cancel** de `idea.md` (no habría qué cancelar) y puede guardar títulos vacíos/parciales. |
| A2 | **Solo al pulsar Save** (también toggle y delete requerirían confirmar con un "guardar" global). | Fácil de entender para formularios, pero obliga a un paso extra en acciones de un toque (marcar done) que `idea.md` no pide y aumenta riesgo de olvidar guardar. |
| A3 | **Híbrido**: acciones de un toque (agregar con Save del formulario de alta, marcar done/not done, eliminar tras confirmar) se persisten al completarse; la **edición** se persiste solo con Save y Cancel descarta. | Coincide con `idea.md` (formulario con Save/Cancel; acciones directas en detalle). Requiere definir qué ocurre si la persistencia falla. |

### Recomendación
**A3**, con definición verificable de "guardado":
1. Una tarea está *guardada* cuando la acción que la crea o modifica terminó con éxito **y** la app ya no puede perder ese cambio por un cierre posterior inmediato (incluido cierre abrupto tras la confirmación visual).
2. Alta y edición: se guardan al pulsar **Save** con título válido. Eliminación: al **confirmar** (Caso B). Cambio de estado: al pulsar la acción.
3. **Cancel descarta siempre** los cambios no guardados. **[RESUELTO POR EL USUARIO]** (H3-a).
4. El usuario solo ve un cambio como aplicado si fue guardado (no hay "éxito optimista").
5. Verificable: ejecutar la acción → cerrar y reabrir → el dato está; y con cierre abrupto inmediatamente después de la acción confirmada.

`[DECISIÓN DEL USUARIO]` — **Falla de persistencia en una acción inmediata** (p. ej. al marcar done no se pudo guardar). Opciones: A) revertir la pantalla al último estado guardado y mostrar mensaje de error (**recomendada**: la pantalla nunca miente); B) dejar el cambio visible, marcarlo como "no guardado" y permitir reintentar (más estado y UI, no pedida en `idea.md`).

---

## Caso B — Eliminación

**Pregunta**: ¿qué debería ocurrir antes y después de eliminar una tarea? ¿Qué alternativas existen y qué consecuencias tiene cada una?

### Respuesta
- **Antes**: `idea.md` (línea 16) exige confirmación previa y un botón con color de advertencia; la spec lo omitió (H1).
- **Después**: la spec no define la pantalla de destino, el filtro, ni mensaje (H9).

### Alternativas

| # | Alternativa | Consecuencia |
|---|---|---|
| B1 | Borrado inmediato (como en la spec). | Rápido, pero un toque accidental destruye datos persistidos; **contradice** `idea.md`. |
| B2 | **Confirmación** previa, sin deshacer. | Fiel a `idea.md`. Protege del error accidental; el borrado confirmado es definitivo. |
| B3 | Deshacer temporal (sin confirmación). | Protege sin interrumpir, pero **no lo pidió el usuario** y exige conservar el dato un tiempo (estado extra, interacción con persistencia). |
| B4 | Confirmación **y** deshacer. | Máxima protección, máxima complejidad y alcance agregado no solicitado. |

### Recomendación
**B2.** Flujo: Delete (color de advertencia) → diálogo de confirmación con confirmar/cancelar → si confirma, se elimina y se persiste; si cancela, el detalle queda igual. Después de eliminar, **volver a la To-Do List con el filtro vigente**, sin deshacer. **[RESUELTO POR EL USUARIO]** (H9).
- Verificable: tras confirmar, la tarea no aparece en ninguna opción de filtro y sigue ausente tras cerrar y reabrir (US4-2 existente).
- Verificable: al cancelar la confirmación, la tarea permanece y sigue en la pantalla de detalle.
- Texto del diálogo y mensaje tras borrar: el usuario no pidió aviso de resultado; por defecto **no se muestra mensaje adicional** (cualquier aviso sería agregado no solicitado).

---

## Caso C — Filtros

**Pregunta**: el usuario ve solo tareas pendientes y marca una como completada. ¿Debe desaparecer inmediatamente? ¿Qué esperaría el usuario?

### Respuesta
El cambio de estado ocurre en el **detalle**, no en la lista (FR-009; el indicador de la fila es solo informativo, H8 **[RESUELTO POR EL USUARIO]**). Por eso "desaparecer inmediatamente de la lista" no aplica literalmente: el usuario no está viendo la lista cuando marca. El comportamiento a fijar es el de **la lista al volver**, y qué pasa con el filtro activo.

### Alternativas

| # | Alternativa | Consecuencia |
|---|---|---|
| C1 | Al volver, la lista se recalcula con el filtro vigente: la tarea ya no aparece bajo "Pending". | Lista siempre coherente con la etiqueta del filtro. La tarea "desaparece" tras volver, lo cual es esperable para quien marcó done. |
| C2 | La tarea sigue visible hasta que el usuario cambie de filtro o refresque. | Evita el "se me perdió", pero la lista queda incoherente (una tarea Done bajo Pending) y complica pruebas. |
| C3 | Volver siempre a "All". | Simple, pero se pierde el contexto del usuario y contradice la expectativa de continuidad. |

Para el filtro entre sesiones:

| # | Alternativa | Consecuencia |
|---|---|---|
| C4 | Reiniciar a "All" al reabrir la app. | Estado inicial predecible; un dato menos que persistir. |
| C5 | Recordar el filtro entre sesiones. | Continuidad, pero agrega persistencia no descrita en `idea.md` y puede dar la impresión de "tareas perdidas" al abrir con un filtro viejo. |

### Recomendación
**C1 + C4. [RESUELTO POR EL USUARIO]** (H4):
- El filtro activo **se conserva** al ir al detalle y volver.
- Con "Pending" activo, al volver tras marcar done, la tarea **ya no aparece**.
- Al **reabrir la app**, el filtro inicial es **"All"**.
- Caso derivado (agregar con filtro Done activo): se mantiene el filtro vigente. La tarea nueva (incompleta) no se muestra bajo "Done"; ver nota abajo.
- Verificable: US2 reescrito con Given/When/Then para "marcar done con Pending activo y volver", y "reabrir → All".

`[DECISIÓN DEL USUARIO]` — **Agregar una tarea con filtro "Done" activo** (la tarea nace incompleta y no coincide). Opciones: A) volver a la lista con el filtro "Done" vigente y la tarea nueva no se ve hasta cambiar a All/Pending (**recomendada**: coherente con C1, sin lógica extra); B) cambiar el filtro a "All" tras agregar para que el usuario vea su tarea (agrega una excepción a la regla de "conservar el filtro").

---

## Caso D — Medición del éxito

**Pregunta**: la spec dice que el 90 % de los usuarios debería completar ciertas tareas en un tiempo determinado. ¿Qué información adicional se necesita para comprobarlo de forma fiable?

### Respuesta
Los umbrales **90 % y 1–2 minutos son contenido que la IA introdujo sin base en `idea.md`**, que no define métricas de éxito. Para poder comprobar un criterio así falta:

| Falta | Por qué importa |
|---|---|
| **Tamaño de muestra** | Con n = 5, 90 % no existe (4/5 = 80 %, 5/5 = 100 %); con n pequeño el resultado es ruido. |
| **Perfil de los usuarios** | "First-time" aparece solo en SC-001; ¿estudiantes, personas no técnicas? Cambia el resultado. |
| **Definición de "sin asistencia"** | ¿Se permite leer ayuda, repetir intentos, una pista del moderador? |
| **Inicio y fin del cronómetro** | ¿Desde que ve la pantalla o desde que lee la instrucción? ¿Termina al guardar o al ver el resultado? |
| **Dispositivo/entorno** | Móvil y escritorio son ambos requeridos por `idea.md`; los tiempos difieren. |
| **Tarea exacta y guion** | "Add a task" con o sin descripción, texto dado o libre. |
| **Qué pasa con quien falla/abandona** | Define si cuenta como fallo en el denominador. |
| **Regla de decisión** | ¿Se evalúa el 90 % puntual o con intervalo de confianza? |

### Alternativas

| # | Alternativa | Consecuencia |
|---|---|---|
| D1 | Mantener tal cual. | Falsa precisión; imposible de dar un veredicto reproducible. |
| D2 | **Reemplazar** por criterios de aceptación verificables/automatizables (pasos, comportamiento observable, pruebas). | Veredicto binario y reproducible; no mide percepción de usabilidad. |
| D3 | Mantener solo usabilidad con protocolo completo. | Mide experiencia real, pero cuesta reclutar gente y no sirve como prueba de regresión. |
| D4 | **D2 como criterio principal + usabilidad como objetivo secundario** con protocolo explícito. | Cubre verificabilidad y experiencia; más texto en la spec. |

### Recomendación
**D4. [RESUELTO POR EL USUARIO]** (H5): criterios verificables/automatizables como Success Criteria principales; usabilidad solo como objetivo secundario con protocolo explícito. Ejemplos de criterios verificables derivables de `idea.md` (sin inventar métricas de tiempo):
- Una tarea nueva con título válido aparece en la lista en la posición definida (más nuevas primero) tras Save.
- Tras marcar done con filtro "Pending" y volver, la tarea no aparece; aparece bajo "Done" y "All".
- Tras cerrar y reabrir, el 100 % de las acciones confirmadas están reflejadas (SC-003 reescrito sin la circularidad de "reported as saved").
- Agregar una tarea requiere como máximo: abrir el formulario, escribir el título, Save (pasos contables).
- Todo control interactivo mide ≥ 44×44 px; el título de ventana y el header son "Curso-PSWE-07".

Protocolo mínimo del objetivo secundario de usabilidad: muestra, perfil, definición de "sin asistencia", inicio/fin del cronómetro, dispositivo, guion de tareas y tratamiento de fallos (ver tabla arriba).

`[DECISIÓN DEL USUARIO]` — **Valores del protocolo de usabilidad secundario**, que no existen en `idea.md`. Opciones: A) no fijar umbrales numéricos en la spec: solo reportar el porcentaje observado con el protocolo definido y dejar el umbral como `[NEEDS CLARIFICATION]` (**recomendada**: no inventar números); B) conservar 90 % / 1–2 min como objetivo, ahora con n mínimo y definición de asistencia (el usuario debe confirmar los valores); C) otros valores que indique el usuario.

---

## Resumen de pendientes abiertos tras esta fase

| Caso | Pendiente | Recomendación |
|---|---|---|
| A | Falla de persistencia en acción inmediata | Revertir pantalla al último estado guardado + mensaje de error |
| C | Agregar tarea con filtro "Done" activo | Mantener el filtro; la tarea nueva no se ve hasta cambiar de filtro |
| D | Valores numéricos del protocolo de usabilidad secundario | No fijar umbrales; dejar `[NEEDS CLARIFICATION]` |

Resueltos por el usuario (se aplican en Fase 4): H3-a, H4, H5, H6-a (sin límite; truncado con elipsis en lista, completo en detalle), H6-b (trim), H7 (más nuevas primero), H8, H9.
