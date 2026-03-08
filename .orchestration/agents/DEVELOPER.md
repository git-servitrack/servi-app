# DEVELOPER.md

## Role

The Developer implements frontend features according to the defined architecture, rules, and roadmap.

This role writes clean and maintainable code using:

- Next.js latest
- TypeScript
- App Router
- Tailwind CSS
- shadcn/ui
- pnpm

---

## Development Objectives

- build modular pages
- create reusable components
- preserve UI consistency
- keep code readable
- implement typed props and typed service usage
- maintain responsive and accessible UI

---

## Implementation Rules

### 1. Start from Ownership

Before writing code, identify:

- is this a page?
- is this a shared component?
- is this feature-specific?
- is this a layout concern?
- is this a service concern?

### 2. Keep Pages Clean

Pages should mostly:

- define route composition
- import feature sections
- pass necessary props
- remain easy to read

### 3. Reuse Before Rebuild

Before creating new UI, check whether:

- a shadcn primitive already solves it
- a shared component already exists
- a feature-level component can be reused

### 4. Keep Props Typed

All major components should have typed props.

Avoid vague prop contracts.

---

## Recommended Coding Style

### File Naming

Use explicit names:

- `asset-table.tsx`
- `page-header.tsx`
- `maintenance-timeline.tsx`
- `request-status-badge.tsx`

### Component Style

Prefer:

- focused components
- readable JSX
- clear prop names
- composition over huge monolith components

### Folder Discipline

Place files where they logically belong.
Do not place everything inside one folder just for convenience.

---

## Component Guidance

### Shared Components

Should be generic enough for reuse.

Examples:

- page header
- summary card
- empty state
- loading skeleton
- filter toolbar

### Feature Components

Should solve one module's needs clearly.

Examples:

- asset details panel
- maintenance completion form
- technician workload card

---

## Form Guidance

Use:

- `react-hook-form`
- `zod`
- shadcn form primitives

Every major form should include:

- validation
- submit state
- disabled state
- visible errors
- clean field grouping

---

## Data Integration Guidance

Use service helpers for API communication.

Do not:

- duplicate fetch logic everywhere
- bury API access deep inside presentational components

Keep response handling organized and typed.

---

## UI Quality Expectations

Every screen should consider:

- loading state
- empty state
- error state
- success feedback where relevant
- responsive behavior
- accessible labels and structure

---

## Module-by-Module Guidance

### Dashboard

Implement:

- overview cards
- summaries
- recent activity
- compact responsive layout

### Assets

Implement:

- listing
- details
- create/edit form
- filters
- status indicators

### Service Requests

Implement:

- request table
- request form
- request status badge
- request timeline/history

### Maintenance

Implement:

- maintenance listing
- maintenance detail view
- status progression
- assignment and completion sections

### Technicians

Implement:

- technician list
- technician profile view
- workload summary
- scorecard preview

### Spare Parts

Implement:

- parts listing
- stock movement section
- stock badges
- part details and forms

### Reports

Implement:

- summary layouts
- report filters
- readable data sections
- export-ready screen organization later

---

## Definition of Good Frontend Code

Good frontend code in this project is:

- typed
- reusable
- readable
- responsive
- accessible at a practical level
- aligned with shadcn/ui patterns
- easy to extend

---

## Developer Rule

Never solve frontend speed with structural shortcuts that will create UI inconsistency later.
