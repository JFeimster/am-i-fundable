# Funding Readiness Scorecard - Make Workflow

This document provides a safe starter template for handling Funding Readiness Scorecard submissions in Make.

## Workflow Overview
1. **Webhook Trigger:** Set up a custom webhook in Make to receive the POST request from the scorecard application.
2. **Router:** Split the flow based on `body.scoreResult.score` when using the existing `/api/submit-score.js` forwarding path. For flat test payloads, use `fundingReadinessScore`.
3. **CRM Review Path:** Map applicant fields and score fields to your CRM module only after confirming human-review rules.
4. **Nurture Path:** Map the payload to an email or nurture module using `applicant-result-email.md` and the preparation checklist.

## Webhook Setup
When setting up the webhook, ensure it accepts JSON. The current app forwards to `process.env.N8N_SCORECARD_WEBHOOK_URL`, so use that environment variable for the Make webhook URL unless the API is extended with a dedicated Make variable later.

*Placeholder URL:* `https://hook.us1.make.com/your-placeholder-webhook-id`

## Expected Payload Notes
When forwarded by `/api/submit-score.js`, the score is nested under `body.scoreResult.score`. Applicant details may be nested under `body.applicant` depending on the submission path. Map fields explicitly before sending anything to a CRM or email tool.

## Security Note
Do not hardcode API keys, production URLs, or private provider details in this document. Always use Make's built-in connection management.
