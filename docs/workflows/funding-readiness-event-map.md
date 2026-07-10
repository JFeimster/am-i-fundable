# Funding Readiness Event Map

## Purpose

This event map defines the lifecycle for the canonical Funding Readiness Lead Engine. Events use the same `lead_id` and schema version across Am I Fundable, Partner Command Center, storage adapters, dashboards, and GPT Actions.

Events are operational facts, not underwriting decisions.

## Event envelope

Every durable event should use this envelope:

```json
{
  "event_id": "evt_...",
  "event_type": "funding_readiness.lead.created",
  "schema_version": "1.0.0",
  "lead_id": "lead_...",
  "correlation_id": "corr_...",
  "occurred_at": "2026-07-10T15:30:00Z",
  "producer": "am_i_fundable",
  "partner_id": null,
  "tracking_link_id": null,
  "campaign_id": null,
  "widget_id": null,
  "public_payload": {},
  "internal_payload": {}
}
```

Rules:

- `public_payload` may contain only the public-safe projection.
- `internal_payload` is never returned to browser clients or public GPT Actions.
- Consumers must be idempotent by `event_id`.
- A retry may deliver the same event more than once.
- `lead_id` is the cross-system join key.
- Validated attribution is copied to later events; raw hints remain protected.

## Lifecycle events

| Sequence | Event type | Producer | Primary consumer | Required data | Action |
|---:|---|---|---|---|---|
| 1 | `funding_readiness.session.started` | Am I Fundable or widget adapter | Analytics/event log | source asset, source URL, attribution hints, timestamp | Start a scorecard session without creating a lead. |
| 2 | `funding_readiness.answers.completed` | Am I Fundable | Score engine | normalized answers, correlation ID | Validate and normalize the nine canonical answer fields. |
| 3 | `funding_readiness.score.calculated` | Am I Fundable | Public result presenter, lead constructor | score result, funding families, risks, strengths, checklist, next steps, manual-review flag | Produce the canonical public-safe readiness result. |
| 4 | `funding_readiness.lead.created` | Am I Fundable review-request adapter | Partner Command Center canonical ingestion | canonical lead object, consent, source, attribution hints | Create `lead_id` and submit the canonical record for validation/persistence. |
| 5 | `funding_readiness.attribution.resolved` | Partner Command Center | Lead store, Partner Events, analytics | validated partner/link/campaign/widget IDs, attribution status | Resolve direct or partner attribution. |
| 6 | `funding_readiness.lead.persisted` | Partner Command Center | CRM, Notion, Sheets, dashboard | destination receipts, review status, safe summary | Confirm idempotent lead storage. |
| 7 | `funding_readiness.review.requested` | Am I Fundable or operator/GPT | Operator queue | lead ID, review reason, priority, required documents | Queue human review when requested or recommended. |
| 8 | `funding_readiness.documents.requested` | Partner Command Center or operator | Applicant follow-up, CRM task | public document checklist, due-state, owner | Send or queue preparation guidance; do not attach documents to the event. |
| 9 | `funding_readiness.review.status_changed` | Operator, internal GPT, or Partner Command Center | Lead store, dashboard, CRM | previous status, new status, actor type, timestamp | Update lifecycle status without implying approval or decline. |
| 10 | `funding_readiness.dashboard.synced` | Partner Command Center | Partner/operator dashboard | safe status projection, sync receipt | Make the latest permitted status visible. |
| 11 | `funding_readiness.follow_up.queued` | Partner Command Center or CRM adapter | Email/SMS/GPT task queue | template ID, channel, next action, owner | Queue the next consent-compliant follow-up. |
| 12 | `funding_readiness.lead.closed` | Operator or Partner Command Center | CRM, Notion, Sheets, analytics | closure reason category, final safe status | Close the workflow. Do not encode lender decisions in partner-facing payloads. |

## Existing event and route adapters

