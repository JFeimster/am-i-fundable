# Automation Context

This folder contains information about automating workflows and post-scorecard actions.

## Webhooks and n8n

The scorecard can submit results to an external webhook. Our example workflows are built for tools like n8n.

When a scorecard is submitted, the `api/submit-score` route securely posts a JSON payload to the configured webhook URL.

### Safe Automation Rules

- Never log or pass sensitive PII in plain text where avoidable.
- Keep CRM routing and scoring rules decoupled from the frontend UI.
- Use placeholders (like `REDACTED_FOR_PUBLIC_REPO` or `https://example.com/webhook`) when sharing or uploading workflows.
- Webhook endpoints should be stored securely as environment variables (e.g., in Vercel), never committed to code.
