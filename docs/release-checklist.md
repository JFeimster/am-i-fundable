<!--
Am I Fundable / Funding Readiness Scorecard
Visibility: public_repo_operational_doc
Safety: public-safe; no provider names, provider IDs, affiliate/apply URLs, commissions, private contacts, routing secrets, underwriting notes, credentials, or real borrower PII.
Deployment: do not change vercel.json unless explicitly authorized.
-->
# Release Checklist

Use this checklist before merging or packaging any batch for the Am I Fundable / Funding Readiness Scorecard repo.

This repo should move fast, but not like a shopping cart with one possessed wheel.

## Release rule

Do not change `vercel.json` unless explicitly authorized.

Default deployment policy:

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

## Pre-release checks

### File scope

- [ ] Batch includes only approved files.
- [ ] Repo-relative paths are preserved.
- [ ] No extra decorative files are added.
- [ ] No lazy stubs or empty placeholders.
- [ ] No existing files are overwritten unintentionally.
- [ ] `vercel.json` is unchanged unless explicitly authorized.

### Public/private boundary

- [ ] Public files contain no provider names.
- [ ] Public files contain no provider IDs.
- [ ] Public files contain no affiliate URLs.
- [ ] Public files contain no apply URLs.
- [ ] Public files contain no commission or payout data.
- [ ] Public files contain no private contacts.
- [ ] Public files contain no private notes.
- [ ] Public files contain no routing secrets.
- [ ] Public files contain no underwriting notes.
- [ ] Public files contain no credentials.
- [ ] Public files contain no real borrower PII.
- [ ] Browser JS does not fetch `/internal/**`.

### Language safety

- [ ] No public copy claims approval.
- [ ] No public copy claims guaranteed funding.
- [ ] No public copy claims final eligibility.
- [ ] No public copy claims underwriting decisions.
- [ ] No public copy claims best rates.
- [ ] No public copy claims instant approval.
- [ ] No public copy claims credit repair outcomes.
- [ ] Disclaimers are present where results, review, or next steps appear.

### JSON validation

Run:

```bash
find . -name "*.json" -not -path "./node_modules/*" -print0 | xargs -0 -n1 python -m json.tool > /dev/null
```

PowerShell:

```powershell
Get-ChildItem -Recurse -Filter *.json | Where-Object { $_.FullName -notmatch "node_modules" } | ForEach-Object {
  python -m json.tool $_.FullName > $null
}
```

### JS validation

Run:

```bash
find assets/js scripts -name "*.js" -print0 | xargs -0 -n1 node --check
```

PowerShell:

```powershell
Get-ChildItem assets/js,scripts -Filter *.js -Recurse | ForEach-Object {
  node --check $_.FullName
}
```

### YAML/OpenAPI validation

At minimum, parse YAML locally if Python YAML support exists:

```bash
python - <<'PY'
import pathlib, yaml
for path in pathlib.Path("schemas/actions").glob("*.yaml"):
    yaml.safe_load(path.read_text())
    print("ok", path)
PY
```

If `yaml` is unavailable, install or use an existing CI validator. Do not add dependencies unless authorized.

### HTML smoke check

For static pages:

- [ ] Page has `<!doctype html>`.
- [ ] Page has `<html lang="en">`.
- [ ] Page has viewport meta tag.
- [ ] Page has title and meta description.
- [ ] Page links to relevant stylesheet.
- [ ] Primary CTA points to a real public route.
- [ ] Footer includes safe disclaimer or links to terms/privacy.
- [ ] No hardcoded private data appears.

### Markdown docs check

- [ ] File has a clear title.
- [ ] File is operational, not decorative.
- [ ] Commands are copyable.
- [ ] Data boundary is repeated where relevant.
- [ ] No real secrets or private data appear.
- [ ] Docs do not instruct automatic deployment.

## Local packaging

From repo root or a clean staging folder:

```bash
zip -r am-i-fundable-batch-XX-name.zip path/to/file1 path/to/file2
```

Ensure the ZIP contains repo-relative paths, not your local absolute path.

Check ZIP contents:

```bash
unzip -l am-i-fundable-batch-XX-name.zip
```

PowerShell:

```powershell
Compress-Archive -Path @("docs/site-map.md","docs/embed-guide.md") -DestinationPath "am-i-fundable-batch-XX.zip" -Force
```

## Manual deployment window

Only when explicitly authorized:

```txt
1. Enable main deployment only.
2. Keep preview deploys disabled.
3. Merge or release.
4. Confirm production deployment.
5. Disable main deployment again.
6. Confirm deployment settings are back to false/false.
```

## Post-release review

After merge:

- [ ] Confirm file tree matches batch.
- [ ] Confirm public pages load.
- [ ] Confirm scorecard flow still works.
- [ ] Confirm browser console has no internal fetches.
- [ ] Confirm sitemap/robots impact if applicable.
- [ ] Confirm docs reflect actual files.
- [ ] Create follow-up issue for any deferred fix.

## Emergency rollback notes

If a release exposes private data:

1. Remove the sensitive file/content immediately.
2. Rotate any exposed secret if applicable.
3. Purge deployment/cache if public.
4. Review commit history exposure.
5. Create a remediation note.
6. Add validation rule to prevent recurrence.

Do not debate with the fire while the kitchen is burning.
