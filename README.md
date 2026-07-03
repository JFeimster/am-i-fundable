# Am I Fundable — Funding Readiness Scorecard

Public-safe funding-readiness scorecard, embed widget, API source layer, and broker/CRM routing foundation for the **Am I Fundable / Funding Readiness Scorecard** project.

Production:

```txt
https://am-i-fundable.vercel.app/
```

Repository:

```txt
https://github.com/JFeimster/am-i-fundable
```

The product answers one practical question:

> Based on my current revenue, time in business, credit band, banking activity, business setup, funding purpose, and caution flags, what funding path should I prepare for next?

This is **not** a lender, underwriting engine, credit-repair service, eligibility decision, or approval engine. It is a readiness, routing, education, intake, and review layer.

---

## Operating status

Current verified state as of **2026-07-03**:

- Batch 1–10 foundation has been merged: scorecard foundation, shared scoring logic, APIs, action schema, config registry, embed config, and private-data guardrails.
- Batch 11–12 assets have been merged: result assets, nurture assets, workflow templates, and human-review templates.
- API backlog batches **API-7 through API-13** have been uploaded and checked for file presence.
- Vercel static deployment has been repaired so the build no longer deletes `/api` from the workspace.
- `vercel.json` is locked down by default: `main: false` and `*: false`.
- Latest verified Vercel production deployment is `READY`.

### Verified API backlog batches

| Batch | Scope | Presence status |
| --- | --- | --- |
| API-7 | Remaining public / namespaced API routes | 13/13 present |
| API-8 | Internal / admin API routes | 10/10 present |
| API-9 | API registries + YAML configs | 15/15 present |
| API-10 | Remaining API + registry schemas | 17/17 present |
| API-11 | Remaining docs + examples | 24/24 present |
| API-12 | API console / demo HTML | 10/10 present |
| API-13 | Remaining tests + generator scripts | 9/9 present |

### Patch branch note

A branch or PR literally named `patch-20260703` was not found during review. The relevant July 3 deployment-repair work appears to be merged into `main`, especially PR #7: **Fix static Vercel deploy without deleting API routes**.

---

## Strategic purpose

```txt
Free scorecard
→ lead capture
→ funding-readiness result
→ recommended next step
→ human review
→ funding path / prep workflow / nurture sequence
→ broker or partner follow-up
```

The system should stay small, sharp, and useful. The goal is not to build a bloated SaaS cathedral. The goal is to turn a funding question into a clean lead, a safe recommendation, and a follow-up path that can make money without pretending to be underwriting. 🧨

---

## Product boundaries

### Allowed

- Funding-readiness education
- Scorecard-based intake
- Public-safe funding path recommendations
- Document preparation guidance
- Manual review routing
- Lead-priority classification
- Broker/agency workflow support
- Public GPT action scaffolding
- Static examples and fallback data
- Server-side registry, matching, and admin source files

### Not allowed

- Approval claims
- Guaranteed funding claims
- Final eligibility claims
- Underwriting decisions
- Lender-specific approval predictions
- Hidden provider routing exposed in browser files
- Affiliate/apply links in public runtime files
- Commission data in public files
- Real borrower or partner PII in the repo
- Credit-repair positioning

Use language like:

- “funding readiness”
- “potential funding path”
- “may be a fit”
- “based on your answers”
- “recommended next step”
- “subject to review”
- “not an approval, offer, or guarantee of funding”

Avoid language like:

- “approved”
- “guaranteed”
- “qualified”
- “underwritten”
- “best lender”
- “instant approval”
- “no-risk funding”
- “fix your credit”

---

## Repo architecture

```txt
/
├── api/                         # Vercel/serverless API source routes
│   ├── admin/                   # Internal/admin-only route source
│   ├── leads/                   # Lead create/update/route source
│   ├── match/                   # Funding path and partner-fit source
│   ├── public/                  # Public-safe API source
│   ├── scorecard/               # Scorecard session/submission/report source
│   └── webhooks/                # Webhook receiver/source routes
├── assets/                      # Public static assets
├── config/                      # Public/build-time config and API registries
├── data/                        # Browser-safe generated/public data
├── docs/                        # Implementation docs, API docs, environment notes
├── examples/                    # Public-safe examples and demos
├── internal/                    # Internal-only routing, provider, CRM, partner files
├── lib/                         # Shared scoring, validation, API, matching logic
├── portfolio/                   # Packaging assets for portfolio/Gem/GPT reuse
├── schemas/                     # OpenAPI, JSON schemas, validation schemas
├── scripts/                     # Build, validation, generation, private-data scan scripts
├── site-data/                   # Static fallback data for tags, categories, agents
├── skills/                      # Reusable skill packs
├── tests/                       # Node test files and fixtures
├── workflows/                   # Automation workflow templates
├── index.html                   # Public landing page / scorecard surface
├── embed.html                   # Embeddable widget surface
├── package.json                 # Minimal Node scripts
└── vercel.json                  # Vercel build + deployment controls
```

---

## Core runtime/source layers

