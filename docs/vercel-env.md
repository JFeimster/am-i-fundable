# Vercel Environment Variables

To operate fully, the deployed Vercel application may require environment variables. **Never commit these values to the repository.**

Configure these in the Vercel Project Settings > Environment Variables.

## Expected Variables (Placeholders)

*These are examples of variables that may be used by the API routes.*

- `SCORECARD_ALLOWED_ORIGIN`: Used to restrict which domains can embed the widget or hit the API (e.g., `https://my-partner-site.com`).
- `SCORECARD_LEAD_WEBHOOK_URL`: Preferred generic HTTPS webhook destination for the normalized `/api/submit-score` JSON payload. Use a Make webhook, Zapier Catch Hook, Pipedream HTTP trigger, n8n webhook, or custom HTTPS endpoint.
- `N8N_SCORECARD_WEBHOOK_URL`: Deprecated backward-compatible fallback, used only when `SCORECARD_LEAD_WEBHOOK_URL` is unset.
- `HUBSPOT_PRIVATE_APP_TOKEN`: Reserved for a future direct HubSpot adapter; do not configure it for this webhook-only flow.
- `NOTION_TOKEN`: (If implementing Notion integration).

The webhook URL is read server-side only and is never returned to browser clients. The API keeps the score result available when delivery fails or no destination is configured and exposes only `{ configured, delivered, status }` in `leadDelivery`.
