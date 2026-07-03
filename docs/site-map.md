<!--
Am I Fundable / Funding Readiness Scorecard
Visibility: public_repo_operational_doc
Safety: public-safe; no provider names, provider IDs, affiliate/apply URLs, commissions, private contacts, routing secrets, underwriting notes, credentials, or real borrower PII.
Deployment: do not change vercel.json unless explicitly authorized.
-->
# Site Map

This document maps the public site, supporting data, runtime scripts, API surfaces, and internal-only operating files for the Am I Fundable / Funding Readiness Scorecard repo.

The product flow is:

```txt
Free scorecard
→ lead capture
→ readiness result
→ recommended next step
→ human review
→ potential funding path, prep workflow, or nurture sequence
```

This repo is static-first. Browser-facing pages should be plain HTML, CSS, and vanilla JavaScript unless a later batch explicitly authorizes otherwise.

## Public pages

| Route | Purpose | Primary CTA | Notes |
|---|---|---|---|
| `/` | Main landing page and scorecard entry point. | Get My Funding Score | Existing homepage. |
| `/scorecard.html` | Full-page scorecard flow. | Calculate readiness score | Dedicated assessment surface. |
| `/results.html` | Explains readiness tiers and next steps. | Understand My Next Step | Public-safe result education. |
| `/funding-paths.html` | Explains funding families without providers. | Explore Funding Paths | No provider names or apply links. |
| `/documents.html` | Document-prep checklist hub. | Prep My File | Guides applicants before review. |
| `/broker.html` | Broker-facing scorecard pitch. | Use the Scorecard | Public broker value page. |
| `/partners.html` | Partner/affiliate-safe landing page. | Explore Partner Fit | No commission or payout details. |
| `/white-label.html` | White-label embed packaging page. | Request White Label Info | Broker/agency packaging. |
| `/embed-example.html` | Demonstrates scorecard embed. | View Embed Demo | Uses safe iframe/widget guidance. |
| `/thank-you.html` | Post-submit confirmation page. | Review Next Steps | Sets expectations without promises. |
| `/not-ready.html` | Low-readiness nurture page. | Start Prep Path | Educational recovery path. |
| `/fundable-review.html` | Borderline/warm lead review page. | Request Human Review | Not an offer or decision. |
| `/highly-fundable.html` | High-readiness next step page. | Strategy Review | Still subject to review. |
| `/resources.html` | Resource index. | Use a Checklist | Connects docs, guides, FAQs, tools. |
| `/faq.html` | SEO-friendly questions. | Run the Scorecard | Uses public-safe disclaimers. |
| `/privacy.html` | Data-use and privacy page. | Review Scorecard | Trust page for lead capture. |
| `/terms.html` | Terms and disclaimers. | Back to Scorecard | Makes no funding promises. |

## Public data files

The `/site-data/**` folder contains browser-safe public data. Use it for navigation, CTAs, FAQ content, result-tier summaries, funding-path descriptions, checklists, resource library entries, lead magnets, embed presets, SEO metadata, and analytics event names.

Public data must not include:

- real provider names
- provider IDs
- affiliate URLs
- apply URLs
- commission data
- private contacts
- private notes
- routing secrets
- underwriting notes
- credentials
- real borrower PII

## Public config files

The `/config/**` folder is for public runtime or public build-time configuration. Each config should state its intended visibility:

```json
{
  "visibility": "public_runtime_browser_safe"
}
```

or:

```json
{
  "visibility": "public_build_time_only"
}
```

Do not use public config to hide sensitive logic. If something would be unsafe to expose in browser dev tools, it does not belong in `/config/**`.

## Internal-only files

The `/internal/**` folder is server-side only. It may describe internal routing, CRM stages, task templates, automation events, partner-fit rules, and service-offer packaging. It must still use dummy/demo-safe values only.

Every internal registry should include:

```json
{
  "visibility": "server_side_internal"
}
```

Browser-facing code must never fetch or import `/internal/**`.

## Schema files

Schemas live under `/schemas/**`.

- `/schemas/*.schema.json` validates JSON registries and configs.
- `/schemas/actions/*.openapi.yaml` defines Custom GPT and API action contracts.
- `/schemas/seo/*.schema.json` is reserved for SEO structured-data templates.

OpenAPI files should state auth model, public/internal status, sample requests, safe sample responses, and disclaimers.

## JavaScript files

Browser runtime files live in `/assets/js/**`. They must be vanilla JS modules and fail gracefully when optional JSON data is missing.

Node utility scripts live in `/scripts/**`. They should be opt-in and safe to run locally. Do not add deploy side effects.

Recommended syntax check:

```bash
find assets/js scripts -name "*.js" -print0 | xargs -0 -n1 node --check
```

PowerShell equivalent:

```powershell
Get-ChildItem assets/js,scripts -Filter *.js -Recurse | ForEach-Object { node --check $_.FullName }
```

## CSS and design files

Shared styles live under `/assets/css/**`. Design tokens and component registries live under `/design/**`.

Embed CSS should be scoped so partner sites do not get body-level style pollution. Print CSS should hide nav clutter, lead forms, and CTA sections.

## API route intent

API routes should support:

- scorecard submission
- public-safe funding path matching
- manual review requests
- document checklist retrieval
- resource recommendations
- admin/internal review flows, where explicitly marked not public

API responses must use readiness language, not final funding or lender decision language.

## Navigation policy

Until the `/site-data/navigation.json` renderer is fully wired, static pages may include hardcoded nav. Once the renderer is adopted, keep the route list centralized.

Primary links should generally include:

```txt
Home
Scorecard
Results
Funding Paths
Documents
Resources
FAQ
```

Broker/partner pages can add:

```txt
Broker
Partners
White Label
```

## Deployment policy

Do not change `vercel.json` unless explicitly authorized.

Default deployment posture:

```json
{
  "git": {
    "deploymentEnabled": {
      "main": false,
      "*": false
    }
  }
}
```

If a deployment window is authorized, open it intentionally, release, confirm production, and close it again. No sneaky deploy gremlins.
