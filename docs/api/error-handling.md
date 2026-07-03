# API Error Handling

The API should return consistent public-safe error responses.

## Standard error shape

```json
{
  "ok": false,
  "error": {
    "code": "validation_error",
    "message": "Request validation failed.",
    "requestId": "err_0000000000000",
    "details": [
      {
        "field": "answers.monthlyRevenue",
        "message": "monthlyRevenue is required."
      }
    ]
  },
  "disclaimer": "This guidance is educational and review-oriented. It is not an approval, offer, underwriting decision, or guarantee of funding."
}
```

## Suggested status codes

| Status | Meaning |
|---:|---|
| `200` | Successful request. |
| `201` | Review request created/queued. |
| `204` | OPTIONS preflight success. |
| `400` | Malformed JSON or bad request. |
| `405` | Method not allowed. |
| `422` | Validation failed. |
| `500` | Server or public-boundary failure. |

## Error codes

| Code | Meaning |
|---|---|
| `bad_request` | Request body was missing or invalid JSON. |
| `method_not_allowed` | HTTP method not supported for route. |
| `validation_error` | Payload shape or required fields failed. |
| `public_boundary_violation` | Route attempted to return sensitive/private data. |
| `internal_error` | Unexpected server error. |

## Do not leak internals

Error responses should not include:

- stack traces
- internal file paths
- provider names
- hidden routing rules
- private registry contents
- secrets
- raw webhook URLs

## Good error copy

Use:

```txt
Request validation failed.
Unable to complete request.
Public response failed safety boundary review.
```

Avoid:

```txt
Lender denied.
Provider rejected.
Underwriting failed.
You do not qualify.
```
