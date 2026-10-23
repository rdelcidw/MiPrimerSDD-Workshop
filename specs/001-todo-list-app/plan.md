# Implementation Plan: Lista de tareas Curso-PSWE-07

**Branch**: `workshop/rdelcidw` | **Date**: 2026-10-22 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-todo-list-app/spec.md`

## Summary

Aplicación web estática de lista de tareas con dos pantallas (To-Do List y To-Do Detail),
que permite agregar, editar, eliminar (con confirmación), marcar como hecha y filtrar
(All / Pending / Done). Las tareas persisten en `localStorage`.

Enfoque técnico: HTML + CSS + JavaScript puro (módulos ES), sin framework ni build. La
lógica de tareas (validar, crear, editar, eliminar, cambiar estado, filtrar, guardar/cargar)
vive en módulos separados de la UI y se prueba con `node --test`. Se sirve localmente con
`npx serve`. Un fallo al guardar revierte el cambio y los datos corruptos se tratan como
lista vacía con aviso (ver Clarifications en la spec).

## Technical Context

**Language/Version**: JavaScript (ES2022, módulos ES) en navegador moderno; Node.js 20+ solo para pruebas y para `npx serve`

**Primary Dependencies**: Ninguna en el proyecto. `serve` se invoca con `npx` como herramienta de desarrollo, no se agrega a `package.json` (ver research.md R2)

**Storage**: `localStorage` del navegador, una sola clave JSON versionada

**Testing**: `node --test` (módulo `node:test` integrado); comando único: `npm test`

**Target Platform**: Navegadores modernos de escritorio y móvil, servidos como archivos estáticos

**Project Type**: Aplicación web estática del lado del cliente (single project)

**Performance Goals**: Interacciones percibidas como instantáneas con decenas de tareas (se vuelve a renderizar la pantalla completa en cada cambio)

**Constraints**: Sin backend, sin red hacia servicios externos, sin telemetría; contraste WCAG 2.1 AA; objetivos de 44×44 px; sin scroll horizontal de 320 a 1440 px

**Scale/Scope**: Un usuario, un navegador, decenas de tareas, 2 pantallas + formulario + diálogo de confirmación

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio | Cumple | Evidencia |
|-----------|--------|-----------|
| I. Alcance estricto a idea.md | Sí | Todo lo planeado traza a la spec, que traza a idea.md. Sin cuentas, categorías, fechas, prioridades, búsqueda ni sync. No hay `[NEEDS CLARIFICATION]` abiertos. |
| II. Sin backend ni dependencias innecesarias | Sí | Solo cliente + `localStorage`. Cero dependencias en el proyecto; `npx serve` es solo un servidor estático de desarrollo, justificado en research.md R2. |
| III. Accesibilidad básica | Sí | El contrato de UI exige botones nativos, foco visible, etiquetas accesibles, 44×44 px y estado con tachado + atenuado + indicador de texto (contracts/ui-contract.md). |
| IV. Lógica de datos con pruebas | Sí | Lógica en `src/tasks.js` y `src/storage.js`, sin DOM, con pruebas en `tests/`; un solo comando `npm test`. |
| V. Código legible | Sí | Módulos pequeños de una responsabilidad; sin código muerto. Se verifica en revisión. |

**Re-check post-diseño (Fase 1)**: sin cambios; el diseño no introdujo dependencias ni
funcionalidad fuera de idea.md. Complexity Tracking no aplica.

## Project Structure

### Documentation (this feature)

```text
specs/001-todo-list-app/
├── plan.md              # Este archivo (/speckit-plan)
├── research.md          # Fase 0
├── data-model.md        # Fase 1
├── quickstart.md        # Fase 1
├── contracts/
│   ├── data-logic.md    # Contrato de las funciones de lógica y almacenamiento
│   └── ui-contract.md   # Contrato de pantallas, textos y accesibilidad
├── checklists/
│   └── requirements.md
└── tasks.md             # Fase 2 (/speckit-tasks - NO lo crea /speckit-plan)
```

### Source Code (repository root)

```text
index.html               # Estructura, <title>Curso-PSWE-07</title>, carga de src/app.js como módulo
styles.css               # Tema claro, un color de acento, una familia sans-serif, responsivo
package.json             # "type": "module" y script "test"; sin dependencias
src/
├── tasks.js             # Lógica pura: validar, crear, editar, alternar, eliminar, filtrar, ordenar
├── storage.js           # Cargar/guardar con almacenamiento inyectable; detecta datos corruptos y fallos
└── app.js               # UI: estado, render de pantallas, eventos, avisos (único módulo que toca el DOM)
tests/
├── tasks.test.js
└── storage.test.js
```

**Structure Decision**: proyecto único estático en la raíz. `tasks.js` y `storage.js` no
referencian `window` ni `document`, por lo que Node los importa directamente en las pruebas.

## Complexity Tracking

Sin violaciones de la constitución; no aplica.
