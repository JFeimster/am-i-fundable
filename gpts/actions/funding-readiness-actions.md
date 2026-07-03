# Funding Readiness Actions Setup Guide

## Purpose

This guide explains which OpenAPI action schemas belong with each Am I Fundable / Funding Readiness Scorecard GPT package.

Use this as a human-readable setup checklist when creating Custom GPT actions. It does not contain secrets, credentials, provider data, affiliate URLs, apply URLs, commissions, or real borrower PII.

## Safety rule

Public GPTs must use only public-safe actions. Internal/admin actions must only be used in controlled internal GPTs with appropriate access controls.

Do not attach admin/internal actions to public applicant-facing GPTs. That is how a helpful assistant becomes a data-leaking raccoon with API keys.

## Available action schema files

### Public-safe actions

| Schema file | Purpose | Recommended GPTs |
|---|---|---|
| `/schemas/actions/scorecard-submit.openapi.yaml` | Submit normalized scorecard answers and lead consent for review. | Funding Readiness Helper, Broker Scorecard Copilot |
| `/schemas/actions/review-request.openapi.yaml` | Request human review for incomplete, borderline, complex, or red-flagged files. | Funding Readiness Helper, Broker Scorecard Copilot, Document Prep Coach |
| `/schemas/actions/resource-recommendation.openapi.yaml` | Recommend public-safe resources by result tier, audience, or funding purpose. | Funding Readiness Helper, Document Prep Coach |
| `/schemas/actions/document-checklist.openapi.yaml` | Return document checklist by funding purpose and readiness context. | Funding Readiness Helper, Document Prep Coach, Broker Scorecard Copilot |
| `/schemas/actions/public-site.openapi.yaml` | Retrieve public-safe site content, FAQs, resources, or funding path summaries. | Funding Readiness Helper, Partner Embed Assistant |

### Public-safe but partner/broker-oriented

| Schema file | Purpose | Recommended GPTs |
|---|---|---|
| `/schemas/actions/partner-match.openapi.yaml` | Return public-safe funding path category matches without provider exposure. | Broker Scorecard Copilot, Funding Path Explainer, Partner Embed Assistant |

### Internal/admin only

| Schema file | Purpose | Recommended GPTs |
|---|---|---|
| `/schemas/actions/scorecard-admin.openapi.yaml` | Internal/admin future workflows for review queues, routing oversight, and ops. | Private internal Review Queue Assistant only |

`/schemas/actions/scorecard-admin.openapi.yaml` must be treated as `server_side_internal_not_public`. Do not attach it to public GPTs.

## GPT-to-action map

### Funding Readiness Helper

Recommended actions:

- `/schemas/actions/scorecard-submit.openapi.yaml`
- `/schemas/actions/review-request.openapi.yaml`
- `/schemas/actions/resource-recommendation.openapi.yaml`
- `/schemas/actions/document-checklist.openapi.yaml`
- `/schemas/actions/public-site.openapi.yaml`

Do not attach:

- `/schemas/actions/scorecard-admin.openapi.yaml`

### Broker Scorecard Copilot

Recommended actions:

- `/schemas/actions/scorecard-submit.openapi.yaml`
- `/schemas/actions/partner-match.openapi.yaml`
- `/schemas/actions/review-request.openapi.yaml`
- `/schemas/actions/document-checklist.openapi.yaml`
- `/schemas/actions/resource-recommendation.openapi.yaml`

Optional, private/internal only:

- `/schemas/actions/scorecard-admin.openapi.yaml`

### Document Prep Coach

Recommended actions:

- `/schemas/actions/document-checklist.openapi.yaml`
- `/schemas/actions/resource-recommendation.openapi.yaml`
- `/schemas/actions/review-request.openapi.yaml`

Do not attach:

- `/schemas/actions/scorecard-admin.openapi.yaml`

### Partner Embed Assistant

Recommended actions:

- `/schemas/actions/public-site.openapi.yaml`
- `/schemas/actions/partner-match.openapi.yaml`

Do not attach:

- `/schemas/actions/scorecard-admin.openapi.yaml`
- Any action that returns internal routing, provider, commission, contact, or apply-link data

## Authentication guidance

Follow the auth type declared in each OpenAPI schema.

General rules:

- Public content retrieval actions should not require private secrets.
- Scorecard submission and review request actions may require an API key or server-side gateway depending on deployment.
- Internal/admin actions must require protected authentication and should never be exposed to public GPT users.
- Never paste production secrets into GPT instructions.
- Use environment variables or connector-managed auth where available.

## Safe action behavior

Actions should return:

- Readiness tier
- Public-safe summary
- Potential funding path categories
- Recommended documents
- Recommended next steps
- Human review recommendation
- Public-safe resource links or route paths

Actions should not return:

- Provider names
- Provider IDs
- Affiliate URLs
- Apply URLs
- Commission data
- Private contacts
- Private notes
- Routing secrets
- Underwriting notes
- Credentials
- Borrower PII beyond what the user submitted and consented to share

## Testing checklist

Before enabling an action in a GPT:

```text
[ ] OpenAPI file imports without schema errors.
[ ] Server URL points to the correct environment.
[ ] Auth type is correct.
[ ] Example request works with demo data.
[ ] Example response avoids approval/guarantee language.
[ ] No provider-specific/private fields are returned.
[ ] Error response is helpful and public-safe.
[ ] GPT instructions tell the assistant not to overstate action results.
[ ] Admin/internal actions are not attached to public GPTs.
```

## Safe result interpretation after action calls

When an action returns a score or recommendation, the GPT should say:

```text
Based on the scorecard response, your readiness signal suggests [tier/path].
This is not an approval, offer, underwriting decision, or guarantee of funding.
The recommended next step is [document prep / human review / prep-first path].
```

Do not say:

```text
You are approved.
You qualify.
This lender will fund you.
You are guaranteed funding.
You are finally eligible.
This is the best rate.
```

## Example Custom GPT action setup flow

1. Create or edit the GPT.
2. Paste the GPT instructions from the selected `.gpt.md` file.
3. Upload the recommended knowledge files.
4. Add only the action schema files listed for that GPT.
5. Configure auth using safe environment settings.
6. Test with demo data.
7. Confirm the GPT response uses readiness language.
8. Confirm no internal data appears in responses.
9. Publish only after safety review.

## Human review reminder

Action output is not a substitute for human review when the file is incomplete, borderline, complex, red-flagged, or provider-specific direction is requested.
