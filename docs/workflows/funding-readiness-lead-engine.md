# Canonical Funding Readiness Lead Engine

## Status

Canonical cross-repository workflow specification for **Funding Readiness + Route Match**.

Owner contract: `JFeimster/am-i-fundable/schemas/funding-readiness-lead.schema.json`

This workflow is a readiness, education, intake, attribution, and human-review system. It is not a lender, approval engine, underwriting decision, offer generator, or guarantee of funding.

## Canonical workflow

```text
FundStack AI / Moonshine Capital / vertical funnels / Wix content / partner campaigns / partner widgets / GPT Actions
  -> Am I Fundable intake and scoring
  -> public-safe readiness result
  -> public-safe funding-family recommendations
  -> document preparation checklist
  -> human review when indicated
  -> validated partner attribution
  -> Partner Command Center orchestration
  -> CRM / Notion / Google Sheets persistence
  -> partner or operator dashboard status
  -> GPT/action follow-up
```

## Repository ownership

| Capability | Owner repo/system | Responsibility |
|---|---|---|
| Canonical contract and public projection | `JFeimster/am-i-fundable` | Own the JSON Schema, scorecard answer normalization, readiness score, tier, generic funding-family output, strengths, risks, checklist, next steps, and manual-review recommendation. |
| Public assessment surface | `JFeimster/am-i-fundable` | Collect answers and consent, calculate the readiness result, generate `lead_id`, and return only the public-safe projection. |
| Traffic acquisition and CTA routing | `JFeimster/FundStack-AI`, Moonshine/Wix pages, vertical-funnel repos | Send users to Am I Fundable while preserving source and attribution query parameters. FundStack must not maintain a competing score model. |
| Partner attribution, trusted lead ingestion, persistence, events, and dashboard handoff | `JFeimster/partner-command-center` | Validate `partner_id` and `tracking_link_id`, accept the canonical contract through a protected adapter, persist records, emit events, and expose partner/operator-safe status. |
| Partner signup and partner classification | `JFeimster/partner-intake-os` | Create and classify partner records only. It must not accept borrower/funding lead submissions. |
| Widget distribution | `JFeimster/Embed-Widgets` | Capture attribution, embed or redirect to Am I Fundable, and submit the canonical intake shape through a configured endpoint. It must not use its current independent score logic as canonical. |
| Partner/Tracking Link/Partner Event records | Notion through Partner Command Center | Validate partner identity, validate link ownership, and record safe lifecycle events. |
| Backup/operational reporting | Google Sheets through Partner Command Center | Store a flattened operational projection, not sensitive documents or server secrets. |
| CRM destination | Configured CRM adapter | Store contact, status, source, readiness summary, assigned owner, and follow-up tasks. |

## Canonical contract

The canonical object is defined by:

```text
schemas/funding-readiness-lead.schema.json
```

The contract uses `snake_case`. Existing camelCase and flat payloads remain supported only through adapters.

### Required object groups

- Identity: `lead_id`, `created_at`, `updated_at`, `review_status`.
- Applicant: contact and business identity.
- Assessment: `answers`, `score_result`, `lead_priority`.
- Public guidance: funding families, strengths, risks, documents, next steps, manual-review flag.
- Attribution: partner, tracking link, campaign, widget, source asset, source URL, and UTM values.
- Compliance: versioned consent evidence.
- Optional server extension: `internal_context`.

## Existing routes to reuse

### Am I Fundable

| Route | Reuse decision | Canonical role |
|---|---|---|
| `POST /api/leads/create-lead` | Reuse as an adapter after replacing demo-only persistence behavior. | Normalize applicant/answers, calculate the score, generate `lead_id`, and construct the canonical object. |
| `POST /api/leads/route-lead` | Reuse for public queue and next-action projection. | Translate canonical score and review flags into public-safe workflow status. |
| `POST /api/scorecard/request-review` | Reuse as the browser/GPT review-request front door. | Require consent, recompute server-side, create canonical lead, and forward it to the trusted persistence route. |
| `POST /api/scorecard/generate-readiness-report` | Reuse for optional report output. | Render the canonical public projection; do not become a second source of scoring truth. |
| `POST /api/match/funding-paths` | Reuse. | Return generic funding-family categories only. |
| `GET /api/public/document-checklist` | Reuse. | Build public preparation guidance from the canonical funding-family and purpose. |
| `POST /api/webhooks/lead-routed` | Reuse as a compatibility event receiver. | Accept sanitized route events and map them to the canonical event envelope. |

These routes exist in source. As of July 10, 2026, the production `/api/health` URL returned `404`; therefore route activation must be verified before any channel is switched to them.

### Partner Command Center

