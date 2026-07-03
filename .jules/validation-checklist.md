# Jules Validation Checklist

Use this checklist before reporting a Jules task as complete.

## 1. Repo Safety

Confirm the task did not modify files outside the requested scope.

Check especially:

```txt
index.html
styles.css
script.js
widget.html
widget.css
widget.js
embed-example.html
vercel.json
```

These should not change unless the prompt explicitly required it.

## 2. Public Repo Data Safety

Confirm no public or committed file includes:

```txt
affiliateUrl
affiliate_url
applyUrl
apply_url
referralUrl
referral_url
commission
commissionRate
commission_rate
payout
contactEmail
contact_email
keyContact
partner_contact
portalUrl
portal_url
dashboardUrl
dashboard_url
apiKey
api_key
token
secret
webhookSecret
webhook_secret
privateNotes
private_notes
internalNotes
internal_notes
underwritingNotes
underwriting_notes
routingNotes
routing_notes
```

If any appear, they must be placeholders, documentation examples, or blocked-term references. They must not contain real values.

## 3. Compliance Language

Search for blocked terms:

```txt
approved
guaranteed
you qualify
instant approval
final eligibility
underwriting complete
best rates guaranteed
guaranteed funding
```

These should not appear in public-facing claims.

Acceptable uses are only allowed when explaining restricted language, such as:

```txt
Do not say "approved."
```

## 4. JSON Validation

All `.json` files must parse.

Expected style:

- two-space indentation
- no trailing commas
- stable object keys where practical
- no comments inside JSON

## 5. Markdown Validation

Markdown files should be:

- readable
- operational
- short enough to use
- not stuffed with generic filler
- aligned with current repo paths

## 6. Workflow Safety

Workflow templates must use placeholders only.

Allowed:

```txt
https://example.com/webhook
${WEBHOOK_URL}
${HUBSPOT_PRIVATE_APP_TOKEN}
${NOTION_API_KEY}
${AIRTABLE_API_KEY}
```

Not allowed:

```txt
real webhook URLs
real API tokens
real private CRM IDs
real applicant records
real provider contacts
```

## 7. API Alignment

If creating workflow or template docs, confirm references align with existing API routes:

```txt
/api/health
/api/submit-score
/api/match-partners
/api/lender-match-review
```

## 8. Vercel Behavior

Do not change `vercel.json` unless explicitly instructed.

If deployment behavior is documented, describe the current setting without modifying it.

## 9. Required Validation Command

Run or request:

```bash
npm run validate
```

If the command fails, report:

- exact failure
- file path
- suspected cause
- recommended fix

## 10. Jules Completion Report

Every Jules response should include:

```txt
Files created
Files updated
Files skipped
Validation results
Assumptions
Next recommended batch
```

## Done Means

A Jules task is done only when:

- requested files exist or were intentionally skipped
- no private data was introduced
- compliance language is safe
- validation passed or issues are clearly reported
- next step is clear
