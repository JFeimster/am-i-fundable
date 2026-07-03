# Jules Prompt — Batch 13 + Batch 14

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

- Batch 1–12 files should already exist.
- Do not change core app logic.
- Do not redesign frontend UI.
- Do not toggle `vercel.json`.
- Do not duplicate existing files.
- If a requested file already exists, improve it only if useful and safe.

## Goal

Create documentation and knowledge-support files for operating, embedding, testing, deploying, and reusing the Funding Readiness Scorecard.

## Create or Update These Files

### Batch 13 — Knowledge Base Support

```txt
/knowledge/README.md
/knowledge/funding/README.md
/knowledge/funding/index.json
/knowledge/funding/examples.md
/knowledge/automation/README.md
/knowledge/automation/index.json
/knowledge/crm/README.md
/knowledge/engineering-as-marketing/README.md
/knowledge/engineering-as-marketing/index.json
/knowledge/engineering-as-marketing/examples.md
```

### Batch 14 — Docs + Deployment

```txt
/docs/README.md
/docs/embed-instructions.md
/docs/compliance-guardrails.md
/docs/testing-checklist.md
/docs/deployment.md
/docs/vercel-env.md
/docs/naming-conventions.md
/docs/merge-readiness-checklist.md
```

## Rules

Keep documentation concise and operational.

Include:

- copy/paste embed instructions
- public-vs-internal data rules
- compliance-safe funding language
- no-guarantee disclaimers
- Vercel/static hosting deployment instructions
- current `vercel.json` deployment behavior
- testing checklist for widget, landing page, API routes, data boundaries, private data scan, and browser smoke tests

Do not include:

- secrets
- private provider URLs
- commissions
- provider contacts
- affiliate URLs
- raw apply URLs
- approval claims
- guaranteed funding claims
- final eligibility claims
- underwriting or rate promises

JSON knowledge index files must be valid JSON with two-space indentation.

## Validation

Run or confirm:

```bash
npm run validate
```

Also confirm:

- Markdown is readable.
- JSON files are valid.
- Private data scan passes.
- All referenced paths either exist or are clearly marked as planned.
- Docs do not contradict public/internal data boundaries.
- `vercel.json` remains unchanged.

## Output Required

Report:

- files created
- files updated
- files skipped because they already existed
- assumptions
- whether safe to proceed to Batch 15
