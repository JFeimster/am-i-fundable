# Am I Fundable — Funding Readiness Scorecard

A public-safe funding readiness tool for entrepreneurs, brokers, and funding partners.

The project helps a business owner answer one practical question:

> “Based on my current revenue, time in business, credit band, banking activity, business setup, funding purpose, and caution flags, what funding path should I prepare for next?”

It is **not** a lender, underwriting engine, credit repair service, or approval decision system. It is a readiness, routing, education, and intake layer.

Production site:

```txt
https://am-i-fundable.vercel.app/
```

Repository:

```txt
https://github.com/JFeimster/am-i-fundable
```

---

## What this repo is

This repo powers the **Am I Fundable / Funding Readiness Scorecard** ecosystem:

- public landing page and embeddable scorecard widget
- shared funding readiness scoring engine
- browser-safe result content
- server-side API endpoints for score submission and funding-path review
- internal-only product/provider/routing registries
- public-safe config, schemas, GPT action files, and agent documentation
- workflow templates for CRM, automation, nurture, and human review
- testing, validation, and optional ecosystem files for future packaging

The strategic purpose is simple:

```txt
Free scorecard
→ lead capture
→ funding-readiness result
→ recommended next step
→ human review
→ matched funding path / prep workflow / nurture sequence
```

---

## Current build status

Core MVP layers already exist or are being expanded through batch-based repo execution.

### Completed / merged foundation

- Batch 1–10: scorecard foundation, shared engine, APIs, registry/config layers, GPT action schema, embed config, private-data guardrails.
- Batch 11–12: scorecard result assets, nurture assets, workflow templates, and human review templates.
- Server-side score submission patch: `/api/submit-score.js` recomputes the score from submitted `answers` and does **not** trust browser-submitted score results.
- Vercel deployment automation is intentionally disabled by default in `vercel.json` so preview and production deployments do not fire on every Git push.

### In progress / optional expansion

- Prompt 8 / Jules batches may add more product, workflow, or site ecosystem files.
- Batch 15 adds testing and registry validation support.
- Batch 16 adds optional schemas, registries, fallback site data, skills, examples, and portfolio packaging.

---

## Product boundaries

This project must stay inside these lanes:

### Allowed

- funding readiness education
- scorecard-based intake
- public-safe funding path recommendations
- document preparation guidance
- manual review routing
- lead-priority classification
- broker/agency workflow support
- public GPT action scaffolding
- static examples and fallback data

### Not allowed

- approval claims
- guaranteed funding claims
- final eligibility claims
- underwriting decisions
- lender-specific approval predictions
- hidden provider routing exposed in the browser
- affiliate/apply links in public runtime files
- commission data in public files
- real borrower or partner PII in the repo
- credit repair positioning

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

## High-level architecture

```txt
/
├── api/                         # Vercel serverless API routes
├── config/                      # Public/build-time config and control registries
├── data/                        # Browser-safe generated/public data
├── docs/                        # Documentation and implementation notes
├── examples/                    # Public-safe examples and demos
├── internal/                    # Internal-only routing, provider, partner, and tool files
├── lib/                         # Shared scoring, validation, recommendation, and matching logic
├── portfolio/                   # Portfolio/Gemini Gem packaging assets
├── schemas/                     # OpenAPI, JSON schemas, and validation schemas
├── scripts/                     # Validation, private-data scan, registry transform scripts
├── site-data/                   # Static fallback data for categories, tags, and agents
├── skills/                      # Reusable skill packs for safety, schema, and workflow generation
├── tests/                       # Node test files and fixtures
├── workflows/                   # Automation workflow templates
├── index.html                   # Public landing page / scorecard surface
├── embed.html                   # Embeddable widget surface
├── package.json                 # Validation scripts
└── vercel.json                  # Vercel deployment controls
```

---

## Core runtime files

### Scorecard engine

```txt
/lib/scorecard-engine.js
```

Calculates the funding readiness score from normalized answers.

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

### Validation layer

```txt
/lib/validation.js
```

