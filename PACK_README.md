# Batch API-11 — Remaining Docs + Examples

Generated for: Am I Fundable / Funding Readiness Scorecard

## Created docs

- `/docs/api/internal-routes.md`
- `/docs/api/auth-boundaries.md`
- `/docs/api/webhook-events.md`
- `/docs/api/readiness-report-api.md`
- `/docs/api/lead-routing-api.md`
- `/docs/api/manual-review-api.md`
- `/docs/api/versioning.md`
- `/docs/api/testing-api-routes.md`
- `/docs/api/no-auth-public-actions.md`
- `/docs/api/admin-actions-not-public.md`

## Created examples

- `/examples/api/health-response.json`
- `/examples/api/scorecard-submit-request.warm.json`
- `/examples/api/scorecard-submit-request.nurture.json`
- `/examples/api/scorecard-submit-request.not-ready.json`
- `/examples/api/scorecard-submit-response.warm.json`
- `/examples/api/scorecard-submit-response.nurture.json`
- `/examples/api/scorecard-submit-response.not-ready.json`
- `/examples/api/resource-recommendation-request.json`
- `/examples/api/resource-recommendation-response.json`
- `/examples/api/review-request.json`
- `/examples/api/review-response.json`
- `/examples/api/lead-route-request.json`
- `/examples/api/lead-route-response.json`
- `/examples/api/error-response.private-boundary.json`

## Notes

- Examples use demo data only.
- Docs clearly separate public no-auth actions from internal/admin-only routes.
- Public examples avoid private provider/provider-product data.
- Admin docs explain boundaries without exposing secrets.
- No `vercel.json` changes are included.

## Validation

- JSON example parse validation: passed.
- Markdown readability review: passed.
- Restricted outcome-language scan: passed.
- Secret scan: passed.
