# Funding Readiness Scorecard - Zapier Workflow

This document outlines how to integrate the Funding Readiness Scorecard with Zapier.

## Zap Setup Guide

### 1. Trigger
- **App Event:** Webhooks by Zapier
- **Trigger Event:** Catch Hook
- **Webhook URL:** Zapier will provide a custom URL. Use this in your application environment variables (e.g., `SCORECARD_WEBHOOK_URL`).
  - *Example Placeholder:* `https://hooks.zapier.com/hooks/catch/123456/abcdef/`

### 2. Action (Path A - CRM Integration)
- **Condition:** Only continue if `fundingReadinessScore` is greater than or equal to 70.
- **App Event:** Choose your CRM (e.g., Salesforce, HubSpot).
- **Action Event:** Create or Update Contact/Lead.
- **Mapping:** Map the incoming JSON fields (`name`, `email`, `phone`, `businessName`, `monthlyRevenue`, etc.) to the corresponding fields in your CRM.

### 3. Action (Path B - Nurture Campaign)
- **Condition:** Only continue if `fundingReadinessScore` is less than 70.
- **App Event:** Email marketing tool (e.g., Mailchimp, ActiveCampaign) or standard Email by Zapier.
- **Action Event:** Send Email or Add to List.
- **Content:** Use the `applicant-result-email.md` template for the body of the email, populating the template variables with the webhook data.

## Note
Always use environment variables for webhook URLs in your codebase. Do not commit actual Zapier webhook URLs.
