# Batch API-9 — API Registries + YAML Configs

Generated for: Am I Fundable / Funding Readiness Scorecard

## Created JSON registries

- `/config/api/api-routes.registry.json`
- `/config/api/public-api.registry.json`
- `/config/api/internal-api.registry.json`
- `/config/api/gpt-actions.registry.json`
- `/config/api/webhook-events.registry.json`
- `/config/api/error-codes.registry.json`
- `/config/api/response-templates.registry.json`
- `/config/api/payload-examples.registry.json`

## Created YAML configs

- `/config/api/public-routes.yaml`
- `/config/api/internal-routes.yaml`
- `/config/api/action-groups.yaml`
- `/config/api/response-boundaries.yaml`
- `/config/api/restricted-fields.yaml`
- `/config/api/event-taxonomy.yaml`
- `/config/api/demo-payloads.yaml`

## Notes

- JSON registries are machine-readable control-plane files.
- YAML configs are human-readable operating configs.
- Public routes are marked public-safe.
- Admin/internal routes are marked server-side/internal and disabled by default.
- Restricted fields YAML intentionally lists blocked field names for scanning/config purposes.
- No `vercel.json` changes are included.

## Validation

- JSON parse validation: passed.
- YAML parse validation: passed.
- Required metadata review: passed.
- Restricted outcome-language scan: passed.
