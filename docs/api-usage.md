<!--
Am I Fundable / Funding Readiness Scorecard
Visibility: public_repo_operational_doc
Safety: public-safe; no provider names, provider IDs, affiliate/apply URLs, commissions, private contacts, routing secrets, underwriting notes, credentials, or real borrower PII.
Deployment: do not change vercel.json unless explicitly authorized.
-->
# API Usage

This document describes the intended API behavior for the Funding Readiness Scorecard ecosystem. It is written for developers, Custom GPT action builders, and internal operators who need to understand request/response boundaries.

The API should support readiness education and review workflows. It must not expose internal routing secrets, provider-specific matching data, private contacts, affiliate URLs, apply URLs, commissions, or underwriting notes.

## API principles

1. Public endpoints return public-safe readiness guidance.
2. Internal endpoints are marked internal and protected by server-side auth when implemented.
3. Responses use readiness language, not final funding decisions.
4. Sample data must be fake/demo-only.
5. Browser-facing code must never call internal registries directly.

## Public-safe language

Use:

```txt
funding readiness
potential funding path
may be a fit
based on your answers
recommended next step
subject to review
human review recommended
not an approval, offer, or guarantee of funding
```

Do not use:

```txt
approved
guaranteed funding
final eligibility
underwriting decision
best rates
instant approval
credit repair outcome
```

Those words may appear in docs only when listed as prohibited examples.

## Endpoint inventory

Expected endpoint families:

| Endpoint | Method | Visibility | Purpose |
|---|---|---|---|
| `/api/scorecard-submit` | `POST` | public-safe | Accept scorecard answers and return readiness summary. |
| `/api/review-request` | `POST` | public-safe | Capture a manual review request. |
| `/api/document-checklist` | `GET` | public-safe | Return checklist by funding purpose. |
| `/api/resource-recommendation` | `POST` | public-safe | Recommend public resources by tier/persona. |
| `/api/partner-match` | `POST` | public-safe | Return funding families, not providers. |
| `/api/admin/*` | varies | internal only | Review, routing, CRM, and ops functions. |

Actual route files may differ. Keep schemas and docs aligned with the repo before release.

## Scorecard submit request

```json
{
  "source": "scorecard.html",
  "answers": {
    "businessPersona": "existing_business",
    "monthlyRevenue": 25000,
    "timeInBusinessMonths": 18,
    "creditScoreRange": "660-679",
    "bankStatus": "consistent",
    "businessStructure": "entity_bank",
    "fundingPurpose": "working_capital",
    "desiredFundingAmount": 50000,
    "redFlags": ["none"]
  },
  "lead": {
    "name": "Demo Founder",
    "email": "demo@example.com",
    "phone": "555-0100",
    "businessName": "Demo Business LLC",
    "state": "VA",
    "consent": true
  }
}
```

## Scorecard submit response

```json
{
  "status": "received",
  "readiness": {
    "score": 74,
    "tier": "review_ready",
    "tierLabel": "Review Ready",
    "summary": "Based on the provided answers, this profile may fit one or more funding paths after documentation and human review.",
    "fundingPaths": [
      "Working capital",
      "Line of credit readiness",
      "Document-prep workflow"
    ],
    "potentialBlockers": [
      "Confirm recent bank activity",
      "Verify requested amount against revenue"
    ],
    "recommendedNextSteps": [
      "Prepare recent business bank statements",
      "Review entity and contact information",
      "Request a human review"
    ],
    "disclaimer": "This is not an approval, offer, or guarantee of funding. Any potential path is subject to review."
  }
}
```

## Partner match request

```json
{
  "score": 74,
  "persona": "contractor",
  "fundingPurpose": "equipment",
  "desiredFundingAmount": 85000,
  "redFlags": ["none"]
}
```

## Partner match response

```json
{
  "matches": [
    {
      "fundingFamily": "Equipment and asset funding",
      "fit": "may_be_a_fit",
      "reason": "The requested use case is tied to equipment or vehicle acquisition.",
      "nextStep": "Prepare vendor invoice, equipment details, recent bank statements, and business structure information."
    },
    {
      "fundingFamily": "Working capital",
      "fit": "review_recommended",
      "reason": "Revenue and bank activity may support a secondary working capital review.",
      "nextStep": "Compare desired amount against recent revenue before submitting."
    }
  ],
  "disclaimer": "Matches are educational funding-family suggestions, not provider recommendations or funding offers."
}
```

## Document checklist request

```http
GET /api/document-checklist?purpose=working_capital&persona=existing_business
```

## Document checklist response

```json
{
  "purpose": "working_capital",
  "items": [
    "Last 3-6 months of business bank statements",
    "Business entity details and EIN confirmation, if available",
    "Owner identification details",
    "Basic revenue summary",
    "Use-of-funds explanation"
  ],
  "notes": [
    "Additional documents may be requested during review.",
    "This checklist does not guarantee funding."
  ]
}
```

## Error format

Use a consistent public-safe error shape:

```json
{
  "error": {
    "code": "missing_required_field",
    "message": "Please complete the required readiness fields before submitting.",
    "safeNextStep": "Return to the scorecard and review the highlighted questions."
  }
}
```

Do not return stack traces, internal file paths, provider names, CRM details, or private notes in public API errors.

## Auth expectations

| Endpoint type | Auth |
|---|---|
| Public scorecard and content endpoints | No auth or light public key, depending on deployment. |
| Partner embed endpoints | Public-safe token or source validation if needed. |
| Admin/review endpoints | Server-side auth required. |
| CRM/webhook endpoints | Secret or signature validation required. |

Never place secrets in static files.

## Local checks

Basic schema linting after Batch 22:

```bash
node --check scripts/validate-site-data.js
node --check scripts/validate-public-boundary.js
```

If using YAML validation locally:

```bash
python - <<'PY'
import yaml, pathlib
for path in pathlib.Path("schemas/actions").glob("*.yaml"):
    yaml.safe_load(path.read_text())
    print("ok", path)
PY
```

## Release guardrails

Before exposing API docs publicly:

- [ ] Public responses contain no provider-specific fields.
- [ ] Admin/internal schema is marked not public.
- [ ] Demo emails use `example.com`.
- [ ] No real borrower data exists in examples.
- [ ] No apply URLs or affiliate links are included.
- [ ] Disclaimers are present on readiness results.
- [ ] `vercel.json` is unchanged unless explicitly authorized.