| Existing source | Existing event/behavior | Canonical mapping |
|---|---|---|
| Am I Fundable `POST /api/webhooks/lead-routed` | Accepts a sanitized `lead.routed` event. | Map to `funding_readiness.review.status_changed` or `funding_readiness.follow_up.queued` based on `routeType`. |
| Am I Fundable `POST /api/leads/create-lead` | Returns `lead_created_demo`. | After persistence is implemented, emit `funding_readiness.lead.created`; keep the old status as a deprecated response alias only. |
| Am I Fundable `POST /api/leads/route-lead` | Returns `lead_route_created`. | Emit public workflow route data, then map durable changes to `funding_readiness.review.status_changed`. |
| Partner Command Center `POST /api/lead-router` | Creates Partner Event `lead_submitted`. | Continue logging `lead_submitted` for legacy dashboards while also emitting `funding_readiness.lead.persisted`. |
| Partner Command Center Partner Events database | Stores safe partner lifecycle events. | Store safe event summaries keyed by `lead_id`; do not use it as the full lead record. |

## Review status transitions

```text
new
  -> scored
  -> queued_for_review | awaiting_documents | nurture
queued_for_review
  -> in_human_review | awaiting_documents | nurture | closed
awaiting_documents
  -> queued_for_review | in_human_review | nurture | closed
in_human_review
  -> reviewed | awaiting_documents | nurture | closed
reviewed
  -> closed | nurture
nurture
  -> queued_for_review | closed
```

`rejected_invalid` is reserved for invalid, spam, duplicate, failed-consent, or prohibited payloads. It is not a funding decline.

## Manual review triggers

Emit `funding_readiness.review.requested` when any of these are true:

- `manual_review_recommended` is true.
- Major caution flags are present.
- Requested amount is materially high relative to stated revenue.
- Three or more readiness risks are present.
- Score falls below the configured review threshold.
- Attribution is mismatched or unresolved and partner credit matters.
- An operator or authorized GPT explicitly requests review.

The event may state the review reason category. It must not expose detailed provider rules or make an eligibility judgment.

## Direct traffic event behavior

- `partner_id` and `tracking_link_id` remain null.
- `funding_readiness.attribution.resolved` records status `direct`.
- The lead persists to the Moonshine/JF Ventures operator queue.
- The dashboard target is operator-facing unless the lead is later associated with a validated partner.

## Partner traffic event behavior

- URL or widget values begin as untrusted attribution hints.
- Partner Command Center validates the tracking link and partner relationship.
- Only validated IDs are placed in the durable event envelope.
- Every later Partner Event and dashboard status uses the same `lead_id` and validated `partner_id`.
- Partner-facing events contain safe status and next-action summaries only.

## Persistence fan-out

`funding_readiness.lead.persisted` may include server-side receipts for:

```text
notion_lead_record_id
google_sheets_row_id
crm_contact_id
crm_deal_or_case_id
partner_event_id
```

These receipts remain in `internal_payload`. Public and partner-facing responses receive only:

```text
lead_id
review_status
created_at
updated_at
safe_next_action
```

## Failure events

Recommended protected events:

| Event type | Use |
|---|---|
| `funding_readiness.validation.failed` | Schema, enum, consent, or prohibited-data failure. |
| `funding_readiness.attribution.rejected` | Unknown partner, unknown tracking link, or partner/link mismatch. |
| `funding_readiness.persistence.failed` | CRM, Notion, Sheets, or event-log write failed after the lead was accepted. |
| `funding_readiness.follow_up.failed` | A consent-compliant follow-up could not be queued or delivered. |

Failure events must not echo secrets, full payloads, bank data, tax IDs, account numbers, or private documents.

## Idempotency and ordering

- Canonical ingestion accepts an `Idempotency-Key` header or `internal_context.idempotency_key`.
- Create operations deduplicate by `lead_id` and idempotency key.
- Event consumers tolerate out-of-order delivery by comparing `occurred_at` and the allowed status-transition map.
- Status changes require optimistic checks or a version number when multiple systems may write.
- Retryable storage failures do not create a second lead.

## Dashboard projection

Partner and operator dashboards should consume a safe read model rather than the full canonical lead object.

Minimum safe dashboard record:

```json
{
  "lead_id": "lead_...",
  "business_name": "Demo Main Street Services LLC",
  "score_tier": "highly_fundable",
  "primary_funding_family": "working_capital",
  "review_status": "queued_for_review",
  "partner_id": "MS-P-...",
  "campaign_id": "premium-partner-demo",
  "safe_next_action": "Human review is queued.",
  "created_at": "2026-07-10T15:30:00Z",
  "updated_at": "2026-07-10T15:31:00Z"
}
```

Do not expose raw credit score, detailed red flags, private documents, provider matches, internal notes, or applicant contact details by default.
