# Funding Readiness Scorecard - Make (Integromat) Workflow

This document provides a template for setting up a Make workflow to handle Scorecard submissions.

## Workflow Overview
1.  **Webhook Trigger:** Set up a custom webhook in Make to receive the `POST` request from the scorecard application.
2.  **Router:** Use a Router module to split the flow based on the `scoreTier` or `fundingReadinessScore`.
3.  **High Score Path:** If the score is high, map the payload fields (such as `name`, `email`, `businessName`, `desiredFundingAmount`) to your CRM module (e.g., HubSpot, Pipedrive).
4.  **Low/Mid Score Path:** If the score is lower, map the payload to an email sending module (e.g., Gmail, SendGrid) to send the `applicant-result-email.md` content and preparation checklist.

## Webhook Setup
When setting up the Webhook, ensure it accepts JSON. The structure will match the `scorecard-submission.schema.json`.

*Placeholder URL:* `https://hook.us1.make.com/your-placeholder-webhook-id`

## Security Note
Do not hardcode API keys or production URLs in this document. Always use Make's built-in connection management.
