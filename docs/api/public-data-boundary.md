# Public API Data Boundary

The Am I Fundable API must enforce a strict public/private data boundary.

## Public-safe output may include

- score
- readiness tier
- lead priority
- generic funding family labels
- public-safe funding path descriptions
- document checklist items
- educational resources
- manual review recommendation
- next steps
- public disclaimers

## Public output must not include

- provider names
- provider IDs
- lender names
- lender IDs
- affiliate URLs
- apply URLs
- referral URLs
- commission data
- payout data
- private contacts
- contact emails
- partner notes
- underwriting notes
- routing notes
- internal match scores tied to provider identity
- credentials or secrets
- real borrower PII beyond the user-submitted context needed for a review request

## Server-side-only data

Internal registries may be used by server-side routes, but raw entries must never be returned directly.

Examples:

```txt
/internal/providers/funding-providers.registry.json
/internal/products/funding-products.registry.json
/internal/routing/**
/internal/crm/**
```

Public routes should transform internal data into generic categories such as:

- Fast Working Capital
- Business Line of Credit
- Structured Growth Capital
- Equipment / Truck / Asset-Backed Funding
- Real Estate / Asset-Secured Capital
- Ecommerce / Marketplace Seller Capital
- Business Credit Builder / Funding Prep
- Manual Funding Strategy Review

## Boundary check pattern

Each public route should follow this pattern:

```txt
1. Parse request.
2. Validate inputs.
3. Use internal logic server-side if needed.
4. Convert to public-safe response shape.
5. Remove sensitive fields.
6. Scan for restricted fields or phrases.
7. Return response with disclaimer.
```

## Required disclaimer

Use language similar to:

```txt
This guidance is educational and review-oriented. It is not an approval, offer, underwriting decision, or guarantee of funding.
```
