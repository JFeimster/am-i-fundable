# Jules Prompt — Batch 11 + Batch 12

You are working in the GitHub repo:

```txt
https://github.com/JFeimster/am-i-fundable
```

Tool:

```txt
Jules
```

Project:

```txt
Funding Readiness Scorecard / Am I Fundable
```

## Current Status

- Batch 1–10 files should already exist.
- Do not change core scoring logic.
- Do not redesign frontend UI.
- Do not toggle `vercel.json`.
- Do not duplicate existing files.
- If a requested file already exists, improve it only if useful and safe.

## Goal

Create result content, nurture assets, workflow automation templates, and internal review templates.

## Create or Update These Files

### Batch 11 — Result Content + Nurture Assets

```txt
/data/funding-documents.public.json
/data/scorecard-copy.public.json
/data/faqs.public.json
/data/lead-magnets.public.json
/data/tools.public.json
/data/funding-calculators.public.json
/data/affiliate-funding-gpts.public.json
/data/digital-products.public.json
/templates/applicant-result-email.md
/templates/funding-prep-checklist.md
```

### Batch 12 — Workflow Automations

```txt
/workflows/n8n/funding-readiness-scorecard.n8n.json
/workflows/make/funding-readiness-scorecard-make.md
/workflows/zapier/funding-readiness-scorecard-zapier.md
/templates/internal-score-alert.md
/templates/human-review-task.md
```

## Rules

All public data files must be browser-safe.

Do not include:

- private provider names
- affiliate URLs
- apply URLs
- commissions
- contact emails
- private notes
- internal routing secrets
- API keys
- tokens
- webhook secrets
- applicant PII

The n8n workflow should be a safe starter template, not a production-secret workflow.

Use placeholder webhook URLs and environment variable placeholders only.

Applicant email must not say:

- approved
- guaranteed
- qualified
- instant approval
- final eligibility
- underwriting
- rates

Internal alert and human-review templates should be human-review-first.

Prep checklist should be useful for low-score and mid-score users.

FAQ language must be compliance-safe and no-guarantee.

Related tools, GPTs, and products should be framed as optional next steps, not guaranteed outcomes.

## Use These Scorecard Fields Where Applicable

```txt
name
email
phone
businessName
state
monthlyRevenue
timeInBusiness
creditScore
fundingPurpose
desiredFundingAmount
redFlags
fundingReadinessScore
scoreTier
primaryFundingFamily
leadPriority
```

## Validation

Run or confirm:

```bash
npm run validate
```

Also confirm:

- JSON validation passes.
- Markdown files are readable.
- n8n JSON is valid JSON.
- Private data scan passes.
- No approval/guarantee language was introduced.
- API route docs/templates align with existing `/api` files.
- `vercel.json` remains unchanged.

## Output Required

Report:

- files created
- files updated
- files skipped because they already existed
- summary of intended workflows
- remaining production setup steps
- whether safe to proceed to Batch 13/14
