# Funding Readiness Scorecard - Zapier Workflow

This document outlines how to integrate the Funding Readiness Scorecard with Zapier using the existing scorecard forwarding path.

## Zap Setup Guide

### 1. Trigger
- **App Event:** Webhooks by Zapier
- **Trigger Event:** Catch Hook
- **Webhook URL:** Zapier will provide a custom URL.
- **Application setting:** Set `SCORECARD_LEAD_WEBHOOK_URL` to the Zapier Catch Hook URL. `N8N_SCORECARD_WEBHOOK_URL` remains a deprecated fallback only.
  - *Example Placeholder:* `https://hooks.zapier.com/hooks/catch/123456/abcdef/`

### 2. Action (Path A - CRM Integration)
- **Condition:** Only continue if `readiness.score` is greater than or equal to 70.
- **App Event:** Choose your CRM after confirming the submission should receive human review.
- **Action Event:** Create or Update Contact/Lead.
- **Mapping:** Map applicant fields from `applicant` and score/readiness fields from `readiness`.

### 3. Action (Path B - Nurture Campaign)
- **Condition:** Only continue if `readiness.score` is less than 70.
- **App Event:** Email marketing tool or standard Email by Zapier.
- **Action Event:** Send Email or Add to List.
- **Content:** Use the `applicant-result-email.md` template for the body of the email, populating the template variables with webhook data.

## Note
Always use environment variables for webhook URLs in your codebase. Do not commit actual Zapier webhook URLs.