### Public site and widget

Primary browser surfaces:

```txt
index.html
scorecard.html
results.html
embed.html
embed-example.html
styles.css
script.js
assets/**
site-data/**
```

These files should stay public-safe. No secrets, provider-specific routing, partner contacts, private apply URLs, commissions, or real applicant data.

### Scorecard engine

```txt
lib/scorecard-engine.js
lib/validation.js
lib/recommendation-engine.js
```

Core outputs include:

- score
- tier
- lead priority
- primary funding family
- secondary funding families
- recommendation cards
- strengths
- risks
- next steps
- recommended documents
- manual-review recommendation

### Partner and routing layer

```txt
lib/partner-match-engine.js
internal/**
config/api/**
```

This layer can support internal routing, provider/product fit logic, and CRM automation — but browser output must remain sanitized. The browser should never receive private provider names, apply URLs, commissions, partner contacts, routing notes, or underwriting notes.

---

## API source map

The repo now contains a larger API source surface than the original MVP. Treat API files as **source routes** and keep public/runtime exposure intentional.

### Baseline/public routes

```txt
GET  /api/health
GET  /api/version
POST /api/submit-score
POST /api/match-partners
POST /api/lender-match-review
```

### Public / namespaced routes

```txt
/api/public/**
/api/scorecard/**
/api/match/**
/api/leads/**
/api/webhooks/**
```

Use these for public-safe metadata, scorecard sessions, score submission, public funding path output, review requests, lead routing events, and webhook handoff patterns.

### Internal / admin routes

```txt
/api/admin/**
```

Admin routes must remain protected. The current admin route pattern is disabled by default and expects protected environment variables before use.

Admin variables:

```txt
AM_I_FUNDABLE_ENABLE_ADMIN_ROUTES=true
AM_I_FUNDABLE_ADMIN_TOKEN=<secret value in Vercel only>
AM_I_FUNDABLE_ADMIN_ORIGIN=https://your-admin-host.example
```

Do **not** expose admin endpoints in public GPT actions, browser widgets, static demos, public docs, or affiliate-facing examples unless they are explicitly mocked/sanitized.

---

## Public vs internal data rules

### Public-safe

These may be used by browser code, static pages, public examples, docs, or public GPT action schemas after review:

```txt
data/**
site-data/**
examples/**
schemas/**
config/embed.config.json
```

Public-safe files may contain:

- educational content
- result labels
- generic funding path names
- static metadata
- public-safe schemas
- demo-only examples
- non-sensitive category/tag data

### Internal-only

These should not be imported directly by browser code:

```txt
internal/**
workflows/**
api/admin/**
```

Internal files may include:

- provider/product fit rules
- routing logic
- CRM mapping
- manual review rules
- partner tool metadata
- automation specs
- server-side registries

Internal files must still avoid real secrets, real borrower PII, private partner contacts, and production credentials.

---

## Vercel deployment policy

The project is configured to prevent deployment roulette. No more “every branch push becomes a Vercel slot machine” nonsense. 🎰🔥

