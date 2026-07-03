# Naming Conventions

Consistency in naming helps maintain clear data boundaries and readable code.

## Files and Directories

-   **Directories:** `kebab-case` (e.g., `/engineering-as-marketing`).
-   **Files (JSON/JS/MD):** `kebab-case` (e.g., `funding-readiness-scorecard.config.json`).
-   **Public Data Files:** Must end in `.public.json` to clearly denote they are safe for browser consumption.
-   **Internal Registries:** Should end in `.registry.json` or `.control.json`.

## JSON Keys and Object Properties

-   Use `camelCase` for keys in JSON schemas and objects (e.g., `monthlyRevenue`, `timeInBusiness`).
-   When mapping to CRM systems that require specific formats, handle the transformation in the backend API or external workflow tool, keeping the core schema consistent.

## Variables in Code

-   **JS Variables:** `camelCase`.
-   **Constants/Environment Variables:** `UPPER_SNAKE_CASE` (e.g., `SCORECARD_ALLOWED_ORIGIN`).
