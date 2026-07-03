# Manual Review API

The manual review API determines whether a scorecard result needs human context before a user receives deeper guidance.

Route:

```txt
POST /api/match/manual-review
```

## Purpose

Use this route when:

- score signals are mixed
- caution flags are present
- requested amount is high relative to revenue signal
- credit signal may need context
- the scorecard result recommends human review

## Request

```json
{
  "answers": {
    "businessPersona": "local_service_business",
    "monthlyRevenue": 25000,
    "timeInBusinessMonths": 18,
    "creditScore": 640,
    "bankStatus": "consistent",
    "businessStructure": "entity_with_bank",
    "fundingPurpose": "working_capital",
    "desiredFundingAmount": 75000,
    "redFlags": ["none"]
  }
}
```

## Response

The route returns:

- review status
- score
- tier
- whether review is recommended
- public-safe reason list
- recommended queue
- next step
- disclaimer

## Example status values

```txt
manual_review_recommended
standard_strategy_review_available
```

## Good reasons

Examples of safe reason text:

- Scorecard result recommends human review.
- A caution flag needs human context.
- Requested amount is high relative to monthly revenue signal.
- Credit signal may limit some paths and should be reviewed carefully.

## Safety boundary

Manual review is not a decline, commitment, underwriting outcome, or provider decision. It is a routing recommendation for human context.
