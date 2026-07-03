# Batch API-6 — Testing + Validation

Generated for: Am I Fundable / Funding Readiness Scorecard

## Created test files

- `/tests/api/health.test.js`
- `/tests/api/public-funding-paths.test.js`
- `/tests/api/document-checklist.test.js`
- `/tests/api/resource-recommendations.test.js`
- `/tests/api/request-review.test.js`
- `/tests/api/readiness-report.test.js`
- `/tests/api/public-boundary.test.js`
- `/tests/schemas/api-schemas.test.js`

## Created validation scripts

- `/scripts/validate-api-schemas.js`
- `/scripts/validate-openapi.js`
- `/scripts/validate-api-examples.js`
- `/scripts/check-public-api-safety.js`

## Suggested package.json additions

Add these scripts after the batch files are added:

```json
{
  "scripts": {
    "test:api": "node --test tests/api/*.test.js",
    "test:schemas": "node --test tests/schemas/*.test.js",
    "validate:api-schemas": "node scripts/validate-api-schemas.js",
    "validate:openapi": "node scripts/validate-openapi.js",
    "validate:api-examples": "node scripts/validate-api-examples.js",
    "check:public-api-safety": "node scripts/check-public-api-safety.js",
    "validate:api": "npm run validate:api-schemas && npm run validate:openapi && npm run validate:api-examples && npm run check:public-api-safety",
    "test:api-all": "npm run validate:api && npm run test:api && npm run test:schemas"
  }
}
```

## Notes

- Tests use Node's built-in `node:test` runner.
- Tests assume Batch API-1 through API-5 files have been added before running.
- Validation scripts are dependency-free and static-first.
- Public API safety checks block sensitive field references and restricted outcome language.
- No `vercel.json` changes are included.

## Validation

- JS syntax check: passed.
- Restricted outcome-language scan: passed.