Normalizes and validates applicant answers before scoring or submission.

Required scorecard answer fields include:

- `businessPersona`
- `monthlyRevenue`
- `timeInBusinessMonths`
- `creditScore`
- `bankStatus`
- `businessStructure`
- `fundingPurpose`
- `desiredFundingAmount`
- `redFlags`

### Recommendation layer

```txt
/lib/recommendation-engine.js
```

Maps scorecard answers and risk signals into public-safe funding families.

Example public funding families:

- Fast Working Capital
- Revenue-Based Funding
- Business Line of Credit
- Structured Growth Capital
- Startup / Credit-Leverage Funding
- Equipment / Truck / Asset-Backed Funding
- Real Estate / Asset-Secured Capital
- Ecommerce / Marketplace Seller Capital
- Business Credit Builder / Funding Prep
- Manual Funding Strategy Review

### Partner match layer

```txt
/lib/partner-match-engine.js
```

Matches applicant profile data against internal provider/product registries and returns public-safe recommendations.

The browser should never receive private provider names, apply URLs, commissions, partner contacts, routing notes, or underwriting notes.

---

## API routes

All API routes are designed for Vercel serverless functions.

### `GET /api/health`

Basic health check endpoint.

Expected purpose:

- confirm API availability
- confirm deployment sanity
- simple monitoring ping

### `POST /api/submit-score`

Receives applicant contact details and scorecard answers.

Important security behavior:

- score is recomputed server-side from `answers`
- browser-submitted score results are ignored
- response returns only public-safe result fields
- optional webhook handoff may occur through `N8N_SCORECARD_WEBHOOK_URL`

Example request:

```json
{
  "source": "Funding Readiness Scorecard",
  "applicant": {
    "firstName": "Demo",
    "lastName": "Owner",
    "email": "demo@example.com",
    "phone": "5555555555",
    "businessName": "Demo Business LLC",
    "state": "DC",
    "consent": true
  },
  "answers": {
    "businessPersona": "local_service_business",
    "monthlyRevenue": 25000,
    "timeInBusinessMonths": 18,
    "creditScore": 665,
    "bankStatus": "consistent",
    "businessStructure": "entity_with_bank",
    "fundingPurpose": "working_capital",
    "desiredFundingAmount": 50000,
    "redFlags": ["none"]
  }
}
```

Example public response shape:

```json
{
  "ok": true,
  "message": "Score received for review. This is not an approval, offer, or guarantee of funding.",
  "leadId": "frs_0000000000000",
  "publicResult": {
    "score": 74,
    "tier": {
      "id": "fundable_review",
      "label": "Fundable, But Needs Review"
    },
    "primaryFundingFamily": "Fast Working Capital",
    "leadPriority": "warm",
    "manualReviewRecommended": true
  }
}
```

### `POST /api/match-partners`

Runs server-side funding-path matching against internal registries.

Important security behavior:

- internal provider/product registry data remains server-side
- public response omits provider names, apply URLs, affiliate links, commissions, and contacts
- recommendations are funding-path oriented, not lender-specific approval promises

Example request:

```json
{
  "applicant": {
    "businessPersona": "ecommerce_seller",
    "monthlyRevenue": 45000,
    "timeInBusinessMonths": 14,
    "creditScore": 640,
    "bankStatus": "consistent",
    "businessStructure": "entity_bank_ein_clean",
    "fundingPurpose": "ecommerce_growth",
    "desiredFundingAmount": 75000,
    "redFlags": ["none"]
  }
}
```

Example public response shape:

```json
{
  "ok": true,
  "message": "Potential funding paths generated for review. This is not an approval, offer, or guarantee of funding.",
  "humanReviewRequired": true,
  "recommendations": [
    {
      "fundingFamily": "Ecommerce / Marketplace Seller Capital",
      "summary": "Potential path for platform sellers with marketplace or store sales history.",
      "nextStep": "Prepare marketplace sales reports or platform access details."
    }
  ],
  "internalMatchCount": 3
}
```

### `POST /api/lender-match-review`

