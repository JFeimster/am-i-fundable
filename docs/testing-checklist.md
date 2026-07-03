<!--
Am I Fundable / Funding Readiness Scorecard
Visibility: public_repo_operational_doc
Safety: public-safe; no provider names, provider IDs, affiliate/apply URLs, commissions, private contacts, routing secrets, underwriting notes, credentials, or real borrower PII.
Deployment: do not change vercel.json unless explicitly authorized.
-->
# Testing Checklist

Use this checklist to test the Funding Readiness Scorecard public site, scorecard flow, embeds, data files, action schemas, and internal boundary.

## Static page tests

For each public page:

- [ ] Loads without a build step.
- [ ] Has a useful `<title>`.
- [ ] Has a clear H1.
- [ ] Links to the scorecard or an appropriate next step.
- [ ] Has privacy/terms access where relevant.
- [ ] Uses readiness language.
- [ ] Contains no provider names or private routing details.
- [ ] Contains no affiliate/apply URLs.
- [ ] Looks usable on mobile width.
- [ ] Has no broken local asset paths.

Pages to check:

```txt
/
 /scorecard.html
 /results.html
 /funding-paths.html
 /documents.html
 /broker.html
 /partners.html
 /white-label.html
 /embed-example.html
 /thank-you.html
 /not-ready.html
 /fundable-review.html
 /highly-fundable.html
 /resources.html
 /faq.html
 /privacy.html
 /terms.html
```

## Scorecard flow tests

- [ ] User can start scorecard.
- [ ] Required questions block advancing.
- [ ] Back button works.
- [ ] Progress indicator updates.
- [ ] Red flag “none” behavior works.
- [ ] Lead capture requires name/email/phone/consent.
- [ ] Result renders after completion.
- [ ] Result includes score/tier.
- [ ] Result includes potential funding paths.
- [ ] Result includes potential blockers.
- [ ] Result includes recommended next steps.
- [ ] Result includes document suggestions.
- [ ] Result includes disclaimer.
- [ ] Retake/restart works.
- [ ] Submit failure degrades gracefully.

## Result language tests

Search public files for unsafe language. Unsafe phrases may appear in docs only as banned examples.

Manual review phrases:

```txt
approved
guaranteed funding
final eligibility
underwriting decision
best rates
instant approval
credit repair
```

Safe public replacements:

```txt
funding readiness
potential funding path
may be a fit
review recommended
subject to review
not an approval, offer, or guarantee
```

## Browser boundary tests

Open dev tools and check network requests.

Public pages should not request:

```txt
/internal/
private
secrets
provider
commission
underwriting
```

Browser JS should fetch only public data/config paths.

## JSON validation

Run:

```bash
find site-data config internal schemas design examples -name "*.json" -print0 | xargs -0 -n1 python -m json.tool > /dev/null
```

PowerShell:

```powershell
Get-ChildItem site-data,config,internal,schemas,design,examples -Filter *.json -Recurse | ForEach-Object {
  python -m json.tool $_.FullName > $null
}
```

## JavaScript syntax

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

## OpenAPI/YAML tests

- [ ] Each file includes `openapi: 3.1.0`.
- [ ] Each file includes `info`.
- [ ] Each public action has safe descriptions.
- [ ] Admin action is clearly marked internal/not public.
- [ ] Sample responses avoid provider-specific data.
- [ ] Demo emails use `example.com`.

## Embed tests

For `/embed-example.html` and iframe/script embed:

- [ ] Embed loads.
- [ ] Iframe has title.
- [ ] Height is sufficient.
- [ ] Scorecard is keyboard usable.
- [ ] Host page styles do not break widget.
- [ ] Result disclaimer appears.
- [ ] No internal registries are fetched.
- [ ] Query params are public-safe.

## Privacy and terms tests

- [ ] Privacy page explains lead capture and contact consent.
- [ ] Terms page states scorecard is educational.
- [ ] Neither page promises funding outcomes.
- [ ] Both pages link back to scorecard.
- [ ] No legal overclaiming or fake compliance claims.

## Internal registry tests

Internal files should:

- [ ] Include `visibility: server_side_internal`.
- [ ] Use dummy/demo values only.
- [ ] Avoid real provider names.
- [ ] Avoid apply/affiliate URLs.
- [ ] Avoid commissions/payouts.
- [ ] Avoid private contacts.
- [ ] Avoid real borrower data.
- [ ] Be excluded from browser fetches.

## Accessibility tests

- [ ] Keyboard navigation works.
- [ ] Form inputs have labels.
- [ ] Buttons have clear text.
- [ ] Page has logical heading order.
- [ ] Color contrast is readable.
- [ ] Motion is not required to understand content.
- [ ] Error messages are visible.

## Mobile tests

At widths around 375px, 768px, and desktop:

- [ ] Nav is usable.
- [ ] Cards do not overflow.
- [ ] Forms are not cramped.
- [ ] Iframes do not clip critical content.
- [ ] CTAs remain tappable.
- [ ] Footer text remains readable.

## Deployment tests

Before any deployment:

- [ ] Deployment was explicitly authorized.
- [ ] `vercel.json` policy was reviewed.
- [ ] Preview deployment behavior is intentional.
- [ ] Main deployment behavior is intentional.
- [ ] Deployment window is closed after release if required.

Do not change deployment settings during testing unless specifically approved.
