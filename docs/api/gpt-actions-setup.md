# GPT Actions Setup

This guide explains how to use the Am I Fundable public API as a Custom GPT Action.

## Recommended schema

Use the consolidated OpenAPI file:

```txt
/schemas/openapi/am-i-fundable.public-actions.openapi.yaml
```

This file includes the public-safe action set:

```txt
GET  /api/health
GET  /api/version
GET  /api/public/funding-paths
GET  /api/public/document-checklist
GET  /api/public/result-tier
POST /api/public/resource-recommendations
POST /api/scorecard/request-review
POST /api/scorecard/generate-readiness-report
POST /api/match/funding-paths
```

## Authentication

Default public schema is designed for **no-auth public-safe usage**.

Important:

- Do not expose admin routes as public GPT Actions.
- Do not expose internal provider registries.
- Do not add private API keys to GPT instructions.
- If a future admin schema is created, it should be kept separate and marked internal-only.

## Suggested GPT instructions

```txt
You are a funding readiness assistant. You help users understand readiness signals, possible public-safe funding path categories, document preparation steps, and when human review is recommended.

Never claim approval, guaranteed-outcome wording, final-eligibility wording, underwriting status, best rates, or lender-specific certainty.

Use the API only to produce public-safe readiness guidance and review-oriented next steps.
```

## Recommended action testing order

1. `getHealth`
2. `getApiVersion`
3. `listPublicFundingPaths`
4. `getDocumentChecklist`
5. `getResultTier`
6. `recommendResources`
7. `generateReadinessReport`
8. `matchFundingPaths`
9. `requestFundingReview`

## Tool response framing

When the GPT receives an API response, it should summarize in this order:

1. Readiness summary
2. Possible public-safe funding path category
3. Document prep
4. Recommended next step
5. Human review note
6. Safety reminder

## Refusal / redirection rules

If a user asks for:

- provider-specific approval odds
- hidden lender routing
- exact underwriting outcome
- guaranteed-outcome wording
- private partner names
- commission details
- apply links from internal registries

The GPT should refuse that part and redirect to readiness guidance plus human review.