Queues a human-review-first request.

This endpoint exists for cases where automated product matching should stop and route to a human strategist before any funding path is finalized.

Example use cases:

- red flags are present
- score is below review threshold
- desired funding amount is high relative to revenue
- applicant has complex funding purpose
- partner/provider-specific routing must remain internal

---

## Public vs internal data rules

This repo is intentionally split between public-safe files and internal-only files.

### Public-safe

These may be used by the browser, examples, docs, static pages, or public GPT actions when reviewed:

```txt
/data/**
/site-data/**
/examples/**
/schemas/**
/config/embed.config.json
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
/internal/**
/workflows/**
/api/**
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

The repo is configured to prevent automatic deployment churn.

Default `vercel.json` policy:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "git": {
    "deploymentEnabled": {
      "main": false,
      "*": false
    }
  }
}
```

Meaning:

- pushes to `main` do **not** automatically deploy production
- pushes to feature branches do **not** automatically deploy previews
- deployments should be manually enabled only during controlled release windows

When you want deployment automation temporarily enabled, change:

```json
"main": true,
"*": true
```

Then change it back after the deployment window closes.

---

## Environment variables

Optional future environment variables:

```txt
SCORECARD_ALLOWED_ORIGIN=
N8N_SCORECARD_WEBHOOK_URL=
HUBSPOT_PRIVATE_APP_TOKEN=
NOTION_TOKEN=
NOTION_FUNDING_PIPELINE_DATABASE_ID=
AIRTABLE_API_KEY=
GOOGLE_SERVICE_ACCOUNT_JSON=
```

Rules:

- never commit real values
- never commit `.env`
- never put secrets in browser files
- never expose provider credentials in public registries
- prefer Vercel environment variables for runtime secrets

---

## Validation commands

Install is minimal because the repo is static-first and Node-script-based.

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

Expected validation coverage:

- JSON parse validation
- JavaScript syntax validation
- private-data scan
- browser/public data boundary review

Batch 15 may add more direct test commands for scorecard logic, partner matching, and registry integrity.

Suggested future scripts:

```json
{
  "test": "node --test",
  "validate:registry": "node scripts/validate-product-registry.js",
  "validate:all": "npm run validate && npm run validate:registry && npm test"
}
```

---

## Testing strategy

Testing should focus on the money-making and trust-protecting parts first.

### Scorecard engine tests

Target file:

```txt
/tests/scorecard-engine.test.js
```

Should verify:

- hot lead fixture produces a hot/high score result
- warm lead fixture produces review-friendly result
- nurture lead fixture produces prep/review result
- not-ready lead fixture does not produce approval-style output
- red flags trigger penalties and/or manual review
- invalid answers fail validation

### Partner match tests

Target file:

```txt
/tests/partner-match-engine.test.js
```

Should verify:

- public response does not expose private provider fields
- matches return funding families instead of lender approval promises
- red-flagged applicants route toward manual review
- max match count is enforced
- missing provider/product data fails gracefully

### Product registry integrity tests

Target files:

```txt
/scripts/validate-product-registry.js
/tests/product-registry-integrity.test.js
```

Should verify:

- product IDs are unique
- required fields exist
- visibility classes are respected
- internal-only fields do not leak into public-safe registries
- registry entries map cleanly to schemas

---

## Batch 15 file map — testing and validation

Batch 15 adds test and validation infrastructure.

```txt
/scripts/validate-product-registry.js
/tests/scorecard-engine.test.js
/tests/partner-match-engine.test.js
/tests/product-registry-integrity.test.js
/tests/fixtures/hot-lead.json
/tests/fixtures/warm-lead.json
/tests/fixtures/nurture-lead.json
/tests/fixtures/not-ready-lead.json
```

Purpose:

- keep the scorecard honest
- prevent accidental public/private data leaks
- validate product registries before they become automation inputs
- catch scoring regressions before deployment

---

## Batch 16 file map — optional ecosystem files

Batch 16 adds optional repo/site ecosystem files.

