# Orchestration Layer - SERVI-WEB

## Purpose

This orchestration layer defines how the frontend application is planned, designed, implemented, reviewed, and validated.

The frontend stack is:

- **Next.js (latest version)**
- **TypeScript**
- **pnpm**
- **shadcn/ui**
- **Tailwind CSS**
- **App Router (default Next.js setup)**

This orchestration is focused on the **frontend side only**.

---

## Frontend Scope

The frontend is responsible for:

- rendering the user interface
- managing page flow and navigation
- presenting system data clearly
- handling forms and validation feedback
- organizing reusable UI components
- integrating with backend APIs
- supporting responsive layouts
- supporting dashboard and management screens
- preparing the UI for maintainability and scalability

---

## Architecture Style

The frontend follows a **component-driven and feature-aware architecture** using the default Next.js setup.

Main structure goals:

- separate page-level responsibility from reusable UI
- keep business/data-fetching logic organized
- keep UI components reusable and composable
- keep styling consistent through shadcn/ui and Tailwind
- support scalable growth for dashboard modules

---

## Main Principles

1. Pages must stay clean and readable.
2. Reusable UI belongs in components.
3. Feature logic should not be scattered randomly.
4. Layout consistency is mandatory.
5. Forms must be structured and validated properly.
6. API calls must be isolated from UI presentation where practical.
7. Naming must be clear and professional.
8. Accessibility and responsiveness must be considered from the start.
9. Design consistency must follow shadcn/ui patterns.
10. The frontend must be ready for future expansion without collapsing structure.

---

## Orchestration Files

### Core Documents

- `ARCHITECTURE.md` – overall frontend architecture and module boundaries
- `RULES.md` – development rules and frontend engineering constraints
- `TODO.md` – implementation roadmap and delivery checklist

### Agent Documents

- `agents/PROJECT_PLANNER.md` – planning, sequencing, and feature rollout
- `agents/PM.md` – delivery flow, dependency control, and execution discipline
- `agents/ARCHITECT.md` – structural frontend decisions
- `agents/DEVELOPER.md` – implementation guidance and coding standards
- `agents/QA.md` – testing and quality standards
- `agents/REVIEWER.md` – code review and frontend consistency checks

---

## Working Model

Expected workflow:

1. Read `ARCHITECTURE.md`
2. Follow `RULES.md`
3. Pull tasks from `TODO.md`
4. Use agent files for role-based execution
5. Keep all frontend work aligned with Next.js and shadcn/ui standards

---

## Non-Goals for This Phase

The following are out of scope unless explicitly added later:

- backend implementation
- mobile app implementation
- full design system package extraction
- native desktop packaging
- advanced animation systems without product need
- unrelated admin features not tied to actual modules

---

## Success Criteria

The orchestration layer is successful when:

- the frontend remains clean and modular
- the UI is consistent across pages
- components are reusable
- forms and dashboards are maintainable
- API integration is predictable
- team members can build features without confusion
