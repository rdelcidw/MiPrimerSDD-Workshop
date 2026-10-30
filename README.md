# Taller de Spec-Driven Development (SDD)

## Objetivo

Analizar y mejorar una especificación de requisitos elaborada con asistencia de inteligencia artificial.

El objetivo no es aceptar automáticamente lo que propone la IA, sino evaluar la calidad de los requisitos, identificar ambigüedades y justificar las decisiones de mejora.

## Caso de estudio

Una aplicación simple que gestiona tareas personales.

La especificación inicial se encuentra en `requirements/spec-inicial.md`.

## Actividades

1. Leer la especificación completa.
2. Identificar al menos tres ambigüedades, supuestos o decisiones pendientes.
3. Proponer mejoras a los criterios de aceptación.
4. Utilizar IA para explorar alternativas y evaluar críticamente sus propuestas.
5. Documentar las decisiones finales y justificarlas.

## Entregables

- Una especificación revisada.
- Al menos tres decisiones de mejora justificadas.
- Una reflexión breve sobre las limitaciones de utilizar IA para definir requisitos.

## Principio de trabajo

Cada cambio debe responder a una necesidad identificada y contar con una justificación.

No es necesario implementar la aplicación en este taller.

## Estructura del repositorio

- `requirements/`: especificación inicial.
- `activities/`: guía de trabajo.
- `deliverables/`: resultados de los estudiantes.

## Entrega — Roberto Del Cid (rdelcidw)

Aplicación de lista de tareas construida con el flujo SDD de GitHub Spec Kit, usando Claude Code como asistente.

### Cómo ejecutarla
1. `npx serve .`
2. Abrir la URL que muestra (por ejemplo http://localhost:3000)

### Pruebas
`npm test`

### Artefactos SDD
- Constitución: `.specify/memory/constitution.md`
- Especificación: `specs/001-todo-list-app/spec.md`
- Plan: `specs/001-todo-list-app/plan.md`
- Tareas: `specs/001-todo-list-app/tasks.md`
- Hallazgos sobre la spec inicial: `deliverables/01-hallazgos.md`
