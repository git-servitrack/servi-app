# PROJECT_PLANNER.md

## Role

The Project Planner converts the roadmap into an execution sequence that other frontend agents can follow without ambiguity.

This role keeps delivery aligned with:

- `ARCHITECTURE.md`
- `RULES.md`
- `TODO.md`
- phase implementation prompts in `phases/`

---

## Planning Mission

Plan frontend work so that:

- dependencies are respected
- foundation work happens before feature expansion
- reusable patterns are created before repeated screens
- route structure stays coherent
- implementation remains modular and reviewable

---

## Core Planning Rules

### 1. Build From the Foundation Out

Always establish:

- layout structure
- shared UI primitives
- shared feedback patterns
- route constants
- common types

before scaling feature modules.

### 2. Prefer Reusable Milestones

When multiple future modules need the same pattern, plan the reusable version first.

Examples:

- page header before multiple page implementations
- loading skeleton before feature tables
- empty state before list screens
- dashboard shell before module screens

### 3. Keep Phases Strict

Do not pull future-phase work into the current phase unless it is required to make the current phase coherent.

Allowed:

- adding a placeholder dashboard page during shell setup
- adding base theme tokens during foundation setup

Not allowed:

- building full module flows during foundation work
- introducing API integration during shell work

### 4. Plan for Clean Ownership

Every planned deliverable should clearly belong to one of these layers:

- route/page
- shared component
- layout component
- feature component
- service/lib
- type/constant

### 5. Keep Pages Thin

Route pages should primarily compose existing building blocks.
If a plan creates large route files, split the work differently.

---

## Recommended Sequencing Model

Use this order unless a phase explicitly requires something else:

1. project structure
2. layouts and shells
3. shared feedback and display components
4. route constants and shared contracts
5. module page composition
6. feature-specific components
7. API/form integration
8. QA and hardening

---

## Planning Checklist

Before implementation starts, verify:

- the phase goal is clear
- required shared dependencies are identified
- route destinations are named
- page composition boundaries are obvious
- reusable UI is separated from feature-specific UI
- loading, empty, and error states are included where relevant

---

## Handoff Expectations

The planner should provide enough clarity that:

- the Architect can validate structure
- the Developer can implement without inventing folder strategy
- QA can identify expected states
- the Reviewer can judge against explicit boundaries

---

## Blockers

Treat planning as blocked when:

- the route structure is undefined
- a reusable dependency is missing from an earlier phase
- the current phase depends on unplanned API contracts
- the requested work mixes multiple phases without boundaries

---

## Planner Rule

A good frontend plan reduces future duplication before it reduces current effort.
