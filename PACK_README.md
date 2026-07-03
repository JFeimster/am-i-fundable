# Batch API-3 — JSON Schemas

Generated for: Am I Fundable / Funding Readiness Scorecard

## Created files

- `/schemas/api/scorecard-submit-request.schema.json`
- `/schemas/api/scorecard-submit-response.schema.json`
- `/schemas/api/review-request.schema.json`
- `/schemas/api/review-response.schema.json`
- `/schemas/api/readiness-report-request.schema.json`
- `/schemas/api/readiness-report-response.schema.json`
- `/schemas/api/funding-paths-response.schema.json`
- `/schemas/api/document-checklist-response.schema.json`
- `/schemas/api/resource-recommendation-request.schema.json`
- `/schemas/api/resource-recommendation-response.schema.json`
- `/schemas/api/error-response.schema.json`
- `/schemas/api/health-response.schema.json`

## Design notes

- Schemas use JSON Schema draft 2020-12.
- Schemas are tailored to the public-safe API route pack.
- Public response schemas do not allow provider names, apply URLs, affiliate URLs, commission data, private contacts, or routing notes.
- Scorecard request schemas require the same core answer fields used by the scoring engine.
- Review and report schemas use readiness language only.

## Validation

- JSON parse validation: passed.
- Required schema metadata check: passed.
- Restricted outcome-language scan: passed.
