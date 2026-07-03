# Admin Actions Are Not Public

Admin API routes must not be imported into public GPT Actions.

## Admin routes

```txt
/api/admin/registry-health
/api/admin/validate-public-boundary
/api/admin/validate-product-registry
/api/admin/sync-public-indexes
/api/admin/rebuild-site-data
/api/admin/review-queue
/api/admin/review-lead
/api/admin/assign-lead
/api/admin/export-demo-payload
/api/admin/system-check
```

## Why these are private

Admin routes can reference internal operational concepts such as:

- registry health
- internal review queues
- admin-only validation
- site-data rebuild plans
- demo exports
- internal route readiness

Even when they return summaries only, they are not public product features.

## Required controls

Admin routes should require:

```txt
AM_I_FUNDABLE_ENABLE_ADMIN_ROUTES=true
AM_I_FUNDABLE_ADMIN_TOKEN=<private-token>
```

Do not expose the token in:

- GitHub
- Custom GPT instructions
- public docs
- client-side JavaScript
- screenshots
- issue comments

## Public replacement

For public GPT Actions, use:

```txt
/schemas/openapi/am-i-fundable.public-actions.openapi.yaml
```

## Safe admin output

Admin routes may output:

- counts
- status
- issue categories
- missing file names
- demo payloads
- internal/admin-only visibility labels

Admin routes should not output raw sensitive records.
