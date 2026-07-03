<!--
Am I Fundable / Funding Readiness Scorecard
Visibility: public_repo_operational_doc
Safety: public-safe; no provider names, provider IDs, affiliate/apply URLs, commissions, private contacts, routing secrets, underwriting notes, credentials, or real borrower PII.
Deployment: do not change vercel.json unless explicitly authorized.
-->
# Embed Guide

This guide explains how to embed the Funding Readiness Scorecard on a broker, partner, affiliate, community, or resource site without exposing internal routing logic.

The embed is a lead-capture and readiness education surface. It is not an approval engine, lender marketplace display, or provider-selection leak.

## Recommended embed model

Use one of two safe patterns:

1. **Iframe embed** for fastest partner installation.
2. **Script loader embed** for more branded integrations after the public embed loader is stable.

The iframe pattern is the safest default because it keeps styles, JavaScript, and scorecard behavior isolated from the host page.

## Basic iframe example

```html
<iframe
  src="https://your-public-domain.example/widget.html?source=partner-demo"
  title="Funding Readiness Scorecard"
  width="100%"
  height="760"
  style="border:0;max-width:100%;"
  loading="lazy"
></iframe>
```

Replace the demo domain only with the approved production domain after deployment is intentionally enabled.

Do not add provider IDs, private tags, affiliate links, or routing rules to the URL.

## Partner-safe query parameters

Allowed public query parameters:

| Parameter | Example | Purpose |
|---|---|---|
| `source` | `broker-demo` | Public attribution label. |
| `audience` | `contractor` | Public-safe audience preset. |
| `theme` | `dark` | Visual preset. |
| `compact` | `true` | Smaller widget layout. |

Do not pass:

- provider IDs
- CRM owner IDs
- private campaign IDs
- affiliate/apply URLs
- commissions
- payout terms
- user PII
- underwriting notes

## Safe source naming

Good:

```txt
broker-demo
partner-directory
contractor-resource-page
community-workshop
white-label-preview
```

Bad:

```txt
lender-name-route
provider-123
high-commission-path
approve-fast
private-crm-owner
```

If a source name would reveal private economics, provider relationships, or routing logic, it does not belong in the browser.

## Script loader example

Use only after `/assets/js/embed-loader.js` is installed and tested.

```html
<div
  data-funding-readiness-embed
  data-source="partner-demo"
  data-audience="general"
  data-theme="dark"
></div>

<script
  src="https://your-public-domain.example/assets/js/embed-loader.js"
  defer
></script>
```

The loader should create a sandboxed iframe or isolated widget shell. It must not fetch `/internal/**`.

## Host page placement

Recommended page sections:

1. Problem framing.
2. Who the scorecard helps.
3. Embedded scorecard.
4. What happens after submission.
5. Safe disclaimer.
6. Contact or resource CTA.

Example intro copy:

> Check your funding readiness before you apply. This scorecard reviews common readiness signals such as revenue, time in business, bank activity, business setup, funding purpose, and possible blockers. It is educational and does not guarantee funding.

## Height guidance

| Layout | Suggested height |
|---|---:|
| Full scorecard iframe | `760px` to `900px` |
| Compact embed | `620px` to `740px` |
| Result-only explainer | `500px` to `650px` |

If the host site supports responsive iframe resizing, use it. If not, start taller. Scrollbars are ugly little goblins but better than clipped forms.

## Accessibility requirements

The embed should include:

- a clear `title`
- keyboard-accessible controls
- visible focus states
- readable contrast
- form labels
- consent language
- no auto-playing audio or motion

## Required disclaimer near embeds

Use this or similar language near every embed:

> The Funding Readiness Scorecard is for educational and pre-qualification guidance only. It is not an approval, offer, commitment to lend, or guarantee of funding. Any potential path is subject to review, documentation, business performance, credit profile, and partner criteria.

## Testing checklist

Before handing an embed to a partner:

- [ ] Widget loads on desktop and mobile.
- [ ] Form steps advance with keyboard and mouse.
- [ ] Required fields block incomplete submission.
- [ ] Consent language is visible.
- [ ] Result language avoids approval or guarantee claims.
- [ ] No internal files are requested in the browser network tab.
- [ ] No private provider names, URLs, IDs, or notes appear in HTML, JS, query strings, or console logs.
- [ ] Submit behavior works or fails gracefully.
- [ ] Host page has the required disclaimer.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Widget height cuts off | Iframe too short | Increase height or use responsive resize. |
| Host CSS breaks widget | Non-iframe embed style collision | Use iframe pattern or scope CSS. |
| Submit fails | API unavailable or blocked | Show fallback message and preserve user experience. |
| Result page sounds too strong | Copy drift | Use result-language guide. |
| Partner asks for provider names | Boundary issue | Keep provider matching server-side/internal only. |

## Do not change deployment settings

Embedding docs should never require editing `vercel.json`. If a deployment window is needed, open it explicitly through the release process.
