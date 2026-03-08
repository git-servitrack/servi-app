Help me implement PHASE 14 of my SERVI-WEB frontend.

Stack:

- Next.js latest
- TypeScript
- Tailwind CSS
- shadcn/ui

Goal:
Create the frontend authentication entry flow and admin-controlled account provisioning direction.

Please generate and implement the frontend structure for:

- sign in page
- account recovery page
- auth layout shell
- auth form validation states
- role-aware post-login routing placeholders
- admin-only user management entry for account creation

Requirements:

- frontend-only
- align with the existing App Router structure
- align with the current shared form strategy using `react-hook-form` and `zod`
- keep auth pages clean, professional, and production-ready
- keep auth pages separate from the dashboard shell
- prepare the UI for backend auth integration later
- do not expose public self-service sign-up if account creation is admin-controlled

Available roles to support in the auth flow:

1. Warehouse Staff / Requesting Personnel
2. Admin / System Operator
3. Technicians / Maintenance Staff
4. Head Technicians / Supervisors
5. Project Site Staff / Leadmen
6. Management / Company

Please include:

- sign in page with email/username and password inputs
- account recovery entry point
- clear support for the six user roles in post-login routing and admin provisioning
- loading, error, and success feedback states
- no public create-account route
- recommendation for route structure such as `/sign-in` and `/recover-account`
- recommendation for where auth services, schemas, and shared auth components should live
- recommendation for where admin-only user management pages, forms, and role assignment UI should live inside the dashboard app

Implementation notes:

- pages should remain thin and compose feature components
- auth forms should follow the same reusable form-shell patterns already used in the app
- role-aware behavior can stay mock-based for now, but the structure should be ready for real session handling later
- account creation should be handled by Admin / System Operator users from a dashboard user management module, not from a public sign-up page
