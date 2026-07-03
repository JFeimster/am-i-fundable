<!--
Am I Fundable / Funding Readiness Scorecard
Visibility: public_repo_operational_doc
Safety: public-safe; no provider names, provider IDs, affiliate/apply URLs, commissions, private contacts, routing secrets, underwriting notes, credentials, or real borrower PII.
Deployment: do not change vercel.json unless explicitly authorized.
-->
# Jules Runbook

This runbook defines how Jules should execute future file batches for the Am I Fundable / Funding Readiness Scorecard repo.

The goal is controlled velocity: move fast without turning the repo into a confetti cannon full of half-files.

## Operating mode

Jules should execute one approved batch at a time unless explicitly instructed otherwise.

For each batch:

1. Read the ordered batch plan.
2. Create only the files listed for that batch.
3. Preserve repo-relative paths.
4. Avoid lazy stubs.
5. Avoid decorative filler.
6. Validate syntax and boundaries.
7. Package or commit cleanly.
8. Stop for approval before the next batch.

## Hard rules

Do not expose:

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

Do not claim:

- approval
- guaranteed funding
- final eligibility
- underwriting decision
- lender-specific approval certainty
- best rates
- instant approval
- credit repair outcomes

Use safe language:

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

## Deployment rule

Do not change `vercel.json` unless explicitly authorized.

No GitHub workflow should deploy automatically unless a future approved task says so. Validation workflows are okay; deployment workflows are not.

## Batch execution template

```txt
Batch:
Files:
Dependencies:
Public/private boundary:
Validation steps:
Known risks:
Completion summary:
```

## Branch naming

Suggested branch format:

```txt
batch-XX-short-name
```

Examples:

```txt
batch-24-markdown-operating-docs
batch-25-knowledge-base-expansion
batch-26-design-system-layer
```

## Commit message format

```txt
Add Batch XX [batch name]
```

Example:

```txt
Add Batch 24 markdown operating docs
```

## File creation standard

Every file should be complete enough to be useful on merge.

A good file:

- has a clear purpose
- matches repo strategy
- includes safe language
- includes commands where useful
- has no secrets
- has no private provider data
- can be used by a human or agent immediately

A bad file:

- has unfinished markers without meaningful content
- repeats generic filler
- exposes private logic
- invents providers or social proof
- changes unrelated deployment settings
- creates new dependencies without approval

## Validation commands

JSON:

```bash
find . -name "*.json" -not -path "./node_modules/*" -print0 | xargs -0 -n1 python -m json.tool > /dev/null
```

JS:

```bash
find assets/js scripts -name "*.js" -print0 | xargs -0 -n1 node --check
```

YAML:

```bash
python - <<'PY'
import pathlib, yaml
for path in pathlib.Path("schemas/actions").glob("*.yaml"):
    yaml.safe_load(path.read_text())
    print("ok", path)
PY
```

Public boundary:

```bash
node scripts/validate-public-boundary.js
```

If a validation tool is not available yet, perform a manual scan and document the limitation.

## Pull request checklist

PR should state:

- batch number and name
- files created
- validation performed
- public/private boundary result
- restricted language review result
- confirmation that `vercel.json` was not changed

## PR body template

```md
## Batch

Batch XX — Name

## Created files

- `path/file.ext`

## Validation

- JSON validation:
- JS syntax validation:
- YAML/OpenAPI validation:
- Public/private boundary:
- Restricted language:
- `vercel.json`:

## Notes

Any limitations or follow-ups.
```

## When to stop

Stop and ask for approval when:

- the current batch is complete
- the batch list does not include a requested file
- a required dependency is missing and cannot be safely inferred
- the task would require deployment changes
- the task would expose private data
- the user has not approved the next batch

## When to make a best effort

If a minor dependency is missing but the batch can still be completed safely, create the file with sensible repo-safe assumptions and document the assumption.

Example:

> Batch 24 references Batch 23 scripts. If scripts are not merged locally yet, write docs against the approved intended paths.

## Error handling

If validation fails:

1. Fix the file.
2. Re-run validation.
3. Document the fix.
4. Do not package until known issues are resolved or clearly disclosed.

## Human tone

Use direct operational language. Avoid corporate fog machines. This repo is meant to make funding readiness clearer, not summon a committee.
