# Testing Checklist

This checklist ensures the scorecard functions correctly without compromising data boundaries or compliance.

## Pre-deployment Checklist

1.  **Validation Scripts:**
    -   Run `npm run validate`
    -   Confirm JSON validation passes.
    -   Confirm JS syntax validation passes.
    -   Confirm the Private Data Scan passes.
2.  **Browser Smoke Tests:**
    -   Open `index.html` locally. Verify the quiz flow works and a readiness recommendation is returned.
    -   Open `embed-example.html` locally. Verify the widget loads and functions similarly.
3.  **API Verification:**
    -   If testing locally with a server, ensure `/api/submit-score` handles payload correctly (or handles the absence of webhooks gracefully).
    -   Ensure `/api/match-partners` returns only public-safe fields (no private URLs or internal IDs).
4.  **Compliance Review:**
    -   Search public-facing files for forbidden terms ("approved", "guaranteed").
    -   Verify no new UI elements imply lending decisions.
