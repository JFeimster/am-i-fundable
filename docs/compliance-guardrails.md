# Compliance Guardrails

Strict adherence to compliance rules is mandatory when working with the Funding Readiness Scorecard.

## Language Restrictions

The scorecard provides **educational pre-screening**. It does not make lending decisions.

**Never use words or phrases like:**
- Approved
- Guaranteed
- Instant Approval
- You qualify for
- Underwriting complete
- Final eligibility
- Best rates guaranteed

**Instead, use:**
- Funding readiness score
- Potential funding path
- May be a fit for review
- Based on your answers
- Recommended next step
- Subject to review

## Data Privacy and Boundaries

Public-facing files (e.g., in `/data` or served to the browser) must **never** expose:
- Real provider names
- Provider IDs
- Affiliate or apply URLs
- Commission rates or payout terms
- Contact emails
- Internal routing rules

Private provider routing and logic must remain in the `/internal` directory and be accessed only server-side via API routes.
