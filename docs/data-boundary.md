<!--
Am I Fundable / Funding Readiness Scorecard
Visibility: public_repo_operational_doc
Safety: public-safe; no provider names, provider IDs, affiliate/apply URLs, commissions, private contacts, routing secrets, underwriting notes, credentials, or real borrower PII.
Deployment: do not change vercel.json unless explicitly authorized.
-->
# Data Boundary

This repo has one job that matters more than looking fancy: keep public-safe readiness content public, and keep internal routing intelligence internal.

A funding scorecard that leaks provider data is not a product. It is a piñata full of compliance confetti.

## Boundary summary

| Area | Visibility | Browser-safe? | Examples |
|---|---|---:|---|
| Public pages | Public | Yes | `/scorecard.html`, `/results.html`, `/faq.html` |
| Public site data | Public | Yes | `/site-data/faq.json`, `/site-data/result-tiers.json` |
| Public config | Public/build-time | Sometimes | `/config/site.config.json`, `/config/pages/*.json` |
| Browser JS | Public | Yes | `/assets/js/*.js` |
| Public schemas/actions | Public | Yes | `/schemas/actions/*.openapi.yaml` when marked public |
| Internal registries | Internal | No | `/internal/routing/*.json`, `/internal/crm/*.json` |
| Admin actions | Internal | No | `/schemas/actions/scorecard-admin.openapi.yaml` |
| Secrets | Never committed | No | API keys, webhook secrets, CRM tokens |

## Public-safe content may include

- funding-readiness explanations
- funding-family descriptions
- public checklist items
- score tier labels
- recommended next steps
- educational FAQ answers
- public CTA labels
- demo examples
- generic audience names
- generic analytics event names

## Public content must not include

- real provider names
- provider IDs
- affiliate URLs
- apply URLs
- commission data
- payout terms
- private contacts
- private notes
- routing secrets
- underwriting notes
- credentials
- real borrower PII
- real CRM owner IDs
- private webhook URLs
- private automation IDs

## Public page rule

Any file that can be viewed in a browser must be treated as public.

That includes:

```txt
*.html
assets/js/*.js
assets/css/*.css
site-data/*.json
config/*.json when fetched by browser
examples/public demo files
```

Do not hide secrets in JavaScript comments. Browser dev tools exist. The internet has raccoons with keyboards.

## Internal registry rule

Internal files can describe how the operation should behave, but they still must use demo-safe placeholders only.

Every internal JSON file should include:

```json
{
  "visibility": "server_side_internal"
}
```

Allowed internal demo-safe values:

```json
{
  "queue": "manual_review_standard",
  "crmStage": "review_requested",
  "ownerRole": "funding_ops",
  "partnerFamily": "working_capital_family"
}
```

Not allowed:

```json
{
  "providerId": "real-provider-123",
  "applyUrl": "[forbidden-private-apply-url]",
  "commission": "8%",
  "contactEmail": "realperson@partnerdomain.example"
}
```

## Browser import rule

Browser JavaScript must not import or fetch:

```txt
/internal/**
/private/**
/server/**
/secrets/**
```

Bad:

```js
fetch("/internal/routing/lead-routing-rules.json")
```

Good:

```js
fetch("/site-data/result-tiers.json")
```

If browser code needs a public version of internal logic, create a filtered public index at build time with only safe fields.

## URL boundary

Public URLs may include safe page and embed state.

Allowed:

```txt
?source=broker-demo
?audience=contractor
?tier=review-ready
?theme=dark
```

Not allowed:

```txt
?providerId=...
?applyUrl=...
?commission=...
?crmOwner=...
?borrowerEmail=...
?underwritingNote=...
```

## Example data rule

All examples must use fake/demo values only.

Use:

```txt
Demo Founder
Demo Business LLC
demo@example.com
555-0100
```

Do not use real borrower names, real phone numbers, real emails, real bank values, or screenshots containing PII.

## Result language boundary

Public result pages may say:

```txt
Based on your answers, this profile may be a fit for one or more funding paths.
```

They must not say:

```txt
You are approved.
You qualify.
You will get funded.
This lender will approve you.
```

Final eligibility and underwriting language belongs nowhere in public output.

## CRM and automation boundary

CRM and automation registries should describe generic states:

```txt
new_scorecard_lead
review_requested
documents_needed
nurture_prep_path
strategy_review_scheduled
```

They should not include real CRM pipeline IDs, user IDs, private webhook URLs, or private contact information.

## Validation checklist

Run this before packaging or merging:

- [ ] Public files do not mention real providers.
- [ ] Public files do not include apply or affiliate URLs.
- [ ] Public files do not include commissions or payout language.
- [ ] Public files do not include borrower PII.
- [ ] Browser JS does not fetch `/internal/**`.
- [ ] Internal files are marked `server_side_internal`.
- [ ] Internal files still use demo-safe placeholder values.
- [ ] Restricted funding claims appear only in prohibited-language examples.
- [ ] No deployment settings were changed.

## Deployment boundary

`vercel.json` is not a data file. Do not edit it during content, schema, docs, or registry batches unless explicitly authorized.
