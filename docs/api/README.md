# Am I Fundable API Documentation

This folder documents the public-safe API layer for the **Am I Fundable / Funding Readiness Scorecard**.

The API is designed to support:

- public scorecard experiences
- Custom GPT Actions
- broker/partner embeds
- readiness report generation
- public-safe funding path explanations
- human review request flows
- static site resource recommendations

The API is **not** a lender, underwriting engine, approval system, or credit repair service.

Every public API response must stay inside this boundary:

```txt
Funding readiness guidance
→ potential funding path category
→ document prep
→ educational resources
→ human review recommendation
```

Not:

```txt
approval
guaranteed-outcome wording
final-eligibility wording
underwriting decision
provider-specific approval prediction
private lender routing
```

## Core public routes

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

## Primary OpenAPI file

Use this file for the consolidated Custom GPT Action import:

```txt
/schemas/openapi/am-i-fundable.public-actions.openapi.yaml
```

Use the smaller action files only when creating narrower GPTs or partner-specific assistants.

## Related files

```txt
/schemas/api/
/schemas/openapi/
/examples/api/
/lib/api/
/api/
```

## Public-safe rule

Public API responses must not expose:

- provider names
- provider IDs
- affiliate URLs
- apply URLs
- commission data
- private contacts
- private notes
- routing secrets
- underwriting notes
- credentials
- real borrower PII

## Safe language

Use:

- funding readiness
- potential funding path
- may be a fit
- based on your answers
- recommended next step
- subject to review
- human review recommended
- not an approval, offer, or guarantee of funding

Avoid:

- approved
- guaranteed
- qualified
- final-eligibility wording
- underwriting-complete wording
- best rates
- instant-approval wording
