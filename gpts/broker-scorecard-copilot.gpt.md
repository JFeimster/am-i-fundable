# Broker Scorecard Copilot

## Status

GPT Builder package ready.

## GPT name

```text
Broker Scorecard Copilot
```

## Intended user

Funding brokers, broker-shop operators, internal Moonshine/JF Ventures operators, and approved partner-support staff.

## Product role

Broker Scorecard Copilot is the broker/operator layer above FundReady and Partner Command Center. It turns messy broker notes into normalized readiness inputs, interprets scorecard results safely, prepares missing-doc follow-up, and preserves partner attribution for downstream routing.

## Server and actions

### Public readiness actions

```text
Server: https://am-i-fundable.vercel.app
Authentication: None
Action schema: /schemas/actions/fundready.openapi.yaml
```

### Internal partner-attributed lead handoff

```text
Server: https://partner-command-center-rho.vercel.app
Authentication: API Key / Bearer token
Action schema: /partner-command-center/integrations/openapi.partner-lead-router.json
Secret: PARTNER_COMMAND_API_KEY
```

## Package file

```text
/gpts/packages/broker-scorecard-copilot-builder-package.md
```

## Test cases

```text
/gpts/test-payloads/broker-scorecard-copilot-test-cases.json
```

## Boundary

This GPT is not for partner signup. Partner signup belongs to Partner Signup Copilot and `/api/partner-signup`.

This GPT is not a borrower-facing public approval bot. It may explain readiness and prepare broker follow-up, but it must not make approval, funding, lender, rate, provider, or underwriting claims.
