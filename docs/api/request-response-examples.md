# API Request / Response Examples

This file points to example payloads under `/examples/api`.

## Scorecard submit — hot lead

Request:

```txt
/examples/api/scorecard-submit-request.hot.json
```

Response:

```txt
/examples/api/scorecard-submit-response.hot.json
```

Use this example for a stronger profile with meaningful revenue, operating history, clean bank activity, and no caution flags.

## Funding paths response

```txt
/examples/api/funding-paths-response.json
```

Use this example to understand the public-safe shape returned by funding path routes.

The response includes generic funding categories only. It does not include:

- provider names
- provider IDs
- apply links
- affiliate links
- commission data
- private routing notes

## Document checklist response

```txt
/examples/api/document-checklist-response.json
```

Use this example for funding-document preparation flows.

## Readiness report

Request:

```txt
/examples/api/readiness-report-request.json
```

Response:

```txt
/examples/api/readiness-report-response.json
```

Use this for report-generation integrations and Custom GPT Actions.

## Error response

```txt
/examples/api/error-response.validation.json
```

Use this to standardize validation-error handling.

## Testing with curl

Example health check:

```bash
curl https://am-i-fundable.vercel.app/api/health
```

Example report generation:

```bash
curl -X POST https://am-i-fundable.vercel.app/api/scorecard/generate-readiness-report \
  -H "Content-Type: application/json" \
  --data @examples/api/readiness-report-request.json
```

## Testing with Custom GPT Actions

Use:

```txt
/schemas/openapi/am-i-fundable.public-actions.openapi.yaml
```

Then test these operations first:

1. `getHealth`
2. `listPublicFundingPaths`
3. `getDocumentChecklist`
4. `generateReadinessReport`
5. `matchFundingPaths`