| Route | Reuse decision | Canonical role |
|---|---|---|
| `POST /api/lead-router` | Reuse as a legacy partner-lead adapter. | Accept the existing flat partner payload or a canonical lead, validate partner identity, map to canonical fields, route, and log a Partner Event. |
| `POST /api/partner-links` | Reuse. | Create and validate tracking-link records used by the canonical attribution fields. |
| `POST /api/partner-signup` | Do not reuse for funding leads. | Partner signup only. |
| `POST /api/router` | Do not reuse for funding leads. | Tally/default partner signup only. |

## Routes to create

### Partner Command Center

```text
POST /api/funding-readiness/leads
GET  /api/funding-readiness/leads/:lead_id/status
PATCH /api/funding-readiness/leads/:lead_id/review-status
```

`POST /api/funding-readiness/leads` is the canonical trusted ingestion route. It must:

1. Require API-key, bearer-token, signed-widget-token, or trusted server authentication.
2. Validate the canonical schema.
3. Recompute or verify the Am I Fundable result from `answers`; never trust a client-supplied score by itself.
4. Validate `partner_id` against the Partners database when present.
5. Validate that `tracking_link_id` belongs to the resolved partner when present.
6. Preserve direct traffic by allowing all partner fields to be null.
7. Write an idempotent lead record and safe event records.
8. Return only a partner/operator-safe receipt and status projection.

The status route is authenticated and must not expose raw applicant answers, provider matches, internal notes, or documents to a partner unless explicitly authorized.

### Am I Fundable

No new public scoring route is required if `POST /api/scorecard/request-review` is upgraded to create and forward the canonical contract. A compatibility alias may be added later:

```text
POST /api/funding-readiness/request-review
```

The alias must use the same implementation, not fork the logic.

## Public-safe projection

The browser, public GPT Action, applicant-facing email, and public result page may receive:

- `lead_id`.
- Score and readiness tier.
- Generic primary and secondary funding-family labels and summaries.
- Strengths and risks written as readiness observations.
- Recommended document labels and preparation guidance.
- Recommended next steps.
- `manual_review_recommended`.
- A safe review status such as `queued_for_review` or `awaiting_documents`.
- Generic disclaimer language.

Public outputs must not state or imply approval, qualification, an offer, certainty, specific rates, specific amounts available, guaranteed timing, or lender acceptance.

## Server-side fields and logic

The following remain server-side or tightly permissioned:

- Applicant email, phone, and raw assessment answers after submission.
- Consent evidence and contact permissions.
- Raw attribution hints before validation.
- Partner and tracking-link validation results.
- IP address, user agent, anti-spam, fraud, and rate-limit signals.
- CRM, Notion, Sheets, and event-log record IDs.
- Internal review notes, task assignments, and operator comments.
- Provider/product rules, provider identities, apply URLs, private contacts, commissions, economics, and affiliate links.
- Provider-specific matches and underwriting-style logic.
- Authentication secrets, webhook signatures, database IDs, and environment variables.
- Uploaded documents and document contents.

The canonical public record may name a generic funding family. Provider-level routing belongs in `internal_context` or a separate protected object and must never be returned by public APIs.

## Attribution persistence

### Entry capture

Every public source should forward these query parameters when present:

```text
partner_id
tracking_link_id
campaign_id
widget_id
utm_source
utm_medium
utm_campaign
utm_term
utm_content
```

The entry surface stores a first-touch and latest-touch attribution envelope under a versioned first-party key such as:

```text
funding_readiness.attribution.v1
```

Recommended client retention is 30 days. Client storage is an attribution hint, not proof.

### Server validation

On lead creation:

1. Copy inbound values into protected raw attribution hints.
2. Resolve `tracking_link_id` first when present.
3. Confirm the linked Partner record and canonical `partner_id`.
4. If only `partner_id` is present, validate it directly.
5. Reject mismatched partner/link combinations from canonical fields while retaining a protected audit hint.
6. Set canonical partner fields only after validation.
7. Keep UTM, campaign, widget, source URL, and source asset even when no partner resolves.

First-touch values support crediting the acquisition source. Latest-touch values support conversion analysis. The required top-level fields contain the resolved conversion attribution; deeper touch history may remain in server-side event metadata.

## Direct traffic behavior

For direct Moonshine, Wix, FundStack, SEO, or untagged traffic:

- `partner_id`, `tracking_link_id`, `campaign_id`, and `widget_id` may be null.
- `source_asset` and `source_url` are still required.
- UTM fields may be null.
- The assessment, lead creation, review, persistence, and follow-up workflow remains identical.
- The lead is assigned to the Moonshine/JF Ventures operator queue rather than a partner queue.

Direct traffic must not be forced through a fake `ORGANIC` partner record.

## Partner traffic behavior

For validated partner traffic:

- The partner or tracking link is captured before assessment.
- Attribution persists through the lead gate, review request, canonical ingestion, event records, CRM/Notion/Sheets projection, dashboard status, and follow-up.
- Partner dashboards receive only the lead ID, business-safe display fields where allowed, status, timestamps, safe next action, and attribution summary.
- Partner traffic does not bypass consent, scoring validation, human review, or public-safe language.
- A partner may refer a lead; the partner may not create or alter the readiness score.

