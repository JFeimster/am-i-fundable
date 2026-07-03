# Private Data Handling

This repository is public. Repo-committed provider, product, and routing files must remain safe demo data only.

Rules:
- Do not commit real affiliate URLs, apply URLs, partner contacts, commissions, portal links, routing notes, or private source links.
- Store operational partner data outside this repo in a private CRM, private Notion database, private Airtable, environment-managed source, or encrypted storage.
- Keep repo fixtures schema-compatible so the frontend, APIs, and smoke tests can run against demo data.
- API routes may load real provider data later from a private source, but repo-committed fallback data must stay sanitized.

Recommended local conventions:
- Use `*.private.json` or `*.secrets.json` for local-only provider exports.
- Keep local private files under `internal/private/`, `private/`, or `secrets/`.
- Use `.env` files only for environment values, and never commit live credentials.

Sanitized placeholder convention:
- `affiliateUrl`: `null`
- `applyUrl`: `null`
- `contactEmail`: `null`
- `commissionRate`: `null`
- `keyContact`: `null`
- `website`: `null`
- `notionUrl`: `null`
- `notes`: `["Removed from public repo. Store operational notes in a private system."]`
