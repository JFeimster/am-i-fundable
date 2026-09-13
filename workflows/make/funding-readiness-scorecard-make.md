# Funding Readiness Scorecard - Make Workflow

This document provides a safe starter template for handling Funding Readiness Scorecard submissions in Make.

## Workflow Overview
1. **Webhook Trigger:** Set up a custom webhook in Make to receive the POST request from the scorecard application.
2. **Router:** Split the flow based on `readiness.score` and `readiness.leadPriority`.
3. **CRM Review Path:** Map applicant fields and score fields to your CRM module only after confirming human-review rules.
4. **Nurture Path:** Map the payload to an email or nurture module using `applicant-result-email.md` and the preparation checklist.

## Webhook Setup
When setting up the webhook, ensure it accepts JSON. Configure the Make URL in the server-side `SCORECARD_LEAD_WEBHOOK_URL` variable. Do not put the URL in browser code. `N8N_SCORECARD_WEBHOOK_URL` is retained only as a deprecated fallback.

*Placeholder URL:* `https://hook.us1.make.com/your-placeholder-webhook-id`

## Expected Payload Notes
The normalized payload uses `event: funding_readiness_scorecard.completed`, `leadId`, `source`, `submittedAt`, `applicant`, `readiness`, and `answers`. Map `readiness.score`, `readiness.tierId`, `readiness.primaryFundingFamily`, `readiness.strengths`, `readiness.risks`, `readiness.nextSteps`, and `readiness.recommendedDocuments` explicitly before sending anything to a CRM or email tool.

## Security Note
Do not hardcode API keys, production URLs, or private provider details in this document. Always use Make's built-in connection management.
