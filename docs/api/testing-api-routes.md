# Testing API Routes

This repo uses dependency-free Node testing where possible.

## Core commands

Use the scripts currently defined in `package.json`:

```bash
npm run validate
npm test
npm run build
```

The preferred pre-PR command runs all three in sequence:

```bash
npm run check
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

## Manual live smoke checks

Live verification is opt-in because it sends both read requests and demo POST requests to production. It is not part of the normal pull-request workflow.

Run the maintained smoke script only when live verification is explicitly required:

```bash
npm run verify:production
```

For targeted manual checks, use:

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
