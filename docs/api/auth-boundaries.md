# API Auth Boundaries

Am I Fundable uses two practical auth zones:

1. Public-safe no-auth routes
2. Internal/admin-only protected routes

## Public-safe no-auth routes

Public routes are intentionally no-auth because they support:

- public scorecard pages
- embeddable widgets
- Custom GPT Actions
- document checklist lookups
- public funding path category lookups
- readiness reports
- public-safe webhook acknowledgements

Public routes must return only public-safe data.

Examples:

```txt
GET  /api/health
GET  /api/public/funding-paths
GET  /api/public/document-checklist
POST /api/scorecard/generate-readiness-report
POST /api/match/funding-paths
```

## Internal/admin-only routes

Admin routes require:

```txt
AM_I_FUNDABLE_ENABLE_ADMIN_ROUTES=true
AM_I_FUNDABLE_ADMIN_TOKEN=<private-token>
```

Request header:

```txt
X-Admin-Token: <private-token>
```

Alternative supported header:

```txt
X-Am-I-Fundable-Admin-Token: <private-token>
```

Do not use public GPT Actions with these routes.

## Auth design principle

Public routes should be safe even without auth.

Internal routes should be inaccessible unless explicitly enabled and protected.

## Public route safety requirements

Public no-auth routes must not reveal:

- private provider data
- private product data
- private contacts
- partner economics
- private routing notes
- hidden decisioning details
- secrets
- production CRM identifiers
- real applicant data beyond the current request context

## Admin route safety requirements

Admin routes can reference internal concepts, but should still avoid returning raw sensitive records.

Prefer:

```txt
registry count: 8
issue count: 0
status: healthy
```

Avoid:

```txt
raw provider list
private partner contacts
private notes
secret values
```

## Future auth expansion

Future versions may add:

- private API key auth for partner dashboards
- OAuth for CRM integrations
- signed webhooks
- role-based admin views

Keep those separate from public GPT Actions.
