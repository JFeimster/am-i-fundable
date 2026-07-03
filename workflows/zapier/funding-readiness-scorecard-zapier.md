# Funding Readiness Scorecard - Zapier Workflow

This document outlines how to integrate the Funding Readiness Scorecard with Zapier using the existing scorecard forwarding path.

## Zap Setup Guide

### 1. Trigger
- **App Event:** Webhooks by Zapier
- **Trigger Event:** Catch Hook
- **Webhook URL:** Zapier will provide a custom URL.
- **Application setting:** The current `/api/submit-score.js` forwarding path reads `N8N_SCORECARD_WEBHOOK_URL`. Use that environment variable for the Zapier catch hook unless the API is extended with a dedicated Zapier variable later.
  - *Example Placeholder:* `https://hooks.zapier.com/hooks/catch/123456/abcdef/`

### 2. Action (Path A - CRM Integration)
- **Condition:** Only continue if `body.scoreResult.score` is greater than or equal to 70. If you send a flat test payload, use `fundingReadinessScore` instead.
- **App Event:** Choose your CRM after confirming the submission should receive human review.
- **Action Event:** Create or Update Contact/Lead.
- **Mapping:** Map applicant fields from `body.applicant` or the flat payload, and map score fields from `body.scoreResult`.

### 3. Action (Path B - Nurture Campaign)
- **Condition:** Only continue if `body.scoreResult.score` is less than 70. If you send a flat test payload, use `fundingReadinessScore` instead.
- **App Event:** Email marketing tool or standard Email by Zapier.
- **Action Event:** Send Email or Add to List.
- **Content:** Use the `applicant-result-email.md` template for the body of the email, populating the template variables with webhook data.

## Note
Always use environment variables for webhook URLs in your codebase. Do not commit actual Zapier webhook URLs.
