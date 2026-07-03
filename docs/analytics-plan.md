<!--
Am I Fundable / Funding Readiness Scorecard
Visibility: public_repo_operational_doc
Safety: public-safe; no provider names, provider IDs, affiliate/apply URLs, commissions, private contacts, routing secrets, underwriting notes, credentials, or real borrower PII.
Deployment: do not change vercel.json unless explicitly authorized.
-->
# Analytics Plan

This plan defines public-safe analytics events for the Funding Readiness Scorecard funnel.

Analytics should measure product behavior, not expose private routing, provider economics, or borrower-sensitive details.

## Funnel map

```txt
Page visit
→ scorecard start
→ question progress
→ scorecard completed
→ lead submitted
→ result viewed
→ document checklist opened
→ review requested
→ resource clicked
→ nurture path clicked
```

## Event naming conventions

Use lowercase snake case.

Good:

```txt
scorecard_started
scorecard_step_completed
scorecard_completed
lead_capture_submitted
result_viewed
document_checklist_opened
review_requested
resource_clicked
embed_loaded
cta_clicked
```

Bad:

```txt
ProviderARouted
ApprovedLead
CommissionTrigger
UnderwritingPass
```

## Core events

| Event | Trigger | Public-safe properties |
|---|---|---|
| `page_viewed` | Page load | `page_id`, `path`, `audience` |
| `scorecard_started` | First scorecard interaction | `source`, `audience`, `embed_type` |
| `scorecard_step_completed` | User completes step | `step_id`, `step_index` |
| `scorecard_completed` | Score calculated | `tier_id`, `score_band`, `source` |
| `lead_capture_submitted` | Lead form submitted | `source`, `consent_present`, `tier_id` |
| `result_viewed` | Result panel/page visible | `tier_id`, `score_band` |
| `funding_path_clicked` | Funding family clicked | `funding_family_id` |
| `document_checklist_opened` | Checklist viewed | `checklist_id`, `funding_purpose` |
| `review_requested` | Review CTA clicked/submitted | `tier_id`, `source` |
| `resource_clicked` | Resource clicked | `resource_id`, `resource_type` |
| `embed_loaded` | Embed initialized | `source`, `audience`, `theme` |
| `cta_clicked` | CTA clicked | `cta_id`, `page_id`, `destination_type` |

## Score bands

To avoid leaking exact sensitive scoring in broad analytics, use bands where possible:

```txt
0-44
45-64
65-79
80-100
```

Exact score can be used internally if authorized and stored securely, but public analytics dashboards should not need it.

## Allowed analytics properties

Allowed:

- `page_id`
- `path`
- `source`
- `audience`
- `embed_type`
- `theme`
- `tier_id`
- `score_band`
- `funding_family_id`
- `funding_purpose`
- `resource_id`
- `resource_type`
- `cta_id`
- `destination_type`
- `consent_present`

Not allowed:

- name
- email
- phone
- business name
- provider ID
- provider name
- apply URL
- affiliate URL
- commission
- payout
- private routing note
- underwriting note
- credit score exact value
- bank balance
- full bank statement details

## Browser event helper pattern

Browser code should send only public-safe properties:

```js
window.dispatchEvent(new CustomEvent("fundingReadinessAnalytics", {
  detail: {
    event: "scorecard_completed",
    properties: {
      tier_id: "review_ready",
      score_band: "65-79",
      source: "scorecard_page"
    }
  }
}));
```

## CTA taxonomy

Suggested CTA IDs:

```txt
scorecard_start_primary
scorecard_start_secondary
result_review_request
result_documents
not_ready_prep_path
highly_fundable_strategy_review
broker_use_scorecard
partner_embed_interest
white_label_request
resource_download
faq_scorecard_start
```

## Page IDs

Suggested page IDs:

```txt
home
scorecard
results
funding_paths
documents
broker
partners
white_label
embed_example
thank_you
not_ready
fundable_review
highly_fundable
resources
faq
privacy
terms
```

## Reporting views

Recommended weekly views:

1. Scorecard starts by source.
2. Completion rate by source.
3. Lead capture rate by tier.
4. Review requests by tier.
5. Document checklist opens by funding purpose.
6. Resource clicks by audience.
7. Embed performance by partner-safe source.
8. Drop-off by scorecard step.

## Practical questions to answer

- Which traffic sources start the scorecard?
- Where do users drop off?
- Which result tiers request review?
- Which audiences need more prep content?
- Which funding-family pages create next-step clicks?
- Which partner embeds generate useful submissions?
- Which resources earn clicks after low-readiness results?

## Do not track

Do not track or store in analytics:

- sensitive borrower PII
- detailed financial data
- provider-level routing
- internal reviewer notes
- private CRM IDs
- secret tokens
- raw bank data
- commissions

## Consent and privacy

Lead capture consent should be explicit. Analytics should not override user privacy choices. Keep privacy page language aligned with the actual tracking implementation.

## Deployment note

Analytics should not require changing `vercel.json`. Deploy windows remain manual unless explicitly authorized.
