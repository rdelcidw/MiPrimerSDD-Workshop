<!--
SYNC IMPACT REPORT
- Version change: (plantilla sin ratificar) → 1.0.0
- Principios definidos (nuevos):
  I. Alcance estricto a idea.md
  II. Simplicidad: sin backend ni dependencias innecesarias
  III. Accesibilidad básica
  IV. Lógica de datos con pruebas
  V. Código legible
- Secciones añadidas: Restricciones técnicas; Flujo de trabajo y puertas de calidad
- Secciones removidas: ninguna
- Plantillas dependientes: leen la constitución en tiempo de ejecución; no se modificaron
- TODOs diferidos: ninguno
-->

# Curso-PSWE-07 Constitution

Proyecto académico del curso de Procesos (Cenfotec): una aplicación To-Do simple
construida con Spec-Driven Development (SDD).

## Core Principles

### I. Alcance estricto a idea.md

- `idea.md` es la única fuente de alcance funcional. Toda funcionalidad implementada
  MUST trazarse a un elemento descrito en `idea.md`.
- Se MUST NOT agregar funcionalidad extra: nada de cuentas, categorías, fechas límite,
  prioridades, búsqueda, sincronización ni cualquier otra capacidad no descrita.
- Toda ambigüedad MUST marcarse con `[NEEDS CLARIFICATION: <pregunta>]` y
  preguntarse al usuario (p. ej. con `/speckit-clarify`) antes de implementar.
  La IA MUST NOT resolver ambigüedades en silencio ni asumir una interpretación.

**Rationale**: el objetivo del curso es practicar un proceso disciplinado; el alcance
acotado hace verificable que la entrega cumple la especificación y nada más.

### II. Simplicidad: sin backend ni dependencias innecesarias

- La aplicación MUST ejecutarse completamente del lado del cliente, sin servidor,
  base de datos remota ni API propia.
- La persistencia MUST resolverse con almacenamiento local del cliente (p. ej.
  `localStorage`).
- Cada dependencia externa (framework, librería, herramienta de build) MUST
  justificarse en `plan.md` explicando por qué no basta la plataforma estándar.
  Por defecto se prefiere no agregarla.

**Rationale**: menos piezas móviles significa menos riesgo, menos configuración y un
proyecto que cualquier evaluador puede abrir y ejecutar sin preparación.

### III. Accesibilidad básica

- El contraste de texto MUST cumplir WCAG 2.1 AA (4.5:1 texto normal, 3:1 texto grande).
- Todo objetivo táctil o de clic MUST medir al menos 44×44 px.
- Los controles interactivos MUST ser operables con teclado, tener foco visible y una
  etiqueta accesible (texto visible o `aria-label`).
- El estado no se comunica solo con color (p. ej. tarea completada: tachado + color
  atenuado + indicador de estado).

**Rationale**: `idea.md` exige contraste suficiente y targets de 44 px; estas reglas
lo hacen medible.

### IV. Lógica de datos con pruebas

- La lógica de datos (crear, editar, eliminar, alternar estado, filtrar, validar
  título, cargar/guardar en persistencia) MUST estar separada de la UI y cubierta por
  pruebas automatizadas.
- Las pruebas MUST ejecutarse con un solo comando documentado y pasar antes de
  considerar completa una tarea.
- La UI puede verificarse manualmente contra los criterios de aceptación de `spec.md`;
  las pruebas automatizadas de UI son opcionales.

**Rationale**: la lógica de datos es donde viven los errores que hacen perder tareas
del usuario; probarla de forma aislada es barato y da confianza.

### V. Código legible

- Nombres descriptivos y consistentes; funciones pequeñas con una sola responsabilidad.
- Sin código muerto, comentado o duplicado.
- Los comentarios explican el "por qué", no el "qué".
- Formato consistente en todo el proyecto.

**Rationale**: el código será revisado por compañeros y docentes; la legibilidad es
parte de la calidad evaluada.

## Restricciones técnicas

- Plataforma: aplicación web estática ejecutable en navegador moderno, con diseño
  responsivo para móvil y escritorio.
- Persistencia: únicamente almacenamiento local del navegador; los datos MUST sobrevivir
  al cierre y reapertura de la aplicación.
- Identidad visual: nombre "Curso-PSWE-07" en el encabezado y en el título de la
  ventana; un solo color de acento; una sola familia tipográfica sans-serif.
- Sin telemetría, analítica ni llamadas de red a servicios externos.

## Flujo de trabajo y puertas de calidad

- Se sigue el flujo Spec Kit: `/speckit-specify` → `/speckit-clarify` →
  `/speckit-plan` → `/speckit-tasks` → `/speckit-analyze` → `/speckit-implement`.
- `plan.md` MUST incluir una verificación explícita contra cada principio de esta
  constitución (Constitution Check) antes de generar tareas.
- Una tarea se considera completa solo si: cumple su criterio de aceptación, las
  pruebas de lógica de datos pasan y no introduce funcionalidad fuera de `idea.md`.
- Los commits son pequeños y con mensajes descriptivos (estilo Conventional Commits).

## Governance

- Esta constitución prevalece sobre cualquier otra práctica del proyecto. Ante un
  conflicto entre un artefacto (spec, plan, tasks, código) y la constitución, se
  corrige el artefacto.
- Enmiendas: se proponen con `/speckit-constitution`, documentando el cambio en el
  Sync Impact Report y el motivo, y se registran en un commit propio.
- Versionado semántico: MAJOR para remover o redefinir principios; MINOR para agregar
  principios o secciones; PATCH para aclaraciones de redacción.
- Revisión de cumplimiento: `/speckit-analyze` y la revisión de cada entrega MUST
  verificar los cinco principios; cualquier excepción MUST justificarse por escrito
  en `plan.md` (sección Complexity Tracking).

**Version**: 1.0.0 | **Ratified**: 2026-10-22 | **Last Amended**: 2026-10-22
