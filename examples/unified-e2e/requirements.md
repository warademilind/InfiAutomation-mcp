# Synthetic order journey

These are demonstration requirements, not requirements for a real product.

- ORDER-01: Creating an order through REST returns HTTP 201, a unique ID and status `created`.
- ORDER-02: Reading the same ID through REST, the browser and SQLite shows the same product and status.
- SOAP-01: The SOAP Add operation returns 5 for inputs 2 and 3 without a SOAP Fault.
- UX-01: The order page has no detected WCAG A/AA violations under the selected axe rules. Human accessibility review is still required.
- UX-02: The order page has no horizontal overflow at a 390 by 844 CSS-pixel viewport.
- PERF-01: API responses and SQLite reads complete within 2000 ms; DOMContentLoaded completes within 3000 ms on this local demonstration machine. These illustrative limits are not service-level agreements.

Do: use synthetic data, loopback services, explicit assertions and read-only database verification. Close inspection sessions before execution.

Don't: access production, issue database writes through test adapters, follow API redirects, publish credentials, weaken assertions, or approve visual baselines automatically.

The local fixture performs its own authorized INSERT when the API is called. The database test adapter only reads that state.
