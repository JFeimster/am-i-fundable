# Pull Request Checklist

## What changed?

Describe the practical outcome of this PR in 2–5 bullets.

- 
- 
- 

## Batch / scope

- Batch or issue:
- Primary paths changed:
- Public-facing changes: yes / no
- Internal-only changes: yes / no

## Required checks

Before requesting review, confirm:

- [ ] I created or changed only the files required for this PR.
- [ ] Public files contain no real provider names, provider IDs, affiliate URLs, apply URLs, commissions, private contacts, private notes, routing secrets, underwriting notes, credentials, or real borrower PII.
- [ ] Public copy does not claim approval, guaranteed funding, final eligibility, underwriting decisions, best rates, instant approval, or credit repair outcomes.
- [ ] Internal files are clearly marked internal/server-side only where relevant.
- [ ] Browser-facing files do not import or fetch `/internal/**` data.
- [ ] JSON files parse.
- [ ] JavaScript files pass syntax validation.
- [ ] YAML files are readable and do not perform deployment actions.
- [ ] Markdown docs are operational and not decorative filler.
- [ ] I did not change `vercel.json` unless this PR is explicitly authorized to open or close a deployment window.
- [ ] I did not add production secrets, tokens, private keys, or real borrower data.

## Validation run

Paste the local validation command and result.

```bash
npm run validate
```

Result:

```txt

```

## Deployment impact

Default answer should be **none**.

- [ ] This PR does not deploy anything.
- [ ] This PR does not enable Vercel production or preview auto-deploys.
- [ ] This PR does not add a deployment workflow.

Notes:
