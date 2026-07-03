# Batch API-4 — OpenAPI Actions

Generated for: Am I Fundable / Funding Readiness Scorecard

## Created files

- `/schemas/openapi/am-i-fundable.public-actions.openapi.yaml`
- `/schemas/openapi/public-scorecard.openapi.yaml`
- `/schemas/openapi/public-funding-paths.openapi.yaml`
- `/schemas/openapi/document-checklist.openapi.yaml`
- `/schemas/openapi/resource-recommendations.openapi.yaml`
- `/schemas/openapi/review-request.openapi.yaml`
- `/schemas/openapi/readiness-report.openapi.yaml`

## Design notes

- Uses OpenAPI 3.1.0.
- Public action schemas only.
- No private provider names, apply URLs, affiliate URLs, commission data, private contacts, underwriting notes, or routing secrets.
- Descriptions explicitly frame outputs as funding readiness guidance, not approval/offer/underwriting decisions.
- The combined `am-i-fundable.public-actions.openapi.yaml` is the most useful Custom GPT action import file.
- Individual OpenAPI files are included for smaller tool/action-specific imports.

## Suggested GPT Action import order

1. Use `/schemas/openapi/am-i-fundable.public-actions.openapi.yaml` for one consolidated action set.
2. Use individual files only if you want separate GPTs for scorecard, documents, resources, or reports.

## Validation

- YAML parse validation: passed.
- OpenAPI metadata check: passed.
- Restricted outcome-language scan: passed.
- No `vercel.json` changes included.
