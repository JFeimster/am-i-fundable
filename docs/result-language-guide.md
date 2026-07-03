<!--
Am I Fundable / Funding Readiness Scorecard
Visibility: public_repo_operational_doc
Safety: public-safe; no provider names, provider IDs, affiliate/apply URLs, commissions, private contacts, routing secrets, underwriting notes, credentials, or real borrower PII.
Deployment: do not change vercel.json unless explicitly authorized.
-->
# Result Language Guide

This guide controls how scorecard results, emails, CTAs, API responses, GPT actions, broker scripts, and public pages describe funding readiness.

The scorecard may educate, rank readiness, recommend next steps, and route to human review. It must not imply a funding decision.

## Core rule

Say what the scorecard can safely know:

```txt
Based on the answers provided, this profile appears more or less ready for certain funding paths.
```

Do not say what only an actual review process can determine:

```txt
This borrower is approved, eligible, or guaranteed to receive funding.
```

## Approved vocabulary

Use these phrases:

- funding readiness
- readiness score
- potential funding path
- may be a fit
- may not be ready yet
- based on your answers
- recommended next step
- review recommended
- human review recommended
- subject to review
- documentation may be required
- not an approval, offer, or guarantee of funding
- educational pre-qualification guidance
- funding-family suggestion
- prep-first path
- selective-fit path
- review-ready profile
- high-readiness profile

## Prohibited public claims

Do not use these as public claims:

- approved
- guaranteed funding
- final eligibility
- underwriting decision
- lender-specific approval certainty
- best rates
- instant approval
- no-doc approval
- guaranteed credit line
- guaranteed business credit
- credit repair outcome
- fixes your credit
- remove negative items
- funding guaranteed in 24 hours

These phrases may appear in this guide and safety docs as banned examples only.

## Tier language

### Highly Fundable

Use:

> Based on the answers provided, this profile shows strong funding readiness signals. A human review is recommended to confirm documentation, funding amount, timing, and potential path fit.

Do not use:

> You are approved.

### Review Ready

Use:

> This profile has several useful readiness signals, but the file should be reviewed before recommending a path. Documentation, bank activity, and requested amount may affect next steps.

Do not use:

> You qualify for funding.

### Selective Fit

Use:

> This profile may still have options, but the path is likely more selective. A prep step or focused review may help avoid wasted applications.

Do not use:

> Only one lender will take this.

### Not Ready Yet

Use:

> This profile may need preparation before pursuing funding. Focus on business setup, revenue consistency, bank activity, documentation, or red flag cleanup before submitting applications.

Do not use:

> You cannot get funding.

## CTA language

Good CTA labels:

```txt
Get My Funding Readiness Score
Request a Human Review
Prep My Funding File
See Recommended Next Steps
Explore Potential Funding Paths
Start the Prep Path
Talk Through My Options
```

Avoid CTA labels:

```txt
Get Approved Now
Claim Your Funding
Guarantee My Loan
Find My Best Rate
Instant Approval
Apply to the Winning Lender
```

## Result disclaimer

Every result surface should include a disclaimer similar to:

> This readiness score is educational and based on the answers provided. It is not an approval, offer, commitment to lend, underwriting decision, or guarantee of funding. Any potential funding path is subject to review, documentation, business performance, credit profile, and partner criteria.

## Funding path descriptions

Good:

> Working capital may be relevant for businesses with recurring revenue, recent bank activity, and short-term cash needs.

Bad:

> You will get working capital if your revenue is high enough.

Good:

> Equipment and asset funding may be worth reviewing when the funding request is tied to a specific vehicle, machine, or business asset.

Bad:

> Equipment funding is approved as long as the asset has value.

## Red flag language

Red flags should be handled directly without shaming the user.

Good:

> Recent overdrafts may narrow available paths or make timing more important.

Bad:

> Your file is bad.

Good:

> An open bankruptcy generally requires careful review before any funding path is discussed.

Bad:

> No lender will touch this.

## Broker notes

Broker-facing summaries can be more operational, but still not decisive.

Good:

> Suggested queue: manual review. Confirm bank statements, requested amount, recent NSFs, and entity setup before discussing path fit.

Bad:

> Route to Provider A for approval.

## GPT response pattern

When a GPT explains a score, use this structure:

```txt
1. Score/tier summary.
2. What the score suggests.
3. Potential funding families, not providers.
4. Potential blockers.
5. Document checklist.
6. Recommended next step.
7. Disclaimer.
```

Example:

> Your score suggests a review-ready profile. Based on your answers, working capital or a structured line-of-credit path may be worth reviewing, but the requested amount should be checked against recent revenue and bank activity. Prepare recent bank statements, entity details, and a short use-of-funds note. This is not an approval, offer, or guarantee of funding.

## Rewrite table

| Unsafe | Safer replacement |
|---|---|
| You are approved. | Your profile shows strong readiness signals. |
| You qualify for funding. | You may be a fit for one or more funding paths after review. |
| Guaranteed funding. | Potential funding path, subject to review. |
| Instant approval. | Fast review may be possible when documentation is complete. |
| Best rates. | Compare available terms after review. |
| Underwriting says yes. | A human review is recommended. |
| Lender match confirmed. | Funding-family fit appears possible. |
| Fix your credit. | Improve credit-readiness signals. |

## Review checklist

Before publishing copy:

- [ ] Does it avoid approval language?
- [ ] Does it avoid guarantees?
- [ ] Does it avoid lender-specific certainty?
- [ ] Does it avoid fake urgency?
- [ ] Does it use readiness and review framing?
- [ ] Does it include a disclaimer?
- [ ] Does it avoid provider names and private details?