```txt
/schemas/public-product.schema.json
/schemas/funding-product.schema.json
/schemas/vercel-project.schema.json
/schemas/agent.schema.json
/schemas/custom-gpt.schema.json
/config/eam-tools.registry.json
/internal/tools/funding-tools.registry.json
/internal/partners/embed-partners.json
/site-data/tags.json
/site-data/categories.json
/site-data/agents.fallback.json
/skills/funding-language-safety-review/SKILL.md
/skills/schema-starter-builder/SKILL.md
/skills/automation-workflow-spec-writer/SKILL.md
/examples/funding/README.md
/examples/funding/funding-kb.html
/portfolio/gemini-gems/funding-readiness-helper.md
```

Purpose:

- support future engineering-as-marketing tool directories
- provide reusable schemas for public products, funding products, agents, GPTs, and Vercel projects
- create fallback data for static pages
- package reusable skills for language safety, schema creation, and automation specs
- add example funding knowledge-base assets
- prepare the Funding Readiness Helper as a Gemini Gem / portfolio asset

Internal-only Batch 16 files:

```txt
/internal/tools/funding-tools.registry.json
/internal/partners/embed-partners.json
```

These should not be served publicly unless filtered, sanitized, or transformed.

---

## Recommended contribution workflow

Use short-lived branches and PRs.

Preferred pattern:

```txt
codex/batch-name
jules/batch-name
fix/specific-bug
docs/readme-refresh
```

Before merge:

```bash
npm run validate
```

For batches that add tests:

```bash
npm test
```

For batches that alter registry logic:

```bash
node scripts/validate-product-registry.js
```

Do not flip `vercel.json` deployment settings unless intentionally opening a deployment window.

---

## Manual review rules

The tool should recommend human review when:

- score is low or borderline
- red flags exist
- requested funding amount is high relative to monthly revenue
- bank activity is thin or inconsistent
- business setup is incomplete
- the applicant’s goal needs context before recommending a funding path
- the output could be misread as a lending decision

Manual review language should say:

```txt
A funding strategist should review your scorecard, documents, and stated funding purpose before recommending a path.
```

Not:

```txt
You are approved.
You qualify.
You are eligible.
A lender will fund this.
```

---

## Public copy principles

Use the scorecard to build trust, not fake certainty.

Good copy:

```txt
Your answers suggest you may be closest to a working-capital review path.
```

```txt
Your current profile may need prep work before a funding review.
```

```txt
This result is designed to show your likely next step, not guarantee an outcome.
```

Bad copy:

```txt
You qualify for $50,000.
```

```txt
You are approved.
```

```txt
We found your lender.
```

```txt
Guaranteed funding available now.
```

---

## Strategic roadmap

### Near-term

- complete Prompt 8 / current Jules batch
- add Batch 15 testing and validation files
- add Batch 16 optional ecosystem files
- run validation
- review public/private data exposure
- keep Vercel auto-deploys disabled until controlled release

### Next monetizable layer

- package scorecard as a lead magnet
- connect score submission to CRM or automation queue
- create broker-facing intake dashboard
- create partner-safe funding path registry
- add downloadable readiness report
- create custom GPT action integration
- add white-label embed instructions

### Later platform layer

- multi-product funding matrix
- broker/affiliate routing layer
- partner marketplace view
- lead quality scoring
- renewal and reactivation flows
- public engineering-as-marketing tool directory
- private funding ops console

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
- [ ] `npm run validate` passes.
- [ ] JSON files parse.
- [ ] JS files pass syntax check.
- [ ] Public examples are demo-only.
- [ ] API responses return public-safe output.
- [ ] `vercel.json` deployment setting matches the current release intent.

---

## Maintainer notes

This repo should stay **static-first, API-light, and registry-driven**.

Avoid turning it into a bloated framework project unless there is a clear revenue reason. The whole point is speed:

```txt
score → route → review → follow-up → offer path
```

Not:

```txt
install 47 packages → fight hydration errors → question your life choices
```

Keep the system small, sharp, and useful.
