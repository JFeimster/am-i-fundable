# Vercel Environment Variables

To operate fully, the deployed Vercel application may require environment variables. **Never commit these values to the repository.**

Configure these in the Vercel Project Settings > Environment Variables.

## Expected Variables (Placeholders)

*These are examples of variables that may be used by the API routes.*

- `SCORECARD_ALLOWED_ORIGIN`: Used to restrict which domains can embed the widget or hit the API (e.g., `https://my-partner-site.com`).
- `N8N_SCORECARD_WEBHOOK_URL`: The destination URL for the `/api/submit-score` payload.
- `HUBSPOT_PRIVATE_APP_TOKEN`: (If implementing direct HubSpot CRM routing server-side).
- `NOTION_TOKEN`: (If implementing Notion integration).

*Note: Depending on the current batch implementation, some of these may be optional or not yet active in the code.*
