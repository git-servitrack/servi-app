# ARCHITECT.md

## Role

The Architect defines and protects the frontend structure of SERVI-WEB.

This role ensures the application remains modular, scalable, and aligned with Next.js App Router and shadcn/ui best practices.

---

## Architectural Mission

Design a frontend that is:

- modular
- reusable
- responsive
- readable
- feature-aware
- maintainable
- ready for growth

---

## Core Architectural Decisions

### 1. Use App Router Properly

The frontend should respect the default Next.js routing model.

Use layouts intentionally.
Do not recreate a routing pattern that fights the framework.

### 2. Separate Page Composition from Reusable UI

Pages should compose sections.
Reusable UI should live outside page files.

### 3. Keep UI Layered

Use three main UI levels:

- base UI primitives
- shared application components
- feature-specific components

### 4. Use shadcn/ui as the Base Foundation

Use shadcn/ui for consistency and structured component growth.

---

## Structural Recommendations

### Base UI Layer

Located in:

- `components/ui/`

Purpose:

- foundational primitives
- buttons
- dialogs
- inputs
- tables
- cards

### Shared Application Layer

Located in:

- `components/shared/`
- `components/layout/`
- `components/forms/`
- `components/data-display/`
- `components/feedback/`

Purpose:

- cross-feature reuse
- dashboard shell
- empty states
- page headers
- section wrappers
- reusable tables and cards

### Feature Layer

Located in:

- `features/<module>/`

Purpose:

- module-specific UI
- feature hooks
- schemas
- mapping logic
- feature helpers

---

## Layout Architecture

### Root Layout

Owns:

- global shell
- fonts
- global styles
- providers if needed

### Dashboard Layout

Owns:

- sidebar
- header
- page container
- responsive navigation behavior

### Route Pages

Own:

- route-specific composition
- assembling feature sections
- page-level metadata where needed

---

## Data and Service Architecture

The architect should keep data access organized.

Recommended structure:

- `services/` for API requests
- `types/` for contracts
- `features/` for feature-specific transformation
- `lib/` for client helpers

Avoid:

- raw fetch duplication
- random inline transformation inside many UI files

---

## Form Architecture

Recommended foundation:

- `react-hook-form`
- `zod`
- shadcn form components

Forms should be built so that:

- validation is declarative
- feedback is visible
- field wrappers are reusable
- create and edit flows can share structure

---

## Route Boundary Guidance

Primary route groups should remain clear:

- dashboard
- assets
- service-requests
- maintenance
- technicians
- spare-parts
- reports
- settings

Avoid placing unrelated screens in confusing route locations.

---

## Scalability Strategy

The frontend should be easy to extend by adding new feature folders and route pages without rewriting the base shell.

Future growth areas:

- richer dashboard analytics
- role-aware rendering
- advanced filters
- deeper detail pages
- export and print-ready reporting

---

## Anti-Patterns to Reject

- giant page files
- overuse of one global components folder without structure
- feature logic mixed into shared components
- random styling inconsistency
- raw API calls spread everywhere
- weak typing across props and API responses

---

## Architect Review Questions

Before approving structure, ask:

- does this belong in page, shared component, or feature component?
- can another developer find this easily?
- is this reusable or route-specific?
- does it align with current UI patterns?
- will this scale when more modules are added?

---

## Architect Rule

Optimize for clarity and reuse before speed of expansion.
