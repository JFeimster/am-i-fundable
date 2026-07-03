# No-Auth Public Actions

This document lists routes safe for no-auth Custom GPT Actions and public integrations.

## Why no-auth is acceptable here

No-auth is acceptable only because public routes are constrained to:

- readiness guidance
- public category explanations
- document preparation
- educational resources
- human review recommendations
- safe acknowledgements

Public routes must be safe even when called by anonymous users.

## Recommended public action file

```txt
/schemas/openapi/am-i-fundable.public-actions.openapi.yaml
```

## Safe public operations

```txt
getHealth
getApiVersion
listPublicFundingPaths
getDocumentChecklist
getResultTier
recommendResources
requestFundingReview
generateReadinessReport
matchFundingPaths
```

## Safe public routes

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

## Optional public routes for future actions

```txt
GET  /api/public/site-data
GET  /api/public/embed-config
POST /api/scorecard/start-session
POST /api/scorecard/submit-score
GET  /api/scorecard/get-result
POST /api/match/partner-fit
POST /api/match/manual-review
```

## Do not include

Do not include:

```txt
/api/admin/*
```

Do not include routes that expose:

- private provider routing
- apply links
- partner economics
- private contacts
- private notes
- credentials
