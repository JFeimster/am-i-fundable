# Batch API-1 + API-2 File Pack

Generated for: Am I Fundable / Funding Readiness Scorecard

## Includes

### Batch API-1 — Public API Routes

- `/api/public/funding-paths.js`
- `/api/public/document-checklist.js`
- `/api/public/result-tier.js`
- `/api/public/resource-recommendations.js`
- `/api/scorecard/request-review.js`
- `/api/scorecard/generate-readiness-report.js`
- `/api/match/funding-paths.js`
- `/api/health.js`
- `/api/version.js`

### Batch API-2 — API Helpers

- `/lib/api/http.js`
- `/lib/api/cors.js`
- `/lib/api/errors.js`
- `/lib/api/response.js`
- `/lib/api/request-parser.js`
- `/lib/api/public-boundary.js`
- `/lib/api/validate-payload.js`
- `/lib/api/safe-result-presenter.js`
- `/lib/api/report-builder.js`

## Notes

- Routes are Vercel/serverless-compatible ES modules.
- Routes use public-safe response helpers and CORS handling.
- Browser/public routes do not expose internal provider records, apply URLs, affiliate URLs, commission data, private contacts, routing notes, or secrets.
- `/api/match/funding-paths.js` reads internal registries server-side and returns only public-safe funding path recommendations.
- `/api/scorecard/generate-readiness-report.js` returns a structured report plus Markdown.
- `/api/scorecard/request-review.js` validates consent and answers before creating a review queue response.
- No `vercel.json` changes are included.

## Validation

- JS syntax check: PASSED
- Restricted outcome language scan: PASSED
- JSON validation: not applicable; no JSON files in this pack
- YAML validation: not applicable; no YAML files in this pack
