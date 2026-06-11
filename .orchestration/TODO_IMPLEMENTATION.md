# TODO_IMPLEMENTATION.md

## App API Integration Roadmap

This file bridges the implemented `servi-api` modules to the `servi-app` client work still needed to consume them.

The API currently exposes versioned endpoints under `/api/v1/*` and returns the standard response envelope:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {},
  "meta": {}
}
```

The app already has a frontend service layer in `src/services`, but many screens still depend on static `features/*/data/*` records and `simulateNetwork`. The goal is to replace those mocks module by module without scattering fetch logic across pages or UI components.

---

## PHASE 1 - Integration Foundation

### Environment and HTTP Client

- [x] Document and add `NEXT_PUBLIC_API_BASE_URL`, expected to point at the API version root such as `http://localhost:5000/api/v1`
- [x] Define an `ApiEnvelope<T>` type matching `{ success, message, data, meta? }`
- [x] Update `requestJson` to call API-relative paths through the configured base URL
- [x] Update `requestJson` to unwrap `data` while preserving `message` and `meta` when the UI needs mutation feedback or pagination context
- [x] Normalize API error responses into the existing `ApiResult<T>` and `AppRequestError` pattern
- [x] Add query serialization support for API query params: `fields`, `limit`, `sort`, `order`, `filter`, and `populate`
- [x] Add multipart request support for documentation uploads without forcing `Content-Type: application/json`
- [x] Keep all API calls inside `src/services`; pages and components should call service methods only

### Authentication and Authorization

- [x] Store access token after successful sign-in
- [x] Attach `Authorization: Bearer <token>` to protected API requests
- [x] Add a shared session helper for retrieving the current user from `GET /auth/me`
- [x] Define frontend-to-API role mapping:
  - `warehouse-staff` -> `warehouse_staff`
  - `admin-operator` -> `admin`
  - `technician` -> `technician`
  - `head-technician` -> `head_technician`
  - `project-site` -> `project_site_staff`
  - `management` -> `management`
- [x] Add role-aware access helper functions for future UI gating after real session data is available

### Mock Replacement Rules

- [ ] Replace `simulateNetwork` only after each module has a working API-backed service method
- [ ] Replace direct imports from `features/*/data/*` in list/detail pages with service results
- [ ] Keep static data files only as local fallback fixtures or test/demo references
- [ ] Preserve existing loading, empty, error, and mutation feedback components during the transition
- [ ] Run `pnpm lint` and `pnpm build` after each integration batch

---

## PHASE 2 - Domain Wiring Checklist

### Auth and User Management

- [x] Wire sign-in to `POST /auth/login`
- [x] Wire current-user session loading to `GET /auth/me`
- [x] Decide whether account recovery remains frontend-only until the API adds a recovery endpoint
- [x] Wire admin user listing to `GET /user`
- [x] Wire user detail/edit pages to `GET /user/:id`
- [x] Wire dashboard-only user provisioning to `POST /user`
- [x] Wire user updates to `PUT /user`
- [x] Wire user deletion to `DELETE /user/:id`
- [x] Keep public self-service sign-up disabled in the app shell
- [x] Restrict account provisioning UI to Admin / System Operator users after role-aware session wiring
- [x] Add protected dashboard route guard and redirect signed-in users away from auth pages

### Assets and Categories

- [x] Wire asset listing to `GET /asset`
- [x] Wire asset detail pages to `GET /asset/:id`
- [x] Wire asset create form to `POST /asset`
- [x] Wire asset edit form to `PUT /asset`
- [x] Wire asset deletion, if exposed in the UI, to `DELETE /asset/:id`
- [x] Wire asset search/filter behavior to `POST /asset/search` or query params on `GET /asset`
- [x] Wire category selectors to `GET /category`
- [x] Map frontend asset payloads to API fields, especially category ObjectId, dates, status, and criticality

### Service Requests

- [x] Wire request listing to `GET /service-requests`
- [x] Wire request detail pages to `GET /service-requests/:id`
- [x] Wire request creation to `POST /service-requests`
- [x] Wire request updates to `PUT /service-requests`
- [x] Wire request deletion, if exposed in the UI, to `DELETE /service-requests/:id`
- [x] Wire search/filter behavior over the `GET /service-requests` result set
- [x] Map selected requester and asset values to API ObjectIds
- [x] Align request status and priority values with API enums

### Maintenance Operations

- [x] Wire maintenance listing to `GET /maintenance`
- [x] Wire maintenance detail pages to `GET /maintenance/:id`
- [x] Wire maintenance history service helper to `GET /maintenance/history`
- [x] Wire asset maintenance history service helper to `GET /maintenance/history/asset/:assetId`
- [x] Wire open-from-request flow to `POST /maintenance/from-request`
- [x] Wire direct maintenance creation service helper to `POST /maintenance`
- [x] Wire technician assignment to `PATCH /maintenance/:id/assign-technician`
- [x] Wire start workflow action to `PATCH /maintenance/:id/start`
- [x] Wire diagnosis notes to `PATCH /maintenance/:id/diagnosis`
- [x] Wire repair actions to `POST /maintenance/:id/repair-actions`
- [x] Wire hold action to `PATCH /maintenance/:id/hold`
- [x] Wire completion form to `PATCH /maintenance/:id/complete`
- [x] Align workflow UI with API-supported statuses, including `On Hold`

### Technicians

- [x] Replace technician mock profiles with `GET /user?filter=role:technician` or the agreed API role filter format
- [x] Wire technician detail pages to `GET /user/:id`
- [x] Wire technician maintenance history to `GET /maintenance/history/technician/:technicianId`
- [x] Wire workload summaries to `GET /maintenance/technicians/workloads`
- [x] Wire technician scorecards to `GET /maintenance/technicians/:technicianId/scorecard`
- [x] Keep create/edit technician UI aligned with admin user provisioning unless a separate technician API model is added later

### Spare Parts

- [x] Wire spare parts listing to `GET /spare-parts`
- [x] Wire spare part details to `GET /spare-parts/:id`
- [x] Wire spare part creation to `POST /spare-parts`
- [x] Wire spare part updates to `PUT /spare-parts`
- [x] Wire deletion, if exposed in the UI, to `DELETE /spare-parts/:id`
- [x] Wire low-stock views to `GET /spare-parts/low-stock`
- [x] Wire stock movement history to `GET /spare-parts/:id/movements`
- [x] Wire part usage history to `GET /spare-parts/:id/usage`
- [x] Wire stock add to `PATCH /spare-parts/:id/stock/add`
- [x] Wire stock deduct to `PATCH /spare-parts/:id/stock/deduct`
- [x] Wire stock adjust to `PATCH /spare-parts/:id/stock/adjust`
- [x] Wire reserve action to `PATCH /spare-parts/:id/reserve`
- [x] Wire repair usage logging to `POST /spare-parts/:id/usage`

### Documentation Uploads

- [x] Wire documentation gallery to `GET /documentation`
- [x] Wire media detail/preview data to `GET /documentation/:id`
- [x] Wire media search to `POST /documentation/search`
- [x] Wire media deletion to `DELETE /documentation/:id`
- [x] Wire file upload to `POST /documentation/upload` with multipart form data
- [x] Include upload fields expected by the API: `title`, `summary`, `purpose`, `tags`, `relatedModel`, `relatedId`, and optional `status`
- [x] Map documentation links to API related models: asset, service request, or maintenance job
- [x] Keep current damage-image analysis UI simulated until damage detection API endpoints exist

### Predictive Maintenance

- [x] Wire model training admin action, if exposed, to `POST /predictive-maintenance/train`
- [x] Wire manual prediction to `POST /predictive-maintenance/predict`
- [x] Wire asset-specific prediction to `POST /predictive-maintenance/assets/:assetId/predict`
- [x] Wire prediction listing to `GET /predictive-maintenance`
- [x] Wire prediction detail to `GET /predictive-maintenance/:id`
- [x] Wire prediction search to `POST /predictive-maintenance/search`
- [x] Wire prediction deletion, if exposed in the UI, to `DELETE /predictive-maintenance/:id`
- [x] Add frontend contracts for decision-tree fields: `type`, `airTemperature`, `processTemperature`, `rotationalSpeed`, `torque`, and `toolWear`
- [ ] Connect Phase 11 UI items: asset risk card, dashboard high-risk section, service request risk context, maintenance assignment context, and high-risk equipment report
  - Initial placement done: Predictive Maintenance now has a dedicated page with manual/asset-linked predictive analysis and recent saved predictions. Asset/dashboard/request/maintenance contextual cards can reuse the same service in later UI passes.

### Reports and Dashboard

- [ ] Wire reports overview to `GET /reports/overview`
- [ ] Wire report metrics to `GET /reports/metrics`
- [ ] Wire maintenance history report to `GET /reports/maintenance-history`
- [ ] Wire technician performance report to `GET /reports/technician-performance`
- [ ] Wire spare parts usage report to `GET /reports/spare-parts-usage`
- [ ] Wire downtime report to `GET /reports/downtime`
- [ ] Wire high-risk equipment report to `GET /reports/high-risk-equipment`
- [ ] Wire request volume report to `GET /reports/request-volume`
- [ ] Wire completion rate report to `GET /reports/completion-rate`
- [ ] Replace dashboard mock metrics with a combination of report overview data and module summary endpoints
- [ ] Preserve report filters for `from`, `to`, `period`, `site`, `team`, and `limit`

---

## API Endpoint Map

| Client Area            | API Endpoint                                       | Method       | Client Work                           |
| ---------------------- | -------------------------------------------------- | ------------ | ------------------------------------- |
| Auth                   | `/auth/login`                                      | POST         | Sign in and store tokens              |
| Auth                   | `/auth/me`                                         | GET          | Load current session user             |
| User Management        | `/user`                                            | GET/POST/PUT | List, provision, and update users     |
| User Management        | `/user/:id`                                        | GET/DELETE   | Detail and delete users               |
| Assets                 | `/asset`                                           | GET/POST/PUT | List, create, and update assets       |
| Assets                 | `/asset/:id`                                       | GET/DELETE   | Detail and delete assets              |
| Assets                 | `/asset/search`                                    | POST         | Search assets                         |
| Categories             | `/category`                                        | GET/POST/PUT | Category list and admin maintenance   |
| Service Requests       | `/service-requests`                                | GET/POST/PUT | List, create, and update requests     |
| Service Requests       | `/service-requests/:id`                            | GET/DELETE   | Detail and delete requests            |
| Service Requests       | `/service-requests/search`                         | POST         | Search requests                       |
| Maintenance            | `/maintenance`                                     | GET/POST/PUT | List, create, and update jobs         |
| Maintenance            | `/maintenance/:id`                                 | GET/DELETE   | Detail and delete jobs                |
| Maintenance            | `/maintenance/from-request`                        | POST         | Open job from service request         |
| Maintenance            | `/maintenance/:id/assign-technician`               | PATCH        | Assign technician                     |
| Maintenance            | `/maintenance/:id/start`                           | PATCH        | Start work                            |
| Maintenance            | `/maintenance/:id/diagnosis`                       | PATCH        | Save diagnosis notes                  |
| Maintenance            | `/maintenance/:id/repair-actions`                  | POST         | Add repair action                     |
| Maintenance            | `/maintenance/:id/hold`                            | PATCH        | Put job on hold                       |
| Maintenance            | `/maintenance/:id/complete`                        | PATCH        | Complete job                          |
| Technicians            | `/maintenance/technicians/workloads`               | GET          | Workload summaries                    |
| Technicians            | `/maintenance/history/technician/:technicianId`    | GET          | Technician history                    |
| Technicians            | `/maintenance/technicians/:technicianId/scorecard` | GET          | Technician scorecard                  |
| Spare Parts            | `/spare-parts`                                     | GET/POST/PUT | List, create, and update parts        |
| Spare Parts            | `/spare-parts/:id`                                 | GET/DELETE   | Detail and delete parts               |
| Spare Parts            | `/spare-parts/low-stock`                           | GET          | Low-stock list                        |
| Spare Parts            | `/spare-parts/:id/movements`                       | GET          | Stock movement history                |
| Spare Parts            | `/spare-parts/:id/usage`                           | GET/POST     | Usage history and usage logging       |
| Spare Parts            | `/spare-parts/:id/stock/add`                       | PATCH        | Add stock                             |
| Spare Parts            | `/spare-parts/:id/stock/deduct`                    | PATCH        | Deduct stock                          |
| Spare Parts            | `/spare-parts/:id/stock/adjust`                    | PATCH        | Adjust stock                          |
| Spare Parts            | `/spare-parts/:id/reserve`                         | PATCH        | Reserve part                          |
| Documentation          | `/documentation`                                   | GET          | Media gallery                         |
| Documentation          | `/documentation/:id`                               | GET/DELETE   | Detail and delete media               |
| Documentation          | `/documentation/upload`                            | POST         | Multipart image upload                |
| Documentation          | `/documentation/search`                            | POST         | Search media                          |
| Predictive Maintenance | `/predictive-maintenance/train`                    | POST         | Train model action                    |
| Predictive Maintenance | `/predictive-maintenance/predict`                  | POST         | Manual prediction                     |
| Predictive Maintenance | `/predictive-maintenance/assets/:assetId/predict`  | POST         | Asset prediction                      |
| Predictive Maintenance | `/predictive-maintenance`                          | GET          | Prediction list                       |
| Predictive Maintenance | `/predictive-maintenance/:id`                      | GET/DELETE   | Prediction detail and delete          |
| Predictive Maintenance | `/predictive-maintenance/search`                   | POST         | Search predictions                    |
| Reports                | `/reports/overview`                                | GET          | Reports overview and dashboard source |
| Reports                | `/reports/metrics`                                 | GET          | Report metric cards                   |
| Reports                | `/reports/maintenance-history`                     | GET          | Maintenance history report            |
| Reports                | `/reports/technician-performance`                  | GET          | Technician performance report         |
| Reports                | `/reports/spare-parts-usage`                       | GET          | Spare parts usage report              |
| Reports                | `/reports/downtime`                                | GET          | Downtime report                       |
| Reports                | `/reports/high-risk-equipment`                     | GET          | High-risk equipment report            |
| Reports                | `/reports/request-volume`                          | GET          | Request volume report                 |
| Reports                | `/reports/completion-rate`                         | GET          | Completion rate report                |

---

## Blocked or Future API Work

### Damage Detection

- [ ] Keep damage detection UI marked as simulated until the API adds damage detection routes
- [ ] Add client service contracts only after the API defines the damage detection request and response shape
- [ ] Expected future client surfaces:
  - analyze existing documentation media
  - upload and analyze image in one flow
  - show top prediction label
  - show all class confidence scores
  - show severity, suggested action, and low-confidence fallback state
- [ ] Do not wire the current documentation vision UI to predictive maintenance endpoints; these are separate API capabilities

### API Contract Follow-Ups

- [ ] Confirm whether list endpoints will return pagination metadata in `meta`
- [ ] Confirm whether search endpoints remain POST-based or should be replaced by query params
- [ ] Confirm whether frontend date strings should be submitted as ISO strings everywhere
- [ ] Confirm whether update endpoints should continue using body `_id` instead of route params
- [ ] Confirm final CORS origin for local and deployed app environments

---

## Verification Checklist

### Markdown Verification

- [ ] Confirm this file exists at `servi-app/.orchestration/TODO_IMPLEMENTATION.md`
- [ ] Confirm every currently registered API controller domain is represented
- [ ] Confirm each frontend mock/static-data replacement area is listed
- [ ] Confirm damage detection remains marked as blocked/future

### Future Implementation Verification

- [ ] Run `pnpm lint` in `servi-app` after each real integration batch
- [ ] Run `pnpm build` in `servi-app` after each real integration batch
- [ ] Smoke test sign-in and session restoration
- [ ] Smoke test list/detail pages for assets, requests, maintenance, technicians, spare parts, documentation, predictive maintenance, and reports
- [ ] Smoke test create/edit forms and mutation feedback
- [ ] Smoke test documentation uploads with valid and invalid files
- [ ] Smoke test protected routes and role-aware navigation
- [ ] Smoke test empty, loading, and error states with API failures

---

## Definition of Done

The API integration is complete when:

- [ ] All production-facing module pages read from `src/services` instead of static records
- [ ] Forms submit to real API endpoints with typed payloads
- [ ] Protected requests include the access token
- [ ] API response envelopes are normalized consistently
- [ ] Uploads use multipart requests where required
- [ ] Role-aware UI behavior uses real session data
- [ ] Predictive maintenance UI consumes real prediction/report data
- [ ] Damage detection UI is either fully wired to future API endpoints or clearly labeled as simulated
- [ ] `pnpm lint` passes
- [ ] `pnpm build` passes
