# Readiness Report API

The readiness report API turns scorecard answers into a structured report and a Markdown summary.

Route:

```txt
POST /api/scorecard/generate-readiness-report
```

## Purpose

Use this route to create:

- applicant-facing readiness summaries
- broker review summaries
- document preparation lists
- educational next-step reports
- Custom GPT report outputs

The report is educational and review-oriented. It is not an offer, underwriting result, or funding commitment.

## Request shape

```json
{
  "format": "both",
  "applicant": {
    "businessName": "Demo Growth LLC",
    "state": "DC"
  },
  "answers": {
    "businessPersona": "local_service_business",
    "monthlyRevenue": 85000,
    "timeInBusinessMonths": 36,
    "creditScore": 710,
    "bankStatus": "strong_clean",
    "businessStructure": "entity_bank_ein_clean",
    "fundingPurpose": "working_capital",
    "desiredFundingAmount": 125000,
    "redFlags": ["none"]
  }
}
```

## Response sections

The report response may include:

- title
- generated timestamp
- applicant summary
- public readiness result
- readiness summary section
- strengths
- caution areas
- documents to prepare
- recommended next steps
- Markdown version
- safety disclaimer

## Recommended GPT summary format

When a Custom GPT uses this API, summarize:

1. Current readiness tier
2. Strongest positive signals
3. Caution areas
4. Documents to prepare
5. Recommended next step
6. Human review note

## Safety language

Use:

```txt
This guidance is educational and review-oriented. It is not an approval, offer, underwriting decision, or guarantee of funding.
```

## Related examples

```txt
/examples/api/readiness-report-request.json
/examples/api/readiness-report-response.json
```
