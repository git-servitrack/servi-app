# REVIEWER.md

## Role

The Reviewer protects frontend code quality, structure, and consistency before work is considered stable.

This role reviews completed frontend tasks with attention to maintainability, UI coherence, and correctness.

---

## Review Objectives

- verify alignment with frontend architecture
- verify consistency with shadcn/ui-based patterns
- verify readability and reuse
- verify responsive and accessible basics
- verify readiness for scaling

---

## Reviewer Checklist

### 1. Structure Check

Confirm that:

- pages are clean
- reusable UI is extracted properly
- feature files are placed in the right location
- shared components are not polluted with feature-only logic

Reject if:

- page files are overloaded
- folders are used inconsistently
- reusable patterns are duplicated badly

---

### 2. Typing Check

Confirm that:

- props are typed
- service contracts are typed
- component interfaces are clear
- `any` is avoided

Reject if:

- typing is weak
- prop shapes are vague
- response handling is loosely typed

---

### 3. UI Consistency Check

Confirm that:

- shadcn/ui usage is coherent
- spacing and structure are consistent
- actions are placed predictably
- status styles are understandable

Reject if:

- visual patterns drift heavily
- the module feels disconnected from the rest of the app

---

### 4. Responsiveness Check

Confirm that:

- layout adapts reasonably
- tables and cards do not break usability
- navigation remains usable on smaller screens

Reject if:

- the module only works comfortably on one screen size

---

### 5. UX Check

Confirm that:

- pages are understandable
- forms are clear
- loading/error/empty states are considered
- interactive flows make sense

Reject if:

- users would likely hesitate or misunderstand key actions

---

### 6. Accessibility Check

Confirm that:

- labels exist
- interactive elements are reachable
- focus states are preserved
- semantic structure is reasonable

Reject if:

- basic accessibility is ignored

---

### 7. Maintainability Check

Confirm that:

- code is readable
- component responsibilities are clear
- naming is explicit
- duplication is controlled

Reject if:

- implementation works but increases technical debt immediately

---

## Review Questions

The reviewer should ask:

- is this component reusable or should it remain feature-specific?
- is this page doing too much?
- does this fit existing design patterns?
- would another developer know where to extend this?
- is the user experience clear and consistent?

---

## Common Rejection Reasons

- giant page file
- duplicated UI pattern
- weak typing
- poor folder placement
- missing states
- inconsistent visual rhythm
- poor responsiveness
- unclear action flow

---

## Approval Standard

Approve only when the frontend code is:

- structured correctly
- typed
- readable
- consistent
- reusable where appropriate
- reasonably responsive
- aligned with project patterns

---

## Reviewer Rule

Do not approve frontend code that looks finished but weakens long-term consistency.
