# RULES.md

## Core Frontend Engineering Rules

### Rule 1 - Follow Next.js Structure Properly

Use the App Router and default project setup correctly.

Do not create unnecessary routing workarounds that fight the framework.

---

### Rule 2 - Pages Must Stay Clean

Pages should mainly compose sections and components.

Do not place large amounts of reusable UI or repeated business display logic directly inside page files.

---

### Rule 3 - Reusable UI Must Be Extracted

If the same UI pattern appears more than once, extract it into a reusable component.

Examples:

- page headers
- stat cards
- search toolbars
- filters
- tables
- detail panels

---

### Rule 4 - Use shadcn/ui Consistently

Use shadcn/ui as the primary component foundation.

Do not mix too many unrelated UI patterns that break visual consistency.

---

### Rule 5 - Keep Feature Logic Organized

Feature-specific UI and helpers should stay inside a clear feature structure.

Do not scatter related logic across random folders.

---

### Rule 6 - Keep API Calls Out of Presentational Components

Reusable presentational components should not directly own backend communication unless intentionally designed for that.

Prefer:

- page-level composition
- feature hooks
- service layer integration

---

### Rule 7 - Use Strong Typing

All important props, service contracts, and form schemas must be typed.

Avoid:

- `any`
- vague object props
- weakly typed API responses

---

### Rule 8 - Forms Must Be Structured

Use a consistent form strategy.

Recommended:

- `react-hook-form`
- `zod`
- shadcn form components

All important forms must support:

- validation
- clear feedback
- disabled/loading states
- proper submit flow

---

### Rule 9 - Prioritize Responsive Layouts

Pages must remain usable across common screen sizes.

Do not design only for one desktop width.

---

### Rule 10 - Use Consistent Naming

Use explicit and professional naming.

Prefer:

- `asset-table.tsx`
- `service-request-form.tsx`
- `maintenance-status-badge.tsx`

Avoid vague names like:

- `thing.tsx`
- `box.tsx`
- `data.tsx`

---

## Page Rules

- pages compose feature sections
- avoid giant page files
- place reusable parts outside the page file
- keep route-specific logic near the page when appropriate

---

## Component Rules

### Base Components

Use `components/ui/` for shadcn primitives.

### Shared Components

Use `components/shared/` for reusable app-specific UI.

### Feature Components

Use feature folders for domain-specific UI.

Do not place everything in one global components folder without structure.

---

## Styling Rules

- use Tailwind utilities consistently
- follow existing spacing patterns
- keep typography scale coherent
- avoid hardcoded random values when utility classes solve it
- prefer composition over ad hoc styling duplication

---

## State Management Rules

- prefer local state first
- use URL state for filters/search where helpful
- avoid global state without clear need
- do not introduce complexity too early

---

## Data Fetching Rules

- keep fetching strategy consistent
- centralize API logic in services or organized hooks
- do not spread raw fetch calls across unrelated UI files
- handle loading and error states intentionally

---

## Accessibility Rules

- use semantic HTML
- ensure labels exist for form inputs
- ensure interactive elements are keyboard-accessible
- preserve focus visibility
- use accessible table and dialog patterns

---

## UX Rules

- actions must be easy to find
- statuses must be understandable
- feedback must be visible
- forms must not feel confusing
- dashboard layouts must be readable at a glance

---

## Review Rules

A frontend task is not complete if:

- the UI is inconsistent
- the page file is overloaded
- components are not reusable when they should be
- types are weak
- loading/error states are missing
- accessibility is ignored
- responsiveness is broken

---

## Final Rule

Readable, scalable, and consistent frontend code is more important than fast but messy implementation.
