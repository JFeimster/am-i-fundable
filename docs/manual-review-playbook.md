<!--
Am I Fundable / Funding Readiness Scorecard
Visibility: public_repo_operational_doc
Safety: public-safe; no provider names, provider IDs, affiliate/apply URLs, commissions, private contacts, routing secrets, underwriting notes, credentials, or real borrower PII.
Deployment: do not change vercel.json unless explicitly authorized.
-->
# Manual Review Playbook

This playbook explains how to handle scorecard leads that need a human review before any recommended next step is discussed.

Manual review exists because a score is a triage tool, not an underwriting oracle. The robots can sort the pantry; a human still checks whether the soup is expired.

## When manual review is recommended

Route a lead to manual review when any of the following apply:

- score is in a borderline range
- requested amount seems high relative to stated revenue
- time in business is short
- recent NSFs or overdrafts are reported
- open bankruptcy, tax lien, or recent missed payments are reported
- no formal business structure exists
- no business bank account exists
- funding purpose is unclear
- desired path is real estate, equipment, or debt consolidation and needs detail
- applicant requests a strategy review
- answers are contradictory or incomplete

## Review statuses

Use generic statuses until CRM-specific mapping is finalized.

| Status | Meaning |
|---|---|
| `new_scorecard_lead` | New submission received. |
| `review_requested` | User asked for or score triggered manual review. |
| `needs_documents` | Reviewer needs documents before next step. |
| `prep_first` | User should complete readiness prep before applying. |
| `strategy_review` | User appears ready for a consult/review call. |
| `nurture_path` | User needs education and follow-up. |
| `closed_no_response` | User did not respond after follow-up window. |

## Initial reviewer checklist

- [ ] Confirm name, email, phone, business name, and state.
- [ ] Confirm persona and funding purpose.
- [ ] Compare desired funding amount against monthly revenue.
- [ ] Check time in business.
- [ ] Review stated credit range.
- [ ] Review bank account status and red flags.
- [ ] Identify missing documents.
- [ ] Assign recommended queue.
- [ ] Use public-safe language in all notes and messages.

## Document checks

Ask for only what is necessary for the stage.

Common request list:

- recent business bank statements
- business entity and EIN details, if available
- owner identification details
- revenue summary
- use-of-funds explanation
- invoices, purchase orders, or contracts where relevant
- equipment invoice or quote where relevant
- property/project summary for real estate use cases
- marketplace sales summary for ecommerce sellers

Do not request sensitive information through insecure channels.

## Review notes format

Use this note format:

```txt
Readiness tier:
Primary use case:
Requested amount:
Revenue range:
Time in business:
Credit range:
Bank activity:
Red flags:
Missing documents:
Potential funding families:
Recommended next step:
Reviewer:
Date:
```

Keep notes factual. Do not write final eligibility statements.

## Safe reviewer language

Good:

> Based on the scorecard answers, your file may be worth a human review. Please gather recent bank statements and a short use-of-funds summary so we can better understand the next step.

Good:

> Your answers suggest a prep-first path may be useful before submitting funding applications. The strongest next step is to clean up documentation and confirm business banking activity.

Bad:

> You are approved pending bank statements.

Bad:

> This lender will fund you if the statements look good.

## Lead priority guide

| Priority | Signals | Suggested action |
|---|---|---|
| High | strong revenue, clean bank status, established entity, clear use of funds | Offer strategy review and request docs. |
| Medium | some strong signals plus missing docs or unclear amount | Request missing details and review. |
| Prep | low revenue, new business, no bank account, or multiple red flags | Send prep checklist and nurture path. |
| Hold | incomplete contact details or contradictory submission | Ask for clarification before review. |

## Follow-up cadence

Suggested manual cadence:

```txt
Day 0: confirm receipt and request missing documents
Day 1: reminder with checklist
Day 3: clarify blocker or next step
Day 7: move to nurture if no response
Day 14: final light-touch follow-up
```

Do not overpromise. Do not pressure users with fake deadlines.

## Escalation triggers

Escalate to a senior reviewer when:

- high requested amount
- complex real estate or equipment use case
- existing daily payment advance is disclosed
- tax lien or bankruptcy is disclosed
- borrower mentions legal, tax, or credit repair needs
- applicant disputes score or expects a decision
- partner/broker asks for private routing details

## Things reviewers must not do

- Do not state or imply approval.
- Do not guarantee funding.
- Do not promise best rates.
- Do not reveal internal provider or partner details.
- Do not send affiliate/apply URLs from public docs.
- Do not enter real borrower data into repo files or examples.
- Do not store private documents in the repo.
- Do not change `vercel.json` during ops handling.

## Outcome templates

### Review requested

> Thanks for completing the scorecard. Your answers suggest a human review may be useful before discussing next steps. Please gather recent business bank statements, business details, and a short use-of-funds note. This review is not an approval or funding offer.

### Prep-first

> Based on your answers, the strongest next step may be preparation before applying. Focus on business banking, revenue documentation, entity setup, and any recent account issues. The goal is to avoid wasted applications and improve readiness.

### Strategy review

> Your answers show stronger readiness signals. A strategy review can help confirm documents, timing, requested amount, and potential funding-family fit. Any next step remains subject to review.

## Quality control

Review a sample of manual-review notes weekly for:

- unsafe funding claims
- private data leakage
- missing disclaimers
- unclear next steps
- over-routing to one path
- missing document requests
- failure to move low-readiness leads into nurture
