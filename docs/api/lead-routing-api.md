# Lead Routing API

Lead routing routes create public-safe route categories and status summaries.

They do not choose private providers, expose partner routing, or return private CRM records.

## Routes

```txt
POST /api/leads/create-lead
POST /api/leads/update-lead-status
POST /api/leads/route-lead
```

## Route categories

Allowed public-safe route categories include:

- `fast_follow_up`
- `standard_follow_up`
- `funding_strategy_review`
- `readiness_nurture`
- `document_request`

## Create lead

Route:

```txt
POST /api/leads/create-lead
```

Creates a demo/server-safe lead summary from applicant data and scorecard answers.

Expected next outputs:

- `leadId`
- public readiness result
- queue category
- next action
- demo persistence note

## Update lead status

Route:

```txt
POST /api/leads/update-lead-status
```

Updates demo status and returns safe next-step guidance.

Allowed statuses:

```txt
received
scorecard_completed
manual_review_needed
strategy_review_ready
documents_requested
nurture_started
review_complete
archived_demo
```

## Route lead

Route:

```txt
POST /api/leads/route-lead
```

Returns a public-safe route summary from scorecard answers.

Example route response:

```json
{
  "queue": "standard_follow_up",
  "priority": "warm",
  "nextAction": "funding_path_summary",
  "nextPage": "/results.html",
  "tasks": [
    "Summarize public-safe funding path",
    "Request missing documents",
    "Offer human review"
  ]
}
```

## Do not return

Lead routes must not return:

- private CRM IDs from production systems
- private routing notes
- partner/provider selection details
- partner economics
- internal underwriting notes
- credentials
