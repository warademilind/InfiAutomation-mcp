# Synthetic order: cross-layer verification

Verify a synthetic order through REST, browser and SQLite; SOAP addition and bounded automated UX checks.

Target: mixed

## Source documents

- e2e-demo/requirements.md (SHA-256 5a62156ad063396bf2fc25ce08b2fccf6fc6ae19458bf9ff63a3024257cfe4ec)

## Requirements

- **ORDER-01** Create an order through REST
  - Acceptance: HTTP 201
  - Acceptance: Unique ID
  - Acceptance: Status is created
- **ORDER-02** Order ID, product and status match across API, browser and SQLite; unknown orders return documented 404
- **SOAP-01** SOAP Add returns 5 for 2 and 3 without a fault
- **UX-01** No detected violations under the selected axe WCAG A/AA rules
- **UX-02** No horizontal overflow at 390 by 844 CSS pixels
- **PERF-01** API and query checks meet the illustrative local timing thresholds

## Open questions

- Production business rules and performance budgets are outside this synthetic example
- Manual accessibility and usability review remains necessary

## Risks

- Recorded times are single local observations, not load-test percentiles
- Screenshots can contain application data

## Scenarios

### TC-001 - Create and verify an order across layers

Priority: critical | Requirements: ORDER-01, ORDER-02, UX-01, UX-02, PERF-01

Preconditions: Fresh application session

1. POST synthetic order and capture ID
2. GET captured ID
3. Assert same ID and status in browser
4. SELECT same ID with a bound parameter
5. Check mobile layout, accessibility and browser performance

Expected: Matching values, zero selected-rule axe violations, no overflow and timing limits satisfied

### TC-002 - SOAP addition

Priority: normal | Requirements: SOAP-01

Preconditions: Fresh application session

1. POST SOAP 1.1 Add with 2 and 3
2. Assert status and AddResult

Expected: HTTP 200, result 5, no SOAP Fault

### TC-003 - Unknown order

Priority: normal | Requirements: ORDER-02

Preconditions: Fresh application session

1. GET missing synthetic ID

Expected: HTTP 404 with Order not found

## Scenario coverage gaps

Every supplied requirement maps to at least one planned scenario. Execution and acceptance still need verification.

## Observation provenance

No live snapshot attached. Inspect the running app before generating executable locators.

## Cross-layer scope

- Create and verify an order across layers: api, web, database, ux
- SOAP addition: api
- Unknown order: api

## API document provenance

dd6b472f04a7880012cd20a208845008e4b205788d7db06fcda9b21b35bfc116
68cb9ea86f8ccc653404b29093f8036bfbd2dafdcafe9451838a1d552fe45a41

## Execution policy

```json
{
  "dos": [
    "Use synthetic data",
    "Verify explicit expected outcomes"
  ],
  "donts": [
    "Do not access production",
    "Do not execute database writes"
  ],
  "allowedOrigins": [
    "http://127.0.0.1:47831"
  ],
  "allowedMethods": [
    "GET",
    "POST"
  ],
  "deniedTargets": [],
  "deniedUiActions": [],
  "captureScreenshots": true,
  "redactKeys": []
}
```

Structured restrictions are enforced by schemaVersion 2 execution. Natural-language do/don't notes must be translated into supported restrictions and explicit assertions; unresolved rules need review.
