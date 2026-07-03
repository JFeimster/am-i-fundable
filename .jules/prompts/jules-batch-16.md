# Jules Prompt — Batch 16 Optional Ecosystem Files

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

- Batch 1–15 files should already exist.
- Core MVP is complete or near complete.
- This task is for optional ecosystem, indexing, skill, schema, and portfolio support files.
- Do not redesign frontend UI.
- Do not change core scoring behavior.
- Do not toggle `vercel.json`.
- Do not duplicate existing files.
- If a requested file already exists, improve it only if useful and safe.

## Goal

Create optional support/ecosystem files for indexing, schema reuse, skill packaging, example pages, fallback agent data, and portfolio packaging.

## Create or Update These Files

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

## Rules

Mark optional or experimental files clearly where appropriate.

Keep files useful, not decorative.

Skill files should include:

- purpose
- when to use
- inputs
- procedure
- guardrails
- validation checklist
- done means

Example HTML should be static, public-safe, and must not expose private provider data.

Fallback agent/site data must be public-safe.

Internal optional files must not include:

- private provider URLs
- affiliate links
- apply URLs
- commissions
- contacts
- secrets
- routing notes
- underwriting notes

Do not claim:

- approval
- guaranteed funding
- final eligibility
- underwriting
- rates

## Validation

Run or confirm:

```bash
npm run validate
```

Also confirm:

- JSON validation passes.
- Markdown is readable.
- HTML is valid enough for static use.
- Private data scan passes.
- No frontend regression.
- `vercel.json` remains unchanged.

## Output Required

Report:

- files created
- files updated
- files skipped because they already existed
- what each optional group enables
- any files that should remain internal-only
- final readiness recommendation
