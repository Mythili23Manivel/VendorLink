# AI Assistant Explanation Logic

The AI Assistant uses **rule-based intelligent logic** (no external paid APIs). It parses natural language queries and routes them to specialized handlers.

## Query Routing

| Query Pattern | Handler | Example |
|---------------|---------|---------|
| "why" + "delayed/delay" | explainVendorDelay | "Why is Vendor A delayed?" |
| "mismatch" + "above/over/%" | getVendorsWithMismatchAbove | "Show vendors with mismatch above 10%" |
| "high risk" | getHighRiskVendors | "Which vendor is high risk?" |
| "predict" + "payment/risk" | predictPaymentRisk | "Predict next payment risk" |
| "summary/overview/dashboard" | getDashboardSummary | "Dashboard overview" |
| "top" + "vendor/performing" | getTopPerformingVendors | "Top performing vendors" |
| "delayed/overdue" | getDelayedVendors | "Delayed vendors" |
| Fallback | getGeneralInsights | Any other query |

## Handlers

### explainVendorDelay
- Extracts vendor name from query (e.g., "Vendor A", "TechSupplies")
- Finds vendors matching name or with delayRate > 0
- Fetches overdue and pending payments per vendor
- Generates human-readable explanation: delay rate, overdue count, pending count

### getVendorsWithMismatchAbove
- Extracts numeric threshold from query (default 10%)
- Returns vendors where mismatchRate >= threshold
- Includes risk score for each

### getHighRiskVendors
- Uses risk score formula (see RISK_SCORE_FORMULA.md)
- Returns vendors with riskScore >= 50
- Sorted by risk score descending

### predictPaymentRisk
- Finds payments due within 7 days
- Calculates risk score per vendor
- Predicts: High/Medium/Low probability of delay based on score

### getDashboardSummary
- Aggregates: total vendors, pending payments, invoice mismatches
- Top performers (by rating)
- Delayed vendors (delayRate > 0)
- Risk vendors (score >= 50)

## Response Format

All handlers return:

```json
{
  "type": "explanation|list|prediction|summary|general",
  "query": "original query",
  "response": "Human-readable explanation",
  "data": [] // Structured data (array or object)
}
```
