<!--
Am I Fundable / Funding Readiness Scorecard
Visibility: public_repo_operational_doc
Safety: public-safe; no provider names, provider IDs, affiliate/apply URLs, commissions, private contacts, routing secrets, underwriting notes, credentials, or real borrower PII.
Deployment: do not change vercel.json unless explicitly authorized.
-->
# Codex Runbook

This runbook explains how Codex should patch, generate, validate, and package files for the Am I Fundable / Funding Readiness Scorecard repo.

Codex should behave like a precise repo mechanic, not a caffeinated squirrel with write access.

## Default task behavior

When given a batch:

1. Read the batch scope.
2. Inspect related existing files.
3. Create only approved files.
4. Preserve repo-relative paths.
5. Keep static-first architecture.
6. Avoid unnecessary dependencies.
7. Validate files locally.
8. Summarize exactly what changed.

## Static-first constraints

Use:

- plain HTML
- CSS
- vanilla JS
- JSON
- YAML/OpenAPI
- Markdown
- small Node scripts only when explicitly listed

Do not introduce:

- React
- Next.js
- build steps
- unnecessary packages
- deployment automation
- secret-dependent code
- framework migrations

## Public/private boundary

Browser-facing code may use:

```txt
/site-data/**
/config/** if public-safe
/assets/js/**
/assets/css/**
/schemas/actions/** when public
/examples/**
```

Browser-facing code must not use:

```txt
/internal/**
/private/**
/secrets/**
server-only configs
real provider data
```

## Patch strategy

Prefer small, direct changes.

For new files:

- use repo style
- include real utility
- include safe disclaimers where relevant
- avoid placeholder text
- avoid invented providers
- avoid hardcoded private URLs

For existing files:

- patch narrowly
- do not rewrite unrelated sections
- preserve working behavior
- do not touch `vercel.json` unless authorized

## Validation commands

### JSON

```bash
find . -name "*.json" -not -path "./node_modules/*" -print0 | xargs -0 -n1 python -m json.tool > /dev/null
```

### JavaScript

```bash
find assets/js scripts -name "*.js" -print0 | xargs -0 -n1 node --check
```

### HTML sanity

```bash
python - <<'PY'
from pathlib import Path
for path in Path(".").glob("*.html"):
    text = path.read_text(encoding="utf-8")
    assert "<!doctype html>" in text.lower(), path
    assert "<title>" in text.lower(), path
    print("ok", path)
PY
```

### Forbidden public terms scan

```bash
python - <<'PY'
from pathlib import Path
terms = [
  "providerId",
  "affiliateUrl",
  "applyUrl",
  "commission",
  "routingSecret",
  "underwritingNote",
  "apiKey"
]
for path in list(Path(".").glob("*.html")) + list(Path("assets").glob("**/*.js")) + list(Path("site-data").glob("**/*.json")):
    text = path.read_text(encoding="utf-8", errors="ignore")
    for term in terms:
        if term in text:
            print("review", path, term)
PY
```

Manual review is still required because some forbidden terms may appear in safety docs as examples.

## Safe copy requirements

Use:

```txt
funding readiness
potential funding path
may be a fit
based on your answers
recommended next step
subject to review
human review recommended
not an approval, offer, or guarantee of funding
```

Avoid making public claims with:

```txt
approved
guaranteed funding
final eligibility
underwriting decision
best rates
instant approval
credit repair
```

## Working with schemas

When generating JSON data:

- match existing schema expectations where available
- include `id`
- include `version` at registry envelope level
- include `visibility`
- keep arrays simple
- avoid deeply nested cleverness unless needed

When generating OpenAPI:

- use OpenAPI 3.1 where possible
- define auth clearly
- include safe sample requests/responses
- mark internal/admin actions clearly
- avoid provider-specific response fields

## Packaging

Create ZIPs with repo-relative paths only.

Good ZIP contents:

```txt
docs/site-map.md
docs/embed-guide.md
```

Bad ZIP contents:

```txt
/mnt/data/work/docs/site-map.md
C:\Users\...
```

## Output summary format

```txt
Batch completed: Batch XX — Name

Created files:
- /path/file

Validation notes:
- JSON validation:
- JS syntax validation:
- Public/private boundary review:
- Restricted language review:

Download:
[file link]

Stop here and wait for approval.
```

## Escalation

Pause or disclose if:

- requested files conflict with existing structure
- validation cannot be run
- the task would require real credentials
- the task would expose private provider data
- deployment changes are requested without explicit authorization
- the batch list is missing or contradictory

## Codex implementation style

Prefer clear, boring reliability over clever abstractions. This repo is a funding-readiness machine. Build gears, not glitter.
