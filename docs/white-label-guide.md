<!--
Am I Fundable / Funding Readiness Scorecard
Visibility: public_repo_operational_doc
Safety: public-safe; no provider names, provider IDs, affiliate/apply URLs, commissions, private contacts, routing secrets, underwriting notes, credentials, or real borrower PII.
Deployment: do not change vercel.json unless explicitly authorized.
-->
# White-Label Guide

This guide describes how to package the Funding Readiness Scorecard for brokers, agencies, communities, and partner brands without compromising public/private data boundaries.

White-label does not mean “remove the brakes and floor it into Claims Court.” It means brand-flexible, safety-preserving distribution.

## White-label goals

- Let partners present the scorecard under their brand.
- Preserve readiness-based language.
- Keep provider and routing logic internal.
- Standardize lead capture and review workflows.
- Create a sellable broker/agency asset.

## White-label surfaces

| Surface | Purpose |
|---|---|
| `/white-label.html` | Public pitch page for white-label usage. |
| `/embed-example.html` | Demo of how the widget appears on another page. |
| `/scorecard.html` | Full-page assessment surface. |
| `/results.html` | Result education surface. |
| `/documents.html` | Prep checklist hub. |

## Allowed customization

White-label partners may customize:

- public brand name
- logo or wordmark, if assets are approved
- accent color, if contrast is readable
- source label
- audience preset
- CTA destination, if public-safe
- intro copy, if safe
- partner contact route, if approved

## Required elements

Every white-label deployment must keep:

- scorecard purpose explanation
- consent language
- result disclaimer
- privacy/terms links
- public-safe result language
- funding-family framing instead of provider lists
- human review language

## Not allowed

White-label deployments must not include:

- provider names
- lender-specific routing
- apply URLs
- affiliate URLs
- commission or payout language
- private contact info
- routing secrets
- underwriting notes
- guarantee or approval claims
- fake testimonials or invented social proof
- removal of disclaimers

## White-label config pattern

Use public-safe config only:

```json
{
  "visibility": "public_runtime_browser_safe",
  "brand": {
    "name": "Demo Partner",
    "displayMode": "white_label"
  },
  "embed": {
    "source": "demo-partner",
    "audience": "general",
    "theme": "dark"
  },
  "disclaimer": "This scorecard is educational and not an approval, offer, or guarantee of funding."
}
```

Do not include private routing fields in white-label config.

## Sales positioning

Use:

> Offer your audience a branded funding-readiness scorecard that helps identify common strengths, blockers, documents, and next steps before they apply.

Avoid:

> Give your audience instant funding approvals under your own brand.

## Package tiers

### Basic embed

- iframe or script embed
- public-safe branding
- standard result page
- standard checklist links
- standard disclaimers

### Broker intake package

- broker landing page
- scorecard embed
- review request flow
- broker follow-up templates
- document checklist routing

### Agency automation package

- lead routing rules
- CRM stage map
- task templates
- nurture routing
- analytics event plan
- internal-only automation docs

Keep actual CRM/API credentials out of the repo.

## Implementation checklist

- [ ] Confirm partner brand name.
- [ ] Confirm public-safe source label.
- [ ] Select embed preset.
- [ ] Confirm CTA path.
- [ ] Confirm disclaimer placement.
- [ ] Test scorecard flow.
- [ ] Test result language.
- [ ] Check browser network tab for internal file requests.
- [ ] Check public HTML/JS for provider data.
- [ ] Package handoff docs.
- [ ] Do not modify `vercel.json`.

## White-label handoff email outline

```txt
Subject: Funding Readiness Scorecard white-label handoff

Included:
- Embed code
- Recommended placement copy
- Required disclaimer
- Testing checklist
- Support contact route

Important:
The scorecard provides funding-readiness guidance only. It is not an approval, funding offer, or guarantee.
```

## Support checklist

When a white-label partner reports an issue:

1. Confirm URL and browser.
2. Confirm embed type.
3. Confirm source label.
4. Check if the widget loads.
5. Check console/network errors.
6. Confirm no host CSS collision.
7. Confirm result and disclaimer rendering.
8. Escalate only if the issue affects scoring, submission, or public boundary.

## Revenue packaging note

White-label is a productized service opportunity. Keep the public page simple. Keep the operating value in setup, integration, follow-up workflows, CRM mapping, analytics, and nurture automation.
