# Automation Workflow Spec Writer

## Purpose

Write implementation-ready workflow specifications for funding intake, scorecard routing, follow-up, CRM updates, human review, and partner-safe handoffs.

The goal is to produce specs that a builder can actually implement without decoding mystical consultant fog.

## When to Use

Use this skill for:

- n8n workflow specs
- Make scenario specs
- Zapier workflow specs
- CRM routing maps
- Lead intake workflows
- Human review queues
- Notification and nurture flows
- Webhook payload docs

## Inputs

- Trigger event
- Source system
- Destination system
- Payload shape
- Required fields
- Decision rules
- Error handling requirements
- Human review checkpoints
- Visibility/privacy level

## Procedure

1. Define the trigger in one sentence.
2. List required input fields.
3. Define the normalized payload.
4. Map decision rules by priority.
5. Add failure paths and retry behavior.
6. Add human review checkpoints.
7. Add logging requirements without storing sensitive data unnecessarily.
8. Add test cases with sample payloads.
9. Add final implementation notes.

## Guardrails

- Never include production credentials.
- Never include private partner URLs or apply links in public workflow docs.
- Do not imply automated approval or underwriting.
- Do not route sensitive lead data to browser-visible files.
- Keep public examples fictional and clearly synthetic.

## Validation Checklist

Confirm:

- Trigger is clear.
- Required fields are listed.
- Payload is valid JSON or documented clearly.
- Decision rules are deterministic.
- Manual review exists where risk is high.
- Error path is not “shrug and pray.”
- Sensitive data handling is explicit.

## Done Means

A competent builder can implement the workflow from the spec without needing five clarification calls and a séance.
