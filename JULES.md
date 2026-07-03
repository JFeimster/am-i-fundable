# JULES.md

## Project

Funding Readiness Scorecard / Am I Fundable

Repository:

```txt
https://github.com/JFeimster/am-i-fundable
```

Primary branch for this work:

```txt
codex/batch-1-7-integration
```

## Jules Role

Jules is responsible for creating and polishing documentation, knowledge files, workflow templates, nurture templates, optional ecosystem files, and support assets.

Jules should not perform broad frontend refactors unless explicitly instructed.

## Current Build Status

Completed before Jules work:

- Batch 1 — Data Boundaries + Compliance
- Batch 2 — Core Scoring Contract
- Batch 3 — Shared Score Engine
- Batch 4 — Internal Product/Provider Data
- Batch 5 — Public-Safe Product Data
- Batch 6 — Lead Capture + Intake Schema
- Batch 7 — API Routes
- Prompt 4 frontend/shared-engine audit passed with no required changes

Jules should focus on:

- Batch 11 — Result Content + Nurture Assets
- Batch 12 — Workflow Automations
- Batch 13 — Knowledge Base Support
- Batch 14 — Docs + Deployment
- Batch 16 — Optional Repo/Site Ecosystem Files

Batch 15 testing and final readiness review should be handled by Codex unless explicitly reassigned.

## Hard Safety Rules

Do not expose private or operational data in this public repo.

Never add:

- real affiliate URLs
- real apply URLs
- partner portal URLs
- provider contact emails
- commission rates
- payout terms
- private routing notes
- underwriting notes
- internal lender notes
- API keys
- tokens
- secrets
- webhook secrets
- raw CRM exports
- applicant PII

Use placeholders instead.

Approved placeholders:

```txt
https://example.com/placeholder
REDACTED_FOR_PUBLIC_REPO
null
Demo Provider 01
demo-provider-01
Removed from public repo. Store in private CRM or environment-managed source.
```

## Compliance Language Rules

Use language such as:

- funding readiness
- possible fit
- recommended path
- next step
- human review
- subject to review
- based on the information provided
- not an approval
- not a guarantee
- not a lending decision

Do not use:

- approved
- guaranteed
- you qualify
- instant approval
- final eligibility
- underwriting complete
- best rates guaranteed
- guaranteed funding
- no denial
- lender approved

## Frontend Rules

Do not redesign these files:

- `index.html`
- `styles.css`
- `script.js`
- `widget.html`
- `widget.css`
- `widget.js`
- `embed-example.html`

Do not change core scoring behavior unless specifically instructed.

Do not import `/internal` files into browser-facing code.

Browser-facing files may use:

- `/data/*.public.json`
- `/config/*.json`
- `/lib/*` if browser-safe

## API Rules

API routes may use internal demo fixtures server-side, but API responses must remain public-safe.

API responses must not expose:

- private provider data
- affiliate URLs
- apply URLs
- commission data
- contact emails
- internal notes
- hidden routing rules

## Vercel Rules

Do not toggle `vercel.json` unless explicitly instructed.

If documenting deployment, describe the current behavior rather than changing it.

## File Creation Rules

When creating files:

- Use exact requested paths.
- Do not duplicate existing files.
- If a file exists, improve it only if useful and safe.
- JSON must use two-space indentation.
- Markdown should be concise and operational.
- Workflow files must use placeholders, not secrets.
- Optional files should be clearly marked optional or experimental where appropriate.

## Validation Jules Should Run or Request

At minimum, Jules should check:

```bash
npm run validate
```

Where applicable, also confirm:

- JSON files are valid.
- Markdown files are readable.
- n8n workflow JSON is valid.
- No approval or guarantee language was introduced.
- No private provider data was introduced.
- `vercel.json` was not changed.

## Done Means

A Jules task is done when:

1. Requested files are created or safely updated.
2. Existing files are not duplicated.
3. Public/private data boundaries are preserved.
4. Compliance language is safe.
5. Validation passes or issues are clearly reported.
6. Jules reports:
   - files created
   - files updated
   - files skipped
   - validation results
   - assumptions
   - next recommended batch
