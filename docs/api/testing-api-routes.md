# Testing API Routes

This repo uses dependency-free Node testing where possible.

## Core commands

Suggested package scripts:

```json
{
  "test:api": "node --test tests/api/*.test.js",
  "test:schemas": "node --test tests/schemas/*.test.js",
  "validate:api-schemas": "node scripts/validate-api-schemas.js",
  "validate:openapi": "node scripts/validate-openapi.js",
  "validate:api-examples": "node scripts/validate-api-examples.js",
  "check:public-api-safety": "node scripts/check-public-api-safety.js",
  "validate:api": "npm run validate:api-schemas && npm run validate:openapi && npm run validate:api-examples && npm run check:public-api-safety"
}
```

## What to test

API route tests should verify:

- correct HTTP method handling
- OPTIONS preflight
- valid payload success
- invalid payload response
- public/private boundary safety
- no restricted outcome wording
- no secret output
- expected response shape

## Test layers

```txt
tests/api/
tests/schemas/
tests/openapi/
scripts/
```

## Manual smoke checks

Use:

```bash
curl https://am-i-fundable.vercel.app/api/health
curl https://am-i-fundable.vercel.app/api/version
curl https://am-i-fundable.vercel.app/api/public/funding-paths
```

For POST routes:

```bash
curl -X POST https://am-i-fundable.vercel.app/api/scorecard/generate-readiness-report \
  -H "Content-Type: application/json" \
  --data @examples/api/readiness-report-request.json
```

## Admin route tests

Admin routes should not be public smoke-tested without explicit protected environment setup.

They should require:

```txt
AM_I_FUNDABLE_ENABLE_ADMIN_ROUTES=true
AM_I_FUNDABLE_ADMIN_TOKEN=<private-token>
```

## Failure behavior

A failing public-boundary check should block merge until fixed.
