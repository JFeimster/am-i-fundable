# Webhook Events

This document defines the public-safe webhook event layer for Am I Fundable.

Webhook routes in this repo are lightweight acknowledgement endpoints. They validate payload shape and return safe acknowledgement responses. They do not expose private routing, provider selection, or partner economics.

## Routes

```txt
POST /api/webhooks/scorecard-submitted
POST /api/webhooks/review-requested
POST /api/webhooks/lead-routed
```

## Event taxonomy

| Event | Route | Purpose |
|---|---|---|
| `scorecard.submitted` | `/api/webhooks/scorecard-submitted` | A scorecard result or submission is ready for follow-up handling. |
| `review.requested` | `/api/webhooks/review-requested` | A human funding strategy review was requested. |
| `lead.routed` | `/api/webhooks/lead-routed` | A lead was assigned to a public-safe route category. |

## Standard event shape

```json
{
  "eventId": "evt_demo_001",
  "eventType": "scorecard.submitted",
  "subjectId": "frs_result_demo_001",
  "occurredAt": "2026-07-03T15:32:11.000Z"
}
```

## Scorecard submitted example

```json
{
  "eventId": "evt_scorecard_demo_001",
  "eventType": "scorecard.submitted",
  "subjectId": "frs_result_demo_001",
  "resultId": "frs_result_demo_001",
  "occurredAt": "2026-07-03T15:32:11.000Z"
}
```

## Review requested example

```json
{
  "eventId": "evt_review_demo_001",
  "eventType": "review.requested",
  "reviewId": "review_demo_001",
  "occurredAt": "2026-07-03T15:32:11.000Z"
}
```

## Lead routed example

```json
{
  "eventId": "evt_route_demo_001",
  "eventType": "lead.routed",
  "leadId": "lead_demo_001",
  "routeType": "standard_follow_up",
  "occurredAt": "2026-07-03T15:32:11.000Z"
}
```

## Safe acknowledgement response

Webhook routes should return:

```json
{
  "ok": true,
  "accepted": true,
  "eventId": "evt_demo_001",
  "eventType": "scorecard.submitted",
  "receivedAt": "2026-07-03T15:32:11.000Z",
  "message": "Event received."
}
```

## Do not return

Webhook responses must not return:

- private provider details
- partner economics
- private routing notes
- private CRM fields
- raw scorecard payloads with real applicant data
- credentials
