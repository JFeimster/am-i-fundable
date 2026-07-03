# Broker Review Summary — Internal Demo

**Visibility:** internal-demo example  
**Data type:** fake/demo applicant data only  
**Audience:** broker, processor, or funding operations reviewer  
**Do not publish:** this format may contain review notes and operational triage language that should stay server-side or internal.

---

## Review status

| Field | Demo value |
|---|---|
| Review ID | demo_review_1042 |
| Lead name | Jamie Demo |
| Business | Demo Supply Co |
| Source | Public scorecard demo |
| Score | 78 / 100 |
| Tier | Review-Ready |
| Suggested queue | Human funding readiness review |
| Priority | Medium-high |
| Public result page | `/fundable-review.html` |

---

## Readiness interpretation

The demo profile looks strong enough for a strategy review, but the requested range should be checked against recent revenue, deposit consistency, and existing obligations before recommending a specific path.

The reviewer should keep all provider-specific routing, compensation, partner notes, and private criteria out of browser-facing pages, emails, and applicant summaries.

---

## Review triggers

- Score is above the review threshold but below the highest-readiness tier.
- Requested amount should be validated against recent deposits.
- Funding purpose is concrete: inventory / materials.
- No red flags were selected, but bank statements should confirm this.

---

## Suggested reviewer checklist

1. Confirm consent to contact is present.
2. Review 3–6 months of business bank statements.
3. Compare average monthly deposits with desired funding range.
4. Check for NSFs, negative days, excessive existing obligations, or unusual deposit sources.
5. Confirm entity/EIN details.
6. Ask for inventory invoice, supplier quote, or purchase plan.
7. Decide whether the lead should move to:
   - document prep,
   - strategy review,
   - potential funding path discussion, or
   - nurture sequence.

---

## Internal notes template

Use this structure for real reviews, but do not add private provider details to public files.

```txt
Observed strengths:
- [Add revenue, time-in-business, documentation, or bank activity notes.]

Items to verify:
- [Add missing document or clarification needs.]

Recommended next step:
- [Prep, review, route, nurture, or decline-to-route.]

Applicant-safe summary:
- [Plain-language next step without private routing logic.]
```

---

## Applicant-safe summary example

Based on the information provided, your file appears ready for a funding readiness review. The next step is to review documentation, confirm recent business activity, and compare your requested amount against revenue and bank activity.

This is not an approval, offer, final eligibility decision, underwriting decision, or guarantee of funding.

---

## Internal boundary reminder

Do not expose:

- provider names,
- provider IDs,
- affiliate URLs,
- apply URLs,
- commission data,
- private contacts,
- private notes,
- routing secrets,
- underwriting notes,
- credentials,
- real borrower PII.
