# Funding Readiness Scorecard — Batch 4–7 Seed Pack

This ZIP adds the data/API foundation for the Funding Readiness Scorecard without changing the existing landing page or widget UI.

## What this pack adds

- Internal product/provider registries for server-side matching.
- Internal routing, disqualifier, lead-priority, and manual-review rules.
- Public-safe data files for browser rendering.
- Public-transform script to generate safe browser files from internal registries.
- Lead capture field definitions and CRM mapping files.
- Vercel-compatible API route scaffolds.
- Partner match engine that returns white-labeled funding paths publicly.

## Data boundary rule

Public files under `/data` and safe `/config` paths must not expose:

- Provider names
- Provider IDs
- Affiliate URLs
- Apply URLs
- Commission rates
- Contact emails
- Private notes
- Internal routing rules

Provider-specific routing belongs in `/internal` and API routes only.

## API routes

- `/api/health.js` — basic health check.
- `/api/submit-score.js` — receives applicant + score data and optionally posts to an external webhook.
- `/api/match-partners.js` — reads internal provider/product registries server-side and returns public-safe funding path recommendations.
- `/api/lender-match-review.js` — queues a human-review-first request.

## Environment placeholders

Optional future environment variables:

```txt
SCORECARD_ALLOWED_ORIGIN=
N8N_SCORECARD_WEBHOOK_URL=
HUBSPOT_PRIVATE_APP_TOKEN=
NOTION_TOKEN=
NOTION_FUNDING_PIPELINE_DATABASE_ID=
AIRTABLE_API_KEY=
GOOGLE_SERVICE_ACCOUNT_JSON=
```

Do not commit real values.

## Recommended install order

1. Add Batch 1–3 files first.
2. Add this Batch 4–7 pack.
3. Run JSON validation.
4. Confirm public files do not expose internal/provider fields.
5. Refactor the widget and landing page to call the shared scoring engine.
6. Wire API calls only after local/static behavior is verified.

## Safe language reminder

This tool must not claim approval, guaranteed funding, qualification, underwriting outcome, or final eligibility. Use phrases like:

- funding readiness score
- potential funding path
- may be a fit
- based on your answers
- recommended next step
- subject to review
- not an approval, offer, or guarantee of funding
