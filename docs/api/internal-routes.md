# Internal/Admin API Routes

This document describes the **internal/admin-only** API routes for Am I Fundable.

These routes are not public product features. They are operational helpers for registry checks, demo review queue summaries, internal validation, and system checks.

## Hard boundary

Internal/admin routes must not be imported into public GPT Actions.

They must remain:

```txt
internal/admin-only
disabled by default
token-protected
summary-output only
```

## Required environment

Admin routes should only run when both are true:

```txt
AM_I_FUNDABLE_ENABLE_ADMIN_ROUTES=true
AM_I_FUNDABLE_ADMIN_TOKEN=<private-token-in-hosting-env>
```

Never commit token values to the repository.

## Internal route list

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/api/admin/registry-health` | Summarize registry health and parseability. |
| `GET/POST` | `/api/admin/validate-public-boundary` | Scan public surfaces for restricted fields and outcome-certainty wording. |
| `GET/POST` | `/api/admin/validate-product-registry` | Validate internal product/provider registry structure. |
| `POST` | `/api/admin/sync-public-indexes` | Generate dry-run public-safe index payloads. |
| `POST` | `/api/admin/rebuild-site-data` | Generate a site-data rebuild plan. |
| `GET/POST` | `/api/admin/review-queue` | Return demo review queue summaries. |
| `POST` | `/api/admin/review-lead` | Create demo lead review summary. |
| `POST` | `/api/admin/assign-lead` | Assign a demo lead to a demo assignee or queue. |
| `GET/POST` | `/api/admin/export-demo-payload` | Export safe demo payloads. |
| `GET` | `/api/admin/system-check` | Summarize API file and environment readiness. |

## What admin routes may return

Admin routes may return:

- counts
- parse status
- issue summaries
- demo payloads
- missing file names
- route IDs
- queue category names
- timestamps
- internal/admin-only visibility labels

## What admin routes must not return

Admin routes must not return:

- raw internal provider registries
- raw internal product registries
- private provider contacts
- real applicant data
- credentials
- hosting secrets
- private routing notes
- partner economics
- real CRM object IDs from production systems

## Recommended deployment behavior

By default:

```txt
enabled: false
```

In a protected environment:

```txt
enabled: true
token required: true
```

Admin routes are operational tools, not public features.
