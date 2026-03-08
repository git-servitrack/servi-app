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

- [ ] Create asset listing page
- [ ] Create asset details page
- [ ] Create asset create page
- [ ] Create asset edit page

### Asset Components

- [ ] Create asset table
- [ ] Create asset filters
- [ ] Create asset form
- [ ] Create asset details panel
- [ ] Create asset status badge

---

## PHASE 5 - Service Request Module

### Service Request Pages

- [ ] Create request listing page
- [ ] Create request details page
- [ ] Create request creation page
- [ ] Create request update flow

### Service Request Components

- [ ] Create request table
- [ ] Create request filters
- [ ] Create request form
- [ ] Create request status badge
- [ ] Create request history/timeline view
- [ ] Create request remarks section

---

## PHASE 6 - Maintenance Module

### Maintenance Pages

- [ ] Create maintenance listing page
- [ ] Create maintenance details page
- [ ] Create maintenance workflow page

### Maintenance Components

- [ ] Create maintenance table
- [ ] Create maintenance status badge
- [ ] Create maintenance timeline
- [ ] Create diagnosis notes panel
- [ ] Create repair action list
- [ ] Create maintenance completion form
- [ ] Create maintenance assignment UI

---

## PHASE 7 - Technician Module

### Technician Pages

- [ ] Create technician listing page
- [ ] Create technician details page
- [ ] Create technician create/edit pages

### Technician Components

- [ ] Create technician table
- [ ] Create technician profile card
- [ ] Create workload summary section
- [ ] Create technician scorecard view
- [ ] Create technician history table

---

## PHASE 8 - Spare Parts Module

### Spare Parts Pages

- [ ] Create spare parts listing page
- [ ] Create spare part details page
- [ ] Create spare part create/edit pages

### Spare Parts Components

- [ ] Create spare parts table
- [ ] Create stock badge
- [ ] Create low stock indicator
- [ ] Create stock movement history view
- [ ] Create stock adjustment form
- [ ] Create part usage section

---

## PHASE 9 - Documentation Module

### Documentation UI

- [ ] Create upload UI
- [ ] Create media preview cards
- [ ] Create linked-documentation section
- [ ] Create image/file metadata display
- [ ] Create upload validation feedback
- [ ] Create file gallery/grid view

---

## PHASE 10 - Reports Module

### Reports Pages

- [ ] Create reports overview page
- [ ] Create maintenance history report UI
- [ ] Create technician performance report UI
- [ ] Create spare parts usage report UI
- [ ] Create request volume report UI
- [ ] Create completion rate report UI

### Reports Components

- [ ] Create filter toolbar
- [ ] Create report cards
- [ ] Create tabular report views
- [ ] Create export-ready report layout placeholders

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
