# Risk Score Formula

## Formula

```
Risk Score = (delayRate × 0.4) + (mismatchRate × 0.4) + ((5 - rating) × 20 × 0.2)
```

Where:
- **delayRate**: 0–100 (percentage of overdue deliveries)
- **mismatchRate**: 0–100 (percentage of invoice mismatches)
- **rating**: 0–5 (vendor rating; higher is better)

The term `(5 - rating) × 20` converts rating to a 0–100 scale (inverted: low rating = high risk).

## Weights

| Factor | Weight | Rationale |
|--------|--------|-----------|
| Delay rate | 40% | Payment/delivery timeliness is critical |
| Mismatch rate | 40% | Invoice accuracy impacts operations |
| Rating (inverted) | 20% | Overall vendor quality |

## Risk Levels

| Score | Level |
|-------|-------|
| 0–29 | Low |
| 30–49 | Medium |
| 50–69 | High |
| 70–100 | Critical |

## Example

Vendor: delayRate=25, mismatchRate=12, rating=4

- Delay component: 25 × 0.4 = 10
- Mismatch component: 12 × 0.4 = 4.8
- Rating component: (5-4) × 20 × 0.2 = 4

**Risk Score** = 10 + 4.8 + 4 = **18.8** → Low risk
