# CRM Integration

The scorecard is designed to capture leads and route their readiness score and profile data to a CRM.

## CRM Data Mapping

Scorecard data is mapped to standard lead fields. Review the `/internal/crm/` folder for specific field mapping examples (e.g., HubSpot, Notion).

### Best Practices

1.  **Use Environment Variables:** Never store CRM API keys or private tokens in the repository. Use placeholders like `REDACTED_FOR_PUBLIC_REPO` in public documentation and code.
2.  **Compliance:** Ensure the data passed to the CRM includes the applicant's consent to be contacted. Do not store "approved" or "guaranteed" tags in the CRM based on scorecard results.
3.  **Human Review Flagging:** If the scorecard flags an applicant for manual review (e.g., due to conflicting answers or disqualifying signals), ensure the CRM workflow assigns the lead to an operator for review rather than triggering automated emails.

## Example Flow

1. Applicant submits the scorecard.
2. `api/submit-score` processes the data.
3. Data is routed via webhook to an automation tool (e.g., n8n).
4. Automation tool maps the data using the CRM field map and creates/updates a contact record in the CRM.
