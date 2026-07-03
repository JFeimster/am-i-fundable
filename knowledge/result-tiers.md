# Result Tiers Knowledge File

## Purpose

This file explains public-safe score tiers for the Funding Readiness Scorecard. It is designed for GPT assistants, site copy, result pages, broker prep, and educational follow-up.

A score tier is a readiness interpretation. It is not a lending decision.

## Tier model

The scorecard can use four public-facing readiness tiers:

1. Highly Fundable
2. Fundable Review
3. Selective Fit
4. Not Ready Yet

Exact scoring logic may live in code or server-side logic. Public explanations should stay broad and avoid exposing internal routing details.

---

## Tier 1: Highly Fundable

### Public label

Highly Fundable

### Plain-English meaning

The user appears to have stronger funding-readiness signals based on the answers provided. The file may be ready for a faster strategy review if documentation supports the answers.

### Common signals

- Active business revenue
- Consistent deposits
- Solid operating history
- Cleaner bank activity
- Stronger credit range
- Clear funding purpose
- Reasonable requested amount relative to business activity
- Few or no major red flags

### Safe result copy

> Based on your answers, your business appears highly fundable compared with common readiness signals. The next step is a strategy review to confirm documents, fit, and available funding paths. This score is not an approval, offer, or guarantee of funding.

### Recommended next step

- Request a funding strategy review
- Prepare recent business bank statements
- Confirm funding purpose and amount
- Review existing obligations
- Keep the application path human-reviewed

### Avoid saying

- "You are approved"
- "You qualify for funding"
- "You can get funded today"
- "You are guaranteed to receive capital"

---

## Tier 2: Fundable Review

### Public label

Fundable Review

### Plain-English meaning

The user has meaningful readiness signals, but some details need review before recommending a specific next step.

### Common signals

- Some revenue or operating history
- Funding purpose is plausible
- Credit, bank activity, structure, or documentation may need clarification
- Score may be near a stronger tier but with one or two caution areas
- Manual review may find a viable path

### Safe result copy

> Based on your answers, your file may be worth a funding-readiness review. There are useful signals, but a human should confirm documentation, bank activity, credit context, and the best next step before you apply.

### Recommended next step

- Submit for manual readiness review
- Gather bank statements and revenue proof
- Explain any red flags upfront
- Clarify the use of funds
- Compare requested amount against recent revenue

### Avoid saying

- "You are eligible"
- "You have a lender match"
- "You qualify after review"
- "You are conditionally approved"

---

## Tier 3: Selective Fit

### Public label

Selective Fit

### Plain-English meaning

The user may still have options, but the file likely needs careful routing or preparation. A broad "apply everywhere" approach would be risky.

### Common signals

- Lower or inconsistent revenue
- Shorter operating history
- Weak or uncertain credit range
- Bank volatility
- New business structure
- High requested amount compared with current activity
- Red flags that need context

### Safe result copy

> Based on your answers, your file may be a selective fit. That means there may be a path, but it should be reviewed carefully before applying. The best next step is to identify blockers, right-size the funding request, and prepare the file.

### Recommended next step

- Review blockers first
- Reduce or clarify funding amount if unrealistic
- Build a short document checklist
- Consider setup or nurture steps
- Ask for manual guidance before submitting any application

### Avoid saying

- "You probably will not qualify"
- "No one will fund you"
- "Bad credit means no options"
- "Apply anyway and see what happens"

---

## Tier 4: Not Ready Yet

### Public label

Not Ready Yet

### Plain-English meaning

The user is likely better served by preparation before applying. This tier should be framed as a recovery path, not a rejection.

### Common signals

- No current revenue
- No formal business setup
- No business bank account
- Very short operating history
- Major unresolved red flags
- Unclear funding purpose
- Funding request does not match current readiness
- Missing basic documentation

### Safe result copy

> Based on your answers, applying right now may create wasted effort or weak outcomes. The better next step is to build your funding-readiness foundation: business setup, banking, documentation, revenue proof, and a realistic funding plan.

### Recommended next step

- Complete business setup basics
- Open or clean up business banking
- Track revenue and deposits
- Organize documents
- Build 30-, 60-, and 90-day readiness milestones
- Re-score after meaningful improvements

### Avoid saying

- "Rejected"
- "Denied"
- "Unfundable forever"
- "No chance"
- "Guaranteed no"

---

## Tier handling rules for assistants

### Always include a safety line

Every tier explanation should include:

> This score is not an approval, offer, commitment, or guarantee of funding.

### Always offer a next step

Do not end with a score alone. Scores need motion.

Good next-step examples:

- "Prepare these documents next."
- "Request a human review."
- "Review the potential blockers."
- "Build the foundation before applying."
- "Re-score after your next 30 days of deposits."

### Avoid shame language

Do not punish users for a low score. Low score users are often the best nurture audience.

Use:

- "prep-first"
- "foundation-building"
- "readiness work"
- "blocker cleanup"
- "better next step"

Avoid:

- "bad file"
- "unqualified"
- "bad borrower"
- "dead lead"
- "not worth it"

## Score-to-page routing guidance

Public page mappings can use:

- Highly Fundable → `/highly-fundable.html`
- Fundable Review → `/fundable-review.html`
- Selective Fit → `/fundable-review.html` or `/not-ready.html` depending on blockers
- Not Ready Yet → `/not-ready.html`

Do not publish internal routing logic or partner-specific decisioning.

## Result response template

```text
Your Funding Readiness Score: [score]/100
Readiness Tier: [tier]

Based on your answers, [plain-language interpretation].

Recommended next step:
- [step 1]
- [step 2]
- [step 3]

This score is not an approval, offer, commitment, or guarantee of funding. A human review should confirm fit, documentation, and next steps.
```

---

## Operating guardrails

Use this knowledge for educational funding-readiness guidance only.

Do not present any score, path, checklist, or recommendation as an approval, funding offer, lender decision, underwriting decision, guarantee, or promise of terms. Do not name private providers, expose routing rules, share affiliate/apply links, disclose commissions, or collect unnecessary sensitive information. When a user appears close to a potential funding path, recommend human review before any application or partner handoff.
