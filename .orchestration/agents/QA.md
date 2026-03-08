# QA.md

## Role

The QA role ensures that the frontend is correct, usable, and consistent.

Quality assurance covers:

- visual consistency
- functional correctness
- responsiveness
- form behavior
- error handling
- accessibility basics
- regression resistance

---

## QA Objectives

1. verify that screens behave as expected
2. verify that forms validate correctly
3. verify that layout works across common screen sizes
4. verify that shared UI patterns remain consistent
5. verify that loading, error, and empty states exist where needed

---

## Testing Scope

### 1. Component Testing

Focus on:

- reusable components
- form field wrappers
- status badges
- summary cards
- table behavior

### 2. Page-Level Testing

Focus on:

- route rendering
- page composition
- content sections
- state transitions in the UI

### 3. Form Testing

Focus on:

- required field validation
- error messages
- submission states
- disabled states
- create/edit flow correctness

### 4. UX and Visual QA

Focus on:

- action placement
- readability
- spacing consistency
- responsive layout behavior
- empty/error/loading states

---

## Critical QA Scenarios

### Layout

- sidebar works correctly
- navigation highlights current route
- mobile navigation remains usable
- content does not overflow badly

### Dashboard

- cards display properly
- sections remain readable across widths
- empty and loading states appear properly

### Asset Module

- asset list renders properly
- form validates correctly
- details page remains readable
- status badge is visually clear

### Service Request Module

- request list works
- request form shows feedback
- status displays clearly
- history/timeline is understandable

### Maintenance Module

- workflow status is clear
- action sections are usable
- completion flow does not confuse the user

### Spare Parts Module

- low stock state is visible
- stock values are readable
- movement history layout is understandable

### Documentation Module

- upload feedback is visible
- preview cards render correctly
- file metadata is understandable

### Reports

- report filters are usable
- data display is readable
- layout works on common screen widths

---

## QA Quality Gates

A frontend feature should not pass QA if:

- the page is visually inconsistent
- form validation is weak or confusing
- responsiveness breaks basic usability
- loading/error states are missing
- component behavior is unclear
- labels or actions are hard to understand

---

## Accessibility Baseline

QA should verify:

- forms have labels
- dialogs can be closed properly
- keyboard navigation is reasonable
- focus visibility exists
- tables and controls remain understandable

---

## Regression Focus

Retest when changes affect:

- shared layout
- shared form components
- shared tables
- route structure
- status display patterns
- API integration UI handling

---

## QA Deliverables

For major modules, QA should produce:

- tested scenarios
- failed scenarios
- UI issues list
- responsiveness issues list
- release recommendation

---

## QA Rule

If a user can get confused, blocked, or visually lost, QA must treat it as a real issue.
