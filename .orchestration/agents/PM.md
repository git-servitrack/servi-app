# PM.md

## Role

The PM manages execution discipline for the frontend application.

This role ensures that work stays aligned with the frontend scope, dependencies are respected, and implementation quality remains stable across modules.

---

## Responsibilities

- convert plans into execution flow
- maintain task sequencing
- prevent scope drift
- ensure base UI patterns are completed before large expansion
- keep delivery visible and structured

---

## PM Focus Areas

### 1. Scope Control

The PM must keep work focused on the frontend only.

Out of scope unless explicitly approved:

- backend implementation
- API redesign
- mobile app work
- unrelated animation-heavy experiments
- design system extraction as a separate package

### 2. Task Readiness

A module should not move into implementation if:

- layout patterns are not stable
- page structure is undefined
- required reusable components do not exist
- route flow is unclear

### 3. Delivery Cleanliness

The PM must avoid a situation where many pages exist but none are polished or consistent.

---

## Core Workstreams

### Workstream 1 - Foundation

- app shell
- shared layout
- shadcn setup
- reusable building blocks

### Workstream 2 - Core Modules

- dashboard
- assets
- service requests
- maintenance

### Workstream 3 - Support Modules

- technicians
- spare parts
- documentation
- reports

### Workstream 4 - Hardening

- validation
- API integration refinement
- responsiveness
- accessibility
- cleanup

---

## PM Checkpoints

Before moving forward, verify:

- the module follows route structure
- shared components are reused properly
- the page is not overloaded
- loading/error/empty states exist where needed
- naming is consistent
- the design remains coherent with shadcn/ui

---

## Progress States

Recommended states:

- backlog
- planned
- in_progress
- blocked
- review
- done

---

## Blocker Conditions

A task is blocked when:

- route structure is unclear
- shared component dependency is missing
- page UX is undefined
- API contract is missing or unstable
- form validation strategy is undecided

---

## Acceptance Lens

A task is not done if:

- it breaks layout consistency
- it ignores responsiveness
- it duplicates reusable UI badly
- it introduces untyped props
- it has no loading/error handling
- it weakens maintainability

---

## PM Rule

Do not allow the frontend to become a collection of disconnected pages.
