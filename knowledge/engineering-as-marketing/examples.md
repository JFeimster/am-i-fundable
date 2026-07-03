# Engineering as Marketing Examples

Here are examples of how the scorecard ecosystem can be leveraged.

## Example: Custom GPT Integration

A company builds a "Startup Funding Guide" Custom GPT.
1. The user asks the GPT, "How much funding can I get?"
2. The GPT prompts the user for their time in business, revenue, and credit score.
3. The GPT formulates a request to the scorecard's public-safe `/api/match-partners.js` endpoint (with appropriate permissions/auth).
4. The API returns a compliance-safe recommendation (e.g., "Based on your inputs, you may be a fit for a manual review").
5. The GPT displays this to the user and provides a link to formally submit their information.

## Example: Partner Embed

A B2B accounting firm wants to offer funding options to their clients.
1. The firm embeds the scorecard widget onto their "Client Resources" page.
2. A client fills out the scorecard.
3. The data is processed using the core scoring engine.
4. The client sees a readiness score and next steps directly on the accounting firm's website.
5. The lead is securely routed to the CRM for follow-up.

## Example: Targeted Nurture Sequence

A user completes the scorecard but has no revenue and a poor credit score.
1. The scorecard flags them for a "credit builder / fundamentals" path.
2. This signal is passed to the CRM via webhook.
3. The CRM automatically enrolls the user in an email sequence focused on actionable steps to improve business credit, rather than offering immediate funding.
