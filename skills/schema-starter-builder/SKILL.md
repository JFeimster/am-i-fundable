# Schema Starter Builder

## Purpose

Create practical starter JSON Schemas for product registries, agent cards, tool catalogs, workflow specs, and static-site data.

This skill favors useful constraints over over-engineered schema cosplay.

## When to Use

Use this skill when creating or revising:

- Product registry schemas
- Funding product schemas
- Agent schemas
- Custom GPT schemas
- Vercel project registry schemas
- Site-data schemas
- Workflow metadata schemas

## Inputs

- Schema purpose
- Example object
- Required fields
- Optional fields
- Visibility class
- Consumers, such as browser, build script, API route, GPT, or internal workflow
- Validation strictness

## Procedure

1. Identify the smallest object shape that supports the use case.
2. Separate required fields from optional metadata.
3. Add `additionalProperties: false` when the consumer needs strictness.
4. Add enums only for fields that should stay controlled.
5. Add regex patterns for slugs and IDs where useful.
6. Add descriptions that explain operational intent.
7. Add a compact valid example when helpful.
8. Keep private fields out of public schemas.

## Guardrails

- Do not include secrets, tokens, private URLs, commissions, or partner contacts.
- Do not overfit the schema to a single current file if the registry is expected to grow.
- Do not make every field required just because it exists today.
- Do not use schema constraints that block reasonable future products.

## Validation Checklist

Confirm:

- JSON is valid.
- Required fields are minimal but sufficient.
- Slugs are constrained.
- Visibility is explicit.
- Public-safe schemas do not invite private data.
- The schema can support at least three plausible future entries.

## Done Means

The schema is valid, readable, strict enough to prevent garbage, and flexible enough to avoid becoming admin quicksand.