Current `vercel.json` policy:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "ignoreCommand": "node scripts/vercel-ignore-preview.js",
  "git": {
    "deploymentEnabled": {
      "main": false,
      "*": false
    }
  }
}
```

Meaning:

- pushes to `main` should not automatically deploy production
- pushes to feature branches should not automatically deploy previews
- `scripts/vercel-ignore-preview.js` hard-ignores non-`main` builds if Vercel still attempts a preview
- production should only be enabled during a controlled release window

### Controlled production release window

When ready to deploy production:

1. Temporarily change `main` to `true`.
2. Keep `*` as `false` unless there is a specific preview reason.
3. Push or merge the intended production commit.
4. Confirm Vercel production reaches `READY`.
5. Change `main` back to `false` immediately.

Recommended deployment window config:

```json
"deploymentEnabled": {
  "main": true,
  "*": false
}
```

Default locked config:

```json
"deploymentEnabled": {
  "main": false,
  "*": false
}
```

---

## Build and validation commands

The repo is static-first and Node-script-based.

Install dependencies if needed:

```bash
npm install
```

Build static deployment output:

```bash
npm run build
```

Run full validation:

```bash
npm run validate
```

Individual checks:

```bash
npm run validate:json
npm run validate:js
npm run scan:private-data
```

Current `package.json` scripts:

```json
{
  "build": "node scripts/build-static-dist.js",
  "sanitize:private-data": "node scripts/sanitize-private-data.js",
  "scan:private-data": "node scripts/scan-private-data.js",
  "validate:json": "node scripts/validate-json.js",
  "validate:js": "node scripts/validate-js-syntax.js",
  "validate": "npm run validate:json && npm run validate:js && npm run scan:private-data"
}
```

Do not rely on `npm test` until a `test` script is explicitly added to `package.json`.

---

## Environment variables

Never commit real values. Configure runtime secrets in Vercel Project Settings or another protected secret store.

### Active / currently referenced variables

| Variable | Status | Purpose |
| --- | --- | --- |
| `SCORECARD_ALLOWED_ORIGIN` | Active | Restricts allowed browser/embed/API origin. Defaults to `*` when unset. |
| `N8N_SCORECARD_WEBHOOK_URL` | Active | Optional webhook destination for `/api/submit-score` lead payloads. |
| `AM_I_FUNDABLE_ENABLE_ADMIN_ROUTES` | Active | Enables internal/admin-only route handlers when set to `true`. Default is disabled. |
| `AM_I_FUNDABLE_ADMIN_TOKEN` | Active | Shared admin token expected in protected admin requests. Must never be public. |
| `AM_I_FUNDABLE_ADMIN_ORIGIN` | Active | CORS origin for admin routes. Defaults to `null` when unset. |

### Recommended future integration variables

These have current repo context or comments but should stay unset until the matching integration is actually wired server-side:

| Variable | Recommended use |
| --- | --- |
| `HUBSPOT_PRIVATE_APP_TOKEN` | Direct HubSpot CRM handoff using the internal HubSpot field map. |
| `NOTION_TOKEN` | Notion integration for funding pipeline or review database writes. |
| `NOTION_FUNDING_PIPELINE_DATABASE_ID` | Target Notion database for scorecard lead/review records. |
| `AIRTABLE_API_KEY` | Optional Airtable routing or lead-table handoff. |
| `AIRTABLE_BASE_ID` | Optional Airtable base target. Add only if Airtable becomes active. |
| `AIRTABLE_LEADS_TABLE_ID` | Optional Airtable leads table target. Add only if Airtable becomes active. |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | Optional Google Sheets/Workspace handoff. Keep as protected secret JSON only. |
| `MAKE_SCORECARD_WEBHOOK_URL` | Optional Make.com webhook if Make is used instead of or alongside n8n. |

### Environment rules

- Never commit `.env`.
- Never commit production tokens.
- Never put secrets in browser files.
- Never expose provider credentials in public registries.
- Never expose private apply links, commission fields, or partner contacts in public runtime output.
- Prefer one integration path at a time. n8n/Make/HubSpot/Notion spaghetti is how clean funnels become haunted houses.

---

## OpenAPI and GPT action guidance

Public GPT actions should use only public-safe or intentionally sanitized routes.

Good candidates:

```txt
GET  /api/health
GET  /api/version
GET  /api/public/funding-paths
GET  /api/public/result-tier
GET  /api/public/document-checklist
GET  /api/public/resource-recommendations
POST /api/scorecard/submit-score
POST /api/scorecard/request-review
POST /api/match/funding-paths
```

Do not publish admin actions unless they are private, protected, and intentionally scoped for an internal operator GPT.

---

## Manual review rules

Recommend human review when:

- score is low or borderline
- red flags exist
- requested funding amount is high relative to monthly revenue
- bank activity is thin or inconsistent
- business setup is incomplete
- the applicant’s goal needs context before recommending a funding path
- the output could be misread as a lending decision

Safe language:

```txt
A funding strategist should review your scorecard, documents, and stated funding purpose before recommending a path.
```

Unsafe language:

```txt
You are approved.
You qualify.
You are eligible.
A lender will fund this.
```

---

## Security and compliance checklist

Before publishing, merging, or deploying:

- [ ] No secrets committed.
- [ ] No real borrower data committed.
- [ ] No private partner contacts committed.
- [ ] No affiliate/apply URLs in public runtime files.
- [ ] No commission data in public files.
- [ ] No underwriting claims.
- [ ] No approval/guarantee language.
- [ ] JSON files parse.
- [ ] JS files pass syntax check.
- [ ] Private-data scan passes.
- [ ] Public examples are demo-only.
- [ ] API responses return public-safe output.
- [ ] Admin routes are disabled unless intentionally protected.
- [ ] `vercel.json` deployment setting matches the current release intent.

---

## Strategic roadmap

### Near-term

- Keep Vercel auto-deploys disabled unless intentionally opening production.
- Run `npm run validate` after repo patches.
- Review public/private data boundary after every API or registry batch.
- Add or confirm a `test` script only when the current test set is ready to run cleanly.
- Keep API docs and OpenAPI schemas aligned with route source files.

### Next monetizable layer

- Package the scorecard as a lead magnet.
- Connect score submission to one CRM/automation queue first.
- Create broker-facing review workflow.
- Add downloadable readiness report output.
- Create public-safe GPT action integration.
- Add white-label embed instructions.

### Later platform layer

- Multi-product funding matrix
- Broker/affiliate routing layer
- Partner marketplace view
- Lead quality scoring
- Renewal and reactivation flows
- Public engineering-as-marketing tool directory
- Private funding ops console

---

## Maintainer notes

Keep the system **static-first, API-light, registry-driven, and revenue-oriented**.

The operating loop is:

```txt
score → route → review → follow-up → offer path
```

Not:

```txt
install 47 packages → fight deployment gremlins → discover React hydration as a lifestyle disease
```

Small. Sharp. Useful. That is the win condition.