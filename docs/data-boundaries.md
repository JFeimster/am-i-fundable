# Data Boundaries

## Purpose

The Funding Readiness Scorecard should give visitors useful guidance without exposing private provider, partner, routing, or lead data.

## Visibility classes

| Class | Browser exposure | Use |
|---|---:|---|
| `public_runtime_browser_safe` | Yes | Public copy, funding lane labels, FAQs, document checklist labels, consent copy, safe result explanations |
| `public_build_time_only` | Rendered output only | SEO data, page sections, route metadata, non-sensitive category metadata |
| `server_side_internal` | No | Product thresholds, provider fit rules, CRM routing, lead priority rules, manual review triggers |
| `restricted_internal_no_repo` | No | Borrower records, production CRM exports, partner PII, private notes, secrets |

## Public-safe paths

```txt
/data/*.public.json
/config/*.json
/lib/*.js
```

## Internal-only paths

```txt
/internal/**
/api/**
/workflows/**
```

## Never expose publicly

- Affiliate portal URLs
- Private apply URLs
- Commission rates
- Contact emails
- Partner key contacts
- Raw provider routing rules
- Manual review notes
- Borrower records or production lead data
- Secrets, tokens, API keys, or webhook signing values

## Result language boundary

The frontend can explain readiness, likely funding lanes, possible blockers, and recommended next steps. The backend can perform private matching and routing.

The tool must not present a final lending decision, final eligibility, pricing promise, or underwriting outcome.
