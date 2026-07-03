# Merge Readiness Checklist

Before merging a branch into `main`, complete this checklist to ensure stability, safety, and compliance.

## 1. Automated Validation
- [ ] Run `npm run validate`.
- [ ] Confirm `JSON OK` for all configuration and data files.
- [ ] Confirm `JS OK` for all scripts and API routes.
- [ ] Confirm `Private data scan passed.`

## 2. Compliance and Safety
- [ ] Verify no private provider data (names, IDs, real URLs, commissions) was added to public directories (`/data`, `/config`, `/docs`).
- [ ] Review any new user-facing text for compliance. Ensure no "approved", "guaranteed", or definitive lending language is used.
- [ ] Ensure any new external integrations use environment variable placeholders (e.g., `REDACTED_FOR_PUBLIC_REPO`), not hardcoded secrets.

## 3. Architecture and UI
- [ ] Confirm `vercel.json` remains unchanged (unless explicitly authorized).
- [ ] Confirm core scoring logic was not fundamentally altered (unless authorized).
- [ ] Confirm frontend UI files (`index.html`, `widget.html`, `styles.css`) were not unnecessarily redesigned.

## 4. Manual Verification
- [ ] Perform a basic browser smoke test: Load `index.html` locally and complete a test run to verify the result page renders correctly.
- [ ] Verify `embed-example.html` loads the widget properly.
