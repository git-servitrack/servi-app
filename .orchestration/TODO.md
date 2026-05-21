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

## PHASE 11 - Intelligence and Predictive Maintenance

### Predictive Maintenance UI

- [ ] Create asset details predictive maintenance card
- [ ] Show asset risk level: Low, Medium, High, or Critical
- [ ] Show failure likelihood and predicted failure type if available
- [ ] Show recommended maintenance window
- [ ] Show suggested maintenance action
- [ ] Show prediction confidence or model status when available
- [ ] Add high-risk assets section to dashboard
- [ ] Add predictive maintenance planning view for assets that need preventive maintenance
- [ ] Add predicted risk indicator in service request creation when an asset is selected
- [ ] Add predicted risk context in maintenance assignment workflow
- [ ] Add predictive maintenance report view for high-risk equipment
- [ ] Add filters for risk level, failure type, asset type, and maintenance window
- [ ] Add empty/loading/error states for prediction API results

### Future Alerts

- [ ] Create placeholder notification pattern for high-risk or critical assets
- [ ] Create placeholder notification pattern for assets nearing recommended maintenance window

---

## PHASE 12 - Forms, Validation, and API Integration

### Integration

- [x] Create API service layer structure
- [x] Create typed service contracts
- [x] Add request helpers
- [x] Add standardized error handling in UI
- [x] Add loading and mutation feedback patterns

### Forms

- [x] Add react-hook-form
- [x] Add zod schemas
- [x] Standardize submit behavior
- [x] Standardize validation messages

---

## PHASE 13 - Frontend Hardening

### Quality

- [x] Review responsiveness across modules
- [x] Review accessibility basics
- [x] Review visual consistency
- [x] Review empty states
- [x] Review error states
- [x] Review loading states
- [x] Review reusable component opportunities

### Cleanup

- [x] Remove duplicate UI patterns
- [x] Refactor oversized page files
- [x] Refactor inconsistent naming
- [x] Clean dead code
- [x] Improve maintainability

---

## PHASE 14 - Frontend Documentation

### Documentation

- [ ] Document folder structure
- [ ] Document component organization
- [ ] Document form strategy
- [ ] Document API integration pattern
- [ ] Document route structure
- [ ] Document UI conventions
- [ ] Document naming conventions

---

## PHASE 15 - Authentication and Role Access

### Authentication Pages

- [x] Create sign in page
- [x] Remove public create-account flow from auth entry
- [x] Create auth-only layout shell
- [x] Keep public auth routes limited to sign in and recover-account
- [x] Add forgot-password or account recovery entry point placeholder

### Role-Aware Access

- [x] Move account creation and role assignment into dashboard user management
- [x] Create admin-only user management page for account provisioning
- [x] Add role descriptions to support correct user selection in admin provisioning
- [x] Define role-aware redirect placeholders after authentication
- [x] Define auth service structure for future backend integration
- [x] Define auth schemas and validation strategy
- [x] Define shared auth components and feedback states

### User Management Direction

- [x] Add user management module to dashboard navigation
- [x] Create user listing page for admins
- [x] Create create-user form for admins
- [x] Create edit-user / role-assignment flow for admins
- [ ] Restrict account provisioning to Admin / System Operator role

### Supported Roles

- [x] Warehouse Staff / Requesting Personnel
- [x] Admin / System Operator
- [x] Technicians / Maintenance Staff
- [x] Head Technicians / Supervisors
- [x] Project Site Staff / Leadmen
- [x] Management / Company

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
11. Hardening
12. Frontend documentation
13. Authentication and role access
14. Intelligence and predictive maintenance

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
