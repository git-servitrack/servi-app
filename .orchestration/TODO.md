# TODO.md

## Frontend Delivery Roadmap

This file tracks the recommended implementation sequence for SERVI-WEB.

---

## PHASE 1 - Frontend Foundation Setup

### Project Foundation

- [x] Confirm final frontend folder structure
- [x] Configure `src/` structure cleanly
- [x] Set up global layout
- [x] Set up dashboard layout shell
- [x] Install and configure shadcn/ui
- [x] Add base theme styling if needed
- [x] Add shared utility helpers
- [x] Add route constants
- [x] Add shared types folder
- [x] Add base loading and error UI patterns

### Base UI Foundation

- [x] Configure button, input, card, badge, dialog, table, sheet components
- [x] Create reusable page container
- [x] Create reusable page header
- [x] Create reusable section wrapper
- [x] Create reusable empty state
- [x] Create reusable loading skeleton

---

## PHASE 2 - App Shell and Navigation

### Layout

- [x] Create sidebar navigation
- [x] Create top navigation/header
- [x] Create breadcrumb support
- [x] Create active nav state handling
- [x] Create mobile-friendly navigation behavior

### Shared UX

- [x] Add logout/menu placeholder area
- [x] Add app title and branding area
- [x] Add consistent page spacing rules

---

## PHASE 3 - Dashboard Module

### Dashboard UI

- [x] Create dashboard overview page
- [x] Create summary cards
- [x] Create quick stats section
- [x] Create recent activity section
- [x] Create maintenance summary preview
- [x] Create request summary preview
- [x] Create responsive dashboard layout

---

## PHASE 4 - Asset Module

### Asset Pages

- [x] Create asset listing page
- [x] Create asset details page
- [x] Create asset create page
- [x] Create asset edit page

### Asset Components

- [x] Create asset table
- [x] Create asset filters
- [x] Create asset form
- [x] Create asset details panel
- [x] Create asset status badge

---

## PHASE 5 - Service Request Module

### Service Request Pages

- [x] Create request listing page
- [x] Create request details page
- [x] Create request creation page
- [x] Create request update flow

### Service Request Components

- [x] Create request table
- [x] Create request filters
- [x] Create request form
- [x] Create request status badge
- [x] Create request history/timeline view
- [x] Create request remarks section

---

## PHASE 6 - Maintenance Module

### Maintenance Pages

- [x] Create maintenance listing page
- [x] Create maintenance details page
- [x] Create maintenance workflow page

### Maintenance Components

- [x] Create maintenance table
- [x] Create maintenance status badge
- [x] Create maintenance timeline
- [x] Create diagnosis notes panel
- [x] Create repair action list
- [x] Create maintenance completion form
- [x] Create maintenance assignment UI

---

## PHASE 7 - Technician Module

### Technician Pages

- [x] Create technician listing page
- [x] Create technician details page
- [x] Create technician create/edit pages

### Technician Components

- [x] Create technician table
- [x] Create technician profile card
- [x] Create workload summary section
- [x] Create technician scorecard view
- [x] Create technician history table

---

## PHASE 8 - Spare Parts Module

### Spare Parts Pages

- [x] Create spare parts listing page
- [x] Create spare part details page
- [x] Create spare part create/edit pages

### Spare Parts Components

- [x] Create spare parts table
- [x] Create stock badge
- [x] Create low stock indicator
- [x] Create stock movement history view
- [x] Create stock adjustment form
- [x] Create part usage section

---

## PHASE 9 - Documentation Module

### Documentation UI

- [x] Create upload UI
- [x] Create media preview cards
- [x] Create linked-documentation section
- [x] Create image/file metadata display
- [x] Create upload validation feedback
- [x] Create file gallery/grid view

---

## PHASE 10 - Reports Module

### Reports Pages

- [x] Create reports overview page
- [x] Create maintenance history report UI
- [x] Create technician performance report UI
- [x] Create spare parts usage report UI
- [x] Create request volume report UI
- [x] Create completion rate report UI

### Reports Components

- [x] Create filter toolbar
- [x] Create report cards
- [x] Create tabular report views
- [x] Create export-ready report layout placeholders

---

## PHASE 11 - Forms, Validation, and API Integration

### Integration

- [ ] Create API service layer structure
- [ ] Create typed service contracts
- [ ] Add request helpers
- [ ] Add standardized error handling in UI
- [ ] Add loading and mutation feedback patterns

### Forms

- [ ] Add react-hook-form
- [ ] Add zod schemas
- [ ] Standardize submit behavior
- [ ] Standardize validation messages

---

## PHASE 12 - Frontend Hardening

### Quality

- [ ] Review responsiveness across modules
- [ ] Review accessibility basics
- [ ] Review visual consistency
- [ ] Review empty states
- [ ] Review error states
- [ ] Review loading states
- [ ] Review reusable component opportunities

### Cleanup

- [ ] Remove duplicate UI patterns
- [ ] Refactor oversized page files
- [ ] Refactor inconsistent naming
- [ ] Clean dead code
- [ ] Improve maintainability

---

## PHASE 13 - Frontend Documentation

### Documentation

- [ ] Document folder structure
- [ ] Document component organization
- [ ] Document form strategy
- [ ] Document API integration pattern
- [ ] Document route structure
- [ ] Document UI conventions
- [ ] Document naming conventions

---

## Priority Recommendation

### Highest Priority

1. Foundation setup
2. App shell and navigation
3. Dashboard
4. Asset module
5. Service request module
6. Maintenance module

### Next Priority

7. Technician module
8. Spare parts module
9. Documentation module
10. Reports module
11. Hardening and documentation

---

## Definition of Done

A frontend task is complete only when:

- [ ] structure is clean
- [ ] UI is reusable where appropriate
- [ ] typing is strong
- [ ] loading/error states are considered
- [ ] responsiveness is considered
- [ ] accessibility basics are respected
- [ ] code is review-ready
