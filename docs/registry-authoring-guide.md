<!--
Am I Fundable / Funding Readiness Scorecard
Visibility: public_repo_operational_doc
Safety: public-safe; no provider names, provider IDs, affiliate/apply URLs, commissions, private contacts, routing secrets, underwriting notes, credentials, or real borrower PII.
Deployment: do not change vercel.json unless explicitly authorized.
-->
# Registry Authoring Guide

This guide explains how to create and maintain JSON registries for the Funding Readiness Scorecard repo.

Registries are how this product avoids becoming a haunted junk drawer of hardcoded decisions.

## Registry principles

1. Every entry needs a stable ID.
2. Public registries must be browser-safe.
3. Internal registries must be marked internal.
4. Use predictable naming.
5. Avoid clever nested structures unless they solve a real problem.
6. Prefer readable data over abstraction theater.
7. Validate JSON before packaging.

## File naming

Use kebab-case:

```txt
result-tiers.json
funding-paths.json
document-checklists.json
lead-routing-rules.json
service-offers.registry.json
```

Use `.registry.json` when a file is a collection of reusable operating entries.

## Public registry envelope

Public registries should include:

```json
{
  "id": "resource-library",
  "version": "1.0.0",
  "visibility": "public_runtime_browser_safe",
  "description": "Public-safe resources for the Funding Readiness Scorecard.",
  "items": []
}
```

## Internal registry envelope

Internal registries should include:

```json
{
  "id": "lead-routing-rules",
  "version": "1.0.0",
  "visibility": "server_side_internal",
  "description": "Internal-only demo routing rules for manual review and nurture queues.",
  "items": []
}
```

Internal does not mean “safe to commit secrets.” Never commit secrets.

## Stable IDs

Good IDs:

```txt
review_ready
prep_first
working_capital
document_checklist_working_capital
cta_scorecard_primary
analytics_scorecard_started
```

Bad IDs:

```txt
item1
new thing
ProviderA
hot-leads!!! 
```

## Public registry allowed fields

Public-safe fields may include:

- `id`
- `label`
- `title`
- `description`
- `summary`
- `path`
- `ctaId`
- `audience`
- `tier`
- `fundingFamily`
- `documentItems`
- `safeNextStep`
- `disclaimer`
- `sortOrder`
- `tags`

## Public registry forbidden fields

Do not include:

- `providerName`
- `providerId`
- `lenderId`
- `affiliateUrl`
- `applyUrl`
- `commission`
- `payout`
- `privateContact`
- `routingSecret`
- `underwritingNote`
- `apiKey`
- `crmOwnerId`
- `borrowerSsn`
- `bankAccountNumber`

## Entry example

```json
{
  "id": "working_capital",
  "label": "Working Capital",
  "summary": "May be relevant for short-cycle cash needs such as payroll, materials, inventory, or operating expenses.",
  "safeNextStep": "Prepare recent business bank statements and a clear use-of-funds summary.",
  "disclaimer": "This is a funding-family description, not an approval or funding offer."
}
```

## CTA registry example

```json
{
  "id": "request_human_review",
  "label": "Request a Human Review",
  "destination": "/fundable-review.html",
  "visibility": "public_runtime_browser_safe",
  "safeContext": "Use when a result needs manual review before discussing next steps."
}
```

## Internal routing example

```json
{
  "id": "route_review_ready_working_capital",
  "visibility": "server_side_internal",
  "conditions": {
    "tier": "review_ready",
    "fundingPurpose": "working_capital",
    "redFlagSeverity": "low"
  },
  "action": {
    "queue": "manual_review_standard",
    "crmStage": "review_requested",
    "taskTemplate": "request_bank_statements"
  }
}
```

No provider or payout details. Keep that chaos behind actual server-side systems, not repo data.

## Validation

Run JSON validation:

```bash
python -m json.tool site-data/result-tiers.json > /dev/null
```

Validate all JSON:

```bash
find . -name "*.json" -not -path "./node_modules/*" -print0 | xargs -0 -n1 python -m json.tool > /dev/null
```

PowerShell:

```powershell
Get-ChildItem -Recurse -Filter *.json | Where-Object { $_.FullName -notmatch "node_modules" } | ForEach-Object {
  python -m json.tool $_.FullName > $null
}
```

## Schema alignment

When schemas exist:

- Public page registries should align to `/schemas/site-page.schema.json`.
- Navigation should align to `/schemas/navigation.schema.json`.
- CTAs should align to `/schemas/cta.schema.json`.
- FAQs should align to `/schemas/faq.schema.json`.
- Internal routing should align to `/schemas/lead-routing-rule.schema.json`.

Do not make schemas so strict that useful content becomes a paperwork hostage.

## Versioning

Use semantic-ish versions:

```json
{
  "version": "1.0.0"
}
```

Increment:

- patch for typo/copy-safe fixes
- minor for added entries or optional fields
- major for breaking structure changes

## Review checklist

Before committing a registry:

- [ ] JSON parses.
- [ ] Has `id`.
- [ ] Has `version`.
- [ ] Has `visibility`.
- [ ] Public registry contains no private fields.
- [ ] Internal registry uses demo-safe values.
- [ ] Entries have stable IDs.
- [ ] Copy uses safe readiness language.
- [ ] No `vercel.json` changes are bundled.
