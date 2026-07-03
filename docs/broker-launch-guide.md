<!--
Am I Fundable / Funding Readiness Scorecard
Visibility: public_repo_operational_doc
Safety: public-safe; no provider names, provider IDs, affiliate/apply URLs, commissions, private contacts, routing secrets, underwriting notes, credentials, or real borrower PII.
Deployment: do not change vercel.json unless explicitly authorized.
-->
# Broker Launch Guide

This guide helps brokers deploy the Funding Readiness Scorecard as a front-end intake, triage, and education tool.

The goal is not to replace judgment. The goal is to stop treating every lead like a mystery meat sandwich.

## Broker use cases

Use the scorecard to:

- qualify inbound leads before a call
- route users to document prep
- identify high-readiness strategy review leads
- send low-readiness users into nurture
- reduce bad-fit applications
- segment by funding purpose
- standardize broker intake notes
- create a white-label lead magnet

## Recommended launch flow

```txt
Traffic source
→ broker landing page
→ scorecard
→ readiness result
→ document checklist or review request
→ manual review
→ potential funding path or prep workflow
```

## Broker page setup

Use `/broker.html` as the broker-facing public page.

Recommended sections:

1. What the scorecard does.
2. Who it helps.
3. Broker workflow.
4. Embed or scorecard CTA.
5. Safety language.
6. Next-step CTA.

CTA options:

```txt
Use the Scorecard
Route My Leads
Request White Label Access
See Broker Workflow
```

Avoid:

```txt
Get Your Clients Approved
Guarantee More Funding
Instant Lender Match
```

## Intake workflow

Ask leads to complete the scorecard before a call when possible.

Recommended broker intake order:

1. Confirm contact details.
2. Confirm business type/persona.
3. Confirm funding purpose.
4. Review readiness tier.
5. Review blockers.
6. Request documents.
7. Schedule review if appropriate.
8. Route to prep or nurture when not ready.

## Broker script

> Before we talk through funding options, complete the readiness scorecard. It helps identify common strengths, blockers, documents, and potential funding paths. It is not an approval or funding offer, but it keeps us from wasting your time on the wrong lane.

## Document request script

> Your scorecard result suggests we should review a few documents before discussing next steps. Please gather recent business bank statements, basic business details, and a short use-of-funds summary. Depending on your funding purpose, additional documents may be requested.

## Lead segmentation

| Segment | Trigger | Broker action |
|---|---|---|
| Highly fundable | High readiness score and clean signals | Offer strategy review. |
| Review ready | Mixed but workable signals | Request documents and review. |
| Selective fit | Some blockers or narrow use case | Clarify path and timing. |
| Prep first | Low readiness or major gaps | Send prep checklist and nurture. |

## Broker CRM tags

Suggested generic tags:

```txt
scorecard_lead
high_readiness
review_ready
selective_fit
prep_first
documents_needed
working_capital_interest
equipment_interest
real_estate_interest
ecommerce_interest
startup_interest
business_credit_interest
```

Keep actual CRM IDs out of public files.

## Broker follow-up cadence

```txt
Day 0: score received + next step
Day 1: document reminder
Day 3: blocker-specific follow-up
Day 7: prep or review path reminder
Day 14: nurture handoff
```

## What brokers should not promise

Do not say:

- you are approved
- this lender will fund you
- guaranteed funding
- best rates
- instant approval
- no-doc approval
- credit repair outcomes

Say:

- your profile may be worth reviewing
- this may fit a funding family
- documents are needed before next steps
- a human review is recommended
- this is not an approval or guarantee

## White-label usage

For white-label broker pages:

- keep scorecard branding configurable
- preserve disclaimers
- do not expose routing rules
- do not put provider names in public copy
- use partner-safe source values
- keep embed config public-safe

## Broker QA checklist

Before launch:

- [ ] Broker page links to `/scorecard.html`.
- [ ] Scorecard submit path works or fails gracefully.
- [ ] Result copy uses readiness language.
- [ ] Lead capture consent is visible.
- [ ] Partner/provider data is absent from public code.
- [ ] Broker CRM mapping stays internal.
- [ ] Document checklist is public-safe.
- [ ] Privacy and terms pages are linked.
- [ ] `vercel.json` was not changed.

## Launch copy

> Give leads a clear funding-readiness path before the first call. The scorecard helps identify likely readiness tier, possible blockers, document needs, and next steps—without pretending a quiz is an underwriting decision.
