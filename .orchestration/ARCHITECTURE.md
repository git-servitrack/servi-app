# ARCHITECTURE.md

## System Overview

SERVI-WEB is the frontend application for the system.

It is responsible for providing a clean, responsive, and maintainable interface for users interacting with:

- dashboard views
- assets
- service requests
- maintenance workflows
- technicians
- spare parts
- uploaded documentation
- reports and analytics

This frontend consumes backend APIs and presents operational data in a structured interface.

---

## Core Frontend Stack

- **Next.js latest**
- **TypeScript**
- **App Router**
- **Tailwind CSS**
- **shadcn/ui**
- **pnpm**

---

## Architectural Style

The frontend follows a **component-driven architecture** with a **feature-aware structure**.

The architecture should support:

- page composition
- reusable UI primitives
- shared layouts
- modular forms
- isolated data-fetching logic
- scalable dashboard growth

---

## Recommended High-Level Structure

```text
src/
  app/
  components/
    ui/
    shared/
    layout/
    forms/
    data-display/
    feedback/
  features/
    dashboard/
    assets/
    service-requests/
    maintenance/
    technicians/
    spare-parts/
    reports/
    documentation/
  lib/
  hooks/
  services/
  types/
  constants/
```