## Storage projections

The canonical JSON object is the source contract. Each destination receives a projection.

### Notion

Partner Command Center should add a dedicated funding-lead database or an equivalent lead record store. Partner Events alone are not sufficient as the lead system of record.

Minimum lead properties:

```text
Lead ID
Business Name
Contact Name
Email
Phone
State
Score
Tier
Lead Priority
Primary Funding Family
Manual Review Recommended
Review Status
Partner ID
Tracking Link ID
Campaign ID
Widget ID
Source Asset
Source URL
UTM Source
UTM Medium
UTM Campaign
Created At
Updated At
```

Partner Events should record lifecycle changes using safe summaries and the same `lead_id`.

### Google Sheets

Use one row per lead plus an append-only event tab. Flatten arrays as stable IDs or JSON strings. Do not store documents, secrets, provider economics, or raw internal notes in the backup sheet.

### CRM

Create or update the contact/company, attach `lead_id`, score tier, generic funding family, review status, source, validated partner attribution, and next operator task. Deduplicate using `lead_id`; email may be a secondary match key.

## Widget requirements

`JFeimster/Embed-Widgets` currently contains independent lead capture, Supabase insertion, a generic webhook, and a `ref`/localStorage affiliate ID. That implementation must become an adapter.

Required widget behavior:

- Prefer canonical parameter names: `partner_id`, `tracking_link_id`, `campaign_id`, `widget_id`, and UTM fields.
- Preserve `ref` only as a legacy alias to `partner_id`.
- Do not use the widget's own two-variable score as the final readiness score.
- Submit answers to Am I Fundable or embed the canonical Am I Fundable surface.
- Do not expose trusted Partner Command Center API keys in browser code.
- Replace approval-style copy with readiness and review language.

## FundStack and funnel requirements

FundStack AI currently contains a separate fundability-score tool and local score formula. FundStack is an acquisition and routing layer, not a scoring owner.

Required behavior:

- Route the canonical fundability CTA to Am I Fundable.
- Pass source and attribution parameters.
- Keep existing tool pages as redirects, wrappers, or educational variants rather than competing score engines.
- Replace generic `#apply` defaults with explicit readiness or review destinations per page.

## GPT Actions contract

Public and internal GPT Actions use the same canonical fields and naming.

### Public Funding Readiness Helper

- Calls the Am I Fundable review-request adapter.
- Sends applicant, answers, attribution, consent, source URL, and source asset.
- Receives the public-safe projection only.
- May explain the score, generic funding families, checklist, and next steps.
- Must not receive provider-specific matches, apply links, commissions, or internal notes.

### Internal Broker/Operator Action

- Calls the protected Partner Command Center canonical ingestion/status routes.
- Uses API-key or bearer authentication stored in the GPT Action configuration.
- May update review status and create operator follow-up tasks.
- Must still keep provider matches and sensitive notes behind explicit internal authorization.

### Partner Signup GPT

- Continues to call `POST /api/partner-signup`.
- It does not submit funding-readiness leads.

## Compatibility mapping

| Existing field | Canonical field |
|---|---|
| `leadId` or `id` | `lead_id` |
| `firstName` | `applicant.first_name` |
| `lastName` | `applicant.last_name` |
| `businessName` or `business_name` | `applicant.business_name` |
| `monthlyRevenue` or `monthly_revenue` | `answers.monthly_revenue` |
| `timeInBusinessMonths` | `answers.time_in_business_months` |
| `creditScore` or `fico_score` | `answers.credit_score` |
| `fundingPurpose` or `use_of_funds` | `answers.funding_purpose` through an explicit value map |
| `desiredFundingAmount` or `funding_need` | `answers.desired_funding_amount` |
| `leadPriority` | `lead_priority` |
| `primaryFundingFamily` | `primary_funding_family` |
| `secondaryFundingFamilies` | `secondary_funding_families` |
| `manualReviewRecommended` | `manual_review_recommended` |
| `affiliateId` or `ref` | unvalidated hint for `partner_id` |
| `sourceWidget` | `widget_id` and `source_asset` |
| `submittedAt` | `created_at` |

Adapters must use explicit enum maps. They must not silently pass unknown values into the score engine.

## Acceptance criteria

- One schema validates direct and partner-attributed leads.
- Am I Fundable remains the only readiness score owner.
- Partner Command Center validates attribution and owns persistence orchestration.
- Partner signup remains separate from funding lead submission.
- Public responses contain no provider-specific or underwriting data.
- Direct traffic works with null partner fields.
- Partner traffic preserves validated attribution through every event and storage projection.
- GPT Actions use the same contract instead of inventing a fourth payload.
- All writes are idempotent by `lead_id` plus an optional idempotency key.
- Production routes are tested before traffic is switched.
