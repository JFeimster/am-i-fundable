<!--
Am I Fundable / Funding Readiness Scorecard
Visibility: public_repo_operational_doc
Safety: public-safe; no provider names, provider IDs, affiliate/apply URLs, commissions, private contacts, routing secrets, underwriting notes, credentials, or real borrower PII.
Deployment: do not change vercel.json unless explicitly authorized.
-->
# Partner Launch Guide

This guide helps affiliates, community partners, creators, agencies, and referral partners use the Funding Readiness Scorecard safely.

The partner version should generate useful leads and educate users without exposing private relationships, partner economics, provider names, or routing logic.

## Partner promise

Safe promise:

> Help your audience understand funding readiness before they apply.

Unsafe promise:

> Send your audience to get approved for funding.

## Partner flow

```txt
Partner content
→ scorecard embed or partner landing page
→ readiness result
→ resource, checklist, or human review
→ internal review/routing
```

## Partner page

Use `/partners.html` for public-facing partner education.

Recommended sections:

1. Audience problem.
2. How readiness scoring helps.
3. What partners can embed/share.
4. What users see.
5. Safety/disclaimer.
6. Partner interest CTA.

## Partner-safe messaging

Good:

> Share a free funding readiness scorecard with your audience so they can understand common strengths, blockers, documents, and next steps before applying.

Bad:

> Monetize your audience with guaranteed funding approvals.

Good:

> The scorecard can route users to education, document prep, or a review request based on their answers.

Bad:

> The scorecard sends users to the highest-paying lender.

## Partner onboarding checklist

- [ ] Confirm partner audience.
- [ ] Confirm content placement.
- [ ] Choose public-safe source label.
- [ ] Provide iframe or landing-page URL.
- [ ] Confirm required disclaimer appears.
- [ ] Test mobile layout.
- [ ] Confirm no private provider data appears.
- [ ] Confirm partner understands this is readiness guidance only.
- [ ] Keep partner economics out of repo files.

## Public-safe source labels

Use source labels like:

```txt
creator-finance-newsletter
contractor-community
real-estate-investor-resource
ecommerce-seller-guide
broker-partner-demo
```

Avoid source labels that expose private routing, providers, payouts, or commission logic.

## Partner content examples

### Newsletter blurb

> Before you apply for business funding, check your funding readiness. This free scorecard reviews common signals like revenue, time in business, bank activity, business setup, funding purpose, and potential blockers. It is educational and not an approval or funding offer.

### Community post

> If you are thinking about funding for inventory, payroll, equipment, growth, or a new project, run the free readiness scorecard first. It helps you understand what documents and next steps may matter before you start applying.

### Website CTA

```txt
Check Your Funding Readiness
```

## Partner FAQ

### Can partners see provider names?

No. Public partner pages and embeds should show funding families, not providers.

### Can partners see commissions?

No. Partner economics are not public repo content and should not appear in static files, public configs, embeds, examples, or screenshots.

### Can partners customize branding?

Yes, through approved white-label or embed presets. Customization must not remove disclaimers or add unsafe claims.

### Can partners say users will get funded?

No. Partners may say users can check readiness and request a review. They may not promise approval, funding, rates, or outcomes.

## Embed handoff

Send partners:

- embed code
- partner-safe source label
- disclaimer copy
- test instructions
- contact route for support

Do not send:

- internal registries
- routing logic
- provider list
- apply URLs
- commission tables
- private notes

## Partner reporting

Public-safe reporting may include:

- starts
- completed scorecards
- review requests
- broad readiness tiers
- resource clicks
- document checklist usage

Do not report:

- private provider routing
- underwriting notes
- borrower PII beyond authorized lead handling
- commission projections from repo files

## Launch QA

- [ ] Partner link works.
- [ ] Embed loads on partner site.
- [ ] Source label is public-safe.
- [ ] Disclaimer is visible.
- [ ] Results do not claim approval.
- [ ] No provider names appear.
- [ ] No affiliate/apply URLs appear.
- [ ] No commission/payout language appears.
- [ ] Privacy and terms pages are accessible.
- [ ] `vercel.json` remains unchanged.

## Partner boundary response

If a partner asks for private provider or payout details in a public page, use:

> We keep provider-specific routing, economics, and review logic internal. Public pages and embeds explain funding readiness and broad funding families only.
