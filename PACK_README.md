# Batch API-10 — Remaining API + Registry Schemas

Generated for: Am I Fundable / Funding Readiness Scorecard

## Created remaining API schemas

- `/schemas/api/scorecard-start-request.schema.json`
- `/schemas/api/result-tier-response.schema.json`
- `/schemas/api/lead-create-request.schema.json`
- `/schemas/api/lead-route-request.schema.json`
- `/schemas/api/lead-route-response.schema.json`
- `/schemas/api/webhook-event.schema.json`

## Created registry schemas

- `/schemas/registries/public-funding-path.registry.schema.json`
- `/schemas/registries/document-checklist.registry.schema.json`
- `/schemas/registries/resource-library.registry.schema.json`
- `/schemas/registries/result-tier.registry.schema.json`
- `/schemas/registries/lead-routing-rule.registry.schema.json`
- `/schemas/registries/manual-review-rule.registry.schema.json`
- `/schemas/registries/nurture-path.registry.schema.json`
- `/schemas/registries/crm-stage-map.registry.schema.json`
- `/schemas/registries/webhook-event.registry.schema.json`
- `/schemas/registries/public-api.registry.schema.json`
- `/schemas/registries/internal-api.registry.schema.json`

## Notes

- All schema files use JSON Schema draft 2020-12.
- Public schemas are structured around public-safe categories, readiness guidance, lead route summaries, event acknowledgements, and educational resources.
- Registry schemas define machine-readable contracts for API control-plane files, funding path registries, document checklists, CRM-stage maps, and webhook event taxonomies.
- Internal API schemas are clearly marked for server-side/internal use and do not include real secrets or real borrower PII.
- No `vercel.json` changes are included.

## Validation

- JSON parse validation: passed.
- Required schema metadata validation: passed.
- Restricted outcome-language scan: passed.
- Secret scan: passed.
