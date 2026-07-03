# Public API Routes

This document summarizes the public-safe API routes for the Am I Fundable scorecard.

## Route inventory

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/api/health` | Basic health check. |
| `GET` | `/api/version` | API version and route inventory. |
| `GET` | `/api/public/funding-paths` | List public-safe funding path categories. |
| `GET` | `/api/public/document-checklist` | Return document checklist by funding family or purpose. |
| `GET` | `/api/public/result-tier` | Explain readiness tier by score or tier ID. |
| `POST` | `/api/public/resource-recommendations` | Recommend educational resources by tier/purpose/result. |
| `POST` | `/api/scorecard/request-review` | Validate applicant consent and queue a human review request. |
| `POST` | `/api/scorecard/generate-readiness-report` | Generate a structured and Markdown readiness report. |
| `POST` | `/api/match/funding-paths` | Return public-safe funding path category recommendations. |

## `GET /api/health`

Use for uptime checks and basic deployment sanity.

Expected response:

```json
{
  "ok": true,
  "service": "funding-readiness-scorecard",
  "status": "healthy",
  "apiVersion": "1.0.0",
  "environment": "production",
  "timestamp": "2026-07-03T15:32:11.000Z"
}
```

## `GET /api/version`

Use for public route discovery and API contract metadata.

Expected use cases:

- GPT Action debugging
- smoke tests
- integration documentation
- confirming deployed API contract

## `GET /api/public/funding-paths`

Returns public-safe funding path categories.

Optional query parameters:

| Parameter | Type | Purpose |
|---|---|---|
| `familyId` | string | Filter by public funding family ID. |
| `search` | string | Search labels, summaries, and best-fit notes. |
| `limit` | integer | Limit returned entries. |

This route must never return provider names, provider IDs, apply URLs, affiliate URLs, commissions, private contacts, or internal routing details.

## `GET /api/public/document-checklist`

Returns a preparation checklist by public funding family or funding purpose.

Optional query parameters:

| Parameter | Type | Purpose |
|---|---|---|
| `familyId` | string | Public funding family ID. |
| `fundingPurpose` | string | Scorecard funding purpose. |

Example:

```txt
/api/public/document-checklist?fundingPurpose=working_capital
```

## `GET /api/public/result-tier`

Returns public-safe explanation for a readiness score or tier ID.

Optional query parameters:

| Parameter | Type | Purpose |
|---|---|---|
| `score` | number | Resolve a tier from score. |
| `tierId` | string | Return explicit tier details. |

Example:

```txt
/api/public/result-tier?score=74
```

## `POST /api/public/resource-recommendations`

Returns educational resources based on tier, funding purpose, or result object.

Use this route after scoring to recommend:

- document prep checklist
- funding strategy review guide
- readiness improvement plan
- purpose-specific prep notes

## `POST /api/scorecard/request-review`

Queues a review request after validating:

- applicant contact data
- contact consent
- scorecard answer shape
- public-safe readiness result

This route should return a review ID and next step, not a provider-specific match.

## `POST /api/scorecard/generate-readiness-report`

Generates a structured report with:

- score summary
- tier
- strengths
- caution areas
- document checklist
- next steps
- Markdown report

The report is educational and review-oriented only.

## `POST /api/match/funding-paths`

Runs server-side matching and returns only public-safe funding path categories.

This route may use internal registries server-side, but the response must not expose internal details.
