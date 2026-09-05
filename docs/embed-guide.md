<!--
Am I Fundable / Funding Readiness Scorecard
Visibility: public_repo_operational_doc
Safety: public-safe; no provider names, provider IDs, affiliate/apply URLs, commissions, private contacts, routing secrets, underwriting notes, credentials, or real borrower PII.
-->
# Embed Guide

## Canonical architecture

`am-i-fundable` is the public site and readiness workflow. It is **not** the canonical embeddable widget host.

The reusable embeddable funding-readiness form is owned by the separate repository and Vercel project:

- GitHub: `JFeimster/funding-quiz`
- Production host: `https://funding-quiz.vercel.app`
- Embeddable form: `https://funding-quiz.vercel.app/widget.html`

The Am I Fundable homepage and scorecard may keep their own on-site form experience. Do not reintroduce `/widget.html`, `/embed.html`, `widget.js`, or `widget.css` into the Am I Fundable production build merely to support third-party embedding.

## Recommended partner embed

Use the `funding-quiz` widget directly:

```html
<iframe
  src="https://funding-quiz.vercel.app/widget.html"
  title="Funding Readiness Scorecard"
  width="100%"
  height="980"
  style="border:0;max-width:100%;"
  loading="lazy"
></iframe>
```

Partner-safe attribution parameters may be added only when supported by the `funding-quiz` implementation. Do not put provider IDs, CRM owner IDs, private routing logic, commissions, payout terms, borrower PII, or underwriting notes into public URLs.

## Legacy Am I Fundable embed URLs

The following Am I Fundable routes are retired from the production build and permanently redirect to `funding-quiz`:

- `/embed.html` → `https://funding-quiz.vercel.app/`
- `/embed-example.html` → `https://funding-quiz.vercel.app/`
- `/widget.html` → `https://funding-quiz.vercel.app/widget.html`
- `/widget.js` → `https://funding-quiz.vercel.app/widget.js`
- `/widget.css` → `https://funding-quiz.vercel.app/widget.css`

This separation avoids maintaining two public widget implementations and reduces duplicate crawl surfaces.

## Accessibility and compliance

Every embed should include a descriptive `title`, keyboard-accessible controls, visible focus states, readable contrast, explicit labels, and consent language where required.

Use educational/pre-qualification language only. The scorecard is not an approval, offer, commitment to lend, or guarantee of funding. Any funding path remains subject to review, documentation, business performance, credit profile, and applicable partner/provider criteria.

## Testing

Before distributing an embed:

- Confirm `funding-quiz.vercel.app/widget.html` loads on desktop and mobile.
- Confirm the host page uses lazy loading when practical.
- Confirm the form does not expose private provider or routing data.
- Confirm submission behavior works or fails gracefully.
- Confirm the host page includes appropriate disclaimer language.

Do not add a second embeddable implementation back into `am-i-fundable`; change the `funding-quiz` repo when the reusable widget needs work.
